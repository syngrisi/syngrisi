import fs from 'fs';
import { promises as fsp } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { createGzip, createGunzip } from 'zlib';
import { promisify } from 'util';
import { pipeline, Readable } from 'stream';
import tar from 'tar-stream';
import mongoose from 'mongoose';
import { UploadedFile } from 'express-fileupload';
import { config } from '@config';
import { safeJoinWithin } from './../utils/safeJoinWithin';

const pipelineAsync = promisify(pipeline);
const { BSON } = mongoose.mongo;

export type AdminDataJobType =
    | 'db_backup'
    | 'db_restore'
    | 'screenshots_backup'
    | 'screenshots_restore';

export type AdminDataJobStatus =
    | 'pending'
    | 'running'
    | 'completed'
    | 'failed'
    | 'cancelled';

export interface AdminDataJobProgress {
    stage: string;
    current?: number;
    total?: number;
    percent?: number;
}

export interface AdminDataJobStats {
    archiveSizeBytes?: number;
    processedFiles?: number;
    totalFiles?: number;
    importedFiles?: number;
    skippedFiles?: number;
    errorFiles?: number;
}

export interface AdminDataJob {
    id: string;
    type: AdminDataJobType;
    status: AdminDataJobStatus;
    params: Record<string, unknown>;
    progress: AdminDataJobProgress;
    message: string;
    stats: AdminDataJobStats;
    downloadAvailable: boolean;
    archiveName?: string;
    archivePath?: string;
    uploadPath?: string;
    workDir: string;
    logFilePath: string;
    createdAt: string;
    startedAt?: string;
    finishedAt?: string;
    error?: string;
}

type ActiveTaskState = {
    cancelRequested: boolean;
};

type DbBackupManifest = {
    format: 'syngrisi-db-backup-v1';
    exportedAt: string;
    databaseName: string;
    collections: Array<{
        name: string;
        dumpFile: string;
        documentCount: number;
        indexes: Array<Record<string, unknown>>;
    }>;
};

const activeTasks = new Map<string, ActiveTaskState>();

const META_FILENAME = 'job.json';
const LOG_FILENAME = 'job.log';
const DB_EXPORT_DIRNAME = 'db-export';
const PRE_RESTORE_EXPORT_DIRNAME = 'pre-restore-export';
const PRE_RESTORE_RECOVER_DIRNAME = 'pre-restore-recover';
const PRE_RESTORE_BACKUP_FILENAME = 'pre-restore-backup.tar.gz';

// Small filesystem-independent lock used to make job admission (Problem B)
// mutually exclusive. Backed by the shared Mongoose connection, same as the
// rest of this service — no new client/dependency.
const JOB_ADMISSION_LOCK_COLLECTION = 'admin_data_job_locks';
const JOB_ADMISSION_LOCK_ID = 'admin-data-job-admission';

const isActiveStatus = (status: AdminDataJobStatus) => status === 'pending' || status === 'running';
const getJobDir = (jobId: string) => path.join(config.adminDataJobsPath, jobId);
const getJobMetaPath = (jobId: string) => path.join(getJobDir(jobId), META_FILENAME);
const getJobLogPath = (jobId: string) => path.join(getJobDir(jobId), LOG_FILENAME);

async function ensureDir(dirPath: string) {
    await fsp.mkdir(dirPath, { recursive: true });
}

async function removeDirSafe(dirPath?: string) {
    if (!dirPath) return;
    await fsp.rm(dirPath, { recursive: true, force: true });
}

async function fileExists(filePath: string) {
    try {
        await fsp.access(filePath);
        return true;
    } catch {
        return false;
    }
}

async function writeJob(job: AdminDataJob) {
    await ensureDir(job.workDir);
    await fsp.writeFile(getJobMetaPath(job.id), JSON.stringify(job, null, 2));
}

async function appendLog(jobId: string, message: string) {
    const line = `[${new Date().toISOString()}] ${message}\n`;
    await fsp.appendFile(getJobLogPath(jobId), line);
}

async function readJob(jobId: string): Promise<AdminDataJob | null> {
    try {
        const raw = await fsp.readFile(getJobMetaPath(jobId), 'utf8');
        return JSON.parse(raw) as AdminDataJob;
    } catch {
        return null;
    }
}

