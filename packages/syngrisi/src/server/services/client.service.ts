import { Check, CheckDocument } from '@models';
import { buildIdentObject, ident, errMsg, ApiError, prettyCheckParams } from '@utils';
import log from "@logger";
import { LogOpts, RequestUser } from '@types';
import { domSnapshotService } from './dom-snapshot.service';

import { TestDocument } from '@models/Test.model';
import { AppDocument } from '@models/App.model';
import { SuiteDocument } from '@models/Suite.model';
import { SnapshotDocument } from '@models/Snapshot.model';
import { HttpStatus } from '@utils';
import { prepareActualSnapshot, isNeedFiles } from './snapshot-file.service';
import { startSession, endSession, updateTestAfterCheck } from './test-run.service';
import * as BaselineService from './baseline.service';
import * as CheckService from './check.service';
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

import mongoose from 'mongoose';
import * as SnapshotService from './snapshot.service';

import fs, { promises as fsp } from 'fs';
import { config } from '@config';
import path from 'path';

/**
 * Check if the MongoDB deployment supports transactions (requires replica set or sharded cluster)
 */
async function supportsTransactions(): Promise<boolean> {
    try {
        if (!mongoose.connection.db) {
            log.warn('MongoDB connection not established. Transactions will be disabled.');
            return false;
        }
        const adminDb = mongoose.connection.db.admin();
        const serverStatus = await adminDb.serverStatus();
        // Check if running as part of a replica set
        return serverStatus.repl !== undefined;
    } catch (e) {
        log.warn(`Failed to detect MongoDB replica set: ${errMsg(e)}. Transactions will be disabled.`);
        return false;
    }
}

const cleanupOrphanFiles = async (
    actualSnapshot: SnapshotDocument | null,
    diffSnapshot: SnapshotDocument | null,
    logOpts: LogOpts
) => {
    if (actualSnapshot && actualSnapshot.filename === `${actualSnapshot.id}.png`) {
        const imagePath = path.join(config.defaultImagesPath, actualSnapshot.filename);
        try {
            if (fs.existsSync(imagePath)) {
                await fsp.unlink(imagePath);
                log.debug(`deleted orphan file: ${imagePath}`, logOpts);
            }
        } catch (err) {
            log.error(`failed to delete orphan file: ${imagePath}, error: ${errMsg(err)}`, logOpts);
        }
    }

    if (diffSnapshot && diffSnapshot.filename) {
        const imagePath = path.join(config.defaultImagesPath, diffSnapshot.filename);
        try {
            if (fs.existsSync(imagePath)) {
                await fsp.unlink(imagePath);
                log.debug(`deleted orphan diff file: ${imagePath}`, logOpts);
            }
        } catch (err) {
            log.error(`failed to delete orphan diff file: ${imagePath}, error: ${errMsg(err)}`, logOpts);
        }
    }
};

const recordCheckFailure = async (
    e: unknown,
    newCheckParams: CreateCheckParamsExtended,
    test: TestDocument,
    logOpts: LogOpts
) => {
    try {
        newCheckParams.status = 'failed';
        newCheckParams.result = JSON.stringify({ "server error": errMsg(e) });
        newCheckParams.failReasons.push('internal_server_error');

        log.debug(`create the failed check document`, logOpts);
        const failedCheck = await CheckService.createCheckDocument(newCheckParams);
        await updateTestAfterCheck(test, failedCheck, logOpts);
        const failedObj = failedCheck.toObject();
        if (failedObj.status && Array.isArray(failedObj.status)) failedObj.status = failedObj.status[0] as any;
        return { ...failedObj, executeTime: 0 } as any;
    } catch (err2) {
        log.error(`failed to record check failure: ${errMsg(err2)}`, logOpts);
        return { status: 'failed', error: errMsg(e) } as any;
    }
};

