const fs = require('fs');
const { config } = require('../../../config');
const { Baseline, Snapshot } = require('../models');

const $this = this;

$this.logMeta = {
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
        log.debug(`there are '${relatedSnapshots.length}' snapshots with filename: '${snapshot.filename}'`, $this);
    }

    const isLastSnapshotFile = () => {
        if (!snapshot.filename) {
            return true;
        }
        return (relatedSnapshots.length === 0);
    };

    log.debug({ isLastSnapshotFile: isLastSnapshotFile() });

    if (isLastSnapshotFile()) {
        const path = `${config.defaultImagesPath}${snapshot.filename}`;
        log.silly(`path: ${path}`, $this);
        if (fs.existsSync(path)) {
            log.debug(`removing file: '${path}'`, $this, {
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
    log.silly(`deleting snapshot with id: '${id}'`, logOpts);

    if (!id) {
        log.warn('id is empty');
        return;
    }

    const snapshot = await Snapshot.findById(id);
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

    const path = `${config.defaultImagesPath}${snapshot.filename}`;
    log.debug(`attempting to remove snapshot file, id: '${snapshot._id}', filename: '${path}'`, logOpts);
    await removeSnapshotFile(snapshot);
};

module.exports = {
    remove,
};
