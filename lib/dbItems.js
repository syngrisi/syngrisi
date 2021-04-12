const mongoose = require('mongoose');
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// COMMON
async function updateItem(itemType, filter, params) {
    console.log(`Update item type: '${itemType}', filter: '${JSON.stringify(filter)}', params: '${JSON.stringify(params)}'`);
    const item = await mongoose.model(itemType)
        .findOne(filter);
    await item.updateOne(params)
        .then(
            function (updatedItem) {
                console.log(`'${itemType}' was updated: '${JSON.stringify(updatedItem)}'`);
                return updatedItem;
            }
        )
        .catch(function (err) {
            console.log(`Cannot update item type: '${itemType}', filter: '${JSON.stringify(filter)}', params: '${JSON.stringify(params)}', error: ${err}`);
        });
}

exports.updateItem = updateItem;

async function updateItemDate(mdClass, id) {
    return new Promise(async function (resolve, reject) {
        console.log(`Update date for item: '${mdClass}' with id: '${id}'`);
        const item = await mongoose.model(mdClass)
            .findById(id);
        resolve(await item.updateOne({updatedDate: Date.now()}).exec()
            .catch(function (err) {
                console.log(`Cannot update date for '${mdClass}': id: '${id}' error: '${err}'`);
                return reject(err);
            }))
        console.log(`'${mdClass}' date updated: '${JSON.stringify(item)}'`);
    })
}

exports.updateItemDate = updateItemDate;

async function createItemIfNotExist(modelName, params) {
    const Item = mongoose.model(modelName);
    const test = await Item.findOne({name: params.name});
    if (test) {
        console.log(`'${modelName}' already exists, params: '${JSON.stringify(params)}'`);
        return test;
    }
    console.log(`'${modelName}' does not exists, create new one, params: '${JSON.stringify(params)}'`);
    return Item.create(params)
        .then(async function (tst) {
            return tst.save()
                .then(async function (savedTest) {
                    console.log(`'${modelName}' was created: '${JSON.stringify(savedTest)}'`);
                    return savedTest;
                });
        })
        .catch(function (err) {
            console.log(`Cannot create '${modelName}', error: '${err}'`);
        });
}

async function createItem(modelName, params) {
    const Item = mongoose.model(modelName);
    // const test = await Item.findOne({name: params.name});
    console.log(`START CREATE ORM ITEM '${modelName}', params: '${JSON.stringify(params)}'`);
    return Item.create(params)
        .then(async function (tst) {
            return tst.save()
                .then(async function (savedTest) {
                    console.log(`CREATED ORM ITEM: '${modelName}' was created: '${JSON.stringify(savedTest)}'`);
                    return savedTest;
                });
        })
        .catch(function (err) {
            console.log(`Cannot create '${modelName}', error: '${err}'`);
        });
}

function createItemProm(modelName, params) {
    return new Promise(async (resolve, reject) => {
        try {
            const Item = mongoose.model(modelName);
            console.log(`START CREATE ORM ITEM PROMISE'${modelName}', params: '${JSON.stringify(params)}'`);
            const item = await Item.create(params);
            return resolve(item);
        } catch (e) {
            console.log(`Cannot create '${modelName}', error: '${e}'`);
            return reject(e);
        }
    })
}

exports.createItemIfNotExist = createItemIfNotExist;

// SPECIFIC
exports.createAppIfNotExist = async function createAppIfNotExist(params) {
    if (!params.name)
        return {};
    console.log(`Create App with name '${params.name}' if not exist`);
    return createItemIfNotExist('VRSApp', params);
};

exports.createSuiteIfNotExist = async function createSuiteIfNotExist(params) {
    if (!params.name)
        return {};
    console.log(`Create suite with name '${params.name}' if not exist`);
    return createItemIfNotExist('VRSSuite', params);
};

exports.createRunIfNotExist = async function createRunIfNotExist(params) {
    if (!params.name)
        return {};
    console.log(`Create run with name '${params.name}' if not exist`);
    return createItemIfNotExist('VRSRun', params);
};

exports.createTest = async function createTest(params) {
    return createItem('VRSTest', params);
};

exports.createUser = async function createUser(params) {
    return await createItemProm('VRSUser', params).catch((e) => {
        return Promise.reject(e);
    });
};
