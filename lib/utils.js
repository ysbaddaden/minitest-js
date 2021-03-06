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

var arrayFrom = Array.from || function (obj) {
  return Array.prototype.slice.call(obj);
};

module.exports = {
    deepEqual: deepEqual,
    argsEqual: argsEqual,
    empty: empty,
    type: type,
    arrayFrom: arrayFrom,

    interpolate: interpolate,
    message: message,
    inspect: inspect,

    infectMethod: infectMethod
};
