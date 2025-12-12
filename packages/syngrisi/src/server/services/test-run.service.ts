import { removeEmptyProperties, waitUntil, errMsg, calculateAcceptedStatus } from '@utils';
import { Check, Test } from '@models';
import { createRunIfNotExist, createSuiteIfNotExist, createItemIfNotExistAsync, createTest, updateItemDate } from '@lib/dbItems';
import log from '@logger';
import { LogOpts } from '@types';
import { ClientStartSessionType } from '@schemas/Client.schema';
import { UpdateTestType } from '@schemas/Test.schema';
import { TestDocument } from '@models/Test.model';
import { CheckDocument } from '@models/Check.model';

const updateTest = async (id: string, update: UpdateTestType) => {
    const logOpts: LogOpts = {
        scope: 'updateTest',
        itemType: 'test',
        msgType: 'UPDATE',
        ref: id,
    };
    log.debug(`update test id '${id}' with params '${JSON.stringify(update)}'`, logOpts);
    const updatedDate = update.updatedDate || Date.now();
    const test = await Test.findByIdAndUpdate(
        id,
        { ...update, updatedDate }
    ).exec();
    await test?.save();
    return test;
};

export const startSession = async (params: ClientStartSessionType, username: string) => {
    const logOpts = {
        scope: 'createTest',
        user: username,
        itemType: 'test',
        msgType: 'CREATE',
    };
    log.info(`create test with name '${params.name}', params: '${JSON.stringify(params)}'`, logOpts);
    const opts = removeEmptyProperties({
        name: params.name,
        status: 'Running',
        app: params.app,
        tags: params.tags && JSON.parse(params.tags),
        branch: params.branch,
        viewport: params.viewport,
        browserName: params.browser,
        browserVersion: params.browserVersion,
        browserFullVersion: params.browserFullVersion,
        os: params.os,
        startDate: new Date(),
        updatedDate: new Date(),
    });
    try {
        const app = await createItemIfNotExistAsync(
            'VRSApp',
            { name: params.app },
            { user: username, itemType: 'app' }
        );
        opts.app = app._id;

        const run = await createRunIfNotExist(
            { name: params.run, ident: params.runident, app: app._id },
            { user: username, itemType: 'run' }
        );
        opts.run = run._id;

        const suite = await createSuiteIfNotExist(
            { name: params.suite || 'Others', app: app._id, createdDate: new Date() },
            { user: username, itemType: 'suite' }
        );

        opts.suite = suite._id;

        const test = await createTest(opts);
        return test;
    } catch (e: unknown) {
        log.error(`cannot start session '${params.name}', params: '${JSON.stringify(params)}', error: ${errMsg(e)}`, logOpts);
        throw e;
    }
};

const calculateTestStatus = (checksStatuses: string[]) => {
    let status = 'not set';
    if (checksStatuses.some((st) => st === 'failed')) {
        status = 'Failed';
    }
    if (checksStatuses.some((st) => st === 'passed') && !checksStatuses.some((st) => st === 'failed')) {
        status = 'Passed';
    }
    if (checksStatuses.some((st) => st === 'new') && !checksStatuses.some((st) => st === 'failed')) {
        status = 'Passed';
    }
    if (checksStatuses.some((st) => st === 'blinking') && !checksStatuses.some((st) => st === 'failed')) {
        status = 'Passed';
    }
    if (checksStatuses.every((st) => st === 'new')) {
        status = 'New';
    }
    return status;
};

export const endSession = async (testId: string, username: string) => {
    const logOpts = {
        scope: 'stopSession',
        msgType: 'END_SESSION',
        user: username,
        itemType: 'test',
        ref: testId,
    };
    await waitUntil(async () => (await Check.find({ test: testId }).exec()).filter((ch) => ch.status.toString() !== 'pending').length > 0);
    const sessionChecks = await Check.find({ test: testId }).lean().exec();

    const checksStatuses = sessionChecks.map((x) => x.status[0]);
    let status = calculateTestStatus(checksStatuses);
    const blinking = checksStatuses.filter((g) => g === 'blinking').length;
    const testParams = {
        status,
        blinking,
    };
    log.info(`the session is over, the test will be updated with parameters: '${JSON.stringify(testParams)}'`, logOpts);
    const updatedTest = await updateTest(testId, testParams);
    const result = updatedTest?.toObject() as TestDocument;
    return result;
};

export const updateTestAfterCheck = async (test: TestDocument, check: CheckDocument, logOpts: LogOpts, session?: any) => {
    log.debug(`update test with check id: '${check.id}'`, logOpts);
    if (test.checks) {
        test.checks.push(check.id);
    } else {
        test.checks = [check.id];
    }
    test.markedAs = await calculateAcceptedStatus(check.test);
    test.updatedDate = new Date();
    await test.save({ session });

    log.debug('update suite and run', logOpts);
    await updateItemDate('VRSSuite', check.suite, session);
    await updateItemDate('VRSRun', check.run, session);
};
