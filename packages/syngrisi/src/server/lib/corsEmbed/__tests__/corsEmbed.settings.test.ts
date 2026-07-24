import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
    DEFAULT_CORS_EMBED_SETTINGS,
    isAllowedCorsOrigin,
    isCheckAllowedForCorsEmbedAccept,
    isCrossOriginRequest,
    normalizeCorsEmbedSettings,
} from '../index';
import type { CorsEmbedSettings } from '../corsEmbed.types';

test('normalizeCorsEmbedSettings: defaults when empty', () => {
    const normalized = normalizeCorsEmbedSettings(undefined);
    assert.equal(normalized.enabled, false);
    assert.deepEqual(normalized.allowedOrigins, []);
    assert.equal(normalized.sameSite, 'lax');
    assert.equal(normalized.csrfRequired, true);
    assert.deepEqual(normalized.allowedAcceptRoles, DEFAULT_CORS_EMBED_SETTINGS.allowedAcceptRoles);
});

test('normalizeCorsEmbedSettings: normalizes origins and drops invalid', () => {
    const normalized = normalizeCorsEmbedSettings({
        enabled: true,
        allowedOrigins: [
            'https://ci.example.com/',
            'https://ci.example.com/path',
            'not-a-url',
            'ftp://bad.example',
            'http://localhost:8080',
        ],
    });
    assert.deepEqual(normalized.allowedOrigins, [
        'https://ci.example.com',
        'http://localhost:8080',
    ]);
});

test('normalizeCorsEmbedSettings: sameSite none forces known roles filter defaults', () => {
    const normalized = normalizeCorsEmbedSettings({
        sameSite: 'NONE',
        allowedAcceptRoles: ['reviewer', 'hacker', 'admin'],
        allowedAcceptStatuses: ['different_images', 'nope'],
    });
    assert.equal(normalized.sameSite, 'none');
    assert.deepEqual(normalized.allowedAcceptRoles, ['reviewer', 'admin']);
    assert.deepEqual(normalized.allowedAcceptStatuses, ['different_images']);
});

test('isAllowedCorsOrigin: exact match only when enabled', () => {
    const settings: CorsEmbedSettings = {
        ...DEFAULT_CORS_EMBED_SETTINGS,
        enabled: true,
        allowedOrigins: ['https://ci.example.com'],
    };
    assert.equal(isAllowedCorsOrigin('https://ci.example.com', settings), true);
    assert.equal(isAllowedCorsOrigin('https://ci.example.com/', settings), true);
    assert.equal(isAllowedCorsOrigin('https://other.example.com', settings), false);
    assert.equal(
        isAllowedCorsOrigin('https://ci.example.com', { ...settings, enabled: false }),
        false,
    );
});

test('isCrossOriginRequest: compares Origin host to Host', () => {
    assert.equal(
        isCrossOriginRequest({ headers: { origin: 'https://ci.example.com', host: 'syngrisi.example.com' } }),
        true,
    );
    assert.equal(
        isCrossOriginRequest({ headers: { origin: 'https://syngrisi.example.com', host: 'syngrisi.example.com' } }),
        false,
    );
    assert.equal(isCrossOriginRequest({ headers: { host: 'syngrisi.example.com' } }), false);
});

test('isCheckAllowedForCorsEmbedAccept: status and failReasons', () => {
    const settings: CorsEmbedSettings = {
        ...DEFAULT_CORS_EMBED_SETTINGS,
        allowedAcceptStatuses: ['new', 'different_images'],
    };
    assert.equal(
        isCheckAllowedForCorsEmbedAccept({ status: ['new'], failReasons: [] }, settings),
        true,
    );
    assert.equal(
        isCheckAllowedForCorsEmbedAccept(
            { status: ['failed'], failReasons: ['different_images'] },
            settings,
        ),
        true,
    );
    assert.equal(
        isCheckAllowedForCorsEmbedAccept(
            { status: ['failed'], failReasons: ['wrong_dimensions'] },
            settings,
        ),
        false,
    );
    assert.equal(
        isCheckAllowedForCorsEmbedAccept(
            { status: ['failed'], failReasons: ['different_images'] },
            { ...settings, allowedAcceptStatuses: [] },
        ),
        true,
    );
});
