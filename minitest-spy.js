(function(){var global = this;function debug(){return debug};function require(p, parent){ var path = require.resolve(p) , mod = require.modules[path]; if (!mod) throw new Error('failed to require "' + p + '" from ' + parent); if (!mod.exports) { mod.exports = {}; mod.call(mod.exports, mod, mod.exports, require.relative(path), global); } return mod.exports;}require.modules = {};require.resolve = function(path){ var orig = path , reg = path + '.js' , index = path + '/index.js'; return require.modules[reg] && reg || require.modules[index] && index || orig;};require.register = function(path, fn){ require.modules[path] = fn;};require.relative = function(parent) { return function(p){ if ('debug' == p) return debug; if ('.' != p.charAt(0)) return require(p); var path = parent.split('/') , segs = p.split('/'); path.pop(); for (var i = 0; i < segs.length; i++) { var seg = segs[i]; if ('..' == seg) path.pop(); else if ('.' != seg) path.push(seg); } return require(path.join('/'), parent); };};require.register("minitest/spy.js", function(module, exports, require, global){
var utils, assert, refute, Expectations;

if (typeof minitest === 'undefined') {
    utils = require('./utils');
    assert = require('./assertions').assert;
    refute = require('./assertions').refute;
    Expectations = require('./expectations');
} else {
    utils = minitest.utils;
    assert = minitest.assert;
    refute = minitest.refute;
    Expectations = minitest.Expectations;
}

var spy = function (name) {
    var callArgs;

    var fn = function () {
        callArgs = Array.prototype.slice.call(arguments);
    };

    fn.verify = function () {
        if (callArgs === undefined) return false;
        if (!arguments.length) return true;

        var expected = Array.prototype.slice.call(arguments);
        if (expected.length !== callArgs.length) return false;
        return utils.argsEqual(expected, callArgs);
    };

    return fn;
};

utils.infectMethod('spy', function (name) {
    return this[name] = spy(name);
});

assert.called = function (spy, msg) {
    assert(spy.verify(), utils.message(msg, "Expected spy to have been called"));
};
refute.called = function (spy, msg) {
    refute(spy.verify(), utils.message(msg, "Expected spy not to have been called"));
};

assert.calledWith = function (spy, args, msg) {
    assert(spy.verify.apply(null, args),
        utils.message(msg, "Expected spy to have been called with args %{exp}", { exp: args }));
};
refute.calledWith = function (spy, args, msg) {
    refute(spy.verify.apply(null, args),
        utils.message(msg, "Expected spy not to have been called with args %{exp}", { exp: args }));
};

Expectations.infectAnAssertion(assert.called, 'must', 'haveBeenCalled', 'unary');
Expectations.infectAnAssertion(refute.called, 'wont', 'haveBeenCalled', 'unary');
Expectations.infectAnAssertion(assert.calledWith, 'must', 'haveBeenCalledWith', 'reverse');
Expectations.infectAnAssertion(refute.calledWith, 'wont', 'haveBeenCalledWith', 'reverse');

if (typeof MT_NO_EXPECTATIONS === 'undefined' || !MT_NO_EXPECTATIONS) {
    Expectations.infect(Object.prototype);
}

module.exports = spy;

});var exp = require('spy');if ("undefined" != typeof module) module.exports = exp;else minitest.spy = exp;
})();
