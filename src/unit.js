//var unit = (function () {
    var modules = [], module, runningModule;
    var unit = {};

    unit.module = function (name) {
        module = new Module(name);
        modules.push(module);
    };

    unit.setup = function (callback) {
        module.setup = callback;
    };

    unit.teardown = function (callback) {
        module.teardown = callback;
    };

    unit.test = function (name, callback) {
        module.add(new Module.Test(name, callback));
    };

    unit.async = function (name, callback) {
        module.add(new Module.Test(name, callback, true));
    };

    unit.done = function () {
        runningModule.done();
    };

    var waitForCompletion = function () {
        if (runningModule.hasCompleted()) {
            unit.run();
        } else {
            setTimeout(waitForCompletion, 100);
        }
    };

    unit.run = function () {
        runningModule = modules.shift();
        if (runningModule) {
            runningModule.run();
            waitForCompletion();
        }
    };

    unit.module('Test');
    return unit;
//}());
