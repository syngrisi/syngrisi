import { baselineParamsType } from '../services/check.service';
import { CreateCheckParams } from '../services/client.service';
import { ident } from './ident';

export const buildIdentObject = (params: baselineParamsType | CreateCheckParams) =>
    Object.fromEntries(
        Object.entries(params).filter(([key]) => ident.includes(key))
    );
