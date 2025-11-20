/* eslint-disable @typescript-eslint/no-explicit-any */
import { Suite } from '@models';
import log from "@logger";

export async function createSuiteIfNotExist(params: any, logsMeta = {}): Promise<any> {
    const logOpts = {
        scope: 'createSuiteIfNotExist',
        msgType: 'CREATE',
        itemType: 'VRSSuite',
    };
    if (!params.name || !params.app) throw new Error(`Cannot create suite, wrong params: '${JSON.stringify(params)}'`);

    log.debug(`try to create suite if exist, params: '${JSON.stringify(params)}'`,  { ...logOpts, ...logsMeta });

    const filter = { name: params.name };
    const update = {
        $setOnInsert: {
            ...params,
            createdDate: params.createdDate || new Date(),
        },
    };

    try {
        const suite = await Suite.findOneAndUpdate(
            filter,
            update,
            { new: true, upsert: true }
        ).exec();

        log.debug(`suite with name: '${params.name}' was created or reused`,  { ...logOpts, ...logsMeta });
        return suite;
    } catch (e: any) {
        if (e.code === 11000) {
            log.warn(`suite key duplication collision: '${JSON.stringify(params)}'`, { ...logOpts, ...logsMeta });
            const suite = await Suite.findOne(filter).exec();
            if (suite) return suite;
        }
        log.error(`cannot create suite, params: '${JSON.stringify(params)}', error: '${e?.stack || e}'`, { ...logOpts, ...logsMeta });
        throw e;
    }
}
