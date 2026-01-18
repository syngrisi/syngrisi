import path from 'path';
import { promises as fsp } from 'fs';
import { Baseline } from '@models';
import { SnapshotDocument } from '@models/Snapshot.model';
import { config } from '@config';
import { getDiff } from '@lib/comparison';
import log from '@logger';
import { SnapshotDiff } from '@schemas/SnapshotDiff.schema';
import { LogOpts, RequestUser } from '@types';
import { UserDocument } from '@models/User.model';
import { CreateCheckParamsExtended } from '../../types/Check';
import { createSnapshot } from './snapshot-file.service';
import { errMsg, ApiError } from '@utils';
import { HttpStatus } from '@utils';
import { executeBeforeCompareHook, executeAfterCompareHook } from '../plugins';

export interface CompareSnapshotsOptions {
    vShifting?: boolean;
    ignore?: string;
    ignoredBoxes?: any[];
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
            diff = await getDiff(baselineData, actualData, opts);
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

import { ClientSession } from 'mongoose';

export const compareCheck = async (
    expectedSnapshot: SnapshotDocument,
    actualSnapshot: SnapshotDocument,
    newCheckParams: CreateCheckParamsExtended,
    skipSaveOnCompareError: boolean,
    currentUser: RequestUser,
    session?: ClientSession
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

            const baseline = await Baseline.findOne({ snapshootId: expectedSnapshot._id }).exec();
            const compareOptions: CompareSnapshotsOptions = { vShifting: newCheckParams.vShifting };

            if (baseline) {
                if (baseline.ignoreRegions) {
                    log.debug(`ignore regions: '${baseline.ignoreRegions}', type: '${typeof baseline.ignoreRegions}'`);
                    compareOptions.ignoredBoxes = JSON.parse(baseline.ignoreRegions);
                }
                compareOptions.ignore = baseline.matchType || 'nothing';
            }

            // Plugin hook: beforeCompare - allow plugins to skip or modify comparison
            const checkContext = {
                expectedSnapshot,
                actualSnapshot,
                checkParams: newCheckParams,
                baseline: baseline || undefined,
                compareOptions,
            };

            const beforeHookResult = await executeBeforeCompareHook(checkContext);
            if ('skip' in beforeHookResult && beforeHookResult.skip) {
                log.info(`Comparison skipped by plugin, using override result`, logOpts);
                const overrideResult = beforeHookResult.result;
                return {
                    failReasons: overrideResult.failReasons || [],
                    status: overrideResult.status,
                    result: overrideResult.result || JSON.stringify({ pluginOverride: true }),
                } as CompareResult;
            }

            checkCompareResult = await compareSnapshots(expectedSnapshot, actualSnapshot, compareOptions);
            log.silly(`ignoreDifferentResolutions: '${ignoreDifferentResolutions(checkCompareResult.dimensionDifference)}'`);
            log.silly(`dimensionDifference: '${JSON.stringify(checkCompareResult.dimensionDifference)}`);

            // Auto-ignore 1px height difference if configured to ignore resolutions
            if (areSnapshotsDifferent(checkCompareResult) && ignoreDifferentResolutions(checkCompareResult.dimensionDifference!)) {
                const baselineDims = checkCompareResult.baselineDimensions;
                const actualDims = checkCompareResult.actualDimensions;

                if (baselineDims && actualDims) {
                    const heightDiff = actualDims.height - baselineDims.height;
                    let ignoredBox;

                    if (heightDiff === 1) {
                        // Actual is taller. Ignore bottom 1px.
                        ignoredBox = { left: 0, top: actualDims.height - 1, right: actualDims.width, bottom: actualDims.height };
                    } else if (heightDiff === -1) {
                        // Baseline is taller. Ignore bottom 1px.
                        ignoredBox = { left: 0, top: baselineDims.height - 1, right: baselineDims.width, bottom: baselineDims.height };
                    }

                    if (ignoredBox) {
                        log.debug(`Retrying comparison with ignored box for 1px diff: ${JSON.stringify(ignoredBox)}`, logOpts);
                        const retryOptions = { ...compareOptions };
                        // resemble expects objects with left, top, right, bottom for ignoreRectangles in compareImagesNode?
                        // compareImagesNode maps them: return [it.left, it.top, it.right - it.left, it.bottom - it.top];
                        // So we should pass objects.
                        retryOptions.ignoredBoxes = retryOptions.ignoredBoxes ? [...retryOptions.ignoredBoxes, ignoredBox] : [ignoredBox];

                        const retryResult = await compareSnapshots(expectedSnapshot, actualSnapshot, retryOptions);

                        if (!areSnapshotsDifferent(retryResult)) {
                            log.debug(`Retry passed with ignored box`, logOpts);
                            checkCompareResult = retryResult;
                        }
                    }
                }
            }

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
                    }, session);
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
            throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, `error during comparing: ${errMsg(e)}`);
        }
    }

    if (compareResult.failReasons.length > 0) {
        compareResult.status = 'failed';
    }

    // Plugin hook: afterCompare - allow plugins to override the final result
    const checkContextForAfterHook = {
        expectedSnapshot,
        actualSnapshot,
        checkParams: newCheckParams,
    };
    const finalResult = await executeAfterCompareHook(
        checkContextForAfterHook,
        compareResult as CompareResult
    );

    return finalResult;
};
