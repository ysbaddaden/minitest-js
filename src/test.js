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
