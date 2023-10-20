const mongoose = require('mongoose');
const fss = require('fs');
const { config } = require('../../../config');

const Baseline = mongoose.model('VRSBaseline');
const Snapshot = mongoose.model('VRSSnapshot');

const $this = this;

$this.logMeta = {
    scope: 'snapshot_helper',
    msgType: 'API',
};

const removeSnapshotFile = async (snapshot) => {
    let relatedSnapshots;
    if (snapshot.filename) {
        relatedSnapshots = await Snapshot.find({ filename: snapshot.filename });
        log.debug(`there is '${relatedSnapshots.length}' snapshots with such filename: '${snapshot.filename}'`, $this);
    }

    // eslint-disable-next-line arrow-body-style
    const isLastSnapshotFile = () => {
        if (snapshot.filename === undefined) {
            return true;
        }
        return (relatedSnapshots.length === 0);
    };
    log.debug({ isLastSnapshotFile: isLastSnapshotFile() });
    if (isLastSnapshotFile()) {
        const path = `${config.defaultBaselinePath}${snapshot.filename}`;
        log.silly(`path: ${path}`, $this);
        if (fss.existsSync(path)) {
            log.debug(`remove file: '${path}'`, $this, {
                msgType: 'REMOVE',
                itemType: 'file',
            });
            fss.unlinkSync(path);
        }
    }
};

module.exports.removeSnapshot = async (id) => {
    const logOpts = {
        scope: 'removeSnapshot',
        msgType: 'REMOVE',
        itemType: 'snapshot',
        ref: id,
    };
    log.silly(`delete snapshot with id: '${id}'`, logOpts);
    if (!id) {
        log.warn('id is empty');
        return;
    }
    const snapshot = await Snapshot.findById(id);

    if (snapshot === null) {
        log.warn(`cannot find the snapshot with id: '${id}'`);
        return;
    }
    const baseline = await Baseline.findOne({ snapshootId: id });

    if (baseline) {
        log.debug(`snapshot: '${id}' related to baseline baseline, skip`, logOpts);
        return;
    }

    log.debug(`snapshot: '${id}' is not related to baseline, try to remove it`, logOpts);
    await Snapshot.findByIdAndDelete(id);
    log.debug(`snapshot: '${id}' was removed`, logOpts);
    const path = `${config.defaultBaselinePath}${snapshot.filename}`;

    log.debug(`try to remove snapshot file, id: '${snapshot._id}', filename: '${path}'`, logOpts);
    await removeSnapshotFile(snapshot);
};
