import { promises as fsp } from 'fs';
import path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';
import fs from 'fs';
import { config } from '@config';

const pipelineAsync = promisify(pipeline);

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

export const META_FILENAME = 'job.json';
export const LOG_FILENAME = 'job.log';
export const DB_EXPORT_DIRNAME = 'db-export';

export const isActiveStatus = (status: AdminDataJobStatus) => status === 'pending' || status === 'running';
export const getJobDir = (jobId: string) => path.join(config.adminDataJobsPath, jobId);
export const getJobMetaPath = (jobId: string) => path.join(getJobDir(jobId), META_FILENAME);
export const getJobLogPath = (jobId: string) => path.join(getJobDir(jobId), LOG_FILENAME);

export async function ensureDir(dirPath: string) {
    await fsp.mkdir(dirPath, { recursive: true });
}

export async function removeDirSafe(dirPath?: string) {
    if (!dirPath) return;
    await fsp.rm(dirPath, { recursive: true, force: true });
}

export async function fileExists(filePath: string) {
    try {
        await fsp.access(filePath);
        return true;
    } catch {
        return false;
    }
}

export async function streamToFile(sourcePath: string, targetPath: string) {
    await ensureDir(path.dirname(targetPath));
    await pipelineAsync(fs.createReadStream(sourcePath), fs.createWriteStream(targetPath));
}

export async function writeJob(job: AdminDataJob) {
    await ensureDir(job.workDir);
    await fsp.writeFile(getJobMetaPath(job.id), JSON.stringify(job, null, 2));
}

export async function appendLog(jobId: string, message: string) {
    const line = `[${new Date().toISOString()}] ${message}\n`;
    await fsp.appendFile(getJobLogPath(jobId), line);
}

export async function readJob(jobId: string): Promise<AdminDataJob | null> {
    try {
        const raw = await fsp.readFile(getJobMetaPath(jobId), 'utf8');
        return JSON.parse(raw) as AdminDataJob;
    } catch {
        return null;
    }
}

export async function listJobsInternal(): Promise<AdminDataJob[]> {
    await ensureDir(config.adminDataJobsPath);
    const entries = await fsp.readdir(config.adminDataJobsPath, { withFileTypes: true });
    const jobs = await Promise.all(entries.filter((entry) => entry.isDirectory()).map((entry) => readJob(entry.name)));
    return jobs
        .filter((job): job is AdminDataJob => Boolean(job))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function updateJob(jobId: string, patch: Partial<AdminDataJob>) {
    const current = await readJob(jobId);
    if (!current) {
        throw new Error(`Job not found: ${jobId}`);
    }
    const nextJob = { ...current, ...patch };
    await writeJob(nextJob);
    return nextJob;
}

export async function updateProgress(jobId: string, progress: AdminDataJobProgress, message?: string, statsPatch?: Partial<AdminDataJobStats>) {
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

export function normalizeArchiveName(type: AdminDataJobType) {
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
