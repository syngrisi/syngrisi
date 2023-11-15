const mongoose = require('mongoose');
const { url } = require('./common');

const connect = async () => {
    const connection = await mongoose.connect(url, {});
    console.log(`Mongoose default connection open to: '${url}', models: '${Object.keys(connection.models)
        .join(', ')}'`);
    return connection;
};

module.exports.runMongoCode = async (cb) => {
    await connect();
    await cb();
    await mongoose.connection.close();
};
