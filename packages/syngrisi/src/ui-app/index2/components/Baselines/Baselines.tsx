/* eslint-disable prefer-arrow-callback */
import * as React from 'react';
import {
    Group,
    useMantineTheme,
    ActionIcon,
} from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { useLocalStorage } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { IconAdjustments, IconFilter } from '@tabler/icons-react';
import RefreshActionIcon from '@index/components/Tests/Table/RefreshActionIcon';
import useInfinityScroll from '@shared/hooks/useInfinityScroll';
import BaselinesTable from './Table/BaselinesTable';
import BaselinesSettings from './Table/BaselinesSettings';
import BaselinesFilter from './Table/BaselinesFilter';
import { useNavProgressFetchEffect } from '@shared/hooks';
import { useParams } from '@hooks/useParams';

interface Props {
    updateToolbar: any
}

export default function Baselines({ updateToolbar }: Props) {
    const { query } = useParams();

    const theme = useMantineTheme();

    const [searchParams, setSearchParams] = useSearchParams();
    const [sortOpen, setSortOpen] = useState(false);
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
    const baseFilter = query.base_filter ? query.base_filter : {};
    if (query.app) baseFilter.app = { $oid: query?.app || '' };

    const { firstPageQuery, infinityQuery, newestItemsQuery } = useInfinityScroll({
        baseFilterObj: baseFilter,
        filterObj: { ...query.filter, ...query.quick_filter },
        resourceName: 'baselines',
        newestItemsFilterKey: 'createdDate',
        sortBy: query.sortBy || '',
        extraOptions: {
            includeUsage: true,
            populate: 'snapshootId'
        }
    });
    useNavProgressFetchEffect(infinityQuery.isFetching);

    const [visibleFields, setVisibleFields] = useLocalStorage(
        {
            key: 'baselinesVisibleFields',
            defaultValue: [
                'preview',
                'name',
                'branch',
                'browserName',
                'viewport',
                'os',
                'createdDate',
                'usageCount',
                'markedAs',
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

    useEffect(
        function refetchData() {
            firstPageQuery.refetch();
        }, [
            query.base_filter,
            query.quick_filter,
            query.filter,
            query.app,
            query.sortBy,
        ],
    );

    return (
        <Group position="apart" align="start" noWrap>
            <BaselinesTable
                updateToolbar={updateToolbar}
                firstPageQuery={firstPageQuery}
                infinityQuery={infinityQuery}
                visibleFields={visibleFields}
                size={(sortOpen || isFilterDrawerOpen) ? '80%' : '100%'}
            />

            <BaselinesSettings
                open={sortOpen}
                setSortOpen={setSortOpen}
                visibleFields={visibleFields}
                setVisibleFields={setVisibleFields}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
            />

            <BaselinesFilter
                open={isFilterDrawerOpen}
                setOpen={setIsFilterDrawerOpen}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
            />
        </Group>
    );
}
