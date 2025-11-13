/* eslint-disable react/prop-types,no-await-in-loop */
import * as mCore from '@mantine/core';
import { Title, Text, Group, Stack, Button, Paper, Checkbox, useMantineTheme } from '@mantine/core';
import * as React from 'react';
import queryString from 'query-string';
import { useForm } from '@mantine/form';
import { useRef, useState } from 'react';

import { log } from '@shared/utils';
import { IInput, ITask } from '@admin/components/Tasks/tasksList';
import { useSubpageEffect } from '@shared/hooks';

export default function Task({ item }: { item: ITask }) {
    useSubpageEffect(`Task: ${item.label}`);

    const [outputField, setOutputField] = useState('');
    const [autoScrollChecked, setAutoScrollChecked] = useState(true);
    const outputRef = useRef<HTMLTextAreaElement>(null);
    const autoScrollRef = useRef<HTMLInputElement>(null);
    const stopRef = useRef<HTMLButtonElement>(null);
    const theme = useMantineTheme();

    interface IOptions {
        [key: string]: string | number | boolean;
    }

    async function handleTask(name: string, opts: IOptions) {
        const queryParams = queryString.stringify(opts);
        const ctrl = new AbortController();

        fetch(
            `/v1/tasks/task_${name}?${queryParams}`,
            { signal: ctrl.signal },
        )
            .then((response) => response.body)
            .then((rs: any) => {
                const reader = rs.getReader();
                stopRef.current!.onclick = async () => {
                    ctrl.abort();
                    await setOutputField((prev) => `${prev}\nTask Aborted`);
                    outputRef.current!.scrollTop = outputRef.current!.scrollHeight;
                };
                return new ReadableStream({
                    async start(controller) {
                        // eslint-disable-next-line no-constant-condition
                        while (true) {
                            const { done, value } = await reader.read();
                            if (done) {
                                break;
                            }
                            await setOutputField((prev) => prev + (new TextDecoder()).decode(value));
                            if (autoScrollRef.current!.checked) {
                                outputRef.current!.scrollTop = outputRef.current!.scrollHeight;
                            }
                            log.debug(new TextDecoder().decode(value));

                            controller.enqueue(value);
                        }

                        controller.close();
                        reader.releaseLock();
                    },
                });
            });
    }

    const clearOutput = () => {
        setOutputField('');
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
        (input: IInput) => React.createElement(
            // @ts-ignore
            mCore[input.type],
            {
                label: input.label,
                name: input.name,
                key: input.name,
                mt: 10,
                ...form.getInputProps(input.name),
            },
        ),
    );
    return (
        <Paper p={10}>
            <Title order={3} mb="sm">{item.label}</Title>
            <Text size="sm">{item.description}</Text>
            <Stack mt={15}>
                <form
                    onSubmit={
                        form.onSubmit((values) => handleTask(item.name, values))
                    }
                >
                    {Inputs}
                    <Group mt={20}>
                        <Button size="sm" type="submit">Start Task</Button>
                        <Button ref={stopRef} size="sm" color="red">StopTask</Button>
                        <Button size="sm" variant="outline" onClick={clearOutput}>Clear Output</Button>
                        <Checkbox
                            ref={autoScrollRef}
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
