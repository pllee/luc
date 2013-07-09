var exec = require('child_process').exec,
    wrench = require('wrench'),
    fs = require('fs');

function clean(dirs) {
    dirs.forEach(function(dir) {
        wrench.rmdirSyncRecursive(dir, true);
    });
}

function buildCoverage(done) {
    fs.mkdirSync('pages/coverage');
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
}

module.exports.buildCoverage = function(done) {
    clean(['lib-cov', 'pages/coverage']);
    buildCoverage(done);
};

module.exports.buildDocs = function(done) {
    require('./docGenerator');

    exec('jsduck gruntTasks/generatedDocs', function() {
        fs.unlink('pages/docs/favicon.ico');
        done();
    });
};