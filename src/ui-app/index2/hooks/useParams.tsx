import { JsonParam, StringParam, useQueryParams } from 'use-query-params';

export function useParams() {
    const [query, setQuery] = useQueryParams({
        groupBy: StringParam,
        sortBy: StringParam,
        app: StringParam,
        filter: JsonParam,
        base_filter: JsonParam,
        checkId: StringParam,
    });
    const updateQueryJsonParam = (section: string, key: string, value: string) => {
        const current = query[section as keyof typeof query];
        const newParam = {
            ...current,
            [key]: value,
        };
        setQuery({ [section]: (newParam) });
    };
    return { query, setQuery, updateQueryJsonParam };
}
