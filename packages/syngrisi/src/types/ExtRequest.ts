import { Request } from 'express';
import { User } from './User';

export interface ExtRequest extends Request {
    user?: User;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    files?: any;
}

export type ERequest = ExtRequest | Request; 
