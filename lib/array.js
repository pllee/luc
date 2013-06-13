var toArray = function(arrOrItem) {
    if (Array.isArray(arrOrItem)) {
        return arrOrItem;
    }
    return (arrOrItem === null || typeof arrOrItem === 'undefined') ? [] : [arrOrItem];
}, each = function(arrOrItem, fn, context) {
    var arr = toArray(arrOrItem);
    return arr.forEach.call(arr, fn, context);
};

exports.toArray = toArray;
exports.each = each;