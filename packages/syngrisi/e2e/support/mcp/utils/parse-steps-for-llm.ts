#!/usr/bin/env tsx

import fs from 'node:fs';
import path from 'node:path';
import { stepsRoot, mcpRoot } from '../config';
import type { StepDefinitionSummary, StepFileSummary } from './types';

const STEP_DIRECTORIES = [stepsRoot, path.join(mcpRoot, 'sd')];
const STEP_FILE_EXTENSIONS = new Set(['.ts', '.js']);
const ALWAYS_INCLUDE = new Set(['diagnostics.sd.ts']);

interface Options {
  file?: string;
}

const parseArgs = (): Options => {
  const opts: Options = {};
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--file' && args[i + 1]) {
      opts.file = args[i + 1];
      i += 1;
    }
  }
  return opts;
};

const STEP_TYPE_PATTERNS = {
  Given: [
    /Given\s*\(\s*'([^']+)'/g,
    /Given\s*\(\s*"([^"]+)"/g,
    /Given\s*\(\s*`([^`]+)`/g,
    /Given\s*\(\s*\/((?:[^\/\\]|\\.)*)\/[gimuy]*[\s,]/g,
  ],
  When: [
    /When\s*\(\s*'([^']+)'/g,
    /When\s*\(\s*"([^"]+)"/g,
    /When\s*\(\s*`([^`]+)`/g,
    /When\s*\(\s*\/((?:[^\/\\]|\\.)*)\/[gimuy]*[\s,]/g,
  ],
  Then: [
    /Then\s*\(\s*'([^']+)'/g,
    /Then\s*\(\s*"([^"]+)"/g,
    /Then\s*\(\s*`([^`]+)`/g,
    /Then\s*\(\s*\/((?:[^\/\\]|\\.)*)\/[gimuy]*[\s,]/g,
  ],
} as const;

const extractDescription = (lines: string[], startLine: number): string | undefined => {
  const collected: string[] = [];
  let lineIndex = startLine - 1;
  let inJsDoc = false;

  while (lineIndex >= 0) {
    const rawLine = lines[lineIndex];
    const trimmed = rawLine.trim();

    if (!inJsDoc && trimmed === '') {
      lineIndex -= 1;
      continue;
    }

    if (!inJsDoc && trimmed.startsWith('//')) {
      collected.unshift(trimmed.replace(/^\/\/\s?/, ''));
      lineIndex -= 1;
      continue;
    }

    if (trimmed.endsWith('*/')) {
      inJsDoc = true;
      lineIndex -= 1;
      continue;
    }

    if (inJsDoc) {
      if (trimmed.startsWith('/**')) {
        const text = trimmed.replace(/^\/\*\*\s?/, '');
        if (text) {
          collected.unshift(text.replace(/\*\//, '').trim());
        }
        break;
      }
      collected.unshift(trimmed.replace(/^\*\s?/, ''));
      lineIndex -= 1;
      continue;
    }

    break;
  }

  const description = collected.join('\n').trim();
  return description.length > 0 ? description : undefined;
};

const extractStepsFromFile = (filePath: string): StepDefinitionSummary[] => {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/);
  const steps: StepDefinitionSummary[] = [];

  Object.entries(STEP_TYPE_PATTERNS).forEach(([, patterns]) => {
    for (const regex of patterns) {
      let match: RegExpExecArray | null;
      const pattern = new RegExp(regex);
      pattern.lastIndex = 0;
      while ((match = pattern.exec(content)) !== null) {
        const matchedText = match[1];
        if (!matchedText) continue;

        const index = match.index ?? 0;
        const precedingContent = content.slice(0, index);
        const lineNumber = precedingContent.split(/\r?\n/).length - 1;

        const description = extractDescription(lines, lineNumber);

        steps.push({
          pattern: matchedText.trim(),
          description: description ?? '',
          line: lineNumber + 1,
        });
      }
    }
  });

  return steps;
};

const shouldIncludeFile = (fileName: string, steps: StepDefinitionSummary[]) => {
  if (steps.length === 0) return false;
  if (ALWAYS_INCLUDE.has(path.basename(fileName))) return true;
  return true;
};

const walkStepDirectories = (dirs: string[], filter?: string): StepFileSummary[] => {
  const summaries: StepFileSummary[] = [];

  const processDir = (dirPath: string) => {
    if (!fs.existsSync(dirPath)) return;
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        processDir(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (!STEP_FILE_EXTENSIONS.has(ext)) continue;
        if (filter && !fullPath.endsWith(filter)) continue;

        const steps = extractStepsFromFile(fullPath);
        if (!shouldIncludeFile(entry.name, steps)) continue;

        summaries.push({
          fileName: path.relative(path.resolve(stepsRoot, '..'), fullPath),
          steps: steps.sort((a, b) => a.pattern.localeCompare(b.pattern)),
        });
      }
    }
  };

  dirs.forEach(processDir);
  return summaries.sort((a, b) => a.fileName.localeCompare(b.fileName));
};

const main = () => {
  const options = parseArgs();
  const files = walkStepDirectories(STEP_DIRECTORIES, options.file);
  const output = {
    metadata: {
      generatedAt: new Date().toISOString(),
      totalFiles: files.length,
      totalSteps: files.reduce((total, file) => total + file.steps.length, 0),
    },
    files,
  };

  process.stdout.write(JSON.stringify(output));
};

main();
