var minitest       = require('../lib/minitest');
var utils          = require('../lib/minitest/utils');
var AssertionError = minitest.AssertionError;
var assert         = minitest.assert;

describe("Expectations", function () {
    require('../lib/minitest/spec');

    describe("matchers", function () {
        // skips legacy browsers that don't support properties
        if (!Object.prototype.mustEqual) return;

        it("must infect Object with expectations", function () {
            assert.typeOf('function', Object.prototype.mustEqual);
            assert.typeOf('function', Object.prototype.wontEqual);
        });

        it("mustBeEmpty", function () {
            [].mustBeEmpty();
            assert.throws(AssertionError, function () { ([1]).mustBeEmpty(); });
        });

        it("wontBeEmpty", function () {
            [1].wontBeEmpty();
            assert.throws(AssertionError, function () { ([]).wontBeEmpty(); });
        });

        it("mustEqual", function () {
            "content".mustEqual("content");
            assert.throws(AssertionError, function () { (1).mustEqual(2); });
        });

        it("wontEqual", function () {
            "content".wontEqual("<html>");
            assert.throws(AssertionError, function () { (1).wontEqual(1); });
        });

        it("mustBeWithinDelta", function () {
            (0).mustBeWithinDelta(1.0 / 1000);
            assert.throws(AssertionError, function () { (0).mustBeWithinDelta(1.0 / 999); });
        });

        it("wontBeWithinDelta", function () {
            (0).wontBeWithinDelta(1.0 / 1000, 0.000001);
            assert.throws(AssertionError, function () { (0).wontBeWithinDelta(1.0 / 1000, 0.1); });
        });

        it("mustBeWithinEpsilon", function () {
            (9991).mustBeWithinEpsilon(10000);
            (9999.1).mustBeWithinEpsilon(10000, 0.0001);
            assert.throws(AssertionError, function () { (9990).mustBeWithinEpsilon(10000); });
        });

        it("wontBeWithinEpsilon", function () {
            (9990 - 1).wontBeWithinEpsilon(10000);
            assert.throws(AssertionError, function () { (9990).wontBeWithinEpsilon(10000); });
        });

        it("mustInclude", function () {
            [1, 2].mustInclude(2);
            assert.throws(AssertionError, function () { [1, 2].mustInclude(3); });
        });

        it("wontInclude", function () {
            [1, 2].wontInclude(3);
            assert.throws(AssertionError, function () { [1, 2].wontInclude(2); });
        });

        it("mustBeInstanceOf", function () {
            [].mustBeInstanceOf(Array);
            assert.throws(AssertionError, function () { [].mustBeInstanceOf(Number); });
        });

        it("wontBeInstanceOf", function () {
            [].wontBeInstanceOf(Number);
            assert.throws(AssertionError, function () { [].wontBeInstanceOf(Array); });
        });

        it("mustBeTypeOf", function () {
            [].mustBeTypeOf('array');
            assert.throws(AssertionError, function () { [].mustBeTypeOf('number'); });
        });

        it("wontBeTypeOf", function () {
            [].wontBeTypeOf('number');
            assert.throws(AssertionError, function () { [].wontBeTypeOf('array'); });
        });

        it("mustMatch", function () {
            "content".mustMatch(/\w+/);
            assert.throws(AssertionError, function () { "content".mustMatch(/\s+/); });
        });

        it("wontMatch", function () {
            "content".wontMatch(/\s+/);
            assert.throws(AssertionError, function () { "content".wontMatch(/\w+/); });
        });

        it("mustBeSameAs", function () {
            var obj = {};
            obj.mustBeSameAs(obj);
            assert.throws(AssertionError, function () { ({}).mustBeSameAs(obj); });
        });

        it("wontBeSameAs", function () {
            var obj = [];
            [].wontBeSameAs(obj);
            assert.throws(AssertionError, function () { obj.wontBeSameAs(obj); });
        });

        it("mustThrow", function () {
            (function () { throw new Error(); }).mustThrow();
            var e = (function () { throw new Error(); }).mustThrow(Error);
            e.mustBeInstanceOf(Error);
        });
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

