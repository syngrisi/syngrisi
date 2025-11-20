import { AutoCleanupScheduler } from './autoCleanupScheduler';
import { handleOldChecksTask, removeOldLogsTask } from '@/tasks/core';
import { LoggerOutputWriter } from '@/tasks/lib/output-writer';


const checksScheduler = new AutoCleanupScheduler({
    settingName: 'auto_remove_old_checks',
    defaultDays: 365,
    scope: 'auto_old_checks',
    runTask: async (days: number) => {
        const output = new LoggerOutputWriter('auto_old_checks');
        await handleOldChecksTask({ days, remove: true }, output);
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
