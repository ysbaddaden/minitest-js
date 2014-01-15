var minitest = require('../lib/minitest');
require('../lib/minitest/promised');

var AssertionError = minitest.AssertionError;
var assert = minitest.assert;
var refute = minitest.refute;

describe("Promised", function () {
    this.timeout(100);

    function promise(value, done) {
        return {
            then: function (fulfilled) {
                fulfilled(value);
                done();
            }
        };
    }

    describe("assert", function () {
        it("must still test without a promise", function () {
            assert(true);
        });

        it("must test the resolved promise", function (done) {
            assert(promise(true, done));
        });

        it("must match the resolved promise", function (done) {
            assert.match(/foo/, promise('foobar', done));
        });

        it("must fail to match the resolved promise", function (done) {
            assert.throws(AssertionError, promise(function () {
                assert.match(/baz/, promise('foobar'));
            }, done));
        });
    });

    describe("refute", function () {
        it("must still test without a promise", function () {
            refute(false);
        });

        it("must test the resolved promise", function (done) {
            refute(promise(false, done));
        });

        it("must test the resolved promise with ok", function (done) {
            refute.ok(promise(false, done));
        });

        it("must match the resolved promise", function (done) {
            assert.throws(AssertionError, promise(function () {
                refute.match(/bar/, promise('foobar'));
            }, done));
        });
    });
});
