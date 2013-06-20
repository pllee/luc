var is = require('./is');

function strict(val1, val2){
    return val1 === val2;
}

function shallowArray(val1, val2) {
    var i = 0,
        len;
    
    if(!val1 || !val2 || val1.length !== val2.length) {
        return false;
    }

    for(len = val1.length; i < len; ++i) {
        if(val1[i] !== val2[i]) {
            return false;
        }
    }

    return true;
}

function shallowObject(val1, val2) {
    var key, val;

    if (!val1 || !val2 || Object.keys(val1).length !== Object.keys(val2).length) {
        return false;
    }

    for (key in val1) {
        if (val1.hasOwnProperty(key)) {
            value = val1[key];
            if (!val2.hasOwnProperty(key) || val2[key] !== value) {
                return false;
            }
        }
    }

    return true;
}

function date(val1, val2) {
    if(is.isDate(val1) && is.isDate(val2)) {
        return val1.getTime() === val2.getTime();
    }

    return false;
}

function _createBoundCompare(object, fn) {
    return function(value) {
        return fn(object, value);
    };
}

function getCompareFn(object, c) {
    var compareFn = strict,
        config = c || {};

    if (config.shallow !== false) {
        if (is.isObject(object)) {
            compareFn = shallowObject;
        } else if (is.isArray(object)) {
            compareFn = shallowArray;
        } else if (is.isDate(object)) {
            compareFn = date;
        }
    }

    return compareFn;
}

function createCompareFn(object, c) {
    var compareFn = getCompareFn(object, c);

    return _createBoundCompare(object, compareFn);
}

function createCompareNotFn(object, config) {
    var fn = createCompareFn(object, config);
    
    return function(val1, val2) {
        return !fn(val1, val2);
    };
}

exports.compare = function(val1, val2, config) {
    return getCompareFn(val1, config)(val1, val2);
};

exports.createCompareFn = createCompareFn;
exports.createCompareNotFn = createCompareNotFn;