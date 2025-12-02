import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const benchRoot = path.resolve(__dirname, "..");
const logFile = path.join(benchRoot, "logs", "bench-run.log");

async function ensureLogDir() {
  await fs.mkdir(path.dirname(logFile), { recursive: true });
}

export async function appendRunLog(lines: string | string[]) {
  await ensureLogDir();
  const payload = Array.isArray(lines) ? lines.join("\n") : lines;
  await fs.appendFile(logFile, `${payload}\n`, "utf-8");
}
