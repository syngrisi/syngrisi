import { execFile } from 'node:child_process';
import process from 'node:process';

import { getAllSessionStates, type TestEngineSessionState } from './test-engine-state';

const PROCESS_WHITELIST = ['codex', 'gemini', 'claude'];
const NPM_PACKAGE_PATTERNS = [
  '@anthropic-ai/claude-code',
  'claude-code',
  '@openai/codex',
  '@google/gemini-cli',
  'gemini-cli',
];

export type AgentIdSource =
  | 'cli'
  | 'system_thread'
  | 'process_tree_exact'
  | 'process_tree_npm'
  | 'process_tree_contains'
  | 'state';

export interface ResolvedAgentIdentity {
  agentId: string;
  source: AgentIdSource;
  warning?: string;
}

export interface ResolveAgentIdentityOptions {
  envAgentId?: string;
  ppid?: number;
}

const validateAgentId = (agentId: string): string => {
  if (!agentId) {
    throw new Error(
      'System thread is empty. Provide --system-thread/SYSTEM_THREAD or ensure the agent process is detectable.',
    );
  }

  if (!/^[A-Za-z0-9._-]{1,64}$/u.test(agentId)) {
    throw new Error(`Agent ID must match [A-Za-z0-9._-]{1,64}. Received: "${agentId}".`);
  }

  return agentId;
};

const execPs = (args: string[]): Promise<string> => (
  new Promise((resolve, reject) => {
    execFile('ps', args, { encoding: 'utf8' }, (error, stdout) => {
      if (error) {
        reject(error instanceof Error ? error : new Error(String(error)));
        return;
      }
      resolve(stdout.trim());
    });
  })
);

const getProcessCommand = async (pid: number): Promise<string | null> => {
  try {
    const output = await execPs(['-o', 'command=', '-p', String(pid)]);
    return output || null;
  } catch {
    return null;
  }
};

const getParentPid = async (pid: number): Promise<number | null> => {
  try {
    const output = await execPs(['-o', 'ppid=', '-p', String(pid)]);
    const parent = Number.parseInt(output, 10);
    return Number.isFinite(parent) ? parent : null;
  } catch {
    return null;
  }
};

export const isProcessAlive = async (pid: number): Promise<boolean> => {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
};

const resolveAgentIdFromState = async (): Promise<string | null> => {
  const states = await getAllSessionStates();
  if (states.length === 0) {
    return null;
  }

  const aliveStates: TestEngineSessionState[] = [];
  for (const state of states) {
    if (await isProcessAlive(state.daemonPid)) {
      aliveStates.push(state);
    }
  }

  const candidates = aliveStates.length > 0 ? aliveStates : states;
  if (candidates.length === 1) {
    return candidates[0]?.agentId ?? null;
  }

  return null;
};

export const resolveAgentIdentity = async (
  options: ResolveAgentIdentityOptions = {},
): Promise<ResolvedAgentIdentity> => {
  const { envAgentId, ppid } = options;
  const disableProcessTreeHeuristics = process.env.TEST_ENGINE_DISABLE_PROCESS_TREE_HEURISTICS === '1';

  if (envAgentId?.trim()) {
    return {
      agentId: validateAgentId(envAgentId.trim()),
      source: 'cli',
    };
  }

  if (process.env.SYSTEM_THREAD?.trim()) {
    return {
      agentId: validateAgentId(process.env.SYSTEM_THREAD.trim()),
      source: 'system_thread',
    };
  }

  if (!disableProcessTreeHeuristics) {
    let currentPid = typeof ppid === 'number' ? ppid : process.ppid;
    const exactMatches = new Set<number>();
    const npmMatches = new Set<number>();
    const containsMatches = new Set<number>();

    while (currentPid && currentPid > 1) {
      const command = await getProcessCommand(currentPid);
      if (command) {
        const normalized = command.toLowerCase();
        const executable = command.split(/\s+/u)[0]?.split('/').pop()?.toLowerCase() ?? '';

        if (PROCESS_WHITELIST.includes(executable)) {
          exactMatches.add(currentPid);
        }

        if (NPM_PACKAGE_PATTERNS.some((pattern) => normalized.includes(pattern))) {
          npmMatches.add(currentPid);
        }

        if (PROCESS_WHITELIST.some((item) => normalized.includes(item))) {
          containsMatches.add(currentPid);
        }
      }

      const parentPid = await getParentPid(currentPid);
      if (!parentPid || parentPid === currentPid) {
        break;
      }
      currentPid = parentPid;
    }

    if (exactMatches.size === 1) {
      return {
        agentId: String([...exactMatches][0]),
        source: 'process_tree_exact',
        warning: 'Resolved system thread via process tree heuristic. Prefer --system-thread for deterministic routing.',
      };
    }

    if (npmMatches.size === 1) {
      return {
        agentId: String([...npmMatches][0]),
        source: 'process_tree_npm',
        warning: 'Resolved system thread via process tree heuristic. Prefer --system-thread for deterministic routing.',
      };
    }

    if (containsMatches.size === 1) {
      return {
        agentId: String([...containsMatches][0]),
        source: 'process_tree_contains',
        warning: 'Resolved system thread via process tree heuristic. Prefer --system-thread for deterministic routing.',
      };
    }
  }

  const stateAgentId = await resolveAgentIdFromState();
  if (stateAgentId) {
    return {
      agentId: stateAgentId,
      source: 'state',
      warning: 'Resolved system thread from local state cache. Prefer --system-thread for deterministic routing.',
    };
  }

  throw new Error(
    `Unable to resolve system thread. Set SYSTEM_THREAD, pass --system-thread, or ensure an ancestor process includes: ${PROCESS_WHITELIST.join(', ')}.`,
  );
};
