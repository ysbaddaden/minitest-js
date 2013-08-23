var testunit = (function () {
    var AssertionError = function (message, expected, actual) {
        Error.call(this, message);
        this.message = message;
        if (Error.captureStackTrace) {
            Error.captureStackTrace.call(this, arguments.callee);
        }
        this.actual = actual;
        this.expected = expected;
    };
    AssertionError.prototype = Object.create(Error.prototype);

    var fail = function (tpl, actual, expected, message) {
        var x = tpl.
            replace(/<>/, Object.inspect(actual)).
            replace(/<>/, Object.inspect(expected));
        if (message) {
            x += "\n" + message;
        }
        throw new AssertionError(x);
    };

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

    var assert = {};
    var refute = {};

    assert.ok = function (guard, message) {
        if (!guard) {
            fail("<> expected to be truthy", null, null, message || "No message given");
        }
    };

    refute.ok = function (guard, message) {
        if (guard) {
            fail("<> expected to be falsy", null, null, message || "No message given");
        }
    };

    assert.equal = function (expected, actual, message) {
        if (actual != expected) {
            fail("<> expected to be ==\n<>", actual, expected, message);
        }
    };

    refute.equal = function (expected, actual, message) {
        if (actual == expected) {
            fail("<> expected to be !=\n<>", actual, expected, message);
        }
    };

    assert.same = function (expected, actual, message) {
        if (actual !== expected) {
            fail("<> expected to be ===\n<>", actual, expected, message);
        }
    };

    refute.same = function (expected, actual, message) {
        if (actual === expected) {
            fail("<> expected to be !==\n<>", actual, expected, message);
        }
    };

    assert.deepEqual = function (expected, actual, message) {
        if (!deepEqual(actual, expected)) {
            fail("<> expected to be deep equal to\n<>", actual, expected, message);
        }
    };
    assert.deep_equal = assert.deepEqual;

    refute.deepEqual = function (expected, actual, message) {
        if (deepEqual(actual, expected)) {
            fail("<> expected to not be deep equal to\n<>", actual, expected, message);
        }
    };
    refute.deep_equal = refute.deepEqual;

    assert.throws = function (error, callback, message) {
        if (!callback) {
            callback = error;
            error = undefined;
        }
        try {
            callback();
        } catch (ex) {
            if (!error || ex instanceof error) {
                return;
            }
            throw ex;
        }
        fail("<> exception expected but nothing was thrown.", error, null, message);
    };

    assert.match = function (pattern, actual, message) {
        if (typeof pattern === 'string') {
            pattern = new RegExp(pattern);
        }
        if (!pattern.test(actual)) {
            fail("<> expected to match <>", pattern, actual, message);
        }
    };

    refute.match = function (pattern, actual, message) {
        if (typeof pattern === 'string') {
            pattern = new RegExp(pattern);
        }
        if (pattern.test(actual)) {
            fail("<> expected to match <>", actual, pattern, message);
        }
    };

    assert.is = function (expected, actual, message) {
        if ([true, false, null, undefined].indexOf(expected) !== -1) {
            if (actual !== expected) {
                fail("<> expected to be <>", actual, expected, message);
            }
            return;
        }
        if (expected.toString() === 'NaN') {
            if (!isNaN(actual)) {
                fail("<> expected to be NaN", actual, null, message);
            }
            return;
        }
        if (typeof expected === 'string') {
            if (expected === 'array') {
                if (!Array.isArray(actual)) {
                    fail("<> expected to be a(n) <>", actual, expected, message);
                }
            } else if (typeof actual !== expected) {
                fail("<> expected to be a(n) <>", actual, expected, message);
            }
            return;
        }
        if (!(actual instanceof expected)) {
            fail("<> expected to be an instance of <>", actual, expected, message);
        }
    };

    refute.is = function (expected, actual, message) {
        if ([true, false, null, undefined].indexOf(expected) !== -1) {
            if (actual === expected) {
                fail("<> expected to not be <>", actual, expected, message);
            }
            return;
        }
        if (expected.toString() === 'NaN') {
            if (isNaN(actual)) {
                fail("<> expected to not be NaN", actual, null, message);
            }
            return;
        }
        if (typeof expected === 'string') {
            if (expected === 'array') {
                if (Array.isArray(actual)) {
                    fail("<> expected to be a(n) <>", actual, expected, message);
                }
            } else if (typeof actual === expected) {
                fail("<> expected to not be a(n) <>", actual, expected, message);
            }
            return;
        }
        if (actual instanceof expected) {
            fail("<> expected to not be an instance of <>", actual, expected, message);
        }
    };

    return {
        AssertionError: AssertionError,
        fail: fail,
        refute: refute,
        assert: assert
    };
}());

if (typeof define !== 'undefined') {
    define('testunit', ['inspect'], function () { return testunit; });
} else if (typeof module !== 'undefined') {
    require('./inspect');
    module.exports = testunit;
}
