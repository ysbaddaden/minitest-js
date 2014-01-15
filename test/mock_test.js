var minitest = require('../lib/minitest');
var assert = minitest.assert;
var refute = minitest.refute;

var Mock = require('../lib/mock');

describe("Mock", function () {
    var mock = null;

    beforeEach(function () {
        mock = new Mock().expect('foo');
        mock.expect('meaning_of_life', 42);
    });

    describe("#expect", function () {
        it("must create stub method", function () {
            assert.typeOf('function', mock.foo);
        });

        it("must return the specified value", function () {
            assert.equal(42, mock.meaning_of_life());
        });

        it("must allow expectations to be added after creation", function () {
            mock.expect('bar', true);
            assert(mock.bar());
        });

        it("must blow up with non-array args", function () {
            assert.throws(TypeError, function () {
                mock.expect('blah', 3, false);
            });
        });

        it("must blow up on wrong number of arguments", function () {
            mock.expect('sum', 3, [1, 2]);
            assert.throws(TypeError, function () {
                mock.sum();
            });
        });

        it("must blow up on wrong arguments", function () {
            mock.foo();
            mock.meaning_of_life();
            mock.expect('sum', 3, [1, 2]);
            assert.throws(Mock.ExpectationError, function () {
                mock.sum(2, 4);
            });
        });

        it("must assign per mock return values", function () {
            var a = new Mock().expect('foo', 2);
            var b = new Mock().expect('foo', 3);
            assert.equal(2, a.foo());
            assert.equal(3, b.foo());
        });

        it("must be blank", function () {
            var a = new Mock();
            refute.typeOf('function', a.foo);
        });

        it("must mock same method many times", function () {
            mock = new Mock();
            mock.expect('foo', false);
            mock.expect('foo', true);
            refute(mock.foo());
            assert(mock.foo());
        });

        it("must be called in order", function () {
            mock = new Mock();
            mock.expect('foo', false, ['bar']);
            mock.expect('foo', true,  ['baz']);
            assert.throws(Mock.ExpectationError, function () {
                refute(mock.foo('baz'));
            });
        });

        it("must run out of mocks for same method", function () {
            mock.expect('a');
            mock.a();
            assert.throws(Mock.ExpectationError, function () {
                mock.a();
            });
        });

        it("must fail when callback returns false", function () {
            mock = new Mock();
            mock.expect('foo', null, function () { return false; });
            assert.throws(Mock.ExpectationError, function () {
                mock.foo();
            });
        });

        it("must throw when passed args + callback", function () {
            mock = new Mock();
            assert.throws(TypeError, function () {
                mock.expect('foo', null, [1, 2, 3], function () { return true; });
            });
        });

        it("must return retval when called with block", function () {
            mock = new Mock();
            mock.expect('foo', 32, function () { return true; });
            assert.equal(32, mock.foo());
        });
    });

    describe("#verify", function () {
        it("must blow up if not called", function () {
            mock.foo();
            assert.throws(Mock.ExpectationError, function () {
                mock.verify();
            });
        });

        it("won't blow up if everything is called", function () {
            mock.foo();
            mock.meaning_of_life();
            assert(mock.verify());
        });

        it("must blow up if new expected method is not called", function () {
            mock.foo();
            mock.meaning_of_life();
            mock.expect('bar', true);
            assert.throws(Mock.ExpectationError, function () {
                mock.verify();
            });
        });

        it("must allow called args to be loosely specified", function () {
            mock = new Mock();
            mock.expect('loose_expectation', true, [Number, String, Object, Array]);
            assert(mock.loose_expectation(1, "", {}, []));
            assert(mock.verify());
        });

        it("won't blow up when same method expects are all called", function () {
            mock = new Mock();
            mock.expect('foo', null, ['bar']);
            mock.expect('foo', null, ['baz']);
            mock.foo('bar');
            mock.foo('baz');
            mock.verify();
        });

        it("must blow up when same method expects aren't all called", function () {
            mock = new Mock();
            mock.expect('foo', null, ['bar']);
            mock.expect('foo', null, ['baz']);
            mock.foo('bar');
            assert.throws(Mock.ExpectationError, function () {
                mock.verify();
            });
        });

        it("won't blow up when callback returns true", function () {
            mock = new Mock();
            mock.expect('foo', null, function () { return true; });
            mock.foo();
            assert(mock.verify());
        });

        it("won't blow up when callback is passed arguments", function () {
            var arg1 = 'bar', arg2 = [1, 2, 3], arg3 = {a: 'a'};
            mock = new Mock();
            mock.expect('foo', null, function (a1, a2, a3) {
                return a1 === arg1 && a2 === arg2 && a3 === arg3;
            });
            mock.foo(arg1, arg2, arg3);
            assert(mock.verify());
        });
    });
});
