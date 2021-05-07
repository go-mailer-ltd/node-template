/** */
const sinon = require('sinon');
module.exports = {
    createRecord(data) {
        return {
            ...data,
            id: 1,
            _id: 'unique string',
        }
    },
}