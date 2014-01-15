var AssertionError = require('./assertions').AssertionError;
var assertions = require('./assertions');
var utils = require('./utils');

var Expectations = {};

var Matcher = function (actual) {
    this.actual = actual;
};

var infectAnAssertion = function (type, assertName, name, dontFlip) {
    var fn;

    if (!!dontFlip) {
        fn = function () {
            var assertion = assertions[type][assertName];
            var args = Array.prototype.slice.call(arguments);
            return assertion.apply(null, [this].concat(args));
        };
    } else {
        fn = function () {
            var assertion = assertions[type][assertName];
            var args = Array.prototype.slice.call(arguments, 1);
            return assertion.apply(null, [arguments[0], this].concat(args));
        };
    }

    var camelName = name.charAt(0).toUpperCase() + name.slice(1);
    var matcherName = (type === 'assert' ? 'must' : 'wont') + camelName;
    Expectations[matcherName] = fn;

    var prefix = type === 'assert' ? 'to' : 'toNot';
    Matcher.prototype[matcherName] = function () {
        return fn.apply(this.actual, arguments);
    };

    Matcher.prototype[prefix + camelName] = Matcher.prototype[matcherName];
};

infectAnAssertion('assert', 'empty', 'beEmpty', 'unary');
infectAnAssertion('assert', 'equal', 'equal');
infectAnAssertion('assert', 'inDelta', 'beCloseTo');
infectAnAssertion('assert', 'inDelta', 'beWithinDelta');
infectAnAssertion('assert', 'inEpsilon', 'beWithinEpsilon');
infectAnAssertion('assert', 'includes', 'include', 'reverse');
infectAnAssertion('assert', 'instanceOf', 'beInstanceOf');
infectAnAssertion('assert', 'typeOf', 'beTypeOf');
infectAnAssertion('assert', 'match', 'match');
//infectAnAssertion('assert', 'operator', 'is', 'reverse');
infectAnAssertion('assert', 'respondTo', 'respondTo', 'reverse');
infectAnAssertion('assert', 'same', 'beSameAs');
infectAnAssertion('assert', 'same', 'be');
infectAnAssertion('assert', 'throws', 'throw');

infectAnAssertion('refute', 'empty', 'beEmpty', 'unary');
infectAnAssertion('refute', 'equal', 'equal');
infectAnAssertion('refute', 'inDelta', 'beCloseTo');
infectAnAssertion('refute', 'inDelta', 'beWithinDelta');
infectAnAssertion('refute', 'inEpsilon', 'beWithinEpsilon');
infectAnAssertion('refute', 'includes', 'include', 'reverse');
infectAnAssertion('refute', 'instanceOf', 'beInstanceOf');
infectAnAssertion('refute', 'typeOf', 'beTypeOf');
infectAnAssertion('refute', 'match', 'match');
//infectAnAssertion('refute', 'operator', 'is', 'reverse');
infectAnAssertion('refute', 'respondTo', 'respondTo', 'reverse');
infectAnAssertion('refute', 'same', 'beSameAs');
infectAnAssertion('refute', 'same', 'be');

var infect = function (object, name) {
    utils.infectMethod(name, function () {
        return Expectations[name].apply(this, arguments);
    });
};

module.exports = {
    expect: function (self) {
        return new Matcher(self);
    },
    infect: function (object) {
        if (!Object.defineProperties) {
            return;
        }
        for (var name in Expectations) {
            if (Expectations.hasOwnProperty(name) && !object.hasOwnProperty(name)) {
                infect(object, name);
            }
        }
    },
    infectAnAssertion: infectAnAssertion
};
