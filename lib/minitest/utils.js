var nil = null;

var deepEqual = function (actual, expected) {
    if (actual === expected) {
        return true;
    }
    if (expected instanceof Date) {
        return (actual instanceof Date && expected.getTime() === actual.getTime());
    }
    if (typeof expected !== 'object' || typeof actual !== 'object') {
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

var empty = function (test) {
    if (test == nil || test.length === 0) return true;
    if (typeof test === 'object' && Object.keys(test).length === 0) return true;
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

var isNumber = function (val) {
    return typeof val === 'number' || val instanceof Number;
};

var isString = function (val) {
    return typeof val === 'string' || val instanceof String;
};

// inspect is extracted from Prototype © Prototype Core Team
// https://github.com/sstephenson/prototype
var inspect = function (object) {
    try {
        if (object === undefined)       return 'undefined';
        if (object === null)            return 'null';
        if (isNumber(object))           return String(object);
        if (isString(object))           return inspectString(object);
        if (Array.isArray(object))      return inspectArray(object);
        try {
            if (String(object) === '[object Arguments]') return inspectArray(object);
        } catch (e) {}
        if (typeof object === 'object') return inspectObject(object);
        return String(object);
    } catch (e) {
        if (e instanceof RangeError) return '...';
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
// 3) IE9 has a bug where +this+ in a getter on Number is always +0+.

var supportsDefineProperty = false;

if (Object.defineProperty) {
    try {
        Object.defineProperty(Object.prototype, '__mt_test_define_property', {
            get: function () { return this; }, configurable: true
        });
        supportsDefineProperty = (101).__mt_test_define_property == 101;
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
    // infects Object.prototype with a non enumerable property:
    if (supportsDefineProperty) {
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
    empty: empty,
    isNumber: isNumber,
    isString: isString,

    interpolate: interpolate,
    message: message,
    inspect: inspect,

    infectMethod: infectMethod
};
