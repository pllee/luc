var AdmZip = require('adm-zip'),
    wrench = require('wrench'),
    outputDir = __dirname + '/../versions/',
    inputDir = __dirname + '/../build/',
    version = require(__dirname + '/../package.json').version;


function zipDir(name) {
    var zip = new AdmZip();
    wrench.copyDirSyncRecursive(inputDir, name, {
        forceDelete: true
    });
    zip.addLocalFolder(name);
    zip.writeZip(outputDir + name +'.zip');
    wrench.rmdirSyncRecursive(name, true);
}

module.exports = function() {
    zipDir(version);
    zipDir('latest');
};

