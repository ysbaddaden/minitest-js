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

Minitest.js virtually supports all and every javascript engines; thought there
is one limitation: they must support ECMAScript 5, either natively or through a
[polyfill](https://github.com/kriskowal/es5-shim). That shouldn't reduce the
scope much, unless you intent to use the must/wont spec notation.

The problem with the spec notation is that it requires to extend
`Object.prototype` with methods (eg: `mustEqual`, `wontMatch`). This is achieved
using non enumerable properties, to prevent side effects and clashes with other
libraries, but it requires *native* support for `Object.defineProperty`, and
that will reduce the scope of compatible browsers to modern browsers only
(eg: Internet Explorer 9+, Firefox 4+ or Safari 5.1+).

