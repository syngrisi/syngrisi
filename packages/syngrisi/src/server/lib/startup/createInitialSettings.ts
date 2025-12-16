import { appSettings } from "@settings";
import { AppSettings as AppSettingsModel } from '@models';
import initialAppSettings from '../../../seeds/initialAppSettings.json';

export async function createInitialSettings(): Promise<void> {
    const settings = appSettings;
    if (await settings.count() < 1) {
        await settings.loadInitialFromFile();
    } else {
        for (const seed of initialAppSettings) {
            const alreadyExists = settings.cache?.some((item: any) => item.name === seed.name);
            if (!alreadyExists) {
                const created = await AppSettingsModel.create(seed);
                settings.cache.push(created.toObject());
            }
        }
    }
}
