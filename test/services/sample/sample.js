/** */
const sinon = require('sinon');
const { expect } = require('chai');
const SampleService = require('../../../src/services/sample/sample');
const Controller = require('../../controller/mock');
const validator = {
    validate: sinon.fake.returns({ }),
}

let sampleService = null;
describe("Tests Sample Service:", () => {
    beforeEach(() => {
        sampleService = new SampleService(Controller, validator);
    });

    afterEach(() => {
        sampleService = null;
    });

    it("creates a sample record", async () => {
        const data = { name: "Nathan" };
        const result = await sampleService.createRecord({ body: data }, console.log);
        expect(result.payload).to.haveOwnProperty('id');
    });
});