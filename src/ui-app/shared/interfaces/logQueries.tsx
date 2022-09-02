export interface IPage<T> {
    limit: string
    page: string
    totalPages: string
    totalResults: string
    results: T[]
}

export interface IPagesQuery<T> {
    isLoading: boolean
    isError: boolean
    data: {
        pages: IPage<T>[]
    }
    error: any
    isFetching: boolean
    isFetchingNextPage: boolean
    fetchNextPage: () => {}
    hasNextPage: boolean
    status: string
}

export interface IFirstPagesQuery<T> {
    isLoading: boolean
    isError: boolean
    status: string
    data: IPage<T>
    error: any
    refetch: () => {}
}
