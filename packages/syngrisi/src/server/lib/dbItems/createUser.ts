/* eslint-disable @typescript-eslint/no-explicit-any */

import { createItemProm } from './createItemProm';

export async function createUser(params: any): Promise<any> {
    return createItemProm('VRSUser', params).catch((e) => Promise.reject(e));
}