async function listJobsInternal(): Promise<AdminDataJob[]> {
    await ensureDir(config.adminDataJobsPath);
    const entries = await fsp.readdir(config.adminDataJobsPath, { withFileTypes: true });
    const jobs = await Promise.all(entries.filter((entry) => entry.isDirectory()).map((entry) => readJob(entry.name)));
    return jobs
        .filter((job): job is AdminDataJob => Boolean(job))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

async function updateJob(jobId: string, patch: Partial<AdminDataJob>) {
    const current = await readJob(jobId);
    if (!current) {
        throw new Error(`Job not found: ${jobId}`);
    }
    const nextJob = { ...current, ...patch };
    await writeJob(nextJob);
    return nextJob;
}

async function updateProgress(jobId: string, progress: AdminDataJobProgress, message?: string, statsPatch?: Partial<AdminDataJobStats>) {
    const current = await readJob(jobId);
    if (!current) return;
    const nextProgress = { ...current.progress, ...progress };
    if (typeof nextProgress.current === 'number' && typeof nextProgress.total === 'number' && nextProgress.total > 0) {
        nextProgress.percent = Math.min(100, Math.round((nextProgress.current / nextProgress.total) * 100));
    }
    await writeJob({
        ...current,
        progress: nextProgress,
        message: message ?? current.message,
        stats: { ...current.stats, ...statsPatch },
    });
}

async function finalizeJob(jobId: string, status: AdminDataJobStatus, patch: Partial<AdminDataJob> = {}) {
    const current = await readJob(jobId);
    if (!current) return null;
    // Every job that reached `createJob` claimed exactly one admission slot
    // (see `assertCanStartJob`/`mongoJobAdmissionGate`). Release it exactly
    // once, at the moment the job transitions from active to terminal —
    // guarding on the status read here (not just "status is terminal") so a
    // job that is re-finalized while already terminal (e.g. `cancelJob`
    // re-finalizing an already-finished job) does not release a slot that
    // was already released, which would incorrectly free a *different*
    // job's claim.
    const wasActive = isActiveStatus(current.status);
    const job = {
        ...current,
        ...patch,
        status,
        finishedAt: new Date().toISOString(),
    };
    await writeJob(job);
    if (wasActive) {
        await mongoJobAdmissionGate.release();
    }
    return job;
}

function normalizeArchiveName(type: AdminDataJobType) {
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    switch (type) {
        case 'db_backup':
            return `syngrisi-db-backup-${stamp}.tar.gz`;
        case 'screenshots_backup':
            return `syngrisi-screenshots-backup-${stamp}.tar.gz`;
        default:
            return `${type}-${stamp}.tar.gz`;
    }
}

async function getRunningJobs() {
    const jobs = await listJobsInternal();
    return jobs.filter((job) => isActiveStatus(job.status));
}

async function hasActiveDatabaseRestoreJob() {
    const jobs = await getRunningJobs();
    return jobs.some((job) => job.type === 'db_restore');
}

// --- Job admission gate (Problem B: check-then-act race on job admission) ---
//
// `getRunningJobs()` above stays the source of truth for *which* jobs are
// active (used by `hasActiveDatabaseRestoreJob` and for error messages), but
// it must never be the thing that *decides* admission — reading a directory
// listing and later writing a new job file are two separate awaits, so two
// concurrent `createJob` calls can both observe "nothing running" and both
// proceed. `JobAdmissionGate` is a tiny interface around a single atomic
// claim/release so admission is decided in one indivisible operation.
export interface JobAdmissionGate {
    /** Atomically attempt to claim one admission slot. Resolves false if the cap is reached. */
    tryClaim(): Promise<boolean>;
    /** Release a previously claimed slot. Must be safe to call even when no slot is held. */
    release(): Promise<void>;
}

/**
 * Wraps a `JobAdmissionGate` with the existing error shape. Exported
 * (alongside the `JobAdmissionGate` type) purely so the admission logic is
 * unit-testable with a fake gate, without requiring a live MongoDB — the
 * fake gate's own `tryClaim`/`release` must be atomic for the test to prove
 * anything; this function only proves the wrapper adds no additional race
 * between the claim and the error it raises.
 */
export async function claimJobSlot(gate: JobAdmissionGate, getBlockingJobId: () => Promise<string | undefined>): Promise<void> {
    const claimed = await gate.tryClaim();
    if (!claimed) {
        const blockingJobId = await getBlockingJobId();
        throw new Error(`Another data job is already active: ${blockingJobId ?? 'unknown'}`);
    }
}

type AdminDataJobLockDoc = { _id: string; count: number };

function getJobLocksCollection() {
    const db = mongoose.connection.db;
    if (!db) {
        throw new Error('MongoDB connection is not available');
    }
    return db.collection<AdminDataJobLockDoc>(JOB_ADMISSION_LOCK_COLLECTION);
}

// Single counting semaphore document, `{ _id, count }`. `_id` is unique by
// MongoDB default, so no extra index management is needed.
const mongoJobAdmissionGate: JobAdmissionGate = {
    async tryClaim() {
        const collection = getJobLocksCollection();
        const claimed = await collection.findOneAndUpdate(
            { _id: JOB_ADMISSION_LOCK_ID, count: { $lt: config.adminDataMaxConcurrentJobs } },
            { $inc: { count: 1 } },
        );
        if (claimed) return true;

        // Lock document may not exist yet (first ever claim). Create it
        // atomically: if two callers race here, only one `insertOne` can
        // win (unique `_id`); the loser gets a duplicate-key error, which we
        // correctly read as "did not get the slot".
        try {
            await collection.insertOne({ _id: JOB_ADMISSION_LOCK_ID, count: 1 });
            return true;
        } catch {
            return false;
        }
    },
    async release() {
        const collection = getJobLocksCollection();
        await collection.updateOne(
            { _id: JOB_ADMISSION_LOCK_ID, count: { $gt: 0 } },
            { $inc: { count: -1 } },
        );
    },
};

/**
 * Forces the admission counter to match reality. Called once on boot, after
 * `markStaleJobsFailed` has finalized (and thus released) every job that was
 * active when the process died. This closes the one gap `finalizeJob`'s
 * release can't cover on its own: a crash between `tryClaim()` succeeding and
 * the new job's file being written (before there is any job file for
 * `markStaleJobsFailed` to find and finalize) would otherwise leak a claim
 * forever and permanently block future jobs.
 */
async function resetJobAdmissionLock(activeCount: number) {
    const collection = getJobLocksCollection();
    await collection.updateOne(
        { _id: JOB_ADMISSION_LOCK_ID },
        { $set: { count: activeCount } },
        { upsert: true },
    );
}

async function assertCanStartJob() {
    await claimJobSlot(mongoJobAdmissionGate, async () => (await getRunningJobs())[0]?.id);
}

async function countFilesRecursive(rootDir: string): Promise<number> {
    let count = 0;
    const stack = [rootDir];
    while (stack.length > 0) {
        const currentDir = stack.pop();
        if (!currentDir) continue;
        const dir = await fsp.opendir(currentDir);
        for await (const entry of dir) {
            const entryPath = path.join(currentDir, entry.name);
            if (entry.isDirectory()) {
                stack.push(entryPath);
            } else if (entry.isFile()) {
                count += 1;
            }
        }
    }
    return count;
}

async function streamToFile(sourcePath: string, targetPath: string) {
    await ensureDir(path.dirname(targetPath));
    await pipelineAsync(fs.createReadStream(sourcePath), fs.createWriteStream(targetPath));
}

function getActiveState(jobId: string) {
    return activeTasks.get(jobId);
}

function assertNotCancelled(jobId: string) {
    if (getActiveState(jobId)?.cancelRequested) {
        throw new Error('Job cancelled');
    }
}

async function createJob(type: AdminDataJobType, params: Record<string, unknown>) {
    await assertCanStartJob();
    try {
        const id = randomUUID();
        const workDir = getJobDir(id);
        await ensureDir(workDir);

        const job: AdminDataJob = {
            id,
            type,
            status: 'pending',
            params,
            progress: { stage: 'queued', percent: 0 },
            message: 'Queued',
            stats: {},
            downloadAvailable: false,
            workDir,
            logFilePath: getJobLogPath(id),
            createdAt: new Date().toISOString(),
        };

        await writeJob(job);
        await appendLog(id, `Job created: ${type}`);
        return job;
    } catch (error) {
        // The slot was claimed above but the job never reached a written,
        // trackable state — release it here so this failure can't leak a
        // permanently-claimed slot (no job file exists yet for
        // `finalizeJob`/`markStaleJobsFailed` to release it later).
        await mongoJobAdmissionGate.release();
        throw error;
    }
}

async function addFileToTar(pack: tar.Pack, filePath: string, entryName: string) {
    const stat = await fsp.stat(filePath);
    await new Promise<void>((resolve, reject) => {
        const entry = pack.entry({ name: entryName, size: stat.size, mode: stat.mode }, (error) => {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        });
        fs.createReadStream(filePath).on('error', reject).pipe(entry).on('error', reject);
    });
}

async function createTarGzArchive(outputPath: string, items: Array<{ path: string; name: string }>) {
    await ensureDir(path.dirname(outputPath));
    const pack = tar.pack();
    const gzip = createGzip();
    const output = fs.createWriteStream(outputPath);
    const pipelinePromise = pipelineAsync(pack, gzip, output);

    for (const item of items) {
        await addFileToTar(pack, item.path, item.name);
    }

    pack.finalize();
    await pipelinePromise;
}

async function extractTarGzArchive(archivePath: string, destinationDir: string) {
    await ensureDir(destinationDir);
    const extract = tar.extract();

    await new Promise<void>((resolve, reject) => {
        extract.on('entry', (header, stream, next) => {
            const outputPath = safeJoinWithin(destinationDir, header.name);
            if (!outputPath) {
                stream.resume();
                next();
                return;
            }
            const finishEntry = (error?: Error | null) => {
                if (error) {
                    reject(error);
                    return;
                }
                next();
            };

            if (header.type === 'directory') {
                void ensureDir(outputPath).then(() => {
                    stream.resume();
                    finishEntry();
                }).catch((error) => finishEntry(error as Error));
                return;
            }

            void ensureDir(path.dirname(outputPath))
                .then(() => pipelineAsync(stream, fs.createWriteStream(outputPath)))
                .then(() => finishEntry())
                .catch((error) => finishEntry(error as Error));
        });

        extract.on('finish', () => resolve());
        extract.on('error', reject);

        fs.createReadStream(archivePath)
            .on('error', reject)
            .pipe(createGunzip())
            .on('error', reject)
            .pipe(extract)
            .on('error', reject);
    });
}

async function countFilesInTarGzArchive(archivePath: string) {
    const extract = tar.extract();
    let totalFiles = 0;

    await new Promise<void>((resolve, reject) => {
        extract.on('entry', (_header, stream, next) => {
            if (_header.type === 'file') {
                totalFiles += 1;
            }
            stream.resume();
            next();
        });
        extract.on('finish', () => resolve());
        extract.on('error', reject);

        fs.createReadStream(archivePath)
            .on('error', reject)
            .pipe(createGunzip())
            .on('error', reject)
            .pipe(extract)
            .on('error', reject);
    });

    return totalFiles;
}

async function writeCollectionDump(jobId: string, collectionName: string, outputPath: string) {
    const db = mongoose.connection.db;
    if (!db) {
        throw new Error('MongoDB connection is not available');
    }

    let documentCount = 0;
    await ensureDir(path.dirname(outputPath));

    const gzip = createGzip();
    const output = fs.createWriteStream(outputPath);
    gzip.pipe(output);

    const cursor = db.collection(collectionName).find({}, { timeout: false });
    for await (const doc of cursor) {
        assertNotCancelled(jobId);
        gzip.write(BSON.serialize(doc));
        documentCount += 1;
        if (documentCount % 1000 === 0) {
            await appendLog(jobId, `Exported ${documentCount} documents from ${collectionName}`);
        }
    }

    gzip.end();
    await new Promise<void>((resolve, reject) => {
        output.on('finish', () => resolve());
        output.on('error', reject);
        gzip.on('error', reject);
    });

    return documentCount;
}

async function walkFiles(rootDir: string, onFile: (fullPath: string, relativePath: string) => Promise<void>) {
    const stack = [rootDir];
    while (stack.length > 0) {
        const currentDir = stack.pop();
        if (!currentDir) continue;
        const dir = await fsp.opendir(currentDir);
        for await (const entry of dir) {
            const fullPath = path.join(currentDir, entry.name);
            const relativePath = path.relative(rootDir, fullPath);
            if (entry.isDirectory()) {
                stack.push(fullPath);
            } else if (entry.isFile()) {
                await onFile(fullPath, relativePath);
            }
        }
    }
}

async function runDbBackup(job: AdminDataJob) {
    const db = mongoose.connection.db;
    if (!db) {
        throw new Error('MongoDB connection is not available');
    }

    const archiveName = normalizeArchiveName(job.type);
    const archivePath = path.join(job.workDir, archiveName);
    const exportDir = path.join(job.workDir, DB_EXPORT_DIRNAME);
    await ensureDir(exportDir);

    await updateProgress(job.id, { stage: 'indexing', percent: 5 }, 'Inspecting database');
    const collectionInfos = await db.listCollections({}, { nameOnly: true }).toArray();
    const collections = collectionInfos.map((item) => item.name).filter((name) => !name.startsWith('system.'));
    const manifest: DbBackupManifest = {
        format: 'syngrisi-db-backup-v1',
        exportedAt: new Date().toISOString(),
        databaseName: db.databaseName,
        collections: [],
    };

    let processedCollections = 0;
    for (const collectionName of collections) {
        assertNotCancelled(job.id);
        const dumpFileName = `${collectionName}.bson.gz`;
        const dumpPath = path.join(exportDir, dumpFileName);
        await updateProgress(job.id, { stage: 'dumping', current: processedCollections, total: collections.length }, `Exporting ${collectionName}`);
        const documentCount = await writeCollectionDump(job.id, collectionName, dumpPath);
        const indexes = await db.collection(collectionName).indexes();
        manifest.collections.push({
            name: collectionName,
            dumpFile: dumpFileName,
            documentCount,
            indexes: indexes.map((index) => JSON.parse(JSON.stringify(index))),
        });
        processedCollections += 1;
        await updateProgress(job.id, { stage: 'dumping', current: processedCollections, total: collections.length }, `Exported ${collectionName}`);
    }

    const manifestPath = path.join(exportDir, 'manifest.json');
    await fsp.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

    await updateProgress(job.id, { stage: 'archiving', percent: 80 }, 'Creating archive');
    const tarItems = [
        { path: manifestPath, name: 'manifest.json' },
        ...manifest.collections.map((collection) => ({
            path: path.join(exportDir, collection.dumpFile),
            name: `collections/${collection.dumpFile}`,
        })),
    ];
    await createTarGzArchive(archivePath, tarItems);

    const stat = await fsp.stat(archivePath);
    await finalizeJob(job.id, 'completed', {
        message: 'Database backup completed',
        archivePath,
        archiveName,
        downloadAvailable: true,
        stats: {
            archiveSizeBytes: stat.size,
            processedFiles: manifest.collections.reduce((acc, item) => acc + item.documentCount, 0),
            totalFiles: manifest.collections.length,
        },
        progress: { stage: 'completed', percent: 100, current: manifest.collections.length, total: manifest.collections.length },
    });
}

async function recreateIndexes(collectionName: string, indexes: Array<Record<string, unknown>>) {
    const db = mongoose.connection.db;
    if (!db) {
        throw new Error('MongoDB connection is not available');
    }

    const filtered = indexes.filter((index) => index.name !== '_id_');
    if (filtered.length === 0) {
        return;
    }

    const definitions = filtered.map((index) => {
        const { key, ...options } = index as { key: Record<string, 1 | -1>; [key: string]: unknown };
        return { key, ...options };
    });

    await db.collection(collectionName).createIndexes(definitions as any);
}

async function importCollectionDump(jobId: string, collectionName: string, dumpPath: string) {
    const db = mongoose.connection.db;
    if (!db) {
        throw new Error('MongoDB connection is not available');
    }

    const collection = db.collection(collectionName);
    const batch: Record<string, unknown>[] = [];
    let inserted = 0;
    const flush = async () => {
        if (batch.length === 0) return;
        await collection.insertMany(batch, { ordered: false });
        inserted += batch.length;
        batch.length = 0;
    };

    const input = fs.createReadStream(dumpPath).pipe(createGunzip());
    let pending = Buffer.alloc(0);

    for await (const chunk of input) {
        assertNotCancelled(jobId);
        pending = Buffer.concat([pending, chunk as Buffer]);

        while (pending.length >= 4) {
            const documentSize = pending.readInt32LE(0);
            if (documentSize <= 0) {
                throw new Error(`Invalid BSON document size ${documentSize} in ${collectionName}`);
            }
            if (pending.length < documentSize) {
                break;
            }

            const documentBuffer = pending.subarray(0, documentSize);
            pending = pending.subarray(documentSize);
            batch.push(BSON.deserialize(documentBuffer) as Record<string, unknown>);

            if (batch.length >= 1000) {
                await flush();
                await appendLog(jobId, `Imported ${inserted} documents into ${collectionName}`);
            }
        }
    }

    if (pending.length > 0) {
        throw new Error(`Unexpected trailing BSON bytes in ${collectionName}`);
    }

    await flush();
    return inserted;
}

// --- Restore safety net (Problem A: destructive restore with no rollback) ---
//
// Decision (Step 2 of plans/016-db-restore-safety.md): Option B — take a
// pre-restore safety backup and roll back to it on any failure after the
// drop, rather than Option A (staging swap). Rationale: per-collection
// `renameCollection` cannot be done atomically as a set in MongoDB, so a
// staging swap cannot be shown to be atomic with the primitives available
// here; the safety-backup approach reuses the already-proven backup/restore
// primitives (`writeCollectionDump`, `DbBackupManifest`, `createTarGzArchive`,
// `extractTarGzArchive` + `importCollectionDump` + `recreateIndexes`)
// near-total, so the recovery path is exercised by the exact same code the
// backup/restore feature already relies on.

export interface RestoreRecoverySteps {
    createSafetyBackup: () => Promise<void>;
    performDropAndImport: () => Promise<void>;
    restoreFromSafetyBackup: () => Promise<void>;
}

/**
 * Pure orchestration of the safety-backup-then-restore sequence, exported so
 * it is unit-testable with fakes (no live MongoDB needed): create the safety
 * backup, attempt the drop+import, and on ANY failure during drop-or-import
 * (including cancellation — `assertNotCancelled` throws too, and must be
 * recovered from just like an import error) roll back from the safety
 * backup before re-throwing the original error. A failure while creating the
 * safety backup itself propagates untouched — nothing has been dropped yet,
 * so there is nothing to recover.
 */
export async function runRestoreWithSafetyBackup(steps: RestoreRecoverySteps): Promise<void> {
    await steps.createSafetyBackup();
    try {
        await steps.performDropAndImport();
    } catch (error) {
        await steps.restoreFromSafetyBackup();
        throw error;
    }
}

async function createPreRestoreSafetyBackup(job: AdminDataJob, archivePath: string) {
    const db = mongoose.connection.db;
    if (!db) {
        throw new Error('MongoDB connection is not available');
    }

    await updateProgress(job.id, { stage: 'safety_backup', percent: 15 }, 'Creating pre-restore safety backup');

    const exportDir = path.join(job.workDir, PRE_RESTORE_EXPORT_DIRNAME);
    await ensureDir(exportDir);

    const collectionInfos = await db.listCollections({}, { nameOnly: true }).toArray();
    const collections = collectionInfos.map((item) => item.name).filter((name) => !name.startsWith('system.'));
    const manifest: DbBackupManifest = {
        format: 'syngrisi-db-backup-v1',
        exportedAt: new Date().toISOString(),
        databaseName: db.databaseName,
        collections: [],
    };

    for (const collectionName of collections) {
        assertNotCancelled(job.id);
        const dumpFileName = `${collectionName}.bson.gz`;
        const dumpPath = path.join(exportDir, dumpFileName);
        const documentCount = await writeCollectionDump(job.id, collectionName, dumpPath);
        const indexes = await db.collection(collectionName).indexes();
        manifest.collections.push({
            name: collectionName,
            dumpFile: dumpFileName,
            documentCount,
            indexes: indexes.map((index) => JSON.parse(JSON.stringify(index))),
        });
    }

    const manifestPath = path.join(exportDir, 'manifest.json');
    await fsp.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

    const tarItems = [
        { path: manifestPath, name: 'manifest.json' },
        ...manifest.collections.map((collection) => ({
            path: path.join(exportDir, collection.dumpFile),
            name: `collections/${collection.dumpFile}`,
        })),
    ];
    await createTarGzArchive(archivePath, tarItems);
    await removeDirSafe(exportDir);
}

async function restoreFromSafetyArchive(job: AdminDataJob, archivePath: string) {
    const db = mongoose.connection.db;
    if (!db) {
        throw new Error('MongoDB connection is not available');
    }

    await appendLog(job.id, 'Restore failed after drop — recovering from safety backup');
    await updateProgress(job.id, { stage: 'recovering', percent: 90 }, 'Recovering from pre-restore safety backup');

    // Recovery must run to completion even if the failure that triggered it
    // was a cancellation request — otherwise the reused import helpers
    // (`writeCollectionDump`/`importCollectionDump` both call
    // `assertNotCancelled`) would abort the rollback itself, leaving the
    // database empty/partial with no further recovery attempt. Temporarily
    // clear the flag for the duration of the recovery, then restore it.
    const activeState = getActiveState(job.id);
    const hadCancelRequested = activeState?.cancelRequested ?? false;
    if (activeState) activeState.cancelRequested = false;

    try {
        const recoverDir = path.join(job.workDir, PRE_RESTORE_RECOVER_DIRNAME);
        await extractTarGzArchive(archivePath, recoverDir);

        const manifestPath = path.join(recoverDir, 'manifest.json');
        const manifest = JSON.parse(await fsp.readFile(manifestPath, 'utf8')) as DbBackupManifest;

        // The failed restore may have already dropped and partially
        // reimported data; drop again so recovery starts from a clean slate
        // and ends up exactly at the pre-restore state.
        await db.dropDatabase();
        for (const collectionInfo of manifest.collections) {
            const dumpPath = path.join(recoverDir, 'collections', collectionInfo.dumpFile);
            await importCollectionDump(job.id, collectionInfo.name, dumpPath);
            await recreateIndexes(collectionInfo.name, collectionInfo.indexes);
        }
        await removeDirSafe(recoverDir);
    } finally {
        if (activeState) activeState.cancelRequested = hadCancelRequested;
    }
}

async function runDbRestore(job: AdminDataJob) {
    const db = mongoose.connection.db;
    if (!db) {
        throw new Error('MongoDB connection is not available');
    }

    const uploadPath = String(job.uploadPath || '');
    if (!uploadPath || !(await fileExists(uploadPath))) {
        throw new Error('Uploaded archive is missing');
    }

    const extractDir = path.join(job.workDir, 'extracted-db');
    await updateProgress(job.id, { stage: 'extracting', percent: 10 }, 'Extracting database archive');
    await extractTarGzArchive(uploadPath, extractDir);

    const manifestPath = path.join(extractDir, 'manifest.json');
    if (!(await fileExists(manifestPath))) {
        throw new Error('manifest.json is missing from database archive');
    }

    const manifest = JSON.parse(await fsp.readFile(manifestPath, 'utf8')) as DbBackupManifest;
    if (manifest.format !== 'syngrisi-db-backup-v1') {
        throw new Error('Unsupported database backup format');
    }

    const safetyArchivePath = path.join(job.workDir, PRE_RESTORE_BACKUP_FILENAME);
    let importedCollections = 0;

    await runRestoreWithSafetyBackup({
        createSafetyBackup: () => createPreRestoreSafetyBackup(job, safetyArchivePath),
        performDropAndImport: async () => {
            await updateProgress(job.id, { stage: 'dropping_db', percent: 30 }, 'Dropping current database');
            await db.dropDatabase();

            for (const collectionInfo of manifest.collections) {
                assertNotCancelled(job.id);
                const dumpPath = path.join(extractDir, 'collections', collectionInfo.dumpFile);
                await updateProgress(
                    job.id,
                    { stage: 'restoring', current: importedCollections, total: manifest.collections.length },
                    `Restoring ${collectionInfo.name}`,
                );
                await importCollectionDump(job.id, collectionInfo.name, dumpPath);
                await recreateIndexes(collectionInfo.name, collectionInfo.indexes);
                importedCollections += 1;
                await updateProgress(
                    job.id,
                    { stage: 'restoring', current: importedCollections, total: manifest.collections.length },
                    `Restored ${collectionInfo.name}`,
                );
            }
        },
        restoreFromSafetyBackup: () => restoreFromSafetyArchive(job, safetyArchivePath),
    });

    await finalizeJob(job.id, 'completed', {
        message: 'Database restore completed',
        progress: { stage: 'completed', percent: 100, current: importedCollections, total: manifest.collections.length },
        stats: {
            processedFiles: manifest.collections.reduce((acc, item) => acc + item.documentCount, 0),
            totalFiles: manifest.collections.length,
        },
    });
}

async function runScreenshotsBackup(job: AdminDataJob) {
    const archiveName = normalizeArchiveName(job.type);
    const archivePath = path.join(job.workDir, archiveName);
    const totalFiles = await countFilesRecursive(config.defaultImagesPath);
    let processedFiles = 0;

    await ensureDir(path.dirname(archivePath));
    const pack = tar.pack();
    const gzip = createGzip();
    const output = fs.createWriteStream(archivePath);
    const archivePipeline = pipelineAsync(pack, gzip, output);

    await updateProgress(job.id, { stage: 'archiving', current: 0, total: totalFiles }, 'Archiving screenshots', { totalFiles });
    await walkFiles(config.defaultImagesPath, async (fullPath, relativePath) => {
        assertNotCancelled(job.id);
        await addFileToTar(pack, fullPath, relativePath);
        processedFiles += 1;
        if (processedFiles % 200 === 0 || processedFiles === totalFiles) {
            await updateProgress(job.id, { stage: 'archiving', current: processedFiles, total: totalFiles }, 'Archiving screenshots', { processedFiles, totalFiles });
        }
    });

    pack.finalize();
    await archivePipeline;

    const stat = await fsp.stat(archivePath);
    await finalizeJob(job.id, 'completed', {
        message: 'Screenshots backup completed',
        archivePath,
        archiveName,
        downloadAvailable: true,
        stats: { archiveSizeBytes: stat.size, processedFiles, totalFiles },
        progress: { stage: 'completed', percent: 100, current: processedFiles, total: totalFiles },
    });
}

async function runScreenshotsRestore(job: AdminDataJob) {
    const uploadPath = String(job.uploadPath || '');
    const skipExisting = Boolean(job.params.skipExisting);
    if (!uploadPath || !(await fileExists(uploadPath))) {
        throw new Error('Uploaded archive is missing');
    }

    const totalFiles = await countFilesInTarGzArchive(uploadPath);
    let processedFiles = 0;
    let importedFiles = 0;
    let skippedFiles = 0;
    let errorFiles = 0;

    await updateProgress(job.id, { stage: 'importing', current: 0, total: totalFiles }, 'Importing screenshots', { totalFiles });

    const extract = tar.extract();
    await new Promise<void>((resolve, reject) => {
        extract.on('entry', (header, stream, next) => {
            const finish = (error?: Error | null) => {
                if (error) {
                    reject(error);
                    return;
                }
                next();
            };

            if (header.type !== 'file') {
                stream.resume();
                finish();
                return;
            }

            const relativePath = header.name;
            const targetPath = safeJoinWithin(config.defaultImagesPath, relativePath);
            if (!targetPath) {
                stream.resume();
                finish();
                return;
            }

            void (async () => {
                assertNotCancelled(job.id);
                const exists = await fileExists(targetPath);
                if (exists && skipExisting) {
                    skippedFiles += 1;
                    stream.resume();
                } else {
                    await ensureDir(path.dirname(targetPath));
                    if (exists) {
                        await fsp.rm(targetPath, { force: true });
                    }
                    await pipelineAsync(stream, fs.createWriteStream(targetPath));
                    importedFiles += 1;
                }
                processedFiles += 1;
                if (processedFiles % 200 === 0 || processedFiles === totalFiles) {
                    await updateProgress(
                        job.id,
                        { stage: 'importing', current: processedFiles, total: totalFiles },
                        'Importing screenshots',
                        { processedFiles, importedFiles, skippedFiles, errorFiles, totalFiles },
                    );
                }
            })().then(() => finish()).catch(async (error: Error) => {
                errorFiles += 1;
                await appendLog(job.id, `Failed to import ${relativePath}: ${error.message}`);
                stream.resume();
                processedFiles += 1;
                finish();
            });
        });

        extract.on('finish', () => resolve());
        extract.on('error', reject);

        fs.createReadStream(uploadPath)
            .on('error', reject)
            .pipe(createGunzip())
            .on('error', reject)
            .pipe(extract)
            .on('error', reject);
    });

    await finalizeJob(job.id, 'completed', {
        message: 'Screenshots restore completed',
        progress: { stage: 'completed', percent: 100, current: processedFiles, total: totalFiles },
        stats: { totalFiles, processedFiles, importedFiles, skippedFiles, errorFiles },
    });
}

async function cleanupExpiredJobs() {
    const jobs = await listJobsInternal();
    const now = Date.now();
    await Promise.all(jobs.map(async (job) => {
        if (isActiveStatus(job.status)) return;
        const finishedAt = job.finishedAt ? new Date(job.finishedAt).getTime() : new Date(job.createdAt).getTime();
        if ((now - finishedAt) > config.adminDataJobsTtlMs) {
            await removeDirSafe(job.workDir);
        }
    }));
}

async function cleanupJobWorkdirs(jobId: string) {
    const job = await readJob(jobId);
    if (!job) return;
    await removeDirSafe(path.join(job.workDir, 'staging'));
    await removeDirSafe(path.join(job.workDir, 'extracted'));
    await removeDirSafe(path.join(job.workDir, 'extracted-db'));
    await removeDirSafe(path.join(job.workDir, DB_EXPORT_DIRNAME));
    // Safe to always remove: this runs in `runJob`'s `finally`, which only
    // executes after `runDbRestore` has already returned or thrown — i.e.
    // after any needed recovery (`restoreFromSafetyArchive`) has already run
    // to completion. Never reached before recovery could need the archive.
    await removeDirSafe(path.join(job.workDir, PRE_RESTORE_EXPORT_DIRNAME));
    await removeDirSafe(path.join(job.workDir, PRE_RESTORE_RECOVER_DIRNAME));
    await fsp.rm(path.join(job.workDir, PRE_RESTORE_BACKUP_FILENAME), { force: true });
    if (job.status === 'completed' && job.downloadAvailable) {
        if (job.uploadPath) {
            await fsp.rm(job.uploadPath, { force: true });
        }
        return;
    }
    if (job.uploadPath) {
        await fsp.rm(job.uploadPath, { force: true });
    }
}

async function markStaleJobsFailed() {
    const jobs = await listJobsInternal();
    await Promise.all(jobs.map(async (job) => {
        if (isActiveStatus(job.status)) {
            await finalizeJob(job.id, 'failed', {
                message: 'Marked as failed after server restart',
                error: 'Server restarted while job was running',
                downloadAvailable: false,
            });
        }
    }));
}

async function initialize() {
    await ensureDir(config.adminDataJobsPath);
    await markStaleJobsFailed();
    // Resync the admission counter to the (now accurate, post-stale-cleanup)
    // count of still-active jobs. This is the backstop for the one gap the
    // per-job release in `finalizeJob` cannot cover: a process crash between
    // `tryClaim()` succeeding and the job file being written, before there
    // was any job file for `markStaleJobsFailed` to find. Without this, that
    // narrow crash window could leak a claimed slot across a restart and
    // permanently block future jobs.
    const runningJobs = await getRunningJobs();
    await resetJobAdmissionLock(runningJobs.length);
    await cleanupExpiredJobs();
}

async function startJob(job: AdminDataJob) {
    setImmediate(() => {
        void runJob(job.id);
    });
}

async function runJob(jobId: string) {
    const currentJob = await readJob(jobId);
    if (!currentJob || currentJob.status === 'cancelled') {
        return;
    }

    activeTasks.set(jobId, { cancelRequested: false });
    const job = await updateJob(jobId, {
        status: 'running',
        startedAt: new Date().toISOString(),
        progress: { stage: 'preparing', percent: 0 },
        message: 'Preparing',
    });

    try {
        switch (job.type) {
            case 'db_backup':
                await runDbBackup(job);
                break;
            case 'db_restore':
                await runDbRestore(job);
                break;
            case 'screenshots_backup':
                await runScreenshotsBackup(job);
                break;
            case 'screenshots_restore':
                await runScreenshotsRestore(job);
                break;
            default:
                throw new Error(`Unsupported job type: ${job.type}`);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const cancelled = message === 'Job cancelled';
        await appendLog(jobId, `Job ${cancelled ? 'cancelled' : 'failed'}: ${message}`);
        await finalizeJob(jobId, cancelled ? 'cancelled' : 'failed', {
            error: cancelled ? undefined : message,
            message: cancelled ? 'Cancelled' : message,
            downloadAvailable: false,
        });
    } finally {
        activeTasks.delete(jobId);
        await cleanupJobWorkdirs(jobId);
    }
}

async function persistUploadToJobDir(file: UploadedFile, jobDir: string, fileName: string) {
    const targetPath = path.join(jobDir, fileName);
    await ensureDir(jobDir);
    if (file.tempFilePath) {
        await fsp.rename(file.tempFilePath, targetPath).catch(async () => {
            await streamToFile(file.tempFilePath, targetPath);
            await fsp.rm(file.tempFilePath, { force: true });
        });
    } else {
        await fsp.writeFile(targetPath, file.data);
    }
    return targetPath;
}

async function createDbBackupJob() {
    const job = await createJob('db_backup', {});
    await startJob(job);
    return readJob(job.id);
}

async function createScreenshotsBackupJob() {
    const job = await createJob('screenshots_backup', {});
    await startJob(job);
    return readJob(job.id);
}

async function createDbRestoreJob(file: UploadedFile) {
    const job = await createJob('db_restore', {});
    const uploadPath = await persistUploadToJobDir(file, path.join(job.workDir, 'staging'), file.name || 'db-restore.tar.gz');
    await updateJob(job.id, {
        uploadPath,
        message: 'Upload stored, waiting for restore',
    });
    const updated = await readJob(job.id);
    if (!updated) throw new Error('Failed to read created job');
    await startJob(updated);
    return readJob(updated.id);
}

async function createScreenshotsRestoreJob(file: UploadedFile, skipExisting: boolean) {
    const job = await createJob('screenshots_restore', { skipExisting });
    const uploadPath = await persistUploadToJobDir(file, path.join(job.workDir, 'staging'), file.name || 'screenshots-restore.tar.gz');
    await updateJob(job.id, {
        uploadPath,
        message: 'Upload stored, waiting for restore',
    });
    const updated = await readJob(job.id);
    if (!updated) throw new Error('Failed to read created job');
    await startJob(updated);
    return readJob(updated.id);
}

async function getJob(jobId: string) {
    return readJob(jobId);
}

async function getJobLog(jobId: string) {
    try {
        return await fsp.readFile(getJobLogPath(jobId), 'utf8');
    } catch {
        return '';
    }
}

async function cancelJob(jobId: string) {
    const job = await readJob(jobId);
    if (!job) {
        throw new Error(`Job not found: ${jobId}`);
    }
    const active = activeTasks.get(jobId);
    if (!active) {
        return finalizeJob(jobId, job.status === 'pending' ? 'cancelled' : job.status, {
            message: job.status === 'pending' ? 'Cancelled' : job.message,
        });
    }
    active.cancelRequested = true;
    await appendLog(jobId, 'Cancellation requested');
    return updateJob(jobId, { message: 'Cancellation requested' });
}

async function createDownloadStream(jobId: string) {
    const job = await readJob(jobId);
    if (!job || job.status !== 'completed' || !job.downloadAvailable || !job.archivePath) {
        throw new Error('Download is not available for this job');
    }
    if (!(await fileExists(job.archivePath))) {
        throw new Error('Archive file is missing');
    }
    return {
        fileName: job.archiveName || path.basename(job.archivePath),
        stream: fs.createReadStream(job.archivePath),
    };
}

async function deleteJob(jobId: string) {
    const job = await readJob(jobId);
    if (!job) {
        throw new Error(`Job not found: ${jobId}`);
    }
    if (isActiveStatus(job.status)) {
        throw new Error('Cannot delete an active job. Cancel it first.');
    }
    await removeDirSafe(job.workDir);
    return { deleted: true, id: jobId };
}

export const adminDataJobService = {
    initialize,
    listJobs: listJobsInternal,
    getJob,
    getJobLog,
    createDbBackupJob,
    createDbRestoreJob,
    createScreenshotsBackupJob,
    createScreenshotsRestoreJob,
    cancelJob,
    deleteJob,
    createDownloadStream,
    hasActiveDatabaseRestoreJob,
};
