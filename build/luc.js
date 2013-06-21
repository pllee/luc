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
 * just the keys or values are returned.
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
/**
 * @class Luc.is 
 * Package for determining the types of objects
 * it also has an Luc.is.isEmpty and Luc.is.isFalsy 
 * functions.
 */


/**
 * Return true if the passed in object is of
 * the type {@link Array Array}
 * @param  {Object}  obj 
 * @return {Boolean}
 */
function isArray(obj) {
    return Array.isArray(obj);
}

/**
 * Return true if the passed in object is of
 * the type {@link Object Object}
 * @param  {Object}  obj 
 * @return {Boolean}
 */
function isObject(obj) {
    return oToString.call(obj) === '[object Object]';
}

/**
 * Return true if the passed in object is of
 * the type {@link Function Function}
 * @param  {Object}  obj 
 * @return {Boolean}
 */
function isFunction(obj) {
    return oToString.call(obj) === '[object Function]';
}

/**
 * Return true if the passed in object is of
 * the type {@link Date Date}
 * @param  {Object}  obj 
 * @return {Boolean}
 */
function isDate(obj) {
    return oToString.call(obj) === '[object Date]';
}

/**
 * Return true if the passed in object is of
 * the type {@link RegExp RegExp}
 * @param  {Object}  obj 
 * @return {Boolean}
 */
function isRegExp(obj) {
    return oToString.call(obj) === '[object RegExp]';
}

/**
 * Return true if the passed in object is of
 * the type {@link Number Number}
 * @param  {Object}  obj 
 * @return {Boolean}
 */
function isNumber(obj) {
    return oToString.call(obj) === '[object Number]';
}

/**
 * Return true if the passed in object is of
 * the type {@link String String}
 * @param  {Object}  obj 
 * @return {Boolean}
 */
function isString(obj) {
    return oToString.call(obj) === '[object String]';
}

/**
 * Return true if the passed in object is of
 * the type {@link Boolean Boolean}
 * @param  {Object}  obj 
 * @return {Boolean}
 */
function isBoolean(obj) {
    return oToString.call(obj) === '[object Boolean]';
}

/**
 * Return true if the object is falsy but not 0.
 * @param  {Object}  obj
 * @return {Boolean}     
 */
function isFalsy(obj) {
    return (!obj && obj !== 0);
}

/**
 * Return true if the object is empty.
 * {}, [], '',false, null, undefined, NaN 
 * Are all treated as empty.
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
    isBoolean: isBoolean,
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
    is = require('./is'),
    createBoundCompareFn = compare.createBoundCompareFn;

function _createIteratorFn(fn, config) {
    if(is.isFunction(fn) && (config ? config.type !== 'strict' : true)) {
        return config ? fn.bind(config) : fn;
    }

    return createBoundCompareFn(fn, config);
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
 * There a lot of functions in this package but all of the
 * remove\* / find\* methods follow the same api.  \*All functions will return an array of removed or found
 * items and false if none are found.  The items will be added to the array in the order they are
 * found.  \*First functions will return the first item and stop iterating after that, if none
 *  is found false is returned.  remove\* functions will directly change the passed in array.
 *  \*Not functions only do the following actions if the comparison is not true.
 *  All remove\* / find\* take the following api: array, objectToCompareOrIterator, compareConfigOrThisArg for example:
 *
    Luc.Array.findFirst([1,2,3, {}], {});
    >Object {}

    Luc.Array.findFirst([1,2,3,{}], {}, {type: 'strict'});
    >false

    Luc.Array.findFirst([1,2,3,{}], function(val, index, array){
        return val === 3 || this.num === val;
    }, {num: 1});
    >1
  
 * There also many find\*Object, remove\*Object methods they all just take an array as
 * the only parameter and follow the same find\*, remove\* counterparts.  Every public
 * method of Luc.is available it uses the following grammer Luc.Array["methodName""isMethodName"]
 *
      Luc.Array.findAllNotEmpty([false, true, null, undefined, 0, '', [], [1]])
      > [true, 0, [1]]

      Luc.Array.findAllNotFalsy([false, true, null, undefined, 0, '', [], [1]])
      > [true, 0, [], [1]]

      Luc.Array.findFirstString([1,2,3,'5'])
      >"5"
      Luc.Array.findFirstNotString([1,2,3,'5'])
      >1
      var arr = [1,2,3,'5'];
      Luc.Array.removeAllNotString(arr);
      >[1,2,3]
      arr
      >["5"]
 *
 *
 * Keep in mind that Luc is optionally packaged with es5 shim so you can target non-es5 browsers.
 * It comes with your favorite {@link Array Array} methods such as Array.forEach, Array.filter, Array.some, Array.every Array.reduceRight ..
 *
 * Also don't forget about Luc.Array.each and Luc.Array.toArray, they are great utility methods
 * that are used all over the framework.
 * 
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
 * Runs an Array.forEach after calling Luc.Array.toArray on the item.
 * @param  {Object}   item
 * @param  {Function} fn        
 * @param  {Object}   context   
 *
  It is very useful for setting up flexable api's that can handle none one or many.

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
        if (fn.apply(this, arguments)) {
            removed = removeAtIndex(arr, index);
            return true;
        }
    });

    return removed;
}

/**
 * Remove the first item from the passed in array
 * that matches the passed in object.  Instead of 
 * comparing an object an iterator function can be
 * used.
 * 
 * @param  {Array} arr
 * @param  {Any/Function} objectOrIterator if the value
 * is {@link Luc#compare equal} to or the iterator returns true remove the 
 * object from the array.
 * 
 * If an iterator function is passed it will be called with the following 
 * parameters.  The same parameter to Array.forEach
 * 
 * @param {Object} objectOrIterator.value 
 * @param {Number} objectOrIterator.number
 * @param {Array} objectOrIterator.array
 *
 * 
 * @param  {Object} [configOrthisArg]
 * 
 * thisArg for the iterator function an iterator is
 * used.
 * 
 * Option config object for Luc.compare if an iterator
 * function is not passed in.  If you want to actually
 * do a direct equality comparison on a function instead of
 * using it as an iterator pass in {type: 'strict'}
 * 
 * @return {Object} the object that was removed
 * false if no object was removed;
 */
