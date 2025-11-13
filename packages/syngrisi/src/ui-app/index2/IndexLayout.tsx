import { AppShell } from '@mantine/core';
import * as React from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import HeaderIndex from '@index/components/Header/HeaderIndex';
import NavBarIndex from '@index/components/Navbar/NavbarIndex';
import Tests from '@index/components/Tests/Tests';

export default function IndexLayout() {
    const [breadCrumbs, setBreadCrumbs] = useState<any>([]);
    const [toolbar, setToolbar]: [any[], any] = useState([]);

    const updateToolbar = (newItem: any, index: number = 0) => {
        setToolbar((prevArr: any[]) => {
            const newArray = [...prevArr];
            newArray[index] = <React.Fragment key={index}>{newItem}</React.Fragment>;
            return newArray;
        });
    };

    return (
        <AppShell
            padding={8}
            navbar={<NavBarIndex setBreadCrumbs={setBreadCrumbs} />}
            header={<HeaderIndex breadCrumbs={breadCrumbs} toolbar={toolbar} />}
            styles={(theme) => ({
                main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
            })}
        >
            <Tests updateToolbar={updateToolbar} />
            <ReactQueryDevtools initialIsOpen={false} />
        </AppShell>
    );
}
