import * as React from 'react';
import { Group, Paper, useMantineTheme } from '@mantine/core';

interface Props {
    related: any
    canvasElementRef: React.MutableRefObject<any>
}

export function Canvas({ related, canvasElementRef }: Props) {
    const theme = useMantineTheme();

    return (
        <Group sx={{ width: related.opened ? '90%' : '100%' }}>
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
                <canvas style={{ width: '100%' }} id="2d" />
            </Paper>
        </Group>
    );
}
