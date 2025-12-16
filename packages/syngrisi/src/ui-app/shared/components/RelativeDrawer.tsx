import React, { CSSProperties } from 'react';
import { ActionIcon, Box, Group, Paper, Text, Transition } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

interface Props {
    children: any,
    title?: string,
    width?: string | number,
    open?: boolean,
    setOpen: any,
}

function RelativeDrawer(
    {
        children,
        title = '',
        open = false,
        setOpen,
        width = 300,
    }: Props,
) {
    return (
        <Transition mounted={open} transition="slide-left" duration={200} timingFunction="ease">
            {(styles: CSSProperties) => (
                <Box sx={{
                    ...styles as any,
                    minWidth: width,
                    maxWidth: typeof width === 'number' ? width + 60 : width,
                    zIndex: 20,
                }}
                >
                    <Paper p="md" m={8} shadow="sm" radius="xs" withBorder>
                        <Group position="apart" align="start" noWrap>
                            <Text size="sm" pb={24}>{title}</Text>
                            <ActionIcon
                                size="sm"
                                onClick={() => setOpen(false)}
                                data-test="relative-wrapper-icon"
                                aria-label="Close"
                            >
                                <IconX stroke={1} size={16} />
                            </ActionIcon>
                        </Group>
                        <Text size="sm">
                            {children}
                        </Text>
                    </Paper>
                </Box>
            )}
        </Transition>
    );
}

export default RelativeDrawer;
