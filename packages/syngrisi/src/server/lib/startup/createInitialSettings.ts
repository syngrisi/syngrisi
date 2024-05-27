/* eslint-disable @typescript-eslint/no-explicit-any */

export async function createInitialSettings(): Promise<void> {
    if ((await (global as any ).AppSettings.count()) < 1) {
        await (global as any).AppSettings.loadInitialFromFile();
    }
}
