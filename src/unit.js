var unit = (function () {
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
        module.add(new Test(name, callback));
    };

    unit.async = function (name, callback) {
        module.add(new Test(name, callback, true));
    };

    unit.complete = function () {
        runningModule.completed();
    };

    unit.run = function () {
        for (var i = 0; i < modules.length; i++) {
            runningModule = modules[i];
            runningModule.run();
        }
    };

    unit.module('Test');
    return unit;
}());
