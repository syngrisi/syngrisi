import React from 'react';
import { Affix, Button, Text, Transition } from '@mantine/core';
import { useWindowScroll } from '@mantine/hooks';
import { IconArrowUp } from '@tabler/icons';

interface Props {
    loaded: string
    total: string
}

function PagesCountAffix({ loaded, total }: Props) {
    const [scroll, scrollTo] = useWindowScroll();

    return (
        <Affix position={{ bottom: 20, right: 20 }}>
            <Transition transition="slide-up" mounted={scroll.y > 0}>
                {(transitionStyles) => (
                    <Button
                        size="lg"
                        color="dark"
                        style={transitionStyles}
                        title="Scroll to top"
                        rightIcon={<IconArrowUp size={16} />}
                        onClick={() => scrollTo({ y: 0 })}
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
