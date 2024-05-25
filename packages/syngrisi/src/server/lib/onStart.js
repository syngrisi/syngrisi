/* eslint-disable no-underscore-dangle */
// this code should run only once at server start
const fs = require('fs');
const { User } = require('../models');
const adminData = require('../../seeds/admin.json');
const guestData = require('../../seeds/guest.json');
const testUsers = require('../../seeds/testUsers.json');

const $this = this;
$this.logMeta = {
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
        log.info('create the default Administrator', $this);
        const admin = await User.create(adminData);
        log.info(`administrator with id: '${admin._id}' was created`, $this);
    }
    if (!defGuest) {
        log.info('create the default Guest', $this);
        const guest = await User.create(guestData);
        log.info(`guest with id: '${guest._id}' was created`, $this);
    }
};

exports.createTestsUsers = async function createTestsUsers() {
    log.debug('creating tests users', $this);
    try {
        await User.insertMany(testUsers);
    } catch (e) {
        console.warn(e);
    }
};
