/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import path from 'path';
import { Check } from '@models';
import { config } from '@config';
import { domSnapshotService } from '@services/dom-snapshot.service';
import log from '@lib/logger';
import { TriageInput } from './types';

function getBase64(filename?: string): string | null {
    if (!filename) return null;
    try {
        const filePath = path.join(config.defaultImagesPath, filename);
        if (fs.existsSync(filePath)) {
            return fs.readFileSync(filePath, { encoding: 'base64' });
        }
    } catch {
        return null;
    }
    return null;
}

// Builds the VLM payload for a check: base64 baseline/actual/diff + meta + optional DOM diff.
// Mirrors GET /ai/analysis/:id so the HTTP endpoint and the triage job share one source of truth.
export async function buildTriageInput(checkId: string): Promise<TriageInput | null> {
    const check: any = await Check.findById(checkId).populate('actualSnapshotId baselineId diffId');
    if (!check) return null;

    let domDiff: unknown;
    try {
        const actualDom = await domSnapshotService.getDomSnapshotByCheckId(checkId, 'actual');
        if (actualDom) domDiff = await domSnapshotService.getDomContentBySnapshot(actualDom);
    } catch (e) {
        log.warn(`triage: failed to load DOM diff for ${checkId}: ${e}`, { scope: 'triage.analysis' });
    }

    return {
        name: check.name,
        actualB64: check.actualSnapshotId ? getBase64(check.actualSnapshotId.filename) : null,
        baselineB64: check.baselineId ? getBase64(check.baselineId.filename) : null,
        diffB64: check.diffId ? getBase64(check.diffId.filename) : null,
        meta: check.meta,
        domDiff,
    };
}
