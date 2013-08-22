var Module = function (name) {
    this.name = name;
    this.tests = [];
    this.setup = null;
    this.teardown = null;
};

Module.Test = function (name, callback, async) {
    this.name = name;
    this.async = async || (this.callback.length > 1);
    this.callback = callback;
};

Module.Test.prototype.run = function (ctx) {
    var self = this;
    this.callback.call(ctx, undefined, function () {
        self.done();
    });
};

Module.prototype.add = function (test) {
    this.tests.push(test);
};

Module.prototype.run = function () {
    if (this.tests.length > 0) {
        report.module(this.name);
        this.runNextTest();
    }
};

Module.prototype.runNextTest = function () {
    this.test = this.tests.shift();
    if (this.test) {
        this.ctx = {};
        try {
            if (typeof this.setup === 'function') {
                this.setup.call(this.ctx);
            }
            this.test.run(this.ctx);
            if (!this.test.async) {
                this.done();
            }
        } catch (ex) {
            if (ex instanceof assert.AssertionError) {
                report.fail(this.test.name, ex);
            } else {
                report.error(this.test.name, ex);
            }
        }
    }
};

Module.prototype.done = function () {
    report.ok(this.test.name);
    if (typeof this.teardown === 'function') {
        try {
            this.teardown.call(this.ctx);
        } catch (ex) {
            report.error(name, ex);
        }
    }
    this.runNextTest();
};

Module.prototype.hasCompleted = function () {
    return this.test === undefined;
};

