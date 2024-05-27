/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { AppSettings as AppSettingsModel } from '../../models';
import initialAppSettings from '../../../seeds/initialAppSettings.json';

class AppSettings {
    private model: any;
    private cache: any;

    constructor() {
        this.model = AppSettingsModel;
        (async () => {
            this.cache = await this.model.find().lean().exec();
        })();
    }

    count(): Promise<number> {
        return this.model.countDocuments().exec();
    }

    async loadInitialFromFile(): Promise<void> {
        const settings = initialAppSettings;
        await this.model.insertMany(settings);
        this.cache = settings;
    }

    async get(name: string): Promise<any> {
        return this.cache?.find((x: any) => x.name === name) 
            || (this.model.findOne({ name }).exec());
    }

    async set(name: string, value: any): Promise<void> {
        const item = await this.model.findOneAndUpdate({ name }, { value });
        await item.save();
        this.cache.find((x: any) => x.name === name)['value'] = value;
    }

    async enable(name: string): Promise<void> {
        const item = await this.model.findOneAndUpdate({ name }, { enabled: true });
        await item.save();
        this.cache.find((x: any) => x.name === name)['enabled'] = true;
    }

    async disable(name: string): Promise<void> {
        const item = await this.model.findOneAndUpdate({ name }, { enabled: false });
        await item.save();
        this.cache.find((x: any) => x.name === name)['enabled'] = false;
    }

    async isAuthEnabled(): Promise<boolean> {
        return process.env.SYNGRISI_AUTH === '1' || (await this.get('authentication'))?.value === 'true';
    }

    async isFirstRun(): Promise<boolean> {
        return (await this.get('first_run'))?.value === 'true';
    }
}

export { AppSettings };
