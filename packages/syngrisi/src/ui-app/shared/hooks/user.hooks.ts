import { useQuery } from '@tanstack/react-query';
import { GenericService, UsersService } from '@shared/services';

export const UserHooks = {
    useApiKey() {
        const { isLoading, error, data, isError, refetch, isFetching, isRefetching, isSuccess, status }: any = useQuery(
            {
                queryKey: ['apiKey'],
                queryFn: () => UsersService.getApiKey(),
                enabled: false,
            },
        );
        return { isLoading, isFetching, isRefetching, isSuccess, error, data, isError, refetch, status };
    },
    useCurrentUser() {
        const { isLoading, error, data, refetch, isSuccess }: any = useQuery(
            {
                queryKey: ['currentUser'],
                queryFn: () => UsersService.getCurrentUser(),
                staleTime: 5 * 60 * 1000,
                gcTime: 10 * 60 * 1000,
                refetchOnWindowFocus: false,
            },
        );
        return { isLoading, error, data, refetch, isSuccess };
    },
    useUsersByUsername(username: any) {
        return useQuery(
            {
                queryKey: ['useUsersByUsername', username],
                queryFn: () => GenericService.get('users', { username }),
                refetchOnWindowFocus: false,
            },
        );
    },

    useAllUsers() {
        const { isLoading, error, data, refetch, isSuccess, isFetching }: any = useQuery(
            {
                queryKey: ['allUsers'],
                queryFn: () => GenericService.get('users', {}, { sortBy: 'id: desc', limit: '0' }),
            },
        );
        return { isLoading, error, data, refetch, isSuccess, isFetching };
    },
};
