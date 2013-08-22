unit.module("unit");

unit.test("async", function (_, done) {
    setTimeout(function () {
        assert.ok(true);
    }, 1000);
    done();
});
