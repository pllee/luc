;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
var Luc = {},
    isBrowser = false;

if(typeof window !== 'undefined') {
    isBrowser = true;
}
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


if(isBrowser) {
    window.Luc = Luc;
}

/**
 * @member Luc
 * @method addSubmodule
 * Method used by submodule authors to add their module into Luc.
 * By default the submodule will only be added to Luc if Luc is in
 * the context of a browser.  Node already has a nice module system.  
 * This behavior can be overridden by setting
 * Luc.alwaysAddSubmodule to true.
 *
 * @param {String} namespace the namespace of the submodule
 * @param {Object} obj the object  to add to the namespace.  If keys already exist in
 * the namespace they will not be overwritten.
 *
    function Tooltip() {}
    var coolTooltip =  {Tooltip: Tooltip};
    Luc.addSubmodule('ui', coolTooltip);
    Luc.ui.Tooltip;
    >function Tooltip() {}

    *use another submodule
    
    Luc.addSubmodule('ui', {SomeonesObject: {a:true}});
    Luc.ui.Tooltip;
    >function Tooltip() {}
    Luc.ui.SomeonesObject;
    >{a:true}
 */
Luc.addSubmodule = function(namespace, obj) {
    var toAdd;
    if (Luc.alwaysAddSubmodule || isBrowser) {
        toAdd = {};
        toAdd[namespace] = obj;
        Luc.Object.merge(Luc, toAdd);
    }
};
},{"./array":4,"./arrayFnGenerator":5,"./class/base":7,"./class/compositionEnums":12,"./class/definer":9,"./class/plugin":10,"./class/pluginManager":11,"./compare":13,"./events/eventEmitter":8,"./function":2,"./id":14,"./is":6,"./object":3}],6:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
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
},{"./array":4,"./is":6}],3:[function(require,module,exports){
var is = require('./is');

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

/**
 * Merge the values from object2 into object1.  The values will only be
 * merged in if object1's value for the key is null or undefined.  Nested objects
 * are handled in the same way.  Array values will not be merged.
 * 
    Luc.Object.merge({a: 1}, {b: 2})
    >{a: 1, b: 2}
    
    Luc.Object.merge({a: {a: 1} }, {b:2, a: {b: 2}})
    >{b: 2, a: {a:1, b:2} }

 * @param  {Object} object1
 * @param  {Object} object2
 * @return {Object}
 */
function merge(obj1, obj2) {
    exports.each(obj2, function(key, value) {
        var obj1Value = obj1[key];
        if (obj1Value == undefined) {
            obj1[key] = value;
        } else if (is.isObject(obj1Value)) {
            merge(obj1[key], obj2[key]);
        }
    });

    return obj1;
}

exports.merge = merge;
},{"./is":6}],4:[function(require,module,exports){
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
},{"../function":2,"../object":3}],9:[function(require,module,exports){
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
        var proto,
            superObj;

        //super can be falsy to signify no superclass
        if ($super) {
            superObj = {
                $super: $super,
                $superclass: $super.prototype
            };

            proto = $class.prototype;

            apply(proto, superObj);
            apply($class, superObj);

            this._addSuperMethod(proto);
        }
    },

    _addSuperMethod: function(proto) {

        function getSuperMethod(callee, sp) {
            var $super = sp || proto;

            //we could be caching this here on the fn
            //but then devs would have to know the edge cases
            //of how to invalidate it
            for (var key in $super) {
                if($super[key] === callee) {
                    return $super.$superclass[key];
                }
            }
            return getSuperMethod(callee, $super.$superclass);
        }

        function callSuper(args) {
            var superMethod = getSuperMethod(callSuper.caller);

            if(superMethod) {
                return superMethod.apply(this, args);
            }

            throw new Error('super method not found.');
            
        }

        proto.callSuper = callSuper;
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
},{"../array":4,"../function":2,"../is":6,"../object":3,"./base":7,"./composition":15}],10:[function(require,module,exports){
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

},{"../array":4,"../function":2,"../object":3}],11:[function(require,module,exports){
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
},{"../array":4,"../is":6,"../object":3,"./plugin":10}],12:[function(require,module,exports){
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
},{"../events/eventEmitter":8,"./pluginManager":11}],8:[function(require,module,exports){
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
},{"events":16}],17:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

},{"__browserify_process":17}],15:[function(require,module,exports){
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
},{"../array":4,"../is":6,"../object":3}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvbHVjLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2lzLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2lkLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2Z1bmN0aW9uLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL29iamVjdC5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9hcnJheS5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9hcnJheUZuR2VuZXJhdG9yLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2NvbXBhcmUuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvY2xhc3MvYmFzZS5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9jbGFzcy9kZWZpbmVyLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2NsYXNzL3BsdWdpbi5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9jbGFzcy9wbHVnaW5NYW5hZ2VyLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2NsYXNzL2NvbXBvc2l0aW9uRW51bXMuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvZXZlbnRzL2V2ZW50RW1pdHRlci5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9pbnNlcnQtbW9kdWxlLWdsb2JhbHMvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLWJ1aWx0aW5zL2J1aWx0aW4vZXZlbnRzLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2NsYXNzL2NvbXBvc2l0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdk5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdjNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbE1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgTHVjID0ge30sXG4gICAgaXNCcm93c2VyID0gZmFsc2U7XG5cbmlmKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaXNCcm93c2VyID0gdHJ1ZTtcbn1cbi8qKlxuICogQGNsYXNzIEx1Y1xuICogQWxpYXNlcyBmb3IgY29tbW9uIEx1YyBtZXRob2RzIGFuZCBwYWNrYWdlcy4gIENoZWNrIG91dCBMdWMuZGVmaW5lXG4gKiB0byBsb29rIGF0IHRoZSBjbGFzcyBzeXN0ZW0gTHVjIHByb3ZpZGVzLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IEx1YztcblxudmFyIG9iamVjdCA9IHJlcXVpcmUoJy4vb2JqZWN0Jyk7XG5MdWMuT2JqZWN0ID0gb2JqZWN0O1xuLyoqXG4gKiBAbWVtYmVyIEx1Y1xuICogQHByb3BlcnR5IE8gTHVjLk9cbiAqIEFsaWFzIGZvciBMdWMuT2JqZWN0XG4gKi9cbkx1Yy5PID0gb2JqZWN0O1xuXG5cbi8qKlxuICogQG1lbWJlciBMdWNcbiAqIEBtZXRob2QgYXBwbHlcbiAqIEBpbmhlcml0ZG9jIEx1Yy5PYmplY3QjYXBwbHlcbiAqL1xuTHVjLmFwcGx5ID0gTHVjLk9iamVjdC5hcHBseTtcblxuLyoqXG4gKiBAbWVtYmVyIEx1Y1xuICogQG1ldGhvZCBtaXhcbiAqIEBpbmhlcml0ZG9jIEx1Yy5PYmplY3QjbWl4XG4gKi9cbkx1Yy5taXggPSBMdWMuT2JqZWN0Lm1peDtcblxuXG52YXIgZnVuID0gcmVxdWlyZSgnLi9mdW5jdGlvbicpO1xuTHVjLkZ1bmN0aW9uID0gZnVuO1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjXG4gKiBAcHJvcGVydHkgRiBMdWMuRlxuICogQWxpYXMgZm9yIEx1Yy5GdW5jdGlvblxuICovXG5MdWMuRiA9IGZ1bjtcblxuLyoqXG4gKiBAbWVtYmVyIEx1Y1xuICogQG1ldGhvZCBlbXB0eUZuXG4gKiBAaW5oZXJpdGRvYyBMdWMuRnVuY3Rpb24jZW1wdHlGblxuICovXG5MdWMuZW1wdHlGbiA9IEx1Yy5GdW5jdGlvbi5lbXB0eUZuO1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjXG4gKiBAbWV0aG9kIGFic3RyYWN0Rm5cbiAqIEBpbmhlcml0ZG9jIEx1Yy5GdW5jdGlvbiNhYnN0cmFjdEZuXG4gKi9cbkx1Yy5hYnN0cmFjdEZuID0gTHVjLkZ1bmN0aW9uLmFic3RyYWN0Rm47XG5cbnZhciBhcnJheSA9IHJlcXVpcmUoJy4vYXJyYXknKTtcbkx1Yy5BcnJheSA9IGFycmF5O1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjXG4gKiBAcHJvcGVydHkgQSBMdWMuQVxuICogQWxpYXMgZm9yIEx1Yy5BcnJheVxuICovXG5MdWMuQSA9IGFycmF5O1xuXG5MdWMuQXJyYXlGbkdlbmVyYXRvciA9IHJlcXVpcmUoJy4vYXJyYXlGbkdlbmVyYXRvcicpO1xuXG5MdWMuYXBwbHkoTHVjLCByZXF1aXJlKCcuL2lzJykpO1xuXG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnLi9ldmVudHMvZXZlbnRFbWl0dGVyJyk7XG5cbkx1Yy5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbnZhciBCYXNlID0gcmVxdWlyZSgnLi9jbGFzcy9iYXNlJyk7XG5cbkx1Yy5CYXNlID0gQmFzZTtcblxudmFyIERlZmluZXIgPSByZXF1aXJlKCcuL2NsYXNzL2RlZmluZXInKTtcblxuTHVjLkNsYXNzRGVmaW5lciA9IERlZmluZXI7XG5cbi8qKlxuICogQG1lbWJlciBMdWNcbiAqIEBtZXRob2QgZGVmaW5lXG4gKiBAaW5oZXJpdGRvYyBMdWMuZGVmaW5lI2RlZmluZVxuICovXG5MdWMuZGVmaW5lID0gRGVmaW5lci5kZWZpbmU7XG5cbkx1Yy5QbHVnaW4gPSByZXF1aXJlKCcuL2NsYXNzL3BsdWdpbicpO1xuXG5MdWMuUGx1Z2luTWFuYWdlciA9IHJlcXVpcmUoJy4vY2xhc3MvcGx1Z2luTWFuYWdlcicpO1xuXG5MdWMuYXBwbHkoTHVjLCB7XG4gICAgY29tcG9zaXRpb25FbnVtczogcmVxdWlyZSgnLi9jbGFzcy9jb21wb3NpdGlvbkVudW1zJylcbn0pO1xuXG5MdWMuY29tcGFyZSA9IHJlcXVpcmUoJy4vY29tcGFyZScpLmNvbXBhcmU7XG5cbkx1Yy5pZCA9IHJlcXVpcmUoJy4vaWQnKTtcblxuXG5pZihpc0Jyb3dzZXIpIHtcbiAgICB3aW5kb3cuTHVjID0gTHVjO1xufVxuXG4vKipcbiAqIEBtZW1iZXIgTHVjXG4gKiBAbWV0aG9kIGFkZFN1Ym1vZHVsZVxuICogTWV0aG9kIHVzZWQgYnkgc3VibW9kdWxlIGF1dGhvcnMgdG8gYWRkIHRoZWlyIG1vZHVsZSBpbnRvIEx1Yy5cbiAqIEJ5IGRlZmF1bHQgdGhlIHN1Ym1vZHVsZSB3aWxsIG9ubHkgYmUgYWRkZWQgdG8gTHVjIGlmIEx1YyBpcyBpblxuICogdGhlIGNvbnRleHQgb2YgYSBicm93c2VyLiAgTm9kZSBhbHJlYWR5IGhhcyBhIG5pY2UgbW9kdWxlIHN5c3RlbS4gIFxuICogVGhpcyBiZWhhdmlvciBjYW4gYmUgb3ZlcnJpZGRlbiBieSBzZXR0aW5nXG4gKiBMdWMuYWx3YXlzQWRkU3VibW9kdWxlIHRvIHRydWUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZSB0aGUgbmFtZXNwYWNlIG9mIHRoZSBzdWJtb2R1bGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogdGhlIG9iamVjdCAgdG8gYWRkIHRvIHRoZSBuYW1lc3BhY2UuICBJZiBrZXlzIGFscmVhZHkgZXhpc3QgaW5cbiAqIHRoZSBuYW1lc3BhY2UgdGhleSB3aWxsIG5vdCBiZSBvdmVyd3JpdHRlbi5cbiAqXG4gICAgZnVuY3Rpb24gVG9vbHRpcCgpIHt9XG4gICAgdmFyIGNvb2xUb29sdGlwID0gIHtUb29sdGlwOiBUb29sdGlwfTtcbiAgICBMdWMuYWRkU3VibW9kdWxlKCd1aScsIGNvb2xUb29sdGlwKTtcbiAgICBMdWMudWkuVG9vbHRpcDtcbiAgICA+ZnVuY3Rpb24gVG9vbHRpcCgpIHt9XG5cbiAgICAqdXNlIGFub3RoZXIgc3VibW9kdWxlXG4gICAgXG4gICAgTHVjLmFkZFN1Ym1vZHVsZSgndWknLCB7U29tZW9uZXNPYmplY3Q6IHthOnRydWV9fSk7XG4gICAgTHVjLnVpLlRvb2x0aXA7XG4gICAgPmZ1bmN0aW9uIFRvb2x0aXAoKSB7fVxuICAgIEx1Yy51aS5Tb21lb25lc09iamVjdDtcbiAgICA+e2E6dHJ1ZX1cbiAqL1xuTHVjLmFkZFN1Ym1vZHVsZSA9IGZ1bmN0aW9uKG5hbWVzcGFjZSwgb2JqKSB7XG4gICAgdmFyIHRvQWRkO1xuICAgIGlmIChMdWMuYWx3YXlzQWRkU3VibW9kdWxlIHx8IGlzQnJvd3Nlcikge1xuICAgICAgICB0b0FkZCA9IHt9O1xuICAgICAgICB0b0FkZFtuYW1lc3BhY2VdID0gb2JqO1xuICAgICAgICBMdWMuT2JqZWN0Lm1lcmdlKEx1YywgdG9BZGQpO1xuICAgIH1cbn07IiwidmFyIG9Ub1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XHJcblxyXG5cclxuLyoqXHJcbiAqIEBtZW1iZXIgTHVjXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoZSBwYXNzZWQgaW4gb2JqZWN0IGlzIG9mXHJcbiAqIHRoZSB0eXBlIHtAbGluayBBcnJheSBBcnJheX1cclxuICogQHBhcmFtICB7T2JqZWN0fSAgb2JqIFxyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKi9cclxuZnVuY3Rpb24gaXNBcnJheShvYmopIHtcclxuICAgIHJldHVybiBBcnJheS5pc0FycmF5KG9iaik7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAbWVtYmVyIEx1Y1xyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgcGFzc2VkIGluIG9iamVjdCBpcyBvZlxyXG4gKiB0aGUgdHlwZSB7QGxpbmsgT2JqZWN0IE9iamVjdH1cclxuICogQHBhcmFtICB7T2JqZWN0fSAgb2JqIFxyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKi9cclxuZnVuY3Rpb24gaXNPYmplY3Qob2JqKSB7XHJcbiAgICByZXR1cm4gb2JqICYmIG9Ub1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IE9iamVjdF0nO1xyXG59XHJcblxyXG4vKipcclxuICogQG1lbWJlciBMdWNcclxuICogUmV0dXJuIHRydWUgaWYgdGhlIHBhc3NlZCBpbiBvYmplY3QgaXMgb2ZcclxuICogdGhlIHR5cGUge0BsaW5rIEZ1bmN0aW9uIEZ1bmN0aW9ufVxyXG4gKiBAcGFyYW0gIHtPYmplY3R9ICBvYmogXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAqL1xyXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKG9iaikge1xyXG4gICAgcmV0dXJuIG9Ub1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAbWVtYmVyIEx1Y1xyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgcGFzc2VkIGluIG9iamVjdCBpcyBvZlxyXG4gKiB0aGUgdHlwZSB7QGxpbmsgRGF0ZSBEYXRlfVxyXG4gKiBAcGFyYW0gIHtPYmplY3R9ICBvYmogXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAqL1xyXG5mdW5jdGlvbiBpc0RhdGUob2JqKSB7XHJcbiAgICByZXR1cm4gb1RvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xyXG59XHJcblxyXG4vKipcclxuICogQG1lbWJlciBMdWNcclxuICogUmV0dXJuIHRydWUgaWYgdGhlIHBhc3NlZCBpbiBvYmplY3QgaXMgb2ZcclxuICogdGhlIHR5cGUge0BsaW5rIFJlZ0V4cCBSZWdFeHB9XHJcbiAqIEBwYXJhbSAge09iamVjdH0gIG9iaiBcclxuICogQHJldHVybiB7Qm9vbGVhbn1cclxuICovXHJcbmZ1bmN0aW9uIGlzUmVnRXhwKG9iaikge1xyXG4gICAgcmV0dXJuIG9Ub1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IFJlZ0V4cF0nO1xyXG59XHJcblxyXG4vKipcclxuICogQG1lbWJlciBMdWNcclxuICogUmV0dXJuIHRydWUgaWYgdGhlIHBhc3NlZCBpbiBvYmplY3QgaXMgb2ZcclxuICogdGhlIHR5cGUge0BsaW5rIE51bWJlciBOdW1iZXJ9XHJcbiAqIEBwYXJhbSAge09iamVjdH0gIG9iaiBcclxuICogQHJldHVybiB7Qm9vbGVhbn1cclxuICovXHJcbmZ1bmN0aW9uIGlzTnVtYmVyKG9iaikge1xyXG4gICAgcmV0dXJuIG9Ub1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IE51bWJlcl0nO1xyXG59XHJcblxyXG4vKipcclxuICogQG1lbWJlciBMdWNcclxuICogUmV0dXJuIHRydWUgaWYgdGhlIHBhc3NlZCBpbiBvYmplY3QgaXMgb2ZcclxuICogdGhlIHR5cGUge0BsaW5rIFN0cmluZyBTdHJpbmd9XHJcbiAqIEBwYXJhbSAge09iamVjdH0gIG9iaiBcclxuICogQHJldHVybiB7Qm9vbGVhbn1cclxuICovXHJcbmZ1bmN0aW9uIGlzU3RyaW5nKG9iaikge1xyXG4gICAgcmV0dXJuIG9Ub1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IFN0cmluZ10nO1xyXG59XHJcblxyXG4vKipcclxuICogQG1lbWJlciBMdWNcclxuICogUmV0dXJuIHRydWUgaWYgdGhlIHBhc3NlZCBpbiBvYmplY3QgaXMgb2ZcclxuICogdGhlIHR5cGUgYXJndW1lbnRzLlxyXG4gKiBcclxuICogQHBhcmFtICB7T2JqZWN0fSAgb2JqIFxyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKi9cclxuZnVuY3Rpb24gaXNBcmd1bWVudHMob2JqKSB7XHJcbiAgICByZXR1cm4gb1RvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJndW1lbnRzXScgfHwgb2JqICYmICEhb2JqLmNhbGxlZTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBtZW1iZXIgTHVjXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoZSBvYmplY3QgaXMgZmFsc3kgYnV0IG5vdCB6ZXJvLlxyXG4gICAgTHVjLmlzRmFsc3koZmFsc2UpXHJcbiAgICA+dHJ1ZVxyXG4gICAgTHVjLmlzRmFsc3koMClcclxuICAgID5mYWxzZVxyXG4gKiBAcGFyYW0gIHtPYmplY3R9ICBvYmpcclxuICogQHJldHVybiB7Qm9vbGVhbn0gICAgIFxyXG4gKi9cclxuZnVuY3Rpb24gaXNGYWxzeShvYmopIHtcclxuICAgIHJldHVybiAoIW9iaiAmJiBvYmogIT09IDApO1xyXG59XHJcblxyXG4vKipcclxuICogQG1lbWJlciBMdWNcclxuICogUmV0dXJuIHRydWUgaWYgdGhlIG9iamVjdCBpcyBlbXB0eS5cclxuICoge30sIFtdLCAnJyxmYWxzZSwgbnVsbCwgdW5kZWZpbmVkLCBOYU4gXHJcbiAqIGFyZSBhbGwgdHJlYXRlZCBhcyBlbXB0eS5cclxuICogXHJcbiAgICBMdWMuaXNFbXB0eSh0cnVlKVxyXG4gICAgPmZhbHNlXHJcbiAgICBMdWMuaXNFbXB0eShbXSlcclxuICAgID50cnVlXHJcbiAgICBcclxuICogQHBhcmFtICB7T2JqZWN0fSAgb2JqXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAqL1xyXG5mdW5jdGlvbiBpc0VtcHR5KG9iaikge1xyXG4gICAgdmFyIGVtcHR5ID0gZmFsc2U7XHJcblxyXG4gICAgaWYgKGlzRmFsc3kob2JqKSkge1xyXG4gICAgICAgIGVtcHR5ID0gdHJ1ZTtcclxuICAgIH0gZWxzZSBpZiAoaXNBcnJheShvYmopKSB7XHJcbiAgICAgICAgZW1wdHkgPSBvYmoubGVuZ3RoID09PSAwO1xyXG4gICAgfSBlbHNlIGlmIChpc09iamVjdChvYmopKSB7XHJcbiAgICAgICAgZW1wdHkgPSBPYmplY3Qua2V5cyhvYmopLmxlbmd0aCA9PT0gMDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZW1wdHk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgaXNBcnJheTogaXNBcnJheSxcclxuICAgIGlzT2JqZWN0OiBpc09iamVjdCxcclxuICAgIGlzRnVuY3Rpb246IGlzRnVuY3Rpb24sXHJcbiAgICBpc0RhdGU6IGlzRGF0ZSxcclxuICAgIGlzU3RyaW5nOiBpc1N0cmluZyxcclxuICAgIGlzTnVtYmVyOiBpc051bWJlcixcclxuICAgIGlzUmVnRXhwOiBpc1JlZ0V4cCxcclxuICAgIGlzQXJndW1lbnRzOiBpc0FyZ3VtZW50cyxcclxuICAgIGlzRmFsc3k6IGlzRmFsc3ksXHJcbiAgICBpc0VtcHR5OiBpc0VtcHR5XHJcbn07IiwidmFyIGlkcyA9IHt9O1xuLyoqXG4gKiBAbWVtYmVyIEx1Y1xuICogQG1ldGhvZCBpZFxuICogXG4gKiBSZXR1cm4gYSB1bmlxdWUgaWQuXG4gKiBAcGFyYW0ge1N0cmluZ30gW3ByZWZpeF0gT3B0aW9uYWwgcHJlZml4IHRvIHVzZVxuICpcbiAqXG4gICAgICAgIEx1Yy5pZCgpXG4gICAgICAgID5cImx1Yy0wXCJcbiAgICAgICAgTHVjLmlkKClcbiAgICAgICAgPlwibHVjLTFcIlxuICAgICAgICBMdWMuaWQoJ215LXByZWZpeCcpXG4gICAgICAgID5cIm15LXByZWZpeDBcIlxuICAgICAgICBMdWMuaWQoJycpXG4gICAgICAgID5cIjBcIlxuICpcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocCkge1xuICAgIHZhciBwcmVmaXggPSBwID09PSB1bmRlZmluZWQgPyAnbHVjLScgOiBwO1xuXG4gICAgaWYoaWRzW3ByZWZpeF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZHNbcHJlZml4XSA9IDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHByZWZpeCArIGlkc1twcmVmaXhdKys7XG59OyIsInZhciBpcyA9IHJlcXVpcmUoJy4vaXMnKSxcbiAgICBhSW5zZXJ0ID0gcmVxdWlyZSgnLi9hcnJheScpLmluc2VydCxcbiAgICBhRWFjaCA9IHJlcXVpcmUoJy4vYXJyYXknKS5lYWNoO1xuXG4vKipcbiAqIEBjbGFzcyBMdWMuRnVuY3Rpb25cbiAqIFBhY2thZ2UgZm9yIGZ1bmN0aW9uIG1ldGhvZHMuICBNb3N0IG9mIHRoZW0gZm9sbG93IHRoZSBzYW1lIGFwaTpcbiAqIGZ1bmN0aW9uIG9yIGZ1bmN0aW9uW10sIHJlbGV2YW50IGFyZ3MgLi4uIHdpdGggYW4gb3B0aW9uYWwgY29uZmlnXG4gKiB0byBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudGVyIGFzIHRoZSBsYXN0IGFyZ3VtZW50LlxuICovXG5cbmZ1bmN0aW9uIF9hdWdtZW50QXJncyhjb25maWcsIGNhbGxBcmdzKSB7XG4gICAgdmFyIGNvbmZpZ0FyZ3MgPSBjb25maWcuYXJncyxcbiAgICAgICAgaW5kZXggPSBjb25maWcuaW5kZXgsXG4gICAgICAgIGFyZ3NBcnJheTtcblxuICAgIGlmICghY29uZmlnQXJncykge1xuICAgICAgICByZXR1cm4gY2FsbEFyZ3M7XG4gICAgfVxuXG4gICAgaWYoaW5kZXggPT09IHRydWUgfHwgaXMuaXNOdW1iZXIoaW5kZXgpKSB7XG4gICAgICAgIGlmKGNvbmZpZy5hcmd1bWVudHNGaXJzdCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBhSW5zZXJ0KGNvbmZpZ0FyZ3MsIGNhbGxBcmdzLCBpbmRleCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFJbnNlcnQoY2FsbEFyZ3MsIGNvbmZpZ0FyZ3MsIGluZGV4KTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29uZmlnQXJncztcbn1cblxuLyoqXG4gKiBBIHJldXNhYmxlIGVtcHR5IGZ1bmN0aW9uXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZXhwb3J0cy5lbXB0eUZuID0gZnVuY3Rpb24oKSB7fTtcblxuLyoqXG4gKiBBIGZ1bmN0aW9uIHRoYXQgdGhyb3dzIGFuIGVycm9yIHdoZW4gY2FsbGVkLlxuICogVXNlZnVsIHdoZW4gZGVmaW5pbmcgYWJzdHJhY3QgbGlrZSBjbGFzc2VzXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZXhwb3J0cy5hYnN0cmFjdEZuID0gZnVuY3Rpb24oKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdhYnN0cmFjdEZuIG11c3QgYmUgaW1wbGVtZW50ZWQnKTtcbn07XG5cbi8qKlxuICogQXVnbWVudCB0aGUgcGFzc2VkIGluIGZ1bmN0aW9uJ3MgdGhpc0FyZyBhbmQgb3IgYXJndW1lbnRzIG9iamVjdCBcbiAqIGJhc2VkIG9uIHRoZSBwYXNzZWQgaW4gY29uZmlnLlxuICogXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gZm4gdGhlIGZ1bmN0aW9uIHRvIGNhbGxcbiAqIEBwYXJhbSAge09iamVjdH0gY29uZmlnXG4gKiBcbiAqIEBwYXJhbSB7T2JqZWN0fSBbY29uZmlnLnRoaXNBcmddIHRoZSB0aGlzQXJnIGZvciB0aGUgZnVuY3Rpb24gYmVpbmcgZXhlY3V0ZWQuXG4gKiBJZiB0aGlzIGlzIHRoZSBvbmx5IHByb3BlcnR5IG9uIHlvdXIgY29uZmlnIG9iamVjdCB0aGUgcHJlZmVycmVkIHdheSB3b3VsZFxuICogYmUganVzdCB0byB1c2UgRnVuY3Rpb24uYmluZFxuICogXG4gKiBAcGFyYW0ge0FycmF5fSBbY29uZmlnLmFyZ3NdIHRoZSBhcmd1bWVudHMgdXNlZCBmb3IgdGhlIGZ1bmN0aW9uIGJlaW5nIGV4ZWN1dGVkLlxuICogVGhpcyB3aWxsIHJlcGxhY2UgdGhlIGZ1bmN0aW9ucyBjYWxsIGFyZ3MgaWYgaW5kZXggaXMgbm90IGEgbnVtYmVyIG9yIFxuICogdHJ1ZS5cbiAqIFxuICogQHBhcmFtIHtOdW1iZXIvVHJ1ZX0gW2NvbmZpZy5pbmRleF0gQnkgZGVmYXVsdCB0aGUgdGhlIGNvbmZpZ3VyZWQgYXJndW1lbnRzXG4gKiB3aWxsIGJlIGluc2VydGVkIGludG8gdGhlIGZ1bmN0aW9ucyBwYXNzZWQgaW4gY2FsbCBhcmd1bWVudHMuICBJZiBpbmRleCBpcyB0cnVlXG4gKiBhcHBlbmQgdGhlIGFyZ3MgdG9nZXRoZXIgaWYgaXQgaXMgYSBudW1iZXIgaW5zZXJ0IGl0IGF0IHRoZSBwYXNzZWQgaW4gaW5kZXguXG4gKiBcbiAqIEBwYXJhbSB7QXJyYXl9IFtjb25maWcuYXJndW1lbnRzRmlyc3RdIHBhc3MgaW4gZmFsc2UgdG8gXG4gKiBhdWdtZW50IHRoZSBjb25maWd1cmVkIGFyZ3MgZmlyc3Qgd2l0aCBMdWMuQXJyYXkuaW5zZXJ0LiAgRGVmYXVsdHNcbiAqIHRvIHRydWVcbiAgICAgXG4gICAgIGZ1bmN0aW9uIGZuKCkge1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzKVxuICAgICAgICBjb25zb2xlLmxvZyhhcmd1bWVudHMpXG4gICAgfVxuICAgIFxuICAgIC8vTHVjLkFycmF5Lmluc2VydChbNF0sIFsxLDIsM10sIDApXG4gICAgTHVjLkZ1bmN0aW9uLmNyZWF0ZUF1Z21lbnRlcihmbiwge1xuICAgICAgICB0aGlzQXJnOiB7Y29uZmlnZWRUaGlzQXJnOiB0cnVlfSxcbiAgICAgICAgYXJnczogWzEsMiwzXSxcbiAgICAgICAgaW5kZXg6MFxuICAgIH0pKDQpXG5cbiAgICA+T2JqZWN0IHtjb25maWdlZFRoaXNBcmc6IHRydWV9XG4gICAgPlsxLCAyLCAzLCA0XVxuXG4gICAgLy9MdWMuQXJyYXkuaW5zZXJ0KFsxLDIsM10sIFs0XSwgMClcbiAgICBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudGVyKGZuLCB7XG4gICAgICAgIHRoaXNBcmc6IHtjb25maWdlZFRoaXNBcmc6IHRydWV9LFxuICAgICAgICBhcmdzOiBbMSwyLDNdLFxuICAgICAgICBpbmRleDowLFxuICAgICAgICBhcmd1bWVudHNGaXJzdDpmYWxzZVxuICAgIH0pKDQpXG5cbiAgICA+T2JqZWN0IHtjb25maWdlZFRoaXNBcmc6IHRydWV9XG4gICAgPls0LCAxLCAyLCAzXVxuXG4gICAgTHVjLkFycmF5Lmluc2VydChbNF0sIFsxLDIsM10sICB0cnVlKVxuICAgIHZhciBmID0gTHVjLkZ1bmN0aW9uLmNyZWF0ZUF1Z21lbnRlcihmbiwge1xuICAgICAgICBhcmdzOiBbMSwyLDNdLFxuICAgICAgICBpbmRleDogdHJ1ZVxuICAgIH0pO1xuXG4gICAgZi5hcHBseSh7Y29uZmlnOiBmYWxzZX0sIFs0XSlcblxuICAgID5PYmplY3Qge2NvbmZpZzogZmFsc2V9XG4gICAgPls0LCAxLCAyLCAzXVxuXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gdGhlIGF1Z21lbnRlZCBmdW5jdGlvbi5cbiAqL1xuZXhwb3J0cy5jcmVhdGVBdWdtZW50ZXIgPSBmdW5jdGlvbihmbiwgY29uZmlnKSB7XG4gICAgdmFyIHRoaXNBcmcgPSBjb25maWcudGhpc0FyZztcblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGZuLmFwcGx5KHRoaXNBcmcgfHwgdGhpcywgX2F1Z21lbnRBcmdzKGNvbmZpZywgYXJndW1lbnRzKSk7XG4gICAgfTtcbn07XG5cbmZ1bmN0aW9uIF9pbml0U2VxdWVuY2VGdW5jdGlvbnMoZm5zLCBjb25maWcpIHtcbiAgICB2YXIgdG9SdW4gPSBbXTtcbiAgICBhRWFjaChmbnMsIGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgdmFyIGZuID0gZjtcblxuICAgICAgICBpZiAoY29uZmlnKSB7XG4gICAgICAgICAgICBmbiA9IGV4cG9ydHMuY3JlYXRlQXVnbWVudGVyKGYsIGNvbmZpZyk7XG4gICAgICAgIH1cblxuICAgICAgICB0b1J1bi5wdXNoKGZuKTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0b1J1bjtcbn1cblxuLyoqXG4gKiBSZXR1cm4gYSBmdW5jdGlvbiB0aGF0IHJ1bnMgdGhlIHBhc3NlZCBpbiBmdW5jdGlvbnNcbiAqIGFuZCByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIGxhc3QgZnVuY3Rpb24gY2FsbGVkLlxuICogXG4gKiBAcGFyYW0gIHtGdW5jdGlvbltdfSBmbnMgXG4gKiBAcGFyYW0gIHtPYmplY3R9IFtjb25maWddIENvbmZpZyBvYmplY3RcbiAqIGZvciBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudGVyLiAgSWYgZGVmaW5lZCBhbGwgb2YgdGhlIGZ1bmN0aW9uc1xuICogd2lsbCBnZXQgY3JlYXRlZCB3aXRoIHRoZSBwYXNzZWQgaW4gY29uZmlnO1xuICpcbiAgICBMdWMuRnVuY3Rpb24uY3JlYXRlU2VxdWVuY2UoW1xuICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKDEpXG4gICAgICAgIH0sXG4gICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coMilcbiAgICAgICAgfSxcbiAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygzKVxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2ZpbmlzaGVkIGxvZ2dpbmcnKVxuICAgICAgICAgICAgcmV0dXJuIDQ7XG4gICAgICAgIH1cbiAgICBdKSgpXG4gICAgPjFcbiAgICA+MlxuICAgID4zXG4gICAgPmZpbmlzaGVkIGxvZ2dpbmdcbiAgICA+NFxuICogXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZXhwb3J0cy5jcmVhdGVTZXF1ZW5jZSA9IGZ1bmN0aW9uKGZucywgY29uZmlnKSB7XG4gICAgdmFyIGZ1bmN0aW9ucyA9IF9pbml0U2VxdWVuY2VGdW5jdGlvbnMoZm5zLCBjb25maWcpO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaSA9IDAsXG4gICAgICAgICAgICBsYXN0Rm5JbmRleCA9IGZ1bmN0aW9ucy5sZW5ndGggLTE7XG5cbiAgICAgICAgZm9yKDtpIDwgbGFzdEZuSW5kZXg7ICsraSkge1xuICAgICAgICAgICAgZnVuY3Rpb25zW2ldLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZnVuY3Rpb25zW2xhc3RGbkluZGV4XS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG59O1xuXG4vKipcbiAqIFJldHVybiBhIGZ1bmN0aW9uIHRoYXQgcnVucyB0aGUgcGFzc2VkIGluIGZ1bmN0aW9uc1xuICogaWYgb25lIG9mIHRoZSBmdW5jdGlvbnMgcmV0dXJucyBmYWxzZSB0aGUgcmVzdCBvZiB0aGUgXG4gKiBmdW5jdGlvbnMgd29uJ3QgcnVuIGFuZCBmYWxzZSB3aWxsIGJlIHJldHVybmVkLlxuICpcbiAqIElmIG5vIGZhbHNlIGlzIHJldHVybmVkIHRoZSB2YWx1ZSBvZiB0aGUgbGFzdCBmdW5jdGlvbiByZXR1cm4gd2lsbCBiZSByZXR1cm5lZFxuICogXG4gICAgTHVjLkZ1bmN0aW9uLmNyZWF0ZVNlcXVlbmNlSWYoW1xuICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKDEpXG4gICAgICAgIH0sXG4gICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coMilcbiAgICAgICAgfSxcbiAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygzKVxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2ZpbmlzaGVkIGxvZ2dpbmcnKVxuICAgICAgICAgICAgcmV0dXJuIDQ7XG4gICAgICAgIH0sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpIGNhbnQgbG9nJylcbiAgICAgICAgfVxuICAgIF0pKClcblxuICAgID4xXG4gICAgPjJcbiAgICA+M1xuICAgID5maW5pc2hlZCBsb2dnaW5nXG4gICAgPmZhbHNlXG4gKlxuICogXG4gKiBAcGFyYW0gIHtGdW5jdGlvbltdfSBmbnMgXG4gKiBAcGFyYW0gIHtPYmplY3R9IFtjb25maWddIENvbmZpZyBvYmplY3RcbiAqIGZvciBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudGVyLiAgSWYgZGVmaW5lZCBhbGwgb2YgdGhlIGZ1bmN0aW9uc1xuICogd2lsbCBnZXQgY3JlYXRlZCB3aXRoIHRoZSBwYXNzZWQgaW4gY29uZmlnO1xuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbmV4cG9ydHMuY3JlYXRlU2VxdWVuY2VJZiA9IGZ1bmN0aW9uKGZucywgY29uZmlnKSB7XG4gICAgdmFyIGZ1bmN0aW9ucyA9IF9pbml0U2VxdWVuY2VGdW5jdGlvbnMoZm5zLCBjb25maWcpO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdmFsdWUsXG4gICAgICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgICAgIGZ1bmN0aW9ucy5zb21lKGZ1bmN0aW9uKGZuKXtcbiAgICAgICAgICAgIHZhbHVlID0gZm4uYXBwbHkodGhpcywgYXJncyk7XG5cbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSA9PT0gZmFsc2U7XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9O1xufTtcblxuLyoqXG4gKiBSZXR1cm4gYSBmdW5jdGlvbnMgdGhhdCBydW5zIHRoZSBwYXNzZWQgaW4gZnVuY3Rpb25zXG4gKiB0aGUgcmVzdWx0IG9mIGVhY2ggZnVuY3Rpb24gd2lsbCBiZSB0aGUgdGhlIGNhbGwgYXJncyBcbiAqIGZvciB0aGUgbmV4dCBmdW5jdGlvbi4gIFRoZSB2YWx1ZSBvZiB0aGUgbGFzdCBmdW5jdGlvbiBcbiAqIHJldHVybiB3aWxsIGJlIHJldHVybmVkLlxuICogXG4gICAgIFxuICAgICBMdWMuRnVuY3Rpb24uY3JlYXRlUmVsYXllcihbXG4gICAgICAgIGZ1bmN0aW9uKHN0cikge1xuICAgICAgICAgICAgcmV0dXJuIHN0ciArICdiJ1xuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbihzdHIpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHIgKyAnYydcbiAgICAgICAgfSxcbiAgICAgICAgZnVuY3Rpb24oc3RyKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RyICsgJ2QnXG4gICAgICAgIH1cbiAgICBdKSgnYScpXG5cbiAgICA+XCJhYmNkXCJcblxuICogQHBhcmFtICB7RnVuY3Rpb25bXX0gZm5zIFxuICogQHBhcmFtICB7T2JqZWN0fSBbY29uZmlnXSBDb25maWcgb2JqZWN0XG4gKiBmb3IgTHVjLkZ1bmN0aW9uLmNyZWF0ZUF1Z21lbnRlci4gIElmIGRlZmluZWQgYWxsIG9mIHRoZSBmdW5jdGlvbnNcbiAqIHdpbGwgZ2V0IGNyZWF0ZWQgd2l0aCB0aGUgcGFzc2VkIGluIGNvbmZpZztcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5leHBvcnRzLmNyZWF0ZVJlbGF5ZXIgPSBmdW5jdGlvbihmbnMsIGNvbmZpZykge1xuICAgIHZhciBmdW5jdGlvbnMgPSBfaW5pdFNlcXVlbmNlRnVuY3Rpb25zKGZucywgY29uZmlnKTtcblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHZhbHVlLFxuICAgICAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcblxuICAgICAgICBmdW5jdGlvbnMuZm9yRWFjaChmdW5jdGlvbihmbiwgaW5kZXgpIHtcbiAgICAgICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gZm4uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gZm4uYXBwbHkodGhpcywgW3ZhbHVlXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9O1xufTtcblxuLyoqXG4gKiBDcmVhdGUgYSB0aHJvdHRsZWQgZnVuY3Rpb24gZnJvbSB0aGUgcGFzc2VkIGluIGZ1bmN0aW9uXG4gKiB0aGF0IHdpbGwgb25seSBnZXQgY2FsbGVkIG9uY2UgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHNcbiAqIGhhdmUgYmVlbiBleGNlZWRlZC5cbiAqIFxuICAgIHZhciBsb2dBcmdzICA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhhcmd1bWVudHMpXG4gICAgfTtcblxuICAgIHZhciBhID0gTHVjLkZ1bmN0aW9uLmNyZWF0ZVRocm90dGxlZChsb2dBcmdzLCAxKTtcblxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCAxMDA7ICsraSkge1xuICAgICAgICBhKDEsMiwzKTtcbiAgICB9XG5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBhKDEpXG4gICAgfSwgMTAwKVxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGEoMilcbiAgICB9LCA0MDApXG5cbiAgICA+WzEsIDIsIDNdXG4gICAgPlsxXVxuICAgID5bMl1cbiAqIFxuICogQHBhcmFtICB7RnVuY3Rpb259IGZuXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IG1pbGxpcyBOdW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvXG4gKiB0aHJvdHRsZSB0aGUgZnVuY3Rpb24uXG4gKiBAcGFyYW0gIHtPYmplY3R9IFtjb25maWddIENvbmZpZyBvYmplY3RcbiAqIGZvciBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudGVyLiAgSWYgZGVmaW5lZCBhbGwgb2YgdGhlIGZ1bmN0aW9uc1xuICogd2lsbCBnZXQgY3JlYXRlZCB3aXRoIHRoZSBwYXNzZWQgaW4gY29uZmlnO1xuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbmV4cG9ydHMuY3JlYXRlVGhyb3R0bGVkID0gZnVuY3Rpb24oZiwgbWlsbGlzLCBjb25maWcpIHtcbiAgICB2YXIgZm4gPSBjb25maWcgPyBleHBvcnRzLmNyZWF0ZUF1Z21lbnRlcihmLCBjb25maWcpIDogZixcbiAgICAgICAgdGltZU91dElkID0gZmFsc2U7XG5cbiAgICBpZighbWlsbGlzKSB7XG4gICAgICAgIHJldHVybiBmbjtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgICAgIGlmKHRpbWVPdXRJZCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVPdXRJZCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aW1lT3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGltZU91dElkID0gZmFsc2U7XG4gICAgICAgICAgICBmbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgfSwgbWlsbGlzKTtcbiAgICB9O1xufTtcblxuLyoqXG4gKiBEZWZlciBhIGZ1bmN0aW9uJ3MgZXhlY3V0aW9uIGZvciB0aGUgcGFzc2VkIGluXG4gKiBtaWxsaXNlY29uZHMuXG4gKiBcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmblxuICogQHBhcmFtICB7TnVtYmVyfSBtaWxsaXMgTnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0b1xuICogZGVmZXJcbiAqIEBwYXJhbSAge09iamVjdH0gW2NvbmZpZ10gQ29uZmlnIG9iamVjdFxuICogZm9yIEx1Yy5GdW5jdGlvbi5jcmVhdGVBdWdtZW50ZXIuICBJZiBkZWZpbmVkIGFsbCBvZiB0aGUgZnVuY3Rpb25zXG4gKiB3aWxsIGdldCBjcmVhdGVkIHdpdGggdGhlIHBhc3NlZCBpbiBjb25maWc7XG4gKiBcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5leHBvcnRzLmNyZWF0ZURlZmVycmVkID0gZnVuY3Rpb24oZiwgbWlsbGlzLCBjb25maWcpIHtcbiAgICB2YXIgZm4gPSBjb25maWcgPyBleHBvcnRzLmNyZWF0ZUF1Z21lbnRlcihmLCBjb25maWcpIDogZjtcblxuICAgIGlmKCFtaWxsaXMpIHtcbiAgICAgICAgcmV0dXJuIGZuO1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG5cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICB9LCBtaWxsaXMpO1xuICAgIH07XG59OyIsInZhciBpcyA9IHJlcXVpcmUoJy4vaXMnKTtcblxuLyoqXG4gKiBAY2xhc3MgTHVjLk9iamVjdFxuICogUGFja2FnZSBmb3IgT2JqZWN0IG1ldGhvZHMuICBMdWMuT2JqZWN0LmFwcGx5IGFuZCBMdWMuT2JqZWN0LmVhY2hcbiAqIGFyZSB1c2VkIHZlcnkgb2Z0ZW4uICBtaXggYW5kIGFwcGx5IGFyZSBhbGlhc2VkIHRvIEx1Yy5hcHBseSBhbmQgTHVjLm1peC5cbiAqL1xuXG4vKipcbiAqIEFwcGx5IHRoZSBwcm9wZXJ0aWVzIGZyb20gZnJvbU9iamVjdCB0byB0aGUgdG9PYmplY3QuICBmcm9tT2JqZWN0IHdpbGxcbiAqIG92ZXJ3cml0ZSBhbnkgc2hhcmVkIGtleXMuICBJdCBjYW4gYWxzbyBiZSB1c2VkIGFzIGEgc2ltcGxlIHNoYWxsb3cgY2xvbmUuXG4gKiBcbiAgICB2YXIgdG8gPSB7YToxLCBjOjF9LCBmcm9tID0ge2E6MiwgYjoyfVxuICAgIEx1Yy5PYmplY3QuYXBwbHkodG8sIGZyb20pXG4gICAgPk9iamVjdCB7YTogMiwgYzogMSwgYjogMn1cbiAgICB0byA9PT0gdG9cbiAgICA+dHJ1ZVxuICAgIHZhciBjbG9uZSA9IEx1Yy5PYmplY3QuYXBwbHkoe30sIGZyb20pXG4gICAgPnVuZGVmaW5lZFxuICAgIGNsb25lXG4gICAgPk9iamVjdCB7YTogMiwgYjogMn1cbiAgICBjbG9uZSA9PT0gZnJvbVxuICAgID5mYWxzZVxuICpcbiAqIE5vIG51bGwgY2hlY2tzIGFyZSBuZWVkZWQuXG4gICAgXG4gICAgTHVjLmFwcGx5KHVuZGVmaW5lZCwge2E6MX0pXG4gICAgPnthOjF9XG4gICAgTHVjLmFwcGx5KHthOiAxfSlcbiAgICA+e2E6MX1cblxuICpcbiAqIFxuICogQHBhcmFtICB7T2JqZWN0fSBbdG9PYmplY3RdIE9iamVjdCB0byBwdXQgdGhlIHByb3BlcnRpZXMgZnJvbU9iamVjdCBvbi5cbiAqIEBwYXJhbSAge09iamVjdH0gW2Zyb21PYmplY3RdIE9iamVjdCB0byBwdXQgdGhlIHByb3BlcnRpZXMgb24gdGhlIHRvT2JqZWN0XG4gKiBAcmV0dXJuIHtPYmplY3R9IHRoZSB0b09iamVjdFxuICovXG5leHBvcnRzLmFwcGx5ID0gZnVuY3Rpb24odG9PYmplY3QsIGZyb21PYmplY3QpIHtcbiAgICB2YXIgdG8gPSB0b09iamVjdCB8fCB7fSxcbiAgICAgICAgZnJvbSA9IGZyb21PYmplY3QgfHwge30sXG4gICAgICAgIHByb3A7XG5cbiAgICBmb3IgKHByb3AgaW4gZnJvbSkge1xuICAgICAgICBpZiAoZnJvbS5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgICAgdG9bcHJvcF0gPSBmcm9tW3Byb3BdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRvO1xufTtcblxuLyoqXG4gKiBTaW1pbGFyIHRvIEx1Yy5PYmplY3QuYXBwbHkgZXhjZXB0IHRoYXQgdGhlIGZyb21PYmplY3Qgd2lsbCBcbiAqIE5PVCBvdmVyd3JpdGUgdGhlIGtleXMgb2YgdGhlIHRvT2JqZWN0IGlmIHRoZXkgYXJlIGRlZmluZWQuXG4gKlxuICAgIEx1Yy5taXgoe2E6MSxiOjJ9LCB7YTozLGI6NCxjOjV9KVxuICAgID57YTogMSwgYjogMiwgYzogNX1cblxuICogTm8gbnVsbCBjaGVja3MgYXJlIG5lZWRlZC5cbiAgICBcbiAgICBMdWMubWl4KHVuZGVmaW5lZCwge2E6MX0pXG4gICAgPnthOjF9XG4gICAgTHVjLm1peCh7YTogMX0pXG4gICAgPnthOjF9XG4gICAgXG4gKlxuXG4gKiBAcGFyYW0gIHtPYmplY3R9IFt0b09iamVjdF0gT2JqZWN0IHRvIHB1dCB0aGUgcHJvcGVydGllcyBmcm9tT2JqZWN0IG9uLlxuICogQHBhcmFtICB7T2JqZWN0fSBbZnJvbU9iamVjdF0gZnJvbU9iamVjdCBPYmplY3QgdG8gcHV0IHRoZSBwcm9wZXJ0aWVzIG9uIHRoZSB0b09iamVjdFxuICogQHJldHVybiB7T2JqZWN0fSB0aGUgdG9PYmplY3RcbiAqL1xuZXhwb3J0cy5taXggPSBmdW5jdGlvbih0b09iamVjdCwgZnJvbU9iamVjdCkge1xuICAgIHZhciB0byA9IHRvT2JqZWN0IHx8IHt9LFxuICAgICAgICBmcm9tID0gZnJvbU9iamVjdCB8fCB7fSxcbiAgICAgICAgcHJvcDtcblxuICAgIGZvciAocHJvcCBpbiBmcm9tKSB7XG4gICAgICAgIGlmIChmcm9tLmhhc093blByb3BlcnR5KHByb3ApICYmIHRvW3Byb3BdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRvW3Byb3BdID0gZnJvbVtwcm9wXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0bztcbn07XG5cbi8qKlxuICogSXRlcmF0ZSBvdmVyIGFuIG9iamVjdHMgcHJvcGVydGllc1xuICogYXMga2V5IHZhbHVlIFwicGFpcnNcIiB3aXRoIHRoZSBwYXNzZWQgaW4gZnVuY3Rpb24uXG4gKiBcbiAgICB2YXIgdGhpc0FyZyA9IHt2YWw6J2MnfTtcbiAgICBMdWMuT2JqZWN0LmVhY2goe1xuICAgICAgICB1OiAnTCdcbiAgICB9LCBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHZhbHVlICsga2V5ICsgdGhpcy52YWwpXG4gICAgfSwgdGhpc0FyZylcbiAgICBcbiAgICA+THVjIFxuIFxuICogQHBhcmFtICB7T2JqZWN0fSAgIG9iaiAgdGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXJcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmbiAgIHRoZSBmdW5jdGlvbiB0byBjYWxsXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGZuLmtleSAgIHRoZSBvYmplY3Qga2V5XG4gKiBAcGFyYW0gIHtPYmplY3R9IGZuLnZhbHVlICAgdGhlIG9iamVjdCB2YWx1ZVxuICogQHBhcmFtICB7T2JqZWN0fSAgIFt0aGlzQXJnXSBcbiAqIEBwYXJhbSB7T2JqZWN0fSAgW2NvbmZpZ11cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gIGNvbmZpZy5vd25Qcm9wZXJ0aWVzIHNldCB0byBmYWxzZVxuICogdG8gaXRlcmF0ZSBvdmVyIGFsbCBvZiB0aGUgb2JqZWN0cyBlbnVtZXJhYmxlIHByb3BlcnRpZXMuXG4gKi9cbmV4cG9ydHMuZWFjaCA9IGZ1bmN0aW9uKG9iaiwgZm4sIHRoaXNBcmcsIGNvbmZpZykge1xuICAgIHZhciBrZXksIHZhbHVlLFxuICAgICAgICBhbGxQcm9wZXJ0aWVzID0gY29uZmlnICYmIGNvbmZpZy5vd25Qcm9wZXJ0aWVzID09PSBmYWxzZTtcblxuICAgIGlmIChhbGxQcm9wZXJ0aWVzKSB7XG4gICAgICAgIGZvciAoa2V5IGluIG9iaikge1xuICAgICAgICAgICAgZm4uY2FsbCh0aGlzQXJnLCBrZXksIG9ialtrZXldKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAoa2V5IGluIG9iaikge1xuICAgICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgZm4uY2FsbCh0aGlzQXJnLCBrZXksIG9ialtrZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8qKlxuICogVGFrZSBhbiBhcnJheSBvZiBzdHJpbmdzIGFuZCBhbiBhcnJheS9hcmd1bWVudHMgb2ZcbiAqIHZhbHVlcyBhbmQgcmV0dXJuIGFuIG9iamVjdCBvZiBrZXkgdmFsdWUgcGFpcnNcbiAqIGJhc2VkIG9mZiBlYWNoIGFycmF5cyBpbmRleC4gIEl0IGlzIHVzZWZ1bCBmb3IgdGFraW5nXG4gKiBhIGxvbmcgbGlzdCBvZiBhcmd1bWVudHMgYW5kIGNyZWF0aW5nIGFuIG9iamVjdCB0aGF0IGNhblxuICogYmUgcGFzc2VkIHRvIG90aGVyIG1ldGhvZHMuXG4gKiBcbiAgICBmdW5jdGlvbiBsb25nQXJncyhhLGIsYyxkLGUsZikge1xuICAgICAgICByZXR1cm4gTHVjLk9iamVjdC50b09iamVjdChbJ2EnLCdiJywgJ2MnLCAnZCcsICdlJywgJ2YnXSwgYXJndW1lbnRzKVxuICAgIH1cblxuICAgIGxvbmdBcmdzKDEsMiwzLDQsNSw2LDcsOCw5KVxuXG4gICAgPk9iamVjdCB7YTogMSwgYjogMiwgYzogMywgZDogNCwgZTogNeKApn1cbiAgICBhOiAxXG4gICAgYjogMlxuICAgIGM6IDNcbiAgICBkOiA0XG4gICAgZTogNVxuICAgIGY6IDZcblxuICAgIGxvbmdBcmdzKDEsMiwzKVxuXG4gICAgPk9iamVjdCB7YTogMSwgYjogMiwgYzogMywgZDogdW5kZWZpbmVkLCBlOiB1bmRlZmluZWTigKZ9XG4gICAgYTogMVxuICAgIGI6IDJcbiAgICBjOiAzXG4gICAgZDogdW5kZWZpbmVkXG4gICAgZTogdW5kZWZpbmVkXG4gICAgZjogdW5kZWZpbmVkXG5cbiAqIEBwYXJhbSAge1N0cmluZ1tdfSBzdHJpbmdzXG4gKiBAcGFyYW0gIHtBcnJheS9hcmd1bWVudHN9IHZhbHVlc1xuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5leHBvcnRzLnRvT2JqZWN0ID0gZnVuY3Rpb24oc3RyaW5ncywgdmFsdWVzKSB7XG4gICAgdmFyIG9iaiA9IHt9LFxuICAgICAgICBpID0gMCxcbiAgICAgICAgbGVuID0gc3RyaW5ncy5sZW5ndGg7XG4gICAgZm9yICg7IGkgPCBsZW47ICsraSkge1xuICAgICAgICBvYmpbc3RyaW5nc1tpXV0gPSB2YWx1ZXNbaV07XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iajtcbn07XG5cbi8qKlxuICogUmV0dXJuIGtleSB2YWx1ZSBwYWlycyBmcm9tIHRoZSBvYmplY3QgaWYgdGhlXG4gKiBmaWx0ZXJGbiByZXR1cm5zIGEgdHJ1dGh5IHZhbHVlLlxuICpcbiAgICBMdWMuT2JqZWN0LmZpbHRlcih7XG4gICAgICAgIGE6IGZhbHNlLFxuICAgICAgICBiOiB0cnVlLFxuICAgICAgICBjOiBmYWxzZVxuICAgIH0sIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGtleSA9PT0gJ2EnIHx8IHZhbHVlXG4gICAgfSlcbiAgICA+W3trZXk6ICdhJywgdmFsdWU6IGZhbHNlfSwge2tleTogJ2InLCB2YWx1ZTogdHJ1ZX1dXG5cbiAgICBMdWMuT2JqZWN0LmZpbHRlcih7XG4gICAgICAgIGE6IGZhbHNlLFxuICAgICAgICBiOiB0cnVlLFxuICAgICAgICBjOiBmYWxzZVxuICAgIH0sIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGtleSA9PT0gJ2EnIHx8IHZhbHVlXG4gICAgfSwgdW5kZWZpbmVkLCB7XG4gICAgICAgIGtleXM6IHRydWVcbiAgICB9KVxuICAgID5bJ2EnLCAnYiddXG4gKiBcbiAqIEBwYXJhbSAge09iamVjdH0gICBvYmogIHRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gZmlsdGVyRm4gICB0aGUgZnVuY3Rpb24gdG8gY2FsbCwgcmV0dXJuIGEgdHJ1dGh5IHZhbHVlXG4gKiB0byBhZGQgdGhlIGtleSB2YWx1ZSBwYWlyXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGZpbHRlckZuLmtleSAgIHRoZSBvYmplY3Qga2V5XG4gKiBAcGFyYW0gIHtPYmplY3R9IGZpbHRlckZuLnZhbHVlICAgdGhlIG9iamVjdCB2YWx1ZVxuICogQHBhcmFtICB7T2JqZWN0fSAgIFt0aGlzQXJnXSBcbiAqIEBwYXJhbSB7T2JqZWN0fSAgW2NvbmZpZ11cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gIGNvbmZpZy5vd25Qcm9wZXJ0aWVzIHNldCB0byBmYWxzZVxuICogdG8gaXRlcmF0ZSBvdmVyIGFsbCBvZiB0aGUgb2JqZWN0cyBlbnVtZXJhYmxlIHByb3BlcnRpZXMuXG4gKiBcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gIGNvbmZpZy5rZXlzIHNldCB0byB0cnVlIHRvIHJldHVyblxuICoganVzdCB0aGUga2V5cy5cbiAqXG4gKiBAcGFyYW0ge0Jvb2xlYW59ICBjb25maWcudmFsdWVzIHNldCB0byB0cnVlIHRvIHJldHVyblxuICoganVzdCB0aGUgdmFsdWVzLlxuICogXG4gKiBAcmV0dXJuIHtPYmplY3RbXS9TdHJpbmdbXX0gQXJyYXkgb2Yga2V5IHZhbHVlIHBhaXJzIGluIHRoZSBmb3JtXG4gKiBvZiB7a2V5OiAna2V5JywgdmFsdWU6IHZhbHVlfS4gIElmIGtleXMgb3IgdmFsdWVzIGlzIHRydWUgb24gdGhlIGNvbmZpZ1xuICoganVzdCB0aGUga2V5cyBvciB2YWx1ZXMgYXJlIHJldHVybmVkLlxuICpcbiAqL1xuZXhwb3J0cy5maWx0ZXIgPSBmdW5jdGlvbihvYmosIGZpbHRlckZuLCB0aGlzQXJnLCBjKSB7XG4gICAgdmFyIHZhbHVlcyA9IFtdLFxuICAgICAgICBjb25maWcgPSBjIHx8IHt9O1xuXG4gICAgZXhwb3J0cy5lYWNoKG9iaiwgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICBpZiAoZmlsdGVyRm4uY2FsbCh0aGlzQXJnLCBrZXksIHZhbHVlKSkge1xuICAgICAgICAgICAgaWYgKGNvbmZpZy5rZXlzID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgdmFsdWVzLnB1c2goa2V5KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29uZmlnLnZhbHVlcyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHZhbHVlcy5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFsdWVzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIGtleToga2V5XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCB0aGlzQXJnLCBjb25maWcpO1xuXG4gICAgcmV0dXJuIHZhbHVlcztcbn07XG5cbi8qKlxuICogTWVyZ2UgdGhlIHZhbHVlcyBmcm9tIG9iamVjdDIgaW50byBvYmplY3QxLiAgVGhlIHZhbHVlcyB3aWxsIG9ubHkgYmVcbiAqIG1lcmdlZCBpbiBpZiBvYmplY3QxJ3MgdmFsdWUgZm9yIHRoZSBrZXkgaXMgbnVsbCBvciB1bmRlZmluZWQuICBOZXN0ZWQgb2JqZWN0c1xuICogYXJlIGhhbmRsZWQgaW4gdGhlIHNhbWUgd2F5LiAgQXJyYXkgdmFsdWVzIHdpbGwgbm90IGJlIG1lcmdlZC5cbiAqIFxuICAgIEx1Yy5PYmplY3QubWVyZ2Uoe2E6IDF9LCB7YjogMn0pXG4gICAgPnthOiAxLCBiOiAyfVxuICAgIFxuICAgIEx1Yy5PYmplY3QubWVyZ2Uoe2E6IHthOiAxfSB9LCB7YjoyLCBhOiB7YjogMn19KVxuICAgID57YjogMiwgYToge2E6MSwgYjoyfSB9XG5cbiAqIEBwYXJhbSAge09iamVjdH0gb2JqZWN0MVxuICogQHBhcmFtICB7T2JqZWN0fSBvYmplY3QyXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbmZ1bmN0aW9uIG1lcmdlKG9iajEsIG9iajIpIHtcbiAgICBleHBvcnRzLmVhY2gob2JqMiwgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICB2YXIgb2JqMVZhbHVlID0gb2JqMVtrZXldO1xuICAgICAgICBpZiAob2JqMVZhbHVlID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgb2JqMVtrZXldID0gdmFsdWU7XG4gICAgICAgIH0gZWxzZSBpZiAoaXMuaXNPYmplY3Qob2JqMVZhbHVlKSkge1xuICAgICAgICAgICAgbWVyZ2Uob2JqMVtrZXldLCBvYmoyW2tleV0pO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gb2JqMTtcbn1cblxuZXhwb3J0cy5tZXJnZSA9IG1lcmdlOyIsInZhciBhcnJheVNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLFxuICAgIGNvbXBhcmUgPSByZXF1aXJlKCcuL2NvbXBhcmUnKSxcbiAgICBpcyA9IHJlcXVpcmUoJy4vaXMnKSxcbiAgICBjb21wYXJlID0gY29tcGFyZS5jb21wYXJlO1xuXG5mdW5jdGlvbiBfY3JlYXRlSXRlcmF0b3JGbihmbiwgYykge1xuICAgIHZhciBjb25maWcgPSBjIHx8IHt9O1xuXG4gICAgaWYoaXMuaXNGdW5jdGlvbihmbikgJiYgKGNvbmZpZy50eXBlICE9PSAnc3RyaWN0JykpIHtcbiAgICAgICAgcmV0dXJuIGMgPyBmbi5iaW5kKGMpIDogZm47XG4gICAgfVxuXG4gICAgaWYoY29uZmlnLnR5cGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb25maWcudHlwZSA9ICdsb29zZSc7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBjb21wYXJlKGZuLCB2YWx1ZSwgY29uZmlnKTtcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBfY3JlYXRlSXRlcmF0b3JOb3RGbihmbiwgY29uZmlnKSB7XG4gICAgdmFyIGZ1bmN0aW9uVG9Ob3QgPSBfY3JlYXRlSXRlcmF0b3JGbihmbiwgY29uZmlnKTtcbiAgICAgICAgXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gIWZ1bmN0aW9uVG9Ob3QuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xufVxuXG5cbi8qKlxuICogQGNsYXNzIEx1Yy5BcnJheSBcbiAqIFBhY2thZ2UgZm9yIEFycmF5IG1ldGhvZHMuIDxicj5cbiAqIFxuICogS2VlcCBpbiBtaW5kIHRoYXQgTHVjIGlzIG9wdGlvbmFsbHkgcGFja2FnZWQgd2l0aCBlczUgc2hpbSBzbyB5b3UgY2FuIHdyaXRlIGVzNSBjb2RlIGluIG5vbiBlczUgYnJvd3NlcnMuXG4gKiBJdCBjb21lcyB3aXRoIHlvdXIgZmF2b3JpdGUge0BsaW5rIEFycmF5IEFycmF5fSBtZXRob2RzIHN1Y2ggYXMgQXJyYXkuZm9yRWFjaCwgQXJyYXkuZmlsdGVyLCBBcnJheS5zb21lLCBBcnJheS5ldmVyeSBBcnJheS5yZWR1Y2VSaWdodCAuLlxuICpcbiAqIEFsc28gZG9uJ3QgZm9yZ2V0IGFib3V0IEx1Yy5BcnJheS5lYWNoIGFuZCBMdWMuQXJyYXkudG9BcnJheSwgdGhleSBhcmUgZ3JlYXQgdXRpbGl0eSBtZXRob2RzXG4gKiB0aGF0IGFyZSB1c2VkIGFsbCBvdmVyIHRoZSBmcmFtZXdvcmsuXG4gKiBcbiAqIEFsbCByZW1vdmVcXCogLyBmaW5kXFwqIG1ldGhvZHMgZm9sbG93IHRoZSBzYW1lIGFwaS4gIFxcKkFsbCBmdW5jdGlvbnMgd2lsbCByZXR1cm4gYW4gYXJyYXkgb2YgcmVtb3ZlZCBvciBmb3VuZFxuICogaXRlbXMuICBUaGUgaXRlbXMgd2lsbCBiZSBhZGRlZCB0byB0aGUgYXJyYXkgaW4gdGhlIG9yZGVyIHRoZXkgYXJlXG4gKiBmb3VuZC4gIFxcKkZpcnN0IGZ1bmN0aW9ucyB3aWxsIHJldHVybiB0aGUgZmlyc3QgaXRlbSBhbmQgc3RvcCBpdGVyYXRpbmcgYWZ0ZXIgdGhhdCwgaWYgbm9uZVxuICogIGlzIGZvdW5kIGZhbHNlIGlzIHJldHVybmVkLiAgcmVtb3ZlXFwqIGZ1bmN0aW9ucyB3aWxsIGRpcmVjdGx5IGNoYW5nZSB0aGUgcGFzc2VkIGluIGFycmF5LlxuICogIFxcKk5vdCBmdW5jdGlvbnMgb25seSBkbyB0aGUgZm9sbG93aW5nIGFjdGlvbnMgaWYgdGhlIGNvbXBhcmlzb24gaXMgbm90IHRydWUuXG4gKiAgQWxsIHJlbW92ZVxcKiAvIGZpbmRcXCogdGFrZSB0aGUgZm9sbG93aW5nIGFwaTogYXJyYXksIG9iamVjdFRvQ29tcGFyZU9ySXRlcmF0b3IsIGNvbXBhcmVDb25maWdPclRoaXNBcmcgPGJyPmZvciBleGFtcGxlOlxuICpcbiAgICAvL21vc3QgY29tbW9uIHVzZSBjYXNlXG4gICAgTHVjLkFycmF5LmZpbmRGaXJzdChbMSwyLDMsIHt9XSwge30pO1xuICAgID5PYmplY3Qge31cblxuICAgIC8vcGFzcyBpbiBvcHRpb25hbCBjb25maWcgZm9yIGEgc3RyaWN0ID09PSBjb21wYXJpc29uXG4gICAgTHVjLkFycmF5LmZpbmRGaXJzdChbMSwyLDMse31dLCB7fSwge3R5cGU6ICdzdHJpY3QnfSk7XG4gICAgPmZhbHNlXG5cbiAgICAvL3Bhc3MgaW4gYW4gaXRlcmF0b3IgYW5kIHRoaXNBcmdcbiAgICBMdWMuQXJyYXkuZmluZEZpcnN0KFsxLDIsMyx7fV0sIGZ1bmN0aW9uKHZhbCwgaW5kZXgsIGFycmF5KXtcbiAgICAgICAgcmV0dXJuIHZhbCA9PT0gMyB8fCB0aGlzLm51bSA9PT0gdmFsO1xuICAgIH0sIHtudW06IDF9KTtcbiAgICA+MVxuICAgIFxuICAgIC8veW91IGNhbiBzZWUgcmVtb3ZlIG1vZGlmaWVzIHRoZSBwYXNzZWQgaW4gYXJyYXkuXG4gICAgdmFyIGFyciA9IFsxLDIse2E6MX0sMSwge2E6MX1dO1xuICAgIEx1Yy5BcnJheS5yZW1vdmVGaXJzdChhcnIsIHthOjF9KVxuICAgID57YToxfVxuICAgIGFycjtcbiAgICA+WzEsIDIsIDEsIHthOjF9XVxuICAgIEx1Yy5BcnJheS5yZW1vdmVMYXN0KGFyciwgMSlcbiAgICA+MVxuICAgIGFycjtcbiAgICA+WzEsMiwge2E6MX1dXG4gICAgXG4gICAgXG4gICAgTHVjLkFycmF5LmZpbmRBbGwoWzEsMiwzLCB7YToxLGI6Mn1dLCBmdW5jdGlvbigpIHtyZXR1cm4gdHJ1ZTt9KVxuICAgID4gWzEsMiwzLCB7YToxLGI6Mn1dXG4gICAgLy9zaG93IGhvdyBub3Qgd29ya3Mgd2l0aCBhbiBpdGVyYXRvclxuICAgIEx1Yy5BcnJheS5maW5kQWxsTm90KFsxLDIsMywge2E6MSxiOjJ9XSwgZnVuY3Rpb24oKSB7cmV0dXJuIHRydWU7fSlcbiAgICA+W11cbiAqXG4gKiBGb3IgY29tbW9ubHkgdXNlZCBmaW5kL3JlbW92ZSBmdW5jdGlvbnMgY2hlY2sgb3V0IEx1Yy5BcnJheUZucyBmb3IgZXhhbXBsZSBhXG4gKiBcImNvbXBhY3RcIiBsaWtlIGZ1bmN0aW9uXG4gKiBcbiAgICBMdWMuQXJyYXkuZmluZEFsbE5vdEZhbHN5KFtmYWxzZSwgJycsIHVuZGVmaW5lZCwgMCwge30sIFtdXSlcbiAgICA+WzAsIHt9LCBbXV1cbiAqXG4gKiBPciByZW1vdmUgYWxsIGVtcHR5IGl0ZW1zXG4gKiBcbiAgICB2YXIgYXJyID0gWycnLCAwICwgW10sIHthOjF9LCB0cnVlLCB7fSwgWzFdXVxuICAgIEx1Yy5BcnJheS5yZW1vdmVBbGxFbXB0eShhcnIpXG4gICAgPlsnJywgW10sIHt9XVxuICAgIGFyclxuICAgID5bMCwge2E6MX0sIHRydWUsIFsxXV1cbiAqL1xuXG4vKipcbiAqIFR1cm4gdGhlIHBhc3NlZCBpbiBpdGVtIGludG8gYW4gYXJyYXkgaWYgaXRcbiAqIGlzbid0IG9uZSBhbHJlYWR5LCBpZiB0aGUgaXRlbSBpcyBhbiBhcnJheSBqdXN0IHJldHVybiBpdC4gIFxuICogSXQgcmV0dXJucyBhbiBlbXB0eSBhcnJheSBpZiBpdGVtIGlzIG51bGwgb3IgdW5kZWZpbmVkLlxuICogSWYgaXQgaXMganVzdCBhIHNpbmdsZSBpdGVtIHJldHVybiBhbiBhcnJheSBjb250YWluaW5nIHRoZSBpdGVtLlxuICogXG4gICAgTHVjLkFycmF5LnRvQXJyYXkoKVxuICAgID5bXVxuICAgIEx1Yy5BcnJheS50b0FycmF5KG51bGwpXG4gICAgPltdXG4gICAgTHVjLkFycmF5LnRvQXJyYXkoMSlcbiAgICA+WzFdXG4gICAgTHVjLkFycmF5LnRvQXJyYXkoWzEsMl0pXG4gICAgPlsxLCAyXVxuICpcbiAqIEBwYXJhbSAge09iamVjdH0gaXRlbSBpdGVtIHRvIHR1cm4gaW50byBhbiBhcnJheS5cbiAqIEByZXR1cm4gdGhlIGFycmF5XG4gKi9cbmZ1bmN0aW9uIHRvQXJyYXkoaXRlbSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGl0ZW0pKSB7XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgIH1cbiAgICByZXR1cm4gKGl0ZW0gPT09IG51bGwgfHwgaXRlbSA9PT0gdW5kZWZpbmVkKSA/IFtdIDogW2l0ZW1dO1xufVxuXG4vKipcbiAqIFJldHVybiB0aGUgbGFzdCBpdGVtIG9mIHRoZSBhcnJheVxuICogQHBhcmFtICB7QXJyYXl9IGFyclxuICogQHJldHVybiB7T2JqZWN0fSB0aGUgaXRlbVxuICAgIFxuICAgIHZhciBteUxvbmdBcnJheU5hbWVGb3JUaGluZ3NUaGF0SVdhbnRUb0tlZXBUcmFja09mID0gWzEsMiwzXVxuICAgIFxuICAgIEx1Yy5BcnJheS5sYXN0KG15TG9uZ0FycmF5TmFtZUZvclRoaW5nc1RoYXRJV2FudFRvS2VlcFRyYWNrT2YpO1xuICAgIHZzLlxuICAgIG15TG9uZ0FycmF5TmFtZUZvclRoaW5nc1RoYXRJV2FudFRvS2VlcFRyYWNrT2ZbbXlMb25nQXJyYXlOYW1lRm9yVGhpbmdzVGhhdElXYW50VG9LZWVwVHJhY2tPZi5sZW5ndGggLTFdXG4gKlxuICovXG5mdW5jdGlvbiBsYXN0KGFycikge1xuICAgIHJldHVybiBhcnJbYXJyLmxlbmd0aCAtMV07XG59XG5cbi8qKlxuICogRmxhdHRlbiBvdXQgYW4gYXJyYXkgb2Ygb2JqZWN0cyBiYXNlZCBvZiB0aGVpciB2YWx1ZSBmb3IgdGhlIHBhc3NlZCBpbiBrZXkuXG4gKiBUaGlzIGFsc28gdGFrZXMgYWNjb3VudCBmb3IgbnVsbC91bmRlZmluZWQgdmFsdWVzLlxuICpcbiAgICBMdWMuQXJyYXkucGx1Y2soW3VuZGVmaW5lZCwge2E6JzEnLCBiOjJ9LCB7YjozfSwge2I6NH1dLCAnYicpXG4gICAgPlt1bmRlZmluZWQsIDIsIDMsIDRdXG4gKiBAcGFyYW0gIHtPYmplY3RbXX0gYXJyIFxuICogQHBhcmFtICB7U3RyaW5nfSBrZXkgXG4gKiBAcmV0dXJuIHtBcnJheX0gICAgIFxuICovXG5mdW5jdGlvbiBwbHVjayhhcnIsIGtleSkge1xuICAgIHJldHVybiBhcnIubWFwKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZSAmJiB2YWx1ZVtrZXldO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIFJldHVybiB0aGUgaXRlbXMgaW4gYmV0d2VlbiB0aGUgcGFzc2VkIGluIGluZGV4XG4gKiBhbmQgdGhlIGVuZCBvZiB0aGUgYXJyYXkuXG4gKlxuICAgIEx1Yy5BcnJheS5mcm9tSW5kZXgoWzEsMiwzLDQsNV0sIDEpXG4gICAgPlsyLCAzLCA0LCA1XVxuXG4gKiBAcGFyYW0gIHtBcnJheS9hcmd1bWVudHN9IGFyciBcbiAqIEBwYXJhbSAge051bWJlcn0gaW5kZXggXG4gKiBAcmV0dXJuIHtBcnJheX0gdGhlIG5ldyBhcnJheS5cbiAqIFxuICovXG5mdW5jdGlvbiBmcm9tSW5kZXgoYSwgaW5kZXgpIHtcbiAgICB2YXIgYXJyID0gaXMuaXNBcmd1bWVudHMoYSkgPyBhcnJheVNsaWNlLmNhbGwoYSkgOiBhO1xuICAgIHJldHVybiBhcnJheVNsaWNlLmNhbGwoYXJyLCBpbmRleCwgYXJyLmxlbmd0aCk7XG59XG5cbi8qKlxuICogUnVucyBhbiBBcnJheS5mb3JFYWNoIGFmdGVyIGNhbGxpbmcgTHVjLkFycmF5LnRvQXJyYXkgb24gdGhlIGl0ZW0uXG4gIEl0IGlzIHZlcnkgdXNlZnVsIGZvciBzZXR0aW5nIHVwIGZsZXhpYmxlIGFwaSdzIHRoYXQgY2FuIGhhbmRsZSBub25lIG9uZSBvciBtYW55LlxuXG4gICAgTHVjLkFycmF5LmVhY2godGhpcy5pdGVtcywgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICB0aGlzLl9hZGRJdGVtKGl0ZW0pO1xuICAgIH0pO1xuXG4gICAgdnMuXG5cbiAgICBpZihBcnJheS5pc0FycmF5KHRoaXMuaXRlbXMpKXtcbiAgICAgICAgdGhpcy5pdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgIHRoaXMuX2FkZEl0ZW0oaXRlbSk7XG4gICAgICAgIH0pXG4gICAgfVxuICAgIGVsc2UgaWYodGhpcy5pdGVtcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuX2FkZEl0ZW0odGhpcy5pdGVtcyk7XG4gICAgfVxuXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgaXRlbVxuICogQHBhcmFtICB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgdGhpc0FyZyAgIFxuICpcbiAqL1xuZnVuY3Rpb24gZWFjaChpdGVtLCBmbiwgdGhpc0FyZykge1xuICAgIHZhciBhcnIgPSB0b0FycmF5KGl0ZW0pO1xuICAgIHJldHVybiBhcnIuZm9yRWFjaC5jYWxsKGFyciwgZm4sIHRoaXNBcmcpO1xufVxuXG4vKipcbiAqIEluc2VydCBvciBhcHBlbmQgdGhlIHNlY29uZCBhcnJheS9hcmd1bWVudHMgaW50byB0aGVcbiAqIGZpcnN0IGFycmF5L2FyZ3VtZW50cy4gIFRoaXMgbWV0aG9kIGRvZXMgbm90IGFsdGVyXG4gKiB0aGUgcGFzc2VkIGluIGFycmF5L2FyZ3VtZW50cy5cbiAqIFxuICogQHBhcmFtICB7QXJyYXkvYXJndW1lbnRzfSBmaXJzdEFycmF5T3JBcmdzXG4gKiBAcGFyYW0gIHtBcnJheS9hcmd1bWVudHN9IHNlY29uZEFycmF5T3JBcmdzXG4gKiBAcGFyYW0gIHtOdW1iZXIvdHJ1ZX0gaW5kZXhPckFwcGVuZCB0cnVlIHRvIGFwcGVuZCBcbiAqIHRoZSBzZWNvbmQgYXJyYXkgdG8gdGhlIGVuZCBvZiB0aGUgZmlyc3Qgb25lLiAgSWYgaXQgaXMgYSBudW1iZXJcbiAqIGluc2VydCB0aGUgc2Vjb25kQXJyYXkgaW50byB0aGUgZmlyc3Qgb25lIGF0IHRoZSBwYXNzZWQgaW4gaW5kZXguXG4gKiBAcmV0dXJuIHtBcnJheX0gdGhlIG5ld2x5IGNyZWF0ZWQgYXJyYXkuXG4gKlxuICAgIEx1Yy5BcnJheS5pbnNlcnQoWzAsNF0sIFsxLDIsM10sIDEpO1xuICAgID5bMCwgMSwgMiwgMywgNF1cbiAgICBMdWMuQXJyYXkuaW5zZXJ0KFswLDRdLCBbMSwyLDNdLCB0cnVlKTtcbiAgICA+WzAsIDQsIDEsIDIsIDNdXG4gICAgTHVjLkFycmF5Lmluc2VydChbMCw0XSwgWzEsMiwzXSwgMCk7XG4gICAgPlsxLCAyLCAzLCAwLCA0XVxuICpcbiAqL1xuZnVuY3Rpb24gaW5zZXJ0KGZpcnN0QXJyYXlPckFyZ3MsIHNlY29uZEFycmF5T3JBcmdzLCBpbmRleE9yQXBwZW5kKSB7XG4gICAgdmFyIGZpcnN0QXJyYXkgPSBhcnJheVNsaWNlLmNhbGwoZmlyc3RBcnJheU9yQXJncyksXG4gICAgICAgIHNlY29uZEFycmF5ID0gYXJyYXlTbGljZS5jYWxsKHNlY29uZEFycmF5T3JBcmdzKSxcbiAgICAgICAgc3BsaWNlQXJncztcblxuICAgIGlmKGluZGV4T3JBcHBlbmQgPT09IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIGZpcnN0QXJyYXkuY29uY2F0KHNlY29uZEFycmF5KTtcbiAgICB9XG5cbiAgICBzcGxpY2VBcmdzID0gW2luZGV4T3JBcHBlbmQsIDBdLmNvbmNhdChzZWNvbmRBcnJheSk7XG4gICAgZmlyc3RBcnJheS5zcGxpY2UuYXBwbHkoZmlyc3RBcnJheSwgc3BsaWNlQXJncyk7XG4gICAgcmV0dXJuIGZpcnN0QXJyYXk7XG59XG5cbi8qKlxuICogUmVtb3ZlIGFuIGl0ZW0gZnJvbSB0aGUgcGFzc2VkIGluIGFyclxuICogZnJvbSB0aGUgaW5kZXguXG4gKiBAcGFyYW0gIHtBcnJheX0gYXJyXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IGluZGV4XG4gKiBAcmV0dXJuIHtPYmplY3R9IHRoZSBpdGVtIHJlbW92ZWQuXG4gKlxuICAgIHZhciBhcnIgPSBbMSwyLDNdO1xuICAgIEx1Yy5BcnJheS5yZW1vdmVBdEluZGV4KGFyciwgMSk7XG4gICAgPjJcbiAgICBhcnI7XG4gICAgPlsxLDNdXG5cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlQXRJbmRleChhcnIsIGluZGV4KSB7XG4gICAgdmFyIGl0ZW0gPSBhcnJbaW5kZXhdO1xuICAgIGFyci5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIHJldHVybiBpdGVtO1xufVxuXG5mdW5jdGlvbiBfcmVtb3ZlRmlyc3QoYXJyLCBmbikge1xuICAgIHZhciByZW1vdmVkID0gZmFsc2U7XG5cbiAgICBhcnIuc29tZShmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcbiAgICAgICAgaWYgKGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpIHtcbiAgICAgICAgICAgIHJlbW92ZWQgPSByZW1vdmVBdEluZGV4KGFyciwgaW5kZXgpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiByZW1vdmVkO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgZmlyc3QgaXRlbSBmcm9tIHRoZSBwYXNzZWQgaW4gYXJyYXlcbiAqIHRoYXQge0BsaW5rIEx1YyNjb21wYXJlIG1hdGNoZXN9IHRoZSBwYXNzZWQgaW4gb2JqZWN0LiAgSW5zdGVhZCBvZiBcbiAqIGNvbXBhcmluZyBhbiBvYmplY3QgYW4gaXRlcmF0b3IgZnVuY3Rpb24gY2FuIGJlXG4gKiB1c2VkLlxuICogXG57Y29weURvYyNhcnJQYXJhbXN9XG57Y29weURvYyNhcnJSZW1vdmVTaW5nbGV9XG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUZpcnN0KGFyciwgb2JqLCBjb25maWcpIHtcbiAgICB2YXIgZm4gPSBfY3JlYXRlSXRlcmF0b3JGbihvYmosIGNvbmZpZyk7XG4gICAgcmV0dXJuIF9yZW1vdmVGaXJzdChhcnIsIGZuKTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGZpcnN0IGl0ZW0gZnJvbSB0aGUgcGFzc2VkIGluIGFycmF5XG4gKiB0aGF0IGRvZXMgbm90IHtAbGluayBMdWMjY29tcGFyZSBtYXRjaH0gdGhlIHBhc3NlZCBpbiBvYmplY3QuICBJbnN0ZWFkIG9mIFxuICogY29tcGFyaW5nIGFuIG9iamVjdCBhbiBpdGVyYXRvciBmdW5jdGlvbiBjYW4gYmVcbiAqIHVzZWQuXG4gKiBcbntjb3B5RG9jI2FyclBhcmFtc31cbntjb3B5RG9jI2FyclJlbW92ZVNpbmdsZX1cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlRmlyc3ROb3QoYXJyLCBvYmosIGNvbmZpZykge1xuICAgIHZhciBmbiA9IF9jcmVhdGVJdGVyYXRvck5vdEZuKG9iaiwgY29uZmlnKTtcbiAgICByZXR1cm4gX3JlbW92ZUZpcnN0KGFyciwgZm4pO1xufVxuXG5cbmZ1bmN0aW9uIF9yZW1vdmVBbGwoYXJyLCBmbikge1xuICAgIHZhciBpbmRleHNUb1JlbW92ZSA9IFtdLFxuICAgICAgICByZW1vdmVkID0gW107XG5cbiAgICBhcnIuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcbiAgICAgICAgaWYgKGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpIHtcbiAgICAgICAgICAgIGluZGV4c1RvUmVtb3ZlLnVuc2hpZnQoaW5kZXgpO1xuICAgICAgICAgICAgcmVtb3ZlZC5wdXNoKHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgaW5kZXhzVG9SZW1vdmUuZm9yRWFjaChmdW5jdGlvbihpbmRleCl7XG4gICAgICAgIHJlbW92ZUF0SW5kZXgoYXJyLCBpbmRleCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVtb3ZlZDtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGFsbCB0aGUgaXRlbXMgZnJvbSB0aGUgcGFzc2VkIGluIGFycmF5XG4gKiB0aGF0IGRvIG5vdCB7QGxpbmsgTHVjI2NvbXBhcmUgbWF0Y2h9IHRoZSBwYXNzZWQgaW4gb2JqZWN0LiAgSW5zdGVhZCBvZiBcbiAqIGNvbXBhcmluZyBhbiBvYmplY3QgYW4gaXRlcmF0b3IgZnVuY3Rpb24gY2FuIGJlXG4gKiB1c2VkLlxuICogXG57Y29weURvYyNhcnJQYXJhbXN9XG57Y29weURvYyNhcnJSZW1vdmVBbGx9XG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUFsbE5vdChhcnIsIG9iaiwgY29uZmlnKSB7XG4gICAgdmFyIGZuID0gX2NyZWF0ZUl0ZXJhdG9yTm90Rm4ob2JqLCBjb25maWcpO1xuICAgIHJldHVybiBfcmVtb3ZlQWxsKGFyciwgZm4pO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgYWxsIHRoZSBpdGVtcyBmcm9tIHRoZSBwYXNzZWQgaW4gYXJyYXlcbiAqIHRoYXQge0BsaW5rIEx1YyNjb21wYXJlIG1hdGNoZXN9IHRoZSBwYXNzZWQgaW4gb2JqZWN0LiAgSW5zdGVhZCBvZiBcbiAqIGNvbXBhcmluZyBhbiBvYmplY3QgYW4gaXRlcmF0b3IgZnVuY3Rpb24gY2FuIGJlXG4gKiB1c2VkLlxuICogXG57Y29weURvYyNhcnJQYXJhbXN9XG57Y29weURvYyNhcnJSZW1vdmVBbGx9XG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUFsbChhcnIsIG9iaiwgY29uZmlnKSB7XG4gICAgdmFyIGZuID0gX2NyZWF0ZUl0ZXJhdG9yRm4ob2JqLCBjb25maWcpO1xuICAgIHJldHVybiBfcmVtb3ZlQWxsKGFyciwgZm4pO1xufVxuXG5mdW5jdGlvbiBfZmluZEZpcnN0KGFyciwgZm4pIHtcbiAgICB2YXIgaXRlbSA9IGZhbHNlO1xuICAgIGFyci5zb21lKGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xuICAgICAgICBpZiAoZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKSkge1xuICAgICAgICAgICAgaXRlbSA9IGFycltpbmRleF07XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGl0ZW07XG59XG5cbi8qKlxuICogRmluZCB0aGUgZmlyc3QgaXRlbSBmcm9tIHRoZSBwYXNzZWQgaW4gYXJyYXlcbiAqIHRoYXQgZG9lcyB7QGxpbmsgTHVjI2NvbXBhcmUgbWF0Y2hlc30gdGhlIHBhc3NlZCBpbiBvYmplY3QuICBJbnN0ZWFkIG9mIFxuICogY29tcGFyaW5nIGFuIG9iamVjdCBhbiBpdGVyYXRvciBmdW5jdGlvbiBjYW4gYmVcbiAqIHVzZWQuXG4gKiBcbntjb3B5RG9jI2FyclBhcmFtc31cbntjb3B5RG9jI2FyckZpbmRTaW5nbGV9XG4gKi9cbmZ1bmN0aW9uIGZpbmRGaXJzdChhcnIsIG9iaiwgY29uZmlnKSB7XG4gICAgdmFyIGZuID0gX2NyZWF0ZUl0ZXJhdG9yRm4ob2JqLCBjb25maWcpO1xuICAgIHJldHVybiBfZmluZEZpcnN0KGFyciwgZm4pO1xufVxuXG4vKipcbiAqIEZpbmQgdGhlIGZpcnN0IGl0ZW0gZnJvbSB0aGUgcGFzc2VkIGluIGFycmF5XG4gKiB0aGF0IGRvZXMgbm90IHtAbGluayBMdWMjY29tcGFyZSBtYXRjaH0gdGhlIHBhc3NlZCBpbiBvYmplY3QuICBJbnN0ZWFkIG9mIFxuICogY29tcGFyaW5nIGFuIG9iamVjdCBhbiBpdGVyYXRvciBmdW5jdGlvbiBjYW4gYmVcbiAqIHVzZWQuXG4gKiBcbntjb3B5RG9jI2FyclBhcmFtc31cbntjb3B5RG9jI2FyckZpbmRTaW5nbGV9XG4gKi9cbmZ1bmN0aW9uIGZpbmRGaXJzdE5vdChhcnIsIG9iaiwgY29uZmlnKSB7XG4gICAgdmFyIGZuID0gX2NyZWF0ZUl0ZXJhdG9yTm90Rm4ob2JqLCBjb25maWcpO1xuICAgIHJldHVybiBfZmluZEZpcnN0KGFyciwgZm4pO1xufVxuXG5mdW5jdGlvbiBfZmluZEFsbChhcnIsIGZuKSB7XG4gICAgcmV0dXJuIGFyci5maWx0ZXIoZm4pO1xufVxuXG4vKipcbiAqIEZpbmQgYWxsIG9mIHRoZSB0aGUgaXRlbXMgZnJvbSB0aGUgcGFzc2VkIGluIGFycmF5XG4gKiB0aGF0IHtAbGluayBMdWMjY29tcGFyZSBtYXRjaGVzfSB0aGUgcGFzc2VkIGluIG9iamVjdC4gIEluc3RlYWQgb2YgXG4gKiBjb21wYXJpbmcgYW4gb2JqZWN0IGFuIGl0ZXJhdG9yIGZ1bmN0aW9uIGNhbiBiZVxuICogdXNlZC5cbiAqIFxue2NvcHlEb2MjYXJyUGFyYW1zfVxue2NvcHlEb2MjYXJyRmluZEFsbH1cbiAqL1xuZnVuY3Rpb24gZmluZEFsbChhcnIsIG9iaiwgY29uZmlnKSB7XG4gICAgdmFyIGZuID0gX2NyZWF0ZUl0ZXJhdG9yRm4ob2JqLCBjb25maWcpO1xuICAgIHJldHVybiBfZmluZEFsbChhcnIsIGZuKTtcbn1cblxuLyoqXG4gKiBGaW5kIGFsbCBvZiB0aGUgdGhlIGl0ZW1zIGZyb20gdGhlIHBhc3NlZCBpbiBhcnJheVxuICogdGhhdCBkbyBub3Qge0BsaW5rIEx1YyNjb21wYXJlIG1hdGNofSB0aGUgcGFzc2VkIGluIG9iamVjdC4gIEluc3RlYWQgb2YgXG4gKiBjb21wYXJpbmcgYW4gb2JqZWN0IGFuIGl0ZXJhdG9yIGZ1bmN0aW9uIGNhbiBiZVxuICogdXNlZC5cbiAqIFxue2NvcHlEb2MjYXJyUGFyYW1zfVxue2NvcHlEb2MjYXJyRmluZEFsbH1cbiAqL1xuZnVuY3Rpb24gZmluZEFsbE5vdChhcnIsIG9iaiwgY29uZmlnKSB7XG4gICAgdmFyIGZuID0gX2NyZWF0ZUl0ZXJhdG9yTm90Rm4ob2JqLCBjb25maWcpO1xuICAgIHJldHVybiBfZmluZEFsbChhcnIsIGZuKTtcbn1cblxuXG5leHBvcnRzLnRvQXJyYXkgPSB0b0FycmF5O1xuZXhwb3J0cy5lYWNoID0gZWFjaDtcbmV4cG9ydHMuaW5zZXJ0ID0gaW5zZXJ0O1xuZXhwb3J0cy5mcm9tSW5kZXggPSBmcm9tSW5kZXg7XG5leHBvcnRzLmxhc3QgPSBsYXN0O1xuZXhwb3J0cy5wbHVjayA9IHBsdWNrO1xuXG5leHBvcnRzLnJlbW92ZUF0SW5kZXggPSByZW1vdmVBdEluZGV4O1xuZXhwb3J0cy5maW5kRmlyc3ROb3QgPSBmaW5kRmlyc3ROb3Q7XG5leHBvcnRzLmZpbmRBbGxOb3QgPSBmaW5kQWxsTm90O1xuZXhwb3J0cy5maW5kRmlyc3QgPSBmaW5kRmlyc3Q7XG5leHBvcnRzLmZpbmRBbGwgPSBmaW5kQWxsO1xuXG5leHBvcnRzLnJlbW92ZUZpcnN0Tm90ID0gcmVtb3ZlRmlyc3ROb3Q7XG5leHBvcnRzLnJlbW92ZUFsbE5vdCA9IHJlbW92ZUFsbE5vdDtcbmV4cG9ydHMucmVtb3ZlRmlyc3QgPSByZW1vdmVGaXJzdDtcbmV4cG9ydHMucmVtb3ZlQWxsID0gcmVtb3ZlQWxsO1xuXG4oZnVuY3Rpb24oKXtcbiAgICB2YXIgX2NyZWF0ZUxhc3RGbiA9IGZ1bmN0aW9uKGZuTmFtZSkge1xuICAgICAgICB2YXIgbGFzdE5hbWUgPSBmbk5hbWUucmVwbGFjZSgnRmlyc3QnLCAnTGFzdCcpO1xuXG4gICAgICAgIGV4cG9ydHNbbGFzdE5hbWVdID0gZnVuY3Rpb24oYXJyLCBvYmosIGNvbmZpZykge1xuICAgICAgICAgICAgdmFyIHJldDtcblxuICAgICAgICAgICAgYXJyLnJldmVyc2UoKTtcbiAgICAgICAgICAgIHJldCA9IGV4cG9ydHNbZm5OYW1lXShhcnIsIG9iaiwgY29uZmlnKTtcbiAgICAgICAgICAgIGFyci5yZXZlcnNlKCk7XG5cbiAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH07XG5cbiAgICB9LCBuYW1lc1RvQWRkTGFzdCA9IFsnZmluZEZpcnN0Tm90JywgJ2ZpbmRGaXJzdCcsICdyZW1vdmVGaXJzdE5vdCcsICdyZW1vdmVGaXJzdCddO1xuXG4gICAgbmFtZXNUb0FkZExhc3QuZm9yRWFjaChmdW5jdGlvbihmbk5hbWUpIHtcbiAgICAgICAgX2NyZWF0ZUxhc3RGbihmbk5hbWUpO1xuICAgIH0pO1xuXG59KCkpO1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjLkFycmF5IFxuICogQG1ldGhvZCBmaW5kTGFzdE5vdCBcbiAqIFNhbWUgYXMgTHVjLkFycmF5LmZpbmRGaXJzdE5vdCBleGNlcHQgc3RhcnQgYXQgdGhlIGVuZC5cbiAqL1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjLkFycmF5IFxuICogQG1ldGhvZCBmaW5kTGFzdFxuICogU2FtZSBhcyBMdWMuQXJyYXkuZmluZEZpcnN0IGV4Y2VwdCBzdGFydCBhdCB0aGUgZW5kLlxuICovXG5cbi8qKlxuICogQG1lbWJlciBMdWMuQXJyYXkgXG4gKiBAbWV0aG9kIHJlbW92ZUxhc3ROb3QgXG4gKiBTYW1lIGFzIEx1Yy5BcnJheS5yZW1vdmVGaXJzdE5vdCBleGNlcHQgc3RhcnQgYXQgdGhlIGVuZC5cbiAqL1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjLkFycmF5IFxuICogQG1ldGhvZCByZW1vdmVMYXN0IFxuICogU2FtZSBhcyBMdWMuQXJyYXkucmVtb3ZlRmlyc3QgZXhjZXB0IHN0YXJ0IGF0IHRoZSBlbmQuXG4gKi9cbiIsInZhciBhcnJheSA9IHJlcXVpcmUoJy4vYXJyYXknKSxcbiAgICBpcyA9IHJlcXVpcmUoJy4vaXMnKSxcbiAgICBHZW5lcmF0b3I7XG5cbkdlbmVyYXRvciA9IHtcbiAgICBhcnJheUZuTmFtZXM6IFsnZmluZEZpcnN0Tm90JywgJ2ZpbmRBbGxOb3QnLCAnZmluZEZpcnN0JywgJ2ZpbmRBbGwnLFxuICAgICAgICAgICAgJ3JlbW92ZUZpcnN0Tm90JywgJ3JlbW92ZUFsbE5vdCcsICdyZW1vdmVGaXJzdCcsICdyZW1vdmVBbGwnLFxuICAgICAgICAgICAgJ3JlbW92ZUxhc3ROb3QnLCAncmVtb3ZlTGFzdCcsICdmaW5kTGFzdCcsICdmaW5kTGFzdE5vdCdcbiAgICBdLFxuXG4gICAgY3JlYXRlRm46IGZ1bmN0aW9uKGFycmF5Rm5OYW1lLCBmbikge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oYXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gYXJyYXlbYXJyYXlGbk5hbWVdKGFyciwgZm4pO1xuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBjcmVhdGVCb3VuZEZuOiBmdW5jdGlvbihhcnJheUZuTmFtZSwgZm5Ub0JpbmQpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGFyciwgdmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBmbiA9IGZuVG9CaW5kLmFwcGx5KHRoaXMsIGFycmF5LmZyb21JbmRleChhcmd1bWVudHMsIDEpKTtcbiAgICAgICAgICAgIHJldHVybiBhcnJheVthcnJheUZuTmFtZV0oYXJyLCBmbik7XG4gICAgICAgIH07XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBHZW5lcmF0b3I7XG5cbi8qKlxuICogQGNsYXNzIEx1Yy5BcnJheUZuc1xuICogVGhpcyBpcyBkb2N1bWVudGVkIGFzIGEgc2VwYXJhdGUgcGFja2FnZSBidXQgaXQgYWN0dWFsbHkgZXhpc3RzIHVuZGVyIHRoZSBcbiAqIEx1Yy5BcnJheSBuYW1lc3BhY2UuICBDaGVjayBvdXQgdGhlIFwiRmlsdGVyIGNsYXNzIG1lbWJlcnNcIiBpbnB1dCBib3hcbiAqIGp1c3QgdG8gdGhlIHJpZ2h0IHdoZW4gc2VhcmNoaW5nIGZvciBmdW5jdGlvbnMuXG4gKjxicj5cbiAqIFxuICogVGhlcmUgYXJlIGEgbG90IG9mIGZ1bmN0aW9ucyBpbiB0aGlzIHBhY2thZ2UgYnV0IGFsbCBvZiB0aGVtIFxuICogZm9sbG93IHRoZSBzYW1lIGFwaS4gIFxcKkFsbCBmdW5jdGlvbnMgd2lsbCByZXR1cm4gYW4gYXJyYXkgb2YgcmVtb3ZlZCBvciBmb3VuZFxuICogaXRlbXMuICBUaGUgaXRlbXMgd2lsbCBiZSBhZGRlZCB0byB0aGUgYXJyYXkgaW4gdGhlIG9yZGVyIHRoZXkgYXJlXG4gKiBmb3VuZC4gIFxcKkZpcnN0IGZ1bmN0aW9ucyB3aWxsIHJldHVybiB0aGUgZmlyc3QgaXRlbSBhbmQgc3RvcCBpdGVyYXRpbmcgYWZ0ZXIgdGhhdCwgaWYgbm9uZVxuICogIGlzIGZvdW5kIGZhbHNlIGlzIHJldHVybmVkLiAgcmVtb3ZlXFwqIGZ1bmN0aW9ucyB3aWxsIGRpcmVjdGx5IGNoYW5nZSB0aGUgcGFzc2VkIGluIGFycmF5LlxuICogIFxcKk5vdCBmdW5jdGlvbnMgb25seSBkbyB0aGUgZm9sbG93aW5nIGFjdGlvbnMgaWYgdGhlIGNvbXBhcmlzb24gaXMgbm90IHRydWUuXG4gKiAgXFwqTGFzdCBmdW5jdGlvbnMgZG8gdGhlIHNhbWUgYXMgdGhlaXIgXFwqRmlyc3QgY291bnRlcnBhcnRzIGV4Y2VwdCB0aGF0IHRoZSBpdGVyYXRpbmdcbiAqICBzdGFydHMgYXQgdGhlIGVuZCBvZiB0aGUgYXJyYXkuIEFsbW9zdCBldmVyeSBwdWJsaWMgbWV0aG9kIG9mIEx1Yy5pcyBpcyBhdmFpbGFibGUgaXRcbiAqICB1c2VzIHRoZSBmb2xsb3dpbmcgZ3JhbW1hciBMdWMuQXJyYXlbXCJtZXRob2ROYW1lXCJcImlzTWV0aG9kTmFtZVwiXVxuICpcbiAgICAgIEx1Yy5BcnJheS5maW5kQWxsTm90RW1wdHkoW2ZhbHNlLCB0cnVlLCBudWxsLCB1bmRlZmluZWQsIDAsICcnLCBbXSwgWzFdXSlcbiAgICAgID4gW3RydWUsIDAsIFsxXV1cblxuICAgICAgLy9PciByZW1vdmUgYWxsIGVtcHR5IGl0ZW1zXG4gICAgICB2YXIgYXJyID0gWycnLCAwICwgW10sIHthOjF9LCB0cnVlLCB7fSwgWzFdXVxuICAgICAgTHVjLkFycmF5LnJlbW92ZUFsbEVtcHR5KGFycilcbiAgICAgID5bJycsIFtdLCB7fV1cbiAgICAgIGFyclxuICAgICAgPlswLCB7YToxfSwgdHJ1ZSwgWzFdXVxuICAgICBcbiAgICAgIEx1Yy5BcnJheS5maW5kRmlyc3ROb3RTdHJpbmcoWzEsMiwzLCc1J10pXG4gICAgICA+MVxuICAgICAgdmFyIGFyciA9IFsxLDIsMywnNSddO1xuICAgICAgTHVjLkFycmF5LnJlbW92ZUFsbE5vdFN0cmluZyhhcnIpO1xuICAgICAgPlsxLDIsM11cbiAgICAgIGFyclxuICAgICAgPltcIjVcIl1cbiAqXG4gKiBBcyBvZiByaWdodCBub3cgdGhlcmUgYXJlIHR3byBmdW5jdGlvbiBzZXRzIHdoaWNoIGRpZmZlciBmcm9tIHRoZSBpc1xuICogYXBpLlxuICpcbiAqIEluc3RhbmNlT2ZcbiAqIFxuICAgIEx1Yy5BcnJheS5maW5kQWxsSW5zdGFuY2VPZihbMSwyLCBuZXcgRGF0ZSgpLCB7fSwgW11dLCBPYmplY3QpXG4gICAgPltkYXRlLCB7fSwgW11dXG4gICAgPkx1Yy5BcnJheS5maW5kQWxsTm90SW5zdGFuY2VPZihbMSwyLCBuZXcgRGF0ZSgpLCB7fSwgW11dLCBPYmplY3QpXG4gICAgWzEsIDJdXG4gKlxuICogSW5cbiAqIFxuICAgIEx1Yy5BcnJheS5maW5kQWxsSW4oWzEsMiwzXSwgWzEsMl0pXG4gICAgPlsxLCAyXVxuICAgIEx1Yy5BcnJheS5maW5kRmlyc3RJbihbMSwyLDNdLCBbMSwyXSlcbiAgICA+MVxuXG4gICAgLy9kZWZhdWx0cyB0byBsb29zZSBjb21wYXJpc29uXG4gICAgTHVjLkFycmF5LmZpbmRBbGxJbihbMSwyLDMsIHthOjEsIGI6Mn1dLCBbMSx7YToxfV0pXG4gICAgPiBbMSwge2E6MSxiOjJ9XVxuXG4gICAgTHVjLkFycmF5LmZpbmRBbGxJbihbMSwyLDMsIHthOjEsIGI6Mn1dLCBbMSx7YToxfV0sIHt0eXBlOiAnZGVlcCd9KVxuICAgID5bMV1cbiAqL1xuXG4oZnVuY3Rpb24gX2NyZWF0ZUlzRm5zKCkge1xuICAgIHZhciBpc1RvSWdub3JlID0gWydpc1JlZ0V4cCcsICdpc0FyZ3VtZW50cyddO1xuXG4gICAgT2JqZWN0LmtleXMoaXMpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIHZhciBuYW1lID0ga2V5LnNwbGl0KCdpcycpWzFdO1xuICAgICAgICBHZW5lcmF0b3IuYXJyYXlGbk5hbWVzLmZvckVhY2goZnVuY3Rpb24oZm5OYW1lKSB7XG4gICAgICAgICAgICBpZihpc1RvSWdub3JlLmluZGV4T2Yoa2V5KSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICBhcnJheVtmbk5hbWUgKyBuYW1lXSA9IEdlbmVyYXRvci5jcmVhdGVGbihmbk5hbWUsIGlzW2tleV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn0oKSk7XG5cbihmdW5jdGlvbiBfY3JlYXRlRmFsc3lGbnMoKSB7XG4gICAgdmFyIHVzZWZ1bGxGYWxzeUZucyA9IFsnZmluZEZpcnN0Tm90JywgJ2ZpbmRBbGxOb3QnLCAncmVtb3ZlRmlyc3ROb3QnLCAncmVtb3ZlQWxsTm90JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAncmVtb3ZlRmlyc3QnLCAncmVtb3ZlQWxsJywgJ3JlbW92ZUxhc3ROb3QnLCAncmVtb3ZlTGFzdCcsICAnZmluZExhc3ROb3QnXTtcblxuICAgIHZhciBmbnMgPSB7XG4gICAgICAgICdGYWxzZSc6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbCA9PT0gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgICdUcnVlJzogZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsID09PSB0cnVlO1xuICAgICAgICB9LFxuICAgICAgICAnTnVsbCc6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbCA9PT0gbnVsbDtcbiAgICAgICAgfSxcbiAgICAgICAgJ1VuZGVmaW5lZCc6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbCA9PT0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIE9iamVjdC5rZXlzKGZucykuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgdXNlZnVsbEZhbHN5Rm5zLmZvckVhY2goZnVuY3Rpb24oZm5OYW1lKSB7XG4gICAgICAgICAgICBhcnJheVtmbk5hbWUgKyBrZXldID0gR2VuZXJhdG9yLmNyZWF0ZUZuKGZuTmFtZSwgZm5zW2tleV0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0oKSk7XG5cbihmdW5jdGlvbiBfY3JlYXRlQm91bmRGbnMoKSB7XG4gICAgdmFyIGZucyA9IHtcbiAgICAgICAgJ0luc3RhbmNlT2YnOiBmdW5jdGlvbihDb25zdHJ1Y3Rvcikge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICh2YWx1ZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sJ0luJzogZnVuY3Rpb24oYXJyLCBjKSB7XG4gICAgICAgICAgICB2YXIgZGVmYXVsdEMgPSB7dHlwZTonbG9vc2VSaWdodCd9O1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYodmFsdWUgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjZmcgPSBjIHx8IGRlZmF1bHRDO1xuICAgICAgICAgICAgICAgICAgICAvL3RoaXMgaXMgYSByaWdodCB0byBsZWZ0IGNvbXBhcmlzb24gXG4gICAgICAgICAgICAgICAgICAgIC8vZXhwZWN0ZWQgbG9vc2UgYmVoYXZpb3Igc2hvdWxkIGJlIGxvb3NlUmlnaHRcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFycmF5LmZpbmRGaXJzdChhcnIsIHZhbHVlLCBjZmcudHlwZSA9PT0gJ2xvb3NlJyA/IGRlZmF1bHRDIDogY2ZnKSAhPT0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHJldHVybiBhcnIuaW5kZXhPZihmYWxzZSkgPiAtMTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgT2JqZWN0LmtleXMoZm5zKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICBHZW5lcmF0b3IuYXJyYXlGbk5hbWVzLmZvckVhY2goZnVuY3Rpb24oZm5OYW1lKSB7XG4gICAgICAgICAgICBhcnJheVtmbk5hbWUgKyBrZXldID0gR2VuZXJhdG9yLmNyZWF0ZUJvdW5kRm4oZm5OYW1lLCBmbnNba2V5XSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSgpKTsiLCJ2YXIgaXMgPSByZXF1aXJlKCcuL2lzJyk7XG5cbmZ1bmN0aW9uIF9zdHJpY3QodmFsMSwgdmFsMil7XG4gICAgcmV0dXJuIHZhbDEgPT09IHZhbDI7XG59XG5cbmZ1bmN0aW9uIF9jb21wYXJlQXJyYXlMZW5ndGgodmFsMSwgdmFsMikge1xuICAgIHJldHVybihpcy5pc0FycmF5KHZhbDEpICYmIGlzLmlzQXJyYXkodmFsMikgICYmIHZhbDEubGVuZ3RoID09PSB2YWwyLmxlbmd0aCk7XG59XG5cbmZ1bmN0aW9uIF9zaGFsbG93QXJyYXkodmFsMSwgdmFsMikge1xuICAgIHZhciBpID0gMCxcbiAgICAgICAgbGVuO1xuICAgIFxuICAgIGlmKCFfY29tcGFyZUFycmF5TGVuZ3RoKHZhbDEsIHZhbDIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IobGVuID0gdmFsMS5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgICBpZih2YWwxW2ldICE9PSB2YWwyW2ldKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gX2RlZXBBcnJheSh2YWwxLCB2YWwyLCBjb25maWcpIHtcbiAgICB2YXIgaSA9IDAsXG4gICAgICAgIGxlbjtcbiAgICBcbiAgICBpZighX2NvbXBhcmVBcnJheUxlbmd0aCh2YWwxLCB2YWwyKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZm9yKGxlbiA9IHZhbDEubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgaWYoIWNvbXBhcmUodmFsMVtpXSx2YWwyW2ldLCBjb25maWcpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gX2NvbXBhcmVPYmplY3RLZXlzTGVuZ3RoKHZhbDEsIHZhbDIpIHtcbiAgICByZXR1cm4gKGlzLmlzT2JqZWN0KHZhbDEpICYmIGlzLmlzT2JqZWN0KHZhbDIpICYmIE9iamVjdC5rZXlzKHZhbDEpLmxlbmd0aCA9PT0gT2JqZWN0LmtleXModmFsMikubGVuZ3RoKTtcbn1cblxuZnVuY3Rpb24gX3NoYWxsb3dPYmplY3QodmFsMSwgdmFsMikge1xuICAgIHZhciBrZXksIHZhbDtcblxuICAgIGlmICghX2NvbXBhcmVPYmplY3RLZXlzTGVuZ3RoKHZhbDEsIHZhbDIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IgKGtleSBpbiB2YWwxKSB7XG4gICAgICAgIGlmICh2YWwxLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsMVtrZXldO1xuICAgICAgICAgICAgaWYgKCF2YWwyLmhhc093blByb3BlcnR5KGtleSkgfHwgdmFsMltrZXldICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBfZGVlcE9iamVjdCh2YWwxLCB2YWwyLCBjb25maWcpIHtcbiAgICB2YXIga2V5LCB2YWw7XG5cbiAgICBpZiAoIV9jb21wYXJlT2JqZWN0S2V5c0xlbmd0aCh2YWwxLCB2YWwyKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZm9yIChrZXkgaW4gdmFsMSkge1xuICAgICAgICBpZiAodmFsMS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbDFba2V5XTtcbiAgICAgICAgICAgIGlmICghdmFsMi5oYXNPd25Qcm9wZXJ0eShrZXkpIHx8IGNvbXBhcmUodmFsdWUsIHZhbDJba2V5XSwgY29uZmlnKSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuXG59XG5cbmZ1bmN0aW9uIF9sb29zZU9iamVjdCh2YWwxLCB2YWwyLCBjb25maWcpIHtcbiAgICB2YXIga2V5LCB2YWw7XG5cbiAgICBpZighKGlzLmlzT2JqZWN0KHZhbDEpICYmIGlzLmlzT2JqZWN0KHZhbDIpKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYoY29uZmlnLnR5cGUgPT09ICdsb29zZVJpZ2h0Jykge1xuICAgICAgICBmb3IgKGtleSBpbiB2YWwyKSB7XG4gICAgICAgICAgICBpZiAodmFsMi5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB2YWwyW2tleV07XG4gICAgICAgICAgICAgICAgaWYgKGNvbXBhcmUodmFsdWUsIHZhbDFba2V5XSwgY29uZmlnKSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBmb3IgKGtleSBpbiB2YWwxKSB7XG4gICAgICAgICAgICBpZiAodmFsMS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB2YWwxW2tleV07XG4gICAgICAgICAgICAgICAgaWYgKGNvbXBhcmUodmFsdWUsIHZhbDJba2V5XSwgY29uZmlnKSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICByZXR1cm4gdHJ1ZTtcblxufVxuXG5mdW5jdGlvbiBfZGF0ZSh2YWwxLCB2YWwyKSB7XG4gICAgaWYoaXMuaXNEYXRlKHZhbDEpICYmIGlzLmlzRGF0ZSh2YWwyKSkge1xuICAgICAgICByZXR1cm4gdmFsMS5nZXRUaW1lKCkgPT09IHZhbDIuZ2V0VGltZSgpO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gX2NyZWF0ZUJvdW5kQ29tcGFyZShvYmplY3QsIGZuKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBmbihvYmplY3QsIHZhbHVlKTtcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBnZXRDb21wYXJlRm4ob2JqZWN0LCBjKSB7XG4gICAgdmFyIGNvbXBhcmVGbiA9IF9zdHJpY3QsXG4gICAgICAgIGNvbmZpZyA9IGMgfHwge30sXG4gICAgICAgIHR5cGUgPSBjb25maWcudHlwZTtcblxuICAgIGlmICh0eXBlID09PSAnZGVlcCcgfHwgdHlwZSA9PT0gJ2xvb3NlJyB8fCB0eXBlID09PSAnbG9vc2VSaWdodCcgfHwgdHlwZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChpcy5pc09iamVjdChvYmplY3QpKSB7XG4gICAgICAgICAgICBjb21wYXJlRm4gPSB0eXBlID09PSAnbG9vc2UnIHx8IHR5cGUgPT09ICdsb29zZVJpZ2h0JyA/IF9sb29zZU9iamVjdCA6IF9kZWVwT2JqZWN0O1xuICAgICAgICB9IGVsc2UgaWYgKGlzLmlzQXJyYXkob2JqZWN0KSkge1xuICAgICAgICAgICAgY29tcGFyZUZuID0gX2RlZXBBcnJheTtcbiAgICAgICAgfSBlbHNlIGlmIChpcy5pc0RhdGUob2JqZWN0KSkge1xuICAgICAgICAgICAgY29tcGFyZUZuID0gX2RhdGU7XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdzaGFsbG93Jykge1xuICAgICAgICBpZiAoaXMuaXNPYmplY3Qob2JqZWN0KSkge1xuICAgICAgICAgICAgY29tcGFyZUZuID0gX3NoYWxsb3dPYmplY3Q7XG4gICAgICAgIH0gZWxzZSBpZiAoaXMuaXNBcnJheShvYmplY3QpKSB7XG4gICAgICAgICAgICBjb21wYXJlRm4gPSBfc2hhbGxvd0FycmF5O1xuICAgICAgICB9IGVsc2UgaWYgKGlzLmlzRGF0ZShvYmplY3QpKSB7XG4gICAgICAgICAgICBjb21wYXJlRm4gPSBfZGF0ZTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZSAhPT0gJ3N0cmljdCcpIHtcbiAgICAgICAgLy93ZSB3b3VsZCBiZSBkb2luZyBhIHN0cmljdCBjb21wYXJpc29uIG9uIGEgdHlwZS1vXG4gICAgICAgIC8vSSB0aGluayBhbiBlcnJvciBpcyBnb29kIGhlcmUuXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignWW91IHBhc3NlZCBpbiBhbiBpbnZhbGlkIGNvbXBhcmlzb24gdHlwZScpO1xuICAgIH1cblxuICAgIHJldHVybiBjb21wYXJlRm47XG59XG5cbi8qKlxuICogQG1lbWJlciBMdWNcbiAqIEBtZXRob2QgY29tcGFyZVxuICogXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWVzIGFyZSBlcXVhbCB0byBlYWNoXG4gKiBvdGhlci4gIEJ5IGRlZmF1bHQgYSBkZWVwIGNvbXBhcmlzb24gaXMgXG4gKiBkb25lIG9uIGFycmF5cywgZGF0ZXMgYW5kIG9iamVjdHMgYW5kIGEgc3RyaWN0IGNvbXBhcmlzb25cbiAqIGlzIGRvbmUgb24gb3RoZXIgdHlwZXMuXG4gKiBcbiAqIEBwYXJhbSAge0FueX0gdmFsMSAgXG4gKiBAcGFyYW0gIHtBbnl9IHZhbDIgICBcbiAqIEBwYXJhbSAge09iamVjdH0gW2NvbmZpZ11cbiAqIEBwYXJhbSB7U3RyaW5nfSBjb25maWcudHlwZSBwYXNzIGluICdzaGFsbG93JyBmb3IgYSBzaGFsbG93XG4gKiBjb21wYXJpc29uLCAnZGVlcCcgKGRlZmF1bHQpIGZvciBhIGRlZXAgY29tcGFyaXNvblxuICogJ3N0cmljdCcgZm9yIGEgc3RyaWN0ID09PSBjb21wYXJpc29uIGZvciBhbGwgb2JqZWN0cyBvciBcbiAqICdsb29zZScgZm9yIGEgbG9vc2UgY29tcGFyaXNvbiBvbiBvYmplY3RzLiAgQSBsb29zZSBjb21wYXJpc29uXG4gKiAgd2lsbCBjb21wYXJlIHRoZSBrZXlzIGFuZCB2YWx1ZXMgb2YgdmFsMSB0byB2YWwyIGFuZCBkb2VzIG5vdFxuICogIGNoZWNrIGlmIGtleXMgZnJvbSB2YWwyIGFyZSBlcXVhbCB0byB0aGUga2V5cyBpbiB2YWwxLlxuICpcbiAqXG4gICAgTHVjLmNvbXBhcmUoJzEnLCAxKVxuICAgID5mYWxzZVxuICAgIEx1Yy5jb21wYXJlKHthOiAxfSwge2E6IDF9KVxuICAgID50cnVlXG4gICAgTHVjLmNvbXBhcmUoe2E6IDEsIGI6IHt9fSwge2E6IDEsIGI6IHt9IH0sIHt0eXBlOidzaGFsbG93J30pXG4gICAgPmZhbHNlXG4gICAgTHVjLmNvbXBhcmUoe2E6IDEsIGI6IHt9fSwge2E6IDEsIGI6IHt9IH0sIHt0eXBlOiAnZGVlcCd9KVxuICAgID50cnVlXG4gICAgTHVjLmNvbXBhcmUoe2E6IDEsIGI6IHt9fSwge2E6IDEsIGI6IHt9IH0sIHt0eXBlOiAnc3RyaWN0J30pXG4gICAgPmZhbHNlXG4gICAgTHVjLmNvbXBhcmUoe2E6IDF9LCB7YToxLGI6MX0pXG4gICAgPmZhbHNlXG4gICAgTHVjLmNvbXBhcmUoe2E6IDF9LCB7YToxLGI6MX0sIHt0eXBlOiAnbG9vc2UnfSlcbiAgICA+dHJ1ZVxuICAgIEx1Yy5jb21wYXJlKHthOiAxfSwge2E6MSxiOjF9LCB7dHlwZTogJ2xvb3NlJ30pXG4gICAgPnRydWVcbiAgICBMdWMuY29tcGFyZShbe2E6IDF9XSwgW3thOjEsYjoxfV0sIHt0eXBlOiAnbG9vc2UnfSlcbiAgICA+dHJ1ZVxuICAgIEx1Yy5jb21wYXJlKFt7YTogMX0sIHt9XSwgW3thOjEsYjoxfV0sIHt0eXBlOiAnbG9vc2UnfSlcbiAgICA+ZmFsc2VcbiAgICBMdWMuY29tcGFyZShbe2E6IDF9LCB7fV0sIFt7YToxLGI6MX0sIHt9XSwge3R5cGU6ICdsb29zZSd9KVxuICAgID50cnVlXG4gICAgTHVjLmNvbXBhcmUoW3thOjEsYjoxfV0sIFt7YTogMX1dLCB7dHlwZTogJ2xvb3NlJ30pXG4gICAgPmZhbHNlXG5cbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGNvbXBhcmUodmFsMSwgdmFsMiwgY29uZmlnKSB7XG4gICAgcmV0dXJuIGdldENvbXBhcmVGbih2YWwxLCBjb25maWcpKHZhbDEsIHZhbDIsIGNvbmZpZyk7XG59XG5cbmV4cG9ydHMuY29tcGFyZSA9IGNvbXBhcmU7IiwidmFyIGVtcHR5Rm4gPSByZXF1aXJlKCcuLi9mdW5jdGlvbicpLmVtcHR5Rm4sXG4gICAgYXBwbHkgPSByZXF1aXJlKCcuLi9vYmplY3QnKS5hcHBseTtcblxuLyoqXG4gKiBAY2xhc3MgTHVjLkJhc2VcbiAqIFNpbXBsZSBjbGFzcyB0aGF0IGJ5IGRlZmF1bHQge0BsaW5rIEx1YyNhcHBseSBhcHBsaWVzfSB0aGUgXG4gKiBmaXJzdCBhcmd1bWVudCB0byB0aGUgaW5zdGFuY2UgYW5kIHRoZW4gY2FsbHNcbiAqIEx1Yy5CYXNlLmluaXQuXG4gKlxuICAgIHZhciBiID0gbmV3IEx1Yy5CYXNlKHtcbiAgICAgICAgYTogMSxcbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnaGV5JylcbiAgICAgICAgfVxuICAgIH0pXG4gICAgYi5hXG4gICAgPmhleVxuICAgID4xXG4gKlxuICogV2UgZm91bmQgdGhhdCBtb3N0IG9mIG91ciBjbGFzc2VzIGRvIHRoaXMgc28gd2UgbWFkZVxuICogaXQgdGhlIGRlZmF1bHQuICBIYXZpbmcgYSBjb25maWcgb2JqZWN0IGFzIHRoZSBmaXJzdCBhbmQgb25seSBcbiAqIHBhcmFtIGtlZXBzIGEgY2xlYW4gYXBpIGFzIHdlbGwuXG4gKlxuICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgTHVjLkFycmF5LmVhY2godGhpcy5pdGVtcywgdGhpcy5sb2dJdGVtcylcbiAgICAgICAgfSxcblxuICAgICAgICBsb2dJdGVtczogZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coaXRlbSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciBjID0gbmV3IEMoe2l0ZW1zOiBbMSwyLDNdfSk7XG4gICAgPjFcbiAgICA+MlxuICAgID4zXG4gICAgdmFyIGQgPSBuZXcgQyh7aXRlbXM6ICdBJ30pO1xuICAgID4nQSdcbiAgICB2YXIgZSA9IG5ldyBDKCk7XG4gKlxuICogSWYgeW91IGRvbid0IGxpa2UgdGhlIGFwcGx5aW5nIG9mIHRoZSBjb25maWcgdG8gdGhlIGluc3RhbmNlIGl0IFxuICogY2FuIGFsd2F5cyBiZSBcImRpc2FibGVkXCJcbiAqXG4gICAgdmFyIE5vQXBwbHkgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgYmVmb3JlSW5pdDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgfSxcbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBMdWMuQXJyYXkuZWFjaCh0aGlzLml0ZW1zLCB0aGlzLmxvZ0l0ZW1zKVxuICAgICAgICB9LFxuXG4gICAgICAgIGxvZ0l0ZW1zOiBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhpdGVtKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIGMgPSBuZXcgTm9BcHBseSh7aXRlbXM6IFsxLDIsM119KTtcbiAqIFxuICovXG5mdW5jdGlvbiBCYXNlKCkge1xuICAgIHRoaXMuYmVmb3JlSW5pdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMuaW5pdCgpO1xufVxuXG5CYXNlLnByb3RvdHlwZSA9IHtcbiAgICAvKipcbiAgICAgKiBCeSBkZWZhdWx0IGFwcGx5IHRoZSBjb25maWcgdG8gdGhlIFxuICAgICAqIGluc3RhbmNlLlxuICAgICAqL1xuICAgIGJlZm9yZUluaXQ6IGZ1bmN0aW9uKGNvbmZpZykge1xuICAgICAgICBhcHBseSh0aGlzLCBjb25maWcpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQG1ldGhvZFxuICAgICAqIFNpbXBsZSBob29rIHRvIGluaXRpYWxpemVcbiAgICAgKiB0aGUgY2xhc3MuICBEZWZhdWx0cyB0byBMdWMuZW1wdHlGblxuICAgICAqL1xuICAgIGluaXQ6IGVtcHR5Rm5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZTsiLCJ2YXIgQmFzZSA9IHJlcXVpcmUoJy4vYmFzZScpLFxuICAgIENvbXBvc2l0aW9uID0gcmVxdWlyZSgnLi9jb21wb3NpdGlvbicpLFxuICAgIG9iaiA9IHJlcXVpcmUoJy4uL29iamVjdCcpLFxuICAgIGFycmF5Rm5zID0gcmVxdWlyZSgnLi4vYXJyYXknKSxcbiAgICBlbXB0eUZuID0gcmVxdWlyZSgnLi4vZnVuY3Rpb24nKS5lbXB0eUZuLFxuICAgIGlzID0gcmVxdWlyZSgnLi4vaXMnKSxcbiAgICBhRWFjaCA9IGFycmF5Rm5zLmVhY2gsXG4gICAgYXBwbHkgPSBvYmouYXBwbHksXG4gICAgb0VhY2ggPSBvYmouZWFjaCxcbiAgICBvRmlsdGVyID0gb2JqLmZpbHRlcixcbiAgICBtaXggPSBvYmoubWl4LFxuICAgIGFycmF5U2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UsXG4gICAgQ2xhc3NEZWZpbmVyO1xuXG4vKipcbiAqIEBjbGFzcyBMdWMuQ2xhc3NEZWZpbmVyXG4gKiBAc2luZ2xldG9uXG4gKlxuICogU2luZ2xldG9uIHRoYXQge0BsaW5rIEx1Yy5kZWZpbmUjZGVmaW5lIEx1Yy5kZWZpbmV9IHVzZXMgdG8gZGVmaW5lIGNsYXNzZXMuICBUaGUgZGVmdWFsdCB0eXBlIGNhblxuICogYmUgY2hhbmdlZCB0byBhbnkgQ29uc3RydWN0b3JcbiAqXG4gICAgZnVuY3Rpb24gTXlDbGFzcygpe307XG4gICAgTHVjLkNsYXNzRGVmaW5lci5kZWZhdWx0VHlwZSA9IE15Q2xhc3M7XG4gICAgdmFyIEMgPSBMdWMuZGVmaW5lKCk7XG4gICAgbmV3IEMoKSBpbnN0YW5jZW9mIEx1Yy5CYXNlXG4gICAgPmZhbHNlXG4gICAgbmV3IEMoKSBpbnN0YW5jZW9mIE15Q2xhc3NcbiAgICA+dHJ1ZVxuICovXG5cbi8qKlxuICogQGNmZyB7RnVuY3Rpb259IGRlZmF1bHRUeXBlIHRoaXMgY2FuIGJlIGNoYW5nZWQgdG8gYW55IENvbnN0cnVjdG9yLiAgRGVmYXVsdHNcbiAqIHRvIEx1Yy5CYXNlLlxuICovXG5cbkNsYXNzRGVmaW5lciA9IHtcblxuICAgIENPTVBPU0lUSU9OU19OQU1FOiAnJGNvbXBvc2l0aW9ucycsXG5cbiAgICBkZWZhdWx0VHlwZTogQmFzZSxcblxuICAgIHByb2Nlc3NvcktleXM6IHtcbiAgICAgICAgJG1peGluczogJ19hcHBseU1peGlucycsXG4gICAgICAgICRzdGF0aWNzOiAnX2FwcGx5U3RhdGljcycsXG4gICAgICAgICRjb21wb3NpdGlvbnM6ICdfYXBwbHlDb21wb3Nlck1ldGhvZHMnLFxuICAgICAgICAkc3VwZXI6ICdfYXBwbHlTdXBlcidcbiAgICB9LFxuXG4gICAgZGVmaW5lOiBmdW5jdGlvbihvcHRzLCBhZnRlcikge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IG9wdHMgfHwge30sXG4gICAgICAgICAgICAvL2lmIHN1cGVyIGlzIGEgZmFsc3kgdmFsdWUgYmVzaWRlcyB1bmRlZmluZWQgdGhhdCBtZWFucyBubyBzdXBlcmNsYXNzXG4gICAgICAgICAgICBTdXBlciA9IG9wdGlvbnMuJHN1cGVyIHx8IChvcHRpb25zLiRzdXBlciA9PT0gdW5kZWZpbmVkID8gdGhpcy5kZWZhdWx0VHlwZSA6IGZhbHNlKSxcbiAgICAgICAgICAgIGFmdGVyRGVmaW5lID0gYWZ0ZXIgfHwgZW1wdHlGbixcbiAgICAgICAgICAgIENvbnN0cnVjdG9yO1xuXG4gICAgICAgIG9wdGlvbnMuJHN1cGVyID0gU3VwZXI7XG5cbiAgICAgICAgQ29uc3RydWN0b3IgPSB0aGlzLl9jcmVhdGVDb25zdHJ1Y3RvcihvcHRpb25zKTtcblxuICAgICAgICB0aGlzLl9wcm9jZXNzQWZ0ZXJDcmVhdGUoQ29uc3RydWN0b3IsIG9wdGlvbnMpO1xuXG4gICAgICAgIGFmdGVyRGVmaW5lLmNhbGwoQ29uc3RydWN0b3IsIENvbnN0cnVjdG9yKTtcblxuICAgICAgICByZXR1cm4gQ29uc3RydWN0b3I7XG4gICAgfSxcblxuICAgIF9jcmVhdGVDb25zdHJ1Y3RvcjogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICB2YXIgc3VwZXJjbGFzcyA9IG9wdGlvbnMuJHN1cGVyLFxuICAgICAgICAgICAgQ29uc3RydWN0b3IgPSB0aGlzLl9jcmVhdGVDb25zdHJ1Y3RvckZuKG9wdGlvbnMpO1xuXG4gICAgICAgIGlmKHN1cGVyY2xhc3MpIHtcbiAgICAgICAgICAgIENvbnN0cnVjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJjbGFzcy5wcm90b3R5cGUpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gQ29uc3RydWN0b3I7XG4gICAgfSxcblxuICAgIF9jcmVhdGVDb25zdHJ1Y3RvckZuOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHZhciBzdXBlcmNsYXNzID0gb3B0aW9ucy4kc3VwZXIsXG4gICAgICAgICAgICBDb25zdHJ1Y3RvcjtcblxuICAgICAgICBpZiAodGhpcy5faGFzQ29uc3RydWN0b3JNb2RpZnlpbmdPcHRpb25zKG9wdGlvbnMpKSB7XG4gICAgICAgICAgICBDb25zdHJ1Y3RvciA9IHRoaXMuX2NyZWF0ZUNvbnN0cnVjdG9yRnJvbU9wdGlvbnMob3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZighc3VwZXJjbGFzcykge1xuICAgICAgICAgICAgQ29uc3RydWN0b3IgPSBmdW5jdGlvbigpIHt9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgQ29uc3RydWN0b3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBzdXBlcmNsYXNzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIENvbnN0cnVjdG9yO1xuICAgIH0sXG5cbiAgICBfaGFzQ29uc3RydWN0b3JNb2RpZnlpbmdPcHRpb25zOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLiRjb21wb3NpdGlvbnM7XG4gICAgfSxcblxuICAgIF9jcmVhdGVDb25zdHJ1Y3RvckZyb21PcHRpb25zOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHZhciBzdXBlcmNsYXNzID0gb3B0aW9ucy4kc3VwZXIsXG4gICAgICAgICAgICBtZSA9IHRoaXMsXG4gICAgICAgICAgICBpbml0QmVmb3JlU3VwZXJjbGFzcyxcbiAgICAgICAgICAgIGluaXRBZnRlclN1cGVyY2xhc3MsXG4gICAgICAgICAgICBpbml0O1xuXG4gICAgICAgIGlmICghc3VwZXJjbGFzcykge1xuICAgICAgICAgICAgaW5pdCA9IHRoaXMuX2NyZWF0ZUluaXRDbGFzc0ZuKG9wdGlvbnMsIHtcbiAgICAgICAgICAgICAgICBhbGw6IHRydWVcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBhcnJheVNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICBpbml0LmNhbGwodGhpcywgb3B0aW9ucywgYXJncyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdEJlZm9yZVN1cGVyY2xhc3MgPSB0aGlzLl9jcmVhdGVJbml0Q2xhc3NGbihvcHRpb25zLCB7XG4gICAgICAgICAgICBiZWZvcmU6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaW5pdEFmdGVyU3VwZXJjbGFzcyA9IHRoaXMuX2NyZWF0ZUluaXRDbGFzc0ZuKG9wdGlvbnMsIHtcbiAgICAgICAgICAgIGJlZm9yZTogZmFsc2VcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGFyZ3MgPSBhcnJheVNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblxuICAgICAgICAgICAgaW5pdEJlZm9yZVN1cGVyY2xhc3MuY2FsbCh0aGlzLCBvcHRpb25zLCBhcmdzKTtcbiAgICAgICAgICAgIHN1cGVyY2xhc3MuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIGluaXRBZnRlclN1cGVyY2xhc3MuY2FsbCh0aGlzLCBvcHRpb25zLCBhcmdzKTtcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgX2NyZWF0ZUluaXRDbGFzc0ZuOiBmdW5jdGlvbihvcHRpb25zLCBjb25maWcpIHtcbiAgICAgICAgdmFyIG1lID0gdGhpcyxcbiAgICAgICAgICAgIGNvbXBvc2l0aW9ucyA9IHRoaXMuX2ZpbHRlckNvbXBvc2l0aW9ucyhjb25maWcsIG9wdGlvbnMuJGNvbXBvc2l0aW9ucyk7XG5cbiAgICAgICAgaWYoY29tcG9zaXRpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGVtcHR5Rm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBmdW5jdGlvbihvcHRpb25zLCBpbnN0YW5jZUFyZ3MpIHtcbiAgICAgICAgICAgIG1lLl9pbml0Q29tcG9zaXRpb25zLmNhbGwodGhpcywgY29tcG9zaXRpb25zLCBpbnN0YW5jZUFyZ3MpO1xuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBfZmlsdGVyQ29tcG9zaXRpb25zOiBmdW5jdGlvbihjb25maWcsIGNvbXBvc2l0aW9ucykge1xuICAgICAgICB2YXIgYmVmb3JlID0gY29uZmlnLmJlZm9yZSwgXG4gICAgICAgICAgICBmaWx0ZXJlZCA9IFtdO1xuXG4gICAgICAgIGlmKGNvbmZpZy5hbGwpIHtcbiAgICAgICAgICAgIHJldHVybiBjb21wb3NpdGlvbnM7XG4gICAgICAgIH1cblxuICAgICAgICBhRWFjaChjb21wb3NpdGlvbnMsIGZ1bmN0aW9uKGNvbXBvc2l0aW9uKSB7XG4gICAgICAgICAgICBpZihiZWZvcmUgJiYgY29tcG9zaXRpb24uaW5pdEFmdGVyICE9PSB0cnVlIHx8ICghYmVmb3JlICYmIGNvbXBvc2l0aW9uLmluaXRBZnRlciA9PT0gdHJ1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWQucHVzaChjb21wb3NpdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBmaWx0ZXJlZDtcbiAgICB9LFxuXG4gICAgX3Byb2Nlc3NBZnRlckNyZWF0ZTogZnVuY3Rpb24oJGNsYXNzLCBvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuX2FwcGx5VmFsdWVzVG9Qcm90bygkY2xhc3MsIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLl9oYW5kbGVQb3N0UHJvY2Vzc29ycygkY2xhc3MsIG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICBfYXBwbHlWYWx1ZXNUb1Byb3RvOiBmdW5jdGlvbigkY2xhc3MsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHByb3RvID0gJGNsYXNzLnByb3RvdHlwZSxcbiAgICAgICAgICAgIHZhbHVlcyA9IGFwcGx5KHtcbiAgICAgICAgICAgICAgICAkY2xhc3M6ICRjbGFzc1xuICAgICAgICAgICAgfSwgb3B0aW9ucyk7XG5cbiAgICAgICAgLy9Eb24ndCBwdXQgdGhlIGRlZmluZSBzcGVjaWZpYyBwcm9wZXJ0aWVzXG4gICAgICAgIC8vb24gdGhlIHByb3RvdHlwZVxuICAgICAgICBvRWFjaCh2YWx1ZXMsIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fZ2V0UHJvY2Vzc29yS2V5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBwcm90b1trZXldID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICBfZ2V0UHJvY2Vzc29yS2V5OiBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc29yS2V5c1trZXldO1xuICAgIH0sXG5cbiAgICBfaGFuZGxlUG9zdFByb2Nlc3NvcnM6IGZ1bmN0aW9uKCRjbGFzcywgb3B0aW9ucykge1xuICAgICAgICBvRWFjaChvcHRpb25zLCBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgbWV0aG9kID0gdGhpcy5fZ2V0UHJvY2Vzc29yS2V5KGtleSk7XG5cbiAgICAgICAgICAgIGlmIChpcy5pc0Z1bmN0aW9uKHRoaXNbbWV0aG9kXSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzW21ldGhvZF0uY2FsbCh0aGlzLCAkY2xhc3MsIG9wdGlvbnNba2V5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICBfYXBwbHlNaXhpbnM6IGZ1bmN0aW9uKCRjbGFzcywgbWl4aW5zKSB7XG4gICAgICAgIHZhciBwcm90byA9ICRjbGFzcy5wcm90b3R5cGU7XG4gICAgICAgIGFFYWNoKG1peGlucywgZnVuY3Rpb24obWl4aW4pIHtcbiAgICAgICAgICAgIC8vYWNjZXB0IENvbnN0cnVjdG9ycyBvciBPYmplY3RzXG4gICAgICAgICAgICB2YXIgdG9NaXggPSBtaXhpbi5wcm90b3R5cGUgfHwgbWl4aW47XG4gICAgICAgICAgICBtaXgocHJvdG8sIHRvTWl4KTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIF9hcHBseVN0YXRpY3M6IGZ1bmN0aW9uKCRjbGFzcywgc3RhdGljcykge1xuICAgICAgICB2YXIgcHJvdG90eXBlID0gJGNsYXNzLnByb3RvdHlwZTtcblxuICAgICAgICBhcHBseSgkY2xhc3MsIHN0YXRpY3MpO1xuXG4gICAgICAgIGlmKHByb3RvdHlwZS5nZXRTdGF0aWNWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBwcm90b3R5cGUuZ2V0U3RhdGljVmFsdWUgPSB0aGlzLmdldFN0YXRpY1ZhbHVlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9hcHBseUNvbXBvc2VyTWV0aG9kczogZnVuY3Rpb24oJGNsYXNzLCBjb21wb3NpdGlvbnMpIHtcbiAgICAgICAgdmFyIHByb3RvdHlwZSA9ICRjbGFzcy5wcm90b3R5cGUsXG4gICAgICAgICAgICBtZXRob2RzVG9Db21wb3NlO1xuXG4gICAgICAgIGFFYWNoKGNvbXBvc2l0aW9ucywgZnVuY3Rpb24oY29tcG9zaXRpb25Db25maWcpIHtcbiAgICAgICAgICAgIHZhciBjb21wb3NpdGlvbiA9IG5ldyBDb21wb3NpdGlvbihjb21wb3NpdGlvbkNvbmZpZyksXG4gICAgICAgICAgICAgICAgbmFtZSA9IGNvbXBvc2l0aW9uLm5hbWUsXG4gICAgICAgICAgICAgICAgQ29uc3RydWN0b3IgPSBjb21wb3NpdGlvbi5Db25zdHJ1Y3RvcjtcblxuICAgICAgICAgICAgY29tcG9zaXRpb24udmFsaWRhdGUoKTtcblxuICAgICAgICAgICAgbWV0aG9kc1RvQ29tcG9zZSA9IGNvbXBvc2l0aW9uLmdldE1ldGhvZHNUb0NvbXBvc2UoKTtcblxuICAgICAgICAgICAgbWV0aG9kc1RvQ29tcG9zZS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgICAgIGlmIChwcm90b3R5cGVba2V5XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3RvdHlwZVtrZXldID0gdGhpcy5fY3JlYXRlQ29tcG9zZXJQcm90b0ZuKGtleSwgbmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICAgIGlmKHByb3RvdHlwZS5nZXRDb21wb3NpdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcHJvdG90eXBlLmdldENvbXBvc2l0aW9uID0gdGhpcy5nZXRDb21wb3NpdGlvbjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgX2FwcGx5U3VwZXI6IGZ1bmN0aW9uKCRjbGFzcywgJHN1cGVyKSB7XG4gICAgICAgIHZhciBwcm90byxcbiAgICAgICAgICAgIHN1cGVyT2JqO1xuXG4gICAgICAgIC8vc3VwZXIgY2FuIGJlIGZhbHN5IHRvIHNpZ25pZnkgbm8gc3VwZXJjbGFzc1xuICAgICAgICBpZiAoJHN1cGVyKSB7XG4gICAgICAgICAgICBzdXBlck9iaiA9IHtcbiAgICAgICAgICAgICAgICAkc3VwZXI6ICRzdXBlcixcbiAgICAgICAgICAgICAgICAkc3VwZXJjbGFzczogJHN1cGVyLnByb3RvdHlwZVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcHJvdG8gPSAkY2xhc3MucHJvdG90eXBlO1xuXG4gICAgICAgICAgICBhcHBseShwcm90bywgc3VwZXJPYmopO1xuICAgICAgICAgICAgYXBwbHkoJGNsYXNzLCBzdXBlck9iaik7XG5cbiAgICAgICAgICAgIHRoaXMuX2FkZFN1cGVyTWV0aG9kKHByb3RvKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfYWRkU3VwZXJNZXRob2Q6IGZ1bmN0aW9uKHByb3RvKSB7XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0U3VwZXJNZXRob2QoY2FsbGVlLCBzcCkge1xuICAgICAgICAgICAgdmFyICRzdXBlciA9IHNwIHx8IHByb3RvO1xuXG4gICAgICAgICAgICAvL3dlIGNvdWxkIGJlIGNhY2hpbmcgdGhpcyBoZXJlIG9uIHRoZSBmblxuICAgICAgICAgICAgLy9idXQgdGhlbiBkZXZzIHdvdWxkIGhhdmUgdG8ga25vdyB0aGUgZWRnZSBjYXNlc1xuICAgICAgICAgICAgLy9vZiBob3cgdG8gaW52YWxpZGF0ZSBpdFxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluICRzdXBlcikge1xuICAgICAgICAgICAgICAgIGlmKCRzdXBlcltrZXldID09PSBjYWxsZWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRzdXBlci4kc3VwZXJjbGFzc1trZXldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBnZXRTdXBlck1ldGhvZChjYWxsZWUsICRzdXBlci4kc3VwZXJjbGFzcyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBjYWxsU3VwZXIoYXJncykge1xuICAgICAgICAgICAgdmFyIHN1cGVyTWV0aG9kID0gZ2V0U3VwZXJNZXRob2QoY2FsbFN1cGVyLmNhbGxlcik7XG5cbiAgICAgICAgICAgIGlmKHN1cGVyTWV0aG9kKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1cGVyTWV0aG9kLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3N1cGVyIG1ldGhvZCBub3QgZm91bmQuJyk7XG4gICAgICAgICAgICBcbiAgICAgICAgfVxuXG4gICAgICAgIHByb3RvLmNhbGxTdXBlciA9IGNhbGxTdXBlcjtcbiAgICB9LFxuXG4gICAgX2NyZWF0ZUNvbXBvc2VyUHJvdG9GbjogZnVuY3Rpb24obWV0aG9kTmFtZSwgY29tcG9zaXRpb25OYW1lKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBjb21wID0gdGhpc1tDbGFzc0RlZmluZXIuQ09NUE9TSVRJT05TX05BTUVdW2NvbXBvc2l0aW9uTmFtZV07XG4gICAgICAgICAgICByZXR1cm4gY29tcFttZXRob2ROYW1lXS5hcHBseShjb21wLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBpZ25vcmVcbiAgICAgKiBvcHRpb25zIHtPYmplY3R9IHRoZSBjb21wb3NpdGlvbiBjb25maWcgb2JqZWN0XG4gICAgICogaW5zdGFuY2VBcmdzIHtBcnJheX0gdGhlIGFyZ3VtZW50cyBwYXNzZWQgdG8gdGhlIGluc3RhbmNlJ3NcbiAgICAgKiBjb25zdHJ1Y3Rvci5cbiAgICAgKi9cbiAgICBfaW5pdENvbXBvc2l0aW9uczogZnVuY3Rpb24oY29tcG9zaXRpb25zLCBpbnN0YW5jZUFyZ3MpIHtcbiAgICAgICAgaWYoIXRoaXNbQ2xhc3NEZWZpbmVyLkNPTVBPU0lUSU9OU19OQU1FXSkge1xuICAgICAgICAgICAgdGhpc1tDbGFzc0RlZmluZXIuQ09NUE9TSVRJT05TX05BTUVdID0ge307XG4gICAgICAgIH1cblxuICAgICAgICBhRWFjaChjb21wb3NpdGlvbnMsIGZ1bmN0aW9uKGNvbXBvc2l0aW9uQ29uZmlnKSB7XG4gICAgICAgICAgICB2YXIgY29uZmlnID0gYXBwbHkoe1xuICAgICAgICAgICAgICAgIGluc3RhbmNlOiB0aGlzLFxuICAgICAgICAgICAgICAgIGluc3RhbmNlQXJnczogaW5zdGFuY2VBcmdzXG4gICAgICAgICAgICB9LCBjb21wb3NpdGlvbkNvbmZpZyksIFxuICAgICAgICAgICAgY29tcG9zaXRpb247XG5cbiAgICAgICAgICAgIGNvbXBvc2l0aW9uID0gbmV3IENvbXBvc2l0aW9uKGNvbmZpZyk7XG5cbiAgICAgICAgICAgIHRoaXNbQ2xhc3NEZWZpbmVyLkNPTVBPU0lUSU9OU19OQU1FXVtjb21wb3NpdGlvbi5uYW1lXSA9IGNvbXBvc2l0aW9uLmdldEluc3RhbmNlKCk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICAvL01ldGhvZHMgdGhhdCBjYW4gZ2V0IGFkZGVkIHRvIHRoZSBwcm90b3R5cGVcbiAgICAvL3RoZXkgd2lsbCBiZSBjYWxsZWQgaW4gdGhlIGNvbnRleHQgb2YgdGhlIGluc3RhbmNlLlxuICAgIC8vXG4gICAgZ2V0Q29tcG9zaXRpb246IGZ1bmN0aW9uKGtleSkge1xuICAgICAgICByZXR1cm4gdGhpc1tDbGFzc0RlZmluZXIuQ09NUE9TSVRJT05TX05BTUVdW2tleV07XG4gICAgfSxcblxuICAgIGdldFN0YXRpY1ZhbHVlOiBmdW5jdGlvbiAoa2V5LCAkY2xhc3MpIHtcbiAgICAgICAgdmFyIGNsYXNzVG9GaW5kVmFsdWUgPSAkY2xhc3MgfHwgdGhpcy4kY2xhc3MsXG4gICAgICAgICAgICAkc3VwZXIsXG4gICAgICAgICAgICB2YWx1ZTtcblxuICAgICAgICB2YWx1ZSA9IGNsYXNzVG9GaW5kVmFsdWVba2V5XTtcblxuICAgICAgICBpZih2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAkc3VwZXIgPSBjbGFzc1RvRmluZFZhbHVlLnByb3RvdHlwZS4kc3VwZXI7XG4gICAgICAgICAgICBpZigkc3VwZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRTdGF0aWNWYWx1ZShrZXksICRzdXBlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG59O1xuXG5DbGFzc0RlZmluZXIuZGVmaW5lID0gQ2xhc3NEZWZpbmVyLmRlZmluZS5iaW5kKENsYXNzRGVmaW5lcik7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2xhc3NEZWZpbmVyO1xuXG4vKipcbiAqIEBjbGFzcyAgTHVjLmRlZmluZVxuICogVGhpcyBpcyBhY3R1YWxseSBhIGZ1bmN0aW9uIGJ1dCBoYXMgYSBkZWNlbnQgYW1vdW50IG9mIGltcG9ydGFudCBvcHRpb25zXG4gKiBzbyB3ZSBhcmUgZG9jdW1lbnRpbmcgaXQgbGlrZSBpdCBpcyBhIGNsYXNzLiAgUHJvcGVydGllcyBhcmUgdGhpbmdzIHRoYXQgd2lsbCBnZXRcbiAqIGFwcGxpZWQgdG8gaW5zdGFuY2VzIG9mIGNsYXNzZXMgZGVmaW5lZCB3aXRoIHtAbGluayBMdWMuZGVmaW5lI2RlZmluZSBkZWZpbmV9LiAgTm9uZVxuICogYXJlIG5lZWRlZCBmb3Ige0BsaW5rIEx1Yy5kZWZpbmUjZGVmaW5lIGRlZmluaW5nfSBhIGNsYXNzLiAge0BsaW5rIEx1Yy5kZWZpbmUjZGVmaW5lIGRlZmluZX1cbiAqIGp1c3QgdGFrZXMgdGhlIHBhc3NlZCBpbiBjb25maWcgYW5kIHB1dHMgdGhlIHByb3BlcnRpZXMgb24gdGhlIHByb3RvdHlwZSBhbmQgcmV0dXJuc1xuICogYSBDb25zdHJ1Y3Rvci5cbiAqXG5cbiAgICB2YXIgQyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICBhOiAxLFxuICAgICAgICBkb0xvZzogdHJ1ZSxcbiAgICAgICAgbG9nQTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5kb0xvZykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuYSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICB2YXIgYyA9IG5ldyBDKCk7XG4gICAgYy5sb2dBKCk7XG4gICAgPjFcbiAgICBjLmEgPSA0NTtcbiAgICBjLmxvZ0EoKTtcbiAgICA+NDVcbiAgICBjLmRvTG9nID0gZmFsc2U7XG4gICAgYy5sb2dBKCk7XG5cbiAgICBuZXcgQygpLmxvZ0EoKVxuICAgID4xXG5cbiAqXG4gKiBDaGVjayBvdXQgdGhlIGZvbGxvd2luZyBjb25maWdzIHRvIGFkZCBmdW5jdGlvbmFsaXR5IHRvIGEgY2xhc3Mgd2l0aG91dCBtZXNzaW5nXG4gKiB1cCB0aGUgaW5oZXJpdGFuY2UgY2hhaW4uICBBbGwgdGhlIGNvbmZpZ3MgaGF2ZSBleGFtcGxlcyBhbmQgZG9jdW1lbnRhdGlvbiBvbiBcbiAqIGhvdyB0byB1c2UgdGhlbS5cbiAqXG4gKiB7QGxpbmsgTHVjLmRlZmluZSMkc3VwZXIgc3VwZXJ9IDxicj5cbiAqIHtAbGluayBMdWMuZGVmaW5lIyRjb21wb3NpdGlvbnMgY29tcG9zaXRpb25zfSA8YnI+XG4gKiB7QGxpbmsgTHVjLmRlZmluZSMkbWl4aW5zIG1peGluc30gPGJyPlxuICoge0BsaW5rIEx1Yy5kZWZpbmUjJHN0YXRpY3Mgc3RhdGljc30gPGJyPlxuICogXG4gKiBcbiAqL1xuXG4vKipcbiAqIEBtZXRob2QgIGRlZmluZVxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBjb25maWcgb2JqZWN0IHVzZWQgd2hlbiBjcmVhdGluZyB0aGUgY2xhc3MuICBBbnkgcHJvcGVydHkgdGhhdFxuICogaXMgbm90IGFwYXJ0IG9mIHRoZSBzcGVjaWFsIGNvbmZpZ3Mgd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBwcm90b3R5cGUuICBDaGVjayBvdXRcbiAqIEx1Yy5kZWZpbmUgZm9yIGFsbCB0aGUgY29uZmlnIG9wdGlvbnMuICAgTm8gY29uZmlncyBhcmUgbmVlZGVkIHRvIGRlZmluZSBhIGNsYXNzLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGFmdGVyRGVmaW5lIChvcHRpb25hbCkgZnVuY3Rpb24gdG8gcnVuIGFmdGVyIHRoZSBDb25zdHJ1Y3RvciBoYXMgYmVlbiBjcmVhdGVkLlxuICogVGhlIGZpcnN0IGFuIG9ubHkgYXJndW1lbnQgaXMgdGhlIG5ld2x5IGNyZWF0ZWQgQ29uc3RydWN0b3IuXG4gKiBcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSB0aGUgZGVmaW5lZCBjbGFzc1xuICpcbiAgICB2YXIgQyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICBsb2dBOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuYSlcbiAgICAgICAgfSxcbiAgICAgICAgYTogMVxuICAgIH0pO1xuICAgIHZhciBjID0gbmV3IEMoKTtcbiAgICBjLmxvZ0EoKTtcbiAgICA+MVxuXG4gICAgYy5hID0gNDtcbiAgICBjLmxvZ0EoKTtcbiAgICA+NFxuICpcbiAqXG4gKi9cblxuLyoqXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSAkY2xhc3MgcmVmZXJlbmNlIHRvIHRoZSBpbnN0YW5jZSdzIG93biBjb25zdHJ1Y3Rvci4gIFRoaXNcbiAqIHdpbGwgZ2V0IGFkZGVkIHRvIGFueSBjbGFzcyB0aGF0IGlzIGRlZmluZWQgd2l0aCBMdWMuZGVmaW5lLlxuICogXG4gICAgdmFyIEMgPSBMdWMuZGVmaW5lKClcbiAgICB2YXIgYyA9IG5ldyBDKClcbiAgICBjLiRjbGFzcyA9PT0gQ1xuICAgID50cnVlXG4gKlxuICogVGhlcmUgYXJlIHNvbWUgcmVhbGx5IGdvb2QgdXNlIGNhc2VzIHRvIGhhdmUgYSByZWZlcmVuY2UgdG8gaXQnc1xuICogb3duIGNvbnN0cnVjdG9yLiAgPGJyPiBBZGQgZnVuY3Rpb25hbGl0eSB0byBhbiBpbnN0YW5jZSBpbiBhIHNpbXBsZVxuICogYW5kIGdlbmVyaWMgd2F5OlxuICpcbiAgICB2YXIgQyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICBhZGQ6IGZ1bmN0aW9uKGEsYikge1xuICAgICAgICAgICAgcmV0dXJuIGEgKyBiO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvL0x1Yy5CYXNlIGFwcGxpZXMgZmlyc3QgXG4gICAgLy9hcmcgdG8gdGhlIGluc3RhbmNlXG5cbiAgICB2YXIgYyA9IG5ldyBDKHtcbiAgICAgICAgYWRkOiBmdW5jdGlvbihhLGIsYykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuJGNsYXNzLnByb3RvdHlwZS5hZGQuY2FsbCh0aGlzLCBhLGIpICsgYztcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgYy5hZGQoMSwyLDMpXG4gICAgPjZcbiAgICBuZXcgQygpLmFkZCgxLDIsMylcbiAgICA+M1xuICpcbiAqIE9yIGhhdmUgYSBzaW1wbGUgZ2VuZXJpYyBjbG9uZSBtZXRob2QgOlxuICpcbiAgICB2YXIgQyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICBjbG9uZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgbXlPd25Qcm9wcyA9IHt9O1xuICAgICAgICAgICAgTHVjLk9iamVjdC5lYWNoKHRoaXMsIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICBteU93blByb3BzW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gbmV3IHRoaXMuJGNsYXNzKG15T3duUHJvcHMpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB2YXIgYyA9IG5ldyBDKHthOjEsYjoyLGM6M30pO1xuICAgIGMuZCA9IDQ7XG4gICAgdmFyIGNsb25lID0gYy5jbG9uZSgpO1xuXG4gICAgY2xvbmUgPT09IGNcbiAgICA+ZmFsc2VcblxuICAgIGNsb25lLmFcbiAgICA+MVxuICAgIGNsb25lLmJcbiAgICA+MlxuICAgIGNsb25lLmNcbiAgICA+M1xuICAgIGNsb25lLmRcbiAgICA+NFxuICovXG5cbi8qKlxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gWyRzdXBlcl0gSWYgJHN1cGVyIGlzIG5vdCBmYWxzZSBvciBudWxsIFxuICogdGhlICRzdXBlciBwcm9wZXJ0eSB3aWxsIGJlIGFkZGVkIHRvIGV2ZXJ5IGluc3RhbmNlIG9mIHRoZSBkZWZpbmVkIGNsYXNzLFxuICogJHN1cGVyIGlzIHRoZSBDb25zdHJ1Y3RvciBwYXNzZWQgaW4gd2l0aCB0aGUgJHN1cGVyIGNvbmZpZyBvciB0aGUge0BsaW5rIEx1Yy5DbGFzc0RlZmluZXIjZGVmYXVsdFR5cGUgZGVmYXVsdH1cbiAqIFxuICAgIHZhciBDID0gTHVjLmRlZmluZSgpXG4gICAgdmFyIGMgPSBuZXcgQygpXG4gICAgLy9MdWMuQmFzZSBpcyB0aGUgZGVmYXVsdCBcbiAgICBjLiRzdXBlciA9PT0gTHVjLkJhc2VcbiAgICA+dHJ1ZVxuICovXG5cbi8qKlxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gWyRzdXBlcmNsYXNzXSBJZiAkc3VwZXIgaXMgZGVmaW5lZCBpdFxuICogd2lsbCBiZSB0aGUgcHJvdG90eXBlIG9mICRzdXBlci4gIEl0IGNhbiBiZSB1c2VkIHRvIGNhbGwgYSBwYXJlbnQnc1xuICogbWV0aG9kXG4gKiBcbiAgICBmdW5jdGlvbiBNeUNvb2xDbGFzcygpIHt9XG4gICAgTXlDb29sQ2xhc3MucHJvdG90eXBlLmFkZE51bXMgPSBmdW5jdGlvbihhLGIpIHtcbiAgICAgICAgcmV0dXJuIGEgKyBiO1xuICAgIH1cblxuICAgIHZhciBNeU90aGVyQ29vbENsYXNzID0gTHVjLmRlZmluZSh7XG4gICAgICAgICRzdXBlcjogTXlDb29sQ2xhc3MsXG4gICAgICAgIGFkZE51bXM6IGZ1bmN0aW9uKGEsIGIsIGMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLiRzdXBlcmNsYXNzLmFkZE51bXMuY2FsbCh0aGlzLCBhLCBiKSArIGM7XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgdmFyIG0gPSBuZXcgTXlPdGhlckNvb2xDbGFzcygpO1xuICAgIG0uYWRkTnVtcygxLDIsMyk7XG4gICAgPjZcbiAqL1xuXG4vKipcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGdldFN0YXRpY1ZhbHVlIHRoaXMgbWV0aG9kXG4gKiB3aWxsIGJlIGFkZGVkIHRvIGluc3RhbmNlcyB0aGF0IHVzZSB0aGUge0BsaW5rIEx1Yy5kZWZpbmUjJHN0YXRpY3MgJHN0YXRpY3N9XG4gKiBjb25maWcuXG4gKlxuICogXG4gKiBUaGlzIHNob3VsZCBiZSB1c2VkIG92ZXIgdGhpcy4kY2xhc3Muc3RhdGljTmFtZSB0b1xuICogZ2V0IHRoZSB2YWx1ZSBvZiBzdGF0aWMuICBJZiB0aGUgY2xhc3MgZ2V0cyBpbmhlcml0ZWRcbiAqIGZyb20sIHRoaXMuJGNsYXNzIHdpbGwgbm90IGJlIHRoZSBzYW1lLiAgZ2V0U3RhdGljIHZhbHVlXG4gKiBkZWFscyB3aXRoIHRoaXMgaXNzdWUuXG4gKiBcbiAgICB2YXIgQSA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICAkc3RhdGljczoge1xuICAgICAgICAgICAgYTogMVxuICAgICAgICAgICAgfSxcbiAgICAgICAgZ2V0QUJldHRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRTdGF0aWNWYWx1ZSgnYScpO1xuICAgICAgICB9LFxuICAgICAgICBnZXRBOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLiRjbGFzcy5hO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB2YXIgQiA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICAkc3VwZXI6IEEsXG4gICAgICAgICRzdGF0aWNzOiB7XG4gICAgICAgICAgICBiOiAyLFxuICAgICAgICAgICAgYzogM1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBcbiAgICB2YXIgYiA9IG5ldyBCKCk7XG4gICAgYi5nZXRBKCk7XG4gICAgPnVuZGVmaW5lZFxuICAgIGIuZ2V0QUJldHRlcigpO1xuICAgID4xXG5cbiAqIEByZXR1cm4ge09iamVjdH0gdGhlIHN0YXRpYyB2YWx1ZSBvZiB0aGUga2V5XG4gKi9cblxuICAgIFxuLyoqXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBnZXRDb21wb3NpdGlvbiB0aGlzIG1ldGhvZCB3aWxsIGJlIGFkZGVkXG4gKiB0byBpbnN0YW5jZXMgdGhhdCB1c2UgdGhlIHtAbGluayBMdWMuZGVmaW5lIyRjb21wb3NpdGlvbnMgJGNvbXBvc2l0aW9uc30gIGNvbmZpZ1xuICpcbiAqICBUaGlzIHdpbGwgcmV0dXJuIHRoZSBjb21wb3NpdGlvbiBpbnN0YW5jZSBiYXNlZCBvZmYgdGhlIGNvbXBvc2l0aW9uIHtAbGluayBMdWMuQ29tcG9zaXRpb24jbmFtZSBuYW1lfVxuICAgIFxuICAgIHRoaXMuZ2V0Q29tcG9zaXRpb24oXCJuYW1lXCIpO1xuICAgIFxuICpcbiAqL1xuXG5cbi8qKlxuICogQGNmZyB7T2JqZWN0fSAkc3RhdGljcyAob3B0aW9uYWwpIEFkZCBzdGF0aWMgcHJvcGVydGllcyBvciBtZXRob2RzXG4gKiB0byB0aGUgY2xhc3MuICBUaGVzZSBwcm9wZXJ0aWVzL21ldGhvZHMgd2lsbCBub3QgYmUgYWJsZSB0byBiZVxuICogZGlyZWN0bHkgbW9kaWZpZWQgYnkgdGhlIGluc3RhbmNlIHNvIHRoZXkgYXJlIGdvb2QgZm9yIGRlZmluaW5nIGRlZmF1bHRcbiAqIGNvbmZpZ3MuICBVc2luZyB0aGlzIGNvbmZpZyBhZGRzIHRoZSB7QGxpbmsgTHVjLmRlZmluZSNnZXRTdGF0aWNWYWx1ZSBnZXRTdGF0aWNWYWx1ZX1cbiAqIG1ldGhvZCB0byBpbnN0YW5jZXMuXG4gKlxuICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgICRzdGF0aWNzOiB7XG4gICAgICAgICAgICBudW1iZXI6IDFcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIGMgPSBuZXcgQygpO1xuICAgIGMubnVtYmVyXG4gICAgPnVuZGVmaW5lZFxuICAgIEMubnVtYmVyXG4gICAgPjFcbiAgICBcbiAqXG4gKiBCYWQgdGhpbmdzIGNhbiBoYXBwZW4gaWYgbm9uIHByaW1pdGl2ZXMgYXJlIHBsYWNlZCBvbiB0aGUgXG4gKiBwcm90b3R5cGUgYW5kIGluc3RhbmNlIHNoYXJpbmcgaXMgbm90IHdhbnRlZC4gIFVzaW5nIHN0YXRpY3NcbiAqIHByZXZlbnQgc3ViY2xhc3NlcyBhbmQgaW5zdGFuY2VzIGZyb20gdW5rbm93aW5nbHkgbW9kaWZ5aW5nXG4gKiBhbGwgaW5zdGFuY2VzLlxuICogXG4gICAgdmFyIEMgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgY2ZnOiB7XG4gICAgICAgICAgICBhOiAxXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciBjID0gbmV3IEMoKTtcbiAgICBjLmNmZy5hXG4gICAgPjFcbiAgICBjLmNmZy5hID0gNVxuICAgIG5ldyBDKCkuY2ZnLmFcbiAgICA+NVxuICpcbiAqL1xuXG4vKipcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IFskc3VwZXJjbGFzc10gSWYgJHN1cGVyIGlzIGRlZmluZWQgaXRcbiAqIHdpbGwgYmUgdGhlIHByb3RvdHlwZSBvZiAkc3VwZXIuICBJdCBjYW4gYmUgdXNlZCB0byBjYWxsIHBhcmVudCdzXG4gKiBtZXRob2RcbiAqIFxuICAgIGZ1bmN0aW9uIE15Q29vbENsYXNzKCkge31cbiAgICBNeUNvb2xDbGFzcy5wcm90b3R5cGUuYWRkTnVtcyA9IGZ1bmN0aW9uKGEsYikge1xuICAgICAgICByZXR1cm4gYSArIGI7XG4gICAgfVxuXG4gICAgdmFyIE15T3RoZXJDb29sQ2xhc3MgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgJHN1cGVyOiBNeUNvb2xDbGFzcyxcbiAgICAgICAgYWRkTnVtczogZnVuY3Rpb24oYSwgYiwgYykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuJHN1cGVyY2xhc3MuYWRkTnVtcy5jYWxsKHRoaXMsIGEsIGIpICsgYztcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICB2YXIgbSA9IG5ldyBNeU90aGVyQ29vbENsYXNzKCk7XG4gICAgbS5hZGROdW1zKDEsMiwzKTtcbiAgICA+NlxuICovXG5cbi8qKlxuICogQGNmZyB7T2JqZWN0L0NvbnN0cnVjdG9yL09iamVjdFtdL0NvbnN0cnVjdG9yW119ICRtaXhpbnMgKG9wdGlvbmFsKSAgTWl4aW5zIGFyZSBhIHdheSB0byBhZGQgZnVuY3Rpb25hbGl0eVxuICogdG8gYSBjbGFzcyB0aGF0IHNob3VsZCBub3QgYWRkIHN0YXRlIHRvIHRoZSBpbnN0YW5jZSB1bmtub3dpbmdseS4gIE1peGlucyBjYW4gYmUgZWl0aGVyIG9iamVjdHMgb3IgQ29uc3RydWN0b3JzLlxuICpcbiAgICBmdW5jdGlvbiBMb2dnZXIoKSB7fVxuICAgIExvZ2dlci5wcm90b3R5cGUubG9nID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGFyZ3VtZW50cylcbiAgICB9XG5cbiAgICB2YXIgQyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICAkbWl4aW5zOiBbTG9nZ2VyLCB7XG4gICAgICAgICAgICB3YXJuOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYXJndW1lbnRzKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XVxuICAgIH0pO1xuXG4gICAgdmFyIGMgPSBuZXcgQygpO1xuXG4gICAgYy5sb2coMSwyKVxuICAgID5bMSwyXVxuXG4gICAgYy53YXJuKDMsNClcbiAgICA+WzMsNF1cbiAqXG4gKi9cbi8qKlxuICogQGNmZyB7Q29uc3RydWN0b3J9ICRzdXBlciAob3B0aW9uYWwpICBzdXBlciBmb3IgdGhlIGRlZmluaW5nIGNsYXNzLiAgQnkgTHVjLkJhc2VcbiAqIGlzIHRoZSBkZWZhdWx0IGlmIHN1cGVyIGlzIG5vdCBwYXNzZWQgaW4uICBUbyBkZWZpbmUgYSBjbGFzcyB3aXRob3V0IGEgc3VwZXJjbGFzc1xuICogeW91IGNhbiBwYXNzIGluIGZhbHNlIG9yIG51bGwuXG4gKlxuICAgICBmdW5jdGlvbiBDb3VudGVyKCkge1xuICAgICAgICB0aGlzLmNvdW50ID0gMDtcbiAgICAgfTtcblxuICAgICBDb3VudGVyLnByb3RvdHlwZSA9IHtcbiAgICAgICAgZ2V0Q291bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY291bnQ7XG4gICAgICAgIH0sXG4gICAgICAgIGluY3JlYXNlQ291bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5jb3VudCsrO1xuICAgICAgICB9XG4gICAgIH1cblxuICAgICB2YXIgQyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICAkc3VwZXI6Q291bnRlclxuICAgIH0pO1xuXG4gICAgdmFyIGMgPSBuZXcgQygpXG5cbiAgICBjIGluc3RhbmNlb2YgQ291bnRlclxuICAgID50cnVlXG4gICAgYy5pbmNyZWFzZUNvdW50KCk7XG4gICAgYy5nZXRDb3VudCgpO1xuICAgID4xXG4gICAgYy5jb3VudFxuICAgID4xXG4gKlxuICogQ2hlY2sgb3V0IEx1Yy5CYXNlIHRvIHNlZSB3aHkgd2UgaGF2ZSBpdCBhcyB0aGUgZGVmYXVsdC5cbiAqIFxuICAgIHZhciBCID0gTHVjLmRlZmluZSh7XG4gICAgICAgIGFtSUFMdWNCYXNlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgTHVjLkJhc2VcbiAgICAgICAgfVxuICAgIH0pXG4gICAgdmFyIGIgPSBuZXcgQigpO1xuICAgIGIuYW1JQUx1Y0Jhc2UoKTtcbiAgICA+dHJ1ZVxuICpcbiAqIFxuICovXG5cblxuXG4vKipcbiAqIEBjZmcge09iamVjdC9PYmplY3RbXX0gJGNvbXBvc2l0aW9ucyAob3B0aW9uYWwpIGNvbmZpZyBvYmplY3RzIGZvciBcbiAqIEx1Yy5Db21wb3NpdGlvbi4gIENvbXBvc2l0aW9ucyBhcmUgYSBncmVhdCB3YXkgdG8gYWRkIGJlaGF2aW9yIHRvIGEgY2xhc3NcbiAqIHdpdGhvdXQgZXh0ZW5kaW5nIGl0LiAgQSB7QGxpbmsgTHVjLmRlZmluZSMkbWl4aW5zIG1peGlufSBjYW4gb2ZmZXIgc2ltaWxhciBmdW5jdGlvbmFsaXR5IGJ1dCBzaG91bGRcbiAqIG5vdCBiZSBhZGRpbmcgYW4gdW5uZWVkZWQgc3RhdGUuICBBIENvbnN0cnVjdG9yIGFuZCBhIG5hbWUgYXJlIG5lZWRlZCBmb3IgdGhlIGNvbmZpZyBvYmplY3QuXG4gKiAgVXNpbmcgdGhpcyBjb25maWcgYWRkcyB0aGUge0BsaW5rIEx1Yy5kZWZpbmUjZ2V0Q29tcG9zaXRpb24gZ2V0Q29tcG9zaXRpb259XG4gKiBtZXRob2QgdG8gaW5zdGFuY2VzLlxuICogPGJyPlxuICogVGhlIG1ldGhvZHMgcHJvcGVydHkgaXMgb3B0aW9uYWwgaGVyZSBidXQgaXQgaXMgc2F5aW5nIHRha2UgYWxsIG9mIFxuICogTHVjLkV2ZW50RW1pdHRlcidzIGluc3RhbmNlIG1ldGhvZHMgYW5kIG1ha2UgdGhlbSBpbnN0YW5jZSBtZXRob2RzIGZvciBDLlxuICogWW91IGNhbiBjaGVjayBvdXQgYWxsIG9mIHRoZSBjb25maWcgb3B0aW9ucyBieSBsb29raW5nIGF0IEx1Yy5Db21wb3NpdGlvbi5cbiAqIFxuICAgICAgICB2YXIgQyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICAgICAgJGNvbXBvc2l0aW9uczoge1xuICAgICAgICAgICAgICAgIENvbnN0cnVjdG9yOiBMdWMuRXZlbnRFbWl0dGVyLFxuICAgICAgICAgICAgICAgIG5hbWU6ICdlbWl0dGVyJyxcbiAgICAgICAgICAgICAgICBtZXRob2RzOiAnYWxsTWV0aG9kcydcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIGMgPSBuZXcgQygpO1xuXG4gICAgICAgIGMub24oJ2hleScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYXJndW1lbnRzKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYy5lbWl0KCdoZXknLCAxLDIsMywgJ2EnKTtcbiAgICAgICAgPlsxLCAyLCAzLCBcImFcIl1cbiAgICAgICAgYyBpbnN0YW5jZW9mIEx1Yy5FdmVudEVtaXR0ZXJcbiAgICAgICAgPmZhbHNlXG4gICAgICAgIGMuX2V2ZW50c1xuICAgICAgICA+dW5kZWZpbmVkXG4gKlxuICogTHVjLkV2ZW50RW1pdHRlciBpcyBwcmVmZXJyZWQgYXMgYSBjb21wb3NpdGlvbiBvdmVyIGEgbWl4aW4gYmVjYXVzZVxuICogaXQgYWRkcyBhIHN0YXRlIFwiX2V2ZW50c1wiIHRvIHRoZSB0aGlzIGluc3RhbmNlIHdoZW4gb24gaXMgY2FsbGVkLiAgSXRcbiAqIGFsc28gc2hvdWxkbid0IGhhdmUgdG8ga25vdyB0aGF0IGl0IG1heSBiZSBpbnN0YW50aWF0ZWQgYWxvbmUgb3IgbWl4ZWQgaW50byBjbGFzc2VzXG4gKiBzbyB0aGUgaW5pdGluZyBvZiBzdGF0ZSBpcyBub3QgZG9uZSBpbiB0aGUgY29uc3RydWN0b3IgbGlrZSBpdCBwcm9iYWJseSBzaG91bGQuXG4gKiBJdCBpcyBub3QgdGVycmlibGUgcHJhY3RpY2UgYnkgYW55IG1lYW5zIGJ1dCBpdCBpcyBub3QgZ29vZCB0byBoYXZlIGEgc3RhbmRhbG9uZSBjbGFzc1xuICogdGhhdCBrbm93cyB0aGF0IGl0IG1heSBiZSBtaXhpbi4gIEV2ZW4gd29yc2UgdGhhbiB0aGF0IHdvdWxkIGJlIGEgbWl4aW4gdGhhdCBuZWVkc1xuICogdG8gYmUgaW5pdGVkIGJ5IHRoZSBkZWZpbmluZyBjbGFzcy4gIEVuY2Fwc3VsYXRpbmcgbG9naWMgaW4gYSBjbGFzc1xuICogYW5kIHVzaW5nIGl0IGFueXdoZXJlIHNlYW1sZXNzbHkgaXMgd2hlcmUgY29tcG9zaXRpb25zIHNoaW5lLiBMdWMgY29tZXMgd2l0aCB0d28gY29tbW9uIFxuICoge0BsaW5rIEx1YyNjb21wb3NpdGlvbkVudW1zIGVudW1zfSB0aGF0IHdlIGV4cGVjdCB3aWxsIGJlIHVzZWQgb2Z0ZW4uXG4gKiBcbiAqIDxicj5cbiAqIEhlcmUgaXMgYW4gZXhhbXBsZSBvZiBhIHNpbXBsZSBjb21wb3NpdGlvbiBzZWUgaG93IHRoZSBmdW5jdGlvbmFsaXR5IFxuICogaXMgYWRkZWQgYnV0IHdlIGFyZSBub3QgaW5oZXJpdGluZyBhbmQgdGhpcy5jb3VudCBpc1xuICogdW5kZWZpbmVkLlxuICpcbiAgICAgICAgIGZ1bmN0aW9uIENvdW50ZXIoKSB7XG4gICAgICAgICAgICB0aGlzLmNvdW50ID0gMDtcbiAgICAgICAgIH07XG5cbiAgICAgICAgIENvdW50ZXIucHJvdG90eXBlID0ge1xuICAgICAgICAgICAgZ2V0Q291bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvdW50O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGluY3JlYXNlQ291bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY291bnQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgIH1cblxuICAgICAgICAgdmFyIEMgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgICAgICAgICAkY29tcG9zaXRpb25zOiB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjb3VudGVyJyxcbiAgICAgICAgICAgICAgICAgICAgQ29uc3RydWN0b3I6IENvdW50ZXIsXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZHM6ICdhbGxNZXRob2RzJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIGMgPSBuZXcgQygpXG5cbiAgICAgICAgYy5pbmNyZWFzZUNvdW50KCk7XG4gICAgICAgIGMuaW5jcmVhc2VDb3VudCgpO1xuICAgICAgICBjLmluY3JlYXNlQ291bnQoKTtcbiAgICAgICAgYy5nZXRDb3VudCgpO1xuICAgICAgICA+M1xuICAgICAgICBjLmNvdW50XG4gICAgICAgID51bmRlZmluZWRcbiAqXG4gKiBMdWMgY29tZXMgd2l0aCB0d28gZGVmYXVsdCBjb21wb3NpdGlvbiBvYmplY3RzIEx1Yy5jb21wb3NpdGlvbkVudW1zLlBsdWdpbk1hbmFnZXJcbiAqIGFuZCBMdWMuY29tcG9zaXRpb25FbnVtcy5FdmVudEVtaXR0ZXIuXG4gKiBcbiAqIEhlcmUgaXMgdGhlIHBsdWdpbiBtYW5hZ2VyIGVudW0sIGtlZXAgaW4gbWluZCB0aGF0IHRoaXNcbiAqIGZ1bmN0aW9uYWxpdHkgY2FuIGJlIGFkZGVkIHRvIGFueSBjbGFzcywgbm90IGp1c3Qgb25lcyBkZWZpbmVkIHdpdGggXG4gKiBMdWMuZGVmaW5lLiAgQ2hlY2sgb3V0IEx1Yy5QbHVnaW5NYW5hZ2VyIHRvIHNlZSBhbGwgb2YgdGhlIHB1YmxpYyBcbiAqIG1ldGhvZHMgdGhhdCBnZXRzIGFkZGVkIHRvIHRoZSBkZWZpbmVkIGluc3RhbmNlLlxuIFxuICogQSBwbHVnaW4gZm9sbG93cyB0aGUgZm9sbG93aW5nIGxpZmUtY3ljbGU6IDxicj5cbiAgICBcbiAqcGx1Z2luIGlzIGFkZGVkIHRvIHRoZSBpbnN0YW5jZSAtPiBwbHVnaW4gaXMgY3JlYXRlZCAtPiBwbHVnaW4gaW5pdCBpcyBjYWxsZWQgd2l0aCBpbnN0YW5jZSAtPiBpZiBuZWVkZWQgZGVzdHJveSBjYWxsZWQgYnkgaW5zdGFuY2UgLT4gZGVzdHJveSBjYWxsZWQgb24gcGx1Z2luIDxicj5cbiAqSGVyZSBpcyB0aGUgbW9zdCBiYXNpYyBleGFtcGxlIHVzaW5nIHRoZSB7QGxpbmsgTHVjLlBsdWdpbiBkZWZhdWx0fSBwbHVnaW4uXG4gICBcbiAgICB2YXIgQyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICAkY29tcG9zaXRpb25zOiBMdWMuY29tcG9zaXRpb25FbnVtcy5QbHVnaW5NYW5hZ2VyXG4gICAgfSk7XG5cbiAgICB2YXIgYyA9IG5ldyBDKHtcbiAgICAgICAgcGx1Z2luczogW3tcbiAgICAgICAgICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2ltIGdldHRpbmcgaW5pdHRlZCcpXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBteUNvb2xOYW1lOiAnY29vbCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgIH0pO1xuXG4gICAgPmltIGdldHRpbmcgaW5pdHRlZFxuXG4gICAgYy5nZXRQbHVnaW4oe215Q29vbE5hbWU6ICdjb28nfSkgaW5zdGFuY2VvZiBMdWMuUGx1Z2luXG4gICAgPiB0cnVlXG5cbiogIFBsdWdpbnMgY2FuIGJlIG9mIGFueSBjbGFzcyBhbmQgY2FuIGJlIGFkZGVkIHdpdGgge0BsaW5rIEx1Yy5QbHVnaW5NYW5hZ2VyI2FkZFBsdWdpbiBhZGRQbHVnaW59XG5cbiAgICBmdW5jdGlvbiBNeVBsdWdpbigpe31cblxuICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgICRjb21wb3NpdGlvbnM6IEx1Yy5jb21wb3NpdGlvbkVudW1zLlBsdWdpbk1hbmFnZXJcbiAgICB9KTtcblxuICAgIHZhciBjID0gbmV3IEMoKTtcblxuICAgIGMuYWRkUGx1Z2luKHtDb25zdHJ1Y3RvcjogTXlQbHVnaW59KTtcbiAgICAvL2dldFBsdWdpbiB0YWtlcyBhIENvbnN0cnVjdG9yIG9yIG1hdGNoIG9iamVjdFxuICAgIGMuZ2V0UGx1Z2luKE15UGx1Z2luKSBpbnN0YW5jZW9mIE15UGx1Z2luXG4gICAgPnRydWVcbiAgICBjLmdldFBsdWdpbihMdWMuUGx1Z2luKVxuICAgID5mYWxzZVxuXG4qIFBsdWdpbnMgY2FuIGFsc28gYmUgZGVzdHJveWVkIGluZGl2aWR1YWxseSBvciBhbGwgb2YgdGhlbSBhdCBvbmNlXG4gICAgXG4gICAgdmFyIEMgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgJGNvbXBvc2l0aW9uczogTHVjLmNvbXBvc2l0aW9uRW51bXMuUGx1Z2luTWFuYWdlclxuICAgIH0pO1xuXG4gICAgdmFyIGMgPSBuZXcgQyh7XG4gICAgICAgIHBsdWdpbnM6IFt7XG4gICAgICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaW0gZ2V0dGluZyBpbml0dGVkICcgKyB0aGlzLm5hbWUpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGVzdHJveTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Rlc3Ryb3llZCA6ICcgKyB0aGlzLm5hbWUpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbmFtZTogJzEnXG4gICAgICAgIH0se1xuICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2ltIGdldHRpbmcgaW5pdHRlZCAnICsgdGhpcy5uYW1lKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdkZXN0cm95ZWQgOiAnICsgdGhpcy5uYW1lKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG5hbWU6ICcyJ1xuICAgICAgICB9XVxuICAgIH0pO1xuXG4gICAgPmltIGdldHRpbmcgaW5pdHRlZCAxXG4gICAgPmltIGdldHRpbmcgaW5pdHRlZCAyXG4gICAgXG5cbiAgICBjLmRlc3Ryb3lQbHVnaW4oe25hbWU6ICcxJ30pO1xuICAgID5kZXN0cm95ZWQgOiAxXG4gICAgLy9hIHBsdWdpbiBpcyByZXR1cm5lZCBpZiBpdCBpcyBmb3VuZCBhbmQgZGVzdHJveWVkXG4gICAgPlBsdWdpbiB7aW5pdDogZnVuY3Rpb24sIGRlc3Ryb3k6IGZ1bmN0aW9uLCBuYW1lOiBcIjFcIiwgb3duZXI6IE9iamVjdCwgaW5pdDogZnVuY3Rpb27igKZ9XG5cbiAgICBjLmRlc3Ryb3lQbHVnaW4oe25hbWU6ICcxJ30pO1xuICAgIC8vZmFsc2UgaXMgcmV0dXJuZWQgaWYgaXQgaXMgbm90IGZvdW5kXG4gICAgPmZhbHNlXG5cbiAgICBjLmRlc3Ryb3lBbGxQbHVnaW5zKCk7XG4gICAgPmRlc3Ryb3llZCA6IDJcbiAqXG4gKiBZb3UgY2FuIHNlZSB0aGF0IGl0IGNhbiBhZGQgcGx1Z2luIGxpa2UgYmVoYXZpb3IgdG8gYW55IGRlZmluaW5nXG4gKiBjbGFzcyB3aXRoIEx1Yy5QbHVnaW5NYW5hZ2VyIHdoaWNoIGlzIGxlc3MgdGhhbiA3NSBTTE9DLlxuICovIiwidmFyIGFFYWNoID0gcmVxdWlyZSgnLi4vYXJyYXknKS5lYWNoLFxuICAgIG9iaiA9IHJlcXVpcmUoJy4uL29iamVjdCcpLFxuICAgIGVtcHR5Rm4gPSByZXF1aXJlKCcuLi9mdW5jdGlvbicpLmVtcHR5Rm4sXG4gICAgYXBwbHkgPSBvYmouYXBwbHk7XG5cbi8qKlxuICogQGNsYXNzIEx1Yy5QbHVnaW5cbiAqIFNpbXBsZSBjbGFzcyB0aGF0IGlzIHRoZSBkZWZhdWx0IHBsdWdpbiB0eXBlIGZvciBMdWMuUGx1Z2luTWFuYWdlclxuICovXG5mdW5jdGlvbiBQbHVnaW4oY29uZmlnKSB7XG4gICAgYXBwbHkodGhpcywgY29uZmlnKTtcbn1cblxuUGx1Z2luLnByb3RvdHlwZSA9IHtcbiAgICAvKipcbiAgICAgKiBAbWV0aG9kXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG93bmVyIHRoZSBvd25lciBpbnN0YW5jZVxuICAgICAqIFNpbXBsZSBob29rIHRvIGluaXRpYWxpemUgdGhlIHBsdWdpblxuICAgICAqIERlZmF1bHRzIHRvIEx1Yy5lbXB0eUZuLlxuICAgICAqL1xuICAgIGluaXQ6IGVtcHR5Rm4sXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBcbiAgICAgKiBEZWZhdWx0cyB0byBMdWMuZW1wdHlGbi5cbiAgICAgKiBDYWxsZWQgd2hlbiB0aGUgcGx1Z2luIGlzIGJlaW5nIHtAbGluayBMdWMuUGx1Z2luTWFuYWdlciNkZXN0cm95UGx1Z2luIGRlc3Ryb3llZH0uXG4gICAgICovXG4gICAgZGVzdHJveTogZW1wdHlGblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQbHVnaW47XG4iLCJ2YXIgUGx1Z2luID0gcmVxdWlyZSgnLi9wbHVnaW4nKSxcbiAgICBpcyA9IHJlcXVpcmUoJy4uL2lzJyksXG4gICAgb2JqID0gcmVxdWlyZSgnLi4vb2JqZWN0JyksXG4gICAgYXJyID0gcmVxdWlyZSgnLi4vYXJyYXknKSxcbiAgICBhRWFjaCA9IGFyci5lYWNoLFxuICAgIG1peCA9IG9iai5taXgsXG4gICAgYXBwbHkgPSBvYmouYXBwbHk7XG5cbmZ1bmN0aW9uIFBsdWdpbk1hbmFnZXIoY29uZmlnKSB7XG4gICAgdGhpcy5faW5pdChjb25maWcpO1xufVxuXG4vKipcbiAqIEBwcm90ZWN0ZWRcbiAqIEBjbGFzcyBMdWMuUGx1Z2luTWFuYWdlclxuICogVGhpcyBjbGFzcyBpcyB1c2VkIGJ5IEx1Yy5jb21wb3NpdGlvbkVudW1zI1BsdWdpbk1hbmFnZXIgdG8gYWRkIGl0cyBmdW5jdGlvbmFsaXR5IFxuICogdG8gYW55IGNsYXNzLiAgIEJ5IHtAbGluayBMdWMuY29tcG9zaXRpb25FbnVtcyNQbHVnaW5NYW5hZ2VyIGRlZmF1bHR9IGl0IGFkZHNcbiAqIGFsbCBvZiB0aGVzZSBwdWJsaWMgbWV0aG9kcyB0byB0aGUgaW5zdGFuY2UuVGhpcyBjbGFzcyBpcyBkZXNpZ25lZCB0byB3b3JrIGFzIGEgY29tcG9zaXRpb24sIFxuICogaXQgaXMgZXhwb3NlZCBhcyBub3QgcHJpdmF0ZSBzbyBpdCBjYW4gYmUgZXh0ZW5kZWQgaWYgbmVlZGVkLiAgIENoZWNrIFwicHJvdGVjdGVkXCIgd2hpY2hcbiAqIGlzIGEgcGFydCBvZiB0aGUgU2hvdyB2IGRyb3Bkb3duIG9uIHRoZSByaWdodCB0byBzZWUgdGhlIHByb3RlY3RlZCBtZXRob2RzLlxuICpcbiAgICBmdW5jdGlvbiBNeVBsdWdpbigpIHtcbiAgICAgICAgdGhpcy5teUNvb2xOYW1lID0gJ2Nvbyc7XG5cbiAgICAgICAgdGhpcy5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnaW0gZ2V0dGluZyBpbml0dGVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnTXlQbHVnaW4gaW5zdGFuY2UgYmVpbmcgZGVzdHJveWVkJylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgICRjb21wb3NpdGlvbnM6IEx1Yy5jb21wb3NpdGlvbkVudW1zLlBsdWdpbk1hbmFnZXJcbiAgICB9KTtcblxuICAgIHZhciBjID0gbmV3IEMoe1xuICAgICAgICBwbHVnaW5zOiBbe1xuICAgICAgICAgICAgICAgIENvbnN0cnVjdG9yOiBNeVBsdWdpbixcbiAgICAgICAgICAgICAgICBteUNvb2xOYW1lOiAnY29vJ1xuICAgICAgICAgICAgfVxuICAgICAgICBdXG4gICAgfSk7XG5cbiAgICA+aW0gZ2V0dGluZyBpbml0dGVkXG5cbiAgICB2YXIgcGx1Z0luc3RhbmNlID0gYy5hZGRQbHVnaW4oe1xuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdJbSBnZXR0aW5nIGRlc3Ryb3llZCcpXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGMuZ2V0UGx1Z2luKEx1Yy5QbHVnaW4pXG4gICAgPiBQbHVnaW4ge2Rlc3Ryb3k6IGZ1bmN0aW9uLCBvd25lcjogTXlDbGFzcywgaW5pdDogZnVuY3Rpb24sIGRlc3Ryb3k6IGZ1bmN0aW9ufVxuXG4gICAgYy5nZXRQbHVnaW4oTXlQbHVnaW4pXG4gICAgPiBNeVBsdWdpbiB7bXlDb29sTmFtZTogXCJjb29cIiwgaW5pdDogZnVuY3Rpb24sIGRlc3Ryb3k6IGZ1bmN0aW9ufVxuXG4gICAgYy5kZXN0cm95QWxsUGx1Z2lucygpXG5cbiAgICA+TXlQbHVnaW4gaW5zdGFuY2UgYmVpbmcgZGVzdHJveWVkXG4gICAgPkltIGdldHRpbmcgZGVzdHJveWVkXG5cbiAgICBjLmdldFBsdWdpbihNeVBsdWdpbilcbiAgICA+ZmFsc2VcblxuICovXG5QbHVnaW5NYW5hZ2VyLnByb3RvdHlwZSA9IHtcbiAgIC8qKlxuICAgICogQGNmZyB7Q29uc3RydWN0b3J9IGRlZmF1bHRQbHVnaW5cbiAgICAqL1xuICAgIGRlZmF1bHRQbHVnaW46IFBsdWdpbixcblxuICAgIC8qKlxuICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgKi9cbiAgICBfaW5pdDogZnVuY3Rpb24oaW5zdGFuY2VWYWx1ZXMpIHtcbiAgICAgICAgYXBwbHkodGhpcywgaW5zdGFuY2VWYWx1ZXMpO1xuICAgICAgICB0aGlzLnBsdWdpbnMgPSBbXTtcbiAgICAgICAgdGhpcy5fY3JlYXRlUGx1Z2lucygpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcHJvdGVjdGVkXG4gICAgICovXG4gICAgX2NyZWF0ZVBsdWdpbnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICBhRWFjaCh0aGlzLl9nZXRQbHVnaW5Db25maWdGcm9tSW5zdGFuY2UoKSwgZnVuY3Rpb24ocGx1Z2luQ29uZmlnKSB7XG4gICAgICAgICAgICB0aGlzLmFkZFBsdWdpbihwbHVnaW5Db25maWcpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHByb3RlY3RlZFxuICAgICAqL1xuICAgIF9nZXRQbHVnaW5Db25maWdGcm9tSW5zdGFuY2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY29uZmlnID0gdGhpcy5pbnN0YW5jZUFyZ3NbMF0gfHwge307XG4gICAgICAgIHJldHVybiBjb25maWcucGx1Z2lucztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgcGx1Z2luIHRvIHRoZSBpbnN0YW5jZSBhbmQgaW5pdCB0aGUgXG4gICAgICogcGx1Z2luLlxuICAgICAqIEBwYXJhbSAge09iamVjdH0gcGx1Z2luQ29uZmlnXG4gICAgICogQHJldHVybiB7T2JqZWN0fSB0aGUgY3JlYXRlZCBwbHVnaW4gaW5zdGFuY2VcbiAgICAgKi9cbiAgICBhZGRQbHVnaW46IGZ1bmN0aW9uKHBsdWdpbkNvbmZpZykge1xuICAgICAgICB2YXIgcGx1Z2luSW5zdGFuY2UgPSB0aGlzLl9jcmVhdGVQbHVnaW4ocGx1Z2luQ29uZmlnKTtcblxuICAgICAgICB0aGlzLl9pbml0UGx1Z2luKHBsdWdpbkluc3RhbmNlKTtcblxuICAgICAgICB0aGlzLnBsdWdpbnMucHVzaChwbHVnaW5JbnN0YW5jZSk7XG5cbiAgICAgICAgcmV0dXJuIHBsdWdpbkluc3RhbmNlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcHJvdGVjdGVkXG4gICAgICovXG4gICAgX2NyZWF0ZVBsdWdpbjogZnVuY3Rpb24oY29uZmlnKSB7XG4gICAgICAgIGNvbmZpZy5vd25lciA9IHRoaXMuaW5zdGFuY2U7XG5cbiAgICAgICAgaWYgKGNvbmZpZy5Db25zdHJ1Y3Rvcikge1xuICAgICAgICAgICAgLy9jYWxsIHRoZSBjb25maWdlZCBDb25zdHJ1Y3RvciB3aXRoIHRoZSBcbiAgICAgICAgICAgIC8vcGFzc2VkIGluIGNvbmZpZyBidXQgdGFrZSBvZmYgdGhlIENvbnN0cnVjdG9yXG4gICAgICAgICAgICAvL2NvbmZpZy5cbiAgICAgICAgICAgICBcbiAgICAgICAgICAgIC8vVGhlIHBsdWdpbiBDb25zdHJ1Y3RvciBcbiAgICAgICAgICAgIC8vc2hvdWxkIG5vdCBuZWVkIHRvIGtub3cgYWJvdXQgaXRzZWxmXG4gICAgICAgICAgICByZXR1cm4gbmV3IGNvbmZpZy5Db25zdHJ1Y3RvcihhcHBseShjb25maWcsIHtcbiAgICAgICAgICAgICAgICBDb25zdHJ1Y3RvcjogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IHRoaXMuZGVmYXVsdFBsdWdpbihjb25maWcpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcHJvdGVjdGVkXG4gICAgICovXG4gICAgX2luaXRQbHVnaW46IGZ1bmN0aW9uKHBsdWdpbikge1xuICAgICAgICBpZiAoaXMuaXNGdW5jdGlvbihwbHVnaW4uaW5pdCkpIHtcbiAgICAgICAgICAgIHBsdWdpbi5pbml0KHRoaXMuaW5zdGFuY2UpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENhbGwgZGVzdHJveSBvbiBhbGwgb2YgdGhlIHBsdWdpbnNcbiAgICAgKiBhbmQgcmVtb3ZlIHRoZW0uXG4gICAgICovXG4gICAgZGVzdHJveUFsbFBsdWdpbnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnBsdWdpbnMuZm9yRWFjaChmdW5jdGlvbihwbHVnaW4pIHtcbiAgICAgICAgICAgIHRoaXMuX2Rlc3Ryb3lQbHVnaW4ocGx1Z2luKTtcbiAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5wbHVnaW5zID0gW107XG4gICAgfSxcblxuICAgIF9kZXN0cm95UGx1Z2luOiBmdW5jdGlvbihwbHVnaW4pIHtcbiAgICAgICAgaWYgKGlzLmlzRnVuY3Rpb24ocGx1Z2luLmRlc3Ryb3kpKSB7XG4gICAgICAgICAgICBwbHVnaW4uZGVzdHJveSh0aGlzLmluc3RhbmNlKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgdGhlIHBsdWdpbiBhbmQgaWYgZm91bmQgZGVzdHJveSBpdC5cbiAgICAgKiBAcGFyYW0gIHtPYmplY3QvQ29uc3RydWN0b3J9IG9iamVjdCB0byB1c2UgdG8gbWF0Y2ggXG4gICAgICogdGhlIHBsdWdpbiB0byByZW1vdmUuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSB0aGUgZGVzdHJveWVkIHBsdWdpbi5cbiAgICAgKi9cbiAgICBkZXN0cm95UGx1Z2luOiBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgdmFyIHBsdWdpbiA9IHRoaXMuZ2V0UGx1Z2luKG9iaik7XG5cbiAgICAgICAgaWYocGx1Z2luKSB7XG4gICAgICAgICAgICB0aGlzLl9kZXN0cm95UGx1Z2luKHBsdWdpbik7XG4gICAgICAgICAgICBhcnIucmVtb3ZlRmlyc3QodGhpcy5wbHVnaW5zLCBwbHVnaW4sIHt0eXBlOiAnc3RyaWN0J30pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBsdWdpbjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IGEgcGx1Z2luIGluc3RhbmNlLiAgQSBDb25zdHJ1Y3RvciBvciBhbiBvYmplY3QgY2FuIGJlIHVzZWRcbiAgICAgKiB0byBmaW5kIGEgcGx1Z2luLlxuICAgICAqXG4gICAgICAgICAgYy5hZGRQbHVnaW4oe2E6MX0pXG4gICAgICAgICAgYy5nZXRQbHVnaW4oe2E6MX0pXG4gICAgICAgICAgPkx1Yy5QbHVnaW4oe2E6MX0pXG5cbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9IG9iaiBcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IHRoZSBwbHVnaW4gaW5zdGFuY2UgaWYgZm91bmQuXG4gICAgICovXG4gICAgZ2V0UGx1Z2luOiBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgaWYgKGlzLmlzRnVuY3Rpb24ob2JqKSkge1xuICAgICAgICAgICAgcmV0dXJuIGFyci5maW5kRmlyc3RJbnN0YW5jZU9mKHRoaXMucGx1Z2lucywgb2JqKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXJyLmZpbmRGaXJzdCh0aGlzLnBsdWdpbnMsIG9iaiwge3R5cGU6ICdsb29zZSd9KTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBsdWdpbk1hbmFnZXI7IiwidmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJy4uL2V2ZW50cy9ldmVudEVtaXR0ZXInKSxcbiAgICBQbHVnaW5NYW5hZ2VyID0gcmVxdWlyZSgnLi9wbHVnaW5NYW5hZ2VyJyk7XG5cbi8qKlxuICogQGNsYXNzIEx1Yy5jb21wb3NpdGlvbkVudW1zXG4gKiBDb21wb3NpdGlvbiBlbnVtcyBhcmUganVzdCBjb21tb24gY29uZmlnIG9iamVjdHMgZm9yIEx1Yy5Db21wb3NpdGlvbi5cbiAqIEhlcmUgaXMgYW4gZXhhbXBsZSBvZiBhIGNvbXBvc2l0aW9uIHRoYXQgdXNlcyBFdmVudEVtaXR0ZXIgYnV0IG9ubHlcbiAqIHB1dHMgdGhlIGVtaXQgbWV0aG9kIG9uIHRoZSBwcm90b3R5cGUuXG4gKlxuICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgICRjb21wb3NpdGlvbnM6IHtcbiAgICAgICAgICAgIGRlZmF1bHRzOiBMdWMuY29tcG9zaXRpb25FbnVtcy5FdmVudEVtaXR0ZXIsXG4gICAgICAgICAgICBtZXRob2RzOiBbJ2VtaXQnXVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB2YXIgYyA9IG5ldyBDKCk7XG5cbiAgICB0eXBlb2YgYy5lbWl0XG4gICAgPlwiZnVuY3Rpb25cIlxuICAgIHR5cGVvZiBjLm9uXG4gICAgXCJ1bmRlZmluZWRcIlxuICogXG4gKi9cblxuLyoqXG4gKiBAcHJvcGVydHkge09iamVjdH0gRXZlbnRFbWl0dGVyXG4gKi9cbm1vZHVsZS5leHBvcnRzLkV2ZW50RW1pdHRlciA9IHtcbiAgICBDb25zdHJ1Y3RvcjogRXZlbnRFbWl0dGVyLFxuICAgIG5hbWU6ICdlbWl0dGVyJyxcbiAgICBtZXRob2RzOiAnYWxsTWV0aG9kcydcbn07XG5cblxuLyoqXG4gKiBAcHJvcGVydHkge09iamVjdH0gUGx1Z2luTWFuYWdlclxuICovXG5tb2R1bGUuZXhwb3J0cy5QbHVnaW5NYW5hZ2VyID0ge1xuICAgIG5hbWU6ICdwbHVnaW5zJyxcbiAgICBpbml0QWZ0ZXI6IHRydWUsXG4gICAgQ29uc3RydWN0b3I6IFBsdWdpbk1hbmFnZXIsXG4gICAgY3JlYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzLkNvbnN0cnVjdG9yKHtcbiAgICAgICAgICAgIGluc3RhbmNlOiB0aGlzLmluc3RhbmNlLFxuICAgICAgICAgICAgaW5zdGFuY2VBcmdzOiB0aGlzLmluc3RhbmNlQXJnc1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGlnbm9yZU1ldGhvZHM6ICdkZWZhdWx0UGx1Z2luJyxcbiAgICBtZXRob2RzOiAncHVibGljTWV0aG9kcydcbn07IiwidmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcbi8qKlxuICogQGxpY2Vuc2UgaHR0cHM6Ly9yYXcuZ2l0aHViLmNvbS9qb3llbnQvbm9kZS92MC4xMC4xMS9MSUNFTlNFXG4gKiBOb2RlIGpzIGxpY2Vuc2UuIEV2ZW50RW1pdHRlciB3aWxsIGJlIGluIHRoZSBjbGllbnRcbiAqIG9ubHkgY29kZS5cbiAqL1xuLyoqXG4gKiBAY2xhc3MgTHVjLkV2ZW50RW1pdHRlclxuICogVGhlIHdvbmRlcmZ1bCBldmVudCBlbW1pdGVyIHRoYXQgY29tZXMgd2l0aCBub2RlLFxuICogdGhhdCB3b3JrcyBpbiB0aGUgc3VwcG9ydGVkIGJyb3dzZXJzLlxuICogW2h0dHA6Ly9ub2RlanMub3JnL2FwaS9ldmVudHMuaHRtbF0oaHR0cDovL25vZGVqcy5vcmcvYXBpL2V2ZW50cy5odG1sKVxuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICAgIC8vcHV0IGluIGZpeCBmb3IgSUUgOSBhbmQgYmVsb3dcbiAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgIGcgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHNlbGYucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG4gICAgICAgICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuXG4gICAgc2VsZi5vbih0eXBlLCBnKTtcblxuICAgIHJldHVybiB0aGlzO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7IiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxucHJvY2Vzcy5uZXh0VGljayA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhblNldEltbWVkaWF0ZSA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnNldEltbWVkaWF0ZTtcbiAgICB2YXIgY2FuUG9zdCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnBvc3RNZXNzYWdlICYmIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyXG4gICAgO1xuXG4gICAgaWYgKGNhblNldEltbWVkaWF0ZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIHdpbmRvdy5zZXRJbW1lZGlhdGUoZikgfTtcbiAgICB9XG5cbiAgICBpZiAoY2FuUG9zdCkge1xuICAgICAgICB2YXIgcXVldWUgPSBbXTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIGlmIChldi5zb3VyY2UgPT09IHdpbmRvdyAmJiBldi5kYXRhID09PSAncHJvY2Vzcy10aWNrJykge1xuICAgICAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGlmIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmbiA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgICAgIHF1ZXVlLnB1c2goZm4pO1xuICAgICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKCdwcm9jZXNzLXRpY2snLCAnKicpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICBzZXRUaW1lb3V0KGZuLCAwKTtcbiAgICB9O1xufSkoKTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufVxuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG4iLCJ2YXIgcHJvY2Vzcz1yZXF1aXJlKFwiX19icm93c2VyaWZ5X3Byb2Nlc3NcIik7aWYgKCFwcm9jZXNzLkV2ZW50RW1pdHRlcikgcHJvY2Vzcy5FdmVudEVtaXR0ZXIgPSBmdW5jdGlvbiAoKSB7fTtcblxudmFyIEV2ZW50RW1pdHRlciA9IGV4cG9ydHMuRXZlbnRFbWl0dGVyID0gcHJvY2Vzcy5FdmVudEVtaXR0ZXI7XG52YXIgaXNBcnJheSA9IHR5cGVvZiBBcnJheS5pc0FycmF5ID09PSAnZnVuY3Rpb24nXG4gICAgPyBBcnJheS5pc0FycmF5XG4gICAgOiBmdW5jdGlvbiAoeHMpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4cykgPT09ICdbb2JqZWN0IEFycmF5XSdcbiAgICB9XG47XG5mdW5jdGlvbiBpbmRleE9mICh4cywgeCkge1xuICAgIGlmICh4cy5pbmRleE9mKSByZXR1cm4geHMuaW5kZXhPZih4KTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHhzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh4ID09PSB4c1tpXSkgcmV0dXJuIGk7XG4gICAgfVxuICAgIHJldHVybiAtMTtcbn1cblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhblxuLy8gMTAgbGlzdGVuZXJzIGFyZSBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoXG4vLyBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbi8vXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxudmFyIGRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIXRoaXMuX2V2ZW50cykgdGhpcy5fZXZlbnRzID0ge307XG4gIHRoaXMuX2V2ZW50cy5tYXhMaXN0ZW5lcnMgPSBuO1xufTtcblxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc0FycmF5KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKVxuICAgIHtcbiAgICAgIGlmIChhcmd1bWVudHNbMV0gaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBhcmd1bWVudHNbMV07IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmNhdWdodCwgdW5zcGVjaWZpZWQgJ2Vycm9yJyBldmVudC5cIik7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpIHJldHVybiBmYWxzZTtcbiAgdmFyIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGlmICghaGFuZGxlcikgcmV0dXJuIGZhbHNlO1xuXG4gIGlmICh0eXBlb2YgaGFuZGxlciA9PSAnZnVuY3Rpb24nKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG5cbiAgfSBlbHNlIGlmIChpc0FycmF5KGhhbmRsZXIpKSB7XG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gICAgdmFyIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGxpc3RlbmVycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG5cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG5cbi8vIEV2ZW50RW1pdHRlciBpcyBkZWZpbmVkIGluIHNyYy9ub2RlX2V2ZW50cy5jY1xuLy8gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0KCkgaXMgYWxzbyBkZWZpbmVkIHRoZXJlLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICgnZnVuY3Rpb24nICE9PSB0eXBlb2YgbGlzdGVuZXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2FkZExpc3RlbmVyIG9ubHkgdGFrZXMgaW5zdGFuY2VzIG9mIEZ1bmN0aW9uJyk7XG4gIH1cblxuICBpZiAoIXRoaXMuX2V2ZW50cykgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PSBcIm5ld0xpc3RlbmVyc1wiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lcnNcIi5cbiAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSkge1xuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICB9IGVsc2UgaWYgKGlzQXJyYXkodGhpcy5fZXZlbnRzW3R5cGVdKSkge1xuXG4gICAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICAgIHZhciBtO1xuICAgICAgaWYgKHRoaXMuX2V2ZW50cy5tYXhMaXN0ZW5lcnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBtID0gdGhpcy5fZXZlbnRzLm1heExpc3RlbmVycztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG0gPSBkZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgICAgfVxuXG4gICAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICB9IGVsc2Uge1xuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgc2VsZi5vbih0eXBlLCBmdW5jdGlvbiBnKCkge1xuICAgIHNlbGYucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG4gICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCdmdW5jdGlvbicgIT09IHR5cGVvZiBsaXN0ZW5lcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncmVtb3ZlTGlzdGVuZXIgb25seSB0YWtlcyBpbnN0YW5jZXMgb2YgRnVuY3Rpb24nKTtcbiAgfVxuXG4gIC8vIGRvZXMgbm90IHVzZSBsaXN0ZW5lcnMoKSwgc28gbm8gc2lkZSBlZmZlY3Qgb2YgY3JlYXRpbmcgX2V2ZW50c1t0eXBlXVxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKSByZXR1cm4gdGhpcztcblxuICB2YXIgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNBcnJheShsaXN0KSkge1xuICAgIHZhciBpID0gaW5kZXhPZihsaXN0LCBsaXN0ZW5lcik7XG4gICAgaWYgKGkgPCAwKSByZXR1cm4gdGhpcztcbiAgICBsaXN0LnNwbGljZShpLCAxKTtcbiAgICBpZiAobGlzdC5sZW5ndGggPT0gMClcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIH0gZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdID09PSBsaXN0ZW5lcikge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZG9lcyBub3QgdXNlIGxpc3RlbmVycygpLCBzbyBubyBzaWRlIGVmZmVjdCBvZiBjcmVhdGluZyBfZXZlbnRzW3R5cGVdXG4gIGlmICh0eXBlICYmIHRoaXMuX2V2ZW50cyAmJiB0aGlzLl9ldmVudHNbdHlwZV0pIHRoaXMuX2V2ZW50c1t0eXBlXSA9IG51bGw7XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIGlmICghdGhpcy5fZXZlbnRzKSB0aGlzLl9ldmVudHMgPSB7fTtcbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFtdO1xuICBpZiAoIWlzQXJyYXkodGhpcy5fZXZlbnRzW3R5cGVdKSkge1xuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICB9XG4gIHJldHVybiB0aGlzLl9ldmVudHNbdHlwZV07XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCFlbWl0dGVyLl9ldmVudHMgfHwgIWVtaXR0ZXIuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSAwO1xuICBlbHNlIGlmICh0eXBlb2YgZW1pdHRlci5fZXZlbnRzW3R5cGVdID09PSAnZnVuY3Rpb24nKVxuICAgIHJldCA9IDE7XG4gIGVsc2VcbiAgICByZXQgPSBlbWl0dGVyLl9ldmVudHNbdHlwZV0ubGVuZ3RoO1xuICByZXR1cm4gcmV0O1xufTtcbiIsInZhciBvYmogPSByZXF1aXJlKCcuLi9vYmplY3QnKSxcbiAgICBhcnJheSA9IHJlcXVpcmUoJy4uL2FycmF5JyksXG4gICAgYXBwbHkgPSBvYmouYXBwbHksXG4gICAgbWl4ID0gb2JqLm1peCxcbiAgICBvRmlsdGVyID0gb2JqLmZpbHRlcixcbiAgICBlbXB0eUZuID0gKCcuLi9mdW5jdGlvbicpLmVtcHR5Rm4sXG4gICAgaXMgPSByZXF1aXJlKCcuLi9pcycpO1xuXG4vKipcbiAqIEBjbGFzcyAgTHVjLkNvbXBvc2l0aW9uXG4gKiBAcHJvdGVjdGVkXG4gKiBDbGFzcyB0aGF0IHdyYXBzIHtAbGluayBMdWMuZGVmaW5lIyRjb21wb3NpdGlvbnMgY29tcG9zaXRpb259IGNvbmZpZyBvYmplY3RzXG4gKiB0byBjb25mb3JtIHRvIGFuIGFwaS4gVGhpcyBjbGFzcyBpcyBub3QgYXZhaWxhYmxlIGV4dGVybmFsbHkuICBUaGUgY29uZmlnIG9iamVjdFxuICogd2lsbCBvdmVycmlkZSBhbnkgcHJvdGVjdGVkIG1ldGhvZHMgYW5kIGRlZmF1bHQgY29uZmlncy4gIERlZmF1bHRzXG4gKiBjYW4gYmUgdXNlZCBmb3Igb2Z0ZW4gdXNlZCBjb25maWdzLCBrZXlzIHRoYXQgYXJlIG5vdCBkZWZhdWx0cyB3aWxsXG4gKiBvdmVycmlkZSB0aGUgZGVmYXVsdHMuXG4gKlxuICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgICRjb21wb3NpdGlvbnM6IHtcbiAgICAgICAgICAgIGRlZmF1bHRzOiBMdWMuY29tcG9zaXRpb25FbnVtcy5FdmVudEVtaXR0ZXIsXG4gICAgICAgICAgICBtZXRob2RzOiBbJ2VtaXQnXVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB2YXIgYyA9IG5ldyBDKClcbiAgICB0eXBlb2YgYy5lbWl0XG4gICAgPlwiZnVuY3Rpb25cIlxuICAgIHR5cGVvZiBjLm9uXG4gICAgPlwidW5kZWZpbmVkXCJcbiAqXG4gKiBJZiB5b3Ugd2FudCB0byBhZGQgeW91ciBvd24gY29tcG9zaXRpb24gYWxsIHlvdSBuZWVkIHRvIGhhdmUgaXNcbiAqIGEgbmFtZSBhbmQgYSBDb25zdHJ1Y3RvciwgdGhlIHJlc3Qgb2YgdGhlIGNvbmZpZ3Mgb2YgdGhpcyBjbGFzcyBhbmQgTHVjLkNvbXBvc2l0aW9uLmNyZWF0ZVxuICogY2FuIGJlIHVzZWQgdG8gaW5qZWN0IGJlaGF2aW9yIGlmIG5lZWRlZC5cbiAqIFxuICAgICBmdW5jdGlvbiBDb3VudGVyKCkge1xuICAgICAgICB0aGlzLmNvdW50ID0gMDtcbiAgICAgfTtcblxuICAgICBDb3VudGVyLnByb3RvdHlwZSA9IHtcbiAgICAgICAgZ2V0Q291bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY291bnQ7XG4gICAgICAgIH0sXG4gICAgICAgIGluY3JlYXNlQ291bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5jb3VudCsrO1xuICAgICAgICB9XG4gICAgIH1cblxuICAgICB2YXIgQyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICAgICAgJGNvbXBvc2l0aW9uczoge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdjb3VudGVyJyxcbiAgICAgICAgICAgICAgICBDb25zdHJ1Y3RvcjogQ291bnRlcixcbiAgICAgICAgICAgICAgICBtZXRob2RzOiAnYWxsTWV0aG9kcydcbiAgICAgICAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciBjID0gbmV3IEMoKVxuXG4gICAgYy5pbmNyZWFzZUNvdW50KCk7XG4gICAgYy5pbmNyZWFzZUNvdW50KCk7XG4gICAgYy5pbmNyZWFzZUNvdW50KCk7XG4gICAgYy5nZXRDb3VudCgpO1xuICAgID4zXG4gICAgYy5jb3VudFxuICAgID51bmRlZmluZWRcbiAqL1xuZnVuY3Rpb24gQ29tcG9zaXRpb24oYykge1xuICAgIHZhciBkZWZhdWx0cyA9IGMuZGVmYXVsdHMsXG4gICAgICAgIGNvbmZpZyA9IGM7XG5cbiAgICBpZihkZWZhdWx0cykge1xuICAgICAgICBtaXgoY29uZmlnLCBjb25maWcuZGVmYXVsdHMpO1xuICAgICAgICBkZWxldGUgY29uZmlnLmRlZmF1bHRzO1xuICAgIH1cblxuICAgIGFwcGx5KHRoaXMsIGNvbmZpZyk7XG59XG5cbkNvbXBvc2l0aW9uLnByb3RvdHlwZSA9IHtcbiAgICAvKipcbiAgICAgKiBAY2ZnIHtTdHJpbmd9IG5hbWUgKHJlcXVpcmVkKSB0aGUgbmFtZSB3aGljaCB0aGUgY29tcG9zaXRpb25cbiAgICAgKiB3aWxsIGJlIHJlZmVycmVkIHRvIGJ5IHRoZSBpbnN0YW5jZS5cbiAgICAgKi9cbiAgICBcbiAgICAvKipcbiAgICAgKiBAY2ZnIHtPYmplY3R9IGRlZmF1bHRzXG4gICAgICovXG4gICAgXG4gICAgLyoqXG4gICAgICogQGNmZyB7Qm9vbGVhbn0gaW5pdEFmdGVyICBkZWZhdWx0cyB0byBmYWxzZVxuICAgICAqIHBhc3MgaW4gdHJ1ZSB0byBpbml0IHRoZSBjb21wb3NpdGlvbiBpbnN0YW5jZSBhZnRlciB0aGUgXG4gICAgICogc3VwZXJjbGFzcyBoYXMgYmVlbiBjYWxsZWQuXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBAY2ZnIHtGdW5jdGlvbn0gQ29uc3RydWN0b3IgKHJlcXVpcmVkKSB0aGUgQ29uc3RydWN0b3JcbiAgICAgKiB0byB1c2Ugd2hlbiBjcmVhdGluZyB0aGUgY29tcG9zaXRpb24gaW5zdGFuY2UuICBUaGlzXG4gICAgICogaXMgcmVxdWlyZWQgaWYgTHVjLkNvbXBvc2l0aW9uLmNyZWF0ZSBpcyBub3Qgb3ZlcndyaXR0ZW4gYnlcbiAgICAgKiB0aGUgcGFzc2VkIGluIGNvbXBvc2l0aW9uIGNvbmZpZyBvYmplY3QuXG4gICAgICovXG4gICAgXG4gICAgLyoqXG4gICAgICogQHByb3RlY3RlZFxuICAgICAqIEJ5IGRlZmF1bHQganVzdCByZXR1cm4gYSBuZXdseSBjcmVhdGVkIENvbnN0cnVjdG9yIGluc3RhbmNlLlxuICAgICAqIFxuICAgICAqIFdoZW4gY3JlYXRlIGlzIGNhbGxlZCB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXMgY2FuIGJlIHVzZWQgOlxuICAgICAqIFxuICAgICAqIHRoaXMuaW5zdGFuY2UgVGhlIGluc3RhbmNlIHRoYXQgaXMgY3JlYXRpbmdcbiAgICAgKiB0aGUgY29tcG9zaXRpb24uXG4gICAgICogXG4gICAgICogdGhpcy5Db25zdHJ1Y3RvciB0aGUgY29uc3RydWN0b3IgdGhhdCBpcyBwYXNzZWQgaW4gZnJvbVxuICAgICAqIHRoZSBjb21wb3NpdGlvbiBjb25maWcuIFxuICAgICAqXG4gICAgICogdGhpcy5pbnN0YW5jZUFyZ3MgdGhlIGFyZ3VtZW50cyBwYXNzZWQgaW50byB0aGUgaW5zdGFuY2Ugd2hlbiBpdCBcbiAgICAgKiBpcyBiZWluZyBjcmVhdGVkLiAgRm9yIGV4YW1wbGVcblxuICAgICAgICBuZXcgTXlDbGFzc1dpdGhBQ29tcG9zaXRpb24oe3BsdWdpbnM6IFtdfSlcbiAgICAgICAgLy9pbnNpZGUgb2YgdGhlIGNyZWF0ZSBtZXRob2RcbiAgICAgICAgdGhpcy5pbnN0YW5jZUFyZ3NcbiAgICAgICAgPlt7cGx1Z2luczogW119XVxuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBcbiAgICAgKiB0aGUgY29tcG9zaXRpb24gaW5zdGFuY2UuXG4gICAgICpcbiAgICAgKiBGb3IgZXhhbXBsZSBzZXQgdGhlIGVtaXR0ZXJzIG1heExpc3RlbmVyc1xuICAgICAqIHRvIHdoYXQgdGhlIGluc3RhbmNlIGhhcyBjb25maWdlZC5cbiAgICAgIFxuICAgICAgICBtYXhMaXN0ZW5lcnM6IDEwMCxcbiAgICAgICAgJGNvbXBvc2l0aW9uczoge1xuICAgICAgICAgICAgQ29uc3RydWN0b3I6IEx1Yy5FdmVudEVtaXR0ZXIsXG4gICAgICAgICAgICBjcmVhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBlbWl0dGVyID0gbmV3IHRoaXMuQ29uc3RydWN0b3IoKTtcbiAgICAgICAgICAgICAgICBlbWl0dGVyLnNldE1heExpc3RlbmVycyh0aGlzLmluc3RhbmNlLm1heExpc3RlbmVycyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVtaXR0ZXI7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbmFtZTogJ2VtaXR0ZXInXG4gICAgICAgIH1cblxuICAgICAqL1xuICAgIGNyZWF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBuZXcgdGhpcy5Db25zdHJ1Y3RvcigpO1xuICAgIH0sXG5cbiAgICBnZXRJbnN0YW5jZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZSgpO1xuICAgIH0sXG5cbiAgICB2YWxpZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKHRoaXMubmFtZSAgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBIG5hbWUgbXVzdCBiZSBkZWZpbmVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYoIWlzLmlzRnVuY3Rpb24odGhpcy5Db25zdHJ1Y3RvcikgJiYgdGhpcy5jcmVhdGUgPT09IENvbXBvc2l0aW9uLnByb3RvdHlwZS5jcmVhdGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIENvbnN0cnVjdG9yIG11c3QgYmUgZnVuY3Rpb24gaWYgY3JlYXRlIGlzIG5vdCBvdmVycmlkZGVuJyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IGZpbHRlck1ldGhvZEZuc1xuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQHByb3BlcnR5IGZpbHRlck1ldGhvZEZucy5hbGxNZXRob2RzIHJldHVybiBhbGwgbWV0aG9kcyBmcm9tIHRoZVxuICAgICAqIGNvbnN0cnVjdG9ycyBwcm90b3R5cGVcbiAgICAgKiBAcHJvcGVydHkgZmlsdGVyTWV0aG9kRm5zLnB1YmxpYyByZXR1cm4gYWxsIG1ldGhvZHMgdGhhdCBkb24ndFxuICAgICAqIHN0YXJ0IHdpdGggXy4gIFdlIGtub3cgbm90IGV2ZXJ5b25lIGZvbGxvd3MgdGhpcyBjb252ZW50aW9uLCBidXQgd2VcbiAgICAgKiBkbyBhbmQgc28gZG8gbWFueSBvdGhlcnMuXG4gICAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgICAqL1xuICAgIGZpbHRlck1ldGhvZEZuczoge1xuICAgICAgICBhbGxNZXRob2RzOiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gaXMuaXNGdW5jdGlvbih2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIHB1YmxpY01ldGhvZHM6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBpcy5pc0Z1bmN0aW9uKHZhbHVlKSAmJiBrZXkuY2hhckF0KDApICE9PSAnXyc7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQGNmZyB7RnVuY3Rpb24vU3RyaW5nL0FycmF5W119IG1ldGhvZHNcbiAgICAgKiBUaGUga2V5cyB0byBhZGQgdG8gdGhlIGRlZmluZXJzIHByb3RvdHlwZSB0aGF0IHdpbGwgaW4gdHVybiBjYWxsXG4gICAgICogdGhlIGNvbXBvc2l0aW9ucyBtZXRob2QuXG4gICAgICogXG4gICAgICogRGVmYXVsdHMgdG8gTHVjLmVtcHR5Rm4uIFxuICAgICAqIElmIGFuIGFycmF5IGlzIHBhc3NlZCBpdCB3aWxsIGp1c3QgdXNlIHRoYXQgQXJyYXkuXG4gICAgICogXG4gICAgICogSWYgYSBzdHJpbmcgaXMgcGFzc2VkIGFuZCBtYXRjaGVzIGEgbWV0aG9kIGZyb20gXG4gICAgICogTHVjLkNvbXBvc2l0aW9uLmZpbHRlck1ldGhvZEZucyBpdCB3aWxsIGNhbGwgdGhhdCBpbnN0ZWFkLlxuICAgICAqIFxuICAgICAqIElmIGEgZnVuY3Rpb24gaXMgZGVmaW5lZCBpdFxuICAgICAqIHdpbGwgZ2V0IGNhbGxlZCB3aGlsZSBpdGVyYXRpbmcgb3ZlciBlYWNoIGtleSB2YWx1ZSBwYWlyIG9mIHRoZSBcbiAgICAgKiBDb25zdHJ1Y3RvcidzIHByb3RvdHlwZSwgaWYgYSB0cnV0aHkgdmFsdWUgaXMgXG4gICAgICogcmV0dXJuZWQgdGhlIHByb3BlcnR5IHdpbGwgYmUgYWRkZWQgdG8gdGhlIGRlZmluaW5nXG4gICAgICogY2xhc3NlcyBwcm90b3R5cGUuXG4gICAgICogXG4gICAgICogRm9yIGV4YW1wbGUgdGhpcyBjb25maWcgd2lsbCBvbmx5IGV4cG9zZSB0aGUgZW1pdCBtZXRob2QgXG4gICAgICogdG8gdGhlIGRlZmluaW5nIGNsYXNzXG4gICAgIFxuICAgICAgICAkY29tcG9zaXRpb25zOiB7XG4gICAgICAgICAgICBDb25zdHJ1Y3RvcjogTHVjLkV2ZW50RW1pdHRlcixcbiAgICAgICAgICAgIG1ldGhvZHM6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ga2V5ID09PSAnZW1pdCc7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbmFtZTogJ2VtaXR0ZXInXG4gICAgICAgIH1cbiAgICAgKiB0aGlzIGlzIGFsc28gYSB2YWxpZCBjb25maWdcbiAgICAgKiBcbiAgICAgICAgJGNvbXBvc2l0aW9uczoge1xuICAgICAgICAgICAgQ29uc3RydWN0b3I6IEx1Yy5FdmVudEVtaXR0ZXIsXG4gICAgICAgICAgICBtZXRob2RzOiBbJ2VtaXR0ZXInXSxcbiAgICAgICAgICAgIG5hbWU6ICdlbWl0dGVyJ1xuICAgICAgICB9XG4gICAgICogXG4gICAgICovXG4gICAgbWV0aG9kczogZW1wdHlGbixcblxuICAgIC8qKlxuICAgICAqIEBjZmcge1N0cmluZ1tdL1N0cmluZ30gaWdub3JlTWV0aG9kcyBtZXRob2RzIHRoYXQgd2lsbCBhbHdheXNcbiAgICAgKiBiZSBpZ25vcmVkIGlmIG1ldGhvZHMgaXMgbm90IGFuIEFycmF5LlxuICAgICAqXG4gICAgICAgIFxuICAgICAgICB2YXIgQyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICAgICAgICAgICRjb21wb3NpdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdHM6IEx1Yy5jb21wb3NpdGlvbkVudW1zLkV2ZW50RW1pdHRlcixcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kczogJ2FsbE1ldGhvZHMnLFxuICAgICAgICAgICAgICAgICAgICBpZ25vcmVNZXRob2RzOiBbJ2VtaXQnXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgYyA9IG5ldyBDKCk7XG4gICAgICAgICAgICB0eXBlb2YgYy5lbWl0XG4gICAgICAgICAgICA+XCJ1bmRlZmluZWRcIlxuICAgICAqL1xuICAgIGlnbm9yZU1ldGhvZHM6IHVuZGVmaW5lZCxcblxuICAgIGdldE9iamVjdFdpdGhNZXRob2RzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1ldGhvZHNPYmogPSB0aGlzLkNvbnN0cnVjdG9yICYmIHRoaXMuQ29uc3RydWN0b3IucHJvdG90eXBlO1xuICAgICAgICBpZiAodGhpcy5pZ25vcmVNZXRob2RzKSB7XG4gICAgICAgICAgICBtZXRob2RzT2JqID0gYXBwbHkoe30sIG1ldGhvZHNPYmopO1xuICAgICAgICAgICAgYXJyYXkuZWFjaCh0aGlzLmlnbm9yZU1ldGhvZHMsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIG1ldGhvZHNPYmpbdmFsdWVdO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbWV0aG9kc09iajtcbiAgICB9LFxuXG4gICAgZ2V0TWV0aG9kc1RvQ29tcG9zZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtZXRob2RzID0gdGhpcy5tZXRob2RzLFxuICAgICAgICAgICAgZmlsdGVyRm47XG4gICAgICAgICAgICBcbiAgICAgICAgaWYgKGlzLmlzQXJyYXkobWV0aG9kcykpIHtcbiAgICAgICAgICAgIHJldHVybiBtZXRob2RzO1xuICAgICAgICB9XG5cbiAgICAgICAgZmlsdGVyRm4gPSBtZXRob2RzO1xuXG4gICAgICAgIGlmIChpcy5pc1N0cmluZyhtZXRob2RzKSkge1xuICAgICAgICAgICAgZmlsdGVyRm4gPSB0aGlzLmZpbHRlck1ldGhvZEZuc1ttZXRob2RzXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vQ29uc3RydWN0b3JzIGFyZSBub3QgbmVlZGVkIGlmIGNyZWF0ZSBpcyBvdmVyd3JpdHRlblxuICAgICAgICByZXR1cm4gb0ZpbHRlcih0aGlzLmdldE9iamVjdFdpdGhNZXRob2RzKCksIGZpbHRlckZuLCB0aGlzLCB7XG4gICAgICAgICAgICBvd25Qcm9wZXJ0aWVzOiBmYWxzZSxcbiAgICAgICAgICAgIGtleXM6IHRydWVcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb21wb3NpdGlvbjsiXX0=
;