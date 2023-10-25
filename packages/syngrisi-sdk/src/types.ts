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
}

// interface API {
//     getIdent(apikey: string): Promise<string>;
//     startSession(sessionParams: SessionParams, apikey: string): Promise<RespJson>;
// }

export interface ApiSessionParams {
    run: string;
    suite: string;
    runident: string;
    tags?: string[];
    branch?: string;
    name: string;
    status: string;
    viewport: string;
    browserName: string;
    browserVersion: string;
    os: string;
    app: string;
}

// interface RespJson {
//     _id: string;
// }
//
// interface WDIODriver {
//     static getOS(): Promise<string>;
//     static getViewport(): Promise<string>;
//     static getBrowserName(): Promise<string>;
//     static getBrowserVersion(): Promise<string>;
//     static getBrowserFullVersion(): Promise<string>;
// }
//
// interface Log {
//     error(message: string): void;
// }