function removeFirst(arr, obj, config) {
    var fn = _createIteratorFn(obj, config);
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
 * for Arrays Objects or Falsys.
 * 
 * @return {Object} this object that was removed
 * false if no object was removed;
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
    var fn = _createIteratorNotFn(obj, config);
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
 * for Arrays Objects or Falsys.
 * 
 * @return {Object[]}  An array of items removed
 * false if none are removed.
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
 * Return the first item from the passed in Array
 * that  matches the passed in object.
 * 
 * @param  {Array} arr
 * @param  {Any} object
 * @param  {Object} [config] 
 * @param {Boolean} [config.shallow] defaults to true
 * pass in false to do a direct equalty comparison
 * for Arrays Objects or Falsys.
 * 
 * @return {Object} this object that was removed
 * false if no object was removed;
 */
function findFirst(arr, obj, config) {
    var fn = _createIteratorFn(obj, config);
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
 * for Arrays Objects or Falsys.
 * 
 * @return {Object} this object that was removed
 * false if no object was removed;
 */
function findFirstNot(arr, obj, config) {
    var fn = _createIteratorNotFn(obj, config);
    return _findFirst(arr, fn);
}

function _findAll(arr, fn) {
    var found = arr.filter(fn);
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
 * for Arrays Objects or Falsys.
 * 
 * @return {Object[]}  An array of items found
 * false if none are found.
 */
function findAll(arr, obj, config) {
    var fn = _createIteratorFn(obj, config);
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
 * for Arrays Objects or Falsys.
 * 
 * @return {Object[]}  An array of items found
 * false if none are found.
 */
function findAllNot(arr, obj, config) {
    var fn = _createIteratorNotFn(obj, config);
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

(function() {
    var namesToIs = ['findFirstNot', 'findAllNot', 'findFirst', 'findAll',
                     'removeFirstNot', 'removeAllNot', 'removeFirst', 'removeAll'];

    function _createIsFn(fnName, key) {
        return function(arr) {
            return exports[fnName](arr, is[key]);
        };
    }

    Object.keys(is).forEach(function(key) {
        var name = key.split('is')[1];
        namesToIs.forEach(function(fnName) {
            exports[fnName + name] = _createIsFn(fnName,key);
        });
    });
}());

/**
 * @member Luc.Array
 * @method findFirstNotBoolean
 * Return the first item that is not of the associated type.
 * @param {Array} arr
 *
 * @return {Object} the object if it was found, false if it was 
 * not found.
 */
/**
 * @member Luc.Array
 * @method findFirstBoolean
 * Return the first item that is of the associated type.
 * @param {Array} arr
 *
 * @return {Object} the object if it was found, false if it was 
 * not found.
 */
/**
 * @member Luc.Array
 * @method findAllNotBoolean
 * Return all the items that are not of the associated type.
 * @param {Array} arr
 *
 * @return {Any[]} the array of objects found, false if it was 
 * not found.
 */

/**
 * @member Luc.Array
 * @method findFirstNotObject
 * @inheritdoc Luc.Array#findFirstNotBoolean
 */
/**
 * @member Luc.Array
 * @method findFirstObject
 * @inheritdoc Luc.Array#findFirstBoolean
 */
/**
 * @member Luc.Array
 * @method findAllNotObject
 * @inheritdoc Luc.Array#findAllNotBoolean
 */
/**
 * @member Luc.Array
 * @method findAllObject
 * @inheritdoc Luc.Array#findAllBoolean
 */

/**
 * @member Luc.Array
 * @method findFirstNotFunction
 * @inheritdoc Luc.Array#findFirstNotBoolean
 */
/**
 * @member Luc.Array
 * @method findFirstFunction
 * @inheritdoc Luc.Array#findFirstBoolean
 */
/**
 * @member Luc.Array
 * @method findAllNotFunction
 * @inheritdoc Luc.Array#findAllNotBoolean
 */
/**
 * @member Luc.Array
 * @method findAllFunction
 * @inheritdoc Luc.Array#findAllBoolean
 */

/**
 * @member Luc.Array
 * @method findFirstNotString
 * @inheritdoc Luc.Array#findFirstNotBoolean
 */
/**
 * @member Luc.Array
 * @method findFirstString
 * @inheritdoc Luc.Array#findFirstBoolean
 */
/**
 * @member Luc.Array
 * @method findAllNotString
 * @inheritdoc Luc.Array#findAllNotBoolean
 */
/**
 * @member Luc.Array
 * @method findAllString
 * @inheritdoc Luc.Array#findAllBoolean
 */
/**
 * @member Luc.Array
 * @method findFirstNotString
 * @inheritdoc Luc.Array#findFirstNotBoolean
 */
/**
 * @member Luc.Array
 * @method findFirstString
 * @inheritdoc Luc.Array#findFirstBoolean
 */
/**
 * @member Luc.Array
 * @method findAllNotString
 * @inheritdoc Luc.Array#findAllNotBoolean
 */
/**
 * @member Luc.Array
 * @method findAllString
 * @inheritdoc Luc.Array#findAllBoolean
 */
/**
 * @member Luc.Array
 * @method findFirstNotRegExp
 * @inheritdoc Luc.Array#findFirstNotBoolean
 */
/**
 * @member Luc.Array
 * @method findFirstRegExp
 * @inheritdoc Luc.Array#findFirstBoolean
 */
/**
 * @member Luc.Array
 * @method findAllNotRegExp
 * @inheritdoc Luc.Array#findAllNotBoolean
 */
/**
 * @member Luc.Array
 * @method findAllRegExp
 * @inheritdoc Luc.Array#findAllBoolean
 */
/**
 * @member Luc.Array
 * @method findFirstNotDate
 * @inheritdoc Luc.Array#findFirstNotBoolean
 */
/**
 * @member Luc.Array
 * @method findFirstDate
 * @inheritdoc Luc.Array#findFirstBoolean
 */
/**
 * @member Luc.Array
 * @method findAllNotDate
 * @inheritdoc Luc.Array#findAllNotBoolean
 */
/**
 * @member Luc.Array
 * @method findAllDate
 * @inheritdoc Luc.Array#findAllBoolean
 */


},{"./compare":11,"./is":5}],11:[function(require,module,exports){
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

function _deepArray(val1, val2) {
    var i = 0,
        len;
    
    if(!_compareArrayLength(val1, val2)) {
        return false;
    }

    for(len = val1.length; i < len; ++i) {
        if(!compare(val1[i],val2[i], {type: 'deep'})) {
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

function _deepObject(val1, val2) {
    var key, val;

    if (!_compareObjectKeysLength(val1, val2)) {
        return false;
    }

    for (key in val1) {
        if (val1.hasOwnProperty(key)) {
            value = val1[key];
            if (!val2.hasOwnProperty(key) || compare(value, val2[key], {type: 'deep'}) !== true) {
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
        config = c || {};

    if (config.type === 'shallow' || config.type === undefined) {
        if (is.isObject(object)) {
            compareFn = _shallowObject;
        } else if (is.isArray(object)) {
            compareFn = _shallowArray;
        } else if (is.isDate(object)) {
            compareFn = _date;
        }
    }
    else if(config.type === 'deep') {
        if (is.isObject(object)) {
            compareFn = _deepObject;
        } else if (is.isArray(object)) {
            compareFn = _deepArray;
        } else if (is.isDate(object)) {
            compareFn = _date;
        }
    }
    else if(config.type !== 'strict') {
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
 * other.  By default a shallow comparison is 
 * done on arrays, dates and objects and a strict comparison
 * is done on other types.
 * 
 * @param  {Any} val1  
 * @param  {Any} val2   
 * @param  {Object} [config]
 * @param {String} config.type pass in 'deep' for a deep
 * comparison, 'shallow' (default) for a shallow comparison
 * or 'strict' for a strict === comparison for all objects.
 *
 *
    Luc.compare('1', 1)
    >false
    Luc.compare({a: 1}, {a: 1})
    >true
    Luc.compare({a: 1, b: {}}, {a: 1, b: {} })
    >false
    Luc.compare({a: 1, b: {}}, {a: 1, b: {} }, {type: 'deep'})
    >true
    Luc.compare({a: 1, b: {}}, {a: 1, b: {} }, {type: 'strict'})
    >false
 * @return {Boolean}
 */
function compare(val1, val2, config) {
    return getCompareFn(val1, config)(val1, val2);
}


function createBoundCompareFn(object, c) {
    var compareFn = getCompareFn(object, c);

    return _createBoundCompare(object, compareFn);
}

exports.compare = compare;
exports.createBoundCompareFn = createBoundCompareFn;
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
},{"../function":3,"../object":2}],9:[function(require,module,exports){
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

},{"../array":4,"../object":2,"../function":3}],8:[function(require,module,exports){
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
    arraySlice = Array.prototype.slice;

function ClassDefiner() {}

ClassDefiner.COMPOSITIONS_NAME = '$compositions';

ClassDefiner.prototype = {
    defaultType: Base,

    processorKeys: {
        $mixins: '_applyMixins',
        $statics: '_applyStatics',
        $compositions: '_compose',
        $super: '_super'
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
                $class: $class
            }, options);

        if (Super) {
            values.$superclass = Super.prototype;
        }

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

            if(prototype.getComposition === undefined) {
                prototype.getComposition = this.getComposition;
            }

        }, this);
    },

    _super: function($class, $super) {
        if ($super) {
            $class.prototype.$super = $super;
        }
    },

    _createComposerProtoFn: function(methodName, compositionName) {
        return function() {
            var comp = this[ClassDefiner.COMPOSITIONS_NAME][compositionName];
            return comp[methodName].apply(comp, arguments);
        };
    },

    //Methods that can get added to the prototype
    //they will be called in the context of the instance.
    /**
     * @private
     * Getter for composition instance that gets put on
     * the defined class.
     * @param  {String} key
     */
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

var Definer = new ClassDefiner();
//make Luc.define happy
Definer.define = Definer.define.bind(Definer);

module.exports = Definer;
},{"./base":7,"../object":2,"./composition":14,"../array":4,"../function":3,"../is":5}],10:[function(require,module,exports){
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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvbHVjLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL29iamVjdC5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9pcy5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9ldmVudHMvZXZlbnRFbWl0dGVyLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2luc2VydC1tb2R1bGUtZ2xvYmFscy9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItYnVpbHRpbnMvYnVpbHRpbi9ldmVudHMuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvZnVuY3Rpb24uanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvYXJyYXkuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvY29tcGFyZS5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9jbGFzcy9iYXNlLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2NsYXNzL3BsdWdpbi5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9jbGFzcy9kZWZpbmVyLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2NsYXNzL2NvbXBvc2l0aW9uRW51bW5zLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2NsYXNzL2NvbXBvc2l0aW9uLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2NsYXNzL3BsdWdpbk1hbmFnZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5VUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxa0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDelNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsidmFyIEx1YyA9IHt9O1xuLyoqXG4gKiBAY2xhc3MgTHVjXG4gKiBBbGlhc2VzIGZvciBjb21tb24gTHVjIG1ldGhvZHMgYW5kIHBhY2thZ2VzLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IEx1YztcblxudmFyIG9iamVjdCA9IHJlcXVpcmUoJy4vb2JqZWN0Jyk7XG5MdWMuT2JqZWN0ID0gb2JqZWN0O1xuLyoqXG4gKiBAbWVtYmVyIEx1Y1xuICogQHByb3BlcnR5IE8gTHVjLk9cbiAqIEFsaWFzIGZvciBMdWMuT2JqZWN0XG4gKi9cbkx1Yy5PID0gb2JqZWN0O1xuXG5cbi8qKlxuICogQG1lbWJlciBMdWNcbiAqIEBtZXRob2QgYXBwbHlcbiAqIEBpbmhlcml0ZG9jIEx1Yy5PYmplY3QjYXBwbHlcbiAqL1xuTHVjLmFwcGx5ID0gTHVjLk9iamVjdC5hcHBseTtcblxuLyoqXG4gKiBAbWVtYmVyIEx1Y1xuICogQG1ldGhvZCBtaXhcbiAqIEBpbmhlcml0ZG9jIEx1Yy5PYmplY3QjbWl4XG4gKi9cbkx1Yy5taXggPSBMdWMuT2JqZWN0Lm1peDtcblxuXG52YXIgZnVuID0gcmVxdWlyZSgnLi9mdW5jdGlvbicpO1xuTHVjLkZ1bmN0aW9uID0gZnVuO1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjXG4gKiBAcHJvcGVydHkgRiBMdWMuRlxuICogQWxpYXMgZm9yIEx1Yy5GdW5jdGlvblxuICovXG5MdWMuRiA9IGZ1bjtcblxuLyoqXG4gKiBAbWVtYmVyIEx1Y1xuICogQG1ldGhvZCBlbXB0eUZuXG4gKiBAaW5oZXJpdGRvYyBMdWMuRnVuY3Rpb24jZW1wdHlGblxuICovXG5MdWMuZW1wdHlGbiA9IEx1Yy5GdW5jdGlvbi5lbXB0eUZuO1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjXG4gKiBAbWV0aG9kIGFic3RyYWN0Rm5cbiAqIEBpbmhlcml0ZG9jIEx1Yy5GdW5jdGlvbiNhYnN0cmFjdEZuXG4gKi9cbkx1Yy5hYnN0cmFjdEZuID0gTHVjLkZ1bmN0aW9uLmFic3RyYWN0Rm47XG5cbnZhciBhcnJheSA9IHJlcXVpcmUoJy4vYXJyYXknKTtcbkx1Yy5BcnJheSA9IGFycmF5O1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjXG4gKiBAcHJvcGVydHkgQSBMdWMuQVxuICogQWxpYXMgZm9yIEx1Yy5BcnJheVxuICovXG5MdWMuQSA9IGFycmF5O1xuXG5MdWMuYXBwbHkoTHVjLCByZXF1aXJlKCcuL2lzJykpO1xuXG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnLi9ldmVudHMvZXZlbnRFbWl0dGVyJyk7XG5cbkx1Yy5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbnZhciBCYXNlID0gcmVxdWlyZSgnLi9jbGFzcy9iYXNlJyk7XG5cbkx1Yy5CYXNlID0gQmFzZTtcblxudmFyIERlZmluZXIgPSByZXF1aXJlKCcuL2NsYXNzL2RlZmluZXInKTtcblxuTHVjLkNsYXNzRGVmaW5lciA9IERlZmluZXI7XG5cbkx1Yy5kZWZpbmUgPSBEZWZpbmVyLmRlZmluZTtcblxuTHVjLlBsdWdpbiA9IHJlcXVpcmUoJy4vY2xhc3MvcGx1Z2luJyk7XG5cbkx1Yy5hcHBseShMdWMsIHtcbiAgICBjb21wb3NpdGlvbkVudW1uczogcmVxdWlyZSgnLi9jbGFzcy9jb21wb3NpdGlvbkVudW1ucycpXG59KTtcblxuTHVjLmNvbXBhcmUgPSByZXF1aXJlKCcuL2NvbXBhcmUnKS5jb21wYXJlO1xuXG5cbmlmKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgd2luZG93Lkx1YyA9IEx1Yztcbn0iLCIvKipcbiAqIEBjbGFzcyBMdWMuT2JqZWN0XG4gKiBQYWNrYWdlIGZvciBPYmplY3QgbWV0aG9kc1xuICovXG5cbi8qKlxuICogQXBwbHkgdGhlIHByb3BlcnRpZXMgZnJvbSBmcm9tT2JqZWN0IHRvIHRoZSB0b09iamVjdC4gIGZyb21PYmplY3Qgd2lsbFxuICogb3ZlcndyaXRlIGFueSBzaGFyZWQga2V5cy4gIEl0IGNhbiBhbHNvIGJlIHVzZWQgYXMgYSBzaW1wbGUgc2hhbGxvdyBjbG9uZS5cbiAqIFxuICAgIHZhciB0byA9IHthOjEsIGM6MX0sIGZyb20gPSB7YToyLCBiOjJ9XG4gICAgTHVjLk9iamVjdC5hcHBseSh0bywgZnJvbSlcbiAgICA+T2JqZWN0IHthOiAyLCBjOiAxLCBiOiAyfVxuICAgIHRvID09PSB0b1xuICAgID50cnVlXG4gICAgdmFyIGNsb25lID0gTHVjLk9iamVjdC5hcHBseSh7fSwgZnJvbSlcbiAgICA+dW5kZWZpbmVkXG4gICAgY2xvbmVcbiAgICA+T2JqZWN0IHthOiAyLCBiOiAyfVxuICAgIGNsb25lID09PSBmcm9tXG4gICAgPmZhbHNlXG4gKlxuICogQHBhcmFtICB7T2JqZWN0fHVuZGVmaW5lZH0gdG9PYmplY3QgT2JqZWN0IHRvIHB1dCB0aGUgcHJvcGVydGllcyBmcm9tT2JqZWN0IG9uLlxuICogQHBhcmFtICB7T2JqZWN0fHVuZGVmaW5lZH0gZnJvbU9iamVjdCBPYmplY3QgdG8gcHV0IHRoZSBwcm9wZXJ0aWVzIG9uIHRoZSB0b09iamVjdFxuICogQHJldHVybiB7T2JqZWN0fSB0aGUgdG9PYmplY3RcbiAqL1xuZXhwb3J0cy5hcHBseSA9IGZ1bmN0aW9uKHRvT2JqZWN0LCBmcm9tT2JqZWN0KSB7XG4gICAgdmFyIHRvID0gdG9PYmplY3QgfHwge30sXG4gICAgICAgIGZyb20gPSBmcm9tT2JqZWN0IHx8IHt9LFxuICAgICAgICBwcm9wO1xuXG4gICAgZm9yIChwcm9wIGluIGZyb20pIHtcbiAgICAgICAgaWYgKGZyb20uaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICAgIHRvW3Byb3BdID0gZnJvbVtwcm9wXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0bztcbn07XG5cbi8qKlxuICogU2ltaWxhciB0byBMdWMuT2JqZWN0LmFwcGx5IGV4Y2VwdCB0aGF0IHRoZSBmcm9tT2JqZWN0IHdpbGwgXG4gKiBOT1Qgb3ZlcndyaXRlIHRoZSBrZXlzIG9mIHRoZSB0b09iamVjdCBpZiB0aGV5IGFyZSBkZWZpbmVkLlxuICogXG4gKiBAcGFyYW0gIHtPYmplY3R8dW5kZWZpbmVkfSB0b09iamVjdCBPYmplY3QgdG8gcHV0IHRoZSBwcm9wZXJ0aWVzIGZyb21PYmplY3Qgb24uXG4gKiBAcGFyYW0gIHtPYmplY3R8dW5kZWZpbmVkfSBmcm9tT2JqZWN0IE9iamVjdCB0byBwdXQgdGhlIHByb3BlcnRpZXMgb24gdGhlIHRvT2JqZWN0XG4gKiBAcmV0dXJuIHtPYmplY3R9IHRoZSB0b09iamVjdFxuICovXG5leHBvcnRzLm1peCA9IGZ1bmN0aW9uKHRvT2JqZWN0LCBmcm9tT2JqZWN0KSB7XG4gICAgdmFyIHRvID0gdG9PYmplY3QgfHwge30sXG4gICAgICAgIGZyb20gPSBmcm9tT2JqZWN0IHx8IHt9LFxuICAgICAgICBwcm9wO1xuXG4gICAgZm9yIChwcm9wIGluIGZyb20pIHtcbiAgICAgICAgaWYgKGZyb20uaGFzT3duUHJvcGVydHkocHJvcCkgJiYgdG9bcHJvcF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdG9bcHJvcF0gPSBmcm9tW3Byb3BdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRvO1xufTtcblxuLyoqXG4gKiBJdGVyYXRlIG92ZXIgYW4gb2JqZWN0cyBwcm9wZXJ0aWVzXG4gKiBhcyBrZXkgdmFsdWUgXCJwYWlyc1wiIHdpdGggdGhlIHBhc3NlZCBpbiBmdW5jdGlvbi5cbiAqIFxuICAgIHZhciBjb250ZXh0ID0ge3ZhbDoxfTtcbiAgICBMdWMuT2JqZWN0LmVhY2goe1xuICAgICAgICBrZXk6IDFcbiAgICB9LCBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHZhbHVlICsga2V5ICsgdGhpcy52YWwpXG4gICAgfSwgY29udGV4dClcbiAgICBcbiAgICA+MWtleTEgXG4gXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgb2JqICB0aGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3ZlclxuICogQHBhcmFtICB7RnVuY3Rpb259IGZuICAgdGhlIGZ1bmN0aW9uIHRvIGNhbGxcbiAqIEBwYXJhbSAge1N0cmluZ30gZm4ua2V5ICAgdGhlIG9iamVjdCBrZXlcbiAqIEBwYXJhbSAge09iamVjdH0gZm4udmFsdWUgICB0aGUgb2JqZWN0IHZhbHVlXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgW3RoaXNBcmddIFxuICogQHBhcmFtIHtPYmplY3R9ICBbY29uZmlnXVxuICogQHBhcmFtIHtCb29sZWFufSAgY29uZmlnLm93blByb3BlcnRpZXMgc2V0IHRvIGZhbHNlXG4gKiB0byBpdGVyYXRlIG92ZXIgYWxsIG9mIHRoZSBvYmplY3RzIGVudW1lcmFibGUgcHJvcGVydGllcy5cbiAqL1xuZXhwb3J0cy5lYWNoID0gZnVuY3Rpb24ob2JqLCBmbiwgdGhpc0FyZywgY29uZmlnKSB7XG4gICAgdmFyIGtleSwgdmFsdWUsXG4gICAgICAgIGFsbFByb3BlcnRpZXMgPSBjb25maWcgJiYgY29uZmlnLm93blByb3BlcnRpZXMgPT09IGZhbHNlO1xuXG4gICAgaWYgKGFsbFByb3BlcnRpZXMpIHtcbiAgICAgICAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgICAgICAgICBmbi5jYWxsKHRoaXNBcmcsIGtleSwgb2JqW2tleV0pO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBmbi5jYWxsKHRoaXNBcmcsIGtleSwgb2JqW2tleV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcblxuLyoqXG4gKiBUYWtlIGFuIGFycmF5IG9mIHN0cmluZ3MgYW5kIGFuIGFycmF5L2FyZ3VtZW50cyBvZlxuICogdmFsdWVzIGFuZCByZXR1cm4gYW4gb2JqZWN0IG9mIGtleSB2YWx1ZSBwYWlyc1xuICogYmFzZWQgb2ZmIGVhY2ggYXJyYXlzIGluZGV4LiAgSXQgaXMgdXNlZnVsIGZvciB0YWtpbmdcbiAqIGEgbG9uZyBsaXN0IG9mIGFyZ3VtZW50cyBhbmQgY3JlYXRpbmcgYW4gb2JqZWN0IHRoYXQgY2FuXG4gKiBiZSBwYXNzZWQgdG8gb3RoZXIgbWV0aG9kcy5cbiAqIFxuICAgIGZ1bmN0aW9uIGxvbmdBcmdzKGEsYixjLGQsZSxmKSB7XG4gICAgICAgIHJldHVybiBMdWMuT2JqZWN0LnRvT2JqZWN0KFsnYScsJ2InLCAnYycsICdkJywgJ2UnLCAnZiddLCBhcmd1bWVudHMpXG4gICAgfVxuXG4gICAgbG9uZ0FyZ3MoMSwyLDMsNCw1LDYsNyw4LDkpXG5cbiAgICA+T2JqZWN0IHthOiAxLCBiOiAyLCBjOiAzLCBkOiA0LCBlOiA14oCmfVxuICAgIGE6IDFcbiAgICBiOiAyXG4gICAgYzogM1xuICAgIGQ6IDRcbiAgICBlOiA1XG4gICAgZjogNlxuXG4gICAgbG9uZ0FyZ3MoMSwyLDMpXG5cbiAgICA+T2JqZWN0IHthOiAxLCBiOiAyLCBjOiAzLCBkOiB1bmRlZmluZWQsIGU6IHVuZGVmaW5lZOKApn1cbiAgICBhOiAxXG4gICAgYjogMlxuICAgIGM6IDNcbiAgICBkOiB1bmRlZmluZWRcbiAgICBlOiB1bmRlZmluZWRcbiAgICBmOiB1bmRlZmluZWRcblxuICogQHBhcmFtICB7U3RyaW5nW119IHN0cmluZ3NcbiAqIEBwYXJhbSAge0FycmF5L2FyZ3VtZW50c30gdmFsdWVzXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbmV4cG9ydHMudG9PYmplY3QgPSBmdW5jdGlvbihzdHJpbmdzLCB2YWx1ZXMpIHtcbiAgICB2YXIgb2JqID0ge30sXG4gICAgICAgIGkgPSAwLFxuICAgICAgICBsZW4gPSBzdHJpbmdzLmxlbmd0aDtcbiAgICBmb3IgKDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgIG9ialtzdHJpbmdzW2ldXSA9IHZhbHVlc1tpXTtcbiAgICB9XG5cbiAgICByZXR1cm4gb2JqO1xufTtcblxuLyoqXG4gKiBSZXR1cm4ga2V5IHZhbHVlIHBhaXJzIGZyb20gdGhlIG9iamVjdCBpZiB0aGVcbiAqIGZpbHRlckZuIHJldHVybnMgYSB0cnV0aHkgdmFsdWUuXG4gKlxuICAgIEx1Yy5PYmplY3QuZmlsdGVyKHtcbiAgICAgICAgYTogZmFsc2UsXG4gICAgICAgIGI6IHRydWUsXG4gICAgICAgIGM6IGZhbHNlXG4gICAgfSwgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4ga2V5ID09PSAnYScgfHwgdmFsdWVcbiAgICB9KVxuICAgID5be2tleTogJ2EnLCB2YWx1ZTogZmFsc2V9LCB7a2V5OiAnYicsIHZhbHVlOiB0cnVlfV1cbiAqIFxuICogQHBhcmFtICB7T2JqZWN0fSAgIG9iaiAgdGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXJcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmaWx0ZXJGbiAgIHRoZSBmdW5jdGlvbiB0byBjYWxsLCByZXR1cm4gYSB0cnV0aHkgdmFsdWVcbiAqIHRvIGFkZCB0aGUga2V5IHZhbHVlIHBhaXJcbiAqIEBwYXJhbSAge1N0cmluZ30gZmlsdGVyRm4ua2V5ICAgdGhlIG9iamVjdCBrZXlcbiAqIEBwYXJhbSAge09iamVjdH0gZmlsdGVyRm4udmFsdWUgICB0aGUgb2JqZWN0IHZhbHVlXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgW3RoaXNBcmddIFxuICogQHBhcmFtIHtPYmplY3R9ICBbY29uZmlnXVxuICogQHBhcmFtIHtCb29sZWFufSAgY29uZmlnLm93blByb3BlcnRpZXMgc2V0IHRvIGZhbHNlXG4gKiB0byBpdGVyYXRlIG92ZXIgYWxsIG9mIHRoZSBvYmplY3RzIGVudW1lcmFibGUgcHJvcGVydGllcy5cbiAqIFxuICogQHBhcmFtIHtCb29sZWFufSAgY29uZmlnLmtleXMgc2V0IHRvIHRydWUgdG8gcmV0dXJuXG4gKiBqdXN0IHRoZSBrZXlzLlxuICpcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gIGNvbmZpZy52YWx1ZXMgc2V0IHRvIHRydWUgdG8gcmV0dXJuXG4gKiBqdXN0IHRoZSB2YWx1ZXMuXG4gKiBcbiAqIEByZXR1cm4ge09iamVjdFtdL1N0cmluZ1tdfSBBcnJheSBvZiBrZXkgdmFsdWUgcGFpcnMgaW4gdGhlIGZvcm1cbiAqIG9mIHtrZXk6ICdrZXknLCB2YWx1ZTogdmFsdWV9LiAgSWYga2V5cyBvciB2YWx1ZXMgaXMgdHJ1ZSBvbiB0aGUgY29uZmlnXG4gKiBqdXN0IHRoZSBrZXlzIG9yIHZhbHVlcyBhcmUgcmV0dXJuZWQuXG4gKlxuICovXG5leHBvcnRzLmZpbHRlciA9IGZ1bmN0aW9uKG9iaiwgZmlsdGVyRm4sIHRoaXNBcmcsIGNvbmZpZykge1xuICAgIHZhciB2YWx1ZXMgPSBbXTtcblxuICAgIGV4cG9ydHMuZWFjaChvYmosIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKGZpbHRlckZuLmNhbGwodGhpc0FyZywga2V5LCB2YWx1ZSkpIHtcbiAgICAgICAgICAgIGlmIChjb25maWcua2V5cyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHZhbHVlcy5wdXNoKGtleSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbmZpZy52YWx1ZXMgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZXMucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbHVlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICBrZXk6IGtleVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSwgdGhpc0FyZywgY29uZmlnKTtcblxuICAgIHJldHVybiB2YWx1ZXM7XG59OyIsInZhciBvVG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuLyoqXG4gKiBAY2xhc3MgTHVjLmlzIFxuICogUGFja2FnZSBmb3IgZGV0ZXJtaW5pbmcgdGhlIHR5cGVzIG9mIG9iamVjdHNcbiAqIGl0IGFsc28gaGFzIGFuIEx1Yy5pcy5pc0VtcHR5IGFuZCBMdWMuaXMuaXNGYWxzeSBcbiAqIGZ1bmN0aW9ucy5cbiAqL1xuXG5cbi8qKlxuICogUmV0dXJuIHRydWUgaWYgdGhlIHBhc3NlZCBpbiBvYmplY3QgaXMgb2ZcbiAqIHRoZSB0eXBlIHtAbGluayBBcnJheSBBcnJheX1cbiAqIEBwYXJhbSAge09iamVjdH0gIG9iaiBcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXkob2JqKSB7XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkob2JqKTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgcGFzc2VkIGluIG9iamVjdCBpcyBvZlxuICogdGhlIHR5cGUge0BsaW5rIE9iamVjdCBPYmplY3R9XG4gKiBAcGFyYW0gIHtPYmplY3R9ICBvYmogXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5mdW5jdGlvbiBpc09iamVjdChvYmopIHtcbiAgICByZXR1cm4gb1RvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSc7XG59XG5cbi8qKlxuICogUmV0dXJuIHRydWUgaWYgdGhlIHBhc3NlZCBpbiBvYmplY3QgaXMgb2ZcbiAqIHRoZSB0eXBlIHtAbGluayBGdW5jdGlvbiBGdW5jdGlvbn1cbiAqIEBwYXJhbSAge09iamVjdH0gIG9iaiBcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9Ub1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG59XG5cbi8qKlxuICogUmV0dXJuIHRydWUgaWYgdGhlIHBhc3NlZCBpbiBvYmplY3QgaXMgb2ZcbiAqIHRoZSB0eXBlIHtAbGluayBEYXRlIERhdGV9XG4gKiBAcGFyYW0gIHtPYmplY3R9ICBvYmogXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5mdW5jdGlvbiBpc0RhdGUob2JqKSB7XG4gICAgcmV0dXJuIG9Ub1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cblxuLyoqXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgcGFzc2VkIGluIG9iamVjdCBpcyBvZlxuICogdGhlIHR5cGUge0BsaW5rIFJlZ0V4cCBSZWdFeHB9XG4gKiBAcGFyYW0gIHtPYmplY3R9ICBvYmogXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5mdW5jdGlvbiBpc1JlZ0V4cChvYmopIHtcbiAgICByZXR1cm4gb1RvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgUmVnRXhwXSc7XG59XG5cbi8qKlxuICogUmV0dXJuIHRydWUgaWYgdGhlIHBhc3NlZCBpbiBvYmplY3QgaXMgb2ZcbiAqIHRoZSB0eXBlIHtAbGluayBOdW1iZXIgTnVtYmVyfVxuICogQHBhcmFtICB7T2JqZWN0fSAgb2JqIFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNOdW1iZXIob2JqKSB7XG4gICAgcmV0dXJuIG9Ub1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IE51bWJlcl0nO1xufVxuXG4vKipcbiAqIFJldHVybiB0cnVlIGlmIHRoZSBwYXNzZWQgaW4gb2JqZWN0IGlzIG9mXG4gKiB0aGUgdHlwZSB7QGxpbmsgU3RyaW5nIFN0cmluZ31cbiAqIEBwYXJhbSAge09iamVjdH0gIG9iaiBcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzU3RyaW5nKG9iaikge1xuICAgIHJldHVybiBvVG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBTdHJpbmddJztcbn1cblxuLyoqXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgcGFzc2VkIGluIG9iamVjdCBpcyBvZlxuICogdGhlIHR5cGUge0BsaW5rIEJvb2xlYW4gQm9vbGVhbn1cbiAqIEBwYXJhbSAge09iamVjdH0gIG9iaiBcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzQm9vbGVhbihvYmopIHtcbiAgICByZXR1cm4gb1RvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQm9vbGVhbl0nO1xufVxuXG4vKipcbiAqIFJldHVybiB0cnVlIGlmIHRoZSBvYmplY3QgaXMgZmFsc3kgYnV0IG5vdCAwLlxuICogQHBhcmFtICB7T2JqZWN0fSAgb2JqXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgICAgXG4gKi9cbmZ1bmN0aW9uIGlzRmFsc3kob2JqKSB7XG4gICAgcmV0dXJuICghb2JqICYmIG9iaiAhPT0gMCk7XG59XG5cbi8qKlxuICogUmV0dXJuIHRydWUgaWYgdGhlIG9iamVjdCBpcyBlbXB0eS5cbiAqIHt9LCBbXSwgJycsZmFsc2UsIG51bGwsIHVuZGVmaW5lZCwgTmFOIFxuICogQXJlIGFsbCB0cmVhdGVkIGFzIGVtcHR5LlxuICogQHBhcmFtICB7T2JqZWN0fSAgb2JqXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5mdW5jdGlvbiBpc0VtcHR5KG9iaikge1xuICAgIHZhciBlbXB0eSA9IGZhbHNlO1xuXG4gICAgaWYgKGlzRmFsc3kob2JqKSkge1xuICAgICAgICBlbXB0eSA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICAgICAgZW1wdHkgPSBvYmoubGVuZ3RoID09PSAwO1xuICAgIH0gZWxzZSBpZiAoaXNPYmplY3Qob2JqKSkge1xuICAgICAgICBlbXB0eSA9IE9iamVjdC5rZXlzKG9iaikubGVuZ3RoID09PSAwO1xuICAgIH1cblxuICAgIHJldHVybiBlbXB0eTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgaXNBcnJheTogaXNBcnJheSxcbiAgICBpc09iamVjdDogaXNPYmplY3QsXG4gICAgaXNGdW5jdGlvbjogaXNGdW5jdGlvbixcbiAgICBpc0RhdGU6IGlzRGF0ZSxcbiAgICBpc1N0cmluZzogaXNTdHJpbmcsXG4gICAgaXNOdW1iZXI6IGlzTnVtYmVyLFxuICAgIGlzUmVnRXhwOiBpc1JlZ0V4cCxcbiAgICBpc0Jvb2xlYW46IGlzQm9vbGVhbixcbiAgICBpc0ZhbHN5OiBpc0ZhbHN5LFxuICAgIGlzRW1wdHk6IGlzRW1wdHlcbn07IiwiLyoqXG4gKiBAbGljZW5zZSBodHRwczovL3Jhdy5naXRodWIuY29tL2pveWVudC9ub2RlL3YwLjEwLjExL0xJQ0VOU0VcbiAqIE5vZGUganMgbGljZW5jZS4gRXZlbnRFbWl0dGVyIHdpbGwgYmUgaW4gdGhlIGNsaWVudFxuICogb25seSBjb2RlLlxuICovXG5cbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG5cbi8qKlxuICogQGNsYXNzIEx1Yy5FdmVudEVtaXR0ZXJcbiAqIFRoZSB3b25kZXJmdWwgZXZlbnQgZW1taXRlciB0aGF0IGNvbWVzIHdpdGggbm9kZSxcbiAqIHRoYXQgd29ya3MgaW4gdGhlIHN1cHBvcnRlZCBicm93c2Vycy5cbiAqIFtodHRwOi8vbm9kZWpzLm9yZy9hcGkvZXZlbnRzLmh0bWxdKGh0dHA6Ly9ub2RlanMub3JnL2FwaS9ldmVudHMuaHRtbClcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgICAvL3B1dCBpbiBmaXggZm9yIElFIDkgYW5kIGJlbG93XG4gICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICBnID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzZWxmLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuICAgICAgICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcblxuICAgIHNlbGYub24odHlwZSwgZyk7XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyOyIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnByb2Nlc3MubmV4dFRpY2sgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYW5TZXRJbW1lZGlhdGUgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5zZXRJbW1lZGlhdGU7XG4gICAgdmFyIGNhblBvc3QgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5wb3N0TWVzc2FnZSAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lclxuICAgIDtcblxuICAgIGlmIChjYW5TZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiB3aW5kb3cuc2V0SW1tZWRpYXRlKGYpIH07XG4gICAgfVxuXG4gICAgaWYgKGNhblBvc3QpIHtcbiAgICAgICAgdmFyIHF1ZXVlID0gW107XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICBpZiAoZXYuc291cmNlID09PSB3aW5kb3cgJiYgZXYuZGF0YSA9PT0gJ3Byb2Nlc3MtdGljaycpIHtcbiAgICAgICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBpZiAocXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZm4gPSBxdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICBmbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgICAgICBxdWV1ZS5wdXNoKGZuKTtcbiAgICAgICAgICAgIHdpbmRvdy5wb3N0TWVzc2FnZSgncHJvY2Vzcy10aWNrJywgJyonKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgc2V0VGltZW91dChmbiwgMCk7XG4gICAgfTtcbn0pKCk7XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn1cblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuIiwiKGZ1bmN0aW9uKHByb2Nlc3Mpe2lmICghcHJvY2Vzcy5FdmVudEVtaXR0ZXIpIHByb2Nlc3MuRXZlbnRFbWl0dGVyID0gZnVuY3Rpb24gKCkge307XG5cbnZhciBFdmVudEVtaXR0ZXIgPSBleHBvcnRzLkV2ZW50RW1pdHRlciA9IHByb2Nlc3MuRXZlbnRFbWl0dGVyO1xudmFyIGlzQXJyYXkgPSB0eXBlb2YgQXJyYXkuaXNBcnJheSA9PT0gJ2Z1bmN0aW9uJ1xuICAgID8gQXJyYXkuaXNBcnJheVxuICAgIDogZnVuY3Rpb24gKHhzKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeHMpID09PSAnW29iamVjdCBBcnJheV0nXG4gICAgfVxuO1xuZnVuY3Rpb24gaW5kZXhPZiAoeHMsIHgpIHtcbiAgICBpZiAoeHMuaW5kZXhPZikgcmV0dXJuIHhzLmluZGV4T2YoeCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoeCA9PT0geHNbaV0pIHJldHVybiBpO1xuICAgIH1cbiAgICByZXR1cm4gLTE7XG59XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW5cbi8vIDEwIGxpc3RlbmVycyBhcmUgYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaFxuLy8gaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG4vL1xuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbnZhciBkZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCF0aGlzLl9ldmVudHMpIHRoaXMuX2V2ZW50cyA9IHt9O1xuICB0aGlzLl9ldmVudHMubWF4TGlzdGVuZXJzID0gbjtcbn07XG5cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNBcnJheSh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSlcbiAgICB7XG4gICAgICBpZiAoYXJndW1lbnRzWzFdIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgYXJndW1lbnRzWzFdOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5jYXVnaHQsIHVuc3BlY2lmaWVkICdlcnJvcicgZXZlbnQuXCIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGlmICghdGhpcy5fZXZlbnRzKSByZXR1cm4gZmFsc2U7XG4gIHZhciBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBpZiAoIWhhbmRsZXIpIHJldHVybiBmYWxzZTtcblxuICBpZiAodHlwZW9mIGhhbmRsZXIgPT0gJ2Z1bmN0aW9uJykge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuXG4gIH0gZWxzZSBpZiAoaXNBcnJheShoYW5kbGVyKSkge1xuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICAgIHZhciBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBsaXN0ZW5lcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59O1xuXG4vLyBFdmVudEVtaXR0ZXIgaXMgZGVmaW5lZCBpbiBzcmMvbm9kZV9ldmVudHMuY2Ncbi8vIEV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCgpIGlzIGFsc28gZGVmaW5lZCB0aGVyZS5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIGxpc3RlbmVyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdhZGRMaXN0ZW5lciBvbmx5IHRha2VzIGluc3RhbmNlcyBvZiBGdW5jdGlvbicpO1xuICB9XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT0gXCJuZXdMaXN0ZW5lcnNcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJzXCIuXG4gIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pIHtcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgfSBlbHNlIGlmIChpc0FycmF5KHRoaXMuX2V2ZW50c1t0eXBlXSkpIHtcblxuICAgIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gICAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgICB2YXIgbTtcbiAgICAgIGlmICh0aGlzLl9ldmVudHMubWF4TGlzdGVuZXJzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbSA9IHRoaXMuX2V2ZW50cy5tYXhMaXN0ZW5lcnM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtID0gZGVmYXVsdE1heExpc3RlbmVycztcbiAgICAgIH1cblxuICAgICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHNlbGYub24odHlwZSwgZnVuY3Rpb24gZygpIHtcbiAgICBzZWxmLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0pO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICgnZnVuY3Rpb24nICE9PSB0eXBlb2YgbGlzdGVuZXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3JlbW92ZUxpc3RlbmVyIG9ubHkgdGFrZXMgaW5zdGFuY2VzIG9mIEZ1bmN0aW9uJyk7XG4gIH1cblxuICAvLyBkb2VzIG5vdCB1c2UgbGlzdGVuZXJzKCksIHNvIG5vIHNpZGUgZWZmZWN0IG9mIGNyZWF0aW5nIF9ldmVudHNbdHlwZV1cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSkgcmV0dXJuIHRoaXM7XG5cbiAgdmFyIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzQXJyYXkobGlzdCkpIHtcbiAgICB2YXIgaSA9IGluZGV4T2YobGlzdCwgbGlzdGVuZXIpO1xuICAgIGlmIChpIDwgMCkgcmV0dXJuIHRoaXM7XG4gICAgbGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgaWYgKGxpc3QubGVuZ3RoID09IDApXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICB9IGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSA9PT0gbGlzdGVuZXIpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGRvZXMgbm90IHVzZSBsaXN0ZW5lcnMoKSwgc28gbm8gc2lkZSBlZmZlY3Qgb2YgY3JlYXRpbmcgX2V2ZW50c1t0eXBlXVxuICBpZiAodHlwZSAmJiB0aGlzLl9ldmVudHMgJiYgdGhpcy5fZXZlbnRzW3R5cGVdKSB0aGlzLl9ldmVudHNbdHlwZV0gPSBudWxsO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICBpZiAoIXRoaXMuX2V2ZW50cykgdGhpcy5fZXZlbnRzID0ge307XG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKSB0aGlzLl9ldmVudHNbdHlwZV0gPSBbXTtcbiAgaWYgKCFpc0FycmF5KHRoaXMuX2V2ZW50c1t0eXBlXSkpIHtcbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgfVxuICByZXR1cm4gdGhpcy5fZXZlbnRzW3R5cGVdO1xufTtcblxufSkocmVxdWlyZShcIl9fYnJvd3NlcmlmeV9wcm9jZXNzXCIpKSIsInZhciBpcyA9IHJlcXVpcmUoJy4vaXMnKSxcbiAgICBhSW5zZXJ0ID0gcmVxdWlyZSgnLi9hcnJheScpLmluc2VydDtcbiAgICBhRWFjaCA9IHJlcXVpcmUoJy4vYXJyYXknKS5lYWNoO1xuXG4vKipcbiAqIEBjbGFzcyBMdWMuRnVuY3Rpb25cbiAqIFBhY2thZ2UgZm9yIGZ1bmN0aW9uIG1ldGhvZHMuXG4gKi9cblxuZnVuY3Rpb24gYXVnbWVudEFyZ3MoY29uZmlnLCBjYWxsQXJncykge1xuICAgIHZhciBjb25maWdBcmdzID0gY29uZmlnLmFyZ3MsXG4gICAgICAgIGluZGV4ID0gY29uZmlnLmluZGV4LFxuICAgICAgICBhcmdzQXJyYXk7XG5cbiAgICBpZiAoIWNvbmZpZ0FyZ3MpIHtcbiAgICAgICAgcmV0dXJuIGNhbGxBcmdzO1xuICAgIH1cblxuICAgIGlmKGluZGV4ID09PSB0cnVlIHx8IGlzLmlzTnVtYmVyKGluZGV4KSkge1xuICAgICAgICBpZihjb25maWcuYXJndW1lbnRzRmlyc3QgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICByZXR1cm4gYUluc2VydChjb25maWdBcmdzLCBjYWxsQXJncywgaW5kZXgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhSW5zZXJ0KGNhbGxBcmdzLCBjb25maWdBcmdzLCBpbmRleCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbmZpZ0FyZ3M7XG59XG5cbi8qKlxuICogQSByZXVzYWJsZSBlbXB0eSBmdW5jdGlvblxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbmV4cG9ydHMuZW1wdHlGbiA9IGZ1bmN0aW9uKCkge307XG5cbi8qKlxuICogQSBmdW5jdGlvbiB0aGF0IHRocm93cyBhbiBlcnJvciB3aGVuIGNhbGxlZC5cbiAqIFVzZWZ1bCB3aGVuIGRlZmluaW5nIGFic3RyYWN0IGxpa2UgY2xhc3Nlc1xuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbmV4cG9ydHMuYWJzdHJhY3RGbiA9IGZ1bmN0aW9uKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignYWJzdHJhY3RGbiBtdXN0IGJlIGltcGxlbWVudGVkJyk7XG59O1xuXG4vKipcbiAqIEFndW1lbnQgdGhlIHBhc3NlZCBpbiBmdW5jdGlvbidzIHRoaXNBcmcgYW5kIG9yIGFndW1lbnRzIG9iamVjdCBcbiAqIGJhc2VkIG9uIHRoZSBwYXNzZWQgaW4gY29uZmlnLlxuICogXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gZm4gdGhlIGZ1bmN0aW9uIHRvIGNhbGxcbiAqIEBwYXJhbSAge09iamVjdH0gY29uZmlnXG4gKiBcbiAqIEBwYXJhbSB7T2JqZWN0fSBbY29uZmlnLnRoaXNBcmddIHRoZSB0aGlzQXJnIGZvciB0aGUgZnVuY2l0b24gYmVpbmcgZXhlY3V0ZWQuXG4gKiBJZiB0aGlzIGlzIHRoZSBvbmx5IHByb3BlcnR5IG9uIHlvdXIgY29uZmlnIG9iamVjdCB0aGUgcHJlZmVyZWQgd2F5IHdvdWxkXG4gKiBiZSBqdXN0IHRvIHVzZSBGdW5jdGlvbi5iaW5kXG4gKiBcbiAqIEBwYXJhbSB7QXJyYXl9IFtjb25maWcuYXJnc10gdGhlIGFyZ3VtZW50cyB1c2VkIGZvciB0aGUgZnVuY3Rpb24gYmVpbmcgZXhlY3V0ZWQuXG4gKiBUaGlzIHdpbGwgcmVwbGFjZSB0aGUgZnVuY3Rpb25zIGNhbGwgYXJncyBpZiBpbmRleCBpcyBub3QgYSBudW1iZXIgb3IgXG4gKiB0cnVlLlxuICogXG4gKiBAcGFyYW0ge051bWJlci9UcnVlfSBbY29uZmlnLmluZGV4XSBCeSBkZWZ1YWx0IHRoZSB0aGUgY29uZmlndXJlZCBhcmd1bWVudHNcbiAqIHdpbGwgYmUgaW5zZXJ0ZWQgaW50byB0aGUgZnVuY3Rpb25zIHBhc3NlZCBpbiBjYWxsIGFyZ3VtZW50cy4gIElmIGluZGV4IGlzIHRydWVcbiAqIGFwcGVuZCB0aGUgYXJncyB0b2dldGhlciBpZiBpdCBpcyBhIG51bWJlciBpbnNlcnQgaXQgYXQgdGhlIHBhc3NlZCBpbiBpbmRleC5cbiAqIFxuICogQHBhcmFtIHtBcnJheX0gW2NvbmZpZy5hcmd1bWVudHNGaXJzdF0gcGFzcyBpbiBmYWxzZSB0byBcbiAqIGFndW1lbnQgdGhlIGNvbmZpZ3VyZWQgYXJncyBmaXJzdCB3aXRoIEx1Yy5BcnJheS5pbnNlcnQuICBEZWZhdWx0c1xuICogdG8gdHJ1ZVxuICAgICBcbiAgICAgZnVuY3Rpb24gZm4oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMpXG4gICAgICAgIGNvbnNvbGUubG9nKGFyZ3VtZW50cylcbiAgICB9XG5cbiAgICBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudG9yKGZuLCB7XG4gICAgICAgIHRoaXNBcmc6IHtjb25maWdlZFRoaXNBcmc6IHRydWV9LFxuICAgICAgICBhcmdzOiBbMSwyLDNdLFxuICAgICAgICBpbmRleDowXG4gICAgfSkoNClcblxuICAgID5PYmplY3Qge2NvbmZpZ2VkVGhpc0FyZzogdHJ1ZX1cbiAgICA+WzEsIDIsIDMsIDRdXG5cbiAgICBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudG9yKGZuLCB7XG4gICAgICAgIHRoaXNBcmc6IHtjb25maWdlZFRoaXNBcmc6IHRydWV9LFxuICAgICAgICBhcmdzOiBbMSwyLDNdLFxuICAgICAgICBpbmRleDowLFxuICAgICAgICBhcmd1bWVudHNGaXJzdDpmYWxzZVxuICAgIH0pKDQpXG5cbiAgICA+T2JqZWN0IHtjb25maWdlZFRoaXNBcmc6IHRydWV9XG4gICAgPls0LCAxLCAyLCAzXVxuXG5cbiAgICB2YXIgZiA9IEx1Yy5GdW5jdGlvbi5jcmVhdGVBdWdtZW50b3IoZm4sIHtcbiAgICAgICAgYXJnczogWzEsMiwzXSxcbiAgICAgICAgaW5kZXg6IHRydWVcbiAgICB9KTtcblxuICAgIGYuYXBwbHkoe2NvbmZpZzogZmFsc2V9LCBbNF0pXG5cbiAgICA+T2JqZWN0IHtjb25maWc6IGZhbHNlfVxuICAgID5bNCwgMSwgMiwgM11cblxuICogQHJldHVybiB7RnVuY3Rpb259IHRoZSBhdWdtZW50ZWQgZnVuY3Rpb24uXG4gKi9cbmV4cG9ydHMuY3JlYXRlQXVnbWVudG9yID0gZnVuY3Rpb24oZm4sIGNvbmZpZykge1xuICAgIHZhciB0aGlzQXJnID0gY29uZmlnLnRoaXNBcmc7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzQXJnIHx8IHRoaXMsIGF1Z21lbnRBcmdzKGNvbmZpZywgYXJndW1lbnRzKSk7XG4gICAgfTtcbn07XG5cbmZ1bmN0aW9uIGluaXRTZXF1ZW5jZUZ1bmN0aW9ucyhmbnMsIGNvbmZpZykge1xuICAgIHZhciB0b1J1biA9IFtdO1xuICAgIGFFYWNoKGZucywgZnVuY3Rpb24oZikge1xuICAgICAgICB2YXIgZm4gPSBmO1xuXG4gICAgICAgIGlmIChjb25maWcpIHtcbiAgICAgICAgICAgIGZuID0gZXhwb3J0cy5jcmVhdGVBdWdtZW50b3IoZiwgY29uZmlnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRvUnVuLnB1c2goZm4pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRvUnVuO1xufVxuXG4vKipcbiAqIFJldHVybiBhIGZ1bmN0aW9uIHRoYXQgcnVucyB0aGUgcGFzc2VkIGluIGZ1bmN0aW9uc1xuICogYW5kIHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgbGFzdCBmdW5jdGlvbiBjYWxsZWQuXG4gKiBcbiAqIEBwYXJhbSAge0Z1bmN0aW9uL0Z1bmN0aW9uW119IGZucyBcbiAqIEBwYXJhbSAge09iamVjdH0gW2NvbmZpZ10gQ29uZmlnIG9iamVjdFxuICogZm9yIEx1Yy5GdW5jdGlvbi5jcmVhdGVBdWdtZW50b3IuICBJZiBkZWZpbmVkIGFsbCBvZiB0aGUgZnVuY3Rpb25zXG4gKiB3aWxsIGdldCBjcmVhdGVkIHdpdGggdGhlIHBhc3NlZCBpbiBjb25maWc7XG4gKlxuICAgIEx1Yy5GdW5jdGlvbi5jcmVhdGVTZXF1ZW5jZShbXG4gICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coMSlcbiAgICAgICAgfSxcbiAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygyKVxuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKDMpXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZmluaXNoZWQgbG9nZ2luZycpXG4gICAgICAgICAgICByZXR1cm4gNDtcbiAgICAgICAgfVxuICAgIF0pKClcbiAgICA+MVxuICAgID4yXG4gICAgPjNcbiAgICA+ZmluaXNoZWQgbG9nZ2luZ1xuICAgID40XG4gKiBcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5leHBvcnRzLmNyZWF0ZVNlcXVlbmNlID0gZnVuY3Rpb24oZm5zLCBjb25maWcpIHtcbiAgICB2YXIgZnVuY3Rpb25zID0gaW5pdFNlcXVlbmNlRnVuY3Rpb25zKGZucywgY29uZmlnKTtcblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGkgPSAwLFxuICAgICAgICAgICAgbGVuID0gZnVuY3Rpb25zLmxlbmd0aDtcblxuICAgICAgICBmb3IoO2kgPCBsZW4gLTE7ICsraSkge1xuICAgICAgICAgICAgZnVuY3Rpb25zW2ldLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZnVuY3Rpb25zW2xlbiAtMSBdLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbn07XG5cbi8qKlxuICogUmV0dXJuIGEgZnVuY3Rpb24gdGhhdCBydW5zIHRoZSBwYXNzZWQgaW4gZnVuY3Rpb25zXG4gKiBpZiBvbmUgb2YgdGhlIGZ1bmN0aW9ucyByZXN1bHRzIGZhbHNlIHRoZSByZXN0IG9mIHRoZSBcbiAqIGZ1bmN0aW9ucyB3b24ndCBydW4gYW5kIGZhbHNlIHdpbGwgYmUgcmV0dXJuZWQuXG4gKlxuICogSWYgbm8gZmFsc2UgaXMgcmV0dXJuZWQgdGhlIHZhbHVlIG9mIHRoZSBsYXN0IGZ1bmN0aW9uIHJldHVybiB3aWxsIGJlIHJldHVybmVkXG4gKiBcbiAqIEBwYXJhbSAge0Z1bmN0aW9uL0Z1bmN0aW9uW119IGZucyBcbiAqIEBwYXJhbSAge09iamVjdH0gW2NvbmZpZ10gQ29uZmlnIG9iamVjdFxuICogZm9yIEx1Yy5GdW5jdGlvbi5jcmVhdGVBdWdtZW50b3IuICBJZiBkZWZpbmVkIGFsbCBvZiB0aGUgZnVuY3Rpb25zXG4gKiB3aWxsIGdldCBjcmVhdGVkIHdpdGggdGhlIHBhc3NlZCBpbiBjb25maWc7XG5cbiAgICBMdWMuRnVuY3Rpb24uY3JlYXRlU2VxdWVuY2VJZihbXG4gICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coMSlcbiAgICAgICAgfSxcbiAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygyKVxuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKDMpXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZmluaXNoZWQgbG9nZ2luZycpXG4gICAgICAgICAgICByZXR1cm4gNDtcbiAgICAgICAgfSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2kgY2FudCBsb2cnKVxuICAgICAgICB9XG4gICAgXSkoKVxuXG4gICAgPjFcbiAgICA+MlxuICAgID4zXG4gICAgPmZpbmlzaGVkIGxvZ2dpbmdcbiAgICA+ZmFsc2VcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5leHBvcnRzLmNyZWF0ZVNlcXVlbmNlSWYgPSBmdW5jdGlvbihmbnMsIGNvbmZpZykge1xuICAgIHZhciBmdW5jdGlvbnMgPSBpbml0U2VxdWVuY2VGdW5jdGlvbnMoZm5zLCBjb25maWcpO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdmFsdWUsXG4gICAgICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgICAgIGZ1bmN0aW9ucy5zb21lKGZ1bmN0aW9uKGZuKXtcbiAgICAgICAgICAgIHZhbHVlID0gZm4uYXBwbHkodGhpcywgYXJncyk7XG5cbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSA9PT0gZmFsc2U7XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9O1xufTtcblxuLyoqXG4gKiBSZXR1cm4gYSBmdW5jdGlvbnMgdGhhdCBydW5zIHRoZSBwYXNzZWQgaW4gZnVuY3Rpb25zXG4gKiB0aGUgcmVzdWx0IG9mIGVhY2ggZnVuY3Rpb24gd2lsbCBiZSB0aGUgdGhlIGNhbGwgYXJncyBcbiAqIGZvciB0aGUgbmV4dCBmdW5jdGlvbi4gIFRoZSB2YWx1ZSBvZiB0aGUgbGFzdCBmdW5jdGlvbiBcbiAqIHJldHVybiB3aWxsIGJlIHJldHVybmVkLlxuICogXG4gKiBAcGFyYW0gIHtGdW5jdGlvbi9GdW5jdGlvbltdfSBmbnMgXG4gKiBAcGFyYW0gIHtPYmplY3R9IFtjb25maWddIENvbmZpZyBvYmplY3RcbiAqIGZvciBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudG9yLiAgSWYgZGVmaW5lZCBhbGwgb2YgdGhlIGZ1bmN0aW9uc1xuICogd2lsbCBnZXQgY3JlYXRlZCB3aXRoIHRoZSBwYXNzZWQgaW4gY29uZmlnO1xuICAgICBcbiAgICAgTHVjLkZ1bmN0aW9uLmNyZWF0ZVJlbGF5ZXIoW1xuICAgICAgICBmdW5jdGlvbihzdHIpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHIgKyAnYidcbiAgICAgICAgfSxcbiAgICAgICAgZnVuY3Rpb24oc3RyKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RyICsgJ2MnXG4gICAgICAgIH0sXG4gICAgICAgIGZ1bmN0aW9uKHN0cikge1xuICAgICAgICAgICAgcmV0dXJuIHN0ciArICdkJ1xuICAgICAgICB9XG4gICAgXSkoJ2EnKVxuXG4gICAgPlwiYWJjZFwiXG5cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5leHBvcnRzLmNyZWF0ZVJlbGF5ZXIgPSBmdW5jdGlvbihmbnMsIGNvbmZpZykge1xuICAgIHZhciBmdW5jdGlvbnMgPSBpbml0U2VxdWVuY2VGdW5jdGlvbnMoZm5zLCBjb25maWcpO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdmFsdWUsXG4gICAgICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgICAgIGZ1bmN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKGZuLCBpbmRleCkge1xuICAgICAgICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBmbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBmbi5hcHBseSh0aGlzLCBbdmFsdWVdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH07XG59O1xuXG4vKipcbiAqIENyZWF0ZSBhIHRocm90dGxlZCBmdW5jdGlvbiB0aGF0IHRoZSBwYXNzZWQgaW4gZnVuY2l0b25cbiAqIG9ubHkgZ2V0cyBldm9rZWQgb25jZSBldmVuIGl0IGlzIGNhbGxlZCBtYW55IHRpbWVzXG4gKlxuICogXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gZm5cbiAqIEBwYXJhbSAge051bWJlcn0gW21pbGxpc10gTnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0b1xuICogdGhyb3R0bGUgdGhlIGZ1bmN0aW9uLlxuICogQHBhcmFtICB7T2JqZWN0fSBbY29uZmlnXSBDb25maWcgb2JqZWN0XG4gKiBmb3IgTHVjLkZ1bmN0aW9uLmNyZWF0ZUF1Z21lbnRvci4gIElmIGRlZmluZWQgYWxsIG9mIHRoZSBmdW5jdGlvbnNcbiAqIHdpbGwgZ2V0IGNyZWF0ZWQgd2l0aCB0aGUgcGFzc2VkIGluIGNvbmZpZztcbiAqIFxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbmV4cG9ydHMuY3JlYXRlVGhyb3R0ZWxlZCA9IGZ1bmN0aW9uKGYsIG1pbGxpcywgY29uZmlnKSB7XG4gICAgdmFyIGZuID0gY29uZmlnID8gZXhwb3J0cy5jcmVhdGVBdWdtZW50b3IoZiwgY29uZmlnKSA6IGYsXG4gICAgICAgIHRpbWVPdXRJZCA9IGZhbHNlO1xuXG4gICAgaWYoIW1pbGxpcykge1xuICAgICAgICByZXR1cm4gZm47XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcblxuICAgICAgICBpZih0aW1lT3V0SWQpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lT3V0SWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGltZU91dElkID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRpbWVPdXRJZCA9IGZhbHNlO1xuICAgICAgICAgICAgZm4uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgIH0sIG1pbGxpcyk7XG4gICAgfTtcbn07XG5cbi8qKlxuICogRGVmZXIgYSBmdW5jdGlvbidzIGV4ZWN1dGlvbiBmb3IgdGhlIHBhc3NlZCBpblxuICogbWlsbGlzZWNvbmRzLlxuICogXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gZm5cbiAqIEBwYXJhbSAge051bWJlcn0gW21pbGxpc10gTnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0b1xuICogZGVmZXJcbiAqIEBwYXJhbSAge09iamVjdH0gW2NvbmZpZ10gQ29uZmlnIG9iamVjdFxuICogZm9yIEx1Yy5GdW5jdGlvbi5jcmVhdGVBdWdtZW50b3IuICBJZiBkZWZpbmVkIGFsbCBvZiB0aGUgZnVuY3Rpb25zXG4gKiB3aWxsIGdldCBjcmVhdGVkIHdpdGggdGhlIHBhc3NlZCBpbiBjb25maWc7XG4gKiBcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5leHBvcnRzLmNyZWF0ZURlZmVycmVkID0gZnVuY3Rpb24oZiwgbWlsbGlzLCBjb25maWcpIHtcbiAgICB2YXIgZm4gPSBjb25maWcgPyBleHBvcnRzLmNyZWF0ZUF1Z21lbnRvcihmLCBjb25maWcpIDogZjtcblxuICAgIGlmKCFtaWxsaXMpIHtcbiAgICAgICAgcmV0dXJuIGZuO1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG5cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICB9LCBtaWxsaXMpO1xuICAgIH07XG59OyIsInZhciBhcnJheVNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLFxuICAgIGNvbXBhcmUgPSByZXF1aXJlKCcuL2NvbXBhcmUnKSxcbiAgICBpcyA9IHJlcXVpcmUoJy4vaXMnKSxcbiAgICBjcmVhdGVCb3VuZENvbXBhcmVGbiA9IGNvbXBhcmUuY3JlYXRlQm91bmRDb21wYXJlRm47XG5cbmZ1bmN0aW9uIF9jcmVhdGVJdGVyYXRvckZuKGZuLCBjb25maWcpIHtcbiAgICBpZihpcy5pc0Z1bmN0aW9uKGZuKSAmJiAoY29uZmlnID8gY29uZmlnLnR5cGUgIT09ICdzdHJpY3QnIDogdHJ1ZSkpIHtcbiAgICAgICAgcmV0dXJuIGNvbmZpZyA/IGZuLmJpbmQoY29uZmlnKSA6IGZuO1xuICAgIH1cblxuICAgIHJldHVybiBjcmVhdGVCb3VuZENvbXBhcmVGbihmbiwgY29uZmlnKTtcbn1cblxuZnVuY3Rpb24gX2NyZWF0ZUl0ZXJhdG9yTm90Rm4oZm4sIGNvbmZpZykge1xuICAgIHZhciBmdW5jdGlvblRvTm90ID0gX2NyZWF0ZUl0ZXJhdG9yRm4oZm4sIGNvbmZpZyk7XG4gICAgICAgIFxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICFmdW5jdGlvblRvTm90LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbn1cblxuXG4vKipcbiAqIEBjbGFzcyBMdWMuQXJyYXkgXG4gKiBQYWNrYWdlIGZvciBBcnJheSBtZXRob2RzLiA8YnI+XG4gKiBcbiAqIFRoZXJlIGEgbG90IG9mIGZ1bmN0aW9ucyBpbiB0aGlzIHBhY2thZ2UgYnV0IGFsbCBvZiB0aGVcbiAqIHJlbW92ZVxcKiAvIGZpbmRcXCogbWV0aG9kcyBmb2xsb3cgdGhlIHNhbWUgYXBpLiAgXFwqQWxsIGZ1bmN0aW9ucyB3aWxsIHJldHVybiBhbiBhcnJheSBvZiByZW1vdmVkIG9yIGZvdW5kXG4gKiBpdGVtcyBhbmQgZmFsc2UgaWYgbm9uZSBhcmUgZm91bmQuICBUaGUgaXRlbXMgd2lsbCBiZSBhZGRlZCB0byB0aGUgYXJyYXkgaW4gdGhlIG9yZGVyIHRoZXkgYXJlXG4gKiBmb3VuZC4gIFxcKkZpcnN0IGZ1bmN0aW9ucyB3aWxsIHJldHVybiB0aGUgZmlyc3QgaXRlbSBhbmQgc3RvcCBpdGVyYXRpbmcgYWZ0ZXIgdGhhdCwgaWYgbm9uZVxuICogIGlzIGZvdW5kIGZhbHNlIGlzIHJldHVybmVkLiAgcmVtb3ZlXFwqIGZ1bmN0aW9ucyB3aWxsIGRpcmVjdGx5IGNoYW5nZSB0aGUgcGFzc2VkIGluIGFycmF5LlxuICogIFxcKk5vdCBmdW5jdGlvbnMgb25seSBkbyB0aGUgZm9sbG93aW5nIGFjdGlvbnMgaWYgdGhlIGNvbXBhcmlzb24gaXMgbm90IHRydWUuXG4gKiAgQWxsIHJlbW92ZVxcKiAvIGZpbmRcXCogdGFrZSB0aGUgZm9sbG93aW5nIGFwaTogYXJyYXksIG9iamVjdFRvQ29tcGFyZU9ySXRlcmF0b3IsIGNvbXBhcmVDb25maWdPclRoaXNBcmcgZm9yIGV4YW1wbGU6XG4gKlxuICAgIEx1Yy5BcnJheS5maW5kRmlyc3QoWzEsMiwzLCB7fV0sIHt9KTtcbiAgICA+T2JqZWN0IHt9XG5cbiAgICBMdWMuQXJyYXkuZmluZEZpcnN0KFsxLDIsMyx7fV0sIHt9LCB7dHlwZTogJ3N0cmljdCd9KTtcbiAgICA+ZmFsc2VcblxuICAgIEx1Yy5BcnJheS5maW5kRmlyc3QoWzEsMiwzLHt9XSwgZnVuY3Rpb24odmFsLCBpbmRleCwgYXJyYXkpe1xuICAgICAgICByZXR1cm4gdmFsID09PSAzIHx8IHRoaXMubnVtID09PSB2YWw7XG4gICAgfSwge251bTogMX0pO1xuICAgID4xXG4gIFxuICogVGhlcmUgYWxzbyBtYW55IGZpbmRcXCpPYmplY3QsIHJlbW92ZVxcKk9iamVjdCBtZXRob2RzIHRoZXkgYWxsIGp1c3QgdGFrZSBhbiBhcnJheSBhc1xuICogdGhlIG9ubHkgcGFyYW1ldGVyIGFuZCBmb2xsb3cgdGhlIHNhbWUgZmluZFxcKiwgcmVtb3ZlXFwqIGNvdW50ZXJwYXJ0cy4gIEV2ZXJ5IHB1YmxpY1xuICogbWV0aG9kIG9mIEx1Yy5pcyBhdmFpbGFibGUgaXQgdXNlcyB0aGUgZm9sbG93aW5nIGdyYW1tZXIgTHVjLkFycmF5W1wibWV0aG9kTmFtZVwiXCJpc01ldGhvZE5hbWVcIl1cbiAqXG4gICAgICBMdWMuQXJyYXkuZmluZEFsbE5vdEVtcHR5KFtmYWxzZSwgdHJ1ZSwgbnVsbCwgdW5kZWZpbmVkLCAwLCAnJywgW10sIFsxXV0pXG4gICAgICA+IFt0cnVlLCAwLCBbMV1dXG5cbiAgICAgIEx1Yy5BcnJheS5maW5kQWxsTm90RmFsc3koW2ZhbHNlLCB0cnVlLCBudWxsLCB1bmRlZmluZWQsIDAsICcnLCBbXSwgWzFdXSlcbiAgICAgID4gW3RydWUsIDAsIFtdLCBbMV1dXG5cbiAgICAgIEx1Yy5BcnJheS5maW5kRmlyc3RTdHJpbmcoWzEsMiwzLCc1J10pXG4gICAgICA+XCI1XCJcbiAgICAgIEx1Yy5BcnJheS5maW5kRmlyc3ROb3RTdHJpbmcoWzEsMiwzLCc1J10pXG4gICAgICA+MVxuICAgICAgdmFyIGFyciA9IFsxLDIsMywnNSddO1xuICAgICAgTHVjLkFycmF5LnJlbW92ZUFsbE5vdFN0cmluZyhhcnIpO1xuICAgICAgPlsxLDIsM11cbiAgICAgIGFyclxuICAgICAgPltcIjVcIl1cbiAqXG4gKlxuICogS2VlcCBpbiBtaW5kIHRoYXQgTHVjIGlzIG9wdGlvbmFsbHkgcGFja2FnZWQgd2l0aCBlczUgc2hpbSBzbyB5b3UgY2FuIHRhcmdldCBub24tZXM1IGJyb3dzZXJzLlxuICogSXQgY29tZXMgd2l0aCB5b3VyIGZhdm9yaXRlIHtAbGluayBBcnJheSBBcnJheX0gbWV0aG9kcyBzdWNoIGFzIEFycmF5LmZvckVhY2gsIEFycmF5LmZpbHRlciwgQXJyYXkuc29tZSwgQXJyYXkuZXZlcnkgQXJyYXkucmVkdWNlUmlnaHQgLi5cbiAqXG4gKiBBbHNvIGRvbid0IGZvcmdldCBhYm91dCBMdWMuQXJyYXkuZWFjaCBhbmQgTHVjLkFycmF5LnRvQXJyYXksIHRoZXkgYXJlIGdyZWF0IHV0aWxpdHkgbWV0aG9kc1xuICogdGhhdCBhcmUgdXNlZCBhbGwgb3ZlciB0aGUgZnJhbWV3b3JrLlxuICogXG4gKi9cblxuLyoqXG4gKiBUdXJuIHRoZSBwYXNzZWQgaW4gaXRlbSBpbnRvIGFuIGFycmF5IGlmIGl0XG4gKiBpc24ndCBvbmUgYWxyZWFkeSwgaWYgdGhlIGl0ZW0gaXMgYW4gYXJyYXkganVzdCByZXR1cm4gaXQuICBcbiAqIEl0IHJldHVybnMgYW4gZW1wdHkgYXJyYXkgaWYgaXRlbSBpcyBudWxsIG9yIHVuZGVmaW5lZC5cbiAqIElmIGl0IGlzIGp1c3QgYSBzaW5nbGUgaXRlbSByZXR1cm4gYW4gYXJyYXkgY29udGFpbmluZyB0aGUgaXRlbS5cbiAqIFxuICAgIEx1Yy5BcnJheS50b0FycmF5KClcbiAgICA+W11cbiAgICBMdWMuQXJyYXkudG9BcnJheShudWxsKVxuICAgID5bXVxuICAgIEx1Yy5BcnJheS50b0FycmF5KDEpXG4gICAgPlsxXVxuICAgIEx1Yy5BcnJheS50b0FycmF5KFsxLDJdKVxuICAgID5bMSwgMl1cbiAqXG4gKiBAcGFyYW0gIHtPYmplY3R9IGl0ZW0gaXRlbSB0byB0dXJuIGludG8gYW4gYXJyYXkuXG4gKiBAcmV0dXJuIHRoZSBhcnJheVxuICovXG5mdW5jdGlvbiB0b0FycmF5KGl0ZW0pIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShpdGVtKSkge1xuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICB9XG4gICAgcmV0dXJuIChpdGVtID09PSBudWxsIHx8IGl0ZW0gPT09IHVuZGVmaW5lZCkgPyBbXSA6IFtpdGVtXTtcbn1cblxuLyoqXG4gKiBSdW5zIGFuIEFycmF5LmZvckVhY2ggYWZ0ZXIgY2FsbGluZyBMdWMuQXJyYXkudG9BcnJheSBvbiB0aGUgaXRlbS5cbiAqIEBwYXJhbSAge09iamVjdH0gICBpdGVtXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gZm4gICAgICAgIFxuICogQHBhcmFtICB7T2JqZWN0fSAgIGNvbnRleHQgICBcbiAqXG4gIEl0IGlzIHZlcnkgdXNlZnVsIGZvciBzZXR0aW5nIHVwIGZsZXhhYmxlIGFwaSdzIHRoYXQgY2FuIGhhbmRsZSBub25lIG9uZSBvciBtYW55LlxuXG4gICAgTHVjLkFycmF5LmVhY2godGhpcy5pdGVtcywgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICB0aGlzLl9hZGRJdGVtKGl0ZW0pO1xuICAgIH0pO1xuXG4gICAgdnMuXG5cbiAgICBpZihBcnJheS5pc0FycmF5KHRoaXMuaXRlbXMpKXtcbiAgICAgICAgdGhpcy5pdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgIHRoaXMuX2FkZEl0ZW0oaXRlbSk7XG4gICAgICAgIH0pXG4gICAgfVxuICAgIGVsc2UgaWYodGhpcy5pdGVtcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuX2FkZEl0ZW0odGhpcy5pdGVtcyk7XG4gICAgfVxuXG4gKi9cbmZ1bmN0aW9uIGVhY2goaXRlbSwgZm4sIGNvbnRleHQpIHtcbiAgICB2YXIgYXJyID0gdG9BcnJheShpdGVtKTtcbiAgICByZXR1cm4gYXJyLmZvckVhY2guY2FsbChhcnIsIGZuLCBjb250ZXh0KTtcbn1cblxuLyoqXG4gKiBJbnNlcnQgb3IgYXBwZW5kIHRoZSBzZWNvbmQgYXJyYXkvYXJndW1lbnRzIGludG8gdGhlXG4gKiBmaXJzdCBhcnJheS9hcmd1bWVudHMuICBUaGlzIG1ldGhvZCBkb2VzIG5vdCBhbHRlclxuICogdGhlIHBhc3NlZCBpbiBhcnJheS9hcmd1bWVudHMuXG4gKiBcbiAqIEBwYXJhbSAge0FycmF5L2FyZ3VtZW50c30gZmlyc3RBcnJheU9yQXJnc1xuICogQHBhcmFtICB7QXJyYXkvYXJndW1lbnRzfSBzZWNvbmRBcnJheU9yQXJnc1xuICogQHBhcmFtICB7TnVtYmVyL3RydWV9IGluZGV4T3JBcHBlbmQgdHJ1ZSB0byBhcHBlbmQgXG4gKiB0aGUgc2Vjb25kIGFycmF5IHRvIHRoZSBlbmQgb2YgdGhlIGZpcnN0IG9uZS4gIElmIGl0IGlzIGEgbnVtYmVyXG4gKiBpbnNlcnQgdGhlIHNlY29uZEFycmF5IGludG8gdGhlIGZpcnN0IG9uZSBhdCB0aGUgcGFzc2VkIGluIGluZGV4LlxuICAgXG4gICAgTHVjLkFycmF5Lmluc2VydChbMCw0XSwgWzEsMiwzXSwgMSk7XG4gICAgPlswLCAxLCAyLCAzLCA0XVxuICAgIEx1Yy5BcnJheS5pbnNlcnQoWzAsNF0sIFsxLDIsM10sIHRydWUpO1xuICAgID5bMCwgNCwgMSwgMiwgM11cbiAgICBMdWMuQXJyYXkuaW5zZXJ0KFswLDRdLCBbMSwyLDNdLCAwKTtcbiAgICA+WzEsIDIsIDMsIDAsIDRdXG4gXG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqL1xuZnVuY3Rpb24gaW5zZXJ0KGZpcnN0QXJyYXlPckFyZ3MsIHNlY29uZEFycmF5T3JBcmdzLCBpbmRleE9yQXBwZW5kKSB7XG4gICAgdmFyIGZpcnN0QXJyYXkgPSBhcnJheVNsaWNlLmNhbGwoZmlyc3RBcnJheU9yQXJncyksXG4gICAgICAgIHNlY29uZEFycmF5ID0gYXJyYXlTbGljZS5jYWxsKHNlY29uZEFycmF5T3JBcmdzKSxcbiAgICAgICAgc3BsaWNlQXJncywgXG4gICAgICAgIHJldHVybkFycmF5O1xuXG4gICAgaWYoaW5kZXhPckFwcGVuZCA9PT0gdHJ1ZSkge1xuICAgICAgICByZXR1cm5BcnJheSA9IGZpcnN0QXJyYXkuY29uY2F0KHNlY29uZEFycmF5KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHNwbGljZUFyZ3MgPSBbaW5kZXhPckFwcGVuZCwgMF0uY29uY2F0KHNlY29uZEFycmF5KTtcbiAgICAgICAgZmlyc3RBcnJheS5zcGxpY2UuYXBwbHkoZmlyc3RBcnJheSwgc3BsaWNlQXJncyk7XG5cbiAgICAgICAgcmV0dXJuIGZpcnN0QXJyYXk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldHVybkFycmF5O1xufVxuXG4vKipcbiAqIFJlbW92ZSBhbiBpdGVtIGZyb20gYW4gdGhlIHBhc3NlZCBpbiBhcnJcbiAqIGZyb20gdGhlIGluZGV4LlxuICogQHBhcmFtICB7QXJyYXl9IGFyclxuICogQHBhcmFtICB7TnVtYmVyfSBpbmRleFxuICogQHJldHVybiB7T2JqZWN0fSB0aGUgaXRlbSByZW1vdmVkLlxuICovXG5mdW5jdGlvbiByZW1vdmVBdEluZGV4KGFyciwgaW5kZXgpIHtcbiAgICB2YXIgaXRlbSA9IGFycltpbmRleF07XG4gICAgYXJyLnNwbGljZShpbmRleCwgMSk7XG4gICAgcmV0dXJuIGl0ZW07XG59XG5cbmZ1bmN0aW9uIF9yZW1vdmVGaXJzdChhcnIsIGZuKSB7XG4gICAgdmFyIHJlbW92ZWQgPSBmYWxzZTtcblxuICAgIGFyci5zb21lKGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xuICAgICAgICBpZiAoZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKSkge1xuICAgICAgICAgICAgcmVtb3ZlZCA9IHJlbW92ZUF0SW5kZXgoYXJyLCBpbmRleCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlbW92ZWQ7XG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBmaXJzdCBpdGVtIGZyb20gdGhlIHBhc3NlZCBpbiBhcnJheVxuICogdGhhdCBtYXRjaGVzIHRoZSBwYXNzZWQgaW4gb2JqZWN0LiAgSW5zdGVhZCBvZiBcbiAqIGNvbXBhcmluZyBhbiBvYmplY3QgYW4gaXRlcmF0b3IgZnVuY3Rpb24gY2FuIGJlXG4gKiB1c2VkLlxuICogXG4gKiBAcGFyYW0gIHtBcnJheX0gYXJyXG4gKiBAcGFyYW0gIHtBbnkvRnVuY3Rpb259IG9iamVjdE9ySXRlcmF0b3IgaWYgdGhlIHZhbHVlXG4gKiBpcyB7QGxpbmsgTHVjI2NvbXBhcmUgZXF1YWx9IHRvIG9yIHRoZSBpdGVyYXRvciByZXR1cm5zIHRydWUgcmVtb3ZlIHRoZSBcbiAqIG9iamVjdCBmcm9tIHRoZSBhcnJheS5cbiAqIFxuICogSWYgYW4gaXRlcmF0b3IgZnVuY3Rpb24gaXMgcGFzc2VkIGl0IHdpbGwgYmUgY2FsbGVkIHdpdGggdGhlIGZvbGxvd2luZyBcbiAqIHBhcmFtZXRlcnMuICBUaGUgc2FtZSBwYXJhbWV0ZXIgdG8gQXJyYXkuZm9yRWFjaFxuICogXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0T3JJdGVyYXRvci52YWx1ZSBcbiAqIEBwYXJhbSB7TnVtYmVyfSBvYmplY3RPckl0ZXJhdG9yLm51bWJlclxuICogQHBhcmFtIHtBcnJheX0gb2JqZWN0T3JJdGVyYXRvci5hcnJheVxuICpcbiAqIFxuICogQHBhcmFtICB7T2JqZWN0fSBbY29uZmlnT3J0aGlzQXJnXVxuICogXG4gKiB0aGlzQXJnIGZvciB0aGUgaXRlcmF0b3IgZnVuY3Rpb24gYW4gaXRlcmF0b3IgaXNcbiAqIHVzZWQuXG4gKiBcbiAqIE9wdGlvbiBjb25maWcgb2JqZWN0IGZvciBMdWMuY29tcGFyZSBpZiBhbiBpdGVyYXRvclxuICogZnVuY3Rpb24gaXMgbm90IHBhc3NlZCBpbi4gIElmIHlvdSB3YW50IHRvIGFjdHVhbGx5XG4gKiBkbyBhIGRpcmVjdCBlcXVhbGl0eSBjb21wYXJpc29uIG9uIGEgZnVuY3Rpb24gaW5zdGVhZCBvZlxuICogdXNpbmcgaXQgYXMgYW4gaXRlcmF0b3IgcGFzcyBpbiB7dHlwZTogJ3N0cmljdCd9XG4gKiBcbiAqIEByZXR1cm4ge09iamVjdH0gdGhlIG9iamVjdCB0aGF0IHdhcyByZW1vdmVkXG4gKiBmYWxzZSBpZiBubyBvYmplY3Qgd2FzIHJlbW92ZWQ7XG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUZpcnN0KGFyciwgb2JqLCBjb25maWcpIHtcbiAgICB2YXIgZm4gPSBfY3JlYXRlSXRlcmF0b3JGbihvYmosIGNvbmZpZyk7XG4gICAgcmV0dXJuIF9yZW1vdmVGaXJzdChhcnIsIGZuKTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGZpcnN0IGl0ZW0gZnJvbSB0aGUgcGFzc2VkIGluIEFycmF5XG4gKiB0aGF0IGRvZXMgbm90IG1hdGNoIHRoZSBwYXNzZWQgaW4gb2JqZWN0LlxuICogXG4gKiBAcGFyYW0gIHtBcnJheX0gYXJyXG4gKiBAcGFyYW0gIHtBbnl9IG9iamVjdFxuICogQHBhcmFtICB7T2JqZWN0fSBbY29uZmlnXSBcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW2NvbmZpZy5zaGFsbG93XSBkZWZhdWx0cyB0byB0cnVlXG4gKiBwYXNzIGluIGZhbHNlIHRvIGRvIGEgZGlyZWN0IGVxdWFsdHkgY29tcGFyaXNvblxuICogZm9yIEFycmF5cyBPYmplY3RzIG9yIEZhbHN5cy5cbiAqIFxuICogQHJldHVybiB7T2JqZWN0fSB0aGlzIG9iamVjdCB0aGF0IHdhcyByZW1vdmVkXG4gKiBmYWxzZSBpZiBubyBvYmplY3Qgd2FzIHJlbW92ZWQ7XG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUZpcnN0Tm90KGFyciwgb2JqLCBjb25maWcpIHtcbiAgICB2YXIgZm4gPSBfY3JlYXRlSXRlcmF0b3JOb3RGbihvYmosIGNvbmZpZyk7XG4gICAgcmV0dXJuIF9yZW1vdmVGaXJzdChhcnIsIGZuKTtcbn1cblxuXG5mdW5jdGlvbiBfcmVtb3ZlQWxsKGFyciwgZm4pIHtcbiAgICB2YXIgaW5kZXhzVG9SZW1vdmUgPSBbXSxcbiAgICAgICAgcmVtb3ZlZCA9IFtdO1xuXG4gICAgYXJyLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XG4gICAgICAgIGlmIChmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSB7XG4gICAgICAgICAgICBpbmRleHNUb1JlbW92ZS51bnNoaWZ0KGluZGV4KTtcbiAgICAgICAgICAgIHJlbW92ZWQucHVzaCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGluZGV4c1RvUmVtb3ZlLmZvckVhY2goZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgICByZW1vdmVBdEluZGV4KGFyciwgaW5kZXgpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlbW92ZWQubGVuZ3RoID8gcmVtb3ZlZCA6IGZhbHNlO1xufVxuXG4vKipcbiAqIFNhbWUgYXBpIGFzIEx1Yy5BcnJheS5yZW1vdmVBbGwgZXhjZXB0XG4gKiByZW1vdmUgdGhlIGl0ZW1zIHRoYXQgYXJlIG5vdCBlcXVhbCB0byB0aGUgcGFzc2VkIGluXG4gKiBvYmplY3QuXG4gKiBcbiAqIEBwYXJhbSAge0FycmF5fSBhcnJcbiAqIEBwYXJhbSAge0FueX0gb2JqZWN0XG4gKiBAcGFyYW0gIHtPYmplY3R9IFtjb25maWddIEJ5IGRlZmF1bHQgc2hhbGxvdyBjb21wYXJlIHdpbGxcbiAqIGJlIHVzZWQgZm9yIE9iamVjdHMgYW5kIEFycmF5cyBwYXNzZWQgaW4gdHJ1ZSB0byBkb1xuICogYSA9PT0gY29tcGFyaXNvbi5cbiAqIFxuICogQHJldHVybiB7T2JqZWN0W119ICBBbiBhcnJheSBvZiBpdGVtcyByZW1vdmVkXG4gKiBmYWxzZSBpZiBub25lIGFyZSByZW1vdmVkLlxuICovXG5mdW5jdGlvbiByZW1vdmVBbGxOb3QoYXJyLCBvYmosIGNvbmZpZykge1xuICAgIHZhciBmbiA9IF9jcmVhdGVJdGVyYXRvck5vdEZuKG9iaiwgY29uZmlnKTtcbiAgICByZXR1cm4gX3JlbW92ZUFsbChhcnIsIGZuKTtcbn1cblxuLyoqXG4gKiBGaW5kIHRoZSBmaXJzdCBhbGwgaXRlbXMgdGhhdCBhcmUgZXF1YWwgdG8gdGhlXG4gKiBwYXNzZWQgaW4gb2JqZWN0LiBCeSBkZWZ1YWx0IE9iamVjdHMgYW5kIEFycmF5cyBhcmUgXG4gKiBjb21wYXJlZCB3aXRoIGEgc2hhbGxvdyBjb21wYXJpc29uLlxuICogXG4gKiBAcGFyYW0gIHtBcnJheX0gYXJyXG4gKiBAcGFyYW0gIHtBbnl9IG9iamVjdFxuICogQHBhcmFtICB7T2JqZWN0fSBbY29uZmlnXSBcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW2NvbmZpZy5zaGFsbG93XSBkZWZhdWx0cyB0byB0cnVlXG4gKiBwYXNzIGluIGZhbHNlIHRvIGRvIGEgZGlyZWN0IGVxdWFsdHkgY29tcGFyaXNvblxuICogZm9yIEFycmF5cyBPYmplY3RzIG9yIEZhbHN5cy5cbiAqIFxuICogQHJldHVybiB7T2JqZWN0W119ICBBbiBhcnJheSBvZiBpdGVtcyByZW1vdmVkXG4gKiBmYWxzZSBpZiBub25lIGFyZSByZW1vdmVkLlxuICovXG5mdW5jdGlvbiByZW1vdmVBbGwoYXJyLCBvYmosIGNvbmZpZykge1xuICAgIHZhciBmbiA9IF9jcmVhdGVJdGVyYXRvckZuKG9iaiwgY29uZmlnKTtcbiAgICByZXR1cm4gX3JlbW92ZUFsbChhcnIsIGZuKTtcbn1cblxuZnVuY3Rpb24gX2ZpbmRGaXJzdChhcnIsIGZuKSB7XG4gICAgdmFyIGl0ZW0gPSBmYWxzZTtcbiAgICBhcnIuc29tZShmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcbiAgICAgICAgaWYgKGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpIHtcbiAgICAgICAgICAgIGl0ZW0gPSBhcnJbaW5kZXhdO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBpdGVtO1xufVxuXG4vKipcbiAqIFJldHVybiB0aGUgZmlyc3QgaXRlbSBmcm9tIHRoZSBwYXNzZWQgaW4gQXJyYXlcbiAqIHRoYXQgIG1hdGNoZXMgdGhlIHBhc3NlZCBpbiBvYmplY3QuXG4gKiBcbiAqIEBwYXJhbSAge0FycmF5fSBhcnJcbiAqIEBwYXJhbSAge0FueX0gb2JqZWN0XG4gKiBAcGFyYW0gIHtPYmplY3R9IFtjb25maWddIFxuICogQHBhcmFtIHtCb29sZWFufSBbY29uZmlnLnNoYWxsb3ddIGRlZmF1bHRzIHRvIHRydWVcbiAqIHBhc3MgaW4gZmFsc2UgdG8gZG8gYSBkaXJlY3QgZXF1YWx0eSBjb21wYXJpc29uXG4gKiBmb3IgQXJyYXlzIE9iamVjdHMgb3IgRmFsc3lzLlxuICogXG4gKiBAcmV0dXJuIHtPYmplY3R9IHRoaXMgb2JqZWN0IHRoYXQgd2FzIHJlbW92ZWRcbiAqIGZhbHNlIGlmIG5vIG9iamVjdCB3YXMgcmVtb3ZlZDtcbiAqL1xuZnVuY3Rpb24gZmluZEZpcnN0KGFyciwgb2JqLCBjb25maWcpIHtcbiAgICB2YXIgZm4gPSBfY3JlYXRlSXRlcmF0b3JGbihvYmosIGNvbmZpZyk7XG4gICAgcmV0dXJuIF9maW5kRmlyc3QoYXJyLCBmbik7XG59XG5cbi8qKlxuICogUmV0dXJuIHRoZSBmaXJzdCBpdGVtIGZyb20gdGhlIHBhc3NlZCBpbiBBcnJheVxuICogdGhhdCBkb2VzIG5vdCBtYXRjaCB0aGUgcGFzc2VkIGluIG9iamVjdC5cbiAqIFxuICogQHBhcmFtICB7QXJyYXl9IGFyclxuICogQHBhcmFtICB7QW55fSBvYmplY3RcbiAqIEBwYXJhbSAge09iamVjdH0gW2NvbmZpZ10gXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtjb25maWcuc2hhbGxvd10gZGVmYXVsdHMgdG8gdHJ1ZVxuICogcGFzcyBpbiBmYWxzZSB0byBkbyBhIGRpcmVjdCBlcXVhbHR5IGNvbXBhcmlzb25cbiAqIGZvciBBcnJheXMgT2JqZWN0cyBvciBGYWxzeXMuXG4gKiBcbiAqIEByZXR1cm4ge09iamVjdH0gdGhpcyBvYmplY3QgdGhhdCB3YXMgcmVtb3ZlZFxuICogZmFsc2UgaWYgbm8gb2JqZWN0IHdhcyByZW1vdmVkO1xuICovXG5mdW5jdGlvbiBmaW5kRmlyc3ROb3QoYXJyLCBvYmosIGNvbmZpZykge1xuICAgIHZhciBmbiA9IF9jcmVhdGVJdGVyYXRvck5vdEZuKG9iaiwgY29uZmlnKTtcbiAgICByZXR1cm4gX2ZpbmRGaXJzdChhcnIsIGZuKTtcbn1cblxuZnVuY3Rpb24gX2ZpbmRBbGwoYXJyLCBmbikge1xuICAgIHZhciBmb3VuZCA9IGFyci5maWx0ZXIoZm4pO1xuICAgIHJldHVybiBmb3VuZC5sZW5ndGggPyBmb3VuZCA6IGZhbHNlO1xufVxuXG4vKipcbiAqIFJldHVybiBhbGwgaXRlbXMgdGhhdCBhcmUgZXF1YWwgdG8gdGhlXG4gKiBwYXNzZWQgaW4gb2JqZWN0LiBCeSBkZWZ1YWx0IE9iamVjdHMgYW5kIEFycmF5cyBhcmUgXG4gKiBjb21wYXJlZCB3aXRoIGEgc2hhbGxvdyBjb21wYXJpc29uLlxuICogXG4gKiBAcGFyYW0gIHtBcnJheX0gYXJyXG4gKiBAcGFyYW0gIHtBbnl9IG9iamVjdFxuICogQHBhcmFtICB7T2JqZWN0fSBbY29uZmlnXSBcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW2NvbmZpZy5zaGFsbG93XSBkZWZhdWx0cyB0byB0cnVlXG4gKiBwYXNzIGluIGZhbHNlIHRvIGRvIGEgZGlyZWN0IGVxdWFsdHkgY29tcGFyaXNvblxuICogZm9yIEFycmF5cyBPYmplY3RzIG9yIEZhbHN5cy5cbiAqIFxuICogQHJldHVybiB7T2JqZWN0W119ICBBbiBhcnJheSBvZiBpdGVtcyBmb3VuZFxuICogZmFsc2UgaWYgbm9uZSBhcmUgZm91bmQuXG4gKi9cbmZ1bmN0aW9uIGZpbmRBbGwoYXJyLCBvYmosIGNvbmZpZykge1xuICAgIHZhciBmbiA9IF9jcmVhdGVJdGVyYXRvckZuKG9iaiwgY29uZmlnKTtcbiAgICByZXR1cm4gX2ZpbmRBbGwoYXJyLCBmbik7XG59XG5cbi8qKlxuICogUmV0dXJuIGFsbCBpdGVtcyB0aGF0IGFyZSBub3QgZXF1YWwgdG8gdGhlXG4gKiBwYXNzZWQgaW4gb2JqZWN0LiBCeSBkZWZ1YWx0IE9iamVjdHMgYW5kIEFycmF5cyBhcmUgXG4gKiBjb21wYXJlZCB3aXRoIGEgc2hhbGxvdyBjb21wYXJpc29uLlxuICogXG4gKiBAcGFyYW0gIHtBcnJheX0gYXJyXG4gKiBAcGFyYW0gIHtBbnl9IG9iamVjdFxuICogQHBhcmFtICB7T2JqZWN0fSBbY29uZmlnXSBcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW2NvbmZpZy5zaGFsbG93XSBkZWZhdWx0cyB0byB0cnVlXG4gKiBwYXNzIGluIGZhbHNlIHRvIGRvIGEgZGlyZWN0IGVxdWFsdHkgY29tcGFyaXNvblxuICogZm9yIEFycmF5cyBPYmplY3RzIG9yIEZhbHN5cy5cbiAqIFxuICogQHJldHVybiB7T2JqZWN0W119ICBBbiBhcnJheSBvZiBpdGVtcyBmb3VuZFxuICogZmFsc2UgaWYgbm9uZSBhcmUgZm91bmQuXG4gKi9cbmZ1bmN0aW9uIGZpbmRBbGxOb3QoYXJyLCBvYmosIGNvbmZpZykge1xuICAgIHZhciBmbiA9IF9jcmVhdGVJdGVyYXRvck5vdEZuKG9iaiwgY29uZmlnKTtcbiAgICByZXR1cm4gX2ZpbmRBbGwoYXJyLCBmbik7XG59XG5cblxuZXhwb3J0cy50b0FycmF5ID0gdG9BcnJheTtcbmV4cG9ydHMuZWFjaCA9IGVhY2g7XG5leHBvcnRzLmluc2VydCA9IGluc2VydDtcbmV4cG9ydHMucmVtb3ZlQXRJbmRleCA9IHJlbW92ZUF0SW5kZXg7XG5leHBvcnRzLmZpbmRGaXJzdE5vdCA9IGZpbmRGaXJzdE5vdDtcbmV4cG9ydHMuZmluZEFsbE5vdCA9IGZpbmRBbGxOb3Q7XG5leHBvcnRzLmZpbmRGaXJzdCA9IGZpbmRGaXJzdDtcbmV4cG9ydHMuZmluZEFsbCA9IGZpbmRBbGw7XG5cbmV4cG9ydHMucmVtb3ZlRmlyc3ROb3QgPSByZW1vdmVGaXJzdE5vdDtcbmV4cG9ydHMucmVtb3ZlQWxsTm90ID0gcmVtb3ZlQWxsTm90O1xuZXhwb3J0cy5yZW1vdmVGaXJzdCA9IHJlbW92ZUZpcnN0O1xuZXhwb3J0cy5yZW1vdmVBbGwgPSByZW1vdmVBbGw7XG5cbihmdW5jdGlvbigpIHtcbiAgICB2YXIgbmFtZXNUb0lzID0gWydmaW5kRmlyc3ROb3QnLCAnZmluZEFsbE5vdCcsICdmaW5kRmlyc3QnLCAnZmluZEFsbCcsXG4gICAgICAgICAgICAgICAgICAgICAncmVtb3ZlRmlyc3ROb3QnLCAncmVtb3ZlQWxsTm90JywgJ3JlbW92ZUZpcnN0JywgJ3JlbW92ZUFsbCddO1xuXG4gICAgZnVuY3Rpb24gX2NyZWF0ZUlzRm4oZm5OYW1lLCBrZXkpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGFycikge1xuICAgICAgICAgICAgcmV0dXJuIGV4cG9ydHNbZm5OYW1lXShhcnIsIGlzW2tleV0pO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIE9iamVjdC5rZXlzKGlzKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICB2YXIgbmFtZSA9IGtleS5zcGxpdCgnaXMnKVsxXTtcbiAgICAgICAgbmFtZXNUb0lzLmZvckVhY2goZnVuY3Rpb24oZm5OYW1lKSB7XG4gICAgICAgICAgICBleHBvcnRzW2ZuTmFtZSArIG5hbWVdID0gX2NyZWF0ZUlzRm4oZm5OYW1lLGtleSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSgpKTtcblxuLyoqXG4gKiBAbWVtYmVyIEx1Yy5BcnJheVxuICogQG1ldGhvZCBmaW5kRmlyc3ROb3RCb29sZWFuXG4gKiBSZXR1cm4gdGhlIGZpcnN0IGl0ZW0gdGhhdCBpcyBub3Qgb2YgdGhlIGFzc29jaWF0ZWQgdHlwZS5cbiAqIEBwYXJhbSB7QXJyYXl9IGFyclxuICpcbiAqIEByZXR1cm4ge09iamVjdH0gdGhlIG9iamVjdCBpZiBpdCB3YXMgZm91bmQsIGZhbHNlIGlmIGl0IHdhcyBcbiAqIG5vdCBmb3VuZC5cbiAqL1xuLyoqXG4gKiBAbWVtYmVyIEx1Yy5BcnJheVxuICogQG1ldGhvZCBmaW5kRmlyc3RCb29sZWFuXG4gKiBSZXR1cm4gdGhlIGZpcnN0IGl0ZW0gdGhhdCBpcyBvZiB0aGUgYXNzb2NpYXRlZCB0eXBlLlxuICogQHBhcmFtIHtBcnJheX0gYXJyXG4gKlxuICogQHJldHVybiB7T2JqZWN0fSB0aGUgb2JqZWN0IGlmIGl0IHdhcyBmb3VuZCwgZmFsc2UgaWYgaXQgd2FzIFxuICogbm90IGZvdW5kLlxuICovXG4vKipcbiAqIEBtZW1iZXIgTHVjLkFycmF5XG4gKiBAbWV0aG9kIGZpbmRBbGxOb3RCb29sZWFuXG4gKiBSZXR1cm4gYWxsIHRoZSBpdGVtcyB0aGF0IGFyZSBub3Qgb2YgdGhlIGFzc29jaWF0ZWQgdHlwZS5cbiAqIEBwYXJhbSB7QXJyYXl9IGFyclxuICpcbiAqIEByZXR1cm4ge0FueVtdfSB0aGUgYXJyYXkgb2Ygb2JqZWN0cyBmb3VuZCwgZmFsc2UgaWYgaXQgd2FzIFxuICogbm90IGZvdW5kLlxuICovXG5cbi8qKlxuICogQG1lbWJlciBMdWMuQXJyYXlcbiAqIEBtZXRob2QgZmluZEZpcnN0Tm90T2JqZWN0XG4gKiBAaW5oZXJpdGRvYyBMdWMuQXJyYXkjZmluZEZpcnN0Tm90Qm9vbGVhblxuICovXG4vKipcbiAqIEBtZW1iZXIgTHVjLkFycmF5XG4gKiBAbWV0aG9kIGZpbmRGaXJzdE9iamVjdFxuICogQGluaGVyaXRkb2MgTHVjLkFycmF5I2ZpbmRGaXJzdEJvb2xlYW5cbiAqL1xuLyoqXG4gKiBAbWVtYmVyIEx1Yy5BcnJheVxuICogQG1ldGhvZCBmaW5kQWxsTm90T2JqZWN0XG4gKiBAaW5oZXJpdGRvYyBMdWMuQXJyYXkjZmluZEFsbE5vdEJvb2xlYW5cbiAqL1xuLyoqXG4gKiBAbWVtYmVyIEx1Yy5BcnJheVxuICogQG1ldGhvZCBmaW5kQWxsT2JqZWN0XG4gKiBAaW5oZXJpdGRvYyBMdWMuQXJyYXkjZmluZEFsbEJvb2xlYW5cbiAqL1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjLkFycmF5XG4gKiBAbWV0aG9kIGZpbmRGaXJzdE5vdEZ1bmN0aW9uXG4gKiBAaW5oZXJpdGRvYyBMdWMuQXJyYXkjZmluZEZpcnN0Tm90Qm9vbGVhblxuICovXG4vKipcbiAqIEBtZW1iZXIgTHVjLkFycmF5XG4gKiBAbWV0aG9kIGZpbmRGaXJzdEZ1bmN0aW9uXG4gKiBAaW5oZXJpdGRvYyBMdWMuQXJyYXkjZmluZEZpcnN0Qm9vbGVhblxuICovXG4vKipcbiAqIEBtZW1iZXIgTHVjLkFycmF5XG4gKiBAbWV0aG9kIGZpbmRBbGxOb3RGdW5jdGlvblxuICogQGluaGVyaXRkb2MgTHVjLkFycmF5I2ZpbmRBbGxOb3RCb29sZWFuXG4gKi9cbi8qKlxuICogQG1lbWJlciBMdWMuQXJyYXlcbiAqIEBtZXRob2QgZmluZEFsbEZ1bmN0aW9uXG4gKiBAaW5oZXJpdGRvYyBMdWMuQXJyYXkjZmluZEFsbEJvb2xlYW5cbiAqL1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjLkFycmF5XG4gKiBAbWV0aG9kIGZpbmRGaXJzdE5vdFN0cmluZ1xuICogQGluaGVyaXRkb2MgTHVjLkFycmF5I2ZpbmRGaXJzdE5vdEJvb2xlYW5cbiAqL1xuLyoqXG4gKiBAbWVtYmVyIEx1Yy5BcnJheVxuICogQG1ldGhvZCBmaW5kRmlyc3RTdHJpbmdcbiAqIEBpbmhlcml0ZG9jIEx1Yy5BcnJheSNmaW5kRmlyc3RCb29sZWFuXG4gKi9cbi8qKlxuICogQG1lbWJlciBMdWMuQXJyYXlcbiAqIEBtZXRob2QgZmluZEFsbE5vdFN0cmluZ1xuICogQGluaGVyaXRkb2MgTHVjLkFycmF5I2ZpbmRBbGxOb3RCb29sZWFuXG4gKi9cbi8qKlxuICogQG1lbWJlciBMdWMuQXJyYXlcbiAqIEBtZXRob2QgZmluZEFsbFN0cmluZ1xuICogQGluaGVyaXRkb2MgTHVjLkFycmF5I2ZpbmRBbGxCb29sZWFuXG4gKi9cbi8qKlxuICogQG1lbWJlciBMdWMuQXJyYXlcbiAqIEBtZXRob2QgZmluZEZpcnN0Tm90U3RyaW5nXG4gKiBAaW5oZXJpdGRvYyBMdWMuQXJyYXkjZmluZEZpcnN0Tm90Qm9vbGVhblxuICovXG4vKipcbiAqIEBtZW1iZXIgTHVjLkFycmF5XG4gKiBAbWV0aG9kIGZpbmRGaXJzdFN0cmluZ1xuICogQGluaGVyaXRkb2MgTHVjLkFycmF5I2ZpbmRGaXJzdEJvb2xlYW5cbiAqL1xuLyoqXG4gKiBAbWVtYmVyIEx1Yy5BcnJheVxuICogQG1ldGhvZCBmaW5kQWxsTm90U3RyaW5nXG4gKiBAaW5oZXJpdGRvYyBMdWMuQXJyYXkjZmluZEFsbE5vdEJvb2xlYW5cbiAqL1xuLyoqXG4gKiBAbWVtYmVyIEx1Yy5BcnJheVxuICogQG1ldGhvZCBmaW5kQWxsU3RyaW5nXG4gKiBAaW5oZXJpdGRvYyBMdWMuQXJyYXkjZmluZEFsbEJvb2xlYW5cbiAqL1xuLyoqXG4gKiBAbWVtYmVyIEx1Yy5BcnJheVxuICogQG1ldGhvZCBmaW5kRmlyc3ROb3RSZWdFeHBcbiAqIEBpbmhlcml0ZG9jIEx1Yy5BcnJheSNmaW5kRmlyc3ROb3RCb29sZWFuXG4gKi9cbi8qKlxuICogQG1lbWJlciBMdWMuQXJyYXlcbiAqIEBtZXRob2QgZmluZEZpcnN0UmVnRXhwXG4gKiBAaW5oZXJpdGRvYyBMdWMuQXJyYXkjZmluZEZpcnN0Qm9vbGVhblxuICovXG4vKipcbiAqIEBtZW1iZXIgTHVjLkFycmF5XG4gKiBAbWV0aG9kIGZpbmRBbGxOb3RSZWdFeHBcbiAqIEBpbmhlcml0ZG9jIEx1Yy5BcnJheSNmaW5kQWxsTm90Qm9vbGVhblxuICovXG4vKipcbiAqIEBtZW1iZXIgTHVjLkFycmF5XG4gKiBAbWV0aG9kIGZpbmRBbGxSZWdFeHBcbiAqIEBpbmhlcml0ZG9jIEx1Yy5BcnJheSNmaW5kQWxsQm9vbGVhblxuICovXG4vKipcbiAqIEBtZW1iZXIgTHVjLkFycmF5XG4gKiBAbWV0aG9kIGZpbmRGaXJzdE5vdERhdGVcbiAqIEBpbmhlcml0ZG9jIEx1Yy5BcnJheSNmaW5kRmlyc3ROb3RCb29sZWFuXG4gKi9cbi8qKlxuICogQG1lbWJlciBMdWMuQXJyYXlcbiAqIEBtZXRob2QgZmluZEZpcnN0RGF0ZVxuICogQGluaGVyaXRkb2MgTHVjLkFycmF5I2ZpbmRGaXJzdEJvb2xlYW5cbiAqL1xuLyoqXG4gKiBAbWVtYmVyIEx1Yy5BcnJheVxuICogQG1ldGhvZCBmaW5kQWxsTm90RGF0ZVxuICogQGluaGVyaXRkb2MgTHVjLkFycmF5I2ZpbmRBbGxOb3RCb29sZWFuXG4gKi9cbi8qKlxuICogQG1lbWJlciBMdWMuQXJyYXlcbiAqIEBtZXRob2QgZmluZEFsbERhdGVcbiAqIEBpbmhlcml0ZG9jIEx1Yy5BcnJheSNmaW5kQWxsQm9vbGVhblxuICovXG5cbiIsInZhciBpcyA9IHJlcXVpcmUoJy4vaXMnKTtcblxuZnVuY3Rpb24gX3N0cmljdCh2YWwxLCB2YWwyKXtcbiAgICByZXR1cm4gdmFsMSA9PT0gdmFsMjtcbn1cblxuZnVuY3Rpb24gX2NvbXBhcmVBcnJheUxlbmd0aCh2YWwxLCB2YWwyKSB7XG4gICAgcmV0dXJuKGlzLmlzQXJyYXkodmFsMSkgJiYgaXMuaXNBcnJheSh2YWwyKSAgJiYgdmFsMS5sZW5ndGggPT09IHZhbDIubGVuZ3RoKTtcbn1cblxuZnVuY3Rpb24gX3NoYWxsb3dBcnJheSh2YWwxLCB2YWwyKSB7XG4gICAgdmFyIGkgPSAwLFxuICAgICAgICBsZW47XG4gICAgXG4gICAgaWYoIV9jb21wYXJlQXJyYXlMZW5ndGgodmFsMSwgdmFsMikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGZvcihsZW4gPSB2YWwxLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgIGlmKHZhbDFbaV0gIT09IHZhbDJbaV0pIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBfZGVlcEFycmF5KHZhbDEsIHZhbDIpIHtcbiAgICB2YXIgaSA9IDAsXG4gICAgICAgIGxlbjtcbiAgICBcbiAgICBpZighX2NvbXBhcmVBcnJheUxlbmd0aCh2YWwxLCB2YWwyKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZm9yKGxlbiA9IHZhbDEubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgaWYoIWNvbXBhcmUodmFsMVtpXSx2YWwyW2ldLCB7dHlwZTogJ2RlZXAnfSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBfY29tcGFyZU9iamVjdEtleXNMZW5ndGgodmFsMSwgdmFsMikge1xuICAgIHJldHVybiAoaXMuaXNPYmplY3QodmFsMSkgJiYgaXMuaXNPYmplY3QodmFsMikgJiYgT2JqZWN0LmtleXModmFsMSkubGVuZ3RoID09PSBPYmplY3Qua2V5cyh2YWwyKS5sZW5ndGgpO1xufVxuXG5mdW5jdGlvbiBfc2hhbGxvd09iamVjdCh2YWwxLCB2YWwyKSB7XG4gICAgdmFyIGtleSwgdmFsO1xuXG4gICAgaWYgKCFfY29tcGFyZU9iamVjdEtleXNMZW5ndGgodmFsMSwgdmFsMikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGZvciAoa2V5IGluIHZhbDEpIHtcbiAgICAgICAgaWYgKHZhbDEuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgdmFsdWUgPSB2YWwxW2tleV07XG4gICAgICAgICAgICBpZiAoIXZhbDIuaGFzT3duUHJvcGVydHkoa2V5KSB8fCB2YWwyW2tleV0gIT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIF9kZWVwT2JqZWN0KHZhbDEsIHZhbDIpIHtcbiAgICB2YXIga2V5LCB2YWw7XG5cbiAgICBpZiAoIV9jb21wYXJlT2JqZWN0S2V5c0xlbmd0aCh2YWwxLCB2YWwyKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZm9yIChrZXkgaW4gdmFsMSkge1xuICAgICAgICBpZiAodmFsMS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbDFba2V5XTtcbiAgICAgICAgICAgIGlmICghdmFsMi5oYXNPd25Qcm9wZXJ0eShrZXkpIHx8IGNvbXBhcmUodmFsdWUsIHZhbDJba2V5XSwge3R5cGU6ICdkZWVwJ30pICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG5cbn1cblxuZnVuY3Rpb24gX2RhdGUodmFsMSwgdmFsMikge1xuICAgIGlmKGlzLmlzRGF0ZSh2YWwxKSAmJiBpcy5pc0RhdGUodmFsMikpIHtcbiAgICAgICAgcmV0dXJuIHZhbDEuZ2V0VGltZSgpID09PSB2YWwyLmdldFRpbWUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIF9jcmVhdGVCb3VuZENvbXBhcmUob2JqZWN0LCBmbikge1xuICAgIHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gZm4ob2JqZWN0LCB2YWx1ZSk7XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0Q29tcGFyZUZuKG9iamVjdCwgYykge1xuICAgIHZhciBjb21wYXJlRm4gPSBfc3RyaWN0LFxuICAgICAgICBjb25maWcgPSBjIHx8IHt9O1xuXG4gICAgaWYgKGNvbmZpZy50eXBlID09PSAnc2hhbGxvdycgfHwgY29uZmlnLnR5cGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAoaXMuaXNPYmplY3Qob2JqZWN0KSkge1xuICAgICAgICAgICAgY29tcGFyZUZuID0gX3NoYWxsb3dPYmplY3Q7XG4gICAgICAgIH0gZWxzZSBpZiAoaXMuaXNBcnJheShvYmplY3QpKSB7XG4gICAgICAgICAgICBjb21wYXJlRm4gPSBfc2hhbGxvd0FycmF5O1xuICAgICAgICB9IGVsc2UgaWYgKGlzLmlzRGF0ZShvYmplY3QpKSB7XG4gICAgICAgICAgICBjb21wYXJlRm4gPSBfZGF0ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmKGNvbmZpZy50eXBlID09PSAnZGVlcCcpIHtcbiAgICAgICAgaWYgKGlzLmlzT2JqZWN0KG9iamVjdCkpIHtcbiAgICAgICAgICAgIGNvbXBhcmVGbiA9IF9kZWVwT2JqZWN0O1xuICAgICAgICB9IGVsc2UgaWYgKGlzLmlzQXJyYXkob2JqZWN0KSkge1xuICAgICAgICAgICAgY29tcGFyZUZuID0gX2RlZXBBcnJheTtcbiAgICAgICAgfSBlbHNlIGlmIChpcy5pc0RhdGUob2JqZWN0KSkge1xuICAgICAgICAgICAgY29tcGFyZUZuID0gX2RhdGU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZihjb25maWcudHlwZSAhPT0gJ3N0cmljdCcpIHtcbiAgICAgICAgLy93ZSB3b3VsZCBiZSBkb2luZyBhIHN0cmljdCBjb21wYXJpc29uIG9uIGEgdHlwZS1vXG4gICAgICAgIC8vSSB0aGluayBhbiBlcnJvciBpcyBnb29kIGhlcmUuXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignWW91IHBhc3NlZCBpbiBhbiBpbnZhbGlkIGNvbXBhcmlzb24gdHlwZScpO1xuICAgIH1cblxuICAgIHJldHVybiBjb21wYXJlRm47XG59XG5cbi8qKlxuICogQG1lbWJlciBMdWNcbiAqIEBtZXRob2QgY29tcGFyZVxuICogXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWVzIGFyZSBlcXVhbCB0byBlYWNoXG4gKiBvdGhlci4gIEJ5IGRlZmF1bHQgYSBzaGFsbG93IGNvbXBhcmlzb24gaXMgXG4gKiBkb25lIG9uIGFycmF5cywgZGF0ZXMgYW5kIG9iamVjdHMgYW5kIGEgc3RyaWN0IGNvbXBhcmlzb25cbiAqIGlzIGRvbmUgb24gb3RoZXIgdHlwZXMuXG4gKiBcbiAqIEBwYXJhbSAge0FueX0gdmFsMSAgXG4gKiBAcGFyYW0gIHtBbnl9IHZhbDIgICBcbiAqIEBwYXJhbSAge09iamVjdH0gW2NvbmZpZ11cbiAqIEBwYXJhbSB7U3RyaW5nfSBjb25maWcudHlwZSBwYXNzIGluICdkZWVwJyBmb3IgYSBkZWVwXG4gKiBjb21wYXJpc29uLCAnc2hhbGxvdycgKGRlZmF1bHQpIGZvciBhIHNoYWxsb3cgY29tcGFyaXNvblxuICogb3IgJ3N0cmljdCcgZm9yIGEgc3RyaWN0ID09PSBjb21wYXJpc29uIGZvciBhbGwgb2JqZWN0cy5cbiAqXG4gKlxuICAgIEx1Yy5jb21wYXJlKCcxJywgMSlcbiAgICA+ZmFsc2VcbiAgICBMdWMuY29tcGFyZSh7YTogMX0sIHthOiAxfSlcbiAgICA+dHJ1ZVxuICAgIEx1Yy5jb21wYXJlKHthOiAxLCBiOiB7fX0sIHthOiAxLCBiOiB7fSB9KVxuICAgID5mYWxzZVxuICAgIEx1Yy5jb21wYXJlKHthOiAxLCBiOiB7fX0sIHthOiAxLCBiOiB7fSB9LCB7dHlwZTogJ2RlZXAnfSlcbiAgICA+dHJ1ZVxuICAgIEx1Yy5jb21wYXJlKHthOiAxLCBiOiB7fX0sIHthOiAxLCBiOiB7fSB9LCB7dHlwZTogJ3N0cmljdCd9KVxuICAgID5mYWxzZVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gY29tcGFyZSh2YWwxLCB2YWwyLCBjb25maWcpIHtcbiAgICByZXR1cm4gZ2V0Q29tcGFyZUZuKHZhbDEsIGNvbmZpZykodmFsMSwgdmFsMik7XG59XG5cblxuZnVuY3Rpb24gY3JlYXRlQm91bmRDb21wYXJlRm4ob2JqZWN0LCBjKSB7XG4gICAgdmFyIGNvbXBhcmVGbiA9IGdldENvbXBhcmVGbihvYmplY3QsIGMpO1xuXG4gICAgcmV0dXJuIF9jcmVhdGVCb3VuZENvbXBhcmUob2JqZWN0LCBjb21wYXJlRm4pO1xufVxuXG5leHBvcnRzLmNvbXBhcmUgPSBjb21wYXJlO1xuZXhwb3J0cy5jcmVhdGVCb3VuZENvbXBhcmVGbiA9IGNyZWF0ZUJvdW5kQ29tcGFyZUZuOyIsInZhciBlbXB0eUZuID0gcmVxdWlyZSgnLi4vZnVuY3Rpb24nKS5lbXB0eUZuLFxuICAgIGFwcGx5ID0gcmVxdWlyZSgnLi4vb2JqZWN0JykuYXBwbHk7XG5cbi8qKlxuICogQGNsYXNzIEx1Yy5CYXNlXG4gKiBTaW1wbGUgY2xhc3MgdGhhdCBieSBkZWZhdWx0IGFwcGxpZXMgdGhlIFxuICogZmlyc3QgYXJndW1lbnQgdG8gdGhlIGluc3RhbmNlIGFuZCB0aGVuIGNhbGxzXG4gKiBMdWMuQmFzZS5pbml0LlxuICpcbiAgICB2YXIgYiA9IG5ldyBMdWMuQmFzZSh7XG4gICAgICAgIGE6IDEsXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2hleScpXG4gICAgICAgIH1cbiAgICB9KVxuICAgIGIuYVxuICAgID5oZXlcbiAgICA+MVxuICovXG5mdW5jdGlvbiBCYXNlKCkge1xuICAgIHRoaXMuYmVmb3JlSW5pdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMuaW5pdCgpO1xufVxuXG5CYXNlLnByb3RvdHlwZSA9IHtcbiAgICAvKipcbiAgICAgKiBCeSBkZWZhdWx0IGFwcGx5IHRoZSBjb25maWcgdG8gdGhlIFxuICAgICAqIGluc3RhbmNlLlxuICAgICAqL1xuICAgIGJlZm9yZUluaXQ6IGZ1bmN0aW9uKGNvbmZpZykge1xuICAgICAgICBhcHBseSh0aGlzLCBjb25maWcpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQG1ldGhvZFxuICAgICAqIFNpbXBsZSBob29rIHRvIGluaXRpYWxpemVcbiAgICAgKiB0aGUgY2xhc3MuXG4gICAgICovXG4gICAgaW5pdDogZW1wdHlGblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYXNlOyIsInZhciBhRWFjaCA9IHJlcXVpcmUoJy4uL2FycmF5JykuZWFjaCxcbiAgICBvYmogPSByZXF1aXJlKCcuLi9vYmplY3QnKSxcbiAgICBlbXB0eUZuID0gcmVxdWlyZSgnLi4vZnVuY3Rpb24nKS5lbXB0eUZuLFxuICAgIGFwcGx5ID0gb2JqLmFwcGx5O1xuXG5cbmZ1bmN0aW9uIFBsdWdpbihjb25maWcpIHtcbiAgICBhcHBseSh0aGlzLCBjb25maWcpO1xufVxuXG5QbHVnaW4ucHJvdG90eXBlID0ge1xuICAgIGluaXQ6IGVtcHR5Rm4sXG4gICAgZGVzdHJveTogZW1wdHlGblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQbHVnaW47XG4iLCJ2YXIgQmFzZSA9IHJlcXVpcmUoJy4vYmFzZScpLFxuICAgIENvbXBvc2l0aW9uID0gcmVxdWlyZSgnLi9jb21wb3NpdGlvbicpLFxuICAgIG9iaiA9IHJlcXVpcmUoJy4uL29iamVjdCcpLFxuICAgIGFycmF5Rm5zID0gcmVxdWlyZSgnLi4vYXJyYXknKSxcbiAgICBlbXB0eUZuID0gcmVxdWlyZSgnLi4vZnVuY3Rpb24nKS5lbXB0eUZuLFxuICAgIGlzID0gcmVxdWlyZSgnLi4vaXMnKSxcbiAgICBhRWFjaCA9IGFycmF5Rm5zLmVhY2gsXG4gICAgYXBwbHkgPSBvYmouYXBwbHksXG4gICAgb0VhY2ggPSBvYmouZWFjaCxcbiAgICBvRmlsdGVyID0gb2JqLmZpbHRlcixcbiAgICBtaXggPSBvYmoubWl4LFxuICAgIGFycmF5U2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbmZ1bmN0aW9uIENsYXNzRGVmaW5lcigpIHt9XG5cbkNsYXNzRGVmaW5lci5DT01QT1NJVElPTlNfTkFNRSA9ICckY29tcG9zaXRpb25zJztcblxuQ2xhc3NEZWZpbmVyLnByb3RvdHlwZSA9IHtcbiAgICBkZWZhdWx0VHlwZTogQmFzZSxcblxuICAgIHByb2Nlc3NvcktleXM6IHtcbiAgICAgICAgJG1peGluczogJ19hcHBseU1peGlucycsXG4gICAgICAgICRzdGF0aWNzOiAnX2FwcGx5U3RhdGljcycsXG4gICAgICAgICRjb21wb3NpdGlvbnM6ICdfY29tcG9zZScsXG4gICAgICAgICRzdXBlcjogJ19zdXBlcidcbiAgICB9LFxuXG4gICAgZGVmaW5lOiBmdW5jdGlvbihvcHRzKSB7XG4gICAgICAgIHZhciBvcHRpb25zID0gb3B0cyB8fCB7fSxcbiAgICAgICAgICAgIC8vaWYgc3VwZXIgaXMgYSBmYWxzeSB2YWx1ZSBiZXNpZGVzIHVuZGVmaW5lZCB0aGF0IG1lYW5zIG5vIHN1cGVyY2xhc3NcbiAgICAgICAgICAgIFN1cGVyID0gb3B0aW9ucy4kc3VwZXIgfHwgKG9wdGlvbnMuJHN1cGVyID09PSB1bmRlZmluZWQgPyB0aGlzLmRlZmF1bHRUeXBlIDogZmFsc2UpLFxuICAgICAgICAgICAgQ29uc3RydWN0b3I7XG5cbiAgICAgICAgb3B0aW9ucy4kc3VwZXIgPSBTdXBlcjtcblxuICAgICAgICBDb25zdHJ1Y3RvciA9IHRoaXMuX2NyZWF0ZUNvbnN0cnVjdG9yKG9wdGlvbnMpO1xuXG4gICAgICAgIHRoaXMuX3Byb2Nlc3NBZnRlckNyZWF0ZShDb25zdHJ1Y3Rvciwgb3B0aW9ucyk7XG5cbiAgICAgICAgcmV0dXJuIENvbnN0cnVjdG9yO1xuICAgIH0sXG5cbiAgICBfY3JlYXRlQ29uc3RydWN0b3I6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHN1cGVyY2xhc3MgPSBvcHRpb25zLiRzdXBlcixcbiAgICAgICAgICAgIENvbnN0cnVjdG9yID0gdGhpcy5fY3JlYXRlQ29uc3RydWN0b3JGbihvcHRpb25zKTtcblxuICAgICAgICBpZihzdXBlcmNsYXNzKSB7XG4gICAgICAgICAgICBDb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyY2xhc3MucHJvdG90eXBlKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIENvbnN0cnVjdG9yO1xuICAgIH0sXG5cbiAgICBfY3JlYXRlQ29uc3RydWN0b3JGbjogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICB2YXIgc3VwZXJjbGFzcyA9IG9wdGlvbnMuJHN1cGVyLFxuICAgICAgICAgICAgQ29uc3RydWN0b3I7XG5cbiAgICAgICAgaWYgKHRoaXMuX2hhc0NvbnN0cnVjdG9yTW9kaWZ5aW5nT3B0aW9ucyhvcHRpb25zKSkge1xuICAgICAgICAgICAgQ29uc3RydWN0b3IgPSB0aGlzLl9jcmVhdGVDb25zdHJ1Y3RvcldpdGhNb2RpZml5aW5nT3B0aW9ucyhvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKCFzdXBlcmNsYXNzKSB7XG4gICAgICAgICAgICBDb25zdHJ1Y3RvciA9IGZ1bmN0aW9uKCkge307XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBDb25zdHJ1Y3RvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHN1cGVyY2xhc3MuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gQ29uc3RydWN0b3I7XG4gICAgfSxcblxuICAgIF9jcmVhdGVDb25zdHJ1Y3RvcldpdGhNb2RpZml5aW5nT3B0aW9uczogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICB2YXIgc3VwZXJjbGFzcyA9IG9wdGlvbnMuJHN1cGVyLFxuICAgICAgICAgICAgbWUgPSB0aGlzLFxuICAgICAgICAgICAgaW5pdEJlZm9yZVN1cGVyY2xhc3MsXG4gICAgICAgICAgICBpbml0QWZ0ZXJTdXBlcmNsYXNzLFxuICAgICAgICAgICAgaW5pdDtcblxuICAgICAgICBpZiAoIXN1cGVyY2xhc3MpIHtcbiAgICAgICAgICAgIGluaXQgPSB0aGlzLl9jcmVhdGVJbml0Q2xhc3NPcHRpb25zRm4ob3B0aW9ucywge1xuICAgICAgICAgICAgICAgIGFsbDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXJncyA9IGFycmF5U2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIGluaXQuY2FsbCh0aGlzLCBvcHRpb25zLCBhcmdzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBpbml0QmVmb3JlU3VwZXJjbGFzcyA9IHRoaXMuX2NyZWF0ZUluaXRDbGFzc09wdGlvbnNGbihvcHRpb25zLCB7XG4gICAgICAgICAgICBiZWZvcmU6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaW5pdEFmdGVyU3VwZXJjbGFzcyA9IHRoaXMuX2NyZWF0ZUluaXRDbGFzc09wdGlvbnNGbihvcHRpb25zLCB7XG4gICAgICAgICAgICBiZWZvcmU6IGZhbHNlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBhcmdzID0gYXJyYXlTbGljZS5jYWxsKGFyZ3VtZW50cyk7XG5cbiAgICAgICAgICAgIGluaXRCZWZvcmVTdXBlcmNsYXNzLmNhbGwodGhpcywgb3B0aW9ucywgYXJncyk7XG4gICAgICAgICAgICBzdXBlcmNsYXNzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICBpbml0QWZ0ZXJTdXBlcmNsYXNzLmNhbGwodGhpcywgb3B0aW9ucywgYXJncyk7XG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIF9jcmVhdGVJbml0Q2xhc3NPcHRpb25zRm46IGZ1bmN0aW9uKG9wdGlvbnMsIGNvbmZpZykge1xuICAgICAgICB2YXIgbWUgPSB0aGlzLFxuICAgICAgICAgICAgY29tcG9zaXRpb25zID0gdGhpcy5fZmlsdGVyQ29tcG9zaXRpb25zKGNvbmZpZywgb3B0aW9ucy4kY29tcG9zaXRpb25zKTtcblxuICAgICAgICBpZihjb21wb3NpdGlvbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gZW1wdHlGbjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKG9wdGlvbnMsIGluc3RhbmNlQXJncykge1xuICAgICAgICAgICAgbWUuX2luaXRDb21wb3NpdGlvbnMuY2FsbCh0aGlzLCBjb21wb3NpdGlvbnMsIGluc3RhbmNlQXJncyk7XG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIF9maWx0ZXJDb21wb3NpdGlvbnM6IGZ1bmN0aW9uKGNvbmZpZywgY29tcG9zaXRpb25zKSB7XG4gICAgICAgIHZhciBiZWZvcmUgPSBjb25maWcuYmVmb3JlLCBcbiAgICAgICAgICAgIGZpbHRlcmVkID0gW107XG5cbiAgICAgICAgaWYoY29uZmlnLmFsbCkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbXBvc2l0aW9ucztcbiAgICAgICAgfVxuXG4gICAgICAgIGFFYWNoKGNvbXBvc2l0aW9ucywgZnVuY3Rpb24oY29tcG9zaXRpb24pIHtcbiAgICAgICAgICAgIGlmKGJlZm9yZSAmJiBjb21wb3NpdGlvbi5pbml0QWZ0ZXIgIT09IHRydWUgfHwgKCFiZWZvcmUgJiYgY29tcG9zaXRpb24uaW5pdEFmdGVyID09PSB0cnVlKSkge1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZC5wdXNoKGNvbXBvc2l0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGZpbHRlcmVkO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIG9wdGlvbnMge09iamVjdH0gdGhlIGNvbXBvc2l0aW9uIGNvbmZpZyBvYmplY3RcbiAgICAgKiBpbnN0YW5jZUFyZ3Mge0FycmF5fSB0aGUgYXJndW1lbnRzIHBhc3NlZCB0byB0aGUgaW5zdGFuY2Unc1xuICAgICAqIGNvbnN0cnVjdG9yLlxuICAgICAqL1xuICAgIF9pbml0Q29tcG9zaXRpb25zOiBmdW5jdGlvbihjb21wb3NpdGlvbnMsIGluc3RhbmNlQXJncykge1xuICAgICAgICBpZighdGhpc1tDbGFzc0RlZmluZXIuQ09NUE9TSVRJT05TX05BTUVdKSB7XG4gICAgICAgICAgICB0aGlzW0NsYXNzRGVmaW5lci5DT01QT1NJVElPTlNfTkFNRV0gPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFFYWNoKGNvbXBvc2l0aW9ucywgZnVuY3Rpb24oY29tcG9zaXRpb25Db25maWcpIHtcbiAgICAgICAgICAgIHZhciBjb25maWcgPSBhcHBseSh7XG4gICAgICAgICAgICAgICAgaW5zdGFuY2U6IHRoaXMsXG4gICAgICAgICAgICAgICAgaW5zdGFuY2VBcmdzOiBpbnN0YW5jZUFyZ3NcbiAgICAgICAgICAgIH0sIGNvbXBvc2l0aW9uQ29uZmlnKSwgXG4gICAgICAgICAgICBjb21wb3NpdGlvbjtcblxuICAgICAgICAgICAgY29tcG9zaXRpb24gPSBuZXcgQ29tcG9zaXRpb24oY29uZmlnKTtcblxuICAgICAgICAgICAgdGhpc1tDbGFzc0RlZmluZXIuQ09NUE9TSVRJT05TX05BTUVdW2NvbXBvc2l0aW9uLm5hbWVdID0gY29tcG9zaXRpb24uZ2V0SW5zdGFuY2UoKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIF9oYXNDb25zdHJ1Y3Rvck1vZGlmeWluZ09wdGlvbnM6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMuJGNvbXBvc2l0aW9ucztcbiAgICB9LFxuXG4gICAgX2dldFByb2Nlc3NvcktleTogZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NvcktleXNba2V5XTtcbiAgICB9LFxuXG4gICAgX3Byb2Nlc3NBZnRlckNyZWF0ZTogZnVuY3Rpb24oJGNsYXNzLCBvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuX2FwcGx5VmFsdWVzVG9Qcm90bygkY2xhc3MsIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLl9oYW5kbGVQb3N0UHJvY2Vzc29ycygkY2xhc3MsIG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICBfYXBwbHlWYWx1ZXNUb1Byb3RvOiBmdW5jdGlvbigkY2xhc3MsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHByb3RvID0gJGNsYXNzLnByb3RvdHlwZSxcbiAgICAgICAgICAgIFN1cGVyID0gb3B0aW9ucy4kc3VwZXIsXG4gICAgICAgICAgICB2YWx1ZXMgPSBhcHBseSh7XG4gICAgICAgICAgICAgICAgJGNsYXNzOiAkY2xhc3NcbiAgICAgICAgICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgICAgIGlmIChTdXBlcikge1xuICAgICAgICAgICAgdmFsdWVzLiRzdXBlcmNsYXNzID0gU3VwZXIucHJvdG90eXBlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9Eb24ndCBwdXQgdGhlIGRlZmluZSBzcGVjaWZpYyBwcm9wZXJ0aWVzXG4gICAgICAgIC8vb24gdGhlIHByb3RvdHlwZVxuICAgICAgICBvRWFjaCh2YWx1ZXMsIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fZ2V0UHJvY2Vzc29yS2V5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBwcm90b1trZXldID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICBfaGFuZGxlUG9zdFByb2Nlc3NvcnM6IGZ1bmN0aW9uKCRjbGFzcywgb3B0aW9ucykge1xuICAgICAgICBvRWFjaChvcHRpb25zLCBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgbWV0aG9kID0gdGhpcy5fZ2V0UHJvY2Vzc29yS2V5KGtleSk7XG5cbiAgICAgICAgICAgIGlmIChpcy5pc0Z1bmN0aW9uKHRoaXNbbWV0aG9kXSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzW21ldGhvZF0uY2FsbCh0aGlzLCAkY2xhc3MsIG9wdGlvbnNba2V5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICBfYXBwbHlNaXhpbnM6IGZ1bmN0aW9uKCRjbGFzcywgbWl4aW5zKSB7XG4gICAgICAgIHZhciBwcm90byA9ICRjbGFzcy5wcm90b3R5cGU7XG4gICAgICAgIGFFYWNoKG1peGlucywgZnVuY3Rpb24obWl4aW4pIHtcbiAgICAgICAgICAgIC8vYWNjZXB0IENvbnN0cnVjdG9ycyBvciBPYmplY3RzXG4gICAgICAgICAgICB2YXIgdG9NaXggPSBtaXhpbi5wcm90b3R5cGUgfHwgbWl4aW47XG4gICAgICAgICAgICBtaXgocHJvdG8sIHRvTWl4KTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIF9hcHBseVN0YXRpY3M6IGZ1bmN0aW9uKCRjbGFzcywgc3RhdGljcykge1xuICAgICAgICB2YXIgcHJvdG90eXBlID0gJGNsYXNzLnByb3RvdHlwZTtcblxuICAgICAgICBhcHBseSgkY2xhc3MsIHN0YXRpY3MpO1xuXG4gICAgICAgIGlmKHByb3RvdHlwZS5nZXRTdGF0aWNWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBwcm90b3R5cGUuZ2V0U3RhdGljVmFsdWUgPSB0aGlzLmdldFN0YXRpY1ZhbHVlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9jb21wb3NlOiBmdW5jdGlvbigkY2xhc3MsIGNvbXBvc2l0aW9ucykge1xuICAgICAgICB2YXIgcHJvdG90eXBlID0gJGNsYXNzLnByb3RvdHlwZSxcbiAgICAgICAgICAgIG1ldGhvZHNUb0NvbXBvc2U7XG5cbiAgICAgICAgYUVhY2goY29tcG9zaXRpb25zLCBmdW5jdGlvbihjb21wb3NpdGlvbkNvbmZpZykge1xuICAgICAgICAgICAgdmFyIGNvbXBvc2l0aW9uID0gbmV3IENvbXBvc2l0aW9uKGNvbXBvc2l0aW9uQ29uZmlnKSxcbiAgICAgICAgICAgICAgICBuYW1lID0gY29tcG9zaXRpb24ubmFtZSxcbiAgICAgICAgICAgICAgICBDb25zdHJ1Y3RvciA9IGNvbXBvc2l0aW9uLkNvbnN0cnVjdG9yO1xuXG4gICAgICAgICAgICBjb21wb3NpdGlvbi52YWxpZGF0ZSgpO1xuXG4gICAgICAgICAgICBtZXRob2RzVG9Db21wb3NlID0gY29tcG9zaXRpb24uZ2V0TWV0aG9kc1RvQ29tcG9zZSgpO1xuXG4gICAgICAgICAgICBtZXRob2RzVG9Db21wb3NlLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICAgICAgaWYgKHByb3RvdHlwZVtrZXldID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvdG90eXBlW2tleV0gPSB0aGlzLl9jcmVhdGVDb21wb3NlclByb3RvRm4oa2V5LCBuYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICAgICAgaWYocHJvdG90eXBlLmdldENvbXBvc2l0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBwcm90b3R5cGUuZ2V0Q29tcG9zaXRpb24gPSB0aGlzLmdldENvbXBvc2l0aW9uO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICBfc3VwZXI6IGZ1bmN0aW9uKCRjbGFzcywgJHN1cGVyKSB7XG4gICAgICAgIGlmICgkc3VwZXIpIHtcbiAgICAgICAgICAgICRjbGFzcy5wcm90b3R5cGUuJHN1cGVyID0gJHN1cGVyO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9jcmVhdGVDb21wb3NlclByb3RvRm46IGZ1bmN0aW9uKG1ldGhvZE5hbWUsIGNvbXBvc2l0aW9uTmFtZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgY29tcCA9IHRoaXNbQ2xhc3NEZWZpbmVyLkNPTVBPU0lUSU9OU19OQU1FXVtjb21wb3NpdGlvbk5hbWVdO1xuICAgICAgICAgICAgcmV0dXJuIGNvbXBbbWV0aG9kTmFtZV0uYXBwbHkoY29tcCwgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLy9NZXRob2RzIHRoYXQgY2FuIGdldCBhZGRlZCB0byB0aGUgcHJvdG90eXBlXG4gICAgLy90aGV5IHdpbGwgYmUgY2FsbGVkIGluIHRoZSBjb250ZXh0IG9mIHRoZSBpbnN0YW5jZS5cbiAgICAvKipcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEdldHRlciBmb3IgY29tcG9zaXRpb24gaW5zdGFuY2UgdGhhdCBnZXRzIHB1dCBvblxuICAgICAqIHRoZSBkZWZpbmVkIGNsYXNzLlxuICAgICAqIEBwYXJhbSAge1N0cmluZ30ga2V5XG4gICAgICovXG4gICAgZ2V0Q29tcG9zaXRpb246IGZ1bmN0aW9uKGtleSkge1xuICAgICAgICByZXR1cm4gdGhpc1tDbGFzc0RlZmluZXIuQ09NUE9TSVRJT05TX05BTUVdW2tleV07XG4gICAgfSxcblxuICAgIGdldFN0YXRpY1ZhbHVlOiBmdW5jdGlvbiAoa2V5LCAkY2xhc3MpIHtcbiAgICAgICAgdmFyIGNsYXNzVG9GaW5kVmFsdWUgPSAkY2xhc3MgfHwgdGhpcy4kY2xhc3MsXG4gICAgICAgICAgICAkc3VwZXIsXG4gICAgICAgICAgICB2YWx1ZTtcblxuICAgICAgICB2YWx1ZSA9IGNsYXNzVG9GaW5kVmFsdWVba2V5XTtcblxuICAgICAgICBpZih2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAkc3VwZXIgPSBjbGFzc1RvRmluZFZhbHVlLnByb3RvdHlwZS4kc3VwZXI7XG4gICAgICAgICAgICBpZigkc3VwZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRTdGF0aWNWYWx1ZShrZXksICRzdXBlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG59O1xuXG52YXIgRGVmaW5lciA9IG5ldyBDbGFzc0RlZmluZXIoKTtcbi8vbWFrZSBMdWMuZGVmaW5lIGhhcHB5XG5EZWZpbmVyLmRlZmluZSA9IERlZmluZXIuZGVmaW5lLmJpbmQoRGVmaW5lcik7XG5cbm1vZHVsZS5leHBvcnRzID0gRGVmaW5lcjsiLCJ2YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnLi4vZXZlbnRzL2V2ZW50RW1pdHRlcicpLFxuICAgIFBsdWdpbk1hbmFnZXIgPSByZXF1aXJlKCcuL3BsdWdpbk1hbmFnZXInKTtcblxubW9kdWxlLmV4cG9ydHMuRXZlbnRFbWl0dGVyID0ge1xuICAgIENvbnN0cnVjdG9yOiBFdmVudEVtaXR0ZXIsXG4gICAgbmFtZTogJ2VtaXR0ZXInLFxuICAgIGZpbHRlcktleXM6ICdhbGxNZXRob2RzJ1xufTtcblxuXG5cbm1vZHVsZS5leHBvcnRzLlBsdWdpbk1hbmFnZXIgPSB7XG4gICAgbmFtZTogJ3BsdWdpbnMnLFxuICAgIGluaXRBZnRlcjogdHJ1ZSxcbiAgICBDb25zdHJ1Y3RvcjogUGx1Z2luTWFuYWdlcixcbiAgICBjcmVhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbWFuYWdlciA9IG5ldyB0aGlzLkNvbnN0cnVjdG9yKCk7XG4gICAgICAgIG1hbmFnZXIuaW5pdCh7XG4gICAgICAgICAgICBpbnN0YW5jZTogdGhpcy5pbnN0YW5jZSxcbiAgICAgICAgICAgIGluc3RhbmNlQXJnczogdGhpcy5pbnN0YW5jZUFyZ3NcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIG1hbmFnZXI7XG4gICAgfSxcbiAgICBmaWx0ZXJLZXlzOiBbJ2Rlc3Ryb3lQbHVnaW5zJ11cbn07IiwidmFyIG9iaiA9IHJlcXVpcmUoJy4uL29iamVjdCcpLFxuICAgIGFwcGx5ID0gb2JqLmFwcGx5LFxuICAgIG1peCA9IG9iai5taXgsXG4gICAgb0ZpbHRlciA9IG9iai5maWx0ZXIsXG4gICAgZW1wdHlGbiA9ICgnLi4vZnVuY3Rpb24nKS5lbXB0eUZuLFxuICAgIGlzID0gcmVxdWlyZSgnLi4vaXMnKTtcblxuLyoqXG4gKiBAY2xhc3MgIEx1Yy5Db21wb3NpdGlvblxuICogQHByb3RlY3RlZFxuICogY2xhc3MgdGhhdCB3cmFwcyAkY29tcG9zaXRpb24gY29uZmlnIG9iamVjdHNcbiAqIHRvIGNvbmZvcm0gdG8gYW4gYXBpLiBUaGUgY29uZmlnIG9iamVjdFxuICogd2lsbCBvdmVycmlkZSBhbnkgcHJvdGVjdGVkIG1ldGhvZHMgYW5kIGRlZmF1bHQgY29uZmlncy5cbiAqL1xuZnVuY3Rpb24gQ29tcG9zaXRpb24oYykge1xuICAgIHZhciBkZWZhdWx0cyA9IGMuZGVmYXVsdHMsXG4gICAgICAgIGNvbmZpZyA9IGM7XG5cbiAgICBpZihkZWZhdWx0cykge1xuICAgICAgICBtaXgoY29uZmlnLCBjb25maWcuZGVmYXVsdHMpO1xuICAgICAgICBkZWxldGUgY29uZmlnLmRlZmF1bHRzO1xuICAgIH1cblxuICAgIGFwcGx5KHRoaXMsIGNvbmZpZyk7XG59XG5cbkNvbXBvc2l0aW9uLnByb3RvdHlwZSA9IHtcbiAgICAvKipcbiAgICAgKiBAY2ZnIHtTdHJpbmd9IG5hbWUgKHJlcXVpcmVkKSB0aGUgbmFtZVxuICAgICAqL1xuICAgIFxuICAgIC8qKlxuICAgICAqIEBjZmcge0Z1bmN0aW9ufSBDb25zdHJ1Y3RvciAocmVxdWlyZWQpIHRoZSBDb25zdHJ1Y3RvclxuICAgICAqIHRvIHVzZSB3aGVuIGNyZWF0aW5nIHRoZSBjb21wb3NpdGlvbiBpbnN0YW5jZS4gIFRoaXNcbiAgICAgKiBpcyByZXF1aXJlZCBpZiBMdWMuQ29tcG9zaXRpb24uY3JlYXRlIGlzIG5vdCBvdmVycndpdHRlbiBieVxuICAgICAqIHRoZSBwYXNzZWQgaW4gY29tcG9zaXRpb24gY29uZmlnIG9iamVjdC5cbiAgICAgKi9cbiAgICBcbiAgICAvKipcbiAgICAgKiBAcHJvdGVjdGVkXG4gICAgICogQnkgZGVmYXVsdCBqdXN0IHJldHVybiBhIG5ld2x5IGNyZWF0ZWQgQ29uc3RydWN0b3IgaW5zdGFuY2UuXG4gICAgICogXG4gICAgICogV2hlbiBjcmVhdGUgaXMgY2FsbGVkIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllcyBjYW4gYmUgdXNlZCA6XG4gICAgICogXG4gICAgICogdGhpcy5pbnN0YW5jZSBUaGUgaW5zdGFuY2UgdGhhdCBpcyBjcmVhdGluZ1xuICAgICAqIHRoZSBjb21wb3NpdGlvbi5cbiAgICAgKiBcbiAgICAgKiB0aGlzLkNvbnN0cnVjdG9yIHRoZSBjb25zdHJ1Y3RvciB0aGF0IGlzIHBhc3NlZCBpbiBmcm9tXG4gICAgICogdGhlIGNvbXBvc2l0aW9uIGNvbmZpZy4gXG4gICAgICpcbiAgICAgKiB0aGlzLmluc3RhbmNlQXJncyB0aGUgYXJndW1lbnRzIHBhc3NlZCBpbnRvIHRoZSBpbnN0YW5jZSB3aGVuIGl0IFxuICAgICAqIGlzIGJlaW5nIGNyZWF0ZWQuICBGb3IgZXhhbXBsZVxuXG4gICAgICAgIG5ldyBNeUNsYXNzV2l0aEFDb21wb3NpdGlvbih7cGx1Z2luczogW119KVxuICAgICAgICAvL2luc2lkZSBvZiB0aGUgY3JlYXRlIG1ldGhvZFxuICAgICAgICB0aGlzLmluc3RhbmNlQXJnc1xuICAgICAgICA+W3twbHVnaW5zOiBbXX1dXG5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFxuICAgICAqIHRoZSBjb21wb3NpdGlvbiBpbnN0YW5jZS5cbiAgICAgKlxuICAgICAqIEZvciBleGFtcGxlIHNldCB0aGUgZW1pdHRlcnMgbWF4TGlzdGVuZXJzXG4gICAgICogdG8gd2hhdCB0aGUgaW5zdGFuY2UgaGFzIGNvbmZpZ2VkLlxuICAgICAgXG4gICAgICAgIG1heExpc3RlbmVyczogMTAwLFxuICAgICAgICAkY29tcG9zaXRpb25zOiB7XG4gICAgICAgICAgICBDb25zdHJ1Y3RvcjogTHVjLkV2ZW50RW1pdHRlcixcbiAgICAgICAgICAgIGNyZWF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIGVtaXR0ZXIgPSBuZXcgdGhpcy5Db25zdHJ1Y3RvcigpO1xuICAgICAgICAgICAgICAgIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKHRoaXMuaW5zdGFuY2UubWF4TGlzdGVuZXJzKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZW1pdHRlcjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBuYW1lOiAnZW1pdHRlcidcbiAgICAgICAgfVxuXG4gICAgICovXG4gICAgY3JlYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIENvbnN0cnVjdG9yID0gdGhpcy5Db25zdHJ1Y3RvcjtcbiAgICAgICAgcmV0dXJuIG5ldyBDb25zdHJ1Y3RvcigpO1xuICAgIH0sXG5cbiAgICBnZXRJbnN0YW5jZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZSgpO1xuICAgIH0sXG5cbiAgICB2YWxpZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKHRoaXMubmFtZSAgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBIG5hbWUgbXVzdCBiZSBkZWZpbmVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYoIWlzLmlzRnVuY3Rpb24odGhpcy5Db25zdHJ1Y3RvcikgJiYgdGhpcy5jcmVhdGUgPT09IENvbXBvc2l0aW9uLnByb3RvdHlwZS5jcmVhdGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIENvbnN0cnVjdG9yIG11c3QgYmUgZnVuY3Rpb24gaWYgY3JlYXRlIGlzIG5vdCBvdmVycmlkZW4nKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkgZmlsdGVyRm5zXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAcHJvcGVydHkgZmlsdGVyRm5zLmFsbE1ldGhvZHMgcmV0dXJuIGFsbCBtZXRob2RzIGZyb20gdGhlXG4gICAgICogY29uc3RydWN0b3JzIHByb3RvdHlwZVxuICAgICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICAgKi9cbiAgICBmaWx0ZXJGbnM6IHtcbiAgICAgICAgYWxsTWV0aG9kczogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGlzLmlzRnVuY3Rpb24odmFsdWUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBjZmcge0Z1bmN0aW9uL1N0cmluZy9BcnJheVtdfSBmaWx0ZXJLZXlzXG4gICAgICogVGhlIGtleXMgdG8gYWRkIHRvIHRoZSBkZWZpbmVycyBwcm90b3R5cGUgdGhhdCB3aWxsIGluIHR1cm4gY2FsbFxuICAgICAqIHRoZSBjb21wb3NpdGlvbnMgbWV0aG9kLlxuICAgICAqIFxuICAgICAqIERlZmF1bHRzIHRvIEx1Yy5lbXB0eUZuLiBcbiAgICAgKiBJZiBhbiBhcnJheSBpcyBwYXNzZWQgaXQgd2lsbCBqdXN0IHVzZSB0aGF0IEFycmF5LlxuICAgICAqIFxuICAgICAqIElmIGEgc3RyaW5nIGlzIHBhc3NlZCBhbmQgbWF0Y2hlcyBhIG1ldGhvZCBmcm9tIFxuICAgICAqIEx1Yy5Db21wb3NpdGlvbi5maWx0ZXJGbnMgaXQgd2lsbCBjYWxsIHRoYXQgaW5zdGVhZC5cbiAgICAgKiBcbiAgICAgKiBJZiBhIGZ1bmN0aW9uIGlzIGRlZmluZWQgaXRcbiAgICAgKiB3aWxsIGdldCBjYWxsZWQgd2hpbGUgaXRlcmF0aW5nIG92ZXIgZWFjaCBrZXkgdmFsdWUgcGFpciBvZiB0aGUgXG4gICAgICogQ29uc3RydWN0b3IncyBwcm90b3R5cGUsIGlmIGEgdHJ1dGh5IHZhbHVlIGlzIFxuICAgICAqIHJldHVybmVkIHRoZSBwcm9wZXJ0eSB3aWxsIGJlIGFkZGVkIHRvIHRoZSBkZWZpbmluZ1xuICAgICAqIGNsYXNzZXMgcHJvdG90eXBlLlxuICAgICAqIFxuICAgICAqIEZvciBleGFtcGxlIHRoaXMgY29uZmlnIHdpbGwgb25seSBleHBvc2UgdGhlIGVtaXQgbWV0aG9kIFxuICAgICAqIHRvIHRoZSBkZWZpbmluZyBjbGFzc1xuICAgICBcbiAgICAgICAgJGNvbXBvc2l0aW9uczoge1xuICAgICAgICAgICAgQ29uc3RydWN0b3I6IEx1Yy5FdmVudEVtaXR0ZXIsXG4gICAgICAgICAgICBmaWx0ZXJLZXlzOiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGtleSA9PT0gJ2VtaXQnO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG5hbWU6ICdlbWl0dGVyJ1xuICAgICAgICB9XG4gICAgICogdGhpcyBpcyBhbHNvIGEgdmFsaWQgY29uZmlnXG4gICAgICogXG4gICAgICAgICRjb21wb3NpdGlvbnM6IHtcbiAgICAgICAgICAgIENvbnN0cnVjdG9yOiBMdWMuRXZlbnRFbWl0dGVyLFxuICAgICAgICAgICAgZmlsdGVyS2V5czogWydlbWl0dGVyJ10sXG4gICAgICAgICAgICBuYW1lOiAnZW1pdHRlcidcbiAgICAgICAgfVxuICAgICAqIFxuICAgICAqL1xuICAgIGZpbHRlcktleXM6IGVtcHR5Rm4sXG5cbiAgICBnZXRNZXRob2RzVG9Db21wb3NlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGZpbHRlcktleXMgPSB0aGlzLmZpbHRlcktleXMsXG4gICAgICAgICAgICBwYWlyc1RvQWRkLFxuICAgICAgICAgICAgZmlsdGVyRm47XG5cblxuICAgICAgICBpZiAoaXMuaXNBcnJheShmaWx0ZXJLZXlzKSkge1xuICAgICAgICAgICAgcGFpcnNUb0FkZCA9IGZpbHRlcktleXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmaWx0ZXJGbiA9IGZpbHRlcktleXM7XG5cbiAgICAgICAgICAgIGlmIChpcy5pc1N0cmluZyhmaWx0ZXJLZXlzKSkge1xuICAgICAgICAgICAgICAgIGZpbHRlckZuID0gdGhpcy5maWx0ZXJGbnNbZmlsdGVyS2V5c107XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vQ29uc3RydWN0b3JzIGFyZSBub3QgbmVlZGVkIGlmIGNyZWF0ZSBpcyBvdmVyd3JpdHRlblxuICAgICAgICAgICAgcGFpcnNUb0FkZCA9IG9GaWx0ZXIodGhpcy5Db25zdHJ1Y3RvciAmJiB0aGlzLkNvbnN0cnVjdG9yLnByb3RvdHlwZSwgZmlsdGVyRm4sIHRoaXMsIHtcbiAgICAgICAgICAgICAgICBvd25Qcm9wZXJ0aWVzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBrZXlzOiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwYWlyc1RvQWRkO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ29tcG9zaXRpb247IiwidmFyIFBsdWdpbiA9IHJlcXVpcmUoJy4vcGx1Z2luJyksXG4gICAgaXMgPSByZXF1aXJlKCcuLi9pcycpLFxuICAgIG9iaiA9IHJlcXVpcmUoJy4uL29iamVjdCcpLFxuICAgIGFyciA9IHJlcXVpcmUoJy4uL2FycmF5JyksXG4gICAgYUVhY2ggPSBhcnIuZWFjaCxcbiAgICBtaXggPSBvYmoubWl4LFxuICAgIGFwcGx5ID0gb2JqLmFwcGx5O1xuXG5mdW5jdGlvbiBQbHVnaW5NYW5hZ2VyKCkge31cblxuUGx1Z2luTWFuYWdlci5wcm90b3R5cGUgPSB7XG4gICAgZGVmYXVsdFBsdWdpbjogUGx1Z2luLFxuXG4gICAgaW5pdDogZnVuY3Rpb24oaW5zdGFuY2VWYWx1ZXMpIHtcbiAgICAgICAgYXBwbHkodGhpcywgaW5zdGFuY2VWYWx1ZXMpO1xuICAgICAgICB0aGlzLmNyZWF0ZVBsdWdpbnMoKTtcbiAgICB9LFxuXG4gICAgY3JlYXRlUGx1Z2luczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjb25maWcgPSB0aGlzLmluc3RhbmNlQXJnc1swXTtcblxuICAgICAgICB0aGlzLnBsdWdpbnMgPSBbXTtcblxuICAgICAgICBhRWFjaChjb25maWcucGx1Z2lucywgZnVuY3Rpb24ocGx1Z2luQ29uZmlnKSB7XG4gICAgICAgICAgICBwbHVnaW5Db25maWcub3duZXIgPSB0aGlzLmluc3RhbmNlO1xuICAgICAgICAgICAgdmFyIHBsdWdpbkluc3RhbmNlID0gdGhpcy5jcmVhdGVQbHVnaW4ocGx1Z2luQ29uZmlnKTtcblxuICAgICAgICAgICAgdGhpcy5pbml0UGx1Z2luKHBsdWdpbkluc3RhbmNlKTtcblxuICAgICAgICAgICAgdGhpcy5wbHVnaW5zLnB1c2gocGx1Z2luSW5zdGFuY2UpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgY3JlYXRlUGx1Z2luOiBmdW5jdGlvbihjb25maWcpIHtcblxuICAgICAgICBpZiAoY29uZmlnLkNvbnN0cnVjdG9yKSB7XG4gICAgICAgICAgICAvL2NhbGwgdGhlIGNvbmZpZ2VkIENvbnN0cnVjdG9yIHdpdGggdGhlIFxuICAgICAgICAgICAgLy9wYXNzZWQgaW4gY29uZmlnIGJ1dCB0YWtlIG9mZiB0aGUgQ29uc3RydWN0b3JcbiAgICAgICAgICAgIC8vY29uZmlnLlxuICAgICAgICAgICAgIFxuICAgICAgICAgICAgLy9UaGUgcGx1Z2luIENvbnN0cnVjdG9yIFxuICAgICAgICAgICAgLy9zaG91bGQgbm90IG5lZWQgdG8ga25vdyBhYm91dCBpdHNlbGZcbiAgICAgICAgICAgIHJldHVybiBuZXcgY29uZmlnLkNvbnN0cnVjdG9yKGFwcGx5KGNvbmZpZywge1xuICAgICAgICAgICAgICAgIENvbnN0cnVjdG9yOiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vaWYgQ29uc3RydWN0b3IgcHJvcGVydHkgaXMgbm90IG9uXG4gICAgICAgIC8vdGhlIGNvbmZpZyBqdXN0IHVzZSB0aGUgZGVmYXVsdCBQbHVnaW5cbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzLmRlZmF1bHRQbHVnaW4oY29uZmlnKTtcbiAgICB9LFxuXG4gICAgaW5pdFBsdWdpbjogZnVuY3Rpb24ocGx1Z2luKSB7XG4gICAgICAgIGlmIChpcy5pc0Z1bmN0aW9uKHBsdWdpbi5pbml0KSkge1xuICAgICAgICAgICAgcGx1Z2luLmluaXQodGhpcy5pbnN0YW5jZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZGVzdHJveVBsdWdpbnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnBsdWdpbnMuZm9yRWFjaChmdW5jdGlvbihwbHVnaW4pIHtcbiAgICAgICAgICAgIGlmIChpcy5pc0Z1bmN0aW9uKHBsdWdpbi5kZXN0cm95KSkge1xuICAgICAgICAgICAgICAgIHBsdWdpbi5kZXN0cm95KHRoaXMuaW5zdGFuY2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBsdWdpbk1hbmFnZXI7Il19
;