/* eslint-disable no-underscore-dangle */
import { User } from '@models';
import adminData from '../../../seeds/admin.json';
import guestData from '../../../seeds/guest.json';
import log from "@logger";

const logOpts = {
    scope: 'on_start',
    msgType: 'SETUP',
};

// Helper function to wait for a condition with timeout
async function waitForCondition(
    condition: () => Promise<boolean>,
    timeoutMs: number,
    intervalMs: number = 100
): Promise<boolean> {
    const startTime = Date.now();
    while (Date.now() - startTime < timeoutMs) {
        if (await condition()) {
            return true;
        }
        await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
    return false;
}

export async function createBasicUsers(): Promise<void> {
    const defAdmin = await User.findOne({ username: 'Administrator' }).exec();
    const defGuest = await User.findOne({ username: 'Guest' }).exec();

    const createdUsers: Array<{ username: string; apiKey?: string }> = [];

    if (!defAdmin) {
        log.info('create the default Administrator', logOpts);
        const admin = new User(adminData);
        await admin.setPassword(process.env.ADMIN_PASSWORD || 'Administrator');
        await admin.save();
        log.info(`administrator with id: '${admin._id}' was created`, logOpts);
        createdUsers.push({ username: 'Administrator', apiKey: admin.apiKey });
    }
    if (!defGuest) {
        log.info('create the default Guest', logOpts);
        const guest = new User(guestData);
        await guest.setPassword(process.env.GUEST_PASSWORD || 'Guest');
        await guest.save();
        log.info(`guest with id: '${guest._id}' was created`, logOpts);
        createdUsers.push({ username: 'Guest', apiKey: guest.apiKey });
    }

    // Wait for created users to be indexed in MongoDB (prevents 401 race condition)
    if (createdUsers.length > 0) {
        log.info(`Waiting for ${createdUsers.length} basic users to be indexed...`, logOpts);
        for (const user of createdUsers) {
            const indexed = await waitForCondition(
                async () => {
                    const found = await User.findOne({ username: user.username });
                    return !!found;
                },
                5000, // 5 second timeout per user
                50    // check every 50ms
            );
            if (!indexed) {
                log.error(`✗ User ${user.username} not indexed after 5s`, logOpts);
            }
        }
        log.info(`✓ All basic users indexed`, logOpts);
    }

    // Verify users exist after creation
    const adminCheck = await User.findOne({ username: 'Administrator' }).exec();
    const guestCheck = await User.findOne({ username: 'Guest' }).exec();
    log.info(`✓ Basic users verified - Administrator: ${!!adminCheck}, Guest: ${!!guestCheck}`, logOpts);
}
