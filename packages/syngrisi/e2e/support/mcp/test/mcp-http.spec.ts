import { expect } from '@playwright/test';
import { test } from '@fixtures';
import { startMcpServer } from '../server';

interface McpClient {
  initialize: () => Promise<void>;
  listTools: () => Promise<string[]>;
  callTool: (
    name: string,
    args: Record<string, unknown>,
  ) => Promise<unknown>;
  close: () => Promise<void>;
}

const ACCEPT_HEADER = 'application/json, text/event-stream';

const parseSseMessage = (raw: string) => {
  const match = raw.match(/^data:\s*(.+)$/m);
  if (!match) {
    throw new Error(`SSE response missing data line: ${raw}`);
  }
  return JSON.parse(match[1]);
};

const extractContentText = (payload: unknown): string => {
  if (!payload || typeof payload !== 'object') {
    return '';
  }

  const container = 'result' in payload && payload.result && typeof payload.result === 'object'
    ? payload.result
    : payload;

  if (!container || typeof container !== 'object') {
    return '';
  }

  const content = (container as { content?: unknown }).content;
  if (!Array.isArray(content) || !content.length) {
    return '';
  }

  const firstBlock = content[0];
  if (!firstBlock || typeof firstBlock !== 'object') {
    return '';
  }

  const text = (firstBlock as { text?: unknown }).text;
  return typeof text === 'string' ? text : '';
};

const createMcpHttpClient = async (baseUrl: string): Promise<McpClient> => {
  let sessionId: string | null = null;
  let rpcId = 1;

  const baseHeaders = {
    'Content-Type': 'application/json',
    Accept: ACCEPT_HEADER,
  };

  const post = async (
    body: Record<string, unknown>,
    includeSession = true,
  ) => {
    const headers = includeSession && sessionId
      ? { ...baseHeaders, 'mcp-session-id': sessionId }
      : baseHeaders;
    const response = await fetch(`${baseUrl}/mcp`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    return response;
  };

  return {
    async initialize() {
      const response = await post(
        {
          jsonrpc: '2.0',
          id: rpcId++,
          method: 'initialize',
          params: {
            protocolVersion: '2024-10-07',
            clientInfo: { name: 'zenflow-mcp-tests', version: '0.0.0' },
            capabilities: {},
          },
        },
        false,
      );
      expect(response.status).toBe(200);
      sessionId = response.headers.get('mcp-session-id');
      expect(sessionId).toBeTruthy();
      const payload = parseSseMessage(await response.text());
      expect(payload?.result?.protocolVersion).toBeDefined();

      const readyResponse = await post({
        jsonrpc: '2.0',
        method: 'notifications/initialized',
        params: {},
      });
      expect(readyResponse.status).toBe(202);
    },

    async listTools() {
      const response = await post({
        jsonrpc: '2.0',
        id: rpcId++,
        method: 'tools/list',
        params: {},
      });
      expect(response.status).toBe(200);
      const payload = parseSseMessage(await response.text());
      return (payload?.result?.tools ?? []).map(
        (tool: { name: string }) => tool.name,
      );
    },

    async callTool(name, args) {
      const response = await post({
        jsonrpc: '2.0',
        id: rpcId++,
        method: 'tools/call',
        params: {
          name,
          arguments: args,
        },
      });
      expect(response.status).toBe(200);
      return parseSseMessage(await response.text());
    },

    async close() {
      if (!sessionId) return;
      await post(
        {
          jsonrpc: '2.0',
          method: 'notifications/shutdown',
          params: {},
        },
      );
      sessionId = null;
    },
  };
};

test.describe.configure({ mode: 'serial' });

test.describe('MCP HTTP tools', () => {
  test(
    'executes diagnostic steps via HTTP API',
    async ({
      page,
      context,
      request,
      appServer,
      testData,
      testManager,
    }, testInfo) => {
      const handle = await startMcpServer({
        fixtures: {
          page,
          context,
          request,
          appServer,
          testData,
          testManager,
        },
        runtime: {
          test,
          testInfo,
          featureUri: 'mcp://zenflow.mcp',
          tags: [],
        },
        requestedPort: 0,
        keepAlive: false,
      });

      const client = await createMcpHttpClient(handle.baseUrl);

      try {
        await client.initialize();

        const tools = await client.listTools();
        expect(tools).toEqual(
          expect.arrayContaining([
            'session_start_new',
            'step_execute_single',
            'step_execute_many',
          ]),
        );

        const sessionResponse = await client.callTool('session_start_new', {
          sessionName: 'mcp-http-tests',
        });
        const sessionText = extractContentText(sessionResponse);
        expect(sessionText).toContain('Status: Success');
        expect(sessionText).toContain('Available test steps (open to read):');

        const urlResponse = await client.callTool('step_execute_single', {
          stepText: 'I get current URL',
        });
        const urlText = extractContentText(urlResponse);
        expect(urlText).toContain('Status: Success');

        const countResponse = await client.callTool('step_execute_single', {
          stepText: 'I get count of "body"',
        });
        const countText = extractContentText(countResponse);
        expect(countText).toContain('Status: Success');

        const diagnosticsResponse = await client.callTool('step_execute_single', {
          stepText: 'I get accessibility snapshot of first "body"',
        });
        const diagnosticsText = extractContentText(diagnosticsResponse);
        expect(diagnosticsText).toContain('Status: Success');
      } finally {
        await client.close();
        await handle.stop();
      }
    },
  );
});
