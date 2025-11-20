import fs, { promises as fsp } from 'fs';
import path from 'path';
import { hashSync } from 'hasha';
import httpStatus from 'http-status';
import { Snapshot } from '@models';
import { SnapshotDocument } from '@models/Snapshot.model';
import { ApiError } from '@utils';
import { config } from '@config';
import log from '@logger';
import { LogOpts } from '@types';
import { UploadedFile } from 'express-fileupload';

export interface CreateSnapshotParameters {
    name: string;
    fileData: Buffer | null;
    hashCode?: string;
}

export interface SnapshotRequestPayload {
    name?: string;
    hashCode?: string;
    files?: { file: UploadedFile };
}

const snapshotExists = async (hash?: string): Promise<SnapshotDocument | null> => {
    if (!hash) return null;
    return Snapshot.findOne({ imghash: hash });
};

export async function createSnapshot(parameters: CreateSnapshotParameters) {
    const logOpts: LogOpts = {
        scope: 'createSnapshot',
        itemType: 'snapshot',
        msgType: 'CREATE'
    };

    const { name, fileData, hashCode } = parameters;

    const opts: Partial<SnapshotDocument> = { name };

    if (fileData === null) {
        throw new ApiError(httpStatus.BAD_REQUEST, `cannot create the snapshot, the 'fileData' is not set, name: '${name}'`);
    }


    opts.imghash = hashCode || hashSync(fileData);
    const snapshot = new Snapshot(opts);
    const filename = `${snapshot.id}.png`;
    const imagePath = path.join(config.defaultImagesPath, filename);
    log.debug(`save screenshot for: '${name}' snapshot to: '${imagePath}'`, logOpts);
    await fsp.writeFile(imagePath, fileData);
    snapshot.filename = filename;
    await snapshot.save();
    log.debug(`snapshot was saved: '${JSON.stringify(snapshot)}'`, { ...logOpts, ...{ ref: snapshot._id } });
    return snapshot;
}

export async function cloneSnapshot(sourceSnapshot: SnapshotDocument, name: string) {
    const { filename } = sourceSnapshot;
    const hashCode = sourceSnapshot.imghash;
    const newSnapshot = new Snapshot({ name, filename, imghash: hashCode });
    await newSnapshot.save();
    return newSnapshot;
}

export async function isNeedFiles(
    checkParam: SnapshotRequestPayload,
    logOpts: LogOpts
): Promise<{ needFilesStatus: boolean; snapshotFoundedByHashcode: SnapshotDocument | null; }> {
    const snapshotFoundedByHashcode = await snapshotExists(checkParam.hashCode);

    if (!checkParam.hashCode && !checkParam.files) {
        log.debug('hashCode or files parameters should be present', logOpts);
        return { needFilesStatus: true, snapshotFoundedByHashcode };
    }

    if (!checkParam.files && !snapshotFoundedByHashcode) {
        log.debug(`cannot find the snapshot with hash: '${checkParam.hashCode}'`, logOpts);
        return { needFilesStatus: true, snapshotFoundedByHashcode };
    }
    return { needFilesStatus: false, snapshotFoundedByHashcode };
}

export async function prepareActualSnapshot(
    checkParam: SnapshotRequestPayload,
    snapshotFoundedByHashcode: SnapshotDocument | null,
    logOpts: LogOpts
): Promise<SnapshotDocument> {
    let currentSnapshot: SnapshotDocument;
    const fileData = checkParam.files ? checkParam.files.file.data : null;

    if (snapshotFoundedByHashcode) {
        const fullFilename = path.join(config.defaultImagesPath, snapshotFoundedByHashcode.filename);
        if (!fs.existsSync(fullFilename)) {
            throw new Error(`Couldn't find the baseline file: '${fullFilename}'`);
        }

        log.debug(`snapshot with such hashcode: '${checkParam.hashCode}' is already exists, will clone it`, logOpts);

        if (!checkParam.name) throw new ApiError(httpStatus.BAD_REQUEST, `Cannot prepareActualSnapshot name is empty, hashe: ${checkParam.hashCode}`);
        currentSnapshot = await cloneSnapshot(snapshotFoundedByHashcode, checkParam.name);
    } else {
        log.debug(`snapshot with such hashcode: '${checkParam.hashCode}' does not exists, will create it`, logOpts);
        currentSnapshot = await createSnapshot({ name: checkParam.name!, fileData, hashCode: checkParam.hashCode });
    }

    return currentSnapshot;
}

export async function getSnapshotByImgHash(hash?: string): Promise<SnapshotDocument | null> {
    return snapshotExists(hash);
}
