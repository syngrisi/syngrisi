/* eslint-disable max-len */
import * as React from 'react';

import {
    ColorScheme,
    ColorSchemeProvider,
    MantineProvider,
} from '@mantine/core';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ModalsProvider } from '@mantine/modals';
import AdminLayout from './AdminLayout';
import useColorScheme from '../shared/hooks/useColorSheme';

function App() {
    const [colorScheme, toggleColorScheme] = useColorScheme();

    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <ColorSchemeProvider colorScheme={colorScheme as ColorScheme} toggleColorScheme={toggleColorScheme as any}>
                <MantineProvider
                    withGlobalStyles
                    withNormalizeCSS
                    theme={{
                        fontSizes: { md: 24 },
                        colorScheme,
                        primaryColor: 'green',
                    }}
                >
                    <ModalsProvider>
                        <AdminLayout />
                    </ModalsProvider>
                </MantineProvider>
            </ColorSchemeProvider>
        </QueryClientProvider>
    );
}

export default App;
