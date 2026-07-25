/**
 * Pure selection logic for old-baselines retention.
 *
 * A baseline is removable only when BOTH are true (AND):
 * - createdDate is older than `days`
 * - its rank among the identity (newest-first) is >= effectiveKeepLast
 *
 * Hard guard: the newest baseline per identity (index 0) is NEVER removable,
 * even if keepLast is 0 or negative (clamped to >= 1).
 */

export type BaselineIdentityKey = {
    name?: string | null;
    app?: string | null;
    branch?: string | null;
    browserName?: string | null;
    viewport?: string | null;
    os?: string | null;
};

export type SelectableBaseline = BaselineIdentityKey & {
    _id: { toString(): string } | string;
    createdDate?: Date | string | null;
    snapshootId?: { toString(): string } | string | null;
};

export type OldBaselinesSelectionOptions = {
    days: number;
    keepLast: number;
    /** Reference "now"; defaults to Date.now() */
    now?: Date;
};

export type RemovableBaseline = {
    id: string;
    snapshootId: string | null;
    createdDate: Date | null;
    identityKey: string;
    rank: number;
};

export function buildBaselineIdentityKey(b: BaselineIdentityKey): string {
    return [
        b.name ?? '',
        b.app != null ? String(b.app) : '',
        b.branch ?? '',
        b.browserName ?? '',
        b.viewport ?? '',
        b.os ?? '',
    ].join('\x1f');
}

export function effectiveKeepLast(keepLast: number): number {
    if (!Number.isFinite(keepLast)) {
        return 1;
    }
    return Math.max(1, Math.floor(keepLast));
}

function toDate(value: Date | string | null | undefined): Date | null {
    if (!value) return null;
    const d = value instanceof Date ? value : new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Group accepted baselines by identity, sort newest-first, and return candidates
 * that match the age+rank AND rule. Latest per identity is never included.
 */
export function selectOldBaselinesForRemoval(
    baselines: SelectableBaseline[],
    options: OldBaselinesSelectionOptions,
): RemovableBaseline[] {
    const keepLast = effectiveKeepLast(options.keepLast);
    const now = options.now ?? new Date();
    const thresholdMs = now.getTime() - Math.max(0, options.days) * 24 * 60 * 60 * 1000;

    const byIdentity = new Map<string, SelectableBaseline[]>();
    for (const b of baselines) {
        const key = buildBaselineIdentityKey(b);
        const list = byIdentity.get(key);
        if (list) {
            list.push(b);
        } else {
            byIdentity.set(key, [b]);
        }
    }

    const removable: RemovableBaseline[] = [];

    for (const [identityKey, group] of byIdentity) {
        group.sort((a, b) => {
            const da = toDate(a.createdDate)?.getTime() ?? 0;
            const db = toDate(b.createdDate)?.getTime() ?? 0;
            return db - da; // newest first
        });

        for (let rank = 0; rank < group.length; rank += 1) {
            // Hard guard: newest is never deleted
            if (rank === 0) {
                continue;
            }
            if (rank < keepLast) {
                continue;
            }
            const item = group[rank];
            const created = toDate(item.createdDate);
            if (!created || created.getTime() >= thresholdMs) {
                continue;
            }
            removable.push({
                id: String(item._id),
                snapshootId: item.snapshootId != null ? String(item.snapshootId) : null,
                createdDate: created,
                identityKey,
                rank,
            });
        }
    }

    return removable;
}
