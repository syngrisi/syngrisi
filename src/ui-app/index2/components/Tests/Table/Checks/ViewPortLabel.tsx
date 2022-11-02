import * as React from 'react';
import { Badge, Group, useMantineTheme } from '@mantine/core';

interface Props {
    check: any
    sizes: any
    size?: any
    checksViewSize: string
    fontSize?: string
    displayed?: boolean
    color?: string
}

export function ViewPortLabel(
    {
        check,
        sizes,
        size = '',
        checksViewSize,
        fontSize = '12px',
        displayed = true,
        color = 'dark',
    }: Props,
) {
    const theme = useMantineTheme();
    const wrongSizeIcon = check.failReasons.includes('wrong_dimensions')
        ? (
            <Badge
                component="div"
                title="Actual and Expected Screenshots have different size"
                pl={4}
                pr={4}
                pt={6}
                pb={6}
                // weight={900}
                color="yellow"
                variant="filled"
                radius="xl"
                data-test="check-wrong-images-size-error-icon"
                sx={{
                    fontSize: '12px',
                    position: 'absolute',
                    top: -10,
                    right: -10,
                    lineHeight: '16px',
                    fontWeight: 600,
                    fontFamily: '"Roboto","Arial",sans-serif',
                    border: '2px',
                    borderStyle: 'solid',
                    borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : 'white',
                }}
            >
                !
            </Badge>
        )
        : '';

    return (
        <Group
            sx={
                {
                    display: displayed ? 'block' : 'none',
                    position: 'relative',
                }
            }
        >
            <Badge
                color={color}
                size={size || sizes[checksViewSize].viewportText}
                title="Viewport size"
                sx={
                    {
                        fontSize,
                        display: displayed ? 'block' : 'none',
                    }
                }
            >
                {check.viewport}
            </Badge>
            {wrongSizeIcon}
        </Group>
    );
}
