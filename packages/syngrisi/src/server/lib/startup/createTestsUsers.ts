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

export async function createTestsUsers(): Promise<void> {
    log.debug('creating tests users', logOpts);
    try {
        const createdApiKeys: string[] = [];

        for (const userData of testUsers) {
            const existingUser = await User.findOne({ username: userData.username });
            if (!existingUser) {
                const newUser = new User({
                    username: userData.username,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    role: userData.role,
                    apiKey: userData.apiKey,
                });

                // Use the plain text password from the JSON if available, or default to 'Test-123'
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const password = (userData as any).PASSWORD_ || 'Test-123';
                await newUser.setPassword(password);
                await newUser.save();
                log.info(`Created user: ${newUser.username} with role: ${newUser.role}`, logOpts);
                createdApiKeys.push(userData.apiKey);

                // Verify password was set correctly by trying to authenticate immediately
                try {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const verified = await (newUser as any).authenticate(password);
                    if (verified) {
                        log.info(`✓ Password verified for ${newUser.username}`, logOpts);
                    } else {
                        log.error(`✗ Password verification FAILED for ${newUser.username}`, logOpts);
                    }
                } catch (verifyErr) {
                    log.error(`✗ Password verification ERROR for ${newUser.username}: ${verifyErr}`, logOpts);
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
