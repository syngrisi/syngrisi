/* eslint-disable @typescript-eslint/no-explicit-any */
import { promises as fsp } from 'fs';
import path from 'path';
import { config } from '@config';
import { createTable } from '@utils/stringTable';
import { IOutputWriter } from '../lib/output-writer';
import { Snapshot } from '../lib';

/**
 * Format bytes to human readable format
 */
function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get file size
 */
async function getFileSize(filePath: string): Promise<number> {
    try {
        const stats = await fsp.stat(filePath);
        return stats.size;
    } catch {
        return 0;
    }
}

function parseHrtimeToSeconds(hrtime: any) {
    return (hrtime[0] + (hrtime[1] / 1e9)).toFixed(3);
}

export interface HandleOrphanFilesOptions {
    dryRun: boolean;
}

/**
 * Handle orphan files task
 * Removes image files that are not referenced by any Snapshot in the database
 *
 * This task finds all files in the images directory that are not linked to any
 * Snapshot record and optionally removes them.
 *
 * @param options - Task options
 * @param output - Output writer for streaming results
 */
export async function handleOrphanFilesTask(
    options: HandleOrphanFilesOptions,
    output: IOutputWriter
): Promise<void> {
    try {
        const startTime = process.hrtime();
        output.write('- starting...\n');

        output.write('STAGE #1 Calculate statistics');

        output.write('> get all files from images directory');
        const allFiles = (await fsp.readdir(config.defaultImagesPath, { withFileTypes: true }))
            .filter((item: any) => !item.isDirectory())
            .map((x: any) => x.name)
            .filter((x: any) => x.includes('.png')); // TODO: Support other image formats

        output.write(`>> found: ${allFiles.length}`);

        output.write('> get all snapshot filenames from database');
        // Use cursor to avoid 16MB distinct() limit
        const snapshotFilenames = new Set<string>();
        const cursor = Snapshot.find().select('filename').cursor();

        let processedCount = 0;
        for await (const doc of cursor) {
            if (doc.filename) {
                snapshotFilenames.add(doc.filename);
            }
            processedCount++;
            if (processedCount % 10000 === 0) {
                output.write(`>> processed ${processedCount} snapshots...`);
            }
        }
        output.write(`>> found: ${snapshotFilenames.size} unique filenames from ${processedCount} snapshots`);

        output.write('> calculate orphan files (files without snapshot reference)');
        const orphanFiles = allFiles.filter((filename: string) => !snapshotFilenames.has(filename));
        output.write(`>> found: ${orphanFiles.length} orphan files`);

        // Calculate sizes
        output.write('> calculate file sizes');
        let totalSizeBefore = 0;
        let orphanFilesSize = 0;

        output.write('>> calculating total size of all files');
        for (let i = 0; i < allFiles.length; i++) {
            const filename = allFiles[i];
            const filePath = path.join(config.defaultImagesPath, filename);
            const size = await getFileSize(filePath);
            totalSizeBefore += size;

            if ((i + 1) % 10000 === 0) {
                output.write(`>> processed ${i + 1}/${allFiles.length} files (${((i + 1) / allFiles.length * 100).toFixed(1)}%)`);
            }
        }

        output.write('>> calculating size of orphan files');
        for (let i = 0; i < orphanFiles.length; i++) {
            const filename = orphanFiles[i];
            const filePath = path.join(config.defaultImagesPath, filename);
            const size = await getFileSize(filePath);
            orphanFilesSize += size;

            if ((i + 1) % 10000 === 0) {
                output.write(`>> processed ${i + 1}/${orphanFiles.length} orphan files (${((i + 1) / orphanFiles.length * 100).toFixed(1)}%)`);
            }
        }

        const totalSizeAfter = totalSizeBefore - orphanFilesSize;

        // Create separate tables for counts and sizes
        const countTable = createTable([
            { item: 'Total files in directory', value: allFiles.length },
            { item: 'Files referenced by snapshots', value: snapshotFilenames.size },
            { item: 'Orphan files (not referenced)', value: orphanFiles.length },
        ]);

        const sizeTable = createTable([
            { item: 'Total size before', value: formatBytes(totalSizeBefore) },
            { item: 'Orphan files size', value: formatBytes(orphanFilesSize) },
            { item: 'Total size after cleanup', value: formatBytes(totalSizeAfter) },
            { item: 'Space to be freed', value: formatBytes(orphanFilesSize) },
        ]);

        output.write(countTable);
        output.write('\n');
        output.write(sizeTable);

        if (orphanFiles.length > 0) {
            output.write('\n> Sample of orphan files (first 10):');
            const sample = orphanFiles.slice(0, 10);
            sample.forEach((filename: string) => {
                output.write(`  - ${filename}`);
            });
            if (orphanFiles.length > 10) {
                output.write(`  ... and ${orphanFiles.length - 10} more`);
            }
        }

        if (!options.dryRun) {
            output.write('\nSTAGE #2 Remove orphan files\n');

            output.write(`> removing ${orphanFiles.length} orphan files`);

            // Process files in batches to avoid overwhelming the file system
            const batchSize = 100;
            let removedCount = 0;
            let failedFiles: string[] = [];

            for (let i = 0; i < orphanFiles.length; i += batchSize) {
                const batch = orphanFiles.slice(i, i + batchSize);
                output.write(`>> processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(orphanFiles.length / batchSize)}`);

                const results = await Promise.allSettled(
                    batch.map((filename: string) =>
                        fsp.unlink(path.join(config.defaultImagesPath, filename))
                    )
                );

                results.forEach((result, index) => {
                    if (result.status === 'fulfilled') {
                        removedCount++;
                    } else {
                        failedFiles.push(batch[index]);
                        output.write(`>>> failed to remove: ${batch[index]}`);
                    }
                });
            }

            output.write(`>> successfully removed: ${removedCount} files`);
            if (failedFiles.length > 0) {
                output.write(`>> failed to remove: ${failedFiles.length} files`);
                output.write(`>> failed files list:`);
                failedFiles.forEach((filename: string) => {
                    output.write(`   - ${filename}`);
                });
            }

            output.write('STAGE #3 Calculate statistics after removal');

            output.write('> get all files data');
            const allFilesAfter = (await fsp.readdir(config.defaultImagesPath, { withFileTypes: true }))
                .filter((item: any) => !item.isDirectory())
                .map((x: any) => x.name)
                .filter((x: any) => x.includes('.png'));

            output.write('> calculate total size after removal');
            let actualSizeAfter = 0;
            for (const filename of allFilesAfter) {
                const filePath = path.join(config.defaultImagesPath, filename);
                const size = await getFileSize(filePath);
                actualSizeAfter += size;
            }

            const outTableAfter = createTable([
                { item: 'Total files after removal', count: allFilesAfter.length },
                { item: 'Total size after removal', size: formatBytes(actualSizeAfter) },
                { item: 'Space freed', size: formatBytes(totalSizeBefore - actualSizeAfter) },
            ]);

            output.write(outTableAfter);
        } else {
            output.write('\n⚠️  DRY RUN MODE - No files were actually removed');
            output.write('   Run with --execute flag to perform actual removal\n');
        }

        const elapsedSeconds = parseHrtimeToSeconds(process.hrtime(startTime));
        output.write(`> done in ${elapsedSeconds} seconds (${(Number(elapsedSeconds) / 60).toFixed(2)} min)`);
    } catch (e: unknown) {
        const errMsg = e instanceof Error ? e.message : String(e);
        output.write(errMsg);
        throw e;
    } finally {
        output.end();
    }
}
