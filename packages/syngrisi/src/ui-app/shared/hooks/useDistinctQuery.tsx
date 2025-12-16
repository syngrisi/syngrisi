import { useQuery } from '@tanstack/react-query';
import { GenericService } from '@shared/services';
import { errorMsg } from '@shared/utils';

interface Props {
    resource: string
    keys?: any
    onSuccess?: any
    onError?: any
}

export function useDistinctQuery(
    {
        resource,
        keys = [],
        onSuccess,
        onError = (e: any) => errorMsg({ error: e }),
    }: Props,
) {
    return useQuery(
        [resource, 'distinct', ...keys],
        () => GenericService.get(
            resource,
            {},
            {
                limit: '0',
            },
        ),
        {
            enabled: true,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            onSuccess,
            onError,
        },
    );
}
