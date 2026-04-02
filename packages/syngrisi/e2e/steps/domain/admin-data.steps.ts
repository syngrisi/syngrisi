import { Then, When } from '@fixtures';
import type { AppServerFixture, TestStore } from '@fixtures';
import { expect, type Page } from '@playwright/test';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import zlib from 'zlib';
import tar from 'tar-stream';
import yaml from 'yaml';
import { getWorkerTempDir } from '@utils/fs';
import { createDatabaseBackupArchive } from '../../../src/tasks/lib/dataBackupRestore';
import { ensureServerReady } from '@utils/app-server';

async function ensureWorkerFilePath(fileName: string): Promise<string> {
  const dir = path.join(getWorkerTempDir(), 'admin-data-artifacts');
  await fsPromises.mkdir(dir, { recursive: true });
  return path.join(dir, fileName);
}

function getStoredFilePath(testData: TestStore, key: string): string {
  const filePath = testData.get(key);
  if (!filePath || typeof filePath !== 'string') {
    throw new Error(`Stored file path "${key}" not found`);
  }
  return filePath;
}

async function createTarGzArchive(archivePath: string, files: Record<string, string>) {
  const pack = tar.pack();
  const gzip = zlib.createGzip();
  const output = fs.createWriteStream(archivePath);

  const completed = new Promise<void>((resolve, reject) => {
    output.on('finish', () => resolve());
    output.on('error', reject);
    gzip.on('error', reject);
    pack.on('error', reject);
  });

  pack.pipe(gzip).pipe(output);

  for (const [name, content] of Object.entries(files)) {
    await new Promise<void>((resolve, reject) => {
      pack.entry({ name }, Buffer.from(content, 'utf8'), (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }

  pack.finalize();
  await completed;
}

function getAdminDataJobEndpoint(baseURL: string, jobType: string): string {
  switch (jobType) {
    case 'db_backup':
      return `${baseURL}/v1/admin/data/db/backup`;
    case 'screenshots_backup':
      return `${baseURL}/v1/admin/data/screenshots/backup`;
    default:
      throw new Error(`Unsupported admin data job type "${jobType}"`);
  }
}

function getAdminDataJobType(jobLabel: string): string {
  switch (jobLabel) {
    case 'Database Backup':
      return 'db_backup';
    case 'Database Restore':
      return 'db_restore';
    case 'Screenshots Backup':
      return 'screenshots_backup';
    case 'Screenshots Restore':
      return 'screenshots_restore';
    default:
      throw new Error(`Unsupported admin data job label "${jobLabel}"`);
  }
}

async function waitForLatestJob(appServer: AppServerFixture, jobLabel: string, expectedStatus: string, expectedMessage: string) {
  const deadline = Date.now() + 300_000;
  const expectedType = getAdminDataJobType(jobLabel);

  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${appServer.baseURL}/v1/admin/data/jobs`, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        continue;
      }

      const payload = await response.json() as {
        jobs?: Array<{
          id: string;
          type: string;
          status: string;
          message: string;
          createdAt?: string;
          downloadAvailable?: boolean;
        }>;
      };
      const job = payload.jobs
        ?.filter((item) => item.type === expectedType)
        .sort((left, right) => {
          const leftTime = left.createdAt ? new Date(left.createdAt).getTime() : 0;
          const rightTime = right.createdAt ? new Date(right.createdAt).getTime() : 0;
          return rightTime - leftTime;
        })[0];

      const hasExpectedMessage = job?.message.includes(expectedMessage) ?? false;
      const isCompletedBackupReady =
        expectedStatus === 'completed' &&
        Boolean(job?.downloadAvailable) &&
        (job?.type === 'db_backup' || job?.type === 'screenshots_backup');

      if (job && job.status === expectedStatus && (hasExpectedMessage || isCompletedBackupReady)) {
        return;
      }
    } catch {
      // Database restore can temporarily interrupt job polling; wait for the backend to accept requests again.
      if (appServer.serverPort) {
        await ensureServerReady(appServer.serverPort, 30_000).catch(() => { });
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Timed out waiting for latest ${jobLabel} job to be ${expectedStatus} with message containing "${expectedMessage}"`);
}

async function waitForJobsCount(appServer: AppServerFixture, expectedCount: number) {
  const deadline = Date.now() + 30_000;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${appServer.baseURL}/v1/admin/data/jobs`, {
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        await new Promise((resolve) => setTimeout(resolve, 250));
        continue;
      }

      const payload = await response.json() as { jobs?: unknown[] };
      const jobs = payload.jobs ?? [];

      if (jobs.length === expectedCount) {
        return;
      }
    } catch {
      if (appServer.serverPort) {
        await ensureServerReady(appServer.serverPort, 30_000).catch(() => { });
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  const response = await fetch(`${appServer.baseURL}/v1/admin/data/jobs`, {
    headers: { Accept: 'application/json' },
  });
  const payload = await response.json() as { jobs?: unknown[] };
  const jobs = payload.jobs ?? [];
  expect(jobs.length).toBe(expectedCount);
}

async function getLatestJob(
  appServer: AppServerFixture,
  jobLabel: string,
  expectedStatus?: string
): Promise<{
  id: string;
  type: string;
  status: string;
  message: string;
  createdAt?: string;
  downloadAvailable?: boolean;
}> {
  const expectedType = getAdminDataJobType(jobLabel);
  const response = await fetch(`${appServer.baseURL}/v1/admin/data/jobs`, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load admin data jobs: ${response.status}`);
  }

  const payload = await response.json() as {
    jobs?: Array<{
      id: string;
      type: string;
      status: string;
      message: string;
      createdAt?: string;
      downloadAvailable?: boolean;
    }>;
  };

  const job = payload.jobs
    ?.filter((item) => item.type === expectedType && (!expectedStatus || item.status === expectedStatus))
    .sort((left, right) => {
      const leftTime = left.createdAt ? new Date(left.createdAt).getTime() : 0;
      const rightTime = right.createdAt ? new Date(right.createdAt).getTime() : 0;
      return rightTime - leftTime;
    })[0];

  if (!job) {
    throw new Error(`No admin data job found for "${jobLabel}"${expectedStatus ? ` with status "${expectedStatus}"` : ''}`);
  }

  return job;
}

async function listTarGzEntries(archivePath: string): Promise<string[]> {
  const entries: string[] = [];
  const extract = tar.extract();

  const completed = new Promise<string[]>((resolve, reject) => {
    extract.on('entry', (_header, stream, next) => {
      entries.push(_header.name);
      stream.on('error', reject);
      stream.on('end', () => next());
      stream.resume();
    });
    extract.on('finish', () => resolve(entries));
    extract.on('error', reject);
  });

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(archivePath)
      .on('error', reject)
      .pipe(zlib.createGunzip())
      .on('error', reject)
      .pipe(extract)
      .on('error', reject)
      .on('finish', () => resolve());
  });

  return completed;
}

