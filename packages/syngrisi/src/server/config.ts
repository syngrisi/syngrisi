import fs from 'fs';
import dotenv from 'dotenv';
import { version, gitHead } from '@root/package.json';
import crypto from 'crypto';
import { execSync } from 'child_process';
import { env } from "./envConfig";

import devices from "./data/devices.json";

const getCommitHash = (): string => {
    try {
        return execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
    } catch {
        return gitHead ? gitHead.substring(0, 7) : '';
    }
};
const customDevicesPath = './server/data/custom_devices.json';
const logsFolder = './logs';
dotenv.config();

// N-2 compatibility: SDKs from 2 minor versions back are supported
// Update this when releasing new minor versions
const CURRENT_VERSION = version;
const [major, minor] = CURRENT_VERSION.split('.').map(Number);
const minSupportedMinor = Math.max(0, minor - 2);
const MIN_SUPPORTED_SDK_VERSION = `${major}.${minSupportedMinor}.0`;

export const config = {
    version,
    commitHash: getCommitHash(),
    minSupportedSdkVersion: MIN_SUPPORTED_SDK_VERSION,
    apiVersion: '1',
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
    },
    rateLimit: {
        windowMs: env.SYNGRISI_RATE_LIMIT_WINDOW_MS,
        max: env.SYNGRISI_RATE_LIMIT_MAX,
        standardHeaders: true,
        legacyHeaders: false,
    },
    authRateLimit: {
        windowMs: env.SYNGRISI_AUTH_RATE_LIMIT_WINDOW_MS,
        max: env.SYNGRISI_AUTH_RATE_LIMIT_MAX,
        standardHeaders: true,
        legacyHeaders: false,
    }
};

if (!fs.existsSync(config.defaultImagesPath)) {
    fs.mkdirSync(config.defaultImagesPath, { recursive: true });
}

if (!fs.existsSync(logsFolder)) {
    fs.mkdirSync(logsFolder, { recursive: true });
}


