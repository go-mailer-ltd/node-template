/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/

const { model, Schema } = require('mongoose');

const StreamSchema = new Schema({
    id: {
        type: Number,
        required: true,
        default: 0,
    },
    handles: {
        type: Array,
        required: false,
        default: [],
    },
    hashtags: {
        type: Array,
        required: false,
        default: []
    },
    org_id: {
        type: Number,
        required: true
    },
    rule_id: {
        type: String,
        required: false,
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

const Stream = module.exports = model('Stream', StreamSchema);

// /** Create Indexes */
// Stream.ensureIndexes({ time_stamp: -1 }); // single descending
// Stream.ensureIndexes({ id: 1 }, { unique: true }); // single unique
// Stream.ensureIndexes({ compound_index_a: 1, compound_index_b: 1 }, { unique: true }); // compound unique