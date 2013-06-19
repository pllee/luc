var oToString = Object.prototype.toString;

function isArray(obj) {
    return Array.isArray(obj);
}

function isObject(obj) {
    return oToString.call(obj) === '[object Object]';
}

function isFunction(obj) {
    return oToString.call(obj) === '[object Function]';
}

function isDate(obj) {
    return oToString.call(obj) === '[object Date]';
}

function isRegExp(obj) {
    return oToString.call(obj) === '[object RegExp]';
}

function isNumber(obj) {
    return oToString.call(obj) === '[object Number]';
}

function isString(obj) {
    return oToString.call(obj) === '[object String]';
}

function isFalsy(obj) {
    return (!obj && obj !== 0);
}

function isEmpty(obj) {
    var empty = false;

    if (isFalsy(obj)) {
        empty = true;
    } else if (isArray(obj)) {
        empty = obj.length === 0;
    } else if (isObject(obj)) {
        empty = Object.keys(obj).length === 0;
    }

    return empty;
}

module.exports = {
    isArray: isArray,
    isObject: isObject,
    isFunction: isFunction,
    isDate: isDate,
    isString: isString,
    isNumber: isNumber,
    isRegExp: isRegExp,
    isFalsy: isFalsy,
    isEmpty: isEmpty
};