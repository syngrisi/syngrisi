import { gzipSync, gunzipSync } from 'node:zlib'
import { DOM_DUMP_COMPRESSION_THRESHOLD, CompressedDomDump, DomNode, DomDump } from '../schemas/DomNode.schema'

/**
 * Checks if the given data is in compressed DomDump format
 */
export function isCompressedDomDump(data: unknown): data is CompressedDomDump {
    return (
        data !== null &&
        typeof data === 'object' &&
        'compressed' in data &&
        (data as CompressedDomDump).compressed === true &&
        'data' in data &&
        typeof (data as CompressedDomDump).data === 'string'
    )
}

/**
 * Compresses DomDump if it exceeds the threshold size
 * Returns original string if below threshold, or CompressedDomDump if compressed
 *
 * @param domDump - DomNode tree or JSON string
 * @returns Original string if small, or CompressedDomDump if large
 */
export function compressDomDump(domDump: DomNode | string): string | CompressedDomDump {
    const jsonString = typeof domDump === 'string'
        ? domDump
        : JSON.stringify(domDump)

    const originalSize = Buffer.byteLength(jsonString, 'utf8')

    // Skip compression for small payloads
    if (originalSize <= DOM_DUMP_COMPRESSION_THRESHOLD) {
        return jsonString
    }

    const compressed = gzipSync(Buffer.from(jsonString, 'utf8'))

    return {
        data: compressed.toString('base64'),
        compressed: true,
        originalSize,
    }
}

/**
 * Decompresses DomDump if it was compressed
 * Handles both compressed and uncompressed formats
 *
 * @param data - String, CompressedDomDump, or DomNode object
 * @returns Parsed DomNode object or null if invalid
 */
export function decompressDomDump(data: string | CompressedDomDump | DomNode): DomNode | null {
    try {
        // Already a DomNode object
        if (typeof data === 'object' && !isCompressedDomDump(data)) {
            return data as DomNode
        }

        // Compressed format
        if (isCompressedDomDump(data)) {
            const buffer = Buffer.from(data.data, 'base64')
            const decompressed = gunzipSync(buffer).toString('utf8')
            return JSON.parse(decompressed) as DomNode
        }

        // JSON string
        if (typeof data === 'string') {
            // Try to parse - might be a JSON string of compressed data
            const parsed = JSON.parse(data)

            // Check if the parsed result is compressed format
            if (isCompressedDomDump(parsed)) {
                return decompressDomDump(parsed)
            }

            return parsed as DomNode
        }

        return null
    } catch (e) {
        console.error('Failed to decompress domDump:', e)
        return null
    }
}

/**
 * Prepares DomDump for sending to the server
 * Compresses if necessary and returns the appropriate format
 *
 * @param domDump - DomNode tree, string, or already compressed data
 * @returns Object with processed data and compression flag
 */
export function prepareDomDumpForTransfer(domDump: DomDump | string): {
    data: string;
    isCompressed: boolean;
} {
    // If already compressed, just stringify it
    if (isCompressedDomDump(domDump)) {
        return {
            data: JSON.stringify(domDump),
            isCompressed: true,
        }
    }

    // Otherwise, try to compress
    const result = compressDomDump(domDump)

    if (isCompressedDomDump(result)) {
        return {
            data: JSON.stringify(result),
            isCompressed: true,
        }
    }

    return {
        data: result,
        isCompressed: false,
    }
}
