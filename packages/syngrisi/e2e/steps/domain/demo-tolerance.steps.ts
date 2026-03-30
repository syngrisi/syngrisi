import { Given, When } from '@fixtures';
import * as path from 'path';
import * as fs from 'fs';
import { SyngrisiDriver } from '@syngrisi/wdio-sdk';
import * as crypto from 'crypto';

function getCachedFileBuffer(filePath: string): Buffer {
    return fs.readFileSync(filePath);
}

When('I create check {string} with image {string} and tolerance {float} in run {string}', async ({ appServer }, checkName, imageName, tolerance, runName) => {
    const apiKey = process.env.SYNGRISI_API_KEY || '123';
    const baseURL = appServer.baseURL.endsWith('/') ? appServer.baseURL : `${appServer.baseURL}/`;
    const vDriver = new SyngrisiDriver({
        url: baseURL,
        apiKey,
    });

    const session = await vDriver.startTestSession({
        params: {
            test: runName,
            run: runName,
            runident: 'manual-run-123',
            app: 'Test App',
            branch: 'integration',
            suite: 'Integration suite',
            os: 'macOS',
            browserName: 'chrome',
            browserVersion: '11',
            browserFullVersion: '11.0.0.0',
            viewport: '1366x768',
        }
    });

    const repoRoot = path.resolve(__dirname, '..', '..', '..', '..');
    const fullPath = path.join(repoRoot, 'syngrisi', 'tests', 'files', imageName);
    const imageBuffer = getCachedFileBuffer(fullPath);

    await vDriver.check({
        checkName: checkName,
        imageBuffer,
        params: {
            viewport: '1366x768',
            browserName: 'chrome',
            os: 'macOS',
            toleranceThreshold: tolerance,
        }
    });

    await vDriver.stopTestSession();
});

When('I set baseline {string} tolerance to {float}', async function (baselineName, tolerance) {
    const mongoose = require('mongoose');
    const Baseline = mongoose.connection.collection('baselines');
    await Baseline.updateOne({ name: baselineName }, { $set: { toleranceThreshold: tolerance } });
});
