import { ActionIcon, Transition, useMantineTheme } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import React, { useState } from 'react';
import RemoveBaselineModalAsk from './RemoveBaselineModalAsk';

interface Props {
    selection: any
    infinityQuery: any
    setSelection: any
}

export default function RemoveBaselinesButton({ selection, setSelection, infinityQuery }: Props) {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    return (
        <>
            <Transition mounted={selection.length > 0} transition="fade" duration={400} timingFunction="ease">
                {
                    (styles) => (
                        <ActionIcon
                            color={theme.colorScheme === 'dark' ? 'green.8' : 'green.6'}
                            data-test="table-remove-baselines"
                            aria-label="Remove selected baselines"
                            variant="subtle"
                            onClick={async () => {
                                setOpened(true);
                            }}
                            style={styles}
                        >
                            <IconTrash size={24} stroke={1} />
                        </ActionIcon>
                    )
                }
            </Transition>
            <RemoveBaselineModalAsk
                opened={opened}
                setOpened={setOpened}
                selection={selection}
                infinityQuery={infinityQuery}
                setSelection={setSelection}
            />
        </>
    );
}
