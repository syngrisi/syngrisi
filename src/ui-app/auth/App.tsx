/* eslint-disable max-len,prefer-arrow-callback */
import '../asserts/css/auth/index.css';
import * as React from 'react';

import {
    useRoutes,
} from 'react-router-dom';
import {
    Box,
    ColorScheme,
    ColorSchemeProvider,
    MantineProvider,
} from '@mantine/core';

import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import AuthFooter from './components/AuthFooter';
import AuthLogo from './components/AuthLogo';
import routesItems from './routes';
import ToggleThemeButton from './components/ToggleThemeButton';

const queryClient = new QueryClient();

function App() {
    const routes = useRoutes(routesItems);
    const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
        key: 'mantine-color-scheme',
        defaultValue: 'light',
        getInitialValueInEffect: true,
    });
    const isDark = () => colorScheme === 'dark';

    useEffect(function onColorSchemeChange() {
        if (!isDark()) {
            document.body.style.backgroundColor = '#1e1e1e';
            document.body.style.setProperty('--before-opacity', '0.7');
            return;
        }
        document.body.style.backgroundColor = '#000000';
        document.body.style.setProperty('--before-opacity', '0.7');
    }, [colorScheme]);

    const toggleColorScheme = (value?: ColorScheme) => {
        setColorScheme(value || (isDark() ? 'light' : 'dark'));
    };

    useHotkeys([['mod+J', () => toggleColorScheme()]]);

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
