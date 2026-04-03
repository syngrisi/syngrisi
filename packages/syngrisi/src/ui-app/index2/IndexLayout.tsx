import { Box, useComputedColorScheme, useMantineTheme } from '@mantine/core';
import * as React from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import HeaderIndex from '@index/components/Header/HeaderIndex';
import NavBarIndex from '@index/components/Navbar/NavbarIndex';
import Tests from '@index/components/Tests/Tests';
import Baselines from '@index/components/Baselines/Baselines';
import { useLocation } from 'react-router-dom';
import { useParams } from '@hooks/useParams';
import SharedCheckLayout from '@index/components/SharedCheckLayout';

export default function IndexLayout() {
    const { query } = useParams();
    const [breadCrumbs, setBreadCrumbs] = useState<any>([]);
    const [toolbar, setToolbar]: [any[], any] = useState([]);
    const [navbarWidth, setNavbarWidth] = useState(350);
    const location = useLocation();
    const theme = useMantineTheme();
    const colorScheme = useComputedColorScheme();

    if (query.share) {
        return <SharedCheckLayout />;
    }

    const updateToolbar = (newItem: any, index: number = 0) => {
        setToolbar((prevArr: any[]) => {
            const newArray = [...prevArr];
            newArray[index] = <React.Fragment key={index}>{newItem}</React.Fragment>;
            return newArray;
        });
    };

    const isBaselinesPage = location.pathname.includes('/baselines');

    return (
        <Box
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                backgroundColor: colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
            }}
        >
            <HeaderIndex breadCrumbs={breadCrumbs} toolbar={toolbar} />
            <Box style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <NavBarIndex
                    setBreadCrumbs={setBreadCrumbs}
                    navbarWidth={navbarWidth}
                    setNavbarWidth={setNavbarWidth}
                />
                <Box component="main" style={{ flex: 1, padding: 8 }}>
                    <main
                        role="main"
                        aria-label="Test results content"
                        style={{ width: '100%' }}
                    >
                        {isBaselinesPage
                            ? <Baselines updateToolbar={updateToolbar} />
                            : <Tests updateToolbar={updateToolbar} navbarWidth={navbarWidth} />}
                    </main>
                    <ReactQueryDevtools initialIsOpen={false} />
                </Box>
            </Box>
        </Box>
    );
}
