var Luc = require('../lib/luc'),
    arrayFns = Luc.Array,
    wrench = require('wrench'),
    fs = require('fs'),
    path = require('path'),
    sourceDir = __dirname + '/../lib/',
    commentsDir = __dirname + '/injectorComments/';



function _mapFilesToKeys() {
    var files = wrench.readdirSyncRecursive(commentsDir);
    var content = {};

    files.forEach(function(fileName) {
        if (path.extname(fileName) === '.comment') {
            content[path.basename(fileName, '.comment')] = fs.readFileSync(commentsDir + fileName, 'utf8');
        }
    });

    return content;
}

var commentContentMap = _mapFilesToKeys();


function _getNewFileContents(c) {
    var contents = c;
    if(contents.indexOf('{copyDoc') > -1) {
        Luc.Object.each(commentContentMap, function(key, value) {
            var reg = new RegExp('{copyDoc#' + key + '}', 'g');
            contents = contents.replace(reg, value);
        });

        return contents;
    }
}

function _injectDocsIntoFiles(docsDir) {
    
    wrench.copyDirSyncRecursive(sourceDir, docsDir, {
        forceDelete: true
    });

    var files = wrench.readdirSyncRecursive(docsDir);

    files.forEach(function(fileName) {
        var injectContents;
        if (path.extname(fileName) === '.js') {
            injectContents = _getNewFileContents(fs.readFileSync(docsDir + fileName, 'utf8'));

            if(injectContents) {
                fs.writeFileSync(docsDir + fileName, injectContents);
            }
            
        }
    });
}


module.exports = function(docsDir) {
    _injectDocsIntoFiles(docsDir);
};