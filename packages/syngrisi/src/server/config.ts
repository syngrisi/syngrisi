import fs from 'fs';
import dotenv from 'dotenv';
import { version } from '@root/package.json';

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
    port: process.env.SYNGRISI_APP_PORT || 3000,
    backupsFolder: './backups',
    enableHttpLogger: process.env.SYNGRISI_HTTP_LOG,
    httpLoggerFilePath: './logs/http.log'
};
