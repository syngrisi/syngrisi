/* eslint-disable prefer-arrow-callback,indent,react/jsx-one-expression-per-line,no-nested-ternary */
import {
    ActionIcon,
    Box,
    Group,
    List,
    ScrollArea,
    Text,
    useMantineTheme,
    useComputedColorScheme,
} from '@mantine/core';
import * as React from 'react';
import {
    IconArrowsSort,
    IconFilter,
    IconRefresh,
} from '@tabler/icons-react';
import { useCallback, useEffect, useState, useRef } from 'react';
import { useToggle } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import useInfinityScroll from '@shared/hooks/useInfinityScroll';
import { GenericService } from '@shared/services';

import { NavbarItems } from '@index/components/Navbar/NavbarItems';
import SkeletonWrapper from '@index/components/Navbar/Skeletons/SkeletonWrapper';
import { NavbarSort } from '@index/components/Navbar/NavbarSort';
import { useParams } from '@hooks/useParams';
import { NavbarFilter } from '@index/components/Navbar/NavbarFilter';
import { NavbarGroupBySelect } from '@index/components/Navbar/NavbarGroupBySelect';
import { useNavbarActiveItems } from '@hooks/useNavbarActiveItems';
import { errorMsg } from '@shared/utils';

function getNavbarStyles(theme: any, colorScheme: 'light' | 'dark') {
    return `
        .syngrisi-navbar {
            background-color: ${colorScheme === 'dark' ? theme.colors.dark[6] : theme.white};
            padding-left: ${theme.spacing.md};
            padding-right: ${theme.spacing.xs};
            padding-top: ${theme.spacing.sm};
            padding-bottom: ${theme.spacing.md};
        }
        .syngrisi-navbar-item {
            display: block;
            text-decoration: none;
            color: ${colorScheme === 'dark' ? theme.colors.red[0] : theme.black};
            border-bottom: 1px solid ${colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]};
        }
        .syngrisi-navbar-item:hover {
            background-color: ${colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0]};
            color: ${colorScheme === 'dark' ? theme.white : theme.black};
        }
        .syngrisi-navbar-active-item {
            background-color: ${colorScheme === 'dark' ? 'rgba(47, 158, 68, 0.2)' : 'rgba(235, 251, 238, 1)'};
            color: ${colorScheme === 'dark' ? theme.colors.green[2] : theme.colors.green[6]};
        }
        .syngrisi-navbar-active-item:hover {
            background-color: ${colorScheme === 'dark' ? 'rgba(47, 158, 68, 0.2)' : 'rgba(235, 251, 238, 1)'};
            color: ${colorScheme === 'dark' ? theme.colors.green[2] : theme.colors.green[6]};
        }
    `;
}

interface Props {
    setBreadCrumbs: any
    navbarWidth: number
    setNavbarWidth: React.Dispatch<React.SetStateAction<number>>
}

