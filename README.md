# minitest.js

A port of Ruby's [minitest](https://github.com/seattlerb/minitest) assertions to
JavaScript, ready to be consumed with [mocha](http://visionmedia.github.io/mocha)
(or another runner).

Since mocha provides the necessary framework to run tests, this port of minitest
focuses on the assertions part, which are first class citizens, then on
everything that's built on those assertions (expectations) or related to them
(eg: mocks, stubs).

Overall, the assertions are a direct port of their ruby counterparts, but
modified to be compatible with javascript language bugs/features, and thus
conforms to the [CommonJS Unit Testing/1.0](http://wiki.commonjs.org/wiki/Unit_Testing/1.0)
test suite.


## Browser support

Minitest.js can be used from both Node.js and the browser. Any recent browser
that correctly supports ECMAScript 5 (ES5) should be fully supported —ie.
Internet Explorer 9+, Firefox 4+, Safari 5.1+, etc.
Partial support can be enabled in olders browsers thanks to the
[es5-shim](https://github.com/kriskowal/es5-shim) & es5-sham polyfills, but it
won't enable the `actual.mustEqual(expected)` notation for example.

Bottom line: **if you stick to assertions, expect and mocks, any browser
should be compatible** (from Internet Explorer 6+). **To use matchers you need a
modern engine** (from Internet Explorer 9+, Firefox 4+, etc).

## Differences with CommonJS' Unit_Testing/1.0

Minitest.js is compatible with the
[CommonJS Unit Testing/1.0](http://wiki.commonjs.org/wiki/Unit_Testing/1.0)
spec, but there are some differences since we follow minitest conventions.

The parameters have been flipped: use `assert.equal(expected, actual)`
instead of `assert.equal(actual, expected)`.

Use refutations instead of assert not, so `refute.equal()` replaces
`assert.notEqual()` for instance.

The `assert.equal` and `refute.equal` assertions have been removed, because the
`==` operator is unreliable, at best. Since `deepEqual` does a better job to fix
its shortcomings, we renamed `assert.deepEqual` and `assert.notDeepEqual` to be
the actual `assert.equal` and `refute.equal`.

`assert.strictEqual` and its refutation have been renamed to `assert.same` (and
`refute.same`).

Last but no least, `assert` is itself an assertion, and `assert.ok` is just an
alias for it. The same goes for `refute` and `refute.ok`.


## Usage

### Node.js

<!--
First install minitest:

    $ npm install minitest

Then write your tests, using mocha for instance:
-->

Using mocha for example:

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

Grab a copy of the built [minitest.js](https://raw.github.com/ysbaddaden/minitest-js/master/minitest.js)
alongside with [es5-shim](https://raw.github.com/kriskowal/es5-shim/master/es5-shim.js)
and [es5-sham](https://raw.github.com/kriskowal/es5-shim/master/es5-sham.js)
then prepare your HTML test suite. For example, using mocha again:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Mocha Tests</title>
  <link rel="stylesheet" href="test/support/mocha.css" />
</head>
<body>
  <div id="mocha"></div>

  <script src="test/support/es5-shim.min.js"></script>
  <script src="test/support/es5-sham.min.js"></script>
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


## Assertions

Assertions and refutations are first class citizen in minitest.js. They are the
actual basis of everything else, and should be favorited over expectations.
Unless you really can't live outside of Specs (I can't survive outside of Test
Unit myself).

Of course, assertions are compatible with all browsers, and have been verified
to work with Internet Explorer 6+, which make assert/refute the *de facto*
solution for testing cross browser javascript.

### assert

  - `assert(test[, message])`
  - `assert.ok(test[, message])`

Succeeds if test value is truthy.

  - `assert.block(callback[, message])`

Succeeds if callback returns a truthy value.

  - `assert.same(expected, actual[, message])`

Succeeds if actual === expected.

  - `assert.equal(expected, actual[, message])`

Succeeds if actual *equals* expected. Please not that this doesn't rely on the
`==` operator but on the deepEqual method from CommonJS Unit_testing/1.0, which
allows to compare arrays, objects, etc. For example:

```javascript
assert.equal(1, '1');

var ary = [1, 2, 3];
assert.equal([1, 2, 3], ary);

var obj = { a: 1, b: { c: 2 } };
assert.equal({ a: 1, b: { c: 2 } }, obj);
```

  - `assert.inDelta(expected, actual, delta = 0.001[, message])`

For comparing floats, succeeds if actual is within delta of expected. For
example:

```javascript
assert.inDelta(1.0, 0.999, 0.001);
```

  - `assert.inEpsilon(expected, actual, delta = 0.001[, message])`

For comparing floats, succeeds if actual is within relative error (epsilon) of
expected.

  - `assert.empty(test[, message])`

Succeeds if test is empty (eg: empty string, array or object). Also succeeds if
test is null or undefined.

  - `assert.includes(collection, obj[, message])`

Succeeds if collection contains obj. For example:

```javascript
assert.includes([1, 2], 1);
```

  - `assert.match(pattern, actual[, message])`

Succeeds if actual matches the pattern regular expression. For example:

```javascript
var BLANK = /^\s*$/;
assert.match(BLANK, "  ");
```

  - `assert.typeOf(expected, actual[, message])`

Succeeds if typeof actual == expected. It also conveniently supports an `'array'`
type that isn't supported natively, and takes care to correctly compare Number
and String object instances with their primitive counterparts.

  - `assert.instanceOf(expected, actual[, message])`

Succeeds if actual is an instance of expected. For example:

```javascript
assert.instanceOf(Array, []);
assert.instanceOf(Object, {});
```

  - `assert.throws([error,] callback[, message])`

Succeeds if callback throws an exception of type error then returns the
exception. If no error type is specified, then all expections are catched.
Example:

```javascript
var e = assert.throws(Error, function () {
    throw new Error("oops");
});
assert.equal("oops", e.message);
```

Please note that `assert.throws` as no refutation counterparts.


### refute

Refutations are the must fail counterpart of assertions (ie. assert not). Most
assert have their refute version.

  - `refute(test[, message])`
  - `refute.ok(test[, message])`

Succeeds if test is falsy

  - `refute.same(expected, actual[, message])`

Succeeds if actual !== expected.

  - `refute.equal(expected, actual[, message])`

Succeeds unless actual *equals* expected.

  - `assert.inDelta(expected, actual, delta = 0.001[, message])`

For comparing floats, succeeds if actual is outside delta of expected

  - `assert.inEpsilon(expected, actual, delta = 0.001[, message])`

For comparing floats, succeeds if actual is outside relative error epsilon of expected

  - `refute.empty(test[, message])`

Succeeds unless test is empty (null, undefined, empty string, array or object)

  - `refute.includes(collection, obj[, message])`

Succeeds unless collection contains obj. For example:

  - `refute.match(pattern, actual[, message])`

Succeeds unless actual matches the RegExp pattern

  - `refute.typeOf(expected, actual[, message])`

Succeeds unless typeof actual == expected (supports 'array')

  - `refute.instanceOf(expected, actual[, message])`

Succeeds unless actual instanceof expected

Please see the [assertions test
suite](https://github.com/ysbaddaden/minitest-js/blob/master/test/assertions_test.js)
for more examples.


## Expectations

Expectations come in two forms: matchers and expect. While matchers will feel
like home to ruby's minitest/spec users, the expect notation should be favorited
when legacy browsers must be supported.

### Matchers

Matchers extend `Object.prototype` with non enumerable methods (thanks to
Object.defineProperty). Sadly only modern engines do support it correctly
(eg: Node.js, Internet Explorer 9+, Firefox 4+, etc).

That being said, if you only target Node.js and/or modern browsers, just use it!

  - `actual.mustEqual(expected)`  — `assert.equal`
  - `actual.wontEqual(expected)`  — `refute.equal`
  - `test.mustBeEmpty()`          — `assert.empty`
  - `test.wontBeEmpty()`          — `refute.empty`
  - `actual.mustBeCloseTo(expected, delta = 0.001)`      — `assert.inDelta`
  - `actual.wontBeCloseTo(expected, delta = 0.001)`      — `refute.inDelta`
  - `actual.mustBeWithinDelta(expected, delta = 0.001)`  — `assert.inDelta`
  - `actual.wontBeWithinDelta(expected, delta = 0.001)`  — `refute.inDelta`
  - `actual.mustBeWithinEpsilon(expected, epsilon = 0.001)`  — `assert.inEpsilon`
  - `actual.wontBeWithinEpsilon(expected, epsilon = 0.001)`  — `refute.inEpsilon`
  - `collection.mustInclude(obj)`  — `assert.includes`
  - `collection.wontInclude(obj)`  — `refute.includes`
  - `actual.mustBeInstanceOf(expected)`  — `assert.instanceOf`
  - `actual.wontBeInstanceOf(expected)`  — `refute.instanceOf`
  - `actual.mustBeTypeOf(expected)`  — `assert.typeOf`
  - `actual.wontBeTypeOf(expected)`  — `refute.typeOf`
  - `actual.mustMatch(expected)`  — `assert.match`
  - `actual.wontMatch(expected)`  — `refute.match`
  - `actual.mustBeSameAs(expected)`  — `assert.same`
  - `actual.wontBeSameAs(expected)`  — `refute.same`
  - `actual.mustThrow(expected)`  — `assert.throws`

NOTE: You may set the `MT_FORCE_LEGACY` variable to true to enable support of
older browsers, but that will directly add methods to `Object.prototype` which
is going to be a big problem with for in loops for example —ie. expect
libraries to fail, badly.


```javascript
require('minitest/spec');

"content".mustEqual("content");
[1, 2, 3].wontEqual([1, 2, 3]);
```

### Expect

The expect notation, despite being less fun to use than matchers is a solid
choice when it comes to compatibility: all engines and browsers supported by
the assertions should be supported —ie. BDD down to Internet Explorer 6+.
The downside is that is goes back to using the `to` and `toNot` prefixes,
instead of the great `must` and `wont`...

  - `expect(actual).toEqual(expected)`     — `assert.equal`
  - `expect(actual).toNotEqual(expected)`  — `refute.equal`
  - `expect(test).toBeEmpty()`     — `assert.empty`
  - `expect(test).toNotBeEmpty()`  — `refute.empty`
  - `expect(actual).toBeCloseTo(expected, delta = 0.001)`         — `assert.inDelta`
  - `expect(actual).toNotBeCloseTo(expected, delta = 0.001)`      — `refute.inDelta`
  - `expect(actual).toBeWithinDelta(expected, delta = 0.001)`     — `assert.inDelta`
  - `expect(actual).toNotBeWithinDelta(expected, delta = 0.001)`  — `refute.inDelta`
  - `expect(actual).toBeWithinEpsilon(expected, epsilon = 0.001)`     — `assert.inEpsilon`
  - `expect(actual).toNotBeWithinEpsilon(expected, epsilon) = 0.001`  — `refute.inEpsilon`
  - `expect(collection).toInclude(obj)`     — `assert.includes`
  - `expect(collection).toNotInclude(obj)`  — `refute.includes`
  - `expect(actual).toBeInstanceOf(expected)`     — `assert.instanceOf`
  - `expect(actual).toNotBeInstanceOf(expected)`  — `refute.instanceOf`
  - `expect(actual).toBeTypeOf(expected)`     — `assert.typeOf`
  - `expect(actual).toNotBeTypeOf(expected)`  — `refute.typeOf`
  - `expect(actual).toMatch(expected)`     — `assert.match`
  - `expect(actual).toNotMatch(expected)`  — `refute.match`
  - `expect(actual).toBeSameAs(expected)`     — `assert.same`
  - `expect(actual).toNotBeSameAs(expected)`  — `refute.same`
  - `expect(actual).toThrow(expected)`  — `assert.throws`


```javascript
var expect = require('minitest').expect;

expect("str").toEqual("str");
expect([1, 2, 3]).toNotBeEmpty(true);
```


## Mock

You may mock an object entirely, and verify that expected methods have been
called:

```javascript
var Mock = require('minitest/mock');
var assert = require('minitest').assert;

var computer = new Mock();
computer.expect('meaning_of_life', 42);

assert.equal(42, computer.meaning_of_life());
assert(computer.verify());
```

Please see the [mock test
suite](https://github.com/ysbaddaden/minitest-js/blob/master/test/mock_test.js)
for more examples.


## Stub

You may stub a method of any objet for the duration of a callback:

```javascript
var stub = require('minitest/stub');
var assert = require('minitest').assert;

stub(Date, 'now', 0, function () {
    assert.equal(0, Date.now());
});
refute.equal(0, Date.now());
```

On modern browsers (IE 9+ and FF 4+), Object's prototype is infected with the
non enumerable `stub` method, so you can:

```javascript
require('minitest/stub');

var earth = new Computer();
earth.stub('meaning_of_life', 42, function () {
    assert.equal(42, earth.meaning_of_life());
});
```

Please see the [stub test
suite](https://github.com/ysbaddaden/minitest-js/blob/master/test/stub_test.js)
for more examples.


## License

minitest.js is distributed under the MIT license. Please see
[LICENSE](https://github.com/ysbaddaden/minitest-js/blob/master/LICENSE).

## Author

minitest Copyright © Ryan Davis, seattle.rb<br/>
minitest.js Copyright © Julien Portalier

