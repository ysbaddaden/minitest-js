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
    if (test == nil || test.length === 0) {
        return true;
    }
    if (typeof test === 'object' && Object.keys(test).length === 0) {
        return true;
    }
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

// FIXME: prototype's inspect doesn't like recursion!
var inspect = function (object) {
    try {
        if (object === undefined)       return 'undefined';
        if (object === null)            return 'null';
        if (typeof object === 'number') return String(object);
        if (typeof object === 'string') return inspectString(object);
        if (Array.isArray(object))      return inspectArray(object);
        if (typeof object === 'object') return inspectObject(object);
        return String(object);
    } catch (e) {
        if (e instanceof RangeError) return '...';
        throw e;
    }
};

var inspectObject = function (object) {
    var ary = [];
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            ary.push(key + ': ' + inspect(object[key]));
        }
    }
    return '{' + ary.join(', ') + '}';
};

var inspectArray = function (ary) {
    return '[' + ary.map(inspect).join(', ') + ']';
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

module.exports = {
    deepEqual: deepEqual,
    empty: empty,
    interpolate: interpolate,
    message: message,
    inspect: inspect
};
