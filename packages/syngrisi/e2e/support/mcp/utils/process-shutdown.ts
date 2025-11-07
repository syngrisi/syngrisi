import { once } from 'node:events';
import type { ChildProcess } from 'node:child_process';
import { GRACEFUL_SHUTDOWN_TIMEOUT_MS } from '../config';

export interface ShutdownOptions {
  expected?: boolean;
  logFn: (msg: string) => void;
}

export async function shutdownChildProcess(
  child: ChildProcess | null,
  options: ShutdownOptions
): Promise<void> {
  if (!child) {
    return;
  }

  const { expected = false, logFn } = options;

  if (child.exitCode !== null || child.signalCode !== null) {
    return;
  }

  const exitPromise = once(child, 'exit')
    .then(() => true as const)
    .catch(() => false as const);

  const waitWithTimeout = async (timeoutMs: number): Promise<boolean> => {
    return Promise.race([
      exitPromise,
      new Promise<boolean>((resolve) => {
        setTimeout(() => resolve(false), timeoutMs);
      }),
    ]);
  };

  if (await waitWithTimeout(GRACEFUL_SHUTDOWN_TIMEOUT_MS)) {
    return;
  }

  const attemptSignal = async (signal: NodeJS.Signals, timeout: number): Promise<boolean> => {
    try {
      child.kill(signal);
    } catch {
      // best effort; process may already be terminating
    }
    return waitWithTimeout(timeout);
  };

  if (await attemptSignal('SIGINT', GRACEFUL_SHUTDOWN_TIMEOUT_MS)) {
    return;
  }

  if (process.platform !== 'win32' && await attemptSignal('SIGTERM', 2_000)) {
    return;
  }

  const hardSignal = process.platform === 'win32' ? 'SIGTERM' : 'SIGKILL';
  const forcedExit = await attemptSignal(hardSignal, 1_000);
  
  if (!forcedExit) {
    logFn('Child process did not exit after hard signal; it may remain running.');
  }
}
