/* eslint-disable @typescript-eslint/no-explicit-any */

import { createItemProm } from './createItemProm';

export async function createTest(params: any): Promise<any> {
    return createItemProm('VRSTest', params);
}
