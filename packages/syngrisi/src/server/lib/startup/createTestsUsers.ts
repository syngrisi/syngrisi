import { User } from '@models';
import testUsers from '../../../seeds/testUsers.json';
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
    PASSWORD_?: string;
    API_KEY_?: string;
    username: string;
    firstName: string;
    lastName: string;
    role: string;
    password?: string;
    apiKey?: string;
    salt?: string;
    createdDate?: string | Date | null;
    updatedDate?: string | Date | null;
};

const buildUserInsertPayload = (userData: SeedUser) => ({
    username: userData.username,
    firstName: userData.firstName,
    lastName: userData.lastName,
    role: userData.role,
    provider: 'local',
    authSource: 'local',
    password: userData.password,
    apiKey: userData.apiKey,
    salt: userData.salt,
    createdDate: userData.createdDate || undefined,
    updatedDate: userData.updatedDate || undefined,
});

export async function createTestsUsers(): Promise<void> {
    log.debug('creating tests users', logOpts);
    try {
        const createdApiKeys: string[] = [];

        for (const userData of testUsers) {
            const insertPayload = buildUserInsertPayload(userData);
            const result = await User.updateOne(
                { username: userData.username },
                { $setOnInsert: insertPayload },
                { upsert: true }
            );

            if (result.upsertedCount > 0) {
                log.info(`Created user: ${userData.username} with role: ${userData.role}`, logOpts);
                if (userData.apiKey) {
                    createdApiKeys.push(userData.apiKey);
                }
            } else {
                log.debug(`User ${userData.username} already exists`, logOpts);
            }
        }

        // Wait for all created users to be findable by apiKey (ensures MongoDB indexing is complete)
        // Run checks in parallel for all users instead of sequentially
        if (createdApiKeys.length > 0) {
            log.info(`Waiting for ${createdApiKeys.length} users to be indexed by apiKey...`, logOpts);
            const indexingResults = await Promise.all(
                createdApiKeys.map(async (apiKey) => {
                    const indexed = await waitForCondition(
                        async () => {
                            const found = await User.findOne({ apiKey });
                            return !!found;
                        },
                        2000, // 2 second timeout (reduced from 5s - indexing usually takes <500ms)
                        25    // check every 25ms (faster polling)
                    );
                    if (!indexed) {
                        log.error(`✗ User with apiKey ${apiKey.substring(0, 16)}... not indexed after 2s`, logOpts);
                    }
                    return { apiKey: apiKey.substring(0, 16), indexed };
                })
            );
            const allIndexed = indexingResults.every(r => r.indexed);
            log.info(`✓ All test users indexed and findable by apiKey: ${allIndexed}`, logOpts);
        }

        const users = await User.find({});
        log.info(`Total users in DB: ${users.length}`, logOpts);
    } catch (e) {
        console.warn(e);
        log.error(`Failed to create test users: ${e}`, logOpts);
    }
}
