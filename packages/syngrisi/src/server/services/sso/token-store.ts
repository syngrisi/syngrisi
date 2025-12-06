/**
 * SSO Token Store
 *
 * Manages OAuth2 tokens for SSO sessions.
 * Enables refresh token usage and proper logout capabilities.
 */

import log from '@logger';
import type { SSOTokens } from './types';
import { LogOpts } from '@types';

const logMeta: LogOpts = { scope: 'sso-token-store', msgType: 'SSO' };

interface StoredToken {
    tokens: SSOTokens;
    userId: string;
    createdAt: Date;
    expiresAt?: Date;
}

class SSOTokenStore {
    private static instance: SSOTokenStore;
    private tokens: Map<string, StoredToken> = new Map();
    private cleanupInterval: NodeJS.Timeout | null = null;

    private constructor() {
        // Start cleanup interval (every 5 minutes)
        this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000);
    }

    static getInstance(): SSOTokenStore {
        if (!SSOTokenStore.instance) {
            SSOTokenStore.instance = new SSOTokenStore();
        }
        return SSOTokenStore.instance;
    }

    /**
     * Store tokens for a user session
     */
    store(sessionId: string, userId: string, tokens: SSOTokens): void {
        const expiresAt = tokens.expiresIn
            ? new Date(Date.now() + tokens.expiresIn * 1000)
            : undefined;

        this.tokens.set(sessionId, {
            tokens,
            userId,
            createdAt: new Date(),
            expiresAt,
        });

        log.debug('Stored SSO tokens for session', {
            ...logMeta,
            sessionId: sessionId.substring(0, 8) + '...',
            userId,
            hasRefreshToken: !!tokens.refreshToken,
            expiresAt,
        });
    }

    /**
     * Get tokens for a session
     */
    get(sessionId: string): SSOTokens | null {
        const stored = this.tokens.get(sessionId);
        if (!stored) {
            return null;
        }

        // Check if expired
        if (stored.expiresAt && stored.expiresAt < new Date()) {
            log.debug('SSO token expired', {
                ...logMeta,
                sessionId: sessionId.substring(0, 8) + '...',
            });
            // Don't remove - might have refresh token
            return stored.tokens;
        }

        return stored.tokens;
    }

    /**
     * Get tokens by user ID
     */
    getByUserId(userId: string): { sessionId: string; tokens: SSOTokens } | null {
        for (const [sessionId, stored] of this.tokens.entries()) {
            if (stored.userId === userId) {
                return { sessionId, tokens: stored.tokens };
            }
        }
        return null;
    }

    /**
     * Update tokens (e.g., after refresh)
     */
    update(sessionId: string, tokens: Partial<SSOTokens>): void {
        const stored = this.tokens.get(sessionId);
        if (!stored) {
            log.warn('Cannot update tokens - session not found', {
                ...logMeta,
                sessionId: sessionId.substring(0, 8) + '...',
            });
            return;
        }

        stored.tokens = { ...stored.tokens, ...tokens };

        if (tokens.expiresIn) {
            stored.expiresAt = new Date(Date.now() + tokens.expiresIn * 1000);
        }

        log.debug('Updated SSO tokens', {
            ...logMeta,
            sessionId: sessionId.substring(0, 8) + '...',
        });
    }

    /**
     * Remove tokens for a session (logout)
     */
    remove(sessionId: string): boolean {
        const existed = this.tokens.has(sessionId);
        this.tokens.delete(sessionId);

        if (existed) {
            log.debug('Removed SSO tokens for session', {
                ...logMeta,
                sessionId: sessionId.substring(0, 8) + '...',
            });
        }

        return existed;
    }

    /**
     * Remove all tokens for a user (e.g., password change)
     */
    removeByUserId(userId: string): number {
        let removed = 0;
        for (const [sessionId, stored] of this.tokens.entries()) {
            if (stored.userId === userId) {
                this.tokens.delete(sessionId);
                removed++;
            }
        }

        if (removed > 0) {
            log.debug('Removed all SSO tokens for user', {
                ...logMeta,
                userId,
                count: removed,
            });
        }

        return removed;
    }

    /**
     * Check if a session has a valid refresh token
     */
    hasRefreshToken(sessionId: string): boolean {
        const stored = this.tokens.get(sessionId);
        return !!stored?.tokens.refreshToken;
    }

    /**
     * Clean up expired tokens without refresh tokens
     */
    private cleanup(): void {
        const now = new Date();
        let removed = 0;

        for (const [sessionId, stored] of this.tokens.entries()) {
            // Only remove if expired AND no refresh token
            if (stored.expiresAt && stored.expiresAt < now && !stored.tokens.refreshToken) {
                this.tokens.delete(sessionId);
                removed++;
            }
        }

        if (removed > 0) {
            log.debug('Cleaned up expired SSO tokens', { ...logMeta, count: removed });
        }
    }

    /**
     * Get store statistics (for monitoring)
     */
    getStats(): { total: number; expired: number; withRefreshToken: number } {
        const now = new Date();
        let expired = 0;
        let withRefreshToken = 0;

        for (const stored of this.tokens.values()) {
            if (stored.expiresAt && stored.expiresAt < now) {
                expired++;
            }
            if (stored.tokens.refreshToken) {
                withRefreshToken++;
            }
        }

        return {
            total: this.tokens.size,
            expired,
            withRefreshToken,
        };
    }

    /**
     * Destroy the token store (for cleanup)
     */
    destroy(): void {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
        this.tokens.clear();
    }
}

export const ssoTokenStore = SSOTokenStore.getInstance();
export { SSOTokenStore };
