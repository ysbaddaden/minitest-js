(function(){var global = this;function debug(){return debug};function require(p, parent){ var path = require.resolve(p) , mod = require.modules[path]; if (!mod) throw new Error('failed to require "' + p + '" from ' + parent); if (!mod.exports) { mod.exports = {}; mod.call(mod.exports, mod, mod.exports, require.relative(path), global); } return mod.exports;}require.modules = {};require.resolve = function(path){ var orig = path , reg = path + '.js' , index = path + '/index.js'; return require.modules[reg] && reg || require.modules[index] && index || orig;};require.register = function(path, fn){ require.modules[path] = fn;};require.relative = function(parent) { return function(p){ if ('debug' == p) return debug; if ('.' != p.charAt(0)) return require(p); var path = parent.split('/') , segs = p.split('/'); path.pop(); for (var i = 0; i < segs.length; i++) { var seg = segs[i]; if ('..' == seg) path.pop(); else if ('.' != seg) path.push(seg); } return require(path.join('/'), parent); };};require.register("minitest/mock.js", function(module, exports, require, global){
var utils = typeof minitest === 'undefined' ? require('./utils') : minitest.utils;
var nil = null;

function ExpectationError(message) {
    Error.call(this, message);
    this.message = message;
    if (Error.captureStackTrace) {
        Error.captureStackTrace.call(this, arguments.callee);
    }
}
ExpectationError.prototype = Object.create(Error.prototype);
ExpectationError.prototype.constructor = ExpectationError;

var validateArguments = function (name, expected, actual) {
    if (expected.length !== actual.length) {
        throw new TypeError("mocked method " + name + "() expects " +
            expected.length + "arguments, got " + actual.length + "."
        );
    }
    if (!utils.argsEqual(expected, actual)) {
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

Mock.ExpectationError = ExpectationError;
module.exports = Mock;


});var exp = require('mock');if ("undefined" != typeof module) module.exports = exp;else minitest.Mock = exp;
})();