export default function NavbarIndex({ setBreadCrumbs, navbarWidth, setNavbarWidth }: Props) {
    const theme = useMantineTheme();
    const colorScheme = useComputedColorScheme();

    const classes = {
        navbarItem: 'syngrisi-navbar-item',
        activeNavbarItem: 'syngrisi-navbar-active-item',
    };

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

    const { firstPageQuery, infinityQuery, refresh } = useInfinityScroll({
        resourceName: groupByValue,
        newestItemsFilterKey: getNewestFilter(groupByValue),
        newestItemsEnabled: query.modalIsOpen !== 'true',
        baseFilterObj: navbarFilterObject,
        sortBy: query.sortByNavbar!,
    });

    const visibleRunIds = groupByValue === 'runs'
        ? Array.from(new Set(
            (infinityQuery.data?.pages || [])
                .flatMap((page: any) => page.results || [])
                .map((item: any) => item?._id)
                .filter(Boolean),
        ))
        : [];

    const runStatusesQuery = useQuery({
        queryKey: [
            'navbar_run_statuses',
            visibleRunIds.join(','),
        ],
        queryFn: () => GenericService.get(
            'tests',
            {
                run: { $in: visibleRunIds },
            },
            {
                limit: '0',
            },
            'navbar_run_statuses',
        ),
        enabled: groupByValue === 'runs' && visibleRunIds.length > 0,
        staleTime: 30 * 1000,
        refetchOnWindowFocus: false,
    });

    const testsStatusesByRun = React.useMemo(() => {
        const map: Record<string, string[]> = {};
        const tests = runStatusesQuery.data?.results || [];

        tests.forEach((test: any) => {
            const runId = test?.run?._id || test?.run;
            if (!runId) return;
            if (!map[runId]) map[runId] = [];
            if (test.status) map[runId].push(test.status);
        });

        visibleRunIds.forEach((runId) => {
            if (!map[runId]) map[runId] = [];
        });

        return map;
    }, [runStatusesQuery.data?.timestamp, visibleRunIds.join(',')]);

    useEffect(function refetch() {
        refresh();
    }, [
        query?.app,
        query?.groupBy,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        JSON.stringify(navbarFilterObject),
        query.sortByNavbar,
        refresh,
    ]);

    const refreshIconClickHandler = useCallback(() => {
        setQuery({ base_filter: null });
        refresh();
        activeItemsHandler.clear();
    }, [setQuery, firstPageQuery, activeItemsHandler]);

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

    const stickyGroupStyle: React.CSSProperties = {
        width: '100%',
        position: 'sticky',
        top: 0,
        zIndex: 20,
        backgroundColor: colorScheme === 'dark'
            ? theme.colors.dark[6]
            : theme.white,
    };

    return (
        <Box
            component="nav"
            data-test="navbar-resizable-root"
            className="syngrisi-navbar"
            style={{
                height: '100vh',
                width: navbarWidth,
                position: 'relative',
                paddingTop: 0,
                paddingRight: 2,
                paddingLeft: 8,
                zIndex: 20,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                borderRight: `1px solid ${colorScheme === 'dark' ? theme.colors.dark[4] : 'var(--mantine-color-gray-2)'}`,
            }}
        >
            <style>{getNavbarStyles(theme, colorScheme)}</style>
            <ScrollArea
                viewportRef={scrollViewportRef}
                styles={{ scrollbar: { marginTop: '74px' } }}
                pr={12}
                pb={90}
                data-test="navbar-scroll-area"
                style={{ flexGrow: 1, height: '100%' }}
                onBottomReached={() => {
                    if (infinityQuery.hasNextPage && !infinityQuery.isFetchingNextPage) {
                        infinityQuery.fetchNextPage();
                    }
                }}
            >
                <Group
                    justify="space-between"
                    align="end"
                    style={stickyGroupStyle}
                >
                    <NavbarGroupBySelect
                        setBreadCrumbs={setBreadCrumbs}
                        clearActiveItems={activeItemsHandler.clear}
                        groupByValue={groupByValue}
                        setGroupByValue={setGroupByValue}
                    />

                    <Group gap={4}>
                        <ActionIcon
                            data-test="navbar-icon-open-filter"
                            aria-label="Open filter"
                            variant="subtle"
                            color="gray"
                            onClick={() => toggleOpenedFilter()}
                            mb={4}
                        >
                            <IconFilter stroke={1} />
                        </ActionIcon>
                        <ActionIcon
                            data-test="navbar-icon-open-sort"
                            aria-label="Open sort"
                            variant="subtle"
                            color="gray"
                            onClick={() => toggleOpenedSort()}
                            mb={4}
                        >
                            <IconArrowsSort stroke={1} />
                        </ActionIcon>

                        <ActionIcon
                            data-test="navbar-icon-refresh"
                            aria-label="Refresh"
                            variant="subtle"
                            color="gray"
                            onClick={() => refreshIconClickHandler()}
                            mb={4}
                        >
                            <IconRefresh stroke={1} />
                        </ActionIcon>
                    </Group>
                </Group>

                <Group style={{ width: '100%' }}>
                    <NavbarSort
                        groupBy={groupByValue}
                        toggleOpenedSort={toggleOpenedSort}
                        openedSort={openedSort}
                    />
                </Group>

                <Group style={{ width: '100%' }}>
                    <NavbarFilter
                        openedFilter={openedFilter}
                        setQuickFilterObject={setQuickFilterObject}
                        groupByValue={groupByValue}
                        infinityQuery={infinityQuery}
                        toggleOpenedFilter={toggleOpenedFilter}
                    />
                </Group>

                {
                    infinityQuery.status === 'pending'
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
                            ? (<Text c="red">Error: {infinityQuery.error.message}</Text>)
                            : (
                                <List
                                    size="md"
                                    listStyleType="none"
                                    style={{ width: '100%' }}
                                    styles={{ itemWrapper: { width: '100%' } }}
                                    pt={4}
                                    data-test-navbar-ready={!infinityQuery.isFetching ? 'true' : 'false'}
                                >
                                    {/* eslint-disable-next-line max-len */}
                                    <NavbarItems
                                        infinityQuery={infinityQuery}
                                        groupByValue={groupByValue}
                                        activeItemsHandler={activeItemsHandler}
                                        testsStatusesByRun={testsStatusesByRun}
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
            </ScrollArea>
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
                className="syngrisi-navbar-resize-handle"
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
            />
            <style>{`
                .syngrisi-navbar-resize-handle:hover {
                    background-color: var(--mantine-color-blue-5);
                }
            `}</style>
        </Box>
    );
}
