import {
    Autocomplete,
    Burger,
    Group,
    Header, useMantineTheme,
} from '@mantine/core';
import * as React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons';
import { createStyles } from '@mantine/styles';
import useColorScheme from '../../../shared/hooks/useColorSheme';
import ToggleThemeButton from '../../../shared/components/ToggleThemeButton';
import HeaderLogo from './HeaderLogo';
import { isDark } from '../../../shared/utils';
import UserMenu from './UserMenu';

const useStyles = createStyles((theme) => ({
    header: {
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.md,
    },

    inner: {
        height: 56,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    links: {
        [theme.fn.smallerThan('md')]: {
            display: 'none',
        },
    },

    search: {
        [theme.fn.smallerThan('xs')]: {
            display: 'none',
        },
    },

    link: {
        display: 'block',
        lineHeight: 1,
        padding: '8px 12px',
        borderRadius: theme.radius.sm,
        textDecoration: 'none',
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        },
    },
}));

const links = [
    { label: 'Dashboard', link: '/' },
    { label: 'Admin Panel', link: '/admin' },
];

export default function AdminHeader() {
    const [colorScheme, toggleColorScheme] = useColorScheme();

    const [opened, { toggle }] = useDisclosure(false);
    const { classes } = useStyles();

    const items = links.map((link) => (
        <a
            key={link.label}
            href={link.link}
            className={classes.link}
            onClick={(event) => event.preventDefault()}
        >
            {link.label}
        </a>
    ));
    const theme = useMantineTheme();
    return (
        <Header
            height={56}
            className={classes.header}
            mb={120}
            sx={
                {
                    backgroundColor: isDark() ? theme.colors.dark[5] : theme.colors.gray[2],
                }
            }
        >
            <div className={classes.inner}>
                <Group>
                    <Burger opened={opened} onClick={toggle} size="sm" />
                    <HeaderLogo />
                </Group>

                <Group>
                    <Group ml={50} spacing={5} className={classes.links}>
                        {items}
                    </Group>
                    <Autocomplete
                        className={classes.search}
                        placeholder="Search"
                        icon={<IconSearch size={16} stroke={1.5} />}
                        data={['React', 'Angular', 'Vue', 'Next.js', 'Riot.js', 'Svelte', 'Blitz.js']}
                    />

                    <Group spacing={7}>
                        <UserMenu />
                    </Group>

                    <Group>
                        <ToggleThemeButton colorScheme={colorScheme} toggleColorScheme={toggleColorScheme} />
                    </Group>
                </Group>
            </div>
        </Header>
    );
}
