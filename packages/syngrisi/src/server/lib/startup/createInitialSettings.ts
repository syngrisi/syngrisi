import { appSettings } from "@settings";

export async function createInitialSettings(): Promise<void> {
    const settings = await appSettings;
    if (await settings.count() < 1) {
        await settings.loadInitialFromFile();
    }
}
