import { Paper, Box, useComputedColorScheme, useMantineTheme } from '@mantine/core';
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
import AdminDataManagement from '@admin/components/DataManagement/AdminDataManagement';

export default function AdminLayout() {
    const theme = useMantineTheme();
    const colorScheme = useComputedColorScheme();
    return (
        <Box
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                backgroundColor: colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
            }}
        >
            <Box style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}>
                <AdminHeader />
            </Box>
            <Box style={{ display: 'flex', height: '100vh', overflow: 'hidden', paddingTop: 100 }}>
                <AdminNavBar />
                <Box component="main" style={{ flex: 1, padding: 8 }}>
                    <ReactQueryDevtools initialIsOpen={false} />
                    <Paper>
                        <Routes>
                            <Route path="" element={<AdminUsers />} />
                            <Route path="users" element={<AdminUsers />} />
                            <Route path="settings" element={<AdminSettings />} />
                            <Route path="plugins" element={<AdminPluginSettings />} />
                            <Route path="logs" element={<AdminLogs />} />
                            <Route path="data" element={<AdminDataManagement />} />
                        </Routes>
                        <Routes>
                            <Route path="/tasks/">
                                <Route path=":task" element={<TaskWrapper />} />
                            </Route>
                        </Routes>
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
}
