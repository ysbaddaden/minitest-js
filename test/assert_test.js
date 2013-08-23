describe("testunit", function () {
    var testunit       = require('../src/testunit');
    var AssertionError = testunit.AssertionError;
    var assert         = testunit.assert;
    var refute         = testunit.refute;

    var ary = [1, 2, 3];
    var obj = {a: 1, b: 2, c: {1: 3}};

    describe(".assert", function () {
        describe(".ok", function () {
            it("true",   function () { assert.ok(true); });
            it("'test'", function () { assert.ok('test'); });
        });

        describe(".equal", function () {
            it("null null", function () { assert.equal(null, null); });
            it("undefined undefined", function () { assert.equal(undefined, undefined); });
            it("null undefined", function () { assert.equal(null, undefined); });
            it("2 '2'", function () { assert.equal(2, '2'); });
            it("'2' 2", function () { assert.equal('2', 2); });
            it("true true", function () { assert.equal(true, true); });
        });

        describe(".same", function () {
            it("2 '2'", function () { assert.throws(AssertionError, function () { assert.same(2, '2'); }); });
            it("null undefined", function () { assert.throws(AssertionError, function () { assert.same(null, undefined); }); });
        });

        describe(".deepEqual", function () {
            it("date", function () { assert.deepEqual(new Date(2000,3,14), new Date(2000,3,14)); });
            it("date negative", function () {
                assert.throws(AssertionError, function () {
                    assert.deepEqual(new Date(), new Date(2000,3,14));
                });
            });

            it("4 '4'",  function () { assert.deepEqual(4, '4'); });
            it("'4' 4",  function () { assert.deepEqual('4', 4); });
            it("true 1", function () { assert.deepEqual(true, 1); });
            it("4 '5'",  function () {
                assert.throws(AssertionError, function () {
                    assert.deepEqual(4, '5');
                });
            });

            it("{a:4} {a:4}", function () { assert.deepEqual({a:4}, {a:4}); });
            it("{a:4,b:'2'} {a:4,b:'2'}", function () { assert.deepEqual({a:4,b:'2'}, {a:4,b:'2'}); });
            it("[4] ['4']", function () { assert.deepEqual([4], ['4']); });
            it("{a:4} {a:4,b:true}", function () {
                assert.throws(AssertionError, function () {
                    assert.deepEqual({a:4}, {a:4,b:true});
                });
            });

            it("['a'], {0:'a'}", function () { assert.deepEqual(['a'], {0:'a'}); });
            it("{b:1,a:4} {a:4,b:1}", function () { assert.deepEqual({b:1,a:4}, {a:4,b:1}); });

            it('arrays with non-numeric properties', function () {
                var a1 = [1,2,3];
                var a2 = [1,2,3];
                a1.a = "test";
                a1.b = true;
                a2.b = true;
                a2.a = "test";
                assert.throws(AssertionError, function () {
                    assert.deepEqual(Object.keys(a1), Object.keys(a2));
                });
                assert.deepEqual(a1, a2);
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

                assert.deepEqual(nb1, nb2);

                nameBuilder2.prototype = Object;
                nb2 = new nameBuilder2('Ryan','Dahl');

                assert.throws(AssertionError, function () {
                    assert.deepEqual(nb1, nb2);
                });
            });

            it("'a' {}", function () {
                assert.throws(AssertionError, function () {
                    assert.deepEqual('a', {});
                });
            });

            it("'' ''", function () { assert.deepEqual('', ''); });
            it("'' ['']", function () { assert.deepEqual('', ['']); });
            it("[''] ['']", function () { assert.deepEqual([''], ['']); });
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
                assert.throws(AssertionError, function () {
                    assert.throws(Error, function () {});
                });
                assert.throws(AssertionError, function () {
                    assert.throws(function () {});
                });
            });
        });

        describe(".match", function () {
            it("must pass", function () {
                assert.match(/.+/, 'contents');
                assert.match(".+", 'contents');
            });

            it("must fail", function () {
                assert.throws(AssertionError, function () { assert.match(/.+/, ''); });
                assert.throws(AssertionError, function () { assert.match(".+", ''); });
            });
        });

        describe(".is", function () {
            it("must be of literal", function () {
                assert.is(null, null);
                assert.is(undefined, undefined);
                assert.is(false, false);
                assert.is(true, true);
                assert.is(NaN, NaN);
            });

            it("must be of type", function () {
                assert.is('number', 123.45);
                assert.is('string', "this is a string");
                assert.is('object', obj);
                assert.is('array',  ary);
            });

            it("must be of instance", function () {
                assert.is(Object, {});
                assert.is(Array,  ary);
                assert.is(AssertionError, new AssertionError("with a message"));
            });

            it("must fail", function () {
                assert.throws(AssertionError, function () { assert.is(null, undefined); });
                assert.throws(AssertionError, function () { assert.is(undefined, null); });
                assert.throws(AssertionError, function () { assert.is(false, true); });
                assert.throws(AssertionError, function () { assert.is(NaN, 1); });
                assert.throws(AssertionError, function () { assert.is('number', "this is a string"); });
                assert.throws(AssertionError, function () { assert.is('array',  obj); });
                assert.throws(AssertionError, function () { assert.is(Array, obj); });
                assert.throws(AssertionError, function () { assert.is(AssertionError, obj); });
            });
        });
    });

    describe(".refute", function () {
        describe(".ok", function () {
            it("false", function () { refute.ok(false); });
        });

        describe(".equal", function () {
            it("true false", function () { refute.equal(true, false); });
            it("true true",  function () { assert.throws(AssertionError, function () { refute.equal(true, true); }); });
        });

        describe(".same", function () {
            it("2 '2'", function () { refute.same(2, '2'); });
        });

        describe(".deepEqual", function () {
            it("2 '3'", function () { refute.deepEqual(2, '3'); });
            it("{a:1,b:{c:2}} {a:1,b:{c:3}}", function () { refute.deepEqual({a:1,b:{c:2}}, {a:1,b:{c:3}}); });
        });

        describe(".match", function () {
            it("must pass", function () {
                refute.match(/.+/, '');
                refute.match(".+", '');
            });

            it("must fail", function () {
                assert.throws(AssertionError, function () { refute.match(/.+/, 'contents'); });
                assert.throws(AssertionError, function () { refute.match(".+", 'contents'); });
            });
        });

        describe(".is", function () {
            it("won't be of literal", function () {
                refute.is(undefined, null);
                refute.is(null, undefined);
                refute.is(false, true);
                refute.is(NaN, 0);
            });

            it("won't be of type", function () {
                refute.is('number', "this is a string");
                refute.is('string', 123.34);
                refute.is('array',  obj);
            });

            it("won't be of instance", function () {
                refute.is(Array, obj);
                refute.is(AssertionError, []);
            });

            it("must fail", function () {
                assert.throws(AssertionError, function () { refute.is(undefined, undefined); });
                assert.throws(AssertionError, function () { refute.is(null, null); });
                assert.throws(AssertionError, function () { refute.is(false, false); });
                assert.throws(AssertionError, function () { refute.is(true, true); });
                assert.throws(AssertionError, function () { refute.is(NaN, NaN); });
                assert.throws(AssertionError, function () { refute.is('string', ""); });
                assert.throws(AssertionError, function () { refute.is('array', []); });
                assert.throws(AssertionError, function () { refute.is(Array, []); });
                assert.throws(AssertionError, function () { refute.is(AssertionError, new AssertionError("message")); });
            });
        });
    });
});
