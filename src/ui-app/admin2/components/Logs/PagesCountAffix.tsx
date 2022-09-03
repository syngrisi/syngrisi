import React from 'react';
import { Affix, Button, Text, Transition } from '@mantine/core';
import { IconArrowUp } from '@tabler/icons';

interface Props {
    loaded: string
    total: string
    scrollAreaRef: any
}

function PagesCountAffix({ loaded, total, scrollAreaRef }: Props) {
    const isMounted = !!scrollAreaRef?.current?.querySelector('.mantine-ScrollArea-viewport')?.scrollTop;
    return (
        <Affix position={{ bottom: 20, right: 20 }}>
            <Transition
                transition="slide-up"
                mounted={isMounted}
            >
                {(transitionStyles) => (
                    <Button
                        size="lg"
                        color="dark"
                        style={transitionStyles}
                        title="Scroll to top"
                        rightIcon={<IconArrowUp size={16} />}
                        onClick={
                            () => scrollAreaRef?.current?.querySelector('.mantine-ScrollArea-viewport').scroll(0, 0)
                        }
                    >
                        <Text size="sm" p={3} title="Loaded">{loaded}</Text>
                        <Text size="sm" p={3}>{' / '}</Text>
                        <Text size="sm" p={3} title="Total">{total}</Text>

                    </Button>
                )}
            </Transition>
        </Affix>
    );
}

export default PagesCountAffix;
