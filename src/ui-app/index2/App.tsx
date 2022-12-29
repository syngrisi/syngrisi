/* eslint-disable max-len */
import * as React from 'react';
import {
    ColorSchemeProvider,
    MantineProvider,
} from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ModalsProvider } from '@mantine/modals';

import { Route, Routes, useNavigate } from 'react-router-dom';
import { NavigationProgress } from '@mantine/nprogress';
import { NotificationsProvider } from '@mantine/notifications';

import { IconSearch } from '@tabler/icons';
import { SpotlightProvider } from '@mantine/spotlight';

import IndexLayout from './IndexLayout';
import useColorScheme from '../shared/hooks/useColorSheme';
import { navigationData } from '../shared/navigation/navigationData';
import { INavDataItem } from '../shared/navigation/interfaces';

const queryClient = new QueryClient();

function App() {
    const [colorScheme, toggleColorScheme]: any = useColorScheme();

    const navigate = useNavigate();
    const spotlightActions = navigationData().map((item: INavDataItem) => ({
        ...item,
        onTrigger: () => navigate(item.crumbs.slice(-1)[0].href),
    }));
    return (
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
                        breakpoints: {
                            xs: 500,
                            sm: 800,
                            md: 1000,
                            lg: 1200,
                            xl: 1400,
                        },
                    }}
                >
                    <SpotlightProvider
                        actions={spotlightActions}
                        highlightQuery
                        searchIcon={<IconSearch size={18} />}
                        limit={10}
                        searchPlaceholder="Search..."
                        shortcut={['mod + k', 'mod + K']}
                        nothingFoundMessage="Nothing found..."
                    >
                        <NotificationsProvider autoClose={5000} limit={5}>
                            <NavigationProgress />
                            <Routes>
                                <Route path="/index2/*" element={<IndexLayout />} />
                            </Routes>
                        </NotificationsProvider>
                    </SpotlightProvider>
                </MantineProvider>
            </ColorSchemeProvider>
        </QueryClientProvider>
    );
}

export default App;
