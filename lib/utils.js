exports.toObject = function(arr, args) {
    var obj = {},
        i = 0,
        len = arr.length;
    for (; i < len; ++i) {
        obj[arr[i]] = args[i];
    }

    return obj;
};