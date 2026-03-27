import { http } from '@shared/lib/http';

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

export interface AdminDataJob {
    id: string;
    type: AdminDataJobType;
    status: AdminDataJobStatus;
    params: Record<string, unknown>;
    progress: {
        stage: string;
        current?: number;
        total?: number;
        percent?: number;
    };
    message: string;
    stats: {
        archiveSizeBytes?: number;
        processedFiles?: number;
        totalFiles?: number;
        importedFiles?: number;
        skippedFiles?: number;
        errorFiles?: number;
    };
    downloadAvailable: boolean;
    archiveName?: string;
    createdAt: string;
    startedAt?: string;
    finishedAt?: string;
    error?: string;
}

async function uploadForm<T>(url: string, formData: FormData): Promise<T> {
    const response = await fetch(url, {
        method: 'POST',
        body: formData,
        credentials: 'include',
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Request failed with status ${response.status}`);
    }

    return response.json();
}

export const adminDataService = {
    async listJobs(): Promise<{ jobs: AdminDataJob[] }> {
        const response = await http.get('/v1/admin/data/jobs', {}, 'adminDataService.listJobs');
        return response.json();
    },

    async getJobLog(jobId: string): Promise<string> {
        const response = await http.get(`/v1/admin/data/jobs/${jobId}/log`, {}, 'adminDataService.getJobLog');
        return response.text();
    },

    async cancelJob(jobId: string): Promise<AdminDataJob> {
        const response = await http.post(`/v1/admin/data/jobs/${jobId}/cancel`, undefined, {}, 'adminDataService.cancelJob');
        return response.json();
    },

    async startDbBackup(): Promise<AdminDataJob> {
        const response = await http.post('/v1/admin/data/db/backup', undefined, {}, 'adminDataService.startDbBackup');
        return response.json();
    },

    async startScreenshotsBackup(): Promise<AdminDataJob> {
        const response = await http.post('/v1/admin/data/screenshots/backup', undefined, {}, 'adminDataService.startScreenshotsBackup');
        return response.json();
    },

    async startDbRestore(file: File): Promise<AdminDataJob> {
        const formData = new FormData();
        formData.append('file', file);
        return uploadForm('/v1/admin/data/db/restore', formData);
    },

    async startScreenshotsRestore(file: File, skipExisting: boolean): Promise<AdminDataJob> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('skipExisting', String(skipExisting));
        return uploadForm('/v1/admin/data/screenshots/restore', formData);
    },

    getDownloadUrl(jobId: string): string {
        return `/v1/admin/data/jobs/${jobId}/download`;
    },
};
