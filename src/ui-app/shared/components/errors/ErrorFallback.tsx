/* eslint-disable react/jsx-indent,react/jsx-one-expression-per-line */
import * as React from 'react';
import { Group, Title, Button, Text, Paper, Stack, CopyButton } from '@mantine/core';
import { useState } from 'react';

export function ErrorFallback({ error, resetErrorBoundary }: { error: any, resetErrorBoundary: any }) {
    const [errorDetails] = useState(
        `Url: ${window.location.href}\n`
        + `Message: ${error.message}\n`
        + `Stacktrace: ${error.stack}\n`,
    );
    return (
        <Paper role="alert">
            <Title>Something went wrong</Title>

            <Stack align="center" spacing={8}>
                <Text size="lg" align="center">Try to:</Text>

                <Group position="center">
                    <Button
                        variant="outline"
                        size="md"
                        onClick={() => {
                            resetErrorBoundary();
                            // @ts-ignore
                            window.navigation.reload();
                        }}
                    >
                        Refresh
                    </Button>
                    <Text size="lg" align="center">
                        or
                    </Text>
                    <Button
                        variant="outline"
                        size="md"
                        onClick={() => {
                            resetErrorBoundary();
                            document.location = '/index2/';
                        }}
                    >
                        Go to main page
                    </Button>
                </Group>
                <Group position="left" pt={30}>
                    <Text>Error Details:</Text>
                </Group>
                <pre style={{ backgroundColor: 'black', color: 'white', padding: '10px' }}>
                    {errorDetails}
                </pre>
            </Stack>
            <Group position="center">
                <CopyButton value={errorDetails}>
                    {({ copied, copy }) => (
                        <Button color={copied ? 'teal' : 'blue'} onClick={copy}>
                            {copied ? 'Copied' : 'Copy Error Details'}
                        </Button>
                    )}
                </CopyButton>
            </Group>

        </Paper>
    );
}
