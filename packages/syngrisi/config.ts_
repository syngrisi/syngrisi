import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const bsPath = process.env.SYNGRISI_IMAGES_PATH || './.snapshots-images/';
if (!fs.existsSync(bsPath)) {
    fs.mkdirSync(bsPath, { recursive: true });
}

export const config = {
    defaultImagesPath: bsPath,
    connectionString: process.env.SYNGRISI_DB_URI || process.env.VRS_CONN_STRING || 'mongodb://127.0.0.1:27017/SyngrisiDb',
    port: process.env.SYNGRISI_APP_PORT || 3000,
    backupsFolder: './backups',
    enableHttpLogger: process.env.SYNGRISI_HTTP_LOG,
    httpLoggerFilePath: './logs/http.log'
};
