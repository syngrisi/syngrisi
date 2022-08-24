import { useMantineTheme } from '@mantine/core';

const isDark = () => useMantineTheme().colorScheme === 'dark';

export { isDark };
