var assertions = require('./assertions');
var minitest = require('../minitest');

var original = {
    assert: assertions.assert,
    refute: assertions.refute
};

var enabled = function () {
    return typeof MT_RESOLVE_PROMISES === 'undefined' || MT_RESOLVE_PROMISES;
};

var assert = function (test, message) {
    return minitest.resolver(test, original.assert, Array.prototype.slice.call(arguments), 0);
};

var refute = function (test, message) {
    return minitest.resolver(test, original.refute, Array.prototype.slice.call(arguments), 0);
};

var promiseAnAssertion = function (name, arg) {
    var argn = arg ? 0 : 1;

    if (original.assert[name]) {
        assert[name] = function () {
            var args = Array.prototype.slice.call(arguments);
            return minitest.resolver(arguments[argn], original.assert[name], args, argn);
        };
    }

    if (original.refute[name]) {
        refute[name] = function () {
            var args = Array.prototype.slice.call(arguments);
            return minitest.resolver(arguments[argn], original.refute[name], args, argn);
        };
    }
};

promiseAnAssertion('ok', 'unary');
promiseAnAssertion('equal');
promiseAnAssertion('inDelta');
promiseAnAssertion('inEpsilon');
promiseAnAssertion('includes', 'reverse');
promiseAnAssertion('instanceOf');
promiseAnAssertion('typeOf');
promiseAnAssertion('match');
promiseAnAssertion('operator', 'reverse');
promiseAnAssertion('respondTo', 'reverse');
promiseAnAssertion('same');
promiseAnAssertion('throws');

minitest.resolver = function (actual, callback, args, argn) {
    if (enabled && typeof actual.then === 'function') {
        return actual.then(function (value) {
            args[argn] = value;
            return callback.apply(null, args);
        });
    }
    return callback.apply(null, arguments);
};

minitest.assert = assert;
minitest.refute = refute;
minitest.promiseAnAssertion = refute;