When(
  'I create a database backup archive fixture stored as {string}',
  async ({ appServer, testData }: { appServer: AppServerFixture; testData: TestStore }, key: string) => {
    const archivePath = await ensureWorkerFilePath(`${key}.tar.gz`);
    await createDatabaseBackupArchive(appServer.config.connectionString, archivePath);
    testData.set(key, archivePath);
  }
);

When(
  'I create a screenshots restore archive stored as {string}:',
  async ({ testData }: { testData: TestStore }, key: string, docString: string) => {
    const archivePath = await ensureWorkerFilePath(`${key}.tar.gz`);
    const files = yaml.parse(docString) as Record<string, string>;
    await createTarGzArchive(archivePath, files);
    testData.set(key, archivePath);
  }
);

When(
  'I create an invalid tar.gz archive stored as {string}:',
  async ({ testData }: { testData: TestStore }, key: string, docString: string) => {
    const archivePath = await ensureWorkerFilePath(`${key}.tar.gz`);
    const files = yaml.parse(docString) as Record<string, string>;
    await createTarGzArchive(archivePath, files);
    testData.set(key, archivePath);
  }
);

When(
  'I create screenshot file {string} with content {string}',
  async ({ appServer }: { appServer: AppServerFixture }, fileName: string, content: string) => {
    const fullPath = path.join(appServer.config.defaultImagesPath, fileName);
    await fsPromises.mkdir(path.dirname(fullPath), { recursive: true });
    await fsPromises.writeFile(fullPath, content, 'utf8');
  }
);

