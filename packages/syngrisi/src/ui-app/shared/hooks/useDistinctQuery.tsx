import { useQuery } from '@tanstack/react-query';
import { GenericService } from '@shared/services';

interface Props {
    resource: string
    keys?: any
    select?: (data: any) => any
}

export function useDistinctQuery(
    {
        resource,
        keys = [],
        select,
    }: Props,
) {
    return useQuery(
        {
            queryKey: [resource, 'distinct', ...keys],
            queryFn: () => GenericService.get(
                resource,
                {},
                {
                    limit: '0',
                },
            ),
            enabled: true,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            select,
        },
    );
}
