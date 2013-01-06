unit.module("Assertions");

unit.test("assert.ok", function () {
    assert.ok(true);
});

unit.test("assert.equal", function () {
    assert.equal(1, 1);
    assert.equal(1238, '1238');
});

unit.test("assert.notEqual", function () {
    assert.notEqual(1, 2);
    assert.notEqual(NaN, 2);
});

unit.test("assert.same", function () {
    assert.same(1, 1);
    assert.same('lorem ipsum', 'lorem ipsum');
});

unit.test("assert.notSame", function () {
    assert.notSame(1, '1');
    assert.notSame('lorem ipsum', 'Lorem ipsum');
});
