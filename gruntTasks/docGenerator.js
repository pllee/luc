var Luc = require('../lib/luc'),
    arrayFns = Luc.Array,
    fs = require('fs'),
    commonDocs,
    common =
        '/**\n' +
        ' * @member Luc.ArrayG \n' +
        ' * @method {methodName} \n' +
        ' * {description} \n' +
        ' *  \n' +
        ' * @param {Array} arr \n' +
        ' * {extraParams} \n' +
        ' * \n' +
        ' * @return {returnMessage} \n' +
        ' */\n'

commonDocs = {
    findAll: {
        description: 'Return all items that are equal to the associated function.',
        returnMessage: '{Array} an array of items found'
    },
    findAllNot: {
        description: 'Return all items that are not equal to the associated function.',
        returnMessage: '{Array} an array of items found'
    },
    findFirst: {
        description: 'Return the first item that is equal to the associated function.',
        returnMessage: '{Object} the object that was found, false if no object was found'
    },
    findFirstNot: {
        description: 'Return the first item that is not equal to the associated function.',
        returnMessage: '{Object} the object that was found, false if no object was found'
    },
    removeAll: {
        description: 'Remove all items that are equal to the associated function.',
        returnMessage: '{Array} an array of items removed'
    },
    removeAllNot: {
        description: 'Remove all items that are not equal to the associated function.',
        returnMessage: '{Array} an array of items found'
    },
    removeFirst: {
        description: 'Remove the first item that is equal to the associated function.',
        returnMessage: '{Object} the object that was removed, false if no object was removed'
    },
    removeFirstNot: {
        description: 'Return the first item that is not equal to the associated function.',
        returnMessage: '{Object} the object that was removed, false if no object was removed'
    },

    findLast: {
        description: 'Return the last item that is equal to the associated function.',
        returnMessage: '{Object} the object that was found, false if no object was found'
    },

    findLastNot: {
        description: 'Return the last item that is not equal to the associated function.',
        returnMessage: '{Object} the object that was found, false if no object was found'
    },

    removeLast: {
        description: 'Remove the last item that is equal to the associated function.',
        returnMessage: '{Object} the object that was removed, false if no object was removed'
    },

    removeLastNot: {
        description: 'Return the last item that is not equal to the associated function.',
        returnMessage: '{Object} the object that was removed, false if no object was removed'
    }
};


var extraParams = {
    'InstanceOf': '@param {Function} Constructor ',
    'NotInstanceOf': '@param {Function} Constructor '
};

var keys = Object.keys(commonDocs);

function _generateDoc(docKey, methodName) {
    var values = Luc.apply({
        methodName: methodName,
        extraParams: extraParams[methodName.substring(docKey.length)] || ''
    }, commonDocs[docKey]);

    var str = common;

    Luc.Object.each(values, function(key, value) {
        str = str.replace('{' + key + '}', value);
    });

    return str;
}


function _getDocsToGen(methodName) {
    var doc;

    keys.some(function(key) {
        if (key !== methodName) {
            var index = methodName.indexOf(key);
            if (~index) {
                doc = _generateDoc(key, methodName);
                return true;
            }
        }
    })

    return doc;
}

var buffer = '';

Luc.Object.each(arrayFns, function(key) {
    var docs = _getDocsToGen(key);
    if(docs) {
        buffer += docs
    }
});

fs.writeFileSync(__dirname + '/../lib/docs.js', buffer);