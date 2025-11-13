/* eslint-disable prefer-arrow-callback,react/jsx-one-expression-per-line */
import * as React from 'react';
import {
    Text,
    Group,
    useMantineTheme,
    ActionIcon, Table,
} from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { useEffect, useContext, useState } from 'react';
import { IconAdjustments, IconFilter } from '@tabler/icons-react';
import { JsonParam, StringParam, useQueryParams } from 'use-query-params';
import { useSubpageEffect, useNavProgressFetchEffect } from '../../../shared/hooks';
import { AppContext } from '../../AppContext';
import RefreshActionIcon from './RefreshActionIcon';
import useInfinityScroll from '../../../shared/hooks/useInfinityScroll';
import AdminLogsTable from './Table/AdminLogsTable';
import AdminLogsTableSettings from './Table/AdminLogsTableSettings';
import AdminLogsTableFilter from './Table/AdminLogsTableFilter';
import InfinityScrollSkeletonFiller from './Table/InfinityScrollSkeletonFIller';

/**
 * example:
 * [
 *    level: {$eq, 'debug'},
 *    level: {$ne, 'warn'},
 *    message: {$regex, 'test'}
 * ]
 */
// interface IFilterSet {
//     [key: string]: any
// }

export default function AdminLogs() {
    const { updateToolbar }: any = useContext(AppContext);
    const [query] = useQueryParams({
        groupBy: StringParam,
        sortBy: StringParam,
        filter: JsonParam,
        base_filter: JsonParam,
    });

    const theme = useMantineTheme();
    useSubpageEffect('Logs');

    const [sortOpen, setSortOpen] = useState(false);
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
    const { firstPageQuery, infinityQuery, newestItemsQuery } = useInfinityScroll({
        resourceName: 'logs',
        filterObj: query.filter,
        newestItemsFilterKey: 'timestamp',
        sortBy: query.sortBy || '',
    });
    useNavProgressFetchEffect(infinityQuery.isFetching);

    const [visibleFields, setVisibleFields] = useLocalStorage({
        key: 'visibleFields', defaultValue: ['_id', 'level', 'message', 'timestamp', 'meta.user'],
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
                color={theme.colorScheme === 'dark' ? 'green.8' : 'green.6'}
                data-test="table-filtering"
                variant="subtle"
                onClick={() => {
                    setIsFilterDrawerOpen((prev) => !prev);
                }}
            >
                <IconFilter size={24} stroke={1} />
            </ActionIcon>,
            47,
        );
    }, []);

    useEffect(function addReloadIcon() {
        updateToolbar(
            <RefreshActionIcon
                key="reload"
                newestItemsQuery={newestItemsQuery}
                firstPageQuery={firstPageQuery}
                infinityQuery={infinityQuery}
            />,
            50,
        );
    }, [newestItemsQuery?.data?.results.length, newestItemsQuery.status, theme.colorScheme]);

    useEffect(function filterSortUpdate() {
        firstPageQuery.refetch();
    }, [
        JSON.stringify(query.filter),
        JSON.stringify(query.sortBy),
    ]);

    return (
        <Group position="apart" align="start" noWrap>
            {/* eslint-disable-next-line no-nested-ternary */}
            {infinityQuery.status === 'loading'
                ? (
                    <Table>
                        <InfinityScrollSkeletonFiller visibleFields={visibleFields} />
                    </Table>
                )
                : infinityQuery.status === 'error'
                    ? (<Text color="red">Error: {infinityQuery.error.message}</Text>)
                    : (
                        <AdminLogsTable
                            infinityQuery={infinityQuery}
                            visibleFields={visibleFields}
                        />
                    )}
            <AdminLogsTableSettings
                open={sortOpen}
                setSortOpen={setSortOpen}
                visibleFields={visibleFields}
                setVisibleFields={setVisibleFields}
            />

            <AdminLogsTableFilter
                open={isFilterDrawerOpen}
                setOpen={setIsFilterDrawerOpen}
            />
        </Group>
    );
}
