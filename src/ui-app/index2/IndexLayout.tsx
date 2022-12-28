import { AppShell } from '@mantine/core';
import * as React from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import IndexHeader from './components/Header/IndexHeader';
import NavBar from './components/Navbar/NavbarIndex';
import Tests from './components/Tests/Tests';

export default function IndexLayout() {
    return (
        <AppShell
            padding={8}
            navbar={<NavBar />}
            header={<IndexHeader />}
            styles={(theme) => ({
                main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
            })}
        >
            <Tests />
            <ReactQueryDevtools initialIsOpen={false} />
        </AppShell>
    );
}
