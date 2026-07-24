import { When, Then } from '@fixtures';
import type { AppServerFixture, TestStore } from '@fixtures';
import { createLogger } from '@lib/logger';
import { requestWithSession } from '@utils/http-client';
import { got } from 'got-cjs';
import { expect } from '@playwright/test';
import * as yaml from 'yaml';
import { renderTemplate } from '@helpers/template';

const logger = createLogger('CorsEmbedHttpSteps');

/**
 * PUT /v1/cors-embed — replace CORS & Embed settings.
 */
When(
    'I update via http cors-embed settings with params:',
    async (
        { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
        yml: string,
    ) => {
        const rendered = renderTemplate(yml, testData);
        const value = yaml.parse(rendered);
        const uri = `${appServer.baseURL}/v1/cors-embed`;
        logger.info(`Updating cors-embed via ${uri}: ${rendered}`);
        const result = await requestWithSession(uri, testData, appServer, {
            method: 'PUT',
            json: { value },
        });
        expect(result.raw.statusCode).toBe(200);
        testData.set('corsEmbedSettings', result.json.value);
    },
);

/**
 * GET /v1/cors-embed and stash value.
 */
When(
    'I get via http cors-embed settings',
    async ({ appServer, testData }: { appServer: AppServerFixture; testData: TestStore }) => {
        const uri = `${appServer.baseURL}/v1/cors-embed`;
        const result = await requestWithSession(uri, testData, appServer);
        expect(result.raw.statusCode).toBe(200);
        testData.set('corsEmbedSettings', result.json.value);
        testData.set('lastHttpResponse', result);
    },
);

Then(
    'I expect via http cors-embed settings to match:',
    async (
        { testData }: { testData: TestStore },
        yml: string,
    ) => {
        const expected = yaml.parse(renderTemplate(yml, testData));
        const actual = testData.get('corsEmbedSettings');
        expect(actual).toMatchObject(expected);
    },
);

/**
 * GET /v1/cors-embed/csrf — store token under corsEmbedCsrf.
 */
When(
    'I get via http cors-embed csrf token',
    async ({ appServer, testData }: { appServer: AppServerFixture; testData: TestStore }) => {
        const uri = `${appServer.baseURL}/v1/cors-embed/csrf`;
        const result = await requestWithSession(uri, testData, appServer);
        expect(result.raw.statusCode).toBe(200);
        expect(result.json.csrfToken).toBeTruthy();
        testData.set('corsEmbedCsrf', result.json.csrfToken);
        logger.info(`CSRF token issued: ${String(result.json.csrfToken).slice(0, 8)}...`);
    },
);

/**
 * POST /v1/cors-embed/prepare-cookie
 */
When(
    'I prepare via http cors-embed session cookie',
    async ({ appServer, testData }: { appServer: AppServerFixture; testData: TestStore }) => {
        const uri = `${appServer.baseURL}/v1/cors-embed/prepare-cookie`;
        const result = await requestWithSession(uri, testData, appServer, { method: 'POST' });
        expect(result.raw.statusCode).toBe(200);
        expect(result.json.ok).toBe(true);
        if (result.json.csrfToken) {
            testData.set('corsEmbedCsrf', result.json.csrfToken);
        }
        testData.set('lastHttpResponse', result);
    },
);

/**
 * OPTIONS preflight against an arbitrary /v1 path with Origin.
 * Stashes Access-Control-* headers on lastCorsHeaders.
 */
When(
    'I send via http OPTIONS {string} with Origin {string}',
    async (
        { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
        path: string,
        origin: string,
    ) => {
        const uri = `${appServer.baseURL}${path}`;
        logger.info(`OPTIONS ${uri} Origin=${origin}`);
        try {
            const res = await got(uri, {
                method: 'OPTIONS',
                headers: {
                    Origin: origin,
                    'Access-Control-Request-Method': 'PUT',
                    'Access-Control-Request-Headers': 'content-type,x-csrf-token',
                },
                throwHttpErrors: false,
            });
            testData.set('lastHttpStatus', res.statusCode);
            testData.set('lastCorsHeaders', {
                'access-control-allow-origin': res.headers['access-control-allow-origin'],
                'access-control-allow-credentials': res.headers['access-control-allow-credentials'],
            });
        } catch (error: any) {
            const res = error?.response;
            testData.set('lastHttpStatus', res?.statusCode);
            testData.set('lastCorsHeaders', {
                'access-control-allow-origin': res?.headers?.['access-control-allow-origin'],
                'access-control-allow-credentials': res?.headers?.['access-control-allow-credentials'],
            });
        }
    },
);

Then(
    'I expect the last CORS Allow-Origin header to be {string}',
    async ({ testData }: { testData: TestStore }, expected: string) => {
        const headers = (testData.get('lastCorsHeaders') || {}) as Record<string, string | undefined>;
        const actual = headers['access-control-allow-origin'] || '';
        if (expected === '') {
            expect(actual).toBeFalsy();
        } else {
            expect(actual).toBe(expected);
        }
    },
);

Then(
    'I expect the last CORS Allow-Credentials header to be {string}',
    async ({ testData }: { testData: TestStore }, expected: string) => {
        const headers = (testData.get('lastCorsHeaders') || {}) as Record<string, string | undefined>;
        expect(String(headers['access-control-allow-credentials'] || '')).toBe(expected);
    },
);

/**
 * Cross-origin PUT /v1/cors-embed with optional CSRF (from store).
 * Expects a specific HTTP status.
 */
When(
    'I update via http cors-embed settings from Origin {string} with csrf {string} expecting status {int} with params:',
    async (
        {
            appServer,
            testData,
        }: { appServer: AppServerFixture; testData: TestStore },
        origin: string,
        csrfMode: string,
        expectedStatus: number,
        yml: string,
    ) => {
        const value = yaml.parse(renderTemplate(yml, testData));
        const uri = `${appServer.baseURL}/v1/cors-embed`;
        const sessionSid = testData.get('lastSessionId') as string | undefined;
        const headers: Record<string, string> = {
            Origin: origin,
            referer: `${origin}/`,
            'content-type': 'application/json',
        };
        if (sessionSid) {
            headers.cookie = `connect.sid=${sessionSid}`;
        }
        if (csrfMode === 'stored') {
            const token = testData.get('corsEmbedCsrf') as string | undefined;
            if (!token) throw new Error('No corsEmbedCsrf in test data — call "I get via http cors-embed csrf token" first');
            headers['X-CSRF-Token'] = token;
        } else if (csrfMode !== 'none') {
            headers['X-CSRF-Token'] = csrfMode;
        }

        logger.info(`Cross-origin PUT ${uri} Origin=${origin} csrf=${csrfMode}`);
        const res = await got(uri, {
            method: 'PUT',
            headers,
            json: { value },
            throwHttpErrors: false,
        });
        testData.set('lastHttpStatus', res.statusCode);
        try {
            testData.set('lastHttpJson', JSON.parse(res.body));
        } catch {
            testData.set('lastHttpJson', res.body);
        }
        expect(res.statusCode).toBe(expectedStatus);
        if (res.statusCode >= 200 && res.statusCode < 300) {
            const json = JSON.parse(res.body);
            testData.set('corsEmbedSettings', json.value);
        }
    },
);

/**
 * Store check id + actualSnapshotId for later cross-origin Accept (role users cannot list others' checks).
 */
When(
    'I store via http the {ordinal} check with name {string} as {string}',
    async (
        { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
        ordinal: number,
        name: string,
        label: string,
    ) => {
        const findUri = `${appServer.baseURL}/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"${name}","$options":"im"}}]}`;
        const found = await requestWithSession(findUri, testData, appServer);
        const checks = [...(found.json.results || [])].sort((a: any, b: any) => {
            const aTime = new Date(a.createdDate || 0).getTime();
            const bTime = new Date(b.createdDate || 0).getTime();
            return bTime - aTime;
        });
        const check = checks[ordinal];
        if (!check) {
            throw new Error(`Check #${ordinal + 1} with name "${name}" not found`);
        }
        const stored = {
            id: check._id || check.id,
            actualSnapshotId: check.actualSnapshotId,
            name: check.name,
        };
        testData.set(label, stored);
        logger.info(`Stored check "${label}": ${JSON.stringify(stored)}`);
    },
);

/**
 * Cross-origin Accept of a previously stored check, with optional CSRF.
 */
When(
    'I accept via http stored check {string} from Origin {string} with csrf {string} expecting status {int}',
    async (
        {
            appServer,
            testData,
        }: { appServer: AppServerFixture; testData: TestStore },
        label: string,
        origin: string,
        csrfMode: string,
        expectedStatus: number,
    ) => {
        const check = testData.get(label) as { id: string; actualSnapshotId: string } | undefined;
        if (!check?.id || !check.actualSnapshotId) {
            throw new Error(`No stored check "${label}" — call "I store via http the … check … as …" first`);
        }
        const uri = `${appServer.baseURL}/v1/checks/${check.id}/accept`;
        const sessionSid = testData.get('lastSessionId') as string | undefined;
        const headers: Record<string, string> = {
            Origin: origin,
            referer: `${origin}/`,
            'content-type': 'application/json',
        };
        if (sessionSid) {
            headers.cookie = `connect.sid=${sessionSid}`;
        }
        if (csrfMode === 'stored') {
            const token = testData.get('corsEmbedCsrf') as string | undefined;
            if (!token) throw new Error('No corsEmbedCsrf in test data');
            headers['X-CSRF-Token'] = token;
        } else if (csrfMode !== 'none') {
            headers['X-CSRF-Token'] = csrfMode;
        }

        const res = await got(uri, {
            method: 'PUT',
            headers,
            json: { baselineId: check.actualSnapshotId },
            throwHttpErrors: false,
        });
        testData.set('lastHttpStatus', res.statusCode);
        logger.info(`Cross-origin accept ${uri} → ${res.statusCode}`);
        expect(res.statusCode).toBe(expectedStatus);
    },
);

Then(
    'I expect the last HTTP status to be {int}',
    async ({ testData }: { testData: TestStore }, expected: number) => {
        expect(testData.get('lastHttpStatus')).toBe(expected);
    },
);
