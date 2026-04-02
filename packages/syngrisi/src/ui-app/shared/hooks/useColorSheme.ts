import { useHotkeys, useLocalStorage } from '@mantine/hooks';

type ColorSchemeValue = 'light' | 'dark';

export default function useColorScheme() {
    const [colorScheme, setColorScheme] = useLocalStorage<ColorSchemeValue>({
        key: 'mantine-color-scheme',
        defaultValue: 'light',
        getInitialValueInEffect: true,
    });
    const toggleColorScheme = (value?: ColorSchemeValue | undefined): void => {
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
