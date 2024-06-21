import {
    Check,
    Test,
    Suite,
    Baseline,
    CheckDocument,
} from '@models';

import { calculateAcceptedStatus, buildIdentObject } from '@utils';
import * as snapshotService from './snapshot.service';
import * as orm from '@lib/dbItems';
import log from '@lib/logger';
import { BaselineDocument } from '@models/Baseline.model';
import { Schema } from 'mongoose';
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
    name: { [key: string]: string | boolean | number };
    app: string;
    branch?: string;
    browserName?: string;
    browserVersion?: string;
    browserFullVersion?: string;
    viewport?: string;
    os?: string;
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

    const lastBaseline = await Baseline.findOne(identFields).exec();
    const sameBaseline = await Baseline.findOne({ ...identFields, snapshootId: params.actualSnapshotId }).exec();

    const baselineParams = lastBaseline?.ignoreRegions
        ? { ...identFields, ignoreRegions: lastBaseline.ignoreRegions }
        : identFields;

    if (sameBaseline) {
        log.debug(`the baseline with same ident and snapshot id: ${params.actualSnapshotId} already exist`, logOpts);
    } else {
        log.debug(`the baseline with same ident and snapshot id: ${params.actualSnapshotId} does not exist,
         create new one, baselineParams: ${JSON.stringify(baselineParams)}`, logOpts);
    }

    log.silly({ sameBaseline });

    const resultedBaseline: BaselineDocument = sameBaseline || await Baseline.create(baselineParams);

    resultedBaseline.markedAs = params.markedAs;
    resultedBaseline.markedById = params.markedById //? new Schema.Types.ObjectId(String(params.markedById)) : undefined;
    resultedBaseline.markedByUsername = params.markedByUsername;
    resultedBaseline.lastMarkedDate = params.markedDate;
    resultedBaseline.createdDate = new Date();
    resultedBaseline.snapshootId = params.actualSnapshotId //? new Schema.Types.ObjectId(String(params.actualSnapshotId)) : undefined;

    return resultedBaseline.save();
}

const accept = async (id: string, baselineId: string, user: RequestUser): Promise<CheckDocument> => {
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
    check.updatedDate = new Date();

    check.baselineId = baselineId as unknown as Schema.Types.ObjectId;

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
    return check;
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

export {
    accept,
    remove,
    update,
};
