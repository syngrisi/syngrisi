/* eslint-disable max-len */
import * as React from 'react';
import {
    MantineProvider,
} from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/nprogress/styles.css';
import '@mantine/spotlight/styles.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Route, Routes, useNavigate } from 'react-router';
import { useState } from 'react';
import { useDocumentTitle } from '@mantine/hooks';
import { NavigationProgress } from '@mantine/nprogress';
import { Notifications } from '@mantine/notifications';

import { IconSearch } from '@tabler/icons-react';
import { Spotlight, SpotlightActionData } from '@mantine/spotlight';
import { AppContext } from '@admin/AppContext';

import AdminLayout from '@admin/AdminLayout';
import { navigationData } from '@shared/navigation/navigationData';
import { INavDataItem } from '@shared/navigation/interfaces';

const queryClient = new QueryClient();

function App() {
    const [appTitle, setAppTitle] = useState('Syngrisi');
    const [breadCrumbs, setBreadCrumbs] = useState([]);
    const [toolbar, setToolbar]: [any[], any] = useState([]);

    const updateToolbar = (newItem: any, index: number = 0) => {
        setToolbar((prevArr: any[]) => {
            const newArray = [...prevArr];
            newArray[index] = <React.Fragment key={index}>{newItem}</React.Fragment>;
            return newArray;
        });
    };
    const clearToolbar = () => {
        setToolbar(() => []);
    };

    const appProviderValue = React.useMemo(() => ({
        appTitle,
        setAppTitle,
        toolbar,
        setToolbar,
        updateToolbar,
        clearToolbar,
        breadCrumbs,
        setBreadCrumbs,
    }), [appTitle, toolbar, JSON.stringify(breadCrumbs)]);
    useDocumentTitle(appTitle);

    const navigate = useNavigate();
    const spotlightActions: SpotlightActionData[] = navigationData().map((item: INavDataItem) => ({
        id: item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        label: item.title,
        description: item.description,
        leftSection: item.icon,
        onClick: () => {
            setTimeout(
                () => {
                    window.location.reload();
                },
                100,
            );
            navigate(item.crumbs.slice(-1)[0].href);
        },
    }));
    return (
        <AppContext.Provider value={appProviderValue}>
            <QueryClientProvider client={queryClient}>
                <MantineProvider
                    defaultColorScheme="auto"
                    theme={{
                        fontSizes: { md: '1rem' },
                        primaryColor: 'green',
                        components: {
                            Text: { defaultProps: { component: 'div' } },
                        },
                    }}
                >
                    <Spotlight
                        actions={spotlightActions}
                        highlightQuery
                        searchProps={{
                            leftSection: <IconSearch size={18} />,
                            placeholder: 'Search...',
                            'aria-label': 'Spotlight search',
                        }}
                        limit={7}
                        shortcut={['mod + k', 'mod + K']}
                        nothingFound="Nothing found..."
                    />
                    <Notifications autoClose={5000} limit={5} />
                    <NavigationProgress size={0} color="transparent" />
                    <Routes>
                        <Route path="/admin/*" element={<AdminLayout />} />
                    </Routes>
                </MantineProvider>
            </QueryClientProvider>
        </AppContext.Provider>
    );
}

export default App;
