import net from 'node:net';
import { execFile } from 'node:child_process';
import {
  DEFAULT_PORT,
  env,
  HTTP_AVAILABILITY_POLL_INTERVAL_MS,
  PORT_CHECK_POLL_INTERVAL_MS,
  PORT_RECLAIM_TIMEOUT_MS,
  PORT_SEARCH_ATTEMPTS,
  SERVER_READY_TIMEOUT_MS,
  SOCKET_CONNECTION_TIMEOUT_MS,
} from '../config';
import { formatError } from './common';
import { waitFor } from '@utils/common';

export async function isPortAvailable(port: number): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    const server = net.createServer();
    server.once('error', () => {
      server.close();
      resolve(false);
    });
    server.listen(port, env.MCP_DEFAULT_HOST, () => {
      server.close(() => resolve(true));
    });
  });
}

export async function findEphemeralPort(): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    const server = net.createServer();
    server.once('error', (error: Error) => {
      reject(error);
    });
    server.listen(0, env.MCP_DEFAULT_HOST, () => {
      const address = server.address();
      server.close(() => {
        if (typeof address === 'object' && address) {
          resolve(address.port);
        } else {
          reject(new Error('Failed to find a free port'));
        }
      });
    });
  });
}

export async function findAvailablePort(startPort: number): Promise<number> {
  if (startPort <= 0) {
    return findEphemeralPort();
  }
  for (let port = startPort, attempts = 0; attempts < PORT_SEARCH_ATTEMPTS; port += 1, attempts += 1) {
    const available = await isPortAvailable(port);
    if (available) {
      return port;
    }
  }
  return findEphemeralPort();
}

const getProcessIdsOnPort = async (port: number): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    execFile('lsof', ['-ti', `:${port}`], (error, stdout, _stderr) => {
      if (error) {
        const err = error as NodeJS.ErrnoException;
        // Exit code 1 means no processes found
        if (String(err.code) === '1') {
          resolve([]);
          return;
        }
        reject(error);
        return;
      }
      const pids = stdout
        .split('\n')
        .map((pid) => pid.trim())
        .filter(Boolean);
      resolve(pids);
    });
  });
};

const terminateProcess = (pid: number, logFn: (msg: string) => void): boolean => {
  try {
    process.kill(pid, 'SIGKILL');
    logFn(`Terminated process ${pid}`);
    return true;
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    // ESRCH means process doesn't exist - not really an error
    if (err.code === 'ESRCH') {
      logFn(`Process ${pid} no longer exists`);
      return true;
    }
    logFn(`Failed to terminate process ${pid}: ${formatError(error)}`);
    return false;
  }
};

export async function killProcessOnPort(port: number, logFn: (msg: string) => void): Promise<void> {
  if (process.platform === 'win32') {
    logFn(`Port ${port} is busy but automatic reclamation is not supported on Windows`);
    return;
  }
  
  try {
    const pids = await getProcessIdsOnPort(port);
    if (pids.length === 0) {
      return;
    }
    
    logFn(`Found ${pids.length} process(es) on port ${port}`);
    for (const pid of pids) {
      terminateProcess(Number(pid), logFn);
    }
  } catch (error) {
    logFn(`Unable to reclaim port ${port}: ${formatError(error)}`);
  }
}

const waitForPort = async (port: number, timeoutMs: number): Promise<boolean> => {
  try {
    await waitFor(() => isPortAvailable(port), {
      timeoutMs,
      intervalMs: PORT_CHECK_POLL_INTERVAL_MS,
      description: `port ${port} to become available`,
    });
    return true;
  } catch {
    return false;
  }
};

export async function ensurePortFree(port: number, logFn: (msg: string) => void): Promise<void> {
  if (port <= 0) {
    return;
  }
  
  if (await isPortAvailable(port)) {
    return;
  }
  
  logFn(`Port ${port} is busy; attempting to reclaim it`);
  await killProcessOnPort(port, logFn);

  const isNowAvailable = await waitForPort(port, PORT_RECLAIM_TIMEOUT_MS);
  if (!isNowAvailable) {
    logFn(`Port ${port} remains busy after reclamation attempt`);
  }
}

export async function isServerRunning(port: number): Promise<boolean> {
  try {
    const response = await fetch(`http://${env.MCP_DEFAULT_HOST}:${port}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

export async function waitForHttpAvailability(port: number): Promise<void> {
  await waitFor(
    async () => {
      // Check if port is accepting connections by attempting to connect
      return new Promise<boolean>((resolve) => {
        const socket = new net.Socket();
        let resolved = false;

        const cleanup = (result: boolean) => {
          if (resolved) return;
          resolved = true;
          socket.destroy();
          resolve(result);
        };

        // Set socket timeout to prevent hanging
        socket.setTimeout(SOCKET_CONNECTION_TIMEOUT_MS);

        socket.once('connect', () => cleanup(true));
        socket.once('error', () => cleanup(false));
        socket.once('timeout', () => cleanup(false));

        socket.connect(port, env.MCP_DEFAULT_HOST);
      });
    },
    {
      timeoutMs: SERVER_READY_TIMEOUT_MS,
      intervalMs: HTTP_AVAILABILITY_POLL_INTERVAL_MS,
      description: `HTTP server on port ${port}`,
    }
  );
}

// const parsePortNumber = (value: string): number | null => {
//   const parsed = Number.parseInt(value, 10);
//   if (Number.isFinite(parsed) && parsed >= 0) {
//     return parsed;
//   }
//   return null;
// };

// export function resolvePreferredPort(raw: unknown, fallback: number = DEFAULT_PORT): number {
//   // Handle numeric input
//   if (typeof raw === 'number' && Number.isFinite(raw) && raw >= 0) {
//     return raw;
//   }
  
//   // Handle string input
//   if (typeof raw === 'string') {
//     const trimmed = raw.trim();
//     if (trimmed) {
//       const parsed = parsePortNumber(trimmed);
//       if (parsed !== null) {
//         return parsed;
//       }
//     }
//   }
  
//   return fallback;
// }
