var utils, assert, refute, Expectations;

if (typeof minitest === 'undefined') {
    minitest = require('../minitest');
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

Expectations.infectAnAssertion('assert', 'called', 'haveBeenCalled', 'unary');
Expectations.infectAnAssertion('refute', 'called', 'haveBeenCalled', 'unary');
Expectations.infectAnAssertion('assert', 'calledWith', 'haveBeenCalledWith', 'reverse');
Expectations.infectAnAssertion('refute', 'calledWith', 'haveBeenCalledWith', 'reverse');

if (minitest.promiseAnAssertion) {
    minitest.promiseAnAssertion('called', 'unary');
    minitest.promiseAnAssertion('calledWith', 'reverse');
}

if (typeof MT_NO_EXPECTATIONS === 'undefined' || !MT_NO_EXPECTATIONS) {
    Expectations.infect(Object.prototype);
}

module.exports = spy;
