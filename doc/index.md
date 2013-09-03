---
title: minitest.js — Documentation
layout: application
---

# Documentation


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

### Browser

Grab a copy of the built
[minitest.js](https://raw.github.com/ysbaddaden/minitest-js/master/minitest.js)
alongside with [es5-shim](https://raw.github.com/kriskowal/es5-shim/master/es5-shim.js)
and [es5-sham](https://raw.github.com/kriskowal/es5-shim/master/es5-sham.js)
then prepare your HTML test suite. For example, using mocha:

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

