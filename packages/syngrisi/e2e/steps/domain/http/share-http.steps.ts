import { Given, When } from '@fixtures';
import type { AppServerFixture } from '@fixtures';
import type { TestStore } from '@fixtures';
import { createLogger } from '@lib/logger';
import { requestWithSession } from '@utils/http-client';
import { renderTemplate } from '@helpers/template';
import { got } from 'got-cjs';
import { expect } from '@playwright/test';
import mongoose from 'mongoose';
import { gzipSync } from 'node:zlib';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const logger = createLogger('ShareHttpSteps');

// Looks up a check by name (0-based ordinal, most recently created first), retrying briefly
// in case of eventual-consistency delay right after creation.
async function findCheckByNameAndOrdinal(
  appServer: AppServerFixture,
  testData: TestStore,
  name: string,
  ordinal: number
): Promise<Record<string, any>> {
  const uri = `${appServer.baseURL}/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"${name}","$options":"im"}}]}`;
  const maxAttempts = 8;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const checksResponse = await requestWithSession(uri, testData, appServer);
    const checks = [...(checksResponse.json.results || [])].sort((a, b) => {
      const aTime = new Date(a.createdDate || a.updatedDate || 0).getTime();
      const bTime = new Date(b.createdDate || b.updatedDate || 0).getTime();
      return bTime - aTime;
    });
    const check = checks[ordinal];
    if (check) return check;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Check #${ordinal + 1} (${ordinal}-based index) with name "${name}" not found.`);
}

// Seeds a minimal "actual" DOM snapshot for a check directly in Mongo + on disk, mirroring the
// storage format written by domSnapshotService (gzip of the JSON DOM dump, referenced by a
// `vrsdomsnapshots` document). This lets the DOM-snapshot IDOR scenario exercise a real 200
// response for the owning check, instead of both the allowed and blocked cases collapsing into
// the same "no snapshot" 404 (which would prove nothing about the share-token scoping fix).
// Reuses the same raw-Mongo technique as `ensureActualDomSnapshotExists` in rca-scenarios.steps.ts.
Given(
  'I seed a raw DOM snapshot for the {ordinal} check with name {string}',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    ordinal: number,
    name: string
  ) => {
    const check = await findCheckByNameAndOrdinal(appServer, testData, name, ordinal);
    const checkId = check._id;

    const connectionString = appServer.config?.connectionString || process.env.SYNGRISI_DB_URI;
    if (!connectionString) {
      throw new Error('Cannot seed DOM snapshot: missing connection string');
    }
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(connectionString);
    }

    const domDump = { tag: 'html', children: [{ tag: 'body', checkName: name }] };
    const serialized = JSON.stringify(domDump);
    const hash = crypto.createHash('sha256').update(serialized, 'utf8').digest('hex');
    const compressed = gzipSync(Buffer.from(serialized, 'utf8'));
    const filename = `${checkId}_actual_${Date.now()}.dom.gz`;

    const domSnapshotsPath =
      process.env.SYNGRISI_DOM_SNAPSHOTS_PATH ||
      process.env.SYNGRISI_IMAGES_PATH ||
      appServer.config?.defaultImagesPath;
    if (!domSnapshotsPath) {
      throw new Error('Cannot seed DOM snapshot: missing DOM snapshots path');
    }

    await fs.promises.mkdir(domSnapshotsPath, { recursive: true });
    await fs.promises.writeFile(path.join(domSnapshotsPath, filename), compressed);

    await mongoose.connection.collection('vrsdomsnapshots').insertOne({
      checkId: new mongoose.Types.ObjectId(checkId),
      type: 'actual',
      filename,
      hash,
      compressed: true,
      originalSize: Buffer.byteLength(serialized, 'utf8'),
      compressedSize: compressed.length,
      createdDate: new Date(),
    });

    logger.info(`Seeded DOM snapshot for check "${name}" (${checkId}): ${filename}`);
  }
);

// Finds the check by name (0-based ordinal, most recently created first - same convention
// as "I accept via http the {ordinal} check with name" in checks-http.steps.ts), creates a
// share token for it via POST /v1/share/checks/:checkId/share (authenticated admin session),
// and stores the token plus the check's identifying fields under `${label}_*` keys so later
// steps can reference them via the project's <placeholder> template syntax.
When(
  'I create via http a share token for the {ordinal} check with name {string} as {string}',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    ordinal: number,
    name: string,
    label: string
  ) => {
    const check = await findCheckByNameAndOrdinal(appServer, testData, name, ordinal);
    const checkId = check._id;
    const shareUri = `${appServer.baseURL}/v1/share/checks/${checkId}/share`;
    logger.info(`Creating share token for check "${name}" (${checkId}) via ${shareUri}`);
    const result = await requestWithSession(shareUri, testData, appServer, { method: 'POST' });
    const statusCode = result.raw?.statusCode;
    expect(statusCode).toBeGreaterThanOrEqual(200);
    expect(statusCode).toBeLessThan(300);

    const token = result.json.token as string;
    if (!token) {
      throw new Error(`Share token creation for check "${name}" (${checkId}) did not return a token`);
    }

    testData.set(`${label}_checkId`, String(checkId));
    testData.set(`${label}_token`, token);
    testData.set(`${label}_name`, check.name);
    testData.set(`${label}_app`, typeof check.app === 'object' && check.app?._id ? String(check.app._id) : String(check.app));
    testData.set(`${label}_branch`, check.branch);
    testData.set(`${label}_browserName`, check.browserName);
    testData.set(`${label}_viewport`, check.viewport);
    testData.set(`${label}_os`, check.os);

    logger.info(`Stored share token for "${label}": checkId=${checkId}`);
  }
);

