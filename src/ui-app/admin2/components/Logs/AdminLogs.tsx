/* eslint-disable */
import * as React from 'react';
import {
    Text,
    Group,
    LoadingOverlay,
    useMantineTheme,
    ActionIcon,
} from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { useInputState, useLocalStorage } from '@mantine/hooks';
import { useEffect, useContext, useState } from 'react';
import { useSubpageEffect } from '../../../shared/hooks/useSubpageEffect';
import { AppContext } from '../../AppContext';
import RefreshActionIcon from './RefreshActionIcon';
import useInfinityScroll from '../../../shared/hooks/useInfinityScroll';
import AdminLogsTable from './Table/AdminLogsTable';
import AdminLogsTableSettings from './Table/AdminLogsTableSettings';
import { MdSort } from 'react-icons/all';
import { IconFilter } from '@tabler/icons';
import AdminLogsTableFilter from './Table/AdminLogsTableFilter';

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

export default function AdminLogs() {
    const theme = useMantineTheme();
    useSubpageEffect('Logs');

    const [searchParams, setSearchParams] = useSearchParams('');
    const [sortOpen, setSortOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [filter, setFilter] = useInputState('{}');
    const [filterSet, setFilterSet] = useInputState(new Set<IFilterSet>([]));
    const { toolbar, setToolbar, updateToolbar }: any = useContext(AppContext);
    const { firstPageQuery, infinityQuery, newestItemsQuery } = useInfinityScroll(searchParams, filter)

    const updateFilterSet = (
        value: { [key: string]: any }
    ) => {
        setFilterSet((current) => {
            const newSet = new Set(Array.from(current));
            newSet.add(value);
        })
    }
    useEffect(function syncFilterObject() {
        // console.log('👹', filterSet);
    }, [JSON.stringify(filterSet)]);


    useEffect(() => {
        firstPageQuery.refetch();
        updateToolbar(
            <ActionIcon
                title="Sort table"
                color={theme.colorScheme === 'dark' ? 'green.8' : 'green.6'}

                variant="subtle"
                onClick={() => {
                    setSortOpen((prev) => !prev)
                }}
            >
                <MdSort size={24} />
            </ActionIcon>,
            3
        );

        updateToolbar(
            <ActionIcon
                title="Sort table"
                color={theme.colorScheme === 'dark' ? 'green.8' : 'green.6'}

                variant="subtle"
                onClick={() => {
                    setFilterOpen((prev) => !prev)
                }}
            >
                <IconFilter size={24} stroke={1} />
            </ActionIcon>,
            2
        );

        // console.log(searchParams)
    }, []);

    useEffect(() => {
        updateToolbar(
            <RefreshActionIcon key="reload" newestItemsQuery={newestItemsQuery} firstPageQuery={firstPageQuery}
                               infinityQuery={infinityQuery} />,
            5
        );
    }, [newestItemsQuery?.data?.results.length, newestItemsQuery.status, theme.colorScheme]);

    useEffect(() => {
        console.log('CHANGE PARAMS')
        firstPageQuery.refetch();
    }, [searchParams]);


    const [visibleFields, setVisibleFields] = useLocalStorage({
        key: 'visibleFields', defaultValue: ['hostname', 'level', 'message', 'timestamp'],
    });

    return (
        <>
            <Group position="apart" align="start" noWrap>
                {infinityQuery.status === 'loading'
                    ? (<LoadingOverlay visible={true} />)
                    : infinityQuery.status === 'error'
                        ? (<Text color="red">Error: {infinityQuery.error.message}</Text>)
                        : (
                            <>
                                <AdminLogsTable
                                    infinityQuery={infinityQuery}
                                    visibleFields={visibleFields}
                                />
                            </>
                        )}
                <AdminLogsTableSettings
                    open={sortOpen}
                    setSortOpen={setSortOpen}
                    visibleFields={visibleFields}
                    setVisibleFields={setVisibleFields}
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                />

                <AdminLogsTableFilter
                    open={filterOpen}
                    setOpen={setFilterOpen}
                    filterObject={filterSet}
                    updateFilterObject={updateFilterSet}
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                />
            </Group>
        </>
    );
}
