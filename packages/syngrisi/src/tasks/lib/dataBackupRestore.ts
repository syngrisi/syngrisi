import fs from 'fs';
import { promises as fsp } from 'fs';
import path from 'path';
import { createGzip, createGunzip } from 'zlib';
import { promisify } from 'util';
import { pipeline } from 'stream';
import tar from 'tar-stream';
import mongoose from 'mongoose';

const pipelineAsync = promisify(pipeline);
const { BSON } = mongoose.mongo;

type DbBackupManifest = {
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

async function ensureDir(dirPath: string) {
    await fsp.mkdir(dirPath, { recursive: true });
}

async function addFileToTar(pack: tar.Pack, filePath: string, entryName: string) {
    const stat = await fsp.stat(filePath);
    await new Promise<void>((resolve, reject) => {
        const entry = pack.entry({ name: entryName, size: stat.size, mode: stat.mode }, (error) => {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        });
        fs.createReadStream(filePath).on('error', reject).pipe(entry).on('error', reject);
    });
}

async function walkFiles(rootDir: string, onFile: (fullPath: string, relativePath: string) => Promise<void>) {
    const stack = [rootDir];
    while (stack.length > 0) {
        const currentDir = stack.pop();
        if (!currentDir) continue;
        const dir = await fsp.opendir(currentDir);
        for await (const entry of dir) {
            const fullPath = path.join(currentDir, entry.name);
            const relativePath = path.relative(rootDir, fullPath);
            if (entry.isDirectory()) {
                stack.push(fullPath);
            } else if (entry.isFile()) {
                await onFile(fullPath, relativePath);
            }
        }
    }
}

async function createTarGzArchive(outputPath: string, items: Array<{ path: string; name: string }>) {
    await ensureDir(path.dirname(outputPath));
    const pack = tar.pack();
    const gzip = createGzip();
    const output = fs.createWriteStream(outputPath);
    const archivePipeline = pipelineAsync(pack, gzip, output);

    for (const item of items) {
        await addFileToTar(pack, item.path, item.name);
    }

    pack.finalize();
    await archivePipeline;
}

async function extractTarGzArchive(archivePath: string, destinationDir: string) {
    await ensureDir(destinationDir);
    const extract = tar.extract();

    await new Promise<void>((resolve, reject) => {
        extract.on('entry', (header, stream, next) => {
            const outputPath = path.join(destinationDir, header.name);

            const finish = (error?: Error | null) => {
                if (error) {
                    reject(error);
                    return;
                }
                next();
            };

            if (header.type === 'directory') {
                void ensureDir(outputPath).then(() => {
                    stream.resume();
                    finish();
                }).catch((error) => finish(error as Error));
                return;
            }

            void ensureDir(path.dirname(outputPath))
                .then(() => pipelineAsync(stream, fs.createWriteStream(outputPath)))
                .then(() => finish())
                .catch((error) => finish(error as Error));
        });

        extract.on('finish', () => resolve());
        extract.on('error', reject);

        fs.createReadStream(archivePath)
            .on('error', reject)
            .pipe(createGunzip())
            .on('error', reject)
            .pipe(extract)
            .on('error', reject);
    });
}

async function writeCollectionDump(connection: mongoose.Connection, collectionName: string, outputPath: string) {
    const db = connection.db;
    if (!db) {
        throw new Error('MongoDB connection is not available');
    }

    await ensureDir(path.dirname(outputPath));
    const gzip = createGzip();
    const output = fs.createWriteStream(outputPath);
    gzip.pipe(output);

    let documentCount = 0;
    const cursor = db.collection(collectionName).find({}, { timeout: false });
    for await (const doc of cursor) {
        gzip.write(BSON.serialize(doc));
        documentCount += 1;
    }

    gzip.end();
    await new Promise<void>((resolve, reject) => {
        output.on('finish', () => resolve());
        output.on('error', reject);
        gzip.on('error', reject);
    });

    return documentCount;
}

async function importCollectionDump(connection: mongoose.Connection, collectionName: string, dumpPath: string) {
    const db = connection.db;
    if (!db) {
        throw new Error('MongoDB connection is not available');
    }

    const collection = db.collection(collectionName);
    const batch: Record<string, unknown>[] = [];

    const flush = async () => {
        if (batch.length === 0) return;
        await collection.insertMany(batch, { ordered: false });
        batch.length = 0;
    };

    const input = fs.createReadStream(dumpPath).pipe(createGunzip());
    let pending = Buffer.alloc(0);

    for await (const chunk of input) {
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
            }
        }
    }

    if (pending.length > 0) {
        throw new Error(`Unexpected trailing BSON bytes in ${collectionName}`);
    }

    await flush();
}

