// This is extracted from PrototypeJS: http://prototypejs.org/
Object.inspect = function (object) {
    try {
        if (object === undefined) {
            return 'undefined';
        }
        if (object === null) {
            return 'null';
        }
        if (object.inspect) {
            return object.inspect();
        }
        if (typeof object === 'object') {
            var ary = [];
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    ary.push(key + ': ' + Object.inspect(object[key]));
                }
            }
            return '{' + ary.join(', ') + '}';
        }
        return String(object);
    } catch (e) {
        if (e instanceof RangeError) {
            return '...';
        }
        throw e;
    }
};

Array.prototype.inspect = function () {
    //return '[' + this.map(Object.inspect).join(', ') + ']';
    var ary = [];
    for (var i = 0, l = this.length; i < l; i++) {
        ary.push(Object.inspect(this[i]));
    }
    return '[' + ary.join(', ') + ']';
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
    var assert = {};

    if (!Object.keys) {
        Object.keys = function (o) {
            var ary = [];
            for (var k in o) {
                if (o.hasOwnProperty(k)) {
                    ary.push(k);
                }
            }
            return ary;
        };
    }

    var fail = function (tpl, actual, expected, message) {
        var x = tpl.
            replace(/<>/, Object.inspect(actual)).
            replace(/<>/, Object.inspect(expected));
        if (message) {
            x += "\n" + message;
        }
        throw new assert.AssertionError(x);
    };

    var deepEqual = function (actual, expected) {
        if (actual === expected) {
            return true;
        }
        if (expected instanceof Date) {
            return (actual instanceof Date && expected.getTime() === actual.getTime());
        }
        if (typeof expected !== 'object' || typeof actual !== 'object') {
            return actual == expected;
        }
        if (expected.prototype !== actual.prototype) {
            return false;
        }
        var keys = Object.keys(expected);
        if (keys.length !== Object.keys(actual).length) {
            return false;
        }
        for (var i = 0, l = keys.length; i < l; i++) {
            if (!deepEqual(expected[keys[i]], actual[keys[i]])) {
                return false;
            }
        }
        return true;
    };

//    assert.AssertionError = function (message, actual, expected) {
//        var err = new Error(message);
//        err._type = 'AssertionError';
//        err.actual = actual;
//        err.expected = expected;
//        return err;
//    };

    assert.AssertionError = function (message, actual, expected) {
        Error.call(this, message);
        if (Error.captureStackTrace) {
            Error.captureStackTrace.call(this, arguments.callee);
        }
        this.actual = actual;
        this.expected = expected;
    };
    assert.AssertionError.prototype = new Error();

    assert.ok = function (guard, message) {
        if (!guard) {
            fail("Failed assertion", null, null, message || "No message given");
        }
    };

    assert.equal = function (actual, expected, message) {
        if (actual != expected) {
            fail("<> expected to be ==\n<>", actual, expected, message);
        }
    };

    assert.notEqual = function (actual, expected, message) {
        if (actual == expected) {
            fail("<> expected to be !=\n<>", actual, expected, message);
        }
    };

    assert.strictEqual = function (actual, expected, message) {
        if (actual !== expected) {
            fail("<> expected to be ===\n<>", actual, expected, message);
        }
    };

    assert.notStrictEqual = function (actual, expected, message) {
        if (actual === expected) {
            fail("<> expected to be !== to\n<>", actual, expected, message);
        }
    };

    assert.deepEqual = function (actual, expected, message) {
        if (!deepEqual(actual, expected)) {
            fail("<> expected to be deep equal to\n<>", actual, expected, message);
        }
    };

    assert.notDeepEqual = function (actual, expected, message) {
        if (deepEqual(actual, expected)) {
            fail("<> expected to not be deep equal to\n<>", actual, expected, message);
        }
    };

    assert.throws = function (callback, error, message) {
        try {
            callback();
        } catch (ex) {
            if (!error || ex instanceof error) {
                return;
            }
            //fail("<> exception expected, not <>", error, ex, message);
            throw ex;
        }
        fail("<> exception expected but nothing was thrown.", error, null, message);
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
var test = {};

test.run = function (tests) {
    for (var name in tests) {
        if (tests.hasOwnProperty(name) && name !== 'test' && /^test/.test(name)) {
            if (typeof tests[name] === 'function') {
                unit.test(name, tests[name]);
            } else {
                test.run(tests[name]);
            }
        }
    }
    unit.run();
};
var Module = function (name) {
    this.name = name;
    this.tests = [];
    this.setup = null;
    this.teardown = null;
};

Module.Test = function (name, callback, async) {
    this.name = name;
    this.async = async || false;
    this.callback = callback;
};

Module.Test.prototype.run = function (ctx) {
    this.callback.call(ctx);
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
                this.completed();
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

Module.prototype.hasCompleted = function () {
    return this.test === undefined;
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
        module.add(new Module.Test(name, callback));
    };

    unit.async = function (name, callback) {
        module.add(new Module.Test(name, callback, true));
    };

    unit.complete = function () {
        runningModule.completed();
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
}());
