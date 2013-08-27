var minitest       = require('../lib/minitest');
var AssertionError = minitest.AssertionError;
var assert         = minitest.assert;
var refute         = minitest.refute;

// custom assertion:
assert.failure = function (callback, message) {
    assert.throws(AssertionError, callback, message);
};

describe("Assertions", function () {
    var ary = [1, 2, 3];
    var obj = {a: 1, b: 2, c: {1: 3}};

    describe("assert", function () {
        describe(".ok", function () {
            it("true", function () { assert.ok(true); });
            it("'test'", function () { assert.ok('test'); });
        });

        describe("block", function () {
            it("must pass", function () {
                assert.block(function () { return true; });
            });

            it("must fail", function () {
                assert.failure(function () { assert.block(function () { return false; }); });
            });
        });

        describe(".equal", function () {
            it("null null",           function () { assert.equal(null, null); });
            it("undefined undefined", function () { assert.equal(undefined, undefined); });
            it("null undefined",      function () { assert.equal(null, undefined); });
            it("2 '2'",               function () { assert.equal(2, '2'); });
            it("'2' 2",               function () { assert.equal('2', 2); });
            it("true true",           function () { assert.equal(true, true); });

            it("date", function () {
                assert.equal(new Date(2000,3,14), new Date(2000,3,14));
            });
            it("date negative", function () {
                assert.failure(function () { assert.equal(new Date(), new Date(2000,3,14)); });
            });

            it("4 '4'",  function () { assert.equal(4, '4'); });
            it("'4' 4",  function () { assert.equal('4', 4); });
            it("true 1", function () { assert.equal(true, 1); });
            it("4 '5'",  function () { assert.failure(function () { assert.equal(4, '5'); }); });

            it("{a:4} {a:4}", function () { assert.equal({a:4}, {a:4}); });
            it("{a:4,b:'2'} {a:4,b:'2'}", function () { assert.equal({a:4,b:'2'}, {a:4,b:'2'}); });
            it("[4] ['4']", function () { assert.equal([4], ['4']); });
            it("{a:4} {a:4,b:true}", function () {
                assert.failure(function () { assert.equal({a:4}, {a:4,b:true}); });
            });

            it("['a'], {0:'a'}", function () { assert.equal(['a'], {0:'a'}); });
            it("{b:1,a:4} {a:4,b:1}", function () { assert.equal({b:1,a:4}, {a:4,b:1}); });

            it('arrays with non-numeric properties', function () {
                var a1 = [1,2,3];
                var a2 = [1,2,3];
                a1.a = "test";
                a1.b = true;
                a2.b = true;
                a2.a = "test";
                assert.failure(function () { assert.equal(Object.keys(a1), Object.keys(a2)); });
                assert.equal(a1, a2);
            });

            it("identical prototype", function () {
                var nbRoot = {
                    toString: function(){return this.first+' '+this.last;}
                };
                var nameBuilder = function(first,last){
                    this.first = first;
                    this.last = last;
                    return this;
                };
                nameBuilder.prototype = nbRoot;
                var nameBuilder2 = function(first,last){
                    this.first = first;
                    this.last = last;
                    return this;
                };
                nameBuilder2.prototype = nbRoot;
                var nb1 = new nameBuilder('Ryan', 'Dahl');
                var nb2 = new nameBuilder2('Ryan','Dahl');

                assert.equal(nb1, nb2);

                nameBuilder2.prototype = Object;
                nb2 = new nameBuilder2('Ryan','Dahl');

                assert.failure(function () {
                    assert.equal(nb1, nb2);
                });
            });

            it("'a' {}",    function () { assert.failure(function () { assert.equal('a', {}); }); });
            it("'' ''",     function () { assert.equal('', ''); });
            it("'' ['']",   function () { assert.equal('', ['']); });
            it("[''] ['']", function () { assert.equal([''], ['']); });
        });

        describe("empty", function () {
            it("null",      function () { assert.empty(null); });
            it("undefined", function () { assert.empty(undefined); });
            it("''",        function () { assert.empty(''); });
            it("[]",        function () { assert.empty([]); });
            it("{}",        function () { assert.empty({}); });
            it("['']",      function () { assert.failure(function () { assert.empty(['']); }); });
            it("{a:1}",     function () { assert.failure(function () { assert.empty({a:1}); }); });
        });

        describe("includes", function () {
            it("must pass", function () { assert.includes([1, 2, 3], 2); });
            it("must fail", function () { assert.failure(function () { assert.includes([true], false); }); });
        });

        describe("inDelta", function () {
            it("must be in delta", function () {
                assert.inDelta(0.0, 1.0 / 1000);
                assert.inDelta(0.0, 1.0 / 1000, 0.1);
            });

            it("must fail", function () {
                assert.failure(function () { assert.inDelta(0.0, 1.0 / 1000, 0.000001); });
            });

            it("must be consistent", function () {
                assert.inDelta(0, 1, 1);
                assert.failure(function () { refute.inDelta(0, 1, 1); });
            });
        });

        describe("inEpsilon", function () {
            it("must be in epsilon", function () {
                assert.inEpsilon(10000, 9991);
                assert.inEpsilon(9991, 10000);
                assert.inEpsilon(1.0, 1.001);
                assert.inEpsilon(1.001, 1.0);

                assert.inEpsilon(10000, 9999.1, 0.0001);
                assert.inEpsilon(9999.1, 10000, 0.0001);
                assert.inEpsilon(1.0, 1.0001, 0.0001);
                assert.inEpsilon(1.0001, 1.0, 0.0001);

                assert.inEpsilon(-10000, -9991);
                assert.inEpsilon(-1, -1);
            });

            it("must fail", function () {
                assert.failure(function () { assert.inEpsilon(10000, 9990); });
            });

            it("must fail negative case", function () {
                assert.failure(function () { assert.inEpsilon(-1.1, -1, 0.1); });
            });
        });

        describe(".same", function () {
            it("2 '2'", function () { assert.failure(function () { assert.same(2, '2'); }); });
            it("null undefined", function () { assert.failure(function () { assert.same(null, undefined); }); });
        });

        describe("throws", function () {
            it("must catch all errors", function () {
                assert.throws(function () { throw new Error(); });
            });

            it("must catch the specified error", function () {
                assert.throws(Error, function () { throw new Error(); });
            });

            it("must throw back the error if unexpected type", function () {
                assert.throws(Error, function () {
                    assert.throws(AssertionError, function () {
                        throw new Error();
                    });
                });
            });

            it("must fail if no error is thrown", function () {
                assert.failure(function () { assert.throws(Error, function () {}); });
                assert.failure(function () { assert.throws(function () {}); });
            });

            it("must return the catched exception", function () {
                var err = assert.throws(Error, function () { throw new Error("some message"); });
                assert(err);
                assert.instanceOf(Error, err);
                assert.equal("some message", err.message);
            });
        });

        describe(".match", function () {
            it("must pass", function () {
                assert.match(/.+/, 'contents');
                assert.match(".+", 'contents');
            });

            it("must fail", function () {
                assert.failure(function () { assert.match(/.+/, ''); });
                assert.failure(function () { assert.match(".+", ''); });
            });
        });

        describe(".typeOf", function () {
            it("must be of type number", function () {
                assert.typeOf('number', 123.45);
                assert.typeOf('number', NaN);
                assert.failure(function () { assert.typeOf('number', '1'); });
            });

            it("must be a string", function () {
                assert.typeOf('string', "this is a string");
                assert.typeOf('string', "");
                assert.failure(function () { assert.typeOf('string', 1); });
            });

            it("must be an object", function () {
                assert.typeOf('object', {a:1});
                assert.typeOf('object', [1, 2, 3]);
                assert.failure(function () { assert.typeOf('object', 1); });
            });

            it("must be an array", function () {
                assert.typeOf('array', [1, 2, 3]);
                assert.failure(function () { assert.typeOf('array', {}); });
            });
        });

        describe(".instanceOf", function () {
            it("must be an Object", function () {
                assert.instanceOf(Object, {});
                assert.failure(function () { assert.instanceOf(Object, "content"); });
            });

            it("must be an Array", function () {
                assert.instanceOf(Array,  ary);
                assert.failure(function () { assert.instanceOf(Array, {}); });
            });

            it("must be an AssertionError", function () {
                assert.instanceOf(AssertionError, new AssertionError("with a message"));
                assert.failure(function () { assert.instanceOf(AssertionError, {}); });
            });
        });
    });

    describe("refute", function () {
        describe(".ok", function () {
            it("false", function () { refute.ok(false); });
        });

        describe(".equal", function () {
            it("true false", function () { refute.equal(true, false); });
            it("true true",  function () {
                assert.failure(function () { refute.equal(true, true); });
            });
            it("2 '3'", function () { refute.equal(2, '3'); });
            it("{a:1,b:{c:2}} {a:1,b:{c:3}}", function () {
                refute.equal({a:1,b:{c:2}}, {a:1,b:{c:3}});
            });
        });

        describe("empty", function () {
            it("'content'", function () { refute.empty('content'); });
            it("[1]",       function () { refute.empty([1]); });
            it("{a:1}",     function () { refute.empty({a:1}); });
            it("[]",        function () { assert.failure(function () { refute.empty([]); }); });
            it("{}",        function () { assert.failure(function () { refute.empty({}); }); });
        });

        describe("includes", function () {
            it("must pass", function () { refute.includes([true], false); });
            it("must fail", function () { assert.failure(function () { refute.includes([1, 2, 3], 1); }); });
        });

        describe("inDelta", function () {
            it("won't be in delta", function () {
                refute.inDelta(0.0, 1.0 / 1000, 0.000001);
            });

            it("must fail", function () {
                assert.failure(function () { refute.inDelta(0.0, 1.0 / 1000, 0.1); });
            });
        });

        describe("inEpsilon", function () {
            it("won't be in epsilon", function () {
                refute.inEpsilon(10000, 9990 - 1);
            });

            it("won't be in epsilon", function () {
                assert.failure(function () { refute.inEpsilon(10000, 9990); });
            });
        });

        describe(".same", function () {
            it("2 '2'", function () { refute.same(2, '2'); });
        });

        describe(".match", function () {
            it("must pass", function () {
                refute.match(/.+/, '');
                refute.match(".+", '');
            });

            it("must fail", function () {
                assert.failure(function () { refute.match(/.+/, 'contents'); });
                assert.failure(function () { refute.match(".+", 'contents'); });
            });
        });

        describe(".typeOf", function () {
            it("won't be a number", function () {
                refute.typeOf('number', '1');
                assert.failure(function () { refute.typeOf('number', 1); });
            });

            it("won't be a string", function () {
                refute.typeOf('string', 1);
                assert.failure(function () { refute.typeOf('string', ""); });
            });

            it("won't be an object", function () {
                refute.typeOf('object', 123.45);
                assert.failure(function () { refute.typeOf('object', {}); });
            });

            it("won't be an array", function () {
                refute.typeOf('array', {});
                assert.failure(function () { refute.typeOf('array', []); });
            });
        });

        describe(".instanceOf", function () {
            it("won't be an Object", function () {
                refute.instanceOf(Object, "");
                assert.failure(function () { refute.instanceOf(Object, {}); });
            });

            it("won't be an Array", function () {
                refute.instanceOf(Array, {});
                assert.failure(function () { refute.instanceOf(Array, []); });
            });

            it("won't be an AssertionError", function () {
                refute.instanceOf(AssertionError, {});
                assert.failure(function () { refute.instanceOf(AssertionError, new AssertionError("message")); });
            });
        });
    });

    // it("must pretty print diff", function () {
    //     assert.equal({a: 1, b: {c: "night"}}, {a: 1, b: {c: "day"}});
    // });
});
