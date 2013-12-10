var Luc = require('../lib/luc'),
    ie = 'internet explorer',
    ff = 'firefox',
    latestFF = 25,
    s = 'safari',
    ch = 'chrome',
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
    }]
};

Luc.Object.each(browsers, function(key, values) {

    Luc.Array.each(values, function(value) {
        module.exports.push({
            platform: key,
            version: value.version,
            browserName: value.name
        });
    });
});