;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
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

/**
 * @member Luc
 * @method compare
 * Simple comparison function
 */
Luc.compare = require('./compare').compare;


if(typeof window !== 'undefined') {
    window.Luc = Luc;
}
},{"./object":2,"./function":3,"./array":4,"./is":5,"./events/eventEmitter":6,"./class/base":7,"./class/definer":8,"./class/plugin":9,"./class/compositionEnumns":10,"./compare":11}],2:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
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
},{"events":12}],13:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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
},{"__browserify_process":13}],3:[function(require,module,exports){
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
},{"./is":5,"./array":4}],4:[function(require,module,exports){
var arraySlice = Array.prototype.slice,
    compare = require('./compare'),
    createCompareFn = compare.createCompareFn;
    createCompareNotFn = compare.createCompareNotFn;

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

/**
 * Remove an item from an the passed in arr
 * from the index.
 * @param  {Array} arr
 * @param  {Number} index
 * @return {Object} the item removed.
 */
function removeAtIndex(arr, index) {
    var item = arr[index];
    arr.splice(index, 1);
    return item;
}

function _removeFirst(arr, fn) {
    var removed = false;

    arr.some(function(value, index) {
        if (fn(value)) {
            removed = removeAtIndex(arr, index);
            return true;
        }
    });

    return removed;
}

/**
 * Remove the first item from the passed in Array
 * that matches the passed in object.
 * 
 * @param  {Array} arr
 * @param  {Any} object
 * @param  {Object} [config] 
 * @param {Boolean} [config.shallow] defaults to true
 * pass in false to do a direct equalty comparison
 * for Arrays Objects or Dates.
 * 
 * @return {Object} this object that was removed
 * false if no object was removed;
 */
function removeFirst(arr, obj, config) {
    var fn = createCompareFn(obj, config);
    return _removeFirst(arr, fn);
}

/**
 * Remove the first item from the passed in Array
 * that does not match the passed in object.
 * 
 * @param  {Array} arr
 * @param  {Any} object
 * @param  {Object} [config] 
 * @param {Boolean} [config.shallow] defaults to true
 * pass in false to do a direct equalty comparison
 * for Arrays Objects or Dates.
 * 
 * @return {Object} this object that was removed
 * false if no object was removed;
 */
function removeFirstNot(arr, obj, config) {
    var fn = createCompareNotFn(obj, config);
    return _removeFirst(arr, fn);
}


function _removeAll(arr, fn) {
    var indexsToRemove = [],
        removed = [];

    arr.forEach(function(value, index) {
        if (fn(value)) {
            indexsToRemove.unshift(index);
            removed.push(value);
        }
    });

    indexsToRemove.forEach(function(index){
        removeAtIndex(arr, index);
    });

    return removed.length ? removed : false;
}

/**
 * Same api as Luc.Array.removeAll except
 * remove the items that are not equal to the passed in
 * object.
 * 
 * @param  {Array} arr
 * @param  {Any} object
 * @param  {Object} [config] By default shallow compare will
 * be used for Objects and Arrays passed in true to do
 * a === comparison.
 * 
 * @return {Object[]}  An array of items removed
 * false if none are removed.
 */
function removeAllNot(arr, obj, config) {
    var fn = createCompareNotFn(obj, config);
    return _removeAll(arr, fn);
}

/**
 * Find the first all items that are equal to the
 * passed in object. By defualt Objects and Arrays are 
 * compared with a shallow comparison.
 * 
 * @param  {Array} arr
 * @param  {Any} object
 * @param  {Object} [config] 
 * @param {Boolean} [config.shallow] defaults to true
 * pass in false to do a direct equalty comparison
 * for Arrays Objects or Dates.
 * 
 * @return {Object[]}  An array of items removed
 * false if none are removed.
 */
function removeAll(arr, obj, config) {
    var fn = createCompareFn(obj, config);
    return _removeAll(arr, fn);
}

function _findFirst(arr, fn) {
    var item = false;
    arr.some(function(value, index) {
        if (fn(value)) {
            item = arr[index];
            return true;
        }
    });

    return item;
}

/**
 * Return the first item from the passed in Array
 * that  matches the passed in object.
 * 
 * @param  {Array} arr
 * @param  {Any} object
 * @param  {Object} [config] 
 * @param {Boolean} [config.shallow] defaults to true
 * pass in false to do a direct equalty comparison
 * for Arrays Objects or Dates.
 * 
 * @return {Object} this object that was removed
 * false if no object was removed;
 */
function findFirst(arr, obj, config) {
    var fn = createCompareFn(obj, config);
    return _findFirst(arr, fn);
}

/**
 * Return the first item from the passed in Array
 * that does not match the passed in object.
 * 
 * @param  {Array} arr
 * @param  {Any} object
 * @param  {Object} [config] 
 * @param {Boolean} [config.shallow] defaults to true
 * pass in false to do a direct equalty comparison
 * for Arrays Objects or Dates.
 * 
 * @return {Object} this object that was removed
 * false if no object was removed;
 */
function findFirstNot(arr, obj, config) {
    var fn = createCompareNotFn(obj, config);
    return _findFirst(arr, fn);
}

function _findAll(arr, fn) {
    var found = [];

    arr.forEach(function(value, index) {
        if (fn(value)) {
            found.push(value);
        }
    });

    return found.length ? found : false;
}

/**
 * Return all items that are equal to the
 * passed in object. By defualt Objects and Arrays are 
 * compared with a shallow comparison.
 * 
 * @param  {Array} arr
 * @param  {Any} object
 * @param  {Object} [config] 
 * @param {Boolean} [config.shallow] defaults to true
 * pass in false to do a direct equalty comparison
 * for Arrays Objects or Dates.
 * 
 * @return {Object[]}  An array of items found
 * false if none are found.
 */
function findAll(arr, obj, config) {
    var fn = createCompareFn(obj, config);
    return _findAll(arr, fn);
}

/**
 * Return all items that are not equal to the
 * passed in object. By defualt Objects and Arrays are 
 * compared with a shallow comparison.
 * 
 * @param  {Array} arr
 * @param  {Any} object
 * @param  {Object} [config] 
 * @param {Boolean} [config.shallow] defaults to true
 * pass in false to do a direct equalty comparison
 * for Arrays Objects or Dates.
 * 
 * @return {Object[]}  An array of items found
 * false if none are found.
 */
function findAllNot(arr, obj, config) {
    var fn = createCompareNotFn(obj, config);
    return _findAll(arr, fn);
}


exports.toArray = toArray;
exports.each = each;
exports.insert = insert;
exports.removeAtIndex = removeAtIndex;
exports.findFirstNot = findFirstNot;
exports.findAllNot = findAllNot;
exports.findFirst = findFirst;
exports.findAll = findAll;

exports.removeFirstNot = removeFirstNot;
exports.removeAllNot = removeAllNot;
exports.removeFirst = removeFirst;
exports.removeAll = removeAll;
},{"./compare":11}],11:[function(require,module,exports){
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
},{"./is":5}],7:[function(require,module,exports){
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
},{"./base":7,"./composition":14,"../object":2,"../array":4,"../function":3}],9:[function(require,module,exports){
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

},{"../array":4,"../object":2,"../function":3}],10:[function(require,module,exports){
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
},{"../events/eventEmitter":6,"./pluginManager":15}],14:[function(require,module,exports){
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
},{"../object":2,"../is":5}],15:[function(require,module,exports){
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
},{"./plugin":9,"../is":5,"../object":2,"../array":4}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvbHVjLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL29iamVjdC5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9pcy5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9ldmVudHMvZXZlbnRFbWl0dGVyLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2luc2VydC1tb2R1bGUtZ2xvYmFscy9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItYnVpbHRpbnMvYnVpbHRpbi9ldmVudHMuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvZnVuY3Rpb24uanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvYXJyYXkuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvY29tcGFyZS5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9jbGFzcy9iYXNlLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2NsYXNzL2RlZmluZXIuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvY2xhc3MvcGx1Z2luLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2NsYXNzL2NvbXBvc2l0aW9uRW51bW5zLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2NsYXNzL2NvbXBvc2l0aW9uLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2NsYXNzL3BsdWdpbk1hbmFnZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOVVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbFVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgTHVjID0ge307XG4vKipcbiAqIEBjbGFzcyBMdWNcbiAqIEFsaWFzZXMgZm9yIGNvbW1vbiBMdWMgbWV0aG9kcyBhbmQgcGFja2FnZXMuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gTHVjO1xuXG52YXIgb2JqZWN0ID0gcmVxdWlyZSgnLi9vYmplY3QnKTtcbkx1Yy5PYmplY3QgPSBvYmplY3Q7XG4vKipcbiAqIEBtZW1iZXIgTHVjXG4gKiBAcHJvcGVydHkgTyBMdWMuT1xuICogQWxpYXMgZm9yIEx1Yy5PYmplY3RcbiAqL1xuTHVjLk8gPSBvYmplY3Q7XG5cblxuLyoqXG4gKiBAbWVtYmVyIEx1Y1xuICogQG1ldGhvZCBhcHBseVxuICogQGluaGVyaXRkb2MgTHVjLk9iamVjdCNhcHBseVxuICovXG5MdWMuYXBwbHkgPSBMdWMuT2JqZWN0LmFwcGx5O1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjXG4gKiBAbWV0aG9kIG1peFxuICogQGluaGVyaXRkb2MgTHVjLk9iamVjdCNtaXhcbiAqL1xuTHVjLm1peCA9IEx1Yy5PYmplY3QubWl4O1xuXG5cbnZhciBmdW4gPSByZXF1aXJlKCcuL2Z1bmN0aW9uJyk7XG5MdWMuRnVuY3Rpb24gPSBmdW47XG5cbi8qKlxuICogQG1lbWJlciBMdWNcbiAqIEBwcm9wZXJ0eSBGIEx1Yy5GXG4gKiBBbGlhcyBmb3IgTHVjLkZ1bmN0aW9uXG4gKi9cbkx1Yy5GID0gZnVuO1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjXG4gKiBAbWV0aG9kIGVtcHR5Rm5cbiAqIEBpbmhlcml0ZG9jIEx1Yy5GdW5jdGlvbiNlbXB0eUZuXG4gKi9cbkx1Yy5lbXB0eUZuID0gTHVjLkZ1bmN0aW9uLmVtcHR5Rm47XG5cbi8qKlxuICogQG1lbWJlciBMdWNcbiAqIEBtZXRob2QgYWJzdHJhY3RGblxuICogQGluaGVyaXRkb2MgTHVjLkZ1bmN0aW9uI2Fic3RyYWN0Rm5cbiAqL1xuTHVjLmFic3RyYWN0Rm4gPSBMdWMuRnVuY3Rpb24uYWJzdHJhY3RGbjtcblxudmFyIGFycmF5ID0gcmVxdWlyZSgnLi9hcnJheScpO1xuTHVjLkFycmF5ID0gYXJyYXk7XG5cbi8qKlxuICogQG1lbWJlciBMdWNcbiAqIEBwcm9wZXJ0eSBBIEx1Yy5BXG4gKiBBbGlhcyBmb3IgTHVjLkFycmF5XG4gKi9cbkx1Yy5BID0gYXJyYXk7XG5cbkx1Yy5hcHBseShMdWMsIHJlcXVpcmUoJy4vaXMnKSk7XG5cbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCcuL2V2ZW50cy9ldmVudEVtaXR0ZXInKTtcblxuTHVjLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxudmFyIEJhc2UgPSByZXF1aXJlKCcuL2NsYXNzL2Jhc2UnKTtcblxuTHVjLkJhc2UgPSBCYXNlO1xuXG52YXIgRGVmaW5lciA9IHJlcXVpcmUoJy4vY2xhc3MvZGVmaW5lcicpO1xuXG5MdWMuQ2xhc3NEZWZpbmVyID0gRGVmaW5lcjtcblxuTHVjLmRlZmluZSA9IERlZmluZXIuZGVmaW5lO1xuXG5MdWMuUGx1Z2luID0gcmVxdWlyZSgnLi9jbGFzcy9wbHVnaW4nKTtcblxuTHVjLmFwcGx5KEx1Yywge1xuICAgIGNvbXBvc2l0aW9uRW51bW5zOiByZXF1aXJlKCcuL2NsYXNzL2NvbXBvc2l0aW9uRW51bW5zJylcbn0pO1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjXG4gKiBAbWV0aG9kIGNvbXBhcmVcbiAqIFNpbXBsZSBjb21wYXJpc29uIGZ1bmN0aW9uXG4gKi9cbkx1Yy5jb21wYXJlID0gcmVxdWlyZSgnLi9jb21wYXJlJykuY29tcGFyZTtcblxuXG5pZih0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgIHdpbmRvdy5MdWMgPSBMdWM7XG59IiwiLyoqXG4gKiBAY2xhc3MgTHVjLk9iamVjdFxuICogUGFja2FnZSBmb3IgT2JqZWN0IG1ldGhvZHNcbiAqL1xuXG4vKipcbiAqIEFwcGx5IHRoZSBwcm9wZXJ0aWVzIGZyb20gZnJvbU9iamVjdCB0byB0aGUgdG9PYmplY3QuICBmcm9tT2JqZWN0IHdpbGxcbiAqIG92ZXJ3cml0ZSBhbnkgc2hhcmVkIGtleXMuICBJdCBjYW4gYWxzbyBiZSB1c2VkIGFzIGEgc2ltcGxlIHNoYWxsb3cgY2xvbmUuXG4gKiBcbiAgICB2YXIgdG8gPSB7YToxLCBjOjF9LCBmcm9tID0ge2E6MiwgYjoyfVxuICAgIEx1Yy5PYmplY3QuYXBwbHkodG8sIGZyb20pXG4gICAgPk9iamVjdCB7YTogMiwgYzogMSwgYjogMn1cbiAgICB0byA9PT0gdG9cbiAgICA+dHJ1ZVxuICAgIHZhciBjbG9uZSA9IEx1Yy5PYmplY3QuYXBwbHkoe30sIGZyb20pXG4gICAgPnVuZGVmaW5lZFxuICAgIGNsb25lXG4gICAgPk9iamVjdCB7YTogMiwgYjogMn1cbiAgICBjbG9uZSA9PT0gZnJvbVxuICAgID5mYWxzZVxuICpcbiAqIEBwYXJhbSAge09iamVjdHx1bmRlZmluZWR9IHRvT2JqZWN0IE9iamVjdCB0byBwdXQgdGhlIHByb3BlcnRpZXMgZnJvbU9iamVjdCBvbi5cbiAqIEBwYXJhbSAge09iamVjdHx1bmRlZmluZWR9IGZyb21PYmplY3QgT2JqZWN0IHRvIHB1dCB0aGUgcHJvcGVydGllcyBvbiB0aGUgdG9PYmplY3RcbiAqIEByZXR1cm4ge09iamVjdH0gdGhlIHRvT2JqZWN0XG4gKi9cbmV4cG9ydHMuYXBwbHkgPSBmdW5jdGlvbih0b09iamVjdCwgZnJvbU9iamVjdCkge1xuICAgIHZhciB0byA9IHRvT2JqZWN0IHx8IHt9LFxuICAgICAgICBmcm9tID0gZnJvbU9iamVjdCB8fCB7fSxcbiAgICAgICAgcHJvcDtcblxuICAgIGZvciAocHJvcCBpbiBmcm9tKSB7XG4gICAgICAgIGlmIChmcm9tLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgICAgICB0b1twcm9wXSA9IGZyb21bcHJvcF07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdG87XG59O1xuXG4vKipcbiAqIFNpbWlsYXIgdG8gTHVjLk9iamVjdC5hcHBseSBleGNlcHQgdGhhdCB0aGUgZnJvbU9iamVjdCB3aWxsIFxuICogTk9UIG92ZXJ3cml0ZSB0aGUga2V5cyBvZiB0aGUgdG9PYmplY3QgaWYgdGhleSBhcmUgZGVmaW5lZC5cbiAqIFxuICogQHBhcmFtICB7T2JqZWN0fHVuZGVmaW5lZH0gdG9PYmplY3QgT2JqZWN0IHRvIHB1dCB0aGUgcHJvcGVydGllcyBmcm9tT2JqZWN0IG9uLlxuICogQHBhcmFtICB7T2JqZWN0fHVuZGVmaW5lZH0gZnJvbU9iamVjdCBPYmplY3QgdG8gcHV0IHRoZSBwcm9wZXJ0aWVzIG9uIHRoZSB0b09iamVjdFxuICogQHJldHVybiB7T2JqZWN0fSB0aGUgdG9PYmplY3RcbiAqL1xuZXhwb3J0cy5taXggPSBmdW5jdGlvbih0b09iamVjdCwgZnJvbU9iamVjdCkge1xuICAgIHZhciB0byA9IHRvT2JqZWN0IHx8IHt9LFxuICAgICAgICBmcm9tID0gZnJvbU9iamVjdCB8fCB7fSxcbiAgICAgICAgcHJvcDtcblxuICAgIGZvciAocHJvcCBpbiBmcm9tKSB7XG4gICAgICAgIGlmIChmcm9tLmhhc093blByb3BlcnR5KHByb3ApICYmIHRvW3Byb3BdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRvW3Byb3BdID0gZnJvbVtwcm9wXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0bztcbn07XG5cbi8qKlxuICogSXRlcmF0ZSBvdmVyIGFuIG9iamVjdHMgcHJvcGVydGllc1xuICogYXMga2V5IHZhbHVlIFwicGFpcnNcIiB3aXRoIHRoZSBwYXNzZWQgaW4gZnVuY3Rpb24uXG4gKiBcbiAgICB2YXIgY29udGV4dCA9IHt2YWw6MX07XG4gICAgTHVjLk9iamVjdC5lYWNoKHtcbiAgICAgICAga2V5OiAxXG4gICAgfSwgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICBjb25zb2xlLmxvZyh2YWx1ZSArIGtleSArIHRoaXMudmFsKVxuICAgIH0sIGNvbnRleHQpXG4gICAgXG4gICAgPjFrZXkxIFxuIFxuICogQHBhcmFtICB7T2JqZWN0fSAgIG9iaiAgdGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXJcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmbiAgIHRoZSBmdW5jdGlvbiB0byBjYWxsXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGZuLmtleSAgIHRoZSBvYmplY3Qga2V5XG4gKiBAcGFyYW0gIHtPYmplY3R9IGZuLnZhbHVlICAgdGhlIG9iamVjdCB2YWx1ZVxuICogQHBhcmFtICB7T2JqZWN0fSAgIFt0aGlzQXJnXSBcbiAqIEBwYXJhbSB7T2JqZWN0fSAgW2NvbmZpZ11cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gIGNvbmZpZy5vd25Qcm9wZXJ0aWVzIHNldCB0byBmYWxzZVxuICogdG8gaXRlcmF0ZSBvdmVyIGFsbCBvZiB0aGUgb2JqZWN0cyBlbnVtZXJhYmxlIHByb3BlcnRpZXMuXG4gKi9cbmV4cG9ydHMuZWFjaCA9IGZ1bmN0aW9uKG9iaiwgZm4sIHRoaXNBcmcsIGNvbmZpZykge1xuICAgIHZhciBrZXksIHZhbHVlLFxuICAgICAgICBhbGxQcm9wZXJ0aWVzID0gY29uZmlnICYmIGNvbmZpZy5vd25Qcm9wZXJ0aWVzID09PSBmYWxzZTtcblxuICAgIGlmIChhbGxQcm9wZXJ0aWVzKSB7XG4gICAgICAgIGZvciAoa2V5IGluIG9iaikge1xuICAgICAgICAgICAgZm4uY2FsbCh0aGlzQXJnLCBrZXksIG9ialtrZXldKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAoa2V5IGluIG9iaikge1xuICAgICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgZm4uY2FsbCh0aGlzQXJnLCBrZXksIG9ialtrZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8qKlxuICogVGFrZSBhbiBhcnJheSBvZiBzdHJpbmdzIGFuZCBhbiBhcnJheS9hcmd1bWVudHMgb2ZcbiAqIHZhbHVlcyBhbmQgcmV0dXJuIGFuIG9iamVjdCBvZiBrZXkgdmFsdWUgcGFpcnNcbiAqIGJhc2VkIG9mZiBlYWNoIGFycmF5cyBpbmRleC4gIEl0IGlzIHVzZWZ1bCBmb3IgdGFraW5nXG4gKiBhIGxvbmcgbGlzdCBvZiBhcmd1bWVudHMgYW5kIGNyZWF0aW5nIGFuIG9iamVjdCB0aGF0IGNhblxuICogYmUgcGFzc2VkIHRvIG90aGVyIG1ldGhvZHMuXG4gKiBcbiAgICBmdW5jdGlvbiBsb25nQXJncyhhLGIsYyxkLGUsZikge1xuICAgICAgICByZXR1cm4gTHVjLk9iamVjdC50b09iamVjdChbJ2EnLCdiJywgJ2MnLCAnZCcsICdlJywgJ2YnXSwgYXJndW1lbnRzKVxuICAgIH1cblxuICAgIGxvbmdBcmdzKDEsMiwzLDQsNSw2LDcsOCw5KVxuXG4gICAgPk9iamVjdCB7YTogMSwgYjogMiwgYzogMywgZDogNCwgZTogNeKApn1cbiAgICBhOiAxXG4gICAgYjogMlxuICAgIGM6IDNcbiAgICBkOiA0XG4gICAgZTogNVxuICAgIGY6IDZcblxuICAgIGxvbmdBcmdzKDEsMiwzKVxuXG4gICAgPk9iamVjdCB7YTogMSwgYjogMiwgYzogMywgZDogdW5kZWZpbmVkLCBlOiB1bmRlZmluZWTigKZ9XG4gICAgYTogMVxuICAgIGI6IDJcbiAgICBjOiAzXG4gICAgZDogdW5kZWZpbmVkXG4gICAgZTogdW5kZWZpbmVkXG4gICAgZjogdW5kZWZpbmVkXG5cbiAqIEBwYXJhbSAge1N0cmluZ1tdfSBzdHJpbmdzXG4gKiBAcGFyYW0gIHtBcnJheS9hcmd1bWVudHN9IHZhbHVlc1xuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5leHBvcnRzLnRvT2JqZWN0ID0gZnVuY3Rpb24oc3RyaW5ncywgdmFsdWVzKSB7XG4gICAgdmFyIG9iaiA9IHt9LFxuICAgICAgICBpID0gMCxcbiAgICAgICAgbGVuID0gc3RyaW5ncy5sZW5ndGg7XG4gICAgZm9yICg7IGkgPCBsZW47ICsraSkge1xuICAgICAgICBvYmpbc3RyaW5nc1tpXV0gPSB2YWx1ZXNbaV07XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iajtcbn07XG5cbi8qKlxuICogUmV0dXJuIGtleSB2YWx1ZSBwYWlycyBmcm9tIHRoZSBvYmplY3QgaWYgdGhlXG4gKiBmaWx0ZXJGbiByZXR1cm5zIGEgdHJ1dGh5IHZhbHVlLlxuICpcbiAgICBMdWMuT2JqZWN0LmZpbHRlcih7XG4gICAgICAgIGE6IGZhbHNlLFxuICAgICAgICBiOiB0cnVlLFxuICAgICAgICBjOiBmYWxzZVxuICAgIH0sIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGtleSA9PT0gJ2EnIHx8IHZhbHVlXG4gICAgfSlcbiAgICA+W3trZXk6ICdhJywgdmFsdWU6IGZhbHNlfSwge2tleTogJ2InLCB2YWx1ZTogdHJ1ZX1dXG4gKiBcbiAqIEBwYXJhbSAge09iamVjdH0gICBvYmogIHRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gZmlsdGVyRm4gICB0aGUgZnVuY3Rpb24gdG8gY2FsbCwgcmV0dXJuIGEgdHJ1dGh5IHZhbHVlXG4gKiB0byBhZGQgdGhlIGtleSB2YWx1ZSBwYWlyXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGZpbHRlckZuLmtleSAgIHRoZSBvYmplY3Qga2V5XG4gKiBAcGFyYW0gIHtPYmplY3R9IGZpbHRlckZuLnZhbHVlICAgdGhlIG9iamVjdCB2YWx1ZVxuICogQHBhcmFtICB7T2JqZWN0fSAgIFt0aGlzQXJnXSBcbiAqIEBwYXJhbSB7T2JqZWN0fSAgW2NvbmZpZ11cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gIGNvbmZpZy5vd25Qcm9wZXJ0aWVzIHNldCB0byBmYWxzZVxuICogdG8gaXRlcmF0ZSBvdmVyIGFsbCBvZiB0aGUgb2JqZWN0cyBlbnVtZXJhYmxlIHByb3BlcnRpZXMuXG4gKiBcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gIGNvbmZpZy5rZXlzIHNldCB0byB0cnVlIHRvIHJldHVyblxuICoganVzdCB0aGUga2V5cy5cbiAqXG4gKiBAcGFyYW0ge0Jvb2xlYW59ICBjb25maWcudmFsdWVzIHNldCB0byB0cnVlIHRvIHJldHVyblxuICoganVzdCB0aGUgdmFsdWVzLlxuICogXG4gKiBAcmV0dXJuIHtPYmplY3RbXS9TdHJpbmdbXX0gQXJyYXkgb2Yga2V5IHZhbHVlIHBhaXJzIGluIHRoZSBmb3JtXG4gKiBvZiB7a2V5OiAna2V5JywgdmFsdWU6IHZhbHVlfS4gIElmIGtleXMgb3IgdmFsdWVzIGlzIHRydWUgb24gdGhlIGNvbmZpZ1xuICoganVzdCB0aGUga2V5cyBvciB2YWx1ZXMgYXJlIHJldHVybi5cbiAqXG4gKi9cbmV4cG9ydHMuZmlsdGVyID0gZnVuY3Rpb24ob2JqLCBmaWx0ZXJGbiwgdGhpc0FyZywgY29uZmlnKSB7XG4gICAgdmFyIHZhbHVlcyA9IFtdO1xuXG4gICAgZXhwb3J0cy5lYWNoKG9iaiwgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICBpZiAoZmlsdGVyRm4uY2FsbCh0aGlzQXJnLCBrZXksIHZhbHVlKSkge1xuICAgICAgICAgICAgaWYgKGNvbmZpZy5rZXlzID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgdmFsdWVzLnB1c2goa2V5KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29uZmlnLnZhbHVlcyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHZhbHVlcy5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFsdWVzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIGtleToga2V5XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCB0aGlzQXJnLCBjb25maWcpO1xuXG4gICAgcmV0dXJuIHZhbHVlcztcbn07IiwidmFyIG9Ub1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbmZ1bmN0aW9uIGlzQXJyYXkob2JqKSB7XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkob2JqKTtcbn1cblxuZnVuY3Rpb24gaXNPYmplY3Qob2JqKSB7XG4gICAgcmV0dXJuIG9Ub1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IE9iamVjdF0nO1xufVxuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvVG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xufVxuXG5mdW5jdGlvbiBpc0RhdGUob2JqKSB7XG4gICAgcmV0dXJuIG9Ub1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cblxuZnVuY3Rpb24gaXNSZWdFeHAob2JqKSB7XG4gICAgcmV0dXJuIG9Ub1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IFJlZ0V4cF0nO1xufVxuXG5mdW5jdGlvbiBpc051bWJlcihvYmopIHtcbiAgICByZXR1cm4gb1RvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgTnVtYmVyXSc7XG59XG5cbmZ1bmN0aW9uIGlzU3RyaW5nKG9iaikge1xuICAgIHJldHVybiBvVG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBTdHJpbmddJztcbn1cblxuZnVuY3Rpb24gaXNGYWxzeShvYmopIHtcbiAgICByZXR1cm4gKCFvYmogJiYgb2JqICE9PSAwKTtcbn1cblxuZnVuY3Rpb24gaXNFbXB0eShvYmopIHtcbiAgICB2YXIgZW1wdHkgPSBmYWxzZTtcblxuICAgIGlmIChpc0ZhbHN5KG9iaikpIHtcbiAgICAgICAgZW1wdHkgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheShvYmopKSB7XG4gICAgICAgIGVtcHR5ID0gb2JqLmxlbmd0aCA9PT0gMDtcbiAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KG9iaikpIHtcbiAgICAgICAgZW1wdHkgPSBPYmplY3Qua2V5cyhvYmopLmxlbmd0aCA9PT0gMDtcbiAgICB9XG5cbiAgICByZXR1cm4gZW1wdHk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGlzQXJyYXk6IGlzQXJyYXksXG4gICAgaXNPYmplY3Q6IGlzT2JqZWN0LFxuICAgIGlzRnVuY3Rpb246IGlzRnVuY3Rpb24sXG4gICAgaXNEYXRlOiBpc0RhdGUsXG4gICAgaXNTdHJpbmc6IGlzU3RyaW5nLFxuICAgIGlzTnVtYmVyOiBpc051bWJlcixcbiAgICBpc1JlZ0V4cDogaXNSZWdFeHAsXG4gICAgaXNGYWxzeTogaXNGYWxzeSxcbiAgICBpc0VtcHR5OiBpc0VtcHR5XG59OyIsIi8qKlxuICogQGxpY2Vuc2UgaHR0cHM6Ly9yYXcuZ2l0aHViLmNvbS9qb3llbnQvbm9kZS92MC4xMC4xMS9MSUNFTlNFXG4gKiBOb2RlIGpzIGxpY2VuY2UuIEV2ZW50RW1pdHRlciB3aWxsIGJlIGluIHRoZSBjbGllbnRcbiAqIG9ubHkgY29kZS5cbiAqL1xuXG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyO1xuXG4vKipcbiAqIEBjbGFzcyBMdWMuRXZlbnRFbWl0dGVyXG4gKiBUaGUgd29uZGVyZnVsIGV2ZW50IGVtbWl0ZXIgdGhhdCBjb21lcyB3aXRoIG5vZGUsXG4gKiB0aGF0IHdvcmtzIGluIHRoZSBzdXBwb3J0ZWQgYnJvd3NlcnMuXG4gKiBbaHR0cDovL25vZGVqcy5vcmcvYXBpL2V2ZW50cy5odG1sXShodHRwOi8vbm9kZWpzLm9yZy9hcGkvZXZlbnRzLmh0bWwpXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgLy9wdXQgaW4gZml4IGZvciBJRSA5IGFuZCBiZWxvd1xuICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2VsZi5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcbiAgICAgICAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG5cbiAgICBzZWxmLm9uKHR5cGUsIGcpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjsiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5wcm9jZXNzLm5leHRUaWNrID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2FuU2V0SW1tZWRpYXRlID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cuc2V0SW1tZWRpYXRlO1xuICAgIHZhciBjYW5Qb3N0ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cucG9zdE1lc3NhZ2UgJiYgd2luZG93LmFkZEV2ZW50TGlzdGVuZXJcbiAgICA7XG5cbiAgICBpZiAoY2FuU2V0SW1tZWRpYXRlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gd2luZG93LnNldEltbWVkaWF0ZShmKSB9O1xuICAgIH1cblxuICAgIGlmIChjYW5Qb3N0KSB7XG4gICAgICAgIHZhciBxdWV1ZSA9IFtdO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgaWYgKGV2LnNvdXJjZSA9PT0gd2luZG93ICYmIGV2LmRhdGEgPT09ICdwcm9jZXNzLXRpY2snKSB7XG4gICAgICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgaWYgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZuID0gcXVldWUuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRydWUpO1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICAgICAgcXVldWUucHVzaChmbik7XG4gICAgICAgICAgICB3aW5kb3cucG9zdE1lc3NhZ2UoJ3Byb2Nlc3MtdGljaycsICcqJyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZm4sIDApO1xuICAgIH07XG59KSgpO1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbiIsIihmdW5jdGlvbihwcm9jZXNzKXtpZiAoIXByb2Nlc3MuRXZlbnRFbWl0dGVyKSBwcm9jZXNzLkV2ZW50RW1pdHRlciA9IGZ1bmN0aW9uICgpIHt9O1xuXG52YXIgRXZlbnRFbWl0dGVyID0gZXhwb3J0cy5FdmVudEVtaXR0ZXIgPSBwcm9jZXNzLkV2ZW50RW1pdHRlcjtcbnZhciBpc0FycmF5ID0gdHlwZW9mIEFycmF5LmlzQXJyYXkgPT09ICdmdW5jdGlvbidcbiAgICA/IEFycmF5LmlzQXJyYXlcbiAgICA6IGZ1bmN0aW9uICh4cykge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHhzKSA9PT0gJ1tvYmplY3QgQXJyYXldJ1xuICAgIH1cbjtcbmZ1bmN0aW9uIGluZGV4T2YgKHhzLCB4KSB7XG4gICAgaWYgKHhzLmluZGV4T2YpIHJldHVybiB4cy5pbmRleE9mKHgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHggPT09IHhzW2ldKSByZXR1cm4gaTtcbiAgICB9XG4gICAgcmV0dXJuIC0xO1xufVxuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuXG4vLyAxMCBsaXN0ZW5lcnMgYXJlIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2hcbi8vIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuLy9cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG52YXIgZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghdGhpcy5fZXZlbnRzKSB0aGlzLl9ldmVudHMgPSB7fTtcbiAgdGhpcy5fZXZlbnRzLm1heExpc3RlbmVycyA9IG47XG59O1xuXG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzQXJyYXkodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpXG4gICAge1xuICAgICAgaWYgKGFyZ3VtZW50c1sxXSBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGFyZ3VtZW50c1sxXTsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVuY2F1Z2h0LCB1bnNwZWNpZmllZCAnZXJyb3InIGV2ZW50LlwiKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBpZiAoIXRoaXMuX2V2ZW50cykgcmV0dXJuIGZhbHNlO1xuICB2YXIgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgaWYgKCFoYW5kbGVyKSByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKHR5cGVvZiBoYW5kbGVyID09ICdmdW5jdGlvbicpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcblxuICB9IGVsc2UgaWYgKGlzQXJyYXkoaGFuZGxlcikpIHtcbiAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG5cbiAgICB2YXIgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gbGlzdGVuZXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcblxuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcblxuLy8gRXZlbnRFbWl0dGVyIGlzIGRlZmluZWQgaW4gc3JjL25vZGVfZXZlbnRzLmNjXG4vLyBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQoKSBpcyBhbHNvIGRlZmluZWQgdGhlcmUuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCdmdW5jdGlvbicgIT09IHR5cGVvZiBsaXN0ZW5lcikge1xuICAgIHRocm93IG5ldyBFcnJvcignYWRkTGlzdGVuZXIgb25seSB0YWtlcyBpbnN0YW5jZXMgb2YgRnVuY3Rpb24nKTtcbiAgfVxuXG4gIGlmICghdGhpcy5fZXZlbnRzKSB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09IFwibmV3TGlzdGVuZXJzXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyc1wiLlxuICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKSB7XG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIH0gZWxzZSBpZiAoaXNBcnJheSh0aGlzLl9ldmVudHNbdHlwZV0pKSB7XG5cbiAgICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICAgIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgICAgdmFyIG07XG4gICAgICBpZiAodGhpcy5fZXZlbnRzLm1heExpc3RlbmVycyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG0gPSB0aGlzLl9ldmVudHMubWF4TGlzdGVuZXJzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbSA9IGRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgICB9XG5cbiAgICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICtcbiAgICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoKTtcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIH0gZWxzZSB7XG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBzZWxmLm9uKHR5cGUsIGZ1bmN0aW9uIGcoKSB7XG4gICAgc2VsZi5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcbiAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9KTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIGxpc3RlbmVyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdyZW1vdmVMaXN0ZW5lciBvbmx5IHRha2VzIGluc3RhbmNlcyBvZiBGdW5jdGlvbicpO1xuICB9XG5cbiAgLy8gZG9lcyBub3QgdXNlIGxpc3RlbmVycygpLCBzbyBubyBzaWRlIGVmZmVjdCBvZiBjcmVhdGluZyBfZXZlbnRzW3R5cGVdXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pIHJldHVybiB0aGlzO1xuXG4gIHZhciBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0FycmF5KGxpc3QpKSB7XG4gICAgdmFyIGkgPSBpbmRleE9mKGxpc3QsIGxpc3RlbmVyKTtcbiAgICBpZiAoaSA8IDApIHJldHVybiB0aGlzO1xuICAgIGxpc3Quc3BsaWNlKGksIDEpO1xuICAgIGlmIChsaXN0Lmxlbmd0aCA9PSAwKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgfSBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0gPT09IGxpc3RlbmVyKSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBkb2VzIG5vdCB1c2UgbGlzdGVuZXJzKCksIHNvIG5vIHNpZGUgZWZmZWN0IG9mIGNyZWF0aW5nIF9ldmVudHNbdHlwZV1cbiAgaWYgKHR5cGUgJiYgdGhpcy5fZXZlbnRzICYmIHRoaXMuX2V2ZW50c1t0eXBlXSkgdGhpcy5fZXZlbnRzW3R5cGVdID0gbnVsbDtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgaWYgKCF0aGlzLl9ldmVudHMpIHRoaXMuX2V2ZW50cyA9IHt9O1xuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSkgdGhpcy5fZXZlbnRzW3R5cGVdID0gW107XG4gIGlmICghaXNBcnJheSh0aGlzLl9ldmVudHNbdHlwZV0pKSB7XG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gIH1cbiAgcmV0dXJuIHRoaXMuX2V2ZW50c1t0eXBlXTtcbn07XG5cbn0pKHJlcXVpcmUoXCJfX2Jyb3dzZXJpZnlfcHJvY2Vzc1wiKSkiLCJ2YXIgaXMgPSByZXF1aXJlKCcuL2lzJyksXG4gICAgYUluc2VydCA9IHJlcXVpcmUoJy4vYXJyYXknKS5pbnNlcnQ7XG4gICAgYUVhY2ggPSByZXF1aXJlKCcuL2FycmF5JykuZWFjaDtcblxuLyoqXG4gKiBAY2xhc3MgTHVjLkZ1bmN0aW9uXG4gKiBQYWNrYWdlIGZvciBmdW5jdGlvbiBtZXRob2RzLlxuICovXG5cbmZ1bmN0aW9uIGF1Z21lbnRBcmdzKGNvbmZpZywgY2FsbEFyZ3MpIHtcbiAgICB2YXIgY29uZmlnQXJncyA9IGNvbmZpZy5hcmdzLFxuICAgICAgICBpbmRleCA9IGNvbmZpZy5pbmRleCxcbiAgICAgICAgYXJnc0FycmF5O1xuXG4gICAgaWYgKCFjb25maWdBcmdzKSB7XG4gICAgICAgIHJldHVybiBjYWxsQXJncztcbiAgICB9XG5cbiAgICBpZihpbmRleCA9PT0gdHJ1ZSB8fCBpcy5pc051bWJlcihpbmRleCkpIHtcbiAgICAgICAgaWYoY29uZmlnLmFyZ3VtZW50c0ZpcnN0ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuIGFJbnNlcnQoY29uZmlnQXJncywgY2FsbEFyZ3MsIGluZGV4KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYUluc2VydChjYWxsQXJncywgY29uZmlnQXJncywgaW5kZXgpO1xuICAgIH1cblxuICAgIHJldHVybiBjb25maWdBcmdzO1xufVxuXG4vKipcbiAqIEEgcmV1c2FibGUgZW1wdHkgZnVuY3Rpb25cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5leHBvcnRzLmVtcHR5Rm4gPSBmdW5jdGlvbigpIHt9O1xuXG4vKipcbiAqIEEgZnVuY3Rpb24gdGhhdCB0aHJvd3MgYW4gZXJyb3Igd2hlbiBjYWxsZWQuXG4gKiBVc2VmdWwgd2hlbiBkZWZpbmluZyBhYnN0cmFjdCBsaWtlIGNsYXNzZXNcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5leHBvcnRzLmFic3RyYWN0Rm4gPSBmdW5jdGlvbigpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2Fic3RyYWN0Rm4gbXVzdCBiZSBpbXBsZW1lbnRlZCcpO1xufTtcblxuLyoqXG4gKiBBZ3VtZW50IHRoZSBwYXNzZWQgaW4gZnVuY3Rpb24ncyB0aGlzQXJnIGFuZCBvciBhZ3VtZW50cyBvYmplY3QgXG4gKiBiYXNlZCBvbiB0aGUgcGFzc2VkIGluIGNvbmZpZy5cbiAqIFxuICogQHBhcmFtICB7RnVuY3Rpb259IGZuIHRoZSBmdW5jdGlvbiB0byBjYWxsXG4gKiBAcGFyYW0gIHtPYmplY3R9IGNvbmZpZ1xuICogXG4gKiBAcGFyYW0ge09iamVjdH0gW2NvbmZpZy50aGlzQXJnXSB0aGUgdGhpc0FyZyBmb3IgdGhlIGZ1bmNpdG9uIGJlaW5nIGV4ZWN1dGVkLlxuICogSWYgdGhpcyBpcyB0aGUgb25seSBwcm9wZXJ0eSBvbiB5b3VyIGNvbmZpZyBvYmplY3QgdGhlIHByZWZlcmVkIHdheSB3b3VsZFxuICogYmUganVzdCB0byB1c2UgRnVuY3Rpb24uYmluZFxuICogXG4gKiBAcGFyYW0ge0FycmF5fSBbY29uZmlnLmFyZ3NdIHRoZSBhcmd1bWVudHMgdXNlZCBmb3IgdGhlIGZ1bmN0aW9uIGJlaW5nIGV4ZWN1dGVkLlxuICogVGhpcyB3aWxsIHJlcGxhY2UgdGhlIGZ1bmN0aW9ucyBjYWxsIGFyZ3MgaWYgaW5kZXggaXMgbm90IGEgbnVtYmVyIG9yIFxuICogdHJ1ZS5cbiAqIFxuICogQHBhcmFtIHtOdW1iZXIvVHJ1ZX0gW2NvbmZpZy5pbmRleF0gQnkgZGVmdWFsdCB0aGUgdGhlIGNvbmZpZ3VyZWQgYXJndW1lbnRzXG4gKiB3aWxsIGJlIGluc2VydGVkIGludG8gdGhlIGZ1bmN0aW9ucyBwYXNzZWQgaW4gY2FsbCBhcmd1bWVudHMuICBJZiBpbmRleCBpcyB0cnVlXG4gKiBhcHBlbmQgdGhlIGFyZ3MgdG9nZXRoZXIgaWYgaXQgaXMgYSBudW1iZXIgaW5zZXJ0IGl0IGF0IHRoZSBwYXNzZWQgaW4gaW5kZXguXG4gKiBcbiAqIEBwYXJhbSB7QXJyYXl9IFtjb25maWcuYXJndW1lbnRzRmlyc3RdIHBhc3MgaW4gZmFsc2UgdG8gXG4gKiBhZ3VtZW50IHRoZSBjb25maWd1cmVkIGFyZ3MgZmlyc3Qgd2l0aCBMdWMuQXJyYXkuaW5zZXJ0LiAgRGVmYXVsdHNcbiAqIHRvIHRydWVcbiAgICAgXG4gICAgIGZ1bmN0aW9uIGZuKCkge1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzKVxuICAgICAgICBjb25zb2xlLmxvZyhhcmd1bWVudHMpXG4gICAgfVxuXG4gICAgTHVjLkZ1bmN0aW9uLmNyZWF0ZUF1Z21lbnRvcihmbiwge1xuICAgICAgICB0aGlzQXJnOiB7Y29uZmlnZWRUaGlzQXJnOiB0cnVlfSxcbiAgICAgICAgYXJnczogWzEsMiwzXSxcbiAgICAgICAgaW5kZXg6MFxuICAgIH0pKDQpXG5cbiAgICA+T2JqZWN0IHtjb25maWdlZFRoaXNBcmc6IHRydWV9XG4gICAgPlsxLCAyLCAzLCA0XVxuXG4gICAgTHVjLkZ1bmN0aW9uLmNyZWF0ZUF1Z21lbnRvcihmbiwge1xuICAgICAgICB0aGlzQXJnOiB7Y29uZmlnZWRUaGlzQXJnOiB0cnVlfSxcbiAgICAgICAgYXJnczogWzEsMiwzXSxcbiAgICAgICAgaW5kZXg6MCxcbiAgICAgICAgYXJndW1lbnRzRmlyc3Q6ZmFsc2VcbiAgICB9KSg0KVxuXG4gICAgPk9iamVjdCB7Y29uZmlnZWRUaGlzQXJnOiB0cnVlfVxuICAgID5bNCwgMSwgMiwgM11cblxuXG4gICAgdmFyIGYgPSBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudG9yKGZuLCB7XG4gICAgICAgIGFyZ3M6IFsxLDIsM10sXG4gICAgICAgIGluZGV4OiB0cnVlXG4gICAgfSk7XG5cbiAgICBmLmFwcGx5KHtjb25maWc6IGZhbHNlfSwgWzRdKVxuXG4gICAgPk9iamVjdCB7Y29uZmlnOiBmYWxzZX1cbiAgICA+WzQsIDEsIDIsIDNdXG5cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSB0aGUgYXVnbWVudGVkIGZ1bmN0aW9uLlxuICovXG5leHBvcnRzLmNyZWF0ZUF1Z21lbnRvciA9IGZ1bmN0aW9uKGZuLCBjb25maWcpIHtcbiAgICB2YXIgdGhpc0FyZyA9IGNvbmZpZy50aGlzQXJnO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpc0FyZyB8fCB0aGlzLCBhdWdtZW50QXJncyhjb25maWcsIGFyZ3VtZW50cykpO1xuICAgIH07XG59O1xuXG5mdW5jdGlvbiBpbml0U2VxdWVuY2VGdW5jdGlvbnMoZm5zLCBjb25maWcpIHtcbiAgICB2YXIgdG9SdW4gPSBbXTtcbiAgICBhRWFjaChmbnMsIGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgdmFyIGZuID0gZjtcblxuICAgICAgICBpZiAoY29uZmlnKSB7XG4gICAgICAgICAgICBmbiA9IGV4cG9ydHMuY3JlYXRlQXVnbWVudG9yKGYsIGNvbmZpZyk7XG4gICAgICAgIH1cblxuICAgICAgICB0b1J1bi5wdXNoKGZuKTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0b1J1bjtcbn1cblxuLyoqXG4gKiBSZXR1cm4gYSBmdW5jdGlvbiB0aGF0IHJ1bnMgdGhlIHBhc3NlZCBpbiBmdW5jdGlvbnNcbiAqIGFuZCByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIGxhc3QgZnVuY3Rpb24gY2FsbGVkLlxuICogXG4gKiBAcGFyYW0gIHtGdW5jdGlvbi9GdW5jdGlvbltdfSBmbnMgXG4gKiBAcGFyYW0gIHtPYmplY3R9IFtjb25maWddIENvbmZpZyBvYmplY3RcbiAqIGZvciBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudG9yLiAgSWYgZGVmaW5lZCBhbGwgb2YgdGhlIGZ1bmN0aW9uc1xuICogd2lsbCBnZXQgY3JlYXRlZCB3aXRoIHRoZSBwYXNzZWQgaW4gY29uZmlnO1xuICpcbiAgICBMdWMuRnVuY3Rpb24uY3JlYXRlU2VxdWVuY2UoW1xuICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKDEpXG4gICAgICAgIH0sXG4gICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coMilcbiAgICAgICAgfSxcbiAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygzKVxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2ZpbmlzaGVkIGxvZ2dpbmcnKVxuICAgICAgICAgICAgcmV0dXJuIDQ7XG4gICAgICAgIH1cbiAgICBdKSgpXG4gICAgPjFcbiAgICA+MlxuICAgID4zXG4gICAgPmZpbmlzaGVkIGxvZ2dpbmdcbiAgICA+NFxuICogXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZXhwb3J0cy5jcmVhdGVTZXF1ZW5jZSA9IGZ1bmN0aW9uKGZucywgY29uZmlnKSB7XG4gICAgdmFyIGZ1bmN0aW9ucyA9IGluaXRTZXF1ZW5jZUZ1bmN0aW9ucyhmbnMsIGNvbmZpZyk7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpID0gMCxcbiAgICAgICAgICAgIGxlbiA9IGZ1bmN0aW9ucy5sZW5ndGg7XG5cbiAgICAgICAgZm9yKDtpIDwgbGVuIC0xOyArK2kpIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uc1tpXS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uc1tsZW4gLTEgXS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG59O1xuXG4vKipcbiAqIFJldHVybiBhIGZ1bmN0aW9uIHRoYXQgcnVucyB0aGUgcGFzc2VkIGluIGZ1bmN0aW9uc1xuICogaWYgb25lIG9mIHRoZSBmdW5jdGlvbnMgcmVzdWx0cyBmYWxzZSB0aGUgcmVzdCBvZiB0aGUgXG4gKiBmdW5jdGlvbnMgd29uJ3QgcnVuIGFuZCBmYWxzZSB3aWxsIGJlIHJldHVybmVkLlxuICpcbiAqIElmIG5vIGZhbHNlIGlzIHJldHVybmVkIHRoZSB2YWx1ZSBvZiB0aGUgbGFzdCBmdW5jdGlvbiByZXR1cm4gd2lsbCBiZSByZXR1cm5lZFxuICogXG4gKiBAcGFyYW0gIHtGdW5jdGlvbi9GdW5jdGlvbltdfSBmbnMgXG4gKiBAcGFyYW0gIHtPYmplY3R9IFtjb25maWddIENvbmZpZyBvYmplY3RcbiAqIGZvciBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudG9yLiAgSWYgZGVmaW5lZCBhbGwgb2YgdGhlIGZ1bmN0aW9uc1xuICogd2lsbCBnZXQgY3JlYXRlZCB3aXRoIHRoZSBwYXNzZWQgaW4gY29uZmlnO1xuXG4gICAgTHVjLkZ1bmN0aW9uLmNyZWF0ZVNlcXVlbmNlSWYoW1xuICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKDEpXG4gICAgICAgIH0sXG4gICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coMilcbiAgICAgICAgfSxcbiAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygzKVxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2ZpbmlzaGVkIGxvZ2dpbmcnKVxuICAgICAgICAgICAgcmV0dXJuIDQ7XG4gICAgICAgIH0sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpIGNhbnQgbG9nJylcbiAgICAgICAgfVxuICAgIF0pKClcblxuICAgID4xXG4gICAgPjJcbiAgICA+M1xuICAgID5maW5pc2hlZCBsb2dnaW5nXG4gICAgPmZhbHNlXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZXhwb3J0cy5jcmVhdGVTZXF1ZW5jZUlmID0gZnVuY3Rpb24oZm5zLCBjb25maWcpIHtcbiAgICB2YXIgZnVuY3Rpb25zID0gaW5pdFNlcXVlbmNlRnVuY3Rpb25zKGZucywgY29uZmlnKTtcblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHZhbHVlLFxuICAgICAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcblxuICAgICAgICBmdW5jdGlvbnMuc29tZShmdW5jdGlvbihmbil7XG4gICAgICAgICAgICB2YWx1ZSA9IGZuLmFwcGx5KHRoaXMsIGFyZ3MpO1xuXG4gICAgICAgICAgICByZXR1cm4gdmFsdWUgPT09IGZhbHNlO1xuICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcbn07XG5cbi8qKlxuICogUmV0dXJuIGEgZnVuY3Rpb25zIHRoYXQgcnVucyB0aGUgcGFzc2VkIGluIGZ1bmN0aW9uc1xuICogdGhlIHJlc3VsdCBvZiBlYWNoIGZ1bmN0aW9uIHdpbGwgYmUgdGhlIHRoZSBjYWxsIGFyZ3MgXG4gKiBmb3IgdGhlIG5leHQgZnVuY3Rpb24uICBUaGUgdmFsdWUgb2YgdGhlIGxhc3QgZnVuY3Rpb24gXG4gKiByZXR1cm4gd2lsbCBiZSByZXR1cm5lZC5cbiAqIFxuICogQHBhcmFtICB7RnVuY3Rpb24vRnVuY3Rpb25bXX0gZm5zIFxuICogQHBhcmFtICB7T2JqZWN0fSBbY29uZmlnXSBDb25maWcgb2JqZWN0XG4gKiBmb3IgTHVjLkZ1bmN0aW9uLmNyZWF0ZUF1Z21lbnRvci4gIElmIGRlZmluZWQgYWxsIG9mIHRoZSBmdW5jdGlvbnNcbiAqIHdpbGwgZ2V0IGNyZWF0ZWQgd2l0aCB0aGUgcGFzc2VkIGluIGNvbmZpZztcbiAgICAgXG4gICAgIEx1Yy5GdW5jdGlvbi5jcmVhdGVSZWxheWVyKFtcbiAgICAgICAgZnVuY3Rpb24oc3RyKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RyICsgJ2InXG4gICAgICAgIH0sXG4gICAgICAgIGZ1bmN0aW9uKHN0cikge1xuICAgICAgICAgICAgcmV0dXJuIHN0ciArICdjJ1xuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbihzdHIpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHIgKyAnZCdcbiAgICAgICAgfVxuICAgIF0pKCdhJylcblxuICAgID5cImFiY2RcIlxuXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZXhwb3J0cy5jcmVhdGVSZWxheWVyID0gZnVuY3Rpb24oZm5zLCBjb25maWcpIHtcbiAgICB2YXIgZnVuY3Rpb25zID0gaW5pdFNlcXVlbmNlRnVuY3Rpb25zKGZucywgY29uZmlnKTtcblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHZhbHVlLFxuICAgICAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcblxuICAgICAgICBmdW5jdGlvbnMuZm9yRWFjaChmdW5jdGlvbihmbiwgaW5kZXgpIHtcbiAgICAgICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gZm4uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gZm4uYXBwbHkodGhpcywgW3ZhbHVlXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9O1xufTtcblxuLyoqXG4gKiBDcmVhdGUgYSB0aHJvdHRsZWQgZnVuY3Rpb24gdGhhdCB0aGUgcGFzc2VkIGluIGZ1bmNpdG9uXG4gKiBvbmx5IGdldHMgZXZva2VkIG9uY2UgZXZlbiBpdCBpcyBjYWxsZWQgbWFueSB0aW1lc1xuICpcbiAqIFxuICogQHBhcmFtICB7RnVuY3Rpb259IGZuXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IFttaWxsaXNdIE51bWJlciBvZiBtaWxsaXNlY29uZHMgdG9cbiAqIHRocm90dGxlIHRoZSBmdW5jdGlvbi5cbiAqIEBwYXJhbSAge09iamVjdH0gW2NvbmZpZ10gQ29uZmlnIG9iamVjdFxuICogZm9yIEx1Yy5GdW5jdGlvbi5jcmVhdGVBdWdtZW50b3IuICBJZiBkZWZpbmVkIGFsbCBvZiB0aGUgZnVuY3Rpb25zXG4gKiB3aWxsIGdldCBjcmVhdGVkIHdpdGggdGhlIHBhc3NlZCBpbiBjb25maWc7XG4gKiBcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5leHBvcnRzLmNyZWF0ZVRocm90dGVsZWQgPSBmdW5jdGlvbihmLCBtaWxsaXMsIGNvbmZpZykge1xuICAgIHZhciBmbiA9IGNvbmZpZyA/IGV4cG9ydHMuY3JlYXRlQXVnbWVudG9yKGYsIGNvbmZpZykgOiBmLFxuICAgICAgICB0aW1lT3V0SWQgPSBmYWxzZTtcblxuICAgIGlmKCFtaWxsaXMpIHtcbiAgICAgICAgcmV0dXJuIGZuO1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG5cbiAgICAgICAgaWYodGltZU91dElkKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZU91dElkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRpbWVPdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aW1lT3V0SWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICB9LCBtaWxsaXMpO1xuICAgIH07XG59O1xuXG4vKipcbiAqIERlZmVyIGEgZnVuY3Rpb24ncyBleGVjdXRpb24gZm9yIHRoZSBwYXNzZWQgaW5cbiAqIG1pbGxpc2Vjb25kcy5cbiAqIFxuICogQHBhcmFtICB7RnVuY3Rpb259IGZuXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IFttaWxsaXNdIE51bWJlciBvZiBtaWxsaXNlY29uZHMgdG9cbiAqIGRlZmVyXG4gKiBAcGFyYW0gIHtPYmplY3R9IFtjb25maWddIENvbmZpZyBvYmplY3RcbiAqIGZvciBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudG9yLiAgSWYgZGVmaW5lZCBhbGwgb2YgdGhlIGZ1bmN0aW9uc1xuICogd2lsbCBnZXQgY3JlYXRlZCB3aXRoIHRoZSBwYXNzZWQgaW4gY29uZmlnO1xuICogXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZXhwb3J0cy5jcmVhdGVEZWZlcnJlZCA9IGZ1bmN0aW9uKGYsIG1pbGxpcywgY29uZmlnKSB7XG4gICAgdmFyIGZuID0gY29uZmlnID8gZXhwb3J0cy5jcmVhdGVBdWdtZW50b3IoZiwgY29uZmlnKSA6IGY7XG5cbiAgICBpZighbWlsbGlzKSB7XG4gICAgICAgIHJldHVybiBmbjtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBmbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgfSwgbWlsbGlzKTtcbiAgICB9O1xufTsiLCJ2YXIgYXJyYXlTbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZSxcbiAgICBjb21wYXJlID0gcmVxdWlyZSgnLi9jb21wYXJlJyksXG4gICAgY3JlYXRlQ29tcGFyZUZuID0gY29tcGFyZS5jcmVhdGVDb21wYXJlRm47XG4gICAgY3JlYXRlQ29tcGFyZU5vdEZuID0gY29tcGFyZS5jcmVhdGVDb21wYXJlTm90Rm47XG5cbi8qKlxuICogQGNsYXNzIEx1Yy5BcnJheVxuICogUGFja2FnZSBmb3IgQXJyYXkgbWV0aG9kcy5cbiAqL1xuXG4vKipcbiAqIFR1cm4gdGhlIHBhc3NlZCBpbiBpdGVtIGludG8gYW4gYXJyYXkgaWYgaXRcbiAqIGlzbid0IG9uZSBhbHJlYWR5LCBpZiB0aGUgaXRlbSBpcyBhbiBhcnJheSBqdXN0IHJldHVybiBpdC4gIFxuICogSXQgcmV0dXJucyBhbiBlbXB0eSBhcnJheSBpZiBpdGVtIGlzIG51bGwgb3IgdW5kZWZpbmVkLlxuICogSWYgaXQgaXMganVzdCBhIHNpbmdsZSBpdGVtIHJldHVybiBhbiBhcnJheSBjb250YWluaW5nIHRoZSBpdGVtLlxuICogXG4gICAgTHVjLkFycmF5LnRvQXJyYXkoKVxuICAgID5bXVxuICAgIEx1Yy5BcnJheS50b0FycmF5KG51bGwpXG4gICAgPltdXG4gICAgTHVjLkFycmF5LnRvQXJyYXkoMSlcbiAgICA+WzFdXG4gICAgTHVjLkFycmF5LnRvQXJyYXkoWzEsMl0pXG4gICAgPlsxLCAyXVxuICpcbiAqIEBwYXJhbSAge09iamVjdH0gaXRlbSBpdGVtIHRvIHR1cm4gaW50byBhbiBhcnJheS5cbiAqIEByZXR1cm4gdGhlIGFycmF5XG4gKi9cbmZ1bmN0aW9uIHRvQXJyYXkoaXRlbSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGl0ZW0pKSB7XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgIH1cbiAgICByZXR1cm4gKGl0ZW0gPT09IG51bGwgfHwgaXRlbSA9PT0gdW5kZWZpbmVkKSA/IFtdIDogW2l0ZW1dO1xufVxuXG4vKipcbiAqIFJ1bnMgYW4gYXJyYXkuZm9yRWFjaCBhZnRlciBjYWxsaW5nIEx1Yy5BcnJheS50b0FycmF5IG9uIHRoZSBpdGVtLlxuICogQHBhcmFtICB7T2JqZWN0fSAgIGl0ZW1cbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmbiAgICAgICAgXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgY29udGV4dCAgIFxuICovXG5mdW5jdGlvbiBlYWNoKGl0ZW0sIGZuLCBjb250ZXh0KSB7XG4gICAgdmFyIGFyciA9IHRvQXJyYXkoaXRlbSk7XG4gICAgcmV0dXJuIGFyci5mb3JFYWNoLmNhbGwoYXJyLCBmbiwgY29udGV4dCk7XG59XG5cbi8qKlxuICogSW5zZXJ0IG9yIGFwcGVuZCB0aGUgc2Vjb25kIGFycmF5L2FyZ3VtZW50cyBpbnRvIHRoZVxuICogZmlyc3QgYXJyYXkvYXJndW1lbnRzLiAgVGhpcyBtZXRob2QgZG9lcyBub3QgYWx0ZXJcbiAqIHRoZSBwYXNzZWQgaW4gYXJyYXkvYXJndW1lbnRzLlxuICogXG4gKiBAcGFyYW0gIHtBcnJheS9hcmd1bWVudHN9IGZpcnN0QXJyYXlPckFyZ3NcbiAqIEBwYXJhbSAge0FycmF5L2FyZ3VtZW50c30gc2Vjb25kQXJyYXlPckFyZ3NcbiAqIEBwYXJhbSAge051bWJlci90cnVlfSBpbmRleE9yQXBwZW5kIHRydWUgdG8gYXBwZW5kIFxuICogdGhlIHNlY29uZCBhcnJheSB0byB0aGUgZW5kIG9mIHRoZSBmaXJzdCBvbmUuICBJZiBpdCBpcyBhIG51bWJlclxuICogaW5zZXJ0IHRoZSBzZWNvbmRBcnJheSBpbnRvIHRoZSBmaXJzdCBvbmUgYXQgdGhlIHBhc3NlZCBpbiBpbmRleC5cbiAgIFxuICAgIEx1Yy5BcnJheS5pbnNlcnQoWzAsNF0sIFsxLDIsM10sIDEpO1xuICAgID5bMCwgMSwgMiwgMywgNF1cbiAgICBMdWMuQXJyYXkuaW5zZXJ0KFswLDRdLCBbMSwyLDNdLCB0cnVlKTtcbiAgICA+WzAsIDQsIDEsIDIsIDNdXG4gICAgTHVjLkFycmF5Lmluc2VydChbMCw0XSwgWzEsMiwzXSwgMCk7XG4gICAgPlsxLCAyLCAzLCAwLCA0XVxuIFxuICogQHJldHVybiB7QXJyYXl9XG4gKi9cbmZ1bmN0aW9uIGluc2VydChmaXJzdEFycmF5T3JBcmdzLCBzZWNvbmRBcnJheU9yQXJncywgaW5kZXhPckFwcGVuZCkge1xuICAgIHZhciBmaXJzdEFycmF5ID0gYXJyYXlTbGljZS5jYWxsKGZpcnN0QXJyYXlPckFyZ3MpLFxuICAgICAgICBzZWNvbmRBcnJheSA9IGFycmF5U2xpY2UuY2FsbChzZWNvbmRBcnJheU9yQXJncyksXG4gICAgICAgIHNwbGljZUFyZ3MsIFxuICAgICAgICByZXR1cm5BcnJheTtcblxuICAgIGlmKGluZGV4T3JBcHBlbmQgPT09IHRydWUpIHtcbiAgICAgICAgcmV0dXJuQXJyYXkgPSBmaXJzdEFycmF5LmNvbmNhdChzZWNvbmRBcnJheSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBzcGxpY2VBcmdzID0gW2luZGV4T3JBcHBlbmQsIDBdLmNvbmNhdChzZWNvbmRBcnJheSk7XG4gICAgICAgIGZpcnN0QXJyYXkuc3BsaWNlLmFwcGx5KGZpcnN0QXJyYXksIHNwbGljZUFyZ3MpO1xuXG4gICAgICAgIHJldHVybiBmaXJzdEFycmF5O1xuICAgIH1cblxuICAgIHJldHVybiByZXR1cm5BcnJheTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgYW4gaXRlbSBmcm9tIGFuIHRoZSBwYXNzZWQgaW4gYXJyXG4gKiBmcm9tIHRoZSBpbmRleC5cbiAqIEBwYXJhbSAge0FycmF5fSBhcnJcbiAqIEBwYXJhbSAge051bWJlcn0gaW5kZXhcbiAqIEByZXR1cm4ge09iamVjdH0gdGhlIGl0ZW0gcmVtb3ZlZC5cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlQXRJbmRleChhcnIsIGluZGV4KSB7XG4gICAgdmFyIGl0ZW0gPSBhcnJbaW5kZXhdO1xuICAgIGFyci5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIHJldHVybiBpdGVtO1xufVxuXG5mdW5jdGlvbiBfcmVtb3ZlRmlyc3QoYXJyLCBmbikge1xuICAgIHZhciByZW1vdmVkID0gZmFsc2U7XG5cbiAgICBhcnIuc29tZShmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcbiAgICAgICAgaWYgKGZuKHZhbHVlKSkge1xuICAgICAgICAgICAgcmVtb3ZlZCA9IHJlbW92ZUF0SW5kZXgoYXJyLCBpbmRleCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlbW92ZWQ7XG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBmaXJzdCBpdGVtIGZyb20gdGhlIHBhc3NlZCBpbiBBcnJheVxuICogdGhhdCBtYXRjaGVzIHRoZSBwYXNzZWQgaW4gb2JqZWN0LlxuICogXG4gKiBAcGFyYW0gIHtBcnJheX0gYXJyXG4gKiBAcGFyYW0gIHtBbnl9IG9iamVjdFxuICogQHBhcmFtICB7T2JqZWN0fSBbY29uZmlnXSBcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW2NvbmZpZy5zaGFsbG93XSBkZWZhdWx0cyB0byB0cnVlXG4gKiBwYXNzIGluIGZhbHNlIHRvIGRvIGEgZGlyZWN0IGVxdWFsdHkgY29tcGFyaXNvblxuICogZm9yIEFycmF5cyBPYmplY3RzIG9yIERhdGVzLlxuICogXG4gKiBAcmV0dXJuIHtPYmplY3R9IHRoaXMgb2JqZWN0IHRoYXQgd2FzIHJlbW92ZWRcbiAqIGZhbHNlIGlmIG5vIG9iamVjdCB3YXMgcmVtb3ZlZDtcbiAqL1xuZnVuY3Rpb24gcmVtb3ZlRmlyc3QoYXJyLCBvYmosIGNvbmZpZykge1xuICAgIHZhciBmbiA9IGNyZWF0ZUNvbXBhcmVGbihvYmosIGNvbmZpZyk7XG4gICAgcmV0dXJuIF9yZW1vdmVGaXJzdChhcnIsIGZuKTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGZpcnN0IGl0ZW0gZnJvbSB0aGUgcGFzc2VkIGluIEFycmF5XG4gKiB0aGF0IGRvZXMgbm90IG1hdGNoIHRoZSBwYXNzZWQgaW4gb2JqZWN0LlxuICogXG4gKiBAcGFyYW0gIHtBcnJheX0gYXJyXG4gKiBAcGFyYW0gIHtBbnl9IG9iamVjdFxuICogQHBhcmFtICB7T2JqZWN0fSBbY29uZmlnXSBcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW2NvbmZpZy5zaGFsbG93XSBkZWZhdWx0cyB0byB0cnVlXG4gKiBwYXNzIGluIGZhbHNlIHRvIGRvIGEgZGlyZWN0IGVxdWFsdHkgY29tcGFyaXNvblxuICogZm9yIEFycmF5cyBPYmplY3RzIG9yIERhdGVzLlxuICogXG4gKiBAcmV0dXJuIHtPYmplY3R9IHRoaXMgb2JqZWN0IHRoYXQgd2FzIHJlbW92ZWRcbiAqIGZhbHNlIGlmIG5vIG9iamVjdCB3YXMgcmVtb3ZlZDtcbiAqL1xuZnVuY3Rpb24gcmVtb3ZlRmlyc3ROb3QoYXJyLCBvYmosIGNvbmZpZykge1xuICAgIHZhciBmbiA9IGNyZWF0ZUNvbXBhcmVOb3RGbihvYmosIGNvbmZpZyk7XG4gICAgcmV0dXJuIF9yZW1vdmVGaXJzdChhcnIsIGZuKTtcbn1cblxuXG5mdW5jdGlvbiBfcmVtb3ZlQWxsKGFyciwgZm4pIHtcbiAgICB2YXIgaW5kZXhzVG9SZW1vdmUgPSBbXSxcbiAgICAgICAgcmVtb3ZlZCA9IFtdO1xuXG4gICAgYXJyLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XG4gICAgICAgIGlmIChmbih2YWx1ZSkpIHtcbiAgICAgICAgICAgIGluZGV4c1RvUmVtb3ZlLnVuc2hpZnQoaW5kZXgpO1xuICAgICAgICAgICAgcmVtb3ZlZC5wdXNoKHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgaW5kZXhzVG9SZW1vdmUuZm9yRWFjaChmdW5jdGlvbihpbmRleCl7XG4gICAgICAgIHJlbW92ZUF0SW5kZXgoYXJyLCBpbmRleCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVtb3ZlZC5sZW5ndGggPyByZW1vdmVkIDogZmFsc2U7XG59XG5cbi8qKlxuICogU2FtZSBhcGkgYXMgTHVjLkFycmF5LnJlbW92ZUFsbCBleGNlcHRcbiAqIHJlbW92ZSB0aGUgaXRlbXMgdGhhdCBhcmUgbm90IGVxdWFsIHRvIHRoZSBwYXNzZWQgaW5cbiAqIG9iamVjdC5cbiAqIFxuICogQHBhcmFtICB7QXJyYXl9IGFyclxuICogQHBhcmFtICB7QW55fSBvYmplY3RcbiAqIEBwYXJhbSAge09iamVjdH0gW2NvbmZpZ10gQnkgZGVmYXVsdCBzaGFsbG93IGNvbXBhcmUgd2lsbFxuICogYmUgdXNlZCBmb3IgT2JqZWN0cyBhbmQgQXJyYXlzIHBhc3NlZCBpbiB0cnVlIHRvIGRvXG4gKiBhID09PSBjb21wYXJpc29uLlxuICogXG4gKiBAcmV0dXJuIHtPYmplY3RbXX0gIEFuIGFycmF5IG9mIGl0ZW1zIHJlbW92ZWRcbiAqIGZhbHNlIGlmIG5vbmUgYXJlIHJlbW92ZWQuXG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUFsbE5vdChhcnIsIG9iaiwgY29uZmlnKSB7XG4gICAgdmFyIGZuID0gY3JlYXRlQ29tcGFyZU5vdEZuKG9iaiwgY29uZmlnKTtcbiAgICByZXR1cm4gX3JlbW92ZUFsbChhcnIsIGZuKTtcbn1cblxuLyoqXG4gKiBGaW5kIHRoZSBmaXJzdCBhbGwgaXRlbXMgdGhhdCBhcmUgZXF1YWwgdG8gdGhlXG4gKiBwYXNzZWQgaW4gb2JqZWN0LiBCeSBkZWZ1YWx0IE9iamVjdHMgYW5kIEFycmF5cyBhcmUgXG4gKiBjb21wYXJlZCB3aXRoIGEgc2hhbGxvdyBjb21wYXJpc29uLlxuICogXG4gKiBAcGFyYW0gIHtBcnJheX0gYXJyXG4gKiBAcGFyYW0gIHtBbnl9IG9iamVjdFxuICogQHBhcmFtICB7T2JqZWN0fSBbY29uZmlnXSBcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW2NvbmZpZy5zaGFsbG93XSBkZWZhdWx0cyB0byB0cnVlXG4gKiBwYXNzIGluIGZhbHNlIHRvIGRvIGEgZGlyZWN0IGVxdWFsdHkgY29tcGFyaXNvblxuICogZm9yIEFycmF5cyBPYmplY3RzIG9yIERhdGVzLlxuICogXG4gKiBAcmV0dXJuIHtPYmplY3RbXX0gIEFuIGFycmF5IG9mIGl0ZW1zIHJlbW92ZWRcbiAqIGZhbHNlIGlmIG5vbmUgYXJlIHJlbW92ZWQuXG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUFsbChhcnIsIG9iaiwgY29uZmlnKSB7XG4gICAgdmFyIGZuID0gY3JlYXRlQ29tcGFyZUZuKG9iaiwgY29uZmlnKTtcbiAgICByZXR1cm4gX3JlbW92ZUFsbChhcnIsIGZuKTtcbn1cblxuZnVuY3Rpb24gX2ZpbmRGaXJzdChhcnIsIGZuKSB7XG4gICAgdmFyIGl0ZW0gPSBmYWxzZTtcbiAgICBhcnIuc29tZShmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcbiAgICAgICAgaWYgKGZuKHZhbHVlKSkge1xuICAgICAgICAgICAgaXRlbSA9IGFycltpbmRleF07XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGl0ZW07XG59XG5cbi8qKlxuICogUmV0dXJuIHRoZSBmaXJzdCBpdGVtIGZyb20gdGhlIHBhc3NlZCBpbiBBcnJheVxuICogdGhhdCAgbWF0Y2hlcyB0aGUgcGFzc2VkIGluIG9iamVjdC5cbiAqIFxuICogQHBhcmFtICB7QXJyYXl9IGFyclxuICogQHBhcmFtICB7QW55fSBvYmplY3RcbiAqIEBwYXJhbSAge09iamVjdH0gW2NvbmZpZ10gXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtjb25maWcuc2hhbGxvd10gZGVmYXVsdHMgdG8gdHJ1ZVxuICogcGFzcyBpbiBmYWxzZSB0byBkbyBhIGRpcmVjdCBlcXVhbHR5IGNvbXBhcmlzb25cbiAqIGZvciBBcnJheXMgT2JqZWN0cyBvciBEYXRlcy5cbiAqIFxuICogQHJldHVybiB7T2JqZWN0fSB0aGlzIG9iamVjdCB0aGF0IHdhcyByZW1vdmVkXG4gKiBmYWxzZSBpZiBubyBvYmplY3Qgd2FzIHJlbW92ZWQ7XG4gKi9cbmZ1bmN0aW9uIGZpbmRGaXJzdChhcnIsIG9iaiwgY29uZmlnKSB7XG4gICAgdmFyIGZuID0gY3JlYXRlQ29tcGFyZUZuKG9iaiwgY29uZmlnKTtcbiAgICByZXR1cm4gX2ZpbmRGaXJzdChhcnIsIGZuKTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gdGhlIGZpcnN0IGl0ZW0gZnJvbSB0aGUgcGFzc2VkIGluIEFycmF5XG4gKiB0aGF0IGRvZXMgbm90IG1hdGNoIHRoZSBwYXNzZWQgaW4gb2JqZWN0LlxuICogXG4gKiBAcGFyYW0gIHtBcnJheX0gYXJyXG4gKiBAcGFyYW0gIHtBbnl9IG9iamVjdFxuICogQHBhcmFtICB7T2JqZWN0fSBbY29uZmlnXSBcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW2NvbmZpZy5zaGFsbG93XSBkZWZhdWx0cyB0byB0cnVlXG4gKiBwYXNzIGluIGZhbHNlIHRvIGRvIGEgZGlyZWN0IGVxdWFsdHkgY29tcGFyaXNvblxuICogZm9yIEFycmF5cyBPYmplY3RzIG9yIERhdGVzLlxuICogXG4gKiBAcmV0dXJuIHtPYmplY3R9IHRoaXMgb2JqZWN0IHRoYXQgd2FzIHJlbW92ZWRcbiAqIGZhbHNlIGlmIG5vIG9iamVjdCB3YXMgcmVtb3ZlZDtcbiAqL1xuZnVuY3Rpb24gZmluZEZpcnN0Tm90KGFyciwgb2JqLCBjb25maWcpIHtcbiAgICB2YXIgZm4gPSBjcmVhdGVDb21wYXJlTm90Rm4ob2JqLCBjb25maWcpO1xuICAgIHJldHVybiBfZmluZEZpcnN0KGFyciwgZm4pO1xufVxuXG5mdW5jdGlvbiBfZmluZEFsbChhcnIsIGZuKSB7XG4gICAgdmFyIGZvdW5kID0gW107XG5cbiAgICBhcnIuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcbiAgICAgICAgaWYgKGZuKHZhbHVlKSkge1xuICAgICAgICAgICAgZm91bmQucHVzaCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBmb3VuZC5sZW5ndGggPyBmb3VuZCA6IGZhbHNlO1xufVxuXG4vKipcbiAqIFJldHVybiBhbGwgaXRlbXMgdGhhdCBhcmUgZXF1YWwgdG8gdGhlXG4gKiBwYXNzZWQgaW4gb2JqZWN0LiBCeSBkZWZ1YWx0IE9iamVjdHMgYW5kIEFycmF5cyBhcmUgXG4gKiBjb21wYXJlZCB3aXRoIGEgc2hhbGxvdyBjb21wYXJpc29uLlxuICogXG4gKiBAcGFyYW0gIHtBcnJheX0gYXJyXG4gKiBAcGFyYW0gIHtBbnl9IG9iamVjdFxuICogQHBhcmFtICB7T2JqZWN0fSBbY29uZmlnXSBcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW2NvbmZpZy5zaGFsbG93XSBkZWZhdWx0cyB0byB0cnVlXG4gKiBwYXNzIGluIGZhbHNlIHRvIGRvIGEgZGlyZWN0IGVxdWFsdHkgY29tcGFyaXNvblxuICogZm9yIEFycmF5cyBPYmplY3RzIG9yIERhdGVzLlxuICogXG4gKiBAcmV0dXJuIHtPYmplY3RbXX0gIEFuIGFycmF5IG9mIGl0ZW1zIGZvdW5kXG4gKiBmYWxzZSBpZiBub25lIGFyZSBmb3VuZC5cbiAqL1xuZnVuY3Rpb24gZmluZEFsbChhcnIsIG9iaiwgY29uZmlnKSB7XG4gICAgdmFyIGZuID0gY3JlYXRlQ29tcGFyZUZuKG9iaiwgY29uZmlnKTtcbiAgICByZXR1cm4gX2ZpbmRBbGwoYXJyLCBmbik7XG59XG5cbi8qKlxuICogUmV0dXJuIGFsbCBpdGVtcyB0aGF0IGFyZSBub3QgZXF1YWwgdG8gdGhlXG4gKiBwYXNzZWQgaW4gb2JqZWN0LiBCeSBkZWZ1YWx0IE9iamVjdHMgYW5kIEFycmF5cyBhcmUgXG4gKiBjb21wYXJlZCB3aXRoIGEgc2hhbGxvdyBjb21wYXJpc29uLlxuICogXG4gKiBAcGFyYW0gIHtBcnJheX0gYXJyXG4gKiBAcGFyYW0gIHtBbnl9IG9iamVjdFxuICogQHBhcmFtICB7T2JqZWN0fSBbY29uZmlnXSBcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW2NvbmZpZy5zaGFsbG93XSBkZWZhdWx0cyB0byB0cnVlXG4gKiBwYXNzIGluIGZhbHNlIHRvIGRvIGEgZGlyZWN0IGVxdWFsdHkgY29tcGFyaXNvblxuICogZm9yIEFycmF5cyBPYmplY3RzIG9yIERhdGVzLlxuICogXG4gKiBAcmV0dXJuIHtPYmplY3RbXX0gIEFuIGFycmF5IG9mIGl0ZW1zIGZvdW5kXG4gKiBmYWxzZSBpZiBub25lIGFyZSBmb3VuZC5cbiAqL1xuZnVuY3Rpb24gZmluZEFsbE5vdChhcnIsIG9iaiwgY29uZmlnKSB7XG4gICAgdmFyIGZuID0gY3JlYXRlQ29tcGFyZU5vdEZuKG9iaiwgY29uZmlnKTtcbiAgICByZXR1cm4gX2ZpbmRBbGwoYXJyLCBmbik7XG59XG5cblxuZXhwb3J0cy50b0FycmF5ID0gdG9BcnJheTtcbmV4cG9ydHMuZWFjaCA9IGVhY2g7XG5leHBvcnRzLmluc2VydCA9IGluc2VydDtcbmV4cG9ydHMucmVtb3ZlQXRJbmRleCA9IHJlbW92ZUF0SW5kZXg7XG5leHBvcnRzLmZpbmRGaXJzdE5vdCA9IGZpbmRGaXJzdE5vdDtcbmV4cG9ydHMuZmluZEFsbE5vdCA9IGZpbmRBbGxOb3Q7XG5leHBvcnRzLmZpbmRGaXJzdCA9IGZpbmRGaXJzdDtcbmV4cG9ydHMuZmluZEFsbCA9IGZpbmRBbGw7XG5cbmV4cG9ydHMucmVtb3ZlRmlyc3ROb3QgPSByZW1vdmVGaXJzdE5vdDtcbmV4cG9ydHMucmVtb3ZlQWxsTm90ID0gcmVtb3ZlQWxsTm90O1xuZXhwb3J0cy5yZW1vdmVGaXJzdCA9IHJlbW92ZUZpcnN0O1xuZXhwb3J0cy5yZW1vdmVBbGwgPSByZW1vdmVBbGw7IiwidmFyIGlzID0gcmVxdWlyZSgnLi9pcycpO1xuXG5mdW5jdGlvbiBzdHJpY3QodmFsMSwgdmFsMil7XG4gICAgcmV0dXJuIHZhbDEgPT09IHZhbDI7XG59XG5cbmZ1bmN0aW9uIHNoYWxsb3dBcnJheSh2YWwxLCB2YWwyKSB7XG4gICAgdmFyIGkgPSAwLFxuICAgICAgICBsZW47XG4gICAgXG4gICAgaWYoIXZhbDEgfHwgIXZhbDIgfHwgdmFsMS5sZW5ndGggIT09IHZhbDIubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IobGVuID0gdmFsMS5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgICBpZih2YWwxW2ldICE9PSB2YWwyW2ldKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gc2hhbGxvd09iamVjdCh2YWwxLCB2YWwyKSB7XG4gICAgdmFyIGtleSwgdmFsO1xuXG4gICAgaWYgKCF2YWwxIHx8ICF2YWwyIHx8IE9iamVjdC5rZXlzKHZhbDEpLmxlbmd0aCAhPT0gT2JqZWN0LmtleXModmFsMikubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IgKGtleSBpbiB2YWwxKSB7XG4gICAgICAgIGlmICh2YWwxLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsMVtrZXldO1xuICAgICAgICAgICAgaWYgKCF2YWwyLmhhc093blByb3BlcnR5KGtleSkgfHwgdmFsMltrZXldICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBkYXRlKHZhbDEsIHZhbDIpIHtcbiAgICBpZihpcy5pc0RhdGUodmFsMSkgJiYgaXMuaXNEYXRlKHZhbDIpKSB7XG4gICAgICAgIHJldHVybiB2YWwxLmdldFRpbWUoKSA9PT0gdmFsMi5nZXRUaW1lKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBfY3JlYXRlQm91bmRDb21wYXJlKG9iamVjdCwgZm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGZuKG9iamVjdCwgdmFsdWUpO1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIGdldENvbXBhcmVGbihvYmplY3QsIGMpIHtcbiAgICB2YXIgY29tcGFyZUZuID0gc3RyaWN0LFxuICAgICAgICBjb25maWcgPSBjIHx8IHt9O1xuXG4gICAgaWYgKGNvbmZpZy5zaGFsbG93ICE9PSBmYWxzZSkge1xuICAgICAgICBpZiAoaXMuaXNPYmplY3Qob2JqZWN0KSkge1xuICAgICAgICAgICAgY29tcGFyZUZuID0gc2hhbGxvd09iamVjdDtcbiAgICAgICAgfSBlbHNlIGlmIChpcy5pc0FycmF5KG9iamVjdCkpIHtcbiAgICAgICAgICAgIGNvbXBhcmVGbiA9IHNoYWxsb3dBcnJheTtcbiAgICAgICAgfSBlbHNlIGlmIChpcy5pc0RhdGUob2JqZWN0KSkge1xuICAgICAgICAgICAgY29tcGFyZUZuID0gZGF0ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBjb21wYXJlRm47XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbXBhcmVGbihvYmplY3QsIGMpIHtcbiAgICB2YXIgY29tcGFyZUZuID0gZ2V0Q29tcGFyZUZuKG9iamVjdCwgYyk7XG5cbiAgICByZXR1cm4gX2NyZWF0ZUJvdW5kQ29tcGFyZShvYmplY3QsIGNvbXBhcmVGbik7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbXBhcmVOb3RGbihvYmplY3QsIGNvbmZpZykge1xuICAgIHZhciBmbiA9IGNyZWF0ZUNvbXBhcmVGbihvYmplY3QsIGNvbmZpZyk7XG4gICAgXG4gICAgcmV0dXJuIGZ1bmN0aW9uKHZhbDEsIHZhbDIpIHtcbiAgICAgICAgcmV0dXJuICFmbih2YWwxLCB2YWwyKTtcbiAgICB9O1xufVxuXG5leHBvcnRzLmNvbXBhcmUgPSBmdW5jdGlvbih2YWwxLCB2YWwyLCBjb25maWcpIHtcbiAgICByZXR1cm4gZ2V0Q29tcGFyZUZuKHZhbDEsIGNvbmZpZykodmFsMSwgdmFsMik7XG59O1xuXG5leHBvcnRzLmNyZWF0ZUNvbXBhcmVGbiA9IGNyZWF0ZUNvbXBhcmVGbjtcbmV4cG9ydHMuY3JlYXRlQ29tcGFyZU5vdEZuID0gY3JlYXRlQ29tcGFyZU5vdEZuOyIsInZhciBlbXB0eUZuID0gcmVxdWlyZSgnLi4vZnVuY3Rpb24nKS5lbXB0eUZuLFxuICAgIGFwcGx5ID0gcmVxdWlyZSgnLi4vb2JqZWN0JykuYXBwbHk7XG5cbi8qKlxuICogQGNsYXNzIEx1Yy5CYXNlXG4gKiBTaW1wbGUgY2xhc3MgdGhhdCBieSBkZWZhdWx0IGFwcGxpZXMgdGhlIFxuICogZmlyc3QgYXJndW1lbnQgdG8gdGhlIGluc3RhbmNlIGFuZCB0aGVuIGNhbGxzXG4gKiBMdWMuQmFzZS5pbml0LlxuICpcbiAgICB2YXIgYiA9IG5ldyBMdWMuQmFzZSh7XG4gICAgICAgIGE6IDEsXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2hleScpXG4gICAgICAgIH1cbiAgICB9KVxuICAgIGIuYVxuICAgID5oZXlcbiAgICA+MVxuICovXG5mdW5jdGlvbiBCYXNlKCkge1xuICAgIHRoaXMuYmVmb3JlSW5pdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMuaW5pdCgpO1xufVxuXG5CYXNlLnByb3RvdHlwZSA9IHtcbiAgICAvKipcbiAgICAgKiBCeSBkZWZhdWx0IGFwcGx5IHRoZSBjb25maWcgdG8gdGhlIFxuICAgICAqIGluc3RhbmNlLlxuICAgICAqL1xuICAgIGJlZm9yZUluaXQ6IGZ1bmN0aW9uKGNvbmZpZykge1xuICAgICAgICBhcHBseSh0aGlzLCBjb25maWcpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQG1ldGhvZFxuICAgICAqIFNpbXBsZSBob29rIHRvIGluaXRpYWxpemVcbiAgICAgKiB0aGUgY2xhc3MuXG4gICAgICovXG4gICAgaW5pdDogZW1wdHlGblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYXNlOyIsInZhciBCYXNlID0gcmVxdWlyZSgnLi9iYXNlJyksXG4gICAgQ29tcG9zaXRpb24gPSByZXF1aXJlKCcuL2NvbXBvc2l0aW9uJyksXG4gICAgb2JqID0gcmVxdWlyZSgnLi4vb2JqZWN0JyksXG4gICAgYXJyYXlGbnMgPSByZXF1aXJlKCcuLi9hcnJheScpLFxuICAgIGVtcHR5Rm4gPSByZXF1aXJlKCcuLi9mdW5jdGlvbicpLmVtcHR5Rm4sXG4gICAgYUVhY2ggPSBhcnJheUZucy5lYWNoLFxuICAgIGFwcGx5ID0gb2JqLmFwcGx5LFxuICAgIG9FYWNoID0gb2JqLmVhY2gsXG4gICAgb0ZpbHRlciA9IG9iai5maWx0ZXIsXG4gICAgbWl4ID0gb2JqLm1peCxcbiAgICBhcnJheVNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG5mdW5jdGlvbiBDbGFzc0RlZmluZXIoKSB7fVxuXG5DbGFzc0RlZmluZXIuQ09NUE9TSVRJT05TX05BTUUgPSAnJGNvbXBvc2l0aW9ucyc7XG5cbkNsYXNzRGVmaW5lci5wcm90b3R5cGUgPSB7XG4gICAgZGVmYXVsdFR5cGU6IEJhc2UsXG5cbiAgICBwcm9jZXNzb3JLZXlzOiB7XG4gICAgICAgICRtaXhpbnM6ICdfYXBwbHlNaXhpbnMnLFxuICAgICAgICAkc3RhdGljczogJ19hcHBseVN0YXRpY3MnLFxuICAgICAgICAkY29tcG9zaXRpb25zOiAnX2NvbXBvc2UnLFxuICAgICAgICAkc3VwZXI6IHRydWVcbiAgICB9LFxuXG4gICAgZGVmaW5lOiBmdW5jdGlvbihvcHRzKSB7XG4gICAgICAgIHZhciBvcHRpb25zID0gb3B0cyB8fCB7fSxcbiAgICAgICAgICAgIC8vaWYgc3VwZXIgaXMgYSBmYWxzeSB2YWx1ZSBiZXNpZGVzIHVuZGVmaW5lZCB0aGF0IG1lYW5zIG5vIHN1cGVyY2xhc3NcbiAgICAgICAgICAgIFN1cGVyID0gb3B0aW9ucy4kc3VwZXIgfHwgKG9wdGlvbnMuJHN1cGVyID09PSB1bmRlZmluZWQgPyB0aGlzLmRlZmF1bHRUeXBlIDogZmFsc2UpLFxuICAgICAgICAgICAgQ29uc3RydWN0b3I7XG5cbiAgICAgICAgb3B0aW9ucy4kc3VwZXIgPSBTdXBlcjtcblxuICAgICAgICBDb25zdHJ1Y3RvciA9IHRoaXMuX2NyZWF0ZUNvbnN0cnVjdG9yKG9wdGlvbnMpO1xuXG4gICAgICAgIHRoaXMuX3Byb2Nlc3NBZnRlckNyZWF0ZShDb25zdHJ1Y3Rvciwgb3B0aW9ucyk7XG5cbiAgICAgICAgcmV0dXJuIENvbnN0cnVjdG9yO1xuICAgIH0sXG5cbiAgICBfY3JlYXRlQ29uc3RydWN0b3I6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHN1cGVyY2xhc3MgPSBvcHRpb25zLiRzdXBlcixcbiAgICAgICAgICAgIENvbnN0cnVjdG9yID0gdGhpcy5fY3JlYXRlQ29uc3RydWN0b3JGbihvcHRpb25zKTtcblxuICAgICAgICBpZihzdXBlcmNsYXNzKSB7XG4gICAgICAgICAgICBDb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyY2xhc3MucHJvdG90eXBlKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIENvbnN0cnVjdG9yO1xuICAgIH0sXG5cbiAgICBfY3JlYXRlQ29uc3RydWN0b3JGbjogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICB2YXIgc3VwZXJjbGFzcyA9IG9wdGlvbnMuJHN1cGVyLFxuICAgICAgICAgICAgQ29uc3RydWN0b3I7XG5cbiAgICAgICAgaWYgKHRoaXMuX2hhc0NvbnN0cnVjdG9yTW9kaWZ5aW5nT3B0aW9ucyhvcHRpb25zKSkge1xuICAgICAgICAgICAgQ29uc3RydWN0b3IgPSB0aGlzLl9jcmVhdGVDb25zdHJ1Y3RvcldpdGhNb2RpZml5aW5nT3B0aW9ucyhvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKCFzdXBlcmNsYXNzKSB7XG4gICAgICAgICAgICBDb25zdHJ1Y3RvciA9IGZ1bmN0aW9uKCkge307XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBDb25zdHJ1Y3RvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHN1cGVyY2xhc3MuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gQ29uc3RydWN0b3I7XG4gICAgfSxcblxuICAgIF9jcmVhdGVDb25zdHJ1Y3RvcldpdGhNb2RpZml5aW5nT3B0aW9uczogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICB2YXIgc3VwZXJjbGFzcyA9IG9wdGlvbnMuJHN1cGVyLFxuICAgICAgICAgICAgbWUgPSB0aGlzLFxuICAgICAgICAgICAgaW5pdEJlZm9yZVN1cGVyY2xhc3MsXG4gICAgICAgICAgICBpbml0QWZ0ZXJTdXBlcmNsYXNzLFxuICAgICAgICAgICAgaW5pdDtcblxuICAgICAgICBpZiAoIXN1cGVyY2xhc3MpIHtcbiAgICAgICAgICAgIGluaXQgPSB0aGlzLl9jcmVhdGVJbml0Q2xhc3NPcHRpb25zRm4ob3B0aW9ucywge1xuICAgICAgICAgICAgICAgIGFsbDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXJncyA9IGFycmF5U2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIGluaXQuY2FsbCh0aGlzLCBvcHRpb25zLCBhcmdzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBpbml0QmVmb3JlU3VwZXJjbGFzcyA9IHRoaXMuX2NyZWF0ZUluaXRDbGFzc09wdGlvbnNGbihvcHRpb25zLCB7XG4gICAgICAgICAgICBiZWZvcmU6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaW5pdEFmdGVyU3VwZXJjbGFzcyA9IHRoaXMuX2NyZWF0ZUluaXRDbGFzc09wdGlvbnNGbihvcHRpb25zLCB7XG4gICAgICAgICAgICBiZWZvcmU6IGZhbHNlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBhcmdzID0gYXJyYXlTbGljZS5jYWxsKGFyZ3VtZW50cyk7XG5cbiAgICAgICAgICAgIGluaXRCZWZvcmVTdXBlcmNsYXNzLmNhbGwodGhpcywgb3B0aW9ucywgYXJncyk7XG4gICAgICAgICAgICBzdXBlcmNsYXNzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICBpbml0QWZ0ZXJTdXBlcmNsYXNzLmNhbGwodGhpcywgb3B0aW9ucywgYXJncyk7XG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIF9jcmVhdGVJbml0Q2xhc3NPcHRpb25zRm46IGZ1bmN0aW9uKG9wdGlvbnMsIGNvbmZpZykge1xuICAgICAgICB2YXIgbWUgPSB0aGlzLFxuICAgICAgICAgICAgY29tcG9zaXRpb25zID0gdGhpcy5fZmlsdGVyQ29tcG9zaXRpb25zKGNvbmZpZywgb3B0aW9ucy4kY29tcG9zaXRpb25zKTtcblxuICAgICAgICBpZihjb21wb3NpdGlvbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gZW1wdHlGbjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKG9wdGlvbnMsIGluc3RhbmNlQXJncykge1xuICAgICAgICAgICAgbWUuX2luaXRDb21wb3NpdGlvbnMuY2FsbCh0aGlzLCBjb21wb3NpdGlvbnMsIGluc3RhbmNlQXJncyk7XG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIF9maWx0ZXJDb21wb3NpdGlvbnM6IGZ1bmN0aW9uKGNvbmZpZywgY29tcG9zaXRpb25zKSB7XG4gICAgICAgIHZhciBiZWZvcmUgPSBjb25maWcuYmVmb3JlLCBcbiAgICAgICAgICAgIGZpbHRlcmVkID0gW107XG5cbiAgICAgICAgaWYoY29uZmlnLmFsbCkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbXBvc2l0aW9ucztcbiAgICAgICAgfVxuXG4gICAgICAgIGFFYWNoKGNvbXBvc2l0aW9ucywgZnVuY3Rpb24oY29tcG9zaXRpb24pIHtcbiAgICAgICAgICAgIGlmKGJlZm9yZSAmJiBjb21wb3NpdGlvbi5pbml0QWZ0ZXIgIT09IHRydWUgfHwgKCFiZWZvcmUgJiYgY29tcG9zaXRpb24uaW5pdEFmdGVyID09PSB0cnVlKSkge1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZC5wdXNoKGNvbXBvc2l0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGZpbHRlcmVkO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIG9wdGlvbnMge09iamVjdH0gdGhlIGNvbXBvc2l0aW9uIGNvbmZpZyBvYmplY3RcbiAgICAgKiBpbnN0YW5jZUFyZ3Mge0FycmF5fSB0aGUgYXJndW1lbnRzIHBhc3NlZCB0byB0aGUgaW5zdGFuY2Unc1xuICAgICAqIGNvbnN0cnVjdG9yLlxuICAgICAqL1xuICAgIF9pbml0Q29tcG9zaXRpb25zOiBmdW5jdGlvbihjb21wb3NpdGlvbnMsIGluc3RhbmNlQXJncykge1xuICAgICAgICBpZighdGhpc1tDbGFzc0RlZmluZXIuQ09NUE9TSVRJT05TX05BTUVdKSB7XG4gICAgICAgICAgICB0aGlzW0NsYXNzRGVmaW5lci5DT01QT1NJVElPTlNfTkFNRV0gPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFFYWNoKGNvbXBvc2l0aW9ucywgZnVuY3Rpb24oY29tcG9zaXRpb25Db25maWcpIHtcbiAgICAgICAgICAgIHZhciBjb25maWcgPSBhcHBseSh7XG4gICAgICAgICAgICAgICAgaW5zdGFuY2U6IHRoaXMsXG4gICAgICAgICAgICAgICAgaW5zdGFuY2VBcmdzOiBpbnN0YW5jZUFyZ3NcbiAgICAgICAgICAgIH0sIGNvbXBvc2l0aW9uQ29uZmlnKSwgXG4gICAgICAgICAgICBjb21wb3NpdGlvbjtcblxuICAgICAgICAgICAgY29tcG9zaXRpb24gPSBuZXcgQ29tcG9zaXRpb24oY29uZmlnKTtcblxuICAgICAgICAgICAgdGhpc1tDbGFzc0RlZmluZXIuQ09NUE9TSVRJT05TX05BTUVdW2NvbXBvc2l0aW9uLm5hbWVdID0gY29tcG9zaXRpb24uZ2V0SW5zdGFuY2UoKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIF9oYXNDb25zdHJ1Y3Rvck1vZGlmeWluZ09wdGlvbnM6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMuJGNvbXBvc2l0aW9ucztcbiAgICB9LFxuXG4gICAgX2dldFByb2Nlc3NvcktleTogZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NvcktleXNba2V5XTtcbiAgICB9LFxuXG4gICAgX3Byb2Nlc3NBZnRlckNyZWF0ZTogZnVuY3Rpb24oJGNsYXNzLCBvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuX2FwcGx5VmFsdWVzVG9Qcm90bygkY2xhc3MsIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLl9oYW5kbGVQb3N0UHJvY2Vzc29ycygkY2xhc3MsIG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICBfYXBwbHlWYWx1ZXNUb1Byb3RvOiBmdW5jdGlvbigkY2xhc3MsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHByb3RvID0gJGNsYXNzLnByb3RvdHlwZSxcbiAgICAgICAgICAgIFN1cGVyID0gb3B0aW9ucy4kc3VwZXIsXG4gICAgICAgICAgICB2YWx1ZXMgPSBhcHBseSh7XG4gICAgICAgICAgICAgICAgJHN1cGVyY2xhc3M6IFN1cGVyLnByb3RvdHlwZSxcbiAgICAgICAgICAgICAgICAkY2xhc3M6ICRjbGFzc1xuICAgICAgICAgICAgfSwgb3B0aW9ucyk7XG5cbiAgICAgICAgLy9Eb24ndCBwdXQgdGhlIGRlZmluZSBzcGVjaWZpYyBwcm9wZXJ0aWVzXG4gICAgICAgIC8vb24gdGhlIHByb3RvdHlwZVxuICAgICAgICBvRWFjaCh2YWx1ZXMsIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fZ2V0UHJvY2Vzc29yS2V5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBwcm90b1trZXldID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICBfaGFuZGxlUG9zdFByb2Nlc3NvcnM6IGZ1bmN0aW9uKCRjbGFzcywgb3B0aW9ucykge1xuICAgICAgICBvRWFjaChvcHRpb25zLCBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgbWV0aG9kID0gdGhpcy5fZ2V0UHJvY2Vzc29yS2V5KGtleSk7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpc1ttZXRob2RdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgdGhpc1ttZXRob2RdLmNhbGwodGhpcywgJGNsYXNzLCBvcHRpb25zW2tleV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgX2FwcGx5TWl4aW5zOiBmdW5jdGlvbigkY2xhc3MsIG1peGlucykge1xuICAgICAgICB2YXIgcHJvdG8gPSAkY2xhc3MucHJvdG90eXBlO1xuICAgICAgICBhRWFjaChtaXhpbnMsIGZ1bmN0aW9uKG1peGluKSB7XG4gICAgICAgICAgICAvL2FjY2VwdCBDb25zdHJ1Y3RvcnMgb3IgT2JqZWN0c1xuICAgICAgICAgICAgdmFyIHRvTWl4ID0gbWl4aW4ucHJvdG90eXBlIHx8IG1peGluO1xuICAgICAgICAgICAgbWl4KHByb3RvLCB0b01peCk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBfYXBwbHlTdGF0aWNzOiBmdW5jdGlvbigkY2xhc3MsIHN0YXRpY3MpIHtcbiAgICAgICAgYXBwbHkoJGNsYXNzLCBzdGF0aWNzKTtcbiAgICB9LFxuXG4gICAgX2NvbXBvc2U6IGZ1bmN0aW9uKCRjbGFzcywgY29tcG9zaXRpb25zKSB7XG4gICAgICAgIHZhciBwcm90b3R5cGUgPSAkY2xhc3MucHJvdG90eXBlLFxuICAgICAgICAgICAgbWV0aG9kc1RvQ29tcG9zZTtcblxuICAgICAgICBhRWFjaChjb21wb3NpdGlvbnMsIGZ1bmN0aW9uKGNvbXBvc2l0aW9uQ29uZmlnKSB7XG4gICAgICAgICAgICB2YXIgY29tcG9zaXRpb24gPSBuZXcgQ29tcG9zaXRpb24oY29tcG9zaXRpb25Db25maWcpLFxuICAgICAgICAgICAgICAgIG5hbWUgPSBjb21wb3NpdGlvbi5uYW1lLFxuICAgICAgICAgICAgICAgIENvbnN0cnVjdG9yID0gY29tcG9zaXRpb24uQ29uc3RydWN0b3I7XG5cbiAgICAgICAgICAgIGNvbXBvc2l0aW9uLnZhbGlkYXRlKCk7XG5cbiAgICAgICAgICAgIG1ldGhvZHNUb0NvbXBvc2UgPSBjb21wb3NpdGlvbi5nZXRNZXRob2RzVG9Db21wb3NlKCk7XG5cbiAgICAgICAgICAgIG1ldGhvZHNUb0NvbXBvc2UuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgICAgICBpZiAocHJvdG90eXBlW2tleV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBwcm90b3R5cGVba2V5XSA9IHRoaXMuX2NyZWF0ZUNvbXBvc2VyUHJvdG9GbihrZXksIG5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgICAgICBwcm90b3R5cGUuZ2V0Q29tcG9zaXRpb24gPSB0aGlzLl9fZ2V0Q29tcG9zaXRpb247XG5cbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogR2V0dGVyIGZvciBjb21wb3NpdGlvbiBpbnN0YW5jZSB0aGF0IGdldHMgcHV0IG9uXG4gICAgICogdGhlIGRlZmluZWQgY2xhc3MuXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSBrZXlcbiAgICAgKi9cbiAgICBfX2dldENvbXBvc2l0aW9uOiBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbQ2xhc3NEZWZpbmVyLkNPTVBPU0lUSU9OU19OQU1FXVtrZXldO1xuICAgIH0sXG5cbiAgICBfY3JlYXRlQ29tcG9zZXJQcm90b0ZuOiBmdW5jdGlvbihtZXRob2ROYW1lLCBjb21wb3NpdGlvbk5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGNvbXAgPSB0aGlzW0NsYXNzRGVmaW5lci5DT01QT1NJVElPTlNfTkFNRV1bY29tcG9zaXRpb25OYW1lXTtcbiAgICAgICAgICAgIHJldHVybiBjb21wW21ldGhvZE5hbWVdLmFwcGx5KGNvbXAsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgfVxufTtcblxudmFyIERlZmluZXIgPSBuZXcgQ2xhc3NEZWZpbmVyKCk7XG4vL21ha2UgTHVjLmRlZmluZSBoYXBweVxuRGVmaW5lci5kZWZpbmUgPSBEZWZpbmVyLmRlZmluZS5iaW5kKERlZmluZXIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERlZmluZXI7IiwidmFyIGFFYWNoID0gcmVxdWlyZSgnLi4vYXJyYXknKS5lYWNoLFxuICAgIG9iaiA9IHJlcXVpcmUoJy4uL29iamVjdCcpLFxuICAgIGVtcHR5Rm4gPSByZXF1aXJlKCcuLi9mdW5jdGlvbicpLmVtcHR5Rm4sXG4gICAgYXBwbHkgPSBvYmouYXBwbHk7XG5cblxuZnVuY3Rpb24gUGx1Z2luKGNvbmZpZykge1xuICAgIGFwcGx5KHRoaXMsIGNvbmZpZyk7XG59XG5cblBsdWdpbi5wcm90b3R5cGUgPSB7XG4gICAgaW5pdDogZW1wdHlGbixcbiAgICBkZXN0cm95OiBlbXB0eUZuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBsdWdpbjtcbiIsInZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCcuLi9ldmVudHMvZXZlbnRFbWl0dGVyJyksXG4gICAgUGx1Z2luTWFuYWdlciA9IHJlcXVpcmUoJy4vcGx1Z2luTWFuYWdlcicpO1xuXG5tb2R1bGUuZXhwb3J0cy5FdmVudEVtaXR0ZXIgPSB7XG4gICAgQ29uc3RydWN0b3I6IEV2ZW50RW1pdHRlcixcbiAgICBuYW1lOiAnZW1pdHRlcicsXG4gICAgZmlsdGVyS2V5czogJ2FsbE1ldGhvZHMnXG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMuUGx1Z2luTWFuYWdlciA9IHtcbiAgICBuYW1lOiAncGx1Z2lucycsXG4gICAgaW5pdEFmdGVyOiB0cnVlLFxuICAgIENvbnN0cnVjdG9yOiBQbHVnaW5NYW5hZ2VyLFxuICAgIGNyZWF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtYW5hZ2VyID0gbmV3IHRoaXMuQ29uc3RydWN0b3IoKTtcbiAgICAgICAgbWFuYWdlci5pbml0KHtcbiAgICAgICAgICAgIGluc3RhbmNlOiB0aGlzLmluc3RhbmNlLFxuICAgICAgICAgICAgaW5zdGFuY2VBcmdzOiB0aGlzLmluc3RhbmNlQXJnc1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gbWFuYWdlcjtcbiAgICB9LFxuICAgIGZpbHRlcktleXM6IFsnZGVzdHJveVBsdWdpbnMnXVxufTsiLCJ2YXIgb2JqID0gcmVxdWlyZSgnLi4vb2JqZWN0JyksXG4gICAgYXBwbHkgPSBvYmouYXBwbHksXG4gICAgbWl4ID0gb2JqLm1peCxcbiAgICBvRmlsdGVyID0gb2JqLmZpbHRlcixcbiAgICBlbXB0eUZuID0gKCcuLi9mdW5jdGlvbicpLmVtcHR5Rm4sXG4gICAgaXMgPSByZXF1aXJlKCcuLi9pcycpO1xuXG4vKipcbiAqIEBjbGFzcyAgTHVjLkNvbXBvc2l0aW9uXG4gKiBAcHJvdGVjdGVkXG4gKiBjbGFzcyB0aGF0IHdyYXBzICRjb21wb3NpdGlvbiBjb25maWcgb2JqZWN0c1xuICogdG8gY29uZm9ybSB0byBhbiBhcGkuIFRoZSBjb25maWcgb2JqZWN0XG4gKiB3aWxsIG92ZXJyaWRlIGFueSBwcm90ZWN0ZWQgbWV0aG9kcyBhbmQgZGVmYXVsdCBjb25maWdzLlxuICovXG5mdW5jdGlvbiBDb21wb3NpdGlvbihjKSB7XG4gICAgdmFyIGRlZmF1bHRzID0gYy5kZWZhdWx0cyxcbiAgICAgICAgY29uZmlnID0gYztcblxuICAgIGlmKGRlZmF1bHRzKSB7XG4gICAgICAgIG1peChjb25maWcsIGNvbmZpZy5kZWZhdWx0cyk7XG4gICAgICAgIGRlbGV0ZSBjb25maWcuZGVmYXVsdHM7XG4gICAgfVxuXG4gICAgYXBwbHkodGhpcywgY29uZmlnKTtcbn1cblxuQ29tcG9zaXRpb24ucHJvdG90eXBlID0ge1xuICAgIC8qKlxuICAgICAqIEBjZmcge1N0cmluZ30gbmFtZSAocmVxdWlyZWQpIHRoZSBuYW1lXG4gICAgICovXG4gICAgXG4gICAgLyoqXG4gICAgICogQGNmZyB7RnVuY3Rpb259IENvbnN0cnVjdG9yIChyZXF1aXJlZCkgdGhlIENvbnN0cnVjdG9yXG4gICAgICogdG8gdXNlIHdoZW4gY3JlYXRpbmcgdGhlIGNvbXBvc2l0aW9uIGluc3RhbmNlLiAgVGhpc1xuICAgICAqIGlzIHJlcXVpcmVkIGlmIEx1Yy5Db21wb3NpdGlvbi5jcmVhdGUgaXMgbm90IG92ZXJyd2l0dGVuIGJ5XG4gICAgICogdGhlIHBhc3NlZCBpbiBjb21wb3NpdGlvbiBjb25maWcgb2JqZWN0LlxuICAgICAqL1xuICAgIFxuICAgIC8qKlxuICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgKiBCeSBkZWZhdWx0IGp1c3QgcmV0dXJuIGEgbmV3bHkgY3JlYXRlZCBDb25zdHJ1Y3RvciBpbnN0YW5jZS5cbiAgICAgKiBcbiAgICAgKiBXaGVuIGNyZWF0ZSBpcyBjYWxsZWQgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzIGNhbiBiZSB1c2VkIDpcbiAgICAgKiBcbiAgICAgKiB0aGlzLmluc3RhbmNlIFRoZSBpbnN0YW5jZSB0aGF0IGlzIGNyZWF0aW5nXG4gICAgICogdGhlIGNvbXBvc2l0aW9uLlxuICAgICAqIFxuICAgICAqIHRoaXMuQ29uc3RydWN0b3IgdGhlIGNvbnN0cnVjdG9yIHRoYXQgaXMgcGFzc2VkIGluIGZyb21cbiAgICAgKiB0aGUgY29tcG9zaXRpb24gY29uZmlnLiBcbiAgICAgKlxuICAgICAqIHRoaXMuaW5zdGFuY2VBcmdzIHRoZSBhcmd1bWVudHMgcGFzc2VkIGludG8gdGhlIGluc3RhbmNlIHdoZW4gaXQgXG4gICAgICogaXMgYmVpbmcgY3JlYXRlZC4gIEZvciBleGFtcGxlXG5cbiAgICAgICAgbmV3IE15Q2xhc3NXaXRoQUNvbXBvc2l0aW9uKHtwbHVnaW5zOiBbXX0pXG4gICAgICAgIC8vaW5zaWRlIG9mIHRoZSBjcmVhdGUgbWV0aG9kXG4gICAgICAgIHRoaXMuaW5zdGFuY2VBcmdzXG4gICAgICAgID5be3BsdWdpbnM6IFtdfV1cblxuICAgICAqIEByZXR1cm4ge09iamVjdH0gXG4gICAgICogdGhlIGNvbXBvc2l0aW9uIGluc3RhbmNlLlxuICAgICAqXG4gICAgICogRm9yIGV4YW1wbGUgc2V0IHRoZSBlbWl0dGVycyBtYXhMaXN0ZW5lcnNcbiAgICAgKiB0byB3aGF0IHRoZSBpbnN0YW5jZSBoYXMgY29uZmlnZWQuXG4gICAgICBcbiAgICAgICAgbWF4TGlzdGVuZXJzOiAxMDAsXG4gICAgICAgICRjb21wb3NpdGlvbnM6IHtcbiAgICAgICAgICAgIENvbnN0cnVjdG9yOiBMdWMuRXZlbnRFbWl0dGVyLFxuICAgICAgICAgICAgY3JlYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgZW1pdHRlciA9IG5ldyB0aGlzLkNvbnN0cnVjdG9yKCk7XG4gICAgICAgICAgICAgICAgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnModGhpcy5pbnN0YW5jZS5tYXhMaXN0ZW5lcnMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBlbWl0dGVyO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG5hbWU6ICdlbWl0dGVyJ1xuICAgICAgICB9XG5cbiAgICAgKi9cbiAgICBjcmVhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgQ29uc3RydWN0b3IgPSB0aGlzLkNvbnN0cnVjdG9yO1xuICAgICAgICByZXR1cm4gbmV3IENvbnN0cnVjdG9yKCk7XG4gICAgfSxcblxuICAgIGdldEluc3RhbmNlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlKCk7XG4gICAgfSxcblxuICAgIHZhbGlkYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYodGhpcy5uYW1lICA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0EgbmFtZSBtdXN0IGJlIGRlZmluZWQnKTtcbiAgICAgICAgfVxuICAgICAgICBpZighaXMuaXNGdW5jdGlvbih0aGlzLkNvbnN0cnVjdG9yKSAmJiB0aGlzLmNyZWF0ZSA9PT0gQ29tcG9zaXRpb24ucHJvdG90eXBlLmNyZWF0ZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgQ29uc3RydWN0b3IgbXVzdCBiZSBmdW5jdGlvbiBpZiBjcmVhdGUgaXMgbm90IG92ZXJyaWRlbicpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSBmaWx0ZXJGbnNcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBwcm9wZXJ0eSBmaWx0ZXJGbnMuYWxsTWV0aG9kcyByZXR1cm4gYWxsIG1ldGhvZHMgZnJvbSB0aGVcbiAgICAgKiBjb25zdHJ1Y3RvcnMgcHJvdG90eXBlXG4gICAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgICAqL1xuICAgIGZpbHRlckZuczoge1xuICAgICAgICBhbGxNZXRob2RzOiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gaXMuaXNGdW5jdGlvbih2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQGNmZyB7RnVuY3Rpb24vU3RyaW5nL0FycmF5W119IGZpbHRlcktleXNcbiAgICAgKiBUaGUga2V5cyB0byBhZGQgdG8gdGhlIGRlZmluZXJzIHByb3RvdHlwZSB0aGF0IHdpbGwgaW4gdHVybiBjYWxsXG4gICAgICogdGhlIGNvbXBvc2l0aW9ucyBtZXRob2QuXG4gICAgICogXG4gICAgICogRGVmYXVsdHMgdG8gTHVjLmVtcHR5Rm4uIFxuICAgICAqIElmIGFuIGFycmF5IGlzIHBhc3NlZCBpdCB3aWxsIGp1c3QgdXNlIHRoYXQgQXJyYXkuXG4gICAgICogXG4gICAgICogSWYgYSBzdHJpbmcgaXMgcGFzc2VkIGFuZCBtYXRjaGVzIGEgbWV0aG9kIGZyb20gXG4gICAgICogTHVjLkNvbXBvc2l0aW9uLmZpbHRlckZucyBpdCB3aWxsIGNhbGwgdGhhdCBpbnN0ZWFkLlxuICAgICAqIFxuICAgICAqIElmIGEgZnVuY3Rpb24gaXMgZGVmaW5lZCBpdFxuICAgICAqIHdpbGwgZ2V0IGNhbGxlZCB3aGlsZSBpdGVyYXRpbmcgb3ZlciBlYWNoIGtleSB2YWx1ZSBwYWlyIG9mIHRoZSBcbiAgICAgKiBDb25zdHJ1Y3RvcidzIHByb3RvdHlwZSwgaWYgYSB0cnV0aHkgdmFsdWUgaXMgXG4gICAgICogcmV0dXJuZWQgdGhlIHByb3BlcnR5IHdpbGwgYmUgYWRkZWQgdG8gdGhlIGRlZmluaW5nXG4gICAgICogY2xhc3NlcyBwcm90b3R5cGUuXG4gICAgICogXG4gICAgICogRm9yIGV4YW1wbGUgdGhpcyBjb25maWcgd2lsbCBvbmx5IGV4cG9zZSB0aGUgZW1pdCBtZXRob2QgXG4gICAgICogdG8gdGhlIGRlZmluaW5nIGNsYXNzXG4gICAgIFxuICAgICAgICAkY29tcG9zaXRpb25zOiB7XG4gICAgICAgICAgICBDb25zdHJ1Y3RvcjogTHVjLkV2ZW50RW1pdHRlcixcbiAgICAgICAgICAgIGZpbHRlcktleXM6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ga2V5ID09PSAnZW1pdCc7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbmFtZTogJ2VtaXR0ZXInXG4gICAgICAgIH1cbiAgICAgKiB0aGlzIGlzIGFsc28gYSB2YWxpZCBjb25maWdcbiAgICAgKiBcbiAgICAgICAgJGNvbXBvc2l0aW9uczoge1xuICAgICAgICAgICAgQ29uc3RydWN0b3I6IEx1Yy5FdmVudEVtaXR0ZXIsXG4gICAgICAgICAgICBmaWx0ZXJLZXlzOiBbJ2VtaXR0ZXInXSxcbiAgICAgICAgICAgIG5hbWU6ICdlbWl0dGVyJ1xuICAgICAgICB9XG4gICAgICogXG4gICAgICovXG4gICAgZmlsdGVyS2V5czogZW1wdHlGbixcblxuICAgIGdldE1ldGhvZHNUb0NvbXBvc2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZmlsdGVyS2V5cyA9IHRoaXMuZmlsdGVyS2V5cyxcbiAgICAgICAgICAgIHBhaXJzVG9BZGQsXG4gICAgICAgICAgICBmaWx0ZXJGbjtcblxuXG4gICAgICAgIGlmIChpcy5pc0FycmF5KGZpbHRlcktleXMpKSB7XG4gICAgICAgICAgICBwYWlyc1RvQWRkID0gZmlsdGVyS2V5cztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZpbHRlckZuID0gZmlsdGVyS2V5cztcblxuICAgICAgICAgICAgaWYgKGlzLmlzU3RyaW5nKGZpbHRlcktleXMpKSB7XG4gICAgICAgICAgICAgICAgZmlsdGVyRm4gPSB0aGlzLmZpbHRlckZuc1tmaWx0ZXJLZXlzXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9Db25zdHJ1Y3RvcnMgYXJlIG5vdCBuZWVkZWQgaWYgY3JlYXRlIGlzIG92ZXJ3cml0dGVuXG4gICAgICAgICAgICBwYWlyc1RvQWRkID0gb0ZpbHRlcih0aGlzLkNvbnN0cnVjdG9yICYmIHRoaXMuQ29uc3RydWN0b3IucHJvdG90eXBlLCBmaWx0ZXJGbiwgdGhpcywge1xuICAgICAgICAgICAgICAgIG93blByb3BlcnRpZXM6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGtleXM6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBhaXJzVG9BZGQ7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb21wb3NpdGlvbjsiLCJ2YXIgUGx1Z2luID0gcmVxdWlyZSgnLi9wbHVnaW4nKSxcbiAgICBpcyA9IHJlcXVpcmUoJy4uL2lzJyksXG4gICAgb2JqID0gcmVxdWlyZSgnLi4vb2JqZWN0JyksXG4gICAgYXJyID0gcmVxdWlyZSgnLi4vYXJyYXknKSxcbiAgICBhRWFjaCA9IGFyci5lYWNoLFxuICAgIG1peCA9IG9iai5taXgsXG4gICAgYXBwbHkgPSBvYmouYXBwbHk7XG5cbmZ1bmN0aW9uIFBsdWdpbk1hbmFnZXIoKSB7fVxuXG5QbHVnaW5NYW5hZ2VyLnByb3RvdHlwZSA9IHtcbiAgICBkZWZhdWx0UGx1Z2luOiBQbHVnaW4sXG5cbiAgICBpbml0OiBmdW5jdGlvbihpbnN0YW5jZVZhbHVlcykge1xuICAgICAgICBhcHBseSh0aGlzLCBpbnN0YW5jZVZhbHVlcyk7XG4gICAgICAgIHRoaXMuY3JlYXRlUGx1Z2lucygpO1xuICAgIH0sXG5cbiAgICBjcmVhdGVQbHVnaW5zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGNvbmZpZyA9IHRoaXMuaW5zdGFuY2VBcmdzWzBdO1xuXG4gICAgICAgIHRoaXMucGx1Z2lucyA9IFtdO1xuXG4gICAgICAgIGFFYWNoKGNvbmZpZy5wbHVnaW5zLCBmdW5jdGlvbihwbHVnaW5Db25maWcpIHtcbiAgICAgICAgICAgIHBsdWdpbkNvbmZpZy5vd25lciA9IHRoaXMuaW5zdGFuY2U7XG4gICAgICAgICAgICB2YXIgcGx1Z2luSW5zdGFuY2UgPSB0aGlzLmNyZWF0ZVBsdWdpbihwbHVnaW5Db25maWcpO1xuXG4gICAgICAgICAgICB0aGlzLmluaXRQbHVnaW4ocGx1Z2luSW5zdGFuY2UpO1xuXG4gICAgICAgICAgICB0aGlzLnBsdWdpbnMucHVzaChwbHVnaW5JbnN0YW5jZSk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICBjcmVhdGVQbHVnaW46IGZ1bmN0aW9uKGNvbmZpZykge1xuXG4gICAgICAgIGlmIChjb25maWcuQ29uc3RydWN0b3IpIHtcbiAgICAgICAgICAgIC8vY2FsbCB0aGUgY29uZmlnZWQgQ29uc3RydWN0b3Igd2l0aCB0aGUgXG4gICAgICAgICAgICAvL3Bhc3NlZCBpbiBjb25maWcgYnV0IHRha2Ugb2ZmIHRoZSBDb25zdHJ1Y3RvclxuICAgICAgICAgICAgLy9jb25maWcuXG4gICAgICAgICAgICAgXG4gICAgICAgICAgICAvL1RoZSBwbHVnaW4gQ29uc3RydWN0b3IgXG4gICAgICAgICAgICAvL3Nob3VsZCBub3QgbmVlZCB0byBrbm93IGFib3V0IGl0c2VsZlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBjb25maWcuQ29uc3RydWN0b3IoYXBwbHkoY29uZmlnLCB7XG4gICAgICAgICAgICAgICAgQ29uc3RydWN0b3I6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9pZiBDb25zdHJ1Y3RvciBwcm9wZXJ0eSBpcyBub3Qgb25cbiAgICAgICAgLy90aGUgY29uZmlnIGp1c3QgdXNlIHRoZSBkZWZhdWx0IFBsdWdpblxuICAgICAgICByZXR1cm4gbmV3IHRoaXMuZGVmYXVsdFBsdWdpbihjb25maWcpO1xuICAgIH0sXG5cbiAgICBpbml0UGx1Z2luOiBmdW5jdGlvbihwbHVnaW4pIHtcbiAgICAgICAgaWYgKGlzLmlzRnVuY3Rpb24ocGx1Z2luLmluaXQpKSB7XG4gICAgICAgICAgICBwbHVnaW4uaW5pdCh0aGlzLmluc3RhbmNlKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBkZXN0cm95UGx1Z2luczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMucGx1Z2lucy5mb3JFYWNoKGZ1bmN0aW9uKHBsdWdpbikge1xuICAgICAgICAgICAgaWYgKGlzLmlzRnVuY3Rpb24ocGx1Z2luLmRlc3Ryb3kpKSB7XG4gICAgICAgICAgICAgICAgcGx1Z2luLmRlc3Ryb3kodGhpcy5pbnN0YW5jZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUGx1Z2luTWFuYWdlcjsiXX0=
;