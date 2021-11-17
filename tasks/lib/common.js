const mongoose = require('mongoose');

const Snapshot = mongoose.model('VRSSnapshot');
const Check = mongoose.model('VRSCheck');
const Test = mongoose.model('VRSTest');
const Run = mongoose.model('VRSRun');
const App = mongoose.model('VRSApp');
const Suite = mongoose.model('VRSSuite');
const User = mongoose.model('VRSUser');
const Baseline = mongoose.model('VRSBaseline');

const url = 'mongodb://localhost/VRSdb';

module.exports = {
    url,
    mongoose,
    User,
    Snapshot,
    Check,
    Test,
    Run,
    App,
    Suite,
    Baseline,
};
