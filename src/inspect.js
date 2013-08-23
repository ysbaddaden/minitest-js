// This is extracted from PrototypeJS: http://prototypejs.org/
Object.inspect = function (object) {
    try {
        if (object === undefined) {
            return 'undefined';
        }
        if (object === null) {
            return 'null';
        }
        if (object.inspect) {
            return object.inspect();
        }
        if (typeof object === 'object') {
            var ary = [];
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    ary.push(key + ': ' + Object.inspect(object[key]));
                }
            }
            return '{' + ary.join(', ') + '}';
        }
        return String(object);
    } catch (e) {
        if (e instanceof RangeError) {
            return '...';
        }
        throw e;
    }
};

Array.prototype.inspect = function () {
    //return '[' + this.map(Object.inspect).join(', ') + ']';
    var ary = [];
    for (var i = 0, l = this.length; i < l; i++) {
        ary.push(Object.inspect(this[i]));
    }
    return '[' + ary.join(', ') + ']';
};

String.specialChar = {
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\f': '\\f',
    '\r': '\\r',
    '\\': '\\\\'
};

String.prototype.inspect = function () {
    var escapedString = this.replace(/[\x00-\x1f\\]/g, function (character) {
        if (character in String.specialChar) {
            return String.specialChar[character];
        }
        return '\\u00' + character.charCodeAt().toPaddedString(2, 16);
    });
    return "'" + escapedString.replace(/'/g, '\\\'') + "'";
};

String.prototype.times = function (count) {
    return count < 1 ? '' : new Array(count + 1).join(this);
};

Number.prototype.toPaddedString = function (length, radix) {
    var string = this.toString(radix || 10);
    return '0'.times(length - string.length) + string;
};

if (typeof define !== undefined) {
    define('inspect', function () {});
}
