(function(){var global = this;function debug(){return debug};function require(p, parent){ var path = require.resolve(p) , mod = require.modules[path]; if (!mod) throw new Error('failed to require "' + p + '" from ' + parent); if (!mod.exports) { mod.exports = {}; mod.call(mod.exports, mod, mod.exports, require.relative(path), global); } return mod.exports;}require.modules = {};require.resolve = function(path){ var orig = path , reg = path + '.js' , index = path + '/index.js'; return require.modules[reg] && reg || require.modules[index] && index || orig;};require.register = function(path, fn){ require.modules[path] = fn;};require.relative = function(parent) { return function(p){ if ('debug' == p) return debug; if ('.' != p.charAt(0)) return require(p); var path = parent.split('/') , segs = p.split('/'); path.pop(); for (var i = 0; i < segs.length; i++) { var seg = segs[i]; if ('..' == seg) path.pop(); else if ('.' != seg) path.push(seg); } return require(path.join('/'), parent); };};require.register("minitest.js", function(module, exports, require, global){
var Assertions = require('./minitest/assertions');
var Expectations = require('./minitest/expectations');

module.exports = {
    AssertionError: Assertions.AssertionError,
    assert: Assertions.assert,
    refute: Assertions.refute,
    expect: Expectations.expect,
    Expectations: Expectations,
    utils: require('./minitest/utils')
};

});require.register("minitest/assertions.js", function(module, exports, require, global){
var utils = require('./utils');
var nil = null;

function AssertionError(message, expected, actual) {
    var msg = typeof message === 'function' ? message() : message;

    Error.call(this, msg);
    this.message = msg;

    if (Error.captureStackTrace) {
        Error.captureStackTrace.call(this, arguments.callee);
    }
    if (expected) {
        this.expected = utils.inspect(expected);
    }
    if (actual) {
        this.actual = utils.inspect(actual);
    }
}
AssertionError.prototype = Object.create(Error.prototype);
AssertionError.prototype.constructor = AssertionError;

var assert = function (test, msg) {
    if (!test) throw new AssertionError(msg || "Failed assertion, no message given.");
    return true;
};

var refute = function (test, msg) {
    return !assert(!test, msg);
};

assert.ok = function () { return assert.apply(null, arguments); };
refute.ok = function () { return refute.apply(null, arguments); };

assert.block = function (callback, msg) {
    return assert(callback(), utils.message(msg, "Expected block to return true value"));
};

assert.same = function (expected, actual, msg) {
    return assert(actual === expected,
        utils.message(msg, "Expected %{act} to be === %{exp}", { act: actual, exp: expected }, ""));
};

refute.same = function (expected, actual, msg) {
    return refute(actual === expected,
        utils.message(msg, "Expected %{act} to be !== %{exp}", { act: actual, exp: expected }, ""));
};

assert.equal = function (expected, actual, msg) {
    if (!utils.deepEqual(actual, expected)) {
        throw new AssertionError(
            utils.message(msg, "Expected %{act} to be equal to %{exp}", { act: actual, exp: expected }, ""),
            expected, actual);
    }
    return true;
};

refute.equal = function (expected, actual, msg) {
    if (utils.deepEqual(actual, expected)) {
        throw new AssertionError(
            utils.message(msg, "Expected %{act} to not be equal to %{exp}", { act: actual, exp: expected }, ""),
            expected, actual);
    }
    return true;
};

assert.inDelta = function (expected, actual, delta, msg) {
    if (delta == nil) delta = 0.001;
    var n = Math.abs(expected - actual);
    return assert(delta >= n,
        utils.message(msg, "Expected %{exp} - %{act} (%{n}) to be <= %{delta}", { exp: expected, act: actual, n: n, delta: delta }));
};
assert.in_delta = assert.inDelta;

refute.inDelta = function (expected, actual, delta, msg) {
    if (delta == nil) delta = 0.001;
    var n = Math.abs(expected - actual);
    return refute(delta >= n,
        utils.message(msg, "Expected %{exp} - %{act} (%{n}) to not be <= %{delta}", { exp: expected, act: actual, n: n, delta: delta }));
};
refute.in_delta = refute.inDelta;

assert.inEpsilon = function (a, b, epsilon, msg) {
    var delta = Math.min(Math.abs(a), Math.abs(b)) * (epsilon || 0.001);
    return assert.inDelta(a, b, delta, msg);
};
assert.in_epsilon = assert.inEpsilon;

refute.inEpsilon = function (a, b, epsilon, msg) {
    return refute.inDelta(a, b, a * (epsilon || 0.001), msg);
};
refute.in_epsilon = refute.inEpsilon;

assert.empty = function (test, msg) {
    return assert(utils.empty(test), utils.message(msg, "Expected %{act} to be empty", { act: test }));
};

refute.empty = function (test, msg) {
    return refute(utils.empty(test), utils.message(msg, "Expected %{act} to not be empty", { act: test }));
};

assert.includes = function (collection, obj, msg) {
    return refute(collection.indexOf(obj) === -1,
        utils.message(msg, "Expected %{collection} to include %{obj}", { collection: collection, obj: obj }));
};

refute.includes = function (collection, obj, msg) {
    return assert(collection.indexOf(obj) === -1,
        utils.message(msg, "Expected %{collection} to not include %{obj}", { collection: collection, obj: obj }));
};

assert.throws = function (error, callback, msg) {
    if (!callback || typeof callback === 'string') {
        msg = callback;
        callback = error;
        error = undefined;
    }

    try {
        callback();
    } catch (ex) {
        if (!error || ex instanceof error) {
            return ex;
        }
        throw ex;
    }

    throw new AssertionError(error ?
        utils.message(msg, "%{error} expected but nothing was thrown", { error: error }) :
        utils.message(msg, "Exception expected but nothing was thrown")
    );
};

assert.match = function (pattern, actual, msg) {
    if (typeof pattern === 'string') pattern = new RegExp(pattern);
    return assert(pattern.test(actual),
        utils.message(msg, "Expected %{pattern} to match %{act}", { pattern: pattern, act: actual }));
};

refute.match = function (pattern, actual, msg) {
    if (typeof pattern === 'string') pattern = new RegExp(pattern);
    return refute(pattern.test(actual),
        utils.message(msg, "Expected %{pattern} to not match %{act}", { pattern: pattern, act: actual }));
};

assert.instanceOf = function (expected, actual, msg) {
    return assert(actual instanceof expected,
        utils.message(msg, "Expected %{act} to be an instance of %{exp}", { act: actual, exp: expected }));
};
assert.instance_of = assert.instanceOf;

refute.instanceOf = function (expected, actual, msg) {
    return refute(actual instanceof expected,
        utils.message(msg, "Expected %{act} to not be an instance of %{exp}", { act: actual, exp: expected }));
};
refute.instance_of = refute.instanceOf;

assert.typeOf = function (expected, actual, msg) {
    return assert(utils.type(actual) === expected,
        utils.message(msg, "Expected %{act} to be of type %{exp} not %{type}", { act: actual, exp: expected, type: utils.type(actual) }));
};
assert.type_of = assert.typeOf;

refute.typeOf = function (expected, actual, msg) {
    return refute(utils.type(actual) === expected,
        utils.message(msg, "Expected %{act} to not be of type %{exp}", { act: actual, exp: expected }));
};
refute.type_of = refute.typeOf;

assert.respondTo = function (object, method, msg) {
    return assert(typeof object[method] === 'function',
        utils.message(msg, "Expected %{obj} to respond to %{meth}", { obj: object, meth: method }));
};

refute.respondTo = function (object, method, msg) {
    return refute(typeof object[method] === 'function',
        utils.message(msg, "Expected %{obj} to not respond to %{meth}", { obj: object, meth: method }));
};

module.exports = {
    AssertionError: AssertionError,
    assert: assert,
    refute: refute
};

});require.register("minitest/expectations.js", function(module, exports, require, global){
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

});require.register("minitest/utils.js", function(module, exports, require, global){
var nil = null;

var type = function (val) {
    var type = typeof val;
    if (type === 'object') {
        if (val === null)          return 'null';
        if (val instanceof Number) return 'number';
        if (val instanceof String) return 'string';
        if (val instanceof RegExp) return 'regexp';
        if (val instanceof Error)  return 'error';
        try {
            if (String(val) === '[object Arguments]') {
                return 'arguments';
            }
        } catch (err) {
            if (!(err instanceof TypeError)) {
                throw err;
            }
        }
    }
    if (Array.isArray(val)) {
        return 'array';
    }
    return type;
};

var empty = function (test) {
    if (test == nil || test.length === 0) return true;
    if (typeof test === 'object' && Object.keys(test).length === 0) return true;
};

var deepEqual = function (actual, expected) {
    if (actual === expected) {
        return true;
    }
    if (expected instanceof Date) {
        return (actual instanceof Date && expected.getTime() === actual.getTime());
    }
    if (expected === null || actual === null || typeof expected !== 'object' || typeof actual !== 'object') {
        return actual == expected;
    }
    if (expected.prototype !== actual.prototype) {
        return false;
    }
    var keys = Object.keys(expected);
    if (keys.length !== Object.keys(actual).length) {
        return false;
    }
    for (var i = 0, l = keys.length; i < l; i++) {
        if (!deepEqual(expected[keys[i]], actual[keys[i]])) {
            return false;
        }
    }
    return true;
};

var argsEqual = function (expected, actual) {
    return expected.every(function (value, i) {
        if (typeof value == 'function') {
            switch (value) {
            case String: return typeof actual[i] === 'string';
            case Number: return typeof actual[i] === 'number';
            default:     return actual[i] instanceof value;
            }
        }
        return deepEqual(value, actual[i]);
    });
};

var interpolate = function (str, interpolations) {
    for (var key in interpolations) {
        if (interpolations.hasOwnProperty(key)) {
            str = str.replace(new RegExp('%{' + key + '}', 'g'), inspect(interpolations[key]));
        }
    }
    return str;
};

var message = function (msg, default_msg, interpolations, ending) {
    return function () {
        var custom_message = msg && msg.length ? msg + ".\n" : "";
        return custom_message + interpolate(default_msg, interpolations || {}) + (ending || '.');
    };
};

var getFunctionName = function (fn) {
    var name = fn.name || String(fn);
    var m = name.match(/function (.+?)\(.*?\) {/);
    return m ? m[1] : name;
};

// inspect is extracted from Prototype © Prototype Core Team
// https://github.com/sstephenson/prototype
var inspect = function (object) {
    try {
        switch (type(object)) {
        case 'undefined': return 'undefined';
        case 'null':      return 'null';
        case 'string':    return inspectString(object);
        case 'array':
        case 'arguments': return inspectArray(object);
        case 'object':    return inspectObject(object);
        case 'function':  return getFunctionName(object);
        default:          return String(object);
        }
    } catch (e) {
        if (e instanceof RangeError) {
            return '...';
        }
        throw e;
    }
};

var inspectObject = function (object) {
    var ret;
    if (object.__inspect_has_been_there__) {
        ret = '...';
    } else {
        object.__inspect_has_been_there__ = true;
        var ary = [];
        for (var key in object) {
            if (object.hasOwnProperty(key) && key !== '__inspect_has_been_there__') {
                ary.push(key + ': ' + inspect(object[key]));
            }
        }
        ret = '{' + ary.join(', ') + '}';
    }
    delete object.__inspect_has_been_there__;
    return ret;
};

var inspectArray = function (ary) {
    return '[' + Array.prototype.map.call(ary, inspect).join(', ') + ']';
};

var specialChar = {
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\f': '\\f',
    '\r': '\\r',
    '\\': '\\\\'
};

var inspectString = function (str) {
    var escapedString = str.replace(/[\x00-\x1f\\]/g, function (character) {
        if (character in specialChar) return specialChar[character];
        return '\\u00' + toPaddedString(character.charCodeAt(), 2, 16);
    });
    return "'" + escapedString.replace(/'/g, '\\\'') + "'";
};

var toPaddedString = function (num, length, radix) {
    var string = num.toString(radix || 10);
    return times('0', length - string.length) + string;
};

var times = function (str, count) {
    return count < 1 ? '' : new Array(count + 1).join(str);
};

// OBJECT PROPERTIES: either define property or silently skip it
//
// 1) legacy browsers don't support defineProperty;
// 2) IE8 doesn't support defineProperty on non DOM objects;
// 3) IE9 has a bug where +this+ in a getter on Number is always 0;
// 4) FF4 has the same bug when the getter returns a function (also affects String).

var supportsDefineProperty = false;
var supportsDefinePropertyOnNumber = false;
var supportsDefinePropertyOnString = false;

if (Object.defineProperty) {
    try {
        Object.defineProperty(Object.prototype, '__mt_test_define_property', {
            get: function () {
                var self = this;
                return function () { return self; };
            },
            configurable: true
        });
        supportsDefineProperty = true,
        supportsDefinePropertyOnNumber = (101).__mt_test_define_property() == 101;
        supportsDefinePropertyOnString = "str".__mt_test_define_property() == "str";
        delete Object.prototype.__mt_test_define_property;
    } catch (error) {}
}

// Infects Object.prototype with a non enumerable property if the browser
// correctly supports Object.defineProperty or silently skips it, leaving the
// infection unset.
//
// But if the user has set the +MT_FORCE_LEGACY+ variable to a truthy value,
// then the infection is set as a regular property on Object.prototype itself,
// so that it will work exactly the same.
//
// This is UGLY, VIOLENT and HAZARDLY DANGEROUS, especially when not checking
// for hasOwnProperty within for in loops, but it works.
//
var infectMethod = function (property, fn) {
    if (supportsDefineProperty) {
        // Fixes IE9 & FF4 support by extending Number & String prototypes
        // directly with methods. That should be safe enough.
        if (!supportsDefinePropertyOnNumber) {
            Number.prototype[property] = fn;
        }
        if (!supportsDefinePropertyOnString) {
            String.prototype[property] = fn;
        }

        // Infects Object.prototype with a non enumerable property:
        return Object.defineProperty(Object.prototype, property, {
            set: function () {},
            get: function () {
                var self = this;
                return function () { return fn.apply(self, arguments); };
            },
            enumerable: false,
            configurable: true
        });
    }

    // WARNING: directly sets the method on Object.prototype:
    if (typeof MT_FORCE_LEGACY !== 'undefined' && MT_FORCE_LEGACY) {
        Object.prototype[property] = fn;
    }
};

module.exports = {
    deepEqual: deepEqual,
    argsEqual: argsEqual,
    empty: empty,
    type: type,

    interpolate: interpolate,
    message: message,
    inspect: inspect,

    infectMethod: infectMethod
};

});var exp = require('minitest');if ("undefined" != typeof module) module.exports = exp;else minitest = exp;
})();
