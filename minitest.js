// This is extracted from PrototypeJS: http://prototypejs.org/
Object.inspect = function (object) {
    try {
        if (object === undefined) {
            return 'undefined';
        }
        if (object === null) {
            return 'null';
        }
        if (object.inspect) {
            return object.inspect();
        }
        if (typeof object === 'object') {
            var ary = [];
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    ary.push(key + ': ' + Object.inspect(object[key]));
                }
            }
            return '{' + ary.join(', ') + '}';
        }
        return String(object);
    } catch (e) {
        if (e instanceof RangeError) {
            return '...';
        }
        throw e;
    }
};

Array.prototype.inspect = function () {
    //return '[' + this.map(Object.inspect).join(', ') + ']';
    var ary = [];
    for (var i = 0, l = this.length; i < l; i++) {
        ary.push(Object.inspect(this[i]));
    }
    return '[' + ary.join(', ') + ']';
};

String.specialChar = {
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\f': '\\f',
    '\r': '\\r',
    '\\': '\\\\'
};

String.prototype.inspect = function () {
    var escapedString = this.replace(/[\x00-\x1f\\]/g, function (character) {
        if (character in String.specialChar) {
            return String.specialChar[character];
        }
        return '\\u00' + character.charCodeAt().toPaddedString(2, 16);
    });
    return "'" + escapedString.replace(/'/g, '\\\'') + "'";
};

String.prototype.times = function (count) {
    return count < 1 ? '' : new Array(count + 1).join(this);
};

Number.prototype.toPaddedString = function (length, radix) {
    var string = this.toString(radix || 10);
    return '0'.times(length - string.length) + string;
};
var minitest = (function () {
    var AssertionError = function (message, expected, actual) {
        Error.call(this, message);
        this.message = message;
        if (Error.captureStackTrace) Error.captureStackTrace.call(this, arguments.callee);
        if (expected) this.expected = Object.inspect(expected);
        if (actual) this.actual = Object.inspect(actual);
    };
    AssertionError.prototype = Object.create(Error.prototype);

    var interpolate = function (str, interpolations) {
        for (var key in interpolations) {
            if (interpolations.hasOwnProperty(key)) {
                str = str.replace(new RegExp('%{' + key + '}', 'g'), Object.inspect(interpolations[key]));
            }
        }
        return str;
    };

    var message = function (msg, default_msg, interpolations, ending) {
        var custom_message = msg && msg.length ? msg + ".\n" : "";
        return custom_message + interpolate(default_msg, interpolations || {}) + (ending || '.');
    };

    var nil = null;

    var empty = function (test) {
        if (test == nil || test.length === 0) {
            return true;
        }
        if (typeof test === 'object' && Object.keys(test).length === 0) {
            return true;
        }
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
        //return assert(deepEqual(actual, expected),
        //    message(msg, "Expected %{act} to be equal to\n%{exp}", {act: actual, exp: expected}, ""));
        if (!deepEqual(actual, expected)) {
            throw new AssertionError(
                message(msg, "Expected %{act} to be equal to\n%{exp}", {act: actual, exp: expected}, ""),
                expected, actual);
        }
        return true;
    };

    refute.equal = function (expected, actual, msg) {
        //return refute(deepEqual(actual, expected),
        //    message(msg, "Expected %{act} to not be equal to\n%{exp}", {act: actual, exp: expected}, ""));
        if (deepEqual(actual, expected)) {
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
        return assert(empty(test), message(msg, "Expected %{act} to be empty", {act: test}));
    };

    refute.empty = function (test, msg) {
        return refute(empty(test), message(msg, "Expected %{act} to not be empty", {act: test}));
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
                return true;
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

    return {
        AssertionError: AssertionError,
        interpolate: interpolate,
        message: message,
        refute: refute,
        assert: assert
    };
}());

if (typeof define !== 'undefined') {
    define('minitest', function () { return minitest; });
} else if (typeof module !== 'undefined') {
    require('./inspect');
    module.exports = minitest;
}
