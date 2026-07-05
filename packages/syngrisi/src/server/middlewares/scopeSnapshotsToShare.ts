import { Request, Response, NextFunction } from 'express';
import path from 'path';
import { Check, Snapshot } from '@models';
import { getHistory, BaselineHistoryIdent } from '@services/baseline-history.service';
import { sharedCheckId } from '@services/share.service';
import log from '@logger';

const logOpts = { scope: 'scopeSnapshotsToShare', msgType: 'SECURITY' };

// Restricts the /snapshoots static directory to only the filenames that belong to
// the share token's shared check. Authenticated (non-share) requests are unaffected;
// only requests authenticated via a share token are scoped here, so a token for
// check A cannot be used to read check B's (or anyone else's) screenshots.
export const scopeSnapshotsToShare = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const checkId = sharedCheckId(req);
    if (checkId === null) {
        next();
        return;
    }

    const check = await Check.findById(checkId).exec();
    if (!check) {
        res.status(404).end();
        return;
    }

    const snapshotIds = [check.baselineId, check.actualSnapshotId, check.diffId].filter(
        (snapshotId): snapshotId is NonNullable<typeof snapshotId> => Boolean(snapshotId)
    );
    const snapshots = await Promise.all(
        snapshotIds.map((snapshotId) => Snapshot.findById(snapshotId).exec())
    );
    const allowed = new Set<string>(
        snapshots
            .map((snapshot) => snapshot?.filename)
            .filter((filename): filename is string => Boolean(filename))
    );

    if (check.branch && check.browserName && check.viewport && check.os) {
        const ident: BaselineHistoryIdent = {
            name: check.name,
            app: String(check.app),
            branch: check.branch,
            browserName: check.browserName,
            viewport: check.viewport,
            os: check.os,
        };
        const history = await getHistory(ident);
        history.forEach((item) => {
            if (item.filename) allowed.add(item.filename);
        });
    }

    const requested = path.basename(decodeURIComponent(req.path));
    if (allowed.has(requested)) {
        next();
        return;
    }

    log.debug(`Blocked share-mode access to snapshot file: '${requested}' for check: '${checkId}'`, logOpts);
    res.status(404).end();
};
