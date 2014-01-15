exports.config = {
    framework: 'mocha',

    capabilities: {
        browserName: 'chrome'
    },
    chromeOnly: true,

    specs: ['*_test.js']
};
