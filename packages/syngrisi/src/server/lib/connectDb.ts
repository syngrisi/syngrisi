import mongoose from 'mongoose';
import { config } from '@config';
import log from '@logger';
import { errMsg } from '../utils/errMsg';

mongoose.Promise = global.Promise;
mongoose.set('strictQuery', false);

const connectDB = async () => {
    try {
        await mongoose.connect(config.connectionString, {
            maxPoolSize: 10,
            minPoolSize: 5,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4 // Use IPv4, disable IPv6
        });
    } catch (error: unknown) {
        log.error(`Could not connect to MongoDB: ${errMsg(error)}`);
        process.exit(1);
    }
};

export default connectDB;
