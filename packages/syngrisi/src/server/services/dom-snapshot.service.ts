import fs from 'fs/promises';
import path from 'path';
import { Types } from 'mongoose';
import { DomSnapshot, DomSnapshotDocument } from '@models';
import { config } from '@config';
import {
    prepareDomDumpForStorage,
    serializeForStorage,
    deserializeFromStorage,
    calculateHash,
} from '@utils/domDumpUtils';
import log from '@logger';

/**
 * Parameters for creating a DOM snapshot
 */
interface CreateDomSnapshotParams {
    checkId: string;
    baselineId?: string;
    type: 'actual' | 'baseline';
    content: string | object;
    compressionHeader?: string;
}

/**
 * Creates a DOM snapshot record and saves content to file
 *
 * @param params - Snapshot creation parameters
 * @returns Created DomSnapshot document or null if no content
 */
export async function createDomSnapshot(params: CreateDomSnapshotParams): Promise<DomSnapshotDocument | null> {
    const { checkId, baselineId, type, content, compressionHeader } = params;

    // Prepare content for storage
    const { content: parsedContent, wasCompressed, originalSize } = prepareDomDumpForStorage(
        content,
        compressionHeader
    );

    if (!parsedContent) {
        log.debug('No DOM content to store');
        return null;
    }

    // Calculate hash for deduplication
    const contentString = JSON.stringify(parsedContent);
    const hash = calculateHash(contentString);

    // Check for existing snapshot with same hash (deduplication)
    const existingSnapshot = await DomSnapshot.findOne({ hash });
    if (existingSnapshot) {
        log.debug(`Found existing DOM snapshot with hash ${hash}, creating reference`);

        // Create new record pointing to existing file
        const snapshot = await DomSnapshot.create({
            checkId: new Types.ObjectId(checkId),
            baselineId: baselineId ? new Types.ObjectId(baselineId) : undefined,
            type,
            filename: existingSnapshot.filename,
            hash,
            compressed: existingSnapshot.compressed,
            originalSize,
            compressedSize: existingSnapshot.compressedSize,
        });

        return snapshot;
    }

    // Serialize for storage (always compress)
    const { buffer, compressed, compressedSize } = serializeForStorage(parsedContent);

    // Generate unique filename
    const filename = `${checkId}_${type}_${Date.now()}.dom.gz`;
    const filePath = path.join(config.domSnapshotsPath, filename);

    // Write to file
    await fs.writeFile(filePath, buffer);
    log.debug(`Saved DOM snapshot to ${filePath} (${compressedSize} bytes compressed, ${originalSize} bytes original)`);

    // Create database record
    const snapshot = await DomSnapshot.create({
        checkId: new Types.ObjectId(checkId),
        baselineId: baselineId ? new Types.ObjectId(baselineId) : undefined,
        type,
        filename,
        hash,
        compressed,
        originalSize,
        compressedSize,
    });

    return snapshot;
}

/**
 * Gets DOM content from a snapshot
 *
 * @param snapshotId - DomSnapshot document ID
 * @returns Parsed DOM content or null
 */
export async function getDomContent(snapshotId: string): Promise<object | null> {
    const snapshot = await DomSnapshot.findById(snapshotId);
    if (!snapshot) {
        log.warn(`DOM snapshot not found: ${snapshotId}`);
        return null;
    }

    return getDomContentBySnapshot(snapshot);
}

/**
 * Gets DOM content from a snapshot document
 */
export async function getDomContentBySnapshot(snapshot: DomSnapshotDocument): Promise<object | null> {
    const filePath = path.join(config.domSnapshotsPath, snapshot.filename);

    try {
        const buffer = await fs.readFile(filePath);
        return deserializeFromStorage(buffer, snapshot.compressed);
    } catch (e) {
        log.error(`Failed to read DOM snapshot file: ${filePath}`, e);
        return null;
    }
}

/**
 * Gets DOM snapshot for a check
 *
 * @param checkId - Check document ID
 * @param type - Type of snapshot ('actual' or 'baseline')
 * @returns DomSnapshot document or null
 */
