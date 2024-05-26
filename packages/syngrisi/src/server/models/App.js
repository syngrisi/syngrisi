const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const { Schema } = mongoose;

const AppSchema = new Schema({
    name: {
        type: String,
        default: 'Others',
        unique: true,
        required: 'AppSchema: the Application name is empty',
    },
    description: {
        type: String,
    },
    version: {
        type: String,
    },
    updatedDate: {
        type: Date,
    },
    createdDate: {
        type: Date,
    },
    meta: {
        type: Object,
    },
});

AppSchema.plugin(paginate);
AppSchema.plugin(toJSON);

const App = mongoose.model('VRSApp', AppSchema);
module.exports = App;
