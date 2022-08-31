import queryString from 'query-string';

/* eslint-disable no-unused-vars, no-shadow */
export enum SortEnum {
    ASC = 'asc',
    DESC = 'desc',
}
/* eslint-enable no-unused-vars, no-shadow */

const getSearchParamsObject = (params: any) => queryString.parse(params.toString());

export const SearchParams = {
    changeSorting: (params: URLSearchParams, setParams: any, sortField: string, sortDirection: SortEnum) => {
        const currentObj = getSearchParamsObject(params);
        setParams(queryString.stringify({ ...currentObj, sortBy: `${sortField}:${sortDirection}` }));
    },
    changeFiltering: (params: URLSearchParams, setParams: any, filter: any) => {
        const currentObj = getSearchParamsObject(params);
        const newParamsObj = { ...currentObj, filter };
        setParams(queryString.stringify(newParamsObj));
    },
};
