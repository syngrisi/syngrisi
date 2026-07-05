import { promises as fsp } from 'fs';
import { config } from '@config';
import { Baseline, Snapshot } from '@models';
import log from "../lib/logger";
import { SnapshotDocument } from '@models/Snapshot';
import path from 'path';
import { LogOpts } from '@types';

const logOpts = {
    scope: 'snapshot_helper',
    msgType: 'API',
};

export interface RemoveSnapshotFileDeps {
    SnapshotModel?: typeof Snapshot;
    unlink?: typeof fsp.unlink;
}

export const removeSnapshotFile = async (
    snapshot: SnapshotDocument,
    deps: RemoveSnapshotFileDeps = {},
) => {
    const SnapshotModel = deps.SnapshotModel ?? Snapshot;
    const unlink = deps.unlink ?? fsp.unlink;

    let relatedSnapshots: SnapshotDocument[] = [];
    if (snapshot.filename) {
        // Exclude the snapshot being removed; it is still in the DB at this
        // point. length === 0 => this was the LAST reference to the file.
        relatedSnapshots = await SnapshotModel.find({
            filename: snapshot.filename,
            _id: { $ne: snapshot._id },
        });
        log.debug(`there are '${relatedSnapshots.length}' other snapshots with filename: '${snapshot.filename}'`, logOpts);
    }

    const isLastSnapshotFile = () => {
        if (!snapshot.filename) {
            return true;
        }
        return (relatedSnapshots.length === 0);
    };

    log.debug({ isLastSnapshotFile: isLastSnapshotFile() });

    if (isLastSnapshotFile()) {
        const imagePath = path.join(config.defaultImagesPath, snapshot.filename);
        log.debug(`removing file: '${imagePath}'`, logOpts, {
            msgType: 'REMOVE',
            itemType: 'file',
        });
        await unlink(imagePath).catch((e) => {
            if (e.code !== 'ENOENT') throw e;
        });
    }
};

const remove = async (id: string) => {
    const logOpts: LogOpts = {
        scope: 'removeSnapshot',
        msgType: 'REMOVE',
        itemType: 'snapshot',
        ref: id,
    };

    if (!id) {
        return;
    }

    const baseline = await Baseline.findOne({ snapshootId: id });
    if (baseline) {
        log.debug(`snapshot: '${id}' is related to a baseline, skipping deletion`, logOpts);
        return;
    }

    const snapshot = await Snapshot.findById(id);
    if (snapshot) {
        await removeSnapshotFile(snapshot);
        await Snapshot.findByIdAndDelete(id);
    } else {
    }
};

export {
    remove,
};
