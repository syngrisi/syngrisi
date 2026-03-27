import { appSettings } from "@settings";
import { AppSettings as AppSettingsModel } from '@models';
import initialAppSettings from '../../../seeds/initialAppSettings.json';

export async function createInitialSettings(): Promise<void> {
    const settings = appSettings;
    if (await settings.count() < 1) {
        await settings.loadInitialFromFile();
    } else {
        for (const seed of initialAppSettings) {
            await AppSettingsModel.updateOne(
                { name: seed.name },
                { $setOnInsert: seed },
                { upsert: true }
            );
        }
        await settings.init();
    }
}
