/* eslint-disable react/prop-types,no-await-in-loop */
import * as mCore from '@mantine/core';
import { Title, Text, Group, Stack, Button, Paper, Checkbox, useMantineTheme, Badge, Alert } from '@mantine/core';
import * as React from 'react';
import { stringify } from '@shared/utils/queryParams';
import { useForm } from '@mantine/form';
import { useRef, useState, useEffect } from 'react';

import { log } from '@shared/utils';
import { IInput, ITask } from '@admin/components/Tasks/tasksList';
import { useSubpageEffect } from '@shared/hooks';

type TaskStatus = 'idle' | 'running' | 'completed' | 'error' | 'aborted';

const VALID_MANTINE_INPUTS = ['TextInput', 'NumberInput', 'Checkbox', 'Select', 'Textarea'];

export default function Task({ item }: { item: ITask }) {
    useSubpageEffect(`Task: ${item.label}`);

    const [outputField, setOutputField] = useState('');
    const [autoScrollChecked, setAutoScrollChecked] = useState(true);
    const [taskStatus, setTaskStatus] = useState<TaskStatus>('idle');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const outputRef = useRef<HTMLTextAreaElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const theme = useMantineTheme();

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    interface IOptions {
        [key: string]: string | number | boolean;
    }

    async function handleTask(name: string, opts: IOptions) {
        const queryParams = stringify(opts);
        const ctrl = new AbortController();
        abortControllerRef.current = ctrl;

        setTaskStatus('running');
        setErrorMessage('');
        setOutputField('');

        try {
            const response = await fetch(
                `/v1/tasks/task_${name}?${queryParams}`,
                { signal: ctrl.signal },
            );

            if (!response.ok) {
                let errorDetails = `HTTP ${response.status}: ${response.statusText}`;
                try {
                    const errorText = await response.text();
                    if (errorText) {
                        errorDetails += `\n\nResponse: ${errorText}`;
                    }
                } catch (e) {
                    // Could not read response body
                }
                throw new Error(errorDetails);
            }

            if (!response.body) {
                throw new Error('Response body is empty');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            // eslint-disable-next-line no-constant-condition
            while (true) {
                const { done, value } = await reader.read();

                if (done) {
                    break;
                }

                const chunk = decoder.decode(value, { stream: true });

                setOutputField((prev) => prev + chunk);

                if (autoScrollChecked && outputRef.current) {
                    outputRef.current.scrollTop = outputRef.current.scrollHeight;
                }

                log.debug(chunk);
            }

            reader.releaseLock();
            setTaskStatus('completed');
        } catch (error: any) {
            if (error.name === 'AbortError') {
                setOutputField((prev) => `${prev}\n\nTask Aborted by user`);
                setTaskStatus('aborted');
                log.warn('Task was aborted by user');
            } else {
                // Detailed error message
                let errorMsg = 'Unknown error occurred';
                let errorDetails = '';

                if (error.message) {
                    errorMsg = error.message;
                }

                // Add error type and stack for network/server errors
                if (error.name === 'TypeError' && error.message.includes('fetch')) {
                    errorMsg = 'Network Error: Failed to connect to server';
                    errorDetails = '\n\nPossible causes:\n' +
                        '- Server is not running or crashed\n' +
                        '- Server ran out of memory (check server logs)\n' +
                        '- Network connectivity issues\n' +
                        '- CORS or firewall blocking the request';
                }

                // Add stack trace if available (for development)
                if (error.stack) {
                    errorDetails += `\n\nStack trace:\n${error.stack}`;
                }

                const fullError = errorMsg + errorDetails;
                setErrorMessage(errorMsg);
                setOutputField((prev) => `${prev}\n\n=== ERROR ===\n${fullError}\n=============`);
                setTaskStatus('error');
                log.error('Task error:', { error, message: errorMsg, details: errorDetails });
            }
        } finally {
            abortControllerRef.current = null;
        }
    }

    const stopTask = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
    };

    const clearOutput = () => {
        setOutputField('');
        setErrorMessage('');
        if (taskStatus !== 'running') {
            setTaskStatus('idle');
        }
    };

    const formInitialValues: IOptions = {};
    item.inputs.forEach(
        (input: IInput) => {
            formInitialValues[input.name] = input.default;
        },
    );

    const form = useForm({
        initialValues: formInitialValues,
    });

    const Inputs = item.inputs.map(
        (input: IInput) => {
            if (!VALID_MANTINE_INPUTS.includes(input.type)) {
                log.error(`Invalid input type: ${input.type}`);
                return (
                    <Alert key={input.name} color="red" mt={10}>
                        Invalid input type: {input.type}
                    </Alert>
                );
            }

            const inputProps = input.type === 'Checkbox'
                ? form.getInputProps(input.name, { type: 'checkbox' })
                : form.getInputProps(input.name);

            return React.createElement(
                // @ts-ignore
                mCore[input.type],
                {
                    label: input.label,
                    name: input.name,
                    key: input.name,
                    mt: 10,
                    ...inputProps,
                },
            );
        },
    );

    const getStatusBadge = () => {
        const statusConfig: Record<TaskStatus, { color: string; label: string }> = {
            idle: { color: 'gray', label: 'Ready' },
            running: { color: 'blue', label: 'Running' },
            completed: { color: 'green', label: 'Completed' },
            error: { color: 'red', label: 'Error' },
            aborted: { color: 'orange', label: 'Aborted' },
        };

        const config = statusConfig[taskStatus];
        return <Badge color={config.color}>{config.label}</Badge>;
    };

    return (
        <Paper p={10}>
            <Group position="apart" mb="sm">
                <Title order={3}>{item.label}</Title>
                {getStatusBadge()}
            </Group>
            <Text size="sm" data-test="task-description">{item.description}</Text>
            {errorMessage && (
                <Alert color="red" mt={10}>
                    {errorMessage}
                </Alert>
            )}
            <Stack mt={15}>
                <form
                    onSubmit={
                        form.onSubmit((values) => handleTask(item.name, values))
                    }
                >
                    {Inputs}
                    <Group mt={20}>
                        <Button
                            size="sm"
                            type="submit"
                            disabled={taskStatus === 'running'}
                            data-test="task-start-button"
                        >
                            Start Task
                        </Button>
                        <Button
                            size="sm"
                            color="red"
                            onClick={stopTask}
                            disabled={taskStatus !== 'running'}
                        >
                            Stop Task
                        </Button>
                        <Button size="sm" variant="outline" onClick={clearOutput}>Clear Output</Button>
                        <Checkbox
                            label="Auto Scroll"
                            onChange={(event) => setAutoScrollChecked(event.target.checked)}
                            checked={autoScrollChecked}
                        />
                    </Group>
                </form>
                <textarea
                    readOnly
                    ref={outputRef}
                    style={
                        {
                            marginTop: '0px',
                            marginBottom: '0px',
                            width: '100%',
                            height: '50vh',
                            color: 'white',
                            fontSize: '1rem',
                            padding: '10px',
                            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.dark[6],
                        }
                    }
                    value={outputField}
                />
            </Stack>
        </Paper>
    );
}
