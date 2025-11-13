import { ActionIcon, Transition, useMantineTheme } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import React, { useState } from 'react';
import RemoveTestModalAsk from './RemoveTestModalAsk';

interface Props {
    selection: any
    infinityQuery: any
    setSelection: any
}

export default function RemoveTestsButton({ selection, setSelection, infinityQuery }: Props) {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    return (
        <>
            <Transition mounted={selection.length > 0} transition="fade" duration={400} timingFunction="ease">
                {
                    (styles) => (
                        <ActionIcon
                            color={theme.colorScheme === 'dark' ? 'green.8' : 'green.6'}
                            data-test="table-remove-tests"
                            aria-label="Remove selected tests"
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
            <RemoveTestModalAsk
                opened={opened}
                setOpened={setOpened}
                selection={selection}
                infinityQuery={infinityQuery}
                setSelection={setSelection}
            />
        </>
    );
}
