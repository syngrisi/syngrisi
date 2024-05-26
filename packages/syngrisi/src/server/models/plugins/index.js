// module.exports.toJSON = require('./toJSON.plugin');
// module.exports.paginate = require('./paginate.plugin');
module.exports.paginate = require('../../../../dist/src/server/models/plugins/paginate.plugin').default;
module.exports.toJSON = require('../../../../dist/src/server/models/plugins/toJSON.plugin').default;
module.exports.paginateDistinct = require('./paginateDistinct.plugin'); 
