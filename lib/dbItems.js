/* eslint-disable no-underscore-dangle */
/* global log */
const mongoose = require('mongoose');

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

const createItemIfNotExistAsync = async function (modelName, params, logsMeta = {}) {
    const logOpts = {
        scope: 'createItemIfNotExist',
        msgType: 'CREATE',
        itemType: modelName,
    };
    try {
        const itemModel = mongoose.model(modelName);
        const item = await itemModel.findOne(params);
        if (item) {
            log.debug(`ORM item '${modelName}' already exists, params: '${JSON.stringify(params)}'`, $this, { ...logOpts, ...logsMeta });
            return item;
        }
        log.debug(`ORM item '${modelName}' does not exists, create new one, params: '${JSON.stringify(params)}'`, $this, { ...logOpts, ...logsMeta });
        const newItem = await itemModel.create(params);
        // await newItem.save();
        log.info(`ORM item '${modelName}' was created: '${JSON.stringify(newItem)}'`, $this, { ...logOpts, ...{ ref: newItem._id }, ...logsMeta });
        return newItem;
    } catch (e) {
        log.debug(`cannot create '${modelName}' ORM item, error: '${e}'`, $this, { ...logOpts, ...logsMeta });
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
        const errMsg = `cannot create '${modelName}', error: '${e}'`;
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

exports.createRunIfNotExist = async function createRunIfNotExist(params) {
    // log.debug(`create run with name '${params.name}' if not exist`, $this);
    return createItemIfNotExistAsync('VRSRun', params);
    // return createItemIfNotExist('VRSRun', params);
};

exports.createTest = async function createTest(params) {
    return createItem('VRSTest', params);
};

exports.createUser = async function createUser(params) {
    return await createItemProm('VRSUser', params)
        .catch((e) => {
            return Promise.reject(e);
        });
};
