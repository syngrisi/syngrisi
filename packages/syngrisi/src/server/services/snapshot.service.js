const fs = require('fs');
const { config } = require('../../../config');
const { Baseline, Snapshot } = require('../models');
const log2 = require("../../../dist/src/server/lib/logger2").default;

const fileLogMeta = {
    scope: 'snapshot_helper',
    msgType: 'API',
};

/**
 * Remove the snapshot file if it's the last one with that filename.
 * @param {Object} snapshot - Snapshot document
 */
const removeSnapshotFile = async (snapshot) => {
    let relatedSnapshots;
    if (snapshot.filename) {
        relatedSnapshots = await Snapshot.find({ filename: snapshot.filename });
        log2.debug(`there are '${relatedSnapshots.length}' snapshots with filename: '${snapshot.filename}'`, fileLogMeta);
    }

    const isLastSnapshotFile = () => {
        if (!snapshot.filename) {
            return true;
        }
        return (relatedSnapshots.length === 0);
    };

    log2.debug({ isLastSnapshotFile: isLastSnapshotFile() });

    if (isLastSnapshotFile()) {
        const path = `${config.defaultImagesPath}${snapshot.filename}`;
        log2.silly(`path: ${path}`, fileLogMeta);
        if (fs.existsSync(path)) {
            log2.debug(`removing file: '${path}'`, fileLogMeta, {
                msgType: 'REMOVE',
                itemType: 'file',
            });
            fs.unlinkSync(path);
        }
    }
};

/**
 * Remove a snapshot by ID.
 * @param {String} id - Snapshot ID
 * @returns {Promise<void>}
 */
const remove = async (id) => {
    const logOpts = {
        scope: 'removeSnapshot',
        msgType: 'REMOVE',
        itemType: 'snapshot',
        ref: id,
    };
    log2.silly(`deleting snapshot with id: '${id}'`, logOpts);

    if (!id) {
        log2.warn('id is empty');
        return;
    }

    const snapshot = await Snapshot.findById(id);
    if (!snapshot) {
        log2.warn(`cannot find snapshot with id: '${id}'`);
        return;
    }

    const baseline = await Baseline.findOne({ snapshootId: id });
    if (baseline) {
        log2.debug(`snapshot: '${id}' is related to a baseline, skipping deletion`, logOpts);
        return;
    }

    log2.debug(`snapshot: '${id}' is not related to a baseline, attempting to remove it`, logOpts);
    await Snapshot.findByIdAndDelete(id);
    log2.debug(`snapshot: '${id}' was removed`, logOpts);

    const path = `${config.defaultImagesPath}${snapshot.filename}`;
    log2.debug(`attempting to remove snapshot file, id: '${snapshot._id}', filename: '${path}'`, logOpts);
    await removeSnapshotFile(snapshot);
};

module.exports = {
    remove,
};
