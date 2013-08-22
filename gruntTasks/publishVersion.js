var AdmZip = require('adm-zip'),
    wrench = require('wrench'),
    outputDir = __dirname + '/../versions/',
    inputDir = __dirname + '/../build/',
    version = require(__dirname + '/../package.json').version;


function zipDir(name) {
    var zip = new AdmZip(),
        folderName = 'luc-' + name;

    wrench.copyDirSyncRecursive(inputDir, folderName, {
        forceDelete: true
    });
    zip.addLocalFolder(folderName);
    zip.writeZip(outputDir + folderName +'.zip');
    wrench.rmdirSyncRecursive(folderName, true);
}

module.exports = function() {
    zipDir(version);
    zipDir('latest');
};

