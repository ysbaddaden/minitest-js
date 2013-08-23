.PHONY: test
.IGNORE: test

all: lib/inspect.js lib/minitest.js
	cat lib/inspect.js lib/minitest.js > minitest.js

test:
	mocha --check-leaks

