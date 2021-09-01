/* eslint-disable no-underscore-dangle */
// this code should runs only once at server start
const fs = require('fs');
const mongoose = require('mongoose');

const User = mongoose.model('VRSUser');

exports.createTempDir = function createTempDir() {
    const dir = '../.tmp';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
};

exports.createBasicUsers = async function createBasicUsers() {
    const defAdmin = await User.findOne({ username: 'Administrator' });
    const defGuest = await User.findOne({ username: 'Guest' });
    if (!defAdmin) {
        console.log('Create the default Administrator');
        const adminData = JSON.parse(fs.readFileSync('lib/admin.json'));
        const admin = await User.create(adminData);
        console.log(`Administrator with id: '${admin._id}' was created`);
    }
    if (!defGuest) {
        console.log('Create the default Guest');
        const guestData = JSON.parse(fs.readFileSync('lib/guest.json'));
        const guest = await User.create(guestData);
        console.log(`Guest with id: '${guest._id}' was created`);
    }
};
