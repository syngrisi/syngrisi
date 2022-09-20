import * as React from 'react';
import {
    ThemeIcon,
    createStyles,
    NavLink,
} from '@mantine/core';
import { TablerIcon } from '@tabler/icons';
import { Link, useLocation } from 'react-router-dom';

const useStyles = createStyles((theme) => ({
    control: {
        fontWeight: 500,
        display: 'block',
        width: '100%',
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
        fontSize: theme.fontSizes.sm,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
            color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        },
    },

    link: {
        display: 'block',
        textDecoration: 'none',
        fontSize: theme.fontSizes.sm,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
        borderLeft: `1px solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
        }`,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
            color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        },
    },
    rootLink: {
        display: 'block',
        textDecoration: 'none',
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
            color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        },
        '&:active': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
            color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        },
    },

    chevron: {
        transition: 'transform 200ms ease',
    },
}));

interface LinksGroupProps {
    icon: TablerIcon;
    label: string;
    link?: string,
    links?: { label: string; link: string }[];
}

export function LinksGroup({ icon: Icon, label, links, link }: LinksGroupProps) {
    const location = useLocation();
    const { classes } = useStyles();
    const hasLinks = Array.isArray(links);
    const items = (hasLinks ? links : []).map((item) => (
        <NavLink
            label={item.label}
            component={Link}
            className={classes.link}
            to={item.link}
            key={item.label}
            active={location.pathname === item.link}
        />
    ));

    return (
        <NavLink
            label={label}
            component={Link}
            styles={
                () => ({
                    body: {
                        display: 'flex',
                    },
                })
            }
            to={link || '/'}
            active={location.pathname === link}
            icon={
                (
                    <ThemeIcon variant="light" size={30}>
                        <Icon size={18} />
                    </ThemeIcon>
                )
            }
            childrenOffset={26}
        >
            {items.length > 0 ? items : ''}
        </NavLink>
    );
}
