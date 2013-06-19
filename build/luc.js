;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
"use strict";

var Luc = {};
/**
 * @class Luc
 * Aliases for common Luc methods and packages.
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

Luc.apply(Luc, require('./is'));

var EventEmitter = require('./events/eventEmitter');

Luc.EventEmitter = EventEmitter;

var Base = require('./class/base');

Luc.Base = Base;

var Definer = require('./class/definer');

Luc.ClassDefiner = Definer;

Luc.define = Definer.define;

Luc.Plugin = require('./class/plugin');

Luc.apply(Luc, {
    compositionEnumns: require('./class/compositionEnumns')
});

if(typeof window !== 'undefined') {
    window.Luc = Luc;
}
},{"./object":2,"./function":3,"./events/eventEmitter":4,"./array":5,"./is":6,"./class/base":7,"./class/definer":8,"./class/plugin":9,"./class/compositionEnumns":10}],2:[function(require,module,exports){
/**
 * @class Luc.Object
 * Package for Object methods
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
 * @param  {Object|undefined} toObject Object to put the properties fromObject on.
 * @param  {Object|undefined} fromObject Object to put the properties on the toObject
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
 * @param  {Object|undefined} toObject Object to put the properties fromObject on.
 * @param  {Object|undefined} fromObject Object to put the properties on the toObject
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
    var context = {val:1};
    Luc.Object.each({
        key: 1
    }, function(key, value) {
        console.log(value + key + this.val)
    }, context)
    
    >1key1 
 
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
 * just the keys or values are return.
 *
 */
