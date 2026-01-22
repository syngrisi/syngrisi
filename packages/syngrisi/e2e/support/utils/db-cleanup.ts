import path from 'path';
import fs from 'fs/promises';
import { MongoClient } from 'mongodb';
import { resolveRepoRoot } from '@utils/fs';
import { createLogger } from '@lib/logger';
import { env } from '@config';

const logger = createLogger('DbCleanup');

// Connection pool: reuse MongoClient instances per URI to avoid connection overhead
const clientPool = new Map<string, MongoClient>();

async function getPooledClient(uri: string): Promise<MongoClient> {
  let client = clientPool.get(uri);
  if (!client) {
    client = new MongoClient(uri, { retryWrites: false, maxPoolSize: 5 });
    await client.connect();
    clientPool.set(uri, client);
    logger.debug(`Created new pooled MongoDB connection for ${uri}`);
  }
  return client;
}

// Cleanup function to close all pooled connections (call in global teardown)
export async function closeAllPooledConnections(): Promise<void> {
  for (const [uri, client] of clientPool.entries()) {
    try {
      await client.close();
      logger.debug(`Closed pooled connection for ${uri}`);
    } catch (e) {
      logger.warn(`Failed to close pooled connection for ${uri}: ${e}`);
    }
  }
  clientPool.clear();
}

function getCid(): number {
  if (process.env.DOCKER === '1') return 100;
  return parseInt(process.env.TEST_WORKER_INDEX || '0', 10);
}

function resolveDbUri(cid: number): string {
  const requestedUri = process.env.SYNGRISI_DB_URI || env.SYNGRISI_DB_URI || '';
  // Use 127.0.0.1 explicitly to match app-server.ts and avoid localhost/127.0.0.1 mismatch issues
  const enforcedUri = `mongodb://127.0.0.1/SyngrisiDbTest${cid}`;

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

  logger.debug(`clearDatabase called with: cid=${cid}, removeBaselines=${removeBaselines}, softClean=${softClean}`);



  const tasks: Promise<void>[] = [];

  // Task 1: Drop Database (uses connection pooling for efficiency)
  tasks.push((async () => {
    try {
      const client = await getPooledClient(dbUri);
      const db = client.db();
      if (softClean) {
        // Preserve critical collections during soft clean to avoid race conditions
        // - vrsusers: Guest/Administrator created at startup, must persist
        // - sessions: keep user authentication state
        // - vrsappsettings: auth settings must be consistent between server restarts
        const preserveCollections = ['system.indexes', 'vrsusers', 'sessions', 'vrsappsettings'];
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);
        logger.debug(`Found collections: ${collectionNames.join(', ')}`);

        const usersCollection = db.collection('vrsusers');
        const guestBefore = await usersCollection.findOne({ username: 'Guest' });
        logger.debug(`Guest user before soft clean: ${guestBefore ? 'FOUND' : 'NOT FOUND'}`);

        // Parallelize collection cleanup (was sequential)
        const cleanupPromises = collections
          .filter(collection => !preserveCollections.includes(collection.name))
          .map(collection => {
            logger.debug(`Cleaning collection: ${collection.name}`);
            return db.collection(collection.name).deleteMany({});
          });

        // Log preserved collections
        collections
          .filter(collection => preserveCollections.includes(collection.name))
          .forEach(collection => logger.debug(`Preserving collection: ${collection.name}`));

        await Promise.all(cleanupPromises);

        const guestAfter = await usersCollection.findOne({ username: 'Guest' });
        logger.debug(`Guest user after soft clean: ${guestAfter ? 'FOUND' : 'NOT FOUND'}`);

        logger.debug(`✓ Soft cleaned database ${db.databaseName}`);
      } else {
        const dropResult = await db.dropDatabase();
        logger.info(`✓ Dropped database ${db.databaseName}: ${dropResult}`);
      }
      // Note: Don't close pooled connection - it will be reused
    } catch (error: any) {
      const errorMsg = error.message || error.toString() || '';
      if (errorMsg.includes('disconnected') || errorMsg.includes('failed to check if window was closed') || errorMsg.includes('ECONNREFUSED')) {
        logger.warn('Browser disconnected or ChromeDriver unavailable, skipping clear database');
      } else {
        logger.error(`Failed to clear database: ${errorMsg}`);
        throw error;
      }
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

export async function clearPluginSettings(pluginName: string): Promise<number> {
  const cid = getCid();
  const dbUri = resolveDbUri(cid);
  const client = await getPooledClient(dbUri);
  const db = client.db();
  const collection = db.collection('vrsappsettings');
  const result = await collection.deleteOne({ name: pluginName });
  logger.info(`Cleared settings for plugin "${pluginName}". Deleted count: ${result.deletedCount}`);
  return result.deletedCount;
}
