import { AutoCleanupScheduler } from './autoCleanupScheduler';
import { handleOldBaselinesTask, handleOldChecksTask, removeOldLogsTask } from '@/tasks/core';
import { LoggerOutputWriter } from '@/tasks/lib/output-writer';
import { App } from '@models';


const checksScheduler = new AutoCleanupScheduler({
    settingName: 'auto_remove_old_checks',
    defaultDays: 365,
    scope: 'auto_old_checks',
    runTask: async ({ days }) => {
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
    runTask: async ({ days }) => {
        const output = new LoggerOutputWriter('auto_old_logs');
        await removeOldLogsTask({ days, dryRun: false }, output);
    },
});

const baselinesScheduler = new AutoCleanupScheduler({
    settingName: 'auto_remove_old_baselines',
    defaultDays: 120,
    defaultKeepLast: 5,
    scope: 'auto_old_baselines',
    runTask: async ({ days, keepLast }) => {
        const output = new LoggerOutputWriter('auto_old_baselines');
        await handleOldBaselinesTask({
            days,
            keepLast: keepLast ?? 5,
            remove: true,
        }, output);
    },
});

export const autoCleanupSchedulers = {
    checks: checksScheduler,
    logs: logsScheduler,
    baselines: baselinesScheduler,
};
