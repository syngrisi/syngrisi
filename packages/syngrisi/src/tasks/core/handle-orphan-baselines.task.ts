import { Baseline, Check } from '@models';
import { Types } from 'mongoose';
import { IOutputWriter } from '@/tasks/lib/output-writer';

type Deps = {
    BaselineModel?: typeof Baseline
    CheckModel?: typeof Check
};

export interface HandleOrphanBaselinesOptions {
    dryRun?: boolean
    batchSize?: number
}

interface BaselineLean {
    _id: Types.ObjectId
    name?: string
    snapshootId?: Types.ObjectId
}

const DEFAULT_BATCH_SIZE = 500;

export const handleOrphanBaselinesTask = async (
    { dryRun = true, batchSize = DEFAULT_BATCH_SIZE }: HandleOrphanBaselinesOptions,
    output: IOutputWriter,
    deps: Deps = {},
) => {
    const BaselineModel = deps.BaselineModel || Baseline;
    const CheckModel = deps.CheckModel || Check;

    output.write('> Handle orphan baselines task started');
    output.write(`>> mode: ${dryRun ? 'DRY RUN' : 'EXECUTE'}`);

    const totalBaselines = await BaselineModel.countDocuments();
    output.write(`>> total baselines: ${totalBaselines}`);

    const baselines = await BaselineModel.find({}, { snapshootId: 1, name: 1 }).lean<BaselineLean>().exec();
    const snapshotIds = baselines
        .map((b) => b.snapshootId)
        .filter((id): id is Types.ObjectId => Boolean(id));

    if (!snapshotIds.length) {
        output.write('>> no baselines with snapshootId found');
        output.end();
        return;
    }

    const usedSnapshotIds = new Set(
        (await CheckModel.distinct('baselineId', { baselineId: { $in: snapshotIds } })).map(
            (id) => id?.toString(),
        ),
    );

    const orphanBaselines = baselines.filter((baseline) => {
        if (!baseline.snapshootId) return false;
        return !usedSnapshotIds.has(baseline.snapshootId.toString());
    });

    output.write(`>> orphan baselines found: ${orphanBaselines.length}`);
    if (orphanBaselines.length > 0) {
        output.write('>> sample (first 10):');
        orphanBaselines.slice(0, 10).forEach((b) => {
            output.write(`   - id: ${b._id.toString()} name: ${b.name || '<no name>'}`);
        });
        if (orphanBaselines.length > 10) {
            output.write(`   ... and ${orphanBaselines.length - 10} more`);
        }
    }

    if (dryRun || orphanBaselines.length === 0) {
        output.write('>> dry run mode, nothing was removed');
        output.end();
        return;
    }

    output.write('>> removing orphan baselines');
    for (let i = 0; i < orphanBaselines.length; i += batchSize) {
        const batch = orphanBaselines.slice(i, i + batchSize).map((b) => b._id);
        await BaselineModel.deleteMany({ _id: { $in: batch } });
        output.write(`   removed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(orphanBaselines.length / batchSize)}`);
    }

    const remaining = await BaselineModel.countDocuments();
    output.write(`>> done. remaining baselines: ${remaining}`);
    output.end();
};
