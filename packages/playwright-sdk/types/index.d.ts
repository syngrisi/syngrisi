import { Browser, Page } from '@playwright/test'
import { ViewportSize } from 'playwright-core'

export type BrowserName = 'chromium' | 'firefox' | 'webkit';

export interface PW {
    page: Page
    browser: Browser
    browserName: BrowserName
    viewport: ViewportSize
}

export interface Config {
    pw: PW
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
    checkName?: string
    viewport?: string;
    browserName?: string,
    os?: string,
    browserVersion?: string,
    browserFullVersion?: string,
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

interface TestParams {
    os?: string;
    viewport?: string;
    browser?: string;
    browserVersion?: string;
    name?: string;
    app?: string;
    run?: string;
    branch?: string;
    runident?: string;
    suite?: string;
    tags?: string[];
    browserFullVersion?: string;
    testId?: string | undefined;
}

interface Params {
    suite?: string;
    test: TestParams; // 'test' seems to be an object based on how it's used in startTestSession
}
