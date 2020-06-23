/** */
require('dotenv').config();
const mongoose = require('mongoose');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const { expect } = require('chai');

if (!mongoose.connection.db) {
    mongoose.connect(process.env.TEST_DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    mongoose.model('Sample', {
        name: String,
    });
}

describe('Sample Controller', function () {
    let auto_increment, db_stub, sample_controller;

    before(function () {

        db_stub = sinon.stub(mongoose.model('Sample'), 'create').resolves({
            _id: 'random_object_id'
        });

        sample_controller = proxyquire('../../src/controllers/sample.js', {
            SampleModel: db_stub,
        });
    });

    describe('Create Sample', function () {
        it('should not create a sample with empty data', async function () {
            const new_sample = await sample_controller.create_record({ name: 'test name' });
            expect(new_sample).to.haveOwnProperty('_id');
        })
    });

    after(function () {
        db_stub.restore()
    });
});