import { cleanEnv, host, num, port, str, bool } from 'envalid';
import crypto from 'crypto';
import path from 'path';

import dotenv from 'dotenv';
dotenv.config();

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'production';
}

export const env = cleanEnv(process.env, {
    NODE_ENV: str({ choices: ['development', 'production', 'test'] }),
    SYNGRISI_DB_URI: str({ default: 'mongodb://127.0.0.1:27017/SyngrisiDb' }),
    SYNGRISI_APP_PORT: port({ default: 3000 }),
    SYNGRISI_IMAGES_PATH: str({ default: path.join(process.cwd(), './.snapshots-images') }),
    SYNGRISI_TMP_DIR: str({ default: path.join(process.cwd(), '.tmp') }),
    SYNGRISI_HTTP_LOG: bool({ default: false }),
    SYNGRISI_COVERAGE: bool({ default: false }),

    SYNGRISI_HOSTNAME: host({ default: 'localhost' }),

    SYNGRISI_AUTH: bool({ default: true }),
    SYNGRISI_TEST_MODE: bool({ default: false }),
    SYNGRISI_DISABLE_FIRST_RUN: bool({ default: false }),

    MONGODB_ROOT_USERNAME: str({ default: '' }),
    MONGODB_ROOT_PASSWORD: str({ default: '' }),
    LOGLEVEL: str({ choices: ['error', 'warn', 'info', 'verbose', 'debug', 'silly'], default: 'debug' }),
    SYNGRISI_PAGINATION_SIZE: num({ default: 50 }),
    SYNGRISI_DISABLE_DEV_CORS: bool({ default: true, devDefault: true }),
    SYNGRISI_SESSION_STORE_KEY: str({ default: crypto.randomBytes(64).toString('hex') }),
    SYNGRISI_LOG_LEVEL: str({ default: 'debug' }),

    // trunk features
    SYNGRISI_TRUNK_FEATURE_AI_SEVERITY: bool({ default: false }),
    SYNGRISI_AI_KEY: str({ default: '' }),
    OPENAI_API_BASE_URL: str({ default: 'https://api.openai.com/v1' }),
    OPENAI_API_KEY: str({ default: '' }),
});
