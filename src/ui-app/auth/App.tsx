/* eslint-disable max-len */
import React, { useEffect, useRef } from 'react';
import './index.css';

import {
    Link,
    useRoutes,
} from 'react-router-dom';
import {
    Box,
    Center, ColorScheme,
    ColorSchemeProvider,
    Container,
    MantineProvider, MantineTheme,
    NavLink,
} from '@mantine/core';

import AuthFooter from './components/AuthFooter';
import AuthLogo from './components/AuthLogo';
import routesItems from './routes';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import ToggleThemeButton from './components/ToggleThemeButton';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
        console.log('toggle', colorScheme);
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
                    theme={{ fontSizes: { md: 24 }, colorScheme }}
                >
                    <Box sx={(theme: MantineTheme) => {
                        return {
                            display: 'flex',
                            justifyContent: 'center',
                        };
                    }}
                    >
                        <AuthLogo />
                    </Box>

                    <Box>
                        {routes}
                    </Box>
                    <Box>
                        <AuthFooter />
                    </Box>
                    <Box sx={{ width: 240 }}>
                        <NavLink label="Login" component={Link} to="/auth" />
                        <NavLink label="Logout" component={Link} to="/auth/logout" />
                        <NavLink label="Reset" component={Link} to="/auth/reset" />
                    </Box>
                </MantineProvider>
            </ColorSchemeProvider>
        </QueryClientProvider>
    );
}

export default App;
