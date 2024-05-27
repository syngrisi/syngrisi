/* eslint-disable @typescript-eslint/no-explicit-any */

import { User } from '../../models';
import testUsers from '../../../seeds/testUsers.json';
import log2 from "../../lib/logger2";

const fileLogMeta = {
    scope: 'on_start',
    msgType: 'SETUP',
};

export async function createTestsUsers(): Promise<void> {
    log2.debug('creating tests users', fileLogMeta);
    try {
        await User.insertMany(testUsers);
    } catch (e) {
        console.warn(e);
    }
}
