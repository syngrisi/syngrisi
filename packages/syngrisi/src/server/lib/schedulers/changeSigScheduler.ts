import log from '@logger';
import { env } from '@/server/envConfig';
import { errMsg } from '@/server/utils';
import { findChecksNeedingSig, computeForId } from '@services/changeSig';

const scope = 'change_sig_scheduler';

// Background poller: when change-similarity is enabled, compute the color_hist descriptor for
// failed-with-diff checks that don't have a current one. Gated by env flag (off by default).
export class ChangeSigScheduler {
    private timer: NodeJS.Timeout | null = null;
    private running = false;

    start(): void {
        if (this.timer || !env.SYNGRISI_CHANGE_SIM) return;
        const intervalMs = env.SYNGRISI_CHANGE_SIM_POLL_INTERVAL_MS;
        this.timer = setInterval(() => { void this.tick(); }, intervalMs);
        void this.tick();
        log.info(`change-sig scheduler started (poll every ${intervalMs}ms)`, { scope });
    }

    stop(): void {
        if (this.timer) { clearInterval(this.timer); this.timer = null; log.info('change-sig scheduler stopped', { scope }); }
    }

    private async tick(): Promise<void> {
        if (this.running) return;
        this.running = true;
        try {
            const ids = await findChecksNeedingSig(env.SYNGRISI_CHANGE_SIM_BATCH_SIZE);
            if (!ids.length) return;
            log.info(`computing change-sig for ${ids.length} check(s)`, { scope });
            for (const id of ids) await computeForId(id);
        } catch (error) {
            log.error(`change-sig scheduler error: ${errMsg(error)}`, { scope });
        } finally {
            this.running = false;
        }
    }
}

export const changeSigScheduler = new ChangeSigScheduler();
