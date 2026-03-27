import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export interface TestEngineSessionState {
  agentId: string;
  sessionName: string;
  daemonPid: number;
  daemonPort: number;
  headed: boolean;
  mode: 'start' | 'attach';
  startedAt: string;
  lastActivity: string;
  sessionId?: string;
  logFile?: string;
  initializing?: boolean;
  initError?: string;
}

const getCacheRoot = (): string => {
  if (process.env.XDG_CACHE_HOME) {
    return process.env.XDG_CACHE_HOME;
  }
  return path.join(os.homedir(), '.cache');
};

export const getTestEngineStateDir = (): string => path.join(getCacheRoot(), 'syngrisi', 'test-engine-cli');

export const getTestEngineStatePath = (agentId: string): string => (
  path.join(getTestEngineStateDir(), `agent-${agentId}.json`)
);

export const ensureTestEngineStateDir = async (): Promise<void> => {
  await fs.promises.mkdir(getTestEngineStateDir(), { recursive: true });
};

export const readSessionState = async (agentId: string): Promise<TestEngineSessionState | null> => {
  try {
    const raw = await fs.promises.readFile(getTestEngineStatePath(agentId), 'utf8');
    return JSON.parse(raw) as TestEngineSessionState;
  } catch {
    return null;
  }
};

export const writeSessionState = async (agentId: string, state: TestEngineSessionState): Promise<void> => {
  await ensureTestEngineStateDir();
  await fs.promises.writeFile(getTestEngineStatePath(agentId), JSON.stringify(state, null, 2), 'utf8');
};

export const removeSessionState = async (agentId: string): Promise<void> => {
  try {
    await fs.promises.unlink(getTestEngineStatePath(agentId));
  } catch {
    // Ignore missing file.
  }
};

export const updateSessionActivity = async (agentId: string): Promise<void> => {
  const state = await readSessionState(agentId);
  if (!state) {
    return;
  }

  state.lastActivity = new Date().toISOString();
  await writeSessionState(agentId, state);
};

export const getAllSessionStates = async (): Promise<TestEngineSessionState[]> => {
  try {
    const entries = await fs.promises.readdir(getTestEngineStateDir());
    const states = await Promise.all(entries
      .filter((entry) => entry.startsWith('agent-') && entry.endsWith('.json'))
      .map(async (entry) => {
        try {
          const raw = await fs.promises.readFile(path.join(getTestEngineStateDir(), entry), 'utf8');
          return JSON.parse(raw) as TestEngineSessionState;
        } catch {
          return null;
        }
      }));

    return states.filter((state): state is TestEngineSessionState => state !== null);
  } catch {
    return [];
  }
};

export const waitForSessionStateReady = async (
  agentId: string,
  timeoutMs = 30000,
  pollMs = 200,
): Promise<TestEngineSessionState> => {
  const startedAt = Date.now();
  let lastState: TestEngineSessionState | null = null;

  while (Date.now() - startedAt < timeoutMs) {
    const state = await readSessionState(agentId);
    lastState = state;

    if (state && !state.initializing) {
      return state;
    }

    await new Promise((resolve) => setTimeout(resolve, pollMs));
  }

  if (lastState?.initError) {
    throw new Error(lastState.initError);
  }

  throw new Error(`Timed out waiting for session state readiness for agent ${agentId}.`);
};
