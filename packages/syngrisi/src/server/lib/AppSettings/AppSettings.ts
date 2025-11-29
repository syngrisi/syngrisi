/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { AppSettings as AppSettingsModel } from '@models';
import initialAppSettings from '../../../seeds/initialAppSettings.json';

class AppSettings {
    private model: any;
    public cache: any;
    private lastFetch: number = 0;
    private TTL = 30 * 1000; // 30 seconds

    constructor() {
        this.model = AppSettingsModel;
        this.cache = null; // Initialize cache as null to indicate uninitialized state
    }

    async init() {
        await this.refreshCache();
        return this;
    }

    private async refreshCache() {

        this.cache = await this.model.find().lean().exec();

        this.lastFetch = Date.now();
    }

    private async ensureInitialized() {

        if (!this.cache) {

            // If not initialized, try to initialize (lazy init fallback, though explicit init is preferred)
            await this.refreshCache();
        }
        // Check TTL
        if (Date.now() - this.lastFetch > this.TTL) {
            await this.refreshCache();
        }
    }

    async count(): Promise<number> {
        await this.ensureInitialized();
        return this.model.countDocuments().exec();
    }

    async loadInitialFromFile(): Promise<void> {
        await this.ensureInitialized();
        const settings = initialAppSettings;
        await this.model.insertMany(settings);
        this.cache = settings;
        this.lastFetch = Date.now();
    }

    async get(name: string): Promise<any> {
        await this.ensureInitialized();
        return this.cache.find((x: any) => x.name === name)
            || (this.model.findOne({ name }).exec());
    }

    async set(name: string, value: any): Promise<void> {
        await this.ensureInitialized();
        const item = await this.model.findOneAndUpdate(
            { name },
            { value },
            { new: true }
        ).lean().exec();
        if (!item) {
            throw new Error(`Setting '${name}' not found`);
        }
        // Update local cache immediately
        const cachedItem = this.cache.find((x: any) => x.name === name);
        if (cachedItem) {
            cachedItem['value'] = item.value;
        }
    }

    async enable(name: string): Promise<void> {
        await this.ensureInitialized();
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
        await this.ensureInitialized();
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
        await this.ensureInitialized();
        // Prefer explicit override to force-enable auth when set
        const envOverride = process.env.SYNGRISI_AUTH_OVERRIDE;
        if (typeof envOverride !== 'undefined') {
            if (envOverride === 'true') {
                return true;
            }
            // Allow DB setting to win when override is explicitly false
        }

        const envAuth = process.env.SYNGRISI_AUTH;
        if (envAuth === 'true') {
            return true;
        }
        if (envAuth === 'false') {
            return false;
        }

        return (await this.get('authentication'))?.value === 'true';
    }

    async isFirstRun(): Promise<boolean> {
        await this.ensureInitialized();
        return (await this.get('first_run'))?.value === 'true';
    }
}

const appSettings = new AppSettings();
export { AppSettings, appSettings };
