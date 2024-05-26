const { Check } = require('../models');

exports.calculateAcceptedStatus = async function calculateAcceptedStatus(testId) {
    const checksInTest = await Check.find({ test: testId });
    const statuses = checksInTest.map((x) => x.markedAs);
    if (statuses.length < 1) {
        return 'Unaccepted';
    }
    let testCalculatedStatus = 'Unaccepted';
    if (statuses.some((x) => x === 'accepted')) {
        testCalculatedStatus = 'Partially';
    }
    if (statuses.every((x) => x === 'accepted')) {
        testCalculatedStatus = 'Accepted';
    }
    // console.log({ testCalculatedStatus });
    return testCalculatedStatus;
};