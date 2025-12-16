export interface Config {
    url: string
    apiKey: string
    /** When true, automatically accept all new checks (status='new') as baseline */
    autoAccept?: boolean
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
    checkName?: string
    viewport?: string;
    browserName?: string,
    os?: string,
    browserVersion?: string,
    browserFullVersion?: string,
    /** When true, automatically accept new checks (status='new') as baseline */
    autoAccept?: boolean,
    /** Skip sending DOM data even if collected. Useful for tests that don't need RCA. */
    skipDomData?: boolean,
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

