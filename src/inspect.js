// This is extracted from PrototypeJS: http://prototypejs.org/
Object.inspect = function (object) {
    try {
        if (object === undefined) {
            return 'undefined';
        }
        if (object === null) {
            return 'null';
        }
        return object.inspect ? object.inspect() : String(object);
    } catch (e) {
        if (e instanceof RangeError) {
            return '...';
        }
        throw e;
    }
};

Array.prototype.inspect = function () {
    return '[' + this.map(Object.inspect).join(', ') + ']';
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
