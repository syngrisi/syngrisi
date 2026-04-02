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

type SeedUser = {
    username: string;
    role: string;
    firstName: string;
    lastName: string;
    salt?: string;
    password?: string;
    apiKey?: string;
    apikey?: string;
};

const buildUserInsertPayload = (userData: SeedUser) => ({
    username: userData.username,
    role: userData.role,
    firstName: userData.firstName,
    lastName: userData.lastName,
    provider: 'local',
    authSource: 'local',
    salt: userData.salt,
    password: userData.password,
    apiKey: userData.apiKey || userData.apikey,
});

export async function createBasicUsers(): Promise<void> {
    const createdUsers: Array<{ username: string; apiKey?: string }> = [];

    const adminInsert = buildUserInsertPayload(adminData);
    const adminResult = await User.updateOne(
        { username: 'Administrator' },
        { $setOnInsert: adminInsert },
        { upsert: true }
    );
    if (adminResult.upsertedCount > 0) {
        log.info('create the default Administrator', logOpts);
        createdUsers.push({ username: 'Administrator', apiKey: adminInsert.apiKey });
        log.info('administrator was created', logOpts);
    }

    const guestInsert = buildUserInsertPayload(guestData);
    const guestResult = await ensureGuestUserExists();
    if (guestResult.upsertedCount > 0) {
        log.info('create the default Guest', logOpts);
        createdUsers.push({ username: 'Guest', apiKey: guestInsert.apiKey });
        log.info('guest was created', logOpts);
    }

    // Wait for created users to be indexed in MongoDB (prevents 401 race condition)
    // Run checks in parallel for all users instead of sequentially
    if (createdUsers.length > 0) {
        log.info(`Waiting for ${createdUsers.length} basic users to be indexed...`, logOpts);
        const indexingResults = await Promise.all(
            createdUsers.map(async (user) => {
                const indexed = await waitForCondition(
                    async () => {
                        const found = await User.findOne({ username: user.username });
                        return !!found;
                    },
                    10000, // 10 second timeout (increased from 2s to prevent race conditions)
                    25    // check every 25ms (faster polling)
                );
                if (!indexed) {
                    log.error(`✗ User ${user.username} not indexed after 2s`, logOpts);
                }
                return { username: user.username, indexed };
            })
        );
        const allIndexed = indexingResults.every(r => r.indexed);
        log.info(`✓ All basic users indexed: ${allIndexed}`, logOpts);
    }

    // Verify users exist after creation
    const adminCheck = await User.findOne({ username: 'Administrator' }).exec();
    const guestCheck = await User.findOne({ username: 'Guest' }).exec();
    log.info(`✓ Basic users verified - Administrator: ${!!adminCheck}, Guest: ${!!guestCheck}`, logOpts);
}

export async function ensureGuestUserExists() {
    const guestInsert = buildUserInsertPayload(guestData);

    return User.updateOne(
        { username: 'Guest' },
        { $setOnInsert: guestInsert },
        { upsert: true }
    );
}
