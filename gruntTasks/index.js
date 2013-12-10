var exec = require('child_process').exec,
    wrench = require('wrench'),
    Luc = require('../lib/luc'),
    fs = require('fs'),
    publishVersion = require('./publishVersion');

function clean(dirs) {
    Luc.Array.each(dirs, function(dir) {
        wrench.rmdirSyncRecursive(dir, true);
    });
}

function buildCoverage(done) {
    var tempDir = 'tempTestCoverage';
    fs.mkdirSync('pages/coverage');
    wrench.copyDirSyncRecursive('test', tempDir);
    fs.writeFileSync(tempDir +'/lucTestLib.js', "exports = require('../lib-cov/luc');",{
        forceDelete: true
    });

    exec('jscoverage lib lib-cov', function(error, stdout, stderr) {
        exec('mocha ' + tempDir +' -R html-cov > pages/coverage/index.html', {
        }, function() {
            exec('mocha ' + tempDir +' -R json-cov > pages/coverage/coverage.json', {
            }, function() {
                clean(tempDir);
                done();
            });
        });
    });
}

exports.buildCoverage = function(done) {
    clean(['lib-cov', 'pages/coverage']);
    buildCoverage(done);
};

exports.buildDocs = function(done) {
    require('./docGenerator');

    exec('jsduck gruntTasks/generatedDocs', function() {
        fs.unlink('pages/docs/favicon.ico');
        done();
    });
};

exports.publishVersion = publishVersion;
exports.browsers = require('./browsers');