import {
    Breadcrumbs,
    Box,
    Container,
    Group,
    Kbd,
    Paper,
    Button,
    Text,
    useMantineTheme,
    useComputedColorScheme,
} from '@mantine/core';
import * as React from 'react';
import { IconSearch } from '@tabler/icons-react';
import { useContext } from 'react';
import { openSpotlight } from '@mantine/spotlight';
import HeaderLogo from '@shared/components/Header/HeaderLogo';
import UserMenu from '@shared/components/Header/UserMenu';
import { AppContext } from '@admin/AppContext';
import { links } from '@shared/components/heaserLinks';

export default function AdminHeader() {
    const theme = useMantineTheme();
    const colorScheme = useComputedColorScheme('light');

    const linkStyle: React.CSSProperties = {
        display: 'block',
        lineHeight: 1,
        padding: '8px 12px',
        borderRadius: theme.radius.sm,
        textDecoration: 'none',
        color: colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,
    };

    const innerStyle: React.CSSProperties = {
        height: 56,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2],
    };

    const subheaderStyle: React.CSSProperties = {
        height: 42,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 25,
    };

    const spotLightStyle: React.CSSProperties = {
        minWidth: 200,
        display: 'flex',
        paddingLeft: 12,
        paddingRight: 8,
        backgroundColor: colorScheme === 'dark'
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
    };

    const headerLinks = links.map((link) => (
        <a
            key={link.label}
            href={link.link}
            style={linkStyle}
        >
            {link.label}
        </a>
    ));

    const { toolbar, breadCrumbs }: any = useContext(AppContext);

    return (
        <Box
            component="header"
            style={{ height: 100, paddingLeft: 0, paddingRight: 0, backgroundColor: 'var(--mantine-color-body)', borderBottom: '1px solid var(--mantine-color-gray-2)' }}
        >
            <Container style={innerStyle} fluid>
                <Group>
                    {/* <Burger opened={opened} onClick={toggle} size="sm" /> */}
                    <HeaderLogo />
                </Group>

                <Group>
                    <Group ml={50} gap={5}>
                        {headerLinks}
                    </Group>
                    <Button
                        onClick={() => openSpotlight()}
                        variant="default"
                        style={spotLightStyle}
                    >
                        <Group justify="space-between" style={{ minWidth: 200 }}>
                            <Group>
                                <IconSearch size={16} stroke={1} />
                                <Text c="dimmed">Search</Text>
                            </Group>

                            <Kbd
                                style={{ fontSize: 11, borderBottomWidth: 1 }}
                            >
                                ⌘ + K
                            </Kbd>
                        </Group>

                    </Button>

                    <Group gap={7}>
                        <UserMenu />
                    </Group>
                </Group>
            </Container>
            <Paper shadow="">
                <Container style={subheaderStyle} fluid>
                    <Group>
                        <Breadcrumbs>{breadCrumbs}</Breadcrumbs>
                    </Group>
                    <Group gap={4} mr="md" justify="flex-end">
                        {toolbar}
                    </Group>
                </Container>
            </Paper>
        </Box>
    );
}
