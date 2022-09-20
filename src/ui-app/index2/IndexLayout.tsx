import { Paper, AppShell } from '@mantine/core';
import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import IndexHeader from './components/Header/IndexHeader';
import AdminNavBar from './components/Navbar/IndexNavbar';

export default function IndexLayout() {
    return (
        <AppShell
            padding={8}
            navbar={<AdminNavBar />}
            header={<IndexHeader />}
            styles={(theme) => ({
                main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
            })}
        >
            <ReactQueryDevtools initialIsOpen={false} />
            <Paper>
                TESTS RESULTS
            </Paper>
        </AppShell>
    );
}
