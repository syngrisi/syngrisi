import { promises as fs } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import yaml from 'js-yaml';
import { mcpRoot } from '../config';
import type { Data, StepFileSummary } from './types';
import logger, { formatArgs } from './logger';

const STEPS_DIR = resolve(mcpRoot, 'steps');

const ensureDir = async (dirPath: string): Promise<void> => {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
};

interface YamlStepFileContent {
  metadata: {
    category: string;
    generatedAt: string;
    totalFiles: number;
    totalSteps: number;
    sourceFiles: string[];
  };
  steps: Array<{
    pattern: string;
    description: string;
    line?: number;
  }>;
}

const categorizeStepFiles = (stepDefinitions: Data): Map<string, StepFileSummary[]> => {
  const categories = new Map<string, StepFileSummary[]>();

  stepDefinitions.files.forEach((file) => {
    const fileName = file.fileName.toLowerCase();
    
    if (fileName.includes('diagnostics')) {
      const category = 'diagnostics';
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category)!.push(file);
      return;
    }

    if (fileName.includes('debug')) {
      const category = 'common/debug';
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category)!.push(file);
      return;
    }

    if (fileName.includes('llm')) {
      const category = 'common/llm';
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category)!.push(file);
      return;
    }

    if (fileName.includes('assertions')) {
      const category = 'common/assertions';
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category)!.push(file);
      return;
    }

    if (fileName.includes('domain') || fileName.includes('app')) {
      const category = 'domain/app';
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category)!.push(file);
      return;
    }

    if (fileName.includes('actions')) {
      const navigationSteps: typeof file.steps = [];
      const actionSteps: typeof file.steps = [];

      file.steps.forEach((step) => {
        const pattern = step.pattern.toLowerCase();
        if (pattern.includes('open') && (pattern.includes('url') || pattern.includes('site'))) {
          navigationSteps.push(step);
        } else {
          actionSteps.push(step);
        }
      });

      if (navigationSteps.length > 0) {
        const navCategory = 'common/navigation';
        if (!categories.has(navCategory)) {
          categories.set(navCategory, []);
        }
        categories.get(navCategory)!.push({
          fileName: file.fileName,
          steps: navigationSteps,
        });
      }

      if (actionSteps.length > 0) {
        const actionCategory = 'common/actions';
        if (!categories.has(actionCategory)) {
          categories.set(actionCategory, []);
        }
        categories.get(actionCategory)!.push({
          fileName: file.fileName,
          steps: actionSteps,
        });
      }
      return;
    }

    const category = 'common/other';
    if (!categories.has(category)) {
      categories.set(category, []);
    }
    categories.get(category)!.push(file);
  });

  return categories;
};

export const saveStepDefinitionsToFile = async (stepDefinitions: Data): Promise<string[]> => {
  await ensureDir(STEPS_DIR);
  
  const categories = categorizeStepFiles(stepDefinitions);
  const createdFiles: string[] = [];
  const generatedAt = new Date().toISOString();

  for (const [category, files] of categories.entries()) {
    const yamlFilePath = join(STEPS_DIR, `${category}.steps.yaml`);
    await ensureDir(dirname(yamlFilePath));

    const allSteps = files.flatMap(f => f.steps);
    
    const yamlContent = {
      metadata: {
        category,
        generatedAt,
        totalFiles: files.length,
        totalSteps: allSteps.length,
        sourceFiles: files.map(f => f.fileName),
      },
      steps: allSteps.map(step => ({
        pattern: step.pattern,
        description: step.description,
        ...(step.line ? { line: step.line } : {}),
      })),
    };

    const yamlString = yaml.dump(yamlContent, {
      lineWidth: -1,
      noRefs: true,
      sortKeys: false,
    });

    await fs.writeFile(yamlFilePath, yamlString, 'utf-8');
    createdFiles.push(yamlFilePath);
    logger.info(formatArgs(`💾 Step definitions saved to ${yamlFilePath}`));
  }

  return createdFiles.sort();
};

export const loadStepDefinitionsFromFile = async (): Promise<Data | null> => {
  try {
    const files = await fs.readdir(STEPS_DIR, { recursive: true });
    const yamlFiles = files.filter((f) => 
      typeof f === 'string' && f.endsWith('.steps.yaml')
    );

    if (yamlFiles.length === 0) {
      return null;
    }

    const allFiles: StepFileSummary[] = [];

    for (const yamlFile of yamlFiles) {
      const filePath = join(STEPS_DIR, yamlFile);
      const content = await fs.readFile(filePath, 'utf-8');
      const parsed = yaml.load(content) as YamlStepFileContent;
      
      if (parsed?.metadata?.sourceFiles && parsed?.steps) {
        parsed.metadata.sourceFiles.forEach((sourceFileName: string) => {
          allFiles.push({
            fileName: sourceFileName,
            steps: parsed.steps,
          });
        });
      }
    }

    return { files: allFiles };
  } catch (error) {
    logger.error(formatArgs('Failed to load step definitions from YAML files:', error));
    return null;
  }
};

export const getStepDefinitionsFilePath = async (): Promise<string[]> => {
  try {
    const files = await fs.readdir(STEPS_DIR, { recursive: true });
    const yamlFiles = files
      .filter((f) => typeof f === 'string' && f.endsWith('.steps.yaml'))
      .map((f) => join(STEPS_DIR, f))
      .sort();
    return yamlFiles;
  } catch {
    return [];
  }
};
