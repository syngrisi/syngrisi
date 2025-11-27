/**
 * SSO User Service
 *
 * Handles user creation, lookup, and profile normalization for SSO authentication.
 */

import log from '@logger';
import { User } from '../../models';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../../envConfig';
import { ssoEvents } from './events';
import { accountLinkingService } from './account-linking.service';
import type { NormalizedProfile, SSOProviderType, SSOUserResult } from './types';
import { LogOpts } from '@types';

const logMeta: LogOpts = { scope: 'sso-user-service', msgType: 'SSO' };

class SSOUserService {
    private static instance: SSOUserService;

    private constructor() {}

    static getInstance(): SSOUserService {
        if (!SSOUserService.instance) {
            SSOUserService.instance = new SSOUserService();
        }
        return SSOUserService.instance;
    }

    /**
     * Normalize profile from various SSO providers into a common format
     */
    normalizeProfile(rawProfile: any, provider: SSOProviderType): NormalizedProfile {
        // Handle different profile formats
        const email = rawProfile.emails?.[0]?.value
            || rawProfile.email
            || rawProfile.nameID;  // SAML

        const id = rawProfile.id
            || rawProfile.sub
            || rawProfile.nameID
            || rawProfile.uid;

        const givenName = rawProfile.name?.givenName
            || rawProfile.given_name
            || rawProfile.firstName
            || (rawProfile.name && typeof rawProfile.name === 'string' ? rawProfile.name.split(' ')[0] : undefined)
            || 'SSO';

        const familyName = rawProfile.name?.familyName
            || rawProfile.family_name
            || rawProfile.lastName
            || (rawProfile.name && typeof rawProfile.name === 'string' ? rawProfile.name.split(' ').slice(1).join(' ') : undefined)
            || 'User';

        return {
            id,
            email,
            emails: email ? [{ value: email }] : [],
            name: {
                givenName,
                familyName,
            },
            displayName: rawProfile.displayName || `${givenName} ${familyName}`,
            provider: provider,
            _json: rawProfile,
        };
    }

    /**
     * Process SSO user - find existing or create new
     */
    async processUser(
        profile: NormalizedProfile,
        provider: SSOProviderType,
    ): Promise<SSOUserResult> {
        const email = profile.email;
        const providerId = profile.id;
        const firstName = profile.name?.givenName || 'SSO';
        const lastName = profile.name?.familyName || 'User';

        if (!email) {
            throw new Error('No email found in SSO profile');
        }

        // 1. Find by providerId first
        let user = await accountLinkingService.findByProvider(provider, providerId);

        if (user) {
            log.info(`SSO login successful for ${email} via ${provider}`, logMeta);
            ssoEvents.emitLogin(String(user._id), email, provider);
            return {
                user,
                isNewUser: false,
                wasLinked: false,
            };
        }

        // 2. Find by email
        user = await accountLinkingService.findByEmail(email);

        if (user) {
            // Check if we can auto-link
            const linkCheck = await accountLinkingService.canAutoLink(email, provider);

            if (linkCheck.canLink) {
                const linkResult = await accountLinkingService.autoLink(user, provider, providerId);
                if (linkResult.success) {
                    ssoEvents.emitLogin(String(user._id), email, provider);
                    return {
                        user: linkResult.user,
                        isNewUser: false,
                        wasLinked: true,
                    };
                }
            }

            // If can't auto-link, update provider info if same provider type
            if (user.provider === provider) {
                user.providerId = providerId;
                await user.save();
            }

            log.info(`SSO login successful for ${email} via ${provider}`, logMeta);
            ssoEvents.emitLogin(String(user._id), email, provider);
            return {
                user,
                isNewUser: false,
                wasLinked: false,
            };
        }

        // 3. Create new user if auto-create is enabled
        if (!env.SSO_AUTO_CREATE_USERS) {
            throw new Error('User not found and auto-creation is disabled');
        }

        const defaultRole = env.SSO_DEFAULT_ROLE || 'user';
        const newUser = new User({
            username: email,
            firstName,
            lastName,
            role: defaultRole,
            provider,
            providerId,
            password: uuidv4(), // Random password (user can't login with it)
            apiKey: uuidv4(),
        });

        await newUser.save();

        const newUserId = String((newUser as any)._id);
        log.info(`SSO login successful for ${email} via ${provider} (new user created with role: ${defaultRole})`, logMeta);
        ssoEvents.emitUserCreated(newUserId, email, provider);
        ssoEvents.emitLogin(newUserId, email, provider);

        return {
            user: newUser,
            isNewUser: true,
            wasLinked: false,
        };
    }

    /**
     * Process SSO user with passport callback signature
     *
     * This is the callback signature expected by passport strategies
     */
    async processUserCallback(
        profile: any,
        provider: SSOProviderType,
        done: (error: any, user?: any) => void,
    ): Promise<void> {
        try {
            const normalizedProfile = this.normalizeProfile(profile, provider);
            const result = await this.processUser(normalizedProfile, provider);
            done(null, result.user);
        } catch (error) {
            log.error('Error processing SSO user', { ...logMeta, error });
            ssoEvents.emitError(error as Error, profile.email, provider);
            done(error);
        }
    }

    /**
     * Get user by ID
     */
    async getUserById(userId: string): Promise<any | null> {
        return User.findById(userId);
    }

    /**
     * Update user's last login timestamp
     */
    async updateLastLogin(userId: string): Promise<void> {
        try {
            await User.findByIdAndUpdate(userId, {
                lastLogin: new Date(),
            });
        } catch (error) {
            log.warn('Failed to update last login', { ...logMeta, error, userId });
        }
    }
}

export const ssoUserService = SSOUserService.getInstance();
export { SSOUserService };