exports.filter = function(obj, filterFn, thisArg, config) {
    var values = [];

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
},{}],4:[function(require,module,exports){
/**
 * @license https://raw.github.com/joyent/node/v0.10.11/LICENSE
 * Node js licence. EventEmitter will be in the client
 * only code.
 */

var EventEmitter = require('events').EventEmitter;

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
},{"events":11}],5:[function(require,module,exports){
var arraySlice = Array.prototype.slice;

/**
 * @class Luc.Array
 * Package for Array methods.
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
 * Runs an array.forEach after calling Luc.Array.toArray on the item.
 * @param  {Object}   item
 * @param  {Function} fn        
 * @param  {Object}   context   
 */
function each(item, fn, context) {
    var arr = toArray(item);
    return arr.forEach.call(arr, fn, context);
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
   
    Luc.Array.insert([0,4], [1,2,3], 1);
    >[0, 1, 2, 3, 4]
    Luc.Array.insert([0,4], [1,2,3], true);
    >[0, 4, 1, 2, 3]
    Luc.Array.insert([0,4], [1,2,3], 0);
    >[1, 2, 3, 0, 4]
 
 * @return {Array}
 */
function insert(firstArrayOrArgs, secondArrayOrArgs, indexOrAppend) {
    var firstArray = arraySlice.call(firstArrayOrArgs),
        secondArray = arraySlice.call(secondArrayOrArgs),
        spliceArgs, 
        returnArray;

    if(indexOrAppend === true) {
        returnArray = firstArray.concat(secondArray);
    }
    else {
        spliceArgs = [indexOrAppend, 0].concat(secondArray);
        firstArray.splice.apply(firstArray, spliceArgs);

        return firstArray;
    }

    return returnArray;
}

exports.toArray = toArray;
exports.each = each;
exports.insert = insert;
},{}],6:[function(require,module,exports){
var oToString = Object.prototype.toString;

sdf = 2;
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
},{}],12:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
(function(process){if (!process.EventEmitter) process.EventEmitter = function () {};

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

})(require("__browserify_process"))
},{"__browserify_process":12}],3:[function(require,module,exports){
var is = require('./is'),
    aInsert = require('./array').insert;
    aEach = require('./array').each;

/**
 * @class Luc.Function
 * Package for function methods.
 */

function augmentArgs(config, callArgs) {
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
 * Agument the passed in function's thisArg and or aguments object 
 * based on the passed in config.
 * 
 * @param  {Function} fn the function to call
 * @param  {Object} config
 * 
 * @param {Object} [config.thisArg] the thisArg for the funciton being executed.
 * If this is the only property on your config object the prefered way would
 * be just to use Function.bind
 * 
 * @param {Array} [config.args] the arguments used for the function being executed.
 * This will replace the functions call args if index is not a number or 
 * true.
 * 
 * @param {Number/True} [config.index] By defualt the the configured arguments
 * will be inserted into the functions passed in call arguments.  If index is true
 * append the args together if it is a number insert it at the passed in index.
 * 
 * @param {Array} [config.argumentsFirst] pass in false to 
 * agument the configured args first with Luc.Array.insert.  Defaults
 * to true
     
     function fn() {
        console.log(this)
        console.log(arguments)
    }

    Luc.Function.createAugmentor(fn, {
        thisArg: {configedThisArg: true},
        args: [1,2,3],
        index:0
    })(4)

    >Object {configedThisArg: true}
    >[1, 2, 3, 4]

    Luc.Function.createAugmentor(fn, {
        thisArg: {configedThisArg: true},
        args: [1,2,3],
        index:0,
        argumentsFirst:false
    })(4)

    >Object {configedThisArg: true}
    >[4, 1, 2, 3]


    var f = Luc.Function.createAugmentor(fn, {
        args: [1,2,3],
        index: true
    });

    f.apply({config: false}, [4])

    >Object {config: false}
    >[4, 1, 2, 3]

 * @return {Function} the augmented function.
 */
exports.createAugmentor = function(fn, config) {
    var thisArg = config.thisArg;

    return function() {
        return fn.apply(thisArg || this, augmentArgs(config, arguments));
    };
};

function initSequenceFunctions(fns, config) {
    var toRun = [];
    aEach(fns, function(f) {
        var fn = f;

        if (config) {
            fn = exports.createAugmentor(f, config);
        }

        toRun.push(fn);
    });

    return toRun;
}

/**
 * Return a function that runs the passed in functions
 * and returns the result of the last function called.
 * 
 * @param  {Function/Function[]} fns 
 * @param  {Object} [config] Config object
 * for Luc.Function.createAugmentor.  If defined all of the functions
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
    var functions = initSequenceFunctions(fns, config);

    return function() {
        var i = 0,
            len = functions.length;

        for(;i < len -1; ++i) {
            functions[i].apply(this, arguments);
        }

        return functions[len -1 ].apply(this, arguments);
    };
};

/**
 * Return a function that runs the passed in functions
 * if one of the functions results false the rest of the 
 * functions won't run and false will be returned.
 *
 * If no false is returned the value of the last function return will be returned
 * 
 * @param  {Function/Function[]} fns 
 * @param  {Object} [config] Config object
 * for Luc.Function.createAugmentor.  If defined all of the functions
 * will get created with the passed in config;

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
 * @return {Function}
 */
exports.createSequenceIf = function(fns, config) {
    var functions = initSequenceFunctions(fns, config);

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
 * @param  {Function/Function[]} fns 
 * @param  {Object} [config] Config object
 * for Luc.Function.createAugmentor.  If defined all of the functions
 * will get created with the passed in config;
     
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

 * @return {Function}
 */
exports.createRelayer = function(fns, config) {
    var functions = initSequenceFunctions(fns, config);

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
 * Create a throttled function that the passed in funciton
 * only gets evoked once even it is called many times
 *
 * 
 * @param  {Function} fn
 * @param  {Number} [millis] Number of milliseconds to
 * throttle the function.
 * @param  {Object} [config] Config object
 * for Luc.Function.createAugmentor.  If defined all of the functions
 * will get created with the passed in config;
 * 
 * @return {Function}
 */
exports.createThrotteled = function(f, millis, config) {
    var fn = config ? exports.createAugmentor(f, config) : f,
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
 * @param  {Number} [millis] Number of milliseconds to
 * defer
 * @param  {Object} [config] Config object
 * for Luc.Function.createAugmentor.  If defined all of the functions
 * will get created with the passed in config;
 * 
 * @return {Function}
 */
exports.createDeferred = function(f, millis, config) {
    var fn = config ? exports.createAugmentor(f, config) : f;

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
},{"./is":6,"./array":5}],7:[function(require,module,exports){
var emptyFn = require('../function').emptyFn,
    apply = require('../object').apply;

/**
 * @class Luc.Base
 * Simple class that by default applies the 
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
     * the class.
     */
    init: emptyFn
};

module.exports = Base;
},{"../function":3,"../object":2}],8:[function(require,module,exports){
var Base = require('./base'),
    Composition = require('./composition'),
    obj = require('../object'),
    arrayFns = require('../array'),
    emptyFn = require('../function').emptyFn,
    aEach = arrayFns.each,
    apply = obj.apply,
    oEach = obj.each,
    oFilter = obj.filter,
    mix = obj.mix,
    arraySlice = Array.prototype.slice;

function ClassDefiner() {}

ClassDefiner.COMPOSITIONS_NAME = '$compositions';

ClassDefiner.prototype = {
    defaultType: Base,

    processorKeys: {
        $mixins: '_applyMixins',
        $statics: '_applyStatics',
        $compositions: '_compose',
        $super: true
    },

    define: function(opts) {
        var options = opts || {},
            //if super is a falsy value besides undefined that means no superclass
            Super = options.$super || (options.$super === undefined ? this.defaultType : false),
            Constructor;

        options.$super = Super;

        Constructor = this._createConstructor(options);

        this._processAfterCreate(Constructor, options);

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
            Constructor = this._createConstructorWithModifiyingOptions(options);
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

    _createConstructorWithModifiyingOptions: function(options) {
        var superclass = options.$super,
            me = this,
            initBeforeSuperclass,
            initAfterSuperclass,
            init;

        if (!superclass) {
            init = this._createInitClassOptionsFn(options, {
                all: true
            });

            return function() {
                var args = arraySlice.call(arguments);
                init.call(this, options, args);
            };
        }

        initBeforeSuperclass = this._createInitClassOptionsFn(options, {
            before: true
        });

        initAfterSuperclass = this._createInitClassOptionsFn(options, {
            before: false
        });

        return function() {
            var args = arraySlice.call(arguments);

            initBeforeSuperclass.call(this, options, args);
            superclass.apply(this, arguments);
            initAfterSuperclass.call(this, options, args);
        };
    },

    _createInitClassOptionsFn: function(options, config) {
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

    /**
     * @private
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

    _hasConstructorModifyingOptions: function(options) {
        return options.$compositions;
    },

    _getProcessorKey: function(key) {
        return this.processorKeys[key];
    },

    _processAfterCreate: function($class, options) {
        this._applyValuesToProto($class, options);
        this._handlePostProcessors($class, options);
    },

    _applyValuesToProto: function($class, options) {
        var proto = $class.prototype,
            Super = options.$super,
            values = apply({
                $superclass: Super.prototype,
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

    _handlePostProcessors: function($class, options) {
        oEach(options, function(key, value) {
            var method = this._getProcessorKey(key);

            if (typeof this[method] === 'function') {
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
        apply($class, statics);
    },

    _compose: function($class, compositions) {
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

            prototype.getComposition = this.__getComposition;

        }, this);
    },

    /**
     * @private
     * Getter for composition instance that gets put on
     * the defined class.
     * @param  {String} key
     */
    __getComposition: function(key) {
        return this[ClassDefiner.COMPOSITIONS_NAME][key];
    },

    _createComposerProtoFn: function(methodName, compositionName) {
        return function() {
            var comp = this[ClassDefiner.COMPOSITIONS_NAME][compositionName];
            return comp[methodName].apply(comp, arguments);
        };
    }
};

var Definer = new ClassDefiner();
//make Luc.define happy
Definer.define = Definer.define.bind(Definer);

module.exports = Definer;
},{"./base":7,"./composition":13,"../object":2,"../array":5,"../function":3}],9:[function(require,module,exports){
var aEach = require('../array').each,
    obj = require('../object'),
    emptyFn = require('../function').emptyFn,
    apply = obj.apply;


function Plugin(config) {
    apply(this, config);
}

Plugin.prototype = {
    init: emptyFn,
    destroy: emptyFn
};

module.exports = Plugin;

},{"../array":5,"../object":2,"../function":3}],10:[function(require,module,exports){
var EventEmitter = require('../events/eventEmitter'),
    PluginManager = require('./pluginManager');

module.exports.EventEmitter = {
    Constructor: EventEmitter,
    name: 'emitter',
    filterKeys: 'allMethods'
};



module.exports.PluginManager = {
    name: 'plugins',
    initAfter: true,
    Constructor: PluginManager,
    create: function() {
        var manager = new this.Constructor();
        manager.init({
            instance: this.instance,
            instanceArgs: this.instanceArgs
        });

        return manager;
    },
    filterKeys: ['destroyPlugins']
};
},{"./pluginManager":14,"../events/eventEmitter":4}],13:[function(require,module,exports){
var obj = require('../object'),
    apply = obj.apply,
    mix = obj.mix,
    oFilter = obj.filter,
    emptyFn = ('../function').emptyFn,
    is = require('../is');

/**
 * @class  Luc.Composition
 * @protected
 * class that wraps $composition config objects
 * to conform to an api. The config object
 * will override any protected methods and default configs.
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
     * @cfg {String} name (required) the name
     */
    
    /**
     * @cfg {Function} Constructor (required) the Constructor
     * to use when creating the composition instance.  This
     * is required if Luc.Composition.create is not overrwitten by
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
        var Constructor = this.Constructor;
        return new Constructor();
    },

    getInstance: function() {
        return this.create();
    },

    validate: function() {
        if(this.name  === undefined) {
            throw new Error('A name must be defined');
        }
        if(!is.isFunction(this.Constructor) && this.create === Composition.prototype.create) {
            throw new Error('The Constructor must be function if create is not overriden');
        }
    },

    /**
     * @property filterFns
     * @type {Object}
     * @property filterFns.allMethods return all methods from the
     * constructors prototype
     * @type {Function}
     */
    filterFns: {
        allMethods: function(key, value) {
            return is.isFunction(value);
        }
    },

    /**
     * @cfg {Function/String/Array[]} filterKeys
     * The keys to add to the definers prototype that will in turn call
     * the compositions method.
     * 
     * Defaults to Luc.emptyFn. 
     * If an array is passed it will just use that Array.
     * 
     * If a string is passed and matches a method from 
     * Luc.Composition.filterFns it will call that instead.
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
            filterKeys: function(key, value) {
                return key === 'emit';
            },
            name: 'emitter'
        }
     * this is also a valid config
     * 
        $compositions: {
            Constructor: Luc.EventEmitter,
            filterKeys: ['emitter'],
            name: 'emitter'
        }
     * 
     */
    filterKeys: emptyFn,

    getMethodsToCompose: function() {
        var filterKeys = this.filterKeys,
            pairsToAdd,
            filterFn;


        if (is.isArray(filterKeys)) {
            pairsToAdd = filterKeys;
        } else {
            filterFn = filterKeys;

            if (is.isString(filterKeys)) {
                filterFn = this.filterFns[filterKeys];
            }

            //Constructors are not needed if create is overwritten
            pairsToAdd = oFilter(this.Constructor && this.Constructor.prototype, filterFn, this, {
                ownProperties: false,
                keys: true
            });
        }

        return pairsToAdd;
    }
};

module.exports = Composition;
},{"../is":6,"../object":2}],14:[function(require,module,exports){
var Plugin = require('./plugin'),
    is = require('../is'),
    obj = require('../object'),
    arr = require('../array'),
    aEach = arr.each,
    mix = obj.mix,
    apply = obj.apply;

function PluginManager() {}

PluginManager.prototype = {
    defaultPlugin: Plugin,

    init: function(instanceValues) {
        apply(this, instanceValues);
        this.createPlugins();
    },

    createPlugins: function() {
        var config = this.instanceArgs[0];

        this.plugins = [];

        aEach(config.plugins, function(pluginConfig) {
            pluginConfig.owner = this.instance;
            var pluginInstance = this.createPlugin(pluginConfig);

            this.initPlugin(pluginInstance);

            this.plugins.push(pluginInstance);
        }, this);
    },

    createPlugin: function(config) {

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

        //if Constructor property is not on
        //the config just use the default Plugin
        return new this.defaultPlugin(config);
    },

    initPlugin: function(plugin) {
        if (is.isFunction(plugin.init)) {
            plugin.init(this.instance);
        }
    },

    destroyPlugins: function() {
        this.plugins.forEach(function(plugin) {
            if (is.isFunction(plugin.destroy)) {
                plugin.destroy(this.instance);
            }
        });
    }
};

module.exports = PluginManager;
},{"./plugin":9,"../is":6,"../object":2,"../array":5}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvbHVjLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL29iamVjdC5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9ldmVudHMvZXZlbnRFbWl0dGVyLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2FycmF5LmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2lzLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2luc2VydC1tb2R1bGUtZ2xvYmFscy9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItYnVpbHRpbnMvYnVpbHRpbi9ldmVudHMuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvZnVuY3Rpb24uanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvY2xhc3MvYmFzZS5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9jbGFzcy9kZWZpbmVyLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2NsYXNzL3BsdWdpbi5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9jbGFzcy9jb21wb3NpdGlvbkVudW1ucy5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9jbGFzcy9jb21wb3NpdGlvbi5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9jbGFzcy9wbHVnaW5NYW5hZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdk1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25RQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG52YXIgTHVjID0ge307XG4vKipcbiAqIEBjbGFzcyBMdWNcbiAqIEFsaWFzZXMgZm9yIGNvbW1vbiBMdWMgbWV0aG9kcyBhbmQgcGFja2FnZXMuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gTHVjO1xuXG52YXIgb2JqZWN0ID0gcmVxdWlyZSgnLi9vYmplY3QnKTtcbkx1Yy5PYmplY3QgPSBvYmplY3Q7XG4vKipcbiAqIEBtZW1iZXIgTHVjXG4gKiBAcHJvcGVydHkgTyBMdWMuT1xuICogQWxpYXMgZm9yIEx1Yy5PYmplY3RcbiAqL1xuTHVjLk8gPSBvYmplY3Q7XG5cblxuLyoqXG4gKiBAbWVtYmVyIEx1Y1xuICogQG1ldGhvZCBhcHBseVxuICogQGluaGVyaXRkb2MgTHVjLk9iamVjdCNhcHBseVxuICovXG5MdWMuYXBwbHkgPSBMdWMuT2JqZWN0LmFwcGx5O1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjXG4gKiBAbWV0aG9kIG1peFxuICogQGluaGVyaXRkb2MgTHVjLk9iamVjdCNtaXhcbiAqL1xuTHVjLm1peCA9IEx1Yy5PYmplY3QubWl4O1xuXG5cbnZhciBmdW4gPSByZXF1aXJlKCcuL2Z1bmN0aW9uJyk7XG5MdWMuRnVuY3Rpb24gPSBmdW47XG5cbi8qKlxuICogQG1lbWJlciBMdWNcbiAqIEBwcm9wZXJ0eSBGIEx1Yy5GXG4gKiBBbGlhcyBmb3IgTHVjLkZ1bmN0aW9uXG4gKi9cbkx1Yy5GID0gZnVuO1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjXG4gKiBAbWV0aG9kIGVtcHR5Rm5cbiAqIEBpbmhlcml0ZG9jIEx1Yy5GdW5jdGlvbiNlbXB0eUZuXG4gKi9cbkx1Yy5lbXB0eUZuID0gTHVjLkZ1bmN0aW9uLmVtcHR5Rm47XG5cbi8qKlxuICogQG1lbWJlciBMdWNcbiAqIEBtZXRob2QgYWJzdHJhY3RGblxuICogQGluaGVyaXRkb2MgTHVjLkZ1bmN0aW9uI2Fic3RyYWN0Rm5cbiAqL1xuTHVjLmFic3RyYWN0Rm4gPSBMdWMuRnVuY3Rpb24uYWJzdHJhY3RGbjtcblxudmFyIGFycmF5ID0gcmVxdWlyZSgnLi9hcnJheScpO1xuTHVjLkFycmF5ID0gYXJyYXk7XG5cbi8qKlxuICogQG1lbWJlciBMdWNcbiAqIEBwcm9wZXJ0eSBBIEx1Yy5BXG4gKiBBbGlhcyBmb3IgTHVjLkFycmF5XG4gKi9cbkx1Yy5BID0gYXJyYXk7XG5cbkx1Yy5hcHBseShMdWMsIHJlcXVpcmUoJy4vaXMnKSk7XG5cbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCcuL2V2ZW50cy9ldmVudEVtaXR0ZXInKTtcblxuTHVjLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxudmFyIEJhc2UgPSByZXF1aXJlKCcuL2NsYXNzL2Jhc2UnKTtcblxuTHVjLkJhc2UgPSBCYXNlO1xuXG52YXIgRGVmaW5lciA9IHJlcXVpcmUoJy4vY2xhc3MvZGVmaW5lcicpO1xuXG5MdWMuQ2xhc3NEZWZpbmVyID0gRGVmaW5lcjtcblxuTHVjLmRlZmluZSA9IERlZmluZXIuZGVmaW5lO1xuXG5MdWMuUGx1Z2luID0gcmVxdWlyZSgnLi9jbGFzcy9wbHVnaW4nKTtcblxuTHVjLmFwcGx5KEx1Yywge1xuICAgIGNvbXBvc2l0aW9uRW51bW5zOiByZXF1aXJlKCcuL2NsYXNzL2NvbXBvc2l0aW9uRW51bW5zJylcbn0pO1xuXG5pZih0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgIHdpbmRvdy5MdWMgPSBMdWM7XG59IiwiLyoqXG4gKiBAY2xhc3MgTHVjLk9iamVjdFxuICogUGFja2FnZSBmb3IgT2JqZWN0IG1ldGhvZHNcbiAqL1xuXG4vKipcbiAqIEFwcGx5IHRoZSBwcm9wZXJ0aWVzIGZyb20gZnJvbU9iamVjdCB0byB0aGUgdG9PYmplY3QuICBmcm9tT2JqZWN0IHdpbGxcbiAqIG92ZXJ3cml0ZSBhbnkgc2hhcmVkIGtleXMuICBJdCBjYW4gYWxzbyBiZSB1c2VkIGFzIGEgc2ltcGxlIHNoYWxsb3cgY2xvbmUuXG4gKiBcbiAgICB2YXIgdG8gPSB7YToxLCBjOjF9LCBmcm9tID0ge2E6MiwgYjoyfVxuICAgIEx1Yy5PYmplY3QuYXBwbHkodG8sIGZyb20pXG4gICAgPk9iamVjdCB7YTogMiwgYzogMSwgYjogMn1cbiAgICB0byA9PT0gdG9cbiAgICA+dHJ1ZVxuICAgIHZhciBjbG9uZSA9IEx1Yy5PYmplY3QuYXBwbHkoe30sIGZyb20pXG4gICAgPnVuZGVmaW5lZFxuICAgIGNsb25lXG4gICAgPk9iamVjdCB7YTogMiwgYjogMn1cbiAgICBjbG9uZSA9PT0gZnJvbVxuICAgID5mYWxzZVxuICpcbiAqIEBwYXJhbSAge09iamVjdHx1bmRlZmluZWR9IHRvT2JqZWN0IE9iamVjdCB0byBwdXQgdGhlIHByb3BlcnRpZXMgZnJvbU9iamVjdCBvbi5cbiAqIEBwYXJhbSAge09iamVjdHx1bmRlZmluZWR9IGZyb21PYmplY3QgT2JqZWN0IHRvIHB1dCB0aGUgcHJvcGVydGllcyBvbiB0aGUgdG9PYmplY3RcbiAqIEByZXR1cm4ge09iamVjdH0gdGhlIHRvT2JqZWN0XG4gKi9cbmV4cG9ydHMuYXBwbHkgPSBmdW5jdGlvbih0b09iamVjdCwgZnJvbU9iamVjdCkge1xuICAgIHZhciB0byA9IHRvT2JqZWN0IHx8IHt9LFxuICAgICAgICBmcm9tID0gZnJvbU9iamVjdCB8fCB7fSxcbiAgICAgICAgcHJvcDtcblxuICAgIGZvciAocHJvcCBpbiBmcm9tKSB7XG4gICAgICAgIGlmIChmcm9tLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgICAgICB0b1twcm9wXSA9IGZyb21bcHJvcF07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdG87XG59O1xuXG4vKipcbiAqIFNpbWlsYXIgdG8gTHVjLk9iamVjdC5hcHBseSBleGNlcHQgdGhhdCB0aGUgZnJvbU9iamVjdCB3aWxsIFxuICogTk9UIG92ZXJ3cml0ZSB0aGUga2V5cyBvZiB0aGUgdG9PYmplY3QgaWYgdGhleSBhcmUgZGVmaW5lZC5cbiAqIFxuICogQHBhcmFtICB7T2JqZWN0fHVuZGVmaW5lZH0gdG9PYmplY3QgT2JqZWN0IHRvIHB1dCB0aGUgcHJvcGVydGllcyBmcm9tT2JqZWN0IG9uLlxuICogQHBhcmFtICB7T2JqZWN0fHVuZGVmaW5lZH0gZnJvbU9iamVjdCBPYmplY3QgdG8gcHV0IHRoZSBwcm9wZXJ0aWVzIG9uIHRoZSB0b09iamVjdFxuICogQHJldHVybiB7T2JqZWN0fSB0aGUgdG9PYmplY3RcbiAqL1xuZXhwb3J0cy5taXggPSBmdW5jdGlvbih0b09iamVjdCwgZnJvbU9iamVjdCkge1xuICAgIHZhciB0byA9IHRvT2JqZWN0IHx8IHt9LFxuICAgICAgICBmcm9tID0gZnJvbU9iamVjdCB8fCB7fSxcbiAgICAgICAgcHJvcDtcblxuICAgIGZvciAocHJvcCBpbiBmcm9tKSB7XG4gICAgICAgIGlmIChmcm9tLmhhc093blByb3BlcnR5KHByb3ApICYmIHRvW3Byb3BdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRvW3Byb3BdID0gZnJvbVtwcm9wXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0bztcbn07XG5cbi8qKlxuICogSXRlcmF0ZSBvdmVyIGFuIG9iamVjdHMgcHJvcGVydGllc1xuICogYXMga2V5IHZhbHVlIFwicGFpcnNcIiB3aXRoIHRoZSBwYXNzZWQgaW4gZnVuY3Rpb24uXG4gKiBcbiAgICB2YXIgY29udGV4dCA9IHt2YWw6MX07XG4gICAgTHVjLk9iamVjdC5lYWNoKHtcbiAgICAgICAga2V5OiAxXG4gICAgfSwgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICBjb25zb2xlLmxvZyh2YWx1ZSArIGtleSArIHRoaXMudmFsKVxuICAgIH0sIGNvbnRleHQpXG4gICAgXG4gICAgPjFrZXkxIFxuIFxuICogQHBhcmFtICB7T2JqZWN0fSAgIG9iaiAgdGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXJcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmbiAgIHRoZSBmdW5jdGlvbiB0byBjYWxsXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGZuLmtleSAgIHRoZSBvYmplY3Qga2V5XG4gKiBAcGFyYW0gIHtPYmplY3R9IGZuLnZhbHVlICAgdGhlIG9iamVjdCB2YWx1ZVxuICogQHBhcmFtICB7T2JqZWN0fSAgIFt0aGlzQXJnXSBcbiAqIEBwYXJhbSB7T2JqZWN0fSAgW2NvbmZpZ11cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gIGNvbmZpZy5vd25Qcm9wZXJ0aWVzIHNldCB0byBmYWxzZVxuICogdG8gaXRlcmF0ZSBvdmVyIGFsbCBvZiB0aGUgb2JqZWN0cyBlbnVtZXJhYmxlIHByb3BlcnRpZXMuXG4gKi9cbmV4cG9ydHMuZWFjaCA9IGZ1bmN0aW9uKG9iaiwgZm4sIHRoaXNBcmcsIGNvbmZpZykge1xuICAgIHZhciBrZXksIHZhbHVlLFxuICAgICAgICBhbGxQcm9wZXJ0aWVzID0gY29uZmlnICYmIGNvbmZpZy5vd25Qcm9wZXJ0aWVzID09PSBmYWxzZTtcblxuICAgIGlmIChhbGxQcm9wZXJ0aWVzKSB7XG4gICAgICAgIGZvciAoa2V5IGluIG9iaikge1xuICAgICAgICAgICAgZm4uY2FsbCh0aGlzQXJnLCBrZXksIG9ialtrZXldKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAoa2V5IGluIG9iaikge1xuICAgICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgZm4uY2FsbCh0aGlzQXJnLCBrZXksIG9ialtrZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8qKlxuICogVGFrZSBhbiBhcnJheSBvZiBzdHJpbmdzIGFuZCBhbiBhcnJheS9hcmd1bWVudHMgb2ZcbiAqIHZhbHVlcyBhbmQgcmV0dXJuIGFuIG9iamVjdCBvZiBrZXkgdmFsdWUgcGFpcnNcbiAqIGJhc2VkIG9mZiBlYWNoIGFycmF5cyBpbmRleC4gIEl0IGlzIHVzZWZ1bCBmb3IgdGFraW5nXG4gKiBhIGxvbmcgbGlzdCBvZiBhcmd1bWVudHMgYW5kIGNyZWF0aW5nIGFuIG9iamVjdCB0aGF0IGNhblxuICogYmUgcGFzc2VkIHRvIG90aGVyIG1ldGhvZHMuXG4gKiBcbiAgICBmdW5jdGlvbiBsb25nQXJncyhhLGIsYyxkLGUsZikge1xuICAgICAgICByZXR1cm4gTHVjLk9iamVjdC50b09iamVjdChbJ2EnLCdiJywgJ2MnLCAnZCcsICdlJywgJ2YnXSwgYXJndW1lbnRzKVxuICAgIH1cblxuICAgIGxvbmdBcmdzKDEsMiwzLDQsNSw2LDcsOCw5KVxuXG4gICAgPk9iamVjdCB7YTogMSwgYjogMiwgYzogMywgZDogNCwgZTogNeKApn1cbiAgICBhOiAxXG4gICAgYjogMlxuICAgIGM6IDNcbiAgICBkOiA0XG4gICAgZTogNVxuICAgIGY6IDZcblxuICAgIGxvbmdBcmdzKDEsMiwzKVxuXG4gICAgPk9iamVjdCB7YTogMSwgYjogMiwgYzogMywgZDogdW5kZWZpbmVkLCBlOiB1bmRlZmluZWTigKZ9XG4gICAgYTogMVxuICAgIGI6IDJcbiAgICBjOiAzXG4gICAgZDogdW5kZWZpbmVkXG4gICAgZTogdW5kZWZpbmVkXG4gICAgZjogdW5kZWZpbmVkXG5cbiAqIEBwYXJhbSAge1N0cmluZ1tdfSBzdHJpbmdzXG4gKiBAcGFyYW0gIHtBcnJheS9hcmd1bWVudHN9IHZhbHVlc1xuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5leHBvcnRzLnRvT2JqZWN0ID0gZnVuY3Rpb24oc3RyaW5ncywgdmFsdWVzKSB7XG4gICAgdmFyIG9iaiA9IHt9LFxuICAgICAgICBpID0gMCxcbiAgICAgICAgbGVuID0gc3RyaW5ncy5sZW5ndGg7XG4gICAgZm9yICg7IGkgPCBsZW47ICsraSkge1xuICAgICAgICBvYmpbc3RyaW5nc1tpXV0gPSB2YWx1ZXNbaV07XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iajtcbn07XG5cbi8qKlxuICogUmV0dXJuIGtleSB2YWx1ZSBwYWlycyBmcm9tIHRoZSBvYmplY3QgaWYgdGhlXG4gKiBmaWx0ZXJGbiByZXR1cm5zIGEgdHJ1dGh5IHZhbHVlLlxuICpcbiAgICBMdWMuT2JqZWN0LmZpbHRlcih7XG4gICAgICAgIGE6IGZhbHNlLFxuICAgICAgICBiOiB0cnVlLFxuICAgICAgICBjOiBmYWxzZVxuICAgIH0sIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGtleSA9PT0gJ2EnIHx8IHZhbHVlXG4gICAgfSlcbiAgICA+W3trZXk6ICdhJywgdmFsdWU6IGZhbHNlfSwge2tleTogJ2InLCB2YWx1ZTogdHJ1ZX1dXG4gKiBcbiAqIEBwYXJhbSAge09iamVjdH0gICBvYmogIHRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gZmlsdGVyRm4gICB0aGUgZnVuY3Rpb24gdG8gY2FsbCwgcmV0dXJuIGEgdHJ1dGh5IHZhbHVlXG4gKiB0byBhZGQgdGhlIGtleSB2YWx1ZSBwYWlyXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGZpbHRlckZuLmtleSAgIHRoZSBvYmplY3Qga2V5XG4gKiBAcGFyYW0gIHtPYmplY3R9IGZpbHRlckZuLnZhbHVlICAgdGhlIG9iamVjdCB2YWx1ZVxuICogQHBhcmFtICB7T2JqZWN0fSAgIFt0aGlzQXJnXSBcbiAqIEBwYXJhbSB7T2JqZWN0fSAgW2NvbmZpZ11cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gIGNvbmZpZy5vd25Qcm9wZXJ0aWVzIHNldCB0byBmYWxzZVxuICogdG8gaXRlcmF0ZSBvdmVyIGFsbCBvZiB0aGUgb2JqZWN0cyBlbnVtZXJhYmxlIHByb3BlcnRpZXMuXG4gKiBcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gIGNvbmZpZy5rZXlzIHNldCB0byB0cnVlIHRvIHJldHVyblxuICoganVzdCB0aGUga2V5cy5cbiAqXG4gKiBAcGFyYW0ge0Jvb2xlYW59ICBjb25maWcudmFsdWVzIHNldCB0byB0cnVlIHRvIHJldHVyblxuICoganVzdCB0aGUgdmFsdWVzLlxuICogXG4gKiBAcmV0dXJuIHtPYmplY3RbXS9TdHJpbmdbXX0gQXJyYXkgb2Yga2V5IHZhbHVlIHBhaXJzIGluIHRoZSBmb3JtXG4gKiBvZiB7a2V5OiAna2V5JywgdmFsdWU6IHZhbHVlfS4gIElmIGtleXMgb3IgdmFsdWVzIGlzIHRydWUgb24gdGhlIGNvbmZpZ1xuICoganVzdCB0aGUga2V5cyBvciB2YWx1ZXMgYXJlIHJldHVybi5cbiAqXG4gKi9cbmV4cG9ydHMuZmlsdGVyID0gZnVuY3Rpb24ob2JqLCBmaWx0ZXJGbiwgdGhpc0FyZywgY29uZmlnKSB7XG4gICAgdmFyIHZhbHVlcyA9IFtdO1xuXG4gICAgZXhwb3J0cy5lYWNoKG9iaiwgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICBpZiAoZmlsdGVyRm4uY2FsbCh0aGlzQXJnLCBrZXksIHZhbHVlKSkge1xuICAgICAgICAgICAgaWYgKGNvbmZpZy5rZXlzID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgdmFsdWVzLnB1c2goa2V5KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29uZmlnLnZhbHVlcyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHZhbHVlcy5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFsdWVzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIGtleToga2V5XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCB0aGlzQXJnLCBjb25maWcpO1xuXG4gICAgcmV0dXJuIHZhbHVlcztcbn07IiwiLyoqXG4gKiBAbGljZW5zZSBodHRwczovL3Jhdy5naXRodWIuY29tL2pveWVudC9ub2RlL3YwLjEwLjExL0xJQ0VOU0VcbiAqIE5vZGUganMgbGljZW5jZS4gRXZlbnRFbWl0dGVyIHdpbGwgYmUgaW4gdGhlIGNsaWVudFxuICogb25seSBjb2RlLlxuICovXG5cbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG5cbi8qKlxuICogQGNsYXNzIEx1Yy5FdmVudEVtaXR0ZXJcbiAqIFRoZSB3b25kZXJmdWwgZXZlbnQgZW1taXRlciB0aGF0IGNvbWVzIHdpdGggbm9kZSxcbiAqIHRoYXQgd29ya3MgaW4gdGhlIHN1cHBvcnRlZCBicm93c2Vycy5cbiAqIFtodHRwOi8vbm9kZWpzLm9yZy9hcGkvZXZlbnRzLmh0bWxdKGh0dHA6Ly9ub2RlanMub3JnL2FwaS9ldmVudHMuaHRtbClcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgICAvL3B1dCBpbiBmaXggZm9yIElFIDkgYW5kIGJlbG93XG4gICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICBnID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzZWxmLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuICAgICAgICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcblxuICAgIHNlbGYub24odHlwZSwgZyk7XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyOyIsInZhciBhcnJheVNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG4vKipcbiAqIEBjbGFzcyBMdWMuQXJyYXlcbiAqIFBhY2thZ2UgZm9yIEFycmF5IG1ldGhvZHMuXG4gKi9cblxuLyoqXG4gKiBUdXJuIHRoZSBwYXNzZWQgaW4gaXRlbSBpbnRvIGFuIGFycmF5IGlmIGl0XG4gKiBpc24ndCBvbmUgYWxyZWFkeSwgaWYgdGhlIGl0ZW0gaXMgYW4gYXJyYXkganVzdCByZXR1cm4gaXQuICBcbiAqIEl0IHJldHVybnMgYW4gZW1wdHkgYXJyYXkgaWYgaXRlbSBpcyBudWxsIG9yIHVuZGVmaW5lZC5cbiAqIElmIGl0IGlzIGp1c3QgYSBzaW5nbGUgaXRlbSByZXR1cm4gYW4gYXJyYXkgY29udGFpbmluZyB0aGUgaXRlbS5cbiAqIFxuICAgIEx1Yy5BcnJheS50b0FycmF5KClcbiAgICA+W11cbiAgICBMdWMuQXJyYXkudG9BcnJheShudWxsKVxuICAgID5bXVxuICAgIEx1Yy5BcnJheS50b0FycmF5KDEpXG4gICAgPlsxXVxuICAgIEx1Yy5BcnJheS50b0FycmF5KFsxLDJdKVxuICAgID5bMSwgMl1cbiAqXG4gKiBAcGFyYW0gIHtPYmplY3R9IGl0ZW0gaXRlbSB0byB0dXJuIGludG8gYW4gYXJyYXkuXG4gKiBAcmV0dXJuIHRoZSBhcnJheVxuICovXG5mdW5jdGlvbiB0b0FycmF5KGl0ZW0pIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShpdGVtKSkge1xuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICB9XG4gICAgcmV0dXJuIChpdGVtID09PSBudWxsIHx8IGl0ZW0gPT09IHVuZGVmaW5lZCkgPyBbXSA6IFtpdGVtXTtcbn1cblxuLyoqXG4gKiBSdW5zIGFuIGFycmF5LmZvckVhY2ggYWZ0ZXIgY2FsbGluZyBMdWMuQXJyYXkudG9BcnJheSBvbiB0aGUgaXRlbS5cbiAqIEBwYXJhbSAge09iamVjdH0gICBpdGVtXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gZm4gICAgICAgIFxuICogQHBhcmFtICB7T2JqZWN0fSAgIGNvbnRleHQgICBcbiAqL1xuZnVuY3Rpb24gZWFjaChpdGVtLCBmbiwgY29udGV4dCkge1xuICAgIHZhciBhcnIgPSB0b0FycmF5KGl0ZW0pO1xuICAgIHJldHVybiBhcnIuZm9yRWFjaC5jYWxsKGFyciwgZm4sIGNvbnRleHQpO1xufVxuXG4vKipcbiAqIEluc2VydCBvciBhcHBlbmQgdGhlIHNlY29uZCBhcnJheS9hcmd1bWVudHMgaW50byB0aGVcbiAqIGZpcnN0IGFycmF5L2FyZ3VtZW50cy4gIFRoaXMgbWV0aG9kIGRvZXMgbm90IGFsdGVyXG4gKiB0aGUgcGFzc2VkIGluIGFycmF5L2FyZ3VtZW50cy5cbiAqIFxuICogQHBhcmFtICB7QXJyYXkvYXJndW1lbnRzfSBmaXJzdEFycmF5T3JBcmdzXG4gKiBAcGFyYW0gIHtBcnJheS9hcmd1bWVudHN9IHNlY29uZEFycmF5T3JBcmdzXG4gKiBAcGFyYW0gIHtOdW1iZXIvdHJ1ZX0gaW5kZXhPckFwcGVuZCB0cnVlIHRvIGFwcGVuZCBcbiAqIHRoZSBzZWNvbmQgYXJyYXkgdG8gdGhlIGVuZCBvZiB0aGUgZmlyc3Qgb25lLiAgSWYgaXQgaXMgYSBudW1iZXJcbiAqIGluc2VydCB0aGUgc2Vjb25kQXJyYXkgaW50byB0aGUgZmlyc3Qgb25lIGF0IHRoZSBwYXNzZWQgaW4gaW5kZXguXG4gICBcbiAgICBMdWMuQXJyYXkuaW5zZXJ0KFswLDRdLCBbMSwyLDNdLCAxKTtcbiAgICA+WzAsIDEsIDIsIDMsIDRdXG4gICAgTHVjLkFycmF5Lmluc2VydChbMCw0XSwgWzEsMiwzXSwgdHJ1ZSk7XG4gICAgPlswLCA0LCAxLCAyLCAzXVxuICAgIEx1Yy5BcnJheS5pbnNlcnQoWzAsNF0sIFsxLDIsM10sIDApO1xuICAgID5bMSwgMiwgMywgMCwgNF1cbiBcbiAqIEByZXR1cm4ge0FycmF5fVxuICovXG5mdW5jdGlvbiBpbnNlcnQoZmlyc3RBcnJheU9yQXJncywgc2Vjb25kQXJyYXlPckFyZ3MsIGluZGV4T3JBcHBlbmQpIHtcbiAgICB2YXIgZmlyc3RBcnJheSA9IGFycmF5U2xpY2UuY2FsbChmaXJzdEFycmF5T3JBcmdzKSxcbiAgICAgICAgc2Vjb25kQXJyYXkgPSBhcnJheVNsaWNlLmNhbGwoc2Vjb25kQXJyYXlPckFyZ3MpLFxuICAgICAgICBzcGxpY2VBcmdzLCBcbiAgICAgICAgcmV0dXJuQXJyYXk7XG5cbiAgICBpZihpbmRleE9yQXBwZW5kID09PSB0cnVlKSB7XG4gICAgICAgIHJldHVybkFycmF5ID0gZmlyc3RBcnJheS5jb25jYXQoc2Vjb25kQXJyYXkpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgc3BsaWNlQXJncyA9IFtpbmRleE9yQXBwZW5kLCAwXS5jb25jYXQoc2Vjb25kQXJyYXkpO1xuICAgICAgICBmaXJzdEFycmF5LnNwbGljZS5hcHBseShmaXJzdEFycmF5LCBzcGxpY2VBcmdzKTtcblxuICAgICAgICByZXR1cm4gZmlyc3RBcnJheTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0dXJuQXJyYXk7XG59XG5cbmV4cG9ydHMudG9BcnJheSA9IHRvQXJyYXk7XG5leHBvcnRzLmVhY2ggPSBlYWNoO1xuZXhwb3J0cy5pbnNlcnQgPSBpbnNlcnQ7IiwidmFyIG9Ub1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbnNkZiA9IDI7XG5mdW5jdGlvbiBpc0FycmF5KG9iaikge1xuICAgIHJldHVybiBBcnJheS5pc0FycmF5KG9iaik7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KG9iaikge1xuICAgIHJldHVybiBvVG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBPYmplY3RdJztcbn1cblxuZnVuY3Rpb24gaXNGdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb1RvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbn1cblxuZnVuY3Rpb24gaXNEYXRlKG9iaikge1xuICAgIHJldHVybiBvVG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBEYXRlXSc7XG59XG5cbmZ1bmN0aW9uIGlzUmVnRXhwKG9iaikge1xuICAgIHJldHVybiBvVG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBSZWdFeHBdJztcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIob2JqKSB7XG4gICAgcmV0dXJuIG9Ub1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IE51bWJlcl0nO1xufVxuXG5mdW5jdGlvbiBpc1N0cmluZyhvYmopIHtcbiAgICByZXR1cm4gb1RvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgU3RyaW5nXSc7XG59XG5cbmZ1bmN0aW9uIGlzRmFsc3kob2JqKSB7XG4gICAgcmV0dXJuICghb2JqICYmIG9iaiAhPT0gMCk7XG59XG5cbmZ1bmN0aW9uIGlzRW1wdHkob2JqKSB7XG4gICAgdmFyIGVtcHR5ID0gZmFsc2U7XG5cbiAgICBpZiAoaXNGYWxzeShvYmopKSB7XG4gICAgICAgIGVtcHR5ID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXkob2JqKSkge1xuICAgICAgICBlbXB0eSA9IG9iai5sZW5ndGggPT09IDA7XG4gICAgfSBlbHNlIGlmIChpc09iamVjdChvYmopKSB7XG4gICAgICAgIGVtcHR5ID0gT2JqZWN0LmtleXMob2JqKS5sZW5ndGggPT09IDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVtcHR5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBpc0FycmF5OiBpc0FycmF5LFxuICAgIGlzT2JqZWN0OiBpc09iamVjdCxcbiAgICBpc0Z1bmN0aW9uOiBpc0Z1bmN0aW9uLFxuICAgIGlzRGF0ZTogaXNEYXRlLFxuICAgIGlzU3RyaW5nOiBpc1N0cmluZyxcbiAgICBpc051bWJlcjogaXNOdW1iZXIsXG4gICAgaXNSZWdFeHA6IGlzUmVnRXhwLFxuICAgIGlzRmFsc3k6IGlzRmFsc3ksXG4gICAgaXNFbXB0eTogaXNFbXB0eVxufTsiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5wcm9jZXNzLm5leHRUaWNrID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2FuU2V0SW1tZWRpYXRlID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cuc2V0SW1tZWRpYXRlO1xuICAgIHZhciBjYW5Qb3N0ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cucG9zdE1lc3NhZ2UgJiYgd2luZG93LmFkZEV2ZW50TGlzdGVuZXJcbiAgICA7XG5cbiAgICBpZiAoY2FuU2V0SW1tZWRpYXRlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gd2luZG93LnNldEltbWVkaWF0ZShmKSB9O1xuICAgIH1cblxuICAgIGlmIChjYW5Qb3N0KSB7XG4gICAgICAgIHZhciBxdWV1ZSA9IFtdO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgaWYgKGV2LnNvdXJjZSA9PT0gd2luZG93ICYmIGV2LmRhdGEgPT09ICdwcm9jZXNzLXRpY2snKSB7XG4gICAgICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgaWYgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZuID0gcXVldWUuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRydWUpO1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICAgICAgcXVldWUucHVzaChmbik7XG4gICAgICAgICAgICB3aW5kb3cucG9zdE1lc3NhZ2UoJ3Byb2Nlc3MtdGljaycsICcqJyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZm4sIDApO1xuICAgIH07XG59KSgpO1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbiIsIihmdW5jdGlvbihwcm9jZXNzKXtpZiAoIXByb2Nlc3MuRXZlbnRFbWl0dGVyKSBwcm9jZXNzLkV2ZW50RW1pdHRlciA9IGZ1bmN0aW9uICgpIHt9O1xuXG52YXIgRXZlbnRFbWl0dGVyID0gZXhwb3J0cy5FdmVudEVtaXR0ZXIgPSBwcm9jZXNzLkV2ZW50RW1pdHRlcjtcbnZhciBpc0FycmF5ID0gdHlwZW9mIEFycmF5LmlzQXJyYXkgPT09ICdmdW5jdGlvbidcbiAgICA/IEFycmF5LmlzQXJyYXlcbiAgICA6IGZ1bmN0aW9uICh4cykge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHhzKSA9PT0gJ1tvYmplY3QgQXJyYXldJ1xuICAgIH1cbjtcbmZ1bmN0aW9uIGluZGV4T2YgKHhzLCB4KSB7XG4gICAgaWYgKHhzLmluZGV4T2YpIHJldHVybiB4cy5pbmRleE9mKHgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHggPT09IHhzW2ldKSByZXR1cm4gaTtcbiAgICB9XG4gICAgcmV0dXJuIC0xO1xufVxuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuXG4vLyAxMCBsaXN0ZW5lcnMgYXJlIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2hcbi8vIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuLy9cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG52YXIgZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghdGhpcy5fZXZlbnRzKSB0aGlzLl9ldmVudHMgPSB7fTtcbiAgdGhpcy5fZXZlbnRzLm1heExpc3RlbmVycyA9IG47XG59O1xuXG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzQXJyYXkodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpXG4gICAge1xuICAgICAgaWYgKGFyZ3VtZW50c1sxXSBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGFyZ3VtZW50c1sxXTsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVuY2F1Z2h0LCB1bnNwZWNpZmllZCAnZXJyb3InIGV2ZW50LlwiKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBpZiAoIXRoaXMuX2V2ZW50cykgcmV0dXJuIGZhbHNlO1xuICB2YXIgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgaWYgKCFoYW5kbGVyKSByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKHR5cGVvZiBoYW5kbGVyID09ICdmdW5jdGlvbicpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcblxuICB9IGVsc2UgaWYgKGlzQXJyYXkoaGFuZGxlcikpIHtcbiAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG5cbiAgICB2YXIgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gbGlzdGVuZXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcblxuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcblxuLy8gRXZlbnRFbWl0dGVyIGlzIGRlZmluZWQgaW4gc3JjL25vZGVfZXZlbnRzLmNjXG4vLyBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQoKSBpcyBhbHNvIGRlZmluZWQgdGhlcmUuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCdmdW5jdGlvbicgIT09IHR5cGVvZiBsaXN0ZW5lcikge1xuICAgIHRocm93IG5ldyBFcnJvcignYWRkTGlzdGVuZXIgb25seSB0YWtlcyBpbnN0YW5jZXMgb2YgRnVuY3Rpb24nKTtcbiAgfVxuXG4gIGlmICghdGhpcy5fZXZlbnRzKSB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09IFwibmV3TGlzdGVuZXJzXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyc1wiLlxuICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKSB7XG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIH0gZWxzZSBpZiAoaXNBcnJheSh0aGlzLl9ldmVudHNbdHlwZV0pKSB7XG5cbiAgICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICAgIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgICAgdmFyIG07XG4gICAgICBpZiAodGhpcy5fZXZlbnRzLm1heExpc3RlbmVycyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG0gPSB0aGlzLl9ldmVudHMubWF4TGlzdGVuZXJzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbSA9IGRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgICB9XG5cbiAgICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICtcbiAgICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoKTtcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIH0gZWxzZSB7XG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBzZWxmLm9uKHR5cGUsIGZ1bmN0aW9uIGcoKSB7XG4gICAgc2VsZi5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcbiAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9KTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIGxpc3RlbmVyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdyZW1vdmVMaXN0ZW5lciBvbmx5IHRha2VzIGluc3RhbmNlcyBvZiBGdW5jdGlvbicpO1xuICB9XG5cbiAgLy8gZG9lcyBub3QgdXNlIGxpc3RlbmVycygpLCBzbyBubyBzaWRlIGVmZmVjdCBvZiBjcmVhdGluZyBfZXZlbnRzW3R5cGVdXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pIHJldHVybiB0aGlzO1xuXG4gIHZhciBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0FycmF5KGxpc3QpKSB7XG4gICAgdmFyIGkgPSBpbmRleE9mKGxpc3QsIGxpc3RlbmVyKTtcbiAgICBpZiAoaSA8IDApIHJldHVybiB0aGlzO1xuICAgIGxpc3Quc3BsaWNlKGksIDEpO1xuICAgIGlmIChsaXN0Lmxlbmd0aCA9PSAwKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgfSBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0gPT09IGxpc3RlbmVyKSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBkb2VzIG5vdCB1c2UgbGlzdGVuZXJzKCksIHNvIG5vIHNpZGUgZWZmZWN0IG9mIGNyZWF0aW5nIF9ldmVudHNbdHlwZV1cbiAgaWYgKHR5cGUgJiYgdGhpcy5fZXZlbnRzICYmIHRoaXMuX2V2ZW50c1t0eXBlXSkgdGhpcy5fZXZlbnRzW3R5cGVdID0gbnVsbDtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgaWYgKCF0aGlzLl9ldmVudHMpIHRoaXMuX2V2ZW50cyA9IHt9O1xuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSkgdGhpcy5fZXZlbnRzW3R5cGVdID0gW107XG4gIGlmICghaXNBcnJheSh0aGlzLl9ldmVudHNbdHlwZV0pKSB7XG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gIH1cbiAgcmV0dXJuIHRoaXMuX2V2ZW50c1t0eXBlXTtcbn07XG5cbn0pKHJlcXVpcmUoXCJfX2Jyb3dzZXJpZnlfcHJvY2Vzc1wiKSkiLCJ2YXIgaXMgPSByZXF1aXJlKCcuL2lzJyksXG4gICAgYUluc2VydCA9IHJlcXVpcmUoJy4vYXJyYXknKS5pbnNlcnQ7XG4gICAgYUVhY2ggPSByZXF1aXJlKCcuL2FycmF5JykuZWFjaDtcblxuLyoqXG4gKiBAY2xhc3MgTHVjLkZ1bmN0aW9uXG4gKiBQYWNrYWdlIGZvciBmdW5jdGlvbiBtZXRob2RzLlxuICovXG5cbmZ1bmN0aW9uIGF1Z21lbnRBcmdzKGNvbmZpZywgY2FsbEFyZ3MpIHtcbiAgICB2YXIgY29uZmlnQXJncyA9IGNvbmZpZy5hcmdzLFxuICAgICAgICBpbmRleCA9IGNvbmZpZy5pbmRleCxcbiAgICAgICAgYXJnc0FycmF5O1xuXG4gICAgaWYgKCFjb25maWdBcmdzKSB7XG4gICAgICAgIHJldHVybiBjYWxsQXJncztcbiAgICB9XG5cbiAgICBpZihpbmRleCA9PT0gdHJ1ZSB8fCBpcy5pc051bWJlcihpbmRleCkpIHtcbiAgICAgICAgaWYoY29uZmlnLmFyZ3VtZW50c0ZpcnN0ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuIGFJbnNlcnQoY29uZmlnQXJncywgY2FsbEFyZ3MsIGluZGV4KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYUluc2VydChjYWxsQXJncywgY29uZmlnQXJncywgaW5kZXgpO1xuICAgIH1cblxuICAgIHJldHVybiBjb25maWdBcmdzO1xufVxuXG4vKipcbiAqIEEgcmV1c2FibGUgZW1wdHkgZnVuY3Rpb25cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5leHBvcnRzLmVtcHR5Rm4gPSBmdW5jdGlvbigpIHt9O1xuXG4vKipcbiAqIEEgZnVuY3Rpb24gdGhhdCB0aHJvd3MgYW4gZXJyb3Igd2hlbiBjYWxsZWQuXG4gKiBVc2VmdWwgd2hlbiBkZWZpbmluZyBhYnN0cmFjdCBsaWtlIGNsYXNzZXNcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5leHBvcnRzLmFic3RyYWN0Rm4gPSBmdW5jdGlvbigpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2Fic3RyYWN0Rm4gbXVzdCBiZSBpbXBsZW1lbnRlZCcpO1xufTtcblxuLyoqXG4gKiBBZ3VtZW50IHRoZSBwYXNzZWQgaW4gZnVuY3Rpb24ncyB0aGlzQXJnIGFuZCBvciBhZ3VtZW50cyBvYmplY3QgXG4gKiBiYXNlZCBvbiB0aGUgcGFzc2VkIGluIGNvbmZpZy5cbiAqIFxuICogQHBhcmFtICB7RnVuY3Rpb259IGZuIHRoZSBmdW5jdGlvbiB0byBjYWxsXG4gKiBAcGFyYW0gIHtPYmplY3R9IGNvbmZpZ1xuICogXG4gKiBAcGFyYW0ge09iamVjdH0gW2NvbmZpZy50aGlzQXJnXSB0aGUgdGhpc0FyZyBmb3IgdGhlIGZ1bmNpdG9uIGJlaW5nIGV4ZWN1dGVkLlxuICogSWYgdGhpcyBpcyB0aGUgb25seSBwcm9wZXJ0eSBvbiB5b3VyIGNvbmZpZyBvYmplY3QgdGhlIHByZWZlcmVkIHdheSB3b3VsZFxuICogYmUganVzdCB0byB1c2UgRnVuY3Rpb24uYmluZFxuICogXG4gKiBAcGFyYW0ge0FycmF5fSBbY29uZmlnLmFyZ3NdIHRoZSBhcmd1bWVudHMgdXNlZCBmb3IgdGhlIGZ1bmN0aW9uIGJlaW5nIGV4ZWN1dGVkLlxuICogVGhpcyB3aWxsIHJlcGxhY2UgdGhlIGZ1bmN0aW9ucyBjYWxsIGFyZ3MgaWYgaW5kZXggaXMgbm90IGEgbnVtYmVyIG9yIFxuICogdHJ1ZS5cbiAqIFxuICogQHBhcmFtIHtOdW1iZXIvVHJ1ZX0gW2NvbmZpZy5pbmRleF0gQnkgZGVmdWFsdCB0aGUgdGhlIGNvbmZpZ3VyZWQgYXJndW1lbnRzXG4gKiB3aWxsIGJlIGluc2VydGVkIGludG8gdGhlIGZ1bmN0aW9ucyBwYXNzZWQgaW4gY2FsbCBhcmd1bWVudHMuICBJZiBpbmRleCBpcyB0cnVlXG4gKiBhcHBlbmQgdGhlIGFyZ3MgdG9nZXRoZXIgaWYgaXQgaXMgYSBudW1iZXIgaW5zZXJ0IGl0IGF0IHRoZSBwYXNzZWQgaW4gaW5kZXguXG4gKiBcbiAqIEBwYXJhbSB7QXJyYXl9IFtjb25maWcuYXJndW1lbnRzRmlyc3RdIHBhc3MgaW4gZmFsc2UgdG8gXG4gKiBhZ3VtZW50IHRoZSBjb25maWd1cmVkIGFyZ3MgZmlyc3Qgd2l0aCBMdWMuQXJyYXkuaW5zZXJ0LiAgRGVmYXVsdHNcbiAqIHRvIHRydWVcbiAgICAgXG4gICAgIGZ1bmN0aW9uIGZuKCkge1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzKVxuICAgICAgICBjb25zb2xlLmxvZyhhcmd1bWVudHMpXG4gICAgfVxuXG4gICAgTHVjLkZ1bmN0aW9uLmNyZWF0ZUF1Z21lbnRvcihmbiwge1xuICAgICAgICB0aGlzQXJnOiB7Y29uZmlnZWRUaGlzQXJnOiB0cnVlfSxcbiAgICAgICAgYXJnczogWzEsMiwzXSxcbiAgICAgICAgaW5kZXg6MFxuICAgIH0pKDQpXG5cbiAgICA+T2JqZWN0IHtjb25maWdlZFRoaXNBcmc6IHRydWV9XG4gICAgPlsxLCAyLCAzLCA0XVxuXG4gICAgTHVjLkZ1bmN0aW9uLmNyZWF0ZUF1Z21lbnRvcihmbiwge1xuICAgICAgICB0aGlzQXJnOiB7Y29uZmlnZWRUaGlzQXJnOiB0cnVlfSxcbiAgICAgICAgYXJnczogWzEsMiwzXSxcbiAgICAgICAgaW5kZXg6MCxcbiAgICAgICAgYXJndW1lbnRzRmlyc3Q6ZmFsc2VcbiAgICB9KSg0KVxuXG4gICAgPk9iamVjdCB7Y29uZmlnZWRUaGlzQXJnOiB0cnVlfVxuICAgID5bNCwgMSwgMiwgM11cblxuXG4gICAgdmFyIGYgPSBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudG9yKGZuLCB7XG4gICAgICAgIGFyZ3M6IFsxLDIsM10sXG4gICAgICAgIGluZGV4OiB0cnVlXG4gICAgfSk7XG5cbiAgICBmLmFwcGx5KHtjb25maWc6IGZhbHNlfSwgWzRdKVxuXG4gICAgPk9iamVjdCB7Y29uZmlnOiBmYWxzZX1cbiAgICA+WzQsIDEsIDIsIDNdXG5cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSB0aGUgYXVnbWVudGVkIGZ1bmN0aW9uLlxuICovXG5leHBvcnRzLmNyZWF0ZUF1Z21lbnRvciA9IGZ1bmN0aW9uKGZuLCBjb25maWcpIHtcbiAgICB2YXIgdGhpc0FyZyA9IGNvbmZpZy50aGlzQXJnO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpc0FyZyB8fCB0aGlzLCBhdWdtZW50QXJncyhjb25maWcsIGFyZ3VtZW50cykpO1xuICAgIH07XG59O1xuXG5mdW5jdGlvbiBpbml0U2VxdWVuY2VGdW5jdGlvbnMoZm5zLCBjb25maWcpIHtcbiAgICB2YXIgdG9SdW4gPSBbXTtcbiAgICBhRWFjaChmbnMsIGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgdmFyIGZuID0gZjtcblxuICAgICAgICBpZiAoY29uZmlnKSB7XG4gICAgICAgICAgICBmbiA9IGV4cG9ydHMuY3JlYXRlQXVnbWVudG9yKGYsIGNvbmZpZyk7XG4gICAgICAgIH1cblxuICAgICAgICB0b1J1bi5wdXNoKGZuKTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0b1J1bjtcbn1cblxuLyoqXG4gKiBSZXR1cm4gYSBmdW5jdGlvbiB0aGF0IHJ1bnMgdGhlIHBhc3NlZCBpbiBmdW5jdGlvbnNcbiAqIGFuZCByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIGxhc3QgZnVuY3Rpb24gY2FsbGVkLlxuICogXG4gKiBAcGFyYW0gIHtGdW5jdGlvbi9GdW5jdGlvbltdfSBmbnMgXG4gKiBAcGFyYW0gIHtPYmplY3R9IFtjb25maWddIENvbmZpZyBvYmplY3RcbiAqIGZvciBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudG9yLiAgSWYgZGVmaW5lZCBhbGwgb2YgdGhlIGZ1bmN0aW9uc1xuICogd2lsbCBnZXQgY3JlYXRlZCB3aXRoIHRoZSBwYXNzZWQgaW4gY29uZmlnO1xuICpcbiAgICBMdWMuRnVuY3Rpb24uY3JlYXRlU2VxdWVuY2UoW1xuICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKDEpXG4gICAgICAgIH0sXG4gICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coMilcbiAgICAgICAgfSxcbiAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygzKVxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2ZpbmlzaGVkIGxvZ2dpbmcnKVxuICAgICAgICAgICAgcmV0dXJuIDQ7XG4gICAgICAgIH1cbiAgICBdKSgpXG4gICAgPjFcbiAgICA+MlxuICAgID4zXG4gICAgPmZpbmlzaGVkIGxvZ2dpbmdcbiAgICA+NFxuICogXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZXhwb3J0cy5jcmVhdGVTZXF1ZW5jZSA9IGZ1bmN0aW9uKGZucywgY29uZmlnKSB7XG4gICAgdmFyIGZ1bmN0aW9ucyA9IGluaXRTZXF1ZW5jZUZ1bmN0aW9ucyhmbnMsIGNvbmZpZyk7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpID0gMCxcbiAgICAgICAgICAgIGxlbiA9IGZ1bmN0aW9ucy5sZW5ndGg7XG5cbiAgICAgICAgZm9yKDtpIDwgbGVuIC0xOyArK2kpIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uc1tpXS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uc1tsZW4gLTEgXS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG59O1xuXG4vKipcbiAqIFJldHVybiBhIGZ1bmN0aW9uIHRoYXQgcnVucyB0aGUgcGFzc2VkIGluIGZ1bmN0aW9uc1xuICogaWYgb25lIG9mIHRoZSBmdW5jdGlvbnMgcmVzdWx0cyBmYWxzZSB0aGUgcmVzdCBvZiB0aGUgXG4gKiBmdW5jdGlvbnMgd29uJ3QgcnVuIGFuZCBmYWxzZSB3aWxsIGJlIHJldHVybmVkLlxuICpcbiAqIElmIG5vIGZhbHNlIGlzIHJldHVybmVkIHRoZSB2YWx1ZSBvZiB0aGUgbGFzdCBmdW5jdGlvbiByZXR1cm4gd2lsbCBiZSByZXR1cm5lZFxuICogXG4gKiBAcGFyYW0gIHtGdW5jdGlvbi9GdW5jdGlvbltdfSBmbnMgXG4gKiBAcGFyYW0gIHtPYmplY3R9IFtjb25maWddIENvbmZpZyBvYmplY3RcbiAqIGZvciBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudG9yLiAgSWYgZGVmaW5lZCBhbGwgb2YgdGhlIGZ1bmN0aW9uc1xuICogd2lsbCBnZXQgY3JlYXRlZCB3aXRoIHRoZSBwYXNzZWQgaW4gY29uZmlnO1xuXG4gICAgTHVjLkZ1bmN0aW9uLmNyZWF0ZVNlcXVlbmNlSWYoW1xuICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKDEpXG4gICAgICAgIH0sXG4gICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coMilcbiAgICAgICAgfSxcbiAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygzKVxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2ZpbmlzaGVkIGxvZ2dpbmcnKVxuICAgICAgICAgICAgcmV0dXJuIDQ7XG4gICAgICAgIH0sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpIGNhbnQgbG9nJylcbiAgICAgICAgfVxuICAgIF0pKClcblxuICAgID4xXG4gICAgPjJcbiAgICA+M1xuICAgID5maW5pc2hlZCBsb2dnaW5nXG4gICAgPmZhbHNlXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZXhwb3J0cy5jcmVhdGVTZXF1ZW5jZUlmID0gZnVuY3Rpb24oZm5zLCBjb25maWcpIHtcbiAgICB2YXIgZnVuY3Rpb25zID0gaW5pdFNlcXVlbmNlRnVuY3Rpb25zKGZucywgY29uZmlnKTtcblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHZhbHVlLFxuICAgICAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcblxuICAgICAgICBmdW5jdGlvbnMuc29tZShmdW5jdGlvbihmbil7XG4gICAgICAgICAgICB2YWx1ZSA9IGZuLmFwcGx5KHRoaXMsIGFyZ3MpO1xuXG4gICAgICAgICAgICByZXR1cm4gdmFsdWUgPT09IGZhbHNlO1xuICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcbn07XG5cbi8qKlxuICogUmV0dXJuIGEgZnVuY3Rpb25zIHRoYXQgcnVucyB0aGUgcGFzc2VkIGluIGZ1bmN0aW9uc1xuICogdGhlIHJlc3VsdCBvZiBlYWNoIGZ1bmN0aW9uIHdpbGwgYmUgdGhlIHRoZSBjYWxsIGFyZ3MgXG4gKiBmb3IgdGhlIG5leHQgZnVuY3Rpb24uICBUaGUgdmFsdWUgb2YgdGhlIGxhc3QgZnVuY3Rpb24gXG4gKiByZXR1cm4gd2lsbCBiZSByZXR1cm5lZC5cbiAqIFxuICogQHBhcmFtICB7RnVuY3Rpb24vRnVuY3Rpb25bXX0gZm5zIFxuICogQHBhcmFtICB7T2JqZWN0fSBbY29uZmlnXSBDb25maWcgb2JqZWN0XG4gKiBmb3IgTHVjLkZ1bmN0aW9uLmNyZWF0ZUF1Z21lbnRvci4gIElmIGRlZmluZWQgYWxsIG9mIHRoZSBmdW5jdGlvbnNcbiAqIHdpbGwgZ2V0IGNyZWF0ZWQgd2l0aCB0aGUgcGFzc2VkIGluIGNvbmZpZztcbiAgICAgXG4gICAgIEx1Yy5GdW5jdGlvbi5jcmVhdGVSZWxheWVyKFtcbiAgICAgICAgZnVuY3Rpb24oc3RyKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RyICsgJ2InXG4gICAgICAgIH0sXG4gICAgICAgIGZ1bmN0aW9uKHN0cikge1xuICAgICAgICAgICAgcmV0dXJuIHN0ciArICdjJ1xuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbihzdHIpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHIgKyAnZCdcbiAgICAgICAgfVxuICAgIF0pKCdhJylcblxuICAgID5cImFiY2RcIlxuXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZXhwb3J0cy5jcmVhdGVSZWxheWVyID0gZnVuY3Rpb24oZm5zLCBjb25maWcpIHtcbiAgICB2YXIgZnVuY3Rpb25zID0gaW5pdFNlcXVlbmNlRnVuY3Rpb25zKGZucywgY29uZmlnKTtcblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHZhbHVlLFxuICAgICAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcblxuICAgICAgICBmdW5jdGlvbnMuZm9yRWFjaChmdW5jdGlvbihmbiwgaW5kZXgpIHtcbiAgICAgICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gZm4uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gZm4uYXBwbHkodGhpcywgW3ZhbHVlXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9O1xufTtcblxuLyoqXG4gKiBDcmVhdGUgYSB0aHJvdHRsZWQgZnVuY3Rpb24gdGhhdCB0aGUgcGFzc2VkIGluIGZ1bmNpdG9uXG4gKiBvbmx5IGdldHMgZXZva2VkIG9uY2UgZXZlbiBpdCBpcyBjYWxsZWQgbWFueSB0aW1lc1xuICpcbiAqIFxuICogQHBhcmFtICB7RnVuY3Rpb259IGZuXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IFttaWxsaXNdIE51bWJlciBvZiBtaWxsaXNlY29uZHMgdG9cbiAqIHRocm90dGxlIHRoZSBmdW5jdGlvbi5cbiAqIEBwYXJhbSAge09iamVjdH0gW2NvbmZpZ10gQ29uZmlnIG9iamVjdFxuICogZm9yIEx1Yy5GdW5jdGlvbi5jcmVhdGVBdWdtZW50b3IuICBJZiBkZWZpbmVkIGFsbCBvZiB0aGUgZnVuY3Rpb25zXG4gKiB3aWxsIGdldCBjcmVhdGVkIHdpdGggdGhlIHBhc3NlZCBpbiBjb25maWc7XG4gKiBcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5leHBvcnRzLmNyZWF0ZVRocm90dGVsZWQgPSBmdW5jdGlvbihmLCBtaWxsaXMsIGNvbmZpZykge1xuICAgIHZhciBmbiA9IGNvbmZpZyA/IGV4cG9ydHMuY3JlYXRlQXVnbWVudG9yKGYsIGNvbmZpZykgOiBmLFxuICAgICAgICB0aW1lT3V0SWQgPSBmYWxzZTtcblxuICAgIGlmKCFtaWxsaXMpIHtcbiAgICAgICAgcmV0dXJuIGZuO1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG5cbiAgICAgICAgaWYodGltZU91dElkKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZU91dElkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRpbWVPdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aW1lT3V0SWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICB9LCBtaWxsaXMpO1xuICAgIH07XG59O1xuXG4vKipcbiAqIERlZmVyIGEgZnVuY3Rpb24ncyBleGVjdXRpb24gZm9yIHRoZSBwYXNzZWQgaW5cbiAqIG1pbGxpc2Vjb25kcy5cbiAqIFxuICogQHBhcmFtICB7RnVuY3Rpb259IGZuXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IFttaWxsaXNdIE51bWJlciBvZiBtaWxsaXNlY29uZHMgdG9cbiAqIGRlZmVyXG4gKiBAcGFyYW0gIHtPYmplY3R9IFtjb25maWddIENvbmZpZyBvYmplY3RcbiAqIGZvciBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudG9yLiAgSWYgZGVmaW5lZCBhbGwgb2YgdGhlIGZ1bmN0aW9uc1xuICogd2lsbCBnZXQgY3JlYXRlZCB3aXRoIHRoZSBwYXNzZWQgaW4gY29uZmlnO1xuICogXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZXhwb3J0cy5jcmVhdGVEZWZlcnJlZCA9IGZ1bmN0aW9uKGYsIG1pbGxpcywgY29uZmlnKSB7XG4gICAgdmFyIGZuID0gY29uZmlnID8gZXhwb3J0cy5jcmVhdGVBdWdtZW50b3IoZiwgY29uZmlnKSA6IGY7XG5cbiAgICBpZighbWlsbGlzKSB7XG4gICAgICAgIHJldHVybiBmbjtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBmbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgfSwgbWlsbGlzKTtcbiAgICB9O1xufTsiLCJ2YXIgZW1wdHlGbiA9IHJlcXVpcmUoJy4uL2Z1bmN0aW9uJykuZW1wdHlGbixcbiAgICBhcHBseSA9IHJlcXVpcmUoJy4uL29iamVjdCcpLmFwcGx5O1xuXG4vKipcbiAqIEBjbGFzcyBMdWMuQmFzZVxuICogU2ltcGxlIGNsYXNzIHRoYXQgYnkgZGVmYXVsdCBhcHBsaWVzIHRoZSBcbiAqIGZpcnN0IGFyZ3VtZW50IHRvIHRoZSBpbnN0YW5jZSBhbmQgdGhlbiBjYWxsc1xuICogTHVjLkJhc2UuaW5pdC5cbiAqXG4gICAgdmFyIGIgPSBuZXcgTHVjLkJhc2Uoe1xuICAgICAgICBhOiAxLFxuICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdoZXknKVxuICAgICAgICB9XG4gICAgfSlcbiAgICBiLmFcbiAgICA+aGV5XG4gICAgPjFcbiAqL1xuZnVuY3Rpb24gQmFzZSgpIHtcbiAgICB0aGlzLmJlZm9yZUluaXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLmluaXQoKTtcbn1cblxuQmFzZS5wcm90b3R5cGUgPSB7XG4gICAgLyoqXG4gICAgICogQnkgZGVmYXVsdCBhcHBseSB0aGUgY29uZmlnIHRvIHRoZSBcbiAgICAgKiBpbnN0YW5jZS5cbiAgICAgKi9cbiAgICBiZWZvcmVJbml0OiBmdW5jdGlvbihjb25maWcpIHtcbiAgICAgICAgYXBwbHkodGhpcywgY29uZmlnKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEBtZXRob2RcbiAgICAgKiBTaW1wbGUgaG9vayB0byBpbml0aWFsaXplXG4gICAgICogdGhlIGNsYXNzLlxuICAgICAqL1xuICAgIGluaXQ6IGVtcHR5Rm5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZTsiLCJ2YXIgQmFzZSA9IHJlcXVpcmUoJy4vYmFzZScpLFxuICAgIENvbXBvc2l0aW9uID0gcmVxdWlyZSgnLi9jb21wb3NpdGlvbicpLFxuICAgIG9iaiA9IHJlcXVpcmUoJy4uL29iamVjdCcpLFxuICAgIGFycmF5Rm5zID0gcmVxdWlyZSgnLi4vYXJyYXknKSxcbiAgICBlbXB0eUZuID0gcmVxdWlyZSgnLi4vZnVuY3Rpb24nKS5lbXB0eUZuLFxuICAgIGFFYWNoID0gYXJyYXlGbnMuZWFjaCxcbiAgICBhcHBseSA9IG9iai5hcHBseSxcbiAgICBvRWFjaCA9IG9iai5lYWNoLFxuICAgIG9GaWx0ZXIgPSBvYmouZmlsdGVyLFxuICAgIG1peCA9IG9iai5taXgsXG4gICAgYXJyYXlTbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxuZnVuY3Rpb24gQ2xhc3NEZWZpbmVyKCkge31cblxuQ2xhc3NEZWZpbmVyLkNPTVBPU0lUSU9OU19OQU1FID0gJyRjb21wb3NpdGlvbnMnO1xuXG5DbGFzc0RlZmluZXIucHJvdG90eXBlID0ge1xuICAgIGRlZmF1bHRUeXBlOiBCYXNlLFxuXG4gICAgcHJvY2Vzc29yS2V5czoge1xuICAgICAgICAkbWl4aW5zOiAnX2FwcGx5TWl4aW5zJyxcbiAgICAgICAgJHN0YXRpY3M6ICdfYXBwbHlTdGF0aWNzJyxcbiAgICAgICAgJGNvbXBvc2l0aW9uczogJ19jb21wb3NlJyxcbiAgICAgICAgJHN1cGVyOiB0cnVlXG4gICAgfSxcblxuICAgIGRlZmluZTogZnVuY3Rpb24ob3B0cykge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IG9wdHMgfHwge30sXG4gICAgICAgICAgICAvL2lmIHN1cGVyIGlzIGEgZmFsc3kgdmFsdWUgYmVzaWRlcyB1bmRlZmluZWQgdGhhdCBtZWFucyBubyBzdXBlcmNsYXNzXG4gICAgICAgICAgICBTdXBlciA9IG9wdGlvbnMuJHN1cGVyIHx8IChvcHRpb25zLiRzdXBlciA9PT0gdW5kZWZpbmVkID8gdGhpcy5kZWZhdWx0VHlwZSA6IGZhbHNlKSxcbiAgICAgICAgICAgIENvbnN0cnVjdG9yO1xuXG4gICAgICAgIG9wdGlvbnMuJHN1cGVyID0gU3VwZXI7XG5cbiAgICAgICAgQ29uc3RydWN0b3IgPSB0aGlzLl9jcmVhdGVDb25zdHJ1Y3RvcihvcHRpb25zKTtcblxuICAgICAgICB0aGlzLl9wcm9jZXNzQWZ0ZXJDcmVhdGUoQ29uc3RydWN0b3IsIG9wdGlvbnMpO1xuXG4gICAgICAgIHJldHVybiBDb25zdHJ1Y3RvcjtcbiAgICB9LFxuXG4gICAgX2NyZWF0ZUNvbnN0cnVjdG9yOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHZhciBzdXBlcmNsYXNzID0gb3B0aW9ucy4kc3VwZXIsXG4gICAgICAgICAgICBDb25zdHJ1Y3RvciA9IHRoaXMuX2NyZWF0ZUNvbnN0cnVjdG9yRm4ob3B0aW9ucyk7XG5cbiAgICAgICAgaWYoc3VwZXJjbGFzcykge1xuICAgICAgICAgICAgQ29uc3RydWN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlcmNsYXNzLnByb3RvdHlwZSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBDb25zdHJ1Y3RvcjtcbiAgICB9LFxuXG4gICAgX2NyZWF0ZUNvbnN0cnVjdG9yRm46IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHN1cGVyY2xhc3MgPSBvcHRpb25zLiRzdXBlcixcbiAgICAgICAgICAgIENvbnN0cnVjdG9yO1xuXG4gICAgICAgIGlmICh0aGlzLl9oYXNDb25zdHJ1Y3Rvck1vZGlmeWluZ09wdGlvbnMob3B0aW9ucykpIHtcbiAgICAgICAgICAgIENvbnN0cnVjdG9yID0gdGhpcy5fY3JlYXRlQ29uc3RydWN0b3JXaXRoTW9kaWZpeWluZ09wdGlvbnMob3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZighc3VwZXJjbGFzcykge1xuICAgICAgICAgICAgQ29uc3RydWN0b3IgPSBmdW5jdGlvbigpIHt9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgQ29uc3RydWN0b3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBzdXBlcmNsYXNzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIENvbnN0cnVjdG9yO1xuICAgIH0sXG5cbiAgICBfY3JlYXRlQ29uc3RydWN0b3JXaXRoTW9kaWZpeWluZ09wdGlvbnM6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHN1cGVyY2xhc3MgPSBvcHRpb25zLiRzdXBlcixcbiAgICAgICAgICAgIG1lID0gdGhpcyxcbiAgICAgICAgICAgIGluaXRCZWZvcmVTdXBlcmNsYXNzLFxuICAgICAgICAgICAgaW5pdEFmdGVyU3VwZXJjbGFzcyxcbiAgICAgICAgICAgIGluaXQ7XG5cbiAgICAgICAgaWYgKCFzdXBlcmNsYXNzKSB7XG4gICAgICAgICAgICBpbml0ID0gdGhpcy5fY3JlYXRlSW5pdENsYXNzT3B0aW9uc0ZuKG9wdGlvbnMsIHtcbiAgICAgICAgICAgICAgICBhbGw6IHRydWVcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBhcnJheVNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICBpbml0LmNhbGwodGhpcywgb3B0aW9ucywgYXJncyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdEJlZm9yZVN1cGVyY2xhc3MgPSB0aGlzLl9jcmVhdGVJbml0Q2xhc3NPcHRpb25zRm4ob3B0aW9ucywge1xuICAgICAgICAgICAgYmVmb3JlOiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGluaXRBZnRlclN1cGVyY2xhc3MgPSB0aGlzLl9jcmVhdGVJbml0Q2xhc3NPcHRpb25zRm4ob3B0aW9ucywge1xuICAgICAgICAgICAgYmVmb3JlOiBmYWxzZVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgYXJncyA9IGFycmF5U2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXG4gICAgICAgICAgICBpbml0QmVmb3JlU3VwZXJjbGFzcy5jYWxsKHRoaXMsIG9wdGlvbnMsIGFyZ3MpO1xuICAgICAgICAgICAgc3VwZXJjbGFzcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgaW5pdEFmdGVyU3VwZXJjbGFzcy5jYWxsKHRoaXMsIG9wdGlvbnMsIGFyZ3MpO1xuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBfY3JlYXRlSW5pdENsYXNzT3B0aW9uc0ZuOiBmdW5jdGlvbihvcHRpb25zLCBjb25maWcpIHtcbiAgICAgICAgdmFyIG1lID0gdGhpcyxcbiAgICAgICAgICAgIGNvbXBvc2l0aW9ucyA9IHRoaXMuX2ZpbHRlckNvbXBvc2l0aW9ucyhjb25maWcsIG9wdGlvbnMuJGNvbXBvc2l0aW9ucyk7XG5cbiAgICAgICAgaWYoY29tcG9zaXRpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGVtcHR5Rm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBmdW5jdGlvbihvcHRpb25zLCBpbnN0YW5jZUFyZ3MpIHtcbiAgICAgICAgICAgIG1lLl9pbml0Q29tcG9zaXRpb25zLmNhbGwodGhpcywgY29tcG9zaXRpb25zLCBpbnN0YW5jZUFyZ3MpO1xuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBfZmlsdGVyQ29tcG9zaXRpb25zOiBmdW5jdGlvbihjb25maWcsIGNvbXBvc2l0aW9ucykge1xuICAgICAgICB2YXIgYmVmb3JlID0gY29uZmlnLmJlZm9yZSwgXG4gICAgICAgICAgICBmaWx0ZXJlZCA9IFtdO1xuXG4gICAgICAgIGlmKGNvbmZpZy5hbGwpIHtcbiAgICAgICAgICAgIHJldHVybiBjb21wb3NpdGlvbnM7XG4gICAgICAgIH1cblxuICAgICAgICBhRWFjaChjb21wb3NpdGlvbnMsIGZ1bmN0aW9uKGNvbXBvc2l0aW9uKSB7XG4gICAgICAgICAgICBpZihiZWZvcmUgJiYgY29tcG9zaXRpb24uaW5pdEFmdGVyICE9PSB0cnVlIHx8ICghYmVmb3JlICYmIGNvbXBvc2l0aW9uLmluaXRBZnRlciA9PT0gdHJ1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWQucHVzaChjb21wb3NpdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBmaWx0ZXJlZDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBvcHRpb25zIHtPYmplY3R9IHRoZSBjb21wb3NpdGlvbiBjb25maWcgb2JqZWN0XG4gICAgICogaW5zdGFuY2VBcmdzIHtBcnJheX0gdGhlIGFyZ3VtZW50cyBwYXNzZWQgdG8gdGhlIGluc3RhbmNlJ3NcbiAgICAgKiBjb25zdHJ1Y3Rvci5cbiAgICAgKi9cbiAgICBfaW5pdENvbXBvc2l0aW9uczogZnVuY3Rpb24oY29tcG9zaXRpb25zLCBpbnN0YW5jZUFyZ3MpIHtcbiAgICAgICAgaWYoIXRoaXNbQ2xhc3NEZWZpbmVyLkNPTVBPU0lUSU9OU19OQU1FXSkge1xuICAgICAgICAgICAgdGhpc1tDbGFzc0RlZmluZXIuQ09NUE9TSVRJT05TX05BTUVdID0ge307XG4gICAgICAgIH1cblxuICAgICAgICBhRWFjaChjb21wb3NpdGlvbnMsIGZ1bmN0aW9uKGNvbXBvc2l0aW9uQ29uZmlnKSB7XG4gICAgICAgICAgICB2YXIgY29uZmlnID0gYXBwbHkoe1xuICAgICAgICAgICAgICAgIGluc3RhbmNlOiB0aGlzLFxuICAgICAgICAgICAgICAgIGluc3RhbmNlQXJnczogaW5zdGFuY2VBcmdzXG4gICAgICAgICAgICB9LCBjb21wb3NpdGlvbkNvbmZpZyksIFxuICAgICAgICAgICAgY29tcG9zaXRpb247XG5cbiAgICAgICAgICAgIGNvbXBvc2l0aW9uID0gbmV3IENvbXBvc2l0aW9uKGNvbmZpZyk7XG5cbiAgICAgICAgICAgIHRoaXNbQ2xhc3NEZWZpbmVyLkNPTVBPU0lUSU9OU19OQU1FXVtjb21wb3NpdGlvbi5uYW1lXSA9IGNvbXBvc2l0aW9uLmdldEluc3RhbmNlKCk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICBfaGFzQ29uc3RydWN0b3JNb2RpZnlpbmdPcHRpb25zOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLiRjb21wb3NpdGlvbnM7XG4gICAgfSxcblxuICAgIF9nZXRQcm9jZXNzb3JLZXk6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzb3JLZXlzW2tleV07XG4gICAgfSxcblxuICAgIF9wcm9jZXNzQWZ0ZXJDcmVhdGU6IGZ1bmN0aW9uKCRjbGFzcywgb3B0aW9ucykge1xuICAgICAgICB0aGlzLl9hcHBseVZhbHVlc1RvUHJvdG8oJGNsYXNzLCBvcHRpb25zKTtcbiAgICAgICAgdGhpcy5faGFuZGxlUG9zdFByb2Nlc3NvcnMoJGNsYXNzLCBvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgX2FwcGx5VmFsdWVzVG9Qcm90bzogZnVuY3Rpb24oJGNsYXNzLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBwcm90byA9ICRjbGFzcy5wcm90b3R5cGUsXG4gICAgICAgICAgICBTdXBlciA9IG9wdGlvbnMuJHN1cGVyLFxuICAgICAgICAgICAgdmFsdWVzID0gYXBwbHkoe1xuICAgICAgICAgICAgICAgICRzdXBlcmNsYXNzOiBTdXBlci5wcm90b3R5cGUsXG4gICAgICAgICAgICAgICAgJGNsYXNzOiAkY2xhc3NcbiAgICAgICAgICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgICAgIC8vRG9uJ3QgcHV0IHRoZSBkZWZpbmUgc3BlY2lmaWMgcHJvcGVydGllc1xuICAgICAgICAvL29uIHRoZSBwcm90b3R5cGVcbiAgICAgICAgb0VhY2godmFsdWVzLCBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2dldFByb2Nlc3NvcktleShrZXkpKSB7XG4gICAgICAgICAgICAgICAgcHJvdG9ba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgX2hhbmRsZVBvc3RQcm9jZXNzb3JzOiBmdW5jdGlvbigkY2xhc3MsIG9wdGlvbnMpIHtcbiAgICAgICAgb0VhY2gob3B0aW9ucywgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIG1ldGhvZCA9IHRoaXMuX2dldFByb2Nlc3NvcktleShrZXkpO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXNbbWV0aG9kXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHRoaXNbbWV0aG9kXS5jYWxsKHRoaXMsICRjbGFzcywgb3B0aW9uc1trZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIF9hcHBseU1peGluczogZnVuY3Rpb24oJGNsYXNzLCBtaXhpbnMpIHtcbiAgICAgICAgdmFyIHByb3RvID0gJGNsYXNzLnByb3RvdHlwZTtcbiAgICAgICAgYUVhY2gobWl4aW5zLCBmdW5jdGlvbihtaXhpbikge1xuICAgICAgICAgICAgLy9hY2NlcHQgQ29uc3RydWN0b3JzIG9yIE9iamVjdHNcbiAgICAgICAgICAgIHZhciB0b01peCA9IG1peGluLnByb3RvdHlwZSB8fCBtaXhpbjtcbiAgICAgICAgICAgIG1peChwcm90bywgdG9NaXgpO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgX2FwcGx5U3RhdGljczogZnVuY3Rpb24oJGNsYXNzLCBzdGF0aWNzKSB7XG4gICAgICAgIGFwcGx5KCRjbGFzcywgc3RhdGljcyk7XG4gICAgfSxcblxuICAgIF9jb21wb3NlOiBmdW5jdGlvbigkY2xhc3MsIGNvbXBvc2l0aW9ucykge1xuICAgICAgICB2YXIgcHJvdG90eXBlID0gJGNsYXNzLnByb3RvdHlwZSxcbiAgICAgICAgICAgIG1ldGhvZHNUb0NvbXBvc2U7XG5cbiAgICAgICAgYUVhY2goY29tcG9zaXRpb25zLCBmdW5jdGlvbihjb21wb3NpdGlvbkNvbmZpZykge1xuICAgICAgICAgICAgdmFyIGNvbXBvc2l0aW9uID0gbmV3IENvbXBvc2l0aW9uKGNvbXBvc2l0aW9uQ29uZmlnKSxcbiAgICAgICAgICAgICAgICBuYW1lID0gY29tcG9zaXRpb24ubmFtZSxcbiAgICAgICAgICAgICAgICBDb25zdHJ1Y3RvciA9IGNvbXBvc2l0aW9uLkNvbnN0cnVjdG9yO1xuXG4gICAgICAgICAgICBjb21wb3NpdGlvbi52YWxpZGF0ZSgpO1xuXG4gICAgICAgICAgICBtZXRob2RzVG9Db21wb3NlID0gY29tcG9zaXRpb24uZ2V0TWV0aG9kc1RvQ29tcG9zZSgpO1xuXG4gICAgICAgICAgICBtZXRob2RzVG9Db21wb3NlLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICAgICAgaWYgKHByb3RvdHlwZVtrZXldID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvdG90eXBlW2tleV0gPSB0aGlzLl9jcmVhdGVDb21wb3NlclByb3RvRm4oa2V5LCBuYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICAgICAgcHJvdG90eXBlLmdldENvbXBvc2l0aW9uID0gdGhpcy5fX2dldENvbXBvc2l0aW9uO1xuXG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEdldHRlciBmb3IgY29tcG9zaXRpb24gaW5zdGFuY2UgdGhhdCBnZXRzIHB1dCBvblxuICAgICAqIHRoZSBkZWZpbmVkIGNsYXNzLlxuICAgICAqIEBwYXJhbSAge1N0cmluZ30ga2V5XG4gICAgICovXG4gICAgX19nZXRDb21wb3NpdGlvbjogZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIHJldHVybiB0aGlzW0NsYXNzRGVmaW5lci5DT01QT1NJVElPTlNfTkFNRV1ba2V5XTtcbiAgICB9LFxuXG4gICAgX2NyZWF0ZUNvbXBvc2VyUHJvdG9GbjogZnVuY3Rpb24obWV0aG9kTmFtZSwgY29tcG9zaXRpb25OYW1lKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBjb21wID0gdGhpc1tDbGFzc0RlZmluZXIuQ09NUE9TSVRJT05TX05BTUVdW2NvbXBvc2l0aW9uTmFtZV07XG4gICAgICAgICAgICByZXR1cm4gY29tcFttZXRob2ROYW1lXS5hcHBseShjb21wLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuICAgIH1cbn07XG5cbnZhciBEZWZpbmVyID0gbmV3IENsYXNzRGVmaW5lcigpO1xuLy9tYWtlIEx1Yy5kZWZpbmUgaGFwcHlcbkRlZmluZXIuZGVmaW5lID0gRGVmaW5lci5kZWZpbmUuYmluZChEZWZpbmVyKTtcblxubW9kdWxlLmV4cG9ydHMgPSBEZWZpbmVyOyIsInZhciBhRWFjaCA9IHJlcXVpcmUoJy4uL2FycmF5JykuZWFjaCxcbiAgICBvYmogPSByZXF1aXJlKCcuLi9vYmplY3QnKSxcbiAgICBlbXB0eUZuID0gcmVxdWlyZSgnLi4vZnVuY3Rpb24nKS5lbXB0eUZuLFxuICAgIGFwcGx5ID0gb2JqLmFwcGx5O1xuXG5cbmZ1bmN0aW9uIFBsdWdpbihjb25maWcpIHtcbiAgICBhcHBseSh0aGlzLCBjb25maWcpO1xufVxuXG5QbHVnaW4ucHJvdG90eXBlID0ge1xuICAgIGluaXQ6IGVtcHR5Rm4sXG4gICAgZGVzdHJveTogZW1wdHlGblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQbHVnaW47XG4iLCJ2YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnLi4vZXZlbnRzL2V2ZW50RW1pdHRlcicpLFxuICAgIFBsdWdpbk1hbmFnZXIgPSByZXF1aXJlKCcuL3BsdWdpbk1hbmFnZXInKTtcblxubW9kdWxlLmV4cG9ydHMuRXZlbnRFbWl0dGVyID0ge1xuICAgIENvbnN0cnVjdG9yOiBFdmVudEVtaXR0ZXIsXG4gICAgbmFtZTogJ2VtaXR0ZXInLFxuICAgIGZpbHRlcktleXM6ICdhbGxNZXRob2RzJ1xufTtcblxuXG5cbm1vZHVsZS5leHBvcnRzLlBsdWdpbk1hbmFnZXIgPSB7XG4gICAgbmFtZTogJ3BsdWdpbnMnLFxuICAgIGluaXRBZnRlcjogdHJ1ZSxcbiAgICBDb25zdHJ1Y3RvcjogUGx1Z2luTWFuYWdlcixcbiAgICBjcmVhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbWFuYWdlciA9IG5ldyB0aGlzLkNvbnN0cnVjdG9yKCk7XG4gICAgICAgIG1hbmFnZXIuaW5pdCh7XG4gICAgICAgICAgICBpbnN0YW5jZTogdGhpcy5pbnN0YW5jZSxcbiAgICAgICAgICAgIGluc3RhbmNlQXJnczogdGhpcy5pbnN0YW5jZUFyZ3NcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIG1hbmFnZXI7XG4gICAgfSxcbiAgICBmaWx0ZXJLZXlzOiBbJ2Rlc3Ryb3lQbHVnaW5zJ11cbn07IiwidmFyIG9iaiA9IHJlcXVpcmUoJy4uL29iamVjdCcpLFxuICAgIGFwcGx5ID0gb2JqLmFwcGx5LFxuICAgIG1peCA9IG9iai5taXgsXG4gICAgb0ZpbHRlciA9IG9iai5maWx0ZXIsXG4gICAgZW1wdHlGbiA9ICgnLi4vZnVuY3Rpb24nKS5lbXB0eUZuLFxuICAgIGlzID0gcmVxdWlyZSgnLi4vaXMnKTtcblxuLyoqXG4gKiBAY2xhc3MgIEx1Yy5Db21wb3NpdGlvblxuICogQHByb3RlY3RlZFxuICogY2xhc3MgdGhhdCB3cmFwcyAkY29tcG9zaXRpb24gY29uZmlnIG9iamVjdHNcbiAqIHRvIGNvbmZvcm0gdG8gYW4gYXBpLiBUaGUgY29uZmlnIG9iamVjdFxuICogd2lsbCBvdmVycmlkZSBhbnkgcHJvdGVjdGVkIG1ldGhvZHMgYW5kIGRlZmF1bHQgY29uZmlncy5cbiAqL1xuZnVuY3Rpb24gQ29tcG9zaXRpb24oYykge1xuICAgIHZhciBkZWZhdWx0cyA9IGMuZGVmYXVsdHMsXG4gICAgICAgIGNvbmZpZyA9IGM7XG5cbiAgICBpZihkZWZhdWx0cykge1xuICAgICAgICBtaXgoY29uZmlnLCBjb25maWcuZGVmYXVsdHMpO1xuICAgICAgICBkZWxldGUgY29uZmlnLmRlZmF1bHRzO1xuICAgIH1cblxuICAgIGFwcGx5KHRoaXMsIGNvbmZpZyk7XG59XG5cbkNvbXBvc2l0aW9uLnByb3RvdHlwZSA9IHtcbiAgICAvKipcbiAgICAgKiBAY2ZnIHtTdHJpbmd9IG5hbWUgKHJlcXVpcmVkKSB0aGUgbmFtZVxuICAgICAqL1xuICAgIFxuICAgIC8qKlxuICAgICAqIEBjZmcge0Z1bmN0aW9ufSBDb25zdHJ1Y3RvciAocmVxdWlyZWQpIHRoZSBDb25zdHJ1Y3RvclxuICAgICAqIHRvIHVzZSB3aGVuIGNyZWF0aW5nIHRoZSBjb21wb3NpdGlvbiBpbnN0YW5jZS4gIFRoaXNcbiAgICAgKiBpcyByZXF1aXJlZCBpZiBMdWMuQ29tcG9zaXRpb24uY3JlYXRlIGlzIG5vdCBvdmVycndpdHRlbiBieVxuICAgICAqIHRoZSBwYXNzZWQgaW4gY29tcG9zaXRpb24gY29uZmlnIG9iamVjdC5cbiAgICAgKi9cbiAgICBcbiAgICAvKipcbiAgICAgKiBAcHJvdGVjdGVkXG4gICAgICogQnkgZGVmYXVsdCBqdXN0IHJldHVybiBhIG5ld2x5IGNyZWF0ZWQgQ29uc3RydWN0b3IgaW5zdGFuY2UuXG4gICAgICogXG4gICAgICogV2hlbiBjcmVhdGUgaXMgY2FsbGVkIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllcyBjYW4gYmUgdXNlZCA6XG4gICAgICogXG4gICAgICogdGhpcy5pbnN0YW5jZSBUaGUgaW5zdGFuY2UgdGhhdCBpcyBjcmVhdGluZ1xuICAgICAqIHRoZSBjb21wb3NpdGlvbi5cbiAgICAgKiBcbiAgICAgKiB0aGlzLkNvbnN0cnVjdG9yIHRoZSBjb25zdHJ1Y3RvciB0aGF0IGlzIHBhc3NlZCBpbiBmcm9tXG4gICAgICogdGhlIGNvbXBvc2l0aW9uIGNvbmZpZy4gXG4gICAgICpcbiAgICAgKiB0aGlzLmluc3RhbmNlQXJncyB0aGUgYXJndW1lbnRzIHBhc3NlZCBpbnRvIHRoZSBpbnN0YW5jZSB3aGVuIGl0IFxuICAgICAqIGlzIGJlaW5nIGNyZWF0ZWQuICBGb3IgZXhhbXBsZVxuXG4gICAgICAgIG5ldyBNeUNsYXNzV2l0aEFDb21wb3NpdGlvbih7cGx1Z2luczogW119KVxuICAgICAgICAvL2luc2lkZSBvZiB0aGUgY3JlYXRlIG1ldGhvZFxuICAgICAgICB0aGlzLmluc3RhbmNlQXJnc1xuICAgICAgICA+W3twbHVnaW5zOiBbXX1dXG5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFxuICAgICAqIHRoZSBjb21wb3NpdGlvbiBpbnN0YW5jZS5cbiAgICAgKlxuICAgICAqIEZvciBleGFtcGxlIHNldCB0aGUgZW1pdHRlcnMgbWF4TGlzdGVuZXJzXG4gICAgICogdG8gd2hhdCB0aGUgaW5zdGFuY2UgaGFzIGNvbmZpZ2VkLlxuICAgICAgXG4gICAgICAgIG1heExpc3RlbmVyczogMTAwLFxuICAgICAgICAkY29tcG9zaXRpb25zOiB7XG4gICAgICAgICAgICBDb25zdHJ1Y3RvcjogTHVjLkV2ZW50RW1pdHRlcixcbiAgICAgICAgICAgIGNyZWF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIGVtaXR0ZXIgPSBuZXcgdGhpcy5Db25zdHJ1Y3RvcigpO1xuICAgICAgICAgICAgICAgIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKHRoaXMuaW5zdGFuY2UubWF4TGlzdGVuZXJzKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZW1pdHRlcjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBuYW1lOiAnZW1pdHRlcidcbiAgICAgICAgfVxuXG4gICAgICovXG4gICAgY3JlYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIENvbnN0cnVjdG9yID0gdGhpcy5Db25zdHJ1Y3RvcjtcbiAgICAgICAgcmV0dXJuIG5ldyBDb25zdHJ1Y3RvcigpO1xuICAgIH0sXG5cbiAgICBnZXRJbnN0YW5jZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZSgpO1xuICAgIH0sXG5cbiAgICB2YWxpZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKHRoaXMubmFtZSAgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBIG5hbWUgbXVzdCBiZSBkZWZpbmVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYoIWlzLmlzRnVuY3Rpb24odGhpcy5Db25zdHJ1Y3RvcikgJiYgdGhpcy5jcmVhdGUgPT09IENvbXBvc2l0aW9uLnByb3RvdHlwZS5jcmVhdGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIENvbnN0cnVjdG9yIG11c3QgYmUgZnVuY3Rpb24gaWYgY3JlYXRlIGlzIG5vdCBvdmVycmlkZW4nKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkgZmlsdGVyRm5zXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAcHJvcGVydHkgZmlsdGVyRm5zLmFsbE1ldGhvZHMgcmV0dXJuIGFsbCBtZXRob2RzIGZyb20gdGhlXG4gICAgICogY29uc3RydWN0b3JzIHByb3RvdHlwZVxuICAgICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICAgKi9cbiAgICBmaWx0ZXJGbnM6IHtcbiAgICAgICAgYWxsTWV0aG9kczogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGlzLmlzRnVuY3Rpb24odmFsdWUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBjZmcge0Z1bmN0aW9uL1N0cmluZy9BcnJheVtdfSBmaWx0ZXJLZXlzXG4gICAgICogVGhlIGtleXMgdG8gYWRkIHRvIHRoZSBkZWZpbmVycyBwcm90b3R5cGUgdGhhdCB3aWxsIGluIHR1cm4gY2FsbFxuICAgICAqIHRoZSBjb21wb3NpdGlvbnMgbWV0aG9kLlxuICAgICAqIFxuICAgICAqIERlZmF1bHRzIHRvIEx1Yy5lbXB0eUZuLiBcbiAgICAgKiBJZiBhbiBhcnJheSBpcyBwYXNzZWQgaXQgd2lsbCBqdXN0IHVzZSB0aGF0IEFycmF5LlxuICAgICAqIFxuICAgICAqIElmIGEgc3RyaW5nIGlzIHBhc3NlZCBhbmQgbWF0Y2hlcyBhIG1ldGhvZCBmcm9tIFxuICAgICAqIEx1Yy5Db21wb3NpdGlvbi5maWx0ZXJGbnMgaXQgd2lsbCBjYWxsIHRoYXQgaW5zdGVhZC5cbiAgICAgKiBcbiAgICAgKiBJZiBhIGZ1bmN0aW9uIGlzIGRlZmluZWQgaXRcbiAgICAgKiB3aWxsIGdldCBjYWxsZWQgd2hpbGUgaXRlcmF0aW5nIG92ZXIgZWFjaCBrZXkgdmFsdWUgcGFpciBvZiB0aGUgXG4gICAgICogQ29uc3RydWN0b3IncyBwcm90b3R5cGUsIGlmIGEgdHJ1dGh5IHZhbHVlIGlzIFxuICAgICAqIHJldHVybmVkIHRoZSBwcm9wZXJ0eSB3aWxsIGJlIGFkZGVkIHRvIHRoZSBkZWZpbmluZ1xuICAgICAqIGNsYXNzZXMgcHJvdG90eXBlLlxuICAgICAqIFxuICAgICAqIEZvciBleGFtcGxlIHRoaXMgY29uZmlnIHdpbGwgb25seSBleHBvc2UgdGhlIGVtaXQgbWV0aG9kIFxuICAgICAqIHRvIHRoZSBkZWZpbmluZyBjbGFzc1xuICAgICBcbiAgICAgICAgJGNvbXBvc2l0aW9uczoge1xuICAgICAgICAgICAgQ29uc3RydWN0b3I6IEx1Yy5FdmVudEVtaXR0ZXIsXG4gICAgICAgICAgICBmaWx0ZXJLZXlzOiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGtleSA9PT0gJ2VtaXQnO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG5hbWU6ICdlbWl0dGVyJ1xuICAgICAgICB9XG4gICAgICogdGhpcyBpcyBhbHNvIGEgdmFsaWQgY29uZmlnXG4gICAgICogXG4gICAgICAgICRjb21wb3NpdGlvbnM6IHtcbiAgICAgICAgICAgIENvbnN0cnVjdG9yOiBMdWMuRXZlbnRFbWl0dGVyLFxuICAgICAgICAgICAgZmlsdGVyS2V5czogWydlbWl0dGVyJ10sXG4gICAgICAgICAgICBuYW1lOiAnZW1pdHRlcidcbiAgICAgICAgfVxuICAgICAqIFxuICAgICAqL1xuICAgIGZpbHRlcktleXM6IGVtcHR5Rm4sXG5cbiAgICBnZXRNZXRob2RzVG9Db21wb3NlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGZpbHRlcktleXMgPSB0aGlzLmZpbHRlcktleXMsXG4gICAgICAgICAgICBwYWlyc1RvQWRkLFxuICAgICAgICAgICAgZmlsdGVyRm47XG5cblxuICAgICAgICBpZiAoaXMuaXNBcnJheShmaWx0ZXJLZXlzKSkge1xuICAgICAgICAgICAgcGFpcnNUb0FkZCA9IGZpbHRlcktleXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmaWx0ZXJGbiA9IGZpbHRlcktleXM7XG5cbiAgICAgICAgICAgIGlmIChpcy5pc1N0cmluZyhmaWx0ZXJLZXlzKSkge1xuICAgICAgICAgICAgICAgIGZpbHRlckZuID0gdGhpcy5maWx0ZXJGbnNbZmlsdGVyS2V5c107XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vQ29uc3RydWN0b3JzIGFyZSBub3QgbmVlZGVkIGlmIGNyZWF0ZSBpcyBvdmVyd3JpdHRlblxuICAgICAgICAgICAgcGFpcnNUb0FkZCA9IG9GaWx0ZXIodGhpcy5Db25zdHJ1Y3RvciAmJiB0aGlzLkNvbnN0cnVjdG9yLnByb3RvdHlwZSwgZmlsdGVyRm4sIHRoaXMsIHtcbiAgICAgICAgICAgICAgICBvd25Qcm9wZXJ0aWVzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBrZXlzOiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwYWlyc1RvQWRkO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ29tcG9zaXRpb247IiwidmFyIFBsdWdpbiA9IHJlcXVpcmUoJy4vcGx1Z2luJyksXG4gICAgaXMgPSByZXF1aXJlKCcuLi9pcycpLFxuICAgIG9iaiA9IHJlcXVpcmUoJy4uL29iamVjdCcpLFxuICAgIGFyciA9IHJlcXVpcmUoJy4uL2FycmF5JyksXG4gICAgYUVhY2ggPSBhcnIuZWFjaCxcbiAgICBtaXggPSBvYmoubWl4LFxuICAgIGFwcGx5ID0gb2JqLmFwcGx5O1xuXG5mdW5jdGlvbiBQbHVnaW5NYW5hZ2VyKCkge31cblxuUGx1Z2luTWFuYWdlci5wcm90b3R5cGUgPSB7XG4gICAgZGVmYXVsdFBsdWdpbjogUGx1Z2luLFxuXG4gICAgaW5pdDogZnVuY3Rpb24oaW5zdGFuY2VWYWx1ZXMpIHtcbiAgICAgICAgYXBwbHkodGhpcywgaW5zdGFuY2VWYWx1ZXMpO1xuICAgICAgICB0aGlzLmNyZWF0ZVBsdWdpbnMoKTtcbiAgICB9LFxuXG4gICAgY3JlYXRlUGx1Z2luczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjb25maWcgPSB0aGlzLmluc3RhbmNlQXJnc1swXTtcblxuICAgICAgICB0aGlzLnBsdWdpbnMgPSBbXTtcblxuICAgICAgICBhRWFjaChjb25maWcucGx1Z2lucywgZnVuY3Rpb24ocGx1Z2luQ29uZmlnKSB7XG4gICAgICAgICAgICBwbHVnaW5Db25maWcub3duZXIgPSB0aGlzLmluc3RhbmNlO1xuICAgICAgICAgICAgdmFyIHBsdWdpbkluc3RhbmNlID0gdGhpcy5jcmVhdGVQbHVnaW4ocGx1Z2luQ29uZmlnKTtcblxuICAgICAgICAgICAgdGhpcy5pbml0UGx1Z2luKHBsdWdpbkluc3RhbmNlKTtcblxuICAgICAgICAgICAgdGhpcy5wbHVnaW5zLnB1c2gocGx1Z2luSW5zdGFuY2UpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgY3JlYXRlUGx1Z2luOiBmdW5jdGlvbihjb25maWcpIHtcblxuICAgICAgICBpZiAoY29uZmlnLkNvbnN0cnVjdG9yKSB7XG4gICAgICAgICAgICAvL2NhbGwgdGhlIGNvbmZpZ2VkIENvbnN0cnVjdG9yIHdpdGggdGhlIFxuICAgICAgICAgICAgLy9wYXNzZWQgaW4gY29uZmlnIGJ1dCB0YWtlIG9mZiB0aGUgQ29uc3RydWN0b3JcbiAgICAgICAgICAgIC8vY29uZmlnLlxuICAgICAgICAgICAgIFxuICAgICAgICAgICAgLy9UaGUgcGx1Z2luIENvbnN0cnVjdG9yIFxuICAgICAgICAgICAgLy9zaG91bGQgbm90IG5lZWQgdG8ga25vdyBhYm91dCBpdHNlbGZcbiAgICAgICAgICAgIHJldHVybiBuZXcgY29uZmlnLkNvbnN0cnVjdG9yKGFwcGx5KGNvbmZpZywge1xuICAgICAgICAgICAgICAgIENvbnN0cnVjdG9yOiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vaWYgQ29uc3RydWN0b3IgcHJvcGVydHkgaXMgbm90IG9uXG4gICAgICAgIC8vdGhlIGNvbmZpZyBqdXN0IHVzZSB0aGUgZGVmYXVsdCBQbHVnaW5cbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzLmRlZmF1bHRQbHVnaW4oY29uZmlnKTtcbiAgICB9LFxuXG4gICAgaW5pdFBsdWdpbjogZnVuY3Rpb24ocGx1Z2luKSB7XG4gICAgICAgIGlmIChpcy5pc0Z1bmN0aW9uKHBsdWdpbi5pbml0KSkge1xuICAgICAgICAgICAgcGx1Z2luLmluaXQodGhpcy5pbnN0YW5jZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZGVzdHJveVBsdWdpbnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnBsdWdpbnMuZm9yRWFjaChmdW5jdGlvbihwbHVnaW4pIHtcbiAgICAgICAgICAgIGlmIChpcy5pc0Z1bmN0aW9uKHBsdWdpbi5kZXN0cm95KSkge1xuICAgICAgICAgICAgICAgIHBsdWdpbi5kZXN0cm95KHRoaXMuaW5zdGFuY2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBsdWdpbk1hbmFnZXI7Il19
;