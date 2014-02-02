var minitest       = require('../lib/minitest');
var utils          = require('../lib/utils');
var AssertionError = minitest.AssertionError;
var assert         = minitest.assert;

describe("Expectations", function () {
    function Test() {}
    Test.prototype.method = function () {};
    Test.factory = function () {};

    describe("matchers", function () {
        require('../lib/spec');

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
            (1).mustEqual(1);
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

        it(".mustRespondTo", function () {
            Test.mustRespondTo('factory');
            Test.prototype.mustRespondTo('method');
            assert.throws(AssertionError, function () { Test.mustRespondTo('method'); });
        });

        it(".wontRespondTo", function () {
            Test.wontRespondTo('method');
            Test.prototype.wontRespondTo('factory');
            assert.throws(AssertionError, function () { Test.wontRespondTo('factory'); });
        });
    });

    describe("expect()", function () {
        var expect = require('../lib/minitest').expect;

        it(".toBeEmpty", function () {
            expect([]).toBeEmpty();
            assert.throws(AssertionError, function () { expect([1]).toBeEmpty(); });
        });

        it(".toNotBeEmpty", function () {
            expect([1]).toNotBeEmpty();
            assert.throws(AssertionError, function () { expect([]).toNotBeEmpty(); });
        });

        it(".toEqual", function () {
            expect("content").toEqual("content");
            assert.throws(AssertionError, function () { expect(1).toEqual(2); });
        });

        it(".toNotEqual", function () {
            expect("content").toNotEqual("<html>");
            assert.throws(AssertionError, function () { expect(1).toNotEqual(1); });
        });

        it(".toBeNull", function () {
            expect(null).toBeNull();
            assert.throws(AssertionError, function () { expect(undefined).toBeNull(); });
        });

        it(".toNotBeNull", function () {
            expect(undefined).toNotBeNull();
            assert.throws(AssertionError, function () { expect(null).toNotBeNull(); });
        });

        it(".toBeUndefined", function () {
            expect(undefined).toBeUndefined();
            assert.throws(AssertionError, function () { expect(null).toBeUndefined(); });
        });

        it(".toNotBeUndefined", function () {
            expect(null).toNotBeUndefined();
            assert.throws(AssertionError, function () { expect(undefined).toNotBeUndefined(); });
        });

        it(".toBeWithinDelta", function () {
            expect(0).toBeWithinDelta(1.0 / 1000);
            assert.throws(AssertionError, function () { expect(0).toBeWithinDelta(1.0 / 999); });
        });

        it(".toNotBeWithinDelta", function () {
            expect(0).toNotBeWithinDelta(1.0 / 1000, 0.000001);
            assert.throws(AssertionError, function () { expect(0).toNotBeWithinDelta(1.0 / 1000, 0.1); });
        });

        it(".toBeWithinEpsilon", function () {
            expect(9991).toBeWithinEpsilon(10000);
            expect(9999.1).toBeWithinEpsilon(10000, 0.0001);
            assert.throws(AssertionError, function () { expect(9990).toBeWithinEpsilon(10000); });
        });

        it(".toNotBeWithinEpsilon", function () {
            expect(9990 - 1).toNotBeWithinEpsilon(10000);
            assert.throws(AssertionError, function () { expect(9990).toNotBeWithinEpsilon(10000); });
        });

        it(".toInclude", function () {
            expect([1, 2]).toInclude(2);
            assert.throws(AssertionError, function () { expect([1, 2]).toInclude(3); });
        });

        it(".toNotInclude", function () {
            expect([1, 2]).toNotInclude(3);
            assert.throws(AssertionError, function () { expect([1, 2]).toNotInclude(2); });
        });

        it(".toBeInstanceOf", function () {
            expect([]).toBeInstanceOf(Array);
            assert.throws(AssertionError, function () { expect([]).toBeInstanceOf(Number); });
        });

        it(".toNotBeInstanceOf", function () {
            expect([]).toNotBeInstanceOf(Number);
            assert.throws(AssertionError, function () { expect([]).toNotBeInstanceOf(Array); });
        });

        it(".toBeTypeOf", function () {
            expect([]).toBeTypeOf('array');
            assert.throws(AssertionError, function () { expect([]).toBeTypeOf('number'); });
        });

        it(".toNotBeTypeOf", function () {
            expect([]).toNotBeTypeOf('number');
            assert.throws(AssertionError, function () { expect([]).toNotBeTypeOf('array'); });
        });

        it(".toMatch", function () {
            expect("content").toMatch(/\w+/);
            assert.throws(AssertionError, function () { expect("content").toMatch(/\s+/); });
        });

        it(".toNotMatch", function () {
            expect("content").toNotMatch(/\s+/);
            assert.throws(AssertionError, function () { expect("content").toNotMatch(/\w+/); });
        });

        it(".toBeSameAs", function () {
            var obj = {};
            expect(obj).toBeSameAs(obj);
            assert.throws(AssertionError, function () { expect({}).toBeSameAs(obj); });
        });

        it(".toNotBeSameAs", function () {
            var obj = [];
            expect([]).toNotBeSameAs(obj);
            assert.throws(AssertionError, function () { expect(obj).toNotBeSameAs(obj); });
        });

        it(".toThrow", function () {
            expect(function () { throw new Error(); }).toThrow();
            var e = expect(function () { throw new Error(); }).toThrow(Error);
            expect(e).toBeInstanceOf(Error);
        });

        it(".toRespondTo", function () {
            expect(Test).toRespondTo('factory');
            expect(Test.prototype).toRespondTo('method');
            assert.throws(AssertionError, function () { expect(Test).toRespondTo('method'); });
        });

        it(".toNotRespondTo", function () {
            expect(Test).toNotRespondTo('method');
            expect(Test.prototype).toNotRespondTo('factory');
            assert.throws(AssertionError, function () { expect(Test).toNotRespondTo('factory'); });
        });
    });
});
