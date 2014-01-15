var Expectations = typeof minitest === 'undefined' ? require('./expectations') : minitest.Expectations;

if (typeof MT_NO_EXPECTATIONS === 'undefined' || !MT_NO_EXPECTATIONS) {
    Expectations.infect(Object.prototype);
}
