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
var assert = (function () {
    var AssertionError = function (message) {
        var err = new Error(message);
        err._type = 'AssertionError';
        return err;
    };

    var fail = function (tpl, args, message) {
        var x = tpl.replace(/<>/g, function (m) {
            return Object.inspect(args.shift());
        });
        if (message) {
            x += "\n" + message;
        }
        throw AssertionError(x);
    };

    var assert = {};

    assert.AssertionError = AssertionError;
    assert.fail = fail;

    assert.ok = function (test, message) {
        if (!test) {
            fail("Failed assertion", [], message || "No message given");
        }
    };

    assert.equal = function (expected, actual, message) {
        if (actual != expected) {
            fail("<> expected to be ==\n<>", [ actual, expected ], message);
        }
    };

    assert.notEqual = function (expected, actual, message) {
        if (actual == expected) {
            fail("<> expected to be !=\n<>", [ actual, expected ], message);
        }
    };

    assert.same = function (expected, actual, message) {
        if (actual !== expected) {
            fail("<> expected to be ===\n<>", [ actual, expected ], message);
        }
    };

    assert.notSame = function (expected, actual, message) {
        if (actual === expected) {
            fail("<> expected to be !== to\n<>", [ actual, expected ], message);
        }
    };

    return assert;
}());
var report = (function () {
    var report = {};
    var table = document.createElement('table');

    var cell = function (content) {
        var td = document.createElement('td');
        td.appendChild(document.createTextNode(content));
        return td;
    };

    var row = function (type, name, error) {
        var tr;
        tr = document.createElement('tr');
        tr.className = type;
        tr.appendChild(cell(type));
        tr.appendChild(cell(name));
        table.appendChild(tr);

        if (error) {
            tr = document.createElement('tr');
            tr.className = 'message ' + type;
            tr.appendChild(cell(''));
            tr.appendChild(cell(error.stack || error.stacktrace || error.message));
            table.appendChild(tr);
        }

        if (!table.parentNode || table.parentNode.nodeName === '#document-fragment') {
            document.body.appendChild(table);
        }
    };

    report.module = function (name) {
        var th = document.createElement('th');
        th.setAttribute('colspan', 2);
        th.appendChild(document.createTextNode(name));

        var tr = document.createElement('tr');
        tr.className = 'module';
        tr.appendChild(th);
        table.appendChild(tr);
    };

    report.ok = function (name) {
        row('ok', name);
    };

    report.fail = function (name, err) {
        row('fail', name, err);
    };

    report.error = function (name, err) {
        row('error', name, err);
    };

    return report;
}());
var Test = function (name, callback, async) {
    this.name = name;
    this.async = async || false;
    this.callback = callback;
};

Test.prototype.run = function (ctx) {
    this.callback.call(ctx);
};

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
