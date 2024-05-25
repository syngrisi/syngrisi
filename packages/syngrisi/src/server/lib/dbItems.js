/* eslint-disable no-underscore-dangle,func-names */
const log2 = require("../../../dist/src/server/lib/logger2").default;

const mongoose = require('mongoose');

const {
    Suite,
    Run,
    App
} = require('../models');

// const fileLogMeta= this;
const fileLogMeta = {
    scope: 'dbitems',
    msgType: 'DB',
};

// COMMON
async function updateItem(itemType, filter, params) {
    const logOpts = {
        scope: 'updateItem',
        msgType: 'UPDATE',
        itemType,
    };
    log2.debug(`update item type: '${itemType}', filter: '${JSON.stringify(filter)}', params: '${JSON.stringify(params)}'`, fileLogMeta, logOpts);
    const itemModel = await mongoose.model(itemType)
        .findOne(filter);
    const updatedItem = await itemModel.updateOne(params);
    log2.debug(`'${itemType}' was updated: '${JSON.stringify(updatedItem)}'`, fileLogMeta, { ...logOpts, ...{ ref: itemModel._id } });
    return updatedItem;
}

exports.updateItem = updateItem;

async function updateItemDate(mdClass, id) {
    log2.debug(`update date for the item: '${mdClass}' with id: '${id}'`, fileLogMeta);
    const itemModel = await mongoose.model(mdClass)
        .findById(id);
    const updatedItem = await itemModel.updateOne({ updatedDate: Date.now() });
    log2.debug(`'${mdClass}' date updated: '${JSON.stringify(itemModel)}'`, fileLogMeta);
    return updatedItem;
}

exports.updateItemDate = updateItemDate;

const createItemIfNotExist = async function (modelName, params, logsMeta = {}) {
    const logOpts = {
        scope: 'createItemIfNotExist',
        msgType: 'CREATE',
        itemType: modelName,
    };
    try {
        const itemModel = mongoose.model(modelName);
        const options = {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
        };

        await itemModel.init();
        const item = await itemModel
            .findOneAndUpdate(
                params,
                params,
                options
            );

        log2.info(`ORM item '${modelName}' was created: '${JSON.stringify(item)}'`, fileLogMeta, { ...logOpts, ...{ ref: item._id }, ...logsMeta });
        return item;
    } catch (e) {
        log2.debug(`cannot create '${modelName}' ORM item, error: '${e.stack || e}'`, fileLogMeta, { ...logOpts, ...logsMeta });
    }
    return null;
};

exports.createItemIfNotExistAsync = createItemIfNotExist;
exports.createItemIfNotExist = createItemIfNotExist;

async function createItemProm(modelName, params) {
    try {
        const itemModel = mongoose.model(modelName);
        log2.debug(`start to create ORM item via promise: '${modelName}', params: '${JSON.stringify(params)}'`, fileLogMeta);
        const item = await itemModel.create(params);
        return item;
    } catch (e) {
        const errMsg = `cannot create '${modelName}', error: '${e.stack || e}'`;
        log2.error(errMsg, fileLogMeta);
        throw new Error(errMsg);
    }
}

// SPECIFIC
exports.createTest = async function createTest(params) {
    return createItemProm('VRSTest', params);
};

exports.createUser = async function createUser(params) {
    return createItemProm('VRSUser', params)
        .catch((e) => Promise.reject(e));
};

exports.createAppIfNotExist = async function createAppIfNotExist(params) {
    const logOpts = {
        scope: 'createAppIfNotExist',
        msgType: 'CREATE',
        itemType: 'VRSApp',
    };
    if (!params.name) return {};
    // throw new Error(`Cannot create app, wrong params: '${JSON.stringify(params)}'`);

    log2.debug(`try to create app if exist, params: '${JSON.stringify(params)}'`,
        fileLogMeta, logOpts);

    let app = await App.findOne({ name: params.name })
        .exec();

    if (app) {
        log2.debug(`app already exist: '${JSON.stringify(params)}'`,
            fileLogMeta, logOpts);
        return app;
    }

    app = await App.create(params);
    log2.debug(`app with name: '${params.name}' was created`,
        fileLogMeta, logOpts);
    return app;
};

const createSuiteIfNotExist = async function (params, logsMeta = {}) {
    const logOpts = {
        scope: 'createSuiteIfNotExist',
        msgType: 'CREATE',
        itemType: 'VRSSuite',
    };
    if (!params.name || !params.app) throw new Error(`Cannot create suite, wrong params: '${JSON.stringify(params)}'`);

    log2.debug(`try to create suite if exist, params: '${JSON.stringify(params)}'`,
        fileLogMeta,
        { ...logOpts, ...logsMeta });

    let suite = await Suite.findOne({ name: params.name })
        .exec();

    if (suite) {
        log2.debug(`suite already exist: '${JSON.stringify(params)}'`,
            fileLogMeta,
            { ...logOpts, ...logsMeta });
        return suite;
    }

    suite = await Suite.create(params);

    log2.debug(`suite with name: '${params.name}' was created`,
        fileLogMeta,
        { ...logOpts, ...logsMeta });
    return suite;
};

exports.createSuiteIfNotExist = createSuiteIfNotExist;

const createRunIfNotExist = async function (params, logsMeta = {}) {
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

        log2.debug(`try to create run if exist, params: '${JSON.stringify(params)}'`,
            fileLogMeta,
            { ...logOpts, ...logsMeta });

        let run = await Run.findOne({ ident: params.ident })
            .exec();

        if (run) {
            log2.debug(`run already exist: '${JSON.stringify(params)}'`,
                fileLogMeta,
                { ...logOpts, ...logsMeta });
            return run;
        }

        run = await Run.create({
            ...params,
            createdDate: params.createdDate || new Date()
        });

        log2.debug(`run with name: '${params.name}' was created: ${run}`,
            fileLogMeta,
            { ...logOpts, ...logsMeta });
        return run;
    } catch (e) {
        // e ==== {"ok":0,"code":11000,"codeName":"DuplicateKey","keyPattern":{"ident":1},"keyValue":{"ident":"cd933acc-6ecb-472c-8dd1-03ec00260bec"}}
        if (e.code === 11000) {
            log2.warn(`run key duplication collision: '${JSON.stringify(params)}', error: '${e.stack || e}'`,
                fileLogMeta,
                { ...logOpts, ...logsMeta });
            run = await Run.findOne({
                name: params.name,
                ident: params.ident
            });
            log2.warn(`run key duplication collision, found: '${JSON.stringify(run)}'`, fileLogMeta, { ...logOpts, ...logsMeta });
            if (run) return run;
        }
        log2.error(`cannot create run, params: '${JSON.stringify(params)}', error: '${e.stack || e}', obj: ${JSON.stringify(e)}`,
            fileLogMeta,
            { ...logOpts, ...logsMeta });
        throw e;
    }
};

exports.createRunIfNotExist = createRunIfNotExist;
