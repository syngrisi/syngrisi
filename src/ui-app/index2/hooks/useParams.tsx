import { JsonParam, StringParam, useQueryParams } from 'use-query-params';

export function useParams() {
    const queryConfig = {
        groupBy: StringParam,
        sortBy: StringParam,
        sortByNavbar: StringParam,
        app: StringParam,
        filter: JsonParam,
        base_filter: JsonParam,
        checkId: StringParam,
        quick_filter: JsonParam,
    };
    const [query, setQuery] = useQueryParams(queryConfig);
    const updateQueryJsonParam = (section: string, key: string, value: string) => {
        const current = query[section as keyof typeof query];
        const newParam = {
            ...current,
            [key]: value,
        };
        setQuery({ [section]: (newParam) });
    };
    return { query, setQuery, updateQueryJsonParam, queryConfig };
}
