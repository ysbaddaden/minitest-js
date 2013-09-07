---
title: minitest.js — Documentation
layout: application
---

# Unit

Assertions and refutations are the basis of everything else in minitest.js
(like expectations).

Since they are virtually compatible with all and every browser and javascript
engine available (starting from Internet Explorer 6+), they should be favorited
over expectations, unless you really can't live outside of Specs, or are sure
that you'll never have to target Internet Explorer 8, for instance.


## Usage

### Node.js

```javascript
var assert = require('minitest').assert;
var refute = require('minitest').refute;
```

### Browser

Once the HTML file is setup, you can create global shortcuts, like so:

```html
<script>
var assert = minitest.assert;
var refute = minitest.refute;
</script>
```

## API

### assert(test, [message])

Succeeds if test value is truthy.

```javascript
assert(true);
assert("ok", "everything should be ok");
```

This method is also aliased as `assert.ok()` for compatibility with CommonJS.


### refute(test, [message])

Succeeds if test value is falsy.

```javascript
refute(false);
refute(isBroken(), "should not be broken");
```

This method is also aliased as `refute.ok()`.


### assert.empty(test, [message])

Succeeds if test is empty (eg: empty string, array or object). Also succeeds if
test is null or undefined.

```javascript
assert.empty(null);
assert.empty("");
assert.empty([]);
```

### refute.empty(test, [message])

Succeeds if test isn't empty (eg: empty string, array or object). Also succeeds
if test isn't null or undefined.

```javascript
refute.empty("html");
refute.empty([1, 2, 3]);
refute.empty({a: 1});
```

### assert.includes(collection, obj, [message])

Succeeds if collection includes obj.

```javascript
assert.includes([1, 2, 3], 1);
assert.includes("hello world", "world");
```

### refute.includes(collection, obj, [message])

Succeeds unless collection includes obj.

```javascript
refute.includes([1, 2, 3], 4);
```

### assert.equal(expected, actual, [message])

Succeeds if actual *equals* expected; but instead of relying on the (unreliable)
`==` operator, it conforms to the deep equality definition of CommonJS Unit
Testing/1.0. So Dates, arrays, objects, NaNs can be safely compared and found
equal to each others.

```javascript
assert.equal(1, '1');
assert.equal({colors: ['red', 'green']}, {colors: ['red', 'green']});
```

### refute.equal(expected, actual, [message])

Succeeds unless actual *equals* expected. Again, it doesn't use the `==`
operator, but the CommonJS Unit Testing/1.0 definition of deep equality.

```javascript
refute.equal(1, 2);
refute.equal({colors: ['red', 'green']}, {colors: ['blue', 'green']});
```

### assert.same(expected, actual, [message])

Succeeds if actual `===` expected.

```javascript
var obj = {a: 1};
assert.same(obj, obj);
assert.same(1, 1);
```

### refute.same(expected, actual, [message])

Succeeds unless actual `===` expected.

```javascript
refute.same({a: 1}, {a: 1});
refute.same(1, 2);
```

### assert.inDelta(expected, actual, delta = 0.001, [message])

For comparing floats, succeeds if actual is within delta of expected.

```javascript
assert.inDelta(1.0, 0.999, 0.001);
```

### refute.inDelta(expected, actual, delta = 0.001, [message])

For comparing floats, succeeds if actual is outside delta of expected.

```javascript
refute.inDelta(1.0, 0.997, 0.001);
```

### assert.inEpsilon(expected, actual, delta = 0.001, [message])

For comparing floats, succeeds if actual is within relative error (epsilon) of
expected.

```javascript
assert.inEpsilon(10000, 9991, 0.001);
assert.inEpsilon(9999.1, 10000, 0.0001);
```

### refute.inEpsilon(expected, actual, delta = 0.001, [message])

For comparing floats, succeeds if actual is outside relative error (epsilon) of
expected.

```javascript
refute.inEpsilon(10000, 9990 - 1);
```

### assert.match(pattern, actual, [message])

Succeeds if actual matches the pattern regular expression. For example:

```javascript
var BLANK = /^\s*$/;
assert.match(BLANK, "  ");
```

### refute.match(pattern, actual, [message])

Succeeds unless actual matches the pattern regular expression. For example:

```javascript
var BLANK = /^\s*$/;
refute.match(BLANK, "content");
```

### assert.typeOf(expected, actual, [message])

Succeeds if typeof actual == expected. It also conveniently supports an `'array'`
type that isn't supported natively, and takes care to correctly compare Number
and String object instances with their primitive counterparts.

```javascript
assert.typeOf('array', []);
assert.typeOf('object', {});
assert.typeOf('string', new String("str"));
```

### refute.typeOf(expected, actual, [message])

Succeeds unless typeof actual == expected. Again, it conveniently supports an
`'array'` type that isn't supported natively, and takes care to correctly
compare Number and String object instances with their primitive counterparts.

```javascript
refute.typeOf('array', []);
refute.typeOf('object', String());
```

### assert.instanceOf(expected, actual, [message])

Succeeds if actual is an instance of expected.

```javascript
assert.instanceOf(Array, []);
assert.instanceOf(Object, {});
```

### refute.instanceOf(expected, actual, [message])

Succeeds unless actual is an instance of expected.

```javascript
refute.instanceOf(Array, "");
refute.instanceOf(Object, 123);
```

### assert.respondTo(object, method, [message])

Succeeds if object has a callable property named method.

```javascript
assert.respondTo(Array, 'isArray');
assert.respondTo(Array.prototype, 'forEach');
assert.respondTo("str", 'toUpperCase');
```

### refute.respondTo(object, method, [message])

Succeeds unless object has a callable property named method.

```javascript
refute.respondTo("str", 'upcase');
refute.respondTo(Array.prototype, 'methodName');
```

### assert.throws([error,] callback, [message])

Succeeds if callback throws an exception of type error then returns the
exception. If no error type is specified, then all expections are catched.

```javascript
var exception = assert.throws(Error, function () {
    throw new Error("oops");
});
assert.equal("oops", exception.message);
```

Please note that `assert.throws()` has no refutation counterparts.

