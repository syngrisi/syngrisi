// Using relative path instead of @logger alias to allow bridge-cli.ts to run from any directory
// without requiring tsconfig.json path resolution (fixes "Cannot find module '@logger'" errors)
import logger, { formatArgs } from './logger';

interface ErrorArtifacts {
  screenshotPath?: string;
  accessibilityTreePath?: string;
}

export type { ErrorArtifacts };

export const createErrorResponse = (message: string, artifacts?: ErrorArtifacts) => {
  const content: Array<{ type: 'text'; text: string }> = [
    {
      type: 'text' as const,
      text: `Status: Failed\nError: ${message}`,
    },
  ];

  if (artifacts?.screenshotPath) {
    content.push({
      type: 'text' as const,
      text: `\nScreenshot: ${artifacts.screenshotPath}`,
    });
  }

  if (artifacts?.accessibilityTreePath) {
    content.push({
      type: 'text' as const,
      text: `HTML (Emmet): ${artifacts.accessibilityTreePath}`,
    });
  }

  return {
    content,
    isError: true,
  };
};

export const createSuccessResponse = (message: string) => ({
  content: [
    {
      type: 'text' as const,
      text: `Status: Success\n${message}`,
    },
  ],
});

export const safeJsonParse = <T>(
  json: string,
  fallback: T,
): T => {
  try {
    return JSON.parse(json) as T;
  } catch (err) {
    logger.error(formatArgs('Failed to parse JSON:', err));
    return fallback;
  }
};
