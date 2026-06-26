/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'path';
import { promises as fsp } from 'fs';
import { PNG } from 'pngjs';
import { Check, App, Snapshot } from '@models';
import { config } from '@config';
import log from '@logger';
import { changeVectorFromRaw, cosineDistance, SIG_VERSION } from './descriptor';

const scope = 'changeSig';
// Default cosine cutoff for "same change" (high-precision operating point from the PoC).
export const DEFAULT_GATE = 0.32;

type Sig = { vector: number[]; version: string; at: Date; failed?: boolean };

// Snapshot files are stored at defaultImagesPath/<snapshot.filename>. The filename is NOT always
// "<id>.png" (snapshots are de-duplicated by image hash, so a baseline can reuse another
// snapshot's file), so resolve the real filename via the Snapshot document.
async function readRaw(snapshotId: unknown) {
    const snap: any = await Snapshot.findById(snapshotId as any).select('filename').exec();
    if (!snap || !snap.filename) throw new Error(`snapshot not found or has no file: ${snapshotId}`);
    const buf = await fsp.readFile(path.join(config.defaultImagesPath, snap.filename));
    const png = PNG.sync.read(buf); // RGBA
    return { data: png.data as Uint8Array, width: png.width, height: png.height, channels: 4 };
}

// Compute and persist the change descriptor for one check. Never throws (records failed:true).
export async function computeCheckSig(check: any): Promise<Sig> {
    let sig: Sig;
    try {
        if (!check.diffId || !check.actualSnapshotId || !check.baselineId) {
            throw new Error('missing baseline/actual/diff snapshot');
        }
        const [diff, base, act] = await Promise.all([
            readRaw(check.diffId), readRaw(check.baselineId), readRaw(check.actualSnapshotId),
        ]);
        sig = { vector: changeVectorFromRaw(diff, base, act), version: SIG_VERSION, at: new Date(), failed: false };
    } catch (e) {
        log.warn(`changeSig failed for ${check._id}: ${e}`, { scope });
        sig = { vector: [], version: SIG_VERSION, at: new Date(), failed: true };
    }
    await Check.findByIdAndUpdate(check._id, { $set: { changeSig: sig } }).exec();
    return sig;
}

async function ensureSig(check: any): Promise<Sig> {
    if (check.changeSig && check.changeSig.version === SIG_VERSION) return check.changeSig;
    return computeCheckSig(check);
}

// Background worker / backfill: failed-with-diff checks missing a current descriptor.
export async function findChecksNeedingSig(limit: number): Promise<string[]> {
    const checks = await Check.find({
        status: 'failed',
        diffId: { $exists: true, $ne: null },
        $or: [{ changeSig: { $exists: false } }, { 'changeSig.version': { $ne: SIG_VERSION } }],
    }).select('_id').limit(limit).exec();
    return checks.map((c: any) => String(c._id));
}

export async function computeForId(checkId: string): Promise<Sig> {
    const check: any = await Check.findById(checkId).exec();
    if (!check) throw new Error(`check not found: ${checkId}`);
    return computeCheckSig(check);
}

// One-time backfill over all failed checks lacking a current descriptor.
export async function backfillAll(batch = 200): Promise<number> {
    let total = 0;
    for (;;) {
        const ids = await findChecksNeedingSig(batch);
        if (!ids.length) break;
        for (const id of ids) await computeForId(id);
        total += ids.length;
        log.info(`changeSig backfill: ${total}`, { scope });
    }
    return total;
}

export type SiblingResult = {
    checkId: string; viewport: string; distance: number; confidence: number;
    name?: string; diffFilename?: string;
};

// "The same change at other resolutions": rank other failed checks in the SAME run by descriptor
// distance, return the best match per other viewport, gated by the project's confidence cutoff.
export async function findSiblings(checkId: string): Promise<{ results: SiblingResult[]; gate: number }> {
    const query: any = await Check.findById(checkId).exec();
    if (!query) throw new Error(`check not found: ${checkId}`);
    const app: any = query.app ? await App.findById(query.app).exec() : null;
    const gate = typeof app?.changeSimGate === 'number' ? app.changeSimGate : DEFAULT_GATE;

    const qsig = await ensureSig(query);
    if (qsig.failed || !qsig.vector.length) return { results: [], gate };

    const candidates: any[] = await Check.find({
        run: query.run,
        status: 'failed',
        _id: { $ne: query._id },
        diffId: { $exists: true, $ne: null },
    }).exec();

    const scored: { check: any; dist: number }[] = [];
    for (const c of candidates) {
        const sig = await ensureSig(c);
        if (sig.failed || !sig.vector.length) continue;
        scored.push({ check: c, dist: cosineDistance(qsig.vector, sig.vector) });
    }
    scored.sort((a, b) => a.dist - b.dist);

    const seenViewports = new Set<string>([query.viewport || '']);
    const results: SiblingResult[] = [];
    for (const s of scored) {
        if (s.dist > gate) continue; // gate: above cutoff = almost certainly a different change
        const vp = s.check.viewport || '';
        if (seenViewports.has(vp)) continue; // best match per other viewport
        seenViewports.add(vp);
        // enrich for the UI: check name + the diff snapshot filename (for a thumbnail)
        let diffFilename: string | undefined;
        try {
            const ds: any = s.check.diffId ? await Snapshot.findById(s.check.diffId).select('filename').exec() : null;
            diffFilename = ds?.filename;
        } catch { /* thumbnail is best-effort */ }
        results.push({
            checkId: String(s.check._id),
            viewport: vp,
            distance: Number(s.dist.toFixed(4)),
            confidence: Number(Math.max(0, 1 - s.dist / gate).toFixed(3)),
            name: s.check.name,
            diffFilename,
        });
    }
    return { results, gate };
}
