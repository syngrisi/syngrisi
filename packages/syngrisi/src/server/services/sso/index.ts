/**
 * SSO Module
 *
 * Provides Single Sign-On authentication support via OAuth2 and SAML protocols.
 */

// Types
export * from './types';

// Services
export { ssoEvents, SSOEventEmitter } from './events';
export { ssoTokenStore, SSOTokenStore } from './token-store';
export { ssoUserService, SSOUserService } from './sso-user.service';
export { accountLinkingService, AccountLinkingService } from './account-linking.service';

// Providers
export { oauth2Provider, OAuth2Provider, OAUTH2_STRATEGY_NAME, GOOGLE_STRATEGY_NAME } from './oauth2.provider';
export { samlProvider, SAMLProvider, SAML_STRATEGY_NAME } from './saml.provider';
