import { MantineTheme } from '@mantine/core';

export function getCommonStyles(theme: MantineTheme, colorScheme: 'light' | 'dark') {
    return {
        footer: {
            marginTop: 120,
            borderTop: `1px solid ${
                colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
            }`,
        } as React.CSSProperties,

        footerText: {
            color: 'white',
            fontSize: '1rem',
        } as React.CSSProperties,

        footerLink: {
            margin: '8px',
            color: 'white',
            fontSize: '1rem',
        } as React.CSSProperties,
    };
}
