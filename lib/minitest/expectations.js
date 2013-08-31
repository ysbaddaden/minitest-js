var AssertionError = require('./assertions').AssertionError;
var assert = require('./assertions').assert;
var refute = require('./assertions').refute;
var utils = require('./utils');

var Expectations = {};

var Matcher = function (actual) {
    this.actual = actual;
};

var infectAnAssertion = function (assertion, type, name, dontFlip) {
    var fn, nil = null;

    if (!!dontFlip) {
        fn = function () {
            var args = Array.prototype.slice.call(arguments);
            return assertion.apply(null, [this].concat(args));
        };
    } else {
        fn = function () {
            var args = Array.prototype.slice.call(arguments, 1);
            return assertion.apply(null, [arguments[0], this].concat(args));
        };
    }

    var camelName = name.charAt(0).toUpperCase() + name.slice(1);
    var prefix = type === 'must' ? 'to' : 'toNot';

    Expectations[type + camelName] = fn;

    Matcher.prototype[prefix + camelName] = function () {
        fn.apply(this.actual, arguments);
    };
};

infectAnAssertion(assert.empty, 'must', 'beEmpty', 'unary');
infectAnAssertion(assert.equal, 'must', 'equal');
infectAnAssertion(assert.inDelta, 'must', 'beCloseTo');
infectAnAssertion(assert.inDelta, 'must', 'beWithinDelta');
infectAnAssertion(assert.inEpsilon, 'must', 'beWithinEpsilon');
infectAnAssertion(assert.includes, 'must', 'include', 'reverse');
infectAnAssertion(assert.instanceOf, 'must', 'beInstanceOf');
infectAnAssertion(assert.typeOf, 'must', 'beTypeOf');
infectAnAssertion(assert.match, 'must', 'match');
//infectAnAssertion(assert.nil, 'must', 'beNil', 'reverse');
//infectAnAssertion(assert.operator, 'mustBe', 'reverse');
//infectAnAssertion(assert.respondTo, 'must', 'respondTo', 'reverse');
infectAnAssertion(assert.same, 'must', 'beSameAs');
infectAnAssertion(assert.throws, 'must', 'throw');

infectAnAssertion(refute.empty, 'wont', 'beEmpty', 'unary');
infectAnAssertion(refute.equal, 'wont', 'equal');
infectAnAssertion(refute.inDelta, 'wont', 'beCloseTo');
infectAnAssertion(refute.inDelta, 'wont', 'beWithinDelta');
infectAnAssertion(refute.inEpsilon, 'wont', 'beWithinEpsilon');
infectAnAssertion(refute.includes, 'wont', 'include', 'reverse');
infectAnAssertion(refute.instanceOf, 'wont', 'beInstanceOf');
infectAnAssertion(refute.typeOf, 'wont', 'beTypeOf');
infectAnAssertion(refute.match, 'wont', 'match');
//infectAnAssertion(refute.nil, 'wont', 'beNil', 'reverse');
//infectAnAssertion(refute.operator, 'wont', 'be', 'reverse');
//infectAnAssertion(refute.respondTo, 'wont', 'respondTo', 'reverse');
infectAnAssertion(refute.same, 'wont', 'beSameAs');

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
            if (Expectations.hasOwnProperty(name)) {
                infect(object, name);
            }
        }
    },
    infectAnAssertion: infectAnAssertion
};