When(
  'I upload stored file {string} into file input {string}',
  async ({ page, testData }: { page: Page; testData: TestStore }, key: string, label: string) => {
    const filePath = getStoredFilePath(testData, key);
    const inputIndexByLabel: Record<string, number> = {
      'Database archive': 0,
      'Screenshots archive': 1,
    };
    const inputIndex = inputIndexByLabel[label];
    if (typeof inputIndex !== 'number') {
      throw new Error(`Unsupported file input label "${label}"`);
    }

    const fileInput = page.locator('input[type="file"]').nth(inputIndex);
    await expect(fileInput).toHaveCount(1);
    await fileInput.setInputFiles(filePath);
  }
);

When(
  'I set the checkbox {string} to {string}',
  async ({ page }: { page: Page }, label: string, state: string) => {
    const checkbox = page.getByRole('checkbox', { name: label, exact: true });
    if (state === 'checked') {
      await checkbox.check();
      await expect(checkbox).toBeChecked();
      return;
    }
    if (state === 'unchecked') {
      await checkbox.uncheck();
      await expect(checkbox).not.toBeChecked();
      return;
    }
    throw new Error(`Unsupported checkbox state "${state}"`);
  }
);

When(
  'I start admin data job {string} via api',
  async ({ appServer }: { appServer: AppServerFixture }, jobType: string) => {
    const response = await fetch(getAdminDataJobEndpoint(appServer.baseURL, jobType), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Failed to start admin data job "${jobType}": ${response.status} ${body}`);
    }
  }
);

When(
  'I download the {string} link and store it as {string}',
  async ({ page, testData }: { page: Page; testData: TestStore }, linkName: string, key: string) => {
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('link', { name: linkName, exact: true }).click(),
    ]);
    const downloadPath = await ensureWorkerFilePath(await download.suggestedFilename());
    await download.saveAs(downloadPath);
    testData.set(key, downloadPath);
  }
);

When(
  'I download the latest {string} archive and store it as {string}',
  async ({ appServer, testData }: { appServer: AppServerFixture; testData: TestStore }, jobLabel: string, key: string) => {
    const job = await getLatestJob(appServer, jobLabel, 'completed');
    if (!job.downloadAvailable) {
      throw new Error(`Latest ${jobLabel} job ${job.id} is completed but download is not available`);
    }

    const response = await fetch(`${appServer.baseURL}/v1/admin/data/jobs/${job.id}/download`);
    if (!response.ok) {
      throw new Error(`Failed to download admin data archive for job ${job.id}: ${response.status}`);
    }

    const urlPath = new URL(response.url).pathname;
    const fileName = path.basename(urlPath) || `${job.type}.tar.gz`;
    const downloadPath = await ensureWorkerFilePath(fileName);
    const buffer = Buffer.from(await response.arrayBuffer());
    await fsPromises.writeFile(downloadPath, buffer);
    testData.set(key, downloadPath);
  }
);

Then(
  'the stored file {string} should exist',
  async ({ testData }: { testData: TestStore }, key: string) => {
    const filePath = getStoredFilePath(testData, key);
    await expect(fs.existsSync(filePath)).toBeTruthy();
  }
);

Then(
  'the stored tar.gz file {string} should contain entries:',
  async ({ testData }: { testData: TestStore }, key: string, docString: string) => {
    const filePath = getStoredFilePath(testData, key);
    const expectedEntries = yaml.parse(docString) as string[];
    const entries = await listTarGzEntries(filePath);

    for (const expectedEntry of expectedEntries) {
      expect(entries).toContain(expectedEntry);
    }
  }
);

Then(
  'the screenshot file {string} should contain {string}',
  async ({ appServer }: { appServer: AppServerFixture }, fileName: string, expectedContent: string) => {
    const fullPath = path.join(appServer.config.defaultImagesPath, fileName);
    const actualContent = await fsPromises.readFile(fullPath, 'utf8');
    expect(actualContent).toBe(expectedContent);
  }
);

Then(
  'the admin data jobs count should be {int}',
  async ({ appServer }: { appServer: AppServerFixture }, expectedCount: number) => {
    await waitForJobsCount(appServer, expectedCount);
  }
);

Then(
  'the latest admin data job {string} should have status {string} with message containing {string}',
  async (
    { appServer }: { appServer: AppServerFixture },
    jobLabel: string,
    expectedStatus: string,
    expectedMessage: string
  ) => {
    await waitForLatestJob(appServer, jobLabel, expectedStatus, expectedMessage);
  }
);
