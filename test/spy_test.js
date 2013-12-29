var minitest = require('../lib/minitest');
var assert = minitest.assert;
var refute = minitest.refute;

var spy = require('../lib/minitest/spy');
var Mock = require('../lib/minitest/mock');

describe("Spy", function () {
    describe("spy method", function () {
        var fn;

        beforeEach(function () {
            fn = spy('foo');
        });

        it("must create a spy", function () {
            assert.typeOf('function', fn);
            assert.typeOf('function', fn.verify);
        });

        it("won't verify when not called", function () {
            refute(fn.verify());
        });

        it("must verify when called", function () {
            fn();
            assert(fn.verify());
        });

        it("must verify without checking parameters", function () {
            fn(1, []);
            assert(fn.verify());
        });

        it("must verify arguments", function () {
            fn(1, '2');
            assert(fn.verify(1, '2'));
        });

        it("won't verify with wrong arguments", function () {
            fn(1, '2');
            refute(fn.verify(1));
            refute(fn.verify(2, '1'));
        });

        it("must verify with loosely specified arguments", function () {
            fn = spy('loose_expectation');
            fn(1, "", {}, []);
            assert(fn.verify(Number, String, Object, Array));
        });
    });

    describe("Object#spy property", function () {
        var fn, obj;

        beforeEach(function () {
            obj = {};
            fn = obj.spy('foo');
        });

        it("must create a spy on object", function () {
            assert.same(fn, obj.foo);
            assert.typeOf('function', obj.foo);
            assert.typeOf('function', obj.foo.verify);
        });

        it("must verify", function () {
            refute(obj.foo.verify());
            obj.foo();
            assert(obj.foo.verify());
        });
    });
});
