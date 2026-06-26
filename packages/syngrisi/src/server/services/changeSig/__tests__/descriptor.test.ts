import { test } from 'node:test';
import assert from 'node:assert/strict';
import { changeVectorFromRaw, cosineDistance, rgbToLab, isMagenta, SIG_DIMS } from '../descriptor';

type Raw = { data: Uint8Array; width: number; height: number; channels: number };
const solid = (w: number, h: number, r: number, g: number, b: number): Raw => {
    const data = new Uint8Array(w * h * 3);
    for (let i = 0; i < w * h; i++) { data[i * 3] = r; data[i * 3 + 1] = g; data[i * 3 + 2] = b; }
    return { data, width: w, height: h, channels: 3 };
};
const magentaAll = (w: number, h: number) => solid(w, h, 255, 0, 255);
// a sample = full-frame recolor (from -> to); diff is all-magenta over the frame
const sig = (w: number, h: number, from: [number, number, number], to: [number, number, number]) =>
    changeVectorFromRaw(magentaAll(w, h), solid(w, h, ...from), solid(w, h, ...to));

const RED: [number, number, number] = [220, 20, 20];
const GREEN: [number, number, number] = [20, 200, 20];
const BLUE: [number, number, number] = [20, 20, 220];

test('descriptor has the expected length and basic invariants', () => {
    const v = sig(40, 30, RED, GREEN);
    assert.equal(v.length, SIG_DIMS);
    assert.ok(isMagenta(255, 0, 255) && !isMagenta(255, 255, 255));
    const [L] = rgbToLab(255, 255, 255);
    assert.ok(L > 95); // white is light
});

test('same change is closer than a different change (and is size-invariant)', () => {
    const a = sig(40, 30, RED, GREEN);        // red -> green
    const aBig = sig(320, 200, RED, GREEN);   // same change, much larger image
    const b = sig(40, 30, RED, BLUE);         // red -> blue (different change)

    const dSame = cosineDistance(a, aBig);    // same change across resolutions
    const dDiff = cosineDistance(a, b);       // different change

    assert.ok(dSame < 1e-6, `same change across sizes should be ~identical, got ${dSame}`);
    assert.ok(dSame < dDiff, `same change (${dSame}) must be closer than a different change (${dDiff})`);
});

test('empty change mask yields a zero vector', () => {
    const noChange = changeVectorFromRaw(solid(10, 10, 255, 255, 255), solid(10, 10, 0, 0, 0), solid(10, 10, 0, 0, 0));
    assert.equal(noChange.length, SIG_DIMS);
    assert.ok(noChange.every((x) => x === 0));
});
