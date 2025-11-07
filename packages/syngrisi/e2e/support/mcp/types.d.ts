declare module 'pixelmatch' {
  const pixelmatch: (
    img1: Uint8Array,
    img2: Uint8Array,
    output: Uint8Array,
    width: number,
    height: number,
    options?: { threshold?: number },
  ) => number;
  export default pixelmatch;
}

declare module 'pngjs' {
  export const PNG: {
    sync: {
      read(data: Buffer): {
        width: number;
        height: number;
        data: Uint8Array;
      };
    };
  };
}
