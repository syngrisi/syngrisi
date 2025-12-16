import { parse, stringify } from '@shared/utils/queryParams';

/* eslint-enable no-unused-vars, no-shadow */

const getSearchParamsObject = (params: URLSearchParams) => parse(params.toString());

export const SearchParams = {
    changeSorting: (searchParams: URLSearchParams, setParams: any, sortItemName: string, sortDirection: string) => {
        const currentObj = getSearchParamsObject(searchParams);
        setParams(stringify({ ...currentObj, sortBy: `${sortItemName}:${sortDirection}` }));
    },
    changeFiltering: (searchParams: URLSearchParams, setParams: any, filter: any) => {
        const currentObj = getSearchParamsObject(searchParams);
        const newParamsObj = { ...currentObj, filter };
        setParams(stringify(newParamsObj));
    },
};
