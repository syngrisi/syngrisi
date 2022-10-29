/* eslint-disable prefer-arrow-callback,indent,react/jsx-one-expression-per-line,no-nested-ternary */
import {
    ActionIcon,
    Group,
    List,
    Navbar,
    ScrollArea,
    Text,
} from '@mantine/core';
import * as React from 'react';
import {
    IconArrowsSort,
    IconFilter,
    IconRefresh,
} from '@tabler/icons';
import { createStyles } from '@mantine/styles';
import { useEffect, useMemo, useState } from 'react';
import { useDebouncedValue, useToggle } from '@mantine/hooks';
import useInfinityScroll from '../../../shared/hooks/useInfinityScroll';

import { NavbarItems } from './NavbarItems';
import SkeletonWrapper from './Skeletons/SkeletonWrapper';
import SafeSelect from '../../../shared/components/SafeSelect';
import { NavbarSort } from './NavbarSort';
import { escapeRegExp } from '../../../shared/utils/utils';
import { useParams } from '../../hooks/useParams';
import { NavbarFilter } from './NavbarFilter';
import { useIndexSubpageEffect } from '../../hooks/useIndexSubpageEffect';

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

export default function IndexNavbar() {
    const { classes } = useStyles();
    const [activeItems, setActiveItems] = useState<string[]>([]);
    const activeItemsHandler = {
        get: () => activeItems,
        addOrRemove: (item: string) => {
            setActiveItems(
                (prevItems: any[]) => {
                    const newItems = [...prevItems];
                    if (newItems.includes(item)) {
                        return newItems.filter((x) => x !== item);
                    }
                    return newItems.concat(item);
                },
            );
        },
        clear: () => {
            setActiveItems(() => []);
        },
        navbarItemClass: () => classes.navbarItem,
        activeNavbarItemClass: () => classes.activeNavbarItem,
    };

    const [sortBy, setSortBy] = useState('createdDate');
    const [sortOrder, setSortOrder] = useState('desc');

    const { query, setQuery } = useParams();
    const [groupByValue, setGroupByValue] = useState(query.groupBy || 'runs');

    const handleGroupBySelect = (value: string) => {
        setActiveItems(() => []);
        setGroupByValue(value);
        setQuery({ base_filter: {} });
    };

    const [quickFilter, setQuickFilter] = useState<string>('');
    const [debouncedQuickFilter] = useDebouncedValue(quickFilter, 400);

    const quickFilterKey = (value: string) => {
        const transform = {
            runs: 'name',
            suites: 'name',
            'test-distinct/browserName': 'browserName',
            'test-distinct/os': 'os',
            'test-distinct/status': 'status',
            'test-distinct/markedAs': 'markedAs',
        } as { [key: string]: string };
        return transform[value] || 'name';
    };

    const quickFilterObject = useMemo<{ [key: string]: any } | undefined>(() => {
        if (!debouncedQuickFilter) return ({});
        return ({ [quickFilterKey(groupByValue)]: { $regex: escapeRegExp(debouncedQuickFilter), $options: 'im' } });
    }, [debouncedQuickFilter]);

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
        sortBy: `${sortBy}:${sortOrder}`,
    });

    // useEffect(function oneTime() {
    //     setQuery({ groupBy: groupByValue });
    //     firstPageQuery.refetch();
    // }, []);

    useEffect(function onGroupByChange() {
        setQuery({ groupBy: groupByValue });
        setQuery({ base_filter: null });
        setActiveItems(() => ([]));
    }, [groupByValue]);

    useEffect(function refetch() {
        firstPageQuery.refetch();
    }, [
        query?.app,
        query?.groupBy,
        JSON.stringify(quickFilterObject),
        `${sortBy}:${sortOrder}`,
    ]);

    const refreshIconClickHandler = () => {
        setQuery({ base_filter: null });
        firstPageQuery.refetch();
        activeItemsHandler.clear();
    };

    const subpageMap: { [key: string]: string } = {
        runs: 'By Runs',
        suites: 'By Suites',
        'test-distinct/browserName': 'By Browser',
        'test-distinct/os': 'By Platform',
        'test-distinct/status': 'By Test Status',
        'test-distinct/markedAs': 'By Accept Status',
    };

    const title: string = query?.groupBy;
    useIndexSubpageEffect(subpageMap[title] || 'Test Results');

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
                        >
                            <Group position="apart" align="end" sx={{ width: '100%' }}>
                                <SafeSelect
                                    label="Group by"
                                    data-test="navbar-group-by"
                                    value={groupByValue}
                                    onChange={handleGroupBySelect}
                                    optionsData={[
                                        { value: 'runs', label: 'Runs' },
                                        { value: 'suites', label: 'Suites' },
                                        { value: 'test-distinct/browserName', label: 'Browsers' },
                                        { value: 'test-distinct/os', label: 'Platform' },
                                        // { value: 'test-distinct/viewport', label: 'Viewport' },
                                        { value: 'test-distinct/status', label: 'Test Status' },
                                        { value: 'test-distinct/markedAs', label: 'Accept Status' },
                                    ]}
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
                                    sortBy={sortBy}
                                    setSortBy={setSortBy}
                                    setSortOrder={setSortOrder}
                                    sortOrder={sortOrder}
                                    openedSort={openedSort}
                                />
                            </Group>

                            <Group sx={{ width: '100%' }}>
                                <NavbarFilter
                                    openedFilter={openedFilter}
                                    quickFilter={quickFilter}
                                    setQuickFilter={setQuickFilter}
                                    debouncedQuickFilter={debouncedQuickFilter}
                                    infinityQuery={infinityQuery}
                                    toggleOpenedFilter={toggleOpenedFilter}
                                />
                            </Group>

                            {
                                infinityQuery.status === 'loading'
                                    ? (
                                        <SkeletonWrapper infinityQuery={null} itemType={groupByValue} num={20} />
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
                            <SkeletonWrapper infinityQuery={infinityQuery} />
                        </Navbar.Section>
                    </Navbar>
                )
            }
        </Group>
    );
}
