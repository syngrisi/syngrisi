/* eslint-disable */
import * as React from 'react';
import {
    TextInput,
    Title,
    Text,
    Button,
    Group,
    Box,
    Affix,
    ActionIcon,
    LoadingOverlay,
    useMantineTheme,
} from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { useInputState } from '@mantine/hooks';
import { useInView } from 'react-intersection-observer';
import {
    useInfiniteQuery,
    useQuery,
} from '@tanstack/react-query';
import { useMemo, useEffect, useContext } from 'react';
import { IconRefresh } from '@tabler/icons';
// eslint-disable-next-line import/named
import { SearchParams, SortEnum } from '../../shared/utils';
import { useSubpageEffect } from '../../shared/hooks/useSubpageEffect';
import { LogsService } from '../../shared/services/logs.service';
import { AppContext } from '../AppContext';
import ILog from '../../shared/interfaces/ILog';


export default function AdminLogs() {
    const theme = useMantineTheme();
    useSubpageEffect('Logs');

    console.count('LOGS RENDER');
    // params
    const [searchParams, setSearchParams] = useSearchParams('');
    const [sort, setSort] = useInputState('');
    const [filter, setFilter] = useInputState('{}');
    const { setToolbar }: any = useContext(AppContext);
    const { ref, inView } = useInView();

    interface IPage {
        limit: string
        page: string
        totalPages: string
        totalResults: string
        results: ILog[]
    }

    interface IPagesQuery {
        isLoading: boolean
        isError: boolean
        data: {
            pages: IPage[]
        }
        error: any
        isFetching: boolean
        isFetchingNextPage: boolean
        fetchNextPage: () => {}
        hasNextPage: boolean
        status: string
    }

    interface IFirstPagesQuery {
        isLoading: boolean
        isError: boolean
        status: string
        data: IPage
        error: any
        refetch: () => {}
    }

    const firstPageQuery = useQuery(
        ['first_log_page'],
        () => {
            return LogsService.getLogs(
                {},
                {
                    page: '1',
                    limit: '1',
                },
            );
        },
        {
            enabled: false,
            staleTime: Infinity,
        },
    ) as IFirstPagesQuery;

    console.log({ firstPageQuery });

    const firstPageData: { [key: string]: string | undefined } = useMemo(() => {
        const results = firstPageQuery?.data?.results;
        return {
            lastLogTimestamp: results?.length ? results[0].timestamp : undefined,
            totalPages: firstPageQuery?.data?.totalPages,
            totalResults: firstPageQuery?.data?.totalResults,
        };
    }, [firstPageQuery.status]);

    const timestampUpdatedFilter = useMemo(() => {
        const prevFilterObj = JSON.parse(searchParams.get('filter')!);
        return {
            $and: [
                { timestamp: { $lte: new Date(firstPageData.lastLogTimestamp!) } },
                prevFilterObj || {},
            ],
        };
    }, [firstPageData.lastLogTimestamp, filter]);

    const {
        status,
        data,
        error,
        isFetching,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    }: IPagesQuery = useInfiniteQuery(
        ['log_pages'],
        ({ pageParam = 1 }) => LogsService.getLogs(
            timestampUpdatedFilter,
            {
                limit: String(20),
                page: pageParam,
                sortBy: searchParams.get('sortBy') || undefined,
            },
        ),
        {
            getNextPageParam: (lastPage) => {
                if (lastPage.page >= lastPage.totalPages) return undefined;
                return lastPage.page + 1;
            },
            enabled: !!firstPageData.lastLogTimestamp && !!timestampUpdatedFilter,
        },
    ) as IPagesQuery;

    console.log({ data });

    const newestItemsQuery = useQuery(
        ['newest_pages'],
        () => LogsService.getLogs(
            { timestamp: { $gt: firstPageData.lastLogTimestamp } },
            {
                limit: String(0),
            },
        ),
        {
            enabled: data?.pages?.length! > 0,
            refetchInterval: 10000,
        },
    );

    useEffect(() => {
        setToolbar(
            newestItemsQuery?.data?.results?.length !== undefined && newestItemsQuery?.data?.results?.length > 0
            && (
                <>
                    <Text
                        size="sm"
                        p={3}
                        color={theme.colorScheme === 'dark' ? theme.colors.green[2] : 'green'}
                        title={` You have ${newestItemsQuery?.data?.results.length} new items, refresh the page to see them`}
                    >
                        {newestItemsQuery?.data?.results.length} new items
                    </Text>
                    <ActionIcon
                        color="green"
                        variant="subtle"
                        // onClick={() => document.location.reload()}
                        onClick={() => firstPageQuery.refetch()}
                    >
                        <IconRefresh size={18} />
                    </ActionIcon>

                </>
            ),
        );
        return async () => {
            console.log('UNMOUNT!!!');
            // await newestItemsQuery.refetch();
            await setToolbar('');
        };
    }, [newestItemsQuery?.data?.results.length, theme.colorScheme]);

    useEffect(() => {
        console.log('EFFECT');
        firstPageQuery.refetch();
    }, []);

    useEffect(() => {
        if (inView) {
            fetchNextPage();
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
                    {status === 'loading'
                        ? (<LoadingOverlay visible={true} />)
                        : status === 'error'
                            ? (<Text color="red">Error: {error.message}</Text>)
                            : (
                                <>
                                    {data?.pages.map((page) => (
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
                                            // color="dark"
                                            onClick={() => fetchNextPage()}
                                            disabled={!hasNextPage || isFetchingNextPage}
                                            loading={isFetchingNextPage}
                                        >
                                            {isFetchingNextPage
                                                ? 'Loading...'
                                                : hasNextPage
                                                    ? 'Load Newer'
                                                    : 'Nothing more to load'}
                                        </Button>
                                    </div>
                                    <div>
                                        {isFetching && !isFetchingNextPage
                                            ? 'Background Updating...'
                                            : null}
                                    </div>
                                </>
                            )}
                    <hr />
                </div>
            </Group>
            <Affix position={{ bottom: 20, right: 20 }}>
                <Button
                    size="xl"
                    color="dark"
                    onClick={() => document.location.reload()}
                >
                    <Group>
                        <Text size="sm" p={3} title="Loaded">Pages: {data?.pages?.length}</Text>
                        <Text size="sm" p={3}> {' / '} </Text>
                        <Text size="sm" p={3} title="Total">{data?.pages && data?.pages[0].totalPages}</Text>
                    </Group>

                </Button>
            </Affix>
        </>
    );
}
