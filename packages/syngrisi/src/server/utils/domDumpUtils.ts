import { gunzipSync, gzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';

/**
 * Compressed DomDump format
 */
interface CompressedDomDump {
    data: string;
    compressed: true;
    originalSize: number;
}

/**
 * Checks if the data is in compressed DomDump format
 */
export function isCompressedDomDump(data: unknown): data is CompressedDomDump {
    return (
        data !== null &&
        typeof data === 'object' &&
        'compressed' in data &&
        (data as CompressedDomDump).compressed === true &&
        'data' in data &&
        typeof (data as CompressedDomDump).data === 'string'
    );
}

/**
 * Decompresses DomDump if it was compressed
 *
 * @param data - String, CompressedDomDump object, or DomNode object
 * @returns Parsed object or null if invalid
 */
export function decompressDomDump(data: string | CompressedDomDump | object | null | undefined): object | null {
    if (!data) return null;

    try {
        // Already an object (not compressed format)
        if (typeof data === 'object' && !isCompressedDomDump(data)) {
            return data;
        }

        // Compressed format object
        if (isCompressedDomDump(data)) {
            const buffer = Buffer.from(data.data, 'base64');
            const decompressed = gunzipSync(buffer).toString('utf8');
            return JSON.parse(decompressed);
        }

        // JSON string
        if (typeof data === 'string') {
            // Try to parse as JSON
            const parsed = JSON.parse(data);

            // Check if parsed result is compressed format
            if (isCompressedDomDump(parsed)) {
                return decompressDomDump(parsed);
            }

            return parsed;
        }

        return null;
    } catch (e) {
        console.error('Failed to decompress domDump:', e);
        return null;
    }
}

/**
 * Compresses data using gzip and returns base64 encoded result
 */
export function compressData(data: string | object): Buffer {
    const jsonString = typeof data === 'string' ? data : JSON.stringify(data);
    return gzipSync(Buffer.from(jsonString, 'utf8'));
}

/**
 * Calculates SHA256 hash of the data
 */
export function calculateHash(data: string | Buffer): string {
    const input = typeof data === 'string' ? Buffer.from(data, 'utf8') : data;
    return createHash('sha256').update(input).digest('hex');
}

/**
 * Prepares DomDump for storage
 * Decompresses if needed and returns storage-ready format
 *
 * @param data - Raw domDump from request
 * @param compressionHeader - x-domdump-compressed header value
 * @returns Object with processed data and metadata
 */
export function prepareDomDumpForStorage(
    data: string | object | null | undefined,
    compressionHeader?: string
): {
    content: object | null;
    wasCompressed: boolean;
    originalSize: number;
} {
    if (!data) {
        return { content: null, wasCompressed: false, originalSize: 0 };
    }

    let wasCompressed = false;
    let content: object | null = null;
    let originalSize = 0;

    // If compression header is set, data is compressed
    if (compressionHeader === 'gzip') {
        wasCompressed = true;
    }

    // Handle string input
    if (typeof data === 'string') {
        originalSize = Buffer.byteLength(data, 'utf8');

        try {
            const parsed = JSON.parse(data);

            // Check if it's compressed format
            if (isCompressedDomDump(parsed)) {
                wasCompressed = true;
                originalSize = parsed.originalSize;
                content = decompressDomDump(parsed);
            } else {
                content = parsed;
            }
        } catch {
            // Invalid JSON
            return { content: null, wasCompressed: false, originalSize: 0 };
        }
    } else if (isCompressedDomDump(data)) {
        // Compressed format object
        wasCompressed = true;
        originalSize = data.originalSize;
        content = decompressDomDump(data);
    } else {
        // Already an object
        content = data;
        originalSize = Buffer.byteLength(JSON.stringify(data), 'utf8');
    }

    return { content, wasCompressed, originalSize };
}

/**
 * Serializes DomDump for file storage
 * Compresses large payloads for storage efficiency
 */
export function serializeForStorage(data: object): {
    buffer: Buffer;
    compressed: boolean;
    originalSize: number;
    compressedSize: number;
} {
    const jsonString = JSON.stringify(data);
    const originalSize = Buffer.byteLength(jsonString, 'utf8');

    // Compress for storage (always compress for consistency)
    const compressed = gzipSync(Buffer.from(jsonString, 'utf8'));

    return {
        buffer: compressed,
        compressed: true,
        originalSize,
        compressedSize: compressed.length,
    };
}

/**
 * Deserializes DomDump from file storage
 */
export function deserializeFromStorage(buffer: Buffer, isCompressed: boolean): object | null {
    try {
        if (isCompressed) {
            const decompressed = gunzipSync(buffer).toString('utf8');
            return JSON.parse(decompressed);
        }
        return JSON.parse(buffer.toString('utf8'));
    } catch (e) {
        console.error('Failed to deserialize domDump from storage:', e);
        return null;
    }
}
