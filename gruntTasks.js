var exec = require('child_process').exec;

module.exports.buildCoverage = function(done) {
    exec('jscoverage lib lib-cov', function(error, stdout, stderr) {
        exec('mocha -R html-cov > pages/coverage/index.html', {
            env: {
                COVERAGE: 1
            }
        }, function() {
            exec('mocha -R json-cov > pages/coverage/coverage.json', {
                env: {
                    COVERAGE: 1
                }
            }, function() {
                done();
            });
        });
    });
};

module.exports.buildDocs = function(done) {
    exec('jsduck', function() {
        done();
    });
};