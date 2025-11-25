import mongoose from 'mongoose';
import { config } from '@config';
import log from '@logger';
import { errMsg } from '../utils/errMsg';

mongoose.Promise = global.Promise;
mongoose.set('strictQuery', false);

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const connectDB = async () => {
    let lastError: unknown;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            await mongoose.connect(config.connectionString, {
                maxPoolSize: 20,
                minPoolSize: 2,
                serverSelectionTimeoutMS: 10000,
                connectTimeoutMS: 30000,
                socketTimeoutMS: 45000,
                family: 4, // Use IPv4, disable IPv6
                maxIdleTimeMS: 30000, // Close idle connections after 30s
                waitQueueTimeoutMS: 10000, // Wait up to 10s for a connection from pool
            });
            return; // Success
        } catch (error: unknown) {
            lastError = error;
            if (attempt < MAX_RETRIES) {
                log.warn(`MongoDB connection attempt ${attempt}/${MAX_RETRIES} failed, retrying in ${RETRY_DELAY_MS}ms...`);
                await sleep(RETRY_DELAY_MS * attempt); // Exponential backoff
            }
        }
    }

    log.error(`Could not connect to MongoDB after ${MAX_RETRIES} attempts: ${errMsg(lastError)}`);
    process.exit(1);
};

export default connectDB;