// Captures the (ground-truth) id of a baseline via the authenticated admin session, so a later
// share-scoped response can be asserted to contain/not-contain it (via the generic
// "I expect the stored ... string to (not) contain the stored ..." steps).
When(
  'I remember via http the id of the {ordinal} baseline filtered as {string} as {string}',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    ordinal: number,
    nameFilter: string,
    label: string
  ) => {
    const uri = `${appServer.baseURL}/v1/baselines?limit=0&filter={"$and":[{"name":{"$regex":"${nameFilter}","$options":"im"}}]}`;
    const response = await requestWithSession(uri, testData, appServer);
    const items = response.json.results || [];
    const item = items[ordinal];
    if (!item) {
      throw new Error(`Baseline #${ordinal + 1} (${ordinal}-based index) filtered as "${nameFilter}" not found.`);
    }
    const id = String(item.id ?? item._id);
    testData.set(label, id);
    logger.info(`Remembered baseline id for "${label}": ${id}`);
  }
);

// Issues a GET request authenticated solely via the `x-share-token` header (no session cookie,
// no apikey) - exactly how an anonymous share-link visitor would call the API - and asserts the
// response status. The path may reference values stored by the step above via <label_field>
// placeholders (e.g. "/v1/checks/<checkB_checkId>/dom"). The response body is stashed under
// "shareResponseBody" for follow-up assertions with the generic
// "I expect the stored ... string is/is not contain:" steps.
When(
  'I request via http {string} with share token {string} and expect status {int}',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    pathTemplate: string,
    tokenLabel: string,
    expectedStatus: number
  ) => {
    const renderedPath = renderTemplate(pathTemplate, testData);
    const token = testData.get(`${tokenLabel}_token`) as string | undefined;
    if (!token) {
      throw new Error(`No share token stored for label "${tokenLabel}". Use "I create via http a share token..." first.`);
    }

    const uri = `${appServer.baseURL}${renderedPath}`;
    logger.info(`Requesting "${renderedPath}" using share token "${tokenLabel}"`);
    const response = await got(uri, {
      method: 'GET',
      headers: { 'x-share-token': token },
      throwHttpErrors: false,
      responseType: 'text',
    });

    logger.info(`Share-scoped request to "${renderedPath}" returned status ${response.statusCode}`);
    expect(response.statusCode).toBe(expectedStatus);

    let bodyForStorage = response.body;
    try {
      bodyForStorage = JSON.stringify(JSON.parse(response.body));
    } catch {
      // Keep raw text if the response isn't JSON.
    }
    testData.set('shareResponseBody', bodyForStorage);
  }
);

// GET /v1/baselines/history requires its `filter` query param to be the client-supplied ident
// JSON (validated by BaselineHistoryQuerySchema). Building that JSON directly in TS - rather
// than embedding it in the Gherkin step text - sidesteps Cucumber's string-quoting rules (a
// literal `"` inside a {string} argument needs escaping) and lets the scenario simply say
// "check B's ident" by label. `checkLabel` picks whose ident to send as the (deliberately wrong,
// client-supplied) filter; `tokenLabel` picks whose share token authenticates the request. The
// fix must always substitute the token's own check ident, ignoring the client-supplied one.
When(
  'I request via http baseline history for check {string} with share token {string} and expect status {int}',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    checkLabel: string,
    tokenLabel: string,
    expectedStatus: number
  ) => {
    const token = testData.get(`${tokenLabel}_token`) as string | undefined;
    if (!token) {
      throw new Error(`No share token stored for label "${tokenLabel}". Use "I create via http a share token..." first.`);
    }
    const ident = {
      name: testData.get(`${checkLabel}_name`),
      app: testData.get(`${checkLabel}_app`),
      branch: testData.get(`${checkLabel}_branch`),
      browserName: testData.get(`${checkLabel}_browserName`),
      viewport: testData.get(`${checkLabel}_viewport`),
      os: testData.get(`${checkLabel}_os`),
    };
    if (!ident.name || !ident.app) {
      throw new Error(`No check ident stored for label "${checkLabel}". Use "I create via http a share token..." first.`);
    }

    const uri = `${appServer.baseURL}/v1/baselines/history?filter=${encodeURIComponent(JSON.stringify(ident))}`;
    logger.info(`Requesting baseline history for check "${checkLabel}" using share token "${tokenLabel}"`);
    const response = await got(uri, {
      method: 'GET',
      headers: { 'x-share-token': token },
      throwHttpErrors: false,
      responseType: 'text',
    });

    logger.info(`Share-scoped baseline history request returned status ${response.statusCode}`);
    expect(response.statusCode).toBe(expectedStatus);

    let bodyForStorage = response.body;
    try {
      bodyForStorage = JSON.stringify(JSON.parse(response.body));
    } catch {
      // Keep raw text if the response isn't JSON.
    }
    testData.set('shareResponseBody', bodyForStorage);
  }
);
