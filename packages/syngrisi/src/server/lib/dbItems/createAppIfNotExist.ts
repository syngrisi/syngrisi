/* eslint-disable @typescript-eslint/no-explicit-any */

import { App } from '../../models';
import log from "../logger";

const fileLogMeta = {
    scope: 'dbitems',
    msgType: 'DB',
};

export async function createAppIfNotExist(params: any): Promise<any> {
    const logOpts = {
        scope: 'createAppIfNotExist',
        msgType: 'CREATE',
        itemType: 'VRSApp',
    };
    if (!params.name) return {};

    log.debug(`try to create app if exist, params: '${JSON.stringify(params)}'`, fileLogMeta, logOpts);

    let app = await App.findOne({ name: params.name }).exec();

    if (app) {
        log.debug(`app already exist: '${JSON.stringify(params)}'`, fileLogMeta, logOpts);
        return app;
    }

    app = await App.create(params);
    log.debug(`app with name: '${params.name}' was created`, fileLogMeta, logOpts);
    return app;
}
