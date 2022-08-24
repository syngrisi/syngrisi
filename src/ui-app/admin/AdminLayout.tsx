import { Paper, AppShell } from '@mantine/core';
import * as React from 'react';
import { useDocumentTitle } from '@mantine/hooks';
import { Route, Routes, useRoutes } from 'react-router-dom';
import AdminHeader from './components/Header/AdminHeader';
import AdminNavBar from './components/Navbar/AdminNavbar';
import routerItems from './adminRoutes';
import TaskWrapper from './components/Tasks/TaskWrapper';

export default function AdminLayout() {
    const routes = useRoutes(routerItems);
    useDocumentTitle('Admin panel');

    return (
        <AppShell
            padding="md"
            navbar={<AdminNavBar />}
            header={<AdminHeader />}
            styles={(theme) => ({
                main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
            })}
        >
            <Paper>
                {routes}
                <Routes>
                    <Route path="/admin2/tasks/">
                        <Route path=":task" element={<TaskWrapper />} />
                    </Route>
                </Routes>
            </Paper>
        </AppShell>
    );
}
