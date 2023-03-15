/* eslint-disable */
/**
 * 0. fill test collection with 'checks' field array
 **/
const checks = db.vrschecks.find({}).toArray();

for (const check of checks) {
    const testId = check.test;
    if (testId) {
        const test = db.vrstests.findOne({ _id: testId });
        const newChecksArray = test.checks || [];
        newChecksArray.push(check._id);
        db.vrstests.update({ _id: test._id }, { $set: { "checks": newChecksArray } });
    }
}

/**
 * 1. fill test suite fields
 **/
const tests = db.vrstests.find({}).toArray();

tests.forEach((test) => {
    console.log(test.checks[0]);
    const firstCheckId = test.checks[0];
    if (firstCheckId) {
        const firstCheck = db.vrschecks.findOne({ _id: test.checks[0] });

        if (firstCheck) {
            const suite = firstCheck.suite;
            if (suite) {
                test.suite = suite;
            }
        }
    }
    else {
        console.log('Cannot find checks')
    }
})

/**
 * 2. set app id for runs and suites
 **/
db.vrstests.find({}).forEach((x) => {
    const appId = x.app;
    console.log({ appId });
    db.vrsruns.update({ _id: x.run }, { $set: { "app": appId } });
    db.vrssuites.update({ _id: x.suite }, { $set: { "app": appId } });
})

/**
 * 3. populate 'runs' and 'suites' with 'createdDate' field
 **/
db.vrssuites.find({}).forEach((x) => {
    // x.createdDate = x._id.getTimestamp();
    db.vrssuites.update({ _id: x._id }, { $set: { "createdDate": x._id.getTimestamp() } });
    console.log(x.updatedDate);
})

db.vrsruns.find({}).forEach((x) => {
    // x.createdDate = x._id.getTimestamp();
    db.vrsruns.update({ _id: x._id }, { $set: { "createdDate": x._id.getTimestamp() } });
    console.log(x.updatedDate);
})
