import log from '@logger';
import { appSettings } from '@settings';
import { env } from '@/server/envConfig';
import { errMsg } from '@/server/utils';

type AutoCleanupValue = {
    days?: number;
    lastRunAt?: string | null;
};

interface SchedulerOptions {
    settingName: string;
    defaultDays: number;
    scope: string;
    runTask: (days: number) => Promise<void>;
}

export class AutoCleanupScheduler {
    private timer: NodeJS.Timeout | null = null;
    private running = false;

    constructor(private options: SchedulerOptions) {}

    start(): void {
        if (this.timer) {
            return;
        }
        const intervalMs = env.SYNGRISI_AUTO_REMOVE_CHECKS_POLL_INTERVAL_MS;
        this.timer = setInterval(() => {
            void this.tick();
        }, intervalMs);
        void this.tick();
        log.info(`[${this.options.scope}] scheduler started (poll every ${intervalMs}ms)`);
    }

    stop(): void {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
            log.info(`[${this.options.scope}] scheduler stopped`);
        }
    }

    private async tick(): Promise<void> {
        if (this.running) {
            return;
        }
        this.running = true;

        try {
            const AppSettings = await appSettings;
            const setting = await AppSettings.get(this.options.settingName);
            if (!setting || !setting.enabled) {
                return;
            }

            const value: AutoCleanupValue = setting.value ?? {};
            const days = typeof value.days === 'number' && value.days >= 0
                ? value.days
                : this.options.defaultDays;
            const lastRunAt = value.lastRunAt ? new Date(value.lastRunAt) : null;
            const now = Date.now();
            const minInterval = env.SYNGRISI_AUTO_REMOVE_CHECKS_MIN_INTERVAL_MS;
            const shouldRun = !lastRunAt || (now - lastRunAt.getTime()) >= minInterval;

            if (!shouldRun) {
                return;
            }

            log.info(`[${this.options.scope}] triggering cleanup for items older than ${days} days`);
            await this.options.runTask(days);
            await AppSettings.set(this.options.settingName, {
                ...value,
                days,
                lastRunAt: new Date(now).toISOString(),
            });
            log.info(`[${this.options.scope}] cleanup completed`);
        } catch (error) {
            log.error(`[${this.options.scope}] scheduler error: ${errMsg(error)}`);
        } finally {
            this.running = false;
        }
    }
}
