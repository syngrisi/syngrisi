/* Change-similarity descriptor ("color_hist_lab").
 *
 * Turns a failed check's (baseline, actual, diff) into a small, resolution-invariant vector that
 * captures *what colours changed* in the changed region. Two checks with the same logical change
 * (e.g. the same recolour) get near-identical vectors regardless of viewport size, because we use
 * colour *proportions* inside the change mask — not pixels or positions.
 *
 * Ported from the PoC (poc/run.py:feat_color_hist). Pure functions here are unit-tested without
 * any image decoding or DB. Exact parity with skimage is NOT required — similarity is relative, so
 * one fixed RGB->Lab conversion used for every check is enough.
 */

export const SIG_VERSION = 'colorhist-v1';
const BINS = 6;
const A_MIN = -80, A_MAX = 90;
const B_MIN = -110, B_MAX = 95;
export const SIG_DIMS = BINS * BINS * 2 + 1; // 73

// node-resemble paints changed pixels pure magenta; allow a tolerance.
export function isMagenta(r: number, g: number, b: number): boolean {
    return r > 180 && g < 120 && b > 180;
}

// sRGB (0..255) -> CIE Lab (D65). Standard conversion; consistent across all checks.
export function rgbToLab(r: number, g: number, b: number): [number, number, number] {
    const f = (c: number) => {
        c /= 255;
        return c > 0.04045 ? ((c + 0.055) / 1.055) ** 2.4 : c / 12.92;
    };
    const R = f(r), G = f(g), B = f(b);
    // sRGB -> XYZ (D65), then normalize by reference white
    let x = (R * 0.4124 + G * 0.3576 + B * 0.1805) / 0.95047;
    let y = (R * 0.2126 + G * 0.7152 + B * 0.0722);
    let z = (R * 0.0193 + G * 0.1192 + B * 0.9505) / 1.08883;
    const g3 = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
    x = g3(x); y = g3(y); z = g3(z);
    return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}

function binIndex(v: number, min: number, max: number): number {
    const idx = Math.floor(((v - min) / (max - min)) * BINS);
    return idx < 0 ? 0 : idx >= BINS ? BINS - 1 : idx;
}

type Raw = { data: Uint8Array | Buffer; width: number; height: number; channels: number };

// Nearest-neighbour sample of `src` at the diff grid coordinate (sx,sy in diff space).
function sampleRGB(src: Raw, sx: number, sy: number, dw: number, dh: number): [number, number, number] {
    const x = Math.min(src.width - 1, Math.floor((sx / dw) * src.width));
    const y = Math.min(src.height - 1, Math.floor((sy / dh) * src.height));
    const i = (y * src.width + x) * src.channels;
    return [src.data[i], src.data[i + 1], src.data[i + 2]];
}

/**
 * Build the 73-dim descriptor from raw RGB(A) buffers. `diff` defines the canvas; `baseline` and
 * `actual` are sampled at the matching (normalized) coordinate so different-sized images line up.
 */
export function changeVectorFromRaw(diff: Raw, baseline: Raw, actual: Raw): number[] {
    const { width: w, height: h, channels: dc } = diff;
    const histBase = new Float64Array(BINS * BINS);
    const histAct = new Float64Array(BINS * BINS);
    let dLsum = 0;
    let n = 0;
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const di = (y * w + x) * dc;
            if (!isMagenta(diff.data[di], diff.data[di + 1], diff.data[di + 2])) continue;
            const [br, bg, bb] = sampleRGB(baseline, x, y, w, h);
            const [ar, ag, ab] = sampleRGB(actual, x, y, w, h);
            const [bl, ba, bbb] = rgbToLab(br, bg, bb);
            const [al, aa, abb] = rgbToLab(ar, ag, ab);
            histBase[binIndex(ba, A_MIN, A_MAX) * BINS + binIndex(bbb, B_MIN, B_MAX)]++;
            histAct[binIndex(aa, A_MIN, A_MAX) * BINS + binIndex(abb, B_MIN, B_MAX)]++;
            dLsum += Math.abs(al - bl);
            n++;
        }
    }
    const out: number[] = [];
    if (n === 0) return new Array(SIG_DIMS).fill(0);
    for (let i = 0; i < BINS * BINS; i++) out.push(histBase[i] / n);
    for (let i = 0; i < BINS * BINS; i++) out.push(histAct[i] / n);
    out.push((dLsum / n) / 100);
    return out;
}

export function cosineDistance(a: number[], b: number[]): number {
    let dot = 0, na = 0, nb = 0;
    for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
    if (na === 0 || nb === 0) return 1;
    return 1 - dot / (Math.sqrt(na) * Math.sqrt(nb));
}
