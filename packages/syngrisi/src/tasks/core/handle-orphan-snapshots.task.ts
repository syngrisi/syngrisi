/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from 'mongoose';
import { Baseline, Check, Snapshot } from '@models';
import { remove as removeSnapshot } from '@services/snapshot.service';
import { IOutputWriter } from '../lib/output-writer';

const DEFAULT_BATCH_SIZE = 500;

export interface HandleOrphanSnapshotsOptions {
    dryRun?: boolean;
    batchSize?: number;
}

type Deps = {
    BaselineModel?: typeof Baseline;
    CheckModel?: typeof Check;
    SnapshotModel?: typeof Snapshot;
    removeSnapshotFn?: typeof removeSnapshot;
};

const normalizeId = (id: unknown): string | null => {
    if (id == null) return null;
    try {
        return String(id);
    } catch {
        return null;
    }
};

async function collectReferencedSnapshotIds(
    BaselineModel: typeof Baseline,
    CheckModel: typeof Check,
    output: IOutputWriter,
): Promise<Set<string>> {
    const referenced = new Set<string>();

    const addGrouped = (docs: { _id: unknown }[]) => {
        for (const doc of docs) {
            const id = normalizeId(doc._id);
            if (id) referenced.add(id);
        }
    };

    output.write('> collect snapshot ids referenced by Baselines');
    const fromBaselines = await BaselineModel.aggregate([
        { $match: { snapshootId: { $ne: null } } },
        { $group: { _id: '$snapshootId' } },
    ]).exec();
    addGrouped(fromBaselines);
    output.write(`>> baseline-referenced: ${fromBaselines.length}`);

    const checkFields: Array<'baselineId' | 'actualSnapshotId' | 'diffId'> = [
        'baselineId',
        'actualSnapshotId',
        'diffId',
    ];
    for (const field of checkFields) {
        output.write(`> collect snapshot ids referenced by Check.${field}`);
        const docs = await CheckModel.aggregate([
            { $match: { [field]: { $ne: null } } },
            { $group: { _id: `$${field}` } },
        ]).exec();
        addGrouped(docs);
        output.write(`>> Check.${field}-referenced unique: ${docs.length}`);
    }

    output.write(`>> total unique referenced snapshot ids: ${referenced.size}`);
    return referenced;
}

/**
 * Find Snapshot documents that are not referenced by any Baseline or Check,
 * and optionally delete them (and their PNG files when last reference).
 *
 * Use after old-baselines retention when baseline rows were removed but
 * snapshot/file cleanup did not finish.
 */
export async function handleOrphanSnapshotsTask(
    options: HandleOrphanSnapshotsOptions,
    output: IOutputWriter,
    deps: Deps = {},
): Promise<{ orphanCount: number; removed: number }> {
    const BaselineModel = deps.BaselineModel || Baseline;
    const CheckModel = deps.CheckModel || Check;
    const SnapshotModel = deps.SnapshotModel || Snapshot;
    const removeSnapshotFn = deps.removeSnapshotFn || removeSnapshot;

    const dryRun = options.dryRun !== false;
    const batchSize = options.batchSize && options.batchSize > 0
        ? options.batchSize
        : DEFAULT_BATCH_SIZE;

    output.write('> Handle orphan snapshots task started');
    output.write(`>> mode: ${dryRun ? 'DRY RUN' : 'EXECUTE'}`);

    const totalSnapshots = await SnapshotModel.countDocuments();
    output.write(`>> total snapshots: ${totalSnapshots}`);

    const referenced = await collectReferencedSnapshotIds(
        BaselineModel,
        CheckModel,
        output,
    );

    output.write('> scan Snapshots for orphans (not referenced by Baseline or Check)');
    const orphanIds: string[] = [];
    const cursor = SnapshotModel.find({}, { _id: 1 }).lean().cursor();
    let scanned = 0;
    for await (const doc of cursor as AsyncIterable<{ _id: Types.ObjectId }>) {
        scanned += 1;
        const id = doc._id.toString();
        if (!referenced.has(id)) {
            orphanIds.push(id);
        }
        if (scanned % 50000 === 0) {
            output.write(`>> scanned ${scanned}/${totalSnapshots} snapshots...`);
        }
    }
    output.write(`>> scanned: ${scanned}, orphan snapshots: ${orphanIds.length}`);

    if (orphanIds.length > 0) {
        output.write('>> sample (first 10):');
        orphanIds.slice(0, 10).forEach((id) => {
            output.write(`   - ${id}`);
        });
        if (orphanIds.length > 10) {
            output.write(`   ... and ${orphanIds.length - 10} more`);
        }
    }

    if (dryRun || orphanIds.length === 0) {
        output.write(
            dryRun
                ? '>> dry run mode, nothing was removed'
                : '>> nothing to remove',
        );
        output.end();
        return { orphanCount: orphanIds.length, removed: 0 };
    }

    output.write(`>> removing ${orphanIds.length} orphan snapshots`);
    let removed = 0;
    for (let i = 0; i < orphanIds.length; i += batchSize) {
        const batch = orphanIds.slice(i, i + batchSize);
        for (const id of batch) {
            await removeSnapshotFn(id);
            removed += 1;
        }
        output.write(
            `   removed snapshot batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(orphanIds.length / batchSize)} (${removed}/${orphanIds.length})`,
        );
    }

    const remaining = await SnapshotModel.countDocuments();
    output.write(`>> snapshots removed: ${removed}`);
    output.write(`>> remaining snapshots: ${remaining}`);
    output.end();
    return { orphanCount: orphanIds.length, removed };
}
