import { useQuery } from '@tanstack/react-query';
import { GenericService } from '../services';
import { errorMsg } from '../utils';

interface Props {
    resource: string
    field: string
    keys?: any
    onSuccess?: any
    onError?: any
}

export function useDistinctLogQuery(
    {
        resource,
        field,
        keys = [],
        onSuccess,
        onError = (e: any) => errorMsg({ error: e }),
    }: Props,
) {
    return useQuery(
        [resource, field, 'distinct', ...keys],
        () => GenericService.distinct(resource, field),
        {
            enabled: true,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            onSuccess,
            onError,
        },
    );
}
