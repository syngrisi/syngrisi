import {
    Check,
    Test,
    Suite,
    Baseline,
    CheckDocument,
} from '@models';

import { Types, Schema } from 'mongoose';
import { calculateAcceptedStatus, buildIdentObject } from '@utils';
import * as snapshotService from './snapshot.service';
import * as orm from '@lib/dbItems';
import log from '@lib/logger';
import { BaselineDocument } from '@models/Baseline.model';
import { LogOpts, RequestUser } from '@root/src/types';

async function calculateTestStatus(testId: string): Promise<string> {
    const checksInTest = await Check.find({ test: testId });
    const statuses = checksInTest.map((x: CheckDocument) => x.status[0]);
    let testCalculatedStatus = 'Failed';
    if (statuses.every((x: string) => (x === 'new') || (x === 'passed'))) {
        testCalculatedStatus = 'Passed';
    }
    if (statuses.every((x: string) => (x === 'new'))) {
        testCalculatedStatus = 'New';
    }
    return testCalculatedStatus;
}


export interface baselineParamsType extends Document {
    snapshootId?: string;
    name: string;
    app: string;
    branch: string;
    browserName: string;
    browserVersion?: string;
    browserFullVersion?: string;
    viewport: string;
    os: string;
    markedAs?: 'bug' | 'accepted';
    lastMarkedDate?: Date;
    createdDate?: Date;
    updatedDate?: Date;
    markedById?: Schema.Types.ObjectId;
    markedByUsername?: string;
    ignoreRegions?: string;
    boundRegions?: string;
    matchType?: 'antialiasing' | 'nothing' | 'colors';
    meta?: object;
    actualSnapshotId: Schema.Types.ObjectId;
    markedDate: Date;
}


const validateBaselineParam = (params: baselineParamsType): void => {
    const mandatoryParams = ['markedAs', 'markedById', 'markedByUsername', 'markedDate'];
    for (const param of mandatoryParams) {
        if (!params[param as keyof baselineParamsType]) {
            const errMsg = `invalid baseline parameters, '${param}' is empty, params: ${JSON.stringify(params)}`;
            log.error(errMsg);
            throw new Error(errMsg);
        }
    }
};

async function createNewBaseline(params: baselineParamsType): Promise<BaselineDocument> {
    const logOpts = {
        scope: 'createNewBaseline',
        msgType: 'CREATE',
    };


    validateBaselineParam(params);

    const identFields = buildIdentObject(params);

    const lastBaseline = await Baseline.findOne(identFields).sort({ createdDate: -1 }).exec();
    const filter = { ...identFields, snapshootId: params.actualSnapshotId };

    const baselineParams = lastBaseline?.ignoreRegions
        ? { ...identFields, ignoreRegions: lastBaseline.ignoreRegions }
        : identFields;

    const update = {
        $setOnInsert: {
            ...baselineParams,
            snapshootId: params.actualSnapshotId,
            createdDate: new Date(),
        },
        $set: {
            markedAs: params.markedAs,
            markedById: params.markedById,
            markedByUsername: params.markedByUsername,
            lastMarkedDate: params.markedDate,
        },
    };

    try {
        const baseline = await Baseline.findOneAndUpdate(
            filter,
            update,
            { new: true, upsert: true },
        ).exec();

        log.debug(`baseline upserted for snapshot id: ${params.actualSnapshotId}`, logOpts);
        log.silly({ baseline });
        return baseline as BaselineDocument;
    } catch (err: any) {
        if (err?.code === 11000) {
            log.warn(`baseline duplicate key detected for filter ${JSON.stringify(filter)}, retrying fetch`, logOpts);
            const existing = await Baseline.findOne(filter).exec();
            if (existing) {
                existing.markedAs = params.markedAs;
                existing.markedById = params.markedById;
                existing.markedByUsername = params.markedByUsername;
                existing.lastMarkedDate = params.markedDate;
                existing.createdDate = new Date();
                existing.snapshootId = params.actualSnapshotId;
                return existing.save();
            }
        }

        log.error(`cannot upsert baseline: ${err instanceof Error ? err.message : String(err)}`, logOpts);
        throw err;
    }
}

