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

Luc.ArrayFnGenerator = require('./arrayFnGenerator');

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
},{"./function":2,"./array":3,"./object":4,"./arrayFnGenerator":5,"./is":6,"./events/eventEmitter":7,"./class/base":8,"./class/definer":9,"./class/plugin":10,"./class/compositionEnumns":11,"./compare":12}],4:[function(require,module,exports){
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
    var thisArg = {val:1};
    Luc.Object.each({
        key: 1
    }, function(key, value) {
        console.log(value + key + this.val)
    }, thisArg)
    
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
},{}],6:[function(require,module,exports){
var oToString = Object.prototype.toString;
/**
 * @class Luc.is 
 * Package for determining the types of objects
 * it also has an Luc.is.isEmpty and Luc.is.isFalsy 
 * functions.  You can see that we don't have an 
 * isNull isUndefined or isNaN.  We prefer to use:
 
    obj === null
    obj === undefined
    isNaN(obj)

 * Im sure there a is a use case for isBoolean
 * but we will leave you on your own for that.
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
 * the type arguments.
 * 
 * @param  {Object}  obj 
 * @return {Boolean}
 */
function isArguments(obj) {
    return oToString.call(obj) === '[object Arguments]';
}

/**
 * Return true if the object is falsy but not zero.  If
 * you want falsy check that includes zero use a goram 
 * if statement :)
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
    isArguments: isArguments,
    isFalsy: isFalsy,
    isEmpty: isEmpty
};
},{}],7:[function(require,module,exports){
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
},{"events":13}],14:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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
},{"__browserify_process":14}],2:[function(require,module,exports){
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
},{"./is":6,"./array":3}],3:[function(require,module,exports){
var arraySlice = Array.prototype.slice,
    compare = require('./compare'),
    is = require('./is'),
    createBoundCompareFn = compare.createBoundCompareFn;

function _createIteratorFn(fn, c) {
    var config = c || {};

    if(is.isFunction(fn) && (config.type !== 'strict')) {
        return c ? fn.bind(c) : fn;
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
 * Keep in mind that Luc is optionally packaged with es5 shim so you can target non-es5 browsers.
 * It comes with your favorite {@link Array Array} methods such as Array.forEach, Array.filter, Array.some, Array.every Array.reduceRight ..
 *
 * Also don't forget about Luc.Array.each and Luc.Array.toArray, they are great utility methods
 * that are used all over the framework.
 * 
 * All remove\* / find\* methods follow the same api.  \*All functions will return an array of removed or found
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

    var arr = [1,2,{a:1},1, {a:1}];
    Luc.Array.removeFirst(arr, {a:1})
    >{a:1}
    arr;
    >[1, 2, 1, {a:1}]
    Luc.Array.removeLast(arr, 1)
    >1
    arr;
    >[1,2, {a:1}]

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
 * Runs an Array.forEach after calling Luc.Array.toArray on the item.
 * @param  {Object}   item
 * @param  {Function} fn        
 * @param  {Object}   thisArg   
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
        spliceArgs;

    if(indexOrAppend === true) {
        return firstArray.concat(secondArray);
    }

    spliceArgs = [indexOrAppend, 0].concat(secondArray);
    firstArray.splice.apply(firstArray, spliceArgs);
    return firstArray;
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
 * Remove the first item from the passed in array
 * that does not match the passed in object.  Instead of 
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
 * that do not match matches the passed in object.  Instead of 
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
 * @return {Array} an array of items removed
 */
function removeAllNot(arr, obj, config) {
    var fn = _createIteratorNotFn(obj, config);
    return _removeAll(arr, fn);
}

/**
 * Remove the all the items from the passed in array
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
 * @return {Array} an array of items removed
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
 * that does not match the passed in object.  Instead of 
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
 * @return {Object} the object that was found
 * false if no object was removed;
 */
function findFirst(arr, obj, config) {
    var fn = _createIteratorFn(obj, config);
    return _findFirst(arr, fn);
}

/**
 * Find the first item from the passed in array
 * that does not match the passed in object.  Instead of 
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
 * @return {Object} the object that was found
 * false if no object was removed;
 */
function findFirstNot(arr, obj, config) {
    var fn = _createIteratorNotFn(obj, config);
    return _findFirst(arr, fn);
}

function _findAll(arr, fn) {
    var found = arr.filter(fn);
    return found;
}

/**
 * Find the all the items from the passed in array
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
 * @return {Array} an array of items found
 */
function findAll(arr, obj, config) {
    var fn = _createIteratorFn(obj, config);
    return _findAll(arr, fn);
}

/**
 * Remove the all the items from the passed in array
 * that do not match the passed in object.  Instead of 
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
 * @return {Array} an array of items removed
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
 * Same as Luc.Array.findFirstNot exept start at the end.
 */

/**
 * @member Luc.Array 
 * @method findLast
 * Same as Luc.Array.findFirst exept start at the end.
 */

/**
 * @member Luc.Array 
 * @method removeLastNot 
 * Same as Luc.Array.removeFirstNot exept start at the end.
 */

/**
 * @member Luc.Array 
 * @method removeLast 
 * Same as Luc.Array.removeFirst exept start at the end.
 */

},{"./compare":12,"./is":6}],5:[function(require,module,exports){
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
            var fn = fnToBind(value);
            return array[arrayFnName](arr, fn);
        };
    }
};

module.exports.Generator = Generator;

