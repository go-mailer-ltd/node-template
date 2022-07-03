/** */
const sinon = require("sinon");
const { expect } = require('chai');
const RootService = require('../../src/services/_root');

describe("Tests _root service", () => {
    let controller = null, rootService = null;
    beforeEach(() => {
        controller = {
            readRecords: sinon.spy(() => [{
                id: 1,
                _id: 'kjdf;kld',
            }, {
                id: 2,
                _id: 'ieuroewksd',
            }])
        };

        rootService = new RootService;
    });

    afterEach(() => {
        controller = null;
        rootService = null;
    });

    it("calls controller.readRecords", () => {
        rootService.handleDatabaseRead(controller, {});
        sinon.assert.called(controller.readRecords);
    });

    it("does not process single reads for invalid data", () => {
        const sample_data = {};
        const result = rootService.processSingleRead(sample_data);
        expect(result)
            .to.have.ownProperty("status_code")
            .to.be.equal(404);
    });

    it("processes single reads", () => {
        const sample_data = { id: 1, _id: "sjdfalkdsj" };
        const result = rootService.processSingleRead(sample_data);
        expect(result)
            .to.have.ownProperty("status_code")
            .to.be.equal(200);
    });

    it("does not process multiple read results for invalid data", () => {
        const sample_data = null;
        const result = rootService.processMultipleReadResults(sample_data);
        expect(result)
            .to.have.property('status_code')
            .to.be.equal(404);
    });

    it("process multiple read results for empty data", () => {
        const sample_data = [];
        const result = rootService.processMultipleReadResults(sample_data);
        expect(result)
            .to.have.property('status_code')
            .to.be.equal(200);
    });

    it("process multiple read results for non-empty data", () => {
        const sample_data = [{ id: 1, _id: "kdsfjalkdsjfa" }];
        const result = rootService.processMultipleReadResults(sample_data);
        expect(result)
            .to.have.property('status_code')
            .to.be.equal(200);
    });

    it("returns error for null data", () => {
        const sample_data = null;
        const result = rootService.processUpdateResult(sample_data);
        expect(result)
            .to.have.property('error')
            .to.be.a('string');
    });

    it("returns payload for no change in data", () => {
        const sample_data = { ok: 1, nModified: 0 };
        const result = rootService.processUpdateResult(sample_data);
        expect(result)
            .to.have.property('status_code')
            .to.be.equal(210);
    });

    it("returns valid response for updated data", () => {
        const sample_data = { ok: 1, nModified: 1 };
        const result = rootService.processUpdateResult(sample_data);
        expect(result)
            .to.have.property('error')
            .to.be.null;
    });

    it("returns valid response for successful delete", () => {
        const sample_data = { ok: 1, nModified: 1 };
        const result = rootService.processDeleteResult(sample_data);
        expect(result)
            .to.have.property('error')
            .to.be.null;
    });

    it("returns valid response for unsuccessful delete", () => {
        const sample_data = { ok: 1, nModified: 0 };
        const result = rootService.processDeleteResult(sample_data);
        expect(result)
            .to.have.property('payload')
            .to.be.null;
    });

    it("returns correct failed response", () => {
        const message = "Request failed";
        const response = rootService.processFailedResponse(message);
        expect(response)
            .is.an('object')
            .has.property("error")
            .that.is.equal(message);
    });

    it("returns correct success response", () => {
        const payload = {};
        const response = rootService.processSuccessfulResponse(payload);
        expect(response)
        .to.have.property('error')
        .that.is.null;
    });

    it("returns correct data for invalid email", () => {
        const email = 'x.com';
        const { is_valid } = rootService.validateEmail(email);
        expect(is_valid).to.be.false;
    })

    it("returns correct data for valid email", () => {
        const email = 'happy@test.com';
        const { is_valid } = rootService.validateEmail(email);
        expect(is_valid).to.be.true;
    })
});