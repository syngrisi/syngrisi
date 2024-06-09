import fs from 'fs';
import dotenv from 'dotenv';
import { version } from '@root/package.json';
import crypto from 'crypto';

import devices from "./data/devices.json";
const customDevicesPath = './server/data/custom_devices.json';

dotenv.config();

const bsPath = process.env.SYNGRISI_IMAGES_PATH || './.snapshots-images/';
if (!fs.existsSync(bsPath)) {
    fs.mkdirSync(bsPath, { recursive: true });
}

export const config = {
    version,
    // this isn't used 
    getDevices: async () => {
        if (fs.existsSync(customDevicesPath)) {
            return [...devices, ...(await import(customDevicesPath)).default];
        }
        return devices;
    },
    defaultImagesPath: bsPath,
    connectionString: process.env.SYNGRISI_DB_URI || process.env.VRS_CONN_STRING || 'mongodb://127.0.0.1:27017/SyngrisiDb',
    host: 'localhost',
    port: process.env.SYNGRISI_APP_PORT || 3000,
    backupsFolder: './backups',
    enableHttpLogger: process.env.SYNGRISI_HTTP_LOG === 'true',
    httpLoggerFilePath: './logs/http.log',
    storeSessionKey: process.env.SYNGRISI_SESSION_STORE_KEY || crypto.randomBytes(64).toString('hex'),
    codeCoverage: process.env.SYNGRISI_COVERAGE === 'true',
    disableCors: process.env.SYNGRISI_DISABLE_DEV_CORS !== '1',
    fileUploadMaxSize: 50 * 1024 * 1024,
    testMode: process.env.SYNGRISI_TEST_MODE === '1', 
    jsonLimit: '50mb',
};
