var Assertions = require('./minitest/assertions');

module.exports = {
    AssertionError: Assertions.AssertionError,
            assert: Assertions.assert,
            refute: Assertions.refute
};
