/* eslint-disable max-len,prefer-arrow-callback */
import '@mantine/core/styles.css';
import '@asserts/css/auth/index.css';
import * as React from 'react';

import {
    useRoutes,
} from 'react-router-dom';
import {
    Box,
    MantineProvider,
} from '@mantine/core';

import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import AuthFooter from '@auth/components/AuthFooter';
import AuthLogo from '@auth/components/AuthLogo';
import routesItems from '@auth/routes';
import ToggleThemeButton from '@auth/components/ToggleThemeButton';

const queryClient = new QueryClient();

function App() {
    const routes = useRoutes(routesItems);
    const [colorScheme, setColorScheme] = useLocalStorage<'light' | 'dark'>({
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

    const toggleColorScheme = () => {
        setColorScheme(isDark() ? 'light' : 'dark');
    };

    useHotkeys([['mod+J', () => toggleColorScheme()]]);

    return (
        <QueryClientProvider client={queryClient}>
            <MantineProvider
                defaultColorScheme="light"
                forceColorScheme={colorScheme}
                theme={{
                    fontSizes: { md: '24px' },
                    components: {
                        Text: { defaultProps: { component: 'div' } },
                    },
                }}
            >
                <ToggleThemeButton colorScheme={colorScheme} toggleColorScheme={toggleColorScheme} />

                <Box style={{
                    display: 'flex',
                    justifyContent: 'center',
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
            </MantineProvider>
        </QueryClientProvider>
    );
}

export default App;
