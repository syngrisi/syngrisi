/* eslint-disable */
import * as React from 'react';
import {
    TextInput,
    Title,
    Text,
    Button,
    Group,
    Box,
    LoadingOverlay,
    useMantineTheme,
} from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { useInputState } from '@mantine/hooks';
import { useInView } from 'react-intersection-observer';
import { useEffect, useContext } from 'react';
// eslint-disable-next-line import/named
import { SearchParams, SortEnum } from '../../../shared/utils';
import { useSubpageEffect } from '../../../shared/hooks/useSubpageEffect';
import { AppContext } from '../../AppContext';
import PagesCountAffix from './PagesCountAffix';
import Toolbar from './Toolbar';
import useInfinityScroll from '../../../shared/hooks/useInfinityScroll';


export default function AdminLogs() {
    const theme = useMantineTheme();
    useSubpageEffect('Logs');

    const [searchParams, setSearchParams] = useSearchParams('');
    const [sort, setSort] = useInputState('');
    const [filter, setFilter] = useInputState('{}');
    const { setToolbar }: any = useContext(AppContext);
    const { ref, inView } = useInView();

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

    useEffect(() => {
        if (inView) {
            infinityQuery.fetchNextPage();
        }
    }, [inView]);

    return (
        <>
            <Group>
                <Title>Admin Logs</Title>
                <Group align="center">
                    <Box>searchParams: {decodeURIComponent(searchParams.toString())}</Box>

                    <TextInput
                        label="sort by"
                        onChange={setSort}
                        value={sort}
                    />
                    <Button
                        onClick={() => {
                            SearchParams.changeSorting(searchParams, setSearchParams, sort, SortEnum.ASC);
                        }}
                    >
                        Set Sorting
                    </Button>
                </Group>

                <Group align="center">
                    <TextInput
                        label="filter"
                        onChange={setFilter}
                        value={filter}
                    />
                    <Button
                        onClick={() => {
                            SearchParams.changeFiltering(searchParams, setSearchParams, filter.toString());
                        }}
                    >
                        Set Filter
                    </Button>
                </Group>
            </Group>

            <Group>
                <div>
                    {infinityQuery.status === 'loading'
                        ? (<LoadingOverlay visible={true} />)
                        : infinityQuery.status === 'error'
                            ? (<Text color="red">Error: {infinityQuery.error.message}</Text>)
                            : (
                                <>
                                    {infinityQuery.data?.pages.map((page) => (
                                        <React.Fragment key={page.page}>
                                            <Title>{page.page}</Title>
                                            {
                                                page?.results?.length && page.results.map(
                                                    (log) => (
                                                        <Text
                                                            key={log.id}
                                                        >
                                                            {log.id} /
                                                            [{log.level}] {log.message}
                                                        </Text>
                                                    ),
                                                )
                                            }
                                        </React.Fragment>
                                    ))}
                                    <div>
                                        <Button
                                            ref={ref}
                                            onClick={() => infinityQuery.fetchNextPage()}
                                            disabled={!infinityQuery.hasNextPage || infinityQuery.isFetchingNextPage}
                                            loading={infinityQuery.isFetchingNextPage}
                                        >
                                            {infinityQuery.isFetchingNextPage
                                                ? 'Loading...'
                                                : infinityQuery.hasNextPage
                                                    ? 'Load Newer'
                                                    : 'Nothing more to load'}
                                        </Button>
                                    </div>
                                    <div>
                                        {infinityQuery.isFetching && !infinityQuery.isFetchingNextPage
                                            ? 'Background Updating...'
                                            : null}
                                    </div>
                                </>
                            )}
                    <hr />
                </div>
            </Group>

            <PagesCountAffix
                loaded={infinityQuery.data?.pages?.length.toString()}
                total={infinityQuery.data?.pages && infinityQuery.data?.pages[0].totalPages}
            />
        </>
    );
}
