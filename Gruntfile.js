module.exports = function(grunt) {

    var browsers = [
        { browserName: "chrome", platform: "XP" } //,
        //{ browserName: "chrome", platform: "Linux" },
        //////{ browserName: "firefox", version: "3" },
        //{ browserName: "firefox", version: "22" },
        //{ browserName: "internet explorer", platform: "Windows 8", version: "10" },
        //{ browserName: "internet explorer", platform: "Windows 7", version: "9" },
        //{ browserName: "internet explorer", platform: "Windows XP", version: "8" },
        //////{ browserName: "internet explorer", platform: "Windows XP", version: "6" },
        ////{ browserName: "safari", platform: "Mac 10.6", version: "5" },
        //{ browserName: "opera", platform: "Windows XP", version: "12" },
        //{ browserName: "iphone", platform: "Mac 10.6", version: "4" },
        //{ browserName: "android", platform: "Linux", version: "4.0" }
    ];

    grunt.initConfig({
        connect: {
            dev:  { options: { base: "", port: 9292, keepalive: true } },
            test: { options: { base: "", port: 9999 } }
        },

        'saucelabs-mocha': {
            all: {
                options: {
                    urls: ["http://127.0.0.1:9999/test/index.html"],
                    tunnelTimeout: 5,
                    build: process.env.TRAVIS_JOB_ID,
                    concurrency: 1,
                    browsers: browsers,
                    testname: "minitest.js"
                }
            }
        }
    });

    for (var key in grunt.file.readJSON("package.json").devDependencies) {
        if (key !== "grunt" && key.indexOf("grunt") === 0) {
            grunt.loadNpmTasks(key);
        }
    }

    grunt.registerTask('mocha', 'run mocha test suite', function () {
        var done = this.async();
        require('child_process').exec('mocha', function (err, stdout) {
            grunt.log.write(stdout);
            done(err);
        });
    });

    if (!!process.env.SAUCELABS) {
        grunt.registerTask("test", ["mocha", "connect:test", "saucelabs-mocha"]);
    } else {
        grunt.registerTask("test", ["mocha"]);
    }

};
