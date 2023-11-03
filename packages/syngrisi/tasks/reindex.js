require('../src/server/models');
const utils = require('./lib/utils');
const {
    User, Snapshot, Check, Test, Run, Log, App, Suite, Baseline,
} = require('./lib/common');

(async () => {
    await utils.runMongoCode(() => {
        return new Promise(async (resolve, reject) => {
            const result = [];
            [User, Snapshot, Check, Test, Run, Log, App, Suite, Baseline].forEach((model) => {
                result.push(model.collection.dropIndexes()
                    .then(
                        () => {
                            console.log(`Drop: '${model.collection.name}'`);
                        }
                    )
                    .catch((err) => {
                        console.log(`Cannot drop index '${model.collection.name}', error: '${err}' `);
                    })
                );
            });

            return resolve(
                await Promise.all(result)
                    .catch((err) => {
                        console.log('ERROR:');
                        console.error(err);
                    })
                    .then(() => {
                        console.log('End of reindex task');
                    })
            );
        });
    });
})();
