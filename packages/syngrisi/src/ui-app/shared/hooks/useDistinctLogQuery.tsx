import { useQuery } from '@tanstack/react-query';
import { GenericService } from '@shared/services';

interface Props {
    resource: string
    field: string
    keys?: any
    select?: (data: any) => any
}

export function useDistinctLogQuery(
    {
        resource,
        field,
        keys = [],
        select,
    }: Props,
) {
    return useQuery(
        {
            queryKey: [resource, field, 'distinct', ...keys],
            queryFn: () => GenericService.distinct(resource, field),
            enabled: true,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            select,
        },
    );
}
