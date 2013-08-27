var Assertions = require('./minitest/assertions');
var Mock = require('./minitest/mock');

module.exports = {
          AssertionError: Assertions.AssertionError,
                    Mock: Mock,
                  assert: Assertions.assert,
                  refute: Assertions.refute
};
