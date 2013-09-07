---
title: minitest.js — expect()
layout: application
---

# Expect

## Usage

### Node.js

```javascript
var expect = require('minitest').expect;
```

### Browser

Once the HTML file is setup, you can create a global shortcut, like so:

```html
<script>
var expect = minitest.expect;
</script>
```


## API

All expectations have the following form:

```javascript
expect(actual).toEqual(expected);
expect(test).toNotBempty();
```

### .toBeEmpty([message])<br/><small>Also aliased as: mustBeEmpty</small>

Succeeds if test is empty (eg: empty string, array or object). Also succeeds if
test is null or undefined.

```javascript
expect("").toBeEmpty();
expect([]).toBeEmpty();
expect(null).toBeEmpty();
```

### .toNotBeEmpty([message])<br/><small>Also aliased as: wontBeEmpty</small>

Succeeds if test isn't empty (eg: empty string, array or object).

```javascript
expect("html".toNotBeEmpty();
expect([1, 2, 3]).toNotBeEmpty();
expect({a: 1}).toNotBeEmpty();
```

### .toInclude(obj, [message])<br/><small>Also aliased as: mustInclude</small>

Succeeds if collection includes obj.

```javascript
expect([1, 2, 3]).toInclude(1);
expect("hello world").toInclude("world");
```

### .toNotInclude(obj, [message])<br/><small>Also aliased as: wontInclude</small>

Succeeds unless collection includes obj.

```javascript
expect([1, 2, 3]).toNotInclude(4);
```

### .toEqual(expected, [message])<br/><small>Also aliased as: mustEqual</small>

Succeeds if actual *equals* expected; but instead of relying on the (unreliable)
`==` operator, it conforms to the deep equality definition of CommonJS Unit
Testing/1.0. So Dates, arrays, objects, NaNs can be safely compared and found
equal to each others.

```javascript
expect(1).toEqual('1');
expect({colors: ['red', 'green']}).toEqual({colors: ['red', 'green']});
```

### .toNotEqual(expected, [message])<br/><small>Also aliased as: wontEqual</small>

Succeeds unless actual *equals* expected. Again, it doesn't use the `==`
operator, but the CommonJS Unit Testing/1.0 definition of deep equality.

```javascript
expect(1).toNotEqual(2);
expect({colors: ['red', 'green']}).toNotEqual({colors: ['blue', 'green']});
```

### .toBeSameAs(expected, [message])<br/><small>Also aliased as: mustBeSameAs</small>

Succeeds if actual `===` expected.

```javascript
var obj = {a: 1};
expect(obj).toBeSameAs(obj);
expect(1).toBeSameAs(1);
```

### .toNotBeSameAs(expected, [message])<br/><small>Also aliased as: wontBeSameAs</small>

Succeeds unless actual `===` expected.

```javascript
expect({a: 1}).toNotBeSameAs({a: 1});
expect(1).toNotBeSameAs(2);
```

### .toBeWithinDelta(expected, delta = 0.001, [message])<br/><small>Also aliased as: mustBeWithinDelta, toBeCloseTo and mustBeCloseTo</small>

For comparing floats, succeeds if actual is within delta of expected.

```javascript
expect(0.999).toBeWithinDelta(1.0, 0.001);
```

This method is also aliased as `.toBeCloseTo()`.

### .toNotBeWithinDelta(expected, delta = 0.001, [message])<br/><small>Also aliased as: wontBeWithinDelta, toNotBeCloseTo and wontBeCloseTo</small>

For comparing floats, succeeds if actual is outside delta of expected.

```javascript
expect(0.997).toBeWithinDelta(1.0, 0.001);
```

This method is also aliased as `.toNotBeCloseTo()`.

### .toBeWithinEpsilon(expected, delta = 0.001, [message])<br/><small>Also aliased as: mustBeWithinEpsilon</small>

For comparing floats, succeeds if actual is within relative error (epsilon) of
expected.

```javascript
expect(9991).toBeWithinEpsilon(10000, 0.001);
expect(10000).toBeWithinEpsilon(9999.1, 0.0001);
```

### .toNotBeWithinEpsilon(expected, delta = 0.001, [message])<br/><small>Also aliased as: wontBeWithinEpsilon</small>

For comparing floats, succeeds if actual is outside relative error (epsilon) of
expected.

```javascript
expect(9990 - 1).toNotBeWithinEpsilon(10000);
```

### .toMatch(pattern, [message])<br/><small>Also aliased as: mustMatch</small>

Succeeds if actual matches the pattern regular expression.

```javascript
var BLANK = /^\s*$/;
expect("  ").toMatch(BLANK);
```

### .toNotMatch(pattern, [message])<br/><small>Also aliased as: wontMatch</small>

Succeeds unless actual matches the pattern regular expression.

```javascript
var BLANK = /^\s*$/;
expect("content").toNotMatch(BLANK);
```

### .toBeTypeOf(expected, [message])<br/><small>Also aliased as: mustBeTypeOf</small>

Succeeds if typeof actual == expected. It also conveniently supports an `'array'`
type that isn't supported natively, and takes care to correctly compare Number
and String object instances with their primitive counterparts.

```javascript
expect([]).toBeTypeOf('array');
expect({}).toBeTypeOf('object');
expect(new String("str")).toBeTypeOf('string');
```

### .toNotBeTypeOf(expected, [message])<br/><small>Also aliased as: wontBeTypeOf</small>

Succeeds unless typeof actual == expected. Again, it conveniently supports an
`'array'` type that isn't supported natively, and takes care to correctly
compare Number and String object instances with their primitive counterparts.

```javascript
expect("").toNotBeTypeOf('array');
expect(new String()).toBeTypeOf('object');
expect(new String()).toBeTypeOf('string');
```

### .toBeInstanceOf(expected, [message])<br/><small>Also aliased as: mustBeInstanceOf</small>

Succeeds if actual is an instance of expected.

```javascript
expect([]).toBeInstanceOf(Array);
expect({}).toBeInstanceOf(Object);
```

### .toNotBeInstanceOf(expected, [message])<br/><small>Also aliased as: wontBeInstanceOf</small>

Succeeds unless actual is an instance of expected.

```javascript
expect("").toNotBeInstanceOf(Array);
expect(123).toNotBeInstanceOf(Object, 123);
```

### .toRespondTo(method, [message])<br/><small>Also aliased as: mustRespondTo</small>

Succeeds if object has a callable property named method.

```javascript
expect(Array).toRespondTo('isArray');
expect(Array.prototype).toRespondTo('forEach');
expect("str").toRespondTo('toUpperCase');
```

### .toNotRespondTo(method, [message])<br/><small>Also aliased as: wontRespondTo</small>

Succeeds unless object has a callable property named method.

```javascript
expect("str").toNotRespondTo('upcase');
expect(MyObject.prototype).toNotRespondTo('methodName');
```

### .toThrow([error], [message])<br/><small>Also aliased as: mustThrow</small>

Succeeds if callback throws an exception of type error then returns the
exception. If no error type is specified, then all expections are catched.

```javascript
var callback = function () {
    throw new Error("oops");
};
var err = expect(callback).toThrow(Error);
expect(err.message).toEqual("oops");
```

Please note that `.toThrow()` has no refutation counterparts.

