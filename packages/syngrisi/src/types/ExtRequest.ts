import { Request } from 'express';
import { RequestUser } from './RequestUser';

export interface ExtRequest extends Request {
    user?: RequestUser;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    files?: any;
    isShareMode?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    shareToken?: any;
}

export type ERequest = ExtRequest | Request; 
