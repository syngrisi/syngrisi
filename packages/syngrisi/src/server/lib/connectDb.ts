import mongoose from 'mongoose';
import { config } from '@config';
import log from '@logger';
import { errMsg } from '../utils/errMsg';

mongoose.Promise = global.Promise;
mongoose.set('strictQuery', false);

const connectDB = async () => {
    try {
        await mongoose.connect(config.connectionString);
    } catch (error: unknown) {
        log.error(`Could not connect to MongoDB: ${errMsg(error)}`);
        process.exit(1);
    }
};

export default connectDB;
