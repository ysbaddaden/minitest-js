# testunit.js

A simple assert + refute library for JavaScript that integrates nicely into
[mocha](http://visionmedia.github.io/mocha). Even thought it doesn't uses the
same syntax than CommonJS' [Unit_testing/1.0](http://wiki.commonjs.org/wiki/Unit_Testing/1.0)
testunit.js does comply to its rules, so there should be no surprises.

## Usage

### Assertions

  - assert.ok(guard[, message])                     — succeeds if guard is true
  - assert.equal(expected, actual[, message])       — succeeds if actual == expected
  - assert.same(expected, actual[, message])        — succeeds if actual === expected
  - assert.deepEqual(expected, actual[, message])   — succeeds if actual is deeply == to expected (even deep object properties)
  - assert.throws([error,] callback[, message])     — succeeds if callback throws an error (optionally of error type)
  - assert.match(pattern, actual[, message])        — succeeds if actual matches the RegExp pattern
  - assert.is(expected, actual[, message])          — succeeds if actual is of expected type (literal, typeof or instanceof)

  - refute.ok(guard[, message])                     — succeeds if guard is false
  - refute.equal(expected, actual[, message])       — succeeds if actual != expected
  - refute.same(expected, actual[, message])        — succeeds if actual !== expected
  - refute.deepEqual(expected, actual[, message])   — succeeds if actual is deeply != to expected (even deep object properties)
  - refute.match(pattern, actual[, message])        — succeeds unless actual matches the RegExp pattern
  - refute.is(expected, actual[, message])          — succeeds unless actual is of expected type (literal, typeof or instanceof)

### Node:

```javascript
var assert = require('./testunit').assert;
var refute = require('./testunit').refute;

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

  <script src="testunit.js"></script>
  <script src="mocha.js"></script>

  <script>
    var assert = testunit.assert;
    var refute = testunit.refute;
    mocha.setup('bdd');
  </script>

  <script src="test.array.js"></script>
  <script src="test.object.js"></script>
  <script src="test.xhr.js"></script>

  <script>
    mocha.checkLeaks();
    mocha.globals(['testunit']);
    mocha.run();
  </script>
</body>
</html>
```

## Author

Copyright 2013 Julien Portalier
