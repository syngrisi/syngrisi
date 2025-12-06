import Baseline from '../models/Baseline.model';
import log from '../lib/logger';
import type { Migration } from '../lib/migrations/types';

const identFields = ['name', 'app', 'branch', 'browserName', 'viewport', 'os', 'snapshootId'] as const;

const pickIdent = (doc: Record<string, unknown>) => {
    const picked: Record<string, unknown> = {};
    identFields.forEach((field) => { picked[field] = doc[field]; });
    return picked;
};

async function deduplicateBaselines(): Promise<void> {
    await Baseline.init();
    const duplicates = await Baseline.aggregate<Record<string, unknown>>([
        {
            $group: {
                _id: pickIdent({
                    name: '$name',
                    app: '$app',
                    branch: '$branch',
                    browserName: '$browserName',
                    viewport: '$viewport',
                    os: '$os',
                    snapshootId: '$snapshootId',
                }),
                ids: { $push: '$_id' },
                lastMarkedDates: { $push: '$lastMarkedDate' },
                createdDates: { $push: '$createdDate' },
                count: { $sum: 1 },
            },
        },
        { $match: { count: { $gt: 1 } } },
    ]);

    for (const group of duplicates) {
        const ids = (group.ids as Array<{ toString: () => string }>).map((id) => id.toString());
        const keep = await Baseline.findOne({
            _id: { $in: ids },
        }).sort({ lastMarkedDate: -1, createdDate: -1, _id: -1 }).select('_id').lean();

        if (!keep) continue;
        const keepId = keep._id?.toString();
        const toRemove = ids.filter((id) => id !== keepId);
        if (toRemove.length > 0) {
            log.warn(`deduplicating baselines ${JSON.stringify(group._id)}, removing ${toRemove.length} duplicates`, { scope: 'migration' });
            await Baseline.deleteMany({ _id: { $in: toRemove } });
        }
    }
}

export const ensureBaselineUniqueness: Migration = {
    name: '2025-11-ensure-baseline-uniqueness',
    up: async () => {
        await deduplicateBaselines();
        await Baseline.collection.createIndex(
            {
                name: 1,
                app: 1,
                branch: 1,
                browserName: 1,
                viewport: 1,
                os: 1,
                snapshootId: 1,
            },
            { unique: true, name: 'baseline_ident_snapshot_idx' }
        );
    },
};
