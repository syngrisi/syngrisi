import { Paper, AppShell } from '@mantine/core';
import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import AdminHeader from '@admin/components/Header/AdminHeader';
import AdminNavBar from '@admin/components/Navbar/AdminNavbar';
import TaskWrapper from '@admin/components/Tasks/TaskWrapper';
import AdminUsers from '@admin/components/Users/AdminUsers';
import AdminSettings from '@admin/components/Settings/AdminSettings';
import AdminLogs from '@admin/components/Logs/AdminLogs';
import AdminPluginSettings from '@admin/components/PluginSettings/AdminPluginSettings';

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
                    <Route path="plugins" element={<AdminPluginSettings />} />
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

