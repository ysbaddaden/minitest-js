var Assertions = require('./minitest/assertions');
var Expectations = require('./minitest/expectations');
require('./minitest/spec');

module.exports = {
    AssertionError: Assertions.AssertionError,
              Mock: require('./minitest/mock'),
              stub: require('./minitest/stub'),
            assert: Assertions.assert,
            refute: Assertions.refute,
            expect: Expectations.expect
};
