import { ActionIcon, Transition, useMantineTheme } from '@mantine/core';
import { IconArrowsVertical, IconFold } from '@tabler/icons';
import React from 'react';
import { useToggle } from '@mantine/hooks';

interface Props {
    expandSelected: any
    collapseSelected: any
    mounted: boolean
}

export default function UnfoldActionIcon({ expandSelected, collapseSelected, mounted }: Props) {
    const theme = useMantineTheme();
    const [foldMode, toggleFoldMode] = useToggle([true, false]);
    return (
        <Transition mounted={mounted} transition="fade" duration={400} timingFunction="ease">
            {
                (styles) => (
                    <ActionIcon
                        color={theme.colorScheme === 'dark' ? 'green.8' : 'green.6'}
                        data-test="folding-table-items"
                        variant="subtle"
                        onClick={() => {
                            if (foldMode) {
                                expandSelected();
                            } else {
                                collapseSelected();
                            }
                            toggleFoldMode();
                        }}
                        style={styles}
                    >
                        {foldMode ? <IconArrowsVertical size={24} stroke={1} /> : <IconFold size={24} />}
                    </ActionIcon>
                )
            }
        </Transition>
    );
}
