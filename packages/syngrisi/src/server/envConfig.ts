import { cleanEnv, host, num, port, str, bool } from 'envalid';
import crypto from 'crypto';
import path from 'path';

import dotenv from 'dotenv';
dotenv.config({ quiet: true });

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'production';
}

export const env = cleanEnv(process.env, {
    NODE_ENV: str({ choices: ['development', 'production', 'test'] }),
    SYNGRISI_DB_URI: str({ default: 'mongodb://127.0.0.1:27017/SyngrisiDb' }),
    SYNGRISI_APP_PORT: port({ default: 3000 }),
    SYNGRISI_IMAGES_PATH: str({ default: path.join(process.cwd(), './.snapshots-images') }),
    SYNGRISI_DOM_SNAPSHOTS_PATH: str({ default: '' }),  // If empty, uses SYNGRISI_IMAGES_PATH
    SYNGRISI_TMP_DIR: str({ default: path.join(process.cwd(), '.tmp') }),
    SYNGRISI_HTTP_LOG: bool({ default: false }),
    SYNGRISI_COVERAGE: bool({ default: false }),

    SYNGRISI_HOSTNAME: host({ default: 'localhost' }),

    SYNGRISI_AUTH: bool({ default: true }),
    SYNGRISI_TEST_MODE: bool({ default: false }),
    SYNGRISI_DISABLE_FIRST_RUN: bool({ default: false }),

    MONGODB_ROOT_USERNAME: str({ default: '' }),
    MONGODB_ROOT_PASSWORD: str({ default: '' }),
    LOGLEVEL: str({ choices: ['error', 'warn', 'info', 'verbose', 'debug', 'silly'], default: 'debug' }),
    // Legacy tests expect 20 rows per page; keep default aligned for e2e
    SYNGRISI_PAGINATION_SIZE: num({ default: 20 }),
    SYNGRISI_DISABLE_DEV_CORS: bool({ default: true, devDefault: true }),
    SYNGRISI_SESSION_STORE_KEY: str({ default: crypto.randomBytes(64).toString('hex') }),
    SYNGRISI_LOG_LEVEL: str({ default: 'debug' }),
    SYNGRISI_AUTO_REMOVE_CHECKS_POLL_INTERVAL_MS: num({ default: 10 * 60 * 1000 }), // 10 minutes
    SYNGRISI_AUTO_REMOVE_CHECKS_MIN_INTERVAL_MS: num({ default: 24 * 60 * 60 * 1000 }),
    SYNGRISI_ENABLE_SCHEDULERS_IN_TEST_MODE: bool({ default: false }),

    // RCA
    SYNGRISI_RCA: bool({ default: false }),

    // trunk features
    SYNGRISI_TRUNK_FEATURE_AI_SEVERITY: bool({ default: false }),
    SYNGRISI_AI_KEY: str({ default: '' }),
    OPENAI_API_BASE_URL: str({ default: 'https://api.openai.com/v1' }),
    OPENAI_API_KEY: str({ default: '' }),
    SYNGRISI_V8_COVERAGE_ON_EXIT: bool({ default: false }),

    // Rate Limiting
    SYNGRISI_RATE_LIMIT_WINDOW_MS: num({ default: 15 * 60 * 1000 }), // 15 minutes
    SYNGRISI_RATE_LIMIT_MAX: num({ default: 5000 }),
    SYNGRISI_AUTH_RATE_LIMIT_WINDOW_MS: num({ default: 15 * 60 * 1000 }), // 15 minutes
    SYNGRISI_AUTH_RATE_LIMIT_MAX: num({ default: 200 }),
    // Mongo tuneables for tests/CI flake reduction
    SYNGRISI_MONGO_SOCKET_TIMEOUT_MS: num({ default: 60_000 }),
    SYNGRISI_MONGO_MAX_POOL_SIZE: num({ default: 20 }),
    SYNGRISI_MONGO_MIN_POOL_SIZE: num({ default: 2 }),
    SYNGRISI_MONGO_MAX_IDLE_TIME_MS: num({ default: 30_000 }),
    SYNGRISI_MONGO_WAIT_QUEUE_TIMEOUT_MS: num({ default: 30_000 }),
    SYNGRISI_MONGO_SERVER_SELECTION_TIMEOUT_MS: num({ default: 10_000 }),
    SYNGRISI_MONGO_CONNECT_TIMEOUT_MS: num({ default: 30_000 }),

    // SSO Configuration
    SSO_ENABLED: bool({ default: false }),
    SSO_PROTOCOL: str({ choices: ['', 'oauth2', 'saml'], default: '' }),
    SSO_CLIENT_ID: str({ default: '' }),
    SSO_CLIENT_SECRET: str({ default: '' }),
    SSO_AUTHORIZATION_URL: str({ default: '' }),
    SSO_TOKEN_URL: str({ default: '' }),
    SSO_USERINFO_URL: str({ default: '' }),
    SSO_CALLBACK_URL: str({ default: '/v1/auth/sso/oauth/callback' }),
    // SAML specific
    SSO_ENTRY_POINT: str({ default: '' }),
    SSO_ISSUER: str({ default: '' }),
    SSO_CERT: str({ default: '' }),
    SSO_IDP_ISSUER: str({ default: '' }),
    SSO_IDP_METADATA_URL: str({ default: '' }), // URL to fetch IdP metadata XML (alternative to manual SSO_ENTRY_POINT/SSO_CERT)
    // SSO user settings
    SSO_DEFAULT_ROLE: str({ choices: ['', 'user', 'admin', 'reviewer'], default: 'reviewer' }),
    SSO_AUTO_CREATE_USERS: bool({ default: true }),
    SSO_ALLOW_ACCOUNT_LINKING: bool({ default: true }),

    // Plugin System
    SYNGRISI_PLUGINS_ENABLED: str({ default: '' }),  // Comma-separated list of enabled plugins
    SYNGRISI_PLUGINS_DIR: str({ default: '' }),       // Directory for external plugins

    // Okta Auth Plugin
    OKTA_JWKS_URL: str({ default: 'https://login.corp.mongodb.com/.well-known/jwks.json' }),
    OKTA_ISSUER: str({ default: 'login.corp.mongodb.com' }),
    OKTA_SERVICE_USER_ROLE: str({ choices: ['', 'user', 'admin', 'reviewer', 'service'], default: 'service' }),
    OKTA_AUTH_HEADER: str({ default: 'x-jwt-internal-authorization' }),

    // Custom Check Validator Plugin
    CHECK_MISMATCH_THRESHOLD: str({ default: '0' }),  // Mismatch % below which checks pass
    CHECK_VALIDATOR_SCRIPT: str({ default: '' }),     // Path to custom validation script
});
