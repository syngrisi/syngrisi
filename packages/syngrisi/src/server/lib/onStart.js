/* eslint-disable no-underscore-dangle */
// this code should run only once at server start
const fs = require('fs');
const { User } = require('../models');
const adminData = require('../../seeds/admin.json');
const guestData = require('../../seeds/guest.json');
const testUsers = require('../../seeds/testUsers.json');
const log2 = require("../../../dist/src/server/lib/logger2").default;


const fileLogMeta = {
    scope: 'on_start',
    msgType: 'SETUP',
};

exports.createTempDir = function createTempDir() {
    const dir = '.tmp';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
};

exports.createInitialSettings = async function createInitialSettings() {
    if ((await global.AppSettings.count()) < 1) {
        await global.AppSettings.loadInitialFromFile();
    }
};

exports.createBasicUsers = async function createBasicUsers() {
    const defAdmin = await User.findOne({ username: 'Administrator' }).exec();
    const defGuest = await User.findOne({ username: 'Guest' }).exec();
    if (!defAdmin) {
        log2.info('create the default Administrator', fileLogMeta);
        const admin = await User.create(adminData);
        log2.info(`administrator with id: '${admin._id}' was created`, fileLogMeta);
    }
    if (!defGuest) {
        log2.info('create the default Guest', fileLogMeta);
        const guest = await User.create(guestData);
        log2.info(`guest with id: '${guest._id}' was created`, fileLogMeta);
    }
};

exports.createTestsUsers = async function createTestsUsers() {
    log2.debug('creating tests users', fileLogMeta);
    try {
        await User.insertMany(testUsers);
    } catch (e) {
        console.warn(e);
    }
};
