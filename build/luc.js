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
},{"__browserify_process":13}],4:[function(require,module,exports){
var arraySlice = Array.prototype.slice,
    compare = require('./compare'),
    createBoundCompareFn = compare.createBoundCompareFn;
    createBoundCompareNotFn = compare.createBoundCompareNotFn;

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
    var fn = createBoundCompareFn(obj, config);
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
    var fn = createBoundCompareNotFn(obj, config);
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
    var fn = createBoundCompareNotFn(obj, config);
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
    var fn = createBoundCompareFn(obj, config);
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
    var fn = createBoundCompareFn(obj, config);
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
    var fn = createBoundCompareNotFn(obj, config);
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
    var fn = createBoundCompareFn(obj, config);
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
    var fn = createBoundCompareNotFn(obj, config);
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
},{"./compare":11}],3:[function(require,module,exports){
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
},{"./is":5,"./array":4}],11:[function(require,module,exports){
var is = require('./is');

function _strict(val1, val2){
    return val1 === val2;
}

function _compareArrayLength(val1, val2) {
    return(val1 && val2  && val1.length === val2.length);
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
    return (val1 && val2 && Object.keys(val1).length === Object.keys(val2).length);
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

function createBoundCompareNotFn(object, config) {
    var fn = createBoundCompareFn(object, config);
    
    return function(val1, val2) {
        return !fn(val1, val2);
    };
}

exports.compare = compare;
exports.createBoundCompareFn = createBoundCompareFn;
exports.createBoundCompareNotFn = createBoundCompareNotFn;
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
},{"./base":7,"./composition":14,"../object":2,"../array":4,"../function":3}],10:[function(require,module,exports){
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
},{"../events/eventEmitter":6,"./pluginManager":15}],15:[function(require,module,exports){
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
},{"./plugin":9,"../is":5,"../object":2,"../array":4}],14:[function(require,module,exports){
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
},{"../object":2,"../is":5}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvbHVjLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL29iamVjdC5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9pcy5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9ldmVudHMvZXZlbnRFbWl0dGVyLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2luc2VydC1tb2R1bGUtZ2xvYmFscy9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItYnVpbHRpbnMvYnVpbHRpbi9ldmVudHMuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvYXJyYXkuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvZnVuY3Rpb24uanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvY29tcGFyZS5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9jbGFzcy9iYXNlLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2NsYXNzL3BsdWdpbi5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9jbGFzcy9kZWZpbmVyLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2NsYXNzL2NvbXBvc2l0aW9uRW51bW5zLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2NsYXNzL3BsdWdpbk1hbmFnZXIuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvY2xhc3MvY29tcG9zaXRpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5VUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDblFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsidmFyIEx1YyA9IHt9O1xuLyoqXG4gKiBAY2xhc3MgTHVjXG4gKiBBbGlhc2VzIGZvciBjb21tb24gTHVjIG1ldGhvZHMgYW5kIHBhY2thZ2VzLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IEx1YztcblxudmFyIG9iamVjdCA9IHJlcXVpcmUoJy4vb2JqZWN0Jyk7XG5MdWMuT2JqZWN0ID0gb2JqZWN0O1xuLyoqXG4gKiBAbWVtYmVyIEx1Y1xuICogQHByb3BlcnR5IE8gTHVjLk9cbiAqIEFsaWFzIGZvciBMdWMuT2JqZWN0XG4gKi9cbkx1Yy5PID0gb2JqZWN0O1xuXG5cbi8qKlxuICogQG1lbWJlciBMdWNcbiAqIEBtZXRob2QgYXBwbHlcbiAqIEBpbmhlcml0ZG9jIEx1Yy5PYmplY3QjYXBwbHlcbiAqL1xuTHVjLmFwcGx5ID0gTHVjLk9iamVjdC5hcHBseTtcblxuLyoqXG4gKiBAbWVtYmVyIEx1Y1xuICogQG1ldGhvZCBtaXhcbiAqIEBpbmhlcml0ZG9jIEx1Yy5PYmplY3QjbWl4XG4gKi9cbkx1Yy5taXggPSBMdWMuT2JqZWN0Lm1peDtcblxuXG52YXIgZnVuID0gcmVxdWlyZSgnLi9mdW5jdGlvbicpO1xuTHVjLkZ1bmN0aW9uID0gZnVuO1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjXG4gKiBAcHJvcGVydHkgRiBMdWMuRlxuICogQWxpYXMgZm9yIEx1Yy5GdW5jdGlvblxuICovXG5MdWMuRiA9IGZ1bjtcblxuLyoqXG4gKiBAbWVtYmVyIEx1Y1xuICogQG1ldGhvZCBlbXB0eUZuXG4gKiBAaW5oZXJpdGRvYyBMdWMuRnVuY3Rpb24jZW1wdHlGblxuICovXG5MdWMuZW1wdHlGbiA9IEx1Yy5GdW5jdGlvbi5lbXB0eUZuO1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjXG4gKiBAbWV0aG9kIGFic3RyYWN0Rm5cbiAqIEBpbmhlcml0ZG9jIEx1Yy5GdW5jdGlvbiNhYnN0cmFjdEZuXG4gKi9cbkx1Yy5hYnN0cmFjdEZuID0gTHVjLkZ1bmN0aW9uLmFic3RyYWN0Rm47XG5cbnZhciBhcnJheSA9IHJlcXVpcmUoJy4vYXJyYXknKTtcbkx1Yy5BcnJheSA9IGFycmF5O1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjXG4gKiBAcHJvcGVydHkgQSBMdWMuQVxuICogQWxpYXMgZm9yIEx1Yy5BcnJheVxuICovXG5MdWMuQSA9IGFycmF5O1xuXG5MdWMuYXBwbHkoTHVjLCByZXF1aXJlKCcuL2lzJykpO1xuXG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnLi9ldmVudHMvZXZlbnRFbWl0dGVyJyk7XG5cbkx1Yy5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbnZhciBCYXNlID0gcmVxdWlyZSgnLi9jbGFzcy9iYXNlJyk7XG5cbkx1Yy5CYXNlID0gQmFzZTtcblxudmFyIERlZmluZXIgPSByZXF1aXJlKCcuL2NsYXNzL2RlZmluZXInKTtcblxuTHVjLkNsYXNzRGVmaW5lciA9IERlZmluZXI7XG5cbkx1Yy5kZWZpbmUgPSBEZWZpbmVyLmRlZmluZTtcblxuTHVjLlBsdWdpbiA9IHJlcXVpcmUoJy4vY2xhc3MvcGx1Z2luJyk7XG5cbkx1Yy5hcHBseShMdWMsIHtcbiAgICBjb21wb3NpdGlvbkVudW1uczogcmVxdWlyZSgnLi9jbGFzcy9jb21wb3NpdGlvbkVudW1ucycpXG59KTtcblxuTHVjLmNvbXBhcmUgPSByZXF1aXJlKCcuL2NvbXBhcmUnKS5jb21wYXJlO1xuXG5cbmlmKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgd2luZG93Lkx1YyA9IEx1Yztcbn0iLCIvKipcbiAqIEBjbGFzcyBMdWMuT2JqZWN0XG4gKiBQYWNrYWdlIGZvciBPYmplY3QgbWV0aG9kc1xuICovXG5cbi8qKlxuICogQXBwbHkgdGhlIHByb3BlcnRpZXMgZnJvbSBmcm9tT2JqZWN0IHRvIHRoZSB0b09iamVjdC4gIGZyb21PYmplY3Qgd2lsbFxuICogb3ZlcndyaXRlIGFueSBzaGFyZWQga2V5cy4gIEl0IGNhbiBhbHNvIGJlIHVzZWQgYXMgYSBzaW1wbGUgc2hhbGxvdyBjbG9uZS5cbiAqIFxuICAgIHZhciB0byA9IHthOjEsIGM6MX0sIGZyb20gPSB7YToyLCBiOjJ9XG4gICAgTHVjLk9iamVjdC5hcHBseSh0bywgZnJvbSlcbiAgICA+T2JqZWN0IHthOiAyLCBjOiAxLCBiOiAyfVxuICAgIHRvID09PSB0b1xuICAgID50cnVlXG4gICAgdmFyIGNsb25lID0gTHVjLk9iamVjdC5hcHBseSh7fSwgZnJvbSlcbiAgICA+dW5kZWZpbmVkXG4gICAgY2xvbmVcbiAgICA+T2JqZWN0IHthOiAyLCBiOiAyfVxuICAgIGNsb25lID09PSBmcm9tXG4gICAgPmZhbHNlXG4gKlxuICogQHBhcmFtICB7T2JqZWN0fHVuZGVmaW5lZH0gdG9PYmplY3QgT2JqZWN0IHRvIHB1dCB0aGUgcHJvcGVydGllcyBmcm9tT2JqZWN0IG9uLlxuICogQHBhcmFtICB7T2JqZWN0fHVuZGVmaW5lZH0gZnJvbU9iamVjdCBPYmplY3QgdG8gcHV0IHRoZSBwcm9wZXJ0aWVzIG9uIHRoZSB0b09iamVjdFxuICogQHJldHVybiB7T2JqZWN0fSB0aGUgdG9PYmplY3RcbiAqL1xuZXhwb3J0cy5hcHBseSA9IGZ1bmN0aW9uKHRvT2JqZWN0LCBmcm9tT2JqZWN0KSB7XG4gICAgdmFyIHRvID0gdG9PYmplY3QgfHwge30sXG4gICAgICAgIGZyb20gPSBmcm9tT2JqZWN0IHx8IHt9LFxuICAgICAgICBwcm9wO1xuXG4gICAgZm9yIChwcm9wIGluIGZyb20pIHtcbiAgICAgICAgaWYgKGZyb20uaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICAgIHRvW3Byb3BdID0gZnJvbVtwcm9wXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0bztcbn07XG5cbi8qKlxuICogU2ltaWxhciB0byBMdWMuT2JqZWN0LmFwcGx5IGV4Y2VwdCB0aGF0IHRoZSBmcm9tT2JqZWN0IHdpbGwgXG4gKiBOT1Qgb3ZlcndyaXRlIHRoZSBrZXlzIG9mIHRoZSB0b09iamVjdCBpZiB0aGV5IGFyZSBkZWZpbmVkLlxuICogXG4gKiBAcGFyYW0gIHtPYmplY3R8dW5kZWZpbmVkfSB0b09iamVjdCBPYmplY3QgdG8gcHV0IHRoZSBwcm9wZXJ0aWVzIGZyb21PYmplY3Qgb24uXG4gKiBAcGFyYW0gIHtPYmplY3R8dW5kZWZpbmVkfSBmcm9tT2JqZWN0IE9iamVjdCB0byBwdXQgdGhlIHByb3BlcnRpZXMgb24gdGhlIHRvT2JqZWN0XG4gKiBAcmV0dXJuIHtPYmplY3R9IHRoZSB0b09iamVjdFxuICovXG5leHBvcnRzLm1peCA9IGZ1bmN0aW9uKHRvT2JqZWN0LCBmcm9tT2JqZWN0KSB7XG4gICAgdmFyIHRvID0gdG9PYmplY3QgfHwge30sXG4gICAgICAgIGZyb20gPSBmcm9tT2JqZWN0IHx8IHt9LFxuICAgICAgICBwcm9wO1xuXG4gICAgZm9yIChwcm9wIGluIGZyb20pIHtcbiAgICAgICAgaWYgKGZyb20uaGFzT3duUHJvcGVydHkocHJvcCkgJiYgdG9bcHJvcF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdG9bcHJvcF0gPSBmcm9tW3Byb3BdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRvO1xufTtcblxuLyoqXG4gKiBJdGVyYXRlIG92ZXIgYW4gb2JqZWN0cyBwcm9wZXJ0aWVzXG4gKiBhcyBrZXkgdmFsdWUgXCJwYWlyc1wiIHdpdGggdGhlIHBhc3NlZCBpbiBmdW5jdGlvbi5cbiAqIFxuICAgIHZhciBjb250ZXh0ID0ge3ZhbDoxfTtcbiAgICBMdWMuT2JqZWN0LmVhY2goe1xuICAgICAgICBrZXk6IDFcbiAgICB9LCBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHZhbHVlICsga2V5ICsgdGhpcy52YWwpXG4gICAgfSwgY29udGV4dClcbiAgICBcbiAgICA+MWtleTEgXG4gXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgb2JqICB0aGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3ZlclxuICogQHBhcmFtICB7RnVuY3Rpb259IGZuICAgdGhlIGZ1bmN0aW9uIHRvIGNhbGxcbiAqIEBwYXJhbSAge1N0cmluZ30gZm4ua2V5ICAgdGhlIG9iamVjdCBrZXlcbiAqIEBwYXJhbSAge09iamVjdH0gZm4udmFsdWUgICB0aGUgb2JqZWN0IHZhbHVlXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgW3RoaXNBcmddIFxuICogQHBhcmFtIHtPYmplY3R9ICBbY29uZmlnXVxuICogQHBhcmFtIHtCb29sZWFufSAgY29uZmlnLm93blByb3BlcnRpZXMgc2V0IHRvIGZhbHNlXG4gKiB0byBpdGVyYXRlIG92ZXIgYWxsIG9mIHRoZSBvYmplY3RzIGVudW1lcmFibGUgcHJvcGVydGllcy5cbiAqL1xuZXhwb3J0cy5lYWNoID0gZnVuY3Rpb24ob2JqLCBmbiwgdGhpc0FyZywgY29uZmlnKSB7XG4gICAgdmFyIGtleSwgdmFsdWUsXG4gICAgICAgIGFsbFByb3BlcnRpZXMgPSBjb25maWcgJiYgY29uZmlnLm93blByb3BlcnRpZXMgPT09IGZhbHNlO1xuXG4gICAgaWYgKGFsbFByb3BlcnRpZXMpIHtcbiAgICAgICAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgICAgICAgICBmbi5jYWxsKHRoaXNBcmcsIGtleSwgb2JqW2tleV0pO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBmbi5jYWxsKHRoaXNBcmcsIGtleSwgb2JqW2tleV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcblxuLyoqXG4gKiBUYWtlIGFuIGFycmF5IG9mIHN0cmluZ3MgYW5kIGFuIGFycmF5L2FyZ3VtZW50cyBvZlxuICogdmFsdWVzIGFuZCByZXR1cm4gYW4gb2JqZWN0IG9mIGtleSB2YWx1ZSBwYWlyc1xuICogYmFzZWQgb2ZmIGVhY2ggYXJyYXlzIGluZGV4LiAgSXQgaXMgdXNlZnVsIGZvciB0YWtpbmdcbiAqIGEgbG9uZyBsaXN0IG9mIGFyZ3VtZW50cyBhbmQgY3JlYXRpbmcgYW4gb2JqZWN0IHRoYXQgY2FuXG4gKiBiZSBwYXNzZWQgdG8gb3RoZXIgbWV0aG9kcy5cbiAqIFxuICAgIGZ1bmN0aW9uIGxvbmdBcmdzKGEsYixjLGQsZSxmKSB7XG4gICAgICAgIHJldHVybiBMdWMuT2JqZWN0LnRvT2JqZWN0KFsnYScsJ2InLCAnYycsICdkJywgJ2UnLCAnZiddLCBhcmd1bWVudHMpXG4gICAgfVxuXG4gICAgbG9uZ0FyZ3MoMSwyLDMsNCw1LDYsNyw4LDkpXG5cbiAgICA+T2JqZWN0IHthOiAxLCBiOiAyLCBjOiAzLCBkOiA0LCBlOiA14oCmfVxuICAgIGE6IDFcbiAgICBiOiAyXG4gICAgYzogM1xuICAgIGQ6IDRcbiAgICBlOiA1XG4gICAgZjogNlxuXG4gICAgbG9uZ0FyZ3MoMSwyLDMpXG5cbiAgICA+T2JqZWN0IHthOiAxLCBiOiAyLCBjOiAzLCBkOiB1bmRlZmluZWQsIGU6IHVuZGVmaW5lZOKApn1cbiAgICBhOiAxXG4gICAgYjogMlxuICAgIGM6IDNcbiAgICBkOiB1bmRlZmluZWRcbiAgICBlOiB1bmRlZmluZWRcbiAgICBmOiB1bmRlZmluZWRcblxuICogQHBhcmFtICB7U3RyaW5nW119IHN0cmluZ3NcbiAqIEBwYXJhbSAge0FycmF5L2FyZ3VtZW50c30gdmFsdWVzXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbmV4cG9ydHMudG9PYmplY3QgPSBmdW5jdGlvbihzdHJpbmdzLCB2YWx1ZXMpIHtcbiAgICB2YXIgb2JqID0ge30sXG4gICAgICAgIGkgPSAwLFxuICAgICAgICBsZW4gPSBzdHJpbmdzLmxlbmd0aDtcbiAgICBmb3IgKDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgIG9ialtzdHJpbmdzW2ldXSA9IHZhbHVlc1tpXTtcbiAgICB9XG5cbiAgICByZXR1cm4gb2JqO1xufTtcblxuLyoqXG4gKiBSZXR1cm4ga2V5IHZhbHVlIHBhaXJzIGZyb20gdGhlIG9iamVjdCBpZiB0aGVcbiAqIGZpbHRlckZuIHJldHVybnMgYSB0cnV0aHkgdmFsdWUuXG4gKlxuICAgIEx1Yy5PYmplY3QuZmlsdGVyKHtcbiAgICAgICAgYTogZmFsc2UsXG4gICAgICAgIGI6IHRydWUsXG4gICAgICAgIGM6IGZhbHNlXG4gICAgfSwgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4ga2V5ID09PSAnYScgfHwgdmFsdWVcbiAgICB9KVxuICAgID5be2tleTogJ2EnLCB2YWx1ZTogZmFsc2V9LCB7a2V5OiAnYicsIHZhbHVlOiB0cnVlfV1cbiAqIFxuICogQHBhcmFtICB7T2JqZWN0fSAgIG9iaiAgdGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXJcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmaWx0ZXJGbiAgIHRoZSBmdW5jdGlvbiB0byBjYWxsLCByZXR1cm4gYSB0cnV0aHkgdmFsdWVcbiAqIHRvIGFkZCB0aGUga2V5IHZhbHVlIHBhaXJcbiAqIEBwYXJhbSAge1N0cmluZ30gZmlsdGVyRm4ua2V5ICAgdGhlIG9iamVjdCBrZXlcbiAqIEBwYXJhbSAge09iamVjdH0gZmlsdGVyRm4udmFsdWUgICB0aGUgb2JqZWN0IHZhbHVlXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgW3RoaXNBcmddIFxuICogQHBhcmFtIHtPYmplY3R9ICBbY29uZmlnXVxuICogQHBhcmFtIHtCb29sZWFufSAgY29uZmlnLm93blByb3BlcnRpZXMgc2V0IHRvIGZhbHNlXG4gKiB0byBpdGVyYXRlIG92ZXIgYWxsIG9mIHRoZSBvYmplY3RzIGVudW1lcmFibGUgcHJvcGVydGllcy5cbiAqIFxuICogQHBhcmFtIHtCb29sZWFufSAgY29uZmlnLmtleXMgc2V0IHRvIHRydWUgdG8gcmV0dXJuXG4gKiBqdXN0IHRoZSBrZXlzLlxuICpcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gIGNvbmZpZy52YWx1ZXMgc2V0IHRvIHRydWUgdG8gcmV0dXJuXG4gKiBqdXN0IHRoZSB2YWx1ZXMuXG4gKiBcbiAqIEByZXR1cm4ge09iamVjdFtdL1N0cmluZ1tdfSBBcnJheSBvZiBrZXkgdmFsdWUgcGFpcnMgaW4gdGhlIGZvcm1cbiAqIG9mIHtrZXk6ICdrZXknLCB2YWx1ZTogdmFsdWV9LiAgSWYga2V5cyBvciB2YWx1ZXMgaXMgdHJ1ZSBvbiB0aGUgY29uZmlnXG4gKiBqdXN0IHRoZSBrZXlzIG9yIHZhbHVlcyBhcmUgcmV0dXJuLlxuICpcbiAqL1xuZXhwb3J0cy5maWx0ZXIgPSBmdW5jdGlvbihvYmosIGZpbHRlckZuLCB0aGlzQXJnLCBjb25maWcpIHtcbiAgICB2YXIgdmFsdWVzID0gW107XG5cbiAgICBleHBvcnRzLmVhY2gob2JqLCBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgIGlmIChmaWx0ZXJGbi5jYWxsKHRoaXNBcmcsIGtleSwgdmFsdWUpKSB7XG4gICAgICAgICAgICBpZiAoY29uZmlnLmtleXMgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZXMucHVzaChrZXkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb25maWcudmFsdWVzID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgdmFsdWVzLnB1c2godmFsdWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YWx1ZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAga2V5OiBrZXlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sIHRoaXNBcmcsIGNvbmZpZyk7XG5cbiAgICByZXR1cm4gdmFsdWVzO1xufTsiLCJ2YXIgb1RvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuZnVuY3Rpb24gaXNBcnJheShvYmopIHtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShvYmopO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChvYmopIHtcbiAgICByZXR1cm4gb1RvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSc7XG59XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9Ub1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG59XG5cbmZ1bmN0aW9uIGlzRGF0ZShvYmopIHtcbiAgICByZXR1cm4gb1RvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufVxuXG5mdW5jdGlvbiBpc1JlZ0V4cChvYmopIHtcbiAgICByZXR1cm4gb1RvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgUmVnRXhwXSc7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKG9iaikge1xuICAgIHJldHVybiBvVG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBOdW1iZXJdJztcbn1cblxuZnVuY3Rpb24gaXNTdHJpbmcob2JqKSB7XG4gICAgcmV0dXJuIG9Ub1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IFN0cmluZ10nO1xufVxuXG5mdW5jdGlvbiBpc0ZhbHN5KG9iaikge1xuICAgIHJldHVybiAoIW9iaiAmJiBvYmogIT09IDApO1xufVxuXG5mdW5jdGlvbiBpc0VtcHR5KG9iaikge1xuICAgIHZhciBlbXB0eSA9IGZhbHNlO1xuXG4gICAgaWYgKGlzRmFsc3kob2JqKSkge1xuICAgICAgICBlbXB0eSA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICAgICAgZW1wdHkgPSBvYmoubGVuZ3RoID09PSAwO1xuICAgIH0gZWxzZSBpZiAoaXNPYmplY3Qob2JqKSkge1xuICAgICAgICBlbXB0eSA9IE9iamVjdC5rZXlzKG9iaikubGVuZ3RoID09PSAwO1xuICAgIH1cblxuICAgIHJldHVybiBlbXB0eTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgaXNBcnJheTogaXNBcnJheSxcbiAgICBpc09iamVjdDogaXNPYmplY3QsXG4gICAgaXNGdW5jdGlvbjogaXNGdW5jdGlvbixcbiAgICBpc0RhdGU6IGlzRGF0ZSxcbiAgICBpc1N0cmluZzogaXNTdHJpbmcsXG4gICAgaXNOdW1iZXI6IGlzTnVtYmVyLFxuICAgIGlzUmVnRXhwOiBpc1JlZ0V4cCxcbiAgICBpc0ZhbHN5OiBpc0ZhbHN5LFxuICAgIGlzRW1wdHk6IGlzRW1wdHlcbn07IiwiLyoqXG4gKiBAbGljZW5zZSBodHRwczovL3Jhdy5naXRodWIuY29tL2pveWVudC9ub2RlL3YwLjEwLjExL0xJQ0VOU0VcbiAqIE5vZGUganMgbGljZW5jZS4gRXZlbnRFbWl0dGVyIHdpbGwgYmUgaW4gdGhlIGNsaWVudFxuICogb25seSBjb2RlLlxuICovXG5cbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG5cbi8qKlxuICogQGNsYXNzIEx1Yy5FdmVudEVtaXR0ZXJcbiAqIFRoZSB3b25kZXJmdWwgZXZlbnQgZW1taXRlciB0aGF0IGNvbWVzIHdpdGggbm9kZSxcbiAqIHRoYXQgd29ya3MgaW4gdGhlIHN1cHBvcnRlZCBicm93c2Vycy5cbiAqIFtodHRwOi8vbm9kZWpzLm9yZy9hcGkvZXZlbnRzLmh0bWxdKGh0dHA6Ly9ub2RlanMub3JnL2FwaS9ldmVudHMuaHRtbClcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgICAvL3B1dCBpbiBmaXggZm9yIElFIDkgYW5kIGJlbG93XG4gICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICBnID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzZWxmLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuICAgICAgICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcblxuICAgIHNlbGYub24odHlwZSwgZyk7XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyOyIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnByb2Nlc3MubmV4dFRpY2sgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYW5TZXRJbW1lZGlhdGUgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5zZXRJbW1lZGlhdGU7XG4gICAgdmFyIGNhblBvc3QgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5wb3N0TWVzc2FnZSAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lclxuICAgIDtcblxuICAgIGlmIChjYW5TZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiB3aW5kb3cuc2V0SW1tZWRpYXRlKGYpIH07XG4gICAgfVxuXG4gICAgaWYgKGNhblBvc3QpIHtcbiAgICAgICAgdmFyIHF1ZXVlID0gW107XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICBpZiAoZXYuc291cmNlID09PSB3aW5kb3cgJiYgZXYuZGF0YSA9PT0gJ3Byb2Nlc3MtdGljaycpIHtcbiAgICAgICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBpZiAocXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZm4gPSBxdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICBmbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgICAgICBxdWV1ZS5wdXNoKGZuKTtcbiAgICAgICAgICAgIHdpbmRvdy5wb3N0TWVzc2FnZSgncHJvY2Vzcy10aWNrJywgJyonKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgc2V0VGltZW91dChmbiwgMCk7XG4gICAgfTtcbn0pKCk7XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn1cblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuIiwiKGZ1bmN0aW9uKHByb2Nlc3Mpe2lmICghcHJvY2Vzcy5FdmVudEVtaXR0ZXIpIHByb2Nlc3MuRXZlbnRFbWl0dGVyID0gZnVuY3Rpb24gKCkge307XG5cbnZhciBFdmVudEVtaXR0ZXIgPSBleHBvcnRzLkV2ZW50RW1pdHRlciA9IHByb2Nlc3MuRXZlbnRFbWl0dGVyO1xudmFyIGlzQXJyYXkgPSB0eXBlb2YgQXJyYXkuaXNBcnJheSA9PT0gJ2Z1bmN0aW9uJ1xuICAgID8gQXJyYXkuaXNBcnJheVxuICAgIDogZnVuY3Rpb24gKHhzKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeHMpID09PSAnW29iamVjdCBBcnJheV0nXG4gICAgfVxuO1xuZnVuY3Rpb24gaW5kZXhPZiAoeHMsIHgpIHtcbiAgICBpZiAoeHMuaW5kZXhPZikgcmV0dXJuIHhzLmluZGV4T2YoeCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoeCA9PT0geHNbaV0pIHJldHVybiBpO1xuICAgIH1cbiAgICByZXR1cm4gLTE7XG59XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW5cbi8vIDEwIGxpc3RlbmVycyBhcmUgYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaFxuLy8gaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG4vL1xuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbnZhciBkZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCF0aGlzLl9ldmVudHMpIHRoaXMuX2V2ZW50cyA9IHt9O1xuICB0aGlzLl9ldmVudHMubWF4TGlzdGVuZXJzID0gbjtcbn07XG5cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNBcnJheSh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSlcbiAgICB7XG4gICAgICBpZiAoYXJndW1lbnRzWzFdIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgYXJndW1lbnRzWzFdOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5jYXVnaHQsIHVuc3BlY2lmaWVkICdlcnJvcicgZXZlbnQuXCIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGlmICghdGhpcy5fZXZlbnRzKSByZXR1cm4gZmFsc2U7XG4gIHZhciBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBpZiAoIWhhbmRsZXIpIHJldHVybiBmYWxzZTtcblxuICBpZiAodHlwZW9mIGhhbmRsZXIgPT0gJ2Z1bmN0aW9uJykge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuXG4gIH0gZWxzZSBpZiAoaXNBcnJheShoYW5kbGVyKSkge1xuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICAgIHZhciBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBsaXN0ZW5lcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59O1xuXG4vLyBFdmVudEVtaXR0ZXIgaXMgZGVmaW5lZCBpbiBzcmMvbm9kZV9ldmVudHMuY2Ncbi8vIEV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCgpIGlzIGFsc28gZGVmaW5lZCB0aGVyZS5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIGxpc3RlbmVyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdhZGRMaXN0ZW5lciBvbmx5IHRha2VzIGluc3RhbmNlcyBvZiBGdW5jdGlvbicpO1xuICB9XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT0gXCJuZXdMaXN0ZW5lcnNcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJzXCIuXG4gIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pIHtcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgfSBlbHNlIGlmIChpc0FycmF5KHRoaXMuX2V2ZW50c1t0eXBlXSkpIHtcblxuICAgIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gICAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgICB2YXIgbTtcbiAgICAgIGlmICh0aGlzLl9ldmVudHMubWF4TGlzdGVuZXJzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbSA9IHRoaXMuX2V2ZW50cy5tYXhMaXN0ZW5lcnM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtID0gZGVmYXVsdE1heExpc3RlbmVycztcbiAgICAgIH1cblxuICAgICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHNlbGYub24odHlwZSwgZnVuY3Rpb24gZygpIHtcbiAgICBzZWxmLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0pO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICgnZnVuY3Rpb24nICE9PSB0eXBlb2YgbGlzdGVuZXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3JlbW92ZUxpc3RlbmVyIG9ubHkgdGFrZXMgaW5zdGFuY2VzIG9mIEZ1bmN0aW9uJyk7XG4gIH1cblxuICAvLyBkb2VzIG5vdCB1c2UgbGlzdGVuZXJzKCksIHNvIG5vIHNpZGUgZWZmZWN0IG9mIGNyZWF0aW5nIF9ldmVudHNbdHlwZV1cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSkgcmV0dXJuIHRoaXM7XG5cbiAgdmFyIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzQXJyYXkobGlzdCkpIHtcbiAgICB2YXIgaSA9IGluZGV4T2YobGlzdCwgbGlzdGVuZXIpO1xuICAgIGlmIChpIDwgMCkgcmV0dXJuIHRoaXM7XG4gICAgbGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgaWYgKGxpc3QubGVuZ3RoID09IDApXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICB9IGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSA9PT0gbGlzdGVuZXIpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGRvZXMgbm90IHVzZSBsaXN0ZW5lcnMoKSwgc28gbm8gc2lkZSBlZmZlY3Qgb2YgY3JlYXRpbmcgX2V2ZW50c1t0eXBlXVxuICBpZiAodHlwZSAmJiB0aGlzLl9ldmVudHMgJiYgdGhpcy5fZXZlbnRzW3R5cGVdKSB0aGlzLl9ldmVudHNbdHlwZV0gPSBudWxsO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICBpZiAoIXRoaXMuX2V2ZW50cykgdGhpcy5fZXZlbnRzID0ge307XG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKSB0aGlzLl9ldmVudHNbdHlwZV0gPSBbXTtcbiAgaWYgKCFpc0FycmF5KHRoaXMuX2V2ZW50c1t0eXBlXSkpIHtcbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgfVxuICByZXR1cm4gdGhpcy5fZXZlbnRzW3R5cGVdO1xufTtcblxufSkocmVxdWlyZShcIl9fYnJvd3NlcmlmeV9wcm9jZXNzXCIpKSIsInZhciBhcnJheVNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLFxuICAgIGNvbXBhcmUgPSByZXF1aXJlKCcuL2NvbXBhcmUnKSxcbiAgICBjcmVhdGVCb3VuZENvbXBhcmVGbiA9IGNvbXBhcmUuY3JlYXRlQm91bmRDb21wYXJlRm47XG4gICAgY3JlYXRlQm91bmRDb21wYXJlTm90Rm4gPSBjb21wYXJlLmNyZWF0ZUJvdW5kQ29tcGFyZU5vdEZuO1xuXG4vKipcbiAqIEBjbGFzcyBMdWMuQXJyYXlcbiAqIFBhY2thZ2UgZm9yIEFycmF5IG1ldGhvZHMuXG4gKi9cblxuLyoqXG4gKiBUdXJuIHRoZSBwYXNzZWQgaW4gaXRlbSBpbnRvIGFuIGFycmF5IGlmIGl0XG4gKiBpc24ndCBvbmUgYWxyZWFkeSwgaWYgdGhlIGl0ZW0gaXMgYW4gYXJyYXkganVzdCByZXR1cm4gaXQuICBcbiAqIEl0IHJldHVybnMgYW4gZW1wdHkgYXJyYXkgaWYgaXRlbSBpcyBudWxsIG9yIHVuZGVmaW5lZC5cbiAqIElmIGl0IGlzIGp1c3QgYSBzaW5nbGUgaXRlbSByZXR1cm4gYW4gYXJyYXkgY29udGFpbmluZyB0aGUgaXRlbS5cbiAqIFxuICAgIEx1Yy5BcnJheS50b0FycmF5KClcbiAgICA+W11cbiAgICBMdWMuQXJyYXkudG9BcnJheShudWxsKVxuICAgID5bXVxuICAgIEx1Yy5BcnJheS50b0FycmF5KDEpXG4gICAgPlsxXVxuICAgIEx1Yy5BcnJheS50b0FycmF5KFsxLDJdKVxuICAgID5bMSwgMl1cbiAqXG4gKiBAcGFyYW0gIHtPYmplY3R9IGl0ZW0gaXRlbSB0byB0dXJuIGludG8gYW4gYXJyYXkuXG4gKiBAcmV0dXJuIHRoZSBhcnJheVxuICovXG5mdW5jdGlvbiB0b0FycmF5KGl0ZW0pIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShpdGVtKSkge1xuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICB9XG4gICAgcmV0dXJuIChpdGVtID09PSBudWxsIHx8IGl0ZW0gPT09IHVuZGVmaW5lZCkgPyBbXSA6IFtpdGVtXTtcbn1cblxuLyoqXG4gKiBSdW5zIGFuIGFycmF5LmZvckVhY2ggYWZ0ZXIgY2FsbGluZyBMdWMuQXJyYXkudG9BcnJheSBvbiB0aGUgaXRlbS5cbiAqIEBwYXJhbSAge09iamVjdH0gICBpdGVtXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gZm4gICAgICAgIFxuICogQHBhcmFtICB7T2JqZWN0fSAgIGNvbnRleHQgICBcbiAqL1xuZnVuY3Rpb24gZWFjaChpdGVtLCBmbiwgY29udGV4dCkge1xuICAgIHZhciBhcnIgPSB0b0FycmF5KGl0ZW0pO1xuICAgIHJldHVybiBhcnIuZm9yRWFjaC5jYWxsKGFyciwgZm4sIGNvbnRleHQpO1xufVxuXG4vKipcbiAqIEluc2VydCBvciBhcHBlbmQgdGhlIHNlY29uZCBhcnJheS9hcmd1bWVudHMgaW50byB0aGVcbiAqIGZpcnN0IGFycmF5L2FyZ3VtZW50cy4gIFRoaXMgbWV0aG9kIGRvZXMgbm90IGFsdGVyXG4gKiB0aGUgcGFzc2VkIGluIGFycmF5L2FyZ3VtZW50cy5cbiAqIFxuICogQHBhcmFtICB7QXJyYXkvYXJndW1lbnRzfSBmaXJzdEFycmF5T3JBcmdzXG4gKiBAcGFyYW0gIHtBcnJheS9hcmd1bWVudHN9IHNlY29uZEFycmF5T3JBcmdzXG4gKiBAcGFyYW0gIHtOdW1iZXIvdHJ1ZX0gaW5kZXhPckFwcGVuZCB0cnVlIHRvIGFwcGVuZCBcbiAqIHRoZSBzZWNvbmQgYXJyYXkgdG8gdGhlIGVuZCBvZiB0aGUgZmlyc3Qgb25lLiAgSWYgaXQgaXMgYSBudW1iZXJcbiAqIGluc2VydCB0aGUgc2Vjb25kQXJyYXkgaW50byB0aGUgZmlyc3Qgb25lIGF0IHRoZSBwYXNzZWQgaW4gaW5kZXguXG4gICBcbiAgICBMdWMuQXJyYXkuaW5zZXJ0KFswLDRdLCBbMSwyLDNdLCAxKTtcbiAgICA+WzAsIDEsIDIsIDMsIDRdXG4gICAgTHVjLkFycmF5Lmluc2VydChbMCw0XSwgWzEsMiwzXSwgdHJ1ZSk7XG4gICAgPlswLCA0LCAxLCAyLCAzXVxuICAgIEx1Yy5BcnJheS5pbnNlcnQoWzAsNF0sIFsxLDIsM10sIDApO1xuICAgID5bMSwgMiwgMywgMCwgNF1cbiBcbiAqIEByZXR1cm4ge0FycmF5fVxuICovXG5mdW5jdGlvbiBpbnNlcnQoZmlyc3RBcnJheU9yQXJncywgc2Vjb25kQXJyYXlPckFyZ3MsIGluZGV4T3JBcHBlbmQpIHtcbiAgICB2YXIgZmlyc3RBcnJheSA9IGFycmF5U2xpY2UuY2FsbChmaXJzdEFycmF5T3JBcmdzKSxcbiAgICAgICAgc2Vjb25kQXJyYXkgPSBhcnJheVNsaWNlLmNhbGwoc2Vjb25kQXJyYXlPckFyZ3MpLFxuICAgICAgICBzcGxpY2VBcmdzLCBcbiAgICAgICAgcmV0dXJuQXJyYXk7XG5cbiAgICBpZihpbmRleE9yQXBwZW5kID09PSB0cnVlKSB7XG4gICAgICAgIHJldHVybkFycmF5ID0gZmlyc3RBcnJheS5jb25jYXQoc2Vjb25kQXJyYXkpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgc3BsaWNlQXJncyA9IFtpbmRleE9yQXBwZW5kLCAwXS5jb25jYXQoc2Vjb25kQXJyYXkpO1xuICAgICAgICBmaXJzdEFycmF5LnNwbGljZS5hcHBseShmaXJzdEFycmF5LCBzcGxpY2VBcmdzKTtcblxuICAgICAgICByZXR1cm4gZmlyc3RBcnJheTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0dXJuQXJyYXk7XG59XG5cbi8qKlxuICogUmVtb3ZlIGFuIGl0ZW0gZnJvbSBhbiB0aGUgcGFzc2VkIGluIGFyclxuICogZnJvbSB0aGUgaW5kZXguXG4gKiBAcGFyYW0gIHtBcnJheX0gYXJyXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IGluZGV4XG4gKiBAcmV0dXJuIHtPYmplY3R9IHRoZSBpdGVtIHJlbW92ZWQuXG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUF0SW5kZXgoYXJyLCBpbmRleCkge1xuICAgIHZhciBpdGVtID0gYXJyW2luZGV4XTtcbiAgICBhcnIuc3BsaWNlKGluZGV4LCAxKTtcbiAgICByZXR1cm4gaXRlbTtcbn1cblxuZnVuY3Rpb24gX3JlbW92ZUZpcnN0KGFyciwgZm4pIHtcbiAgICB2YXIgcmVtb3ZlZCA9IGZhbHNlO1xuXG4gICAgYXJyLnNvbWUoZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XG4gICAgICAgIGlmIChmbih2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJlbW92ZWQgPSByZW1vdmVBdEluZGV4KGFyciwgaW5kZXgpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiByZW1vdmVkO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgZmlyc3QgaXRlbSBmcm9tIHRoZSBwYXNzZWQgaW4gQXJyYXlcbiAqIHRoYXQgbWF0Y2hlcyB0aGUgcGFzc2VkIGluIG9iamVjdC5cbiAqIFxuICogQHBhcmFtICB7QXJyYXl9IGFyclxuICogQHBhcmFtICB7QW55fSBvYmplY3RcbiAqIEBwYXJhbSAge09iamVjdH0gW2NvbmZpZ10gXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtjb25maWcuc2hhbGxvd10gZGVmYXVsdHMgdG8gdHJ1ZVxuICogcGFzcyBpbiBmYWxzZSB0byBkbyBhIGRpcmVjdCBlcXVhbHR5IGNvbXBhcmlzb25cbiAqIGZvciBBcnJheXMgT2JqZWN0cyBvciBEYXRlcy5cbiAqIFxuICogQHJldHVybiB7T2JqZWN0fSB0aGlzIG9iamVjdCB0aGF0IHdhcyByZW1vdmVkXG4gKiBmYWxzZSBpZiBubyBvYmplY3Qgd2FzIHJlbW92ZWQ7XG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUZpcnN0KGFyciwgb2JqLCBjb25maWcpIHtcbiAgICB2YXIgZm4gPSBjcmVhdGVCb3VuZENvbXBhcmVGbihvYmosIGNvbmZpZyk7XG4gICAgcmV0dXJuIF9yZW1vdmVGaXJzdChhcnIsIGZuKTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGZpcnN0IGl0ZW0gZnJvbSB0aGUgcGFzc2VkIGluIEFycmF5XG4gKiB0aGF0IGRvZXMgbm90IG1hdGNoIHRoZSBwYXNzZWQgaW4gb2JqZWN0LlxuICogXG4gKiBAcGFyYW0gIHtBcnJheX0gYXJyXG4gKiBAcGFyYW0gIHtBbnl9IG9iamVjdFxuICogQHBhcmFtICB7T2JqZWN0fSBbY29uZmlnXSBcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW2NvbmZpZy5zaGFsbG93XSBkZWZhdWx0cyB0byB0cnVlXG4gKiBwYXNzIGluIGZhbHNlIHRvIGRvIGEgZGlyZWN0IGVxdWFsdHkgY29tcGFyaXNvblxuICogZm9yIEFycmF5cyBPYmplY3RzIG9yIERhdGVzLlxuICogXG4gKiBAcmV0dXJuIHtPYmplY3R9IHRoaXMgb2JqZWN0IHRoYXQgd2FzIHJlbW92ZWRcbiAqIGZhbHNlIGlmIG5vIG9iamVjdCB3YXMgcmVtb3ZlZDtcbiAqL1xuZnVuY3Rpb24gcmVtb3ZlRmlyc3ROb3QoYXJyLCBvYmosIGNvbmZpZykge1xuICAgIHZhciBmbiA9IGNyZWF0ZUJvdW5kQ29tcGFyZU5vdEZuKG9iaiwgY29uZmlnKTtcbiAgICByZXR1cm4gX3JlbW92ZUZpcnN0KGFyciwgZm4pO1xufVxuXG5cbmZ1bmN0aW9uIF9yZW1vdmVBbGwoYXJyLCBmbikge1xuICAgIHZhciBpbmRleHNUb1JlbW92ZSA9IFtdLFxuICAgICAgICByZW1vdmVkID0gW107XG5cbiAgICBhcnIuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcbiAgICAgICAgaWYgKGZuKHZhbHVlKSkge1xuICAgICAgICAgICAgaW5kZXhzVG9SZW1vdmUudW5zaGlmdChpbmRleCk7XG4gICAgICAgICAgICByZW1vdmVkLnB1c2godmFsdWUpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBpbmRleHNUb1JlbW92ZS5mb3JFYWNoKGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgICAgcmVtb3ZlQXRJbmRleChhcnIsIGluZGV4KTtcbiAgICB9KTtcblxuICAgIHJldHVybiByZW1vdmVkLmxlbmd0aCA/IHJlbW92ZWQgOiBmYWxzZTtcbn1cblxuLyoqXG4gKiBTYW1lIGFwaSBhcyBMdWMuQXJyYXkucmVtb3ZlQWxsIGV4Y2VwdFxuICogcmVtb3ZlIHRoZSBpdGVtcyB0aGF0IGFyZSBub3QgZXF1YWwgdG8gdGhlIHBhc3NlZCBpblxuICogb2JqZWN0LlxuICogXG4gKiBAcGFyYW0gIHtBcnJheX0gYXJyXG4gKiBAcGFyYW0gIHtBbnl9IG9iamVjdFxuICogQHBhcmFtICB7T2JqZWN0fSBbY29uZmlnXSBCeSBkZWZhdWx0IHNoYWxsb3cgY29tcGFyZSB3aWxsXG4gKiBiZSB1c2VkIGZvciBPYmplY3RzIGFuZCBBcnJheXMgcGFzc2VkIGluIHRydWUgdG8gZG9cbiAqIGEgPT09IGNvbXBhcmlzb24uXG4gKiBcbiAqIEByZXR1cm4ge09iamVjdFtdfSAgQW4gYXJyYXkgb2YgaXRlbXMgcmVtb3ZlZFxuICogZmFsc2UgaWYgbm9uZSBhcmUgcmVtb3ZlZC5cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlQWxsTm90KGFyciwgb2JqLCBjb25maWcpIHtcbiAgICB2YXIgZm4gPSBjcmVhdGVCb3VuZENvbXBhcmVOb3RGbihvYmosIGNvbmZpZyk7XG4gICAgcmV0dXJuIF9yZW1vdmVBbGwoYXJyLCBmbik7XG59XG5cbi8qKlxuICogRmluZCB0aGUgZmlyc3QgYWxsIGl0ZW1zIHRoYXQgYXJlIGVxdWFsIHRvIHRoZVxuICogcGFzc2VkIGluIG9iamVjdC4gQnkgZGVmdWFsdCBPYmplY3RzIGFuZCBBcnJheXMgYXJlIFxuICogY29tcGFyZWQgd2l0aCBhIHNoYWxsb3cgY29tcGFyaXNvbi5cbiAqIFxuICogQHBhcmFtICB7QXJyYXl9IGFyclxuICogQHBhcmFtICB7QW55fSBvYmplY3RcbiAqIEBwYXJhbSAge09iamVjdH0gW2NvbmZpZ10gXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtjb25maWcuc2hhbGxvd10gZGVmYXVsdHMgdG8gdHJ1ZVxuICogcGFzcyBpbiBmYWxzZSB0byBkbyBhIGRpcmVjdCBlcXVhbHR5IGNvbXBhcmlzb25cbiAqIGZvciBBcnJheXMgT2JqZWN0cyBvciBEYXRlcy5cbiAqIFxuICogQHJldHVybiB7T2JqZWN0W119ICBBbiBhcnJheSBvZiBpdGVtcyByZW1vdmVkXG4gKiBmYWxzZSBpZiBub25lIGFyZSByZW1vdmVkLlxuICovXG5mdW5jdGlvbiByZW1vdmVBbGwoYXJyLCBvYmosIGNvbmZpZykge1xuICAgIHZhciBmbiA9IGNyZWF0ZUJvdW5kQ29tcGFyZUZuKG9iaiwgY29uZmlnKTtcbiAgICByZXR1cm4gX3JlbW92ZUFsbChhcnIsIGZuKTtcbn1cblxuZnVuY3Rpb24gX2ZpbmRGaXJzdChhcnIsIGZuKSB7XG4gICAgdmFyIGl0ZW0gPSBmYWxzZTtcbiAgICBhcnIuc29tZShmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcbiAgICAgICAgaWYgKGZuKHZhbHVlKSkge1xuICAgICAgICAgICAgaXRlbSA9IGFycltpbmRleF07XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGl0ZW07XG59XG5cbi8qKlxuICogUmV0dXJuIHRoZSBmaXJzdCBpdGVtIGZyb20gdGhlIHBhc3NlZCBpbiBBcnJheVxuICogdGhhdCAgbWF0Y2hlcyB0aGUgcGFzc2VkIGluIG9iamVjdC5cbiAqIFxuICogQHBhcmFtICB7QXJyYXl9IGFyclxuICogQHBhcmFtICB7QW55fSBvYmplY3RcbiAqIEBwYXJhbSAge09iamVjdH0gW2NvbmZpZ10gXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtjb25maWcuc2hhbGxvd10gZGVmYXVsdHMgdG8gdHJ1ZVxuICogcGFzcyBpbiBmYWxzZSB0byBkbyBhIGRpcmVjdCBlcXVhbHR5IGNvbXBhcmlzb25cbiAqIGZvciBBcnJheXMgT2JqZWN0cyBvciBEYXRlcy5cbiAqIFxuICogQHJldHVybiB7T2JqZWN0fSB0aGlzIG9iamVjdCB0aGF0IHdhcyByZW1vdmVkXG4gKiBmYWxzZSBpZiBubyBvYmplY3Qgd2FzIHJlbW92ZWQ7XG4gKi9cbmZ1bmN0aW9uIGZpbmRGaXJzdChhcnIsIG9iaiwgY29uZmlnKSB7XG4gICAgdmFyIGZuID0gY3JlYXRlQm91bmRDb21wYXJlRm4ob2JqLCBjb25maWcpO1xuICAgIHJldHVybiBfZmluZEZpcnN0KGFyciwgZm4pO1xufVxuXG4vKipcbiAqIFJldHVybiB0aGUgZmlyc3QgaXRlbSBmcm9tIHRoZSBwYXNzZWQgaW4gQXJyYXlcbiAqIHRoYXQgZG9lcyBub3QgbWF0Y2ggdGhlIHBhc3NlZCBpbiBvYmplY3QuXG4gKiBcbiAqIEBwYXJhbSAge0FycmF5fSBhcnJcbiAqIEBwYXJhbSAge0FueX0gb2JqZWN0XG4gKiBAcGFyYW0gIHtPYmplY3R9IFtjb25maWddIFxuICogQHBhcmFtIHtCb29sZWFufSBbY29uZmlnLnNoYWxsb3ddIGRlZmF1bHRzIHRvIHRydWVcbiAqIHBhc3MgaW4gZmFsc2UgdG8gZG8gYSBkaXJlY3QgZXF1YWx0eSBjb21wYXJpc29uXG4gKiBmb3IgQXJyYXlzIE9iamVjdHMgb3IgRGF0ZXMuXG4gKiBcbiAqIEByZXR1cm4ge09iamVjdH0gdGhpcyBvYmplY3QgdGhhdCB3YXMgcmVtb3ZlZFxuICogZmFsc2UgaWYgbm8gb2JqZWN0IHdhcyByZW1vdmVkO1xuICovXG5mdW5jdGlvbiBmaW5kRmlyc3ROb3QoYXJyLCBvYmosIGNvbmZpZykge1xuICAgIHZhciBmbiA9IGNyZWF0ZUJvdW5kQ29tcGFyZU5vdEZuKG9iaiwgY29uZmlnKTtcbiAgICByZXR1cm4gX2ZpbmRGaXJzdChhcnIsIGZuKTtcbn1cblxuZnVuY3Rpb24gX2ZpbmRBbGwoYXJyLCBmbikge1xuICAgIHZhciBmb3VuZCA9IFtdO1xuXG4gICAgYXJyLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XG4gICAgICAgIGlmIChmbih2YWx1ZSkpIHtcbiAgICAgICAgICAgIGZvdW5kLnB1c2godmFsdWUpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZm91bmQubGVuZ3RoID8gZm91bmQgOiBmYWxzZTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gYWxsIGl0ZW1zIHRoYXQgYXJlIGVxdWFsIHRvIHRoZVxuICogcGFzc2VkIGluIG9iamVjdC4gQnkgZGVmdWFsdCBPYmplY3RzIGFuZCBBcnJheXMgYXJlIFxuICogY29tcGFyZWQgd2l0aCBhIHNoYWxsb3cgY29tcGFyaXNvbi5cbiAqIFxuICogQHBhcmFtICB7QXJyYXl9IGFyclxuICogQHBhcmFtICB7QW55fSBvYmplY3RcbiAqIEBwYXJhbSAge09iamVjdH0gW2NvbmZpZ10gXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtjb25maWcuc2hhbGxvd10gZGVmYXVsdHMgdG8gdHJ1ZVxuICogcGFzcyBpbiBmYWxzZSB0byBkbyBhIGRpcmVjdCBlcXVhbHR5IGNvbXBhcmlzb25cbiAqIGZvciBBcnJheXMgT2JqZWN0cyBvciBEYXRlcy5cbiAqIFxuICogQHJldHVybiB7T2JqZWN0W119ICBBbiBhcnJheSBvZiBpdGVtcyBmb3VuZFxuICogZmFsc2UgaWYgbm9uZSBhcmUgZm91bmQuXG4gKi9cbmZ1bmN0aW9uIGZpbmRBbGwoYXJyLCBvYmosIGNvbmZpZykge1xuICAgIHZhciBmbiA9IGNyZWF0ZUJvdW5kQ29tcGFyZUZuKG9iaiwgY29uZmlnKTtcbiAgICByZXR1cm4gX2ZpbmRBbGwoYXJyLCBmbik7XG59XG5cbi8qKlxuICogUmV0dXJuIGFsbCBpdGVtcyB0aGF0IGFyZSBub3QgZXF1YWwgdG8gdGhlXG4gKiBwYXNzZWQgaW4gb2JqZWN0LiBCeSBkZWZ1YWx0IE9iamVjdHMgYW5kIEFycmF5cyBhcmUgXG4gKiBjb21wYXJlZCB3aXRoIGEgc2hhbGxvdyBjb21wYXJpc29uLlxuICogXG4gKiBAcGFyYW0gIHtBcnJheX0gYXJyXG4gKiBAcGFyYW0gIHtBbnl9IG9iamVjdFxuICogQHBhcmFtICB7T2JqZWN0fSBbY29uZmlnXSBcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW2NvbmZpZy5zaGFsbG93XSBkZWZhdWx0cyB0byB0cnVlXG4gKiBwYXNzIGluIGZhbHNlIHRvIGRvIGEgZGlyZWN0IGVxdWFsdHkgY29tcGFyaXNvblxuICogZm9yIEFycmF5cyBPYmplY3RzIG9yIERhdGVzLlxuICogXG4gKiBAcmV0dXJuIHtPYmplY3RbXX0gIEFuIGFycmF5IG9mIGl0ZW1zIGZvdW5kXG4gKiBmYWxzZSBpZiBub25lIGFyZSBmb3VuZC5cbiAqL1xuZnVuY3Rpb24gZmluZEFsbE5vdChhcnIsIG9iaiwgY29uZmlnKSB7XG4gICAgdmFyIGZuID0gY3JlYXRlQm91bmRDb21wYXJlTm90Rm4ob2JqLCBjb25maWcpO1xuICAgIHJldHVybiBfZmluZEFsbChhcnIsIGZuKTtcbn1cblxuXG5leHBvcnRzLnRvQXJyYXkgPSB0b0FycmF5O1xuZXhwb3J0cy5lYWNoID0gZWFjaDtcbmV4cG9ydHMuaW5zZXJ0ID0gaW5zZXJ0O1xuZXhwb3J0cy5yZW1vdmVBdEluZGV4ID0gcmVtb3ZlQXRJbmRleDtcbmV4cG9ydHMuZmluZEZpcnN0Tm90ID0gZmluZEZpcnN0Tm90O1xuZXhwb3J0cy5maW5kQWxsTm90ID0gZmluZEFsbE5vdDtcbmV4cG9ydHMuZmluZEZpcnN0ID0gZmluZEZpcnN0O1xuZXhwb3J0cy5maW5kQWxsID0gZmluZEFsbDtcblxuZXhwb3J0cy5yZW1vdmVGaXJzdE5vdCA9IHJlbW92ZUZpcnN0Tm90O1xuZXhwb3J0cy5yZW1vdmVBbGxOb3QgPSByZW1vdmVBbGxOb3Q7XG5leHBvcnRzLnJlbW92ZUZpcnN0ID0gcmVtb3ZlRmlyc3Q7XG5leHBvcnRzLnJlbW92ZUFsbCA9IHJlbW92ZUFsbDsiLCJ2YXIgaXMgPSByZXF1aXJlKCcuL2lzJyksXG4gICAgYUluc2VydCA9IHJlcXVpcmUoJy4vYXJyYXknKS5pbnNlcnQ7XG4gICAgYUVhY2ggPSByZXF1aXJlKCcuL2FycmF5JykuZWFjaDtcblxuLyoqXG4gKiBAY2xhc3MgTHVjLkZ1bmN0aW9uXG4gKiBQYWNrYWdlIGZvciBmdW5jdGlvbiBtZXRob2RzLlxuICovXG5cbmZ1bmN0aW9uIGF1Z21lbnRBcmdzKGNvbmZpZywgY2FsbEFyZ3MpIHtcbiAgICB2YXIgY29uZmlnQXJncyA9IGNvbmZpZy5hcmdzLFxuICAgICAgICBpbmRleCA9IGNvbmZpZy5pbmRleCxcbiAgICAgICAgYXJnc0FycmF5O1xuXG4gICAgaWYgKCFjb25maWdBcmdzKSB7XG4gICAgICAgIHJldHVybiBjYWxsQXJncztcbiAgICB9XG5cbiAgICBpZihpbmRleCA9PT0gdHJ1ZSB8fCBpcy5pc051bWJlcihpbmRleCkpIHtcbiAgICAgICAgaWYoY29uZmlnLmFyZ3VtZW50c0ZpcnN0ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuIGFJbnNlcnQoY29uZmlnQXJncywgY2FsbEFyZ3MsIGluZGV4KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYUluc2VydChjYWxsQXJncywgY29uZmlnQXJncywgaW5kZXgpO1xuICAgIH1cblxuICAgIHJldHVybiBjb25maWdBcmdzO1xufVxuXG4vKipcbiAqIEEgcmV1c2FibGUgZW1wdHkgZnVuY3Rpb25cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5leHBvcnRzLmVtcHR5Rm4gPSBmdW5jdGlvbigpIHt9O1xuXG4vKipcbiAqIEEgZnVuY3Rpb24gdGhhdCB0aHJvd3MgYW4gZXJyb3Igd2hlbiBjYWxsZWQuXG4gKiBVc2VmdWwgd2hlbiBkZWZpbmluZyBhYnN0cmFjdCBsaWtlIGNsYXNzZXNcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5leHBvcnRzLmFic3RyYWN0Rm4gPSBmdW5jdGlvbigpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2Fic3RyYWN0Rm4gbXVzdCBiZSBpbXBsZW1lbnRlZCcpO1xufTtcblxuLyoqXG4gKiBBZ3VtZW50IHRoZSBwYXNzZWQgaW4gZnVuY3Rpb24ncyB0aGlzQXJnIGFuZCBvciBhZ3VtZW50cyBvYmplY3QgXG4gKiBiYXNlZCBvbiB0aGUgcGFzc2VkIGluIGNvbmZpZy5cbiAqIFxuICogQHBhcmFtICB7RnVuY3Rpb259IGZuIHRoZSBmdW5jdGlvbiB0byBjYWxsXG4gKiBAcGFyYW0gIHtPYmplY3R9IGNvbmZpZ1xuICogXG4gKiBAcGFyYW0ge09iamVjdH0gW2NvbmZpZy50aGlzQXJnXSB0aGUgdGhpc0FyZyBmb3IgdGhlIGZ1bmNpdG9uIGJlaW5nIGV4ZWN1dGVkLlxuICogSWYgdGhpcyBpcyB0aGUgb25seSBwcm9wZXJ0eSBvbiB5b3VyIGNvbmZpZyBvYmplY3QgdGhlIHByZWZlcmVkIHdheSB3b3VsZFxuICogYmUganVzdCB0byB1c2UgRnVuY3Rpb24uYmluZFxuICogXG4gKiBAcGFyYW0ge0FycmF5fSBbY29uZmlnLmFyZ3NdIHRoZSBhcmd1bWVudHMgdXNlZCBmb3IgdGhlIGZ1bmN0aW9uIGJlaW5nIGV4ZWN1dGVkLlxuICogVGhpcyB3aWxsIHJlcGxhY2UgdGhlIGZ1bmN0aW9ucyBjYWxsIGFyZ3MgaWYgaW5kZXggaXMgbm90IGEgbnVtYmVyIG9yIFxuICogdHJ1ZS5cbiAqIFxuICogQHBhcmFtIHtOdW1iZXIvVHJ1ZX0gW2NvbmZpZy5pbmRleF0gQnkgZGVmdWFsdCB0aGUgdGhlIGNvbmZpZ3VyZWQgYXJndW1lbnRzXG4gKiB3aWxsIGJlIGluc2VydGVkIGludG8gdGhlIGZ1bmN0aW9ucyBwYXNzZWQgaW4gY2FsbCBhcmd1bWVudHMuICBJZiBpbmRleCBpcyB0cnVlXG4gKiBhcHBlbmQgdGhlIGFyZ3MgdG9nZXRoZXIgaWYgaXQgaXMgYSBudW1iZXIgaW5zZXJ0IGl0IGF0IHRoZSBwYXNzZWQgaW4gaW5kZXguXG4gKiBcbiAqIEBwYXJhbSB7QXJyYXl9IFtjb25maWcuYXJndW1lbnRzRmlyc3RdIHBhc3MgaW4gZmFsc2UgdG8gXG4gKiBhZ3VtZW50IHRoZSBjb25maWd1cmVkIGFyZ3MgZmlyc3Qgd2l0aCBMdWMuQXJyYXkuaW5zZXJ0LiAgRGVmYXVsdHNcbiAqIHRvIHRydWVcbiAgICAgXG4gICAgIGZ1bmN0aW9uIGZuKCkge1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzKVxuICAgICAgICBjb25zb2xlLmxvZyhhcmd1bWVudHMpXG4gICAgfVxuXG4gICAgTHVjLkZ1bmN0aW9uLmNyZWF0ZUF1Z21lbnRvcihmbiwge1xuICAgICAgICB0aGlzQXJnOiB7Y29uZmlnZWRUaGlzQXJnOiB0cnVlfSxcbiAgICAgICAgYXJnczogWzEsMiwzXSxcbiAgICAgICAgaW5kZXg6MFxuICAgIH0pKDQpXG5cbiAgICA+T2JqZWN0IHtjb25maWdlZFRoaXNBcmc6IHRydWV9XG4gICAgPlsxLCAyLCAzLCA0XVxuXG4gICAgTHVjLkZ1bmN0aW9uLmNyZWF0ZUF1Z21lbnRvcihmbiwge1xuICAgICAgICB0aGlzQXJnOiB7Y29uZmlnZWRUaGlzQXJnOiB0cnVlfSxcbiAgICAgICAgYXJnczogWzEsMiwzXSxcbiAgICAgICAgaW5kZXg6MCxcbiAgICAgICAgYXJndW1lbnRzRmlyc3Q6ZmFsc2VcbiAgICB9KSg0KVxuXG4gICAgPk9iamVjdCB7Y29uZmlnZWRUaGlzQXJnOiB0cnVlfVxuICAgID5bNCwgMSwgMiwgM11cblxuXG4gICAgdmFyIGYgPSBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudG9yKGZuLCB7XG4gICAgICAgIGFyZ3M6IFsxLDIsM10sXG4gICAgICAgIGluZGV4OiB0cnVlXG4gICAgfSk7XG5cbiAgICBmLmFwcGx5KHtjb25maWc6IGZhbHNlfSwgWzRdKVxuXG4gICAgPk9iamVjdCB7Y29uZmlnOiBmYWxzZX1cbiAgICA+WzQsIDEsIDIsIDNdXG5cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSB0aGUgYXVnbWVudGVkIGZ1bmN0aW9uLlxuICovXG5leHBvcnRzLmNyZWF0ZUF1Z21lbnRvciA9IGZ1bmN0aW9uKGZuLCBjb25maWcpIHtcbiAgICB2YXIgdGhpc0FyZyA9IGNvbmZpZy50aGlzQXJnO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpc0FyZyB8fCB0aGlzLCBhdWdtZW50QXJncyhjb25maWcsIGFyZ3VtZW50cykpO1xuICAgIH07XG59O1xuXG5mdW5jdGlvbiBpbml0U2VxdWVuY2VGdW5jdGlvbnMoZm5zLCBjb25maWcpIHtcbiAgICB2YXIgdG9SdW4gPSBbXTtcbiAgICBhRWFjaChmbnMsIGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgdmFyIGZuID0gZjtcblxuICAgICAgICBpZiAoY29uZmlnKSB7XG4gICAgICAgICAgICBmbiA9IGV4cG9ydHMuY3JlYXRlQXVnbWVudG9yKGYsIGNvbmZpZyk7XG4gICAgICAgIH1cblxuICAgICAgICB0b1J1bi5wdXNoKGZuKTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0b1J1bjtcbn1cblxuLyoqXG4gKiBSZXR1cm4gYSBmdW5jdGlvbiB0aGF0IHJ1bnMgdGhlIHBhc3NlZCBpbiBmdW5jdGlvbnNcbiAqIGFuZCByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIGxhc3QgZnVuY3Rpb24gY2FsbGVkLlxuICogXG4gKiBAcGFyYW0gIHtGdW5jdGlvbi9GdW5jdGlvbltdfSBmbnMgXG4gKiBAcGFyYW0gIHtPYmplY3R9IFtjb25maWddIENvbmZpZyBvYmplY3RcbiAqIGZvciBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudG9yLiAgSWYgZGVmaW5lZCBhbGwgb2YgdGhlIGZ1bmN0aW9uc1xuICogd2lsbCBnZXQgY3JlYXRlZCB3aXRoIHRoZSBwYXNzZWQgaW4gY29uZmlnO1xuICpcbiAgICBMdWMuRnVuY3Rpb24uY3JlYXRlU2VxdWVuY2UoW1xuICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKDEpXG4gICAgICAgIH0sXG4gICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coMilcbiAgICAgICAgfSxcbiAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygzKVxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2ZpbmlzaGVkIGxvZ2dpbmcnKVxuICAgICAgICAgICAgcmV0dXJuIDQ7XG4gICAgICAgIH1cbiAgICBdKSgpXG4gICAgPjFcbiAgICA+MlxuICAgID4zXG4gICAgPmZpbmlzaGVkIGxvZ2dpbmdcbiAgICA+NFxuICogXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZXhwb3J0cy5jcmVhdGVTZXF1ZW5jZSA9IGZ1bmN0aW9uKGZucywgY29uZmlnKSB7XG4gICAgdmFyIGZ1bmN0aW9ucyA9IGluaXRTZXF1ZW5jZUZ1bmN0aW9ucyhmbnMsIGNvbmZpZyk7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpID0gMCxcbiAgICAgICAgICAgIGxlbiA9IGZ1bmN0aW9ucy5sZW5ndGg7XG5cbiAgICAgICAgZm9yKDtpIDwgbGVuIC0xOyArK2kpIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uc1tpXS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uc1tsZW4gLTEgXS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG59O1xuXG4vKipcbiAqIFJldHVybiBhIGZ1bmN0aW9uIHRoYXQgcnVucyB0aGUgcGFzc2VkIGluIGZ1bmN0aW9uc1xuICogaWYgb25lIG9mIHRoZSBmdW5jdGlvbnMgcmVzdWx0cyBmYWxzZSB0aGUgcmVzdCBvZiB0aGUgXG4gKiBmdW5jdGlvbnMgd29uJ3QgcnVuIGFuZCBmYWxzZSB3aWxsIGJlIHJldHVybmVkLlxuICpcbiAqIElmIG5vIGZhbHNlIGlzIHJldHVybmVkIHRoZSB2YWx1ZSBvZiB0aGUgbGFzdCBmdW5jdGlvbiByZXR1cm4gd2lsbCBiZSByZXR1cm5lZFxuICogXG4gKiBAcGFyYW0gIHtGdW5jdGlvbi9GdW5jdGlvbltdfSBmbnMgXG4gKiBAcGFyYW0gIHtPYmplY3R9IFtjb25maWddIENvbmZpZyBvYmplY3RcbiAqIGZvciBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudG9yLiAgSWYgZGVmaW5lZCBhbGwgb2YgdGhlIGZ1bmN0aW9uc1xuICogd2lsbCBnZXQgY3JlYXRlZCB3aXRoIHRoZSBwYXNzZWQgaW4gY29uZmlnO1xuXG4gICAgTHVjLkZ1bmN0aW9uLmNyZWF0ZVNlcXVlbmNlSWYoW1xuICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKDEpXG4gICAgICAgIH0sXG4gICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coMilcbiAgICAgICAgfSxcbiAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygzKVxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2ZpbmlzaGVkIGxvZ2dpbmcnKVxuICAgICAgICAgICAgcmV0dXJuIDQ7XG4gICAgICAgIH0sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpIGNhbnQgbG9nJylcbiAgICAgICAgfVxuICAgIF0pKClcblxuICAgID4xXG4gICAgPjJcbiAgICA+M1xuICAgID5maW5pc2hlZCBsb2dnaW5nXG4gICAgPmZhbHNlXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZXhwb3J0cy5jcmVhdGVTZXF1ZW5jZUlmID0gZnVuY3Rpb24oZm5zLCBjb25maWcpIHtcbiAgICB2YXIgZnVuY3Rpb25zID0gaW5pdFNlcXVlbmNlRnVuY3Rpb25zKGZucywgY29uZmlnKTtcblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHZhbHVlLFxuICAgICAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcblxuICAgICAgICBmdW5jdGlvbnMuc29tZShmdW5jdGlvbihmbil7XG4gICAgICAgICAgICB2YWx1ZSA9IGZuLmFwcGx5KHRoaXMsIGFyZ3MpO1xuXG4gICAgICAgICAgICByZXR1cm4gdmFsdWUgPT09IGZhbHNlO1xuICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcbn07XG5cbi8qKlxuICogUmV0dXJuIGEgZnVuY3Rpb25zIHRoYXQgcnVucyB0aGUgcGFzc2VkIGluIGZ1bmN0aW9uc1xuICogdGhlIHJlc3VsdCBvZiBlYWNoIGZ1bmN0aW9uIHdpbGwgYmUgdGhlIHRoZSBjYWxsIGFyZ3MgXG4gKiBmb3IgdGhlIG5leHQgZnVuY3Rpb24uICBUaGUgdmFsdWUgb2YgdGhlIGxhc3QgZnVuY3Rpb24gXG4gKiByZXR1cm4gd2lsbCBiZSByZXR1cm5lZC5cbiAqIFxuICogQHBhcmFtICB7RnVuY3Rpb24vRnVuY3Rpb25bXX0gZm5zIFxuICogQHBhcmFtICB7T2JqZWN0fSBbY29uZmlnXSBDb25maWcgb2JqZWN0XG4gKiBmb3IgTHVjLkZ1bmN0aW9uLmNyZWF0ZUF1Z21lbnRvci4gIElmIGRlZmluZWQgYWxsIG9mIHRoZSBmdW5jdGlvbnNcbiAqIHdpbGwgZ2V0IGNyZWF0ZWQgd2l0aCB0aGUgcGFzc2VkIGluIGNvbmZpZztcbiAgICAgXG4gICAgIEx1Yy5GdW5jdGlvbi5jcmVhdGVSZWxheWVyKFtcbiAgICAgICAgZnVuY3Rpb24oc3RyKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RyICsgJ2InXG4gICAgICAgIH0sXG4gICAgICAgIGZ1bmN0aW9uKHN0cikge1xuICAgICAgICAgICAgcmV0dXJuIHN0ciArICdjJ1xuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbihzdHIpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHIgKyAnZCdcbiAgICAgICAgfVxuICAgIF0pKCdhJylcblxuICAgID5cImFiY2RcIlxuXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZXhwb3J0cy5jcmVhdGVSZWxheWVyID0gZnVuY3Rpb24oZm5zLCBjb25maWcpIHtcbiAgICB2YXIgZnVuY3Rpb25zID0gaW5pdFNlcXVlbmNlRnVuY3Rpb25zKGZucywgY29uZmlnKTtcblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHZhbHVlLFxuICAgICAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcblxuICAgICAgICBmdW5jdGlvbnMuZm9yRWFjaChmdW5jdGlvbihmbiwgaW5kZXgpIHtcbiAgICAgICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gZm4uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gZm4uYXBwbHkodGhpcywgW3ZhbHVlXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9O1xufTtcblxuLyoqXG4gKiBDcmVhdGUgYSB0aHJvdHRsZWQgZnVuY3Rpb24gdGhhdCB0aGUgcGFzc2VkIGluIGZ1bmNpdG9uXG4gKiBvbmx5IGdldHMgZXZva2VkIG9uY2UgZXZlbiBpdCBpcyBjYWxsZWQgbWFueSB0aW1lc1xuICpcbiAqIFxuICogQHBhcmFtICB7RnVuY3Rpb259IGZuXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IFttaWxsaXNdIE51bWJlciBvZiBtaWxsaXNlY29uZHMgdG9cbiAqIHRocm90dGxlIHRoZSBmdW5jdGlvbi5cbiAqIEBwYXJhbSAge09iamVjdH0gW2NvbmZpZ10gQ29uZmlnIG9iamVjdFxuICogZm9yIEx1Yy5GdW5jdGlvbi5jcmVhdGVBdWdtZW50b3IuICBJZiBkZWZpbmVkIGFsbCBvZiB0aGUgZnVuY3Rpb25zXG4gKiB3aWxsIGdldCBjcmVhdGVkIHdpdGggdGhlIHBhc3NlZCBpbiBjb25maWc7XG4gKiBcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5leHBvcnRzLmNyZWF0ZVRocm90dGVsZWQgPSBmdW5jdGlvbihmLCBtaWxsaXMsIGNvbmZpZykge1xuICAgIHZhciBmbiA9IGNvbmZpZyA/IGV4cG9ydHMuY3JlYXRlQXVnbWVudG9yKGYsIGNvbmZpZykgOiBmLFxuICAgICAgICB0aW1lT3V0SWQgPSBmYWxzZTtcblxuICAgIGlmKCFtaWxsaXMpIHtcbiAgICAgICAgcmV0dXJuIGZuO1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG5cbiAgICAgICAgaWYodGltZU91dElkKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZU91dElkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRpbWVPdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aW1lT3V0SWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICB9LCBtaWxsaXMpO1xuICAgIH07XG59O1xuXG4vKipcbiAqIERlZmVyIGEgZnVuY3Rpb24ncyBleGVjdXRpb24gZm9yIHRoZSBwYXNzZWQgaW5cbiAqIG1pbGxpc2Vjb25kcy5cbiAqIFxuICogQHBhcmFtICB7RnVuY3Rpb259IGZuXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IFttaWxsaXNdIE51bWJlciBvZiBtaWxsaXNlY29uZHMgdG9cbiAqIGRlZmVyXG4gKiBAcGFyYW0gIHtPYmplY3R9IFtjb25maWddIENvbmZpZyBvYmplY3RcbiAqIGZvciBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudG9yLiAgSWYgZGVmaW5lZCBhbGwgb2YgdGhlIGZ1bmN0aW9uc1xuICogd2lsbCBnZXQgY3JlYXRlZCB3aXRoIHRoZSBwYXNzZWQgaW4gY29uZmlnO1xuICogXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZXhwb3J0cy5jcmVhdGVEZWZlcnJlZCA9IGZ1bmN0aW9uKGYsIG1pbGxpcywgY29uZmlnKSB7XG4gICAgdmFyIGZuID0gY29uZmlnID8gZXhwb3J0cy5jcmVhdGVBdWdtZW50b3IoZiwgY29uZmlnKSA6IGY7XG5cbiAgICBpZighbWlsbGlzKSB7XG4gICAgICAgIHJldHVybiBmbjtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBmbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgfSwgbWlsbGlzKTtcbiAgICB9O1xufTsiLCJ2YXIgaXMgPSByZXF1aXJlKCcuL2lzJyk7XG5cbmZ1bmN0aW9uIF9zdHJpY3QodmFsMSwgdmFsMil7XG4gICAgcmV0dXJuIHZhbDEgPT09IHZhbDI7XG59XG5cbmZ1bmN0aW9uIF9jb21wYXJlQXJyYXlMZW5ndGgodmFsMSwgdmFsMikge1xuICAgIHJldHVybih2YWwxICYmIHZhbDIgICYmIHZhbDEubGVuZ3RoID09PSB2YWwyLmxlbmd0aCk7XG59XG5cbmZ1bmN0aW9uIF9zaGFsbG93QXJyYXkodmFsMSwgdmFsMikge1xuICAgIHZhciBpID0gMCxcbiAgICAgICAgbGVuO1xuICAgIFxuICAgIGlmKCFfY29tcGFyZUFycmF5TGVuZ3RoKHZhbDEsIHZhbDIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IobGVuID0gdmFsMS5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgICBpZih2YWwxW2ldICE9PSB2YWwyW2ldKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gX2RlZXBBcnJheSh2YWwxLCB2YWwyKSB7XG4gICAgdmFyIGkgPSAwLFxuICAgICAgICBsZW47XG4gICAgXG4gICAgaWYoIV9jb21wYXJlQXJyYXlMZW5ndGgodmFsMSwgdmFsMikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGZvcihsZW4gPSB2YWwxLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgIGlmKCFjb21wYXJlKHZhbDFbaV0sdmFsMltpXSwge3R5cGU6ICdkZWVwJ30pKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gX2NvbXBhcmVPYmplY3RLZXlzTGVuZ3RoKHZhbDEsIHZhbDIpIHtcbiAgICByZXR1cm4gKHZhbDEgJiYgdmFsMiAmJiBPYmplY3Qua2V5cyh2YWwxKS5sZW5ndGggPT09IE9iamVjdC5rZXlzKHZhbDIpLmxlbmd0aCk7XG59XG5cbmZ1bmN0aW9uIF9zaGFsbG93T2JqZWN0KHZhbDEsIHZhbDIpIHtcbiAgICB2YXIga2V5LCB2YWw7XG5cbiAgICBpZiAoIV9jb21wYXJlT2JqZWN0S2V5c0xlbmd0aCh2YWwxLCB2YWwyKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZm9yIChrZXkgaW4gdmFsMSkge1xuICAgICAgICBpZiAodmFsMS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbDFba2V5XTtcbiAgICAgICAgICAgIGlmICghdmFsMi5oYXNPd25Qcm9wZXJ0eShrZXkpIHx8IHZhbDJba2V5XSAhPT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gX2RlZXBPYmplY3QodmFsMSwgdmFsMikge1xuICAgIHZhciBrZXksIHZhbDtcblxuICAgIGlmICghX2NvbXBhcmVPYmplY3RLZXlzTGVuZ3RoKHZhbDEsIHZhbDIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IgKGtleSBpbiB2YWwxKSB7XG4gICAgICAgIGlmICh2YWwxLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsMVtrZXldO1xuICAgICAgICAgICAgaWYgKCF2YWwyLmhhc093blByb3BlcnR5KGtleSkgfHwgY29tcGFyZSh2YWx1ZSwgdmFsMltrZXldLCB7dHlwZTogJ2RlZXAnfSkgIT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcblxufVxuXG5mdW5jdGlvbiBfZGF0ZSh2YWwxLCB2YWwyKSB7XG4gICAgaWYoaXMuaXNEYXRlKHZhbDEpICYmIGlzLmlzRGF0ZSh2YWwyKSkge1xuICAgICAgICByZXR1cm4gdmFsMS5nZXRUaW1lKCkgPT09IHZhbDIuZ2V0VGltZSgpO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gX2NyZWF0ZUJvdW5kQ29tcGFyZShvYmplY3QsIGZuKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBmbihvYmplY3QsIHZhbHVlKTtcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBnZXRDb21wYXJlRm4ob2JqZWN0LCBjKSB7XG4gICAgdmFyIGNvbXBhcmVGbiA9IF9zdHJpY3QsXG4gICAgICAgIGNvbmZpZyA9IGMgfHwge307XG5cbiAgICBpZiAoY29uZmlnLnR5cGUgPT09ICdzaGFsbG93JyB8fCBjb25maWcudHlwZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChpcy5pc09iamVjdChvYmplY3QpKSB7XG4gICAgICAgICAgICBjb21wYXJlRm4gPSBfc2hhbGxvd09iamVjdDtcbiAgICAgICAgfSBlbHNlIGlmIChpcy5pc0FycmF5KG9iamVjdCkpIHtcbiAgICAgICAgICAgIGNvbXBhcmVGbiA9IF9zaGFsbG93QXJyYXk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXMuaXNEYXRlKG9iamVjdCkpIHtcbiAgICAgICAgICAgIGNvbXBhcmVGbiA9IF9kYXRlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYoY29uZmlnLnR5cGUgPT09ICdkZWVwJykge1xuICAgICAgICBpZiAoaXMuaXNPYmplY3Qob2JqZWN0KSkge1xuICAgICAgICAgICAgY29tcGFyZUZuID0gX2RlZXBPYmplY3Q7XG4gICAgICAgIH0gZWxzZSBpZiAoaXMuaXNBcnJheShvYmplY3QpKSB7XG4gICAgICAgICAgICBjb21wYXJlRm4gPSBfZGVlcEFycmF5O1xuICAgICAgICB9IGVsc2UgaWYgKGlzLmlzRGF0ZShvYmplY3QpKSB7XG4gICAgICAgICAgICBjb21wYXJlRm4gPSBfZGF0ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmKGNvbmZpZy50eXBlICE9PSAnc3RyaWN0Jykge1xuICAgICAgICAvL3dlIHdvdWxkIGJlIGRvaW5nIGEgc3RyaWN0IGNvbXBhcmlzb24gb24gYSB0eXBlLW9cbiAgICAgICAgLy9JIHRoaW5rIGFuIGVycm9yIGlzIGdvb2QgaGVyZS5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgcGFzc2VkIGluIGFuIGludmFsaWQgY29tcGFyaXNvbiB0eXBlJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbXBhcmVGbjtcbn1cblxuLyoqXG4gKiBAbWVtYmVyIEx1Y1xuICogQG1ldGhvZCBjb21wYXJlXG4gKiBcbiAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZXMgYXJlIGVxdWFsIHRvIGVhY2hcbiAqIG90aGVyLiAgQnkgZGVmYXVsdCBhIHNoYWxsb3cgY29tcGFyaXNvbiBpcyBcbiAqIGRvbmUgb24gYXJyYXlzLCBkYXRlcyBhbmQgb2JqZWN0cyBhbmQgYSBzdHJpY3QgY29tcGFyaXNvblxuICogaXMgZG9uZSBvbiBvdGhlciB0eXBlcy5cbiAqIFxuICogQHBhcmFtICB7QW55fSB2YWwxICBcbiAqIEBwYXJhbSAge0FueX0gdmFsMiAgIFxuICogQHBhcmFtICB7T2JqZWN0fSBbY29uZmlnXVxuICogQHBhcmFtIHtTdHJpbmd9IGNvbmZpZy50eXBlIHBhc3MgaW4gJ2RlZXAnIGZvciBhIGRlZXBcbiAqIGNvbXBhcmlzb24sICdzaGFsbG93JyAoZGVmYXVsdCkgZm9yIGEgc2hhbGxvdyBjb21wYXJpc29uXG4gKiBvciAnc3RyaWN0JyBmb3IgYSBzdHJpY3QgPT09IGNvbXBhcmlzb24gZm9yIGFsbCBvYmplY3RzLlxuICpcbiAqIFxuICAgIEx1Yy5jb21wYXJlKHthOiAxfSwge2E6IDF9KVxuICAgID50cnVlXG4gICAgTHVjLmNvbXBhcmUoe2E6IDEsIGI6IHt9fSwge2E6IDEsIGI6IHt9IH0pXG4gICAgPmZhbHNlXG4gICAgTHVjLmNvbXBhcmUoe2E6IDEsIGI6IHt9fSwge2E6IDEsIGI6IHt9IH0sIHt0eXBlOiAnZGVlcCd9KVxuICAgID50cnVlXG4gICAgTHVjLmNvbXBhcmUoe2E6IDEsIGI6IHt9fSwge2E6IDEsIGI6IHt9IH0sIHt0eXBlOiAnc3RyaWN0J30pXG4gICAgPmZhbHNlXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5mdW5jdGlvbiBjb21wYXJlKHZhbDEsIHZhbDIsIGNvbmZpZykge1xuICAgIHJldHVybiBnZXRDb21wYXJlRm4odmFsMSwgY29uZmlnKSh2YWwxLCB2YWwyKTtcbn1cblxuXG5mdW5jdGlvbiBjcmVhdGVCb3VuZENvbXBhcmVGbihvYmplY3QsIGMpIHtcbiAgICB2YXIgY29tcGFyZUZuID0gZ2V0Q29tcGFyZUZuKG9iamVjdCwgYyk7XG5cbiAgICByZXR1cm4gX2NyZWF0ZUJvdW5kQ29tcGFyZShvYmplY3QsIGNvbXBhcmVGbik7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUJvdW5kQ29tcGFyZU5vdEZuKG9iamVjdCwgY29uZmlnKSB7XG4gICAgdmFyIGZuID0gY3JlYXRlQm91bmRDb21wYXJlRm4ob2JqZWN0LCBjb25maWcpO1xuICAgIFxuICAgIHJldHVybiBmdW5jdGlvbih2YWwxLCB2YWwyKSB7XG4gICAgICAgIHJldHVybiAhZm4odmFsMSwgdmFsMik7XG4gICAgfTtcbn1cblxuZXhwb3J0cy5jb21wYXJlID0gY29tcGFyZTtcbmV4cG9ydHMuY3JlYXRlQm91bmRDb21wYXJlRm4gPSBjcmVhdGVCb3VuZENvbXBhcmVGbjtcbmV4cG9ydHMuY3JlYXRlQm91bmRDb21wYXJlTm90Rm4gPSBjcmVhdGVCb3VuZENvbXBhcmVOb3RGbjsiLCJ2YXIgZW1wdHlGbiA9IHJlcXVpcmUoJy4uL2Z1bmN0aW9uJykuZW1wdHlGbixcbiAgICBhcHBseSA9IHJlcXVpcmUoJy4uL29iamVjdCcpLmFwcGx5O1xuXG4vKipcbiAqIEBjbGFzcyBMdWMuQmFzZVxuICogU2ltcGxlIGNsYXNzIHRoYXQgYnkgZGVmYXVsdCBhcHBsaWVzIHRoZSBcbiAqIGZpcnN0IGFyZ3VtZW50IHRvIHRoZSBpbnN0YW5jZSBhbmQgdGhlbiBjYWxsc1xuICogTHVjLkJhc2UuaW5pdC5cbiAqXG4gICAgdmFyIGIgPSBuZXcgTHVjLkJhc2Uoe1xuICAgICAgICBhOiAxLFxuICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdoZXknKVxuICAgICAgICB9XG4gICAgfSlcbiAgICBiLmFcbiAgICA+aGV5XG4gICAgPjFcbiAqL1xuZnVuY3Rpb24gQmFzZSgpIHtcbiAgICB0aGlzLmJlZm9yZUluaXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLmluaXQoKTtcbn1cblxuQmFzZS5wcm90b3R5cGUgPSB7XG4gICAgLyoqXG4gICAgICogQnkgZGVmYXVsdCBhcHBseSB0aGUgY29uZmlnIHRvIHRoZSBcbiAgICAgKiBpbnN0YW5jZS5cbiAgICAgKi9cbiAgICBiZWZvcmVJbml0OiBmdW5jdGlvbihjb25maWcpIHtcbiAgICAgICAgYXBwbHkodGhpcywgY29uZmlnKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEBtZXRob2RcbiAgICAgKiBTaW1wbGUgaG9vayB0byBpbml0aWFsaXplXG4gICAgICogdGhlIGNsYXNzLlxuICAgICAqL1xuICAgIGluaXQ6IGVtcHR5Rm5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZTsiLCJ2YXIgYUVhY2ggPSByZXF1aXJlKCcuLi9hcnJheScpLmVhY2gsXG4gICAgb2JqID0gcmVxdWlyZSgnLi4vb2JqZWN0JyksXG4gICAgZW1wdHlGbiA9IHJlcXVpcmUoJy4uL2Z1bmN0aW9uJykuZW1wdHlGbixcbiAgICBhcHBseSA9IG9iai5hcHBseTtcblxuXG5mdW5jdGlvbiBQbHVnaW4oY29uZmlnKSB7XG4gICAgYXBwbHkodGhpcywgY29uZmlnKTtcbn1cblxuUGx1Z2luLnByb3RvdHlwZSA9IHtcbiAgICBpbml0OiBlbXB0eUZuLFxuICAgIGRlc3Ryb3k6IGVtcHR5Rm5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUGx1Z2luO1xuIiwidmFyIEJhc2UgPSByZXF1aXJlKCcuL2Jhc2UnKSxcbiAgICBDb21wb3NpdGlvbiA9IHJlcXVpcmUoJy4vY29tcG9zaXRpb24nKSxcbiAgICBvYmogPSByZXF1aXJlKCcuLi9vYmplY3QnKSxcbiAgICBhcnJheUZucyA9IHJlcXVpcmUoJy4uL2FycmF5JyksXG4gICAgZW1wdHlGbiA9IHJlcXVpcmUoJy4uL2Z1bmN0aW9uJykuZW1wdHlGbixcbiAgICBhRWFjaCA9IGFycmF5Rm5zLmVhY2gsXG4gICAgYXBwbHkgPSBvYmouYXBwbHksXG4gICAgb0VhY2ggPSBvYmouZWFjaCxcbiAgICBvRmlsdGVyID0gb2JqLmZpbHRlcixcbiAgICBtaXggPSBvYmoubWl4LFxuICAgIGFycmF5U2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbmZ1bmN0aW9uIENsYXNzRGVmaW5lcigpIHt9XG5cbkNsYXNzRGVmaW5lci5DT01QT1NJVElPTlNfTkFNRSA9ICckY29tcG9zaXRpb25zJztcblxuQ2xhc3NEZWZpbmVyLnByb3RvdHlwZSA9IHtcbiAgICBkZWZhdWx0VHlwZTogQmFzZSxcblxuICAgIHByb2Nlc3NvcktleXM6IHtcbiAgICAgICAgJG1peGluczogJ19hcHBseU1peGlucycsXG4gICAgICAgICRzdGF0aWNzOiAnX2FwcGx5U3RhdGljcycsXG4gICAgICAgICRjb21wb3NpdGlvbnM6ICdfY29tcG9zZScsXG4gICAgICAgICRzdXBlcjogdHJ1ZVxuICAgIH0sXG5cbiAgICBkZWZpbmU6IGZ1bmN0aW9uKG9wdHMpIHtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSBvcHRzIHx8IHt9LFxuICAgICAgICAgICAgLy9pZiBzdXBlciBpcyBhIGZhbHN5IHZhbHVlIGJlc2lkZXMgdW5kZWZpbmVkIHRoYXQgbWVhbnMgbm8gc3VwZXJjbGFzc1xuICAgICAgICAgICAgU3VwZXIgPSBvcHRpb25zLiRzdXBlciB8fCAob3B0aW9ucy4kc3VwZXIgPT09IHVuZGVmaW5lZCA/IHRoaXMuZGVmYXVsdFR5cGUgOiBmYWxzZSksXG4gICAgICAgICAgICBDb25zdHJ1Y3RvcjtcblxuICAgICAgICBvcHRpb25zLiRzdXBlciA9IFN1cGVyO1xuXG4gICAgICAgIENvbnN0cnVjdG9yID0gdGhpcy5fY3JlYXRlQ29uc3RydWN0b3Iob3B0aW9ucyk7XG5cbiAgICAgICAgdGhpcy5fcHJvY2Vzc0FmdGVyQ3JlYXRlKENvbnN0cnVjdG9yLCBvcHRpb25zKTtcblxuICAgICAgICByZXR1cm4gQ29uc3RydWN0b3I7XG4gICAgfSxcblxuICAgIF9jcmVhdGVDb25zdHJ1Y3RvcjogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICB2YXIgc3VwZXJjbGFzcyA9IG9wdGlvbnMuJHN1cGVyLFxuICAgICAgICAgICAgQ29uc3RydWN0b3IgPSB0aGlzLl9jcmVhdGVDb25zdHJ1Y3RvckZuKG9wdGlvbnMpO1xuXG4gICAgICAgIGlmKHN1cGVyY2xhc3MpIHtcbiAgICAgICAgICAgIENvbnN0cnVjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJjbGFzcy5wcm90b3R5cGUpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gQ29uc3RydWN0b3I7XG4gICAgfSxcblxuICAgIF9jcmVhdGVDb25zdHJ1Y3RvckZuOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHZhciBzdXBlcmNsYXNzID0gb3B0aW9ucy4kc3VwZXIsXG4gICAgICAgICAgICBDb25zdHJ1Y3RvcjtcblxuICAgICAgICBpZiAodGhpcy5faGFzQ29uc3RydWN0b3JNb2RpZnlpbmdPcHRpb25zKG9wdGlvbnMpKSB7XG4gICAgICAgICAgICBDb25zdHJ1Y3RvciA9IHRoaXMuX2NyZWF0ZUNvbnN0cnVjdG9yV2l0aE1vZGlmaXlpbmdPcHRpb25zKG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoIXN1cGVyY2xhc3MpIHtcbiAgICAgICAgICAgIENvbnN0cnVjdG9yID0gZnVuY3Rpb24oKSB7fTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIENvbnN0cnVjdG9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgc3VwZXJjbGFzcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBDb25zdHJ1Y3RvcjtcbiAgICB9LFxuXG4gICAgX2NyZWF0ZUNvbnN0cnVjdG9yV2l0aE1vZGlmaXlpbmdPcHRpb25zOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHZhciBzdXBlcmNsYXNzID0gb3B0aW9ucy4kc3VwZXIsXG4gICAgICAgICAgICBtZSA9IHRoaXMsXG4gICAgICAgICAgICBpbml0QmVmb3JlU3VwZXJjbGFzcyxcbiAgICAgICAgICAgIGluaXRBZnRlclN1cGVyY2xhc3MsXG4gICAgICAgICAgICBpbml0O1xuXG4gICAgICAgIGlmICghc3VwZXJjbGFzcykge1xuICAgICAgICAgICAgaW5pdCA9IHRoaXMuX2NyZWF0ZUluaXRDbGFzc09wdGlvbnNGbihvcHRpb25zLCB7XG4gICAgICAgICAgICAgICAgYWxsOiB0cnVlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBhcmdzID0gYXJyYXlTbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgaW5pdC5jYWxsKHRoaXMsIG9wdGlvbnMsIGFyZ3MpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXRCZWZvcmVTdXBlcmNsYXNzID0gdGhpcy5fY3JlYXRlSW5pdENsYXNzT3B0aW9uc0ZuKG9wdGlvbnMsIHtcbiAgICAgICAgICAgIGJlZm9yZTogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICBpbml0QWZ0ZXJTdXBlcmNsYXNzID0gdGhpcy5fY3JlYXRlSW5pdENsYXNzT3B0aW9uc0ZuKG9wdGlvbnMsIHtcbiAgICAgICAgICAgIGJlZm9yZTogZmFsc2VcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGFyZ3MgPSBhcnJheVNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblxuICAgICAgICAgICAgaW5pdEJlZm9yZVN1cGVyY2xhc3MuY2FsbCh0aGlzLCBvcHRpb25zLCBhcmdzKTtcbiAgICAgICAgICAgIHN1cGVyY2xhc3MuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIGluaXRBZnRlclN1cGVyY2xhc3MuY2FsbCh0aGlzLCBvcHRpb25zLCBhcmdzKTtcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgX2NyZWF0ZUluaXRDbGFzc09wdGlvbnNGbjogZnVuY3Rpb24ob3B0aW9ucywgY29uZmlnKSB7XG4gICAgICAgIHZhciBtZSA9IHRoaXMsXG4gICAgICAgICAgICBjb21wb3NpdGlvbnMgPSB0aGlzLl9maWx0ZXJDb21wb3NpdGlvbnMoY29uZmlnLCBvcHRpb25zLiRjb21wb3NpdGlvbnMpO1xuXG4gICAgICAgIGlmKGNvbXBvc2l0aW9ucy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBlbXB0eUZuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gZnVuY3Rpb24ob3B0aW9ucywgaW5zdGFuY2VBcmdzKSB7XG4gICAgICAgICAgICBtZS5faW5pdENvbXBvc2l0aW9ucy5jYWxsKHRoaXMsIGNvbXBvc2l0aW9ucywgaW5zdGFuY2VBcmdzKTtcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgX2ZpbHRlckNvbXBvc2l0aW9uczogZnVuY3Rpb24oY29uZmlnLCBjb21wb3NpdGlvbnMpIHtcbiAgICAgICAgdmFyIGJlZm9yZSA9IGNvbmZpZy5iZWZvcmUsIFxuICAgICAgICAgICAgZmlsdGVyZWQgPSBbXTtcblxuICAgICAgICBpZihjb25maWcuYWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gY29tcG9zaXRpb25zO1xuICAgICAgICB9XG5cbiAgICAgICAgYUVhY2goY29tcG9zaXRpb25zLCBmdW5jdGlvbihjb21wb3NpdGlvbikge1xuICAgICAgICAgICAgaWYoYmVmb3JlICYmIGNvbXBvc2l0aW9uLmluaXRBZnRlciAhPT0gdHJ1ZSB8fCAoIWJlZm9yZSAmJiBjb21wb3NpdGlvbi5pbml0QWZ0ZXIgPT09IHRydWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkLnB1c2goY29tcG9zaXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gZmlsdGVyZWQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogb3B0aW9ucyB7T2JqZWN0fSB0aGUgY29tcG9zaXRpb24gY29uZmlnIG9iamVjdFxuICAgICAqIGluc3RhbmNlQXJncyB7QXJyYXl9IHRoZSBhcmd1bWVudHMgcGFzc2VkIHRvIHRoZSBpbnN0YW5jZSdzXG4gICAgICogY29uc3RydWN0b3IuXG4gICAgICovXG4gICAgX2luaXRDb21wb3NpdGlvbnM6IGZ1bmN0aW9uKGNvbXBvc2l0aW9ucywgaW5zdGFuY2VBcmdzKSB7XG4gICAgICAgIGlmKCF0aGlzW0NsYXNzRGVmaW5lci5DT01QT1NJVElPTlNfTkFNRV0pIHtcbiAgICAgICAgICAgIHRoaXNbQ2xhc3NEZWZpbmVyLkNPTVBPU0lUSU9OU19OQU1FXSA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgYUVhY2goY29tcG9zaXRpb25zLCBmdW5jdGlvbihjb21wb3NpdGlvbkNvbmZpZykge1xuICAgICAgICAgICAgdmFyIGNvbmZpZyA9IGFwcGx5KHtcbiAgICAgICAgICAgICAgICBpbnN0YW5jZTogdGhpcyxcbiAgICAgICAgICAgICAgICBpbnN0YW5jZUFyZ3M6IGluc3RhbmNlQXJnc1xuICAgICAgICAgICAgfSwgY29tcG9zaXRpb25Db25maWcpLCBcbiAgICAgICAgICAgIGNvbXBvc2l0aW9uO1xuXG4gICAgICAgICAgICBjb21wb3NpdGlvbiA9IG5ldyBDb21wb3NpdGlvbihjb25maWcpO1xuXG4gICAgICAgICAgICB0aGlzW0NsYXNzRGVmaW5lci5DT01QT1NJVElPTlNfTkFNRV1bY29tcG9zaXRpb24ubmFtZV0gPSBjb21wb3NpdGlvbi5nZXRJbnN0YW5jZSgpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgX2hhc0NvbnN0cnVjdG9yTW9kaWZ5aW5nT3B0aW9uczogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy4kY29tcG9zaXRpb25zO1xuICAgIH0sXG5cbiAgICBfZ2V0UHJvY2Vzc29yS2V5OiBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc29yS2V5c1trZXldO1xuICAgIH0sXG5cbiAgICBfcHJvY2Vzc0FmdGVyQ3JlYXRlOiBmdW5jdGlvbigkY2xhc3MsIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5fYXBwbHlWYWx1ZXNUb1Byb3RvKCRjbGFzcywgb3B0aW9ucyk7XG4gICAgICAgIHRoaXMuX2hhbmRsZVBvc3RQcm9jZXNzb3JzKCRjbGFzcywgb3B0aW9ucyk7XG4gICAgfSxcblxuICAgIF9hcHBseVZhbHVlc1RvUHJvdG86IGZ1bmN0aW9uKCRjbGFzcywgb3B0aW9ucykge1xuICAgICAgICB2YXIgcHJvdG8gPSAkY2xhc3MucHJvdG90eXBlLFxuICAgICAgICAgICAgU3VwZXIgPSBvcHRpb25zLiRzdXBlcixcbiAgICAgICAgICAgIHZhbHVlcyA9IGFwcGx5KHtcbiAgICAgICAgICAgICAgICAkc3VwZXJjbGFzczogU3VwZXIucHJvdG90eXBlLFxuICAgICAgICAgICAgICAgICRjbGFzczogJGNsYXNzXG4gICAgICAgICAgICB9LCBvcHRpb25zKTtcblxuICAgICAgICAvL0Rvbid0IHB1dCB0aGUgZGVmaW5lIHNwZWNpZmljIHByb3BlcnRpZXNcbiAgICAgICAgLy9vbiB0aGUgcHJvdG90eXBlXG4gICAgICAgIG9FYWNoKHZhbHVlcywgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9nZXRQcm9jZXNzb3JLZXkoa2V5KSkge1xuICAgICAgICAgICAgICAgIHByb3RvW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIF9oYW5kbGVQb3N0UHJvY2Vzc29yczogZnVuY3Rpb24oJGNsYXNzLCBvcHRpb25zKSB7XG4gICAgICAgIG9FYWNoKG9wdGlvbnMsIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBtZXRob2QgPSB0aGlzLl9nZXRQcm9jZXNzb3JLZXkoa2V5KTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzW21ldGhvZF0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICB0aGlzW21ldGhvZF0uY2FsbCh0aGlzLCAkY2xhc3MsIG9wdGlvbnNba2V5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICBfYXBwbHlNaXhpbnM6IGZ1bmN0aW9uKCRjbGFzcywgbWl4aW5zKSB7XG4gICAgICAgIHZhciBwcm90byA9ICRjbGFzcy5wcm90b3R5cGU7XG4gICAgICAgIGFFYWNoKG1peGlucywgZnVuY3Rpb24obWl4aW4pIHtcbiAgICAgICAgICAgIC8vYWNjZXB0IENvbnN0cnVjdG9ycyBvciBPYmplY3RzXG4gICAgICAgICAgICB2YXIgdG9NaXggPSBtaXhpbi5wcm90b3R5cGUgfHwgbWl4aW47XG4gICAgICAgICAgICBtaXgocHJvdG8sIHRvTWl4KTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIF9hcHBseVN0YXRpY3M6IGZ1bmN0aW9uKCRjbGFzcywgc3RhdGljcykge1xuICAgICAgICBhcHBseSgkY2xhc3MsIHN0YXRpY3MpO1xuICAgIH0sXG5cbiAgICBfY29tcG9zZTogZnVuY3Rpb24oJGNsYXNzLCBjb21wb3NpdGlvbnMpIHtcbiAgICAgICAgdmFyIHByb3RvdHlwZSA9ICRjbGFzcy5wcm90b3R5cGUsXG4gICAgICAgICAgICBtZXRob2RzVG9Db21wb3NlO1xuXG4gICAgICAgIGFFYWNoKGNvbXBvc2l0aW9ucywgZnVuY3Rpb24oY29tcG9zaXRpb25Db25maWcpIHtcbiAgICAgICAgICAgIHZhciBjb21wb3NpdGlvbiA9IG5ldyBDb21wb3NpdGlvbihjb21wb3NpdGlvbkNvbmZpZyksXG4gICAgICAgICAgICAgICAgbmFtZSA9IGNvbXBvc2l0aW9uLm5hbWUsXG4gICAgICAgICAgICAgICAgQ29uc3RydWN0b3IgPSBjb21wb3NpdGlvbi5Db25zdHJ1Y3RvcjtcblxuICAgICAgICAgICAgY29tcG9zaXRpb24udmFsaWRhdGUoKTtcblxuICAgICAgICAgICAgbWV0aG9kc1RvQ29tcG9zZSA9IGNvbXBvc2l0aW9uLmdldE1ldGhvZHNUb0NvbXBvc2UoKTtcblxuICAgICAgICAgICAgbWV0aG9kc1RvQ29tcG9zZS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgICAgIGlmIChwcm90b3R5cGVba2V5XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3RvdHlwZVtrZXldID0gdGhpcy5fY3JlYXRlQ29tcG9zZXJQcm90b0ZuKGtleSwgbmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICAgIHByb3RvdHlwZS5nZXRDb21wb3NpdGlvbiA9IHRoaXMuX19nZXRDb21wb3NpdGlvbjtcblxuICAgICAgICB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBHZXR0ZXIgZm9yIGNvbXBvc2l0aW9uIGluc3RhbmNlIHRoYXQgZ2V0cyBwdXQgb25cbiAgICAgKiB0aGUgZGVmaW5lZCBjbGFzcy5cbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IGtleVxuICAgICAqL1xuICAgIF9fZ2V0Q29tcG9zaXRpb246IGZ1bmN0aW9uKGtleSkge1xuICAgICAgICByZXR1cm4gdGhpc1tDbGFzc0RlZmluZXIuQ09NUE9TSVRJT05TX05BTUVdW2tleV07XG4gICAgfSxcblxuICAgIF9jcmVhdGVDb21wb3NlclByb3RvRm46IGZ1bmN0aW9uKG1ldGhvZE5hbWUsIGNvbXBvc2l0aW9uTmFtZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgY29tcCA9IHRoaXNbQ2xhc3NEZWZpbmVyLkNPTVBPU0lUSU9OU19OQU1FXVtjb21wb3NpdGlvbk5hbWVdO1xuICAgICAgICAgICAgcmV0dXJuIGNvbXBbbWV0aG9kTmFtZV0uYXBwbHkoY29tcCwgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICB9XG59O1xuXG52YXIgRGVmaW5lciA9IG5ldyBDbGFzc0RlZmluZXIoKTtcbi8vbWFrZSBMdWMuZGVmaW5lIGhhcHB5XG5EZWZpbmVyLmRlZmluZSA9IERlZmluZXIuZGVmaW5lLmJpbmQoRGVmaW5lcik7XG5cbm1vZHVsZS5leHBvcnRzID0gRGVmaW5lcjsiLCJ2YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnLi4vZXZlbnRzL2V2ZW50RW1pdHRlcicpLFxuICAgIFBsdWdpbk1hbmFnZXIgPSByZXF1aXJlKCcuL3BsdWdpbk1hbmFnZXInKTtcblxubW9kdWxlLmV4cG9ydHMuRXZlbnRFbWl0dGVyID0ge1xuICAgIENvbnN0cnVjdG9yOiBFdmVudEVtaXR0ZXIsXG4gICAgbmFtZTogJ2VtaXR0ZXInLFxuICAgIGZpbHRlcktleXM6ICdhbGxNZXRob2RzJ1xufTtcblxuXG5cbm1vZHVsZS5leHBvcnRzLlBsdWdpbk1hbmFnZXIgPSB7XG4gICAgbmFtZTogJ3BsdWdpbnMnLFxuICAgIGluaXRBZnRlcjogdHJ1ZSxcbiAgICBDb25zdHJ1Y3RvcjogUGx1Z2luTWFuYWdlcixcbiAgICBjcmVhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbWFuYWdlciA9IG5ldyB0aGlzLkNvbnN0cnVjdG9yKCk7XG4gICAgICAgIG1hbmFnZXIuaW5pdCh7XG4gICAgICAgICAgICBpbnN0YW5jZTogdGhpcy5pbnN0YW5jZSxcbiAgICAgICAgICAgIGluc3RhbmNlQXJnczogdGhpcy5pbnN0YW5jZUFyZ3NcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIG1hbmFnZXI7XG4gICAgfSxcbiAgICBmaWx0ZXJLZXlzOiBbJ2Rlc3Ryb3lQbHVnaW5zJ11cbn07IiwidmFyIFBsdWdpbiA9IHJlcXVpcmUoJy4vcGx1Z2luJyksXG4gICAgaXMgPSByZXF1aXJlKCcuLi9pcycpLFxuICAgIG9iaiA9IHJlcXVpcmUoJy4uL29iamVjdCcpLFxuICAgIGFyciA9IHJlcXVpcmUoJy4uL2FycmF5JyksXG4gICAgYUVhY2ggPSBhcnIuZWFjaCxcbiAgICBtaXggPSBvYmoubWl4LFxuICAgIGFwcGx5ID0gb2JqLmFwcGx5O1xuXG5mdW5jdGlvbiBQbHVnaW5NYW5hZ2VyKCkge31cblxuUGx1Z2luTWFuYWdlci5wcm90b3R5cGUgPSB7XG4gICAgZGVmYXVsdFBsdWdpbjogUGx1Z2luLFxuXG4gICAgaW5pdDogZnVuY3Rpb24oaW5zdGFuY2VWYWx1ZXMpIHtcbiAgICAgICAgYXBwbHkodGhpcywgaW5zdGFuY2VWYWx1ZXMpO1xuICAgICAgICB0aGlzLmNyZWF0ZVBsdWdpbnMoKTtcbiAgICB9LFxuXG4gICAgY3JlYXRlUGx1Z2luczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjb25maWcgPSB0aGlzLmluc3RhbmNlQXJnc1swXTtcblxuICAgICAgICB0aGlzLnBsdWdpbnMgPSBbXTtcblxuICAgICAgICBhRWFjaChjb25maWcucGx1Z2lucywgZnVuY3Rpb24ocGx1Z2luQ29uZmlnKSB7XG4gICAgICAgICAgICBwbHVnaW5Db25maWcub3duZXIgPSB0aGlzLmluc3RhbmNlO1xuICAgICAgICAgICAgdmFyIHBsdWdpbkluc3RhbmNlID0gdGhpcy5jcmVhdGVQbHVnaW4ocGx1Z2luQ29uZmlnKTtcblxuICAgICAgICAgICAgdGhpcy5pbml0UGx1Z2luKHBsdWdpbkluc3RhbmNlKTtcblxuICAgICAgICAgICAgdGhpcy5wbHVnaW5zLnB1c2gocGx1Z2luSW5zdGFuY2UpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgY3JlYXRlUGx1Z2luOiBmdW5jdGlvbihjb25maWcpIHtcblxuICAgICAgICBpZiAoY29uZmlnLkNvbnN0cnVjdG9yKSB7XG4gICAgICAgICAgICAvL2NhbGwgdGhlIGNvbmZpZ2VkIENvbnN0cnVjdG9yIHdpdGggdGhlIFxuICAgICAgICAgICAgLy9wYXNzZWQgaW4gY29uZmlnIGJ1dCB0YWtlIG9mZiB0aGUgQ29uc3RydWN0b3JcbiAgICAgICAgICAgIC8vY29uZmlnLlxuICAgICAgICAgICAgIFxuICAgICAgICAgICAgLy9UaGUgcGx1Z2luIENvbnN0cnVjdG9yIFxuICAgICAgICAgICAgLy9zaG91bGQgbm90IG5lZWQgdG8ga25vdyBhYm91dCBpdHNlbGZcbiAgICAgICAgICAgIHJldHVybiBuZXcgY29uZmlnLkNvbnN0cnVjdG9yKGFwcGx5KGNvbmZpZywge1xuICAgICAgICAgICAgICAgIENvbnN0cnVjdG9yOiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vaWYgQ29uc3RydWN0b3IgcHJvcGVydHkgaXMgbm90IG9uXG4gICAgICAgIC8vdGhlIGNvbmZpZyBqdXN0IHVzZSB0aGUgZGVmYXVsdCBQbHVnaW5cbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzLmRlZmF1bHRQbHVnaW4oY29uZmlnKTtcbiAgICB9LFxuXG4gICAgaW5pdFBsdWdpbjogZnVuY3Rpb24ocGx1Z2luKSB7XG4gICAgICAgIGlmIChpcy5pc0Z1bmN0aW9uKHBsdWdpbi5pbml0KSkge1xuICAgICAgICAgICAgcGx1Z2luLmluaXQodGhpcy5pbnN0YW5jZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZGVzdHJveVBsdWdpbnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnBsdWdpbnMuZm9yRWFjaChmdW5jdGlvbihwbHVnaW4pIHtcbiAgICAgICAgICAgIGlmIChpcy5pc0Z1bmN0aW9uKHBsdWdpbi5kZXN0cm95KSkge1xuICAgICAgICAgICAgICAgIHBsdWdpbi5kZXN0cm95KHRoaXMuaW5zdGFuY2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBsdWdpbk1hbmFnZXI7IiwidmFyIG9iaiA9IHJlcXVpcmUoJy4uL29iamVjdCcpLFxuICAgIGFwcGx5ID0gb2JqLmFwcGx5LFxuICAgIG1peCA9IG9iai5taXgsXG4gICAgb0ZpbHRlciA9IG9iai5maWx0ZXIsXG4gICAgZW1wdHlGbiA9ICgnLi4vZnVuY3Rpb24nKS5lbXB0eUZuLFxuICAgIGlzID0gcmVxdWlyZSgnLi4vaXMnKTtcblxuLyoqXG4gKiBAY2xhc3MgIEx1Yy5Db21wb3NpdGlvblxuICogQHByb3RlY3RlZFxuICogY2xhc3MgdGhhdCB3cmFwcyAkY29tcG9zaXRpb24gY29uZmlnIG9iamVjdHNcbiAqIHRvIGNvbmZvcm0gdG8gYW4gYXBpLiBUaGUgY29uZmlnIG9iamVjdFxuICogd2lsbCBvdmVycmlkZSBhbnkgcHJvdGVjdGVkIG1ldGhvZHMgYW5kIGRlZmF1bHQgY29uZmlncy5cbiAqL1xuZnVuY3Rpb24gQ29tcG9zaXRpb24oYykge1xuICAgIHZhciBkZWZhdWx0cyA9IGMuZGVmYXVsdHMsXG4gICAgICAgIGNvbmZpZyA9IGM7XG5cbiAgICBpZihkZWZhdWx0cykge1xuICAgICAgICBtaXgoY29uZmlnLCBjb25maWcuZGVmYXVsdHMpO1xuICAgICAgICBkZWxldGUgY29uZmlnLmRlZmF1bHRzO1xuICAgIH1cblxuICAgIGFwcGx5KHRoaXMsIGNvbmZpZyk7XG59XG5cbkNvbXBvc2l0aW9uLnByb3RvdHlwZSA9IHtcbiAgICAvKipcbiAgICAgKiBAY2ZnIHtTdHJpbmd9IG5hbWUgKHJlcXVpcmVkKSB0aGUgbmFtZVxuICAgICAqL1xuICAgIFxuICAgIC8qKlxuICAgICAqIEBjZmcge0Z1bmN0aW9ufSBDb25zdHJ1Y3RvciAocmVxdWlyZWQpIHRoZSBDb25zdHJ1Y3RvclxuICAgICAqIHRvIHVzZSB3aGVuIGNyZWF0aW5nIHRoZSBjb21wb3NpdGlvbiBpbnN0YW5jZS4gIFRoaXNcbiAgICAgKiBpcyByZXF1aXJlZCBpZiBMdWMuQ29tcG9zaXRpb24uY3JlYXRlIGlzIG5vdCBvdmVycndpdHRlbiBieVxuICAgICAqIHRoZSBwYXNzZWQgaW4gY29tcG9zaXRpb24gY29uZmlnIG9iamVjdC5cbiAgICAgKi9cbiAgICBcbiAgICAvKipcbiAgICAgKiBAcHJvdGVjdGVkXG4gICAgICogQnkgZGVmYXVsdCBqdXN0IHJldHVybiBhIG5ld2x5IGNyZWF0ZWQgQ29uc3RydWN0b3IgaW5zdGFuY2UuXG4gICAgICogXG4gICAgICogV2hlbiBjcmVhdGUgaXMgY2FsbGVkIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllcyBjYW4gYmUgdXNlZCA6XG4gICAgICogXG4gICAgICogdGhpcy5pbnN0YW5jZSBUaGUgaW5zdGFuY2UgdGhhdCBpcyBjcmVhdGluZ1xuICAgICAqIHRoZSBjb21wb3NpdGlvbi5cbiAgICAgKiBcbiAgICAgKiB0aGlzLkNvbnN0cnVjdG9yIHRoZSBjb25zdHJ1Y3RvciB0aGF0IGlzIHBhc3NlZCBpbiBmcm9tXG4gICAgICogdGhlIGNvbXBvc2l0aW9uIGNvbmZpZy4gXG4gICAgICpcbiAgICAgKiB0aGlzLmluc3RhbmNlQXJncyB0aGUgYXJndW1lbnRzIHBhc3NlZCBpbnRvIHRoZSBpbnN0YW5jZSB3aGVuIGl0IFxuICAgICAqIGlzIGJlaW5nIGNyZWF0ZWQuICBGb3IgZXhhbXBsZVxuXG4gICAgICAgIG5ldyBNeUNsYXNzV2l0aEFDb21wb3NpdGlvbih7cGx1Z2luczogW119KVxuICAgICAgICAvL2luc2lkZSBvZiB0aGUgY3JlYXRlIG1ldGhvZFxuICAgICAgICB0aGlzLmluc3RhbmNlQXJnc1xuICAgICAgICA+W3twbHVnaW5zOiBbXX1dXG5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFxuICAgICAqIHRoZSBjb21wb3NpdGlvbiBpbnN0YW5jZS5cbiAgICAgKlxuICAgICAqIEZvciBleGFtcGxlIHNldCB0aGUgZW1pdHRlcnMgbWF4TGlzdGVuZXJzXG4gICAgICogdG8gd2hhdCB0aGUgaW5zdGFuY2UgaGFzIGNvbmZpZ2VkLlxuICAgICAgXG4gICAgICAgIG1heExpc3RlbmVyczogMTAwLFxuICAgICAgICAkY29tcG9zaXRpb25zOiB7XG4gICAgICAgICAgICBDb25zdHJ1Y3RvcjogTHVjLkV2ZW50RW1pdHRlcixcbiAgICAgICAgICAgIGNyZWF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIGVtaXR0ZXIgPSBuZXcgdGhpcy5Db25zdHJ1Y3RvcigpO1xuICAgICAgICAgICAgICAgIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKHRoaXMuaW5zdGFuY2UubWF4TGlzdGVuZXJzKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZW1pdHRlcjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBuYW1lOiAnZW1pdHRlcidcbiAgICAgICAgfVxuXG4gICAgICovXG4gICAgY3JlYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIENvbnN0cnVjdG9yID0gdGhpcy5Db25zdHJ1Y3RvcjtcbiAgICAgICAgcmV0dXJuIG5ldyBDb25zdHJ1Y3RvcigpO1xuICAgIH0sXG5cbiAgICBnZXRJbnN0YW5jZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZSgpO1xuICAgIH0sXG5cbiAgICB2YWxpZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKHRoaXMubmFtZSAgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBIG5hbWUgbXVzdCBiZSBkZWZpbmVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYoIWlzLmlzRnVuY3Rpb24odGhpcy5Db25zdHJ1Y3RvcikgJiYgdGhpcy5jcmVhdGUgPT09IENvbXBvc2l0aW9uLnByb3RvdHlwZS5jcmVhdGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIENvbnN0cnVjdG9yIG11c3QgYmUgZnVuY3Rpb24gaWYgY3JlYXRlIGlzIG5vdCBvdmVycmlkZW4nKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkgZmlsdGVyRm5zXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAcHJvcGVydHkgZmlsdGVyRm5zLmFsbE1ldGhvZHMgcmV0dXJuIGFsbCBtZXRob2RzIGZyb20gdGhlXG4gICAgICogY29uc3RydWN0b3JzIHByb3RvdHlwZVxuICAgICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICAgKi9cbiAgICBmaWx0ZXJGbnM6IHtcbiAgICAgICAgYWxsTWV0aG9kczogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGlzLmlzRnVuY3Rpb24odmFsdWUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBjZmcge0Z1bmN0aW9uL1N0cmluZy9BcnJheVtdfSBmaWx0ZXJLZXlzXG4gICAgICogVGhlIGtleXMgdG8gYWRkIHRvIHRoZSBkZWZpbmVycyBwcm90b3R5cGUgdGhhdCB3aWxsIGluIHR1cm4gY2FsbFxuICAgICAqIHRoZSBjb21wb3NpdGlvbnMgbWV0aG9kLlxuICAgICAqIFxuICAgICAqIERlZmF1bHRzIHRvIEx1Yy5lbXB0eUZuLiBcbiAgICAgKiBJZiBhbiBhcnJheSBpcyBwYXNzZWQgaXQgd2lsbCBqdXN0IHVzZSB0aGF0IEFycmF5LlxuICAgICAqIFxuICAgICAqIElmIGEgc3RyaW5nIGlzIHBhc3NlZCBhbmQgbWF0Y2hlcyBhIG1ldGhvZCBmcm9tIFxuICAgICAqIEx1Yy5Db21wb3NpdGlvbi5maWx0ZXJGbnMgaXQgd2lsbCBjYWxsIHRoYXQgaW5zdGVhZC5cbiAgICAgKiBcbiAgICAgKiBJZiBhIGZ1bmN0aW9uIGlzIGRlZmluZWQgaXRcbiAgICAgKiB3aWxsIGdldCBjYWxsZWQgd2hpbGUgaXRlcmF0aW5nIG92ZXIgZWFjaCBrZXkgdmFsdWUgcGFpciBvZiB0aGUgXG4gICAgICogQ29uc3RydWN0b3IncyBwcm90b3R5cGUsIGlmIGEgdHJ1dGh5IHZhbHVlIGlzIFxuICAgICAqIHJldHVybmVkIHRoZSBwcm9wZXJ0eSB3aWxsIGJlIGFkZGVkIHRvIHRoZSBkZWZpbmluZ1xuICAgICAqIGNsYXNzZXMgcHJvdG90eXBlLlxuICAgICAqIFxuICAgICAqIEZvciBleGFtcGxlIHRoaXMgY29uZmlnIHdpbGwgb25seSBleHBvc2UgdGhlIGVtaXQgbWV0aG9kIFxuICAgICAqIHRvIHRoZSBkZWZpbmluZyBjbGFzc1xuICAgICBcbiAgICAgICAgJGNvbXBvc2l0aW9uczoge1xuICAgICAgICAgICAgQ29uc3RydWN0b3I6IEx1Yy5FdmVudEVtaXR0ZXIsXG4gICAgICAgICAgICBmaWx0ZXJLZXlzOiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGtleSA9PT0gJ2VtaXQnO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG5hbWU6ICdlbWl0dGVyJ1xuICAgICAgICB9XG4gICAgICogdGhpcyBpcyBhbHNvIGEgdmFsaWQgY29uZmlnXG4gICAgICogXG4gICAgICAgICRjb21wb3NpdGlvbnM6IHtcbiAgICAgICAgICAgIENvbnN0cnVjdG9yOiBMdWMuRXZlbnRFbWl0dGVyLFxuICAgICAgICAgICAgZmlsdGVyS2V5czogWydlbWl0dGVyJ10sXG4gICAgICAgICAgICBuYW1lOiAnZW1pdHRlcidcbiAgICAgICAgfVxuICAgICAqIFxuICAgICAqL1xuICAgIGZpbHRlcktleXM6IGVtcHR5Rm4sXG5cbiAgICBnZXRNZXRob2RzVG9Db21wb3NlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGZpbHRlcktleXMgPSB0aGlzLmZpbHRlcktleXMsXG4gICAgICAgICAgICBwYWlyc1RvQWRkLFxuICAgICAgICAgICAgZmlsdGVyRm47XG5cblxuICAgICAgICBpZiAoaXMuaXNBcnJheShmaWx0ZXJLZXlzKSkge1xuICAgICAgICAgICAgcGFpcnNUb0FkZCA9IGZpbHRlcktleXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmaWx0ZXJGbiA9IGZpbHRlcktleXM7XG5cbiAgICAgICAgICAgIGlmIChpcy5pc1N0cmluZyhmaWx0ZXJLZXlzKSkge1xuICAgICAgICAgICAgICAgIGZpbHRlckZuID0gdGhpcy5maWx0ZXJGbnNbZmlsdGVyS2V5c107XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vQ29uc3RydWN0b3JzIGFyZSBub3QgbmVlZGVkIGlmIGNyZWF0ZSBpcyBvdmVyd3JpdHRlblxuICAgICAgICAgICAgcGFpcnNUb0FkZCA9IG9GaWx0ZXIodGhpcy5Db25zdHJ1Y3RvciAmJiB0aGlzLkNvbnN0cnVjdG9yLnByb3RvdHlwZSwgZmlsdGVyRm4sIHRoaXMsIHtcbiAgICAgICAgICAgICAgICBvd25Qcm9wZXJ0aWVzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBrZXlzOiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwYWlyc1RvQWRkO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ29tcG9zaXRpb247Il19
;