/* eslint-disable @typescript-eslint/no-explicit-any */

import { Run } from '../../models';
import log from "../logger";

const fileLogMeta = {
    scope: 'dbitems',
    msgType: 'DB',
};

export async function createRunIfNotExist(params: any, logsMeta = {}): Promise<any> {
    const logOpts = {
        scope: 'createRunIfNotExist',
        msgType: 'CREATE',
        itemType: 'VRSRun',
    };
    let run;
    try {
        if (!params.name || !params.app || !params.ident) {
            throw new Error(`Cannot create run, wrong params: '${JSON.stringify(params)}'`);
        }

        log.debug(`try to create run if exist, params: '${JSON.stringify(params)}'`, fileLogMeta, { ...logOpts, ...logsMeta });

        run = await Run.findOne({ ident: params.ident }).exec();

        if (run) {
            log.debug(`run already exist: '${JSON.stringify(params)}'`, fileLogMeta, { ...logOpts, ...logsMeta });
            return run;
        }

        run = await Run.create({
            ...params,
            createdDate: params.createdDate || new Date(),
        });

        log.debug(`run with name: '${params.name}' was created: ${run}`, fileLogMeta, { ...logOpts, ...logsMeta });
        return run;
    } catch (e: any) {
        if (e.code === 11000) {
            log.warn(`run key duplication collision: '${JSON.stringify(params)}', error: '${e.stack || e}'`, fileLogMeta, { ...logOpts, ...logsMeta });
            run = await Run.findOne({ name: params.name, ident: params.ident });
            log.warn(`run key duplication collision, found: '${JSON.stringify(run)}'`, fileLogMeta, { ...logOpts, ...logsMeta });
            if (run) return run;
        }
        log.error(`cannot create run, params: '${JSON.stringify(params)}', error: '${e.stack || e}', obj: ${JSON.stringify(e)}`, fileLogMeta, { ...logOpts, ...logsMeta });
        throw e;
    }
}
