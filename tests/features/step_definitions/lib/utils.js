/* eslint-disable no-console */
const got = require('got');
const YAML = require('yaml');
const { spawn } = require('child_process');

module.exports = {
    async requestWithLastSessionSid(uri, $this, opts = { method: 'GET' }, body,) {
        const sessionSid = $this.getSavedItem('lastSessionId');

        const res = await got(
            `${uri}`,
            {
                headers: {
                    cookie: `connect.sid=${sessionSid}`,
                },
                form: opts.form,
                method: opts.method,
                body,
            },
        );
        let json;
        try {
            json = JSON.parse(res.body);
        } catch (e) {
            console.warn('Warning: cannot parse body as json');
            json = '';
        }
        return {
            raw: res,
            json,
        };
    },
    startServer(params) {
        const srvOpts = YAML.parse(params) || {};

        const databaseName = srvOpts.databaseName || 'VRSdbTest';
        const cmdPath = '../';
        const env = Object.create(process.env);
        env.VRS_PORT = srvOpts.port || browser.config.serverPort;
        env.VRS_BASELINE_PATH = srvOpts.baseLineFolder || './baselinesTest/';
        env.VRS_CONN_STRING = `mongodb://localhost/${databaseName}`;
        // const homedir = require('os')
        //     .homedir();
        // const nodePath = process.env.OLTA_NODE_PATH || (`C:\\Program Files\\nodejs`);
        const child = spawn('node',
            ['server.js'], {
                env,
                shell: process.platform === 'win32',
                cwd: cmdPath,
            });

        child.stdout.setEncoding('utf8');
        child.stdout.on('data', (data) => {
            console.log(`#: ${data}`);
            // fs.appendFileSync(`./.tmp/syngrisi_out.txt`, data);
        });

        child.stderr.setEncoding('utf8');
        child.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
            // fs.appendFileSync(`./.tmp/syngrisi_err.txt`, data);
        });

        browser.pause(2500);
        browser.waitUntil(async () => {
            const res = (await got.get(`http://${browser.config.serverDomain}:`
                + `${srvOpts.port || browser.config.serverPort}/status`, { throwHttpErrors: false })
                .json());
            console.log({ isAlive: res.alive });
            return (res.alive === true);
        });
        console.log(`SERVER IS STARTED, PID: '${child.pid}'`);
        browser.syngrisiServer = child;
    },
};
