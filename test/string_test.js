describe("utils", function () {
    // FIXME: the minitest/utils module isn't exposed to the browser yet.
    if (typeof require === 'undefined') return;
    var assert = require('../lib/minitest').assert;

    describe("interpolate", function () {
        var interpolate = require('../lib/minitest/utils').interpolate;

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