/**
 * @class Luc.ArrayFns
 * This is documented as a seperate package but it actuall exists under the 
 * Luc.Array namespace.  Check out the "Filter class members" input box
 * just to the right when searching for functions.
 *<br>
 * 
 * There a lot of functions in this package but all of the
 *  methods follow the same api.  \*All functions will return an array of removed or found
 * items.  The items will be added to the array in the order they are
 * found.  \*First functions will return the first item and stop iterating after that, if none
 *  is found false is returned.  remove\* functions will directly change the passed in array.
 *  \*Not functions only do the following actions if the comparison is not true.
 *  \*Last functions do the same as their \*First counterparts execpt that the iterating
 *  starts at the end of the array. Amost every public method of Luc.is available it
 *  uses the following grammer Luc.Array["methodName""isMethodName"]
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
 * The only function that doesn't follow the exact api is \*InstanceOf
 * that one requires an extra argument,
  
    Luc.Array.findAllInstanceOf([1,2, new Date(), {}, []], Object)
    >[date, {}, []]
    >Luc.Array.findAllNotInstanceOf([1,2, new Date(), {}, []], Object)
    [1, 2]
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
        }
    };

    Object.keys(fns).forEach(function(key) {
        Generator.arrayFnNames.forEach(function(fnName) {
            array[fnName + key] = Generator.createBoundFn(fnName, fns[key]);
        });
    });
}());
},{"./array":3,"./is":6}],12:[function(require,module,exports){
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

    for (key in val1) {
        if (val1.hasOwnProperty(key)) {
            value = val1[key];
            if (compare(value, val2[key], config) !== true) {
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
        config = c || {},
        type = config.type;

    if (type === 'deep' || type === 'loose' || type === undefined) {
        if (is.isObject(object)) {
            compareFn = type === 'loose' ? _looseObject : _deepObject;
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
 *  check if keys from val2 do not exist in val1.
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


function createBoundCompareFn(object, c) {
    var compareFn = getCompareFn(object, c);

    return _createBoundCompare(object, compareFn);
}

exports.compare = compare;
exports.createBoundCompareFn = createBoundCompareFn;
},{"./is":6}],8:[function(require,module,exports){
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
},{"../function":2,"../object":4}],9:[function(require,module,exports){
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
},{"./base":8,"./composition":15,"../object":4,"../array":3,"../function":2,"../is":6}],10:[function(require,module,exports){
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

},{"../array":3,"../object":4,"../function":2}],11:[function(require,module,exports){
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
        var manager = new this.Constructor({
            instance: this.instance,
            instanceArgs: this.instanceArgs
        });

        return manager;
    },
    filterKeys: 'publicMethods'
};
},{"../events/eventEmitter":7,"./pluginManager":16}],15:[function(require,module,exports){
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
     * @property {filterFns.public} retrurn all methods that don't
     * start with _.  We know not everyone follows this convention, but we
     * do and so do many others.
     * @type {Function}
     */
    filterFns: {
        allMethods: function(key, value) {
            return is.isFunction(value);
        },
        publicMethods: function(key, value) {
            return is.isFunction(value) && key.charAt(0) !== '_';
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
},{"../object":4,"../is":6}],16:[function(require,module,exports){
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

PluginManager.prototype = {
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
        var config = this.instanceArgs[0];
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
     * and remove them from the array.
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
     * Remove the plugin from the plugins array and 
     * if found destroy it.
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
     * Get a plugin instance.
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
},{"./plugin":10,"../is":6,"../object":4,"../array":3}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvbHVjLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL29iamVjdC5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9pcy5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9ldmVudHMvZXZlbnRFbWl0dGVyLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2luc2VydC1tb2R1bGUtZ2xvYmFscy9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItYnVpbHRpbnMvYnVpbHRpbi9ldmVudHMuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvZnVuY3Rpb24uanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvYXJyYXkuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvYXJyYXlGbkdlbmVyYXRvci5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9jb21wYXJlLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2NsYXNzL2Jhc2UuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvY2xhc3MvZGVmaW5lci5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9jbGFzcy9wbHVnaW4uanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvY2xhc3MvY29tcG9zaXRpb25FbnVtbnMuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvY2xhc3MvY29tcG9zaXRpb24uanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvY2xhc3MvcGx1Z2luTWFuYWdlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOVVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcGtCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgTHVjID0ge307XG4vKipcbiAqIEBjbGFzcyBMdWNcbiAqIEFsaWFzZXMgZm9yIGNvbW1vbiBMdWMgbWV0aG9kcyBhbmQgcGFja2FnZXMuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gTHVjO1xuXG52YXIgb2JqZWN0ID0gcmVxdWlyZSgnLi9vYmplY3QnKTtcbkx1Yy5PYmplY3QgPSBvYmplY3Q7XG4vKipcbiAqIEBtZW1iZXIgTHVjXG4gKiBAcHJvcGVydHkgTyBMdWMuT1xuICogQWxpYXMgZm9yIEx1Yy5PYmplY3RcbiAqL1xuTHVjLk8gPSBvYmplY3Q7XG5cblxuLyoqXG4gKiBAbWVtYmVyIEx1Y1xuICogQG1ldGhvZCBhcHBseVxuICogQGluaGVyaXRkb2MgTHVjLk9iamVjdCNhcHBseVxuICovXG5MdWMuYXBwbHkgPSBMdWMuT2JqZWN0LmFwcGx5O1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjXG4gKiBAbWV0aG9kIG1peFxuICogQGluaGVyaXRkb2MgTHVjLk9iamVjdCNtaXhcbiAqL1xuTHVjLm1peCA9IEx1Yy5PYmplY3QubWl4O1xuXG5cbnZhciBmdW4gPSByZXF1aXJlKCcuL2Z1bmN0aW9uJyk7XG5MdWMuRnVuY3Rpb24gPSBmdW47XG5cbi8qKlxuICogQG1lbWJlciBMdWNcbiAqIEBwcm9wZXJ0eSBGIEx1Yy5GXG4gKiBBbGlhcyBmb3IgTHVjLkZ1bmN0aW9uXG4gKi9cbkx1Yy5GID0gZnVuO1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjXG4gKiBAbWV0aG9kIGVtcHR5Rm5cbiAqIEBpbmhlcml0ZG9jIEx1Yy5GdW5jdGlvbiNlbXB0eUZuXG4gKi9cbkx1Yy5lbXB0eUZuID0gTHVjLkZ1bmN0aW9uLmVtcHR5Rm47XG5cbi8qKlxuICogQG1lbWJlciBMdWNcbiAqIEBtZXRob2QgYWJzdHJhY3RGblxuICogQGluaGVyaXRkb2MgTHVjLkZ1bmN0aW9uI2Fic3RyYWN0Rm5cbiAqL1xuTHVjLmFic3RyYWN0Rm4gPSBMdWMuRnVuY3Rpb24uYWJzdHJhY3RGbjtcblxudmFyIGFycmF5ID0gcmVxdWlyZSgnLi9hcnJheScpO1xuTHVjLkFycmF5ID0gYXJyYXk7XG5cbi8qKlxuICogQG1lbWJlciBMdWNcbiAqIEBwcm9wZXJ0eSBBIEx1Yy5BXG4gKiBBbGlhcyBmb3IgTHVjLkFycmF5XG4gKi9cbkx1Yy5BID0gYXJyYXk7XG5cbkx1Yy5BcnJheUZuR2VuZXJhdG9yID0gcmVxdWlyZSgnLi9hcnJheUZuR2VuZXJhdG9yJyk7XG5cbkx1Yy5hcHBseShMdWMsIHJlcXVpcmUoJy4vaXMnKSk7XG5cbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCcuL2V2ZW50cy9ldmVudEVtaXR0ZXInKTtcblxuTHVjLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxudmFyIEJhc2UgPSByZXF1aXJlKCcuL2NsYXNzL2Jhc2UnKTtcblxuTHVjLkJhc2UgPSBCYXNlO1xuXG52YXIgRGVmaW5lciA9IHJlcXVpcmUoJy4vY2xhc3MvZGVmaW5lcicpO1xuXG5MdWMuQ2xhc3NEZWZpbmVyID0gRGVmaW5lcjtcblxuTHVjLmRlZmluZSA9IERlZmluZXIuZGVmaW5lO1xuXG5MdWMuUGx1Z2luID0gcmVxdWlyZSgnLi9jbGFzcy9wbHVnaW4nKTtcblxuTHVjLmFwcGx5KEx1Yywge1xuICAgIGNvbXBvc2l0aW9uRW51bW5zOiByZXF1aXJlKCcuL2NsYXNzL2NvbXBvc2l0aW9uRW51bW5zJylcbn0pO1xuXG5MdWMuY29tcGFyZSA9IHJlcXVpcmUoJy4vY29tcGFyZScpLmNvbXBhcmU7XG5cblxuaWYodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB3aW5kb3cuTHVjID0gTHVjO1xufSIsIi8qKlxuICogQGNsYXNzIEx1Yy5PYmplY3RcbiAqIFBhY2thZ2UgZm9yIE9iamVjdCBtZXRob2RzXG4gKi9cblxuLyoqXG4gKiBBcHBseSB0aGUgcHJvcGVydGllcyBmcm9tIGZyb21PYmplY3QgdG8gdGhlIHRvT2JqZWN0LiAgZnJvbU9iamVjdCB3aWxsXG4gKiBvdmVyd3JpdGUgYW55IHNoYXJlZCBrZXlzLiAgSXQgY2FuIGFsc28gYmUgdXNlZCBhcyBhIHNpbXBsZSBzaGFsbG93IGNsb25lLlxuICogXG4gICAgdmFyIHRvID0ge2E6MSwgYzoxfSwgZnJvbSA9IHthOjIsIGI6Mn1cbiAgICBMdWMuT2JqZWN0LmFwcGx5KHRvLCBmcm9tKVxuICAgID5PYmplY3Qge2E6IDIsIGM6IDEsIGI6IDJ9XG4gICAgdG8gPT09IHRvXG4gICAgPnRydWVcbiAgICB2YXIgY2xvbmUgPSBMdWMuT2JqZWN0LmFwcGx5KHt9LCBmcm9tKVxuICAgID51bmRlZmluZWRcbiAgICBjbG9uZVxuICAgID5PYmplY3Qge2E6IDIsIGI6IDJ9XG4gICAgY2xvbmUgPT09IGZyb21cbiAgICA+ZmFsc2VcbiAqXG4gKiBAcGFyYW0gIHtPYmplY3R8dW5kZWZpbmVkfSB0b09iamVjdCBPYmplY3QgdG8gcHV0IHRoZSBwcm9wZXJ0aWVzIGZyb21PYmplY3Qgb24uXG4gKiBAcGFyYW0gIHtPYmplY3R8dW5kZWZpbmVkfSBmcm9tT2JqZWN0IE9iamVjdCB0byBwdXQgdGhlIHByb3BlcnRpZXMgb24gdGhlIHRvT2JqZWN0XG4gKiBAcmV0dXJuIHtPYmplY3R9IHRoZSB0b09iamVjdFxuICovXG5leHBvcnRzLmFwcGx5ID0gZnVuY3Rpb24odG9PYmplY3QsIGZyb21PYmplY3QpIHtcbiAgICB2YXIgdG8gPSB0b09iamVjdCB8fCB7fSxcbiAgICAgICAgZnJvbSA9IGZyb21PYmplY3QgfHwge30sXG4gICAgICAgIHByb3A7XG5cbiAgICBmb3IgKHByb3AgaW4gZnJvbSkge1xuICAgICAgICBpZiAoZnJvbS5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgICAgdG9bcHJvcF0gPSBmcm9tW3Byb3BdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRvO1xufTtcblxuLyoqXG4gKiBTaW1pbGFyIHRvIEx1Yy5PYmplY3QuYXBwbHkgZXhjZXB0IHRoYXQgdGhlIGZyb21PYmplY3Qgd2lsbCBcbiAqIE5PVCBvdmVyd3JpdGUgdGhlIGtleXMgb2YgdGhlIHRvT2JqZWN0IGlmIHRoZXkgYXJlIGRlZmluZWQuXG4gKiBcbiAqIEBwYXJhbSAge09iamVjdHx1bmRlZmluZWR9IHRvT2JqZWN0IE9iamVjdCB0byBwdXQgdGhlIHByb3BlcnRpZXMgZnJvbU9iamVjdCBvbi5cbiAqIEBwYXJhbSAge09iamVjdHx1bmRlZmluZWR9IGZyb21PYmplY3QgT2JqZWN0IHRvIHB1dCB0aGUgcHJvcGVydGllcyBvbiB0aGUgdG9PYmplY3RcbiAqIEByZXR1cm4ge09iamVjdH0gdGhlIHRvT2JqZWN0XG4gKi9cbmV4cG9ydHMubWl4ID0gZnVuY3Rpb24odG9PYmplY3QsIGZyb21PYmplY3QpIHtcbiAgICB2YXIgdG8gPSB0b09iamVjdCB8fCB7fSxcbiAgICAgICAgZnJvbSA9IGZyb21PYmplY3QgfHwge30sXG4gICAgICAgIHByb3A7XG5cbiAgICBmb3IgKHByb3AgaW4gZnJvbSkge1xuICAgICAgICBpZiAoZnJvbS5oYXNPd25Qcm9wZXJ0eShwcm9wKSAmJiB0b1twcm9wXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0b1twcm9wXSA9IGZyb21bcHJvcF07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdG87XG59O1xuXG4vKipcbiAqIEl0ZXJhdGUgb3ZlciBhbiBvYmplY3RzIHByb3BlcnRpZXNcbiAqIGFzIGtleSB2YWx1ZSBcInBhaXJzXCIgd2l0aCB0aGUgcGFzc2VkIGluIGZ1bmN0aW9uLlxuICogXG4gICAgdmFyIHRoaXNBcmcgPSB7dmFsOjF9O1xuICAgIEx1Yy5PYmplY3QuZWFjaCh7XG4gICAgICAgIGtleTogMVxuICAgIH0sIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgY29uc29sZS5sb2codmFsdWUgKyBrZXkgKyB0aGlzLnZhbClcbiAgICB9LCB0aGlzQXJnKVxuICAgIFxuICAgID4xa2V5MSBcbiBcbiAqIEBwYXJhbSAge09iamVjdH0gICBvYmogIHRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gZm4gICB0aGUgZnVuY3Rpb24gdG8gY2FsbFxuICogQHBhcmFtICB7U3RyaW5nfSBmbi5rZXkgICB0aGUgb2JqZWN0IGtleVxuICogQHBhcmFtICB7T2JqZWN0fSBmbi52YWx1ZSAgIHRoZSBvYmplY3QgdmFsdWVcbiAqIEBwYXJhbSAge09iamVjdH0gICBbdGhpc0FyZ10gXG4gKiBAcGFyYW0ge09iamVjdH0gIFtjb25maWddXG4gKiBAcGFyYW0ge0Jvb2xlYW59ICBjb25maWcub3duUHJvcGVydGllcyBzZXQgdG8gZmFsc2VcbiAqIHRvIGl0ZXJhdGUgb3ZlciBhbGwgb2YgdGhlIG9iamVjdHMgZW51bWVyYWJsZSBwcm9wZXJ0aWVzLlxuICovXG5leHBvcnRzLmVhY2ggPSBmdW5jdGlvbihvYmosIGZuLCB0aGlzQXJnLCBjb25maWcpIHtcbiAgICB2YXIga2V5LCB2YWx1ZSxcbiAgICAgICAgYWxsUHJvcGVydGllcyA9IGNvbmZpZyAmJiBjb25maWcub3duUHJvcGVydGllcyA9PT0gZmFsc2U7XG5cbiAgICBpZiAoYWxsUHJvcGVydGllcykge1xuICAgICAgICBmb3IgKGtleSBpbiBvYmopIHtcbiAgICAgICAgICAgIGZuLmNhbGwodGhpc0FyZywga2V5LCBvYmpba2V5XSk7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGtleSBpbiBvYmopIHtcbiAgICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGZuLmNhbGwodGhpc0FyZywga2V5LCBvYmpba2V5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vKipcbiAqIFRha2UgYW4gYXJyYXkgb2Ygc3RyaW5ncyBhbmQgYW4gYXJyYXkvYXJndW1lbnRzIG9mXG4gKiB2YWx1ZXMgYW5kIHJldHVybiBhbiBvYmplY3Qgb2Yga2V5IHZhbHVlIHBhaXJzXG4gKiBiYXNlZCBvZmYgZWFjaCBhcnJheXMgaW5kZXguICBJdCBpcyB1c2VmdWwgZm9yIHRha2luZ1xuICogYSBsb25nIGxpc3Qgb2YgYXJndW1lbnRzIGFuZCBjcmVhdGluZyBhbiBvYmplY3QgdGhhdCBjYW5cbiAqIGJlIHBhc3NlZCB0byBvdGhlciBtZXRob2RzLlxuICogXG4gICAgZnVuY3Rpb24gbG9uZ0FyZ3MoYSxiLGMsZCxlLGYpIHtcbiAgICAgICAgcmV0dXJuIEx1Yy5PYmplY3QudG9PYmplY3QoWydhJywnYicsICdjJywgJ2QnLCAnZScsICdmJ10sIGFyZ3VtZW50cylcbiAgICB9XG5cbiAgICBsb25nQXJncygxLDIsMyw0LDUsNiw3LDgsOSlcblxuICAgID5PYmplY3Qge2E6IDEsIGI6IDIsIGM6IDMsIGQ6IDQsIGU6IDXigKZ9XG4gICAgYTogMVxuICAgIGI6IDJcbiAgICBjOiAzXG4gICAgZDogNFxuICAgIGU6IDVcbiAgICBmOiA2XG5cbiAgICBsb25nQXJncygxLDIsMylcblxuICAgID5PYmplY3Qge2E6IDEsIGI6IDIsIGM6IDMsIGQ6IHVuZGVmaW5lZCwgZTogdW5kZWZpbmVk4oCmfVxuICAgIGE6IDFcbiAgICBiOiAyXG4gICAgYzogM1xuICAgIGQ6IHVuZGVmaW5lZFxuICAgIGU6IHVuZGVmaW5lZFxuICAgIGY6IHVuZGVmaW5lZFxuXG4gKiBAcGFyYW0gIHtTdHJpbmdbXX0gc3RyaW5nc1xuICogQHBhcmFtICB7QXJyYXkvYXJndW1lbnRzfSB2YWx1ZXNcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuZXhwb3J0cy50b09iamVjdCA9IGZ1bmN0aW9uKHN0cmluZ3MsIHZhbHVlcykge1xuICAgIHZhciBvYmogPSB7fSxcbiAgICAgICAgaSA9IDAsXG4gICAgICAgIGxlbiA9IHN0cmluZ3MubGVuZ3RoO1xuICAgIGZvciAoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgb2JqW3N0cmluZ3NbaV1dID0gdmFsdWVzW2ldO1xuICAgIH1cblxuICAgIHJldHVybiBvYmo7XG59O1xuXG4vKipcbiAqIFJldHVybiBrZXkgdmFsdWUgcGFpcnMgZnJvbSB0aGUgb2JqZWN0IGlmIHRoZVxuICogZmlsdGVyRm4gcmV0dXJucyBhIHRydXRoeSB2YWx1ZS5cbiAqXG4gICAgTHVjLk9iamVjdC5maWx0ZXIoe1xuICAgICAgICBhOiBmYWxzZSxcbiAgICAgICAgYjogdHJ1ZSxcbiAgICAgICAgYzogZmFsc2VcbiAgICB9LCBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBrZXkgPT09ICdhJyB8fCB2YWx1ZVxuICAgIH0pXG4gICAgPlt7a2V5OiAnYScsIHZhbHVlOiBmYWxzZX0sIHtrZXk6ICdiJywgdmFsdWU6IHRydWV9XVxuICogXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgb2JqICB0aGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3ZlclxuICogQHBhcmFtICB7RnVuY3Rpb259IGZpbHRlckZuICAgdGhlIGZ1bmN0aW9uIHRvIGNhbGwsIHJldHVybiBhIHRydXRoeSB2YWx1ZVxuICogdG8gYWRkIHRoZSBrZXkgdmFsdWUgcGFpclxuICogQHBhcmFtICB7U3RyaW5nfSBmaWx0ZXJGbi5rZXkgICB0aGUgb2JqZWN0IGtleVxuICogQHBhcmFtICB7T2JqZWN0fSBmaWx0ZXJGbi52YWx1ZSAgIHRoZSBvYmplY3QgdmFsdWVcbiAqIEBwYXJhbSAge09iamVjdH0gICBbdGhpc0FyZ10gXG4gKiBAcGFyYW0ge09iamVjdH0gIFtjb25maWddXG4gKiBAcGFyYW0ge0Jvb2xlYW59ICBjb25maWcub3duUHJvcGVydGllcyBzZXQgdG8gZmFsc2VcbiAqIHRvIGl0ZXJhdGUgb3ZlciBhbGwgb2YgdGhlIG9iamVjdHMgZW51bWVyYWJsZSBwcm9wZXJ0aWVzLlxuICogXG4gKiBAcGFyYW0ge0Jvb2xlYW59ICBjb25maWcua2V5cyBzZXQgdG8gdHJ1ZSB0byByZXR1cm5cbiAqIGp1c3QgdGhlIGtleXMuXG4gKlxuICogQHBhcmFtIHtCb29sZWFufSAgY29uZmlnLnZhbHVlcyBzZXQgdG8gdHJ1ZSB0byByZXR1cm5cbiAqIGp1c3QgdGhlIHZhbHVlcy5cbiAqIFxuICogQHJldHVybiB7T2JqZWN0W10vU3RyaW5nW119IEFycmF5IG9mIGtleSB2YWx1ZSBwYWlycyBpbiB0aGUgZm9ybVxuICogb2Yge2tleTogJ2tleScsIHZhbHVlOiB2YWx1ZX0uICBJZiBrZXlzIG9yIHZhbHVlcyBpcyB0cnVlIG9uIHRoZSBjb25maWdcbiAqIGp1c3QgdGhlIGtleXMgb3IgdmFsdWVzIGFyZSByZXR1cm5lZC5cbiAqXG4gKi9cbmV4cG9ydHMuZmlsdGVyID0gZnVuY3Rpb24ob2JqLCBmaWx0ZXJGbiwgdGhpc0FyZywgY29uZmlnKSB7XG4gICAgdmFyIHZhbHVlcyA9IFtdO1xuXG4gICAgZXhwb3J0cy5lYWNoKG9iaiwgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICBpZiAoZmlsdGVyRm4uY2FsbCh0aGlzQXJnLCBrZXksIHZhbHVlKSkge1xuICAgICAgICAgICAgaWYgKGNvbmZpZy5rZXlzID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgdmFsdWVzLnB1c2goa2V5KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29uZmlnLnZhbHVlcyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHZhbHVlcy5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFsdWVzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIGtleToga2V5XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCB0aGlzQXJnLCBjb25maWcpO1xuXG4gICAgcmV0dXJuIHZhbHVlcztcbn07IiwidmFyIG9Ub1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG4vKipcbiAqIEBjbGFzcyBMdWMuaXMgXG4gKiBQYWNrYWdlIGZvciBkZXRlcm1pbmluZyB0aGUgdHlwZXMgb2Ygb2JqZWN0c1xuICogaXQgYWxzbyBoYXMgYW4gTHVjLmlzLmlzRW1wdHkgYW5kIEx1Yy5pcy5pc0ZhbHN5IFxuICogZnVuY3Rpb25zLiAgWW91IGNhbiBzZWUgdGhhdCB3ZSBkb24ndCBoYXZlIGFuIFxuICogaXNOdWxsIGlzVW5kZWZpbmVkIG9yIGlzTmFOLiAgV2UgcHJlZmVyIHRvIHVzZTpcbiBcbiAgICBvYmogPT09IG51bGxcbiAgICBvYmogPT09IHVuZGVmaW5lZFxuICAgIGlzTmFOKG9iailcblxuICogSW0gc3VyZSB0aGVyZSBhIGlzIGEgdXNlIGNhc2UgZm9yIGlzQm9vbGVhblxuICogYnV0IHdlIHdpbGwgbGVhdmUgeW91IG9uIHlvdXIgb3duIGZvciB0aGF0LlxuICovXG5cblxuLyoqXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgcGFzc2VkIGluIG9iamVjdCBpcyBvZlxuICogdGhlIHR5cGUge0BsaW5rIEFycmF5IEFycmF5fVxuICogQHBhcmFtICB7T2JqZWN0fSAgb2JqIFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNBcnJheShvYmopIHtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShvYmopO1xufVxuXG4vKipcbiAqIFJldHVybiB0cnVlIGlmIHRoZSBwYXNzZWQgaW4gb2JqZWN0IGlzIG9mXG4gKiB0aGUgdHlwZSB7QGxpbmsgT2JqZWN0IE9iamVjdH1cbiAqIEBwYXJhbSAge09iamVjdH0gIG9iaiBcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KG9iaikge1xuICAgIHJldHVybiBvVG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBPYmplY3RdJztcbn1cblxuLyoqXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgcGFzc2VkIGluIG9iamVjdCBpcyBvZlxuICogdGhlIHR5cGUge0BsaW5rIEZ1bmN0aW9uIEZ1bmN0aW9ufVxuICogQHBhcmFtICB7T2JqZWN0fSAgb2JqIFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb1RvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbn1cblxuLyoqXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgcGFzc2VkIGluIG9iamVjdCBpcyBvZlxuICogdGhlIHR5cGUge0BsaW5rIERhdGUgRGF0ZX1cbiAqIEBwYXJhbSAge09iamVjdH0gIG9iaiBcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzRGF0ZShvYmopIHtcbiAgICByZXR1cm4gb1RvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufVxuXG4vKipcbiAqIFJldHVybiB0cnVlIGlmIHRoZSBwYXNzZWQgaW4gb2JqZWN0IGlzIG9mXG4gKiB0aGUgdHlwZSB7QGxpbmsgUmVnRXhwIFJlZ0V4cH1cbiAqIEBwYXJhbSAge09iamVjdH0gIG9iaiBcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzUmVnRXhwKG9iaikge1xuICAgIHJldHVybiBvVG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBSZWdFeHBdJztcbn1cblxuLyoqXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgcGFzc2VkIGluIG9iamVjdCBpcyBvZlxuICogdGhlIHR5cGUge0BsaW5rIE51bWJlciBOdW1iZXJ9XG4gKiBAcGFyYW0gIHtPYmplY3R9ICBvYmogXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5mdW5jdGlvbiBpc051bWJlcihvYmopIHtcbiAgICByZXR1cm4gb1RvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgTnVtYmVyXSc7XG59XG5cbi8qKlxuICogUmV0dXJuIHRydWUgaWYgdGhlIHBhc3NlZCBpbiBvYmplY3QgaXMgb2ZcbiAqIHRoZSB0eXBlIHtAbGluayBTdHJpbmcgU3RyaW5nfVxuICogQHBhcmFtICB7T2JqZWN0fSAgb2JqIFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNTdHJpbmcob2JqKSB7XG4gICAgcmV0dXJuIG9Ub1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IFN0cmluZ10nO1xufVxuXG4vKipcbiAqIFJldHVybiB0cnVlIGlmIHRoZSBwYXNzZWQgaW4gb2JqZWN0IGlzIG9mXG4gKiB0aGUgdHlwZSBhcmd1bWVudHMuXG4gKiBcbiAqIEBwYXJhbSAge09iamVjdH0gIG9iaiBcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzQXJndW1lbnRzKG9iaikge1xuICAgIHJldHVybiBvVG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBBcmd1bWVudHNdJztcbn1cblxuLyoqXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgb2JqZWN0IGlzIGZhbHN5IGJ1dCBub3QgemVyby4gIElmXG4gKiB5b3Ugd2FudCBmYWxzeSBjaGVjayB0aGF0IGluY2x1ZGVzIHplcm8gdXNlIGEgZ29yYW0gXG4gKiBpZiBzdGF0ZW1lbnQgOilcbiAqIEBwYXJhbSAge09iamVjdH0gIG9ialxuICogQHJldHVybiB7Qm9vbGVhbn0gICAgIFxuICovXG5mdW5jdGlvbiBpc0ZhbHN5KG9iaikge1xuICAgIHJldHVybiAoIW9iaiAmJiBvYmogIT09IDApO1xufVxuXG4vKipcbiAqIFJldHVybiB0cnVlIGlmIHRoZSBvYmplY3QgaXMgZW1wdHkuXG4gKiB7fSwgW10sICcnLGZhbHNlLCBudWxsLCB1bmRlZmluZWQsIE5hTiBcbiAqIEFyZSBhbGwgdHJlYXRlZCBhcyBlbXB0eS5cbiAqIEBwYXJhbSAge09iamVjdH0gIG9ialxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNFbXB0eShvYmopIHtcbiAgICB2YXIgZW1wdHkgPSBmYWxzZTtcblxuICAgIGlmIChpc0ZhbHN5KG9iaikpIHtcbiAgICAgICAgZW1wdHkgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheShvYmopKSB7XG4gICAgICAgIGVtcHR5ID0gb2JqLmxlbmd0aCA9PT0gMDtcbiAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KG9iaikpIHtcbiAgICAgICAgZW1wdHkgPSBPYmplY3Qua2V5cyhvYmopLmxlbmd0aCA9PT0gMDtcbiAgICB9XG5cbiAgICByZXR1cm4gZW1wdHk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGlzQXJyYXk6IGlzQXJyYXksXG4gICAgaXNPYmplY3Q6IGlzT2JqZWN0LFxuICAgIGlzRnVuY3Rpb246IGlzRnVuY3Rpb24sXG4gICAgaXNEYXRlOiBpc0RhdGUsXG4gICAgaXNTdHJpbmc6IGlzU3RyaW5nLFxuICAgIGlzTnVtYmVyOiBpc051bWJlcixcbiAgICBpc1JlZ0V4cDogaXNSZWdFeHAsXG4gICAgaXNBcmd1bWVudHM6IGlzQXJndW1lbnRzLFxuICAgIGlzRmFsc3k6IGlzRmFsc3ksXG4gICAgaXNFbXB0eTogaXNFbXB0eVxufTsiLCIvKipcbiAqIEBsaWNlbnNlIGh0dHBzOi8vcmF3LmdpdGh1Yi5jb20vam95ZW50L25vZGUvdjAuMTAuMTEvTElDRU5TRVxuICogTm9kZSBqcyBsaWNlbmNlLiBFdmVudEVtaXR0ZXIgd2lsbCBiZSBpbiB0aGUgY2xpZW50XG4gKiBvbmx5IGNvZGUuXG4gKi9cblxudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcblxuLyoqXG4gKiBAY2xhc3MgTHVjLkV2ZW50RW1pdHRlclxuICogVGhlIHdvbmRlcmZ1bCBldmVudCBlbW1pdGVyIHRoYXQgY29tZXMgd2l0aCBub2RlLFxuICogdGhhdCB3b3JrcyBpbiB0aGUgc3VwcG9ydGVkIGJyb3dzZXJzLlxuICogW2h0dHA6Ly9ub2RlanMub3JnL2FwaS9ldmVudHMuaHRtbF0oaHR0cDovL25vZGVqcy5vcmcvYXBpL2V2ZW50cy5odG1sKVxuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICAgIC8vcHV0IGluIGZpeCBmb3IgSUUgOSBhbmQgYmVsb3dcbiAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgIGcgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHNlbGYucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG4gICAgICAgICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuXG4gICAgc2VsZi5vbih0eXBlLCBnKTtcblxuICAgIHJldHVybiB0aGlzO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7IiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxucHJvY2Vzcy5uZXh0VGljayA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhblNldEltbWVkaWF0ZSA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnNldEltbWVkaWF0ZTtcbiAgICB2YXIgY2FuUG9zdCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnBvc3RNZXNzYWdlICYmIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyXG4gICAgO1xuXG4gICAgaWYgKGNhblNldEltbWVkaWF0ZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIHdpbmRvdy5zZXRJbW1lZGlhdGUoZikgfTtcbiAgICB9XG5cbiAgICBpZiAoY2FuUG9zdCkge1xuICAgICAgICB2YXIgcXVldWUgPSBbXTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIGlmIChldi5zb3VyY2UgPT09IHdpbmRvdyAmJiBldi5kYXRhID09PSAncHJvY2Vzcy10aWNrJykge1xuICAgICAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGlmIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmbiA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgICAgIHF1ZXVlLnB1c2goZm4pO1xuICAgICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKCdwcm9jZXNzLXRpY2snLCAnKicpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICBzZXRUaW1lb3V0KGZuLCAwKTtcbiAgICB9O1xufSkoKTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufVxuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG4iLCIoZnVuY3Rpb24ocHJvY2Vzcyl7aWYgKCFwcm9jZXNzLkV2ZW50RW1pdHRlcikgcHJvY2Vzcy5FdmVudEVtaXR0ZXIgPSBmdW5jdGlvbiAoKSB7fTtcblxudmFyIEV2ZW50RW1pdHRlciA9IGV4cG9ydHMuRXZlbnRFbWl0dGVyID0gcHJvY2Vzcy5FdmVudEVtaXR0ZXI7XG52YXIgaXNBcnJheSA9IHR5cGVvZiBBcnJheS5pc0FycmF5ID09PSAnZnVuY3Rpb24nXG4gICAgPyBBcnJheS5pc0FycmF5XG4gICAgOiBmdW5jdGlvbiAoeHMpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4cykgPT09ICdbb2JqZWN0IEFycmF5XSdcbiAgICB9XG47XG5mdW5jdGlvbiBpbmRleE9mICh4cywgeCkge1xuICAgIGlmICh4cy5pbmRleE9mKSByZXR1cm4geHMuaW5kZXhPZih4KTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHhzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh4ID09PSB4c1tpXSkgcmV0dXJuIGk7XG4gICAgfVxuICAgIHJldHVybiAtMTtcbn1cblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhblxuLy8gMTAgbGlzdGVuZXJzIGFyZSBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoXG4vLyBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbi8vXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxudmFyIGRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIXRoaXMuX2V2ZW50cykgdGhpcy5fZXZlbnRzID0ge307XG4gIHRoaXMuX2V2ZW50cy5tYXhMaXN0ZW5lcnMgPSBuO1xufTtcblxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc0FycmF5KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKVxuICAgIHtcbiAgICAgIGlmIChhcmd1bWVudHNbMV0gaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBhcmd1bWVudHNbMV07IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmNhdWdodCwgdW5zcGVjaWZpZWQgJ2Vycm9yJyBldmVudC5cIik7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpIHJldHVybiBmYWxzZTtcbiAgdmFyIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGlmICghaGFuZGxlcikgcmV0dXJuIGZhbHNlO1xuXG4gIGlmICh0eXBlb2YgaGFuZGxlciA9PSAnZnVuY3Rpb24nKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG5cbiAgfSBlbHNlIGlmIChpc0FycmF5KGhhbmRsZXIpKSB7XG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gICAgdmFyIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGxpc3RlbmVycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG5cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG5cbi8vIEV2ZW50RW1pdHRlciBpcyBkZWZpbmVkIGluIHNyYy9ub2RlX2V2ZW50cy5jY1xuLy8gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0KCkgaXMgYWxzbyBkZWZpbmVkIHRoZXJlLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICgnZnVuY3Rpb24nICE9PSB0eXBlb2YgbGlzdGVuZXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2FkZExpc3RlbmVyIG9ubHkgdGFrZXMgaW5zdGFuY2VzIG9mIEZ1bmN0aW9uJyk7XG4gIH1cblxuICBpZiAoIXRoaXMuX2V2ZW50cykgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PSBcIm5ld0xpc3RlbmVyc1wiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lcnNcIi5cbiAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSkge1xuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICB9IGVsc2UgaWYgKGlzQXJyYXkodGhpcy5fZXZlbnRzW3R5cGVdKSkge1xuXG4gICAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICAgIHZhciBtO1xuICAgICAgaWYgKHRoaXMuX2V2ZW50cy5tYXhMaXN0ZW5lcnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBtID0gdGhpcy5fZXZlbnRzLm1heExpc3RlbmVycztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG0gPSBkZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgICAgfVxuXG4gICAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICB9IGVsc2Uge1xuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgc2VsZi5vbih0eXBlLCBmdW5jdGlvbiBnKCkge1xuICAgIHNlbGYucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG4gICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCdmdW5jdGlvbicgIT09IHR5cGVvZiBsaXN0ZW5lcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncmVtb3ZlTGlzdGVuZXIgb25seSB0YWtlcyBpbnN0YW5jZXMgb2YgRnVuY3Rpb24nKTtcbiAgfVxuXG4gIC8vIGRvZXMgbm90IHVzZSBsaXN0ZW5lcnMoKSwgc28gbm8gc2lkZSBlZmZlY3Qgb2YgY3JlYXRpbmcgX2V2ZW50c1t0eXBlXVxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKSByZXR1cm4gdGhpcztcblxuICB2YXIgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNBcnJheShsaXN0KSkge1xuICAgIHZhciBpID0gaW5kZXhPZihsaXN0LCBsaXN0ZW5lcik7XG4gICAgaWYgKGkgPCAwKSByZXR1cm4gdGhpcztcbiAgICBsaXN0LnNwbGljZShpLCAxKTtcbiAgICBpZiAobGlzdC5sZW5ndGggPT0gMClcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIH0gZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdID09PSBsaXN0ZW5lcikge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZG9lcyBub3QgdXNlIGxpc3RlbmVycygpLCBzbyBubyBzaWRlIGVmZmVjdCBvZiBjcmVhdGluZyBfZXZlbnRzW3R5cGVdXG4gIGlmICh0eXBlICYmIHRoaXMuX2V2ZW50cyAmJiB0aGlzLl9ldmVudHNbdHlwZV0pIHRoaXMuX2V2ZW50c1t0eXBlXSA9IG51bGw7XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIGlmICghdGhpcy5fZXZlbnRzKSB0aGlzLl9ldmVudHMgPSB7fTtcbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFtdO1xuICBpZiAoIWlzQXJyYXkodGhpcy5fZXZlbnRzW3R5cGVdKSkge1xuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICB9XG4gIHJldHVybiB0aGlzLl9ldmVudHNbdHlwZV07XG59O1xuXG59KShyZXF1aXJlKFwiX19icm93c2VyaWZ5X3Byb2Nlc3NcIikpIiwidmFyIGlzID0gcmVxdWlyZSgnLi9pcycpLFxuICAgIGFJbnNlcnQgPSByZXF1aXJlKCcuL2FycmF5JykuaW5zZXJ0O1xuICAgIGFFYWNoID0gcmVxdWlyZSgnLi9hcnJheScpLmVhY2g7XG5cbi8qKlxuICogQGNsYXNzIEx1Yy5GdW5jdGlvblxuICogUGFja2FnZSBmb3IgZnVuY3Rpb24gbWV0aG9kcy5cbiAqL1xuXG5mdW5jdGlvbiBhdWdtZW50QXJncyhjb25maWcsIGNhbGxBcmdzKSB7XG4gICAgdmFyIGNvbmZpZ0FyZ3MgPSBjb25maWcuYXJncyxcbiAgICAgICAgaW5kZXggPSBjb25maWcuaW5kZXgsXG4gICAgICAgIGFyZ3NBcnJheTtcblxuICAgIGlmICghY29uZmlnQXJncykge1xuICAgICAgICByZXR1cm4gY2FsbEFyZ3M7XG4gICAgfVxuXG4gICAgaWYoaW5kZXggPT09IHRydWUgfHwgaXMuaXNOdW1iZXIoaW5kZXgpKSB7XG4gICAgICAgIGlmKGNvbmZpZy5hcmd1bWVudHNGaXJzdCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBhSW5zZXJ0KGNvbmZpZ0FyZ3MsIGNhbGxBcmdzLCBpbmRleCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFJbnNlcnQoY2FsbEFyZ3MsIGNvbmZpZ0FyZ3MsIGluZGV4KTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29uZmlnQXJncztcbn1cblxuLyoqXG4gKiBBIHJldXNhYmxlIGVtcHR5IGZ1bmN0aW9uXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZXhwb3J0cy5lbXB0eUZuID0gZnVuY3Rpb24oKSB7fTtcblxuLyoqXG4gKiBBIGZ1bmN0aW9uIHRoYXQgdGhyb3dzIGFuIGVycm9yIHdoZW4gY2FsbGVkLlxuICogVXNlZnVsIHdoZW4gZGVmaW5pbmcgYWJzdHJhY3QgbGlrZSBjbGFzc2VzXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZXhwb3J0cy5hYnN0cmFjdEZuID0gZnVuY3Rpb24oKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdhYnN0cmFjdEZuIG11c3QgYmUgaW1wbGVtZW50ZWQnKTtcbn07XG5cbi8qKlxuICogQWd1bWVudCB0aGUgcGFzc2VkIGluIGZ1bmN0aW9uJ3MgdGhpc0FyZyBhbmQgb3IgYWd1bWVudHMgb2JqZWN0IFxuICogYmFzZWQgb24gdGhlIHBhc3NlZCBpbiBjb25maWcuXG4gKiBcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmbiB0aGUgZnVuY3Rpb24gdG8gY2FsbFxuICogQHBhcmFtICB7T2JqZWN0fSBjb25maWdcbiAqIFxuICogQHBhcmFtIHtPYmplY3R9IFtjb25maWcudGhpc0FyZ10gdGhlIHRoaXNBcmcgZm9yIHRoZSBmdW5jaXRvbiBiZWluZyBleGVjdXRlZC5cbiAqIElmIHRoaXMgaXMgdGhlIG9ubHkgcHJvcGVydHkgb24geW91ciBjb25maWcgb2JqZWN0IHRoZSBwcmVmZXJlZCB3YXkgd291bGRcbiAqIGJlIGp1c3QgdG8gdXNlIEZ1bmN0aW9uLmJpbmRcbiAqIFxuICogQHBhcmFtIHtBcnJheX0gW2NvbmZpZy5hcmdzXSB0aGUgYXJndW1lbnRzIHVzZWQgZm9yIHRoZSBmdW5jdGlvbiBiZWluZyBleGVjdXRlZC5cbiAqIFRoaXMgd2lsbCByZXBsYWNlIHRoZSBmdW5jdGlvbnMgY2FsbCBhcmdzIGlmIGluZGV4IGlzIG5vdCBhIG51bWJlciBvciBcbiAqIHRydWUuXG4gKiBcbiAqIEBwYXJhbSB7TnVtYmVyL1RydWV9IFtjb25maWcuaW5kZXhdIEJ5IGRlZnVhbHQgdGhlIHRoZSBjb25maWd1cmVkIGFyZ3VtZW50c1xuICogd2lsbCBiZSBpbnNlcnRlZCBpbnRvIHRoZSBmdW5jdGlvbnMgcGFzc2VkIGluIGNhbGwgYXJndW1lbnRzLiAgSWYgaW5kZXggaXMgdHJ1ZVxuICogYXBwZW5kIHRoZSBhcmdzIHRvZ2V0aGVyIGlmIGl0IGlzIGEgbnVtYmVyIGluc2VydCBpdCBhdCB0aGUgcGFzc2VkIGluIGluZGV4LlxuICogXG4gKiBAcGFyYW0ge0FycmF5fSBbY29uZmlnLmFyZ3VtZW50c0ZpcnN0XSBwYXNzIGluIGZhbHNlIHRvIFxuICogYWd1bWVudCB0aGUgY29uZmlndXJlZCBhcmdzIGZpcnN0IHdpdGggTHVjLkFycmF5Lmluc2VydC4gIERlZmF1bHRzXG4gKiB0byB0cnVlXG4gICAgIFxuICAgICBmdW5jdGlvbiBmbigpIHtcbiAgICAgICAgY29uc29sZS5sb2codGhpcylcbiAgICAgICAgY29uc29sZS5sb2coYXJndW1lbnRzKVxuICAgIH1cblxuICAgIEx1Yy5GdW5jdGlvbi5jcmVhdGVBdWdtZW50b3IoZm4sIHtcbiAgICAgICAgdGhpc0FyZzoge2NvbmZpZ2VkVGhpc0FyZzogdHJ1ZX0sXG4gICAgICAgIGFyZ3M6IFsxLDIsM10sXG4gICAgICAgIGluZGV4OjBcbiAgICB9KSg0KVxuXG4gICAgPk9iamVjdCB7Y29uZmlnZWRUaGlzQXJnOiB0cnVlfVxuICAgID5bMSwgMiwgMywgNF1cblxuICAgIEx1Yy5GdW5jdGlvbi5jcmVhdGVBdWdtZW50b3IoZm4sIHtcbiAgICAgICAgdGhpc0FyZzoge2NvbmZpZ2VkVGhpc0FyZzogdHJ1ZX0sXG4gICAgICAgIGFyZ3M6IFsxLDIsM10sXG4gICAgICAgIGluZGV4OjAsXG4gICAgICAgIGFyZ3VtZW50c0ZpcnN0OmZhbHNlXG4gICAgfSkoNClcblxuICAgID5PYmplY3Qge2NvbmZpZ2VkVGhpc0FyZzogdHJ1ZX1cbiAgICA+WzQsIDEsIDIsIDNdXG5cblxuICAgIHZhciBmID0gTHVjLkZ1bmN0aW9uLmNyZWF0ZUF1Z21lbnRvcihmbiwge1xuICAgICAgICBhcmdzOiBbMSwyLDNdLFxuICAgICAgICBpbmRleDogdHJ1ZVxuICAgIH0pO1xuXG4gICAgZi5hcHBseSh7Y29uZmlnOiBmYWxzZX0sIFs0XSlcblxuICAgID5PYmplY3Qge2NvbmZpZzogZmFsc2V9XG4gICAgPls0LCAxLCAyLCAzXVxuXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gdGhlIGF1Z21lbnRlZCBmdW5jdGlvbi5cbiAqL1xuZXhwb3J0cy5jcmVhdGVBdWdtZW50b3IgPSBmdW5jdGlvbihmbiwgY29uZmlnKSB7XG4gICAgdmFyIHRoaXNBcmcgPSBjb25maWcudGhpc0FyZztcblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGZuLmFwcGx5KHRoaXNBcmcgfHwgdGhpcywgYXVnbWVudEFyZ3MoY29uZmlnLCBhcmd1bWVudHMpKTtcbiAgICB9O1xufTtcblxuZnVuY3Rpb24gaW5pdFNlcXVlbmNlRnVuY3Rpb25zKGZucywgY29uZmlnKSB7XG4gICAgdmFyIHRvUnVuID0gW107XG4gICAgYUVhY2goZm5zLCBmdW5jdGlvbihmKSB7XG4gICAgICAgIHZhciBmbiA9IGY7XG5cbiAgICAgICAgaWYgKGNvbmZpZykge1xuICAgICAgICAgICAgZm4gPSBleHBvcnRzLmNyZWF0ZUF1Z21lbnRvcihmLCBjb25maWcpO1xuICAgICAgICB9XG5cbiAgICAgICAgdG9SdW4ucHVzaChmbik7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdG9SdW47XG59XG5cbi8qKlxuICogUmV0dXJuIGEgZnVuY3Rpb24gdGhhdCBydW5zIHRoZSBwYXNzZWQgaW4gZnVuY3Rpb25zXG4gKiBhbmQgcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSBsYXN0IGZ1bmN0aW9uIGNhbGxlZC5cbiAqIFxuICogQHBhcmFtICB7RnVuY3Rpb24vRnVuY3Rpb25bXX0gZm5zIFxuICogQHBhcmFtICB7T2JqZWN0fSBbY29uZmlnXSBDb25maWcgb2JqZWN0XG4gKiBmb3IgTHVjLkZ1bmN0aW9uLmNyZWF0ZUF1Z21lbnRvci4gIElmIGRlZmluZWQgYWxsIG9mIHRoZSBmdW5jdGlvbnNcbiAqIHdpbGwgZ2V0IGNyZWF0ZWQgd2l0aCB0aGUgcGFzc2VkIGluIGNvbmZpZztcbiAqXG4gICAgTHVjLkZ1bmN0aW9uLmNyZWF0ZVNlcXVlbmNlKFtcbiAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygxKVxuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKDIpXG4gICAgICAgIH0sXG4gICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coMylcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdmaW5pc2hlZCBsb2dnaW5nJylcbiAgICAgICAgICAgIHJldHVybiA0O1xuICAgICAgICB9XG4gICAgXSkoKVxuICAgID4xXG4gICAgPjJcbiAgICA+M1xuICAgID5maW5pc2hlZCBsb2dnaW5nXG4gICAgPjRcbiAqIFxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbmV4cG9ydHMuY3JlYXRlU2VxdWVuY2UgPSBmdW5jdGlvbihmbnMsIGNvbmZpZykge1xuICAgIHZhciBmdW5jdGlvbnMgPSBpbml0U2VxdWVuY2VGdW5jdGlvbnMoZm5zLCBjb25maWcpO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaSA9IDAsXG4gICAgICAgICAgICBsZW4gPSBmdW5jdGlvbnMubGVuZ3RoO1xuXG4gICAgICAgIGZvcig7aSA8IGxlbiAtMTsgKytpKSB7XG4gICAgICAgICAgICBmdW5jdGlvbnNbaV0uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbnNbbGVuIC0xIF0uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xufTtcblxuLyoqXG4gKiBSZXR1cm4gYSBmdW5jdGlvbiB0aGF0IHJ1bnMgdGhlIHBhc3NlZCBpbiBmdW5jdGlvbnNcbiAqIGlmIG9uZSBvZiB0aGUgZnVuY3Rpb25zIHJlc3VsdHMgZmFsc2UgdGhlIHJlc3Qgb2YgdGhlIFxuICogZnVuY3Rpb25zIHdvbid0IHJ1biBhbmQgZmFsc2Ugd2lsbCBiZSByZXR1cm5lZC5cbiAqXG4gKiBJZiBubyBmYWxzZSBpcyByZXR1cm5lZCB0aGUgdmFsdWUgb2YgdGhlIGxhc3QgZnVuY3Rpb24gcmV0dXJuIHdpbGwgYmUgcmV0dXJuZWRcbiAqIFxuICogQHBhcmFtICB7RnVuY3Rpb24vRnVuY3Rpb25bXX0gZm5zIFxuICogQHBhcmFtICB7T2JqZWN0fSBbY29uZmlnXSBDb25maWcgb2JqZWN0XG4gKiBmb3IgTHVjLkZ1bmN0aW9uLmNyZWF0ZUF1Z21lbnRvci4gIElmIGRlZmluZWQgYWxsIG9mIHRoZSBmdW5jdGlvbnNcbiAqIHdpbGwgZ2V0IGNyZWF0ZWQgd2l0aCB0aGUgcGFzc2VkIGluIGNvbmZpZztcblxuICAgIEx1Yy5GdW5jdGlvbi5jcmVhdGVTZXF1ZW5jZUlmKFtcbiAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygxKVxuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKDIpXG4gICAgICAgIH0sXG4gICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coMylcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdmaW5pc2hlZCBsb2dnaW5nJylcbiAgICAgICAgICAgIHJldHVybiA0O1xuICAgICAgICB9LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnaSBjYW50IGxvZycpXG4gICAgICAgIH1cbiAgICBdKSgpXG5cbiAgICA+MVxuICAgID4yXG4gICAgPjNcbiAgICA+ZmluaXNoZWQgbG9nZ2luZ1xuICAgID5mYWxzZVxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbmV4cG9ydHMuY3JlYXRlU2VxdWVuY2VJZiA9IGZ1bmN0aW9uKGZucywgY29uZmlnKSB7XG4gICAgdmFyIGZ1bmN0aW9ucyA9IGluaXRTZXF1ZW5jZUZ1bmN0aW9ucyhmbnMsIGNvbmZpZyk7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB2YWx1ZSxcbiAgICAgICAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG5cbiAgICAgICAgZnVuY3Rpb25zLnNvbWUoZnVuY3Rpb24oZm4pe1xuICAgICAgICAgICAgdmFsdWUgPSBmbi5hcHBseSh0aGlzLCBhcmdzKTtcblxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlID09PSBmYWxzZTtcbiAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH07XG59O1xuXG4vKipcbiAqIFJldHVybiBhIGZ1bmN0aW9ucyB0aGF0IHJ1bnMgdGhlIHBhc3NlZCBpbiBmdW5jdGlvbnNcbiAqIHRoZSByZXN1bHQgb2YgZWFjaCBmdW5jdGlvbiB3aWxsIGJlIHRoZSB0aGUgY2FsbCBhcmdzIFxuICogZm9yIHRoZSBuZXh0IGZ1bmN0aW9uLiAgVGhlIHZhbHVlIG9mIHRoZSBsYXN0IGZ1bmN0aW9uIFxuICogcmV0dXJuIHdpbGwgYmUgcmV0dXJuZWQuXG4gKiBcbiAqIEBwYXJhbSAge0Z1bmN0aW9uL0Z1bmN0aW9uW119IGZucyBcbiAqIEBwYXJhbSAge09iamVjdH0gW2NvbmZpZ10gQ29uZmlnIG9iamVjdFxuICogZm9yIEx1Yy5GdW5jdGlvbi5jcmVhdGVBdWdtZW50b3IuICBJZiBkZWZpbmVkIGFsbCBvZiB0aGUgZnVuY3Rpb25zXG4gKiB3aWxsIGdldCBjcmVhdGVkIHdpdGggdGhlIHBhc3NlZCBpbiBjb25maWc7XG4gICAgIFxuICAgICBMdWMuRnVuY3Rpb24uY3JlYXRlUmVsYXllcihbXG4gICAgICAgIGZ1bmN0aW9uKHN0cikge1xuICAgICAgICAgICAgcmV0dXJuIHN0ciArICdiJ1xuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbihzdHIpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHIgKyAnYydcbiAgICAgICAgfSxcbiAgICAgICAgZnVuY3Rpb24oc3RyKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RyICsgJ2QnXG4gICAgICAgIH1cbiAgICBdKSgnYScpXG5cbiAgICA+XCJhYmNkXCJcblxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbmV4cG9ydHMuY3JlYXRlUmVsYXllciA9IGZ1bmN0aW9uKGZucywgY29uZmlnKSB7XG4gICAgdmFyIGZ1bmN0aW9ucyA9IGluaXRTZXF1ZW5jZUZ1bmN0aW9ucyhmbnMsIGNvbmZpZyk7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB2YWx1ZSxcbiAgICAgICAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG5cbiAgICAgICAgZnVuY3Rpb25zLmZvckVhY2goZnVuY3Rpb24oZm4sIGluZGV4KSB7XG4gICAgICAgICAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGZuLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGZuLmFwcGx5KHRoaXMsIFt2YWx1ZV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcbn07XG5cbi8qKlxuICogQ3JlYXRlIGEgdGhyb3R0bGVkIGZ1bmN0aW9uIHRoYXQgdGhlIHBhc3NlZCBpbiBmdW5jaXRvblxuICogb25seSBnZXRzIGV2b2tlZCBvbmNlIGV2ZW4gaXQgaXMgY2FsbGVkIG1hbnkgdGltZXNcbiAqXG4gKiBcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmblxuICogQHBhcmFtICB7TnVtYmVyfSBbbWlsbGlzXSBOdW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvXG4gKiB0aHJvdHRsZSB0aGUgZnVuY3Rpb24uXG4gKiBAcGFyYW0gIHtPYmplY3R9IFtjb25maWddIENvbmZpZyBvYmplY3RcbiAqIGZvciBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudG9yLiAgSWYgZGVmaW5lZCBhbGwgb2YgdGhlIGZ1bmN0aW9uc1xuICogd2lsbCBnZXQgY3JlYXRlZCB3aXRoIHRoZSBwYXNzZWQgaW4gY29uZmlnO1xuICogXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZXhwb3J0cy5jcmVhdGVUaHJvdHRlbGVkID0gZnVuY3Rpb24oZiwgbWlsbGlzLCBjb25maWcpIHtcbiAgICB2YXIgZm4gPSBjb25maWcgPyBleHBvcnRzLmNyZWF0ZUF1Z21lbnRvcihmLCBjb25maWcpIDogZixcbiAgICAgICAgdGltZU91dElkID0gZmFsc2U7XG5cbiAgICBpZighbWlsbGlzKSB7XG4gICAgICAgIHJldHVybiBmbjtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgICAgIGlmKHRpbWVPdXRJZCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVPdXRJZCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aW1lT3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGltZU91dElkID0gZmFsc2U7XG4gICAgICAgICAgICBmbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgfSwgbWlsbGlzKTtcbiAgICB9O1xufTtcblxuLyoqXG4gKiBEZWZlciBhIGZ1bmN0aW9uJ3MgZXhlY3V0aW9uIGZvciB0aGUgcGFzc2VkIGluXG4gKiBtaWxsaXNlY29uZHMuXG4gKiBcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmblxuICogQHBhcmFtICB7TnVtYmVyfSBbbWlsbGlzXSBOdW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvXG4gKiBkZWZlclxuICogQHBhcmFtICB7T2JqZWN0fSBbY29uZmlnXSBDb25maWcgb2JqZWN0XG4gKiBmb3IgTHVjLkZ1bmN0aW9uLmNyZWF0ZUF1Z21lbnRvci4gIElmIGRlZmluZWQgYWxsIG9mIHRoZSBmdW5jdGlvbnNcbiAqIHdpbGwgZ2V0IGNyZWF0ZWQgd2l0aCB0aGUgcGFzc2VkIGluIGNvbmZpZztcbiAqIFxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbmV4cG9ydHMuY3JlYXRlRGVmZXJyZWQgPSBmdW5jdGlvbihmLCBtaWxsaXMsIGNvbmZpZykge1xuICAgIHZhciBmbiA9IGNvbmZpZyA/IGV4cG9ydHMuY3JlYXRlQXVnbWVudG9yKGYsIGNvbmZpZykgOiBmO1xuXG4gICAgaWYoIW1pbGxpcykge1xuICAgICAgICByZXR1cm4gZm47XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcblxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZm4uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgIH0sIG1pbGxpcyk7XG4gICAgfTtcbn07IiwidmFyIGFycmF5U2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UsXG4gICAgY29tcGFyZSA9IHJlcXVpcmUoJy4vY29tcGFyZScpLFxuICAgIGlzID0gcmVxdWlyZSgnLi9pcycpLFxuICAgIGNyZWF0ZUJvdW5kQ29tcGFyZUZuID0gY29tcGFyZS5jcmVhdGVCb3VuZENvbXBhcmVGbjtcblxuZnVuY3Rpb24gX2NyZWF0ZUl0ZXJhdG9yRm4oZm4sIGMpIHtcbiAgICB2YXIgY29uZmlnID0gYyB8fCB7fTtcblxuICAgIGlmKGlzLmlzRnVuY3Rpb24oZm4pICYmIChjb25maWcudHlwZSAhPT0gJ3N0cmljdCcpKSB7XG4gICAgICAgIHJldHVybiBjID8gZm4uYmluZChjKSA6IGZuO1xuICAgIH1cblxuICAgIHJldHVybiBjcmVhdGVCb3VuZENvbXBhcmVGbihmbiwgY29uZmlnKTtcbn1cblxuZnVuY3Rpb24gX2NyZWF0ZUl0ZXJhdG9yTm90Rm4oZm4sIGNvbmZpZykge1xuICAgIHZhciBmdW5jdGlvblRvTm90ID0gX2NyZWF0ZUl0ZXJhdG9yRm4oZm4sIGNvbmZpZyk7XG4gICAgICAgIFxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICFmdW5jdGlvblRvTm90LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbn1cblxuXG4vKipcbiAqIEBjbGFzcyBMdWMuQXJyYXkgXG4gKiBQYWNrYWdlIGZvciBBcnJheSBtZXRob2RzLiA8YnI+XG4gKiBcbiAqIEtlZXAgaW4gbWluZCB0aGF0IEx1YyBpcyBvcHRpb25hbGx5IHBhY2thZ2VkIHdpdGggZXM1IHNoaW0gc28geW91IGNhbiB0YXJnZXQgbm9uLWVzNSBicm93c2Vycy5cbiAqIEl0IGNvbWVzIHdpdGggeW91ciBmYXZvcml0ZSB7QGxpbmsgQXJyYXkgQXJyYXl9IG1ldGhvZHMgc3VjaCBhcyBBcnJheS5mb3JFYWNoLCBBcnJheS5maWx0ZXIsIEFycmF5LnNvbWUsIEFycmF5LmV2ZXJ5IEFycmF5LnJlZHVjZVJpZ2h0IC4uXG4gKlxuICogQWxzbyBkb24ndCBmb3JnZXQgYWJvdXQgTHVjLkFycmF5LmVhY2ggYW5kIEx1Yy5BcnJheS50b0FycmF5LCB0aGV5IGFyZSBncmVhdCB1dGlsaXR5IG1ldGhvZHNcbiAqIHRoYXQgYXJlIHVzZWQgYWxsIG92ZXIgdGhlIGZyYW1ld29yay5cbiAqIFxuICogQWxsIHJlbW92ZVxcKiAvIGZpbmRcXCogbWV0aG9kcyBmb2xsb3cgdGhlIHNhbWUgYXBpLiAgXFwqQWxsIGZ1bmN0aW9ucyB3aWxsIHJldHVybiBhbiBhcnJheSBvZiByZW1vdmVkIG9yIGZvdW5kXG4gKiBpdGVtcyBhbmQgZmFsc2UgaWYgbm9uZSBhcmUgZm91bmQuICBUaGUgaXRlbXMgd2lsbCBiZSBhZGRlZCB0byB0aGUgYXJyYXkgaW4gdGhlIG9yZGVyIHRoZXkgYXJlXG4gKiBmb3VuZC4gIFxcKkZpcnN0IGZ1bmN0aW9ucyB3aWxsIHJldHVybiB0aGUgZmlyc3QgaXRlbSBhbmQgc3RvcCBpdGVyYXRpbmcgYWZ0ZXIgdGhhdCwgaWYgbm9uZVxuICogIGlzIGZvdW5kIGZhbHNlIGlzIHJldHVybmVkLiAgcmVtb3ZlXFwqIGZ1bmN0aW9ucyB3aWxsIGRpcmVjdGx5IGNoYW5nZSB0aGUgcGFzc2VkIGluIGFycmF5LlxuICogIFxcKk5vdCBmdW5jdGlvbnMgb25seSBkbyB0aGUgZm9sbG93aW5nIGFjdGlvbnMgaWYgdGhlIGNvbXBhcmlzb24gaXMgbm90IHRydWUuXG4gKiAgQWxsIHJlbW92ZVxcKiAvIGZpbmRcXCogdGFrZSB0aGUgZm9sbG93aW5nIGFwaTogYXJyYXksIG9iamVjdFRvQ29tcGFyZU9ySXRlcmF0b3IsIGNvbXBhcmVDb25maWdPclRoaXNBcmcgZm9yIGV4YW1wbGU6XG4gKlxuICAgIEx1Yy5BcnJheS5maW5kRmlyc3QoWzEsMiwzLCB7fV0sIHt9KTtcbiAgICA+T2JqZWN0IHt9XG5cbiAgICBMdWMuQXJyYXkuZmluZEZpcnN0KFsxLDIsMyx7fV0sIHt9LCB7dHlwZTogJ3N0cmljdCd9KTtcbiAgICA+ZmFsc2VcblxuICAgIEx1Yy5BcnJheS5maW5kRmlyc3QoWzEsMiwzLHt9XSwgZnVuY3Rpb24odmFsLCBpbmRleCwgYXJyYXkpe1xuICAgICAgICByZXR1cm4gdmFsID09PSAzIHx8IHRoaXMubnVtID09PSB2YWw7XG4gICAgfSwge251bTogMX0pO1xuICAgID4xXG5cbiAgICB2YXIgYXJyID0gWzEsMix7YToxfSwxLCB7YToxfV07XG4gICAgTHVjLkFycmF5LnJlbW92ZUZpcnN0KGFyciwge2E6MX0pXG4gICAgPnthOjF9XG4gICAgYXJyO1xuICAgID5bMSwgMiwgMSwge2E6MX1dXG4gICAgTHVjLkFycmF5LnJlbW92ZUxhc3QoYXJyLCAxKVxuICAgID4xXG4gICAgYXJyO1xuICAgID5bMSwyLCB7YToxfV1cblxuICpcbiAqIEZvciBjb21tb25seSB1c2VkIGZpbmQvcmVtb3ZlIGZ1bmN0aW9ucyBjaGVjayBvdXQgTHVjLkFycmF5Rm5zIGZvciBleGFtcGxlIGFcbiAqIFwiY29tcGFjdFwiIGxpa2UgZnVuY3Rpb25cbiAqIFxuICAgIEx1Yy5BcnJheS5maW5kQWxsTm90RmFsc3koW2ZhbHNlLCAnJywgdW5kZWZpbmVkLCAwLCB7fSwgW11dKVxuICAgID5bMCwge30sIFtdXVxuICpcbiAqIE9yIHJlbW92ZSBhbGwgZW1wdHkgaXRlbXNcbiAqIFxuICAgIHZhciBhcnIgPSBbJycsIDAgLCBbXSwge2E6MX0sIHRydWUsIHt9LCBbMV1dXG4gICAgTHVjLkFycmF5LnJlbW92ZUFsbEVtcHR5KGFycilcbiAgICA+WycnLCBbXSwge31dXG4gICAgYXJyXG4gICAgPlswLCB7YToxfSwgdHJ1ZSwgWzFdXVxuICovXG5cbi8qKlxuICogVHVybiB0aGUgcGFzc2VkIGluIGl0ZW0gaW50byBhbiBhcnJheSBpZiBpdFxuICogaXNuJ3Qgb25lIGFscmVhZHksIGlmIHRoZSBpdGVtIGlzIGFuIGFycmF5IGp1c3QgcmV0dXJuIGl0LiAgXG4gKiBJdCByZXR1cm5zIGFuIGVtcHR5IGFycmF5IGlmIGl0ZW0gaXMgbnVsbCBvciB1bmRlZmluZWQuXG4gKiBJZiBpdCBpcyBqdXN0IGEgc2luZ2xlIGl0ZW0gcmV0dXJuIGFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIGl0ZW0uXG4gKiBcbiAgICBMdWMuQXJyYXkudG9BcnJheSgpXG4gICAgPltdXG4gICAgTHVjLkFycmF5LnRvQXJyYXkobnVsbClcbiAgICA+W11cbiAgICBMdWMuQXJyYXkudG9BcnJheSgxKVxuICAgID5bMV1cbiAgICBMdWMuQXJyYXkudG9BcnJheShbMSwyXSlcbiAgICA+WzEsIDJdXG4gKlxuICogQHBhcmFtICB7T2JqZWN0fSBpdGVtIGl0ZW0gdG8gdHVybiBpbnRvIGFuIGFycmF5LlxuICogQHJldHVybiB0aGUgYXJyYXlcbiAqL1xuZnVuY3Rpb24gdG9BcnJheShpdGVtKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoaXRlbSkpIHtcbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfVxuICAgIHJldHVybiAoaXRlbSA9PT0gbnVsbCB8fCBpdGVtID09PSB1bmRlZmluZWQpID8gW10gOiBbaXRlbV07XG59XG5cbi8qKlxuICogUnVucyBhbiBBcnJheS5mb3JFYWNoIGFmdGVyIGNhbGxpbmcgTHVjLkFycmF5LnRvQXJyYXkgb24gdGhlIGl0ZW0uXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgaXRlbVxuICogQHBhcmFtICB7RnVuY3Rpb259IGZuICAgICAgICBcbiAqIEBwYXJhbSAge09iamVjdH0gICB0aGlzQXJnICAgXG4gKlxuICBJdCBpcyB2ZXJ5IHVzZWZ1bCBmb3Igc2V0dGluZyB1cCBmbGV4YWJsZSBhcGkncyB0aGF0IGNhbiBoYW5kbGUgbm9uZSBvbmUgb3IgbWFueS5cblxuICAgIEx1Yy5BcnJheS5lYWNoKHRoaXMuaXRlbXMsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgdGhpcy5fYWRkSXRlbShpdGVtKTtcbiAgICB9KTtcblxuICAgIHZzLlxuXG4gICAgaWYoQXJyYXkuaXNBcnJheSh0aGlzLml0ZW1zKSl7XG4gICAgICAgIHRoaXMuaXRlbXMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICB0aGlzLl9hZGRJdGVtKGl0ZW0pO1xuICAgICAgICB9KVxuICAgIH1cbiAgICBlbHNlIGlmKHRoaXMuaXRlbXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLl9hZGRJdGVtKHRoaXMuaXRlbXMpO1xuICAgIH1cblxuICovXG5mdW5jdGlvbiBlYWNoKGl0ZW0sIGZuLCB0aGlzQXJnKSB7XG4gICAgdmFyIGFyciA9IHRvQXJyYXkoaXRlbSk7XG4gICAgcmV0dXJuIGFyci5mb3JFYWNoLmNhbGwoYXJyLCBmbiwgdGhpc0FyZyk7XG59XG5cbi8qKlxuICogSW5zZXJ0IG9yIGFwcGVuZCB0aGUgc2Vjb25kIGFycmF5L2FyZ3VtZW50cyBpbnRvIHRoZVxuICogZmlyc3QgYXJyYXkvYXJndW1lbnRzLiAgVGhpcyBtZXRob2QgZG9lcyBub3QgYWx0ZXJcbiAqIHRoZSBwYXNzZWQgaW4gYXJyYXkvYXJndW1lbnRzLlxuICogXG4gKiBAcGFyYW0gIHtBcnJheS9hcmd1bWVudHN9IGZpcnN0QXJyYXlPckFyZ3NcbiAqIEBwYXJhbSAge0FycmF5L2FyZ3VtZW50c30gc2Vjb25kQXJyYXlPckFyZ3NcbiAqIEBwYXJhbSAge051bWJlci90cnVlfSBpbmRleE9yQXBwZW5kIHRydWUgdG8gYXBwZW5kIFxuICogdGhlIHNlY29uZCBhcnJheSB0byB0aGUgZW5kIG9mIHRoZSBmaXJzdCBvbmUuICBJZiBpdCBpcyBhIG51bWJlclxuICogaW5zZXJ0IHRoZSBzZWNvbmRBcnJheSBpbnRvIHRoZSBmaXJzdCBvbmUgYXQgdGhlIHBhc3NlZCBpbiBpbmRleC5cbiAgIFxuICAgIEx1Yy5BcnJheS5pbnNlcnQoWzAsNF0sIFsxLDIsM10sIDEpO1xuICAgID5bMCwgMSwgMiwgMywgNF1cbiAgICBMdWMuQXJyYXkuaW5zZXJ0KFswLDRdLCBbMSwyLDNdLCB0cnVlKTtcbiAgICA+WzAsIDQsIDEsIDIsIDNdXG4gICAgTHVjLkFycmF5Lmluc2VydChbMCw0XSwgWzEsMiwzXSwgMCk7XG4gICAgPlsxLCAyLCAzLCAwLCA0XVxuIFxuICogQHJldHVybiB7QXJyYXl9XG4gKi9cbmZ1bmN0aW9uIGluc2VydChmaXJzdEFycmF5T3JBcmdzLCBzZWNvbmRBcnJheU9yQXJncywgaW5kZXhPckFwcGVuZCkge1xuICAgIHZhciBmaXJzdEFycmF5ID0gYXJyYXlTbGljZS5jYWxsKGZpcnN0QXJyYXlPckFyZ3MpLFxuICAgICAgICBzZWNvbmRBcnJheSA9IGFycmF5U2xpY2UuY2FsbChzZWNvbmRBcnJheU9yQXJncyksXG4gICAgICAgIHNwbGljZUFyZ3M7XG5cbiAgICBpZihpbmRleE9yQXBwZW5kID09PSB0cnVlKSB7XG4gICAgICAgIHJldHVybiBmaXJzdEFycmF5LmNvbmNhdChzZWNvbmRBcnJheSk7XG4gICAgfVxuXG4gICAgc3BsaWNlQXJncyA9IFtpbmRleE9yQXBwZW5kLCAwXS5jb25jYXQoc2Vjb25kQXJyYXkpO1xuICAgIGZpcnN0QXJyYXkuc3BsaWNlLmFwcGx5KGZpcnN0QXJyYXksIHNwbGljZUFyZ3MpO1xuICAgIHJldHVybiBmaXJzdEFycmF5O1xufVxuXG4vKipcbiAqIFJlbW92ZSBhbiBpdGVtIGZyb20gYW4gdGhlIHBhc3NlZCBpbiBhcnJcbiAqIGZyb20gdGhlIGluZGV4LlxuICogQHBhcmFtICB7QXJyYXl9IGFyclxuICogQHBhcmFtICB7TnVtYmVyfSBpbmRleFxuICogQHJldHVybiB7T2JqZWN0fSB0aGUgaXRlbSByZW1vdmVkLlxuICovXG5mdW5jdGlvbiByZW1vdmVBdEluZGV4KGFyciwgaW5kZXgpIHtcbiAgICB2YXIgaXRlbSA9IGFycltpbmRleF07XG4gICAgYXJyLnNwbGljZShpbmRleCwgMSk7XG4gICAgcmV0dXJuIGl0ZW07XG59XG5cbmZ1bmN0aW9uIF9yZW1vdmVGaXJzdChhcnIsIGZuKSB7XG4gICAgdmFyIHJlbW92ZWQgPSBmYWxzZTtcblxuICAgIGFyci5zb21lKGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xuICAgICAgICBpZiAoZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKSkge1xuICAgICAgICAgICAgcmVtb3ZlZCA9IHJlbW92ZUF0SW5kZXgoYXJyLCBpbmRleCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlbW92ZWQ7XG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBmaXJzdCBpdGVtIGZyb20gdGhlIHBhc3NlZCBpbiBhcnJheVxuICogdGhhdCBtYXRjaGVzIHRoZSBwYXNzZWQgaW4gb2JqZWN0LiAgSW5zdGVhZCBvZiBcbiAqIGNvbXBhcmluZyBhbiBvYmplY3QgYW4gaXRlcmF0b3IgZnVuY3Rpb24gY2FuIGJlXG4gKiB1c2VkLlxuICogXG4gKiBAcGFyYW0gIHtBcnJheX0gYXJyXG4gKiBAcGFyYW0gIHtBbnkvRnVuY3Rpb259IG9iamVjdE9ySXRlcmF0b3IgaWYgdGhlIHZhbHVlXG4gKiBpcyB7QGxpbmsgTHVjI2NvbXBhcmUgZXF1YWx9IHRvIG9yIHRoZSBpdGVyYXRvciByZXR1cm5zIHRydWUgcmVtb3ZlIHRoZSBcbiAqIG9iamVjdCBmcm9tIHRoZSBhcnJheS5cbiAqIFxuICogSWYgYW4gaXRlcmF0b3IgZnVuY3Rpb24gaXMgcGFzc2VkIGl0IHdpbGwgYmUgY2FsbGVkIHdpdGggdGhlIGZvbGxvd2luZyBcbiAqIHBhcmFtZXRlcnMuICBUaGUgc2FtZSBwYXJhbWV0ZXIgdG8gQXJyYXkuZm9yRWFjaFxuICogXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0T3JJdGVyYXRvci52YWx1ZSBcbiAqIEBwYXJhbSB7TnVtYmVyfSBvYmplY3RPckl0ZXJhdG9yLm51bWJlclxuICogQHBhcmFtIHtBcnJheX0gb2JqZWN0T3JJdGVyYXRvci5hcnJheVxuICpcbiAqIFxuICogQHBhcmFtICB7T2JqZWN0fSBbY29uZmlnT3J0aGlzQXJnXVxuICogXG4gKiB0aGlzQXJnIGZvciB0aGUgaXRlcmF0b3IgZnVuY3Rpb24gYW4gaXRlcmF0b3IgaXNcbiAqIHVzZWQuXG4gKiBcbiAqIE9wdGlvbiBjb25maWcgb2JqZWN0IGZvciBMdWMuY29tcGFyZSBpZiBhbiBpdGVyYXRvclxuICogZnVuY3Rpb24gaXMgbm90IHBhc3NlZCBpbi4gIElmIHlvdSB3YW50IHRvIGFjdHVhbGx5XG4gKiBkbyBhIGRpcmVjdCBlcXVhbGl0eSBjb21wYXJpc29uIG9uIGEgZnVuY3Rpb24gaW5zdGVhZCBvZlxuICogdXNpbmcgaXQgYXMgYW4gaXRlcmF0b3IgcGFzcyBpbiB7dHlwZTogJ3N0cmljdCd9XG4gKiBcbiAqIEByZXR1cm4ge09iamVjdH0gdGhlIG9iamVjdCB0aGF0IHdhcyByZW1vdmVkXG4gKiBmYWxzZSBpZiBubyBvYmplY3Qgd2FzIHJlbW92ZWQ7XG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUZpcnN0KGFyciwgb2JqLCBjb25maWcpIHtcbiAgICB2YXIgZm4gPSBfY3JlYXRlSXRlcmF0b3JGbihvYmosIGNvbmZpZyk7XG4gICAgcmV0dXJuIF9yZW1vdmVGaXJzdChhcnIsIGZuKTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGZpcnN0IGl0ZW0gZnJvbSB0aGUgcGFzc2VkIGluIGFycmF5XG4gKiB0aGF0IGRvZXMgbm90IG1hdGNoIHRoZSBwYXNzZWQgaW4gb2JqZWN0LiAgSW5zdGVhZCBvZiBcbiAqIGNvbXBhcmluZyBhbiBvYmplY3QgYW4gaXRlcmF0b3IgZnVuY3Rpb24gY2FuIGJlXG4gKiB1c2VkLlxuICogXG4gKiBAcGFyYW0gIHtBcnJheX0gYXJyXG4gKiBAcGFyYW0gIHtBbnkvRnVuY3Rpb259IG9iamVjdE9ySXRlcmF0b3IgaWYgdGhlIHZhbHVlXG4gKiBpcyB7QGxpbmsgTHVjI2NvbXBhcmUgZXF1YWx9IHRvIG9yIHRoZSBpdGVyYXRvciByZXR1cm5zIHRydWUgcmVtb3ZlIHRoZSBcbiAqIG9iamVjdCBmcm9tIHRoZSBhcnJheS5cbiAqIFxuICogSWYgYW4gaXRlcmF0b3IgZnVuY3Rpb24gaXMgcGFzc2VkIGl0IHdpbGwgYmUgY2FsbGVkIHdpdGggdGhlIGZvbGxvd2luZyBcbiAqIHBhcmFtZXRlcnMuICBUaGUgc2FtZSBwYXJhbWV0ZXIgdG8gQXJyYXkuZm9yRWFjaFxuICogXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0T3JJdGVyYXRvci52YWx1ZSBcbiAqIEBwYXJhbSB7TnVtYmVyfSBvYmplY3RPckl0ZXJhdG9yLm51bWJlclxuICogQHBhcmFtIHtBcnJheX0gb2JqZWN0T3JJdGVyYXRvci5hcnJheVxuICpcbiAqIFxuICogQHBhcmFtICB7T2JqZWN0fSBbY29uZmlnT3J0aGlzQXJnXVxuICogXG4gKiB0aGlzQXJnIGZvciB0aGUgaXRlcmF0b3IgZnVuY3Rpb24gYW4gaXRlcmF0b3IgaXNcbiAqIHVzZWQuXG4gKiBcbiAqIE9wdGlvbiBjb25maWcgb2JqZWN0IGZvciBMdWMuY29tcGFyZSBpZiBhbiBpdGVyYXRvclxuICogZnVuY3Rpb24gaXMgbm90IHBhc3NlZCBpbi4gIElmIHlvdSB3YW50IHRvIGFjdHVhbGx5XG4gKiBkbyBhIGRpcmVjdCBlcXVhbGl0eSBjb21wYXJpc29uIG9uIGEgZnVuY3Rpb24gaW5zdGVhZCBvZlxuICogdXNpbmcgaXQgYXMgYW4gaXRlcmF0b3IgcGFzcyBpbiB7dHlwZTogJ3N0cmljdCd9XG4gKiBcbiAqIEByZXR1cm4ge09iamVjdH0gdGhlIG9iamVjdCB0aGF0IHdhcyByZW1vdmVkXG4gKiBmYWxzZSBpZiBubyBvYmplY3Qgd2FzIHJlbW92ZWQ7XG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUZpcnN0Tm90KGFyciwgb2JqLCBjb25maWcpIHtcbiAgICB2YXIgZm4gPSBfY3JlYXRlSXRlcmF0b3JOb3RGbihvYmosIGNvbmZpZyk7XG4gICAgcmV0dXJuIF9yZW1vdmVGaXJzdChhcnIsIGZuKTtcbn1cblxuXG5mdW5jdGlvbiBfcmVtb3ZlQWxsKGFyciwgZm4pIHtcbiAgICB2YXIgaW5kZXhzVG9SZW1vdmUgPSBbXSxcbiAgICAgICAgcmVtb3ZlZCA9IFtdO1xuXG4gICAgYXJyLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XG4gICAgICAgIGlmIChmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSB7XG4gICAgICAgICAgICBpbmRleHNUb1JlbW92ZS51bnNoaWZ0KGluZGV4KTtcbiAgICAgICAgICAgIHJlbW92ZWQucHVzaCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGluZGV4c1RvUmVtb3ZlLmZvckVhY2goZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgICByZW1vdmVBdEluZGV4KGFyciwgaW5kZXgpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlbW92ZWQ7XG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBhbGwgdGhlIGl0ZW1zIGZyb20gdGhlIHBhc3NlZCBpbiBhcnJheVxuICogdGhhdCBkbyBub3QgbWF0Y2ggbWF0Y2hlcyB0aGUgcGFzc2VkIGluIG9iamVjdC4gIEluc3RlYWQgb2YgXG4gKiBjb21wYXJpbmcgYW4gb2JqZWN0IGFuIGl0ZXJhdG9yIGZ1bmN0aW9uIGNhbiBiZVxuICogdXNlZC5cbiAqIFxuICogQHBhcmFtICB7QXJyYXl9IGFyclxuICogQHBhcmFtICB7QW55L0Z1bmN0aW9ufSBvYmplY3RPckl0ZXJhdG9yIGlmIHRoZSB2YWx1ZVxuICogaXMge0BsaW5rIEx1YyNjb21wYXJlIGVxdWFsfSB0byBvciB0aGUgaXRlcmF0b3IgcmV0dXJucyB0cnVlIHJlbW92ZSB0aGUgXG4gKiBvYmplY3QgZnJvbSB0aGUgYXJyYXkuXG4gKiBcbiAqIElmIGFuIGl0ZXJhdG9yIGZ1bmN0aW9uIGlzIHBhc3NlZCBpdCB3aWxsIGJlIGNhbGxlZCB3aXRoIHRoZSBmb2xsb3dpbmcgXG4gKiBwYXJhbWV0ZXJzLiAgVGhlIHNhbWUgcGFyYW1ldGVyIHRvIEFycmF5LmZvckVhY2hcbiAqIFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdE9ySXRlcmF0b3IudmFsdWUgXG4gKiBAcGFyYW0ge051bWJlcn0gb2JqZWN0T3JJdGVyYXRvci5udW1iZXJcbiAqIEBwYXJhbSB7QXJyYXl9IG9iamVjdE9ySXRlcmF0b3IuYXJyYXlcbiAqXG4gKiBcbiAqIEBwYXJhbSAge09iamVjdH0gW2NvbmZpZ09ydGhpc0FyZ11cbiAqIFxuICogdGhpc0FyZyBmb3IgdGhlIGl0ZXJhdG9yIGZ1bmN0aW9uIGFuIGl0ZXJhdG9yIGlzXG4gKiB1c2VkLlxuICogXG4gKiBPcHRpb24gY29uZmlnIG9iamVjdCBmb3IgTHVjLmNvbXBhcmUgaWYgYW4gaXRlcmF0b3JcbiAqIGZ1bmN0aW9uIGlzIG5vdCBwYXNzZWQgaW4uICBJZiB5b3Ugd2FudCB0byBhY3R1YWxseVxuICogZG8gYSBkaXJlY3QgZXF1YWxpdHkgY29tcGFyaXNvbiBvbiBhIGZ1bmN0aW9uIGluc3RlYWQgb2ZcbiAqIHVzaW5nIGl0IGFzIGFuIGl0ZXJhdG9yIHBhc3MgaW4ge3R5cGU6ICdzdHJpY3QnfVxuICogXG4gKiBAcmV0dXJuIHtBcnJheX0gYW4gYXJyYXkgb2YgaXRlbXMgcmVtb3ZlZFxuICovXG5mdW5jdGlvbiByZW1vdmVBbGxOb3QoYXJyLCBvYmosIGNvbmZpZykge1xuICAgIHZhciBmbiA9IF9jcmVhdGVJdGVyYXRvck5vdEZuKG9iaiwgY29uZmlnKTtcbiAgICByZXR1cm4gX3JlbW92ZUFsbChhcnIsIGZuKTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGFsbCB0aGUgaXRlbXMgZnJvbSB0aGUgcGFzc2VkIGluIGFycmF5XG4gKiB0aGF0IG1hdGNoZXMgdGhlIHBhc3NlZCBpbiBvYmplY3QuICBJbnN0ZWFkIG9mIFxuICogY29tcGFyaW5nIGFuIG9iamVjdCBhbiBpdGVyYXRvciBmdW5jdGlvbiBjYW4gYmVcbiAqIHVzZWQuXG4gKiBcbiAqIEBwYXJhbSAge0FycmF5fSBhcnJcbiAqIEBwYXJhbSAge0FueS9GdW5jdGlvbn0gb2JqZWN0T3JJdGVyYXRvciBpZiB0aGUgdmFsdWVcbiAqIGlzIHtAbGluayBMdWMjY29tcGFyZSBlcXVhbH0gdG8gb3IgdGhlIGl0ZXJhdG9yIHJldHVybnMgdHJ1ZSByZW1vdmUgdGhlIFxuICogb2JqZWN0IGZyb20gdGhlIGFycmF5LlxuICogXG4gKiBJZiBhbiBpdGVyYXRvciBmdW5jdGlvbiBpcyBwYXNzZWQgaXQgd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGUgZm9sbG93aW5nIFxuICogcGFyYW1ldGVycy4gIFRoZSBzYW1lIHBhcmFtZXRlciB0byBBcnJheS5mb3JFYWNoXG4gKiBcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3RPckl0ZXJhdG9yLnZhbHVlIFxuICogQHBhcmFtIHtOdW1iZXJ9IG9iamVjdE9ySXRlcmF0b3IubnVtYmVyXG4gKiBAcGFyYW0ge0FycmF5fSBvYmplY3RPckl0ZXJhdG9yLmFycmF5XG4gKlxuICogXG4gKiBAcGFyYW0gIHtPYmplY3R9IFtjb25maWdPcnRoaXNBcmddXG4gKiBcbiAqIHRoaXNBcmcgZm9yIHRoZSBpdGVyYXRvciBmdW5jdGlvbiBhbiBpdGVyYXRvciBpc1xuICogdXNlZC5cbiAqIFxuICogT3B0aW9uIGNvbmZpZyBvYmplY3QgZm9yIEx1Yy5jb21wYXJlIGlmIGFuIGl0ZXJhdG9yXG4gKiBmdW5jdGlvbiBpcyBub3QgcGFzc2VkIGluLiAgSWYgeW91IHdhbnQgdG8gYWN0dWFsbHlcbiAqIGRvIGEgZGlyZWN0IGVxdWFsaXR5IGNvbXBhcmlzb24gb24gYSBmdW5jdGlvbiBpbnN0ZWFkIG9mXG4gKiB1c2luZyBpdCBhcyBhbiBpdGVyYXRvciBwYXNzIGluIHt0eXBlOiAnc3RyaWN0J31cbiAqIFxuICogQHJldHVybiB7QXJyYXl9IGFuIGFycmF5IG9mIGl0ZW1zIHJlbW92ZWRcbiAqL1xuZnVuY3Rpb24gcmVtb3ZlQWxsKGFyciwgb2JqLCBjb25maWcpIHtcbiAgICB2YXIgZm4gPSBfY3JlYXRlSXRlcmF0b3JGbihvYmosIGNvbmZpZyk7XG4gICAgcmV0dXJuIF9yZW1vdmVBbGwoYXJyLCBmbik7XG59XG5cbmZ1bmN0aW9uIF9maW5kRmlyc3QoYXJyLCBmbikge1xuICAgIHZhciBpdGVtID0gZmFsc2U7XG4gICAgYXJyLnNvbWUoZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XG4gICAgICAgIGlmIChmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSB7XG4gICAgICAgICAgICBpdGVtID0gYXJyW2luZGV4XTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gaXRlbTtcbn1cblxuLyoqXG4gKiBGaW5kIHRoZSBmaXJzdCBpdGVtIGZyb20gdGhlIHBhc3NlZCBpbiBhcnJheVxuICogdGhhdCBkb2VzIG5vdCBtYXRjaCB0aGUgcGFzc2VkIGluIG9iamVjdC4gIEluc3RlYWQgb2YgXG4gKiBjb21wYXJpbmcgYW4gb2JqZWN0IGFuIGl0ZXJhdG9yIGZ1bmN0aW9uIGNhbiBiZVxuICogdXNlZC5cbiAqIFxuICogQHBhcmFtICB7QXJyYXl9IGFyclxuICogQHBhcmFtICB7QW55L0Z1bmN0aW9ufSBvYmplY3RPckl0ZXJhdG9yIGlmIHRoZSB2YWx1ZVxuICogaXMge0BsaW5rIEx1YyNjb21wYXJlIGVxdWFsfSB0byBvciB0aGUgaXRlcmF0b3IgcmV0dXJucyB0cnVlIHJlbW92ZSB0aGUgXG4gKiBvYmplY3QgZnJvbSB0aGUgYXJyYXkuXG4gKiBcbiAqIElmIGFuIGl0ZXJhdG9yIGZ1bmN0aW9uIGlzIHBhc3NlZCBpdCB3aWxsIGJlIGNhbGxlZCB3aXRoIHRoZSBmb2xsb3dpbmcgXG4gKiBwYXJhbWV0ZXJzLiAgVGhlIHNhbWUgcGFyYW1ldGVyIHRvIEFycmF5LmZvckVhY2hcbiAqIFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdE9ySXRlcmF0b3IudmFsdWUgXG4gKiBAcGFyYW0ge051bWJlcn0gb2JqZWN0T3JJdGVyYXRvci5udW1iZXJcbiAqIEBwYXJhbSB7QXJyYXl9IG9iamVjdE9ySXRlcmF0b3IuYXJyYXlcbiAqXG4gKiBcbiAqIEBwYXJhbSAge09iamVjdH0gW2NvbmZpZ09ydGhpc0FyZ11cbiAqIFxuICogdGhpc0FyZyBmb3IgdGhlIGl0ZXJhdG9yIGZ1bmN0aW9uIGFuIGl0ZXJhdG9yIGlzXG4gKiB1c2VkLlxuICogXG4gKiBPcHRpb24gY29uZmlnIG9iamVjdCBmb3IgTHVjLmNvbXBhcmUgaWYgYW4gaXRlcmF0b3JcbiAqIGZ1bmN0aW9uIGlzIG5vdCBwYXNzZWQgaW4uICBJZiB5b3Ugd2FudCB0byBhY3R1YWxseVxuICogZG8gYSBkaXJlY3QgZXF1YWxpdHkgY29tcGFyaXNvbiBvbiBhIGZ1bmN0aW9uIGluc3RlYWQgb2ZcbiAqIHVzaW5nIGl0IGFzIGFuIGl0ZXJhdG9yIHBhc3MgaW4ge3R5cGU6ICdzdHJpY3QnfVxuICogXG4gKiBAcmV0dXJuIHtPYmplY3R9IHRoZSBvYmplY3QgdGhhdCB3YXMgZm91bmRcbiAqIGZhbHNlIGlmIG5vIG9iamVjdCB3YXMgcmVtb3ZlZDtcbiAqL1xuZnVuY3Rpb24gZmluZEZpcnN0KGFyciwgb2JqLCBjb25maWcpIHtcbiAgICB2YXIgZm4gPSBfY3JlYXRlSXRlcmF0b3JGbihvYmosIGNvbmZpZyk7XG4gICAgcmV0dXJuIF9maW5kRmlyc3QoYXJyLCBmbik7XG59XG5cbi8qKlxuICogRmluZCB0aGUgZmlyc3QgaXRlbSBmcm9tIHRoZSBwYXNzZWQgaW4gYXJyYXlcbiAqIHRoYXQgZG9lcyBub3QgbWF0Y2ggdGhlIHBhc3NlZCBpbiBvYmplY3QuICBJbnN0ZWFkIG9mIFxuICogY29tcGFyaW5nIGFuIG9iamVjdCBhbiBpdGVyYXRvciBmdW5jdGlvbiBjYW4gYmVcbiAqIHVzZWQuXG4gKiBcbiAqIEBwYXJhbSAge0FycmF5fSBhcnJcbiAqIEBwYXJhbSAge0FueS9GdW5jdGlvbn0gb2JqZWN0T3JJdGVyYXRvciBpZiB0aGUgdmFsdWVcbiAqIGlzIHtAbGluayBMdWMjY29tcGFyZSBlcXVhbH0gdG8gb3IgdGhlIGl0ZXJhdG9yIHJldHVybnMgdHJ1ZSByZW1vdmUgdGhlIFxuICogb2JqZWN0IGZyb20gdGhlIGFycmF5LlxuICogXG4gKiBJZiBhbiBpdGVyYXRvciBmdW5jdGlvbiBpcyBwYXNzZWQgaXQgd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGUgZm9sbG93aW5nIFxuICogcGFyYW1ldGVycy4gIFRoZSBzYW1lIHBhcmFtZXRlciB0byBBcnJheS5mb3JFYWNoXG4gKiBcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3RPckl0ZXJhdG9yLnZhbHVlIFxuICogQHBhcmFtIHtOdW1iZXJ9IG9iamVjdE9ySXRlcmF0b3IubnVtYmVyXG4gKiBAcGFyYW0ge0FycmF5fSBvYmplY3RPckl0ZXJhdG9yLmFycmF5XG4gKlxuICogXG4gKiBAcGFyYW0gIHtPYmplY3R9IFtjb25maWdPcnRoaXNBcmddXG4gKiBcbiAqIHRoaXNBcmcgZm9yIHRoZSBpdGVyYXRvciBmdW5jdGlvbiBhbiBpdGVyYXRvciBpc1xuICogdXNlZC5cbiAqIFxuICogT3B0aW9uIGNvbmZpZyBvYmplY3QgZm9yIEx1Yy5jb21wYXJlIGlmIGFuIGl0ZXJhdG9yXG4gKiBmdW5jdGlvbiBpcyBub3QgcGFzc2VkIGluLiAgSWYgeW91IHdhbnQgdG8gYWN0dWFsbHlcbiAqIGRvIGEgZGlyZWN0IGVxdWFsaXR5IGNvbXBhcmlzb24gb24gYSBmdW5jdGlvbiBpbnN0ZWFkIG9mXG4gKiB1c2luZyBpdCBhcyBhbiBpdGVyYXRvciBwYXNzIGluIHt0eXBlOiAnc3RyaWN0J31cbiAqIFxuICogQHJldHVybiB7T2JqZWN0fSB0aGUgb2JqZWN0IHRoYXQgd2FzIGZvdW5kXG4gKiBmYWxzZSBpZiBubyBvYmplY3Qgd2FzIHJlbW92ZWQ7XG4gKi9cbmZ1bmN0aW9uIGZpbmRGaXJzdE5vdChhcnIsIG9iaiwgY29uZmlnKSB7XG4gICAgdmFyIGZuID0gX2NyZWF0ZUl0ZXJhdG9yTm90Rm4ob2JqLCBjb25maWcpO1xuICAgIHJldHVybiBfZmluZEZpcnN0KGFyciwgZm4pO1xufVxuXG5mdW5jdGlvbiBfZmluZEFsbChhcnIsIGZuKSB7XG4gICAgdmFyIGZvdW5kID0gYXJyLmZpbHRlcihmbik7XG4gICAgcmV0dXJuIGZvdW5kO1xufVxuXG4vKipcbiAqIEZpbmQgdGhlIGFsbCB0aGUgaXRlbXMgZnJvbSB0aGUgcGFzc2VkIGluIGFycmF5XG4gKiB0aGF0IG1hdGNoZXMgdGhlIHBhc3NlZCBpbiBvYmplY3QuICBJbnN0ZWFkIG9mIFxuICogY29tcGFyaW5nIGFuIG9iamVjdCBhbiBpdGVyYXRvciBmdW5jdGlvbiBjYW4gYmVcbiAqIHVzZWQuXG4gKiBcbiAqIEBwYXJhbSAge0FycmF5fSBhcnJcbiAqIEBwYXJhbSAge0FueS9GdW5jdGlvbn0gb2JqZWN0T3JJdGVyYXRvciBpZiB0aGUgdmFsdWVcbiAqIGlzIHtAbGluayBMdWMjY29tcGFyZSBlcXVhbH0gdG8gb3IgdGhlIGl0ZXJhdG9yIHJldHVybnMgdHJ1ZSByZW1vdmUgdGhlIFxuICogb2JqZWN0IGZyb20gdGhlIGFycmF5LlxuICogXG4gKiBJZiBhbiBpdGVyYXRvciBmdW5jdGlvbiBpcyBwYXNzZWQgaXQgd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGUgZm9sbG93aW5nIFxuICogcGFyYW1ldGVycy4gIFRoZSBzYW1lIHBhcmFtZXRlciB0byBBcnJheS5mb3JFYWNoXG4gKiBcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3RPckl0ZXJhdG9yLnZhbHVlIFxuICogQHBhcmFtIHtOdW1iZXJ9IG9iamVjdE9ySXRlcmF0b3IubnVtYmVyXG4gKiBAcGFyYW0ge0FycmF5fSBvYmplY3RPckl0ZXJhdG9yLmFycmF5XG4gKlxuICogXG4gKiBAcGFyYW0gIHtPYmplY3R9IFtjb25maWdPcnRoaXNBcmddXG4gKiBcbiAqIHRoaXNBcmcgZm9yIHRoZSBpdGVyYXRvciBmdW5jdGlvbiBhbiBpdGVyYXRvciBpc1xuICogdXNlZC5cbiAqIFxuICogT3B0aW9uIGNvbmZpZyBvYmplY3QgZm9yIEx1Yy5jb21wYXJlIGlmIGFuIGl0ZXJhdG9yXG4gKiBmdW5jdGlvbiBpcyBub3QgcGFzc2VkIGluLiAgSWYgeW91IHdhbnQgdG8gYWN0dWFsbHlcbiAqIGRvIGEgZGlyZWN0IGVxdWFsaXR5IGNvbXBhcmlzb24gb24gYSBmdW5jdGlvbiBpbnN0ZWFkIG9mXG4gKiB1c2luZyBpdCBhcyBhbiBpdGVyYXRvciBwYXNzIGluIHt0eXBlOiAnc3RyaWN0J31cbiAqIFxuICogQHJldHVybiB7QXJyYXl9IGFuIGFycmF5IG9mIGl0ZW1zIGZvdW5kXG4gKi9cbmZ1bmN0aW9uIGZpbmRBbGwoYXJyLCBvYmosIGNvbmZpZykge1xuICAgIHZhciBmbiA9IF9jcmVhdGVJdGVyYXRvckZuKG9iaiwgY29uZmlnKTtcbiAgICByZXR1cm4gX2ZpbmRBbGwoYXJyLCBmbik7XG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBhbGwgdGhlIGl0ZW1zIGZyb20gdGhlIHBhc3NlZCBpbiBhcnJheVxuICogdGhhdCBkbyBub3QgbWF0Y2ggdGhlIHBhc3NlZCBpbiBvYmplY3QuICBJbnN0ZWFkIG9mIFxuICogY29tcGFyaW5nIGFuIG9iamVjdCBhbiBpdGVyYXRvciBmdW5jdGlvbiBjYW4gYmVcbiAqIHVzZWQuXG4gKiBcbiAqIEBwYXJhbSAge0FycmF5fSBhcnJcbiAqIEBwYXJhbSAge0FueS9GdW5jdGlvbn0gb2JqZWN0T3JJdGVyYXRvciBpZiB0aGUgdmFsdWVcbiAqIGlzIHtAbGluayBMdWMjY29tcGFyZSBlcXVhbH0gdG8gb3IgdGhlIGl0ZXJhdG9yIHJldHVybnMgdHJ1ZSByZW1vdmUgdGhlIFxuICogb2JqZWN0IGZyb20gdGhlIGFycmF5LlxuICogXG4gKiBJZiBhbiBpdGVyYXRvciBmdW5jdGlvbiBpcyBwYXNzZWQgaXQgd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGUgZm9sbG93aW5nIFxuICogcGFyYW1ldGVycy4gIFRoZSBzYW1lIHBhcmFtZXRlciB0byBBcnJheS5mb3JFYWNoXG4gKiBcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3RPckl0ZXJhdG9yLnZhbHVlIFxuICogQHBhcmFtIHtOdW1iZXJ9IG9iamVjdE9ySXRlcmF0b3IubnVtYmVyXG4gKiBAcGFyYW0ge0FycmF5fSBvYmplY3RPckl0ZXJhdG9yLmFycmF5XG4gKlxuICogXG4gKiBAcGFyYW0gIHtPYmplY3R9IFtjb25maWdPcnRoaXNBcmddXG4gKiBcbiAqIHRoaXNBcmcgZm9yIHRoZSBpdGVyYXRvciBmdW5jdGlvbiBhbiBpdGVyYXRvciBpc1xuICogdXNlZC5cbiAqIFxuICogT3B0aW9uIGNvbmZpZyBvYmplY3QgZm9yIEx1Yy5jb21wYXJlIGlmIGFuIGl0ZXJhdG9yXG4gKiBmdW5jdGlvbiBpcyBub3QgcGFzc2VkIGluLiAgSWYgeW91IHdhbnQgdG8gYWN0dWFsbHlcbiAqIGRvIGEgZGlyZWN0IGVxdWFsaXR5IGNvbXBhcmlzb24gb24gYSBmdW5jdGlvbiBpbnN0ZWFkIG9mXG4gKiB1c2luZyBpdCBhcyBhbiBpdGVyYXRvciBwYXNzIGluIHt0eXBlOiAnc3RyaWN0J31cbiAqIFxuICogQHJldHVybiB7QXJyYXl9IGFuIGFycmF5IG9mIGl0ZW1zIHJlbW92ZWRcbiAqL1xuZnVuY3Rpb24gZmluZEFsbE5vdChhcnIsIG9iaiwgY29uZmlnKSB7XG4gICAgdmFyIGZuID0gX2NyZWF0ZUl0ZXJhdG9yTm90Rm4ob2JqLCBjb25maWcpO1xuICAgIHJldHVybiBfZmluZEFsbChhcnIsIGZuKTtcbn1cblxuXG5leHBvcnRzLnRvQXJyYXkgPSB0b0FycmF5O1xuZXhwb3J0cy5lYWNoID0gZWFjaDtcbmV4cG9ydHMuaW5zZXJ0ID0gaW5zZXJ0O1xuZXhwb3J0cy5yZW1vdmVBdEluZGV4ID0gcmVtb3ZlQXRJbmRleDtcbmV4cG9ydHMuZmluZEZpcnN0Tm90ID0gZmluZEZpcnN0Tm90O1xuZXhwb3J0cy5maW5kQWxsTm90ID0gZmluZEFsbE5vdDtcbmV4cG9ydHMuZmluZEZpcnN0ID0gZmluZEZpcnN0O1xuZXhwb3J0cy5maW5kQWxsID0gZmluZEFsbDtcblxuZXhwb3J0cy5yZW1vdmVGaXJzdE5vdCA9IHJlbW92ZUZpcnN0Tm90O1xuZXhwb3J0cy5yZW1vdmVBbGxOb3QgPSByZW1vdmVBbGxOb3Q7XG5leHBvcnRzLnJlbW92ZUZpcnN0ID0gcmVtb3ZlRmlyc3Q7XG5leHBvcnRzLnJlbW92ZUFsbCA9IHJlbW92ZUFsbDtcblxuKGZ1bmN0aW9uKCl7XG4gICAgdmFyIF9jcmVhdGVMYXN0Rm4gPSBmdW5jdGlvbihmbk5hbWUpIHtcbiAgICAgICAgdmFyIGxhc3ROYW1lID0gZm5OYW1lLnJlcGxhY2UoJ0ZpcnN0JywgJ0xhc3QnKTtcblxuICAgICAgICBleHBvcnRzW2xhc3ROYW1lXSA9IGZ1bmN0aW9uKGFyciwgb2JqLCBjb25maWcpIHtcbiAgICAgICAgICAgIHZhciByZXQ7XG5cbiAgICAgICAgICAgIGFyci5yZXZlcnNlKCk7XG4gICAgICAgICAgICByZXQgPSBleHBvcnRzW2ZuTmFtZV0oYXJyLCBvYmosIGNvbmZpZyk7XG4gICAgICAgICAgICBhcnIucmV2ZXJzZSgpO1xuXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9O1xuXG4gICAgfSwgbmFtZXNUb0FkZExhc3QgPSBbJ2ZpbmRGaXJzdE5vdCcsICdmaW5kRmlyc3QnLCAncmVtb3ZlRmlyc3ROb3QnLCAncmVtb3ZlRmlyc3QnXTtcblxuICAgIG5hbWVzVG9BZGRMYXN0LmZvckVhY2goZnVuY3Rpb24oZm5OYW1lKSB7XG4gICAgICAgIF9jcmVhdGVMYXN0Rm4oZm5OYW1lKTtcbiAgICB9KTtcblxufSgpKTtcblxuLyoqXG4gKiBAbWVtYmVyIEx1Yy5BcnJheSBcbiAqIEBtZXRob2QgZmluZExhc3ROb3QgXG4gKiBTYW1lIGFzIEx1Yy5BcnJheS5maW5kRmlyc3ROb3QgZXhlcHQgc3RhcnQgYXQgdGhlIGVuZC5cbiAqL1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjLkFycmF5IFxuICogQG1ldGhvZCBmaW5kTGFzdFxuICogU2FtZSBhcyBMdWMuQXJyYXkuZmluZEZpcnN0IGV4ZXB0IHN0YXJ0IGF0IHRoZSBlbmQuXG4gKi9cblxuLyoqXG4gKiBAbWVtYmVyIEx1Yy5BcnJheSBcbiAqIEBtZXRob2QgcmVtb3ZlTGFzdE5vdCBcbiAqIFNhbWUgYXMgTHVjLkFycmF5LnJlbW92ZUZpcnN0Tm90IGV4ZXB0IHN0YXJ0IGF0IHRoZSBlbmQuXG4gKi9cblxuLyoqXG4gKiBAbWVtYmVyIEx1Yy5BcnJheSBcbiAqIEBtZXRob2QgcmVtb3ZlTGFzdCBcbiAqIFNhbWUgYXMgTHVjLkFycmF5LnJlbW92ZUZpcnN0IGV4ZXB0IHN0YXJ0IGF0IHRoZSBlbmQuXG4gKi9cbiIsInZhciBhcnJheSA9IHJlcXVpcmUoJy4vYXJyYXknKSxcbiAgICBpcyA9IHJlcXVpcmUoJy4vaXMnKSxcbiAgICBHZW5lcmF0b3I7XG5cbkdlbmVyYXRvciA9IHtcbiAgICBhcnJheUZuTmFtZXM6IFsnZmluZEZpcnN0Tm90JywgJ2ZpbmRBbGxOb3QnLCAnZmluZEZpcnN0JywgJ2ZpbmRBbGwnLFxuICAgICAgICAgICAgJ3JlbW92ZUZpcnN0Tm90JywgJ3JlbW92ZUFsbE5vdCcsICdyZW1vdmVGaXJzdCcsICdyZW1vdmVBbGwnLFxuICAgICAgICAgICAgJ3JlbW92ZUxhc3ROb3QnLCAncmVtb3ZlTGFzdCcsICdmaW5kTGFzdCcsICdmaW5kTGFzdE5vdCdcbiAgICBdLFxuXG4gICAgY3JlYXRlRm46IGZ1bmN0aW9uKGFycmF5Rm5OYW1lLCBmbikge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oYXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gYXJyYXlbYXJyYXlGbk5hbWVdKGFyciwgZm4pO1xuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBjcmVhdGVCb3VuZEZuOiBmdW5jdGlvbihhcnJheUZuTmFtZSwgZm5Ub0JpbmQpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGFyciwgdmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBmbiA9IGZuVG9CaW5kKHZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybiBhcnJheVthcnJheUZuTmFtZV0oYXJyLCBmbik7XG4gICAgICAgIH07XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMuR2VuZXJhdG9yID0gR2VuZXJhdG9yO1xuXG4vKipcbiAqIEBjbGFzcyBMdWMuQXJyYXlGbnNcbiAqIFRoaXMgaXMgZG9jdW1lbnRlZCBhcyBhIHNlcGVyYXRlIHBhY2thZ2UgYnV0IGl0IGFjdHVhbGwgZXhpc3RzIHVuZGVyIHRoZSBcbiAqIEx1Yy5BcnJheSBuYW1lc3BhY2UuICBDaGVjayBvdXQgdGhlIFwiRmlsdGVyIGNsYXNzIG1lbWJlcnNcIiBpbnB1dCBib3hcbiAqIGp1c3QgdG8gdGhlIHJpZ2h0IHdoZW4gc2VhcmNoaW5nIGZvciBmdW5jdGlvbnMuXG4gKjxicj5cbiAqIFxuICogVGhlcmUgYSBsb3Qgb2YgZnVuY3Rpb25zIGluIHRoaXMgcGFja2FnZSBidXQgYWxsIG9mIHRoZVxuICogIG1ldGhvZHMgZm9sbG93IHRoZSBzYW1lIGFwaS4gIFxcKkFsbCBmdW5jdGlvbnMgd2lsbCByZXR1cm4gYW4gYXJyYXkgb2YgcmVtb3ZlZCBvciBmb3VuZFxuICogaXRlbXMuICBUaGUgaXRlbXMgd2lsbCBiZSBhZGRlZCB0byB0aGUgYXJyYXkgaW4gdGhlIG9yZGVyIHRoZXkgYXJlXG4gKiBmb3VuZC4gIFxcKkZpcnN0IGZ1bmN0aW9ucyB3aWxsIHJldHVybiB0aGUgZmlyc3QgaXRlbSBhbmQgc3RvcCBpdGVyYXRpbmcgYWZ0ZXIgdGhhdCwgaWYgbm9uZVxuICogIGlzIGZvdW5kIGZhbHNlIGlzIHJldHVybmVkLiAgcmVtb3ZlXFwqIGZ1bmN0aW9ucyB3aWxsIGRpcmVjdGx5IGNoYW5nZSB0aGUgcGFzc2VkIGluIGFycmF5LlxuICogIFxcKk5vdCBmdW5jdGlvbnMgb25seSBkbyB0aGUgZm9sbG93aW5nIGFjdGlvbnMgaWYgdGhlIGNvbXBhcmlzb24gaXMgbm90IHRydWUuXG4gKiAgXFwqTGFzdCBmdW5jdGlvbnMgZG8gdGhlIHNhbWUgYXMgdGhlaXIgXFwqRmlyc3QgY291bnRlcnBhcnRzIGV4ZWNwdCB0aGF0IHRoZSBpdGVyYXRpbmdcbiAqICBzdGFydHMgYXQgdGhlIGVuZCBvZiB0aGUgYXJyYXkuIEFtb3N0IGV2ZXJ5IHB1YmxpYyBtZXRob2Qgb2YgTHVjLmlzIGF2YWlsYWJsZSBpdFxuICogIHVzZXMgdGhlIGZvbGxvd2luZyBncmFtbWVyIEx1Yy5BcnJheVtcIm1ldGhvZE5hbWVcIlwiaXNNZXRob2ROYW1lXCJdXG4gKlxuICAgICAgTHVjLkFycmF5LmZpbmRBbGxOb3RFbXB0eShbZmFsc2UsIHRydWUsIG51bGwsIHVuZGVmaW5lZCwgMCwgJycsIFtdLCBbMV1dKVxuICAgICAgPiBbdHJ1ZSwgMCwgWzFdXVxuXG4gICAgICBMdWMuQXJyYXkuZmluZEFsbE5vdEZhbHN5KFtmYWxzZSwgdHJ1ZSwgbnVsbCwgdW5kZWZpbmVkLCAwLCAnJywgW10sIFsxXV0pXG4gICAgICA+IFt0cnVlLCAwLCBbXSwgWzFdXVxuXG4gICAgICBMdWMuQXJyYXkuZmluZEZpcnN0U3RyaW5nKFsxLDIsMywnNSddKVxuICAgICAgPlwiNVwiXG4gICAgICBMdWMuQXJyYXkuZmluZEZpcnN0Tm90U3RyaW5nKFsxLDIsMywnNSddKVxuICAgICAgPjFcbiAgICAgIHZhciBhcnIgPSBbMSwyLDMsJzUnXTtcbiAgICAgIEx1Yy5BcnJheS5yZW1vdmVBbGxOb3RTdHJpbmcoYXJyKTtcbiAgICAgID5bMSwyLDNdXG4gICAgICBhcnJcbiAgICAgID5bXCI1XCJdXG4gKlxuICogVGhlIG9ubHkgZnVuY3Rpb24gdGhhdCBkb2Vzbid0IGZvbGxvdyB0aGUgZXhhY3QgYXBpIGlzIFxcKkluc3RhbmNlT2ZcbiAqIHRoYXQgb25lIHJlcXVpcmVzIGFuIGV4dHJhIGFyZ3VtZW50LFxuICBcbiAgICBMdWMuQXJyYXkuZmluZEFsbEluc3RhbmNlT2YoWzEsMiwgbmV3IERhdGUoKSwge30sIFtdXSwgT2JqZWN0KVxuICAgID5bZGF0ZSwge30sIFtdXVxuICAgID5MdWMuQXJyYXkuZmluZEFsbE5vdEluc3RhbmNlT2YoWzEsMiwgbmV3IERhdGUoKSwge30sIFtdXSwgT2JqZWN0KVxuICAgIFsxLCAyXVxuICovXG5cbihmdW5jdGlvbiBfY3JlYXRlSXNGbnMoKSB7XG4gICAgdmFyIGlzVG9JZ25vcmUgPSBbJ2lzUmVnRXhwJywgJ2lzQXJndW1lbnRzJ107XG5cbiAgICBPYmplY3Qua2V5cyhpcykuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgdmFyIG5hbWUgPSBrZXkuc3BsaXQoJ2lzJylbMV07XG4gICAgICAgIEdlbmVyYXRvci5hcnJheUZuTmFtZXMuZm9yRWFjaChmdW5jdGlvbihmbk5hbWUpIHtcbiAgICAgICAgICAgIGlmKGlzVG9JZ25vcmUuaW5kZXhPZihrZXkpID09PSAtMSkge1xuICAgICAgICAgICAgICAgIGFycmF5W2ZuTmFtZSArIG5hbWVdID0gR2VuZXJhdG9yLmNyZWF0ZUZuKGZuTmFtZSwgaXNba2V5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSgpKTtcblxuKGZ1bmN0aW9uIF9jcmVhdGVGYWxzeUZucygpIHtcbiAgICB2YXIgdXNlZnVsbEZhbHN5Rm5zID0gWydmaW5kRmlyc3ROb3QnLCAnZmluZEFsbE5vdCcsICdyZW1vdmVGaXJzdE5vdCcsICdyZW1vdmVBbGxOb3QnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdyZW1vdmVGaXJzdCcsICdyZW1vdmVBbGwnLCAncmVtb3ZlTGFzdE5vdCcsICdyZW1vdmVMYXN0JywgICdmaW5kTGFzdE5vdCddO1xuXG4gICAgdmFyIGZucyA9IHtcbiAgICAgICAgJ0ZhbHNlJzogZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsID09PSBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgJ1RydWUnOiBmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWwgPT09IHRydWU7XG4gICAgICAgIH0sXG4gICAgICAgICdOdWxsJzogZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsID09PSBudWxsO1xuICAgICAgICB9LFxuICAgICAgICAnVW5kZWZpbmVkJzogZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsID09PSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgT2JqZWN0LmtleXMoZm5zKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICB1c2VmdWxsRmFsc3lGbnMuZm9yRWFjaChmdW5jdGlvbihmbk5hbWUpIHtcbiAgICAgICAgICAgIGFycmF5W2ZuTmFtZSArIGtleV0gPSBHZW5lcmF0b3IuY3JlYXRlRm4oZm5OYW1lLCBmbnNba2V5XSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSgpKTtcblxuKGZ1bmN0aW9uIF9jcmVhdGVCb3VuZEZucygpIHtcbiAgICB2YXIgZm5zID0ge1xuICAgICAgICAnSW5zdGFuY2VPZic6IGZ1bmN0aW9uKENvbnN0cnVjdG9yKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKHZhbHVlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBPYmplY3Qua2V5cyhmbnMpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIEdlbmVyYXRvci5hcnJheUZuTmFtZXMuZm9yRWFjaChmdW5jdGlvbihmbk5hbWUpIHtcbiAgICAgICAgICAgIGFycmF5W2ZuTmFtZSArIGtleV0gPSBHZW5lcmF0b3IuY3JlYXRlQm91bmRGbihmbk5hbWUsIGZuc1trZXldKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KCkpOyIsInZhciBpcyA9IHJlcXVpcmUoJy4vaXMnKTtcblxuZnVuY3Rpb24gX3N0cmljdCh2YWwxLCB2YWwyKXtcbiAgICByZXR1cm4gdmFsMSA9PT0gdmFsMjtcbn1cblxuZnVuY3Rpb24gX2NvbXBhcmVBcnJheUxlbmd0aCh2YWwxLCB2YWwyKSB7XG4gICAgcmV0dXJuKGlzLmlzQXJyYXkodmFsMSkgJiYgaXMuaXNBcnJheSh2YWwyKSAgJiYgdmFsMS5sZW5ndGggPT09IHZhbDIubGVuZ3RoKTtcbn1cblxuZnVuY3Rpb24gX3NoYWxsb3dBcnJheSh2YWwxLCB2YWwyKSB7XG4gICAgdmFyIGkgPSAwLFxuICAgICAgICBsZW47XG4gICAgXG4gICAgaWYoIV9jb21wYXJlQXJyYXlMZW5ndGgodmFsMSwgdmFsMikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGZvcihsZW4gPSB2YWwxLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgIGlmKHZhbDFbaV0gIT09IHZhbDJbaV0pIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBfZGVlcEFycmF5KHZhbDEsIHZhbDIsIGNvbmZpZykge1xuICAgIHZhciBpID0gMCxcbiAgICAgICAgbGVuO1xuICAgIFxuICAgIGlmKCFfY29tcGFyZUFycmF5TGVuZ3RoKHZhbDEsIHZhbDIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IobGVuID0gdmFsMS5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgICBpZighY29tcGFyZSh2YWwxW2ldLHZhbDJbaV0sIGNvbmZpZykpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBfY29tcGFyZU9iamVjdEtleXNMZW5ndGgodmFsMSwgdmFsMikge1xuICAgIHJldHVybiAoaXMuaXNPYmplY3QodmFsMSkgJiYgaXMuaXNPYmplY3QodmFsMikgJiYgT2JqZWN0LmtleXModmFsMSkubGVuZ3RoID09PSBPYmplY3Qua2V5cyh2YWwyKS5sZW5ndGgpO1xufVxuXG5mdW5jdGlvbiBfc2hhbGxvd09iamVjdCh2YWwxLCB2YWwyKSB7XG4gICAgdmFyIGtleSwgdmFsO1xuXG4gICAgaWYgKCFfY29tcGFyZU9iamVjdEtleXNMZW5ndGgodmFsMSwgdmFsMikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGZvciAoa2V5IGluIHZhbDEpIHtcbiAgICAgICAgaWYgKHZhbDEuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgdmFsdWUgPSB2YWwxW2tleV07XG4gICAgICAgICAgICBpZiAoIXZhbDIuaGFzT3duUHJvcGVydHkoa2V5KSB8fCB2YWwyW2tleV0gIT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIF9kZWVwT2JqZWN0KHZhbDEsIHZhbDIsIGNvbmZpZykge1xuICAgIHZhciBrZXksIHZhbDtcblxuICAgIGlmICghX2NvbXBhcmVPYmplY3RLZXlzTGVuZ3RoKHZhbDEsIHZhbDIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IgKGtleSBpbiB2YWwxKSB7XG4gICAgICAgIGlmICh2YWwxLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsMVtrZXldO1xuICAgICAgICAgICAgaWYgKCF2YWwyLmhhc093blByb3BlcnR5KGtleSkgfHwgY29tcGFyZSh2YWx1ZSwgdmFsMltrZXldLCBjb25maWcpICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG5cbn1cblxuZnVuY3Rpb24gX2xvb3NlT2JqZWN0KHZhbDEsIHZhbDIsIGNvbmZpZykge1xuICAgIHZhciBrZXksIHZhbDtcblxuICAgIGZvciAoa2V5IGluIHZhbDEpIHtcbiAgICAgICAgaWYgKHZhbDEuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgdmFsdWUgPSB2YWwxW2tleV07XG4gICAgICAgICAgICBpZiAoY29tcGFyZSh2YWx1ZSwgdmFsMltrZXldLCBjb25maWcpICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG5cbn1cblxuZnVuY3Rpb24gX2RhdGUodmFsMSwgdmFsMikge1xuICAgIGlmKGlzLmlzRGF0ZSh2YWwxKSAmJiBpcy5pc0RhdGUodmFsMikpIHtcbiAgICAgICAgcmV0dXJuIHZhbDEuZ2V0VGltZSgpID09PSB2YWwyLmdldFRpbWUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIF9jcmVhdGVCb3VuZENvbXBhcmUob2JqZWN0LCBmbikge1xuICAgIHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gZm4ob2JqZWN0LCB2YWx1ZSk7XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0Q29tcGFyZUZuKG9iamVjdCwgYykge1xuICAgIHZhciBjb21wYXJlRm4gPSBfc3RyaWN0LFxuICAgICAgICBjb25maWcgPSBjIHx8IHt9LFxuICAgICAgICB0eXBlID0gY29uZmlnLnR5cGU7XG5cbiAgICBpZiAodHlwZSA9PT0gJ2RlZXAnIHx8IHR5cGUgPT09ICdsb29zZScgfHwgdHlwZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChpcy5pc09iamVjdChvYmplY3QpKSB7XG4gICAgICAgICAgICBjb21wYXJlRm4gPSB0eXBlID09PSAnbG9vc2UnID8gX2xvb3NlT2JqZWN0IDogX2RlZXBPYmplY3Q7XG4gICAgICAgIH0gZWxzZSBpZiAoaXMuaXNBcnJheShvYmplY3QpKSB7XG4gICAgICAgICAgICBjb21wYXJlRm4gPSBfZGVlcEFycmF5O1xuICAgICAgICB9IGVsc2UgaWYgKGlzLmlzRGF0ZShvYmplY3QpKSB7XG4gICAgICAgICAgICBjb21wYXJlRm4gPSBfZGF0ZTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3NoYWxsb3cnKSB7XG4gICAgICAgIGlmIChpcy5pc09iamVjdChvYmplY3QpKSB7XG4gICAgICAgICAgICBjb21wYXJlRm4gPSBfc2hhbGxvd09iamVjdDtcbiAgICAgICAgfSBlbHNlIGlmIChpcy5pc0FycmF5KG9iamVjdCkpIHtcbiAgICAgICAgICAgIGNvbXBhcmVGbiA9IF9zaGFsbG93QXJyYXk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXMuaXNEYXRlKG9iamVjdCkpIHtcbiAgICAgICAgICAgIGNvbXBhcmVGbiA9IF9kYXRlO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlICE9PSAnc3RyaWN0Jykge1xuICAgICAgICAvL3dlIHdvdWxkIGJlIGRvaW5nIGEgc3RyaWN0IGNvbXBhcmlzb24gb24gYSB0eXBlLW9cbiAgICAgICAgLy9JIHRoaW5rIGFuIGVycm9yIGlzIGdvb2QgaGVyZS5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgcGFzc2VkIGluIGFuIGludmFsaWQgY29tcGFyaXNvbiB0eXBlJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbXBhcmVGbjtcbn1cblxuLyoqXG4gKiBAbWVtYmVyIEx1Y1xuICogQG1ldGhvZCBjb21wYXJlXG4gKiBcbiAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZXMgYXJlIGVxdWFsIHRvIGVhY2hcbiAqIG90aGVyLiAgQnkgZGVmYXVsdCBhIGRlZXAgY29tcGFyaXNvbiBpcyBcbiAqIGRvbmUgb24gYXJyYXlzLCBkYXRlcyBhbmQgb2JqZWN0cyBhbmQgYSBzdHJpY3QgY29tcGFyaXNvblxuICogaXMgZG9uZSBvbiBvdGhlciB0eXBlcy5cbiAqIFxuICogQHBhcmFtICB7QW55fSB2YWwxICBcbiAqIEBwYXJhbSAge0FueX0gdmFsMiAgIFxuICogQHBhcmFtICB7T2JqZWN0fSBbY29uZmlnXVxuICogQHBhcmFtIHtTdHJpbmd9IGNvbmZpZy50eXBlIHBhc3MgaW4gJ3NoYWxsb3cnIGZvciBhIHNoYWxsb3dcbiAqIGNvbXBhcmlzb24sICdkZWVwJyAoZGVmYXVsdCkgZm9yIGEgZGVlcCBjb21wYXJpc29uXG4gKiAnc3RyaWN0JyBmb3IgYSBzdHJpY3QgPT09IGNvbXBhcmlzb24gZm9yIGFsbCBvYmplY3RzIG9yIFxuICogJ2xvb3NlJyBmb3IgYSBsb29zZSBjb21wYXJpc29uIG9uIG9iamVjdHMuICBBIGxvb3NlIGNvbXBhcmlzb25cbiAqICB3aWxsIGNvbXBhcmUgdGhlIGtleXMgYW5kIHZhbHVlcyBvZiB2YWwxIHRvIHZhbDIgYW5kIGRvZXMgbm90XG4gKiAgY2hlY2sgaWYga2V5cyBmcm9tIHZhbDIgZG8gbm90IGV4aXN0IGluIHZhbDEuXG4gKlxuICpcbiAgICBMdWMuY29tcGFyZSgnMScsIDEpXG4gICAgPmZhbHNlXG4gICAgTHVjLmNvbXBhcmUoe2E6IDF9LCB7YTogMX0pXG4gICAgPnRydWVcbiAgICBMdWMuY29tcGFyZSh7YTogMSwgYjoge319LCB7YTogMSwgYjoge30gfSwge3R5cGU6J3NoYWxsb3cnfSlcbiAgICA+ZmFsc2VcbiAgICBMdWMuY29tcGFyZSh7YTogMSwgYjoge319LCB7YTogMSwgYjoge30gfSwge3R5cGU6ICdkZWVwJ30pXG4gICAgPnRydWVcbiAgICBMdWMuY29tcGFyZSh7YTogMSwgYjoge319LCB7YTogMSwgYjoge30gfSwge3R5cGU6ICdzdHJpY3QnfSlcbiAgICA+ZmFsc2VcbiAgICBMdWMuY29tcGFyZSh7YTogMX0sIHthOjEsYjoxfSlcbiAgICA+ZmFsc2VcbiAgICBMdWMuY29tcGFyZSh7YTogMX0sIHthOjEsYjoxfSwge3R5cGU6ICdsb29zZSd9KVxuICAgID50cnVlXG4gICAgTHVjLmNvbXBhcmUoe2E6IDF9LCB7YToxLGI6MX0sIHt0eXBlOiAnbG9vc2UnfSlcbiAgICA+dHJ1ZVxuICAgIEx1Yy5jb21wYXJlKFt7YTogMX1dLCBbe2E6MSxiOjF9XSwge3R5cGU6ICdsb29zZSd9KVxuICAgID50cnVlXG4gICAgTHVjLmNvbXBhcmUoW3thOiAxfSwge31dLCBbe2E6MSxiOjF9XSwge3R5cGU6ICdsb29zZSd9KVxuICAgID5mYWxzZVxuICAgIEx1Yy5jb21wYXJlKFt7YTogMX0sIHt9XSwgW3thOjEsYjoxfSwge31dLCB7dHlwZTogJ2xvb3NlJ30pXG4gICAgPnRydWVcbiAgICBMdWMuY29tcGFyZShbe2E6MSxiOjF9XSwgW3thOiAxfV0sIHt0eXBlOiAnbG9vc2UnfSlcbiAgICA+ZmFsc2VcblxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gY29tcGFyZSh2YWwxLCB2YWwyLCBjb25maWcpIHtcbiAgICByZXR1cm4gZ2V0Q29tcGFyZUZuKHZhbDEsIGNvbmZpZykodmFsMSwgdmFsMiwgY29uZmlnKTtcbn1cblxuXG5mdW5jdGlvbiBjcmVhdGVCb3VuZENvbXBhcmVGbihvYmplY3QsIGMpIHtcbiAgICB2YXIgY29tcGFyZUZuID0gZ2V0Q29tcGFyZUZuKG9iamVjdCwgYyk7XG5cbiAgICByZXR1cm4gX2NyZWF0ZUJvdW5kQ29tcGFyZShvYmplY3QsIGNvbXBhcmVGbik7XG59XG5cbmV4cG9ydHMuY29tcGFyZSA9IGNvbXBhcmU7XG5leHBvcnRzLmNyZWF0ZUJvdW5kQ29tcGFyZUZuID0gY3JlYXRlQm91bmRDb21wYXJlRm47IiwidmFyIGVtcHR5Rm4gPSByZXF1aXJlKCcuLi9mdW5jdGlvbicpLmVtcHR5Rm4sXG4gICAgYXBwbHkgPSByZXF1aXJlKCcuLi9vYmplY3QnKS5hcHBseTtcblxuLyoqXG4gKiBAY2xhc3MgTHVjLkJhc2VcbiAqIFNpbXBsZSBjbGFzcyB0aGF0IGJ5IGRlZmF1bHQgYXBwbGllcyB0aGUgXG4gKiBmaXJzdCBhcmd1bWVudCB0byB0aGUgaW5zdGFuY2UgYW5kIHRoZW4gY2FsbHNcbiAqIEx1Yy5CYXNlLmluaXQuXG4gKlxuICAgIHZhciBiID0gbmV3IEx1Yy5CYXNlKHtcbiAgICAgICAgYTogMSxcbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnaGV5JylcbiAgICAgICAgfVxuICAgIH0pXG4gICAgYi5hXG4gICAgPmhleVxuICAgID4xXG4gKi9cbmZ1bmN0aW9uIEJhc2UoKSB7XG4gICAgdGhpcy5iZWZvcmVJbml0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5pbml0KCk7XG59XG5cbkJhc2UucHJvdG90eXBlID0ge1xuICAgIC8qKlxuICAgICAqIEJ5IGRlZmF1bHQgYXBwbHkgdGhlIGNvbmZpZyB0byB0aGUgXG4gICAgICogaW5zdGFuY2UuXG4gICAgICovXG4gICAgYmVmb3JlSW5pdDogZnVuY3Rpb24oY29uZmlnKSB7XG4gICAgICAgIGFwcGx5KHRoaXMsIGNvbmZpZyk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBAbWV0aG9kXG4gICAgICogU2ltcGxlIGhvb2sgdG8gaW5pdGlhbGl6ZVxuICAgICAqIHRoZSBjbGFzcy5cbiAgICAgKi9cbiAgICBpbml0OiBlbXB0eUZuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhc2U7IiwidmFyIEJhc2UgPSByZXF1aXJlKCcuL2Jhc2UnKSxcbiAgICBDb21wb3NpdGlvbiA9IHJlcXVpcmUoJy4vY29tcG9zaXRpb24nKSxcbiAgICBvYmogPSByZXF1aXJlKCcuLi9vYmplY3QnKSxcbiAgICBhcnJheUZucyA9IHJlcXVpcmUoJy4uL2FycmF5JyksXG4gICAgZW1wdHlGbiA9IHJlcXVpcmUoJy4uL2Z1bmN0aW9uJykuZW1wdHlGbixcbiAgICBpcyA9IHJlcXVpcmUoJy4uL2lzJyksXG4gICAgYUVhY2ggPSBhcnJheUZucy5lYWNoLFxuICAgIGFwcGx5ID0gb2JqLmFwcGx5LFxuICAgIG9FYWNoID0gb2JqLmVhY2gsXG4gICAgb0ZpbHRlciA9IG9iai5maWx0ZXIsXG4gICAgbWl4ID0gb2JqLm1peCxcbiAgICBhcnJheVNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG5mdW5jdGlvbiBDbGFzc0RlZmluZXIoKSB7fVxuXG5DbGFzc0RlZmluZXIuQ09NUE9TSVRJT05TX05BTUUgPSAnJGNvbXBvc2l0aW9ucyc7XG5cbkNsYXNzRGVmaW5lci5wcm90b3R5cGUgPSB7XG4gICAgZGVmYXVsdFR5cGU6IEJhc2UsXG5cbiAgICBwcm9jZXNzb3JLZXlzOiB7XG4gICAgICAgICRtaXhpbnM6ICdfYXBwbHlNaXhpbnMnLFxuICAgICAgICAkc3RhdGljczogJ19hcHBseVN0YXRpY3MnLFxuICAgICAgICAkY29tcG9zaXRpb25zOiAnX2NvbXBvc2UnLFxuICAgICAgICAkc3VwZXI6ICdfc3VwZXInXG4gICAgfSxcblxuICAgIGRlZmluZTogZnVuY3Rpb24ob3B0cykge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IG9wdHMgfHwge30sXG4gICAgICAgICAgICAvL2lmIHN1cGVyIGlzIGEgZmFsc3kgdmFsdWUgYmVzaWRlcyB1bmRlZmluZWQgdGhhdCBtZWFucyBubyBzdXBlcmNsYXNzXG4gICAgICAgICAgICBTdXBlciA9IG9wdGlvbnMuJHN1cGVyIHx8IChvcHRpb25zLiRzdXBlciA9PT0gdW5kZWZpbmVkID8gdGhpcy5kZWZhdWx0VHlwZSA6IGZhbHNlKSxcbiAgICAgICAgICAgIENvbnN0cnVjdG9yO1xuXG4gICAgICAgIG9wdGlvbnMuJHN1cGVyID0gU3VwZXI7XG5cbiAgICAgICAgQ29uc3RydWN0b3IgPSB0aGlzLl9jcmVhdGVDb25zdHJ1Y3RvcihvcHRpb25zKTtcblxuICAgICAgICB0aGlzLl9wcm9jZXNzQWZ0ZXJDcmVhdGUoQ29uc3RydWN0b3IsIG9wdGlvbnMpO1xuXG4gICAgICAgIHJldHVybiBDb25zdHJ1Y3RvcjtcbiAgICB9LFxuXG4gICAgX2NyZWF0ZUNvbnN0cnVjdG9yOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHZhciBzdXBlcmNsYXNzID0gb3B0aW9ucy4kc3VwZXIsXG4gICAgICAgICAgICBDb25zdHJ1Y3RvciA9IHRoaXMuX2NyZWF0ZUNvbnN0cnVjdG9yRm4ob3B0aW9ucyk7XG5cbiAgICAgICAgaWYoc3VwZXJjbGFzcykge1xuICAgICAgICAgICAgQ29uc3RydWN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlcmNsYXNzLnByb3RvdHlwZSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBDb25zdHJ1Y3RvcjtcbiAgICB9LFxuXG4gICAgX2NyZWF0ZUNvbnN0cnVjdG9yRm46IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHN1cGVyY2xhc3MgPSBvcHRpb25zLiRzdXBlcixcbiAgICAgICAgICAgIENvbnN0cnVjdG9yO1xuXG4gICAgICAgIGlmICh0aGlzLl9oYXNDb25zdHJ1Y3Rvck1vZGlmeWluZ09wdGlvbnMob3B0aW9ucykpIHtcbiAgICAgICAgICAgIENvbnN0cnVjdG9yID0gdGhpcy5fY3JlYXRlQ29uc3RydWN0b3JXaXRoTW9kaWZpeWluZ09wdGlvbnMob3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZighc3VwZXJjbGFzcykge1xuICAgICAgICAgICAgQ29uc3RydWN0b3IgPSBmdW5jdGlvbigpIHt9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgQ29uc3RydWN0b3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBzdXBlcmNsYXNzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIENvbnN0cnVjdG9yO1xuICAgIH0sXG5cbiAgICBfY3JlYXRlQ29uc3RydWN0b3JXaXRoTW9kaWZpeWluZ09wdGlvbnM6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHN1cGVyY2xhc3MgPSBvcHRpb25zLiRzdXBlcixcbiAgICAgICAgICAgIG1lID0gdGhpcyxcbiAgICAgICAgICAgIGluaXRCZWZvcmVTdXBlcmNsYXNzLFxuICAgICAgICAgICAgaW5pdEFmdGVyU3VwZXJjbGFzcyxcbiAgICAgICAgICAgIGluaXQ7XG5cbiAgICAgICAgaWYgKCFzdXBlcmNsYXNzKSB7XG4gICAgICAgICAgICBpbml0ID0gdGhpcy5fY3JlYXRlSW5pdENsYXNzT3B0aW9uc0ZuKG9wdGlvbnMsIHtcbiAgICAgICAgICAgICAgICBhbGw6IHRydWVcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBhcnJheVNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICBpbml0LmNhbGwodGhpcywgb3B0aW9ucywgYXJncyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdEJlZm9yZVN1cGVyY2xhc3MgPSB0aGlzLl9jcmVhdGVJbml0Q2xhc3NPcHRpb25zRm4ob3B0aW9ucywge1xuICAgICAgICAgICAgYmVmb3JlOiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGluaXRBZnRlclN1cGVyY2xhc3MgPSB0aGlzLl9jcmVhdGVJbml0Q2xhc3NPcHRpb25zRm4ob3B0aW9ucywge1xuICAgICAgICAgICAgYmVmb3JlOiBmYWxzZVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgYXJncyA9IGFycmF5U2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXG4gICAgICAgICAgICBpbml0QmVmb3JlU3VwZXJjbGFzcy5jYWxsKHRoaXMsIG9wdGlvbnMsIGFyZ3MpO1xuICAgICAgICAgICAgc3VwZXJjbGFzcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgaW5pdEFmdGVyU3VwZXJjbGFzcy5jYWxsKHRoaXMsIG9wdGlvbnMsIGFyZ3MpO1xuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBfY3JlYXRlSW5pdENsYXNzT3B0aW9uc0ZuOiBmdW5jdGlvbihvcHRpb25zLCBjb25maWcpIHtcbiAgICAgICAgdmFyIG1lID0gdGhpcyxcbiAgICAgICAgICAgIGNvbXBvc2l0aW9ucyA9IHRoaXMuX2ZpbHRlckNvbXBvc2l0aW9ucyhjb25maWcsIG9wdGlvbnMuJGNvbXBvc2l0aW9ucyk7XG5cbiAgICAgICAgaWYoY29tcG9zaXRpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGVtcHR5Rm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBmdW5jdGlvbihvcHRpb25zLCBpbnN0YW5jZUFyZ3MpIHtcbiAgICAgICAgICAgIG1lLl9pbml0Q29tcG9zaXRpb25zLmNhbGwodGhpcywgY29tcG9zaXRpb25zLCBpbnN0YW5jZUFyZ3MpO1xuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBfZmlsdGVyQ29tcG9zaXRpb25zOiBmdW5jdGlvbihjb25maWcsIGNvbXBvc2l0aW9ucykge1xuICAgICAgICB2YXIgYmVmb3JlID0gY29uZmlnLmJlZm9yZSwgXG4gICAgICAgICAgICBmaWx0ZXJlZCA9IFtdO1xuXG4gICAgICAgIGlmKGNvbmZpZy5hbGwpIHtcbiAgICAgICAgICAgIHJldHVybiBjb21wb3NpdGlvbnM7XG4gICAgICAgIH1cblxuICAgICAgICBhRWFjaChjb21wb3NpdGlvbnMsIGZ1bmN0aW9uKGNvbXBvc2l0aW9uKSB7XG4gICAgICAgICAgICBpZihiZWZvcmUgJiYgY29tcG9zaXRpb24uaW5pdEFmdGVyICE9PSB0cnVlIHx8ICghYmVmb3JlICYmIGNvbXBvc2l0aW9uLmluaXRBZnRlciA9PT0gdHJ1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWQucHVzaChjb21wb3NpdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBmaWx0ZXJlZDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBvcHRpb25zIHtPYmplY3R9IHRoZSBjb21wb3NpdGlvbiBjb25maWcgb2JqZWN0XG4gICAgICogaW5zdGFuY2VBcmdzIHtBcnJheX0gdGhlIGFyZ3VtZW50cyBwYXNzZWQgdG8gdGhlIGluc3RhbmNlJ3NcbiAgICAgKiBjb25zdHJ1Y3Rvci5cbiAgICAgKi9cbiAgICBfaW5pdENvbXBvc2l0aW9uczogZnVuY3Rpb24oY29tcG9zaXRpb25zLCBpbnN0YW5jZUFyZ3MpIHtcbiAgICAgICAgaWYoIXRoaXNbQ2xhc3NEZWZpbmVyLkNPTVBPU0lUSU9OU19OQU1FXSkge1xuICAgICAgICAgICAgdGhpc1tDbGFzc0RlZmluZXIuQ09NUE9TSVRJT05TX05BTUVdID0ge307XG4gICAgICAgIH1cblxuICAgICAgICBhRWFjaChjb21wb3NpdGlvbnMsIGZ1bmN0aW9uKGNvbXBvc2l0aW9uQ29uZmlnKSB7XG4gICAgICAgICAgICB2YXIgY29uZmlnID0gYXBwbHkoe1xuICAgICAgICAgICAgICAgIGluc3RhbmNlOiB0aGlzLFxuICAgICAgICAgICAgICAgIGluc3RhbmNlQXJnczogaW5zdGFuY2VBcmdzXG4gICAgICAgICAgICB9LCBjb21wb3NpdGlvbkNvbmZpZyksIFxuICAgICAgICAgICAgY29tcG9zaXRpb247XG5cbiAgICAgICAgICAgIGNvbXBvc2l0aW9uID0gbmV3IENvbXBvc2l0aW9uKGNvbmZpZyk7XG5cbiAgICAgICAgICAgIHRoaXNbQ2xhc3NEZWZpbmVyLkNPTVBPU0lUSU9OU19OQU1FXVtjb21wb3NpdGlvbi5uYW1lXSA9IGNvbXBvc2l0aW9uLmdldEluc3RhbmNlKCk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICBfaGFzQ29uc3RydWN0b3JNb2RpZnlpbmdPcHRpb25zOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLiRjb21wb3NpdGlvbnM7XG4gICAgfSxcblxuICAgIF9nZXRQcm9jZXNzb3JLZXk6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzb3JLZXlzW2tleV07XG4gICAgfSxcblxuICAgIF9wcm9jZXNzQWZ0ZXJDcmVhdGU6IGZ1bmN0aW9uKCRjbGFzcywgb3B0aW9ucykge1xuICAgICAgICB0aGlzLl9hcHBseVZhbHVlc1RvUHJvdG8oJGNsYXNzLCBvcHRpb25zKTtcbiAgICAgICAgdGhpcy5faGFuZGxlUG9zdFByb2Nlc3NvcnMoJGNsYXNzLCBvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgX2FwcGx5VmFsdWVzVG9Qcm90bzogZnVuY3Rpb24oJGNsYXNzLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBwcm90byA9ICRjbGFzcy5wcm90b3R5cGUsXG4gICAgICAgICAgICBTdXBlciA9IG9wdGlvbnMuJHN1cGVyLFxuICAgICAgICAgICAgdmFsdWVzID0gYXBwbHkoe1xuICAgICAgICAgICAgICAgICRjbGFzczogJGNsYXNzXG4gICAgICAgICAgICB9LCBvcHRpb25zKTtcblxuICAgICAgICBpZiAoU3VwZXIpIHtcbiAgICAgICAgICAgIHZhbHVlcy4kc3VwZXJjbGFzcyA9IFN1cGVyLnByb3RvdHlwZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vRG9uJ3QgcHV0IHRoZSBkZWZpbmUgc3BlY2lmaWMgcHJvcGVydGllc1xuICAgICAgICAvL29uIHRoZSBwcm90b3R5cGVcbiAgICAgICAgb0VhY2godmFsdWVzLCBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2dldFByb2Nlc3NvcktleShrZXkpKSB7XG4gICAgICAgICAgICAgICAgcHJvdG9ba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgX2hhbmRsZVBvc3RQcm9jZXNzb3JzOiBmdW5jdGlvbigkY2xhc3MsIG9wdGlvbnMpIHtcbiAgICAgICAgb0VhY2gob3B0aW9ucywgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIG1ldGhvZCA9IHRoaXMuX2dldFByb2Nlc3NvcktleShrZXkpO1xuXG4gICAgICAgICAgICBpZiAoaXMuaXNGdW5jdGlvbih0aGlzW21ldGhvZF0pKSB7XG4gICAgICAgICAgICAgICAgdGhpc1ttZXRob2RdLmNhbGwodGhpcywgJGNsYXNzLCBvcHRpb25zW2tleV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgX2FwcGx5TWl4aW5zOiBmdW5jdGlvbigkY2xhc3MsIG1peGlucykge1xuICAgICAgICB2YXIgcHJvdG8gPSAkY2xhc3MucHJvdG90eXBlO1xuICAgICAgICBhRWFjaChtaXhpbnMsIGZ1bmN0aW9uKG1peGluKSB7XG4gICAgICAgICAgICAvL2FjY2VwdCBDb25zdHJ1Y3RvcnMgb3IgT2JqZWN0c1xuICAgICAgICAgICAgdmFyIHRvTWl4ID0gbWl4aW4ucHJvdG90eXBlIHx8IG1peGluO1xuICAgICAgICAgICAgbWl4KHByb3RvLCB0b01peCk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBfYXBwbHlTdGF0aWNzOiBmdW5jdGlvbigkY2xhc3MsIHN0YXRpY3MpIHtcbiAgICAgICAgdmFyIHByb3RvdHlwZSA9ICRjbGFzcy5wcm90b3R5cGU7XG5cbiAgICAgICAgYXBwbHkoJGNsYXNzLCBzdGF0aWNzKTtcblxuICAgICAgICBpZihwcm90b3R5cGUuZ2V0U3RhdGljVmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcHJvdG90eXBlLmdldFN0YXRpY1ZhbHVlID0gdGhpcy5nZXRTdGF0aWNWYWx1ZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfY29tcG9zZTogZnVuY3Rpb24oJGNsYXNzLCBjb21wb3NpdGlvbnMpIHtcbiAgICAgICAgdmFyIHByb3RvdHlwZSA9ICRjbGFzcy5wcm90b3R5cGUsXG4gICAgICAgICAgICBtZXRob2RzVG9Db21wb3NlO1xuXG4gICAgICAgIGFFYWNoKGNvbXBvc2l0aW9ucywgZnVuY3Rpb24oY29tcG9zaXRpb25Db25maWcpIHtcbiAgICAgICAgICAgIHZhciBjb21wb3NpdGlvbiA9IG5ldyBDb21wb3NpdGlvbihjb21wb3NpdGlvbkNvbmZpZyksXG4gICAgICAgICAgICAgICAgbmFtZSA9IGNvbXBvc2l0aW9uLm5hbWUsXG4gICAgICAgICAgICAgICAgQ29uc3RydWN0b3IgPSBjb21wb3NpdGlvbi5Db25zdHJ1Y3RvcjtcblxuICAgICAgICAgICAgY29tcG9zaXRpb24udmFsaWRhdGUoKTtcblxuICAgICAgICAgICAgbWV0aG9kc1RvQ29tcG9zZSA9IGNvbXBvc2l0aW9uLmdldE1ldGhvZHNUb0NvbXBvc2UoKTtcblxuICAgICAgICAgICAgbWV0aG9kc1RvQ29tcG9zZS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgICAgIGlmIChwcm90b3R5cGVba2V5XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3RvdHlwZVtrZXldID0gdGhpcy5fY3JlYXRlQ29tcG9zZXJQcm90b0ZuKGtleSwgbmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICAgIGlmKHByb3RvdHlwZS5nZXRDb21wb3NpdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcHJvdG90eXBlLmdldENvbXBvc2l0aW9uID0gdGhpcy5nZXRDb21wb3NpdGlvbjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgX3N1cGVyOiBmdW5jdGlvbigkY2xhc3MsICRzdXBlcikge1xuICAgICAgICBpZiAoJHN1cGVyKSB7XG4gICAgICAgICAgICAkY2xhc3MucHJvdG90eXBlLiRzdXBlciA9ICRzdXBlcjtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfY3JlYXRlQ29tcG9zZXJQcm90b0ZuOiBmdW5jdGlvbihtZXRob2ROYW1lLCBjb21wb3NpdGlvbk5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGNvbXAgPSB0aGlzW0NsYXNzRGVmaW5lci5DT01QT1NJVElPTlNfTkFNRV1bY29tcG9zaXRpb25OYW1lXTtcbiAgICAgICAgICAgIHJldHVybiBjb21wW21ldGhvZE5hbWVdLmFwcGx5KGNvbXAsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8vTWV0aG9kcyB0aGF0IGNhbiBnZXQgYWRkZWQgdG8gdGhlIHByb3RvdHlwZVxuICAgIC8vdGhleSB3aWxsIGJlIGNhbGxlZCBpbiB0aGUgY29udGV4dCBvZiB0aGUgaW5zdGFuY2UuXG4gICAgLyoqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBHZXR0ZXIgZm9yIGNvbXBvc2l0aW9uIGluc3RhbmNlIHRoYXQgZ2V0cyBwdXQgb25cbiAgICAgKiB0aGUgZGVmaW5lZCBjbGFzcy5cbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IGtleVxuICAgICAqL1xuICAgIGdldENvbXBvc2l0aW9uOiBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbQ2xhc3NEZWZpbmVyLkNPTVBPU0lUSU9OU19OQU1FXVtrZXldO1xuICAgIH0sXG5cbiAgICBnZXRTdGF0aWNWYWx1ZTogZnVuY3Rpb24gKGtleSwgJGNsYXNzKSB7XG4gICAgICAgIHZhciBjbGFzc1RvRmluZFZhbHVlID0gJGNsYXNzIHx8IHRoaXMuJGNsYXNzLFxuICAgICAgICAgICAgJHN1cGVyLFxuICAgICAgICAgICAgdmFsdWU7XG5cbiAgICAgICAgdmFsdWUgPSBjbGFzc1RvRmluZFZhbHVlW2tleV07XG5cbiAgICAgICAgaWYodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgJHN1cGVyID0gY2xhc3NUb0ZpbmRWYWx1ZS5wcm90b3R5cGUuJHN1cGVyO1xuICAgICAgICAgICAgaWYoJHN1cGVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0U3RhdGljVmFsdWUoa2V5LCAkc3VwZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxufTtcblxudmFyIERlZmluZXIgPSBuZXcgQ2xhc3NEZWZpbmVyKCk7XG4vL21ha2UgTHVjLmRlZmluZSBoYXBweVxuRGVmaW5lci5kZWZpbmUgPSBEZWZpbmVyLmRlZmluZS5iaW5kKERlZmluZXIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERlZmluZXI7IiwidmFyIGFFYWNoID0gcmVxdWlyZSgnLi4vYXJyYXknKS5lYWNoLFxuICAgIG9iaiA9IHJlcXVpcmUoJy4uL29iamVjdCcpLFxuICAgIGVtcHR5Rm4gPSByZXF1aXJlKCcuLi9mdW5jdGlvbicpLmVtcHR5Rm4sXG4gICAgYXBwbHkgPSBvYmouYXBwbHk7XG5cblxuZnVuY3Rpb24gUGx1Z2luKGNvbmZpZykge1xuICAgIGFwcGx5KHRoaXMsIGNvbmZpZyk7XG59XG5cblBsdWdpbi5wcm90b3R5cGUgPSB7XG4gICAgaW5pdDogZW1wdHlGbixcbiAgICBkZXN0cm95OiBlbXB0eUZuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBsdWdpbjtcbiIsInZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCcuLi9ldmVudHMvZXZlbnRFbWl0dGVyJyksXG4gICAgUGx1Z2luTWFuYWdlciA9IHJlcXVpcmUoJy4vcGx1Z2luTWFuYWdlcicpO1xuXG5tb2R1bGUuZXhwb3J0cy5FdmVudEVtaXR0ZXIgPSB7XG4gICAgQ29uc3RydWN0b3I6IEV2ZW50RW1pdHRlcixcbiAgICBuYW1lOiAnZW1pdHRlcicsXG4gICAgZmlsdGVyS2V5czogJ2FsbE1ldGhvZHMnXG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMuUGx1Z2luTWFuYWdlciA9IHtcbiAgICBuYW1lOiAncGx1Z2lucycsXG4gICAgaW5pdEFmdGVyOiB0cnVlLFxuICAgIENvbnN0cnVjdG9yOiBQbHVnaW5NYW5hZ2VyLFxuICAgIGNyZWF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtYW5hZ2VyID0gbmV3IHRoaXMuQ29uc3RydWN0b3Ioe1xuICAgICAgICAgICAgaW5zdGFuY2U6IHRoaXMuaW5zdGFuY2UsXG4gICAgICAgICAgICBpbnN0YW5jZUFyZ3M6IHRoaXMuaW5zdGFuY2VBcmdzXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBtYW5hZ2VyO1xuICAgIH0sXG4gICAgZmlsdGVyS2V5czogJ3B1YmxpY01ldGhvZHMnXG59OyIsInZhciBvYmogPSByZXF1aXJlKCcuLi9vYmplY3QnKSxcbiAgICBhcHBseSA9IG9iai5hcHBseSxcbiAgICBtaXggPSBvYmoubWl4LFxuICAgIG9GaWx0ZXIgPSBvYmouZmlsdGVyLFxuICAgIGVtcHR5Rm4gPSAoJy4uL2Z1bmN0aW9uJykuZW1wdHlGbixcbiAgICBpcyA9IHJlcXVpcmUoJy4uL2lzJyk7XG5cbi8qKlxuICogQGNsYXNzICBMdWMuQ29tcG9zaXRpb25cbiAqIEBwcm90ZWN0ZWRcbiAqIGNsYXNzIHRoYXQgd3JhcHMgJGNvbXBvc2l0aW9uIGNvbmZpZyBvYmplY3RzXG4gKiB0byBjb25mb3JtIHRvIGFuIGFwaS4gVGhlIGNvbmZpZyBvYmplY3RcbiAqIHdpbGwgb3ZlcnJpZGUgYW55IHByb3RlY3RlZCBtZXRob2RzIGFuZCBkZWZhdWx0IGNvbmZpZ3MuXG4gKi9cbmZ1bmN0aW9uIENvbXBvc2l0aW9uKGMpIHtcbiAgICB2YXIgZGVmYXVsdHMgPSBjLmRlZmF1bHRzLFxuICAgICAgICBjb25maWcgPSBjO1xuXG4gICAgaWYoZGVmYXVsdHMpIHtcbiAgICAgICAgbWl4KGNvbmZpZywgY29uZmlnLmRlZmF1bHRzKTtcbiAgICAgICAgZGVsZXRlIGNvbmZpZy5kZWZhdWx0cztcbiAgICB9XG5cbiAgICBhcHBseSh0aGlzLCBjb25maWcpO1xufVxuXG5Db21wb3NpdGlvbi5wcm90b3R5cGUgPSB7XG4gICAgLyoqXG4gICAgICogQGNmZyB7U3RyaW5nfSBuYW1lIChyZXF1aXJlZCkgdGhlIG5hbWVcbiAgICAgKi9cbiAgICBcbiAgICAvKipcbiAgICAgKiBAY2ZnIHtGdW5jdGlvbn0gQ29uc3RydWN0b3IgKHJlcXVpcmVkKSB0aGUgQ29uc3RydWN0b3JcbiAgICAgKiB0byB1c2Ugd2hlbiBjcmVhdGluZyB0aGUgY29tcG9zaXRpb24gaW5zdGFuY2UuICBUaGlzXG4gICAgICogaXMgcmVxdWlyZWQgaWYgTHVjLkNvbXBvc2l0aW9uLmNyZWF0ZSBpcyBub3Qgb3ZlcnJ3aXR0ZW4gYnlcbiAgICAgKiB0aGUgcGFzc2VkIGluIGNvbXBvc2l0aW9uIGNvbmZpZyBvYmplY3QuXG4gICAgICovXG4gICAgXG4gICAgLyoqXG4gICAgICogQHByb3RlY3RlZFxuICAgICAqIEJ5IGRlZmF1bHQganVzdCByZXR1cm4gYSBuZXdseSBjcmVhdGVkIENvbnN0cnVjdG9yIGluc3RhbmNlLlxuICAgICAqIFxuICAgICAqIFdoZW4gY3JlYXRlIGlzIGNhbGxlZCB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXMgY2FuIGJlIHVzZWQgOlxuICAgICAqIFxuICAgICAqIHRoaXMuaW5zdGFuY2UgVGhlIGluc3RhbmNlIHRoYXQgaXMgY3JlYXRpbmdcbiAgICAgKiB0aGUgY29tcG9zaXRpb24uXG4gICAgICogXG4gICAgICogdGhpcy5Db25zdHJ1Y3RvciB0aGUgY29uc3RydWN0b3IgdGhhdCBpcyBwYXNzZWQgaW4gZnJvbVxuICAgICAqIHRoZSBjb21wb3NpdGlvbiBjb25maWcuIFxuICAgICAqXG4gICAgICogdGhpcy5pbnN0YW5jZUFyZ3MgdGhlIGFyZ3VtZW50cyBwYXNzZWQgaW50byB0aGUgaW5zdGFuY2Ugd2hlbiBpdCBcbiAgICAgKiBpcyBiZWluZyBjcmVhdGVkLiAgRm9yIGV4YW1wbGVcblxuICAgICAgICBuZXcgTXlDbGFzc1dpdGhBQ29tcG9zaXRpb24oe3BsdWdpbnM6IFtdfSlcbiAgICAgICAgLy9pbnNpZGUgb2YgdGhlIGNyZWF0ZSBtZXRob2RcbiAgICAgICAgdGhpcy5pbnN0YW5jZUFyZ3NcbiAgICAgICAgPlt7cGx1Z2luczogW119XVxuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBcbiAgICAgKiB0aGUgY29tcG9zaXRpb24gaW5zdGFuY2UuXG4gICAgICpcbiAgICAgKiBGb3IgZXhhbXBsZSBzZXQgdGhlIGVtaXR0ZXJzIG1heExpc3RlbmVyc1xuICAgICAqIHRvIHdoYXQgdGhlIGluc3RhbmNlIGhhcyBjb25maWdlZC5cbiAgICAgIFxuICAgICAgICBtYXhMaXN0ZW5lcnM6IDEwMCxcbiAgICAgICAgJGNvbXBvc2l0aW9uczoge1xuICAgICAgICAgICAgQ29uc3RydWN0b3I6IEx1Yy5FdmVudEVtaXR0ZXIsXG4gICAgICAgICAgICBjcmVhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBlbWl0dGVyID0gbmV3IHRoaXMuQ29uc3RydWN0b3IoKTtcbiAgICAgICAgICAgICAgICBlbWl0dGVyLnNldE1heExpc3RlbmVycyh0aGlzLmluc3RhbmNlLm1heExpc3RlbmVycyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVtaXR0ZXI7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbmFtZTogJ2VtaXR0ZXInXG4gICAgICAgIH1cblxuICAgICAqL1xuICAgIGNyZWF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBDb25zdHJ1Y3RvciA9IHRoaXMuQ29uc3RydWN0b3I7XG4gICAgICAgIHJldHVybiBuZXcgQ29uc3RydWN0b3IoKTtcbiAgICB9LFxuXG4gICAgZ2V0SW5zdGFuY2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGUoKTtcbiAgICB9LFxuXG4gICAgdmFsaWRhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZih0aGlzLm5hbWUgID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQSBuYW1lIG11c3QgYmUgZGVmaW5lZCcpO1xuICAgICAgICB9XG4gICAgICAgIGlmKCFpcy5pc0Z1bmN0aW9uKHRoaXMuQ29uc3RydWN0b3IpICYmIHRoaXMuY3JlYXRlID09PSBDb21wb3NpdGlvbi5wcm90b3R5cGUuY3JlYXRlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBDb25zdHJ1Y3RvciBtdXN0IGJlIGZ1bmN0aW9uIGlmIGNyZWF0ZSBpcyBub3Qgb3ZlcnJpZGVuJyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IGZpbHRlckZuc1xuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQHByb3BlcnR5IGZpbHRlckZucy5hbGxNZXRob2RzIHJldHVybiBhbGwgbWV0aG9kcyBmcm9tIHRoZVxuICAgICAqIGNvbnN0cnVjdG9ycyBwcm90b3R5cGVcbiAgICAgKiBAcHJvcGVydHkge2ZpbHRlckZucy5wdWJsaWN9IHJldHJ1cm4gYWxsIG1ldGhvZHMgdGhhdCBkb24ndFxuICAgICAqIHN0YXJ0IHdpdGggXy4gIFdlIGtub3cgbm90IGV2ZXJ5b25lIGZvbGxvd3MgdGhpcyBjb252ZW50aW9uLCBidXQgd2VcbiAgICAgKiBkbyBhbmQgc28gZG8gbWFueSBvdGhlcnMuXG4gICAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgICAqL1xuICAgIGZpbHRlckZuczoge1xuICAgICAgICBhbGxNZXRob2RzOiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gaXMuaXNGdW5jdGlvbih2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIHB1YmxpY01ldGhvZHM6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBpcy5pc0Z1bmN0aW9uKHZhbHVlKSAmJiBrZXkuY2hhckF0KDApICE9PSAnXyc7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQGNmZyB7RnVuY3Rpb24vU3RyaW5nL0FycmF5W119IGZpbHRlcktleXNcbiAgICAgKiBUaGUga2V5cyB0byBhZGQgdG8gdGhlIGRlZmluZXJzIHByb3RvdHlwZSB0aGF0IHdpbGwgaW4gdHVybiBjYWxsXG4gICAgICogdGhlIGNvbXBvc2l0aW9ucyBtZXRob2QuXG4gICAgICogXG4gICAgICogRGVmYXVsdHMgdG8gTHVjLmVtcHR5Rm4uIFxuICAgICAqIElmIGFuIGFycmF5IGlzIHBhc3NlZCBpdCB3aWxsIGp1c3QgdXNlIHRoYXQgQXJyYXkuXG4gICAgICogXG4gICAgICogSWYgYSBzdHJpbmcgaXMgcGFzc2VkIGFuZCBtYXRjaGVzIGEgbWV0aG9kIGZyb20gXG4gICAgICogTHVjLkNvbXBvc2l0aW9uLmZpbHRlckZucyBpdCB3aWxsIGNhbGwgdGhhdCBpbnN0ZWFkLlxuICAgICAqIFxuICAgICAqIElmIGEgZnVuY3Rpb24gaXMgZGVmaW5lZCBpdFxuICAgICAqIHdpbGwgZ2V0IGNhbGxlZCB3aGlsZSBpdGVyYXRpbmcgb3ZlciBlYWNoIGtleSB2YWx1ZSBwYWlyIG9mIHRoZSBcbiAgICAgKiBDb25zdHJ1Y3RvcidzIHByb3RvdHlwZSwgaWYgYSB0cnV0aHkgdmFsdWUgaXMgXG4gICAgICogcmV0dXJuZWQgdGhlIHByb3BlcnR5IHdpbGwgYmUgYWRkZWQgdG8gdGhlIGRlZmluaW5nXG4gICAgICogY2xhc3NlcyBwcm90b3R5cGUuXG4gICAgICogXG4gICAgICogRm9yIGV4YW1wbGUgdGhpcyBjb25maWcgd2lsbCBvbmx5IGV4cG9zZSB0aGUgZW1pdCBtZXRob2QgXG4gICAgICogdG8gdGhlIGRlZmluaW5nIGNsYXNzXG4gICAgIFxuICAgICAgICAkY29tcG9zaXRpb25zOiB7XG4gICAgICAgICAgICBDb25zdHJ1Y3RvcjogTHVjLkV2ZW50RW1pdHRlcixcbiAgICAgICAgICAgIGZpbHRlcktleXM6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ga2V5ID09PSAnZW1pdCc7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbmFtZTogJ2VtaXR0ZXInXG4gICAgICAgIH1cbiAgICAgKiB0aGlzIGlzIGFsc28gYSB2YWxpZCBjb25maWdcbiAgICAgKiBcbiAgICAgICAgJGNvbXBvc2l0aW9uczoge1xuICAgICAgICAgICAgQ29uc3RydWN0b3I6IEx1Yy5FdmVudEVtaXR0ZXIsXG4gICAgICAgICAgICBmaWx0ZXJLZXlzOiBbJ2VtaXR0ZXInXSxcbiAgICAgICAgICAgIG5hbWU6ICdlbWl0dGVyJ1xuICAgICAgICB9XG4gICAgICogXG4gICAgICovXG4gICAgZmlsdGVyS2V5czogZW1wdHlGbixcblxuICAgIGdldE1ldGhvZHNUb0NvbXBvc2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZmlsdGVyS2V5cyA9IHRoaXMuZmlsdGVyS2V5cyxcbiAgICAgICAgICAgIHBhaXJzVG9BZGQsXG4gICAgICAgICAgICBmaWx0ZXJGbjtcblxuXG4gICAgICAgIGlmIChpcy5pc0FycmF5KGZpbHRlcktleXMpKSB7XG4gICAgICAgICAgICBwYWlyc1RvQWRkID0gZmlsdGVyS2V5cztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZpbHRlckZuID0gZmlsdGVyS2V5cztcblxuICAgICAgICAgICAgaWYgKGlzLmlzU3RyaW5nKGZpbHRlcktleXMpKSB7XG4gICAgICAgICAgICAgICAgZmlsdGVyRm4gPSB0aGlzLmZpbHRlckZuc1tmaWx0ZXJLZXlzXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9Db25zdHJ1Y3RvcnMgYXJlIG5vdCBuZWVkZWQgaWYgY3JlYXRlIGlzIG92ZXJ3cml0dGVuXG4gICAgICAgICAgICBwYWlyc1RvQWRkID0gb0ZpbHRlcih0aGlzLkNvbnN0cnVjdG9yICYmIHRoaXMuQ29uc3RydWN0b3IucHJvdG90eXBlLCBmaWx0ZXJGbiwgdGhpcywge1xuICAgICAgICAgICAgICAgIG93blByb3BlcnRpZXM6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGtleXM6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBhaXJzVG9BZGQ7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb21wb3NpdGlvbjsiLCJ2YXIgUGx1Z2luID0gcmVxdWlyZSgnLi9wbHVnaW4nKSxcbiAgICBpcyA9IHJlcXVpcmUoJy4uL2lzJyksXG4gICAgb2JqID0gcmVxdWlyZSgnLi4vb2JqZWN0JyksXG4gICAgYXJyID0gcmVxdWlyZSgnLi4vYXJyYXknKSxcbiAgICBhRWFjaCA9IGFyci5lYWNoLFxuICAgIG1peCA9IG9iai5taXgsXG4gICAgYXBwbHkgPSBvYmouYXBwbHk7XG5cbmZ1bmN0aW9uIFBsdWdpbk1hbmFnZXIoY29uZmlnKSB7XG4gICAgdGhpcy5faW5pdChjb25maWcpO1xufVxuXG5QbHVnaW5NYW5hZ2VyLnByb3RvdHlwZSA9IHtcbiAgICBkZWZhdWx0UGx1Z2luOiBQbHVnaW4sXG5cbiAgICAvKipcbiAgICAgKiBAcHJvdGVjdGVkXG4gICAgICovXG4gICAgX2luaXQ6IGZ1bmN0aW9uKGluc3RhbmNlVmFsdWVzKSB7XG4gICAgICAgIGFwcGx5KHRoaXMsIGluc3RhbmNlVmFsdWVzKTtcbiAgICAgICAgdGhpcy5wbHVnaW5zID0gW107XG4gICAgICAgIHRoaXMuX2NyZWF0ZVBsdWdpbnMoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHByb3RlY3RlZFxuICAgICAqL1xuICAgIF9jcmVhdGVQbHVnaW5zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgYUVhY2godGhpcy5fZ2V0UGx1Z2luQ29uZmlnRnJvbUluc3RhbmNlKCksIGZ1bmN0aW9uKHBsdWdpbkNvbmZpZykge1xuICAgICAgICAgICAgdGhpcy5hZGRQbHVnaW4ocGx1Z2luQ29uZmlnKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgKi9cbiAgICBfZ2V0UGx1Z2luQ29uZmlnRnJvbUluc3RhbmNlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGNvbmZpZyA9IHRoaXMuaW5zdGFuY2VBcmdzWzBdO1xuICAgICAgICByZXR1cm4gY29uZmlnLnBsdWdpbnM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZCBhIHBsdWdpbiB0byB0aGUgaW5zdGFuY2UgYW5kIGluaXQgdGhlIFxuICAgICAqIHBsdWdpbi5cbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9IHBsdWdpbkNvbmZpZ1xuICAgICAqIEByZXR1cm4ge09iamVjdH0gdGhlIGNyZWF0ZWQgcGx1Z2luIGluc3RhbmNlXG4gICAgICovXG4gICAgYWRkUGx1Z2luOiBmdW5jdGlvbihwbHVnaW5Db25maWcpIHtcbiAgICAgICAgdmFyIHBsdWdpbkluc3RhbmNlID0gdGhpcy5fY3JlYXRlUGx1Z2luKHBsdWdpbkNvbmZpZyk7XG5cbiAgICAgICAgdGhpcy5faW5pdFBsdWdpbihwbHVnaW5JbnN0YW5jZSk7XG5cbiAgICAgICAgdGhpcy5wbHVnaW5zLnB1c2gocGx1Z2luSW5zdGFuY2UpO1xuXG4gICAgICAgIHJldHVybiBwbHVnaW5JbnN0YW5jZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHByb3RlY3RlZFxuICAgICAqL1xuICAgIF9jcmVhdGVQbHVnaW46IGZ1bmN0aW9uKGNvbmZpZykge1xuICAgICAgICBjb25maWcub3duZXIgPSB0aGlzLmluc3RhbmNlO1xuXG4gICAgICAgIGlmIChjb25maWcuQ29uc3RydWN0b3IpIHtcbiAgICAgICAgICAgIC8vY2FsbCB0aGUgY29uZmlnZWQgQ29uc3RydWN0b3Igd2l0aCB0aGUgXG4gICAgICAgICAgICAvL3Bhc3NlZCBpbiBjb25maWcgYnV0IHRha2Ugb2ZmIHRoZSBDb25zdHJ1Y3RvclxuICAgICAgICAgICAgLy9jb25maWcuXG4gICAgICAgICAgICAgXG4gICAgICAgICAgICAvL1RoZSBwbHVnaW4gQ29uc3RydWN0b3IgXG4gICAgICAgICAgICAvL3Nob3VsZCBub3QgbmVlZCB0byBrbm93IGFib3V0IGl0c2VsZlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBjb25maWcuQ29uc3RydWN0b3IoYXBwbHkoY29uZmlnLCB7XG4gICAgICAgICAgICAgICAgQ29uc3RydWN0b3I6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzLmRlZmF1bHRQbHVnaW4oY29uZmlnKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHByb3RlY3RlZFxuICAgICAqL1xuICAgIF9pbml0UGx1Z2luOiBmdW5jdGlvbihwbHVnaW4pIHtcbiAgICAgICAgaWYgKGlzLmlzRnVuY3Rpb24ocGx1Z2luLmluaXQpKSB7XG4gICAgICAgICAgICBwbHVnaW4uaW5pdCh0aGlzLmluc3RhbmNlKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDYWxsIGRlc3Ryb3kgb24gYWxsIG9mIHRoZSBwbHVnaW5zXG4gICAgICogYW5kIHJlbW92ZSB0aGVtIGZyb20gdGhlIGFycmF5LlxuICAgICAqL1xuICAgIGRlc3Ryb3lBbGxQbHVnaW5zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5wbHVnaW5zLmZvckVhY2goZnVuY3Rpb24ocGx1Z2luKSB7XG4gICAgICAgICAgICB0aGlzLl9kZXN0cm95UGx1Z2luKHBsdWdpbik7XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIHRoaXMucGx1Z2lucyA9IFtdO1xuICAgIH0sXG5cbiAgICBfZGVzdHJveVBsdWdpbjogZnVuY3Rpb24ocGx1Z2luKSB7XG4gICAgICAgIGlmIChpcy5pc0Z1bmN0aW9uKHBsdWdpbi5kZXN0cm95KSkge1xuICAgICAgICAgICAgcGx1Z2luLmRlc3Ryb3kodGhpcy5pbnN0YW5jZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIHRoZSBwbHVnaW4gZnJvbSB0aGUgcGx1Z2lucyBhcnJheSBhbmQgXG4gICAgICogaWYgZm91bmQgZGVzdHJveSBpdC5cbiAgICAgKiBAcGFyYW0gIHtPYmplY3QvQ29uc3RydWN0b3J9IG9iamVjdCB0byB1c2UgdG8gbWF0Y2ggXG4gICAgICogdGhlIHBsdWdpbiB0byByZW1vdmUuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSB0aGUgZGVzdHJveWVkIHBsdWdpbi5cbiAgICAgKi9cbiAgICBkZXN0cm95UGx1Z2luOiBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgdmFyIHBsdWdpbiA9IHRoaXMuZ2V0UGx1Z2luKG9iaik7XG5cbiAgICAgICAgaWYocGx1Z2luKSB7XG4gICAgICAgICAgICB0aGlzLl9kZXN0cm95UGx1Z2luKHBsdWdpbik7XG4gICAgICAgICAgICBhcnIucmVtb3ZlRmlyc3QodGhpcy5wbHVnaW5zLCBwbHVnaW4sIHt0eXBlOiAnc3RyaWN0J30pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBsdWdpbjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IGEgcGx1Z2luIGluc3RhbmNlLlxuICAgICAqIEBwYXJhbSAge09iamVjdH0gb2JqIFxuICAgICAqIEByZXR1cm4ge09iamVjdH0gdGhlIHBsdWdpbiBpbnN0YW5jZSBpZiBmb3VuZC5cbiAgICAgKi9cbiAgICBnZXRQbHVnaW46IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICBpZiAoaXMuaXNGdW5jdGlvbihvYmopKSB7XG4gICAgICAgICAgICByZXR1cm4gYXJyLmZpbmRGaXJzdEluc3RhbmNlT2YodGhpcy5wbHVnaW5zLCBvYmopO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhcnIuZmluZEZpcnN0KHRoaXMucGx1Z2lucywgb2JqLCB7dHlwZTogJ2xvb3NlJ30pO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUGx1Z2luTWFuYWdlcjsiXX0=
;