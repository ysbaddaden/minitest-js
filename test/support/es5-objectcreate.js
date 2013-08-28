// Copyright 2009-2012 by contributors, MIT License

if (!Object.create) {
    Object.create = (function () {
        var F = function () {};
        return function (o, properties) {
            F.prototype = o;
            var object = new F();
            //object.__proto__ = o;
            if (properties) Object.defineProperties(object, properties);
            return object;
        };
    }());
}

