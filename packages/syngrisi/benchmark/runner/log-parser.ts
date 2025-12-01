import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface McpLogEvent {
  raw: string;
  data?: Record<string, unknown>;
  timestamp?: string;
  message?: string;
  level?: string;
}

const defaultLogDir = path.resolve(
  __dirname,
  "..",
  "..",
  "e2e",
  "support",
  "mcp",
  "logs"
);

interface LogFileInfo {
  file: string;
  mtimeMs: number;
}

export async function listLogFiles(
  logDir: string = defaultLogDir
): Promise<LogFileInfo[]> {
  const entries = await fs.readdir(logDir).catch(() => []);
  const logFiles = await Promise.all(
    entries
      .filter((file) => file.endsWith(".jsonl"))
      .map(async (file) => {
        const fullPath = path.join(logDir, file);
        const stat = await fs.stat(fullPath).catch(() => null);
        return stat ? { file: fullPath, mtimeMs: stat.mtimeMs } : null;
      })
  );
  return logFiles.filter((f): f is LogFileInfo => Boolean(f));
}

export async function getLatestLogFile(
  logDir: string = defaultLogDir,
  afterMs?: number
): Promise<string | null> {
  const logFiles = await listLogFiles(logDir);
  const sorted = logFiles
    .filter((f) => (afterMs ? f.mtimeMs >= afterMs : true))
    .sort((a, b) => b.mtimeMs - a.mtimeMs);
  return sorted[0]?.file ?? null;
}

export async function parseLogFile(filePath: string): Promise<McpLogEvent[]> {
  const content = await fs.readFile(filePath, "utf-8");
  const lines = content.split(/\r?\n/).filter(Boolean);
  const events: McpLogEvent[] = [];

  for (const line of lines) {
    const event: McpLogEvent = { raw: line };
    try {
      const parsed = JSON.parse(line) as Record<string, unknown>;
      event.data = parsed;
      if (typeof parsed["timestamp"] === "string") {
        event.timestamp = parsed["timestamp"];
      }
      if (typeof parsed["message"] === "string") {
        event.message = parsed["message"];
      }
      if (typeof parsed["level"] === "string") {
        event.level = parsed["level"];
      }
    } catch {
      // keep raw line for downstream heuristics
    }
    events.push(event);
  }

  return events;
}

export async function parseLatestLog(
  logDir: string = defaultLogDir
): Promise<{ file: string | null; events: McpLogEvent[] }> {
  const file = await getLatestLogFile(logDir);
  if (!file) {
    return { file: null, events: [] };
  }
  const events = await parseLogFile(file);
  return { file, events };
}
