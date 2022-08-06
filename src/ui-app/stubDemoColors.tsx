/* eslint-disable max-len */
import * as React from 'react';
import {
    useMantineTheme,
    Text, Button,
} from '@mantine/core';

import { useEffect, useRef } from 'react';

function DemoColors() {
    const theme = useMantineTheme();
    console.log(theme);

    const greenButtonRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        setTimeout(() => {
            greenButtonRef.current.remove();
        }, 5000);
    }, []);

    return (
        <>
            <Text color="s_success">
                Custom Theme Success Text
            </Text>
            <Text color={theme.colors.s_success[3]}>
                Custom Theme Success Text Shade - 3
            </Text>
            <Text color="blue">
                Standard Blue text
            </Text>
            <Button color="red">
                Standard Red Button
            </Button>
            <Button color="s_success">
                Custom Theme Success Button
            </Button>
            <Button color="green" ref={greenButtonRef}>
                Green
            </Button>
        </>
    );
}

export default DemoColors;
