---
title: minitest.js — Documentation
layout: application
---

# Promised

Minitest offers a transparent support for promises by testing the resolved value
of a promise instead of the promise. This should prove useful when used in
combination with Webdriver (and Protractor) for instance.

This can be disabled by setting the `MT_RESOLVE_PROMISES` global variable to
false when needed. For instance when testing a promises library.

## Usage

### Node.js

Be sure to require `minitest/promised` before accessing assert and refute,
otherwise you will get non-promised aware assertions. For example:

```javascript
require('minitest/promised');
var assert = require('minitest').assert;
var refute = require('minitest').refute;
```

### Browser

Just load `minitest-promised.js` immediately after `minitest.js` and before
loading any other extension like [Spec](spec.html) and [Spy](mock.html). Then you
may create shortcuts as usual. For example:

```html
<script src="minitest.js"></script>
<script src="minitest-promised.js"></script>
<script>
var assert = minitest.assert;
var refute = minitest.refute;
var expect = minitest.expect;
</script>
```

## API

Once loaded, assertions and expectations will continue to work exactly as
before, with the difference that if a promise is passed then the assertion will
only occur when the promise is resolved.

For example using [Q](http://github.com/kriskowal/q/):

```javascript
require('minitest/promised');
var assert = require('minitest').assert;
var expect = require('minitest').expect;

var deferred = Q.defer();

// assertions are attached to the promise
assert.equal(123, deferred.promise);
expect(deferred.promise).toEqual(123);
deferred.promise.mustEqual(123);

// this will execute the assertions
deferred.resolve(123);
```

Another example using [Protractor](http://github.com/angular/protractor) and
[Mocha](http://visionmedia.github.io/mocha/):

```javascript
require('minitest/promised');
var assert = require('minitest').assert;

describe("Angular's Homepage", function () {
    it("has name in title", function () {
        browser.get('http://angularjs.org/');
        assert.match(/AngularJS/, browser.getTitle());
    });
});
```

### minitest.resolver(actual, callback, args, argn)

You can specify your own resolver for your needs. You may want to optimize it
for Protractor for example:

```javascript
var webdriver = require('selenium-webdriver');
var minitest = require('minitest');

minitest.resolver = function (actual, callback, args, argn) {
  if (actual instanceof webdriver.promise.Promise) {
    if (actual instanceof webdriver.WebElement) {
      throw 'expect called with WebElement argment, expected a Promise. ' +
        'Did you mean to use .getText()?';
    }
    return actual.then(function (value) {
      args[argn] = value;
      return callback.apply(null, args);
    });
  } else {
    return callback.apply(null, args);
  }
};
```

### minitest.promiseAnAssertion(name, arg)

Makes an assertion aware of promises:

```javascript
assert.normal = function (expected, actual, message) {};
assert.unique = function (actual, message) {};
assert.reversed = function (actual, message) {};

minitest.promiseAnAssertion('normal');
minitest.promiseAnAssertion('unique', 'unary');
minitest.promiseAnAssertion('reversed', 'reverse');
```

