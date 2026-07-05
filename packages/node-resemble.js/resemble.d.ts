// Hand-written type declarations for the `resemble.js` CommonJS export.
//
// This package intentionally ships raw, untyped JavaScript (see README for
// why) — `resemble.js` is a deliberately-owned fork kept close to upstream
// Resemble.js, and is not compiled by this migration. These types cover only
// the surface actually used by consumers (the chained compare/ignore/output
// API); they are not an exhaustive model of every internal option.

declare namespace Resemble {
    interface CompareApi {
        ignoreNothing(): CompareApi;
        exact(): CompareApi;
        ignoreAntialiasing(): CompareApi;
        ignoreColors(): CompareApi;
        // array of rectangles, each rectangle is [x, y, width, height]
        ignoreRectangles(rectangles?: number[][]): CompareApi;
        includeRectangles(rectangles?: number[][]): CompareApi;
        repaint(): CompareApi;
        onComplete(callback: (data: any) => void): CompareApi;
    }

    interface ResembleApi {
        onComplete(callback: (data: any) => void): void;
        compareTo(image: any): CompareApi;
    }

    interface ResembleStatic {
        (fileData: any): ResembleApi;
        outputSettings(options: any): ResembleStatic;
    }
}

declare const resemble: Resemble.ResembleStatic;
export = resemble;
