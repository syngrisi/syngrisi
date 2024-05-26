// const Snapshot = require('./Snapshot');
// // const Check = require('./Check');
// const Check = require('../../../dist/src/server/models/Check').default;
// const Test = require('./Test');
// const Log = require('./Log');
// const Suite = require('./Suite');
// const App = require('./App');
// const Run = require('./Run');
// const User = require('./User');
// const Baseline = require('./Baseline');
// const AppSettings = require('./AppSettings');

// module.exports = { Snapshot, Check, Test, Log, Suite, App, Run, User, Baseline, AppSettings };

const Check = require('../../../dist/src/server/models/Check').default;
const Log = require('../../../dist/src/server/models/Log').default;
const App = require('../../../dist/src/server/models/App').default;
const Snapshot = require('../../../dist/src/server/models/Snapshot').default;
const AppSettings = require('../../../dist/src/server/models/AppSettings').default;
const Suite = require('../../../dist/src/server/models/Suite').default;
const Run = require('../../../dist/src/server/models/Run').default;
const User = require('../../../dist/src/server/models/User').default;
const Baseline = require('../../../dist/src/server/models/Baseline').default;
const Test = require('../../../dist/src/server/models/Test').default;

module.exports = {
  Check,
  Log,
  App,
  Snapshot,
  AppSettings,
  Suite,
  Run,
  User,
  Baseline,
  Test,
};