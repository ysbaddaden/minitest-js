var utils = typeof minitest === 'undefined' ? require('./utils') : minitest.utils;

var stub = function (object, name, val_or_callable, callback) {
    var saved = object[name];
    object[name] = function () {
        if (typeof val_or_callable === 'function') {
            return val_or_callable.apply(null, arguments);
        } else {
            return val_or_callable;
        }
    };
    try {
        callback(object);
    } finally {
        object[name] = saved;
    }
    return object;
};

utils.infectMethod('stub', function (name, val_or_callable, callback) {
    return stub(this, name, val_or_callable, callback);
});

module.exports = stub;
