import { ident } from './ident';

interface Params {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export const buildIdentObject = (params: Params): Params =>
    Object.fromEntries(
        Object.entries(params).filter(([key]) => ident.includes(key))
    );
