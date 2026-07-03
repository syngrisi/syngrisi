/* eslint-disable @typescript-eslint/no-explicit-any */
import { promises as fsp } from 'fs';
import path from 'path';
import { Baseline } from '@models';
import { config } from '@config';
import { appSettings } from '@settings';
import log from '@logger';
import { ApiError, HttpStatus } from '@utils';
import { LogOpts } from '@types';
import { createProvider } from './triage/factory';
import { getProviderConfig } from './triage/config';
import { TriageProviderConfig, VerdictDef } from './triage/types';

export interface BaselineHistoryIdent {
    name: string;
    app: string;
    branch: string;
    browserName: string;
    viewport: string;
    os: string;
}

export interface BaselineHistoryItem {
    id: string;
    createdDate?: Date;
    markedByUsername?: string;
    filename?: string;
    imageUrl?: string;
}

// "Time machine": the ordered timeline of accepted baselines for one check ident.
export async function getHistory(ident: BaselineHistoryIdent): Promise<BaselineHistoryItem[]> {
    const logOpts: LogOpts = { scope: 'baselineHistory', itemType: 'baseline', msgType: 'GET' };
    // `app` is a plain ObjectId string here (see BaselineHistoryIdentSchema), same as every other
    // ident-based Baseline query in this codebase (e.g. getAcceptedBaseline in baseline.service.ts)
    // - cast needed because the generated Mongoose filter type wants an ObjectId, not a string.
    const filter: any = { ...ident, markedAs: 'accepted' };
    log.debug(`Get baseline history with filter: '${JSON.stringify(filter)}'`, logOpts);

    const baselines: any[] = await Baseline.find(filter)
        .sort({ createdDate: 1 })
        .populate('snapshootId')
        .exec();

    return baselines.map((baseline) => {
        const snapshot = baseline.snapshootId;
        const filename = snapshot?.filename;
        return {
            id: baseline.id ?? baseline._id.toString(),
            createdDate: baseline.createdDate,
            markedByUsername: baseline.markedByUsername,
            filename,
            imageUrl: filename ? `/snapshoots/${filename}` : undefined,
        };
    });
}

async function getBase64(filename?: string): Promise<string | null> {
    if (!filename) return null;
    try {
        const filePath = path.join(config.defaultImagesPath, filename);
        return await fsp.readFile(filePath, { encoding: 'base64' });
    } catch {
        return null;
    }
}

// A provider is considered "configured" for the summary feature when the *stored setting itself*
// (not the env-overlaid runtime config `getProviderConfig()` returns) says so: the `fake` provider
// always counts (deterministic, test-only), other types need an explicit apiKey or baseUrl in the
// DB value. Reading the raw setting - rather than the merged config - keeps this check independent
// of host env vars (e.g. a stray OPENAI_API_KEY in the environment) that legitimately apply to real
// triage runs but shouldn't make "no provider configured" flaky for this feature's own settings-only
// on/off signal.
async function isProviderConfigured(): Promise<boolean> {
    const raw = await appSettings.get('ai_triage_provider');
    if (!raw || raw.enabled === false) return false;
    const value = raw.value;
    if (!value || typeof value !== 'object') return false;
    if (value.type === 'fake') return true;
    if (!value.type || value.type === 'openai') return Boolean(value.apiKey || value.baseUrl);
    return true; // anthropic/gemini explicitly selected
}

// Single placeholder verdict - the summary feature repurposes the triage `classify()` call to get
// a free-text `reason` describing the visual change; `verdict`/`confidence` are not used.
const SUMMARY_VERDICTS: VerdictDef[] = [
    { key: 'change_described', label: 'Change described', color: 'gray', severity: 1, autoAcceptable: false },
];

const SUMMARY_SYSTEM_PROMPT = `You are a visual-regression assistant. You are given two screenshots of the same page taken at different times: an OLDER baseline image and a NEWER baseline image.

Describe, in one short sentence, what visually changed between them (e.g. "header redesigned with a new logo", "pricing table gained a new tier"). If nothing meaningfully changed, say so briefly.

Return STRICT JSON only, no prose, with this exact shape:
{"verdict": "change_described", "confidence": 0, "reason": "<one short sentence describing what changed>"}`;

export interface HistorySummaryResult {
    summary: string | null;
    reason?: string;
    cached?: boolean;
}

// AI-generated description of the visual change between two accepted baselines (time machine).
// Cached on the newer baseline's `historySummary` field, keyed by the older baseline's id, so a
// given pair is only ever summarized once.
export async function getHistorySummary(fromBaselineId: string, toBaselineId: string): Promise<HistorySummaryResult> {
    const logOpts: LogOpts = { scope: 'baselineHistorySummary', itemType: 'baseline', msgType: 'GET' };

    const [fromBaseline, toBaseline]: any[] = await Promise.all([
        Baseline.findById(fromBaselineId).populate('snapshootId').exec(),
        Baseline.findById(toBaselineId).populate('snapshootId').exec(),
    ]);
    if (!fromBaseline) throw new ApiError(HttpStatus.NOT_FOUND, `cannot find baseline with id: '${fromBaselineId}'`);
    if (!toBaseline) throw new ApiError(HttpStatus.NOT_FOUND, `cannot find baseline with id: '${toBaselineId}'`);

    // The newer baseline (by createdDate) owns the cache slot, regardless of which id the caller
    // passed as "from"/"to".
    const fromTime = fromBaseline.createdDate ? new Date(fromBaseline.createdDate).getTime() : 0;
    const toTime = toBaseline.createdDate ? new Date(toBaseline.createdDate).getTime() : 0;
    const newer = toTime >= fromTime ? toBaseline : fromBaseline;
    const older = toTime >= fromTime ? fromBaseline : toBaseline;
    const olderId = older.id ?? older._id.toString();

    const cached = newer.historySummary;
    if (cached && cached.fromBaselineId === olderId) {
        return { summary: cached.text, cached: true };
    }

    if (!(await isProviderConfigured())) {
        return { summary: null, reason: 'no provider configured' };
    }
    const cfg = await getProviderConfig();
    if (!cfg) {
        return { summary: null, reason: 'no provider configured' };
    }

    const olderSnapshot: any = older.snapshootId;
    const newerSnapshot: any = newer.snapshootId;
    const [olderB64, newerB64] = await Promise.all([
        getBase64(olderSnapshot?.filename),
        getBase64(newerSnapshot?.filename),
    ]);

    let text: string;
    try {
        const result = await createProvider(cfg as TriageProviderConfig).classify({
            name: newer.name,
            baselineB64: olderB64,
            actualB64: newerB64,
            diffB64: null,
            verdicts: SUMMARY_VERDICTS,
            systemPrompt: SUMMARY_SYSTEM_PROMPT,
        });
        text = result.reason;
    } catch (e) {
        log.warn(`baseline history summary failed: ${e}`, logOpts);
        return { summary: null, reason: 'summary generation failed' };
    }

    newer.historySummary = { fromBaselineId: olderId, text };
    await newer.save();

    return { summary: text, cached: false };
}
