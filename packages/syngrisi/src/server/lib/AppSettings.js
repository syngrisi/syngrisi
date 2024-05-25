/* eslint-disable dot-notation */
const { AppSettings: AppSettingsModel } = require('../models');
const initialAppSettings = require('../../seeds/initialAppSettings.json');

class AppSettings {
    constructor() {
        this.model = AppSettingsModel;
        (async () => {
            this.cache = await this.model.find()
                .lean()
                .exec();
        })();
    }

    count() {
        return this.model.countDocuments().exec();
    }

    async loadInitialFromFile() {
        const settings = initialAppSettings;
        // console.log({ settings });
        await this.model.insertMany(settings);
        this.cache = settings;
    }

    async get(name) {
        return this.cache?.find((x) => x.name === name)
            || (this.model.findOne({ name })
                .exec());
    }

    async set(name, value) {
        const item = await this.model.findOneAndUpdate({ name }, { value });
        await item.save();
        this.cache.find((x) => x.name === name)['value'] = value;
    }

    async enable(name) {
        const item = await this.model.findOneAndUpdate({ name }, { enabled: true });
        await item.save();
        this.cache.find((x) => x.name === name)['enabled'] = true;
    }

    async disable(name) {
        const item = await this.model.findOneAndUpdate({ name }, { enabled: false });
        await item.save();
        this.cache.find((x) => x.name === name)['enabled'] = false;
    }

    async isAuthEnabled() {
        return process.env.SYNGRISI_AUTH === '1' || (await this.get('authentication'))?.value === 'true';
    }

    async isFirstRun() {
        return (await this.get('first_run'))?.value === 'true';
    }
}

exports.AppSettings = AppSettings;
