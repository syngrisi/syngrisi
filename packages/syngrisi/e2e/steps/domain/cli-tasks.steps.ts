import { When } from '@fixtures';
import type { AppServerFixture } from '@fixtures';
import { createLogger } from '@lib/logger';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);
const logger = createLogger('CliTasksSteps');

When(
  'I run CLI task {string} with args {string}',
  async (
    { appServer }: { appServer: AppServerFixture },
    taskName: string,
    args: string
  ) => {
    const syngrisiPackagePath = path.resolve(__dirname, '../../../');
    const taskScriptMap: Record<string, string> = {
      consistency: 'dist/tasks/cli/handle-database-consistency.cli.js',
      'old-checks': 'dist/tasks/cli/handle-old-checks.cli.js',
      'old-logs': 'dist/tasks/cli/remove-old-logs.cli.js',
    };

    const scriptPath = taskScriptMap[taskName];
    if (!scriptPath) {
      throw new Error(`Unknown CLI task: ${taskName}`);
    }

    const fullScriptPath = path.join(syngrisiPackagePath, scriptPath);
    logger.info(`Running CLI task: ${taskName} with args: "${args}"`);
    logger.info(`Script path: ${fullScriptPath}`);
    logger.info(`Working directory: ${syngrisiPackagePath}`);

    try {
      const trimmedArgs = args.trim();
      const command = trimmedArgs
        ? `cd ${syngrisiPackagePath} && node ${scriptPath} ${trimmedArgs}`
        : `cd ${syngrisiPackagePath} && node ${scriptPath}`;
      logger.info(`Executing command: ${command}`);

      const { stdout, stderr } = await execAsync(command, {
        env: {
          ...process.env,
          SYNGRISI_DB_URI: appServer.config.connectionString,
          SYNGRISI_IMAGES_PATH: appServer.config.defaultImagesPath,
        },
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer for large outputs
      });

      if (stdout) {
        logger.info(`Task output:\n${stdout}`);
      }
      if (stderr) {
        logger.warn(`Task stderr:\n${stderr}`);
      }

      logger.info(`CLI task "${taskName}" completed successfully`);
    } catch (error: any) {
      logger.error(`CLI task "${taskName}" failed:`, error);
      logger.error(`stdout: ${error.stdout}`);
      logger.error(`stderr: ${error.stderr}`);
      throw new Error(`CLI task "${taskName}" failed: ${error.message}`);
    }
  }
);
