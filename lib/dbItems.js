/* global log */
const mongoose = require('mongoose');

const $this = this;
$this.logMeta = {
    scope: 'dbitems',
    msgType: 'DB',
};

// COMMON
async function updateItem(itemType, filter, params) {
    log.debug(`update item type: '${itemType}', filter: '${JSON.stringify(filter)}', params: '${JSON.stringify(params)}'`, $this);
    const item = await mongoose.model(itemType)
        .findOne(filter);
    await item.updateOne(params)
        .then(
            function (updatedItem) {
                log.debug(`'${itemType}' was updated: '${JSON.stringify(updatedItem)}'`, $this);
                return updatedItem;
            }
        )
        .catch(function (err) {
            log.error(`cannot update item type: '${itemType}', filter: '${JSON.stringify(filter)}', params: '${JSON.stringify(params)}', error: ${err}`);
        });
}

exports.updateItem = updateItem;

async function updateItemDate(mdClass, id) {
    return new Promise(async function (resolve, reject) {
        log.debug(`update date for the item: '${mdClass}' with id: '${id}'`, $this);
        const item = await mongoose.model(mdClass)
            .findById(id);
        resolve(await item.updateOne({ updatedDate: Date.now() })
            .exec()
            .catch(function (err) {
                log.debug(`cannot update date for '${mdClass}': id: '${id}' error: '${err}'`, $this);
                return reject(err);
            }));
        log.debug(`'${mdClass}' date updated: '${JSON.stringify(item)}'`, $this);
    });
}

exports.updateItemDate = updateItemDate;

const createItemIfNotExistAsync = async function (modelName, params) {
    try {
        const itemModel = mongoose.model(modelName);
        const item = await itemModel.findOne(params);
        if (item) {
            log.debug(`ORM item '${modelName}' already exists, params: '${JSON.stringify(params)}'`, $this);
            return item;
        }
        log.debug(`ORM item '${modelName}' does not exists, create new one, params: '${JSON.stringify(params)}'`, $this);
        const newItem = await itemModel.create(params);
        // await newItem.save();
        log.debug(`ORM item '${modelName}' was created: '${JSON.stringify(newItem)}'`, $this);
        return newItem;
    } catch (e) {
        log.debug(`cannot create '${modelName}' ORM item, error: '${e}'`, $this);
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

function createItemProm(modelName, params) {
    return new Promise(async (resolve, reject) => {
        try {
            const Item = mongoose.model(modelName);
            log.debug(`start to create ORM item via promise: '${modelName}', params: '${JSON.stringify(params)}'`, $this);
            const item = await Item.create(params);
            return resolve(item);
        } catch (e) {
            log.debug(`cannot create '${modelName}', error: '${e}'`, $this);
            return reject(e);
        }
    });
}

// SPECIFIC
exports.createAppIfNotExist = async function createAppIfNotExist(params) {
    if (!params.name) {
        return {};
    }
    // log.debug(`create App with name '${params.name}' if not exist`, $this);
    return createItemIfNotExistAsync('VRSApp', params);
};

exports.createSuiteIfNotExist = async function createSuiteIfNotExist(params) {
    if (!params.name) {
        return {};
    }
    return createItemIfNotExistAsync('VRSSuite', params);
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
