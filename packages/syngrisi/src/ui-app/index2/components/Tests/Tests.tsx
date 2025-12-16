/* eslint-disable prefer-arrow-callback */
import * as React from 'react';
import {
    Group,
    useMantineTheme,
    ActionIcon,
} from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { useLocalStorage, useMediaQuery } from '@mantine/hooks';
import { useEffect, useState, useRef } from 'react';
import { IconAdjustments, IconFilter } from '@tabler/icons-react';
import RefreshActionIcon from '@index/components/Tests/Table/RefreshActionIcon';
import useInfinityScroll from '@shared/hooks/useInfinityScroll';
import TestsTable from '@index/components/Tests/Table/TestsTable';
import Settings from '@index/components/Tests/Table/Settings';
import Filter from '@index/components/Tests/Table/Filter';
import { useNavProgressFetchEffect } from '@shared/hooks';
import { useParams } from '@hooks/useParams';

interface Props {
    updateToolbar: any
}

export default function Tests({ updateToolbar }: Props) {
    const { query } = useParams();

    const theme = useMantineTheme();
    // useIndexSubpageEffect('By Runs');

    const [searchParams, setSearchParams] = useSearchParams();
    const [sortOpen, setSortOpen] = useState(false);
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width: 500px)');
    const baseFilter = query.base_filter ? query.base_filter : {};
    if (query.app) baseFilter.app = { $oid: query?.app || '' };

    const { firstPageQuery, infinityQuery, newestItemsQuery } = useInfinityScroll({
        baseFilterObj: baseFilter,
        filterObj: { ...query.filter, ...query.quick_filter },
        resourceName: 'tests',
        newestItemsFilterKey: 'startDate',
        sortBy: query.sortBy || '',
    });
    useNavProgressFetchEffect(infinityQuery.isFetching);

    const [visibleFields, setVisibleFields] = useLocalStorage(
        {
            key: 'visibleFields',
            defaultValue: [
                '_id',
                'name',
                'status',
                'creatorUsername',
                'markedAs',
                'startDate',
                'browserName',
                'os',
                'viewport',
            ],
        },
    );

    useEffect(
        function addToolbarSortAndSettingsIcons() {
            updateToolbar(
                <ActionIcon
                    title="Table settings, sorting, and columns visibility"
                    aria-label="Table settings, sorting, and columns visibility"
                    color={theme.colorScheme === 'dark' ? 'green.8' : 'green.6'}
                    data-test="table-sorting"
                    variant="subtle"
                    onClick={() => {
                        setIsFilterDrawerOpen(false);
                        setSortOpen((prev) => !prev);
                    }}
                >
                    <IconAdjustments stroke={1} size={24} />
                </ActionIcon>,
                48,
            );

            updateToolbar(
                <ActionIcon
                    title="Filter the Table Data"
                    aria-label="Filter the Table Data"
                    color={theme.colorScheme === 'dark' ? 'green.8' : 'green.6'}
                    data-test="table-filtering"
                    variant="subtle"
                    onClick={() => {
                        setSortOpen(false);
                        setIsFilterDrawerOpen((prev) => !prev);
                    }}
                >
                    <IconFilter size={24} stroke={1} />
                </ActionIcon>,
                47,
            );
        },
        [],
    );

    useEffect(
        function updateRefreshIcon() {
            updateToolbar(
                <RefreshActionIcon
                    key="reload"
                    newestItemsQuery={newestItemsQuery}
                    firstPageQuery={firstPageQuery}
                    infinityQuery={infinityQuery}
                />,
                52,
            );
        },
        [
            newestItemsQuery?.data?.results.length,
            newestItemsQuery.status,
            theme.colorScheme,
        ],
    );

    // Debounce refetch to prevent race conditions when filters change rapidly
    const refetchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(
        function refetchData() {
            // Clear any pending refetch
            if (refetchTimeoutRef.current) {
                clearTimeout(refetchTimeoutRef.current);
            }

            // Debounce the refetch by 100ms to prevent multiple rapid refetches
            refetchTimeoutRef.current = setTimeout(() => {
                firstPageQuery.refetch();
            }, 100);

            return () => {
                if (refetchTimeoutRef.current) {
                    clearTimeout(refetchTimeoutRef.current);
                }
            };
        }, [
            query.base_filter,
            query.quick_filter,
            query.filter,
            query.app,
            query.sortBy,
        ],
    );

    const filterWidth = isMobile ? '100%' : '420px';
    const settingsWidth = '260px';

    let tableWidth = '100%';
    if (isFilterDrawerOpen) {
        tableWidth = isMobile ? '0%' : `calc(100% - ${filterWidth})`;
    } else if (sortOpen) {
        tableWidth = `calc(100% - ${settingsWidth})`;
    }

    return (
        <Group position="apart" align="start" noWrap>
            <TestsTable
                updateToolbar={updateToolbar}
                firstPageQuery={firstPageQuery}
                infinityQuery={infinityQuery}
                visibleFields={visibleFields}
                size={tableWidth}
            />

            <Settings
                open={sortOpen}
                setSortOpen={setSortOpen}
                visibleFields={visibleFields}
                setVisibleFields={setVisibleFields}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
            />

            <Filter
                open={isFilterDrawerOpen}
                setOpen={setIsFilterDrawerOpen}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
            />
        </Group>
    );
}
