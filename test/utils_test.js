describe("utils", function () {
    var assert = require('../lib/minitest').assert;
    var utils  = require('../lib/minitest/utils');

    describe(".type", function () {
        it("must detect null", function () {
            assert.equal('null', utils.type(null));
        });

        it("must detect undefined", function () {
            assert.equal('undefined', utils.type(undefined));
        });

        it("must detect boolean", function () {
            assert.equal('boolean', utils.type(true));
            assert.equal('boolean', utils.type(false));
        });

        it("must detect number primitive", function () {
            assert.equal('number', utils.type(1));
            assert.equal('number', utils.type(123.45));
            assert.equal('number', utils.type(new Number(1)));
            assert.equal('number', utils.type(new Number(1.2)));
        });

        it("must detect string primitive", function () {
            assert.equal('string', utils.type(""));
            assert.equal('string', utils.type(new String("")));
        });

        it("must detect regexp", function () {
            assert.equal('regexp', utils.type(/.+/));
            assert.equal('regexp', utils.type(new RegExp(/^\s*$/)));
        });

        it("must detect array", function () {
            assert.equal('array', utils.type([]));
            assert.equal('array', utils.type(new Array(0)));
            assert.equal('array', utils.type(Array.prototype));
        });

        it("must detect object", function () {
            assert.equal('object', utils.type({}));
        });

        it("must detect error object", function () {
            assert.equal('error', utils.type(new Error("msg")));
            assert.equal('error', utils.type(new TypeError("msg")));
            assert.equal('error', utils.type(new RangeError("msg")));
        });

        it("must detect custom error object", function () {
            var CustomError = function CustomError(message) {
                Error.apply(this, arguments);
            };
            CustomError.prototype = Object.create(Error.prototype);
            CustomError.prototype.constructor = CustomError;

            var err = new CustomError("msg");
            assert.equal('error', utils.type(err));
            assert.match('CustomError|[object Error]', String(err)); // older IEs always return [object Error]
        });

        it("must detect function", function () {
            assert.equal('function', utils.type(function () {}));
            assert.equal('function', utils.type(Object));
        });
    });

    describe(".inspect", function () {
        if (String(arguments) === '[object Arguments]') {
            it("must inspect function arguments as array", function () {
                (function () {
                    assert.equal("[1, 2, 3]", utils.inspect(arguments));
                }(1, 2, 3));
            });
        }

        it("won't inspect objects recursively", function () {
            var A = function (b) { this.b = b; };
            var B = function () { this.a = new A(this); };
            assert.equal("{a: {b: ...}}", utils.inspect(new B()));
        });
    });

    describe(".interpolate", function () {
        it("must interpolate one key", function () {
            assert.equal("'interpolated' string",
                utils.interpolate("%{key} string", { key: "interpolated" }));
        });

        it("must interpolate many keys", function () {
            assert.equal("true expected to === false",
                utils.interpolate("%{exp} expected to === %{act}", { exp: true, act: false }));
        });

        it("must interpolate many times", function () {
            assert.equal("'a' 'b' 'a' 'a'",
                utils.interpolate("%{a} %{b} %{a} %{a}", { a: "a", b: "b" }));
        });
    });
});
