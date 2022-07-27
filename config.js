const fs = require('fs');
require('dotenv')
    .config();

const bsPath = process.env.SYNGRISI_IMAGES_PATH || './baselines/';
if (!fs.existsSync(bsPath)) {
    fs.mkdirSync(bsPath, { recursive: true });
}

exports.config = {
    defaultBaselinePath: bsPath,
    connectionString: process.env.SYNGRISI_DB_URI || process.env.VRS_CONN_STRING || 'mongodb://localhost:27017/VRSdb',
    port: process.env.SYNGRISI_APP_PORT || 3000,
    backupsFolder: './backups',
};
