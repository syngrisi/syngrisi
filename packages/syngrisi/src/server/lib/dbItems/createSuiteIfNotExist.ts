/* eslint-disable @typescript-eslint/no-explicit-any */
import { Suite } from '../../models';
import log from "../logger";

const fileLogMeta = {
    scope: 'dbitems',
    msgType: 'DB',
};

export async function createSuiteIfNotExist(params: any, logsMeta = {}): Promise<any> {
    const logOpts = {
        scope: 'createSuiteIfNotExist',
        msgType: 'CREATE',
        itemType: 'VRSSuite',
    };
    if (!params.name || !params.app) throw new Error(`Cannot create suite, wrong params: '${JSON.stringify(params)}'`);

    log.debug(`try to create suite if exist, params: '${JSON.stringify(params)}'`, fileLogMeta, { ...logOpts, ...logsMeta });

    let suite = await Suite.findOne({ name: params.name }).exec();

    if (suite) {
        log.debug(`suite already exist: '${JSON.stringify(params)}'`, fileLogMeta, { ...logOpts, ...logsMeta });
        return suite;
    }

    suite = await Suite.create(params);

    log.debug(`suite with name: '${params.name}' was created`, fileLogMeta, { ...logOpts, ...logsMeta });
    return suite;
}
