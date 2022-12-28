/* eslint-disable no-underscore-dangle */
import {
    Breadcrumbs,
    Burger,
    Container,
    Group,
    Header,
    Kbd,
    Paper,
    Button,
    Text,
    useMantineTheme,
} from '@mantine/core';
import * as React from 'react';
import { useDisclosure, useLocalStorage, useOs } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons';
import { createStyles } from '@mantine/styles';
import { useContext, useEffect } from 'react';
import { openSpotlight } from '@mantine/spotlight';
import { useQuery } from '@tanstack/react-query';
import HeaderLogo from '../../../shared/components/Header/HeaderLogo';
import { errorMsg } from '../../../shared/utils';
import UserMenu from '../../../shared/components/Header/UserMenu';
import { AppContext } from '../../AppContext';
import { links } from '../../../shared/components/heaserLinks';
import SafeSelect from '../../../shared/components/SafeSelect';
import { GenericService } from '../../../shared/services';
import { useParams } from '../../hooks/useParams';
import { QuickFilter } from './QuickFilter';

const useStyles = createStyles((theme) => ({
    quickFilter: {
        '@media (max-width: 1024px)': {
            display: 'none',
        },
    },
    header: {
        paddingLeft: 0,
        paddingRight: 0,
        marginBottom: 120,
    },
    inner: {
        height: 56,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2],
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
    subheader: {
        height: 42,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        // paddingLeft: 25,
    },
    spotLight: {
        minWidth: 200,
        display: 'flex',
        paddingLeft: 12,
        paddingRight: 8,
        backgroundColor: theme.colorScheme === 'dark'
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark'
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
        },
    },
}));

interface Props {
    breadCrumbs: any
}

export default function HeaderIndex({ breadCrumbs }: Props) {
    const {
        toolbar,
    }: any = useContext(AppContext);

    const theme = useMantineTheme();

    const [opened, { toggle }] = useDisclosure(false);
    const { classes } = useStyles();

    // eslint-disable-next-line no-unused-vars
    const headerLinks = links.map((link) => (
        <a
            key={link.label}
            href={link.link}
            className={classes.link}
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
            staleTime: Infinity,
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
        <Header
            height={100}
            className={classes.header}
        >
            <Container className={classes.inner} fluid>
                <Group>
                    <Group>
                        <Burger opened={opened} onClick={toggle} size="sm" />
                        <HeaderLogo />
                    </Group>

                </Group>

                <Group>
                    {/* <Group ml={50} spacing={5} className={classes.links}> */}
                    {/*    {headerLinks} */}
                    {/* </Group> */}
                    <Group spacing="sm">
                        <Text size="sm">Project:</Text>
                        <SafeSelect
                            searchable
                            clearable
                            placeholder="Enter Project Name"
                            variant="unstyled"
                            data-test="current-project"
                            sx={{
                                minWidth: '150px',
                                borderWidth: '0px 0 1px 0',
                                borderStyle: 'solid',
                                borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[4],
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
                        className={classes.spotLight}
                    >
                        <Group position="apart" sx={{ minWidth: 200 }}>
                            <Group>
                                <IconSearch size={16} stroke={1} />
                                <Text color="dimmed" weight={400}>Search</Text>
                            </Group>

                            <Kbd
                                sx={{ fontSize: 11, borderBottomWidth: 1 }}
                            >
                                {
                                    useOs() === 'macos'
                                        ? (<>⌘ + K</>)
                                        : (<>Ctrl + K</>)
                                }
                            </Kbd>
                        </Group>

                    </Button>

                    <Group spacing={7}>
                        <UserMenu />
                    </Group>
                </Group>
            </Container>
            <Paper shadow="">
                <Container className={classes.subheader} fluid>
                    <Group>
                        <Group sx={{ paddingLeft: 16, width: 350 }}>
                            <Breadcrumbs data-test="bread-crumbs">{breadCrumbs}</Breadcrumbs>
                        </Group>
                        <Group>
                            <QuickFilter />
                        </Group>
                    </Group>
                    <Group spacing={4} mr="md" position="right" noWrap>
                        {toolbar}
                    </Group>
                </Container>
            </Paper>
        </Header>
    );
}
