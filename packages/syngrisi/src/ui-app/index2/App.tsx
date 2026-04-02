/* eslint-disable max-len */
import * as React from 'react';
import { useMemo, lazy, Suspense } from 'react';

import {
    MantineProvider,
    useMantineTheme,
    useMantineColorScheme,
} from '@mantine/core';
import '@mantine/core/styles.css';

import { Route, Routes, useNavigate } from 'react-router-dom';
import { NavigationProgress } from '@mantine/nprogress';
import '@mantine/nprogress/styles.css';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';

import { IconFilter, IconMoonStars, IconSearch, IconSun } from '@tabler/icons-react';
import { Spotlight } from '@mantine/spotlight';
import '@mantine/spotlight/styles.css';
import config from '@config';

import IndexLayout from '@index/IndexLayout';
const ChecksList = lazy(() => import('@index/components/ChecksList/ChecksList').then(m => ({ default: m.ChecksList })));
import { navigationData } from '@shared/navigation/navigationData';
import { INavDataItem } from '@shared/navigation/interfaces';
import { useParams } from '@hooks/useParams';

import { UserHooks } from '@shared/hooks';

function AppInner() {
    const theme = useMantineTheme();
    const { setQuery } = useParams();

    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const { data: currentUser } = UserHooks.useCurrentUser();
    const role = currentUser?.role || 'guest';
    console.log('App.tsx: Current User Role:', role);

    const navigate = useNavigate();
    const spotlightActions = useMemo(() => {
        const actions = navigationData()
            .filter((item: INavDataItem) => {
                if (item.title === 'Baselines') {
                    const allowed = ['admin', 'reviewer'].includes(role);
                    console.log(`App.tsx: Filtering Baselines for role '${role}': ${allowed}`);
                    return allowed;
                }
                return true;
            })
            .map((item: INavDataItem) => ({
                id: item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                label: item.title,
                description: item.description,
                onClick: () => {
                    setTimeout(
                        () => {
                            window.location.reload();
                        },
                        100,
                    );
                    navigate(item.crumbs.slice(-1)[0].href);
                },
                leftSection: item.icon,
            }));

        actions.push(
            {
                id: 'toggle-theme',
                label: `Switch to ${colorScheme === 'dark' ? 'light' : 'dark'} theme`,
                description: 'Toggle color theme',
                onClick: () => toggleColorScheme(),
                leftSection: colorScheme === 'dark'
                    ? <IconSun size={18} color={theme.colors.yellow[4]} />
                    : <IconMoonStars color={theme.colors.blue[6]} size={18} />,
            },
        );

        actions.push(
            {
                id: 'filter-successful',
                label: 'Filter: only successful tests',
                description: 'Show only New and Passed tests',
                onClick: () => {
                    setQuery(
                        {
                            filter: { $or: [{ status: { $eq: 'Passed' } }, { status: { $eq: 'New' } }] },
                        },
                    );
                },
                leftSection: <IconFilter size={18} />,
            },
        );

        actions.push(
            {
                id: 'filter-failed',
                label: 'Filter: only failed tests',
                description: 'Show only Failed tests',
                onClick: () => {
                    setQuery(
                        {
                            filter: { $or: [{ status: { $eq: 'Failed' } }] },
                        },
                    );
                },
                leftSection: <IconFilter size={18} />,
            },
        );

        actions.push(
            {
                id: 'filter-not-accepted',
                label: 'Filter: not accepted tests',
                description: 'Show all tests with Unaccepted and Partially accepted status',
                onClick: () => {
                    setQuery(
                        {
                            filter: { $or: [{ markedAs: { $eq: 'Unaccepted' } }, { status: { $eq: 'Partially' } }] },
                        },
                    );
                },
                leftSection: <IconFilter size={18} />,
            },
        );

        actions.push(
            {
                id: 'filter-accepted',
                label: 'Filter: accepted tests',
                description: 'Show all tests with Accepted status',
                onClick: () => {
                    setQuery(
                        {
                            filter: { $or: [{ markedAs: { $eq: 'Accepted' } }] },
                        },
                    );
                },
                leftSection: <IconFilter size={18} />,
            },
        );

        return actions;
    }, [role, navigate, colorScheme, theme, setQuery, toggleColorScheme]);

    return (
        <>
            <Spotlight
                actions={spotlightActions}
                highlightQuery
                searchProps={{ leftSection: <IconSearch size={18} />, placeholder: 'Search...' }}
                limit={20}
                shortcut={['mod + k', 'mod + K']}
                nothingFound="Nothing found..."
            />
            <Notifications autoClose={5000} limit={5} />
            <NavigationProgress />

            <Suspense fallback={null}>
                <Routes>
                    <Route path={config.indexRoute} element={<IndexLayout />} />
                    <Route path="/baselines" element={<IndexLayout />} />
                    <Route path="/checks-list" element={<ChecksList />} />
                </Routes>
            </Suspense>
        </>
    );
}

function App() {
    return (
        <MantineProvider
            defaultColorScheme="light"
            theme={{
                fontSizes: { md: '24px' },
                primaryColor: 'green',
                breakpoints: {
                    xs: '31.25em',
                    sm: '50em',
                    md: '62.5em',
                    lg: '75em',
                    xl: '87.5em',
                },
                components: {
                    Text: { defaultProps: { component: 'div' } },
                },
            }}
        >
            <AppInner />
        </MantineProvider>
    );
}

export default App;
