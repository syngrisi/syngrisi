import path from 'path';
import fs from 'fs/promises';
import { MongoClient } from 'mongodb';
import { resolveRepoRoot } from '@utils/fs';
import { createLogger } from '@lib/logger';
import { env } from '@config';

const logger = createLogger('DbCleanup');

function getCid(): number {
  if (process.env.DOCKER === '1') return 100;
  return parseInt(process.env.TEST_WORKER_INDEX || '0', 10);
}

function resolveDbUri(cid: number): string {
  const requestedUri = process.env.SYNGRISI_DB_URI || env.SYNGRISI_DB_URI || '';
  const enforcedUri = `mongodb://localhost/SyngrisiDbTest${cid}`;

  if (requestedUri && requestedUri !== enforcedUri) {
    logger.warn(`Overriding provided SYNGRISI_DB_URI (${requestedUri}) with test database ${enforcedUri}`);
  }

  return enforcedUri;
}

function resolveBaselinesPath(cid: number): string {
  const repoRoot = resolveRepoRoot();
  return path.join(repoRoot, 'baselinesTest', String(cid));
}

export async function clearDatabase(
  cidOrRemoveBaselines?: number | boolean,
  removeBaselinesArg = true,
  softClean = false,
): Promise<void> {
  let removeBaselines = removeBaselinesArg;
  let cid: number | undefined;

  if (typeof cidOrRemoveBaselines === 'boolean') {
    removeBaselines = cidOrRemoveBaselines;
  } else if (typeof cidOrRemoveBaselines === 'number') {
    cid = cidOrRemoveBaselines;
  }

  const actualCid = cid ?? getCid();
  const dbUri = resolveDbUri(actualCid);
  const baselinesPath = resolveBaselinesPath(actualCid);



  const tasks: Promise<void>[] = [];

  // Task 1: Drop Database
  tasks.push((async () => {
    const client = new MongoClient(dbUri, { retryWrites: false });
    try {
      await client.connect();
      const db = client.db();
      if (softClean) {
        // Preserve critical collections during soft clean to avoid race conditions
        // - users: Guest/Administrator created at startup, must persist
        // - sessions: keep user authentication state
        // - appsettings: auth settings must be consistent between server restarts
        const preserveCollections = ['system.indexes', 'users', 'sessions', 'appsettings'];
        const collections = await db.listCollections().toArray();
        for (const collection of collections) {
          if (!preserveCollections.includes(collection.name)) {
            await db.collection(collection.name).deleteMany({});
          }
        }
        logger.info(`✓ Soft cleaned database ${db.databaseName}`);
      } else {
        const dropResult = await db.dropDatabase();
        logger.info(`✓ Dropped database ${db.databaseName}: ${dropResult}`);
      }
    } catch (error: any) {
      const errorMsg = error.message || error.toString() || '';
      if (errorMsg.includes('disconnected') || errorMsg.includes('failed to check if window was closed') || errorMsg.includes('ECONNREFUSED')) {
        logger.warn('Browser disconnected or ChromeDriver unavailable, skipping clear database');
      } else {
        logger.error(`Failed to clear database: ${errorMsg}`);
        throw error;
      }
    } finally {
      await client.close().catch(() => undefined);
    }
  })());

  // Task 2: Clear Baselines (if required)
  if (removeBaselines && !softClean) {
    tasks.push((async () => {
      try {
        await fs.rm(baselinesPath, { recursive: true, force: true });
        await fs.mkdir(baselinesPath, { recursive: true });
        logger.info(`Cleared baselines folder: ${baselinesPath}`);
      } catch (error: any) {
        logger.warn(`Failed to clear baselines folder ${baselinesPath}: ${error.message || error.toString()}`);
      }
    })());
  }

  await Promise.all(tasks);
}
