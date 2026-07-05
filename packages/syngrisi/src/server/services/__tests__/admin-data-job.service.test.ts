import { test, before, after, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import fsp from 'fs/promises';
import os from 'os';
import path from 'path';
import { randomUUID } from 'crypto';
import { config } from '@config';
import { adminDataJobService, AdminDataJob } from '../admin-data-job.service';

// adminDataJobService reads/writes job.json files under config.adminDataJobsPath.
// Point that at a throwaway temp dir so these tests are filesystem-only and
// never touch the real jobs directory or a database. We never call any
// create*Job/restore/backup method here (those spawn async work and need a
// live Mongo connection) -- only the deterministic guard surface.

let tmpDir: string;
let originalAdminDataJobsPath: string;

before(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'syn-jobs-'));
    originalAdminDataJobsPath = config.adminDataJobsPath;
    (config as any).adminDataJobsPath = tmpDir;
});

after(async () => {
    (config as any).adminDataJobsPath = originalAdminDataJobsPath;
    await fsp.rm(tmpDir, { recursive: true, force: true });
});

// listJobsInternal() scans every subdir of config.adminDataJobsPath, so job
// fixtures from one test would otherwise leak into the next; clear the temp
// dir's contents between tests to keep each test's job listing isolated.
afterEach(async () => {
    const entries = await fsp.readdir(tmpDir);
    await Promise.all(entries.map((entry) => fsp.rm(path.join(tmpDir, entry), { recursive: true, force: true })));
});

const makeJob = (overrides: Partial<AdminDataJob>): AdminDataJob => {
    const id = overrides.id ?? randomUUID();
    return {
        id,
        type: 'db_restore',
        status: 'pending',
        params: {},
        progress: { stage: 'queued' },
        message: '',
        stats: {},
        downloadAvailable: false,
        workDir: path.join(tmpDir, id),
        logFilePath: path.join(tmpDir, id, 'job.log'),
        createdAt: new Date().toISOString(),
        ...overrides,
    };
};

const writeJobFixture = async (job: AdminDataJob) => {
    const jobDir = path.join(tmpDir, job.id);
    await fsp.mkdir(jobDir, { recursive: true });
    await fsp.writeFile(path.join(jobDir, 'job.json'), JSON.stringify(job, null, 2));
    return job;
};

// --- hasActiveDatabaseRestoreJob (admin-data-job.service.ts:193-196) ---

test('hasActiveDatabaseRestoreJob returns true for a running db_restore job', async () => {
    await writeJobFixture(makeJob({ type: 'db_restore', status: 'running' }));

    const result = await adminDataJobService.hasActiveDatabaseRestoreJob();

    assert.equal(result, true);
});

test('hasActiveDatabaseRestoreJob returns false when the db_restore job is completed', async () => {
    await writeJobFixture(makeJob({ type: 'db_restore', status: 'completed' }));

    const result = await adminDataJobService.hasActiveDatabaseRestoreJob();

    assert.equal(result, false);
});

test('hasActiveDatabaseRestoreJob returns false for a running job of a non-restore type', async () => {
    await writeJobFixture(makeJob({ type: 'db_backup', status: 'running' }));

    const result = await adminDataJobService.hasActiveDatabaseRestoreJob();

    assert.equal(result, false);
});

// --- deleteJob active-guard (admin-data-job.service.ts:921-931) ---

test('deleteJob throws when the job is active (pending/running)', async () => {
    const job = await writeJobFixture(makeJob({ type: 'db_backup', status: 'running' }));

    await assert.rejects(
        () => adminDataJobService.deleteJob(job.id),
        /Cannot delete an active job\. Cancel it first\./,
    );
});

test('deleteJob succeeds and removes the workDir for a completed job', async () => {
    const job = await writeJobFixture(makeJob({ type: 'db_backup', status: 'completed' }));

    const result = await adminDataJobService.deleteJob(job.id);

    assert.deepEqual(result, { deleted: true, id: job.id });
    assert.equal(fs.existsSync(job.workDir), false);
});

// --- cancelJob for a pending job with no in-memory active task (admin-data-job.service.ts:896-901) ---

test('cancelJob finalizes a pending job to cancelled with message "Cancelled"', async () => {
    const job = await writeJobFixture(makeJob({ type: 'db_backup', status: 'pending' }));

    const result = await adminDataJobService.cancelJob(job.id);

    assert.equal(result?.status, 'cancelled');
    assert.equal(result?.message, 'Cancelled');
});
