all:
	cat src/inspect.js \
		src/assert.js \
		src/report.js \
		src/test.js \
		src/module.js \
		src/unit.js > testunit.js

