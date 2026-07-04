import { Test } from '@models';
import { RunDocument } from '@models/Run.model';
import { env } from '@env';
import log from '@logger';
import { errMsg } from '@utils';

type GithubState = 'pending' | 'success' | 'failure';

const isConfigured = () => Boolean(env.SYNGRISI_GITHUB_TOKEN && env.SYNGRISI_GITHUB_REPO);

/**
 * Deep link to the run's grid in the index2 UI app, e.g.
 * '<publicUrl>/?app=<appId>&base_filter={"run":{"$in":["<runId>"]}}'
 */
const buildTargetUrl = (run: RunDocument) => {
    if (!env.SYNGRISI_PUBLIC_URL) {
        return undefined;
    }
    const baseFilter = JSON.stringify({ run: { $in: [String(run._id)] } });
    return `${env.SYNGRISI_PUBLIC_URL}/?app=${run.app}&base_filter=${encodeURIComponent(baseFilter)}`;
};

/**
 * Aggregates the run's tests into a single GitHub commit-status state + description.
 */
const aggregateRunState = (statuses: (string | undefined)[]): { state: GithubState; description: string } => {
    const passed = statuses.filter((s) => s === 'Passed').length;
    const failed = statuses.filter((s) => s === 'Failed').length;
    const newCount = statuses.filter((s) => s === 'New').length;
    const running = statuses.filter((s) => s === 'Running').length;

    let state: GithubState = 'success';
    if (failed > 0) {
        state = 'failure';
    } else if (running > 0) {
        state = 'pending';
    }

    const description = `${passed} passed, ${failed} failed, ${newCount} new`.slice(0, 140);
    return { state, description };
};

/**
 * Reports a run's aggregated status as a GitHub commit status.
 * No-op (zero requests) unless SYNGRISI_GITHUB_TOKEN, SYNGRISI_GITHUB_REPO and the run's commit are all set.
 * Errors are logged, never thrown - mirrors webhook.service's error posture.
 */
const notifyRunStatus = async (run: RunDocument): Promise<void> => {
    if (!isConfigured() || !run.commit) {
        return;
    }

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tests = await Test.find({ run: run._id } as any).lean().exec();
        const { state, description } = aggregateRunState(tests.map((t) => t.status));

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const url = `${env.SYNGRISI_GITHUB_API_URL}/repos/${env.SYNGRISI_GITHUB_REPO}/statuses/${run.commit}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${env.SYNGRISI_GITHUB_TOKEN}`,
                },
                body: JSON.stringify({
                    state,
                    context: 'syngrisi/visual',
                    description,
                    target_url: buildTargetUrl(run),
                }),
                signal: controller.signal,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } finally {
            clearTimeout(timeoutId);
        }
    } catch (error) {
        log.error(`Failed to report GitHub commit status for run '${run._id}': ${errMsg(error)}`);
    }
};

export const githubStatusService = {
    notifyRunStatus,
};
