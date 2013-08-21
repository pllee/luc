;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
var Luc = {};
/**
 * @class Luc
 * Aliases for common Luc methods and packages.  Check out Luc.define
 * to look at the class system Luc provides.
 */
module.exports = Luc;

var object = require('./object');
Luc.Object = object;
/**
 * @member Luc
 * @property O Luc.O
 * Alias for Luc.Object
 */
Luc.O = object;


/**
 * @member Luc
 * @method apply
 * @inheritdoc Luc.Object#apply
 */
Luc.apply = Luc.Object.apply;

/**
 * @member Luc
 * @method mix
 * @inheritdoc Luc.Object#mix
 */
Luc.mix = Luc.Object.mix;


var fun = require('./function');
Luc.Function = fun;

/**
 * @member Luc
 * @property F Luc.F
 * Alias for Luc.Function
 */
Luc.F = fun;

/**
 * @member Luc
 * @method emptyFn
 * @inheritdoc Luc.Function#emptyFn
 */
Luc.emptyFn = Luc.Function.emptyFn;

/**
 * @member Luc
 * @method abstractFn
 * @inheritdoc Luc.Function#abstractFn
 */
Luc.abstractFn = Luc.Function.abstractFn;

var array = require('./array');
Luc.Array = array;

/**
 * @member Luc
 * @property A Luc.A
 * Alias for Luc.Array
 */
Luc.A = array;

Luc.ArrayFnGenerator = require('./arrayFnGenerator');

Luc.apply(Luc, require('./is'));

var EventEmitter = require('./events/eventEmitter');

Luc.EventEmitter = EventEmitter;

var Base = require('./class/base');

Luc.Base = Base;

var Definer = require('./class/definer');

Luc.ClassDefiner = Definer;

/**
 * @member Luc
 * @method define
 * @inheritdoc Luc.define#define
 */
Luc.define = Definer.define;

Luc.Plugin = require('./class/plugin');

Luc.PluginManager = require('./class/pluginManager');

Luc.apply(Luc, {
    compositionEnums: require('./class/compositionEnums')
});

Luc.compare = require('./compare').compare;

Luc.id = require('./id');


if(typeof window !== 'undefined') {
    window.Luc = Luc;
}
},{"./array":4,"./arrayFnGenerator":5,"./class/base":7,"./class/compositionEnums":12,"./class/definer":9,"./class/plugin":10,"./class/pluginManager":11,"./compare":13,"./events/eventEmitter":8,"./function":3,"./id":14,"./is":6,"./object":2}],15:[function(require,module,exports){
/**
 * @license https://raw.github.com/kriskowal/es5-shim/master/LICENSE
 * es5-shim license
 */

if(typeof window !== 'undefined') {
    require('es5-shim-sham');
}

module.exports = require('./luc');
},{"./luc":1,"es5-shim-sham":16}],2:[function(require,module,exports){
/**
 * @class Luc.Object
 * Package for Object methods.  Luc.Object.apply and Luc.Object.each
 * are used very often.  mix and apply are aliased to Luc.apply and Luc.mix.
 */

/**
 * Apply the properties from fromObject to the toObject.  fromObject will
 * overwrite any shared keys.  It can also be used as a simple shallow clone.
 * 
    var to = {a:1, c:1}, from = {a:2, b:2}
    Luc.Object.apply(to, from)
    >Object {a: 2, c: 1, b: 2}
    to === to
    >true
    var clone = Luc.Object.apply({}, from)
    >undefined
    clone
    >Object {a: 2, b: 2}
    clone === from
    >false
 *
 * No null checks are needed.
    
    Luc.apply(undefined, {a:1})
    >{a:1}
    Luc.apply({a: 1})
    >{a:1}

 *
 * 
 * @param  {Object} [toObject] Object to put the properties fromObject on.
 * @param  {Object} [fromObject] Object to put the properties on the toObject
 * @return {Object} the toObject
 */
exports.apply = function(toObject, fromObject) {
    var to = toObject || {},
        from = fromObject || {},
        prop;

    for (prop in from) {
        if (from.hasOwnProperty(prop)) {
            to[prop] = from[prop];
        }
    }

    return to;
};

/**
 * Similar to Luc.Object.apply except that the fromObject will 
 * NOT overwrite the keys of the toObject if they are defined.
 *
    Luc.mix({a:1,b:2}, {a:3,b:4,c:5})
    >{a: 1, b: 2, c: 5}

 * No null checks are needed.
    
    Luc.mix(undefined, {a:1})
    >{a:1}
    Luc.mix({a: 1})
    >{a:1}
    
 *

 * @param  {Object} [toObject] Object to put the properties fromObject on.
 * @param  {Object} [fromObject] fromObject Object to put the properties on the toObject
 * @return {Object} the toObject
 */
exports.mix = function(toObject, fromObject) {
    var to = toObject || {},
        from = fromObject || {},
        prop;

    for (prop in from) {
        if (from.hasOwnProperty(prop) && to[prop] === undefined) {
            to[prop] = from[prop];
        }
    }

    return to;
};

/**
 * Iterate over an objects properties
 * as key value "pairs" with the passed in function.
 * 
    var thisArg = {val:'c'};
    Luc.Object.each({
        u: 'L'
    }, function(key, value) {
        console.log(value + key + this.val)
    }, thisArg)
    
    >Luc 
 
 * @param  {Object}   obj  the object to iterate over
 * @param  {Function} fn   the function to call
 * @param  {String} fn.key   the object key
 * @param  {Object} fn.value   the object value
 * @param  {Object}   [thisArg] 
 * @param {Object}  [config]
 * @param {Boolean}  config.ownProperties set to false
 * to iterate over all of the objects enumerable properties.
 */
exports.each = function(obj, fn, thisArg, config) {
    var key, value,
        allProperties = config && config.ownProperties === false;

    if (allProperties) {
        for (key in obj) {
            fn.call(thisArg, key, obj[key]);
        }
    } else {
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                fn.call(thisArg, key, obj[key]);
            }
        }
    }
};

/**
 * Take an array of strings and an array/arguments of
 * values and return an object of key value pairs
 * based off each arrays index.  It is useful for taking
 * a long list of arguments and creating an object that can
 * be passed to other methods.
 * 
    function longArgs(a,b,c,d,e,f) {
        return Luc.Object.toObject(['a','b', 'c', 'd', 'e', 'f'], arguments)
    }

    longArgs(1,2,3,4,5,6,7,8,9)

    >Object {a: 1, b: 2, c: 3, d: 4, e: 5…}
    a: 1
    b: 2
    c: 3
    d: 4
    e: 5
    f: 6

    longArgs(1,2,3)

    >Object {a: 1, b: 2, c: 3, d: undefined, e: undefined…}
    a: 1
    b: 2
    c: 3
    d: undefined
    e: undefined
    f: undefined

 * @param  {String[]} strings
 * @param  {Array/arguments} values
 * @return {Object}
 */
exports.toObject = function(strings, values) {
    var obj = {},
        i = 0,
        len = strings.length;
    for (; i < len; ++i) {
        obj[strings[i]] = values[i];
    }

    return obj;
};

/**
 * Return key value pairs from the object if the
 * filterFn returns a truthy value.
 *
    Luc.Object.filter({
        a: false,
        b: true,
        c: false
    }, function(key, value) {
        return key === 'a' || value
    })
    >[{key: 'a', value: false}, {key: 'b', value: true}]

    Luc.Object.filter({
        a: false,
        b: true,
        c: false
    }, function(key, value) {
        return key === 'a' || value
    }, undefined, {
        keys: true
    })
    >['a', 'b']
 * 
 * @param  {Object}   obj  the object to iterate over
 * @param  {Function} filterFn   the function to call, return a truthy value
 * to add the key value pair
 * @param  {String} filterFn.key   the object key
 * @param  {Object} filterFn.value   the object value
 * @param  {Object}   [thisArg] 
 * @param {Object}  [config]
 * @param {Boolean}  config.ownProperties set to false
 * to iterate over all of the objects enumerable properties.
 * 
 * @param {Boolean}  config.keys set to true to return
 * just the keys.
 *
 * @param {Boolean}  config.values set to true to return
 * just the values.
 * 
 * @return {Object[]/String[]} Array of key value pairs in the form
 * of {key: 'key', value: value}.  If keys or values is true on the config
 * just the keys or values are returned.
 *
 */
exports.filter = function(obj, filterFn, thisArg, c) {
    var values = [],
        config = c || {};

    exports.each(obj, function(key, value) {
        if (filterFn.call(thisArg, key, value)) {
            if (config.keys === true) {
                values.push(key);
            } else if (config.values === true) {
                values.push(value);
            } else {
                values.push({
                    value: value,
                    key: key
                });
            }
        }
    }, thisArg, config);

    return values;
};
},{}],6:[function(require,module,exports){
var oToString = Object.prototype.toString;


/**
 * @member Luc
 * Return true if the passed in object is of
 * the type {@link Array Array}
 * @param  {Object}  obj 
 * @return {Boolean}
 */
function isArray(obj) {
    return Array.isArray(obj);
}

/**
 * @member Luc
 * Return true if the passed in object is of
 * the type {@link Object Object}
 * @param  {Object}  obj 
 * @return {Boolean}
 */
function isObject(obj) {
    return obj && oToString.call(obj) === '[object Object]';
}

/**
 * @member Luc
 * Return true if the passed in object is of
 * the type {@link Function Function}
 * @param  {Object}  obj 
 * @return {Boolean}
 */
function isFunction(obj) {
    return oToString.call(obj) === '[object Function]';
}

/**
 * @member Luc
 * Return true if the passed in object is of
 * the type {@link Date Date}
 * @param  {Object}  obj 
 * @return {Boolean}
 */
function isDate(obj) {
    return oToString.call(obj) === '[object Date]';
}

/**
 * @member Luc
 * Return true if the passed in object is of
 * the type {@link RegExp RegExp}
 * @param  {Object}  obj 
 * @return {Boolean}
 */
function isRegExp(obj) {
    return oToString.call(obj) === '[object RegExp]';
}

/**
 * @member Luc
 * Return true if the passed in object is of
 * the type {@link Number Number}
 * @param  {Object}  obj 
 * @return {Boolean}
 */
function isNumber(obj) {
    return oToString.call(obj) === '[object Number]';
}

/**
 * @member Luc
 * Return true if the passed in object is of
 * the type {@link String String}
 * @param  {Object}  obj 
 * @return {Boolean}
 */
function isString(obj) {
    return oToString.call(obj) === '[object String]';
}

/**
 * @member Luc
 * Return true if the passed in object is of
 * the type arguments.
 * 
 * @param  {Object}  obj 
 * @return {Boolean}
 */
function isArguments(obj) {
    return oToString.call(obj) === '[object Arguments]' || obj && !!obj.callee;
}

/**
 * @member Luc
 * Return true if the object is falsy but not zero.
    Luc.isFalsy(false)
    >true
    Luc.isFalsy(0)
    >false
 * @param  {Object}  obj
 * @return {Boolean}     
 */
function isFalsy(obj) {
    return (!obj && obj !== 0);
}

/**
 * @member Luc
 * Return true if the object is empty.
 * {}, [], '',false, null, undefined, NaN 
 * are all treated as empty.
 * 
    Luc.isEmpty(true)
    >false
    Luc.isEmpty([])
    >true
    
 * @param  {Object}  obj
 * @return {Boolean}
 */
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
    isArguments: isArguments,
    isFalsy: isFalsy,
    isEmpty: isEmpty
};
},{}],14:[function(require,module,exports){
var ids = {};
/**
 * @member Luc
 * @method id
 * 
 * Return a unique id.
 * @param {String} [prefix] Optional prefix to use
 *
 *
        Luc.id()
        >"luc-0"
        Luc.id()
        >"luc-1"
        Luc.id('my-prefix')
        >"my-prefix0"
        Luc.id('')
        >"0"
 *
 * @return {String}
 *
 */
module.exports = function(p) {
    var prefix = p === undefined ? 'luc-' : p;

    if(ids[prefix] === undefined) {
        ids[prefix] = 0;
    }

    return prefix + ids[prefix]++;
};
},{}],16:[function(require,module,exports){
require('./node_modules/es5-shim/es5-shim');
require('./node_modules/es5-shim/es5-sham');
},{"./node_modules/es5-shim/es5-sham":18,"./node_modules/es5-shim/es5-shim":17}],3:[function(require,module,exports){
var is = require('./is'),
    aInsert = require('./array').insert,
    aEach = require('./array').each;

/**
 * @class Luc.Function
 * Package for function methods.  Most of them follow the same api:
 * function or function[], relevant args ... with an optional config
 * to Luc.Function.createAugmenter as the last argument.
 */

function _augmentArgs(config, callArgs) {
    var configArgs = config.args,
        index = config.index,
        argsArray;

    if (!configArgs) {
        return callArgs;
    }

    if(index === true || is.isNumber(index)) {
        if(config.argumentsFirst === false) {
            return aInsert(configArgs, callArgs, index);
        }
        return aInsert(callArgs, configArgs, index);
    }

    return configArgs;
}

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

/**
 * Augment the passed in function's thisArg and or arguments object 
 * based on the passed in config.
 * 
 * @param  {Function} fn the function to call
 * @param  {Object} config
 * 
 * @param {Object} [config.thisArg] the thisArg for the function being executed.
 * If this is the only property on your config object the preferred way would
 * be just to use Function.bind
 * 
 * @param {Array} [config.args] the arguments used for the function being executed.
 * This will replace the functions call args if index is not a number or 
 * true.
 * 
 * @param {Number/True} [config.index] By default the the configured arguments
 * will be inserted into the functions passed in call arguments.  If index is true
 * append the args together if it is a number insert it at the passed in index.
 * 
 * @param {Array} [config.argumentsFirst] pass in false to 
 * augment the configured args first with Luc.Array.insert.  Defaults
 * to true
     
     function fn() {
        console.log(this)
        console.log(arguments)
    }
    
    //Luc.Array.insert([4], [1,2,3], 0)
    Luc.Function.createAugmenter(fn, {
        thisArg: {configedThisArg: true},
        args: [1,2,3],
        index:0
    })(4)

    >Object {configedThisArg: true}
    >[1, 2, 3, 4]

    //Luc.Array.insert([1,2,3], [4], 0)
    Luc.Function.createAugmenter(fn, {
        thisArg: {configedThisArg: true},
        args: [1,2,3],
        index:0,
        argumentsFirst:false
    })(4)

    >Object {configedThisArg: true}
    >[4, 1, 2, 3]

    Luc.Array.insert([4], [1,2,3],  true)
    var f = Luc.Function.createAugmenter(fn, {
        args: [1,2,3],
        index: true
    });

    f.apply({config: false}, [4])

    >Object {config: false}
    >[4, 1, 2, 3]

 * @return {Function} the augmented function.
 */
exports.createAugmenter = function(fn, config) {
    var thisArg = config.thisArg;

    return function() {
        return fn.apply(thisArg || this, _augmentArgs(config, arguments));
    };
};

function _initSequenceFunctions(fns, config) {
    var toRun = [];
    aEach(fns, function(f) {
        var fn = f;

        if (config) {
            fn = exports.createAugmenter(f, config);
        }

        toRun.push(fn);
    });

    return toRun;
}

/**
 * Return a function that runs the passed in functions
 * and returns the result of the last function called.
 * 
 * @param  {Function[]} fns 
 * @param  {Object} [config] Config object
 * for Luc.Function.createAugmenter.  If defined all of the functions
 * will get created with the passed in config;
 *
    Luc.Function.createSequence([
        function() {
            console.log(1)
        },
        function() {
            console.log(2)
        },
        function() {
            console.log(3)
            console.log('finished logging')
            return 4;
        }
    ])()
    >1
    >2
    >3
    >finished logging
    >4
 * 
 * @return {Function}
 */
exports.createSequence = function(fns, config) {
    var functions = _initSequenceFunctions(fns, config);

    return function() {
        var i = 0,
            lastFnIndex = functions.length -1;

        for(;i < lastFnIndex; ++i) {
            functions[i].apply(this, arguments);
        }

        return functions[lastFnIndex].apply(this, arguments);
    };
};

/**
 * Return a function that runs the passed in functions
 * if one of the functions returns false the rest of the 
 * functions won't run and false will be returned.
 *
 * If no false is returned the value of the last function return will be returned
 * 
    Luc.Function.createSequenceIf([
        function() {
            console.log(1)
        },
        function() {
            console.log(2)
        },
        function() {
            console.log(3)
            console.log('finished logging')
            return 4;
        }, function() {
            return false;
        }, function() {
            console.log('i cant log')
        }
    ])()

    >1
    >2
    >3
    >finished logging
    >false
 *
 * 
 * @param  {Function[]} fns 
 * @param  {Object} [config] Config object
 * for Luc.Function.createAugmenter.  If defined all of the functions
 * will get created with the passed in config;
 * @return {Function}
 */
exports.createSequenceIf = function(fns, config) {
    var functions = _initSequenceFunctions(fns, config);

    return function() {
        var value,
            args = arguments;

        functions.some(function(fn){
            value = fn.apply(this, args);

            return value === false;
        }, this);

        return value;
    };
};

/**
 * Return a functions that runs the passed in functions
 * the result of each function will be the the call args 
 * for the next function.  The value of the last function 
 * return will be returned.
 * 
     
     Luc.Function.createRelayer([
        function(str) {
            return str + 'b'
        },
        function(str) {
            return str + 'c'
        },
        function(str) {
            return str + 'd'
        }
    ])('a')

    >"abcd"

 * @param  {Function[]} fns 
 * @param  {Object} [config] Config object
 * for Luc.Function.createAugmenter.  If defined all of the functions
 * will get created with the passed in config;
 * @return {Function}
 */
exports.createRelayer = function(fns, config) {
    var functions = _initSequenceFunctions(fns, config);

    return function() {
        var value,
            args = arguments;

        functions.forEach(function(fn, index) {
            if (index === 0) {
                value = fn.apply(this, args);
            } else {
                value = fn.apply(this, [value]);
            }
        }, this);

        return value;
    };
};

/**
 * Create a throttled function from the passed in function
 * that will only get called once the number of milliseconds
 * have been exceeded.
 * 
    var logArgs  = function() {
        console.log(arguments)
    };

    var a = Luc.Function.createThrottled(logArgs, 1);

    for(var i = 0; i < 100; ++i) {
        a(1,2,3);
    }

    setTimeout(function() {
        a(1)
    }, 100)
    setTimeout(function() {
        a(2)
    }, 400)

    >[1, 2, 3]
    >[1]
    >[2]
 * 
 * @param  {Function} fn
 * @param  {Number} millis Number of milliseconds to
 * throttle the function.
 * @param  {Object} [config] Config object
 * for Luc.Function.createAugmenter.  If defined all of the functions
 * will get created with the passed in config;
 * @return {Function}
 */
exports.createThrottled = function(f, millis, config) {
    var fn = config ? exports.createAugmenter(f, config) : f,
        timeOutId = false;

    if(!millis) {
        return fn;
    }

    return function() {
        var args = arguments;

        if(timeOutId) {
            clearTimeout(timeOutId);
        }

        timeOutId = setTimeout(function() {
            timeOutId = false;
            fn.apply(this, args);
        }, millis);
    };
};

/**
 * Defer a function's execution for the passed in
 * milliseconds.
 * 
 * @param  {Function} fn
 * @param  {Number} millis Number of milliseconds to
 * defer
 * @param  {Object} [config] Config object
 * for Luc.Function.createAugmenter.  If defined all of the functions
 * will get created with the passed in config;
 * 
 * @return {Function}
 */
exports.createDeferred = function(f, millis, config) {
    var fn = config ? exports.createAugmenter(f, config) : f;

    if(!millis) {
        return fn;
    }

    return function() {
        var args = arguments;

        setTimeout(function() {
            fn.apply(this, args);
        }, millis);
    };
};
},{"./array":4,"./is":6}],4:[function(require,module,exports){
var arraySlice = Array.prototype.slice,
    compare = require('./compare'),
    is = require('./is'),
    compare = compare.compare;

function _createIteratorFn(fn, c) {
    var config = c || {};

    if(is.isFunction(fn) && (config.type !== 'strict')) {
        return c ? fn.bind(c) : fn;
    }

    if(config.type === undefined) {
        config.type = 'loose';
    }

    return function(value) {
        return compare(fn, value, config);
    };
}

function _createIteratorNotFn(fn, config) {
    var functionToNot = _createIteratorFn(fn, config);
        
    return function() {
        return !functionToNot.apply(this, arguments);
    };
}


/**
 * @class Luc.Array 
 * Package for Array methods. <br>
 * 
 * Keep in mind that Luc is optionally packaged with es5 shim so you can write es5 code in non es5 browsers.
 * It comes with your favorite {@link Array Array} methods such as Array.forEach, Array.filter, Array.some, Array.every Array.reduceRight ..
 *
 * Also don't forget about Luc.Array.each and Luc.Array.toArray, they are great utility methods
 * that are used all over the framework.
 * 
 * All remove\* / find\* methods follow the same api.  \*All functions will return an array of removed or found
 * items.  The items will be added to the array in the order they are
 * found.  \*First functions will return the first item and stop iterating after that, if none
 *  is found false is returned.  remove\* functions will directly change the passed in array.
 *  \*Not functions only do the following actions if the comparison is not true.
 *  All remove\* / find\* take the following api: array, objectToCompareOrIterator, compareConfigOrThisArg <br>for example:
 *
    //most common use case
    Luc.Array.findFirst([1,2,3, {}], {});
    >Object {}

    //pass in optional config for a strict === comparison
    Luc.Array.findFirst([1,2,3,{}], {}, {type: 'strict'});
    >false

    //pass in an iterator and thisArg
    Luc.Array.findFirst([1,2,3,{}], function(val, index, array){
        return val === 3 || this.num === val;
    }, {num: 1});
    >1
    
    //you can see remove modifies the passed in array.
    var arr = [1,2,{a:1},1, {a:1}];
    Luc.Array.removeFirst(arr, {a:1})
    >{a:1}
    arr;
    >[1, 2, 1, {a:1}]
    Luc.Array.removeLast(arr, 1)
    >1
    arr;
    >[1,2, {a:1}]
    
    
    Luc.Array.findAll([1,2,3, {a:1,b:2}], function() {return true;})
    > [1,2,3, {a:1,b:2}]
    //show how not works with an iterator
    Luc.Array.findAllNot([1,2,3, {a:1,b:2}], function() {return true;})
    >[]
 *
 * For commonly used find/remove functions check out Luc.ArrayFns for example a
 * "compact" like function
 * 
    Luc.Array.findAllNotFalsy([false, '', undefined, 0, {}, []])
    >[0, {}, []]
 *
 * Or remove all empty items
 * 
    var arr = ['', 0 , [], {a:1}, true, {}, [1]]
    Luc.Array.removeAllEmpty(arr)
    >['', [], {}]
    arr
    >[0, {a:1}, true, [1]]
 */

/**
 * Turn the passed in item into an array if it
 * isn't one already, if the item is an array just return it.  
 * It returns an empty array if item is null or undefined.
 * If it is just a single item return an array containing the item.
 * 
    Luc.Array.toArray()
    >[]
    Luc.Array.toArray(null)
    >[]
    Luc.Array.toArray(1)
    >[1]
    Luc.Array.toArray([1,2])
    >[1, 2]
 *
 * @param  {Object} item item to turn into an array.
 * @return the array
 */
function toArray(item) {
    if (Array.isArray(item)) {
        return item;
    }
    return (item === null || item === undefined) ? [] : [item];
}

/**
 * Return the last item of the array
 * @param  {Array} arr
 * @return {Object} the item
    
    var myLongArrayNameForThingsThatIWantToKeepTrackOf = [1,2,3]
    
    Luc.Array.last(myLongArrayNameForThingsThatIWantToKeepTrackOf);
    vs.
    myLongArrayNameForThingsThatIWantToKeepTrackOf[myLongArrayNameForThingsThatIWantToKeepTrackOf.length -1]
 *
 */
function last(arr) {
    return arr[arr.length -1];
}

/**
 * Flatten out an array of objects based of their value for the passed in key.
 * This also takes account for null/undefined values.
 *
    Luc.Array.pluck([undefined, {a:'1', b:2}, {b:3}, {b:4}], 'b')
    >[undefined, 2, 3, 4]
 * @param  {Object[]} arr 
 * @param  {String} key 
 * @return {Array}     
 */
function pluck(arr, key) {
    return arr.map(function(value) {
        return value && value[key];
    });
}

/**
 * Return the items in between the passed in index
 * and the end of the array.
 *
    Luc.Array.fromIndex([1,2,3,4,5], 1)
    >[2, 3, 4, 5]

 * @param  {Array/arguments} arr 
 * @param  {Number} index 
 * @return {Array} the new array.
 * 
 */
function fromIndex(a, index) {
    var arr = is.isArguments(a) ? arraySlice.call(a) : a;
    return arraySlice.call(arr, index, arr.length);
}

/**
 * Runs an Array.forEach after calling Luc.Array.toArray on the item.
  It is very useful for setting up flexible api's that can handle none one or many.

    Luc.Array.each(this.items, function(item) {
        this._addItem(item);
    });

    vs.

    if(Array.isArray(this.items)){
        this.items.forEach(function(item) {
            this._addItem(item);
        })
    }
    else if(this.items !== undefined) {
        this._addItem(this.items);
    }

 * @param  {Object}   item
 * @param  {Function} callback
 * @param  {Object}   thisArg   
 *
 */
function each(item, fn, thisArg) {
    var arr = toArray(item);
    return arr.forEach.call(arr, fn, thisArg);
}

/**
 * Insert or append the second array/arguments into the
 * first array/arguments.  This method does not alter
 * the passed in array/arguments.
 * 
 * @param  {Array/arguments} firstArrayOrArgs
 * @param  {Array/arguments} secondArrayOrArgs
 * @param  {Number/true} indexOrAppend true to append 
 * the second array to the end of the first one.  If it is a number
 * insert the secondArray into the first one at the passed in index.
 * @return {Array} the newly created array.
 *
    Luc.Array.insert([0,4], [1,2,3], 1);
    >[0, 1, 2, 3, 4]
    Luc.Array.insert([0,4], [1,2,3], true);
    >[0, 4, 1, 2, 3]
    Luc.Array.insert([0,4], [1,2,3], 0);
    >[1, 2, 3, 0, 4]
 *
 */
function insert(firstArrayOrArgs, secondArrayOrArgs, indexOrAppend) {
    var firstArray = arraySlice.call(firstArrayOrArgs),
        secondArray = arraySlice.call(secondArrayOrArgs),
        spliceArgs;

    if(indexOrAppend === true) {
        return firstArray.concat(secondArray);
    }

    spliceArgs = [indexOrAppend, 0].concat(secondArray);
    firstArray.splice.apply(firstArray, spliceArgs);
    return firstArray;
}

/**
 * Remove an item from the passed in arr
 * from the index.
 * @param  {Array} arr
 * @param  {Number} index
 * @return {Object} the item removed.
 *
    var arr = [1,2,3];
    Luc.Array.removeAtIndex(arr, 1);
    >2
    arr;
    >[1,3]

 */
function removeAtIndex(arr, index) {
    var item = arr[index];
    arr.splice(index, 1);
    return item;
}

function _removeFirst(arr, fn) {
    var removed = false;

    arr.some(function(value, index) {
        if (fn.apply(this, arguments)) {
            removed = removeAtIndex(arr, index);
            return true;
        }
    });

    return removed;
}

/**
 * Remove the first item from the passed in array
 * that {@link Luc#compare matches} the passed in object.  Instead of 
 * comparing an object an iterator function can be
 * used.
 * 
{copyDoc#arrParams}
{copyDoc#arrRemoveSingle}
 */
function removeFirst(arr, obj, config) {
    var fn = _createIteratorFn(obj, config);
    return _removeFirst(arr, fn);
}

/**
 * Remove the first item from the passed in array
 * that does not {@link Luc#compare match} the passed in object.  Instead of 
 * comparing an object an iterator function can be
 * used.
 * 
{copyDoc#arrParams}
{copyDoc#arrRemoveSingle}
 */
function removeFirstNot(arr, obj, config) {
    var fn = _createIteratorNotFn(obj, config);
    return _removeFirst(arr, fn);
}


function _removeAll(arr, fn) {
    var indexsToRemove = [],
        removed = [];

    arr.forEach(function(value, index) {
        if (fn.apply(this, arguments)) {
            indexsToRemove.unshift(index);
            removed.push(value);
        }
    });

    indexsToRemove.forEach(function(index){
        removeAtIndex(arr, index);
    });

    return removed;
}

/**
 * Remove the all the items from the passed in array
 * that do not {@link Luc#compare match} the passed in object.  Instead of 
 * comparing an object an iterator function can be
 * used.
 * 
{copyDoc#arrParams}
{copyDoc#arrRemoveAll}
 */
function removeAllNot(arr, obj, config) {
    var fn = _createIteratorNotFn(obj, config);
    return _removeAll(arr, fn);
}

/**
 * Remove the all the items from the passed in array
 * that {@link Luc#compare matches} the passed in object.  Instead of 
 * comparing an object an iterator function can be
 * used.
 * 
{copyDoc#arrParams}
{copyDoc#arrRemoveAll}
 */
function removeAll(arr, obj, config) {
    var fn = _createIteratorFn(obj, config);
    return _removeAll(arr, fn);
}

function _findFirst(arr, fn) {
    var item = false;
    arr.some(function(value, index) {
        if (fn.apply(this, arguments)) {
            item = arr[index];
            return true;
        }
    });

    return item;
}

/**
 * Find the first item from the passed in array
 * that does {@link Luc#compare matches} the passed in object.  Instead of 
 * comparing an object an iterator function can be
 * used.
 * 
{copyDoc#arrParams}
{copyDoc#arrFindSingle}
 */
function findFirst(arr, obj, config) {
    var fn = _createIteratorFn(obj, config);
    return _findFirst(arr, fn);
}

/**
 * Find the first item from the passed in array
 * that does not {@link Luc#compare match} the passed in object.  Instead of 
 * comparing an object an iterator function can be
 * used.
 * 
{copyDoc#arrParams}
{copyDoc#arrFindSingle}
 */
function findFirstNot(arr, obj, config) {
    var fn = _createIteratorNotFn(obj, config);
    return _findFirst(arr, fn);
}

function _findAll(arr, fn) {
    return arr.filter(fn);
}

/**
 * Find all of the the items from the passed in array
 * that {@link Luc#compare matches} the passed in object.  Instead of 
 * comparing an object an iterator function can be
 * used.
 * 
{copyDoc#arrParams}
{copyDoc#arrFindAll}
 */
function findAll(arr, obj, config) {
    var fn = _createIteratorFn(obj, config);
    return _findAll(arr, fn);
}

/**
 * Find all of the the items from the passed in array
 * that do not {@link Luc#compare match} the passed in object.  Instead of 
 * comparing an object an iterator function can be
 * used.
 * 
{copyDoc#arrParams}
{copyDoc#arrFindAll}
 */
function findAllNot(arr, obj, config) {
    var fn = _createIteratorNotFn(obj, config);
    return _findAll(arr, fn);
}


exports.toArray = toArray;
exports.each = each;
exports.insert = insert;
exports.fromIndex = fromIndex;
exports.last = last;
exports.pluck = pluck;

exports.removeAtIndex = removeAtIndex;
exports.findFirstNot = findFirstNot;
exports.findAllNot = findAllNot;
exports.findFirst = findFirst;
exports.findAll = findAll;

exports.removeFirstNot = removeFirstNot;
exports.removeAllNot = removeAllNot;
exports.removeFirst = removeFirst;
exports.removeAll = removeAll;

(function(){
    var _createLastFn = function(fnName) {
        var lastName = fnName.replace('First', 'Last');

        exports[lastName] = function(arr, obj, config) {
            var ret;

            arr.reverse();
            ret = exports[fnName](arr, obj, config);
            arr.reverse();

            return ret;
        };

    }, namesToAddLast = ['findFirstNot', 'findFirst', 'removeFirstNot', 'removeFirst'];

    namesToAddLast.forEach(function(fnName) {
        _createLastFn(fnName);
    });

}());

/**
 * @member Luc.Array 
 * @method findLastNot 
 * Same as Luc.Array.findFirstNot except start at the end.
 */

/**
 * @member Luc.Array 
 * @method findLast
 * Same as Luc.Array.findFirst except start at the end.
 */

/**
 * @member Luc.Array 
 * @method removeLastNot 
 * Same as Luc.Array.removeFirstNot except start at the end.
 */

/**
 * @member Luc.Array 
 * @method removeLast 
 * Same as Luc.Array.removeFirst except start at the end.
 */

},{"./compare":13,"./is":6}],5:[function(require,module,exports){
var array = require('./array'),
    is = require('./is'),
    Generator;

Generator = {
    arrayFnNames: ['findFirstNot', 'findAllNot', 'findFirst', 'findAll',
            'removeFirstNot', 'removeAllNot', 'removeFirst', 'removeAll',
            'removeLastNot', 'removeLast', 'findLast', 'findLastNot'
    ],

    createFn: function(arrayFnName, fn) {
        return function(arr) {
            return array[arrayFnName](arr, fn);
        };
    },

    createBoundFn: function(arrayFnName, fnToBind) {
        return function(arr, value) {
            var fn = fnToBind.apply(this, array.fromIndex(arguments, 1));
            return array[arrayFnName](arr, fn);
        };
    }
};

module.exports = Generator;

/**
 * @class Luc.ArrayFns
 * This is documented as a separate package but it actually exists under the 
 * Luc.Array namespace.  Check out the "Filter class members" input box
 * just to the right when searching for functions.
 *<br>
 * 
 * There are a lot of functions in this package but all of them 
 * follow the same api.  \*All functions will return an array of removed or found
 * items.  The items will be added to the array in the order they are
 * found.  \*First functions will return the first item and stop iterating after that, if none
 *  is found false is returned.  remove\* functions will directly change the passed in array.
 *  \*Not functions only do the following actions if the comparison is not true.
 *  \*Last functions do the same as their \*First counterparts except that the iterating
 *  starts at the end of the array. Almost every public method of Luc.is is available it
 *  uses the following grammar Luc.Array["methodName""isMethodName"]
 *
      Luc.Array.findAllNotEmpty([false, true, null, undefined, 0, '', [], [1]])
      > [true, 0, [1]]

      //Or remove all empty items
      var arr = ['', 0 , [], {a:1}, true, {}, [1]]
      Luc.Array.removeAllEmpty(arr)
      >['', [], {}]
      arr
      >[0, {a:1}, true, [1]]
     
      Luc.Array.findFirstNotString([1,2,3,'5'])
      >1
      var arr = [1,2,3,'5'];
      Luc.Array.removeAllNotString(arr);
      >[1,2,3]
      arr
      >["5"]
 *
 * As of right now there are two function sets which differ from the is
 * api.
 *
 * InstanceOf
 * 
    Luc.Array.findAllInstanceOf([1,2, new Date(), {}, []], Object)
    >[date, {}, []]
    >Luc.Array.findAllNotInstanceOf([1,2, new Date(), {}, []], Object)
    [1, 2]
 *
 * In
 * 
    Luc.Array.findAllIn([1,2,3], [1,2])
    >[1, 2]
    Luc.Array.findFirstIn([1,2,3], [1,2])
    >1

    //defaults to loose comparison
    Luc.Array.findAllIn([1,2,3, {a:1, b:2}], [1,{a:1}])
    > [1, {a:1,b:2}]

    Luc.Array.findAllIn([1,2,3, {a:1, b:2}], [1,{a:1}], {type: 'deep'})
    >[1]
 */

(function _createIsFns() {
    var isToIgnore = ['isRegExp', 'isArguments'];

    Object.keys(is).forEach(function(key) {
        var name = key.split('is')[1];
        Generator.arrayFnNames.forEach(function(fnName) {
            if(isToIgnore.indexOf(key) === -1) {
                array[fnName + name] = Generator.createFn(fnName, is[key]);
            }
        });
    });
}());

(function _createFalsyFns() {
    var usefullFalsyFns = ['findFirstNot', 'findAllNot', 'removeFirstNot', 'removeAllNot',
                            'removeFirst', 'removeAll', 'removeLastNot', 'removeLast',  'findLastNot'];

    var fns = {
        'False': function(val) {
            return val === false;
        },
        'True': function(val) {
            return val === true;
        },
        'Null': function(val) {
            return val === null;
        },
        'Undefined': function(val) {
            return val === undefined;
        }
    };

    Object.keys(fns).forEach(function(key) {
        usefullFalsyFns.forEach(function(fnName) {
            array[fnName + key] = Generator.createFn(fnName, fns[key]);
        });
    });
}());

(function _createBoundFns() {
    var fns = {
        'InstanceOf': function(Constructor) {
            return function(value) {
                return (value instanceof Constructor);
            };
        },'In': function(arr, c) {
            var defaultC = {type:'looseRight'};
            return function(value) {
                if(value !== false) {
                    var cfg = c || defaultC;
                    //this is a right to left comparison 
                    //expected loose behavior should be looseRight
                    return array.findFirst(arr, value, cfg.type === 'loose' ? defaultC : cfg) !== false;
                }
                
                return arr.indexOf(false) > -1;
            };
        }
    };

    Object.keys(fns).forEach(function(key) {
        Generator.arrayFnNames.forEach(function(fnName) {
            array[fnName + key] = Generator.createBoundFn(fnName, fns[key]);
        });
    });
}());
},{"./array":4,"./is":6}],13:[function(require,module,exports){
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

    if(!(is.isObject(val1) && is.isObject(val2))) {
        return false;
    }

    if(config.type === 'looseRight') {
        for (key in val2) {
            if (val2.hasOwnProperty(key)) {
                value = val2[key];
                if (compare(value, val1[key], config) !== true) {
                    return false;
                }
            }
        }
    }
    else {
        for (key in val1) {
            if (val1.hasOwnProperty(key)) {
                value = val1[key];
                if (compare(value, val2[key], config) !== true) {
                    return false;
                }
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

    if (type === 'deep' || type === 'loose' || type === 'looseRight' || type === undefined) {
        if (is.isObject(object)) {
            compareFn = type === 'loose' || type === 'looseRight' ? _looseObject : _deepObject;
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
 *  check if keys from val2 are equal to the keys in val1.
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

exports.compare = compare;
},{"./is":6}],7:[function(require,module,exports){
var emptyFn = require('../function').emptyFn,
    apply = require('../object').apply;

/**
 * @class Luc.Base
 * Simple class that by default {@link Luc#apply applies} the 
 * first argument to the instance and then calls
 * Luc.Base.init.
 *
    var b = new Luc.Base({
        a: 1,
        init: function() {
            console.log('hey')
        }
    })
    b.a
    >hey
    >1
 *
 * We found that most of our classes do this so we made
 * it the default.  Having a config object as the first and only 
 * param keeps a clean api as well.
 *
    var C = Luc.define({
        init: function() {
            Luc.Array.each(this.items, this.logItems)
        },

        logItems: function(item) {
            console.log(item);
        }
    });

    var c = new C({items: [1,2,3]});
    >1
    >2
    >3
    var d = new C({items: 'A'});
    >'A'
    var e = new C();
 *
 * If you don't like the applying of the config to the instance it 
 * can always be "disabled"
 *
    var NoApply = Luc.define({
        beforeInit: function() {

        },
        init: function() {
            Luc.Array.each(this.items, this.logItems)
        },

        logItems: function(item) {
            console.log(item);
        }
    });

    var c = new NoApply({items: [1,2,3]});
 * 
 */
function Base() {
    this.beforeInit.apply(this, arguments);
    this.init();
}

Base.prototype = {
    /**
     * By default apply the config to the 
     * instance.
     */
    beforeInit: function(config) {
        apply(this, config);
    },
    /**
     * @method
     * Simple hook to initialize
     * the class.  Defaults to Luc.emptyFn
     */
    init: emptyFn
};

module.exports = Base;
},{"../function":3,"../object":2}],9:[function(require,module,exports){
var Base = require('./base'),
    Composition = require('./composition'),
    obj = require('../object'),
    arrayFns = require('../array'),
    emptyFn = require('../function').emptyFn,
    is = require('../is'),
    aEach = arrayFns.each,
    apply = obj.apply,
    oEach = obj.each,
    oFilter = obj.filter,
    mix = obj.mix,
    arraySlice = Array.prototype.slice,
    ClassDefiner;

/**
 * @class Luc.ClassDefiner
 * @singleton
 *
 * Singleton that {@link Luc.define#define Luc.define} uses to define classes.  The defualt type can
 * be changed to any Constructor
 *
    function MyClass(){};
    Luc.ClassDefiner.defaultType = MyClass;
    var C = Luc.define();
    new C() instanceof Luc.Base
    >false
    new C() instanceof MyClass
    >true
 */

/**
 * @cfg {Function} defaultType this can be changed to any Constructor.  Defaults
 * to Luc.Base.
 */

ClassDefiner = {

    COMPOSITIONS_NAME: '$compositions',

    defaultType: Base,

    processorKeys: {
        $mixins: '_applyMixins',
        $statics: '_applyStatics',
        $compositions: '_applyComposerMethods',
        $super: '_applySuper'
    },

    define: function(opts, after) {
        var options = opts || {},
            //if super is a falsy value besides undefined that means no superclass
            Super = options.$super || (options.$super === undefined ? this.defaultType : false),
            afterDefine = after || emptyFn,
            Constructor;

        options.$super = Super;

        Constructor = this._createConstructor(options);

        this._processAfterCreate(Constructor, options);

        afterDefine.call(Constructor, Constructor);

        return Constructor;
    },

    _createConstructor: function(options) {
        var superclass = options.$super,
            Constructor = this._createConstructorFn(options);

        if(superclass) {
            Constructor.prototype = Object.create(superclass.prototype);
        }
        
        return Constructor;
    },

    _createConstructorFn: function(options) {
        var superclass = options.$super,
            Constructor;

        if (this._hasConstructorModifyingOptions(options)) {
            Constructor = this._createConstructorFromOptions(options);
        }
        else if(!superclass) {
            Constructor = function() {};
        }
        else {
            Constructor = function() {
                superclass.apply(this, arguments);
            };
        }

        return Constructor;
    },

    _hasConstructorModifyingOptions: function(options) {
        return options.$compositions;
    },

    _createConstructorFromOptions: function(options) {
        var superclass = options.$super,
            me = this,
            initBeforeSuperclass,
            initAfterSuperclass,
            init;

        if (!superclass) {
            init = this._createInitClassFn(options, {
                all: true
            });

            return function() {
                var args = arraySlice.call(arguments);
                init.call(this, options, args);
            };
        }

        initBeforeSuperclass = this._createInitClassFn(options, {
            before: true
        });

        initAfterSuperclass = this._createInitClassFn(options, {
            before: false
        });

        return function() {
            var args = arraySlice.call(arguments);

            initBeforeSuperclass.call(this, options, args);
            superclass.apply(this, arguments);
            initAfterSuperclass.call(this, options, args);
        };
    },

    _createInitClassFn: function(options, config) {
        var me = this,
            compositions = this._filterCompositions(config, options.$compositions);

        if(compositions.length === 0) {
            return emptyFn;
        }
        
        return function(options, instanceArgs) {
            me._initCompositions.call(this, compositions, instanceArgs);
        };
    },

    _filterCompositions: function(config, compositions) {
        var before = config.before, 
            filtered = [];

        if(config.all) {
            return compositions;
        }

        aEach(compositions, function(composition) {
            if(before && composition.initAfter !== true || (!before && composition.initAfter === true)) {
                    filtered.push(composition);
            }
        });

        return filtered;
    },

    _processAfterCreate: function($class, options) {
        this._applyValuesToProto($class, options);
        this._handlePostProcessors($class, options);
    },

    _applyValuesToProto: function($class, options) {
        var proto = $class.prototype,
            values = apply({
                $class: $class
            }, options);

        //Don't put the define specific properties
        //on the prototype
        oEach(values, function(key, value) {
            if (!this._getProcessorKey(key)) {
                proto[key] = value;
            }
        }, this);
    },

    _getProcessorKey: function(key) {
        return this.processorKeys[key];
    },

    _handlePostProcessors: function($class, options) {
        oEach(options, function(key, value) {
            var method = this._getProcessorKey(key);

            if (is.isFunction(this[method])) {
                this[method].call(this, $class, options[key]);
            }
        }, this);
    },

    _applyMixins: function($class, mixins) {
        var proto = $class.prototype;
        aEach(mixins, function(mixin) {
            //accept Constructors or Objects
            var toMix = mixin.prototype || mixin;
            mix(proto, toMix);
        });
    },

    _applyStatics: function($class, statics) {
        var prototype = $class.prototype;

        apply($class, statics);

        if(prototype.getStaticValue === undefined) {
            prototype.getStaticValue = this.getStaticValue;
        }
    },

    _applyComposerMethods: function($class, compositions) {
        var prototype = $class.prototype,
            methodsToCompose;

        aEach(compositions, function(compositionConfig) {
            var composition = new Composition(compositionConfig),
                name = composition.name,
                Constructor = composition.Constructor;

            composition.validate();

            methodsToCompose = composition.getMethodsToCompose();

            methodsToCompose.forEach(function(key) {
                if (prototype[key] === undefined) {
                    prototype[key] = this._createComposerProtoFn(key, name);
                }
            }, this);

            if(prototype.getComposition === undefined) {
                prototype.getComposition = this.getComposition;
            }

        }, this);
    },

    _applySuper: function($class, $super) {
        var proto;
        //super can be falsy to signify no superclass
        if ($super) {
            proto = $class.prototype;
            proto.$super = $super;
            proto.$superclass = $super.prototype;
        }
    },

    _createComposerProtoFn: function(methodName, compositionName) {
        return function() {
            var comp = this[ClassDefiner.COMPOSITIONS_NAME][compositionName];
            return comp[methodName].apply(comp, arguments);
        };
    },

    /**
     * @private
     * @ignore
     * options {Object} the composition config object
     * instanceArgs {Array} the arguments passed to the instance's
     * constructor.
     */
    _initCompositions: function(compositions, instanceArgs) {
        if(!this[ClassDefiner.COMPOSITIONS_NAME]) {
            this[ClassDefiner.COMPOSITIONS_NAME] = {};
        }

        aEach(compositions, function(compositionConfig) {
            var config = apply({
                instance: this,
                instanceArgs: instanceArgs
            }, compositionConfig), 
            composition;

            composition = new Composition(config);

            this[ClassDefiner.COMPOSITIONS_NAME][composition.name] = composition.getInstance();
        }, this);
    },

    //Methods that can get added to the prototype
    //they will be called in the context of the instance.
    //
    getComposition: function(key) {
        return this[ClassDefiner.COMPOSITIONS_NAME][key];
    },

    getStaticValue: function (key, $class) {
        var classToFindValue = $class || this.$class,
            $super,
            value;

        value = classToFindValue[key];

        if(value === undefined) {
            $super = classToFindValue.prototype.$super;
            if($super) {
                return this.getStaticValue(key, $super);
            }
        }

        return value;
    }

};

ClassDefiner.define = ClassDefiner.define.bind(ClassDefiner);

module.exports = ClassDefiner;

/**
 * @class  Luc.define
 * This is actually a function but has a decent amount of important options
 * so we are documenting it like it is a class.  Properties are things that will get
 * applied to instances of classes defined with {@link Luc.define#define define}.  None
 * are needed for {@link Luc.define#define defining} a class.  {@link Luc.define#define define}
 * just takes the passed in config and puts the properties on the prototype and returns
 * a Constructor.
 *

    var C = Luc.define({
        a: 1,
        doLog: true,
        logA: function() {
            if (this.doLog) {
                console.log(this.a);
            }
        }
    });
    var c = new C();
    c.logA();
    >1
    c.a = 45;
    c.logA();
    >45
    c.doLog = false;
    c.logA();

    new C().logA()
    >1

 *
 * Check out the following configs to add functionality to a class without messing
 * up the inheritance chain.  All the configs have examples and documentation on 
 * how to use them.
 *
 * {@link Luc.define#$super super} <br>
 * {@link Luc.define#$compositions compositions} <br>
 * {@link Luc.define#$mixins mixins} <br>
 * {@link Luc.define#$statics statics} <br>
 * 
 * 
 */

/**
 * @method  define
 * @param {Object} config config object used when creating the class.  Any property that
 * is not apart of the special configs will be applied to the prototype.  Check out
 * Luc.define for all the config options.   No configs are needed to define a class.
 *
 * @param {Function} afterDefine (optional) function to run after the Constructor has been created.
 * The first an only argument is the newly created Constructor.
 * 
 * @return {Function} the defined class
 *
    var C = Luc.define({
        logA: function() {
            console.log(this.a)
        },
        a: 1
    });
    var c = new C();
    c.logA();
    >1

    c.a = 4;
    c.logA();
    >4
 *
 *
 */

/**
 * @property {Function} $class reference to the instance's own constructor.  This
 * will get added to any class that is defined with Luc.define.
 * 
    var C = Luc.define()
    var c = new C()
    c.$class === C
    >true
 *
 * There are some really good use cases to have a reference to it's
 * own constructor.  <br> Add functionality to an instance in a simple
 * and generic way:
 *
    var C = Luc.define({
        add: function(a,b) {
            return a + b;
        }
    });

    //Luc.Base applies first 
    //arg to the instance

    var c = new C({
        add: function(a,b,c) {
            return this.$class.prototype.add.call(this, a,b) + c;
        }
    });

    c.add(1,2,3)
    >6
    new C().add(1,2,3)
    >3
 *
 * Or have a simple generic clone method :
 *
    var C = Luc.define({
        clone: function() {
            var myOwnProps = {};
            Luc.Object.each(this, function(key, value) {
                myOwnProps[key] = value;
            });

            return new this.$class(myOwnProps);
        }
    });

    var c = new C({a:1,b:2,c:3});
    c.d = 4;
    var clone = c.clone();

    clone === c
    >false

    clone.a
    >1
    clone.b
    >2
    clone.c
    >3
    clone.d
    >4
 */

/**
 * @property {Function} [$super] If $super is not false or null 
 * the $super property will be added to every instance of the defined class,
 * $super is the Constructor passed in with the $super config or the {@link Luc.ClassDefiner#defaultType default}
 * 
    var C = Luc.define()
    var c = new C()
    //Luc.Base is the default 
    c.$super === Luc.Base
    >true
 */

/**
 * @property {Function} [$superclass] If $super is defined it
 * will be the prototype of $super.  It can be used to call a parent's
 * method
 * 
    function MyCoolClass() {}
    MyCoolClass.prototype.addNums = function(a,b) {
        return a + b;
    }

    var MyOtherCoolClass = Luc.define({
        $super: MyCoolClass,
        addNums: function(a, b, c) {
            return this.$superclass.addNums.call(this, a, b) + c;
        }
    })

    var m = new MyOtherCoolClass();
    m.addNums(1,2,3);
    >6
 */

/**
 * @property {Function} getStaticValue this method
 * will be added to instances that use the {@link Luc.define#$statics $statics}
 * config.
 *
 * 
 * This should be used over this.$class.staticName to
 * get the value of static.  If the class gets inherited
 * from, this.$class will not be the same.  getStatic value
 * deals with this issue.
 * 
    var A = Luc.define({
        $statics: {
            a: 1
            },
        getABetter: function() {
            return this.getStaticValue('a');
        },
        getA: function() {
            return this.$class.a;
        }
    });

    var B = Luc.define({
        $super: A,
        $statics: {
            b: 2,
            c: 3
        }
    });

    
    var b = new B();
    b.getA();
    >undefined
    b.getABetter();
    >1

 * @return {Object} the static value of the key
 */

    
/**
 * @property {Function} getComposition this method will be added
 * to instances that use the {@link Luc.define#$compositions $compositions}  config
 *
 *  This will return the composition instance based off the composition {@link Luc.Composition#name name}
    
    this.getComposition("name");
    
 *
 */


/**
 * @cfg {Object} $statics (optional) Add static properties or methods
 * to the class.  These properties/methods will not be able to be
 * directly modified by the instance so they are good for defining default
 * configs.  Using this config adds the {@link Luc.define#getStaticValue getStaticValue}
 * method to instances.
 *
    var C = Luc.define({
        $statics: {
            number: 1
        }
    });

    var c = new C();
    c.number
    >undefined
    C.number
    >1
    
 *
 * Bad things can happen if non primitives are placed on the 
 * prototype and instance sharing is not wanted.  Using statics
 * prevent subclasses and instances from unknowingly modifying
 * all instances.
 * 
    var C = Luc.define({
        cfg: {
            a: 1
        }
    });

    var c = new C();
    c.cfg.a
    >1
    c.cfg.a = 5
    new C().cfg.a
    >5
 *
 */

/**
 * @property {Function} [$superclass] If $super is defined it
 * will be the prototype of $super.  It can be used to call parent's
 * method
 * 
    function MyCoolClass() {}
    MyCoolClass.prototype.addNums = function(a,b) {
        return a + b;
    }

    var MyOtherCoolClass = Luc.define({
        $super: MyCoolClass,
        addNums: function(a, b, c) {
            return this.$superclass.addNums.call(this, a, b) + c;
        }
    })

    var m = new MyOtherCoolClass();
    m.addNums(1,2,3);
    >6
 */

/**
 * @cfg {Object/Constructor/Object[]/Constructor[]} $mixins (optional)  Mixins are a way to add functionality
 * to a class that should not add state to the instance unknowingly.  Mixins can be either objects or Constructors.
 *
    function Logger() {}
    Logger.prototype.log = function() {
        console.log(arguments)
    }

    var C = Luc.define({
        $mixins: [Logger, {
            warn: function() {
                console.warn(arguments)
            }
        }]
    });

    var c = new C();

    c.log(1,2)
    >[1,2]

    c.warn(3,4)
    >[3,4]
 *
 */
/**
 * @cfg {Constructor} $super (optional)  super for the defining class.  By Luc.Base
 * is the default if super is not passed in.  To define a class without a superclass
 * you can pass in false or null.
 *
     function Counter() {
        this.count = 0;
     };

     Counter.prototype = {
        getCount: function() {
            return this.count;
        },
        increaseCount: function() {
            this.count++;
        }
     }

     var C = Luc.define({
        $super:Counter
    });

    var c = new C()

    c instanceof Counter
    >true
    c.increaseCount();
    c.getCount();
    >1
    c.count
    >1
 *
 * Check out Luc.Base to see why we have it as the default.
 * 
    var B = Luc.define({
        amIALucBase: function() {
            return this instanceof Luc.Base
        }
    })
    var b = new B();
    b.amIALucBase();
    >true
 *
 * 
 */



/**
 * @cfg {Object/Object[]} $compositions (optional) config objects for 
 * Luc.Composition.  Compositions are a great way to add behavior to a class
 * without extending it.  A {@link Luc.define#$mixins mixin} can offer similar functionality but should
 * not be adding an unneeded state.  A Constructor and a name are needed for the config object.
 *  Using this config adds the {@link Luc.define#getComposition getComposition}
 * method to instances.
 * <br>
 * The methods property is optional here but it is saying take all of 
 * Luc.EventEmitter's instance methods and make them instance methods for C.
 * You can check out all of the config options by looking at Luc.Composition.
 * 
        var C = Luc.define({
            $compositions: {
                Constructor: Luc.EventEmitter,
                name: 'emitter',
                methods: 'allMethods'
            }
        });

        var c = new C();

        c.on('hey', function() {
            console.log(arguments);
        });

        c.emit('hey', 1,2,3, 'a');
        >[1, 2, 3, "a"]
        c instanceof Luc.EventEmitter
        >false
        c._events
        >undefined
 *
 * Luc.EventEmitter is preferred as a composition over a mixin because
 * it adds a state "_events" to the this instance when on is called.  It
 * also shouldn't have to know that it may be instantiated alone or mixed into classes
 * so the initing of state is not done in the constructor like it probably should.
 * It is not terrible practice by any means but it is not good to have a standalone class
 * that knows that it may be mixin.  Even worse than that would be a mixin that needs
 * to be inited by the defining class.  Encapsulating logic in a class
 * and using it anywhere seamlessly is where compositions shine. Luc comes with two common 
 * {@link Luc#compositionEnums enums} that we expect will be used often.
 * 
 * <br>
 * Here is an example of a simple composition see how the functionality 
 * is added but we are not inheriting and this.count is
 * undefined.
 *
         function Counter() {
            this.count = 0;
         };

         Counter.prototype = {
            getCount: function() {
                return this.count;
            },
            increaseCount: function() {
                this.count++;
            }
         }

         var C = Luc.define({
                $compositions: {
                    name: 'counter',
                    Constructor: Counter,
                    methods: 'allMethods'
                }
        });

        var c = new C()

        c.increaseCount();
        c.increaseCount();
        c.increaseCount();
        c.getCount();
        >3
        c.count
        >undefined
 *
 * Luc comes with two default composition objects Luc.compositionEnums.PluginManager
 * and Luc.compositionEnums.EventEmitter.
 * 
 * Here is the plugin manager enum, keep in mind that this
 * functionality can be added to any class, not just ones defined with 
 * Luc.define.  Check out Luc.PluginManager to see all of the public 
 * methods that gets added to the defined instance.
 
 * A plugin follows the following life-cycle: <br>
    
 *plugin is added to the instance -> plugin is created -> plugin init is called with instance -> if needed destroy called by instance -> destroy called on plugin <br>
 *Here is the most basic example using the {@link Luc.Plugin default} plugin.
   
    var C = Luc.define({
        $compositions: Luc.compositionEnums.PluginManager
    });

    var c = new C({
        plugins: [{
                init: function() {
                    console.log('im getting initted')
                },
                myCoolName: 'cool'
            }
        ]
    });

    >im getting initted

    c.getPlugin({myCoolName: 'coo'}) instanceof Luc.Plugin
    > true

*  Plugins can be of any class and can be added with {@link Luc.PluginManager#addPlugin addPlugin}

    function MyPlugin(){}

    var C = Luc.define({
        $compositions: Luc.compositionEnums.PluginManager
    });

    var c = new C();

    c.addPlugin({Constructor: MyPlugin});
    //getPlugin takes a Constructor or match object
    c.getPlugin(MyPlugin) instanceof MyPlugin
    >true
    c.getPlugin(Luc.Plugin)
    >false

* Plugins can also be destroyed individually or all of them at once
    
    var C = Luc.define({
        $compositions: Luc.compositionEnums.PluginManager
    });

    var c = new C({
        plugins: [{
            init: function() {
                console.log('im getting initted ' + this.name)
            },
            destroy: function() {
                console.log('destroyed : ' + this.name)
            },
            name: '1'
        },{
            init: function() {
                console.log('im getting initted ' + this.name)
            },
            destroy: function() {
                console.log('destroyed : ' + this.name)
            },
            name: '2'
        }]
    });

    >im getting initted 1
    >im getting initted 2
    

    c.destroyPlugin({name: '1'});
    >destroyed : 1
    //a plugin is returned if it is found and destroyed
    >Plugin {init: function, destroy: function, name: "1", owner: Object, init: function…}

    c.destroyPlugin({name: '1'});
    //false is returned if it is not found
    >false

    c.destroyAllPlugins();
    >destroyed : 2
 *
 * You can see that it can add plugin like behavior to any defining
 * class with Luc.PluginManager which is less than 75 SLOC.
 */
},{"../array":4,"../function":3,"../is":6,"../object":2,"./base":7,"./composition":19}],10:[function(require,module,exports){
var aEach = require('../array').each,
    obj = require('../object'),
    emptyFn = require('../function').emptyFn,
    apply = obj.apply;

/**
 * @class Luc.Plugin
 * Simple class that is the default plugin type for Luc.PluginManager
 */
function Plugin(config) {
    apply(this, config);
}

Plugin.prototype = {
    /**
     * @method
     * @param {Object} owner the owner instance
     * Simple hook to initialize the plugin
     * Defaults to Luc.emptyFn.
     */
    init: emptyFn,
    /**
     * @method 
     * Defaults to Luc.emptyFn.
     * Called when the plugin is being {@link Luc.PluginManager#destroyPlugin destroyed}.
     */
    destroy: emptyFn
};

module.exports = Plugin;

},{"../array":4,"../function":3,"../object":2}],11:[function(require,module,exports){
var Plugin = require('./plugin'),
    is = require('../is'),
    obj = require('../object'),
    arr = require('../array'),
    aEach = arr.each,
    mix = obj.mix,
    apply = obj.apply;

function PluginManager(config) {
    this._init(config);
}

/**
 * @protected
 * @class Luc.PluginManager
 * This class is used by Luc.compositionEnums#PluginManager to add its functionality 
 * to any class.   By {@link Luc.compositionEnums#PluginManager default} it adds
 * all of these public methods to the instance.This class is designed to work as a composition, 
 * it is exposed as not private so it can be extended if needed.   Check "protected" which
 * is a part of the Show v dropdown on the right to see the protected methods.
 *
    function MyPlugin() {
        this.myCoolName = 'coo';

        this.init = function() {
            console.log('im getting initted');
        }
        this.destroy = function() {
            console.log('MyPlugin instance being destroyed')
        }
    }

    var C = Luc.define({
        $compositions: Luc.compositionEnums.PluginManager
    });

    var c = new C({
        plugins: [{
                Constructor: MyPlugin,
                myCoolName: 'coo'
            }
        ]
    });

    >im getting initted

    var plugInstance = c.addPlugin({
        destroy: function() {
            console.log('Im getting destroyed')
        }
    });

    c.getPlugin(Luc.Plugin)
    > Plugin {destroy: function, owner: MyClass, init: function, destroy: function}

    c.getPlugin(MyPlugin)
    > MyPlugin {myCoolName: "coo", init: function, destroy: function}

    c.destroyAllPlugins()

    >MyPlugin instance being destroyed
    >Im getting destroyed

    c.getPlugin(MyPlugin)
    >false

 */
PluginManager.prototype = {
   /**
    * @cfg {Constructor} defaultPlugin
    */
    defaultPlugin: Plugin,

    /**
     * @protected
     */
    _init: function(instanceValues) {
        apply(this, instanceValues);
        this.plugins = [];
        this._createPlugins();
    },

    /**
     * @protected
     */
    _createPlugins: function() {
        aEach(this._getPluginConfigFromInstance(), function(pluginConfig) {
            this.addPlugin(pluginConfig);
        }, this);
    },

    /**
     * @protected
     */
    _getPluginConfigFromInstance: function() {
        var config = this.instanceArgs[0] || {};
        return config.plugins;
    },

    /**
     * Add a plugin to the instance and init the 
     * plugin.
     * @param  {Object} pluginConfig
     * @return {Object} the created plugin instance
     */
    addPlugin: function(pluginConfig) {
        var pluginInstance = this._createPlugin(pluginConfig);

        this._initPlugin(pluginInstance);

        this.plugins.push(pluginInstance);

        return pluginInstance;
    },

    /**
     * @protected
     */
    _createPlugin: function(config) {
        config.owner = this.instance;

        if (config.Constructor) {
            //call the configed Constructor with the 
            //passed in config but take off the Constructor
            //config.
             
            //The plugin Constructor 
            //should not need to know about itself
            return new config.Constructor(apply(config, {
                Constructor: undefined
            }));
        }

        return new this.defaultPlugin(config);
    },

    /**
     * @protected
     */
    _initPlugin: function(plugin) {
        if (is.isFunction(plugin.init)) {
            plugin.init(this.instance);
        }
    },

    /**
     * Call destroy on all of the plugins
     * and remove them.
     */
    destroyAllPlugins: function() {
        this.plugins.forEach(function(plugin) {
            this._destroyPlugin(plugin);
        }, this);

        this.plugins = [];
    },

    _destroyPlugin: function(plugin) {
        if (is.isFunction(plugin.destroy)) {
            plugin.destroy(this.instance);
        }
    },

    /**
     * Remove the plugin and if found destroy it.
     * @param  {Object/Constructor} object to use to match 
     * the plugin to remove.
     * @return {Object} the destroyed plugin.
     */
    destroyPlugin: function(obj) {
        var plugin = this.getPlugin(obj);

        if(plugin) {
            this._destroyPlugin(plugin);
            arr.removeFirst(this.plugins, plugin, {type: 'strict'});
        }

        return plugin;
    },

    /**
     * Get a plugin instance.  A Constructor or an object can be used
     * to find a plugin.
     *
          c.addPlugin({a:1})
          c.getPlugin({a:1})
          >Luc.Plugin({a:1})

     * @param  {Object} obj 
     * @return {Object} the plugin instance if found.
     */
    getPlugin: function(obj) {
        if (is.isFunction(obj)) {
            return arr.findFirstInstanceOf(this.plugins, obj);
        }
        return arr.findFirst(this.plugins, obj, {type: 'loose'});
    }
};

module.exports = PluginManager;
},{"../array":4,"../is":6,"../object":2,"./plugin":10}],12:[function(require,module,exports){
var EventEmitter = require('../events/eventEmitter'),
    PluginManager = require('./pluginManager');

/**
 * @class Luc.compositionEnums
 * Composition enums are just common config objects for Luc.Composition.
 * Here is an example of a composition that uses EventEmitter but only
 * puts the emit method on the prototype.
 *
    var C = Luc.define({
        $compositions: {
            defaults: Luc.compositionEnums.EventEmitter,
            methods: ['emit']
        }
    });

    var c = new C();

    typeof c.emit
    >"function"
    typeof c.on
    "undefined"
 * 
 */

/**
 * @property {Object} EventEmitter
 */
module.exports.EventEmitter = {
    Constructor: EventEmitter,
    name: 'emitter',
    methods: 'allMethods'
};


/**
 * @property {Object} PluginManager
 */
module.exports.PluginManager = {
    name: 'plugins',
    initAfter: true,
    Constructor: PluginManager,
    create: function() {
        return new this.Constructor({
            instance: this.instance,
            instanceArgs: this.instanceArgs
        });
    },
    ignoreMethods: 'defaultPlugin',
    methods: 'publicMethods'
};
},{"../events/eventEmitter":8,"./pluginManager":11}],17:[function(require,module,exports){
// Copyright 2009-2012 by contributors, MIT License
// vim: ts=4 sts=4 sw=4 expandtab

// Module systems magic dance
(function (definition) {
    // RequireJS
    if (typeof define == "function") {
        define(definition);
    // YUI3
    } else if (typeof YUI == "function") {
        YUI.add("es5", definition);
    // CommonJS and <script>
    } else {
        definition();
    }
})(function () {

/**
 * Brings an environment as close to ECMAScript 5 compliance
 * as is possible with the facilities of erstwhile engines.
 *
 * Annotated ES5: http://es5.github.com/ (specific links below)
 * ES5 Spec: http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf
 * Required reading: http://javascriptweblog.wordpress.com/2011/12/05/extending-javascript-natives/
 */

//
// Function
// ========
//

// ES-5 15.3.4.5
// http://es5.github.com/#x15.3.4.5

function Empty() {}

if (!Function.prototype.bind) {
    Function.prototype.bind = function bind(that) { // .length is 1
        // 1. Let Target be the this value.
        var target = this;
        // 2. If IsCallable(Target) is false, throw a TypeError exception.
        if (typeof target != "function") {
            throw new TypeError("Function.prototype.bind called on incompatible " + target);
        }
        // 3. Let A be a new (possibly empty) internal list of all of the
        //   argument values provided after thisArg (arg1, arg2 etc), in order.
        // XXX slicedArgs will stand in for "A" if used
        var args = _Array_slice_.call(arguments, 1); // for normal call
        // 4. Let F be a new native ECMAScript object.
        // 11. Set the [[Prototype]] internal property of F to the standard
        //   built-in Function prototype object as specified in 15.3.3.1.
        // 12. Set the [[Call]] internal property of F as described in
        //   15.3.4.5.1.
        // 13. Set the [[Construct]] internal property of F as described in
        //   15.3.4.5.2.
        // 14. Set the [[HasInstance]] internal property of F as described in
        //   15.3.4.5.3.
        var bound = function () {

            if (this instanceof bound) {
                // 15.3.4.5.2 [[Construct]]
                // When the [[Construct]] internal method of a function object,
                // F that was created using the bind function is called with a
                // list of arguments ExtraArgs, the following steps are taken:
                // 1. Let target be the value of F's [[TargetFunction]]
                //   internal property.
                // 2. If target has no [[Construct]] internal method, a
                //   TypeError exception is thrown.
                // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
                //   property.
                // 4. Let args be a new list containing the same values as the
                //   list boundArgs in the same order followed by the same
                //   values as the list ExtraArgs in the same order.
                // 5. Return the result of calling the [[Construct]] internal
                //   method of target providing args as the arguments.

                var result = target.apply(
                    this,
                    args.concat(_Array_slice_.call(arguments))
                );
                if (Object(result) === result) {
                    return result;
                }
                return this;

            } else {
                // 15.3.4.5.1 [[Call]]
                // When the [[Call]] internal method of a function object, F,
                // which was created using the bind function is called with a
                // this value and a list of arguments ExtraArgs, the following
                // steps are taken:
                // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
                //   property.
                // 2. Let boundThis be the value of F's [[BoundThis]] internal
                //   property.
                // 3. Let target be the value of F's [[TargetFunction]] internal
                //   property.
                // 4. Let args be a new list containing the same values as the
                //   list boundArgs in the same order followed by the same
                //   values as the list ExtraArgs in the same order.
                // 5. Return the result of calling the [[Call]] internal method
                //   of target providing boundThis as the this value and
                //   providing args as the arguments.

                // equiv: target.call(this, ...boundArgs, ...args)
                return target.apply(
                    that,
                    args.concat(_Array_slice_.call(arguments))
                );

            }

        };
        if(target.prototype) {
            Empty.prototype = target.prototype;
            bound.prototype = new Empty();
            // Clean up dangling references.
            Empty.prototype = null;
        }
        // XXX bound.length is never writable, so don't even try
        //
        // 15. If the [[Class]] internal property of Target is "Function", then
        //     a. Let L be the length property of Target minus the length of A.
        //     b. Set the length own property of F to either 0 or L, whichever is
        //       larger.
        // 16. Else set the length own property of F to 0.
        // 17. Set the attributes of the length own property of F to the values
        //   specified in 15.3.5.1.

        // TODO
        // 18. Set the [[Extensible]] internal property of F to true.

        // TODO
        // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
        // 20. Call the [[DefineOwnProperty]] internal method of F with
        //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
        //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
        //   false.
        // 21. Call the [[DefineOwnProperty]] internal method of F with
        //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
        //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
        //   and false.

        // TODO
        // NOTE Function objects created using Function.prototype.bind do not
        // have a prototype property or the [[Code]], [[FormalParameters]], and
        // [[Scope]] internal properties.
        // XXX can't delete prototype in pure-js.

        // 22. Return F.
        return bound;
    };
}

// Shortcut to an often accessed properties, in order to avoid multiple
// dereference that costs universally.
// _Please note: Shortcuts are defined after `Function.prototype.bind` as we
// us it in defining shortcuts.
var call = Function.prototype.call;
var prototypeOfArray = Array.prototype;
var prototypeOfObject = Object.prototype;
var _Array_slice_ = prototypeOfArray.slice;
// Having a toString local variable name breaks in Opera so use _toString.
var _toString = call.bind(prototypeOfObject.toString);
var owns = call.bind(prototypeOfObject.hasOwnProperty);

// If JS engine supports accessors creating shortcuts.
var defineGetter;
var defineSetter;
var lookupGetter;
var lookupSetter;
var supportsAccessors;
if ((supportsAccessors = owns(prototypeOfObject, "__defineGetter__"))) {
    defineGetter = call.bind(prototypeOfObject.__defineGetter__);
    defineSetter = call.bind(prototypeOfObject.__defineSetter__);
    lookupGetter = call.bind(prototypeOfObject.__lookupGetter__);
    lookupSetter = call.bind(prototypeOfObject.__lookupSetter__);
}

//
// Array
// =====
//

// ES5 15.4.4.12
// http://es5.github.com/#x15.4.4.12
// Default value for second param
// [bugfix, ielt9, old browsers]
// IE < 9 bug: [1,2].splice(0).join("") == "" but should be "12"
if ([1,2].splice(0).length != 2) {
    var array_splice = Array.prototype.splice;

    if(function() { // test IE < 9 to splice bug - see issue #138
        function makeArray(l) {
            var a = [];
            while (l--) {
                a.unshift(l)
            }
            return a
        }

        var array = []
            , lengthBefore
        ;

        array.splice.bind(array, 0, 0).apply(null, makeArray(20));
        array.splice.bind(array, 0, 0).apply(null, makeArray(26));

        lengthBefore = array.length; //20
        array.splice(5, 0, "XXX"); // add one element

        if(lengthBefore + 1 == array.length) {
            return true;// has right splice implementation without bugs
        }
        // else {
        //    IE8 bug
        // }
    }()) {//IE 6/7
        Array.prototype.splice = function(start, deleteCount) {
            if (!arguments.length) {
                return [];
            } else {
                return array_splice.apply(this, [
                    start === void 0 ? 0 : start,
                    deleteCount === void 0 ? (this.length - start) : deleteCount
                ].concat(_Array_slice_.call(arguments, 2)))
            }
        };
    }
    else {//IE8
        Array.prototype.splice = function(start, deleteCount) {
            var result
                , args = _Array_slice_.call(arguments, 2)
                , addElementsCount = args.length
            ;

            if(!arguments.length) {
                return [];
            }

            if(start === void 0) { // default
                start = 0;
            }
            if(deleteCount === void 0) { // default
                deleteCount = this.length - start;
            }

            if(addElementsCount > 0) {
                if(deleteCount <= 0) {
                    if(start == this.length) { // tiny optimisation #1
                        this.push.apply(this, args);
                        return [];
                    }

                    if(start == 0) { // tiny optimisation #2
                        this.unshift.apply(this, args);
                        return [];
                    }
                }

                // Array.prototype.splice implementation
                result = _Array_slice_.call(this, start, start + deleteCount);// delete part
                args.push.apply(args, _Array_slice_.call(this, start + deleteCount, this.length));// right part
                args.unshift.apply(args, _Array_slice_.call(this, 0, start));// left part

                // delete all items from this array and replace it to 'left part' + _Array_slice_.call(arguments, 2) + 'right part'
                args.unshift(0, this.length);

                array_splice.apply(this, args);

                return result;
            }

            return array_splice.call(this, start, deleteCount);
        }

    }
}

// ES5 15.4.4.12
// http://es5.github.com/#x15.4.4.13
// Return len+argCount.
// [bugfix, ielt8]
// IE < 8 bug: [].unshift(0) == undefined but should be "1"
if ([].unshift(0) != 1) {
    var array_unshift = Array.prototype.unshift;
    Array.prototype.unshift = function() {
        array_unshift.apply(this, arguments);
        return this.length;
    };
}

// ES5 15.4.3.2
// http://es5.github.com/#x15.4.3.2
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
if (!Array.isArray) {
    Array.isArray = function isArray(obj) {
        return _toString(obj) == "[object Array]";
    };
}

// The IsCallable() check in the Array functions
// has been replaced with a strict check on the
// internal class of the object to trap cases where
// the provided function was actually a regular
// expression literal, which in V8 and
// JavaScriptCore is a typeof "function".  Only in
// V8 are regular expression literals permitted as
// reduce parameters, so it is desirable in the
// general case for the shim to match the more
// strict and common behavior of rejecting regular
// expressions.

// ES5 15.4.4.18
// http://es5.github.com/#x15.4.4.18
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/forEach

// Check failure of by-index access of string characters (IE < 9)
// and failure of `0 in boxedString` (Rhino)
var boxedString = Object("a"),
    splitString = boxedString[0] != "a" || !(0 in boxedString);

if (!Array.prototype.forEach) {
    Array.prototype.forEach = function forEach(fun /*, thisp*/) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            thisp = arguments[1],
            i = -1,
            length = self.length >>> 0;

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(); // TODO message
        }

        while (++i < length) {
            if (i in self) {
                // Invoke the callback function with call, passing arguments:
                // context, property value, property key, thisArg object
                // context
                fun.call(thisp, self[i], i, object);
            }
        }
    };
}

// ES5 15.4.4.19
// http://es5.github.com/#x15.4.4.19
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/map
if (!Array.prototype.map) {
    Array.prototype.map = function map(fun /*, thisp*/) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            length = self.length >>> 0,
            result = Array(length),
            thisp = arguments[1];

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
            if (i in self)
                result[i] = fun.call(thisp, self[i], i, object);
        }
        return result;
    };
}

// ES5 15.4.4.20
// http://es5.github.com/#x15.4.4.20
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/filter
if (!Array.prototype.filter) {
    Array.prototype.filter = function filter(fun /*, thisp */) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                    object,
            length = self.length >>> 0,
            result = [],
            value,
            thisp = arguments[1];

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
            if (i in self) {
                value = self[i];
                if (fun.call(thisp, value, i, object)) {
                    result.push(value);
                }
            }
        }
        return result;
    };
}

// ES5 15.4.4.16
// http://es5.github.com/#x15.4.4.16
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every
if (!Array.prototype.every) {
    Array.prototype.every = function every(fun /*, thisp */) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            length = self.length >>> 0,
            thisp = arguments[1];

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
            if (i in self && !fun.call(thisp, self[i], i, object)) {
                return false;
            }
        }
        return true;
    };
}

// ES5 15.4.4.17
// http://es5.github.com/#x15.4.4.17
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some
if (!Array.prototype.some) {
    Array.prototype.some = function some(fun /*, thisp */) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            length = self.length >>> 0,
            thisp = arguments[1];

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
            if (i in self && fun.call(thisp, self[i], i, object)) {
                return true;
            }
        }
        return false;
    };
}

// ES5 15.4.4.21
// http://es5.github.com/#x15.4.4.21
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduce
if (!Array.prototype.reduce) {
    Array.prototype.reduce = function reduce(fun /*, initial*/) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            length = self.length >>> 0;

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        // no value to return if no initial value and an empty array
        if (!length && arguments.length == 1) {
            throw new TypeError("reduce of empty array with no initial value");
        }

        var i = 0;
        var result;
        if (arguments.length >= 2) {
            result = arguments[1];
        } else {
            do {
                if (i in self) {
                    result = self[i++];
                    break;
                }

                // if array contains no values, no initial value to return
                if (++i >= length) {
                    throw new TypeError("reduce of empty array with no initial value");
                }
            } while (true);
        }

        for (; i < length; i++) {
            if (i in self) {
                result = fun.call(void 0, result, self[i], i, object);
            }
        }

        return result;
    };
}

// ES5 15.4.4.22
// http://es5.github.com/#x15.4.4.22
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduceRight
if (!Array.prototype.reduceRight) {
    Array.prototype.reduceRight = function reduceRight(fun /*, initial*/) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            length = self.length >>> 0;

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        // no value to return if no initial value, empty array
        if (!length && arguments.length == 1) {
            throw new TypeError("reduceRight of empty array with no initial value");
        }

        var result, i = length - 1;
        if (arguments.length >= 2) {
            result = arguments[1];
        } else {
            do {
                if (i in self) {
                    result = self[i--];
                    break;
                }

                // if array contains no values, no initial value to return
                if (--i < 0) {
                    throw new TypeError("reduceRight of empty array with no initial value");
                }
            } while (true);
        }

        if (i < 0) {
            return result;
        }

        do {
            if (i in this) {
                result = fun.call(void 0, result, self[i], i, object);
            }
        } while (i--);

        return result;
    };
}

// ES5 15.4.4.14
// http://es5.github.com/#x15.4.4.14
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
if (!Array.prototype.indexOf || ([0, 1].indexOf(1, 2) != -1)) {
    Array.prototype.indexOf = function indexOf(sought /*, fromIndex */ ) {
        var self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                toObject(this),
            length = self.length >>> 0;

        if (!length) {
            return -1;
        }

        var i = 0;
        if (arguments.length > 1) {
            i = toInteger(arguments[1]);
        }

        // handle negative indices
        i = i >= 0 ? i : Math.max(0, length + i);
        for (; i < length; i++) {
            if (i in self && self[i] === sought) {
                return i;
            }
        }
        return -1;
    };
}

// ES5 15.4.4.15
// http://es5.github.com/#x15.4.4.15
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/lastIndexOf
if (!Array.prototype.lastIndexOf || ([0, 1].lastIndexOf(0, -3) != -1)) {
    Array.prototype.lastIndexOf = function lastIndexOf(sought /*, fromIndex */) {
        var self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                toObject(this),
            length = self.length >>> 0;

        if (!length) {
            return -1;
        }
        var i = length - 1;
        if (arguments.length > 1) {
            i = Math.min(i, toInteger(arguments[1]));
        }
        // handle negative indices
        i = i >= 0 ? i : length - Math.abs(i);
        for (; i >= 0; i--) {
            if (i in self && sought === self[i]) {
                return i;
            }
        }
        return -1;
    };
}

//
// Object
// ======
//

// ES5 15.2.3.14
// http://es5.github.com/#x15.2.3.14
if (!Object.keys) {
    // http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
    var hasDontEnumBug = true,
        dontEnums = [
            "toString",
            "toLocaleString",
            "valueOf",
            "hasOwnProperty",
            "isPrototypeOf",
            "propertyIsEnumerable",
            "constructor"
        ],
        dontEnumsLength = dontEnums.length;

    for (var key in {"toString": null}) {
        hasDontEnumBug = false;
    }

    Object.keys = function keys(object) {

        if (
            (typeof object != "object" && typeof object != "function") ||
            object === null
        ) {
            throw new TypeError("Object.keys called on a non-object");
        }

        var keys = [];
        for (var name in object) {
            if (owns(object, name)) {
                keys.push(name);
            }
        }

        if (hasDontEnumBug) {
            for (var i = 0, ii = dontEnumsLength; i < ii; i++) {
                var dontEnum = dontEnums[i];
                if (owns(object, dontEnum)) {
                    keys.push(dontEnum);
                }
            }
        }
        return keys;
    };

}

//
// Date
// ====
//

// ES5 15.9.5.43
// http://es5.github.com/#x15.9.5.43
// This function returns a String value represent the instance in time
// represented by this Date object. The format of the String is the Date Time
// string format defined in 15.9.1.15. All fields are present in the String.
// The time zone is always UTC, denoted by the suffix Z. If the time value of
// this object is not a finite Number a RangeError exception is thrown.
var negativeDate = -62198755200000,
    negativeYearString = "-000001";
if (
    !Date.prototype.toISOString ||
    (new Date(negativeDate).toISOString().indexOf(negativeYearString) === -1)
) {
    Date.prototype.toISOString = function toISOString() {
        var result, length, value, year, month;
        if (!isFinite(this)) {
            throw new RangeError("Date.prototype.toISOString called on non-finite value.");
        }

        year = this.getUTCFullYear();

        month = this.getUTCMonth();
        // see https://github.com/kriskowal/es5-shim/issues/111
        year += Math.floor(month / 12);
        month = (month % 12 + 12) % 12;

        // the date time string format is specified in 15.9.1.15.
        result = [month + 1, this.getUTCDate(),
            this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds()];
        year = (
            (year < 0 ? "-" : (year > 9999 ? "+" : "")) +
            ("00000" + Math.abs(year))
            .slice(0 <= year && year <= 9999 ? -4 : -6)
        );

        length = result.length;
        while (length--) {
            value = result[length];
            // pad months, days, hours, minutes, and seconds to have two
            // digits.
            if (value < 10) {
                result[length] = "0" + value;
            }
        }
        // pad milliseconds to have three digits.
        return (
            year + "-" + result.slice(0, 2).join("-") +
            "T" + result.slice(2).join(":") + "." +
            ("000" + this.getUTCMilliseconds()).slice(-3) + "Z"
        );
    };
}


// ES5 15.9.5.44
// http://es5.github.com/#x15.9.5.44
// This function provides a String representation of a Date object for use by
// JSON.stringify (15.12.3).
var dateToJSONIsSupported = false;
try {
    dateToJSONIsSupported = (
        Date.prototype.toJSON &&
        new Date(NaN).toJSON() === null &&
        new Date(negativeDate).toJSON().indexOf(negativeYearString) !== -1 &&
        Date.prototype.toJSON.call({ // generic
            toISOString: function () {
                return true;
            }
        })
    );
} catch (e) {
}
if (!dateToJSONIsSupported) {
    Date.prototype.toJSON = function toJSON(key) {
        // When the toJSON method is called with argument key, the following
        // steps are taken:

        // 1.  Let O be the result of calling ToObject, giving it the this
        // value as its argument.
        // 2. Let tv be toPrimitive(O, hint Number).
        var o = Object(this),
            tv = toPrimitive(o),
            toISO;
        // 3. If tv is a Number and is not finite, return null.
        if (typeof tv === "number" && !isFinite(tv)) {
            return null;
        }
        // 4. Let toISO be the result of calling the [[Get]] internal method of
        // O with argument "toISOString".
        toISO = o.toISOString;
        // 5. If IsCallable(toISO) is false, throw a TypeError exception.
        if (typeof toISO != "function") {
            throw new TypeError("toISOString property is not callable");
        }
        // 6. Return the result of calling the [[Call]] internal method of
        //  toISO with O as the this value and an empty argument list.
        return toISO.call(o);

        // NOTE 1 The argument is ignored.

        // NOTE 2 The toJSON function is intentionally generic; it does not
        // require that its this value be a Date object. Therefore, it can be
        // transferred to other kinds of objects for use as a method. However,
        // it does require that any such object have a toISOString method. An
        // object is free to use the argument key to filter its
        // stringification.
    };
}

// ES5 15.9.4.2
// http://es5.github.com/#x15.9.4.2
// based on work shared by Daniel Friesen (dantman)
// http://gist.github.com/303249
if (!Date.parse || "Date.parse is buggy") {
    // XXX global assignment won't work in embeddings that use
    // an alternate object for the context.
    Date = (function(NativeDate) {

        // Date.length === 7
        function Date(Y, M, D, h, m, s, ms) {
            var length = arguments.length;
            if (this instanceof NativeDate) {
                var date = length == 1 && String(Y) === Y ? // isString(Y)
                    // We explicitly pass it through parse:
                    new NativeDate(Date.parse(Y)) :
                    // We have to manually make calls depending on argument
                    // length here
                    length >= 7 ? new NativeDate(Y, M, D, h, m, s, ms) :
                    length >= 6 ? new NativeDate(Y, M, D, h, m, s) :
                    length >= 5 ? new NativeDate(Y, M, D, h, m) :
                    length >= 4 ? new NativeDate(Y, M, D, h) :
                    length >= 3 ? new NativeDate(Y, M, D) :
                    length >= 2 ? new NativeDate(Y, M) :
                    length >= 1 ? new NativeDate(Y) :
                                  new NativeDate();
                // Prevent mixups with unfixed Date object
                date.constructor = Date;
                return date;
            }
            return NativeDate.apply(this, arguments);
        };

        // 15.9.1.15 Date Time String Format.
        var isoDateExpression = new RegExp("^" +
            "(\\d{4}|[\+\-]\\d{6})" + // four-digit year capture or sign +
                                      // 6-digit extended year
            "(?:-(\\d{2})" + // optional month capture
            "(?:-(\\d{2})" + // optional day capture
            "(?:" + // capture hours:minutes:seconds.milliseconds
                "T(\\d{2})" + // hours capture
                ":(\\d{2})" + // minutes capture
                "(?:" + // optional :seconds.milliseconds
                    ":(\\d{2})" + // seconds capture
                    "(?:(\\.\\d{1,}))?" + // milliseconds capture
                ")?" +
            "(" + // capture UTC offset component
                "Z|" + // UTC capture
                "(?:" + // offset specifier +/-hours:minutes
                    "([-+])" + // sign capture
                    "(\\d{2})" + // hours offset capture
                    ":(\\d{2})" + // minutes offset capture
                ")" +
            ")?)?)?)?" +
        "$");

        var months = [
            0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365
        ];

        function dayFromMonth(year, month) {
            var t = month > 1 ? 1 : 0;
            return (
                months[month] +
                Math.floor((year - 1969 + t) / 4) -
                Math.floor((year - 1901 + t) / 100) +
                Math.floor((year - 1601 + t) / 400) +
                365 * (year - 1970)
            );
        }

        // Copy any custom methods a 3rd party library may have added
        for (var key in NativeDate) {
            Date[key] = NativeDate[key];
        }

        // Copy "native" methods explicitly; they may be non-enumerable
        Date.now = NativeDate.now;
        Date.UTC = NativeDate.UTC;
        Date.prototype = NativeDate.prototype;
        Date.prototype.constructor = Date;

        // Upgrade Date.parse to handle simplified ISO 8601 strings
        Date.parse = function parse(string) {
            var match = isoDateExpression.exec(string);
            if (match) {
                // parse months, days, hours, minutes, seconds, and milliseconds
                // provide default values if necessary
                // parse the UTC offset component
                var year = Number(match[1]),
                    month = Number(match[2] || 1) - 1,
                    day = Number(match[3] || 1) - 1,
                    hour = Number(match[4] || 0),
                    minute = Number(match[5] || 0),
                    second = Number(match[6] || 0),
                    millisecond = Math.floor(Number(match[7] || 0) * 1000),
                    // When time zone is missed, local offset should be used
                    // (ES 5.1 bug)
                    // see https://bugs.ecmascript.org/show_bug.cgi?id=112
                    offset = !match[4] || match[8] ?
                        0 : Number(new NativeDate(1970, 0)),
                    signOffset = match[9] === "-" ? 1 : -1,
                    hourOffset = Number(match[10] || 0),
                    minuteOffset = Number(match[11] || 0),
                    result;
                if (
                    hour < (
                        minute > 0 || second > 0 || millisecond > 0 ?
                        24 : 25
                    ) &&
                    minute < 60 && second < 60 && millisecond < 1000 &&
                    month > -1 && month < 12 && hourOffset < 24 &&
                    minuteOffset < 60 && // detect invalid offsets
                    day > -1 &&
                    day < (
                        dayFromMonth(year, month + 1) -
                        dayFromMonth(year, month)
                    )
                ) {
                    result = (
                        (dayFromMonth(year, month) + day) * 24 +
                        hour +
                        hourOffset * signOffset
                    ) * 60;
                    result = (
                        (result + minute + minuteOffset * signOffset) * 60 +
                        second
                    ) * 1000 + millisecond + offset;
                    if (-8.64e15 <= result && result <= 8.64e15) {
                        return result;
                    }
                }
                return NaN;
            }
            return NativeDate.parse.apply(this, arguments);
        };

        return Date;
    })(Date);
}

// ES5 15.9.4.4
// http://es5.github.com/#x15.9.4.4
if (!Date.now) {
    Date.now = function now() {
        return new Date().getTime();
    };
}


//
// Number
// ======
//

// ES5.1 15.7.4.5
// http://es5.github.com/#x15.7.4.5
if (!Number.prototype.toFixed || (0.00008).toFixed(3) !== '0.000' || (0.9).toFixed(0) === '0' || (1.255).toFixed(2) !== '1.25' || (1000000000000000128).toFixed(0) !== "1000000000000000128") {
    // Hide these variables and functions
    (function () {
        var base, size, data, i;

        base = 1e7;
        size = 6;
        data = [0, 0, 0, 0, 0, 0];

        function multiply(n, c) {
            var i = -1;
            while (++i < size) {
                c += n * data[i];
                data[i] = c % base;
                c = Math.floor(c / base);
            }
        }

        function divide(n) {
            var i = size, c = 0;
            while (--i >= 0) {
                c += data[i];
                data[i] = Math.floor(c / n);
                c = (c % n) * base;
            }
        }

        function toString() {
            var i = size;
            var s = '';
            while (--i >= 0) {
                if (s !== '' || i === 0 || data[i] !== 0) {
                    var t = String(data[i]);
                    if (s === '') {
                        s = t;
                    } else {
                        s += '0000000'.slice(0, 7 - t.length) + t;
                    }
                }
            }
            return s;
        }

        function pow(x, n, acc) {
            return (n === 0 ? acc : (n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc)));
        }

        function log(x) {
            var n = 0;
            while (x >= 4096) {
                n += 12;
                x /= 4096;
            }
            while (x >= 2) {
                n += 1;
                x /= 2;
            }
            return n;
        }

        Number.prototype.toFixed = function (fractionDigits) {
            var f, x, s, m, e, z, j, k;

            // Test for NaN and round fractionDigits down
            f = Number(fractionDigits);
            f = f !== f ? 0 : Math.floor(f);

            if (f < 0 || f > 20) {
                throw new RangeError("Number.toFixed called with invalid number of decimals");
            }

            x = Number(this);

            // Test for NaN
            if (x !== x) {
                return "NaN";
            }

            // If it is too big or small, return the string value of the number
            if (x <= -1e21 || x >= 1e21) {
                return String(x);
            }

            s = "";

            if (x < 0) {
                s = "-";
                x = -x;
            }

            m = "0";

            if (x > 1e-21) {
                // 1e-21 < x < 1e21
                // -70 < log2(x) < 70
                e = log(x * pow(2, 69, 1)) - 69;
                z = (e < 0 ? x * pow(2, -e, 1) : x / pow(2, e, 1));
                z *= 0x10000000000000; // Math.pow(2, 52);
                e = 52 - e;

                // -18 < e < 122
                // x = z / 2 ^ e
                if (e > 0) {
                    multiply(0, z);
                    j = f;

                    while (j >= 7) {
                        multiply(1e7, 0);
                        j -= 7;
                    }

                    multiply(pow(10, j, 1), 0);
                    j = e - 1;

                    while (j >= 23) {
                        divide(1 << 23);
                        j -= 23;
                    }

                    divide(1 << j);
                    multiply(1, 1);
                    divide(2);
                    m = toString();
                } else {
                    multiply(0, z);
                    multiply(1 << (-e), 0);
                    m = toString() + '0.00000000000000000000'.slice(2, 2 + f);
                }
            }

            if (f > 0) {
                k = m.length;

                if (k <= f) {
                    m = s + '0.0000000000000000000'.slice(0, f - k + 2) + m;
                } else {
                    m = s + m.slice(0, k - f) + '.' + m.slice(k - f);
                }
            } else {
                m = s + m;
            }

            return m;
        }
    }());
}


//
// String
// ======
//


// ES5 15.5.4.14
// http://es5.github.com/#x15.5.4.14

// [bugfix, IE lt 9, firefox 4, Konqueror, Opera, obscure browsers]
// Many browsers do not split properly with regular expressions or they
// do not perform the split correctly under obscure conditions.
// See http://blog.stevenlevithan.com/archives/cross-browser-split
// I've tested in many browsers and this seems to cover the deviant ones:
//    'ab'.split(/(?:ab)*/) should be ["", ""], not [""]
//    '.'.split(/(.?)(.?)/) should be ["", ".", "", ""], not ["", ""]
//    'tesst'.split(/(s)*/) should be ["t", undefined, "e", "s", "t"], not
//       [undefined, "t", undefined, "e", ...]
//    ''.split(/.?/) should be [], not [""]
//    '.'.split(/()()/) should be ["."], not ["", "", "."]

var string_split = String.prototype.split;
if (
    'ab'.split(/(?:ab)*/).length !== 2 ||
    '.'.split(/(.?)(.?)/).length !== 4 ||
    'tesst'.split(/(s)*/)[1] === "t" ||
    ''.split(/.?/).length === 0 ||
    '.'.split(/()()/).length > 1
) {
    (function () {
        var compliantExecNpcg = /()??/.exec("")[1] === void 0; // NPCG: nonparticipating capturing group

        String.prototype.split = function (separator, limit) {
            var string = this;
            if (separator === void 0 && limit === 0)
                return [];

            // If `separator` is not a regex, use native split
            if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
                return string_split.apply(this, arguments);
            }

            var output = [],
                flags = (separator.ignoreCase ? "i" : "") +
                        (separator.multiline  ? "m" : "") +
                        (separator.extended   ? "x" : "") + // Proposed for ES6
                        (separator.sticky     ? "y" : ""), // Firefox 3+
                lastLastIndex = 0,
                // Make `global` and avoid `lastIndex` issues by working with a copy
                separator = new RegExp(separator.source, flags + "g"),
                separator2, match, lastIndex, lastLength;
            string += ""; // Type-convert
            if (!compliantExecNpcg) {
                // Doesn't need flags gy, but they don't hurt
                separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
            }
            /* Values for `limit`, per the spec:
             * If undefined: 4294967295 // Math.pow(2, 32) - 1
             * If 0, Infinity, or NaN: 0
             * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
             * If negative number: 4294967296 - Math.floor(Math.abs(limit))
             * If other: Type-convert, then use the above rules
             */
            limit = limit === void 0 ?
                -1 >>> 0 : // Math.pow(2, 32) - 1
                limit >>> 0; // ToUint32(limit)
            while (match = separator.exec(string)) {
                // `separator.lastIndex` is not reliable cross-browser
                lastIndex = match.index + match[0].length;
                if (lastIndex > lastLastIndex) {
                    output.push(string.slice(lastLastIndex, match.index));
                    // Fix browsers whose `exec` methods don't consistently return `undefined` for
                    // nonparticipating capturing groups
                    if (!compliantExecNpcg && match.length > 1) {
                        match[0].replace(separator2, function () {
                            for (var i = 1; i < arguments.length - 2; i++) {
                                if (arguments[i] === void 0) {
                                    match[i] = void 0;
                                }
                            }
                        });
                    }
                    if (match.length > 1 && match.index < string.length) {
                        Array.prototype.push.apply(output, match.slice(1));
                    }
                    lastLength = match[0].length;
                    lastLastIndex = lastIndex;
                    if (output.length >= limit) {
                        break;
                    }
                }
                if (separator.lastIndex === match.index) {
                    separator.lastIndex++; // Avoid an infinite loop
                }
            }
            if (lastLastIndex === string.length) {
                if (lastLength || !separator.test("")) {
                    output.push("");
                }
            } else {
                output.push(string.slice(lastLastIndex));
            }
            return output.length > limit ? output.slice(0, limit) : output;
        };
    }());

// [bugfix, chrome]
// If separator is undefined, then the result array contains just one String,
// which is the this value (converted to a String). If limit is not undefined,
// then the output array is truncated so that it contains no more than limit
// elements.
// "0".split(undefined, 0) -> []
} else if ("0".split(void 0, 0).length) {
    String.prototype.split = function(separator, limit) {
        if (separator === void 0 && limit === 0) return [];
        return string_split.apply(this, arguments);
    }
}


// ECMA-262, 3rd B.2.3
// Note an ECMAScript standart, although ECMAScript 3rd Edition has a
// non-normative section suggesting uniform semantics and it should be
// normalized across all browsers
// [bugfix, IE lt 9] IE < 9 substr() with negative value not working in IE
if("".substr && "0b".substr(-1) !== "b") {
    var string_substr = String.prototype.substr;
    /**
     *  Get the substring of a string
     *  @param  {integer}  start   where to start the substring
     *  @param  {integer}  length  how many characters to return
     *  @return {string}
     */
    String.prototype.substr = function(start, length) {
        return string_substr.call(
            this,
            start < 0 ? ((start = this.length + start) < 0 ? 0 : start) : start,
            length
        );
    }
}

// ES5 15.5.4.20
// http://es5.github.com/#x15.5.4.20
var ws = "\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003" +
    "\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028" +
    "\u2029\uFEFF";
if (!String.prototype.trim || ws.trim()) {
    // http://blog.stevenlevithan.com/archives/faster-trim-javascript
    // http://perfectionkills.com/whitespace-deviations/
    ws = "[" + ws + "]";
    var trimBeginRegexp = new RegExp("^" + ws + ws + "*"),
        trimEndRegexp = new RegExp(ws + ws + "*$");
    String.prototype.trim = function trim() {
        if (this === void 0 || this === null) {
            throw new TypeError("can't convert "+this+" to object");
        }
        return String(this)
            .replace(trimBeginRegexp, "")
            .replace(trimEndRegexp, "");
    };
}

//
// Util
// ======
//

// ES5 9.4
// http://es5.github.com/#x9.4
// http://jsperf.com/to-integer

function toInteger(n) {
    n = +n;
    if (n !== n) { // isNaN
        n = 0;
    } else if (n !== 0 && n !== (1/0) && n !== -(1/0)) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
    }
    return n;
}

function isPrimitive(input) {
    var type = typeof input;
    return (
        input === null ||
        type === "undefined" ||
        type === "boolean" ||
        type === "number" ||
        type === "string"
    );
}

function toPrimitive(input) {
    var val, valueOf, toString;
    if (isPrimitive(input)) {
        return input;
    }
    valueOf = input.valueOf;
    if (typeof valueOf === "function") {
        val = valueOf.call(input);
        if (isPrimitive(val)) {
            return val;
        }
    }
    toString = input.toString;
    if (typeof toString === "function") {
        val = toString.call(input);
        if (isPrimitive(val)) {
            return val;
        }
    }
    throw new TypeError();
}

// ES5 9.9
// http://es5.github.com/#x9.9
var toObject = function (o) {
    if (o == null) { // this matches both null and undefined
        throw new TypeError("can't convert "+o+" to object");
    }
    return Object(o);
};

});

},{}],18:[function(require,module,exports){
// Copyright 2009-2012 by contributors, MIT License
// vim: ts=4 sts=4 sw=4 expandtab

// Module systems magic dance
(function (definition) {
    // RequireJS
    if (typeof define == "function") {
        define(definition);
    // YUI3
    } else if (typeof YUI == "function") {
        YUI.add("es5-sham", definition);
    // CommonJS and <script>
    } else {
        definition();
    }
})(function () {


var call = Function.prototype.call;
var prototypeOfObject = Object.prototype;
var owns = call.bind(prototypeOfObject.hasOwnProperty);

// If JS engine supports accessors creating shortcuts.
var defineGetter;
var defineSetter;
var lookupGetter;
var lookupSetter;
var supportsAccessors;
if ((supportsAccessors = owns(prototypeOfObject, "__defineGetter__"))) {
    defineGetter = call.bind(prototypeOfObject.__defineGetter__);
    defineSetter = call.bind(prototypeOfObject.__defineSetter__);
    lookupGetter = call.bind(prototypeOfObject.__lookupGetter__);
    lookupSetter = call.bind(prototypeOfObject.__lookupSetter__);
}

// ES5 15.2.3.2
// http://es5.github.com/#x15.2.3.2
if (!Object.getPrototypeOf) {
    // https://github.com/kriskowal/es5-shim/issues#issue/2
    // http://ejohn.org/blog/objectgetprototypeof/
    // recommended by fschaefer on github
    Object.getPrototypeOf = function getPrototypeOf(object) {
        return object.__proto__ || (
            object.constructor
                ? object.constructor.prototype
                : prototypeOfObject
        );
    };
}

//ES5 15.2.3.3
//http://es5.github.com/#x15.2.3.3

function doesGetOwnPropertyDescriptorWork(object) {
    try {
        object.sentinel = 0;
        return Object.getOwnPropertyDescriptor(
                object,
                "sentinel"
        ).value === 0;
    } catch (exception) {
        // returns falsy
    }
}

//check whether getOwnPropertyDescriptor works if it's given. Otherwise,
//shim partially.
if (Object.defineProperty) {
    var getOwnPropertyDescriptorWorksOnObject = 
        doesGetOwnPropertyDescriptorWork({});
    var getOwnPropertyDescriptorWorksOnDom = typeof document == "undefined" ||
    doesGetOwnPropertyDescriptorWork(document.createElement("div"));
    if (!getOwnPropertyDescriptorWorksOnDom || 
            !getOwnPropertyDescriptorWorksOnObject
    ) {
        var getOwnPropertyDescriptorFallback = Object.getOwnPropertyDescriptor;
    }
}

if (!Object.getOwnPropertyDescriptor || getOwnPropertyDescriptorFallback) {
    var ERR_NON_OBJECT = "Object.getOwnPropertyDescriptor called on a non-object: ";

    Object.getOwnPropertyDescriptor = function getOwnPropertyDescriptor(object, property) {
        if ((typeof object != "object" && typeof object != "function") || object === null) {
            throw new TypeError(ERR_NON_OBJECT + object);
        }

        // make a valiant attempt to use the real getOwnPropertyDescriptor
        // for I8's DOM elements.
        if (getOwnPropertyDescriptorFallback) {
            try {
                return getOwnPropertyDescriptorFallback.call(Object, object, property);
            } catch (exception) {
                // try the shim if the real one doesn't work
            }
        }

        // If object does not owns property return undefined immediately.
        if (!owns(object, property)) {
            return;
        }

        // If object has a property then it's for sure both `enumerable` and
        // `configurable`.
        var descriptor =  { enumerable: true, configurable: true };

        // If JS engine supports accessor properties then property may be a
        // getter or setter.
        if (supportsAccessors) {
            // Unfortunately `__lookupGetter__` will return a getter even
            // if object has own non getter property along with a same named
            // inherited getter. To avoid misbehavior we temporary remove
            // `__proto__` so that `__lookupGetter__` will return getter only
            // if it's owned by an object.
            var prototype = object.__proto__;
            object.__proto__ = prototypeOfObject;

            var getter = lookupGetter(object, property);
            var setter = lookupSetter(object, property);

            // Once we have getter and setter we can put values back.
            object.__proto__ = prototype;

            if (getter || setter) {
                if (getter) {
                    descriptor.get = getter;
                }
                if (setter) {
                    descriptor.set = setter;
                }
                // If it was accessor property we're done and return here
                // in order to avoid adding `value` to the descriptor.
                return descriptor;
            }
        }

        // If we got this far we know that object has an own property that is
        // not an accessor so we set it as a value and return descriptor.
        descriptor.value = object[property];
        descriptor.writable = true;
        return descriptor;
    };
}

// ES5 15.2.3.4
// http://es5.github.com/#x15.2.3.4
if (!Object.getOwnPropertyNames) {
    Object.getOwnPropertyNames = function getOwnPropertyNames(object) {
        return Object.keys(object);
    };
}

// ES5 15.2.3.5
// http://es5.github.com/#x15.2.3.5
if (!Object.create) {

    // Contributed by Brandon Benvie, October, 2012
    var createEmpty;
    var supportsProto = Object.prototype.__proto__ === null;
    if (supportsProto || typeof document == 'undefined') {
        createEmpty = function () {
            return { "__proto__": null };
        };
    } else {
        // In old IE __proto__ can't be used to manually set `null`, nor does
        // any other method exist to make an object that inherits from nothing,
        // aside from Object.prototype itself. Instead, create a new global
        // object and *steal* its Object.prototype and strip it bare. This is
        // used as the prototype to create nullary objects.
        createEmpty = function () {
            var iframe = document.createElement('iframe');
            var parent = document.body || document.documentElement;
            iframe.style.display = 'none';
            parent.appendChild(iframe);
            iframe.src = 'javascript:';
            var empty = iframe.contentWindow.Object.prototype;
            parent.removeChild(iframe);
            iframe = null;
            delete empty.constructor;
            delete empty.hasOwnProperty;
            delete empty.propertyIsEnumerable;
            delete empty.isPrototypeOf;
            delete empty.toLocaleString;
            delete empty.toString;
            delete empty.valueOf;
            empty.__proto__ = null;

            function Empty() {}
            Empty.prototype = empty;
            // short-circuit future calls
            createEmpty = function () {
                return new Empty();
            };
            return new Empty();
        };
    }

    Object.create = function create(prototype, properties) {

        var object;
        function Type() {}  // An empty constructor.

        if (prototype === null) {
            object = createEmpty();
        } else {
            if (typeof prototype !== "object" && typeof prototype !== "function") {
                // In the native implementation `parent` can be `null`
                // OR *any* `instanceof Object`  (Object|Function|Array|RegExp|etc)
                // Use `typeof` tho, b/c in old IE, DOM elements are not `instanceof Object`
                // like they are in modern browsers. Using `Object.create` on DOM elements
                // is...err...probably inappropriate, but the native version allows for it.
                throw new TypeError("Object prototype may only be an Object or null"); // same msg as Chrome
            }
            Type.prototype = prototype;
            object = new Type();
            // IE has no built-in implementation of `Object.getPrototypeOf`
            // neither `__proto__`, but this manually setting `__proto__` will
            // guarantee that `Object.getPrototypeOf` will work as expected with
            // objects created using `Object.create`
            object.__proto__ = prototype;
        }

        if (properties !== void 0) {
            Object.defineProperties(object, properties);
        }

        return object;
    };
}

// ES5 15.2.3.6
// http://es5.github.com/#x15.2.3.6

// Patch for WebKit and IE8 standard mode
// Designed by hax <hax.github.com>
// related issue: https://github.com/kriskowal/es5-shim/issues#issue/5
// IE8 Reference:
//     http://msdn.microsoft.com/en-us/library/dd282900.aspx
//     http://msdn.microsoft.com/en-us/library/dd229916.aspx
// WebKit Bugs:
//     https://bugs.webkit.org/show_bug.cgi?id=36423

function doesDefinePropertyWork(object) {
    try {
        Object.defineProperty(object, "sentinel", {});
        return "sentinel" in object;
    } catch (exception) {
        // returns falsy
    }
}

// check whether defineProperty works if it's given. Otherwise,
// shim partially.
if (Object.defineProperty) {
    var definePropertyWorksOnObject = doesDefinePropertyWork({});
    var definePropertyWorksOnDom = typeof document == "undefined" ||
        doesDefinePropertyWork(document.createElement("div"));
    if (!definePropertyWorksOnObject || !definePropertyWorksOnDom) {
        var definePropertyFallback = Object.defineProperty,
            definePropertiesFallback = Object.defineProperties;
    }
}

if (!Object.defineProperty || definePropertyFallback) {
    var ERR_NON_OBJECT_DESCRIPTOR = "Property description must be an object: ";
    var ERR_NON_OBJECT_TARGET = "Object.defineProperty called on non-object: "
    var ERR_ACCESSORS_NOT_SUPPORTED = "getters & setters can not be defined " +
                                      "on this javascript engine";

    Object.defineProperty = function defineProperty(object, property, descriptor) {
        if ((typeof object != "object" && typeof object != "function") || object === null) {
            throw new TypeError(ERR_NON_OBJECT_TARGET + object);
        }
        if ((typeof descriptor != "object" && typeof descriptor != "function") || descriptor === null) {
            throw new TypeError(ERR_NON_OBJECT_DESCRIPTOR + descriptor);
        }
        // make a valiant attempt to use the real defineProperty
        // for I8's DOM elements.
        if (definePropertyFallback) {
            try {
                return definePropertyFallback.call(Object, object, property, descriptor);
            } catch (exception) {
                // try the shim if the real one doesn't work
            }
        }

        // If it's a data property.
        if (owns(descriptor, "value")) {
            // fail silently if "writable", "enumerable", or "configurable"
            // are requested but not supported
            /*
            // alternate approach:
            if ( // can't implement these features; allow false but not true
                !(owns(descriptor, "writable") ? descriptor.writable : true) ||
                !(owns(descriptor, "enumerable") ? descriptor.enumerable : true) ||
                !(owns(descriptor, "configurable") ? descriptor.configurable : true)
            )
                throw new RangeError(
                    "This implementation of Object.defineProperty does not " +
                    "support configurable, enumerable, or writable."
                );
            */

            if (supportsAccessors && (lookupGetter(object, property) ||
                                      lookupSetter(object, property)))
            {
                // As accessors are supported only on engines implementing
                // `__proto__` we can safely override `__proto__` while defining
                // a property to make sure that we don't hit an inherited
                // accessor.
                var prototype = object.__proto__;
                object.__proto__ = prototypeOfObject;
                // Deleting a property anyway since getter / setter may be
                // defined on object itself.
                delete object[property];
                object[property] = descriptor.value;
                // Setting original `__proto__` back now.
                object.__proto__ = prototype;
            } else {
                object[property] = descriptor.value;
            }
        } else {
            if (!supportsAccessors) {
                throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
            }
            // If we got that far then getters and setters can be defined !!
            if (owns(descriptor, "get")) {
                defineGetter(object, property, descriptor.get);
            }
            if (owns(descriptor, "set")) {
                defineSetter(object, property, descriptor.set);
            }
        }
        return object;
    };
}

// ES5 15.2.3.7
// http://es5.github.com/#x15.2.3.7
if (!Object.defineProperties || definePropertiesFallback) {
    Object.defineProperties = function defineProperties(object, properties) {
        // make a valiant attempt to use the real defineProperties
        if (definePropertiesFallback) {
            try {
                return definePropertiesFallback.call(Object, object, properties);
            } catch (exception) {
                // try the shim if the real one doesn't work
            }
        }

        for (var property in properties) {
            if (owns(properties, property) && property != "__proto__") {
                Object.defineProperty(object, property, properties[property]);
            }
        }
        return object;
    };
}

// ES5 15.2.3.8
// http://es5.github.com/#x15.2.3.8
if (!Object.seal) {
    Object.seal = function seal(object) {
        // this is misleading and breaks feature-detection, but
        // allows "securable" code to "gracefully" degrade to working
        // but insecure code.
        return object;
    };
}

// ES5 15.2.3.9
// http://es5.github.com/#x15.2.3.9
if (!Object.freeze) {
    Object.freeze = function freeze(object) {
        // this is misleading and breaks feature-detection, but
        // allows "securable" code to "gracefully" degrade to working
        // but insecure code.
        return object;
    };
}

// detect a Rhino bug and patch it
try {
    Object.freeze(function () {});
} catch (exception) {
    Object.freeze = (function freeze(freezeObject) {
        return function freeze(object) {
            if (typeof object == "function") {
                return object;
            } else {
                return freezeObject(object);
            }
        };
    })(Object.freeze);
}

// ES5 15.2.3.10
// http://es5.github.com/#x15.2.3.10
if (!Object.preventExtensions) {
    Object.preventExtensions = function preventExtensions(object) {
        // this is misleading and breaks feature-detection, but
        // allows "securable" code to "gracefully" degrade to working
        // but insecure code.
        return object;
    };
}

// ES5 15.2.3.11
// http://es5.github.com/#x15.2.3.11
if (!Object.isSealed) {
    Object.isSealed = function isSealed(object) {
        return false;
    };
}

// ES5 15.2.3.12
// http://es5.github.com/#x15.2.3.12
if (!Object.isFrozen) {
    Object.isFrozen = function isFrozen(object) {
        return false;
    };
}

// ES5 15.2.3.13
// http://es5.github.com/#x15.2.3.13
if (!Object.isExtensible) {
    Object.isExtensible = function isExtensible(object) {
        // 1. If Type(O) is not Object throw a TypeError exception.
        if (Object(object) !== object) {
            throw new TypeError(); // TODO message
        }
        // 2. Return the Boolean value of the [[Extensible]] internal property of O.
        var name = '';
        while (owns(object, name)) {
            name += '?';
        }
        object[name] = true;
        var returnValue = owns(object, name);
        delete object[name];
        return returnValue;
    };
}

});

},{}],8:[function(require,module,exports){
var EventEmitter = require('events').EventEmitter;
/**
 * @license https://raw.github.com/joyent/node/v0.10.11/LICENSE
 * Node js license. EventEmitter will be in the client
 * only code.
 */
/**
 * @class Luc.EventEmitter
 * The wonderful event emmiter that comes with node,
 * that works in the supported browsers.
 * [http://nodejs.org/api/events.html](http://nodejs.org/api/events.html)
 */
EventEmitter.prototype.once = function(type, listener) {
    //put in fix for IE 9 and below
    var self = this,
        g = function() {
            self.removeListener(type, g);
            listener.apply(this, arguments);
        };

    self.on(type, g);

    return this;
};

module.exports = EventEmitter;
},{"events":20}],21:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],20:[function(require,module,exports){
var process=require("__browserify_process");if (!process.EventEmitter) process.EventEmitter = function () {};

var EventEmitter = exports.EventEmitter = process.EventEmitter;
var isArray = typeof Array.isArray === 'function'
    ? Array.isArray
    : function (xs) {
        return Object.prototype.toString.call(xs) === '[object Array]'
    }
;
function indexOf (xs, x) {
    if (xs.indexOf) return xs.indexOf(x);
    for (var i = 0; i < xs.length; i++) {
        if (x === xs[i]) return i;
    }
    return -1;
}

// By default EventEmitters will print a warning if more than
// 10 listeners are added to it. This is a useful default which
// helps finding memory leaks.
//
// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
var defaultMaxListeners = 10;
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!this._events) this._events = {};
  this._events.maxListeners = n;
};


EventEmitter.prototype.emit = function(type) {
  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events || !this._events.error ||
        (isArray(this._events.error) && !this._events.error.length))
    {
      if (arguments[1] instanceof Error) {
        throw arguments[1]; // Unhandled 'error' event
      } else {
        throw new Error("Uncaught, unspecified 'error' event.");
      }
      return false;
    }
  }

  if (!this._events) return false;
  var handler = this._events[type];
  if (!handler) return false;

  if (typeof handler == 'function') {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        var args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
    return true;

  } else if (isArray(handler)) {
    var args = Array.prototype.slice.call(arguments, 1);

    var listeners = handler.slice();
    for (var i = 0, l = listeners.length; i < l; i++) {
      listeners[i].apply(this, args);
    }
    return true;

  } else {
    return false;
  }
};

// EventEmitter is defined in src/node_events.cc
// EventEmitter.prototype.emit() is also defined there.
EventEmitter.prototype.addListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('addListener only takes instances of Function');
  }

  if (!this._events) this._events = {};

  // To avoid recursion in the case that type == "newListeners"! Before
  // adding it to the listeners, first emit "newListeners".
  this.emit('newListener', type, listener);

  if (!this._events[type]) {
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  } else if (isArray(this._events[type])) {

    // Check for listener leak
    if (!this._events[type].warned) {
      var m;
      if (this._events.maxListeners !== undefined) {
        m = this._events.maxListeners;
      } else {
        m = defaultMaxListeners;
      }

      if (m && m > 0 && this._events[type].length > m) {
        this._events[type].warned = true;
        console.error('(node) warning: possible EventEmitter memory ' +
                      'leak detected. %d listeners added. ' +
                      'Use emitter.setMaxListeners() to increase limit.',
                      this._events[type].length);
        console.trace();
      }
    }

    // If we've already got an array, just append.
    this._events[type].push(listener);
  } else {
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  var self = this;
  self.on(type, function g() {
    self.removeListener(type, g);
    listener.apply(this, arguments);
  });

  return this;
};

EventEmitter.prototype.removeListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('removeListener only takes instances of Function');
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (!this._events || !this._events[type]) return this;

  var list = this._events[type];

  if (isArray(list)) {
    var i = indexOf(list, listener);
    if (i < 0) return this;
    list.splice(i, 1);
    if (list.length == 0)
      delete this._events[type];
  } else if (this._events[type] === listener) {
    delete this._events[type];
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  if (arguments.length === 0) {
    this._events = {};
    return this;
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (type && this._events && this._events[type]) this._events[type] = null;
  return this;
};

EventEmitter.prototype.listeners = function(type) {
  if (!this._events) this._events = {};
  if (!this._events[type]) this._events[type] = [];
  if (!isArray(this._events[type])) {
    this._events[type] = [this._events[type]];
  }
  return this._events[type];
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (typeof emitter._events[type] === 'function')
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

},{"__browserify_process":21}],19:[function(require,module,exports){
var obj = require('../object'),
    array = require('../array'),
    apply = obj.apply,
    mix = obj.mix,
    oFilter = obj.filter,
    emptyFn = ('../function').emptyFn,
    is = require('../is');

/**
 * @class  Luc.Composition
 * @protected
 * Class that wraps {@link Luc.define#$compositions composition} config objects
 * to conform to an api. This class is not available externally.  The config object
 * will override any protected methods and default configs.  Defaults
 * can be used for often used configs, keys that are not defaults will
 * override the defaults.
 *
    var C = Luc.define({
        $compositions: {
            defaults: Luc.compositionEnums.EventEmitter,
            methods: ['emit']
        }
    });

    var c = new C()
    typeof c.emit
    >"function"
    typeof c.on
    >"undefined"
 *
 * If you want to add your own composition all you need to have is
 * a name and a Constructor, the rest of the configs of this class and Luc.Composition.create
 * can be used to inject behavior if needed.
 * 
     function Counter() {
        this.count = 0;
     };

     Counter.prototype = {
        getCount: function() {
            return this.count;
        },
        increaseCount: function() {
            this.count++;
        }
     }

     var C = Luc.define({
            $compositions: {
                name: 'counter',
                Constructor: Counter,
                methods: 'allMethods'
            }
    });

    var c = new C()

    c.increaseCount();
    c.increaseCount();
    c.increaseCount();
    c.getCount();
    >3
    c.count
    >undefined
 */
function Composition(c) {
    var defaults = c.defaults,
        config = c;

    if(defaults) {
        mix(config, config.defaults);
        delete config.defaults;
    }

    apply(this, config);
}

Composition.prototype = {
    /**
     * @cfg {String} name (required) the name which the composition
     * will be referred to by the instance.
     */
    
    /**
     * @cfg {Object} defaults
     */
    
    /**
     * @cfg {Boolean} initAfter  defaults to false
     * pass in true to init the composition instance after the 
     * superclass has been called.
     */

    /**
     * @cfg {Function} Constructor (required) the Constructor
     * to use when creating the composition instance.  This
     * is required if Luc.Composition.create is not overwritten by
     * the passed in composition config object.
     */
    
    /**
     * @protected
     * By default just return a newly created Constructor instance.
     * 
     * When create is called the following properties can be used :
     * 
     * this.instance The instance that is creating
     * the composition.
     * 
     * this.Constructor the constructor that is passed in from
     * the composition config. 
     *
     * this.instanceArgs the arguments passed into the instance when it 
     * is being created.  For example

        new MyClassWithAComposition({plugins: []})
        //inside of the create method
        this.instanceArgs
        >[{plugins: []}]

     * @return {Object} 
     * the composition instance.
     *
     * For example set the emitters maxListeners
     * to what the instance has configed.
      
        maxListeners: 100,
        $compositions: {
            Constructor: Luc.EventEmitter,
            create: function() {
                var emitter = new this.Constructor();
                emitter.setMaxListeners(this.instance.maxListeners);
                return emitter;
            },
            name: 'emitter'
        }

     */
    create: function() {
        return new this.Constructor();
    },

    getInstance: function() {
        return this.create();
    },

    validate: function() {
        if(this.name  === undefined) {
            throw new Error('A name must be defined');
        }
        if(!is.isFunction(this.Constructor) && this.create === Composition.prototype.create) {
            throw new Error('The Constructor must be function if create is not overridden');
        }
    },

    /**
     * @property filterMethodFns
     * @type {Object}
     * @property filterMethodFns.allMethods return all methods from the
     * constructors prototype
     * @property filterMethodFns.public return all methods that don't
     * start with _.  We know not everyone follows this convention, but we
     * do and so do many others.
     * @type {Function}
     */
    filterMethodFns: {
        allMethods: function(key, value) {
            return is.isFunction(value);
        },
        publicMethods: function(key, value) {
            return is.isFunction(value) && key.charAt(0) !== '_';
        }
    },

    /**
     * @cfg {Function/String/Array[]} methods
     * The keys to add to the definers prototype that will in turn call
     * the compositions method.
     * 
     * Defaults to Luc.emptyFn. 
     * If an array is passed it will just use that Array.
     * 
     * If a string is passed and matches a method from 
     * Luc.Composition.filterMethodFns it will call that instead.
     * 
     * If a function is defined it
     * will get called while iterating over each key value pair of the 
     * Constructor's prototype, if a truthy value is 
     * returned the property will be added to the defining
     * classes prototype.
     * 
     * For example this config will only expose the emit method 
     * to the defining class
     
        $compositions: {
            Constructor: Luc.EventEmitter,
            methods: function(key, value) {
                return key === 'emit';
            },
            name: 'emitter'
        }
     * this is also a valid config
     * 
        $compositions: {
            Constructor: Luc.EventEmitter,
            methods: ['emitter'],
            name: 'emitter'
        }
     * 
     */
    methods: emptyFn,

    /**
     * @cfg {String[]/String} ignoreMethods methods that will always
     * be ignored if methods is not an Array.
     *
        
        var C = Luc.define({
                $compositions: {
                    defaults: Luc.compositionEnums.EventEmitter,
                    methods: 'allMethods',
                    ignoreMethods: ['emit']
                }
            });

            var c = new C();
            typeof c.emit
            >"undefined"
     */
    ignoreMethods: undefined,

    getObjectWithMethods: function() {
        var methodsObj = this.Constructor && this.Constructor.prototype;
        if (this.ignoreMethods) {
            methodsObj = apply({}, methodsObj);
            array.each(this.ignoreMethods, function(value) {
                delete methodsObj[value];
            });
        }

        return methodsObj;
    },

    getMethodsToCompose: function() {
        var methods = this.methods,
            filterFn;
            
        if (is.isArray(methods)) {
            return methods;
        }

        filterFn = methods;

        if (is.isString(methods)) {
            filterFn = this.filterMethodFns[methods];
        }

        //Constructors are not needed if create is overwritten
        return oFilter(this.getObjectWithMethods(), filterFn, this, {
            ownProperties: false,
            keys: true
        });
    }
};

module.exports = Composition;
},{"../array":4,"../is":6,"../object":2}]},{},[15])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvbHVjLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2x1Yy1lczUtc2hpbS5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9vYmplY3QuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvaXMuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvaWQuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9ub2RlX21vZHVsZXMvZXM1LXNoaW0tc2hhbS9pbmRleC5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9mdW5jdGlvbi5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9hcnJheS5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9hcnJheUZuR2VuZXJhdG9yLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2NvbXBhcmUuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvY2xhc3MvYmFzZS5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9jbGFzcy9kZWZpbmVyLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2NsYXNzL3BsdWdpbi5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9jbGFzcy9wbHVnaW5NYW5hZ2VyLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2NsYXNzL2NvbXBvc2l0aW9uRW51bXMuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9ub2RlX21vZHVsZXMvZXM1LXNoaW0tc2hhbS9ub2RlX21vZHVsZXMvZXM1LXNoaW0vZXM1LXNoaW0uanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9ub2RlX21vZHVsZXMvZXM1LXNoaW0tc2hhbS9ub2RlX21vZHVsZXMvZXM1LXNoaW0vZXM1LXNoYW0uanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvZXZlbnRzL2V2ZW50RW1pdHRlci5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9pbnNlcnQtbW9kdWxlLWdsb2JhbHMvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLWJ1aWx0aW5zL2J1aWx0aW4vZXZlbnRzLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2NsYXNzL2NvbXBvc2l0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdk5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy8wQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdk1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbHlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1YkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsidmFyIEx1YyA9IHt9O1xuLyoqXG4gKiBAY2xhc3MgTHVjXG4gKiBBbGlhc2VzIGZvciBjb21tb24gTHVjIG1ldGhvZHMgYW5kIHBhY2thZ2VzLiAgQ2hlY2sgb3V0IEx1Yy5kZWZpbmVcbiAqIHRvIGxvb2sgYXQgdGhlIGNsYXNzIHN5c3RlbSBMdWMgcHJvdmlkZXMuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gTHVjO1xuXG52YXIgb2JqZWN0ID0gcmVxdWlyZSgnLi9vYmplY3QnKTtcbkx1Yy5PYmplY3QgPSBvYmplY3Q7XG4vKipcbiAqIEBtZW1iZXIgTHVjXG4gKiBAcHJvcGVydHkgTyBMdWMuT1xuICogQWxpYXMgZm9yIEx1Yy5PYmplY3RcbiAqL1xuTHVjLk8gPSBvYmplY3Q7XG5cblxuLyoqXG4gKiBAbWVtYmVyIEx1Y1xuICogQG1ldGhvZCBhcHBseVxuICogQGluaGVyaXRkb2MgTHVjLk9iamVjdCNhcHBseVxuICovXG5MdWMuYXBwbHkgPSBMdWMuT2JqZWN0LmFwcGx5O1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjXG4gKiBAbWV0aG9kIG1peFxuICogQGluaGVyaXRkb2MgTHVjLk9iamVjdCNtaXhcbiAqL1xuTHVjLm1peCA9IEx1Yy5PYmplY3QubWl4O1xuXG5cbnZhciBmdW4gPSByZXF1aXJlKCcuL2Z1bmN0aW9uJyk7XG5MdWMuRnVuY3Rpb24gPSBmdW47XG5cbi8qKlxuICogQG1lbWJlciBMdWNcbiAqIEBwcm9wZXJ0eSBGIEx1Yy5GXG4gKiBBbGlhcyBmb3IgTHVjLkZ1bmN0aW9uXG4gKi9cbkx1Yy5GID0gZnVuO1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjXG4gKiBAbWV0aG9kIGVtcHR5Rm5cbiAqIEBpbmhlcml0ZG9jIEx1Yy5GdW5jdGlvbiNlbXB0eUZuXG4gKi9cbkx1Yy5lbXB0eUZuID0gTHVjLkZ1bmN0aW9uLmVtcHR5Rm47XG5cbi8qKlxuICogQG1lbWJlciBMdWNcbiAqIEBtZXRob2QgYWJzdHJhY3RGblxuICogQGluaGVyaXRkb2MgTHVjLkZ1bmN0aW9uI2Fic3RyYWN0Rm5cbiAqL1xuTHVjLmFic3RyYWN0Rm4gPSBMdWMuRnVuY3Rpb24uYWJzdHJhY3RGbjtcblxudmFyIGFycmF5ID0gcmVxdWlyZSgnLi9hcnJheScpO1xuTHVjLkFycmF5ID0gYXJyYXk7XG5cbi8qKlxuICogQG1lbWJlciBMdWNcbiAqIEBwcm9wZXJ0eSBBIEx1Yy5BXG4gKiBBbGlhcyBmb3IgTHVjLkFycmF5XG4gKi9cbkx1Yy5BID0gYXJyYXk7XG5cbkx1Yy5BcnJheUZuR2VuZXJhdG9yID0gcmVxdWlyZSgnLi9hcnJheUZuR2VuZXJhdG9yJyk7XG5cbkx1Yy5hcHBseShMdWMsIHJlcXVpcmUoJy4vaXMnKSk7XG5cbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCcuL2V2ZW50cy9ldmVudEVtaXR0ZXInKTtcblxuTHVjLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxudmFyIEJhc2UgPSByZXF1aXJlKCcuL2NsYXNzL2Jhc2UnKTtcblxuTHVjLkJhc2UgPSBCYXNlO1xuXG52YXIgRGVmaW5lciA9IHJlcXVpcmUoJy4vY2xhc3MvZGVmaW5lcicpO1xuXG5MdWMuQ2xhc3NEZWZpbmVyID0gRGVmaW5lcjtcblxuLyoqXG4gKiBAbWVtYmVyIEx1Y1xuICogQG1ldGhvZCBkZWZpbmVcbiAqIEBpbmhlcml0ZG9jIEx1Yy5kZWZpbmUjZGVmaW5lXG4gKi9cbkx1Yy5kZWZpbmUgPSBEZWZpbmVyLmRlZmluZTtcblxuTHVjLlBsdWdpbiA9IHJlcXVpcmUoJy4vY2xhc3MvcGx1Z2luJyk7XG5cbkx1Yy5QbHVnaW5NYW5hZ2VyID0gcmVxdWlyZSgnLi9jbGFzcy9wbHVnaW5NYW5hZ2VyJyk7XG5cbkx1Yy5hcHBseShMdWMsIHtcbiAgICBjb21wb3NpdGlvbkVudW1zOiByZXF1aXJlKCcuL2NsYXNzL2NvbXBvc2l0aW9uRW51bXMnKVxufSk7XG5cbkx1Yy5jb21wYXJlID0gcmVxdWlyZSgnLi9jb21wYXJlJykuY29tcGFyZTtcblxuTHVjLmlkID0gcmVxdWlyZSgnLi9pZCcpO1xuXG5cbmlmKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgd2luZG93Lkx1YyA9IEx1Yztcbn0iLCIvKipcbiAqIEBsaWNlbnNlIGh0dHBzOi8vcmF3LmdpdGh1Yi5jb20va3Jpc2tvd2FsL2VzNS1zaGltL21hc3Rlci9MSUNFTlNFXG4gKiBlczUtc2hpbSBsaWNlbnNlXG4gKi9cblxuaWYodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXF1aXJlKCdlczUtc2hpbS1zaGFtJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9sdWMnKTsiLCIvKipcbiAqIEBjbGFzcyBMdWMuT2JqZWN0XG4gKiBQYWNrYWdlIGZvciBPYmplY3QgbWV0aG9kcy4gIEx1Yy5PYmplY3QuYXBwbHkgYW5kIEx1Yy5PYmplY3QuZWFjaFxuICogYXJlIHVzZWQgdmVyeSBvZnRlbi4gIG1peCBhbmQgYXBwbHkgYXJlIGFsaWFzZWQgdG8gTHVjLmFwcGx5IGFuZCBMdWMubWl4LlxuICovXG5cbi8qKlxuICogQXBwbHkgdGhlIHByb3BlcnRpZXMgZnJvbSBmcm9tT2JqZWN0IHRvIHRoZSB0b09iamVjdC4gIGZyb21PYmplY3Qgd2lsbFxuICogb3ZlcndyaXRlIGFueSBzaGFyZWQga2V5cy4gIEl0IGNhbiBhbHNvIGJlIHVzZWQgYXMgYSBzaW1wbGUgc2hhbGxvdyBjbG9uZS5cbiAqIFxuICAgIHZhciB0byA9IHthOjEsIGM6MX0sIGZyb20gPSB7YToyLCBiOjJ9XG4gICAgTHVjLk9iamVjdC5hcHBseSh0bywgZnJvbSlcbiAgICA+T2JqZWN0IHthOiAyLCBjOiAxLCBiOiAyfVxuICAgIHRvID09PSB0b1xuICAgID50cnVlXG4gICAgdmFyIGNsb25lID0gTHVjLk9iamVjdC5hcHBseSh7fSwgZnJvbSlcbiAgICA+dW5kZWZpbmVkXG4gICAgY2xvbmVcbiAgICA+T2JqZWN0IHthOiAyLCBiOiAyfVxuICAgIGNsb25lID09PSBmcm9tXG4gICAgPmZhbHNlXG4gKlxuICogTm8gbnVsbCBjaGVja3MgYXJlIG5lZWRlZC5cbiAgICBcbiAgICBMdWMuYXBwbHkodW5kZWZpbmVkLCB7YToxfSlcbiAgICA+e2E6MX1cbiAgICBMdWMuYXBwbHkoe2E6IDF9KVxuICAgID57YToxfVxuXG4gKlxuICogXG4gKiBAcGFyYW0gIHtPYmplY3R9IFt0b09iamVjdF0gT2JqZWN0IHRvIHB1dCB0aGUgcHJvcGVydGllcyBmcm9tT2JqZWN0IG9uLlxuICogQHBhcmFtICB7T2JqZWN0fSBbZnJvbU9iamVjdF0gT2JqZWN0IHRvIHB1dCB0aGUgcHJvcGVydGllcyBvbiB0aGUgdG9PYmplY3RcbiAqIEByZXR1cm4ge09iamVjdH0gdGhlIHRvT2JqZWN0XG4gKi9cbmV4cG9ydHMuYXBwbHkgPSBmdW5jdGlvbih0b09iamVjdCwgZnJvbU9iamVjdCkge1xuICAgIHZhciB0byA9IHRvT2JqZWN0IHx8IHt9LFxuICAgICAgICBmcm9tID0gZnJvbU9iamVjdCB8fCB7fSxcbiAgICAgICAgcHJvcDtcblxuICAgIGZvciAocHJvcCBpbiBmcm9tKSB7XG4gICAgICAgIGlmIChmcm9tLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgICAgICB0b1twcm9wXSA9IGZyb21bcHJvcF07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdG87XG59O1xuXG4vKipcbiAqIFNpbWlsYXIgdG8gTHVjLk9iamVjdC5hcHBseSBleGNlcHQgdGhhdCB0aGUgZnJvbU9iamVjdCB3aWxsIFxuICogTk9UIG92ZXJ3cml0ZSB0aGUga2V5cyBvZiB0aGUgdG9PYmplY3QgaWYgdGhleSBhcmUgZGVmaW5lZC5cbiAqXG4gICAgTHVjLm1peCh7YToxLGI6Mn0sIHthOjMsYjo0LGM6NX0pXG4gICAgPnthOiAxLCBiOiAyLCBjOiA1fVxuXG4gKiBObyBudWxsIGNoZWNrcyBhcmUgbmVlZGVkLlxuICAgIFxuICAgIEx1Yy5taXgodW5kZWZpbmVkLCB7YToxfSlcbiAgICA+e2E6MX1cbiAgICBMdWMubWl4KHthOiAxfSlcbiAgICA+e2E6MX1cbiAgICBcbiAqXG5cbiAqIEBwYXJhbSAge09iamVjdH0gW3RvT2JqZWN0XSBPYmplY3QgdG8gcHV0IHRoZSBwcm9wZXJ0aWVzIGZyb21PYmplY3Qgb24uXG4gKiBAcGFyYW0gIHtPYmplY3R9IFtmcm9tT2JqZWN0XSBmcm9tT2JqZWN0IE9iamVjdCB0byBwdXQgdGhlIHByb3BlcnRpZXMgb24gdGhlIHRvT2JqZWN0XG4gKiBAcmV0dXJuIHtPYmplY3R9IHRoZSB0b09iamVjdFxuICovXG5leHBvcnRzLm1peCA9IGZ1bmN0aW9uKHRvT2JqZWN0LCBmcm9tT2JqZWN0KSB7XG4gICAgdmFyIHRvID0gdG9PYmplY3QgfHwge30sXG4gICAgICAgIGZyb20gPSBmcm9tT2JqZWN0IHx8IHt9LFxuICAgICAgICBwcm9wO1xuXG4gICAgZm9yIChwcm9wIGluIGZyb20pIHtcbiAgICAgICAgaWYgKGZyb20uaGFzT3duUHJvcGVydHkocHJvcCkgJiYgdG9bcHJvcF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdG9bcHJvcF0gPSBmcm9tW3Byb3BdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRvO1xufTtcblxuLyoqXG4gKiBJdGVyYXRlIG92ZXIgYW4gb2JqZWN0cyBwcm9wZXJ0aWVzXG4gKiBhcyBrZXkgdmFsdWUgXCJwYWlyc1wiIHdpdGggdGhlIHBhc3NlZCBpbiBmdW5jdGlvbi5cbiAqIFxuICAgIHZhciB0aGlzQXJnID0ge3ZhbDonYyd9O1xuICAgIEx1Yy5PYmplY3QuZWFjaCh7XG4gICAgICAgIHU6ICdMJ1xuICAgIH0sIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgY29uc29sZS5sb2codmFsdWUgKyBrZXkgKyB0aGlzLnZhbClcbiAgICB9LCB0aGlzQXJnKVxuICAgIFxuICAgID5MdWMgXG4gXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgb2JqICB0aGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3ZlclxuICogQHBhcmFtICB7RnVuY3Rpb259IGZuICAgdGhlIGZ1bmN0aW9uIHRvIGNhbGxcbiAqIEBwYXJhbSAge1N0cmluZ30gZm4ua2V5ICAgdGhlIG9iamVjdCBrZXlcbiAqIEBwYXJhbSAge09iamVjdH0gZm4udmFsdWUgICB0aGUgb2JqZWN0IHZhbHVlXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgW3RoaXNBcmddIFxuICogQHBhcmFtIHtPYmplY3R9ICBbY29uZmlnXVxuICogQHBhcmFtIHtCb29sZWFufSAgY29uZmlnLm93blByb3BlcnRpZXMgc2V0IHRvIGZhbHNlXG4gKiB0byBpdGVyYXRlIG92ZXIgYWxsIG9mIHRoZSBvYmplY3RzIGVudW1lcmFibGUgcHJvcGVydGllcy5cbiAqL1xuZXhwb3J0cy5lYWNoID0gZnVuY3Rpb24ob2JqLCBmbiwgdGhpc0FyZywgY29uZmlnKSB7XG4gICAgdmFyIGtleSwgdmFsdWUsXG4gICAgICAgIGFsbFByb3BlcnRpZXMgPSBjb25maWcgJiYgY29uZmlnLm93blByb3BlcnRpZXMgPT09IGZhbHNlO1xuXG4gICAgaWYgKGFsbFByb3BlcnRpZXMpIHtcbiAgICAgICAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgICAgICAgICBmbi5jYWxsKHRoaXNBcmcsIGtleSwgb2JqW2tleV0pO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBmbi5jYWxsKHRoaXNBcmcsIGtleSwgb2JqW2tleV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcblxuLyoqXG4gKiBUYWtlIGFuIGFycmF5IG9mIHN0cmluZ3MgYW5kIGFuIGFycmF5L2FyZ3VtZW50cyBvZlxuICogdmFsdWVzIGFuZCByZXR1cm4gYW4gb2JqZWN0IG9mIGtleSB2YWx1ZSBwYWlyc1xuICogYmFzZWQgb2ZmIGVhY2ggYXJyYXlzIGluZGV4LiAgSXQgaXMgdXNlZnVsIGZvciB0YWtpbmdcbiAqIGEgbG9uZyBsaXN0IG9mIGFyZ3VtZW50cyBhbmQgY3JlYXRpbmcgYW4gb2JqZWN0IHRoYXQgY2FuXG4gKiBiZSBwYXNzZWQgdG8gb3RoZXIgbWV0aG9kcy5cbiAqIFxuICAgIGZ1bmN0aW9uIGxvbmdBcmdzKGEsYixjLGQsZSxmKSB7XG4gICAgICAgIHJldHVybiBMdWMuT2JqZWN0LnRvT2JqZWN0KFsnYScsJ2InLCAnYycsICdkJywgJ2UnLCAnZiddLCBhcmd1bWVudHMpXG4gICAgfVxuXG4gICAgbG9uZ0FyZ3MoMSwyLDMsNCw1LDYsNyw4LDkpXG5cbiAgICA+T2JqZWN0IHthOiAxLCBiOiAyLCBjOiAzLCBkOiA0LCBlOiA14oCmfVxuICAgIGE6IDFcbiAgICBiOiAyXG4gICAgYzogM1xuICAgIGQ6IDRcbiAgICBlOiA1XG4gICAgZjogNlxuXG4gICAgbG9uZ0FyZ3MoMSwyLDMpXG5cbiAgICA+T2JqZWN0IHthOiAxLCBiOiAyLCBjOiAzLCBkOiB1bmRlZmluZWQsIGU6IHVuZGVmaW5lZOKApn1cbiAgICBhOiAxXG4gICAgYjogMlxuICAgIGM6IDNcbiAgICBkOiB1bmRlZmluZWRcbiAgICBlOiB1bmRlZmluZWRcbiAgICBmOiB1bmRlZmluZWRcblxuICogQHBhcmFtICB7U3RyaW5nW119IHN0cmluZ3NcbiAqIEBwYXJhbSAge0FycmF5L2FyZ3VtZW50c30gdmFsdWVzXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbmV4cG9ydHMudG9PYmplY3QgPSBmdW5jdGlvbihzdHJpbmdzLCB2YWx1ZXMpIHtcbiAgICB2YXIgb2JqID0ge30sXG4gICAgICAgIGkgPSAwLFxuICAgICAgICBsZW4gPSBzdHJpbmdzLmxlbmd0aDtcbiAgICBmb3IgKDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgIG9ialtzdHJpbmdzW2ldXSA9IHZhbHVlc1tpXTtcbiAgICB9XG5cbiAgICByZXR1cm4gb2JqO1xufTtcblxuLyoqXG4gKiBSZXR1cm4ga2V5IHZhbHVlIHBhaXJzIGZyb20gdGhlIG9iamVjdCBpZiB0aGVcbiAqIGZpbHRlckZuIHJldHVybnMgYSB0cnV0aHkgdmFsdWUuXG4gKlxuICAgIEx1Yy5PYmplY3QuZmlsdGVyKHtcbiAgICAgICAgYTogZmFsc2UsXG4gICAgICAgIGI6IHRydWUsXG4gICAgICAgIGM6IGZhbHNlXG4gICAgfSwgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4ga2V5ID09PSAnYScgfHwgdmFsdWVcbiAgICB9KVxuICAgID5be2tleTogJ2EnLCB2YWx1ZTogZmFsc2V9LCB7a2V5OiAnYicsIHZhbHVlOiB0cnVlfV1cblxuICAgIEx1Yy5PYmplY3QuZmlsdGVyKHtcbiAgICAgICAgYTogZmFsc2UsXG4gICAgICAgIGI6IHRydWUsXG4gICAgICAgIGM6IGZhbHNlXG4gICAgfSwgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4ga2V5ID09PSAnYScgfHwgdmFsdWVcbiAgICB9LCB1bmRlZmluZWQsIHtcbiAgICAgICAga2V5czogdHJ1ZVxuICAgIH0pXG4gICAgPlsnYScsICdiJ11cbiAqIFxuICogQHBhcmFtICB7T2JqZWN0fSAgIG9iaiAgdGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXJcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmaWx0ZXJGbiAgIHRoZSBmdW5jdGlvbiB0byBjYWxsLCByZXR1cm4gYSB0cnV0aHkgdmFsdWVcbiAqIHRvIGFkZCB0aGUga2V5IHZhbHVlIHBhaXJcbiAqIEBwYXJhbSAge1N0cmluZ30gZmlsdGVyRm4ua2V5ICAgdGhlIG9iamVjdCBrZXlcbiAqIEBwYXJhbSAge09iamVjdH0gZmlsdGVyRm4udmFsdWUgICB0aGUgb2JqZWN0IHZhbHVlXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgW3RoaXNBcmddIFxuICogQHBhcmFtIHtPYmplY3R9ICBbY29uZmlnXVxuICogQHBhcmFtIHtCb29sZWFufSAgY29uZmlnLm93blByb3BlcnRpZXMgc2V0IHRvIGZhbHNlXG4gKiB0byBpdGVyYXRlIG92ZXIgYWxsIG9mIHRoZSBvYmplY3RzIGVudW1lcmFibGUgcHJvcGVydGllcy5cbiAqIFxuICogQHBhcmFtIHtCb29sZWFufSAgY29uZmlnLmtleXMgc2V0IHRvIHRydWUgdG8gcmV0dXJuXG4gKiBqdXN0IHRoZSBrZXlzLlxuICpcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gIGNvbmZpZy52YWx1ZXMgc2V0IHRvIHRydWUgdG8gcmV0dXJuXG4gKiBqdXN0IHRoZSB2YWx1ZXMuXG4gKiBcbiAqIEByZXR1cm4ge09iamVjdFtdL1N0cmluZ1tdfSBBcnJheSBvZiBrZXkgdmFsdWUgcGFpcnMgaW4gdGhlIGZvcm1cbiAqIG9mIHtrZXk6ICdrZXknLCB2YWx1ZTogdmFsdWV9LiAgSWYga2V5cyBvciB2YWx1ZXMgaXMgdHJ1ZSBvbiB0aGUgY29uZmlnXG4gKiBqdXN0IHRoZSBrZXlzIG9yIHZhbHVlcyBhcmUgcmV0dXJuZWQuXG4gKlxuICovXG5leHBvcnRzLmZpbHRlciA9IGZ1bmN0aW9uKG9iaiwgZmlsdGVyRm4sIHRoaXNBcmcsIGMpIHtcbiAgICB2YXIgdmFsdWVzID0gW10sXG4gICAgICAgIGNvbmZpZyA9IGMgfHwge307XG5cbiAgICBleHBvcnRzLmVhY2gob2JqLCBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgIGlmIChmaWx0ZXJGbi5jYWxsKHRoaXNBcmcsIGtleSwgdmFsdWUpKSB7XG4gICAgICAgICAgICBpZiAoY29uZmlnLmtleXMgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZXMucHVzaChrZXkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb25maWcudmFsdWVzID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgdmFsdWVzLnB1c2godmFsdWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YWx1ZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAga2V5OiBrZXlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sIHRoaXNBcmcsIGNvbmZpZyk7XG5cbiAgICByZXR1cm4gdmFsdWVzO1xufTsiLCJ2YXIgb1RvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcclxuXHJcblxyXG4vKipcclxuICogQG1lbWJlciBMdWNcclxuICogUmV0dXJuIHRydWUgaWYgdGhlIHBhc3NlZCBpbiBvYmplY3QgaXMgb2ZcclxuICogdGhlIHR5cGUge0BsaW5rIEFycmF5IEFycmF5fVxyXG4gKiBAcGFyYW0gIHtPYmplY3R9ICBvYmogXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAqL1xyXG5mdW5jdGlvbiBpc0FycmF5KG9iaikge1xyXG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkob2JqKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBtZW1iZXIgTHVjXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoZSBwYXNzZWQgaW4gb2JqZWN0IGlzIG9mXHJcbiAqIHRoZSB0eXBlIHtAbGluayBPYmplY3QgT2JqZWN0fVxyXG4gKiBAcGFyYW0gIHtPYmplY3R9ICBvYmogXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAqL1xyXG5mdW5jdGlvbiBpc09iamVjdChvYmopIHtcclxuICAgIHJldHVybiBvYmogJiYgb1RvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAbWVtYmVyIEx1Y1xyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgcGFzc2VkIGluIG9iamVjdCBpcyBvZlxyXG4gKiB0aGUgdHlwZSB7QGxpbmsgRnVuY3Rpb24gRnVuY3Rpb259XHJcbiAqIEBwYXJhbSAge09iamVjdH0gIG9iaiBcclxuICogQHJldHVybiB7Qm9vbGVhbn1cclxuICovXHJcbmZ1bmN0aW9uIGlzRnVuY3Rpb24ob2JqKSB7XHJcbiAgICByZXR1cm4gb1RvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcclxufVxyXG5cclxuLyoqXHJcbiAqIEBtZW1iZXIgTHVjXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoZSBwYXNzZWQgaW4gb2JqZWN0IGlzIG9mXHJcbiAqIHRoZSB0eXBlIHtAbGluayBEYXRlIERhdGV9XHJcbiAqIEBwYXJhbSAge09iamVjdH0gIG9iaiBcclxuICogQHJldHVybiB7Qm9vbGVhbn1cclxuICovXHJcbmZ1bmN0aW9uIGlzRGF0ZShvYmopIHtcclxuICAgIHJldHVybiBvVG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBEYXRlXSc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAbWVtYmVyIEx1Y1xyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgcGFzc2VkIGluIG9iamVjdCBpcyBvZlxyXG4gKiB0aGUgdHlwZSB7QGxpbmsgUmVnRXhwIFJlZ0V4cH1cclxuICogQHBhcmFtICB7T2JqZWN0fSAgb2JqIFxyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKi9cclxuZnVuY3Rpb24gaXNSZWdFeHAob2JqKSB7XHJcbiAgICByZXR1cm4gb1RvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgUmVnRXhwXSc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAbWVtYmVyIEx1Y1xyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgcGFzc2VkIGluIG9iamVjdCBpcyBvZlxyXG4gKiB0aGUgdHlwZSB7QGxpbmsgTnVtYmVyIE51bWJlcn1cclxuICogQHBhcmFtICB7T2JqZWN0fSAgb2JqIFxyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKi9cclxuZnVuY3Rpb24gaXNOdW1iZXIob2JqKSB7XHJcbiAgICByZXR1cm4gb1RvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgTnVtYmVyXSc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAbWVtYmVyIEx1Y1xyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgcGFzc2VkIGluIG9iamVjdCBpcyBvZlxyXG4gKiB0aGUgdHlwZSB7QGxpbmsgU3RyaW5nIFN0cmluZ31cclxuICogQHBhcmFtICB7T2JqZWN0fSAgb2JqIFxyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKi9cclxuZnVuY3Rpb24gaXNTdHJpbmcob2JqKSB7XHJcbiAgICByZXR1cm4gb1RvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgU3RyaW5nXSc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAbWVtYmVyIEx1Y1xyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgcGFzc2VkIGluIG9iamVjdCBpcyBvZlxyXG4gKiB0aGUgdHlwZSBhcmd1bWVudHMuXHJcbiAqIFxyXG4gKiBAcGFyYW0gIHtPYmplY3R9ICBvYmogXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAqL1xyXG5mdW5jdGlvbiBpc0FyZ3VtZW50cyhvYmopIHtcclxuICAgIHJldHVybiBvVG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBBcmd1bWVudHNdJyB8fCBvYmogJiYgISFvYmouY2FsbGVlO1xyXG59XHJcblxyXG4vKipcclxuICogQG1lbWJlciBMdWNcclxuICogUmV0dXJuIHRydWUgaWYgdGhlIG9iamVjdCBpcyBmYWxzeSBidXQgbm90IHplcm8uXHJcbiAgICBMdWMuaXNGYWxzeShmYWxzZSlcclxuICAgID50cnVlXHJcbiAgICBMdWMuaXNGYWxzeSgwKVxyXG4gICAgPmZhbHNlXHJcbiAqIEBwYXJhbSAge09iamVjdH0gIG9ialxyXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgICAgXHJcbiAqL1xyXG5mdW5jdGlvbiBpc0ZhbHN5KG9iaikge1xyXG4gICAgcmV0dXJuICghb2JqICYmIG9iaiAhPT0gMCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAbWVtYmVyIEx1Y1xyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgb2JqZWN0IGlzIGVtcHR5LlxyXG4gKiB7fSwgW10sICcnLGZhbHNlLCBudWxsLCB1bmRlZmluZWQsIE5hTiBcclxuICogYXJlIGFsbCB0cmVhdGVkIGFzIGVtcHR5LlxyXG4gKiBcclxuICAgIEx1Yy5pc0VtcHR5KHRydWUpXHJcbiAgICA+ZmFsc2VcclxuICAgIEx1Yy5pc0VtcHR5KFtdKVxyXG4gICAgPnRydWVcclxuICAgIFxyXG4gKiBAcGFyYW0gIHtPYmplY3R9ICBvYmpcclxuICogQHJldHVybiB7Qm9vbGVhbn1cclxuICovXHJcbmZ1bmN0aW9uIGlzRW1wdHkob2JqKSB7XHJcbiAgICB2YXIgZW1wdHkgPSBmYWxzZTtcclxuXHJcbiAgICBpZiAoaXNGYWxzeShvYmopKSB7XHJcbiAgICAgICAgZW1wdHkgPSB0cnVlO1xyXG4gICAgfSBlbHNlIGlmIChpc0FycmF5KG9iaikpIHtcclxuICAgICAgICBlbXB0eSA9IG9iai5sZW5ndGggPT09IDA7XHJcbiAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KG9iaikpIHtcclxuICAgICAgICBlbXB0eSA9IE9iamVjdC5rZXlzKG9iaikubGVuZ3RoID09PSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBlbXB0eTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBpc0FycmF5OiBpc0FycmF5LFxyXG4gICAgaXNPYmplY3Q6IGlzT2JqZWN0LFxyXG4gICAgaXNGdW5jdGlvbjogaXNGdW5jdGlvbixcclxuICAgIGlzRGF0ZTogaXNEYXRlLFxyXG4gICAgaXNTdHJpbmc6IGlzU3RyaW5nLFxyXG4gICAgaXNOdW1iZXI6IGlzTnVtYmVyLFxyXG4gICAgaXNSZWdFeHA6IGlzUmVnRXhwLFxyXG4gICAgaXNBcmd1bWVudHM6IGlzQXJndW1lbnRzLFxyXG4gICAgaXNGYWxzeTogaXNGYWxzeSxcclxuICAgIGlzRW1wdHk6IGlzRW1wdHlcclxufTsiLCJ2YXIgaWRzID0ge307XG4vKipcbiAqIEBtZW1iZXIgTHVjXG4gKiBAbWV0aG9kIGlkXG4gKiBcbiAqIFJldHVybiBhIHVuaXF1ZSBpZC5cbiAqIEBwYXJhbSB7U3RyaW5nfSBbcHJlZml4XSBPcHRpb25hbCBwcmVmaXggdG8gdXNlXG4gKlxuICpcbiAgICAgICAgTHVjLmlkKClcbiAgICAgICAgPlwibHVjLTBcIlxuICAgICAgICBMdWMuaWQoKVxuICAgICAgICA+XCJsdWMtMVwiXG4gICAgICAgIEx1Yy5pZCgnbXktcHJlZml4JylcbiAgICAgICAgPlwibXktcHJlZml4MFwiXG4gICAgICAgIEx1Yy5pZCgnJylcbiAgICAgICAgPlwiMFwiXG4gKlxuICogQHJldHVybiB7U3RyaW5nfVxuICpcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihwKSB7XG4gICAgdmFyIHByZWZpeCA9IHAgPT09IHVuZGVmaW5lZCA/ICdsdWMtJyA6IHA7XG5cbiAgICBpZihpZHNbcHJlZml4XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlkc1twcmVmaXhdID0gMDtcbiAgICB9XG5cbiAgICByZXR1cm4gcHJlZml4ICsgaWRzW3ByZWZpeF0rKztcbn07IiwicmVxdWlyZSgnLi9ub2RlX21vZHVsZXMvZXM1LXNoaW0vZXM1LXNoaW0nKTtcbnJlcXVpcmUoJy4vbm9kZV9tb2R1bGVzL2VzNS1zaGltL2VzNS1zaGFtJyk7IiwidmFyIGlzID0gcmVxdWlyZSgnLi9pcycpLFxuICAgIGFJbnNlcnQgPSByZXF1aXJlKCcuL2FycmF5JykuaW5zZXJ0LFxuICAgIGFFYWNoID0gcmVxdWlyZSgnLi9hcnJheScpLmVhY2g7XG5cbi8qKlxuICogQGNsYXNzIEx1Yy5GdW5jdGlvblxuICogUGFja2FnZSBmb3IgZnVuY3Rpb24gbWV0aG9kcy4gIE1vc3Qgb2YgdGhlbSBmb2xsb3cgdGhlIHNhbWUgYXBpOlxuICogZnVuY3Rpb24gb3IgZnVuY3Rpb25bXSwgcmVsZXZhbnQgYXJncyAuLi4gd2l0aCBhbiBvcHRpb25hbCBjb25maWdcbiAqIHRvIEx1Yy5GdW5jdGlvbi5jcmVhdGVBdWdtZW50ZXIgYXMgdGhlIGxhc3QgYXJndW1lbnQuXG4gKi9cblxuZnVuY3Rpb24gX2F1Z21lbnRBcmdzKGNvbmZpZywgY2FsbEFyZ3MpIHtcbiAgICB2YXIgY29uZmlnQXJncyA9IGNvbmZpZy5hcmdzLFxuICAgICAgICBpbmRleCA9IGNvbmZpZy5pbmRleCxcbiAgICAgICAgYXJnc0FycmF5O1xuXG4gICAgaWYgKCFjb25maWdBcmdzKSB7XG4gICAgICAgIHJldHVybiBjYWxsQXJncztcbiAgICB9XG5cbiAgICBpZihpbmRleCA9PT0gdHJ1ZSB8fCBpcy5pc051bWJlcihpbmRleCkpIHtcbiAgICAgICAgaWYoY29uZmlnLmFyZ3VtZW50c0ZpcnN0ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuIGFJbnNlcnQoY29uZmlnQXJncywgY2FsbEFyZ3MsIGluZGV4KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYUluc2VydChjYWxsQXJncywgY29uZmlnQXJncywgaW5kZXgpO1xuICAgIH1cblxuICAgIHJldHVybiBjb25maWdBcmdzO1xufVxuXG4vKipcbiAqIEEgcmV1c2FibGUgZW1wdHkgZnVuY3Rpb25cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5leHBvcnRzLmVtcHR5Rm4gPSBmdW5jdGlvbigpIHt9O1xuXG4vKipcbiAqIEEgZnVuY3Rpb24gdGhhdCB0aHJvd3MgYW4gZXJyb3Igd2hlbiBjYWxsZWQuXG4gKiBVc2VmdWwgd2hlbiBkZWZpbmluZyBhYnN0cmFjdCBsaWtlIGNsYXNzZXNcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5leHBvcnRzLmFic3RyYWN0Rm4gPSBmdW5jdGlvbigpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2Fic3RyYWN0Rm4gbXVzdCBiZSBpbXBsZW1lbnRlZCcpO1xufTtcblxuLyoqXG4gKiBBdWdtZW50IHRoZSBwYXNzZWQgaW4gZnVuY3Rpb24ncyB0aGlzQXJnIGFuZCBvciBhcmd1bWVudHMgb2JqZWN0IFxuICogYmFzZWQgb24gdGhlIHBhc3NlZCBpbiBjb25maWcuXG4gKiBcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmbiB0aGUgZnVuY3Rpb24gdG8gY2FsbFxuICogQHBhcmFtICB7T2JqZWN0fSBjb25maWdcbiAqIFxuICogQHBhcmFtIHtPYmplY3R9IFtjb25maWcudGhpc0FyZ10gdGhlIHRoaXNBcmcgZm9yIHRoZSBmdW5jdGlvbiBiZWluZyBleGVjdXRlZC5cbiAqIElmIHRoaXMgaXMgdGhlIG9ubHkgcHJvcGVydHkgb24geW91ciBjb25maWcgb2JqZWN0IHRoZSBwcmVmZXJyZWQgd2F5IHdvdWxkXG4gKiBiZSBqdXN0IHRvIHVzZSBGdW5jdGlvbi5iaW5kXG4gKiBcbiAqIEBwYXJhbSB7QXJyYXl9IFtjb25maWcuYXJnc10gdGhlIGFyZ3VtZW50cyB1c2VkIGZvciB0aGUgZnVuY3Rpb24gYmVpbmcgZXhlY3V0ZWQuXG4gKiBUaGlzIHdpbGwgcmVwbGFjZSB0aGUgZnVuY3Rpb25zIGNhbGwgYXJncyBpZiBpbmRleCBpcyBub3QgYSBudW1iZXIgb3IgXG4gKiB0cnVlLlxuICogXG4gKiBAcGFyYW0ge051bWJlci9UcnVlfSBbY29uZmlnLmluZGV4XSBCeSBkZWZhdWx0IHRoZSB0aGUgY29uZmlndXJlZCBhcmd1bWVudHNcbiAqIHdpbGwgYmUgaW5zZXJ0ZWQgaW50byB0aGUgZnVuY3Rpb25zIHBhc3NlZCBpbiBjYWxsIGFyZ3VtZW50cy4gIElmIGluZGV4IGlzIHRydWVcbiAqIGFwcGVuZCB0aGUgYXJncyB0b2dldGhlciBpZiBpdCBpcyBhIG51bWJlciBpbnNlcnQgaXQgYXQgdGhlIHBhc3NlZCBpbiBpbmRleC5cbiAqIFxuICogQHBhcmFtIHtBcnJheX0gW2NvbmZpZy5hcmd1bWVudHNGaXJzdF0gcGFzcyBpbiBmYWxzZSB0byBcbiAqIGF1Z21lbnQgdGhlIGNvbmZpZ3VyZWQgYXJncyBmaXJzdCB3aXRoIEx1Yy5BcnJheS5pbnNlcnQuICBEZWZhdWx0c1xuICogdG8gdHJ1ZVxuICAgICBcbiAgICAgZnVuY3Rpb24gZm4oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMpXG4gICAgICAgIGNvbnNvbGUubG9nKGFyZ3VtZW50cylcbiAgICB9XG4gICAgXG4gICAgLy9MdWMuQXJyYXkuaW5zZXJ0KFs0XSwgWzEsMiwzXSwgMClcbiAgICBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudGVyKGZuLCB7XG4gICAgICAgIHRoaXNBcmc6IHtjb25maWdlZFRoaXNBcmc6IHRydWV9LFxuICAgICAgICBhcmdzOiBbMSwyLDNdLFxuICAgICAgICBpbmRleDowXG4gICAgfSkoNClcblxuICAgID5PYmplY3Qge2NvbmZpZ2VkVGhpc0FyZzogdHJ1ZX1cbiAgICA+WzEsIDIsIDMsIDRdXG5cbiAgICAvL0x1Yy5BcnJheS5pbnNlcnQoWzEsMiwzXSwgWzRdLCAwKVxuICAgIEx1Yy5GdW5jdGlvbi5jcmVhdGVBdWdtZW50ZXIoZm4sIHtcbiAgICAgICAgdGhpc0FyZzoge2NvbmZpZ2VkVGhpc0FyZzogdHJ1ZX0sXG4gICAgICAgIGFyZ3M6IFsxLDIsM10sXG4gICAgICAgIGluZGV4OjAsXG4gICAgICAgIGFyZ3VtZW50c0ZpcnN0OmZhbHNlXG4gICAgfSkoNClcblxuICAgID5PYmplY3Qge2NvbmZpZ2VkVGhpc0FyZzogdHJ1ZX1cbiAgICA+WzQsIDEsIDIsIDNdXG5cbiAgICBMdWMuQXJyYXkuaW5zZXJ0KFs0XSwgWzEsMiwzXSwgIHRydWUpXG4gICAgdmFyIGYgPSBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudGVyKGZuLCB7XG4gICAgICAgIGFyZ3M6IFsxLDIsM10sXG4gICAgICAgIGluZGV4OiB0cnVlXG4gICAgfSk7XG5cbiAgICBmLmFwcGx5KHtjb25maWc6IGZhbHNlfSwgWzRdKVxuXG4gICAgPk9iamVjdCB7Y29uZmlnOiBmYWxzZX1cbiAgICA+WzQsIDEsIDIsIDNdXG5cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSB0aGUgYXVnbWVudGVkIGZ1bmN0aW9uLlxuICovXG5leHBvcnRzLmNyZWF0ZUF1Z21lbnRlciA9IGZ1bmN0aW9uKGZuLCBjb25maWcpIHtcbiAgICB2YXIgdGhpc0FyZyA9IGNvbmZpZy50aGlzQXJnO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpc0FyZyB8fCB0aGlzLCBfYXVnbWVudEFyZ3MoY29uZmlnLCBhcmd1bWVudHMpKTtcbiAgICB9O1xufTtcblxuZnVuY3Rpb24gX2luaXRTZXF1ZW5jZUZ1bmN0aW9ucyhmbnMsIGNvbmZpZykge1xuICAgIHZhciB0b1J1biA9IFtdO1xuICAgIGFFYWNoKGZucywgZnVuY3Rpb24oZikge1xuICAgICAgICB2YXIgZm4gPSBmO1xuXG4gICAgICAgIGlmIChjb25maWcpIHtcbiAgICAgICAgICAgIGZuID0gZXhwb3J0cy5jcmVhdGVBdWdtZW50ZXIoZiwgY29uZmlnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRvUnVuLnB1c2goZm4pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRvUnVuO1xufVxuXG4vKipcbiAqIFJldHVybiBhIGZ1bmN0aW9uIHRoYXQgcnVucyB0aGUgcGFzc2VkIGluIGZ1bmN0aW9uc1xuICogYW5kIHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgbGFzdCBmdW5jdGlvbiBjYWxsZWQuXG4gKiBcbiAqIEBwYXJhbSAge0Z1bmN0aW9uW119IGZucyBcbiAqIEBwYXJhbSAge09iamVjdH0gW2NvbmZpZ10gQ29uZmlnIG9iamVjdFxuICogZm9yIEx1Yy5GdW5jdGlvbi5jcmVhdGVBdWdtZW50ZXIuICBJZiBkZWZpbmVkIGFsbCBvZiB0aGUgZnVuY3Rpb25zXG4gKiB3aWxsIGdldCBjcmVhdGVkIHdpdGggdGhlIHBhc3NlZCBpbiBjb25maWc7XG4gKlxuICAgIEx1Yy5GdW5jdGlvbi5jcmVhdGVTZXF1ZW5jZShbXG4gICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coMSlcbiAgICAgICAgfSxcbiAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygyKVxuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKDMpXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZmluaXNoZWQgbG9nZ2luZycpXG4gICAgICAgICAgICByZXR1cm4gNDtcbiAgICAgICAgfVxuICAgIF0pKClcbiAgICA+MVxuICAgID4yXG4gICAgPjNcbiAgICA+ZmluaXNoZWQgbG9nZ2luZ1xuICAgID40XG4gKiBcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5leHBvcnRzLmNyZWF0ZVNlcXVlbmNlID0gZnVuY3Rpb24oZm5zLCBjb25maWcpIHtcbiAgICB2YXIgZnVuY3Rpb25zID0gX2luaXRTZXF1ZW5jZUZ1bmN0aW9ucyhmbnMsIGNvbmZpZyk7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpID0gMCxcbiAgICAgICAgICAgIGxhc3RGbkluZGV4ID0gZnVuY3Rpb25zLmxlbmd0aCAtMTtcblxuICAgICAgICBmb3IoO2kgPCBsYXN0Rm5JbmRleDsgKytpKSB7XG4gICAgICAgICAgICBmdW5jdGlvbnNbaV0uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbnNbbGFzdEZuSW5kZXhdLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbn07XG5cbi8qKlxuICogUmV0dXJuIGEgZnVuY3Rpb24gdGhhdCBydW5zIHRoZSBwYXNzZWQgaW4gZnVuY3Rpb25zXG4gKiBpZiBvbmUgb2YgdGhlIGZ1bmN0aW9ucyByZXR1cm5zIGZhbHNlIHRoZSByZXN0IG9mIHRoZSBcbiAqIGZ1bmN0aW9ucyB3b24ndCBydW4gYW5kIGZhbHNlIHdpbGwgYmUgcmV0dXJuZWQuXG4gKlxuICogSWYgbm8gZmFsc2UgaXMgcmV0dXJuZWQgdGhlIHZhbHVlIG9mIHRoZSBsYXN0IGZ1bmN0aW9uIHJldHVybiB3aWxsIGJlIHJldHVybmVkXG4gKiBcbiAgICBMdWMuRnVuY3Rpb24uY3JlYXRlU2VxdWVuY2VJZihbXG4gICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coMSlcbiAgICAgICAgfSxcbiAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygyKVxuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKDMpXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZmluaXNoZWQgbG9nZ2luZycpXG4gICAgICAgICAgICByZXR1cm4gNDtcbiAgICAgICAgfSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2kgY2FudCBsb2cnKVxuICAgICAgICB9XG4gICAgXSkoKVxuXG4gICAgPjFcbiAgICA+MlxuICAgID4zXG4gICAgPmZpbmlzaGVkIGxvZ2dpbmdcbiAgICA+ZmFsc2VcbiAqXG4gKiBcbiAqIEBwYXJhbSAge0Z1bmN0aW9uW119IGZucyBcbiAqIEBwYXJhbSAge09iamVjdH0gW2NvbmZpZ10gQ29uZmlnIG9iamVjdFxuICogZm9yIEx1Yy5GdW5jdGlvbi5jcmVhdGVBdWdtZW50ZXIuICBJZiBkZWZpbmVkIGFsbCBvZiB0aGUgZnVuY3Rpb25zXG4gKiB3aWxsIGdldCBjcmVhdGVkIHdpdGggdGhlIHBhc3NlZCBpbiBjb25maWc7XG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZXhwb3J0cy5jcmVhdGVTZXF1ZW5jZUlmID0gZnVuY3Rpb24oZm5zLCBjb25maWcpIHtcbiAgICB2YXIgZnVuY3Rpb25zID0gX2luaXRTZXF1ZW5jZUZ1bmN0aW9ucyhmbnMsIGNvbmZpZyk7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB2YWx1ZSxcbiAgICAgICAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG5cbiAgICAgICAgZnVuY3Rpb25zLnNvbWUoZnVuY3Rpb24oZm4pe1xuICAgICAgICAgICAgdmFsdWUgPSBmbi5hcHBseSh0aGlzLCBhcmdzKTtcblxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlID09PSBmYWxzZTtcbiAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH07XG59O1xuXG4vKipcbiAqIFJldHVybiBhIGZ1bmN0aW9ucyB0aGF0IHJ1bnMgdGhlIHBhc3NlZCBpbiBmdW5jdGlvbnNcbiAqIHRoZSByZXN1bHQgb2YgZWFjaCBmdW5jdGlvbiB3aWxsIGJlIHRoZSB0aGUgY2FsbCBhcmdzIFxuICogZm9yIHRoZSBuZXh0IGZ1bmN0aW9uLiAgVGhlIHZhbHVlIG9mIHRoZSBsYXN0IGZ1bmN0aW9uIFxuICogcmV0dXJuIHdpbGwgYmUgcmV0dXJuZWQuXG4gKiBcbiAgICAgXG4gICAgIEx1Yy5GdW5jdGlvbi5jcmVhdGVSZWxheWVyKFtcbiAgICAgICAgZnVuY3Rpb24oc3RyKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RyICsgJ2InXG4gICAgICAgIH0sXG4gICAgICAgIGZ1bmN0aW9uKHN0cikge1xuICAgICAgICAgICAgcmV0dXJuIHN0ciArICdjJ1xuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbihzdHIpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHIgKyAnZCdcbiAgICAgICAgfVxuICAgIF0pKCdhJylcblxuICAgID5cImFiY2RcIlxuXG4gKiBAcGFyYW0gIHtGdW5jdGlvbltdfSBmbnMgXG4gKiBAcGFyYW0gIHtPYmplY3R9IFtjb25maWddIENvbmZpZyBvYmplY3RcbiAqIGZvciBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudGVyLiAgSWYgZGVmaW5lZCBhbGwgb2YgdGhlIGZ1bmN0aW9uc1xuICogd2lsbCBnZXQgY3JlYXRlZCB3aXRoIHRoZSBwYXNzZWQgaW4gY29uZmlnO1xuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbmV4cG9ydHMuY3JlYXRlUmVsYXllciA9IGZ1bmN0aW9uKGZucywgY29uZmlnKSB7XG4gICAgdmFyIGZ1bmN0aW9ucyA9IF9pbml0U2VxdWVuY2VGdW5jdGlvbnMoZm5zLCBjb25maWcpO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdmFsdWUsXG4gICAgICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgICAgIGZ1bmN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKGZuLCBpbmRleCkge1xuICAgICAgICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBmbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBmbi5hcHBseSh0aGlzLCBbdmFsdWVdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH07XG59O1xuXG4vKipcbiAqIENyZWF0ZSBhIHRocm90dGxlZCBmdW5jdGlvbiBmcm9tIHRoZSBwYXNzZWQgaW4gZnVuY3Rpb25cbiAqIHRoYXQgd2lsbCBvbmx5IGdldCBjYWxsZWQgb25jZSB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kc1xuICogaGF2ZSBiZWVuIGV4Y2VlZGVkLlxuICogXG4gICAgdmFyIGxvZ0FyZ3MgID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGFyZ3VtZW50cylcbiAgICB9O1xuXG4gICAgdmFyIGEgPSBMdWMuRnVuY3Rpb24uY3JlYXRlVGhyb3R0bGVkKGxvZ0FyZ3MsIDEpO1xuXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IDEwMDsgKytpKSB7XG4gICAgICAgIGEoMSwyLDMpO1xuICAgIH1cblxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGEoMSlcbiAgICB9LCAxMDApXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgYSgyKVxuICAgIH0sIDQwMClcblxuICAgID5bMSwgMiwgM11cbiAgICA+WzFdXG4gICAgPlsyXVxuICogXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gZm5cbiAqIEBwYXJhbSAge051bWJlcn0gbWlsbGlzIE51bWJlciBvZiBtaWxsaXNlY29uZHMgdG9cbiAqIHRocm90dGxlIHRoZSBmdW5jdGlvbi5cbiAqIEBwYXJhbSAge09iamVjdH0gW2NvbmZpZ10gQ29uZmlnIG9iamVjdFxuICogZm9yIEx1Yy5GdW5jdGlvbi5jcmVhdGVBdWdtZW50ZXIuICBJZiBkZWZpbmVkIGFsbCBvZiB0aGUgZnVuY3Rpb25zXG4gKiB3aWxsIGdldCBjcmVhdGVkIHdpdGggdGhlIHBhc3NlZCBpbiBjb25maWc7XG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZXhwb3J0cy5jcmVhdGVUaHJvdHRsZWQgPSBmdW5jdGlvbihmLCBtaWxsaXMsIGNvbmZpZykge1xuICAgIHZhciBmbiA9IGNvbmZpZyA/IGV4cG9ydHMuY3JlYXRlQXVnbWVudGVyKGYsIGNvbmZpZykgOiBmLFxuICAgICAgICB0aW1lT3V0SWQgPSBmYWxzZTtcblxuICAgIGlmKCFtaWxsaXMpIHtcbiAgICAgICAgcmV0dXJuIGZuO1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG5cbiAgICAgICAgaWYodGltZU91dElkKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZU91dElkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRpbWVPdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aW1lT3V0SWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICB9LCBtaWxsaXMpO1xuICAgIH07XG59O1xuXG4vKipcbiAqIERlZmVyIGEgZnVuY3Rpb24ncyBleGVjdXRpb24gZm9yIHRoZSBwYXNzZWQgaW5cbiAqIG1pbGxpc2Vjb25kcy5cbiAqIFxuICogQHBhcmFtICB7RnVuY3Rpb259IGZuXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IG1pbGxpcyBOdW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvXG4gKiBkZWZlclxuICogQHBhcmFtICB7T2JqZWN0fSBbY29uZmlnXSBDb25maWcgb2JqZWN0XG4gKiBmb3IgTHVjLkZ1bmN0aW9uLmNyZWF0ZUF1Z21lbnRlci4gIElmIGRlZmluZWQgYWxsIG9mIHRoZSBmdW5jdGlvbnNcbiAqIHdpbGwgZ2V0IGNyZWF0ZWQgd2l0aCB0aGUgcGFzc2VkIGluIGNvbmZpZztcbiAqIFxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbmV4cG9ydHMuY3JlYXRlRGVmZXJyZWQgPSBmdW5jdGlvbihmLCBtaWxsaXMsIGNvbmZpZykge1xuICAgIHZhciBmbiA9IGNvbmZpZyA/IGV4cG9ydHMuY3JlYXRlQXVnbWVudGVyKGYsIGNvbmZpZykgOiBmO1xuXG4gICAgaWYoIW1pbGxpcykge1xuICAgICAgICByZXR1cm4gZm47XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcblxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZm4uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgIH0sIG1pbGxpcyk7XG4gICAgfTtcbn07IiwidmFyIGFycmF5U2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UsXG4gICAgY29tcGFyZSA9IHJlcXVpcmUoJy4vY29tcGFyZScpLFxuICAgIGlzID0gcmVxdWlyZSgnLi9pcycpLFxuICAgIGNvbXBhcmUgPSBjb21wYXJlLmNvbXBhcmU7XG5cbmZ1bmN0aW9uIF9jcmVhdGVJdGVyYXRvckZuKGZuLCBjKSB7XG4gICAgdmFyIGNvbmZpZyA9IGMgfHwge307XG5cbiAgICBpZihpcy5pc0Z1bmN0aW9uKGZuKSAmJiAoY29uZmlnLnR5cGUgIT09ICdzdHJpY3QnKSkge1xuICAgICAgICByZXR1cm4gYyA/IGZuLmJpbmQoYykgOiBmbjtcbiAgICB9XG5cbiAgICBpZihjb25maWcudHlwZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbmZpZy50eXBlID0gJ2xvb3NlJztcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGNvbXBhcmUoZm4sIHZhbHVlLCBjb25maWcpO1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIF9jcmVhdGVJdGVyYXRvck5vdEZuKGZuLCBjb25maWcpIHtcbiAgICB2YXIgZnVuY3Rpb25Ub05vdCA9IF9jcmVhdGVJdGVyYXRvckZuKGZuLCBjb25maWcpO1xuICAgICAgICBcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAhZnVuY3Rpb25Ub05vdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG59XG5cblxuLyoqXG4gKiBAY2xhc3MgTHVjLkFycmF5IFxuICogUGFja2FnZSBmb3IgQXJyYXkgbWV0aG9kcy4gPGJyPlxuICogXG4gKiBLZWVwIGluIG1pbmQgdGhhdCBMdWMgaXMgb3B0aW9uYWxseSBwYWNrYWdlZCB3aXRoIGVzNSBzaGltIHNvIHlvdSBjYW4gd3JpdGUgZXM1IGNvZGUgaW4gbm9uIGVzNSBicm93c2Vycy5cbiAqIEl0IGNvbWVzIHdpdGggeW91ciBmYXZvcml0ZSB7QGxpbmsgQXJyYXkgQXJyYXl9IG1ldGhvZHMgc3VjaCBhcyBBcnJheS5mb3JFYWNoLCBBcnJheS5maWx0ZXIsIEFycmF5LnNvbWUsIEFycmF5LmV2ZXJ5IEFycmF5LnJlZHVjZVJpZ2h0IC4uXG4gKlxuICogQWxzbyBkb24ndCBmb3JnZXQgYWJvdXQgTHVjLkFycmF5LmVhY2ggYW5kIEx1Yy5BcnJheS50b0FycmF5LCB0aGV5IGFyZSBncmVhdCB1dGlsaXR5IG1ldGhvZHNcbiAqIHRoYXQgYXJlIHVzZWQgYWxsIG92ZXIgdGhlIGZyYW1ld29yay5cbiAqIFxuICogQWxsIHJlbW92ZVxcKiAvIGZpbmRcXCogbWV0aG9kcyBmb2xsb3cgdGhlIHNhbWUgYXBpLiAgXFwqQWxsIGZ1bmN0aW9ucyB3aWxsIHJldHVybiBhbiBhcnJheSBvZiByZW1vdmVkIG9yIGZvdW5kXG4gKiBpdGVtcy4gIFRoZSBpdGVtcyB3aWxsIGJlIGFkZGVkIHRvIHRoZSBhcnJheSBpbiB0aGUgb3JkZXIgdGhleSBhcmVcbiAqIGZvdW5kLiAgXFwqRmlyc3QgZnVuY3Rpb25zIHdpbGwgcmV0dXJuIHRoZSBmaXJzdCBpdGVtIGFuZCBzdG9wIGl0ZXJhdGluZyBhZnRlciB0aGF0LCBpZiBub25lXG4gKiAgaXMgZm91bmQgZmFsc2UgaXMgcmV0dXJuZWQuICByZW1vdmVcXCogZnVuY3Rpb25zIHdpbGwgZGlyZWN0bHkgY2hhbmdlIHRoZSBwYXNzZWQgaW4gYXJyYXkuXG4gKiAgXFwqTm90IGZ1bmN0aW9ucyBvbmx5IGRvIHRoZSBmb2xsb3dpbmcgYWN0aW9ucyBpZiB0aGUgY29tcGFyaXNvbiBpcyBub3QgdHJ1ZS5cbiAqICBBbGwgcmVtb3ZlXFwqIC8gZmluZFxcKiB0YWtlIHRoZSBmb2xsb3dpbmcgYXBpOiBhcnJheSwgb2JqZWN0VG9Db21wYXJlT3JJdGVyYXRvciwgY29tcGFyZUNvbmZpZ09yVGhpc0FyZyA8YnI+Zm9yIGV4YW1wbGU6XG4gKlxuICAgIC8vbW9zdCBjb21tb24gdXNlIGNhc2VcbiAgICBMdWMuQXJyYXkuZmluZEZpcnN0KFsxLDIsMywge31dLCB7fSk7XG4gICAgPk9iamVjdCB7fVxuXG4gICAgLy9wYXNzIGluIG9wdGlvbmFsIGNvbmZpZyBmb3IgYSBzdHJpY3QgPT09IGNvbXBhcmlzb25cbiAgICBMdWMuQXJyYXkuZmluZEZpcnN0KFsxLDIsMyx7fV0sIHt9LCB7dHlwZTogJ3N0cmljdCd9KTtcbiAgICA+ZmFsc2VcblxuICAgIC8vcGFzcyBpbiBhbiBpdGVyYXRvciBhbmQgdGhpc0FyZ1xuICAgIEx1Yy5BcnJheS5maW5kRmlyc3QoWzEsMiwzLHt9XSwgZnVuY3Rpb24odmFsLCBpbmRleCwgYXJyYXkpe1xuICAgICAgICByZXR1cm4gdmFsID09PSAzIHx8IHRoaXMubnVtID09PSB2YWw7XG4gICAgfSwge251bTogMX0pO1xuICAgID4xXG4gICAgXG4gICAgLy95b3UgY2FuIHNlZSByZW1vdmUgbW9kaWZpZXMgdGhlIHBhc3NlZCBpbiBhcnJheS5cbiAgICB2YXIgYXJyID0gWzEsMix7YToxfSwxLCB7YToxfV07XG4gICAgTHVjLkFycmF5LnJlbW92ZUZpcnN0KGFyciwge2E6MX0pXG4gICAgPnthOjF9XG4gICAgYXJyO1xuICAgID5bMSwgMiwgMSwge2E6MX1dXG4gICAgTHVjLkFycmF5LnJlbW92ZUxhc3QoYXJyLCAxKVxuICAgID4xXG4gICAgYXJyO1xuICAgID5bMSwyLCB7YToxfV1cbiAgICBcbiAgICBcbiAgICBMdWMuQXJyYXkuZmluZEFsbChbMSwyLDMsIHthOjEsYjoyfV0sIGZ1bmN0aW9uKCkge3JldHVybiB0cnVlO30pXG4gICAgPiBbMSwyLDMsIHthOjEsYjoyfV1cbiAgICAvL3Nob3cgaG93IG5vdCB3b3JrcyB3aXRoIGFuIGl0ZXJhdG9yXG4gICAgTHVjLkFycmF5LmZpbmRBbGxOb3QoWzEsMiwzLCB7YToxLGI6Mn1dLCBmdW5jdGlvbigpIHtyZXR1cm4gdHJ1ZTt9KVxuICAgID5bXVxuICpcbiAqIEZvciBjb21tb25seSB1c2VkIGZpbmQvcmVtb3ZlIGZ1bmN0aW9ucyBjaGVjayBvdXQgTHVjLkFycmF5Rm5zIGZvciBleGFtcGxlIGFcbiAqIFwiY29tcGFjdFwiIGxpa2UgZnVuY3Rpb25cbiAqIFxuICAgIEx1Yy5BcnJheS5maW5kQWxsTm90RmFsc3koW2ZhbHNlLCAnJywgdW5kZWZpbmVkLCAwLCB7fSwgW11dKVxuICAgID5bMCwge30sIFtdXVxuICpcbiAqIE9yIHJlbW92ZSBhbGwgZW1wdHkgaXRlbXNcbiAqIFxuICAgIHZhciBhcnIgPSBbJycsIDAgLCBbXSwge2E6MX0sIHRydWUsIHt9LCBbMV1dXG4gICAgTHVjLkFycmF5LnJlbW92ZUFsbEVtcHR5KGFycilcbiAgICA+WycnLCBbXSwge31dXG4gICAgYXJyXG4gICAgPlswLCB7YToxfSwgdHJ1ZSwgWzFdXVxuICovXG5cbi8qKlxuICogVHVybiB0aGUgcGFzc2VkIGluIGl0ZW0gaW50byBhbiBhcnJheSBpZiBpdFxuICogaXNuJ3Qgb25lIGFscmVhZHksIGlmIHRoZSBpdGVtIGlzIGFuIGFycmF5IGp1c3QgcmV0dXJuIGl0LiAgXG4gKiBJdCByZXR1cm5zIGFuIGVtcHR5IGFycmF5IGlmIGl0ZW0gaXMgbnVsbCBvciB1bmRlZmluZWQuXG4gKiBJZiBpdCBpcyBqdXN0IGEgc2luZ2xlIGl0ZW0gcmV0dXJuIGFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIGl0ZW0uXG4gKiBcbiAgICBMdWMuQXJyYXkudG9BcnJheSgpXG4gICAgPltdXG4gICAgTHVjLkFycmF5LnRvQXJyYXkobnVsbClcbiAgICA+W11cbiAgICBMdWMuQXJyYXkudG9BcnJheSgxKVxuICAgID5bMV1cbiAgICBMdWMuQXJyYXkudG9BcnJheShbMSwyXSlcbiAgICA+WzEsIDJdXG4gKlxuICogQHBhcmFtICB7T2JqZWN0fSBpdGVtIGl0ZW0gdG8gdHVybiBpbnRvIGFuIGFycmF5LlxuICogQHJldHVybiB0aGUgYXJyYXlcbiAqL1xuZnVuY3Rpb24gdG9BcnJheShpdGVtKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoaXRlbSkpIHtcbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfVxuICAgIHJldHVybiAoaXRlbSA9PT0gbnVsbCB8fCBpdGVtID09PSB1bmRlZmluZWQpID8gW10gOiBbaXRlbV07XG59XG5cbi8qKlxuICogUmV0dXJuIHRoZSBsYXN0IGl0ZW0gb2YgdGhlIGFycmF5XG4gKiBAcGFyYW0gIHtBcnJheX0gYXJyXG4gKiBAcmV0dXJuIHtPYmplY3R9IHRoZSBpdGVtXG4gICAgXG4gICAgdmFyIG15TG9uZ0FycmF5TmFtZUZvclRoaW5nc1RoYXRJV2FudFRvS2VlcFRyYWNrT2YgPSBbMSwyLDNdXG4gICAgXG4gICAgTHVjLkFycmF5Lmxhc3QobXlMb25nQXJyYXlOYW1lRm9yVGhpbmdzVGhhdElXYW50VG9LZWVwVHJhY2tPZik7XG4gICAgdnMuXG4gICAgbXlMb25nQXJyYXlOYW1lRm9yVGhpbmdzVGhhdElXYW50VG9LZWVwVHJhY2tPZltteUxvbmdBcnJheU5hbWVGb3JUaGluZ3NUaGF0SVdhbnRUb0tlZXBUcmFja09mLmxlbmd0aCAtMV1cbiAqXG4gKi9cbmZ1bmN0aW9uIGxhc3QoYXJyKSB7XG4gICAgcmV0dXJuIGFyclthcnIubGVuZ3RoIC0xXTtcbn1cblxuLyoqXG4gKiBGbGF0dGVuIG91dCBhbiBhcnJheSBvZiBvYmplY3RzIGJhc2VkIG9mIHRoZWlyIHZhbHVlIGZvciB0aGUgcGFzc2VkIGluIGtleS5cbiAqIFRoaXMgYWxzbyB0YWtlcyBhY2NvdW50IGZvciBudWxsL3VuZGVmaW5lZCB2YWx1ZXMuXG4gKlxuICAgIEx1Yy5BcnJheS5wbHVjayhbdW5kZWZpbmVkLCB7YTonMScsIGI6Mn0sIHtiOjN9LCB7Yjo0fV0sICdiJylcbiAgICA+W3VuZGVmaW5lZCwgMiwgMywgNF1cbiAqIEBwYXJhbSAge09iamVjdFtdfSBhcnIgXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGtleSBcbiAqIEByZXR1cm4ge0FycmF5fSAgICAgXG4gKi9cbmZ1bmN0aW9uIHBsdWNrKGFyciwga2V5KSB7XG4gICAgcmV0dXJuIGFyci5tYXAoZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlICYmIHZhbHVlW2tleV07XG4gICAgfSk7XG59XG5cbi8qKlxuICogUmV0dXJuIHRoZSBpdGVtcyBpbiBiZXR3ZWVuIHRoZSBwYXNzZWQgaW4gaW5kZXhcbiAqIGFuZCB0aGUgZW5kIG9mIHRoZSBhcnJheS5cbiAqXG4gICAgTHVjLkFycmF5LmZyb21JbmRleChbMSwyLDMsNCw1XSwgMSlcbiAgICA+WzIsIDMsIDQsIDVdXG5cbiAqIEBwYXJhbSAge0FycmF5L2FyZ3VtZW50c30gYXJyIFxuICogQHBhcmFtICB7TnVtYmVyfSBpbmRleCBcbiAqIEByZXR1cm4ge0FycmF5fSB0aGUgbmV3IGFycmF5LlxuICogXG4gKi9cbmZ1bmN0aW9uIGZyb21JbmRleChhLCBpbmRleCkge1xuICAgIHZhciBhcnIgPSBpcy5pc0FyZ3VtZW50cyhhKSA/IGFycmF5U2xpY2UuY2FsbChhKSA6IGE7XG4gICAgcmV0dXJuIGFycmF5U2xpY2UuY2FsbChhcnIsIGluZGV4LCBhcnIubGVuZ3RoKTtcbn1cblxuLyoqXG4gKiBSdW5zIGFuIEFycmF5LmZvckVhY2ggYWZ0ZXIgY2FsbGluZyBMdWMuQXJyYXkudG9BcnJheSBvbiB0aGUgaXRlbS5cbiAgSXQgaXMgdmVyeSB1c2VmdWwgZm9yIHNldHRpbmcgdXAgZmxleGlibGUgYXBpJ3MgdGhhdCBjYW4gaGFuZGxlIG5vbmUgb25lIG9yIG1hbnkuXG5cbiAgICBMdWMuQXJyYXkuZWFjaCh0aGlzLml0ZW1zLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgIHRoaXMuX2FkZEl0ZW0oaXRlbSk7XG4gICAgfSk7XG5cbiAgICB2cy5cblxuICAgIGlmKEFycmF5LmlzQXJyYXkodGhpcy5pdGVtcykpe1xuICAgICAgICB0aGlzLml0ZW1zLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgdGhpcy5fYWRkSXRlbShpdGVtKTtcbiAgICAgICAgfSlcbiAgICB9XG4gICAgZWxzZSBpZih0aGlzLml0ZW1zICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5fYWRkSXRlbSh0aGlzLml0ZW1zKTtcbiAgICB9XG5cbiAqIEBwYXJhbSAge09iamVjdH0gICBpdGVtXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEBwYXJhbSAge09iamVjdH0gICB0aGlzQXJnICAgXG4gKlxuICovXG5mdW5jdGlvbiBlYWNoKGl0ZW0sIGZuLCB0aGlzQXJnKSB7XG4gICAgdmFyIGFyciA9IHRvQXJyYXkoaXRlbSk7XG4gICAgcmV0dXJuIGFyci5mb3JFYWNoLmNhbGwoYXJyLCBmbiwgdGhpc0FyZyk7XG59XG5cbi8qKlxuICogSW5zZXJ0IG9yIGFwcGVuZCB0aGUgc2Vjb25kIGFycmF5L2FyZ3VtZW50cyBpbnRvIHRoZVxuICogZmlyc3QgYXJyYXkvYXJndW1lbnRzLiAgVGhpcyBtZXRob2QgZG9lcyBub3QgYWx0ZXJcbiAqIHRoZSBwYXNzZWQgaW4gYXJyYXkvYXJndW1lbnRzLlxuICogXG4gKiBAcGFyYW0gIHtBcnJheS9hcmd1bWVudHN9IGZpcnN0QXJyYXlPckFyZ3NcbiAqIEBwYXJhbSAge0FycmF5L2FyZ3VtZW50c30gc2Vjb25kQXJyYXlPckFyZ3NcbiAqIEBwYXJhbSAge051bWJlci90cnVlfSBpbmRleE9yQXBwZW5kIHRydWUgdG8gYXBwZW5kIFxuICogdGhlIHNlY29uZCBhcnJheSB0byB0aGUgZW5kIG9mIHRoZSBmaXJzdCBvbmUuICBJZiBpdCBpcyBhIG51bWJlclxuICogaW5zZXJ0IHRoZSBzZWNvbmRBcnJheSBpbnRvIHRoZSBmaXJzdCBvbmUgYXQgdGhlIHBhc3NlZCBpbiBpbmRleC5cbiAqIEByZXR1cm4ge0FycmF5fSB0aGUgbmV3bHkgY3JlYXRlZCBhcnJheS5cbiAqXG4gICAgTHVjLkFycmF5Lmluc2VydChbMCw0XSwgWzEsMiwzXSwgMSk7XG4gICAgPlswLCAxLCAyLCAzLCA0XVxuICAgIEx1Yy5BcnJheS5pbnNlcnQoWzAsNF0sIFsxLDIsM10sIHRydWUpO1xuICAgID5bMCwgNCwgMSwgMiwgM11cbiAgICBMdWMuQXJyYXkuaW5zZXJ0KFswLDRdLCBbMSwyLDNdLCAwKTtcbiAgICA+WzEsIDIsIDMsIDAsIDRdXG4gKlxuICovXG5mdW5jdGlvbiBpbnNlcnQoZmlyc3RBcnJheU9yQXJncywgc2Vjb25kQXJyYXlPckFyZ3MsIGluZGV4T3JBcHBlbmQpIHtcbiAgICB2YXIgZmlyc3RBcnJheSA9IGFycmF5U2xpY2UuY2FsbChmaXJzdEFycmF5T3JBcmdzKSxcbiAgICAgICAgc2Vjb25kQXJyYXkgPSBhcnJheVNsaWNlLmNhbGwoc2Vjb25kQXJyYXlPckFyZ3MpLFxuICAgICAgICBzcGxpY2VBcmdzO1xuXG4gICAgaWYoaW5kZXhPckFwcGVuZCA9PT0gdHJ1ZSkge1xuICAgICAgICByZXR1cm4gZmlyc3RBcnJheS5jb25jYXQoc2Vjb25kQXJyYXkpO1xuICAgIH1cblxuICAgIHNwbGljZUFyZ3MgPSBbaW5kZXhPckFwcGVuZCwgMF0uY29uY2F0KHNlY29uZEFycmF5KTtcbiAgICBmaXJzdEFycmF5LnNwbGljZS5hcHBseShmaXJzdEFycmF5LCBzcGxpY2VBcmdzKTtcbiAgICByZXR1cm4gZmlyc3RBcnJheTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgYW4gaXRlbSBmcm9tIHRoZSBwYXNzZWQgaW4gYXJyXG4gKiBmcm9tIHRoZSBpbmRleC5cbiAqIEBwYXJhbSAge0FycmF5fSBhcnJcbiAqIEBwYXJhbSAge051bWJlcn0gaW5kZXhcbiAqIEByZXR1cm4ge09iamVjdH0gdGhlIGl0ZW0gcmVtb3ZlZC5cbiAqXG4gICAgdmFyIGFyciA9IFsxLDIsM107XG4gICAgTHVjLkFycmF5LnJlbW92ZUF0SW5kZXgoYXJyLCAxKTtcbiAgICA+MlxuICAgIGFycjtcbiAgICA+WzEsM11cblxuICovXG5mdW5jdGlvbiByZW1vdmVBdEluZGV4KGFyciwgaW5kZXgpIHtcbiAgICB2YXIgaXRlbSA9IGFycltpbmRleF07XG4gICAgYXJyLnNwbGljZShpbmRleCwgMSk7XG4gICAgcmV0dXJuIGl0ZW07XG59XG5cbmZ1bmN0aW9uIF9yZW1vdmVGaXJzdChhcnIsIGZuKSB7XG4gICAgdmFyIHJlbW92ZWQgPSBmYWxzZTtcblxuICAgIGFyci5zb21lKGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xuICAgICAgICBpZiAoZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKSkge1xuICAgICAgICAgICAgcmVtb3ZlZCA9IHJlbW92ZUF0SW5kZXgoYXJyLCBpbmRleCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlbW92ZWQ7XG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBmaXJzdCBpdGVtIGZyb20gdGhlIHBhc3NlZCBpbiBhcnJheVxuICogdGhhdCB7QGxpbmsgTHVjI2NvbXBhcmUgbWF0Y2hlc30gdGhlIHBhc3NlZCBpbiBvYmplY3QuICBJbnN0ZWFkIG9mIFxuICogY29tcGFyaW5nIGFuIG9iamVjdCBhbiBpdGVyYXRvciBmdW5jdGlvbiBjYW4gYmVcbiAqIHVzZWQuXG4gKiBcbntjb3B5RG9jI2FyclBhcmFtc31cbntjb3B5RG9jI2FyclJlbW92ZVNpbmdsZX1cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlRmlyc3QoYXJyLCBvYmosIGNvbmZpZykge1xuICAgIHZhciBmbiA9IF9jcmVhdGVJdGVyYXRvckZuKG9iaiwgY29uZmlnKTtcbiAgICByZXR1cm4gX3JlbW92ZUZpcnN0KGFyciwgZm4pO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgZmlyc3QgaXRlbSBmcm9tIHRoZSBwYXNzZWQgaW4gYXJyYXlcbiAqIHRoYXQgZG9lcyBub3Qge0BsaW5rIEx1YyNjb21wYXJlIG1hdGNofSB0aGUgcGFzc2VkIGluIG9iamVjdC4gIEluc3RlYWQgb2YgXG4gKiBjb21wYXJpbmcgYW4gb2JqZWN0IGFuIGl0ZXJhdG9yIGZ1bmN0aW9uIGNhbiBiZVxuICogdXNlZC5cbiAqIFxue2NvcHlEb2MjYXJyUGFyYW1zfVxue2NvcHlEb2MjYXJyUmVtb3ZlU2luZ2xlfVxuICovXG5mdW5jdGlvbiByZW1vdmVGaXJzdE5vdChhcnIsIG9iaiwgY29uZmlnKSB7XG4gICAgdmFyIGZuID0gX2NyZWF0ZUl0ZXJhdG9yTm90Rm4ob2JqLCBjb25maWcpO1xuICAgIHJldHVybiBfcmVtb3ZlRmlyc3QoYXJyLCBmbik7XG59XG5cblxuZnVuY3Rpb24gX3JlbW92ZUFsbChhcnIsIGZuKSB7XG4gICAgdmFyIGluZGV4c1RvUmVtb3ZlID0gW10sXG4gICAgICAgIHJlbW92ZWQgPSBbXTtcblxuICAgIGFyci5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xuICAgICAgICBpZiAoZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKSkge1xuICAgICAgICAgICAgaW5kZXhzVG9SZW1vdmUudW5zaGlmdChpbmRleCk7XG4gICAgICAgICAgICByZW1vdmVkLnB1c2godmFsdWUpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBpbmRleHNUb1JlbW92ZS5mb3JFYWNoKGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgICAgcmVtb3ZlQXRJbmRleChhcnIsIGluZGV4KTtcbiAgICB9KTtcblxuICAgIHJldHVybiByZW1vdmVkO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgYWxsIHRoZSBpdGVtcyBmcm9tIHRoZSBwYXNzZWQgaW4gYXJyYXlcbiAqIHRoYXQgZG8gbm90IHtAbGluayBMdWMjY29tcGFyZSBtYXRjaH0gdGhlIHBhc3NlZCBpbiBvYmplY3QuICBJbnN0ZWFkIG9mIFxuICogY29tcGFyaW5nIGFuIG9iamVjdCBhbiBpdGVyYXRvciBmdW5jdGlvbiBjYW4gYmVcbiAqIHVzZWQuXG4gKiBcbntjb3B5RG9jI2FyclBhcmFtc31cbntjb3B5RG9jI2FyclJlbW92ZUFsbH1cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlQWxsTm90KGFyciwgb2JqLCBjb25maWcpIHtcbiAgICB2YXIgZm4gPSBfY3JlYXRlSXRlcmF0b3JOb3RGbihvYmosIGNvbmZpZyk7XG4gICAgcmV0dXJuIF9yZW1vdmVBbGwoYXJyLCBmbik7XG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBhbGwgdGhlIGl0ZW1zIGZyb20gdGhlIHBhc3NlZCBpbiBhcnJheVxuICogdGhhdCB7QGxpbmsgTHVjI2NvbXBhcmUgbWF0Y2hlc30gdGhlIHBhc3NlZCBpbiBvYmplY3QuICBJbnN0ZWFkIG9mIFxuICogY29tcGFyaW5nIGFuIG9iamVjdCBhbiBpdGVyYXRvciBmdW5jdGlvbiBjYW4gYmVcbiAqIHVzZWQuXG4gKiBcbntjb3B5RG9jI2FyclBhcmFtc31cbntjb3B5RG9jI2FyclJlbW92ZUFsbH1cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlQWxsKGFyciwgb2JqLCBjb25maWcpIHtcbiAgICB2YXIgZm4gPSBfY3JlYXRlSXRlcmF0b3JGbihvYmosIGNvbmZpZyk7XG4gICAgcmV0dXJuIF9yZW1vdmVBbGwoYXJyLCBmbik7XG59XG5cbmZ1bmN0aW9uIF9maW5kRmlyc3QoYXJyLCBmbikge1xuICAgIHZhciBpdGVtID0gZmFsc2U7XG4gICAgYXJyLnNvbWUoZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XG4gICAgICAgIGlmIChmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSB7XG4gICAgICAgICAgICBpdGVtID0gYXJyW2luZGV4XTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gaXRlbTtcbn1cblxuLyoqXG4gKiBGaW5kIHRoZSBmaXJzdCBpdGVtIGZyb20gdGhlIHBhc3NlZCBpbiBhcnJheVxuICogdGhhdCBkb2VzIHtAbGluayBMdWMjY29tcGFyZSBtYXRjaGVzfSB0aGUgcGFzc2VkIGluIG9iamVjdC4gIEluc3RlYWQgb2YgXG4gKiBjb21wYXJpbmcgYW4gb2JqZWN0IGFuIGl0ZXJhdG9yIGZ1bmN0aW9uIGNhbiBiZVxuICogdXNlZC5cbiAqIFxue2NvcHlEb2MjYXJyUGFyYW1zfVxue2NvcHlEb2MjYXJyRmluZFNpbmdsZX1cbiAqL1xuZnVuY3Rpb24gZmluZEZpcnN0KGFyciwgb2JqLCBjb25maWcpIHtcbiAgICB2YXIgZm4gPSBfY3JlYXRlSXRlcmF0b3JGbihvYmosIGNvbmZpZyk7XG4gICAgcmV0dXJuIF9maW5kRmlyc3QoYXJyLCBmbik7XG59XG5cbi8qKlxuICogRmluZCB0aGUgZmlyc3QgaXRlbSBmcm9tIHRoZSBwYXNzZWQgaW4gYXJyYXlcbiAqIHRoYXQgZG9lcyBub3Qge0BsaW5rIEx1YyNjb21wYXJlIG1hdGNofSB0aGUgcGFzc2VkIGluIG9iamVjdC4gIEluc3RlYWQgb2YgXG4gKiBjb21wYXJpbmcgYW4gb2JqZWN0IGFuIGl0ZXJhdG9yIGZ1bmN0aW9uIGNhbiBiZVxuICogdXNlZC5cbiAqIFxue2NvcHlEb2MjYXJyUGFyYW1zfVxue2NvcHlEb2MjYXJyRmluZFNpbmdsZX1cbiAqL1xuZnVuY3Rpb24gZmluZEZpcnN0Tm90KGFyciwgb2JqLCBjb25maWcpIHtcbiAgICB2YXIgZm4gPSBfY3JlYXRlSXRlcmF0b3JOb3RGbihvYmosIGNvbmZpZyk7XG4gICAgcmV0dXJuIF9maW5kRmlyc3QoYXJyLCBmbik7XG59XG5cbmZ1bmN0aW9uIF9maW5kQWxsKGFyciwgZm4pIHtcbiAgICByZXR1cm4gYXJyLmZpbHRlcihmbik7XG59XG5cbi8qKlxuICogRmluZCBhbGwgb2YgdGhlIHRoZSBpdGVtcyBmcm9tIHRoZSBwYXNzZWQgaW4gYXJyYXlcbiAqIHRoYXQge0BsaW5rIEx1YyNjb21wYXJlIG1hdGNoZXN9IHRoZSBwYXNzZWQgaW4gb2JqZWN0LiAgSW5zdGVhZCBvZiBcbiAqIGNvbXBhcmluZyBhbiBvYmplY3QgYW4gaXRlcmF0b3IgZnVuY3Rpb24gY2FuIGJlXG4gKiB1c2VkLlxuICogXG57Y29weURvYyNhcnJQYXJhbXN9XG57Y29weURvYyNhcnJGaW5kQWxsfVxuICovXG5mdW5jdGlvbiBmaW5kQWxsKGFyciwgb2JqLCBjb25maWcpIHtcbiAgICB2YXIgZm4gPSBfY3JlYXRlSXRlcmF0b3JGbihvYmosIGNvbmZpZyk7XG4gICAgcmV0dXJuIF9maW5kQWxsKGFyciwgZm4pO1xufVxuXG4vKipcbiAqIEZpbmQgYWxsIG9mIHRoZSB0aGUgaXRlbXMgZnJvbSB0aGUgcGFzc2VkIGluIGFycmF5XG4gKiB0aGF0IGRvIG5vdCB7QGxpbmsgTHVjI2NvbXBhcmUgbWF0Y2h9IHRoZSBwYXNzZWQgaW4gb2JqZWN0LiAgSW5zdGVhZCBvZiBcbiAqIGNvbXBhcmluZyBhbiBvYmplY3QgYW4gaXRlcmF0b3IgZnVuY3Rpb24gY2FuIGJlXG4gKiB1c2VkLlxuICogXG57Y29weURvYyNhcnJQYXJhbXN9XG57Y29weURvYyNhcnJGaW5kQWxsfVxuICovXG5mdW5jdGlvbiBmaW5kQWxsTm90KGFyciwgb2JqLCBjb25maWcpIHtcbiAgICB2YXIgZm4gPSBfY3JlYXRlSXRlcmF0b3JOb3RGbihvYmosIGNvbmZpZyk7XG4gICAgcmV0dXJuIF9maW5kQWxsKGFyciwgZm4pO1xufVxuXG5cbmV4cG9ydHMudG9BcnJheSA9IHRvQXJyYXk7XG5leHBvcnRzLmVhY2ggPSBlYWNoO1xuZXhwb3J0cy5pbnNlcnQgPSBpbnNlcnQ7XG5leHBvcnRzLmZyb21JbmRleCA9IGZyb21JbmRleDtcbmV4cG9ydHMubGFzdCA9IGxhc3Q7XG5leHBvcnRzLnBsdWNrID0gcGx1Y2s7XG5cbmV4cG9ydHMucmVtb3ZlQXRJbmRleCA9IHJlbW92ZUF0SW5kZXg7XG5leHBvcnRzLmZpbmRGaXJzdE5vdCA9IGZpbmRGaXJzdE5vdDtcbmV4cG9ydHMuZmluZEFsbE5vdCA9IGZpbmRBbGxOb3Q7XG5leHBvcnRzLmZpbmRGaXJzdCA9IGZpbmRGaXJzdDtcbmV4cG9ydHMuZmluZEFsbCA9IGZpbmRBbGw7XG5cbmV4cG9ydHMucmVtb3ZlRmlyc3ROb3QgPSByZW1vdmVGaXJzdE5vdDtcbmV4cG9ydHMucmVtb3ZlQWxsTm90ID0gcmVtb3ZlQWxsTm90O1xuZXhwb3J0cy5yZW1vdmVGaXJzdCA9IHJlbW92ZUZpcnN0O1xuZXhwb3J0cy5yZW1vdmVBbGwgPSByZW1vdmVBbGw7XG5cbihmdW5jdGlvbigpe1xuICAgIHZhciBfY3JlYXRlTGFzdEZuID0gZnVuY3Rpb24oZm5OYW1lKSB7XG4gICAgICAgIHZhciBsYXN0TmFtZSA9IGZuTmFtZS5yZXBsYWNlKCdGaXJzdCcsICdMYXN0Jyk7XG5cbiAgICAgICAgZXhwb3J0c1tsYXN0TmFtZV0gPSBmdW5jdGlvbihhcnIsIG9iaiwgY29uZmlnKSB7XG4gICAgICAgICAgICB2YXIgcmV0O1xuXG4gICAgICAgICAgICBhcnIucmV2ZXJzZSgpO1xuICAgICAgICAgICAgcmV0ID0gZXhwb3J0c1tmbk5hbWVdKGFyciwgb2JqLCBjb25maWcpO1xuICAgICAgICAgICAgYXJyLnJldmVyc2UoKTtcblxuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfTtcblxuICAgIH0sIG5hbWVzVG9BZGRMYXN0ID0gWydmaW5kRmlyc3ROb3QnLCAnZmluZEZpcnN0JywgJ3JlbW92ZUZpcnN0Tm90JywgJ3JlbW92ZUZpcnN0J107XG5cbiAgICBuYW1lc1RvQWRkTGFzdC5mb3JFYWNoKGZ1bmN0aW9uKGZuTmFtZSkge1xuICAgICAgICBfY3JlYXRlTGFzdEZuKGZuTmFtZSk7XG4gICAgfSk7XG5cbn0oKSk7XG5cbi8qKlxuICogQG1lbWJlciBMdWMuQXJyYXkgXG4gKiBAbWV0aG9kIGZpbmRMYXN0Tm90IFxuICogU2FtZSBhcyBMdWMuQXJyYXkuZmluZEZpcnN0Tm90IGV4Y2VwdCBzdGFydCBhdCB0aGUgZW5kLlxuICovXG5cbi8qKlxuICogQG1lbWJlciBMdWMuQXJyYXkgXG4gKiBAbWV0aG9kIGZpbmRMYXN0XG4gKiBTYW1lIGFzIEx1Yy5BcnJheS5maW5kRmlyc3QgZXhjZXB0IHN0YXJ0IGF0IHRoZSBlbmQuXG4gKi9cblxuLyoqXG4gKiBAbWVtYmVyIEx1Yy5BcnJheSBcbiAqIEBtZXRob2QgcmVtb3ZlTGFzdE5vdCBcbiAqIFNhbWUgYXMgTHVjLkFycmF5LnJlbW92ZUZpcnN0Tm90IGV4Y2VwdCBzdGFydCBhdCB0aGUgZW5kLlxuICovXG5cbi8qKlxuICogQG1lbWJlciBMdWMuQXJyYXkgXG4gKiBAbWV0aG9kIHJlbW92ZUxhc3QgXG4gKiBTYW1lIGFzIEx1Yy5BcnJheS5yZW1vdmVGaXJzdCBleGNlcHQgc3RhcnQgYXQgdGhlIGVuZC5cbiAqL1xuIiwidmFyIGFycmF5ID0gcmVxdWlyZSgnLi9hcnJheScpLFxuICAgIGlzID0gcmVxdWlyZSgnLi9pcycpLFxuICAgIEdlbmVyYXRvcjtcblxuR2VuZXJhdG9yID0ge1xuICAgIGFycmF5Rm5OYW1lczogWydmaW5kRmlyc3ROb3QnLCAnZmluZEFsbE5vdCcsICdmaW5kRmlyc3QnLCAnZmluZEFsbCcsXG4gICAgICAgICAgICAncmVtb3ZlRmlyc3ROb3QnLCAncmVtb3ZlQWxsTm90JywgJ3JlbW92ZUZpcnN0JywgJ3JlbW92ZUFsbCcsXG4gICAgICAgICAgICAncmVtb3ZlTGFzdE5vdCcsICdyZW1vdmVMYXN0JywgJ2ZpbmRMYXN0JywgJ2ZpbmRMYXN0Tm90J1xuICAgIF0sXG5cbiAgICBjcmVhdGVGbjogZnVuY3Rpb24oYXJyYXlGbk5hbWUsIGZuKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihhcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBhcnJheVthcnJheUZuTmFtZV0oYXJyLCBmbik7XG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIGNyZWF0ZUJvdW5kRm46IGZ1bmN0aW9uKGFycmF5Rm5OYW1lLCBmblRvQmluZCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oYXJyLCB2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIGZuID0gZm5Ub0JpbmQuYXBwbHkodGhpcywgYXJyYXkuZnJvbUluZGV4KGFyZ3VtZW50cywgMSkpO1xuICAgICAgICAgICAgcmV0dXJuIGFycmF5W2FycmF5Rm5OYW1lXShhcnIsIGZuKTtcbiAgICAgICAgfTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEdlbmVyYXRvcjtcblxuLyoqXG4gKiBAY2xhc3MgTHVjLkFycmF5Rm5zXG4gKiBUaGlzIGlzIGRvY3VtZW50ZWQgYXMgYSBzZXBhcmF0ZSBwYWNrYWdlIGJ1dCBpdCBhY3R1YWxseSBleGlzdHMgdW5kZXIgdGhlIFxuICogTHVjLkFycmF5IG5hbWVzcGFjZS4gIENoZWNrIG91dCB0aGUgXCJGaWx0ZXIgY2xhc3MgbWVtYmVyc1wiIGlucHV0IGJveFxuICoganVzdCB0byB0aGUgcmlnaHQgd2hlbiBzZWFyY2hpbmcgZm9yIGZ1bmN0aW9ucy5cbiAqPGJyPlxuICogXG4gKiBUaGVyZSBhcmUgYSBsb3Qgb2YgZnVuY3Rpb25zIGluIHRoaXMgcGFja2FnZSBidXQgYWxsIG9mIHRoZW0gXG4gKiBmb2xsb3cgdGhlIHNhbWUgYXBpLiAgXFwqQWxsIGZ1bmN0aW9ucyB3aWxsIHJldHVybiBhbiBhcnJheSBvZiByZW1vdmVkIG9yIGZvdW5kXG4gKiBpdGVtcy4gIFRoZSBpdGVtcyB3aWxsIGJlIGFkZGVkIHRvIHRoZSBhcnJheSBpbiB0aGUgb3JkZXIgdGhleSBhcmVcbiAqIGZvdW5kLiAgXFwqRmlyc3QgZnVuY3Rpb25zIHdpbGwgcmV0dXJuIHRoZSBmaXJzdCBpdGVtIGFuZCBzdG9wIGl0ZXJhdGluZyBhZnRlciB0aGF0LCBpZiBub25lXG4gKiAgaXMgZm91bmQgZmFsc2UgaXMgcmV0dXJuZWQuICByZW1vdmVcXCogZnVuY3Rpb25zIHdpbGwgZGlyZWN0bHkgY2hhbmdlIHRoZSBwYXNzZWQgaW4gYXJyYXkuXG4gKiAgXFwqTm90IGZ1bmN0aW9ucyBvbmx5IGRvIHRoZSBmb2xsb3dpbmcgYWN0aW9ucyBpZiB0aGUgY29tcGFyaXNvbiBpcyBub3QgdHJ1ZS5cbiAqICBcXCpMYXN0IGZ1bmN0aW9ucyBkbyB0aGUgc2FtZSBhcyB0aGVpciBcXCpGaXJzdCBjb3VudGVycGFydHMgZXhjZXB0IHRoYXQgdGhlIGl0ZXJhdGluZ1xuICogIHN0YXJ0cyBhdCB0aGUgZW5kIG9mIHRoZSBhcnJheS4gQWxtb3N0IGV2ZXJ5IHB1YmxpYyBtZXRob2Qgb2YgTHVjLmlzIGlzIGF2YWlsYWJsZSBpdFxuICogIHVzZXMgdGhlIGZvbGxvd2luZyBncmFtbWFyIEx1Yy5BcnJheVtcIm1ldGhvZE5hbWVcIlwiaXNNZXRob2ROYW1lXCJdXG4gKlxuICAgICAgTHVjLkFycmF5LmZpbmRBbGxOb3RFbXB0eShbZmFsc2UsIHRydWUsIG51bGwsIHVuZGVmaW5lZCwgMCwgJycsIFtdLCBbMV1dKVxuICAgICAgPiBbdHJ1ZSwgMCwgWzFdXVxuXG4gICAgICAvL09yIHJlbW92ZSBhbGwgZW1wdHkgaXRlbXNcbiAgICAgIHZhciBhcnIgPSBbJycsIDAgLCBbXSwge2E6MX0sIHRydWUsIHt9LCBbMV1dXG4gICAgICBMdWMuQXJyYXkucmVtb3ZlQWxsRW1wdHkoYXJyKVxuICAgICAgPlsnJywgW10sIHt9XVxuICAgICAgYXJyXG4gICAgICA+WzAsIHthOjF9LCB0cnVlLCBbMV1dXG4gICAgIFxuICAgICAgTHVjLkFycmF5LmZpbmRGaXJzdE5vdFN0cmluZyhbMSwyLDMsJzUnXSlcbiAgICAgID4xXG4gICAgICB2YXIgYXJyID0gWzEsMiwzLCc1J107XG4gICAgICBMdWMuQXJyYXkucmVtb3ZlQWxsTm90U3RyaW5nKGFycik7XG4gICAgICA+WzEsMiwzXVxuICAgICAgYXJyXG4gICAgICA+W1wiNVwiXVxuICpcbiAqIEFzIG9mIHJpZ2h0IG5vdyB0aGVyZSBhcmUgdHdvIGZ1bmN0aW9uIHNldHMgd2hpY2ggZGlmZmVyIGZyb20gdGhlIGlzXG4gKiBhcGkuXG4gKlxuICogSW5zdGFuY2VPZlxuICogXG4gICAgTHVjLkFycmF5LmZpbmRBbGxJbnN0YW5jZU9mKFsxLDIsIG5ldyBEYXRlKCksIHt9LCBbXV0sIE9iamVjdClcbiAgICA+W2RhdGUsIHt9LCBbXV1cbiAgICA+THVjLkFycmF5LmZpbmRBbGxOb3RJbnN0YW5jZU9mKFsxLDIsIG5ldyBEYXRlKCksIHt9LCBbXV0sIE9iamVjdClcbiAgICBbMSwgMl1cbiAqXG4gKiBJblxuICogXG4gICAgTHVjLkFycmF5LmZpbmRBbGxJbihbMSwyLDNdLCBbMSwyXSlcbiAgICA+WzEsIDJdXG4gICAgTHVjLkFycmF5LmZpbmRGaXJzdEluKFsxLDIsM10sIFsxLDJdKVxuICAgID4xXG5cbiAgICAvL2RlZmF1bHRzIHRvIGxvb3NlIGNvbXBhcmlzb25cbiAgICBMdWMuQXJyYXkuZmluZEFsbEluKFsxLDIsMywge2E6MSwgYjoyfV0sIFsxLHthOjF9XSlcbiAgICA+IFsxLCB7YToxLGI6Mn1dXG5cbiAgICBMdWMuQXJyYXkuZmluZEFsbEluKFsxLDIsMywge2E6MSwgYjoyfV0sIFsxLHthOjF9XSwge3R5cGU6ICdkZWVwJ30pXG4gICAgPlsxXVxuICovXG5cbihmdW5jdGlvbiBfY3JlYXRlSXNGbnMoKSB7XG4gICAgdmFyIGlzVG9JZ25vcmUgPSBbJ2lzUmVnRXhwJywgJ2lzQXJndW1lbnRzJ107XG5cbiAgICBPYmplY3Qua2V5cyhpcykuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgdmFyIG5hbWUgPSBrZXkuc3BsaXQoJ2lzJylbMV07XG4gICAgICAgIEdlbmVyYXRvci5hcnJheUZuTmFtZXMuZm9yRWFjaChmdW5jdGlvbihmbk5hbWUpIHtcbiAgICAgICAgICAgIGlmKGlzVG9JZ25vcmUuaW5kZXhPZihrZXkpID09PSAtMSkge1xuICAgICAgICAgICAgICAgIGFycmF5W2ZuTmFtZSArIG5hbWVdID0gR2VuZXJhdG9yLmNyZWF0ZUZuKGZuTmFtZSwgaXNba2V5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSgpKTtcblxuKGZ1bmN0aW9uIF9jcmVhdGVGYWxzeUZucygpIHtcbiAgICB2YXIgdXNlZnVsbEZhbHN5Rm5zID0gWydmaW5kRmlyc3ROb3QnLCAnZmluZEFsbE5vdCcsICdyZW1vdmVGaXJzdE5vdCcsICdyZW1vdmVBbGxOb3QnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdyZW1vdmVGaXJzdCcsICdyZW1vdmVBbGwnLCAncmVtb3ZlTGFzdE5vdCcsICdyZW1vdmVMYXN0JywgICdmaW5kTGFzdE5vdCddO1xuXG4gICAgdmFyIGZucyA9IHtcbiAgICAgICAgJ0ZhbHNlJzogZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsID09PSBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgJ1RydWUnOiBmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWwgPT09IHRydWU7XG4gICAgICAgIH0sXG4gICAgICAgICdOdWxsJzogZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsID09PSBudWxsO1xuICAgICAgICB9LFxuICAgICAgICAnVW5kZWZpbmVkJzogZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsID09PSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgT2JqZWN0LmtleXMoZm5zKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICB1c2VmdWxsRmFsc3lGbnMuZm9yRWFjaChmdW5jdGlvbihmbk5hbWUpIHtcbiAgICAgICAgICAgIGFycmF5W2ZuTmFtZSArIGtleV0gPSBHZW5lcmF0b3IuY3JlYXRlRm4oZm5OYW1lLCBmbnNba2V5XSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSgpKTtcblxuKGZ1bmN0aW9uIF9jcmVhdGVCb3VuZEZucygpIHtcbiAgICB2YXIgZm5zID0ge1xuICAgICAgICAnSW5zdGFuY2VPZic6IGZ1bmN0aW9uKENvbnN0cnVjdG9yKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKHZhbHVlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSwnSW4nOiBmdW5jdGlvbihhcnIsIGMpIHtcbiAgICAgICAgICAgIHZhciBkZWZhdWx0QyA9IHt0eXBlOidsb29zZVJpZ2h0J307XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZih2YWx1ZSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNmZyA9IGMgfHwgZGVmYXVsdEM7XG4gICAgICAgICAgICAgICAgICAgIC8vdGhpcyBpcyBhIHJpZ2h0IHRvIGxlZnQgY29tcGFyaXNvbiBcbiAgICAgICAgICAgICAgICAgICAgLy9leHBlY3RlZCBsb29zZSBiZWhhdmlvciBzaG91bGQgYmUgbG9vc2VSaWdodFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXJyYXkuZmluZEZpcnN0KGFyciwgdmFsdWUsIGNmZy50eXBlID09PSAnbG9vc2UnID8gZGVmYXVsdEMgOiBjZmcpICE9PSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFyci5pbmRleE9mKGZhbHNlKSA+IC0xO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBPYmplY3Qua2V5cyhmbnMpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIEdlbmVyYXRvci5hcnJheUZuTmFtZXMuZm9yRWFjaChmdW5jdGlvbihmbk5hbWUpIHtcbiAgICAgICAgICAgIGFycmF5W2ZuTmFtZSArIGtleV0gPSBHZW5lcmF0b3IuY3JlYXRlQm91bmRGbihmbk5hbWUsIGZuc1trZXldKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KCkpOyIsInZhciBpcyA9IHJlcXVpcmUoJy4vaXMnKTtcblxuZnVuY3Rpb24gX3N0cmljdCh2YWwxLCB2YWwyKXtcbiAgICByZXR1cm4gdmFsMSA9PT0gdmFsMjtcbn1cblxuZnVuY3Rpb24gX2NvbXBhcmVBcnJheUxlbmd0aCh2YWwxLCB2YWwyKSB7XG4gICAgcmV0dXJuKGlzLmlzQXJyYXkodmFsMSkgJiYgaXMuaXNBcnJheSh2YWwyKSAgJiYgdmFsMS5sZW5ndGggPT09IHZhbDIubGVuZ3RoKTtcbn1cblxuZnVuY3Rpb24gX3NoYWxsb3dBcnJheSh2YWwxLCB2YWwyKSB7XG4gICAgdmFyIGkgPSAwLFxuICAgICAgICBsZW47XG4gICAgXG4gICAgaWYoIV9jb21wYXJlQXJyYXlMZW5ndGgodmFsMSwgdmFsMikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGZvcihsZW4gPSB2YWwxLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgIGlmKHZhbDFbaV0gIT09IHZhbDJbaV0pIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBfZGVlcEFycmF5KHZhbDEsIHZhbDIsIGNvbmZpZykge1xuICAgIHZhciBpID0gMCxcbiAgICAgICAgbGVuO1xuICAgIFxuICAgIGlmKCFfY29tcGFyZUFycmF5TGVuZ3RoKHZhbDEsIHZhbDIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IobGVuID0gdmFsMS5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgICBpZighY29tcGFyZSh2YWwxW2ldLHZhbDJbaV0sIGNvbmZpZykpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBfY29tcGFyZU9iamVjdEtleXNMZW5ndGgodmFsMSwgdmFsMikge1xuICAgIHJldHVybiAoaXMuaXNPYmplY3QodmFsMSkgJiYgaXMuaXNPYmplY3QodmFsMikgJiYgT2JqZWN0LmtleXModmFsMSkubGVuZ3RoID09PSBPYmplY3Qua2V5cyh2YWwyKS5sZW5ndGgpO1xufVxuXG5mdW5jdGlvbiBfc2hhbGxvd09iamVjdCh2YWwxLCB2YWwyKSB7XG4gICAgdmFyIGtleSwgdmFsO1xuXG4gICAgaWYgKCFfY29tcGFyZU9iamVjdEtleXNMZW5ndGgodmFsMSwgdmFsMikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGZvciAoa2V5IGluIHZhbDEpIHtcbiAgICAgICAgaWYgKHZhbDEuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgdmFsdWUgPSB2YWwxW2tleV07XG4gICAgICAgICAgICBpZiAoIXZhbDIuaGFzT3duUHJvcGVydHkoa2V5KSB8fCB2YWwyW2tleV0gIT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIF9kZWVwT2JqZWN0KHZhbDEsIHZhbDIsIGNvbmZpZykge1xuICAgIHZhciBrZXksIHZhbDtcblxuICAgIGlmICghX2NvbXBhcmVPYmplY3RLZXlzTGVuZ3RoKHZhbDEsIHZhbDIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IgKGtleSBpbiB2YWwxKSB7XG4gICAgICAgIGlmICh2YWwxLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsMVtrZXldO1xuICAgICAgICAgICAgaWYgKCF2YWwyLmhhc093blByb3BlcnR5KGtleSkgfHwgY29tcGFyZSh2YWx1ZSwgdmFsMltrZXldLCBjb25maWcpICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG5cbn1cblxuZnVuY3Rpb24gX2xvb3NlT2JqZWN0KHZhbDEsIHZhbDIsIGNvbmZpZykge1xuICAgIHZhciBrZXksIHZhbDtcblxuICAgIGlmKCEoaXMuaXNPYmplY3QodmFsMSkgJiYgaXMuaXNPYmplY3QodmFsMikpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZihjb25maWcudHlwZSA9PT0gJ2xvb3NlUmlnaHQnKSB7XG4gICAgICAgIGZvciAoa2V5IGluIHZhbDIpIHtcbiAgICAgICAgICAgIGlmICh2YWwyLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbDJba2V5XTtcbiAgICAgICAgICAgICAgICBpZiAoY29tcGFyZSh2YWx1ZSwgdmFsMVtrZXldLCBjb25maWcpICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGZvciAoa2V5IGluIHZhbDEpIHtcbiAgICAgICAgICAgIGlmICh2YWwxLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbDFba2V5XTtcbiAgICAgICAgICAgICAgICBpZiAoY29tcGFyZSh2YWx1ZSwgdmFsMltrZXldLCBjb25maWcpICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIHJldHVybiB0cnVlO1xuXG59XG5cbmZ1bmN0aW9uIF9kYXRlKHZhbDEsIHZhbDIpIHtcbiAgICBpZihpcy5pc0RhdGUodmFsMSkgJiYgaXMuaXNEYXRlKHZhbDIpKSB7XG4gICAgICAgIHJldHVybiB2YWwxLmdldFRpbWUoKSA9PT0gdmFsMi5nZXRUaW1lKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBfY3JlYXRlQm91bmRDb21wYXJlKG9iamVjdCwgZm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGZuKG9iamVjdCwgdmFsdWUpO1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIGdldENvbXBhcmVGbihvYmplY3QsIGMpIHtcbiAgICB2YXIgY29tcGFyZUZuID0gX3N0cmljdCxcbiAgICAgICAgY29uZmlnID0gYyB8fCB7fSxcbiAgICAgICAgdHlwZSA9IGNvbmZpZy50eXBlO1xuXG4gICAgaWYgKHR5cGUgPT09ICdkZWVwJyB8fCB0eXBlID09PSAnbG9vc2UnIHx8IHR5cGUgPT09ICdsb29zZVJpZ2h0JyB8fCB0eXBlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKGlzLmlzT2JqZWN0KG9iamVjdCkpIHtcbiAgICAgICAgICAgIGNvbXBhcmVGbiA9IHR5cGUgPT09ICdsb29zZScgfHwgdHlwZSA9PT0gJ2xvb3NlUmlnaHQnID8gX2xvb3NlT2JqZWN0IDogX2RlZXBPYmplY3Q7XG4gICAgICAgIH0gZWxzZSBpZiAoaXMuaXNBcnJheShvYmplY3QpKSB7XG4gICAgICAgICAgICBjb21wYXJlRm4gPSBfZGVlcEFycmF5O1xuICAgICAgICB9IGVsc2UgaWYgKGlzLmlzRGF0ZShvYmplY3QpKSB7XG4gICAgICAgICAgICBjb21wYXJlRm4gPSBfZGF0ZTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3NoYWxsb3cnKSB7XG4gICAgICAgIGlmIChpcy5pc09iamVjdChvYmplY3QpKSB7XG4gICAgICAgICAgICBjb21wYXJlRm4gPSBfc2hhbGxvd09iamVjdDtcbiAgICAgICAgfSBlbHNlIGlmIChpcy5pc0FycmF5KG9iamVjdCkpIHtcbiAgICAgICAgICAgIGNvbXBhcmVGbiA9IF9zaGFsbG93QXJyYXk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXMuaXNEYXRlKG9iamVjdCkpIHtcbiAgICAgICAgICAgIGNvbXBhcmVGbiA9IF9kYXRlO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlICE9PSAnc3RyaWN0Jykge1xuICAgICAgICAvL3dlIHdvdWxkIGJlIGRvaW5nIGEgc3RyaWN0IGNvbXBhcmlzb24gb24gYSB0eXBlLW9cbiAgICAgICAgLy9JIHRoaW5rIGFuIGVycm9yIGlzIGdvb2QgaGVyZS5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgcGFzc2VkIGluIGFuIGludmFsaWQgY29tcGFyaXNvbiB0eXBlJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbXBhcmVGbjtcbn1cblxuLyoqXG4gKiBAbWVtYmVyIEx1Y1xuICogQG1ldGhvZCBjb21wYXJlXG4gKiBcbiAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZXMgYXJlIGVxdWFsIHRvIGVhY2hcbiAqIG90aGVyLiAgQnkgZGVmYXVsdCBhIGRlZXAgY29tcGFyaXNvbiBpcyBcbiAqIGRvbmUgb24gYXJyYXlzLCBkYXRlcyBhbmQgb2JqZWN0cyBhbmQgYSBzdHJpY3QgY29tcGFyaXNvblxuICogaXMgZG9uZSBvbiBvdGhlciB0eXBlcy5cbiAqIFxuICogQHBhcmFtICB7QW55fSB2YWwxICBcbiAqIEBwYXJhbSAge0FueX0gdmFsMiAgIFxuICogQHBhcmFtICB7T2JqZWN0fSBbY29uZmlnXVxuICogQHBhcmFtIHtTdHJpbmd9IGNvbmZpZy50eXBlIHBhc3MgaW4gJ3NoYWxsb3cnIGZvciBhIHNoYWxsb3dcbiAqIGNvbXBhcmlzb24sICdkZWVwJyAoZGVmYXVsdCkgZm9yIGEgZGVlcCBjb21wYXJpc29uXG4gKiAnc3RyaWN0JyBmb3IgYSBzdHJpY3QgPT09IGNvbXBhcmlzb24gZm9yIGFsbCBvYmplY3RzIG9yIFxuICogJ2xvb3NlJyBmb3IgYSBsb29zZSBjb21wYXJpc29uIG9uIG9iamVjdHMuICBBIGxvb3NlIGNvbXBhcmlzb25cbiAqICB3aWxsIGNvbXBhcmUgdGhlIGtleXMgYW5kIHZhbHVlcyBvZiB2YWwxIHRvIHZhbDIgYW5kIGRvZXMgbm90XG4gKiAgY2hlY2sgaWYga2V5cyBmcm9tIHZhbDIgYXJlIGVxdWFsIHRvIHRoZSBrZXlzIGluIHZhbDEuXG4gKlxuICpcbiAgICBMdWMuY29tcGFyZSgnMScsIDEpXG4gICAgPmZhbHNlXG4gICAgTHVjLmNvbXBhcmUoe2E6IDF9LCB7YTogMX0pXG4gICAgPnRydWVcbiAgICBMdWMuY29tcGFyZSh7YTogMSwgYjoge319LCB7YTogMSwgYjoge30gfSwge3R5cGU6J3NoYWxsb3cnfSlcbiAgICA+ZmFsc2VcbiAgICBMdWMuY29tcGFyZSh7YTogMSwgYjoge319LCB7YTogMSwgYjoge30gfSwge3R5cGU6ICdkZWVwJ30pXG4gICAgPnRydWVcbiAgICBMdWMuY29tcGFyZSh7YTogMSwgYjoge319LCB7YTogMSwgYjoge30gfSwge3R5cGU6ICdzdHJpY3QnfSlcbiAgICA+ZmFsc2VcbiAgICBMdWMuY29tcGFyZSh7YTogMX0sIHthOjEsYjoxfSlcbiAgICA+ZmFsc2VcbiAgICBMdWMuY29tcGFyZSh7YTogMX0sIHthOjEsYjoxfSwge3R5cGU6ICdsb29zZSd9KVxuICAgID50cnVlXG4gICAgTHVjLmNvbXBhcmUoe2E6IDF9LCB7YToxLGI6MX0sIHt0eXBlOiAnbG9vc2UnfSlcbiAgICA+dHJ1ZVxuICAgIEx1Yy5jb21wYXJlKFt7YTogMX1dLCBbe2E6MSxiOjF9XSwge3R5cGU6ICdsb29zZSd9KVxuICAgID50cnVlXG4gICAgTHVjLmNvbXBhcmUoW3thOiAxfSwge31dLCBbe2E6MSxiOjF9XSwge3R5cGU6ICdsb29zZSd9KVxuICAgID5mYWxzZVxuICAgIEx1Yy5jb21wYXJlKFt7YTogMX0sIHt9XSwgW3thOjEsYjoxfSwge31dLCB7dHlwZTogJ2xvb3NlJ30pXG4gICAgPnRydWVcbiAgICBMdWMuY29tcGFyZShbe2E6MSxiOjF9XSwgW3thOiAxfV0sIHt0eXBlOiAnbG9vc2UnfSlcbiAgICA+ZmFsc2VcblxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gY29tcGFyZSh2YWwxLCB2YWwyLCBjb25maWcpIHtcbiAgICByZXR1cm4gZ2V0Q29tcGFyZUZuKHZhbDEsIGNvbmZpZykodmFsMSwgdmFsMiwgY29uZmlnKTtcbn1cblxuZXhwb3J0cy5jb21wYXJlID0gY29tcGFyZTsiLCJ2YXIgZW1wdHlGbiA9IHJlcXVpcmUoJy4uL2Z1bmN0aW9uJykuZW1wdHlGbixcbiAgICBhcHBseSA9IHJlcXVpcmUoJy4uL29iamVjdCcpLmFwcGx5O1xuXG4vKipcbiAqIEBjbGFzcyBMdWMuQmFzZVxuICogU2ltcGxlIGNsYXNzIHRoYXQgYnkgZGVmYXVsdCB7QGxpbmsgTHVjI2FwcGx5IGFwcGxpZXN9IHRoZSBcbiAqIGZpcnN0IGFyZ3VtZW50IHRvIHRoZSBpbnN0YW5jZSBhbmQgdGhlbiBjYWxsc1xuICogTHVjLkJhc2UuaW5pdC5cbiAqXG4gICAgdmFyIGIgPSBuZXcgTHVjLkJhc2Uoe1xuICAgICAgICBhOiAxLFxuICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdoZXknKVxuICAgICAgICB9XG4gICAgfSlcbiAgICBiLmFcbiAgICA+aGV5XG4gICAgPjFcbiAqXG4gKiBXZSBmb3VuZCB0aGF0IG1vc3Qgb2Ygb3VyIGNsYXNzZXMgZG8gdGhpcyBzbyB3ZSBtYWRlXG4gKiBpdCB0aGUgZGVmYXVsdC4gIEhhdmluZyBhIGNvbmZpZyBvYmplY3QgYXMgdGhlIGZpcnN0IGFuZCBvbmx5IFxuICogcGFyYW0ga2VlcHMgYSBjbGVhbiBhcGkgYXMgd2VsbC5cbiAqXG4gICAgdmFyIEMgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBMdWMuQXJyYXkuZWFjaCh0aGlzLml0ZW1zLCB0aGlzLmxvZ0l0ZW1zKVxuICAgICAgICB9LFxuXG4gICAgICAgIGxvZ0l0ZW1zOiBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhpdGVtKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIGMgPSBuZXcgQyh7aXRlbXM6IFsxLDIsM119KTtcbiAgICA+MVxuICAgID4yXG4gICAgPjNcbiAgICB2YXIgZCA9IG5ldyBDKHtpdGVtczogJ0EnfSk7XG4gICAgPidBJ1xuICAgIHZhciBlID0gbmV3IEMoKTtcbiAqXG4gKiBJZiB5b3UgZG9uJ3QgbGlrZSB0aGUgYXBwbHlpbmcgb2YgdGhlIGNvbmZpZyB0byB0aGUgaW5zdGFuY2UgaXQgXG4gKiBjYW4gYWx3YXlzIGJlIFwiZGlzYWJsZWRcIlxuICpcbiAgICB2YXIgTm9BcHBseSA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICBiZWZvcmVJbml0OiBmdW5jdGlvbigpIHtcblxuICAgICAgICB9LFxuICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIEx1Yy5BcnJheS5lYWNoKHRoaXMuaXRlbXMsIHRoaXMubG9nSXRlbXMpXG4gICAgICAgIH0sXG5cbiAgICAgICAgbG9nSXRlbXM6IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGl0ZW0pO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB2YXIgYyA9IG5ldyBOb0FwcGx5KHtpdGVtczogWzEsMiwzXX0pO1xuICogXG4gKi9cbmZ1bmN0aW9uIEJhc2UoKSB7XG4gICAgdGhpcy5iZWZvcmVJbml0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5pbml0KCk7XG59XG5cbkJhc2UucHJvdG90eXBlID0ge1xuICAgIC8qKlxuICAgICAqIEJ5IGRlZmF1bHQgYXBwbHkgdGhlIGNvbmZpZyB0byB0aGUgXG4gICAgICogaW5zdGFuY2UuXG4gICAgICovXG4gICAgYmVmb3JlSW5pdDogZnVuY3Rpb24oY29uZmlnKSB7XG4gICAgICAgIGFwcGx5KHRoaXMsIGNvbmZpZyk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBAbWV0aG9kXG4gICAgICogU2ltcGxlIGhvb2sgdG8gaW5pdGlhbGl6ZVxuICAgICAqIHRoZSBjbGFzcy4gIERlZmF1bHRzIHRvIEx1Yy5lbXB0eUZuXG4gICAgICovXG4gICAgaW5pdDogZW1wdHlGblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYXNlOyIsInZhciBCYXNlID0gcmVxdWlyZSgnLi9iYXNlJyksXG4gICAgQ29tcG9zaXRpb24gPSByZXF1aXJlKCcuL2NvbXBvc2l0aW9uJyksXG4gICAgb2JqID0gcmVxdWlyZSgnLi4vb2JqZWN0JyksXG4gICAgYXJyYXlGbnMgPSByZXF1aXJlKCcuLi9hcnJheScpLFxuICAgIGVtcHR5Rm4gPSByZXF1aXJlKCcuLi9mdW5jdGlvbicpLmVtcHR5Rm4sXG4gICAgaXMgPSByZXF1aXJlKCcuLi9pcycpLFxuICAgIGFFYWNoID0gYXJyYXlGbnMuZWFjaCxcbiAgICBhcHBseSA9IG9iai5hcHBseSxcbiAgICBvRWFjaCA9IG9iai5lYWNoLFxuICAgIG9GaWx0ZXIgPSBvYmouZmlsdGVyLFxuICAgIG1peCA9IG9iai5taXgsXG4gICAgYXJyYXlTbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZSxcbiAgICBDbGFzc0RlZmluZXI7XG5cbi8qKlxuICogQGNsYXNzIEx1Yy5DbGFzc0RlZmluZXJcbiAqIEBzaW5nbGV0b25cbiAqXG4gKiBTaW5nbGV0b24gdGhhdCB7QGxpbmsgTHVjLmRlZmluZSNkZWZpbmUgTHVjLmRlZmluZX0gdXNlcyB0byBkZWZpbmUgY2xhc3Nlcy4gIFRoZSBkZWZ1YWx0IHR5cGUgY2FuXG4gKiBiZSBjaGFuZ2VkIHRvIGFueSBDb25zdHJ1Y3RvclxuICpcbiAgICBmdW5jdGlvbiBNeUNsYXNzKCl7fTtcbiAgICBMdWMuQ2xhc3NEZWZpbmVyLmRlZmF1bHRUeXBlID0gTXlDbGFzcztcbiAgICB2YXIgQyA9IEx1Yy5kZWZpbmUoKTtcbiAgICBuZXcgQygpIGluc3RhbmNlb2YgTHVjLkJhc2VcbiAgICA+ZmFsc2VcbiAgICBuZXcgQygpIGluc3RhbmNlb2YgTXlDbGFzc1xuICAgID50cnVlXG4gKi9cblxuLyoqXG4gKiBAY2ZnIHtGdW5jdGlvbn0gZGVmYXVsdFR5cGUgdGhpcyBjYW4gYmUgY2hhbmdlZCB0byBhbnkgQ29uc3RydWN0b3IuICBEZWZhdWx0c1xuICogdG8gTHVjLkJhc2UuXG4gKi9cblxuQ2xhc3NEZWZpbmVyID0ge1xuXG4gICAgQ09NUE9TSVRJT05TX05BTUU6ICckY29tcG9zaXRpb25zJyxcblxuICAgIGRlZmF1bHRUeXBlOiBCYXNlLFxuXG4gICAgcHJvY2Vzc29yS2V5czoge1xuICAgICAgICAkbWl4aW5zOiAnX2FwcGx5TWl4aW5zJyxcbiAgICAgICAgJHN0YXRpY3M6ICdfYXBwbHlTdGF0aWNzJyxcbiAgICAgICAgJGNvbXBvc2l0aW9uczogJ19hcHBseUNvbXBvc2VyTWV0aG9kcycsXG4gICAgICAgICRzdXBlcjogJ19hcHBseVN1cGVyJ1xuICAgIH0sXG5cbiAgICBkZWZpbmU6IGZ1bmN0aW9uKG9wdHMsIGFmdGVyKSB7XG4gICAgICAgIHZhciBvcHRpb25zID0gb3B0cyB8fCB7fSxcbiAgICAgICAgICAgIC8vaWYgc3VwZXIgaXMgYSBmYWxzeSB2YWx1ZSBiZXNpZGVzIHVuZGVmaW5lZCB0aGF0IG1lYW5zIG5vIHN1cGVyY2xhc3NcbiAgICAgICAgICAgIFN1cGVyID0gb3B0aW9ucy4kc3VwZXIgfHwgKG9wdGlvbnMuJHN1cGVyID09PSB1bmRlZmluZWQgPyB0aGlzLmRlZmF1bHRUeXBlIDogZmFsc2UpLFxuICAgICAgICAgICAgYWZ0ZXJEZWZpbmUgPSBhZnRlciB8fCBlbXB0eUZuLFxuICAgICAgICAgICAgQ29uc3RydWN0b3I7XG5cbiAgICAgICAgb3B0aW9ucy4kc3VwZXIgPSBTdXBlcjtcblxuICAgICAgICBDb25zdHJ1Y3RvciA9IHRoaXMuX2NyZWF0ZUNvbnN0cnVjdG9yKG9wdGlvbnMpO1xuXG4gICAgICAgIHRoaXMuX3Byb2Nlc3NBZnRlckNyZWF0ZShDb25zdHJ1Y3Rvciwgb3B0aW9ucyk7XG5cbiAgICAgICAgYWZ0ZXJEZWZpbmUuY2FsbChDb25zdHJ1Y3RvciwgQ29uc3RydWN0b3IpO1xuXG4gICAgICAgIHJldHVybiBDb25zdHJ1Y3RvcjtcbiAgICB9LFxuXG4gICAgX2NyZWF0ZUNvbnN0cnVjdG9yOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHZhciBzdXBlcmNsYXNzID0gb3B0aW9ucy4kc3VwZXIsXG4gICAgICAgICAgICBDb25zdHJ1Y3RvciA9IHRoaXMuX2NyZWF0ZUNvbnN0cnVjdG9yRm4ob3B0aW9ucyk7XG5cbiAgICAgICAgaWYoc3VwZXJjbGFzcykge1xuICAgICAgICAgICAgQ29uc3RydWN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlcmNsYXNzLnByb3RvdHlwZSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBDb25zdHJ1Y3RvcjtcbiAgICB9LFxuXG4gICAgX2NyZWF0ZUNvbnN0cnVjdG9yRm46IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHN1cGVyY2xhc3MgPSBvcHRpb25zLiRzdXBlcixcbiAgICAgICAgICAgIENvbnN0cnVjdG9yO1xuXG4gICAgICAgIGlmICh0aGlzLl9oYXNDb25zdHJ1Y3Rvck1vZGlmeWluZ09wdGlvbnMob3B0aW9ucykpIHtcbiAgICAgICAgICAgIENvbnN0cnVjdG9yID0gdGhpcy5fY3JlYXRlQ29uc3RydWN0b3JGcm9tT3B0aW9ucyhvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKCFzdXBlcmNsYXNzKSB7XG4gICAgICAgICAgICBDb25zdHJ1Y3RvciA9IGZ1bmN0aW9uKCkge307XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBDb25zdHJ1Y3RvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHN1cGVyY2xhc3MuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gQ29uc3RydWN0b3I7XG4gICAgfSxcblxuICAgIF9oYXNDb25zdHJ1Y3Rvck1vZGlmeWluZ09wdGlvbnM6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMuJGNvbXBvc2l0aW9ucztcbiAgICB9LFxuXG4gICAgX2NyZWF0ZUNvbnN0cnVjdG9yRnJvbU9wdGlvbnM6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHN1cGVyY2xhc3MgPSBvcHRpb25zLiRzdXBlcixcbiAgICAgICAgICAgIG1lID0gdGhpcyxcbiAgICAgICAgICAgIGluaXRCZWZvcmVTdXBlcmNsYXNzLFxuICAgICAgICAgICAgaW5pdEFmdGVyU3VwZXJjbGFzcyxcbiAgICAgICAgICAgIGluaXQ7XG5cbiAgICAgICAgaWYgKCFzdXBlcmNsYXNzKSB7XG4gICAgICAgICAgICBpbml0ID0gdGhpcy5fY3JlYXRlSW5pdENsYXNzRm4ob3B0aW9ucywge1xuICAgICAgICAgICAgICAgIGFsbDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXJncyA9IGFycmF5U2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIGluaXQuY2FsbCh0aGlzLCBvcHRpb25zLCBhcmdzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBpbml0QmVmb3JlU3VwZXJjbGFzcyA9IHRoaXMuX2NyZWF0ZUluaXRDbGFzc0ZuKG9wdGlvbnMsIHtcbiAgICAgICAgICAgIGJlZm9yZTogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICBpbml0QWZ0ZXJTdXBlcmNsYXNzID0gdGhpcy5fY3JlYXRlSW5pdENsYXNzRm4ob3B0aW9ucywge1xuICAgICAgICAgICAgYmVmb3JlOiBmYWxzZVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgYXJncyA9IGFycmF5U2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXG4gICAgICAgICAgICBpbml0QmVmb3JlU3VwZXJjbGFzcy5jYWxsKHRoaXMsIG9wdGlvbnMsIGFyZ3MpO1xuICAgICAgICAgICAgc3VwZXJjbGFzcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgaW5pdEFmdGVyU3VwZXJjbGFzcy5jYWxsKHRoaXMsIG9wdGlvbnMsIGFyZ3MpO1xuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBfY3JlYXRlSW5pdENsYXNzRm46IGZ1bmN0aW9uKG9wdGlvbnMsIGNvbmZpZykge1xuICAgICAgICB2YXIgbWUgPSB0aGlzLFxuICAgICAgICAgICAgY29tcG9zaXRpb25zID0gdGhpcy5fZmlsdGVyQ29tcG9zaXRpb25zKGNvbmZpZywgb3B0aW9ucy4kY29tcG9zaXRpb25zKTtcblxuICAgICAgICBpZihjb21wb3NpdGlvbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gZW1wdHlGbjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKG9wdGlvbnMsIGluc3RhbmNlQXJncykge1xuICAgICAgICAgICAgbWUuX2luaXRDb21wb3NpdGlvbnMuY2FsbCh0aGlzLCBjb21wb3NpdGlvbnMsIGluc3RhbmNlQXJncyk7XG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIF9maWx0ZXJDb21wb3NpdGlvbnM6IGZ1bmN0aW9uKGNvbmZpZywgY29tcG9zaXRpb25zKSB7XG4gICAgICAgIHZhciBiZWZvcmUgPSBjb25maWcuYmVmb3JlLCBcbiAgICAgICAgICAgIGZpbHRlcmVkID0gW107XG5cbiAgICAgICAgaWYoY29uZmlnLmFsbCkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbXBvc2l0aW9ucztcbiAgICAgICAgfVxuXG4gICAgICAgIGFFYWNoKGNvbXBvc2l0aW9ucywgZnVuY3Rpb24oY29tcG9zaXRpb24pIHtcbiAgICAgICAgICAgIGlmKGJlZm9yZSAmJiBjb21wb3NpdGlvbi5pbml0QWZ0ZXIgIT09IHRydWUgfHwgKCFiZWZvcmUgJiYgY29tcG9zaXRpb24uaW5pdEFmdGVyID09PSB0cnVlKSkge1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZC5wdXNoKGNvbXBvc2l0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGZpbHRlcmVkO1xuICAgIH0sXG5cbiAgICBfcHJvY2Vzc0FmdGVyQ3JlYXRlOiBmdW5jdGlvbigkY2xhc3MsIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5fYXBwbHlWYWx1ZXNUb1Byb3RvKCRjbGFzcywgb3B0aW9ucyk7XG4gICAgICAgIHRoaXMuX2hhbmRsZVBvc3RQcm9jZXNzb3JzKCRjbGFzcywgb3B0aW9ucyk7XG4gICAgfSxcblxuICAgIF9hcHBseVZhbHVlc1RvUHJvdG86IGZ1bmN0aW9uKCRjbGFzcywgb3B0aW9ucykge1xuICAgICAgICB2YXIgcHJvdG8gPSAkY2xhc3MucHJvdG90eXBlLFxuICAgICAgICAgICAgdmFsdWVzID0gYXBwbHkoe1xuICAgICAgICAgICAgICAgICRjbGFzczogJGNsYXNzXG4gICAgICAgICAgICB9LCBvcHRpb25zKTtcblxuICAgICAgICAvL0Rvbid0IHB1dCB0aGUgZGVmaW5lIHNwZWNpZmljIHByb3BlcnRpZXNcbiAgICAgICAgLy9vbiB0aGUgcHJvdG90eXBlXG4gICAgICAgIG9FYWNoKHZhbHVlcywgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9nZXRQcm9jZXNzb3JLZXkoa2V5KSkge1xuICAgICAgICAgICAgICAgIHByb3RvW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIF9nZXRQcm9jZXNzb3JLZXk6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzb3JLZXlzW2tleV07XG4gICAgfSxcblxuICAgIF9oYW5kbGVQb3N0UHJvY2Vzc29yczogZnVuY3Rpb24oJGNsYXNzLCBvcHRpb25zKSB7XG4gICAgICAgIG9FYWNoKG9wdGlvbnMsIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBtZXRob2QgPSB0aGlzLl9nZXRQcm9jZXNzb3JLZXkoa2V5KTtcblxuICAgICAgICAgICAgaWYgKGlzLmlzRnVuY3Rpb24odGhpc1ttZXRob2RdKSkge1xuICAgICAgICAgICAgICAgIHRoaXNbbWV0aG9kXS5jYWxsKHRoaXMsICRjbGFzcywgb3B0aW9uc1trZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIF9hcHBseU1peGluczogZnVuY3Rpb24oJGNsYXNzLCBtaXhpbnMpIHtcbiAgICAgICAgdmFyIHByb3RvID0gJGNsYXNzLnByb3RvdHlwZTtcbiAgICAgICAgYUVhY2gobWl4aW5zLCBmdW5jdGlvbihtaXhpbikge1xuICAgICAgICAgICAgLy9hY2NlcHQgQ29uc3RydWN0b3JzIG9yIE9iamVjdHNcbiAgICAgICAgICAgIHZhciB0b01peCA9IG1peGluLnByb3RvdHlwZSB8fCBtaXhpbjtcbiAgICAgICAgICAgIG1peChwcm90bywgdG9NaXgpO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgX2FwcGx5U3RhdGljczogZnVuY3Rpb24oJGNsYXNzLCBzdGF0aWNzKSB7XG4gICAgICAgIHZhciBwcm90b3R5cGUgPSAkY2xhc3MucHJvdG90eXBlO1xuXG4gICAgICAgIGFwcGx5KCRjbGFzcywgc3RhdGljcyk7XG5cbiAgICAgICAgaWYocHJvdG90eXBlLmdldFN0YXRpY1ZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHByb3RvdHlwZS5nZXRTdGF0aWNWYWx1ZSA9IHRoaXMuZ2V0U3RhdGljVmFsdWU7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2FwcGx5Q29tcG9zZXJNZXRob2RzOiBmdW5jdGlvbigkY2xhc3MsIGNvbXBvc2l0aW9ucykge1xuICAgICAgICB2YXIgcHJvdG90eXBlID0gJGNsYXNzLnByb3RvdHlwZSxcbiAgICAgICAgICAgIG1ldGhvZHNUb0NvbXBvc2U7XG5cbiAgICAgICAgYUVhY2goY29tcG9zaXRpb25zLCBmdW5jdGlvbihjb21wb3NpdGlvbkNvbmZpZykge1xuICAgICAgICAgICAgdmFyIGNvbXBvc2l0aW9uID0gbmV3IENvbXBvc2l0aW9uKGNvbXBvc2l0aW9uQ29uZmlnKSxcbiAgICAgICAgICAgICAgICBuYW1lID0gY29tcG9zaXRpb24ubmFtZSxcbiAgICAgICAgICAgICAgICBDb25zdHJ1Y3RvciA9IGNvbXBvc2l0aW9uLkNvbnN0cnVjdG9yO1xuXG4gICAgICAgICAgICBjb21wb3NpdGlvbi52YWxpZGF0ZSgpO1xuXG4gICAgICAgICAgICBtZXRob2RzVG9Db21wb3NlID0gY29tcG9zaXRpb24uZ2V0TWV0aG9kc1RvQ29tcG9zZSgpO1xuXG4gICAgICAgICAgICBtZXRob2RzVG9Db21wb3NlLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICAgICAgaWYgKHByb3RvdHlwZVtrZXldID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvdG90eXBlW2tleV0gPSB0aGlzLl9jcmVhdGVDb21wb3NlclByb3RvRm4oa2V5LCBuYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICAgICAgaWYocHJvdG90eXBlLmdldENvbXBvc2l0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBwcm90b3R5cGUuZ2V0Q29tcG9zaXRpb24gPSB0aGlzLmdldENvbXBvc2l0aW9uO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICBfYXBwbHlTdXBlcjogZnVuY3Rpb24oJGNsYXNzLCAkc3VwZXIpIHtcbiAgICAgICAgdmFyIHByb3RvO1xuICAgICAgICAvL3N1cGVyIGNhbiBiZSBmYWxzeSB0byBzaWduaWZ5IG5vIHN1cGVyY2xhc3NcbiAgICAgICAgaWYgKCRzdXBlcikge1xuICAgICAgICAgICAgcHJvdG8gPSAkY2xhc3MucHJvdG90eXBlO1xuICAgICAgICAgICAgcHJvdG8uJHN1cGVyID0gJHN1cGVyO1xuICAgICAgICAgICAgcHJvdG8uJHN1cGVyY2xhc3MgPSAkc3VwZXIucHJvdG90eXBlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9jcmVhdGVDb21wb3NlclByb3RvRm46IGZ1bmN0aW9uKG1ldGhvZE5hbWUsIGNvbXBvc2l0aW9uTmFtZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgY29tcCA9IHRoaXNbQ2xhc3NEZWZpbmVyLkNPTVBPU0lUSU9OU19OQU1FXVtjb21wb3NpdGlvbk5hbWVdO1xuICAgICAgICAgICAgcmV0dXJuIGNvbXBbbWV0aG9kTmFtZV0uYXBwbHkoY29tcCwgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAaWdub3JlXG4gICAgICogb3B0aW9ucyB7T2JqZWN0fSB0aGUgY29tcG9zaXRpb24gY29uZmlnIG9iamVjdFxuICAgICAqIGluc3RhbmNlQXJncyB7QXJyYXl9IHRoZSBhcmd1bWVudHMgcGFzc2VkIHRvIHRoZSBpbnN0YW5jZSdzXG4gICAgICogY29uc3RydWN0b3IuXG4gICAgICovXG4gICAgX2luaXRDb21wb3NpdGlvbnM6IGZ1bmN0aW9uKGNvbXBvc2l0aW9ucywgaW5zdGFuY2VBcmdzKSB7XG4gICAgICAgIGlmKCF0aGlzW0NsYXNzRGVmaW5lci5DT01QT1NJVElPTlNfTkFNRV0pIHtcbiAgICAgICAgICAgIHRoaXNbQ2xhc3NEZWZpbmVyLkNPTVBPU0lUSU9OU19OQU1FXSA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgYUVhY2goY29tcG9zaXRpb25zLCBmdW5jdGlvbihjb21wb3NpdGlvbkNvbmZpZykge1xuICAgICAgICAgICAgdmFyIGNvbmZpZyA9IGFwcGx5KHtcbiAgICAgICAgICAgICAgICBpbnN0YW5jZTogdGhpcyxcbiAgICAgICAgICAgICAgICBpbnN0YW5jZUFyZ3M6IGluc3RhbmNlQXJnc1xuICAgICAgICAgICAgfSwgY29tcG9zaXRpb25Db25maWcpLCBcbiAgICAgICAgICAgIGNvbXBvc2l0aW9uO1xuXG4gICAgICAgICAgICBjb21wb3NpdGlvbiA9IG5ldyBDb21wb3NpdGlvbihjb25maWcpO1xuXG4gICAgICAgICAgICB0aGlzW0NsYXNzRGVmaW5lci5DT01QT1NJVElPTlNfTkFNRV1bY29tcG9zaXRpb24ubmFtZV0gPSBjb21wb3NpdGlvbi5nZXRJbnN0YW5jZSgpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgLy9NZXRob2RzIHRoYXQgY2FuIGdldCBhZGRlZCB0byB0aGUgcHJvdG90eXBlXG4gICAgLy90aGV5IHdpbGwgYmUgY2FsbGVkIGluIHRoZSBjb250ZXh0IG9mIHRoZSBpbnN0YW5jZS5cbiAgICAvL1xuICAgIGdldENvbXBvc2l0aW9uOiBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbQ2xhc3NEZWZpbmVyLkNPTVBPU0lUSU9OU19OQU1FXVtrZXldO1xuICAgIH0sXG5cbiAgICBnZXRTdGF0aWNWYWx1ZTogZnVuY3Rpb24gKGtleSwgJGNsYXNzKSB7XG4gICAgICAgIHZhciBjbGFzc1RvRmluZFZhbHVlID0gJGNsYXNzIHx8IHRoaXMuJGNsYXNzLFxuICAgICAgICAgICAgJHN1cGVyLFxuICAgICAgICAgICAgdmFsdWU7XG5cbiAgICAgICAgdmFsdWUgPSBjbGFzc1RvRmluZFZhbHVlW2tleV07XG5cbiAgICAgICAgaWYodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgJHN1cGVyID0gY2xhc3NUb0ZpbmRWYWx1ZS5wcm90b3R5cGUuJHN1cGVyO1xuICAgICAgICAgICAgaWYoJHN1cGVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0U3RhdGljVmFsdWUoa2V5LCAkc3VwZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxufTtcblxuQ2xhc3NEZWZpbmVyLmRlZmluZSA9IENsYXNzRGVmaW5lci5kZWZpbmUuYmluZChDbGFzc0RlZmluZXIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENsYXNzRGVmaW5lcjtcblxuLyoqXG4gKiBAY2xhc3MgIEx1Yy5kZWZpbmVcbiAqIFRoaXMgaXMgYWN0dWFsbHkgYSBmdW5jdGlvbiBidXQgaGFzIGEgZGVjZW50IGFtb3VudCBvZiBpbXBvcnRhbnQgb3B0aW9uc1xuICogc28gd2UgYXJlIGRvY3VtZW50aW5nIGl0IGxpa2UgaXQgaXMgYSBjbGFzcy4gIFByb3BlcnRpZXMgYXJlIHRoaW5ncyB0aGF0IHdpbGwgZ2V0XG4gKiBhcHBsaWVkIHRvIGluc3RhbmNlcyBvZiBjbGFzc2VzIGRlZmluZWQgd2l0aCB7QGxpbmsgTHVjLmRlZmluZSNkZWZpbmUgZGVmaW5lfS4gIE5vbmVcbiAqIGFyZSBuZWVkZWQgZm9yIHtAbGluayBMdWMuZGVmaW5lI2RlZmluZSBkZWZpbmluZ30gYSBjbGFzcy4gIHtAbGluayBMdWMuZGVmaW5lI2RlZmluZSBkZWZpbmV9XG4gKiBqdXN0IHRha2VzIHRoZSBwYXNzZWQgaW4gY29uZmlnIGFuZCBwdXRzIHRoZSBwcm9wZXJ0aWVzIG9uIHRoZSBwcm90b3R5cGUgYW5kIHJldHVybnNcbiAqIGEgQ29uc3RydWN0b3IuXG4gKlxuXG4gICAgdmFyIEMgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgYTogMSxcbiAgICAgICAgZG9Mb2c6IHRydWUsXG4gICAgICAgIGxvZ0E6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZG9Mb2cpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgdmFyIGMgPSBuZXcgQygpO1xuICAgIGMubG9nQSgpO1xuICAgID4xXG4gICAgYy5hID0gNDU7XG4gICAgYy5sb2dBKCk7XG4gICAgPjQ1XG4gICAgYy5kb0xvZyA9IGZhbHNlO1xuICAgIGMubG9nQSgpO1xuXG4gICAgbmV3IEMoKS5sb2dBKClcbiAgICA+MVxuXG4gKlxuICogQ2hlY2sgb3V0IHRoZSBmb2xsb3dpbmcgY29uZmlncyB0byBhZGQgZnVuY3Rpb25hbGl0eSB0byBhIGNsYXNzIHdpdGhvdXQgbWVzc2luZ1xuICogdXAgdGhlIGluaGVyaXRhbmNlIGNoYWluLiAgQWxsIHRoZSBjb25maWdzIGhhdmUgZXhhbXBsZXMgYW5kIGRvY3VtZW50YXRpb24gb24gXG4gKiBob3cgdG8gdXNlIHRoZW0uXG4gKlxuICoge0BsaW5rIEx1Yy5kZWZpbmUjJHN1cGVyIHN1cGVyfSA8YnI+XG4gKiB7QGxpbmsgTHVjLmRlZmluZSMkY29tcG9zaXRpb25zIGNvbXBvc2l0aW9uc30gPGJyPlxuICoge0BsaW5rIEx1Yy5kZWZpbmUjJG1peGlucyBtaXhpbnN9IDxicj5cbiAqIHtAbGluayBMdWMuZGVmaW5lIyRzdGF0aWNzIHN0YXRpY3N9IDxicj5cbiAqIFxuICogXG4gKi9cblxuLyoqXG4gKiBAbWV0aG9kICBkZWZpbmVcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgY29uZmlnIG9iamVjdCB1c2VkIHdoZW4gY3JlYXRpbmcgdGhlIGNsYXNzLiAgQW55IHByb3BlcnR5IHRoYXRcbiAqIGlzIG5vdCBhcGFydCBvZiB0aGUgc3BlY2lhbCBjb25maWdzIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgcHJvdG90eXBlLiAgQ2hlY2sgb3V0XG4gKiBMdWMuZGVmaW5lIGZvciBhbGwgdGhlIGNvbmZpZyBvcHRpb25zLiAgIE5vIGNvbmZpZ3MgYXJlIG5lZWRlZCB0byBkZWZpbmUgYSBjbGFzcy5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBhZnRlckRlZmluZSAob3B0aW9uYWwpIGZ1bmN0aW9uIHRvIHJ1biBhZnRlciB0aGUgQ29uc3RydWN0b3IgaGFzIGJlZW4gY3JlYXRlZC5cbiAqIFRoZSBmaXJzdCBhbiBvbmx5IGFyZ3VtZW50IGlzIHRoZSBuZXdseSBjcmVhdGVkIENvbnN0cnVjdG9yLlxuICogXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gdGhlIGRlZmluZWQgY2xhc3NcbiAqXG4gICAgdmFyIEMgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgbG9nQTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmEpXG4gICAgICAgIH0sXG4gICAgICAgIGE6IDFcbiAgICB9KTtcbiAgICB2YXIgYyA9IG5ldyBDKCk7XG4gICAgYy5sb2dBKCk7XG4gICAgPjFcblxuICAgIGMuYSA9IDQ7XG4gICAgYy5sb2dBKCk7XG4gICAgPjRcbiAqXG4gKlxuICovXG5cbi8qKlxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gJGNsYXNzIHJlZmVyZW5jZSB0byB0aGUgaW5zdGFuY2UncyBvd24gY29uc3RydWN0b3IuICBUaGlzXG4gKiB3aWxsIGdldCBhZGRlZCB0byBhbnkgY2xhc3MgdGhhdCBpcyBkZWZpbmVkIHdpdGggTHVjLmRlZmluZS5cbiAqIFxuICAgIHZhciBDID0gTHVjLmRlZmluZSgpXG4gICAgdmFyIGMgPSBuZXcgQygpXG4gICAgYy4kY2xhc3MgPT09IENcbiAgICA+dHJ1ZVxuICpcbiAqIFRoZXJlIGFyZSBzb21lIHJlYWxseSBnb29kIHVzZSBjYXNlcyB0byBoYXZlIGEgcmVmZXJlbmNlIHRvIGl0J3NcbiAqIG93biBjb25zdHJ1Y3Rvci4gIDxicj4gQWRkIGZ1bmN0aW9uYWxpdHkgdG8gYW4gaW5zdGFuY2UgaW4gYSBzaW1wbGVcbiAqIGFuZCBnZW5lcmljIHdheTpcbiAqXG4gICAgdmFyIEMgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgYWRkOiBmdW5jdGlvbihhLGIpIHtcbiAgICAgICAgICAgIHJldHVybiBhICsgYjtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy9MdWMuQmFzZSBhcHBsaWVzIGZpcnN0IFxuICAgIC8vYXJnIHRvIHRoZSBpbnN0YW5jZVxuXG4gICAgdmFyIGMgPSBuZXcgQyh7XG4gICAgICAgIGFkZDogZnVuY3Rpb24oYSxiLGMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLiRjbGFzcy5wcm90b3R5cGUuYWRkLmNhbGwodGhpcywgYSxiKSArIGM7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGMuYWRkKDEsMiwzKVxuICAgID42XG4gICAgbmV3IEMoKS5hZGQoMSwyLDMpXG4gICAgPjNcbiAqXG4gKiBPciBoYXZlIGEgc2ltcGxlIGdlbmVyaWMgY2xvbmUgbWV0aG9kIDpcbiAqXG4gICAgdmFyIEMgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgY2xvbmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIG15T3duUHJvcHMgPSB7fTtcbiAgICAgICAgICAgIEx1Yy5PYmplY3QuZWFjaCh0aGlzLCBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgbXlPd25Qcm9wc1trZXldID0gdmFsdWU7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIG5ldyB0aGlzLiRjbGFzcyhteU93blByb3BzKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIGMgPSBuZXcgQyh7YToxLGI6MixjOjN9KTtcbiAgICBjLmQgPSA0O1xuICAgIHZhciBjbG9uZSA9IGMuY2xvbmUoKTtcblxuICAgIGNsb25lID09PSBjXG4gICAgPmZhbHNlXG5cbiAgICBjbG9uZS5hXG4gICAgPjFcbiAgICBjbG9uZS5iXG4gICAgPjJcbiAgICBjbG9uZS5jXG4gICAgPjNcbiAgICBjbG9uZS5kXG4gICAgPjRcbiAqL1xuXG4vKipcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IFskc3VwZXJdIElmICRzdXBlciBpcyBub3QgZmFsc2Ugb3IgbnVsbCBcbiAqIHRoZSAkc3VwZXIgcHJvcGVydHkgd2lsbCBiZSBhZGRlZCB0byBldmVyeSBpbnN0YW5jZSBvZiB0aGUgZGVmaW5lZCBjbGFzcyxcbiAqICRzdXBlciBpcyB0aGUgQ29uc3RydWN0b3IgcGFzc2VkIGluIHdpdGggdGhlICRzdXBlciBjb25maWcgb3IgdGhlIHtAbGluayBMdWMuQ2xhc3NEZWZpbmVyI2RlZmF1bHRUeXBlIGRlZmF1bHR9XG4gKiBcbiAgICB2YXIgQyA9IEx1Yy5kZWZpbmUoKVxuICAgIHZhciBjID0gbmV3IEMoKVxuICAgIC8vTHVjLkJhc2UgaXMgdGhlIGRlZmF1bHQgXG4gICAgYy4kc3VwZXIgPT09IEx1Yy5CYXNlXG4gICAgPnRydWVcbiAqL1xuXG4vKipcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IFskc3VwZXJjbGFzc10gSWYgJHN1cGVyIGlzIGRlZmluZWQgaXRcbiAqIHdpbGwgYmUgdGhlIHByb3RvdHlwZSBvZiAkc3VwZXIuICBJdCBjYW4gYmUgdXNlZCB0byBjYWxsIGEgcGFyZW50J3NcbiAqIG1ldGhvZFxuICogXG4gICAgZnVuY3Rpb24gTXlDb29sQ2xhc3MoKSB7fVxuICAgIE15Q29vbENsYXNzLnByb3RvdHlwZS5hZGROdW1zID0gZnVuY3Rpb24oYSxiKSB7XG4gICAgICAgIHJldHVybiBhICsgYjtcbiAgICB9XG5cbiAgICB2YXIgTXlPdGhlckNvb2xDbGFzcyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICAkc3VwZXI6IE15Q29vbENsYXNzLFxuICAgICAgICBhZGROdW1zOiBmdW5jdGlvbihhLCBiLCBjKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kc3VwZXJjbGFzcy5hZGROdW1zLmNhbGwodGhpcywgYSwgYikgKyBjO1xuICAgICAgICB9XG4gICAgfSlcblxuICAgIHZhciBtID0gbmV3IE15T3RoZXJDb29sQ2xhc3MoKTtcbiAgICBtLmFkZE51bXMoMSwyLDMpO1xuICAgID42XG4gKi9cblxuLyoqXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBnZXRTdGF0aWNWYWx1ZSB0aGlzIG1ldGhvZFxuICogd2lsbCBiZSBhZGRlZCB0byBpbnN0YW5jZXMgdGhhdCB1c2UgdGhlIHtAbGluayBMdWMuZGVmaW5lIyRzdGF0aWNzICRzdGF0aWNzfVxuICogY29uZmlnLlxuICpcbiAqIFxuICogVGhpcyBzaG91bGQgYmUgdXNlZCBvdmVyIHRoaXMuJGNsYXNzLnN0YXRpY05hbWUgdG9cbiAqIGdldCB0aGUgdmFsdWUgb2Ygc3RhdGljLiAgSWYgdGhlIGNsYXNzIGdldHMgaW5oZXJpdGVkXG4gKiBmcm9tLCB0aGlzLiRjbGFzcyB3aWxsIG5vdCBiZSB0aGUgc2FtZS4gIGdldFN0YXRpYyB2YWx1ZVxuICogZGVhbHMgd2l0aCB0aGlzIGlzc3VlLlxuICogXG4gICAgdmFyIEEgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgJHN0YXRpY3M6IHtcbiAgICAgICAgICAgIGE6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgIGdldEFCZXR0ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0U3RhdGljVmFsdWUoJ2EnKTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0QTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kY2xhc3MuYTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIEIgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgJHN1cGVyOiBBLFxuICAgICAgICAkc3RhdGljczoge1xuICAgICAgICAgICAgYjogMixcbiAgICAgICAgICAgIGM6IDNcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgXG4gICAgdmFyIGIgPSBuZXcgQigpO1xuICAgIGIuZ2V0QSgpO1xuICAgID51bmRlZmluZWRcbiAgICBiLmdldEFCZXR0ZXIoKTtcbiAgICA+MVxuXG4gKiBAcmV0dXJuIHtPYmplY3R9IHRoZSBzdGF0aWMgdmFsdWUgb2YgdGhlIGtleVxuICovXG5cbiAgICBcbi8qKlxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gZ2V0Q29tcG9zaXRpb24gdGhpcyBtZXRob2Qgd2lsbCBiZSBhZGRlZFxuICogdG8gaW5zdGFuY2VzIHRoYXQgdXNlIHRoZSB7QGxpbmsgTHVjLmRlZmluZSMkY29tcG9zaXRpb25zICRjb21wb3NpdGlvbnN9ICBjb25maWdcbiAqXG4gKiAgVGhpcyB3aWxsIHJldHVybiB0aGUgY29tcG9zaXRpb24gaW5zdGFuY2UgYmFzZWQgb2ZmIHRoZSBjb21wb3NpdGlvbiB7QGxpbmsgTHVjLkNvbXBvc2l0aW9uI25hbWUgbmFtZX1cbiAgICBcbiAgICB0aGlzLmdldENvbXBvc2l0aW9uKFwibmFtZVwiKTtcbiAgICBcbiAqXG4gKi9cblxuXG4vKipcbiAqIEBjZmcge09iamVjdH0gJHN0YXRpY3MgKG9wdGlvbmFsKSBBZGQgc3RhdGljIHByb3BlcnRpZXMgb3IgbWV0aG9kc1xuICogdG8gdGhlIGNsYXNzLiAgVGhlc2UgcHJvcGVydGllcy9tZXRob2RzIHdpbGwgbm90IGJlIGFibGUgdG8gYmVcbiAqIGRpcmVjdGx5IG1vZGlmaWVkIGJ5IHRoZSBpbnN0YW5jZSBzbyB0aGV5IGFyZSBnb29kIGZvciBkZWZpbmluZyBkZWZhdWx0XG4gKiBjb25maWdzLiAgVXNpbmcgdGhpcyBjb25maWcgYWRkcyB0aGUge0BsaW5rIEx1Yy5kZWZpbmUjZ2V0U3RhdGljVmFsdWUgZ2V0U3RhdGljVmFsdWV9XG4gKiBtZXRob2QgdG8gaW5zdGFuY2VzLlxuICpcbiAgICB2YXIgQyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICAkc3RhdGljczoge1xuICAgICAgICAgICAgbnVtYmVyOiAxXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciBjID0gbmV3IEMoKTtcbiAgICBjLm51bWJlclxuICAgID51bmRlZmluZWRcbiAgICBDLm51bWJlclxuICAgID4xXG4gICAgXG4gKlxuICogQmFkIHRoaW5ncyBjYW4gaGFwcGVuIGlmIG5vbiBwcmltaXRpdmVzIGFyZSBwbGFjZWQgb24gdGhlIFxuICogcHJvdG90eXBlIGFuZCBpbnN0YW5jZSBzaGFyaW5nIGlzIG5vdCB3YW50ZWQuICBVc2luZyBzdGF0aWNzXG4gKiBwcmV2ZW50IHN1YmNsYXNzZXMgYW5kIGluc3RhbmNlcyBmcm9tIHVua25vd2luZ2x5IG1vZGlmeWluZ1xuICogYWxsIGluc3RhbmNlcy5cbiAqIFxuICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgIGNmZzoge1xuICAgICAgICAgICAgYTogMVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB2YXIgYyA9IG5ldyBDKCk7XG4gICAgYy5jZmcuYVxuICAgID4xXG4gICAgYy5jZmcuYSA9IDVcbiAgICBuZXcgQygpLmNmZy5hXG4gICAgPjVcbiAqXG4gKi9cblxuLyoqXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBbJHN1cGVyY2xhc3NdIElmICRzdXBlciBpcyBkZWZpbmVkIGl0XG4gKiB3aWxsIGJlIHRoZSBwcm90b3R5cGUgb2YgJHN1cGVyLiAgSXQgY2FuIGJlIHVzZWQgdG8gY2FsbCBwYXJlbnQnc1xuICogbWV0aG9kXG4gKiBcbiAgICBmdW5jdGlvbiBNeUNvb2xDbGFzcygpIHt9XG4gICAgTXlDb29sQ2xhc3MucHJvdG90eXBlLmFkZE51bXMgPSBmdW5jdGlvbihhLGIpIHtcbiAgICAgICAgcmV0dXJuIGEgKyBiO1xuICAgIH1cblxuICAgIHZhciBNeU90aGVyQ29vbENsYXNzID0gTHVjLmRlZmluZSh7XG4gICAgICAgICRzdXBlcjogTXlDb29sQ2xhc3MsXG4gICAgICAgIGFkZE51bXM6IGZ1bmN0aW9uKGEsIGIsIGMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLiRzdXBlcmNsYXNzLmFkZE51bXMuY2FsbCh0aGlzLCBhLCBiKSArIGM7XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgdmFyIG0gPSBuZXcgTXlPdGhlckNvb2xDbGFzcygpO1xuICAgIG0uYWRkTnVtcygxLDIsMyk7XG4gICAgPjZcbiAqL1xuXG4vKipcbiAqIEBjZmcge09iamVjdC9Db25zdHJ1Y3Rvci9PYmplY3RbXS9Db25zdHJ1Y3RvcltdfSAkbWl4aW5zIChvcHRpb25hbCkgIE1peGlucyBhcmUgYSB3YXkgdG8gYWRkIGZ1bmN0aW9uYWxpdHlcbiAqIHRvIGEgY2xhc3MgdGhhdCBzaG91bGQgbm90IGFkZCBzdGF0ZSB0byB0aGUgaW5zdGFuY2UgdW5rbm93aW5nbHkuICBNaXhpbnMgY2FuIGJlIGVpdGhlciBvYmplY3RzIG9yIENvbnN0cnVjdG9ycy5cbiAqXG4gICAgZnVuY3Rpb24gTG9nZ2VyKCkge31cbiAgICBMb2dnZXIucHJvdG90eXBlLmxvZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhhcmd1bWVudHMpXG4gICAgfVxuXG4gICAgdmFyIEMgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgJG1peGluczogW0xvZ2dlciwge1xuICAgICAgICAgICAgd2FybjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGFyZ3VtZW50cylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfV1cbiAgICB9KTtcblxuICAgIHZhciBjID0gbmV3IEMoKTtcblxuICAgIGMubG9nKDEsMilcbiAgICA+WzEsMl1cblxuICAgIGMud2FybigzLDQpXG4gICAgPlszLDRdXG4gKlxuICovXG4vKipcbiAqIEBjZmcge0NvbnN0cnVjdG9yfSAkc3VwZXIgKG9wdGlvbmFsKSAgc3VwZXIgZm9yIHRoZSBkZWZpbmluZyBjbGFzcy4gIEJ5IEx1Yy5CYXNlXG4gKiBpcyB0aGUgZGVmYXVsdCBpZiBzdXBlciBpcyBub3QgcGFzc2VkIGluLiAgVG8gZGVmaW5lIGEgY2xhc3Mgd2l0aG91dCBhIHN1cGVyY2xhc3NcbiAqIHlvdSBjYW4gcGFzcyBpbiBmYWxzZSBvciBudWxsLlxuICpcbiAgICAgZnVuY3Rpb24gQ291bnRlcigpIHtcbiAgICAgICAgdGhpcy5jb3VudCA9IDA7XG4gICAgIH07XG5cbiAgICAgQ291bnRlci5wcm90b3R5cGUgPSB7XG4gICAgICAgIGdldENvdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvdW50O1xuICAgICAgICB9LFxuICAgICAgICBpbmNyZWFzZUNvdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuY291bnQrKztcbiAgICAgICAgfVxuICAgICB9XG5cbiAgICAgdmFyIEMgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgJHN1cGVyOkNvdW50ZXJcbiAgICB9KTtcblxuICAgIHZhciBjID0gbmV3IEMoKVxuXG4gICAgYyBpbnN0YW5jZW9mIENvdW50ZXJcbiAgICA+dHJ1ZVxuICAgIGMuaW5jcmVhc2VDb3VudCgpO1xuICAgIGMuZ2V0Q291bnQoKTtcbiAgICA+MVxuICAgIGMuY291bnRcbiAgICA+MVxuICpcbiAqIENoZWNrIG91dCBMdWMuQmFzZSB0byBzZWUgd2h5IHdlIGhhdmUgaXQgYXMgdGhlIGRlZmF1bHQuXG4gKiBcbiAgICB2YXIgQiA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICBhbUlBTHVjQmFzZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIEx1Yy5CYXNlXG4gICAgICAgIH1cbiAgICB9KVxuICAgIHZhciBiID0gbmV3IEIoKTtcbiAgICBiLmFtSUFMdWNCYXNlKCk7XG4gICAgPnRydWVcbiAqXG4gKiBcbiAqL1xuXG5cblxuLyoqXG4gKiBAY2ZnIHtPYmplY3QvT2JqZWN0W119ICRjb21wb3NpdGlvbnMgKG9wdGlvbmFsKSBjb25maWcgb2JqZWN0cyBmb3IgXG4gKiBMdWMuQ29tcG9zaXRpb24uICBDb21wb3NpdGlvbnMgYXJlIGEgZ3JlYXQgd2F5IHRvIGFkZCBiZWhhdmlvciB0byBhIGNsYXNzXG4gKiB3aXRob3V0IGV4dGVuZGluZyBpdC4gIEEge0BsaW5rIEx1Yy5kZWZpbmUjJG1peGlucyBtaXhpbn0gY2FuIG9mZmVyIHNpbWlsYXIgZnVuY3Rpb25hbGl0eSBidXQgc2hvdWxkXG4gKiBub3QgYmUgYWRkaW5nIGFuIHVubmVlZGVkIHN0YXRlLiAgQSBDb25zdHJ1Y3RvciBhbmQgYSBuYW1lIGFyZSBuZWVkZWQgZm9yIHRoZSBjb25maWcgb2JqZWN0LlxuICogIFVzaW5nIHRoaXMgY29uZmlnIGFkZHMgdGhlIHtAbGluayBMdWMuZGVmaW5lI2dldENvbXBvc2l0aW9uIGdldENvbXBvc2l0aW9ufVxuICogbWV0aG9kIHRvIGluc3RhbmNlcy5cbiAqIDxicj5cbiAqIFRoZSBtZXRob2RzIHByb3BlcnR5IGlzIG9wdGlvbmFsIGhlcmUgYnV0IGl0IGlzIHNheWluZyB0YWtlIGFsbCBvZiBcbiAqIEx1Yy5FdmVudEVtaXR0ZXIncyBpbnN0YW5jZSBtZXRob2RzIGFuZCBtYWtlIHRoZW0gaW5zdGFuY2UgbWV0aG9kcyBmb3IgQy5cbiAqIFlvdSBjYW4gY2hlY2sgb3V0IGFsbCBvZiB0aGUgY29uZmlnIG9wdGlvbnMgYnkgbG9va2luZyBhdCBMdWMuQ29tcG9zaXRpb24uXG4gKiBcbiAgICAgICAgdmFyIEMgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgICAgICRjb21wb3NpdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBDb25zdHJ1Y3RvcjogTHVjLkV2ZW50RW1pdHRlcixcbiAgICAgICAgICAgICAgICBuYW1lOiAnZW1pdHRlcicsXG4gICAgICAgICAgICAgICAgbWV0aG9kczogJ2FsbE1ldGhvZHMnXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBjID0gbmV3IEMoKTtcblxuICAgICAgICBjLm9uKCdoZXknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGFyZ3VtZW50cyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGMuZW1pdCgnaGV5JywgMSwyLDMsICdhJyk7XG4gICAgICAgID5bMSwgMiwgMywgXCJhXCJdXG4gICAgICAgIGMgaW5zdGFuY2VvZiBMdWMuRXZlbnRFbWl0dGVyXG4gICAgICAgID5mYWxzZVxuICAgICAgICBjLl9ldmVudHNcbiAgICAgICAgPnVuZGVmaW5lZFxuICpcbiAqIEx1Yy5FdmVudEVtaXR0ZXIgaXMgcHJlZmVycmVkIGFzIGEgY29tcG9zaXRpb24gb3ZlciBhIG1peGluIGJlY2F1c2VcbiAqIGl0IGFkZHMgYSBzdGF0ZSBcIl9ldmVudHNcIiB0byB0aGUgdGhpcyBpbnN0YW5jZSB3aGVuIG9uIGlzIGNhbGxlZC4gIEl0XG4gKiBhbHNvIHNob3VsZG4ndCBoYXZlIHRvIGtub3cgdGhhdCBpdCBtYXkgYmUgaW5zdGFudGlhdGVkIGFsb25lIG9yIG1peGVkIGludG8gY2xhc3Nlc1xuICogc28gdGhlIGluaXRpbmcgb2Ygc3RhdGUgaXMgbm90IGRvbmUgaW4gdGhlIGNvbnN0cnVjdG9yIGxpa2UgaXQgcHJvYmFibHkgc2hvdWxkLlxuICogSXQgaXMgbm90IHRlcnJpYmxlIHByYWN0aWNlIGJ5IGFueSBtZWFucyBidXQgaXQgaXMgbm90IGdvb2QgdG8gaGF2ZSBhIHN0YW5kYWxvbmUgY2xhc3NcbiAqIHRoYXQga25vd3MgdGhhdCBpdCBtYXkgYmUgbWl4aW4uICBFdmVuIHdvcnNlIHRoYW4gdGhhdCB3b3VsZCBiZSBhIG1peGluIHRoYXQgbmVlZHNcbiAqIHRvIGJlIGluaXRlZCBieSB0aGUgZGVmaW5pbmcgY2xhc3MuICBFbmNhcHN1bGF0aW5nIGxvZ2ljIGluIGEgY2xhc3NcbiAqIGFuZCB1c2luZyBpdCBhbnl3aGVyZSBzZWFtbGVzc2x5IGlzIHdoZXJlIGNvbXBvc2l0aW9ucyBzaGluZS4gTHVjIGNvbWVzIHdpdGggdHdvIGNvbW1vbiBcbiAqIHtAbGluayBMdWMjY29tcG9zaXRpb25FbnVtcyBlbnVtc30gdGhhdCB3ZSBleHBlY3Qgd2lsbCBiZSB1c2VkIG9mdGVuLlxuICogXG4gKiA8YnI+XG4gKiBIZXJlIGlzIGFuIGV4YW1wbGUgb2YgYSBzaW1wbGUgY29tcG9zaXRpb24gc2VlIGhvdyB0aGUgZnVuY3Rpb25hbGl0eSBcbiAqIGlzIGFkZGVkIGJ1dCB3ZSBhcmUgbm90IGluaGVyaXRpbmcgYW5kIHRoaXMuY291bnQgaXNcbiAqIHVuZGVmaW5lZC5cbiAqXG4gICAgICAgICBmdW5jdGlvbiBDb3VudGVyKCkge1xuICAgICAgICAgICAgdGhpcy5jb3VudCA9IDA7XG4gICAgICAgICB9O1xuXG4gICAgICAgICBDb3VudGVyLnByb3RvdHlwZSA9IHtcbiAgICAgICAgICAgIGdldENvdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb3VudDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpbmNyZWFzZUNvdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvdW50Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgICB9XG5cbiAgICAgICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgICAgICAgICAgJGNvbXBvc2l0aW9uczoge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY291bnRlcicsXG4gICAgICAgICAgICAgICAgICAgIENvbnN0cnVjdG9yOiBDb3VudGVyLFxuICAgICAgICAgICAgICAgICAgICBtZXRob2RzOiAnYWxsTWV0aG9kcydcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBjID0gbmV3IEMoKVxuXG4gICAgICAgIGMuaW5jcmVhc2VDb3VudCgpO1xuICAgICAgICBjLmluY3JlYXNlQ291bnQoKTtcbiAgICAgICAgYy5pbmNyZWFzZUNvdW50KCk7XG4gICAgICAgIGMuZ2V0Q291bnQoKTtcbiAgICAgICAgPjNcbiAgICAgICAgYy5jb3VudFxuICAgICAgICA+dW5kZWZpbmVkXG4gKlxuICogTHVjIGNvbWVzIHdpdGggdHdvIGRlZmF1bHQgY29tcG9zaXRpb24gb2JqZWN0cyBMdWMuY29tcG9zaXRpb25FbnVtcy5QbHVnaW5NYW5hZ2VyXG4gKiBhbmQgTHVjLmNvbXBvc2l0aW9uRW51bXMuRXZlbnRFbWl0dGVyLlxuICogXG4gKiBIZXJlIGlzIHRoZSBwbHVnaW4gbWFuYWdlciBlbnVtLCBrZWVwIGluIG1pbmQgdGhhdCB0aGlzXG4gKiBmdW5jdGlvbmFsaXR5IGNhbiBiZSBhZGRlZCB0byBhbnkgY2xhc3MsIG5vdCBqdXN0IG9uZXMgZGVmaW5lZCB3aXRoIFxuICogTHVjLmRlZmluZS4gIENoZWNrIG91dCBMdWMuUGx1Z2luTWFuYWdlciB0byBzZWUgYWxsIG9mIHRoZSBwdWJsaWMgXG4gKiBtZXRob2RzIHRoYXQgZ2V0cyBhZGRlZCB0byB0aGUgZGVmaW5lZCBpbnN0YW5jZS5cbiBcbiAqIEEgcGx1Z2luIGZvbGxvd3MgdGhlIGZvbGxvd2luZyBsaWZlLWN5Y2xlOiA8YnI+XG4gICAgXG4gKnBsdWdpbiBpcyBhZGRlZCB0byB0aGUgaW5zdGFuY2UgLT4gcGx1Z2luIGlzIGNyZWF0ZWQgLT4gcGx1Z2luIGluaXQgaXMgY2FsbGVkIHdpdGggaW5zdGFuY2UgLT4gaWYgbmVlZGVkIGRlc3Ryb3kgY2FsbGVkIGJ5IGluc3RhbmNlIC0+IGRlc3Ryb3kgY2FsbGVkIG9uIHBsdWdpbiA8YnI+XG4gKkhlcmUgaXMgdGhlIG1vc3QgYmFzaWMgZXhhbXBsZSB1c2luZyB0aGUge0BsaW5rIEx1Yy5QbHVnaW4gZGVmYXVsdH0gcGx1Z2luLlxuICAgXG4gICAgdmFyIEMgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgJGNvbXBvc2l0aW9uczogTHVjLmNvbXBvc2l0aW9uRW51bXMuUGx1Z2luTWFuYWdlclxuICAgIH0pO1xuXG4gICAgdmFyIGMgPSBuZXcgQyh7XG4gICAgICAgIHBsdWdpbnM6IFt7XG4gICAgICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpbSBnZXR0aW5nIGluaXR0ZWQnKVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgbXlDb29sTmFtZTogJ2Nvb2wnXG4gICAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICB9KTtcblxuICAgID5pbSBnZXR0aW5nIGluaXR0ZWRcblxuICAgIGMuZ2V0UGx1Z2luKHtteUNvb2xOYW1lOiAnY29vJ30pIGluc3RhbmNlb2YgTHVjLlBsdWdpblxuICAgID4gdHJ1ZVxuXG4qICBQbHVnaW5zIGNhbiBiZSBvZiBhbnkgY2xhc3MgYW5kIGNhbiBiZSBhZGRlZCB3aXRoIHtAbGluayBMdWMuUGx1Z2luTWFuYWdlciNhZGRQbHVnaW4gYWRkUGx1Z2lufVxuXG4gICAgZnVuY3Rpb24gTXlQbHVnaW4oKXt9XG5cbiAgICB2YXIgQyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICAkY29tcG9zaXRpb25zOiBMdWMuY29tcG9zaXRpb25FbnVtcy5QbHVnaW5NYW5hZ2VyXG4gICAgfSk7XG5cbiAgICB2YXIgYyA9IG5ldyBDKCk7XG5cbiAgICBjLmFkZFBsdWdpbih7Q29uc3RydWN0b3I6IE15UGx1Z2lufSk7XG4gICAgLy9nZXRQbHVnaW4gdGFrZXMgYSBDb25zdHJ1Y3RvciBvciBtYXRjaCBvYmplY3RcbiAgICBjLmdldFBsdWdpbihNeVBsdWdpbikgaW5zdGFuY2VvZiBNeVBsdWdpblxuICAgID50cnVlXG4gICAgYy5nZXRQbHVnaW4oTHVjLlBsdWdpbilcbiAgICA+ZmFsc2VcblxuKiBQbHVnaW5zIGNhbiBhbHNvIGJlIGRlc3Ryb3llZCBpbmRpdmlkdWFsbHkgb3IgYWxsIG9mIHRoZW0gYXQgb25jZVxuICAgIFxuICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgICRjb21wb3NpdGlvbnM6IEx1Yy5jb21wb3NpdGlvbkVudW1zLlBsdWdpbk1hbmFnZXJcbiAgICB9KTtcblxuICAgIHZhciBjID0gbmV3IEMoe1xuICAgICAgICBwbHVnaW5zOiBbe1xuICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2ltIGdldHRpbmcgaW5pdHRlZCAnICsgdGhpcy5uYW1lKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdkZXN0cm95ZWQgOiAnICsgdGhpcy5uYW1lKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG5hbWU6ICcxJ1xuICAgICAgICB9LHtcbiAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpbSBnZXR0aW5nIGluaXR0ZWQgJyArIHRoaXMubmFtZSlcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkZXN0cm95OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZGVzdHJveWVkIDogJyArIHRoaXMubmFtZSlcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBuYW1lOiAnMidcbiAgICAgICAgfV1cbiAgICB9KTtcblxuICAgID5pbSBnZXR0aW5nIGluaXR0ZWQgMVxuICAgID5pbSBnZXR0aW5nIGluaXR0ZWQgMlxuICAgIFxuXG4gICAgYy5kZXN0cm95UGx1Z2luKHtuYW1lOiAnMSd9KTtcbiAgICA+ZGVzdHJveWVkIDogMVxuICAgIC8vYSBwbHVnaW4gaXMgcmV0dXJuZWQgaWYgaXQgaXMgZm91bmQgYW5kIGRlc3Ryb3llZFxuICAgID5QbHVnaW4ge2luaXQ6IGZ1bmN0aW9uLCBkZXN0cm95OiBmdW5jdGlvbiwgbmFtZTogXCIxXCIsIG93bmVyOiBPYmplY3QsIGluaXQ6IGZ1bmN0aW9u4oCmfVxuXG4gICAgYy5kZXN0cm95UGx1Z2luKHtuYW1lOiAnMSd9KTtcbiAgICAvL2ZhbHNlIGlzIHJldHVybmVkIGlmIGl0IGlzIG5vdCBmb3VuZFxuICAgID5mYWxzZVxuXG4gICAgYy5kZXN0cm95QWxsUGx1Z2lucygpO1xuICAgID5kZXN0cm95ZWQgOiAyXG4gKlxuICogWW91IGNhbiBzZWUgdGhhdCBpdCBjYW4gYWRkIHBsdWdpbiBsaWtlIGJlaGF2aW9yIHRvIGFueSBkZWZpbmluZ1xuICogY2xhc3Mgd2l0aCBMdWMuUGx1Z2luTWFuYWdlciB3aGljaCBpcyBsZXNzIHRoYW4gNzUgU0xPQy5cbiAqLyIsInZhciBhRWFjaCA9IHJlcXVpcmUoJy4uL2FycmF5JykuZWFjaCxcbiAgICBvYmogPSByZXF1aXJlKCcuLi9vYmplY3QnKSxcbiAgICBlbXB0eUZuID0gcmVxdWlyZSgnLi4vZnVuY3Rpb24nKS5lbXB0eUZuLFxuICAgIGFwcGx5ID0gb2JqLmFwcGx5O1xuXG4vKipcbiAqIEBjbGFzcyBMdWMuUGx1Z2luXG4gKiBTaW1wbGUgY2xhc3MgdGhhdCBpcyB0aGUgZGVmYXVsdCBwbHVnaW4gdHlwZSBmb3IgTHVjLlBsdWdpbk1hbmFnZXJcbiAqL1xuZnVuY3Rpb24gUGx1Z2luKGNvbmZpZykge1xuICAgIGFwcGx5KHRoaXMsIGNvbmZpZyk7XG59XG5cblBsdWdpbi5wcm90b3R5cGUgPSB7XG4gICAgLyoqXG4gICAgICogQG1ldGhvZFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvd25lciB0aGUgb3duZXIgaW5zdGFuY2VcbiAgICAgKiBTaW1wbGUgaG9vayB0byBpbml0aWFsaXplIHRoZSBwbHVnaW5cbiAgICAgKiBEZWZhdWx0cyB0byBMdWMuZW1wdHlGbi5cbiAgICAgKi9cbiAgICBpbml0OiBlbXB0eUZuLFxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgXG4gICAgICogRGVmYXVsdHMgdG8gTHVjLmVtcHR5Rm4uXG4gICAgICogQ2FsbGVkIHdoZW4gdGhlIHBsdWdpbiBpcyBiZWluZyB7QGxpbmsgTHVjLlBsdWdpbk1hbmFnZXIjZGVzdHJveVBsdWdpbiBkZXN0cm95ZWR9LlxuICAgICAqL1xuICAgIGRlc3Ryb3k6IGVtcHR5Rm5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUGx1Z2luO1xuIiwidmFyIFBsdWdpbiA9IHJlcXVpcmUoJy4vcGx1Z2luJyksXG4gICAgaXMgPSByZXF1aXJlKCcuLi9pcycpLFxuICAgIG9iaiA9IHJlcXVpcmUoJy4uL29iamVjdCcpLFxuICAgIGFyciA9IHJlcXVpcmUoJy4uL2FycmF5JyksXG4gICAgYUVhY2ggPSBhcnIuZWFjaCxcbiAgICBtaXggPSBvYmoubWl4LFxuICAgIGFwcGx5ID0gb2JqLmFwcGx5O1xuXG5mdW5jdGlvbiBQbHVnaW5NYW5hZ2VyKGNvbmZpZykge1xuICAgIHRoaXMuX2luaXQoY29uZmlnKTtcbn1cblxuLyoqXG4gKiBAcHJvdGVjdGVkXG4gKiBAY2xhc3MgTHVjLlBsdWdpbk1hbmFnZXJcbiAqIFRoaXMgY2xhc3MgaXMgdXNlZCBieSBMdWMuY29tcG9zaXRpb25FbnVtcyNQbHVnaW5NYW5hZ2VyIHRvIGFkZCBpdHMgZnVuY3Rpb25hbGl0eSBcbiAqIHRvIGFueSBjbGFzcy4gICBCeSB7QGxpbmsgTHVjLmNvbXBvc2l0aW9uRW51bXMjUGx1Z2luTWFuYWdlciBkZWZhdWx0fSBpdCBhZGRzXG4gKiBhbGwgb2YgdGhlc2UgcHVibGljIG1ldGhvZHMgdG8gdGhlIGluc3RhbmNlLlRoaXMgY2xhc3MgaXMgZGVzaWduZWQgdG8gd29yayBhcyBhIGNvbXBvc2l0aW9uLCBcbiAqIGl0IGlzIGV4cG9zZWQgYXMgbm90IHByaXZhdGUgc28gaXQgY2FuIGJlIGV4dGVuZGVkIGlmIG5lZWRlZC4gICBDaGVjayBcInByb3RlY3RlZFwiIHdoaWNoXG4gKiBpcyBhIHBhcnQgb2YgdGhlIFNob3cgdiBkcm9wZG93biBvbiB0aGUgcmlnaHQgdG8gc2VlIHRoZSBwcm90ZWN0ZWQgbWV0aG9kcy5cbiAqXG4gICAgZnVuY3Rpb24gTXlQbHVnaW4oKSB7XG4gICAgICAgIHRoaXMubXlDb29sTmFtZSA9ICdjb28nO1xuXG4gICAgICAgIHRoaXMuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2ltIGdldHRpbmcgaW5pdHRlZCcpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ015UGx1Z2luIGluc3RhbmNlIGJlaW5nIGRlc3Ryb3llZCcpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgQyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICAkY29tcG9zaXRpb25zOiBMdWMuY29tcG9zaXRpb25FbnVtcy5QbHVnaW5NYW5hZ2VyXG4gICAgfSk7XG5cbiAgICB2YXIgYyA9IG5ldyBDKHtcbiAgICAgICAgcGx1Z2luczogW3tcbiAgICAgICAgICAgICAgICBDb25zdHJ1Y3RvcjogTXlQbHVnaW4sXG4gICAgICAgICAgICAgICAgbXlDb29sTmFtZTogJ2NvbydcbiAgICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgIH0pO1xuXG4gICAgPmltIGdldHRpbmcgaW5pdHRlZFxuXG4gICAgdmFyIHBsdWdJbnN0YW5jZSA9IGMuYWRkUGx1Z2luKHtcbiAgICAgICAgZGVzdHJveTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnSW0gZ2V0dGluZyBkZXN0cm95ZWQnKVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBjLmdldFBsdWdpbihMdWMuUGx1Z2luKVxuICAgID4gUGx1Z2luIHtkZXN0cm95OiBmdW5jdGlvbiwgb3duZXI6IE15Q2xhc3MsIGluaXQ6IGZ1bmN0aW9uLCBkZXN0cm95OiBmdW5jdGlvbn1cblxuICAgIGMuZ2V0UGx1Z2luKE15UGx1Z2luKVxuICAgID4gTXlQbHVnaW4ge215Q29vbE5hbWU6IFwiY29vXCIsIGluaXQ6IGZ1bmN0aW9uLCBkZXN0cm95OiBmdW5jdGlvbn1cblxuICAgIGMuZGVzdHJveUFsbFBsdWdpbnMoKVxuXG4gICAgPk15UGx1Z2luIGluc3RhbmNlIGJlaW5nIGRlc3Ryb3llZFxuICAgID5JbSBnZXR0aW5nIGRlc3Ryb3llZFxuXG4gICAgYy5nZXRQbHVnaW4oTXlQbHVnaW4pXG4gICAgPmZhbHNlXG5cbiAqL1xuUGx1Z2luTWFuYWdlci5wcm90b3R5cGUgPSB7XG4gICAvKipcbiAgICAqIEBjZmcge0NvbnN0cnVjdG9yfSBkZWZhdWx0UGx1Z2luXG4gICAgKi9cbiAgICBkZWZhdWx0UGx1Z2luOiBQbHVnaW4sXG5cbiAgICAvKipcbiAgICAgKiBAcHJvdGVjdGVkXG4gICAgICovXG4gICAgX2luaXQ6IGZ1bmN0aW9uKGluc3RhbmNlVmFsdWVzKSB7XG4gICAgICAgIGFwcGx5KHRoaXMsIGluc3RhbmNlVmFsdWVzKTtcbiAgICAgICAgdGhpcy5wbHVnaW5zID0gW107XG4gICAgICAgIHRoaXMuX2NyZWF0ZVBsdWdpbnMoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHByb3RlY3RlZFxuICAgICAqL1xuICAgIF9jcmVhdGVQbHVnaW5zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgYUVhY2godGhpcy5fZ2V0UGx1Z2luQ29uZmlnRnJvbUluc3RhbmNlKCksIGZ1bmN0aW9uKHBsdWdpbkNvbmZpZykge1xuICAgICAgICAgICAgdGhpcy5hZGRQbHVnaW4ocGx1Z2luQ29uZmlnKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgKi9cbiAgICBfZ2V0UGx1Z2luQ29uZmlnRnJvbUluc3RhbmNlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGNvbmZpZyA9IHRoaXMuaW5zdGFuY2VBcmdzWzBdIHx8IHt9O1xuICAgICAgICByZXR1cm4gY29uZmlnLnBsdWdpbnM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZCBhIHBsdWdpbiB0byB0aGUgaW5zdGFuY2UgYW5kIGluaXQgdGhlIFxuICAgICAqIHBsdWdpbi5cbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9IHBsdWdpbkNvbmZpZ1xuICAgICAqIEByZXR1cm4ge09iamVjdH0gdGhlIGNyZWF0ZWQgcGx1Z2luIGluc3RhbmNlXG4gICAgICovXG4gICAgYWRkUGx1Z2luOiBmdW5jdGlvbihwbHVnaW5Db25maWcpIHtcbiAgICAgICAgdmFyIHBsdWdpbkluc3RhbmNlID0gdGhpcy5fY3JlYXRlUGx1Z2luKHBsdWdpbkNvbmZpZyk7XG5cbiAgICAgICAgdGhpcy5faW5pdFBsdWdpbihwbHVnaW5JbnN0YW5jZSk7XG5cbiAgICAgICAgdGhpcy5wbHVnaW5zLnB1c2gocGx1Z2luSW5zdGFuY2UpO1xuXG4gICAgICAgIHJldHVybiBwbHVnaW5JbnN0YW5jZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHByb3RlY3RlZFxuICAgICAqL1xuICAgIF9jcmVhdGVQbHVnaW46IGZ1bmN0aW9uKGNvbmZpZykge1xuICAgICAgICBjb25maWcub3duZXIgPSB0aGlzLmluc3RhbmNlO1xuXG4gICAgICAgIGlmIChjb25maWcuQ29uc3RydWN0b3IpIHtcbiAgICAgICAgICAgIC8vY2FsbCB0aGUgY29uZmlnZWQgQ29uc3RydWN0b3Igd2l0aCB0aGUgXG4gICAgICAgICAgICAvL3Bhc3NlZCBpbiBjb25maWcgYnV0IHRha2Ugb2ZmIHRoZSBDb25zdHJ1Y3RvclxuICAgICAgICAgICAgLy9jb25maWcuXG4gICAgICAgICAgICAgXG4gICAgICAgICAgICAvL1RoZSBwbHVnaW4gQ29uc3RydWN0b3IgXG4gICAgICAgICAgICAvL3Nob3VsZCBub3QgbmVlZCB0byBrbm93IGFib3V0IGl0c2VsZlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBjb25maWcuQ29uc3RydWN0b3IoYXBwbHkoY29uZmlnLCB7XG4gICAgICAgICAgICAgICAgQ29uc3RydWN0b3I6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzLmRlZmF1bHRQbHVnaW4oY29uZmlnKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHByb3RlY3RlZFxuICAgICAqL1xuICAgIF9pbml0UGx1Z2luOiBmdW5jdGlvbihwbHVnaW4pIHtcbiAgICAgICAgaWYgKGlzLmlzRnVuY3Rpb24ocGx1Z2luLmluaXQpKSB7XG4gICAgICAgICAgICBwbHVnaW4uaW5pdCh0aGlzLmluc3RhbmNlKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDYWxsIGRlc3Ryb3kgb24gYWxsIG9mIHRoZSBwbHVnaW5zXG4gICAgICogYW5kIHJlbW92ZSB0aGVtLlxuICAgICAqL1xuICAgIGRlc3Ryb3lBbGxQbHVnaW5zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5wbHVnaW5zLmZvckVhY2goZnVuY3Rpb24ocGx1Z2luKSB7XG4gICAgICAgICAgICB0aGlzLl9kZXN0cm95UGx1Z2luKHBsdWdpbik7XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIHRoaXMucGx1Z2lucyA9IFtdO1xuICAgIH0sXG5cbiAgICBfZGVzdHJveVBsdWdpbjogZnVuY3Rpb24ocGx1Z2luKSB7XG4gICAgICAgIGlmIChpcy5pc0Z1bmN0aW9uKHBsdWdpbi5kZXN0cm95KSkge1xuICAgICAgICAgICAgcGx1Z2luLmRlc3Ryb3kodGhpcy5pbnN0YW5jZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIHRoZSBwbHVnaW4gYW5kIGlmIGZvdW5kIGRlc3Ryb3kgaXQuXG4gICAgICogQHBhcmFtICB7T2JqZWN0L0NvbnN0cnVjdG9yfSBvYmplY3QgdG8gdXNlIHRvIG1hdGNoIFxuICAgICAqIHRoZSBwbHVnaW4gdG8gcmVtb3ZlLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gdGhlIGRlc3Ryb3llZCBwbHVnaW4uXG4gICAgICovXG4gICAgZGVzdHJveVBsdWdpbjogZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgIHZhciBwbHVnaW4gPSB0aGlzLmdldFBsdWdpbihvYmopO1xuXG4gICAgICAgIGlmKHBsdWdpbikge1xuICAgICAgICAgICAgdGhpcy5fZGVzdHJveVBsdWdpbihwbHVnaW4pO1xuICAgICAgICAgICAgYXJyLnJlbW92ZUZpcnN0KHRoaXMucGx1Z2lucywgcGx1Z2luLCB7dHlwZTogJ3N0cmljdCd9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwbHVnaW47XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBhIHBsdWdpbiBpbnN0YW5jZS4gIEEgQ29uc3RydWN0b3Igb3IgYW4gb2JqZWN0IGNhbiBiZSB1c2VkXG4gICAgICogdG8gZmluZCBhIHBsdWdpbi5cbiAgICAgKlxuICAgICAgICAgIGMuYWRkUGx1Z2luKHthOjF9KVxuICAgICAgICAgIGMuZ2V0UGx1Z2luKHthOjF9KVxuICAgICAgICAgID5MdWMuUGx1Z2luKHthOjF9KVxuXG4gICAgICogQHBhcmFtICB7T2JqZWN0fSBvYmogXG4gICAgICogQHJldHVybiB7T2JqZWN0fSB0aGUgcGx1Z2luIGluc3RhbmNlIGlmIGZvdW5kLlxuICAgICAqL1xuICAgIGdldFBsdWdpbjogZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgIGlmIChpcy5pc0Z1bmN0aW9uKG9iaikpIHtcbiAgICAgICAgICAgIHJldHVybiBhcnIuZmluZEZpcnN0SW5zdGFuY2VPZih0aGlzLnBsdWdpbnMsIG9iaik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFyci5maW5kRmlyc3QodGhpcy5wbHVnaW5zLCBvYmosIHt0eXBlOiAnbG9vc2UnfSk7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQbHVnaW5NYW5hZ2VyOyIsInZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCcuLi9ldmVudHMvZXZlbnRFbWl0dGVyJyksXG4gICAgUGx1Z2luTWFuYWdlciA9IHJlcXVpcmUoJy4vcGx1Z2luTWFuYWdlcicpO1xuXG4vKipcbiAqIEBjbGFzcyBMdWMuY29tcG9zaXRpb25FbnVtc1xuICogQ29tcG9zaXRpb24gZW51bXMgYXJlIGp1c3QgY29tbW9uIGNvbmZpZyBvYmplY3RzIGZvciBMdWMuQ29tcG9zaXRpb24uXG4gKiBIZXJlIGlzIGFuIGV4YW1wbGUgb2YgYSBjb21wb3NpdGlvbiB0aGF0IHVzZXMgRXZlbnRFbWl0dGVyIGJ1dCBvbmx5XG4gKiBwdXRzIHRoZSBlbWl0IG1ldGhvZCBvbiB0aGUgcHJvdG90eXBlLlxuICpcbiAgICB2YXIgQyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICAkY29tcG9zaXRpb25zOiB7XG4gICAgICAgICAgICBkZWZhdWx0czogTHVjLmNvbXBvc2l0aW9uRW51bXMuRXZlbnRFbWl0dGVyLFxuICAgICAgICAgICAgbWV0aG9kczogWydlbWl0J11cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIGMgPSBuZXcgQygpO1xuXG4gICAgdHlwZW9mIGMuZW1pdFxuICAgID5cImZ1bmN0aW9uXCJcbiAgICB0eXBlb2YgYy5vblxuICAgIFwidW5kZWZpbmVkXCJcbiAqIFxuICovXG5cbi8qKlxuICogQHByb3BlcnR5IHtPYmplY3R9IEV2ZW50RW1pdHRlclxuICovXG5tb2R1bGUuZXhwb3J0cy5FdmVudEVtaXR0ZXIgPSB7XG4gICAgQ29uc3RydWN0b3I6IEV2ZW50RW1pdHRlcixcbiAgICBuYW1lOiAnZW1pdHRlcicsXG4gICAgbWV0aG9kczogJ2FsbE1ldGhvZHMnXG59O1xuXG5cbi8qKlxuICogQHByb3BlcnR5IHtPYmplY3R9IFBsdWdpbk1hbmFnZXJcbiAqL1xubW9kdWxlLmV4cG9ydHMuUGx1Z2luTWFuYWdlciA9IHtcbiAgICBuYW1lOiAncGx1Z2lucycsXG4gICAgaW5pdEFmdGVyOiB0cnVlLFxuICAgIENvbnN0cnVjdG9yOiBQbHVnaW5NYW5hZ2VyLFxuICAgIGNyZWF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBuZXcgdGhpcy5Db25zdHJ1Y3Rvcih7XG4gICAgICAgICAgICBpbnN0YW5jZTogdGhpcy5pbnN0YW5jZSxcbiAgICAgICAgICAgIGluc3RhbmNlQXJnczogdGhpcy5pbnN0YW5jZUFyZ3NcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBpZ25vcmVNZXRob2RzOiAnZGVmYXVsdFBsdWdpbicsXG4gICAgbWV0aG9kczogJ3B1YmxpY01ldGhvZHMnXG59OyIsIi8vIENvcHlyaWdodCAyMDA5LTIwMTIgYnkgY29udHJpYnV0b3JzLCBNSVQgTGljZW5zZVxuLy8gdmltOiB0cz00IHN0cz00IHN3PTQgZXhwYW5kdGFiXG5cbi8vIE1vZHVsZSBzeXN0ZW1zIG1hZ2ljIGRhbmNlXG4oZnVuY3Rpb24gKGRlZmluaXRpb24pIHtcbiAgICAvLyBSZXF1aXJlSlNcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgZGVmaW5lKGRlZmluaXRpb24pO1xuICAgIC8vIFlVSTNcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBZVUkgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIFlVSS5hZGQoXCJlczVcIiwgZGVmaW5pdGlvbik7XG4gICAgLy8gQ29tbW9uSlMgYW5kIDxzY3JpcHQ+XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZGVmaW5pdGlvbigpO1xuICAgIH1cbn0pKGZ1bmN0aW9uICgpIHtcblxuLyoqXG4gKiBCcmluZ3MgYW4gZW52aXJvbm1lbnQgYXMgY2xvc2UgdG8gRUNNQVNjcmlwdCA1IGNvbXBsaWFuY2VcbiAqIGFzIGlzIHBvc3NpYmxlIHdpdGggdGhlIGZhY2lsaXRpZXMgb2YgZXJzdHdoaWxlIGVuZ2luZXMuXG4gKlxuICogQW5ub3RhdGVkIEVTNTogaHR0cDovL2VzNS5naXRodWIuY29tLyAoc3BlY2lmaWMgbGlua3MgYmVsb3cpXG4gKiBFUzUgU3BlYzogaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL3B1YmxpY2F0aW9ucy9maWxlcy9FQ01BLVNUL0VjbWEtMjYyLnBkZlxuICogUmVxdWlyZWQgcmVhZGluZzogaHR0cDovL2phdmFzY3JpcHR3ZWJsb2cud29yZHByZXNzLmNvbS8yMDExLzEyLzA1L2V4dGVuZGluZy1qYXZhc2NyaXB0LW5hdGl2ZXMvXG4gKi9cblxuLy9cbi8vIEZ1bmN0aW9uXG4vLyA9PT09PT09PVxuLy9cblxuLy8gRVMtNSAxNS4zLjQuNVxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuMy40LjVcblxuZnVuY3Rpb24gRW1wdHkoKSB7fVxuXG5pZiAoIUZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kKSB7XG4gICAgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiBiaW5kKHRoYXQpIHsgLy8gLmxlbmd0aCBpcyAxXG4gICAgICAgIC8vIDEuIExldCBUYXJnZXQgYmUgdGhlIHRoaXMgdmFsdWUuXG4gICAgICAgIHZhciB0YXJnZXQgPSB0aGlzO1xuICAgICAgICAvLyAyLiBJZiBJc0NhbGxhYmxlKFRhcmdldCkgaXMgZmFsc2UsIHRocm93IGEgVHlwZUVycm9yIGV4Y2VwdGlvbi5cbiAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXQgIT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQgY2FsbGVkIG9uIGluY29tcGF0aWJsZSBcIiArIHRhcmdldCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gMy4gTGV0IEEgYmUgYSBuZXcgKHBvc3NpYmx5IGVtcHR5KSBpbnRlcm5hbCBsaXN0IG9mIGFsbCBvZiB0aGVcbiAgICAgICAgLy8gICBhcmd1bWVudCB2YWx1ZXMgcHJvdmlkZWQgYWZ0ZXIgdGhpc0FyZyAoYXJnMSwgYXJnMiBldGMpLCBpbiBvcmRlci5cbiAgICAgICAgLy8gWFhYIHNsaWNlZEFyZ3Mgd2lsbCBzdGFuZCBpbiBmb3IgXCJBXCIgaWYgdXNlZFxuICAgICAgICB2YXIgYXJncyA9IF9BcnJheV9zbGljZV8uY2FsbChhcmd1bWVudHMsIDEpOyAvLyBmb3Igbm9ybWFsIGNhbGxcbiAgICAgICAgLy8gNC4gTGV0IEYgYmUgYSBuZXcgbmF0aXZlIEVDTUFTY3JpcHQgb2JqZWN0LlxuICAgICAgICAvLyAxMS4gU2V0IHRoZSBbW1Byb3RvdHlwZV1dIGludGVybmFsIHByb3BlcnR5IG9mIEYgdG8gdGhlIHN0YW5kYXJkXG4gICAgICAgIC8vICAgYnVpbHQtaW4gRnVuY3Rpb24gcHJvdG90eXBlIG9iamVjdCBhcyBzcGVjaWZpZWQgaW4gMTUuMy4zLjEuXG4gICAgICAgIC8vIDEyLiBTZXQgdGhlIFtbQ2FsbF1dIGludGVybmFsIHByb3BlcnR5IG9mIEYgYXMgZGVzY3JpYmVkIGluXG4gICAgICAgIC8vICAgMTUuMy40LjUuMS5cbiAgICAgICAgLy8gMTMuIFNldCB0aGUgW1tDb25zdHJ1Y3RdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBGIGFzIGRlc2NyaWJlZCBpblxuICAgICAgICAvLyAgIDE1LjMuNC41LjIuXG4gICAgICAgIC8vIDE0LiBTZXQgdGhlIFtbSGFzSW5zdGFuY2VdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBGIGFzIGRlc2NyaWJlZCBpblxuICAgICAgICAvLyAgIDE1LjMuNC41LjMuXG4gICAgICAgIHZhciBib3VuZCA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBib3VuZCkge1xuICAgICAgICAgICAgICAgIC8vIDE1LjMuNC41LjIgW1tDb25zdHJ1Y3RdXVxuICAgICAgICAgICAgICAgIC8vIFdoZW4gdGhlIFtbQ29uc3RydWN0XV0gaW50ZXJuYWwgbWV0aG9kIG9mIGEgZnVuY3Rpb24gb2JqZWN0LFxuICAgICAgICAgICAgICAgIC8vIEYgdGhhdCB3YXMgY3JlYXRlZCB1c2luZyB0aGUgYmluZCBmdW5jdGlvbiBpcyBjYWxsZWQgd2l0aCBhXG4gICAgICAgICAgICAgICAgLy8gbGlzdCBvZiBhcmd1bWVudHMgRXh0cmFBcmdzLCB0aGUgZm9sbG93aW5nIHN0ZXBzIGFyZSB0YWtlbjpcbiAgICAgICAgICAgICAgICAvLyAxLiBMZXQgdGFyZ2V0IGJlIHRoZSB2YWx1ZSBvZiBGJ3MgW1tUYXJnZXRGdW5jdGlvbl1dXG4gICAgICAgICAgICAgICAgLy8gICBpbnRlcm5hbCBwcm9wZXJ0eS5cbiAgICAgICAgICAgICAgICAvLyAyLiBJZiB0YXJnZXQgaGFzIG5vIFtbQ29uc3RydWN0XV0gaW50ZXJuYWwgbWV0aG9kLCBhXG4gICAgICAgICAgICAgICAgLy8gICBUeXBlRXJyb3IgZXhjZXB0aW9uIGlzIHRocm93bi5cbiAgICAgICAgICAgICAgICAvLyAzLiBMZXQgYm91bmRBcmdzIGJlIHRoZSB2YWx1ZSBvZiBGJ3MgW1tCb3VuZEFyZ3NdXSBpbnRlcm5hbFxuICAgICAgICAgICAgICAgIC8vICAgcHJvcGVydHkuXG4gICAgICAgICAgICAgICAgLy8gNC4gTGV0IGFyZ3MgYmUgYSBuZXcgbGlzdCBjb250YWluaW5nIHRoZSBzYW1lIHZhbHVlcyBhcyB0aGVcbiAgICAgICAgICAgICAgICAvLyAgIGxpc3QgYm91bmRBcmdzIGluIHRoZSBzYW1lIG9yZGVyIGZvbGxvd2VkIGJ5IHRoZSBzYW1lXG4gICAgICAgICAgICAgICAgLy8gICB2YWx1ZXMgYXMgdGhlIGxpc3QgRXh0cmFBcmdzIGluIHRoZSBzYW1lIG9yZGVyLlxuICAgICAgICAgICAgICAgIC8vIDUuIFJldHVybiB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbQ29uc3RydWN0XV0gaW50ZXJuYWxcbiAgICAgICAgICAgICAgICAvLyAgIG1ldGhvZCBvZiB0YXJnZXQgcHJvdmlkaW5nIGFyZ3MgYXMgdGhlIGFyZ3VtZW50cy5cblxuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSB0YXJnZXQuYXBwbHkoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgICAgICAgICAgIGFyZ3MuY29uY2F0KF9BcnJheV9zbGljZV8uY2FsbChhcmd1bWVudHMpKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgaWYgKE9iamVjdChyZXN1bHQpID09PSByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gMTUuMy40LjUuMSBbW0NhbGxdXVxuICAgICAgICAgICAgICAgIC8vIFdoZW4gdGhlIFtbQ2FsbF1dIGludGVybmFsIG1ldGhvZCBvZiBhIGZ1bmN0aW9uIG9iamVjdCwgRixcbiAgICAgICAgICAgICAgICAvLyB3aGljaCB3YXMgY3JlYXRlZCB1c2luZyB0aGUgYmluZCBmdW5jdGlvbiBpcyBjYWxsZWQgd2l0aCBhXG4gICAgICAgICAgICAgICAgLy8gdGhpcyB2YWx1ZSBhbmQgYSBsaXN0IG9mIGFyZ3VtZW50cyBFeHRyYUFyZ3MsIHRoZSBmb2xsb3dpbmdcbiAgICAgICAgICAgICAgICAvLyBzdGVwcyBhcmUgdGFrZW46XG4gICAgICAgICAgICAgICAgLy8gMS4gTGV0IGJvdW5kQXJncyBiZSB0aGUgdmFsdWUgb2YgRidzIFtbQm91bmRBcmdzXV0gaW50ZXJuYWxcbiAgICAgICAgICAgICAgICAvLyAgIHByb3BlcnR5LlxuICAgICAgICAgICAgICAgIC8vIDIuIExldCBib3VuZFRoaXMgYmUgdGhlIHZhbHVlIG9mIEYncyBbW0JvdW5kVGhpc11dIGludGVybmFsXG4gICAgICAgICAgICAgICAgLy8gICBwcm9wZXJ0eS5cbiAgICAgICAgICAgICAgICAvLyAzLiBMZXQgdGFyZ2V0IGJlIHRoZSB2YWx1ZSBvZiBGJ3MgW1tUYXJnZXRGdW5jdGlvbl1dIGludGVybmFsXG4gICAgICAgICAgICAgICAgLy8gICBwcm9wZXJ0eS5cbiAgICAgICAgICAgICAgICAvLyA0LiBMZXQgYXJncyBiZSBhIG5ldyBsaXN0IGNvbnRhaW5pbmcgdGhlIHNhbWUgdmFsdWVzIGFzIHRoZVxuICAgICAgICAgICAgICAgIC8vICAgbGlzdCBib3VuZEFyZ3MgaW4gdGhlIHNhbWUgb3JkZXIgZm9sbG93ZWQgYnkgdGhlIHNhbWVcbiAgICAgICAgICAgICAgICAvLyAgIHZhbHVlcyBhcyB0aGUgbGlzdCBFeHRyYUFyZ3MgaW4gdGhlIHNhbWUgb3JkZXIuXG4gICAgICAgICAgICAgICAgLy8gNS4gUmV0dXJuIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tDYWxsXV0gaW50ZXJuYWwgbWV0aG9kXG4gICAgICAgICAgICAgICAgLy8gICBvZiB0YXJnZXQgcHJvdmlkaW5nIGJvdW5kVGhpcyBhcyB0aGUgdGhpcyB2YWx1ZSBhbmRcbiAgICAgICAgICAgICAgICAvLyAgIHByb3ZpZGluZyBhcmdzIGFzIHRoZSBhcmd1bWVudHMuXG5cbiAgICAgICAgICAgICAgICAvLyBlcXVpdjogdGFyZ2V0LmNhbGwodGhpcywgLi4uYm91bmRBcmdzLCAuLi5hcmdzKVxuICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXQuYXBwbHkoXG4gICAgICAgICAgICAgICAgICAgIHRoYXQsXG4gICAgICAgICAgICAgICAgICAgIGFyZ3MuY29uY2F0KF9BcnJheV9zbGljZV8uY2FsbChhcmd1bWVudHMpKVxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9O1xuICAgICAgICBpZih0YXJnZXQucHJvdG90eXBlKSB7XG4gICAgICAgICAgICBFbXB0eS5wcm90b3R5cGUgPSB0YXJnZXQucHJvdG90eXBlO1xuICAgICAgICAgICAgYm91bmQucHJvdG90eXBlID0gbmV3IEVtcHR5KCk7XG4gICAgICAgICAgICAvLyBDbGVhbiB1cCBkYW5nbGluZyByZWZlcmVuY2VzLlxuICAgICAgICAgICAgRW1wdHkucHJvdG90eXBlID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICAvLyBYWFggYm91bmQubGVuZ3RoIGlzIG5ldmVyIHdyaXRhYmxlLCBzbyBkb24ndCBldmVuIHRyeVxuICAgICAgICAvL1xuICAgICAgICAvLyAxNS4gSWYgdGhlIFtbQ2xhc3NdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBUYXJnZXQgaXMgXCJGdW5jdGlvblwiLCB0aGVuXG4gICAgICAgIC8vICAgICBhLiBMZXQgTCBiZSB0aGUgbGVuZ3RoIHByb3BlcnR5IG9mIFRhcmdldCBtaW51cyB0aGUgbGVuZ3RoIG9mIEEuXG4gICAgICAgIC8vICAgICBiLiBTZXQgdGhlIGxlbmd0aCBvd24gcHJvcGVydHkgb2YgRiB0byBlaXRoZXIgMCBvciBMLCB3aGljaGV2ZXIgaXNcbiAgICAgICAgLy8gICAgICAgbGFyZ2VyLlxuICAgICAgICAvLyAxNi4gRWxzZSBzZXQgdGhlIGxlbmd0aCBvd24gcHJvcGVydHkgb2YgRiB0byAwLlxuICAgICAgICAvLyAxNy4gU2V0IHRoZSBhdHRyaWJ1dGVzIG9mIHRoZSBsZW5ndGggb3duIHByb3BlcnR5IG9mIEYgdG8gdGhlIHZhbHVlc1xuICAgICAgICAvLyAgIHNwZWNpZmllZCBpbiAxNS4zLjUuMS5cblxuICAgICAgICAvLyBUT0RPXG4gICAgICAgIC8vIDE4LiBTZXQgdGhlIFtbRXh0ZW5zaWJsZV1dIGludGVybmFsIHByb3BlcnR5IG9mIEYgdG8gdHJ1ZS5cblxuICAgICAgICAvLyBUT0RPXG4gICAgICAgIC8vIDE5LiBMZXQgdGhyb3dlciBiZSB0aGUgW1tUaHJvd1R5cGVFcnJvcl1dIGZ1bmN0aW9uIE9iamVjdCAoMTMuMi4zKS5cbiAgICAgICAgLy8gMjAuIENhbGwgdGhlIFtbRGVmaW5lT3duUHJvcGVydHldXSBpbnRlcm5hbCBtZXRob2Qgb2YgRiB3aXRoXG4gICAgICAgIC8vICAgYXJndW1lbnRzIFwiY2FsbGVyXCIsIFByb3BlcnR5RGVzY3JpcHRvciB7W1tHZXRdXTogdGhyb3dlciwgW1tTZXRdXTpcbiAgICAgICAgLy8gICB0aHJvd2VyLCBbW0VudW1lcmFibGVdXTogZmFsc2UsIFtbQ29uZmlndXJhYmxlXV06IGZhbHNlfSwgYW5kXG4gICAgICAgIC8vICAgZmFsc2UuXG4gICAgICAgIC8vIDIxLiBDYWxsIHRoZSBbW0RlZmluZU93blByb3BlcnR5XV0gaW50ZXJuYWwgbWV0aG9kIG9mIEYgd2l0aFxuICAgICAgICAvLyAgIGFyZ3VtZW50cyBcImFyZ3VtZW50c1wiLCBQcm9wZXJ0eURlc2NyaXB0b3Ige1tbR2V0XV06IHRocm93ZXIsXG4gICAgICAgIC8vICAgW1tTZXRdXTogdGhyb3dlciwgW1tFbnVtZXJhYmxlXV06IGZhbHNlLCBbW0NvbmZpZ3VyYWJsZV1dOiBmYWxzZX0sXG4gICAgICAgIC8vICAgYW5kIGZhbHNlLlxuXG4gICAgICAgIC8vIFRPRE9cbiAgICAgICAgLy8gTk9URSBGdW5jdGlvbiBvYmplY3RzIGNyZWF0ZWQgdXNpbmcgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQgZG8gbm90XG4gICAgICAgIC8vIGhhdmUgYSBwcm90b3R5cGUgcHJvcGVydHkgb3IgdGhlIFtbQ29kZV1dLCBbW0Zvcm1hbFBhcmFtZXRlcnNdXSwgYW5kXG4gICAgICAgIC8vIFtbU2NvcGVdXSBpbnRlcm5hbCBwcm9wZXJ0aWVzLlxuICAgICAgICAvLyBYWFggY2FuJ3QgZGVsZXRlIHByb3RvdHlwZSBpbiBwdXJlLWpzLlxuXG4gICAgICAgIC8vIDIyLiBSZXR1cm4gRi5cbiAgICAgICAgcmV0dXJuIGJvdW5kO1xuICAgIH07XG59XG5cbi8vIFNob3J0Y3V0IHRvIGFuIG9mdGVuIGFjY2Vzc2VkIHByb3BlcnRpZXMsIGluIG9yZGVyIHRvIGF2b2lkIG11bHRpcGxlXG4vLyBkZXJlZmVyZW5jZSB0aGF0IGNvc3RzIHVuaXZlcnNhbGx5LlxuLy8gX1BsZWFzZSBub3RlOiBTaG9ydGN1dHMgYXJlIGRlZmluZWQgYWZ0ZXIgYEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kYCBhcyB3ZVxuLy8gdXMgaXQgaW4gZGVmaW5pbmcgc2hvcnRjdXRzLlxudmFyIGNhbGwgPSBGdW5jdGlvbi5wcm90b3R5cGUuY2FsbDtcbnZhciBwcm90b3R5cGVPZkFycmF5ID0gQXJyYXkucHJvdG90eXBlO1xudmFyIHByb3RvdHlwZU9mT2JqZWN0ID0gT2JqZWN0LnByb3RvdHlwZTtcbnZhciBfQXJyYXlfc2xpY2VfID0gcHJvdG90eXBlT2ZBcnJheS5zbGljZTtcbi8vIEhhdmluZyBhIHRvU3RyaW5nIGxvY2FsIHZhcmlhYmxlIG5hbWUgYnJlYWtzIGluIE9wZXJhIHNvIHVzZSBfdG9TdHJpbmcuXG52YXIgX3RvU3RyaW5nID0gY2FsbC5iaW5kKHByb3RvdHlwZU9mT2JqZWN0LnRvU3RyaW5nKTtcbnZhciBvd25zID0gY2FsbC5iaW5kKHByb3RvdHlwZU9mT2JqZWN0Lmhhc093blByb3BlcnR5KTtcblxuLy8gSWYgSlMgZW5naW5lIHN1cHBvcnRzIGFjY2Vzc29ycyBjcmVhdGluZyBzaG9ydGN1dHMuXG52YXIgZGVmaW5lR2V0dGVyO1xudmFyIGRlZmluZVNldHRlcjtcbnZhciBsb29rdXBHZXR0ZXI7XG52YXIgbG9va3VwU2V0dGVyO1xudmFyIHN1cHBvcnRzQWNjZXNzb3JzO1xuaWYgKChzdXBwb3J0c0FjY2Vzc29ycyA9IG93bnMocHJvdG90eXBlT2ZPYmplY3QsIFwiX19kZWZpbmVHZXR0ZXJfX1wiKSkpIHtcbiAgICBkZWZpbmVHZXR0ZXIgPSBjYWxsLmJpbmQocHJvdG90eXBlT2ZPYmplY3QuX19kZWZpbmVHZXR0ZXJfXyk7XG4gICAgZGVmaW5lU2V0dGVyID0gY2FsbC5iaW5kKHByb3RvdHlwZU9mT2JqZWN0Ll9fZGVmaW5lU2V0dGVyX18pO1xuICAgIGxvb2t1cEdldHRlciA9IGNhbGwuYmluZChwcm90b3R5cGVPZk9iamVjdC5fX2xvb2t1cEdldHRlcl9fKTtcbiAgICBsb29rdXBTZXR0ZXIgPSBjYWxsLmJpbmQocHJvdG90eXBlT2ZPYmplY3QuX19sb29rdXBTZXR0ZXJfXyk7XG59XG5cbi8vXG4vLyBBcnJheVxuLy8gPT09PT1cbi8vXG5cbi8vIEVTNSAxNS40LjQuMTJcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjQuNC4xMlxuLy8gRGVmYXVsdCB2YWx1ZSBmb3Igc2Vjb25kIHBhcmFtXG4vLyBbYnVnZml4LCBpZWx0OSwgb2xkIGJyb3dzZXJzXVxuLy8gSUUgPCA5IGJ1ZzogWzEsMl0uc3BsaWNlKDApLmpvaW4oXCJcIikgPT0gXCJcIiBidXQgc2hvdWxkIGJlIFwiMTJcIlxuaWYgKFsxLDJdLnNwbGljZSgwKS5sZW5ndGggIT0gMikge1xuICAgIHZhciBhcnJheV9zcGxpY2UgPSBBcnJheS5wcm90b3R5cGUuc3BsaWNlO1xuXG4gICAgaWYoZnVuY3Rpb24oKSB7IC8vIHRlc3QgSUUgPCA5IHRvIHNwbGljZSBidWcgLSBzZWUgaXNzdWUgIzEzOFxuICAgICAgICBmdW5jdGlvbiBtYWtlQXJyYXkobCkge1xuICAgICAgICAgICAgdmFyIGEgPSBbXTtcbiAgICAgICAgICAgIHdoaWxlIChsLS0pIHtcbiAgICAgICAgICAgICAgICBhLnVuc2hpZnQobClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBhXG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYXJyYXkgPSBbXVxuICAgICAgICAgICAgLCBsZW5ndGhCZWZvcmVcbiAgICAgICAgO1xuXG4gICAgICAgIGFycmF5LnNwbGljZS5iaW5kKGFycmF5LCAwLCAwKS5hcHBseShudWxsLCBtYWtlQXJyYXkoMjApKTtcbiAgICAgICAgYXJyYXkuc3BsaWNlLmJpbmQoYXJyYXksIDAsIDApLmFwcGx5KG51bGwsIG1ha2VBcnJheSgyNikpO1xuXG4gICAgICAgIGxlbmd0aEJlZm9yZSA9IGFycmF5Lmxlbmd0aDsgLy8yMFxuICAgICAgICBhcnJheS5zcGxpY2UoNSwgMCwgXCJYWFhcIik7IC8vIGFkZCBvbmUgZWxlbWVudFxuXG4gICAgICAgIGlmKGxlbmd0aEJlZm9yZSArIDEgPT0gYXJyYXkubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTsvLyBoYXMgcmlnaHQgc3BsaWNlIGltcGxlbWVudGF0aW9uIHdpdGhvdXQgYnVnc1xuICAgICAgICB9XG4gICAgICAgIC8vIGVsc2Uge1xuICAgICAgICAvLyAgICBJRTggYnVnXG4gICAgICAgIC8vIH1cbiAgICB9KCkpIHsvL0lFIDYvN1xuICAgICAgICBBcnJheS5wcm90b3R5cGUuc3BsaWNlID0gZnVuY3Rpb24oc3RhcnQsIGRlbGV0ZUNvdW50KSB7XG4gICAgICAgICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBhcnJheV9zcGxpY2UuYXBwbHkodGhpcywgW1xuICAgICAgICAgICAgICAgICAgICBzdGFydCA9PT0gdm9pZCAwID8gMCA6IHN0YXJ0LFxuICAgICAgICAgICAgICAgICAgICBkZWxldGVDb3VudCA9PT0gdm9pZCAwID8gKHRoaXMubGVuZ3RoIC0gc3RhcnQpIDogZGVsZXRlQ291bnRcbiAgICAgICAgICAgICAgICBdLmNvbmNhdChfQXJyYXlfc2xpY2VfLmNhbGwoYXJndW1lbnRzLCAyKSkpXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuICAgIGVsc2Ugey8vSUU4XG4gICAgICAgIEFycmF5LnByb3RvdHlwZS5zcGxpY2UgPSBmdW5jdGlvbihzdGFydCwgZGVsZXRlQ291bnQpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHRcbiAgICAgICAgICAgICAgICAsIGFyZ3MgPSBfQXJyYXlfc2xpY2VfLmNhbGwoYXJndW1lbnRzLCAyKVxuICAgICAgICAgICAgICAgICwgYWRkRWxlbWVudHNDb3VudCA9IGFyZ3MubGVuZ3RoXG4gICAgICAgICAgICA7XG5cbiAgICAgICAgICAgIGlmKCFhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihzdGFydCA9PT0gdm9pZCAwKSB7IC8vIGRlZmF1bHRcbiAgICAgICAgICAgICAgICBzdGFydCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihkZWxldGVDb3VudCA9PT0gdm9pZCAwKSB7IC8vIGRlZmF1bHRcbiAgICAgICAgICAgICAgICBkZWxldGVDb3VudCA9IHRoaXMubGVuZ3RoIC0gc3RhcnQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGFkZEVsZW1lbnRzQ291bnQgPiAwKSB7XG4gICAgICAgICAgICAgICAgaWYoZGVsZXRlQ291bnQgPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICBpZihzdGFydCA9PSB0aGlzLmxlbmd0aCkgeyAvLyB0aW55IG9wdGltaXNhdGlvbiAjMVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXNoLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoc3RhcnQgPT0gMCkgeyAvLyB0aW55IG9wdGltaXNhdGlvbiAjMlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51bnNoaWZ0LmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gQXJyYXkucHJvdG90eXBlLnNwbGljZSBpbXBsZW1lbnRhdGlvblxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IF9BcnJheV9zbGljZV8uY2FsbCh0aGlzLCBzdGFydCwgc3RhcnQgKyBkZWxldGVDb3VudCk7Ly8gZGVsZXRlIHBhcnRcbiAgICAgICAgICAgICAgICBhcmdzLnB1c2guYXBwbHkoYXJncywgX0FycmF5X3NsaWNlXy5jYWxsKHRoaXMsIHN0YXJ0ICsgZGVsZXRlQ291bnQsIHRoaXMubGVuZ3RoKSk7Ly8gcmlnaHQgcGFydFxuICAgICAgICAgICAgICAgIGFyZ3MudW5zaGlmdC5hcHBseShhcmdzLCBfQXJyYXlfc2xpY2VfLmNhbGwodGhpcywgMCwgc3RhcnQpKTsvLyBsZWZ0IHBhcnRcblxuICAgICAgICAgICAgICAgIC8vIGRlbGV0ZSBhbGwgaXRlbXMgZnJvbSB0aGlzIGFycmF5IGFuZCByZXBsYWNlIGl0IHRvICdsZWZ0IHBhcnQnICsgX0FycmF5X3NsaWNlXy5jYWxsKGFyZ3VtZW50cywgMikgKyAncmlnaHQgcGFydCdcbiAgICAgICAgICAgICAgICBhcmdzLnVuc2hpZnQoMCwgdGhpcy5sZW5ndGgpO1xuXG4gICAgICAgICAgICAgICAgYXJyYXlfc3BsaWNlLmFwcGx5KHRoaXMsIGFyZ3MpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGFycmF5X3NwbGljZS5jYWxsKHRoaXMsIHN0YXJ0LCBkZWxldGVDb3VudCk7XG4gICAgICAgIH1cblxuICAgIH1cbn1cblxuLy8gRVM1IDE1LjQuNC4xMlxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNC40LjEzXG4vLyBSZXR1cm4gbGVuK2FyZ0NvdW50LlxuLy8gW2J1Z2ZpeCwgaWVsdDhdXG4vLyBJRSA8IDggYnVnOiBbXS51bnNoaWZ0KDApID09IHVuZGVmaW5lZCBidXQgc2hvdWxkIGJlIFwiMVwiXG5pZiAoW10udW5zaGlmdCgwKSAhPSAxKSB7XG4gICAgdmFyIGFycmF5X3Vuc2hpZnQgPSBBcnJheS5wcm90b3R5cGUudW5zaGlmdDtcbiAgICBBcnJheS5wcm90b3R5cGUudW5zaGlmdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBhcnJheV91bnNoaWZ0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIHJldHVybiB0aGlzLmxlbmd0aDtcbiAgICB9O1xufVxuXG4vLyBFUzUgMTUuNC4zLjJcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjQuMy4yXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9pc0FycmF5XG5pZiAoIUFycmF5LmlzQXJyYXkpIHtcbiAgICBBcnJheS5pc0FycmF5ID0gZnVuY3Rpb24gaXNBcnJheShvYmopIHtcbiAgICAgICAgcmV0dXJuIF90b1N0cmluZyhvYmopID09IFwiW29iamVjdCBBcnJheV1cIjtcbiAgICB9O1xufVxuXG4vLyBUaGUgSXNDYWxsYWJsZSgpIGNoZWNrIGluIHRoZSBBcnJheSBmdW5jdGlvbnNcbi8vIGhhcyBiZWVuIHJlcGxhY2VkIHdpdGggYSBzdHJpY3QgY2hlY2sgb24gdGhlXG4vLyBpbnRlcm5hbCBjbGFzcyBvZiB0aGUgb2JqZWN0IHRvIHRyYXAgY2FzZXMgd2hlcmVcbi8vIHRoZSBwcm92aWRlZCBmdW5jdGlvbiB3YXMgYWN0dWFsbHkgYSByZWd1bGFyXG4vLyBleHByZXNzaW9uIGxpdGVyYWwsIHdoaWNoIGluIFY4IGFuZFxuLy8gSmF2YVNjcmlwdENvcmUgaXMgYSB0eXBlb2YgXCJmdW5jdGlvblwiLiAgT25seSBpblxuLy8gVjggYXJlIHJlZ3VsYXIgZXhwcmVzc2lvbiBsaXRlcmFscyBwZXJtaXR0ZWQgYXNcbi8vIHJlZHVjZSBwYXJhbWV0ZXJzLCBzbyBpdCBpcyBkZXNpcmFibGUgaW4gdGhlXG4vLyBnZW5lcmFsIGNhc2UgZm9yIHRoZSBzaGltIHRvIG1hdGNoIHRoZSBtb3JlXG4vLyBzdHJpY3QgYW5kIGNvbW1vbiBiZWhhdmlvciBvZiByZWplY3RpbmcgcmVndWxhclxuLy8gZXhwcmVzc2lvbnMuXG5cbi8vIEVTNSAxNS40LjQuMThcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjQuNC4xOFxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvYXJyYXkvZm9yRWFjaFxuXG4vLyBDaGVjayBmYWlsdXJlIG9mIGJ5LWluZGV4IGFjY2VzcyBvZiBzdHJpbmcgY2hhcmFjdGVycyAoSUUgPCA5KVxuLy8gYW5kIGZhaWx1cmUgb2YgYDAgaW4gYm94ZWRTdHJpbmdgIChSaGlubylcbnZhciBib3hlZFN0cmluZyA9IE9iamVjdChcImFcIiksXG4gICAgc3BsaXRTdHJpbmcgPSBib3hlZFN0cmluZ1swXSAhPSBcImFcIiB8fCAhKDAgaW4gYm94ZWRTdHJpbmcpO1xuXG5pZiAoIUFycmF5LnByb3RvdHlwZS5mb3JFYWNoKSB7XG4gICAgQXJyYXkucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiBmb3JFYWNoKGZ1biAvKiwgdGhpc3AqLykge1xuICAgICAgICB2YXIgb2JqZWN0ID0gdG9PYmplY3QodGhpcyksXG4gICAgICAgICAgICBzZWxmID0gc3BsaXRTdHJpbmcgJiYgX3RvU3RyaW5nKHRoaXMpID09IFwiW29iamVjdCBTdHJpbmddXCIgP1xuICAgICAgICAgICAgICAgIHRoaXMuc3BsaXQoXCJcIikgOlxuICAgICAgICAgICAgICAgIG9iamVjdCxcbiAgICAgICAgICAgIHRoaXNwID0gYXJndW1lbnRzWzFdLFxuICAgICAgICAgICAgaSA9IC0xLFxuICAgICAgICAgICAgbGVuZ3RoID0gc2VsZi5sZW5ndGggPj4+IDA7XG5cbiAgICAgICAgLy8gSWYgbm8gY2FsbGJhY2sgZnVuY3Rpb24gb3IgaWYgY2FsbGJhY2sgaXMgbm90IGEgY2FsbGFibGUgZnVuY3Rpb25cbiAgICAgICAgaWYgKF90b1N0cmluZyhmdW4pICE9IFwiW29iamVjdCBGdW5jdGlvbl1cIikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpOyAvLyBUT0RPIG1lc3NhZ2VcbiAgICAgICAgfVxuXG4gICAgICAgIHdoaWxlICgrK2kgPCBsZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChpIGluIHNlbGYpIHtcbiAgICAgICAgICAgICAgICAvLyBJbnZva2UgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHdpdGggY2FsbCwgcGFzc2luZyBhcmd1bWVudHM6XG4gICAgICAgICAgICAgICAgLy8gY29udGV4dCwgcHJvcGVydHkgdmFsdWUsIHByb3BlcnR5IGtleSwgdGhpc0FyZyBvYmplY3RcbiAgICAgICAgICAgICAgICAvLyBjb250ZXh0XG4gICAgICAgICAgICAgICAgZnVuLmNhbGwodGhpc3AsIHNlbGZbaV0sIGksIG9iamVjdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG4vLyBFUzUgMTUuNC40LjE5XG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS40LjQuMTlcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0NvcmVfSmF2YVNjcmlwdF8xLjVfUmVmZXJlbmNlL09iamVjdHMvQXJyYXkvbWFwXG5pZiAoIUFycmF5LnByb3RvdHlwZS5tYXApIHtcbiAgICBBcnJheS5wcm90b3R5cGUubWFwID0gZnVuY3Rpb24gbWFwKGZ1biAvKiwgdGhpc3AqLykge1xuICAgICAgICB2YXIgb2JqZWN0ID0gdG9PYmplY3QodGhpcyksXG4gICAgICAgICAgICBzZWxmID0gc3BsaXRTdHJpbmcgJiYgX3RvU3RyaW5nKHRoaXMpID09IFwiW29iamVjdCBTdHJpbmddXCIgP1xuICAgICAgICAgICAgICAgIHRoaXMuc3BsaXQoXCJcIikgOlxuICAgICAgICAgICAgICAgIG9iamVjdCxcbiAgICAgICAgICAgIGxlbmd0aCA9IHNlbGYubGVuZ3RoID4+PiAwLFxuICAgICAgICAgICAgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKSxcbiAgICAgICAgICAgIHRoaXNwID0gYXJndW1lbnRzWzFdO1xuXG4gICAgICAgIC8vIElmIG5vIGNhbGxiYWNrIGZ1bmN0aW9uIG9yIGlmIGNhbGxiYWNrIGlzIG5vdCBhIGNhbGxhYmxlIGZ1bmN0aW9uXG4gICAgICAgIGlmIChfdG9TdHJpbmcoZnVuKSAhPSBcIltvYmplY3QgRnVuY3Rpb25dXCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoZnVuICsgXCIgaXMgbm90IGEgZnVuY3Rpb25cIik7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoaSBpbiBzZWxmKVxuICAgICAgICAgICAgICAgIHJlc3VsdFtpXSA9IGZ1bi5jYWxsKHRoaXNwLCBzZWxmW2ldLCBpLCBvYmplY3QpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbn1cblxuLy8gRVM1IDE1LjQuNC4yMFxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNC40LjIwXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9Db3JlX0phdmFTY3JpcHRfMS41X1JlZmVyZW5jZS9PYmplY3RzL0FycmF5L2ZpbHRlclxuaWYgKCFBcnJheS5wcm90b3R5cGUuZmlsdGVyKSB7XG4gICAgQXJyYXkucHJvdG90eXBlLmZpbHRlciA9IGZ1bmN0aW9uIGZpbHRlcihmdW4gLyosIHRoaXNwICovKSB7XG4gICAgICAgIHZhciBvYmplY3QgPSB0b09iamVjdCh0aGlzKSxcbiAgICAgICAgICAgIHNlbGYgPSBzcGxpdFN0cmluZyAmJiBfdG9TdHJpbmcodGhpcykgPT0gXCJbb2JqZWN0IFN0cmluZ11cIiA/XG4gICAgICAgICAgICAgICAgdGhpcy5zcGxpdChcIlwiKSA6XG4gICAgICAgICAgICAgICAgICAgIG9iamVjdCxcbiAgICAgICAgICAgIGxlbmd0aCA9IHNlbGYubGVuZ3RoID4+PiAwLFxuICAgICAgICAgICAgcmVzdWx0ID0gW10sXG4gICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgIHRoaXNwID0gYXJndW1lbnRzWzFdO1xuXG4gICAgICAgIC8vIElmIG5vIGNhbGxiYWNrIGZ1bmN0aW9uIG9yIGlmIGNhbGxiYWNrIGlzIG5vdCBhIGNhbGxhYmxlIGZ1bmN0aW9uXG4gICAgICAgIGlmIChfdG9TdHJpbmcoZnVuKSAhPSBcIltvYmplY3QgRnVuY3Rpb25dXCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoZnVuICsgXCIgaXMgbm90IGEgZnVuY3Rpb25cIik7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoaSBpbiBzZWxmKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBzZWxmW2ldO1xuICAgICAgICAgICAgICAgIGlmIChmdW4uY2FsbCh0aGlzcCwgdmFsdWUsIGksIG9iamVjdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG59XG5cbi8vIEVTNSAxNS40LjQuMTZcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjQuNC4xNlxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvZXZlcnlcbmlmICghQXJyYXkucHJvdG90eXBlLmV2ZXJ5KSB7XG4gICAgQXJyYXkucHJvdG90eXBlLmV2ZXJ5ID0gZnVuY3Rpb24gZXZlcnkoZnVuIC8qLCB0aGlzcCAqLykge1xuICAgICAgICB2YXIgb2JqZWN0ID0gdG9PYmplY3QodGhpcyksXG4gICAgICAgICAgICBzZWxmID0gc3BsaXRTdHJpbmcgJiYgX3RvU3RyaW5nKHRoaXMpID09IFwiW29iamVjdCBTdHJpbmddXCIgP1xuICAgICAgICAgICAgICAgIHRoaXMuc3BsaXQoXCJcIikgOlxuICAgICAgICAgICAgICAgIG9iamVjdCxcbiAgICAgICAgICAgIGxlbmd0aCA9IHNlbGYubGVuZ3RoID4+PiAwLFxuICAgICAgICAgICAgdGhpc3AgPSBhcmd1bWVudHNbMV07XG5cbiAgICAgICAgLy8gSWYgbm8gY2FsbGJhY2sgZnVuY3Rpb24gb3IgaWYgY2FsbGJhY2sgaXMgbm90IGEgY2FsbGFibGUgZnVuY3Rpb25cbiAgICAgICAgaWYgKF90b1N0cmluZyhmdW4pICE9IFwiW29iamVjdCBGdW5jdGlvbl1cIikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihmdW4gKyBcIiBpcyBub3QgYSBmdW5jdGlvblwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChpIGluIHNlbGYgJiYgIWZ1bi5jYWxsKHRoaXNwLCBzZWxmW2ldLCBpLCBvYmplY3QpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG59XG5cbi8vIEVTNSAxNS40LjQuMTdcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjQuNC4xN1xuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvc29tZVxuaWYgKCFBcnJheS5wcm90b3R5cGUuc29tZSkge1xuICAgIEFycmF5LnByb3RvdHlwZS5zb21lID0gZnVuY3Rpb24gc29tZShmdW4gLyosIHRoaXNwICovKSB7XG4gICAgICAgIHZhciBvYmplY3QgPSB0b09iamVjdCh0aGlzKSxcbiAgICAgICAgICAgIHNlbGYgPSBzcGxpdFN0cmluZyAmJiBfdG9TdHJpbmcodGhpcykgPT0gXCJbb2JqZWN0IFN0cmluZ11cIiA/XG4gICAgICAgICAgICAgICAgdGhpcy5zcGxpdChcIlwiKSA6XG4gICAgICAgICAgICAgICAgb2JqZWN0LFxuICAgICAgICAgICAgbGVuZ3RoID0gc2VsZi5sZW5ndGggPj4+IDAsXG4gICAgICAgICAgICB0aGlzcCA9IGFyZ3VtZW50c1sxXTtcblxuICAgICAgICAvLyBJZiBubyBjYWxsYmFjayBmdW5jdGlvbiBvciBpZiBjYWxsYmFjayBpcyBub3QgYSBjYWxsYWJsZSBmdW5jdGlvblxuICAgICAgICBpZiAoX3RvU3RyaW5nKGZ1bikgIT0gXCJbb2JqZWN0IEZ1bmN0aW9uXVwiKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGZ1biArIFwiIGlzIG5vdCBhIGZ1bmN0aW9uXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGkgaW4gc2VsZiAmJiBmdW4uY2FsbCh0aGlzcCwgc2VsZltpXSwgaSwgb2JqZWN0KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xufVxuXG4vLyBFUzUgMTUuNC40LjIxXG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS40LjQuMjFcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0NvcmVfSmF2YVNjcmlwdF8xLjVfUmVmZXJlbmNlL09iamVjdHMvQXJyYXkvcmVkdWNlXG5pZiAoIUFycmF5LnByb3RvdHlwZS5yZWR1Y2UpIHtcbiAgICBBcnJheS5wcm90b3R5cGUucmVkdWNlID0gZnVuY3Rpb24gcmVkdWNlKGZ1biAvKiwgaW5pdGlhbCovKSB7XG4gICAgICAgIHZhciBvYmplY3QgPSB0b09iamVjdCh0aGlzKSxcbiAgICAgICAgICAgIHNlbGYgPSBzcGxpdFN0cmluZyAmJiBfdG9TdHJpbmcodGhpcykgPT0gXCJbb2JqZWN0IFN0cmluZ11cIiA/XG4gICAgICAgICAgICAgICAgdGhpcy5zcGxpdChcIlwiKSA6XG4gICAgICAgICAgICAgICAgb2JqZWN0LFxuICAgICAgICAgICAgbGVuZ3RoID0gc2VsZi5sZW5ndGggPj4+IDA7XG5cbiAgICAgICAgLy8gSWYgbm8gY2FsbGJhY2sgZnVuY3Rpb24gb3IgaWYgY2FsbGJhY2sgaXMgbm90IGEgY2FsbGFibGUgZnVuY3Rpb25cbiAgICAgICAgaWYgKF90b1N0cmluZyhmdW4pICE9IFwiW29iamVjdCBGdW5jdGlvbl1cIikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihmdW4gKyBcIiBpcyBub3QgYSBmdW5jdGlvblwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG5vIHZhbHVlIHRvIHJldHVybiBpZiBubyBpbml0aWFsIHZhbHVlIGFuZCBhbiBlbXB0eSBhcnJheVxuICAgICAgICBpZiAoIWxlbmd0aCAmJiBhcmd1bWVudHMubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJyZWR1Y2Ugb2YgZW1wdHkgYXJyYXkgd2l0aCBubyBpbml0aWFsIHZhbHVlXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICB2YXIgcmVzdWx0O1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBhcmd1bWVudHNbMV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgaWYgKGkgaW4gc2VsZikge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBzZWxmW2krK107XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIGlmIGFycmF5IGNvbnRhaW5zIG5vIHZhbHVlcywgbm8gaW5pdGlhbCB2YWx1ZSB0byByZXR1cm5cbiAgICAgICAgICAgICAgICBpZiAoKytpID49IGxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwicmVkdWNlIG9mIGVtcHR5IGFycmF5IHdpdGggbm8gaW5pdGlhbCB2YWx1ZVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IHdoaWxlICh0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChpIGluIHNlbGYpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBmdW4uY2FsbCh2b2lkIDAsIHJlc3VsdCwgc2VsZltpXSwgaSwgb2JqZWN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbn1cblxuLy8gRVM1IDE1LjQuNC4yMlxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNC40LjIyXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9Db3JlX0phdmFTY3JpcHRfMS41X1JlZmVyZW5jZS9PYmplY3RzL0FycmF5L3JlZHVjZVJpZ2h0XG5pZiAoIUFycmF5LnByb3RvdHlwZS5yZWR1Y2VSaWdodCkge1xuICAgIEFycmF5LnByb3RvdHlwZS5yZWR1Y2VSaWdodCA9IGZ1bmN0aW9uIHJlZHVjZVJpZ2h0KGZ1biAvKiwgaW5pdGlhbCovKSB7XG4gICAgICAgIHZhciBvYmplY3QgPSB0b09iamVjdCh0aGlzKSxcbiAgICAgICAgICAgIHNlbGYgPSBzcGxpdFN0cmluZyAmJiBfdG9TdHJpbmcodGhpcykgPT0gXCJbb2JqZWN0IFN0cmluZ11cIiA/XG4gICAgICAgICAgICAgICAgdGhpcy5zcGxpdChcIlwiKSA6XG4gICAgICAgICAgICAgICAgb2JqZWN0LFxuICAgICAgICAgICAgbGVuZ3RoID0gc2VsZi5sZW5ndGggPj4+IDA7XG5cbiAgICAgICAgLy8gSWYgbm8gY2FsbGJhY2sgZnVuY3Rpb24gb3IgaWYgY2FsbGJhY2sgaXMgbm90IGEgY2FsbGFibGUgZnVuY3Rpb25cbiAgICAgICAgaWYgKF90b1N0cmluZyhmdW4pICE9IFwiW29iamVjdCBGdW5jdGlvbl1cIikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihmdW4gKyBcIiBpcyBub3QgYSBmdW5jdGlvblwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG5vIHZhbHVlIHRvIHJldHVybiBpZiBubyBpbml0aWFsIHZhbHVlLCBlbXB0eSBhcnJheVxuICAgICAgICBpZiAoIWxlbmd0aCAmJiBhcmd1bWVudHMubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJyZWR1Y2VSaWdodCBvZiBlbXB0eSBhcnJheSB3aXRoIG5vIGluaXRpYWwgdmFsdWVcIik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcmVzdWx0LCBpID0gbGVuZ3RoIC0gMTtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gMikge1xuICAgICAgICAgICAgcmVzdWx0ID0gYXJndW1lbnRzWzFdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgIGlmIChpIGluIHNlbGYpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gc2VsZltpLS1dO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBpZiBhcnJheSBjb250YWlucyBubyB2YWx1ZXMsIG5vIGluaXRpYWwgdmFsdWUgdG8gcmV0dXJuXG4gICAgICAgICAgICAgICAgaWYgKC0taSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcInJlZHVjZVJpZ2h0IG9mIGVtcHR5IGFycmF5IHdpdGggbm8gaW5pdGlhbCB2YWx1ZVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IHdoaWxlICh0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpIDwgMCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGRvIHtcbiAgICAgICAgICAgIGlmIChpIGluIHRoaXMpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBmdW4uY2FsbCh2b2lkIDAsIHJlc3VsdCwgc2VsZltpXSwgaSwgb2JqZWN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSB3aGlsZSAoaS0tKTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG59XG5cbi8vIEVTNSAxNS40LjQuMTRcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjQuNC4xNFxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvaW5kZXhPZlxuaWYgKCFBcnJheS5wcm90b3R5cGUuaW5kZXhPZiB8fCAoWzAsIDFdLmluZGV4T2YoMSwgMikgIT0gLTEpKSB7XG4gICAgQXJyYXkucHJvdG90eXBlLmluZGV4T2YgPSBmdW5jdGlvbiBpbmRleE9mKHNvdWdodCAvKiwgZnJvbUluZGV4ICovICkge1xuICAgICAgICB2YXIgc2VsZiA9IHNwbGl0U3RyaW5nICYmIF90b1N0cmluZyh0aGlzKSA9PSBcIltvYmplY3QgU3RyaW5nXVwiID9cbiAgICAgICAgICAgICAgICB0aGlzLnNwbGl0KFwiXCIpIDpcbiAgICAgICAgICAgICAgICB0b09iamVjdCh0aGlzKSxcbiAgICAgICAgICAgIGxlbmd0aCA9IHNlbGYubGVuZ3RoID4+PiAwO1xuXG4gICAgICAgIGlmICghbGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaSA9IDA7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgaSA9IHRvSW50ZWdlcihhcmd1bWVudHNbMV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaGFuZGxlIG5lZ2F0aXZlIGluZGljZXNcbiAgICAgICAgaSA9IGkgPj0gMCA/IGkgOiBNYXRoLm1heCgwLCBsZW5ndGggKyBpKTtcbiAgICAgICAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGkgaW4gc2VsZiAmJiBzZWxmW2ldID09PSBzb3VnaHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfTtcbn1cblxuLy8gRVM1IDE1LjQuNC4xNVxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNC40LjE1XG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9sYXN0SW5kZXhPZlxuaWYgKCFBcnJheS5wcm90b3R5cGUubGFzdEluZGV4T2YgfHwgKFswLCAxXS5sYXN0SW5kZXhPZigwLCAtMykgIT0gLTEpKSB7XG4gICAgQXJyYXkucHJvdG90eXBlLmxhc3RJbmRleE9mID0gZnVuY3Rpb24gbGFzdEluZGV4T2Yoc291Z2h0IC8qLCBmcm9tSW5kZXggKi8pIHtcbiAgICAgICAgdmFyIHNlbGYgPSBzcGxpdFN0cmluZyAmJiBfdG9TdHJpbmcodGhpcykgPT0gXCJbb2JqZWN0IFN0cmluZ11cIiA/XG4gICAgICAgICAgICAgICAgdGhpcy5zcGxpdChcIlwiKSA6XG4gICAgICAgICAgICAgICAgdG9PYmplY3QodGhpcyksXG4gICAgICAgICAgICBsZW5ndGggPSBzZWxmLmxlbmd0aCA+Pj4gMDtcblxuICAgICAgICBpZiAoIWxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9XG4gICAgICAgIHZhciBpID0gbGVuZ3RoIC0gMTtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICBpID0gTWF0aC5taW4oaSwgdG9JbnRlZ2VyKGFyZ3VtZW50c1sxXSkpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGhhbmRsZSBuZWdhdGl2ZSBpbmRpY2VzXG4gICAgICAgIGkgPSBpID49IDAgPyBpIDogbGVuZ3RoIC0gTWF0aC5hYnMoaSk7XG4gICAgICAgIGZvciAoOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgaWYgKGkgaW4gc2VsZiAmJiBzb3VnaHQgPT09IHNlbGZbaV0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfTtcbn1cblxuLy9cbi8vIE9iamVjdFxuLy8gPT09PT09XG4vL1xuXG4vLyBFUzUgMTUuMi4zLjE0XG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS4yLjMuMTRcbmlmICghT2JqZWN0LmtleXMpIHtcbiAgICAvLyBodHRwOi8vd2hhdHRoZWhlYWRzYWlkLmNvbS8yMDEwLzEwL2Etc2FmZXItb2JqZWN0LWtleXMtY29tcGF0aWJpbGl0eS1pbXBsZW1lbnRhdGlvblxuICAgIHZhciBoYXNEb250RW51bUJ1ZyA9IHRydWUsXG4gICAgICAgIGRvbnRFbnVtcyA9IFtcbiAgICAgICAgICAgIFwidG9TdHJpbmdcIixcbiAgICAgICAgICAgIFwidG9Mb2NhbGVTdHJpbmdcIixcbiAgICAgICAgICAgIFwidmFsdWVPZlwiLFxuICAgICAgICAgICAgXCJoYXNPd25Qcm9wZXJ0eVwiLFxuICAgICAgICAgICAgXCJpc1Byb3RvdHlwZU9mXCIsXG4gICAgICAgICAgICBcInByb3BlcnR5SXNFbnVtZXJhYmxlXCIsXG4gICAgICAgICAgICBcImNvbnN0cnVjdG9yXCJcbiAgICAgICAgXSxcbiAgICAgICAgZG9udEVudW1zTGVuZ3RoID0gZG9udEVudW1zLmxlbmd0aDtcblxuICAgIGZvciAodmFyIGtleSBpbiB7XCJ0b1N0cmluZ1wiOiBudWxsfSkge1xuICAgICAgICBoYXNEb250RW51bUJ1ZyA9IGZhbHNlO1xuICAgIH1cblxuICAgIE9iamVjdC5rZXlzID0gZnVuY3Rpb24ga2V5cyhvYmplY3QpIHtcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICAodHlwZW9mIG9iamVjdCAhPSBcIm9iamVjdFwiICYmIHR5cGVvZiBvYmplY3QgIT0gXCJmdW5jdGlvblwiKSB8fFxuICAgICAgICAgICAgb2JqZWN0ID09PSBudWxsXG4gICAgICAgICkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk9iamVjdC5rZXlzIGNhbGxlZCBvbiBhIG5vbi1vYmplY3RcIik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIga2V5cyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBuYW1lIGluIG9iamVjdCkge1xuICAgICAgICAgICAgaWYgKG93bnMob2JqZWN0LCBuYW1lKSkge1xuICAgICAgICAgICAgICAgIGtleXMucHVzaChuYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoYXNEb250RW51bUJ1Zykge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlpID0gZG9udEVudW1zTGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBkb250RW51bSA9IGRvbnRFbnVtc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAob3ducyhvYmplY3QsIGRvbnRFbnVtKSkge1xuICAgICAgICAgICAgICAgICAgICBrZXlzLnB1c2goZG9udEVudW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ga2V5cztcbiAgICB9O1xuXG59XG5cbi8vXG4vLyBEYXRlXG4vLyA9PT09XG4vL1xuXG4vLyBFUzUgMTUuOS41LjQzXG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS45LjUuNDNcbi8vIFRoaXMgZnVuY3Rpb24gcmV0dXJucyBhIFN0cmluZyB2YWx1ZSByZXByZXNlbnQgdGhlIGluc3RhbmNlIGluIHRpbWVcbi8vIHJlcHJlc2VudGVkIGJ5IHRoaXMgRGF0ZSBvYmplY3QuIFRoZSBmb3JtYXQgb2YgdGhlIFN0cmluZyBpcyB0aGUgRGF0ZSBUaW1lXG4vLyBzdHJpbmcgZm9ybWF0IGRlZmluZWQgaW4gMTUuOS4xLjE1LiBBbGwgZmllbGRzIGFyZSBwcmVzZW50IGluIHRoZSBTdHJpbmcuXG4vLyBUaGUgdGltZSB6b25lIGlzIGFsd2F5cyBVVEMsIGRlbm90ZWQgYnkgdGhlIHN1ZmZpeCBaLiBJZiB0aGUgdGltZSB2YWx1ZSBvZlxuLy8gdGhpcyBvYmplY3QgaXMgbm90IGEgZmluaXRlIE51bWJlciBhIFJhbmdlRXJyb3IgZXhjZXB0aW9uIGlzIHRocm93bi5cbnZhciBuZWdhdGl2ZURhdGUgPSAtNjIxOTg3NTUyMDAwMDAsXG4gICAgbmVnYXRpdmVZZWFyU3RyaW5nID0gXCItMDAwMDAxXCI7XG5pZiAoXG4gICAgIURhdGUucHJvdG90eXBlLnRvSVNPU3RyaW5nIHx8XG4gICAgKG5ldyBEYXRlKG5lZ2F0aXZlRGF0ZSkudG9JU09TdHJpbmcoKS5pbmRleE9mKG5lZ2F0aXZlWWVhclN0cmluZykgPT09IC0xKVxuKSB7XG4gICAgRGF0ZS5wcm90b3R5cGUudG9JU09TdHJpbmcgPSBmdW5jdGlvbiB0b0lTT1N0cmluZygpIHtcbiAgICAgICAgdmFyIHJlc3VsdCwgbGVuZ3RoLCB2YWx1ZSwgeWVhciwgbW9udGg7XG4gICAgICAgIGlmICghaXNGaW5pdGUodGhpcykpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFwiRGF0ZS5wcm90b3R5cGUudG9JU09TdHJpbmcgY2FsbGVkIG9uIG5vbi1maW5pdGUgdmFsdWUuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgeWVhciA9IHRoaXMuZ2V0VVRDRnVsbFllYXIoKTtcblxuICAgICAgICBtb250aCA9IHRoaXMuZ2V0VVRDTW9udGgoKTtcbiAgICAgICAgLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9rcmlza293YWwvZXM1LXNoaW0vaXNzdWVzLzExMVxuICAgICAgICB5ZWFyICs9IE1hdGguZmxvb3IobW9udGggLyAxMik7XG4gICAgICAgIG1vbnRoID0gKG1vbnRoICUgMTIgKyAxMikgJSAxMjtcblxuICAgICAgICAvLyB0aGUgZGF0ZSB0aW1lIHN0cmluZyBmb3JtYXQgaXMgc3BlY2lmaWVkIGluIDE1LjkuMS4xNS5cbiAgICAgICAgcmVzdWx0ID0gW21vbnRoICsgMSwgdGhpcy5nZXRVVENEYXRlKCksXG4gICAgICAgICAgICB0aGlzLmdldFVUQ0hvdXJzKCksIHRoaXMuZ2V0VVRDTWludXRlcygpLCB0aGlzLmdldFVUQ1NlY29uZHMoKV07XG4gICAgICAgIHllYXIgPSAoXG4gICAgICAgICAgICAoeWVhciA8IDAgPyBcIi1cIiA6ICh5ZWFyID4gOTk5OSA/IFwiK1wiIDogXCJcIikpICtcbiAgICAgICAgICAgIChcIjAwMDAwXCIgKyBNYXRoLmFicyh5ZWFyKSlcbiAgICAgICAgICAgIC5zbGljZSgwIDw9IHllYXIgJiYgeWVhciA8PSA5OTk5ID8gLTQgOiAtNilcbiAgICAgICAgKTtcblxuICAgICAgICBsZW5ndGggPSByZXN1bHQubGVuZ3RoO1xuICAgICAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgICAgICAgIHZhbHVlID0gcmVzdWx0W2xlbmd0aF07XG4gICAgICAgICAgICAvLyBwYWQgbW9udGhzLCBkYXlzLCBob3VycywgbWludXRlcywgYW5kIHNlY29uZHMgdG8gaGF2ZSB0d29cbiAgICAgICAgICAgIC8vIGRpZ2l0cy5cbiAgICAgICAgICAgIGlmICh2YWx1ZSA8IDEwKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0W2xlbmd0aF0gPSBcIjBcIiArIHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIHBhZCBtaWxsaXNlY29uZHMgdG8gaGF2ZSB0aHJlZSBkaWdpdHMuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICB5ZWFyICsgXCItXCIgKyByZXN1bHQuc2xpY2UoMCwgMikuam9pbihcIi1cIikgK1xuICAgICAgICAgICAgXCJUXCIgKyByZXN1bHQuc2xpY2UoMikuam9pbihcIjpcIikgKyBcIi5cIiArXG4gICAgICAgICAgICAoXCIwMDBcIiArIHRoaXMuZ2V0VVRDTWlsbGlzZWNvbmRzKCkpLnNsaWNlKC0zKSArIFwiWlwiXG4gICAgICAgICk7XG4gICAgfTtcbn1cblxuXG4vLyBFUzUgMTUuOS41LjQ0XG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS45LjUuNDRcbi8vIFRoaXMgZnVuY3Rpb24gcHJvdmlkZXMgYSBTdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgYSBEYXRlIG9iamVjdCBmb3IgdXNlIGJ5XG4vLyBKU09OLnN0cmluZ2lmeSAoMTUuMTIuMykuXG52YXIgZGF0ZVRvSlNPTklzU3VwcG9ydGVkID0gZmFsc2U7XG50cnkge1xuICAgIGRhdGVUb0pTT05Jc1N1cHBvcnRlZCA9IChcbiAgICAgICAgRGF0ZS5wcm90b3R5cGUudG9KU09OICYmXG4gICAgICAgIG5ldyBEYXRlKE5hTikudG9KU09OKCkgPT09IG51bGwgJiZcbiAgICAgICAgbmV3IERhdGUobmVnYXRpdmVEYXRlKS50b0pTT04oKS5pbmRleE9mKG5lZ2F0aXZlWWVhclN0cmluZykgIT09IC0xICYmXG4gICAgICAgIERhdGUucHJvdG90eXBlLnRvSlNPTi5jYWxsKHsgLy8gZ2VuZXJpY1xuICAgICAgICAgICAgdG9JU09TdHJpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICApO1xufSBjYXRjaCAoZSkge1xufVxuaWYgKCFkYXRlVG9KU09OSXNTdXBwb3J0ZWQpIHtcbiAgICBEYXRlLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiB0b0pTT04oa2V5KSB7XG4gICAgICAgIC8vIFdoZW4gdGhlIHRvSlNPTiBtZXRob2QgaXMgY2FsbGVkIHdpdGggYXJndW1lbnQga2V5LCB0aGUgZm9sbG93aW5nXG4gICAgICAgIC8vIHN0ZXBzIGFyZSB0YWtlbjpcblxuICAgICAgICAvLyAxLiAgTGV0IE8gYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIFRvT2JqZWN0LCBnaXZpbmcgaXQgdGhlIHRoaXNcbiAgICAgICAgLy8gdmFsdWUgYXMgaXRzIGFyZ3VtZW50LlxuICAgICAgICAvLyAyLiBMZXQgdHYgYmUgdG9QcmltaXRpdmUoTywgaGludCBOdW1iZXIpLlxuICAgICAgICB2YXIgbyA9IE9iamVjdCh0aGlzKSxcbiAgICAgICAgICAgIHR2ID0gdG9QcmltaXRpdmUobyksXG4gICAgICAgICAgICB0b0lTTztcbiAgICAgICAgLy8gMy4gSWYgdHYgaXMgYSBOdW1iZXIgYW5kIGlzIG5vdCBmaW5pdGUsIHJldHVybiBudWxsLlxuICAgICAgICBpZiAodHlwZW9mIHR2ID09PSBcIm51bWJlclwiICYmICFpc0Zpbml0ZSh0dikpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIC8vIDQuIExldCB0b0lTTyBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbR2V0XV0gaW50ZXJuYWwgbWV0aG9kIG9mXG4gICAgICAgIC8vIE8gd2l0aCBhcmd1bWVudCBcInRvSVNPU3RyaW5nXCIuXG4gICAgICAgIHRvSVNPID0gby50b0lTT1N0cmluZztcbiAgICAgICAgLy8gNS4gSWYgSXNDYWxsYWJsZSh0b0lTTykgaXMgZmFsc2UsIHRocm93IGEgVHlwZUVycm9yIGV4Y2VwdGlvbi5cbiAgICAgICAgaWYgKHR5cGVvZiB0b0lTTyAhPSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJ0b0lTT1N0cmluZyBwcm9wZXJ0eSBpcyBub3QgY2FsbGFibGVcIik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gNi4gUmV0dXJuIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tDYWxsXV0gaW50ZXJuYWwgbWV0aG9kIG9mXG4gICAgICAgIC8vICB0b0lTTyB3aXRoIE8gYXMgdGhlIHRoaXMgdmFsdWUgYW5kIGFuIGVtcHR5IGFyZ3VtZW50IGxpc3QuXG4gICAgICAgIHJldHVybiB0b0lTTy5jYWxsKG8pO1xuXG4gICAgICAgIC8vIE5PVEUgMSBUaGUgYXJndW1lbnQgaXMgaWdub3JlZC5cblxuICAgICAgICAvLyBOT1RFIDIgVGhlIHRvSlNPTiBmdW5jdGlvbiBpcyBpbnRlbnRpb25hbGx5IGdlbmVyaWM7IGl0IGRvZXMgbm90XG4gICAgICAgIC8vIHJlcXVpcmUgdGhhdCBpdHMgdGhpcyB2YWx1ZSBiZSBhIERhdGUgb2JqZWN0LiBUaGVyZWZvcmUsIGl0IGNhbiBiZVxuICAgICAgICAvLyB0cmFuc2ZlcnJlZCB0byBvdGhlciBraW5kcyBvZiBvYmplY3RzIGZvciB1c2UgYXMgYSBtZXRob2QuIEhvd2V2ZXIsXG4gICAgICAgIC8vIGl0IGRvZXMgcmVxdWlyZSB0aGF0IGFueSBzdWNoIG9iamVjdCBoYXZlIGEgdG9JU09TdHJpbmcgbWV0aG9kLiBBblxuICAgICAgICAvLyBvYmplY3QgaXMgZnJlZSB0byB1c2UgdGhlIGFyZ3VtZW50IGtleSB0byBmaWx0ZXIgaXRzXG4gICAgICAgIC8vIHN0cmluZ2lmaWNhdGlvbi5cbiAgICB9O1xufVxuXG4vLyBFUzUgMTUuOS40LjJcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjkuNC4yXG4vLyBiYXNlZCBvbiB3b3JrIHNoYXJlZCBieSBEYW5pZWwgRnJpZXNlbiAoZGFudG1hbilcbi8vIGh0dHA6Ly9naXN0LmdpdGh1Yi5jb20vMzAzMjQ5XG5pZiAoIURhdGUucGFyc2UgfHwgXCJEYXRlLnBhcnNlIGlzIGJ1Z2d5XCIpIHtcbiAgICAvLyBYWFggZ2xvYmFsIGFzc2lnbm1lbnQgd29uJ3Qgd29yayBpbiBlbWJlZGRpbmdzIHRoYXQgdXNlXG4gICAgLy8gYW4gYWx0ZXJuYXRlIG9iamVjdCBmb3IgdGhlIGNvbnRleHQuXG4gICAgRGF0ZSA9IChmdW5jdGlvbihOYXRpdmVEYXRlKSB7XG5cbiAgICAgICAgLy8gRGF0ZS5sZW5ndGggPT09IDdcbiAgICAgICAgZnVuY3Rpb24gRGF0ZShZLCBNLCBELCBoLCBtLCBzLCBtcykge1xuICAgICAgICAgICAgdmFyIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIE5hdGl2ZURhdGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGF0ZSA9IGxlbmd0aCA9PSAxICYmIFN0cmluZyhZKSA9PT0gWSA/IC8vIGlzU3RyaW5nKFkpXG4gICAgICAgICAgICAgICAgICAgIC8vIFdlIGV4cGxpY2l0bHkgcGFzcyBpdCB0aHJvdWdoIHBhcnNlOlxuICAgICAgICAgICAgICAgICAgICBuZXcgTmF0aXZlRGF0ZShEYXRlLnBhcnNlKFkpKSA6XG4gICAgICAgICAgICAgICAgICAgIC8vIFdlIGhhdmUgdG8gbWFudWFsbHkgbWFrZSBjYWxscyBkZXBlbmRpbmcgb24gYXJndW1lbnRcbiAgICAgICAgICAgICAgICAgICAgLy8gbGVuZ3RoIGhlcmVcbiAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID49IDcgPyBuZXcgTmF0aXZlRGF0ZShZLCBNLCBELCBoLCBtLCBzLCBtcykgOlxuICAgICAgICAgICAgICAgICAgICBsZW5ndGggPj0gNiA/IG5ldyBOYXRpdmVEYXRlKFksIE0sIEQsIGgsIG0sIHMpIDpcbiAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID49IDUgPyBuZXcgTmF0aXZlRGF0ZShZLCBNLCBELCBoLCBtKSA6XG4gICAgICAgICAgICAgICAgICAgIGxlbmd0aCA+PSA0ID8gbmV3IE5hdGl2ZURhdGUoWSwgTSwgRCwgaCkgOlxuICAgICAgICAgICAgICAgICAgICBsZW5ndGggPj0gMyA/IG5ldyBOYXRpdmVEYXRlKFksIE0sIEQpIDpcbiAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID49IDIgPyBuZXcgTmF0aXZlRGF0ZShZLCBNKSA6XG4gICAgICAgICAgICAgICAgICAgIGxlbmd0aCA+PSAxID8gbmV3IE5hdGl2ZURhdGUoWSkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBOYXRpdmVEYXRlKCk7XG4gICAgICAgICAgICAgICAgLy8gUHJldmVudCBtaXh1cHMgd2l0aCB1bmZpeGVkIERhdGUgb2JqZWN0XG4gICAgICAgICAgICAgICAgZGF0ZS5jb25zdHJ1Y3RvciA9IERhdGU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gTmF0aXZlRGF0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIDE1LjkuMS4xNSBEYXRlIFRpbWUgU3RyaW5nIEZvcm1hdC5cbiAgICAgICAgdmFyIGlzb0RhdGVFeHByZXNzaW9uID0gbmV3IFJlZ0V4cChcIl5cIiArXG4gICAgICAgICAgICBcIihcXFxcZHs0fXxbXFwrXFwtXVxcXFxkezZ9KVwiICsgLy8gZm91ci1kaWdpdCB5ZWFyIGNhcHR1cmUgb3Igc2lnbiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDYtZGlnaXQgZXh0ZW5kZWQgeWVhclxuICAgICAgICAgICAgXCIoPzotKFxcXFxkezJ9KVwiICsgLy8gb3B0aW9uYWwgbW9udGggY2FwdHVyZVxuICAgICAgICAgICAgXCIoPzotKFxcXFxkezJ9KVwiICsgLy8gb3B0aW9uYWwgZGF5IGNhcHR1cmVcbiAgICAgICAgICAgIFwiKD86XCIgKyAvLyBjYXB0dXJlIGhvdXJzOm1pbnV0ZXM6c2Vjb25kcy5taWxsaXNlY29uZHNcbiAgICAgICAgICAgICAgICBcIlQoXFxcXGR7Mn0pXCIgKyAvLyBob3VycyBjYXB0dXJlXG4gICAgICAgICAgICAgICAgXCI6KFxcXFxkezJ9KVwiICsgLy8gbWludXRlcyBjYXB0dXJlXG4gICAgICAgICAgICAgICAgXCIoPzpcIiArIC8vIG9wdGlvbmFsIDpzZWNvbmRzLm1pbGxpc2Vjb25kc1xuICAgICAgICAgICAgICAgICAgICBcIjooXFxcXGR7Mn0pXCIgKyAvLyBzZWNvbmRzIGNhcHR1cmVcbiAgICAgICAgICAgICAgICAgICAgXCIoPzooXFxcXC5cXFxcZHsxLH0pKT9cIiArIC8vIG1pbGxpc2Vjb25kcyBjYXB0dXJlXG4gICAgICAgICAgICAgICAgXCIpP1wiICtcbiAgICAgICAgICAgIFwiKFwiICsgLy8gY2FwdHVyZSBVVEMgb2Zmc2V0IGNvbXBvbmVudFxuICAgICAgICAgICAgICAgIFwiWnxcIiArIC8vIFVUQyBjYXB0dXJlXG4gICAgICAgICAgICAgICAgXCIoPzpcIiArIC8vIG9mZnNldCBzcGVjaWZpZXIgKy8taG91cnM6bWludXRlc1xuICAgICAgICAgICAgICAgICAgICBcIihbLStdKVwiICsgLy8gc2lnbiBjYXB0dXJlXG4gICAgICAgICAgICAgICAgICAgIFwiKFxcXFxkezJ9KVwiICsgLy8gaG91cnMgb2Zmc2V0IGNhcHR1cmVcbiAgICAgICAgICAgICAgICAgICAgXCI6KFxcXFxkezJ9KVwiICsgLy8gbWludXRlcyBvZmZzZXQgY2FwdHVyZVxuICAgICAgICAgICAgICAgIFwiKVwiICtcbiAgICAgICAgICAgIFwiKT8pPyk/KT9cIiArXG4gICAgICAgIFwiJFwiKTtcblxuICAgICAgICB2YXIgbW9udGhzID0gW1xuICAgICAgICAgICAgMCwgMzEsIDU5LCA5MCwgMTIwLCAxNTEsIDE4MSwgMjEyLCAyNDMsIDI3MywgMzA0LCAzMzQsIDM2NVxuICAgICAgICBdO1xuXG4gICAgICAgIGZ1bmN0aW9uIGRheUZyb21Nb250aCh5ZWFyLCBtb250aCkge1xuICAgICAgICAgICAgdmFyIHQgPSBtb250aCA+IDEgPyAxIDogMDtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgbW9udGhzW21vbnRoXSArXG4gICAgICAgICAgICAgICAgTWF0aC5mbG9vcigoeWVhciAtIDE5NjkgKyB0KSAvIDQpIC1cbiAgICAgICAgICAgICAgICBNYXRoLmZsb29yKCh5ZWFyIC0gMTkwMSArIHQpIC8gMTAwKSArXG4gICAgICAgICAgICAgICAgTWF0aC5mbG9vcigoeWVhciAtIDE2MDEgKyB0KSAvIDQwMCkgK1xuICAgICAgICAgICAgICAgIDM2NSAqICh5ZWFyIC0gMTk3MClcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDb3B5IGFueSBjdXN0b20gbWV0aG9kcyBhIDNyZCBwYXJ0eSBsaWJyYXJ5IG1heSBoYXZlIGFkZGVkXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBOYXRpdmVEYXRlKSB7XG4gICAgICAgICAgICBEYXRlW2tleV0gPSBOYXRpdmVEYXRlW2tleV07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDb3B5IFwibmF0aXZlXCIgbWV0aG9kcyBleHBsaWNpdGx5OyB0aGV5IG1heSBiZSBub24tZW51bWVyYWJsZVxuICAgICAgICBEYXRlLm5vdyA9IE5hdGl2ZURhdGUubm93O1xuICAgICAgICBEYXRlLlVUQyA9IE5hdGl2ZURhdGUuVVRDO1xuICAgICAgICBEYXRlLnByb3RvdHlwZSA9IE5hdGl2ZURhdGUucHJvdG90eXBlO1xuICAgICAgICBEYXRlLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IERhdGU7XG5cbiAgICAgICAgLy8gVXBncmFkZSBEYXRlLnBhcnNlIHRvIGhhbmRsZSBzaW1wbGlmaWVkIElTTyA4NjAxIHN0cmluZ3NcbiAgICAgICAgRGF0ZS5wYXJzZSA9IGZ1bmN0aW9uIHBhcnNlKHN0cmluZykge1xuICAgICAgICAgICAgdmFyIG1hdGNoID0gaXNvRGF0ZUV4cHJlc3Npb24uZXhlYyhzdHJpbmcpO1xuICAgICAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgLy8gcGFyc2UgbW9udGhzLCBkYXlzLCBob3VycywgbWludXRlcywgc2Vjb25kcywgYW5kIG1pbGxpc2Vjb25kc1xuICAgICAgICAgICAgICAgIC8vIHByb3ZpZGUgZGVmYXVsdCB2YWx1ZXMgaWYgbmVjZXNzYXJ5XG4gICAgICAgICAgICAgICAgLy8gcGFyc2UgdGhlIFVUQyBvZmZzZXQgY29tcG9uZW50XG4gICAgICAgICAgICAgICAgdmFyIHllYXIgPSBOdW1iZXIobWF0Y2hbMV0pLFxuICAgICAgICAgICAgICAgICAgICBtb250aCA9IE51bWJlcihtYXRjaFsyXSB8fCAxKSAtIDEsXG4gICAgICAgICAgICAgICAgICAgIGRheSA9IE51bWJlcihtYXRjaFszXSB8fCAxKSAtIDEsXG4gICAgICAgICAgICAgICAgICAgIGhvdXIgPSBOdW1iZXIobWF0Y2hbNF0gfHwgMCksXG4gICAgICAgICAgICAgICAgICAgIG1pbnV0ZSA9IE51bWJlcihtYXRjaFs1XSB8fCAwKSxcbiAgICAgICAgICAgICAgICAgICAgc2Vjb25kID0gTnVtYmVyKG1hdGNoWzZdIHx8IDApLFxuICAgICAgICAgICAgICAgICAgICBtaWxsaXNlY29uZCA9IE1hdGguZmxvb3IoTnVtYmVyKG1hdGNoWzddIHx8IDApICogMTAwMCksXG4gICAgICAgICAgICAgICAgICAgIC8vIFdoZW4gdGltZSB6b25lIGlzIG1pc3NlZCwgbG9jYWwgb2Zmc2V0IHNob3VsZCBiZSB1c2VkXG4gICAgICAgICAgICAgICAgICAgIC8vIChFUyA1LjEgYnVnKVxuICAgICAgICAgICAgICAgICAgICAvLyBzZWUgaHR0cHM6Ly9idWdzLmVjbWFzY3JpcHQub3JnL3Nob3dfYnVnLmNnaT9pZD0xMTJcbiAgICAgICAgICAgICAgICAgICAgb2Zmc2V0ID0gIW1hdGNoWzRdIHx8IG1hdGNoWzhdID9cbiAgICAgICAgICAgICAgICAgICAgICAgIDAgOiBOdW1iZXIobmV3IE5hdGl2ZURhdGUoMTk3MCwgMCkpLFxuICAgICAgICAgICAgICAgICAgICBzaWduT2Zmc2V0ID0gbWF0Y2hbOV0gPT09IFwiLVwiID8gMSA6IC0xLFxuICAgICAgICAgICAgICAgICAgICBob3VyT2Zmc2V0ID0gTnVtYmVyKG1hdGNoWzEwXSB8fCAwKSxcbiAgICAgICAgICAgICAgICAgICAgbWludXRlT2Zmc2V0ID0gTnVtYmVyKG1hdGNoWzExXSB8fCAwKSxcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0O1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgaG91ciA8IChcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbnV0ZSA+IDAgfHwgc2Vjb25kID4gMCB8fCBtaWxsaXNlY29uZCA+IDAgP1xuICAgICAgICAgICAgICAgICAgICAgICAgMjQgOiAyNVxuICAgICAgICAgICAgICAgICAgICApICYmXG4gICAgICAgICAgICAgICAgICAgIG1pbnV0ZSA8IDYwICYmIHNlY29uZCA8IDYwICYmIG1pbGxpc2Vjb25kIDwgMTAwMCAmJlxuICAgICAgICAgICAgICAgICAgICBtb250aCA+IC0xICYmIG1vbnRoIDwgMTIgJiYgaG91ck9mZnNldCA8IDI0ICYmXG4gICAgICAgICAgICAgICAgICAgIG1pbnV0ZU9mZnNldCA8IDYwICYmIC8vIGRldGVjdCBpbnZhbGlkIG9mZnNldHNcbiAgICAgICAgICAgICAgICAgICAgZGF5ID4gLTEgJiZcbiAgICAgICAgICAgICAgICAgICAgZGF5IDwgKFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF5RnJvbU1vbnRoKHllYXIsIG1vbnRoICsgMSkgLVxuICAgICAgICAgICAgICAgICAgICAgICAgZGF5RnJvbU1vbnRoKHllYXIsIG1vbnRoKVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IChcbiAgICAgICAgICAgICAgICAgICAgICAgIChkYXlGcm9tTW9udGgoeWVhciwgbW9udGgpICsgZGF5KSAqIDI0ICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvdXIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgaG91ck9mZnNldCAqIHNpZ25PZmZzZXRcbiAgICAgICAgICAgICAgICAgICAgKSAqIDYwO1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSAoXG4gICAgICAgICAgICAgICAgICAgICAgICAocmVzdWx0ICsgbWludXRlICsgbWludXRlT2Zmc2V0ICogc2lnbk9mZnNldCkgKiA2MCArXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWNvbmRcbiAgICAgICAgICAgICAgICAgICAgKSAqIDEwMDAgKyBtaWxsaXNlY29uZCArIG9mZnNldDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKC04LjY0ZTE1IDw9IHJlc3VsdCAmJiByZXN1bHQgPD0gOC42NGUxNSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gTmFOO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIE5hdGl2ZURhdGUucGFyc2UuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gRGF0ZTtcbiAgICB9KShEYXRlKTtcbn1cblxuLy8gRVM1IDE1LjkuNC40XG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS45LjQuNFxuaWYgKCFEYXRlLm5vdykge1xuICAgIERhdGUubm93ID0gZnVuY3Rpb24gbm93KCkge1xuICAgICAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgfTtcbn1cblxuXG4vL1xuLy8gTnVtYmVyXG4vLyA9PT09PT1cbi8vXG5cbi8vIEVTNS4xIDE1LjcuNC41XG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS43LjQuNVxuaWYgKCFOdW1iZXIucHJvdG90eXBlLnRvRml4ZWQgfHwgKDAuMDAwMDgpLnRvRml4ZWQoMykgIT09ICcwLjAwMCcgfHwgKDAuOSkudG9GaXhlZCgwKSA9PT0gJzAnIHx8ICgxLjI1NSkudG9GaXhlZCgyKSAhPT0gJzEuMjUnIHx8ICgxMDAwMDAwMDAwMDAwMDAwMTI4KS50b0ZpeGVkKDApICE9PSBcIjEwMDAwMDAwMDAwMDAwMDAxMjhcIikge1xuICAgIC8vIEhpZGUgdGhlc2UgdmFyaWFibGVzIGFuZCBmdW5jdGlvbnNcbiAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYmFzZSwgc2l6ZSwgZGF0YSwgaTtcblxuICAgICAgICBiYXNlID0gMWU3O1xuICAgICAgICBzaXplID0gNjtcbiAgICAgICAgZGF0YSA9IFswLCAwLCAwLCAwLCAwLCAwXTtcblxuICAgICAgICBmdW5jdGlvbiBtdWx0aXBseShuLCBjKSB7XG4gICAgICAgICAgICB2YXIgaSA9IC0xO1xuICAgICAgICAgICAgd2hpbGUgKCsraSA8IHNpemUpIHtcbiAgICAgICAgICAgICAgICBjICs9IG4gKiBkYXRhW2ldO1xuICAgICAgICAgICAgICAgIGRhdGFbaV0gPSBjICUgYmFzZTtcbiAgICAgICAgICAgICAgICBjID0gTWF0aC5mbG9vcihjIC8gYmFzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBkaXZpZGUobikge1xuICAgICAgICAgICAgdmFyIGkgPSBzaXplLCBjID0gMDtcbiAgICAgICAgICAgIHdoaWxlICgtLWkgPj0gMCkge1xuICAgICAgICAgICAgICAgIGMgKz0gZGF0YVtpXTtcbiAgICAgICAgICAgICAgICBkYXRhW2ldID0gTWF0aC5mbG9vcihjIC8gbik7XG4gICAgICAgICAgICAgICAgYyA9IChjICUgbikgKiBiYXNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgICAgICAgICB2YXIgaSA9IHNpemU7XG4gICAgICAgICAgICB2YXIgcyA9ICcnO1xuICAgICAgICAgICAgd2hpbGUgKC0taSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKHMgIT09ICcnIHx8IGkgPT09IDAgfHwgZGF0YVtpXSAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdCA9IFN0cmluZyhkYXRhW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHMgPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzID0gdDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMgKz0gJzAwMDAwMDAnLnNsaWNlKDAsIDcgLSB0Lmxlbmd0aCkgKyB0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHM7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBwb3coeCwgbiwgYWNjKSB7XG4gICAgICAgICAgICByZXR1cm4gKG4gPT09IDAgPyBhY2MgOiAobiAlIDIgPT09IDEgPyBwb3coeCwgbiAtIDEsIGFjYyAqIHgpIDogcG93KHggKiB4LCBuIC8gMiwgYWNjKSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbG9nKHgpIHtcbiAgICAgICAgICAgIHZhciBuID0gMDtcbiAgICAgICAgICAgIHdoaWxlICh4ID49IDQwOTYpIHtcbiAgICAgICAgICAgICAgICBuICs9IDEyO1xuICAgICAgICAgICAgICAgIHggLz0gNDA5NjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdoaWxlICh4ID49IDIpIHtcbiAgICAgICAgICAgICAgICBuICs9IDE7XG4gICAgICAgICAgICAgICAgeCAvPSAyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG47XG4gICAgICAgIH1cblxuICAgICAgICBOdW1iZXIucHJvdG90eXBlLnRvRml4ZWQgPSBmdW5jdGlvbiAoZnJhY3Rpb25EaWdpdHMpIHtcbiAgICAgICAgICAgIHZhciBmLCB4LCBzLCBtLCBlLCB6LCBqLCBrO1xuXG4gICAgICAgICAgICAvLyBUZXN0IGZvciBOYU4gYW5kIHJvdW5kIGZyYWN0aW9uRGlnaXRzIGRvd25cbiAgICAgICAgICAgIGYgPSBOdW1iZXIoZnJhY3Rpb25EaWdpdHMpO1xuICAgICAgICAgICAgZiA9IGYgIT09IGYgPyAwIDogTWF0aC5mbG9vcihmKTtcblxuICAgICAgICAgICAgaWYgKGYgPCAwIHx8IGYgPiAyMCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFwiTnVtYmVyLnRvRml4ZWQgY2FsbGVkIHdpdGggaW52YWxpZCBudW1iZXIgb2YgZGVjaW1hbHNcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHggPSBOdW1iZXIodGhpcyk7XG5cbiAgICAgICAgICAgIC8vIFRlc3QgZm9yIE5hTlxuICAgICAgICAgICAgaWYgKHggIT09IHgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJOYU5cIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSWYgaXQgaXMgdG9vIGJpZyBvciBzbWFsbCwgcmV0dXJuIHRoZSBzdHJpbmcgdmFsdWUgb2YgdGhlIG51bWJlclxuICAgICAgICAgICAgaWYgKHggPD0gLTFlMjEgfHwgeCA+PSAxZTIxKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFN0cmluZyh4KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcyA9IFwiXCI7XG5cbiAgICAgICAgICAgIGlmICh4IDwgMCkge1xuICAgICAgICAgICAgICAgIHMgPSBcIi1cIjtcbiAgICAgICAgICAgICAgICB4ID0gLXg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG0gPSBcIjBcIjtcblxuICAgICAgICAgICAgaWYgKHggPiAxZS0yMSkge1xuICAgICAgICAgICAgICAgIC8vIDFlLTIxIDwgeCA8IDFlMjFcbiAgICAgICAgICAgICAgICAvLyAtNzAgPCBsb2cyKHgpIDwgNzBcbiAgICAgICAgICAgICAgICBlID0gbG9nKHggKiBwb3coMiwgNjksIDEpKSAtIDY5O1xuICAgICAgICAgICAgICAgIHogPSAoZSA8IDAgPyB4ICogcG93KDIsIC1lLCAxKSA6IHggLyBwb3coMiwgZSwgMSkpO1xuICAgICAgICAgICAgICAgIHogKj0gMHgxMDAwMDAwMDAwMDAwMDsgLy8gTWF0aC5wb3coMiwgNTIpO1xuICAgICAgICAgICAgICAgIGUgPSA1MiAtIGU7XG5cbiAgICAgICAgICAgICAgICAvLyAtMTggPCBlIDwgMTIyXG4gICAgICAgICAgICAgICAgLy8geCA9IHogLyAyIF4gZVxuICAgICAgICAgICAgICAgIGlmIChlID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBtdWx0aXBseSgwLCB6KTtcbiAgICAgICAgICAgICAgICAgICAgaiA9IGY7XG5cbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGogPj0gNykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbXVsdGlwbHkoMWU3LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGogLT0gNztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIG11bHRpcGx5KHBvdygxMCwgaiwgMSksIDApO1xuICAgICAgICAgICAgICAgICAgICBqID0gZSAtIDE7XG5cbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGogPj0gMjMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpdmlkZSgxIDw8IDIzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGogLT0gMjM7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBkaXZpZGUoMSA8PCBqKTtcbiAgICAgICAgICAgICAgICAgICAgbXVsdGlwbHkoMSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIGRpdmlkZSgyKTtcbiAgICAgICAgICAgICAgICAgICAgbSA9IHRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbXVsdGlwbHkoMCwgeik7XG4gICAgICAgICAgICAgICAgICAgIG11bHRpcGx5KDEgPDwgKC1lKSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIG0gPSB0b1N0cmluZygpICsgJzAuMDAwMDAwMDAwMDAwMDAwMDAwMDAnLnNsaWNlKDIsIDIgKyBmKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChmID4gMCkge1xuICAgICAgICAgICAgICAgIGsgPSBtLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgIGlmIChrIDw9IGYpIHtcbiAgICAgICAgICAgICAgICAgICAgbSA9IHMgKyAnMC4wMDAwMDAwMDAwMDAwMDAwMDAwJy5zbGljZSgwLCBmIC0gayArIDIpICsgbTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBtID0gcyArIG0uc2xpY2UoMCwgayAtIGYpICsgJy4nICsgbS5zbGljZShrIC0gZik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtID0gcyArIG07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBtO1xuICAgICAgICB9XG4gICAgfSgpKTtcbn1cblxuXG4vL1xuLy8gU3RyaW5nXG4vLyA9PT09PT1cbi8vXG5cblxuLy8gRVM1IDE1LjUuNC4xNFxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNS40LjE0XG5cbi8vIFtidWdmaXgsIElFIGx0IDksIGZpcmVmb3ggNCwgS29ucXVlcm9yLCBPcGVyYSwgb2JzY3VyZSBicm93c2Vyc11cbi8vIE1hbnkgYnJvd3NlcnMgZG8gbm90IHNwbGl0IHByb3Blcmx5IHdpdGggcmVndWxhciBleHByZXNzaW9ucyBvciB0aGV5XG4vLyBkbyBub3QgcGVyZm9ybSB0aGUgc3BsaXQgY29ycmVjdGx5IHVuZGVyIG9ic2N1cmUgY29uZGl0aW9ucy5cbi8vIFNlZSBodHRwOi8vYmxvZy5zdGV2ZW5sZXZpdGhhbi5jb20vYXJjaGl2ZXMvY3Jvc3MtYnJvd3Nlci1zcGxpdFxuLy8gSSd2ZSB0ZXN0ZWQgaW4gbWFueSBicm93c2VycyBhbmQgdGhpcyBzZWVtcyB0byBjb3ZlciB0aGUgZGV2aWFudCBvbmVzOlxuLy8gICAgJ2FiJy5zcGxpdCgvKD86YWIpKi8pIHNob3VsZCBiZSBbXCJcIiwgXCJcIl0sIG5vdCBbXCJcIl1cbi8vICAgICcuJy5zcGxpdCgvKC4/KSguPykvKSBzaG91bGQgYmUgW1wiXCIsIFwiLlwiLCBcIlwiLCBcIlwiXSwgbm90IFtcIlwiLCBcIlwiXVxuLy8gICAgJ3Rlc3N0Jy5zcGxpdCgvKHMpKi8pIHNob3VsZCBiZSBbXCJ0XCIsIHVuZGVmaW5lZCwgXCJlXCIsIFwic1wiLCBcInRcIl0sIG5vdFxuLy8gICAgICAgW3VuZGVmaW5lZCwgXCJ0XCIsIHVuZGVmaW5lZCwgXCJlXCIsIC4uLl1cbi8vICAgICcnLnNwbGl0KC8uPy8pIHNob3VsZCBiZSBbXSwgbm90IFtcIlwiXVxuLy8gICAgJy4nLnNwbGl0KC8oKSgpLykgc2hvdWxkIGJlIFtcIi5cIl0sIG5vdCBbXCJcIiwgXCJcIiwgXCIuXCJdXG5cbnZhciBzdHJpbmdfc3BsaXQgPSBTdHJpbmcucHJvdG90eXBlLnNwbGl0O1xuaWYgKFxuICAgICdhYicuc3BsaXQoLyg/OmFiKSovKS5sZW5ndGggIT09IDIgfHxcbiAgICAnLicuc3BsaXQoLyguPykoLj8pLykubGVuZ3RoICE9PSA0IHx8XG4gICAgJ3Rlc3N0Jy5zcGxpdCgvKHMpKi8pWzFdID09PSBcInRcIiB8fFxuICAgICcnLnNwbGl0KC8uPy8pLmxlbmd0aCA9PT0gMCB8fFxuICAgICcuJy5zcGxpdCgvKCkoKS8pLmxlbmd0aCA+IDFcbikge1xuICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjb21wbGlhbnRFeGVjTnBjZyA9IC8oKT8/Ly5leGVjKFwiXCIpWzFdID09PSB2b2lkIDA7IC8vIE5QQ0c6IG5vbnBhcnRpY2lwYXRpbmcgY2FwdHVyaW5nIGdyb3VwXG5cbiAgICAgICAgU3RyaW5nLnByb3RvdHlwZS5zcGxpdCA9IGZ1bmN0aW9uIChzZXBhcmF0b3IsIGxpbWl0KSB7XG4gICAgICAgICAgICB2YXIgc3RyaW5nID0gdGhpcztcbiAgICAgICAgICAgIGlmIChzZXBhcmF0b3IgPT09IHZvaWQgMCAmJiBsaW1pdCA9PT0gMClcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG5cbiAgICAgICAgICAgIC8vIElmIGBzZXBhcmF0b3JgIGlzIG5vdCBhIHJlZ2V4LCB1c2UgbmF0aXZlIHNwbGl0XG4gICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHNlcGFyYXRvcikgIT09IFwiW29iamVjdCBSZWdFeHBdXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RyaW5nX3NwbGl0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBvdXRwdXQgPSBbXSxcbiAgICAgICAgICAgICAgICBmbGFncyA9IChzZXBhcmF0b3IuaWdub3JlQ2FzZSA/IFwiaVwiIDogXCJcIikgK1xuICAgICAgICAgICAgICAgICAgICAgICAgKHNlcGFyYXRvci5tdWx0aWxpbmUgID8gXCJtXCIgOiBcIlwiKSArXG4gICAgICAgICAgICAgICAgICAgICAgICAoc2VwYXJhdG9yLmV4dGVuZGVkICAgPyBcInhcIiA6IFwiXCIpICsgLy8gUHJvcG9zZWQgZm9yIEVTNlxuICAgICAgICAgICAgICAgICAgICAgICAgKHNlcGFyYXRvci5zdGlja3kgICAgID8gXCJ5XCIgOiBcIlwiKSwgLy8gRmlyZWZveCAzK1xuICAgICAgICAgICAgICAgIGxhc3RMYXN0SW5kZXggPSAwLFxuICAgICAgICAgICAgICAgIC8vIE1ha2UgYGdsb2JhbGAgYW5kIGF2b2lkIGBsYXN0SW5kZXhgIGlzc3VlcyBieSB3b3JraW5nIHdpdGggYSBjb3B5XG4gICAgICAgICAgICAgICAgc2VwYXJhdG9yID0gbmV3IFJlZ0V4cChzZXBhcmF0b3Iuc291cmNlLCBmbGFncyArIFwiZ1wiKSxcbiAgICAgICAgICAgICAgICBzZXBhcmF0b3IyLCBtYXRjaCwgbGFzdEluZGV4LCBsYXN0TGVuZ3RoO1xuICAgICAgICAgICAgc3RyaW5nICs9IFwiXCI7IC8vIFR5cGUtY29udmVydFxuICAgICAgICAgICAgaWYgKCFjb21wbGlhbnRFeGVjTnBjZykge1xuICAgICAgICAgICAgICAgIC8vIERvZXNuJ3QgbmVlZCBmbGFncyBneSwgYnV0IHRoZXkgZG9uJ3QgaHVydFxuICAgICAgICAgICAgICAgIHNlcGFyYXRvcjIgPSBuZXcgUmVnRXhwKFwiXlwiICsgc2VwYXJhdG9yLnNvdXJjZSArIFwiJCg/IVxcXFxzKVwiLCBmbGFncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKiBWYWx1ZXMgZm9yIGBsaW1pdGAsIHBlciB0aGUgc3BlYzpcbiAgICAgICAgICAgICAqIElmIHVuZGVmaW5lZDogNDI5NDk2NzI5NSAvLyBNYXRoLnBvdygyLCAzMikgLSAxXG4gICAgICAgICAgICAgKiBJZiAwLCBJbmZpbml0eSwgb3IgTmFOOiAwXG4gICAgICAgICAgICAgKiBJZiBwb3NpdGl2ZSBudW1iZXI6IGxpbWl0ID0gTWF0aC5mbG9vcihsaW1pdCk7IGlmIChsaW1pdCA+IDQyOTQ5NjcyOTUpIGxpbWl0IC09IDQyOTQ5NjcyOTY7XG4gICAgICAgICAgICAgKiBJZiBuZWdhdGl2ZSBudW1iZXI6IDQyOTQ5NjcyOTYgLSBNYXRoLmZsb29yKE1hdGguYWJzKGxpbWl0KSlcbiAgICAgICAgICAgICAqIElmIG90aGVyOiBUeXBlLWNvbnZlcnQsIHRoZW4gdXNlIHRoZSBhYm92ZSBydWxlc1xuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBsaW1pdCA9IGxpbWl0ID09PSB2b2lkIDAgP1xuICAgICAgICAgICAgICAgIC0xID4+PiAwIDogLy8gTWF0aC5wb3coMiwgMzIpIC0gMVxuICAgICAgICAgICAgICAgIGxpbWl0ID4+PiAwOyAvLyBUb1VpbnQzMihsaW1pdClcbiAgICAgICAgICAgIHdoaWxlIChtYXRjaCA9IHNlcGFyYXRvci5leGVjKHN0cmluZykpIHtcbiAgICAgICAgICAgICAgICAvLyBgc2VwYXJhdG9yLmxhc3RJbmRleGAgaXMgbm90IHJlbGlhYmxlIGNyb3NzLWJyb3dzZXJcbiAgICAgICAgICAgICAgICBsYXN0SW5kZXggPSBtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBpZiAobGFzdEluZGV4ID4gbGFzdExhc3RJbmRleCkge1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChzdHJpbmcuc2xpY2UobGFzdExhc3RJbmRleCwgbWF0Y2guaW5kZXgpKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gRml4IGJyb3dzZXJzIHdob3NlIGBleGVjYCBtZXRob2RzIGRvbid0IGNvbnNpc3RlbnRseSByZXR1cm4gYHVuZGVmaW5lZGAgZm9yXG4gICAgICAgICAgICAgICAgICAgIC8vIG5vbnBhcnRpY2lwYXRpbmcgY2FwdHVyaW5nIGdyb3Vwc1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWNvbXBsaWFudEV4ZWNOcGNnICYmIG1hdGNoLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoWzBdLnJlcGxhY2Uoc2VwYXJhdG9yMiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aCAtIDI7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJndW1lbnRzW2ldID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoW2ldID0gdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGNoLmxlbmd0aCA+IDEgJiYgbWF0Y2guaW5kZXggPCBzdHJpbmcubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShvdXRwdXQsIG1hdGNoLnNsaWNlKDEpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsYXN0TGVuZ3RoID0gbWF0Y2hbMF0ubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICBsYXN0TGFzdEluZGV4ID0gbGFzdEluZGV4O1xuICAgICAgICAgICAgICAgICAgICBpZiAob3V0cHV0Lmxlbmd0aCA+PSBsaW1pdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHNlcGFyYXRvci5sYXN0SW5kZXggPT09IG1hdGNoLmluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIHNlcGFyYXRvci5sYXN0SW5kZXgrKzsgLy8gQXZvaWQgYW4gaW5maW5pdGUgbG9vcFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChsYXN0TGFzdEluZGV4ID09PSBzdHJpbmcubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxhc3RMZW5ndGggfHwgIXNlcGFyYXRvci50ZXN0KFwiXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKFwiXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goc3RyaW5nLnNsaWNlKGxhc3RMYXN0SW5kZXgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvdXRwdXQubGVuZ3RoID4gbGltaXQgPyBvdXRwdXQuc2xpY2UoMCwgbGltaXQpIDogb3V0cHV0O1xuICAgICAgICB9O1xuICAgIH0oKSk7XG5cbi8vIFtidWdmaXgsIGNocm9tZV1cbi8vIElmIHNlcGFyYXRvciBpcyB1bmRlZmluZWQsIHRoZW4gdGhlIHJlc3VsdCBhcnJheSBjb250YWlucyBqdXN0IG9uZSBTdHJpbmcsXG4vLyB3aGljaCBpcyB0aGUgdGhpcyB2YWx1ZSAoY29udmVydGVkIHRvIGEgU3RyaW5nKS4gSWYgbGltaXQgaXMgbm90IHVuZGVmaW5lZCxcbi8vIHRoZW4gdGhlIG91dHB1dCBhcnJheSBpcyB0cnVuY2F0ZWQgc28gdGhhdCBpdCBjb250YWlucyBubyBtb3JlIHRoYW4gbGltaXRcbi8vIGVsZW1lbnRzLlxuLy8gXCIwXCIuc3BsaXQodW5kZWZpbmVkLCAwKSAtPiBbXVxufSBlbHNlIGlmIChcIjBcIi5zcGxpdCh2b2lkIDAsIDApLmxlbmd0aCkge1xuICAgIFN0cmluZy5wcm90b3R5cGUuc3BsaXQgPSBmdW5jdGlvbihzZXBhcmF0b3IsIGxpbWl0KSB7XG4gICAgICAgIGlmIChzZXBhcmF0b3IgPT09IHZvaWQgMCAmJiBsaW1pdCA9PT0gMCkgcmV0dXJuIFtdO1xuICAgICAgICByZXR1cm4gc3RyaW5nX3NwbGl0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxufVxuXG5cbi8vIEVDTUEtMjYyLCAzcmQgQi4yLjNcbi8vIE5vdGUgYW4gRUNNQVNjcmlwdCBzdGFuZGFydCwgYWx0aG91Z2ggRUNNQVNjcmlwdCAzcmQgRWRpdGlvbiBoYXMgYVxuLy8gbm9uLW5vcm1hdGl2ZSBzZWN0aW9uIHN1Z2dlc3RpbmcgdW5pZm9ybSBzZW1hbnRpY3MgYW5kIGl0IHNob3VsZCBiZVxuLy8gbm9ybWFsaXplZCBhY3Jvc3MgYWxsIGJyb3dzZXJzXG4vLyBbYnVnZml4LCBJRSBsdCA5XSBJRSA8IDkgc3Vic3RyKCkgd2l0aCBuZWdhdGl2ZSB2YWx1ZSBub3Qgd29ya2luZyBpbiBJRVxuaWYoXCJcIi5zdWJzdHIgJiYgXCIwYlwiLnN1YnN0cigtMSkgIT09IFwiYlwiKSB7XG4gICAgdmFyIHN0cmluZ19zdWJzdHIgPSBTdHJpbmcucHJvdG90eXBlLnN1YnN0cjtcbiAgICAvKipcbiAgICAgKiAgR2V0IHRoZSBzdWJzdHJpbmcgb2YgYSBzdHJpbmdcbiAgICAgKiAgQHBhcmFtICB7aW50ZWdlcn0gIHN0YXJ0ICAgd2hlcmUgdG8gc3RhcnQgdGhlIHN1YnN0cmluZ1xuICAgICAqICBAcGFyYW0gIHtpbnRlZ2VyfSAgbGVuZ3RoICBob3cgbWFueSBjaGFyYWN0ZXJzIHRvIHJldHVyblxuICAgICAqICBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICovXG4gICAgU3RyaW5nLnByb3RvdHlwZS5zdWJzdHIgPSBmdW5jdGlvbihzdGFydCwgbGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBzdHJpbmdfc3Vic3RyLmNhbGwoXG4gICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgc3RhcnQgPCAwID8gKChzdGFydCA9IHRoaXMubGVuZ3RoICsgc3RhcnQpIDwgMCA/IDAgOiBzdGFydCkgOiBzdGFydCxcbiAgICAgICAgICAgIGxlbmd0aFxuICAgICAgICApO1xuICAgIH1cbn1cblxuLy8gRVM1IDE1LjUuNC4yMFxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNS40LjIwXG52YXIgd3MgPSBcIlxceDA5XFx4MEFcXHgwQlxceDBDXFx4MERcXHgyMFxceEEwXFx1MTY4MFxcdTE4MEVcXHUyMDAwXFx1MjAwMVxcdTIwMDJcXHUyMDAzXCIgK1xuICAgIFwiXFx1MjAwNFxcdTIwMDVcXHUyMDA2XFx1MjAwN1xcdTIwMDhcXHUyMDA5XFx1MjAwQVxcdTIwMkZcXHUyMDVGXFx1MzAwMFxcdTIwMjhcIiArXG4gICAgXCJcXHUyMDI5XFx1RkVGRlwiO1xuaWYgKCFTdHJpbmcucHJvdG90eXBlLnRyaW0gfHwgd3MudHJpbSgpKSB7XG4gICAgLy8gaHR0cDovL2Jsb2cuc3RldmVubGV2aXRoYW4uY29tL2FyY2hpdmVzL2Zhc3Rlci10cmltLWphdmFzY3JpcHRcbiAgICAvLyBodHRwOi8vcGVyZmVjdGlvbmtpbGxzLmNvbS93aGl0ZXNwYWNlLWRldmlhdGlvbnMvXG4gICAgd3MgPSBcIltcIiArIHdzICsgXCJdXCI7XG4gICAgdmFyIHRyaW1CZWdpblJlZ2V4cCA9IG5ldyBSZWdFeHAoXCJeXCIgKyB3cyArIHdzICsgXCIqXCIpLFxuICAgICAgICB0cmltRW5kUmVnZXhwID0gbmV3IFJlZ0V4cCh3cyArIHdzICsgXCIqJFwiKTtcbiAgICBTdHJpbmcucHJvdG90eXBlLnRyaW0gPSBmdW5jdGlvbiB0cmltKCkge1xuICAgICAgICBpZiAodGhpcyA9PT0gdm9pZCAwIHx8IHRoaXMgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJjYW4ndCBjb252ZXJ0IFwiK3RoaXMrXCIgdG8gb2JqZWN0XCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBTdHJpbmcodGhpcylcbiAgICAgICAgICAgIC5yZXBsYWNlKHRyaW1CZWdpblJlZ2V4cCwgXCJcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKHRyaW1FbmRSZWdleHAsIFwiXCIpO1xuICAgIH07XG59XG5cbi8vXG4vLyBVdGlsXG4vLyA9PT09PT1cbi8vXG5cbi8vIEVTNSA5LjRcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDkuNFxuLy8gaHR0cDovL2pzcGVyZi5jb20vdG8taW50ZWdlclxuXG5mdW5jdGlvbiB0b0ludGVnZXIobikge1xuICAgIG4gPSArbjtcbiAgICBpZiAobiAhPT0gbikgeyAvLyBpc05hTlxuICAgICAgICBuID0gMDtcbiAgICB9IGVsc2UgaWYgKG4gIT09IDAgJiYgbiAhPT0gKDEvMCkgJiYgbiAhPT0gLSgxLzApKSB7XG4gICAgICAgIG4gPSAobiA+IDAgfHwgLTEpICogTWF0aC5mbG9vcihNYXRoLmFicyhuKSk7XG4gICAgfVxuICAgIHJldHVybiBuO1xufVxuXG5mdW5jdGlvbiBpc1ByaW1pdGl2ZShpbnB1dCkge1xuICAgIHZhciB0eXBlID0gdHlwZW9mIGlucHV0O1xuICAgIHJldHVybiAoXG4gICAgICAgIGlucHV0ID09PSBudWxsIHx8XG4gICAgICAgIHR5cGUgPT09IFwidW5kZWZpbmVkXCIgfHxcbiAgICAgICAgdHlwZSA9PT0gXCJib29sZWFuXCIgfHxcbiAgICAgICAgdHlwZSA9PT0gXCJudW1iZXJcIiB8fFxuICAgICAgICB0eXBlID09PSBcInN0cmluZ1wiXG4gICAgKTtcbn1cblxuZnVuY3Rpb24gdG9QcmltaXRpdmUoaW5wdXQpIHtcbiAgICB2YXIgdmFsLCB2YWx1ZU9mLCB0b1N0cmluZztcbiAgICBpZiAoaXNQcmltaXRpdmUoaW5wdXQpKSB7XG4gICAgICAgIHJldHVybiBpbnB1dDtcbiAgICB9XG4gICAgdmFsdWVPZiA9IGlucHV0LnZhbHVlT2Y7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZU9mID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgdmFsID0gdmFsdWVPZi5jYWxsKGlucHV0KTtcbiAgICAgICAgaWYgKGlzUHJpbWl0aXZlKHZhbCkpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdG9TdHJpbmcgPSBpbnB1dC50b1N0cmluZztcbiAgICBpZiAodHlwZW9mIHRvU3RyaW5nID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgdmFsID0gdG9TdHJpbmcuY2FsbChpbnB1dCk7XG4gICAgICAgIGlmIChpc1ByaW1pdGl2ZSh2YWwpKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgICB9XG4gICAgfVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbn1cblxuLy8gRVM1IDkuOVxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4OS45XG52YXIgdG9PYmplY3QgPSBmdW5jdGlvbiAobykge1xuICAgIGlmIChvID09IG51bGwpIHsgLy8gdGhpcyBtYXRjaGVzIGJvdGggbnVsbCBhbmQgdW5kZWZpbmVkXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJjYW4ndCBjb252ZXJ0IFwiK28rXCIgdG8gb2JqZWN0XCIpO1xuICAgIH1cbiAgICByZXR1cm4gT2JqZWN0KG8pO1xufTtcblxufSk7XG4iLCIvLyBDb3B5cmlnaHQgMjAwOS0yMDEyIGJ5IGNvbnRyaWJ1dG9ycywgTUlUIExpY2Vuc2Vcbi8vIHZpbTogdHM9NCBzdHM9NCBzdz00IGV4cGFuZHRhYlxuXG4vLyBNb2R1bGUgc3lzdGVtcyBtYWdpYyBkYW5jZVxuKGZ1bmN0aW9uIChkZWZpbml0aW9uKSB7XG4gICAgLy8gUmVxdWlyZUpTXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGRlZmluZShkZWZpbml0aW9uKTtcbiAgICAvLyBZVUkzXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgWVVJID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBZVUkuYWRkKFwiZXM1LXNoYW1cIiwgZGVmaW5pdGlvbik7XG4gICAgLy8gQ29tbW9uSlMgYW5kIDxzY3JpcHQ+XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZGVmaW5pdGlvbigpO1xuICAgIH1cbn0pKGZ1bmN0aW9uICgpIHtcblxuXG52YXIgY2FsbCA9IEZ1bmN0aW9uLnByb3RvdHlwZS5jYWxsO1xudmFyIHByb3RvdHlwZU9mT2JqZWN0ID0gT2JqZWN0LnByb3RvdHlwZTtcbnZhciBvd25zID0gY2FsbC5iaW5kKHByb3RvdHlwZU9mT2JqZWN0Lmhhc093blByb3BlcnR5KTtcblxuLy8gSWYgSlMgZW5naW5lIHN1cHBvcnRzIGFjY2Vzc29ycyBjcmVhdGluZyBzaG9ydGN1dHMuXG52YXIgZGVmaW5lR2V0dGVyO1xudmFyIGRlZmluZVNldHRlcjtcbnZhciBsb29rdXBHZXR0ZXI7XG52YXIgbG9va3VwU2V0dGVyO1xudmFyIHN1cHBvcnRzQWNjZXNzb3JzO1xuaWYgKChzdXBwb3J0c0FjY2Vzc29ycyA9IG93bnMocHJvdG90eXBlT2ZPYmplY3QsIFwiX19kZWZpbmVHZXR0ZXJfX1wiKSkpIHtcbiAgICBkZWZpbmVHZXR0ZXIgPSBjYWxsLmJpbmQocHJvdG90eXBlT2ZPYmplY3QuX19kZWZpbmVHZXR0ZXJfXyk7XG4gICAgZGVmaW5lU2V0dGVyID0gY2FsbC5iaW5kKHByb3RvdHlwZU9mT2JqZWN0Ll9fZGVmaW5lU2V0dGVyX18pO1xuICAgIGxvb2t1cEdldHRlciA9IGNhbGwuYmluZChwcm90b3R5cGVPZk9iamVjdC5fX2xvb2t1cEdldHRlcl9fKTtcbiAgICBsb29rdXBTZXR0ZXIgPSBjYWxsLmJpbmQocHJvdG90eXBlT2ZPYmplY3QuX19sb29rdXBTZXR0ZXJfXyk7XG59XG5cbi8vIEVTNSAxNS4yLjMuMlxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuMi4zLjJcbmlmICghT2JqZWN0LmdldFByb3RvdHlwZU9mKSB7XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2tyaXNrb3dhbC9lczUtc2hpbS9pc3N1ZXMjaXNzdWUvMlxuICAgIC8vIGh0dHA6Ly9lam9obi5vcmcvYmxvZy9vYmplY3RnZXRwcm90b3R5cGVvZi9cbiAgICAvLyByZWNvbW1lbmRlZCBieSBmc2NoYWVmZXIgb24gZ2l0aHViXG4gICAgT2JqZWN0LmdldFByb3RvdHlwZU9mID0gZnVuY3Rpb24gZ2V0UHJvdG90eXBlT2Yob2JqZWN0KSB7XG4gICAgICAgIHJldHVybiBvYmplY3QuX19wcm90b19fIHx8IChcbiAgICAgICAgICAgIG9iamVjdC5jb25zdHJ1Y3RvclxuICAgICAgICAgICAgICAgID8gb2JqZWN0LmNvbnN0cnVjdG9yLnByb3RvdHlwZVxuICAgICAgICAgICAgICAgIDogcHJvdG90eXBlT2ZPYmplY3RcbiAgICAgICAgKTtcbiAgICB9O1xufVxuXG4vL0VTNSAxNS4yLjMuM1xuLy9odHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS4yLjMuM1xuXG5mdW5jdGlvbiBkb2VzR2V0T3duUHJvcGVydHlEZXNjcmlwdG9yV29yayhvYmplY3QpIHtcbiAgICB0cnkge1xuICAgICAgICBvYmplY3Quc2VudGluZWwgPSAwO1xuICAgICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihcbiAgICAgICAgICAgICAgICBvYmplY3QsXG4gICAgICAgICAgICAgICAgXCJzZW50aW5lbFwiXG4gICAgICAgICkudmFsdWUgPT09IDA7XG4gICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgICAgIC8vIHJldHVybnMgZmFsc3lcbiAgICB9XG59XG5cbi8vY2hlY2sgd2hldGhlciBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Igd29ya3MgaWYgaXQncyBnaXZlbi4gT3RoZXJ3aXNlLFxuLy9zaGltIHBhcnRpYWxseS5cbmlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHtcbiAgICB2YXIgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yV29ya3NPbk9iamVjdCA9IFxuICAgICAgICBkb2VzR2V0T3duUHJvcGVydHlEZXNjcmlwdG9yV29yayh7fSk7XG4gICAgdmFyIGdldE93blByb3BlcnR5RGVzY3JpcHRvcldvcmtzT25Eb20gPSB0eXBlb2YgZG9jdW1lbnQgPT0gXCJ1bmRlZmluZWRcIiB8fFxuICAgIGRvZXNHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JXb3JrKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikpO1xuICAgIGlmICghZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yV29ya3NPbkRvbSB8fCBcbiAgICAgICAgICAgICFnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JXb3Jrc09uT2JqZWN0XG4gICAgKSB7XG4gICAgICAgIHZhciBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JGYWxsYmFjayA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG4gICAgfVxufVxuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgfHwgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yRmFsbGJhY2spIHtcbiAgICB2YXIgRVJSX05PTl9PQkpFQ1QgPSBcIk9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgY2FsbGVkIG9uIGEgbm9uLW9iamVjdDogXCI7XG5cbiAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgcHJvcGVydHkpIHtcbiAgICAgICAgaWYgKCh0eXBlb2Ygb2JqZWN0ICE9IFwib2JqZWN0XCIgJiYgdHlwZW9mIG9iamVjdCAhPSBcImZ1bmN0aW9uXCIpIHx8IG9iamVjdCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihFUlJfTk9OX09CSkVDVCArIG9iamVjdCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBtYWtlIGEgdmFsaWFudCBhdHRlbXB0IHRvIHVzZSB0aGUgcmVhbCBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JcbiAgICAgICAgLy8gZm9yIEk4J3MgRE9NIGVsZW1lbnRzLlxuICAgICAgICBpZiAoZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yRmFsbGJhY2spIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldE93blByb3BlcnR5RGVzY3JpcHRvckZhbGxiYWNrLmNhbGwoT2JqZWN0LCBvYmplY3QsIHByb3BlcnR5KTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgICAgICAgICAgICAgIC8vIHRyeSB0aGUgc2hpbSBpZiB0aGUgcmVhbCBvbmUgZG9lc24ndCB3b3JrXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiBvYmplY3QgZG9lcyBub3Qgb3ducyBwcm9wZXJ0eSByZXR1cm4gdW5kZWZpbmVkIGltbWVkaWF0ZWx5LlxuICAgICAgICBpZiAoIW93bnMob2JqZWN0LCBwcm9wZXJ0eSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIG9iamVjdCBoYXMgYSBwcm9wZXJ0eSB0aGVuIGl0J3MgZm9yIHN1cmUgYm90aCBgZW51bWVyYWJsZWAgYW5kXG4gICAgICAgIC8vIGBjb25maWd1cmFibGVgLlxuICAgICAgICB2YXIgZGVzY3JpcHRvciA9ICB7IGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9O1xuXG4gICAgICAgIC8vIElmIEpTIGVuZ2luZSBzdXBwb3J0cyBhY2Nlc3NvciBwcm9wZXJ0aWVzIHRoZW4gcHJvcGVydHkgbWF5IGJlIGFcbiAgICAgICAgLy8gZ2V0dGVyIG9yIHNldHRlci5cbiAgICAgICAgaWYgKHN1cHBvcnRzQWNjZXNzb3JzKSB7XG4gICAgICAgICAgICAvLyBVbmZvcnR1bmF0ZWx5IGBfX2xvb2t1cEdldHRlcl9fYCB3aWxsIHJldHVybiBhIGdldHRlciBldmVuXG4gICAgICAgICAgICAvLyBpZiBvYmplY3QgaGFzIG93biBub24gZ2V0dGVyIHByb3BlcnR5IGFsb25nIHdpdGggYSBzYW1lIG5hbWVkXG4gICAgICAgICAgICAvLyBpbmhlcml0ZWQgZ2V0dGVyLiBUbyBhdm9pZCBtaXNiZWhhdmlvciB3ZSB0ZW1wb3JhcnkgcmVtb3ZlXG4gICAgICAgICAgICAvLyBgX19wcm90b19fYCBzbyB0aGF0IGBfX2xvb2t1cEdldHRlcl9fYCB3aWxsIHJldHVybiBnZXR0ZXIgb25seVxuICAgICAgICAgICAgLy8gaWYgaXQncyBvd25lZCBieSBhbiBvYmplY3QuXG4gICAgICAgICAgICB2YXIgcHJvdG90eXBlID0gb2JqZWN0Ll9fcHJvdG9fXztcbiAgICAgICAgICAgIG9iamVjdC5fX3Byb3RvX18gPSBwcm90b3R5cGVPZk9iamVjdDtcblxuICAgICAgICAgICAgdmFyIGdldHRlciA9IGxvb2t1cEdldHRlcihvYmplY3QsIHByb3BlcnR5KTtcbiAgICAgICAgICAgIHZhciBzZXR0ZXIgPSBsb29rdXBTZXR0ZXIob2JqZWN0LCBwcm9wZXJ0eSk7XG5cbiAgICAgICAgICAgIC8vIE9uY2Ugd2UgaGF2ZSBnZXR0ZXIgYW5kIHNldHRlciB3ZSBjYW4gcHV0IHZhbHVlcyBiYWNrLlxuICAgICAgICAgICAgb2JqZWN0Ll9fcHJvdG9fXyA9IHByb3RvdHlwZTtcblxuICAgICAgICAgICAgaWYgKGdldHRlciB8fCBzZXR0ZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAoZ2V0dGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0b3IuZ2V0ID0gZ2V0dGVyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoc2V0dGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0b3Iuc2V0ID0gc2V0dGVyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBJZiBpdCB3YXMgYWNjZXNzb3IgcHJvcGVydHkgd2UncmUgZG9uZSBhbmQgcmV0dXJuIGhlcmVcbiAgICAgICAgICAgICAgICAvLyBpbiBvcmRlciB0byBhdm9pZCBhZGRpbmcgYHZhbHVlYCB0byB0aGUgZGVzY3JpcHRvci5cbiAgICAgICAgICAgICAgICByZXR1cm4gZGVzY3JpcHRvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHdlIGdvdCB0aGlzIGZhciB3ZSBrbm93IHRoYXQgb2JqZWN0IGhhcyBhbiBvd24gcHJvcGVydHkgdGhhdCBpc1xuICAgICAgICAvLyBub3QgYW4gYWNjZXNzb3Igc28gd2Ugc2V0IGl0IGFzIGEgdmFsdWUgYW5kIHJldHVybiBkZXNjcmlwdG9yLlxuICAgICAgICBkZXNjcmlwdG9yLnZhbHVlID0gb2JqZWN0W3Byb3BlcnR5XTtcbiAgICAgICAgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XG4gICAgICAgIHJldHVybiBkZXNjcmlwdG9yO1xuICAgIH07XG59XG5cbi8vIEVTNSAxNS4yLjMuNFxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuMi4zLjRcbmlmICghT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMpIHtcbiAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMob2JqZWN0KSB7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhvYmplY3QpO1xuICAgIH07XG59XG5cbi8vIEVTNSAxNS4yLjMuNVxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuMi4zLjVcbmlmICghT2JqZWN0LmNyZWF0ZSkge1xuXG4gICAgLy8gQ29udHJpYnV0ZWQgYnkgQnJhbmRvbiBCZW52aWUsIE9jdG9iZXIsIDIwMTJcbiAgICB2YXIgY3JlYXRlRW1wdHk7XG4gICAgdmFyIHN1cHBvcnRzUHJvdG8gPSBPYmplY3QucHJvdG90eXBlLl9fcHJvdG9fXyA9PT0gbnVsbDtcbiAgICBpZiAoc3VwcG9ydHNQcm90byB8fCB0eXBlb2YgZG9jdW1lbnQgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgY3JlYXRlRW1wdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4geyBcIl9fcHJvdG9fX1wiOiBudWxsIH07XG4gICAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gSW4gb2xkIElFIF9fcHJvdG9fXyBjYW4ndCBiZSB1c2VkIHRvIG1hbnVhbGx5IHNldCBgbnVsbGAsIG5vciBkb2VzXG4gICAgICAgIC8vIGFueSBvdGhlciBtZXRob2QgZXhpc3QgdG8gbWFrZSBhbiBvYmplY3QgdGhhdCBpbmhlcml0cyBmcm9tIG5vdGhpbmcsXG4gICAgICAgIC8vIGFzaWRlIGZyb20gT2JqZWN0LnByb3RvdHlwZSBpdHNlbGYuIEluc3RlYWQsIGNyZWF0ZSBhIG5ldyBnbG9iYWxcbiAgICAgICAgLy8gb2JqZWN0IGFuZCAqc3RlYWwqIGl0cyBPYmplY3QucHJvdG90eXBlIGFuZCBzdHJpcCBpdCBiYXJlLiBUaGlzIGlzXG4gICAgICAgIC8vIHVzZWQgYXMgdGhlIHByb3RvdHlwZSB0byBjcmVhdGUgbnVsbGFyeSBvYmplY3RzLlxuICAgICAgICBjcmVhdGVFbXB0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBpZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcbiAgICAgICAgICAgIHZhciBwYXJlbnQgPSBkb2N1bWVudC5ib2R5IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgICAgIGlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGlmcmFtZSk7XG4gICAgICAgICAgICBpZnJhbWUuc3JjID0gJ2phdmFzY3JpcHQ6JztcbiAgICAgICAgICAgIHZhciBlbXB0eSA9IGlmcmFtZS5jb250ZW50V2luZG93Lk9iamVjdC5wcm90b3R5cGU7XG4gICAgICAgICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQoaWZyYW1lKTtcbiAgICAgICAgICAgIGlmcmFtZSA9IG51bGw7XG4gICAgICAgICAgICBkZWxldGUgZW1wdHkuY29uc3RydWN0b3I7XG4gICAgICAgICAgICBkZWxldGUgZW1wdHkuaGFzT3duUHJvcGVydHk7XG4gICAgICAgICAgICBkZWxldGUgZW1wdHkucHJvcGVydHlJc0VudW1lcmFibGU7XG4gICAgICAgICAgICBkZWxldGUgZW1wdHkuaXNQcm90b3R5cGVPZjtcbiAgICAgICAgICAgIGRlbGV0ZSBlbXB0eS50b0xvY2FsZVN0cmluZztcbiAgICAgICAgICAgIGRlbGV0ZSBlbXB0eS50b1N0cmluZztcbiAgICAgICAgICAgIGRlbGV0ZSBlbXB0eS52YWx1ZU9mO1xuICAgICAgICAgICAgZW1wdHkuX19wcm90b19fID0gbnVsbDtcblxuICAgICAgICAgICAgZnVuY3Rpb24gRW1wdHkoKSB7fVxuICAgICAgICAgICAgRW1wdHkucHJvdG90eXBlID0gZW1wdHk7XG4gICAgICAgICAgICAvLyBzaG9ydC1jaXJjdWl0IGZ1dHVyZSBjYWxsc1xuICAgICAgICAgICAgY3JlYXRlRW1wdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBFbXB0eSgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRW1wdHkoKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBPYmplY3QuY3JlYXRlID0gZnVuY3Rpb24gY3JlYXRlKHByb3RvdHlwZSwgcHJvcGVydGllcykge1xuXG4gICAgICAgIHZhciBvYmplY3Q7XG4gICAgICAgIGZ1bmN0aW9uIFR5cGUoKSB7fSAgLy8gQW4gZW1wdHkgY29uc3RydWN0b3IuXG5cbiAgICAgICAgaWYgKHByb3RvdHlwZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgb2JqZWN0ID0gY3JlYXRlRW1wdHkoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcHJvdG90eXBlICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiBwcm90b3R5cGUgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIC8vIEluIHRoZSBuYXRpdmUgaW1wbGVtZW50YXRpb24gYHBhcmVudGAgY2FuIGJlIGBudWxsYFxuICAgICAgICAgICAgICAgIC8vIE9SICphbnkqIGBpbnN0YW5jZW9mIE9iamVjdGAgIChPYmplY3R8RnVuY3Rpb258QXJyYXl8UmVnRXhwfGV0YylcbiAgICAgICAgICAgICAgICAvLyBVc2UgYHR5cGVvZmAgdGhvLCBiL2MgaW4gb2xkIElFLCBET00gZWxlbWVudHMgYXJlIG5vdCBgaW5zdGFuY2VvZiBPYmplY3RgXG4gICAgICAgICAgICAgICAgLy8gbGlrZSB0aGV5IGFyZSBpbiBtb2Rlcm4gYnJvd3NlcnMuIFVzaW5nIGBPYmplY3QuY3JlYXRlYCBvbiBET00gZWxlbWVudHNcbiAgICAgICAgICAgICAgICAvLyBpcy4uLmVyci4uLnByb2JhYmx5IGluYXBwcm9wcmlhdGUsIGJ1dCB0aGUgbmF0aXZlIHZlcnNpb24gYWxsb3dzIGZvciBpdC5cbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiT2JqZWN0IHByb3RvdHlwZSBtYXkgb25seSBiZSBhbiBPYmplY3Qgb3IgbnVsbFwiKTsgLy8gc2FtZSBtc2cgYXMgQ2hyb21lXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBUeXBlLnByb3RvdHlwZSA9IHByb3RvdHlwZTtcbiAgICAgICAgICAgIG9iamVjdCA9IG5ldyBUeXBlKCk7XG4gICAgICAgICAgICAvLyBJRSBoYXMgbm8gYnVpbHQtaW4gaW1wbGVtZW50YXRpb24gb2YgYE9iamVjdC5nZXRQcm90b3R5cGVPZmBcbiAgICAgICAgICAgIC8vIG5laXRoZXIgYF9fcHJvdG9fX2AsIGJ1dCB0aGlzIG1hbnVhbGx5IHNldHRpbmcgYF9fcHJvdG9fX2Agd2lsbFxuICAgICAgICAgICAgLy8gZ3VhcmFudGVlIHRoYXQgYE9iamVjdC5nZXRQcm90b3R5cGVPZmAgd2lsbCB3b3JrIGFzIGV4cGVjdGVkIHdpdGhcbiAgICAgICAgICAgIC8vIG9iamVjdHMgY3JlYXRlZCB1c2luZyBgT2JqZWN0LmNyZWF0ZWBcbiAgICAgICAgICAgIG9iamVjdC5fX3Byb3RvX18gPSBwcm90b3R5cGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJvcGVydGllcyAhPT0gdm9pZCAwKSB7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhvYmplY3QsIHByb3BlcnRpZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9O1xufVxuXG4vLyBFUzUgMTUuMi4zLjZcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjIuMy42XG5cbi8vIFBhdGNoIGZvciBXZWJLaXQgYW5kIElFOCBzdGFuZGFyZCBtb2RlXG4vLyBEZXNpZ25lZCBieSBoYXggPGhheC5naXRodWIuY29tPlxuLy8gcmVsYXRlZCBpc3N1ZTogaHR0cHM6Ly9naXRodWIuY29tL2tyaXNrb3dhbC9lczUtc2hpbS9pc3N1ZXMjaXNzdWUvNVxuLy8gSUU4IFJlZmVyZW5jZTpcbi8vICAgICBodHRwOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvZGQyODI5MDAuYXNweFxuLy8gICAgIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9kZDIyOTkxNi5hc3B4XG4vLyBXZWJLaXQgQnVnczpcbi8vICAgICBodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MzY0MjNcblxuZnVuY3Rpb24gZG9lc0RlZmluZVByb3BlcnR5V29yayhvYmplY3QpIHtcbiAgICB0cnkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCBcInNlbnRpbmVsXCIsIHt9KTtcbiAgICAgICAgcmV0dXJuIFwic2VudGluZWxcIiBpbiBvYmplY3Q7XG4gICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgICAgIC8vIHJldHVybnMgZmFsc3lcbiAgICB9XG59XG5cbi8vIGNoZWNrIHdoZXRoZXIgZGVmaW5lUHJvcGVydHkgd29ya3MgaWYgaXQncyBnaXZlbi4gT3RoZXJ3aXNlLFxuLy8gc2hpbSBwYXJ0aWFsbHkuXG5pZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7XG4gICAgdmFyIGRlZmluZVByb3BlcnR5V29ya3NPbk9iamVjdCA9IGRvZXNEZWZpbmVQcm9wZXJ0eVdvcmsoe30pO1xuICAgIHZhciBkZWZpbmVQcm9wZXJ0eVdvcmtzT25Eb20gPSB0eXBlb2YgZG9jdW1lbnQgPT0gXCJ1bmRlZmluZWRcIiB8fFxuICAgICAgICBkb2VzRGVmaW5lUHJvcGVydHlXb3JrKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikpO1xuICAgIGlmICghZGVmaW5lUHJvcGVydHlXb3Jrc09uT2JqZWN0IHx8ICFkZWZpbmVQcm9wZXJ0eVdvcmtzT25Eb20pIHtcbiAgICAgICAgdmFyIGRlZmluZVByb3BlcnR5RmFsbGJhY2sgPSBPYmplY3QuZGVmaW5lUHJvcGVydHksXG4gICAgICAgICAgICBkZWZpbmVQcm9wZXJ0aWVzRmFsbGJhY2sgPSBPYmplY3QuZGVmaW5lUHJvcGVydGllcztcbiAgICB9XG59XG5cbmlmICghT2JqZWN0LmRlZmluZVByb3BlcnR5IHx8IGRlZmluZVByb3BlcnR5RmFsbGJhY2spIHtcbiAgICB2YXIgRVJSX05PTl9PQkpFQ1RfREVTQ1JJUFRPUiA9IFwiUHJvcGVydHkgZGVzY3JpcHRpb24gbXVzdCBiZSBhbiBvYmplY3Q6IFwiO1xuICAgIHZhciBFUlJfTk9OX09CSkVDVF9UQVJHRVQgPSBcIk9iamVjdC5kZWZpbmVQcm9wZXJ0eSBjYWxsZWQgb24gbm9uLW9iamVjdDogXCJcbiAgICB2YXIgRVJSX0FDQ0VTU09SU19OT1RfU1VQUE9SVEVEID0gXCJnZXR0ZXJzICYgc2V0dGVycyBjYW4gbm90IGJlIGRlZmluZWQgXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm9uIHRoaXMgamF2YXNjcmlwdCBlbmdpbmVcIjtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KG9iamVjdCwgcHJvcGVydHksIGRlc2NyaXB0b3IpIHtcbiAgICAgICAgaWYgKCh0eXBlb2Ygb2JqZWN0ICE9IFwib2JqZWN0XCIgJiYgdHlwZW9mIG9iamVjdCAhPSBcImZ1bmN0aW9uXCIpIHx8IG9iamVjdCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihFUlJfTk9OX09CSkVDVF9UQVJHRVQgKyBvYmplY3QpO1xuICAgICAgICB9XG4gICAgICAgIGlmICgodHlwZW9mIGRlc2NyaXB0b3IgIT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgZGVzY3JpcHRvciAhPSBcImZ1bmN0aW9uXCIpIHx8IGRlc2NyaXB0b3IgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRVJSX05PTl9PQkpFQ1RfREVTQ1JJUFRPUiArIGRlc2NyaXB0b3IpO1xuICAgICAgICB9XG4gICAgICAgIC8vIG1ha2UgYSB2YWxpYW50IGF0dGVtcHQgdG8gdXNlIHRoZSByZWFsIGRlZmluZVByb3BlcnR5XG4gICAgICAgIC8vIGZvciBJOCdzIERPTSBlbGVtZW50cy5cbiAgICAgICAgaWYgKGRlZmluZVByb3BlcnR5RmFsbGJhY2spIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZmluZVByb3BlcnR5RmFsbGJhY2suY2FsbChPYmplY3QsIG9iamVjdCwgcHJvcGVydHksIGRlc2NyaXB0b3IpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgICAgICAgICAgICAgLy8gdHJ5IHRoZSBzaGltIGlmIHRoZSByZWFsIG9uZSBkb2Vzbid0IHdvcmtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIGl0J3MgYSBkYXRhIHByb3BlcnR5LlxuICAgICAgICBpZiAob3ducyhkZXNjcmlwdG9yLCBcInZhbHVlXCIpKSB7XG4gICAgICAgICAgICAvLyBmYWlsIHNpbGVudGx5IGlmIFwid3JpdGFibGVcIiwgXCJlbnVtZXJhYmxlXCIsIG9yIFwiY29uZmlndXJhYmxlXCJcbiAgICAgICAgICAgIC8vIGFyZSByZXF1ZXN0ZWQgYnV0IG5vdCBzdXBwb3J0ZWRcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAvLyBhbHRlcm5hdGUgYXBwcm9hY2g6XG4gICAgICAgICAgICBpZiAoIC8vIGNhbid0IGltcGxlbWVudCB0aGVzZSBmZWF0dXJlczsgYWxsb3cgZmFsc2UgYnV0IG5vdCB0cnVlXG4gICAgICAgICAgICAgICAgIShvd25zKGRlc2NyaXB0b3IsIFwid3JpdGFibGVcIikgPyBkZXNjcmlwdG9yLndyaXRhYmxlIDogdHJ1ZSkgfHxcbiAgICAgICAgICAgICAgICAhKG93bnMoZGVzY3JpcHRvciwgXCJlbnVtZXJhYmxlXCIpID8gZGVzY3JpcHRvci5lbnVtZXJhYmxlIDogdHJ1ZSkgfHxcbiAgICAgICAgICAgICAgICAhKG93bnMoZGVzY3JpcHRvciwgXCJjb25maWd1cmFibGVcIikgPyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA6IHRydWUpXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgIFwiVGhpcyBpbXBsZW1lbnRhdGlvbiBvZiBPYmplY3QuZGVmaW5lUHJvcGVydHkgZG9lcyBub3QgXCIgK1xuICAgICAgICAgICAgICAgICAgICBcInN1cHBvcnQgY29uZmlndXJhYmxlLCBlbnVtZXJhYmxlLCBvciB3cml0YWJsZS5cIlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICBpZiAoc3VwcG9ydHNBY2Nlc3NvcnMgJiYgKGxvb2t1cEdldHRlcihvYmplY3QsIHByb3BlcnR5KSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb29rdXBTZXR0ZXIob2JqZWN0LCBwcm9wZXJ0eSkpKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIC8vIEFzIGFjY2Vzc29ycyBhcmUgc3VwcG9ydGVkIG9ubHkgb24gZW5naW5lcyBpbXBsZW1lbnRpbmdcbiAgICAgICAgICAgICAgICAvLyBgX19wcm90b19fYCB3ZSBjYW4gc2FmZWx5IG92ZXJyaWRlIGBfX3Byb3RvX19gIHdoaWxlIGRlZmluaW5nXG4gICAgICAgICAgICAgICAgLy8gYSBwcm9wZXJ0eSB0byBtYWtlIHN1cmUgdGhhdCB3ZSBkb24ndCBoaXQgYW4gaW5oZXJpdGVkXG4gICAgICAgICAgICAgICAgLy8gYWNjZXNzb3IuXG4gICAgICAgICAgICAgICAgdmFyIHByb3RvdHlwZSA9IG9iamVjdC5fX3Byb3RvX187XG4gICAgICAgICAgICAgICAgb2JqZWN0Ll9fcHJvdG9fXyA9IHByb3RvdHlwZU9mT2JqZWN0O1xuICAgICAgICAgICAgICAgIC8vIERlbGV0aW5nIGEgcHJvcGVydHkgYW55d2F5IHNpbmNlIGdldHRlciAvIHNldHRlciBtYXkgYmVcbiAgICAgICAgICAgICAgICAvLyBkZWZpbmVkIG9uIG9iamVjdCBpdHNlbGYuXG4gICAgICAgICAgICAgICAgZGVsZXRlIG9iamVjdFtwcm9wZXJ0eV07XG4gICAgICAgICAgICAgICAgb2JqZWN0W3Byb3BlcnR5XSA9IGRlc2NyaXB0b3IudmFsdWU7XG4gICAgICAgICAgICAgICAgLy8gU2V0dGluZyBvcmlnaW5hbCBgX19wcm90b19fYCBiYWNrIG5vdy5cbiAgICAgICAgICAgICAgICBvYmplY3QuX19wcm90b19fID0gcHJvdG90eXBlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvYmplY3RbcHJvcGVydHldID0gZGVzY3JpcHRvci52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghc3VwcG9ydHNBY2Nlc3NvcnMpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEVSUl9BQ0NFU1NPUlNfTk9UX1NVUFBPUlRFRCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBJZiB3ZSBnb3QgdGhhdCBmYXIgdGhlbiBnZXR0ZXJzIGFuZCBzZXR0ZXJzIGNhbiBiZSBkZWZpbmVkICEhXG4gICAgICAgICAgICBpZiAob3ducyhkZXNjcmlwdG9yLCBcImdldFwiKSkge1xuICAgICAgICAgICAgICAgIGRlZmluZUdldHRlcihvYmplY3QsIHByb3BlcnR5LCBkZXNjcmlwdG9yLmdldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3ducyhkZXNjcmlwdG9yLCBcInNldFwiKSkge1xuICAgICAgICAgICAgICAgIGRlZmluZVNldHRlcihvYmplY3QsIHByb3BlcnR5LCBkZXNjcmlwdG9yLnNldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9O1xufVxuXG4vLyBFUzUgMTUuMi4zLjdcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjIuMy43XG5pZiAoIU9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIHx8IGRlZmluZVByb3BlcnRpZXNGYWxsYmFjaykge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzID0gZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyhvYmplY3QsIHByb3BlcnRpZXMpIHtcbiAgICAgICAgLy8gbWFrZSBhIHZhbGlhbnQgYXR0ZW1wdCB0byB1c2UgdGhlIHJlYWwgZGVmaW5lUHJvcGVydGllc1xuICAgICAgICBpZiAoZGVmaW5lUHJvcGVydGllc0ZhbGxiYWNrKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJldHVybiBkZWZpbmVQcm9wZXJ0aWVzRmFsbGJhY2suY2FsbChPYmplY3QsIG9iamVjdCwgcHJvcGVydGllcyk7XG4gICAgICAgICAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICAgICAgICAgICAgICAvLyB0cnkgdGhlIHNoaW0gaWYgdGhlIHJlYWwgb25lIGRvZXNuJ3Qgd29ya1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gcHJvcGVydGllcykge1xuICAgICAgICAgICAgaWYgKG93bnMocHJvcGVydGllcywgcHJvcGVydHkpICYmIHByb3BlcnR5ICE9IFwiX19wcm90b19fXCIpIHtcbiAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCBwcm9wZXJ0eSwgcHJvcGVydGllc1twcm9wZXJ0eV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfTtcbn1cblxuLy8gRVM1IDE1LjIuMy44XG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS4yLjMuOFxuaWYgKCFPYmplY3Quc2VhbCkge1xuICAgIE9iamVjdC5zZWFsID0gZnVuY3Rpb24gc2VhbChvYmplY3QpIHtcbiAgICAgICAgLy8gdGhpcyBpcyBtaXNsZWFkaW5nIGFuZCBicmVha3MgZmVhdHVyZS1kZXRlY3Rpb24sIGJ1dFxuICAgICAgICAvLyBhbGxvd3MgXCJzZWN1cmFibGVcIiBjb2RlIHRvIFwiZ3JhY2VmdWxseVwiIGRlZ3JhZGUgdG8gd29ya2luZ1xuICAgICAgICAvLyBidXQgaW5zZWN1cmUgY29kZS5cbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9O1xufVxuXG4vLyBFUzUgMTUuMi4zLjlcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjIuMy45XG5pZiAoIU9iamVjdC5mcmVlemUpIHtcbiAgICBPYmplY3QuZnJlZXplID0gZnVuY3Rpb24gZnJlZXplKG9iamVjdCkge1xuICAgICAgICAvLyB0aGlzIGlzIG1pc2xlYWRpbmcgYW5kIGJyZWFrcyBmZWF0dXJlLWRldGVjdGlvbiwgYnV0XG4gICAgICAgIC8vIGFsbG93cyBcInNlY3VyYWJsZVwiIGNvZGUgdG8gXCJncmFjZWZ1bGx5XCIgZGVncmFkZSB0byB3b3JraW5nXG4gICAgICAgIC8vIGJ1dCBpbnNlY3VyZSBjb2RlLlxuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH07XG59XG5cbi8vIGRldGVjdCBhIFJoaW5vIGJ1ZyBhbmQgcGF0Y2ggaXRcbnRyeSB7XG4gICAgT2JqZWN0LmZyZWV6ZShmdW5jdGlvbiAoKSB7fSk7XG59IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICBPYmplY3QuZnJlZXplID0gKGZ1bmN0aW9uIGZyZWV6ZShmcmVlemVPYmplY3QpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGZyZWV6ZShvYmplY3QpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb2JqZWN0ID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBmcmVlemVPYmplY3Qob2JqZWN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KShPYmplY3QuZnJlZXplKTtcbn1cblxuLy8gRVM1IDE1LjIuMy4xMFxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuMi4zLjEwXG5pZiAoIU9iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucykge1xuICAgIE9iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucyA9IGZ1bmN0aW9uIHByZXZlbnRFeHRlbnNpb25zKG9iamVjdCkge1xuICAgICAgICAvLyB0aGlzIGlzIG1pc2xlYWRpbmcgYW5kIGJyZWFrcyBmZWF0dXJlLWRldGVjdGlvbiwgYnV0XG4gICAgICAgIC8vIGFsbG93cyBcInNlY3VyYWJsZVwiIGNvZGUgdG8gXCJncmFjZWZ1bGx5XCIgZGVncmFkZSB0byB3b3JraW5nXG4gICAgICAgIC8vIGJ1dCBpbnNlY3VyZSBjb2RlLlxuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH07XG59XG5cbi8vIEVTNSAxNS4yLjMuMTFcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjIuMy4xMVxuaWYgKCFPYmplY3QuaXNTZWFsZWQpIHtcbiAgICBPYmplY3QuaXNTZWFsZWQgPSBmdW5jdGlvbiBpc1NlYWxlZChvYmplY3QpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG59XG5cbi8vIEVTNSAxNS4yLjMuMTJcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjIuMy4xMlxuaWYgKCFPYmplY3QuaXNGcm96ZW4pIHtcbiAgICBPYmplY3QuaXNGcm96ZW4gPSBmdW5jdGlvbiBpc0Zyb3plbihvYmplY3QpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG59XG5cbi8vIEVTNSAxNS4yLjMuMTNcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjIuMy4xM1xuaWYgKCFPYmplY3QuaXNFeHRlbnNpYmxlKSB7XG4gICAgT2JqZWN0LmlzRXh0ZW5zaWJsZSA9IGZ1bmN0aW9uIGlzRXh0ZW5zaWJsZShvYmplY3QpIHtcbiAgICAgICAgLy8gMS4gSWYgVHlwZShPKSBpcyBub3QgT2JqZWN0IHRocm93IGEgVHlwZUVycm9yIGV4Y2VwdGlvbi5cbiAgICAgICAgaWYgKE9iamVjdChvYmplY3QpICE9PSBvYmplY3QpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTsgLy8gVE9ETyBtZXNzYWdlXG4gICAgICAgIH1cbiAgICAgICAgLy8gMi4gUmV0dXJuIHRoZSBCb29sZWFuIHZhbHVlIG9mIHRoZSBbW0V4dGVuc2libGVdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBPLlxuICAgICAgICB2YXIgbmFtZSA9ICcnO1xuICAgICAgICB3aGlsZSAob3ducyhvYmplY3QsIG5hbWUpKSB7XG4gICAgICAgICAgICBuYW1lICs9ICc/JztcbiAgICAgICAgfVxuICAgICAgICBvYmplY3RbbmFtZV0gPSB0cnVlO1xuICAgICAgICB2YXIgcmV0dXJuVmFsdWUgPSBvd25zKG9iamVjdCwgbmFtZSk7XG4gICAgICAgIGRlbGV0ZSBvYmplY3RbbmFtZV07XG4gICAgICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgICB9O1xufVxuXG59KTtcbiIsInZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG4vKipcbiAqIEBsaWNlbnNlIGh0dHBzOi8vcmF3LmdpdGh1Yi5jb20vam95ZW50L25vZGUvdjAuMTAuMTEvTElDRU5TRVxuICogTm9kZSBqcyBsaWNlbnNlLiBFdmVudEVtaXR0ZXIgd2lsbCBiZSBpbiB0aGUgY2xpZW50XG4gKiBvbmx5IGNvZGUuXG4gKi9cbi8qKlxuICogQGNsYXNzIEx1Yy5FdmVudEVtaXR0ZXJcbiAqIFRoZSB3b25kZXJmdWwgZXZlbnQgZW1taXRlciB0aGF0IGNvbWVzIHdpdGggbm9kZSxcbiAqIHRoYXQgd29ya3MgaW4gdGhlIHN1cHBvcnRlZCBicm93c2Vycy5cbiAqIFtodHRwOi8vbm9kZWpzLm9yZy9hcGkvZXZlbnRzLmh0bWxdKGh0dHA6Ly9ub2RlanMub3JnL2FwaS9ldmVudHMuaHRtbClcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgICAvL3B1dCBpbiBmaXggZm9yIElFIDkgYW5kIGJlbG93XG4gICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICBnID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzZWxmLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuICAgICAgICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcblxuICAgIHNlbGYub24odHlwZSwgZyk7XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyOyIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnByb2Nlc3MubmV4dFRpY2sgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYW5TZXRJbW1lZGlhdGUgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5zZXRJbW1lZGlhdGU7XG4gICAgdmFyIGNhblBvc3QgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5wb3N0TWVzc2FnZSAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lclxuICAgIDtcblxuICAgIGlmIChjYW5TZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiB3aW5kb3cuc2V0SW1tZWRpYXRlKGYpIH07XG4gICAgfVxuXG4gICAgaWYgKGNhblBvc3QpIHtcbiAgICAgICAgdmFyIHF1ZXVlID0gW107XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICBpZiAoZXYuc291cmNlID09PSB3aW5kb3cgJiYgZXYuZGF0YSA9PT0gJ3Byb2Nlc3MtdGljaycpIHtcbiAgICAgICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBpZiAocXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZm4gPSBxdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICBmbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgICAgICBxdWV1ZS5wdXNoKGZuKTtcbiAgICAgICAgICAgIHdpbmRvdy5wb3N0TWVzc2FnZSgncHJvY2Vzcy10aWNrJywgJyonKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgc2V0VGltZW91dChmbiwgMCk7XG4gICAgfTtcbn0pKCk7XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn1cblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuIiwidmFyIHByb2Nlc3M9cmVxdWlyZShcIl9fYnJvd3NlcmlmeV9wcm9jZXNzXCIpO2lmICghcHJvY2Vzcy5FdmVudEVtaXR0ZXIpIHByb2Nlc3MuRXZlbnRFbWl0dGVyID0gZnVuY3Rpb24gKCkge307XG5cbnZhciBFdmVudEVtaXR0ZXIgPSBleHBvcnRzLkV2ZW50RW1pdHRlciA9IHByb2Nlc3MuRXZlbnRFbWl0dGVyO1xudmFyIGlzQXJyYXkgPSB0eXBlb2YgQXJyYXkuaXNBcnJheSA9PT0gJ2Z1bmN0aW9uJ1xuICAgID8gQXJyYXkuaXNBcnJheVxuICAgIDogZnVuY3Rpb24gKHhzKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeHMpID09PSAnW29iamVjdCBBcnJheV0nXG4gICAgfVxuO1xuZnVuY3Rpb24gaW5kZXhPZiAoeHMsIHgpIHtcbiAgICBpZiAoeHMuaW5kZXhPZikgcmV0dXJuIHhzLmluZGV4T2YoeCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoeCA9PT0geHNbaV0pIHJldHVybiBpO1xuICAgIH1cbiAgICByZXR1cm4gLTE7XG59XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW5cbi8vIDEwIGxpc3RlbmVycyBhcmUgYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaFxuLy8gaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG4vL1xuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbnZhciBkZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCF0aGlzLl9ldmVudHMpIHRoaXMuX2V2ZW50cyA9IHt9O1xuICB0aGlzLl9ldmVudHMubWF4TGlzdGVuZXJzID0gbjtcbn07XG5cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNBcnJheSh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSlcbiAgICB7XG4gICAgICBpZiAoYXJndW1lbnRzWzFdIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgYXJndW1lbnRzWzFdOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5jYXVnaHQsIHVuc3BlY2lmaWVkICdlcnJvcicgZXZlbnQuXCIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGlmICghdGhpcy5fZXZlbnRzKSByZXR1cm4gZmFsc2U7XG4gIHZhciBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBpZiAoIWhhbmRsZXIpIHJldHVybiBmYWxzZTtcblxuICBpZiAodHlwZW9mIGhhbmRsZXIgPT0gJ2Z1bmN0aW9uJykge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuXG4gIH0gZWxzZSBpZiAoaXNBcnJheShoYW5kbGVyKSkge1xuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICAgIHZhciBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBsaXN0ZW5lcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59O1xuXG4vLyBFdmVudEVtaXR0ZXIgaXMgZGVmaW5lZCBpbiBzcmMvbm9kZV9ldmVudHMuY2Ncbi8vIEV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCgpIGlzIGFsc28gZGVmaW5lZCB0aGVyZS5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIGxpc3RlbmVyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdhZGRMaXN0ZW5lciBvbmx5IHRha2VzIGluc3RhbmNlcyBvZiBGdW5jdGlvbicpO1xuICB9XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT0gXCJuZXdMaXN0ZW5lcnNcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJzXCIuXG4gIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pIHtcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgfSBlbHNlIGlmIChpc0FycmF5KHRoaXMuX2V2ZW50c1t0eXBlXSkpIHtcblxuICAgIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gICAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgICB2YXIgbTtcbiAgICAgIGlmICh0aGlzLl9ldmVudHMubWF4TGlzdGVuZXJzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbSA9IHRoaXMuX2V2ZW50cy5tYXhMaXN0ZW5lcnM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtID0gZGVmYXVsdE1heExpc3RlbmVycztcbiAgICAgIH1cblxuICAgICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHNlbGYub24odHlwZSwgZnVuY3Rpb24gZygpIHtcbiAgICBzZWxmLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0pO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICgnZnVuY3Rpb24nICE9PSB0eXBlb2YgbGlzdGVuZXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3JlbW92ZUxpc3RlbmVyIG9ubHkgdGFrZXMgaW5zdGFuY2VzIG9mIEZ1bmN0aW9uJyk7XG4gIH1cblxuICAvLyBkb2VzIG5vdCB1c2UgbGlzdGVuZXJzKCksIHNvIG5vIHNpZGUgZWZmZWN0IG9mIGNyZWF0aW5nIF9ldmVudHNbdHlwZV1cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSkgcmV0dXJuIHRoaXM7XG5cbiAgdmFyIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzQXJyYXkobGlzdCkpIHtcbiAgICB2YXIgaSA9IGluZGV4T2YobGlzdCwgbGlzdGVuZXIpO1xuICAgIGlmIChpIDwgMCkgcmV0dXJuIHRoaXM7XG4gICAgbGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgaWYgKGxpc3QubGVuZ3RoID09IDApXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICB9IGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSA9PT0gbGlzdGVuZXIpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGRvZXMgbm90IHVzZSBsaXN0ZW5lcnMoKSwgc28gbm8gc2lkZSBlZmZlY3Qgb2YgY3JlYXRpbmcgX2V2ZW50c1t0eXBlXVxuICBpZiAodHlwZSAmJiB0aGlzLl9ldmVudHMgJiYgdGhpcy5fZXZlbnRzW3R5cGVdKSB0aGlzLl9ldmVudHNbdHlwZV0gPSBudWxsO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICBpZiAoIXRoaXMuX2V2ZW50cykgdGhpcy5fZXZlbnRzID0ge307XG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKSB0aGlzLl9ldmVudHNbdHlwZV0gPSBbXTtcbiAgaWYgKCFpc0FycmF5KHRoaXMuX2V2ZW50c1t0eXBlXSkpIHtcbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgfVxuICByZXR1cm4gdGhpcy5fZXZlbnRzW3R5cGVdO1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghZW1pdHRlci5fZXZlbnRzIHx8ICFlbWl0dGVyLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gMDtcbiAgZWxzZSBpZiAodHlwZW9mIGVtaXR0ZXIuX2V2ZW50c1t0eXBlXSA9PT0gJ2Z1bmN0aW9uJylcbiAgICByZXQgPSAxO1xuICBlbHNlXG4gICAgcmV0ID0gZW1pdHRlci5fZXZlbnRzW3R5cGVdLmxlbmd0aDtcbiAgcmV0dXJuIHJldDtcbn07XG4iLCJ2YXIgb2JqID0gcmVxdWlyZSgnLi4vb2JqZWN0JyksXG4gICAgYXJyYXkgPSByZXF1aXJlKCcuLi9hcnJheScpLFxuICAgIGFwcGx5ID0gb2JqLmFwcGx5LFxuICAgIG1peCA9IG9iai5taXgsXG4gICAgb0ZpbHRlciA9IG9iai5maWx0ZXIsXG4gICAgZW1wdHlGbiA9ICgnLi4vZnVuY3Rpb24nKS5lbXB0eUZuLFxuICAgIGlzID0gcmVxdWlyZSgnLi4vaXMnKTtcblxuLyoqXG4gKiBAY2xhc3MgIEx1Yy5Db21wb3NpdGlvblxuICogQHByb3RlY3RlZFxuICogQ2xhc3MgdGhhdCB3cmFwcyB7QGxpbmsgTHVjLmRlZmluZSMkY29tcG9zaXRpb25zIGNvbXBvc2l0aW9ufSBjb25maWcgb2JqZWN0c1xuICogdG8gY29uZm9ybSB0byBhbiBhcGkuIFRoaXMgY2xhc3MgaXMgbm90IGF2YWlsYWJsZSBleHRlcm5hbGx5LiAgVGhlIGNvbmZpZyBvYmplY3RcbiAqIHdpbGwgb3ZlcnJpZGUgYW55IHByb3RlY3RlZCBtZXRob2RzIGFuZCBkZWZhdWx0IGNvbmZpZ3MuICBEZWZhdWx0c1xuICogY2FuIGJlIHVzZWQgZm9yIG9mdGVuIHVzZWQgY29uZmlncywga2V5cyB0aGF0IGFyZSBub3QgZGVmYXVsdHMgd2lsbFxuICogb3ZlcnJpZGUgdGhlIGRlZmF1bHRzLlxuICpcbiAgICB2YXIgQyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICAkY29tcG9zaXRpb25zOiB7XG4gICAgICAgICAgICBkZWZhdWx0czogTHVjLmNvbXBvc2l0aW9uRW51bXMuRXZlbnRFbWl0dGVyLFxuICAgICAgICAgICAgbWV0aG9kczogWydlbWl0J11cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIGMgPSBuZXcgQygpXG4gICAgdHlwZW9mIGMuZW1pdFxuICAgID5cImZ1bmN0aW9uXCJcbiAgICB0eXBlb2YgYy5vblxuICAgID5cInVuZGVmaW5lZFwiXG4gKlxuICogSWYgeW91IHdhbnQgdG8gYWRkIHlvdXIgb3duIGNvbXBvc2l0aW9uIGFsbCB5b3UgbmVlZCB0byBoYXZlIGlzXG4gKiBhIG5hbWUgYW5kIGEgQ29uc3RydWN0b3IsIHRoZSByZXN0IG9mIHRoZSBjb25maWdzIG9mIHRoaXMgY2xhc3MgYW5kIEx1Yy5Db21wb3NpdGlvbi5jcmVhdGVcbiAqIGNhbiBiZSB1c2VkIHRvIGluamVjdCBiZWhhdmlvciBpZiBuZWVkZWQuXG4gKiBcbiAgICAgZnVuY3Rpb24gQ291bnRlcigpIHtcbiAgICAgICAgdGhpcy5jb3VudCA9IDA7XG4gICAgIH07XG5cbiAgICAgQ291bnRlci5wcm90b3R5cGUgPSB7XG4gICAgICAgIGdldENvdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvdW50O1xuICAgICAgICB9LFxuICAgICAgICBpbmNyZWFzZUNvdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuY291bnQrKztcbiAgICAgICAgfVxuICAgICB9XG5cbiAgICAgdmFyIEMgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgICAgICRjb21wb3NpdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnY291bnRlcicsXG4gICAgICAgICAgICAgICAgQ29uc3RydWN0b3I6IENvdW50ZXIsXG4gICAgICAgICAgICAgICAgbWV0aG9kczogJ2FsbE1ldGhvZHMnXG4gICAgICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB2YXIgYyA9IG5ldyBDKClcblxuICAgIGMuaW5jcmVhc2VDb3VudCgpO1xuICAgIGMuaW5jcmVhc2VDb3VudCgpO1xuICAgIGMuaW5jcmVhc2VDb3VudCgpO1xuICAgIGMuZ2V0Q291bnQoKTtcbiAgICA+M1xuICAgIGMuY291bnRcbiAgICA+dW5kZWZpbmVkXG4gKi9cbmZ1bmN0aW9uIENvbXBvc2l0aW9uKGMpIHtcbiAgICB2YXIgZGVmYXVsdHMgPSBjLmRlZmF1bHRzLFxuICAgICAgICBjb25maWcgPSBjO1xuXG4gICAgaWYoZGVmYXVsdHMpIHtcbiAgICAgICAgbWl4KGNvbmZpZywgY29uZmlnLmRlZmF1bHRzKTtcbiAgICAgICAgZGVsZXRlIGNvbmZpZy5kZWZhdWx0cztcbiAgICB9XG5cbiAgICBhcHBseSh0aGlzLCBjb25maWcpO1xufVxuXG5Db21wb3NpdGlvbi5wcm90b3R5cGUgPSB7XG4gICAgLyoqXG4gICAgICogQGNmZyB7U3RyaW5nfSBuYW1lIChyZXF1aXJlZCkgdGhlIG5hbWUgd2hpY2ggdGhlIGNvbXBvc2l0aW9uXG4gICAgICogd2lsbCBiZSByZWZlcnJlZCB0byBieSB0aGUgaW5zdGFuY2UuXG4gICAgICovXG4gICAgXG4gICAgLyoqXG4gICAgICogQGNmZyB7T2JqZWN0fSBkZWZhdWx0c1xuICAgICAqL1xuICAgIFxuICAgIC8qKlxuICAgICAqIEBjZmcge0Jvb2xlYW59IGluaXRBZnRlciAgZGVmYXVsdHMgdG8gZmFsc2VcbiAgICAgKiBwYXNzIGluIHRydWUgdG8gaW5pdCB0aGUgY29tcG9zaXRpb24gaW5zdGFuY2UgYWZ0ZXIgdGhlIFxuICAgICAqIHN1cGVyY2xhc3MgaGFzIGJlZW4gY2FsbGVkLlxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogQGNmZyB7RnVuY3Rpb259IENvbnN0cnVjdG9yIChyZXF1aXJlZCkgdGhlIENvbnN0cnVjdG9yXG4gICAgICogdG8gdXNlIHdoZW4gY3JlYXRpbmcgdGhlIGNvbXBvc2l0aW9uIGluc3RhbmNlLiAgVGhpc1xuICAgICAqIGlzIHJlcXVpcmVkIGlmIEx1Yy5Db21wb3NpdGlvbi5jcmVhdGUgaXMgbm90IG92ZXJ3cml0dGVuIGJ5XG4gICAgICogdGhlIHBhc3NlZCBpbiBjb21wb3NpdGlvbiBjb25maWcgb2JqZWN0LlxuICAgICAqL1xuICAgIFxuICAgIC8qKlxuICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgKiBCeSBkZWZhdWx0IGp1c3QgcmV0dXJuIGEgbmV3bHkgY3JlYXRlZCBDb25zdHJ1Y3RvciBpbnN0YW5jZS5cbiAgICAgKiBcbiAgICAgKiBXaGVuIGNyZWF0ZSBpcyBjYWxsZWQgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzIGNhbiBiZSB1c2VkIDpcbiAgICAgKiBcbiAgICAgKiB0aGlzLmluc3RhbmNlIFRoZSBpbnN0YW5jZSB0aGF0IGlzIGNyZWF0aW5nXG4gICAgICogdGhlIGNvbXBvc2l0aW9uLlxuICAgICAqIFxuICAgICAqIHRoaXMuQ29uc3RydWN0b3IgdGhlIGNvbnN0cnVjdG9yIHRoYXQgaXMgcGFzc2VkIGluIGZyb21cbiAgICAgKiB0aGUgY29tcG9zaXRpb24gY29uZmlnLiBcbiAgICAgKlxuICAgICAqIHRoaXMuaW5zdGFuY2VBcmdzIHRoZSBhcmd1bWVudHMgcGFzc2VkIGludG8gdGhlIGluc3RhbmNlIHdoZW4gaXQgXG4gICAgICogaXMgYmVpbmcgY3JlYXRlZC4gIEZvciBleGFtcGxlXG5cbiAgICAgICAgbmV3IE15Q2xhc3NXaXRoQUNvbXBvc2l0aW9uKHtwbHVnaW5zOiBbXX0pXG4gICAgICAgIC8vaW5zaWRlIG9mIHRoZSBjcmVhdGUgbWV0aG9kXG4gICAgICAgIHRoaXMuaW5zdGFuY2VBcmdzXG4gICAgICAgID5be3BsdWdpbnM6IFtdfV1cblxuICAgICAqIEByZXR1cm4ge09iamVjdH0gXG4gICAgICogdGhlIGNvbXBvc2l0aW9uIGluc3RhbmNlLlxuICAgICAqXG4gICAgICogRm9yIGV4YW1wbGUgc2V0IHRoZSBlbWl0dGVycyBtYXhMaXN0ZW5lcnNcbiAgICAgKiB0byB3aGF0IHRoZSBpbnN0YW5jZSBoYXMgY29uZmlnZWQuXG4gICAgICBcbiAgICAgICAgbWF4TGlzdGVuZXJzOiAxMDAsXG4gICAgICAgICRjb21wb3NpdGlvbnM6IHtcbiAgICAgICAgICAgIENvbnN0cnVjdG9yOiBMdWMuRXZlbnRFbWl0dGVyLFxuICAgICAgICAgICAgY3JlYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgZW1pdHRlciA9IG5ldyB0aGlzLkNvbnN0cnVjdG9yKCk7XG4gICAgICAgICAgICAgICAgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnModGhpcy5pbnN0YW5jZS5tYXhMaXN0ZW5lcnMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBlbWl0dGVyO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG5hbWU6ICdlbWl0dGVyJ1xuICAgICAgICB9XG5cbiAgICAgKi9cbiAgICBjcmVhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbmV3IHRoaXMuQ29uc3RydWN0b3IoKTtcbiAgICB9LFxuXG4gICAgZ2V0SW5zdGFuY2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGUoKTtcbiAgICB9LFxuXG4gICAgdmFsaWRhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZih0aGlzLm5hbWUgID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQSBuYW1lIG11c3QgYmUgZGVmaW5lZCcpO1xuICAgICAgICB9XG4gICAgICAgIGlmKCFpcy5pc0Z1bmN0aW9uKHRoaXMuQ29uc3RydWN0b3IpICYmIHRoaXMuY3JlYXRlID09PSBDb21wb3NpdGlvbi5wcm90b3R5cGUuY3JlYXRlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBDb25zdHJ1Y3RvciBtdXN0IGJlIGZ1bmN0aW9uIGlmIGNyZWF0ZSBpcyBub3Qgb3ZlcnJpZGRlbicpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSBmaWx0ZXJNZXRob2RGbnNcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBwcm9wZXJ0eSBmaWx0ZXJNZXRob2RGbnMuYWxsTWV0aG9kcyByZXR1cm4gYWxsIG1ldGhvZHMgZnJvbSB0aGVcbiAgICAgKiBjb25zdHJ1Y3RvcnMgcHJvdG90eXBlXG4gICAgICogQHByb3BlcnR5IGZpbHRlck1ldGhvZEZucy5wdWJsaWMgcmV0dXJuIGFsbCBtZXRob2RzIHRoYXQgZG9uJ3RcbiAgICAgKiBzdGFydCB3aXRoIF8uICBXZSBrbm93IG5vdCBldmVyeW9uZSBmb2xsb3dzIHRoaXMgY29udmVudGlvbiwgYnV0IHdlXG4gICAgICogZG8gYW5kIHNvIGRvIG1hbnkgb3RoZXJzLlxuICAgICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICAgKi9cbiAgICBmaWx0ZXJNZXRob2RGbnM6IHtcbiAgICAgICAgYWxsTWV0aG9kczogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGlzLmlzRnVuY3Rpb24odmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBwdWJsaWNNZXRob2RzOiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gaXMuaXNGdW5jdGlvbih2YWx1ZSkgJiYga2V5LmNoYXJBdCgwKSAhPT0gJ18nO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBjZmcge0Z1bmN0aW9uL1N0cmluZy9BcnJheVtdfSBtZXRob2RzXG4gICAgICogVGhlIGtleXMgdG8gYWRkIHRvIHRoZSBkZWZpbmVycyBwcm90b3R5cGUgdGhhdCB3aWxsIGluIHR1cm4gY2FsbFxuICAgICAqIHRoZSBjb21wb3NpdGlvbnMgbWV0aG9kLlxuICAgICAqIFxuICAgICAqIERlZmF1bHRzIHRvIEx1Yy5lbXB0eUZuLiBcbiAgICAgKiBJZiBhbiBhcnJheSBpcyBwYXNzZWQgaXQgd2lsbCBqdXN0IHVzZSB0aGF0IEFycmF5LlxuICAgICAqIFxuICAgICAqIElmIGEgc3RyaW5nIGlzIHBhc3NlZCBhbmQgbWF0Y2hlcyBhIG1ldGhvZCBmcm9tIFxuICAgICAqIEx1Yy5Db21wb3NpdGlvbi5maWx0ZXJNZXRob2RGbnMgaXQgd2lsbCBjYWxsIHRoYXQgaW5zdGVhZC5cbiAgICAgKiBcbiAgICAgKiBJZiBhIGZ1bmN0aW9uIGlzIGRlZmluZWQgaXRcbiAgICAgKiB3aWxsIGdldCBjYWxsZWQgd2hpbGUgaXRlcmF0aW5nIG92ZXIgZWFjaCBrZXkgdmFsdWUgcGFpciBvZiB0aGUgXG4gICAgICogQ29uc3RydWN0b3IncyBwcm90b3R5cGUsIGlmIGEgdHJ1dGh5IHZhbHVlIGlzIFxuICAgICAqIHJldHVybmVkIHRoZSBwcm9wZXJ0eSB3aWxsIGJlIGFkZGVkIHRvIHRoZSBkZWZpbmluZ1xuICAgICAqIGNsYXNzZXMgcHJvdG90eXBlLlxuICAgICAqIFxuICAgICAqIEZvciBleGFtcGxlIHRoaXMgY29uZmlnIHdpbGwgb25seSBleHBvc2UgdGhlIGVtaXQgbWV0aG9kIFxuICAgICAqIHRvIHRoZSBkZWZpbmluZyBjbGFzc1xuICAgICBcbiAgICAgICAgJGNvbXBvc2l0aW9uczoge1xuICAgICAgICAgICAgQ29uc3RydWN0b3I6IEx1Yy5FdmVudEVtaXR0ZXIsXG4gICAgICAgICAgICBtZXRob2RzOiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGtleSA9PT0gJ2VtaXQnO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG5hbWU6ICdlbWl0dGVyJ1xuICAgICAgICB9XG4gICAgICogdGhpcyBpcyBhbHNvIGEgdmFsaWQgY29uZmlnXG4gICAgICogXG4gICAgICAgICRjb21wb3NpdGlvbnM6IHtcbiAgICAgICAgICAgIENvbnN0cnVjdG9yOiBMdWMuRXZlbnRFbWl0dGVyLFxuICAgICAgICAgICAgbWV0aG9kczogWydlbWl0dGVyJ10sXG4gICAgICAgICAgICBuYW1lOiAnZW1pdHRlcidcbiAgICAgICAgfVxuICAgICAqIFxuICAgICAqL1xuICAgIG1ldGhvZHM6IGVtcHR5Rm4sXG5cbiAgICAvKipcbiAgICAgKiBAY2ZnIHtTdHJpbmdbXS9TdHJpbmd9IGlnbm9yZU1ldGhvZHMgbWV0aG9kcyB0aGF0IHdpbGwgYWx3YXlzXG4gICAgICogYmUgaWdub3JlZCBpZiBtZXRob2RzIGlzIG5vdCBhbiBBcnJheS5cbiAgICAgKlxuICAgICAgICBcbiAgICAgICAgdmFyIEMgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgICAgICAgICAkY29tcG9zaXRpb25zOiB7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHRzOiBMdWMuY29tcG9zaXRpb25FbnVtcy5FdmVudEVtaXR0ZXIsXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZHM6ICdhbGxNZXRob2RzJyxcbiAgICAgICAgICAgICAgICAgICAgaWdub3JlTWV0aG9kczogWydlbWl0J11cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIGMgPSBuZXcgQygpO1xuICAgICAgICAgICAgdHlwZW9mIGMuZW1pdFxuICAgICAgICAgICAgPlwidW5kZWZpbmVkXCJcbiAgICAgKi9cbiAgICBpZ25vcmVNZXRob2RzOiB1bmRlZmluZWQsXG5cbiAgICBnZXRPYmplY3RXaXRoTWV0aG9kczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtZXRob2RzT2JqID0gdGhpcy5Db25zdHJ1Y3RvciAmJiB0aGlzLkNvbnN0cnVjdG9yLnByb3RvdHlwZTtcbiAgICAgICAgaWYgKHRoaXMuaWdub3JlTWV0aG9kcykge1xuICAgICAgICAgICAgbWV0aG9kc09iaiA9IGFwcGx5KHt9LCBtZXRob2RzT2JqKTtcbiAgICAgICAgICAgIGFycmF5LmVhY2godGhpcy5pZ25vcmVNZXRob2RzLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBtZXRob2RzT2JqW3ZhbHVlXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1ldGhvZHNPYmo7XG4gICAgfSxcblxuICAgIGdldE1ldGhvZHNUb0NvbXBvc2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbWV0aG9kcyA9IHRoaXMubWV0aG9kcyxcbiAgICAgICAgICAgIGZpbHRlckZuO1xuICAgICAgICAgICAgXG4gICAgICAgIGlmIChpcy5pc0FycmF5KG1ldGhvZHMpKSB7XG4gICAgICAgICAgICByZXR1cm4gbWV0aG9kcztcbiAgICAgICAgfVxuXG4gICAgICAgIGZpbHRlckZuID0gbWV0aG9kcztcblxuICAgICAgICBpZiAoaXMuaXNTdHJpbmcobWV0aG9kcykpIHtcbiAgICAgICAgICAgIGZpbHRlckZuID0gdGhpcy5maWx0ZXJNZXRob2RGbnNbbWV0aG9kc107XG4gICAgICAgIH1cblxuICAgICAgICAvL0NvbnN0cnVjdG9ycyBhcmUgbm90IG5lZWRlZCBpZiBjcmVhdGUgaXMgb3ZlcndyaXR0ZW5cbiAgICAgICAgcmV0dXJuIG9GaWx0ZXIodGhpcy5nZXRPYmplY3RXaXRoTWV0aG9kcygpLCBmaWx0ZXJGbiwgdGhpcywge1xuICAgICAgICAgICAgb3duUHJvcGVydGllczogZmFsc2UsXG4gICAgICAgICAgICBrZXlzOiB0cnVlXG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ29tcG9zaXRpb247Il19
;