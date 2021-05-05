/** */
const sinon = require('sinon');
const { expect } = require('chai');
const SampleService = require('./sample');
const Controller = require('../../../test/controllers/mock');
const validator = {
    validate: sinon.fake,
}

let sampleService = null;
describe("Tests Sample Service:", () => {
    beforeEach(() => {
        sampleService = new SampleService(Controller, validator);
    });

    afterEach(() => {
        sampleService = null;
    });

    it ("creates a sample record", () => {
        const data = {name: "Nathan"};
        const required_fields = ['name'];

        expect(sampleService.createRecord(data)).to.equal({});
    });
});