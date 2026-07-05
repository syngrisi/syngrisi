import fs from 'fs';
import { promises as fsp } from 'fs';
import path from 'path';
import { createGzip, createGunzip } from 'zlib';
import { promisify } from 'util';
import { pipeline } from 'stream';
import tar from 'tar-stream';
import { safeJoinWithin } from './../../utils/safeJoinWithin';
import { ensureDir } from './job-store';

const pipelineAsync = promisify(pipeline);

// `tar-stream` ships no type declarations. Keep the only two direct
// `tar.pack()`/`tar.extract()` call sites left in the orchestrator
// (`runScreenshotsBackup`'s/`runScreenshotsRestore`'s inline pipelines)
// routed through this module instead of importing `tar-stream` a second
// time, so there is a single "no declaration file" note instead of one per
// importing file.
export function createTarPack() {
    return tar.pack();
}

export function createTarExtract() {
    return tar.extract();
}

export async function countFilesRecursive(rootDir: string): Promise<number> {
    let count = 0;
    const stack = [rootDir];
    while (stack.length > 0) {
        const currentDir = stack.pop();
        if (!currentDir) continue;
        const dir = await fsp.opendir(currentDir);
        for await (const entry of dir) {
            const entryPath = path.join(currentDir, entry.name);
            if (entry.isDirectory()) {
                stack.push(entryPath);
            } else if (entry.isFile()) {
                count += 1;
            }
        }
    }
    return count;
}

export async function addFileToTar(pack: tar.Pack, filePath: string, entryName: string) {
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

export async function createTarGzArchive(outputPath: string, items: Array<{ path: string; name: string }>) {
    await ensureDir(path.dirname(outputPath));
    const pack = tar.pack();
    const gzip = createGzip();
    const output = fs.createWriteStream(outputPath);
    const pipelinePromise = pipelineAsync(pack, gzip, output);

    for (const item of items) {
        await addFileToTar(pack, item.path, item.name);
    }

    pack.finalize();
    await pipelinePromise;
}

export async function extractTarGzArchive(archivePath: string, destinationDir: string) {
    await ensureDir(destinationDir);
    const extract = tar.extract();

    await new Promise<void>((resolve, reject) => {
        extract.on('entry', (header, stream, next) => {
            const outputPath = safeJoinWithin(destinationDir, header.name);
            if (!outputPath) {
                stream.resume();
                next();
                return;
            }
            const finishEntry = (error?: Error | null) => {
                if (error) {
                    reject(error);
                    return;
                }
                next();
            };

            if (header.type === 'directory') {
                void ensureDir(outputPath).then(() => {
                    stream.resume();
                    finishEntry();
                }).catch((error) => finishEntry(error as Error));
                return;
            }

            void ensureDir(path.dirname(outputPath))
                .then(() => pipelineAsync(stream, fs.createWriteStream(outputPath)))
                .then(() => finishEntry())
                .catch((error) => finishEntry(error as Error));
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

export async function countFilesInTarGzArchive(archivePath: string) {
    const extract = tar.extract();
    let totalFiles = 0;

    await new Promise<void>((resolve, reject) => {
        extract.on('entry', (_header, stream, next) => {
            if (_header.type === 'file') {
                totalFiles += 1;
            }
            stream.resume();
            next();
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

    return totalFiles;
}

export async function walkFiles(rootDir: string, onFile: (fullPath: string, relativePath: string) => Promise<void>) {
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
