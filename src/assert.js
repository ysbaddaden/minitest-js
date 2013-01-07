var assert = (function () {
    var assert = {};

    if (!Object.keys) {
        Object.keys = function (o) {
            var ary = [];
            for (var k in o) {
                if (o.hasOwnProperty(k)) {
                    ary.push(k);
                }
            }
            return ary;
        };
    }

    var fail = function (tpl, actual, expected, message) {
        var x = tpl.
            replace(/<>/, Object.inspect(actual)).
            replace(/<>/, Object.inspect(expected));
        if (message) {
            x += "\n" + message;
        }
        throw new assert.AssertionError(x);
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

//    assert.AssertionError = function (message, actual, expected) {
//        var err = new Error(message);
//        err._type = 'AssertionError';
//        err.actual = actual;
//        err.expected = expected;
//        return err;
//    };

    assert.AssertionError = function (message, actual, expected) {
        Error.call(this, message);
        if (Error.captureStackTrace) {
            Error.captureStackTrace.call(this, arguments.callee);
        }
        this.actual = actual;
        this.expected = expected;
    };
    assert.AssertionError.prototype = new Error();

    assert.ok = function (guard, message) {
        if (!guard) {
            fail("Failed assertion", null, null, message || "No message given");
        }
    };

    assert.equal = function (actual, expected, message) {
        if (actual != expected) {
            fail("<> expected to be ==\n<>", actual, expected, message);
        }
    };

    assert.notEqual = function (actual, expected, message) {
        if (actual == expected) {
            fail("<> expected to be !=\n<>", actual, expected, message);
        }
    };

    assert.strictEqual = function (actual, expected, message) {
        if (actual !== expected) {
            fail("<> expected to be ===\n<>", actual, expected, message);
        }
    };

    assert.notStrictEqual = function (actual, expected, message) {
        if (actual === expected) {
            fail("<> expected to be !== to\n<>", actual, expected, message);
        }
    };

    assert.deepEqual = function (actual, expected, message) {
        if (!deepEqual(actual, expected)) {
            fail("<> expected to be deep equal to\n<>", actual, expected, message);
        }
    };

    assert.notDeepEqual = function (actual, expected, message) {
        if (deepEqual(actual, expected)) {
            fail("<> expected to not be deep equal to\n<>", actual, expected, message);
        }
    };

    assert.throws = function (callback, error, message) {
        try {
            callback();
        } catch (ex) {
            if (!error || ex instanceof error) {
                return;
            }
            //fail("<> exception expected, not <>", error, ex, message);
            throw ex;
        }
        fail("<> exception expected but nothing was thrown.", error, null, message);
    };

    return assert;
}());
