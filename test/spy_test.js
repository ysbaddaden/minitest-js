var minitest = require('../lib/minitest');
var assert = minitest.assert;
var refute = minitest.refute;
var expect = minitest.expect;

var spy = require('../lib/spy');
var Mock = require('../lib/mock');

var assert_failure = function (callback, message) {
    return assert.throws(minitest.AssertionError, callback, message);
};

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
        if (!Object.prototype.spy) return;
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

    describe("Assertions", function () {
        var fn;

        beforeEach(function () {
            fn = spy('foo');
        });

        it("assert.called", function () {
            var e = assert_failure(function () { assert.called(fn); });
            assert.equal("Expected spy to have been called.", e.message);

            fn();
            assert.called(fn);
        });

        it("assert.calledWith", function () {
            fn(1, 2, 3, 4);
            assert.calledWith(fn, [1, 2, 3, 4]);

            var e = assert_failure(function () { assert.calledWith(fn, [4, 3, 2, 1]); });
            assert.equal("Expected spy to have been called with args [4, 3, 2, 1].", e.message);
        });

        it("refute.called", function () {
            refute.called(fn);

            fn();
            var e = assert_failure(function () { refute.called(fn); });
            assert.equal("Expected spy not to have been called.", e.message);
        });

        it("refute.calledWith", function () {
            fn(1);
            refute.calledWith(fn, [4]);

            var e = assert_failure(function () { assert.calledWith(fn, [4]); });
            refute.equal("Expected spy not to have been called with args [1].", e.message);
        });

        describe("spec", function () {
            if (!Object.prototype.mustHaveBeenCalled) return;

            it("mustHaveBeenCalled", function () {
                assert_failure(function () { fn.mustHaveBeenCalled(); });
                fn();
                fn.mustHaveBeenCalled();
            });

            it("mustHaveBeenCalledWith", function () {
                fn(1, 2);
                fn.mustHaveBeenCalled([1, 2]);
                assert_failure(function () { fn.mustHaveBeenCalledWith([2, 1]); });
            });

            it("wontHaveBeenCalled", function () {
                fn.wontHaveBeenCalled();
                fn();
                assert_failure(function () { fn.wontHaveBeenCalled(); });
            });

            it("wontHaveBeenCalledWith", function () {
                fn(1, 2);
                fn.wontHaveBeenCalledWith([2, 1]);
                assert_failure(function () { fn.wontHaveBeenCalledWith([1, 2]); });
            });
        });

        describe("expect", function () {
            it("toHaveBeenCalled", function () {
                assert_failure(function () { expect(fn).toHaveBeenCalled(); });
                fn();
                expect(fn).toHaveBeenCalled();
            });

            it("toHaveBeenCalledWith", function () {
                fn(1, 2);
                expect(fn).toHaveBeenCalled([1, 2]);
                assert_failure(function () { expect(fn).toHaveBeenCalledWith([2, 1]); });
            });

            it("toNotHaveBeenCalled", function () {
                expect(fn).toNotHaveBeenCalled();
                fn();
                assert_failure(function () { expect(fn).toNotHaveBeenCalled(); });
            });

            it("toNotHaveBeenCalledWith", function () {
                fn(1, 2);
                expect(fn).toNotHaveBeenCalledWith([2, 1]);
                assert_failure(function () { expect(fn).toNotHaveBeenCalledWith([1, 2]); });
            });
        });
    });
});
