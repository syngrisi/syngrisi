/**
 * Global setup for Playwright tests
 * Cleans up orphan MCP server and browser processes before test run
 */

import { execSync } from 'node:child_process';

async function globalSetup() {
  console.log('[GLOBAL SETUP] Cleaning up orphan processes...');

  // const processPatterns = [
  //   'mcp.*server',
  //   'bridge-cli',
  //   'chromium.*headless',
  // ];

  // const currentPid = process.pid;
  // const parentPid = process.ppid;

  // for (const pattern of processPatterns) {
  //   try {
  //     // // Get PIDs matching the pattern, excluding current process tree
  //     // // Get PIDs matching the pattern, excluding current process tree
  //     // const cmd = process.platform === 'darwin' || process.platform === 'linux'
  //     //   ? `pgrep -f "${pattern}" 2>/dev/null || true`
  //     //   : `tasklist /FI "IMAGENAME eq node.exe" /FO CSV 2>nul || echo ""`;

  //     // const result = execSync(cmd, { encoding: 'utf-8' }).trim();

  //     // if (result) {
  //     //   const pids = result.split('\n').filter(Boolean).map(p => parseInt(p, 10));

  //     //   for (const pid of pids) {
  //     //     // Don't kill current process or parent
  //     //     if (pid === currentPid || pid === parentPid || isNaN(pid)) continue;

  //     //     try {
  //     //       // Check if process is actually orphan (not part of current test run)
  //     //       const killCmd = process.platform === 'win32'
  //     //         ? `taskkill /PID ${pid} /F`
  //     //         : `kill -9 ${pid}`;

  //     //       execSync(killCmd, { encoding: 'utf-8', stdio: 'ignore' });
  //     //       console.log(`[GLOBAL SETUP] Killed orphan process: ${pid} (pattern: ${pattern})`);
  //     // } catch {
  //     //   // Process may have already exited
  //     // }
  //     // }
  //     // }
  //   } catch {
  //     // Pattern not found or command failed - that's fine
  //   }
  // }

  // // Kill any orphan node processes listening on MCP test ports (55000-60000 range)
  // if (process.platform !== 'win32') {
  //   try {
  //     const portsCmd = `lsof -i :55000-60000 -t 2>/dev/null || true`;
  //     const portPids = execSync(portsCmd, { encoding: 'utf-8' }).trim();

  //     if (portPids) {
  //       for (const pidStr of portPids.split('\n').filter(Boolean)) {
  //         const pid = parseInt(pidStr, 10);
  //         if (pid === currentPid || pid === parentPid || isNaN(pid)) continue;

  //         try {
  //           execSync(`kill -9 ${pid}`, { stdio: 'ignore' });
  //           console.log(`[GLOBAL SETUP] Killed process on MCP port: ${pid}`);
  //         } catch {
  //           // Already dead
  //         }
  //       }
  //     }
  //   } catch {
  //     // lsof not available or failed
  //   }
  // }

  console.log('[GLOBAL SETUP] Cleanup complete');
}

export default globalSetup;
