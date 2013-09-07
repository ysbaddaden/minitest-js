---
title: minitest.js
layout: application
---

Ruby's [minitest](https://github.com/seattlerb/minitest) assertions, now
available to JavaScript, ready to be consumed with
[mocha](http://visionmedia.github.io/mocha) (or another test runner).
Rubyists must feel at home, and everybody should have clean and readable tests,
running in a large spectrum of engines.

## Quick Start

{% include quick_start.html %}

## About

Minitest.js focuses on the tests: assertions, expectations (seamlessly built
on the assertions) and mocks; and leaves alone the suite and runner parts,
because there are some great solutions already for running tests in JavaScript,
like [mocha](http://visionmedia.github.io/mocha).

The assertions should be a direct port of their ruby counterparts, but
modified to cope with javascript's weirdness, and thus somehow conform to the
[CommonJS Unit Testing/1.0](http://wiki.commonjs.org/wiki/Unit_Testing/1.0)
test suite (eg: deep equality).


## Browser Support

Minitest.js assumes that your browser support ECMAScript 5, either natively or
through a [polyfill](https://github.com/kriskowal/es5-shim) and can be used in
any browser, back to Internet Explorer 6.

Spec expectations (eg: `mustEqual`), on the other end, do require native support
for `Object.defineProperty`, which restrict support to modern engines only (eg:
Node.js, Internet Explorer 10+, Firefox 12+, etc). But thanks to a little hack,
we can support Firefox 3.6 and Internet Explorer 9 (unless we find another bug).

