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

require('./utils').defineProperty(Object.prototype, 'stub', {
    set: function () {},
    get: function () {
        return function (name, val_or_callable, callback) {
            return stub(this, name, val_or_callable, callback);
        };
    },
    enumerable: false,
    configurable: true
});

module.exports = stub;
