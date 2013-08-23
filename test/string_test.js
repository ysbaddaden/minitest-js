if (typeof minitest === 'undefined') {
    var minitest = require('../lib/minitest');
    var assert = minitest.assert;
    var interpolate = minitest.interpolate;
}

describe("String", function () {
    describe("#interpolate", function () {
        it("must interpolate one key", function () {
            assert.equal("'interpolated' string",
                interpolate("%{key} string", { key: "interpolated" }));
        });

        it("must interpolate many keys", function () {
            assert.equal("true expected to === false",
                interpolate("%{exp} expected to === %{act}", { exp: true, act: false }));
        });

        it("must interpolate many times", function () {
            assert.equal("'a' 'b' 'a' 'a'",
                interpolate("%{a} %{b} %{a} %{a}", { a: "a", b: "b" }));
        });
    });
});
