/* eslint-disable max-len */
import * as React from 'react';
import {
    ColorSchemeProvider,
    MantineProvider,
} from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ModalsProvider } from '@mantine/modals';

import { Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import { useDocumentTitle } from '@mantine/hooks';
import { NavigationProgress } from '@mantine/nprogress';
import { AppContext } from './AppContext';

import AdminLayout from './AdminLayout';
import useColorScheme from '../shared/hooks/useColorSheme';

const queryClient = new QueryClient();

function App() {
    const [colorScheme, toggleColorScheme]: any = useColorScheme();

    const [appTitle, setAppTitle] = useState('Syngrisi');
    const [toolbar, setToolbar] = useState('');
    const appProviderValue = React.useMemo(() => ({
        appTitle, setAppTitle, toolbar, setToolbar,
    }), [appTitle, toolbar]);
    useDocumentTitle(appTitle);

    return (
        <AppContext.Provider value={appProviderValue}>
            <QueryClientProvider client={queryClient}>
                <ColorSchemeProvider
                    colorScheme={colorScheme as any}
                    toggleColorScheme={toggleColorScheme as any}
                >
                    <MantineProvider
                        withGlobalStyles
                        withNormalizeCSS
                        theme={{
                            fontSizes: { md: 24 },
                            colorScheme,
                            primaryColor: 'green',
                        }}
                    >
                        <NavigationProgress />
                        <ModalsProvider>
                            <Routes>
                                <Route path="/admin2/*" element={<AdminLayout />} />
                            </Routes>
                        </ModalsProvider>
                    </MantineProvider>
                </ColorSchemeProvider>
            </QueryClientProvider>
        </AppContext.Provider>
    );
}

export default App;