const extractSnapshotId = (snapshot: unknown): string | undefined => {
    if (!snapshot) return undefined;
    if (typeof snapshot === 'string') return snapshot;
    if (typeof snapshot === 'object') {
        const snapshotObj = snapshot as { _id?: unknown, id?: unknown, toString?: () => string };
        if (snapshotObj._id) return String(snapshotObj._id);
        if (snapshotObj.id) return String(snapshotObj.id);
        if (typeof snapshotObj.toString === 'function') return snapshotObj.toString();
    }
    return undefined;
};

const unwrapIdentValue = (
    value: unknown,
    visited: WeakSet<object> = new WeakSet(),
): unknown => {
    if (!value) return undefined;
    if (typeof value !== 'object') return value;
    if (value instanceof Types.ObjectId || (value as { _bsontype?: string })?._bsontype === 'ObjectID') {
        return value;
    }
    const obj = value as { _id?: unknown, id?: unknown };
    if (visited.has(obj)) return undefined;
    visited.add(obj);

    if (obj._id && obj._id !== value) {
        return unwrapIdentValue(obj._id, visited);
    }
    if (obj.id && obj.id !== value) {
        return unwrapIdentValue(obj.id, visited);
    }
    return value;
};

const extractIdentValueAsString = (value: unknown): string => {
    const unwrapped = unwrapIdentValue(value);
    if (!unwrapped) return '';
    if (typeof unwrapped === 'string') return unwrapped;
    if (unwrapped instanceof Types.ObjectId || (unwrapped as { _bsontype?: string })?._bsontype === 'ObjectID') {
        return unwrapped.toString();
    }
    return String(unwrapped);
};

const normalizeIdentValueForQuery = (field: string, value: unknown): unknown => {
    if (value === undefined || value === null) return undefined;
    const unwrapped = unwrapIdentValue(value);
    if (field === 'app') {
        if (unwrapped instanceof Types.ObjectId || (unwrapped as { _bsontype?: string })?._bsontype === 'ObjectID') {
            return unwrapped;
        }
        const strValue = extractIdentValueAsString(unwrapped);
        if (!strValue) return undefined;
        return Types.ObjectId.isValid(strValue) ? new Types.ObjectId(strValue) : strValue;
    }
    return extractIdentValueAsString(unwrapped);
};

