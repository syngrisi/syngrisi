import { ident } from './ident';

export const checkIdent = (check: { [key: string]: string }): string =>
    ident.reduce((accumulator, prop) => `${accumulator}.${check[prop]}`, 'ident');
