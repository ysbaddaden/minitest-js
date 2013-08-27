describe("interpolate", function () {
    // FIXME: the assertions module isn't exposed to the browser yet.
    if (typeof require === 'undefined') return;

    var interpolate = require('../lib/minitest/assertions').interpolate;
    var assert = require('../lib/minitest').assert;

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
