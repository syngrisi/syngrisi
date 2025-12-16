import { ColorScheme } from '@mantine/core';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';

export default function useColorScheme() {
    const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
        key: 'mantine-color-scheme',
        defaultValue: 'light',
        getInitialValueInEffect: true,
    });
    const toggleColorScheme = (value?: ColorScheme | undefined): void => {
        const isDark = () => colorScheme === 'dark';
        setColorScheme(value || (isDark() ? 'light' : 'dark'));
        if (isDark()) {
            document.body.style.backgroundColor = '#ffffff';
            return;
        }
        document.body.style.backgroundColor = '#000000';
    };
    useHotkeys([['mod+J', () => toggleColorScheme()]]);

    return [colorScheme, toggleColorScheme];
}
