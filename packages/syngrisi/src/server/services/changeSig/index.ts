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

export type SimilarResult = {
    checkId: string; viewport: string; distance: number;
    score: number; // 0..1 similarity (1 = identical change); = max(0, 1 - distance)
    name?: string;
};

// "Find similar checks": rank ALL other failed checks in the SAME run by descriptor distance and
// return the full list (best first) with a 0..1 similarity score. Similarity is NOT limited to
// other resolutions — same-viewport/other-browser candidates are included; only the query check
// itself is excluded. The per-project gate is an optional cutoff (drops clearly-unrelated changes).
export async function findSimilar(checkId: string): Promise<{ results: SimilarResult[]; gate: number }> {
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
        const dist = cosineDistance(qsig.vector, sig.vector);
        if (dist > gate) continue; // optional cutoff: above it = almost certainly a different change
        scored.push({ check: c, dist });
    }
    scored.sort((a, b) => a.dist - b.dist); // best (smallest distance) first

    const results: SimilarResult[] = scored.map((s) => ({
        checkId: String(s.check._id),
        viewport: s.check.viewport || '',
        distance: Number(s.dist.toFixed(4)),
        score: Number(Math.max(0, 1 - s.dist).toFixed(3)),
        name: s.check.name,
    }));
    return { results, gate };
}
