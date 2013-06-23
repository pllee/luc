var is = require('./is');

function _strict(val1, val2){
    return val1 === val2;
}

function _compareArrayLength(val1, val2) {
    return(is.isArray(val1) && is.isArray(val2)  && val1.length === val2.length);
}

function _shallowArray(val1, val2) {
    var i = 0,
        len;
    
    if(!_compareArrayLength(val1, val2)) {
        return false;
    }

    for(len = val1.length; i < len; ++i) {
        if(val1[i] !== val2[i]) {
            return false;
        }
    }

    return true;
}

function _deepArray(val1, val2, config) {
    var i = 0,
        len;
    
    if(!_compareArrayLength(val1, val2)) {
        return false;
    }

    for(len = val1.length; i < len; ++i) {
        if(!compare(val1[i],val2[i], config)) {
            return false;
        }
    }

    return true;
}

function _compareObjectKeysLength(val1, val2) {
    return (is.isObject(val1) && is.isObject(val2) && Object.keys(val1).length === Object.keys(val2).length);
}

function _shallowObject(val1, val2) {
    var key, val;

    if (!_compareObjectKeysLength(val1, val2)) {
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

function _deepObject(val1, val2, config) {
    var key, val;

    if (!_compareObjectKeysLength(val1, val2)) {
        return false;
    }

    for (key in val1) {
        if (val1.hasOwnProperty(key)) {
            value = val1[key];
            if (!val2.hasOwnProperty(key) || compare(value, val2[key], config) !== true) {
                return false;
            }
        }
    }

    return true;

}

function _looseObject(val1, val2, config) {
    var key, val;

    for (key in val1) {
        if (val1.hasOwnProperty(key)) {
            value = val1[key];
            if (compare(value, val2[key], config) !== true) {
                return false;
            }
        }
    }

    return true;

}

function _date(val1, val2) {
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
    var compareFn = _strict,
        config = c || {},
        type = config.type;

    if (type === 'deep' || type === 'loose' || type === undefined) {
        if (is.isObject(object)) {
            compareFn = type === 'loose' ? _looseObject : _deepObject;
        } else if (is.isArray(object)) {
            compareFn = _deepArray;
        } else if (is.isDate(object)) {
            compareFn = _date;
        }
    } else if (type === 'shallow') {
        if (is.isObject(object)) {
            compareFn = _shallowObject;
        } else if (is.isArray(object)) {
            compareFn = _shallowArray;
        } else if (is.isDate(object)) {
            compareFn = _date;
        }
    } else if (type !== 'strict') {
        //we would be doing a strict comparison on a type-o
        //I think an error is good here.
        throw new Error('You passed in an invalid comparison type');
    }

    return compareFn;
}

/**
 * @member Luc
 * @method compare
 * 
 * Return true if the values are equal to each
 * other.  By default a deep comparison is 
 * done on arrays, dates and objects and a strict comparison
 * is done on other types.
 * 
 * @param  {Any} val1  
 * @param  {Any} val2   
 * @param  {Object} [config]
 * @param {String} config.type pass in 'shallow' for a shallow
 * comparison, 'deep' (default) for a deep comparison
 * 'strict' for a strict === comparison for all objects or 
 * 'loose' for a loose comparison on objects.  A loose comparison
 *  will compare the keys and values of val1 to val2 and does not
 *  check if keys from val2 do not exist in val1.
 *
 *
    Luc.compare('1', 1)
    >false
    Luc.compare({a: 1}, {a: 1})
    >true
    Luc.compare({a: 1, b: {}}, {a: 1, b: {} }, {type:'shallow'})
    >false
    Luc.compare({a: 1, b: {}}, {a: 1, b: {} }, {type: 'deep'})
    >true
    Luc.compare({a: 1, b: {}}, {a: 1, b: {} }, {type: 'strict'})
    >false
    Luc.compare({a: 1}, {a:1,b:1})
    >false
    Luc.compare({a: 1}, {a:1,b:1}, {type: 'loose'})
    >true
    Luc.compare({a: 1}, {a:1,b:1}, {type: 'loose'})
    >true
    Luc.compare([{a: 1}], [{a:1,b:1}], {type: 'loose'})
    >true
    Luc.compare([{a: 1}, {}], [{a:1,b:1}], {type: 'loose'})
    >false
    Luc.compare([{a: 1}, {}], [{a:1,b:1}, {}], {type: 'loose'})
    >true
    Luc.compare([{a:1,b:1}], [{a: 1}], {type: 'loose'})
    >false

 * @return {Boolean}
 */
function compare(val1, val2, config) {
    return getCompareFn(val1, config)(val1, val2, config);
}


function createBoundCompareFn(object, c) {
    var compareFn = getCompareFn(object, c);

    return _createBoundCompare(object, compareFn);
}

exports.compare = compare;
exports.createBoundCompareFn = createBoundCompareFn;