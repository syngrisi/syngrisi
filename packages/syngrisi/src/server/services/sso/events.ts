/**
 * SSO Event Emitter
 *
 * Provides event-driven architecture for SSO operations.
 * Events can be used for auditing, logging, and extending SSO functionality.
 */

import { EventEmitter } from 'events';
import log from '@logger';
import type { SSOEvent, SSOEventType, SSOEventHandler, SSOProviderType } from './types';
import { LogOpts } from '@types';

const logMeta: LogOpts = { scope: 'sso-events', msgType: 'SSO' };

class SSOEventEmitter extends EventEmitter {
    private static instance: SSOEventEmitter;

    private constructor() {
        super();
        this.setMaxListeners(20);
    }

    static getInstance(): SSOEventEmitter {
        if (!SSOEventEmitter.instance) {
            SSOEventEmitter.instance = new SSOEventEmitter();
        }
        return SSOEventEmitter.instance;
    }

    /**
     * Emit an SSO event
     */
    emitEvent(event: SSOEvent): void {
        log.debug(`SSO event: ${event.type}`, { ...logMeta, event });
        this.emit(event.type, event);
        this.emit('*', event); // Wildcard for all events
    }

    /**
     * Subscribe to a specific event type
     */
    onEvent(type: SSOEventType | '*', handler: SSOEventHandler): void {
        this.on(type, handler);
    }

    /**
     * Unsubscribe from a specific event type
     */
    offEvent(type: SSOEventType | '*', handler: SSOEventHandler): void {
        this.off(type, handler);
    }

    /**
     * Helper: Emit user login event
     */
    emitLogin(userId: string, email: string, provider: SSOProviderType): void {
        this.emitEvent({
            type: 'user.sso.login',
            timestamp: new Date(),
            userId,
            email,
            provider,
        });
    }

    /**
     * Helper: Emit user created event
     */
    emitUserCreated(userId: string, email: string, provider: SSOProviderType): void {
        this.emitEvent({
            type: 'user.sso.created',
            timestamp: new Date(),
            userId,
            email,
            provider,
        });
    }

    /**
     * Helper: Emit account linked event
     */
    emitAccountLinked(userId: string, email: string, provider: SSOProviderType): void {
        this.emitEvent({
            type: 'user.sso.linked',
            timestamp: new Date(),
            userId,
            email,
            provider,
        });
    }

    /**
     * Helper: Emit account unlinked event
     */
    emitAccountUnlinked(userId: string, email: string, provider: SSOProviderType): void {
        this.emitEvent({
            type: 'user.sso.unlinked',
            timestamp: new Date(),
            userId,
            email,
            provider,
        });
    }

    /**
     * Helper: Emit error event
     */
    emitError(error: Error, email?: string, provider?: SSOProviderType): void {
        this.emitEvent({
            type: 'user.sso.error',
            timestamp: new Date(),
            email,
            provider,
            error,
        });
    }
}

export const ssoEvents = SSOEventEmitter.getInstance();
export { SSOEventEmitter };
