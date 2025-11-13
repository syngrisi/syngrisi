/* eslint-disable max-len */
import * as React from 'react';

import {
    ColorSchemeProvider,
    MantineProvider,
    useMantineTheme,
} from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Route, Routes, useNavigate } from 'react-router-dom';
import { NavigationProgress } from '@mantine/nprogress';
import { NotificationsProvider } from '@mantine/notifications';

import { IconFilter, IconMoonStars, IconSearch, IconSun } from '@tabler/icons-react';
import { SpotlightProvider } from '@mantine/spotlight';
import config from '../config';

import IndexLayout from './IndexLayout';
import { ChecksList } from './components/ChecksList/ChecksList';
import useColorScheme from '../shared/hooks/useColorSheme';
import { navigationData } from '../shared/navigation/navigationData';
import { INavDataItem } from '../shared/navigation/interfaces';
import { useParams } from './hooks/useParams';

const queryClient = new QueryClient();

function App() {
    const theme = useMantineTheme();
    const { setQuery } = useParams();

    const [colorScheme, toggleColorScheme]: any = useColorScheme();

    const navigate = useNavigate();
    const spotlightActions = navigationData().map((item: INavDataItem) => ({
        ...item,
        onTrigger: () => {
            setTimeout(
                () => {
                    window.location.reload();
                },
                100,
            );
            navigate(item.crumbs.slice(-1)[0].href);
        },
    }));

    spotlightActions.push(
        {
            title: `Switch to ${colorScheme === 'dark' ? 'light' : 'dark'} theme`,
            description: 'Toggle color theme',
            onTrigger: () => toggleColorScheme(),
            icon: colorScheme === 'dark'
                ? <IconSun size={18} color={theme.colors.yellow[4]} />
                : <IconMoonStars color={theme.colors.blue[6]} size={18} />,
        } as any,
    );

    spotlightActions.push(
        {
            title: 'Filter: only successful tests',
            description: 'Show only New and Passed tests',
            onTrigger: () => {
                setQuery(
                    {
                        filter: { $or: [{ status: { $eq: 'Passed' } }, { status: { $eq: 'New' } }] },
                    },
                );
            },
            icon: <IconFilter size={18} />,
        } as any,
    );

    spotlightActions.push(
        {
            title: 'Filter: only failed tests',
            description: 'Show only Failed tests',
            onTrigger: () => {
                setQuery(
                    {
                        filter: { $or: [{ status: { $eq: 'Failed' } }] },
                    },
                );
            },
            icon: <IconFilter size={18} />,
        } as any,
    );

    spotlightActions.push(
        {
            title: 'Filter: not accepted tests',
            description: 'Show all tests with Unaccepted and Partially accepted status',
            onTrigger: () => {
                setQuery(
                    {
                        filter: { $or: [{ markedAs: { $eq: 'Unaccepted' } }, { status: { $eq: 'Partially' } }] },
                    },
                );
            },
            icon: <IconFilter size={18} />,
        } as any,
    );

    spotlightActions.push(
        {
            title: 'Filter: accepted tests',
            description: 'Show all tests with Accepted status',
            onTrigger: () => {
                setQuery(
                    {
                        filter: { $or: [{ markedAs: { $eq: 'Accepted' } }] },
                    },
                );
            },
            icon: <IconFilter size={18} />,
        } as any,
    );

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
                                <Route path={config.indexRoute} element={<IndexLayout />} />
                                <Route path="/checks-list" element={<ChecksList />} />
                            </Routes>
                        </NotificationsProvider>
                    </SpotlightProvider>
                </MantineProvider>
            </ColorSchemeProvider>
        </QueryClientProvider>
    );
}

export default App;
