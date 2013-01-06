var Module = function (name) {
    this.name = name;
    this.tests = [];
    this.setup = null;
    this.teardown = null;
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
    var test = this.test = this.tests.shift();
    if (test) {
        this.ctx = {};
        try {
            if (typeof this.setup === 'function') {
                this.setup.call(this.ctx);
            }
            test.run(this.ctx);
            if (!test.async) {
                this.completed();
            }
        } catch (ex) {
            if (ex._type === 'AssertionError') {
                report.fail(test.name, ex);
            } else {
                report.error(test.name, ex);
            }
        }
    }
};

Module.prototype.completed = function () {
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

