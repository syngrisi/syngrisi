// import { MetaData } from "../server/lib/logger";

// // export interface LogOpts {
// //     scope: string;
// //     user?: string;
// //     itemType?: string;
// //     msgType: string;
// //     ref?: string;
// //   }

//   export type LogOpts = MetaData

  export interface LogOpts {
    [key: string]: unknown;
    user?: string;
    ref?: string;
    msgType?: string;
    itemType?: string;
    scope?: string;
}