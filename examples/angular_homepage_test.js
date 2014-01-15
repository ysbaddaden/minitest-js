require('../lib/minitest/promised');
var assert = require('../lib/minitest').assert;
var refute = require('../lib/minitest').refute;

describe('no protractor at all', function () {
    it('should still do normal tests', function () {
        assert(true);
    });
});

describe('protractor library', function () {
    it('should expose the correct global variables', function () {
        refute.same(undefined, protractor);
        refute.same(undefined, browser);
        refute.same(undefined, by);
        refute.same(undefined, element);
        refute.same(undefined, $);
    });

    it('should wrap webdriver', function () {
        browser.get('http://angularjs.org');
        assert.match(/AngularJS/, browser.getTitle());
    });
});
