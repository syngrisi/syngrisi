import fs from 'fs';
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

const removeSnapshotFile = async (snapshot: SnapshotDocument) => {
    let relatedSnapshots: SnapshotDocument[];
    if (snapshot.filename) {
        relatedSnapshots = await Snapshot.find({ filename: snapshot.filename });
        log.debug(`there are '${relatedSnapshots.length}' snapshots with filename: '${snapshot.filename}'`, logOpts);
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
        log.silly(`path: ${imagePath}`, logOpts);
        if (fs.existsSync(imagePath)) {
            log.debug(`removing file: '${imagePath}'`, logOpts, {
                msgType: 'REMOVE',
                itemType: 'file',
            });
            fs.unlinkSync(imagePath);
        }
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
