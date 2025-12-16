import queryString from 'query-string';

/* eslint-enable no-unused-vars, no-shadow */

const getSearchParamsObject = (params: any) => queryString.parse(params.toString());

export const SearchParams = {
    changeSorting: (searchParams: URLSearchParams, setParams: any, sortItemName: string, sortDirection: string) => {
        const currentObj = getSearchParamsObject(searchParams);
        setParams(queryString.stringify({ ...currentObj, sortBy: `${sortItemName}:${sortDirection}` }));
    },
    changeFiltering: (searchParams: URLSearchParams, setParams: any, filter: any) => {
        const currentObj = getSearchParamsObject(searchParams);
        const newParamsObj = { ...currentObj, filter };
        setParams(queryString.stringify(newParamsObj));
    },
};
