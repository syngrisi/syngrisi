import path from 'path';
import { promises as fsp } from 'fs';
import { Baseline } from '@models';
import { SnapshotDocument } from '@models/Snapshot.model';
import { config } from '@config';
import { getDiff } from '@lib/сomparison';
import log from '@logger';
import { SnapshotDiff } from '@schemas/SnapshotDiff.schema';
import { LogOpts, RequestUser } from '@types';
import { UserDocument } from '@models/User.model';
import { CreateCheckParamsExtended } from '../../types/Check';
import { createSnapshot } from './snapshot-file.service';
import { errMsg, ApiError } from '@utils';
import httpStatus from 'http-status';

export interface CompareSnapshotsOptions {
    vShifting?: boolean;
    ignore?: string;
    ignoredBoxes?: string;
}

export const compareSnapshots = async (baselineSnapshot: SnapshotDocument, actual: SnapshotDocument, opts: CompareSnapshotsOptions = {}) => {
    const logOpts = {
        scope: 'compareSnapshots',
        ref: baselineSnapshot.id,
        itemType: 'snapshot',
        msgType: 'COMPARE',
    };
    try {
        log.debug(`compare baseline and actual snapshots with ids: [${baselineSnapshot.id}, ${actual.id}]`, logOpts);
        log.debug(`current baseline snapshot: ${JSON.stringify(baselineSnapshot)}`, logOpts);
        let diff: SnapshotDiff;
        if (baselineSnapshot.imghash === actual.imghash) {
            log.debug(`baseline and actual snapshot have the identical image hashes: '${baselineSnapshot.imghash}'`, logOpts);
            diff = {
                isSameDimensions: true,
                dimensionDifference: { width: 0, height: 0 },
                rawMisMatchPercentage: 0,
                misMatchPercentage: '0.00',
                analysisTime: 0,
                executionTotalTime: '0',
                getBuffer: null
            };
        } else {
            if (!baselineSnapshot.filename || !actual.filename) {
                throw new Error('Snapshot filename is missing');
            }
            const baselinePath = path.join(config.defaultImagesPath, baselineSnapshot.filename);
            const actualPath = path.join(config.defaultImagesPath, actual.filename);
            const baselineData = await fsp.readFile(baselinePath);
            const actualData = await fsp.readFile(actualPath);
            log.debug(`baseline path: ${baselinePath}`, logOpts);
            log.debug(`actual path: ${actualPath}`, logOpts);
            const options = opts;
            const baseline = await Baseline.findOne({ snapshootId: baselineSnapshot._id }).exec();

            if (baseline) { // ts refactoring TODO: find out a proper way
                if (baseline.ignoreRegions) {
                    log.debug(`ignore regions: '${baseline.ignoreRegions}', type: '${typeof baseline.ignoreRegions}'`);
                    options.ignoredBoxes = JSON.parse(baseline.ignoreRegions);
                }
                options.ignore = baseline.matchType || 'nothing';
            }

            diff = await getDiff(baselineData, actualData, options);
        }

        log.silly(`the diff is: '${JSON.stringify(diff, null, 2)}'`);
        if (diff.rawMisMatchPercentage.toString() !== '0') {
            log.debug(`images are different, ids: [${baselineSnapshot.id}, ${actual.id}], rawMisMatchPercentage: '${diff.rawMisMatchPercentage}'`);
        }
        if (diff.stabMethod && diff.vOffset) {
            if (diff.stabMethod === 'downup') {
                actual.vOffset = -diff.vOffset;
                await actual.save();
            }
            if (diff.stabMethod === 'updown') {
                baselineSnapshot.vOffset = -diff.vOffset;
                await baselineSnapshot.save();
            }
        }
        return diff;
    } catch (e: unknown) {
        const errMsg = `cannot compare snapshots: ${e}\n ${e instanceof Error ? e.stack : e}`;
        log.error(errMsg, logOpts);
        throw new Error(String(e));
    }
};

