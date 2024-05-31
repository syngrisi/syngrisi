/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { AppSettings as AppSettingsModel } from '../../models';
import initialAppSettings from '../../../seeds/initialAppSettings.json';

class AppSettings {
    private model: any;
    private cache: any;

    constructor() {
        this.model = AppSettingsModel;
        this.cache = null; // Initialize cache as null to indicate uninitialized state
    }

    async init() {
        this.cache = await this.model.find().lean().exec();
        return this;
    }

    private ensureInitialized() {
        if (!this.cache) {
            throw new Error('AppSettings is not initialized. Please call init() before using this method.');
        }
    }

    async count(): Promise<number> {
        this.ensureInitialized();
        return this.model.countDocuments().exec();
    }

    async loadInitialFromFile(): Promise<void> {
        this.ensureInitialized();
        const settings = initialAppSettings;
        await this.model.insertMany(settings);
        this.cache = settings;
    }

    async get(name: string): Promise<any> {
        this.ensureInitialized();
        return this.cache.find((x: any) => x.name === name) 
            || (this.model.findOne({ name }).exec());
    }

    async set(name: string, value: any): Promise<void> {
        this.ensureInitialized();
        const item = await this.model.findOneAndUpdate({ name }, { value });
        await item.save();
        const cachedItem = this.cache.find((x: any) => x.name === name);
        if (cachedItem) {
            cachedItem['value'] = value;
        }
    }

    async enable(name: string): Promise<void> {
        this.ensureInitialized();
        const item = await this.model.findOneAndUpdate({ name }, { enabled: true });
        await item.save();
        const cachedItem = this.cache.find((x: any) => x.name === name);
        if (cachedItem) {
            cachedItem['enabled'] = true;
        }
    }

    async disable(name: string): Promise<void> {
        this.ensureInitialized();
        const item = await this.model.findOneAndUpdate({ name }, { enabled: false });
        await item.save();
        const cachedItem = this.cache.find((x: any) => x.name === name);
        if (cachedItem) {
            cachedItem['enabled'] = false;
        }
    }

    async isAuthEnabled(): Promise<boolean> {
        this.ensureInitialized();
        return process.env.SYNGRISI_AUTH === '1' || (await this.get('authentication'))?.value === 'true';
    }

    async isFirstRun(): Promise<boolean> {
        this.ensureInitialized();
        return (await this.get('first_run'))?.value === 'true';
    }
}

export { AppSettings };