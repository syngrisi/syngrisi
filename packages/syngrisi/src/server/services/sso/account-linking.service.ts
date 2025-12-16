/**
 * Account Linking Service
 *
 * Handles explicit account linking between local users and SSO providers.
 * Provides secure methods for linking/unlinking accounts.
 */

import log from '@logger';
import { User } from '../../models';
import { ssoEvents } from './events';
import { env } from '../../envConfig';
import type { SSOProviderType, AccountLinkRequest, AccountLinkResult } from './types';
import { LogOpts } from '@types';

const logMeta: LogOpts = { scope: 'account-linking', msgType: 'SSO' };

class AccountLinkingService {
    private static instance: AccountLinkingService;

    private constructor() {}

    static getInstance(): AccountLinkingService {
        if (!AccountLinkingService.instance) {
            AccountLinkingService.instance = new AccountLinkingService();
        }
        return AccountLinkingService.instance;
    }

    /**
     * Check if account linking is allowed by configuration
     */
    isLinkingAllowed(): boolean {
        return env.SSO_ALLOW_ACCOUNT_LINKING;
    }

    /**
     * Link an existing local account to an SSO provider
     *
     * This requires explicit user action (not automatic on login)
     */
    async linkAccount(request: AccountLinkRequest): Promise<AccountLinkResult> {
        const { userId, provider, providerId, email } = request;

        if (!this.isLinkingAllowed()) {
            log.warn('Account linking is disabled', { ...logMeta, userId, provider });
            return {
                success: false,
                message: 'Account linking is disabled by configuration',
            };
        }

        try {
            // Find the user
            const user = await User.findById(userId);
            if (!user) {
                return {
                    success: false,
                    message: 'User not found',
                };
            }

            // Check if user is local
            if (user.provider !== 'local') {
                return {
                    success: false,
                    message: `Account is already linked to ${user.provider}`,
                };
            }

            // Check if providerId is already used by another user
            const existingUser = await User.findOne({ providerId, provider }) as any;
            if (existingUser && String(existingUser._id) !== userId) {
                return {
                    success: false,
                    message: 'This SSO account is already linked to another user',
                };
            }

            // Link the account
            user.provider = provider;
            user.providerId = providerId;
            await user.save();

            // Emit event
            ssoEvents.emitAccountLinked(userId, email, provider);

            log.info('Account linked successfully', {
                ...logMeta,
                userId,
                provider,
                email,
            });

            return {
                success: true,
                message: 'Account linked successfully',
                user,
            };
        } catch (error) {
            log.error('Error linking account', { ...logMeta, error, userId, provider });
            ssoEvents.emitError(error as Error, email, provider);
            return {
                success: false,
                message: 'Error linking account',
            };
        }
    }

    /**
     * Unlink an SSO account and revert to local authentication
     *
     * This requires the user to have a valid password set
     */
    async unlinkAccount(userId: string): Promise<AccountLinkResult> {
        try {
            const user = await User.findById(userId);
            if (!user) {
                return {
                    success: false,
                    message: 'User not found',
                };
            }

            if (user.provider === 'local') {
                return {
                    success: false,
                    message: 'Account is not linked to any SSO provider',
                };
            }

            const previousProvider = user.provider;
            const email = user.username;

            // Unlink the account
            user.provider = 'local';
            user.providerId = undefined;
            await user.save();

            // Emit event
            ssoEvents.emitAccountUnlinked(userId, email, previousProvider as SSOProviderType);

            log.info('Account unlinked successfully', {
                ...logMeta,
                userId,
                previousProvider,
                email,
            });

            return {
                success: true,
                message: 'Account unlinked successfully',
                user,
            };
        } catch (error) {
            log.error('Error unlinking account', { ...logMeta, error, userId });
            return {
                success: false,
                message: 'Error unlinking account',
            };
        }
    }

    /**
     * Find user by SSO provider credentials
     */
    async findByProvider(provider: SSOProviderType, providerId: string): Promise<any | null> {
        return User.findOne({ provider, providerId });
    }

    /**
     * Find user by email
     */
    async findByEmail(email: string): Promise<any | null> {
        return User.findOne({ username: email });
    }

    /**
     * Check if a user can be auto-linked during SSO login
     *
     * This is the implicit linking during first SSO login.
     * Only allowed if:
     * 1. SSO_ALLOW_ACCOUNT_LINKING is true
     * 2. User exists with the same email
     * 3. User is currently a local account
     */
    async canAutoLink(email: string, provider: SSOProviderType): Promise<{ canLink: boolean; user?: any; reason?: string }> {
        if (!this.isLinkingAllowed()) {
            return {
                canLink: false,
                reason: 'Account linking is disabled',
            };
        }

        const user = await this.findByEmail(email);
        if (!user) {
            return {
                canLink: false,
                reason: 'No existing user found',
            };
        }

        if (user.provider !== 'local') {
            return {
                canLink: false,
                user,
                reason: `User is already linked to ${user.provider}`,
            };
        }

        return {
            canLink: true,
            user,
        };
    }

    /**
     * Perform auto-linking during SSO login
     *
     * This is called during SSO authentication when a local user
     * with matching email is found.
     */
    async autoLink(user: any, provider: SSOProviderType, providerId: string): Promise<AccountLinkResult> {
        if (!this.isLinkingAllowed()) {
            return {
                success: false,
                message: 'Account linking is disabled',
            };
        }

        if (user.provider !== 'local') {
            return {
                success: false,
                message: `User is already linked to ${user.provider}`,
            };
        }

        try {
            user.provider = provider;
            user.providerId = providerId;
            await user.save();

            ssoEvents.emitAccountLinked(user._id.toString(), user.username, provider);

            log.info('Account auto-linked during SSO login', {
                ...logMeta,
                userId: user._id.toString(),
                provider,
                email: user.username,
            });

            return {
                success: true,
                message: 'Account auto-linked successfully',
                user,
            };
        } catch (error) {
            log.error('Error auto-linking account', { ...logMeta, error });
            return {
                success: false,
                message: 'Error auto-linking account',
            };
        }
    }
}

export const accountLinkingService = AccountLinkingService.getInstance();
export { AccountLinkingService };