async function recreateIndexes(connection: mongoose.Connection, collectionName: string, indexes: Array<Record<string, unknown>>) {
    const db = connection.db;
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

async function connectToMongo(connectionString: string) {
    const connection = await mongoose.createConnection(connectionString).asPromise();
    return connection;
}

export async function createDatabaseBackupArchive(connectionString: string, outputPath: string): Promise<void> {
    const connection = await connectToMongo(connectionString);
    const exportDir = path.join(path.dirname(outputPath), 'db-export');

    try {
        await ensureDir(exportDir);
        const db = connection.db;
        if (!db) {
            throw new Error('MongoDB connection is not available');
        }

        const collectionInfos = await db.listCollections({}, { nameOnly: true }).toArray();
        const collections = collectionInfos.map((item) => item.name).filter((name) => !name.startsWith('system.'));
        const manifest: DbBackupManifest = {
            format: 'syngrisi-db-backup-v1',
            exportedAt: new Date().toISOString(),
            databaseName: db.databaseName,
            collections: [],
        };

        for (const collectionName of collections) {
            const dumpFileName = `${collectionName}.bson.gz`;
            const dumpPath = path.join(exportDir, dumpFileName);
            const documentCount = await writeCollectionDump(connection, collectionName, dumpPath);
            const indexes = await db.collection(collectionName).indexes();
            manifest.collections.push({
                name: collectionName,
                dumpFile: dumpFileName,
                documentCount,
                indexes: indexes.map((index) => JSON.parse(JSON.stringify(index))),
            });
        }

        const manifestPath = path.join(exportDir, 'manifest.json');
        await fsp.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

        await createTarGzArchive(outputPath, [
            { path: manifestPath, name: 'manifest.json' },
            ...manifest.collections.map((collection) => ({
                path: path.join(exportDir, collection.dumpFile),
                name: `collections/${collection.dumpFile}`,
            })),
        ]);
    } finally {
        await connection.close();
        await fsp.rm(exportDir, { recursive: true, force: true });
    }
}

export async function restoreDatabaseBackupArchive(connectionString: string, archivePath: string): Promise<void> {
    const connection = await connectToMongo(connectionString);
    const extractDir = path.join(path.dirname(archivePath), `restore-${Date.now()}`);

    try {
        await extractTarGzArchive(archivePath, extractDir);
        const manifestPath = path.join(extractDir, 'manifest.json');
        const manifest = JSON.parse(await fsp.readFile(manifestPath, 'utf8')) as DbBackupManifest;

        if (manifest.format !== 'syngrisi-db-backup-v1') {
            throw new Error('Unsupported database backup format');
        }

        const db = connection.db;
        if (!db) {
            throw new Error('MongoDB connection is not available');
        }

        await db.dropDatabase();

        for (const collectionInfo of manifest.collections) {
            const dumpPath = path.join(extractDir, 'collections', collectionInfo.dumpFile);
            await importCollectionDump(connection, collectionInfo.name, dumpPath);
            await recreateIndexes(connection, collectionInfo.name, collectionInfo.indexes);
        }
    } finally {
        await connection.close();
        await fsp.rm(extractDir, { recursive: true, force: true });
    }
}

export async function createScreenshotsArchive(imagesPath: string, outputPath: string): Promise<void> {
    const pack = tar.pack();
    const gzip = createGzip();
    const output = fs.createWriteStream(outputPath);
    const archivePipeline = pipelineAsync(pack, gzip, output);

    await walkFiles(imagesPath, async (fullPath, relativePath) => {
        await addFileToTar(pack, fullPath, relativePath);
    });

    pack.finalize();
    await archivePipeline;
}

export async function restoreScreenshotsArchive(archivePath: string, destinationPath: string, options: { skipExisting?: boolean } = {}): Promise<void> {
    const { skipExisting = false } = options;
    const extract = tar.extract();

    await new Promise<void>((resolve, reject) => {
        extract.on('entry', (header, stream, next) => {
            const outputPath = path.join(destinationPath, header.name);
            const finish = (error?: Error | null) => {
                if (error) {
                    reject(error);
                    return;
                }
                next();
            };

            if (header.type !== 'file') {
                stream.resume();
                finish();
                return;
            }

            void (async () => {
                await ensureDir(path.dirname(outputPath));
                if (skipExisting) {
                    try {
                        await fsp.access(outputPath);
                        stream.resume();
                        return;
                    } catch {
                        // File does not exist, continue with restore
                    }
                } else {
                    await fsp.rm(outputPath, { force: true });
                }
                await pipelineAsync(stream, fs.createWriteStream(outputPath));
            })().then(() => finish()).catch((error) => finish(error as Error));
        });

        extract.on('finish', () => resolve());
        extract.on('error', reject);

        fs.createReadStream(archivePath)
            .on('error', reject)
            .pipe(createGunzip())
            .on('error', reject)
            .pipe(extract)
            .on('error', reject);
    });
}
