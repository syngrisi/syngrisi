const fs = require('fs');

const bsPath = process.env.VRS_BASELINE_PATH || './baselines/';
if (!fs.existsSync(bsPath)) {
    fs.mkdirSync(bsPath, { recursive: true });
}

exports.config = {
    defaultBaselinePath: bsPath,
    connectionString: process.env.VRS_CONN_STRING || 'mongodb://localhost/VRSdb',
    port: process.env.VRS_PORT || 3000,
};
