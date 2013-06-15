/**
 * @class Luc.Function
 * Package for function methods.
 */

/**
 * A reusable empty function
 * @return {Function}
 */
exports.emptyFn = function() {};

/**
 * A function that throws an error when called.
 * Useful when defining abstract like classes
 * @return {Function}
 */
exports.abstractFn = function() {
    throw new Error('abstractFn must be implemented');
};

exports.createRelayer = function(obj) {
    var before = obj.before || exports.emptyFn,
        after = obj.after || exports.emptyFn,
        context = obj.context || this;

    return function() {
        before.apply(context, arguments);
        after.apply(context, arguments);
    };
};