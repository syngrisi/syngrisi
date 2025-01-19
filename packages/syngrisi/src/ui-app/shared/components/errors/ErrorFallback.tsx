/* eslint-disable react/jsx-indent,react/jsx-one-expression-per-line */
import * as React from 'react';
import { Group, Title, Button, Text, Paper, Stack, CopyButton } from '@mantine/core';
import { useState } from 'react';
import { IconRefresh } from '@tabler/icons';

export function ErrorFallback({ error, resetErrorBoundary }: { error: any, resetErrorBoundary: any }) {
    const [errorDetails] = useState(
        `URL: ${window.location.href}
Message: ${error.message}
Stack Trace: ${error.stack}`,
    );
    return (
        <Paper role="alert" p="md">
            <Title>Something went wrong</Title>

            <Stack align="center" spacing={8}>
                <Text size="lg" align="center">Try to:</Text>

                <Group position="center">
                    <Button
                        leftIcon={<IconRefresh />}
                        variant="outline"
                        size="md"
                        onClick={() => {
                            resetErrorBoundary();
                            window.location.reload();
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
                            document.location.href = '/';
                        }}
                    >
                        Go to main page
                    </Button>
                </Group>
                <Group position="left" pt={30} w="100%">
                    <Text>Error Details:</Text>
                </Group>
                <Paper withBorder p="sm" style={{ backgroundColor: 'black', width: '100%' }}>
                    <Text style={{ color: 'white', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {errorDetails}
                    </Text>
                </Paper>
            </Stack>
            <Group position="center" mt="md">
                <CopyButton value={errorDetails} timeout={2000}>
                    {({ copied, copy }) => (
                        <Button color={copied ? 'teal' : 'blue'} onClick={copy}>
                            {copied ? 'Copied!' : 'Copy Error Details'}
                        </Button>
                    )}
                </CopyButton>
            </Group>
        </Paper>
    );
}
