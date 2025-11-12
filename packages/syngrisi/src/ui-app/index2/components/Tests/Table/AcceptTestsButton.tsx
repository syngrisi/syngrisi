import { ActionIcon, Transition, useMantineTheme } from '@mantine/core';
import { IconThumbUp } from '@tabler/icons';
import React, { useState } from 'react';
import AcceptTestModalAsk from './AcceptTestModalAsk';

interface Props {
    selection: any
    // firstPageQuery: any
    infinityQuery: any,
    setSelection: any
}

export default function AcceptTestsButton({ selection, setSelection, infinityQuery }: Props) {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    return (
        <>
            <Transition mounted={selection.length > 0} transition="fade" duration={400} timingFunction="ease">
                {
                    (styles) => (
                        <ActionIcon
                            color={theme.colorScheme === 'dark' ? 'green.8' : 'green.6'}
                            data-test="table-accept-tests"
                            aria-label="Accept selected tests"
                            variant="subtle"
                            onClick={async () => {
                                setOpened(true);
                            }}
                            style={styles}
                        >
                            <IconThumbUp size={24} stroke={1} />
                        </ActionIcon>
                    )
                }
            </Transition>
            <AcceptTestModalAsk
                opened={opened}
                setOpened={setOpened}
                selection={selection}
                infinityQuery={infinityQuery}
                setSelection={setSelection}
            />
        </>
    );
}
