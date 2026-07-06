import fs from 'fs';
import path from 'path';
import { createGzip, createGunzip } from 'zlib';
import mongoose from 'mongoose';
import { ensureDir } from './job-store';

const { BSON } = mongoose.mongo;

export type DbBackupManifest = {
    format: 'syngrisi-db-backup-v1';
    exportedAt: string;
    databaseName: string;
    collections: Array<{
        name: string;
        dumpFile: string;
        documentCount: number;
        indexes: Array<Record<string, unknown>>;
    }>;
};

// Cancellation + logging are owned by the orchestrator's `activeTasks` /
// `appendLog` (admin-data-job.service.ts); this module receives them as
// callbacks instead of importing that module-level state directly, so pure
// dump/import logic can live here with no cyclic or shared-singleton
// dependency back into the service.

export async function writeCollectionDump(
    collectionName: string,
    outputPath: string,
    checkCancelled: () => void,
    log: (message: string) => Promise<void>,
): Promise<number> {
    const db = mongoose.connection.db;
    if (!db) {
        throw new Error('MongoDB connection is not available');
    }

    let documentCount = 0;
    await ensureDir(path.dirname(outputPath));

    const gzip = createGzip();
    const output = fs.createWriteStream(outputPath);
    gzip.pipe(output);

    const cursor = db.collection(collectionName).find({}, { timeout: false });
    for await (const doc of cursor) {
        checkCancelled();
        gzip.write(BSON.serialize(doc));
        documentCount += 1;
        if (documentCount % 1000 === 0) {
            await log(`Exported ${documentCount} documents from ${collectionName}`);
        }
    }

    gzip.end();
    await new Promise<void>((resolve, reject) => {
        output.on('finish', () => resolve());
        output.on('error', reject);
        gzip.on('error', reject);
    });

    return documentCount;
}

export async function recreateIndexes(collectionName: string, indexes: Array<Record<string, unknown>>) {
    const db = mongoose.connection.db;
    if (!db) {
        throw new Error('MongoDB connection is not available');
    }

    const filtered = indexes.filter((index) => index.name !== '_id_');
    if (filtered.length === 0) {
        return;
    }

    const definitions = filtered.map((index) => {
        const { key, ...options } = index as { key: Record<string, 1 | -1>; [key: string]: unknown };
        return { key, ...options };
    });

    await db.collection(collectionName).createIndexes(definitions as any);
}

export async function importCollectionDump(
    collectionName: string,
    dumpPath: string,
    checkCancelled: () => void,
    log: (message: string) => Promise<void>,
): Promise<number> {
    const db = mongoose.connection.db;
    if (!db) {
        throw new Error('MongoDB connection is not available');
    }

    const collection = db.collection(collectionName);
    const batch: Record<string, unknown>[] = [];
    let inserted = 0;
    const flush = async () => {
        if (batch.length === 0) return;
        await collection.insertMany(batch, { ordered: false });
        inserted += batch.length;
        batch.length = 0;
    };

    const input = fs.createReadStream(dumpPath).pipe(createGunzip());
    let pending = Buffer.alloc(0);

    for await (const chunk of input) {
        checkCancelled();
        pending = Buffer.concat([pending, chunk as Buffer]);

        while (pending.length >= 4) {
            const documentSize = pending.readInt32LE(0);
            if (documentSize <= 0) {
                throw new Error(`Invalid BSON document size ${documentSize} in ${collectionName}`);
            }
            if (pending.length < documentSize) {
                break;
            }

            const documentBuffer = pending.subarray(0, documentSize);
            pending = pending.subarray(documentSize);
            batch.push(BSON.deserialize(documentBuffer) as Record<string, unknown>);

            if (batch.length >= 1000) {
                await flush();
                await log(`Imported ${inserted} documents into ${collectionName}`);
            }
        }
    }

    if (pending.length > 0) {
        throw new Error(`Unexpected trailing BSON bytes in ${collectionName}`);
    }

    await flush();
    return inserted;
}
