---
title: minitest.js — spec
layout: application
---

# Spec

The must and wont specs of minitest are indeed available, thought they don't
exactly fit into the JavaScript language.

## Limitations

### Not Everything Is An Object

`null`, `undefined`, `true` and `false` are singleton primitives in javascript,
with no objects to back them up, so it's impossible to have `test.mustBeNull()`
for instance. Also tests will break with non helpful messages when a method
starts to return `undefined` or `null` instead of the object it's supposed to.
For example:

```javascript
var rng = range(1, 3);
rng.mustEqual([1, 2, 3]);
```

Would the `range` function start to return `undefined`, the test would break
with "Expected [1, 2, 3] but got nil" in Ruby, but in JavaScript you'll get a
"TypeError: Cannot call method 'mustEqual' of undefined". Not exactly what we'd
expect.

### Browser Support

Another problem is the limited browser support: ECMAScript 5's
`Object.defineProperty()` must be natively supported, which means only modern
browsers like Node.js, Firefox 12+, Safari 5.1+ or Internet Explorer 10+ are
really capable to handle it.

Internet Explorer 9 and Firefox 3.6 are somehow supported by minitest.js but
there is at least one bug that forced us to extend `Number.prototype` for both
and `String.prototype` for Firefox with methods directly in addition of
adding non enumerable properties to `Object.prototype`. It shouldn't be a
problem, but maybe they have other bugs, that we aren't yet aware of, that would
prevent their correct support.

### Expect Fits Better

As a personal opinion, I think `expect()` fits JavaScript better than specs in
you can't live with assertions, especially when you need a large browser
support. The previous example, expressed with expect would look like the
following:

```javascript
var rng = range(1, 3);
expect(rng).toEqual([1, 2, 3]);
```

It's not much different, except for using `to` instead of `must` (thought must
and wont are available as aliases), will break nicely with "Expected [1, 2, 3]
but got undefined", and is compatible with any browser (eg: Internet Explorer
6+).

[Learn more about expect()](expect.html)

## Usage

### Node.js

```javascript
require('minitest/spec');
```

### Browser

There is nothing else needed than loading the built minitest.js file. Specs have
already been defined and are ready to use.


## API

### test.mustBeEmpty([message])

Succeeds if test is empty (eg: empty string, array or object).

```javascript
"".mustBeEmpty();
[].mustBeEmpty();
```

### test.wontBeEmpty([message])

Succeeds if test isn't empty (eg: empty string, array or object).

```javascript
"html".wontBeEmpty();
[1, 2, 3].wontBeEmpty();
({a: 1}).wontBeEmpty();
```

### collection.mustInclude(obj, [message])

Succeeds if collection includes obj.

```javascript
[1, 2, 3].mustInclude(1);
"hello world".mustInclude("world");
```

### collection.wontInclude(obj, [message])

Succeeds unless collection includes obj.

```javascript
[1, 2, 3].wontInclude(4);
```

### actual.mustEqual(expected, [message])

Succeeds if actual *equals* expected; but instead of relying on the (unreliable)
`==` operator, it conforms to the deep equality definition of CommonJS Unit
Testing/1.0. So Dates, arrays, objects, NaNs can be safely compared and found
equal to each others.

```javascript
(1).mustEqual('1');
({colors: ['red', 'green']}).mustEqual({colors: ['red', 'green']});
```

### actual.wontEqual(expected, [message])

Succeeds unless actual *equals* expected. Again, it doesn't use the `==`
operator, but the CommonJS Unit Testing/1.0 definition of deep equality.

```javascript
(1).wontEqual(2);
({colors: ['red', 'green']}).wontEqual({colors: ['blue', 'green']});
```

### actual.mustBeSameAs(expected, [message])

Succeeds if actual `===` expected.

```javascript
var obj = {a: 1};
obj.mustBeSameAs(obj);
(1).mustBeSameAs(1);
```

### actual.wontBeSameAs(expected, [message])

Succeeds unless actual `===` expected.

```javascript
({a: 1}).wontBeSameAs({a: 1});
(1).wontBeSameAs(2);
```

### actual.mustBeWithinDelta(expected, delta = 0.001, [message])

For comparing floats, succeeds if actual is within delta of expected.

```javascript
(0.999).mustBeWithinDelta(1.0, 0.001);
```

This method is also aliased as `.mustBeCloseTo()`.

### actual.wontBeWithinDelta(expected, delta = 0.001, [message])

For comparing floats, succeeds if actual is outside delta of expected.

```javascript
(0.997).mustBeWithinDelta(1.0, 0.001);
```

This method is also aliased as `.wontBeCloseTo()`.

### actual.mustBeWithinEpsilon(expected, delta = 0.001, [message])

For comparing floats, succeeds if actual is within relative error (epsilon) of
expected.

```javascript
(9991).mustBeWithinEpsilon(10000, 0.001);
(10000).mustBeWithinEpsilon(9999.1, 0.0001);
```

### actual.wontBeWithinEpsilon(expected, delta = 0.001, [message])

For comparing floats, succeeds if actual is outside relative error (epsilon) of
expected.

```javascript
(9990 - 1).wontBeWithinEpsilon(10000);
```

### actual.mustMatch(pattern, [message])

Succeeds if actual matches the pattern regular expression.

```javascript
var BLANK = /^\s*$/;
"  ".mustMatch(BLANK);
```

### actual.wontMatch(pattern, [message])

Succeeds unless actual matches the pattern regular expression.

```javascript
var BLANK = /^\s*$/;
"content".wontMatch(BLANK);
```

### actual.mustBeTypeOf(expected, [message])

Succeeds if typeof actual == expected. It also conveniently supports an `'array'`
type that isn't supported natively, and takes care to correctly compare Number
and String object instances with their primitive counterparts.

```javascript
[].mustBeTypeOf('array');
({}).mustBeTypeOf('object');
new String("str").mustBeTypeOf('string');
```

### actual.wontBeTypeOf(expected, [message])

Succeeds unless typeof actual == expected. Again, it conveniently supports an
`'array'` type that isn't supported natively, and takes care to correctly
compare Number and String object instances with their primitive counterparts.

```javascript
"".wontBeTypeOf('array');
new String().mustBeTypeOf('object');
new String().mustBeTypeOf('string');
```

### actual.mustBeInstanceOf(expected, [message])

Succeeds if actual is an instance of expected.

```javascript
[].mustBeInstanceOf(Array);
({}).mustBeInstanceOf(Object);
```

### actual.wontBeInstanceOf(expected, [message])

Succeeds unless actual is an instance of expected.

```javascript
"".wontBeInstanceOf(Array);
(123).wontBeInstanceOf(Object, 123);
```

### object.mustRespondTo(method, [message])

Succeeds if object has a callable property named method.

```javascript
Array.mustRespondTo('isArray');
Array.prototype.mustRespondTo('forEach');
"str".mustRespondTo('toUpperCase');
```

### object.wontRespondTo(method, [message])

Succeeds unless object has a callable property named method.

```javascript
"str".wontRespondTo('upcase');
MyObject.prototype.wontRespondTo('method');
```

### callback.mustThrow([error], [message])

Succeeds if callback throws an exception of type error then returns the
exception. If no error type is specified, then all expections are catched.

```javascript
var callback = function () {
    throw new Error("oops");
};
var exception = callback.mustThrow(Error);
exception.message.mustEqual("oops");
```

Please note that `.mustThrow()` has no refutation counterparts.