const createCheck = async (checkParam: CreateCheckParams, test: TestDocument, suite: SuiteDocument, app: AppDocument, currentUser: RequestUser, skipSaveOnCompareError = false) => {
    const logOpts: LogOpts = {
        scope: 'createCheck',
        user: currentUser.username,
        itemType: 'check',
    };
    let actualSnapshot: SnapshotDocument | null = null;
    let currentBaselineSnapshot: SnapshotDocument;
    let diffSnapshot: SnapshotDocument | null = null;

    const newCheckParams = createCheckParams(checkParam, suite, app, test, currentUser);
    const checkIdent = buildIdentObject(newCheckParams);

    let check: CheckDocument | null = null;
    const totalCheckHandleTime = 0;

    // Check if transactions are supported (requires replica set)
    const useTransactions = await supportsTransactions();
    let session: mongoose.ClientSession | undefined;

    if (useTransactions) {
        session = await mongoose.startSession();
        session.startTransaction();
        log.debug('Using MongoDB transactions for createCheck', logOpts);
    } else {
        log.debug('MongoDB transactions not available, executing without session', logOpts);
    }

    try {
        const { needFilesStatus, snapshotFoundedByHashcode } = await isNeedFiles(checkParam, logOpts);
        if (needFilesStatus) {
            if (session) {
                await session.abortTransaction();
                session.endSession();
            }
            return { status: 'needFiles' };
        }

        // update test with suite and creator
        // moved from controller to be part of transaction
        test.suite = suite.id;
        test.creatorId = currentUser._id;
        test.creatorUsername = currentUser.username;
        await test.save({ session });

        actualSnapshot = await prepareActualSnapshot(checkParam, snapshotFoundedByHashcode, logOpts, session);
        newCheckParams.actualSnapshotId = actualSnapshot.id;

        log.info(`find a baseline for the check with identifier: '${JSON.stringify(checkIdent)}'`, logOpts);
        const storedBaseline = await BaselineService.getAcceptedBaseline(checkIdent);

        const inspectBaselineResult = await BaselineService.inspectBaseline(newCheckParams, storedBaseline, checkIdent, actualSnapshot, logOpts);
        Object.assign(newCheckParams, inspectBaselineResult.inspectBaselineParams);
        currentBaselineSnapshot = inspectBaselineResult.currentBaselineSnapshot;

        const compareResult = await compareCheck(currentBaselineSnapshot, actualSnapshot, newCheckParams, skipSaveOnCompareError, currentUser, session);

        Object.assign(newCheckParams, compareResult);
        if (compareResult.diffSnapshot) {
            diffSnapshot = compareResult.diffSnapshot;
        }

        log.debug(`create the new check document with params: '${prettyCheckParams(newCheckParams)}'`, logOpts);
        check = await CheckService.createCheckDocument(newCheckParams, session);
        const savedCheck = check;

        log.debug(`the check with id: '${check.id}', was created, will updated with data during creating process`, logOpts);
        logOpts.ref = String(check.id);

        await updateTestAfterCheck(test, check, logOpts, session);

        // Save DOM snapshot if provided (for RCA feature)
        if (checkParam.domDump) {
            try {
                await domSnapshotService.createDomSnapshot({
                    checkId: check.id,
                    type: 'actual',
                    content: checkParam.domDump,
                });
                log.debug(`DOM snapshot created for check: '${check.id}'`, logOpts);
            } catch (domErr) {
                // DOM snapshot is non-critical, log and continue
                log.warn(`Failed to create DOM snapshot for check '${check.id}': ${errMsg(domErr)}`, logOpts);
            }
        }

        const lastSuccessCheck = await BaselineService.getLastSuccessCheck(checkIdent);

        if (session) {
            await session.commitTransaction();
            session.endSession();
        }

        const checkObject = savedCheck.toObject();

        // Convert status from array to string for SDK compatibility
        if (checkObject.status && Array.isArray(checkObject.status)) {
            checkObject.status = checkObject.status[0] as any;
        }

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
        if (session) {
            await session.abortTransaction();
            session.endSession();
        }

        log.error(`${session ? 'transaction aborted' : 'operation failed'}, cleaning up files... error: ${errMsg(e)}`, logOpts);

        await cleanupOrphanFiles(actualSnapshot, diffSnapshot, logOpts);

        return recordCheckFailure(e, newCheckParams, test, logOpts);
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
