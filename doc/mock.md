---
title: minitest.js — Mock
layout: application
---

# Mock

You can create a Mock object, expect methods to be called, and verify that they
were called, just like you do in Ruby.

## Usage

### Node.js

```javascript
var Mock = require('minitest/mock');
var stub = require('minitest/stub');
```

### Browser

You can create global shortcuts:

```html
<script>
var Mock = minitest.Mock;
var stub = minitest.stub;
</script>
```

## API

### constructor

First you need to create a Mock object. That can't go any simpler:

```javascript
var obj = new Mock();
```

### .expect(methodName, [returnValue])

Once you have a Mock object, you can expect methods to be called and return a
value —if you omit a return value, the method will simply return `undefined`.

```javascript
obj.expect('meaning_of_life', 42);
obj.meaning_of_life();  // => 42
```

If you expect multiple calls to the same method, you must tell the mock object,
otherwise you'll eventually get a MockExpectationError. Calls to the same method
are executed in the order they are defined:

```javascript
obj.expect('foo', 'bar');
obj.expect('foo', 'baz');

obj.foo();  // => 'bar'
obj.foo();  // => 'baz'
obj.foo();  // => throws a MockExpectationError: unexpected call to foo.
```

Of course you can expect different calls to different methods. The actual calls
don't have to be in order.

```javascript
obj.expect('getFoo', 'foo');
obj.expect('getBar', 'bar');

obj.getBar();  // => 'bar'
obj.getFoo();  // => 'foo'
```

### .expect(methodName, returnValue, args = [])

You can also specify arguments that must match the actual calls:

```javascript
obj.expect('sum', 3, [1, 2]);
obj.expect('sum', 4, [1, 3]);

obj.sum(1, 2);  // => 3
obj.sum(2, 3);  // => throws a MockExpectationError: wrong arguments.
```

Arguments can either be strict (eg: a number or a string) or loose (eg: a class
name), so you may validate the type of arguments, instead of their actual value:

```javascript
obj.expect('foo', null, [Number, String]);
obj.foo(123, "str");
```

### .expect(methodName, returnValue, callback)

You may prefer or need to validate the arguments manually:

```javascript
obj.expect('foo', null, function (arg1, arg2) {
    return arg1 < 10 && arg2 > 10;
});

obj.foo(3, 12);
```

### .verify()

Eventually you can verify that all calls were made with the `verify()` method:

```javascript
var obj = new Mock();
obj.expect('foo', null);
obj.foo();
obj.verify();  // => true
```

But if an expected call isn't fulfilled a MockExpectationError will be thrown:

```javascript
var obj = new Mock();
obj.expect('foo', null);
obj.expect('meaning_of_life', 42);

obj.meaning_of_life();
obj.verify();  // => throws MockExpectationError: expected call to foo().
```


## Stub

### stub(object, methodName, returnValue, callback)

Stubs a method on object to always return a given value for the duration of the
callback. The previous behavior of the method will be restored after the
callback has returned.

```javascript
stub(Date, 'now', 0, function () {
    Date.now();  // => 0
});

Date.now();  // => 1378647728279
```

### object.stub(methodName, returnValue, callback)

On modern engines ([see Spec](spec.html) for the list of supported browsers) the
`.stub()` method is available directly as a non enumerable property on
`Object.prototype`:

```javascript
var obj = {
    test: function () { return true; }
};

obj.stub('test', false, function () {
    obj.test();  // => false
});

obj.test();  // => true
```

