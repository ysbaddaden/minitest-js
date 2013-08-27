var utils = require('./utils');
var message = utils.message;
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
    return assert(callback(), message(msg, "Expected block to return true value"));
};

assert.same = function (expected, actual, msg) {
    return assert(actual === expected,
        message(msg, "Expected %{act} to be ===\n%{exp}", {act: actual, exp: expected}, ""));
};

refute.same = function (expected, actual, msg) {
    return refute(actual === expected,
        message(msg, "Expected %{act} to be !==\n%{exp}", {act: actual, exp: expected}, ""));
};

assert.equal = function (expected, actual, msg) {
    if (!utils.deepEqual(actual, expected)) {
        throw new AssertionError(
            message(msg, "Expected %{act} to be equal to\n%{exp}", {act: actual, exp: expected}, ""),
            expected, actual);
    }
    return true;
};

refute.equal = function (expected, actual, msg) {
    if (utils.deepEqual(actual, expected)) {
        throw new AssertionError(
            message(msg, "Expected %{act} to be equal to\n%{exp}", {act: actual, exp: expected}, ""),
            expected, actual);
    }
    return true;
};

assert.inDelta = function (expected, actual, delta, msg) {
    if (delta == nil) delta = 0.001;
    var n = Math.abs(expected - actual);
    return assert(delta >= n,
        message(msg, "Expected %{exp} - %{act} (%{n}) to be <= %{delta}", {exp: expected, act: actual, n: n, delta: delta}));
};
assert.in_delta = assert.inDelta;

refute.inDelta = function (expected, actual, delta, msg) {
    if (delta == nil) delta = 0.001;
    var n = Math.abs(expected - actual);
    return refute(delta >= n,
        message(msg, "Expected %{exp} - %{act} (%{n}) to not be <= %{delta}", {exp: expected, act: actual, n: n, delta: delta}));
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
    return assert(utils.empty(test), message(msg, "Expected %{act} to be empty", {act: test}));
};

refute.empty = function (test, msg) {
    return refute(utils.empty(test), message(msg, "Expected %{act} to not be empty", {act: test}));
};

assert.includes = function (collection, obj, msg) {
    return refute(collection.indexOf(obj) === -1,
        message(msg, "Expected %{collection} to include %{obj}", {collection: collection, obj: obj}));
};

refute.includes = function (collection, obj, msg) {
    return assert(collection.indexOf(obj) === -1,
        message(msg, "Expected %{collection} to not include %{obj}", {collection: collection, obj: obj}));
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
        message(msg, "%{error} expected but nothing was thrown", {error: error}) :
        message(msg, "Exception expected but nothing was thrown")
    );
};

assert.match = function (pattern, actual, msg) {
    if (typeof pattern === 'string') pattern = new RegExp(pattern);
    return assert(pattern.test(actual),
        message(msg, "Expected %{pattern} to match %{act}", {pattern: pattern, act: actual}));
};

refute.match = function (pattern, actual, msg) {
    if (typeof pattern === 'string') pattern = new RegExp(pattern);
    return refute(pattern.test(actual),
        message(msg, "Expected %{pattern} to not match %{act}", {pattern: pattern, act: actual}));
};

assert.instanceOf = function (expected, actual, msg) {
    return assert(actual instanceof expected,
        message(msg, "Expected %{act} to be an instance of %{exp}", {act: actual, exp: expected}));
};
assert.instance_of = assert.instanceOf;

refute.instanceOf = function (expected, actual, msg) {
    return refute(actual instanceof expected,
        message(msg, "Expected %{act} to not be an instance of %{exp}", {act: actual, exp: expected}));
};
refute.instance_of = refute.instanceOf;

assert.typeOf = function (expected, actual, msg) {
    if (expected === 'array') {
        return assert(Array.isArray(actual),
            message(msg, "Expected %{act} to be of type 'array' not %{type}", {act: actual, type: typeof actual}));
    }
    return assert(typeof actual === expected,
        message(msg, "Expected %{act} to be of type %{exp} not %{type}", {act: actual, exp: expected, type: typeof actual}));
};
assert.type_of = assert.typeOf;

refute.typeOf = function (expected, actual, msg) {
    if (expected === 'array') {
        return refute(Array.isArray(actual),
            message(msg, "Expected %{act} to not be of type 'array'", {act: actual}));
    }
    return refute(typeof actual === expected,
        message(msg, "Expected %{act} to not be of type %{exp}", {act: actual, exp: expected}));
};
refute.type_of = refute.typeOf;

module.exports = {
    AssertionError: AssertionError,
    assert: assert,
    refute: refute
};