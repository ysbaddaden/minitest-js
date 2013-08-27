(function(){var global = this;function debug(){return debug};function require(p, parent){ var path = require.resolve(p) , mod = require.modules[path]; if (!mod) throw new Error('failed to require "' + p + '" from ' + parent); if (!mod.exports) { mod.exports = {}; mod.call(mod.exports, mod, mod.exports, require.relative(path), global); } return mod.exports;}require.modules = {};require.resolve = function(path){ var orig = path , reg = path + '.js' , index = path + '/index.js'; return require.modules[reg] && reg || require.modules[index] && index || orig;};require.register = function(path, fn){ require.modules[path] = fn;};require.relative = function(parent) { return function(p){ if ('debug' == p) return debug; if ('.' != p.charAt(0)) return require(p); var path = parent.split('/') , segs = p.split('/'); path.pop(); for (var i = 0; i < segs.length; i++) { var seg = segs[i]; if ('..' == seg) path.pop(); else if ('.' != seg) path.push(seg); } return require(path.join('/'), parent); };};require.register("minitest.js", function(module, exports, require, global){
var Assertions = require('./minitest/assertions');
var Mock = require('./minitest/mock');

module.exports = {
          AssertionError: Assertions.AssertionError,
                    Mock: Mock,
                  assert: Assertions.assert,
                  refute: Assertions.refute
};

});require.register("minitest/assertions.js", function(module, exports, require, global){
var utils = require('./utils');
var nil = null;

var AssertionError = function (message, expected, actual) {
    var msg = typeof message === 'function' ? message() : message;
    Error.call(this, msg);
    this.message = msg;
    if (Error.captureStackTrace) Error.captureStackTrace.call(this, arguments.callee);
    if (expected) this.expected = utils.inspect(expected);
    if (actual) this.actual = utils.inspect(actual);
};
AssertionError.prototype = Object.create(Error.prototype);

var assert = function (test, msg) {
    if (!test) throw new AssertionError(msg || "Failed assertion, no message given.");
    return true;
};

var refute = function (test, msg) {
    return !assert(!test, msg);
};

assert.ok = function () { return assert.apply(null, arguments); };
refute.ok = function () { return refute.apply(null, arguments); };

assert.block = function (callback, msg) {
    return assert(callback(), utils.message(msg, "Expected block to return true value"));
};

assert.same = function (expected, actual, msg) {
    return assert(actual === expected,
        utils.message(msg, "Expected %{act} to be ===\n%{exp}", {act: actual, exp: expected}, ""));
};

refute.same = function (expected, actual, msg) {
    return refute(actual === expected,
        utils.message(msg, "Expected %{act} to be !==\n%{exp}", {act: actual, exp: expected}, ""));
};

assert.equal = function (expected, actual, msg) {
    if (!utils.deepEqual(actual, expected)) {
        throw new AssertionError(
            utils.message(msg, "Expected %{act} to be equal to\n%{exp}", {act: actual, exp: expected}, ""),
            expected, actual);
    }
    return true;
};

refute.equal = function (expected, actual, msg) {
    if (utils.deepEqual(actual, expected)) {
        throw new AssertionError(
            utils.message(msg, "Expected %{act} to be equal to\n%{exp}", {act: actual, exp: expected}, ""),
            expected, actual);
    }
    return true;
};

assert.inDelta = function (expected, actual, delta, msg) {
    if (delta == nil) delta = 0.001;
    var n = Math.abs(expected - actual);
    return assert(delta >= n,
        utils.message(msg, "Expected %{exp} - %{act} (%{n}) to be <= %{delta}", {exp: expected, act: actual, n: n, delta: delta}));
};
assert.in_delta = assert.inDelta;

refute.inDelta = function (expected, actual, delta, msg) {
    if (delta == nil) delta = 0.001;
    var n = Math.abs(expected - actual);
    return refute(delta >= n,
        utils.message(msg, "Expected %{exp} - %{act} (%{n}) to not be <= %{delta}", {exp: expected, act: actual, n: n, delta: delta}));
};
refute.in_delta = refute.inDelta;

assert.inEpsilon = function (a, b, epsilon, msg) {
    var delta = Math.min(Math.abs(a), Math.abs(b)) * (epsilon || 0.001);
    return assert.inDelta(a, b, delta, msg);
};
assert.in_epsilon = assert.inEpsilon;

refute.inEpsilon = function (a, b, epsilon, msg) {
    return refute.inDelta(a, b, a * (epsilon || 0.001), msg);
};
refute.in_epsilon = refute.inEpsilon;

assert.empty = function (test, msg) {
    return assert(utils.empty(test), utils.message(msg, "Expected %{act} to be empty", {act: test}));
};

refute.empty = function (test, msg) {
    return refute(utils.empty(test), utils.message(msg, "Expected %{act} to not be empty", {act: test}));
};

assert.includes = function (collection, obj, msg) {
    return refute(collection.indexOf(obj) === -1,
        utils.message(msg, "Expected %{collection} to include %{obj}", {collection: collection, obj: obj}));
};

refute.includes = function (collection, obj, msg) {
    return assert(collection.indexOf(obj) === -1,
        utils.message(msg, "Expected %{collection} to not include %{obj}", {collection: collection, obj: obj}));
};

assert.throws = function (error, callback, msg) {
    if (!callback) {
        callback = error;
        error = undefined;
    }
    try {
        callback();
    } catch (ex) {
        if (!error || ex instanceof error) {
            return ex;
        }
        throw ex;
    }
    throw new AssertionError(error ?
        utils.message(msg, "%{error} expected but nothing was thrown", {error: error}) :
        utils.message(msg, "Exception expected but nothing was thrown")
    );
};

assert.match = function (pattern, actual, msg) {
    if (typeof pattern === 'string') pattern = new RegExp(pattern);
    return assert(pattern.test(actual),
        utils.message(msg, "Expected %{pattern} to match %{act}", {pattern: pattern, act: actual}));
};

refute.match = function (pattern, actual, msg) {
    if (typeof pattern === 'string') pattern = new RegExp(pattern);
    return refute(pattern.test(actual),
        utils.message(msg, "Expected %{pattern} to not match %{act}", {pattern: pattern, act: actual}));
};

assert.instanceOf = function (expected, actual, msg) {
    return assert(actual instanceof expected,
        utils.message(msg, "Expected %{act} to be an instance of %{exp}", {act: actual, exp: expected}));
};
assert.instance_of = assert.instanceOf;

refute.instanceOf = function (expected, actual, msg) {
    return refute(actual instanceof expected,
        utils.message(msg, "Expected %{act} to not be an instance of %{exp}", {act: actual, exp: expected}));
};
refute.instance_of = refute.instanceOf;

assert.typeOf = function (expected, actual, msg) {
    if (expected === 'array') {
        return assert(Array.isArray(actual),
            utils.message(msg, "Expected %{act} to be of type 'array' not %{type}", {act: actual, type: typeof actual}));
    }
    return assert(typeof actual === expected,
        utils.message(msg, "Expected %{act} to be of type %{exp} not %{type}", {act: actual, exp: expected, type: typeof actual}));
};
assert.type_of = assert.typeOf;

refute.typeOf = function (expected, actual, msg) {
    if (expected === 'array') {
        return refute(Array.isArray(actual),
            utils.message(msg, "Expected %{act} to not be of type 'array'", {act: actual}));
    }
    return refute(typeof actual === expected,
        utils.message(msg, "Expected %{act} to not be of type %{exp}", {act: actual, exp: expected}));
};
refute.type_of = refute.typeOf;

module.exports = {
    AssertionError: AssertionError,
    assert: assert,
    refute: refute
};

});require.register("minitest/mock.js", function(module, exports, require, global){
var utils = require('./utils');
var nil = null;

var MockExpectationError = function (message) {
    Error.call(this, message);
    this.message = message;
    if (Error.captureStackTrace) Error.captureStackTrace.call(this, arguments.callee);
};
MockExpectationError.prototype = Object.create(Error.prototype);

var argsEqual = function (expected, actual) {
    return expected.every(function (value, i) {
        if (typeof value == 'function') {
            switch (value) {
            case String: return typeof actual[i] === 'string';
            case Number: return typeof actual[i] === 'number';
            default:     return actual[i] instanceof value;
            }
        }
        return utils.deepEqual(value, actual[i]);
    });
};

var validateArguments = function (name, expected, actual) {
    if (expected.length !== actual.length) {
        throw new TypeError("mocked method " + name + "() expects " +
            expected.length + "arguments, got " + actual.length + "."
        );
    }
    if (!argsEqual(expected, actual)) {
        throw new MockExpectationError("mocked method " + name +
            "() called with unexpected arguments " +
            utils.inspect(Array.prototype.slice.call(actual))
        );
    }
};

var mockMethod = function (self, name) {
    return function () {
        var index = self.actualCalls[name].length;
        var expected = self.expectedCalls[name][index];

        if (!expected) {
            throw new MockExpectationError("No more expects available for " + name + "()");
        }
        if (expected.args) {
            validateArguments(name, expected.args, arguments);
        }

        self.actualCalls[name].push(expected);
        return expected.retval;
    };
};

var Mock = function () {
    this.expectedCalls = {};
    this.actualCalls = {};
};

Mock.prototype.expect = function (name, retval, args) {
    if (args != nil && !Array.isArray(args)) {
        throw new TypeError("args must be an array");
    }

    if (!this.expectedCalls[name]) {
        this.expectedCalls[name] = [];
        this.actualCalls[name] = [];
    }
    this.expectedCalls[name].push({name: name, retval: retval, args: args});

    if (!this[name]) {
        this[name] = mockMethod(this, name);
    }
    return this;
};

Mock.prototype.verify = function () {
    for (var name in this.expectedCalls) {
        if (!this.expectedCalls.hasOwnProperty(name)) {
            continue;
        }
        if (this.actualCalls[name].length !== this.expectedCalls[name].length) {
            throw new MockExpectationError("Expected " + name + "()");
        }
    }
    return true;
};

Mock.MockExpectationError = MockExpectationError;
module.exports = Mock;


});require.register("minitest/utils.js", function(module, exports, require, global){
var nil = null;

var deepEqual = function (actual, expected) {
    if (actual === expected) {
        return true;
    }
    if (expected instanceof Date) {
        return (actual instanceof Date && expected.getTime() === actual.getTime());
    }
    if (typeof expected !== 'object' || typeof actual !== 'object') {
        return actual == expected;
    }
    if (expected.prototype !== actual.prototype) {
        return false;
    }
    var keys = Object.keys(expected);
    if (keys.length !== Object.keys(actual).length) {
        return false;
    }
    for (var i = 0, l = keys.length; i < l; i++) {
        if (!deepEqual(expected[keys[i]], actual[keys[i]])) {
            return false;
        }
    }
    return true;
};

var empty = function (test) {
    if (test == nil || test.length === 0) return true;
    if (typeof test === 'object' && Object.keys(test).length === 0) return true;
};

var interpolate = function (str, interpolations) {
    for (var key in interpolations) {
        if (interpolations.hasOwnProperty(key)) {
            str = str.replace(new RegExp('%{' + key + '}', 'g'), inspect(interpolations[key]));
        }
    }
    return str;
};

var message = function (msg, default_msg, interpolations, ending) {
    return function () {
        var custom_message = msg && msg.length ? msg + ".\n" : "";
        return custom_message + interpolate(default_msg, interpolations || {}) + (ending || '.');
    };
};

// inspect is extracted from Prototype © Prototype Core Team
// https://github.com/sstephenson/prototype
var inspect = function (object) {
    try {
        if (object === undefined)       return 'undefined';
        if (object === null)            return 'null';
        if (typeof object === 'number') return String(object);
        if (typeof object === 'string') return inspectString(object);
        if (Array.isArray(object))      return inspectArray(object);
        if (typeof object === 'object') return inspectObject(object);
        return String(object);
    } catch (e) {
        if (e instanceof RangeError) return '...';
        throw e;
    }
};

var inspectObject = function (object) {
    var ret;
    if (object.__inspect_has_been_there__) {
        ret = '...';
    } else {
        object.__inspect_has_been_there__ = true;
        var ary = [];
        for (var key in object) {
            if (object.hasOwnProperty(key) && key !== '__inspect_has_been_there__') {
                ary.push(key + ': ' + inspect(object[key]));
            }
        }
        ret = '{' + ary.join(', ') + '}';
    }
    delete object.__inspect_has_been_there__;
    return ret;
};

var inspectArray = function (ary) {
    return '[' + ary.map(inspect).join(', ') + ']';
};

var specialChar = {
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\f': '\\f',
    '\r': '\\r',
    '\\': '\\\\'
};

var inspectString = function (str) {
    var escapedString = str.replace(/[\x00-\x1f\\]/g, function (character) {
        if (character in specialChar) return specialChar[character];
        return '\\u00' + toPaddedString(character.charCodeAt(), 2, 16);
    });
    return "'" + escapedString.replace(/'/g, '\\\'') + "'";
};

var toPaddedString = function (num, length, radix) {
    var string = num.toString(radix || 10);
    return times('0', length - string.length) + string;
};

var times = function (str, count) {
    return count < 1 ? '' : new Array(count + 1).join(str);
};

module.exports = {
    deepEqual: deepEqual,
    empty: empty,
    interpolate: interpolate,
    message: message,
    inspect: inspect
};

});var exp = require('minitest');if ("undefined" != typeof module) module.exports = exp;else minitest = exp;
})();
