export interface Config {
    url: string
    apiKey: string
}

export interface SessionParams {
    run: string;
    runident: string;
    test: string;
    branch: string;
    app: string;
    suite?: string;
    os?: string;
    viewport?: string;
    browserName?: string;
    browserVersion?: string;
    browserFullVersion?: string;
    tags?: string[];

    [key: string]: string | string[] | undefined;
}

export interface ApiSessionParams {
    run: string;
    suite: string;
    runident: string;
    tags?: string[];
    branch?: string;
    name: string;
    // status: string;
    viewport: string;
    browserName: string;
    browserVersion: string;
    os: string;
    app: string;
    [key: string]: string | string[] | undefined;
}

export interface CheckParams {
    testId: string;
    suite: string;
    browser: string;
    browserVersion: string;
    browserFullVersion: string;
    os: string;
    app: string;
    branch: string;
    viewport?: string;
}

export interface CheckOptions {
    testId: string;
    suite: string;
    name: string;
    viewport: string;
    hashCode: string;
    domDump: any;
    browserName: string;
    browserVersion: string;
    browserFullVersion: string;
    os: string;
    app: string;
    branch: string;
}

export interface CheckResult {
    name: string;
    test: string;
    suite: string;
    app: string;
    branch: string;
    baselineId: string;
    actualSnapshotId: string;
    updatedDate: string;
    status: string[];
    browserName: string;
    browserVersion: string;
    browserFullVersion: string;
    viewport: string;
    os: string;
    result: {
        isSameDimensions: boolean;
        dimensionDifference: {
            width: number;
            height: number;
        };
        rawMisMatchPercentage: number;
        misMatchPercentage: string;
        analysisTime: number;
        executionTotalTime: string;
        totalCheckHandleTime: string;
    };
    run: string;
    markedAs: string;
    markedDate: string;
    markedByUsername: string;
    creatorId: string;
    creatorUsername: string;
    failReasons: string[];
    _id: string;
    createdDate: string;
    __v: number;
    currentSnapshot: {
        name: string;
        filename: string;
        imghash: string;
        _id: string;
        createdDate: string;
        id: string;
    };
    lastSuccess: string;
}
