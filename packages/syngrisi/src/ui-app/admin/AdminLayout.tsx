import { Paper, AppShell } from '@mantine/core';
import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import AdminHeader from './components/Header/AdminHeader';
import AdminNavBar from './components/Navbar/AdminNavbar';
import TaskWrapper from './components/Tasks/TaskWrapper';
import AdminUsers from './components/Users/AdminUsers';
import AdminSettings from './components/Settings/AdminSettings';
import AdminLogs from './components/Logs/AdminLogs';

export default function AdminLayout() {
    return (
        <AppShell
            padding={8}
            navbar={<AdminNavBar />}
            header={<AdminHeader />}
            styles={(theme) => ({
                main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
            })}
        >
            <ReactQueryDevtools initialIsOpen={false} />
            <Paper>
                <Routes>
                    <Route path="" element={<AdminUsers />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="settings" element={<AdminSettings />} />
                    <Route path="logs" element={<AdminLogs />} />
                </Routes>
                <Routes>
                    <Route path="/tasks/">
                        <Route path=":task" element={<TaskWrapper />} />
                    </Route>
                </Routes>
            </Paper>
        </AppShell>
    );
}
