import dns from 'node:dns';
import { isIP } from 'node:net';
import ApiError from './ApiError';
import HttpStatus from './httpStatus';
import { env } from '@env';

const reject = (msg: string): never => {
    throw new ApiError(HttpStatus.BAD_REQUEST, `Invalid webhook url: ${msg}`);
};

const inRange = (parts: number[], base: number[], bits: number): boolean => {
    let bitsLeft = bits;
    for (let i = 0; i < 4; i += 1) {
        if (bitsLeft <= 0) break;
        const maskBits = Math.min(8, bitsLeft);
        const mask = 0xff << (8 - maskBits) & 0xff;
        if ((parts[i] & mask) !== (base[i] & mask)) return false;
        bitsLeft -= 8;
    }
    return true;
};

const isPrivateIPv4 = (ip: string): boolean => {
    const parts = ip.split('.').map(Number);
    if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return true;
    return (
        inRange(parts, [127, 0, 0, 0], 8) || // loopback
        inRange(parts, [10, 0, 0, 0], 8) || // private
        inRange(parts, [172, 16, 0, 0], 12) || // private
        inRange(parts, [192, 168, 0, 0], 16) || // private
        inRange(parts, [169, 254, 0, 0], 16) || // link-local / cloud metadata
        inRange(parts, [0, 0, 0, 0], 8) || // "this" network
        inRange(parts, [100, 64, 0, 0], 10) // CGNAT
    );
};

// Return true if `ip` is loopback/private/link-local/unique-local.
const isPrivateAddress = (ip: string): boolean => {
    if (isIP(ip) === 4) {
        return isPrivateIPv4(ip);
    }

    const lower = ip.toLowerCase();

    if (lower === '::1') return true; // loopback

    // IPv4-mapped IPv6 (::ffff:a.b.c.d) - map to the embedded IPv4 and re-check.
    const mappedMatch = lower.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    if (mappedMatch) {
        return isPrivateIPv4(mappedMatch[1]);
    }

    // Unique local: fc00::/7 (first byte 0xfc or 0xfd)
    if (/^f[cd][0-9a-f]{0,2}:/.test(lower)) return true;

    // Link-local: fe80::/10
    if (/^fe[89ab][0-9a-f]:/.test(lower)) return true;

    return false;
};

const parseAllowlist = (): Set<string> => {
    const raw = env.SYNGRISI_WEBHOOK_ALLOWED_HOSTS || '';
    return new Set(
        raw
            .split(',')
            .map((h) => h.trim())
            .filter(Boolean)
    );
};

export const validateWebhookUrl = async (
    raw: string,
    opts: { ssrfProtection?: boolean } = {},
): Promise<URL> => {
    let parsed: URL;
    try {
        parsed = new URL(raw);
    } catch {
        return reject('not a valid URL');
    }

    // SSRF protection is opt-in (self-hosted default allows localhost/internal
    // http webhooks). When off, only the parseability check above applies.
    const ssrfProtection = opts.ssrfProtection ?? env.SYNGRISI_WEBHOOK_SSRF_PROTECTION;
    if (!ssrfProtection) {
        return parsed;
    }

    const host = parsed.hostname;
    // URL.hostname keeps the brackets for IPv6 literals (e.g. "[::1]"); strip
    // them for IP-literal detection and DNS/range checks below.
    const hostForIp = host.startsWith('[') && host.endsWith(']') ? host.slice(1, -1) : host;
    const allow = parseAllowlist();
    const allowlisted = allow.has(host);

    if (parsed.protocol !== 'https:' && !(parsed.protocol === 'http:' && allowlisted)) {
        return reject('only https is allowed');
    }
    if (allowlisted) return parsed;

    const ipVersion = isIP(hostForIp);
    const addrs = ipVersion
        ? [hostForIp]
        : (await dns.promises.lookup(host, { all: true })).map((a) => a.address);
    if (addrs.length === 0) return reject('host does not resolve');
    if (addrs.some(isPrivateAddress)) return reject('resolves to a private/loopback address');
    return parsed;
};