const enrichChecksWithCurrentAcceptance = async (
    checks: Array<CheckDocument | Record<string, unknown>>,
): Promise<Record<string, unknown>[]> => {
    if (!checks || checks.length === 0) return [];

    const plainChecks = checks.map((check) => (
        (check && typeof (check as CheckDocument).toJSON === 'function')
            ? (check as CheckDocument).toJSON()
            : { ...(check as Record<string, unknown>) }
    ));

    // Get unique combinations of ident fields to query baselines
    const identFields = ['name', 'viewport', 'browserName', 'os', 'app', 'branch'];
    const baselineQueries: Record<string, unknown>[] = [];
    const checksByIdentKey = new Map<string, Record<string, unknown>[]>();

    plainChecks.forEach((check) => {
        const identKey = identFields.map((field) => extractIdentValueAsString(check?.[field])).join('|');

        if (!checksByIdentKey.has(identKey)) {
            checksByIdentKey.set(identKey, []);

            // Build query for this ident combination
            const query: Record<string, unknown> = {};
            identFields.forEach((field) => {
                const normalized = normalizeIdentValueForQuery(field, check?.[field]);
                if (normalized !== undefined) query[field] = normalized;
            });

            // Only add query if we have all required fields
            const hasAllFields = identFields.every((field) => query[field] !== undefined);
            if (hasAllFields) {
                baselineQueries.push(query);
            } else {
                log.warn(`Check ${check._id} missing required ident fields. Has: ${Object.keys(query).join(', ')}`, {
                    scope: 'enrichChecksWithCurrentAcceptance',
                });
            }
        }

        checksByIdentKey.get(identKey)?.push(check);
    });

    // Fetch the latest baseline for each unique ident combination
    const baselinesMap = new Map<string, Record<string, unknown>>();

    if (baselineQueries.length > 0) {
        for (const query of baselineQueries) {
            const baseline = await Baseline.findOne(query)
                .sort({ createdDate: -1 })
                .select('snapshootId name viewport browserName os app branch')
                .lean();

            if (baseline) {
                const baselineObj = baseline as unknown as Record<string, unknown>;
                const identKey = identFields.map((field) => extractIdentValueAsString(baselineObj?.[field])).join('|');
                baselinesMap.set(identKey, baselineObj);
                log.debug(`[enrichChecks] Found baseline for identKey=${identKey}, snapshootId=${baselineObj.snapshootId}`, {
                    scope: 'enrichChecksWithCurrentAcceptance',
                });
            } else {
                const identKey = identFields.map((field) => extractIdentValueAsString((query as Record<string, unknown>)?.[field])).join('|');
                log.debug(`[enrichChecks] No baseline found for identKey=${identKey}, query=${JSON.stringify(query)}`, {
                    scope: 'enrichChecksWithCurrentAcceptance',
                });
            }
        }
    }

    // Enrich checks with acceptance flags
    return plainChecks.map((check) => {
        const identKey = identFields.map((field) => extractIdentValueAsString(check?.[field])).join('|');
        const baseline = baselinesMap.get(identKey);
        const actualSnapshotId = extractSnapshotId(check?.actualSnapshotId);
        const baselineSnapshotId = baseline ? extractSnapshotId(baseline.snapshootId) : undefined;
        const checkBaselineSnapshotId = extractSnapshotId(check?.baselineId);

        const matchesOwnBaseline = Boolean(
            actualSnapshotId
            && checkBaselineSnapshotId
            && actualSnapshotId === checkBaselineSnapshotId,
        );
        const matchesLatestBaseline = Boolean(
            actualSnapshotId
            && baselineSnapshotId
            && actualSnapshotId === baselineSnapshotId,
        );

        const isCurrentlyAccepted = Boolean(
            check?.markedAs === 'accepted'
            && (matchesOwnBaseline || matchesLatestBaseline),
        );

        const hasKnownBaseline = Boolean(checkBaselineSnapshotId || baselineSnapshotId);

        const wasAcceptedEarlier = Boolean(
            check?.markedAs === 'accepted'
            && hasKnownBaseline
            && !isCurrentlyAccepted,
        );

        // Debug logging
        if (check?.markedAs === 'accepted') {
            log.debug(`[enrichChecks] Check ${check._id}: actualSnapshot=${actualSnapshotId}, baselineSnapshot=${baselineSnapshotId}, checkBaselineSnapshot=${checkBaselineSnapshotId}, isCurrentlyAccepted=${isCurrentlyAccepted}, wasAcceptedEarlier=${wasAcceptedEarlier}, hasBaseline=${Boolean(baseline)}`, {
                scope: 'enrichChecksWithCurrentAcceptance',
            });
        }

        return {
            ...check,
            isCurrentlyAccepted,
            wasAcceptedEarlier,
        };
    });
};

const accept = async (
    id: string,
    baselineId: string,
    user: RequestUser,
): Promise<Record<string, unknown>> => {
    const logOpts = {
        msgType: 'ACCEPT',
        itemType: 'check',
        ref: id,
        user: user?.username,
        scope: 'accept',
    };
    log.debug(`accept check: ${id}`, logOpts);
    const check = await Check.findById(id).exec();
    if (!check) throw new Error(`cannot find check with id: ${id}`);
    const test = await Test.findById(check.test).exec();
    if (!test) throw new Error(`cannot find test with id: ${check.test}`);
    check.markedById = user._id;
    check.markedByUsername = user.username;
    check.markedDate = new Date();
    check.markedAs = 'accepted';
    check.status = (check.status[0] === 'new') ? ['new'] : ['passed'];
    // check.status = ['passed'];
    check.updatedDate = new Date();

    if (baselineId) {
        check.baselineId = new Types.ObjectId(baselineId);
    }

    log.debug(`update check with options: '${JSON.stringify(check.toObject())}'`, logOpts);
    await createNewBaseline(check.toObject());
    await check.save();

    const testCalculatedStatus = await calculateTestStatus(String(check.test));
    const testCalculatedAcceptedStatus = await calculateAcceptedStatus(check.test);

    test.status = testCalculatedStatus;
    test.markedAs = testCalculatedAcceptedStatus;
    test.updatedDate = new Date();

    await Suite.findByIdAndUpdate(check.suite, { updatedDate: Date.now() });
    log.debug(`update test with status: '${testCalculatedStatus}', marked: '${testCalculatedAcceptedStatus}'`, logOpts, {
        msgType: 'UPDATE',
        itemType: 'test',
        ref: test._id,
    });
    await test.save();
    await check.save();
    log.debug(`check with id: '${id}' was updated`, logOpts);
    const [enrichedCheck] = await enrichChecksWithCurrentAcceptance([check]);
    return enrichedCheck;
};

