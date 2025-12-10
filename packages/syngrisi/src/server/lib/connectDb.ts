import mongoose from 'mongoose';
import { config } from '@config';
import log from '@logger';
import { errMsg } from '../utils/errMsg';
import { env } from '../envConfig';

mongoose.Promise = global.Promise;
mongoose.set('strictQuery', false);

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const connectDB = async () => {
    let lastError: unknown;
    const mongoOptions = {
        maxPoolSize: env.SYNGRISI_MONGO_MAX_POOL_SIZE,
        minPoolSize: env.SYNGRISI_MONGO_MIN_POOL_SIZE,
        serverSelectionTimeoutMS: env.SYNGRISI_MONGO_SERVER_SELECTION_TIMEOUT_MS,
        connectTimeoutMS: env.SYNGRISI_MONGO_CONNECT_TIMEOUT_MS,
        socketTimeoutMS: env.SYNGRISI_MONGO_SOCKET_TIMEOUT_MS,
        family: 4, // Use IPv4, disable IPv6
        maxIdleTimeMS: env.SYNGRISI_MONGO_MAX_IDLE_TIME_MS,
        waitQueueTimeoutMS: env.SYNGRISI_MONGO_WAIT_QUEUE_TIMEOUT_MS,
    };

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            await mongoose.connect(config.connectionString, mongoOptions);
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
