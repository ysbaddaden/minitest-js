# minitest.js

A port of Ruby's [minitest](https://github.com/seattlerb/minitest) assertions to
JavaScript, ready to be used with [mocha](http://visionmedia.github.io/mocha).

Since mocha provides the necessary framework to run tests, there was no reason
to use anything else. This port of minitest thus focuses on the assertions part
and everything related to them: expectations, mocks and stubs.

Overall, the assertions are direct port of their ruby counterparts, but there
are of course some differences because JavaScript is quite a peculiar language,
especially when it comes to compare primitives with their Object counterparts.
Oddly enough, that happens all the times when testing, especially with
expectations.

## Browser support

Minitest.js can be used from both Node.js and the browser. Any recent browser
that supports ECMAScript 5 (ES5) should be fully supported, and most features
(except for stub and matchers) should be compatible with any legacy browser.

It has been successfully tested with IE6+ for example, and should be fully
compatible with IE 10+, Firefox 4+ and Safari 5.1+. If you stick to assertions
and mocks, any browser should be compatible (from IE6+).

## Documentation

## Differences with CommonJS' Unit_Testing/1.0

Minitest.js is compatible with the
[CommonJS Unit Testing/1.0](http://wiki.commonjs.org/wiki/Unit_Testing/1.0)
spec, but there are some differences: the expected and actual parameters have
been flipped: expected, actual instead or actual, expected.

Some assertions have been renamed:

  - `assert.equal`           — *removed* (`==` is unreliable and deepEqual is better)
  - `assert.notEqual`        — *removed*
  - `assert.deepEqual`       — renamed as `assert.equal`
  - `assert.notDeepEqual`    — renamed as `refute.equal`
  - `assert.strictEqual`     — renamed as `assert.same`
  - `assert.notStrictEqual`  — renamed as `refute.same`

Also, `assert` is itself an assertion, and thus `assert.ok` is just an alias for
it. The same goes for `refute` and `refute.ok`.

### Assertions

  - assert(test[, message])                              — succeeds if test is truthy
  - assert.ok(test[, message])                           — alias for assert()
  - assert.block(callback[, message])                    — succeeds if callback returns a truthy value
  - assert.same(expected, actual[, message])             — succeeds if actual === expected
  - assert.equal(expected, actual[, message])            — succeeds if actual deeply equals expected
  - assert.inDelta(expected, actual, delta[, message])   — for comparing floats, succeeds if actual is within delta of expected
  - assert.inEpsilon(expected, actual, delta[, message]) — for comparing floats, succeeds if actual is within relative error epsilon of expected
  - assert.empty(test[, message])                        — succeeds if test is empty (null, undefined, empty string, array or object)
  - assert.match(pattern, actual[, message])             — succeeds if actual matches the RegExp pattern
  - assert.typeOf(expected, actual[, message])           — succeeds if typeof actual == expected (supports 'array')
  - assert.instanceOf(expected, actual[, message])       — succeeds if actual instanceof expected
  - assert.throws([error,] callback[, message])          — succeeds if callback throws an error (optionally of error type)

  - refute(test[, message])                              — succeeds if test is falsy
  - refute.ok(test[, message])                           — alias for refute()
  - refute.same(expected, actual[, message])             — succeeds if actual !== expected
  - refute.equal(expected, actual[, message])            — succeeds unless actual deeply equals expected
  - assert.inDelta(expected, actual, delta[, message])   — for comparing floats, succeeds if actual is outside delta of expected
  - assert.inEpsilon(expected, actual, delta[, message]) — for comparing floats, succeeds if actual is outside relative error epsilon of expected
  - refute.empty(test[, message])                        — succeeds unless test is empty (null, undefined, empty string, array or object)
  - refute.match(pattern, actual[, message])             — succeeds unless actual matches the RegExp pattern
  - refute.typeOf(expected, actual[, message])           — succeeds unless typeof actual == expected (supports 'array')
  - refute.instanceOf(expected, actual[, message])       — succeeds unless actual instanceof expected

Please see the [test
suite](https://github.com/ysbaddaden/minitest.js/blob/master/test/assertions_test.js)
for examples.

<!--
Examples:

```javascript
assert.equal(1, '1');
refute.equal(1, 2);

assert.same(1, 1);
refute.same(1, '1');

var obj = {a:1};
assert.same(obj, obj);
refute.same([1], [1]);

assert.deepEqual([1, 2, 3], [1, 2, 3]);
assert.deepEqual({ a: 1, b: { c: 2 }}, { a: 1, b: { c: 2 }});

assert.throws(AssertionError, function () {
    assert.ok(false);
});

var BLANK = /^\s*$/;
assert.match(BLANK, "");
refute.match(BLANK, "content");

assert.is(null, null);
refute.is(null, undefined);

assert.is('object', {});
assert.is('array', [1, 2]);

var MyObject = function () {};
assert.is('Array', Array);
assert.is('MyObject', new MyObject());
```
-->

### Expectations

Expectations come in two forms: expect and matchers. while matchers will feel
like home to ruby minitest/spec users, expect should be favorited when legacy
browsers must be supported.

#### Expect

```javascript
var expect = require('minitest').expect;

expect("str").toEqual("str");
expect([1, 2, 3]).toNotBeEmpty(true);
```

#### Matchers

```javascript
require('minitest/spec');

"content".mustEqual("content");
[1, 2, 3].wontEqual([1, 2, 3]);
```

### Mock

```javascript
var Mock   = require('minitest/mock');
var assert = require('minitest').assert;

describe("computer", function () {
    var computer;

    beforeEach(function () {
        computer = new Mock().expect('meaning_of_life', 42);
    });

    it("must reply to the question", function () {
        assert.equal(42, computer.meaning_of_life());
        assert(computer.verify());
    });
});
```

### Stub

You may stub a method of any objet for the duration of a callback:

```javascript
var stub   = require('minitest/stub');
var assert = require('minitest').assert;

stub(Date, 'now', 0, function () {
    assert.equal(0, Date.now());
});
refute.equal(0, Date.now());
```

On modern browsers (IE 10+ and FF 4+), Object's prototype is infected with the
non enumerable `stub` method, so you can:

```javascript
require('minitest/stub');

var earth = new Computer();
earth.stub('meaning_of_life', 42, function () {
    assert.equal(42, earth.meaning_of_life());
});
```

## Usage

### Node.js

```javascript
var assert = require('minitest').assert;
var refute = require('minitest').refute;

describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });
  });
});
```

### Browsers

```html
<html>
<head>
  <meta charset="utf-8">
  <title>Mocha Tests</title>
  <link rel="stylesheet" href="mocha.css" />
</head>
<body>
  <div id="mocha"></div>

  <script src="https://raw.github.com/kriskowal/es5-shim/master/es5-shim.min.js"></script>
  <script src="test/support/minitest.js"></script>
  <script src="test/support/mocha.js"></script>

  <script>
    var assert = minitest.assert;
    var refute = minitest.refute;
    mocha.setup('bdd');
  </script>

  <script src="test/array_test.js"></script>
  <script src="test/object_test.js"></script>
  <script src="test/xhr_test.js"></script>

  <script>
    mocha.checkLeaks();
    mocha.globals(['minitest']);
    mocha.run();
  </script>
</body>
</html>
```

## Author

minitest Copyright © Ryan Davis, seattle.rb<br>
minitest.js Copyright © Julien Portalier

