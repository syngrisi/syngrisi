import log from '@logger';
import { env } from '@/server/envConfig';
import { errMsg } from '@/server/utils';
import { isTriageEnabled } from '@services/triage/config';
import { findUntriagedCheckIds, triageCheck } from '@services/triage';

const scope = 'triage_scheduler';

// Background poller: when AI Triage is enabled, classify failed-with-diff checks that have no verdict yet.
// Self-gating (checks isTriageEnabled each tick), so it is safe to always start.
export class TriageScheduler {
    private timer: NodeJS.Timeout | null = null;
    private running = false;

    start(): void {
        if (this.timer) return;
        const intervalMs = env.SYNGRISI_AI_TRIAGE_POLL_INTERVAL_MS;
        this.timer = setInterval(() => { void this.tick(); }, intervalMs);
        void this.tick();
        log.info(`triage scheduler started (poll every ${intervalMs}ms)`, { scope });
    }

    stop(): void {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
            log.info('triage scheduler stopped', { scope });
        }
    }

    // Trigger a tick immediately (e.g. right after a failed check is created) instead of waiting
    // for the next poll. The `running` guard prevents overlap, so calling it on a burst is safe.
    kick(): void {
        void this.tick();
    }

    private async tick(): Promise<void> {
        if (this.running) return;
        this.running = true;
        try {
            if (!(await isTriageEnabled())) return;
            const ids = await findUntriagedCheckIds(env.SYNGRISI_AI_TRIAGE_BATCH_SIZE);
            if (!ids.length) return;
            log.info(`triaging ${ids.length} check(s)`, { scope });
            for (const id of ids) {
                // sequential to avoid hammering the provider; batch size bounds the work per tick
                await triageCheck(id);
            }
        } catch (error) {
            log.error(`triage scheduler error: ${errMsg(error)}`, { scope });
        } finally {
            this.running = false;
        }
    }
}

export const triageScheduler = new TriageScheduler();
