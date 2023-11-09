/* eslint-disable no-underscore-dangle,func-names */
const mongoose = require('mongoose');

const { Suite, Run } = require('../models');

const $this = this;
$this.logMeta = {
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
    log.debug(`update item type: '${itemType}', filter: '${JSON.stringify(filter)}', params: '${JSON.stringify(params)}'`, $this, logOpts);
    const itemModel = await mongoose.model(itemType)
        .findOne(filter);
    const updatedItem = await itemModel.updateOne(params);
    log.debug(`'${itemType}' was updated: '${JSON.stringify(updatedItem)}'`, $this, { ...logOpts, ...{ ref: itemModel._id } });
    return updatedItem;
}

exports.updateItem = updateItem;

async function updateItemDate(mdClass, id) {
    log.debug(`update date for the item: '${mdClass}' with id: '${id}'`, $this);
    const itemModel = await mongoose.model(mdClass)
        .findById(id);
    const updatedItem = await itemModel.updateOne({ updatedDate: Date.now() });
    log.debug(`'${mdClass}' date updated: '${JSON.stringify(itemModel)}'`, $this);
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
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };

        await itemModel.init();
        const item = await itemModel
            .findOneAndUpdate(
                params,
                params,
                options
            );

        log.info(`ORM item '${modelName}' was created: '${JSON.stringify(item)}'`, $this, { ...logOpts, ...{ ref: item._id }, ...logsMeta });
        return item;
    } catch (e) {
        log.debug(`cannot create '${modelName}' ORM item, error: '${e.stack || e}'`, $this, { ...logOpts, ...logsMeta });
    }
    return null;
};

exports.createItemIfNotExistAsync = createItemIfNotExist;
exports.createItemIfNotExist = createItemIfNotExist;

async function createItemProm(modelName, params) {
    try {
        const itemModel = mongoose.model(modelName);
        log.debug(`start to create ORM item via promise: '${modelName}', params: '${JSON.stringify(params)}'`, $this);
        const item = await itemModel.create(params);
        return item;
    } catch (e) {
        const errMsg = `cannot create '${modelName}', error: '${e.stack || e}'`;
        log.error(errMsg, $this);
        throw new Error(errMsg);
    }
}

// SPECIFIC
exports.createAppIfNotExist = async function createAppIfNotExist(params) {
    if (!params.name) {
        return {};
    }
    // log.debug(`create App with name '${params.name}' if not exist`, $this);
    return createItemIfNotExist('VRSApp', params);
};

exports.createTest = async function createTest(params) {
    return createItemProm('VRSTest', params);
};

exports.createUser = async function createUser(params) {
    return createItemProm('VRSUser', params)
        .catch((e) => Promise.reject(e));
};

const createSuiteIfNotExist = async function (params, logsMeta = {}) {
    const logOpts = {
        scope: 'createSuiteIfNotExist',
        msgType: 'CREATE',
        itemType: 'VRSSuite',
    };
    if (!params.name || !params.app) throw new Error(`Cannot create suite, wrong params: '${JSON.stringify(params)}'`);

    log.debug(`try to create suite if exist, params: '${JSON.stringify(params)}'`,
        $this,
        { ...logOpts, ...logsMeta });
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const suite = Suite.findOneAndUpdate(
        { name: params.name },
        params,
        options
    )
        .exec();
    log.debug(`suite with name: '${params.name}' was created`,
        $this,
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

        log.debug(`try to create run if exist, params: '${JSON.stringify(params)}'`,
            $this,
            { ...logOpts, ...logsMeta });

        const options = { upsert: true, new: true, setDefaultsOnInsert: true };
        await Run.init();
        run = await Run
            .findOneAndUpdate(
                {
                    ident: params.ident,
                },
                { ...params, createdDate: params.createdDate || new Date() },
                options
            )
            .exec();

        log.debug(`run with name: '${params.name}' was created: ${run}`,
            $this,
            { ...logOpts, ...logsMeta });
        return run;
    } catch (e) {
        // e ==== {"ok":0,"code":11000,"codeName":"DuplicateKey","keyPattern":{"ident":1},"keyValue":{"ident":"cd933acc-6ecb-472c-8dd1-03ec00260bec"}}
        if (e.code === 11000) {
            log.warn(`run key duplication collision: '${JSON.stringify(params)}', error: '${e.stack || e}'`,
                $this,
                { ...logOpts, ...logsMeta });
            run = await Run.findOne({ name: params.name, ident: params.ident });
            log.warn(`run key duplication collision, found: '${JSON.stringify(run)}'`, $this, { ...logOpts, ...logsMeta });
            if (run) return run;
        }
        log.error(`cannot create run, params: '${JSON.stringify(params)}', error: '${e.stack || e}', obj: ${JSON.stringify(e)}`,
            $this,
            { ...logOpts, ...logsMeta });
        throw e;
    }
};

exports.createRunIfNotExist = createRunIfNotExist;
