.PHONY: test
.IGNORE: test

#BIN = ./node_modules/.bin
OBJECTS = $(wildcard lib/*.js) $(wildcard lib/**/*.js)

all:
	browserbuild -g minitest -b lib/ -m minitest $(OBJECTS) > minitest.js

test:
	mocha --check-leaks

report:
	plato -r -d report/ lib/

