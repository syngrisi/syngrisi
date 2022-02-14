const mongoose = require('mongoose');

const Settings = mongoose.model('VRSSettings');

class AppSettings {
    constructor() {
        Settings.findOne({})
            .exec()
            .then((settings) => {
                if (!settings) {
                    log.debug('settings are empty, create new');
                    Settings.create({ firstRun: true });
                }
            });
    }

    async get(key) {
        return (await Settings.findOne({})
            .exec())[key];
    }

    async set(key, value) {
        return Settings.findOneAndUpdate({}, { [key]: value });
    }
}

exports.AppSettings = AppSettings;
