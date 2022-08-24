import { useQuery } from '@tanstack/react-query';
import { UserService } from '../services';

export const UserHooks = {
    useApiKey() {
        const { isLoading, error, data, isError, refetch, isFetching, isRefetching, isSuccess, status }: any = useQuery(
            ['apiKey'], () => UserService.getApiKey(), { enabled: false },
        );
        return { isLoading, isFetching, isRefetching, isSuccess, error, data, isError, refetch, status };
    },
    useCurrentUser() {
        const { isLoading, error, data, refetch, isSuccess }: any = useQuery(
            ['currentUser'], () => UserService.getCurrentUser(),
        );
        return { isLoading, error, data, refetch, isSuccess };
    },
};
