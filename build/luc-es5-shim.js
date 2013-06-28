;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
/**
 * @license https://raw.github.com/kriskowal/es5-shim/master/LICENSE
 * es5-shim license
 */

if(typeof window !== 'undefined') {
    require('es5-shim-sham');
}

module.exports = require('./luc');
},{"./luc":2,"es5-shim-sham":3}],2:[function(require,module,exports){
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
},{"./object":4,"./function":5,"./array":6,"./arrayFnGenerator":7,"./is":8,"./events/eventEmitter":9,"./class/base":10,"./class/definer":11,"./class/plugin":12,"./class/pluginManager":13,"./class/compositionEnums":14,"./compare":15,"./id":16}],4:[function(require,module,exports){
/**
 * @class Luc.Object
 * Package for Object methods  Luc.Object.apply and Luc.Object.each
 * are used very often.
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
},{}],8:[function(require,module,exports){
var oToString = Object.prototype.toString;
/**
 * @class Luc.is 
 * This actually apart of the Luc namespace, not Luc.is.isEmpty.   Package for 
 * determining the types of objects it also has an Luc.isEmpty and Luc.isFalsy functions.
 * You can see that we don't have an 
 * isNull isUndefined or isNaN.  We prefer to use:
 
    obj === null
    obj === undefined
    isNaN(obj)

 * I'm sure there a is a use case for isBoolean
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
},{}],9:[function(require,module,exports){
/**
 * @license https://raw.github.com/joyent/node/v0.10.11/LICENSE
 * Node js license. EventEmitter will be in the client
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
},{"events":17}],16:[function(require,module,exports){
var ids = {};
/**
 * @member Luc
 * @method id
 * 
 * Return a unique id.
 * @param {String} [prefix] Option prefix to use
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
},{}],18:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
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
},{"__browserify_process":18}],3:[function(require,module,exports){
require('./node_modules/es5-shim/es5-shim');
require('./node_modules/es5-shim/es5-sham');
},{"./node_modules/es5-shim/es5-shim":19,"./node_modules/es5-shim/es5-sham":20}],5:[function(require,module,exports){
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
 * Augment the passed in function's thisArg and or aguments object 
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

    Luc.Function.createAugmenter(fn, {
        thisArg: {configedThisArg: true},
        args: [1,2,3],
        index:0
    })(4)

    >Object {configedThisArg: true}
    >[1, 2, 3, 4]

    Luc.Function.createAugmenter(fn, {
        thisArg: {configedThisArg: true},
        args: [1,2,3],
        index:0,
        argumentsFirst:false
    })(4)

    >Object {configedThisArg: true}
    >[4, 1, 2, 3]


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
        return fn.apply(thisArg || this, augmentArgs(config, arguments));
    };
};

function initSequenceFunctions(fns, config) {
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
 * @param  {Function/Function[]} fns 
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
 * for Luc.Function.createAugmenter.  If defined all of the functions
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
 * for Luc.Function.createAugmenter.  If defined all of the functions
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
 * Create a throttled function from the passed in function
 * that will only get called once the passed number of miliseconds
 * have been execeeded.  
 * 
 * @param  {Function} fn
 * @param  {Number} [millis] Number of milliseconds to
 * throttle the function.
 * @param  {Object} [config] Config object
 * for Luc.Function.createAugmenter.  If defined all of the functions
 * will get created with the passed in config;
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
 * @param  {Number} [millis] Number of milliseconds to
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
},{"./is":8,"./array":6}],6:[function(require,module,exports){
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
 * Keep in mind that Luc is optionally packaged with es5 shim so you can target non-es5 browsers.
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
 * This also takes acccount for null/undefined values.
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
 * Return the items inbetween the passed in index
 * and the end of the array.
 * 
 * @param  {Array/arguments} arr 
 * @param  {Number} index 
 * @return {Array} the new array.
 * 
    Luc.Array.fromIndex([1,2,3,4,5], 1)
    >[2, 3, 4, 5]
 * 
 */
function fromIndex(a, index) {
    var arr = is.isArguments(a) ? arraySlice.call(a) : a;
    return arraySlice.call(arr, index, arr.length);
}

/**
 * Runs an Array.forEach after calling Luc.Array.toArray on the item.
 * @param  {Object}   item
 * @param  {Function} callback
 * @param  {Object}   thisArg   
 *
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
    var found = arr.filter(fn);
    return found;
}

/**
 * Find the all the items from the passed in array
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
 * Find the all the items from the passed in array
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

},{"./compare":15,"./is":8}],7:[function(require,module,exports){
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
 * There are a lot of functions in this package but all of the
 *  methods follow the same api.  \*All functions will return an array of removed or found
 * items.  The items will be added to the array in the order they are
 * found.  \*First functions will return the first item and stop iterating after that, if none
 *  is found false is returned.  remove\* functions will directly change the passed in array.
 *  \*Not functions only do the following actions if the comparison is not true.
 *  \*Last functions do the same as their \*First counterparts except that the iterating
 *  starts at the end of the array. Almost every public method of Luc.is available it
 *  uses the following grammar Luc.Array["methodName""isMethodName"]
 *
      Luc.Array.findAllNotEmpty([false, true, null, undefined, 0, '', [], [1]])
      > [true, 0, [1]]

      Luc.Array.findAllNotFalsy([false, true, null, undefined, 0, '', [], [1]])
      > [true, 0, [], [1]]

     Luc.Array.findFirstIn([1,2,3, {a:1, b:2}], [{a:1}])
     >Object {a: 1, b: 2}
     
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
    Luc.Array.findAllInstanceOf([1,2, new Date(), {}, []], Object)
    >[date, {}, []]
    >Luc.Array.findAllNotInstanceOf([1,2, new Date(), {}, []], Object)
    [1, 2]
 *
 * 
    Luc.Array.findAllIn([1,2,3], [1,2])
    >[1, 2]
    Luc.Array.findFirstIn([1,2,3], [1,2])
    >1
    Luc.Array.findFirst([1,2,3, {a:1, b:2}], {a:1})
    >Object {a: 1, b: 2}

    Luc.Array.findFirstIn([1,2,3, {a:1, b:2}], [1,{a:1}], {type: 'deep'})
    >1
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
},{"./array":6,"./is":8}],15:[function(require,module,exports){
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
},{"./is":8}],10:[function(require,module,exports){
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
     * the class.
     */
    init: emptyFn
};

module.exports = Base;
},{"../function":5,"../object":4}],11:[function(require,module,exports){
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
 * Singleton that {@link Luc.define#define Luc.define} uses to define classes
 */

/**
 * @cfg {Function} defaultType this can be changed to any Constructor.  Defaults
 * to Luc.Base
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
 * This is actually a function but has a lot of decent amount of important options
 * so we are documenting it like it is a class.  Properties are things that will get
 * applied to instances of classes defined with {@link Luc.define#define define}.  No
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
 * @property {Function} $class reference to the instances own constructor.  This
 * will get added to any class that is defined with Luc.define.
 * 
    var C = Luc.define()
    var c = new C()
    c.$class === C
    >true
 *
 * There are some really good use cases to have a reference to it's
 * own constructor.  <br> Add functionality to an instance in a simple
 * and generic way.
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
 * @property {Function} getStaticValue this method
 * will be added to instances that use the $statics
 * config.
 *
 * 
 * This should be used over this.$class.staticName to
 * get the value over a static.  If the class gets inherited
 * from this.$class will not be the same.  getStatic value
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
 * @property {Function} getComposition this method will be
 * to instances that use the $compositions config
 *
 * @param  {String} name the game of the composition to
 * get.
 */


/**
 * @cfg {Object} $statics (optional) Add static properties or methods
 * to the class.  These properties/methods will not be able to be
 * directly modified by the instance so they are good for defining default
 * configs.  
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
 * will the prototype of $super.  It can be used to call parent's
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
 * to a class that should not add state.  $mixins can be either objects or Constructors.
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
 * without extending it.  A $mixin can offer similar functionality but should
 * be stateless.  A Constructor and a name are needed for the config object
 * The filterKeys property is optional here but it is saying take all of 
 * Luc.EventEmitter's instance methods and make them instance methods for C.
 * You can check out all of the config options by looking at Luc.Composition.
 * 
        var C = Luc.define({
            $compositions: {
                Constructor: Luc.EventEmitter,
                name: 'emitter',
                filterKeys: 'allMethods'
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
 * it adds a state "_events" to the this instance when on is called.
 * It is not terrible practice by any means but it is not good to have an object
 * that knows that it may be mixin.  Even worse than that would be a mixin that needs
 * to be inited by the defining class.  Encapsulating logic in a class
 * and using it anywhere seamlessly is where compositions shine. Luc comes with two common 
 * {@link Luc#compositionEnums enums} that we expect will be used often.
 * 
 * <br>
 * Here is an example of a composition that doesn't
 * come with Luc:
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
                    filterKeys: 'allMethods'
                }
        });

        var c = new C()

        c.increaseCount();
        c.increaseCount();
        c.increaseCount();
        c.getCount();
        >3
        c.count
 *
 * Here is the plugin manager enum in action keep in mind that this
 * functionality can be added to any class, not just ones defined with 
 * Luc.define.
   
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
        //inheriting from Luc.Base is not needed
        super: null,
        plugins: [{Constructor: MyPlugin, myCoolName: 'coo'}]
    });
    >im getting initted

    c.getPlugin({myCoolName: 'coo'}) instanceof MyPlugin
    > true


    c.a = 1;
    //This will be the default Luc.Plugin
    c.addPlugin({
        init: function(owner) {
            console.log(owner.a)
        },
        destroy: function() {
            console.log('Im getting destroyed')
        }
    });

    >1

    c.destroyAllPlugins();
    >MyPlugin instance being destroyed
    >I'm getting destroyed.

    c.getPlugin({myCoolName: 'coo'})
    >false
 *
 * You can see that it can add plugin like behavior to any defining
 * class with Luc.PluginManger which is less than 75 SLOC.
 */
},{"./base":10,"./composition":21,"../object":4,"../function":5,"../array":6,"../is":8}],12:[function(require,module,exports){
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

},{"../array":6,"../function":5,"../object":4}],13:[function(require,module,exports){
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
 * By {@link Luc.compositionEnums#PluginManager default} add
 * all of these public methods to the instance.  The protected methods will
 * not be but if PluginManager doesn't do exactly what you need it do it
 * is designed to be subclassed to fit any domain.
 */
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
},{"./plugin":12,"../is":8,"../object":4,"../array":6}],14:[function(require,module,exports){
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
            filterKeys: ['emit']
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
    filterKeys: 'allMethods'
};


/**
 * @property {Object} PluginManager
 */
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
},{"../events/eventEmitter":9,"./pluginManager":13}],19:[function(require,module,exports){
(function(){// Copyright 2009-2012 by contributors, MIT License
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

})()
},{}],20:[function(require,module,exports){
(function(){// Copyright 2009-2012 by contributors, MIT License
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

})()
},{}],21:[function(require,module,exports){
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
 * will override any protected methods and default configs.  defaults
 * can be used for often used configs, keys that are not defaults will
 * override the defaults
 *
    var C = Luc.define({
        $compositions: {
            defaults: Luc.compositionEnums.EventEmitter,
            filterKeys: ['emit']
        }
    });

    var c = new C()
    typeof c.emit
    >"function"
    typeof c.on
    >"undefined"
 *
 * If you want to add your own composition all you need to have is
 * a name and a Constructor, the rest of the configs and Luc.Composition.create
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
                filterKeys: 'allMethods'
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
     * @cfg {String} name (required) the name
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
            throw new Error('The Constructor must be function if create is not overridden');
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

    getObjectWithMethods: function() {
        return this.Constructor && this.Constructor.prototype;
    },

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
            pairsToAdd = oFilter(this.getObjectWithMethods(), filterFn, this, {
                ownProperties: false,
                keys: true
            });
        }

        return pairsToAdd;
    }
};

module.exports = Composition;
},{"../object":4,"../is":8}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvbHVjLWVzNS1zaGltLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2x1Yy5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9vYmplY3QuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvaXMuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvZXZlbnRzL2V2ZW50RW1pdHRlci5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9pZC5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9pbnNlcnQtbW9kdWxlLWdsb2JhbHMvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLWJ1aWx0aW5zL2J1aWx0aW4vZXZlbnRzLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbm9kZV9tb2R1bGVzL2VzNS1zaGltLXNoYW0vaW5kZXguanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvZnVuY3Rpb24uanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvYXJyYXkuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvYXJyYXlGbkdlbmVyYXRvci5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9jb21wYXJlLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2NsYXNzL2Jhc2UuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvY2xhc3MvZGVmaW5lci5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9jbGFzcy9wbHVnaW4uanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvY2xhc3MvcGx1Z2luTWFuYWdlci5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9jbGFzcy9jb21wb3NpdGlvbkVudW1zLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbm9kZV9tb2R1bGVzL2VzNS1zaGltLXNoYW0vbm9kZV9tb2R1bGVzL2VzNS1zaGltL2VzNS1zaGltLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbm9kZV9tb2R1bGVzL2VzNS1zaGltLXNoYW0vbm9kZV9tb2R1bGVzL2VzNS1zaGltL2VzNS1zaGFtLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2NsYXNzL2NvbXBvc2l0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TEE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25XQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzY0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzV3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ255Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3YkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2UgaHR0cHM6Ly9yYXcuZ2l0aHViLmNvbS9rcmlza293YWwvZXM1LXNoaW0vbWFzdGVyL0xJQ0VOU0VcbiAqIGVzNS1zaGltIGxpY2Vuc2VcbiAqL1xuXG5pZih0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJlcXVpcmUoJ2VzNS1zaGltLXNoYW0nKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2x1YycpOyIsInZhciBMdWMgPSB7fTtcbi8qKlxuICogQGNsYXNzIEx1Y1xuICogQWxpYXNlcyBmb3IgY29tbW9uIEx1YyBtZXRob2RzIGFuZCBwYWNrYWdlcy4gIENoZWNrIG91dCBMdWMuZGVmaW5lXG4gKiB0byBsb29rIGF0IHRoZSBjbGFzcyBzeXN0ZW0gTHVjIHByb3ZpZGVzLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IEx1YztcblxudmFyIG9iamVjdCA9IHJlcXVpcmUoJy4vb2JqZWN0Jyk7XG5MdWMuT2JqZWN0ID0gb2JqZWN0O1xuLyoqXG4gKiBAbWVtYmVyIEx1Y1xuICogQHByb3BlcnR5IE8gTHVjLk9cbiAqIEFsaWFzIGZvciBMdWMuT2JqZWN0XG4gKi9cbkx1Yy5PID0gb2JqZWN0O1xuXG5cbi8qKlxuICogQG1lbWJlciBMdWNcbiAqIEBtZXRob2QgYXBwbHlcbiAqIEBpbmhlcml0ZG9jIEx1Yy5PYmplY3QjYXBwbHlcbiAqL1xuTHVjLmFwcGx5ID0gTHVjLk9iamVjdC5hcHBseTtcblxuLyoqXG4gKiBAbWVtYmVyIEx1Y1xuICogQG1ldGhvZCBtaXhcbiAqIEBpbmhlcml0ZG9jIEx1Yy5PYmplY3QjbWl4XG4gKi9cbkx1Yy5taXggPSBMdWMuT2JqZWN0Lm1peDtcblxuXG52YXIgZnVuID0gcmVxdWlyZSgnLi9mdW5jdGlvbicpO1xuTHVjLkZ1bmN0aW9uID0gZnVuO1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjXG4gKiBAcHJvcGVydHkgRiBMdWMuRlxuICogQWxpYXMgZm9yIEx1Yy5GdW5jdGlvblxuICovXG5MdWMuRiA9IGZ1bjtcblxuLyoqXG4gKiBAbWVtYmVyIEx1Y1xuICogQG1ldGhvZCBlbXB0eUZuXG4gKiBAaW5oZXJpdGRvYyBMdWMuRnVuY3Rpb24jZW1wdHlGblxuICovXG5MdWMuZW1wdHlGbiA9IEx1Yy5GdW5jdGlvbi5lbXB0eUZuO1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjXG4gKiBAbWV0aG9kIGFic3RyYWN0Rm5cbiAqIEBpbmhlcml0ZG9jIEx1Yy5GdW5jdGlvbiNhYnN0cmFjdEZuXG4gKi9cbkx1Yy5hYnN0cmFjdEZuID0gTHVjLkZ1bmN0aW9uLmFic3RyYWN0Rm47XG5cbnZhciBhcnJheSA9IHJlcXVpcmUoJy4vYXJyYXknKTtcbkx1Yy5BcnJheSA9IGFycmF5O1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjXG4gKiBAcHJvcGVydHkgQSBMdWMuQVxuICogQWxpYXMgZm9yIEx1Yy5BcnJheVxuICovXG5MdWMuQSA9IGFycmF5O1xuXG5MdWMuQXJyYXlGbkdlbmVyYXRvciA9IHJlcXVpcmUoJy4vYXJyYXlGbkdlbmVyYXRvcicpO1xuXG5MdWMuYXBwbHkoTHVjLCByZXF1aXJlKCcuL2lzJykpO1xuXG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnLi9ldmVudHMvZXZlbnRFbWl0dGVyJyk7XG5cbkx1Yy5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbnZhciBCYXNlID0gcmVxdWlyZSgnLi9jbGFzcy9iYXNlJyk7XG5cbkx1Yy5CYXNlID0gQmFzZTtcblxudmFyIERlZmluZXIgPSByZXF1aXJlKCcuL2NsYXNzL2RlZmluZXInKTtcblxuTHVjLkNsYXNzRGVmaW5lciA9IERlZmluZXI7XG5cbi8qKlxuICogQG1lbWJlciBMdWNcbiAqIEBtZXRob2QgZGVmaW5lXG4gKiBAaW5oZXJpdGRvYyBMdWMuZGVmaW5lI2RlZmluZVxuICovXG5MdWMuZGVmaW5lID0gRGVmaW5lci5kZWZpbmU7XG5cbkx1Yy5QbHVnaW4gPSByZXF1aXJlKCcuL2NsYXNzL3BsdWdpbicpO1xuXG5MdWMuUGx1Z2luTWFuYWdlciA9IHJlcXVpcmUoJy4vY2xhc3MvcGx1Z2luTWFuYWdlcicpO1xuXG5MdWMuYXBwbHkoTHVjLCB7XG4gICAgY29tcG9zaXRpb25FbnVtczogcmVxdWlyZSgnLi9jbGFzcy9jb21wb3NpdGlvbkVudW1zJylcbn0pO1xuXG5MdWMuY29tcGFyZSA9IHJlcXVpcmUoJy4vY29tcGFyZScpLmNvbXBhcmU7XG5cbkx1Yy5pZCA9IHJlcXVpcmUoJy4vaWQnKTtcblxuXG5pZih0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgIHdpbmRvdy5MdWMgPSBMdWM7XG59IiwiLyoqXG4gKiBAY2xhc3MgTHVjLk9iamVjdFxuICogUGFja2FnZSBmb3IgT2JqZWN0IG1ldGhvZHMgIEx1Yy5PYmplY3QuYXBwbHkgYW5kIEx1Yy5PYmplY3QuZWFjaFxuICogYXJlIHVzZWQgdmVyeSBvZnRlbi5cbiAqL1xuXG4vKipcbiAqIEFwcGx5IHRoZSBwcm9wZXJ0aWVzIGZyb20gZnJvbU9iamVjdCB0byB0aGUgdG9PYmplY3QuICBmcm9tT2JqZWN0IHdpbGxcbiAqIG92ZXJ3cml0ZSBhbnkgc2hhcmVkIGtleXMuICBJdCBjYW4gYWxzbyBiZSB1c2VkIGFzIGEgc2ltcGxlIHNoYWxsb3cgY2xvbmUuXG4gKiBcbiAgICB2YXIgdG8gPSB7YToxLCBjOjF9LCBmcm9tID0ge2E6MiwgYjoyfVxuICAgIEx1Yy5PYmplY3QuYXBwbHkodG8sIGZyb20pXG4gICAgPk9iamVjdCB7YTogMiwgYzogMSwgYjogMn1cbiAgICB0byA9PT0gdG9cbiAgICA+dHJ1ZVxuICAgIHZhciBjbG9uZSA9IEx1Yy5PYmplY3QuYXBwbHkoe30sIGZyb20pXG4gICAgPnVuZGVmaW5lZFxuICAgIGNsb25lXG4gICAgPk9iamVjdCB7YTogMiwgYjogMn1cbiAgICBjbG9uZSA9PT0gZnJvbVxuICAgID5mYWxzZVxuICpcbiAqIE5vIG51bGwgY2hlY2tzIGFyZSBuZWVkZWQuXG4gICAgXG4gICAgTHVjLmFwcGx5KHVuZGVmaW5lZCwge2E6MX0pXG4gICAgPnthOjF9XG4gICAgTHVjLmFwcGx5KHthOiAxfSlcbiAgICA+e2E6MX1cblxuICpcbiAqIFxuICogQHBhcmFtICB7T2JqZWN0fSBbdG9PYmplY3RdIE9iamVjdCB0byBwdXQgdGhlIHByb3BlcnRpZXMgZnJvbU9iamVjdCBvbi5cbiAqIEBwYXJhbSAge09iamVjdH0gW2Zyb21PYmplY3RdIE9iamVjdCB0byBwdXQgdGhlIHByb3BlcnRpZXMgb24gdGhlIHRvT2JqZWN0XG4gKiBAcmV0dXJuIHtPYmplY3R9IHRoZSB0b09iamVjdFxuICovXG5leHBvcnRzLmFwcGx5ID0gZnVuY3Rpb24odG9PYmplY3QsIGZyb21PYmplY3QpIHtcbiAgICB2YXIgdG8gPSB0b09iamVjdCB8fCB7fSxcbiAgICAgICAgZnJvbSA9IGZyb21PYmplY3QgfHwge30sXG4gICAgICAgIHByb3A7XG5cbiAgICBmb3IgKHByb3AgaW4gZnJvbSkge1xuICAgICAgICBpZiAoZnJvbS5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgICAgdG9bcHJvcF0gPSBmcm9tW3Byb3BdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRvO1xufTtcblxuLyoqXG4gKiBTaW1pbGFyIHRvIEx1Yy5PYmplY3QuYXBwbHkgZXhjZXB0IHRoYXQgdGhlIGZyb21PYmplY3Qgd2lsbCBcbiAqIE5PVCBvdmVyd3JpdGUgdGhlIGtleXMgb2YgdGhlIHRvT2JqZWN0IGlmIHRoZXkgYXJlIGRlZmluZWQuXG4gKlxuICAgIEx1Yy5taXgoe2E6MSxiOjJ9LCB7YTozLGI6NCxjOjV9KVxuICAgID57YTogMSwgYjogMiwgYzogNX1cblxuICogTm8gbnVsbCBjaGVja3MgYXJlIG5lZWRlZC5cbiAgICBcbiAgICBMdWMubWl4KHVuZGVmaW5lZCwge2E6MX0pXG4gICAgPnthOjF9XG4gICAgTHVjLm1peCh7YTogMX0pXG4gICAgPnthOjF9XG4gICAgXG4gKlxuXG4gKiBAcGFyYW0gIHtPYmplY3R9IFt0b09iamVjdF0gT2JqZWN0IHRvIHB1dCB0aGUgcHJvcGVydGllcyBmcm9tT2JqZWN0IG9uLlxuICogQHBhcmFtICB7T2JqZWN0fSBbZnJvbU9iamVjdF0gZnJvbU9iamVjdCBPYmplY3QgdG8gcHV0IHRoZSBwcm9wZXJ0aWVzIG9uIHRoZSB0b09iamVjdFxuICogQHJldHVybiB7T2JqZWN0fSB0aGUgdG9PYmplY3RcbiAqL1xuZXhwb3J0cy5taXggPSBmdW5jdGlvbih0b09iamVjdCwgZnJvbU9iamVjdCkge1xuICAgIHZhciB0byA9IHRvT2JqZWN0IHx8IHt9LFxuICAgICAgICBmcm9tID0gZnJvbU9iamVjdCB8fCB7fSxcbiAgICAgICAgcHJvcDtcblxuICAgIGZvciAocHJvcCBpbiBmcm9tKSB7XG4gICAgICAgIGlmIChmcm9tLmhhc093blByb3BlcnR5KHByb3ApICYmIHRvW3Byb3BdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRvW3Byb3BdID0gZnJvbVtwcm9wXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0bztcbn07XG5cbi8qKlxuICogSXRlcmF0ZSBvdmVyIGFuIG9iamVjdHMgcHJvcGVydGllc1xuICogYXMga2V5IHZhbHVlIFwicGFpcnNcIiB3aXRoIHRoZSBwYXNzZWQgaW4gZnVuY3Rpb24uXG4gKiBcbiAgICB2YXIgdGhpc0FyZyA9IHt2YWw6MX07XG4gICAgTHVjLk9iamVjdC5lYWNoKHtcbiAgICAgICAga2V5OiAxXG4gICAgfSwgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICBjb25zb2xlLmxvZyh2YWx1ZSArIGtleSArIHRoaXMudmFsKVxuICAgIH0sIHRoaXNBcmcpXG4gICAgXG4gICAgPjFrZXkxIFxuIFxuICogQHBhcmFtICB7T2JqZWN0fSAgIG9iaiAgdGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXJcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmbiAgIHRoZSBmdW5jdGlvbiB0byBjYWxsXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGZuLmtleSAgIHRoZSBvYmplY3Qga2V5XG4gKiBAcGFyYW0gIHtPYmplY3R9IGZuLnZhbHVlICAgdGhlIG9iamVjdCB2YWx1ZVxuICogQHBhcmFtICB7T2JqZWN0fSAgIFt0aGlzQXJnXSBcbiAqIEBwYXJhbSB7T2JqZWN0fSAgW2NvbmZpZ11cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gIGNvbmZpZy5vd25Qcm9wZXJ0aWVzIHNldCB0byBmYWxzZVxuICogdG8gaXRlcmF0ZSBvdmVyIGFsbCBvZiB0aGUgb2JqZWN0cyBlbnVtZXJhYmxlIHByb3BlcnRpZXMuXG4gKi9cbmV4cG9ydHMuZWFjaCA9IGZ1bmN0aW9uKG9iaiwgZm4sIHRoaXNBcmcsIGNvbmZpZykge1xuICAgIHZhciBrZXksIHZhbHVlLFxuICAgICAgICBhbGxQcm9wZXJ0aWVzID0gY29uZmlnICYmIGNvbmZpZy5vd25Qcm9wZXJ0aWVzID09PSBmYWxzZTtcblxuICAgIGlmIChhbGxQcm9wZXJ0aWVzKSB7XG4gICAgICAgIGZvciAoa2V5IGluIG9iaikge1xuICAgICAgICAgICAgZm4uY2FsbCh0aGlzQXJnLCBrZXksIG9ialtrZXldKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAoa2V5IGluIG9iaikge1xuICAgICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgZm4uY2FsbCh0aGlzQXJnLCBrZXksIG9ialtrZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8qKlxuICogVGFrZSBhbiBhcnJheSBvZiBzdHJpbmdzIGFuZCBhbiBhcnJheS9hcmd1bWVudHMgb2ZcbiAqIHZhbHVlcyBhbmQgcmV0dXJuIGFuIG9iamVjdCBvZiBrZXkgdmFsdWUgcGFpcnNcbiAqIGJhc2VkIG9mZiBlYWNoIGFycmF5cyBpbmRleC4gIEl0IGlzIHVzZWZ1bCBmb3IgdGFraW5nXG4gKiBhIGxvbmcgbGlzdCBvZiBhcmd1bWVudHMgYW5kIGNyZWF0aW5nIGFuIG9iamVjdCB0aGF0IGNhblxuICogYmUgcGFzc2VkIHRvIG90aGVyIG1ldGhvZHMuXG4gKiBcbiAgICBmdW5jdGlvbiBsb25nQXJncyhhLGIsYyxkLGUsZikge1xuICAgICAgICByZXR1cm4gTHVjLk9iamVjdC50b09iamVjdChbJ2EnLCdiJywgJ2MnLCAnZCcsICdlJywgJ2YnXSwgYXJndW1lbnRzKVxuICAgIH1cblxuICAgIGxvbmdBcmdzKDEsMiwzLDQsNSw2LDcsOCw5KVxuXG4gICAgPk9iamVjdCB7YTogMSwgYjogMiwgYzogMywgZDogNCwgZTogNeKApn1cbiAgICBhOiAxXG4gICAgYjogMlxuICAgIGM6IDNcbiAgICBkOiA0XG4gICAgZTogNVxuICAgIGY6IDZcblxuICAgIGxvbmdBcmdzKDEsMiwzKVxuXG4gICAgPk9iamVjdCB7YTogMSwgYjogMiwgYzogMywgZDogdW5kZWZpbmVkLCBlOiB1bmRlZmluZWTigKZ9XG4gICAgYTogMVxuICAgIGI6IDJcbiAgICBjOiAzXG4gICAgZDogdW5kZWZpbmVkXG4gICAgZTogdW5kZWZpbmVkXG4gICAgZjogdW5kZWZpbmVkXG5cbiAqIEBwYXJhbSAge1N0cmluZ1tdfSBzdHJpbmdzXG4gKiBAcGFyYW0gIHtBcnJheS9hcmd1bWVudHN9IHZhbHVlc1xuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5leHBvcnRzLnRvT2JqZWN0ID0gZnVuY3Rpb24oc3RyaW5ncywgdmFsdWVzKSB7XG4gICAgdmFyIG9iaiA9IHt9LFxuICAgICAgICBpID0gMCxcbiAgICAgICAgbGVuID0gc3RyaW5ncy5sZW5ndGg7XG4gICAgZm9yICg7IGkgPCBsZW47ICsraSkge1xuICAgICAgICBvYmpbc3RyaW5nc1tpXV0gPSB2YWx1ZXNbaV07XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iajtcbn07XG5cbi8qKlxuICogUmV0dXJuIGtleSB2YWx1ZSBwYWlycyBmcm9tIHRoZSBvYmplY3QgaWYgdGhlXG4gKiBmaWx0ZXJGbiByZXR1cm5zIGEgdHJ1dGh5IHZhbHVlLlxuICpcbiAgICBMdWMuT2JqZWN0LmZpbHRlcih7XG4gICAgICAgIGE6IGZhbHNlLFxuICAgICAgICBiOiB0cnVlLFxuICAgICAgICBjOiBmYWxzZVxuICAgIH0sIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGtleSA9PT0gJ2EnIHx8IHZhbHVlXG4gICAgfSlcbiAgICA+W3trZXk6ICdhJywgdmFsdWU6IGZhbHNlfSwge2tleTogJ2InLCB2YWx1ZTogdHJ1ZX1dXG5cbiAgICBMdWMuT2JqZWN0LmZpbHRlcih7XG4gICAgICAgIGE6IGZhbHNlLFxuICAgICAgICBiOiB0cnVlLFxuICAgICAgICBjOiBmYWxzZVxuICAgIH0sIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGtleSA9PT0gJ2EnIHx8IHZhbHVlXG4gICAgfSwgdW5kZWZpbmVkLCB7XG4gICAgICAgIGtleXM6IHRydWVcbiAgICB9KVxuICAgID5bJ2EnLCAnYiddXG4gKiBcbiAqIEBwYXJhbSAge09iamVjdH0gICBvYmogIHRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gZmlsdGVyRm4gICB0aGUgZnVuY3Rpb24gdG8gY2FsbCwgcmV0dXJuIGEgdHJ1dGh5IHZhbHVlXG4gKiB0byBhZGQgdGhlIGtleSB2YWx1ZSBwYWlyXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGZpbHRlckZuLmtleSAgIHRoZSBvYmplY3Qga2V5XG4gKiBAcGFyYW0gIHtPYmplY3R9IGZpbHRlckZuLnZhbHVlICAgdGhlIG9iamVjdCB2YWx1ZVxuICogQHBhcmFtICB7T2JqZWN0fSAgIFt0aGlzQXJnXSBcbiAqIEBwYXJhbSB7T2JqZWN0fSAgW2NvbmZpZ11cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gIGNvbmZpZy5vd25Qcm9wZXJ0aWVzIHNldCB0byBmYWxzZVxuICogdG8gaXRlcmF0ZSBvdmVyIGFsbCBvZiB0aGUgb2JqZWN0cyBlbnVtZXJhYmxlIHByb3BlcnRpZXMuXG4gKiBcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gIGNvbmZpZy5rZXlzIHNldCB0byB0cnVlIHRvIHJldHVyblxuICoganVzdCB0aGUga2V5cy5cbiAqXG4gKiBAcGFyYW0ge0Jvb2xlYW59ICBjb25maWcudmFsdWVzIHNldCB0byB0cnVlIHRvIHJldHVyblxuICoganVzdCB0aGUgdmFsdWVzLlxuICogXG4gKiBAcmV0dXJuIHtPYmplY3RbXS9TdHJpbmdbXX0gQXJyYXkgb2Yga2V5IHZhbHVlIHBhaXJzIGluIHRoZSBmb3JtXG4gKiBvZiB7a2V5OiAna2V5JywgdmFsdWU6IHZhbHVlfS4gIElmIGtleXMgb3IgdmFsdWVzIGlzIHRydWUgb24gdGhlIGNvbmZpZ1xuICoganVzdCB0aGUga2V5cyBvciB2YWx1ZXMgYXJlIHJldHVybmVkLlxuICpcbiAqL1xuZXhwb3J0cy5maWx0ZXIgPSBmdW5jdGlvbihvYmosIGZpbHRlckZuLCB0aGlzQXJnLCBjKSB7XG4gICAgdmFyIHZhbHVlcyA9IFtdLFxuICAgICAgICBjb25maWcgPSBjIHx8IHt9O1xuXG4gICAgZXhwb3J0cy5lYWNoKG9iaiwgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICBpZiAoZmlsdGVyRm4uY2FsbCh0aGlzQXJnLCBrZXksIHZhbHVlKSkge1xuICAgICAgICAgICAgaWYgKGNvbmZpZy5rZXlzID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgdmFsdWVzLnB1c2goa2V5KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29uZmlnLnZhbHVlcyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHZhbHVlcy5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFsdWVzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIGtleToga2V5XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCB0aGlzQXJnLCBjb25maWcpO1xuXG4gICAgcmV0dXJuIHZhbHVlcztcbn07IiwidmFyIG9Ub1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG4vKipcbiAqIEBjbGFzcyBMdWMuaXMgXG4gKiBUaGlzIGFjdHVhbGx5IGFwYXJ0IG9mIHRoZSBMdWMgbmFtZXNwYWNlLCBub3QgTHVjLmlzLmlzRW1wdHkuICAgUGFja2FnZSBmb3IgXG4gKiBkZXRlcm1pbmluZyB0aGUgdHlwZXMgb2Ygb2JqZWN0cyBpdCBhbHNvIGhhcyBhbiBMdWMuaXNFbXB0eSBhbmQgTHVjLmlzRmFsc3kgZnVuY3Rpb25zLlxuICogWW91IGNhbiBzZWUgdGhhdCB3ZSBkb24ndCBoYXZlIGFuIFxuICogaXNOdWxsIGlzVW5kZWZpbmVkIG9yIGlzTmFOLiAgV2UgcHJlZmVyIHRvIHVzZTpcbiBcbiAgICBvYmogPT09IG51bGxcbiAgICBvYmogPT09IHVuZGVmaW5lZFxuICAgIGlzTmFOKG9iailcblxuICogSSdtIHN1cmUgdGhlcmUgYSBpcyBhIHVzZSBjYXNlIGZvciBpc0Jvb2xlYW5cbiAqIGJ1dCB3ZSB3aWxsIGxlYXZlIHlvdSBvbiB5b3VyIG93biBmb3IgdGhhdC5cbiAqL1xuXG5cbi8qKlxuICogUmV0dXJuIHRydWUgaWYgdGhlIHBhc3NlZCBpbiBvYmplY3QgaXMgb2ZcbiAqIHRoZSB0eXBlIHtAbGluayBBcnJheSBBcnJheX1cbiAqIEBwYXJhbSAge09iamVjdH0gIG9iaiBcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXkob2JqKSB7XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkob2JqKTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgcGFzc2VkIGluIG9iamVjdCBpcyBvZlxuICogdGhlIHR5cGUge0BsaW5rIE9iamVjdCBPYmplY3R9XG4gKiBAcGFyYW0gIHtPYmplY3R9ICBvYmogXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5mdW5jdGlvbiBpc09iamVjdChvYmopIHtcbiAgICByZXR1cm4gb1RvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSc7XG59XG5cbi8qKlxuICogUmV0dXJuIHRydWUgaWYgdGhlIHBhc3NlZCBpbiBvYmplY3QgaXMgb2ZcbiAqIHRoZSB0eXBlIHtAbGluayBGdW5jdGlvbiBGdW5jdGlvbn1cbiAqIEBwYXJhbSAge09iamVjdH0gIG9iaiBcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9Ub1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG59XG5cbi8qKlxuICogUmV0dXJuIHRydWUgaWYgdGhlIHBhc3NlZCBpbiBvYmplY3QgaXMgb2ZcbiAqIHRoZSB0eXBlIHtAbGluayBEYXRlIERhdGV9XG4gKiBAcGFyYW0gIHtPYmplY3R9ICBvYmogXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5mdW5jdGlvbiBpc0RhdGUob2JqKSB7XG4gICAgcmV0dXJuIG9Ub1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cblxuLyoqXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgcGFzc2VkIGluIG9iamVjdCBpcyBvZlxuICogdGhlIHR5cGUge0BsaW5rIFJlZ0V4cCBSZWdFeHB9XG4gKiBAcGFyYW0gIHtPYmplY3R9ICBvYmogXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5mdW5jdGlvbiBpc1JlZ0V4cChvYmopIHtcbiAgICByZXR1cm4gb1RvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgUmVnRXhwXSc7XG59XG5cbi8qKlxuICogUmV0dXJuIHRydWUgaWYgdGhlIHBhc3NlZCBpbiBvYmplY3QgaXMgb2ZcbiAqIHRoZSB0eXBlIHtAbGluayBOdW1iZXIgTnVtYmVyfVxuICogQHBhcmFtICB7T2JqZWN0fSAgb2JqIFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNOdW1iZXIob2JqKSB7XG4gICAgcmV0dXJuIG9Ub1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IE51bWJlcl0nO1xufVxuXG4vKipcbiAqIFJldHVybiB0cnVlIGlmIHRoZSBwYXNzZWQgaW4gb2JqZWN0IGlzIG9mXG4gKiB0aGUgdHlwZSB7QGxpbmsgU3RyaW5nIFN0cmluZ31cbiAqIEBwYXJhbSAge09iamVjdH0gIG9iaiBcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzU3RyaW5nKG9iaikge1xuICAgIHJldHVybiBvVG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBTdHJpbmddJztcbn1cblxuLyoqXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgcGFzc2VkIGluIG9iamVjdCBpcyBvZlxuICogdGhlIHR5cGUgYXJndW1lbnRzLlxuICogXG4gKiBAcGFyYW0gIHtPYmplY3R9ICBvYmogXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5mdW5jdGlvbiBpc0FyZ3VtZW50cyhvYmopIHtcbiAgICByZXR1cm4gb1RvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJndW1lbnRzXSc7XG59XG5cbi8qKlxuICogUmV0dXJuIHRydWUgaWYgdGhlIG9iamVjdCBpcyBmYWxzeSBidXQgbm90IHplcm8uICBJZlxuICogeW91IHdhbnQgZmFsc3kgY2hlY2sgdGhhdCBpbmNsdWRlcyB6ZXJvIHVzZSBhIGdvcmFtIFxuICogaWYgc3RhdGVtZW50IDopXG4gKiBAcGFyYW0gIHtPYmplY3R9ICBvYmpcbiAqIEByZXR1cm4ge0Jvb2xlYW59ICAgICBcbiAqL1xuZnVuY3Rpb24gaXNGYWxzeShvYmopIHtcbiAgICByZXR1cm4gKCFvYmogJiYgb2JqICE9PSAwKTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgb2JqZWN0IGlzIGVtcHR5LlxuICoge30sIFtdLCAnJyxmYWxzZSwgbnVsbCwgdW5kZWZpbmVkLCBOYU4gXG4gKiBBcmUgYWxsIHRyZWF0ZWQgYXMgZW1wdHkuXG4gKiBAcGFyYW0gIHtPYmplY3R9ICBvYmpcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzRW1wdHkob2JqKSB7XG4gICAgdmFyIGVtcHR5ID0gZmFsc2U7XG5cbiAgICBpZiAoaXNGYWxzeShvYmopKSB7XG4gICAgICAgIGVtcHR5ID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXkob2JqKSkge1xuICAgICAgICBlbXB0eSA9IG9iai5sZW5ndGggPT09IDA7XG4gICAgfSBlbHNlIGlmIChpc09iamVjdChvYmopKSB7XG4gICAgICAgIGVtcHR5ID0gT2JqZWN0LmtleXMob2JqKS5sZW5ndGggPT09IDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVtcHR5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBpc0FycmF5OiBpc0FycmF5LFxuICAgIGlzT2JqZWN0OiBpc09iamVjdCxcbiAgICBpc0Z1bmN0aW9uOiBpc0Z1bmN0aW9uLFxuICAgIGlzRGF0ZTogaXNEYXRlLFxuICAgIGlzU3RyaW5nOiBpc1N0cmluZyxcbiAgICBpc051bWJlcjogaXNOdW1iZXIsXG4gICAgaXNSZWdFeHA6IGlzUmVnRXhwLFxuICAgIGlzQXJndW1lbnRzOiBpc0FyZ3VtZW50cyxcbiAgICBpc0ZhbHN5OiBpc0ZhbHN5LFxuICAgIGlzRW1wdHk6IGlzRW1wdHlcbn07IiwiLyoqXG4gKiBAbGljZW5zZSBodHRwczovL3Jhdy5naXRodWIuY29tL2pveWVudC9ub2RlL3YwLjEwLjExL0xJQ0VOU0VcbiAqIE5vZGUganMgbGljZW5zZS4gRXZlbnRFbWl0dGVyIHdpbGwgYmUgaW4gdGhlIGNsaWVudFxuICogb25seSBjb2RlLlxuICovXG5cbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG5cbi8qKlxuICogQGNsYXNzIEx1Yy5FdmVudEVtaXR0ZXJcbiAqIFRoZSB3b25kZXJmdWwgZXZlbnQgZW1taXRlciB0aGF0IGNvbWVzIHdpdGggbm9kZSxcbiAqIHRoYXQgd29ya3MgaW4gdGhlIHN1cHBvcnRlZCBicm93c2Vycy5cbiAqIFtodHRwOi8vbm9kZWpzLm9yZy9hcGkvZXZlbnRzLmh0bWxdKGh0dHA6Ly9ub2RlanMub3JnL2FwaS9ldmVudHMuaHRtbClcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgICAvL3B1dCBpbiBmaXggZm9yIElFIDkgYW5kIGJlbG93XG4gICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICBnID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzZWxmLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuICAgICAgICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcblxuICAgIHNlbGYub24odHlwZSwgZyk7XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyOyIsInZhciBpZHMgPSB7fTtcbi8qKlxuICogQG1lbWJlciBMdWNcbiAqIEBtZXRob2QgaWRcbiAqIFxuICogUmV0dXJuIGEgdW5pcXVlIGlkLlxuICogQHBhcmFtIHtTdHJpbmd9IFtwcmVmaXhdIE9wdGlvbiBwcmVmaXggdG8gdXNlXG4gKlxuICpcbiAgICAgICAgTHVjLmlkKClcbiAgICAgICAgPlwibHVjLTBcIlxuICAgICAgICBMdWMuaWQoKVxuICAgICAgICA+XCJsdWMtMVwiXG4gICAgICAgIEx1Yy5pZCgnbXktcHJlZml4JylcbiAgICAgICAgPlwibXktcHJlZml4MFwiXG4gICAgICAgIEx1Yy5pZCgnJylcbiAgICAgICAgPlwiMFwiXG4gKlxuICogQHJldHVybiB7U3RyaW5nfVxuICpcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihwKSB7XG4gICAgdmFyIHByZWZpeCA9IHAgPT09IHVuZGVmaW5lZCA/ICdsdWMtJyA6IHA7XG5cbiAgICBpZihpZHNbcHJlZml4XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlkc1twcmVmaXhdID0gMDtcbiAgICB9XG5cbiAgICByZXR1cm4gcHJlZml4ICsgaWRzW3ByZWZpeF0rKztcbn07IiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxucHJvY2Vzcy5uZXh0VGljayA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhblNldEltbWVkaWF0ZSA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnNldEltbWVkaWF0ZTtcbiAgICB2YXIgY2FuUG9zdCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnBvc3RNZXNzYWdlICYmIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyXG4gICAgO1xuXG4gICAgaWYgKGNhblNldEltbWVkaWF0ZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIHdpbmRvdy5zZXRJbW1lZGlhdGUoZikgfTtcbiAgICB9XG5cbiAgICBpZiAoY2FuUG9zdCkge1xuICAgICAgICB2YXIgcXVldWUgPSBbXTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIGlmIChldi5zb3VyY2UgPT09IHdpbmRvdyAmJiBldi5kYXRhID09PSAncHJvY2Vzcy10aWNrJykge1xuICAgICAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGlmIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmbiA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgICAgIHF1ZXVlLnB1c2goZm4pO1xuICAgICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKCdwcm9jZXNzLXRpY2snLCAnKicpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICBzZXRUaW1lb3V0KGZuLCAwKTtcbiAgICB9O1xufSkoKTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufVxuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG4iLCIoZnVuY3Rpb24ocHJvY2Vzcyl7aWYgKCFwcm9jZXNzLkV2ZW50RW1pdHRlcikgcHJvY2Vzcy5FdmVudEVtaXR0ZXIgPSBmdW5jdGlvbiAoKSB7fTtcblxudmFyIEV2ZW50RW1pdHRlciA9IGV4cG9ydHMuRXZlbnRFbWl0dGVyID0gcHJvY2Vzcy5FdmVudEVtaXR0ZXI7XG52YXIgaXNBcnJheSA9IHR5cGVvZiBBcnJheS5pc0FycmF5ID09PSAnZnVuY3Rpb24nXG4gICAgPyBBcnJheS5pc0FycmF5XG4gICAgOiBmdW5jdGlvbiAoeHMpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4cykgPT09ICdbb2JqZWN0IEFycmF5XSdcbiAgICB9XG47XG5mdW5jdGlvbiBpbmRleE9mICh4cywgeCkge1xuICAgIGlmICh4cy5pbmRleE9mKSByZXR1cm4geHMuaW5kZXhPZih4KTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHhzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh4ID09PSB4c1tpXSkgcmV0dXJuIGk7XG4gICAgfVxuICAgIHJldHVybiAtMTtcbn1cblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhblxuLy8gMTAgbGlzdGVuZXJzIGFyZSBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoXG4vLyBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbi8vXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxudmFyIGRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIXRoaXMuX2V2ZW50cykgdGhpcy5fZXZlbnRzID0ge307XG4gIHRoaXMuX2V2ZW50cy5tYXhMaXN0ZW5lcnMgPSBuO1xufTtcblxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc0FycmF5KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKVxuICAgIHtcbiAgICAgIGlmIChhcmd1bWVudHNbMV0gaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBhcmd1bWVudHNbMV07IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmNhdWdodCwgdW5zcGVjaWZpZWQgJ2Vycm9yJyBldmVudC5cIik7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpIHJldHVybiBmYWxzZTtcbiAgdmFyIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGlmICghaGFuZGxlcikgcmV0dXJuIGZhbHNlO1xuXG4gIGlmICh0eXBlb2YgaGFuZGxlciA9PSAnZnVuY3Rpb24nKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG5cbiAgfSBlbHNlIGlmIChpc0FycmF5KGhhbmRsZXIpKSB7XG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gICAgdmFyIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGxpc3RlbmVycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG5cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG5cbi8vIEV2ZW50RW1pdHRlciBpcyBkZWZpbmVkIGluIHNyYy9ub2RlX2V2ZW50cy5jY1xuLy8gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0KCkgaXMgYWxzbyBkZWZpbmVkIHRoZXJlLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICgnZnVuY3Rpb24nICE9PSB0eXBlb2YgbGlzdGVuZXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2FkZExpc3RlbmVyIG9ubHkgdGFrZXMgaW5zdGFuY2VzIG9mIEZ1bmN0aW9uJyk7XG4gIH1cblxuICBpZiAoIXRoaXMuX2V2ZW50cykgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PSBcIm5ld0xpc3RlbmVyc1wiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lcnNcIi5cbiAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSkge1xuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICB9IGVsc2UgaWYgKGlzQXJyYXkodGhpcy5fZXZlbnRzW3R5cGVdKSkge1xuXG4gICAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICAgIHZhciBtO1xuICAgICAgaWYgKHRoaXMuX2V2ZW50cy5tYXhMaXN0ZW5lcnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBtID0gdGhpcy5fZXZlbnRzLm1heExpc3RlbmVycztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG0gPSBkZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgICAgfVxuXG4gICAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICB9IGVsc2Uge1xuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgc2VsZi5vbih0eXBlLCBmdW5jdGlvbiBnKCkge1xuICAgIHNlbGYucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG4gICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCdmdW5jdGlvbicgIT09IHR5cGVvZiBsaXN0ZW5lcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncmVtb3ZlTGlzdGVuZXIgb25seSB0YWtlcyBpbnN0YW5jZXMgb2YgRnVuY3Rpb24nKTtcbiAgfVxuXG4gIC8vIGRvZXMgbm90IHVzZSBsaXN0ZW5lcnMoKSwgc28gbm8gc2lkZSBlZmZlY3Qgb2YgY3JlYXRpbmcgX2V2ZW50c1t0eXBlXVxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKSByZXR1cm4gdGhpcztcblxuICB2YXIgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNBcnJheShsaXN0KSkge1xuICAgIHZhciBpID0gaW5kZXhPZihsaXN0LCBsaXN0ZW5lcik7XG4gICAgaWYgKGkgPCAwKSByZXR1cm4gdGhpcztcbiAgICBsaXN0LnNwbGljZShpLCAxKTtcbiAgICBpZiAobGlzdC5sZW5ndGggPT0gMClcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIH0gZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdID09PSBsaXN0ZW5lcikge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZG9lcyBub3QgdXNlIGxpc3RlbmVycygpLCBzbyBubyBzaWRlIGVmZmVjdCBvZiBjcmVhdGluZyBfZXZlbnRzW3R5cGVdXG4gIGlmICh0eXBlICYmIHRoaXMuX2V2ZW50cyAmJiB0aGlzLl9ldmVudHNbdHlwZV0pIHRoaXMuX2V2ZW50c1t0eXBlXSA9IG51bGw7XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIGlmICghdGhpcy5fZXZlbnRzKSB0aGlzLl9ldmVudHMgPSB7fTtcbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFtdO1xuICBpZiAoIWlzQXJyYXkodGhpcy5fZXZlbnRzW3R5cGVdKSkge1xuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICB9XG4gIHJldHVybiB0aGlzLl9ldmVudHNbdHlwZV07XG59O1xuXG59KShyZXF1aXJlKFwiX19icm93c2VyaWZ5X3Byb2Nlc3NcIikpIiwicmVxdWlyZSgnLi9ub2RlX21vZHVsZXMvZXM1LXNoaW0vZXM1LXNoaW0nKTtcbnJlcXVpcmUoJy4vbm9kZV9tb2R1bGVzL2VzNS1zaGltL2VzNS1zaGFtJyk7IiwidmFyIGlzID0gcmVxdWlyZSgnLi9pcycpLFxuICAgIGFJbnNlcnQgPSByZXF1aXJlKCcuL2FycmF5JykuaW5zZXJ0O1xuICAgIGFFYWNoID0gcmVxdWlyZSgnLi9hcnJheScpLmVhY2g7XG5cbi8qKlxuICogQGNsYXNzIEx1Yy5GdW5jdGlvblxuICogUGFja2FnZSBmb3IgZnVuY3Rpb24gbWV0aG9kcy5cbiAqL1xuXG5mdW5jdGlvbiBhdWdtZW50QXJncyhjb25maWcsIGNhbGxBcmdzKSB7XG4gICAgdmFyIGNvbmZpZ0FyZ3MgPSBjb25maWcuYXJncyxcbiAgICAgICAgaW5kZXggPSBjb25maWcuaW5kZXgsXG4gICAgICAgIGFyZ3NBcnJheTtcblxuICAgIGlmICghY29uZmlnQXJncykge1xuICAgICAgICByZXR1cm4gY2FsbEFyZ3M7XG4gICAgfVxuXG4gICAgaWYoaW5kZXggPT09IHRydWUgfHwgaXMuaXNOdW1iZXIoaW5kZXgpKSB7XG4gICAgICAgIGlmKGNvbmZpZy5hcmd1bWVudHNGaXJzdCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBhSW5zZXJ0KGNvbmZpZ0FyZ3MsIGNhbGxBcmdzLCBpbmRleCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFJbnNlcnQoY2FsbEFyZ3MsIGNvbmZpZ0FyZ3MsIGluZGV4KTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29uZmlnQXJncztcbn1cblxuLyoqXG4gKiBBIHJldXNhYmxlIGVtcHR5IGZ1bmN0aW9uXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZXhwb3J0cy5lbXB0eUZuID0gZnVuY3Rpb24oKSB7fTtcblxuLyoqXG4gKiBBIGZ1bmN0aW9uIHRoYXQgdGhyb3dzIGFuIGVycm9yIHdoZW4gY2FsbGVkLlxuICogVXNlZnVsIHdoZW4gZGVmaW5pbmcgYWJzdHJhY3QgbGlrZSBjbGFzc2VzXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZXhwb3J0cy5hYnN0cmFjdEZuID0gZnVuY3Rpb24oKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdhYnN0cmFjdEZuIG11c3QgYmUgaW1wbGVtZW50ZWQnKTtcbn07XG5cbi8qKlxuICogQXVnbWVudCB0aGUgcGFzc2VkIGluIGZ1bmN0aW9uJ3MgdGhpc0FyZyBhbmQgb3IgYWd1bWVudHMgb2JqZWN0IFxuICogYmFzZWQgb24gdGhlIHBhc3NlZCBpbiBjb25maWcuXG4gKiBcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmbiB0aGUgZnVuY3Rpb24gdG8gY2FsbFxuICogQHBhcmFtICB7T2JqZWN0fSBjb25maWdcbiAqIFxuICogQHBhcmFtIHtPYmplY3R9IFtjb25maWcudGhpc0FyZ10gdGhlIHRoaXNBcmcgZm9yIHRoZSBmdW5jdGlvbiBiZWluZyBleGVjdXRlZC5cbiAqIElmIHRoaXMgaXMgdGhlIG9ubHkgcHJvcGVydHkgb24geW91ciBjb25maWcgb2JqZWN0IHRoZSBwcmVmZXJyZWQgd2F5IHdvdWxkXG4gKiBiZSBqdXN0IHRvIHVzZSBGdW5jdGlvbi5iaW5kXG4gKiBcbiAqIEBwYXJhbSB7QXJyYXl9IFtjb25maWcuYXJnc10gdGhlIGFyZ3VtZW50cyB1c2VkIGZvciB0aGUgZnVuY3Rpb24gYmVpbmcgZXhlY3V0ZWQuXG4gKiBUaGlzIHdpbGwgcmVwbGFjZSB0aGUgZnVuY3Rpb25zIGNhbGwgYXJncyBpZiBpbmRleCBpcyBub3QgYSBudW1iZXIgb3IgXG4gKiB0cnVlLlxuICogXG4gKiBAcGFyYW0ge051bWJlci9UcnVlfSBbY29uZmlnLmluZGV4XSBCeSBkZWZhdWx0IHRoZSB0aGUgY29uZmlndXJlZCBhcmd1bWVudHNcbiAqIHdpbGwgYmUgaW5zZXJ0ZWQgaW50byB0aGUgZnVuY3Rpb25zIHBhc3NlZCBpbiBjYWxsIGFyZ3VtZW50cy4gIElmIGluZGV4IGlzIHRydWVcbiAqIGFwcGVuZCB0aGUgYXJncyB0b2dldGhlciBpZiBpdCBpcyBhIG51bWJlciBpbnNlcnQgaXQgYXQgdGhlIHBhc3NlZCBpbiBpbmRleC5cbiAqIFxuICogQHBhcmFtIHtBcnJheX0gW2NvbmZpZy5hcmd1bWVudHNGaXJzdF0gcGFzcyBpbiBmYWxzZSB0byBcbiAqIGF1Z21lbnQgdGhlIGNvbmZpZ3VyZWQgYXJncyBmaXJzdCB3aXRoIEx1Yy5BcnJheS5pbnNlcnQuICBEZWZhdWx0c1xuICogdG8gdHJ1ZVxuICAgICBcbiAgICAgZnVuY3Rpb24gZm4oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMpXG4gICAgICAgIGNvbnNvbGUubG9nKGFyZ3VtZW50cylcbiAgICB9XG5cbiAgICBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudGVyKGZuLCB7XG4gICAgICAgIHRoaXNBcmc6IHtjb25maWdlZFRoaXNBcmc6IHRydWV9LFxuICAgICAgICBhcmdzOiBbMSwyLDNdLFxuICAgICAgICBpbmRleDowXG4gICAgfSkoNClcblxuICAgID5PYmplY3Qge2NvbmZpZ2VkVGhpc0FyZzogdHJ1ZX1cbiAgICA+WzEsIDIsIDMsIDRdXG5cbiAgICBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudGVyKGZuLCB7XG4gICAgICAgIHRoaXNBcmc6IHtjb25maWdlZFRoaXNBcmc6IHRydWV9LFxuICAgICAgICBhcmdzOiBbMSwyLDNdLFxuICAgICAgICBpbmRleDowLFxuICAgICAgICBhcmd1bWVudHNGaXJzdDpmYWxzZVxuICAgIH0pKDQpXG5cbiAgICA+T2JqZWN0IHtjb25maWdlZFRoaXNBcmc6IHRydWV9XG4gICAgPls0LCAxLCAyLCAzXVxuXG5cbiAgICB2YXIgZiA9IEx1Yy5GdW5jdGlvbi5jcmVhdGVBdWdtZW50ZXIoZm4sIHtcbiAgICAgICAgYXJnczogWzEsMiwzXSxcbiAgICAgICAgaW5kZXg6IHRydWVcbiAgICB9KTtcblxuICAgIGYuYXBwbHkoe2NvbmZpZzogZmFsc2V9LCBbNF0pXG5cbiAgICA+T2JqZWN0IHtjb25maWc6IGZhbHNlfVxuICAgID5bNCwgMSwgMiwgM11cblxuICogQHJldHVybiB7RnVuY3Rpb259IHRoZSBhdWdtZW50ZWQgZnVuY3Rpb24uXG4gKi9cbmV4cG9ydHMuY3JlYXRlQXVnbWVudGVyID0gZnVuY3Rpb24oZm4sIGNvbmZpZykge1xuICAgIHZhciB0aGlzQXJnID0gY29uZmlnLnRoaXNBcmc7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzQXJnIHx8IHRoaXMsIGF1Z21lbnRBcmdzKGNvbmZpZywgYXJndW1lbnRzKSk7XG4gICAgfTtcbn07XG5cbmZ1bmN0aW9uIGluaXRTZXF1ZW5jZUZ1bmN0aW9ucyhmbnMsIGNvbmZpZykge1xuICAgIHZhciB0b1J1biA9IFtdO1xuICAgIGFFYWNoKGZucywgZnVuY3Rpb24oZikge1xuICAgICAgICB2YXIgZm4gPSBmO1xuXG4gICAgICAgIGlmIChjb25maWcpIHtcbiAgICAgICAgICAgIGZuID0gZXhwb3J0cy5jcmVhdGVBdWdtZW50ZXIoZiwgY29uZmlnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRvUnVuLnB1c2goZm4pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRvUnVuO1xufVxuXG4vKipcbiAqIFJldHVybiBhIGZ1bmN0aW9uIHRoYXQgcnVucyB0aGUgcGFzc2VkIGluIGZ1bmN0aW9uc1xuICogYW5kIHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgbGFzdCBmdW5jdGlvbiBjYWxsZWQuXG4gKiBcbiAqIEBwYXJhbSAge0Z1bmN0aW9uL0Z1bmN0aW9uW119IGZucyBcbiAqIEBwYXJhbSAge09iamVjdH0gW2NvbmZpZ10gQ29uZmlnIG9iamVjdFxuICogZm9yIEx1Yy5GdW5jdGlvbi5jcmVhdGVBdWdtZW50ZXIuICBJZiBkZWZpbmVkIGFsbCBvZiB0aGUgZnVuY3Rpb25zXG4gKiB3aWxsIGdldCBjcmVhdGVkIHdpdGggdGhlIHBhc3NlZCBpbiBjb25maWc7XG4gKlxuICAgIEx1Yy5GdW5jdGlvbi5jcmVhdGVTZXF1ZW5jZShbXG4gICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coMSlcbiAgICAgICAgfSxcbiAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygyKVxuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKDMpXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZmluaXNoZWQgbG9nZ2luZycpXG4gICAgICAgICAgICByZXR1cm4gNDtcbiAgICAgICAgfVxuICAgIF0pKClcbiAgICA+MVxuICAgID4yXG4gICAgPjNcbiAgICA+ZmluaXNoZWQgbG9nZ2luZ1xuICAgID40XG4gKiBcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5leHBvcnRzLmNyZWF0ZVNlcXVlbmNlID0gZnVuY3Rpb24oZm5zLCBjb25maWcpIHtcbiAgICB2YXIgZnVuY3Rpb25zID0gaW5pdFNlcXVlbmNlRnVuY3Rpb25zKGZucywgY29uZmlnKTtcblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGkgPSAwLFxuICAgICAgICAgICAgbGVuID0gZnVuY3Rpb25zLmxlbmd0aDtcblxuICAgICAgICBmb3IoO2kgPCBsZW4gLTE7ICsraSkge1xuICAgICAgICAgICAgZnVuY3Rpb25zW2ldLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZnVuY3Rpb25zW2xlbiAtMSBdLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbn07XG5cbi8qKlxuICogUmV0dXJuIGEgZnVuY3Rpb24gdGhhdCBydW5zIHRoZSBwYXNzZWQgaW4gZnVuY3Rpb25zXG4gKiBpZiBvbmUgb2YgdGhlIGZ1bmN0aW9ucyByZXN1bHRzIGZhbHNlIHRoZSByZXN0IG9mIHRoZSBcbiAqIGZ1bmN0aW9ucyB3b24ndCBydW4gYW5kIGZhbHNlIHdpbGwgYmUgcmV0dXJuZWQuXG4gKlxuICogSWYgbm8gZmFsc2UgaXMgcmV0dXJuZWQgdGhlIHZhbHVlIG9mIHRoZSBsYXN0IGZ1bmN0aW9uIHJldHVybiB3aWxsIGJlIHJldHVybmVkXG4gKiBcbiAqIEBwYXJhbSAge0Z1bmN0aW9uL0Z1bmN0aW9uW119IGZucyBcbiAqIEBwYXJhbSAge09iamVjdH0gW2NvbmZpZ10gQ29uZmlnIG9iamVjdFxuICogZm9yIEx1Yy5GdW5jdGlvbi5jcmVhdGVBdWdtZW50ZXIuICBJZiBkZWZpbmVkIGFsbCBvZiB0aGUgZnVuY3Rpb25zXG4gKiB3aWxsIGdldCBjcmVhdGVkIHdpdGggdGhlIHBhc3NlZCBpbiBjb25maWc7XG5cbiAgICBMdWMuRnVuY3Rpb24uY3JlYXRlU2VxdWVuY2VJZihbXG4gICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coMSlcbiAgICAgICAgfSxcbiAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygyKVxuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKDMpXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZmluaXNoZWQgbG9nZ2luZycpXG4gICAgICAgICAgICByZXR1cm4gNDtcbiAgICAgICAgfSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2kgY2FudCBsb2cnKVxuICAgICAgICB9XG4gICAgXSkoKVxuXG4gICAgPjFcbiAgICA+MlxuICAgID4zXG4gICAgPmZpbmlzaGVkIGxvZ2dpbmdcbiAgICA+ZmFsc2VcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5leHBvcnRzLmNyZWF0ZVNlcXVlbmNlSWYgPSBmdW5jdGlvbihmbnMsIGNvbmZpZykge1xuICAgIHZhciBmdW5jdGlvbnMgPSBpbml0U2VxdWVuY2VGdW5jdGlvbnMoZm5zLCBjb25maWcpO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdmFsdWUsXG4gICAgICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgICAgIGZ1bmN0aW9ucy5zb21lKGZ1bmN0aW9uKGZuKXtcbiAgICAgICAgICAgIHZhbHVlID0gZm4uYXBwbHkodGhpcywgYXJncyk7XG5cbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSA9PT0gZmFsc2U7XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9O1xufTtcblxuLyoqXG4gKiBSZXR1cm4gYSBmdW5jdGlvbnMgdGhhdCBydW5zIHRoZSBwYXNzZWQgaW4gZnVuY3Rpb25zXG4gKiB0aGUgcmVzdWx0IG9mIGVhY2ggZnVuY3Rpb24gd2lsbCBiZSB0aGUgdGhlIGNhbGwgYXJncyBcbiAqIGZvciB0aGUgbmV4dCBmdW5jdGlvbi4gIFRoZSB2YWx1ZSBvZiB0aGUgbGFzdCBmdW5jdGlvbiBcbiAqIHJldHVybiB3aWxsIGJlIHJldHVybmVkLlxuICogXG4gKiBAcGFyYW0gIHtGdW5jdGlvbi9GdW5jdGlvbltdfSBmbnMgXG4gKiBAcGFyYW0gIHtPYmplY3R9IFtjb25maWddIENvbmZpZyBvYmplY3RcbiAqIGZvciBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudGVyLiAgSWYgZGVmaW5lZCBhbGwgb2YgdGhlIGZ1bmN0aW9uc1xuICogd2lsbCBnZXQgY3JlYXRlZCB3aXRoIHRoZSBwYXNzZWQgaW4gY29uZmlnO1xuICAgICBcbiAgICAgTHVjLkZ1bmN0aW9uLmNyZWF0ZVJlbGF5ZXIoW1xuICAgICAgICBmdW5jdGlvbihzdHIpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHIgKyAnYidcbiAgICAgICAgfSxcbiAgICAgICAgZnVuY3Rpb24oc3RyKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RyICsgJ2MnXG4gICAgICAgIH0sXG4gICAgICAgIGZ1bmN0aW9uKHN0cikge1xuICAgICAgICAgICAgcmV0dXJuIHN0ciArICdkJ1xuICAgICAgICB9XG4gICAgXSkoJ2EnKVxuXG4gICAgPlwiYWJjZFwiXG5cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5leHBvcnRzLmNyZWF0ZVJlbGF5ZXIgPSBmdW5jdGlvbihmbnMsIGNvbmZpZykge1xuICAgIHZhciBmdW5jdGlvbnMgPSBpbml0U2VxdWVuY2VGdW5jdGlvbnMoZm5zLCBjb25maWcpO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdmFsdWUsXG4gICAgICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgICAgIGZ1bmN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKGZuLCBpbmRleCkge1xuICAgICAgICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBmbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBmbi5hcHBseSh0aGlzLCBbdmFsdWVdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH07XG59O1xuXG4vKipcbiAqIENyZWF0ZSBhIHRocm90dGxlZCBmdW5jdGlvbiBmcm9tIHRoZSBwYXNzZWQgaW4gZnVuY3Rpb25cbiAqIHRoYXQgd2lsbCBvbmx5IGdldCBjYWxsZWQgb25jZSB0aGUgcGFzc2VkIG51bWJlciBvZiBtaWxpc2Vjb25kc1xuICogaGF2ZSBiZWVuIGV4ZWNlZWRlZC4gIFxuICogXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gZm5cbiAqIEBwYXJhbSAge051bWJlcn0gW21pbGxpc10gTnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0b1xuICogdGhyb3R0bGUgdGhlIGZ1bmN0aW9uLlxuICogQHBhcmFtICB7T2JqZWN0fSBbY29uZmlnXSBDb25maWcgb2JqZWN0XG4gKiBmb3IgTHVjLkZ1bmN0aW9uLmNyZWF0ZUF1Z21lbnRlci4gIElmIGRlZmluZWQgYWxsIG9mIHRoZSBmdW5jdGlvbnNcbiAqIHdpbGwgZ2V0IGNyZWF0ZWQgd2l0aCB0aGUgcGFzc2VkIGluIGNvbmZpZztcbiAqXG4gICAgdmFyIGxvZ0FyZ3MgID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGFyZ3VtZW50cylcbiAgICB9O1xuXG4gICAgdmFyIGEgPSBMdWMuRnVuY3Rpb24uY3JlYXRlVGhyb3R0bGVkKGxvZ0FyZ3MsIDEpO1xuXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IDEwMDsgKytpKSB7XG4gICAgICAgIGEoMSwyLDMpO1xuICAgIH1cblxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGEoMSlcbiAgICB9LCAxMDApXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgYSgyKVxuICAgIH0sIDQwMClcblxuICAgID5bMSwgMiwgM11cbiAgICA+WzFdXG4gICAgPlsyXVxuICogXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZXhwb3J0cy5jcmVhdGVUaHJvdHRsZWQgPSBmdW5jdGlvbihmLCBtaWxsaXMsIGNvbmZpZykge1xuICAgIHZhciBmbiA9IGNvbmZpZyA/IGV4cG9ydHMuY3JlYXRlQXVnbWVudGVyKGYsIGNvbmZpZykgOiBmLFxuICAgICAgICB0aW1lT3V0SWQgPSBmYWxzZTtcblxuICAgIGlmKCFtaWxsaXMpIHtcbiAgICAgICAgcmV0dXJuIGZuO1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG5cbiAgICAgICAgaWYodGltZU91dElkKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZU91dElkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRpbWVPdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aW1lT3V0SWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICB9LCBtaWxsaXMpO1xuICAgIH07XG59O1xuXG4vKipcbiAqIERlZmVyIGEgZnVuY3Rpb24ncyBleGVjdXRpb24gZm9yIHRoZSBwYXNzZWQgaW5cbiAqIG1pbGxpc2Vjb25kcy5cbiAqIFxuICogQHBhcmFtICB7RnVuY3Rpb259IGZuXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IFttaWxsaXNdIE51bWJlciBvZiBtaWxsaXNlY29uZHMgdG9cbiAqIGRlZmVyXG4gKiBAcGFyYW0gIHtPYmplY3R9IFtjb25maWddIENvbmZpZyBvYmplY3RcbiAqIGZvciBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudGVyLiAgSWYgZGVmaW5lZCBhbGwgb2YgdGhlIGZ1bmN0aW9uc1xuICogd2lsbCBnZXQgY3JlYXRlZCB3aXRoIHRoZSBwYXNzZWQgaW4gY29uZmlnO1xuICogXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZXhwb3J0cy5jcmVhdGVEZWZlcnJlZCA9IGZ1bmN0aW9uKGYsIG1pbGxpcywgY29uZmlnKSB7XG4gICAgdmFyIGZuID0gY29uZmlnID8gZXhwb3J0cy5jcmVhdGVBdWdtZW50ZXIoZiwgY29uZmlnKSA6IGY7XG5cbiAgICBpZighbWlsbGlzKSB7XG4gICAgICAgIHJldHVybiBmbjtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBmbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgfSwgbWlsbGlzKTtcbiAgICB9O1xufTsiLCJ2YXIgYXJyYXlTbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZSxcbiAgICBjb21wYXJlID0gcmVxdWlyZSgnLi9jb21wYXJlJyksXG4gICAgaXMgPSByZXF1aXJlKCcuL2lzJyksXG4gICAgY29tcGFyZSA9IGNvbXBhcmUuY29tcGFyZTtcblxuZnVuY3Rpb24gX2NyZWF0ZUl0ZXJhdG9yRm4oZm4sIGMpIHtcbiAgICB2YXIgY29uZmlnID0gYyB8fCB7fTtcblxuICAgIGlmKGlzLmlzRnVuY3Rpb24oZm4pICYmIChjb25maWcudHlwZSAhPT0gJ3N0cmljdCcpKSB7XG4gICAgICAgIHJldHVybiBjID8gZm4uYmluZChjKSA6IGZuO1xuICAgIH1cblxuICAgIGlmKGNvbmZpZy50eXBlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uZmlnLnR5cGUgPSAnbG9vc2UnO1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gY29tcGFyZShmbiwgdmFsdWUsIGNvbmZpZyk7XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gX2NyZWF0ZUl0ZXJhdG9yTm90Rm4oZm4sIGNvbmZpZykge1xuICAgIHZhciBmdW5jdGlvblRvTm90ID0gX2NyZWF0ZUl0ZXJhdG9yRm4oZm4sIGNvbmZpZyk7XG4gICAgICAgIFxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICFmdW5jdGlvblRvTm90LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbn1cblxuXG4vKipcbiAqIEBjbGFzcyBMdWMuQXJyYXkgXG4gKiBQYWNrYWdlIGZvciBBcnJheSBtZXRob2RzLiA8YnI+XG4gKiBcbiAqIEtlZXAgaW4gbWluZCB0aGF0IEx1YyBpcyBvcHRpb25hbGx5IHBhY2thZ2VkIHdpdGggZXM1IHNoaW0gc28geW91IGNhbiB0YXJnZXQgbm9uLWVzNSBicm93c2Vycy5cbiAqIEl0IGNvbWVzIHdpdGggeW91ciBmYXZvcml0ZSB7QGxpbmsgQXJyYXkgQXJyYXl9IG1ldGhvZHMgc3VjaCBhcyBBcnJheS5mb3JFYWNoLCBBcnJheS5maWx0ZXIsIEFycmF5LnNvbWUsIEFycmF5LmV2ZXJ5IEFycmF5LnJlZHVjZVJpZ2h0IC4uXG4gKlxuICogQWxzbyBkb24ndCBmb3JnZXQgYWJvdXQgTHVjLkFycmF5LmVhY2ggYW5kIEx1Yy5BcnJheS50b0FycmF5LCB0aGV5IGFyZSBncmVhdCB1dGlsaXR5IG1ldGhvZHNcbiAqIHRoYXQgYXJlIHVzZWQgYWxsIG92ZXIgdGhlIGZyYW1ld29yay5cbiAqIFxuICogQWxsIHJlbW92ZVxcKiAvIGZpbmRcXCogbWV0aG9kcyBmb2xsb3cgdGhlIHNhbWUgYXBpLiAgXFwqQWxsIGZ1bmN0aW9ucyB3aWxsIHJldHVybiBhbiBhcnJheSBvZiByZW1vdmVkIG9yIGZvdW5kXG4gKiBpdGVtcy4gIFRoZSBpdGVtcyB3aWxsIGJlIGFkZGVkIHRvIHRoZSBhcnJheSBpbiB0aGUgb3JkZXIgdGhleSBhcmVcbiAqIGZvdW5kLiAgXFwqRmlyc3QgZnVuY3Rpb25zIHdpbGwgcmV0dXJuIHRoZSBmaXJzdCBpdGVtIGFuZCBzdG9wIGl0ZXJhdGluZyBhZnRlciB0aGF0LCBpZiBub25lXG4gKiAgaXMgZm91bmQgZmFsc2UgaXMgcmV0dXJuZWQuICByZW1vdmVcXCogZnVuY3Rpb25zIHdpbGwgZGlyZWN0bHkgY2hhbmdlIHRoZSBwYXNzZWQgaW4gYXJyYXkuXG4gKiAgXFwqTm90IGZ1bmN0aW9ucyBvbmx5IGRvIHRoZSBmb2xsb3dpbmcgYWN0aW9ucyBpZiB0aGUgY29tcGFyaXNvbiBpcyBub3QgdHJ1ZS5cbiAqICBBbGwgcmVtb3ZlXFwqIC8gZmluZFxcKiB0YWtlIHRoZSBmb2xsb3dpbmcgYXBpOiBhcnJheSwgb2JqZWN0VG9Db21wYXJlT3JJdGVyYXRvciwgY29tcGFyZUNvbmZpZ09yVGhpc0FyZyBmb3IgZXhhbXBsZTpcbiAqXG4gICAgTHVjLkFycmF5LmZpbmRGaXJzdChbMSwyLDMsIHt9XSwge30pO1xuICAgID5PYmplY3Qge31cblxuICAgIEx1Yy5BcnJheS5maW5kRmlyc3QoWzEsMiwzLHt9XSwge30sIHt0eXBlOiAnc3RyaWN0J30pO1xuICAgID5mYWxzZVxuXG4gICAgTHVjLkFycmF5LmZpbmRGaXJzdChbMSwyLDMse31dLCBmdW5jdGlvbih2YWwsIGluZGV4LCBhcnJheSl7XG4gICAgICAgIHJldHVybiB2YWwgPT09IDMgfHwgdGhpcy5udW0gPT09IHZhbDtcbiAgICB9LCB7bnVtOiAxfSk7XG4gICAgPjFcblxuICAgIHZhciBhcnIgPSBbMSwyLHthOjF9LDEsIHthOjF9XTtcbiAgICBMdWMuQXJyYXkucmVtb3ZlRmlyc3QoYXJyLCB7YToxfSlcbiAgICA+e2E6MX1cbiAgICBhcnI7XG4gICAgPlsxLCAyLCAxLCB7YToxfV1cbiAgICBMdWMuQXJyYXkucmVtb3ZlTGFzdChhcnIsIDEpXG4gICAgPjFcbiAgICBhcnI7XG4gICAgPlsxLDIsIHthOjF9XVxuXG4gKlxuICogRm9yIGNvbW1vbmx5IHVzZWQgZmluZC9yZW1vdmUgZnVuY3Rpb25zIGNoZWNrIG91dCBMdWMuQXJyYXlGbnMgZm9yIGV4YW1wbGUgYVxuICogXCJjb21wYWN0XCIgbGlrZSBmdW5jdGlvblxuICogXG4gICAgTHVjLkFycmF5LmZpbmRBbGxOb3RGYWxzeShbZmFsc2UsICcnLCB1bmRlZmluZWQsIDAsIHt9LCBbXV0pXG4gICAgPlswLCB7fSwgW11dXG4gKlxuICogT3IgcmVtb3ZlIGFsbCBlbXB0eSBpdGVtc1xuICogXG4gICAgdmFyIGFyciA9IFsnJywgMCAsIFtdLCB7YToxfSwgdHJ1ZSwge30sIFsxXV1cbiAgICBMdWMuQXJyYXkucmVtb3ZlQWxsRW1wdHkoYXJyKVxuICAgID5bJycsIFtdLCB7fV1cbiAgICBhcnJcbiAgICA+WzAsIHthOjF9LCB0cnVlLCBbMV1dXG4gKi9cblxuLyoqXG4gKiBUdXJuIHRoZSBwYXNzZWQgaW4gaXRlbSBpbnRvIGFuIGFycmF5IGlmIGl0XG4gKiBpc24ndCBvbmUgYWxyZWFkeSwgaWYgdGhlIGl0ZW0gaXMgYW4gYXJyYXkganVzdCByZXR1cm4gaXQuICBcbiAqIEl0IHJldHVybnMgYW4gZW1wdHkgYXJyYXkgaWYgaXRlbSBpcyBudWxsIG9yIHVuZGVmaW5lZC5cbiAqIElmIGl0IGlzIGp1c3QgYSBzaW5nbGUgaXRlbSByZXR1cm4gYW4gYXJyYXkgY29udGFpbmluZyB0aGUgaXRlbS5cbiAqIFxuICAgIEx1Yy5BcnJheS50b0FycmF5KClcbiAgICA+W11cbiAgICBMdWMuQXJyYXkudG9BcnJheShudWxsKVxuICAgID5bXVxuICAgIEx1Yy5BcnJheS50b0FycmF5KDEpXG4gICAgPlsxXVxuICAgIEx1Yy5BcnJheS50b0FycmF5KFsxLDJdKVxuICAgID5bMSwgMl1cbiAqXG4gKiBAcGFyYW0gIHtPYmplY3R9IGl0ZW0gaXRlbSB0byB0dXJuIGludG8gYW4gYXJyYXkuXG4gKiBAcmV0dXJuIHRoZSBhcnJheVxuICovXG5mdW5jdGlvbiB0b0FycmF5KGl0ZW0pIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShpdGVtKSkge1xuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICB9XG4gICAgcmV0dXJuIChpdGVtID09PSBudWxsIHx8IGl0ZW0gPT09IHVuZGVmaW5lZCkgPyBbXSA6IFtpdGVtXTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gdGhlIGxhc3QgaXRlbSBvZiB0aGUgYXJyYXlcbiAqIEBwYXJhbSAge0FycmF5fSBhcnJcbiAqIEByZXR1cm4ge09iamVjdH0gdGhlIGl0ZW1cbiAgICBcbiAgICB2YXIgbXlMb25nQXJyYXlOYW1lRm9yVGhpbmdzVGhhdElXYW50VG9LZWVwVHJhY2tPZiA9IFsxLDIsM11cbiAgICBcbiAgICBMdWMuQXJyYXkubGFzdChteUxvbmdBcnJheU5hbWVGb3JUaGluZ3NUaGF0SVdhbnRUb0tlZXBUcmFja09mKTtcbiAgICB2cy5cbiAgICBteUxvbmdBcnJheU5hbWVGb3JUaGluZ3NUaGF0SVdhbnRUb0tlZXBUcmFja09mW215TG9uZ0FycmF5TmFtZUZvclRoaW5nc1RoYXRJV2FudFRvS2VlcFRyYWNrT2YubGVuZ3RoIC0xXVxuICpcbiAqL1xuZnVuY3Rpb24gbGFzdChhcnIpIHtcbiAgICByZXR1cm4gYXJyW2Fyci5sZW5ndGggLTFdO1xufVxuXG4vKipcbiAqIEZsYXR0ZW4gb3V0IGFuIGFycmF5IG9mIG9iamVjdHMgYmFzZWQgb2YgdGhlaXIgdmFsdWUgZm9yIHRoZSBwYXNzZWQgaW4ga2V5LlxuICogVGhpcyBhbHNvIHRha2VzIGFjY2NvdW50IGZvciBudWxsL3VuZGVmaW5lZCB2YWx1ZXMuXG4gKlxuICAgIEx1Yy5BcnJheS5wbHVjayhbdW5kZWZpbmVkLCB7YTonMScsIGI6Mn0sIHtiOjN9LCB7Yjo0fV0sICdiJylcbiAgICA+W3VuZGVmaW5lZCwgMiwgMywgNF1cbiAqIEBwYXJhbSAge09iamVjdFtdfSBhcnIgXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGtleSBcbiAqIEByZXR1cm4ge0FycmF5fSAgICAgXG4gKi9cbmZ1bmN0aW9uIHBsdWNrKGFyciwga2V5KSB7XG4gICAgcmV0dXJuIGFyci5tYXAoZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlICYmIHZhbHVlW2tleV07XG4gICAgfSk7XG59XG5cbi8qKlxuICogUmV0dXJuIHRoZSBpdGVtcyBpbmJldHdlZW4gdGhlIHBhc3NlZCBpbiBpbmRleFxuICogYW5kIHRoZSBlbmQgb2YgdGhlIGFycmF5LlxuICogXG4gKiBAcGFyYW0gIHtBcnJheS9hcmd1bWVudHN9IGFyciBcbiAqIEBwYXJhbSAge051bWJlcn0gaW5kZXggXG4gKiBAcmV0dXJuIHtBcnJheX0gdGhlIG5ldyBhcnJheS5cbiAqIFxuICAgIEx1Yy5BcnJheS5mcm9tSW5kZXgoWzEsMiwzLDQsNV0sIDEpXG4gICAgPlsyLCAzLCA0LCA1XVxuICogXG4gKi9cbmZ1bmN0aW9uIGZyb21JbmRleChhLCBpbmRleCkge1xuICAgIHZhciBhcnIgPSBpcy5pc0FyZ3VtZW50cyhhKSA/IGFycmF5U2xpY2UuY2FsbChhKSA6IGE7XG4gICAgcmV0dXJuIGFycmF5U2xpY2UuY2FsbChhcnIsIGluZGV4LCBhcnIubGVuZ3RoKTtcbn1cblxuLyoqXG4gKiBSdW5zIGFuIEFycmF5LmZvckVhY2ggYWZ0ZXIgY2FsbGluZyBMdWMuQXJyYXkudG9BcnJheSBvbiB0aGUgaXRlbS5cbiAqIEBwYXJhbSAge09iamVjdH0gICBpdGVtXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEBwYXJhbSAge09iamVjdH0gICB0aGlzQXJnICAgXG4gKlxuICBJdCBpcyB2ZXJ5IHVzZWZ1bCBmb3Igc2V0dGluZyB1cCBmbGV4aWJsZSBhcGkncyB0aGF0IGNhbiBoYW5kbGUgbm9uZSBvbmUgb3IgbWFueS5cblxuICAgIEx1Yy5BcnJheS5lYWNoKHRoaXMuaXRlbXMsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgdGhpcy5fYWRkSXRlbShpdGVtKTtcbiAgICB9KTtcblxuICAgIHZzLlxuXG4gICAgaWYoQXJyYXkuaXNBcnJheSh0aGlzLml0ZW1zKSl7XG4gICAgICAgIHRoaXMuaXRlbXMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICB0aGlzLl9hZGRJdGVtKGl0ZW0pO1xuICAgICAgICB9KVxuICAgIH1cbiAgICBlbHNlIGlmKHRoaXMuaXRlbXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLl9hZGRJdGVtKHRoaXMuaXRlbXMpO1xuICAgIH1cblxuICovXG5mdW5jdGlvbiBlYWNoKGl0ZW0sIGZuLCB0aGlzQXJnKSB7XG4gICAgdmFyIGFyciA9IHRvQXJyYXkoaXRlbSk7XG4gICAgcmV0dXJuIGFyci5mb3JFYWNoLmNhbGwoYXJyLCBmbiwgdGhpc0FyZyk7XG59XG5cbi8qKlxuICogSW5zZXJ0IG9yIGFwcGVuZCB0aGUgc2Vjb25kIGFycmF5L2FyZ3VtZW50cyBpbnRvIHRoZVxuICogZmlyc3QgYXJyYXkvYXJndW1lbnRzLiAgVGhpcyBtZXRob2QgZG9lcyBub3QgYWx0ZXJcbiAqIHRoZSBwYXNzZWQgaW4gYXJyYXkvYXJndW1lbnRzLlxuICogXG4gKiBAcGFyYW0gIHtBcnJheS9hcmd1bWVudHN9IGZpcnN0QXJyYXlPckFyZ3NcbiAqIEBwYXJhbSAge0FycmF5L2FyZ3VtZW50c30gc2Vjb25kQXJyYXlPckFyZ3NcbiAqIEBwYXJhbSAge051bWJlci90cnVlfSBpbmRleE9yQXBwZW5kIHRydWUgdG8gYXBwZW5kIFxuICogdGhlIHNlY29uZCBhcnJheSB0byB0aGUgZW5kIG9mIHRoZSBmaXJzdCBvbmUuICBJZiBpdCBpcyBhIG51bWJlclxuICogaW5zZXJ0IHRoZSBzZWNvbmRBcnJheSBpbnRvIHRoZSBmaXJzdCBvbmUgYXQgdGhlIHBhc3NlZCBpbiBpbmRleC5cbiAgIFxuICAgIEx1Yy5BcnJheS5pbnNlcnQoWzAsNF0sIFsxLDIsM10sIDEpO1xuICAgID5bMCwgMSwgMiwgMywgNF1cbiAgICBMdWMuQXJyYXkuaW5zZXJ0KFswLDRdLCBbMSwyLDNdLCB0cnVlKTtcbiAgICA+WzAsIDQsIDEsIDIsIDNdXG4gICAgTHVjLkFycmF5Lmluc2VydChbMCw0XSwgWzEsMiwzXSwgMCk7XG4gICAgPlsxLCAyLCAzLCAwLCA0XVxuIFxuICogQHJldHVybiB7QXJyYXl9XG4gKi9cbmZ1bmN0aW9uIGluc2VydChmaXJzdEFycmF5T3JBcmdzLCBzZWNvbmRBcnJheU9yQXJncywgaW5kZXhPckFwcGVuZCkge1xuICAgIHZhciBmaXJzdEFycmF5ID0gYXJyYXlTbGljZS5jYWxsKGZpcnN0QXJyYXlPckFyZ3MpLFxuICAgICAgICBzZWNvbmRBcnJheSA9IGFycmF5U2xpY2UuY2FsbChzZWNvbmRBcnJheU9yQXJncyksXG4gICAgICAgIHNwbGljZUFyZ3M7XG5cbiAgICBpZihpbmRleE9yQXBwZW5kID09PSB0cnVlKSB7XG4gICAgICAgIHJldHVybiBmaXJzdEFycmF5LmNvbmNhdChzZWNvbmRBcnJheSk7XG4gICAgfVxuXG4gICAgc3BsaWNlQXJncyA9IFtpbmRleE9yQXBwZW5kLCAwXS5jb25jYXQoc2Vjb25kQXJyYXkpO1xuICAgIGZpcnN0QXJyYXkuc3BsaWNlLmFwcGx5KGZpcnN0QXJyYXksIHNwbGljZUFyZ3MpO1xuICAgIHJldHVybiBmaXJzdEFycmF5O1xufVxuXG4vKipcbiAqIFJlbW92ZSBhbiBpdGVtIGZyb20gYW4gdGhlIHBhc3NlZCBpbiBhcnJcbiAqIGZyb20gdGhlIGluZGV4LlxuICogQHBhcmFtICB7QXJyYXl9IGFyclxuICogQHBhcmFtICB7TnVtYmVyfSBpbmRleFxuICogQHJldHVybiB7T2JqZWN0fSB0aGUgaXRlbSByZW1vdmVkLlxuICovXG5mdW5jdGlvbiByZW1vdmVBdEluZGV4KGFyciwgaW5kZXgpIHtcbiAgICB2YXIgaXRlbSA9IGFycltpbmRleF07XG4gICAgYXJyLnNwbGljZShpbmRleCwgMSk7XG4gICAgcmV0dXJuIGl0ZW07XG59XG5cbmZ1bmN0aW9uIF9yZW1vdmVGaXJzdChhcnIsIGZuKSB7XG4gICAgdmFyIHJlbW92ZWQgPSBmYWxzZTtcblxuICAgIGFyci5zb21lKGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xuICAgICAgICBpZiAoZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKSkge1xuICAgICAgICAgICAgcmVtb3ZlZCA9IHJlbW92ZUF0SW5kZXgoYXJyLCBpbmRleCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlbW92ZWQ7XG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBmaXJzdCBpdGVtIGZyb20gdGhlIHBhc3NlZCBpbiBhcnJheVxuICogdGhhdCB7QGxpbmsgTHVjI2NvbXBhcmUgbWF0Y2hlc30gdGhlIHBhc3NlZCBpbiBvYmplY3QuICBJbnN0ZWFkIG9mIFxuICogY29tcGFyaW5nIGFuIG9iamVjdCBhbiBpdGVyYXRvciBmdW5jdGlvbiBjYW4gYmVcbiAqIHVzZWQuXG4gKiBcbntjb3B5RG9jI2FyclBhcmFtc31cbntjb3B5RG9jI2FyclJlbW92ZVNpbmdsZX1cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlRmlyc3QoYXJyLCBvYmosIGNvbmZpZykge1xuICAgIHZhciBmbiA9IF9jcmVhdGVJdGVyYXRvckZuKG9iaiwgY29uZmlnKTtcbiAgICByZXR1cm4gX3JlbW92ZUZpcnN0KGFyciwgZm4pO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgZmlyc3QgaXRlbSBmcm9tIHRoZSBwYXNzZWQgaW4gYXJyYXlcbiAqIHRoYXQgZG9lcyBub3Qge0BsaW5rIEx1YyNjb21wYXJlIG1hdGNofSB0aGUgcGFzc2VkIGluIG9iamVjdC4gIEluc3RlYWQgb2YgXG4gKiBjb21wYXJpbmcgYW4gb2JqZWN0IGFuIGl0ZXJhdG9yIGZ1bmN0aW9uIGNhbiBiZVxuICogdXNlZC5cbiAqIFxue2NvcHlEb2MjYXJyUGFyYW1zfVxue2NvcHlEb2MjYXJyUmVtb3ZlU2luZ2xlfVxuICovXG5mdW5jdGlvbiByZW1vdmVGaXJzdE5vdChhcnIsIG9iaiwgY29uZmlnKSB7XG4gICAgdmFyIGZuID0gX2NyZWF0ZUl0ZXJhdG9yTm90Rm4ob2JqLCBjb25maWcpO1xuICAgIHJldHVybiBfcmVtb3ZlRmlyc3QoYXJyLCBmbik7XG59XG5cblxuZnVuY3Rpb24gX3JlbW92ZUFsbChhcnIsIGZuKSB7XG4gICAgdmFyIGluZGV4c1RvUmVtb3ZlID0gW10sXG4gICAgICAgIHJlbW92ZWQgPSBbXTtcblxuICAgIGFyci5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xuICAgICAgICBpZiAoZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKSkge1xuICAgICAgICAgICAgaW5kZXhzVG9SZW1vdmUudW5zaGlmdChpbmRleCk7XG4gICAgICAgICAgICByZW1vdmVkLnB1c2godmFsdWUpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBpbmRleHNUb1JlbW92ZS5mb3JFYWNoKGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgICAgcmVtb3ZlQXRJbmRleChhcnIsIGluZGV4KTtcbiAgICB9KTtcblxuICAgIHJldHVybiByZW1vdmVkO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgYWxsIHRoZSBpdGVtcyBmcm9tIHRoZSBwYXNzZWQgaW4gYXJyYXlcbiAqIHRoYXQgZG8gbm90IHtAbGluayBMdWMjY29tcGFyZSBtYXRjaH0gdGhlIHBhc3NlZCBpbiBvYmplY3QuICBJbnN0ZWFkIG9mIFxuICogY29tcGFyaW5nIGFuIG9iamVjdCBhbiBpdGVyYXRvciBmdW5jdGlvbiBjYW4gYmVcbiAqIHVzZWQuXG4gKiBcbntjb3B5RG9jI2FyclBhcmFtc31cbntjb3B5RG9jI2FyclJlbW92ZUFsbH1cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlQWxsTm90KGFyciwgb2JqLCBjb25maWcpIHtcbiAgICB2YXIgZm4gPSBfY3JlYXRlSXRlcmF0b3JOb3RGbihvYmosIGNvbmZpZyk7XG4gICAgcmV0dXJuIF9yZW1vdmVBbGwoYXJyLCBmbik7XG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBhbGwgdGhlIGl0ZW1zIGZyb20gdGhlIHBhc3NlZCBpbiBhcnJheVxuICogdGhhdCB7QGxpbmsgTHVjI2NvbXBhcmUgbWF0Y2hlc30gdGhlIHBhc3NlZCBpbiBvYmplY3QuICBJbnN0ZWFkIG9mIFxuICogY29tcGFyaW5nIGFuIG9iamVjdCBhbiBpdGVyYXRvciBmdW5jdGlvbiBjYW4gYmVcbiAqIHVzZWQuXG4gKiBcbntjb3B5RG9jI2FyclBhcmFtc31cbntjb3B5RG9jI2FyclJlbW92ZUFsbH1cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlQWxsKGFyciwgb2JqLCBjb25maWcpIHtcbiAgICB2YXIgZm4gPSBfY3JlYXRlSXRlcmF0b3JGbihvYmosIGNvbmZpZyk7XG4gICAgcmV0dXJuIF9yZW1vdmVBbGwoYXJyLCBmbik7XG59XG5cbmZ1bmN0aW9uIF9maW5kRmlyc3QoYXJyLCBmbikge1xuICAgIHZhciBpdGVtID0gZmFsc2U7XG4gICAgYXJyLnNvbWUoZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XG4gICAgICAgIGlmIChmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSB7XG4gICAgICAgICAgICBpdGVtID0gYXJyW2luZGV4XTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gaXRlbTtcbn1cblxuLyoqXG4gKiBGaW5kIHRoZSBmaXJzdCBpdGVtIGZyb20gdGhlIHBhc3NlZCBpbiBhcnJheVxuICogdGhhdCBkb2VzIHtAbGluayBMdWMjY29tcGFyZSBtYXRjaGVzfSB0aGUgcGFzc2VkIGluIG9iamVjdC4gIEluc3RlYWQgb2YgXG4gKiBjb21wYXJpbmcgYW4gb2JqZWN0IGFuIGl0ZXJhdG9yIGZ1bmN0aW9uIGNhbiBiZVxuICogdXNlZC5cbiAqIFxue2NvcHlEb2MjYXJyUGFyYW1zfVxue2NvcHlEb2MjYXJyRmluZFNpbmdsZX1cbiAqL1xuZnVuY3Rpb24gZmluZEZpcnN0KGFyciwgb2JqLCBjb25maWcpIHtcbiAgICB2YXIgZm4gPSBfY3JlYXRlSXRlcmF0b3JGbihvYmosIGNvbmZpZyk7XG4gICAgcmV0dXJuIF9maW5kRmlyc3QoYXJyLCBmbik7XG59XG5cbi8qKlxuICogRmluZCB0aGUgZmlyc3QgaXRlbSBmcm9tIHRoZSBwYXNzZWQgaW4gYXJyYXlcbiAqIHRoYXQgZG9lcyBub3Qge0BsaW5rIEx1YyNjb21wYXJlIG1hdGNofSB0aGUgcGFzc2VkIGluIG9iamVjdC4gIEluc3RlYWQgb2YgXG4gKiBjb21wYXJpbmcgYW4gb2JqZWN0IGFuIGl0ZXJhdG9yIGZ1bmN0aW9uIGNhbiBiZVxuICogdXNlZC5cbiAqIFxue2NvcHlEb2MjYXJyUGFyYW1zfVxue2NvcHlEb2MjYXJyRmluZFNpbmdsZX1cbiAqL1xuZnVuY3Rpb24gZmluZEZpcnN0Tm90KGFyciwgb2JqLCBjb25maWcpIHtcbiAgICB2YXIgZm4gPSBfY3JlYXRlSXRlcmF0b3JOb3RGbihvYmosIGNvbmZpZyk7XG4gICAgcmV0dXJuIF9maW5kRmlyc3QoYXJyLCBmbik7XG59XG5cbmZ1bmN0aW9uIF9maW5kQWxsKGFyciwgZm4pIHtcbiAgICB2YXIgZm91bmQgPSBhcnIuZmlsdGVyKGZuKTtcbiAgICByZXR1cm4gZm91bmQ7XG59XG5cbi8qKlxuICogRmluZCB0aGUgYWxsIHRoZSBpdGVtcyBmcm9tIHRoZSBwYXNzZWQgaW4gYXJyYXlcbiAqIHRoYXQge0BsaW5rIEx1YyNjb21wYXJlIG1hdGNoZXN9IHRoZSBwYXNzZWQgaW4gb2JqZWN0LiAgSW5zdGVhZCBvZiBcbiAqIGNvbXBhcmluZyBhbiBvYmplY3QgYW4gaXRlcmF0b3IgZnVuY3Rpb24gY2FuIGJlXG4gKiB1c2VkLlxuICogXG57Y29weURvYyNhcnJQYXJhbXN9XG57Y29weURvYyNhcnJGaW5kQWxsfVxuICovXG5mdW5jdGlvbiBmaW5kQWxsKGFyciwgb2JqLCBjb25maWcpIHtcbiAgICB2YXIgZm4gPSBfY3JlYXRlSXRlcmF0b3JGbihvYmosIGNvbmZpZyk7XG4gICAgcmV0dXJuIF9maW5kQWxsKGFyciwgZm4pO1xufVxuXG4vKipcbiAqIEZpbmQgdGhlIGFsbCB0aGUgaXRlbXMgZnJvbSB0aGUgcGFzc2VkIGluIGFycmF5XG4gKiB0aGF0IGRvIG5vdCB7QGxpbmsgTHVjI2NvbXBhcmUgbWF0Y2h9IHRoZSBwYXNzZWQgaW4gb2JqZWN0LiAgSW5zdGVhZCBvZiBcbiAqIGNvbXBhcmluZyBhbiBvYmplY3QgYW4gaXRlcmF0b3IgZnVuY3Rpb24gY2FuIGJlXG4gKiB1c2VkLlxuICogXG57Y29weURvYyNhcnJQYXJhbXN9XG57Y29weURvYyNhcnJGaW5kQWxsfVxuICovXG5mdW5jdGlvbiBmaW5kQWxsTm90KGFyciwgb2JqLCBjb25maWcpIHtcbiAgICB2YXIgZm4gPSBfY3JlYXRlSXRlcmF0b3JOb3RGbihvYmosIGNvbmZpZyk7XG4gICAgcmV0dXJuIF9maW5kQWxsKGFyciwgZm4pO1xufVxuXG5cbmV4cG9ydHMudG9BcnJheSA9IHRvQXJyYXk7XG5leHBvcnRzLmVhY2ggPSBlYWNoO1xuZXhwb3J0cy5pbnNlcnQgPSBpbnNlcnQ7XG5leHBvcnRzLmZyb21JbmRleCA9IGZyb21JbmRleDtcbmV4cG9ydHMubGFzdCA9IGxhc3Q7XG5leHBvcnRzLnBsdWNrID0gcGx1Y2s7XG5cbmV4cG9ydHMucmVtb3ZlQXRJbmRleCA9IHJlbW92ZUF0SW5kZXg7XG5leHBvcnRzLmZpbmRGaXJzdE5vdCA9IGZpbmRGaXJzdE5vdDtcbmV4cG9ydHMuZmluZEFsbE5vdCA9IGZpbmRBbGxOb3Q7XG5leHBvcnRzLmZpbmRGaXJzdCA9IGZpbmRGaXJzdDtcbmV4cG9ydHMuZmluZEFsbCA9IGZpbmRBbGw7XG5cbmV4cG9ydHMucmVtb3ZlRmlyc3ROb3QgPSByZW1vdmVGaXJzdE5vdDtcbmV4cG9ydHMucmVtb3ZlQWxsTm90ID0gcmVtb3ZlQWxsTm90O1xuZXhwb3J0cy5yZW1vdmVGaXJzdCA9IHJlbW92ZUZpcnN0O1xuZXhwb3J0cy5yZW1vdmVBbGwgPSByZW1vdmVBbGw7XG5cbihmdW5jdGlvbigpe1xuICAgIHZhciBfY3JlYXRlTGFzdEZuID0gZnVuY3Rpb24oZm5OYW1lKSB7XG4gICAgICAgIHZhciBsYXN0TmFtZSA9IGZuTmFtZS5yZXBsYWNlKCdGaXJzdCcsICdMYXN0Jyk7XG5cbiAgICAgICAgZXhwb3J0c1tsYXN0TmFtZV0gPSBmdW5jdGlvbihhcnIsIG9iaiwgY29uZmlnKSB7XG4gICAgICAgICAgICB2YXIgcmV0O1xuXG4gICAgICAgICAgICBhcnIucmV2ZXJzZSgpO1xuICAgICAgICAgICAgcmV0ID0gZXhwb3J0c1tmbk5hbWVdKGFyciwgb2JqLCBjb25maWcpO1xuICAgICAgICAgICAgYXJyLnJldmVyc2UoKTtcblxuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfTtcblxuICAgIH0sIG5hbWVzVG9BZGRMYXN0ID0gWydmaW5kRmlyc3ROb3QnLCAnZmluZEZpcnN0JywgJ3JlbW92ZUZpcnN0Tm90JywgJ3JlbW92ZUZpcnN0J107XG5cbiAgICBuYW1lc1RvQWRkTGFzdC5mb3JFYWNoKGZ1bmN0aW9uKGZuTmFtZSkge1xuICAgICAgICBfY3JlYXRlTGFzdEZuKGZuTmFtZSk7XG4gICAgfSk7XG5cbn0oKSk7XG5cbi8qKlxuICogQG1lbWJlciBMdWMuQXJyYXkgXG4gKiBAbWV0aG9kIGZpbmRMYXN0Tm90IFxuICogU2FtZSBhcyBMdWMuQXJyYXkuZmluZEZpcnN0Tm90IGV4Y2VwdCBzdGFydCBhdCB0aGUgZW5kLlxuICovXG5cbi8qKlxuICogQG1lbWJlciBMdWMuQXJyYXkgXG4gKiBAbWV0aG9kIGZpbmRMYXN0XG4gKiBTYW1lIGFzIEx1Yy5BcnJheS5maW5kRmlyc3QgZXhjZXB0IHN0YXJ0IGF0IHRoZSBlbmQuXG4gKi9cblxuLyoqXG4gKiBAbWVtYmVyIEx1Yy5BcnJheSBcbiAqIEBtZXRob2QgcmVtb3ZlTGFzdE5vdCBcbiAqIFNhbWUgYXMgTHVjLkFycmF5LnJlbW92ZUZpcnN0Tm90IGV4Y2VwdCBzdGFydCBhdCB0aGUgZW5kLlxuICovXG5cbi8qKlxuICogQG1lbWJlciBMdWMuQXJyYXkgXG4gKiBAbWV0aG9kIHJlbW92ZUxhc3QgXG4gKiBTYW1lIGFzIEx1Yy5BcnJheS5yZW1vdmVGaXJzdCBleGNlcHQgc3RhcnQgYXQgdGhlIGVuZC5cbiAqL1xuIiwidmFyIGFycmF5ID0gcmVxdWlyZSgnLi9hcnJheScpLFxuICAgIGlzID0gcmVxdWlyZSgnLi9pcycpLFxuICAgIEdlbmVyYXRvcjtcblxuR2VuZXJhdG9yID0ge1xuICAgIGFycmF5Rm5OYW1lczogWydmaW5kRmlyc3ROb3QnLCAnZmluZEFsbE5vdCcsICdmaW5kRmlyc3QnLCAnZmluZEFsbCcsXG4gICAgICAgICAgICAncmVtb3ZlRmlyc3ROb3QnLCAncmVtb3ZlQWxsTm90JywgJ3JlbW92ZUZpcnN0JywgJ3JlbW92ZUFsbCcsXG4gICAgICAgICAgICAncmVtb3ZlTGFzdE5vdCcsICdyZW1vdmVMYXN0JywgJ2ZpbmRMYXN0JywgJ2ZpbmRMYXN0Tm90J1xuICAgIF0sXG5cbiAgICBjcmVhdGVGbjogZnVuY3Rpb24oYXJyYXlGbk5hbWUsIGZuKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihhcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBhcnJheVthcnJheUZuTmFtZV0oYXJyLCBmbik7XG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIGNyZWF0ZUJvdW5kRm46IGZ1bmN0aW9uKGFycmF5Rm5OYW1lLCBmblRvQmluZCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oYXJyLCB2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIGZuID0gZm5Ub0JpbmQuYXBwbHkodGhpcywgYXJyYXkuZnJvbUluZGV4KGFyZ3VtZW50cywgMSkpO1xuICAgICAgICAgICAgcmV0dXJuIGFycmF5W2FycmF5Rm5OYW1lXShhcnIsIGZuKTtcbiAgICAgICAgfTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEdlbmVyYXRvcjtcblxuLyoqXG4gKiBAY2xhc3MgTHVjLkFycmF5Rm5zXG4gKiBUaGlzIGlzIGRvY3VtZW50ZWQgYXMgYSBzZXBhcmF0ZSBwYWNrYWdlIGJ1dCBpdCBhY3R1YWxseSBleGlzdHMgdW5kZXIgdGhlIFxuICogTHVjLkFycmF5IG5hbWVzcGFjZS4gIENoZWNrIG91dCB0aGUgXCJGaWx0ZXIgY2xhc3MgbWVtYmVyc1wiIGlucHV0IGJveFxuICoganVzdCB0byB0aGUgcmlnaHQgd2hlbiBzZWFyY2hpbmcgZm9yIGZ1bmN0aW9ucy5cbiAqPGJyPlxuICogXG4gKiBUaGVyZSBhcmUgYSBsb3Qgb2YgZnVuY3Rpb25zIGluIHRoaXMgcGFja2FnZSBidXQgYWxsIG9mIHRoZVxuICogIG1ldGhvZHMgZm9sbG93IHRoZSBzYW1lIGFwaS4gIFxcKkFsbCBmdW5jdGlvbnMgd2lsbCByZXR1cm4gYW4gYXJyYXkgb2YgcmVtb3ZlZCBvciBmb3VuZFxuICogaXRlbXMuICBUaGUgaXRlbXMgd2lsbCBiZSBhZGRlZCB0byB0aGUgYXJyYXkgaW4gdGhlIG9yZGVyIHRoZXkgYXJlXG4gKiBmb3VuZC4gIFxcKkZpcnN0IGZ1bmN0aW9ucyB3aWxsIHJldHVybiB0aGUgZmlyc3QgaXRlbSBhbmQgc3RvcCBpdGVyYXRpbmcgYWZ0ZXIgdGhhdCwgaWYgbm9uZVxuICogIGlzIGZvdW5kIGZhbHNlIGlzIHJldHVybmVkLiAgcmVtb3ZlXFwqIGZ1bmN0aW9ucyB3aWxsIGRpcmVjdGx5IGNoYW5nZSB0aGUgcGFzc2VkIGluIGFycmF5LlxuICogIFxcKk5vdCBmdW5jdGlvbnMgb25seSBkbyB0aGUgZm9sbG93aW5nIGFjdGlvbnMgaWYgdGhlIGNvbXBhcmlzb24gaXMgbm90IHRydWUuXG4gKiAgXFwqTGFzdCBmdW5jdGlvbnMgZG8gdGhlIHNhbWUgYXMgdGhlaXIgXFwqRmlyc3QgY291bnRlcnBhcnRzIGV4Y2VwdCB0aGF0IHRoZSBpdGVyYXRpbmdcbiAqICBzdGFydHMgYXQgdGhlIGVuZCBvZiB0aGUgYXJyYXkuIEFsbW9zdCBldmVyeSBwdWJsaWMgbWV0aG9kIG9mIEx1Yy5pcyBhdmFpbGFibGUgaXRcbiAqICB1c2VzIHRoZSBmb2xsb3dpbmcgZ3JhbW1hciBMdWMuQXJyYXlbXCJtZXRob2ROYW1lXCJcImlzTWV0aG9kTmFtZVwiXVxuICpcbiAgICAgIEx1Yy5BcnJheS5maW5kQWxsTm90RW1wdHkoW2ZhbHNlLCB0cnVlLCBudWxsLCB1bmRlZmluZWQsIDAsICcnLCBbXSwgWzFdXSlcbiAgICAgID4gW3RydWUsIDAsIFsxXV1cblxuICAgICAgTHVjLkFycmF5LmZpbmRBbGxOb3RGYWxzeShbZmFsc2UsIHRydWUsIG51bGwsIHVuZGVmaW5lZCwgMCwgJycsIFtdLCBbMV1dKVxuICAgICAgPiBbdHJ1ZSwgMCwgW10sIFsxXV1cblxuICAgICBMdWMuQXJyYXkuZmluZEZpcnN0SW4oWzEsMiwzLCB7YToxLCBiOjJ9XSwgW3thOjF9XSlcbiAgICAgPk9iamVjdCB7YTogMSwgYjogMn1cbiAgICAgXG4gICAgICBMdWMuQXJyYXkuZmluZEZpcnN0Tm90U3RyaW5nKFsxLDIsMywnNSddKVxuICAgICAgPjFcbiAgICAgIHZhciBhcnIgPSBbMSwyLDMsJzUnXTtcbiAgICAgIEx1Yy5BcnJheS5yZW1vdmVBbGxOb3RTdHJpbmcoYXJyKTtcbiAgICAgID5bMSwyLDNdXG4gICAgICBhcnJcbiAgICAgID5bXCI1XCJdXG4gKlxuICogQXMgb2YgcmlnaHQgbm93IHRoZXJlIGFyZSB0d28gZnVuY3Rpb24gc2V0cyB3aGljaCBkaWZmZXIgZnJvbSB0aGUgaXNcbiAqIGFwaS5cbiAqIFxuICAgIEx1Yy5BcnJheS5maW5kQWxsSW5zdGFuY2VPZihbMSwyLCBuZXcgRGF0ZSgpLCB7fSwgW11dLCBPYmplY3QpXG4gICAgPltkYXRlLCB7fSwgW11dXG4gICAgPkx1Yy5BcnJheS5maW5kQWxsTm90SW5zdGFuY2VPZihbMSwyLCBuZXcgRGF0ZSgpLCB7fSwgW11dLCBPYmplY3QpXG4gICAgWzEsIDJdXG4gKlxuICogXG4gICAgTHVjLkFycmF5LmZpbmRBbGxJbihbMSwyLDNdLCBbMSwyXSlcbiAgICA+WzEsIDJdXG4gICAgTHVjLkFycmF5LmZpbmRGaXJzdEluKFsxLDIsM10sIFsxLDJdKVxuICAgID4xXG4gICAgTHVjLkFycmF5LmZpbmRGaXJzdChbMSwyLDMsIHthOjEsIGI6Mn1dLCB7YToxfSlcbiAgICA+T2JqZWN0IHthOiAxLCBiOiAyfVxuXG4gICAgTHVjLkFycmF5LmZpbmRGaXJzdEluKFsxLDIsMywge2E6MSwgYjoyfV0sIFsxLHthOjF9XSwge3R5cGU6ICdkZWVwJ30pXG4gICAgPjFcbiAqL1xuXG4oZnVuY3Rpb24gX2NyZWF0ZUlzRm5zKCkge1xuICAgIHZhciBpc1RvSWdub3JlID0gWydpc1JlZ0V4cCcsICdpc0FyZ3VtZW50cyddO1xuXG4gICAgT2JqZWN0LmtleXMoaXMpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIHZhciBuYW1lID0ga2V5LnNwbGl0KCdpcycpWzFdO1xuICAgICAgICBHZW5lcmF0b3IuYXJyYXlGbk5hbWVzLmZvckVhY2goZnVuY3Rpb24oZm5OYW1lKSB7XG4gICAgICAgICAgICBpZihpc1RvSWdub3JlLmluZGV4T2Yoa2V5KSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICBhcnJheVtmbk5hbWUgKyBuYW1lXSA9IEdlbmVyYXRvci5jcmVhdGVGbihmbk5hbWUsIGlzW2tleV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn0oKSk7XG5cbihmdW5jdGlvbiBfY3JlYXRlRmFsc3lGbnMoKSB7XG4gICAgdmFyIHVzZWZ1bGxGYWxzeUZucyA9IFsnZmluZEZpcnN0Tm90JywgJ2ZpbmRBbGxOb3QnLCAncmVtb3ZlRmlyc3ROb3QnLCAncmVtb3ZlQWxsTm90JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAncmVtb3ZlRmlyc3QnLCAncmVtb3ZlQWxsJywgJ3JlbW92ZUxhc3ROb3QnLCAncmVtb3ZlTGFzdCcsICAnZmluZExhc3ROb3QnXTtcblxuICAgIHZhciBmbnMgPSB7XG4gICAgICAgICdGYWxzZSc6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbCA9PT0gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgICdUcnVlJzogZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsID09PSB0cnVlO1xuICAgICAgICB9LFxuICAgICAgICAnTnVsbCc6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbCA9PT0gbnVsbDtcbiAgICAgICAgfSxcbiAgICAgICAgJ1VuZGVmaW5lZCc6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbCA9PT0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIE9iamVjdC5rZXlzKGZucykuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgdXNlZnVsbEZhbHN5Rm5zLmZvckVhY2goZnVuY3Rpb24oZm5OYW1lKSB7XG4gICAgICAgICAgICBhcnJheVtmbk5hbWUgKyBrZXldID0gR2VuZXJhdG9yLmNyZWF0ZUZuKGZuTmFtZSwgZm5zW2tleV0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0oKSk7XG5cbihmdW5jdGlvbiBfY3JlYXRlQm91bmRGbnMoKSB7XG4gICAgdmFyIGZucyA9IHtcbiAgICAgICAgJ0luc3RhbmNlT2YnOiBmdW5jdGlvbihDb25zdHJ1Y3Rvcikge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICh2YWx1ZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sJ0luJzogZnVuY3Rpb24oYXJyLCBjKSB7XG4gICAgICAgICAgICB2YXIgZGVmYXVsdEMgPSB7dHlwZTonbG9vc2VSaWdodCd9O1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYodmFsdWUgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjZmcgPSBjIHx8IGRlZmF1bHRDO1xuICAgICAgICAgICAgICAgICAgICAvL3RoaXMgaXMgYSByaWdodCB0byBsZWZ0IGNvbXBhcmlzb24gXG4gICAgICAgICAgICAgICAgICAgIC8vZXhwZWN0ZWQgbG9vc2UgYmVoYXZpb3Igc2hvdWxkIGJlIGxvb3NlUmlnaHRcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFycmF5LmZpbmRGaXJzdChhcnIsIHZhbHVlLCBjZmcudHlwZSA9PT0gJ2xvb3NlJyA/IGRlZmF1bHRDIDogY2ZnKSAhPT0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHJldHVybiBhcnIuaW5kZXhPZihmYWxzZSkgPiAtMTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgT2JqZWN0LmtleXMoZm5zKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICBHZW5lcmF0b3IuYXJyYXlGbk5hbWVzLmZvckVhY2goZnVuY3Rpb24oZm5OYW1lKSB7XG4gICAgICAgICAgICBhcnJheVtmbk5hbWUgKyBrZXldID0gR2VuZXJhdG9yLmNyZWF0ZUJvdW5kRm4oZm5OYW1lLCBmbnNba2V5XSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSgpKTsiLCJ2YXIgaXMgPSByZXF1aXJlKCcuL2lzJyk7XG5cbmZ1bmN0aW9uIF9zdHJpY3QodmFsMSwgdmFsMil7XG4gICAgcmV0dXJuIHZhbDEgPT09IHZhbDI7XG59XG5cbmZ1bmN0aW9uIF9jb21wYXJlQXJyYXlMZW5ndGgodmFsMSwgdmFsMikge1xuICAgIHJldHVybihpcy5pc0FycmF5KHZhbDEpICYmIGlzLmlzQXJyYXkodmFsMikgICYmIHZhbDEubGVuZ3RoID09PSB2YWwyLmxlbmd0aCk7XG59XG5cbmZ1bmN0aW9uIF9zaGFsbG93QXJyYXkodmFsMSwgdmFsMikge1xuICAgIHZhciBpID0gMCxcbiAgICAgICAgbGVuO1xuICAgIFxuICAgIGlmKCFfY29tcGFyZUFycmF5TGVuZ3RoKHZhbDEsIHZhbDIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IobGVuID0gdmFsMS5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgICBpZih2YWwxW2ldICE9PSB2YWwyW2ldKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gX2RlZXBBcnJheSh2YWwxLCB2YWwyLCBjb25maWcpIHtcbiAgICB2YXIgaSA9IDAsXG4gICAgICAgIGxlbjtcbiAgICBcbiAgICBpZighX2NvbXBhcmVBcnJheUxlbmd0aCh2YWwxLCB2YWwyKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZm9yKGxlbiA9IHZhbDEubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgaWYoIWNvbXBhcmUodmFsMVtpXSx2YWwyW2ldLCBjb25maWcpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gX2NvbXBhcmVPYmplY3RLZXlzTGVuZ3RoKHZhbDEsIHZhbDIpIHtcbiAgICByZXR1cm4gKGlzLmlzT2JqZWN0KHZhbDEpICYmIGlzLmlzT2JqZWN0KHZhbDIpICYmIE9iamVjdC5rZXlzKHZhbDEpLmxlbmd0aCA9PT0gT2JqZWN0LmtleXModmFsMikubGVuZ3RoKTtcbn1cblxuZnVuY3Rpb24gX3NoYWxsb3dPYmplY3QodmFsMSwgdmFsMikge1xuICAgIHZhciBrZXksIHZhbDtcblxuICAgIGlmICghX2NvbXBhcmVPYmplY3RLZXlzTGVuZ3RoKHZhbDEsIHZhbDIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IgKGtleSBpbiB2YWwxKSB7XG4gICAgICAgIGlmICh2YWwxLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsMVtrZXldO1xuICAgICAgICAgICAgaWYgKCF2YWwyLmhhc093blByb3BlcnR5KGtleSkgfHwgdmFsMltrZXldICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBfZGVlcE9iamVjdCh2YWwxLCB2YWwyLCBjb25maWcpIHtcbiAgICB2YXIga2V5LCB2YWw7XG5cbiAgICBpZiAoIV9jb21wYXJlT2JqZWN0S2V5c0xlbmd0aCh2YWwxLCB2YWwyKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZm9yIChrZXkgaW4gdmFsMSkge1xuICAgICAgICBpZiAodmFsMS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbDFba2V5XTtcbiAgICAgICAgICAgIGlmICghdmFsMi5oYXNPd25Qcm9wZXJ0eShrZXkpIHx8IGNvbXBhcmUodmFsdWUsIHZhbDJba2V5XSwgY29uZmlnKSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuXG59XG5cbmZ1bmN0aW9uIF9sb29zZU9iamVjdCh2YWwxLCB2YWwyLCBjb25maWcpIHtcbiAgICB2YXIga2V5LCB2YWw7XG5cbiAgICBpZighKGlzLmlzT2JqZWN0KHZhbDEpICYmIGlzLmlzT2JqZWN0KHZhbDIpKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYoY29uZmlnLnR5cGUgPT09ICdsb29zZVJpZ2h0Jykge1xuICAgICAgICBmb3IgKGtleSBpbiB2YWwyKSB7XG4gICAgICAgICAgICBpZiAodmFsMi5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB2YWwyW2tleV07XG4gICAgICAgICAgICAgICAgaWYgKGNvbXBhcmUodmFsdWUsIHZhbDFba2V5XSwgY29uZmlnKSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBmb3IgKGtleSBpbiB2YWwxKSB7XG4gICAgICAgICAgICBpZiAodmFsMS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB2YWwxW2tleV07XG4gICAgICAgICAgICAgICAgaWYgKGNvbXBhcmUodmFsdWUsIHZhbDJba2V5XSwgY29uZmlnKSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICByZXR1cm4gdHJ1ZTtcblxufVxuXG5mdW5jdGlvbiBfZGF0ZSh2YWwxLCB2YWwyKSB7XG4gICAgaWYoaXMuaXNEYXRlKHZhbDEpICYmIGlzLmlzRGF0ZSh2YWwyKSkge1xuICAgICAgICByZXR1cm4gdmFsMS5nZXRUaW1lKCkgPT09IHZhbDIuZ2V0VGltZSgpO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gX2NyZWF0ZUJvdW5kQ29tcGFyZShvYmplY3QsIGZuKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBmbihvYmplY3QsIHZhbHVlKTtcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBnZXRDb21wYXJlRm4ob2JqZWN0LCBjKSB7XG4gICAgdmFyIGNvbXBhcmVGbiA9IF9zdHJpY3QsXG4gICAgICAgIGNvbmZpZyA9IGMgfHwge30sXG4gICAgICAgIHR5cGUgPSBjb25maWcudHlwZTtcblxuICAgIGlmICh0eXBlID09PSAnZGVlcCcgfHwgdHlwZSA9PT0gJ2xvb3NlJyB8fCB0eXBlID09PSAnbG9vc2VSaWdodCcgfHwgdHlwZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChpcy5pc09iamVjdChvYmplY3QpKSB7XG4gICAgICAgICAgICBjb21wYXJlRm4gPSB0eXBlID09PSAnbG9vc2UnIHx8IHR5cGUgPT09ICdsb29zZVJpZ2h0JyA/IF9sb29zZU9iamVjdCA6IF9kZWVwT2JqZWN0O1xuICAgICAgICB9IGVsc2UgaWYgKGlzLmlzQXJyYXkob2JqZWN0KSkge1xuICAgICAgICAgICAgY29tcGFyZUZuID0gX2RlZXBBcnJheTtcbiAgICAgICAgfSBlbHNlIGlmIChpcy5pc0RhdGUob2JqZWN0KSkge1xuICAgICAgICAgICAgY29tcGFyZUZuID0gX2RhdGU7XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdzaGFsbG93Jykge1xuICAgICAgICBpZiAoaXMuaXNPYmplY3Qob2JqZWN0KSkge1xuICAgICAgICAgICAgY29tcGFyZUZuID0gX3NoYWxsb3dPYmplY3Q7XG4gICAgICAgIH0gZWxzZSBpZiAoaXMuaXNBcnJheShvYmplY3QpKSB7XG4gICAgICAgICAgICBjb21wYXJlRm4gPSBfc2hhbGxvd0FycmF5O1xuICAgICAgICB9IGVsc2UgaWYgKGlzLmlzRGF0ZShvYmplY3QpKSB7XG4gICAgICAgICAgICBjb21wYXJlRm4gPSBfZGF0ZTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZSAhPT0gJ3N0cmljdCcpIHtcbiAgICAgICAgLy93ZSB3b3VsZCBiZSBkb2luZyBhIHN0cmljdCBjb21wYXJpc29uIG9uIGEgdHlwZS1vXG4gICAgICAgIC8vSSB0aGluayBhbiBlcnJvciBpcyBnb29kIGhlcmUuXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignWW91IHBhc3NlZCBpbiBhbiBpbnZhbGlkIGNvbXBhcmlzb24gdHlwZScpO1xuICAgIH1cblxuICAgIHJldHVybiBjb21wYXJlRm47XG59XG5cbi8qKlxuICogQG1lbWJlciBMdWNcbiAqIEBtZXRob2QgY29tcGFyZVxuICogXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWVzIGFyZSBlcXVhbCB0byBlYWNoXG4gKiBvdGhlci4gIEJ5IGRlZmF1bHQgYSBkZWVwIGNvbXBhcmlzb24gaXMgXG4gKiBkb25lIG9uIGFycmF5cywgZGF0ZXMgYW5kIG9iamVjdHMgYW5kIGEgc3RyaWN0IGNvbXBhcmlzb25cbiAqIGlzIGRvbmUgb24gb3RoZXIgdHlwZXMuXG4gKiBcbiAqIEBwYXJhbSAge0FueX0gdmFsMSAgXG4gKiBAcGFyYW0gIHtBbnl9IHZhbDIgICBcbiAqIEBwYXJhbSAge09iamVjdH0gW2NvbmZpZ11cbiAqIEBwYXJhbSB7U3RyaW5nfSBjb25maWcudHlwZSBwYXNzIGluICdzaGFsbG93JyBmb3IgYSBzaGFsbG93XG4gKiBjb21wYXJpc29uLCAnZGVlcCcgKGRlZmF1bHQpIGZvciBhIGRlZXAgY29tcGFyaXNvblxuICogJ3N0cmljdCcgZm9yIGEgc3RyaWN0ID09PSBjb21wYXJpc29uIGZvciBhbGwgb2JqZWN0cyBvciBcbiAqICdsb29zZScgZm9yIGEgbG9vc2UgY29tcGFyaXNvbiBvbiBvYmplY3RzLiAgQSBsb29zZSBjb21wYXJpc29uXG4gKiAgd2lsbCBjb21wYXJlIHRoZSBrZXlzIGFuZCB2YWx1ZXMgb2YgdmFsMSB0byB2YWwyIGFuZCBkb2VzIG5vdFxuICogIGNoZWNrIGlmIGtleXMgZnJvbSB2YWwyIGRvIG5vdCBleGlzdCBpbiB2YWwxLlxuICpcbiAqXG4gICAgTHVjLmNvbXBhcmUoJzEnLCAxKVxuICAgID5mYWxzZVxuICAgIEx1Yy5jb21wYXJlKHthOiAxfSwge2E6IDF9KVxuICAgID50cnVlXG4gICAgTHVjLmNvbXBhcmUoe2E6IDEsIGI6IHt9fSwge2E6IDEsIGI6IHt9IH0sIHt0eXBlOidzaGFsbG93J30pXG4gICAgPmZhbHNlXG4gICAgTHVjLmNvbXBhcmUoe2E6IDEsIGI6IHt9fSwge2E6IDEsIGI6IHt9IH0sIHt0eXBlOiAnZGVlcCd9KVxuICAgID50cnVlXG4gICAgTHVjLmNvbXBhcmUoe2E6IDEsIGI6IHt9fSwge2E6IDEsIGI6IHt9IH0sIHt0eXBlOiAnc3RyaWN0J30pXG4gICAgPmZhbHNlXG4gICAgTHVjLmNvbXBhcmUoe2E6IDF9LCB7YToxLGI6MX0pXG4gICAgPmZhbHNlXG4gICAgTHVjLmNvbXBhcmUoe2E6IDF9LCB7YToxLGI6MX0sIHt0eXBlOiAnbG9vc2UnfSlcbiAgICA+dHJ1ZVxuICAgIEx1Yy5jb21wYXJlKHthOiAxfSwge2E6MSxiOjF9LCB7dHlwZTogJ2xvb3NlJ30pXG4gICAgPnRydWVcbiAgICBMdWMuY29tcGFyZShbe2E6IDF9XSwgW3thOjEsYjoxfV0sIHt0eXBlOiAnbG9vc2UnfSlcbiAgICA+dHJ1ZVxuICAgIEx1Yy5jb21wYXJlKFt7YTogMX0sIHt9XSwgW3thOjEsYjoxfV0sIHt0eXBlOiAnbG9vc2UnfSlcbiAgICA+ZmFsc2VcbiAgICBMdWMuY29tcGFyZShbe2E6IDF9LCB7fV0sIFt7YToxLGI6MX0sIHt9XSwge3R5cGU6ICdsb29zZSd9KVxuICAgID50cnVlXG4gICAgTHVjLmNvbXBhcmUoW3thOjEsYjoxfV0sIFt7YTogMX1dLCB7dHlwZTogJ2xvb3NlJ30pXG4gICAgPmZhbHNlXG5cbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGNvbXBhcmUodmFsMSwgdmFsMiwgY29uZmlnKSB7XG4gICAgcmV0dXJuIGdldENvbXBhcmVGbih2YWwxLCBjb25maWcpKHZhbDEsIHZhbDIsIGNvbmZpZyk7XG59XG5cblxuZnVuY3Rpb24gY3JlYXRlQm91bmRDb21wYXJlRm4ob2JqZWN0LCBjKSB7XG4gICAgdmFyIGNvbXBhcmVGbiA9IGdldENvbXBhcmVGbihvYmplY3QsIGMpO1xuXG4gICAgcmV0dXJuIF9jcmVhdGVCb3VuZENvbXBhcmUob2JqZWN0LCBjb21wYXJlRm4pO1xufVxuXG5leHBvcnRzLmNvbXBhcmUgPSBjb21wYXJlO1xuZXhwb3J0cy5jcmVhdGVCb3VuZENvbXBhcmVGbiA9IGNyZWF0ZUJvdW5kQ29tcGFyZUZuOyIsInZhciBlbXB0eUZuID0gcmVxdWlyZSgnLi4vZnVuY3Rpb24nKS5lbXB0eUZuLFxuICAgIGFwcGx5ID0gcmVxdWlyZSgnLi4vb2JqZWN0JykuYXBwbHk7XG5cbi8qKlxuICogQGNsYXNzIEx1Yy5CYXNlXG4gKiBTaW1wbGUgY2xhc3MgdGhhdCBieSBkZWZhdWx0IGFwcGxpZXMgdGhlIFxuICogZmlyc3QgYXJndW1lbnQgdG8gdGhlIGluc3RhbmNlIGFuZCB0aGVuIGNhbGxzXG4gKiBMdWMuQmFzZS5pbml0LlxuICpcbiAgICB2YXIgYiA9IG5ldyBMdWMuQmFzZSh7XG4gICAgICAgIGE6IDEsXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2hleScpXG4gICAgICAgIH1cbiAgICB9KVxuICAgIGIuYVxuICAgID5oZXlcbiAgICA+MVxuICpcbiAqIFdlIGZvdW5kIHRoYXQgbW9zdCBvZiBvdXIgY2xhc3NlcyBkbyB0aGlzIHNvIHdlIG1hZGVcbiAqIGl0IHRoZSBkZWZhdWx0LiAgSGF2aW5nIGEgY29uZmlnIG9iamVjdCBhcyB0aGUgZmlyc3QgYW5kIG9ubHkgXG4gKiBwYXJhbSBrZWVwcyBhIGNsZWFuIGFwaSBhcyB3ZWxsLlxuICpcbiAgICB2YXIgQyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIEx1Yy5BcnJheS5lYWNoKHRoaXMuaXRlbXMsIHRoaXMubG9nSXRlbXMpXG4gICAgICAgIH0sXG5cbiAgICAgICAgbG9nSXRlbXM6IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGl0ZW0pO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB2YXIgYyA9IG5ldyBDKHtpdGVtczogWzEsMiwzXX0pO1xuICAgID4xXG4gICAgPjJcbiAgICA+M1xuICAgIHZhciBkID0gbmV3IEMoe2l0ZW1zOiAnQSd9KTtcbiAgICA+J0EnXG4gICAgdmFyIGUgPSBuZXcgQygpO1xuICpcbiAqIElmIHlvdSBkb24ndCBsaWtlIHRoZSBhcHBseWluZyBvZiB0aGUgY29uZmlnIHRvIHRoZSBpbnN0YW5jZSBpdCBcbiAqIGNhbiBhbHdheXMgYmUgXCJkaXNhYmxlZFwiXG4gKlxuICAgIHZhciBOb0FwcGx5ID0gTHVjLmRlZmluZSh7XG4gICAgICAgIGJlZm9yZUluaXQ6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIH0sXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgTHVjLkFycmF5LmVhY2godGhpcy5pdGVtcywgdGhpcy5sb2dJdGVtcylcbiAgICAgICAgfSxcblxuICAgICAgICBsb2dJdGVtczogZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coaXRlbSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciBjID0gbmV3IE5vQXBwbHkoe2l0ZW1zOiBbMSwyLDNdfSk7XG4gKiBcbiAqL1xuZnVuY3Rpb24gQmFzZSgpIHtcbiAgICB0aGlzLmJlZm9yZUluaXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLmluaXQoKTtcbn1cblxuQmFzZS5wcm90b3R5cGUgPSB7XG4gICAgLyoqXG4gICAgICogQnkgZGVmYXVsdCBhcHBseSB0aGUgY29uZmlnIHRvIHRoZSBcbiAgICAgKiBpbnN0YW5jZS5cbiAgICAgKi9cbiAgICBiZWZvcmVJbml0OiBmdW5jdGlvbihjb25maWcpIHtcbiAgICAgICAgYXBwbHkodGhpcywgY29uZmlnKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEBtZXRob2RcbiAgICAgKiBTaW1wbGUgaG9vayB0byBpbml0aWFsaXplXG4gICAgICogdGhlIGNsYXNzLlxuICAgICAqL1xuICAgIGluaXQ6IGVtcHR5Rm5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZTsiLCJ2YXIgQmFzZSA9IHJlcXVpcmUoJy4vYmFzZScpLFxuICAgIENvbXBvc2l0aW9uID0gcmVxdWlyZSgnLi9jb21wb3NpdGlvbicpLFxuICAgIG9iaiA9IHJlcXVpcmUoJy4uL29iamVjdCcpLFxuICAgIGFycmF5Rm5zID0gcmVxdWlyZSgnLi4vYXJyYXknKSxcbiAgICBlbXB0eUZuID0gcmVxdWlyZSgnLi4vZnVuY3Rpb24nKS5lbXB0eUZuLFxuICAgIGlzID0gcmVxdWlyZSgnLi4vaXMnKSxcbiAgICBhRWFjaCA9IGFycmF5Rm5zLmVhY2gsXG4gICAgYXBwbHkgPSBvYmouYXBwbHksXG4gICAgb0VhY2ggPSBvYmouZWFjaCxcbiAgICBvRmlsdGVyID0gb2JqLmZpbHRlcixcbiAgICBtaXggPSBvYmoubWl4LFxuICAgIGFycmF5U2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UsXG4gICAgQ2xhc3NEZWZpbmVyO1xuXG4vKipcbiAqIEBjbGFzcyBMdWMuQ2xhc3NEZWZpbmVyXG4gKiBAc2luZ2xldG9uXG4gKlxuICogU2luZ2xldG9uIHRoYXQge0BsaW5rIEx1Yy5kZWZpbmUjZGVmaW5lIEx1Yy5kZWZpbmV9IHVzZXMgdG8gZGVmaW5lIGNsYXNzZXNcbiAqL1xuXG4vKipcbiAqIEBjZmcge0Z1bmN0aW9ufSBkZWZhdWx0VHlwZSB0aGlzIGNhbiBiZSBjaGFuZ2VkIHRvIGFueSBDb25zdHJ1Y3Rvci4gIERlZmF1bHRzXG4gKiB0byBMdWMuQmFzZVxuICovXG5cbkNsYXNzRGVmaW5lciA9IHtcblxuICAgIENPTVBPU0lUSU9OU19OQU1FOiAnJGNvbXBvc2l0aW9ucycsXG5cbiAgICBkZWZhdWx0VHlwZTogQmFzZSxcblxuICAgIHByb2Nlc3NvcktleXM6IHtcbiAgICAgICAgJG1peGluczogJ19hcHBseU1peGlucycsXG4gICAgICAgICRzdGF0aWNzOiAnX2FwcGx5U3RhdGljcycsXG4gICAgICAgICRjb21wb3NpdGlvbnM6ICdfYXBwbHlDb21wb3Nlck1ldGhvZHMnLFxuICAgICAgICAkc3VwZXI6ICdfYXBwbHlTdXBlcidcbiAgICB9LFxuXG4gICAgZGVmaW5lOiBmdW5jdGlvbihvcHRzKSB7XG4gICAgICAgIHZhciBvcHRpb25zID0gb3B0cyB8fCB7fSxcbiAgICAgICAgICAgIC8vaWYgc3VwZXIgaXMgYSBmYWxzeSB2YWx1ZSBiZXNpZGVzIHVuZGVmaW5lZCB0aGF0IG1lYW5zIG5vIHN1cGVyY2xhc3NcbiAgICAgICAgICAgIFN1cGVyID0gb3B0aW9ucy4kc3VwZXIgfHwgKG9wdGlvbnMuJHN1cGVyID09PSB1bmRlZmluZWQgPyB0aGlzLmRlZmF1bHRUeXBlIDogZmFsc2UpLFxuICAgICAgICAgICAgQ29uc3RydWN0b3I7XG5cbiAgICAgICAgb3B0aW9ucy4kc3VwZXIgPSBTdXBlcjtcblxuICAgICAgICBDb25zdHJ1Y3RvciA9IHRoaXMuX2NyZWF0ZUNvbnN0cnVjdG9yKG9wdGlvbnMpO1xuXG4gICAgICAgIHRoaXMuX3Byb2Nlc3NBZnRlckNyZWF0ZShDb25zdHJ1Y3Rvciwgb3B0aW9ucyk7XG5cbiAgICAgICAgcmV0dXJuIENvbnN0cnVjdG9yO1xuICAgIH0sXG5cbiAgICBfY3JlYXRlQ29uc3RydWN0b3I6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHN1cGVyY2xhc3MgPSBvcHRpb25zLiRzdXBlcixcbiAgICAgICAgICAgIENvbnN0cnVjdG9yID0gdGhpcy5fY3JlYXRlQ29uc3RydWN0b3JGbihvcHRpb25zKTtcblxuICAgICAgICBpZihzdXBlcmNsYXNzKSB7XG4gICAgICAgICAgICBDb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyY2xhc3MucHJvdG90eXBlKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIENvbnN0cnVjdG9yO1xuICAgIH0sXG5cbiAgICBfY3JlYXRlQ29uc3RydWN0b3JGbjogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICB2YXIgc3VwZXJjbGFzcyA9IG9wdGlvbnMuJHN1cGVyLFxuICAgICAgICAgICAgQ29uc3RydWN0b3I7XG5cbiAgICAgICAgaWYgKHRoaXMuX2hhc0NvbnN0cnVjdG9yTW9kaWZ5aW5nT3B0aW9ucyhvcHRpb25zKSkge1xuICAgICAgICAgICAgQ29uc3RydWN0b3IgPSB0aGlzLl9jcmVhdGVDb25zdHJ1Y3RvckZyb21PcHRpb25zKG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoIXN1cGVyY2xhc3MpIHtcbiAgICAgICAgICAgIENvbnN0cnVjdG9yID0gZnVuY3Rpb24oKSB7fTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIENvbnN0cnVjdG9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgc3VwZXJjbGFzcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBDb25zdHJ1Y3RvcjtcbiAgICB9LFxuXG4gICAgX2hhc0NvbnN0cnVjdG9yTW9kaWZ5aW5nT3B0aW9uczogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy4kY29tcG9zaXRpb25zO1xuICAgIH0sXG5cbiAgICBfY3JlYXRlQ29uc3RydWN0b3JGcm9tT3B0aW9uczogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICB2YXIgc3VwZXJjbGFzcyA9IG9wdGlvbnMuJHN1cGVyLFxuICAgICAgICAgICAgbWUgPSB0aGlzLFxuICAgICAgICAgICAgaW5pdEJlZm9yZVN1cGVyY2xhc3MsXG4gICAgICAgICAgICBpbml0QWZ0ZXJTdXBlcmNsYXNzLFxuICAgICAgICAgICAgaW5pdDtcblxuICAgICAgICBpZiAoIXN1cGVyY2xhc3MpIHtcbiAgICAgICAgICAgIGluaXQgPSB0aGlzLl9jcmVhdGVJbml0Q2xhc3NGbihvcHRpb25zLCB7XG4gICAgICAgICAgICAgICAgYWxsOiB0cnVlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBhcmdzID0gYXJyYXlTbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgaW5pdC5jYWxsKHRoaXMsIG9wdGlvbnMsIGFyZ3MpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXRCZWZvcmVTdXBlcmNsYXNzID0gdGhpcy5fY3JlYXRlSW5pdENsYXNzRm4ob3B0aW9ucywge1xuICAgICAgICAgICAgYmVmb3JlOiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGluaXRBZnRlclN1cGVyY2xhc3MgPSB0aGlzLl9jcmVhdGVJbml0Q2xhc3NGbihvcHRpb25zLCB7XG4gICAgICAgICAgICBiZWZvcmU6IGZhbHNlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBhcmdzID0gYXJyYXlTbGljZS5jYWxsKGFyZ3VtZW50cyk7XG5cbiAgICAgICAgICAgIGluaXRCZWZvcmVTdXBlcmNsYXNzLmNhbGwodGhpcywgb3B0aW9ucywgYXJncyk7XG4gICAgICAgICAgICBzdXBlcmNsYXNzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICBpbml0QWZ0ZXJTdXBlcmNsYXNzLmNhbGwodGhpcywgb3B0aW9ucywgYXJncyk7XG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIF9jcmVhdGVJbml0Q2xhc3NGbjogZnVuY3Rpb24ob3B0aW9ucywgY29uZmlnKSB7XG4gICAgICAgIHZhciBtZSA9IHRoaXMsXG4gICAgICAgICAgICBjb21wb3NpdGlvbnMgPSB0aGlzLl9maWx0ZXJDb21wb3NpdGlvbnMoY29uZmlnLCBvcHRpb25zLiRjb21wb3NpdGlvbnMpO1xuXG4gICAgICAgIGlmKGNvbXBvc2l0aW9ucy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBlbXB0eUZuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gZnVuY3Rpb24ob3B0aW9ucywgaW5zdGFuY2VBcmdzKSB7XG4gICAgICAgICAgICBtZS5faW5pdENvbXBvc2l0aW9ucy5jYWxsKHRoaXMsIGNvbXBvc2l0aW9ucywgaW5zdGFuY2VBcmdzKTtcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgX2ZpbHRlckNvbXBvc2l0aW9uczogZnVuY3Rpb24oY29uZmlnLCBjb21wb3NpdGlvbnMpIHtcbiAgICAgICAgdmFyIGJlZm9yZSA9IGNvbmZpZy5iZWZvcmUsIFxuICAgICAgICAgICAgZmlsdGVyZWQgPSBbXTtcblxuICAgICAgICBpZihjb25maWcuYWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gY29tcG9zaXRpb25zO1xuICAgICAgICB9XG5cbiAgICAgICAgYUVhY2goY29tcG9zaXRpb25zLCBmdW5jdGlvbihjb21wb3NpdGlvbikge1xuICAgICAgICAgICAgaWYoYmVmb3JlICYmIGNvbXBvc2l0aW9uLmluaXRBZnRlciAhPT0gdHJ1ZSB8fCAoIWJlZm9yZSAmJiBjb21wb3NpdGlvbi5pbml0QWZ0ZXIgPT09IHRydWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkLnB1c2goY29tcG9zaXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gZmlsdGVyZWQ7XG4gICAgfSxcblxuICAgIF9wcm9jZXNzQWZ0ZXJDcmVhdGU6IGZ1bmN0aW9uKCRjbGFzcywgb3B0aW9ucykge1xuICAgICAgICB0aGlzLl9hcHBseVZhbHVlc1RvUHJvdG8oJGNsYXNzLCBvcHRpb25zKTtcbiAgICAgICAgdGhpcy5faGFuZGxlUG9zdFByb2Nlc3NvcnMoJGNsYXNzLCBvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgX2FwcGx5VmFsdWVzVG9Qcm90bzogZnVuY3Rpb24oJGNsYXNzLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBwcm90byA9ICRjbGFzcy5wcm90b3R5cGUsXG4gICAgICAgICAgICB2YWx1ZXMgPSBhcHBseSh7XG4gICAgICAgICAgICAgICAgJGNsYXNzOiAkY2xhc3NcbiAgICAgICAgICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgICAgIC8vRG9uJ3QgcHV0IHRoZSBkZWZpbmUgc3BlY2lmaWMgcHJvcGVydGllc1xuICAgICAgICAvL29uIHRoZSBwcm90b3R5cGVcbiAgICAgICAgb0VhY2godmFsdWVzLCBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2dldFByb2Nlc3NvcktleShrZXkpKSB7XG4gICAgICAgICAgICAgICAgcHJvdG9ba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgX2dldFByb2Nlc3NvcktleTogZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NvcktleXNba2V5XTtcbiAgICB9LFxuXG4gICAgX2hhbmRsZVBvc3RQcm9jZXNzb3JzOiBmdW5jdGlvbigkY2xhc3MsIG9wdGlvbnMpIHtcbiAgICAgICAgb0VhY2gob3B0aW9ucywgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIG1ldGhvZCA9IHRoaXMuX2dldFByb2Nlc3NvcktleShrZXkpO1xuXG4gICAgICAgICAgICBpZiAoaXMuaXNGdW5jdGlvbih0aGlzW21ldGhvZF0pKSB7XG4gICAgICAgICAgICAgICAgdGhpc1ttZXRob2RdLmNhbGwodGhpcywgJGNsYXNzLCBvcHRpb25zW2tleV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgX2FwcGx5TWl4aW5zOiBmdW5jdGlvbigkY2xhc3MsIG1peGlucykge1xuICAgICAgICB2YXIgcHJvdG8gPSAkY2xhc3MucHJvdG90eXBlO1xuICAgICAgICBhRWFjaChtaXhpbnMsIGZ1bmN0aW9uKG1peGluKSB7XG4gICAgICAgICAgICAvL2FjY2VwdCBDb25zdHJ1Y3RvcnMgb3IgT2JqZWN0c1xuICAgICAgICAgICAgdmFyIHRvTWl4ID0gbWl4aW4ucHJvdG90eXBlIHx8IG1peGluO1xuICAgICAgICAgICAgbWl4KHByb3RvLCB0b01peCk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBfYXBwbHlTdGF0aWNzOiBmdW5jdGlvbigkY2xhc3MsIHN0YXRpY3MpIHtcbiAgICAgICAgdmFyIHByb3RvdHlwZSA9ICRjbGFzcy5wcm90b3R5cGU7XG5cbiAgICAgICAgYXBwbHkoJGNsYXNzLCBzdGF0aWNzKTtcblxuICAgICAgICBpZihwcm90b3R5cGUuZ2V0U3RhdGljVmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcHJvdG90eXBlLmdldFN0YXRpY1ZhbHVlID0gdGhpcy5nZXRTdGF0aWNWYWx1ZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfYXBwbHlDb21wb3Nlck1ldGhvZHM6IGZ1bmN0aW9uKCRjbGFzcywgY29tcG9zaXRpb25zKSB7XG4gICAgICAgIHZhciBwcm90b3R5cGUgPSAkY2xhc3MucHJvdG90eXBlLFxuICAgICAgICAgICAgbWV0aG9kc1RvQ29tcG9zZTtcblxuICAgICAgICBhRWFjaChjb21wb3NpdGlvbnMsIGZ1bmN0aW9uKGNvbXBvc2l0aW9uQ29uZmlnKSB7XG4gICAgICAgICAgICB2YXIgY29tcG9zaXRpb24gPSBuZXcgQ29tcG9zaXRpb24oY29tcG9zaXRpb25Db25maWcpLFxuICAgICAgICAgICAgICAgIG5hbWUgPSBjb21wb3NpdGlvbi5uYW1lLFxuICAgICAgICAgICAgICAgIENvbnN0cnVjdG9yID0gY29tcG9zaXRpb24uQ29uc3RydWN0b3I7XG5cbiAgICAgICAgICAgIGNvbXBvc2l0aW9uLnZhbGlkYXRlKCk7XG5cbiAgICAgICAgICAgIG1ldGhvZHNUb0NvbXBvc2UgPSBjb21wb3NpdGlvbi5nZXRNZXRob2RzVG9Db21wb3NlKCk7XG5cbiAgICAgICAgICAgIG1ldGhvZHNUb0NvbXBvc2UuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgICAgICBpZiAocHJvdG90eXBlW2tleV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBwcm90b3R5cGVba2V5XSA9IHRoaXMuX2NyZWF0ZUNvbXBvc2VyUHJvdG9GbihrZXksIG5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgICAgICBpZihwcm90b3R5cGUuZ2V0Q29tcG9zaXRpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHByb3RvdHlwZS5nZXRDb21wb3NpdGlvbiA9IHRoaXMuZ2V0Q29tcG9zaXRpb247XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIF9hcHBseVN1cGVyOiBmdW5jdGlvbigkY2xhc3MsICRzdXBlcikge1xuICAgICAgICB2YXIgcHJvdG87XG4gICAgICAgIC8vc3VwZXIgY2FuIGJlIGZhbHN5IHRvIHNpZ25pZnkgbm8gc3VwZXJjbGFzc1xuICAgICAgICBpZiAoJHN1cGVyKSB7XG4gICAgICAgICAgICBwcm90byA9ICRjbGFzcy5wcm90b3R5cGU7XG4gICAgICAgICAgICBwcm90by4kc3VwZXIgPSAkc3VwZXI7XG4gICAgICAgICAgICBwcm90by4kc3VwZXJjbGFzcyA9ICRzdXBlci5wcm90b3R5cGU7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2NyZWF0ZUNvbXBvc2VyUHJvdG9GbjogZnVuY3Rpb24obWV0aG9kTmFtZSwgY29tcG9zaXRpb25OYW1lKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBjb21wID0gdGhpc1tDbGFzc0RlZmluZXIuQ09NUE9TSVRJT05TX05BTUVdW2NvbXBvc2l0aW9uTmFtZV07XG4gICAgICAgICAgICByZXR1cm4gY29tcFttZXRob2ROYW1lXS5hcHBseShjb21wLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBpZ25vcmVcbiAgICAgKiBvcHRpb25zIHtPYmplY3R9IHRoZSBjb21wb3NpdGlvbiBjb25maWcgb2JqZWN0XG4gICAgICogaW5zdGFuY2VBcmdzIHtBcnJheX0gdGhlIGFyZ3VtZW50cyBwYXNzZWQgdG8gdGhlIGluc3RhbmNlJ3NcbiAgICAgKiBjb25zdHJ1Y3Rvci5cbiAgICAgKi9cbiAgICBfaW5pdENvbXBvc2l0aW9uczogZnVuY3Rpb24oY29tcG9zaXRpb25zLCBpbnN0YW5jZUFyZ3MpIHtcbiAgICAgICAgaWYoIXRoaXNbQ2xhc3NEZWZpbmVyLkNPTVBPU0lUSU9OU19OQU1FXSkge1xuICAgICAgICAgICAgdGhpc1tDbGFzc0RlZmluZXIuQ09NUE9TSVRJT05TX05BTUVdID0ge307XG4gICAgICAgIH1cblxuICAgICAgICBhRWFjaChjb21wb3NpdGlvbnMsIGZ1bmN0aW9uKGNvbXBvc2l0aW9uQ29uZmlnKSB7XG4gICAgICAgICAgICB2YXIgY29uZmlnID0gYXBwbHkoe1xuICAgICAgICAgICAgICAgIGluc3RhbmNlOiB0aGlzLFxuICAgICAgICAgICAgICAgIGluc3RhbmNlQXJnczogaW5zdGFuY2VBcmdzXG4gICAgICAgICAgICB9LCBjb21wb3NpdGlvbkNvbmZpZyksIFxuICAgICAgICAgICAgY29tcG9zaXRpb247XG5cbiAgICAgICAgICAgIGNvbXBvc2l0aW9uID0gbmV3IENvbXBvc2l0aW9uKGNvbmZpZyk7XG5cbiAgICAgICAgICAgIHRoaXNbQ2xhc3NEZWZpbmVyLkNPTVBPU0lUSU9OU19OQU1FXVtjb21wb3NpdGlvbi5uYW1lXSA9IGNvbXBvc2l0aW9uLmdldEluc3RhbmNlKCk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICAvL01ldGhvZHMgdGhhdCBjYW4gZ2V0IGFkZGVkIHRvIHRoZSBwcm90b3R5cGVcbiAgICAvL3RoZXkgd2lsbCBiZSBjYWxsZWQgaW4gdGhlIGNvbnRleHQgb2YgdGhlIGluc3RhbmNlLlxuICAgIC8vXG4gICAgZ2V0Q29tcG9zaXRpb246IGZ1bmN0aW9uKGtleSkge1xuICAgICAgICByZXR1cm4gdGhpc1tDbGFzc0RlZmluZXIuQ09NUE9TSVRJT05TX05BTUVdW2tleV07XG4gICAgfSxcblxuICAgIGdldFN0YXRpY1ZhbHVlOiBmdW5jdGlvbiAoa2V5LCAkY2xhc3MpIHtcbiAgICAgICAgdmFyIGNsYXNzVG9GaW5kVmFsdWUgPSAkY2xhc3MgfHwgdGhpcy4kY2xhc3MsXG4gICAgICAgICAgICAkc3VwZXIsXG4gICAgICAgICAgICB2YWx1ZTtcblxuICAgICAgICB2YWx1ZSA9IGNsYXNzVG9GaW5kVmFsdWVba2V5XTtcblxuICAgICAgICBpZih2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAkc3VwZXIgPSBjbGFzc1RvRmluZFZhbHVlLnByb3RvdHlwZS4kc3VwZXI7XG4gICAgICAgICAgICBpZigkc3VwZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRTdGF0aWNWYWx1ZShrZXksICRzdXBlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG59O1xuXG5DbGFzc0RlZmluZXIuZGVmaW5lID0gQ2xhc3NEZWZpbmVyLmRlZmluZS5iaW5kKENsYXNzRGVmaW5lcik7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2xhc3NEZWZpbmVyO1xuXG4vKipcbiAqIEBjbGFzcyAgTHVjLmRlZmluZVxuICogVGhpcyBpcyBhY3R1YWxseSBhIGZ1bmN0aW9uIGJ1dCBoYXMgYSBsb3Qgb2YgZGVjZW50IGFtb3VudCBvZiBpbXBvcnRhbnQgb3B0aW9uc1xuICogc28gd2UgYXJlIGRvY3VtZW50aW5nIGl0IGxpa2UgaXQgaXMgYSBjbGFzcy4gIFByb3BlcnRpZXMgYXJlIHRoaW5ncyB0aGF0IHdpbGwgZ2V0XG4gKiBhcHBsaWVkIHRvIGluc3RhbmNlcyBvZiBjbGFzc2VzIGRlZmluZWQgd2l0aCB7QGxpbmsgTHVjLmRlZmluZSNkZWZpbmUgZGVmaW5lfS4gIE5vXG4gKiBhcmUgbmVlZGVkIGZvciB7QGxpbmsgTHVjLmRlZmluZSNkZWZpbmUgZGVmaW5pbmd9IGEgY2xhc3MuICB7QGxpbmsgTHVjLmRlZmluZSNkZWZpbmUgZGVmaW5lfVxuICoganVzdCB0YWtlcyB0aGUgcGFzc2VkIGluIGNvbmZpZyBhbmQgcHV0cyB0aGUgcHJvcGVydGllcyBvbiB0aGUgcHJvdG90eXBlIGFuZCByZXR1cm5zXG4gKiBhIENvbnN0cnVjdG9yLlxuICpcblxuICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgIGE6IDEsXG4gICAgICAgIGRvTG9nOiB0cnVlLFxuICAgICAgICBsb2dBOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmRvTG9nKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5hKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBjID0gbmV3IEMoKTtcbiAgICBjLmxvZ0EoKTtcbiAgICA+MVxuICAgIGMuYSA9IDQ1O1xuICAgIGMubG9nQSgpO1xuICAgID40NVxuICAgIGMuZG9Mb2cgPSBmYWxzZTtcbiAgICBjLmxvZ0EoKTtcblxuICAgIG5ldyBDKCkubG9nQSgpXG4gICAgPjFcblxuICpcbiAqIENoZWNrIG91dCB0aGUgZm9sbG93aW5nIGNvbmZpZ3MgdG8gYWRkIGZ1bmN0aW9uYWxpdHkgdG8gYSBjbGFzcyB3aXRob3V0IG1lc3NpbmdcbiAqIHVwIHRoZSBpbmhlcml0YW5jZSBjaGFpbi4gIEFsbCB0aGUgY29uZmlncyBoYXZlIGV4YW1wbGVzIGFuZCBkb2N1bWVudGF0aW9uIG9uIFxuICogaG93IHRvIHVzZSB0aGVtLlxuICpcbiAqIHtAbGluayBMdWMuZGVmaW5lIyRzdXBlciBzdXBlcn0gPGJyPlxuICoge0BsaW5rIEx1Yy5kZWZpbmUjJGNvbXBvc2l0aW9ucyBjb21wb3NpdGlvbnN9IDxicj5cbiAqIHtAbGluayBMdWMuZGVmaW5lIyRtaXhpbnMgbWl4aW5zfSA8YnI+XG4gKiB7QGxpbmsgTHVjLmRlZmluZSMkc3RhdGljcyBzdGF0aWNzfSA8YnI+XG4gKiBcbiAqIFxuICovXG5cbi8qKlxuICogQG1ldGhvZCAgZGVmaW5lXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIGNvbmZpZyBvYmplY3QgdXNlZCB3aGVuIGNyZWF0aW5nIHRoZSBjbGFzcy4gIEFueSBwcm9wZXJ0eSB0aGF0XG4gKiBpcyBub3QgYXBhcnQgb2YgdGhlIHNwZWNpYWwgY29uZmlncyB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIHByb3RvdHlwZS4gIENoZWNrIG91dFxuICogTHVjLmRlZmluZSBmb3IgYWxsIHRoZSBjb25maWcgb3B0aW9ucy4gICBObyBjb25maWdzIGFyZSBuZWVkZWQgdG8gZGVmaW5lIGEgY2xhc3MuXG4gKiBcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSB0aGUgZGVmaW5lZCBjbGFzc1xuICpcbiAgICB2YXIgQyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICBsb2dBOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuYSlcbiAgICAgICAgfSxcbiAgICAgICAgYTogMVxuICAgIH0pO1xuICAgIHZhciBjID0gbmV3IEMoKTtcbiAgICBjLmxvZ0EoKTtcbiAgICA+MVxuXG4gICAgYy5hID0gNDtcbiAgICBjLmxvZ0EoKTtcbiAgICA+NFxuICpcbiAqXG4gKi9cblxuLyoqXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSAkY2xhc3MgcmVmZXJlbmNlIHRvIHRoZSBpbnN0YW5jZXMgb3duIGNvbnN0cnVjdG9yLiAgVGhpc1xuICogd2lsbCBnZXQgYWRkZWQgdG8gYW55IGNsYXNzIHRoYXQgaXMgZGVmaW5lZCB3aXRoIEx1Yy5kZWZpbmUuXG4gKiBcbiAgICB2YXIgQyA9IEx1Yy5kZWZpbmUoKVxuICAgIHZhciBjID0gbmV3IEMoKVxuICAgIGMuJGNsYXNzID09PSBDXG4gICAgPnRydWVcbiAqXG4gKiBUaGVyZSBhcmUgc29tZSByZWFsbHkgZ29vZCB1c2UgY2FzZXMgdG8gaGF2ZSBhIHJlZmVyZW5jZSB0byBpdCdzXG4gKiBvd24gY29uc3RydWN0b3IuICA8YnI+IEFkZCBmdW5jdGlvbmFsaXR5IHRvIGFuIGluc3RhbmNlIGluIGEgc2ltcGxlXG4gKiBhbmQgZ2VuZXJpYyB3YXkuXG4gKlxuICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgIGFkZDogZnVuY3Rpb24oYSxiKSB7XG4gICAgICAgICAgICByZXR1cm4gYSArIGI7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vTHVjLkJhc2UgYXBwbGllcyBmaXJzdCBcbiAgICAvL2FyZyB0byB0aGUgaW5zdGFuY2VcblxuICAgIHZhciBjID0gbmV3IEMoe1xuICAgICAgICBhZGQ6IGZ1bmN0aW9uKGEsYixjKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kY2xhc3MucHJvdG90eXBlLmFkZC5jYWxsKHRoaXMsIGEsYikgKyBjO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBjLmFkZCgxLDIsMylcbiAgICA+NlxuICAgIG5ldyBDKCkuYWRkKDEsMiwzKVxuICAgID4zXG4gKlxuICogT3IgaGF2ZSBhIHNpbXBsZSBnZW5lcmljIGNsb25lIG1ldGhvZCA6XG4gKlxuICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgIGNsb25lOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBteU93blByb3BzID0ge307XG4gICAgICAgICAgICBMdWMuT2JqZWN0LmVhY2godGhpcywgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIG15T3duUHJvcHNba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgdGhpcy4kY2xhc3MobXlPd25Qcm9wcyk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciBjID0gbmV3IEMoe2E6MSxiOjIsYzozfSk7XG4gICAgYy5kID0gNDtcbiAgICB2YXIgY2xvbmUgPSBjLmNsb25lKCk7XG5cbiAgICBjbG9uZSA9PT0gY1xuICAgID5mYWxzZVxuXG4gICAgY2xvbmUuYVxuICAgID4xXG4gICAgY2xvbmUuYlxuICAgID4yXG4gICAgY2xvbmUuY1xuICAgID4zXG4gICAgY2xvbmUuZFxuICAgID40XG4gKi9cblxuLyoqXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBbJHN1cGVyXSBJZiAkc3VwZXIgaXMgbm90IGZhbHNlIG9yIG51bGwgXG4gKiB0aGUgJHN1cGVyIHByb3BlcnR5IHdpbGwgYmUgYWRkZWQgdG8gZXZlcnkgaW5zdGFuY2Ugb2YgdGhlIGRlZmluZWQgY2xhc3MsXG4gKiAkc3VwZXIgaXMgdGhlIENvbnN0cnVjdG9yIHBhc3NlZCBpbiB3aXRoIHRoZSAkc3VwZXIgY29uZmlnIG9yIHRoZSB7QGxpbmsgTHVjLkNsYXNzRGVmaW5lciNkZWZhdWx0VHlwZSBkZWZhdWx0fVxuICogXG4gICAgdmFyIEMgPSBMdWMuZGVmaW5lKClcbiAgICB2YXIgYyA9IG5ldyBDKClcbiAgICAvL0x1Yy5CYXNlIGlzIHRoZSBkZWZhdWx0IFxuICAgIGMuJHN1cGVyID09PSBMdWMuQmFzZVxuICAgID50cnVlXG4gKi9cblxuLyoqXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBbJHN1cGVyY2xhc3NdIElmICRzdXBlciBpcyBkZWZpbmVkIGl0XG4gKiB3aWxsIGJlIHRoZSBwcm90b3R5cGUgb2YgJHN1cGVyLiAgSXQgY2FuIGJlIHVzZWQgdG8gY2FsbCBwYXJlbnQnc1xuICogbWV0aG9kXG4gKiBcbiAgICBmdW5jdGlvbiBNeUNvb2xDbGFzcygpIHt9XG4gICAgTXlDb29sQ2xhc3MucHJvdG90eXBlLmFkZE51bXMgPSBmdW5jdGlvbihhLGIpIHtcbiAgICAgICAgcmV0dXJuIGEgKyBiO1xuICAgIH1cblxuICAgIHZhciBNeU90aGVyQ29vbENsYXNzID0gTHVjLmRlZmluZSh7XG4gICAgICAgICRzdXBlcjogTXlDb29sQ2xhc3MsXG4gICAgICAgIGFkZE51bXM6IGZ1bmN0aW9uKGEsIGIsIGMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLiRzdXBlcmNsYXNzLmFkZE51bXMuY2FsbCh0aGlzLCBhLCBiKSArIGM7XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgdmFyIG0gPSBuZXcgTXlPdGhlckNvb2xDbGFzcygpO1xuICAgIG0uYWRkTnVtcygxLDIsMyk7XG4gICAgPjZcbiAqL1xuXG4vKipcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGdldFN0YXRpY1ZhbHVlIHRoaXMgbWV0aG9kXG4gKiB3aWxsIGJlIGFkZGVkIHRvIGluc3RhbmNlcyB0aGF0IHVzZSB0aGUgJHN0YXRpY3NcbiAqIGNvbmZpZy5cbiAqXG4gKiBcbiAqIFRoaXMgc2hvdWxkIGJlIHVzZWQgb3ZlciB0aGlzLiRjbGFzcy5zdGF0aWNOYW1lIHRvXG4gKiBnZXQgdGhlIHZhbHVlIG92ZXIgYSBzdGF0aWMuICBJZiB0aGUgY2xhc3MgZ2V0cyBpbmhlcml0ZWRcbiAqIGZyb20gdGhpcy4kY2xhc3Mgd2lsbCBub3QgYmUgdGhlIHNhbWUuICBnZXRTdGF0aWMgdmFsdWVcbiAqIGRlYWxzIHdpdGggdGhpcyBpc3N1ZS5cbiAqIFxuICAgIHZhciBBID0gTHVjLmRlZmluZSh7XG4gICAgJHN0YXRpY3M6IHtcbiAgICBhOiAxXG4gICAgfSxcbiAgICBnZXRBQmV0dGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRTdGF0aWNWYWx1ZSgnYScpO1xuICAgIH0sXG4gICAgZ2V0QTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuJGNsYXNzLmE7XG4gICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIEIgPSBMdWMuZGVmaW5lKHtcbiAgICAkc3VwZXI6IEEsXG4gICAgJHN0YXRpY3M6IHtcbiAgICBiOiAyLFxuICAgIGM6IDNcbiAgICB9XG4gICAgfSk7XG5cbiAgICBcbiAgICB2YXIgYiA9IG5ldyBCKCk7XG4gICAgYi5nZXRBKCk7XG4gICAgPnVuZGVmaW5lZFxuICAgIGIuZ2V0QUJldHRlcigpO1xuICAgID4xXG5cbiAqIEByZXR1cm4ge09iamVjdH0gdGhlIHN0YXRpYyB2YWx1ZSBvZiB0aGUga2V5XG4gKi9cblxuICAgIFxuLyoqXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBnZXRDb21wb3NpdGlvbiB0aGlzIG1ldGhvZCB3aWxsIGJlXG4gKiB0byBpbnN0YW5jZXMgdGhhdCB1c2UgdGhlICRjb21wb3NpdGlvbnMgY29uZmlnXG4gKlxuICogQHBhcmFtICB7U3RyaW5nfSBuYW1lIHRoZSBnYW1lIG9mIHRoZSBjb21wb3NpdGlvbiB0b1xuICogZ2V0LlxuICovXG5cblxuLyoqXG4gKiBAY2ZnIHtPYmplY3R9ICRzdGF0aWNzIChvcHRpb25hbCkgQWRkIHN0YXRpYyBwcm9wZXJ0aWVzIG9yIG1ldGhvZHNcbiAqIHRvIHRoZSBjbGFzcy4gIFRoZXNlIHByb3BlcnRpZXMvbWV0aG9kcyB3aWxsIG5vdCBiZSBhYmxlIHRvIGJlXG4gKiBkaXJlY3RseSBtb2RpZmllZCBieSB0aGUgaW5zdGFuY2Ugc28gdGhleSBhcmUgZ29vZCBmb3IgZGVmaW5pbmcgZGVmYXVsdFxuICogY29uZmlncy4gIFxuICpcbiAgICB2YXIgQyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICAkc3RhdGljczoge1xuICAgICAgICAgICAgbnVtYmVyOiAxXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciBjID0gbmV3IEMoKTtcbiAgICBjLm51bWJlclxuICAgID51bmRlZmluZWRcbiAgICBDLm51bWJlclxuICAgID4xXG4gICAgXG4gKlxuICogQmFkIHRoaW5ncyBjYW4gaGFwcGVuIGlmIG5vbiBwcmltaXRpdmVzIGFyZSBwbGFjZWQgb24gdGhlIFxuICogcHJvdG90eXBlIGFuZCBpbnN0YW5jZSBzaGFyaW5nIGlzIG5vdCB3YW50ZWQuICBVc2luZyBzdGF0aWNzXG4gKiBwcmV2ZW50IHN1YmNsYXNzZXMgYW5kIGluc3RhbmNlcyBmcm9tIHVua25vd2luZ2x5IG1vZGlmeWluZ1xuICogYWxsIGluc3RhbmNlcy5cbiAqIFxuICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgIGNmZzoge1xuICAgICAgICAgICAgYTogMVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB2YXIgYyA9IG5ldyBDKCk7XG4gICAgYy5jZmcuYVxuICAgID4xXG4gICAgYy5jZmcuYSA9IDVcbiAgICBuZXcgQygpLmNmZy5hXG4gICAgPjVcbiAqXG4gKi9cblxuLyoqXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBbJHN1cGVyY2xhc3NdIElmICRzdXBlciBpcyBkZWZpbmVkIGl0XG4gKiB3aWxsIHRoZSBwcm90b3R5cGUgb2YgJHN1cGVyLiAgSXQgY2FuIGJlIHVzZWQgdG8gY2FsbCBwYXJlbnQnc1xuICogbWV0aG9kXG4gKiBcbiAgICBmdW5jdGlvbiBNeUNvb2xDbGFzcygpIHt9XG4gICAgTXlDb29sQ2xhc3MucHJvdG90eXBlLmFkZE51bXMgPSBmdW5jdGlvbihhLGIpIHtcbiAgICAgICAgcmV0dXJuIGEgKyBiO1xuICAgIH1cblxuICAgIHZhciBNeU90aGVyQ29vbENsYXNzID0gTHVjLmRlZmluZSh7XG4gICAgICAgICRzdXBlcjogTXlDb29sQ2xhc3MsXG4gICAgICAgIGFkZE51bXM6IGZ1bmN0aW9uKGEsIGIsIGMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLiRzdXBlcmNsYXNzLmFkZE51bXMuY2FsbCh0aGlzLCBhLCBiKSArIGM7XG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgdmFyIG0gPSBuZXcgTXlPdGhlckNvb2xDbGFzcygpO1xuICAgIG0uYWRkTnVtcygxLDIsMyk7XG4gICAgPjZcbiAqL1xuXG4vKipcbiAqIEBjZmcge09iamVjdC9Db25zdHJ1Y3Rvci9PYmplY3RbXS9Db25zdHJ1Y3RvcltdfSAkbWl4aW5zIChvcHRpb25hbCkgIE1peGlucyBhcmUgYSB3YXkgdG8gYWRkIGZ1bmN0aW9uYWxpdHlcbiAqIHRvIGEgY2xhc3MgdGhhdCBzaG91bGQgbm90IGFkZCBzdGF0ZS4gICRtaXhpbnMgY2FuIGJlIGVpdGhlciBvYmplY3RzIG9yIENvbnN0cnVjdG9ycy5cbiAqXG4gICAgZnVuY3Rpb24gTG9nZ2VyKCkge31cbiAgICBMb2dnZXIucHJvdG90eXBlLmxvZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhhcmd1bWVudHMpXG4gICAgfVxuXG4gICAgdmFyIEMgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgJG1peGluczogW0xvZ2dlciwge1xuICAgICAgICAgICAgd2FybjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGFyZ3VtZW50cylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfV1cbiAgICB9KTtcblxuICAgIHZhciBjID0gbmV3IEMoKTtcblxuICAgIGMubG9nKDEsMilcbiAgICA+WzEsMl1cblxuICAgIGMud2FybigzLDQpXG4gICAgPlszLDRdXG4gKlxuICovXG4vKipcbiAqIEBjZmcge0NvbnN0cnVjdG9yfSAkc3VwZXIgKG9wdGlvbmFsKSAgc3VwZXIgZm9yIHRoZSBkZWZpbmluZyBjbGFzcy4gIEJ5IEx1Yy5CYXNlXG4gKiBpcyB0aGUgZGVmYXVsdCBpZiBzdXBlciBpcyBub3QgcGFzc2VkIGluLiAgVG8gZGVmaW5lIGEgY2xhc3Mgd2l0aG91dCBhIHN1cGVyY2xhc3NcbiAqIHlvdSBjYW4gcGFzcyBpbiBmYWxzZSBvciBudWxsLlxuICpcbiAgICAgZnVuY3Rpb24gQ291bnRlcigpIHtcbiAgICAgICAgdGhpcy5jb3VudCA9IDA7XG4gICAgIH07XG5cbiAgICAgQ291bnRlci5wcm90b3R5cGUgPSB7XG4gICAgICAgIGdldENvdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvdW50O1xuICAgICAgICB9LFxuICAgICAgICBpbmNyZWFzZUNvdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuY291bnQrKztcbiAgICAgICAgfVxuICAgICB9XG5cbiAgICAgdmFyIEMgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgJHN1cGVyOkNvdW50ZXJcbiAgICB9KTtcblxuICAgIHZhciBjID0gbmV3IEMoKVxuXG4gICAgYyBpbnN0YW5jZW9mIENvdW50ZXJcbiAgICA+dHJ1ZVxuICAgIGMuaW5jcmVhc2VDb3VudCgpO1xuICAgIGMuZ2V0Q291bnQoKTtcbiAgICA+MVxuICAgIGMuY291bnRcbiAgICA+MVxuICpcbiAqIENoZWNrIG91dCBMdWMuQmFzZSB0byBzZWUgd2h5IHdlIGhhdmUgaXQgYXMgdGhlIGRlZmF1bHQuXG4gKiBcbiAgICB2YXIgQiA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICBhbUlBTHVjQmFzZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIEx1Yy5CYXNlXG4gICAgICAgIH1cbiAgICB9KVxuICAgIHZhciBiID0gbmV3IEIoKTtcbiAgICBiLmFtSUFMdWNCYXNlKCk7XG4gICAgPnRydWVcbiAqXG4gKiBcbiAqL1xuXG5cblxuLyoqXG4gKiBAY2ZnIHtPYmplY3QvT2JqZWN0W119ICRjb21wb3NpdGlvbnMgKG9wdGlvbmFsKSBjb25maWcgb2JqZWN0cyBmb3IgXG4gKiBMdWMuQ29tcG9zaXRpb24uICBDb21wb3NpdGlvbnMgYXJlIGEgZ3JlYXQgd2F5IHRvIGFkZCBiZWhhdmlvciB0byBhIGNsYXNzXG4gKiB3aXRob3V0IGV4dGVuZGluZyBpdC4gIEEgJG1peGluIGNhbiBvZmZlciBzaW1pbGFyIGZ1bmN0aW9uYWxpdHkgYnV0IHNob3VsZFxuICogYmUgc3RhdGVsZXNzLiAgQSBDb25zdHJ1Y3RvciBhbmQgYSBuYW1lIGFyZSBuZWVkZWQgZm9yIHRoZSBjb25maWcgb2JqZWN0XG4gKiBUaGUgZmlsdGVyS2V5cyBwcm9wZXJ0eSBpcyBvcHRpb25hbCBoZXJlIGJ1dCBpdCBpcyBzYXlpbmcgdGFrZSBhbGwgb2YgXG4gKiBMdWMuRXZlbnRFbWl0dGVyJ3MgaW5zdGFuY2UgbWV0aG9kcyBhbmQgbWFrZSB0aGVtIGluc3RhbmNlIG1ldGhvZHMgZm9yIEMuXG4gKiBZb3UgY2FuIGNoZWNrIG91dCBhbGwgb2YgdGhlIGNvbmZpZyBvcHRpb25zIGJ5IGxvb2tpbmcgYXQgTHVjLkNvbXBvc2l0aW9uLlxuICogXG4gICAgICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgICAgICAkY29tcG9zaXRpb25zOiB7XG4gICAgICAgICAgICAgICAgQ29uc3RydWN0b3I6IEx1Yy5FdmVudEVtaXR0ZXIsXG4gICAgICAgICAgICAgICAgbmFtZTogJ2VtaXR0ZXInLFxuICAgICAgICAgICAgICAgIGZpbHRlcktleXM6ICdhbGxNZXRob2RzJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgYyA9IG5ldyBDKCk7XG5cbiAgICAgICAgYy5vbignaGV5JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhhcmd1bWVudHMpO1xuICAgICAgICB9KTtcblxuICAgICAgICBjLmVtaXQoJ2hleScsIDEsMiwzLCAnYScpO1xuICAgICAgICA+WzEsIDIsIDMsIFwiYVwiXVxuICAgICAgICBjIGluc3RhbmNlb2YgTHVjLkV2ZW50RW1pdHRlclxuICAgICAgICA+ZmFsc2VcbiAgICAgICAgYy5fZXZlbnRzXG4gICAgICAgID51bmRlZmluZWRcbiAqXG4gKiBMdWMuRXZlbnRFbWl0dGVyIGlzIHByZWZlcnJlZCBhcyBhIGNvbXBvc2l0aW9uIG92ZXIgYSBtaXhpbiBiZWNhdXNlXG4gKiBpdCBhZGRzIGEgc3RhdGUgXCJfZXZlbnRzXCIgdG8gdGhlIHRoaXMgaW5zdGFuY2Ugd2hlbiBvbiBpcyBjYWxsZWQuXG4gKiBJdCBpcyBub3QgdGVycmlibGUgcHJhY3RpY2UgYnkgYW55IG1lYW5zIGJ1dCBpdCBpcyBub3QgZ29vZCB0byBoYXZlIGFuIG9iamVjdFxuICogdGhhdCBrbm93cyB0aGF0IGl0IG1heSBiZSBtaXhpbi4gIEV2ZW4gd29yc2UgdGhhbiB0aGF0IHdvdWxkIGJlIGEgbWl4aW4gdGhhdCBuZWVkc1xuICogdG8gYmUgaW5pdGVkIGJ5IHRoZSBkZWZpbmluZyBjbGFzcy4gIEVuY2Fwc3VsYXRpbmcgbG9naWMgaW4gYSBjbGFzc1xuICogYW5kIHVzaW5nIGl0IGFueXdoZXJlIHNlYW1sZXNzbHkgaXMgd2hlcmUgY29tcG9zaXRpb25zIHNoaW5lLiBMdWMgY29tZXMgd2l0aCB0d28gY29tbW9uIFxuICoge0BsaW5rIEx1YyNjb21wb3NpdGlvbkVudW1zIGVudW1zfSB0aGF0IHdlIGV4cGVjdCB3aWxsIGJlIHVzZWQgb2Z0ZW4uXG4gKiBcbiAqIDxicj5cbiAqIEhlcmUgaXMgYW4gZXhhbXBsZSBvZiBhIGNvbXBvc2l0aW9uIHRoYXQgZG9lc24ndFxuICogY29tZSB3aXRoIEx1YzpcbiAqXG4gICAgICAgICBmdW5jdGlvbiBDb3VudGVyKCkge1xuICAgICAgICAgICAgdGhpcy5jb3VudCA9IDA7XG4gICAgICAgICB9O1xuXG4gICAgICAgICBDb3VudGVyLnByb3RvdHlwZSA9IHtcbiAgICAgICAgICAgIGdldENvdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb3VudDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpbmNyZWFzZUNvdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvdW50Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgICB9XG5cbiAgICAgICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgICAgICAgICAgJGNvbXBvc2l0aW9uczoge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY291bnRlcicsXG4gICAgICAgICAgICAgICAgICAgIENvbnN0cnVjdG9yOiBDb3VudGVyLFxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJLZXlzOiAnYWxsTWV0aG9kcydcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBjID0gbmV3IEMoKVxuXG4gICAgICAgIGMuaW5jcmVhc2VDb3VudCgpO1xuICAgICAgICBjLmluY3JlYXNlQ291bnQoKTtcbiAgICAgICAgYy5pbmNyZWFzZUNvdW50KCk7XG4gICAgICAgIGMuZ2V0Q291bnQoKTtcbiAgICAgICAgPjNcbiAgICAgICAgYy5jb3VudFxuICpcbiAqIEhlcmUgaXMgdGhlIHBsdWdpbiBtYW5hZ2VyIGVudW0gaW4gYWN0aW9uIGtlZXAgaW4gbWluZCB0aGF0IHRoaXNcbiAqIGZ1bmN0aW9uYWxpdHkgY2FuIGJlIGFkZGVkIHRvIGFueSBjbGFzcywgbm90IGp1c3Qgb25lcyBkZWZpbmVkIHdpdGggXG4gKiBMdWMuZGVmaW5lLlxuICAgXG4gICAgZnVuY3Rpb24gTXlQbHVnaW4oKSB7XG4gICAgICAgIHRoaXMubXlDb29sTmFtZSA9ICdjb28nO1xuXG4gICAgICAgIHRoaXMuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2ltIGdldHRpbmcgaW5pdHRlZCcpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ015UGx1Z2luIGluc3RhbmNlIGJlaW5nIGRlc3Ryb3llZCcpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgQyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICAkY29tcG9zaXRpb25zOiBMdWMuY29tcG9zaXRpb25FbnVtcy5QbHVnaW5NYW5hZ2VyXG4gICAgfSk7XG5cbiAgICB2YXIgYyA9IG5ldyBDKHtcbiAgICAgICAgLy9pbmhlcml0aW5nIGZyb20gTHVjLkJhc2UgaXMgbm90IG5lZWRlZFxuICAgICAgICBzdXBlcjogbnVsbCxcbiAgICAgICAgcGx1Z2luczogW3tDb25zdHJ1Y3RvcjogTXlQbHVnaW4sIG15Q29vbE5hbWU6ICdjb28nfV1cbiAgICB9KTtcbiAgICA+aW0gZ2V0dGluZyBpbml0dGVkXG5cbiAgICBjLmdldFBsdWdpbih7bXlDb29sTmFtZTogJ2Nvbyd9KSBpbnN0YW5jZW9mIE15UGx1Z2luXG4gICAgPiB0cnVlXG5cblxuICAgIGMuYSA9IDE7XG4gICAgLy9UaGlzIHdpbGwgYmUgdGhlIGRlZmF1bHQgTHVjLlBsdWdpblxuICAgIGMuYWRkUGx1Z2luKHtcbiAgICAgICAgaW5pdDogZnVuY3Rpb24ob3duZXIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG93bmVyLmEpXG4gICAgICAgIH0sXG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0ltIGdldHRpbmcgZGVzdHJveWVkJylcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgPjFcblxuICAgIGMuZGVzdHJveUFsbFBsdWdpbnMoKTtcbiAgICA+TXlQbHVnaW4gaW5zdGFuY2UgYmVpbmcgZGVzdHJveWVkXG4gICAgPkknbSBnZXR0aW5nIGRlc3Ryb3llZC5cblxuICAgIGMuZ2V0UGx1Z2luKHtteUNvb2xOYW1lOiAnY29vJ30pXG4gICAgPmZhbHNlXG4gKlxuICogWW91IGNhbiBzZWUgdGhhdCBpdCBjYW4gYWRkIHBsdWdpbiBsaWtlIGJlaGF2aW9yIHRvIGFueSBkZWZpbmluZ1xuICogY2xhc3Mgd2l0aCBMdWMuUGx1Z2luTWFuZ2VyIHdoaWNoIGlzIGxlc3MgdGhhbiA3NSBTTE9DLlxuICovIiwidmFyIGFFYWNoID0gcmVxdWlyZSgnLi4vYXJyYXknKS5lYWNoLFxuICAgIG9iaiA9IHJlcXVpcmUoJy4uL29iamVjdCcpLFxuICAgIGVtcHR5Rm4gPSByZXF1aXJlKCcuLi9mdW5jdGlvbicpLmVtcHR5Rm4sXG4gICAgYXBwbHkgPSBvYmouYXBwbHk7XG5cblxuZnVuY3Rpb24gUGx1Z2luKGNvbmZpZykge1xuICAgIGFwcGx5KHRoaXMsIGNvbmZpZyk7XG59XG5cblBsdWdpbi5wcm90b3R5cGUgPSB7XG4gICAgaW5pdDogZW1wdHlGbixcbiAgICBkZXN0cm95OiBlbXB0eUZuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBsdWdpbjtcbiIsInZhciBQbHVnaW4gPSByZXF1aXJlKCcuL3BsdWdpbicpLFxuICAgIGlzID0gcmVxdWlyZSgnLi4vaXMnKSxcbiAgICBvYmogPSByZXF1aXJlKCcuLi9vYmplY3QnKSxcbiAgICBhcnIgPSByZXF1aXJlKCcuLi9hcnJheScpLFxuICAgIGFFYWNoID0gYXJyLmVhY2gsXG4gICAgbWl4ID0gb2JqLm1peCxcbiAgICBhcHBseSA9IG9iai5hcHBseTtcblxuZnVuY3Rpb24gUGx1Z2luTWFuYWdlcihjb25maWcpIHtcbiAgICB0aGlzLl9pbml0KGNvbmZpZyk7XG59XG5cbi8qKlxuICogQHByb3RlY3RlZFxuICogQGNsYXNzIEx1Yy5QbHVnaW5NYW5hZ2VyXG4gKiBCeSB7QGxpbmsgTHVjLmNvbXBvc2l0aW9uRW51bXMjUGx1Z2luTWFuYWdlciBkZWZhdWx0fSBhZGRcbiAqIGFsbCBvZiB0aGVzZSBwdWJsaWMgbWV0aG9kcyB0byB0aGUgaW5zdGFuY2UuICBUaGUgcHJvdGVjdGVkIG1ldGhvZHMgd2lsbFxuICogbm90IGJlIGJ1dCBpZiBQbHVnaW5NYW5hZ2VyIGRvZXNuJ3QgZG8gZXhhY3RseSB3aGF0IHlvdSBuZWVkIGl0IGRvIGl0XG4gKiBpcyBkZXNpZ25lZCB0byBiZSBzdWJjbGFzc2VkIHRvIGZpdCBhbnkgZG9tYWluLlxuICovXG5QbHVnaW5NYW5hZ2VyLnByb3RvdHlwZSA9IHtcbiAgICBkZWZhdWx0UGx1Z2luOiBQbHVnaW4sXG5cbiAgICAvKipcbiAgICAgKiBAcHJvdGVjdGVkXG4gICAgICovXG4gICAgX2luaXQ6IGZ1bmN0aW9uKGluc3RhbmNlVmFsdWVzKSB7XG4gICAgICAgIGFwcGx5KHRoaXMsIGluc3RhbmNlVmFsdWVzKTtcbiAgICAgICAgdGhpcy5wbHVnaW5zID0gW107XG4gICAgICAgIHRoaXMuX2NyZWF0ZVBsdWdpbnMoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHByb3RlY3RlZFxuICAgICAqL1xuICAgIF9jcmVhdGVQbHVnaW5zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgYUVhY2godGhpcy5fZ2V0UGx1Z2luQ29uZmlnRnJvbUluc3RhbmNlKCksIGZ1bmN0aW9uKHBsdWdpbkNvbmZpZykge1xuICAgICAgICAgICAgdGhpcy5hZGRQbHVnaW4ocGx1Z2luQ29uZmlnKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgKi9cbiAgICBfZ2V0UGx1Z2luQ29uZmlnRnJvbUluc3RhbmNlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGNvbmZpZyA9IHRoaXMuaW5zdGFuY2VBcmdzWzBdIHx8IHt9O1xuICAgICAgICByZXR1cm4gY29uZmlnLnBsdWdpbnM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZCBhIHBsdWdpbiB0byB0aGUgaW5zdGFuY2UgYW5kIGluaXQgdGhlIFxuICAgICAqIHBsdWdpbi5cbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9IHBsdWdpbkNvbmZpZ1xuICAgICAqIEByZXR1cm4ge09iamVjdH0gdGhlIGNyZWF0ZWQgcGx1Z2luIGluc3RhbmNlXG4gICAgICovXG4gICAgYWRkUGx1Z2luOiBmdW5jdGlvbihwbHVnaW5Db25maWcpIHtcbiAgICAgICAgdmFyIHBsdWdpbkluc3RhbmNlID0gdGhpcy5fY3JlYXRlUGx1Z2luKHBsdWdpbkNvbmZpZyk7XG5cbiAgICAgICAgdGhpcy5faW5pdFBsdWdpbihwbHVnaW5JbnN0YW5jZSk7XG5cbiAgICAgICAgdGhpcy5wbHVnaW5zLnB1c2gocGx1Z2luSW5zdGFuY2UpO1xuXG4gICAgICAgIHJldHVybiBwbHVnaW5JbnN0YW5jZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHByb3RlY3RlZFxuICAgICAqL1xuICAgIF9jcmVhdGVQbHVnaW46IGZ1bmN0aW9uKGNvbmZpZykge1xuICAgICAgICBjb25maWcub3duZXIgPSB0aGlzLmluc3RhbmNlO1xuXG4gICAgICAgIGlmIChjb25maWcuQ29uc3RydWN0b3IpIHtcbiAgICAgICAgICAgIC8vY2FsbCB0aGUgY29uZmlnZWQgQ29uc3RydWN0b3Igd2l0aCB0aGUgXG4gICAgICAgICAgICAvL3Bhc3NlZCBpbiBjb25maWcgYnV0IHRha2Ugb2ZmIHRoZSBDb25zdHJ1Y3RvclxuICAgICAgICAgICAgLy9jb25maWcuXG4gICAgICAgICAgICAgXG4gICAgICAgICAgICAvL1RoZSBwbHVnaW4gQ29uc3RydWN0b3IgXG4gICAgICAgICAgICAvL3Nob3VsZCBub3QgbmVlZCB0byBrbm93IGFib3V0IGl0c2VsZlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBjb25maWcuQ29uc3RydWN0b3IoYXBwbHkoY29uZmlnLCB7XG4gICAgICAgICAgICAgICAgQ29uc3RydWN0b3I6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzLmRlZmF1bHRQbHVnaW4oY29uZmlnKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHByb3RlY3RlZFxuICAgICAqL1xuICAgIF9pbml0UGx1Z2luOiBmdW5jdGlvbihwbHVnaW4pIHtcbiAgICAgICAgaWYgKGlzLmlzRnVuY3Rpb24ocGx1Z2luLmluaXQpKSB7XG4gICAgICAgICAgICBwbHVnaW4uaW5pdCh0aGlzLmluc3RhbmNlKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDYWxsIGRlc3Ryb3kgb24gYWxsIG9mIHRoZSBwbHVnaW5zXG4gICAgICogYW5kIHJlbW92ZSB0aGVtIGZyb20gdGhlIGFycmF5LlxuICAgICAqL1xuICAgIGRlc3Ryb3lBbGxQbHVnaW5zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5wbHVnaW5zLmZvckVhY2goZnVuY3Rpb24ocGx1Z2luKSB7XG4gICAgICAgICAgICB0aGlzLl9kZXN0cm95UGx1Z2luKHBsdWdpbik7XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIHRoaXMucGx1Z2lucyA9IFtdO1xuICAgIH0sXG5cbiAgICBfZGVzdHJveVBsdWdpbjogZnVuY3Rpb24ocGx1Z2luKSB7XG4gICAgICAgIGlmIChpcy5pc0Z1bmN0aW9uKHBsdWdpbi5kZXN0cm95KSkge1xuICAgICAgICAgICAgcGx1Z2luLmRlc3Ryb3kodGhpcy5pbnN0YW5jZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIHRoZSBwbHVnaW4gZnJvbSB0aGUgcGx1Z2lucyBhcnJheSBhbmQgXG4gICAgICogaWYgZm91bmQgZGVzdHJveSBpdC5cbiAgICAgKiBAcGFyYW0gIHtPYmplY3QvQ29uc3RydWN0b3J9IG9iamVjdCB0byB1c2UgdG8gbWF0Y2ggXG4gICAgICogdGhlIHBsdWdpbiB0byByZW1vdmUuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSB0aGUgZGVzdHJveWVkIHBsdWdpbi5cbiAgICAgKi9cbiAgICBkZXN0cm95UGx1Z2luOiBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgdmFyIHBsdWdpbiA9IHRoaXMuZ2V0UGx1Z2luKG9iaik7XG5cbiAgICAgICAgaWYocGx1Z2luKSB7XG4gICAgICAgICAgICB0aGlzLl9kZXN0cm95UGx1Z2luKHBsdWdpbik7XG4gICAgICAgICAgICBhcnIucmVtb3ZlRmlyc3QodGhpcy5wbHVnaW5zLCBwbHVnaW4sIHt0eXBlOiAnc3RyaWN0J30pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBsdWdpbjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IGEgcGx1Z2luIGluc3RhbmNlLlxuICAgICAqIEBwYXJhbSAge09iamVjdH0gb2JqIFxuICAgICAqIEByZXR1cm4ge09iamVjdH0gdGhlIHBsdWdpbiBpbnN0YW5jZSBpZiBmb3VuZC5cbiAgICAgKi9cbiAgICBnZXRQbHVnaW46IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICBpZiAoaXMuaXNGdW5jdGlvbihvYmopKSB7XG4gICAgICAgICAgICByZXR1cm4gYXJyLmZpbmRGaXJzdEluc3RhbmNlT2YodGhpcy5wbHVnaW5zLCBvYmopO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhcnIuZmluZEZpcnN0KHRoaXMucGx1Z2lucywgb2JqLCB7dHlwZTogJ2xvb3NlJ30pO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUGx1Z2luTWFuYWdlcjsiLCJ2YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnLi4vZXZlbnRzL2V2ZW50RW1pdHRlcicpLFxuICAgIFBsdWdpbk1hbmFnZXIgPSByZXF1aXJlKCcuL3BsdWdpbk1hbmFnZXInKTtcblxuLyoqXG4gKiBAY2xhc3MgTHVjLmNvbXBvc2l0aW9uRW51bXNcbiAqIENvbXBvc2l0aW9uIGVudW1zIGFyZSBqdXN0IGNvbW1vbiBjb25maWcgb2JqZWN0cyBmb3IgTHVjLkNvbXBvc2l0aW9uLlxuICogSGVyZSBpcyBhbiBleGFtcGxlIG9mIGEgY29tcG9zaXRpb24gdGhhdCB1c2VzIEV2ZW50RW1pdHRlciBidXQgb25seVxuICogcHV0cyB0aGUgZW1pdCBtZXRob2Qgb24gdGhlIHByb3RvdHlwZS5cbiAqXG4gICAgdmFyIEMgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgJGNvbXBvc2l0aW9uczoge1xuICAgICAgICAgICAgZGVmYXVsdHM6IEx1Yy5jb21wb3NpdGlvbkVudW1zLkV2ZW50RW1pdHRlcixcbiAgICAgICAgICAgIGZpbHRlcktleXM6IFsnZW1pdCddXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciBjID0gbmV3IEMoKTtcblxuICAgIHR5cGVvZiBjLmVtaXRcbiAgICA+XCJmdW5jdGlvblwiXG4gICAgdHlwZW9mIGMub25cbiAgICBcInVuZGVmaW5lZFwiXG4gKiBcbiAqL1xuXG4vKipcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBFdmVudEVtaXR0ZXJcbiAqL1xubW9kdWxlLmV4cG9ydHMuRXZlbnRFbWl0dGVyID0ge1xuICAgIENvbnN0cnVjdG9yOiBFdmVudEVtaXR0ZXIsXG4gICAgbmFtZTogJ2VtaXR0ZXInLFxuICAgIGZpbHRlcktleXM6ICdhbGxNZXRob2RzJ1xufTtcblxuXG4vKipcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBQbHVnaW5NYW5hZ2VyXG4gKi9cbm1vZHVsZS5leHBvcnRzLlBsdWdpbk1hbmFnZXIgPSB7XG4gICAgbmFtZTogJ3BsdWdpbnMnLFxuICAgIGluaXRBZnRlcjogdHJ1ZSxcbiAgICBDb25zdHJ1Y3RvcjogUGx1Z2luTWFuYWdlcixcbiAgICBjcmVhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbWFuYWdlciA9IG5ldyB0aGlzLkNvbnN0cnVjdG9yKHtcbiAgICAgICAgICAgIGluc3RhbmNlOiB0aGlzLmluc3RhbmNlLFxuICAgICAgICAgICAgaW5zdGFuY2VBcmdzOiB0aGlzLmluc3RhbmNlQXJnc1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gbWFuYWdlcjtcbiAgICB9LFxuICAgIGZpbHRlcktleXM6ICdwdWJsaWNNZXRob2RzJ1xufTsiLCIoZnVuY3Rpb24oKXsvLyBDb3B5cmlnaHQgMjAwOS0yMDEyIGJ5IGNvbnRyaWJ1dG9ycywgTUlUIExpY2Vuc2Vcbi8vIHZpbTogdHM9NCBzdHM9NCBzdz00IGV4cGFuZHRhYlxuXG4vLyBNb2R1bGUgc3lzdGVtcyBtYWdpYyBkYW5jZVxuKGZ1bmN0aW9uIChkZWZpbml0aW9uKSB7XG4gICAgLy8gUmVxdWlyZUpTXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGRlZmluZShkZWZpbml0aW9uKTtcbiAgICAvLyBZVUkzXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgWVVJID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBZVUkuYWRkKFwiZXM1XCIsIGRlZmluaXRpb24pO1xuICAgIC8vIENvbW1vbkpTIGFuZCA8c2NyaXB0PlxuICAgIH0gZWxzZSB7XG4gICAgICAgIGRlZmluaXRpb24oKTtcbiAgICB9XG59KShmdW5jdGlvbiAoKSB7XG5cbi8qKlxuICogQnJpbmdzIGFuIGVudmlyb25tZW50IGFzIGNsb3NlIHRvIEVDTUFTY3JpcHQgNSBjb21wbGlhbmNlXG4gKiBhcyBpcyBwb3NzaWJsZSB3aXRoIHRoZSBmYWNpbGl0aWVzIG9mIGVyc3R3aGlsZSBlbmdpbmVzLlxuICpcbiAqIEFubm90YXRlZCBFUzU6IGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8gKHNwZWNpZmljIGxpbmtzIGJlbG93KVxuICogRVM1IFNwZWM6IGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9wdWJsaWNhdGlvbnMvZmlsZXMvRUNNQS1TVC9FY21hLTI2Mi5wZGZcbiAqIFJlcXVpcmVkIHJlYWRpbmc6IGh0dHA6Ly9qYXZhc2NyaXB0d2VibG9nLndvcmRwcmVzcy5jb20vMjAxMS8xMi8wNS9leHRlbmRpbmctamF2YXNjcmlwdC1uYXRpdmVzL1xuICovXG5cbi8vXG4vLyBGdW5jdGlvblxuLy8gPT09PT09PT1cbi8vXG5cbi8vIEVTLTUgMTUuMy40LjVcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjMuNC41XG5cbmZ1bmN0aW9uIEVtcHR5KCkge31cblxuaWYgKCFGdW5jdGlvbi5wcm90b3R5cGUuYmluZCkge1xuICAgIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gYmluZCh0aGF0KSB7IC8vIC5sZW5ndGggaXMgMVxuICAgICAgICAvLyAxLiBMZXQgVGFyZ2V0IGJlIHRoZSB0aGlzIHZhbHVlLlxuICAgICAgICB2YXIgdGFyZ2V0ID0gdGhpcztcbiAgICAgICAgLy8gMi4gSWYgSXNDYWxsYWJsZShUYXJnZXQpIGlzIGZhbHNlLCB0aHJvdyBhIFR5cGVFcnJvciBleGNlcHRpb24uXG4gICAgICAgIGlmICh0eXBlb2YgdGFyZ2V0ICE9IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kIGNhbGxlZCBvbiBpbmNvbXBhdGlibGUgXCIgKyB0YXJnZXQpO1xuICAgICAgICB9XG4gICAgICAgIC8vIDMuIExldCBBIGJlIGEgbmV3IChwb3NzaWJseSBlbXB0eSkgaW50ZXJuYWwgbGlzdCBvZiBhbGwgb2YgdGhlXG4gICAgICAgIC8vICAgYXJndW1lbnQgdmFsdWVzIHByb3ZpZGVkIGFmdGVyIHRoaXNBcmcgKGFyZzEsIGFyZzIgZXRjKSwgaW4gb3JkZXIuXG4gICAgICAgIC8vIFhYWCBzbGljZWRBcmdzIHdpbGwgc3RhbmQgaW4gZm9yIFwiQVwiIGlmIHVzZWRcbiAgICAgICAgdmFyIGFyZ3MgPSBfQXJyYXlfc2xpY2VfLmNhbGwoYXJndW1lbnRzLCAxKTsgLy8gZm9yIG5vcm1hbCBjYWxsXG4gICAgICAgIC8vIDQuIExldCBGIGJlIGEgbmV3IG5hdGl2ZSBFQ01BU2NyaXB0IG9iamVjdC5cbiAgICAgICAgLy8gMTEuIFNldCB0aGUgW1tQcm90b3R5cGVdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBGIHRvIHRoZSBzdGFuZGFyZFxuICAgICAgICAvLyAgIGJ1aWx0LWluIEZ1bmN0aW9uIHByb3RvdHlwZSBvYmplY3QgYXMgc3BlY2lmaWVkIGluIDE1LjMuMy4xLlxuICAgICAgICAvLyAxMi4gU2V0IHRoZSBbW0NhbGxdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBGIGFzIGRlc2NyaWJlZCBpblxuICAgICAgICAvLyAgIDE1LjMuNC41LjEuXG4gICAgICAgIC8vIDEzLiBTZXQgdGhlIFtbQ29uc3RydWN0XV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgRiBhcyBkZXNjcmliZWQgaW5cbiAgICAgICAgLy8gICAxNS4zLjQuNS4yLlxuICAgICAgICAvLyAxNC4gU2V0IHRoZSBbW0hhc0luc3RhbmNlXV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgRiBhcyBkZXNjcmliZWQgaW5cbiAgICAgICAgLy8gICAxNS4zLjQuNS4zLlxuICAgICAgICB2YXIgYm91bmQgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIGlmICh0aGlzIGluc3RhbmNlb2YgYm91bmQpIHtcbiAgICAgICAgICAgICAgICAvLyAxNS4zLjQuNS4yIFtbQ29uc3RydWN0XV1cbiAgICAgICAgICAgICAgICAvLyBXaGVuIHRoZSBbW0NvbnN0cnVjdF1dIGludGVybmFsIG1ldGhvZCBvZiBhIGZ1bmN0aW9uIG9iamVjdCxcbiAgICAgICAgICAgICAgICAvLyBGIHRoYXQgd2FzIGNyZWF0ZWQgdXNpbmcgdGhlIGJpbmQgZnVuY3Rpb24gaXMgY2FsbGVkIHdpdGggYVxuICAgICAgICAgICAgICAgIC8vIGxpc3Qgb2YgYXJndW1lbnRzIEV4dHJhQXJncywgdGhlIGZvbGxvd2luZyBzdGVwcyBhcmUgdGFrZW46XG4gICAgICAgICAgICAgICAgLy8gMS4gTGV0IHRhcmdldCBiZSB0aGUgdmFsdWUgb2YgRidzIFtbVGFyZ2V0RnVuY3Rpb25dXVxuICAgICAgICAgICAgICAgIC8vICAgaW50ZXJuYWwgcHJvcGVydHkuXG4gICAgICAgICAgICAgICAgLy8gMi4gSWYgdGFyZ2V0IGhhcyBubyBbW0NvbnN0cnVjdF1dIGludGVybmFsIG1ldGhvZCwgYVxuICAgICAgICAgICAgICAgIC8vICAgVHlwZUVycm9yIGV4Y2VwdGlvbiBpcyB0aHJvd24uXG4gICAgICAgICAgICAgICAgLy8gMy4gTGV0IGJvdW5kQXJncyBiZSB0aGUgdmFsdWUgb2YgRidzIFtbQm91bmRBcmdzXV0gaW50ZXJuYWxcbiAgICAgICAgICAgICAgICAvLyAgIHByb3BlcnR5LlxuICAgICAgICAgICAgICAgIC8vIDQuIExldCBhcmdzIGJlIGEgbmV3IGxpc3QgY29udGFpbmluZyB0aGUgc2FtZSB2YWx1ZXMgYXMgdGhlXG4gICAgICAgICAgICAgICAgLy8gICBsaXN0IGJvdW5kQXJncyBpbiB0aGUgc2FtZSBvcmRlciBmb2xsb3dlZCBieSB0aGUgc2FtZVxuICAgICAgICAgICAgICAgIC8vICAgdmFsdWVzIGFzIHRoZSBsaXN0IEV4dHJhQXJncyBpbiB0aGUgc2FtZSBvcmRlci5cbiAgICAgICAgICAgICAgICAvLyA1LiBSZXR1cm4gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0NvbnN0cnVjdF1dIGludGVybmFsXG4gICAgICAgICAgICAgICAgLy8gICBtZXRob2Qgb2YgdGFyZ2V0IHByb3ZpZGluZyBhcmdzIGFzIHRoZSBhcmd1bWVudHMuXG5cbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gdGFyZ2V0LmFwcGx5KFxuICAgICAgICAgICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgICAgICAgICBhcmdzLmNvbmNhdChfQXJyYXlfc2xpY2VfLmNhbGwoYXJndW1lbnRzKSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGlmIChPYmplY3QocmVzdWx0KSA9PT0gcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIDE1LjMuNC41LjEgW1tDYWxsXV1cbiAgICAgICAgICAgICAgICAvLyBXaGVuIHRoZSBbW0NhbGxdXSBpbnRlcm5hbCBtZXRob2Qgb2YgYSBmdW5jdGlvbiBvYmplY3QsIEYsXG4gICAgICAgICAgICAgICAgLy8gd2hpY2ggd2FzIGNyZWF0ZWQgdXNpbmcgdGhlIGJpbmQgZnVuY3Rpb24gaXMgY2FsbGVkIHdpdGggYVxuICAgICAgICAgICAgICAgIC8vIHRoaXMgdmFsdWUgYW5kIGEgbGlzdCBvZiBhcmd1bWVudHMgRXh0cmFBcmdzLCB0aGUgZm9sbG93aW5nXG4gICAgICAgICAgICAgICAgLy8gc3RlcHMgYXJlIHRha2VuOlxuICAgICAgICAgICAgICAgIC8vIDEuIExldCBib3VuZEFyZ3MgYmUgdGhlIHZhbHVlIG9mIEYncyBbW0JvdW5kQXJnc11dIGludGVybmFsXG4gICAgICAgICAgICAgICAgLy8gICBwcm9wZXJ0eS5cbiAgICAgICAgICAgICAgICAvLyAyLiBMZXQgYm91bmRUaGlzIGJlIHRoZSB2YWx1ZSBvZiBGJ3MgW1tCb3VuZFRoaXNdXSBpbnRlcm5hbFxuICAgICAgICAgICAgICAgIC8vICAgcHJvcGVydHkuXG4gICAgICAgICAgICAgICAgLy8gMy4gTGV0IHRhcmdldCBiZSB0aGUgdmFsdWUgb2YgRidzIFtbVGFyZ2V0RnVuY3Rpb25dXSBpbnRlcm5hbFxuICAgICAgICAgICAgICAgIC8vICAgcHJvcGVydHkuXG4gICAgICAgICAgICAgICAgLy8gNC4gTGV0IGFyZ3MgYmUgYSBuZXcgbGlzdCBjb250YWluaW5nIHRoZSBzYW1lIHZhbHVlcyBhcyB0aGVcbiAgICAgICAgICAgICAgICAvLyAgIGxpc3QgYm91bmRBcmdzIGluIHRoZSBzYW1lIG9yZGVyIGZvbGxvd2VkIGJ5IHRoZSBzYW1lXG4gICAgICAgICAgICAgICAgLy8gICB2YWx1ZXMgYXMgdGhlIGxpc3QgRXh0cmFBcmdzIGluIHRoZSBzYW1lIG9yZGVyLlxuICAgICAgICAgICAgICAgIC8vIDUuIFJldHVybiB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbQ2FsbF1dIGludGVybmFsIG1ldGhvZFxuICAgICAgICAgICAgICAgIC8vICAgb2YgdGFyZ2V0IHByb3ZpZGluZyBib3VuZFRoaXMgYXMgdGhlIHRoaXMgdmFsdWUgYW5kXG4gICAgICAgICAgICAgICAgLy8gICBwcm92aWRpbmcgYXJncyBhcyB0aGUgYXJndW1lbnRzLlxuXG4gICAgICAgICAgICAgICAgLy8gZXF1aXY6IHRhcmdldC5jYWxsKHRoaXMsIC4uLmJvdW5kQXJncywgLi4uYXJncylcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0LmFwcGx5KFxuICAgICAgICAgICAgICAgICAgICB0aGF0LFxuICAgICAgICAgICAgICAgICAgICBhcmdzLmNvbmNhdChfQXJyYXlfc2xpY2VfLmNhbGwoYXJndW1lbnRzKSlcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfTtcbiAgICAgICAgaWYodGFyZ2V0LnByb3RvdHlwZSkge1xuICAgICAgICAgICAgRW1wdHkucHJvdG90eXBlID0gdGFyZ2V0LnByb3RvdHlwZTtcbiAgICAgICAgICAgIGJvdW5kLnByb3RvdHlwZSA9IG5ldyBFbXB0eSgpO1xuICAgICAgICAgICAgLy8gQ2xlYW4gdXAgZGFuZ2xpbmcgcmVmZXJlbmNlcy5cbiAgICAgICAgICAgIEVtcHR5LnByb3RvdHlwZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgLy8gWFhYIGJvdW5kLmxlbmd0aCBpcyBuZXZlciB3cml0YWJsZSwgc28gZG9uJ3QgZXZlbiB0cnlcbiAgICAgICAgLy9cbiAgICAgICAgLy8gMTUuIElmIHRoZSBbW0NsYXNzXV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgVGFyZ2V0IGlzIFwiRnVuY3Rpb25cIiwgdGhlblxuICAgICAgICAvLyAgICAgYS4gTGV0IEwgYmUgdGhlIGxlbmd0aCBwcm9wZXJ0eSBvZiBUYXJnZXQgbWludXMgdGhlIGxlbmd0aCBvZiBBLlxuICAgICAgICAvLyAgICAgYi4gU2V0IHRoZSBsZW5ndGggb3duIHByb3BlcnR5IG9mIEYgdG8gZWl0aGVyIDAgb3IgTCwgd2hpY2hldmVyIGlzXG4gICAgICAgIC8vICAgICAgIGxhcmdlci5cbiAgICAgICAgLy8gMTYuIEVsc2Ugc2V0IHRoZSBsZW5ndGggb3duIHByb3BlcnR5IG9mIEYgdG8gMC5cbiAgICAgICAgLy8gMTcuIFNldCB0aGUgYXR0cmlidXRlcyBvZiB0aGUgbGVuZ3RoIG93biBwcm9wZXJ0eSBvZiBGIHRvIHRoZSB2YWx1ZXNcbiAgICAgICAgLy8gICBzcGVjaWZpZWQgaW4gMTUuMy41LjEuXG5cbiAgICAgICAgLy8gVE9ET1xuICAgICAgICAvLyAxOC4gU2V0IHRoZSBbW0V4dGVuc2libGVdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBGIHRvIHRydWUuXG5cbiAgICAgICAgLy8gVE9ET1xuICAgICAgICAvLyAxOS4gTGV0IHRocm93ZXIgYmUgdGhlIFtbVGhyb3dUeXBlRXJyb3JdXSBmdW5jdGlvbiBPYmplY3QgKDEzLjIuMykuXG4gICAgICAgIC8vIDIwLiBDYWxsIHRoZSBbW0RlZmluZU93blByb3BlcnR5XV0gaW50ZXJuYWwgbWV0aG9kIG9mIEYgd2l0aFxuICAgICAgICAvLyAgIGFyZ3VtZW50cyBcImNhbGxlclwiLCBQcm9wZXJ0eURlc2NyaXB0b3Ige1tbR2V0XV06IHRocm93ZXIsIFtbU2V0XV06XG4gICAgICAgIC8vICAgdGhyb3dlciwgW1tFbnVtZXJhYmxlXV06IGZhbHNlLCBbW0NvbmZpZ3VyYWJsZV1dOiBmYWxzZX0sIGFuZFxuICAgICAgICAvLyAgIGZhbHNlLlxuICAgICAgICAvLyAyMS4gQ2FsbCB0aGUgW1tEZWZpbmVPd25Qcm9wZXJ0eV1dIGludGVybmFsIG1ldGhvZCBvZiBGIHdpdGhcbiAgICAgICAgLy8gICBhcmd1bWVudHMgXCJhcmd1bWVudHNcIiwgUHJvcGVydHlEZXNjcmlwdG9yIHtbW0dldF1dOiB0aHJvd2VyLFxuICAgICAgICAvLyAgIFtbU2V0XV06IHRocm93ZXIsIFtbRW51bWVyYWJsZV1dOiBmYWxzZSwgW1tDb25maWd1cmFibGVdXTogZmFsc2V9LFxuICAgICAgICAvLyAgIGFuZCBmYWxzZS5cblxuICAgICAgICAvLyBUT0RPXG4gICAgICAgIC8vIE5PVEUgRnVuY3Rpb24gb2JqZWN0cyBjcmVhdGVkIHVzaW5nIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kIGRvIG5vdFxuICAgICAgICAvLyBoYXZlIGEgcHJvdG90eXBlIHByb3BlcnR5IG9yIHRoZSBbW0NvZGVdXSwgW1tGb3JtYWxQYXJhbWV0ZXJzXV0sIGFuZFxuICAgICAgICAvLyBbW1Njb3BlXV0gaW50ZXJuYWwgcHJvcGVydGllcy5cbiAgICAgICAgLy8gWFhYIGNhbid0IGRlbGV0ZSBwcm90b3R5cGUgaW4gcHVyZS1qcy5cblxuICAgICAgICAvLyAyMi4gUmV0dXJuIEYuXG4gICAgICAgIHJldHVybiBib3VuZDtcbiAgICB9O1xufVxuXG4vLyBTaG9ydGN1dCB0byBhbiBvZnRlbiBhY2Nlc3NlZCBwcm9wZXJ0aWVzLCBpbiBvcmRlciB0byBhdm9pZCBtdWx0aXBsZVxuLy8gZGVyZWZlcmVuY2UgdGhhdCBjb3N0cyB1bml2ZXJzYWxseS5cbi8vIF9QbGVhc2Ugbm90ZTogU2hvcnRjdXRzIGFyZSBkZWZpbmVkIGFmdGVyIGBGdW5jdGlvbi5wcm90b3R5cGUuYmluZGAgYXMgd2Vcbi8vIHVzIGl0IGluIGRlZmluaW5nIHNob3J0Y3V0cy5cbnZhciBjYWxsID0gRnVuY3Rpb24ucHJvdG90eXBlLmNhbGw7XG52YXIgcHJvdG90eXBlT2ZBcnJheSA9IEFycmF5LnByb3RvdHlwZTtcbnZhciBwcm90b3R5cGVPZk9iamVjdCA9IE9iamVjdC5wcm90b3R5cGU7XG52YXIgX0FycmF5X3NsaWNlXyA9IHByb3RvdHlwZU9mQXJyYXkuc2xpY2U7XG4vLyBIYXZpbmcgYSB0b1N0cmluZyBsb2NhbCB2YXJpYWJsZSBuYW1lIGJyZWFrcyBpbiBPcGVyYSBzbyB1c2UgX3RvU3RyaW5nLlxudmFyIF90b1N0cmluZyA9IGNhbGwuYmluZChwcm90b3R5cGVPZk9iamVjdC50b1N0cmluZyk7XG52YXIgb3ducyA9IGNhbGwuYmluZChwcm90b3R5cGVPZk9iamVjdC5oYXNPd25Qcm9wZXJ0eSk7XG5cbi8vIElmIEpTIGVuZ2luZSBzdXBwb3J0cyBhY2Nlc3NvcnMgY3JlYXRpbmcgc2hvcnRjdXRzLlxudmFyIGRlZmluZUdldHRlcjtcbnZhciBkZWZpbmVTZXR0ZXI7XG52YXIgbG9va3VwR2V0dGVyO1xudmFyIGxvb2t1cFNldHRlcjtcbnZhciBzdXBwb3J0c0FjY2Vzc29ycztcbmlmICgoc3VwcG9ydHNBY2Nlc3NvcnMgPSBvd25zKHByb3RvdHlwZU9mT2JqZWN0LCBcIl9fZGVmaW5lR2V0dGVyX19cIikpKSB7XG4gICAgZGVmaW5lR2V0dGVyID0gY2FsbC5iaW5kKHByb3RvdHlwZU9mT2JqZWN0Ll9fZGVmaW5lR2V0dGVyX18pO1xuICAgIGRlZmluZVNldHRlciA9IGNhbGwuYmluZChwcm90b3R5cGVPZk9iamVjdC5fX2RlZmluZVNldHRlcl9fKTtcbiAgICBsb29rdXBHZXR0ZXIgPSBjYWxsLmJpbmQocHJvdG90eXBlT2ZPYmplY3QuX19sb29rdXBHZXR0ZXJfXyk7XG4gICAgbG9va3VwU2V0dGVyID0gY2FsbC5iaW5kKHByb3RvdHlwZU9mT2JqZWN0Ll9fbG9va3VwU2V0dGVyX18pO1xufVxuXG4vL1xuLy8gQXJyYXlcbi8vID09PT09XG4vL1xuXG4vLyBFUzUgMTUuNC40LjEyXG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS40LjQuMTJcbi8vIERlZmF1bHQgdmFsdWUgZm9yIHNlY29uZCBwYXJhbVxuLy8gW2J1Z2ZpeCwgaWVsdDksIG9sZCBicm93c2Vyc11cbi8vIElFIDwgOSBidWc6IFsxLDJdLnNwbGljZSgwKS5qb2luKFwiXCIpID09IFwiXCIgYnV0IHNob3VsZCBiZSBcIjEyXCJcbmlmIChbMSwyXS5zcGxpY2UoMCkubGVuZ3RoICE9IDIpIHtcbiAgICB2YXIgYXJyYXlfc3BsaWNlID0gQXJyYXkucHJvdG90eXBlLnNwbGljZTtcblxuICAgIGlmKGZ1bmN0aW9uKCkgeyAvLyB0ZXN0IElFIDwgOSB0byBzcGxpY2UgYnVnIC0gc2VlIGlzc3VlICMxMzhcbiAgICAgICAgZnVuY3Rpb24gbWFrZUFycmF5KGwpIHtcbiAgICAgICAgICAgIHZhciBhID0gW107XG4gICAgICAgICAgICB3aGlsZSAobC0tKSB7XG4gICAgICAgICAgICAgICAgYS51bnNoaWZ0KGwpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGFycmF5ID0gW11cbiAgICAgICAgICAgICwgbGVuZ3RoQmVmb3JlXG4gICAgICAgIDtcblxuICAgICAgICBhcnJheS5zcGxpY2UuYmluZChhcnJheSwgMCwgMCkuYXBwbHkobnVsbCwgbWFrZUFycmF5KDIwKSk7XG4gICAgICAgIGFycmF5LnNwbGljZS5iaW5kKGFycmF5LCAwLCAwKS5hcHBseShudWxsLCBtYWtlQXJyYXkoMjYpKTtcblxuICAgICAgICBsZW5ndGhCZWZvcmUgPSBhcnJheS5sZW5ndGg7IC8vMjBcbiAgICAgICAgYXJyYXkuc3BsaWNlKDUsIDAsIFwiWFhYXCIpOyAvLyBhZGQgb25lIGVsZW1lbnRcblxuICAgICAgICBpZihsZW5ndGhCZWZvcmUgKyAxID09IGFycmF5Lmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7Ly8gaGFzIHJpZ2h0IHNwbGljZSBpbXBsZW1lbnRhdGlvbiB3aXRob3V0IGJ1Z3NcbiAgICAgICAgfVxuICAgICAgICAvLyBlbHNlIHtcbiAgICAgICAgLy8gICAgSUU4IGJ1Z1xuICAgICAgICAvLyB9XG4gICAgfSgpKSB7Ly9JRSA2LzdcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnNwbGljZSA9IGZ1bmN0aW9uKHN0YXJ0LCBkZWxldGVDb3VudCkge1xuICAgICAgICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXJyYXlfc3BsaWNlLmFwcGx5KHRoaXMsIFtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQgPT09IHZvaWQgMCA/IDAgOiBzdGFydCxcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlQ291bnQgPT09IHZvaWQgMCA/ICh0aGlzLmxlbmd0aCAtIHN0YXJ0KSA6IGRlbGV0ZUNvdW50XG4gICAgICAgICAgICAgICAgXS5jb25jYXQoX0FycmF5X3NsaWNlXy5jYWxsKGFyZ3VtZW50cywgMikpKVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICBlbHNlIHsvL0lFOFxuICAgICAgICBBcnJheS5wcm90b3R5cGUuc3BsaWNlID0gZnVuY3Rpb24oc3RhcnQsIGRlbGV0ZUNvdW50KSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0XG4gICAgICAgICAgICAgICAgLCBhcmdzID0gX0FycmF5X3NsaWNlXy5jYWxsKGFyZ3VtZW50cywgMilcbiAgICAgICAgICAgICAgICAsIGFkZEVsZW1lbnRzQ291bnQgPSBhcmdzLmxlbmd0aFxuICAgICAgICAgICAgO1xuXG4gICAgICAgICAgICBpZighYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoc3RhcnQgPT09IHZvaWQgMCkgeyAvLyBkZWZhdWx0XG4gICAgICAgICAgICAgICAgc3RhcnQgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoZGVsZXRlQ291bnQgPT09IHZvaWQgMCkgeyAvLyBkZWZhdWx0XG4gICAgICAgICAgICAgICAgZGVsZXRlQ291bnQgPSB0aGlzLmxlbmd0aCAtIHN0YXJ0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihhZGRFbGVtZW50c0NvdW50ID4gMCkge1xuICAgICAgICAgICAgICAgIGlmKGRlbGV0ZUNvdW50IDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoc3RhcnQgPT0gdGhpcy5sZW5ndGgpIHsgLy8gdGlueSBvcHRpbWlzYXRpb24gIzFcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHVzaC5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmKHN0YXJ0ID09IDApIHsgLy8gdGlueSBvcHRpbWlzYXRpb24gIzJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudW5zaGlmdC5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIEFycmF5LnByb3RvdHlwZS5zcGxpY2UgaW1wbGVtZW50YXRpb25cbiAgICAgICAgICAgICAgICByZXN1bHQgPSBfQXJyYXlfc2xpY2VfLmNhbGwodGhpcywgc3RhcnQsIHN0YXJ0ICsgZGVsZXRlQ291bnQpOy8vIGRlbGV0ZSBwYXJ0XG4gICAgICAgICAgICAgICAgYXJncy5wdXNoLmFwcGx5KGFyZ3MsIF9BcnJheV9zbGljZV8uY2FsbCh0aGlzLCBzdGFydCArIGRlbGV0ZUNvdW50LCB0aGlzLmxlbmd0aCkpOy8vIHJpZ2h0IHBhcnRcbiAgICAgICAgICAgICAgICBhcmdzLnVuc2hpZnQuYXBwbHkoYXJncywgX0FycmF5X3NsaWNlXy5jYWxsKHRoaXMsIDAsIHN0YXJ0KSk7Ly8gbGVmdCBwYXJ0XG5cbiAgICAgICAgICAgICAgICAvLyBkZWxldGUgYWxsIGl0ZW1zIGZyb20gdGhpcyBhcnJheSBhbmQgcmVwbGFjZSBpdCB0byAnbGVmdCBwYXJ0JyArIF9BcnJheV9zbGljZV8uY2FsbChhcmd1bWVudHMsIDIpICsgJ3JpZ2h0IHBhcnQnXG4gICAgICAgICAgICAgICAgYXJncy51bnNoaWZ0KDAsIHRoaXMubGVuZ3RoKTtcblxuICAgICAgICAgICAgICAgIGFycmF5X3NwbGljZS5hcHBseSh0aGlzLCBhcmdzKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBhcnJheV9zcGxpY2UuY2FsbCh0aGlzLCBzdGFydCwgZGVsZXRlQ291bnQpO1xuICAgICAgICB9XG5cbiAgICB9XG59XG5cbi8vIEVTNSAxNS40LjQuMTJcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjQuNC4xM1xuLy8gUmV0dXJuIGxlbithcmdDb3VudC5cbi8vIFtidWdmaXgsIGllbHQ4XVxuLy8gSUUgPCA4IGJ1ZzogW10udW5zaGlmdCgwKSA9PSB1bmRlZmluZWQgYnV0IHNob3VsZCBiZSBcIjFcIlxuaWYgKFtdLnVuc2hpZnQoMCkgIT0gMSkge1xuICAgIHZhciBhcnJheV91bnNoaWZ0ID0gQXJyYXkucHJvdG90eXBlLnVuc2hpZnQ7XG4gICAgQXJyYXkucHJvdG90eXBlLnVuc2hpZnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgYXJyYXlfdW5zaGlmdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gdGhpcy5sZW5ndGg7XG4gICAgfTtcbn1cblxuLy8gRVM1IDE1LjQuMy4yXG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS40LjMuMlxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvaXNBcnJheVxuaWYgKCFBcnJheS5pc0FycmF5KSB7XG4gICAgQXJyYXkuaXNBcnJheSA9IGZ1bmN0aW9uIGlzQXJyYXkob2JqKSB7XG4gICAgICAgIHJldHVybiBfdG9TdHJpbmcob2JqKSA9PSBcIltvYmplY3QgQXJyYXldXCI7XG4gICAgfTtcbn1cblxuLy8gVGhlIElzQ2FsbGFibGUoKSBjaGVjayBpbiB0aGUgQXJyYXkgZnVuY3Rpb25zXG4vLyBoYXMgYmVlbiByZXBsYWNlZCB3aXRoIGEgc3RyaWN0IGNoZWNrIG9uIHRoZVxuLy8gaW50ZXJuYWwgY2xhc3Mgb2YgdGhlIG9iamVjdCB0byB0cmFwIGNhc2VzIHdoZXJlXG4vLyB0aGUgcHJvdmlkZWQgZnVuY3Rpb24gd2FzIGFjdHVhbGx5IGEgcmVndWxhclxuLy8gZXhwcmVzc2lvbiBsaXRlcmFsLCB3aGljaCBpbiBWOCBhbmRcbi8vIEphdmFTY3JpcHRDb3JlIGlzIGEgdHlwZW9mIFwiZnVuY3Rpb25cIi4gIE9ubHkgaW5cbi8vIFY4IGFyZSByZWd1bGFyIGV4cHJlc3Npb24gbGl0ZXJhbHMgcGVybWl0dGVkIGFzXG4vLyByZWR1Y2UgcGFyYW1ldGVycywgc28gaXQgaXMgZGVzaXJhYmxlIGluIHRoZVxuLy8gZ2VuZXJhbCBjYXNlIGZvciB0aGUgc2hpbSB0byBtYXRjaCB0aGUgbW9yZVxuLy8gc3RyaWN0IGFuZCBjb21tb24gYmVoYXZpb3Igb2YgcmVqZWN0aW5nIHJlZ3VsYXJcbi8vIGV4cHJlc3Npb25zLlxuXG4vLyBFUzUgMTUuNC40LjE4XG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS40LjQuMThcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL2FycmF5L2ZvckVhY2hcblxuLy8gQ2hlY2sgZmFpbHVyZSBvZiBieS1pbmRleCBhY2Nlc3Mgb2Ygc3RyaW5nIGNoYXJhY3RlcnMgKElFIDwgOSlcbi8vIGFuZCBmYWlsdXJlIG9mIGAwIGluIGJveGVkU3RyaW5nYCAoUmhpbm8pXG52YXIgYm94ZWRTdHJpbmcgPSBPYmplY3QoXCJhXCIpLFxuICAgIHNwbGl0U3RyaW5nID0gYm94ZWRTdHJpbmdbMF0gIT0gXCJhXCIgfHwgISgwIGluIGJveGVkU3RyaW5nKTtcblxuaWYgKCFBcnJheS5wcm90b3R5cGUuZm9yRWFjaCkge1xuICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gZm9yRWFjaChmdW4gLyosIHRoaXNwKi8pIHtcbiAgICAgICAgdmFyIG9iamVjdCA9IHRvT2JqZWN0KHRoaXMpLFxuICAgICAgICAgICAgc2VsZiA9IHNwbGl0U3RyaW5nICYmIF90b1N0cmluZyh0aGlzKSA9PSBcIltvYmplY3QgU3RyaW5nXVwiID9cbiAgICAgICAgICAgICAgICB0aGlzLnNwbGl0KFwiXCIpIDpcbiAgICAgICAgICAgICAgICBvYmplY3QsXG4gICAgICAgICAgICB0aGlzcCA9IGFyZ3VtZW50c1sxXSxcbiAgICAgICAgICAgIGkgPSAtMSxcbiAgICAgICAgICAgIGxlbmd0aCA9IHNlbGYubGVuZ3RoID4+PiAwO1xuXG4gICAgICAgIC8vIElmIG5vIGNhbGxiYWNrIGZ1bmN0aW9uIG9yIGlmIGNhbGxiYWNrIGlzIG5vdCBhIGNhbGxhYmxlIGZ1bmN0aW9uXG4gICAgICAgIGlmIChfdG9TdHJpbmcoZnVuKSAhPSBcIltvYmplY3QgRnVuY3Rpb25dXCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTsgLy8gVE9ETyBtZXNzYWdlXG4gICAgICAgIH1cblxuICAgICAgICB3aGlsZSAoKytpIDwgbGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoaSBpbiBzZWxmKSB7XG4gICAgICAgICAgICAgICAgLy8gSW52b2tlIHRoZSBjYWxsYmFjayBmdW5jdGlvbiB3aXRoIGNhbGwsIHBhc3NpbmcgYXJndW1lbnRzOlxuICAgICAgICAgICAgICAgIC8vIGNvbnRleHQsIHByb3BlcnR5IHZhbHVlLCBwcm9wZXJ0eSBrZXksIHRoaXNBcmcgb2JqZWN0XG4gICAgICAgICAgICAgICAgLy8gY29udGV4dFxuICAgICAgICAgICAgICAgIGZ1bi5jYWxsKHRoaXNwLCBzZWxmW2ldLCBpLCBvYmplY3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbn1cblxuLy8gRVM1IDE1LjQuNC4xOVxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNC40LjE5XG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9Db3JlX0phdmFTY3JpcHRfMS41X1JlZmVyZW5jZS9PYmplY3RzL0FycmF5L21hcFxuaWYgKCFBcnJheS5wcm90b3R5cGUubWFwKSB7XG4gICAgQXJyYXkucHJvdG90eXBlLm1hcCA9IGZ1bmN0aW9uIG1hcChmdW4gLyosIHRoaXNwKi8pIHtcbiAgICAgICAgdmFyIG9iamVjdCA9IHRvT2JqZWN0KHRoaXMpLFxuICAgICAgICAgICAgc2VsZiA9IHNwbGl0U3RyaW5nICYmIF90b1N0cmluZyh0aGlzKSA9PSBcIltvYmplY3QgU3RyaW5nXVwiID9cbiAgICAgICAgICAgICAgICB0aGlzLnNwbGl0KFwiXCIpIDpcbiAgICAgICAgICAgICAgICBvYmplY3QsXG4gICAgICAgICAgICBsZW5ndGggPSBzZWxmLmxlbmd0aCA+Pj4gMCxcbiAgICAgICAgICAgIHJlc3VsdCA9IEFycmF5KGxlbmd0aCksXG4gICAgICAgICAgICB0aGlzcCA9IGFyZ3VtZW50c1sxXTtcblxuICAgICAgICAvLyBJZiBubyBjYWxsYmFjayBmdW5jdGlvbiBvciBpZiBjYWxsYmFjayBpcyBub3QgYSBjYWxsYWJsZSBmdW5jdGlvblxuICAgICAgICBpZiAoX3RvU3RyaW5nKGZ1bikgIT0gXCJbb2JqZWN0IEZ1bmN0aW9uXVwiKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGZ1biArIFwiIGlzIG5vdCBhIGZ1bmN0aW9uXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGkgaW4gc2VsZilcbiAgICAgICAgICAgICAgICByZXN1bHRbaV0gPSBmdW4uY2FsbCh0aGlzcCwgc2VsZltpXSwgaSwgb2JqZWN0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG59XG5cbi8vIEVTNSAxNS40LjQuMjBcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjQuNC4yMFxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vQ29yZV9KYXZhU2NyaXB0XzEuNV9SZWZlcmVuY2UvT2JqZWN0cy9BcnJheS9maWx0ZXJcbmlmICghQXJyYXkucHJvdG90eXBlLmZpbHRlcikge1xuICAgIEFycmF5LnByb3RvdHlwZS5maWx0ZXIgPSBmdW5jdGlvbiBmaWx0ZXIoZnVuIC8qLCB0aGlzcCAqLykge1xuICAgICAgICB2YXIgb2JqZWN0ID0gdG9PYmplY3QodGhpcyksXG4gICAgICAgICAgICBzZWxmID0gc3BsaXRTdHJpbmcgJiYgX3RvU3RyaW5nKHRoaXMpID09IFwiW29iamVjdCBTdHJpbmddXCIgP1xuICAgICAgICAgICAgICAgIHRoaXMuc3BsaXQoXCJcIikgOlxuICAgICAgICAgICAgICAgICAgICBvYmplY3QsXG4gICAgICAgICAgICBsZW5ndGggPSBzZWxmLmxlbmd0aCA+Pj4gMCxcbiAgICAgICAgICAgIHJlc3VsdCA9IFtdLFxuICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICB0aGlzcCA9IGFyZ3VtZW50c1sxXTtcblxuICAgICAgICAvLyBJZiBubyBjYWxsYmFjayBmdW5jdGlvbiBvciBpZiBjYWxsYmFjayBpcyBub3QgYSBjYWxsYWJsZSBmdW5jdGlvblxuICAgICAgICBpZiAoX3RvU3RyaW5nKGZ1bikgIT0gXCJbb2JqZWN0IEZ1bmN0aW9uXVwiKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGZ1biArIFwiIGlzIG5vdCBhIGZ1bmN0aW9uXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGkgaW4gc2VsZikge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gc2VsZltpXTtcbiAgICAgICAgICAgICAgICBpZiAoZnVuLmNhbGwodGhpc3AsIHZhbHVlLCBpLCBvYmplY3QpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xufVxuXG4vLyBFUzUgMTUuNC40LjE2XG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS40LjQuMTZcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L2V2ZXJ5XG5pZiAoIUFycmF5LnByb3RvdHlwZS5ldmVyeSkge1xuICAgIEFycmF5LnByb3RvdHlwZS5ldmVyeSA9IGZ1bmN0aW9uIGV2ZXJ5KGZ1biAvKiwgdGhpc3AgKi8pIHtcbiAgICAgICAgdmFyIG9iamVjdCA9IHRvT2JqZWN0KHRoaXMpLFxuICAgICAgICAgICAgc2VsZiA9IHNwbGl0U3RyaW5nICYmIF90b1N0cmluZyh0aGlzKSA9PSBcIltvYmplY3QgU3RyaW5nXVwiID9cbiAgICAgICAgICAgICAgICB0aGlzLnNwbGl0KFwiXCIpIDpcbiAgICAgICAgICAgICAgICBvYmplY3QsXG4gICAgICAgICAgICBsZW5ndGggPSBzZWxmLmxlbmd0aCA+Pj4gMCxcbiAgICAgICAgICAgIHRoaXNwID0gYXJndW1lbnRzWzFdO1xuXG4gICAgICAgIC8vIElmIG5vIGNhbGxiYWNrIGZ1bmN0aW9uIG9yIGlmIGNhbGxiYWNrIGlzIG5vdCBhIGNhbGxhYmxlIGZ1bmN0aW9uXG4gICAgICAgIGlmIChfdG9TdHJpbmcoZnVuKSAhPSBcIltvYmplY3QgRnVuY3Rpb25dXCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoZnVuICsgXCIgaXMgbm90IGEgZnVuY3Rpb25cIik7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoaSBpbiBzZWxmICYmICFmdW4uY2FsbCh0aGlzcCwgc2VsZltpXSwgaSwgb2JqZWN0KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xufVxuXG4vLyBFUzUgMTUuNC40LjE3XG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS40LjQuMTdcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L3NvbWVcbmlmICghQXJyYXkucHJvdG90eXBlLnNvbWUpIHtcbiAgICBBcnJheS5wcm90b3R5cGUuc29tZSA9IGZ1bmN0aW9uIHNvbWUoZnVuIC8qLCB0aGlzcCAqLykge1xuICAgICAgICB2YXIgb2JqZWN0ID0gdG9PYmplY3QodGhpcyksXG4gICAgICAgICAgICBzZWxmID0gc3BsaXRTdHJpbmcgJiYgX3RvU3RyaW5nKHRoaXMpID09IFwiW29iamVjdCBTdHJpbmddXCIgP1xuICAgICAgICAgICAgICAgIHRoaXMuc3BsaXQoXCJcIikgOlxuICAgICAgICAgICAgICAgIG9iamVjdCxcbiAgICAgICAgICAgIGxlbmd0aCA9IHNlbGYubGVuZ3RoID4+PiAwLFxuICAgICAgICAgICAgdGhpc3AgPSBhcmd1bWVudHNbMV07XG5cbiAgICAgICAgLy8gSWYgbm8gY2FsbGJhY2sgZnVuY3Rpb24gb3IgaWYgY2FsbGJhY2sgaXMgbm90IGEgY2FsbGFibGUgZnVuY3Rpb25cbiAgICAgICAgaWYgKF90b1N0cmluZyhmdW4pICE9IFwiW29iamVjdCBGdW5jdGlvbl1cIikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihmdW4gKyBcIiBpcyBub3QgYSBmdW5jdGlvblwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChpIGluIHNlbGYgJiYgZnVuLmNhbGwodGhpc3AsIHNlbGZbaV0sIGksIG9iamVjdCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbn1cblxuLy8gRVM1IDE1LjQuNC4yMVxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNC40LjIxXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9Db3JlX0phdmFTY3JpcHRfMS41X1JlZmVyZW5jZS9PYmplY3RzL0FycmF5L3JlZHVjZVxuaWYgKCFBcnJheS5wcm90b3R5cGUucmVkdWNlKSB7XG4gICAgQXJyYXkucHJvdG90eXBlLnJlZHVjZSA9IGZ1bmN0aW9uIHJlZHVjZShmdW4gLyosIGluaXRpYWwqLykge1xuICAgICAgICB2YXIgb2JqZWN0ID0gdG9PYmplY3QodGhpcyksXG4gICAgICAgICAgICBzZWxmID0gc3BsaXRTdHJpbmcgJiYgX3RvU3RyaW5nKHRoaXMpID09IFwiW29iamVjdCBTdHJpbmddXCIgP1xuICAgICAgICAgICAgICAgIHRoaXMuc3BsaXQoXCJcIikgOlxuICAgICAgICAgICAgICAgIG9iamVjdCxcbiAgICAgICAgICAgIGxlbmd0aCA9IHNlbGYubGVuZ3RoID4+PiAwO1xuXG4gICAgICAgIC8vIElmIG5vIGNhbGxiYWNrIGZ1bmN0aW9uIG9yIGlmIGNhbGxiYWNrIGlzIG5vdCBhIGNhbGxhYmxlIGZ1bmN0aW9uXG4gICAgICAgIGlmIChfdG9TdHJpbmcoZnVuKSAhPSBcIltvYmplY3QgRnVuY3Rpb25dXCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoZnVuICsgXCIgaXMgbm90IGEgZnVuY3Rpb25cIik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBubyB2YWx1ZSB0byByZXR1cm4gaWYgbm8gaW5pdGlhbCB2YWx1ZSBhbmQgYW4gZW1wdHkgYXJyYXlcbiAgICAgICAgaWYgKCFsZW5ndGggJiYgYXJndW1lbnRzLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwicmVkdWNlIG9mIGVtcHR5IGFycmF5IHdpdGggbm8gaW5pdGlhbCB2YWx1ZVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgdmFyIHJlc3VsdDtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gMikge1xuICAgICAgICAgICAgcmVzdWx0ID0gYXJndW1lbnRzWzFdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgIGlmIChpIGluIHNlbGYpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gc2VsZltpKytdO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBpZiBhcnJheSBjb250YWlucyBubyB2YWx1ZXMsIG5vIGluaXRpYWwgdmFsdWUgdG8gcmV0dXJuXG4gICAgICAgICAgICAgICAgaWYgKCsraSA+PSBsZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcInJlZHVjZSBvZiBlbXB0eSBhcnJheSB3aXRoIG5vIGluaXRpYWwgdmFsdWVcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSB3aGlsZSAodHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoaSBpbiBzZWxmKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gZnVuLmNhbGwodm9pZCAwLCByZXN1bHQsIHNlbGZbaV0sIGksIG9iamVjdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG59XG5cbi8vIEVTNSAxNS40LjQuMjJcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjQuNC4yMlxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vQ29yZV9KYXZhU2NyaXB0XzEuNV9SZWZlcmVuY2UvT2JqZWN0cy9BcnJheS9yZWR1Y2VSaWdodFxuaWYgKCFBcnJheS5wcm90b3R5cGUucmVkdWNlUmlnaHQpIHtcbiAgICBBcnJheS5wcm90b3R5cGUucmVkdWNlUmlnaHQgPSBmdW5jdGlvbiByZWR1Y2VSaWdodChmdW4gLyosIGluaXRpYWwqLykge1xuICAgICAgICB2YXIgb2JqZWN0ID0gdG9PYmplY3QodGhpcyksXG4gICAgICAgICAgICBzZWxmID0gc3BsaXRTdHJpbmcgJiYgX3RvU3RyaW5nKHRoaXMpID09IFwiW29iamVjdCBTdHJpbmddXCIgP1xuICAgICAgICAgICAgICAgIHRoaXMuc3BsaXQoXCJcIikgOlxuICAgICAgICAgICAgICAgIG9iamVjdCxcbiAgICAgICAgICAgIGxlbmd0aCA9IHNlbGYubGVuZ3RoID4+PiAwO1xuXG4gICAgICAgIC8vIElmIG5vIGNhbGxiYWNrIGZ1bmN0aW9uIG9yIGlmIGNhbGxiYWNrIGlzIG5vdCBhIGNhbGxhYmxlIGZ1bmN0aW9uXG4gICAgICAgIGlmIChfdG9TdHJpbmcoZnVuKSAhPSBcIltvYmplY3QgRnVuY3Rpb25dXCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoZnVuICsgXCIgaXMgbm90IGEgZnVuY3Rpb25cIik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBubyB2YWx1ZSB0byByZXR1cm4gaWYgbm8gaW5pdGlhbCB2YWx1ZSwgZW1wdHkgYXJyYXlcbiAgICAgICAgaWYgKCFsZW5ndGggJiYgYXJndW1lbnRzLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwicmVkdWNlUmlnaHQgb2YgZW1wdHkgYXJyYXkgd2l0aCBubyBpbml0aWFsIHZhbHVlXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJlc3VsdCwgaSA9IGxlbmd0aCAtIDE7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDIpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICBpZiAoaSBpbiBzZWxmKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHNlbGZbaS0tXTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gaWYgYXJyYXkgY29udGFpbnMgbm8gdmFsdWVzLCBubyBpbml0aWFsIHZhbHVlIHRvIHJldHVyblxuICAgICAgICAgICAgICAgIGlmICgtLWkgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJyZWR1Y2VSaWdodCBvZiBlbXB0eSBhcnJheSB3aXRoIG5vIGluaXRpYWwgdmFsdWVcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSB3aGlsZSAodHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaSA8IDApIHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cblxuICAgICAgICBkbyB7XG4gICAgICAgICAgICBpZiAoaSBpbiB0aGlzKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gZnVuLmNhbGwodm9pZCAwLCByZXN1bHQsIHNlbGZbaV0sIGksIG9iamVjdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gd2hpbGUgKGktLSk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xufVxuXG4vLyBFUzUgMTUuNC40LjE0XG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS40LjQuMTRcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L2luZGV4T2ZcbmlmICghQXJyYXkucHJvdG90eXBlLmluZGV4T2YgfHwgKFswLCAxXS5pbmRleE9mKDEsIDIpICE9IC0xKSkge1xuICAgIEFycmF5LnByb3RvdHlwZS5pbmRleE9mID0gZnVuY3Rpb24gaW5kZXhPZihzb3VnaHQgLyosIGZyb21JbmRleCAqLyApIHtcbiAgICAgICAgdmFyIHNlbGYgPSBzcGxpdFN0cmluZyAmJiBfdG9TdHJpbmcodGhpcykgPT0gXCJbb2JqZWN0IFN0cmluZ11cIiA/XG4gICAgICAgICAgICAgICAgdGhpcy5zcGxpdChcIlwiKSA6XG4gICAgICAgICAgICAgICAgdG9PYmplY3QodGhpcyksXG4gICAgICAgICAgICBsZW5ndGggPSBzZWxmLmxlbmd0aCA+Pj4gMDtcblxuICAgICAgICBpZiAoIWxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIGkgPSB0b0ludGVnZXIoYXJndW1lbnRzWzFdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGhhbmRsZSBuZWdhdGl2ZSBpbmRpY2VzXG4gICAgICAgIGkgPSBpID49IDAgPyBpIDogTWF0aC5tYXgoMCwgbGVuZ3RoICsgaSk7XG4gICAgICAgIGZvciAoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChpIGluIHNlbGYgJiYgc2VsZltpXSA9PT0gc291Z2h0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH07XG59XG5cbi8vIEVTNSAxNS40LjQuMTVcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjQuNC4xNVxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvbGFzdEluZGV4T2ZcbmlmICghQXJyYXkucHJvdG90eXBlLmxhc3RJbmRleE9mIHx8IChbMCwgMV0ubGFzdEluZGV4T2YoMCwgLTMpICE9IC0xKSkge1xuICAgIEFycmF5LnByb3RvdHlwZS5sYXN0SW5kZXhPZiA9IGZ1bmN0aW9uIGxhc3RJbmRleE9mKHNvdWdodCAvKiwgZnJvbUluZGV4ICovKSB7XG4gICAgICAgIHZhciBzZWxmID0gc3BsaXRTdHJpbmcgJiYgX3RvU3RyaW5nKHRoaXMpID09IFwiW29iamVjdCBTdHJpbmddXCIgP1xuICAgICAgICAgICAgICAgIHRoaXMuc3BsaXQoXCJcIikgOlxuICAgICAgICAgICAgICAgIHRvT2JqZWN0KHRoaXMpLFxuICAgICAgICAgICAgbGVuZ3RoID0gc2VsZi5sZW5ndGggPj4+IDA7XG5cbiAgICAgICAgaWYgKCFsZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaSA9IGxlbmd0aCAtIDE7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgaSA9IE1hdGgubWluKGksIHRvSW50ZWdlcihhcmd1bWVudHNbMV0pKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBoYW5kbGUgbmVnYXRpdmUgaW5kaWNlc1xuICAgICAgICBpID0gaSA+PSAwID8gaSA6IGxlbmd0aCAtIE1hdGguYWJzKGkpO1xuICAgICAgICBmb3IgKDsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGlmIChpIGluIHNlbGYgJiYgc291Z2h0ID09PSBzZWxmW2ldKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH07XG59XG5cbi8vXG4vLyBPYmplY3Rcbi8vID09PT09PVxuLy9cblxuLy8gRVM1IDE1LjIuMy4xNFxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuMi4zLjE0XG5pZiAoIU9iamVjdC5rZXlzKSB7XG4gICAgLy8gaHR0cDovL3doYXR0aGVoZWFkc2FpZC5jb20vMjAxMC8xMC9hLXNhZmVyLW9iamVjdC1rZXlzLWNvbXBhdGliaWxpdHktaW1wbGVtZW50YXRpb25cbiAgICB2YXIgaGFzRG9udEVudW1CdWcgPSB0cnVlLFxuICAgICAgICBkb250RW51bXMgPSBbXG4gICAgICAgICAgICBcInRvU3RyaW5nXCIsXG4gICAgICAgICAgICBcInRvTG9jYWxlU3RyaW5nXCIsXG4gICAgICAgICAgICBcInZhbHVlT2ZcIixcbiAgICAgICAgICAgIFwiaGFzT3duUHJvcGVydHlcIixcbiAgICAgICAgICAgIFwiaXNQcm90b3R5cGVPZlwiLFxuICAgICAgICAgICAgXCJwcm9wZXJ0eUlzRW51bWVyYWJsZVwiLFxuICAgICAgICAgICAgXCJjb25zdHJ1Y3RvclwiXG4gICAgICAgIF0sXG4gICAgICAgIGRvbnRFbnVtc0xlbmd0aCA9IGRvbnRFbnVtcy5sZW5ndGg7XG5cbiAgICBmb3IgKHZhciBrZXkgaW4ge1widG9TdHJpbmdcIjogbnVsbH0pIHtcbiAgICAgICAgaGFzRG9udEVudW1CdWcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBPYmplY3Qua2V5cyA9IGZ1bmN0aW9uIGtleXMob2JqZWN0KSB7XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgKHR5cGVvZiBvYmplY3QgIT0gXCJvYmplY3RcIiAmJiB0eXBlb2Ygb2JqZWN0ICE9IFwiZnVuY3Rpb25cIikgfHxcbiAgICAgICAgICAgIG9iamVjdCA9PT0gbnVsbFxuICAgICAgICApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJPYmplY3Qua2V5cyBjYWxsZWQgb24gYSBub24tb2JqZWN0XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGtleXMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgbmFtZSBpbiBvYmplY3QpIHtcbiAgICAgICAgICAgIGlmIChvd25zKG9iamVjdCwgbmFtZSkpIHtcbiAgICAgICAgICAgICAgICBrZXlzLnB1c2gobmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGFzRG9udEVudW1CdWcpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBpaSA9IGRvbnRFbnVtc0xlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgZG9udEVudW0gPSBkb250RW51bXNbaV07XG4gICAgICAgICAgICAgICAgaWYgKG93bnMob2JqZWN0LCBkb250RW51bSkpIHtcbiAgICAgICAgICAgICAgICAgICAga2V5cy5wdXNoKGRvbnRFbnVtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGtleXM7XG4gICAgfTtcblxufVxuXG4vL1xuLy8gRGF0ZVxuLy8gPT09PVxuLy9cblxuLy8gRVM1IDE1LjkuNS40M1xuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuOS41LjQzXG4vLyBUaGlzIGZ1bmN0aW9uIHJldHVybnMgYSBTdHJpbmcgdmFsdWUgcmVwcmVzZW50IHRoZSBpbnN0YW5jZSBpbiB0aW1lXG4vLyByZXByZXNlbnRlZCBieSB0aGlzIERhdGUgb2JqZWN0LiBUaGUgZm9ybWF0IG9mIHRoZSBTdHJpbmcgaXMgdGhlIERhdGUgVGltZVxuLy8gc3RyaW5nIGZvcm1hdCBkZWZpbmVkIGluIDE1LjkuMS4xNS4gQWxsIGZpZWxkcyBhcmUgcHJlc2VudCBpbiB0aGUgU3RyaW5nLlxuLy8gVGhlIHRpbWUgem9uZSBpcyBhbHdheXMgVVRDLCBkZW5vdGVkIGJ5IHRoZSBzdWZmaXggWi4gSWYgdGhlIHRpbWUgdmFsdWUgb2Zcbi8vIHRoaXMgb2JqZWN0IGlzIG5vdCBhIGZpbml0ZSBOdW1iZXIgYSBSYW5nZUVycm9yIGV4Y2VwdGlvbiBpcyB0aHJvd24uXG52YXIgbmVnYXRpdmVEYXRlID0gLTYyMTk4NzU1MjAwMDAwLFxuICAgIG5lZ2F0aXZlWWVhclN0cmluZyA9IFwiLTAwMDAwMVwiO1xuaWYgKFxuICAgICFEYXRlLnByb3RvdHlwZS50b0lTT1N0cmluZyB8fFxuICAgIChuZXcgRGF0ZShuZWdhdGl2ZURhdGUpLnRvSVNPU3RyaW5nKCkuaW5kZXhPZihuZWdhdGl2ZVllYXJTdHJpbmcpID09PSAtMSlcbikge1xuICAgIERhdGUucHJvdG90eXBlLnRvSVNPU3RyaW5nID0gZnVuY3Rpb24gdG9JU09TdHJpbmcoKSB7XG4gICAgICAgIHZhciByZXN1bHQsIGxlbmd0aCwgdmFsdWUsIHllYXIsIG1vbnRoO1xuICAgICAgICBpZiAoIWlzRmluaXRlKHRoaXMpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcIkRhdGUucHJvdG90eXBlLnRvSVNPU3RyaW5nIGNhbGxlZCBvbiBub24tZmluaXRlIHZhbHVlLlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHllYXIgPSB0aGlzLmdldFVUQ0Z1bGxZZWFyKCk7XG5cbiAgICAgICAgbW9udGggPSB0aGlzLmdldFVUQ01vbnRoKCk7XG4gICAgICAgIC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20va3Jpc2tvd2FsL2VzNS1zaGltL2lzc3Vlcy8xMTFcbiAgICAgICAgeWVhciArPSBNYXRoLmZsb29yKG1vbnRoIC8gMTIpO1xuICAgICAgICBtb250aCA9IChtb250aCAlIDEyICsgMTIpICUgMTI7XG5cbiAgICAgICAgLy8gdGhlIGRhdGUgdGltZSBzdHJpbmcgZm9ybWF0IGlzIHNwZWNpZmllZCBpbiAxNS45LjEuMTUuXG4gICAgICAgIHJlc3VsdCA9IFttb250aCArIDEsIHRoaXMuZ2V0VVRDRGF0ZSgpLFxuICAgICAgICAgICAgdGhpcy5nZXRVVENIb3VycygpLCB0aGlzLmdldFVUQ01pbnV0ZXMoKSwgdGhpcy5nZXRVVENTZWNvbmRzKCldO1xuICAgICAgICB5ZWFyID0gKFxuICAgICAgICAgICAgKHllYXIgPCAwID8gXCItXCIgOiAoeWVhciA+IDk5OTkgPyBcIitcIiA6IFwiXCIpKSArXG4gICAgICAgICAgICAoXCIwMDAwMFwiICsgTWF0aC5hYnMoeWVhcikpXG4gICAgICAgICAgICAuc2xpY2UoMCA8PSB5ZWFyICYmIHllYXIgPD0gOTk5OSA/IC00IDogLTYpXG4gICAgICAgICk7XG5cbiAgICAgICAgbGVuZ3RoID0gcmVzdWx0Lmxlbmd0aDtcbiAgICAgICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHJlc3VsdFtsZW5ndGhdO1xuICAgICAgICAgICAgLy8gcGFkIG1vbnRocywgZGF5cywgaG91cnMsIG1pbnV0ZXMsIGFuZCBzZWNvbmRzIHRvIGhhdmUgdHdvXG4gICAgICAgICAgICAvLyBkaWdpdHMuXG4gICAgICAgICAgICBpZiAodmFsdWUgPCAxMCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdFtsZW5ndGhdID0gXCIwXCIgKyB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBwYWQgbWlsbGlzZWNvbmRzIHRvIGhhdmUgdGhyZWUgZGlnaXRzLlxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgeWVhciArIFwiLVwiICsgcmVzdWx0LnNsaWNlKDAsIDIpLmpvaW4oXCItXCIpICtcbiAgICAgICAgICAgIFwiVFwiICsgcmVzdWx0LnNsaWNlKDIpLmpvaW4oXCI6XCIpICsgXCIuXCIgK1xuICAgICAgICAgICAgKFwiMDAwXCIgKyB0aGlzLmdldFVUQ01pbGxpc2Vjb25kcygpKS5zbGljZSgtMykgKyBcIlpcIlxuICAgICAgICApO1xuICAgIH07XG59XG5cblxuLy8gRVM1IDE1LjkuNS40NFxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuOS41LjQ0XG4vLyBUaGlzIGZ1bmN0aW9uIHByb3ZpZGVzIGEgU3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIGEgRGF0ZSBvYmplY3QgZm9yIHVzZSBieVxuLy8gSlNPTi5zdHJpbmdpZnkgKDE1LjEyLjMpLlxudmFyIGRhdGVUb0pTT05Jc1N1cHBvcnRlZCA9IGZhbHNlO1xudHJ5IHtcbiAgICBkYXRlVG9KU09OSXNTdXBwb3J0ZWQgPSAoXG4gICAgICAgIERhdGUucHJvdG90eXBlLnRvSlNPTiAmJlxuICAgICAgICBuZXcgRGF0ZShOYU4pLnRvSlNPTigpID09PSBudWxsICYmXG4gICAgICAgIG5ldyBEYXRlKG5lZ2F0aXZlRGF0ZSkudG9KU09OKCkuaW5kZXhPZihuZWdhdGl2ZVllYXJTdHJpbmcpICE9PSAtMSAmJlxuICAgICAgICBEYXRlLnByb3RvdHlwZS50b0pTT04uY2FsbCh7IC8vIGdlbmVyaWNcbiAgICAgICAgICAgIHRvSVNPU3RyaW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgKTtcbn0gY2F0Y2ggKGUpIHtcbn1cbmlmICghZGF0ZVRvSlNPTklzU3VwcG9ydGVkKSB7XG4gICAgRGF0ZS5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gdG9KU09OKGtleSkge1xuICAgICAgICAvLyBXaGVuIHRoZSB0b0pTT04gbWV0aG9kIGlzIGNhbGxlZCB3aXRoIGFyZ3VtZW50IGtleSwgdGhlIGZvbGxvd2luZ1xuICAgICAgICAvLyBzdGVwcyBhcmUgdGFrZW46XG5cbiAgICAgICAgLy8gMS4gIExldCBPIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyBUb09iamVjdCwgZ2l2aW5nIGl0IHRoZSB0aGlzXG4gICAgICAgIC8vIHZhbHVlIGFzIGl0cyBhcmd1bWVudC5cbiAgICAgICAgLy8gMi4gTGV0IHR2IGJlIHRvUHJpbWl0aXZlKE8sIGhpbnQgTnVtYmVyKS5cbiAgICAgICAgdmFyIG8gPSBPYmplY3QodGhpcyksXG4gICAgICAgICAgICB0diA9IHRvUHJpbWl0aXZlKG8pLFxuICAgICAgICAgICAgdG9JU087XG4gICAgICAgIC8vIDMuIElmIHR2IGlzIGEgTnVtYmVyIGFuZCBpcyBub3QgZmluaXRlLCByZXR1cm4gbnVsbC5cbiAgICAgICAgaWYgKHR5cGVvZiB0diA9PT0gXCJudW1iZXJcIiAmJiAhaXNGaW5pdGUodHYpKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICAvLyA0LiBMZXQgdG9JU08gYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0dldF1dIGludGVybmFsIG1ldGhvZCBvZlxuICAgICAgICAvLyBPIHdpdGggYXJndW1lbnQgXCJ0b0lTT1N0cmluZ1wiLlxuICAgICAgICB0b0lTTyA9IG8udG9JU09TdHJpbmc7XG4gICAgICAgIC8vIDUuIElmIElzQ2FsbGFibGUodG9JU08pIGlzIGZhbHNlLCB0aHJvdyBhIFR5cGVFcnJvciBleGNlcHRpb24uXG4gICAgICAgIGlmICh0eXBlb2YgdG9JU08gIT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwidG9JU09TdHJpbmcgcHJvcGVydHkgaXMgbm90IGNhbGxhYmxlXCIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIDYuIFJldHVybiB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbQ2FsbF1dIGludGVybmFsIG1ldGhvZCBvZlxuICAgICAgICAvLyAgdG9JU08gd2l0aCBPIGFzIHRoZSB0aGlzIHZhbHVlIGFuZCBhbiBlbXB0eSBhcmd1bWVudCBsaXN0LlxuICAgICAgICByZXR1cm4gdG9JU08uY2FsbChvKTtcblxuICAgICAgICAvLyBOT1RFIDEgVGhlIGFyZ3VtZW50IGlzIGlnbm9yZWQuXG5cbiAgICAgICAgLy8gTk9URSAyIFRoZSB0b0pTT04gZnVuY3Rpb24gaXMgaW50ZW50aW9uYWxseSBnZW5lcmljOyBpdCBkb2VzIG5vdFxuICAgICAgICAvLyByZXF1aXJlIHRoYXQgaXRzIHRoaXMgdmFsdWUgYmUgYSBEYXRlIG9iamVjdC4gVGhlcmVmb3JlLCBpdCBjYW4gYmVcbiAgICAgICAgLy8gdHJhbnNmZXJyZWQgdG8gb3RoZXIga2luZHMgb2Ygb2JqZWN0cyBmb3IgdXNlIGFzIGEgbWV0aG9kLiBIb3dldmVyLFxuICAgICAgICAvLyBpdCBkb2VzIHJlcXVpcmUgdGhhdCBhbnkgc3VjaCBvYmplY3QgaGF2ZSBhIHRvSVNPU3RyaW5nIG1ldGhvZC4gQW5cbiAgICAgICAgLy8gb2JqZWN0IGlzIGZyZWUgdG8gdXNlIHRoZSBhcmd1bWVudCBrZXkgdG8gZmlsdGVyIGl0c1xuICAgICAgICAvLyBzdHJpbmdpZmljYXRpb24uXG4gICAgfTtcbn1cblxuLy8gRVM1IDE1LjkuNC4yXG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS45LjQuMlxuLy8gYmFzZWQgb24gd29yayBzaGFyZWQgYnkgRGFuaWVsIEZyaWVzZW4gKGRhbnRtYW4pXG4vLyBodHRwOi8vZ2lzdC5naXRodWIuY29tLzMwMzI0OVxuaWYgKCFEYXRlLnBhcnNlIHx8IFwiRGF0ZS5wYXJzZSBpcyBidWdneVwiKSB7XG4gICAgLy8gWFhYIGdsb2JhbCBhc3NpZ25tZW50IHdvbid0IHdvcmsgaW4gZW1iZWRkaW5ncyB0aGF0IHVzZVxuICAgIC8vIGFuIGFsdGVybmF0ZSBvYmplY3QgZm9yIHRoZSBjb250ZXh0LlxuICAgIERhdGUgPSAoZnVuY3Rpb24oTmF0aXZlRGF0ZSkge1xuXG4gICAgICAgIC8vIERhdGUubGVuZ3RoID09PSA3XG4gICAgICAgIGZ1bmN0aW9uIERhdGUoWSwgTSwgRCwgaCwgbSwgcywgbXMpIHtcbiAgICAgICAgICAgIHZhciBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBOYXRpdmVEYXRlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRhdGUgPSBsZW5ndGggPT0gMSAmJiBTdHJpbmcoWSkgPT09IFkgPyAvLyBpc1N0cmluZyhZKVxuICAgICAgICAgICAgICAgICAgICAvLyBXZSBleHBsaWNpdGx5IHBhc3MgaXQgdGhyb3VnaCBwYXJzZTpcbiAgICAgICAgICAgICAgICAgICAgbmV3IE5hdGl2ZURhdGUoRGF0ZS5wYXJzZShZKSkgOlxuICAgICAgICAgICAgICAgICAgICAvLyBXZSBoYXZlIHRvIG1hbnVhbGx5IG1ha2UgY2FsbHMgZGVwZW5kaW5nIG9uIGFyZ3VtZW50XG4gICAgICAgICAgICAgICAgICAgIC8vIGxlbmd0aCBoZXJlXG4gICAgICAgICAgICAgICAgICAgIGxlbmd0aCA+PSA3ID8gbmV3IE5hdGl2ZURhdGUoWSwgTSwgRCwgaCwgbSwgcywgbXMpIDpcbiAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID49IDYgPyBuZXcgTmF0aXZlRGF0ZShZLCBNLCBELCBoLCBtLCBzKSA6XG4gICAgICAgICAgICAgICAgICAgIGxlbmd0aCA+PSA1ID8gbmV3IE5hdGl2ZURhdGUoWSwgTSwgRCwgaCwgbSkgOlxuICAgICAgICAgICAgICAgICAgICBsZW5ndGggPj0gNCA/IG5ldyBOYXRpdmVEYXRlKFksIE0sIEQsIGgpIDpcbiAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID49IDMgPyBuZXcgTmF0aXZlRGF0ZShZLCBNLCBEKSA6XG4gICAgICAgICAgICAgICAgICAgIGxlbmd0aCA+PSAyID8gbmV3IE5hdGl2ZURhdGUoWSwgTSkgOlxuICAgICAgICAgICAgICAgICAgICBsZW5ndGggPj0gMSA/IG5ldyBOYXRpdmVEYXRlKFkpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgTmF0aXZlRGF0ZSgpO1xuICAgICAgICAgICAgICAgIC8vIFByZXZlbnQgbWl4dXBzIHdpdGggdW5maXhlZCBEYXRlIG9iamVjdFxuICAgICAgICAgICAgICAgIGRhdGUuY29uc3RydWN0b3IgPSBEYXRlO1xuICAgICAgICAgICAgICAgIHJldHVybiBkYXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIE5hdGl2ZURhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyAxNS45LjEuMTUgRGF0ZSBUaW1lIFN0cmluZyBGb3JtYXQuXG4gICAgICAgIHZhciBpc29EYXRlRXhwcmVzc2lvbiA9IG5ldyBSZWdFeHAoXCJeXCIgK1xuICAgICAgICAgICAgXCIoXFxcXGR7NH18W1xcK1xcLV1cXFxcZHs2fSlcIiArIC8vIGZvdXItZGlnaXQgeWVhciBjYXB0dXJlIG9yIHNpZ24gK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA2LWRpZ2l0IGV4dGVuZGVkIHllYXJcbiAgICAgICAgICAgIFwiKD86LShcXFxcZHsyfSlcIiArIC8vIG9wdGlvbmFsIG1vbnRoIGNhcHR1cmVcbiAgICAgICAgICAgIFwiKD86LShcXFxcZHsyfSlcIiArIC8vIG9wdGlvbmFsIGRheSBjYXB0dXJlXG4gICAgICAgICAgICBcIig/OlwiICsgLy8gY2FwdHVyZSBob3VyczptaW51dGVzOnNlY29uZHMubWlsbGlzZWNvbmRzXG4gICAgICAgICAgICAgICAgXCJUKFxcXFxkezJ9KVwiICsgLy8gaG91cnMgY2FwdHVyZVxuICAgICAgICAgICAgICAgIFwiOihcXFxcZHsyfSlcIiArIC8vIG1pbnV0ZXMgY2FwdHVyZVxuICAgICAgICAgICAgICAgIFwiKD86XCIgKyAvLyBvcHRpb25hbCA6c2Vjb25kcy5taWxsaXNlY29uZHNcbiAgICAgICAgICAgICAgICAgICAgXCI6KFxcXFxkezJ9KVwiICsgLy8gc2Vjb25kcyBjYXB0dXJlXG4gICAgICAgICAgICAgICAgICAgIFwiKD86KFxcXFwuXFxcXGR7MSx9KSk/XCIgKyAvLyBtaWxsaXNlY29uZHMgY2FwdHVyZVxuICAgICAgICAgICAgICAgIFwiKT9cIiArXG4gICAgICAgICAgICBcIihcIiArIC8vIGNhcHR1cmUgVVRDIG9mZnNldCBjb21wb25lbnRcbiAgICAgICAgICAgICAgICBcIlp8XCIgKyAvLyBVVEMgY2FwdHVyZVxuICAgICAgICAgICAgICAgIFwiKD86XCIgKyAvLyBvZmZzZXQgc3BlY2lmaWVyICsvLWhvdXJzOm1pbnV0ZXNcbiAgICAgICAgICAgICAgICAgICAgXCIoWy0rXSlcIiArIC8vIHNpZ24gY2FwdHVyZVxuICAgICAgICAgICAgICAgICAgICBcIihcXFxcZHsyfSlcIiArIC8vIGhvdXJzIG9mZnNldCBjYXB0dXJlXG4gICAgICAgICAgICAgICAgICAgIFwiOihcXFxcZHsyfSlcIiArIC8vIG1pbnV0ZXMgb2Zmc2V0IGNhcHR1cmVcbiAgICAgICAgICAgICAgICBcIilcIiArXG4gICAgICAgICAgICBcIik/KT8pPyk/XCIgK1xuICAgICAgICBcIiRcIik7XG5cbiAgICAgICAgdmFyIG1vbnRocyA9IFtcbiAgICAgICAgICAgIDAsIDMxLCA1OSwgOTAsIDEyMCwgMTUxLCAxODEsIDIxMiwgMjQzLCAyNzMsIDMwNCwgMzM0LCAzNjVcbiAgICAgICAgXTtcblxuICAgICAgICBmdW5jdGlvbiBkYXlGcm9tTW9udGgoeWVhciwgbW9udGgpIHtcbiAgICAgICAgICAgIHZhciB0ID0gbW9udGggPiAxID8gMSA6IDA7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIG1vbnRoc1ttb250aF0gK1xuICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoKHllYXIgLSAxOTY5ICsgdCkgLyA0KSAtXG4gICAgICAgICAgICAgICAgTWF0aC5mbG9vcigoeWVhciAtIDE5MDEgKyB0KSAvIDEwMCkgK1xuICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoKHllYXIgLSAxNjAxICsgdCkgLyA0MDApICtcbiAgICAgICAgICAgICAgICAzNjUgKiAoeWVhciAtIDE5NzApXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ29weSBhbnkgY3VzdG9tIG1ldGhvZHMgYSAzcmQgcGFydHkgbGlicmFyeSBtYXkgaGF2ZSBhZGRlZFxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gTmF0aXZlRGF0ZSkge1xuICAgICAgICAgICAgRGF0ZVtrZXldID0gTmF0aXZlRGF0ZVtrZXldO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ29weSBcIm5hdGl2ZVwiIG1ldGhvZHMgZXhwbGljaXRseTsgdGhleSBtYXkgYmUgbm9uLWVudW1lcmFibGVcbiAgICAgICAgRGF0ZS5ub3cgPSBOYXRpdmVEYXRlLm5vdztcbiAgICAgICAgRGF0ZS5VVEMgPSBOYXRpdmVEYXRlLlVUQztcbiAgICAgICAgRGF0ZS5wcm90b3R5cGUgPSBOYXRpdmVEYXRlLnByb3RvdHlwZTtcbiAgICAgICAgRGF0ZS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBEYXRlO1xuXG4gICAgICAgIC8vIFVwZ3JhZGUgRGF0ZS5wYXJzZSB0byBoYW5kbGUgc2ltcGxpZmllZCBJU08gODYwMSBzdHJpbmdzXG4gICAgICAgIERhdGUucGFyc2UgPSBmdW5jdGlvbiBwYXJzZShzdHJpbmcpIHtcbiAgICAgICAgICAgIHZhciBtYXRjaCA9IGlzb0RhdGVFeHByZXNzaW9uLmV4ZWMoc3RyaW5nKTtcbiAgICAgICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgICAgIC8vIHBhcnNlIG1vbnRocywgZGF5cywgaG91cnMsIG1pbnV0ZXMsIHNlY29uZHMsIGFuZCBtaWxsaXNlY29uZHNcbiAgICAgICAgICAgICAgICAvLyBwcm92aWRlIGRlZmF1bHQgdmFsdWVzIGlmIG5lY2Vzc2FyeVxuICAgICAgICAgICAgICAgIC8vIHBhcnNlIHRoZSBVVEMgb2Zmc2V0IGNvbXBvbmVudFxuICAgICAgICAgICAgICAgIHZhciB5ZWFyID0gTnVtYmVyKG1hdGNoWzFdKSxcbiAgICAgICAgICAgICAgICAgICAgbW9udGggPSBOdW1iZXIobWF0Y2hbMl0gfHwgMSkgLSAxLFxuICAgICAgICAgICAgICAgICAgICBkYXkgPSBOdW1iZXIobWF0Y2hbM10gfHwgMSkgLSAxLFxuICAgICAgICAgICAgICAgICAgICBob3VyID0gTnVtYmVyKG1hdGNoWzRdIHx8IDApLFxuICAgICAgICAgICAgICAgICAgICBtaW51dGUgPSBOdW1iZXIobWF0Y2hbNV0gfHwgMCksXG4gICAgICAgICAgICAgICAgICAgIHNlY29uZCA9IE51bWJlcihtYXRjaFs2XSB8fCAwKSxcbiAgICAgICAgICAgICAgICAgICAgbWlsbGlzZWNvbmQgPSBNYXRoLmZsb29yKE51bWJlcihtYXRjaFs3XSB8fCAwKSAqIDEwMDApLFxuICAgICAgICAgICAgICAgICAgICAvLyBXaGVuIHRpbWUgem9uZSBpcyBtaXNzZWQsIGxvY2FsIG9mZnNldCBzaG91bGQgYmUgdXNlZFxuICAgICAgICAgICAgICAgICAgICAvLyAoRVMgNS4xIGJ1ZylcbiAgICAgICAgICAgICAgICAgICAgLy8gc2VlIGh0dHBzOi8vYnVncy5lY21hc2NyaXB0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTEyXG4gICAgICAgICAgICAgICAgICAgIG9mZnNldCA9ICFtYXRjaFs0XSB8fCBtYXRjaFs4XSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAwIDogTnVtYmVyKG5ldyBOYXRpdmVEYXRlKDE5NzAsIDApKSxcbiAgICAgICAgICAgICAgICAgICAgc2lnbk9mZnNldCA9IG1hdGNoWzldID09PSBcIi1cIiA/IDEgOiAtMSxcbiAgICAgICAgICAgICAgICAgICAgaG91ck9mZnNldCA9IE51bWJlcihtYXRjaFsxMF0gfHwgMCksXG4gICAgICAgICAgICAgICAgICAgIG1pbnV0ZU9mZnNldCA9IE51bWJlcihtYXRjaFsxMV0gfHwgMCksXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIGhvdXIgPCAoXG4gICAgICAgICAgICAgICAgICAgICAgICBtaW51dGUgPiAwIHx8IHNlY29uZCA+IDAgfHwgbWlsbGlzZWNvbmQgPiAwID9cbiAgICAgICAgICAgICAgICAgICAgICAgIDI0IDogMjVcbiAgICAgICAgICAgICAgICAgICAgKSAmJlxuICAgICAgICAgICAgICAgICAgICBtaW51dGUgPCA2MCAmJiBzZWNvbmQgPCA2MCAmJiBtaWxsaXNlY29uZCA8IDEwMDAgJiZcbiAgICAgICAgICAgICAgICAgICAgbW9udGggPiAtMSAmJiBtb250aCA8IDEyICYmIGhvdXJPZmZzZXQgPCAyNCAmJlxuICAgICAgICAgICAgICAgICAgICBtaW51dGVPZmZzZXQgPCA2MCAmJiAvLyBkZXRlY3QgaW52YWxpZCBvZmZzZXRzXG4gICAgICAgICAgICAgICAgICAgIGRheSA+IC0xICYmXG4gICAgICAgICAgICAgICAgICAgIGRheSA8IChcbiAgICAgICAgICAgICAgICAgICAgICAgIGRheUZyb21Nb250aCh5ZWFyLCBtb250aCArIDEpIC1cbiAgICAgICAgICAgICAgICAgICAgICAgIGRheUZyb21Nb250aCh5ZWFyLCBtb250aClcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSAoXG4gICAgICAgICAgICAgICAgICAgICAgICAoZGF5RnJvbU1vbnRoKHllYXIsIG1vbnRoKSArIGRheSkgKiAyNCArXG4gICAgICAgICAgICAgICAgICAgICAgICBob3VyICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvdXJPZmZzZXQgKiBzaWduT2Zmc2V0XG4gICAgICAgICAgICAgICAgICAgICkgKiA2MDtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gKFxuICAgICAgICAgICAgICAgICAgICAgICAgKHJlc3VsdCArIG1pbnV0ZSArIG1pbnV0ZU9mZnNldCAqIHNpZ25PZmZzZXQpICogNjAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgc2Vjb25kXG4gICAgICAgICAgICAgICAgICAgICkgKiAxMDAwICsgbWlsbGlzZWNvbmQgKyBvZmZzZXQ7XG4gICAgICAgICAgICAgICAgICAgIGlmICgtOC42NGUxNSA8PSByZXN1bHQgJiYgcmVzdWx0IDw9IDguNjRlMTUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIE5hTjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBOYXRpdmVEYXRlLnBhcnNlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIERhdGU7XG4gICAgfSkoRGF0ZSk7XG59XG5cbi8vIEVTNSAxNS45LjQuNFxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuOS40LjRcbmlmICghRGF0ZS5ub3cpIHtcbiAgICBEYXRlLm5vdyA9IGZ1bmN0aW9uIG5vdygpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIH07XG59XG5cblxuLy9cbi8vIE51bWJlclxuLy8gPT09PT09XG4vL1xuXG4vLyBFUzUuMSAxNS43LjQuNVxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNy40LjVcbmlmICghTnVtYmVyLnByb3RvdHlwZS50b0ZpeGVkIHx8ICgwLjAwMDA4KS50b0ZpeGVkKDMpICE9PSAnMC4wMDAnIHx8ICgwLjkpLnRvRml4ZWQoMCkgPT09ICcwJyB8fCAoMS4yNTUpLnRvRml4ZWQoMikgIT09ICcxLjI1JyB8fCAoMTAwMDAwMDAwMDAwMDAwMDEyOCkudG9GaXhlZCgwKSAhPT0gXCIxMDAwMDAwMDAwMDAwMDAwMTI4XCIpIHtcbiAgICAvLyBIaWRlIHRoZXNlIHZhcmlhYmxlcyBhbmQgZnVuY3Rpb25zXG4gICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGJhc2UsIHNpemUsIGRhdGEsIGk7XG5cbiAgICAgICAgYmFzZSA9IDFlNztcbiAgICAgICAgc2l6ZSA9IDY7XG4gICAgICAgIGRhdGEgPSBbMCwgMCwgMCwgMCwgMCwgMF07XG5cbiAgICAgICAgZnVuY3Rpb24gbXVsdGlwbHkobiwgYykge1xuICAgICAgICAgICAgdmFyIGkgPSAtMTtcbiAgICAgICAgICAgIHdoaWxlICgrK2kgPCBzaXplKSB7XG4gICAgICAgICAgICAgICAgYyArPSBuICogZGF0YVtpXTtcbiAgICAgICAgICAgICAgICBkYXRhW2ldID0gYyAlIGJhc2U7XG4gICAgICAgICAgICAgICAgYyA9IE1hdGguZmxvb3IoYyAvIGJhc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZGl2aWRlKG4pIHtcbiAgICAgICAgICAgIHZhciBpID0gc2l6ZSwgYyA9IDA7XG4gICAgICAgICAgICB3aGlsZSAoLS1pID49IDApIHtcbiAgICAgICAgICAgICAgICBjICs9IGRhdGFbaV07XG4gICAgICAgICAgICAgICAgZGF0YVtpXSA9IE1hdGguZmxvb3IoYyAvIG4pO1xuICAgICAgICAgICAgICAgIGMgPSAoYyAlIG4pICogYmFzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgICAgICAgICAgdmFyIGkgPSBzaXplO1xuICAgICAgICAgICAgdmFyIHMgPSAnJztcbiAgICAgICAgICAgIHdoaWxlICgtLWkgPj0gMCkge1xuICAgICAgICAgICAgICAgIGlmIChzICE9PSAnJyB8fCBpID09PSAwIHx8IGRhdGFbaV0gIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHQgPSBTdHJpbmcoZGF0YVtpXSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzID09PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcyA9IHQ7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzICs9ICcwMDAwMDAwJy5zbGljZSgwLCA3IC0gdC5sZW5ndGgpICsgdDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcG93KHgsIG4sIGFjYykge1xuICAgICAgICAgICAgcmV0dXJuIChuID09PSAwID8gYWNjIDogKG4gJSAyID09PSAxID8gcG93KHgsIG4gLSAxLCBhY2MgKiB4KSA6IHBvdyh4ICogeCwgbiAvIDIsIGFjYykpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGxvZyh4KSB7XG4gICAgICAgICAgICB2YXIgbiA9IDA7XG4gICAgICAgICAgICB3aGlsZSAoeCA+PSA0MDk2KSB7XG4gICAgICAgICAgICAgICAgbiArPSAxMjtcbiAgICAgICAgICAgICAgICB4IC89IDQwOTY7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3aGlsZSAoeCA+PSAyKSB7XG4gICAgICAgICAgICAgICAgbiArPSAxO1xuICAgICAgICAgICAgICAgIHggLz0gMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBuO1xuICAgICAgICB9XG5cbiAgICAgICAgTnVtYmVyLnByb3RvdHlwZS50b0ZpeGVkID0gZnVuY3Rpb24gKGZyYWN0aW9uRGlnaXRzKSB7XG4gICAgICAgICAgICB2YXIgZiwgeCwgcywgbSwgZSwgeiwgaiwgaztcblxuICAgICAgICAgICAgLy8gVGVzdCBmb3IgTmFOIGFuZCByb3VuZCBmcmFjdGlvbkRpZ2l0cyBkb3duXG4gICAgICAgICAgICBmID0gTnVtYmVyKGZyYWN0aW9uRGlnaXRzKTtcbiAgICAgICAgICAgIGYgPSBmICE9PSBmID8gMCA6IE1hdGguZmxvb3IoZik7XG5cbiAgICAgICAgICAgIGlmIChmIDwgMCB8fCBmID4gMjApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcIk51bWJlci50b0ZpeGVkIGNhbGxlZCB3aXRoIGludmFsaWQgbnVtYmVyIG9mIGRlY2ltYWxzXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB4ID0gTnVtYmVyKHRoaXMpO1xuXG4gICAgICAgICAgICAvLyBUZXN0IGZvciBOYU5cbiAgICAgICAgICAgIGlmICh4ICE9PSB4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiTmFOXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIElmIGl0IGlzIHRvbyBiaWcgb3Igc21hbGwsIHJldHVybiB0aGUgc3RyaW5nIHZhbHVlIG9mIHRoZSBudW1iZXJcbiAgICAgICAgICAgIGlmICh4IDw9IC0xZTIxIHx8IHggPj0gMWUyMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBTdHJpbmcoeCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHMgPSBcIlwiO1xuXG4gICAgICAgICAgICBpZiAoeCA8IDApIHtcbiAgICAgICAgICAgICAgICBzID0gXCItXCI7XG4gICAgICAgICAgICAgICAgeCA9IC14O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtID0gXCIwXCI7XG5cbiAgICAgICAgICAgIGlmICh4ID4gMWUtMjEpIHtcbiAgICAgICAgICAgICAgICAvLyAxZS0yMSA8IHggPCAxZTIxXG4gICAgICAgICAgICAgICAgLy8gLTcwIDwgbG9nMih4KSA8IDcwXG4gICAgICAgICAgICAgICAgZSA9IGxvZyh4ICogcG93KDIsIDY5LCAxKSkgLSA2OTtcbiAgICAgICAgICAgICAgICB6ID0gKGUgPCAwID8geCAqIHBvdygyLCAtZSwgMSkgOiB4IC8gcG93KDIsIGUsIDEpKTtcbiAgICAgICAgICAgICAgICB6ICo9IDB4MTAwMDAwMDAwMDAwMDA7IC8vIE1hdGgucG93KDIsIDUyKTtcbiAgICAgICAgICAgICAgICBlID0gNTIgLSBlO1xuXG4gICAgICAgICAgICAgICAgLy8gLTE4IDwgZSA8IDEyMlxuICAgICAgICAgICAgICAgIC8vIHggPSB6IC8gMiBeIGVcbiAgICAgICAgICAgICAgICBpZiAoZSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbXVsdGlwbHkoMCwgeik7XG4gICAgICAgICAgICAgICAgICAgIGogPSBmO1xuXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChqID49IDcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG11bHRpcGx5KDFlNywgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBqIC09IDc7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBtdWx0aXBseShwb3coMTAsIGosIDEpLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgaiA9IGUgLSAxO1xuXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChqID49IDIzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXZpZGUoMSA8PCAyMyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBqIC09IDIzO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgZGl2aWRlKDEgPDwgaik7XG4gICAgICAgICAgICAgICAgICAgIG11bHRpcGx5KDEsIDEpO1xuICAgICAgICAgICAgICAgICAgICBkaXZpZGUoMik7XG4gICAgICAgICAgICAgICAgICAgIG0gPSB0b1N0cmluZygpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG11bHRpcGx5KDAsIHopO1xuICAgICAgICAgICAgICAgICAgICBtdWx0aXBseSgxIDw8ICgtZSksIDApO1xuICAgICAgICAgICAgICAgICAgICBtID0gdG9TdHJpbmcoKSArICcwLjAwMDAwMDAwMDAwMDAwMDAwMDAwJy5zbGljZSgyLCAyICsgZik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZiA+IDApIHtcbiAgICAgICAgICAgICAgICBrID0gbS5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICBpZiAoayA8PSBmKSB7XG4gICAgICAgICAgICAgICAgICAgIG0gPSBzICsgJzAuMDAwMDAwMDAwMDAwMDAwMDAwMCcuc2xpY2UoMCwgZiAtIGsgKyAyKSArIG07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbSA9IHMgKyBtLnNsaWNlKDAsIGsgLSBmKSArICcuJyArIG0uc2xpY2UoayAtIGYpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbSA9IHMgKyBtO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbTtcbiAgICAgICAgfVxuICAgIH0oKSk7XG59XG5cblxuLy9cbi8vIFN0cmluZ1xuLy8gPT09PT09XG4vL1xuXG5cbi8vIEVTNSAxNS41LjQuMTRcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjUuNC4xNFxuXG4vLyBbYnVnZml4LCBJRSBsdCA5LCBmaXJlZm94IDQsIEtvbnF1ZXJvciwgT3BlcmEsIG9ic2N1cmUgYnJvd3NlcnNdXG4vLyBNYW55IGJyb3dzZXJzIGRvIG5vdCBzcGxpdCBwcm9wZXJseSB3aXRoIHJlZ3VsYXIgZXhwcmVzc2lvbnMgb3IgdGhleVxuLy8gZG8gbm90IHBlcmZvcm0gdGhlIHNwbGl0IGNvcnJlY3RseSB1bmRlciBvYnNjdXJlIGNvbmRpdGlvbnMuXG4vLyBTZWUgaHR0cDovL2Jsb2cuc3RldmVubGV2aXRoYW4uY29tL2FyY2hpdmVzL2Nyb3NzLWJyb3dzZXItc3BsaXRcbi8vIEkndmUgdGVzdGVkIGluIG1hbnkgYnJvd3NlcnMgYW5kIHRoaXMgc2VlbXMgdG8gY292ZXIgdGhlIGRldmlhbnQgb25lczpcbi8vICAgICdhYicuc3BsaXQoLyg/OmFiKSovKSBzaG91bGQgYmUgW1wiXCIsIFwiXCJdLCBub3QgW1wiXCJdXG4vLyAgICAnLicuc3BsaXQoLyguPykoLj8pLykgc2hvdWxkIGJlIFtcIlwiLCBcIi5cIiwgXCJcIiwgXCJcIl0sIG5vdCBbXCJcIiwgXCJcIl1cbi8vICAgICd0ZXNzdCcuc3BsaXQoLyhzKSovKSBzaG91bGQgYmUgW1widFwiLCB1bmRlZmluZWQsIFwiZVwiLCBcInNcIiwgXCJ0XCJdLCBub3Rcbi8vICAgICAgIFt1bmRlZmluZWQsIFwidFwiLCB1bmRlZmluZWQsIFwiZVwiLCAuLi5dXG4vLyAgICAnJy5zcGxpdCgvLj8vKSBzaG91bGQgYmUgW10sIG5vdCBbXCJcIl1cbi8vICAgICcuJy5zcGxpdCgvKCkoKS8pIHNob3VsZCBiZSBbXCIuXCJdLCBub3QgW1wiXCIsIFwiXCIsIFwiLlwiXVxuXG52YXIgc3RyaW5nX3NwbGl0ID0gU3RyaW5nLnByb3RvdHlwZS5zcGxpdDtcbmlmIChcbiAgICAnYWInLnNwbGl0KC8oPzphYikqLykubGVuZ3RoICE9PSAyIHx8XG4gICAgJy4nLnNwbGl0KC8oLj8pKC4/KS8pLmxlbmd0aCAhPT0gNCB8fFxuICAgICd0ZXNzdCcuc3BsaXQoLyhzKSovKVsxXSA9PT0gXCJ0XCIgfHxcbiAgICAnJy5zcGxpdCgvLj8vKS5sZW5ndGggPT09IDAgfHxcbiAgICAnLicuc3BsaXQoLygpKCkvKS5sZW5ndGggPiAxXG4pIHtcbiAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY29tcGxpYW50RXhlY05wY2cgPSAvKCk/Py8uZXhlYyhcIlwiKVsxXSA9PT0gdm9pZCAwOyAvLyBOUENHOiBub25wYXJ0aWNpcGF0aW5nIGNhcHR1cmluZyBncm91cFxuXG4gICAgICAgIFN0cmluZy5wcm90b3R5cGUuc3BsaXQgPSBmdW5jdGlvbiAoc2VwYXJhdG9yLCBsaW1pdCkge1xuICAgICAgICAgICAgdmFyIHN0cmluZyA9IHRoaXM7XG4gICAgICAgICAgICBpZiAoc2VwYXJhdG9yID09PSB2b2lkIDAgJiYgbGltaXQgPT09IDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuXG4gICAgICAgICAgICAvLyBJZiBgc2VwYXJhdG9yYCBpcyBub3QgYSByZWdleCwgdXNlIG5hdGl2ZSBzcGxpdFxuICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChzZXBhcmF0b3IpICE9PSBcIltvYmplY3QgUmVnRXhwXVwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0cmluZ19zcGxpdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgb3V0cHV0ID0gW10sXG4gICAgICAgICAgICAgICAgZmxhZ3MgPSAoc2VwYXJhdG9yLmlnbm9yZUNhc2UgPyBcImlcIiA6IFwiXCIpICtcbiAgICAgICAgICAgICAgICAgICAgICAgIChzZXBhcmF0b3IubXVsdGlsaW5lICA/IFwibVwiIDogXCJcIikgK1xuICAgICAgICAgICAgICAgICAgICAgICAgKHNlcGFyYXRvci5leHRlbmRlZCAgID8gXCJ4XCIgOiBcIlwiKSArIC8vIFByb3Bvc2VkIGZvciBFUzZcbiAgICAgICAgICAgICAgICAgICAgICAgIChzZXBhcmF0b3Iuc3RpY2t5ICAgICA/IFwieVwiIDogXCJcIiksIC8vIEZpcmVmb3ggMytcbiAgICAgICAgICAgICAgICBsYXN0TGFzdEluZGV4ID0gMCxcbiAgICAgICAgICAgICAgICAvLyBNYWtlIGBnbG9iYWxgIGFuZCBhdm9pZCBgbGFzdEluZGV4YCBpc3N1ZXMgYnkgd29ya2luZyB3aXRoIGEgY29weVxuICAgICAgICAgICAgICAgIHNlcGFyYXRvciA9IG5ldyBSZWdFeHAoc2VwYXJhdG9yLnNvdXJjZSwgZmxhZ3MgKyBcImdcIiksXG4gICAgICAgICAgICAgICAgc2VwYXJhdG9yMiwgbWF0Y2gsIGxhc3RJbmRleCwgbGFzdExlbmd0aDtcbiAgICAgICAgICAgIHN0cmluZyArPSBcIlwiOyAvLyBUeXBlLWNvbnZlcnRcbiAgICAgICAgICAgIGlmICghY29tcGxpYW50RXhlY05wY2cpIHtcbiAgICAgICAgICAgICAgICAvLyBEb2Vzbid0IG5lZWQgZmxhZ3MgZ3ksIGJ1dCB0aGV5IGRvbid0IGh1cnRcbiAgICAgICAgICAgICAgICBzZXBhcmF0b3IyID0gbmV3IFJlZ0V4cChcIl5cIiArIHNlcGFyYXRvci5zb3VyY2UgKyBcIiQoPyFcXFxccylcIiwgZmxhZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyogVmFsdWVzIGZvciBgbGltaXRgLCBwZXIgdGhlIHNwZWM6XG4gICAgICAgICAgICAgKiBJZiB1bmRlZmluZWQ6IDQyOTQ5NjcyOTUgLy8gTWF0aC5wb3coMiwgMzIpIC0gMVxuICAgICAgICAgICAgICogSWYgMCwgSW5maW5pdHksIG9yIE5hTjogMFxuICAgICAgICAgICAgICogSWYgcG9zaXRpdmUgbnVtYmVyOiBsaW1pdCA9IE1hdGguZmxvb3IobGltaXQpOyBpZiAobGltaXQgPiA0Mjk0OTY3Mjk1KSBsaW1pdCAtPSA0Mjk0OTY3Mjk2O1xuICAgICAgICAgICAgICogSWYgbmVnYXRpdmUgbnVtYmVyOiA0Mjk0OTY3Mjk2IC0gTWF0aC5mbG9vcihNYXRoLmFicyhsaW1pdCkpXG4gICAgICAgICAgICAgKiBJZiBvdGhlcjogVHlwZS1jb252ZXJ0LCB0aGVuIHVzZSB0aGUgYWJvdmUgcnVsZXNcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbGltaXQgPSBsaW1pdCA9PT0gdm9pZCAwID9cbiAgICAgICAgICAgICAgICAtMSA+Pj4gMCA6IC8vIE1hdGgucG93KDIsIDMyKSAtIDFcbiAgICAgICAgICAgICAgICBsaW1pdCA+Pj4gMDsgLy8gVG9VaW50MzIobGltaXQpXG4gICAgICAgICAgICB3aGlsZSAobWF0Y2ggPSBzZXBhcmF0b3IuZXhlYyhzdHJpbmcpKSB7XG4gICAgICAgICAgICAgICAgLy8gYHNlcGFyYXRvci5sYXN0SW5kZXhgIGlzIG5vdCByZWxpYWJsZSBjcm9zcy1icm93c2VyXG4gICAgICAgICAgICAgICAgbGFzdEluZGV4ID0gbWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgaWYgKGxhc3RJbmRleCA+IGxhc3RMYXN0SW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goc3RyaW5nLnNsaWNlKGxhc3RMYXN0SW5kZXgsIG1hdGNoLmluZGV4KSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIEZpeCBicm93c2VycyB3aG9zZSBgZXhlY2AgbWV0aG9kcyBkb24ndCBjb25zaXN0ZW50bHkgcmV0dXJuIGB1bmRlZmluZWRgIGZvclxuICAgICAgICAgICAgICAgICAgICAvLyBub25wYXJ0aWNpcGF0aW5nIGNhcHR1cmluZyBncm91cHNcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjb21wbGlhbnRFeGVjTnBjZyAmJiBtYXRjaC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaFswXS5yZXBsYWNlKHNlcGFyYXRvcjIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGggLSAyOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFyZ3VtZW50c1tpXSA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaFtpXSA9IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXRjaC5sZW5ndGggPiAxICYmIG1hdGNoLmluZGV4IDwgc3RyaW5nLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkob3V0cHV0LCBtYXRjaC5zbGljZSgxKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGFzdExlbmd0aCA9IG1hdGNoWzBdLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgbGFzdExhc3RJbmRleCA9IGxhc3RJbmRleDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG91dHB1dC5sZW5ndGggPj0gbGltaXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzZXBhcmF0b3IubGFzdEluZGV4ID09PSBtYXRjaC5pbmRleCkge1xuICAgICAgICAgICAgICAgICAgICBzZXBhcmF0b3IubGFzdEluZGV4Kys7IC8vIEF2b2lkIGFuIGluZmluaXRlIGxvb3BcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobGFzdExhc3RJbmRleCA9PT0gc3RyaW5nLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGlmIChsYXN0TGVuZ3RoIHx8ICFzZXBhcmF0b3IudGVzdChcIlwiKSkge1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChcIlwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKHN0cmluZy5zbGljZShsYXN0TGFzdEluZGV4KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gb3V0cHV0Lmxlbmd0aCA+IGxpbWl0ID8gb3V0cHV0LnNsaWNlKDAsIGxpbWl0KSA6IG91dHB1dDtcbiAgICAgICAgfTtcbiAgICB9KCkpO1xuXG4vLyBbYnVnZml4LCBjaHJvbWVdXG4vLyBJZiBzZXBhcmF0b3IgaXMgdW5kZWZpbmVkLCB0aGVuIHRoZSByZXN1bHQgYXJyYXkgY29udGFpbnMganVzdCBvbmUgU3RyaW5nLFxuLy8gd2hpY2ggaXMgdGhlIHRoaXMgdmFsdWUgKGNvbnZlcnRlZCB0byBhIFN0cmluZykuIElmIGxpbWl0IGlzIG5vdCB1bmRlZmluZWQsXG4vLyB0aGVuIHRoZSBvdXRwdXQgYXJyYXkgaXMgdHJ1bmNhdGVkIHNvIHRoYXQgaXQgY29udGFpbnMgbm8gbW9yZSB0aGFuIGxpbWl0XG4vLyBlbGVtZW50cy5cbi8vIFwiMFwiLnNwbGl0KHVuZGVmaW5lZCwgMCkgLT4gW11cbn0gZWxzZSBpZiAoXCIwXCIuc3BsaXQodm9pZCAwLCAwKS5sZW5ndGgpIHtcbiAgICBTdHJpbmcucHJvdG90eXBlLnNwbGl0ID0gZnVuY3Rpb24oc2VwYXJhdG9yLCBsaW1pdCkge1xuICAgICAgICBpZiAoc2VwYXJhdG9yID09PSB2b2lkIDAgJiYgbGltaXQgPT09IDApIHJldHVybiBbXTtcbiAgICAgICAgcmV0dXJuIHN0cmluZ19zcGxpdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbn1cblxuXG4vLyBFQ01BLTI2MiwgM3JkIEIuMi4zXG4vLyBOb3RlIGFuIEVDTUFTY3JpcHQgc3RhbmRhcnQsIGFsdGhvdWdoIEVDTUFTY3JpcHQgM3JkIEVkaXRpb24gaGFzIGFcbi8vIG5vbi1ub3JtYXRpdmUgc2VjdGlvbiBzdWdnZXN0aW5nIHVuaWZvcm0gc2VtYW50aWNzIGFuZCBpdCBzaG91bGQgYmVcbi8vIG5vcm1hbGl6ZWQgYWNyb3NzIGFsbCBicm93c2Vyc1xuLy8gW2J1Z2ZpeCwgSUUgbHQgOV0gSUUgPCA5IHN1YnN0cigpIHdpdGggbmVnYXRpdmUgdmFsdWUgbm90IHdvcmtpbmcgaW4gSUVcbmlmKFwiXCIuc3Vic3RyICYmIFwiMGJcIi5zdWJzdHIoLTEpICE9PSBcImJcIikge1xuICAgIHZhciBzdHJpbmdfc3Vic3RyID0gU3RyaW5nLnByb3RvdHlwZS5zdWJzdHI7XG4gICAgLyoqXG4gICAgICogIEdldCB0aGUgc3Vic3RyaW5nIG9mIGEgc3RyaW5nXG4gICAgICogIEBwYXJhbSAge2ludGVnZXJ9ICBzdGFydCAgIHdoZXJlIHRvIHN0YXJ0IHRoZSBzdWJzdHJpbmdcbiAgICAgKiAgQHBhcmFtICB7aW50ZWdlcn0gIGxlbmd0aCAgaG93IG1hbnkgY2hhcmFjdGVycyB0byByZXR1cm5cbiAgICAgKiAgQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuICAgIFN0cmluZy5wcm90b3R5cGUuc3Vic3RyID0gZnVuY3Rpb24oc3RhcnQsIGxlbmd0aCkge1xuICAgICAgICByZXR1cm4gc3RyaW5nX3N1YnN0ci5jYWxsKFxuICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgIHN0YXJ0IDwgMCA/ICgoc3RhcnQgPSB0aGlzLmxlbmd0aCArIHN0YXJ0KSA8IDAgPyAwIDogc3RhcnQpIDogc3RhcnQsXG4gICAgICAgICAgICBsZW5ndGhcbiAgICAgICAgKTtcbiAgICB9XG59XG5cbi8vIEVTNSAxNS41LjQuMjBcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjUuNC4yMFxudmFyIHdzID0gXCJcXHgwOVxceDBBXFx4MEJcXHgwQ1xceDBEXFx4MjBcXHhBMFxcdTE2ODBcXHUxODBFXFx1MjAwMFxcdTIwMDFcXHUyMDAyXFx1MjAwM1wiICtcbiAgICBcIlxcdTIwMDRcXHUyMDA1XFx1MjAwNlxcdTIwMDdcXHUyMDA4XFx1MjAwOVxcdTIwMEFcXHUyMDJGXFx1MjA1RlxcdTMwMDBcXHUyMDI4XCIgK1xuICAgIFwiXFx1MjAyOVxcdUZFRkZcIjtcbmlmICghU3RyaW5nLnByb3RvdHlwZS50cmltIHx8IHdzLnRyaW0oKSkge1xuICAgIC8vIGh0dHA6Ly9ibG9nLnN0ZXZlbmxldml0aGFuLmNvbS9hcmNoaXZlcy9mYXN0ZXItdHJpbS1qYXZhc2NyaXB0XG4gICAgLy8gaHR0cDovL3BlcmZlY3Rpb25raWxscy5jb20vd2hpdGVzcGFjZS1kZXZpYXRpb25zL1xuICAgIHdzID0gXCJbXCIgKyB3cyArIFwiXVwiO1xuICAgIHZhciB0cmltQmVnaW5SZWdleHAgPSBuZXcgUmVnRXhwKFwiXlwiICsgd3MgKyB3cyArIFwiKlwiKSxcbiAgICAgICAgdHJpbUVuZFJlZ2V4cCA9IG5ldyBSZWdFeHAod3MgKyB3cyArIFwiKiRcIik7XG4gICAgU3RyaW5nLnByb3RvdHlwZS50cmltID0gZnVuY3Rpb24gdHJpbSgpIHtcbiAgICAgICAgaWYgKHRoaXMgPT09IHZvaWQgMCB8fCB0aGlzID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiY2FuJ3QgY29udmVydCBcIit0aGlzK1wiIHRvIG9iamVjdFwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gU3RyaW5nKHRoaXMpXG4gICAgICAgICAgICAucmVwbGFjZSh0cmltQmVnaW5SZWdleHAsIFwiXCIpXG4gICAgICAgICAgICAucmVwbGFjZSh0cmltRW5kUmVnZXhwLCBcIlwiKTtcbiAgICB9O1xufVxuXG4vL1xuLy8gVXRpbFxuLy8gPT09PT09XG4vL1xuXG4vLyBFUzUgOS40XG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3g5LjRcbi8vIGh0dHA6Ly9qc3BlcmYuY29tL3RvLWludGVnZXJcblxuZnVuY3Rpb24gdG9JbnRlZ2VyKG4pIHtcbiAgICBuID0gK247XG4gICAgaWYgKG4gIT09IG4pIHsgLy8gaXNOYU5cbiAgICAgICAgbiA9IDA7XG4gICAgfSBlbHNlIGlmIChuICE9PSAwICYmIG4gIT09ICgxLzApICYmIG4gIT09IC0oMS8wKSkge1xuICAgICAgICBuID0gKG4gPiAwIHx8IC0xKSAqIE1hdGguZmxvb3IoTWF0aC5hYnMobikpO1xuICAgIH1cbiAgICByZXR1cm4gbjtcbn1cblxuZnVuY3Rpb24gaXNQcmltaXRpdmUoaW5wdXQpIHtcbiAgICB2YXIgdHlwZSA9IHR5cGVvZiBpbnB1dDtcbiAgICByZXR1cm4gKFxuICAgICAgICBpbnB1dCA9PT0gbnVsbCB8fFxuICAgICAgICB0eXBlID09PSBcInVuZGVmaW5lZFwiIHx8XG4gICAgICAgIHR5cGUgPT09IFwiYm9vbGVhblwiIHx8XG4gICAgICAgIHR5cGUgPT09IFwibnVtYmVyXCIgfHxcbiAgICAgICAgdHlwZSA9PT0gXCJzdHJpbmdcIlxuICAgICk7XG59XG5cbmZ1bmN0aW9uIHRvUHJpbWl0aXZlKGlucHV0KSB7XG4gICAgdmFyIHZhbCwgdmFsdWVPZiwgdG9TdHJpbmc7XG4gICAgaWYgKGlzUHJpbWl0aXZlKGlucHV0KSkge1xuICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgfVxuICAgIHZhbHVlT2YgPSBpbnB1dC52YWx1ZU9mO1xuICAgIGlmICh0eXBlb2YgdmFsdWVPZiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHZhbCA9IHZhbHVlT2YuY2FsbChpbnB1dCk7XG4gICAgICAgIGlmIChpc1ByaW1pdGl2ZSh2YWwpKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgICB9XG4gICAgfVxuICAgIHRvU3RyaW5nID0gaW5wdXQudG9TdHJpbmc7XG4gICAgaWYgKHR5cGVvZiB0b1N0cmluZyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHZhbCA9IHRvU3RyaW5nLmNhbGwoaW5wdXQpO1xuICAgICAgICBpZiAoaXNQcmltaXRpdmUodmFsKSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG59XG5cbi8vIEVTNSA5Ljlcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDkuOVxudmFyIHRvT2JqZWN0ID0gZnVuY3Rpb24gKG8pIHtcbiAgICBpZiAobyA9PSBudWxsKSB7IC8vIHRoaXMgbWF0Y2hlcyBib3RoIG51bGwgYW5kIHVuZGVmaW5lZFxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiY2FuJ3QgY29udmVydCBcIitvK1wiIHRvIG9iamVjdFwiKTtcbiAgICB9XG4gICAgcmV0dXJuIE9iamVjdChvKTtcbn07XG5cbn0pO1xuXG59KSgpIiwiKGZ1bmN0aW9uKCl7Ly8gQ29weXJpZ2h0IDIwMDktMjAxMiBieSBjb250cmlidXRvcnMsIE1JVCBMaWNlbnNlXG4vLyB2aW06IHRzPTQgc3RzPTQgc3c9NCBleHBhbmR0YWJcblxuLy8gTW9kdWxlIHN5c3RlbXMgbWFnaWMgZGFuY2VcbihmdW5jdGlvbiAoZGVmaW5pdGlvbikge1xuICAgIC8vIFJlcXVpcmVKU1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBkZWZpbmUoZGVmaW5pdGlvbik7XG4gICAgLy8gWVVJM1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIFlVSSA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgWVVJLmFkZChcImVzNS1zaGFtXCIsIGRlZmluaXRpb24pO1xuICAgIC8vIENvbW1vbkpTIGFuZCA8c2NyaXB0PlxuICAgIH0gZWxzZSB7XG4gICAgICAgIGRlZmluaXRpb24oKTtcbiAgICB9XG59KShmdW5jdGlvbiAoKSB7XG5cblxudmFyIGNhbGwgPSBGdW5jdGlvbi5wcm90b3R5cGUuY2FsbDtcbnZhciBwcm90b3R5cGVPZk9iamVjdCA9IE9iamVjdC5wcm90b3R5cGU7XG52YXIgb3ducyA9IGNhbGwuYmluZChwcm90b3R5cGVPZk9iamVjdC5oYXNPd25Qcm9wZXJ0eSk7XG5cbi8vIElmIEpTIGVuZ2luZSBzdXBwb3J0cyBhY2Nlc3NvcnMgY3JlYXRpbmcgc2hvcnRjdXRzLlxudmFyIGRlZmluZUdldHRlcjtcbnZhciBkZWZpbmVTZXR0ZXI7XG52YXIgbG9va3VwR2V0dGVyO1xudmFyIGxvb2t1cFNldHRlcjtcbnZhciBzdXBwb3J0c0FjY2Vzc29ycztcbmlmICgoc3VwcG9ydHNBY2Nlc3NvcnMgPSBvd25zKHByb3RvdHlwZU9mT2JqZWN0LCBcIl9fZGVmaW5lR2V0dGVyX19cIikpKSB7XG4gICAgZGVmaW5lR2V0dGVyID0gY2FsbC5iaW5kKHByb3RvdHlwZU9mT2JqZWN0Ll9fZGVmaW5lR2V0dGVyX18pO1xuICAgIGRlZmluZVNldHRlciA9IGNhbGwuYmluZChwcm90b3R5cGVPZk9iamVjdC5fX2RlZmluZVNldHRlcl9fKTtcbiAgICBsb29rdXBHZXR0ZXIgPSBjYWxsLmJpbmQocHJvdG90eXBlT2ZPYmplY3QuX19sb29rdXBHZXR0ZXJfXyk7XG4gICAgbG9va3VwU2V0dGVyID0gY2FsbC5iaW5kKHByb3RvdHlwZU9mT2JqZWN0Ll9fbG9va3VwU2V0dGVyX18pO1xufVxuXG4vLyBFUzUgMTUuMi4zLjJcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjIuMy4yXG5pZiAoIU9iamVjdC5nZXRQcm90b3R5cGVPZikge1xuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9rcmlza293YWwvZXM1LXNoaW0vaXNzdWVzI2lzc3VlLzJcbiAgICAvLyBodHRwOi8vZWpvaG4ub3JnL2Jsb2cvb2JqZWN0Z2V0cHJvdG90eXBlb2YvXG4gICAgLy8gcmVjb21tZW5kZWQgYnkgZnNjaGFlZmVyIG9uIGdpdGh1YlxuICAgIE9iamVjdC5nZXRQcm90b3R5cGVPZiA9IGZ1bmN0aW9uIGdldFByb3RvdHlwZU9mKG9iamVjdCkge1xuICAgICAgICByZXR1cm4gb2JqZWN0Ll9fcHJvdG9fXyB8fCAoXG4gICAgICAgICAgICBvYmplY3QuY29uc3RydWN0b3JcbiAgICAgICAgICAgICAgICA/IG9iamVjdC5jb25zdHJ1Y3Rvci5wcm90b3R5cGVcbiAgICAgICAgICAgICAgICA6IHByb3RvdHlwZU9mT2JqZWN0XG4gICAgICAgICk7XG4gICAgfTtcbn1cblxuLy9FUzUgMTUuMi4zLjNcbi8vaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuMi4zLjNcblxuZnVuY3Rpb24gZG9lc0dldE93blByb3BlcnR5RGVzY3JpcHRvcldvcmsob2JqZWN0KSB7XG4gICAgdHJ5IHtcbiAgICAgICAgb2JqZWN0LnNlbnRpbmVsID0gMDtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoXG4gICAgICAgICAgICAgICAgb2JqZWN0LFxuICAgICAgICAgICAgICAgIFwic2VudGluZWxcIlxuICAgICAgICApLnZhbHVlID09PSAwO1xuICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgICAgICAvLyByZXR1cm5zIGZhbHN5XG4gICAgfVxufVxuXG4vL2NoZWNrIHdoZXRoZXIgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIHdvcmtzIGlmIGl0J3MgZ2l2ZW4uIE90aGVyd2lzZSxcbi8vc2hpbSBwYXJ0aWFsbHkuXG5pZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7XG4gICAgdmFyIGdldE93blByb3BlcnR5RGVzY3JpcHRvcldvcmtzT25PYmplY3QgPSBcbiAgICAgICAgZG9lc0dldE93blByb3BlcnR5RGVzY3JpcHRvcldvcmsoe30pO1xuICAgIHZhciBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JXb3Jrc09uRG9tID0gdHlwZW9mIGRvY3VtZW50ID09IFwidW5kZWZpbmVkXCIgfHxcbiAgICBkb2VzR2V0T3duUHJvcGVydHlEZXNjcmlwdG9yV29yayhkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKTtcbiAgICBpZiAoIWdldE93blByb3BlcnR5RGVzY3JpcHRvcldvcmtzT25Eb20gfHwgXG4gICAgICAgICAgICAhZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yV29ya3NPbk9iamVjdFxuICAgICkge1xuICAgICAgICB2YXIgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yRmFsbGJhY2sgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuICAgIH1cbn1cblxuaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIHx8IGdldE93blByb3BlcnR5RGVzY3JpcHRvckZhbGxiYWNrKSB7XG4gICAgdmFyIEVSUl9OT05fT0JKRUNUID0gXCJPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIGNhbGxlZCBvbiBhIG5vbi1vYmplY3Q6IFwiO1xuXG4gICAgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHByb3BlcnR5KSB7XG4gICAgICAgIGlmICgodHlwZW9mIG9iamVjdCAhPSBcIm9iamVjdFwiICYmIHR5cGVvZiBvYmplY3QgIT0gXCJmdW5jdGlvblwiKSB8fCBvYmplY3QgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRVJSX05PTl9PQkpFQ1QgKyBvYmplY3QpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbWFrZSBhIHZhbGlhbnQgYXR0ZW1wdCB0byB1c2UgdGhlIHJlYWwgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yXG4gICAgICAgIC8vIGZvciBJOCdzIERPTSBlbGVtZW50cy5cbiAgICAgICAgaWYgKGdldE93blByb3BlcnR5RGVzY3JpcHRvckZhbGxiYWNrKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JGYWxsYmFjay5jYWxsKE9iamVjdCwgb2JqZWN0LCBwcm9wZXJ0eSk7XG4gICAgICAgICAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICAgICAgICAgICAgICAvLyB0cnkgdGhlIHNoaW0gaWYgdGhlIHJlYWwgb25lIGRvZXNuJ3Qgd29ya1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgb2JqZWN0IGRvZXMgbm90IG93bnMgcHJvcGVydHkgcmV0dXJuIHVuZGVmaW5lZCBpbW1lZGlhdGVseS5cbiAgICAgICAgaWYgKCFvd25zKG9iamVjdCwgcHJvcGVydHkpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiBvYmplY3QgaGFzIGEgcHJvcGVydHkgdGhlbiBpdCdzIGZvciBzdXJlIGJvdGggYGVudW1lcmFibGVgIGFuZFxuICAgICAgICAvLyBgY29uZmlndXJhYmxlYC5cbiAgICAgICAgdmFyIGRlc2NyaXB0b3IgPSAgeyBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfTtcblxuICAgICAgICAvLyBJZiBKUyBlbmdpbmUgc3VwcG9ydHMgYWNjZXNzb3IgcHJvcGVydGllcyB0aGVuIHByb3BlcnR5IG1heSBiZSBhXG4gICAgICAgIC8vIGdldHRlciBvciBzZXR0ZXIuXG4gICAgICAgIGlmIChzdXBwb3J0c0FjY2Vzc29ycykge1xuICAgICAgICAgICAgLy8gVW5mb3J0dW5hdGVseSBgX19sb29rdXBHZXR0ZXJfX2Agd2lsbCByZXR1cm4gYSBnZXR0ZXIgZXZlblxuICAgICAgICAgICAgLy8gaWYgb2JqZWN0IGhhcyBvd24gbm9uIGdldHRlciBwcm9wZXJ0eSBhbG9uZyB3aXRoIGEgc2FtZSBuYW1lZFxuICAgICAgICAgICAgLy8gaW5oZXJpdGVkIGdldHRlci4gVG8gYXZvaWQgbWlzYmVoYXZpb3Igd2UgdGVtcG9yYXJ5IHJlbW92ZVxuICAgICAgICAgICAgLy8gYF9fcHJvdG9fX2Agc28gdGhhdCBgX19sb29rdXBHZXR0ZXJfX2Agd2lsbCByZXR1cm4gZ2V0dGVyIG9ubHlcbiAgICAgICAgICAgIC8vIGlmIGl0J3Mgb3duZWQgYnkgYW4gb2JqZWN0LlxuICAgICAgICAgICAgdmFyIHByb3RvdHlwZSA9IG9iamVjdC5fX3Byb3RvX187XG4gICAgICAgICAgICBvYmplY3QuX19wcm90b19fID0gcHJvdG90eXBlT2ZPYmplY3Q7XG5cbiAgICAgICAgICAgIHZhciBnZXR0ZXIgPSBsb29rdXBHZXR0ZXIob2JqZWN0LCBwcm9wZXJ0eSk7XG4gICAgICAgICAgICB2YXIgc2V0dGVyID0gbG9va3VwU2V0dGVyKG9iamVjdCwgcHJvcGVydHkpO1xuXG4gICAgICAgICAgICAvLyBPbmNlIHdlIGhhdmUgZ2V0dGVyIGFuZCBzZXR0ZXIgd2UgY2FuIHB1dCB2YWx1ZXMgYmFjay5cbiAgICAgICAgICAgIG9iamVjdC5fX3Byb3RvX18gPSBwcm90b3R5cGU7XG5cbiAgICAgICAgICAgIGlmIChnZXR0ZXIgfHwgc2V0dGVyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGdldHRlcikge1xuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdG9yLmdldCA9IGdldHRlcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHNldHRlcikge1xuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdG9yLnNldCA9IHNldHRlcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gSWYgaXQgd2FzIGFjY2Vzc29yIHByb3BlcnR5IHdlJ3JlIGRvbmUgYW5kIHJldHVybiBoZXJlXG4gICAgICAgICAgICAgICAgLy8gaW4gb3JkZXIgdG8gYXZvaWQgYWRkaW5nIGB2YWx1ZWAgdG8gdGhlIGRlc2NyaXB0b3IuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlc2NyaXB0b3I7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiB3ZSBnb3QgdGhpcyBmYXIgd2Uga25vdyB0aGF0IG9iamVjdCBoYXMgYW4gb3duIHByb3BlcnR5IHRoYXQgaXNcbiAgICAgICAgLy8gbm90IGFuIGFjY2Vzc29yIHNvIHdlIHNldCBpdCBhcyBhIHZhbHVlIGFuZCByZXR1cm4gZGVzY3JpcHRvci5cbiAgICAgICAgZGVzY3JpcHRvci52YWx1ZSA9IG9iamVjdFtwcm9wZXJ0eV07XG4gICAgICAgIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgICAgICByZXR1cm4gZGVzY3JpcHRvcjtcbiAgICB9O1xufVxuXG4vLyBFUzUgMTUuMi4zLjRcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjIuMy40XG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKSB7XG4gICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKG9iamVjdCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqZWN0KTtcbiAgICB9O1xufVxuXG4vLyBFUzUgMTUuMi4zLjVcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjIuMy41XG5pZiAoIU9iamVjdC5jcmVhdGUpIHtcblxuICAgIC8vIENvbnRyaWJ1dGVkIGJ5IEJyYW5kb24gQmVudmllLCBPY3RvYmVyLCAyMDEyXG4gICAgdmFyIGNyZWF0ZUVtcHR5O1xuICAgIHZhciBzdXBwb3J0c1Byb3RvID0gT2JqZWN0LnByb3RvdHlwZS5fX3Byb3RvX18gPT09IG51bGw7XG4gICAgaWYgKHN1cHBvcnRzUHJvdG8gfHwgdHlwZW9mIGRvY3VtZW50ID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGNyZWF0ZUVtcHR5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHsgXCJfX3Byb3RvX19cIjogbnVsbCB9O1xuICAgICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEluIG9sZCBJRSBfX3Byb3RvX18gY2FuJ3QgYmUgdXNlZCB0byBtYW51YWxseSBzZXQgYG51bGxgLCBub3IgZG9lc1xuICAgICAgICAvLyBhbnkgb3RoZXIgbWV0aG9kIGV4aXN0IHRvIG1ha2UgYW4gb2JqZWN0IHRoYXQgaW5oZXJpdHMgZnJvbSBub3RoaW5nLFxuICAgICAgICAvLyBhc2lkZSBmcm9tIE9iamVjdC5wcm90b3R5cGUgaXRzZWxmLiBJbnN0ZWFkLCBjcmVhdGUgYSBuZXcgZ2xvYmFsXG4gICAgICAgIC8vIG9iamVjdCBhbmQgKnN0ZWFsKiBpdHMgT2JqZWN0LnByb3RvdHlwZSBhbmQgc3RyaXAgaXQgYmFyZS4gVGhpcyBpc1xuICAgICAgICAvLyB1c2VkIGFzIHRoZSBwcm90b3R5cGUgdG8gY3JlYXRlIG51bGxhcnkgb2JqZWN0cy5cbiAgICAgICAgY3JlYXRlRW1wdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgaWZyYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaWZyYW1lJyk7XG4gICAgICAgICAgICB2YXIgcGFyZW50ID0gZG9jdW1lbnQuYm9keSB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgICAgICBpZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICAgICAgICAgICAgaWZyYW1lLnNyYyA9ICdqYXZhc2NyaXB0Oic7XG4gICAgICAgICAgICB2YXIgZW1wdHkgPSBpZnJhbWUuY29udGVudFdpbmRvdy5PYmplY3QucHJvdG90eXBlO1xuICAgICAgICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKGlmcmFtZSk7XG4gICAgICAgICAgICBpZnJhbWUgPSBudWxsO1xuICAgICAgICAgICAgZGVsZXRlIGVtcHR5LmNvbnN0cnVjdG9yO1xuICAgICAgICAgICAgZGVsZXRlIGVtcHR5Lmhhc093blByb3BlcnR5O1xuICAgICAgICAgICAgZGVsZXRlIGVtcHR5LnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuICAgICAgICAgICAgZGVsZXRlIGVtcHR5LmlzUHJvdG90eXBlT2Y7XG4gICAgICAgICAgICBkZWxldGUgZW1wdHkudG9Mb2NhbGVTdHJpbmc7XG4gICAgICAgICAgICBkZWxldGUgZW1wdHkudG9TdHJpbmc7XG4gICAgICAgICAgICBkZWxldGUgZW1wdHkudmFsdWVPZjtcbiAgICAgICAgICAgIGVtcHR5Ll9fcHJvdG9fXyA9IG51bGw7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIEVtcHR5KCkge31cbiAgICAgICAgICAgIEVtcHR5LnByb3RvdHlwZSA9IGVtcHR5O1xuICAgICAgICAgICAgLy8gc2hvcnQtY2lyY3VpdCBmdXR1cmUgY2FsbHNcbiAgICAgICAgICAgIGNyZWF0ZUVtcHR5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRW1wdHkoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gbmV3IEVtcHR5KCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgT2JqZWN0LmNyZWF0ZSA9IGZ1bmN0aW9uIGNyZWF0ZShwcm90b3R5cGUsIHByb3BlcnRpZXMpIHtcblxuICAgICAgICB2YXIgb2JqZWN0O1xuICAgICAgICBmdW5jdGlvbiBUeXBlKCkge30gIC8vIEFuIGVtcHR5IGNvbnN0cnVjdG9yLlxuXG4gICAgICAgIGlmIChwcm90b3R5cGUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIG9iamVjdCA9IGNyZWF0ZUVtcHR5KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHByb3RvdHlwZSAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgcHJvdG90eXBlICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAvLyBJbiB0aGUgbmF0aXZlIGltcGxlbWVudGF0aW9uIGBwYXJlbnRgIGNhbiBiZSBgbnVsbGBcbiAgICAgICAgICAgICAgICAvLyBPUiAqYW55KiBgaW5zdGFuY2VvZiBPYmplY3RgICAoT2JqZWN0fEZ1bmN0aW9ufEFycmF5fFJlZ0V4cHxldGMpXG4gICAgICAgICAgICAgICAgLy8gVXNlIGB0eXBlb2ZgIHRobywgYi9jIGluIG9sZCBJRSwgRE9NIGVsZW1lbnRzIGFyZSBub3QgYGluc3RhbmNlb2YgT2JqZWN0YFxuICAgICAgICAgICAgICAgIC8vIGxpa2UgdGhleSBhcmUgaW4gbW9kZXJuIGJyb3dzZXJzLiBVc2luZyBgT2JqZWN0LmNyZWF0ZWAgb24gRE9NIGVsZW1lbnRzXG4gICAgICAgICAgICAgICAgLy8gaXMuLi5lcnIuLi5wcm9iYWJseSBpbmFwcHJvcHJpYXRlLCBidXQgdGhlIG5hdGl2ZSB2ZXJzaW9uIGFsbG93cyBmb3IgaXQuXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk9iamVjdCBwcm90b3R5cGUgbWF5IG9ubHkgYmUgYW4gT2JqZWN0IG9yIG51bGxcIik7IC8vIHNhbWUgbXNnIGFzIENocm9tZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgVHlwZS5wcm90b3R5cGUgPSBwcm90b3R5cGU7XG4gICAgICAgICAgICBvYmplY3QgPSBuZXcgVHlwZSgpO1xuICAgICAgICAgICAgLy8gSUUgaGFzIG5vIGJ1aWx0LWluIGltcGxlbWVudGF0aW9uIG9mIGBPYmplY3QuZ2V0UHJvdG90eXBlT2ZgXG4gICAgICAgICAgICAvLyBuZWl0aGVyIGBfX3Byb3RvX19gLCBidXQgdGhpcyBtYW51YWxseSBzZXR0aW5nIGBfX3Byb3RvX19gIHdpbGxcbiAgICAgICAgICAgIC8vIGd1YXJhbnRlZSB0aGF0IGBPYmplY3QuZ2V0UHJvdG90eXBlT2ZgIHdpbGwgd29yayBhcyBleHBlY3RlZCB3aXRoXG4gICAgICAgICAgICAvLyBvYmplY3RzIGNyZWF0ZWQgdXNpbmcgYE9iamVjdC5jcmVhdGVgXG4gICAgICAgICAgICBvYmplY3QuX19wcm90b19fID0gcHJvdG90eXBlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByb3BlcnRpZXMgIT09IHZvaWQgMCkge1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMob2JqZWN0LCBwcm9wZXJ0aWVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfTtcbn1cblxuLy8gRVM1IDE1LjIuMy42XG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS4yLjMuNlxuXG4vLyBQYXRjaCBmb3IgV2ViS2l0IGFuZCBJRTggc3RhbmRhcmQgbW9kZVxuLy8gRGVzaWduZWQgYnkgaGF4IDxoYXguZ2l0aHViLmNvbT5cbi8vIHJlbGF0ZWQgaXNzdWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9rcmlza293YWwvZXM1LXNoaW0vaXNzdWVzI2lzc3VlLzVcbi8vIElFOCBSZWZlcmVuY2U6XG4vLyAgICAgaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L2RkMjgyOTAwLmFzcHhcbi8vICAgICBodHRwOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvZGQyMjk5MTYuYXNweFxuLy8gV2ViS2l0IEJ1Z3M6XG4vLyAgICAgaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTM2NDIzXG5cbmZ1bmN0aW9uIGRvZXNEZWZpbmVQcm9wZXJ0eVdvcmsob2JqZWN0KSB7XG4gICAgdHJ5IHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgXCJzZW50aW5lbFwiLCB7fSk7XG4gICAgICAgIHJldHVybiBcInNlbnRpbmVsXCIgaW4gb2JqZWN0O1xuICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgICAgICAvLyByZXR1cm5zIGZhbHN5XG4gICAgfVxufVxuXG4vLyBjaGVjayB3aGV0aGVyIGRlZmluZVByb3BlcnR5IHdvcmtzIGlmIGl0J3MgZ2l2ZW4uIE90aGVyd2lzZSxcbi8vIHNoaW0gcGFydGlhbGx5LlxuaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkge1xuICAgIHZhciBkZWZpbmVQcm9wZXJ0eVdvcmtzT25PYmplY3QgPSBkb2VzRGVmaW5lUHJvcGVydHlXb3JrKHt9KTtcbiAgICB2YXIgZGVmaW5lUHJvcGVydHlXb3Jrc09uRG9tID0gdHlwZW9mIGRvY3VtZW50ID09IFwidW5kZWZpbmVkXCIgfHxcbiAgICAgICAgZG9lc0RlZmluZVByb3BlcnR5V29yayhkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKTtcbiAgICBpZiAoIWRlZmluZVByb3BlcnR5V29ya3NPbk9iamVjdCB8fCAhZGVmaW5lUHJvcGVydHlXb3Jrc09uRG9tKSB7XG4gICAgICAgIHZhciBkZWZpbmVQcm9wZXJ0eUZhbGxiYWNrID0gT2JqZWN0LmRlZmluZVByb3BlcnR5LFxuICAgICAgICAgICAgZGVmaW5lUHJvcGVydGllc0ZhbGxiYWNrID0gT2JqZWN0LmRlZmluZVByb3BlcnRpZXM7XG4gICAgfVxufVxuXG5pZiAoIU9iamVjdC5kZWZpbmVQcm9wZXJ0eSB8fCBkZWZpbmVQcm9wZXJ0eUZhbGxiYWNrKSB7XG4gICAgdmFyIEVSUl9OT05fT0JKRUNUX0RFU0NSSVBUT1IgPSBcIlByb3BlcnR5IGRlc2NyaXB0aW9uIG11c3QgYmUgYW4gb2JqZWN0OiBcIjtcbiAgICB2YXIgRVJSX05PTl9PQkpFQ1RfVEFSR0VUID0gXCJPYmplY3QuZGVmaW5lUHJvcGVydHkgY2FsbGVkIG9uIG5vbi1vYmplY3Q6IFwiXG4gICAgdmFyIEVSUl9BQ0NFU1NPUlNfTk9UX1NVUFBPUlRFRCA9IFwiZ2V0dGVycyAmIHNldHRlcnMgY2FuIG5vdCBiZSBkZWZpbmVkIFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJvbiB0aGlzIGphdmFzY3JpcHQgZW5naW5lXCI7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShvYmplY3QsIHByb3BlcnR5LCBkZXNjcmlwdG9yKSB7XG4gICAgICAgIGlmICgodHlwZW9mIG9iamVjdCAhPSBcIm9iamVjdFwiICYmIHR5cGVvZiBvYmplY3QgIT0gXCJmdW5jdGlvblwiKSB8fCBvYmplY3QgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRVJSX05PTl9PQkpFQ1RfVEFSR0VUICsgb2JqZWN0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoKHR5cGVvZiBkZXNjcmlwdG9yICE9IFwib2JqZWN0XCIgJiYgdHlwZW9mIGRlc2NyaXB0b3IgIT0gXCJmdW5jdGlvblwiKSB8fCBkZXNjcmlwdG9yID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEVSUl9OT05fT0JKRUNUX0RFU0NSSVBUT1IgKyBkZXNjcmlwdG9yKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBtYWtlIGEgdmFsaWFudCBhdHRlbXB0IHRvIHVzZSB0aGUgcmVhbCBkZWZpbmVQcm9wZXJ0eVxuICAgICAgICAvLyBmb3IgSTgncyBET00gZWxlbWVudHMuXG4gICAgICAgIGlmIChkZWZpbmVQcm9wZXJ0eUZhbGxiYWNrKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJldHVybiBkZWZpbmVQcm9wZXJ0eUZhbGxiYWNrLmNhbGwoT2JqZWN0LCBvYmplY3QsIHByb3BlcnR5LCBkZXNjcmlwdG9yKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgICAgICAgICAgICAgIC8vIHRyeSB0aGUgc2hpbSBpZiB0aGUgcmVhbCBvbmUgZG9lc24ndCB3b3JrXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiBpdCdzIGEgZGF0YSBwcm9wZXJ0eS5cbiAgICAgICAgaWYgKG93bnMoZGVzY3JpcHRvciwgXCJ2YWx1ZVwiKSkge1xuICAgICAgICAgICAgLy8gZmFpbCBzaWxlbnRseSBpZiBcIndyaXRhYmxlXCIsIFwiZW51bWVyYWJsZVwiLCBvciBcImNvbmZpZ3VyYWJsZVwiXG4gICAgICAgICAgICAvLyBhcmUgcmVxdWVzdGVkIGJ1dCBub3Qgc3VwcG9ydGVkXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgLy8gYWx0ZXJuYXRlIGFwcHJvYWNoOlxuICAgICAgICAgICAgaWYgKCAvLyBjYW4ndCBpbXBsZW1lbnQgdGhlc2UgZmVhdHVyZXM7IGFsbG93IGZhbHNlIGJ1dCBub3QgdHJ1ZVxuICAgICAgICAgICAgICAgICEob3ducyhkZXNjcmlwdG9yLCBcIndyaXRhYmxlXCIpID8gZGVzY3JpcHRvci53cml0YWJsZSA6IHRydWUpIHx8XG4gICAgICAgICAgICAgICAgIShvd25zKGRlc2NyaXB0b3IsIFwiZW51bWVyYWJsZVwiKSA/IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA6IHRydWUpIHx8XG4gICAgICAgICAgICAgICAgIShvd25zKGRlc2NyaXB0b3IsIFwiY29uZmlndXJhYmxlXCIpID8gZGVzY3JpcHRvci5jb25maWd1cmFibGUgOiB0cnVlKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFxuICAgICAgICAgICAgICAgICAgICBcIlRoaXMgaW1wbGVtZW50YXRpb24gb2YgT2JqZWN0LmRlZmluZVByb3BlcnR5IGRvZXMgbm90IFwiICtcbiAgICAgICAgICAgICAgICAgICAgXCJzdXBwb3J0IGNvbmZpZ3VyYWJsZSwgZW51bWVyYWJsZSwgb3Igd3JpdGFibGUuXCJcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgaWYgKHN1cHBvcnRzQWNjZXNzb3JzICYmIChsb29rdXBHZXR0ZXIob2JqZWN0LCBwcm9wZXJ0eSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9va3VwU2V0dGVyKG9iamVjdCwgcHJvcGVydHkpKSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAvLyBBcyBhY2Nlc3NvcnMgYXJlIHN1cHBvcnRlZCBvbmx5IG9uIGVuZ2luZXMgaW1wbGVtZW50aW5nXG4gICAgICAgICAgICAgICAgLy8gYF9fcHJvdG9fX2Agd2UgY2FuIHNhZmVseSBvdmVycmlkZSBgX19wcm90b19fYCB3aGlsZSBkZWZpbmluZ1xuICAgICAgICAgICAgICAgIC8vIGEgcHJvcGVydHkgdG8gbWFrZSBzdXJlIHRoYXQgd2UgZG9uJ3QgaGl0IGFuIGluaGVyaXRlZFxuICAgICAgICAgICAgICAgIC8vIGFjY2Vzc29yLlxuICAgICAgICAgICAgICAgIHZhciBwcm90b3R5cGUgPSBvYmplY3QuX19wcm90b19fO1xuICAgICAgICAgICAgICAgIG9iamVjdC5fX3Byb3RvX18gPSBwcm90b3R5cGVPZk9iamVjdDtcbiAgICAgICAgICAgICAgICAvLyBEZWxldGluZyBhIHByb3BlcnR5IGFueXdheSBzaW5jZSBnZXR0ZXIgLyBzZXR0ZXIgbWF5IGJlXG4gICAgICAgICAgICAgICAgLy8gZGVmaW5lZCBvbiBvYmplY3QgaXRzZWxmLlxuICAgICAgICAgICAgICAgIGRlbGV0ZSBvYmplY3RbcHJvcGVydHldO1xuICAgICAgICAgICAgICAgIG9iamVjdFtwcm9wZXJ0eV0gPSBkZXNjcmlwdG9yLnZhbHVlO1xuICAgICAgICAgICAgICAgIC8vIFNldHRpbmcgb3JpZ2luYWwgYF9fcHJvdG9fX2AgYmFjayBub3cuXG4gICAgICAgICAgICAgICAgb2JqZWN0Ll9fcHJvdG9fXyA9IHByb3RvdHlwZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb2JqZWN0W3Byb3BlcnR5XSA9IGRlc2NyaXB0b3IudmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIXN1cHBvcnRzQWNjZXNzb3JzKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihFUlJfQUNDRVNTT1JTX05PVF9TVVBQT1JURUQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gSWYgd2UgZ290IHRoYXQgZmFyIHRoZW4gZ2V0dGVycyBhbmQgc2V0dGVycyBjYW4gYmUgZGVmaW5lZCAhIVxuICAgICAgICAgICAgaWYgKG93bnMoZGVzY3JpcHRvciwgXCJnZXRcIikpIHtcbiAgICAgICAgICAgICAgICBkZWZpbmVHZXR0ZXIob2JqZWN0LCBwcm9wZXJ0eSwgZGVzY3JpcHRvci5nZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG93bnMoZGVzY3JpcHRvciwgXCJzZXRcIikpIHtcbiAgICAgICAgICAgICAgICBkZWZpbmVTZXR0ZXIob2JqZWN0LCBwcm9wZXJ0eSwgZGVzY3JpcHRvci5zZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfTtcbn1cblxuLy8gRVM1IDE1LjIuMy43XG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS4yLjMuN1xuaWYgKCFPYmplY3QuZGVmaW5lUHJvcGVydGllcyB8fCBkZWZpbmVQcm9wZXJ0aWVzRmFsbGJhY2spIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMob2JqZWN0LCBwcm9wZXJ0aWVzKSB7XG4gICAgICAgIC8vIG1ha2UgYSB2YWxpYW50IGF0dGVtcHQgdG8gdXNlIHRoZSByZWFsIGRlZmluZVByb3BlcnRpZXNcbiAgICAgICAgaWYgKGRlZmluZVByb3BlcnRpZXNGYWxsYmFjaykge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVmaW5lUHJvcGVydGllc0ZhbGxiYWNrLmNhbGwoT2JqZWN0LCBvYmplY3QsIHByb3BlcnRpZXMpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgICAgICAgICAgICAgLy8gdHJ5IHRoZSBzaGltIGlmIHRoZSByZWFsIG9uZSBkb2Vzbid0IHdvcmtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIHByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgIGlmIChvd25zKHByb3BlcnRpZXMsIHByb3BlcnR5KSAmJiBwcm9wZXJ0eSAhPSBcIl9fcHJvdG9fX1wiKSB7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgcHJvcGVydHksIHByb3BlcnRpZXNbcHJvcGVydHldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH07XG59XG5cbi8vIEVTNSAxNS4yLjMuOFxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuMi4zLjhcbmlmICghT2JqZWN0LnNlYWwpIHtcbiAgICBPYmplY3Quc2VhbCA9IGZ1bmN0aW9uIHNlYWwob2JqZWN0KSB7XG4gICAgICAgIC8vIHRoaXMgaXMgbWlzbGVhZGluZyBhbmQgYnJlYWtzIGZlYXR1cmUtZGV0ZWN0aW9uLCBidXRcbiAgICAgICAgLy8gYWxsb3dzIFwic2VjdXJhYmxlXCIgY29kZSB0byBcImdyYWNlZnVsbHlcIiBkZWdyYWRlIHRvIHdvcmtpbmdcbiAgICAgICAgLy8gYnV0IGluc2VjdXJlIGNvZGUuXG4gICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfTtcbn1cblxuLy8gRVM1IDE1LjIuMy45XG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS4yLjMuOVxuaWYgKCFPYmplY3QuZnJlZXplKSB7XG4gICAgT2JqZWN0LmZyZWV6ZSA9IGZ1bmN0aW9uIGZyZWV6ZShvYmplY3QpIHtcbiAgICAgICAgLy8gdGhpcyBpcyBtaXNsZWFkaW5nIGFuZCBicmVha3MgZmVhdHVyZS1kZXRlY3Rpb24sIGJ1dFxuICAgICAgICAvLyBhbGxvd3MgXCJzZWN1cmFibGVcIiBjb2RlIHRvIFwiZ3JhY2VmdWxseVwiIGRlZ3JhZGUgdG8gd29ya2luZ1xuICAgICAgICAvLyBidXQgaW5zZWN1cmUgY29kZS5cbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9O1xufVxuXG4vLyBkZXRlY3QgYSBSaGlubyBidWcgYW5kIHBhdGNoIGl0XG50cnkge1xuICAgIE9iamVjdC5mcmVlemUoZnVuY3Rpb24gKCkge30pO1xufSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgT2JqZWN0LmZyZWV6ZSA9IChmdW5jdGlvbiBmcmVlemUoZnJlZXplT2JqZWN0KSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBmcmVlemUob2JqZWN0KSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIG9iamVjdCA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnJlZXplT2JqZWN0KG9iamVjdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSkoT2JqZWN0LmZyZWV6ZSk7XG59XG5cbi8vIEVTNSAxNS4yLjMuMTBcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjIuMy4xMFxuaWYgKCFPYmplY3QucHJldmVudEV4dGVuc2lvbnMpIHtcbiAgICBPYmplY3QucHJldmVudEV4dGVuc2lvbnMgPSBmdW5jdGlvbiBwcmV2ZW50RXh0ZW5zaW9ucyhvYmplY3QpIHtcbiAgICAgICAgLy8gdGhpcyBpcyBtaXNsZWFkaW5nIGFuZCBicmVha3MgZmVhdHVyZS1kZXRlY3Rpb24sIGJ1dFxuICAgICAgICAvLyBhbGxvd3MgXCJzZWN1cmFibGVcIiBjb2RlIHRvIFwiZ3JhY2VmdWxseVwiIGRlZ3JhZGUgdG8gd29ya2luZ1xuICAgICAgICAvLyBidXQgaW5zZWN1cmUgY29kZS5cbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9O1xufVxuXG4vLyBFUzUgMTUuMi4zLjExXG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS4yLjMuMTFcbmlmICghT2JqZWN0LmlzU2VhbGVkKSB7XG4gICAgT2JqZWN0LmlzU2VhbGVkID0gZnVuY3Rpb24gaXNTZWFsZWQob2JqZWN0KSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xufVxuXG4vLyBFUzUgMTUuMi4zLjEyXG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS4yLjMuMTJcbmlmICghT2JqZWN0LmlzRnJvemVuKSB7XG4gICAgT2JqZWN0LmlzRnJvemVuID0gZnVuY3Rpb24gaXNGcm96ZW4ob2JqZWN0KSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xufVxuXG4vLyBFUzUgMTUuMi4zLjEzXG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS4yLjMuMTNcbmlmICghT2JqZWN0LmlzRXh0ZW5zaWJsZSkge1xuICAgIE9iamVjdC5pc0V4dGVuc2libGUgPSBmdW5jdGlvbiBpc0V4dGVuc2libGUob2JqZWN0KSB7XG4gICAgICAgIC8vIDEuIElmIFR5cGUoTykgaXMgbm90IE9iamVjdCB0aHJvdyBhIFR5cGVFcnJvciBleGNlcHRpb24uXG4gICAgICAgIGlmIChPYmplY3Qob2JqZWN0KSAhPT0gb2JqZWN0KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7IC8vIFRPRE8gbWVzc2FnZVxuICAgICAgICB9XG4gICAgICAgIC8vIDIuIFJldHVybiB0aGUgQm9vbGVhbiB2YWx1ZSBvZiB0aGUgW1tFeHRlbnNpYmxlXV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgTy5cbiAgICAgICAgdmFyIG5hbWUgPSAnJztcbiAgICAgICAgd2hpbGUgKG93bnMob2JqZWN0LCBuYW1lKSkge1xuICAgICAgICAgICAgbmFtZSArPSAnPyc7XG4gICAgICAgIH1cbiAgICAgICAgb2JqZWN0W25hbWVdID0gdHJ1ZTtcbiAgICAgICAgdmFyIHJldHVyblZhbHVlID0gb3ducyhvYmplY3QsIG5hbWUpO1xuICAgICAgICBkZWxldGUgb2JqZWN0W25hbWVdO1xuICAgICAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gICAgfTtcbn1cblxufSk7XG5cbn0pKCkiLCJ2YXIgb2JqID0gcmVxdWlyZSgnLi4vb2JqZWN0JyksXG4gICAgYXBwbHkgPSBvYmouYXBwbHksXG4gICAgbWl4ID0gb2JqLm1peCxcbiAgICBvRmlsdGVyID0gb2JqLmZpbHRlcixcbiAgICBlbXB0eUZuID0gKCcuLi9mdW5jdGlvbicpLmVtcHR5Rm4sXG4gICAgaXMgPSByZXF1aXJlKCcuLi9pcycpO1xuXG4vKipcbiAqIEBjbGFzcyAgTHVjLkNvbXBvc2l0aW9uXG4gKiBAcHJvdGVjdGVkXG4gKiBjbGFzcyB0aGF0IHdyYXBzICRjb21wb3NpdGlvbiBjb25maWcgb2JqZWN0c1xuICogdG8gY29uZm9ybSB0byBhbiBhcGkuIFRoZSBjb25maWcgb2JqZWN0XG4gKiB3aWxsIG92ZXJyaWRlIGFueSBwcm90ZWN0ZWQgbWV0aG9kcyBhbmQgZGVmYXVsdCBjb25maWdzLiAgZGVmYXVsdHNcbiAqIGNhbiBiZSB1c2VkIGZvciBvZnRlbiB1c2VkIGNvbmZpZ3MsIGtleXMgdGhhdCBhcmUgbm90IGRlZmF1bHRzIHdpbGxcbiAqIG92ZXJyaWRlIHRoZSBkZWZhdWx0c1xuICpcbiAgICB2YXIgQyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICAkY29tcG9zaXRpb25zOiB7XG4gICAgICAgICAgICBkZWZhdWx0czogTHVjLmNvbXBvc2l0aW9uRW51bXMuRXZlbnRFbWl0dGVyLFxuICAgICAgICAgICAgZmlsdGVyS2V5czogWydlbWl0J11cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIGMgPSBuZXcgQygpXG4gICAgdHlwZW9mIGMuZW1pdFxuICAgID5cImZ1bmN0aW9uXCJcbiAgICB0eXBlb2YgYy5vblxuICAgID5cInVuZGVmaW5lZFwiXG4gKlxuICogSWYgeW91IHdhbnQgdG8gYWRkIHlvdXIgb3duIGNvbXBvc2l0aW9uIGFsbCB5b3UgbmVlZCB0byBoYXZlIGlzXG4gKiBhIG5hbWUgYW5kIGEgQ29uc3RydWN0b3IsIHRoZSByZXN0IG9mIHRoZSBjb25maWdzIGFuZCBMdWMuQ29tcG9zaXRpb24uY3JlYXRlXG4gKiBjYW4gYmUgdXNlZCB0byBpbmplY3QgYmVoYXZpb3IgaWYgbmVlZGVkLlxuICogXG4gICAgIGZ1bmN0aW9uIENvdW50ZXIoKSB7XG4gICAgICAgIHRoaXMuY291bnQgPSAwO1xuICAgICB9O1xuXG4gICAgIENvdW50ZXIucHJvdG90eXBlID0ge1xuICAgICAgICBnZXRDb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb3VudDtcbiAgICAgICAgfSxcbiAgICAgICAgaW5jcmVhc2VDb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLmNvdW50Kys7XG4gICAgICAgIH1cbiAgICAgfVxuXG4gICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgICAgICAkY29tcG9zaXRpb25zOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2NvdW50ZXInLFxuICAgICAgICAgICAgICAgIENvbnN0cnVjdG9yOiBDb3VudGVyLFxuICAgICAgICAgICAgICAgIGZpbHRlcktleXM6ICdhbGxNZXRob2RzJ1xuICAgICAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIGMgPSBuZXcgQygpXG5cbiAgICBjLmluY3JlYXNlQ291bnQoKTtcbiAgICBjLmluY3JlYXNlQ291bnQoKTtcbiAgICBjLmluY3JlYXNlQ291bnQoKTtcbiAgICBjLmdldENvdW50KCk7XG4gICAgPjNcbiAgICBjLmNvdW50XG4gICAgPnVuZGVmaW5lZFxuICovXG5mdW5jdGlvbiBDb21wb3NpdGlvbihjKSB7XG4gICAgdmFyIGRlZmF1bHRzID0gYy5kZWZhdWx0cyxcbiAgICAgICAgY29uZmlnID0gYztcblxuICAgIGlmKGRlZmF1bHRzKSB7XG4gICAgICAgIG1peChjb25maWcsIGNvbmZpZy5kZWZhdWx0cyk7XG4gICAgICAgIGRlbGV0ZSBjb25maWcuZGVmYXVsdHM7XG4gICAgfVxuXG4gICAgYXBwbHkodGhpcywgY29uZmlnKTtcbn1cblxuQ29tcG9zaXRpb24ucHJvdG90eXBlID0ge1xuICAgIC8qKlxuICAgICAqIEBjZmcge1N0cmluZ30gbmFtZSAocmVxdWlyZWQpIHRoZSBuYW1lXG4gICAgICovXG4gICAgXG4gICAgLyoqXG4gICAgICogQGNmZyB7T2JqZWN0fSBkZWZhdWx0c1xuICAgICAqL1xuICAgIFxuICAgIC8qKlxuICAgICAqIEBjZmcge0Jvb2xlYW59IGluaXRBZnRlciAgZGVmYXVsdHMgdG8gZmFsc2VcbiAgICAgKiBwYXNzIGluIHRydWUgdG8gaW5pdCB0aGUgY29tcG9zaXRpb24gaW5zdGFuY2UgYWZ0ZXIgdGhlIFxuICAgICAqIHN1cGVyY2xhc3MgaGFzIGJlZW4gY2FsbGVkLlxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogQGNmZyB7RnVuY3Rpb259IENvbnN0cnVjdG9yIChyZXF1aXJlZCkgdGhlIENvbnN0cnVjdG9yXG4gICAgICogdG8gdXNlIHdoZW4gY3JlYXRpbmcgdGhlIGNvbXBvc2l0aW9uIGluc3RhbmNlLiAgVGhpc1xuICAgICAqIGlzIHJlcXVpcmVkIGlmIEx1Yy5Db21wb3NpdGlvbi5jcmVhdGUgaXMgbm90IG92ZXJ3cml0dGVuIGJ5XG4gICAgICogdGhlIHBhc3NlZCBpbiBjb21wb3NpdGlvbiBjb25maWcgb2JqZWN0LlxuICAgICAqL1xuICAgIFxuICAgIC8qKlxuICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgKiBCeSBkZWZhdWx0IGp1c3QgcmV0dXJuIGEgbmV3bHkgY3JlYXRlZCBDb25zdHJ1Y3RvciBpbnN0YW5jZS5cbiAgICAgKiBcbiAgICAgKiBXaGVuIGNyZWF0ZSBpcyBjYWxsZWQgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzIGNhbiBiZSB1c2VkIDpcbiAgICAgKiBcbiAgICAgKiB0aGlzLmluc3RhbmNlIFRoZSBpbnN0YW5jZSB0aGF0IGlzIGNyZWF0aW5nXG4gICAgICogdGhlIGNvbXBvc2l0aW9uLlxuICAgICAqIFxuICAgICAqIHRoaXMuQ29uc3RydWN0b3IgdGhlIGNvbnN0cnVjdG9yIHRoYXQgaXMgcGFzc2VkIGluIGZyb21cbiAgICAgKiB0aGUgY29tcG9zaXRpb24gY29uZmlnLiBcbiAgICAgKlxuICAgICAqIHRoaXMuaW5zdGFuY2VBcmdzIHRoZSBhcmd1bWVudHMgcGFzc2VkIGludG8gdGhlIGluc3RhbmNlIHdoZW4gaXQgXG4gICAgICogaXMgYmVpbmcgY3JlYXRlZC4gIEZvciBleGFtcGxlXG5cbiAgICAgICAgbmV3IE15Q2xhc3NXaXRoQUNvbXBvc2l0aW9uKHtwbHVnaW5zOiBbXX0pXG4gICAgICAgIC8vaW5zaWRlIG9mIHRoZSBjcmVhdGUgbWV0aG9kXG4gICAgICAgIHRoaXMuaW5zdGFuY2VBcmdzXG4gICAgICAgID5be3BsdWdpbnM6IFtdfV1cblxuICAgICAqIEByZXR1cm4ge09iamVjdH0gXG4gICAgICogdGhlIGNvbXBvc2l0aW9uIGluc3RhbmNlLlxuICAgICAqXG4gICAgICogRm9yIGV4YW1wbGUgc2V0IHRoZSBlbWl0dGVycyBtYXhMaXN0ZW5lcnNcbiAgICAgKiB0byB3aGF0IHRoZSBpbnN0YW5jZSBoYXMgY29uZmlnZWQuXG4gICAgICBcbiAgICAgICAgbWF4TGlzdGVuZXJzOiAxMDAsXG4gICAgICAgICRjb21wb3NpdGlvbnM6IHtcbiAgICAgICAgICAgIENvbnN0cnVjdG9yOiBMdWMuRXZlbnRFbWl0dGVyLFxuICAgICAgICAgICAgY3JlYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgZW1pdHRlciA9IG5ldyB0aGlzLkNvbnN0cnVjdG9yKCk7XG4gICAgICAgICAgICAgICAgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnModGhpcy5pbnN0YW5jZS5tYXhMaXN0ZW5lcnMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBlbWl0dGVyO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG5hbWU6ICdlbWl0dGVyJ1xuICAgICAgICB9XG5cbiAgICAgKi9cbiAgICBjcmVhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgQ29uc3RydWN0b3IgPSB0aGlzLkNvbnN0cnVjdG9yO1xuICAgICAgICByZXR1cm4gbmV3IENvbnN0cnVjdG9yKCk7XG4gICAgfSxcblxuICAgIGdldEluc3RhbmNlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlKCk7XG4gICAgfSxcblxuICAgIHZhbGlkYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYodGhpcy5uYW1lICA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0EgbmFtZSBtdXN0IGJlIGRlZmluZWQnKTtcbiAgICAgICAgfVxuICAgICAgICBpZighaXMuaXNGdW5jdGlvbih0aGlzLkNvbnN0cnVjdG9yKSAmJiB0aGlzLmNyZWF0ZSA9PT0gQ29tcG9zaXRpb24ucHJvdG90eXBlLmNyZWF0ZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgQ29uc3RydWN0b3IgbXVzdCBiZSBmdW5jdGlvbiBpZiBjcmVhdGUgaXMgbm90IG92ZXJyaWRkZW4nKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkgZmlsdGVyRm5zXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAcHJvcGVydHkgZmlsdGVyRm5zLmFsbE1ldGhvZHMgcmV0dXJuIGFsbCBtZXRob2RzIGZyb20gdGhlXG4gICAgICogY29uc3RydWN0b3JzIHByb3RvdHlwZVxuICAgICAqIEBwcm9wZXJ0eSB7ZmlsdGVyRm5zLnB1YmxpY30gcmV0cnVybiBhbGwgbWV0aG9kcyB0aGF0IGRvbid0XG4gICAgICogc3RhcnQgd2l0aCBfLiAgV2Uga25vdyBub3QgZXZlcnlvbmUgZm9sbG93cyB0aGlzIGNvbnZlbnRpb24sIGJ1dCB3ZVxuICAgICAqIGRvIGFuZCBzbyBkbyBtYW55IG90aGVycy5cbiAgICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAgICovXG4gICAgZmlsdGVyRm5zOiB7XG4gICAgICAgIGFsbE1ldGhvZHM6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBpcy5pc0Z1bmN0aW9uKHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgcHVibGljTWV0aG9kczogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGlzLmlzRnVuY3Rpb24odmFsdWUpICYmIGtleS5jaGFyQXQoMCkgIT09ICdfJztcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAY2ZnIHtGdW5jdGlvbi9TdHJpbmcvQXJyYXlbXX0gZmlsdGVyS2V5c1xuICAgICAqIFRoZSBrZXlzIHRvIGFkZCB0byB0aGUgZGVmaW5lcnMgcHJvdG90eXBlIHRoYXQgd2lsbCBpbiB0dXJuIGNhbGxcbiAgICAgKiB0aGUgY29tcG9zaXRpb25zIG1ldGhvZC5cbiAgICAgKiBcbiAgICAgKiBEZWZhdWx0cyB0byBMdWMuZW1wdHlGbi4gXG4gICAgICogSWYgYW4gYXJyYXkgaXMgcGFzc2VkIGl0IHdpbGwganVzdCB1c2UgdGhhdCBBcnJheS5cbiAgICAgKiBcbiAgICAgKiBJZiBhIHN0cmluZyBpcyBwYXNzZWQgYW5kIG1hdGNoZXMgYSBtZXRob2QgZnJvbSBcbiAgICAgKiBMdWMuQ29tcG9zaXRpb24uZmlsdGVyRm5zIGl0IHdpbGwgY2FsbCB0aGF0IGluc3RlYWQuXG4gICAgICogXG4gICAgICogSWYgYSBmdW5jdGlvbiBpcyBkZWZpbmVkIGl0XG4gICAgICogd2lsbCBnZXQgY2FsbGVkIHdoaWxlIGl0ZXJhdGluZyBvdmVyIGVhY2gga2V5IHZhbHVlIHBhaXIgb2YgdGhlIFxuICAgICAqIENvbnN0cnVjdG9yJ3MgcHJvdG90eXBlLCBpZiBhIHRydXRoeSB2YWx1ZSBpcyBcbiAgICAgKiByZXR1cm5lZCB0aGUgcHJvcGVydHkgd2lsbCBiZSBhZGRlZCB0byB0aGUgZGVmaW5pbmdcbiAgICAgKiBjbGFzc2VzIHByb3RvdHlwZS5cbiAgICAgKiBcbiAgICAgKiBGb3IgZXhhbXBsZSB0aGlzIGNvbmZpZyB3aWxsIG9ubHkgZXhwb3NlIHRoZSBlbWl0IG1ldGhvZCBcbiAgICAgKiB0byB0aGUgZGVmaW5pbmcgY2xhc3NcbiAgICAgXG4gICAgICAgICRjb21wb3NpdGlvbnM6IHtcbiAgICAgICAgICAgIENvbnN0cnVjdG9yOiBMdWMuRXZlbnRFbWl0dGVyLFxuICAgICAgICAgICAgZmlsdGVyS2V5czogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBrZXkgPT09ICdlbWl0JztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBuYW1lOiAnZW1pdHRlcidcbiAgICAgICAgfVxuICAgICAqIHRoaXMgaXMgYWxzbyBhIHZhbGlkIGNvbmZpZ1xuICAgICAqIFxuICAgICAgICAkY29tcG9zaXRpb25zOiB7XG4gICAgICAgICAgICBDb25zdHJ1Y3RvcjogTHVjLkV2ZW50RW1pdHRlcixcbiAgICAgICAgICAgIGZpbHRlcktleXM6IFsnZW1pdHRlciddLFxuICAgICAgICAgICAgbmFtZTogJ2VtaXR0ZXInXG4gICAgICAgIH1cbiAgICAgKiBcbiAgICAgKi9cbiAgICBmaWx0ZXJLZXlzOiBlbXB0eUZuLFxuXG4gICAgZ2V0T2JqZWN0V2l0aE1ldGhvZHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5Db25zdHJ1Y3RvciAmJiB0aGlzLkNvbnN0cnVjdG9yLnByb3RvdHlwZTtcbiAgICB9LFxuXG4gICAgZ2V0TWV0aG9kc1RvQ29tcG9zZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBmaWx0ZXJLZXlzID0gdGhpcy5maWx0ZXJLZXlzLFxuICAgICAgICAgICAgcGFpcnNUb0FkZCxcbiAgICAgICAgICAgIGZpbHRlckZuO1xuXG5cbiAgICAgICAgaWYgKGlzLmlzQXJyYXkoZmlsdGVyS2V5cykpIHtcbiAgICAgICAgICAgIHBhaXJzVG9BZGQgPSBmaWx0ZXJLZXlzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZmlsdGVyRm4gPSBmaWx0ZXJLZXlzO1xuXG4gICAgICAgICAgICBpZiAoaXMuaXNTdHJpbmcoZmlsdGVyS2V5cykpIHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJGbiA9IHRoaXMuZmlsdGVyRm5zW2ZpbHRlcktleXNdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL0NvbnN0cnVjdG9ycyBhcmUgbm90IG5lZWRlZCBpZiBjcmVhdGUgaXMgb3ZlcndyaXR0ZW5cbiAgICAgICAgICAgIHBhaXJzVG9BZGQgPSBvRmlsdGVyKHRoaXMuZ2V0T2JqZWN0V2l0aE1ldGhvZHMoKSwgZmlsdGVyRm4sIHRoaXMsIHtcbiAgICAgICAgICAgICAgICBvd25Qcm9wZXJ0aWVzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBrZXlzOiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwYWlyc1RvQWRkO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ29tcG9zaXRpb247Il19
;