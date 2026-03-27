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
  async ({ page, testData }: { page: Page; testData: TestStore }, jobLabel: string, key: string) => {
    const row = page
      .locator('tbody tr')
      .filter({ hasText: jobLabel })
      .filter({ hasText: 'completed' })
      .first();

    await expect(row).toBeVisible();

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      row.getByRole('link', { name: 'Download', exact: true }).click(),
    ]);

    const downloadPath = await ensureWorkerFilePath(await download.suggestedFilename());
    await download.saveAs(downloadPath);
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
