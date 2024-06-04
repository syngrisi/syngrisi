/* eslint-disable @typescript-eslint/no-explicit-any */
import { appSettings } from "../AppSettings";

export async function createInitialSettings(): Promise<void> {
    const settings = await appSettings;
    if (await settings.count() < 1) {
        await settings.loadInitialFromFile();
    }
}
