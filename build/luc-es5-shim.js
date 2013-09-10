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
},{"./array":2,"./arrayFnGenerator":5,"./class/base":8,"./class/compositionEnums":12,"./class/definer":9,"./class/plugin":10,"./class/pluginManager":11,"./compare":13,"./events/eventEmitter":7,"./function":3,"./id":14,"./is":6,"./object":4}],6:[function(require,module,exports){
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
},{}],15:[function(require,module,exports){
/**
 * @license https://raw.github.com/kriskowal/es5-shim/master/LICENSE
 * es5-shim license
 */

if(typeof window !== 'undefined') {
    require('es5-shim-sham');
}

module.exports = require('./luc');
},{"./luc":1,"es5-shim-sham":16}],2:[function(require,module,exports){
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

},{"./compare":13,"./is":6}],3:[function(require,module,exports){
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
},{"./array":2,"./is":6}],4:[function(require,module,exports){
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
},{"./is":6}],5:[function(require,module,exports){
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
},{"./array":2,"./is":6}],13:[function(require,module,exports){
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
},{"./is":6}],8:[function(require,module,exports){
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
},{"../function":3,"../object":4}],9:[function(require,module,exports){
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
},{"../array":2,"../function":3,"../is":6,"../object":4,"./base":8,"./composition":17}],11:[function(require,module,exports){
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
},{"../array":2,"../is":6,"../object":4,"./plugin":10}],10:[function(require,module,exports){
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

},{"../array":2,"../function":3,"../object":4}],12:[function(require,module,exports){
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
},{"../events/eventEmitter":7,"./pluginManager":11}],7:[function(require,module,exports){
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
},{"events":18}],19:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
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

},{"__browserify_process":19}],16:[function(require,module,exports){
require('./node_modules/es5-shim/es5-shim');
require('./node_modules/es5-shim/es5-sham');
},{"./node_modules/es5-shim/es5-sham":21,"./node_modules/es5-shim/es5-shim":20}],17:[function(require,module,exports){
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
},{"../array":2,"../is":6,"../object":4}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
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

},{}]},{},[15])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvbHVjLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2lzLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2lkLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2x1Yy1lczUtc2hpbS5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9hcnJheS5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9mdW5jdGlvbi5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9vYmplY3QuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvYXJyYXlGbkdlbmVyYXRvci5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9jb21wYXJlLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2NsYXNzL2Jhc2UuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvY2xhc3MvZGVmaW5lci5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9jbGFzcy9wbHVnaW5NYW5hZ2VyLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2NsYXNzL3BsdWdpbi5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9jbGFzcy9jb21wb3NpdGlvbkVudW1zLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2V2ZW50cy9ldmVudEVtaXR0ZXIuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvaW5zZXJ0LW1vZHVsZS1nbG9iYWxzL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1idWlsdGlucy9idWlsdGluL2V2ZW50cy5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL25vZGVfbW9kdWxlcy9lczUtc2hpbS1zaGFtL2luZGV4LmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2NsYXNzL2NvbXBvc2l0aW9uLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbm9kZV9tb2R1bGVzL2VzNS1zaGltLXNoYW0vbm9kZV9tb2R1bGVzL2VzNS1zaGltL2VzNS1zaGltLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbm9kZV9tb2R1bGVzL2VzNS1zaGltLXNoYW0vbm9kZV9tb2R1bGVzL2VzNS1zaGltL2VzNS1zaGFtLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdk5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy8wQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xNQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDelFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2x5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgTHVjID0ge30sXG4gICAgaXNCcm93c2VyID0gZmFsc2U7XG5cbmlmKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaXNCcm93c2VyID0gdHJ1ZTtcbn1cbi8qKlxuICogQGNsYXNzIEx1Y1xuICogQWxpYXNlcyBmb3IgY29tbW9uIEx1YyBtZXRob2RzIGFuZCBwYWNrYWdlcy4gIENoZWNrIG91dCBMdWMuZGVmaW5lXG4gKiB0byBsb29rIGF0IHRoZSBjbGFzcyBzeXN0ZW0gTHVjIHByb3ZpZGVzLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IEx1YztcblxudmFyIG9iamVjdCA9IHJlcXVpcmUoJy4vb2JqZWN0Jyk7XG5MdWMuT2JqZWN0ID0gb2JqZWN0O1xuLyoqXG4gKiBAbWVtYmVyIEx1Y1xuICogQHByb3BlcnR5IE8gTHVjLk9cbiAqIEFsaWFzIGZvciBMdWMuT2JqZWN0XG4gKi9cbkx1Yy5PID0gb2JqZWN0O1xuXG5cbi8qKlxuICogQG1lbWJlciBMdWNcbiAqIEBtZXRob2QgYXBwbHlcbiAqIEBpbmhlcml0ZG9jIEx1Yy5PYmplY3QjYXBwbHlcbiAqL1xuTHVjLmFwcGx5ID0gTHVjLk9iamVjdC5hcHBseTtcblxuLyoqXG4gKiBAbWVtYmVyIEx1Y1xuICogQG1ldGhvZCBtaXhcbiAqIEBpbmhlcml0ZG9jIEx1Yy5PYmplY3QjbWl4XG4gKi9cbkx1Yy5taXggPSBMdWMuT2JqZWN0Lm1peDtcblxuXG52YXIgZnVuID0gcmVxdWlyZSgnLi9mdW5jdGlvbicpO1xuTHVjLkZ1bmN0aW9uID0gZnVuO1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjXG4gKiBAcHJvcGVydHkgRiBMdWMuRlxuICogQWxpYXMgZm9yIEx1Yy5GdW5jdGlvblxuICovXG5MdWMuRiA9IGZ1bjtcblxuLyoqXG4gKiBAbWVtYmVyIEx1Y1xuICogQG1ldGhvZCBlbXB0eUZuXG4gKiBAaW5oZXJpdGRvYyBMdWMuRnVuY3Rpb24jZW1wdHlGblxuICovXG5MdWMuZW1wdHlGbiA9IEx1Yy5GdW5jdGlvbi5lbXB0eUZuO1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjXG4gKiBAbWV0aG9kIGFic3RyYWN0Rm5cbiAqIEBpbmhlcml0ZG9jIEx1Yy5GdW5jdGlvbiNhYnN0cmFjdEZuXG4gKi9cbkx1Yy5hYnN0cmFjdEZuID0gTHVjLkZ1bmN0aW9uLmFic3RyYWN0Rm47XG5cbnZhciBhcnJheSA9IHJlcXVpcmUoJy4vYXJyYXknKTtcbkx1Yy5BcnJheSA9IGFycmF5O1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjXG4gKiBAcHJvcGVydHkgQSBMdWMuQVxuICogQWxpYXMgZm9yIEx1Yy5BcnJheVxuICovXG5MdWMuQSA9IGFycmF5O1xuXG5MdWMuQXJyYXlGbkdlbmVyYXRvciA9IHJlcXVpcmUoJy4vYXJyYXlGbkdlbmVyYXRvcicpO1xuXG5MdWMuYXBwbHkoTHVjLCByZXF1aXJlKCcuL2lzJykpO1xuXG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnLi9ldmVudHMvZXZlbnRFbWl0dGVyJyk7XG5cbkx1Yy5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbnZhciBCYXNlID0gcmVxdWlyZSgnLi9jbGFzcy9iYXNlJyk7XG5cbkx1Yy5CYXNlID0gQmFzZTtcblxudmFyIERlZmluZXIgPSByZXF1aXJlKCcuL2NsYXNzL2RlZmluZXInKTtcblxuTHVjLkNsYXNzRGVmaW5lciA9IERlZmluZXI7XG5cbi8qKlxuICogQG1lbWJlciBMdWNcbiAqIEBtZXRob2QgZGVmaW5lXG4gKiBAaW5oZXJpdGRvYyBMdWMuZGVmaW5lI2RlZmluZVxuICovXG5MdWMuZGVmaW5lID0gRGVmaW5lci5kZWZpbmU7XG5cbkx1Yy5QbHVnaW4gPSByZXF1aXJlKCcuL2NsYXNzL3BsdWdpbicpO1xuXG5MdWMuUGx1Z2luTWFuYWdlciA9IHJlcXVpcmUoJy4vY2xhc3MvcGx1Z2luTWFuYWdlcicpO1xuXG5MdWMuYXBwbHkoTHVjLCB7XG4gICAgY29tcG9zaXRpb25FbnVtczogcmVxdWlyZSgnLi9jbGFzcy9jb21wb3NpdGlvbkVudW1zJylcbn0pO1xuXG5MdWMuY29tcGFyZSA9IHJlcXVpcmUoJy4vY29tcGFyZScpLmNvbXBhcmU7XG5cbkx1Yy5pZCA9IHJlcXVpcmUoJy4vaWQnKTtcblxuXG5pZihpc0Jyb3dzZXIpIHtcbiAgICB3aW5kb3cuTHVjID0gTHVjO1xufVxuXG4vKipcbiAqIEBtZW1iZXIgTHVjXG4gKiBAbWV0aG9kIGFkZFN1Ym1vZHVsZVxuICogTWV0aG9kIHVzZWQgYnkgc3VibW9kdWxlIGF1dGhvcnMgdG8gYWRkIHRoZWlyIG1vZHVsZSBpbnRvIEx1Yy5cbiAqIEJ5IGRlZmF1bHQgdGhlIHN1Ym1vZHVsZSB3aWxsIG9ubHkgYmUgYWRkZWQgdG8gTHVjIGlmIEx1YyBpcyBpblxuICogdGhlIGNvbnRleHQgb2YgYSBicm93c2VyLiAgTm9kZSBhbHJlYWR5IGhhcyBhIG5pY2UgbW9kdWxlIHN5c3RlbS4gIFxuICogVGhpcyBiZWhhdmlvciBjYW4gYmUgb3ZlcnJpZGRlbiBieSBzZXR0aW5nXG4gKiBMdWMuYWx3YXlzQWRkU3VibW9kdWxlIHRvIHRydWUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZSB0aGUgbmFtZXNwYWNlIG9mIHRoZSBzdWJtb2R1bGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogdGhlIG9iamVjdCAgdG8gYWRkIHRvIHRoZSBuYW1lc3BhY2UuICBJZiBrZXlzIGFscmVhZHkgZXhpc3QgaW5cbiAqIHRoZSBuYW1lc3BhY2UgdGhleSB3aWxsIG5vdCBiZSBvdmVyd3JpdHRlbi5cbiAqXG4gICAgZnVuY3Rpb24gVG9vbHRpcCgpIHt9XG4gICAgdmFyIGNvb2xUb29sdGlwID0gIHtUb29sdGlwOiBUb29sdGlwfTtcbiAgICBMdWMuYWRkU3VibW9kdWxlKCd1aScsIGNvb2xUb29sdGlwKTtcbiAgICBMdWMudWkuVG9vbHRpcDtcbiAgICA+ZnVuY3Rpb24gVG9vbHRpcCgpIHt9XG5cbiAgICAqdXNlIGFub3RoZXIgc3VibW9kdWxlXG4gICAgXG4gICAgTHVjLmFkZFN1Ym1vZHVsZSgndWknLCB7U29tZW9uZXNPYmplY3Q6IHthOnRydWV9fSk7XG4gICAgTHVjLnVpLlRvb2x0aXA7XG4gICAgPmZ1bmN0aW9uIFRvb2x0aXAoKSB7fVxuICAgIEx1Yy51aS5Tb21lb25lc09iamVjdDtcbiAgICA+e2E6dHJ1ZX1cbiAqL1xuTHVjLmFkZFN1Ym1vZHVsZSA9IGZ1bmN0aW9uKG5hbWVzcGFjZSwgb2JqKSB7XG4gICAgdmFyIHRvQWRkO1xuICAgIGlmIChMdWMuYWx3YXlzQWRkU3VibW9kdWxlIHx8IGlzQnJvd3Nlcikge1xuICAgICAgICB0b0FkZCA9IHt9O1xuICAgICAgICB0b0FkZFtuYW1lc3BhY2VdID0gb2JqO1xuICAgICAgICBMdWMuT2JqZWN0Lm1lcmdlKEx1YywgdG9BZGQpO1xuICAgIH1cbn07IiwidmFyIG9Ub1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XHJcblxyXG5cclxuLyoqXHJcbiAqIEBtZW1iZXIgTHVjXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoZSBwYXNzZWQgaW4gb2JqZWN0IGlzIG9mXHJcbiAqIHRoZSB0eXBlIHtAbGluayBBcnJheSBBcnJheX1cclxuICogQHBhcmFtICB7T2JqZWN0fSAgb2JqIFxyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKi9cclxuZnVuY3Rpb24gaXNBcnJheShvYmopIHtcclxuICAgIHJldHVybiBBcnJheS5pc0FycmF5KG9iaik7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAbWVtYmVyIEx1Y1xyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgcGFzc2VkIGluIG9iamVjdCBpcyBvZlxyXG4gKiB0aGUgdHlwZSB7QGxpbmsgT2JqZWN0IE9iamVjdH1cclxuICogQHBhcmFtICB7T2JqZWN0fSAgb2JqIFxyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKi9cclxuZnVuY3Rpb24gaXNPYmplY3Qob2JqKSB7XHJcbiAgICByZXR1cm4gb2JqICYmIG9Ub1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IE9iamVjdF0nO1xyXG59XHJcblxyXG4vKipcclxuICogQG1lbWJlciBMdWNcclxuICogUmV0dXJuIHRydWUgaWYgdGhlIHBhc3NlZCBpbiBvYmplY3QgaXMgb2ZcclxuICogdGhlIHR5cGUge0BsaW5rIEZ1bmN0aW9uIEZ1bmN0aW9ufVxyXG4gKiBAcGFyYW0gIHtPYmplY3R9ICBvYmogXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAqL1xyXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKG9iaikge1xyXG4gICAgcmV0dXJuIG9Ub1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAbWVtYmVyIEx1Y1xyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgcGFzc2VkIGluIG9iamVjdCBpcyBvZlxyXG4gKiB0aGUgdHlwZSB7QGxpbmsgRGF0ZSBEYXRlfVxyXG4gKiBAcGFyYW0gIHtPYmplY3R9ICBvYmogXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAqL1xyXG5mdW5jdGlvbiBpc0RhdGUob2JqKSB7XHJcbiAgICByZXR1cm4gb1RvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xyXG59XHJcblxyXG4vKipcclxuICogQG1lbWJlciBMdWNcclxuICogUmV0dXJuIHRydWUgaWYgdGhlIHBhc3NlZCBpbiBvYmplY3QgaXMgb2ZcclxuICogdGhlIHR5cGUge0BsaW5rIFJlZ0V4cCBSZWdFeHB9XHJcbiAqIEBwYXJhbSAge09iamVjdH0gIG9iaiBcclxuICogQHJldHVybiB7Qm9vbGVhbn1cclxuICovXHJcbmZ1bmN0aW9uIGlzUmVnRXhwKG9iaikge1xyXG4gICAgcmV0dXJuIG9Ub1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IFJlZ0V4cF0nO1xyXG59XHJcblxyXG4vKipcclxuICogQG1lbWJlciBMdWNcclxuICogUmV0dXJuIHRydWUgaWYgdGhlIHBhc3NlZCBpbiBvYmplY3QgaXMgb2ZcclxuICogdGhlIHR5cGUge0BsaW5rIE51bWJlciBOdW1iZXJ9XHJcbiAqIEBwYXJhbSAge09iamVjdH0gIG9iaiBcclxuICogQHJldHVybiB7Qm9vbGVhbn1cclxuICovXHJcbmZ1bmN0aW9uIGlzTnVtYmVyKG9iaikge1xyXG4gICAgcmV0dXJuIG9Ub1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IE51bWJlcl0nO1xyXG59XHJcblxyXG4vKipcclxuICogQG1lbWJlciBMdWNcclxuICogUmV0dXJuIHRydWUgaWYgdGhlIHBhc3NlZCBpbiBvYmplY3QgaXMgb2ZcclxuICogdGhlIHR5cGUge0BsaW5rIFN0cmluZyBTdHJpbmd9XHJcbiAqIEBwYXJhbSAge09iamVjdH0gIG9iaiBcclxuICogQHJldHVybiB7Qm9vbGVhbn1cclxuICovXHJcbmZ1bmN0aW9uIGlzU3RyaW5nKG9iaikge1xyXG4gICAgcmV0dXJuIG9Ub1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IFN0cmluZ10nO1xyXG59XHJcblxyXG4vKipcclxuICogQG1lbWJlciBMdWNcclxuICogUmV0dXJuIHRydWUgaWYgdGhlIHBhc3NlZCBpbiBvYmplY3QgaXMgb2ZcclxuICogdGhlIHR5cGUgYXJndW1lbnRzLlxyXG4gKiBcclxuICogQHBhcmFtICB7T2JqZWN0fSAgb2JqIFxyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKi9cclxuZnVuY3Rpb24gaXNBcmd1bWVudHMob2JqKSB7XHJcbiAgICByZXR1cm4gb1RvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJndW1lbnRzXScgfHwgb2JqICYmICEhb2JqLmNhbGxlZTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBtZW1iZXIgTHVjXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoZSBvYmplY3QgaXMgZmFsc3kgYnV0IG5vdCB6ZXJvLlxyXG4gICAgTHVjLmlzRmFsc3koZmFsc2UpXHJcbiAgICA+dHJ1ZVxyXG4gICAgTHVjLmlzRmFsc3koMClcclxuICAgID5mYWxzZVxyXG4gKiBAcGFyYW0gIHtPYmplY3R9ICBvYmpcclxuICogQHJldHVybiB7Qm9vbGVhbn0gICAgIFxyXG4gKi9cclxuZnVuY3Rpb24gaXNGYWxzeShvYmopIHtcclxuICAgIHJldHVybiAoIW9iaiAmJiBvYmogIT09IDApO1xyXG59XHJcblxyXG4vKipcclxuICogQG1lbWJlciBMdWNcclxuICogUmV0dXJuIHRydWUgaWYgdGhlIG9iamVjdCBpcyBlbXB0eS5cclxuICoge30sIFtdLCAnJyxmYWxzZSwgbnVsbCwgdW5kZWZpbmVkLCBOYU4gXHJcbiAqIGFyZSBhbGwgdHJlYXRlZCBhcyBlbXB0eS5cclxuICogXHJcbiAgICBMdWMuaXNFbXB0eSh0cnVlKVxyXG4gICAgPmZhbHNlXHJcbiAgICBMdWMuaXNFbXB0eShbXSlcclxuICAgID50cnVlXHJcbiAgICBcclxuICogQHBhcmFtICB7T2JqZWN0fSAgb2JqXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAqL1xyXG5mdW5jdGlvbiBpc0VtcHR5KG9iaikge1xyXG4gICAgdmFyIGVtcHR5ID0gZmFsc2U7XHJcblxyXG4gICAgaWYgKGlzRmFsc3kob2JqKSkge1xyXG4gICAgICAgIGVtcHR5ID0gdHJ1ZTtcclxuICAgIH0gZWxzZSBpZiAoaXNBcnJheShvYmopKSB7XHJcbiAgICAgICAgZW1wdHkgPSBvYmoubGVuZ3RoID09PSAwO1xyXG4gICAgfSBlbHNlIGlmIChpc09iamVjdChvYmopKSB7XHJcbiAgICAgICAgZW1wdHkgPSBPYmplY3Qua2V5cyhvYmopLmxlbmd0aCA9PT0gMDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZW1wdHk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgaXNBcnJheTogaXNBcnJheSxcclxuICAgIGlzT2JqZWN0OiBpc09iamVjdCxcclxuICAgIGlzRnVuY3Rpb246IGlzRnVuY3Rpb24sXHJcbiAgICBpc0RhdGU6IGlzRGF0ZSxcclxuICAgIGlzU3RyaW5nOiBpc1N0cmluZyxcclxuICAgIGlzTnVtYmVyOiBpc051bWJlcixcclxuICAgIGlzUmVnRXhwOiBpc1JlZ0V4cCxcclxuICAgIGlzQXJndW1lbnRzOiBpc0FyZ3VtZW50cyxcclxuICAgIGlzRmFsc3k6IGlzRmFsc3ksXHJcbiAgICBpc0VtcHR5OiBpc0VtcHR5XHJcbn07IiwidmFyIGlkcyA9IHt9O1xuLyoqXG4gKiBAbWVtYmVyIEx1Y1xuICogQG1ldGhvZCBpZFxuICogXG4gKiBSZXR1cm4gYSB1bmlxdWUgaWQuXG4gKiBAcGFyYW0ge1N0cmluZ30gW3ByZWZpeF0gT3B0aW9uYWwgcHJlZml4IHRvIHVzZVxuICpcbiAqXG4gICAgICAgIEx1Yy5pZCgpXG4gICAgICAgID5cImx1Yy0wXCJcbiAgICAgICAgTHVjLmlkKClcbiAgICAgICAgPlwibHVjLTFcIlxuICAgICAgICBMdWMuaWQoJ215LXByZWZpeCcpXG4gICAgICAgID5cIm15LXByZWZpeDBcIlxuICAgICAgICBMdWMuaWQoJycpXG4gICAgICAgID5cIjBcIlxuICpcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocCkge1xuICAgIHZhciBwcmVmaXggPSBwID09PSB1bmRlZmluZWQgPyAnbHVjLScgOiBwO1xuXG4gICAgaWYoaWRzW3ByZWZpeF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZHNbcHJlZml4XSA9IDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHByZWZpeCArIGlkc1twcmVmaXhdKys7XG59OyIsIi8qKlxuICogQGxpY2Vuc2UgaHR0cHM6Ly9yYXcuZ2l0aHViLmNvbS9rcmlza293YWwvZXM1LXNoaW0vbWFzdGVyL0xJQ0VOU0VcbiAqIGVzNS1zaGltIGxpY2Vuc2VcbiAqL1xuXG5pZih0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJlcXVpcmUoJ2VzNS1zaGltLXNoYW0nKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2x1YycpOyIsInZhciBhcnJheVNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLFxuICAgIGNvbXBhcmUgPSByZXF1aXJlKCcuL2NvbXBhcmUnKSxcbiAgICBpcyA9IHJlcXVpcmUoJy4vaXMnKSxcbiAgICBjb21wYXJlID0gY29tcGFyZS5jb21wYXJlO1xuXG5mdW5jdGlvbiBfY3JlYXRlSXRlcmF0b3JGbihmbiwgYykge1xuICAgIHZhciBjb25maWcgPSBjIHx8IHt9O1xuXG4gICAgaWYoaXMuaXNGdW5jdGlvbihmbikgJiYgKGNvbmZpZy50eXBlICE9PSAnc3RyaWN0JykpIHtcbiAgICAgICAgcmV0dXJuIGMgPyBmbi5iaW5kKGMpIDogZm47XG4gICAgfVxuXG4gICAgaWYoY29uZmlnLnR5cGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb25maWcudHlwZSA9ICdsb29zZSc7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBjb21wYXJlKGZuLCB2YWx1ZSwgY29uZmlnKTtcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBfY3JlYXRlSXRlcmF0b3JOb3RGbihmbiwgY29uZmlnKSB7XG4gICAgdmFyIGZ1bmN0aW9uVG9Ob3QgPSBfY3JlYXRlSXRlcmF0b3JGbihmbiwgY29uZmlnKTtcbiAgICAgICAgXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gIWZ1bmN0aW9uVG9Ob3QuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xufVxuXG5cbi8qKlxuICogQGNsYXNzIEx1Yy5BcnJheSBcbiAqIFBhY2thZ2UgZm9yIEFycmF5IG1ldGhvZHMuIDxicj5cbiAqIFxuICogS2VlcCBpbiBtaW5kIHRoYXQgTHVjIGlzIG9wdGlvbmFsbHkgcGFja2FnZWQgd2l0aCBlczUgc2hpbSBzbyB5b3UgY2FuIHdyaXRlIGVzNSBjb2RlIGluIG5vbiBlczUgYnJvd3NlcnMuXG4gKiBJdCBjb21lcyB3aXRoIHlvdXIgZmF2b3JpdGUge0BsaW5rIEFycmF5IEFycmF5fSBtZXRob2RzIHN1Y2ggYXMgQXJyYXkuZm9yRWFjaCwgQXJyYXkuZmlsdGVyLCBBcnJheS5zb21lLCBBcnJheS5ldmVyeSBBcnJheS5yZWR1Y2VSaWdodCAuLlxuICpcbiAqIEFsc28gZG9uJ3QgZm9yZ2V0IGFib3V0IEx1Yy5BcnJheS5lYWNoIGFuZCBMdWMuQXJyYXkudG9BcnJheSwgdGhleSBhcmUgZ3JlYXQgdXRpbGl0eSBtZXRob2RzXG4gKiB0aGF0IGFyZSB1c2VkIGFsbCBvdmVyIHRoZSBmcmFtZXdvcmsuXG4gKiBcbiAqIEFsbCByZW1vdmVcXCogLyBmaW5kXFwqIG1ldGhvZHMgZm9sbG93IHRoZSBzYW1lIGFwaS4gIFxcKkFsbCBmdW5jdGlvbnMgd2lsbCByZXR1cm4gYW4gYXJyYXkgb2YgcmVtb3ZlZCBvciBmb3VuZFxuICogaXRlbXMuICBUaGUgaXRlbXMgd2lsbCBiZSBhZGRlZCB0byB0aGUgYXJyYXkgaW4gdGhlIG9yZGVyIHRoZXkgYXJlXG4gKiBmb3VuZC4gIFxcKkZpcnN0IGZ1bmN0aW9ucyB3aWxsIHJldHVybiB0aGUgZmlyc3QgaXRlbSBhbmQgc3RvcCBpdGVyYXRpbmcgYWZ0ZXIgdGhhdCwgaWYgbm9uZVxuICogIGlzIGZvdW5kIGZhbHNlIGlzIHJldHVybmVkLiAgcmVtb3ZlXFwqIGZ1bmN0aW9ucyB3aWxsIGRpcmVjdGx5IGNoYW5nZSB0aGUgcGFzc2VkIGluIGFycmF5LlxuICogIFxcKk5vdCBmdW5jdGlvbnMgb25seSBkbyB0aGUgZm9sbG93aW5nIGFjdGlvbnMgaWYgdGhlIGNvbXBhcmlzb24gaXMgbm90IHRydWUuXG4gKiAgQWxsIHJlbW92ZVxcKiAvIGZpbmRcXCogdGFrZSB0aGUgZm9sbG93aW5nIGFwaTogYXJyYXksIG9iamVjdFRvQ29tcGFyZU9ySXRlcmF0b3IsIGNvbXBhcmVDb25maWdPclRoaXNBcmcgPGJyPmZvciBleGFtcGxlOlxuICpcbiAgICAvL21vc3QgY29tbW9uIHVzZSBjYXNlXG4gICAgTHVjLkFycmF5LmZpbmRGaXJzdChbMSwyLDMsIHt9XSwge30pO1xuICAgID5PYmplY3Qge31cblxuICAgIC8vcGFzcyBpbiBvcHRpb25hbCBjb25maWcgZm9yIGEgc3RyaWN0ID09PSBjb21wYXJpc29uXG4gICAgTHVjLkFycmF5LmZpbmRGaXJzdChbMSwyLDMse31dLCB7fSwge3R5cGU6ICdzdHJpY3QnfSk7XG4gICAgPmZhbHNlXG5cbiAgICAvL3Bhc3MgaW4gYW4gaXRlcmF0b3IgYW5kIHRoaXNBcmdcbiAgICBMdWMuQXJyYXkuZmluZEZpcnN0KFsxLDIsMyx7fV0sIGZ1bmN0aW9uKHZhbCwgaW5kZXgsIGFycmF5KXtcbiAgICAgICAgcmV0dXJuIHZhbCA9PT0gMyB8fCB0aGlzLm51bSA9PT0gdmFsO1xuICAgIH0sIHtudW06IDF9KTtcbiAgICA+MVxuICAgIFxuICAgIC8veW91IGNhbiBzZWUgcmVtb3ZlIG1vZGlmaWVzIHRoZSBwYXNzZWQgaW4gYXJyYXkuXG4gICAgdmFyIGFyciA9IFsxLDIse2E6MX0sMSwge2E6MX1dO1xuICAgIEx1Yy5BcnJheS5yZW1vdmVGaXJzdChhcnIsIHthOjF9KVxuICAgID57YToxfVxuICAgIGFycjtcbiAgICA+WzEsIDIsIDEsIHthOjF9XVxuICAgIEx1Yy5BcnJheS5yZW1vdmVMYXN0KGFyciwgMSlcbiAgICA+MVxuICAgIGFycjtcbiAgICA+WzEsMiwge2E6MX1dXG4gICAgXG4gICAgXG4gICAgTHVjLkFycmF5LmZpbmRBbGwoWzEsMiwzLCB7YToxLGI6Mn1dLCBmdW5jdGlvbigpIHtyZXR1cm4gdHJ1ZTt9KVxuICAgID4gWzEsMiwzLCB7YToxLGI6Mn1dXG4gICAgLy9zaG93IGhvdyBub3Qgd29ya3Mgd2l0aCBhbiBpdGVyYXRvclxuICAgIEx1Yy5BcnJheS5maW5kQWxsTm90KFsxLDIsMywge2E6MSxiOjJ9XSwgZnVuY3Rpb24oKSB7cmV0dXJuIHRydWU7fSlcbiAgICA+W11cbiAqXG4gKiBGb3IgY29tbW9ubHkgdXNlZCBmaW5kL3JlbW92ZSBmdW5jdGlvbnMgY2hlY2sgb3V0IEx1Yy5BcnJheUZucyBmb3IgZXhhbXBsZSBhXG4gKiBcImNvbXBhY3RcIiBsaWtlIGZ1bmN0aW9uXG4gKiBcbiAgICBMdWMuQXJyYXkuZmluZEFsbE5vdEZhbHN5KFtmYWxzZSwgJycsIHVuZGVmaW5lZCwgMCwge30sIFtdXSlcbiAgICA+WzAsIHt9LCBbXV1cbiAqXG4gKiBPciByZW1vdmUgYWxsIGVtcHR5IGl0ZW1zXG4gKiBcbiAgICB2YXIgYXJyID0gWycnLCAwICwgW10sIHthOjF9LCB0cnVlLCB7fSwgWzFdXVxuICAgIEx1Yy5BcnJheS5yZW1vdmVBbGxFbXB0eShhcnIpXG4gICAgPlsnJywgW10sIHt9XVxuICAgIGFyclxuICAgID5bMCwge2E6MX0sIHRydWUsIFsxXV1cbiAqL1xuXG4vKipcbiAqIFR1cm4gdGhlIHBhc3NlZCBpbiBpdGVtIGludG8gYW4gYXJyYXkgaWYgaXRcbiAqIGlzbid0IG9uZSBhbHJlYWR5LCBpZiB0aGUgaXRlbSBpcyBhbiBhcnJheSBqdXN0IHJldHVybiBpdC4gIFxuICogSXQgcmV0dXJucyBhbiBlbXB0eSBhcnJheSBpZiBpdGVtIGlzIG51bGwgb3IgdW5kZWZpbmVkLlxuICogSWYgaXQgaXMganVzdCBhIHNpbmdsZSBpdGVtIHJldHVybiBhbiBhcnJheSBjb250YWluaW5nIHRoZSBpdGVtLlxuICogXG4gICAgTHVjLkFycmF5LnRvQXJyYXkoKVxuICAgID5bXVxuICAgIEx1Yy5BcnJheS50b0FycmF5KG51bGwpXG4gICAgPltdXG4gICAgTHVjLkFycmF5LnRvQXJyYXkoMSlcbiAgICA+WzFdXG4gICAgTHVjLkFycmF5LnRvQXJyYXkoWzEsMl0pXG4gICAgPlsxLCAyXVxuICpcbiAqIEBwYXJhbSAge09iamVjdH0gaXRlbSBpdGVtIHRvIHR1cm4gaW50byBhbiBhcnJheS5cbiAqIEByZXR1cm4gdGhlIGFycmF5XG4gKi9cbmZ1bmN0aW9uIHRvQXJyYXkoaXRlbSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGl0ZW0pKSB7XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgIH1cbiAgICByZXR1cm4gKGl0ZW0gPT09IG51bGwgfHwgaXRlbSA9PT0gdW5kZWZpbmVkKSA/IFtdIDogW2l0ZW1dO1xufVxuXG4vKipcbiAqIFJldHVybiB0aGUgbGFzdCBpdGVtIG9mIHRoZSBhcnJheVxuICogQHBhcmFtICB7QXJyYXl9IGFyclxuICogQHJldHVybiB7T2JqZWN0fSB0aGUgaXRlbVxuICAgIFxuICAgIHZhciBteUxvbmdBcnJheU5hbWVGb3JUaGluZ3NUaGF0SVdhbnRUb0tlZXBUcmFja09mID0gWzEsMiwzXVxuICAgIFxuICAgIEx1Yy5BcnJheS5sYXN0KG15TG9uZ0FycmF5TmFtZUZvclRoaW5nc1RoYXRJV2FudFRvS2VlcFRyYWNrT2YpO1xuICAgIHZzLlxuICAgIG15TG9uZ0FycmF5TmFtZUZvclRoaW5nc1RoYXRJV2FudFRvS2VlcFRyYWNrT2ZbbXlMb25nQXJyYXlOYW1lRm9yVGhpbmdzVGhhdElXYW50VG9LZWVwVHJhY2tPZi5sZW5ndGggLTFdXG4gKlxuICovXG5mdW5jdGlvbiBsYXN0KGFycikge1xuICAgIHJldHVybiBhcnJbYXJyLmxlbmd0aCAtMV07XG59XG5cbi8qKlxuICogRmxhdHRlbiBvdXQgYW4gYXJyYXkgb2Ygb2JqZWN0cyBiYXNlZCBvZiB0aGVpciB2YWx1ZSBmb3IgdGhlIHBhc3NlZCBpbiBrZXkuXG4gKiBUaGlzIGFsc28gdGFrZXMgYWNjb3VudCBmb3IgbnVsbC91bmRlZmluZWQgdmFsdWVzLlxuICpcbiAgICBMdWMuQXJyYXkucGx1Y2soW3VuZGVmaW5lZCwge2E6JzEnLCBiOjJ9LCB7YjozfSwge2I6NH1dLCAnYicpXG4gICAgPlt1bmRlZmluZWQsIDIsIDMsIDRdXG4gKiBAcGFyYW0gIHtPYmplY3RbXX0gYXJyIFxuICogQHBhcmFtICB7U3RyaW5nfSBrZXkgXG4gKiBAcmV0dXJuIHtBcnJheX0gICAgIFxuICovXG5mdW5jdGlvbiBwbHVjayhhcnIsIGtleSkge1xuICAgIHJldHVybiBhcnIubWFwKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZSAmJiB2YWx1ZVtrZXldO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIFJldHVybiB0aGUgaXRlbXMgaW4gYmV0d2VlbiB0aGUgcGFzc2VkIGluIGluZGV4XG4gKiBhbmQgdGhlIGVuZCBvZiB0aGUgYXJyYXkuXG4gKlxuICAgIEx1Yy5BcnJheS5mcm9tSW5kZXgoWzEsMiwzLDQsNV0sIDEpXG4gICAgPlsyLCAzLCA0LCA1XVxuXG4gKiBAcGFyYW0gIHtBcnJheS9hcmd1bWVudHN9IGFyciBcbiAqIEBwYXJhbSAge051bWJlcn0gaW5kZXggXG4gKiBAcmV0dXJuIHtBcnJheX0gdGhlIG5ldyBhcnJheS5cbiAqIFxuICovXG5mdW5jdGlvbiBmcm9tSW5kZXgoYSwgaW5kZXgpIHtcbiAgICB2YXIgYXJyID0gaXMuaXNBcmd1bWVudHMoYSkgPyBhcnJheVNsaWNlLmNhbGwoYSkgOiBhO1xuICAgIHJldHVybiBhcnJheVNsaWNlLmNhbGwoYXJyLCBpbmRleCwgYXJyLmxlbmd0aCk7XG59XG5cbi8qKlxuICogUnVucyBhbiBBcnJheS5mb3JFYWNoIGFmdGVyIGNhbGxpbmcgTHVjLkFycmF5LnRvQXJyYXkgb24gdGhlIGl0ZW0uXG4gIEl0IGlzIHZlcnkgdXNlZnVsIGZvciBzZXR0aW5nIHVwIGZsZXhpYmxlIGFwaSdzIHRoYXQgY2FuIGhhbmRsZSBub25lIG9uZSBvciBtYW55LlxuXG4gICAgTHVjLkFycmF5LmVhY2godGhpcy5pdGVtcywgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICB0aGlzLl9hZGRJdGVtKGl0ZW0pO1xuICAgIH0pO1xuXG4gICAgdnMuXG5cbiAgICBpZihBcnJheS5pc0FycmF5KHRoaXMuaXRlbXMpKXtcbiAgICAgICAgdGhpcy5pdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgIHRoaXMuX2FkZEl0ZW0oaXRlbSk7XG4gICAgICAgIH0pXG4gICAgfVxuICAgIGVsc2UgaWYodGhpcy5pdGVtcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuX2FkZEl0ZW0odGhpcy5pdGVtcyk7XG4gICAgfVxuXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgaXRlbVxuICogQHBhcmFtICB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgdGhpc0FyZyAgIFxuICpcbiAqL1xuZnVuY3Rpb24gZWFjaChpdGVtLCBmbiwgdGhpc0FyZykge1xuICAgIHZhciBhcnIgPSB0b0FycmF5KGl0ZW0pO1xuICAgIHJldHVybiBhcnIuZm9yRWFjaC5jYWxsKGFyciwgZm4sIHRoaXNBcmcpO1xufVxuXG4vKipcbiAqIEluc2VydCBvciBhcHBlbmQgdGhlIHNlY29uZCBhcnJheS9hcmd1bWVudHMgaW50byB0aGVcbiAqIGZpcnN0IGFycmF5L2FyZ3VtZW50cy4gIFRoaXMgbWV0aG9kIGRvZXMgbm90IGFsdGVyXG4gKiB0aGUgcGFzc2VkIGluIGFycmF5L2FyZ3VtZW50cy5cbiAqIFxuICogQHBhcmFtICB7QXJyYXkvYXJndW1lbnRzfSBmaXJzdEFycmF5T3JBcmdzXG4gKiBAcGFyYW0gIHtBcnJheS9hcmd1bWVudHN9IHNlY29uZEFycmF5T3JBcmdzXG4gKiBAcGFyYW0gIHtOdW1iZXIvdHJ1ZX0gaW5kZXhPckFwcGVuZCB0cnVlIHRvIGFwcGVuZCBcbiAqIHRoZSBzZWNvbmQgYXJyYXkgdG8gdGhlIGVuZCBvZiB0aGUgZmlyc3Qgb25lLiAgSWYgaXQgaXMgYSBudW1iZXJcbiAqIGluc2VydCB0aGUgc2Vjb25kQXJyYXkgaW50byB0aGUgZmlyc3Qgb25lIGF0IHRoZSBwYXNzZWQgaW4gaW5kZXguXG4gKiBAcmV0dXJuIHtBcnJheX0gdGhlIG5ld2x5IGNyZWF0ZWQgYXJyYXkuXG4gKlxuICAgIEx1Yy5BcnJheS5pbnNlcnQoWzAsNF0sIFsxLDIsM10sIDEpO1xuICAgID5bMCwgMSwgMiwgMywgNF1cbiAgICBMdWMuQXJyYXkuaW5zZXJ0KFswLDRdLCBbMSwyLDNdLCB0cnVlKTtcbiAgICA+WzAsIDQsIDEsIDIsIDNdXG4gICAgTHVjLkFycmF5Lmluc2VydChbMCw0XSwgWzEsMiwzXSwgMCk7XG4gICAgPlsxLCAyLCAzLCAwLCA0XVxuICpcbiAqL1xuZnVuY3Rpb24gaW5zZXJ0KGZpcnN0QXJyYXlPckFyZ3MsIHNlY29uZEFycmF5T3JBcmdzLCBpbmRleE9yQXBwZW5kKSB7XG4gICAgdmFyIGZpcnN0QXJyYXkgPSBhcnJheVNsaWNlLmNhbGwoZmlyc3RBcnJheU9yQXJncyksXG4gICAgICAgIHNlY29uZEFycmF5ID0gYXJyYXlTbGljZS5jYWxsKHNlY29uZEFycmF5T3JBcmdzKSxcbiAgICAgICAgc3BsaWNlQXJncztcblxuICAgIGlmKGluZGV4T3JBcHBlbmQgPT09IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIGZpcnN0QXJyYXkuY29uY2F0KHNlY29uZEFycmF5KTtcbiAgICB9XG5cbiAgICBzcGxpY2VBcmdzID0gW2luZGV4T3JBcHBlbmQsIDBdLmNvbmNhdChzZWNvbmRBcnJheSk7XG4gICAgZmlyc3RBcnJheS5zcGxpY2UuYXBwbHkoZmlyc3RBcnJheSwgc3BsaWNlQXJncyk7XG4gICAgcmV0dXJuIGZpcnN0QXJyYXk7XG59XG5cbi8qKlxuICogUmVtb3ZlIGFuIGl0ZW0gZnJvbSB0aGUgcGFzc2VkIGluIGFyclxuICogZnJvbSB0aGUgaW5kZXguXG4gKiBAcGFyYW0gIHtBcnJheX0gYXJyXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IGluZGV4XG4gKiBAcmV0dXJuIHtPYmplY3R9IHRoZSBpdGVtIHJlbW92ZWQuXG4gKlxuICAgIHZhciBhcnIgPSBbMSwyLDNdO1xuICAgIEx1Yy5BcnJheS5yZW1vdmVBdEluZGV4KGFyciwgMSk7XG4gICAgPjJcbiAgICBhcnI7XG4gICAgPlsxLDNdXG5cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlQXRJbmRleChhcnIsIGluZGV4KSB7XG4gICAgdmFyIGl0ZW0gPSBhcnJbaW5kZXhdO1xuICAgIGFyci5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIHJldHVybiBpdGVtO1xufVxuXG5mdW5jdGlvbiBfcmVtb3ZlRmlyc3QoYXJyLCBmbikge1xuICAgIHZhciByZW1vdmVkID0gZmFsc2U7XG5cbiAgICBhcnIuc29tZShmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcbiAgICAgICAgaWYgKGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpIHtcbiAgICAgICAgICAgIHJlbW92ZWQgPSByZW1vdmVBdEluZGV4KGFyciwgaW5kZXgpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiByZW1vdmVkO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgZmlyc3QgaXRlbSBmcm9tIHRoZSBwYXNzZWQgaW4gYXJyYXlcbiAqIHRoYXQge0BsaW5rIEx1YyNjb21wYXJlIG1hdGNoZXN9IHRoZSBwYXNzZWQgaW4gb2JqZWN0LiAgSW5zdGVhZCBvZiBcbiAqIGNvbXBhcmluZyBhbiBvYmplY3QgYW4gaXRlcmF0b3IgZnVuY3Rpb24gY2FuIGJlXG4gKiB1c2VkLlxuICogXG57Y29weURvYyNhcnJQYXJhbXN9XG57Y29weURvYyNhcnJSZW1vdmVTaW5nbGV9XG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUZpcnN0KGFyciwgb2JqLCBjb25maWcpIHtcbiAgICB2YXIgZm4gPSBfY3JlYXRlSXRlcmF0b3JGbihvYmosIGNvbmZpZyk7XG4gICAgcmV0dXJuIF9yZW1vdmVGaXJzdChhcnIsIGZuKTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGZpcnN0IGl0ZW0gZnJvbSB0aGUgcGFzc2VkIGluIGFycmF5XG4gKiB0aGF0IGRvZXMgbm90IHtAbGluayBMdWMjY29tcGFyZSBtYXRjaH0gdGhlIHBhc3NlZCBpbiBvYmplY3QuICBJbnN0ZWFkIG9mIFxuICogY29tcGFyaW5nIGFuIG9iamVjdCBhbiBpdGVyYXRvciBmdW5jdGlvbiBjYW4gYmVcbiAqIHVzZWQuXG4gKiBcbntjb3B5RG9jI2FyclBhcmFtc31cbntjb3B5RG9jI2FyclJlbW92ZVNpbmdsZX1cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlRmlyc3ROb3QoYXJyLCBvYmosIGNvbmZpZykge1xuICAgIHZhciBmbiA9IF9jcmVhdGVJdGVyYXRvck5vdEZuKG9iaiwgY29uZmlnKTtcbiAgICByZXR1cm4gX3JlbW92ZUZpcnN0KGFyciwgZm4pO1xufVxuXG5cbmZ1bmN0aW9uIF9yZW1vdmVBbGwoYXJyLCBmbikge1xuICAgIHZhciBpbmRleHNUb1JlbW92ZSA9IFtdLFxuICAgICAgICByZW1vdmVkID0gW107XG5cbiAgICBhcnIuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcbiAgICAgICAgaWYgKGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpIHtcbiAgICAgICAgICAgIGluZGV4c1RvUmVtb3ZlLnVuc2hpZnQoaW5kZXgpO1xuICAgICAgICAgICAgcmVtb3ZlZC5wdXNoKHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgaW5kZXhzVG9SZW1vdmUuZm9yRWFjaChmdW5jdGlvbihpbmRleCl7XG4gICAgICAgIHJlbW92ZUF0SW5kZXgoYXJyLCBpbmRleCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVtb3ZlZDtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGFsbCB0aGUgaXRlbXMgZnJvbSB0aGUgcGFzc2VkIGluIGFycmF5XG4gKiB0aGF0IGRvIG5vdCB7QGxpbmsgTHVjI2NvbXBhcmUgbWF0Y2h9IHRoZSBwYXNzZWQgaW4gb2JqZWN0LiAgSW5zdGVhZCBvZiBcbiAqIGNvbXBhcmluZyBhbiBvYmplY3QgYW4gaXRlcmF0b3IgZnVuY3Rpb24gY2FuIGJlXG4gKiB1c2VkLlxuICogXG57Y29weURvYyNhcnJQYXJhbXN9XG57Y29weURvYyNhcnJSZW1vdmVBbGx9XG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUFsbE5vdChhcnIsIG9iaiwgY29uZmlnKSB7XG4gICAgdmFyIGZuID0gX2NyZWF0ZUl0ZXJhdG9yTm90Rm4ob2JqLCBjb25maWcpO1xuICAgIHJldHVybiBfcmVtb3ZlQWxsKGFyciwgZm4pO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgYWxsIHRoZSBpdGVtcyBmcm9tIHRoZSBwYXNzZWQgaW4gYXJyYXlcbiAqIHRoYXQge0BsaW5rIEx1YyNjb21wYXJlIG1hdGNoZXN9IHRoZSBwYXNzZWQgaW4gb2JqZWN0LiAgSW5zdGVhZCBvZiBcbiAqIGNvbXBhcmluZyBhbiBvYmplY3QgYW4gaXRlcmF0b3IgZnVuY3Rpb24gY2FuIGJlXG4gKiB1c2VkLlxuICogXG57Y29weURvYyNhcnJQYXJhbXN9XG57Y29weURvYyNhcnJSZW1vdmVBbGx9XG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUFsbChhcnIsIG9iaiwgY29uZmlnKSB7XG4gICAgdmFyIGZuID0gX2NyZWF0ZUl0ZXJhdG9yRm4ob2JqLCBjb25maWcpO1xuICAgIHJldHVybiBfcmVtb3ZlQWxsKGFyciwgZm4pO1xufVxuXG5mdW5jdGlvbiBfZmluZEZpcnN0KGFyciwgZm4pIHtcbiAgICB2YXIgaXRlbSA9IGZhbHNlO1xuICAgIGFyci5zb21lKGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xuICAgICAgICBpZiAoZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKSkge1xuICAgICAgICAgICAgaXRlbSA9IGFycltpbmRleF07XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGl0ZW07XG59XG5cbi8qKlxuICogRmluZCB0aGUgZmlyc3QgaXRlbSBmcm9tIHRoZSBwYXNzZWQgaW4gYXJyYXlcbiAqIHRoYXQgZG9lcyB7QGxpbmsgTHVjI2NvbXBhcmUgbWF0Y2hlc30gdGhlIHBhc3NlZCBpbiBvYmplY3QuICBJbnN0ZWFkIG9mIFxuICogY29tcGFyaW5nIGFuIG9iamVjdCBhbiBpdGVyYXRvciBmdW5jdGlvbiBjYW4gYmVcbiAqIHVzZWQuXG4gKiBcbntjb3B5RG9jI2FyclBhcmFtc31cbntjb3B5RG9jI2FyckZpbmRTaW5nbGV9XG4gKi9cbmZ1bmN0aW9uIGZpbmRGaXJzdChhcnIsIG9iaiwgY29uZmlnKSB7XG4gICAgdmFyIGZuID0gX2NyZWF0ZUl0ZXJhdG9yRm4ob2JqLCBjb25maWcpO1xuICAgIHJldHVybiBfZmluZEZpcnN0KGFyciwgZm4pO1xufVxuXG4vKipcbiAqIEZpbmQgdGhlIGZpcnN0IGl0ZW0gZnJvbSB0aGUgcGFzc2VkIGluIGFycmF5XG4gKiB0aGF0IGRvZXMgbm90IHtAbGluayBMdWMjY29tcGFyZSBtYXRjaH0gdGhlIHBhc3NlZCBpbiBvYmplY3QuICBJbnN0ZWFkIG9mIFxuICogY29tcGFyaW5nIGFuIG9iamVjdCBhbiBpdGVyYXRvciBmdW5jdGlvbiBjYW4gYmVcbiAqIHVzZWQuXG4gKiBcbntjb3B5RG9jI2FyclBhcmFtc31cbntjb3B5RG9jI2FyckZpbmRTaW5nbGV9XG4gKi9cbmZ1bmN0aW9uIGZpbmRGaXJzdE5vdChhcnIsIG9iaiwgY29uZmlnKSB7XG4gICAgdmFyIGZuID0gX2NyZWF0ZUl0ZXJhdG9yTm90Rm4ob2JqLCBjb25maWcpO1xuICAgIHJldHVybiBfZmluZEZpcnN0KGFyciwgZm4pO1xufVxuXG5mdW5jdGlvbiBfZmluZEFsbChhcnIsIGZuKSB7XG4gICAgcmV0dXJuIGFyci5maWx0ZXIoZm4pO1xufVxuXG4vKipcbiAqIEZpbmQgYWxsIG9mIHRoZSB0aGUgaXRlbXMgZnJvbSB0aGUgcGFzc2VkIGluIGFycmF5XG4gKiB0aGF0IHtAbGluayBMdWMjY29tcGFyZSBtYXRjaGVzfSB0aGUgcGFzc2VkIGluIG9iamVjdC4gIEluc3RlYWQgb2YgXG4gKiBjb21wYXJpbmcgYW4gb2JqZWN0IGFuIGl0ZXJhdG9yIGZ1bmN0aW9uIGNhbiBiZVxuICogdXNlZC5cbiAqIFxue2NvcHlEb2MjYXJyUGFyYW1zfVxue2NvcHlEb2MjYXJyRmluZEFsbH1cbiAqL1xuZnVuY3Rpb24gZmluZEFsbChhcnIsIG9iaiwgY29uZmlnKSB7XG4gICAgdmFyIGZuID0gX2NyZWF0ZUl0ZXJhdG9yRm4ob2JqLCBjb25maWcpO1xuICAgIHJldHVybiBfZmluZEFsbChhcnIsIGZuKTtcbn1cblxuLyoqXG4gKiBGaW5kIGFsbCBvZiB0aGUgdGhlIGl0ZW1zIGZyb20gdGhlIHBhc3NlZCBpbiBhcnJheVxuICogdGhhdCBkbyBub3Qge0BsaW5rIEx1YyNjb21wYXJlIG1hdGNofSB0aGUgcGFzc2VkIGluIG9iamVjdC4gIEluc3RlYWQgb2YgXG4gKiBjb21wYXJpbmcgYW4gb2JqZWN0IGFuIGl0ZXJhdG9yIGZ1bmN0aW9uIGNhbiBiZVxuICogdXNlZC5cbiAqIFxue2NvcHlEb2MjYXJyUGFyYW1zfVxue2NvcHlEb2MjYXJyRmluZEFsbH1cbiAqL1xuZnVuY3Rpb24gZmluZEFsbE5vdChhcnIsIG9iaiwgY29uZmlnKSB7XG4gICAgdmFyIGZuID0gX2NyZWF0ZUl0ZXJhdG9yTm90Rm4ob2JqLCBjb25maWcpO1xuICAgIHJldHVybiBfZmluZEFsbChhcnIsIGZuKTtcbn1cblxuXG5leHBvcnRzLnRvQXJyYXkgPSB0b0FycmF5O1xuZXhwb3J0cy5lYWNoID0gZWFjaDtcbmV4cG9ydHMuaW5zZXJ0ID0gaW5zZXJ0O1xuZXhwb3J0cy5mcm9tSW5kZXggPSBmcm9tSW5kZXg7XG5leHBvcnRzLmxhc3QgPSBsYXN0O1xuZXhwb3J0cy5wbHVjayA9IHBsdWNrO1xuXG5leHBvcnRzLnJlbW92ZUF0SW5kZXggPSByZW1vdmVBdEluZGV4O1xuZXhwb3J0cy5maW5kRmlyc3ROb3QgPSBmaW5kRmlyc3ROb3Q7XG5leHBvcnRzLmZpbmRBbGxOb3QgPSBmaW5kQWxsTm90O1xuZXhwb3J0cy5maW5kRmlyc3QgPSBmaW5kRmlyc3Q7XG5leHBvcnRzLmZpbmRBbGwgPSBmaW5kQWxsO1xuXG5leHBvcnRzLnJlbW92ZUZpcnN0Tm90ID0gcmVtb3ZlRmlyc3ROb3Q7XG5leHBvcnRzLnJlbW92ZUFsbE5vdCA9IHJlbW92ZUFsbE5vdDtcbmV4cG9ydHMucmVtb3ZlRmlyc3QgPSByZW1vdmVGaXJzdDtcbmV4cG9ydHMucmVtb3ZlQWxsID0gcmVtb3ZlQWxsO1xuXG4oZnVuY3Rpb24oKXtcbiAgICB2YXIgX2NyZWF0ZUxhc3RGbiA9IGZ1bmN0aW9uKGZuTmFtZSkge1xuICAgICAgICB2YXIgbGFzdE5hbWUgPSBmbk5hbWUucmVwbGFjZSgnRmlyc3QnLCAnTGFzdCcpO1xuXG4gICAgICAgIGV4cG9ydHNbbGFzdE5hbWVdID0gZnVuY3Rpb24oYXJyLCBvYmosIGNvbmZpZykge1xuICAgICAgICAgICAgdmFyIHJldDtcblxuICAgICAgICAgICAgYXJyLnJldmVyc2UoKTtcbiAgICAgICAgICAgIHJldCA9IGV4cG9ydHNbZm5OYW1lXShhcnIsIG9iaiwgY29uZmlnKTtcbiAgICAgICAgICAgIGFyci5yZXZlcnNlKCk7XG5cbiAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH07XG5cbiAgICB9LCBuYW1lc1RvQWRkTGFzdCA9IFsnZmluZEZpcnN0Tm90JywgJ2ZpbmRGaXJzdCcsICdyZW1vdmVGaXJzdE5vdCcsICdyZW1vdmVGaXJzdCddO1xuXG4gICAgbmFtZXNUb0FkZExhc3QuZm9yRWFjaChmdW5jdGlvbihmbk5hbWUpIHtcbiAgICAgICAgX2NyZWF0ZUxhc3RGbihmbk5hbWUpO1xuICAgIH0pO1xuXG59KCkpO1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjLkFycmF5IFxuICogQG1ldGhvZCBmaW5kTGFzdE5vdCBcbiAqIFNhbWUgYXMgTHVjLkFycmF5LmZpbmRGaXJzdE5vdCBleGNlcHQgc3RhcnQgYXQgdGhlIGVuZC5cbiAqL1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjLkFycmF5IFxuICogQG1ldGhvZCBmaW5kTGFzdFxuICogU2FtZSBhcyBMdWMuQXJyYXkuZmluZEZpcnN0IGV4Y2VwdCBzdGFydCBhdCB0aGUgZW5kLlxuICovXG5cbi8qKlxuICogQG1lbWJlciBMdWMuQXJyYXkgXG4gKiBAbWV0aG9kIHJlbW92ZUxhc3ROb3QgXG4gKiBTYW1lIGFzIEx1Yy5BcnJheS5yZW1vdmVGaXJzdE5vdCBleGNlcHQgc3RhcnQgYXQgdGhlIGVuZC5cbiAqL1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjLkFycmF5IFxuICogQG1ldGhvZCByZW1vdmVMYXN0IFxuICogU2FtZSBhcyBMdWMuQXJyYXkucmVtb3ZlRmlyc3QgZXhjZXB0IHN0YXJ0IGF0IHRoZSBlbmQuXG4gKi9cbiIsInZhciBpcyA9IHJlcXVpcmUoJy4vaXMnKSxcbiAgICBhSW5zZXJ0ID0gcmVxdWlyZSgnLi9hcnJheScpLmluc2VydCxcbiAgICBhRWFjaCA9IHJlcXVpcmUoJy4vYXJyYXknKS5lYWNoO1xuXG4vKipcbiAqIEBjbGFzcyBMdWMuRnVuY3Rpb25cbiAqIFBhY2thZ2UgZm9yIGZ1bmN0aW9uIG1ldGhvZHMuICBNb3N0IG9mIHRoZW0gZm9sbG93IHRoZSBzYW1lIGFwaTpcbiAqIGZ1bmN0aW9uIG9yIGZ1bmN0aW9uW10sIHJlbGV2YW50IGFyZ3MgLi4uIHdpdGggYW4gb3B0aW9uYWwgY29uZmlnXG4gKiB0byBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudGVyIGFzIHRoZSBsYXN0IGFyZ3VtZW50LlxuICovXG5cbmZ1bmN0aW9uIF9hdWdtZW50QXJncyhjb25maWcsIGNhbGxBcmdzKSB7XG4gICAgdmFyIGNvbmZpZ0FyZ3MgPSBjb25maWcuYXJncyxcbiAgICAgICAgaW5kZXggPSBjb25maWcuaW5kZXgsXG4gICAgICAgIGFyZ3NBcnJheTtcblxuICAgIGlmICghY29uZmlnQXJncykge1xuICAgICAgICByZXR1cm4gY2FsbEFyZ3M7XG4gICAgfVxuXG4gICAgaWYoaW5kZXggPT09IHRydWUgfHwgaXMuaXNOdW1iZXIoaW5kZXgpKSB7XG4gICAgICAgIGlmKGNvbmZpZy5hcmd1bWVudHNGaXJzdCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBhSW5zZXJ0KGNvbmZpZ0FyZ3MsIGNhbGxBcmdzLCBpbmRleCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFJbnNlcnQoY2FsbEFyZ3MsIGNvbmZpZ0FyZ3MsIGluZGV4KTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29uZmlnQXJncztcbn1cblxuLyoqXG4gKiBBIHJldXNhYmxlIGVtcHR5IGZ1bmN0aW9uXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZXhwb3J0cy5lbXB0eUZuID0gZnVuY3Rpb24oKSB7fTtcblxuLyoqXG4gKiBBIGZ1bmN0aW9uIHRoYXQgdGhyb3dzIGFuIGVycm9yIHdoZW4gY2FsbGVkLlxuICogVXNlZnVsIHdoZW4gZGVmaW5pbmcgYWJzdHJhY3QgbGlrZSBjbGFzc2VzXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZXhwb3J0cy5hYnN0cmFjdEZuID0gZnVuY3Rpb24oKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdhYnN0cmFjdEZuIG11c3QgYmUgaW1wbGVtZW50ZWQnKTtcbn07XG5cbi8qKlxuICogQXVnbWVudCB0aGUgcGFzc2VkIGluIGZ1bmN0aW9uJ3MgdGhpc0FyZyBhbmQgb3IgYXJndW1lbnRzIG9iamVjdCBcbiAqIGJhc2VkIG9uIHRoZSBwYXNzZWQgaW4gY29uZmlnLlxuICogXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gZm4gdGhlIGZ1bmN0aW9uIHRvIGNhbGxcbiAqIEBwYXJhbSAge09iamVjdH0gY29uZmlnXG4gKiBcbiAqIEBwYXJhbSB7T2JqZWN0fSBbY29uZmlnLnRoaXNBcmddIHRoZSB0aGlzQXJnIGZvciB0aGUgZnVuY3Rpb24gYmVpbmcgZXhlY3V0ZWQuXG4gKiBJZiB0aGlzIGlzIHRoZSBvbmx5IHByb3BlcnR5IG9uIHlvdXIgY29uZmlnIG9iamVjdCB0aGUgcHJlZmVycmVkIHdheSB3b3VsZFxuICogYmUganVzdCB0byB1c2UgRnVuY3Rpb24uYmluZFxuICogXG4gKiBAcGFyYW0ge0FycmF5fSBbY29uZmlnLmFyZ3NdIHRoZSBhcmd1bWVudHMgdXNlZCBmb3IgdGhlIGZ1bmN0aW9uIGJlaW5nIGV4ZWN1dGVkLlxuICogVGhpcyB3aWxsIHJlcGxhY2UgdGhlIGZ1bmN0aW9ucyBjYWxsIGFyZ3MgaWYgaW5kZXggaXMgbm90IGEgbnVtYmVyIG9yIFxuICogdHJ1ZS5cbiAqIFxuICogQHBhcmFtIHtOdW1iZXIvVHJ1ZX0gW2NvbmZpZy5pbmRleF0gQnkgZGVmYXVsdCB0aGUgdGhlIGNvbmZpZ3VyZWQgYXJndW1lbnRzXG4gKiB3aWxsIGJlIGluc2VydGVkIGludG8gdGhlIGZ1bmN0aW9ucyBwYXNzZWQgaW4gY2FsbCBhcmd1bWVudHMuICBJZiBpbmRleCBpcyB0cnVlXG4gKiBhcHBlbmQgdGhlIGFyZ3MgdG9nZXRoZXIgaWYgaXQgaXMgYSBudW1iZXIgaW5zZXJ0IGl0IGF0IHRoZSBwYXNzZWQgaW4gaW5kZXguXG4gKiBcbiAqIEBwYXJhbSB7QXJyYXl9IFtjb25maWcuYXJndW1lbnRzRmlyc3RdIHBhc3MgaW4gZmFsc2UgdG8gXG4gKiBhdWdtZW50IHRoZSBjb25maWd1cmVkIGFyZ3MgZmlyc3Qgd2l0aCBMdWMuQXJyYXkuaW5zZXJ0LiAgRGVmYXVsdHNcbiAqIHRvIHRydWVcbiAgICAgXG4gICAgIGZ1bmN0aW9uIGZuKCkge1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzKVxuICAgICAgICBjb25zb2xlLmxvZyhhcmd1bWVudHMpXG4gICAgfVxuICAgIFxuICAgIC8vTHVjLkFycmF5Lmluc2VydChbNF0sIFsxLDIsM10sIDApXG4gICAgTHVjLkZ1bmN0aW9uLmNyZWF0ZUF1Z21lbnRlcihmbiwge1xuICAgICAgICB0aGlzQXJnOiB7Y29uZmlnZWRUaGlzQXJnOiB0cnVlfSxcbiAgICAgICAgYXJnczogWzEsMiwzXSxcbiAgICAgICAgaW5kZXg6MFxuICAgIH0pKDQpXG5cbiAgICA+T2JqZWN0IHtjb25maWdlZFRoaXNBcmc6IHRydWV9XG4gICAgPlsxLCAyLCAzLCA0XVxuXG4gICAgLy9MdWMuQXJyYXkuaW5zZXJ0KFsxLDIsM10sIFs0XSwgMClcbiAgICBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudGVyKGZuLCB7XG4gICAgICAgIHRoaXNBcmc6IHtjb25maWdlZFRoaXNBcmc6IHRydWV9LFxuICAgICAgICBhcmdzOiBbMSwyLDNdLFxuICAgICAgICBpbmRleDowLFxuICAgICAgICBhcmd1bWVudHNGaXJzdDpmYWxzZVxuICAgIH0pKDQpXG5cbiAgICA+T2JqZWN0IHtjb25maWdlZFRoaXNBcmc6IHRydWV9XG4gICAgPls0LCAxLCAyLCAzXVxuXG4gICAgTHVjLkFycmF5Lmluc2VydChbNF0sIFsxLDIsM10sICB0cnVlKVxuICAgIHZhciBmID0gTHVjLkZ1bmN0aW9uLmNyZWF0ZUF1Z21lbnRlcihmbiwge1xuICAgICAgICBhcmdzOiBbMSwyLDNdLFxuICAgICAgICBpbmRleDogdHJ1ZVxuICAgIH0pO1xuXG4gICAgZi5hcHBseSh7Y29uZmlnOiBmYWxzZX0sIFs0XSlcblxuICAgID5PYmplY3Qge2NvbmZpZzogZmFsc2V9XG4gICAgPls0LCAxLCAyLCAzXVxuXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gdGhlIGF1Z21lbnRlZCBmdW5jdGlvbi5cbiAqL1xuZXhwb3J0cy5jcmVhdGVBdWdtZW50ZXIgPSBmdW5jdGlvbihmbiwgY29uZmlnKSB7XG4gICAgdmFyIHRoaXNBcmcgPSBjb25maWcudGhpc0FyZztcblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGZuLmFwcGx5KHRoaXNBcmcgfHwgdGhpcywgX2F1Z21lbnRBcmdzKGNvbmZpZywgYXJndW1lbnRzKSk7XG4gICAgfTtcbn07XG5cbmZ1bmN0aW9uIF9pbml0U2VxdWVuY2VGdW5jdGlvbnMoZm5zLCBjb25maWcpIHtcbiAgICB2YXIgdG9SdW4gPSBbXTtcbiAgICBhRWFjaChmbnMsIGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgdmFyIGZuID0gZjtcblxuICAgICAgICBpZiAoY29uZmlnKSB7XG4gICAgICAgICAgICBmbiA9IGV4cG9ydHMuY3JlYXRlQXVnbWVudGVyKGYsIGNvbmZpZyk7XG4gICAgICAgIH1cblxuICAgICAgICB0b1J1bi5wdXNoKGZuKTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0b1J1bjtcbn1cblxuLyoqXG4gKiBSZXR1cm4gYSBmdW5jdGlvbiB0aGF0IHJ1bnMgdGhlIHBhc3NlZCBpbiBmdW5jdGlvbnNcbiAqIGFuZCByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIGxhc3QgZnVuY3Rpb24gY2FsbGVkLlxuICogXG4gKiBAcGFyYW0gIHtGdW5jdGlvbltdfSBmbnMgXG4gKiBAcGFyYW0gIHtPYmplY3R9IFtjb25maWddIENvbmZpZyBvYmplY3RcbiAqIGZvciBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudGVyLiAgSWYgZGVmaW5lZCBhbGwgb2YgdGhlIGZ1bmN0aW9uc1xuICogd2lsbCBnZXQgY3JlYXRlZCB3aXRoIHRoZSBwYXNzZWQgaW4gY29uZmlnO1xuICpcbiAgICBMdWMuRnVuY3Rpb24uY3JlYXRlU2VxdWVuY2UoW1xuICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKDEpXG4gICAgICAgIH0sXG4gICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coMilcbiAgICAgICAgfSxcbiAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygzKVxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2ZpbmlzaGVkIGxvZ2dpbmcnKVxuICAgICAgICAgICAgcmV0dXJuIDQ7XG4gICAgICAgIH1cbiAgICBdKSgpXG4gICAgPjFcbiAgICA+MlxuICAgID4zXG4gICAgPmZpbmlzaGVkIGxvZ2dpbmdcbiAgICA+NFxuICogXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZXhwb3J0cy5jcmVhdGVTZXF1ZW5jZSA9IGZ1bmN0aW9uKGZucywgY29uZmlnKSB7XG4gICAgdmFyIGZ1bmN0aW9ucyA9IF9pbml0U2VxdWVuY2VGdW5jdGlvbnMoZm5zLCBjb25maWcpO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaSA9IDAsXG4gICAgICAgICAgICBsYXN0Rm5JbmRleCA9IGZ1bmN0aW9ucy5sZW5ndGggLTE7XG5cbiAgICAgICAgZm9yKDtpIDwgbGFzdEZuSW5kZXg7ICsraSkge1xuICAgICAgICAgICAgZnVuY3Rpb25zW2ldLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZnVuY3Rpb25zW2xhc3RGbkluZGV4XS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG59O1xuXG4vKipcbiAqIFJldHVybiBhIGZ1bmN0aW9uIHRoYXQgcnVucyB0aGUgcGFzc2VkIGluIGZ1bmN0aW9uc1xuICogaWYgb25lIG9mIHRoZSBmdW5jdGlvbnMgcmV0dXJucyBmYWxzZSB0aGUgcmVzdCBvZiB0aGUgXG4gKiBmdW5jdGlvbnMgd29uJ3QgcnVuIGFuZCBmYWxzZSB3aWxsIGJlIHJldHVybmVkLlxuICpcbiAqIElmIG5vIGZhbHNlIGlzIHJldHVybmVkIHRoZSB2YWx1ZSBvZiB0aGUgbGFzdCBmdW5jdGlvbiByZXR1cm4gd2lsbCBiZSByZXR1cm5lZFxuICogXG4gICAgTHVjLkZ1bmN0aW9uLmNyZWF0ZVNlcXVlbmNlSWYoW1xuICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKDEpXG4gICAgICAgIH0sXG4gICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coMilcbiAgICAgICAgfSxcbiAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygzKVxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2ZpbmlzaGVkIGxvZ2dpbmcnKVxuICAgICAgICAgICAgcmV0dXJuIDQ7XG4gICAgICAgIH0sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpIGNhbnQgbG9nJylcbiAgICAgICAgfVxuICAgIF0pKClcblxuICAgID4xXG4gICAgPjJcbiAgICA+M1xuICAgID5maW5pc2hlZCBsb2dnaW5nXG4gICAgPmZhbHNlXG4gKlxuICogXG4gKiBAcGFyYW0gIHtGdW5jdGlvbltdfSBmbnMgXG4gKiBAcGFyYW0gIHtPYmplY3R9IFtjb25maWddIENvbmZpZyBvYmplY3RcbiAqIGZvciBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudGVyLiAgSWYgZGVmaW5lZCBhbGwgb2YgdGhlIGZ1bmN0aW9uc1xuICogd2lsbCBnZXQgY3JlYXRlZCB3aXRoIHRoZSBwYXNzZWQgaW4gY29uZmlnO1xuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbmV4cG9ydHMuY3JlYXRlU2VxdWVuY2VJZiA9IGZ1bmN0aW9uKGZucywgY29uZmlnKSB7XG4gICAgdmFyIGZ1bmN0aW9ucyA9IF9pbml0U2VxdWVuY2VGdW5jdGlvbnMoZm5zLCBjb25maWcpO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdmFsdWUsXG4gICAgICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgICAgIGZ1bmN0aW9ucy5zb21lKGZ1bmN0aW9uKGZuKXtcbiAgICAgICAgICAgIHZhbHVlID0gZm4uYXBwbHkodGhpcywgYXJncyk7XG5cbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSA9PT0gZmFsc2U7XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9O1xufTtcblxuLyoqXG4gKiBSZXR1cm4gYSBmdW5jdGlvbnMgdGhhdCBydW5zIHRoZSBwYXNzZWQgaW4gZnVuY3Rpb25zXG4gKiB0aGUgcmVzdWx0IG9mIGVhY2ggZnVuY3Rpb24gd2lsbCBiZSB0aGUgdGhlIGNhbGwgYXJncyBcbiAqIGZvciB0aGUgbmV4dCBmdW5jdGlvbi4gIFRoZSB2YWx1ZSBvZiB0aGUgbGFzdCBmdW5jdGlvbiBcbiAqIHJldHVybiB3aWxsIGJlIHJldHVybmVkLlxuICogXG4gICAgIFxuICAgICBMdWMuRnVuY3Rpb24uY3JlYXRlUmVsYXllcihbXG4gICAgICAgIGZ1bmN0aW9uKHN0cikge1xuICAgICAgICAgICAgcmV0dXJuIHN0ciArICdiJ1xuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbihzdHIpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHIgKyAnYydcbiAgICAgICAgfSxcbiAgICAgICAgZnVuY3Rpb24oc3RyKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RyICsgJ2QnXG4gICAgICAgIH1cbiAgICBdKSgnYScpXG5cbiAgICA+XCJhYmNkXCJcblxuICogQHBhcmFtICB7RnVuY3Rpb25bXX0gZm5zIFxuICogQHBhcmFtICB7T2JqZWN0fSBbY29uZmlnXSBDb25maWcgb2JqZWN0XG4gKiBmb3IgTHVjLkZ1bmN0aW9uLmNyZWF0ZUF1Z21lbnRlci4gIElmIGRlZmluZWQgYWxsIG9mIHRoZSBmdW5jdGlvbnNcbiAqIHdpbGwgZ2V0IGNyZWF0ZWQgd2l0aCB0aGUgcGFzc2VkIGluIGNvbmZpZztcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5leHBvcnRzLmNyZWF0ZVJlbGF5ZXIgPSBmdW5jdGlvbihmbnMsIGNvbmZpZykge1xuICAgIHZhciBmdW5jdGlvbnMgPSBfaW5pdFNlcXVlbmNlRnVuY3Rpb25zKGZucywgY29uZmlnKTtcblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHZhbHVlLFxuICAgICAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcblxuICAgICAgICBmdW5jdGlvbnMuZm9yRWFjaChmdW5jdGlvbihmbiwgaW5kZXgpIHtcbiAgICAgICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gZm4uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gZm4uYXBwbHkodGhpcywgW3ZhbHVlXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9O1xufTtcblxuLyoqXG4gKiBDcmVhdGUgYSB0aHJvdHRsZWQgZnVuY3Rpb24gZnJvbSB0aGUgcGFzc2VkIGluIGZ1bmN0aW9uXG4gKiB0aGF0IHdpbGwgb25seSBnZXQgY2FsbGVkIG9uY2UgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHNcbiAqIGhhdmUgYmVlbiBleGNlZWRlZC5cbiAqIFxuICAgIHZhciBsb2dBcmdzICA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhhcmd1bWVudHMpXG4gICAgfTtcblxuICAgIHZhciBhID0gTHVjLkZ1bmN0aW9uLmNyZWF0ZVRocm90dGxlZChsb2dBcmdzLCAxKTtcblxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCAxMDA7ICsraSkge1xuICAgICAgICBhKDEsMiwzKTtcbiAgICB9XG5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBhKDEpXG4gICAgfSwgMTAwKVxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGEoMilcbiAgICB9LCA0MDApXG5cbiAgICA+WzEsIDIsIDNdXG4gICAgPlsxXVxuICAgID5bMl1cbiAqIFxuICogQHBhcmFtICB7RnVuY3Rpb259IGZuXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IG1pbGxpcyBOdW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvXG4gKiB0aHJvdHRsZSB0aGUgZnVuY3Rpb24uXG4gKiBAcGFyYW0gIHtPYmplY3R9IFtjb25maWddIENvbmZpZyBvYmplY3RcbiAqIGZvciBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudGVyLiAgSWYgZGVmaW5lZCBhbGwgb2YgdGhlIGZ1bmN0aW9uc1xuICogd2lsbCBnZXQgY3JlYXRlZCB3aXRoIHRoZSBwYXNzZWQgaW4gY29uZmlnO1xuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbmV4cG9ydHMuY3JlYXRlVGhyb3R0bGVkID0gZnVuY3Rpb24oZiwgbWlsbGlzLCBjb25maWcpIHtcbiAgICB2YXIgZm4gPSBjb25maWcgPyBleHBvcnRzLmNyZWF0ZUF1Z21lbnRlcihmLCBjb25maWcpIDogZixcbiAgICAgICAgdGltZU91dElkID0gZmFsc2U7XG5cbiAgICBpZighbWlsbGlzKSB7XG4gICAgICAgIHJldHVybiBmbjtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgICAgIGlmKHRpbWVPdXRJZCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVPdXRJZCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aW1lT3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGltZU91dElkID0gZmFsc2U7XG4gICAgICAgICAgICBmbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgfSwgbWlsbGlzKTtcbiAgICB9O1xufTtcblxuLyoqXG4gKiBEZWZlciBhIGZ1bmN0aW9uJ3MgZXhlY3V0aW9uIGZvciB0aGUgcGFzc2VkIGluXG4gKiBtaWxsaXNlY29uZHMuXG4gKiBcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmblxuICogQHBhcmFtICB7TnVtYmVyfSBtaWxsaXMgTnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0b1xuICogZGVmZXJcbiAqIEBwYXJhbSAge09iamVjdH0gW2NvbmZpZ10gQ29uZmlnIG9iamVjdFxuICogZm9yIEx1Yy5GdW5jdGlvbi5jcmVhdGVBdWdtZW50ZXIuICBJZiBkZWZpbmVkIGFsbCBvZiB0aGUgZnVuY3Rpb25zXG4gKiB3aWxsIGdldCBjcmVhdGVkIHdpdGggdGhlIHBhc3NlZCBpbiBjb25maWc7XG4gKiBcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5leHBvcnRzLmNyZWF0ZURlZmVycmVkID0gZnVuY3Rpb24oZiwgbWlsbGlzLCBjb25maWcpIHtcbiAgICB2YXIgZm4gPSBjb25maWcgPyBleHBvcnRzLmNyZWF0ZUF1Z21lbnRlcihmLCBjb25maWcpIDogZjtcblxuICAgIGlmKCFtaWxsaXMpIHtcbiAgICAgICAgcmV0dXJuIGZuO1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG5cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICB9LCBtaWxsaXMpO1xuICAgIH07XG59OyIsInZhciBpcyA9IHJlcXVpcmUoJy4vaXMnKTtcblxuLyoqXG4gKiBAY2xhc3MgTHVjLk9iamVjdFxuICogUGFja2FnZSBmb3IgT2JqZWN0IG1ldGhvZHMuICBMdWMuT2JqZWN0LmFwcGx5IGFuZCBMdWMuT2JqZWN0LmVhY2hcbiAqIGFyZSB1c2VkIHZlcnkgb2Z0ZW4uICBtaXggYW5kIGFwcGx5IGFyZSBhbGlhc2VkIHRvIEx1Yy5hcHBseSBhbmQgTHVjLm1peC5cbiAqL1xuXG4vKipcbiAqIEFwcGx5IHRoZSBwcm9wZXJ0aWVzIGZyb20gZnJvbU9iamVjdCB0byB0aGUgdG9PYmplY3QuICBmcm9tT2JqZWN0IHdpbGxcbiAqIG92ZXJ3cml0ZSBhbnkgc2hhcmVkIGtleXMuICBJdCBjYW4gYWxzbyBiZSB1c2VkIGFzIGEgc2ltcGxlIHNoYWxsb3cgY2xvbmUuXG4gKiBcbiAgICB2YXIgdG8gPSB7YToxLCBjOjF9LCBmcm9tID0ge2E6MiwgYjoyfVxuICAgIEx1Yy5PYmplY3QuYXBwbHkodG8sIGZyb20pXG4gICAgPk9iamVjdCB7YTogMiwgYzogMSwgYjogMn1cbiAgICB0byA9PT0gdG9cbiAgICA+dHJ1ZVxuICAgIHZhciBjbG9uZSA9IEx1Yy5PYmplY3QuYXBwbHkoe30sIGZyb20pXG4gICAgPnVuZGVmaW5lZFxuICAgIGNsb25lXG4gICAgPk9iamVjdCB7YTogMiwgYjogMn1cbiAgICBjbG9uZSA9PT0gZnJvbVxuICAgID5mYWxzZVxuICpcbiAqIE5vIG51bGwgY2hlY2tzIGFyZSBuZWVkZWQuXG4gICAgXG4gICAgTHVjLmFwcGx5KHVuZGVmaW5lZCwge2E6MX0pXG4gICAgPnthOjF9XG4gICAgTHVjLmFwcGx5KHthOiAxfSlcbiAgICA+e2E6MX1cblxuICpcbiAqIFxuICogQHBhcmFtICB7T2JqZWN0fSBbdG9PYmplY3RdIE9iamVjdCB0byBwdXQgdGhlIHByb3BlcnRpZXMgZnJvbU9iamVjdCBvbi5cbiAqIEBwYXJhbSAge09iamVjdH0gW2Zyb21PYmplY3RdIE9iamVjdCB0byBwdXQgdGhlIHByb3BlcnRpZXMgb24gdGhlIHRvT2JqZWN0XG4gKiBAcmV0dXJuIHtPYmplY3R9IHRoZSB0b09iamVjdFxuICovXG5leHBvcnRzLmFwcGx5ID0gZnVuY3Rpb24odG9PYmplY3QsIGZyb21PYmplY3QpIHtcbiAgICB2YXIgdG8gPSB0b09iamVjdCB8fCB7fSxcbiAgICAgICAgZnJvbSA9IGZyb21PYmplY3QgfHwge30sXG4gICAgICAgIHByb3A7XG5cbiAgICBmb3IgKHByb3AgaW4gZnJvbSkge1xuICAgICAgICBpZiAoZnJvbS5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgICAgdG9bcHJvcF0gPSBmcm9tW3Byb3BdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRvO1xufTtcblxuLyoqXG4gKiBTaW1pbGFyIHRvIEx1Yy5PYmplY3QuYXBwbHkgZXhjZXB0IHRoYXQgdGhlIGZyb21PYmplY3Qgd2lsbCBcbiAqIE5PVCBvdmVyd3JpdGUgdGhlIGtleXMgb2YgdGhlIHRvT2JqZWN0IGlmIHRoZXkgYXJlIGRlZmluZWQuXG4gKlxuICAgIEx1Yy5taXgoe2E6MSxiOjJ9LCB7YTozLGI6NCxjOjV9KVxuICAgID57YTogMSwgYjogMiwgYzogNX1cblxuICogTm8gbnVsbCBjaGVja3MgYXJlIG5lZWRlZC5cbiAgICBcbiAgICBMdWMubWl4KHVuZGVmaW5lZCwge2E6MX0pXG4gICAgPnthOjF9XG4gICAgTHVjLm1peCh7YTogMX0pXG4gICAgPnthOjF9XG4gICAgXG4gKlxuXG4gKiBAcGFyYW0gIHtPYmplY3R9IFt0b09iamVjdF0gT2JqZWN0IHRvIHB1dCB0aGUgcHJvcGVydGllcyBmcm9tT2JqZWN0IG9uLlxuICogQHBhcmFtICB7T2JqZWN0fSBbZnJvbU9iamVjdF0gZnJvbU9iamVjdCBPYmplY3QgdG8gcHV0IHRoZSBwcm9wZXJ0aWVzIG9uIHRoZSB0b09iamVjdFxuICogQHJldHVybiB7T2JqZWN0fSB0aGUgdG9PYmplY3RcbiAqL1xuZXhwb3J0cy5taXggPSBmdW5jdGlvbih0b09iamVjdCwgZnJvbU9iamVjdCkge1xuICAgIHZhciB0byA9IHRvT2JqZWN0IHx8IHt9LFxuICAgICAgICBmcm9tID0gZnJvbU9iamVjdCB8fCB7fSxcbiAgICAgICAgcHJvcDtcblxuICAgIGZvciAocHJvcCBpbiBmcm9tKSB7XG4gICAgICAgIGlmIChmcm9tLmhhc093blByb3BlcnR5KHByb3ApICYmIHRvW3Byb3BdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRvW3Byb3BdID0gZnJvbVtwcm9wXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0bztcbn07XG5cbi8qKlxuICogSXRlcmF0ZSBvdmVyIGFuIG9iamVjdHMgcHJvcGVydGllc1xuICogYXMga2V5IHZhbHVlIFwicGFpcnNcIiB3aXRoIHRoZSBwYXNzZWQgaW4gZnVuY3Rpb24uXG4gKiBcbiAgICB2YXIgdGhpc0FyZyA9IHt2YWw6J2MnfTtcbiAgICBMdWMuT2JqZWN0LmVhY2goe1xuICAgICAgICB1OiAnTCdcbiAgICB9LCBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHZhbHVlICsga2V5ICsgdGhpcy52YWwpXG4gICAgfSwgdGhpc0FyZylcbiAgICBcbiAgICA+THVjIFxuIFxuICogQHBhcmFtICB7T2JqZWN0fSAgIG9iaiAgdGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXJcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmbiAgIHRoZSBmdW5jdGlvbiB0byBjYWxsXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGZuLmtleSAgIHRoZSBvYmplY3Qga2V5XG4gKiBAcGFyYW0gIHtPYmplY3R9IGZuLnZhbHVlICAgdGhlIG9iamVjdCB2YWx1ZVxuICogQHBhcmFtICB7T2JqZWN0fSAgIFt0aGlzQXJnXSBcbiAqIEBwYXJhbSB7T2JqZWN0fSAgW2NvbmZpZ11cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gIGNvbmZpZy5vd25Qcm9wZXJ0aWVzIHNldCB0byBmYWxzZVxuICogdG8gaXRlcmF0ZSBvdmVyIGFsbCBvZiB0aGUgb2JqZWN0cyBlbnVtZXJhYmxlIHByb3BlcnRpZXMuXG4gKi9cbmV4cG9ydHMuZWFjaCA9IGZ1bmN0aW9uKG9iaiwgZm4sIHRoaXNBcmcsIGNvbmZpZykge1xuICAgIHZhciBrZXksIHZhbHVlLFxuICAgICAgICBhbGxQcm9wZXJ0aWVzID0gY29uZmlnICYmIGNvbmZpZy5vd25Qcm9wZXJ0aWVzID09PSBmYWxzZTtcblxuICAgIGlmIChhbGxQcm9wZXJ0aWVzKSB7XG4gICAgICAgIGZvciAoa2V5IGluIG9iaikge1xuICAgICAgICAgICAgZm4uY2FsbCh0aGlzQXJnLCBrZXksIG9ialtrZXldKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAoa2V5IGluIG9iaikge1xuICAgICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgZm4uY2FsbCh0aGlzQXJnLCBrZXksIG9ialtrZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8qKlxuICogVGFrZSBhbiBhcnJheSBvZiBzdHJpbmdzIGFuZCBhbiBhcnJheS9hcmd1bWVudHMgb2ZcbiAqIHZhbHVlcyBhbmQgcmV0dXJuIGFuIG9iamVjdCBvZiBrZXkgdmFsdWUgcGFpcnNcbiAqIGJhc2VkIG9mZiBlYWNoIGFycmF5cyBpbmRleC4gIEl0IGlzIHVzZWZ1bCBmb3IgdGFraW5nXG4gKiBhIGxvbmcgbGlzdCBvZiBhcmd1bWVudHMgYW5kIGNyZWF0aW5nIGFuIG9iamVjdCB0aGF0IGNhblxuICogYmUgcGFzc2VkIHRvIG90aGVyIG1ldGhvZHMuXG4gKiBcbiAgICBmdW5jdGlvbiBsb25nQXJncyhhLGIsYyxkLGUsZikge1xuICAgICAgICByZXR1cm4gTHVjLk9iamVjdC50b09iamVjdChbJ2EnLCdiJywgJ2MnLCAnZCcsICdlJywgJ2YnXSwgYXJndW1lbnRzKVxuICAgIH1cblxuICAgIGxvbmdBcmdzKDEsMiwzLDQsNSw2LDcsOCw5KVxuXG4gICAgPk9iamVjdCB7YTogMSwgYjogMiwgYzogMywgZDogNCwgZTogNeKApn1cbiAgICBhOiAxXG4gICAgYjogMlxuICAgIGM6IDNcbiAgICBkOiA0XG4gICAgZTogNVxuICAgIGY6IDZcblxuICAgIGxvbmdBcmdzKDEsMiwzKVxuXG4gICAgPk9iamVjdCB7YTogMSwgYjogMiwgYzogMywgZDogdW5kZWZpbmVkLCBlOiB1bmRlZmluZWTigKZ9XG4gICAgYTogMVxuICAgIGI6IDJcbiAgICBjOiAzXG4gICAgZDogdW5kZWZpbmVkXG4gICAgZTogdW5kZWZpbmVkXG4gICAgZjogdW5kZWZpbmVkXG5cbiAqIEBwYXJhbSAge1N0cmluZ1tdfSBzdHJpbmdzXG4gKiBAcGFyYW0gIHtBcnJheS9hcmd1bWVudHN9IHZhbHVlc1xuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5leHBvcnRzLnRvT2JqZWN0ID0gZnVuY3Rpb24oc3RyaW5ncywgdmFsdWVzKSB7XG4gICAgdmFyIG9iaiA9IHt9LFxuICAgICAgICBpID0gMCxcbiAgICAgICAgbGVuID0gc3RyaW5ncy5sZW5ndGg7XG4gICAgZm9yICg7IGkgPCBsZW47ICsraSkge1xuICAgICAgICBvYmpbc3RyaW5nc1tpXV0gPSB2YWx1ZXNbaV07XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iajtcbn07XG5cbi8qKlxuICogUmV0dXJuIGtleSB2YWx1ZSBwYWlycyBmcm9tIHRoZSBvYmplY3QgaWYgdGhlXG4gKiBmaWx0ZXJGbiByZXR1cm5zIGEgdHJ1dGh5IHZhbHVlLlxuICpcbiAgICBMdWMuT2JqZWN0LmZpbHRlcih7XG4gICAgICAgIGE6IGZhbHNlLFxuICAgICAgICBiOiB0cnVlLFxuICAgICAgICBjOiBmYWxzZVxuICAgIH0sIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGtleSA9PT0gJ2EnIHx8IHZhbHVlXG4gICAgfSlcbiAgICA+W3trZXk6ICdhJywgdmFsdWU6IGZhbHNlfSwge2tleTogJ2InLCB2YWx1ZTogdHJ1ZX1dXG5cbiAgICBMdWMuT2JqZWN0LmZpbHRlcih7XG4gICAgICAgIGE6IGZhbHNlLFxuICAgICAgICBiOiB0cnVlLFxuICAgICAgICBjOiBmYWxzZVxuICAgIH0sIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGtleSA9PT0gJ2EnIHx8IHZhbHVlXG4gICAgfSwgdW5kZWZpbmVkLCB7XG4gICAgICAgIGtleXM6IHRydWVcbiAgICB9KVxuICAgID5bJ2EnLCAnYiddXG4gKiBcbiAqIEBwYXJhbSAge09iamVjdH0gICBvYmogIHRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gZmlsdGVyRm4gICB0aGUgZnVuY3Rpb24gdG8gY2FsbCwgcmV0dXJuIGEgdHJ1dGh5IHZhbHVlXG4gKiB0byBhZGQgdGhlIGtleSB2YWx1ZSBwYWlyXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGZpbHRlckZuLmtleSAgIHRoZSBvYmplY3Qga2V5XG4gKiBAcGFyYW0gIHtPYmplY3R9IGZpbHRlckZuLnZhbHVlICAgdGhlIG9iamVjdCB2YWx1ZVxuICogQHBhcmFtICB7T2JqZWN0fSAgIFt0aGlzQXJnXSBcbiAqIEBwYXJhbSB7T2JqZWN0fSAgW2NvbmZpZ11cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gIGNvbmZpZy5vd25Qcm9wZXJ0aWVzIHNldCB0byBmYWxzZVxuICogdG8gaXRlcmF0ZSBvdmVyIGFsbCBvZiB0aGUgb2JqZWN0cyBlbnVtZXJhYmxlIHByb3BlcnRpZXMuXG4gKiBcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gIGNvbmZpZy5rZXlzIHNldCB0byB0cnVlIHRvIHJldHVyblxuICoganVzdCB0aGUga2V5cy5cbiAqXG4gKiBAcGFyYW0ge0Jvb2xlYW59ICBjb25maWcudmFsdWVzIHNldCB0byB0cnVlIHRvIHJldHVyblxuICoganVzdCB0aGUgdmFsdWVzLlxuICogXG4gKiBAcmV0dXJuIHtPYmplY3RbXS9TdHJpbmdbXX0gQXJyYXkgb2Yga2V5IHZhbHVlIHBhaXJzIGluIHRoZSBmb3JtXG4gKiBvZiB7a2V5OiAna2V5JywgdmFsdWU6IHZhbHVlfS4gIElmIGtleXMgb3IgdmFsdWVzIGlzIHRydWUgb24gdGhlIGNvbmZpZ1xuICoganVzdCB0aGUga2V5cyBvciB2YWx1ZXMgYXJlIHJldHVybmVkLlxuICpcbiAqL1xuZXhwb3J0cy5maWx0ZXIgPSBmdW5jdGlvbihvYmosIGZpbHRlckZuLCB0aGlzQXJnLCBjKSB7XG4gICAgdmFyIHZhbHVlcyA9IFtdLFxuICAgICAgICBjb25maWcgPSBjIHx8IHt9O1xuXG4gICAgZXhwb3J0cy5lYWNoKG9iaiwgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICBpZiAoZmlsdGVyRm4uY2FsbCh0aGlzQXJnLCBrZXksIHZhbHVlKSkge1xuICAgICAgICAgICAgaWYgKGNvbmZpZy5rZXlzID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgdmFsdWVzLnB1c2goa2V5KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29uZmlnLnZhbHVlcyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHZhbHVlcy5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFsdWVzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIGtleToga2V5XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCB0aGlzQXJnLCBjb25maWcpO1xuXG4gICAgcmV0dXJuIHZhbHVlcztcbn07XG5cbi8qKlxuICogTWVyZ2UgdGhlIHZhbHVlcyBmcm9tIG9iamVjdDIgaW50byBvYmplY3QxLiAgVGhlIHZhbHVlcyB3aWxsIG9ubHkgYmVcbiAqIG1lcmdlZCBpbiBpZiBvYmplY3QxJ3MgdmFsdWUgZm9yIHRoZSBrZXkgaXMgbnVsbCBvciB1bmRlZmluZWQuICBOZXN0ZWQgb2JqZWN0c1xuICogYXJlIGhhbmRsZWQgaW4gdGhlIHNhbWUgd2F5LiAgQXJyYXkgdmFsdWVzIHdpbGwgbm90IGJlIG1lcmdlZC5cbiAqIFxuICAgIEx1Yy5PYmplY3QubWVyZ2Uoe2E6IDF9LCB7YjogMn0pXG4gICAgPnthOiAxLCBiOiAyfVxuICAgIFxuICAgIEx1Yy5PYmplY3QubWVyZ2Uoe2E6IHthOiAxfSB9LCB7YjoyLCBhOiB7YjogMn19KVxuICAgID57YjogMiwgYToge2E6MSwgYjoyfSB9XG5cbiAqIEBwYXJhbSAge09iamVjdH0gb2JqZWN0MVxuICogQHBhcmFtICB7T2JqZWN0fSBvYmplY3QyXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbmZ1bmN0aW9uIG1lcmdlKG9iajEsIG9iajIpIHtcbiAgICBleHBvcnRzLmVhY2gob2JqMiwgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICB2YXIgb2JqMVZhbHVlID0gb2JqMVtrZXldO1xuICAgICAgICBpZiAob2JqMVZhbHVlID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgb2JqMVtrZXldID0gdmFsdWU7XG4gICAgICAgIH0gZWxzZSBpZiAoaXMuaXNPYmplY3Qob2JqMVZhbHVlKSkge1xuICAgICAgICAgICAgbWVyZ2Uob2JqMVtrZXldLCBvYmoyW2tleV0pO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gb2JqMTtcbn1cblxuZXhwb3J0cy5tZXJnZSA9IG1lcmdlOyIsInZhciBhcnJheSA9IHJlcXVpcmUoJy4vYXJyYXknKSxcbiAgICBpcyA9IHJlcXVpcmUoJy4vaXMnKSxcbiAgICBHZW5lcmF0b3I7XG5cbkdlbmVyYXRvciA9IHtcbiAgICBhcnJheUZuTmFtZXM6IFsnZmluZEZpcnN0Tm90JywgJ2ZpbmRBbGxOb3QnLCAnZmluZEZpcnN0JywgJ2ZpbmRBbGwnLFxuICAgICAgICAgICAgJ3JlbW92ZUZpcnN0Tm90JywgJ3JlbW92ZUFsbE5vdCcsICdyZW1vdmVGaXJzdCcsICdyZW1vdmVBbGwnLFxuICAgICAgICAgICAgJ3JlbW92ZUxhc3ROb3QnLCAncmVtb3ZlTGFzdCcsICdmaW5kTGFzdCcsICdmaW5kTGFzdE5vdCdcbiAgICBdLFxuXG4gICAgY3JlYXRlRm46IGZ1bmN0aW9uKGFycmF5Rm5OYW1lLCBmbikge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oYXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gYXJyYXlbYXJyYXlGbk5hbWVdKGFyciwgZm4pO1xuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBjcmVhdGVCb3VuZEZuOiBmdW5jdGlvbihhcnJheUZuTmFtZSwgZm5Ub0JpbmQpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGFyciwgdmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBmbiA9IGZuVG9CaW5kLmFwcGx5KHRoaXMsIGFycmF5LmZyb21JbmRleChhcmd1bWVudHMsIDEpKTtcbiAgICAgICAgICAgIHJldHVybiBhcnJheVthcnJheUZuTmFtZV0oYXJyLCBmbik7XG4gICAgICAgIH07XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBHZW5lcmF0b3I7XG5cbi8qKlxuICogQGNsYXNzIEx1Yy5BcnJheUZuc1xuICogVGhpcyBpcyBkb2N1bWVudGVkIGFzIGEgc2VwYXJhdGUgcGFja2FnZSBidXQgaXQgYWN0dWFsbHkgZXhpc3RzIHVuZGVyIHRoZSBcbiAqIEx1Yy5BcnJheSBuYW1lc3BhY2UuICBDaGVjayBvdXQgdGhlIFwiRmlsdGVyIGNsYXNzIG1lbWJlcnNcIiBpbnB1dCBib3hcbiAqIGp1c3QgdG8gdGhlIHJpZ2h0IHdoZW4gc2VhcmNoaW5nIGZvciBmdW5jdGlvbnMuXG4gKjxicj5cbiAqIFxuICogVGhlcmUgYXJlIGEgbG90IG9mIGZ1bmN0aW9ucyBpbiB0aGlzIHBhY2thZ2UgYnV0IGFsbCBvZiB0aGVtIFxuICogZm9sbG93IHRoZSBzYW1lIGFwaS4gIFxcKkFsbCBmdW5jdGlvbnMgd2lsbCByZXR1cm4gYW4gYXJyYXkgb2YgcmVtb3ZlZCBvciBmb3VuZFxuICogaXRlbXMuICBUaGUgaXRlbXMgd2lsbCBiZSBhZGRlZCB0byB0aGUgYXJyYXkgaW4gdGhlIG9yZGVyIHRoZXkgYXJlXG4gKiBmb3VuZC4gIFxcKkZpcnN0IGZ1bmN0aW9ucyB3aWxsIHJldHVybiB0aGUgZmlyc3QgaXRlbSBhbmQgc3RvcCBpdGVyYXRpbmcgYWZ0ZXIgdGhhdCwgaWYgbm9uZVxuICogIGlzIGZvdW5kIGZhbHNlIGlzIHJldHVybmVkLiAgcmVtb3ZlXFwqIGZ1bmN0aW9ucyB3aWxsIGRpcmVjdGx5IGNoYW5nZSB0aGUgcGFzc2VkIGluIGFycmF5LlxuICogIFxcKk5vdCBmdW5jdGlvbnMgb25seSBkbyB0aGUgZm9sbG93aW5nIGFjdGlvbnMgaWYgdGhlIGNvbXBhcmlzb24gaXMgbm90IHRydWUuXG4gKiAgXFwqTGFzdCBmdW5jdGlvbnMgZG8gdGhlIHNhbWUgYXMgdGhlaXIgXFwqRmlyc3QgY291bnRlcnBhcnRzIGV4Y2VwdCB0aGF0IHRoZSBpdGVyYXRpbmdcbiAqICBzdGFydHMgYXQgdGhlIGVuZCBvZiB0aGUgYXJyYXkuIEFsbW9zdCBldmVyeSBwdWJsaWMgbWV0aG9kIG9mIEx1Yy5pcyBpcyBhdmFpbGFibGUgaXRcbiAqICB1c2VzIHRoZSBmb2xsb3dpbmcgZ3JhbW1hciBMdWMuQXJyYXlbXCJtZXRob2ROYW1lXCJcImlzTWV0aG9kTmFtZVwiXVxuICpcbiAgICAgIEx1Yy5BcnJheS5maW5kQWxsTm90RW1wdHkoW2ZhbHNlLCB0cnVlLCBudWxsLCB1bmRlZmluZWQsIDAsICcnLCBbXSwgWzFdXSlcbiAgICAgID4gW3RydWUsIDAsIFsxXV1cblxuICAgICAgLy9PciByZW1vdmUgYWxsIGVtcHR5IGl0ZW1zXG4gICAgICB2YXIgYXJyID0gWycnLCAwICwgW10sIHthOjF9LCB0cnVlLCB7fSwgWzFdXVxuICAgICAgTHVjLkFycmF5LnJlbW92ZUFsbEVtcHR5KGFycilcbiAgICAgID5bJycsIFtdLCB7fV1cbiAgICAgIGFyclxuICAgICAgPlswLCB7YToxfSwgdHJ1ZSwgWzFdXVxuICAgICBcbiAgICAgIEx1Yy5BcnJheS5maW5kRmlyc3ROb3RTdHJpbmcoWzEsMiwzLCc1J10pXG4gICAgICA+MVxuICAgICAgdmFyIGFyciA9IFsxLDIsMywnNSddO1xuICAgICAgTHVjLkFycmF5LnJlbW92ZUFsbE5vdFN0cmluZyhhcnIpO1xuICAgICAgPlsxLDIsM11cbiAgICAgIGFyclxuICAgICAgPltcIjVcIl1cbiAqXG4gKiBBcyBvZiByaWdodCBub3cgdGhlcmUgYXJlIHR3byBmdW5jdGlvbiBzZXRzIHdoaWNoIGRpZmZlciBmcm9tIHRoZSBpc1xuICogYXBpLlxuICpcbiAqIEluc3RhbmNlT2ZcbiAqIFxuICAgIEx1Yy5BcnJheS5maW5kQWxsSW5zdGFuY2VPZihbMSwyLCBuZXcgRGF0ZSgpLCB7fSwgW11dLCBPYmplY3QpXG4gICAgPltkYXRlLCB7fSwgW11dXG4gICAgPkx1Yy5BcnJheS5maW5kQWxsTm90SW5zdGFuY2VPZihbMSwyLCBuZXcgRGF0ZSgpLCB7fSwgW11dLCBPYmplY3QpXG4gICAgWzEsIDJdXG4gKlxuICogSW5cbiAqIFxuICAgIEx1Yy5BcnJheS5maW5kQWxsSW4oWzEsMiwzXSwgWzEsMl0pXG4gICAgPlsxLCAyXVxuICAgIEx1Yy5BcnJheS5maW5kRmlyc3RJbihbMSwyLDNdLCBbMSwyXSlcbiAgICA+MVxuXG4gICAgLy9kZWZhdWx0cyB0byBsb29zZSBjb21wYXJpc29uXG4gICAgTHVjLkFycmF5LmZpbmRBbGxJbihbMSwyLDMsIHthOjEsIGI6Mn1dLCBbMSx7YToxfV0pXG4gICAgPiBbMSwge2E6MSxiOjJ9XVxuXG4gICAgTHVjLkFycmF5LmZpbmRBbGxJbihbMSwyLDMsIHthOjEsIGI6Mn1dLCBbMSx7YToxfV0sIHt0eXBlOiAnZGVlcCd9KVxuICAgID5bMV1cbiAqL1xuXG4oZnVuY3Rpb24gX2NyZWF0ZUlzRm5zKCkge1xuICAgIHZhciBpc1RvSWdub3JlID0gWydpc1JlZ0V4cCcsICdpc0FyZ3VtZW50cyddO1xuXG4gICAgT2JqZWN0LmtleXMoaXMpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIHZhciBuYW1lID0ga2V5LnNwbGl0KCdpcycpWzFdO1xuICAgICAgICBHZW5lcmF0b3IuYXJyYXlGbk5hbWVzLmZvckVhY2goZnVuY3Rpb24oZm5OYW1lKSB7XG4gICAgICAgICAgICBpZihpc1RvSWdub3JlLmluZGV4T2Yoa2V5KSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICBhcnJheVtmbk5hbWUgKyBuYW1lXSA9IEdlbmVyYXRvci5jcmVhdGVGbihmbk5hbWUsIGlzW2tleV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn0oKSk7XG5cbihmdW5jdGlvbiBfY3JlYXRlRmFsc3lGbnMoKSB7XG4gICAgdmFyIHVzZWZ1bGxGYWxzeUZucyA9IFsnZmluZEZpcnN0Tm90JywgJ2ZpbmRBbGxOb3QnLCAncmVtb3ZlRmlyc3ROb3QnLCAncmVtb3ZlQWxsTm90JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAncmVtb3ZlRmlyc3QnLCAncmVtb3ZlQWxsJywgJ3JlbW92ZUxhc3ROb3QnLCAncmVtb3ZlTGFzdCcsICAnZmluZExhc3ROb3QnXTtcblxuICAgIHZhciBmbnMgPSB7XG4gICAgICAgICdGYWxzZSc6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbCA9PT0gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgICdUcnVlJzogZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsID09PSB0cnVlO1xuICAgICAgICB9LFxuICAgICAgICAnTnVsbCc6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbCA9PT0gbnVsbDtcbiAgICAgICAgfSxcbiAgICAgICAgJ1VuZGVmaW5lZCc6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbCA9PT0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIE9iamVjdC5rZXlzKGZucykuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgdXNlZnVsbEZhbHN5Rm5zLmZvckVhY2goZnVuY3Rpb24oZm5OYW1lKSB7XG4gICAgICAgICAgICBhcnJheVtmbk5hbWUgKyBrZXldID0gR2VuZXJhdG9yLmNyZWF0ZUZuKGZuTmFtZSwgZm5zW2tleV0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0oKSk7XG5cbihmdW5jdGlvbiBfY3JlYXRlQm91bmRGbnMoKSB7XG4gICAgdmFyIGZucyA9IHtcbiAgICAgICAgJ0luc3RhbmNlT2YnOiBmdW5jdGlvbihDb25zdHJ1Y3Rvcikge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICh2YWx1ZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sJ0luJzogZnVuY3Rpb24oYXJyLCBjKSB7XG4gICAgICAgICAgICB2YXIgZGVmYXVsdEMgPSB7dHlwZTonbG9vc2VSaWdodCd9O1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYodmFsdWUgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjZmcgPSBjIHx8IGRlZmF1bHRDO1xuICAgICAgICAgICAgICAgICAgICAvL3RoaXMgaXMgYSByaWdodCB0byBsZWZ0IGNvbXBhcmlzb24gXG4gICAgICAgICAgICAgICAgICAgIC8vZXhwZWN0ZWQgbG9vc2UgYmVoYXZpb3Igc2hvdWxkIGJlIGxvb3NlUmlnaHRcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFycmF5LmZpbmRGaXJzdChhcnIsIHZhbHVlLCBjZmcudHlwZSA9PT0gJ2xvb3NlJyA/IGRlZmF1bHRDIDogY2ZnKSAhPT0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHJldHVybiBhcnIuaW5kZXhPZihmYWxzZSkgPiAtMTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgT2JqZWN0LmtleXMoZm5zKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICBHZW5lcmF0b3IuYXJyYXlGbk5hbWVzLmZvckVhY2goZnVuY3Rpb24oZm5OYW1lKSB7XG4gICAgICAgICAgICBhcnJheVtmbk5hbWUgKyBrZXldID0gR2VuZXJhdG9yLmNyZWF0ZUJvdW5kRm4oZm5OYW1lLCBmbnNba2V5XSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSgpKTsiLCJ2YXIgaXMgPSByZXF1aXJlKCcuL2lzJyk7XG5cbmZ1bmN0aW9uIF9zdHJpY3QodmFsMSwgdmFsMil7XG4gICAgcmV0dXJuIHZhbDEgPT09IHZhbDI7XG59XG5cbmZ1bmN0aW9uIF9jb21wYXJlQXJyYXlMZW5ndGgodmFsMSwgdmFsMikge1xuICAgIHJldHVybihpcy5pc0FycmF5KHZhbDEpICYmIGlzLmlzQXJyYXkodmFsMikgICYmIHZhbDEubGVuZ3RoID09PSB2YWwyLmxlbmd0aCk7XG59XG5cbmZ1bmN0aW9uIF9zaGFsbG93QXJyYXkodmFsMSwgdmFsMikge1xuICAgIHZhciBpID0gMCxcbiAgICAgICAgbGVuO1xuICAgIFxuICAgIGlmKCFfY29tcGFyZUFycmF5TGVuZ3RoKHZhbDEsIHZhbDIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IobGVuID0gdmFsMS5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgICBpZih2YWwxW2ldICE9PSB2YWwyW2ldKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gX2RlZXBBcnJheSh2YWwxLCB2YWwyLCBjb25maWcpIHtcbiAgICB2YXIgaSA9IDAsXG4gICAgICAgIGxlbjtcbiAgICBcbiAgICBpZighX2NvbXBhcmVBcnJheUxlbmd0aCh2YWwxLCB2YWwyKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZm9yKGxlbiA9IHZhbDEubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgaWYoIWNvbXBhcmUodmFsMVtpXSx2YWwyW2ldLCBjb25maWcpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gX2NvbXBhcmVPYmplY3RLZXlzTGVuZ3RoKHZhbDEsIHZhbDIpIHtcbiAgICByZXR1cm4gKGlzLmlzT2JqZWN0KHZhbDEpICYmIGlzLmlzT2JqZWN0KHZhbDIpICYmIE9iamVjdC5rZXlzKHZhbDEpLmxlbmd0aCA9PT0gT2JqZWN0LmtleXModmFsMikubGVuZ3RoKTtcbn1cblxuZnVuY3Rpb24gX3NoYWxsb3dPYmplY3QodmFsMSwgdmFsMikge1xuICAgIHZhciBrZXksIHZhbDtcblxuICAgIGlmICghX2NvbXBhcmVPYmplY3RLZXlzTGVuZ3RoKHZhbDEsIHZhbDIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IgKGtleSBpbiB2YWwxKSB7XG4gICAgICAgIGlmICh2YWwxLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsMVtrZXldO1xuICAgICAgICAgICAgaWYgKCF2YWwyLmhhc093blByb3BlcnR5KGtleSkgfHwgdmFsMltrZXldICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBfZGVlcE9iamVjdCh2YWwxLCB2YWwyLCBjb25maWcpIHtcbiAgICB2YXIga2V5LCB2YWw7XG5cbiAgICBpZiAoIV9jb21wYXJlT2JqZWN0S2V5c0xlbmd0aCh2YWwxLCB2YWwyKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZm9yIChrZXkgaW4gdmFsMSkge1xuICAgICAgICBpZiAodmFsMS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbDFba2V5XTtcbiAgICAgICAgICAgIGlmICghdmFsMi5oYXNPd25Qcm9wZXJ0eShrZXkpIHx8IGNvbXBhcmUodmFsdWUsIHZhbDJba2V5XSwgY29uZmlnKSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuXG59XG5cbmZ1bmN0aW9uIF9sb29zZU9iamVjdCh2YWwxLCB2YWwyLCBjb25maWcpIHtcbiAgICB2YXIga2V5LCB2YWw7XG5cbiAgICBpZighKGlzLmlzT2JqZWN0KHZhbDEpICYmIGlzLmlzT2JqZWN0KHZhbDIpKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYoY29uZmlnLnR5cGUgPT09ICdsb29zZVJpZ2h0Jykge1xuICAgICAgICBmb3IgKGtleSBpbiB2YWwyKSB7XG4gICAgICAgICAgICBpZiAodmFsMi5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB2YWwyW2tleV07XG4gICAgICAgICAgICAgICAgaWYgKGNvbXBhcmUodmFsdWUsIHZhbDFba2V5XSwgY29uZmlnKSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBmb3IgKGtleSBpbiB2YWwxKSB7XG4gICAgICAgICAgICBpZiAodmFsMS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB2YWwxW2tleV07XG4gICAgICAgICAgICAgICAgaWYgKGNvbXBhcmUodmFsdWUsIHZhbDJba2V5XSwgY29uZmlnKSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICByZXR1cm4gdHJ1ZTtcblxufVxuXG5mdW5jdGlvbiBfZGF0ZSh2YWwxLCB2YWwyKSB7XG4gICAgaWYoaXMuaXNEYXRlKHZhbDEpICYmIGlzLmlzRGF0ZSh2YWwyKSkge1xuICAgICAgICByZXR1cm4gdmFsMS5nZXRUaW1lKCkgPT09IHZhbDIuZ2V0VGltZSgpO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gX2NyZWF0ZUJvdW5kQ29tcGFyZShvYmplY3QsIGZuKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBmbihvYmplY3QsIHZhbHVlKTtcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBnZXRDb21wYXJlRm4ob2JqZWN0LCBjKSB7XG4gICAgdmFyIGNvbXBhcmVGbiA9IF9zdHJpY3QsXG4gICAgICAgIGNvbmZpZyA9IGMgfHwge30sXG4gICAgICAgIHR5cGUgPSBjb25maWcudHlwZTtcblxuICAgIGlmICh0eXBlID09PSAnZGVlcCcgfHwgdHlwZSA9PT0gJ2xvb3NlJyB8fCB0eXBlID09PSAnbG9vc2VSaWdodCcgfHwgdHlwZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChpcy5pc09iamVjdChvYmplY3QpKSB7XG4gICAgICAgICAgICBjb21wYXJlRm4gPSB0eXBlID09PSAnbG9vc2UnIHx8IHR5cGUgPT09ICdsb29zZVJpZ2h0JyA/IF9sb29zZU9iamVjdCA6IF9kZWVwT2JqZWN0O1xuICAgICAgICB9IGVsc2UgaWYgKGlzLmlzQXJyYXkob2JqZWN0KSkge1xuICAgICAgICAgICAgY29tcGFyZUZuID0gX2RlZXBBcnJheTtcbiAgICAgICAgfSBlbHNlIGlmIChpcy5pc0RhdGUob2JqZWN0KSkge1xuICAgICAgICAgICAgY29tcGFyZUZuID0gX2RhdGU7XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdzaGFsbG93Jykge1xuICAgICAgICBpZiAoaXMuaXNPYmplY3Qob2JqZWN0KSkge1xuICAgICAgICAgICAgY29tcGFyZUZuID0gX3NoYWxsb3dPYmplY3Q7XG4gICAgICAgIH0gZWxzZSBpZiAoaXMuaXNBcnJheShvYmplY3QpKSB7XG4gICAgICAgICAgICBjb21wYXJlRm4gPSBfc2hhbGxvd0FycmF5O1xuICAgICAgICB9IGVsc2UgaWYgKGlzLmlzRGF0ZShvYmplY3QpKSB7XG4gICAgICAgICAgICBjb21wYXJlRm4gPSBfZGF0ZTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZSAhPT0gJ3N0cmljdCcpIHtcbiAgICAgICAgLy93ZSB3b3VsZCBiZSBkb2luZyBhIHN0cmljdCBjb21wYXJpc29uIG9uIGEgdHlwZS1vXG4gICAgICAgIC8vSSB0aGluayBhbiBlcnJvciBpcyBnb29kIGhlcmUuXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignWW91IHBhc3NlZCBpbiBhbiBpbnZhbGlkIGNvbXBhcmlzb24gdHlwZScpO1xuICAgIH1cblxuICAgIHJldHVybiBjb21wYXJlRm47XG59XG5cbi8qKlxuICogQG1lbWJlciBMdWNcbiAqIEBtZXRob2QgY29tcGFyZVxuICogXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWVzIGFyZSBlcXVhbCB0byBlYWNoXG4gKiBvdGhlci4gIEJ5IGRlZmF1bHQgYSBkZWVwIGNvbXBhcmlzb24gaXMgXG4gKiBkb25lIG9uIGFycmF5cywgZGF0ZXMgYW5kIG9iamVjdHMgYW5kIGEgc3RyaWN0IGNvbXBhcmlzb25cbiAqIGlzIGRvbmUgb24gb3RoZXIgdHlwZXMuXG4gKiBcbiAqIEBwYXJhbSAge0FueX0gdmFsMSAgXG4gKiBAcGFyYW0gIHtBbnl9IHZhbDIgICBcbiAqIEBwYXJhbSAge09iamVjdH0gW2NvbmZpZ11cbiAqIEBwYXJhbSB7U3RyaW5nfSBjb25maWcudHlwZSBwYXNzIGluICdzaGFsbG93JyBmb3IgYSBzaGFsbG93XG4gKiBjb21wYXJpc29uLCAnZGVlcCcgKGRlZmF1bHQpIGZvciBhIGRlZXAgY29tcGFyaXNvblxuICogJ3N0cmljdCcgZm9yIGEgc3RyaWN0ID09PSBjb21wYXJpc29uIGZvciBhbGwgb2JqZWN0cyBvciBcbiAqICdsb29zZScgZm9yIGEgbG9vc2UgY29tcGFyaXNvbiBvbiBvYmplY3RzLiAgQSBsb29zZSBjb21wYXJpc29uXG4gKiAgd2lsbCBjb21wYXJlIHRoZSBrZXlzIGFuZCB2YWx1ZXMgb2YgdmFsMSB0byB2YWwyIGFuZCBkb2VzIG5vdFxuICogIGNoZWNrIGlmIGtleXMgZnJvbSB2YWwyIGFyZSBlcXVhbCB0byB0aGUga2V5cyBpbiB2YWwxLlxuICpcbiAqXG4gICAgTHVjLmNvbXBhcmUoJzEnLCAxKVxuICAgID5mYWxzZVxuICAgIEx1Yy5jb21wYXJlKHthOiAxfSwge2E6IDF9KVxuICAgID50cnVlXG4gICAgTHVjLmNvbXBhcmUoe2E6IDEsIGI6IHt9fSwge2E6IDEsIGI6IHt9IH0sIHt0eXBlOidzaGFsbG93J30pXG4gICAgPmZhbHNlXG4gICAgTHVjLmNvbXBhcmUoe2E6IDEsIGI6IHt9fSwge2E6IDEsIGI6IHt9IH0sIHt0eXBlOiAnZGVlcCd9KVxuICAgID50cnVlXG4gICAgTHVjLmNvbXBhcmUoe2E6IDEsIGI6IHt9fSwge2E6IDEsIGI6IHt9IH0sIHt0eXBlOiAnc3RyaWN0J30pXG4gICAgPmZhbHNlXG4gICAgTHVjLmNvbXBhcmUoe2E6IDF9LCB7YToxLGI6MX0pXG4gICAgPmZhbHNlXG4gICAgTHVjLmNvbXBhcmUoe2E6IDF9LCB7YToxLGI6MX0sIHt0eXBlOiAnbG9vc2UnfSlcbiAgICA+dHJ1ZVxuICAgIEx1Yy5jb21wYXJlKHthOiAxfSwge2E6MSxiOjF9LCB7dHlwZTogJ2xvb3NlJ30pXG4gICAgPnRydWVcbiAgICBMdWMuY29tcGFyZShbe2E6IDF9XSwgW3thOjEsYjoxfV0sIHt0eXBlOiAnbG9vc2UnfSlcbiAgICA+dHJ1ZVxuICAgIEx1Yy5jb21wYXJlKFt7YTogMX0sIHt9XSwgW3thOjEsYjoxfV0sIHt0eXBlOiAnbG9vc2UnfSlcbiAgICA+ZmFsc2VcbiAgICBMdWMuY29tcGFyZShbe2E6IDF9LCB7fV0sIFt7YToxLGI6MX0sIHt9XSwge3R5cGU6ICdsb29zZSd9KVxuICAgID50cnVlXG4gICAgTHVjLmNvbXBhcmUoW3thOjEsYjoxfV0sIFt7YTogMX1dLCB7dHlwZTogJ2xvb3NlJ30pXG4gICAgPmZhbHNlXG5cbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGNvbXBhcmUodmFsMSwgdmFsMiwgY29uZmlnKSB7XG4gICAgcmV0dXJuIGdldENvbXBhcmVGbih2YWwxLCBjb25maWcpKHZhbDEsIHZhbDIsIGNvbmZpZyk7XG59XG5cbmV4cG9ydHMuY29tcGFyZSA9IGNvbXBhcmU7IiwidmFyIGVtcHR5Rm4gPSByZXF1aXJlKCcuLi9mdW5jdGlvbicpLmVtcHR5Rm4sXG4gICAgYXBwbHkgPSByZXF1aXJlKCcuLi9vYmplY3QnKS5hcHBseTtcblxuLyoqXG4gKiBAY2xhc3MgTHVjLkJhc2VcbiAqIFNpbXBsZSBjbGFzcyB0aGF0IGJ5IGRlZmF1bHQge0BsaW5rIEx1YyNhcHBseSBhcHBsaWVzfSB0aGUgXG4gKiBmaXJzdCBhcmd1bWVudCB0byB0aGUgaW5zdGFuY2UgYW5kIHRoZW4gY2FsbHNcbiAqIEx1Yy5CYXNlLmluaXQuXG4gKlxuICAgIHZhciBiID0gbmV3IEx1Yy5CYXNlKHtcbiAgICAgICAgYTogMSxcbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnaGV5JylcbiAgICAgICAgfVxuICAgIH0pXG4gICAgYi5hXG4gICAgPmhleVxuICAgID4xXG4gKlxuICogV2UgZm91bmQgdGhhdCBtb3N0IG9mIG91ciBjbGFzc2VzIGRvIHRoaXMgc28gd2UgbWFkZVxuICogaXQgdGhlIGRlZmF1bHQuICBIYXZpbmcgYSBjb25maWcgb2JqZWN0IGFzIHRoZSBmaXJzdCBhbmQgb25seSBcbiAqIHBhcmFtIGtlZXBzIGEgY2xlYW4gYXBpIGFzIHdlbGwuXG4gKlxuICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgTHVjLkFycmF5LmVhY2godGhpcy5pdGVtcywgdGhpcy5sb2dJdGVtcylcbiAgICAgICAgfSxcblxuICAgICAgICBsb2dJdGVtczogZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coaXRlbSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciBjID0gbmV3IEMoe2l0ZW1zOiBbMSwyLDNdfSk7XG4gICAgPjFcbiAgICA+MlxuICAgID4zXG4gICAgdmFyIGQgPSBuZXcgQyh7aXRlbXM6ICdBJ30pO1xuICAgID4nQSdcbiAgICB2YXIgZSA9IG5ldyBDKCk7XG4gKlxuICogSWYgeW91IGRvbid0IGxpa2UgdGhlIGFwcGx5aW5nIG9mIHRoZSBjb25maWcgdG8gdGhlIGluc3RhbmNlIGl0IFxuICogY2FuIGFsd2F5cyBiZSBcImRpc2FibGVkXCJcbiAqXG4gICAgdmFyIE5vQXBwbHkgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgYmVmb3JlSW5pdDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgfSxcbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBMdWMuQXJyYXkuZWFjaCh0aGlzLml0ZW1zLCB0aGlzLmxvZ0l0ZW1zKVxuICAgICAgICB9LFxuXG4gICAgICAgIGxvZ0l0ZW1zOiBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhpdGVtKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIGMgPSBuZXcgTm9BcHBseSh7aXRlbXM6IFsxLDIsM119KTtcbiAqIFxuICovXG5mdW5jdGlvbiBCYXNlKCkge1xuICAgIHRoaXMuYmVmb3JlSW5pdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMuaW5pdCgpO1xufVxuXG5CYXNlLnByb3RvdHlwZSA9IHtcbiAgICAvKipcbiAgICAgKiBCeSBkZWZhdWx0IGFwcGx5IHRoZSBjb25maWcgdG8gdGhlIFxuICAgICAqIGluc3RhbmNlLlxuICAgICAqL1xuICAgIGJlZm9yZUluaXQ6IGZ1bmN0aW9uKGNvbmZpZykge1xuICAgICAgICBhcHBseSh0aGlzLCBjb25maWcpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQG1ldGhvZFxuICAgICAqIFNpbXBsZSBob29rIHRvIGluaXRpYWxpemVcbiAgICAgKiB0aGUgY2xhc3MuICBEZWZhdWx0cyB0byBMdWMuZW1wdHlGblxuICAgICAqL1xuICAgIGluaXQ6IGVtcHR5Rm5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZTsiLCJ2YXIgQmFzZSA9IHJlcXVpcmUoJy4vYmFzZScpLFxuICAgIENvbXBvc2l0aW9uID0gcmVxdWlyZSgnLi9jb21wb3NpdGlvbicpLFxuICAgIG9iaiA9IHJlcXVpcmUoJy4uL29iamVjdCcpLFxuICAgIGFycmF5Rm5zID0gcmVxdWlyZSgnLi4vYXJyYXknKSxcbiAgICBlbXB0eUZuID0gcmVxdWlyZSgnLi4vZnVuY3Rpb24nKS5lbXB0eUZuLFxuICAgIGlzID0gcmVxdWlyZSgnLi4vaXMnKSxcbiAgICBhRWFjaCA9IGFycmF5Rm5zLmVhY2gsXG4gICAgYXBwbHkgPSBvYmouYXBwbHksXG4gICAgb0VhY2ggPSBvYmouZWFjaCxcbiAgICBvRmlsdGVyID0gb2JqLmZpbHRlcixcbiAgICBtaXggPSBvYmoubWl4LFxuICAgIGFycmF5U2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UsXG4gICAgQ2xhc3NEZWZpbmVyO1xuXG4vKipcbiAqIEBjbGFzcyBMdWMuQ2xhc3NEZWZpbmVyXG4gKiBAc2luZ2xldG9uXG4gKlxuICogU2luZ2xldG9uIHRoYXQge0BsaW5rIEx1Yy5kZWZpbmUjZGVmaW5lIEx1Yy5kZWZpbmV9IHVzZXMgdG8gZGVmaW5lIGNsYXNzZXMuICBUaGUgZGVmdWFsdCB0eXBlIGNhblxuICogYmUgY2hhbmdlZCB0byBhbnkgQ29uc3RydWN0b3JcbiAqXG4gICAgZnVuY3Rpb24gTXlDbGFzcygpe307XG4gICAgTHVjLkNsYXNzRGVmaW5lci5kZWZhdWx0VHlwZSA9IE15Q2xhc3M7XG4gICAgdmFyIEMgPSBMdWMuZGVmaW5lKCk7XG4gICAgbmV3IEMoKSBpbnN0YW5jZW9mIEx1Yy5CYXNlXG4gICAgPmZhbHNlXG4gICAgbmV3IEMoKSBpbnN0YW5jZW9mIE15Q2xhc3NcbiAgICA+dHJ1ZVxuICovXG5cbi8qKlxuICogQGNmZyB7RnVuY3Rpb259IGRlZmF1bHRUeXBlIHRoaXMgY2FuIGJlIGNoYW5nZWQgdG8gYW55IENvbnN0cnVjdG9yLiAgRGVmYXVsdHNcbiAqIHRvIEx1Yy5CYXNlLlxuICovXG5cbkNsYXNzRGVmaW5lciA9IHtcblxuICAgIENPTVBPU0lUSU9OU19OQU1FOiAnJGNvbXBvc2l0aW9ucycsXG5cbiAgICBkZWZhdWx0VHlwZTogQmFzZSxcblxuICAgIHByb2Nlc3NvcktleXM6IHtcbiAgICAgICAgJG1peGluczogJ19hcHBseU1peGlucycsXG4gICAgICAgICRzdGF0aWNzOiAnX2FwcGx5U3RhdGljcycsXG4gICAgICAgICRjb21wb3NpdGlvbnM6ICdfYXBwbHlDb21wb3Nlck1ldGhvZHMnLFxuICAgICAgICAkc3VwZXI6ICdfYXBwbHlTdXBlcidcbiAgICB9LFxuXG4gICAgZGVmaW5lOiBmdW5jdGlvbihvcHRzLCBhZnRlcikge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IG9wdHMgfHwge30sXG4gICAgICAgICAgICAvL2lmIHN1cGVyIGlzIGEgZmFsc3kgdmFsdWUgYmVzaWRlcyB1bmRlZmluZWQgdGhhdCBtZWFucyBubyBzdXBlcmNsYXNzXG4gICAgICAgICAgICBTdXBlciA9IG9wdGlvbnMuJHN1cGVyIHx8IChvcHRpb25zLiRzdXBlciA9PT0gdW5kZWZpbmVkID8gdGhpcy5kZWZhdWx0VHlwZSA6IGZhbHNlKSxcbiAgICAgICAgICAgIGFmdGVyRGVmaW5lID0gYWZ0ZXIgfHwgZW1wdHlGbixcbiAgICAgICAgICAgIENvbnN0cnVjdG9yO1xuXG4gICAgICAgIG9wdGlvbnMuJHN1cGVyID0gU3VwZXI7XG5cbiAgICAgICAgQ29uc3RydWN0b3IgPSB0aGlzLl9jcmVhdGVDb25zdHJ1Y3RvcihvcHRpb25zKTtcblxuICAgICAgICB0aGlzLl9wcm9jZXNzQWZ0ZXJDcmVhdGUoQ29uc3RydWN0b3IsIG9wdGlvbnMpO1xuXG4gICAgICAgIGFmdGVyRGVmaW5lLmNhbGwoQ29uc3RydWN0b3IsIENvbnN0cnVjdG9yKTtcblxuICAgICAgICByZXR1cm4gQ29uc3RydWN0b3I7XG4gICAgfSxcblxuICAgIF9jcmVhdGVDb25zdHJ1Y3RvcjogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICB2YXIgc3VwZXJjbGFzcyA9IG9wdGlvbnMuJHN1cGVyLFxuICAgICAgICAgICAgQ29uc3RydWN0b3IgPSB0aGlzLl9jcmVhdGVDb25zdHJ1Y3RvckZuKG9wdGlvbnMpO1xuXG4gICAgICAgIGlmKHN1cGVyY2xhc3MpIHtcbiAgICAgICAgICAgIENvbnN0cnVjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJjbGFzcy5wcm90b3R5cGUpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gQ29uc3RydWN0b3I7XG4gICAgfSxcblxuICAgIF9jcmVhdGVDb25zdHJ1Y3RvckZuOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHZhciBzdXBlcmNsYXNzID0gb3B0aW9ucy4kc3VwZXIsXG4gICAgICAgICAgICBDb25zdHJ1Y3RvcjtcblxuICAgICAgICBpZiAodGhpcy5faGFzQ29uc3RydWN0b3JNb2RpZnlpbmdPcHRpb25zKG9wdGlvbnMpKSB7XG4gICAgICAgICAgICBDb25zdHJ1Y3RvciA9IHRoaXMuX2NyZWF0ZUNvbnN0cnVjdG9yRnJvbU9wdGlvbnMob3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZighc3VwZXJjbGFzcykge1xuICAgICAgICAgICAgQ29uc3RydWN0b3IgPSBmdW5jdGlvbigpIHt9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgQ29uc3RydWN0b3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBzdXBlcmNsYXNzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIENvbnN0cnVjdG9yO1xuICAgIH0sXG5cbiAgICBfaGFzQ29uc3RydWN0b3JNb2RpZnlpbmdPcHRpb25zOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLiRjb21wb3NpdGlvbnM7XG4gICAgfSxcblxuICAgIF9jcmVhdGVDb25zdHJ1Y3RvckZyb21PcHRpb25zOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHZhciBzdXBlcmNsYXNzID0gb3B0aW9ucy4kc3VwZXIsXG4gICAgICAgICAgICBtZSA9IHRoaXMsXG4gICAgICAgICAgICBpbml0QmVmb3JlU3VwZXJjbGFzcyxcbiAgICAgICAgICAgIGluaXRBZnRlclN1cGVyY2xhc3MsXG4gICAgICAgICAgICBpbml0O1xuXG4gICAgICAgIGlmICghc3VwZXJjbGFzcykge1xuICAgICAgICAgICAgaW5pdCA9IHRoaXMuX2NyZWF0ZUluaXRDbGFzc0ZuKG9wdGlvbnMsIHtcbiAgICAgICAgICAgICAgICBhbGw6IHRydWVcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBhcnJheVNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICBpbml0LmNhbGwodGhpcywgb3B0aW9ucywgYXJncyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdEJlZm9yZVN1cGVyY2xhc3MgPSB0aGlzLl9jcmVhdGVJbml0Q2xhc3NGbihvcHRpb25zLCB7XG4gICAgICAgICAgICBiZWZvcmU6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaW5pdEFmdGVyU3VwZXJjbGFzcyA9IHRoaXMuX2NyZWF0ZUluaXRDbGFzc0ZuKG9wdGlvbnMsIHtcbiAgICAgICAgICAgIGJlZm9yZTogZmFsc2VcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGFyZ3MgPSBhcnJheVNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblxuICAgICAgICAgICAgaW5pdEJlZm9yZVN1cGVyY2xhc3MuY2FsbCh0aGlzLCBvcHRpb25zLCBhcmdzKTtcbiAgICAgICAgICAgIHN1cGVyY2xhc3MuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIGluaXRBZnRlclN1cGVyY2xhc3MuY2FsbCh0aGlzLCBvcHRpb25zLCBhcmdzKTtcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgX2NyZWF0ZUluaXRDbGFzc0ZuOiBmdW5jdGlvbihvcHRpb25zLCBjb25maWcpIHtcbiAgICAgICAgdmFyIG1lID0gdGhpcyxcbiAgICAgICAgICAgIGNvbXBvc2l0aW9ucyA9IHRoaXMuX2ZpbHRlckNvbXBvc2l0aW9ucyhjb25maWcsIG9wdGlvbnMuJGNvbXBvc2l0aW9ucyk7XG5cbiAgICAgICAgaWYoY29tcG9zaXRpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGVtcHR5Rm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBmdW5jdGlvbihvcHRpb25zLCBpbnN0YW5jZUFyZ3MpIHtcbiAgICAgICAgICAgIG1lLl9pbml0Q29tcG9zaXRpb25zLmNhbGwodGhpcywgY29tcG9zaXRpb25zLCBpbnN0YW5jZUFyZ3MpO1xuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBfZmlsdGVyQ29tcG9zaXRpb25zOiBmdW5jdGlvbihjb25maWcsIGNvbXBvc2l0aW9ucykge1xuICAgICAgICB2YXIgYmVmb3JlID0gY29uZmlnLmJlZm9yZSwgXG4gICAgICAgICAgICBmaWx0ZXJlZCA9IFtdO1xuXG4gICAgICAgIGlmKGNvbmZpZy5hbGwpIHtcbiAgICAgICAgICAgIHJldHVybiBjb21wb3NpdGlvbnM7XG4gICAgICAgIH1cblxuICAgICAgICBhRWFjaChjb21wb3NpdGlvbnMsIGZ1bmN0aW9uKGNvbXBvc2l0aW9uKSB7XG4gICAgICAgICAgICBpZihiZWZvcmUgJiYgY29tcG9zaXRpb24uaW5pdEFmdGVyICE9PSB0cnVlIHx8ICghYmVmb3JlICYmIGNvbXBvc2l0aW9uLmluaXRBZnRlciA9PT0gdHJ1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWQucHVzaChjb21wb3NpdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBmaWx0ZXJlZDtcbiAgICB9LFxuXG4gICAgX3Byb2Nlc3NBZnRlckNyZWF0ZTogZnVuY3Rpb24oJGNsYXNzLCBvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuX2FwcGx5VmFsdWVzVG9Qcm90bygkY2xhc3MsIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLl9oYW5kbGVQb3N0UHJvY2Vzc29ycygkY2xhc3MsIG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICBfYXBwbHlWYWx1ZXNUb1Byb3RvOiBmdW5jdGlvbigkY2xhc3MsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHByb3RvID0gJGNsYXNzLnByb3RvdHlwZSxcbiAgICAgICAgICAgIHZhbHVlcyA9IGFwcGx5KHtcbiAgICAgICAgICAgICAgICAkY2xhc3M6ICRjbGFzc1xuICAgICAgICAgICAgfSwgb3B0aW9ucyk7XG5cbiAgICAgICAgLy9Eb24ndCBwdXQgdGhlIGRlZmluZSBzcGVjaWZpYyBwcm9wZXJ0aWVzXG4gICAgICAgIC8vb24gdGhlIHByb3RvdHlwZVxuICAgICAgICBvRWFjaCh2YWx1ZXMsIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fZ2V0UHJvY2Vzc29yS2V5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBwcm90b1trZXldID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICBfZ2V0UHJvY2Vzc29yS2V5OiBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc29yS2V5c1trZXldO1xuICAgIH0sXG5cbiAgICBfaGFuZGxlUG9zdFByb2Nlc3NvcnM6IGZ1bmN0aW9uKCRjbGFzcywgb3B0aW9ucykge1xuICAgICAgICBvRWFjaChvcHRpb25zLCBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgbWV0aG9kID0gdGhpcy5fZ2V0UHJvY2Vzc29yS2V5KGtleSk7XG5cbiAgICAgICAgICAgIGlmIChpcy5pc0Z1bmN0aW9uKHRoaXNbbWV0aG9kXSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzW21ldGhvZF0uY2FsbCh0aGlzLCAkY2xhc3MsIG9wdGlvbnNba2V5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICBfYXBwbHlNaXhpbnM6IGZ1bmN0aW9uKCRjbGFzcywgbWl4aW5zKSB7XG4gICAgICAgIHZhciBwcm90byA9ICRjbGFzcy5wcm90b3R5cGU7XG4gICAgICAgIGFFYWNoKG1peGlucywgZnVuY3Rpb24obWl4aW4pIHtcbiAgICAgICAgICAgIC8vYWNjZXB0IENvbnN0cnVjdG9ycyBvciBPYmplY3RzXG4gICAgICAgICAgICB2YXIgdG9NaXggPSBtaXhpbi5wcm90b3R5cGUgfHwgbWl4aW47XG4gICAgICAgICAgICBtaXgocHJvdG8sIHRvTWl4KTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIF9hcHBseVN0YXRpY3M6IGZ1bmN0aW9uKCRjbGFzcywgc3RhdGljcykge1xuICAgICAgICB2YXIgcHJvdG90eXBlID0gJGNsYXNzLnByb3RvdHlwZTtcblxuICAgICAgICBhcHBseSgkY2xhc3MsIHN0YXRpY3MpO1xuXG4gICAgICAgIGlmKHByb3RvdHlwZS5nZXRTdGF0aWNWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBwcm90b3R5cGUuZ2V0U3RhdGljVmFsdWUgPSB0aGlzLmdldFN0YXRpY1ZhbHVlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9hcHBseUNvbXBvc2VyTWV0aG9kczogZnVuY3Rpb24oJGNsYXNzLCBjb21wb3NpdGlvbnMpIHtcbiAgICAgICAgdmFyIHByb3RvdHlwZSA9ICRjbGFzcy5wcm90b3R5cGUsXG4gICAgICAgICAgICBtZXRob2RzVG9Db21wb3NlO1xuXG4gICAgICAgIGFFYWNoKGNvbXBvc2l0aW9ucywgZnVuY3Rpb24oY29tcG9zaXRpb25Db25maWcpIHtcbiAgICAgICAgICAgIHZhciBjb21wb3NpdGlvbiA9IG5ldyBDb21wb3NpdGlvbihjb21wb3NpdGlvbkNvbmZpZyksXG4gICAgICAgICAgICAgICAgbmFtZSA9IGNvbXBvc2l0aW9uLm5hbWUsXG4gICAgICAgICAgICAgICAgQ29uc3RydWN0b3IgPSBjb21wb3NpdGlvbi5Db25zdHJ1Y3RvcjtcblxuICAgICAgICAgICAgY29tcG9zaXRpb24udmFsaWRhdGUoKTtcblxuICAgICAgICAgICAgbWV0aG9kc1RvQ29tcG9zZSA9IGNvbXBvc2l0aW9uLmdldE1ldGhvZHNUb0NvbXBvc2UoKTtcblxuICAgICAgICAgICAgbWV0aG9kc1RvQ29tcG9zZS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgICAgIGlmIChwcm90b3R5cGVba2V5XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3RvdHlwZVtrZXldID0gdGhpcy5fY3JlYXRlQ29tcG9zZXJQcm90b0ZuKGtleSwgbmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICAgIGlmKHByb3RvdHlwZS5nZXRDb21wb3NpdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcHJvdG90eXBlLmdldENvbXBvc2l0aW9uID0gdGhpcy5nZXRDb21wb3NpdGlvbjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgX2FwcGx5U3VwZXI6IGZ1bmN0aW9uKCRjbGFzcywgJHN1cGVyKSB7XG4gICAgICAgIHZhciBwcm90bztcbiAgICAgICAgLy9zdXBlciBjYW4gYmUgZmFsc3kgdG8gc2lnbmlmeSBubyBzdXBlcmNsYXNzXG4gICAgICAgIGlmICgkc3VwZXIpIHtcbiAgICAgICAgICAgIHByb3RvID0gJGNsYXNzLnByb3RvdHlwZTtcbiAgICAgICAgICAgIHByb3RvLiRzdXBlciA9ICRzdXBlcjtcbiAgICAgICAgICAgIHByb3RvLiRzdXBlcmNsYXNzID0gJHN1cGVyLnByb3RvdHlwZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfY3JlYXRlQ29tcG9zZXJQcm90b0ZuOiBmdW5jdGlvbihtZXRob2ROYW1lLCBjb21wb3NpdGlvbk5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGNvbXAgPSB0aGlzW0NsYXNzRGVmaW5lci5DT01QT1NJVElPTlNfTkFNRV1bY29tcG9zaXRpb25OYW1lXTtcbiAgICAgICAgICAgIHJldHVybiBjb21wW21ldGhvZE5hbWVdLmFwcGx5KGNvbXAsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQGlnbm9yZVxuICAgICAqIG9wdGlvbnMge09iamVjdH0gdGhlIGNvbXBvc2l0aW9uIGNvbmZpZyBvYmplY3RcbiAgICAgKiBpbnN0YW5jZUFyZ3Mge0FycmF5fSB0aGUgYXJndW1lbnRzIHBhc3NlZCB0byB0aGUgaW5zdGFuY2Unc1xuICAgICAqIGNvbnN0cnVjdG9yLlxuICAgICAqL1xuICAgIF9pbml0Q29tcG9zaXRpb25zOiBmdW5jdGlvbihjb21wb3NpdGlvbnMsIGluc3RhbmNlQXJncykge1xuICAgICAgICBpZighdGhpc1tDbGFzc0RlZmluZXIuQ09NUE9TSVRJT05TX05BTUVdKSB7XG4gICAgICAgICAgICB0aGlzW0NsYXNzRGVmaW5lci5DT01QT1NJVElPTlNfTkFNRV0gPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFFYWNoKGNvbXBvc2l0aW9ucywgZnVuY3Rpb24oY29tcG9zaXRpb25Db25maWcpIHtcbiAgICAgICAgICAgIHZhciBjb25maWcgPSBhcHBseSh7XG4gICAgICAgICAgICAgICAgaW5zdGFuY2U6IHRoaXMsXG4gICAgICAgICAgICAgICAgaW5zdGFuY2VBcmdzOiBpbnN0YW5jZUFyZ3NcbiAgICAgICAgICAgIH0sIGNvbXBvc2l0aW9uQ29uZmlnKSwgXG4gICAgICAgICAgICBjb21wb3NpdGlvbjtcblxuICAgICAgICAgICAgY29tcG9zaXRpb24gPSBuZXcgQ29tcG9zaXRpb24oY29uZmlnKTtcblxuICAgICAgICAgICAgdGhpc1tDbGFzc0RlZmluZXIuQ09NUE9TSVRJT05TX05BTUVdW2NvbXBvc2l0aW9uLm5hbWVdID0gY29tcG9zaXRpb24uZ2V0SW5zdGFuY2UoKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIC8vTWV0aG9kcyB0aGF0IGNhbiBnZXQgYWRkZWQgdG8gdGhlIHByb3RvdHlwZVxuICAgIC8vdGhleSB3aWxsIGJlIGNhbGxlZCBpbiB0aGUgY29udGV4dCBvZiB0aGUgaW5zdGFuY2UuXG4gICAgLy9cbiAgICBnZXRDb21wb3NpdGlvbjogZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIHJldHVybiB0aGlzW0NsYXNzRGVmaW5lci5DT01QT1NJVElPTlNfTkFNRV1ba2V5XTtcbiAgICB9LFxuXG4gICAgZ2V0U3RhdGljVmFsdWU6IGZ1bmN0aW9uIChrZXksICRjbGFzcykge1xuICAgICAgICB2YXIgY2xhc3NUb0ZpbmRWYWx1ZSA9ICRjbGFzcyB8fCB0aGlzLiRjbGFzcyxcbiAgICAgICAgICAgICRzdXBlcixcbiAgICAgICAgICAgIHZhbHVlO1xuXG4gICAgICAgIHZhbHVlID0gY2xhc3NUb0ZpbmRWYWx1ZVtrZXldO1xuXG4gICAgICAgIGlmKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICRzdXBlciA9IGNsYXNzVG9GaW5kVmFsdWUucHJvdG90eXBlLiRzdXBlcjtcbiAgICAgICAgICAgIGlmKCRzdXBlcikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFN0YXRpY1ZhbHVlKGtleSwgJHN1cGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbn07XG5cbkNsYXNzRGVmaW5lci5kZWZpbmUgPSBDbGFzc0RlZmluZXIuZGVmaW5lLmJpbmQoQ2xhc3NEZWZpbmVyKTtcblxubW9kdWxlLmV4cG9ydHMgPSBDbGFzc0RlZmluZXI7XG5cbi8qKlxuICogQGNsYXNzICBMdWMuZGVmaW5lXG4gKiBUaGlzIGlzIGFjdHVhbGx5IGEgZnVuY3Rpb24gYnV0IGhhcyBhIGRlY2VudCBhbW91bnQgb2YgaW1wb3J0YW50IG9wdGlvbnNcbiAqIHNvIHdlIGFyZSBkb2N1bWVudGluZyBpdCBsaWtlIGl0IGlzIGEgY2xhc3MuICBQcm9wZXJ0aWVzIGFyZSB0aGluZ3MgdGhhdCB3aWxsIGdldFxuICogYXBwbGllZCB0byBpbnN0YW5jZXMgb2YgY2xhc3NlcyBkZWZpbmVkIHdpdGgge0BsaW5rIEx1Yy5kZWZpbmUjZGVmaW5lIGRlZmluZX0uICBOb25lXG4gKiBhcmUgbmVlZGVkIGZvciB7QGxpbmsgTHVjLmRlZmluZSNkZWZpbmUgZGVmaW5pbmd9IGEgY2xhc3MuICB7QGxpbmsgTHVjLmRlZmluZSNkZWZpbmUgZGVmaW5lfVxuICoganVzdCB0YWtlcyB0aGUgcGFzc2VkIGluIGNvbmZpZyBhbmQgcHV0cyB0aGUgcHJvcGVydGllcyBvbiB0aGUgcHJvdG90eXBlIGFuZCByZXR1cm5zXG4gKiBhIENvbnN0cnVjdG9yLlxuICpcblxuICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgIGE6IDEsXG4gICAgICAgIGRvTG9nOiB0cnVlLFxuICAgICAgICBsb2dBOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmRvTG9nKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5hKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBjID0gbmV3IEMoKTtcbiAgICBjLmxvZ0EoKTtcbiAgICA+MVxuICAgIGMuYSA9IDQ1O1xuICAgIGMubG9nQSgpO1xuICAgID40NVxuICAgIGMuZG9Mb2cgPSBmYWxzZTtcbiAgICBjLmxvZ0EoKTtcblxuICAgIG5ldyBDKCkubG9nQSgpXG4gICAgPjFcblxuICpcbiAqIENoZWNrIG91dCB0aGUgZm9sbG93aW5nIGNvbmZpZ3MgdG8gYWRkIGZ1bmN0aW9uYWxpdHkgdG8gYSBjbGFzcyB3aXRob3V0IG1lc3NpbmdcbiAqIHVwIHRoZSBpbmhlcml0YW5jZSBjaGFpbi4gIEFsbCB0aGUgY29uZmlncyBoYXZlIGV4YW1wbGVzIGFuZCBkb2N1bWVudGF0aW9uIG9uIFxuICogaG93IHRvIHVzZSB0aGVtLlxuICpcbiAqIHtAbGluayBMdWMuZGVmaW5lIyRzdXBlciBzdXBlcn0gPGJyPlxuICoge0BsaW5rIEx1Yy5kZWZpbmUjJGNvbXBvc2l0aW9ucyBjb21wb3NpdGlvbnN9IDxicj5cbiAqIHtAbGluayBMdWMuZGVmaW5lIyRtaXhpbnMgbWl4aW5zfSA8YnI+XG4gKiB7QGxpbmsgTHVjLmRlZmluZSMkc3RhdGljcyBzdGF0aWNzfSA8YnI+XG4gKiBcbiAqIFxuICovXG5cbi8qKlxuICogQG1ldGhvZCAgZGVmaW5lXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIGNvbmZpZyBvYmplY3QgdXNlZCB3aGVuIGNyZWF0aW5nIHRoZSBjbGFzcy4gIEFueSBwcm9wZXJ0eSB0aGF0XG4gKiBpcyBub3QgYXBhcnQgb2YgdGhlIHNwZWNpYWwgY29uZmlncyB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIHByb3RvdHlwZS4gIENoZWNrIG91dFxuICogTHVjLmRlZmluZSBmb3IgYWxsIHRoZSBjb25maWcgb3B0aW9ucy4gICBObyBjb25maWdzIGFyZSBuZWVkZWQgdG8gZGVmaW5lIGEgY2xhc3MuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gYWZ0ZXJEZWZpbmUgKG9wdGlvbmFsKSBmdW5jdGlvbiB0byBydW4gYWZ0ZXIgdGhlIENvbnN0cnVjdG9yIGhhcyBiZWVuIGNyZWF0ZWQuXG4gKiBUaGUgZmlyc3QgYW4gb25seSBhcmd1bWVudCBpcyB0aGUgbmV3bHkgY3JlYXRlZCBDb25zdHJ1Y3Rvci5cbiAqIFxuICogQHJldHVybiB7RnVuY3Rpb259IHRoZSBkZWZpbmVkIGNsYXNzXG4gKlxuICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgIGxvZ0E6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5hKVxuICAgICAgICB9LFxuICAgICAgICBhOiAxXG4gICAgfSk7XG4gICAgdmFyIGMgPSBuZXcgQygpO1xuICAgIGMubG9nQSgpO1xuICAgID4xXG5cbiAgICBjLmEgPSA0O1xuICAgIGMubG9nQSgpO1xuICAgID40XG4gKlxuICpcbiAqL1xuXG4vKipcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259ICRjbGFzcyByZWZlcmVuY2UgdG8gdGhlIGluc3RhbmNlJ3Mgb3duIGNvbnN0cnVjdG9yLiAgVGhpc1xuICogd2lsbCBnZXQgYWRkZWQgdG8gYW55IGNsYXNzIHRoYXQgaXMgZGVmaW5lZCB3aXRoIEx1Yy5kZWZpbmUuXG4gKiBcbiAgICB2YXIgQyA9IEx1Yy5kZWZpbmUoKVxuICAgIHZhciBjID0gbmV3IEMoKVxuICAgIGMuJGNsYXNzID09PSBDXG4gICAgPnRydWVcbiAqXG4gKiBUaGVyZSBhcmUgc29tZSByZWFsbHkgZ29vZCB1c2UgY2FzZXMgdG8gaGF2ZSBhIHJlZmVyZW5jZSB0byBpdCdzXG4gKiBvd24gY29uc3RydWN0b3IuICA8YnI+IEFkZCBmdW5jdGlvbmFsaXR5IHRvIGFuIGluc3RhbmNlIGluIGEgc2ltcGxlXG4gKiBhbmQgZ2VuZXJpYyB3YXk6XG4gKlxuICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgIGFkZDogZnVuY3Rpb24oYSxiKSB7XG4gICAgICAgICAgICByZXR1cm4gYSArIGI7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vTHVjLkJhc2UgYXBwbGllcyBmaXJzdCBcbiAgICAvL2FyZyB0byB0aGUgaW5zdGFuY2VcblxuICAgIHZhciBjID0gbmV3IEMoe1xuICAgICAgICBhZGQ6IGZ1bmN0aW9uKGEsYixjKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kY2xhc3MucHJvdG90eXBlLmFkZC5jYWxsKHRoaXMsIGEsYikgKyBjO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBjLmFkZCgxLDIsMylcbiAgICA+NlxuICAgIG5ldyBDKCkuYWRkKDEsMiwzKVxuICAgID4zXG4gKlxuICogT3IgaGF2ZSBhIHNpbXBsZSBnZW5lcmljIGNsb25lIG1ldGhvZCA6XG4gKlxuICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgIGNsb25lOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBteU93blByb3BzID0ge307XG4gICAgICAgICAgICBMdWMuT2JqZWN0LmVhY2godGhpcywgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIG15T3duUHJvcHNba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgdGhpcy4kY2xhc3MobXlPd25Qcm9wcyk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciBjID0gbmV3IEMoe2E6MSxiOjIsYzozfSk7XG4gICAgYy5kID0gNDtcbiAgICB2YXIgY2xvbmUgPSBjLmNsb25lKCk7XG5cbiAgICBjbG9uZSA9PT0gY1xuICAgID5mYWxzZVxuXG4gICAgY2xvbmUuYVxuICAgID4xXG4gICAgY2xvbmUuYlxuICAgID4yXG4gICAgY2xvbmUuY1xuICAgID4zXG4gICAgY2xvbmUuZFxuICAgID40XG4gKi9cblxuLyoqXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBbJHN1cGVyXSBJZiAkc3VwZXIgaXMgbm90IGZhbHNlIG9yIG51bGwgXG4gKiB0aGUgJHN1cGVyIHByb3BlcnR5IHdpbGwgYmUgYWRkZWQgdG8gZXZlcnkgaW5zdGFuY2Ugb2YgdGhlIGRlZmluZWQgY2xhc3MsXG4gKiAkc3VwZXIgaXMgdGhlIENvbnN0cnVjdG9yIHBhc3NlZCBpbiB3aXRoIHRoZSAkc3VwZXIgY29uZmlnIG9yIHRoZSB7QGxpbmsgTHVjLkNsYXNzRGVmaW5lciNkZWZhdWx0VHlwZSBkZWZhdWx0fVxuICogXG4gICAgdmFyIEMgPSBMdWMuZGVmaW5lKClcbiAgICB2YXIgYyA9IG5ldyBDKClcbiAgICAvL0x1Yy5CYXNlIGlzIHRoZSBkZWZhdWx0IFxuICAgIGMuJHN1cGVyID09PSBMdWMuQmFzZVxuICAgID50cnVlXG4gKi9cblxuLyoqXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBbJHN1cGVyY2xhc3NdIElmICRzdXBlciBpcyBkZWZpbmVkIGl0XG4gKiB3aWxsIGJlIHRoZSBwcm90b3R5cGUgb2YgJHN1cGVyLiAgSXQgY2FuIGJlIHVzZWQgdG8gY2FsbCBhIHBhcmVudCdzXG4gKiBtZXRob2RcbiAqIFxuICAgIGZ1bmN0aW9uIE15Q29vbENsYXNzKCkge31cbiAgICBNeUNvb2xDbGFzcy5wcm90b3R5cGUuYWRkTnVtcyA9IGZ1bmN0aW9uKGEsYikge1xuICAgICAgICByZXR1cm4gYSArIGI7XG4gICAgfVxuXG4gICAgdmFyIE15T3RoZXJDb29sQ2xhc3MgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgJHN1cGVyOiBNeUNvb2xDbGFzcyxcbiAgICAgICAgYWRkTnVtczogZnVuY3Rpb24oYSwgYiwgYykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuJHN1cGVyY2xhc3MuYWRkTnVtcy5jYWxsKHRoaXMsIGEsIGIpICsgYztcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICB2YXIgbSA9IG5ldyBNeU90aGVyQ29vbENsYXNzKCk7XG4gICAgbS5hZGROdW1zKDEsMiwzKTtcbiAgICA+NlxuICovXG5cbi8qKlxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gZ2V0U3RhdGljVmFsdWUgdGhpcyBtZXRob2RcbiAqIHdpbGwgYmUgYWRkZWQgdG8gaW5zdGFuY2VzIHRoYXQgdXNlIHRoZSB7QGxpbmsgTHVjLmRlZmluZSMkc3RhdGljcyAkc3RhdGljc31cbiAqIGNvbmZpZy5cbiAqXG4gKiBcbiAqIFRoaXMgc2hvdWxkIGJlIHVzZWQgb3ZlciB0aGlzLiRjbGFzcy5zdGF0aWNOYW1lIHRvXG4gKiBnZXQgdGhlIHZhbHVlIG9mIHN0YXRpYy4gIElmIHRoZSBjbGFzcyBnZXRzIGluaGVyaXRlZFxuICogZnJvbSwgdGhpcy4kY2xhc3Mgd2lsbCBub3QgYmUgdGhlIHNhbWUuICBnZXRTdGF0aWMgdmFsdWVcbiAqIGRlYWxzIHdpdGggdGhpcyBpc3N1ZS5cbiAqIFxuICAgIHZhciBBID0gTHVjLmRlZmluZSh7XG4gICAgICAgICRzdGF0aWNzOiB7XG4gICAgICAgICAgICBhOiAxXG4gICAgICAgICAgICB9LFxuICAgICAgICBnZXRBQmV0dGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFN0YXRpY1ZhbHVlKCdhJyk7XG4gICAgICAgIH0sXG4gICAgICAgIGdldEE6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuJGNsYXNzLmE7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciBCID0gTHVjLmRlZmluZSh7XG4gICAgICAgICRzdXBlcjogQSxcbiAgICAgICAgJHN0YXRpY3M6IHtcbiAgICAgICAgICAgIGI6IDIsXG4gICAgICAgICAgICBjOiAzXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIFxuICAgIHZhciBiID0gbmV3IEIoKTtcbiAgICBiLmdldEEoKTtcbiAgICA+dW5kZWZpbmVkXG4gICAgYi5nZXRBQmV0dGVyKCk7XG4gICAgPjFcblxuICogQHJldHVybiB7T2JqZWN0fSB0aGUgc3RhdGljIHZhbHVlIG9mIHRoZSBrZXlcbiAqL1xuXG4gICAgXG4vKipcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGdldENvbXBvc2l0aW9uIHRoaXMgbWV0aG9kIHdpbGwgYmUgYWRkZWRcbiAqIHRvIGluc3RhbmNlcyB0aGF0IHVzZSB0aGUge0BsaW5rIEx1Yy5kZWZpbmUjJGNvbXBvc2l0aW9ucyAkY29tcG9zaXRpb25zfSAgY29uZmlnXG4gKlxuICogIFRoaXMgd2lsbCByZXR1cm4gdGhlIGNvbXBvc2l0aW9uIGluc3RhbmNlIGJhc2VkIG9mZiB0aGUgY29tcG9zaXRpb24ge0BsaW5rIEx1Yy5Db21wb3NpdGlvbiNuYW1lIG5hbWV9XG4gICAgXG4gICAgdGhpcy5nZXRDb21wb3NpdGlvbihcIm5hbWVcIik7XG4gICAgXG4gKlxuICovXG5cblxuLyoqXG4gKiBAY2ZnIHtPYmplY3R9ICRzdGF0aWNzIChvcHRpb25hbCkgQWRkIHN0YXRpYyBwcm9wZXJ0aWVzIG9yIG1ldGhvZHNcbiAqIHRvIHRoZSBjbGFzcy4gIFRoZXNlIHByb3BlcnRpZXMvbWV0aG9kcyB3aWxsIG5vdCBiZSBhYmxlIHRvIGJlXG4gKiBkaXJlY3RseSBtb2RpZmllZCBieSB0aGUgaW5zdGFuY2Ugc28gdGhleSBhcmUgZ29vZCBmb3IgZGVmaW5pbmcgZGVmYXVsdFxuICogY29uZmlncy4gIFVzaW5nIHRoaXMgY29uZmlnIGFkZHMgdGhlIHtAbGluayBMdWMuZGVmaW5lI2dldFN0YXRpY1ZhbHVlIGdldFN0YXRpY1ZhbHVlfVxuICogbWV0aG9kIHRvIGluc3RhbmNlcy5cbiAqXG4gICAgdmFyIEMgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgJHN0YXRpY3M6IHtcbiAgICAgICAgICAgIG51bWJlcjogMVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB2YXIgYyA9IG5ldyBDKCk7XG4gICAgYy5udW1iZXJcbiAgICA+dW5kZWZpbmVkXG4gICAgQy5udW1iZXJcbiAgICA+MVxuICAgIFxuICpcbiAqIEJhZCB0aGluZ3MgY2FuIGhhcHBlbiBpZiBub24gcHJpbWl0aXZlcyBhcmUgcGxhY2VkIG9uIHRoZSBcbiAqIHByb3RvdHlwZSBhbmQgaW5zdGFuY2Ugc2hhcmluZyBpcyBub3Qgd2FudGVkLiAgVXNpbmcgc3RhdGljc1xuICogcHJldmVudCBzdWJjbGFzc2VzIGFuZCBpbnN0YW5jZXMgZnJvbSB1bmtub3dpbmdseSBtb2RpZnlpbmdcbiAqIGFsbCBpbnN0YW5jZXMuXG4gKiBcbiAgICB2YXIgQyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICBjZmc6IHtcbiAgICAgICAgICAgIGE6IDFcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIGMgPSBuZXcgQygpO1xuICAgIGMuY2ZnLmFcbiAgICA+MVxuICAgIGMuY2ZnLmEgPSA1XG4gICAgbmV3IEMoKS5jZmcuYVxuICAgID41XG4gKlxuICovXG5cbi8qKlxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gWyRzdXBlcmNsYXNzXSBJZiAkc3VwZXIgaXMgZGVmaW5lZCBpdFxuICogd2lsbCBiZSB0aGUgcHJvdG90eXBlIG9mICRzdXBlci4gIEl0IGNhbiBiZSB1c2VkIHRvIGNhbGwgcGFyZW50J3NcbiAqIG1ldGhvZFxuICogXG4gICAgZnVuY3Rpb24gTXlDb29sQ2xhc3MoKSB7fVxuICAgIE15Q29vbENsYXNzLnByb3RvdHlwZS5hZGROdW1zID0gZnVuY3Rpb24oYSxiKSB7XG4gICAgICAgIHJldHVybiBhICsgYjtcbiAgICB9XG5cbiAgICB2YXIgTXlPdGhlckNvb2xDbGFzcyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICAkc3VwZXI6IE15Q29vbENsYXNzLFxuICAgICAgICBhZGROdW1zOiBmdW5jdGlvbihhLCBiLCBjKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kc3VwZXJjbGFzcy5hZGROdW1zLmNhbGwodGhpcywgYSwgYikgKyBjO1xuICAgICAgICB9XG4gICAgfSlcblxuICAgIHZhciBtID0gbmV3IE15T3RoZXJDb29sQ2xhc3MoKTtcbiAgICBtLmFkZE51bXMoMSwyLDMpO1xuICAgID42XG4gKi9cblxuLyoqXG4gKiBAY2ZnIHtPYmplY3QvQ29uc3RydWN0b3IvT2JqZWN0W10vQ29uc3RydWN0b3JbXX0gJG1peGlucyAob3B0aW9uYWwpICBNaXhpbnMgYXJlIGEgd2F5IHRvIGFkZCBmdW5jdGlvbmFsaXR5XG4gKiB0byBhIGNsYXNzIHRoYXQgc2hvdWxkIG5vdCBhZGQgc3RhdGUgdG8gdGhlIGluc3RhbmNlIHVua25vd2luZ2x5LiAgTWl4aW5zIGNhbiBiZSBlaXRoZXIgb2JqZWN0cyBvciBDb25zdHJ1Y3RvcnMuXG4gKlxuICAgIGZ1bmN0aW9uIExvZ2dlcigpIHt9XG4gICAgTG9nZ2VyLnByb3RvdHlwZS5sb2cgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc29sZS5sb2coYXJndW1lbnRzKVxuICAgIH1cblxuICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgICRtaXhpbnM6IFtMb2dnZXIsIHtcbiAgICAgICAgICAgIHdhcm46IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2Fybihhcmd1bWVudHMpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1dXG4gICAgfSk7XG5cbiAgICB2YXIgYyA9IG5ldyBDKCk7XG5cbiAgICBjLmxvZygxLDIpXG4gICAgPlsxLDJdXG5cbiAgICBjLndhcm4oMyw0KVxuICAgID5bMyw0XVxuICpcbiAqL1xuLyoqXG4gKiBAY2ZnIHtDb25zdHJ1Y3Rvcn0gJHN1cGVyIChvcHRpb25hbCkgIHN1cGVyIGZvciB0aGUgZGVmaW5pbmcgY2xhc3MuICBCeSBMdWMuQmFzZVxuICogaXMgdGhlIGRlZmF1bHQgaWYgc3VwZXIgaXMgbm90IHBhc3NlZCBpbi4gIFRvIGRlZmluZSBhIGNsYXNzIHdpdGhvdXQgYSBzdXBlcmNsYXNzXG4gKiB5b3UgY2FuIHBhc3MgaW4gZmFsc2Ugb3IgbnVsbC5cbiAqXG4gICAgIGZ1bmN0aW9uIENvdW50ZXIoKSB7XG4gICAgICAgIHRoaXMuY291bnQgPSAwO1xuICAgICB9O1xuXG4gICAgIENvdW50ZXIucHJvdG90eXBlID0ge1xuICAgICAgICBnZXRDb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb3VudDtcbiAgICAgICAgfSxcbiAgICAgICAgaW5jcmVhc2VDb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLmNvdW50Kys7XG4gICAgICAgIH1cbiAgICAgfVxuXG4gICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgICRzdXBlcjpDb3VudGVyXG4gICAgfSk7XG5cbiAgICB2YXIgYyA9IG5ldyBDKClcblxuICAgIGMgaW5zdGFuY2VvZiBDb3VudGVyXG4gICAgPnRydWVcbiAgICBjLmluY3JlYXNlQ291bnQoKTtcbiAgICBjLmdldENvdW50KCk7XG4gICAgPjFcbiAgICBjLmNvdW50XG4gICAgPjFcbiAqXG4gKiBDaGVjayBvdXQgTHVjLkJhc2UgdG8gc2VlIHdoeSB3ZSBoYXZlIGl0IGFzIHRoZSBkZWZhdWx0LlxuICogXG4gICAgdmFyIEIgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgYW1JQUx1Y0Jhc2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBMdWMuQmFzZVxuICAgICAgICB9XG4gICAgfSlcbiAgICB2YXIgYiA9IG5ldyBCKCk7XG4gICAgYi5hbUlBTHVjQmFzZSgpO1xuICAgID50cnVlXG4gKlxuICogXG4gKi9cblxuXG5cbi8qKlxuICogQGNmZyB7T2JqZWN0L09iamVjdFtdfSAkY29tcG9zaXRpb25zIChvcHRpb25hbCkgY29uZmlnIG9iamVjdHMgZm9yIFxuICogTHVjLkNvbXBvc2l0aW9uLiAgQ29tcG9zaXRpb25zIGFyZSBhIGdyZWF0IHdheSB0byBhZGQgYmVoYXZpb3IgdG8gYSBjbGFzc1xuICogd2l0aG91dCBleHRlbmRpbmcgaXQuICBBIHtAbGluayBMdWMuZGVmaW5lIyRtaXhpbnMgbWl4aW59IGNhbiBvZmZlciBzaW1pbGFyIGZ1bmN0aW9uYWxpdHkgYnV0IHNob3VsZFxuICogbm90IGJlIGFkZGluZyBhbiB1bm5lZWRlZCBzdGF0ZS4gIEEgQ29uc3RydWN0b3IgYW5kIGEgbmFtZSBhcmUgbmVlZGVkIGZvciB0aGUgY29uZmlnIG9iamVjdC5cbiAqICBVc2luZyB0aGlzIGNvbmZpZyBhZGRzIHRoZSB7QGxpbmsgTHVjLmRlZmluZSNnZXRDb21wb3NpdGlvbiBnZXRDb21wb3NpdGlvbn1cbiAqIG1ldGhvZCB0byBpbnN0YW5jZXMuXG4gKiA8YnI+XG4gKiBUaGUgbWV0aG9kcyBwcm9wZXJ0eSBpcyBvcHRpb25hbCBoZXJlIGJ1dCBpdCBpcyBzYXlpbmcgdGFrZSBhbGwgb2YgXG4gKiBMdWMuRXZlbnRFbWl0dGVyJ3MgaW5zdGFuY2UgbWV0aG9kcyBhbmQgbWFrZSB0aGVtIGluc3RhbmNlIG1ldGhvZHMgZm9yIEMuXG4gKiBZb3UgY2FuIGNoZWNrIG91dCBhbGwgb2YgdGhlIGNvbmZpZyBvcHRpb25zIGJ5IGxvb2tpbmcgYXQgTHVjLkNvbXBvc2l0aW9uLlxuICogXG4gICAgICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgICAgICAkY29tcG9zaXRpb25zOiB7XG4gICAgICAgICAgICAgICAgQ29uc3RydWN0b3I6IEx1Yy5FdmVudEVtaXR0ZXIsXG4gICAgICAgICAgICAgICAgbmFtZTogJ2VtaXR0ZXInLFxuICAgICAgICAgICAgICAgIG1ldGhvZHM6ICdhbGxNZXRob2RzJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgYyA9IG5ldyBDKCk7XG5cbiAgICAgICAgYy5vbignaGV5JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhhcmd1bWVudHMpO1xuICAgICAgICB9KTtcblxuICAgICAgICBjLmVtaXQoJ2hleScsIDEsMiwzLCAnYScpO1xuICAgICAgICA+WzEsIDIsIDMsIFwiYVwiXVxuICAgICAgICBjIGluc3RhbmNlb2YgTHVjLkV2ZW50RW1pdHRlclxuICAgICAgICA+ZmFsc2VcbiAgICAgICAgYy5fZXZlbnRzXG4gICAgICAgID51bmRlZmluZWRcbiAqXG4gKiBMdWMuRXZlbnRFbWl0dGVyIGlzIHByZWZlcnJlZCBhcyBhIGNvbXBvc2l0aW9uIG92ZXIgYSBtaXhpbiBiZWNhdXNlXG4gKiBpdCBhZGRzIGEgc3RhdGUgXCJfZXZlbnRzXCIgdG8gdGhlIHRoaXMgaW5zdGFuY2Ugd2hlbiBvbiBpcyBjYWxsZWQuICBJdFxuICogYWxzbyBzaG91bGRuJ3QgaGF2ZSB0byBrbm93IHRoYXQgaXQgbWF5IGJlIGluc3RhbnRpYXRlZCBhbG9uZSBvciBtaXhlZCBpbnRvIGNsYXNzZXNcbiAqIHNvIHRoZSBpbml0aW5nIG9mIHN0YXRlIGlzIG5vdCBkb25lIGluIHRoZSBjb25zdHJ1Y3RvciBsaWtlIGl0IHByb2JhYmx5IHNob3VsZC5cbiAqIEl0IGlzIG5vdCB0ZXJyaWJsZSBwcmFjdGljZSBieSBhbnkgbWVhbnMgYnV0IGl0IGlzIG5vdCBnb29kIHRvIGhhdmUgYSBzdGFuZGFsb25lIGNsYXNzXG4gKiB0aGF0IGtub3dzIHRoYXQgaXQgbWF5IGJlIG1peGluLiAgRXZlbiB3b3JzZSB0aGFuIHRoYXQgd291bGQgYmUgYSBtaXhpbiB0aGF0IG5lZWRzXG4gKiB0byBiZSBpbml0ZWQgYnkgdGhlIGRlZmluaW5nIGNsYXNzLiAgRW5jYXBzdWxhdGluZyBsb2dpYyBpbiBhIGNsYXNzXG4gKiBhbmQgdXNpbmcgaXQgYW55d2hlcmUgc2VhbWxlc3NseSBpcyB3aGVyZSBjb21wb3NpdGlvbnMgc2hpbmUuIEx1YyBjb21lcyB3aXRoIHR3byBjb21tb24gXG4gKiB7QGxpbmsgTHVjI2NvbXBvc2l0aW9uRW51bXMgZW51bXN9IHRoYXQgd2UgZXhwZWN0IHdpbGwgYmUgdXNlZCBvZnRlbi5cbiAqIFxuICogPGJyPlxuICogSGVyZSBpcyBhbiBleGFtcGxlIG9mIGEgc2ltcGxlIGNvbXBvc2l0aW9uIHNlZSBob3cgdGhlIGZ1bmN0aW9uYWxpdHkgXG4gKiBpcyBhZGRlZCBidXQgd2UgYXJlIG5vdCBpbmhlcml0aW5nIGFuZCB0aGlzLmNvdW50IGlzXG4gKiB1bmRlZmluZWQuXG4gKlxuICAgICAgICAgZnVuY3Rpb24gQ291bnRlcigpIHtcbiAgICAgICAgICAgIHRoaXMuY291bnQgPSAwO1xuICAgICAgICAgfTtcblxuICAgICAgICAgQ291bnRlci5wcm90b3R5cGUgPSB7XG4gICAgICAgICAgICBnZXRDb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY291bnQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaW5jcmVhc2VDb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb3VudCsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgfVxuXG4gICAgICAgICB2YXIgQyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICAgICAgICAgICRjb21wb3NpdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NvdW50ZXInLFxuICAgICAgICAgICAgICAgICAgICBDb25zdHJ1Y3RvcjogQ291bnRlcixcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kczogJ2FsbE1ldGhvZHMnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgYyA9IG5ldyBDKClcblxuICAgICAgICBjLmluY3JlYXNlQ291bnQoKTtcbiAgICAgICAgYy5pbmNyZWFzZUNvdW50KCk7XG4gICAgICAgIGMuaW5jcmVhc2VDb3VudCgpO1xuICAgICAgICBjLmdldENvdW50KCk7XG4gICAgICAgID4zXG4gICAgICAgIGMuY291bnRcbiAgICAgICAgPnVuZGVmaW5lZFxuICpcbiAqIEx1YyBjb21lcyB3aXRoIHR3byBkZWZhdWx0IGNvbXBvc2l0aW9uIG9iamVjdHMgTHVjLmNvbXBvc2l0aW9uRW51bXMuUGx1Z2luTWFuYWdlclxuICogYW5kIEx1Yy5jb21wb3NpdGlvbkVudW1zLkV2ZW50RW1pdHRlci5cbiAqIFxuICogSGVyZSBpcyB0aGUgcGx1Z2luIG1hbmFnZXIgZW51bSwga2VlcCBpbiBtaW5kIHRoYXQgdGhpc1xuICogZnVuY3Rpb25hbGl0eSBjYW4gYmUgYWRkZWQgdG8gYW55IGNsYXNzLCBub3QganVzdCBvbmVzIGRlZmluZWQgd2l0aCBcbiAqIEx1Yy5kZWZpbmUuICBDaGVjayBvdXQgTHVjLlBsdWdpbk1hbmFnZXIgdG8gc2VlIGFsbCBvZiB0aGUgcHVibGljIFxuICogbWV0aG9kcyB0aGF0IGdldHMgYWRkZWQgdG8gdGhlIGRlZmluZWQgaW5zdGFuY2UuXG4gXG4gKiBBIHBsdWdpbiBmb2xsb3dzIHRoZSBmb2xsb3dpbmcgbGlmZS1jeWNsZTogPGJyPlxuICAgIFxuICpwbHVnaW4gaXMgYWRkZWQgdG8gdGhlIGluc3RhbmNlIC0+IHBsdWdpbiBpcyBjcmVhdGVkIC0+IHBsdWdpbiBpbml0IGlzIGNhbGxlZCB3aXRoIGluc3RhbmNlIC0+IGlmIG5lZWRlZCBkZXN0cm95IGNhbGxlZCBieSBpbnN0YW5jZSAtPiBkZXN0cm95IGNhbGxlZCBvbiBwbHVnaW4gPGJyPlxuICpIZXJlIGlzIHRoZSBtb3N0IGJhc2ljIGV4YW1wbGUgdXNpbmcgdGhlIHtAbGluayBMdWMuUGx1Z2luIGRlZmF1bHR9IHBsdWdpbi5cbiAgIFxuICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgICRjb21wb3NpdGlvbnM6IEx1Yy5jb21wb3NpdGlvbkVudW1zLlBsdWdpbk1hbmFnZXJcbiAgICB9KTtcblxuICAgIHZhciBjID0gbmV3IEMoe1xuICAgICAgICBwbHVnaW5zOiBbe1xuICAgICAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaW0gZ2V0dGluZyBpbml0dGVkJylcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG15Q29vbE5hbWU6ICdjb29sJ1xuICAgICAgICAgICAgfVxuICAgICAgICBdXG4gICAgfSk7XG5cbiAgICA+aW0gZ2V0dGluZyBpbml0dGVkXG5cbiAgICBjLmdldFBsdWdpbih7bXlDb29sTmFtZTogJ2Nvbyd9KSBpbnN0YW5jZW9mIEx1Yy5QbHVnaW5cbiAgICA+IHRydWVcblxuKiAgUGx1Z2lucyBjYW4gYmUgb2YgYW55IGNsYXNzIGFuZCBjYW4gYmUgYWRkZWQgd2l0aCB7QGxpbmsgTHVjLlBsdWdpbk1hbmFnZXIjYWRkUGx1Z2luIGFkZFBsdWdpbn1cblxuICAgIGZ1bmN0aW9uIE15UGx1Z2luKCl7fVxuXG4gICAgdmFyIEMgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgJGNvbXBvc2l0aW9uczogTHVjLmNvbXBvc2l0aW9uRW51bXMuUGx1Z2luTWFuYWdlclxuICAgIH0pO1xuXG4gICAgdmFyIGMgPSBuZXcgQygpO1xuXG4gICAgYy5hZGRQbHVnaW4oe0NvbnN0cnVjdG9yOiBNeVBsdWdpbn0pO1xuICAgIC8vZ2V0UGx1Z2luIHRha2VzIGEgQ29uc3RydWN0b3Igb3IgbWF0Y2ggb2JqZWN0XG4gICAgYy5nZXRQbHVnaW4oTXlQbHVnaW4pIGluc3RhbmNlb2YgTXlQbHVnaW5cbiAgICA+dHJ1ZVxuICAgIGMuZ2V0UGx1Z2luKEx1Yy5QbHVnaW4pXG4gICAgPmZhbHNlXG5cbiogUGx1Z2lucyBjYW4gYWxzbyBiZSBkZXN0cm95ZWQgaW5kaXZpZHVhbGx5IG9yIGFsbCBvZiB0aGVtIGF0IG9uY2VcbiAgICBcbiAgICB2YXIgQyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICAkY29tcG9zaXRpb25zOiBMdWMuY29tcG9zaXRpb25FbnVtcy5QbHVnaW5NYW5hZ2VyXG4gICAgfSk7XG5cbiAgICB2YXIgYyA9IG5ldyBDKHtcbiAgICAgICAgcGx1Z2luczogW3tcbiAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpbSBnZXR0aW5nIGluaXR0ZWQgJyArIHRoaXMubmFtZSlcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkZXN0cm95OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZGVzdHJveWVkIDogJyArIHRoaXMubmFtZSlcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBuYW1lOiAnMSdcbiAgICAgICAgfSx7XG4gICAgICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaW0gZ2V0dGluZyBpbml0dGVkICcgKyB0aGlzLm5hbWUpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGVzdHJveTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Rlc3Ryb3llZCA6ICcgKyB0aGlzLm5hbWUpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbmFtZTogJzInXG4gICAgICAgIH1dXG4gICAgfSk7XG5cbiAgICA+aW0gZ2V0dGluZyBpbml0dGVkIDFcbiAgICA+aW0gZ2V0dGluZyBpbml0dGVkIDJcbiAgICBcblxuICAgIGMuZGVzdHJveVBsdWdpbih7bmFtZTogJzEnfSk7XG4gICAgPmRlc3Ryb3llZCA6IDFcbiAgICAvL2EgcGx1Z2luIGlzIHJldHVybmVkIGlmIGl0IGlzIGZvdW5kIGFuZCBkZXN0cm95ZWRcbiAgICA+UGx1Z2luIHtpbml0OiBmdW5jdGlvbiwgZGVzdHJveTogZnVuY3Rpb24sIG5hbWU6IFwiMVwiLCBvd25lcjogT2JqZWN0LCBpbml0OiBmdW5jdGlvbuKApn1cblxuICAgIGMuZGVzdHJveVBsdWdpbih7bmFtZTogJzEnfSk7XG4gICAgLy9mYWxzZSBpcyByZXR1cm5lZCBpZiBpdCBpcyBub3QgZm91bmRcbiAgICA+ZmFsc2VcblxuICAgIGMuZGVzdHJveUFsbFBsdWdpbnMoKTtcbiAgICA+ZGVzdHJveWVkIDogMlxuICpcbiAqIFlvdSBjYW4gc2VlIHRoYXQgaXQgY2FuIGFkZCBwbHVnaW4gbGlrZSBiZWhhdmlvciB0byBhbnkgZGVmaW5pbmdcbiAqIGNsYXNzIHdpdGggTHVjLlBsdWdpbk1hbmFnZXIgd2hpY2ggaXMgbGVzcyB0aGFuIDc1IFNMT0MuXG4gKi8iLCJ2YXIgUGx1Z2luID0gcmVxdWlyZSgnLi9wbHVnaW4nKSxcbiAgICBpcyA9IHJlcXVpcmUoJy4uL2lzJyksXG4gICAgb2JqID0gcmVxdWlyZSgnLi4vb2JqZWN0JyksXG4gICAgYXJyID0gcmVxdWlyZSgnLi4vYXJyYXknKSxcbiAgICBhRWFjaCA9IGFyci5lYWNoLFxuICAgIG1peCA9IG9iai5taXgsXG4gICAgYXBwbHkgPSBvYmouYXBwbHk7XG5cbmZ1bmN0aW9uIFBsdWdpbk1hbmFnZXIoY29uZmlnKSB7XG4gICAgdGhpcy5faW5pdChjb25maWcpO1xufVxuXG4vKipcbiAqIEBwcm90ZWN0ZWRcbiAqIEBjbGFzcyBMdWMuUGx1Z2luTWFuYWdlclxuICogVGhpcyBjbGFzcyBpcyB1c2VkIGJ5IEx1Yy5jb21wb3NpdGlvbkVudW1zI1BsdWdpbk1hbmFnZXIgdG8gYWRkIGl0cyBmdW5jdGlvbmFsaXR5IFxuICogdG8gYW55IGNsYXNzLiAgIEJ5IHtAbGluayBMdWMuY29tcG9zaXRpb25FbnVtcyNQbHVnaW5NYW5hZ2VyIGRlZmF1bHR9IGl0IGFkZHNcbiAqIGFsbCBvZiB0aGVzZSBwdWJsaWMgbWV0aG9kcyB0byB0aGUgaW5zdGFuY2UuVGhpcyBjbGFzcyBpcyBkZXNpZ25lZCB0byB3b3JrIGFzIGEgY29tcG9zaXRpb24sIFxuICogaXQgaXMgZXhwb3NlZCBhcyBub3QgcHJpdmF0ZSBzbyBpdCBjYW4gYmUgZXh0ZW5kZWQgaWYgbmVlZGVkLiAgIENoZWNrIFwicHJvdGVjdGVkXCIgd2hpY2hcbiAqIGlzIGEgcGFydCBvZiB0aGUgU2hvdyB2IGRyb3Bkb3duIG9uIHRoZSByaWdodCB0byBzZWUgdGhlIHByb3RlY3RlZCBtZXRob2RzLlxuICpcbiAgICBmdW5jdGlvbiBNeVBsdWdpbigpIHtcbiAgICAgICAgdGhpcy5teUNvb2xOYW1lID0gJ2Nvbyc7XG5cbiAgICAgICAgdGhpcy5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnaW0gZ2V0dGluZyBpbml0dGVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnTXlQbHVnaW4gaW5zdGFuY2UgYmVpbmcgZGVzdHJveWVkJylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgICRjb21wb3NpdGlvbnM6IEx1Yy5jb21wb3NpdGlvbkVudW1zLlBsdWdpbk1hbmFnZXJcbiAgICB9KTtcblxuICAgIHZhciBjID0gbmV3IEMoe1xuICAgICAgICBwbHVnaW5zOiBbe1xuICAgICAgICAgICAgICAgIENvbnN0cnVjdG9yOiBNeVBsdWdpbixcbiAgICAgICAgICAgICAgICBteUNvb2xOYW1lOiAnY29vJ1xuICAgICAgICAgICAgfVxuICAgICAgICBdXG4gICAgfSk7XG5cbiAgICA+aW0gZ2V0dGluZyBpbml0dGVkXG5cbiAgICB2YXIgcGx1Z0luc3RhbmNlID0gYy5hZGRQbHVnaW4oe1xuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdJbSBnZXR0aW5nIGRlc3Ryb3llZCcpXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGMuZ2V0UGx1Z2luKEx1Yy5QbHVnaW4pXG4gICAgPiBQbHVnaW4ge2Rlc3Ryb3k6IGZ1bmN0aW9uLCBvd25lcjogTXlDbGFzcywgaW5pdDogZnVuY3Rpb24sIGRlc3Ryb3k6IGZ1bmN0aW9ufVxuXG4gICAgYy5nZXRQbHVnaW4oTXlQbHVnaW4pXG4gICAgPiBNeVBsdWdpbiB7bXlDb29sTmFtZTogXCJjb29cIiwgaW5pdDogZnVuY3Rpb24sIGRlc3Ryb3k6IGZ1bmN0aW9ufVxuXG4gICAgYy5kZXN0cm95QWxsUGx1Z2lucygpXG5cbiAgICA+TXlQbHVnaW4gaW5zdGFuY2UgYmVpbmcgZGVzdHJveWVkXG4gICAgPkltIGdldHRpbmcgZGVzdHJveWVkXG5cbiAgICBjLmdldFBsdWdpbihNeVBsdWdpbilcbiAgICA+ZmFsc2VcblxuICovXG5QbHVnaW5NYW5hZ2VyLnByb3RvdHlwZSA9IHtcbiAgIC8qKlxuICAgICogQGNmZyB7Q29uc3RydWN0b3J9IGRlZmF1bHRQbHVnaW5cbiAgICAqL1xuICAgIGRlZmF1bHRQbHVnaW46IFBsdWdpbixcblxuICAgIC8qKlxuICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgKi9cbiAgICBfaW5pdDogZnVuY3Rpb24oaW5zdGFuY2VWYWx1ZXMpIHtcbiAgICAgICAgYXBwbHkodGhpcywgaW5zdGFuY2VWYWx1ZXMpO1xuICAgICAgICB0aGlzLnBsdWdpbnMgPSBbXTtcbiAgICAgICAgdGhpcy5fY3JlYXRlUGx1Z2lucygpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcHJvdGVjdGVkXG4gICAgICovXG4gICAgX2NyZWF0ZVBsdWdpbnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICBhRWFjaCh0aGlzLl9nZXRQbHVnaW5Db25maWdGcm9tSW5zdGFuY2UoKSwgZnVuY3Rpb24ocGx1Z2luQ29uZmlnKSB7XG4gICAgICAgICAgICB0aGlzLmFkZFBsdWdpbihwbHVnaW5Db25maWcpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHByb3RlY3RlZFxuICAgICAqL1xuICAgIF9nZXRQbHVnaW5Db25maWdGcm9tSW5zdGFuY2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY29uZmlnID0gdGhpcy5pbnN0YW5jZUFyZ3NbMF0gfHwge307XG4gICAgICAgIHJldHVybiBjb25maWcucGx1Z2lucztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgcGx1Z2luIHRvIHRoZSBpbnN0YW5jZSBhbmQgaW5pdCB0aGUgXG4gICAgICogcGx1Z2luLlxuICAgICAqIEBwYXJhbSAge09iamVjdH0gcGx1Z2luQ29uZmlnXG4gICAgICogQHJldHVybiB7T2JqZWN0fSB0aGUgY3JlYXRlZCBwbHVnaW4gaW5zdGFuY2VcbiAgICAgKi9cbiAgICBhZGRQbHVnaW46IGZ1bmN0aW9uKHBsdWdpbkNvbmZpZykge1xuICAgICAgICB2YXIgcGx1Z2luSW5zdGFuY2UgPSB0aGlzLl9jcmVhdGVQbHVnaW4ocGx1Z2luQ29uZmlnKTtcblxuICAgICAgICB0aGlzLl9pbml0UGx1Z2luKHBsdWdpbkluc3RhbmNlKTtcblxuICAgICAgICB0aGlzLnBsdWdpbnMucHVzaChwbHVnaW5JbnN0YW5jZSk7XG5cbiAgICAgICAgcmV0dXJuIHBsdWdpbkluc3RhbmNlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcHJvdGVjdGVkXG4gICAgICovXG4gICAgX2NyZWF0ZVBsdWdpbjogZnVuY3Rpb24oY29uZmlnKSB7XG4gICAgICAgIGNvbmZpZy5vd25lciA9IHRoaXMuaW5zdGFuY2U7XG5cbiAgICAgICAgaWYgKGNvbmZpZy5Db25zdHJ1Y3Rvcikge1xuICAgICAgICAgICAgLy9jYWxsIHRoZSBjb25maWdlZCBDb25zdHJ1Y3RvciB3aXRoIHRoZSBcbiAgICAgICAgICAgIC8vcGFzc2VkIGluIGNvbmZpZyBidXQgdGFrZSBvZmYgdGhlIENvbnN0cnVjdG9yXG4gICAgICAgICAgICAvL2NvbmZpZy5cbiAgICAgICAgICAgICBcbiAgICAgICAgICAgIC8vVGhlIHBsdWdpbiBDb25zdHJ1Y3RvciBcbiAgICAgICAgICAgIC8vc2hvdWxkIG5vdCBuZWVkIHRvIGtub3cgYWJvdXQgaXRzZWxmXG4gICAgICAgICAgICByZXR1cm4gbmV3IGNvbmZpZy5Db25zdHJ1Y3RvcihhcHBseShjb25maWcsIHtcbiAgICAgICAgICAgICAgICBDb25zdHJ1Y3RvcjogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IHRoaXMuZGVmYXVsdFBsdWdpbihjb25maWcpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcHJvdGVjdGVkXG4gICAgICovXG4gICAgX2luaXRQbHVnaW46IGZ1bmN0aW9uKHBsdWdpbikge1xuICAgICAgICBpZiAoaXMuaXNGdW5jdGlvbihwbHVnaW4uaW5pdCkpIHtcbiAgICAgICAgICAgIHBsdWdpbi5pbml0KHRoaXMuaW5zdGFuY2UpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENhbGwgZGVzdHJveSBvbiBhbGwgb2YgdGhlIHBsdWdpbnNcbiAgICAgKiBhbmQgcmVtb3ZlIHRoZW0uXG4gICAgICovXG4gICAgZGVzdHJveUFsbFBsdWdpbnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnBsdWdpbnMuZm9yRWFjaChmdW5jdGlvbihwbHVnaW4pIHtcbiAgICAgICAgICAgIHRoaXMuX2Rlc3Ryb3lQbHVnaW4ocGx1Z2luKTtcbiAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5wbHVnaW5zID0gW107XG4gICAgfSxcblxuICAgIF9kZXN0cm95UGx1Z2luOiBmdW5jdGlvbihwbHVnaW4pIHtcbiAgICAgICAgaWYgKGlzLmlzRnVuY3Rpb24ocGx1Z2luLmRlc3Ryb3kpKSB7XG4gICAgICAgICAgICBwbHVnaW4uZGVzdHJveSh0aGlzLmluc3RhbmNlKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgdGhlIHBsdWdpbiBhbmQgaWYgZm91bmQgZGVzdHJveSBpdC5cbiAgICAgKiBAcGFyYW0gIHtPYmplY3QvQ29uc3RydWN0b3J9IG9iamVjdCB0byB1c2UgdG8gbWF0Y2ggXG4gICAgICogdGhlIHBsdWdpbiB0byByZW1vdmUuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSB0aGUgZGVzdHJveWVkIHBsdWdpbi5cbiAgICAgKi9cbiAgICBkZXN0cm95UGx1Z2luOiBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgdmFyIHBsdWdpbiA9IHRoaXMuZ2V0UGx1Z2luKG9iaik7XG5cbiAgICAgICAgaWYocGx1Z2luKSB7XG4gICAgICAgICAgICB0aGlzLl9kZXN0cm95UGx1Z2luKHBsdWdpbik7XG4gICAgICAgICAgICBhcnIucmVtb3ZlRmlyc3QodGhpcy5wbHVnaW5zLCBwbHVnaW4sIHt0eXBlOiAnc3RyaWN0J30pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBsdWdpbjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IGEgcGx1Z2luIGluc3RhbmNlLiAgQSBDb25zdHJ1Y3RvciBvciBhbiBvYmplY3QgY2FuIGJlIHVzZWRcbiAgICAgKiB0byBmaW5kIGEgcGx1Z2luLlxuICAgICAqXG4gICAgICAgICAgYy5hZGRQbHVnaW4oe2E6MX0pXG4gICAgICAgICAgYy5nZXRQbHVnaW4oe2E6MX0pXG4gICAgICAgICAgPkx1Yy5QbHVnaW4oe2E6MX0pXG5cbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9IG9iaiBcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IHRoZSBwbHVnaW4gaW5zdGFuY2UgaWYgZm91bmQuXG4gICAgICovXG4gICAgZ2V0UGx1Z2luOiBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgaWYgKGlzLmlzRnVuY3Rpb24ob2JqKSkge1xuICAgICAgICAgICAgcmV0dXJuIGFyci5maW5kRmlyc3RJbnN0YW5jZU9mKHRoaXMucGx1Z2lucywgb2JqKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXJyLmZpbmRGaXJzdCh0aGlzLnBsdWdpbnMsIG9iaiwge3R5cGU6ICdsb29zZSd9KTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBsdWdpbk1hbmFnZXI7IiwidmFyIGFFYWNoID0gcmVxdWlyZSgnLi4vYXJyYXknKS5lYWNoLFxuICAgIG9iaiA9IHJlcXVpcmUoJy4uL29iamVjdCcpLFxuICAgIGVtcHR5Rm4gPSByZXF1aXJlKCcuLi9mdW5jdGlvbicpLmVtcHR5Rm4sXG4gICAgYXBwbHkgPSBvYmouYXBwbHk7XG5cbi8qKlxuICogQGNsYXNzIEx1Yy5QbHVnaW5cbiAqIFNpbXBsZSBjbGFzcyB0aGF0IGlzIHRoZSBkZWZhdWx0IHBsdWdpbiB0eXBlIGZvciBMdWMuUGx1Z2luTWFuYWdlclxuICovXG5mdW5jdGlvbiBQbHVnaW4oY29uZmlnKSB7XG4gICAgYXBwbHkodGhpcywgY29uZmlnKTtcbn1cblxuUGx1Z2luLnByb3RvdHlwZSA9IHtcbiAgICAvKipcbiAgICAgKiBAbWV0aG9kXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG93bmVyIHRoZSBvd25lciBpbnN0YW5jZVxuICAgICAqIFNpbXBsZSBob29rIHRvIGluaXRpYWxpemUgdGhlIHBsdWdpblxuICAgICAqIERlZmF1bHRzIHRvIEx1Yy5lbXB0eUZuLlxuICAgICAqL1xuICAgIGluaXQ6IGVtcHR5Rm4sXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBcbiAgICAgKiBEZWZhdWx0cyB0byBMdWMuZW1wdHlGbi5cbiAgICAgKiBDYWxsZWQgd2hlbiB0aGUgcGx1Z2luIGlzIGJlaW5nIHtAbGluayBMdWMuUGx1Z2luTWFuYWdlciNkZXN0cm95UGx1Z2luIGRlc3Ryb3llZH0uXG4gICAgICovXG4gICAgZGVzdHJveTogZW1wdHlGblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQbHVnaW47XG4iLCJ2YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnLi4vZXZlbnRzL2V2ZW50RW1pdHRlcicpLFxuICAgIFBsdWdpbk1hbmFnZXIgPSByZXF1aXJlKCcuL3BsdWdpbk1hbmFnZXInKTtcblxuLyoqXG4gKiBAY2xhc3MgTHVjLmNvbXBvc2l0aW9uRW51bXNcbiAqIENvbXBvc2l0aW9uIGVudW1zIGFyZSBqdXN0IGNvbW1vbiBjb25maWcgb2JqZWN0cyBmb3IgTHVjLkNvbXBvc2l0aW9uLlxuICogSGVyZSBpcyBhbiBleGFtcGxlIG9mIGEgY29tcG9zaXRpb24gdGhhdCB1c2VzIEV2ZW50RW1pdHRlciBidXQgb25seVxuICogcHV0cyB0aGUgZW1pdCBtZXRob2Qgb24gdGhlIHByb3RvdHlwZS5cbiAqXG4gICAgdmFyIEMgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgJGNvbXBvc2l0aW9uczoge1xuICAgICAgICAgICAgZGVmYXVsdHM6IEx1Yy5jb21wb3NpdGlvbkVudW1zLkV2ZW50RW1pdHRlcixcbiAgICAgICAgICAgIG1ldGhvZHM6IFsnZW1pdCddXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciBjID0gbmV3IEMoKTtcblxuICAgIHR5cGVvZiBjLmVtaXRcbiAgICA+XCJmdW5jdGlvblwiXG4gICAgdHlwZW9mIGMub25cbiAgICBcInVuZGVmaW5lZFwiXG4gKiBcbiAqL1xuXG4vKipcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBFdmVudEVtaXR0ZXJcbiAqL1xubW9kdWxlLmV4cG9ydHMuRXZlbnRFbWl0dGVyID0ge1xuICAgIENvbnN0cnVjdG9yOiBFdmVudEVtaXR0ZXIsXG4gICAgbmFtZTogJ2VtaXR0ZXInLFxuICAgIG1ldGhvZHM6ICdhbGxNZXRob2RzJ1xufTtcblxuXG4vKipcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBQbHVnaW5NYW5hZ2VyXG4gKi9cbm1vZHVsZS5leHBvcnRzLlBsdWdpbk1hbmFnZXIgPSB7XG4gICAgbmFtZTogJ3BsdWdpbnMnLFxuICAgIGluaXRBZnRlcjogdHJ1ZSxcbiAgICBDb25zdHJ1Y3RvcjogUGx1Z2luTWFuYWdlcixcbiAgICBjcmVhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbmV3IHRoaXMuQ29uc3RydWN0b3Ioe1xuICAgICAgICAgICAgaW5zdGFuY2U6IHRoaXMuaW5zdGFuY2UsXG4gICAgICAgICAgICBpbnN0YW5jZUFyZ3M6IHRoaXMuaW5zdGFuY2VBcmdzXG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgaWdub3JlTWV0aG9kczogJ2RlZmF1bHRQbHVnaW4nLFxuICAgIG1ldGhvZHM6ICdwdWJsaWNNZXRob2RzJ1xufTsiLCJ2YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyO1xuLyoqXG4gKiBAbGljZW5zZSBodHRwczovL3Jhdy5naXRodWIuY29tL2pveWVudC9ub2RlL3YwLjEwLjExL0xJQ0VOU0VcbiAqIE5vZGUganMgbGljZW5zZS4gRXZlbnRFbWl0dGVyIHdpbGwgYmUgaW4gdGhlIGNsaWVudFxuICogb25seSBjb2RlLlxuICovXG4vKipcbiAqIEBjbGFzcyBMdWMuRXZlbnRFbWl0dGVyXG4gKiBUaGUgd29uZGVyZnVsIGV2ZW50IGVtbWl0ZXIgdGhhdCBjb21lcyB3aXRoIG5vZGUsXG4gKiB0aGF0IHdvcmtzIGluIHRoZSBzdXBwb3J0ZWQgYnJvd3NlcnMuXG4gKiBbaHR0cDovL25vZGVqcy5vcmcvYXBpL2V2ZW50cy5odG1sXShodHRwOi8vbm9kZWpzLm9yZy9hcGkvZXZlbnRzLmh0bWwpXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgLy9wdXQgaW4gZml4IGZvciBJRSA5IGFuZCBiZWxvd1xuICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2VsZi5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcbiAgICAgICAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG5cbiAgICBzZWxmLm9uKHR5cGUsIGcpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjsiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5wcm9jZXNzLm5leHRUaWNrID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2FuU2V0SW1tZWRpYXRlID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cuc2V0SW1tZWRpYXRlO1xuICAgIHZhciBjYW5Qb3N0ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cucG9zdE1lc3NhZ2UgJiYgd2luZG93LmFkZEV2ZW50TGlzdGVuZXJcbiAgICA7XG5cbiAgICBpZiAoY2FuU2V0SW1tZWRpYXRlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gd2luZG93LnNldEltbWVkaWF0ZShmKSB9O1xuICAgIH1cblxuICAgIGlmIChjYW5Qb3N0KSB7XG4gICAgICAgIHZhciBxdWV1ZSA9IFtdO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgaWYgKGV2LnNvdXJjZSA9PT0gd2luZG93ICYmIGV2LmRhdGEgPT09ICdwcm9jZXNzLXRpY2snKSB7XG4gICAgICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgaWYgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZuID0gcXVldWUuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRydWUpO1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICAgICAgcXVldWUucHVzaChmbik7XG4gICAgICAgICAgICB3aW5kb3cucG9zdE1lc3NhZ2UoJ3Byb2Nlc3MtdGljaycsICcqJyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZm4sIDApO1xuICAgIH07XG59KSgpO1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbiIsInZhciBwcm9jZXNzPXJlcXVpcmUoXCJfX2Jyb3dzZXJpZnlfcHJvY2Vzc1wiKTtpZiAoIXByb2Nlc3MuRXZlbnRFbWl0dGVyKSBwcm9jZXNzLkV2ZW50RW1pdHRlciA9IGZ1bmN0aW9uICgpIHt9O1xuXG52YXIgRXZlbnRFbWl0dGVyID0gZXhwb3J0cy5FdmVudEVtaXR0ZXIgPSBwcm9jZXNzLkV2ZW50RW1pdHRlcjtcbnZhciBpc0FycmF5ID0gdHlwZW9mIEFycmF5LmlzQXJyYXkgPT09ICdmdW5jdGlvbidcbiAgICA/IEFycmF5LmlzQXJyYXlcbiAgICA6IGZ1bmN0aW9uICh4cykge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHhzKSA9PT0gJ1tvYmplY3QgQXJyYXldJ1xuICAgIH1cbjtcbmZ1bmN0aW9uIGluZGV4T2YgKHhzLCB4KSB7XG4gICAgaWYgKHhzLmluZGV4T2YpIHJldHVybiB4cy5pbmRleE9mKHgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHggPT09IHhzW2ldKSByZXR1cm4gaTtcbiAgICB9XG4gICAgcmV0dXJuIC0xO1xufVxuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuXG4vLyAxMCBsaXN0ZW5lcnMgYXJlIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2hcbi8vIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuLy9cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG52YXIgZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghdGhpcy5fZXZlbnRzKSB0aGlzLl9ldmVudHMgPSB7fTtcbiAgdGhpcy5fZXZlbnRzLm1heExpc3RlbmVycyA9IG47XG59O1xuXG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzQXJyYXkodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpXG4gICAge1xuICAgICAgaWYgKGFyZ3VtZW50c1sxXSBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGFyZ3VtZW50c1sxXTsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVuY2F1Z2h0LCB1bnNwZWNpZmllZCAnZXJyb3InIGV2ZW50LlwiKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBpZiAoIXRoaXMuX2V2ZW50cykgcmV0dXJuIGZhbHNlO1xuICB2YXIgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgaWYgKCFoYW5kbGVyKSByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKHR5cGVvZiBoYW5kbGVyID09ICdmdW5jdGlvbicpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcblxuICB9IGVsc2UgaWYgKGlzQXJyYXkoaGFuZGxlcikpIHtcbiAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG5cbiAgICB2YXIgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gbGlzdGVuZXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcblxuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcblxuLy8gRXZlbnRFbWl0dGVyIGlzIGRlZmluZWQgaW4gc3JjL25vZGVfZXZlbnRzLmNjXG4vLyBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQoKSBpcyBhbHNvIGRlZmluZWQgdGhlcmUuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCdmdW5jdGlvbicgIT09IHR5cGVvZiBsaXN0ZW5lcikge1xuICAgIHRocm93IG5ldyBFcnJvcignYWRkTGlzdGVuZXIgb25seSB0YWtlcyBpbnN0YW5jZXMgb2YgRnVuY3Rpb24nKTtcbiAgfVxuXG4gIGlmICghdGhpcy5fZXZlbnRzKSB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09IFwibmV3TGlzdGVuZXJzXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyc1wiLlxuICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKSB7XG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIH0gZWxzZSBpZiAoaXNBcnJheSh0aGlzLl9ldmVudHNbdHlwZV0pKSB7XG5cbiAgICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICAgIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgICAgdmFyIG07XG4gICAgICBpZiAodGhpcy5fZXZlbnRzLm1heExpc3RlbmVycyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG0gPSB0aGlzLl9ldmVudHMubWF4TGlzdGVuZXJzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbSA9IGRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgICB9XG5cbiAgICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICtcbiAgICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoKTtcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIH0gZWxzZSB7XG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBzZWxmLm9uKHR5cGUsIGZ1bmN0aW9uIGcoKSB7XG4gICAgc2VsZi5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcbiAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9KTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIGxpc3RlbmVyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdyZW1vdmVMaXN0ZW5lciBvbmx5IHRha2VzIGluc3RhbmNlcyBvZiBGdW5jdGlvbicpO1xuICB9XG5cbiAgLy8gZG9lcyBub3QgdXNlIGxpc3RlbmVycygpLCBzbyBubyBzaWRlIGVmZmVjdCBvZiBjcmVhdGluZyBfZXZlbnRzW3R5cGVdXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pIHJldHVybiB0aGlzO1xuXG4gIHZhciBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0FycmF5KGxpc3QpKSB7XG4gICAgdmFyIGkgPSBpbmRleE9mKGxpc3QsIGxpc3RlbmVyKTtcbiAgICBpZiAoaSA8IDApIHJldHVybiB0aGlzO1xuICAgIGxpc3Quc3BsaWNlKGksIDEpO1xuICAgIGlmIChsaXN0Lmxlbmd0aCA9PSAwKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgfSBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0gPT09IGxpc3RlbmVyKSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBkb2VzIG5vdCB1c2UgbGlzdGVuZXJzKCksIHNvIG5vIHNpZGUgZWZmZWN0IG9mIGNyZWF0aW5nIF9ldmVudHNbdHlwZV1cbiAgaWYgKHR5cGUgJiYgdGhpcy5fZXZlbnRzICYmIHRoaXMuX2V2ZW50c1t0eXBlXSkgdGhpcy5fZXZlbnRzW3R5cGVdID0gbnVsbDtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgaWYgKCF0aGlzLl9ldmVudHMpIHRoaXMuX2V2ZW50cyA9IHt9O1xuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSkgdGhpcy5fZXZlbnRzW3R5cGVdID0gW107XG4gIGlmICghaXNBcnJheSh0aGlzLl9ldmVudHNbdHlwZV0pKSB7XG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gIH1cbiAgcmV0dXJuIHRoaXMuX2V2ZW50c1t0eXBlXTtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIWVtaXR0ZXIuX2V2ZW50cyB8fCAhZW1pdHRlci5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IDA7XG4gIGVsc2UgaWYgKHR5cGVvZiBlbWl0dGVyLl9ldmVudHNbdHlwZV0gPT09ICdmdW5jdGlvbicpXG4gICAgcmV0ID0gMTtcbiAgZWxzZVxuICAgIHJldCA9IGVtaXR0ZXIuX2V2ZW50c1t0eXBlXS5sZW5ndGg7XG4gIHJldHVybiByZXQ7XG59O1xuIiwicmVxdWlyZSgnLi9ub2RlX21vZHVsZXMvZXM1LXNoaW0vZXM1LXNoaW0nKTtcbnJlcXVpcmUoJy4vbm9kZV9tb2R1bGVzL2VzNS1zaGltL2VzNS1zaGFtJyk7IiwidmFyIG9iaiA9IHJlcXVpcmUoJy4uL29iamVjdCcpLFxuICAgIGFycmF5ID0gcmVxdWlyZSgnLi4vYXJyYXknKSxcbiAgICBhcHBseSA9IG9iai5hcHBseSxcbiAgICBtaXggPSBvYmoubWl4LFxuICAgIG9GaWx0ZXIgPSBvYmouZmlsdGVyLFxuICAgIGVtcHR5Rm4gPSAoJy4uL2Z1bmN0aW9uJykuZW1wdHlGbixcbiAgICBpcyA9IHJlcXVpcmUoJy4uL2lzJyk7XG5cbi8qKlxuICogQGNsYXNzICBMdWMuQ29tcG9zaXRpb25cbiAqIEBwcm90ZWN0ZWRcbiAqIENsYXNzIHRoYXQgd3JhcHMge0BsaW5rIEx1Yy5kZWZpbmUjJGNvbXBvc2l0aW9ucyBjb21wb3NpdGlvbn0gY29uZmlnIG9iamVjdHNcbiAqIHRvIGNvbmZvcm0gdG8gYW4gYXBpLiBUaGlzIGNsYXNzIGlzIG5vdCBhdmFpbGFibGUgZXh0ZXJuYWxseS4gIFRoZSBjb25maWcgb2JqZWN0XG4gKiB3aWxsIG92ZXJyaWRlIGFueSBwcm90ZWN0ZWQgbWV0aG9kcyBhbmQgZGVmYXVsdCBjb25maWdzLiAgRGVmYXVsdHNcbiAqIGNhbiBiZSB1c2VkIGZvciBvZnRlbiB1c2VkIGNvbmZpZ3MsIGtleXMgdGhhdCBhcmUgbm90IGRlZmF1bHRzIHdpbGxcbiAqIG92ZXJyaWRlIHRoZSBkZWZhdWx0cy5cbiAqXG4gICAgdmFyIEMgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgJGNvbXBvc2l0aW9uczoge1xuICAgICAgICAgICAgZGVmYXVsdHM6IEx1Yy5jb21wb3NpdGlvbkVudW1zLkV2ZW50RW1pdHRlcixcbiAgICAgICAgICAgIG1ldGhvZHM6IFsnZW1pdCddXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciBjID0gbmV3IEMoKVxuICAgIHR5cGVvZiBjLmVtaXRcbiAgICA+XCJmdW5jdGlvblwiXG4gICAgdHlwZW9mIGMub25cbiAgICA+XCJ1bmRlZmluZWRcIlxuICpcbiAqIElmIHlvdSB3YW50IHRvIGFkZCB5b3VyIG93biBjb21wb3NpdGlvbiBhbGwgeW91IG5lZWQgdG8gaGF2ZSBpc1xuICogYSBuYW1lIGFuZCBhIENvbnN0cnVjdG9yLCB0aGUgcmVzdCBvZiB0aGUgY29uZmlncyBvZiB0aGlzIGNsYXNzIGFuZCBMdWMuQ29tcG9zaXRpb24uY3JlYXRlXG4gKiBjYW4gYmUgdXNlZCB0byBpbmplY3QgYmVoYXZpb3IgaWYgbmVlZGVkLlxuICogXG4gICAgIGZ1bmN0aW9uIENvdW50ZXIoKSB7XG4gICAgICAgIHRoaXMuY291bnQgPSAwO1xuICAgICB9O1xuXG4gICAgIENvdW50ZXIucHJvdG90eXBlID0ge1xuICAgICAgICBnZXRDb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb3VudDtcbiAgICAgICAgfSxcbiAgICAgICAgaW5jcmVhc2VDb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLmNvdW50Kys7XG4gICAgICAgIH1cbiAgICAgfVxuXG4gICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgICAgICAkY29tcG9zaXRpb25zOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2NvdW50ZXInLFxuICAgICAgICAgICAgICAgIENvbnN0cnVjdG9yOiBDb3VudGVyLFxuICAgICAgICAgICAgICAgIG1ldGhvZHM6ICdhbGxNZXRob2RzJ1xuICAgICAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIGMgPSBuZXcgQygpXG5cbiAgICBjLmluY3JlYXNlQ291bnQoKTtcbiAgICBjLmluY3JlYXNlQ291bnQoKTtcbiAgICBjLmluY3JlYXNlQ291bnQoKTtcbiAgICBjLmdldENvdW50KCk7XG4gICAgPjNcbiAgICBjLmNvdW50XG4gICAgPnVuZGVmaW5lZFxuICovXG5mdW5jdGlvbiBDb21wb3NpdGlvbihjKSB7XG4gICAgdmFyIGRlZmF1bHRzID0gYy5kZWZhdWx0cyxcbiAgICAgICAgY29uZmlnID0gYztcblxuICAgIGlmKGRlZmF1bHRzKSB7XG4gICAgICAgIG1peChjb25maWcsIGNvbmZpZy5kZWZhdWx0cyk7XG4gICAgICAgIGRlbGV0ZSBjb25maWcuZGVmYXVsdHM7XG4gICAgfVxuXG4gICAgYXBwbHkodGhpcywgY29uZmlnKTtcbn1cblxuQ29tcG9zaXRpb24ucHJvdG90eXBlID0ge1xuICAgIC8qKlxuICAgICAqIEBjZmcge1N0cmluZ30gbmFtZSAocmVxdWlyZWQpIHRoZSBuYW1lIHdoaWNoIHRoZSBjb21wb3NpdGlvblxuICAgICAqIHdpbGwgYmUgcmVmZXJyZWQgdG8gYnkgdGhlIGluc3RhbmNlLlxuICAgICAqL1xuICAgIFxuICAgIC8qKlxuICAgICAqIEBjZmcge09iamVjdH0gZGVmYXVsdHNcbiAgICAgKi9cbiAgICBcbiAgICAvKipcbiAgICAgKiBAY2ZnIHtCb29sZWFufSBpbml0QWZ0ZXIgIGRlZmF1bHRzIHRvIGZhbHNlXG4gICAgICogcGFzcyBpbiB0cnVlIHRvIGluaXQgdGhlIGNvbXBvc2l0aW9uIGluc3RhbmNlIGFmdGVyIHRoZSBcbiAgICAgKiBzdXBlcmNsYXNzIGhhcyBiZWVuIGNhbGxlZC5cbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIEBjZmcge0Z1bmN0aW9ufSBDb25zdHJ1Y3RvciAocmVxdWlyZWQpIHRoZSBDb25zdHJ1Y3RvclxuICAgICAqIHRvIHVzZSB3aGVuIGNyZWF0aW5nIHRoZSBjb21wb3NpdGlvbiBpbnN0YW5jZS4gIFRoaXNcbiAgICAgKiBpcyByZXF1aXJlZCBpZiBMdWMuQ29tcG9zaXRpb24uY3JlYXRlIGlzIG5vdCBvdmVyd3JpdHRlbiBieVxuICAgICAqIHRoZSBwYXNzZWQgaW4gY29tcG9zaXRpb24gY29uZmlnIG9iamVjdC5cbiAgICAgKi9cbiAgICBcbiAgICAvKipcbiAgICAgKiBAcHJvdGVjdGVkXG4gICAgICogQnkgZGVmYXVsdCBqdXN0IHJldHVybiBhIG5ld2x5IGNyZWF0ZWQgQ29uc3RydWN0b3IgaW5zdGFuY2UuXG4gICAgICogXG4gICAgICogV2hlbiBjcmVhdGUgaXMgY2FsbGVkIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllcyBjYW4gYmUgdXNlZCA6XG4gICAgICogXG4gICAgICogdGhpcy5pbnN0YW5jZSBUaGUgaW5zdGFuY2UgdGhhdCBpcyBjcmVhdGluZ1xuICAgICAqIHRoZSBjb21wb3NpdGlvbi5cbiAgICAgKiBcbiAgICAgKiB0aGlzLkNvbnN0cnVjdG9yIHRoZSBjb25zdHJ1Y3RvciB0aGF0IGlzIHBhc3NlZCBpbiBmcm9tXG4gICAgICogdGhlIGNvbXBvc2l0aW9uIGNvbmZpZy4gXG4gICAgICpcbiAgICAgKiB0aGlzLmluc3RhbmNlQXJncyB0aGUgYXJndW1lbnRzIHBhc3NlZCBpbnRvIHRoZSBpbnN0YW5jZSB3aGVuIGl0IFxuICAgICAqIGlzIGJlaW5nIGNyZWF0ZWQuICBGb3IgZXhhbXBsZVxuXG4gICAgICAgIG5ldyBNeUNsYXNzV2l0aEFDb21wb3NpdGlvbih7cGx1Z2luczogW119KVxuICAgICAgICAvL2luc2lkZSBvZiB0aGUgY3JlYXRlIG1ldGhvZFxuICAgICAgICB0aGlzLmluc3RhbmNlQXJnc1xuICAgICAgICA+W3twbHVnaW5zOiBbXX1dXG5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFxuICAgICAqIHRoZSBjb21wb3NpdGlvbiBpbnN0YW5jZS5cbiAgICAgKlxuICAgICAqIEZvciBleGFtcGxlIHNldCB0aGUgZW1pdHRlcnMgbWF4TGlzdGVuZXJzXG4gICAgICogdG8gd2hhdCB0aGUgaW5zdGFuY2UgaGFzIGNvbmZpZ2VkLlxuICAgICAgXG4gICAgICAgIG1heExpc3RlbmVyczogMTAwLFxuICAgICAgICAkY29tcG9zaXRpb25zOiB7XG4gICAgICAgICAgICBDb25zdHJ1Y3RvcjogTHVjLkV2ZW50RW1pdHRlcixcbiAgICAgICAgICAgIGNyZWF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIGVtaXR0ZXIgPSBuZXcgdGhpcy5Db25zdHJ1Y3RvcigpO1xuICAgICAgICAgICAgICAgIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKHRoaXMuaW5zdGFuY2UubWF4TGlzdGVuZXJzKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZW1pdHRlcjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBuYW1lOiAnZW1pdHRlcidcbiAgICAgICAgfVxuXG4gICAgICovXG4gICAgY3JlYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzLkNvbnN0cnVjdG9yKCk7XG4gICAgfSxcblxuICAgIGdldEluc3RhbmNlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlKCk7XG4gICAgfSxcblxuICAgIHZhbGlkYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYodGhpcy5uYW1lICA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0EgbmFtZSBtdXN0IGJlIGRlZmluZWQnKTtcbiAgICAgICAgfVxuICAgICAgICBpZighaXMuaXNGdW5jdGlvbih0aGlzLkNvbnN0cnVjdG9yKSAmJiB0aGlzLmNyZWF0ZSA9PT0gQ29tcG9zaXRpb24ucHJvdG90eXBlLmNyZWF0ZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgQ29uc3RydWN0b3IgbXVzdCBiZSBmdW5jdGlvbiBpZiBjcmVhdGUgaXMgbm90IG92ZXJyaWRkZW4nKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkgZmlsdGVyTWV0aG9kRm5zXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAcHJvcGVydHkgZmlsdGVyTWV0aG9kRm5zLmFsbE1ldGhvZHMgcmV0dXJuIGFsbCBtZXRob2RzIGZyb20gdGhlXG4gICAgICogY29uc3RydWN0b3JzIHByb3RvdHlwZVxuICAgICAqIEBwcm9wZXJ0eSBmaWx0ZXJNZXRob2RGbnMucHVibGljIHJldHVybiBhbGwgbWV0aG9kcyB0aGF0IGRvbid0XG4gICAgICogc3RhcnQgd2l0aCBfLiAgV2Uga25vdyBub3QgZXZlcnlvbmUgZm9sbG93cyB0aGlzIGNvbnZlbnRpb24sIGJ1dCB3ZVxuICAgICAqIGRvIGFuZCBzbyBkbyBtYW55IG90aGVycy5cbiAgICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAgICovXG4gICAgZmlsdGVyTWV0aG9kRm5zOiB7XG4gICAgICAgIGFsbE1ldGhvZHM6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBpcy5pc0Z1bmN0aW9uKHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgcHVibGljTWV0aG9kczogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGlzLmlzRnVuY3Rpb24odmFsdWUpICYmIGtleS5jaGFyQXQoMCkgIT09ICdfJztcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAY2ZnIHtGdW5jdGlvbi9TdHJpbmcvQXJyYXlbXX0gbWV0aG9kc1xuICAgICAqIFRoZSBrZXlzIHRvIGFkZCB0byB0aGUgZGVmaW5lcnMgcHJvdG90eXBlIHRoYXQgd2lsbCBpbiB0dXJuIGNhbGxcbiAgICAgKiB0aGUgY29tcG9zaXRpb25zIG1ldGhvZC5cbiAgICAgKiBcbiAgICAgKiBEZWZhdWx0cyB0byBMdWMuZW1wdHlGbi4gXG4gICAgICogSWYgYW4gYXJyYXkgaXMgcGFzc2VkIGl0IHdpbGwganVzdCB1c2UgdGhhdCBBcnJheS5cbiAgICAgKiBcbiAgICAgKiBJZiBhIHN0cmluZyBpcyBwYXNzZWQgYW5kIG1hdGNoZXMgYSBtZXRob2QgZnJvbSBcbiAgICAgKiBMdWMuQ29tcG9zaXRpb24uZmlsdGVyTWV0aG9kRm5zIGl0IHdpbGwgY2FsbCB0aGF0IGluc3RlYWQuXG4gICAgICogXG4gICAgICogSWYgYSBmdW5jdGlvbiBpcyBkZWZpbmVkIGl0XG4gICAgICogd2lsbCBnZXQgY2FsbGVkIHdoaWxlIGl0ZXJhdGluZyBvdmVyIGVhY2gga2V5IHZhbHVlIHBhaXIgb2YgdGhlIFxuICAgICAqIENvbnN0cnVjdG9yJ3MgcHJvdG90eXBlLCBpZiBhIHRydXRoeSB2YWx1ZSBpcyBcbiAgICAgKiByZXR1cm5lZCB0aGUgcHJvcGVydHkgd2lsbCBiZSBhZGRlZCB0byB0aGUgZGVmaW5pbmdcbiAgICAgKiBjbGFzc2VzIHByb3RvdHlwZS5cbiAgICAgKiBcbiAgICAgKiBGb3IgZXhhbXBsZSB0aGlzIGNvbmZpZyB3aWxsIG9ubHkgZXhwb3NlIHRoZSBlbWl0IG1ldGhvZCBcbiAgICAgKiB0byB0aGUgZGVmaW5pbmcgY2xhc3NcbiAgICAgXG4gICAgICAgICRjb21wb3NpdGlvbnM6IHtcbiAgICAgICAgICAgIENvbnN0cnVjdG9yOiBMdWMuRXZlbnRFbWl0dGVyLFxuICAgICAgICAgICAgbWV0aG9kczogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBrZXkgPT09ICdlbWl0JztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBuYW1lOiAnZW1pdHRlcidcbiAgICAgICAgfVxuICAgICAqIHRoaXMgaXMgYWxzbyBhIHZhbGlkIGNvbmZpZ1xuICAgICAqIFxuICAgICAgICAkY29tcG9zaXRpb25zOiB7XG4gICAgICAgICAgICBDb25zdHJ1Y3RvcjogTHVjLkV2ZW50RW1pdHRlcixcbiAgICAgICAgICAgIG1ldGhvZHM6IFsnZW1pdHRlciddLFxuICAgICAgICAgICAgbmFtZTogJ2VtaXR0ZXInXG4gICAgICAgIH1cbiAgICAgKiBcbiAgICAgKi9cbiAgICBtZXRob2RzOiBlbXB0eUZuLFxuXG4gICAgLyoqXG4gICAgICogQGNmZyB7U3RyaW5nW10vU3RyaW5nfSBpZ25vcmVNZXRob2RzIG1ldGhvZHMgdGhhdCB3aWxsIGFsd2F5c1xuICAgICAqIGJlIGlnbm9yZWQgaWYgbWV0aG9kcyBpcyBub3QgYW4gQXJyYXkuXG4gICAgICpcbiAgICAgICAgXG4gICAgICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgICAgICAgICAgJGNvbXBvc2l0aW9uczoge1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0czogTHVjLmNvbXBvc2l0aW9uRW51bXMuRXZlbnRFbWl0dGVyLFxuICAgICAgICAgICAgICAgICAgICBtZXRob2RzOiAnYWxsTWV0aG9kcycsXG4gICAgICAgICAgICAgICAgICAgIGlnbm9yZU1ldGhvZHM6IFsnZW1pdCddXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBjID0gbmV3IEMoKTtcbiAgICAgICAgICAgIHR5cGVvZiBjLmVtaXRcbiAgICAgICAgICAgID5cInVuZGVmaW5lZFwiXG4gICAgICovXG4gICAgaWdub3JlTWV0aG9kczogdW5kZWZpbmVkLFxuXG4gICAgZ2V0T2JqZWN0V2l0aE1ldGhvZHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbWV0aG9kc09iaiA9IHRoaXMuQ29uc3RydWN0b3IgJiYgdGhpcy5Db25zdHJ1Y3Rvci5wcm90b3R5cGU7XG4gICAgICAgIGlmICh0aGlzLmlnbm9yZU1ldGhvZHMpIHtcbiAgICAgICAgICAgIG1ldGhvZHNPYmogPSBhcHBseSh7fSwgbWV0aG9kc09iaik7XG4gICAgICAgICAgICBhcnJheS5lYWNoKHRoaXMuaWdub3JlTWV0aG9kcywgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgbWV0aG9kc09ialt2YWx1ZV07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtZXRob2RzT2JqO1xuICAgIH0sXG5cbiAgICBnZXRNZXRob2RzVG9Db21wb3NlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1ldGhvZHMgPSB0aGlzLm1ldGhvZHMsXG4gICAgICAgICAgICBmaWx0ZXJGbjtcbiAgICAgICAgICAgIFxuICAgICAgICBpZiAoaXMuaXNBcnJheShtZXRob2RzKSkge1xuICAgICAgICAgICAgcmV0dXJuIG1ldGhvZHM7XG4gICAgICAgIH1cblxuICAgICAgICBmaWx0ZXJGbiA9IG1ldGhvZHM7XG5cbiAgICAgICAgaWYgKGlzLmlzU3RyaW5nKG1ldGhvZHMpKSB7XG4gICAgICAgICAgICBmaWx0ZXJGbiA9IHRoaXMuZmlsdGVyTWV0aG9kRm5zW21ldGhvZHNdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9Db25zdHJ1Y3RvcnMgYXJlIG5vdCBuZWVkZWQgaWYgY3JlYXRlIGlzIG92ZXJ3cml0dGVuXG4gICAgICAgIHJldHVybiBvRmlsdGVyKHRoaXMuZ2V0T2JqZWN0V2l0aE1ldGhvZHMoKSwgZmlsdGVyRm4sIHRoaXMsIHtcbiAgICAgICAgICAgIG93blByb3BlcnRpZXM6IGZhbHNlLFxuICAgICAgICAgICAga2V5czogdHJ1ZVxuICAgICAgICB9KTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbXBvc2l0aW9uOyIsIi8vIENvcHlyaWdodCAyMDA5LTIwMTIgYnkgY29udHJpYnV0b3JzLCBNSVQgTGljZW5zZVxuLy8gdmltOiB0cz00IHN0cz00IHN3PTQgZXhwYW5kdGFiXG5cbi8vIE1vZHVsZSBzeXN0ZW1zIG1hZ2ljIGRhbmNlXG4oZnVuY3Rpb24gKGRlZmluaXRpb24pIHtcbiAgICAvLyBSZXF1aXJlSlNcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgZGVmaW5lKGRlZmluaXRpb24pO1xuICAgIC8vIFlVSTNcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBZVUkgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIFlVSS5hZGQoXCJlczVcIiwgZGVmaW5pdGlvbik7XG4gICAgLy8gQ29tbW9uSlMgYW5kIDxzY3JpcHQ+XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZGVmaW5pdGlvbigpO1xuICAgIH1cbn0pKGZ1bmN0aW9uICgpIHtcblxuLyoqXG4gKiBCcmluZ3MgYW4gZW52aXJvbm1lbnQgYXMgY2xvc2UgdG8gRUNNQVNjcmlwdCA1IGNvbXBsaWFuY2VcbiAqIGFzIGlzIHBvc3NpYmxlIHdpdGggdGhlIGZhY2lsaXRpZXMgb2YgZXJzdHdoaWxlIGVuZ2luZXMuXG4gKlxuICogQW5ub3RhdGVkIEVTNTogaHR0cDovL2VzNS5naXRodWIuY29tLyAoc3BlY2lmaWMgbGlua3MgYmVsb3cpXG4gKiBFUzUgU3BlYzogaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL3B1YmxpY2F0aW9ucy9maWxlcy9FQ01BLVNUL0VjbWEtMjYyLnBkZlxuICogUmVxdWlyZWQgcmVhZGluZzogaHR0cDovL2phdmFzY3JpcHR3ZWJsb2cud29yZHByZXNzLmNvbS8yMDExLzEyLzA1L2V4dGVuZGluZy1qYXZhc2NyaXB0LW5hdGl2ZXMvXG4gKi9cblxuLy9cbi8vIEZ1bmN0aW9uXG4vLyA9PT09PT09PVxuLy9cblxuLy8gRVMtNSAxNS4zLjQuNVxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuMy40LjVcblxuZnVuY3Rpb24gRW1wdHkoKSB7fVxuXG5pZiAoIUZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kKSB7XG4gICAgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiBiaW5kKHRoYXQpIHsgLy8gLmxlbmd0aCBpcyAxXG4gICAgICAgIC8vIDEuIExldCBUYXJnZXQgYmUgdGhlIHRoaXMgdmFsdWUuXG4gICAgICAgIHZhciB0YXJnZXQgPSB0aGlzO1xuICAgICAgICAvLyAyLiBJZiBJc0NhbGxhYmxlKFRhcmdldCkgaXMgZmFsc2UsIHRocm93IGEgVHlwZUVycm9yIGV4Y2VwdGlvbi5cbiAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXQgIT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQgY2FsbGVkIG9uIGluY29tcGF0aWJsZSBcIiArIHRhcmdldCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gMy4gTGV0IEEgYmUgYSBuZXcgKHBvc3NpYmx5IGVtcHR5KSBpbnRlcm5hbCBsaXN0IG9mIGFsbCBvZiB0aGVcbiAgICAgICAgLy8gICBhcmd1bWVudCB2YWx1ZXMgcHJvdmlkZWQgYWZ0ZXIgdGhpc0FyZyAoYXJnMSwgYXJnMiBldGMpLCBpbiBvcmRlci5cbiAgICAgICAgLy8gWFhYIHNsaWNlZEFyZ3Mgd2lsbCBzdGFuZCBpbiBmb3IgXCJBXCIgaWYgdXNlZFxuICAgICAgICB2YXIgYXJncyA9IF9BcnJheV9zbGljZV8uY2FsbChhcmd1bWVudHMsIDEpOyAvLyBmb3Igbm9ybWFsIGNhbGxcbiAgICAgICAgLy8gNC4gTGV0IEYgYmUgYSBuZXcgbmF0aXZlIEVDTUFTY3JpcHQgb2JqZWN0LlxuICAgICAgICAvLyAxMS4gU2V0IHRoZSBbW1Byb3RvdHlwZV1dIGludGVybmFsIHByb3BlcnR5IG9mIEYgdG8gdGhlIHN0YW5kYXJkXG4gICAgICAgIC8vICAgYnVpbHQtaW4gRnVuY3Rpb24gcHJvdG90eXBlIG9iamVjdCBhcyBzcGVjaWZpZWQgaW4gMTUuMy4zLjEuXG4gICAgICAgIC8vIDEyLiBTZXQgdGhlIFtbQ2FsbF1dIGludGVybmFsIHByb3BlcnR5IG9mIEYgYXMgZGVzY3JpYmVkIGluXG4gICAgICAgIC8vICAgMTUuMy40LjUuMS5cbiAgICAgICAgLy8gMTMuIFNldCB0aGUgW1tDb25zdHJ1Y3RdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBGIGFzIGRlc2NyaWJlZCBpblxuICAgICAgICAvLyAgIDE1LjMuNC41LjIuXG4gICAgICAgIC8vIDE0LiBTZXQgdGhlIFtbSGFzSW5zdGFuY2VdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBGIGFzIGRlc2NyaWJlZCBpblxuICAgICAgICAvLyAgIDE1LjMuNC41LjMuXG4gICAgICAgIHZhciBib3VuZCA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBib3VuZCkge1xuICAgICAgICAgICAgICAgIC8vIDE1LjMuNC41LjIgW1tDb25zdHJ1Y3RdXVxuICAgICAgICAgICAgICAgIC8vIFdoZW4gdGhlIFtbQ29uc3RydWN0XV0gaW50ZXJuYWwgbWV0aG9kIG9mIGEgZnVuY3Rpb24gb2JqZWN0LFxuICAgICAgICAgICAgICAgIC8vIEYgdGhhdCB3YXMgY3JlYXRlZCB1c2luZyB0aGUgYmluZCBmdW5jdGlvbiBpcyBjYWxsZWQgd2l0aCBhXG4gICAgICAgICAgICAgICAgLy8gbGlzdCBvZiBhcmd1bWVudHMgRXh0cmFBcmdzLCB0aGUgZm9sbG93aW5nIHN0ZXBzIGFyZSB0YWtlbjpcbiAgICAgICAgICAgICAgICAvLyAxLiBMZXQgdGFyZ2V0IGJlIHRoZSB2YWx1ZSBvZiBGJ3MgW1tUYXJnZXRGdW5jdGlvbl1dXG4gICAgICAgICAgICAgICAgLy8gICBpbnRlcm5hbCBwcm9wZXJ0eS5cbiAgICAgICAgICAgICAgICAvLyAyLiBJZiB0YXJnZXQgaGFzIG5vIFtbQ29uc3RydWN0XV0gaW50ZXJuYWwgbWV0aG9kLCBhXG4gICAgICAgICAgICAgICAgLy8gICBUeXBlRXJyb3IgZXhjZXB0aW9uIGlzIHRocm93bi5cbiAgICAgICAgICAgICAgICAvLyAzLiBMZXQgYm91bmRBcmdzIGJlIHRoZSB2YWx1ZSBvZiBGJ3MgW1tCb3VuZEFyZ3NdXSBpbnRlcm5hbFxuICAgICAgICAgICAgICAgIC8vICAgcHJvcGVydHkuXG4gICAgICAgICAgICAgICAgLy8gNC4gTGV0IGFyZ3MgYmUgYSBuZXcgbGlzdCBjb250YWluaW5nIHRoZSBzYW1lIHZhbHVlcyBhcyB0aGVcbiAgICAgICAgICAgICAgICAvLyAgIGxpc3QgYm91bmRBcmdzIGluIHRoZSBzYW1lIG9yZGVyIGZvbGxvd2VkIGJ5IHRoZSBzYW1lXG4gICAgICAgICAgICAgICAgLy8gICB2YWx1ZXMgYXMgdGhlIGxpc3QgRXh0cmFBcmdzIGluIHRoZSBzYW1lIG9yZGVyLlxuICAgICAgICAgICAgICAgIC8vIDUuIFJldHVybiB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbQ29uc3RydWN0XV0gaW50ZXJuYWxcbiAgICAgICAgICAgICAgICAvLyAgIG1ldGhvZCBvZiB0YXJnZXQgcHJvdmlkaW5nIGFyZ3MgYXMgdGhlIGFyZ3VtZW50cy5cblxuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSB0YXJnZXQuYXBwbHkoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgICAgICAgICAgIGFyZ3MuY29uY2F0KF9BcnJheV9zbGljZV8uY2FsbChhcmd1bWVudHMpKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgaWYgKE9iamVjdChyZXN1bHQpID09PSByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gMTUuMy40LjUuMSBbW0NhbGxdXVxuICAgICAgICAgICAgICAgIC8vIFdoZW4gdGhlIFtbQ2FsbF1dIGludGVybmFsIG1ldGhvZCBvZiBhIGZ1bmN0aW9uIG9iamVjdCwgRixcbiAgICAgICAgICAgICAgICAvLyB3aGljaCB3YXMgY3JlYXRlZCB1c2luZyB0aGUgYmluZCBmdW5jdGlvbiBpcyBjYWxsZWQgd2l0aCBhXG4gICAgICAgICAgICAgICAgLy8gdGhpcyB2YWx1ZSBhbmQgYSBsaXN0IG9mIGFyZ3VtZW50cyBFeHRyYUFyZ3MsIHRoZSBmb2xsb3dpbmdcbiAgICAgICAgICAgICAgICAvLyBzdGVwcyBhcmUgdGFrZW46XG4gICAgICAgICAgICAgICAgLy8gMS4gTGV0IGJvdW5kQXJncyBiZSB0aGUgdmFsdWUgb2YgRidzIFtbQm91bmRBcmdzXV0gaW50ZXJuYWxcbiAgICAgICAgICAgICAgICAvLyAgIHByb3BlcnR5LlxuICAgICAgICAgICAgICAgIC8vIDIuIExldCBib3VuZFRoaXMgYmUgdGhlIHZhbHVlIG9mIEYncyBbW0JvdW5kVGhpc11dIGludGVybmFsXG4gICAgICAgICAgICAgICAgLy8gICBwcm9wZXJ0eS5cbiAgICAgICAgICAgICAgICAvLyAzLiBMZXQgdGFyZ2V0IGJlIHRoZSB2YWx1ZSBvZiBGJ3MgW1tUYXJnZXRGdW5jdGlvbl1dIGludGVybmFsXG4gICAgICAgICAgICAgICAgLy8gICBwcm9wZXJ0eS5cbiAgICAgICAgICAgICAgICAvLyA0LiBMZXQgYXJncyBiZSBhIG5ldyBsaXN0IGNvbnRhaW5pbmcgdGhlIHNhbWUgdmFsdWVzIGFzIHRoZVxuICAgICAgICAgICAgICAgIC8vICAgbGlzdCBib3VuZEFyZ3MgaW4gdGhlIHNhbWUgb3JkZXIgZm9sbG93ZWQgYnkgdGhlIHNhbWVcbiAgICAgICAgICAgICAgICAvLyAgIHZhbHVlcyBhcyB0aGUgbGlzdCBFeHRyYUFyZ3MgaW4gdGhlIHNhbWUgb3JkZXIuXG4gICAgICAgICAgICAgICAgLy8gNS4gUmV0dXJuIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tDYWxsXV0gaW50ZXJuYWwgbWV0aG9kXG4gICAgICAgICAgICAgICAgLy8gICBvZiB0YXJnZXQgcHJvdmlkaW5nIGJvdW5kVGhpcyBhcyB0aGUgdGhpcyB2YWx1ZSBhbmRcbiAgICAgICAgICAgICAgICAvLyAgIHByb3ZpZGluZyBhcmdzIGFzIHRoZSBhcmd1bWVudHMuXG5cbiAgICAgICAgICAgICAgICAvLyBlcXVpdjogdGFyZ2V0LmNhbGwodGhpcywgLi4uYm91bmRBcmdzLCAuLi5hcmdzKVxuICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXQuYXBwbHkoXG4gICAgICAgICAgICAgICAgICAgIHRoYXQsXG4gICAgICAgICAgICAgICAgICAgIGFyZ3MuY29uY2F0KF9BcnJheV9zbGljZV8uY2FsbChhcmd1bWVudHMpKVxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9O1xuICAgICAgICBpZih0YXJnZXQucHJvdG90eXBlKSB7XG4gICAgICAgICAgICBFbXB0eS5wcm90b3R5cGUgPSB0YXJnZXQucHJvdG90eXBlO1xuICAgICAgICAgICAgYm91bmQucHJvdG90eXBlID0gbmV3IEVtcHR5KCk7XG4gICAgICAgICAgICAvLyBDbGVhbiB1cCBkYW5nbGluZyByZWZlcmVuY2VzLlxuICAgICAgICAgICAgRW1wdHkucHJvdG90eXBlID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICAvLyBYWFggYm91bmQubGVuZ3RoIGlzIG5ldmVyIHdyaXRhYmxlLCBzbyBkb24ndCBldmVuIHRyeVxuICAgICAgICAvL1xuICAgICAgICAvLyAxNS4gSWYgdGhlIFtbQ2xhc3NdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBUYXJnZXQgaXMgXCJGdW5jdGlvblwiLCB0aGVuXG4gICAgICAgIC8vICAgICBhLiBMZXQgTCBiZSB0aGUgbGVuZ3RoIHByb3BlcnR5IG9mIFRhcmdldCBtaW51cyB0aGUgbGVuZ3RoIG9mIEEuXG4gICAgICAgIC8vICAgICBiLiBTZXQgdGhlIGxlbmd0aCBvd24gcHJvcGVydHkgb2YgRiB0byBlaXRoZXIgMCBvciBMLCB3aGljaGV2ZXIgaXNcbiAgICAgICAgLy8gICAgICAgbGFyZ2VyLlxuICAgICAgICAvLyAxNi4gRWxzZSBzZXQgdGhlIGxlbmd0aCBvd24gcHJvcGVydHkgb2YgRiB0byAwLlxuICAgICAgICAvLyAxNy4gU2V0IHRoZSBhdHRyaWJ1dGVzIG9mIHRoZSBsZW5ndGggb3duIHByb3BlcnR5IG9mIEYgdG8gdGhlIHZhbHVlc1xuICAgICAgICAvLyAgIHNwZWNpZmllZCBpbiAxNS4zLjUuMS5cblxuICAgICAgICAvLyBUT0RPXG4gICAgICAgIC8vIDE4LiBTZXQgdGhlIFtbRXh0ZW5zaWJsZV1dIGludGVybmFsIHByb3BlcnR5IG9mIEYgdG8gdHJ1ZS5cblxuICAgICAgICAvLyBUT0RPXG4gICAgICAgIC8vIDE5LiBMZXQgdGhyb3dlciBiZSB0aGUgW1tUaHJvd1R5cGVFcnJvcl1dIGZ1bmN0aW9uIE9iamVjdCAoMTMuMi4zKS5cbiAgICAgICAgLy8gMjAuIENhbGwgdGhlIFtbRGVmaW5lT3duUHJvcGVydHldXSBpbnRlcm5hbCBtZXRob2Qgb2YgRiB3aXRoXG4gICAgICAgIC8vICAgYXJndW1lbnRzIFwiY2FsbGVyXCIsIFByb3BlcnR5RGVzY3JpcHRvciB7W1tHZXRdXTogdGhyb3dlciwgW1tTZXRdXTpcbiAgICAgICAgLy8gICB0aHJvd2VyLCBbW0VudW1lcmFibGVdXTogZmFsc2UsIFtbQ29uZmlndXJhYmxlXV06IGZhbHNlfSwgYW5kXG4gICAgICAgIC8vICAgZmFsc2UuXG4gICAgICAgIC8vIDIxLiBDYWxsIHRoZSBbW0RlZmluZU93blByb3BlcnR5XV0gaW50ZXJuYWwgbWV0aG9kIG9mIEYgd2l0aFxuICAgICAgICAvLyAgIGFyZ3VtZW50cyBcImFyZ3VtZW50c1wiLCBQcm9wZXJ0eURlc2NyaXB0b3Ige1tbR2V0XV06IHRocm93ZXIsXG4gICAgICAgIC8vICAgW1tTZXRdXTogdGhyb3dlciwgW1tFbnVtZXJhYmxlXV06IGZhbHNlLCBbW0NvbmZpZ3VyYWJsZV1dOiBmYWxzZX0sXG4gICAgICAgIC8vICAgYW5kIGZhbHNlLlxuXG4gICAgICAgIC8vIFRPRE9cbiAgICAgICAgLy8gTk9URSBGdW5jdGlvbiBvYmplY3RzIGNyZWF0ZWQgdXNpbmcgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQgZG8gbm90XG4gICAgICAgIC8vIGhhdmUgYSBwcm90b3R5cGUgcHJvcGVydHkgb3IgdGhlIFtbQ29kZV1dLCBbW0Zvcm1hbFBhcmFtZXRlcnNdXSwgYW5kXG4gICAgICAgIC8vIFtbU2NvcGVdXSBpbnRlcm5hbCBwcm9wZXJ0aWVzLlxuICAgICAgICAvLyBYWFggY2FuJ3QgZGVsZXRlIHByb3RvdHlwZSBpbiBwdXJlLWpzLlxuXG4gICAgICAgIC8vIDIyLiBSZXR1cm4gRi5cbiAgICAgICAgcmV0dXJuIGJvdW5kO1xuICAgIH07XG59XG5cbi8vIFNob3J0Y3V0IHRvIGFuIG9mdGVuIGFjY2Vzc2VkIHByb3BlcnRpZXMsIGluIG9yZGVyIHRvIGF2b2lkIG11bHRpcGxlXG4vLyBkZXJlZmVyZW5jZSB0aGF0IGNvc3RzIHVuaXZlcnNhbGx5LlxuLy8gX1BsZWFzZSBub3RlOiBTaG9ydGN1dHMgYXJlIGRlZmluZWQgYWZ0ZXIgYEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kYCBhcyB3ZVxuLy8gdXMgaXQgaW4gZGVmaW5pbmcgc2hvcnRjdXRzLlxudmFyIGNhbGwgPSBGdW5jdGlvbi5wcm90b3R5cGUuY2FsbDtcbnZhciBwcm90b3R5cGVPZkFycmF5ID0gQXJyYXkucHJvdG90eXBlO1xudmFyIHByb3RvdHlwZU9mT2JqZWN0ID0gT2JqZWN0LnByb3RvdHlwZTtcbnZhciBfQXJyYXlfc2xpY2VfID0gcHJvdG90eXBlT2ZBcnJheS5zbGljZTtcbi8vIEhhdmluZyBhIHRvU3RyaW5nIGxvY2FsIHZhcmlhYmxlIG5hbWUgYnJlYWtzIGluIE9wZXJhIHNvIHVzZSBfdG9TdHJpbmcuXG52YXIgX3RvU3RyaW5nID0gY2FsbC5iaW5kKHByb3RvdHlwZU9mT2JqZWN0LnRvU3RyaW5nKTtcbnZhciBvd25zID0gY2FsbC5iaW5kKHByb3RvdHlwZU9mT2JqZWN0Lmhhc093blByb3BlcnR5KTtcblxuLy8gSWYgSlMgZW5naW5lIHN1cHBvcnRzIGFjY2Vzc29ycyBjcmVhdGluZyBzaG9ydGN1dHMuXG52YXIgZGVmaW5lR2V0dGVyO1xudmFyIGRlZmluZVNldHRlcjtcbnZhciBsb29rdXBHZXR0ZXI7XG52YXIgbG9va3VwU2V0dGVyO1xudmFyIHN1cHBvcnRzQWNjZXNzb3JzO1xuaWYgKChzdXBwb3J0c0FjY2Vzc29ycyA9IG93bnMocHJvdG90eXBlT2ZPYmplY3QsIFwiX19kZWZpbmVHZXR0ZXJfX1wiKSkpIHtcbiAgICBkZWZpbmVHZXR0ZXIgPSBjYWxsLmJpbmQocHJvdG90eXBlT2ZPYmplY3QuX19kZWZpbmVHZXR0ZXJfXyk7XG4gICAgZGVmaW5lU2V0dGVyID0gY2FsbC5iaW5kKHByb3RvdHlwZU9mT2JqZWN0Ll9fZGVmaW5lU2V0dGVyX18pO1xuICAgIGxvb2t1cEdldHRlciA9IGNhbGwuYmluZChwcm90b3R5cGVPZk9iamVjdC5fX2xvb2t1cEdldHRlcl9fKTtcbiAgICBsb29rdXBTZXR0ZXIgPSBjYWxsLmJpbmQocHJvdG90eXBlT2ZPYmplY3QuX19sb29rdXBTZXR0ZXJfXyk7XG59XG5cbi8vXG4vLyBBcnJheVxuLy8gPT09PT1cbi8vXG5cbi8vIEVTNSAxNS40LjQuMTJcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjQuNC4xMlxuLy8gRGVmYXVsdCB2YWx1ZSBmb3Igc2Vjb25kIHBhcmFtXG4vLyBbYnVnZml4LCBpZWx0OSwgb2xkIGJyb3dzZXJzXVxuLy8gSUUgPCA5IGJ1ZzogWzEsMl0uc3BsaWNlKDApLmpvaW4oXCJcIikgPT0gXCJcIiBidXQgc2hvdWxkIGJlIFwiMTJcIlxuaWYgKFsxLDJdLnNwbGljZSgwKS5sZW5ndGggIT0gMikge1xuICAgIHZhciBhcnJheV9zcGxpY2UgPSBBcnJheS5wcm90b3R5cGUuc3BsaWNlO1xuXG4gICAgaWYoZnVuY3Rpb24oKSB7IC8vIHRlc3QgSUUgPCA5IHRvIHNwbGljZSBidWcgLSBzZWUgaXNzdWUgIzEzOFxuICAgICAgICBmdW5jdGlvbiBtYWtlQXJyYXkobCkge1xuICAgICAgICAgICAgdmFyIGEgPSBbXTtcbiAgICAgICAgICAgIHdoaWxlIChsLS0pIHtcbiAgICAgICAgICAgICAgICBhLnVuc2hpZnQobClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBhXG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYXJyYXkgPSBbXVxuICAgICAgICAgICAgLCBsZW5ndGhCZWZvcmVcbiAgICAgICAgO1xuXG4gICAgICAgIGFycmF5LnNwbGljZS5iaW5kKGFycmF5LCAwLCAwKS5hcHBseShudWxsLCBtYWtlQXJyYXkoMjApKTtcbiAgICAgICAgYXJyYXkuc3BsaWNlLmJpbmQoYXJyYXksIDAsIDApLmFwcGx5KG51bGwsIG1ha2VBcnJheSgyNikpO1xuXG4gICAgICAgIGxlbmd0aEJlZm9yZSA9IGFycmF5Lmxlbmd0aDsgLy8yMFxuICAgICAgICBhcnJheS5zcGxpY2UoNSwgMCwgXCJYWFhcIik7IC8vIGFkZCBvbmUgZWxlbWVudFxuXG4gICAgICAgIGlmKGxlbmd0aEJlZm9yZSArIDEgPT0gYXJyYXkubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTsvLyBoYXMgcmlnaHQgc3BsaWNlIGltcGxlbWVudGF0aW9uIHdpdGhvdXQgYnVnc1xuICAgICAgICB9XG4gICAgICAgIC8vIGVsc2Uge1xuICAgICAgICAvLyAgICBJRTggYnVnXG4gICAgICAgIC8vIH1cbiAgICB9KCkpIHsvL0lFIDYvN1xuICAgICAgICBBcnJheS5wcm90b3R5cGUuc3BsaWNlID0gZnVuY3Rpb24oc3RhcnQsIGRlbGV0ZUNvdW50KSB7XG4gICAgICAgICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBhcnJheV9zcGxpY2UuYXBwbHkodGhpcywgW1xuICAgICAgICAgICAgICAgICAgICBzdGFydCA9PT0gdm9pZCAwID8gMCA6IHN0YXJ0LFxuICAgICAgICAgICAgICAgICAgICBkZWxldGVDb3VudCA9PT0gdm9pZCAwID8gKHRoaXMubGVuZ3RoIC0gc3RhcnQpIDogZGVsZXRlQ291bnRcbiAgICAgICAgICAgICAgICBdLmNvbmNhdChfQXJyYXlfc2xpY2VfLmNhbGwoYXJndW1lbnRzLCAyKSkpXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuICAgIGVsc2Ugey8vSUU4XG4gICAgICAgIEFycmF5LnByb3RvdHlwZS5zcGxpY2UgPSBmdW5jdGlvbihzdGFydCwgZGVsZXRlQ291bnQpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHRcbiAgICAgICAgICAgICAgICAsIGFyZ3MgPSBfQXJyYXlfc2xpY2VfLmNhbGwoYXJndW1lbnRzLCAyKVxuICAgICAgICAgICAgICAgICwgYWRkRWxlbWVudHNDb3VudCA9IGFyZ3MubGVuZ3RoXG4gICAgICAgICAgICA7XG5cbiAgICAgICAgICAgIGlmKCFhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihzdGFydCA9PT0gdm9pZCAwKSB7IC8vIGRlZmF1bHRcbiAgICAgICAgICAgICAgICBzdGFydCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihkZWxldGVDb3VudCA9PT0gdm9pZCAwKSB7IC8vIGRlZmF1bHRcbiAgICAgICAgICAgICAgICBkZWxldGVDb3VudCA9IHRoaXMubGVuZ3RoIC0gc3RhcnQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGFkZEVsZW1lbnRzQ291bnQgPiAwKSB7XG4gICAgICAgICAgICAgICAgaWYoZGVsZXRlQ291bnQgPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICBpZihzdGFydCA9PSB0aGlzLmxlbmd0aCkgeyAvLyB0aW55IG9wdGltaXNhdGlvbiAjMVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXNoLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoc3RhcnQgPT0gMCkgeyAvLyB0aW55IG9wdGltaXNhdGlvbiAjMlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51bnNoaWZ0LmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gQXJyYXkucHJvdG90eXBlLnNwbGljZSBpbXBsZW1lbnRhdGlvblxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IF9BcnJheV9zbGljZV8uY2FsbCh0aGlzLCBzdGFydCwgc3RhcnQgKyBkZWxldGVDb3VudCk7Ly8gZGVsZXRlIHBhcnRcbiAgICAgICAgICAgICAgICBhcmdzLnB1c2guYXBwbHkoYXJncywgX0FycmF5X3NsaWNlXy5jYWxsKHRoaXMsIHN0YXJ0ICsgZGVsZXRlQ291bnQsIHRoaXMubGVuZ3RoKSk7Ly8gcmlnaHQgcGFydFxuICAgICAgICAgICAgICAgIGFyZ3MudW5zaGlmdC5hcHBseShhcmdzLCBfQXJyYXlfc2xpY2VfLmNhbGwodGhpcywgMCwgc3RhcnQpKTsvLyBsZWZ0IHBhcnRcblxuICAgICAgICAgICAgICAgIC8vIGRlbGV0ZSBhbGwgaXRlbXMgZnJvbSB0aGlzIGFycmF5IGFuZCByZXBsYWNlIGl0IHRvICdsZWZ0IHBhcnQnICsgX0FycmF5X3NsaWNlXy5jYWxsKGFyZ3VtZW50cywgMikgKyAncmlnaHQgcGFydCdcbiAgICAgICAgICAgICAgICBhcmdzLnVuc2hpZnQoMCwgdGhpcy5sZW5ndGgpO1xuXG4gICAgICAgICAgICAgICAgYXJyYXlfc3BsaWNlLmFwcGx5KHRoaXMsIGFyZ3MpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGFycmF5X3NwbGljZS5jYWxsKHRoaXMsIHN0YXJ0LCBkZWxldGVDb3VudCk7XG4gICAgICAgIH1cblxuICAgIH1cbn1cblxuLy8gRVM1IDE1LjQuNC4xMlxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNC40LjEzXG4vLyBSZXR1cm4gbGVuK2FyZ0NvdW50LlxuLy8gW2J1Z2ZpeCwgaWVsdDhdXG4vLyBJRSA8IDggYnVnOiBbXS51bnNoaWZ0KDApID09IHVuZGVmaW5lZCBidXQgc2hvdWxkIGJlIFwiMVwiXG5pZiAoW10udW5zaGlmdCgwKSAhPSAxKSB7XG4gICAgdmFyIGFycmF5X3Vuc2hpZnQgPSBBcnJheS5wcm90b3R5cGUudW5zaGlmdDtcbiAgICBBcnJheS5wcm90b3R5cGUudW5zaGlmdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBhcnJheV91bnNoaWZ0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIHJldHVybiB0aGlzLmxlbmd0aDtcbiAgICB9O1xufVxuXG4vLyBFUzUgMTUuNC4zLjJcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjQuMy4yXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9pc0FycmF5XG5pZiAoIUFycmF5LmlzQXJyYXkpIHtcbiAgICBBcnJheS5pc0FycmF5ID0gZnVuY3Rpb24gaXNBcnJheShvYmopIHtcbiAgICAgICAgcmV0dXJuIF90b1N0cmluZyhvYmopID09IFwiW29iamVjdCBBcnJheV1cIjtcbiAgICB9O1xufVxuXG4vLyBUaGUgSXNDYWxsYWJsZSgpIGNoZWNrIGluIHRoZSBBcnJheSBmdW5jdGlvbnNcbi8vIGhhcyBiZWVuIHJlcGxhY2VkIHdpdGggYSBzdHJpY3QgY2hlY2sgb24gdGhlXG4vLyBpbnRlcm5hbCBjbGFzcyBvZiB0aGUgb2JqZWN0IHRvIHRyYXAgY2FzZXMgd2hlcmVcbi8vIHRoZSBwcm92aWRlZCBmdW5jdGlvbiB3YXMgYWN0dWFsbHkgYSByZWd1bGFyXG4vLyBleHByZXNzaW9uIGxpdGVyYWwsIHdoaWNoIGluIFY4IGFuZFxuLy8gSmF2YVNjcmlwdENvcmUgaXMgYSB0eXBlb2YgXCJmdW5jdGlvblwiLiAgT25seSBpblxuLy8gVjggYXJlIHJlZ3VsYXIgZXhwcmVzc2lvbiBsaXRlcmFscyBwZXJtaXR0ZWQgYXNcbi8vIHJlZHVjZSBwYXJhbWV0ZXJzLCBzbyBpdCBpcyBkZXNpcmFibGUgaW4gdGhlXG4vLyBnZW5lcmFsIGNhc2UgZm9yIHRoZSBzaGltIHRvIG1hdGNoIHRoZSBtb3JlXG4vLyBzdHJpY3QgYW5kIGNvbW1vbiBiZWhhdmlvciBvZiByZWplY3RpbmcgcmVndWxhclxuLy8gZXhwcmVzc2lvbnMuXG5cbi8vIEVTNSAxNS40LjQuMThcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjQuNC4xOFxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvYXJyYXkvZm9yRWFjaFxuXG4vLyBDaGVjayBmYWlsdXJlIG9mIGJ5LWluZGV4IGFjY2VzcyBvZiBzdHJpbmcgY2hhcmFjdGVycyAoSUUgPCA5KVxuLy8gYW5kIGZhaWx1cmUgb2YgYDAgaW4gYm94ZWRTdHJpbmdgIChSaGlubylcbnZhciBib3hlZFN0cmluZyA9IE9iamVjdChcImFcIiksXG4gICAgc3BsaXRTdHJpbmcgPSBib3hlZFN0cmluZ1swXSAhPSBcImFcIiB8fCAhKDAgaW4gYm94ZWRTdHJpbmcpO1xuXG5pZiAoIUFycmF5LnByb3RvdHlwZS5mb3JFYWNoKSB7XG4gICAgQXJyYXkucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiBmb3JFYWNoKGZ1biAvKiwgdGhpc3AqLykge1xuICAgICAgICB2YXIgb2JqZWN0ID0gdG9PYmplY3QodGhpcyksXG4gICAgICAgICAgICBzZWxmID0gc3BsaXRTdHJpbmcgJiYgX3RvU3RyaW5nKHRoaXMpID09IFwiW29iamVjdCBTdHJpbmddXCIgP1xuICAgICAgICAgICAgICAgIHRoaXMuc3BsaXQoXCJcIikgOlxuICAgICAgICAgICAgICAgIG9iamVjdCxcbiAgICAgICAgICAgIHRoaXNwID0gYXJndW1lbnRzWzFdLFxuICAgICAgICAgICAgaSA9IC0xLFxuICAgICAgICAgICAgbGVuZ3RoID0gc2VsZi5sZW5ndGggPj4+IDA7XG5cbiAgICAgICAgLy8gSWYgbm8gY2FsbGJhY2sgZnVuY3Rpb24gb3IgaWYgY2FsbGJhY2sgaXMgbm90IGEgY2FsbGFibGUgZnVuY3Rpb25cbiAgICAgICAgaWYgKF90b1N0cmluZyhmdW4pICE9IFwiW29iamVjdCBGdW5jdGlvbl1cIikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpOyAvLyBUT0RPIG1lc3NhZ2VcbiAgICAgICAgfVxuXG4gICAgICAgIHdoaWxlICgrK2kgPCBsZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChpIGluIHNlbGYpIHtcbiAgICAgICAgICAgICAgICAvLyBJbnZva2UgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHdpdGggY2FsbCwgcGFzc2luZyBhcmd1bWVudHM6XG4gICAgICAgICAgICAgICAgLy8gY29udGV4dCwgcHJvcGVydHkgdmFsdWUsIHByb3BlcnR5IGtleSwgdGhpc0FyZyBvYmplY3RcbiAgICAgICAgICAgICAgICAvLyBjb250ZXh0XG4gICAgICAgICAgICAgICAgZnVuLmNhbGwodGhpc3AsIHNlbGZbaV0sIGksIG9iamVjdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG4vLyBFUzUgMTUuNC40LjE5XG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS40LjQuMTlcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0NvcmVfSmF2YVNjcmlwdF8xLjVfUmVmZXJlbmNlL09iamVjdHMvQXJyYXkvbWFwXG5pZiAoIUFycmF5LnByb3RvdHlwZS5tYXApIHtcbiAgICBBcnJheS5wcm90b3R5cGUubWFwID0gZnVuY3Rpb24gbWFwKGZ1biAvKiwgdGhpc3AqLykge1xuICAgICAgICB2YXIgb2JqZWN0ID0gdG9PYmplY3QodGhpcyksXG4gICAgICAgICAgICBzZWxmID0gc3BsaXRTdHJpbmcgJiYgX3RvU3RyaW5nKHRoaXMpID09IFwiW29iamVjdCBTdHJpbmddXCIgP1xuICAgICAgICAgICAgICAgIHRoaXMuc3BsaXQoXCJcIikgOlxuICAgICAgICAgICAgICAgIG9iamVjdCxcbiAgICAgICAgICAgIGxlbmd0aCA9IHNlbGYubGVuZ3RoID4+PiAwLFxuICAgICAgICAgICAgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKSxcbiAgICAgICAgICAgIHRoaXNwID0gYXJndW1lbnRzWzFdO1xuXG4gICAgICAgIC8vIElmIG5vIGNhbGxiYWNrIGZ1bmN0aW9uIG9yIGlmIGNhbGxiYWNrIGlzIG5vdCBhIGNhbGxhYmxlIGZ1bmN0aW9uXG4gICAgICAgIGlmIChfdG9TdHJpbmcoZnVuKSAhPSBcIltvYmplY3QgRnVuY3Rpb25dXCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoZnVuICsgXCIgaXMgbm90IGEgZnVuY3Rpb25cIik7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoaSBpbiBzZWxmKVxuICAgICAgICAgICAgICAgIHJlc3VsdFtpXSA9IGZ1bi5jYWxsKHRoaXNwLCBzZWxmW2ldLCBpLCBvYmplY3QpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbn1cblxuLy8gRVM1IDE1LjQuNC4yMFxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNC40LjIwXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9Db3JlX0phdmFTY3JpcHRfMS41X1JlZmVyZW5jZS9PYmplY3RzL0FycmF5L2ZpbHRlclxuaWYgKCFBcnJheS5wcm90b3R5cGUuZmlsdGVyKSB7XG4gICAgQXJyYXkucHJvdG90eXBlLmZpbHRlciA9IGZ1bmN0aW9uIGZpbHRlcihmdW4gLyosIHRoaXNwICovKSB7XG4gICAgICAgIHZhciBvYmplY3QgPSB0b09iamVjdCh0aGlzKSxcbiAgICAgICAgICAgIHNlbGYgPSBzcGxpdFN0cmluZyAmJiBfdG9TdHJpbmcodGhpcykgPT0gXCJbb2JqZWN0IFN0cmluZ11cIiA/XG4gICAgICAgICAgICAgICAgdGhpcy5zcGxpdChcIlwiKSA6XG4gICAgICAgICAgICAgICAgICAgIG9iamVjdCxcbiAgICAgICAgICAgIGxlbmd0aCA9IHNlbGYubGVuZ3RoID4+PiAwLFxuICAgICAgICAgICAgcmVzdWx0ID0gW10sXG4gICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgIHRoaXNwID0gYXJndW1lbnRzWzFdO1xuXG4gICAgICAgIC8vIElmIG5vIGNhbGxiYWNrIGZ1bmN0aW9uIG9yIGlmIGNhbGxiYWNrIGlzIG5vdCBhIGNhbGxhYmxlIGZ1bmN0aW9uXG4gICAgICAgIGlmIChfdG9TdHJpbmcoZnVuKSAhPSBcIltvYmplY3QgRnVuY3Rpb25dXCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoZnVuICsgXCIgaXMgbm90IGEgZnVuY3Rpb25cIik7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoaSBpbiBzZWxmKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBzZWxmW2ldO1xuICAgICAgICAgICAgICAgIGlmIChmdW4uY2FsbCh0aGlzcCwgdmFsdWUsIGksIG9iamVjdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG59XG5cbi8vIEVTNSAxNS40LjQuMTZcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjQuNC4xNlxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvZXZlcnlcbmlmICghQXJyYXkucHJvdG90eXBlLmV2ZXJ5KSB7XG4gICAgQXJyYXkucHJvdG90eXBlLmV2ZXJ5ID0gZnVuY3Rpb24gZXZlcnkoZnVuIC8qLCB0aGlzcCAqLykge1xuICAgICAgICB2YXIgb2JqZWN0ID0gdG9PYmplY3QodGhpcyksXG4gICAgICAgICAgICBzZWxmID0gc3BsaXRTdHJpbmcgJiYgX3RvU3RyaW5nKHRoaXMpID09IFwiW29iamVjdCBTdHJpbmddXCIgP1xuICAgICAgICAgICAgICAgIHRoaXMuc3BsaXQoXCJcIikgOlxuICAgICAgICAgICAgICAgIG9iamVjdCxcbiAgICAgICAgICAgIGxlbmd0aCA9IHNlbGYubGVuZ3RoID4+PiAwLFxuICAgICAgICAgICAgdGhpc3AgPSBhcmd1bWVudHNbMV07XG5cbiAgICAgICAgLy8gSWYgbm8gY2FsbGJhY2sgZnVuY3Rpb24gb3IgaWYgY2FsbGJhY2sgaXMgbm90IGEgY2FsbGFibGUgZnVuY3Rpb25cbiAgICAgICAgaWYgKF90b1N0cmluZyhmdW4pICE9IFwiW29iamVjdCBGdW5jdGlvbl1cIikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihmdW4gKyBcIiBpcyBub3QgYSBmdW5jdGlvblwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChpIGluIHNlbGYgJiYgIWZ1bi5jYWxsKHRoaXNwLCBzZWxmW2ldLCBpLCBvYmplY3QpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG59XG5cbi8vIEVTNSAxNS40LjQuMTdcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjQuNC4xN1xuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvc29tZVxuaWYgKCFBcnJheS5wcm90b3R5cGUuc29tZSkge1xuICAgIEFycmF5LnByb3RvdHlwZS5zb21lID0gZnVuY3Rpb24gc29tZShmdW4gLyosIHRoaXNwICovKSB7XG4gICAgICAgIHZhciBvYmplY3QgPSB0b09iamVjdCh0aGlzKSxcbiAgICAgICAgICAgIHNlbGYgPSBzcGxpdFN0cmluZyAmJiBfdG9TdHJpbmcodGhpcykgPT0gXCJbb2JqZWN0IFN0cmluZ11cIiA/XG4gICAgICAgICAgICAgICAgdGhpcy5zcGxpdChcIlwiKSA6XG4gICAgICAgICAgICAgICAgb2JqZWN0LFxuICAgICAgICAgICAgbGVuZ3RoID0gc2VsZi5sZW5ndGggPj4+IDAsXG4gICAgICAgICAgICB0aGlzcCA9IGFyZ3VtZW50c1sxXTtcblxuICAgICAgICAvLyBJZiBubyBjYWxsYmFjayBmdW5jdGlvbiBvciBpZiBjYWxsYmFjayBpcyBub3QgYSBjYWxsYWJsZSBmdW5jdGlvblxuICAgICAgICBpZiAoX3RvU3RyaW5nKGZ1bikgIT0gXCJbb2JqZWN0IEZ1bmN0aW9uXVwiKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGZ1biArIFwiIGlzIG5vdCBhIGZ1bmN0aW9uXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGkgaW4gc2VsZiAmJiBmdW4uY2FsbCh0aGlzcCwgc2VsZltpXSwgaSwgb2JqZWN0KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xufVxuXG4vLyBFUzUgMTUuNC40LjIxXG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS40LjQuMjFcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0NvcmVfSmF2YVNjcmlwdF8xLjVfUmVmZXJlbmNlL09iamVjdHMvQXJyYXkvcmVkdWNlXG5pZiAoIUFycmF5LnByb3RvdHlwZS5yZWR1Y2UpIHtcbiAgICBBcnJheS5wcm90b3R5cGUucmVkdWNlID0gZnVuY3Rpb24gcmVkdWNlKGZ1biAvKiwgaW5pdGlhbCovKSB7XG4gICAgICAgIHZhciBvYmplY3QgPSB0b09iamVjdCh0aGlzKSxcbiAgICAgICAgICAgIHNlbGYgPSBzcGxpdFN0cmluZyAmJiBfdG9TdHJpbmcodGhpcykgPT0gXCJbb2JqZWN0IFN0cmluZ11cIiA/XG4gICAgICAgICAgICAgICAgdGhpcy5zcGxpdChcIlwiKSA6XG4gICAgICAgICAgICAgICAgb2JqZWN0LFxuICAgICAgICAgICAgbGVuZ3RoID0gc2VsZi5sZW5ndGggPj4+IDA7XG5cbiAgICAgICAgLy8gSWYgbm8gY2FsbGJhY2sgZnVuY3Rpb24gb3IgaWYgY2FsbGJhY2sgaXMgbm90IGEgY2FsbGFibGUgZnVuY3Rpb25cbiAgICAgICAgaWYgKF90b1N0cmluZyhmdW4pICE9IFwiW29iamVjdCBGdW5jdGlvbl1cIikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihmdW4gKyBcIiBpcyBub3QgYSBmdW5jdGlvblwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG5vIHZhbHVlIHRvIHJldHVybiBpZiBubyBpbml0aWFsIHZhbHVlIGFuZCBhbiBlbXB0eSBhcnJheVxuICAgICAgICBpZiAoIWxlbmd0aCAmJiBhcmd1bWVudHMubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJyZWR1Y2Ugb2YgZW1wdHkgYXJyYXkgd2l0aCBubyBpbml0aWFsIHZhbHVlXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICB2YXIgcmVzdWx0O1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBhcmd1bWVudHNbMV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgaWYgKGkgaW4gc2VsZikge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBzZWxmW2krK107XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIGlmIGFycmF5IGNvbnRhaW5zIG5vIHZhbHVlcywgbm8gaW5pdGlhbCB2YWx1ZSB0byByZXR1cm5cbiAgICAgICAgICAgICAgICBpZiAoKytpID49IGxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwicmVkdWNlIG9mIGVtcHR5IGFycmF5IHdpdGggbm8gaW5pdGlhbCB2YWx1ZVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IHdoaWxlICh0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChpIGluIHNlbGYpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBmdW4uY2FsbCh2b2lkIDAsIHJlc3VsdCwgc2VsZltpXSwgaSwgb2JqZWN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbn1cblxuLy8gRVM1IDE1LjQuNC4yMlxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNC40LjIyXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9Db3JlX0phdmFTY3JpcHRfMS41X1JlZmVyZW5jZS9PYmplY3RzL0FycmF5L3JlZHVjZVJpZ2h0XG5pZiAoIUFycmF5LnByb3RvdHlwZS5yZWR1Y2VSaWdodCkge1xuICAgIEFycmF5LnByb3RvdHlwZS5yZWR1Y2VSaWdodCA9IGZ1bmN0aW9uIHJlZHVjZVJpZ2h0KGZ1biAvKiwgaW5pdGlhbCovKSB7XG4gICAgICAgIHZhciBvYmplY3QgPSB0b09iamVjdCh0aGlzKSxcbiAgICAgICAgICAgIHNlbGYgPSBzcGxpdFN0cmluZyAmJiBfdG9TdHJpbmcodGhpcykgPT0gXCJbb2JqZWN0IFN0cmluZ11cIiA/XG4gICAgICAgICAgICAgICAgdGhpcy5zcGxpdChcIlwiKSA6XG4gICAgICAgICAgICAgICAgb2JqZWN0LFxuICAgICAgICAgICAgbGVuZ3RoID0gc2VsZi5sZW5ndGggPj4+IDA7XG5cbiAgICAgICAgLy8gSWYgbm8gY2FsbGJhY2sgZnVuY3Rpb24gb3IgaWYgY2FsbGJhY2sgaXMgbm90IGEgY2FsbGFibGUgZnVuY3Rpb25cbiAgICAgICAgaWYgKF90b1N0cmluZyhmdW4pICE9IFwiW29iamVjdCBGdW5jdGlvbl1cIikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihmdW4gKyBcIiBpcyBub3QgYSBmdW5jdGlvblwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG5vIHZhbHVlIHRvIHJldHVybiBpZiBubyBpbml0aWFsIHZhbHVlLCBlbXB0eSBhcnJheVxuICAgICAgICBpZiAoIWxlbmd0aCAmJiBhcmd1bWVudHMubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJyZWR1Y2VSaWdodCBvZiBlbXB0eSBhcnJheSB3aXRoIG5vIGluaXRpYWwgdmFsdWVcIik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcmVzdWx0LCBpID0gbGVuZ3RoIC0gMTtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gMikge1xuICAgICAgICAgICAgcmVzdWx0ID0gYXJndW1lbnRzWzFdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgIGlmIChpIGluIHNlbGYpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gc2VsZltpLS1dO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBpZiBhcnJheSBjb250YWlucyBubyB2YWx1ZXMsIG5vIGluaXRpYWwgdmFsdWUgdG8gcmV0dXJuXG4gICAgICAgICAgICAgICAgaWYgKC0taSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcInJlZHVjZVJpZ2h0IG9mIGVtcHR5IGFycmF5IHdpdGggbm8gaW5pdGlhbCB2YWx1ZVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IHdoaWxlICh0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpIDwgMCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGRvIHtcbiAgICAgICAgICAgIGlmIChpIGluIHRoaXMpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBmdW4uY2FsbCh2b2lkIDAsIHJlc3VsdCwgc2VsZltpXSwgaSwgb2JqZWN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSB3aGlsZSAoaS0tKTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG59XG5cbi8vIEVTNSAxNS40LjQuMTRcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjQuNC4xNFxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvaW5kZXhPZlxuaWYgKCFBcnJheS5wcm90b3R5cGUuaW5kZXhPZiB8fCAoWzAsIDFdLmluZGV4T2YoMSwgMikgIT0gLTEpKSB7XG4gICAgQXJyYXkucHJvdG90eXBlLmluZGV4T2YgPSBmdW5jdGlvbiBpbmRleE9mKHNvdWdodCAvKiwgZnJvbUluZGV4ICovICkge1xuICAgICAgICB2YXIgc2VsZiA9IHNwbGl0U3RyaW5nICYmIF90b1N0cmluZyh0aGlzKSA9PSBcIltvYmplY3QgU3RyaW5nXVwiID9cbiAgICAgICAgICAgICAgICB0aGlzLnNwbGl0KFwiXCIpIDpcbiAgICAgICAgICAgICAgICB0b09iamVjdCh0aGlzKSxcbiAgICAgICAgICAgIGxlbmd0aCA9IHNlbGYubGVuZ3RoID4+PiAwO1xuXG4gICAgICAgIGlmICghbGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaSA9IDA7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgaSA9IHRvSW50ZWdlcihhcmd1bWVudHNbMV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaGFuZGxlIG5lZ2F0aXZlIGluZGljZXNcbiAgICAgICAgaSA9IGkgPj0gMCA/IGkgOiBNYXRoLm1heCgwLCBsZW5ndGggKyBpKTtcbiAgICAgICAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGkgaW4gc2VsZiAmJiBzZWxmW2ldID09PSBzb3VnaHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfTtcbn1cblxuLy8gRVM1IDE1LjQuNC4xNVxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNC40LjE1XG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9sYXN0SW5kZXhPZlxuaWYgKCFBcnJheS5wcm90b3R5cGUubGFzdEluZGV4T2YgfHwgKFswLCAxXS5sYXN0SW5kZXhPZigwLCAtMykgIT0gLTEpKSB7XG4gICAgQXJyYXkucHJvdG90eXBlLmxhc3RJbmRleE9mID0gZnVuY3Rpb24gbGFzdEluZGV4T2Yoc291Z2h0IC8qLCBmcm9tSW5kZXggKi8pIHtcbiAgICAgICAgdmFyIHNlbGYgPSBzcGxpdFN0cmluZyAmJiBfdG9TdHJpbmcodGhpcykgPT0gXCJbb2JqZWN0IFN0cmluZ11cIiA/XG4gICAgICAgICAgICAgICAgdGhpcy5zcGxpdChcIlwiKSA6XG4gICAgICAgICAgICAgICAgdG9PYmplY3QodGhpcyksXG4gICAgICAgICAgICBsZW5ndGggPSBzZWxmLmxlbmd0aCA+Pj4gMDtcblxuICAgICAgICBpZiAoIWxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9XG4gICAgICAgIHZhciBpID0gbGVuZ3RoIC0gMTtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICBpID0gTWF0aC5taW4oaSwgdG9JbnRlZ2VyKGFyZ3VtZW50c1sxXSkpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGhhbmRsZSBuZWdhdGl2ZSBpbmRpY2VzXG4gICAgICAgIGkgPSBpID49IDAgPyBpIDogbGVuZ3RoIC0gTWF0aC5hYnMoaSk7XG4gICAgICAgIGZvciAoOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgaWYgKGkgaW4gc2VsZiAmJiBzb3VnaHQgPT09IHNlbGZbaV0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfTtcbn1cblxuLy9cbi8vIE9iamVjdFxuLy8gPT09PT09XG4vL1xuXG4vLyBFUzUgMTUuMi4zLjE0XG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS4yLjMuMTRcbmlmICghT2JqZWN0LmtleXMpIHtcbiAgICAvLyBodHRwOi8vd2hhdHRoZWhlYWRzYWlkLmNvbS8yMDEwLzEwL2Etc2FmZXItb2JqZWN0LWtleXMtY29tcGF0aWJpbGl0eS1pbXBsZW1lbnRhdGlvblxuICAgIHZhciBoYXNEb250RW51bUJ1ZyA9IHRydWUsXG4gICAgICAgIGRvbnRFbnVtcyA9IFtcbiAgICAgICAgICAgIFwidG9TdHJpbmdcIixcbiAgICAgICAgICAgIFwidG9Mb2NhbGVTdHJpbmdcIixcbiAgICAgICAgICAgIFwidmFsdWVPZlwiLFxuICAgICAgICAgICAgXCJoYXNPd25Qcm9wZXJ0eVwiLFxuICAgICAgICAgICAgXCJpc1Byb3RvdHlwZU9mXCIsXG4gICAgICAgICAgICBcInByb3BlcnR5SXNFbnVtZXJhYmxlXCIsXG4gICAgICAgICAgICBcImNvbnN0cnVjdG9yXCJcbiAgICAgICAgXSxcbiAgICAgICAgZG9udEVudW1zTGVuZ3RoID0gZG9udEVudW1zLmxlbmd0aDtcblxuICAgIGZvciAodmFyIGtleSBpbiB7XCJ0b1N0cmluZ1wiOiBudWxsfSkge1xuICAgICAgICBoYXNEb250RW51bUJ1ZyA9IGZhbHNlO1xuICAgIH1cblxuICAgIE9iamVjdC5rZXlzID0gZnVuY3Rpb24ga2V5cyhvYmplY3QpIHtcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICAodHlwZW9mIG9iamVjdCAhPSBcIm9iamVjdFwiICYmIHR5cGVvZiBvYmplY3QgIT0gXCJmdW5jdGlvblwiKSB8fFxuICAgICAgICAgICAgb2JqZWN0ID09PSBudWxsXG4gICAgICAgICkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk9iamVjdC5rZXlzIGNhbGxlZCBvbiBhIG5vbi1vYmplY3RcIik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIga2V5cyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBuYW1lIGluIG9iamVjdCkge1xuICAgICAgICAgICAgaWYgKG93bnMob2JqZWN0LCBuYW1lKSkge1xuICAgICAgICAgICAgICAgIGtleXMucHVzaChuYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoYXNEb250RW51bUJ1Zykge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlpID0gZG9udEVudW1zTGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBkb250RW51bSA9IGRvbnRFbnVtc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAob3ducyhvYmplY3QsIGRvbnRFbnVtKSkge1xuICAgICAgICAgICAgICAgICAgICBrZXlzLnB1c2goZG9udEVudW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ga2V5cztcbiAgICB9O1xuXG59XG5cbi8vXG4vLyBEYXRlXG4vLyA9PT09XG4vL1xuXG4vLyBFUzUgMTUuOS41LjQzXG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS45LjUuNDNcbi8vIFRoaXMgZnVuY3Rpb24gcmV0dXJucyBhIFN0cmluZyB2YWx1ZSByZXByZXNlbnQgdGhlIGluc3RhbmNlIGluIHRpbWVcbi8vIHJlcHJlc2VudGVkIGJ5IHRoaXMgRGF0ZSBvYmplY3QuIFRoZSBmb3JtYXQgb2YgdGhlIFN0cmluZyBpcyB0aGUgRGF0ZSBUaW1lXG4vLyBzdHJpbmcgZm9ybWF0IGRlZmluZWQgaW4gMTUuOS4xLjE1LiBBbGwgZmllbGRzIGFyZSBwcmVzZW50IGluIHRoZSBTdHJpbmcuXG4vLyBUaGUgdGltZSB6b25lIGlzIGFsd2F5cyBVVEMsIGRlbm90ZWQgYnkgdGhlIHN1ZmZpeCBaLiBJZiB0aGUgdGltZSB2YWx1ZSBvZlxuLy8gdGhpcyBvYmplY3QgaXMgbm90IGEgZmluaXRlIE51bWJlciBhIFJhbmdlRXJyb3IgZXhjZXB0aW9uIGlzIHRocm93bi5cbnZhciBuZWdhdGl2ZURhdGUgPSAtNjIxOTg3NTUyMDAwMDAsXG4gICAgbmVnYXRpdmVZZWFyU3RyaW5nID0gXCItMDAwMDAxXCI7XG5pZiAoXG4gICAgIURhdGUucHJvdG90eXBlLnRvSVNPU3RyaW5nIHx8XG4gICAgKG5ldyBEYXRlKG5lZ2F0aXZlRGF0ZSkudG9JU09TdHJpbmcoKS5pbmRleE9mKG5lZ2F0aXZlWWVhclN0cmluZykgPT09IC0xKVxuKSB7XG4gICAgRGF0ZS5wcm90b3R5cGUudG9JU09TdHJpbmcgPSBmdW5jdGlvbiB0b0lTT1N0cmluZygpIHtcbiAgICAgICAgdmFyIHJlc3VsdCwgbGVuZ3RoLCB2YWx1ZSwgeWVhciwgbW9udGg7XG4gICAgICAgIGlmICghaXNGaW5pdGUodGhpcykpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFwiRGF0ZS5wcm90b3R5cGUudG9JU09TdHJpbmcgY2FsbGVkIG9uIG5vbi1maW5pdGUgdmFsdWUuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgeWVhciA9IHRoaXMuZ2V0VVRDRnVsbFllYXIoKTtcblxuICAgICAgICBtb250aCA9IHRoaXMuZ2V0VVRDTW9udGgoKTtcbiAgICAgICAgLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9rcmlza293YWwvZXM1LXNoaW0vaXNzdWVzLzExMVxuICAgICAgICB5ZWFyICs9IE1hdGguZmxvb3IobW9udGggLyAxMik7XG4gICAgICAgIG1vbnRoID0gKG1vbnRoICUgMTIgKyAxMikgJSAxMjtcblxuICAgICAgICAvLyB0aGUgZGF0ZSB0aW1lIHN0cmluZyBmb3JtYXQgaXMgc3BlY2lmaWVkIGluIDE1LjkuMS4xNS5cbiAgICAgICAgcmVzdWx0ID0gW21vbnRoICsgMSwgdGhpcy5nZXRVVENEYXRlKCksXG4gICAgICAgICAgICB0aGlzLmdldFVUQ0hvdXJzKCksIHRoaXMuZ2V0VVRDTWludXRlcygpLCB0aGlzLmdldFVUQ1NlY29uZHMoKV07XG4gICAgICAgIHllYXIgPSAoXG4gICAgICAgICAgICAoeWVhciA8IDAgPyBcIi1cIiA6ICh5ZWFyID4gOTk5OSA/IFwiK1wiIDogXCJcIikpICtcbiAgICAgICAgICAgIChcIjAwMDAwXCIgKyBNYXRoLmFicyh5ZWFyKSlcbiAgICAgICAgICAgIC5zbGljZSgwIDw9IHllYXIgJiYgeWVhciA8PSA5OTk5ID8gLTQgOiAtNilcbiAgICAgICAgKTtcblxuICAgICAgICBsZW5ndGggPSByZXN1bHQubGVuZ3RoO1xuICAgICAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgICAgICAgIHZhbHVlID0gcmVzdWx0W2xlbmd0aF07XG4gICAgICAgICAgICAvLyBwYWQgbW9udGhzLCBkYXlzLCBob3VycywgbWludXRlcywgYW5kIHNlY29uZHMgdG8gaGF2ZSB0d29cbiAgICAgICAgICAgIC8vIGRpZ2l0cy5cbiAgICAgICAgICAgIGlmICh2YWx1ZSA8IDEwKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0W2xlbmd0aF0gPSBcIjBcIiArIHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIHBhZCBtaWxsaXNlY29uZHMgdG8gaGF2ZSB0aHJlZSBkaWdpdHMuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICB5ZWFyICsgXCItXCIgKyByZXN1bHQuc2xpY2UoMCwgMikuam9pbihcIi1cIikgK1xuICAgICAgICAgICAgXCJUXCIgKyByZXN1bHQuc2xpY2UoMikuam9pbihcIjpcIikgKyBcIi5cIiArXG4gICAgICAgICAgICAoXCIwMDBcIiArIHRoaXMuZ2V0VVRDTWlsbGlzZWNvbmRzKCkpLnNsaWNlKC0zKSArIFwiWlwiXG4gICAgICAgICk7XG4gICAgfTtcbn1cblxuXG4vLyBFUzUgMTUuOS41LjQ0XG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS45LjUuNDRcbi8vIFRoaXMgZnVuY3Rpb24gcHJvdmlkZXMgYSBTdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgYSBEYXRlIG9iamVjdCBmb3IgdXNlIGJ5XG4vLyBKU09OLnN0cmluZ2lmeSAoMTUuMTIuMykuXG52YXIgZGF0ZVRvSlNPTklzU3VwcG9ydGVkID0gZmFsc2U7XG50cnkge1xuICAgIGRhdGVUb0pTT05Jc1N1cHBvcnRlZCA9IChcbiAgICAgICAgRGF0ZS5wcm90b3R5cGUudG9KU09OICYmXG4gICAgICAgIG5ldyBEYXRlKE5hTikudG9KU09OKCkgPT09IG51bGwgJiZcbiAgICAgICAgbmV3IERhdGUobmVnYXRpdmVEYXRlKS50b0pTT04oKS5pbmRleE9mKG5lZ2F0aXZlWWVhclN0cmluZykgIT09IC0xICYmXG4gICAgICAgIERhdGUucHJvdG90eXBlLnRvSlNPTi5jYWxsKHsgLy8gZ2VuZXJpY1xuICAgICAgICAgICAgdG9JU09TdHJpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICApO1xufSBjYXRjaCAoZSkge1xufVxuaWYgKCFkYXRlVG9KU09OSXNTdXBwb3J0ZWQpIHtcbiAgICBEYXRlLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiB0b0pTT04oa2V5KSB7XG4gICAgICAgIC8vIFdoZW4gdGhlIHRvSlNPTiBtZXRob2QgaXMgY2FsbGVkIHdpdGggYXJndW1lbnQga2V5LCB0aGUgZm9sbG93aW5nXG4gICAgICAgIC8vIHN0ZXBzIGFyZSB0YWtlbjpcblxuICAgICAgICAvLyAxLiAgTGV0IE8gYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIFRvT2JqZWN0LCBnaXZpbmcgaXQgdGhlIHRoaXNcbiAgICAgICAgLy8gdmFsdWUgYXMgaXRzIGFyZ3VtZW50LlxuICAgICAgICAvLyAyLiBMZXQgdHYgYmUgdG9QcmltaXRpdmUoTywgaGludCBOdW1iZXIpLlxuICAgICAgICB2YXIgbyA9IE9iamVjdCh0aGlzKSxcbiAgICAgICAgICAgIHR2ID0gdG9QcmltaXRpdmUobyksXG4gICAgICAgICAgICB0b0lTTztcbiAgICAgICAgLy8gMy4gSWYgdHYgaXMgYSBOdW1iZXIgYW5kIGlzIG5vdCBmaW5pdGUsIHJldHVybiBudWxsLlxuICAgICAgICBpZiAodHlwZW9mIHR2ID09PSBcIm51bWJlclwiICYmICFpc0Zpbml0ZSh0dikpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIC8vIDQuIExldCB0b0lTTyBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbR2V0XV0gaW50ZXJuYWwgbWV0aG9kIG9mXG4gICAgICAgIC8vIE8gd2l0aCBhcmd1bWVudCBcInRvSVNPU3RyaW5nXCIuXG4gICAgICAgIHRvSVNPID0gby50b0lTT1N0cmluZztcbiAgICAgICAgLy8gNS4gSWYgSXNDYWxsYWJsZSh0b0lTTykgaXMgZmFsc2UsIHRocm93IGEgVHlwZUVycm9yIGV4Y2VwdGlvbi5cbiAgICAgICAgaWYgKHR5cGVvZiB0b0lTTyAhPSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJ0b0lTT1N0cmluZyBwcm9wZXJ0eSBpcyBub3QgY2FsbGFibGVcIik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gNi4gUmV0dXJuIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tDYWxsXV0gaW50ZXJuYWwgbWV0aG9kIG9mXG4gICAgICAgIC8vICB0b0lTTyB3aXRoIE8gYXMgdGhlIHRoaXMgdmFsdWUgYW5kIGFuIGVtcHR5IGFyZ3VtZW50IGxpc3QuXG4gICAgICAgIHJldHVybiB0b0lTTy5jYWxsKG8pO1xuXG4gICAgICAgIC8vIE5PVEUgMSBUaGUgYXJndW1lbnQgaXMgaWdub3JlZC5cblxuICAgICAgICAvLyBOT1RFIDIgVGhlIHRvSlNPTiBmdW5jdGlvbiBpcyBpbnRlbnRpb25hbGx5IGdlbmVyaWM7IGl0IGRvZXMgbm90XG4gICAgICAgIC8vIHJlcXVpcmUgdGhhdCBpdHMgdGhpcyB2YWx1ZSBiZSBhIERhdGUgb2JqZWN0LiBUaGVyZWZvcmUsIGl0IGNhbiBiZVxuICAgICAgICAvLyB0cmFuc2ZlcnJlZCB0byBvdGhlciBraW5kcyBvZiBvYmplY3RzIGZvciB1c2UgYXMgYSBtZXRob2QuIEhvd2V2ZXIsXG4gICAgICAgIC8vIGl0IGRvZXMgcmVxdWlyZSB0aGF0IGFueSBzdWNoIG9iamVjdCBoYXZlIGEgdG9JU09TdHJpbmcgbWV0aG9kLiBBblxuICAgICAgICAvLyBvYmplY3QgaXMgZnJlZSB0byB1c2UgdGhlIGFyZ3VtZW50IGtleSB0byBmaWx0ZXIgaXRzXG4gICAgICAgIC8vIHN0cmluZ2lmaWNhdGlvbi5cbiAgICB9O1xufVxuXG4vLyBFUzUgMTUuOS40LjJcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjkuNC4yXG4vLyBiYXNlZCBvbiB3b3JrIHNoYXJlZCBieSBEYW5pZWwgRnJpZXNlbiAoZGFudG1hbilcbi8vIGh0dHA6Ly9naXN0LmdpdGh1Yi5jb20vMzAzMjQ5XG5pZiAoIURhdGUucGFyc2UgfHwgXCJEYXRlLnBhcnNlIGlzIGJ1Z2d5XCIpIHtcbiAgICAvLyBYWFggZ2xvYmFsIGFzc2lnbm1lbnQgd29uJ3Qgd29yayBpbiBlbWJlZGRpbmdzIHRoYXQgdXNlXG4gICAgLy8gYW4gYWx0ZXJuYXRlIG9iamVjdCBmb3IgdGhlIGNvbnRleHQuXG4gICAgRGF0ZSA9IChmdW5jdGlvbihOYXRpdmVEYXRlKSB7XG5cbiAgICAgICAgLy8gRGF0ZS5sZW5ndGggPT09IDdcbiAgICAgICAgZnVuY3Rpb24gRGF0ZShZLCBNLCBELCBoLCBtLCBzLCBtcykge1xuICAgICAgICAgICAgdmFyIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIE5hdGl2ZURhdGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGF0ZSA9IGxlbmd0aCA9PSAxICYmIFN0cmluZyhZKSA9PT0gWSA/IC8vIGlzU3RyaW5nKFkpXG4gICAgICAgICAgICAgICAgICAgIC8vIFdlIGV4cGxpY2l0bHkgcGFzcyBpdCB0aHJvdWdoIHBhcnNlOlxuICAgICAgICAgICAgICAgICAgICBuZXcgTmF0aXZlRGF0ZShEYXRlLnBhcnNlKFkpKSA6XG4gICAgICAgICAgICAgICAgICAgIC8vIFdlIGhhdmUgdG8gbWFudWFsbHkgbWFrZSBjYWxscyBkZXBlbmRpbmcgb24gYXJndW1lbnRcbiAgICAgICAgICAgICAgICAgICAgLy8gbGVuZ3RoIGhlcmVcbiAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID49IDcgPyBuZXcgTmF0aXZlRGF0ZShZLCBNLCBELCBoLCBtLCBzLCBtcykgOlxuICAgICAgICAgICAgICAgICAgICBsZW5ndGggPj0gNiA/IG5ldyBOYXRpdmVEYXRlKFksIE0sIEQsIGgsIG0sIHMpIDpcbiAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID49IDUgPyBuZXcgTmF0aXZlRGF0ZShZLCBNLCBELCBoLCBtKSA6XG4gICAgICAgICAgICAgICAgICAgIGxlbmd0aCA+PSA0ID8gbmV3IE5hdGl2ZURhdGUoWSwgTSwgRCwgaCkgOlxuICAgICAgICAgICAgICAgICAgICBsZW5ndGggPj0gMyA/IG5ldyBOYXRpdmVEYXRlKFksIE0sIEQpIDpcbiAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID49IDIgPyBuZXcgTmF0aXZlRGF0ZShZLCBNKSA6XG4gICAgICAgICAgICAgICAgICAgIGxlbmd0aCA+PSAxID8gbmV3IE5hdGl2ZURhdGUoWSkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBOYXRpdmVEYXRlKCk7XG4gICAgICAgICAgICAgICAgLy8gUHJldmVudCBtaXh1cHMgd2l0aCB1bmZpeGVkIERhdGUgb2JqZWN0XG4gICAgICAgICAgICAgICAgZGF0ZS5jb25zdHJ1Y3RvciA9IERhdGU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gTmF0aXZlRGF0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIDE1LjkuMS4xNSBEYXRlIFRpbWUgU3RyaW5nIEZvcm1hdC5cbiAgICAgICAgdmFyIGlzb0RhdGVFeHByZXNzaW9uID0gbmV3IFJlZ0V4cChcIl5cIiArXG4gICAgICAgICAgICBcIihcXFxcZHs0fXxbXFwrXFwtXVxcXFxkezZ9KVwiICsgLy8gZm91ci1kaWdpdCB5ZWFyIGNhcHR1cmUgb3Igc2lnbiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDYtZGlnaXQgZXh0ZW5kZWQgeWVhclxuICAgICAgICAgICAgXCIoPzotKFxcXFxkezJ9KVwiICsgLy8gb3B0aW9uYWwgbW9udGggY2FwdHVyZVxuICAgICAgICAgICAgXCIoPzotKFxcXFxkezJ9KVwiICsgLy8gb3B0aW9uYWwgZGF5IGNhcHR1cmVcbiAgICAgICAgICAgIFwiKD86XCIgKyAvLyBjYXB0dXJlIGhvdXJzOm1pbnV0ZXM6c2Vjb25kcy5taWxsaXNlY29uZHNcbiAgICAgICAgICAgICAgICBcIlQoXFxcXGR7Mn0pXCIgKyAvLyBob3VycyBjYXB0dXJlXG4gICAgICAgICAgICAgICAgXCI6KFxcXFxkezJ9KVwiICsgLy8gbWludXRlcyBjYXB0dXJlXG4gICAgICAgICAgICAgICAgXCIoPzpcIiArIC8vIG9wdGlvbmFsIDpzZWNvbmRzLm1pbGxpc2Vjb25kc1xuICAgICAgICAgICAgICAgICAgICBcIjooXFxcXGR7Mn0pXCIgKyAvLyBzZWNvbmRzIGNhcHR1cmVcbiAgICAgICAgICAgICAgICAgICAgXCIoPzooXFxcXC5cXFxcZHsxLH0pKT9cIiArIC8vIG1pbGxpc2Vjb25kcyBjYXB0dXJlXG4gICAgICAgICAgICAgICAgXCIpP1wiICtcbiAgICAgICAgICAgIFwiKFwiICsgLy8gY2FwdHVyZSBVVEMgb2Zmc2V0IGNvbXBvbmVudFxuICAgICAgICAgICAgICAgIFwiWnxcIiArIC8vIFVUQyBjYXB0dXJlXG4gICAgICAgICAgICAgICAgXCIoPzpcIiArIC8vIG9mZnNldCBzcGVjaWZpZXIgKy8taG91cnM6bWludXRlc1xuICAgICAgICAgICAgICAgICAgICBcIihbLStdKVwiICsgLy8gc2lnbiBjYXB0dXJlXG4gICAgICAgICAgICAgICAgICAgIFwiKFxcXFxkezJ9KVwiICsgLy8gaG91cnMgb2Zmc2V0IGNhcHR1cmVcbiAgICAgICAgICAgICAgICAgICAgXCI6KFxcXFxkezJ9KVwiICsgLy8gbWludXRlcyBvZmZzZXQgY2FwdHVyZVxuICAgICAgICAgICAgICAgIFwiKVwiICtcbiAgICAgICAgICAgIFwiKT8pPyk/KT9cIiArXG4gICAgICAgIFwiJFwiKTtcblxuICAgICAgICB2YXIgbW9udGhzID0gW1xuICAgICAgICAgICAgMCwgMzEsIDU5LCA5MCwgMTIwLCAxNTEsIDE4MSwgMjEyLCAyNDMsIDI3MywgMzA0LCAzMzQsIDM2NVxuICAgICAgICBdO1xuXG4gICAgICAgIGZ1bmN0aW9uIGRheUZyb21Nb250aCh5ZWFyLCBtb250aCkge1xuICAgICAgICAgICAgdmFyIHQgPSBtb250aCA+IDEgPyAxIDogMDtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgbW9udGhzW21vbnRoXSArXG4gICAgICAgICAgICAgICAgTWF0aC5mbG9vcigoeWVhciAtIDE5NjkgKyB0KSAvIDQpIC1cbiAgICAgICAgICAgICAgICBNYXRoLmZsb29yKCh5ZWFyIC0gMTkwMSArIHQpIC8gMTAwKSArXG4gICAgICAgICAgICAgICAgTWF0aC5mbG9vcigoeWVhciAtIDE2MDEgKyB0KSAvIDQwMCkgK1xuICAgICAgICAgICAgICAgIDM2NSAqICh5ZWFyIC0gMTk3MClcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDb3B5IGFueSBjdXN0b20gbWV0aG9kcyBhIDNyZCBwYXJ0eSBsaWJyYXJ5IG1heSBoYXZlIGFkZGVkXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBOYXRpdmVEYXRlKSB7XG4gICAgICAgICAgICBEYXRlW2tleV0gPSBOYXRpdmVEYXRlW2tleV07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDb3B5IFwibmF0aXZlXCIgbWV0aG9kcyBleHBsaWNpdGx5OyB0aGV5IG1heSBiZSBub24tZW51bWVyYWJsZVxuICAgICAgICBEYXRlLm5vdyA9IE5hdGl2ZURhdGUubm93O1xuICAgICAgICBEYXRlLlVUQyA9IE5hdGl2ZURhdGUuVVRDO1xuICAgICAgICBEYXRlLnByb3RvdHlwZSA9IE5hdGl2ZURhdGUucHJvdG90eXBlO1xuICAgICAgICBEYXRlLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IERhdGU7XG5cbiAgICAgICAgLy8gVXBncmFkZSBEYXRlLnBhcnNlIHRvIGhhbmRsZSBzaW1wbGlmaWVkIElTTyA4NjAxIHN0cmluZ3NcbiAgICAgICAgRGF0ZS5wYXJzZSA9IGZ1bmN0aW9uIHBhcnNlKHN0cmluZykge1xuICAgICAgICAgICAgdmFyIG1hdGNoID0gaXNvRGF0ZUV4cHJlc3Npb24uZXhlYyhzdHJpbmcpO1xuICAgICAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgLy8gcGFyc2UgbW9udGhzLCBkYXlzLCBob3VycywgbWludXRlcywgc2Vjb25kcywgYW5kIG1pbGxpc2Vjb25kc1xuICAgICAgICAgICAgICAgIC8vIHByb3ZpZGUgZGVmYXVsdCB2YWx1ZXMgaWYgbmVjZXNzYXJ5XG4gICAgICAgICAgICAgICAgLy8gcGFyc2UgdGhlIFVUQyBvZmZzZXQgY29tcG9uZW50XG4gICAgICAgICAgICAgICAgdmFyIHllYXIgPSBOdW1iZXIobWF0Y2hbMV0pLFxuICAgICAgICAgICAgICAgICAgICBtb250aCA9IE51bWJlcihtYXRjaFsyXSB8fCAxKSAtIDEsXG4gICAgICAgICAgICAgICAgICAgIGRheSA9IE51bWJlcihtYXRjaFszXSB8fCAxKSAtIDEsXG4gICAgICAgICAgICAgICAgICAgIGhvdXIgPSBOdW1iZXIobWF0Y2hbNF0gfHwgMCksXG4gICAgICAgICAgICAgICAgICAgIG1pbnV0ZSA9IE51bWJlcihtYXRjaFs1XSB8fCAwKSxcbiAgICAgICAgICAgICAgICAgICAgc2Vjb25kID0gTnVtYmVyKG1hdGNoWzZdIHx8IDApLFxuICAgICAgICAgICAgICAgICAgICBtaWxsaXNlY29uZCA9IE1hdGguZmxvb3IoTnVtYmVyKG1hdGNoWzddIHx8IDApICogMTAwMCksXG4gICAgICAgICAgICAgICAgICAgIC8vIFdoZW4gdGltZSB6b25lIGlzIG1pc3NlZCwgbG9jYWwgb2Zmc2V0IHNob3VsZCBiZSB1c2VkXG4gICAgICAgICAgICAgICAgICAgIC8vIChFUyA1LjEgYnVnKVxuICAgICAgICAgICAgICAgICAgICAvLyBzZWUgaHR0cHM6Ly9idWdzLmVjbWFzY3JpcHQub3JnL3Nob3dfYnVnLmNnaT9pZD0xMTJcbiAgICAgICAgICAgICAgICAgICAgb2Zmc2V0ID0gIW1hdGNoWzRdIHx8IG1hdGNoWzhdID9cbiAgICAgICAgICAgICAgICAgICAgICAgIDAgOiBOdW1iZXIobmV3IE5hdGl2ZURhdGUoMTk3MCwgMCkpLFxuICAgICAgICAgICAgICAgICAgICBzaWduT2Zmc2V0ID0gbWF0Y2hbOV0gPT09IFwiLVwiID8gMSA6IC0xLFxuICAgICAgICAgICAgICAgICAgICBob3VyT2Zmc2V0ID0gTnVtYmVyKG1hdGNoWzEwXSB8fCAwKSxcbiAgICAgICAgICAgICAgICAgICAgbWludXRlT2Zmc2V0ID0gTnVtYmVyKG1hdGNoWzExXSB8fCAwKSxcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0O1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgaG91ciA8IChcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbnV0ZSA+IDAgfHwgc2Vjb25kID4gMCB8fCBtaWxsaXNlY29uZCA+IDAgP1xuICAgICAgICAgICAgICAgICAgICAgICAgMjQgOiAyNVxuICAgICAgICAgICAgICAgICAgICApICYmXG4gICAgICAgICAgICAgICAgICAgIG1pbnV0ZSA8IDYwICYmIHNlY29uZCA8IDYwICYmIG1pbGxpc2Vjb25kIDwgMTAwMCAmJlxuICAgICAgICAgICAgICAgICAgICBtb250aCA+IC0xICYmIG1vbnRoIDwgMTIgJiYgaG91ck9mZnNldCA8IDI0ICYmXG4gICAgICAgICAgICAgICAgICAgIG1pbnV0ZU9mZnNldCA8IDYwICYmIC8vIGRldGVjdCBpbnZhbGlkIG9mZnNldHNcbiAgICAgICAgICAgICAgICAgICAgZGF5ID4gLTEgJiZcbiAgICAgICAgICAgICAgICAgICAgZGF5IDwgKFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF5RnJvbU1vbnRoKHllYXIsIG1vbnRoICsgMSkgLVxuICAgICAgICAgICAgICAgICAgICAgICAgZGF5RnJvbU1vbnRoKHllYXIsIG1vbnRoKVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IChcbiAgICAgICAgICAgICAgICAgICAgICAgIChkYXlGcm9tTW9udGgoeWVhciwgbW9udGgpICsgZGF5KSAqIDI0ICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvdXIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgaG91ck9mZnNldCAqIHNpZ25PZmZzZXRcbiAgICAgICAgICAgICAgICAgICAgKSAqIDYwO1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSAoXG4gICAgICAgICAgICAgICAgICAgICAgICAocmVzdWx0ICsgbWludXRlICsgbWludXRlT2Zmc2V0ICogc2lnbk9mZnNldCkgKiA2MCArXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWNvbmRcbiAgICAgICAgICAgICAgICAgICAgKSAqIDEwMDAgKyBtaWxsaXNlY29uZCArIG9mZnNldDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKC04LjY0ZTE1IDw9IHJlc3VsdCAmJiByZXN1bHQgPD0gOC42NGUxNSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gTmFOO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIE5hdGl2ZURhdGUucGFyc2UuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gRGF0ZTtcbiAgICB9KShEYXRlKTtcbn1cblxuLy8gRVM1IDE1LjkuNC40XG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS45LjQuNFxuaWYgKCFEYXRlLm5vdykge1xuICAgIERhdGUubm93ID0gZnVuY3Rpb24gbm93KCkge1xuICAgICAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgfTtcbn1cblxuXG4vL1xuLy8gTnVtYmVyXG4vLyA9PT09PT1cbi8vXG5cbi8vIEVTNS4xIDE1LjcuNC41XG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS43LjQuNVxuaWYgKCFOdW1iZXIucHJvdG90eXBlLnRvRml4ZWQgfHwgKDAuMDAwMDgpLnRvRml4ZWQoMykgIT09ICcwLjAwMCcgfHwgKDAuOSkudG9GaXhlZCgwKSA9PT0gJzAnIHx8ICgxLjI1NSkudG9GaXhlZCgyKSAhPT0gJzEuMjUnIHx8ICgxMDAwMDAwMDAwMDAwMDAwMTI4KS50b0ZpeGVkKDApICE9PSBcIjEwMDAwMDAwMDAwMDAwMDAxMjhcIikge1xuICAgIC8vIEhpZGUgdGhlc2UgdmFyaWFibGVzIGFuZCBmdW5jdGlvbnNcbiAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYmFzZSwgc2l6ZSwgZGF0YSwgaTtcblxuICAgICAgICBiYXNlID0gMWU3O1xuICAgICAgICBzaXplID0gNjtcbiAgICAgICAgZGF0YSA9IFswLCAwLCAwLCAwLCAwLCAwXTtcblxuICAgICAgICBmdW5jdGlvbiBtdWx0aXBseShuLCBjKSB7XG4gICAgICAgICAgICB2YXIgaSA9IC0xO1xuICAgICAgICAgICAgd2hpbGUgKCsraSA8IHNpemUpIHtcbiAgICAgICAgICAgICAgICBjICs9IG4gKiBkYXRhW2ldO1xuICAgICAgICAgICAgICAgIGRhdGFbaV0gPSBjICUgYmFzZTtcbiAgICAgICAgICAgICAgICBjID0gTWF0aC5mbG9vcihjIC8gYmFzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBkaXZpZGUobikge1xuICAgICAgICAgICAgdmFyIGkgPSBzaXplLCBjID0gMDtcbiAgICAgICAgICAgIHdoaWxlICgtLWkgPj0gMCkge1xuICAgICAgICAgICAgICAgIGMgKz0gZGF0YVtpXTtcbiAgICAgICAgICAgICAgICBkYXRhW2ldID0gTWF0aC5mbG9vcihjIC8gbik7XG4gICAgICAgICAgICAgICAgYyA9IChjICUgbikgKiBiYXNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgICAgICAgICB2YXIgaSA9IHNpemU7XG4gICAgICAgICAgICB2YXIgcyA9ICcnO1xuICAgICAgICAgICAgd2hpbGUgKC0taSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKHMgIT09ICcnIHx8IGkgPT09IDAgfHwgZGF0YVtpXSAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdCA9IFN0cmluZyhkYXRhW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHMgPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzID0gdDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMgKz0gJzAwMDAwMDAnLnNsaWNlKDAsIDcgLSB0Lmxlbmd0aCkgKyB0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHM7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBwb3coeCwgbiwgYWNjKSB7XG4gICAgICAgICAgICByZXR1cm4gKG4gPT09IDAgPyBhY2MgOiAobiAlIDIgPT09IDEgPyBwb3coeCwgbiAtIDEsIGFjYyAqIHgpIDogcG93KHggKiB4LCBuIC8gMiwgYWNjKSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbG9nKHgpIHtcbiAgICAgICAgICAgIHZhciBuID0gMDtcbiAgICAgICAgICAgIHdoaWxlICh4ID49IDQwOTYpIHtcbiAgICAgICAgICAgICAgICBuICs9IDEyO1xuICAgICAgICAgICAgICAgIHggLz0gNDA5NjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdoaWxlICh4ID49IDIpIHtcbiAgICAgICAgICAgICAgICBuICs9IDE7XG4gICAgICAgICAgICAgICAgeCAvPSAyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG47XG4gICAgICAgIH1cblxuICAgICAgICBOdW1iZXIucHJvdG90eXBlLnRvRml4ZWQgPSBmdW5jdGlvbiAoZnJhY3Rpb25EaWdpdHMpIHtcbiAgICAgICAgICAgIHZhciBmLCB4LCBzLCBtLCBlLCB6LCBqLCBrO1xuXG4gICAgICAgICAgICAvLyBUZXN0IGZvciBOYU4gYW5kIHJvdW5kIGZyYWN0aW9uRGlnaXRzIGRvd25cbiAgICAgICAgICAgIGYgPSBOdW1iZXIoZnJhY3Rpb25EaWdpdHMpO1xuICAgICAgICAgICAgZiA9IGYgIT09IGYgPyAwIDogTWF0aC5mbG9vcihmKTtcblxuICAgICAgICAgICAgaWYgKGYgPCAwIHx8IGYgPiAyMCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFwiTnVtYmVyLnRvRml4ZWQgY2FsbGVkIHdpdGggaW52YWxpZCBudW1iZXIgb2YgZGVjaW1hbHNcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHggPSBOdW1iZXIodGhpcyk7XG5cbiAgICAgICAgICAgIC8vIFRlc3QgZm9yIE5hTlxuICAgICAgICAgICAgaWYgKHggIT09IHgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJOYU5cIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSWYgaXQgaXMgdG9vIGJpZyBvciBzbWFsbCwgcmV0dXJuIHRoZSBzdHJpbmcgdmFsdWUgb2YgdGhlIG51bWJlclxuICAgICAgICAgICAgaWYgKHggPD0gLTFlMjEgfHwgeCA+PSAxZTIxKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFN0cmluZyh4KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcyA9IFwiXCI7XG5cbiAgICAgICAgICAgIGlmICh4IDwgMCkge1xuICAgICAgICAgICAgICAgIHMgPSBcIi1cIjtcbiAgICAgICAgICAgICAgICB4ID0gLXg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG0gPSBcIjBcIjtcblxuICAgICAgICAgICAgaWYgKHggPiAxZS0yMSkge1xuICAgICAgICAgICAgICAgIC8vIDFlLTIxIDwgeCA8IDFlMjFcbiAgICAgICAgICAgICAgICAvLyAtNzAgPCBsb2cyKHgpIDwgNzBcbiAgICAgICAgICAgICAgICBlID0gbG9nKHggKiBwb3coMiwgNjksIDEpKSAtIDY5O1xuICAgICAgICAgICAgICAgIHogPSAoZSA8IDAgPyB4ICogcG93KDIsIC1lLCAxKSA6IHggLyBwb3coMiwgZSwgMSkpO1xuICAgICAgICAgICAgICAgIHogKj0gMHgxMDAwMDAwMDAwMDAwMDsgLy8gTWF0aC5wb3coMiwgNTIpO1xuICAgICAgICAgICAgICAgIGUgPSA1MiAtIGU7XG5cbiAgICAgICAgICAgICAgICAvLyAtMTggPCBlIDwgMTIyXG4gICAgICAgICAgICAgICAgLy8geCA9IHogLyAyIF4gZVxuICAgICAgICAgICAgICAgIGlmIChlID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBtdWx0aXBseSgwLCB6KTtcbiAgICAgICAgICAgICAgICAgICAgaiA9IGY7XG5cbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGogPj0gNykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbXVsdGlwbHkoMWU3LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGogLT0gNztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIG11bHRpcGx5KHBvdygxMCwgaiwgMSksIDApO1xuICAgICAgICAgICAgICAgICAgICBqID0gZSAtIDE7XG5cbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGogPj0gMjMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpdmlkZSgxIDw8IDIzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGogLT0gMjM7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBkaXZpZGUoMSA8PCBqKTtcbiAgICAgICAgICAgICAgICAgICAgbXVsdGlwbHkoMSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIGRpdmlkZSgyKTtcbiAgICAgICAgICAgICAgICAgICAgbSA9IHRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbXVsdGlwbHkoMCwgeik7XG4gICAgICAgICAgICAgICAgICAgIG11bHRpcGx5KDEgPDwgKC1lKSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIG0gPSB0b1N0cmluZygpICsgJzAuMDAwMDAwMDAwMDAwMDAwMDAwMDAnLnNsaWNlKDIsIDIgKyBmKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChmID4gMCkge1xuICAgICAgICAgICAgICAgIGsgPSBtLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgIGlmIChrIDw9IGYpIHtcbiAgICAgICAgICAgICAgICAgICAgbSA9IHMgKyAnMC4wMDAwMDAwMDAwMDAwMDAwMDAwJy5zbGljZSgwLCBmIC0gayArIDIpICsgbTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBtID0gcyArIG0uc2xpY2UoMCwgayAtIGYpICsgJy4nICsgbS5zbGljZShrIC0gZik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtID0gcyArIG07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBtO1xuICAgICAgICB9XG4gICAgfSgpKTtcbn1cblxuXG4vL1xuLy8gU3RyaW5nXG4vLyA9PT09PT1cbi8vXG5cblxuLy8gRVM1IDE1LjUuNC4xNFxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNS40LjE0XG5cbi8vIFtidWdmaXgsIElFIGx0IDksIGZpcmVmb3ggNCwgS29ucXVlcm9yLCBPcGVyYSwgb2JzY3VyZSBicm93c2Vyc11cbi8vIE1hbnkgYnJvd3NlcnMgZG8gbm90IHNwbGl0IHByb3Blcmx5IHdpdGggcmVndWxhciBleHByZXNzaW9ucyBvciB0aGV5XG4vLyBkbyBub3QgcGVyZm9ybSB0aGUgc3BsaXQgY29ycmVjdGx5IHVuZGVyIG9ic2N1cmUgY29uZGl0aW9ucy5cbi8vIFNlZSBodHRwOi8vYmxvZy5zdGV2ZW5sZXZpdGhhbi5jb20vYXJjaGl2ZXMvY3Jvc3MtYnJvd3Nlci1zcGxpdFxuLy8gSSd2ZSB0ZXN0ZWQgaW4gbWFueSBicm93c2VycyBhbmQgdGhpcyBzZWVtcyB0byBjb3ZlciB0aGUgZGV2aWFudCBvbmVzOlxuLy8gICAgJ2FiJy5zcGxpdCgvKD86YWIpKi8pIHNob3VsZCBiZSBbXCJcIiwgXCJcIl0sIG5vdCBbXCJcIl1cbi8vICAgICcuJy5zcGxpdCgvKC4/KSguPykvKSBzaG91bGQgYmUgW1wiXCIsIFwiLlwiLCBcIlwiLCBcIlwiXSwgbm90IFtcIlwiLCBcIlwiXVxuLy8gICAgJ3Rlc3N0Jy5zcGxpdCgvKHMpKi8pIHNob3VsZCBiZSBbXCJ0XCIsIHVuZGVmaW5lZCwgXCJlXCIsIFwic1wiLCBcInRcIl0sIG5vdFxuLy8gICAgICAgW3VuZGVmaW5lZCwgXCJ0XCIsIHVuZGVmaW5lZCwgXCJlXCIsIC4uLl1cbi8vICAgICcnLnNwbGl0KC8uPy8pIHNob3VsZCBiZSBbXSwgbm90IFtcIlwiXVxuLy8gICAgJy4nLnNwbGl0KC8oKSgpLykgc2hvdWxkIGJlIFtcIi5cIl0sIG5vdCBbXCJcIiwgXCJcIiwgXCIuXCJdXG5cbnZhciBzdHJpbmdfc3BsaXQgPSBTdHJpbmcucHJvdG90eXBlLnNwbGl0O1xuaWYgKFxuICAgICdhYicuc3BsaXQoLyg/OmFiKSovKS5sZW5ndGggIT09IDIgfHxcbiAgICAnLicuc3BsaXQoLyguPykoLj8pLykubGVuZ3RoICE9PSA0IHx8XG4gICAgJ3Rlc3N0Jy5zcGxpdCgvKHMpKi8pWzFdID09PSBcInRcIiB8fFxuICAgICcnLnNwbGl0KC8uPy8pLmxlbmd0aCA9PT0gMCB8fFxuICAgICcuJy5zcGxpdCgvKCkoKS8pLmxlbmd0aCA+IDFcbikge1xuICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjb21wbGlhbnRFeGVjTnBjZyA9IC8oKT8/Ly5leGVjKFwiXCIpWzFdID09PSB2b2lkIDA7IC8vIE5QQ0c6IG5vbnBhcnRpY2lwYXRpbmcgY2FwdHVyaW5nIGdyb3VwXG5cbiAgICAgICAgU3RyaW5nLnByb3RvdHlwZS5zcGxpdCA9IGZ1bmN0aW9uIChzZXBhcmF0b3IsIGxpbWl0KSB7XG4gICAgICAgICAgICB2YXIgc3RyaW5nID0gdGhpcztcbiAgICAgICAgICAgIGlmIChzZXBhcmF0b3IgPT09IHZvaWQgMCAmJiBsaW1pdCA9PT0gMClcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG5cbiAgICAgICAgICAgIC8vIElmIGBzZXBhcmF0b3JgIGlzIG5vdCBhIHJlZ2V4LCB1c2UgbmF0aXZlIHNwbGl0XG4gICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHNlcGFyYXRvcikgIT09IFwiW29iamVjdCBSZWdFeHBdXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RyaW5nX3NwbGl0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBvdXRwdXQgPSBbXSxcbiAgICAgICAgICAgICAgICBmbGFncyA9IChzZXBhcmF0b3IuaWdub3JlQ2FzZSA/IFwiaVwiIDogXCJcIikgK1xuICAgICAgICAgICAgICAgICAgICAgICAgKHNlcGFyYXRvci5tdWx0aWxpbmUgID8gXCJtXCIgOiBcIlwiKSArXG4gICAgICAgICAgICAgICAgICAgICAgICAoc2VwYXJhdG9yLmV4dGVuZGVkICAgPyBcInhcIiA6IFwiXCIpICsgLy8gUHJvcG9zZWQgZm9yIEVTNlxuICAgICAgICAgICAgICAgICAgICAgICAgKHNlcGFyYXRvci5zdGlja3kgICAgID8gXCJ5XCIgOiBcIlwiKSwgLy8gRmlyZWZveCAzK1xuICAgICAgICAgICAgICAgIGxhc3RMYXN0SW5kZXggPSAwLFxuICAgICAgICAgICAgICAgIC8vIE1ha2UgYGdsb2JhbGAgYW5kIGF2b2lkIGBsYXN0SW5kZXhgIGlzc3VlcyBieSB3b3JraW5nIHdpdGggYSBjb3B5XG4gICAgICAgICAgICAgICAgc2VwYXJhdG9yID0gbmV3IFJlZ0V4cChzZXBhcmF0b3Iuc291cmNlLCBmbGFncyArIFwiZ1wiKSxcbiAgICAgICAgICAgICAgICBzZXBhcmF0b3IyLCBtYXRjaCwgbGFzdEluZGV4LCBsYXN0TGVuZ3RoO1xuICAgICAgICAgICAgc3RyaW5nICs9IFwiXCI7IC8vIFR5cGUtY29udmVydFxuICAgICAgICAgICAgaWYgKCFjb21wbGlhbnRFeGVjTnBjZykge1xuICAgICAgICAgICAgICAgIC8vIERvZXNuJ3QgbmVlZCBmbGFncyBneSwgYnV0IHRoZXkgZG9uJ3QgaHVydFxuICAgICAgICAgICAgICAgIHNlcGFyYXRvcjIgPSBuZXcgUmVnRXhwKFwiXlwiICsgc2VwYXJhdG9yLnNvdXJjZSArIFwiJCg/IVxcXFxzKVwiLCBmbGFncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKiBWYWx1ZXMgZm9yIGBsaW1pdGAsIHBlciB0aGUgc3BlYzpcbiAgICAgICAgICAgICAqIElmIHVuZGVmaW5lZDogNDI5NDk2NzI5NSAvLyBNYXRoLnBvdygyLCAzMikgLSAxXG4gICAgICAgICAgICAgKiBJZiAwLCBJbmZpbml0eSwgb3IgTmFOOiAwXG4gICAgICAgICAgICAgKiBJZiBwb3NpdGl2ZSBudW1iZXI6IGxpbWl0ID0gTWF0aC5mbG9vcihsaW1pdCk7IGlmIChsaW1pdCA+IDQyOTQ5NjcyOTUpIGxpbWl0IC09IDQyOTQ5NjcyOTY7XG4gICAgICAgICAgICAgKiBJZiBuZWdhdGl2ZSBudW1iZXI6IDQyOTQ5NjcyOTYgLSBNYXRoLmZsb29yKE1hdGguYWJzKGxpbWl0KSlcbiAgICAgICAgICAgICAqIElmIG90aGVyOiBUeXBlLWNvbnZlcnQsIHRoZW4gdXNlIHRoZSBhYm92ZSBydWxlc1xuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBsaW1pdCA9IGxpbWl0ID09PSB2b2lkIDAgP1xuICAgICAgICAgICAgICAgIC0xID4+PiAwIDogLy8gTWF0aC5wb3coMiwgMzIpIC0gMVxuICAgICAgICAgICAgICAgIGxpbWl0ID4+PiAwOyAvLyBUb1VpbnQzMihsaW1pdClcbiAgICAgICAgICAgIHdoaWxlIChtYXRjaCA9IHNlcGFyYXRvci5leGVjKHN0cmluZykpIHtcbiAgICAgICAgICAgICAgICAvLyBgc2VwYXJhdG9yLmxhc3RJbmRleGAgaXMgbm90IHJlbGlhYmxlIGNyb3NzLWJyb3dzZXJcbiAgICAgICAgICAgICAgICBsYXN0SW5kZXggPSBtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBpZiAobGFzdEluZGV4ID4gbGFzdExhc3RJbmRleCkge1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChzdHJpbmcuc2xpY2UobGFzdExhc3RJbmRleCwgbWF0Y2guaW5kZXgpKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gRml4IGJyb3dzZXJzIHdob3NlIGBleGVjYCBtZXRob2RzIGRvbid0IGNvbnNpc3RlbnRseSByZXR1cm4gYHVuZGVmaW5lZGAgZm9yXG4gICAgICAgICAgICAgICAgICAgIC8vIG5vbnBhcnRpY2lwYXRpbmcgY2FwdHVyaW5nIGdyb3Vwc1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWNvbXBsaWFudEV4ZWNOcGNnICYmIG1hdGNoLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoWzBdLnJlcGxhY2Uoc2VwYXJhdG9yMiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aCAtIDI7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJndW1lbnRzW2ldID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoW2ldID0gdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGNoLmxlbmd0aCA+IDEgJiYgbWF0Y2guaW5kZXggPCBzdHJpbmcubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShvdXRwdXQsIG1hdGNoLnNsaWNlKDEpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsYXN0TGVuZ3RoID0gbWF0Y2hbMF0ubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICBsYXN0TGFzdEluZGV4ID0gbGFzdEluZGV4O1xuICAgICAgICAgICAgICAgICAgICBpZiAob3V0cHV0Lmxlbmd0aCA+PSBsaW1pdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHNlcGFyYXRvci5sYXN0SW5kZXggPT09IG1hdGNoLmluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIHNlcGFyYXRvci5sYXN0SW5kZXgrKzsgLy8gQXZvaWQgYW4gaW5maW5pdGUgbG9vcFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChsYXN0TGFzdEluZGV4ID09PSBzdHJpbmcubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxhc3RMZW5ndGggfHwgIXNlcGFyYXRvci50ZXN0KFwiXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKFwiXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goc3RyaW5nLnNsaWNlKGxhc3RMYXN0SW5kZXgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvdXRwdXQubGVuZ3RoID4gbGltaXQgPyBvdXRwdXQuc2xpY2UoMCwgbGltaXQpIDogb3V0cHV0O1xuICAgICAgICB9O1xuICAgIH0oKSk7XG5cbi8vIFtidWdmaXgsIGNocm9tZV1cbi8vIElmIHNlcGFyYXRvciBpcyB1bmRlZmluZWQsIHRoZW4gdGhlIHJlc3VsdCBhcnJheSBjb250YWlucyBqdXN0IG9uZSBTdHJpbmcsXG4vLyB3aGljaCBpcyB0aGUgdGhpcyB2YWx1ZSAoY29udmVydGVkIHRvIGEgU3RyaW5nKS4gSWYgbGltaXQgaXMgbm90IHVuZGVmaW5lZCxcbi8vIHRoZW4gdGhlIG91dHB1dCBhcnJheSBpcyB0cnVuY2F0ZWQgc28gdGhhdCBpdCBjb250YWlucyBubyBtb3JlIHRoYW4gbGltaXRcbi8vIGVsZW1lbnRzLlxuLy8gXCIwXCIuc3BsaXQodW5kZWZpbmVkLCAwKSAtPiBbXVxufSBlbHNlIGlmIChcIjBcIi5zcGxpdCh2b2lkIDAsIDApLmxlbmd0aCkge1xuICAgIFN0cmluZy5wcm90b3R5cGUuc3BsaXQgPSBmdW5jdGlvbihzZXBhcmF0b3IsIGxpbWl0KSB7XG4gICAgICAgIGlmIChzZXBhcmF0b3IgPT09IHZvaWQgMCAmJiBsaW1pdCA9PT0gMCkgcmV0dXJuIFtdO1xuICAgICAgICByZXR1cm4gc3RyaW5nX3NwbGl0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxufVxuXG5cbi8vIEVDTUEtMjYyLCAzcmQgQi4yLjNcbi8vIE5vdGUgYW4gRUNNQVNjcmlwdCBzdGFuZGFydCwgYWx0aG91Z2ggRUNNQVNjcmlwdCAzcmQgRWRpdGlvbiBoYXMgYVxuLy8gbm9uLW5vcm1hdGl2ZSBzZWN0aW9uIHN1Z2dlc3RpbmcgdW5pZm9ybSBzZW1hbnRpY3MgYW5kIGl0IHNob3VsZCBiZVxuLy8gbm9ybWFsaXplZCBhY3Jvc3MgYWxsIGJyb3dzZXJzXG4vLyBbYnVnZml4LCBJRSBsdCA5XSBJRSA8IDkgc3Vic3RyKCkgd2l0aCBuZWdhdGl2ZSB2YWx1ZSBub3Qgd29ya2luZyBpbiBJRVxuaWYoXCJcIi5zdWJzdHIgJiYgXCIwYlwiLnN1YnN0cigtMSkgIT09IFwiYlwiKSB7XG4gICAgdmFyIHN0cmluZ19zdWJzdHIgPSBTdHJpbmcucHJvdG90eXBlLnN1YnN0cjtcbiAgICAvKipcbiAgICAgKiAgR2V0IHRoZSBzdWJzdHJpbmcgb2YgYSBzdHJpbmdcbiAgICAgKiAgQHBhcmFtICB7aW50ZWdlcn0gIHN0YXJ0ICAgd2hlcmUgdG8gc3RhcnQgdGhlIHN1YnN0cmluZ1xuICAgICAqICBAcGFyYW0gIHtpbnRlZ2VyfSAgbGVuZ3RoICBob3cgbWFueSBjaGFyYWN0ZXJzIHRvIHJldHVyblxuICAgICAqICBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICovXG4gICAgU3RyaW5nLnByb3RvdHlwZS5zdWJzdHIgPSBmdW5jdGlvbihzdGFydCwgbGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBzdHJpbmdfc3Vic3RyLmNhbGwoXG4gICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgc3RhcnQgPCAwID8gKChzdGFydCA9IHRoaXMubGVuZ3RoICsgc3RhcnQpIDwgMCA/IDAgOiBzdGFydCkgOiBzdGFydCxcbiAgICAgICAgICAgIGxlbmd0aFxuICAgICAgICApO1xuICAgIH1cbn1cblxuLy8gRVM1IDE1LjUuNC4yMFxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNS40LjIwXG52YXIgd3MgPSBcIlxceDA5XFx4MEFcXHgwQlxceDBDXFx4MERcXHgyMFxceEEwXFx1MTY4MFxcdTE4MEVcXHUyMDAwXFx1MjAwMVxcdTIwMDJcXHUyMDAzXCIgK1xuICAgIFwiXFx1MjAwNFxcdTIwMDVcXHUyMDA2XFx1MjAwN1xcdTIwMDhcXHUyMDA5XFx1MjAwQVxcdTIwMkZcXHUyMDVGXFx1MzAwMFxcdTIwMjhcIiArXG4gICAgXCJcXHUyMDI5XFx1RkVGRlwiO1xuaWYgKCFTdHJpbmcucHJvdG90eXBlLnRyaW0gfHwgd3MudHJpbSgpKSB7XG4gICAgLy8gaHR0cDovL2Jsb2cuc3RldmVubGV2aXRoYW4uY29tL2FyY2hpdmVzL2Zhc3Rlci10cmltLWphdmFzY3JpcHRcbiAgICAvLyBodHRwOi8vcGVyZmVjdGlvbmtpbGxzLmNvbS93aGl0ZXNwYWNlLWRldmlhdGlvbnMvXG4gICAgd3MgPSBcIltcIiArIHdzICsgXCJdXCI7XG4gICAgdmFyIHRyaW1CZWdpblJlZ2V4cCA9IG5ldyBSZWdFeHAoXCJeXCIgKyB3cyArIHdzICsgXCIqXCIpLFxuICAgICAgICB0cmltRW5kUmVnZXhwID0gbmV3IFJlZ0V4cCh3cyArIHdzICsgXCIqJFwiKTtcbiAgICBTdHJpbmcucHJvdG90eXBlLnRyaW0gPSBmdW5jdGlvbiB0cmltKCkge1xuICAgICAgICBpZiAodGhpcyA9PT0gdm9pZCAwIHx8IHRoaXMgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJjYW4ndCBjb252ZXJ0IFwiK3RoaXMrXCIgdG8gb2JqZWN0XCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBTdHJpbmcodGhpcylcbiAgICAgICAgICAgIC5yZXBsYWNlKHRyaW1CZWdpblJlZ2V4cCwgXCJcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKHRyaW1FbmRSZWdleHAsIFwiXCIpO1xuICAgIH07XG59XG5cbi8vXG4vLyBVdGlsXG4vLyA9PT09PT1cbi8vXG5cbi8vIEVTNSA5LjRcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDkuNFxuLy8gaHR0cDovL2pzcGVyZi5jb20vdG8taW50ZWdlclxuXG5mdW5jdGlvbiB0b0ludGVnZXIobikge1xuICAgIG4gPSArbjtcbiAgICBpZiAobiAhPT0gbikgeyAvLyBpc05hTlxuICAgICAgICBuID0gMDtcbiAgICB9IGVsc2UgaWYgKG4gIT09IDAgJiYgbiAhPT0gKDEvMCkgJiYgbiAhPT0gLSgxLzApKSB7XG4gICAgICAgIG4gPSAobiA+IDAgfHwgLTEpICogTWF0aC5mbG9vcihNYXRoLmFicyhuKSk7XG4gICAgfVxuICAgIHJldHVybiBuO1xufVxuXG5mdW5jdGlvbiBpc1ByaW1pdGl2ZShpbnB1dCkge1xuICAgIHZhciB0eXBlID0gdHlwZW9mIGlucHV0O1xuICAgIHJldHVybiAoXG4gICAgICAgIGlucHV0ID09PSBudWxsIHx8XG4gICAgICAgIHR5cGUgPT09IFwidW5kZWZpbmVkXCIgfHxcbiAgICAgICAgdHlwZSA9PT0gXCJib29sZWFuXCIgfHxcbiAgICAgICAgdHlwZSA9PT0gXCJudW1iZXJcIiB8fFxuICAgICAgICB0eXBlID09PSBcInN0cmluZ1wiXG4gICAgKTtcbn1cblxuZnVuY3Rpb24gdG9QcmltaXRpdmUoaW5wdXQpIHtcbiAgICB2YXIgdmFsLCB2YWx1ZU9mLCB0b1N0cmluZztcbiAgICBpZiAoaXNQcmltaXRpdmUoaW5wdXQpKSB7XG4gICAgICAgIHJldHVybiBpbnB1dDtcbiAgICB9XG4gICAgdmFsdWVPZiA9IGlucHV0LnZhbHVlT2Y7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZU9mID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgdmFsID0gdmFsdWVPZi5jYWxsKGlucHV0KTtcbiAgICAgICAgaWYgKGlzUHJpbWl0aXZlKHZhbCkpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdG9TdHJpbmcgPSBpbnB1dC50b1N0cmluZztcbiAgICBpZiAodHlwZW9mIHRvU3RyaW5nID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgdmFsID0gdG9TdHJpbmcuY2FsbChpbnB1dCk7XG4gICAgICAgIGlmIChpc1ByaW1pdGl2ZSh2YWwpKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgICB9XG4gICAgfVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbn1cblxuLy8gRVM1IDkuOVxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4OS45XG52YXIgdG9PYmplY3QgPSBmdW5jdGlvbiAobykge1xuICAgIGlmIChvID09IG51bGwpIHsgLy8gdGhpcyBtYXRjaGVzIGJvdGggbnVsbCBhbmQgdW5kZWZpbmVkXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJjYW4ndCBjb252ZXJ0IFwiK28rXCIgdG8gb2JqZWN0XCIpO1xuICAgIH1cbiAgICByZXR1cm4gT2JqZWN0KG8pO1xufTtcblxufSk7XG4iLCIvLyBDb3B5cmlnaHQgMjAwOS0yMDEyIGJ5IGNvbnRyaWJ1dG9ycywgTUlUIExpY2Vuc2Vcbi8vIHZpbTogdHM9NCBzdHM9NCBzdz00IGV4cGFuZHRhYlxuXG4vLyBNb2R1bGUgc3lzdGVtcyBtYWdpYyBkYW5jZVxuKGZ1bmN0aW9uIChkZWZpbml0aW9uKSB7XG4gICAgLy8gUmVxdWlyZUpTXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGRlZmluZShkZWZpbml0aW9uKTtcbiAgICAvLyBZVUkzXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgWVVJID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBZVUkuYWRkKFwiZXM1LXNoYW1cIiwgZGVmaW5pdGlvbik7XG4gICAgLy8gQ29tbW9uSlMgYW5kIDxzY3JpcHQ+XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZGVmaW5pdGlvbigpO1xuICAgIH1cbn0pKGZ1bmN0aW9uICgpIHtcblxuXG52YXIgY2FsbCA9IEZ1bmN0aW9uLnByb3RvdHlwZS5jYWxsO1xudmFyIHByb3RvdHlwZU9mT2JqZWN0ID0gT2JqZWN0LnByb3RvdHlwZTtcbnZhciBvd25zID0gY2FsbC5iaW5kKHByb3RvdHlwZU9mT2JqZWN0Lmhhc093blByb3BlcnR5KTtcblxuLy8gSWYgSlMgZW5naW5lIHN1cHBvcnRzIGFjY2Vzc29ycyBjcmVhdGluZyBzaG9ydGN1dHMuXG52YXIgZGVmaW5lR2V0dGVyO1xudmFyIGRlZmluZVNldHRlcjtcbnZhciBsb29rdXBHZXR0ZXI7XG52YXIgbG9va3VwU2V0dGVyO1xudmFyIHN1cHBvcnRzQWNjZXNzb3JzO1xuaWYgKChzdXBwb3J0c0FjY2Vzc29ycyA9IG93bnMocHJvdG90eXBlT2ZPYmplY3QsIFwiX19kZWZpbmVHZXR0ZXJfX1wiKSkpIHtcbiAgICBkZWZpbmVHZXR0ZXIgPSBjYWxsLmJpbmQocHJvdG90eXBlT2ZPYmplY3QuX19kZWZpbmVHZXR0ZXJfXyk7XG4gICAgZGVmaW5lU2V0dGVyID0gY2FsbC5iaW5kKHByb3RvdHlwZU9mT2JqZWN0Ll9fZGVmaW5lU2V0dGVyX18pO1xuICAgIGxvb2t1cEdldHRlciA9IGNhbGwuYmluZChwcm90b3R5cGVPZk9iamVjdC5fX2xvb2t1cEdldHRlcl9fKTtcbiAgICBsb29rdXBTZXR0ZXIgPSBjYWxsLmJpbmQocHJvdG90eXBlT2ZPYmplY3QuX19sb29rdXBTZXR0ZXJfXyk7XG59XG5cbi8vIEVTNSAxNS4yLjMuMlxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuMi4zLjJcbmlmICghT2JqZWN0LmdldFByb3RvdHlwZU9mKSB7XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2tyaXNrb3dhbC9lczUtc2hpbS9pc3N1ZXMjaXNzdWUvMlxuICAgIC8vIGh0dHA6Ly9lam9obi5vcmcvYmxvZy9vYmplY3RnZXRwcm90b3R5cGVvZi9cbiAgICAvLyByZWNvbW1lbmRlZCBieSBmc2NoYWVmZXIgb24gZ2l0aHViXG4gICAgT2JqZWN0LmdldFByb3RvdHlwZU9mID0gZnVuY3Rpb24gZ2V0UHJvdG90eXBlT2Yob2JqZWN0KSB7XG4gICAgICAgIHJldHVybiBvYmplY3QuX19wcm90b19fIHx8IChcbiAgICAgICAgICAgIG9iamVjdC5jb25zdHJ1Y3RvclxuICAgICAgICAgICAgICAgID8gb2JqZWN0LmNvbnN0cnVjdG9yLnByb3RvdHlwZVxuICAgICAgICAgICAgICAgIDogcHJvdG90eXBlT2ZPYmplY3RcbiAgICAgICAgKTtcbiAgICB9O1xufVxuXG4vL0VTNSAxNS4yLjMuM1xuLy9odHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS4yLjMuM1xuXG5mdW5jdGlvbiBkb2VzR2V0T3duUHJvcGVydHlEZXNjcmlwdG9yV29yayhvYmplY3QpIHtcbiAgICB0cnkge1xuICAgICAgICBvYmplY3Quc2VudGluZWwgPSAwO1xuICAgICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihcbiAgICAgICAgICAgICAgICBvYmplY3QsXG4gICAgICAgICAgICAgICAgXCJzZW50aW5lbFwiXG4gICAgICAgICkudmFsdWUgPT09IDA7XG4gICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgICAgIC8vIHJldHVybnMgZmFsc3lcbiAgICB9XG59XG5cbi8vY2hlY2sgd2hldGhlciBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Igd29ya3MgaWYgaXQncyBnaXZlbi4gT3RoZXJ3aXNlLFxuLy9zaGltIHBhcnRpYWxseS5cbmlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHtcbiAgICB2YXIgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yV29ya3NPbk9iamVjdCA9IFxuICAgICAgICBkb2VzR2V0T3duUHJvcGVydHlEZXNjcmlwdG9yV29yayh7fSk7XG4gICAgdmFyIGdldE93blByb3BlcnR5RGVzY3JpcHRvcldvcmtzT25Eb20gPSB0eXBlb2YgZG9jdW1lbnQgPT0gXCJ1bmRlZmluZWRcIiB8fFxuICAgIGRvZXNHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JXb3JrKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikpO1xuICAgIGlmICghZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yV29ya3NPbkRvbSB8fCBcbiAgICAgICAgICAgICFnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JXb3Jrc09uT2JqZWN0XG4gICAgKSB7XG4gICAgICAgIHZhciBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JGYWxsYmFjayA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG4gICAgfVxufVxuXG5pZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgfHwgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yRmFsbGJhY2spIHtcbiAgICB2YXIgRVJSX05PTl9PQkpFQ1QgPSBcIk9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgY2FsbGVkIG9uIGEgbm9uLW9iamVjdDogXCI7XG5cbiAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgcHJvcGVydHkpIHtcbiAgICAgICAgaWYgKCh0eXBlb2Ygb2JqZWN0ICE9IFwib2JqZWN0XCIgJiYgdHlwZW9mIG9iamVjdCAhPSBcImZ1bmN0aW9uXCIpIHx8IG9iamVjdCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihFUlJfTk9OX09CSkVDVCArIG9iamVjdCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBtYWtlIGEgdmFsaWFudCBhdHRlbXB0IHRvIHVzZSB0aGUgcmVhbCBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JcbiAgICAgICAgLy8gZm9yIEk4J3MgRE9NIGVsZW1lbnRzLlxuICAgICAgICBpZiAoZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yRmFsbGJhY2spIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldE93blByb3BlcnR5RGVzY3JpcHRvckZhbGxiYWNrLmNhbGwoT2JqZWN0LCBvYmplY3QsIHByb3BlcnR5KTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgICAgICAgICAgICAgIC8vIHRyeSB0aGUgc2hpbSBpZiB0aGUgcmVhbCBvbmUgZG9lc24ndCB3b3JrXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiBvYmplY3QgZG9lcyBub3Qgb3ducyBwcm9wZXJ0eSByZXR1cm4gdW5kZWZpbmVkIGltbWVkaWF0ZWx5LlxuICAgICAgICBpZiAoIW93bnMob2JqZWN0LCBwcm9wZXJ0eSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIG9iamVjdCBoYXMgYSBwcm9wZXJ0eSB0aGVuIGl0J3MgZm9yIHN1cmUgYm90aCBgZW51bWVyYWJsZWAgYW5kXG4gICAgICAgIC8vIGBjb25maWd1cmFibGVgLlxuICAgICAgICB2YXIgZGVzY3JpcHRvciA9ICB7IGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9O1xuXG4gICAgICAgIC8vIElmIEpTIGVuZ2luZSBzdXBwb3J0cyBhY2Nlc3NvciBwcm9wZXJ0aWVzIHRoZW4gcHJvcGVydHkgbWF5IGJlIGFcbiAgICAgICAgLy8gZ2V0dGVyIG9yIHNldHRlci5cbiAgICAgICAgaWYgKHN1cHBvcnRzQWNjZXNzb3JzKSB7XG4gICAgICAgICAgICAvLyBVbmZvcnR1bmF0ZWx5IGBfX2xvb2t1cEdldHRlcl9fYCB3aWxsIHJldHVybiBhIGdldHRlciBldmVuXG4gICAgICAgICAgICAvLyBpZiBvYmplY3QgaGFzIG93biBub24gZ2V0dGVyIHByb3BlcnR5IGFsb25nIHdpdGggYSBzYW1lIG5hbWVkXG4gICAgICAgICAgICAvLyBpbmhlcml0ZWQgZ2V0dGVyLiBUbyBhdm9pZCBtaXNiZWhhdmlvciB3ZSB0ZW1wb3JhcnkgcmVtb3ZlXG4gICAgICAgICAgICAvLyBgX19wcm90b19fYCBzbyB0aGF0IGBfX2xvb2t1cEdldHRlcl9fYCB3aWxsIHJldHVybiBnZXR0ZXIgb25seVxuICAgICAgICAgICAgLy8gaWYgaXQncyBvd25lZCBieSBhbiBvYmplY3QuXG4gICAgICAgICAgICB2YXIgcHJvdG90eXBlID0gb2JqZWN0Ll9fcHJvdG9fXztcbiAgICAgICAgICAgIG9iamVjdC5fX3Byb3RvX18gPSBwcm90b3R5cGVPZk9iamVjdDtcblxuICAgICAgICAgICAgdmFyIGdldHRlciA9IGxvb2t1cEdldHRlcihvYmplY3QsIHByb3BlcnR5KTtcbiAgICAgICAgICAgIHZhciBzZXR0ZXIgPSBsb29rdXBTZXR0ZXIob2JqZWN0LCBwcm9wZXJ0eSk7XG5cbiAgICAgICAgICAgIC8vIE9uY2Ugd2UgaGF2ZSBnZXR0ZXIgYW5kIHNldHRlciB3ZSBjYW4gcHV0IHZhbHVlcyBiYWNrLlxuICAgICAgICAgICAgb2JqZWN0Ll9fcHJvdG9fXyA9IHByb3RvdHlwZTtcblxuICAgICAgICAgICAgaWYgKGdldHRlciB8fCBzZXR0ZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAoZ2V0dGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0b3IuZ2V0ID0gZ2V0dGVyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoc2V0dGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0b3Iuc2V0ID0gc2V0dGVyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBJZiBpdCB3YXMgYWNjZXNzb3IgcHJvcGVydHkgd2UncmUgZG9uZSBhbmQgcmV0dXJuIGhlcmVcbiAgICAgICAgICAgICAgICAvLyBpbiBvcmRlciB0byBhdm9pZCBhZGRpbmcgYHZhbHVlYCB0byB0aGUgZGVzY3JpcHRvci5cbiAgICAgICAgICAgICAgICByZXR1cm4gZGVzY3JpcHRvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHdlIGdvdCB0aGlzIGZhciB3ZSBrbm93IHRoYXQgb2JqZWN0IGhhcyBhbiBvd24gcHJvcGVydHkgdGhhdCBpc1xuICAgICAgICAvLyBub3QgYW4gYWNjZXNzb3Igc28gd2Ugc2V0IGl0IGFzIGEgdmFsdWUgYW5kIHJldHVybiBkZXNjcmlwdG9yLlxuICAgICAgICBkZXNjcmlwdG9yLnZhbHVlID0gb2JqZWN0W3Byb3BlcnR5XTtcbiAgICAgICAgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XG4gICAgICAgIHJldHVybiBkZXNjcmlwdG9yO1xuICAgIH07XG59XG5cbi8vIEVTNSAxNS4yLjMuNFxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuMi4zLjRcbmlmICghT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMpIHtcbiAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMob2JqZWN0KSB7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhvYmplY3QpO1xuICAgIH07XG59XG5cbi8vIEVTNSAxNS4yLjMuNVxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuMi4zLjVcbmlmICghT2JqZWN0LmNyZWF0ZSkge1xuXG4gICAgLy8gQ29udHJpYnV0ZWQgYnkgQnJhbmRvbiBCZW52aWUsIE9jdG9iZXIsIDIwMTJcbiAgICB2YXIgY3JlYXRlRW1wdHk7XG4gICAgdmFyIHN1cHBvcnRzUHJvdG8gPSBPYmplY3QucHJvdG90eXBlLl9fcHJvdG9fXyA9PT0gbnVsbDtcbiAgICBpZiAoc3VwcG9ydHNQcm90byB8fCB0eXBlb2YgZG9jdW1lbnQgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgY3JlYXRlRW1wdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4geyBcIl9fcHJvdG9fX1wiOiBudWxsIH07XG4gICAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gSW4gb2xkIElFIF9fcHJvdG9fXyBjYW4ndCBiZSB1c2VkIHRvIG1hbnVhbGx5IHNldCBgbnVsbGAsIG5vciBkb2VzXG4gICAgICAgIC8vIGFueSBvdGhlciBtZXRob2QgZXhpc3QgdG8gbWFrZSBhbiBvYmplY3QgdGhhdCBpbmhlcml0cyBmcm9tIG5vdGhpbmcsXG4gICAgICAgIC8vIGFzaWRlIGZyb20gT2JqZWN0LnByb3RvdHlwZSBpdHNlbGYuIEluc3RlYWQsIGNyZWF0ZSBhIG5ldyBnbG9iYWxcbiAgICAgICAgLy8gb2JqZWN0IGFuZCAqc3RlYWwqIGl0cyBPYmplY3QucHJvdG90eXBlIGFuZCBzdHJpcCBpdCBiYXJlLiBUaGlzIGlzXG4gICAgICAgIC8vIHVzZWQgYXMgdGhlIHByb3RvdHlwZSB0byBjcmVhdGUgbnVsbGFyeSBvYmplY3RzLlxuICAgICAgICBjcmVhdGVFbXB0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBpZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcbiAgICAgICAgICAgIHZhciBwYXJlbnQgPSBkb2N1bWVudC5ib2R5IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgICAgIGlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGlmcmFtZSk7XG4gICAgICAgICAgICBpZnJhbWUuc3JjID0gJ2phdmFzY3JpcHQ6JztcbiAgICAgICAgICAgIHZhciBlbXB0eSA9IGlmcmFtZS5jb250ZW50V2luZG93Lk9iamVjdC5wcm90b3R5cGU7XG4gICAgICAgICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQoaWZyYW1lKTtcbiAgICAgICAgICAgIGlmcmFtZSA9IG51bGw7XG4gICAgICAgICAgICBkZWxldGUgZW1wdHkuY29uc3RydWN0b3I7XG4gICAgICAgICAgICBkZWxldGUgZW1wdHkuaGFzT3duUHJvcGVydHk7XG4gICAgICAgICAgICBkZWxldGUgZW1wdHkucHJvcGVydHlJc0VudW1lcmFibGU7XG4gICAgICAgICAgICBkZWxldGUgZW1wdHkuaXNQcm90b3R5cGVPZjtcbiAgICAgICAgICAgIGRlbGV0ZSBlbXB0eS50b0xvY2FsZVN0cmluZztcbiAgICAgICAgICAgIGRlbGV0ZSBlbXB0eS50b1N0cmluZztcbiAgICAgICAgICAgIGRlbGV0ZSBlbXB0eS52YWx1ZU9mO1xuICAgICAgICAgICAgZW1wdHkuX19wcm90b19fID0gbnVsbDtcblxuICAgICAgICAgICAgZnVuY3Rpb24gRW1wdHkoKSB7fVxuICAgICAgICAgICAgRW1wdHkucHJvdG90eXBlID0gZW1wdHk7XG4gICAgICAgICAgICAvLyBzaG9ydC1jaXJjdWl0IGZ1dHVyZSBjYWxsc1xuICAgICAgICAgICAgY3JlYXRlRW1wdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBFbXB0eSgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRW1wdHkoKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBPYmplY3QuY3JlYXRlID0gZnVuY3Rpb24gY3JlYXRlKHByb3RvdHlwZSwgcHJvcGVydGllcykge1xuXG4gICAgICAgIHZhciBvYmplY3Q7XG4gICAgICAgIGZ1bmN0aW9uIFR5cGUoKSB7fSAgLy8gQW4gZW1wdHkgY29uc3RydWN0b3IuXG5cbiAgICAgICAgaWYgKHByb3RvdHlwZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgb2JqZWN0ID0gY3JlYXRlRW1wdHkoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcHJvdG90eXBlICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiBwcm90b3R5cGUgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIC8vIEluIHRoZSBuYXRpdmUgaW1wbGVtZW50YXRpb24gYHBhcmVudGAgY2FuIGJlIGBudWxsYFxuICAgICAgICAgICAgICAgIC8vIE9SICphbnkqIGBpbnN0YW5jZW9mIE9iamVjdGAgIChPYmplY3R8RnVuY3Rpb258QXJyYXl8UmVnRXhwfGV0YylcbiAgICAgICAgICAgICAgICAvLyBVc2UgYHR5cGVvZmAgdGhvLCBiL2MgaW4gb2xkIElFLCBET00gZWxlbWVudHMgYXJlIG5vdCBgaW5zdGFuY2VvZiBPYmplY3RgXG4gICAgICAgICAgICAgICAgLy8gbGlrZSB0aGV5IGFyZSBpbiBtb2Rlcm4gYnJvd3NlcnMuIFVzaW5nIGBPYmplY3QuY3JlYXRlYCBvbiBET00gZWxlbWVudHNcbiAgICAgICAgICAgICAgICAvLyBpcy4uLmVyci4uLnByb2JhYmx5IGluYXBwcm9wcmlhdGUsIGJ1dCB0aGUgbmF0aXZlIHZlcnNpb24gYWxsb3dzIGZvciBpdC5cbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiT2JqZWN0IHByb3RvdHlwZSBtYXkgb25seSBiZSBhbiBPYmplY3Qgb3IgbnVsbFwiKTsgLy8gc2FtZSBtc2cgYXMgQ2hyb21lXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBUeXBlLnByb3RvdHlwZSA9IHByb3RvdHlwZTtcbiAgICAgICAgICAgIG9iamVjdCA9IG5ldyBUeXBlKCk7XG4gICAgICAgICAgICAvLyBJRSBoYXMgbm8gYnVpbHQtaW4gaW1wbGVtZW50YXRpb24gb2YgYE9iamVjdC5nZXRQcm90b3R5cGVPZmBcbiAgICAgICAgICAgIC8vIG5laXRoZXIgYF9fcHJvdG9fX2AsIGJ1dCB0aGlzIG1hbnVhbGx5IHNldHRpbmcgYF9fcHJvdG9fX2Agd2lsbFxuICAgICAgICAgICAgLy8gZ3VhcmFudGVlIHRoYXQgYE9iamVjdC5nZXRQcm90b3R5cGVPZmAgd2lsbCB3b3JrIGFzIGV4cGVjdGVkIHdpdGhcbiAgICAgICAgICAgIC8vIG9iamVjdHMgY3JlYXRlZCB1c2luZyBgT2JqZWN0LmNyZWF0ZWBcbiAgICAgICAgICAgIG9iamVjdC5fX3Byb3RvX18gPSBwcm90b3R5cGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJvcGVydGllcyAhPT0gdm9pZCAwKSB7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhvYmplY3QsIHByb3BlcnRpZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9O1xufVxuXG4vLyBFUzUgMTUuMi4zLjZcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjIuMy42XG5cbi8vIFBhdGNoIGZvciBXZWJLaXQgYW5kIElFOCBzdGFuZGFyZCBtb2RlXG4vLyBEZXNpZ25lZCBieSBoYXggPGhheC5naXRodWIuY29tPlxuLy8gcmVsYXRlZCBpc3N1ZTogaHR0cHM6Ly9naXRodWIuY29tL2tyaXNrb3dhbC9lczUtc2hpbS9pc3N1ZXMjaXNzdWUvNVxuLy8gSUU4IFJlZmVyZW5jZTpcbi8vICAgICBodHRwOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvZGQyODI5MDAuYXNweFxuLy8gICAgIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9kZDIyOTkxNi5hc3B4XG4vLyBXZWJLaXQgQnVnczpcbi8vICAgICBodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MzY0MjNcblxuZnVuY3Rpb24gZG9lc0RlZmluZVByb3BlcnR5V29yayhvYmplY3QpIHtcbiAgICB0cnkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCBcInNlbnRpbmVsXCIsIHt9KTtcbiAgICAgICAgcmV0dXJuIFwic2VudGluZWxcIiBpbiBvYmplY3Q7XG4gICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgICAgIC8vIHJldHVybnMgZmFsc3lcbiAgICB9XG59XG5cbi8vIGNoZWNrIHdoZXRoZXIgZGVmaW5lUHJvcGVydHkgd29ya3MgaWYgaXQncyBnaXZlbi4gT3RoZXJ3aXNlLFxuLy8gc2hpbSBwYXJ0aWFsbHkuXG5pZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7XG4gICAgdmFyIGRlZmluZVByb3BlcnR5V29ya3NPbk9iamVjdCA9IGRvZXNEZWZpbmVQcm9wZXJ0eVdvcmsoe30pO1xuICAgIHZhciBkZWZpbmVQcm9wZXJ0eVdvcmtzT25Eb20gPSB0eXBlb2YgZG9jdW1lbnQgPT0gXCJ1bmRlZmluZWRcIiB8fFxuICAgICAgICBkb2VzRGVmaW5lUHJvcGVydHlXb3JrKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikpO1xuICAgIGlmICghZGVmaW5lUHJvcGVydHlXb3Jrc09uT2JqZWN0IHx8ICFkZWZpbmVQcm9wZXJ0eVdvcmtzT25Eb20pIHtcbiAgICAgICAgdmFyIGRlZmluZVByb3BlcnR5RmFsbGJhY2sgPSBPYmplY3QuZGVmaW5lUHJvcGVydHksXG4gICAgICAgICAgICBkZWZpbmVQcm9wZXJ0aWVzRmFsbGJhY2sgPSBPYmplY3QuZGVmaW5lUHJvcGVydGllcztcbiAgICB9XG59XG5cbmlmICghT2JqZWN0LmRlZmluZVByb3BlcnR5IHx8IGRlZmluZVByb3BlcnR5RmFsbGJhY2spIHtcbiAgICB2YXIgRVJSX05PTl9PQkpFQ1RfREVTQ1JJUFRPUiA9IFwiUHJvcGVydHkgZGVzY3JpcHRpb24gbXVzdCBiZSBhbiBvYmplY3Q6IFwiO1xuICAgIHZhciBFUlJfTk9OX09CSkVDVF9UQVJHRVQgPSBcIk9iamVjdC5kZWZpbmVQcm9wZXJ0eSBjYWxsZWQgb24gbm9uLW9iamVjdDogXCJcbiAgICB2YXIgRVJSX0FDQ0VTU09SU19OT1RfU1VQUE9SVEVEID0gXCJnZXR0ZXJzICYgc2V0dGVycyBjYW4gbm90IGJlIGRlZmluZWQgXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm9uIHRoaXMgamF2YXNjcmlwdCBlbmdpbmVcIjtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KG9iamVjdCwgcHJvcGVydHksIGRlc2NyaXB0b3IpIHtcbiAgICAgICAgaWYgKCh0eXBlb2Ygb2JqZWN0ICE9IFwib2JqZWN0XCIgJiYgdHlwZW9mIG9iamVjdCAhPSBcImZ1bmN0aW9uXCIpIHx8IG9iamVjdCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihFUlJfTk9OX09CSkVDVF9UQVJHRVQgKyBvYmplY3QpO1xuICAgICAgICB9XG4gICAgICAgIGlmICgodHlwZW9mIGRlc2NyaXB0b3IgIT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgZGVzY3JpcHRvciAhPSBcImZ1bmN0aW9uXCIpIHx8IGRlc2NyaXB0b3IgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRVJSX05PTl9PQkpFQ1RfREVTQ1JJUFRPUiArIGRlc2NyaXB0b3IpO1xuICAgICAgICB9XG4gICAgICAgIC8vIG1ha2UgYSB2YWxpYW50IGF0dGVtcHQgdG8gdXNlIHRoZSByZWFsIGRlZmluZVByb3BlcnR5XG4gICAgICAgIC8vIGZvciBJOCdzIERPTSBlbGVtZW50cy5cbiAgICAgICAgaWYgKGRlZmluZVByb3BlcnR5RmFsbGJhY2spIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZmluZVByb3BlcnR5RmFsbGJhY2suY2FsbChPYmplY3QsIG9iamVjdCwgcHJvcGVydHksIGRlc2NyaXB0b3IpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgICAgICAgICAgICAgLy8gdHJ5IHRoZSBzaGltIGlmIHRoZSByZWFsIG9uZSBkb2Vzbid0IHdvcmtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIGl0J3MgYSBkYXRhIHByb3BlcnR5LlxuICAgICAgICBpZiAob3ducyhkZXNjcmlwdG9yLCBcInZhbHVlXCIpKSB7XG4gICAgICAgICAgICAvLyBmYWlsIHNpbGVudGx5IGlmIFwid3JpdGFibGVcIiwgXCJlbnVtZXJhYmxlXCIsIG9yIFwiY29uZmlndXJhYmxlXCJcbiAgICAgICAgICAgIC8vIGFyZSByZXF1ZXN0ZWQgYnV0IG5vdCBzdXBwb3J0ZWRcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAvLyBhbHRlcm5hdGUgYXBwcm9hY2g6XG4gICAgICAgICAgICBpZiAoIC8vIGNhbid0IGltcGxlbWVudCB0aGVzZSBmZWF0dXJlczsgYWxsb3cgZmFsc2UgYnV0IG5vdCB0cnVlXG4gICAgICAgICAgICAgICAgIShvd25zKGRlc2NyaXB0b3IsIFwid3JpdGFibGVcIikgPyBkZXNjcmlwdG9yLndyaXRhYmxlIDogdHJ1ZSkgfHxcbiAgICAgICAgICAgICAgICAhKG93bnMoZGVzY3JpcHRvciwgXCJlbnVtZXJhYmxlXCIpID8gZGVzY3JpcHRvci5lbnVtZXJhYmxlIDogdHJ1ZSkgfHxcbiAgICAgICAgICAgICAgICAhKG93bnMoZGVzY3JpcHRvciwgXCJjb25maWd1cmFibGVcIikgPyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA6IHRydWUpXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgIFwiVGhpcyBpbXBsZW1lbnRhdGlvbiBvZiBPYmplY3QuZGVmaW5lUHJvcGVydHkgZG9lcyBub3QgXCIgK1xuICAgICAgICAgICAgICAgICAgICBcInN1cHBvcnQgY29uZmlndXJhYmxlLCBlbnVtZXJhYmxlLCBvciB3cml0YWJsZS5cIlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICBpZiAoc3VwcG9ydHNBY2Nlc3NvcnMgJiYgKGxvb2t1cEdldHRlcihvYmplY3QsIHByb3BlcnR5KSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb29rdXBTZXR0ZXIob2JqZWN0LCBwcm9wZXJ0eSkpKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIC8vIEFzIGFjY2Vzc29ycyBhcmUgc3VwcG9ydGVkIG9ubHkgb24gZW5naW5lcyBpbXBsZW1lbnRpbmdcbiAgICAgICAgICAgICAgICAvLyBgX19wcm90b19fYCB3ZSBjYW4gc2FmZWx5IG92ZXJyaWRlIGBfX3Byb3RvX19gIHdoaWxlIGRlZmluaW5nXG4gICAgICAgICAgICAgICAgLy8gYSBwcm9wZXJ0eSB0byBtYWtlIHN1cmUgdGhhdCB3ZSBkb24ndCBoaXQgYW4gaW5oZXJpdGVkXG4gICAgICAgICAgICAgICAgLy8gYWNjZXNzb3IuXG4gICAgICAgICAgICAgICAgdmFyIHByb3RvdHlwZSA9IG9iamVjdC5fX3Byb3RvX187XG4gICAgICAgICAgICAgICAgb2JqZWN0Ll9fcHJvdG9fXyA9IHByb3RvdHlwZU9mT2JqZWN0O1xuICAgICAgICAgICAgICAgIC8vIERlbGV0aW5nIGEgcHJvcGVydHkgYW55d2F5IHNpbmNlIGdldHRlciAvIHNldHRlciBtYXkgYmVcbiAgICAgICAgICAgICAgICAvLyBkZWZpbmVkIG9uIG9iamVjdCBpdHNlbGYuXG4gICAgICAgICAgICAgICAgZGVsZXRlIG9iamVjdFtwcm9wZXJ0eV07XG4gICAgICAgICAgICAgICAgb2JqZWN0W3Byb3BlcnR5XSA9IGRlc2NyaXB0b3IudmFsdWU7XG4gICAgICAgICAgICAgICAgLy8gU2V0dGluZyBvcmlnaW5hbCBgX19wcm90b19fYCBiYWNrIG5vdy5cbiAgICAgICAgICAgICAgICBvYmplY3QuX19wcm90b19fID0gcHJvdG90eXBlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvYmplY3RbcHJvcGVydHldID0gZGVzY3JpcHRvci52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghc3VwcG9ydHNBY2Nlc3NvcnMpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEVSUl9BQ0NFU1NPUlNfTk9UX1NVUFBPUlRFRCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBJZiB3ZSBnb3QgdGhhdCBmYXIgdGhlbiBnZXR0ZXJzIGFuZCBzZXR0ZXJzIGNhbiBiZSBkZWZpbmVkICEhXG4gICAgICAgICAgICBpZiAob3ducyhkZXNjcmlwdG9yLCBcImdldFwiKSkge1xuICAgICAgICAgICAgICAgIGRlZmluZUdldHRlcihvYmplY3QsIHByb3BlcnR5LCBkZXNjcmlwdG9yLmdldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3ducyhkZXNjcmlwdG9yLCBcInNldFwiKSkge1xuICAgICAgICAgICAgICAgIGRlZmluZVNldHRlcihvYmplY3QsIHByb3BlcnR5LCBkZXNjcmlwdG9yLnNldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9O1xufVxuXG4vLyBFUzUgMTUuMi4zLjdcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjIuMy43XG5pZiAoIU9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIHx8IGRlZmluZVByb3BlcnRpZXNGYWxsYmFjaykge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzID0gZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyhvYmplY3QsIHByb3BlcnRpZXMpIHtcbiAgICAgICAgLy8gbWFrZSBhIHZhbGlhbnQgYXR0ZW1wdCB0byB1c2UgdGhlIHJlYWwgZGVmaW5lUHJvcGVydGllc1xuICAgICAgICBpZiAoZGVmaW5lUHJvcGVydGllc0ZhbGxiYWNrKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJldHVybiBkZWZpbmVQcm9wZXJ0aWVzRmFsbGJhY2suY2FsbChPYmplY3QsIG9iamVjdCwgcHJvcGVydGllcyk7XG4gICAgICAgICAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICAgICAgICAgICAgICAvLyB0cnkgdGhlIHNoaW0gaWYgdGhlIHJlYWwgb25lIGRvZXNuJ3Qgd29ya1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gcHJvcGVydGllcykge1xuICAgICAgICAgICAgaWYgKG93bnMocHJvcGVydGllcywgcHJvcGVydHkpICYmIHByb3BlcnR5ICE9IFwiX19wcm90b19fXCIpIHtcbiAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCBwcm9wZXJ0eSwgcHJvcGVydGllc1twcm9wZXJ0eV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfTtcbn1cblxuLy8gRVM1IDE1LjIuMy44XG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS4yLjMuOFxuaWYgKCFPYmplY3Quc2VhbCkge1xuICAgIE9iamVjdC5zZWFsID0gZnVuY3Rpb24gc2VhbChvYmplY3QpIHtcbiAgICAgICAgLy8gdGhpcyBpcyBtaXNsZWFkaW5nIGFuZCBicmVha3MgZmVhdHVyZS1kZXRlY3Rpb24sIGJ1dFxuICAgICAgICAvLyBhbGxvd3MgXCJzZWN1cmFibGVcIiBjb2RlIHRvIFwiZ3JhY2VmdWxseVwiIGRlZ3JhZGUgdG8gd29ya2luZ1xuICAgICAgICAvLyBidXQgaW5zZWN1cmUgY29kZS5cbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9O1xufVxuXG4vLyBFUzUgMTUuMi4zLjlcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjIuMy45XG5pZiAoIU9iamVjdC5mcmVlemUpIHtcbiAgICBPYmplY3QuZnJlZXplID0gZnVuY3Rpb24gZnJlZXplKG9iamVjdCkge1xuICAgICAgICAvLyB0aGlzIGlzIG1pc2xlYWRpbmcgYW5kIGJyZWFrcyBmZWF0dXJlLWRldGVjdGlvbiwgYnV0XG4gICAgICAgIC8vIGFsbG93cyBcInNlY3VyYWJsZVwiIGNvZGUgdG8gXCJncmFjZWZ1bGx5XCIgZGVncmFkZSB0byB3b3JraW5nXG4gICAgICAgIC8vIGJ1dCBpbnNlY3VyZSBjb2RlLlxuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH07XG59XG5cbi8vIGRldGVjdCBhIFJoaW5vIGJ1ZyBhbmQgcGF0Y2ggaXRcbnRyeSB7XG4gICAgT2JqZWN0LmZyZWV6ZShmdW5jdGlvbiAoKSB7fSk7XG59IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICBPYmplY3QuZnJlZXplID0gKGZ1bmN0aW9uIGZyZWV6ZShmcmVlemVPYmplY3QpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGZyZWV6ZShvYmplY3QpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb2JqZWN0ID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBmcmVlemVPYmplY3Qob2JqZWN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KShPYmplY3QuZnJlZXplKTtcbn1cblxuLy8gRVM1IDE1LjIuMy4xMFxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuMi4zLjEwXG5pZiAoIU9iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucykge1xuICAgIE9iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucyA9IGZ1bmN0aW9uIHByZXZlbnRFeHRlbnNpb25zKG9iamVjdCkge1xuICAgICAgICAvLyB0aGlzIGlzIG1pc2xlYWRpbmcgYW5kIGJyZWFrcyBmZWF0dXJlLWRldGVjdGlvbiwgYnV0XG4gICAgICAgIC8vIGFsbG93cyBcInNlY3VyYWJsZVwiIGNvZGUgdG8gXCJncmFjZWZ1bGx5XCIgZGVncmFkZSB0byB3b3JraW5nXG4gICAgICAgIC8vIGJ1dCBpbnNlY3VyZSBjb2RlLlxuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH07XG59XG5cbi8vIEVTNSAxNS4yLjMuMTFcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjIuMy4xMVxuaWYgKCFPYmplY3QuaXNTZWFsZWQpIHtcbiAgICBPYmplY3QuaXNTZWFsZWQgPSBmdW5jdGlvbiBpc1NlYWxlZChvYmplY3QpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG59XG5cbi8vIEVTNSAxNS4yLjMuMTJcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjIuMy4xMlxuaWYgKCFPYmplY3QuaXNGcm96ZW4pIHtcbiAgICBPYmplY3QuaXNGcm96ZW4gPSBmdW5jdGlvbiBpc0Zyb3plbihvYmplY3QpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG59XG5cbi8vIEVTNSAxNS4yLjMuMTNcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjIuMy4xM1xuaWYgKCFPYmplY3QuaXNFeHRlbnNpYmxlKSB7XG4gICAgT2JqZWN0LmlzRXh0ZW5zaWJsZSA9IGZ1bmN0aW9uIGlzRXh0ZW5zaWJsZShvYmplY3QpIHtcbiAgICAgICAgLy8gMS4gSWYgVHlwZShPKSBpcyBub3QgT2JqZWN0IHRocm93IGEgVHlwZUVycm9yIGV4Y2VwdGlvbi5cbiAgICAgICAgaWYgKE9iamVjdChvYmplY3QpICE9PSBvYmplY3QpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTsgLy8gVE9ETyBtZXNzYWdlXG4gICAgICAgIH1cbiAgICAgICAgLy8gMi4gUmV0dXJuIHRoZSBCb29sZWFuIHZhbHVlIG9mIHRoZSBbW0V4dGVuc2libGVdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBPLlxuICAgICAgICB2YXIgbmFtZSA9ICcnO1xuICAgICAgICB3aGlsZSAob3ducyhvYmplY3QsIG5hbWUpKSB7XG4gICAgICAgICAgICBuYW1lICs9ICc/JztcbiAgICAgICAgfVxuICAgICAgICBvYmplY3RbbmFtZV0gPSB0cnVlO1xuICAgICAgICB2YXIgcmV0dXJuVmFsdWUgPSBvd25zKG9iamVjdCwgbmFtZSk7XG4gICAgICAgIGRlbGV0ZSBvYmplY3RbbmFtZV07XG4gICAgICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgICB9O1xufVxuXG59KTtcbiJdfQ==
;