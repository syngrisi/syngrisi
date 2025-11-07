import { got } from 'got-cjs';
import type { AppServerFixture } from '@fixtures';
import type { TestStore } from '@fixtures';

export interface HttpRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  json?: Record<string, unknown>;
  form?: Record<string, unknown>;
  body?: string;
  headers?: Record<string, string>;
}

export async function requestWithSession(
  uri: string,
  testData: TestStore,
  appServer: AppServerFixture,
  options: HttpRequestOptions = { method: 'GET' }
): Promise<{ raw: any; json: any }> {
  const sessionSid = testData.get('lastSessionId') as string | undefined;

  const headers: Record<string, string> = {
    ...options.headers,
  };

  if (sessionSid) {
    headers.cookie = `connect.sid=${sessionSid}`;
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

