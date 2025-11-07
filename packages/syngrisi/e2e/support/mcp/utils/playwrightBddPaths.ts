import path from 'node:path';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const playwrightBddRoot = path.dirname(require.resolve('playwright-bdd/package.json'));

export const resolvePlaywrightBddPath = (...segments: string[]): string =>
  path.join(playwrightBddRoot, ...segments);

export const requirePlaywrightBddModule = <T = unknown>(...segments: string[]): T =>
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require(resolvePlaywrightBddPath(...segments)) as T;
