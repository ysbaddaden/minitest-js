require('../lib/promised');
require('../lib/spec');

var AssertionError = require('../lib/minitest').AssertionError;
var assert = require('../lib/minitest').assert;
var refute = require('../lib/minitest').refute;
var expect = require('../lib/minitest').expect;

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
        it("must still test normally", function () {
            assert(true);
        });

        it("must test the resolved promise", function (done) {
            assert(promise(true, done));
        });

        it("must match the resolved promise", function (done) {
            assert.match(/foo/, promise('foobar', done));
        });

        it("must fail", function (done) {
            assert.throws(AssertionError, promise(function () {
                assert.match(/baz/, promise('foobar'));
            }, done));
        });
    });

    describe("refute", function () {
        it("must test normally", function () {
            refute(false);
        });

        it("must test the resolved promise", function (done) {
            refute(promise(false, done));
        });

        it("must test the resolved promise with ok", function (done) {
            refute.ok(promise(false, done));
        });

        it("must fail", function (done) {
            assert.throws(AssertionError, promise(function () {
                refute.match(/bar/, promise('foobar'));
            }, done));
        });
    });

    describe("expect", function () {
        it("must test normally", function () {
            expect(true).toEqual(true);
        });

        it("must test the resolved promise", function (done) {
            expect(promise(true, done)).toEqual(true);
        });

        it("must fail", function (done) {
            expect(promise(function () {
                expect('foobar').toNotMatch(/bar/);
            }, done)).toThrow(AssertionError);
        });
    });

    describe("spec", function () {
        if (!Object.prototype.mustEqual) return;

        it("must test normally", function () {
            expect(true).mustEqual(true);
        });

        it("must test the resolved promise", function (done) {
            promise(true, done).mustEqual(true);
        });

        it("must fail", function (done) {
            promise(function () {
                'foobar'.wontMatch(/bar/);
            }, done).mustThrow(AssertionError);
        });
    });
});
