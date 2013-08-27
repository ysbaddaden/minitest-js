var assertions  = require('./assertions');
var interpolate = assertions.interpolate;
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
        return assertions.deepEqual(value, actual[i]);
    });
};

var validateArguments = function (name, expected, actual) {
    if (expected.length !== actual.length) {
        throw new TypeError("mocked method " + name + "() expects " +
            expected.length + "arguments, got " + actual.length + ".");
    }
    if (!argsEqual(expected, actual)) {
        throw new MockExpectationError("mocked method " + name +
            "() called with unexpected arguments " +
            Array.prototype.slice.call(actual).inspect());
    }
};

var mockMethod = function (self, name) {
    self[name] = function () {
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
    if (!this.expectedCalls[name]) this.expectedCalls[name] = [];
    if (!this.actualCalls[name]) this.actualCalls[name] = [];
    this.expectedCalls[name].push({name: name, retval: retval, args: args});
    if (!this[name]) mockMethod(this, name);
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

