import * as crypto from 'crypto';
import { got } from 'got-cjs';
import type { AppServerFixture } from '@fixtures';
import type { TestStore } from '@fixtures';

export interface HttpRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  json?: Record<string, unknown>;
  form?: Record<string, unknown>;
  body?: string;
  headers?: Record<string, string>;
}

export interface AuthHeaderOptions {
  sessionId?: string;
  apiKey?: string;
  path?: string;
  headers?: Record<string, string>;
}

function hashApiKey(apiKey: string): string {
  return crypto.createHash('sha512').update(apiKey).digest('hex');
}

export function createSameOriginHeaders(appServer: AppServerFixture, path = '/'): Record<string, string> {
  try {
    const base = new URL(appServer.baseURL);
    const referer = new URL(path, base).toString();

    return {
      origin: base.origin,
      referer,
    };
  } catch {
    return {};
  }
}

export function createAuthHeaders(
  appServer: AppServerFixture,
  options: AuthHeaderOptions = {}
): Record<string, string> {
  const { sessionId, apiKey, path = '/', headers = {} } = options;
  const authHeaders: Record<string, string> = {
    ...createSameOriginHeaders(appServer, path),
    ...headers,
  };

  if (sessionId) {
    authHeaders.cookie = `connect.sid=${sessionId}`;
  }
  if (apiKey) {
    authHeaders.apikey = apiKey;
  }

  return authHeaders;
}

export async function requestWithSession(
  uri: string,
  testData: TestStore,
  appServer: AppServerFixture,
  options: HttpRequestOptions = { method: 'GET' }
): Promise<{ raw: any; json: any }> {
  const sessionSid = testData.get('lastSessionId') as string | undefined;

  const targetPath = (() => {
    try {
      return new URL(uri).pathname || '/';
    } catch {
      return '/';
    }
  })();

  const headers: Record<string, string> = {
    ...createSameOriginHeaders(appServer, targetPath),
    ...options.headers,
  };

  const storedApiKey = testData.get('hashedApiKey') as string | undefined;
  const hashedApiKey = storedApiKey ?? hashApiKey(process.env.SYNGRISI_API_KEY || '123');
  testData.set('hashedApiKey', hashedApiKey);

  if (sessionSid) {
    headers.cookie = `connect.sid=${sessionSid}`;
  } else if (hashedApiKey) {
    headers.apikey = hashedApiKey;
  }

  let res;
  try {
    res = await got(uri, {
      method: options.method || 'GET',
      headers,
      json: options.json,
      form: options.form,
      body: options.body,
    });
  } catch (error: any) {
    console.log('uri:', uri);
    console.log('method:', options.method);
    console.log('👉 request json:', options.json);
    console.log('👉 request body:', options.body);
    console.log('❌ response:', error?.response?.body);
    throw error;
  }

  let json;
  try {
    json = JSON.parse(res.body);
  } catch (e) {
    console.warn('Warning: cannot parse body as json');
    json = '';
  }

  return {
    raw: res,
    json,
  };
}
