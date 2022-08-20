/* eslint-disable max-len */
import '../asserts/css/auth/index.css';
import * as React from 'react';

import {
    Link,
    useRoutes,
} from 'react-router-dom';
import {
    Box,
    ColorScheme,
    ColorSchemeProvider,
    MantineProvider,
    NavLink,
} from '@mantine/core';

import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthFooter from './components/AuthFooter';
import AuthLogo from './components/AuthLogo';
import routesItems from './routes';
import ToggleThemeButton from './components/ToggleThemeButton';

function App() {
    const routes = useRoutes(routesItems);
    const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
        key: 'mantine-color-scheme',
        defaultValue: 'light',
        getInitialValueInEffect: true,
    });

    const toggleColorScheme = (value?: ColorScheme) => {
        const isDark = () => colorScheme === 'dark';
        setColorScheme(value || (isDark() ? 'light' : 'dark'));
        if (isDark()) {
            document.body.style.backgroundColor = '#ffffff';
            document.body.style.setProperty('--before-opacity', '1');
            return;
        }
        document.body.style.backgroundColor = '#000000';
        document.body.style.setProperty('--before-opacity', '0.5');
    };

    useHotkeys([['mod+J', () => toggleColorScheme()]]);

    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
                <ToggleThemeButton colorScheme={colorScheme} toggleColorScheme={toggleColorScheme} />
                <MantineProvider
                    withGlobalStyles
                    withNormalizeCSS
                    theme={{
                        fontSizes: { md: 24 },
                        colorScheme,
                    }}
                >
                    <Box sx={() => ({
                        display: 'flex',
                        justifyContent: 'center',
                    })}
                    >
                        <AuthLogo />
                    </Box>

                    <Box>
                        {routes}
                    </Box>
                    <Box>
                        <AuthFooter />
                    </Box>
                </MantineProvider>
            </ColorSchemeProvider>
        </QueryClientProvider>
    );
}

export default App;
