var minitest       = require('../lib/minitest');
var utils          = require('../lib/minitest/utils');
var AssertionError = minitest.AssertionError;
var assert         = minitest.assert;

describe("Expectations", function () {
    require('../lib/minitest/spec');

    // skips legacy browsers that don't support properties
    if (!Object.prototype.mustEqual) return;

    it("must infect Object with expectations", function () {
        assert.typeOf('function', Object.prototype.mustEqual);
        assert.typeOf('function', Object.prototype.wontEqual);
    });

    it("mustEqual", function () {
        "content".mustEqual("content");
        assert.throws(AssertionError, function () { (1).mustEqual(2); });
    });

    it("wontEqual", function () {
        "content".wontEqual("<html>");
        assert.throws(AssertionError, function () { (1).wontEqual(1); });
    });
});

describe("expect()", function () {
    var expect = require('../lib/minitest/expectations').expect;

    it(".toEqual", function () {
        expect(1).toEqual(1);
        assert.throws(AssertionError, function () { expect(1).toEqual(2); });
    });

    it(".toNotEqual", function () {
        expect(1).toNotEqual(2);
        assert.throws(AssertionError, function () { expect(1).toNotEqual(1); });
    });
});

