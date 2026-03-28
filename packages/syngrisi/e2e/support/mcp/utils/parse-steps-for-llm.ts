#!/usr/bin/env tsx

import fs from 'node:fs';
import path from 'node:path';
import { stepsRoot, mcpRoot } from '../config';
import type { StepDefinitionSummary, StepFileSummary } from './types';
import { getCustomStepDefinitions } from './customStepRegistry';
import { requirePlaywrightBddModule } from './playwrightBddPaths';

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

const loadTypeScriptModule = (modulePath: string) => {
  void require('tsx/cjs');
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require(modulePath);
  } catch {
    // Best-effort runtime discovery: a single broken module must not block
    // the whole step catalog for manual MCP flows.
  }
};

const loadAllStepModules = (dirs: string[]) => {
  const visit = (dirPath: string) => {
    if (!fs.existsSync(dirPath)) return;
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        visit(fullPath);
        continue;
      }
      if (!entry.isFile() || !/\.(ts|js)$/.test(entry.name) || entry.name.endsWith('.d.ts')) {
        continue;
      }
      loadTypeScriptModule(fullPath);
    }
  };

  dirs.forEach(visit);
};

const collectRuntimeStepSummaries = (filter?: string): StepFileSummary[] => {
  const regexSummaries = walkStepDirectories(STEP_DIRECTORIES, filter);
  const descriptionMap = new Map<string, StepDefinitionSummary>();

  regexSummaries.forEach((file) => {
    file.steps.forEach((step) => {
      descriptionMap.set(`${file.fileName}::${step.pattern}`, step);
    });
  });

  loadAllStepModules(STEP_DIRECTORIES);

  let stepDefinitions: Array<{
    patternString?: string;
    keyword?: string;
    uri?: string;
    line?: number;
  }> = [];

  try {
    stepDefinitions = requirePlaywrightBddModule<{ stepDefinitions: typeof stepDefinitions }>(
      'dist',
      'steps',
      'stepRegistry.js',
    ).stepDefinitions;
  } catch {
    return regexSummaries;
  }

  const grouped = new Map<string, StepDefinitionSummary[]>();
  const pushStep = (fileName: string, step: StepDefinitionSummary) => {
    if (filter && !fileName.endsWith(filter)) {
      return;
    }
    const existing = grouped.get(fileName) ?? [];
    if (!existing.some((item) => item.pattern === step.pattern)) {
      existing.push(step);
      grouped.set(fileName, existing);
    }
  };

  for (const definition of stepDefinitions) {
    const runtimePath = definition.uri
      ? path.relative(path.resolve(stepsRoot, '..'), definition.uri)
      : 'runtime/playwright-bdd';
    const pattern = definition.patternString?.trim();
    if (!pattern) continue;
    const described = descriptionMap.get(`${runtimePath}::${pattern}`);
    pushStep(runtimePath, {
      pattern,
      description: described?.description ?? '',
      line: definition.line ?? described?.line,
    });
  }

  try {
    for (const definition of getCustomStepDefinitions()) {
      const pattern = definition.patternString?.trim();
      if (!pattern) continue;
      const matchingEntry = regexSummaries.find((file) => file.steps.some((step) => step.pattern === pattern));
      const fileName = matchingEntry?.fileName ?? 'runtime/custom-registry';
      const described = descriptionMap.get(`${fileName}::${pattern}`);
      pushStep(fileName, {
        pattern,
        description: described?.description ?? '',
        line: described?.line,
      });
    }
  } catch {
    return regexSummaries;
  }

  if (grouped.size === 0) {
    return regexSummaries;
  }

  return [...grouped.entries()]
    .map(([fileName, steps]) => ({
      fileName,
      steps: steps.sort((a, b) => a.pattern.localeCompare(b.pattern)),
    }))
    .sort((a, b) => a.fileName.localeCompare(b.fileName));
};

const main = async () => {
  const options = parseArgs();
  const files = collectRuntimeStepSummaries(options.file);
  const output = {
    metadata: {
      generatedAt: new Date().toISOString(),
      totalFiles: files.length,
      totalSteps: files.reduce((total, file) => total + file.steps.length, 0),
      source: 'runtime-registry',
    },
    files,
  };

  process.stdout.write(JSON.stringify(output));
};

void main();
