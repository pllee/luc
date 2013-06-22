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
},{"./object":2,"./function":3,"./array":4,"./is":5,"./events/eventEmitter":6,"./class/base":7,"./class/definer":8,"./class/plugin":9,"./compare":10,"./class/compositionEnumns":11}],2:[function(require,module,exports){
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

    return removed;
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
    return found;
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

(function(){
    var _createLastFn = function(fnName) {
        var lastName = fnName.replace('First', 'Last');

        exports[lastName] = function findLast(arr, obj, config) {
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

(function() {
    var namesToIs = ['findFirstNot', 'findAllNot', 'findFirst', 'findAll',
                     'removeFirstNot', 'removeAllNot', 'removeFirst', 'removeAll',
                     'removeLastNot', 'removeLast', 'findLast', 'findLastNot'],
      isToIgnore = ['isRegExp', 'isArguments'];

    function _createIsFn(fnName, key) {
        return function(arr) {
            return exports[fnName](arr, is[key]);
        };
    }

    Object.keys(is).forEach(function(key) {
        var name = key.split('is')[1];
        namesToIs.forEach(function(fnName) {
            if(isToIgnore.indexOf(key) === -1) {
                exports[fnName + name] = _createIsFn(fnName,key);
            }
        });
    });
}());

(function() {
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

    function _createKeyedFn(fnName, key) {
        return function(arr) {
            return exports[fnName](arr, fns[key]);
        };
    }

    Object.keys(fns).forEach(function(key) {
        usefullFalsyFns.forEach(function(fnName) {
            exports[fnName + key] = _createKeyedFn(fnName,key);
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


},{"./is":5,"./compare":10}],3:[function(require,module,exports){
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
},{"./is":5,"./array":4}],10:[function(require,module,exports){
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
},{"../function":3,"../object":2}],8:[function(require,module,exports){
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
},{"./base":7,"../array":4,"./composition":14,"../object":2,"../function":3,"../is":5}],9:[function(require,module,exports){
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

},{"../array":4,"../function":3,"../object":2}],11:[function(require,module,exports){
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
},{"../is":5,"./plugin":9,"../object":2,"../array":4}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvbHVjLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL29iamVjdC5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9pcy5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9ldmVudHMvZXZlbnRFbWl0dGVyLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2luc2VydC1tb2R1bGUtZ2xvYmFscy9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItYnVpbHRpbnMvYnVpbHRpbi9ldmVudHMuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvYXJyYXkuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvZnVuY3Rpb24uanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvY29tcGFyZS5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9jbGFzcy9iYXNlLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2NsYXNzL2RlZmluZXIuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvY2xhc3MvcGx1Z2luLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2NsYXNzL2NvbXBvc2l0aW9uRW51bW5zLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2NsYXNzL2NvbXBvc2l0aW9uLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2NsYXNzL3BsdWdpbk1hbmFnZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqb0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOVVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDelNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsidmFyIEx1YyA9IHt9O1xuLyoqXG4gKiBAY2xhc3MgTHVjXG4gKiBBbGlhc2VzIGZvciBjb21tb24gTHVjIG1ldGhvZHMgYW5kIHBhY2thZ2VzLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IEx1YztcblxudmFyIG9iamVjdCA9IHJlcXVpcmUoJy4vb2JqZWN0Jyk7XG5MdWMuT2JqZWN0ID0gb2JqZWN0O1xuLyoqXG4gKiBAbWVtYmVyIEx1Y1xuICogQHByb3BlcnR5IE8gTHVjLk9cbiAqIEFsaWFzIGZvciBMdWMuT2JqZWN0XG4gKi9cbkx1Yy5PID0gb2JqZWN0O1xuXG5cbi8qKlxuICogQG1lbWJlciBMdWNcbiAqIEBtZXRob2QgYXBwbHlcbiAqIEBpbmhlcml0ZG9jIEx1Yy5PYmplY3QjYXBwbHlcbiAqL1xuTHVjLmFwcGx5ID0gTHVjLk9iamVjdC5hcHBseTtcblxuLyoqXG4gKiBAbWVtYmVyIEx1Y1xuICogQG1ldGhvZCBtaXhcbiAqIEBpbmhlcml0ZG9jIEx1Yy5PYmplY3QjbWl4XG4gKi9cbkx1Yy5taXggPSBMdWMuT2JqZWN0Lm1peDtcblxuXG52YXIgZnVuID0gcmVxdWlyZSgnLi9mdW5jdGlvbicpO1xuTHVjLkZ1bmN0aW9uID0gZnVuO1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjXG4gKiBAcHJvcGVydHkgRiBMdWMuRlxuICogQWxpYXMgZm9yIEx1Yy5GdW5jdGlvblxuICovXG5MdWMuRiA9IGZ1bjtcblxuLyoqXG4gKiBAbWVtYmVyIEx1Y1xuICogQG1ldGhvZCBlbXB0eUZuXG4gKiBAaW5oZXJpdGRvYyBMdWMuRnVuY3Rpb24jZW1wdHlGblxuICovXG5MdWMuZW1wdHlGbiA9IEx1Yy5GdW5jdGlvbi5lbXB0eUZuO1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjXG4gKiBAbWV0aG9kIGFic3RyYWN0Rm5cbiAqIEBpbmhlcml0ZG9jIEx1Yy5GdW5jdGlvbiNhYnN0cmFjdEZuXG4gKi9cbkx1Yy5hYnN0cmFjdEZuID0gTHVjLkZ1bmN0aW9uLmFic3RyYWN0Rm47XG5cbnZhciBhcnJheSA9IHJlcXVpcmUoJy4vYXJyYXknKTtcbkx1Yy5BcnJheSA9IGFycmF5O1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjXG4gKiBAcHJvcGVydHkgQSBMdWMuQVxuICogQWxpYXMgZm9yIEx1Yy5BcnJheVxuICovXG5MdWMuQSA9IGFycmF5O1xuXG5MdWMuYXBwbHkoTHVjLCByZXF1aXJlKCcuL2lzJykpO1xuXG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnLi9ldmVudHMvZXZlbnRFbWl0dGVyJyk7XG5cbkx1Yy5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbnZhciBCYXNlID0gcmVxdWlyZSgnLi9jbGFzcy9iYXNlJyk7XG5cbkx1Yy5CYXNlID0gQmFzZTtcblxudmFyIERlZmluZXIgPSByZXF1aXJlKCcuL2NsYXNzL2RlZmluZXInKTtcblxuTHVjLkNsYXNzRGVmaW5lciA9IERlZmluZXI7XG5cbkx1Yy5kZWZpbmUgPSBEZWZpbmVyLmRlZmluZTtcblxuTHVjLlBsdWdpbiA9IHJlcXVpcmUoJy4vY2xhc3MvcGx1Z2luJyk7XG5cbkx1Yy5hcHBseShMdWMsIHtcbiAgICBjb21wb3NpdGlvbkVudW1uczogcmVxdWlyZSgnLi9jbGFzcy9jb21wb3NpdGlvbkVudW1ucycpXG59KTtcblxuTHVjLmNvbXBhcmUgPSByZXF1aXJlKCcuL2NvbXBhcmUnKS5jb21wYXJlO1xuXG5cbmlmKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgd2luZG93Lkx1YyA9IEx1Yztcbn0iLCIvKipcbiAqIEBjbGFzcyBMdWMuT2JqZWN0XG4gKiBQYWNrYWdlIGZvciBPYmplY3QgbWV0aG9kc1xuICovXG5cbi8qKlxuICogQXBwbHkgdGhlIHByb3BlcnRpZXMgZnJvbSBmcm9tT2JqZWN0IHRvIHRoZSB0b09iamVjdC4gIGZyb21PYmplY3Qgd2lsbFxuICogb3ZlcndyaXRlIGFueSBzaGFyZWQga2V5cy4gIEl0IGNhbiBhbHNvIGJlIHVzZWQgYXMgYSBzaW1wbGUgc2hhbGxvdyBjbG9uZS5cbiAqIFxuICAgIHZhciB0byA9IHthOjEsIGM6MX0sIGZyb20gPSB7YToyLCBiOjJ9XG4gICAgTHVjLk9iamVjdC5hcHBseSh0bywgZnJvbSlcbiAgICA+T2JqZWN0IHthOiAyLCBjOiAxLCBiOiAyfVxuICAgIHRvID09PSB0b1xuICAgID50cnVlXG4gICAgdmFyIGNsb25lID0gTHVjLk9iamVjdC5hcHBseSh7fSwgZnJvbSlcbiAgICA+dW5kZWZpbmVkXG4gICAgY2xvbmVcbiAgICA+T2JqZWN0IHthOiAyLCBiOiAyfVxuICAgIGNsb25lID09PSBmcm9tXG4gICAgPmZhbHNlXG4gKlxuICogQHBhcmFtICB7T2JqZWN0fHVuZGVmaW5lZH0gdG9PYmplY3QgT2JqZWN0IHRvIHB1dCB0aGUgcHJvcGVydGllcyBmcm9tT2JqZWN0IG9uLlxuICogQHBhcmFtICB7T2JqZWN0fHVuZGVmaW5lZH0gZnJvbU9iamVjdCBPYmplY3QgdG8gcHV0IHRoZSBwcm9wZXJ0aWVzIG9uIHRoZSB0b09iamVjdFxuICogQHJldHVybiB7T2JqZWN0fSB0aGUgdG9PYmplY3RcbiAqL1xuZXhwb3J0cy5hcHBseSA9IGZ1bmN0aW9uKHRvT2JqZWN0LCBmcm9tT2JqZWN0KSB7XG4gICAgdmFyIHRvID0gdG9PYmplY3QgfHwge30sXG4gICAgICAgIGZyb20gPSBmcm9tT2JqZWN0IHx8IHt9LFxuICAgICAgICBwcm9wO1xuXG4gICAgZm9yIChwcm9wIGluIGZyb20pIHtcbiAgICAgICAgaWYgKGZyb20uaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICAgIHRvW3Byb3BdID0gZnJvbVtwcm9wXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0bztcbn07XG5cbi8qKlxuICogU2ltaWxhciB0byBMdWMuT2JqZWN0LmFwcGx5IGV4Y2VwdCB0aGF0IHRoZSBmcm9tT2JqZWN0IHdpbGwgXG4gKiBOT1Qgb3ZlcndyaXRlIHRoZSBrZXlzIG9mIHRoZSB0b09iamVjdCBpZiB0aGV5IGFyZSBkZWZpbmVkLlxuICogXG4gKiBAcGFyYW0gIHtPYmplY3R8dW5kZWZpbmVkfSB0b09iamVjdCBPYmplY3QgdG8gcHV0IHRoZSBwcm9wZXJ0aWVzIGZyb21PYmplY3Qgb24uXG4gKiBAcGFyYW0gIHtPYmplY3R8dW5kZWZpbmVkfSBmcm9tT2JqZWN0IE9iamVjdCB0byBwdXQgdGhlIHByb3BlcnRpZXMgb24gdGhlIHRvT2JqZWN0XG4gKiBAcmV0dXJuIHtPYmplY3R9IHRoZSB0b09iamVjdFxuICovXG5leHBvcnRzLm1peCA9IGZ1bmN0aW9uKHRvT2JqZWN0LCBmcm9tT2JqZWN0KSB7XG4gICAgdmFyIHRvID0gdG9PYmplY3QgfHwge30sXG4gICAgICAgIGZyb20gPSBmcm9tT2JqZWN0IHx8IHt9LFxuICAgICAgICBwcm9wO1xuXG4gICAgZm9yIChwcm9wIGluIGZyb20pIHtcbiAgICAgICAgaWYgKGZyb20uaGFzT3duUHJvcGVydHkocHJvcCkgJiYgdG9bcHJvcF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdG9bcHJvcF0gPSBmcm9tW3Byb3BdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRvO1xufTtcblxuLyoqXG4gKiBJdGVyYXRlIG92ZXIgYW4gb2JqZWN0cyBwcm9wZXJ0aWVzXG4gKiBhcyBrZXkgdmFsdWUgXCJwYWlyc1wiIHdpdGggdGhlIHBhc3NlZCBpbiBmdW5jdGlvbi5cbiAqIFxuICAgIHZhciBjb250ZXh0ID0ge3ZhbDoxfTtcbiAgICBMdWMuT2JqZWN0LmVhY2goe1xuICAgICAgICBrZXk6IDFcbiAgICB9LCBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHZhbHVlICsga2V5ICsgdGhpcy52YWwpXG4gICAgfSwgY29udGV4dClcbiAgICBcbiAgICA+MWtleTEgXG4gXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgb2JqICB0aGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3ZlclxuICogQHBhcmFtICB7RnVuY3Rpb259IGZuICAgdGhlIGZ1bmN0aW9uIHRvIGNhbGxcbiAqIEBwYXJhbSAge1N0cmluZ30gZm4ua2V5ICAgdGhlIG9iamVjdCBrZXlcbiAqIEBwYXJhbSAge09iamVjdH0gZm4udmFsdWUgICB0aGUgb2JqZWN0IHZhbHVlXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgW3RoaXNBcmddIFxuICogQHBhcmFtIHtPYmplY3R9ICBbY29uZmlnXVxuICogQHBhcmFtIHtCb29sZWFufSAgY29uZmlnLm93blByb3BlcnRpZXMgc2V0IHRvIGZhbHNlXG4gKiB0byBpdGVyYXRlIG92ZXIgYWxsIG9mIHRoZSBvYmplY3RzIGVudW1lcmFibGUgcHJvcGVydGllcy5cbiAqL1xuZXhwb3J0cy5lYWNoID0gZnVuY3Rpb24ob2JqLCBmbiwgdGhpc0FyZywgY29uZmlnKSB7XG4gICAgdmFyIGtleSwgdmFsdWUsXG4gICAgICAgIGFsbFByb3BlcnRpZXMgPSBjb25maWcgJiYgY29uZmlnLm93blByb3BlcnRpZXMgPT09IGZhbHNlO1xuXG4gICAgaWYgKGFsbFByb3BlcnRpZXMpIHtcbiAgICAgICAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgICAgICAgICBmbi5jYWxsKHRoaXNBcmcsIGtleSwgb2JqW2tleV0pO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBmbi5jYWxsKHRoaXNBcmcsIGtleSwgb2JqW2tleV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcblxuLyoqXG4gKiBUYWtlIGFuIGFycmF5IG9mIHN0cmluZ3MgYW5kIGFuIGFycmF5L2FyZ3VtZW50cyBvZlxuICogdmFsdWVzIGFuZCByZXR1cm4gYW4gb2JqZWN0IG9mIGtleSB2YWx1ZSBwYWlyc1xuICogYmFzZWQgb2ZmIGVhY2ggYXJyYXlzIGluZGV4LiAgSXQgaXMgdXNlZnVsIGZvciB0YWtpbmdcbiAqIGEgbG9uZyBsaXN0IG9mIGFyZ3VtZW50cyBhbmQgY3JlYXRpbmcgYW4gb2JqZWN0IHRoYXQgY2FuXG4gKiBiZSBwYXNzZWQgdG8gb3RoZXIgbWV0aG9kcy5cbiAqIFxuICAgIGZ1bmN0aW9uIGxvbmdBcmdzKGEsYixjLGQsZSxmKSB7XG4gICAgICAgIHJldHVybiBMdWMuT2JqZWN0LnRvT2JqZWN0KFsnYScsJ2InLCAnYycsICdkJywgJ2UnLCAnZiddLCBhcmd1bWVudHMpXG4gICAgfVxuXG4gICAgbG9uZ0FyZ3MoMSwyLDMsNCw1LDYsNyw4LDkpXG5cbiAgICA+T2JqZWN0IHthOiAxLCBiOiAyLCBjOiAzLCBkOiA0LCBlOiA14oCmfVxuICAgIGE6IDFcbiAgICBiOiAyXG4gICAgYzogM1xuICAgIGQ6IDRcbiAgICBlOiA1XG4gICAgZjogNlxuXG4gICAgbG9uZ0FyZ3MoMSwyLDMpXG5cbiAgICA+T2JqZWN0IHthOiAxLCBiOiAyLCBjOiAzLCBkOiB1bmRlZmluZWQsIGU6IHVuZGVmaW5lZOKApn1cbiAgICBhOiAxXG4gICAgYjogMlxuICAgIGM6IDNcbiAgICBkOiB1bmRlZmluZWRcbiAgICBlOiB1bmRlZmluZWRcbiAgICBmOiB1bmRlZmluZWRcblxuICogQHBhcmFtICB7U3RyaW5nW119IHN0cmluZ3NcbiAqIEBwYXJhbSAge0FycmF5L2FyZ3VtZW50c30gdmFsdWVzXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbmV4cG9ydHMudG9PYmplY3QgPSBmdW5jdGlvbihzdHJpbmdzLCB2YWx1ZXMpIHtcbiAgICB2YXIgb2JqID0ge30sXG4gICAgICAgIGkgPSAwLFxuICAgICAgICBsZW4gPSBzdHJpbmdzLmxlbmd0aDtcbiAgICBmb3IgKDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgIG9ialtzdHJpbmdzW2ldXSA9IHZhbHVlc1tpXTtcbiAgICB9XG5cbiAgICByZXR1cm4gb2JqO1xufTtcblxuLyoqXG4gKiBSZXR1cm4ga2V5IHZhbHVlIHBhaXJzIGZyb20gdGhlIG9iamVjdCBpZiB0aGVcbiAqIGZpbHRlckZuIHJldHVybnMgYSB0cnV0aHkgdmFsdWUuXG4gKlxuICAgIEx1Yy5PYmplY3QuZmlsdGVyKHtcbiAgICAgICAgYTogZmFsc2UsXG4gICAgICAgIGI6IHRydWUsXG4gICAgICAgIGM6IGZhbHNlXG4gICAgfSwgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4ga2V5ID09PSAnYScgfHwgdmFsdWVcbiAgICB9KVxuICAgID5be2tleTogJ2EnLCB2YWx1ZTogZmFsc2V9LCB7a2V5OiAnYicsIHZhbHVlOiB0cnVlfV1cbiAqIFxuICogQHBhcmFtICB7T2JqZWN0fSAgIG9iaiAgdGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXJcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmaWx0ZXJGbiAgIHRoZSBmdW5jdGlvbiB0byBjYWxsLCByZXR1cm4gYSB0cnV0aHkgdmFsdWVcbiAqIHRvIGFkZCB0aGUga2V5IHZhbHVlIHBhaXJcbiAqIEBwYXJhbSAge1N0cmluZ30gZmlsdGVyRm4ua2V5ICAgdGhlIG9iamVjdCBrZXlcbiAqIEBwYXJhbSAge09iamVjdH0gZmlsdGVyRm4udmFsdWUgICB0aGUgb2JqZWN0IHZhbHVlXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgW3RoaXNBcmddIFxuICogQHBhcmFtIHtPYmplY3R9ICBbY29uZmlnXVxuICogQHBhcmFtIHtCb29sZWFufSAgY29uZmlnLm93blByb3BlcnRpZXMgc2V0IHRvIGZhbHNlXG4gKiB0byBpdGVyYXRlIG92ZXIgYWxsIG9mIHRoZSBvYmplY3RzIGVudW1lcmFibGUgcHJvcGVydGllcy5cbiAqIFxuICogQHBhcmFtIHtCb29sZWFufSAgY29uZmlnLmtleXMgc2V0IHRvIHRydWUgdG8gcmV0dXJuXG4gKiBqdXN0IHRoZSBrZXlzLlxuICpcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gIGNvbmZpZy52YWx1ZXMgc2V0IHRvIHRydWUgdG8gcmV0dXJuXG4gKiBqdXN0IHRoZSB2YWx1ZXMuXG4gKiBcbiAqIEByZXR1cm4ge09iamVjdFtdL1N0cmluZ1tdfSBBcnJheSBvZiBrZXkgdmFsdWUgcGFpcnMgaW4gdGhlIGZvcm1cbiAqIG9mIHtrZXk6ICdrZXknLCB2YWx1ZTogdmFsdWV9LiAgSWYga2V5cyBvciB2YWx1ZXMgaXMgdHJ1ZSBvbiB0aGUgY29uZmlnXG4gKiBqdXN0IHRoZSBrZXlzIG9yIHZhbHVlcyBhcmUgcmV0dXJuZWQuXG4gKlxuICovXG5leHBvcnRzLmZpbHRlciA9IGZ1bmN0aW9uKG9iaiwgZmlsdGVyRm4sIHRoaXNBcmcsIGNvbmZpZykge1xuICAgIHZhciB2YWx1ZXMgPSBbXTtcblxuICAgIGV4cG9ydHMuZWFjaChvYmosIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKGZpbHRlckZuLmNhbGwodGhpc0FyZywga2V5LCB2YWx1ZSkpIHtcbiAgICAgICAgICAgIGlmIChjb25maWcua2V5cyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHZhbHVlcy5wdXNoKGtleSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbmZpZy52YWx1ZXMgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZXMucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbHVlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICBrZXk6IGtleVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSwgdGhpc0FyZywgY29uZmlnKTtcblxuICAgIHJldHVybiB2YWx1ZXM7XG59OyIsInZhciBvVG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuLyoqXG4gKiBAY2xhc3MgTHVjLmlzIFxuICogUGFja2FnZSBmb3IgZGV0ZXJtaW5pbmcgdGhlIHR5cGVzIG9mIG9iamVjdHNcbiAqIGl0IGFsc28gaGFzIGFuIEx1Yy5pcy5pc0VtcHR5IGFuZCBMdWMuaXMuaXNGYWxzeSBcbiAqIGZ1bmN0aW9ucy4gIFlvdSBjYW4gc2VlIHRoYXQgd2UgZG9uJ3QgaGF2ZSBhbiBcbiAqIGlzTnVsbCBpc1VuZGVmaW5lZCBvciBpc05hTi4gIFdlIHByZWZlciB0byB1c2U6XG4gXG4gICAgb2JqID09PSBudWxsXG4gICAgb2JqID09PSB1bmRlZmluZWRcbiAgICBpc05hTihvYmopXG5cbiAqIEltIHN1cmUgdGhlcmUgYSBpcyBhIHVzZSBjYXNlIGZvciBpc0Jvb2xlYW5cbiAqIGJ1dCB3ZSB3aWxsIGxlYXZlIHlvdSBvbiB5b3VyIG93biBmb3IgdGhhdC5cbiAqL1xuXG5cbi8qKlxuICogUmV0dXJuIHRydWUgaWYgdGhlIHBhc3NlZCBpbiBvYmplY3QgaXMgb2ZcbiAqIHRoZSB0eXBlIHtAbGluayBBcnJheSBBcnJheX1cbiAqIEBwYXJhbSAge09iamVjdH0gIG9iaiBcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXkob2JqKSB7XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkob2JqKTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgcGFzc2VkIGluIG9iamVjdCBpcyBvZlxuICogdGhlIHR5cGUge0BsaW5rIE9iamVjdCBPYmplY3R9XG4gKiBAcGFyYW0gIHtPYmplY3R9ICBvYmogXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5mdW5jdGlvbiBpc09iamVjdChvYmopIHtcbiAgICByZXR1cm4gb1RvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSc7XG59XG5cbi8qKlxuICogUmV0dXJuIHRydWUgaWYgdGhlIHBhc3NlZCBpbiBvYmplY3QgaXMgb2ZcbiAqIHRoZSB0eXBlIHtAbGluayBGdW5jdGlvbiBGdW5jdGlvbn1cbiAqIEBwYXJhbSAge09iamVjdH0gIG9iaiBcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9Ub1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG59XG5cbi8qKlxuICogUmV0dXJuIHRydWUgaWYgdGhlIHBhc3NlZCBpbiBvYmplY3QgaXMgb2ZcbiAqIHRoZSB0eXBlIHtAbGluayBEYXRlIERhdGV9XG4gKiBAcGFyYW0gIHtPYmplY3R9ICBvYmogXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5mdW5jdGlvbiBpc0RhdGUob2JqKSB7XG4gICAgcmV0dXJuIG9Ub1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cblxuLyoqXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgcGFzc2VkIGluIG9iamVjdCBpcyBvZlxuICogdGhlIHR5cGUge0BsaW5rIFJlZ0V4cCBSZWdFeHB9XG4gKiBAcGFyYW0gIHtPYmplY3R9ICBvYmogXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5mdW5jdGlvbiBpc1JlZ0V4cChvYmopIHtcbiAgICByZXR1cm4gb1RvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgUmVnRXhwXSc7XG59XG5cbi8qKlxuICogUmV0dXJuIHRydWUgaWYgdGhlIHBhc3NlZCBpbiBvYmplY3QgaXMgb2ZcbiAqIHRoZSB0eXBlIHtAbGluayBOdW1iZXIgTnVtYmVyfVxuICogQHBhcmFtICB7T2JqZWN0fSAgb2JqIFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNOdW1iZXIob2JqKSB7XG4gICAgcmV0dXJuIG9Ub1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IE51bWJlcl0nO1xufVxuXG4vKipcbiAqIFJldHVybiB0cnVlIGlmIHRoZSBwYXNzZWQgaW4gb2JqZWN0IGlzIG9mXG4gKiB0aGUgdHlwZSB7QGxpbmsgU3RyaW5nIFN0cmluZ31cbiAqIEBwYXJhbSAge09iamVjdH0gIG9iaiBcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzU3RyaW5nKG9iaikge1xuICAgIHJldHVybiBvVG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBTdHJpbmddJztcbn1cblxuLyoqXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgcGFzc2VkIGluIG9iamVjdCBpcyBvZlxuICogdGhlIHR5cGUgYXJndW1lbnRzLlxuICogXG4gKiBAcGFyYW0gIHtPYmplY3R9ICBvYmogXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5mdW5jdGlvbiBpc0FyZ3VtZW50cyhvYmopIHtcbiAgICByZXR1cm4gb1RvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJndW1lbnRzXSc7XG59XG5cbi8qKlxuICogUmV0dXJuIHRydWUgaWYgdGhlIG9iamVjdCBpcyBmYWxzeSBidXQgbm90IHplcm8uICBJZlxuICogeW91IHdhbnQgZmFsc3kgY2hlY2sgdGhhdCBpbmNsdWRlcyB6ZXJvIHVzZSBhIGdvcmFtIFxuICogaWYgc3RhdGVtZW50IDopXG4gKiBAcGFyYW0gIHtPYmplY3R9ICBvYmpcbiAqIEByZXR1cm4ge0Jvb2xlYW59ICAgICBcbiAqL1xuZnVuY3Rpb24gaXNGYWxzeShvYmopIHtcbiAgICByZXR1cm4gKCFvYmogJiYgb2JqICE9PSAwKTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgb2JqZWN0IGlzIGVtcHR5LlxuICoge30sIFtdLCAnJyxmYWxzZSwgbnVsbCwgdW5kZWZpbmVkLCBOYU4gXG4gKiBBcmUgYWxsIHRyZWF0ZWQgYXMgZW1wdHkuXG4gKiBAcGFyYW0gIHtPYmplY3R9ICBvYmpcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzRW1wdHkob2JqKSB7XG4gICAgdmFyIGVtcHR5ID0gZmFsc2U7XG5cbiAgICBpZiAoaXNGYWxzeShvYmopKSB7XG4gICAgICAgIGVtcHR5ID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXkob2JqKSkge1xuICAgICAgICBlbXB0eSA9IG9iai5sZW5ndGggPT09IDA7XG4gICAgfSBlbHNlIGlmIChpc09iamVjdChvYmopKSB7XG4gICAgICAgIGVtcHR5ID0gT2JqZWN0LmtleXMob2JqKS5sZW5ndGggPT09IDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVtcHR5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBpc0FycmF5OiBpc0FycmF5LFxuICAgIGlzT2JqZWN0OiBpc09iamVjdCxcbiAgICBpc0Z1bmN0aW9uOiBpc0Z1bmN0aW9uLFxuICAgIGlzRGF0ZTogaXNEYXRlLFxuICAgIGlzU3RyaW5nOiBpc1N0cmluZyxcbiAgICBpc051bWJlcjogaXNOdW1iZXIsXG4gICAgaXNSZWdFeHA6IGlzUmVnRXhwLFxuICAgIGlzQXJndW1lbnRzOiBpc0FyZ3VtZW50cyxcbiAgICBpc0ZhbHN5OiBpc0ZhbHN5LFxuICAgIGlzRW1wdHk6IGlzRW1wdHlcbn07IiwiLyoqXG4gKiBAbGljZW5zZSBodHRwczovL3Jhdy5naXRodWIuY29tL2pveWVudC9ub2RlL3YwLjEwLjExL0xJQ0VOU0VcbiAqIE5vZGUganMgbGljZW5jZS4gRXZlbnRFbWl0dGVyIHdpbGwgYmUgaW4gdGhlIGNsaWVudFxuICogb25seSBjb2RlLlxuICovXG5cbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG5cbi8qKlxuICogQGNsYXNzIEx1Yy5FdmVudEVtaXR0ZXJcbiAqIFRoZSB3b25kZXJmdWwgZXZlbnQgZW1taXRlciB0aGF0IGNvbWVzIHdpdGggbm9kZSxcbiAqIHRoYXQgd29ya3MgaW4gdGhlIHN1cHBvcnRlZCBicm93c2Vycy5cbiAqIFtodHRwOi8vbm9kZWpzLm9yZy9hcGkvZXZlbnRzLmh0bWxdKGh0dHA6Ly9ub2RlanMub3JnL2FwaS9ldmVudHMuaHRtbClcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgICAvL3B1dCBpbiBmaXggZm9yIElFIDkgYW5kIGJlbG93XG4gICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICBnID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzZWxmLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuICAgICAgICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcblxuICAgIHNlbGYub24odHlwZSwgZyk7XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyOyIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnByb2Nlc3MubmV4dFRpY2sgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYW5TZXRJbW1lZGlhdGUgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5zZXRJbW1lZGlhdGU7XG4gICAgdmFyIGNhblBvc3QgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5wb3N0TWVzc2FnZSAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lclxuICAgIDtcblxuICAgIGlmIChjYW5TZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiB3aW5kb3cuc2V0SW1tZWRpYXRlKGYpIH07XG4gICAgfVxuXG4gICAgaWYgKGNhblBvc3QpIHtcbiAgICAgICAgdmFyIHF1ZXVlID0gW107XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICBpZiAoZXYuc291cmNlID09PSB3aW5kb3cgJiYgZXYuZGF0YSA9PT0gJ3Byb2Nlc3MtdGljaycpIHtcbiAgICAgICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBpZiAocXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZm4gPSBxdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICBmbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgICAgICBxdWV1ZS5wdXNoKGZuKTtcbiAgICAgICAgICAgIHdpbmRvdy5wb3N0TWVzc2FnZSgncHJvY2Vzcy10aWNrJywgJyonKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgc2V0VGltZW91dChmbiwgMCk7XG4gICAgfTtcbn0pKCk7XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn1cblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuIiwiKGZ1bmN0aW9uKHByb2Nlc3Mpe2lmICghcHJvY2Vzcy5FdmVudEVtaXR0ZXIpIHByb2Nlc3MuRXZlbnRFbWl0dGVyID0gZnVuY3Rpb24gKCkge307XG5cbnZhciBFdmVudEVtaXR0ZXIgPSBleHBvcnRzLkV2ZW50RW1pdHRlciA9IHByb2Nlc3MuRXZlbnRFbWl0dGVyO1xudmFyIGlzQXJyYXkgPSB0eXBlb2YgQXJyYXkuaXNBcnJheSA9PT0gJ2Z1bmN0aW9uJ1xuICAgID8gQXJyYXkuaXNBcnJheVxuICAgIDogZnVuY3Rpb24gKHhzKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeHMpID09PSAnW29iamVjdCBBcnJheV0nXG4gICAgfVxuO1xuZnVuY3Rpb24gaW5kZXhPZiAoeHMsIHgpIHtcbiAgICBpZiAoeHMuaW5kZXhPZikgcmV0dXJuIHhzLmluZGV4T2YoeCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoeCA9PT0geHNbaV0pIHJldHVybiBpO1xuICAgIH1cbiAgICByZXR1cm4gLTE7XG59XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW5cbi8vIDEwIGxpc3RlbmVycyBhcmUgYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaFxuLy8gaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG4vL1xuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbnZhciBkZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCF0aGlzLl9ldmVudHMpIHRoaXMuX2V2ZW50cyA9IHt9O1xuICB0aGlzLl9ldmVudHMubWF4TGlzdGVuZXJzID0gbjtcbn07XG5cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNBcnJheSh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSlcbiAgICB7XG4gICAgICBpZiAoYXJndW1lbnRzWzFdIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgYXJndW1lbnRzWzFdOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5jYXVnaHQsIHVuc3BlY2lmaWVkICdlcnJvcicgZXZlbnQuXCIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGlmICghdGhpcy5fZXZlbnRzKSByZXR1cm4gZmFsc2U7XG4gIHZhciBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBpZiAoIWhhbmRsZXIpIHJldHVybiBmYWxzZTtcblxuICBpZiAodHlwZW9mIGhhbmRsZXIgPT0gJ2Z1bmN0aW9uJykge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuXG4gIH0gZWxzZSBpZiAoaXNBcnJheShoYW5kbGVyKSkge1xuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICAgIHZhciBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBsaXN0ZW5lcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59O1xuXG4vLyBFdmVudEVtaXR0ZXIgaXMgZGVmaW5lZCBpbiBzcmMvbm9kZV9ldmVudHMuY2Ncbi8vIEV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCgpIGlzIGFsc28gZGVmaW5lZCB0aGVyZS5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIGxpc3RlbmVyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdhZGRMaXN0ZW5lciBvbmx5IHRha2VzIGluc3RhbmNlcyBvZiBGdW5jdGlvbicpO1xuICB9XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT0gXCJuZXdMaXN0ZW5lcnNcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJzXCIuXG4gIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pIHtcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgfSBlbHNlIGlmIChpc0FycmF5KHRoaXMuX2V2ZW50c1t0eXBlXSkpIHtcblxuICAgIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gICAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgICB2YXIgbTtcbiAgICAgIGlmICh0aGlzLl9ldmVudHMubWF4TGlzdGVuZXJzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbSA9IHRoaXMuX2V2ZW50cy5tYXhMaXN0ZW5lcnM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtID0gZGVmYXVsdE1heExpc3RlbmVycztcbiAgICAgIH1cblxuICAgICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHNlbGYub24odHlwZSwgZnVuY3Rpb24gZygpIHtcbiAgICBzZWxmLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0pO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICgnZnVuY3Rpb24nICE9PSB0eXBlb2YgbGlzdGVuZXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3JlbW92ZUxpc3RlbmVyIG9ubHkgdGFrZXMgaW5zdGFuY2VzIG9mIEZ1bmN0aW9uJyk7XG4gIH1cblxuICAvLyBkb2VzIG5vdCB1c2UgbGlzdGVuZXJzKCksIHNvIG5vIHNpZGUgZWZmZWN0IG9mIGNyZWF0aW5nIF9ldmVudHNbdHlwZV1cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSkgcmV0dXJuIHRoaXM7XG5cbiAgdmFyIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzQXJyYXkobGlzdCkpIHtcbiAgICB2YXIgaSA9IGluZGV4T2YobGlzdCwgbGlzdGVuZXIpO1xuICAgIGlmIChpIDwgMCkgcmV0dXJuIHRoaXM7XG4gICAgbGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgaWYgKGxpc3QubGVuZ3RoID09IDApXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICB9IGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSA9PT0gbGlzdGVuZXIpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGRvZXMgbm90IHVzZSBsaXN0ZW5lcnMoKSwgc28gbm8gc2lkZSBlZmZlY3Qgb2YgY3JlYXRpbmcgX2V2ZW50c1t0eXBlXVxuICBpZiAodHlwZSAmJiB0aGlzLl9ldmVudHMgJiYgdGhpcy5fZXZlbnRzW3R5cGVdKSB0aGlzLl9ldmVudHNbdHlwZV0gPSBudWxsO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICBpZiAoIXRoaXMuX2V2ZW50cykgdGhpcy5fZXZlbnRzID0ge307XG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKSB0aGlzLl9ldmVudHNbdHlwZV0gPSBbXTtcbiAgaWYgKCFpc0FycmF5KHRoaXMuX2V2ZW50c1t0eXBlXSkpIHtcbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgfVxuICByZXR1cm4gdGhpcy5fZXZlbnRzW3R5cGVdO1xufTtcblxufSkocmVxdWlyZShcIl9fYnJvd3NlcmlmeV9wcm9jZXNzXCIpKSIsInZhciBhcnJheVNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLFxuICAgIGNvbXBhcmUgPSByZXF1aXJlKCcuL2NvbXBhcmUnKSxcbiAgICBpcyA9IHJlcXVpcmUoJy4vaXMnKSxcbiAgICBjcmVhdGVCb3VuZENvbXBhcmVGbiA9IGNvbXBhcmUuY3JlYXRlQm91bmRDb21wYXJlRm47XG5cbmZ1bmN0aW9uIF9jcmVhdGVJdGVyYXRvckZuKGZuLCBjb25maWcpIHtcbiAgICBpZihpcy5pc0Z1bmN0aW9uKGZuKSAmJiAoY29uZmlnID8gY29uZmlnLnR5cGUgIT09ICdzdHJpY3QnIDogdHJ1ZSkpIHtcbiAgICAgICAgcmV0dXJuIGNvbmZpZyA/IGZuLmJpbmQoY29uZmlnKSA6IGZuO1xuICAgIH1cblxuICAgIHJldHVybiBjcmVhdGVCb3VuZENvbXBhcmVGbihmbiwgY29uZmlnKTtcbn1cblxuZnVuY3Rpb24gX2NyZWF0ZUl0ZXJhdG9yTm90Rm4oZm4sIGNvbmZpZykge1xuICAgIHZhciBmdW5jdGlvblRvTm90ID0gX2NyZWF0ZUl0ZXJhdG9yRm4oZm4sIGNvbmZpZyk7XG4gICAgICAgIFxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICFmdW5jdGlvblRvTm90LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbn1cblxuXG4vKipcbiAqIEBjbGFzcyBMdWMuQXJyYXkgXG4gKiBQYWNrYWdlIGZvciBBcnJheSBtZXRob2RzLiA8YnI+XG4gKiBcbiAqIFRoZXJlIGEgbG90IG9mIGZ1bmN0aW9ucyBpbiB0aGlzIHBhY2thZ2UgYnV0IGFsbCBvZiB0aGVcbiAqIHJlbW92ZVxcKiAvIGZpbmRcXCogbWV0aG9kcyBmb2xsb3cgdGhlIHNhbWUgYXBpLiAgXFwqQWxsIGZ1bmN0aW9ucyB3aWxsIHJldHVybiBhbiBhcnJheSBvZiByZW1vdmVkIG9yIGZvdW5kXG4gKiBpdGVtcyBhbmQgZmFsc2UgaWYgbm9uZSBhcmUgZm91bmQuICBUaGUgaXRlbXMgd2lsbCBiZSBhZGRlZCB0byB0aGUgYXJyYXkgaW4gdGhlIG9yZGVyIHRoZXkgYXJlXG4gKiBmb3VuZC4gIFxcKkZpcnN0IGZ1bmN0aW9ucyB3aWxsIHJldHVybiB0aGUgZmlyc3QgaXRlbSBhbmQgc3RvcCBpdGVyYXRpbmcgYWZ0ZXIgdGhhdCwgaWYgbm9uZVxuICogIGlzIGZvdW5kIGZhbHNlIGlzIHJldHVybmVkLiAgcmVtb3ZlXFwqIGZ1bmN0aW9ucyB3aWxsIGRpcmVjdGx5IGNoYW5nZSB0aGUgcGFzc2VkIGluIGFycmF5LlxuICogIFxcKk5vdCBmdW5jdGlvbnMgb25seSBkbyB0aGUgZm9sbG93aW5nIGFjdGlvbnMgaWYgdGhlIGNvbXBhcmlzb24gaXMgbm90IHRydWUuXG4gKiAgQWxsIHJlbW92ZVxcKiAvIGZpbmRcXCogdGFrZSB0aGUgZm9sbG93aW5nIGFwaTogYXJyYXksIG9iamVjdFRvQ29tcGFyZU9ySXRlcmF0b3IsIGNvbXBhcmVDb25maWdPclRoaXNBcmcgZm9yIGV4YW1wbGU6XG4gKlxuICAgIEx1Yy5BcnJheS5maW5kRmlyc3QoWzEsMiwzLCB7fV0sIHt9KTtcbiAgICA+T2JqZWN0IHt9XG5cbiAgICBMdWMuQXJyYXkuZmluZEZpcnN0KFsxLDIsMyx7fV0sIHt9LCB7dHlwZTogJ3N0cmljdCd9KTtcbiAgICA+ZmFsc2VcblxuICAgIEx1Yy5BcnJheS5maW5kRmlyc3QoWzEsMiwzLHt9XSwgZnVuY3Rpb24odmFsLCBpbmRleCwgYXJyYXkpe1xuICAgICAgICByZXR1cm4gdmFsID09PSAzIHx8IHRoaXMubnVtID09PSB2YWw7XG4gICAgfSwge251bTogMX0pO1xuICAgID4xXG4gIFxuICogVGhlcmUgYWxzbyBtYW55IGZpbmRcXCpPYmplY3QsIHJlbW92ZVxcKk9iamVjdCBtZXRob2RzIHRoZXkgYWxsIGp1c3QgdGFrZSBhbiBhcnJheSBhc1xuICogdGhlIG9ubHkgcGFyYW1ldGVyIGFuZCBmb2xsb3cgdGhlIHNhbWUgZmluZFxcKiwgcmVtb3ZlXFwqIGNvdW50ZXJwYXJ0cy4gIEV2ZXJ5IHB1YmxpY1xuICogbWV0aG9kIG9mIEx1Yy5pcyBhdmFpbGFibGUgaXQgdXNlcyB0aGUgZm9sbG93aW5nIGdyYW1tZXIgTHVjLkFycmF5W1wibWV0aG9kTmFtZVwiXCJpc01ldGhvZE5hbWVcIl1cbiAqXG4gICAgICBMdWMuQXJyYXkuZmluZEFsbE5vdEVtcHR5KFtmYWxzZSwgdHJ1ZSwgbnVsbCwgdW5kZWZpbmVkLCAwLCAnJywgW10sIFsxXV0pXG4gICAgICA+IFt0cnVlLCAwLCBbMV1dXG5cbiAgICAgIEx1Yy5BcnJheS5maW5kQWxsTm90RmFsc3koW2ZhbHNlLCB0cnVlLCBudWxsLCB1bmRlZmluZWQsIDAsICcnLCBbXSwgWzFdXSlcbiAgICAgID4gW3RydWUsIDAsIFtdLCBbMV1dXG5cbiAgICAgIEx1Yy5BcnJheS5maW5kRmlyc3RTdHJpbmcoWzEsMiwzLCc1J10pXG4gICAgICA+XCI1XCJcbiAgICAgIEx1Yy5BcnJheS5maW5kRmlyc3ROb3RTdHJpbmcoWzEsMiwzLCc1J10pXG4gICAgICA+MVxuICAgICAgdmFyIGFyciA9IFsxLDIsMywnNSddO1xuICAgICAgTHVjLkFycmF5LnJlbW92ZUFsbE5vdFN0cmluZyhhcnIpO1xuICAgICAgPlsxLDIsM11cbiAgICAgIGFyclxuICAgICAgPltcIjVcIl1cbiAqXG4gKlxuICogS2VlcCBpbiBtaW5kIHRoYXQgTHVjIGlzIG9wdGlvbmFsbHkgcGFja2FnZWQgd2l0aCBlczUgc2hpbSBzbyB5b3UgY2FuIHRhcmdldCBub24tZXM1IGJyb3dzZXJzLlxuICogSXQgY29tZXMgd2l0aCB5b3VyIGZhdm9yaXRlIHtAbGluayBBcnJheSBBcnJheX0gbWV0aG9kcyBzdWNoIGFzIEFycmF5LmZvckVhY2gsIEFycmF5LmZpbHRlciwgQXJyYXkuc29tZSwgQXJyYXkuZXZlcnkgQXJyYXkucmVkdWNlUmlnaHQgLi5cbiAqXG4gKiBBbHNvIGRvbid0IGZvcmdldCBhYm91dCBMdWMuQXJyYXkuZWFjaCBhbmQgTHVjLkFycmF5LnRvQXJyYXksIHRoZXkgYXJlIGdyZWF0IHV0aWxpdHkgbWV0aG9kc1xuICogdGhhdCBhcmUgdXNlZCBhbGwgb3ZlciB0aGUgZnJhbWV3b3JrLlxuICogXG4gKi9cblxuLyoqXG4gKiBUdXJuIHRoZSBwYXNzZWQgaW4gaXRlbSBpbnRvIGFuIGFycmF5IGlmIGl0XG4gKiBpc24ndCBvbmUgYWxyZWFkeSwgaWYgdGhlIGl0ZW0gaXMgYW4gYXJyYXkganVzdCByZXR1cm4gaXQuICBcbiAqIEl0IHJldHVybnMgYW4gZW1wdHkgYXJyYXkgaWYgaXRlbSBpcyBudWxsIG9yIHVuZGVmaW5lZC5cbiAqIElmIGl0IGlzIGp1c3QgYSBzaW5nbGUgaXRlbSByZXR1cm4gYW4gYXJyYXkgY29udGFpbmluZyB0aGUgaXRlbS5cbiAqIFxuICAgIEx1Yy5BcnJheS50b0FycmF5KClcbiAgICA+W11cbiAgICBMdWMuQXJyYXkudG9BcnJheShudWxsKVxuICAgID5bXVxuICAgIEx1Yy5BcnJheS50b0FycmF5KDEpXG4gICAgPlsxXVxuICAgIEx1Yy5BcnJheS50b0FycmF5KFsxLDJdKVxuICAgID5bMSwgMl1cbiAqXG4gKiBAcGFyYW0gIHtPYmplY3R9IGl0ZW0gaXRlbSB0byB0dXJuIGludG8gYW4gYXJyYXkuXG4gKiBAcmV0dXJuIHRoZSBhcnJheVxuICovXG5mdW5jdGlvbiB0b0FycmF5KGl0ZW0pIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShpdGVtKSkge1xuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICB9XG4gICAgcmV0dXJuIChpdGVtID09PSBudWxsIHx8IGl0ZW0gPT09IHVuZGVmaW5lZCkgPyBbXSA6IFtpdGVtXTtcbn1cblxuLyoqXG4gKiBSdW5zIGFuIEFycmF5LmZvckVhY2ggYWZ0ZXIgY2FsbGluZyBMdWMuQXJyYXkudG9BcnJheSBvbiB0aGUgaXRlbS5cbiAqIEBwYXJhbSAge09iamVjdH0gICBpdGVtXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gZm4gICAgICAgIFxuICogQHBhcmFtICB7T2JqZWN0fSAgIGNvbnRleHQgICBcbiAqXG4gIEl0IGlzIHZlcnkgdXNlZnVsIGZvciBzZXR0aW5nIHVwIGZsZXhhYmxlIGFwaSdzIHRoYXQgY2FuIGhhbmRsZSBub25lIG9uZSBvciBtYW55LlxuXG4gICAgTHVjLkFycmF5LmVhY2godGhpcy5pdGVtcywgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICB0aGlzLl9hZGRJdGVtKGl0ZW0pO1xuICAgIH0pO1xuXG4gICAgdnMuXG5cbiAgICBpZihBcnJheS5pc0FycmF5KHRoaXMuaXRlbXMpKXtcbiAgICAgICAgdGhpcy5pdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgIHRoaXMuX2FkZEl0ZW0oaXRlbSk7XG4gICAgICAgIH0pXG4gICAgfVxuICAgIGVsc2UgaWYodGhpcy5pdGVtcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuX2FkZEl0ZW0odGhpcy5pdGVtcyk7XG4gICAgfVxuXG4gKi9cbmZ1bmN0aW9uIGVhY2goaXRlbSwgZm4sIGNvbnRleHQpIHtcbiAgICB2YXIgYXJyID0gdG9BcnJheShpdGVtKTtcbiAgICByZXR1cm4gYXJyLmZvckVhY2guY2FsbChhcnIsIGZuLCBjb250ZXh0KTtcbn1cblxuLyoqXG4gKiBJbnNlcnQgb3IgYXBwZW5kIHRoZSBzZWNvbmQgYXJyYXkvYXJndW1lbnRzIGludG8gdGhlXG4gKiBmaXJzdCBhcnJheS9hcmd1bWVudHMuICBUaGlzIG1ldGhvZCBkb2VzIG5vdCBhbHRlclxuICogdGhlIHBhc3NlZCBpbiBhcnJheS9hcmd1bWVudHMuXG4gKiBcbiAqIEBwYXJhbSAge0FycmF5L2FyZ3VtZW50c30gZmlyc3RBcnJheU9yQXJnc1xuICogQHBhcmFtICB7QXJyYXkvYXJndW1lbnRzfSBzZWNvbmRBcnJheU9yQXJnc1xuICogQHBhcmFtICB7TnVtYmVyL3RydWV9IGluZGV4T3JBcHBlbmQgdHJ1ZSB0byBhcHBlbmQgXG4gKiB0aGUgc2Vjb25kIGFycmF5IHRvIHRoZSBlbmQgb2YgdGhlIGZpcnN0IG9uZS4gIElmIGl0IGlzIGEgbnVtYmVyXG4gKiBpbnNlcnQgdGhlIHNlY29uZEFycmF5IGludG8gdGhlIGZpcnN0IG9uZSBhdCB0aGUgcGFzc2VkIGluIGluZGV4LlxuICAgXG4gICAgTHVjLkFycmF5Lmluc2VydChbMCw0XSwgWzEsMiwzXSwgMSk7XG4gICAgPlswLCAxLCAyLCAzLCA0XVxuICAgIEx1Yy5BcnJheS5pbnNlcnQoWzAsNF0sIFsxLDIsM10sIHRydWUpO1xuICAgID5bMCwgNCwgMSwgMiwgM11cbiAgICBMdWMuQXJyYXkuaW5zZXJ0KFswLDRdLCBbMSwyLDNdLCAwKTtcbiAgICA+WzEsIDIsIDMsIDAsIDRdXG4gXG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqL1xuZnVuY3Rpb24gaW5zZXJ0KGZpcnN0QXJyYXlPckFyZ3MsIHNlY29uZEFycmF5T3JBcmdzLCBpbmRleE9yQXBwZW5kKSB7XG4gICAgdmFyIGZpcnN0QXJyYXkgPSBhcnJheVNsaWNlLmNhbGwoZmlyc3RBcnJheU9yQXJncyksXG4gICAgICAgIHNlY29uZEFycmF5ID0gYXJyYXlTbGljZS5jYWxsKHNlY29uZEFycmF5T3JBcmdzKSxcbiAgICAgICAgc3BsaWNlQXJncztcblxuICAgIGlmKGluZGV4T3JBcHBlbmQgPT09IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIGZpcnN0QXJyYXkuY29uY2F0KHNlY29uZEFycmF5KTtcbiAgICB9XG5cbiAgICBzcGxpY2VBcmdzID0gW2luZGV4T3JBcHBlbmQsIDBdLmNvbmNhdChzZWNvbmRBcnJheSk7XG4gICAgZmlyc3RBcnJheS5zcGxpY2UuYXBwbHkoZmlyc3RBcnJheSwgc3BsaWNlQXJncyk7XG4gICAgcmV0dXJuIGZpcnN0QXJyYXk7XG59XG5cbi8qKlxuICogUmVtb3ZlIGFuIGl0ZW0gZnJvbSBhbiB0aGUgcGFzc2VkIGluIGFyclxuICogZnJvbSB0aGUgaW5kZXguXG4gKiBAcGFyYW0gIHtBcnJheX0gYXJyXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IGluZGV4XG4gKiBAcmV0dXJuIHtPYmplY3R9IHRoZSBpdGVtIHJlbW92ZWQuXG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUF0SW5kZXgoYXJyLCBpbmRleCkge1xuICAgIHZhciBpdGVtID0gYXJyW2luZGV4XTtcbiAgICBhcnIuc3BsaWNlKGluZGV4LCAxKTtcbiAgICByZXR1cm4gaXRlbTtcbn1cblxuZnVuY3Rpb24gX3JlbW92ZUZpcnN0KGFyciwgZm4pIHtcbiAgICB2YXIgcmVtb3ZlZCA9IGZhbHNlO1xuXG4gICAgYXJyLnNvbWUoZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XG4gICAgICAgIGlmIChmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSB7XG4gICAgICAgICAgICByZW1vdmVkID0gcmVtb3ZlQXRJbmRleChhcnIsIGluZGV4KTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVtb3ZlZDtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGZpcnN0IGl0ZW0gZnJvbSB0aGUgcGFzc2VkIGluIGFycmF5XG4gKiB0aGF0IG1hdGNoZXMgdGhlIHBhc3NlZCBpbiBvYmplY3QuICBJbnN0ZWFkIG9mIFxuICogY29tcGFyaW5nIGFuIG9iamVjdCBhbiBpdGVyYXRvciBmdW5jdGlvbiBjYW4gYmVcbiAqIHVzZWQuXG4gKiBcbiAqIEBwYXJhbSAge0FycmF5fSBhcnJcbiAqIEBwYXJhbSAge0FueS9GdW5jdGlvbn0gb2JqZWN0T3JJdGVyYXRvciBpZiB0aGUgdmFsdWVcbiAqIGlzIHtAbGluayBMdWMjY29tcGFyZSBlcXVhbH0gdG8gb3IgdGhlIGl0ZXJhdG9yIHJldHVybnMgdHJ1ZSByZW1vdmUgdGhlIFxuICogb2JqZWN0IGZyb20gdGhlIGFycmF5LlxuICogXG4gKiBJZiBhbiBpdGVyYXRvciBmdW5jdGlvbiBpcyBwYXNzZWQgaXQgd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGUgZm9sbG93aW5nIFxuICogcGFyYW1ldGVycy4gIFRoZSBzYW1lIHBhcmFtZXRlciB0byBBcnJheS5mb3JFYWNoXG4gKiBcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3RPckl0ZXJhdG9yLnZhbHVlIFxuICogQHBhcmFtIHtOdW1iZXJ9IG9iamVjdE9ySXRlcmF0b3IubnVtYmVyXG4gKiBAcGFyYW0ge0FycmF5fSBvYmplY3RPckl0ZXJhdG9yLmFycmF5XG4gKlxuICogXG4gKiBAcGFyYW0gIHtPYmplY3R9IFtjb25maWdPcnRoaXNBcmddXG4gKiBcbiAqIHRoaXNBcmcgZm9yIHRoZSBpdGVyYXRvciBmdW5jdGlvbiBhbiBpdGVyYXRvciBpc1xuICogdXNlZC5cbiAqIFxuICogT3B0aW9uIGNvbmZpZyBvYmplY3QgZm9yIEx1Yy5jb21wYXJlIGlmIGFuIGl0ZXJhdG9yXG4gKiBmdW5jdGlvbiBpcyBub3QgcGFzc2VkIGluLiAgSWYgeW91IHdhbnQgdG8gYWN0dWFsbHlcbiAqIGRvIGEgZGlyZWN0IGVxdWFsaXR5IGNvbXBhcmlzb24gb24gYSBmdW5jdGlvbiBpbnN0ZWFkIG9mXG4gKiB1c2luZyBpdCBhcyBhbiBpdGVyYXRvciBwYXNzIGluIHt0eXBlOiAnc3RyaWN0J31cbiAqIFxuICogQHJldHVybiB7T2JqZWN0fSB0aGUgb2JqZWN0IHRoYXQgd2FzIHJlbW92ZWRcbiAqIGZhbHNlIGlmIG5vIG9iamVjdCB3YXMgcmVtb3ZlZDtcbiAqL1xuZnVuY3Rpb24gcmVtb3ZlRmlyc3QoYXJyLCBvYmosIGNvbmZpZykge1xuICAgIHZhciBmbiA9IF9jcmVhdGVJdGVyYXRvckZuKG9iaiwgY29uZmlnKTtcbiAgICByZXR1cm4gX3JlbW92ZUZpcnN0KGFyciwgZm4pO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgZmlyc3QgaXRlbSBmcm9tIHRoZSBwYXNzZWQgaW4gQXJyYXlcbiAqIHRoYXQgZG9lcyBub3QgbWF0Y2ggdGhlIHBhc3NlZCBpbiBvYmplY3QuXG4gKiBcbiAqIEBwYXJhbSAge0FycmF5fSBhcnJcbiAqIEBwYXJhbSAge0FueX0gb2JqZWN0XG4gKiBAcGFyYW0gIHtPYmplY3R9IFtjb25maWddIFxuICogQHBhcmFtIHtCb29sZWFufSBbY29uZmlnLnNoYWxsb3ddIGRlZmF1bHRzIHRvIHRydWVcbiAqIHBhc3MgaW4gZmFsc2UgdG8gZG8gYSBkaXJlY3QgZXF1YWx0eSBjb21wYXJpc29uXG4gKiBmb3IgQXJyYXlzIE9iamVjdHMgb3IgRmFsc3lzLlxuICogXG4gKiBAcmV0dXJuIHtPYmplY3R9IHRoaXMgb2JqZWN0IHRoYXQgd2FzIHJlbW92ZWRcbiAqIGZhbHNlIGlmIG5vIG9iamVjdCB3YXMgcmVtb3ZlZDtcbiAqL1xuZnVuY3Rpb24gcmVtb3ZlRmlyc3ROb3QoYXJyLCBvYmosIGNvbmZpZykge1xuICAgIHZhciBmbiA9IF9jcmVhdGVJdGVyYXRvck5vdEZuKG9iaiwgY29uZmlnKTtcbiAgICByZXR1cm4gX3JlbW92ZUZpcnN0KGFyciwgZm4pO1xufVxuXG5cbmZ1bmN0aW9uIF9yZW1vdmVBbGwoYXJyLCBmbikge1xuICAgIHZhciBpbmRleHNUb1JlbW92ZSA9IFtdLFxuICAgICAgICByZW1vdmVkID0gW107XG5cbiAgICBhcnIuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcbiAgICAgICAgaWYgKGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpIHtcbiAgICAgICAgICAgIGluZGV4c1RvUmVtb3ZlLnVuc2hpZnQoaW5kZXgpO1xuICAgICAgICAgICAgcmVtb3ZlZC5wdXNoKHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgaW5kZXhzVG9SZW1vdmUuZm9yRWFjaChmdW5jdGlvbihpbmRleCl7XG4gICAgICAgIHJlbW92ZUF0SW5kZXgoYXJyLCBpbmRleCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVtb3ZlZDtcbn1cblxuLyoqXG4gKiBTYW1lIGFwaSBhcyBMdWMuQXJyYXkucmVtb3ZlQWxsIGV4Y2VwdFxuICogcmVtb3ZlIHRoZSBpdGVtcyB0aGF0IGFyZSBub3QgZXF1YWwgdG8gdGhlIHBhc3NlZCBpblxuICogb2JqZWN0LlxuICogXG4gKiBAcGFyYW0gIHtBcnJheX0gYXJyXG4gKiBAcGFyYW0gIHtBbnl9IG9iamVjdFxuICogQHBhcmFtICB7T2JqZWN0fSBbY29uZmlnXSBCeSBkZWZhdWx0IHNoYWxsb3cgY29tcGFyZSB3aWxsXG4gKiBiZSB1c2VkIGZvciBPYmplY3RzIGFuZCBBcnJheXMgcGFzc2VkIGluIHRydWUgdG8gZG9cbiAqIGEgPT09IGNvbXBhcmlzb24uXG4gKiBcbiAqIEByZXR1cm4ge09iamVjdFtdfSAgQW4gYXJyYXkgb2YgaXRlbXMgcmVtb3ZlZFxuICogZmFsc2UgaWYgbm9uZSBhcmUgcmVtb3ZlZC5cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlQWxsTm90KGFyciwgb2JqLCBjb25maWcpIHtcbiAgICB2YXIgZm4gPSBfY3JlYXRlSXRlcmF0b3JOb3RGbihvYmosIGNvbmZpZyk7XG4gICAgcmV0dXJuIF9yZW1vdmVBbGwoYXJyLCBmbik7XG59XG5cbi8qKlxuICogRmluZCB0aGUgZmlyc3QgYWxsIGl0ZW1zIHRoYXQgYXJlIGVxdWFsIHRvIHRoZVxuICogcGFzc2VkIGluIG9iamVjdC4gQnkgZGVmdWFsdCBPYmplY3RzIGFuZCBBcnJheXMgYXJlIFxuICogY29tcGFyZWQgd2l0aCBhIHNoYWxsb3cgY29tcGFyaXNvbi5cbiAqIFxuICogQHBhcmFtICB7QXJyYXl9IGFyclxuICogQHBhcmFtICB7QW55fSBvYmplY3RcbiAqIEBwYXJhbSAge09iamVjdH0gW2NvbmZpZ10gXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtjb25maWcuc2hhbGxvd10gZGVmYXVsdHMgdG8gdHJ1ZVxuICogcGFzcyBpbiBmYWxzZSB0byBkbyBhIGRpcmVjdCBlcXVhbHR5IGNvbXBhcmlzb25cbiAqIGZvciBBcnJheXMgT2JqZWN0cyBvciBGYWxzeXMuXG4gKiBcbiAqIEByZXR1cm4ge09iamVjdFtdfSAgQW4gYXJyYXkgb2YgaXRlbXMgcmVtb3ZlZFxuICogZmFsc2UgaWYgbm9uZSBhcmUgcmVtb3ZlZC5cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlQWxsKGFyciwgb2JqLCBjb25maWcpIHtcbiAgICB2YXIgZm4gPSBfY3JlYXRlSXRlcmF0b3JGbihvYmosIGNvbmZpZyk7XG4gICAgcmV0dXJuIF9yZW1vdmVBbGwoYXJyLCBmbik7XG59XG5cbmZ1bmN0aW9uIF9maW5kRmlyc3QoYXJyLCBmbikge1xuICAgIHZhciBpdGVtID0gZmFsc2U7XG4gICAgYXJyLnNvbWUoZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XG4gICAgICAgIGlmIChmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSB7XG4gICAgICAgICAgICBpdGVtID0gYXJyW2luZGV4XTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gaXRlbTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gdGhlIGZpcnN0IGl0ZW0gZnJvbSB0aGUgcGFzc2VkIGluIEFycmF5XG4gKiB0aGF0ICBtYXRjaGVzIHRoZSBwYXNzZWQgaW4gb2JqZWN0LlxuICogXG4gKiBAcGFyYW0gIHtBcnJheX0gYXJyXG4gKiBAcGFyYW0gIHtBbnl9IG9iamVjdFxuICogQHBhcmFtICB7T2JqZWN0fSBbY29uZmlnXSBcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW2NvbmZpZy5zaGFsbG93XSBkZWZhdWx0cyB0byB0cnVlXG4gKiBwYXNzIGluIGZhbHNlIHRvIGRvIGEgZGlyZWN0IGVxdWFsdHkgY29tcGFyaXNvblxuICogZm9yIEFycmF5cyBPYmplY3RzIG9yIEZhbHN5cy5cbiAqIFxuICogQHJldHVybiB7T2JqZWN0fSB0aGlzIG9iamVjdCB0aGF0IHdhcyByZW1vdmVkXG4gKiBmYWxzZSBpZiBubyBvYmplY3Qgd2FzIHJlbW92ZWQ7XG4gKi9cbmZ1bmN0aW9uIGZpbmRGaXJzdChhcnIsIG9iaiwgY29uZmlnKSB7XG4gICAgdmFyIGZuID0gX2NyZWF0ZUl0ZXJhdG9yRm4ob2JqLCBjb25maWcpO1xuICAgIHJldHVybiBfZmluZEZpcnN0KGFyciwgZm4pO1xufVxuXG4vKipcbiAqIFJldHVybiB0aGUgZmlyc3QgaXRlbSBmcm9tIHRoZSBwYXNzZWQgaW4gQXJyYXlcbiAqIHRoYXQgZG9lcyBub3QgbWF0Y2ggdGhlIHBhc3NlZCBpbiBvYmplY3QuXG4gKiBcbiAqIEBwYXJhbSAge0FycmF5fSBhcnJcbiAqIEBwYXJhbSAge0FueX0gb2JqZWN0XG4gKiBAcGFyYW0gIHtPYmplY3R9IFtjb25maWddIFxuICogQHBhcmFtIHtCb29sZWFufSBbY29uZmlnLnNoYWxsb3ddIGRlZmF1bHRzIHRvIHRydWVcbiAqIHBhc3MgaW4gZmFsc2UgdG8gZG8gYSBkaXJlY3QgZXF1YWx0eSBjb21wYXJpc29uXG4gKiBmb3IgQXJyYXlzIE9iamVjdHMgb3IgRmFsc3lzLlxuICogXG4gKiBAcmV0dXJuIHtPYmplY3R9IHRoaXMgb2JqZWN0IHRoYXQgd2FzIHJlbW92ZWRcbiAqIGZhbHNlIGlmIG5vIG9iamVjdCB3YXMgcmVtb3ZlZDtcbiAqL1xuZnVuY3Rpb24gZmluZEZpcnN0Tm90KGFyciwgb2JqLCBjb25maWcpIHtcbiAgICB2YXIgZm4gPSBfY3JlYXRlSXRlcmF0b3JOb3RGbihvYmosIGNvbmZpZyk7XG4gICAgcmV0dXJuIF9maW5kRmlyc3QoYXJyLCBmbik7XG59XG5cbmZ1bmN0aW9uIF9maW5kQWxsKGFyciwgZm4pIHtcbiAgICB2YXIgZm91bmQgPSBhcnIuZmlsdGVyKGZuKTtcbiAgICByZXR1cm4gZm91bmQ7XG59XG5cbi8qKlxuICogUmV0dXJuIGFsbCBpdGVtcyB0aGF0IGFyZSBlcXVhbCB0byB0aGVcbiAqIHBhc3NlZCBpbiBvYmplY3QuIEJ5IGRlZnVhbHQgT2JqZWN0cyBhbmQgQXJyYXlzIGFyZSBcbiAqIGNvbXBhcmVkIHdpdGggYSBzaGFsbG93IGNvbXBhcmlzb24uXG4gKiBcbiAqIEBwYXJhbSAge0FycmF5fSBhcnJcbiAqIEBwYXJhbSAge0FueX0gb2JqZWN0XG4gKiBAcGFyYW0gIHtPYmplY3R9IFtjb25maWddIFxuICogQHBhcmFtIHtCb29sZWFufSBbY29uZmlnLnNoYWxsb3ddIGRlZmF1bHRzIHRvIHRydWVcbiAqIHBhc3MgaW4gZmFsc2UgdG8gZG8gYSBkaXJlY3QgZXF1YWx0eSBjb21wYXJpc29uXG4gKiBmb3IgQXJyYXlzIE9iamVjdHMgb3IgRmFsc3lzLlxuICogXG4gKiBAcmV0dXJuIHtPYmplY3RbXX0gIEFuIGFycmF5IG9mIGl0ZW1zIGZvdW5kXG4gKiBmYWxzZSBpZiBub25lIGFyZSBmb3VuZC5cbiAqL1xuZnVuY3Rpb24gZmluZEFsbChhcnIsIG9iaiwgY29uZmlnKSB7XG4gICAgdmFyIGZuID0gX2NyZWF0ZUl0ZXJhdG9yRm4ob2JqLCBjb25maWcpO1xuICAgIHJldHVybiBfZmluZEFsbChhcnIsIGZuKTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gYWxsIGl0ZW1zIHRoYXQgYXJlIG5vdCBlcXVhbCB0byB0aGVcbiAqIHBhc3NlZCBpbiBvYmplY3QuIEJ5IGRlZnVhbHQgT2JqZWN0cyBhbmQgQXJyYXlzIGFyZSBcbiAqIGNvbXBhcmVkIHdpdGggYSBzaGFsbG93IGNvbXBhcmlzb24uXG4gKiBcbiAqIEBwYXJhbSAge0FycmF5fSBhcnJcbiAqIEBwYXJhbSAge0FueX0gb2JqZWN0XG4gKiBAcGFyYW0gIHtPYmplY3R9IFtjb25maWddIFxuICogQHBhcmFtIHtCb29sZWFufSBbY29uZmlnLnNoYWxsb3ddIGRlZmF1bHRzIHRvIHRydWVcbiAqIHBhc3MgaW4gZmFsc2UgdG8gZG8gYSBkaXJlY3QgZXF1YWx0eSBjb21wYXJpc29uXG4gKiBmb3IgQXJyYXlzIE9iamVjdHMgb3IgRmFsc3lzLlxuICogXG4gKiBAcmV0dXJuIHtPYmplY3RbXX0gIEFuIGFycmF5IG9mIGl0ZW1zIGZvdW5kXG4gKiBmYWxzZSBpZiBub25lIGFyZSBmb3VuZC5cbiAqL1xuZnVuY3Rpb24gZmluZEFsbE5vdChhcnIsIG9iaiwgY29uZmlnKSB7XG4gICAgdmFyIGZuID0gX2NyZWF0ZUl0ZXJhdG9yTm90Rm4ob2JqLCBjb25maWcpO1xuICAgIHJldHVybiBfZmluZEFsbChhcnIsIGZuKTtcbn1cblxuXG5leHBvcnRzLnRvQXJyYXkgPSB0b0FycmF5O1xuZXhwb3J0cy5lYWNoID0gZWFjaDtcbmV4cG9ydHMuaW5zZXJ0ID0gaW5zZXJ0O1xuZXhwb3J0cy5yZW1vdmVBdEluZGV4ID0gcmVtb3ZlQXRJbmRleDtcbmV4cG9ydHMuZmluZEZpcnN0Tm90ID0gZmluZEZpcnN0Tm90O1xuZXhwb3J0cy5maW5kQWxsTm90ID0gZmluZEFsbE5vdDtcbmV4cG9ydHMuZmluZEZpcnN0ID0gZmluZEZpcnN0O1xuZXhwb3J0cy5maW5kQWxsID0gZmluZEFsbDtcblxuZXhwb3J0cy5yZW1vdmVGaXJzdE5vdCA9IHJlbW92ZUZpcnN0Tm90O1xuZXhwb3J0cy5yZW1vdmVBbGxOb3QgPSByZW1vdmVBbGxOb3Q7XG5leHBvcnRzLnJlbW92ZUZpcnN0ID0gcmVtb3ZlRmlyc3Q7XG5leHBvcnRzLnJlbW92ZUFsbCA9IHJlbW92ZUFsbDtcblxuKGZ1bmN0aW9uKCl7XG4gICAgdmFyIF9jcmVhdGVMYXN0Rm4gPSBmdW5jdGlvbihmbk5hbWUpIHtcbiAgICAgICAgdmFyIGxhc3ROYW1lID0gZm5OYW1lLnJlcGxhY2UoJ0ZpcnN0JywgJ0xhc3QnKTtcblxuICAgICAgICBleHBvcnRzW2xhc3ROYW1lXSA9IGZ1bmN0aW9uIGZpbmRMYXN0KGFyciwgb2JqLCBjb25maWcpIHtcbiAgICAgICAgICAgIHZhciByZXQ7XG5cbiAgICAgICAgICAgIGFyci5yZXZlcnNlKCk7XG4gICAgICAgICAgICByZXQgPSBleHBvcnRzW2ZuTmFtZV0oYXJyLCBvYmosIGNvbmZpZyk7XG4gICAgICAgICAgICBhcnIucmV2ZXJzZSgpO1xuXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9O1xuXG4gICAgfSwgbmFtZXNUb0FkZExhc3QgPSBbJ2ZpbmRGaXJzdE5vdCcsICdmaW5kRmlyc3QnLCAncmVtb3ZlRmlyc3ROb3QnLCAncmVtb3ZlRmlyc3QnXTtcblxuICAgIG5hbWVzVG9BZGRMYXN0LmZvckVhY2goZnVuY3Rpb24oZm5OYW1lKSB7XG4gICAgICAgIF9jcmVhdGVMYXN0Rm4oZm5OYW1lKTtcbiAgICB9KTtcblxufSgpKTtcblxuKGZ1bmN0aW9uKCkge1xuICAgIHZhciBuYW1lc1RvSXMgPSBbJ2ZpbmRGaXJzdE5vdCcsICdmaW5kQWxsTm90JywgJ2ZpbmRGaXJzdCcsICdmaW5kQWxsJyxcbiAgICAgICAgICAgICAgICAgICAgICdyZW1vdmVGaXJzdE5vdCcsICdyZW1vdmVBbGxOb3QnLCAncmVtb3ZlRmlyc3QnLCAncmVtb3ZlQWxsJyxcbiAgICAgICAgICAgICAgICAgICAgICdyZW1vdmVMYXN0Tm90JywgJ3JlbW92ZUxhc3QnLCAnZmluZExhc3QnLCAnZmluZExhc3ROb3QnXSxcbiAgICAgIGlzVG9JZ25vcmUgPSBbJ2lzUmVnRXhwJywgJ2lzQXJndW1lbnRzJ107XG5cbiAgICBmdW5jdGlvbiBfY3JlYXRlSXNGbihmbk5hbWUsIGtleSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oYXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gZXhwb3J0c1tmbk5hbWVdKGFyciwgaXNba2V5XSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgT2JqZWN0LmtleXMoaXMpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIHZhciBuYW1lID0ga2V5LnNwbGl0KCdpcycpWzFdO1xuICAgICAgICBuYW1lc1RvSXMuZm9yRWFjaChmdW5jdGlvbihmbk5hbWUpIHtcbiAgICAgICAgICAgIGlmKGlzVG9JZ25vcmUuaW5kZXhPZihrZXkpID09PSAtMSkge1xuICAgICAgICAgICAgICAgIGV4cG9ydHNbZm5OYW1lICsgbmFtZV0gPSBfY3JlYXRlSXNGbihmbk5hbWUsa2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59KCkpO1xuXG4oZnVuY3Rpb24oKSB7XG4gICAgdmFyIHVzZWZ1bGxGYWxzeUZucyA9IFsnZmluZEZpcnN0Tm90JywgJ2ZpbmRBbGxOb3QnLCAncmVtb3ZlRmlyc3ROb3QnLCAncmVtb3ZlQWxsTm90JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAncmVtb3ZlRmlyc3QnLCAncmVtb3ZlQWxsJywgJ3JlbW92ZUxhc3ROb3QnLCAncmVtb3ZlTGFzdCcsICAnZmluZExhc3ROb3QnXTtcblxuICAgIHZhciBmbnMgPSB7XG4gICAgICAgICdGYWxzZSc6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbCA9PT0gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgICdUcnVlJzogZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsID09PSB0cnVlO1xuICAgICAgICB9LFxuICAgICAgICAnTnVsbCc6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbCA9PT0gbnVsbDtcbiAgICAgICAgfSxcbiAgICAgICAgJ1VuZGVmaW5lZCc6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbCA9PT0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIF9jcmVhdGVLZXllZEZuKGZuTmFtZSwga2V5KSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihhcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBleHBvcnRzW2ZuTmFtZV0oYXJyLCBmbnNba2V5XSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgT2JqZWN0LmtleXMoZm5zKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICB1c2VmdWxsRmFsc3lGbnMuZm9yRWFjaChmdW5jdGlvbihmbk5hbWUpIHtcbiAgICAgICAgICAgIGV4cG9ydHNbZm5OYW1lICsga2V5XSA9IF9jcmVhdGVLZXllZEZuKGZuTmFtZSxrZXkpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0oKSk7XG5cblxuXG4vKipcbiAqIEBtZW1iZXIgTHVjLkFycmF5XG4gKiBAbWV0aG9kIGZpbmRGaXJzdE5vdEJvb2xlYW5cbiAqIFJldHVybiB0aGUgZmlyc3QgaXRlbSB0aGF0IGlzIG5vdCBvZiB0aGUgYXNzb2NpYXRlZCB0eXBlLlxuICogQHBhcmFtIHtBcnJheX0gYXJyXG4gKlxuICogQHJldHVybiB7T2JqZWN0fSB0aGUgb2JqZWN0IGlmIGl0IHdhcyBmb3VuZCwgZmFsc2UgaWYgaXQgd2FzIFxuICogbm90IGZvdW5kLlxuICovXG4vKipcbiAqIEBtZW1iZXIgTHVjLkFycmF5XG4gKiBAbWV0aG9kIGZpbmRGaXJzdEJvb2xlYW5cbiAqIFJldHVybiB0aGUgZmlyc3QgaXRlbSB0aGF0IGlzIG9mIHRoZSBhc3NvY2lhdGVkIHR5cGUuXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJcbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R9IHRoZSBvYmplY3QgaWYgaXQgd2FzIGZvdW5kLCBmYWxzZSBpZiBpdCB3YXMgXG4gKiBub3QgZm91bmQuXG4gKi9cbi8qKlxuICogQG1lbWJlciBMdWMuQXJyYXlcbiAqIEBtZXRob2QgZmluZEFsbE5vdEJvb2xlYW5cbiAqIFJldHVybiBhbGwgdGhlIGl0ZW1zIHRoYXQgYXJlIG5vdCBvZiB0aGUgYXNzb2NpYXRlZCB0eXBlLlxuICogQHBhcmFtIHtBcnJheX0gYXJyXG4gKlxuICogQHJldHVybiB7QW55W119IHRoZSBhcnJheSBvZiBvYmplY3RzIGZvdW5kLCBmYWxzZSBpZiBpdCB3YXMgXG4gKiBub3QgZm91bmQuXG4gKi9cblxuLyoqXG4gKiBAbWVtYmVyIEx1Yy5BcnJheVxuICogQG1ldGhvZCBmaW5kRmlyc3ROb3RPYmplY3RcbiAqIEBpbmhlcml0ZG9jIEx1Yy5BcnJheSNmaW5kRmlyc3ROb3RCb29sZWFuXG4gKi9cbi8qKlxuICogQG1lbWJlciBMdWMuQXJyYXlcbiAqIEBtZXRob2QgZmluZEZpcnN0T2JqZWN0XG4gKiBAaW5oZXJpdGRvYyBMdWMuQXJyYXkjZmluZEZpcnN0Qm9vbGVhblxuICovXG4vKipcbiAqIEBtZW1iZXIgTHVjLkFycmF5XG4gKiBAbWV0aG9kIGZpbmRBbGxOb3RPYmplY3RcbiAqIEBpbmhlcml0ZG9jIEx1Yy5BcnJheSNmaW5kQWxsTm90Qm9vbGVhblxuICovXG4vKipcbiAqIEBtZW1iZXIgTHVjLkFycmF5XG4gKiBAbWV0aG9kIGZpbmRBbGxPYmplY3RcbiAqIEBpbmhlcml0ZG9jIEx1Yy5BcnJheSNmaW5kQWxsQm9vbGVhblxuICovXG5cbi8qKlxuICogQG1lbWJlciBMdWMuQXJyYXlcbiAqIEBtZXRob2QgZmluZEZpcnN0Tm90RnVuY3Rpb25cbiAqIEBpbmhlcml0ZG9jIEx1Yy5BcnJheSNmaW5kRmlyc3ROb3RCb29sZWFuXG4gKi9cbi8qKlxuICogQG1lbWJlciBMdWMuQXJyYXlcbiAqIEBtZXRob2QgZmluZEZpcnN0RnVuY3Rpb25cbiAqIEBpbmhlcml0ZG9jIEx1Yy5BcnJheSNmaW5kRmlyc3RCb29sZWFuXG4gKi9cbi8qKlxuICogQG1lbWJlciBMdWMuQXJyYXlcbiAqIEBtZXRob2QgZmluZEFsbE5vdEZ1bmN0aW9uXG4gKiBAaW5oZXJpdGRvYyBMdWMuQXJyYXkjZmluZEFsbE5vdEJvb2xlYW5cbiAqL1xuLyoqXG4gKiBAbWVtYmVyIEx1Yy5BcnJheVxuICogQG1ldGhvZCBmaW5kQWxsRnVuY3Rpb25cbiAqIEBpbmhlcml0ZG9jIEx1Yy5BcnJheSNmaW5kQWxsQm9vbGVhblxuICovXG5cbi8qKlxuICogQG1lbWJlciBMdWMuQXJyYXlcbiAqIEBtZXRob2QgZmluZEZpcnN0Tm90U3RyaW5nXG4gKiBAaW5oZXJpdGRvYyBMdWMuQXJyYXkjZmluZEZpcnN0Tm90Qm9vbGVhblxuICovXG4vKipcbiAqIEBtZW1iZXIgTHVjLkFycmF5XG4gKiBAbWV0aG9kIGZpbmRGaXJzdFN0cmluZ1xuICogQGluaGVyaXRkb2MgTHVjLkFycmF5I2ZpbmRGaXJzdEJvb2xlYW5cbiAqL1xuLyoqXG4gKiBAbWVtYmVyIEx1Yy5BcnJheVxuICogQG1ldGhvZCBmaW5kQWxsTm90U3RyaW5nXG4gKiBAaW5oZXJpdGRvYyBMdWMuQXJyYXkjZmluZEFsbE5vdEJvb2xlYW5cbiAqL1xuLyoqXG4gKiBAbWVtYmVyIEx1Yy5BcnJheVxuICogQG1ldGhvZCBmaW5kQWxsU3RyaW5nXG4gKiBAaW5oZXJpdGRvYyBMdWMuQXJyYXkjZmluZEFsbEJvb2xlYW5cbiAqL1xuLyoqXG4gKiBAbWVtYmVyIEx1Yy5BcnJheVxuICogQG1ldGhvZCBmaW5kRmlyc3ROb3RTdHJpbmdcbiAqIEBpbmhlcml0ZG9jIEx1Yy5BcnJheSNmaW5kRmlyc3ROb3RCb29sZWFuXG4gKi9cbi8qKlxuICogQG1lbWJlciBMdWMuQXJyYXlcbiAqIEBtZXRob2QgZmluZEZpcnN0U3RyaW5nXG4gKiBAaW5oZXJpdGRvYyBMdWMuQXJyYXkjZmluZEZpcnN0Qm9vbGVhblxuICovXG4vKipcbiAqIEBtZW1iZXIgTHVjLkFycmF5XG4gKiBAbWV0aG9kIGZpbmRBbGxOb3RTdHJpbmdcbiAqIEBpbmhlcml0ZG9jIEx1Yy5BcnJheSNmaW5kQWxsTm90Qm9vbGVhblxuICovXG4vKipcbiAqIEBtZW1iZXIgTHVjLkFycmF5XG4gKiBAbWV0aG9kIGZpbmRBbGxTdHJpbmdcbiAqIEBpbmhlcml0ZG9jIEx1Yy5BcnJheSNmaW5kQWxsQm9vbGVhblxuICovXG4vKipcbiAqIEBtZW1iZXIgTHVjLkFycmF5XG4gKiBAbWV0aG9kIGZpbmRGaXJzdE5vdFJlZ0V4cFxuICogQGluaGVyaXRkb2MgTHVjLkFycmF5I2ZpbmRGaXJzdE5vdEJvb2xlYW5cbiAqL1xuLyoqXG4gKiBAbWVtYmVyIEx1Yy5BcnJheVxuICogQG1ldGhvZCBmaW5kRmlyc3RSZWdFeHBcbiAqIEBpbmhlcml0ZG9jIEx1Yy5BcnJheSNmaW5kRmlyc3RCb29sZWFuXG4gKi9cbi8qKlxuICogQG1lbWJlciBMdWMuQXJyYXlcbiAqIEBtZXRob2QgZmluZEFsbE5vdFJlZ0V4cFxuICogQGluaGVyaXRkb2MgTHVjLkFycmF5I2ZpbmRBbGxOb3RCb29sZWFuXG4gKi9cbi8qKlxuICogQG1lbWJlciBMdWMuQXJyYXlcbiAqIEBtZXRob2QgZmluZEFsbFJlZ0V4cFxuICogQGluaGVyaXRkb2MgTHVjLkFycmF5I2ZpbmRBbGxCb29sZWFuXG4gKi9cbi8qKlxuICogQG1lbWJlciBMdWMuQXJyYXlcbiAqIEBtZXRob2QgZmluZEZpcnN0Tm90RGF0ZVxuICogQGluaGVyaXRkb2MgTHVjLkFycmF5I2ZpbmRGaXJzdE5vdEJvb2xlYW5cbiAqL1xuLyoqXG4gKiBAbWVtYmVyIEx1Yy5BcnJheVxuICogQG1ldGhvZCBmaW5kRmlyc3REYXRlXG4gKiBAaW5oZXJpdGRvYyBMdWMuQXJyYXkjZmluZEZpcnN0Qm9vbGVhblxuICovXG4vKipcbiAqIEBtZW1iZXIgTHVjLkFycmF5XG4gKiBAbWV0aG9kIGZpbmRBbGxOb3REYXRlXG4gKiBAaW5oZXJpdGRvYyBMdWMuQXJyYXkjZmluZEFsbE5vdEJvb2xlYW5cbiAqL1xuLyoqXG4gKiBAbWVtYmVyIEx1Yy5BcnJheVxuICogQG1ldGhvZCBmaW5kQWxsRGF0ZVxuICogQGluaGVyaXRkb2MgTHVjLkFycmF5I2ZpbmRBbGxCb29sZWFuXG4gKi9cblxuIiwidmFyIGlzID0gcmVxdWlyZSgnLi9pcycpLFxuICAgIGFJbnNlcnQgPSByZXF1aXJlKCcuL2FycmF5JykuaW5zZXJ0O1xuICAgIGFFYWNoID0gcmVxdWlyZSgnLi9hcnJheScpLmVhY2g7XG5cbi8qKlxuICogQGNsYXNzIEx1Yy5GdW5jdGlvblxuICogUGFja2FnZSBmb3IgZnVuY3Rpb24gbWV0aG9kcy5cbiAqL1xuXG5mdW5jdGlvbiBhdWdtZW50QXJncyhjb25maWcsIGNhbGxBcmdzKSB7XG4gICAgdmFyIGNvbmZpZ0FyZ3MgPSBjb25maWcuYXJncyxcbiAgICAgICAgaW5kZXggPSBjb25maWcuaW5kZXgsXG4gICAgICAgIGFyZ3NBcnJheTtcblxuICAgIGlmICghY29uZmlnQXJncykge1xuICAgICAgICByZXR1cm4gY2FsbEFyZ3M7XG4gICAgfVxuXG4gICAgaWYoaW5kZXggPT09IHRydWUgfHwgaXMuaXNOdW1iZXIoaW5kZXgpKSB7XG4gICAgICAgIGlmKGNvbmZpZy5hcmd1bWVudHNGaXJzdCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBhSW5zZXJ0KGNvbmZpZ0FyZ3MsIGNhbGxBcmdzLCBpbmRleCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFJbnNlcnQoY2FsbEFyZ3MsIGNvbmZpZ0FyZ3MsIGluZGV4KTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29uZmlnQXJncztcbn1cblxuLyoqXG4gKiBBIHJldXNhYmxlIGVtcHR5IGZ1bmN0aW9uXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZXhwb3J0cy5lbXB0eUZuID0gZnVuY3Rpb24oKSB7fTtcblxuLyoqXG4gKiBBIGZ1bmN0aW9uIHRoYXQgdGhyb3dzIGFuIGVycm9yIHdoZW4gY2FsbGVkLlxuICogVXNlZnVsIHdoZW4gZGVmaW5pbmcgYWJzdHJhY3QgbGlrZSBjbGFzc2VzXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZXhwb3J0cy5hYnN0cmFjdEZuID0gZnVuY3Rpb24oKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdhYnN0cmFjdEZuIG11c3QgYmUgaW1wbGVtZW50ZWQnKTtcbn07XG5cbi8qKlxuICogQWd1bWVudCB0aGUgcGFzc2VkIGluIGZ1bmN0aW9uJ3MgdGhpc0FyZyBhbmQgb3IgYWd1bWVudHMgb2JqZWN0IFxuICogYmFzZWQgb24gdGhlIHBhc3NlZCBpbiBjb25maWcuXG4gKiBcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmbiB0aGUgZnVuY3Rpb24gdG8gY2FsbFxuICogQHBhcmFtICB7T2JqZWN0fSBjb25maWdcbiAqIFxuICogQHBhcmFtIHtPYmplY3R9IFtjb25maWcudGhpc0FyZ10gdGhlIHRoaXNBcmcgZm9yIHRoZSBmdW5jaXRvbiBiZWluZyBleGVjdXRlZC5cbiAqIElmIHRoaXMgaXMgdGhlIG9ubHkgcHJvcGVydHkgb24geW91ciBjb25maWcgb2JqZWN0IHRoZSBwcmVmZXJlZCB3YXkgd291bGRcbiAqIGJlIGp1c3QgdG8gdXNlIEZ1bmN0aW9uLmJpbmRcbiAqIFxuICogQHBhcmFtIHtBcnJheX0gW2NvbmZpZy5hcmdzXSB0aGUgYXJndW1lbnRzIHVzZWQgZm9yIHRoZSBmdW5jdGlvbiBiZWluZyBleGVjdXRlZC5cbiAqIFRoaXMgd2lsbCByZXBsYWNlIHRoZSBmdW5jdGlvbnMgY2FsbCBhcmdzIGlmIGluZGV4IGlzIG5vdCBhIG51bWJlciBvciBcbiAqIHRydWUuXG4gKiBcbiAqIEBwYXJhbSB7TnVtYmVyL1RydWV9IFtjb25maWcuaW5kZXhdIEJ5IGRlZnVhbHQgdGhlIHRoZSBjb25maWd1cmVkIGFyZ3VtZW50c1xuICogd2lsbCBiZSBpbnNlcnRlZCBpbnRvIHRoZSBmdW5jdGlvbnMgcGFzc2VkIGluIGNhbGwgYXJndW1lbnRzLiAgSWYgaW5kZXggaXMgdHJ1ZVxuICogYXBwZW5kIHRoZSBhcmdzIHRvZ2V0aGVyIGlmIGl0IGlzIGEgbnVtYmVyIGluc2VydCBpdCBhdCB0aGUgcGFzc2VkIGluIGluZGV4LlxuICogXG4gKiBAcGFyYW0ge0FycmF5fSBbY29uZmlnLmFyZ3VtZW50c0ZpcnN0XSBwYXNzIGluIGZhbHNlIHRvIFxuICogYWd1bWVudCB0aGUgY29uZmlndXJlZCBhcmdzIGZpcnN0IHdpdGggTHVjLkFycmF5Lmluc2VydC4gIERlZmF1bHRzXG4gKiB0byB0cnVlXG4gICAgIFxuICAgICBmdW5jdGlvbiBmbigpIHtcbiAgICAgICAgY29uc29sZS5sb2codGhpcylcbiAgICAgICAgY29uc29sZS5sb2coYXJndW1lbnRzKVxuICAgIH1cblxuICAgIEx1Yy5GdW5jdGlvbi5jcmVhdGVBdWdtZW50b3IoZm4sIHtcbiAgICAgICAgdGhpc0FyZzoge2NvbmZpZ2VkVGhpc0FyZzogdHJ1ZX0sXG4gICAgICAgIGFyZ3M6IFsxLDIsM10sXG4gICAgICAgIGluZGV4OjBcbiAgICB9KSg0KVxuXG4gICAgPk9iamVjdCB7Y29uZmlnZWRUaGlzQXJnOiB0cnVlfVxuICAgID5bMSwgMiwgMywgNF1cblxuICAgIEx1Yy5GdW5jdGlvbi5jcmVhdGVBdWdtZW50b3IoZm4sIHtcbiAgICAgICAgdGhpc0FyZzoge2NvbmZpZ2VkVGhpc0FyZzogdHJ1ZX0sXG4gICAgICAgIGFyZ3M6IFsxLDIsM10sXG4gICAgICAgIGluZGV4OjAsXG4gICAgICAgIGFyZ3VtZW50c0ZpcnN0OmZhbHNlXG4gICAgfSkoNClcblxuICAgID5PYmplY3Qge2NvbmZpZ2VkVGhpc0FyZzogdHJ1ZX1cbiAgICA+WzQsIDEsIDIsIDNdXG5cblxuICAgIHZhciBmID0gTHVjLkZ1bmN0aW9uLmNyZWF0ZUF1Z21lbnRvcihmbiwge1xuICAgICAgICBhcmdzOiBbMSwyLDNdLFxuICAgICAgICBpbmRleDogdHJ1ZVxuICAgIH0pO1xuXG4gICAgZi5hcHBseSh7Y29uZmlnOiBmYWxzZX0sIFs0XSlcblxuICAgID5PYmplY3Qge2NvbmZpZzogZmFsc2V9XG4gICAgPls0LCAxLCAyLCAzXVxuXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gdGhlIGF1Z21lbnRlZCBmdW5jdGlvbi5cbiAqL1xuZXhwb3J0cy5jcmVhdGVBdWdtZW50b3IgPSBmdW5jdGlvbihmbiwgY29uZmlnKSB7XG4gICAgdmFyIHRoaXNBcmcgPSBjb25maWcudGhpc0FyZztcblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGZuLmFwcGx5KHRoaXNBcmcgfHwgdGhpcywgYXVnbWVudEFyZ3MoY29uZmlnLCBhcmd1bWVudHMpKTtcbiAgICB9O1xufTtcblxuZnVuY3Rpb24gaW5pdFNlcXVlbmNlRnVuY3Rpb25zKGZucywgY29uZmlnKSB7XG4gICAgdmFyIHRvUnVuID0gW107XG4gICAgYUVhY2goZm5zLCBmdW5jdGlvbihmKSB7XG4gICAgICAgIHZhciBmbiA9IGY7XG5cbiAgICAgICAgaWYgKGNvbmZpZykge1xuICAgICAgICAgICAgZm4gPSBleHBvcnRzLmNyZWF0ZUF1Z21lbnRvcihmLCBjb25maWcpO1xuICAgICAgICB9XG5cbiAgICAgICAgdG9SdW4ucHVzaChmbik7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdG9SdW47XG59XG5cbi8qKlxuICogUmV0dXJuIGEgZnVuY3Rpb24gdGhhdCBydW5zIHRoZSBwYXNzZWQgaW4gZnVuY3Rpb25zXG4gKiBhbmQgcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSBsYXN0IGZ1bmN0aW9uIGNhbGxlZC5cbiAqIFxuICogQHBhcmFtICB7RnVuY3Rpb24vRnVuY3Rpb25bXX0gZm5zIFxuICogQHBhcmFtICB7T2JqZWN0fSBbY29uZmlnXSBDb25maWcgb2JqZWN0XG4gKiBmb3IgTHVjLkZ1bmN0aW9uLmNyZWF0ZUF1Z21lbnRvci4gIElmIGRlZmluZWQgYWxsIG9mIHRoZSBmdW5jdGlvbnNcbiAqIHdpbGwgZ2V0IGNyZWF0ZWQgd2l0aCB0aGUgcGFzc2VkIGluIGNvbmZpZztcbiAqXG4gICAgTHVjLkZ1bmN0aW9uLmNyZWF0ZVNlcXVlbmNlKFtcbiAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygxKVxuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKDIpXG4gICAgICAgIH0sXG4gICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coMylcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdmaW5pc2hlZCBsb2dnaW5nJylcbiAgICAgICAgICAgIHJldHVybiA0O1xuICAgICAgICB9XG4gICAgXSkoKVxuICAgID4xXG4gICAgPjJcbiAgICA+M1xuICAgID5maW5pc2hlZCBsb2dnaW5nXG4gICAgPjRcbiAqIFxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbmV4cG9ydHMuY3JlYXRlU2VxdWVuY2UgPSBmdW5jdGlvbihmbnMsIGNvbmZpZykge1xuICAgIHZhciBmdW5jdGlvbnMgPSBpbml0U2VxdWVuY2VGdW5jdGlvbnMoZm5zLCBjb25maWcpO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaSA9IDAsXG4gICAgICAgICAgICBsZW4gPSBmdW5jdGlvbnMubGVuZ3RoO1xuXG4gICAgICAgIGZvcig7aSA8IGxlbiAtMTsgKytpKSB7XG4gICAgICAgICAgICBmdW5jdGlvbnNbaV0uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbnNbbGVuIC0xIF0uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xufTtcblxuLyoqXG4gKiBSZXR1cm4gYSBmdW5jdGlvbiB0aGF0IHJ1bnMgdGhlIHBhc3NlZCBpbiBmdW5jdGlvbnNcbiAqIGlmIG9uZSBvZiB0aGUgZnVuY3Rpb25zIHJlc3VsdHMgZmFsc2UgdGhlIHJlc3Qgb2YgdGhlIFxuICogZnVuY3Rpb25zIHdvbid0IHJ1biBhbmQgZmFsc2Ugd2lsbCBiZSByZXR1cm5lZC5cbiAqXG4gKiBJZiBubyBmYWxzZSBpcyByZXR1cm5lZCB0aGUgdmFsdWUgb2YgdGhlIGxhc3QgZnVuY3Rpb24gcmV0dXJuIHdpbGwgYmUgcmV0dXJuZWRcbiAqIFxuICogQHBhcmFtICB7RnVuY3Rpb24vRnVuY3Rpb25bXX0gZm5zIFxuICogQHBhcmFtICB7T2JqZWN0fSBbY29uZmlnXSBDb25maWcgb2JqZWN0XG4gKiBmb3IgTHVjLkZ1bmN0aW9uLmNyZWF0ZUF1Z21lbnRvci4gIElmIGRlZmluZWQgYWxsIG9mIHRoZSBmdW5jdGlvbnNcbiAqIHdpbGwgZ2V0IGNyZWF0ZWQgd2l0aCB0aGUgcGFzc2VkIGluIGNvbmZpZztcblxuICAgIEx1Yy5GdW5jdGlvbi5jcmVhdGVTZXF1ZW5jZUlmKFtcbiAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygxKVxuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKDIpXG4gICAgICAgIH0sXG4gICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coMylcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdmaW5pc2hlZCBsb2dnaW5nJylcbiAgICAgICAgICAgIHJldHVybiA0O1xuICAgICAgICB9LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnaSBjYW50IGxvZycpXG4gICAgICAgIH1cbiAgICBdKSgpXG5cbiAgICA+MVxuICAgID4yXG4gICAgPjNcbiAgICA+ZmluaXNoZWQgbG9nZ2luZ1xuICAgID5mYWxzZVxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbmV4cG9ydHMuY3JlYXRlU2VxdWVuY2VJZiA9IGZ1bmN0aW9uKGZucywgY29uZmlnKSB7XG4gICAgdmFyIGZ1bmN0aW9ucyA9IGluaXRTZXF1ZW5jZUZ1bmN0aW9ucyhmbnMsIGNvbmZpZyk7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB2YWx1ZSxcbiAgICAgICAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG5cbiAgICAgICAgZnVuY3Rpb25zLnNvbWUoZnVuY3Rpb24oZm4pe1xuICAgICAgICAgICAgdmFsdWUgPSBmbi5hcHBseSh0aGlzLCBhcmdzKTtcblxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlID09PSBmYWxzZTtcbiAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH07XG59O1xuXG4vKipcbiAqIFJldHVybiBhIGZ1bmN0aW9ucyB0aGF0IHJ1bnMgdGhlIHBhc3NlZCBpbiBmdW5jdGlvbnNcbiAqIHRoZSByZXN1bHQgb2YgZWFjaCBmdW5jdGlvbiB3aWxsIGJlIHRoZSB0aGUgY2FsbCBhcmdzIFxuICogZm9yIHRoZSBuZXh0IGZ1bmN0aW9uLiAgVGhlIHZhbHVlIG9mIHRoZSBsYXN0IGZ1bmN0aW9uIFxuICogcmV0dXJuIHdpbGwgYmUgcmV0dXJuZWQuXG4gKiBcbiAqIEBwYXJhbSAge0Z1bmN0aW9uL0Z1bmN0aW9uW119IGZucyBcbiAqIEBwYXJhbSAge09iamVjdH0gW2NvbmZpZ10gQ29uZmlnIG9iamVjdFxuICogZm9yIEx1Yy5GdW5jdGlvbi5jcmVhdGVBdWdtZW50b3IuICBJZiBkZWZpbmVkIGFsbCBvZiB0aGUgZnVuY3Rpb25zXG4gKiB3aWxsIGdldCBjcmVhdGVkIHdpdGggdGhlIHBhc3NlZCBpbiBjb25maWc7XG4gICAgIFxuICAgICBMdWMuRnVuY3Rpb24uY3JlYXRlUmVsYXllcihbXG4gICAgICAgIGZ1bmN0aW9uKHN0cikge1xuICAgICAgICAgICAgcmV0dXJuIHN0ciArICdiJ1xuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbihzdHIpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHIgKyAnYydcbiAgICAgICAgfSxcbiAgICAgICAgZnVuY3Rpb24oc3RyKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RyICsgJ2QnXG4gICAgICAgIH1cbiAgICBdKSgnYScpXG5cbiAgICA+XCJhYmNkXCJcblxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbmV4cG9ydHMuY3JlYXRlUmVsYXllciA9IGZ1bmN0aW9uKGZucywgY29uZmlnKSB7XG4gICAgdmFyIGZ1bmN0aW9ucyA9IGluaXRTZXF1ZW5jZUZ1bmN0aW9ucyhmbnMsIGNvbmZpZyk7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB2YWx1ZSxcbiAgICAgICAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG5cbiAgICAgICAgZnVuY3Rpb25zLmZvckVhY2goZnVuY3Rpb24oZm4sIGluZGV4KSB7XG4gICAgICAgICAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGZuLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGZuLmFwcGx5KHRoaXMsIFt2YWx1ZV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcbn07XG5cbi8qKlxuICogQ3JlYXRlIGEgdGhyb3R0bGVkIGZ1bmN0aW9uIHRoYXQgdGhlIHBhc3NlZCBpbiBmdW5jaXRvblxuICogb25seSBnZXRzIGV2b2tlZCBvbmNlIGV2ZW4gaXQgaXMgY2FsbGVkIG1hbnkgdGltZXNcbiAqXG4gKiBcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmblxuICogQHBhcmFtICB7TnVtYmVyfSBbbWlsbGlzXSBOdW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvXG4gKiB0aHJvdHRsZSB0aGUgZnVuY3Rpb24uXG4gKiBAcGFyYW0gIHtPYmplY3R9IFtjb25maWddIENvbmZpZyBvYmplY3RcbiAqIGZvciBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudG9yLiAgSWYgZGVmaW5lZCBhbGwgb2YgdGhlIGZ1bmN0aW9uc1xuICogd2lsbCBnZXQgY3JlYXRlZCB3aXRoIHRoZSBwYXNzZWQgaW4gY29uZmlnO1xuICogXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZXhwb3J0cy5jcmVhdGVUaHJvdHRlbGVkID0gZnVuY3Rpb24oZiwgbWlsbGlzLCBjb25maWcpIHtcbiAgICB2YXIgZm4gPSBjb25maWcgPyBleHBvcnRzLmNyZWF0ZUF1Z21lbnRvcihmLCBjb25maWcpIDogZixcbiAgICAgICAgdGltZU91dElkID0gZmFsc2U7XG5cbiAgICBpZighbWlsbGlzKSB7XG4gICAgICAgIHJldHVybiBmbjtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgICAgIGlmKHRpbWVPdXRJZCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVPdXRJZCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aW1lT3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGltZU91dElkID0gZmFsc2U7XG4gICAgICAgICAgICBmbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgfSwgbWlsbGlzKTtcbiAgICB9O1xufTtcblxuLyoqXG4gKiBEZWZlciBhIGZ1bmN0aW9uJ3MgZXhlY3V0aW9uIGZvciB0aGUgcGFzc2VkIGluXG4gKiBtaWxsaXNlY29uZHMuXG4gKiBcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmblxuICogQHBhcmFtICB7TnVtYmVyfSBbbWlsbGlzXSBOdW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvXG4gKiBkZWZlclxuICogQHBhcmFtICB7T2JqZWN0fSBbY29uZmlnXSBDb25maWcgb2JqZWN0XG4gKiBmb3IgTHVjLkZ1bmN0aW9uLmNyZWF0ZUF1Z21lbnRvci4gIElmIGRlZmluZWQgYWxsIG9mIHRoZSBmdW5jdGlvbnNcbiAqIHdpbGwgZ2V0IGNyZWF0ZWQgd2l0aCB0aGUgcGFzc2VkIGluIGNvbmZpZztcbiAqIFxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbmV4cG9ydHMuY3JlYXRlRGVmZXJyZWQgPSBmdW5jdGlvbihmLCBtaWxsaXMsIGNvbmZpZykge1xuICAgIHZhciBmbiA9IGNvbmZpZyA/IGV4cG9ydHMuY3JlYXRlQXVnbWVudG9yKGYsIGNvbmZpZykgOiBmO1xuXG4gICAgaWYoIW1pbGxpcykge1xuICAgICAgICByZXR1cm4gZm47XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcblxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZm4uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgIH0sIG1pbGxpcyk7XG4gICAgfTtcbn07IiwidmFyIGlzID0gcmVxdWlyZSgnLi9pcycpO1xuXG5mdW5jdGlvbiBfc3RyaWN0KHZhbDEsIHZhbDIpe1xuICAgIHJldHVybiB2YWwxID09PSB2YWwyO1xufVxuXG5mdW5jdGlvbiBfY29tcGFyZUFycmF5TGVuZ3RoKHZhbDEsIHZhbDIpIHtcbiAgICByZXR1cm4oaXMuaXNBcnJheSh2YWwxKSAmJiBpcy5pc0FycmF5KHZhbDIpICAmJiB2YWwxLmxlbmd0aCA9PT0gdmFsMi5sZW5ndGgpO1xufVxuXG5mdW5jdGlvbiBfc2hhbGxvd0FycmF5KHZhbDEsIHZhbDIpIHtcbiAgICB2YXIgaSA9IDAsXG4gICAgICAgIGxlbjtcbiAgICBcbiAgICBpZighX2NvbXBhcmVBcnJheUxlbmd0aCh2YWwxLCB2YWwyKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZm9yKGxlbiA9IHZhbDEubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgaWYodmFsMVtpXSAhPT0gdmFsMltpXSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIF9kZWVwQXJyYXkodmFsMSwgdmFsMikge1xuICAgIHZhciBpID0gMCxcbiAgICAgICAgbGVuO1xuICAgIFxuICAgIGlmKCFfY29tcGFyZUFycmF5TGVuZ3RoKHZhbDEsIHZhbDIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IobGVuID0gdmFsMS5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgICBpZighY29tcGFyZSh2YWwxW2ldLHZhbDJbaV0sIHt0eXBlOiAnZGVlcCd9KSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIF9jb21wYXJlT2JqZWN0S2V5c0xlbmd0aCh2YWwxLCB2YWwyKSB7XG4gICAgcmV0dXJuIChpcy5pc09iamVjdCh2YWwxKSAmJiBpcy5pc09iamVjdCh2YWwyKSAmJiBPYmplY3Qua2V5cyh2YWwxKS5sZW5ndGggPT09IE9iamVjdC5rZXlzKHZhbDIpLmxlbmd0aCk7XG59XG5cbmZ1bmN0aW9uIF9zaGFsbG93T2JqZWN0KHZhbDEsIHZhbDIpIHtcbiAgICB2YXIga2V5LCB2YWw7XG5cbiAgICBpZiAoIV9jb21wYXJlT2JqZWN0S2V5c0xlbmd0aCh2YWwxLCB2YWwyKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZm9yIChrZXkgaW4gdmFsMSkge1xuICAgICAgICBpZiAodmFsMS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbDFba2V5XTtcbiAgICAgICAgICAgIGlmICghdmFsMi5oYXNPd25Qcm9wZXJ0eShrZXkpIHx8IHZhbDJba2V5XSAhPT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gX2RlZXBPYmplY3QodmFsMSwgdmFsMikge1xuICAgIHZhciBrZXksIHZhbDtcblxuICAgIGlmICghX2NvbXBhcmVPYmplY3RLZXlzTGVuZ3RoKHZhbDEsIHZhbDIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IgKGtleSBpbiB2YWwxKSB7XG4gICAgICAgIGlmICh2YWwxLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsMVtrZXldO1xuICAgICAgICAgICAgaWYgKCF2YWwyLmhhc093blByb3BlcnR5KGtleSkgfHwgY29tcGFyZSh2YWx1ZSwgdmFsMltrZXldLCB7dHlwZTogJ2RlZXAnfSkgIT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcblxufVxuXG5mdW5jdGlvbiBfZGF0ZSh2YWwxLCB2YWwyKSB7XG4gICAgaWYoaXMuaXNEYXRlKHZhbDEpICYmIGlzLmlzRGF0ZSh2YWwyKSkge1xuICAgICAgICByZXR1cm4gdmFsMS5nZXRUaW1lKCkgPT09IHZhbDIuZ2V0VGltZSgpO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gX2NyZWF0ZUJvdW5kQ29tcGFyZShvYmplY3QsIGZuKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBmbihvYmplY3QsIHZhbHVlKTtcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBnZXRDb21wYXJlRm4ob2JqZWN0LCBjKSB7XG4gICAgdmFyIGNvbXBhcmVGbiA9IF9zdHJpY3QsXG4gICAgICAgIGNvbmZpZyA9IGMgfHwge307XG5cbiAgICBpZiAoY29uZmlnLnR5cGUgPT09ICdzaGFsbG93JyB8fCBjb25maWcudHlwZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChpcy5pc09iamVjdChvYmplY3QpKSB7XG4gICAgICAgICAgICBjb21wYXJlRm4gPSBfc2hhbGxvd09iamVjdDtcbiAgICAgICAgfSBlbHNlIGlmIChpcy5pc0FycmF5KG9iamVjdCkpIHtcbiAgICAgICAgICAgIGNvbXBhcmVGbiA9IF9zaGFsbG93QXJyYXk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXMuaXNEYXRlKG9iamVjdCkpIHtcbiAgICAgICAgICAgIGNvbXBhcmVGbiA9IF9kYXRlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYoY29uZmlnLnR5cGUgPT09ICdkZWVwJykge1xuICAgICAgICBpZiAoaXMuaXNPYmplY3Qob2JqZWN0KSkge1xuICAgICAgICAgICAgY29tcGFyZUZuID0gX2RlZXBPYmplY3Q7XG4gICAgICAgIH0gZWxzZSBpZiAoaXMuaXNBcnJheShvYmplY3QpKSB7XG4gICAgICAgICAgICBjb21wYXJlRm4gPSBfZGVlcEFycmF5O1xuICAgICAgICB9IGVsc2UgaWYgKGlzLmlzRGF0ZShvYmplY3QpKSB7XG4gICAgICAgICAgICBjb21wYXJlRm4gPSBfZGF0ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmKGNvbmZpZy50eXBlICE9PSAnc3RyaWN0Jykge1xuICAgICAgICAvL3dlIHdvdWxkIGJlIGRvaW5nIGEgc3RyaWN0IGNvbXBhcmlzb24gb24gYSB0eXBlLW9cbiAgICAgICAgLy9JIHRoaW5rIGFuIGVycm9yIGlzIGdvb2QgaGVyZS5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgcGFzc2VkIGluIGFuIGludmFsaWQgY29tcGFyaXNvbiB0eXBlJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbXBhcmVGbjtcbn1cblxuLyoqXG4gKiBAbWVtYmVyIEx1Y1xuICogQG1ldGhvZCBjb21wYXJlXG4gKiBcbiAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZXMgYXJlIGVxdWFsIHRvIGVhY2hcbiAqIG90aGVyLiAgQnkgZGVmYXVsdCBhIHNoYWxsb3cgY29tcGFyaXNvbiBpcyBcbiAqIGRvbmUgb24gYXJyYXlzLCBkYXRlcyBhbmQgb2JqZWN0cyBhbmQgYSBzdHJpY3QgY29tcGFyaXNvblxuICogaXMgZG9uZSBvbiBvdGhlciB0eXBlcy5cbiAqIFxuICogQHBhcmFtICB7QW55fSB2YWwxICBcbiAqIEBwYXJhbSAge0FueX0gdmFsMiAgIFxuICogQHBhcmFtICB7T2JqZWN0fSBbY29uZmlnXVxuICogQHBhcmFtIHtTdHJpbmd9IGNvbmZpZy50eXBlIHBhc3MgaW4gJ2RlZXAnIGZvciBhIGRlZXBcbiAqIGNvbXBhcmlzb24sICdzaGFsbG93JyAoZGVmYXVsdCkgZm9yIGEgc2hhbGxvdyBjb21wYXJpc29uXG4gKiBvciAnc3RyaWN0JyBmb3IgYSBzdHJpY3QgPT09IGNvbXBhcmlzb24gZm9yIGFsbCBvYmplY3RzLlxuICpcbiAqXG4gICAgTHVjLmNvbXBhcmUoJzEnLCAxKVxuICAgID5mYWxzZVxuICAgIEx1Yy5jb21wYXJlKHthOiAxfSwge2E6IDF9KVxuICAgID50cnVlXG4gICAgTHVjLmNvbXBhcmUoe2E6IDEsIGI6IHt9fSwge2E6IDEsIGI6IHt9IH0pXG4gICAgPmZhbHNlXG4gICAgTHVjLmNvbXBhcmUoe2E6IDEsIGI6IHt9fSwge2E6IDEsIGI6IHt9IH0sIHt0eXBlOiAnZGVlcCd9KVxuICAgID50cnVlXG4gICAgTHVjLmNvbXBhcmUoe2E6IDEsIGI6IHt9fSwge2E6IDEsIGI6IHt9IH0sIHt0eXBlOiAnc3RyaWN0J30pXG4gICAgPmZhbHNlXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5mdW5jdGlvbiBjb21wYXJlKHZhbDEsIHZhbDIsIGNvbmZpZykge1xuICAgIHJldHVybiBnZXRDb21wYXJlRm4odmFsMSwgY29uZmlnKSh2YWwxLCB2YWwyKTtcbn1cblxuXG5mdW5jdGlvbiBjcmVhdGVCb3VuZENvbXBhcmVGbihvYmplY3QsIGMpIHtcbiAgICB2YXIgY29tcGFyZUZuID0gZ2V0Q29tcGFyZUZuKG9iamVjdCwgYyk7XG5cbiAgICByZXR1cm4gX2NyZWF0ZUJvdW5kQ29tcGFyZShvYmplY3QsIGNvbXBhcmVGbik7XG59XG5cbmV4cG9ydHMuY29tcGFyZSA9IGNvbXBhcmU7XG5leHBvcnRzLmNyZWF0ZUJvdW5kQ29tcGFyZUZuID0gY3JlYXRlQm91bmRDb21wYXJlRm47IiwidmFyIGVtcHR5Rm4gPSByZXF1aXJlKCcuLi9mdW5jdGlvbicpLmVtcHR5Rm4sXG4gICAgYXBwbHkgPSByZXF1aXJlKCcuLi9vYmplY3QnKS5hcHBseTtcblxuLyoqXG4gKiBAY2xhc3MgTHVjLkJhc2VcbiAqIFNpbXBsZSBjbGFzcyB0aGF0IGJ5IGRlZmF1bHQgYXBwbGllcyB0aGUgXG4gKiBmaXJzdCBhcmd1bWVudCB0byB0aGUgaW5zdGFuY2UgYW5kIHRoZW4gY2FsbHNcbiAqIEx1Yy5CYXNlLmluaXQuXG4gKlxuICAgIHZhciBiID0gbmV3IEx1Yy5CYXNlKHtcbiAgICAgICAgYTogMSxcbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnaGV5JylcbiAgICAgICAgfVxuICAgIH0pXG4gICAgYi5hXG4gICAgPmhleVxuICAgID4xXG4gKi9cbmZ1bmN0aW9uIEJhc2UoKSB7XG4gICAgdGhpcy5iZWZvcmVJbml0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5pbml0KCk7XG59XG5cbkJhc2UucHJvdG90eXBlID0ge1xuICAgIC8qKlxuICAgICAqIEJ5IGRlZmF1bHQgYXBwbHkgdGhlIGNvbmZpZyB0byB0aGUgXG4gICAgICogaW5zdGFuY2UuXG4gICAgICovXG4gICAgYmVmb3JlSW5pdDogZnVuY3Rpb24oY29uZmlnKSB7XG4gICAgICAgIGFwcGx5KHRoaXMsIGNvbmZpZyk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBAbWV0aG9kXG4gICAgICogU2ltcGxlIGhvb2sgdG8gaW5pdGlhbGl6ZVxuICAgICAqIHRoZSBjbGFzcy5cbiAgICAgKi9cbiAgICBpbml0OiBlbXB0eUZuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhc2U7IiwidmFyIEJhc2UgPSByZXF1aXJlKCcuL2Jhc2UnKSxcbiAgICBDb21wb3NpdGlvbiA9IHJlcXVpcmUoJy4vY29tcG9zaXRpb24nKSxcbiAgICBvYmogPSByZXF1aXJlKCcuLi9vYmplY3QnKSxcbiAgICBhcnJheUZucyA9IHJlcXVpcmUoJy4uL2FycmF5JyksXG4gICAgZW1wdHlGbiA9IHJlcXVpcmUoJy4uL2Z1bmN0aW9uJykuZW1wdHlGbixcbiAgICBpcyA9IHJlcXVpcmUoJy4uL2lzJyksXG4gICAgYUVhY2ggPSBhcnJheUZucy5lYWNoLFxuICAgIGFwcGx5ID0gb2JqLmFwcGx5LFxuICAgIG9FYWNoID0gb2JqLmVhY2gsXG4gICAgb0ZpbHRlciA9IG9iai5maWx0ZXIsXG4gICAgbWl4ID0gb2JqLm1peCxcbiAgICBhcnJheVNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG5mdW5jdGlvbiBDbGFzc0RlZmluZXIoKSB7fVxuXG5DbGFzc0RlZmluZXIuQ09NUE9TSVRJT05TX05BTUUgPSAnJGNvbXBvc2l0aW9ucyc7XG5cbkNsYXNzRGVmaW5lci5wcm90b3R5cGUgPSB7XG4gICAgZGVmYXVsdFR5cGU6IEJhc2UsXG5cbiAgICBwcm9jZXNzb3JLZXlzOiB7XG4gICAgICAgICRtaXhpbnM6ICdfYXBwbHlNaXhpbnMnLFxuICAgICAgICAkc3RhdGljczogJ19hcHBseVN0YXRpY3MnLFxuICAgICAgICAkY29tcG9zaXRpb25zOiAnX2NvbXBvc2UnLFxuICAgICAgICAkc3VwZXI6ICdfc3VwZXInXG4gICAgfSxcblxuICAgIGRlZmluZTogZnVuY3Rpb24ob3B0cykge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IG9wdHMgfHwge30sXG4gICAgICAgICAgICAvL2lmIHN1cGVyIGlzIGEgZmFsc3kgdmFsdWUgYmVzaWRlcyB1bmRlZmluZWQgdGhhdCBtZWFucyBubyBzdXBlcmNsYXNzXG4gICAgICAgICAgICBTdXBlciA9IG9wdGlvbnMuJHN1cGVyIHx8IChvcHRpb25zLiRzdXBlciA9PT0gdW5kZWZpbmVkID8gdGhpcy5kZWZhdWx0VHlwZSA6IGZhbHNlKSxcbiAgICAgICAgICAgIENvbnN0cnVjdG9yO1xuXG4gICAgICAgIG9wdGlvbnMuJHN1cGVyID0gU3VwZXI7XG5cbiAgICAgICAgQ29uc3RydWN0b3IgPSB0aGlzLl9jcmVhdGVDb25zdHJ1Y3RvcihvcHRpb25zKTtcblxuICAgICAgICB0aGlzLl9wcm9jZXNzQWZ0ZXJDcmVhdGUoQ29uc3RydWN0b3IsIG9wdGlvbnMpO1xuXG4gICAgICAgIHJldHVybiBDb25zdHJ1Y3RvcjtcbiAgICB9LFxuXG4gICAgX2NyZWF0ZUNvbnN0cnVjdG9yOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHZhciBzdXBlcmNsYXNzID0gb3B0aW9ucy4kc3VwZXIsXG4gICAgICAgICAgICBDb25zdHJ1Y3RvciA9IHRoaXMuX2NyZWF0ZUNvbnN0cnVjdG9yRm4ob3B0aW9ucyk7XG5cbiAgICAgICAgaWYoc3VwZXJjbGFzcykge1xuICAgICAgICAgICAgQ29uc3RydWN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlcmNsYXNzLnByb3RvdHlwZSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBDb25zdHJ1Y3RvcjtcbiAgICB9LFxuXG4gICAgX2NyZWF0ZUNvbnN0cnVjdG9yRm46IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHN1cGVyY2xhc3MgPSBvcHRpb25zLiRzdXBlcixcbiAgICAgICAgICAgIENvbnN0cnVjdG9yO1xuXG4gICAgICAgIGlmICh0aGlzLl9oYXNDb25zdHJ1Y3Rvck1vZGlmeWluZ09wdGlvbnMob3B0aW9ucykpIHtcbiAgICAgICAgICAgIENvbnN0cnVjdG9yID0gdGhpcy5fY3JlYXRlQ29uc3RydWN0b3JXaXRoTW9kaWZpeWluZ09wdGlvbnMob3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZighc3VwZXJjbGFzcykge1xuICAgICAgICAgICAgQ29uc3RydWN0b3IgPSBmdW5jdGlvbigpIHt9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgQ29uc3RydWN0b3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBzdXBlcmNsYXNzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIENvbnN0cnVjdG9yO1xuICAgIH0sXG5cbiAgICBfY3JlYXRlQ29uc3RydWN0b3JXaXRoTW9kaWZpeWluZ09wdGlvbnM6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHN1cGVyY2xhc3MgPSBvcHRpb25zLiRzdXBlcixcbiAgICAgICAgICAgIG1lID0gdGhpcyxcbiAgICAgICAgICAgIGluaXRCZWZvcmVTdXBlcmNsYXNzLFxuICAgICAgICAgICAgaW5pdEFmdGVyU3VwZXJjbGFzcyxcbiAgICAgICAgICAgIGluaXQ7XG5cbiAgICAgICAgaWYgKCFzdXBlcmNsYXNzKSB7XG4gICAgICAgICAgICBpbml0ID0gdGhpcy5fY3JlYXRlSW5pdENsYXNzT3B0aW9uc0ZuKG9wdGlvbnMsIHtcbiAgICAgICAgICAgICAgICBhbGw6IHRydWVcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBhcnJheVNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICBpbml0LmNhbGwodGhpcywgb3B0aW9ucywgYXJncyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdEJlZm9yZVN1cGVyY2xhc3MgPSB0aGlzLl9jcmVhdGVJbml0Q2xhc3NPcHRpb25zRm4ob3B0aW9ucywge1xuICAgICAgICAgICAgYmVmb3JlOiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGluaXRBZnRlclN1cGVyY2xhc3MgPSB0aGlzLl9jcmVhdGVJbml0Q2xhc3NPcHRpb25zRm4ob3B0aW9ucywge1xuICAgICAgICAgICAgYmVmb3JlOiBmYWxzZVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgYXJncyA9IGFycmF5U2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXG4gICAgICAgICAgICBpbml0QmVmb3JlU3VwZXJjbGFzcy5jYWxsKHRoaXMsIG9wdGlvbnMsIGFyZ3MpO1xuICAgICAgICAgICAgc3VwZXJjbGFzcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgaW5pdEFmdGVyU3VwZXJjbGFzcy5jYWxsKHRoaXMsIG9wdGlvbnMsIGFyZ3MpO1xuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBfY3JlYXRlSW5pdENsYXNzT3B0aW9uc0ZuOiBmdW5jdGlvbihvcHRpb25zLCBjb25maWcpIHtcbiAgICAgICAgdmFyIG1lID0gdGhpcyxcbiAgICAgICAgICAgIGNvbXBvc2l0aW9ucyA9IHRoaXMuX2ZpbHRlckNvbXBvc2l0aW9ucyhjb25maWcsIG9wdGlvbnMuJGNvbXBvc2l0aW9ucyk7XG5cbiAgICAgICAgaWYoY29tcG9zaXRpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGVtcHR5Rm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBmdW5jdGlvbihvcHRpb25zLCBpbnN0YW5jZUFyZ3MpIHtcbiAgICAgICAgICAgIG1lLl9pbml0Q29tcG9zaXRpb25zLmNhbGwodGhpcywgY29tcG9zaXRpb25zLCBpbnN0YW5jZUFyZ3MpO1xuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBfZmlsdGVyQ29tcG9zaXRpb25zOiBmdW5jdGlvbihjb25maWcsIGNvbXBvc2l0aW9ucykge1xuICAgICAgICB2YXIgYmVmb3JlID0gY29uZmlnLmJlZm9yZSwgXG4gICAgICAgICAgICBmaWx0ZXJlZCA9IFtdO1xuXG4gICAgICAgIGlmKGNvbmZpZy5hbGwpIHtcbiAgICAgICAgICAgIHJldHVybiBjb21wb3NpdGlvbnM7XG4gICAgICAgIH1cblxuICAgICAgICBhRWFjaChjb21wb3NpdGlvbnMsIGZ1bmN0aW9uKGNvbXBvc2l0aW9uKSB7XG4gICAgICAgICAgICBpZihiZWZvcmUgJiYgY29tcG9zaXRpb24uaW5pdEFmdGVyICE9PSB0cnVlIHx8ICghYmVmb3JlICYmIGNvbXBvc2l0aW9uLmluaXRBZnRlciA9PT0gdHJ1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWQucHVzaChjb21wb3NpdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBmaWx0ZXJlZDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBvcHRpb25zIHtPYmplY3R9IHRoZSBjb21wb3NpdGlvbiBjb25maWcgb2JqZWN0XG4gICAgICogaW5zdGFuY2VBcmdzIHtBcnJheX0gdGhlIGFyZ3VtZW50cyBwYXNzZWQgdG8gdGhlIGluc3RhbmNlJ3NcbiAgICAgKiBjb25zdHJ1Y3Rvci5cbiAgICAgKi9cbiAgICBfaW5pdENvbXBvc2l0aW9uczogZnVuY3Rpb24oY29tcG9zaXRpb25zLCBpbnN0YW5jZUFyZ3MpIHtcbiAgICAgICAgaWYoIXRoaXNbQ2xhc3NEZWZpbmVyLkNPTVBPU0lUSU9OU19OQU1FXSkge1xuICAgICAgICAgICAgdGhpc1tDbGFzc0RlZmluZXIuQ09NUE9TSVRJT05TX05BTUVdID0ge307XG4gICAgICAgIH1cblxuICAgICAgICBhRWFjaChjb21wb3NpdGlvbnMsIGZ1bmN0aW9uKGNvbXBvc2l0aW9uQ29uZmlnKSB7XG4gICAgICAgICAgICB2YXIgY29uZmlnID0gYXBwbHkoe1xuICAgICAgICAgICAgICAgIGluc3RhbmNlOiB0aGlzLFxuICAgICAgICAgICAgICAgIGluc3RhbmNlQXJnczogaW5zdGFuY2VBcmdzXG4gICAgICAgICAgICB9LCBjb21wb3NpdGlvbkNvbmZpZyksIFxuICAgICAgICAgICAgY29tcG9zaXRpb247XG5cbiAgICAgICAgICAgIGNvbXBvc2l0aW9uID0gbmV3IENvbXBvc2l0aW9uKGNvbmZpZyk7XG5cbiAgICAgICAgICAgIHRoaXNbQ2xhc3NEZWZpbmVyLkNPTVBPU0lUSU9OU19OQU1FXVtjb21wb3NpdGlvbi5uYW1lXSA9IGNvbXBvc2l0aW9uLmdldEluc3RhbmNlKCk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICBfaGFzQ29uc3RydWN0b3JNb2RpZnlpbmdPcHRpb25zOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLiRjb21wb3NpdGlvbnM7XG4gICAgfSxcblxuICAgIF9nZXRQcm9jZXNzb3JLZXk6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzb3JLZXlzW2tleV07XG4gICAgfSxcblxuICAgIF9wcm9jZXNzQWZ0ZXJDcmVhdGU6IGZ1bmN0aW9uKCRjbGFzcywgb3B0aW9ucykge1xuICAgICAgICB0aGlzLl9hcHBseVZhbHVlc1RvUHJvdG8oJGNsYXNzLCBvcHRpb25zKTtcbiAgICAgICAgdGhpcy5faGFuZGxlUG9zdFByb2Nlc3NvcnMoJGNsYXNzLCBvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgX2FwcGx5VmFsdWVzVG9Qcm90bzogZnVuY3Rpb24oJGNsYXNzLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBwcm90byA9ICRjbGFzcy5wcm90b3R5cGUsXG4gICAgICAgICAgICBTdXBlciA9IG9wdGlvbnMuJHN1cGVyLFxuICAgICAgICAgICAgdmFsdWVzID0gYXBwbHkoe1xuICAgICAgICAgICAgICAgICRjbGFzczogJGNsYXNzXG4gICAgICAgICAgICB9LCBvcHRpb25zKTtcblxuICAgICAgICBpZiAoU3VwZXIpIHtcbiAgICAgICAgICAgIHZhbHVlcy4kc3VwZXJjbGFzcyA9IFN1cGVyLnByb3RvdHlwZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vRG9uJ3QgcHV0IHRoZSBkZWZpbmUgc3BlY2lmaWMgcHJvcGVydGllc1xuICAgICAgICAvL29uIHRoZSBwcm90b3R5cGVcbiAgICAgICAgb0VhY2godmFsdWVzLCBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2dldFByb2Nlc3NvcktleShrZXkpKSB7XG4gICAgICAgICAgICAgICAgcHJvdG9ba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgX2hhbmRsZVBvc3RQcm9jZXNzb3JzOiBmdW5jdGlvbigkY2xhc3MsIG9wdGlvbnMpIHtcbiAgICAgICAgb0VhY2gob3B0aW9ucywgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIG1ldGhvZCA9IHRoaXMuX2dldFByb2Nlc3NvcktleShrZXkpO1xuXG4gICAgICAgICAgICBpZiAoaXMuaXNGdW5jdGlvbih0aGlzW21ldGhvZF0pKSB7XG4gICAgICAgICAgICAgICAgdGhpc1ttZXRob2RdLmNhbGwodGhpcywgJGNsYXNzLCBvcHRpb25zW2tleV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgX2FwcGx5TWl4aW5zOiBmdW5jdGlvbigkY2xhc3MsIG1peGlucykge1xuICAgICAgICB2YXIgcHJvdG8gPSAkY2xhc3MucHJvdG90eXBlO1xuICAgICAgICBhRWFjaChtaXhpbnMsIGZ1bmN0aW9uKG1peGluKSB7XG4gICAgICAgICAgICAvL2FjY2VwdCBDb25zdHJ1Y3RvcnMgb3IgT2JqZWN0c1xuICAgICAgICAgICAgdmFyIHRvTWl4ID0gbWl4aW4ucHJvdG90eXBlIHx8IG1peGluO1xuICAgICAgICAgICAgbWl4KHByb3RvLCB0b01peCk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBfYXBwbHlTdGF0aWNzOiBmdW5jdGlvbigkY2xhc3MsIHN0YXRpY3MpIHtcbiAgICAgICAgdmFyIHByb3RvdHlwZSA9ICRjbGFzcy5wcm90b3R5cGU7XG5cbiAgICAgICAgYXBwbHkoJGNsYXNzLCBzdGF0aWNzKTtcblxuICAgICAgICBpZihwcm90b3R5cGUuZ2V0U3RhdGljVmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcHJvdG90eXBlLmdldFN0YXRpY1ZhbHVlID0gdGhpcy5nZXRTdGF0aWNWYWx1ZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfY29tcG9zZTogZnVuY3Rpb24oJGNsYXNzLCBjb21wb3NpdGlvbnMpIHtcbiAgICAgICAgdmFyIHByb3RvdHlwZSA9ICRjbGFzcy5wcm90b3R5cGUsXG4gICAgICAgICAgICBtZXRob2RzVG9Db21wb3NlO1xuXG4gICAgICAgIGFFYWNoKGNvbXBvc2l0aW9ucywgZnVuY3Rpb24oY29tcG9zaXRpb25Db25maWcpIHtcbiAgICAgICAgICAgIHZhciBjb21wb3NpdGlvbiA9IG5ldyBDb21wb3NpdGlvbihjb21wb3NpdGlvbkNvbmZpZyksXG4gICAgICAgICAgICAgICAgbmFtZSA9IGNvbXBvc2l0aW9uLm5hbWUsXG4gICAgICAgICAgICAgICAgQ29uc3RydWN0b3IgPSBjb21wb3NpdGlvbi5Db25zdHJ1Y3RvcjtcblxuICAgICAgICAgICAgY29tcG9zaXRpb24udmFsaWRhdGUoKTtcblxuICAgICAgICAgICAgbWV0aG9kc1RvQ29tcG9zZSA9IGNvbXBvc2l0aW9uLmdldE1ldGhvZHNUb0NvbXBvc2UoKTtcblxuICAgICAgICAgICAgbWV0aG9kc1RvQ29tcG9zZS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgICAgIGlmIChwcm90b3R5cGVba2V5XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3RvdHlwZVtrZXldID0gdGhpcy5fY3JlYXRlQ29tcG9zZXJQcm90b0ZuKGtleSwgbmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICAgIGlmKHByb3RvdHlwZS5nZXRDb21wb3NpdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcHJvdG90eXBlLmdldENvbXBvc2l0aW9uID0gdGhpcy5nZXRDb21wb3NpdGlvbjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgX3N1cGVyOiBmdW5jdGlvbigkY2xhc3MsICRzdXBlcikge1xuICAgICAgICBpZiAoJHN1cGVyKSB7XG4gICAgICAgICAgICAkY2xhc3MucHJvdG90eXBlLiRzdXBlciA9ICRzdXBlcjtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfY3JlYXRlQ29tcG9zZXJQcm90b0ZuOiBmdW5jdGlvbihtZXRob2ROYW1lLCBjb21wb3NpdGlvbk5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGNvbXAgPSB0aGlzW0NsYXNzRGVmaW5lci5DT01QT1NJVElPTlNfTkFNRV1bY29tcG9zaXRpb25OYW1lXTtcbiAgICAgICAgICAgIHJldHVybiBjb21wW21ldGhvZE5hbWVdLmFwcGx5KGNvbXAsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8vTWV0aG9kcyB0aGF0IGNhbiBnZXQgYWRkZWQgdG8gdGhlIHByb3RvdHlwZVxuICAgIC8vdGhleSB3aWxsIGJlIGNhbGxlZCBpbiB0aGUgY29udGV4dCBvZiB0aGUgaW5zdGFuY2UuXG4gICAgLyoqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBHZXR0ZXIgZm9yIGNvbXBvc2l0aW9uIGluc3RhbmNlIHRoYXQgZ2V0cyBwdXQgb25cbiAgICAgKiB0aGUgZGVmaW5lZCBjbGFzcy5cbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IGtleVxuICAgICAqL1xuICAgIGdldENvbXBvc2l0aW9uOiBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbQ2xhc3NEZWZpbmVyLkNPTVBPU0lUSU9OU19OQU1FXVtrZXldO1xuICAgIH0sXG5cbiAgICBnZXRTdGF0aWNWYWx1ZTogZnVuY3Rpb24gKGtleSwgJGNsYXNzKSB7XG4gICAgICAgIHZhciBjbGFzc1RvRmluZFZhbHVlID0gJGNsYXNzIHx8IHRoaXMuJGNsYXNzLFxuICAgICAgICAgICAgJHN1cGVyLFxuICAgICAgICAgICAgdmFsdWU7XG5cbiAgICAgICAgdmFsdWUgPSBjbGFzc1RvRmluZFZhbHVlW2tleV07XG5cbiAgICAgICAgaWYodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgJHN1cGVyID0gY2xhc3NUb0ZpbmRWYWx1ZS5wcm90b3R5cGUuJHN1cGVyO1xuICAgICAgICAgICAgaWYoJHN1cGVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0U3RhdGljVmFsdWUoa2V5LCAkc3VwZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxufTtcblxudmFyIERlZmluZXIgPSBuZXcgQ2xhc3NEZWZpbmVyKCk7XG4vL21ha2UgTHVjLmRlZmluZSBoYXBweVxuRGVmaW5lci5kZWZpbmUgPSBEZWZpbmVyLmRlZmluZS5iaW5kKERlZmluZXIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERlZmluZXI7IiwidmFyIGFFYWNoID0gcmVxdWlyZSgnLi4vYXJyYXknKS5lYWNoLFxuICAgIG9iaiA9IHJlcXVpcmUoJy4uL29iamVjdCcpLFxuICAgIGVtcHR5Rm4gPSByZXF1aXJlKCcuLi9mdW5jdGlvbicpLmVtcHR5Rm4sXG4gICAgYXBwbHkgPSBvYmouYXBwbHk7XG5cblxuZnVuY3Rpb24gUGx1Z2luKGNvbmZpZykge1xuICAgIGFwcGx5KHRoaXMsIGNvbmZpZyk7XG59XG5cblBsdWdpbi5wcm90b3R5cGUgPSB7XG4gICAgaW5pdDogZW1wdHlGbixcbiAgICBkZXN0cm95OiBlbXB0eUZuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBsdWdpbjtcbiIsInZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCcuLi9ldmVudHMvZXZlbnRFbWl0dGVyJyksXG4gICAgUGx1Z2luTWFuYWdlciA9IHJlcXVpcmUoJy4vcGx1Z2luTWFuYWdlcicpO1xuXG5tb2R1bGUuZXhwb3J0cy5FdmVudEVtaXR0ZXIgPSB7XG4gICAgQ29uc3RydWN0b3I6IEV2ZW50RW1pdHRlcixcbiAgICBuYW1lOiAnZW1pdHRlcicsXG4gICAgZmlsdGVyS2V5czogJ2FsbE1ldGhvZHMnXG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMuUGx1Z2luTWFuYWdlciA9IHtcbiAgICBuYW1lOiAncGx1Z2lucycsXG4gICAgaW5pdEFmdGVyOiB0cnVlLFxuICAgIENvbnN0cnVjdG9yOiBQbHVnaW5NYW5hZ2VyLFxuICAgIGNyZWF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtYW5hZ2VyID0gbmV3IHRoaXMuQ29uc3RydWN0b3IoKTtcbiAgICAgICAgbWFuYWdlci5pbml0KHtcbiAgICAgICAgICAgIGluc3RhbmNlOiB0aGlzLmluc3RhbmNlLFxuICAgICAgICAgICAgaW5zdGFuY2VBcmdzOiB0aGlzLmluc3RhbmNlQXJnc1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gbWFuYWdlcjtcbiAgICB9LFxuICAgIGZpbHRlcktleXM6IFsnZGVzdHJveVBsdWdpbnMnXVxufTsiLCJ2YXIgb2JqID0gcmVxdWlyZSgnLi4vb2JqZWN0JyksXG4gICAgYXBwbHkgPSBvYmouYXBwbHksXG4gICAgbWl4ID0gb2JqLm1peCxcbiAgICBvRmlsdGVyID0gb2JqLmZpbHRlcixcbiAgICBlbXB0eUZuID0gKCcuLi9mdW5jdGlvbicpLmVtcHR5Rm4sXG4gICAgaXMgPSByZXF1aXJlKCcuLi9pcycpO1xuXG4vKipcbiAqIEBjbGFzcyAgTHVjLkNvbXBvc2l0aW9uXG4gKiBAcHJvdGVjdGVkXG4gKiBjbGFzcyB0aGF0IHdyYXBzICRjb21wb3NpdGlvbiBjb25maWcgb2JqZWN0c1xuICogdG8gY29uZm9ybSB0byBhbiBhcGkuIFRoZSBjb25maWcgb2JqZWN0XG4gKiB3aWxsIG92ZXJyaWRlIGFueSBwcm90ZWN0ZWQgbWV0aG9kcyBhbmQgZGVmYXVsdCBjb25maWdzLlxuICovXG5mdW5jdGlvbiBDb21wb3NpdGlvbihjKSB7XG4gICAgdmFyIGRlZmF1bHRzID0gYy5kZWZhdWx0cyxcbiAgICAgICAgY29uZmlnID0gYztcblxuICAgIGlmKGRlZmF1bHRzKSB7XG4gICAgICAgIG1peChjb25maWcsIGNvbmZpZy5kZWZhdWx0cyk7XG4gICAgICAgIGRlbGV0ZSBjb25maWcuZGVmYXVsdHM7XG4gICAgfVxuXG4gICAgYXBwbHkodGhpcywgY29uZmlnKTtcbn1cblxuQ29tcG9zaXRpb24ucHJvdG90eXBlID0ge1xuICAgIC8qKlxuICAgICAqIEBjZmcge1N0cmluZ30gbmFtZSAocmVxdWlyZWQpIHRoZSBuYW1lXG4gICAgICovXG4gICAgXG4gICAgLyoqXG4gICAgICogQGNmZyB7RnVuY3Rpb259IENvbnN0cnVjdG9yIChyZXF1aXJlZCkgdGhlIENvbnN0cnVjdG9yXG4gICAgICogdG8gdXNlIHdoZW4gY3JlYXRpbmcgdGhlIGNvbXBvc2l0aW9uIGluc3RhbmNlLiAgVGhpc1xuICAgICAqIGlzIHJlcXVpcmVkIGlmIEx1Yy5Db21wb3NpdGlvbi5jcmVhdGUgaXMgbm90IG92ZXJyd2l0dGVuIGJ5XG4gICAgICogdGhlIHBhc3NlZCBpbiBjb21wb3NpdGlvbiBjb25maWcgb2JqZWN0LlxuICAgICAqL1xuICAgIFxuICAgIC8qKlxuICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgKiBCeSBkZWZhdWx0IGp1c3QgcmV0dXJuIGEgbmV3bHkgY3JlYXRlZCBDb25zdHJ1Y3RvciBpbnN0YW5jZS5cbiAgICAgKiBcbiAgICAgKiBXaGVuIGNyZWF0ZSBpcyBjYWxsZWQgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzIGNhbiBiZSB1c2VkIDpcbiAgICAgKiBcbiAgICAgKiB0aGlzLmluc3RhbmNlIFRoZSBpbnN0YW5jZSB0aGF0IGlzIGNyZWF0aW5nXG4gICAgICogdGhlIGNvbXBvc2l0aW9uLlxuICAgICAqIFxuICAgICAqIHRoaXMuQ29uc3RydWN0b3IgdGhlIGNvbnN0cnVjdG9yIHRoYXQgaXMgcGFzc2VkIGluIGZyb21cbiAgICAgKiB0aGUgY29tcG9zaXRpb24gY29uZmlnLiBcbiAgICAgKlxuICAgICAqIHRoaXMuaW5zdGFuY2VBcmdzIHRoZSBhcmd1bWVudHMgcGFzc2VkIGludG8gdGhlIGluc3RhbmNlIHdoZW4gaXQgXG4gICAgICogaXMgYmVpbmcgY3JlYXRlZC4gIEZvciBleGFtcGxlXG5cbiAgICAgICAgbmV3IE15Q2xhc3NXaXRoQUNvbXBvc2l0aW9uKHtwbHVnaW5zOiBbXX0pXG4gICAgICAgIC8vaW5zaWRlIG9mIHRoZSBjcmVhdGUgbWV0aG9kXG4gICAgICAgIHRoaXMuaW5zdGFuY2VBcmdzXG4gICAgICAgID5be3BsdWdpbnM6IFtdfV1cblxuICAgICAqIEByZXR1cm4ge09iamVjdH0gXG4gICAgICogdGhlIGNvbXBvc2l0aW9uIGluc3RhbmNlLlxuICAgICAqXG4gICAgICogRm9yIGV4YW1wbGUgc2V0IHRoZSBlbWl0dGVycyBtYXhMaXN0ZW5lcnNcbiAgICAgKiB0byB3aGF0IHRoZSBpbnN0YW5jZSBoYXMgY29uZmlnZWQuXG4gICAgICBcbiAgICAgICAgbWF4TGlzdGVuZXJzOiAxMDAsXG4gICAgICAgICRjb21wb3NpdGlvbnM6IHtcbiAgICAgICAgICAgIENvbnN0cnVjdG9yOiBMdWMuRXZlbnRFbWl0dGVyLFxuICAgICAgICAgICAgY3JlYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgZW1pdHRlciA9IG5ldyB0aGlzLkNvbnN0cnVjdG9yKCk7XG4gICAgICAgICAgICAgICAgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnModGhpcy5pbnN0YW5jZS5tYXhMaXN0ZW5lcnMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBlbWl0dGVyO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG5hbWU6ICdlbWl0dGVyJ1xuICAgICAgICB9XG5cbiAgICAgKi9cbiAgICBjcmVhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgQ29uc3RydWN0b3IgPSB0aGlzLkNvbnN0cnVjdG9yO1xuICAgICAgICByZXR1cm4gbmV3IENvbnN0cnVjdG9yKCk7XG4gICAgfSxcblxuICAgIGdldEluc3RhbmNlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlKCk7XG4gICAgfSxcblxuICAgIHZhbGlkYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYodGhpcy5uYW1lICA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0EgbmFtZSBtdXN0IGJlIGRlZmluZWQnKTtcbiAgICAgICAgfVxuICAgICAgICBpZighaXMuaXNGdW5jdGlvbih0aGlzLkNvbnN0cnVjdG9yKSAmJiB0aGlzLmNyZWF0ZSA9PT0gQ29tcG9zaXRpb24ucHJvdG90eXBlLmNyZWF0ZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgQ29uc3RydWN0b3IgbXVzdCBiZSBmdW5jdGlvbiBpZiBjcmVhdGUgaXMgbm90IG92ZXJyaWRlbicpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSBmaWx0ZXJGbnNcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBwcm9wZXJ0eSBmaWx0ZXJGbnMuYWxsTWV0aG9kcyByZXR1cm4gYWxsIG1ldGhvZHMgZnJvbSB0aGVcbiAgICAgKiBjb25zdHJ1Y3RvcnMgcHJvdG90eXBlXG4gICAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgICAqL1xuICAgIGZpbHRlckZuczoge1xuICAgICAgICBhbGxNZXRob2RzOiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gaXMuaXNGdW5jdGlvbih2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQGNmZyB7RnVuY3Rpb24vU3RyaW5nL0FycmF5W119IGZpbHRlcktleXNcbiAgICAgKiBUaGUga2V5cyB0byBhZGQgdG8gdGhlIGRlZmluZXJzIHByb3RvdHlwZSB0aGF0IHdpbGwgaW4gdHVybiBjYWxsXG4gICAgICogdGhlIGNvbXBvc2l0aW9ucyBtZXRob2QuXG4gICAgICogXG4gICAgICogRGVmYXVsdHMgdG8gTHVjLmVtcHR5Rm4uIFxuICAgICAqIElmIGFuIGFycmF5IGlzIHBhc3NlZCBpdCB3aWxsIGp1c3QgdXNlIHRoYXQgQXJyYXkuXG4gICAgICogXG4gICAgICogSWYgYSBzdHJpbmcgaXMgcGFzc2VkIGFuZCBtYXRjaGVzIGEgbWV0aG9kIGZyb20gXG4gICAgICogTHVjLkNvbXBvc2l0aW9uLmZpbHRlckZucyBpdCB3aWxsIGNhbGwgdGhhdCBpbnN0ZWFkLlxuICAgICAqIFxuICAgICAqIElmIGEgZnVuY3Rpb24gaXMgZGVmaW5lZCBpdFxuICAgICAqIHdpbGwgZ2V0IGNhbGxlZCB3aGlsZSBpdGVyYXRpbmcgb3ZlciBlYWNoIGtleSB2YWx1ZSBwYWlyIG9mIHRoZSBcbiAgICAgKiBDb25zdHJ1Y3RvcidzIHByb3RvdHlwZSwgaWYgYSB0cnV0aHkgdmFsdWUgaXMgXG4gICAgICogcmV0dXJuZWQgdGhlIHByb3BlcnR5IHdpbGwgYmUgYWRkZWQgdG8gdGhlIGRlZmluaW5nXG4gICAgICogY2xhc3NlcyBwcm90b3R5cGUuXG4gICAgICogXG4gICAgICogRm9yIGV4YW1wbGUgdGhpcyBjb25maWcgd2lsbCBvbmx5IGV4cG9zZSB0aGUgZW1pdCBtZXRob2QgXG4gICAgICogdG8gdGhlIGRlZmluaW5nIGNsYXNzXG4gICAgIFxuICAgICAgICAkY29tcG9zaXRpb25zOiB7XG4gICAgICAgICAgICBDb25zdHJ1Y3RvcjogTHVjLkV2ZW50RW1pdHRlcixcbiAgICAgICAgICAgIGZpbHRlcktleXM6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ga2V5ID09PSAnZW1pdCc7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbmFtZTogJ2VtaXR0ZXInXG4gICAgICAgIH1cbiAgICAgKiB0aGlzIGlzIGFsc28gYSB2YWxpZCBjb25maWdcbiAgICAgKiBcbiAgICAgICAgJGNvbXBvc2l0aW9uczoge1xuICAgICAgICAgICAgQ29uc3RydWN0b3I6IEx1Yy5FdmVudEVtaXR0ZXIsXG4gICAgICAgICAgICBmaWx0ZXJLZXlzOiBbJ2VtaXR0ZXInXSxcbiAgICAgICAgICAgIG5hbWU6ICdlbWl0dGVyJ1xuICAgICAgICB9XG4gICAgICogXG4gICAgICovXG4gICAgZmlsdGVyS2V5czogZW1wdHlGbixcblxuICAgIGdldE1ldGhvZHNUb0NvbXBvc2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZmlsdGVyS2V5cyA9IHRoaXMuZmlsdGVyS2V5cyxcbiAgICAgICAgICAgIHBhaXJzVG9BZGQsXG4gICAgICAgICAgICBmaWx0ZXJGbjtcblxuXG4gICAgICAgIGlmIChpcy5pc0FycmF5KGZpbHRlcktleXMpKSB7XG4gICAgICAgICAgICBwYWlyc1RvQWRkID0gZmlsdGVyS2V5cztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZpbHRlckZuID0gZmlsdGVyS2V5cztcblxuICAgICAgICAgICAgaWYgKGlzLmlzU3RyaW5nKGZpbHRlcktleXMpKSB7XG4gICAgICAgICAgICAgICAgZmlsdGVyRm4gPSB0aGlzLmZpbHRlckZuc1tmaWx0ZXJLZXlzXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9Db25zdHJ1Y3RvcnMgYXJlIG5vdCBuZWVkZWQgaWYgY3JlYXRlIGlzIG92ZXJ3cml0dGVuXG4gICAgICAgICAgICBwYWlyc1RvQWRkID0gb0ZpbHRlcih0aGlzLkNvbnN0cnVjdG9yICYmIHRoaXMuQ29uc3RydWN0b3IucHJvdG90eXBlLCBmaWx0ZXJGbiwgdGhpcywge1xuICAgICAgICAgICAgICAgIG93blByb3BlcnRpZXM6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGtleXM6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBhaXJzVG9BZGQ7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb21wb3NpdGlvbjsiLCJ2YXIgUGx1Z2luID0gcmVxdWlyZSgnLi9wbHVnaW4nKSxcbiAgICBpcyA9IHJlcXVpcmUoJy4uL2lzJyksXG4gICAgb2JqID0gcmVxdWlyZSgnLi4vb2JqZWN0JyksXG4gICAgYXJyID0gcmVxdWlyZSgnLi4vYXJyYXknKSxcbiAgICBhRWFjaCA9IGFyci5lYWNoLFxuICAgIG1peCA9IG9iai5taXgsXG4gICAgYXBwbHkgPSBvYmouYXBwbHk7XG5cbmZ1bmN0aW9uIFBsdWdpbk1hbmFnZXIoKSB7fVxuXG5QbHVnaW5NYW5hZ2VyLnByb3RvdHlwZSA9IHtcbiAgICBkZWZhdWx0UGx1Z2luOiBQbHVnaW4sXG5cbiAgICBpbml0OiBmdW5jdGlvbihpbnN0YW5jZVZhbHVlcykge1xuICAgICAgICBhcHBseSh0aGlzLCBpbnN0YW5jZVZhbHVlcyk7XG4gICAgICAgIHRoaXMuY3JlYXRlUGx1Z2lucygpO1xuICAgIH0sXG5cbiAgICBjcmVhdGVQbHVnaW5zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGNvbmZpZyA9IHRoaXMuaW5zdGFuY2VBcmdzWzBdO1xuXG4gICAgICAgIHRoaXMucGx1Z2lucyA9IFtdO1xuXG4gICAgICAgIGFFYWNoKGNvbmZpZy5wbHVnaW5zLCBmdW5jdGlvbihwbHVnaW5Db25maWcpIHtcbiAgICAgICAgICAgIHBsdWdpbkNvbmZpZy5vd25lciA9IHRoaXMuaW5zdGFuY2U7XG4gICAgICAgICAgICB2YXIgcGx1Z2luSW5zdGFuY2UgPSB0aGlzLmNyZWF0ZVBsdWdpbihwbHVnaW5Db25maWcpO1xuXG4gICAgICAgICAgICB0aGlzLmluaXRQbHVnaW4ocGx1Z2luSW5zdGFuY2UpO1xuXG4gICAgICAgICAgICB0aGlzLnBsdWdpbnMucHVzaChwbHVnaW5JbnN0YW5jZSk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICBjcmVhdGVQbHVnaW46IGZ1bmN0aW9uKGNvbmZpZykge1xuXG4gICAgICAgIGlmIChjb25maWcuQ29uc3RydWN0b3IpIHtcbiAgICAgICAgICAgIC8vY2FsbCB0aGUgY29uZmlnZWQgQ29uc3RydWN0b3Igd2l0aCB0aGUgXG4gICAgICAgICAgICAvL3Bhc3NlZCBpbiBjb25maWcgYnV0IHRha2Ugb2ZmIHRoZSBDb25zdHJ1Y3RvclxuICAgICAgICAgICAgLy9jb25maWcuXG4gICAgICAgICAgICAgXG4gICAgICAgICAgICAvL1RoZSBwbHVnaW4gQ29uc3RydWN0b3IgXG4gICAgICAgICAgICAvL3Nob3VsZCBub3QgbmVlZCB0byBrbm93IGFib3V0IGl0c2VsZlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBjb25maWcuQ29uc3RydWN0b3IoYXBwbHkoY29uZmlnLCB7XG4gICAgICAgICAgICAgICAgQ29uc3RydWN0b3I6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9pZiBDb25zdHJ1Y3RvciBwcm9wZXJ0eSBpcyBub3Qgb25cbiAgICAgICAgLy90aGUgY29uZmlnIGp1c3QgdXNlIHRoZSBkZWZhdWx0IFBsdWdpblxuICAgICAgICByZXR1cm4gbmV3IHRoaXMuZGVmYXVsdFBsdWdpbihjb25maWcpO1xuICAgIH0sXG5cbiAgICBpbml0UGx1Z2luOiBmdW5jdGlvbihwbHVnaW4pIHtcbiAgICAgICAgaWYgKGlzLmlzRnVuY3Rpb24ocGx1Z2luLmluaXQpKSB7XG4gICAgICAgICAgICBwbHVnaW4uaW5pdCh0aGlzLmluc3RhbmNlKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBkZXN0cm95UGx1Z2luczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMucGx1Z2lucy5mb3JFYWNoKGZ1bmN0aW9uKHBsdWdpbikge1xuICAgICAgICAgICAgaWYgKGlzLmlzRnVuY3Rpb24ocGx1Z2luLmRlc3Ryb3kpKSB7XG4gICAgICAgICAgICAgICAgcGx1Z2luLmRlc3Ryb3kodGhpcy5pbnN0YW5jZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUGx1Z2luTWFuYWdlcjsiXX0=
;