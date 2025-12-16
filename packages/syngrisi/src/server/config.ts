import fs from 'fs';
import dotenv from 'dotenv';
import { version } from '@root/package.json';
import crypto from 'crypto';
import { env } from "./envConfig";

import devices from "./data/devices.json";
const customDevicesPath = './server/data/custom_devices.json';
const logsFolder = './logs';
dotenv.config();

export const config = {
    version,
    // this isn't used
    getDevices: async () => {
        if (fs.existsSync(customDevicesPath)) {
            return [...devices, ...(await import(customDevicesPath)).default];
        }
        return devices;
    },
    defaultImagesPath: env.SYNGRISI_IMAGES_PATH,
    connectionString: env.SYNGRISI_DB_URI || 'mongodb://127.0.0.1:27017/SyngrisiDb',
    host: env.SYNGRISI_HOSTNAME,
    port: env.SYNGRISI_APP_PORT || 3000,
    backupsFolder: './backups',
    enableHttpLogger: env.SYNGRISI_HTTP_LOG,
    httpLoggerFilePath: `${logsFolder}/http.log`,
    storeSessionKey: env.SYNGRISI_SESSION_STORE_KEY || crypto.randomBytes(64).toString('hex'),
    codeCoverage: env.SYNGRISI_COVERAGE,
    disableCors: env.SYNGRISI_DISABLE_DEV_CORS,
    fileUploadMaxSize: 50 * 1024 * 1024,
    testMode: env.SYNGRISI_TEST_MODE,
    jsonLimit: '50mb',
    tmpDir: env.SYNGRISI_TMP_DIR,
    helmet: {
        crossOriginEmbedderPolicy: false,
        crossOriginResourcePolicy: false,
        crossOriginOpenerPolicy: false,
        contentSecurityPolicy: {
            directives: {
                // frameAncestors: ["'self'", "vscode-webview:", "vscode-resource:",  "https:", "http:"],
                // frameSrc: ["'self'", "vscode-webview:", "https:", "http:"],
                // scriptSrc: ["'self'", "'unsafe-inline'"],
                // styleSrc: ["'self'", "'unsafe-inline'"]

                defaultSrc: ["'self'", "*", "'unsafe-inline'", "'unsafe-eval'", "data:", "blob:"],
                frameAncestors: ["'self'", "*"],
                frameSrc: ["'self'", "*"],
                scriptSrc: ["'self'", "*", "'unsafe-inline'", "'unsafe-eval'"],
                styleSrc: ["'self'", "*", "'unsafe-inline'"],
                imgSrc: ["'self'", "*", "data:", "blob:"],
                fontSrc: ["'self'", "*", "data:"],
                connectSrc: ["'self'", "*"]
            },
        },
    }
};

if (!fs.existsSync(config.defaultImagesPath)) {
    fs.mkdirSync(config.defaultImagesPath, { recursive: true });
}

if (!fs.existsSync(logsFolder)) {
    fs.mkdirSync(logsFolder, { recursive: true });
}


