/**
 * E2E tests for Gemini CLI + MCP integration
 * Demonstrates headless vs visible browser modes
 */

import { expect, test } from '@playwright/test';
import { spawn, type ChildProcess } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import http from 'node:http';
import dotenv from 'dotenv';

const MCP_ROOT = path.resolve(__dirname, '..');
const FIXTURES_DIR = path.join(__dirname, 'fixtures');

dotenv.config({ path: path.join(MCP_ROOT, '..', '..', '.env') });

const GEMINI_TIMEOUT = 120_000;
const GEMINI_MODEL = 'gemini-2.5-flash';
const TEST_PORT = 3847;

let testServer: http.Server | null = null;

function startTestServer(port: number): Promise<http.Server> {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const file = path.join(FIXTURES_DIR, 'simple.html');
      fs.readFile(file, (err, content) => {
        if (err) { res.writeHead(500); res.end('Error'); return; }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      });
    });
    server.on('error', reject);
    server.listen(port, () => resolve(server));
  });
}

async function runGemini(prompt: string, headless: boolean): Promise<{ stdout: string; exitCode: number | null }> {
  return new Promise((resolve, reject) => {
    const escaped = prompt.replace(/'/g, "'\\''");
    const cmd = `npx @google/gemini-cli --yolo --model ${GEMINI_MODEL} '${escaped}'`;

    const child: ChildProcess = spawn('sh', ['-c', cmd], {
      cwd: MCP_ROOT,
      env: { ...process.env, E2E_HEADLESS: headless ? '1' : '0', GEMINI_API_KEY: process.env.GEMINI_API_KEY },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    child.stdout?.on('data', (c: Buffer) => { stdout += c.toString(); });
    child.stderr?.on('data', () => {});

    const timer = setTimeout(() => { child.kill('SIGTERM'); reject(new Error('Timeout')); }, GEMINI_TIMEOUT);
    child.on('exit', (code) => { clearTimeout(timer); resolve({ stdout, exitCode: code }); });
    child.on('error', (e) => { clearTimeout(timer); reject(e); });
  });
}

const hasKey = !!process.env.GEMINI_API_KEY;

test.describe('Gemini MCP Tests', () => {
  test.describe.configure({ mode: 'serial', retries: 1 });
  test.skip(!hasKey, 'GEMINI_API_KEY not set');

  test.beforeAll(async () => {
    testServer = await startTestServer(TEST_PORT);
    console.log(`Server on ${TEST_PORT}`);
  });

  test.afterAll(() => { testServer?.close(); });

  test('headless mode', async () => {
    test.setTimeout(GEMINI_TIMEOUT);
    const r = await runGemini(`Go to http://localhost:${TEST_PORT} and describe the page.`, true);
    console.log('HEADLESS OUT:', r.stdout);
    expect(r.exitCode).toBe(0);
    expect(r.stdout.toLowerCase()).toMatch(/test|welcome|simple|page/);
  });

  test('visible browser mode', async () => {
    test.setTimeout(GEMINI_TIMEOUT);
    const r = await runGemini(`Go to http://localhost:${TEST_PORT} and describe it.`, false);
    console.log('VISIBLE OUT:', r.stdout);
    expect(r.exitCode).toBe(0);
    expect(r.stdout.toLowerCase()).toMatch(/test|welcome|simple|page/);
  });
});
