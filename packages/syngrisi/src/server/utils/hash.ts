import { createHash, randomUUID } from 'node:crypto';

/**
 * Synchronously hash input using SHA-512 algorithm.
 * Compatible with hasha's default behavior (sha512, hex encoding).
 */
export function hashSync(input: Buffer | string): string {
    return createHash('sha512').update(input).digest('hex');
}

/**
 * Crockford's Base32 alphabet (used by uuid-apikey)
 */
const CROCKFORD_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

/**
 * Encode bytes to Crockford's Base32
 */
function toBase32(bytes: Buffer): string {
    let result = '';
    let bits = 0;
    let value = 0;

    for (const byte of bytes) {
        value = (value << 8) | byte;
        bits += 8;

        while (bits >= 5) {
            bits -= 5;
            result += CROCKFORD_ALPHABET[(value >> bits) & 0x1f];
        }
    }

    if (bits > 0) {
        result += CROCKFORD_ALPHABET[(value << (5 - bits)) & 0x1f];
    }

    return result;
}

/**
 * Generate an API key in uuid-apikey format: XXXXXXX-XXXXXXX-XXXXXXX-XXXXXXX
 * Compatible with uuid-apikey package output format.
 */
export function generateApiKey(): string {
    const uuid = randomUUID();
    const uuidNoDashes = uuid.replace(/-/g, '');
    const buf = Buffer.from(uuidNoDashes, 'hex');
    let base32 = toBase32(buf);
    // Pad to 28 chars if needed (uuid-apikey pads the base32 to fit 4 groups of 7)
    while (base32.length < 28) {
        base32 += CROCKFORD_ALPHABET[0];
    }
    return `${base32.slice(0, 7)}-${base32.slice(7, 14)}-${base32.slice(14, 21)}-${base32.slice(21, 28)}`;
}
