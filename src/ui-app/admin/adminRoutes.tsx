import React from 'react';
import AdminSettings from './components/AdminSettings';
import AdminUsers from './components/AdminUsers';
import AdminLogs from './components/AdminLogs';

const routesItems = [
    {
        path: '/admin/settings',
        element: <AdminSettings />,
    },
    {
        path: '/admin/users',
        element: <AdminUsers />,
    },
    {
        path: '/admin/logs',
        element: <AdminLogs />,
    },
];

export default routesItems;
