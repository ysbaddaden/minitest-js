.PHONY: test
.IGNORE: test

BIN = `npm bin`

MAIN     = lib/minitest.js \
	       lib/utils.js \
	       lib/assertions.js \
	       lib/expectations.js
PROMISED = lib/promised.js
SPEC     = lib/spec.js
MOCK     = lib/mock.js
STUB     = lib/stub.js
SPY      = lib/spy.js

all:
	$(BIN)/browserbuild -g minitest -b lib/ -m minitest $(MAIN) > minitest.js
	$(BIN)/browserbuild -b lib/ -m minitest/promised $(PROMISED) > minitest-promised.js
	$(BIN)/browserbuild -b lib/ -m minitest/spec $(SPEC) > minitest-spec.js
	$(BIN)/browserbuild -g minitest.Mock -b lib/ -m minitest/mock $(MOCK) > minitest-mock.js
	$(BIN)/browserbuild -g minitest.stub -b lib/ -m minitest/stub $(STUB) > minitest-stub.js
	$(BIN)/browserbuild -g minitest.spy -b lib/ -m minitest/spy $(SPY) > minitest-spy.js

test:
	$(BIN)/mocha

npm:
	ln -sf ./lib/*.js .

