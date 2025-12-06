/* eslint-disable max-len */
import * as React from 'react';
import { useMemo, ComponentPropsWithoutRef } from 'react';

import {
    ColorSchemeProvider,
    MantineProvider,
    useMantineTheme,
} from '@mantine/core';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Route, Routes, useNavigate } from 'react-router-dom';
import { NavigationProgress } from '@mantine/nprogress';
import { NotificationsProvider } from '@mantine/notifications';

import { IconFilter, IconMoonStars, IconSearch, IconSun } from '@tabler/icons-react';
import { SpotlightProvider } from '@mantine/spotlight';
import { DefaultAction } from '@mantine/spotlight/esm/DefaultAction/DefaultAction';
import config from '@config';

import IndexLayout from '@index/IndexLayout';
import { ChecksList } from '@index/components/ChecksList/ChecksList';
import useColorScheme from '@shared/hooks/useColorSheme';
import { navigationData } from '@shared/navigation/navigationData';
import { INavDataItem } from '@shared/navigation/interfaces';
import { useParams } from '@hooks/useParams';



import { UserHooks } from '@shared/hooks';

const SpotlightActionButton = React.forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<typeof DefaultAction>>(
    (props, ref) => {
        const { action, ...others } = props;
        const ariaLabel = action?.title || 'Spotlight action';
        const dataTest = action?.title
            ? `spotlight-action-${action.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
            : undefined;

        return (
            <DefaultAction
                ref={ref}
                aria-label={ariaLabel}
                data-test={dataTest}
                action={action}
                {...others}
            />
        );
    },
);

SpotlightActionButton.displayName = 'SpotlightActionButton';

// ... (imports)

function App() {
    const theme = useMantineTheme();
    const { setQuery } = useParams();

    const [colorScheme, toggleColorScheme]: any = useColorScheme();
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

        actions.push(
            {
                title: `Switch to ${colorScheme === 'dark' ? 'light' : 'dark'} theme`,
                description: 'Toggle color theme',
                onTrigger: () => toggleColorScheme(),
                icon: colorScheme === 'dark'
                    ? <IconSun size={18} color={theme.colors.yellow[4]} />
                    : <IconMoonStars color={theme.colors.blue[6]} size={18} />,
            } as any,
        );

        actions.push(
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

        actions.push(
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

        actions.push(
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

        actions.push(
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

        return actions;
    }, [role, navigate, colorScheme, theme, setQuery, toggleColorScheme]);

    return (

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
                        actionComponent={SpotlightActionButton}
                        highlightQuery
                        searchIcon={<IconSearch size={18} />}
                        limit={20}
                        searchPlaceholder="Search..."
                        searchInputProps={{ 'aria-label': 'Spotlight search' }}
                        shortcut={['mod + k', 'mod + K']}
                        nothingFoundMessage="Nothing found..."
                    >
                        <NotificationsProvider autoClose={5000} limit={5}>
                            <NavigationProgress />

                            <Routes>
                                <Route path={config.indexRoute} element={<IndexLayout />} />
                                <Route path="/baselines" element={<IndexLayout />} />
                                <Route path="/checks-list" element={<ChecksList />} />
                            </Routes>
                        </NotificationsProvider>
                    </SpotlightProvider>
                </MantineProvider>
            </ColorSchemeProvider>

    );
}

export default App;
