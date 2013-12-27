var utils = typeof minitest === 'undefined' ? require('./utils') : minitest.utils;
var nil = null;

function ExpectationError(message) {
    Error.call(this, message);
    this.message = message;
    if (Error.captureStackTrace) Error.captureStackTrace.call(this, arguments.callee);
}
ExpectationError.prototype = Object.create(Error.prototype);
ExpectationError.prototype.constructor = ExpectationError;

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
        throw new ExpectationError("mocked method " + name +
            "() called with unexpected arguments " +
            utils.inspect(Array.prototype.slice.call(actual))
        );
    }
};

var validateCallback = function (name, callback, args) {
    if (!callback.apply(null, args)) {
        throw new ExpectationError("mocked method " + name + "() failed block w/ " + utils.inspect(args));
    }
};

var mockMethod = function (self, name) {
    return function () {
        var index = self.actualCalls[name].length;
        var expected = self.expectedCalls[name][index];

        if (!expected) {
            throw new ExpectationError("No more expects available for " + name + "()");
        }
        if (expected.args) {
            validateArguments(name, expected.args, arguments);
        }
        if (expected.callback) {
            validateCallback(name, expected.callback, arguments);
        }

        self.actualCalls[name].push(expected);
        return expected.retval;
    };
};

var Mock = function () {
    this.expectedCalls = {};
    this.actualCalls = {};
};

Mock.prototype.expect = function (name, retval, args, callback) {
    if (args != nil) {
        if (typeof args === 'function') {
            callback = args;
            args = null;
        } else if (!Array.isArray(args)) {
            throw new TypeError("args must be an array");
        }
    }
    if (args && callback) {
        throw new TypeError("args ignored when callback given");
    }

    if (!this.expectedCalls[name]) {
        this.expectedCalls[name] = [];
        this.actualCalls[name] = [];
    }
    this.expectedCalls[name].push({
        name: name,
        retval: retval,
        args: args,
        callback: callback
    });

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
            throw new ExpectationError("Expected " + name + "()");
        }
    }
    return true;
};

utils.infectMethod('mock', function (name, retval, args, callback) {
    var mock = new Mock().expect(name, retval, args, callback);
    this[name] = function () {
        return mock[name].apply(mock[name], arguments);
    };
    this[name].verify = function () {
        return mock.verify();
    };
    return this[name];
});

Mock.ExpectationError = ExpectationError;
module.exports = Mock;

