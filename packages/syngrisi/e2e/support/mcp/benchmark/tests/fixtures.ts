import { test as base } from '@playwright/test';
import { spawn, ChildProcess } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface McpSession {
  runId: string;
  start(prompt: string): Promise<void>;
  stop(): void;
  getLogs(): string[];
  getMetrics(): {
    stepCount: number;
    tokenUsage: number;
    errors: number;
    reliabilityScore: number;
  };
}

function getLatestLogFile(logsDir: string, startTime: number): string | null {
  if (!fs.existsSync(logsDir)) return null;
  
  const files = fs.readdirSync(logsDir)
    .filter(f => f.endsWith('.jsonl'))
    .map(f => path.join(logsDir, f))
    .map(f => ({ file: f, mtime: fs.statSync(f).mtime.getTime() }))
    .sort((a, b) => b.mtime - a.mtime);

  if (files.length > 0 && files[0].mtime > startTime) {
    return files[0].file;
  }
  return null;
}

function parseMetrics(agentLogs: string[], mcpLogPath: string | null) {
  let stepCount = 0;
  let tokenUsage = 0;
  let errors = 0;
  let reliabilityScore = 100;

  // 1. Parse Agent Stdout (for Tokens & General Errors)
  agentLogs.forEach(line => {
    // Example pattern: "Total Tokens: 1234" or "Usage: 1234 tokens"
    const tokenMatch = line.match(/Tokens.*?(\d+)/i) || line.match(/Usage.*?(\d+)/i);
    if (tokenMatch) {
        const val = parseInt(tokenMatch[1], 10);
        tokenUsage = val;
    }

    // Penalize for various error indicators
    if (
      line.includes('Error:') || 
      line.includes('Exception') || 
      line.includes('[Agent Err]') ||
      line.includes('unproductive state') ||
      line.includes('File not found')
    ) {
      errors++;
      reliabilityScore -= 10;
    }
  });

  // 2. Parse MCP JSONL Logs (for Steps & Functional Success)
  if (mcpLogPath && fs.existsSync(mcpLogPath)) {
    const content = fs.readFileSync(mcpLogPath, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim().length > 0);
    
    stepCount = lines.length;

    lines.forEach(line => {
      try {
        const entry = JSON.parse(line);
        // reliability penalties for failed steps
        if (entry.status === 'Failed' || entry.status === 'Not Found') {
          reliabilityScore -= 15;
          errors++;
        }
      } catch (e) {
        // ignore parse errors
      }
    });
  }

  return { 
    stepCount, 
    tokenUsage, 
    errors,
    reliabilityScore: Math.max(0, reliabilityScore)
  };
}

export const test = base.extend<{ mcp: McpSession }>({
  mcp: async ({ }, use, testInfo) => {
    const runId = `bench-${testInfo.title.replace(/\s+/g, '-')}-${Date.now()}`;
    let childProcess: ChildProcess | null = null;
    const logs: string[] = [];
    const startTime = Date.now();

    // Path to MCP logs (adjust relative to this file)
    const mcpLogsDir = path.resolve(__dirname, '../../logs');

    const session: McpSession = {
      runId,
      start: async (prompt: string) => {
        let command = process.env.BENCH_COMMAND;
        
        if (!command) {
           console.warn("No BENCH_COMMAND set, using dry-run mock.");
           logs.push("Tool Call: MockAction");
           logs.push("Success: true");
           return;
        }

        // Replace placeholder with actual prompt
        // Use single quotes for shell safety, escaping existing single quotes
        const escapedPrompt = "'" + prompt.replace(/'/g, "'\\''") + "'";
        command = command.replace('$BENCH_SCENARIO_PROMPT', escapedPrompt);
        
        // Also replace Session Name if used
        command = command.replace('$BENCH_SESSION_NAME', runId);

        console.log(`[Benchmark] Executing: ${command}`);

        return new Promise((resolve, reject) => {
          childProcess = spawn(command!, {
            shell: true,
            env: {
              ...process.env,
              BENCH_SCENARIO_PROMPT: prompt,
              BENCH_SESSION_NAME: runId
            }
          });

          childProcess.stdout?.on('data', (data) => {
            const str = data.toString();
            console.log(`[Agent]: ${str.trim()}`);
            logs.push(str);
          });

          childProcess.stderr?.on('data', (data) => {
            const str = data.toString();
            console.error(`[Agent Err]: ${str.trim()}`);
            logs.push(str);
          });

          childProcess.on('exit', (code) => {
            console.log(`Agent exited with code ${code}`);
            if (code !== 0) {
                logs.push(`Error: Process exited with code ${code}`);
            }
            resolve(); 
          });
        });
      },
      stop: () => {
        if (childProcess) {
          try {
             childProcess.kill(); 
          } catch(e) {}
        }
      },
      getLogs: () => logs,
      getMetrics: () => {
        const mcpLogFile = getLatestLogFile(mcpLogsDir, startTime);
        console.log(`[Benchmark] Analysing MCP Log: ${mcpLogFile || 'None found'}`);
        return parseMetrics(logs, mcpLogFile);
      }
    };

    await use(session);

    session.stop();

    const metrics = session.getMetrics();
    testInfo.annotations.push({
      type: 'benchmark-metrics',
      description: JSON.stringify({
        stepEfficiency: metrics.stepCount,
        tokenUsage: metrics.tokenUsage,
        reliabilityScore: metrics.reliabilityScore
      })
    });
  }
});
