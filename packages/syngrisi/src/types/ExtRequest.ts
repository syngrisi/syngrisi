import { Request } from 'express';
import { User } from './User';

export interface ExtRequest extends Request {
    user?: User;
}

export type ERequest = ExtRequest | Request; 
