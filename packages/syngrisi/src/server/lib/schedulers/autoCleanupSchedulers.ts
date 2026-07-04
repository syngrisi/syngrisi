import { AutoCleanupScheduler } from './autoCleanupScheduler';
import { handleOldChecksTask, removeOldLogsTask } from '@/tasks/core';
import { LoggerOutputWriter } from '@/tasks/lib/output-writer';
import { App } from '@models';


const checksScheduler = new AutoCleanupScheduler({
    settingName: 'auto_remove_old_checks',
    defaultDays: 365,
    scope: 'auto_old_checks',
    runTask: async (days: number) => {
        const output = new LoggerOutputWriter('auto_old_checks');
        await handleOldChecksTask({ days, remove: true }, output);

        // Per-project retention: additionally clean up checks for projects that opted in
        // to their own retention window, independent of the instance-wide setting above.
        const apps = await App.find({ retentionEnabled: true, retentionDays: { $gt: 0 } }).lean();
        for (const a of apps) {
            await handleOldChecksTask({ days: a.retentionDays as number, remove: true, appId: String(a._id) }, output);
        }
    },
});

const logsScheduler = new AutoCleanupScheduler({
    settingName: 'auto_remove_old_logs',
    defaultDays: 120,
    scope: 'auto_old_logs',
    runTask: async (days: number) => {
        const output = new LoggerOutputWriter('auto_old_logs');
        await removeOldLogsTask({ days, dryRun: false }, output);
    },
});

export const autoCleanupSchedulers = {
    checks: checksScheduler,
    logs: logsScheduler,
};
