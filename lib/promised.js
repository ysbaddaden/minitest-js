var assertions = require('./assertions');
var minitest = require('./minitest');

var original = {
    assert: assertions.assert,
    refute: assertions.refute
};

var enabled = function () {
    return typeof MT_RESOLVE_PROMISES === 'undefined' || MT_RESOLVE_PROMISES;
};

var assert = function (test, message) {
    return minitest.resolver(test, original.assert,
        Array.prototype.slice.call(arguments), 0);
};

var refute = function (test, message) {
    return minitest.resolver(test, original.refute,
        Array.prototype.slice.call(arguments), 0);
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
promiseAnAssertion('block', 'unary');
promiseAnAssertion('same');
promiseAnAssertion('equal');
promiseAnAssertion('null', 'unary');
promiseAnAssertion('undefined', 'unary');
promiseAnAssertion('inDelta');
promiseAnAssertion('inEpsilon');
promiseAnAssertion('empty', 'unary');
promiseAnAssertion('includes', 'reverse');
promiseAnAssertion('throws');
promiseAnAssertion('match');
promiseAnAssertion('instanceOf');
promiseAnAssertion('typeOf');
promiseAnAssertion('respondTo', 'reverse');

minitest.resolver = function (actual, callback, args, argn) {
    if (enabled && actual && typeof actual.then === 'function') {
        return actual.then(function (value) {
            args[argn] = value;
            return callback.apply(null, args);
        });
    }
    return callback.apply(null, args);
};

minitest.assert = assertions.assert = assert;
minitest.refute = assertions.refute = refute;
minitest.promiseAnAssertion = promiseAnAssertion;

