/** */
const sinon = require('sinon');
const { expect } = require('chai');
const SampleService = require('../../../src/services/sample/sample');
const Controller = require('../../controller/mock');
const validator = {
    validate: sinon.fake.returns({}),
}

let sampleService = null;
describe("Tests Sample Service:", () => {
    let next = null;
    beforeEach(() => {
        next = sinon.spy()
        sampleService = new SampleService(Controller, validator);
    });

    afterEach(() => {
        next = null;
        sampleService = null;
    });

    it("throws an error when body is not specified", async () => {
        await sampleService.createRecord({ }, next);
        next.called;
    });

    it("creates a sample record", async () => {
        const data = { name: "Nathan" };
        const result = await sampleService.createRecord({ body: data }, next);
        expect(result.payload).to.haveOwnProperty('id');
    });

    it("throws error when no id is specified", async () => {
        const request = {};
        await sampleService.readRecordById(request, next);
        next.called;
    });

    it("returns one record when id is specified", async () => {
        const params = { id: 1 };
        const response = await sampleService.readRecordById({ params }, next);
        expect(response)
            .to.have.property('payload')
    });

    it("throws an error when no query object is specified.", async () => {
        await sampleService.readRecordsByFilter({}, next);
        next.called;
    });

    it("returns an array of data", async () => {
        const query = {};
        const response = await sampleService.readRecordsByFilter({ query }, next);
        expect(response)
            .to.have.property('payload')
            .and.is.an('array');
    });

    it("throws an error when params is unspecified", async () => {
        const query = {};
        await sampleService.readRecordsByWildcard({ query }, next);
        next.called;
    });

    it("throws an error when a key is not specified on params", async () => {
        const params = {}, query = {};
        await sampleService.readRecordsByWildcard({ params, query }, next);
        next.called;
    });

    it("throws an error when query os not specfied", async () => {
        const params = { key: '' };
        await sampleService.readRecordsByWildcard({ params }, next);
        next.called;
    });

    it("returns an array when params.keys and query are specified", async () => {
        const params = { keys: 'name' }, query = {};
        const response = await sampleService.readRecordsByWildcard({ params, query }, next);
        expect(response)
            .to.have.property('payload')
            .to.be.an('array');
    });

    it("throw an error when params.id is not specified", async () => {
        const params = {}, body = { data: {} };
        await sampleService.updateRecordById({ params, body }, next);
        next.called;
    });

    it("throw an error when params is not specified", async () => {
        const body = { data: {} };
        await sampleService.updateRecordById({ body }, next);
        next.called;
    });

    it("returns a valid response when params.id and data.body is specified", async () => {
        const params = { id: 1 }, body = { data: {} };
        const response = await sampleService.updateRecordById({ params, body }, next);
        expect(response)
            .to.have.property('payload')
            .to.not.be.null;
    });

    it("throws an error when body.options and body.data is not specified.", async () => {
        const body = {};
        await sampleService.updateRecords({ body }, next);
        next.called;
    });

    it("returns valid response for valid", async () => {
        const body = {
            options: {
                firstname: 'Micheal'
            }, data: {}
        };
        const response = await sampleService.updateRecords({ body }, next);
        expect(response)
            .to.have.property('payload')
            .to.not.be.null;
    });

    it("throws an error when params is not specified", async () => {
        await sampleService.deleteRecordById({ }, next);
        next.called;
    });

    it("throws an error when params.id is not specified", async () => {
        const params = {};
        await sampleService.deleteRecordById({ params }, next);
        next.called;
    });

    it("returns valid response when params.id is specified", async () => {
        const params = { id: 1 };
        const response = await sampleService.deleteRecordById({ params }, next);
        expect(response)
            .to.have.property('payload')
            .to.not.be.null;
    });

    it ("throws an error when body.options is not specified", async () => {
        const body = {};
        await sampleService.deleteRecords({ body }, next);
        next.called;
    });

    it ("it returns valid response when body.options is specified", async () => {
        const body = { options: {} };
        const response = await sampleService.deleteRecords({ body }, next);
        expect(response)
        .to.have.property('payload')
        .to.not.be.null;
    })
});