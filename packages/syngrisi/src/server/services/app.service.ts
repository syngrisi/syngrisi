/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { App } from '@models';

// @ts-ignore
const get = async (filter: any, options: any) => App.paginate(filter, options);

export {
    get,
};
