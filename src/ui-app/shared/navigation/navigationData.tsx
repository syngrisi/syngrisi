import { SpotlightAction } from '@mantine/spotlight';
import React from 'react';
import { IconDashboard, IconList, IconListDetails, IconUser, IconUserExclamation } from '@tabler/icons';

export const navigationData: SpotlightAction[] = [
    {
        title: 'Dashboard',
        description: 'Visit the Test Results Dashboard',
        group: 'main',
        onTrigger: () => console.log('Dashboard'),
        icon: <IconDashboard size={18} />,
        crumbs: [
            { title: 'Dashboard', href: '/' },
        ],
    },
    {
        title: 'Admin Panel',
        description: 'Visit Admin Panel',
        group: 'main',
        onTrigger: () => console.log('Admin Panel'),
        icon: <IconUserExclamation size={18} />,
        crumbs: [
            { title: 'Admin panel', href: '/admin' },
        ],
    },
    {
        title: 'Users',
        description: 'Manage Users',
        group: 'admin',
        onTrigger: () => console.log('Users'),
        icon: <IconUser size={18} />,
        crumbs: [
            { title: 'Admin', href: '/admin' },
            { title: 'Users', href: '/admin/users' },
        ],
    },
    {
        title: 'Logs',
        description: 'View Logs',
        group: 'admin',
        onTrigger: () => console.log('Logs'),
        icon: <IconList size={18} />,
        crumbs: [
            { title: 'Admin', href: '/admin' },
            { title: 'Logs', href: '/admin/logs' },
        ],
    },
    // {
    //     title: 'Tasks',
    //     description: 'Manage Admin Tasks',
    //     group: 'tasks',
    //     onTrigger: () => console.log('Tasks'),
    //     icon: <IconListDetails size={18} />,
    //     crumbs: [
    //         { title: 'Admin', href: '/admin' },
    //         { title: 'Tasks', href: '/admin/tasks' },
    //     ],
    // },
    {
        title: 'Task: Handle old Checks',
        description: 'Old checks statistics and cleaning',
        group: 'tasks',
        onTrigger: () => console.log('Handle old Checks'),
        crumbs: [
            { title: 'Admin', href: '/admin' },
            { title: 'Tasks', href: '/admin/tasks' },
            { title: 'Handle old Checks', href: '/admin/tasks/handle_old_checks' },
        ],
    },
    {
        title: 'Task: Handle Database Consistency',
        description: 'Database Consistency statistics and cleaning',
        group: 'tasks',
        onTrigger: () => console.log('Handle Database Consistency'),
        crumbs: [
            { title: 'Admin', href: '/admin' },
            { title: 'Tasks', href: '/admin/tasks' },
            { title: 'Handle Database Consistency', href: '/admin/tasks/handle_database_consistency' },
        ],
    },
    {
        title: 'Task: Remove old logs',
        description: 'Remove logs older certain date',
        group: 'tasks',
        onTrigger: () => console.log('Remove logs older certain date'),
        crumbs: [
            { title: 'Admin', href: '/admin' },
            { title: 'Tasks', href: '/admin/tasks' },
            { title: 'Remove old logs', href: '/admin/tasks/remove_old_logs' },
        ],
    },
    {
        title: 'Task: Test',
        description: 'test',
        group: 'tasks',
        onTrigger: () => console.log('Test'),
        crumbs: [
            { title: 'Admin', href: '/admin' },
            { title: 'Tasks', href: '/admin/tasks' },
            { title: 'Test', href: '/admin/tasks/test' },
        ],
    },
    {
        title: 'Settings',
        description: 'Manage Admin Settings',
        group: 'tasks',
        onTrigger: () => console.log('Settings'),
        icon: <IconListDetails size={18} />,
        crumbs: [
            { title: 'Admin', href: '/admin' },
            { title: 'Settings', href: '/admin/settings' },
        ],
    },
];

export const getNavigationItem = (title: string) => navigationData.find((x) => x.title === title);
