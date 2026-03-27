import { Request, Response } from 'express';
import { adminDataJobService } from '@services/admin-data-job.service';
import { UploadedFile } from 'express-fileupload';

const getRequiredFile = (req: Request): UploadedFile => {
    const uploaded = req.files?.file;
    if (!uploaded) {
        throw new Error('file is required');
    }
    if (Array.isArray(uploaded)) {
        throw new Error('multiple files are not supported');
    }
    return uploaded as UploadedFile;
};

export const listJobs = async (req: Request, res: Response): Promise<void> => {
    const jobs = await adminDataJobService.listJobs();
    res.json({ jobs });
};

export const getJob = async (req: Request, res: Response): Promise<void> => {
    const job = await adminDataJobService.getJob(req.params.id);
    if (!job) {
        res.status(404).json({ error: 'Job not found' });
        return;
    }
    res.json(job);
};

export const getJobLog = async (req: Request, res: Response): Promise<void> => {
    const job = await adminDataJobService.getJob(req.params.id);
    if (!job) {
        res.status(404).json({ error: 'Job not found' });
        return;
    }
    const log = await adminDataJobService.getJobLog(req.params.id);
    res.type('text/plain').send(log);
};

export const createDbBackup = async (req: Request, res: Response): Promise<void> => {
    const job = await adminDataJobService.createDbBackupJob();
    res.status(202).json(job);
};

export const createDbRestore = async (req: Request, res: Response): Promise<void> => {
    const file = getRequiredFile(req);
    const job = await adminDataJobService.createDbRestoreJob(file);
    res.status(202).json(job);
};

export const createScreenshotsBackup = async (req: Request, res: Response): Promise<void> => {
    const job = await adminDataJobService.createScreenshotsBackupJob();
    res.status(202).json(job);
};

export const createScreenshotsRestore = async (req: Request, res: Response): Promise<void> => {
    const file = getRequiredFile(req);
    const skipExisting = String(req.body?.skipExisting || '').toLowerCase() === 'true';
    const job = await adminDataJobService.createScreenshotsRestoreJob(file, skipExisting);
    res.status(202).json(job);
};

export const cancelJob = async (req: Request, res: Response): Promise<void> => {
    const job = await adminDataJobService.cancelJob(req.params.id);
    res.json(job);
};

export const downloadJobArchive = async (req: Request, res: Response): Promise<void> => {
    try {
        const { fileName, stream } = await adminDataJobService.createDownloadStream(req.params.id);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        stream.pipe(res);
    } catch (error) {
        res.status(404).json({ error: error instanceof Error ? error.message : String(error) });
    }
};
