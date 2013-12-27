.PHONY: test
.IGNORE: test

BIN = `npm bin`

MAIN = lib/minitest.js \
	   lib/minitest/utils.js \
	   lib/minitest/assertions.js \
	   lib/minitest/expectations.js
SPEC = lib/minitest/spec.js
MOCK = lib/minitest/mock.js
STUB = lib/minitest/stub.js

all:
	$(BIN)/browserbuild -g minitest -b lib/ -m minitest $(MAIN) > minitest.js
	$(BIN)/browserbuild -b lib/ -m minitest/spec $(SPEC) > minitest-spec.js
	$(BIN)/browserbuild -g minitest.Mock -b lib/ -m minitest/mock $(MOCK) > minitest-mock.js
	$(BIN)/browserbuild -g minitest.stub -b lib/ -m minitest/stub $(STUB) > minitest-stub.js

test:
	$(BIN)/mocha

