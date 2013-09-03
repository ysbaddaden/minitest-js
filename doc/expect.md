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

### expect(test).toBeEmpty([message])

Succeeds if test is empty (eg: empty string, array or object).

```javascript
expect("").toBeEmpty();
expect([]).toBeEmpty();
```

### expect(test).toNotBeEmpty([message])

Succeeds if test isn't empty (eg: empty string, array or object).

```javascript
expect("h)tml".toNotBeEmpty();
expect([1, 2, 3]).toNotBeEmpty();
expect({a: 1}).toNotBeEmpty();
```

### expect(collection).toInclude(obj, [message])

Succeeds if collection includes obj.

```javascript
expect([1, 2, 3]).toInclude(1);
expect("hello world").toInclude("world");
```

### expect(collection).toNotInclude(obj, [message])

Succeeds unless collection includes obj.

```javascript
expect([1, 2, 3]).toNotInclude(4);
```

### expect(actual).toEqual(expected, [message])

Succeeds if actual *equals* expected; but instead of relying on the (unreliable)
`==` operator, it conforms to the deep equality definition of CommonJS Unit
Testing/1.0. So Dates, arrays, objects, NaNs can be safely compared and found
equal to each others.

```javascript
expect(1).toEqual('1');
expect({colors: ['red', 'green']}).toEqual({colors: ['red', 'green']});
```

### expect(actual).toNotEqual(expected, [message])

Succeeds unless actual *equals* expected. Again, it doesn't use the `==`
operator, but the CommonJS Unit Testing/1.0 definition of deep equality.

```javascript
expect(1).toNotEqual(2);
expect({colors: ['red', 'green']}).toNotEqual({colors: ['blue', 'green']});
```

### expect(actual).toBeSameAs(expected, [message])

Succeeds if actual `===` expected.

```javascript
var obj = {a: 1};
expect(obj).toBeSameAs(obj);
expect(1).toBeSameAs(1);
```

### expect(actual).toNotBeSameAs(expected, [message])

Succeeds unless actual `===` expected.

```javascript
expect({a: 1}).toNotBeSameAs({a: 1});
expect(1).toNotBeSameAs(2);
```

### expect(actual).toBeWithinDelta(expected, delta = 0.001, [message])

For comparing floats, succeeds if actual is within delta of expected.

```javascript
expect(0.999).toBeWithinDelta(1.0, 0.001);
```

This method is also aliased as `.toBeCloseTo()`.

### expect(actual).toNotBeWithinDelta(expected, delta = 0.001, [message])

For comparing floats, succeeds if actual is outside delta of expected.

```javascript
expect(0.997).toBeWithinDelta(1.0, 0.001);
```

This method is also aliased as `.toNotBeCloseTo()`.

### expect(actual).toBeWithinEpsilon(expected, delta = 0.001, [message])

For comparing floats, succeeds if actual is within relative error (epsilon) of
expected.

```javascript
expect(9991).toBeWithinEpsilon(10000, 0.001);
expect(10000).toBeWithinEpsilon(9999.1, 0.0001);
```

### expect(actual).toNotBeWithinEpsilon(expected, delta = 0.001, [message])

For comparing floats, succeeds if actual is outside relative error (epsilon) of
expected.

```javascript
expect(9990 - 1).toNotBeWithinEpsilon(10000);
```

### expect(actual).toMatch(pattern, [message])

Succeeds if actual matches the pattern regular expression.

```javascript
var BLANK = /^\s*$/;
expect("  ").toMatch(BLANK);
```

### expect(actual).toNotMatch(pattern, [message])

Succeeds unless actual matches the pattern regular expression.

```javascript
var BLANK = /^\s*$/;
expect("content").toNotMatch(BLANK);
```

### expect(actual).toBeTypeOf(expected, [message])

Succeeds if typeof actual == expected. It also conveniently supports an `'array'`
type that isn't supported natively, and takes care to correctly compare Number
and String object instances with their primitive counterparts.

```javascript
expect([]).toBeTypeOf('array');
expect({}).toBeTypeOf('object');
expect(new String("str")).toBeTypeOf('string');
```

### expect(actual).toNotBeTypeOf(expected, [message])

Succeeds unless typeof actual == expected. Again, it conveniently supports an
`'array'` type that isn't supported natively, and takes care to correctly
compare Number and String object instances with their primitive counterparts.

```javascript
expect("").toNotBeTypeOf('array');
expect(new String()).toBeTypeOf('object');
expect(new String()).toBeTypeOf('string');
```

### expect(actual).toBeInstanceOf(expected, [message])

Succeeds if actual is an instance of expected.

```javascript
expect([]).toBeInstanceOf(Array);
expect({}).toBeInstanceOf(Object);
```

### expect(actual).toNotBeInstanceOf(expected, [message])

Succeeds unless actual is an instance of expected.

```javascript
expect("").toNotBeInstanceOf(Array);
expect(123).toNotBeInstanceOf(Object, 123);
```

### expect(callback).toThrow([error], [message])

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

