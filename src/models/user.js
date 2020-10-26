/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/

const { model, Schema } = require('mongoose');

const UserSchema = new Schema({
    id: {
        type: Number,
        required: true,
        default: 0,
    },
    access_token: {
        type: String,
        required: true
    },
    access_token_secret: {
        type: String,
        required: true
    },
    org_id: {
        type: Number,
        required: true
    },
    tweep_id: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: false
    },

    //
    is_active: {
        type: Boolean,
        required: true,
        default: true,
    },
    is_deleted: {
        type: Boolean,
        required: true,
        default: false,
    },
    time_stamp: {
        type: Number,
        required: true,
        default: () => Date.now(),
    },
    created_on: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
    updated_on: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
});

const User = module.exports = model('User', UserSchema);

// /** Create Indexes */
// User.ensureIndexes({ time_stamp: -1 }); // single descending
// User.ensureIndexes({ id: 1 }, { unique: true }); // single unique
// User.ensureIndexes({ compound_index_a: 1, compound_index_b: 1 }, { unique: true }); // compound unique