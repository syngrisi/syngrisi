/* eslint-disable prefer-arrow-callback,indent,react/jsx-one-expression-per-line,no-nested-ternary */
import {
    ActionIcon,
    Box,
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
} from '@tabler/icons-react';
import { createStyles } from '@mantine/styles';
import { useEffect, useState, useRef } from 'react';
import { useToggle } from '@mantine/hooks';
import useInfinityScroll from '@shared/hooks/useInfinityScroll';

import { NavbarItems } from '@index/components/Navbar/NavbarItems';
import SkeletonWrapper from '@index/components/Navbar/Skeletons/SkeletonWrapper';
import { NavbarSort } from '@index/components/Navbar/NavbarSort';
import { useParams } from '@hooks/useParams';
import { NavbarFilter } from '@index/components/Navbar/NavbarFilter';
import { NavbarGroupBySelect } from '@index/components/Navbar/NavbarGroupBySelect';
import { useNavbarActiveItems } from '@hooks/useNavbarActiveItems';

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
    navbarWidth: number
    setNavbarWidth: React.Dispatch<React.SetStateAction<number>>
}

export default function NavbarIndex({ setBreadCrumbs, navbarWidth, setNavbarWidth }: Props) {
    const theme = useMantineTheme();
    const { classes } = useStyles();
    const { query, setQuery } = useParams();

    const scrollViewportRef = useRef<HTMLDivElement>(null);
    const startXRef = useRef(0);
    const startWidthRef = useRef(0);

    const [groupByValue, setGroupByValue] = useState(query.groupBy || 'runs');
    const [isResizing, setIsResizing] = useState(false);
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

    useEffect(() => {
        if (!isResizing) return undefined;

        const onMouseMove = (e: MouseEvent) => {
            const deltaX = e.clientX - startXRef.current;
            const newWidth = startWidthRef.current + deltaX;
            const minWidth = 260;
            const maxWidth = Math.max(420, Math.floor(window.innerWidth * 0.6));
            setNavbarWidth(Math.min(Math.max(newWidth, minWidth), maxWidth));
        };

        const onMouseUp = () => {
            setIsResizing(false);
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [isResizing]);

    return (
        <Navbar
            height="100%"
            width={{ sm: navbarWidth }}
            data-test="navbar-resizable-root"
            className={classes.navbar}
            pt={0}
            pr={2}
            pl={8}
            zIndex={10}
            styles={{
                root: {
                    zIndex: 20,
                    position: 'relative',
                },
            }}
        >
                        <Navbar.Section
                            grow
                            component={ScrollArea}
                            viewportRef={scrollViewportRef}
                            styles={{ scrollbar: { marginTop: '74px' } }}
                            pr={12}
                            pb={90}
                            data-test="navbar-scroll-area"
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
                                        aria-label="Open filter"
                                        onClick={() => toggleOpenedFilter()}
                                        mb={4}
                                    >
                                        <IconFilter stroke={1} />
                                    </ActionIcon>
                                    <ActionIcon
                                        data-test="navbar-icon-open-sort"
                                        aria-label="Open sort"
                                        onClick={() => toggleOpenedSort()}
                                        mb={4}
                                    >
                                        <IconArrowsSort stroke={1} />
                                    </ActionIcon>

                                    <ActionIcon
                                        data-test="navbar-icon-refresh"
                                        aria-label="Refresh"
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
                                            scrollRootRef={scrollViewportRef}
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
                                                data-test-navbar-ready={!infinityQuery.isFetching ? 'true' : 'false'}
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
                                scrollRootRef={scrollViewportRef}
                            />
                        </Navbar.Section>
            <Box
                data-test="navbar-resize-handle"
                onMouseDown={(e: React.MouseEvent) => {
                    e.preventDefault();
                    setIsResizing(true);
                    startXRef.current = e.clientX;
                    startWidthRef.current = navbarWidth;
                    document.body.style.userSelect = 'none';
                    document.body.style.cursor = 'col-resize';
                }}
                style={{
                    position: 'absolute',
                    top: 0,
                    right: -2,
                    width: '6px',
                    height: '100%',
                    cursor: 'col-resize',
                    zIndex: 30,
                    backgroundColor: isResizing ? 'var(--mantine-color-blue-6)' : 'transparent',
                    transition: 'background-color 0.2s',
                }}
                sx={{
                    '&:hover': {
                        backgroundColor: 'var(--mantine-color-blue-5)',
                    },
                }}
            />
        </Navbar>
    );
}
