import { AppShell } from '@mantine/core';
import * as React from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import HeaderIndex from '@index/components/Header/HeaderIndex';
import NavBarIndex from '@index/components/Navbar/NavbarIndex';
import Tests from '@index/components/Tests/Tests';
import Baselines from '@index/components/Baselines/Baselines';
import { useLocation } from 'react-router-dom';

export default function IndexLayout() {
    const [breadCrumbs, setBreadCrumbs] = useState<any>([]);
    const [toolbar, setToolbar]: [any[], any] = useState([]);
    const location = useLocation();

    const updateToolbar = (newItem: any, index: number = 0) => {
        setToolbar((prevArr: any[]) => {
            const newArray = [...prevArr];
            newArray[index] = <React.Fragment key={index}>{newItem}</React.Fragment>;
            return newArray;
        });
    };

    const isBaselinesPage = location.pathname.includes('/baselines');

    return (
        <AppShell
            padding={8}
            navbar={<NavBarIndex setBreadCrumbs={setBreadCrumbs} />}
            header={<HeaderIndex breadCrumbs={breadCrumbs} toolbar={toolbar} />}
            styles={(theme) => ({
                main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
            })}
        >
            {isBaselinesPage ? <Baselines updateToolbar={updateToolbar} /> : <Tests updateToolbar={updateToolbar} />}
            <ReactQueryDevtools initialIsOpen={false} />
        </AppShell>
    );
}
