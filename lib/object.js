exports.apply = function(t, f) {
    var to = t || {},
    from = f || {},
    prop;

    for (prop in from) {
        if (from.hasOwnProperty(prop)) {
            to[prop] = from[prop];
        }
    }

    return to;
};

exports.mix = function(t, f) {
    var to = t,
        from = f,
        prop;

    for (prop in from) {
        if (from.hasOwnProperty(prop) && typeof to[prop] === 'undefined') {
            to[prop] = from[prop];
        }
    }

    return to;
};

exports.each = function(obj, fn, context) {
    var key, value;

    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            fn.call(context, key, obj[key]);
        }
    }
};
