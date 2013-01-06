unit.module("unit");

unit.async("unit.async", function () {
    setTimeout(function () {
        assert.ok(true);
    }, 1000);
    unit.complete();
});
