/* eslint-disable @typescript-eslint/no-explicit-any */

import { User } from '../../models';
import testUsers from '../../../seeds/testUsers.json';
import log from "../logger";

const fileLogMeta = {
    scope: 'on_start',
    msgType: 'SETUP',
};

export async function createTestsUsers(): Promise<void> {
    log.debug('creating tests users', fileLogMeta);
    try {
        await User.insertMany(testUsers);
    } catch (e) {
        console.warn(e);
    }
}
