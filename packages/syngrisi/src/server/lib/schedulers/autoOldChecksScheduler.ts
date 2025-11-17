import log from '@logger';
import { handleOldChecksTask } from '@/tasks/core';
import { LoggerOutputWriter } from '@/tasks/lib/output-writer';
import { appSettings } from '@settings';
import { env } from '@/server/envConfig';
import { errMsg } from '@/server/utils';

type AutoRemoveOldChecksValue = {
    days?: number;
    lastRunAt?: string | null;
};

const DEFAULT_DAYS = 365;

class AutoOldChecksScheduler {
    private timer: NodeJS.Timeout | null = null;
    private running = false;

    start(): void {
        if (this.timer) {
            return;
        }
        const intervalMs = env.SYNGRISI_AUTO_REMOVE_CHECKS_POLL_INTERVAL_MS;
        this.timer = setInterval(() => {
            void this.tick();
        }, intervalMs);
        void this.tick();
        log.info(`[auto_old_checks] scheduler started (poll every ${intervalMs}ms)`);
    }

    stop(): void {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
            log.info('[auto_old_checks] scheduler stopped');
        }
    }

    private async tick(): Promise<void> {
        if (this.running) {
            return;
        }
        this.running = true;

        try {
            const AppSettings = await appSettings;
            const setting = await AppSettings.get('auto_remove_old_checks');
            if (!setting || !setting.enabled) {
                return;
            }

            const value: AutoRemoveOldChecksValue = setting.value ?? {};
            const days = typeof value.days === 'number' && value.days > 0 ? value.days : DEFAULT_DAYS;
            const lastRunAt = value.lastRunAt ? new Date(value.lastRunAt) : null;
            const now = Date.now();
            const minInterval = env.SYNGRISI_AUTO_REMOVE_CHECKS_MIN_INTERVAL_MS;
            const shouldRun = !lastRunAt || (now - lastRunAt.getTime()) >= minInterval;

            if (!shouldRun) {
                return;
            }

            log.info(`[auto_old_checks] triggering cleanup for checks older than ${days} days`);
            const output = new LoggerOutputWriter('auto_old_checks');
            await handleOldChecksTask({ days, remove: true }, output);

            await AppSettings.set('auto_remove_old_checks', {
                ...value,
                days,
                lastRunAt: new Date(now).toISOString(),
            });
            log.info('[auto_old_checks] cleanup completed');
        } catch (error) {
            log.error(`[auto_old_checks] scheduler error: ${errMsg(error)}`);
        } finally {
            this.running = false;
        }
    }
}

export const autoOldChecksScheduler = new AutoOldChecksScheduler();
