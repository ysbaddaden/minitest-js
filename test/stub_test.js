var minitest = require('../lib/minitest');
var assert = minitest.assert;
var refute = minitest.refute;

var stub = require('../lib/stub');

var StubTest = function () {};
StubTest.foo = function () { return 'foo'; };
StubTest.prototype.foo = function () { return 'foo'; };

describe("Stub", function () {
    describe("stub method", function () {
        it("must stub object method with value", function () {
            stub(Date, 'now', 123456, function (self) {
                assert.same(Date, self);
                assert.equal(123456, Date.now());
            });
        });

        it("must stub with callable", function () {
            var i = 0;
            var incr = function () { return i += 1; };

            stub(StubTest, 'foo', incr, function () {
                assert.equal(1, StubTest.foo());
                assert.equal(2, StubTest.foo());
            });
        });

        it("must pass arguments to stub", function () {
            var pow = function (n) { return n * n; };
            stub(StubTest, 'foo', pow, function () {
                assert.equal(64, StubTest.foo(8));
            });
        });

        it("must restore method", function () {
            stub(StubTest, 'foo', 'bar', function () {
                assert.equal('bar', StubTest.foo());
            });
            assert.equal('foo', StubTest.foo());
        });
    });

    describe("Object#stub property", function () {
        var obj;

        // skips legacy browsers that don't support properties
        if (!Object.prototype.stub) return;

        beforeEach(function () {
            obj = new StubTest();
        });

        it("must stub method with value", function () {
            obj.stub('foo', 'bar', function (self) {
                assert.same(obj, self);
                assert.equal('bar', obj.foo());
            });
        });

        it("must stub method with callable", function () {
            var i = 0;
            var incr = function () { return i += 1; };

            obj.stub('foo', incr, function () {
                assert.equal(1, obj.foo());
                assert.equal(2, obj.foo());
            });
        });

        it("must pass arguments to stubbed callable", function () {
            var pow = function (n) { return n * n; };
            obj.stub('foo', pow, function () {
                assert.equal(64, obj.foo(8));
            });
        });

        it("must restore method", function () {
            obj.stub('foo', 'bar', function () {
                assert.equal('bar', obj.foo());
            });
            assert.equal('foo', obj.foo());
        });
    });
});
