/* eslint-disable prefer-arrow-callback,indent,react/jsx-one-expression-per-line,no-nested-ternary */
import {
    ActionIcon,
    Group,
    List,
    Navbar,
    ScrollArea,
    Text,
    useMantineTheme,
} from '@mantine/core';
import * as React from 'react';
import {
    IconArrowsSort,
    IconFilter,
    IconRefresh,
} from '@tabler/icons';
import { createStyles } from '@mantine/styles';
import { useEffect, useState } from 'react';
import { useToggle } from '@mantine/hooks';
import useInfinityScroll from '../../../shared/hooks/useInfinityScroll';

import { NavbarItems } from './NavbarItems';
import SkeletonWrapper from './Skeletons/SkeletonWrapper';
import { NavbarSort } from './NavbarSort';
import { useParams } from '../../hooks/useParams';
import { NavbarFilter } from './NavbarFilter';
import { NavbarGroupBySelect } from './NavbarGroupBySelect';
import { useNavbarActiveItems } from '../../hooks/useNavbarActiveItems';

const useStyles = createStyles((theme) => ({
    navbar: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.xs,
        paddingTop: theme.spacing.sm,
        paddingBottom: theme.spacing.md,
    },
    navbarItem: {
        display: 'block',
        textDecoration: 'none',
        color: theme.colorScheme === 'dark' ? theme.colors.red[0] : theme.black,
        borderBottom: `1px solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]
        }`,
        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
            color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        },
    },
    activeNavbarItem: {
        backgroundColor: theme.colorScheme === 'dark' ? 'rgba(47, 158, 68, 0.2)' : 'rgba(235, 251, 238, 1)',
        color: theme.colorScheme === 'dark' ? theme.colors.green[2] : theme.colors.green[6],
        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? 'rgba(47, 158, 68, 0.2)' : 'rgba(235, 251, 238, 1)',
            color: theme.colorScheme === 'dark' ? theme.colors.green[2] : theme.colors.green[6],
        },
    },
}));

interface Props {
    setBreadCrumbs: any
}

export default function NavbarIndex({ setBreadCrumbs }: Props) {
    const theme = useMantineTheme();
    const { classes } = useStyles();
    const { query, setQuery } = useParams();

    const [groupByValue, setGroupByValue] = useState(query.groupBy || 'runs');
    const activeItemsHandler = useNavbarActiveItems({ groupByValue, classes });

    const [quickFilterObject, setQuickFilterObject] = useState<{ [key: string]: any }>({});

    const navbarFilterObject = query?.app
        ? {
            app: { $oid: query?.app || '' },
            ...quickFilterObject,
        }
        : quickFilterObject;

    const [openedFilter, toggleOpenedFilter] = useToggle([false, true]);
    const [openedSort, toggleOpenedSort] = useToggle([false, true]);

    const getNewestFilter = (item: string) => {
        const transform = {
            runs: 'createdDate',
            suites: 'createdDate',
        };
        return transform[item as keyof typeof transform] || '';
    };

    const { firstPageQuery, infinityQuery } = useInfinityScroll({
        resourceName: groupByValue,
        filterObj: query.filter,
        newestItemsFilterKey: getNewestFilter(groupByValue),
        baseFilterObj: navbarFilterObject,
        sortBy: query.sortByNavbar!,
    });

    useEffect(function refetch() {
        firstPageQuery.refetch();
    }, [
        query?.app,
        query?.groupBy,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        JSON.stringify(navbarFilterObject),
        query.sortByNavbar,
    ]);

    const refreshIconClickHandler = () => {
        setQuery({ base_filter: null });
        firstPageQuery.refetch();
        activeItemsHandler.clear();
    };

    return (
        <Group position="apart" align="start" noWrap>
            {
                (
                    <Navbar
                        height="100%"
                        width={{ sm: 350 }}
                        className={classes.navbar}
                        pt={0}
                        pr={2}
                        pl={8}
                        zIndex={10}
                        styles={{
                            root: {
                                zIndex: 20,
                            },
                        }}
                    >
                        <Navbar.Section
                            grow
                            component={ScrollArea}
                            styles={{ scrollbar: { marginTop: '74px' } }}
                            pr={12}
                            pb={90}
                        >
                            <Group
                                position="apart"
                                align="end"
                                sx={
                                    {
                                        width: '100%',
                                        position: 'sticky',
                                        top: 0,
                                        zIndex: 20,
                                        backgroundColor: theme.colorScheme === 'dark'
                                            ? theme.colors.dark[6]
                                            : theme.white,
                                    }
                                }
                            >
                                <NavbarGroupBySelect
                                    setBreadCrumbs={setBreadCrumbs}
                                    clearActiveItems={activeItemsHandler.clear}
                                    groupByValue={groupByValue}
                                    setGroupByValue={setGroupByValue}
                                />

                                <Group spacing={4}>
                                    <ActionIcon
                                        data-test="navbar-icon-open-filter"
                                        onClick={() => toggleOpenedFilter()}
                                        mb={4}
                                    >
                                        <IconFilter stroke={1} />
                                    </ActionIcon>
                                    <ActionIcon
                                        data-test="navbar-icon-open-sort"
                                        onClick={() => toggleOpenedSort()}
                                        mb={4}
                                    >
                                        <IconArrowsSort stroke={1} />
                                    </ActionIcon>

                                    <ActionIcon
                                        data-test="navbar-icon-refresh"
                                        onClick={() => refreshIconClickHandler()}
                                        mb={4}
                                    >
                                        <IconRefresh stroke={1} />
                                    </ActionIcon>
                                </Group>
                            </Group>

                            <Group sx={{ width: '100%' }}>
                                <NavbarSort
                                    groupBy={groupByValue}
                                    toggleOpenedSort={toggleOpenedSort}
                                    openedSort={openedSort}
                                />
                            </Group>

                            <Group sx={{ width: '100%' }}>
                                <NavbarFilter
                                    openedFilter={openedFilter}
                                    setQuickFilterObject={setQuickFilterObject}
                                    groupByValue={groupByValue}
                                    infinityQuery={infinityQuery}
                                    toggleOpenedFilter={toggleOpenedFilter}
                                />
                            </Group>

                            {
                                infinityQuery.status === 'loading'
                                    ? (
                                        <SkeletonWrapper
                                            infinityQuery={null}
                                            itemType={groupByValue}
                                            num={20}
                                            itemClass={classes.navbarItem}
                                        />
                                    )
                                    : infinityQuery.status === 'error'
                                        ? (<Text color="red">Error: {infinityQuery.error.message}</Text>)
                                        : (
                                            <List
                                                size="md"
                                                listStyleType="none"
                                                sx={{ width: '100%' }}
                                                styles={{ itemWrapper: { width: '100%' } }}
                                                pt={4}
                                            >
                                                {/* eslint-disable-next-line max-len */}
                                                <NavbarItems
                                                    infinityQuery={infinityQuery}
                                                    groupByValue={groupByValue}
                                                    activeItemsHandler={activeItemsHandler}
                                                />
                                            </List>
                                        )
                            }
                            <SkeletonWrapper
                                itemType={groupByValue}
                                infinityQuery={infinityQuery}
                                itemClass={classes.navbarItem}
                            />
                        </Navbar.Section>
                    </Navbar>
                )
            }
        </Group>
    );
}
