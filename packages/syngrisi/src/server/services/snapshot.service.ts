import fs from 'fs';
import { config } from '@config';
import { Baseline, Snapshot } from '@models';
import log from "../lib/logger";
import { SnapshotDocument } from '@models/Snapshot';
import path from 'path';

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
    const logOpts = {
        scope: 'removeSnapshot',
        msgType: 'REMOVE',
        itemType: 'snapshot',
        ref: id,
    };
    log.silly(`deleting snapshot with id: '${id}'`, logOpts);

    if (!id) {
        log.warn('id is empty');
        return;
    }

    const snapshot: SnapshotDocument | null = await Snapshot.findById(id).lean().exec();
    if (!snapshot) {
        log.warn(`cannot find snapshot with id: '${id}'`);
        return;
    }

    const baseline = await Baseline.findOne({ snapshootId: id });
    if (baseline) {
        log.debug(`snapshot: '${id}' is related to a baseline, skipping deletion`, logOpts);
        return;
    }

    log.debug(`snapshot: '${id}' is not related to a baseline, attempting to remove it`, logOpts);
    await Snapshot.findByIdAndDelete(id);
    log.debug(`snapshot: '${id}' was removed`, logOpts);

    const imagePath = path.join(config.defaultImagesPath, snapshot.filename);
    log.debug(`attempting to remove snapshot file, id: '${snapshot._id}', filename: '${imagePath}'`, logOpts);
    await removeSnapshotFile(snapshot);
};

export {
    remove,
};
