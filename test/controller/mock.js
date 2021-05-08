/** */
const sinon = require('sinon');
module.exports = {
    createRecord: sinon.spy((data) => ({
        id: 1, _id: "sjdhflkjasdf32uiw7p",
    })),

    readRecords: sinon.spy(() => {
        return [{
            id: 1, _id: "jdfhlksdhf837qyh",
        }, {
            id: 2, _id: "hf3289jdwuy90"
        }];
    }),

    updateRecords: sinon.spy((conditions, data) => {
        if (!Object.keys(data).length) {
            return { ok: 1, nModified: 0 }
        }

        return { ok: 1, nModified: 1 };
    }),

    deleteRecords: sinon.spy((conditions) => {
        return { ok: 1, nModified: 1 };
    }),
}