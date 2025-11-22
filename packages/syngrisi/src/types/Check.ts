import { UploadedFile } from 'express-fileupload';

export interface CreateCheckParams {
    name: string;
    status: 'new' | 'pending' | 'passed' | 'failed';
    viewport: string;
    browserName: string;
    browserVersion: string;
    browserFullVersion: string;
    os: string;
    updatedDate: number;
    suite: string;
    app: string;
    branch: string;
    domDump?: string;
    run: string;
    creatorId: string;
    creatorUsername: string;
    failReasons: string[];
    actualSnapshotId?: string
    result?: string,
    files?: { file: UploadedFile },
    hashCode: string,
    vShifting?: boolean
}

export interface CreateCheckParamsExtended {
    test: string;
    name: string;
    status: 'new' | 'pending' | 'passed' | 'failed';
    viewport: string;
    browserName: string;
    browserVersion: string;
    browserFullVersion: string;
    os: string;
    updatedDate: number;
    suite: string;
    app: string;
    branch: string;
    domDump?: string;
    run: string;
    creatorId: string;
    creatorUsername: string;
    failReasons: string[];
    actualSnapshotId?: string
    result?: string,
    files?: { file: UploadedFile },
    hashCode: string,
    vShifting?: boolean,
    baselineId?: string,
    markedAs?: string
    markedDate?: string,
    markedByUsername?: string,
}
