package io.syngrisi.coreapi

import groovy.json.JsonOutput
import groovy.json.JsonSlurper

import java.util.zip.GZIPInputStream
import java.util.zip.GZIPOutputStream

/**
 * Port of src/compression.ts — gzip + base64 DOM dump compression.
 * Threshold = 50 * 1024 bytes.
 */
class Compression {

    static final int DOM_DUMP_COMPRESSION_THRESHOLD = Schemas.DOM_DUMP_COMPRESSION_THRESHOLD

    /**
     * Checks if the given data is in compressed DomDump format.
     * true iff map-like with compressed==true and string data.
     */
    static boolean isCompressedDomDump(Object data) {
        if (!(data instanceof Map)) {
            return false
        }
        Map m = data as Map
        return m.containsKey('compressed') &&
                m.compressed == true &&
                m.containsKey('data') &&
                (m.data instanceof CharSequence)
    }

    /**
     * Compresses DomDump if it exceeds the threshold size.
     * Returns original JSON string if below threshold, or a compressed map if large.
     *
     * @param domDump DomNode tree (Map/List) or JSON string
     * @return String if small, or Map [data, compressed:true, originalSize] if compressed
     */
    static Object compressDomDump(Object domDump) {
        String jsonString = (domDump instanceof CharSequence)
                ? domDump.toString()
                : JsonOutput.toJson(domDump)

        byte[] utf8 = jsonString.getBytes('UTF-8')
        int originalSize = utf8.length

        // Skip compression for small payloads
        if (originalSize <= DOM_DUMP_COMPRESSION_THRESHOLD) {
            return jsonString
        }

        byte[] compressed = gzip(utf8)

        return [
                data        : Base64.encoder.encodeToString(compressed),
                compressed  : true,
                originalSize: originalSize,
        ]
    }

    /**
     * Decompresses DomDump if it was compressed. Handles both compressed and
     * uncompressed formats. Returns parsed DomNode object or null if invalid.
     */
    static Object decompressDomDump(Object data) {
        try {
            // Already a DomNode object (map/list, not compressed)
            if ((data instanceof Map || data instanceof List) && !isCompressedDomDump(data)) {
                return data
            }

            // Compressed format
            if (isCompressedDomDump(data)) {
                byte[] buffer = Base64.decoder.decode((data as Map).data.toString())
                String decompressed = new String(gunzip(buffer), 'UTF-8')
                return new JsonSlurper().parseText(decompressed)
            }

            // JSON string
            if (data instanceof CharSequence) {
                Object parsed = new JsonSlurper().parseText(data.toString())
                if (isCompressedDomDump(parsed)) {
                    return decompressDomDump(parsed)
                }
                return parsed
            }

            return null
        } catch (Exception e) {
            System.err.println("Failed to decompress domDump: ${e}")
            return null
        }
    }

    /**
     * Prepares DomDump for sending to the server.
     * Returns [data: String, isCompressed: boolean].
     */
    static Map prepareDomDumpForTransfer(Object domDump) {
        // If already compressed, just stringify it
        if (isCompressedDomDump(domDump)) {
            return [
                    data        : JsonOutput.toJson(domDump),
                    isCompressed: true,
            ]
        }

        Object result = compressDomDump(domDump)

        if (isCompressedDomDump(result)) {
            return [
                    data        : JsonOutput.toJson(result),
                    isCompressed: true,
            ]
        }

        return [
                data        : (String) result,
                isCompressed: false,
        ]
    }

    private static byte[] gzip(byte[] input) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream()
        GZIPOutputStream gz = new GZIPOutputStream(baos)
        gz.write(input)
        gz.close()
        return baos.toByteArray()
    }

    private static byte[] gunzip(byte[] input) {
        GZIPInputStream gz = new GZIPInputStream(new ByteArrayInputStream(input))
        ByteArrayOutputStream baos = new ByteArrayOutputStream()
        byte[] buf = new byte[8192]
        int n
        while ((n = gz.read(buf)) != -1) {
            baos.write(buf, 0, n)
        }
        gz.close()
        return baos.toByteArray()
    }
}
