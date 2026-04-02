import * as React from 'react';
import {
    ThemeIcon,
    NavLink,
} from '@mantine/core';
import { TablerIcon } from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';

interface LinksGroupProps {
    icon: TablerIcon;
    label: string;
    link?: string,
    links?: { label: string; link: string }[];
}

export function LinksGroup({ icon: Icon, label, links, link }: LinksGroupProps) {
    const location = useLocation();
    const hasLinks = Array.isArray(links);
    const items = (hasLinks ? links : []).map((item) => (
        <NavLink
            label={item.label}
            component={Link}
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
            leftSection={
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
