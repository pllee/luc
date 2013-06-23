var exec = require('child_process').exec;

function clean(dirs, callback) {
    var removeDirs = dirs.join(' ');
    exec('rm -r ' + removeDirs, callback);
    callback();
}

function buildCoverage(done) {
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
    clean(['lib-cov', 'pages/coverage/*'], function(){
        buildCoverage(done);
    });
};

module.exports.buildDocs = function(done) {
    require('./docGenerator');

    exec('jsduck gruntTasks/generatedDocs', function() {
        done();
    });
};