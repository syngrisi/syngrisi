import React, { CSSProperties } from 'react';
import { ActionIcon, Box, Group, Paper, Text, Transition } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

interface Props {
    children: any,
    title?: string,
    width?: string | number,
    exactWidth?: boolean,
    padding?: string | number,
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
        exactWidth = false,
        padding = 24,
    }: Props,
) {
    return (
        <Transition mounted={open} transition="slide-left" duration={200} timingFunction="ease">
            {(styles: CSSProperties) => (
                <Box style={{
                    ...styles as any,
                    width: exactWidth ? width : undefined,
                    minWidth: width,
                    maxWidth: exactWidth ? width : typeof width === 'number' ? width + 60 : width,
                    zIndex: 20,
                }}
                >
                    <Paper p={padding} m={8} shadow="sm" radius={0} withBorder>
                        <Group justify="space-between" align="start" wrap="nowrap" mb={20}>
                            <Text style={{ fontSize: 14, lineHeight: '21.7px', fontWeight: 400 }}>
                                {title}
                            </Text>
                            <ActionIcon
                                size={22}
                                onClick={() => setOpen(false)}
                                data-test="relative-wrapper-icon"
                                aria-label="Close"
                                variant="transparent"
                                color="gray"
                                style={{ fontSize: 24, lineHeight: '24px' }}
                            >
                                <IconX stroke={1} size={22} />
                            </ActionIcon>
                        </Group>
                        <Box>
                            {children}
                        </Box>
                    </Paper>
                </Box>
            )}
        </Transition>
    );
}

export default RelativeDrawer;
