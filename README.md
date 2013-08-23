# minitest.js

A port of Ruby's MiniTest assertions to JavaScript, ready to be used with
[mocha](http://visionmedia.github.io/mocha).

Only the assertions have been ported, since mocha already provides the necessary
framework to run tests, but lacked a good

minitest.js obviously follows the minitest API as much as possible, yet conforms
to the CommonJS' [Unit_testing/1.0](http://wiki.commonjs.org/wiki/Unit_Testing/1.0)
draft spec (eg. asserting equality).

## Usage

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
suite](https://github.com/ysbaddaden/minitest.js/blob/master/test/assert_test.js)
for examples.

Examples:

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

### Node:

```javascript
var assert = require('./minitest').assert;
var refute = require('./minitest').refute;

describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    })
  })
})
```

### Browser:

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
  <script src="minitest.js"></script>
  <script src="mocha.js"></script>

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

