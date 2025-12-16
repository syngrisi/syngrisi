import { User } from '@models';
import testUsers from '../../../seeds/testUsers.json';
import log from "@logger";

const logOpts = {
    scope: 'on_start',
    msgType: 'SETUP',
};

export async function createTestsUsers(): Promise<void> {
    log.debug('creating tests users', logOpts);
    try {
        await User.insertMany(testUsers);
    } catch (e) {
        console.warn(e);
    }
}
