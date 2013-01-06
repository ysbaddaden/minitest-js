var assert = (function () {
    var AssertionError = function (message) {
        var err = new Error(message);
        err._type = 'AssertionError';
        return err;
    };

    var fail = function (tpl, args, message) {
        var x = tpl.replace(/<>/g, function (m) {
            return Object.inspect(args.shift());
        });
        if (message) {
            x += "\n" + message;
        }
        throw AssertionError(x);
    };

    var assert = {};

    assert.AssertionError = AssertionError;
    assert.fail = fail;

    assert.ok = function (test, message) {
        if (!test) {
            fail("Failed assertion", [], message || "No message given");
        }
    };

    assert.equal = function (expected, actual, message) {
        if (actual != expected) {
            fail("<> expected to be ==\n<>", [ actual, expected ], message);
        }
    };

    assert.notEqual = function (expected, actual, message) {
        if (actual == expected) {
            fail("<> expected to be !=\n<>", [ actual, expected ], message);
        }
    };

    assert.same = function (expected, actual, message) {
        if (actual !== expected) {
            fail("<> expected to be ===\n<>", [ actual, expected ], message);
        }
    };

    assert.notSame = function (expected, actual, message) {
        if (actual === expected) {
            fail("<> expected to be !== to\n<>", [ actual, expected ], message);
        }
    };

    return assert;
}());
