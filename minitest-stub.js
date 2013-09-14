(function(){var global = this;function debug(){return debug};function require(p, parent){ var path = require.resolve(p) , mod = require.modules[path]; if (!mod) throw new Error('failed to require "' + p + '" from ' + parent); if (!mod.exports) { mod.exports = {}; mod.call(mod.exports, mod, mod.exports, require.relative(path), global); } return mod.exports;}require.modules = {};require.resolve = function(path){ var orig = path , reg = path + '.js' , index = path + '/index.js'; return require.modules[reg] && reg || require.modules[index] && index || orig;};require.register = function(path, fn){ require.modules[path] = fn;};require.relative = function(parent) { return function(p){ if ('debug' == p) return debug; if ('.' != p.charAt(0)) return require(p); var path = parent.split('/') , segs = p.split('/'); path.pop(); for (var i = 0; i < segs.length; i++) { var seg = segs[i]; if ('..' == seg) path.pop(); else if ('.' != seg) path.push(seg); } return require(path.join('/'), parent); };};require.register("minitest/stub.js", function(module, exports, require, global){
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

});var exp = require('stub');if ("undefined" != typeof module) module.exports = exp;else minitest.stub = exp;
})();
