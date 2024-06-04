import { Request } from 'express';
import { RequestUser } from './RequestUser';

export interface ExtRequest extends Request {
    user?: RequestUser;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    files?: any;
}

export type ERequest = ExtRequest | Request; 
