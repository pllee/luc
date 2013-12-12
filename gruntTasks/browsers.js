var Luc = require('../lib/luc'),
    ie = 'internet explorer',
    ff = 'firefox',
    latestFF = 25,
    s = 'safari',
    ch = 'chrome',
    ip= 'IPHONE',
    an = 'ANDROID',
    op = 'opera',
    browsers;

    module.exports = [];

browsers = {
    XP: [{
        name: ie,
        version: 6
    }, {
        name: ie,
        version: 7
    }, {
        name: ie,
        version: 8
    },{
        name: ff,
        version: 4
    },{
        name: ff,
        version: 3.6
    },{
        name: ff,
        version: 3.5
    }],
    WIN8: [{
        name: ie,
        version: 10
    }, {
        name: ch
    }],
    'WIN8.1': [{
        name: ie,
        version: 11
    }, {
        name: ch
    }],
    'OSX 10.8': [{
        name: s,
        version: 6
    },{
        name: ip,
        version: 6
    },{
        name: ip,
        version: 5
    }],    
    'OSX 10.6': [{
        name: s,
        version: 5
    },{
        name: ch
    },{
        name: ip,
        version: 4
    }],
    'linux': [{
        name: ch
    }],
    'Windows 2008': [{
        version: 12,
        name: op
    }]
};


Luc.Object.each(browsers, function(key, values) {

    Luc.Array.each(values, function(value) {
        var obj = {
            platform: key,
            version: value.version,
            browserName: value.name
        };

        if(obj.version) {
            obj.version += '';
        }
        else {
            delete obj.version;
        }


        module.exports.push(obj);
    });
});