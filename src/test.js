var Test = function (name, callback, async) {
    this.name = name;
    this.async = async || false;
    this.callback = callback;
};

Test.prototype.run = function (ctx) {
    this.callback.call(ctx);
};

