import * as React from 'react';
import { Center, Group, Loader, Paper, useMantineTheme } from '@mantine/core';

interface Props {
    canvasElementRef: React.MutableRefObject<any>;
    isRelatedOpened?: boolean;
    isLoading?: boolean;
}

export function Canvas({ canvasElementRef, isRelatedOpened = false, isLoading = false }: Props) {
    const theme = useMantineTheme();

    return (
        <Group sx={{ flex: 1, minWidth: 0 }}>
            <Paper
                shadow="xl"
                withBorder
                ref={canvasElementRef}
                id="snapshoot"
                style={
                    {
                        backgroundColor: (
                            theme.colorScheme === 'dark'
                                ? theme.colors.dark[8]
                                : theme.colors.gray[1]
                        ),
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                    }
                }
            >
                {isLoading && (
                    <Center
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 10,
                        }}
                    >
                        <Loader size="xl" />
                    </Center>
                )}
                <canvas style={{ width: '100%' }} id="2d" />
            </Paper>
        </Group>
    );
}
