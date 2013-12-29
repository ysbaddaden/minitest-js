var utils = typeof minitest === 'undefined' ? require('./utils') : minitest.utils;

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

module.exports = spy;
