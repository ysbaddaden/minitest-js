var minitest       = require('../lib/minitest');
var AssertionError = minitest.AssertionError;
var assert         = minitest.assert;
var refute         = minitest.refute;

// custom assertion:
assert.failure = function (callback, message) {
    return assert.throws(AssertionError, callback, message);
};

describe("Assertions", function () {
    function Test() {}
    Test.prototype.method = function () {};
    Test.prototype.property = 1;
    Test.factory = function () {};

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
                var e = assert.failure(function () { assert.block(function () { return false; }); });
                assert.equal("Expected block to return true value.", e.message);
            });
        });

        describe(".equal", function () {
            it("null null",           function () { assert.equal(null, null); });
            it("undefined undefined", function () { assert.equal(undefined, undefined); });
            it("null undefined",      function () { assert.equal(null, undefined); });
            it("2 '2'",               function () { assert.equal(2, '2'); });
            it("'2' 2",               function () { assert.equal('2', 2); });
            it("true true",           function () { assert.equal(true, true); });

            it("null []", function () {
                assert.failure(function () { assert.equal(null, []); });
            });

            it("date", function () {
                assert.equal(new Date(2000,3,14), new Date(2000,3,14));
            });
            it("date negative", function () {
                assert.failure(function () { assert.equal(new Date(), new Date(2000,3,14)); });
            });

            it("4 '4'",  function () { assert.equal(4, '4'); });
            it("'4' 4",  function () { assert.equal('4', 4); });
            it("true 1", function () { assert.equal(true, 1); });
            it("4 '5'",  function () {
                var e = assert.failure(function () { assert.equal(4, '5'); });
                assert.equal("Expected '5' to be equal to 4.", e.message);
            });

            it("{a:4} {a:4}", function () { assert.equal({a:4}, {a:4}); });
            it("{a:4,b:'2'} {a:4,b:'2'}", function () { assert.equal({a:4,b:'2'}, {a:4,b:'2'}); });
            it("[4] ['4']", function () { assert.equal([4], ['4']); });
            it("{a:4} {a:4,b:true}", function () {
                var e = assert.failure(function () { assert.equal({a:4}, {a:4,b:true}); });
                assert.equal("Expected {a: 4, b: true} to be equal to {a: 4}.", e.message);
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

                var e = assert.failure(function () {
                    assert.equal(nb1, nb2);
                });
                assert.equal("Expected {first: 'Ryan', last: 'Dahl'} to be equal to {first: 'Ryan', last: 'Dahl'}.", e.message);
            });

            it("'a' {}",    function () {
                var e = assert.failure(function () { assert.equal('a', {}); });
                assert.equal("Expected {} to be equal to 'a'.", e.message);
            });
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

            it("['']",      function () {
                var e = assert.failure(function () { assert.empty(['']); });
                assert.equal("Expected [''] to be empty.", e.message);
            });

            it("{a:1}",     function () {
                var e = assert.failure(function () { assert.empty({a:1}); });
                assert.equal("Expected {a: 1} to be empty.", e.message);
            });
        });

        describe("includes", function () {
            it("must pass", function () { assert.includes([1, 2, 3], 2); });
            it("must fail", function () {
                var e = assert.failure(function () { assert.includes([true], false); });
                assert.equal("Expected [true] to include false.", e.message);
            });
        });

        describe("inDelta", function () {
            it("must be in delta", function () {
                assert.inDelta(0.0, 1.0 / 1000);
                assert.inDelta(0.0, 1.0 / 1000, 0.1);
            });

            it("must fail", function () {
                var e = assert.failure(function () { assert.inDelta(0.0, 1.0 / 1000, 0.000001); });
                assert.equal("Expected 0 - 0.001 (0.001) to be <= 0.000001.", e.message);
            });

            it("must be consistent", function () {
                assert.inDelta(0, 1, 1);
                var e = assert.failure(function () { refute.inDelta(0, 1, 1); });
                assert.equal("Expected 0 - 1 (1) to not be <= 1.", e.message);
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
                var e = assert.failure(function () { assert.inEpsilon(10000, 9990); });
                assert.equal("Expected 10000 - 9990 (10) to be <= 9.99.", e.message);
            });

            it("must fail negative case", function () {
                var e = assert.failure(function () { assert.inEpsilon(-1.1, -1, 0.1); });
                assert.match(/Expected -1.1 - -1 \(0.\d+\) to be <= 0.1./, e.message);
            });
        });

        describe(".same", function () {
            assert.same(null, null);

            it("2 '2'", function () {
                var e = assert.failure(function () { assert.same(2, '2'); });
                assert.equal("Expected '2' to be === 2.", e.message);
            });

            it("null undefined", function () {
                var e = assert.failure(function () { assert.same(null, undefined); });
                assert.equal("Expected undefined to be === null.", e.message);
            });
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
                var e;

                e = assert.failure(function () { assert.match(/.+/, ''); });
                assert.equal("Expected /.+/ to match ''.", e.message);

                e = assert.failure(function () { assert.match(".+", ''); });
                assert.equal("Expected /.+/ to match ''.", e.message);
            });
        });

        describe(".typeOf", function () {
            it("must be of type number", function () {
                assert.typeOf('number', 123.45);
                assert.typeOf('number', NaN);
                var e = assert.failure(function () { assert.typeOf('number', '1'); });
                assert.equal("Expected '1' to be of type 'number' not 'string'.", e.message);
            });

            it("must be a string", function () {
                assert.typeOf('string', "this is a string");
                assert.typeOf('string', "");
                var e = assert.failure(function () { assert.typeOf('string', 1); });
                assert.equal("Expected 1 to be of type 'string' not 'number'.", e.message);
            });

            it("must be an object", function () {
                assert.typeOf('object', {a:1});
                var e = assert.failure(function () { assert.typeOf('object', 1); });
                assert.equal("Expected 1 to be of type 'object' not 'number'.", e.message);
            });

            it("must be an array", function () {
                assert.typeOf('array', [1, 2, 3]);
                var e = assert.failure(function () { assert.typeOf('array', {}); });
                assert.equal("Expected {} to be of type 'array' not 'object'.", e.message);
            });
        });

        describe(".instanceOf", function () {
            it("must be an Object", function () {
                assert.instanceOf(Object, {});
                var e = assert.failure(function () { assert.instanceOf(Object, "content"); });
                assert.equal("Expected 'content' to be an instance of Object.", e.message);
            });

            it("must be an anonymous function", function () {
                var e = assert.failure(function () { assert.instanceOf(function () {}, Object); });
                assert.match(/Expected Object to be an instance of .+\./g, e.message);
            });

            it("must be an Array", function () {
                assert.instanceOf(Array, [1, 2, 3]);
                var e = assert.failure(function () { assert.instanceOf(Array, {}); });
                assert.equal("Expected {} to be an instance of Array.", e.message);
            });

            it("must be an AssertionError", function () {
                assert.instanceOf(AssertionError, new AssertionError("with a message"));
                var e = assert.failure(function () { assert.instanceOf(AssertionError, {}); });
                assert.equal("Expected {} to be an instance of AssertionError.", e.message);
            });
        });

        describe(".respondTo", function () {
            it("must pass", function () {
                assert.respondTo(Test, 'factory');
                assert.respondTo(Test.prototype, 'method');
                assert.respondTo("str", 'toUpperCase');
            });

            it("must fail", function () {
                var e;

                e = assert.failure(function () { assert.respondTo('str', 'unknownMethod'); });
                assert.equal("Expected 'str' to respond to 'unknownMethod'.", e.message);

                e = assert.failure(function () { assert.respondTo(Test, 'method'); });
                assert.equal("Expected Test to respond to 'method'.", e.message);

                e = assert.failure(function () { assert.respondTo(Test.prototype, 'factory'); });
                assert.match(/Expected .+ to respond to 'factory'\./, e.message);
            });

            it("must be a function", function () {
                assert.failure(function () { assert.respondTo(Test.prototype, 'property'); });
            });
        });

        it(".null", function () {
            assert["null"](null);
            var e = assert.failure(function () { assert["null"](undefined); });
            assert.equal("Expected undefined to be null.", e.message);
        });

        it(".undefined", function () {
            assert["undefined"](undefined);
            var e = assert.failure(function () { assert["undefined"](null); });
            assert.equal("Expected null to be undefined.", e.message);
        });
    });

    describe("refute", function () {
        describe(".ok", function () {
            it("false", function () { refute.ok(false); });
        });

        describe(".equal", function () {
            it("true false", function () { refute.equal(true, false); });
            it("true true",  function () {
                var e = assert.failure(function () { refute.equal(true, true); });
                assert.equal("Expected true to not be equal to true.", e.message);
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

            it("[]", function () {
                var e = assert.failure(function () { refute.empty([]); });
                assert.equal("Expected [] to not be empty.", e.message);
            });

            it("{}", function () {
                var e = assert.failure(function () { refute.empty({}); });
                assert.equal("Expected {} to not be empty.", e.message);
            });
        });

        describe("includes", function () {
            it("must pass", function () { refute.includes([true], false); });
            it("must fail", function () {
                var e = assert.failure(function () { refute.includes([1, 2, 3], 1); });
                assert.equal("Expected [1, 2, 3] to not include 1.", e.message);
            });
        });

        describe("inDelta", function () {
            it("won't be in delta", function () {
                refute.inDelta(0.0, 1.0 / 1000, 0.000001);
            });

            it("must fail", function () {
                var e = assert.failure(function () { refute.inDelta(0.0, 1.0 / 1000, 0.1); });
                assert.equal('Expected 0 - 0.001 (0.001) to not be <= 0.1.', e.message);
            });
        });

        describe("inEpsilon", function () {
            it("won't be in epsilon", function () {
                refute.inEpsilon(10000, 9990 - 1);
            });

            it("won't be in epsilon", function () {
                var e = assert.failure(function () { refute.inEpsilon(10000, 9990); });
                assert.equal('Expected 10000 - 9990 (10) to not be <= 10.', e.message);
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
                var e;
                e = assert.failure(function () { refute.match(/.+/, 'contents'); });
                assert.equal("Expected /.+/ to not match 'contents'.", e.message);

                e = assert.failure(function () { refute.match(".+", 'contents'); });
                assert.equal("Expected /.+/ to not match 'contents'.", e.message);
            });
        });

        describe(".typeOf", function () {
            it("won't be a number", function () {
                refute.typeOf('number', '1');
                var e = assert.failure(function () { refute.typeOf('number', 1); });
                assert.equal("Expected 1 to not be of type 'number'.", e.message);
            });

            it("won't be a string", function () {
                refute.typeOf('string', 1);
                var e = assert.failure(function () { refute.typeOf('string', ""); });
                assert.equal("Expected '' to not be of type 'string'.", e.message);
            });

            it("won't be an object", function () {
                refute.typeOf('object', 123.45);
                var e = assert.failure(function () { refute.typeOf('object', {}); });
                assert.equal("Expected {} to not be of type 'object'.", e.message);
            });

            it("won't be an array", function () {
                refute.typeOf('array', {});
                var e = assert.failure(function () { refute.typeOf('array', []); });
                assert.equal("Expected [] to not be of type 'array'.", e.message);
            });
        });

        describe(".instanceOf", function () {
            it("won't be an Object", function () {
                refute.instanceOf(Object, "");

                var e = assert.failure(function () { refute.instanceOf(Object, {}); });
                assert.equal("Expected {} to not be an instance of Object.", e.message);
            });

            it("won't be an Array", function () {
                refute.instanceOf(Array, {});

                var e = assert.failure(function () { refute.instanceOf(Array, []); });
                assert.equal("Expected [] to not be an instance of Array.", e.message);
            });

            it("won't be an AssertionError", function () {
                refute.instanceOf(AssertionError, {});

                var e = assert.failure(function () { refute.instanceOf(Error, new Error("message")); });
                assert.match(/Expected (Error: message|\[object Error\]) to not be an instance of Error./, e.message);
            });
        });

        describe(".respondTo", function () {
            it("must pass", function () {
                refute.respondTo(Test.prototype, 'factory');
                refute.respondTo(Test, 'method');
                refute.respondTo("str", 'method');
            });

            it("must fail", function () {
                var e;

                e = assert.failure(function () { refute.respondTo('str', 'toUpperCase'); });
                assert.match(/Expected 'str' to not respond to 'toUpperCase'\./, e.message);

                e = assert.failure(function () { refute.respondTo(Test.prototype, 'method'); });
                assert.match(/Expected .+ to not respond to 'method'\./, e.message);

                e = assert.failure(function () { refute.respondTo(Test, 'factory'); });
                assert.equal("Expected Test to not respond to 'factory'.", e.message);
            });

            it("must be a function", function () {
                refute.respondTo(Test.prototype, 'property');
            });
        });

        it(".null", function () {
            refute["null"](undefined);
            var e = assert.failure(function () { refute["null"](null); });
            assert.equal("Expected null to not be null.", e.message);
        });

        it(".undefined", function () {
            refute["undefined"](null);
            var e = assert.failure(function () { refute["undefined"](undefined); });
            assert.equal("Expected undefined to not be undefined.", e.message);
        });
    });

    // it("must pretty print diff", function () {
    //     assert.equal({a: 1, b: {c: "night"}}, {a: 1, b: {c: "day"}});
    // });
});
