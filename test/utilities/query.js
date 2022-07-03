/** */
const { assert, expect } = require('chai');
const util = require("../../src/utilities/query");

describe("Tests Query utility", () => {

    it("builds correct in data", () => {
        const string = '14:15:89';
        const needle = string.split(':')[0];
        expect(util.buildInQuery(string))
            .to.haveOwnProperty('$in')
            .that.is.an('array')
            .that.contains(needle);
    });

    it("builds correct nor data", () => {
        const string = '!15!89';
        const needle = string.split('!')[1];
        expect(util.buildNorQuery(string))
            .to.haveOwnProperty('$nin')
            .that.is.an('array')
            .that.contains(needle);
    });

    it("builds correct or data", () => {
        const string = '14,15,89';
        const needle = string.split(',')[0];
        expect(util.buildOrQuery(string))
            .to.haveOwnProperty('$in')
            .that.is.an('array')
            .that.contains(needle);
    });

    it("builds correct data $gte", () => {
        const string = "2~15";
        const expected_value = Number(string.split('~')[0]);
        expect(util.buildRangeQuery(string))
            .to.be.an('object')
            .to.have.property('$gte')
            .to.be.equal(expected_value);
    });

    it("builds correct data $lte", () => {
        const string = "2~15";
        const expected_value = Number(string.split('~')[1]);
        expect(util.buildRangeQuery(string))
            .to.be.an('object')
            .to.have.property('$lte')
            .to.be.equal(expected_value);
    });

    it("builds return_fields query params", () => {
        const string = "name, age";
        expect(util.buildReturnFieldsString(string))
            .to.be.a('string')
            .to.be.equal(string.replace(/,/gi, ' '))
            .to.not.contain(',');
    });

    it("builds sort_by query params", () => {
        const string = "name, age";
        expect(util.buildSortOrderString(string))
            .to.be.a('string')
            .to.be.equal(string.replace(/,/gi, ' '))
            .to.contain(' ')
            .and.not.contain(',');
    });

    it("builds wildcard options:", () => {
        const key_list = 'firstname,lastname';
        const value = 'Nathan';

        expect(util.buildWildcardOptions(key_list, value))
            .to.have.ownProperty('$or')
            .to.be.an('array')
            .has.length(key_list.split(',').length);
    });

    it("determines correct pagination", () => {
        const page = 1, population = 50;
        const skip = page * population;
        expect(util.determinePagination(page, population))
            .to.have.keys(["limit", "skip"])
            .to.have.property("skip")
            .to.be.equal(skip);
    });

    it("returns correct data", () => {
        const keys = [
            'count', 'fields_to_return', 'limit',
            'seek_conditions', 'skip', 'sort_condition'
        ];

        const options = {
            firstname: 'matt,nate',
            lastname: '!David',
            age: "13:15:67",
            score: "50~100",
            sort_by: '-firstname',
            return_only: 'firstname,lastname',
            page: 0,
            population: 100,
        }


        expect(util.buildQuery(options))
            .to.have.keys(keys);
    });
});