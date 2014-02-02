(function(){var global = this;function debug(){return debug};function require(p, parent){ var path = require.resolve(p) , mod = require.modules[path]; if (!mod) throw new Error('failed to require "' + p + '" from ' + parent); if (!mod.exports) { mod.exports = {}; mod.call(mod.exports, mod, mod.exports, require.relative(path), global); } return mod.exports;}require.modules = {};require.resolve = function(path){ var orig = path , reg = path + '.js' , index = path + '/index.js'; return require.modules[reg] && reg || require.modules[index] && index || orig;};require.register = function(path, fn){ require.modules[path] = fn;};require.relative = function(parent) { return function(p){ if ('debug' == p) return debug; if ('.' != p.charAt(0)) return require(p); var path = parent.split('/') , segs = p.split('/'); path.pop(); for (var i = 0; i < segs.length; i++) { var seg = segs[i]; if ('..' == seg) path.pop(); else if ('.' != seg) path.push(seg); } return require(path.join('/'), parent); };};require.register("promised.js", function(module, exports, require, global){
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


});var exp = require('promised');if ("undefined" != typeof module) module.exports = exp;else minitest/promised = exp;
})();
