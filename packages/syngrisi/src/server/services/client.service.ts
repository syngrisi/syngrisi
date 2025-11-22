import { Check, CheckDocument } from '@models';
import { buildIdentObject, calculateAcceptedStatus, ident, errMsg, ApiError, prettyCheckParams } from '@utils';
import { updateItemDate } from '@lib/dbItems';
import log from "@logger";
import { LogOpts, RequestUser } from '@types';

import { TestDocument } from '@models/Test.model';
import { AppDocument } from '@models/App.model';
import { SuiteDocument } from '@models/Suite.model';
import { SnapshotDocument } from '@models/Snapshot.model';
import StatusCodes from 'http-status';
import { prepareActualSnapshot, isNeedFiles } from './snapshot-file.service';
import { startSession, endSession } from './test-run.service';
import * as BaselineService from './baseline.service';
import { compareCheck } from './comparison.service';
import { CreateCheckParams, CreateCheckParamsExtended } from '../../types/Check';

const createCheckParams = (checkParam: CreateCheckParams, suite: SuiteDocument, app: AppDocument, test: TestDocument, currentUser: RequestUser): CreateCheckParamsExtended => ({
    test: test.id,
    name: checkParam.name,
    status: 'pending',
    viewport: checkParam.viewport,
    browserName: checkParam.browserName,
    browserVersion: checkParam.browserVersion,
    browserFullVersion: checkParam.browserFullVersion,
    os: checkParam.os,
    updatedDate: Date.now(),
    suite: suite.id,
    app: app.id,
    branch: checkParam.branch,
    domDump: checkParam.domDump,
    run: test.run.toString(),
    creatorId: currentUser._id.toString(),
    creatorUsername: currentUser.username,
    hashCode: checkParam.hashCode,
    failReasons: [],
});

const createCheck = async (checkParam: CreateCheckParams, test: TestDocument, suite: SuiteDocument, app: AppDocument, currentUser: RequestUser, skipSaveOnCompareError = false) => {
    const logOpts: LogOpts = {
        scope: 'createCheck',
        user: currentUser.username,
        itemType: 'check',
        msgType: 'CREATE',
    };
    let actualSnapshot: SnapshotDocument;
    let currentBaselineSnapshot: SnapshotDocument;

    const newCheckParams = createCheckParams(checkParam, suite, app, test, currentUser);
    const checkIdent = buildIdentObject(newCheckParams);

    let check: CheckDocument | null = null;
    const totalCheckHandleTime = 0;

    const addCheck = (test: TestDocument, check: CheckDocument) => {
        if (test.checks) {
            test.checks.push(check.id);
        } else {
            test.checks = [check.id];
        }
    }

    try {
        const { needFilesStatus, snapshotFoundedByHashcode } = await isNeedFiles(checkParam, logOpts);
        if (needFilesStatus) return { status: 'needFiles' };

        actualSnapshot = await prepareActualSnapshot(checkParam, snapshotFoundedByHashcode, logOpts);
        newCheckParams.actualSnapshotId = actualSnapshot.id;

        log.info(`find a baseline for the check with identifier: '${JSON.stringify(checkIdent)}'`, logOpts);
        const storedBaseline = await BaselineService.getAcceptedBaseline(checkIdent);

        const inspectBaselineResult = await BaselineService.inspectBaseline(newCheckParams, storedBaseline, checkIdent, actualSnapshot, logOpts);
        Object.assign(newCheckParams, inspectBaselineResult.inspectBaselineParams);
        currentBaselineSnapshot = inspectBaselineResult.currentBaselineSnapshot;

        const compareResult = await compareCheck(currentBaselineSnapshot, actualSnapshot, newCheckParams, skipSaveOnCompareError, currentUser);

        Object.assign(newCheckParams, compareResult);

        log.debug(`create the new check document with params: '${prettyCheckParams(newCheckParams)}'`, logOpts);
        check = await Check.create(newCheckParams);
        const savedCheck = await check.save();

        log.debug(`the check with id: '${check.id}', was created, will updated with data during creating process`, logOpts);
        logOpts.ref = String(check.id);
        log.debug(`update test with check id: '${check.id}'`, logOpts);

        addCheck(test, check);

        test.markedAs = await calculateAcceptedStatus(check.test);
        test.updatedDate = new Date();

        await test.save();

        log.debug('update suite and run', logOpts);

        await updateItemDate('VRSSuite', check.suite);
        await updateItemDate('VRSRun', check.run);

        const lastSuccessCheck = await BaselineService.getLastSuccessCheck(checkIdent);

        const checkObject = savedCheck.toObject();

        type CheckResult = (typeof checkObject) & {
            currentSnapshot: SnapshotDocument,
            expectedSnapshot: SnapshotDocument,
            diffSnapshot: SnapshotDocument,
            executeTime: number,
            lastSuccess: string,
        }

        const result: CheckResult = {
            ...checkObject,
            currentSnapshot: actualSnapshot,
            expectedSnapshot: currentBaselineSnapshot,
            diffSnapshot: compareResult.diffSnapshot,
            executeTime: totalCheckHandleTime,
            lastSuccess: lastSuccessCheck ? lastSuccessCheck.id : null,
        };

        return result;
    } catch (e: unknown) {
        newCheckParams.status = 'failed';
        newCheckParams.result = `{ "server error": "${errMsg(e)}" }`;
        newCheckParams.failReasons.push('internal_server_error');

        if (!check) {
            log.debug(`create the new check document with params: '${prettyCheckParams(newCheckParams)}'`, logOpts);
            check = await Check.create(newCheckParams);
            await check.save();
        } else {
            check.set(newCheckParams)
            await check.save();
        }

        log.debug(`the check with id: '${check.id}', was created, will updated with data during creating process`, logOpts);
        logOpts.ref = check.id;
        log.debug(`update test with check id: '${check.id}'`, logOpts);
        addCheck(test, check);
        await test.save();

        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, errMsg(e));
    }
};

const getIdent = () => ident;

const getBaselines = BaselineService.getBaselines;

export {
    startSession,
    endSession,
    createCheck,
    getIdent,
    getBaselines,
};
