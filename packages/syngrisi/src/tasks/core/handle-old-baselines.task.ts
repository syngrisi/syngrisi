/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from 'mongoose';
import { Baseline, Check } from '@models';
import { remove as removeSnapshot } from '@services/snapshot.service';
import { IOutputWriter } from '../lib/output-writer';
import {
    RemovableBaseline,
    SelectableBaseline,
    effectiveKeepLast,
    selectOldBaselinesForRemoval,
} from './old-baselines-selection';

const DEFAULT_BATCH_SIZE = 500;

export interface HandleOldBaselinesOptions {
    days: number;
    keepLast: number;
    /** When true, actually delete; when false, stats only */
    remove?: boolean;
    batchSize?: number;
}

type Deps = {
    BaselineModel?: typeof Baseline;
    CheckModel?: typeof Check;
    removeSnapshotFn?: typeof removeSnapshot;
};

interface BaselineLean {
    _id: Types.ObjectId;
    snapshootId?: Types.ObjectId | null;
    createdDate?: Date;
    name?: string;
    app?: Types.ObjectId | string | null;
    branch?: string;
    browserName?: string;
    viewport?: string;
    os?: string;
}

function toSelectable(b: BaselineLean): SelectableBaseline {
    return {
        _id: b._id,
        snapshootId: b.snapshootId ?? null,
        createdDate: b.createdDate ?? null,
        name: b.name,
        app: b.app != null ? String(b.app) : null,
        branch: b.branch,
        browserName: b.browserName,
        viewport: b.viewport,
        os: b.os,
    };
}

async function isSnapshotStillReferenced(
    snapId: string,
    CheckModel: typeof Check,
    BaselineModel: typeof Baseline,
): Promise<boolean> {
    let objectId: Types.ObjectId;
    try {
        objectId = new Types.ObjectId(snapId);
    } catch {
        return true; // treat invalid as referenced — do not delete
    }

    // Cast filters: mongoose StrictQuery typing rejects ObjectId in some filter shapes.
    const baselineLeft = await BaselineModel.findOne({ snapshootId: objectId } as any)
        .select('_id')
        .lean()
        .exec();
    if (baselineLeft) {
        return true;
    }

    const checkLeft = await CheckModel.findOne({
        $or: [
            { baselineId: objectId },
            { actualSnapshotId: objectId },
            { diffId: objectId },
        ],
    } as any)
        .select('_id')
        .lean()
        .exec();
    return Boolean(checkLeft);
}

export async function handleOldBaselinesTask(
    options: HandleOldBaselinesOptions,
    output: IOutputWriter,
    deps: Deps = {},
): Promise<{ candidates: RemovableBaseline[]; removed: number }> {
    const BaselineModel = deps.BaselineModel || Baseline;
    const CheckModel = deps.CheckModel || Check;
    const removeSnapshotFn = deps.removeSnapshotFn || removeSnapshot;

    const days = Number.isFinite(options.days) ? options.days : 120;
    const keepLast = effectiveKeepLast(options.keepLast);
    const remove = options.remove === true;
    const batchSize = options.batchSize && options.batchSize > 0
        ? options.batchSize
        : DEFAULT_BATCH_SIZE;

    output.write('> Handle old baselines task started');
    output.write(`>> mode: ${remove ? 'REMOVE' : 'DRY RUN'}`);
    output.write(`>> days: ${days}, keepLast: ${keepLast} (newest per identity always kept)`);

    const totalAccepted = await BaselineModel.countDocuments({ markedAs: 'accepted' });
    output.write(`>> accepted baselines total: ${totalAccepted}`);

    const baselines = await BaselineModel.find(
        { markedAs: 'accepted' },
        {
            _id: 1,
            snapshootId: 1,
            createdDate: 1,
            name: 1,
            app: 1,
            branch: 1,
            browserName: 1,
            viewport: 1,
            os: 1,
        },
    ).lean().exec() as unknown as BaselineLean[];

    const candidates = selectOldBaselinesForRemoval(
        baselines.map(toSelectable),
        { days, keepLast },
    );
    output.write(`>> removable candidates (age AND outside keepLast): ${candidates.length}`);

    if (candidates.length > 0) {
        output.write('>> sample (first 10):');
        candidates.slice(0, 10).forEach((c) => {
            output.write(
                `   - id: ${c.id} rank: ${c.rank} created: ${c.createdDate?.toISOString() ?? 'n/a'} snap: ${c.snapshootId ?? 'n/a'}`,
            );
        });
        if (candidates.length > 10) {
            output.write(`   ... and ${candidates.length - 10} more`);
        }
    }

    if (!remove || candidates.length === 0) {
        output.write(remove ? '>> nothing to remove' : '>> dry run mode, nothing was removed');
        output.end();
        return { candidates, removed: 0 };
    }

    output.write('>> removing old baselines');
    const ids = candidates.map((c) => new Types.ObjectId(c.id));
    let removed = 0;
    for (let i = 0; i < ids.length; i += batchSize) {
        const batch = ids.slice(i, i + batchSize);
        const result = await BaselineModel.deleteMany({ _id: { $in: batch } });
        removed += result.deletedCount ?? batch.length;
        output.write(
            `   removed baseline batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(ids.length / batchSize)}`,
        );
    }

    // Free snapshots/files that are no longer referenced by any Baseline or Check
    const snapIds = Array.from(
        new Set(candidates.map((c) => c.snapshootId).filter((id): id is string => Boolean(id))),
    );
    output.write(`>> evaluating ${snapIds.length} unique snapshot ids for cleanup`);
    let snapshotsRemoved = 0;
    for (const snapId of snapIds) {
        const stillReferenced = await isSnapshotStillReferenced(snapId, CheckModel, BaselineModel);
        if (stillReferenced) {
            continue;
        }
        await removeSnapshotFn(snapId);
        snapshotsRemoved += 1;
    }
    output.write(`>> snapshots removed (unreferenced): ${snapshotsRemoved}`);
    output.write(`>> baselines removed: ${removed}`);
    output.end();
    return { candidates, removed };
}
