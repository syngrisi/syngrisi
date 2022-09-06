import { ActionIcon, useMantineTheme } from '@mantine/core';
import { IconArrowsVertical, IconFold } from '@tabler/icons';
import React from 'react';
import { useToggle } from '@mantine/hooks';

interface Props {
    expandSelected: any
    collapseSelected: any
}

export default function UnfoldActionIcon({ expandSelected, collapseSelected }: Props) {
    const theme = useMantineTheme();
    const [foldMode, toggleFoldMode] = useToggle([true, false]);
    return (
        <ActionIcon
            color={theme.colorScheme === 'dark' ? 'green.8' : 'green.6'}
            variant="subtle"
            onClick={() => {
                if (foldMode) {
                    expandSelected();
                } else {
                    collapseSelected();
                }
                toggleFoldMode();
            }}
        >
            {foldMode ? <IconArrowsVertical size={24} stroke={1} /> : <IconFold size={24} />}
        </ActionIcon>
    );
}