type DimensionType = { height: number, width: number };

export const ignoreDifferentResolutions = ({ height, width }: DimensionType) => {
    if ((width === 0) && (height === -1)) return true;
    if ((width === 0) && (height === 1)) return true;
    return false;
};

export interface CompareResult {
    failReasons: string[];
    diffId: string;
    diffSnapshot: SnapshotDocument;
    status: string;
    result: string;
    isSameDimensions: boolean;
    dimensionDifference: DimensionType;
}

export const compareCheck = async (
    expectedSnapshot: SnapshotDocument,
    actualSnapshot: SnapshotDocument,
    newCheckParams: CreateCheckParamsExtended,
    skipSaveOnCompareError: boolean,
    currentUser: RequestUser
): Promise<CompareResult> => {
    const logOpts: LogOpts = {
        scope: 'createCheck.compare',
        user: currentUser.username,
        itemType: 'check',
        msgType: 'COMPARE',
    };

    const executionTimer = process.hrtime();
    const compareResult: Partial<CompareResult> = {};
    compareResult.failReasons = [...newCheckParams.failReasons];

    let checkCompareResult: SnapshotDiff;
    let diffSnapshot: SnapshotDocument | null = null;

    const areSnapshotsDifferent = (result: SnapshotDiff) => result.rawMisMatchPercentage.toString() !== '0';
    const areSnapshotsWrongDimensions = (result: Partial<CompareResult>) => !result.isSameDimensions && !ignoreDifferentResolutions(result.dimensionDifference!);

    if ((newCheckParams.status !== 'new') && (!compareResult.failReasons.includes('not_accepted'))) {
        try {
            log.debug(`'the check with name: '${newCheckParams.name}' isn't new, make comparing'`, logOpts);
            checkCompareResult = await compareSnapshots(expectedSnapshot, actualSnapshot, { vShifting: newCheckParams.vShifting });
            log.silly(`ignoreDifferentResolutions: '${ignoreDifferentResolutions(checkCompareResult.dimensionDifference)}'`);
            log.silly(`dimensionDifference: '${JSON.stringify(checkCompareResult.dimensionDifference)}`);

            if (areSnapshotsDifferent(checkCompareResult) || areSnapshotsWrongDimensions(checkCompareResult)) {
                let logMsg;
                if (areSnapshotsWrongDimensions(checkCompareResult)) {
                    logMsg = 'snapshots have different dimensions';
                    compareResult.failReasons.push('wrong_dimensions');
                }
                if (areSnapshotsDifferent(checkCompareResult)) {
                    logMsg = 'snapshots have differences';
                    compareResult.failReasons.push('different_images');
                }

                if (logMsg) log.debug(logMsg, logOpts);
                log.debug(`saving diff snapshot for check with name: '${newCheckParams.name}'`, logOpts);
                if (!skipSaveOnCompareError) {
                    diffSnapshot = await createSnapshot({
                        name: newCheckParams.name,
                        fileData: checkCompareResult.getBuffer!(),
                    });
                    compareResult.diffId = diffSnapshot.id;
                    compareResult.diffSnapshot = diffSnapshot;
                }
                compareResult.status = 'failed';
            } else {
                compareResult.status = 'passed';
            }

            checkCompareResult.totalCheckHandleTime = process.hrtime(executionTimer).toString();
            compareResult.result = JSON.stringify(checkCompareResult, null, '\t');
        } catch (e: unknown) {
            // compareResult.updatedDate = Date.now();
            compareResult.status = 'failed';
            compareResult.result = JSON.stringify({ server_error: `error during comparing - ${errMsg(e)}` });
            compareResult.failReasons.push('internal_server_error');
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `error during comparing: ${errMsg(e)}`);
        }
    }

    if (compareResult.failReasons.length > 0) {
        compareResult.status = 'failed';
    }
    return compareResult as CompareResult;
};