export async function getDomSnapshotByCheckId(
    checkId: string,
    type: 'actual' | 'baseline' = 'actual'
): Promise<DomSnapshotDocument | null> {
    return DomSnapshot.findOne({
        checkId: new Types.ObjectId(checkId),
        type,
    });
}

/**
 * Gets DOM snapshot for a baseline
 *
 * @param baselineId - Baseline document ID
 * @returns DomSnapshot document or null
 */
export async function getDomSnapshotByBaselineId(baselineId: string): Promise<DomSnapshotDocument | null> {
    return DomSnapshot.findOne({
        baselineId: new Types.ObjectId(baselineId),
        type: 'baseline',
    });
}

/**
 * Copies DOM snapshot from check to baseline (for accept operation)
 *
 * @param checkId - Source check ID
 * @param baselineId - Target baseline ID
 * @returns Created baseline DomSnapshot or null
 */
export async function linkDomSnapshotToBaseline(
    checkId: string,
    baselineId: string
): Promise<DomSnapshotDocument | null> {
    // Find actual DOM snapshot for the check
    const actualSnapshot = await getDomSnapshotByCheckId(checkId, 'actual');
    if (!actualSnapshot) {
        log.debug(`No DOM snapshot found for check ${checkId}`);
        return null;
    }

    // Create baseline snapshot record pointing to same file
    const baselineSnapshot = await DomSnapshot.create({
        checkId: new Types.ObjectId(checkId),
        baselineId: new Types.ObjectId(baselineId),
        type: 'baseline',
        filename: actualSnapshot.filename,
        hash: actualSnapshot.hash,
        compressed: actualSnapshot.compressed,
        originalSize: actualSnapshot.originalSize,
        compressedSize: actualSnapshot.compressedSize,
    });

    log.debug(`Linked DOM snapshot to baseline ${baselineId}`);
    return baselineSnapshot;
}

/**
 * Removes DOM snapshots for a check
 *
 * @param checkId - Check document ID
 */
export async function removeDomSnapshotsByCheckId(checkId: string): Promise<void> {
    const snapshots = await DomSnapshot.find({ checkId: new Types.ObjectId(checkId) });

    for (const snapshot of snapshots) {
        // Check if file is used by other snapshots
        const otherSnapshots = await DomSnapshot.countDocuments({
            filename: snapshot.filename,
            _id: { $ne: snapshot._id },
        });

        if (otherSnapshots === 0) {
            // Safe to delete file
            const filePath = path.join(config.domSnapshotsPath, snapshot.filename);
            try {
                await fs.unlink(filePath);
                log.debug(`Deleted DOM snapshot file: ${filePath}`);
            } catch (e) {
                log.warn(`Failed to delete DOM snapshot file: ${filePath}`, e);
            }
        }

        await snapshot.deleteOne();
    }
}

/**
 * Removes DOM snapshots for a baseline
 *
 * @param baselineId - Baseline document ID
 */
export async function removeDomSnapshotsByBaselineId(baselineId: string): Promise<void> {
    const snapshots = await DomSnapshot.find({ baselineId: new Types.ObjectId(baselineId) });

    for (const snapshot of snapshots) {
        // Check if file is used by other snapshots
        const otherSnapshots = await DomSnapshot.countDocuments({
            filename: snapshot.filename,
            _id: { $ne: snapshot._id },
        });

        if (otherSnapshots === 0) {
            // Safe to delete file
            const filePath = path.join(config.domSnapshotsPath, snapshot.filename);
            try {
                await fs.unlink(filePath);
                log.debug(`Deleted DOM snapshot file: ${filePath}`);
            } catch (e) {
                log.warn(`Failed to delete DOM snapshot file: ${filePath}`, e);
            }
        }

        await snapshot.deleteOne();
    }
}

export const domSnapshotService = {
    createDomSnapshot,
    getDomContent,
    getDomContentBySnapshot,
    getDomSnapshotByCheckId,
    getDomSnapshotByBaselineId,
    linkDomSnapshotToBaseline,
    removeDomSnapshotsByCheckId,
    removeDomSnapshotsByBaselineId,
};
