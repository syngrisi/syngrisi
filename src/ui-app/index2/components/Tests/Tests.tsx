import * as React from 'react';
import {
    Group,
    useMantineTheme,
    ActionIcon,
} from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { useLocalStorage } from '@mantine/hooks';
import { useEffect, useContext, useState } from 'react';
import { IconAdjustments, IconFilter } from '@tabler/icons';
import { useSubpageEffect } from '../../hooks/useSubpageEffect';
import { AppContext } from '../../AppContext';
import RefreshActionIcon from './Table/RefreshActionIcon';
import useInfinityScroll from '../../../shared/hooks/useInfinityScroll';
import TestsTable from './Table/TestsTable';
import Settings from './Table/Settings';
import Filter from './Table/Filter';
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
// interface IFilterSet {
//     [key: string]: any
// }

export default function Tests() {
    const { updateToolbar }: any = useContext(AppContext);
    const { query } = useParams();

    const theme = useMantineTheme();
    useSubpageEffect('Test Results');

    const [searchParams, setSearchParams] = useSearchParams();
    const [sortOpen, setSortOpen] = useState(false);
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
    const baseFilter = query.base_filter ? query.base_filter : {};
    if (query.app) baseFilter.app = { $oid: query?.app || '' };

    const { firstPageQuery, infinityQuery, newestItemsQuery } = useInfinityScroll({
        baseFilterObj: baseFilter,
        filterObj: query.filter,
        resourceName: 'tests',
        newestItemsFilterKey: 'startDate',
        sortBy: query.sortBy || '',
    });
    useNavProgressFetchEffect(infinityQuery.isFetching);

    const [visibleFields, setVisibleFields] = useLocalStorage({
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
    });

    useEffect(() => {
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

        // updateToolbar(
        //     <ActionIcon
        //         title="View of Checks"
        //         color={theme.colorScheme === 'dark' ? 'green.8' : 'green.6'}
        //         data-test="checks-view"
        //         variant="subtle"
        //         onClick={() => {
        //             // setIsFilterDrawerOpen((prev) => !prev)
        //         }}
        //     >
        //         <IconLayout size={24} stroke={1} />
        //     </ActionIcon>,
        //     51
        // );
    }, []);

    useEffect(() => {
        updateToolbar(
            <RefreshActionIcon
                key="reload"
                newestItemsQuery={newestItemsQuery}
                firstPageQuery={firstPageQuery}
                infinityQuery={infinityQuery}
            />,
            52,
        );
    }, [newestItemsQuery?.data?.results.length, newestItemsQuery.status, theme.colorScheme]);

    useEffect(() => {
        firstPageQuery.refetch();
    }, [
        query.base_filter,
        query.filter,
        query.app,
        query.sortBy,
    ]);

    return (
        <Group position="apart" align="start" noWrap>
            <TestsTable
                firstPageQuery={firstPageQuery}
                infinityQuery={infinityQuery}
                visibleFields={visibleFields}
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
