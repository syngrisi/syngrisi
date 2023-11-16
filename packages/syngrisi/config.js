const fs = require('fs');
require('dotenv')
    .config();

const bsPath = process.env.SYNGRISI_IMAGES_PATH || './baselines/';
if (!fs.existsSync(bsPath)) {
    fs.mkdirSync(bsPath, { recursive: true });
}

exports.config = {
    defaultBaselinePath: bsPath,
    connectionString: process.env.SYNGRISI_DB_URI || process.env.VRS_CONN_STRING || 'mongodb://127.0.0.1:27017/SyngrisiDb',
    port: process.env.SYNGRISI_APP_PORT || 3000,
    backupsFolder: './backups',
};
