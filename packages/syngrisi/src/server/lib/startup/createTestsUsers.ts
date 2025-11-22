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

        const users = await User.find({});
        log.info(`Total users in DB: ${users.length}`, logOpts);
    } catch (e) {
        console.warn(e);
        log.error(`Failed to create test users: ${e}`, logOpts);
    }
}
