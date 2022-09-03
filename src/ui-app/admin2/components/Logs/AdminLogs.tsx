/* eslint-disable */
import * as React from 'react';
import {
    Text,
    Group,
    LoadingOverlay,
    useMantineTheme,
} from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { useInputState } from '@mantine/hooks';
import { useEffect, useContext } from 'react';
import { useSubpageEffect } from '../../../shared/hooks/useSubpageEffect';
import { AppContext } from '../../AppContext';
import Toolbar from './Toolbar';
import useInfinityScroll from '../../../shared/hooks/useInfinityScroll';
import TableLogs from './TableLogs';

export default function AdminLogs() {
    const theme = useMantineTheme();
    useSubpageEffect('Logs');

    const [searchParams, setSearchParams] = useSearchParams('');
    const [sort, setSort] = useInputState('');
    const [filter, setFilter] = useInputState('{}');
    const { setToolbar }: any = useContext(AppContext);

    const { firstPageQuery, infinityQuery, newestItemsQuery } = useInfinityScroll(searchParams, filter)
    useEffect(() => {
        firstPageQuery.refetch();
    }, []);

    useEffect(() => {
        setToolbar(
            <Toolbar newestItemsQuery={newestItemsQuery} firstPageQuery={firstPageQuery}
                     infinityQuery={infinityQuery} />
        );
    }, [newestItemsQuery?.data?.results.length, newestItemsQuery.status, theme.colorScheme]);

    return (
        <>
            <Group>
                    {infinityQuery.status === 'loading'
                        ? (<LoadingOverlay visible={true} />)
                        : infinityQuery.status === 'error'
                            ? (<Text color="red">Error: {infinityQuery.error.message}</Text>)
                            : (
                                <>
                                    <TableLogs infinityQuery={infinityQuery} />
                                </>
                            )}
                    <hr />
            </Group>
        </>
    );
}
