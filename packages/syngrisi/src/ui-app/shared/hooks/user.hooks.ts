import { useQuery } from '@tanstack/react-query';
import { GenericService, UsersService } from '@shared/services';
import { errorMsg } from '@shared/utils';

export const UserHooks = {
    useApiKey() {
        const { isLoading, error, data, isError, refetch, isFetching, isRefetching, isSuccess, status }: any = useQuery(
            ['apiKey'], () => UsersService.getApiKey(), {
                enabled: false,
                onError: (err: unknown) => {
                    errorMsg({ error: err });
                },
            },
        );
        return { isLoading, isFetching, isRefetching, isSuccess, error, data, isError, refetch, status };
    },
    useCurrentUser() {
        const { isLoading, error, data, refetch, isSuccess }: any = useQuery(
            ['currentUser'], () => UsersService.getCurrentUser(), {
                onError: (err: unknown) => {
                    errorMsg({ error: err });
                },
                refetchOnWindowFocus: false,
            },
        );
        return { isLoading, error, data, refetch, isSuccess };
    },
    useUsersByUsername(username: any) {
        return useQuery(
            ['useUsersByUsername', username], () => GenericService.get('users', { username }), {
                onError: (err: unknown) => {
                    errorMsg({ error: err });
                },
                refetchOnWindowFocus: false,
            },
        );
    },

    useAllUsers() {
        const { isLoading, error, data, refetch, isSuccess, isFetching }: any = useQuery(
            ['allUsers'], () => GenericService.get('users', {}, { sortBy: 'id: desc', limit: '0' }), {
                onError: (err: unknown) => {
                    errorMsg({ error: err });
                },
            },
        );
        return { isLoading, error, data, refetch, isSuccess, isFetching };
    },
};
