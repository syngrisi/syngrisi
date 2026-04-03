import { Box, ScrollArea, useMantineTheme, useComputedColorScheme } from '@mantine/core';
import * as React from 'react';
import {
    IconUsers,
    IconSettings,
    IconArticle, IconListDetails,
    IconPlugConnected,
    IconDatabase,
} from '@tabler/icons-react';
import { LinksGroup } from '@admin/components/Navbar/NavbarLinksGroup';
import { taskLinks } from '@admin/components/Tasks/tasksList';

const navbarItems = [
    { label: 'Users', icon: IconUsers, link: '/admin/users' },
    { label: 'Logs', icon: IconArticle, link: '/admin/logs' },
    {
        label: 'Tasks',
        icon: IconListDetails,
        links: taskLinks,
    },
    { label: 'Data Management', icon: IconDatabase, link: '/admin/data' },
    { label: 'Plugins', icon: IconPlugConnected, link: '/admin/plugins' },
    { label: 'Settings', icon: IconSettings, link: '/admin/settings' },
];

export default function AdminNavbar() {
    const theme = useMantineTheme();
    const colorScheme = useComputedColorScheme('light');

    const navbarStyle: React.CSSProperties = {
        backgroundColor: colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
        paddingBottom: 0,
    };

    const linksStyle: React.CSSProperties = {
        marginLeft: `calc(-1 * ${theme.spacing.md})`,
        marginRight: `calc(-1 * ${theme.spacing.md})`,
    };

    const linksInnerStyle: React.CSSProperties = {
        paddingBottom: theme.spacing.md,
    };

    // eslint-disable-next-line react/jsx-props-no-spreading
    const links = navbarItems.map((item) => <LinksGroup {...item} key={item.label} />);

    return (
        <Box component="nav" pl="md" pr="md" pt="sm" pb="md" style={{ ...navbarStyle, height: '100vh', width: 300 }}>
            <ScrollArea style={{ ...linksStyle, flexGrow: 1 }}>
                <div style={linksInnerStyle}>{links}</div>
            </ScrollArea>
        </Box>
    );
}
