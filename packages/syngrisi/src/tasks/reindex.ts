/* eslint-disable @typescript-eslint/no-explicit-any */
import '../server/models';
import { runMongoCode } from './lib/utils';
import { User, Snapshot, Check, Test, Run, Log, App, Suite, Baseline } from './lib/index';

(async () => {
    await runMongoCode(async () => {
        return new Promise<void>((resolve) => {
            const result: any[] = [];
            [User, Snapshot, Check, Test, Run, Log, App, Suite, Baseline].forEach((model) => {
                result.push(
                    model.collection.dropIndexes()
                        .then(() => {
                            console.log(`Drop: '${model.collection.name}'`);
                        })
                        .catch((err: Error) => {
                            console.log(`Cannot drop index '${model.collection.name}', error: '${err}'`);
                        })
                );
            });

            Promise.all(result)
                .catch((err: Error) => {
                    console.log('ERROR:');
                    console.error(err);
                })
                .then(() => {
                    console.log('End of reindex task');
                });

            resolve();
        });
    });
})();
