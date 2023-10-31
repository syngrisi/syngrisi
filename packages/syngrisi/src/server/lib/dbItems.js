/* eslint-disable no-underscore-dangle,func-names */
const mongoose = require('mongoose');

const Suite = mongoose.model('VRSSuite');
const Run = mongoose.model('VRSRun');

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
    const item = await mongoose.model(itemType)
        .findOne(filter);
    const updatedItem = await item.updateOne(params);
    log.debug(`'${itemType}' was updated: '${JSON.stringify(updatedItem)}'`, $this, { ...logOpts, ...{ ref: item._id } });
    return updatedItem;
}

exports.updateItem = updateItem;

async function updateItemDate(mdClass, id) {
    log.debug(`update date for the item: '${mdClass}' with id: '${id}'`, $this);
    const item = await mongoose.model(mdClass)
        .findById(id);
    const updatedItem = await item.updateOne({ updatedDate: Date.now() });
    log.debug(`'${mdClass}' date updated: '${JSON.stringify(item)}'`, $this);
    return updatedItem;
}

exports.updateItemDate = updateItemDate;

// eslint-disable-next-line func-names
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
    log.debug(`suite with name: '${params.name}' was created`,
        $this,
        { ...logOpts, ...logsMeta });
    return suite
};

exports.createSuiteIfNotExist = createSuiteIfNotExist;

const createRunIfNotExist = async function (params, logsMeta = {}) {
    const logOpts = {
        scope: 'createRunIfNotExist',
        msgType: 'CREATE',
        itemType: 'VRSRun',
    };
    if (!params.name || !params.app || !params.ident) {
        throw new Error(`Cannot create run, wrong params: '${JSON.stringify(params)}'`);
    }

    log.debug(`try to create run if exist, params: '${JSON.stringify(params)}'`,
        $this,
        { ...logOpts, ...logsMeta });

    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const run = await Run
        .findOneAndUpdate(
            { name: params.name, ident: params.ident },
            { ...params, createdDate: params.createdDate || new Date() },
            options
        )
    log.debug(`run with name: '${params.name}' was created: ${run}`,
        $this,
        { ...logOpts, ...logsMeta });
    return run
};

exports.createRunIfNotExist = createRunIfNotExist;

const createItemIfNotExistAsync = async function (modelName, params, logsMeta = {}) {
    const logOpts = {
        scope: 'createItemIfNotExist',
        msgType: 'CREATE',
        itemType: modelName,
    };
    try {
        const itemModel = mongoose.model(modelName);
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };

        const item = await itemModel
            .findOneAndUpdate(
                params,
                params,
                options
            )

        log.info(`ORM item '${modelName}' was created: '${JSON.stringify(item)}'`, $this, { ...logOpts, ...{ ref: item._id }, ...logsMeta });
        return item;
    } catch (e) {
        log.debug(`cannot create '${modelName}' ORM item, error: '${e.stack || e}'`, $this, { ...logOpts, ...logsMeta });
    }
    return null;
};

exports.createItemIfNotExistAsync = createItemIfNotExistAsync;

async function createItem(modelName, params) {
    const Item = mongoose.model(modelName);
    // const test = await Item.findOne({name: params.name});
    log.debug(`start to create ORM item '${modelName}', params: '${JSON.stringify(params)}'`, $this);
    return Item.create(params)
        .then(async function (tst) {
            return tst.save()
                .then(async function (savedTest) {
                    log.debug(`ORM item: '${modelName}' was created: '${JSON.stringify(savedTest)}'`, $this);
                    return savedTest;
                });
        })
        .catch(function (err) {
            log.debug(`cannot create ORM item'${modelName}', error: '${err}'`, $this);
        });
}

async function createItemSync(modelName, params) {
    const Item = mongoose.model(modelName);
    log.debug(`start to create ORM item (sync): '${modelName}', params: '${JSON.stringify(params)}'`, $this);
    return Item.create(params)
        .then((tst) => tst.save()
            .then(async (savedTest) => {
                log.debug(`ORM item: '${modelName}' was created: '${JSON.stringify(savedTest)}'`, $this);
                return savedTest;
            }))
        .catch((err) => {
            log.debug(`cannot create '${modelName}', error: '${err}'`, $this);
        });
}

async function createItemProm(modelName, params) {
    try {
        const Item = mongoose.model(modelName);
        log.debug(`start to create ORM item via promise: '${modelName}', params: '${JSON.stringify(params)}'`, $this);
        const item = await Item.create(params);
        return item;
    } catch (e) {
        const errMsg = `cannot create '${modelName}', error: '${e.stack}'`;
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
    return createItemIfNotExistAsync('VRSApp', params);
};

exports.createTest = async function createTest(params) {
    return createItem('VRSTest', params);
};

exports.createUser = async function createUser(params) {
    return createItemProm('VRSUser', params)
        .catch((e) => Promise.reject(e));
};
