/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { AppSettings as AppSettingsModel } from '@models';
import initialAppSettings from '../../../seeds/initialAppSettings.json';
import { env } from "@/server/envConfig";

class AppSettings {
    private model: any;
    public cache: any;

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
        const item = await this.model.findOneAndUpdate(
            { name },
            { value },
            { new: true }
        ).lean().exec();
        if (!item) {
            throw new Error(`Setting '${name}' not found`);
        }
        const cachedItem = this.cache.find((x: any) => x.name === name);
        if (cachedItem) {
            cachedItem['value'] = item.value;
        }
    }

    async enable(name: string): Promise<void> {
        this.ensureInitialized();
        const item = await this.model.findOneAndUpdate(
            { name },
            { enabled: true },
            { new: true }
        ).lean().exec();
        if (!item) {
            throw new Error(`Setting '${name}' not found`);
        }
        const cachedItem = this.cache.find((x: any) => x.name === name);
        if (cachedItem) {
            cachedItem['enabled'] = true;
        }
    }

    async disable(name: string): Promise<void> {
        this.ensureInitialized();
        const item = await this.model.findOneAndUpdate(
            { name },
            { enabled: false },
            { new: true }
        ).lean().exec();
        if (!item) {
            throw new Error(`Setting '${name}' not found`);
        }
        const cachedItem = this.cache.find((x: any) => x.name === name);
        if (cachedItem) {
            cachedItem['enabled'] = false;
        }
    }

    async isAuthEnabled(): Promise<boolean> {
        this.ensureInitialized();
        return env.SYNGRISI_AUTH  || (await this.get('authentication'))?.value === 'true';
    }

    async isFirstRun(): Promise<boolean> {
        this.ensureInitialized();
        return (await this.get('first_run'))?.value === 'true';
    }
}

const appSettings = (new AppSettings()).init();
export { AppSettings, appSettings };
