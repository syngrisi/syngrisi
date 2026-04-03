/* eslint-disable no-underscore-dangle */
import {
    Breadcrumbs,
    Container,
    Group,
    Box,
    Kbd,
    Paper,
    Button,
    Text,
    useMantineTheme,
    useComputedColorScheme,
} from '@mantine/core';
import * as React from 'react';
import { useLocalStorage, useOs } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { useEffect } from 'react';
import { openSpotlight } from '@mantine/spotlight';
import { useQuery } from '@tanstack/react-query';
import HeaderLogo from '@shared/components/Header/HeaderLogo';
import { errorMsg } from '@shared/utils';
import UserMenu from '@shared/components/Header/UserMenu';
import { links } from '@shared/components/heaserLinks';
import SafeSelect from '@shared/components/SafeSelect';
import { GenericService } from '@shared/services';
import { useParams } from '@hooks/useParams';
import { QuickFilter } from '@index/components/Header/QuickFilter';

interface Props {
    breadCrumbs: any
    toolbar: any
}

export default function HeaderIndex({ breadCrumbs, toolbar }: Props) {
    const theme = useMantineTheme();
    const colorScheme = useComputedColorScheme();

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

    // eslint-disable-next-line no-unused-vars
    const headerLinks = links.map((link) => (
        <a
            key={link.label}
            href={link.link}
            style={linkStyle}
        >
            {link.label}
        </a>
    ));

    const [
        currentProjectLS,
        setCurrentProjectLS,
    ] = useLocalStorage(
        {
            key: 'currentProject',
            defaultValue: '',
        },
    );

    const projectsQuery = useQuery(
        ['projects'],
        () => GenericService.get(
            'app',
            {},
            {
                limit: '0',
            },
        ),
        {
            enabled: true,
            staleTime: 5 * 60 * 1000,
            cacheTime: 10 * 60 * 1000,
            refetchOnWindowFocus: false,
            onError: (e) => {
                errorMsg({ error: e });
            },
        },
    );

    let projectSelectData: any = [];
    if (projectsQuery.data) {
        projectSelectData = projectsQuery.data?.results.map((item) => ({
            value: item._id,
            label: item.name,
        }));
    }

    const projectSelectHandler = (value: string) => {
        setCurrentProjectLS(() => value);
    };

    const { setQuery } = useParams();
    useEffect(() => {
        setQuery({ app: currentProjectLS });
    }, [currentProjectLS]);

    return (
        <Box
            component="header"
            style={{ height: 100, paddingLeft: 0, paddingRight: 0, borderBottom: '1px solid var(--mantine-color-gray-2)', backgroundColor: 'var(--mantine-color-body)' }}
        >
            <Container style={innerStyle} fluid>
                <Group>
                    <Group>
                        {/* <Burger opened={opened} onClick={toggle} size="sm" /> */}
                        <HeaderLogo />
                    </Group>

                </Group>

                <Group>
                    {/* <Group ml={50} gap={5}> */}
                    {/*    {headerLinks} */}
                    {/* </Group> */}
                    <Group gap="sm">
                        <Text size="sm">Project:</Text>
                        <SafeSelect
                            searchable
                            clearable
                            placeholder="Enter Project Name"
                            variant="unstyled"
                            data-test="current-project"
                            aria-label="Project"
                            style={{
                                minWidth: '150px',
                                borderWidth: '0px 0 1px 0',
                                borderStyle: 'solid',
                                borderColor: colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[4],
                            }}
                            styles={{
                                input: { paddingRight: '20px' },
                            }}
                            value={currentProjectLS || ''}
                            onChange={projectSelectHandler}
                            optionsData={projectSelectData}
                        />
                    </Group>
                    <Button
                        onClick={() => openSpotlight()}
                        variant="default"
                        style={spotLightStyle}
                        data-test="spotlight-button"
                        aria-label="Search"
                    >
                        <Group justify="space-between" style={{ minWidth: 200 }}>
                            <Group>
                                <IconSearch size={16} stroke={1} />
                                <Text c="dimmed" fw={400}>Search</Text>
                            </Group>

                            <Kbd
                                style={{ fontSize: 11, borderBottomWidth: 1 }}
                            >
                                {
                                    useOs() === 'macos'
                                        ? (<>&#8984; + K</>)
                                        : (<>Ctrl + K</>)
                                }
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
                        <Group style={{ paddingLeft: 16, width: 350 }}>
                            <Breadcrumbs data-test="bread-crumbs">{breadCrumbs}</Breadcrumbs>
                        </Group>
                        <Group>
                            <QuickFilter />
                        </Group>
                    </Group>
                    <Group gap={4} mr="md" justify="flex-end" wrap="nowrap">
                        {toolbar}
                    </Group>
                </Container>
            </Paper>
        </Box>
    );
}
