import { Anchor, AppShell } from '@mantine/core';
import * as React from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import HeaderIndex from './components/Header/HeaderIndex';
import NavBarIndex from './components/Navbar/NavbarIndex';
import Tests from './components/Tests/Tests';

export default function IndexLayout() {
    const [breadCrumbs, setBreadCrumbs] = useState<any>([]);

    return (
        <AppShell
            padding={8}
            navbar={<NavBarIndex setBreadCrumbs={setBreadCrumbs} />}
            header={<HeaderIndex breadCrumbs={breadCrumbs} />}
            styles={(theme) => ({
                main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
            })}
        >
            <Tests />
            <ReactQueryDevtools initialIsOpen={false} />
        </AppShell>
    );
}
