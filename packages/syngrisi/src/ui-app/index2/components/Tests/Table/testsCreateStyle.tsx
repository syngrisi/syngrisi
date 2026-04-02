import type { CSSProperties } from 'react';
import type { MantineTheme } from '@mantine/core';

export const testsCreateStyle = (theme: MantineTheme, colorScheme: 'light' | 'dark') => ({
    rowSelected: {
        backgroundColor:
            colorScheme === 'dark'
                ? 'color-mix(in srgb, var(--mantine-primary-color-7) 20%, transparent)'
                : 'var(--mantine-primary-color-0)',
    } as CSSProperties,
    header: {
        position: 'sticky' as const,
        top: 0,
        backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        transition: 'box-shadow 150ms ease',
    } as CSSProperties,
    scrolled: {
        boxShadow: theme.shadows.sm,
    } as CSSProperties,
    tableBody: {} as CSSProperties,
});
