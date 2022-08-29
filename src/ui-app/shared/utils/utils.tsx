import { useMantineTheme } from '@mantine/core';

export const isDark = () => useMantineTheme().colorScheme === 'dark';
