/* eslint-disable */
import * as React from 'react';
import {
    Text,
    Group,
    useMantineTheme,
    ActionIcon,
} from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { useLocalStorage } from '@mantine/hooks';
import { useEffect, useContext, useState } from 'react';
import { useSubpageEffect } from '../../hooks/useSubpageEffect';
import { AppContext } from '../../AppContext';
import RefreshActionIcon from './RefreshActionIcon';
import useInfinityScroll from '../../../shared/hooks/useInfinityScroll';
import TestsTable from './Table/TestsTable';
import TestsTableSettings from './Table/TestsTableSettings';
import { IconAdjustments, IconFilter } from '@tabler/icons';
import TestsTableFilter from './Table/TestsTableFilter';
import { useNavProgressFetchEffect } from '../../../shared/hooks';
import { useParams } from '../../hooks/useParams';

/**
 * example:
 * [
 *    level: {$eq, 'debug'},
 *    level: {$ne, 'warn'},
 *    message: {$regex, 'test'}
 * ]
 */
interface IFilterSet {
    [key: string]: any
}

export default function Tests() {
    const { toolbar, setToolbar, updateToolbar }: any = useContext(AppContext);
    const { query, setQuery } = useParams();

    const theme = useMantineTheme();
    useSubpageEffect('Test Results');

    const [searchParams, setSearchParams] = useSearchParams();
    const [sortOpen, setSortOpen] = useState(false);
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
    const baseFilter = query['base_filter'] ? query['base_filter'] : {};
    if (query.app) baseFilter.app = { $oid: query?.app || '' }

    const { firstPageQuery, infinityQuery, newestItemsQuery } = useInfinityScroll({
        baseFilterObj: baseFilter,
        filterObj: query.filter,
        resourceName: 'tests',
        newestItemsFilterKey: 'startDate',
        sortBy: query['sortBy'] || ''
    })
    useNavProgressFetchEffect(infinityQuery.isFetching);

    const [visibleFields, setVisibleFields] = useLocalStorage({
        key: 'visibleFields',
        defaultValue: ['_id', 'name', 'creatorUsername', 'markedAs', 'startDate', 'browserName', 'os', 'viewport'],
    });

    useEffect(function oneTime() {
        firstPageQuery.refetch();
        updateToolbar(
            <ActionIcon
                title="Table settings, sorting, and columns visibility"
                color={theme.colorScheme === 'dark' ? 'green.8' : 'green.6'}
                data-test="table-sorting"
                variant="subtle"
                onClick={() => {
                    setSortOpen((prev) => !prev)
                }}
            >
                <IconAdjustments stroke={1} size={24} />
            </ActionIcon>,
            48
        );

        updateToolbar(
            <ActionIcon
                title="Filter the Table Data"
                color={theme.colorScheme === 'dark' ? 'green.8' : 'green.6'}
                data-test="table-filtering"
                variant="subtle"
                onClick={() => {
                    setIsFilterDrawerOpen((prev) => !prev)
                }}
            >
                <IconFilter size={24} stroke={1} />
            </ActionIcon>,
            47
        );
    }, []);

    useEffect(function addReloadIcon() {
        updateToolbar(
            <RefreshActionIcon key="reload" newestItemsQuery={newestItemsQuery} firstPageQuery={firstPageQuery}
                               infinityQuery={infinityQuery} />,
            50
        );
    }, [newestItemsQuery?.data?.results.length, newestItemsQuery.status, theme.colorScheme]);

    useEffect(function refetch() {
        firstPageQuery.refetch();
    }, [
        query.base_filter,
        query.filter,
        query.app,
        query.sortBy,
    ]);

    return (
        <>
            <Group position="apart" align="start" noWrap>
                {infinityQuery.status === 'loading'
                    // ? (<LoadingOverlay visible={true} />)
                    ? ('')
                    : infinityQuery.status === 'error'
                        ? (<Text color="red">Error: {infinityQuery.error.message}</Text>)
                        : (
                            <>
                                <TestsTable
                                    infinityQuery={infinityQuery}
                                    visibleFields={visibleFields}
                                />
                            </>
                        )}
                <TestsTableSettings
                    open={sortOpen}
                    setSortOpen={setSortOpen}
                    visibleFields={visibleFields}
                    setVisibleFields={setVisibleFields}
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                />

                <TestsTableFilter
                    open={isFilterDrawerOpen}
                    setOpen={setIsFilterDrawerOpen}
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                />
            </Group>
        </>
    );
}
