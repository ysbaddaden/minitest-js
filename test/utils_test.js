describe("utils", function () {
    var assert = require('../lib/minitest').assert;
    var utils  = require('../lib/minitest/utils');

    describe(".inspect", function () {
        it("must inspect function arguments as array", function () {
            (function () {
                assert.equal("[1, 2, 3]", utils.inspect(arguments));
            }(1, 2, 3));
        });

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
