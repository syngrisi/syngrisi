import { Navbar, ScrollArea } from '@mantine/core';
import * as React from 'react';
import {
    IconUsers,
    IconSettings,
    IconArticle,
} from '@tabler/icons';
import { createStyles } from '@mantine/styles';
import { LinksGroup } from './NavbarLinksGroup';

const navbarItems = [
    { label: 'Users', icon: IconUsers, link: '/admin/users' },
    { label: 'Logs', icon: IconArticle, link: '/admin/logs' },
    { label: 'Settings', icon: IconSettings, link: '/admin/settings' },
];
const useStyles = createStyles((theme) => ({
    navbar: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
        paddingBottom: 0,
    },

    links: {
        marginLeft: -theme.spacing.md,
        marginRight: -theme.spacing.md,
    },

    linksInner: {
        paddingBottom: theme.spacing.md,
    },
}));

export default function IndexNavbar() {
    const { classes } = useStyles();
    // eslint-disable-next-line react/jsx-props-no-spreading
    const links = navbarItems.map((item) => <LinksGroup {...item} key={item.label} />);

    return (
        <Navbar height="100%" width={{ sm: 300 }} pl="md" pr="md" pt="sm" pb="md" className={classes.navbar}>
            <Navbar.Section grow className={classes.links} component={ScrollArea}>
                <div className={classes.linksInner}>{links}</div>
            </Navbar.Section>
        </Navbar>
    );
}
