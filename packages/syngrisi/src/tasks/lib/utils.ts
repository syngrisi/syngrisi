import mongoose from 'mongoose';
import { config } from "../../server/config";

const connect = async () => {
    const connection = await mongoose.connect(config.connectionString, {});
    console.log(`Mongoose default connection open to: '${config.connectionString}', models: '${Object.keys(connection.models).join(', ')}'`);
    return connection;
};

export const runMongoCode = async (cb: () => Promise<void>) => {
    await connect();
    await cb();
    await mongoose.connection.close();
};
