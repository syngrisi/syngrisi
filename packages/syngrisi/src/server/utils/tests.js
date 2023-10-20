const mongoose = require('mongoose');
const checkUtil = require('./check');

const Check = mongoose.model('VRSCheck');
const Test = mongoose.model('VRSTest');

module.exports.calculateTestStatus = async function calculateTestStatus(testId) {
    const checksInTest = await Check.find({ test: testId });
    const statuses = checksInTest.map((x) => x.status[0]);
    let testCalculatedStatus = 'Failed';
    if (statuses.every((x) => (x === 'new') || (x === 'passed'))) {
        testCalculatedStatus = 'Passed';
    }
    if (statuses.every((x) => (x === 'new'))) {
        testCalculatedStatus = 'New';
    }
    return testCalculatedStatus;
};

module.exports.removeTest = async function removeTest(id) {
    const logOpts = {
        itemType: 'test',
        msgType: 'REMOVE',
        ref: id,
    };
    try {
        log.debug(`try to delete all checks associated to test with ID: '${id}'`, logOpts);
        const checks = await Check.find({ test: id });
        for (const check of checks) {
            await checkUtil.removeCheck(check._id);
        }
        return Test.findByIdAndDelete(id);
    } catch (e) {
        log.error(`cannot remove test with id: ${id} error: ${e.stack || e.toString()}`, logOpts);
        throw new Error();
    }
};
