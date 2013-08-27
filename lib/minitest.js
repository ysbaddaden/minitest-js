var Assertions = require('./minitest/assertions');

module.exports = {
    AssertionError: Assertions.AssertionError,
              Mock: require('./minitest/mock'),
              stub: require('./minitest/stub'),
            assert: Assertions.assert,
            refute: Assertions.refute
};
