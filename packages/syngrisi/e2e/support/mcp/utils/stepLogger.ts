import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { getMcpLogsDir } from './logPath';

// Get the absolute path to the MCP logs directory
const logsDir = getMcpLogsDir();

const ensureLogsDir = async (): Promise<void> => {
  await mkdir(logsDir, { recursive: true });
};

export const generateSessionId = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).slice(2, 8);
  return `${timestamp}_${random}`;
};

export const createSafeSessionFilename = (sessionName: string): string => {
  const safe = sessionName
    .replace(/[^a-zA-Z0-9\-_\s]/g, '')
    .replace(/\s+/g, '_')
    .toLowerCase();
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${safe}_${Date.now()}_${suffix}`;
};

let currentSessionId: string | null = null;
let currentSessionName: string | null = null;

export const initializeSession = (): string => {
  if (!currentSessionId) {
    currentSessionId = generateSessionId();
  }
  return currentSessionId;
};

export const startNewSession = (sessionName: string): string => {
  currentSessionName = sessionName;
  currentSessionId = createSafeSessionFilename(sessionName);
  return currentSessionId;
};

export const getCurrentSessionId = (): string => {
  if (!currentSessionId) {
    currentSessionId = generateSessionId();
  }
  return currentSessionId;
};

export const getSessionInfo = (): { name: string | null; id: string } => ({
  name: currentSessionName,
  id: getCurrentSessionId(),
});

export const logStepExecution = async (
  keyword: string,
  stepText: string,
  status: string,
  sessionId?: string,
  errorMessage?: string,
): Promise<void> => {
  const sid = sessionId ?? getCurrentSessionId();
  await ensureLogsDir();
  const logFile = path.join(logsDir, `${sid}.jsonl`);

  const now = new Date();
  const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now
    .getMinutes()
    .toString()
    .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now
    .getMilliseconds()
    .toString()
    .padStart(3, '0')}`;

  const entry = {
    timestamp,
    keyword,
    stepText,
    status,
    sessionId: sid,
    ...(currentSessionName ? { sessionName: currentSessionName } : {}),
    ...(errorMessage ? { errorMessage: errorMessage.replace(/\s+/g, ' ') } : {}),
  };

  await appendFile(logFile, `${JSON.stringify(entry)}\n`, 'utf8');
};
