import { MantineTheme, alpha } from '@mantine/core';

export function getAdminLogsStyles(theme: MantineTheme, colorScheme: 'light' | 'dark') {
    return {
        rowSelected: {
            backgroundColor:
                colorScheme === 'dark'
                    ? alpha(theme.colors[theme.primaryColor][7], 0.2)
                    : theme.colors[theme.primaryColor][0],
        } as React.CSSProperties,
        header: {
            position: 'sticky' as const,
            top: 0,
            backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
            transition: 'box-shadow 150ms ease',
        } as React.CSSProperties,
        scrolled: {
            boxShadow: theme.shadows.sm,
        } as React.CSSProperties,
        tableBody: {} as React.CSSProperties,
    };
}