async function removeCheck(id: string, user: RequestUser): Promise<CheckDocument> {
    const logMeta = {
        scope: 'removeCheck',
        itemType: 'check',
        ref: id,
        msgType: 'REMOVE',
        user: user?.username,
    };

    try {
        const check = (await Check.findByIdAndDelete(id).exec()) as unknown as CheckDocument;
        if (!check) throw new Error(`cannot find check with id: ${id}`);

        log.debug(`check with id: '${id}' was removed, update test: ${check.test}`, logMeta);

        const test = await Test.findById(check.test).exec();
        if (!test) throw new Error(`cannot find test with id: ${check.test}`);

        const testCalculatedStatus = await calculateTestStatus(String(check.test));
        const testCalculatedAcceptedStatus = await calculateAcceptedStatus(check.test);
        test.status = testCalculatedStatus;
        test.markedAs = testCalculatedAcceptedStatus;
        test.updatedDate = new Date();
        await orm.updateItemDate('VRSSuite', check.suite);
        await test.save();

        if (check.baselineId && String(check.baselineId) !== 'undefined') {
            log.debug(`try to remove the snapshot, baseline: ${check.baselineId}`, logMeta);
            await snapshotService.remove(check.baselineId.toString());
        }

        if (check.actualSnapshotId && String(check.baselineId) !== 'undefined') {
            log.debug(`try to remove the snapshot, actual: ${check.actualSnapshotId}`, logMeta);
            await snapshotService.remove(check.actualSnapshotId.toString());
        }

        if (check.diffId && String(check.baselineId) !== 'undefined') {
            log.debug(`try to remove snapshot, diff: ${check.diffId}`, logMeta);
            await snapshotService.remove(check.diffId.toString());
        }
        return check;
    } catch (e: unknown) {
        const errMsg = `cannot remove a check with id: '${id}', error: '${e instanceof Error ? e.stack : String(e)}'`;
        log.error(errMsg, logMeta);
        throw new Error(errMsg);
    }
}

const remove = async (id: string, user: RequestUser): Promise<CheckDocument> => {
    const logOpts = {
        scope: 'removeCheck',
        itemType: 'check',
        ref: id,
        user: user?.username,
        msgType: 'REMOVE',
    };
    log.info(`remove check with, id: '${id}', user: '${user.username}'`, logOpts);
    return removeCheck(id, user);
};

const update = async (id: string, opts: Partial<CheckDocument>, user: string): Promise<CheckDocument> => {
    const logMeta: LogOpts = {
        msgType: 'UPDATE',
        itemType: 'check',
        ref: id,
        user,
        scope: 'updateCheck',
    };
    log.debug(`update check with id '${id}' with params '${JSON.stringify(opts, null, 2)}'`, logMeta);

    const check = await Check.findOneAndUpdate({ _id: id }, opts, { new: true }).exec();
    if (!check) throw new Error(`cannot find check with id: ${id}`);

    const test = await Test.findOne({ _id: check.test }).exec();
    if (!test) throw new Error(`cannot find test with id: ${check.test}`);

    test.status = await calculateTestStatus(String(check.test));

    await orm.updateItemDate('VRSCheck', check);
    await orm.updateItemDate('VRSTest', test);
    await test.save();
    await check.save();
    return check;
};

const createCheckDocument = async (checkParams: any, session?: any): Promise<CheckDocument> => {
    const [check] = await Check.create([checkParams], { session });
    return check;
};

export {
    accept,
    remove,
    update,
    enrichChecksWithCurrentAcceptance,
    createCheckDocument,
};
