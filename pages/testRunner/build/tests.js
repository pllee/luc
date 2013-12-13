;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
require('./node_modules/es5-shim/es5-shim');
require('./node_modules/es5-shim/es5-sham');
},{"./node_modules/es5-shim/es5-sham":3,"./node_modules/es5-shim/es5-shim":2}],4:[function(require,module,exports){
require('../array');
require('../object');
require('../nodet');
require('../class');
require('../is');
require('../function');
require('../compare');
require('../submodule');
},{"../array":5,"../class":8,"../compare":11,"../function":10,"../is":9,"../nodet":7,"../object":6,"../submodule":12}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
 module.exports = require('../lib/luc');
},{"../lib/luc":14}],6:[function(require,module,exports){
var Luc = require('./lucTestLib'),
    expect = require('expect.js');
describe('Luc Object functions', function() {
    it('each', function() {
        var t = {
            a: 'a',
            b: 'b',
            z: 'z'
        }, obj = {str : ''};

        Luc.Object.each(t, function(key, value) {
            this.str += key + value;
        }, obj);
        expect(obj.str).to.eql('aabbzz');
    });

    it('apply', function() {
        var a = {b: 3};
        Luc.apply(a, {a: 1, b:2});
        expect(a).to.eql({a: 1, b:2});
        a = {b: 3};
        Luc.apply(a, {a: 1});
        expect(a).to.eql({a: 1, b: 3});
        expect(Luc.apply({}, undefined)).to.eql({});
        expect(Luc.apply(undefined, {})).to.eql({});
    });

    it('mix', function() {
        var a = {b: 3};
        Luc.mix(a, {a: 1, b:2});
        expect(a).to.eql({a: 1, b:3});
    });

    it('toObject', function() {
        var a = {},
            b = [],
            toObjectArgs,
            toObjectArray;

        toObjectArray = Luc.Object.toObject(['name1', 'name2'], [a,b]);
        expect(toObjectArray.name1).to.eql(a);
        expect(toObjectArray.name2).to.eql(b);

        (function(c,d){
            toObjectArgs = Luc.Object.toObject(['name1', 'name2'], arguments);
            expect(toObjectArgs.name1).to.eql(a);
            expect(toObjectArgs.name2).to.eql(b);
        }(a,b));
    });

    it('filter non ownProperties', function() {
        var obj = Object.create({a: 1, b:2}),
            filtered;

        filtered = Luc.Object.filter(obj, function(key, value) {
            return key === 'a';
        }, undefined, {
            ownProperties: false
        });

        expect(filtered).to.eql([{key: 'a', value: 1}]);
    });

    it('filter ownProperties', function() {
        var obj = Object.create({a: 1, b:2}),
            filtered;

        obj.c = 3;

        filtered = Luc.Object.filter(obj, function(key, value) {
            return key === 'a';
        }, undefined, {
            ownProperties: true
        });

        expect(filtered).to.eql([]);

        filtered = Luc.Object.filter(obj, function(key, value) {
            return key === 'c';
        }, undefined, {
            ownProperties: true
        });

        expect(filtered).to.eql([{key: 'c', value: 3}]);
    });

    it('merge', function() {
        var merge = Luc.Object.merge;

        expect(merge({}, {a:1})).to.eql({a:1});
        expect(merge({a:false}, {a:1})).to.eql({a:false});
        expect(merge({a:[]}, {a:{a:1}})).to.eql({a:[]});
        expect(merge({a:1,b:2, c:null}, {a:2, b:3, c: {a:[]}})).to.eql({a:1,b:2, c:{a:[]}});
        expect(merge({a:{a:{a:{a:1}}}}, {a:{a:{a:{a:2, b:2}}}})).to.eql({a:{a:{a:{a:1, b:2}}}});
        expect(merge({a:{a:{a:{a:1}}}}, {a:{a:{a:{a:2, b:2}}}})).to.eql({a:{a:{a:{a:1, b:2}}}});
    });
});
},{"./lucTestLib":13,"expect.js":15}],5:[function(require,module,exports){
var Luc = require('./lucTestLib'),
    expect = require('expect.js');

describe('Luc Array functions', function() {
    it('each', function() {
        var arr = ['a', 'b', 'z'], obj = {str :'' };

        Luc.Array.each(arr, function(value, index, a) {
            this.str += value + index + a.length;
        }, obj);
        expect(obj.str).to.eql('a03b13z23');
    });

    it('toArray', function() {
        expect(Luc.Array.toArray(undefined)).to.eql([]);
        expect(Luc.Array.toArray(null)).to.eql([]);
        expect(Luc.Array.toArray([])).to.eql([]);
        expect(Luc.Array.toArray('')).to.eql(['']);
        expect(Luc.Array.toArray([1])).to.eql([1]);
    });

    it('insert append', function() {
        var arr1 = [1, 2, 3],
            arr2 = [4, 5, 6];
        expect(Luc.Array.insert(arr1, arr2, true)).to.be.eql([1, 2, 3, 4, 5, 6]);
        expect(Luc.Array.insert(arr2, arr1, true)).to.be.eql([4, 5, 6, 1, 2, 3]);
    });

    it('insert from indexes', function() {
        var arr1 = [1, 2, 3],
            arr2 = [4, 5, 6];

            expect(Luc.Array.insert(arr1, arr2, 3)).to.be.eql([1,2,3,4,5,6]);
            expect(Luc.Array.insert(arr1, arr2, 2)).to.be.eql([1,2,4,5,6,3]);
            expect(Luc.Array.insert(arr1, arr2, 1)).to.be.eql([1,4,5,6,2,3]);
            expect(Luc.Array.insert(arr1, arr2, 0)).to.be.eql([4,5,6, 1,2,3]);

            expect(Luc.Array.insert(arr2, arr1, 3)).to.be.eql([4,5,6,1,2,3]);
            expect(Luc.Array.insert(arr2, arr1, 2)).to.be.eql([4,5,1,2,3,6]);
            expect(Luc.Array.insert(arr2, arr1, 1)).to.be.eql([4,1,2,3,5,6]);
            expect(Luc.Array.insert(arr2, arr1, 0)).to.be.eql([1,2,3,4,5,6]);

    });


    it('insert arrays are not modified', function() {
        var arr1 = [1, 2, 3],
            arr2 = [4, 5, 6];
        Luc.Array.insert(arr1, arr2, 1);
        Luc.Array.insert(arr2, arr1, 1);
        //test no modify
        expect(arr1).to.be.eql([1, 2, 3]);
        expect(arr2).to.be.eql([4, 5, 6]);
    });

    it('removeAll with single falsy', function() {
        var arr = [false, false, 0, ''];
        var ret = Luc.Array.removeAll(arr, '');

        expect(arr).to.be.eql([false, false, 0]);
        expect(ret).to.be.eql(['']);
    });

    it('removeAll all values', function() {
        var arr = [false, false, false];
        var ret = Luc.Array.removeAll(arr, false);

        expect(arr).to.be.eql([]);
        expect(ret).to.be.eql([false, false, false]);
        expect(Luc.Array.removeAll(arr, false)).to.be.eql([]);
    });

    it('removeAll loose comparison', function() {
        var arr = [{}, {a:1}, {a:1, b:2}];
        var ret = Luc.Array.removeAll(arr, {a: 1});

        expect(ret).to.be.eql([{a:1}, {a:1, b:2}]);
        expect(arr).to.be.eql([{}]);
    });

    it('removeAll deep comparison', function() {
        var arr = [{}, {a:1}, {a:1, b:2}];
        var ret = Luc.Array.removeAll(arr, {a: 1}, {type: 'deep'});

        expect(ret).to.be.eql([{a:1}]);
        expect(arr).to.be.eql([{},{a:1, b:2}]);
    });

    it('removeAllNot single falsy', function() {
        var arr = [false, false, 0, ''],
            ret = Luc.Array.removeAllNot(arr, '');

        expect(arr).to.be.eql(['']);
        expect(ret).to.be.eql([false, false, 0]);
    });

    it('removeAllNot no matches', function() {
        var arr = [false, false, false];
        var ret = Luc.Array.removeAllNot(arr, false);

        expect(arr).to.be.eql([false, false, false]);
        expect(ret).to.be.eql([]);

    });

    it('removeAllNot single loose compare', function() {
        var arr = [{}, {a:1}, {a:1, b:2}];
        var ret = Luc.Array.removeAllNot(arr, {a: 1});

        expect(arr).to.be.eql([{a:1}, {a:1, b:2}]);
        expect(ret).to.be.eql([{}]);
    });

    it('removeFirst first multi array match', function() {
        var arr = [[],[1,2], [1,2]];
        var ret = Luc.Array.removeFirst(arr, [1,2]);

        expect(arr).to.be.eql([[],[1,2]]);
        expect(ret).to.be.eql([1,2]);
        expect(Luc.Array.removeFirst(arr, [1,2])).to.be.eql([1,2]);
    });

    it('removeFirst empty array strict', function() {
        var arr = [[], [], []];
        var ret = Luc.Array.removeFirst(arr, [], {type: 'strict'});
        expect(arr).to.be.eql([[],[],[]]);
        expect(ret).to.be.eql(false);
    });

    it('removeFirst empty array shallow', function() {
        var arr = [[], [], []];
        var ret = Luc.Array.removeFirst(arr, [], {type: 'shallow'});
        expect(arr).to.be.eql([[],[]]);
        expect(ret).to.be.eql([]);
    });

    it('removeFirstNot multi array match', function() {
        var arr = [[],[1,2], [1,2]];
        var ret = Luc.Array.removeFirstNot(arr, []);

        expect(arr).to.be.eql([[],[1,2]]);
        expect(ret).to.be.eql([1,2]);
        expect(Luc.Array.removeFirstNot(arr, [1,2])).to.be.eql([]);
        expect(Luc.Array.removeFirstNot(arr, [1,2])).to.be(false);
    });

    it('removeFirstNot not matches', function() {
        var arr = [{a:1}, {a:1, b:2}, {a:1}];
        var ret = Luc.Array.removeFirstNot(arr, {a: 1});

        expect(arr).to.be.eql([{a:1}, {a:1, b:2}, {a:1}]);
        expect(ret).to.be.eql(false);
    });

    it('removeFirstNot not strict compare', function() {
        var a = {a: 1};
        var arr = [{a:1}, {a:1, b:2}, a];

        var ret = Luc.Array.removeFirstNot(arr, {a:1}, {type: 'strict'});
        expect(arr).to.be.eql([{a:1, b:2}, {a:1}]);
        expect(ret).to.be.eql({a:1});
        Luc.Array.removeFirstNot(arr, a, {type: 'strict'});
        Luc.Array.removeFirstNot(arr, a, {type: 'strict'});
        ret = Luc.Array.removeFirstNot(arr, a, {type: 'strict'});
        expect(arr).to.be.eql([{a:1}]);
        expect(ret).to.be(false);
    });

    it('findFirst handle loose compare', function() {
         var arr = [{a:1}, {a:1}, {a:1}, {a:1, b:2}];
         expect(Luc.Array.findFirst(arr, {a:1, b:2})).to.be.eql({a:1, b:2});
    });

    it('findFirst strict compare', function() {
        var arr = [{a:1}, {a:1}, {a:1}, {a:1, b:2}];
         expect(Luc.Array.findFirst(arr, {a:1, b:2}, {type: 'strict'})).to.be.eql(false);
    });

    it('findFirst match all props', function() {
        var arr = [{a:1}, {a:1}, {a:1}, {a:1, b:2}];
        expect(Luc.Array.findFirst(arr, {a:1, b:2, c:3})).to.be.eql(false);
    });

    it('findFirst all falsys', function() {
        var arr = [false, 0, undefined, null, ''];
        //shim/IE bug
        if(0 in [undefined]) {
        expect(Luc.Array.findFirst(arr, null)).to.be.eql(null);
        expect(Luc.Array.findFirst(arr, false)).to.be.eql(false);
        expect(Luc.Array.findFirst(arr, undefined)).to.be.eql(undefined);
        expect(Luc.Array.findFirst(arr, 0)).to.be.eql(0);
        }
    });

    it('findFirst dates', function() {
         var arr = [new Date(1000), new Date(1000), new Date(1001)];
         expect(Luc.Array.findFirst(arr, new Date(1001))).to.be.eql(new Date(1001));
         expect(Luc.Array.findFirst(arr, new Date(1002))).to.be(false);
    });

    it('findFirst strict and shallow dates', function() {
         var d = new Date();
         var arr = [new Date(1000), new Date(1000), d];
         expect(Luc.Array.findFirst(arr, d, {type: 'strict'})).to.be(d);
         expect(Luc.Array.findFirst(arr, d, {type: 'shallow'})).to.be(d);
    });

    it('findFirstNot matching first key value', function() {

        var arr = [{a:1}, {a:1}, {a:1}, {a:1, b:2}];
        expect(Luc.Array.findFirstNot(arr, {a:1, b:2})).to.be.eql({a:1});
    })

    it('findFirstNot falsys', function() {
        var arr = ['', '', '', null];
        expect(Luc.Array.findFirstNot(arr, null)).to.be.eql('');
        expect(Luc.Array.findFirstNot(arr, '')).to.be.eql(null);
        arr = ['', '', ''];
        expect(Luc.Array.findFirstNot(arr, '')).to.be.eql(false);
    });

    it('findFirstNot primitives and non-primitives', function(){
         expect(Luc.Array.findFirstNot([1,2,3,{}], {})).to.be(1);
    });

    it('findAll find exact object keys', function() {
        var arr = [{a:1}, {a:1}, {a:1}, {a:1, b:2}, {b:2}];
        expect(Luc.Array.findAll(arr, {a:1, b:2})).to.be.eql([{a:1, b:2}]);
        expect(Luc.Array.findAll(arr, {a:1})).to.be.eql([{a:1},{a:1},{a:1},{a:1, b:2}]);
        expect(Luc.Array.findAll(arr, {a:1, b:2}, {type: 'strict'})).to.be.eql([]);
        expect(Luc.Array.findAll(arr, {a:1, b:2, c:3})).to.be.eql([]);
    });

    it('findAll find exact array values', function() {
        var arr = [[],[1,2], [1,2]];
        expect(Luc.Array.findAll(arr, [1,2])).to.be.eql([[1,2], [1,2]]);
        expect(Luc.Array.findAll(arr, [1])).to.eql([]);
        expect(Luc.Array.findAll(arr, [2,2])).to.eql([]);
    });

    it('findAll falsy values', function() {
        var arr = [false, 0, undefined, null, ''];
        expect(Luc.Array.findAll(arr, null)).to.be.eql([null]);
        expect(Luc.Array.findAll(arr, false)).to.be.eql([false]);
        expect(Luc.Array.findAll(arr, undefined)).to.be.eql([undefined]);
        expect(Luc.Array.findAll(arr, 0)).to.be.eql([0]);
    });

    it('findAll date values', function() {
        var arr = [new Date(1000), new Date(1000), new Date(1001), false];
        expect(Luc.Array.findAll(arr, new Date(1001))).to.be.eql([new Date(1001)]);
    });

    it('findAllNot match all keys', function() {
        var arr = [{a:1}, {a:1}, {a:1}, {a:1, b:2}];
        expect(Luc.Array.findAllNot(arr, {a:1, b:2})).to.be.eql([{a:1},{a:1},{a:1}]);
    });

    it('findAllNot falsy values', function() {
        arr = ['', '', '', null];
        expect(Luc.Array.findAllNot(arr, null)).to.be.eql(['','','']);
        expect(Luc.Array.findAllNot(arr, '')).to.be.eql([null]);
        arr = ['', '', ''];
        expect(Luc.Array.findAllNot(arr, '')).to.be.eql([]);
    });

    it('dynamic findFirstNot', function() {
        expect(Luc.Array.findFirstNotFalse([false, 1])).to.be(1);
        expect(Luc.Array.findFirstNotTrue([true, 1])).to.be(1);
        expect(Luc.Array.findFirstNotNull([null, 1])).to.be(1);
        expect(Luc.Array.findFirstNotUndefined([undefined, 1])).to.be(1);
    });

    it('dynamic findAllNot', function() {
        expect(Luc.Array.findAllNotFalse([false, 1])).to.be.eql([1]);
        expect(Luc.Array.findAllNotTrue([true, 1])).to.be.eql([1]);
        expect(Luc.Array.findAllNotNull([null, 1])).to.be.eql([1]);
        expect(Luc.Array.findAllNotUndefined([undefined, 1])).to.be.eql([1]);
    });

    it('dynamic removeFirstNot', function() {
        expect(Luc.Array.removeFirstNotFalse([false, 1])).to.be(1);
        expect(Luc.Array.removeFirstNotTrue([true, 1])).to.be(1);
        expect(Luc.Array.removeFirstNotNull([null, 1])).to.be(1);
        expect(Luc.Array.removeFirstNotUndefined([undefined, 1])).to.be(1);
    });

    it('dynamic removeAllNot', function() {
        expect(Luc.Array.removeAllNotFalse([false, 1])).to.be.eql([1]);
        expect(Luc.Array.removeAllNotTrue([true, 1])).to.be.eql([1]);
        expect(Luc.Array.removeAllNotNull([null, 1])).to.be.eql([1]);
        expect(Luc.Array.removeAllNotUndefined([undefined, 1])).to.be.eql([1]);
    });

    it('dynamic removeFirst', function() {
        expect(Luc.Array.removeFirstFalse([false, 1])).to.be(false);
        expect(Luc.Array.removeFirstTrue([true, 1])).to.be(true);
        expect(Luc.Array.removeFirstNull([null, 1])).to.be(null);
        //shim/IE bug
        if(0 in [undefined]) {
            expect(Luc.Array.removeFirstUndefined([undefined, 1])).to.be(undefined);
        }
    });

    it('dynamic removeAll', function() {
        expect(Luc.Array.removeAllFalse([false, 1])).to.be.eql([false]);
        expect(Luc.Array.removeAllTrue([true, 1])).to.be.eql([true]);
        expect(Luc.Array.removeAllNull([null, 1])).to.be.eql([null]);
        expect(Luc.Array.removeAllUndefined([undefined, 1])).to.be.eql([undefined]);
    });

    it('dynamic removeLastNot', function() {
        expect(Luc.Array.removeLastNotFalse([false, 1])).to.be(1);
        expect(Luc.Array.removeLastNotTrue([true, 1])).to.be(1);
        expect(Luc.Array.removeLastNotNull([null, 1])).to.be(1);
        expect(Luc.Array.removeLastNotUndefined([undefined, 1])).to.be(1);
    });

    it('dynamic removeLast', function() {
        expect(Luc.Array.removeLastFalse([false, 1])).to.be(false);
        expect(Luc.Array.removeLastTrue([true, 1])).to.be(true);
        expect(Luc.Array.removeLastNull([null, 1])).to.be(null);
        //shim/IE bug
        if(0 in [undefined]) {
            expect(Luc.Array.removeLastUndefined([undefined, 1])).to.be(undefined);
        }
    });

    it('dynamic findLastNot', function() {
        expect(Luc.Array.findLastNotFalse([false, 1])).to.be.eql(1);
        expect(Luc.Array.findLastNotTrue([true, 1])).to.be.eql(1);
        expect(Luc.Array.findLastNotNull([null, 1])).to.be.eql(1);
        expect(Luc.Array.findLastNotUndefined([undefined, 1])).to.be.eql(1);

    });

    it('remove/find with iterator and thisArg', function() {
        var arr = [{a:1}, {a:1}, {a:1}, {a:1, b:2}];

        expect(Luc.Array.findAll(arr, function(value) {
            return this.num === value.a
        }, {
            num: 1
        })).to.be.eql([{
                a: 1
            }, {
                a: 1
            }, {
                a: 1
            }, {
                a: 1,
                b: 2
            }
        ]);

       expect(Luc.Array.findAllNot(arr, function(value) {
            return this.num === value.a
        }, {
            num: 1
        })).to.be.eql([]);
   });

     it('direct function comparison', function() {
        expect(Luc.Array.findAllNot(arr, function(){}, {type:'strict'})).to.be.eql(arr);
    });

    it('Not remove/find with iterator and thisArg', function() {
        expect(Luc.Array.findAllNot(arr, function(){
            return true
        })).to.be.eql([]);
    });

    it('find in', function() {
        expect(Luc.Array.findAllIn([1,2,3, {a:1,b:2}, {b:1}], [2,{a:1}])).to.be.eql([2,{a:1,b:2}]);
        expect(Luc.Array.findAllIn([1,2,3, {a:1,b:2}, {b:1}], [2,{a:1}], {type: 'deep'})).to.be.eql([2]);
        expect(Luc.Array.findAllIn([1,2,3, {a:1,b:2}, {b:1}], [2,{a:1}], {type: 'loose'})).to.be.eql([2,{a:1,b:2}]);
        expect(Luc.Array.findAllIn([1,2,3, {a:1,b:2}, {b:1}], [2,{a:1}], {type: 'strict'})).to.be.eql([2]);
        expect(Luc.Array.findAllIn([1,2,3], [2,3])).to.be.eql([2,3]);
        expect(Luc.Array.findFirstIn([1,2,3], [2,3])).to.be.eql(2);
        expect(Luc.Array.findLastIn([1,2,3], [2,3])).to.be.eql(3);
        expect(Luc.Array.findLastIn([1,2,3], [false, 2,3, false])).to.be.eql(3);
        expect(Luc.Array.findAllIn([1,2,3, false], [false, 2,3, false])).to.be.eql([2,3,false]);
    });

    it('last', function() {
        expect(Luc.Array.last([1,2,3])).to.be(3);
        (function(){
            expect(Luc.Array.last(arguments)).to.be(3);
        })(1,2,3)
    });

    it('from index', function() {
        expect(Luc.Array.fromIndex([1,2,3], 1)).to.be.eql([2,3]);
        (function(){
            expect(Luc.Array.fromIndex(arguments, 1)).to.be.eql([2,3]);
            expect(Luc.Array.fromIndex(arguments, 0)).to.be.eql([1,2,3]);
            expect(Luc.Array.fromIndex(arguments, 2)).to.be.eql([3]);
        })(1,2,3)
    });

    it('pluck', function() {
        expect(Luc.Array.pluck([{a:'1', b:2}, {b:3}, {b:4}], 'b')).to.be.eql([2,3,4]);
    });
});
},{"./lucTestLib":13,"expect.js":15}],7:[function(require,module,exports){
var Luc = require('./lucTestLib'),
    expect = require('expect.js');
var emitterTest = require('./common').testEmitter;
//Sanity check to make sure node components work on the browser.
describe('Luc Node functions', function() {

    it('Emitter', function() {
        emitterTest(new Luc.EventEmitter());
    });
})
},{"./common":16,"./lucTestLib":13,"expect.js":15}],8:[function(require,module,exports){
var emitterTest = require('./common').testEmitter;
var Luc = require('./lucTestLib'),
    expect = require('expect.js');


function defineClassWithAllOptions() {
    function Adder() {}

    Adder.prototype.add = function(a, b) {
        return a + b;
    };
    var A = Luc.define({
        $super: Adder,
        $statics: {
            total: 0
        },
        $mixins: {
            makeString: function(value) {
                return value + '';
            }
        },
        $compositions: {
            Constructor: Luc.EventEmitter,
            name: 'emitter',
            methods: 'allMethods'
        },
        add: function(a, b, c) {
            var two = A.$superclass.add.call(this, a, b),
                ret = two + c;

            this.emit('toString', this.makeString(ret));

            this.$class.total += ret;

            return ret;
        }
    });

    return A;
}

describe('Luc Class', function() {
    it('Base', function() {
        var b = new Luc.Base({
            a: 1,
            init: function() {
                this.a++;
            }
        });
        expect(b.a).to.be(2);
    });

    it('simple define', function() {
        var C = Luc.define({
            b: '2'
        });
        var b = new C({
            a: 1
        });
        expect(b.a).to.eql(1);
        expect(b.b).to.eql('2');
    });

    it('single mixin', function() {
        var C = Luc.define({
            $mixins: Luc.EventEmitter
        });

        var b = new C({
            a: 1
        });

        emitterTest(b);
    });

    it('multiple mixins', function() {
        var mixinObj = {
            a: function() {

            },
            prop: {}
        }, C = Luc.define({
            $mixins: [Luc.EventEmitter, mixinObj]
        }),
        c = new C();

        expect(c.a).to.be(mixinObj.a);
        expect(c.prop).to.be(mixinObj.prop);
        expect(c.emit).to.be(Luc.EventEmitter.prototype.emit);
    });

    it('statics', function() {
        var C = Luc.define({
            $statics: {
                b: 1
            }
        });

        var c = new C();

        expect(C.b).to.be(1);
        expect(c.$class.b).to.be(1);
    });

    it('test get static value', function() {
        var A = Luc.define({
            $statics: {
                a: 1
            }
        });

        var B = Luc.define({
            $super: A,
            $statics: {
                b: 2,
                c:3
            }
        });

        var C = Luc.define({
            $super: B,
            $statics: {
                a: 5
            }
        });

        var a = new A(), b = new B(), c = new C();

        expect(a.getStaticValue('a')).to.be(1);
        expect(a.getStaticValue('b')).to.be(undefined);

        expect(b.getStaticValue('a')).to.be(1);
        expect(b.getStaticValue('b')).to.be(2);
        expect(b.getStaticValue('c')).to.be(3);
        expect(b.getStaticValue('d')).to.be(undefined);

        expect(c.getStaticValue('a')).to.be(5);
        expect(c.getStaticValue('b')).to.be(2);
        expect(c.getStaticValue('c')).to.be(3);
        expect(c.getStaticValue('d')).to.be(undefined);
    });

    it('$class', function() {
        var C = Luc.define({}),
            c = new C();

        expect(c.$class).to.be(C);
    });

    it('super', function() {
        var i;
        var C = Luc.define({
            $super: Luc.EventEmitter,
            emit: function() {
                i = 0;
                C.$superclass.emit.apply(this, arguments);
            }
        });


        var c = new C({});
        emitterTest(c);
        expect(i).to.be(0);
        expect(c instanceof Luc.EventEmitter).to.be(true);
    });

    it('composition', function() {
        var EmitterParent =  Luc.define({
            $super: Luc.EventEmitter
        });

        var BaseEmitter = Luc.define({
            $compositions: [{Constructor: EmitterParent, name: 'emitter', methods: 'allMethods'}]
        });


        var base = new BaseEmitter({});
        emitterTest(base);
        expect(base instanceof Luc.EventEmitter).to.be(false);
        expect(base.events).to.be(undefined);
    });

    it('all class options together', function() {
        var AdderEmitter = defineClassWithAllOptions(),
            stringValue, result,
            adderEmit = new AdderEmitter();

        adderEmit.on('toString', function(value) {
            stringValue = value;
        });

        result = adderEmit.add(1, 2, 3);

        expect(result).to.be(6);
        expect(stringValue).to.be('6');

        adderEmit.add(3, 3, 3);

        expect(stringValue).to.be('9');

        expect(AdderEmitter.total).to.be(15);
    });

    it('class options do not get applied to the instance', function() {
        var AdderEmitter = defineClassWithAllOptions(),
            allOptions = Luc.ClassDefiner.processorKeys,
            ignoreKeys = ['$super'];

        Object.keys(allOptions).forEach(function(option) {
            if(ignoreKeys.indexOf(option) === -1) {
                expect(AdderEmitter.prototype[option]).to.be(undefined);
            }
        });
    });

    it('get composition', function() {
        function A() {}
        function B(){}
        function C(){}
        var Comps = Luc.define({
            $compositions: [{
                    Constructor: A,
                    name: 'a'
                }, {
                    Constructor: B,
                    name: 'b'
                }, {
                    Constructor: C,
                    name: 'c'
                }
            ]
        });

        var c = new Comps();

        expect(c.getComposition('a')).to.be.a(A);
        expect(c.getComposition('b')).to.be.a(B);
        expect(c.getComposition('c')).to.be.a(C);
    });

    it('initComposition before and after', function() {
        var hasABeenInited = false,
            hasBBeenInited = false,
            hasCBeenInited = false;
        function A() {
            hasABeenInited = true;
        }
        function B(){
            hasBBeenInited = true;
        }
        function C(){
            hasCBeenInited = true;
            expect(hasABeenInited).to.be(false);
            expect(hasBBeenInited).to.be(true);
        }
        var Comps = Luc.define({
            $compositions: [{
                    Constructor: A,
                    name: 'a',
                    initAfter: true
                }, {
                    Constructor: B,
                    name: 'b',
                    initAfter: false
                }, {
                    Constructor: C,
                    name: 'c'
                }
            ]
        });

        var c = new Comps();
        expect(hasCBeenInited).to.be(true);
    });

    it('test no superclass', function() {
        var NoSuper = Luc.define({
            $super: false,
            $statics: {
                total: 0
            },
            $mixins: {
                makeString: function(value) {
                    return value + '';
                }
            },
            $compositions: {
                defaults : Luc.compositionEnums.EventEmitter
            }
        });

        var NoSuperNoComp = Luc.define({
            $super: false,
            $statics: {
                total: 0
            },
            $mixins: {
                makeString: function(value) {
                    return value + '';
                }
            }
        });

        var noSuper = new NoSuper();
        expect(new  NoSuperNoComp().makeString(noSuper.$class.total)).to.be('0');
        expect(noSuper.makeString(noSuper.$class.total)).to.be('0');
        emitterTest(noSuper);
        expect(noSuper).to.not.be.a(Luc.Base);
        expect(noSuper.$superclass).to.be(undefined);
    });

    it('test composition validation', function() {
        function defineNoName() {
            Luc.define({
                $compositions: {
                    Constructor: Luc.EventEmitter
                }
            });
        }
        function defineNoConstructor() {
            Luc.define({
                $compositions: {
                    name: 'a'
                }
            });
        }
        expect(defineNoName).to.throwException();

        expect(defineNoConstructor).to.throwException();
    });

    it('test default plugin composition', function() {
        var testIntance,
        ClassWithPlugins = Luc.define({
            $compositions: {
                defaults: Luc.compositionEnums.PluginManager
            }
        });

        var c = new ClassWithPlugins({
            plugins: [{
                    init: function(instance) {
                        testInstance = instance;
                    },
                    destroy: function(){

                    },
                    name: 'myPlugin'
                }
            ]
        });

        expect(testInstance).to.be(c);
        expect(c.getPlugin(Luc.Plugin)).to.be.a(Luc.Plugin);
        expect(c.getPlugin({name: 'myPlugin'})).to.be.a(Luc.Plugin);
        c.destroyPlugin({name: 'myPlugin'});
        expect(c.getPlugin(Luc.Plugin)).to.be(false);
        var ret = c.addPlugin({name: 'myPlugin'});
        expect(ret).to.be.a(Luc.Plugin);

        function A(){

        }
        ret = c.addPlugin({Constructor: A, name: 'myPlugin'});
        expect(ret).to.be.a(A);
    });

    it('test configured plugin constructors', function() {
        var testIntance,
            ConfiguredPlugin = function(config) {
                this.myOwner = config.owner;
            },
            ClassWithPlugins = Luc.define({
                $compositions: {
                    defaults: Luc.compositionEnums.PluginManager
                }
            });

        var c = new ClassWithPlugins({
            plugins: [{}, {
                    Constructor: ConfiguredPlugin
                }
            ]
        });

        expect(c.getComposition('plugins').plugins[0]).to.be.a(Luc.Plugin);
        var configedPlugin = c.getComposition('plugins').plugins[1];
        expect(configedPlugin).to.be.a(ConfiguredPlugin);
        expect(configedPlugin.myOwner).to.be(c);
    });

    it('test default plugin destroy', function() {
        var testValue = false,
        ClassWithPlugins = Luc.define({
            $compositions: {
                defaults: Luc.compositionEnums.PluginManager
            }
        });

        var c = new ClassWithPlugins({
            plugins: [{
                    destroy: function() {
                        testValue = true;
                    }
                }, {}
            ]
        });

        expect(testValue).to.be(false);
        c.destroyAllPlugins();
        expect(testValue).to.be(true);
    });

    it('after define', function() {
        var testValue = false,
            hasBeenCalled = false,
            afterDefine = function(Constructor) {
                expect(Constructor.a).to.be.eql([1]);
                hasBeenCalled = true;
            },
            C = Luc.define({
                $statics: {
                    a: [1]
                }
            }, afterDefine);


        expect(hasBeenCalled).to.be(true);
    });

    describe('callSuperMethod', function(){

        it('callSuperMethod', function() {
            var A = Luc.define({
                add: function(a, b, c) {
                    return a + b + c;
                }
            });

            var B = Luc.define({
                $super: A,
                add: function(a, b, c) {
                    return this.callSuper(arguments) + 5;
                }
            });

            var C = Luc.define({
                $super: B,
                add: function(a, b, c) {
                    return this.callSuper(arguments);
                }
            });

            var D = Luc.define({
                $super: A,
                add: function(a, b, c) {
                    return this.callSuper(arguments);
                }
            });

            var E = Luc.define({
                $super: C,
                add: function(a, b, c) {
                    return this.callSuper(arguments) + 10;
                },
                noSuper: function() {
                    this.callSuper();
                }
            });

           
            var c = new C();
            var d = new D();
            var e = new E();

            expect(d.add(1, 2, 3)).to.be(6);
            expect(c.add(1, 2, 3)).to.be(11);
            expect(e.add(1, 2, 3)).to.be(21);


            B.prototype.add = function() {
                return this.callSuper(arguments);
            };

            expect(e.add(1, 2, 3)).to.be(16);

            expect(function() {
                e.noSuper();
            }).to.throwException();
        });

    });
});





},{"./common":16,"./lucTestLib":13,"expect.js":15}],9:[function(require,module,exports){
var Luc = require('./lucTestLib'),
    expect = require('expect.js');

describe('Luc is', function() {

    it('isArray', function() {
        expect(Luc.isArray({})).to.be(false);
        expect(Luc.isArray([])).to.be(true);
    });

    it('isRegExp', function() {
        expect(Luc.isRegExp({})).to.be(false);
        expect(Luc.isRegExp(new RegExp())).to.be(true);
    });

    it('isDate', function() {
        expect(Luc.isDate({})).to.be(false);
        expect(Luc.isDate(new Date())).to.be(true);
    });

    it('isString', function() {
        expect(Luc.isString({})).to.be(false);
        expect(Luc.isString(new String())).to.be(true);
        expect(Luc.isString('')).to.be(true);
    });

    it('isObject', function() {
        expect(Luc.isObject({})).to.be(true);
        expect(Luc.isObject([])).to.be(false);
    });

    it('isNumber', function() {
        expect(Luc.isNumber({})).to.be(false);
        expect(Luc.isNumber(0)).to.be(true);
    });

    it('isFunction', function() {
        expect(Luc.isFunction({})).to.be(false);
        expect(Luc.isFunction(new Function())).to.be(true);
        expect(Luc.isFunction(function(){})).to.be(true);
    });

    it('isFalsy', function() {
        expect(Luc.isFalsy(0)).to.be(false);
        expect(Luc.isFalsy('')).to.be(true);
        expect(Luc.isFalsy(undefined)).to.be(true);
        expect(Luc.isFalsy(null)).to.be(true);
        expect(Luc.isFalsy(false)).to.be(true);
        expect(Luc.isFalsy(NaN)).to.be(true);
        expect(Luc.isFalsy({})).to.be(false);
    });

    it('isEmpty', function() {
        expect(Luc.isEmpty(0)).to.be(false);
        expect(Luc.isEmpty('')).to.be(true);
        expect(Luc.isEmpty(undefined)).to.be(true);
        expect(Luc.isEmpty(null)).to.be(true);
        expect(Luc.isEmpty(false)).to.be(true);

        expect(Luc.isEmpty([])).to.be(true);
        expect(Luc.isEmpty({})).to.be(true);

        expect(Luc.isEmpty([0])).to.be(false);
        expect(Luc.isEmpty({0:0})).to.be(false);
    });

    it('isArguments', function() {
        expect(Luc.isArguments({})).to.be(false);
        expect(Luc.isArguments([])).to.be(false);
        (function(){
            expect(Luc.isArguments(arguments)).to.be(true);
        }());
        
    });
});
},{"./lucTestLib":13,"expect.js":15}],10:[function(require,module,exports){
var Luc = require('./lucTestLib'),
    expect = require('expect.js'),
    arraySlice = Array.prototype.slice;

describe('Luc Function utilities', function() {

    
        function testFn() {
            var arr = arraySlice.call(arguments);
            return this.str + arr.join('');
        }

    it('create augmentor append and this', function() {

        var appendAndThis = Luc.Function.createAugmenter(testFn, {
            thisArg: {
                str: '1'
            },
            args: [4, 5],
            index: true
        });

        expect(appendAndThis(2, 3)).to.be('12345');
    });

    it('create augmentor thisArg with append after', function() {
        var appendAndThisArgumentsAfter = Luc.Function.createAugmenter(testFn, {
            thisArg: {
                str: '1'
            },
            args: [4, 5],
            index: true,
            argumentsFirst: false
        });

        expect(appendAndThisArgumentsAfter(2,3)).to.be('14523');
    });

    it('create augmentor thisArg index and args after', function() {
        var argumentsAfter = Luc.Function.createAugmenter(testFn, {
            thisArg: {
                str: '1'
            },
            args: [4, 5],
            index: 1,
            argumentsFirst: false
        });

        expect(argumentsAfter(2,3)).to.be('14235');
    });

    it('create augmentor this arg and default insert args', function() {
        var argumentsInsert = Luc.Function.createAugmenter(testFn, {
            thisArg: {
                str: '1'
            },
            args: [4, 5],
            index: 1
        });

        expect(argumentsInsert(2,3)).to.be('12453');
    });

    it('create augmentor default insert args', function() {
        var noThisArg = Luc.Function.createAugmenter(testFn, {
            args: [4, 5],
            index: 1
        });

        expect(noThisArg.apply({str: '2'},[2,3])).to.be('22453');
    });

    it('create augmentor just arguments', function() {
        var justArgs = Luc.Function.createAugmenter(testFn, {
            args: [4, 5]
        });

        expect(justArgs.apply({str: '2'},[2,3])).to.be('245');
    });

    it('create sequence', function() {
        var hasRun1, hasRun2, hasRun3;

        var sequenced = Luc.Function.createSequence([
            function() {
                hasRun1 = true;
            },
            function() {
                hasRun2 = true;
            },
            function() {
                hasRun3 = true;
                return true;
            }
        ]);

        var ret = sequenced();

        expect(hasRun1).to.be(true);
        expect(hasRun2).to.be(true);
        expect(hasRun3).to.be(true);
        expect(ret).to.be(true);
    });

    it('create sequence augmentor config', function() {
        var hasRun1, hasRun2, hasRun3;

        var sequenced = Luc.Function.createSequence([
            function(a,b) {
                expect(a).to.be(1);
                expect(b).to.be(2);
                hasRun1 = true;
            },
            function() {
                hasRun2 = true;
            },
            function() {
                hasRun3 = true;
                return this;
            }
        ],{
            thisArg: {
                a: 1
            }
        });

        var ret = sequenced(1,2);

        expect(hasRun1).to.be(true);
        expect(hasRun2).to.be(true);
        expect(hasRun3).to.be(true);
        expect(ret).to.eql({a:1});
    });

    it('create sequenceIf', function() {
        var hasRun1, hasRun2, hasRun3;

        var sequenced = Luc.Function.createSequenceIf([
            function(a,b) {
                expect(a).to.be(1);
                 expect(b).to.be(2);
                hasRun1 = true;
            },
            function() {
                hasRun2 = true;
                return false;
            },
            function() {
                hasRun3 = true;
                return this;
            }
        ],{
            thisArg: {
                a: 1
            }
        });

        var ret = sequenced(1,2);

        expect(hasRun1).to.be(true);
        expect(hasRun2).to.be(true);
        expect(hasRun3).to.be(undefined);
        expect(ret).to.be(false);
    });

    it('create relayer', function() {
        var sequenced = Luc.Function.createRelayer([
            function(a,b,c) {
                return a + b + c;
            },
            //acb, b
            function(a,b) {
                return a + a + b + b;
            },
            //acbacbbb, b
            function(a,b) {
                return b + a;
            }
        ],{
            args: ['b'],
            index: true
        });

        var ret = sequenced('a', 'c');

        expect(ret).to.be('bacbacbbb');
    });

    it('create deferred', function(done) {
        var hasDefered = false;
        var deferred = Luc.Function.createDeferred(function(a,b){
            hasDefered = true;
            expect(a).to.be(1);
            expect(b).to.be(2);
            done();

        }, 1, {
            args: [2],
            index: true
        });

        deferred(1);

        expect(hasDefered).to.be(false);
    });

    it('create deferred no millis', function(done) {
        var hasDefered = false;
        var deferred = Luc.Function.createDeferred(function(a,b){
            hasDefered = true;
            expect(a).to.be(1);
            expect(b).to.be(undefined);
            done();
        }, 0);

        deferred(1);

        expect(hasDefered).to.be(true);
    });

    it('create throtteled no millis', function(done) {
        var hasDefered = false;
        var deferred = Luc.Function.createThrottled(function(a,b){
            hasDefered = true;
            expect(a).to.be(1);
            expect(b).to.be(undefined);
            done();
        }, 0);

        deferred(1);

        expect(hasDefered).to.be(true);
    });

    it('create throtteled', function(done) {
        var callCount = 0;
        var throttled = Luc.Function.createThrottled(function(a,b,c){
            callCount++;
            expect(a).to.be(1);
            expect(b).to.be(3);
            expect(c).to.be(2);
            expect(callCount).to.be(1);
            done();

        }, 1, {
            args: [3],
            index: 1
        });

        for(var i = 0; i < 200; ++i) {
            throttled(1);
        }

        throttled(1,2);

        expect(callCount).to.be(0);
    });


});
},{"./lucTestLib":13,"expect.js":15}],11:[function(require,module,exports){
var Luc = require('./lucTestLib'),
    expect = require('expect.js');

describe('Luc compare fn', function() {

    it('compare empty objects', function() {
        expect(Luc.compare({}, {})).to.be(true);
        expect(Luc.compare([], [])).to.be(true);
        expect(Luc.compare(new Date(1000), new Date(1000))).to.be(true);
        expect(Luc.compare(new Date(1000), new Date(1001))).to.be(false);
    });

    it('compare values', function() {
        expect(Luc.compare({}, {
            a: 1
        })).to.be(false);

        expect(Luc.compare({
            a: 1
        }, {
            a: 1
        })).to.be(true);

        expect(Luc.compare({
            a: 1,
            b: 1
        }, {
            a: 1
        })).to.be(false);
    });


    it('compare different object types', function() {
        expect(Luc.compare(new Date(10000), {})).to.be(false);
        expect(Luc.compare(new Date(10000), undefined)).to.be(false);
        expect(Luc.compare(new Date(10000), [])).to.be(false);

    });

    it('compare falsys', function() {
        expect(Luc.compare(false, false)).to.be(true);
        expect(Luc.compare(0, false)).to.be(false);
        expect(Luc.compare('', false)).to.be(false);
        expect(Luc.compare(null, false)).to.be(false);
        expect(Luc.compare(undefined, false)).to.be(false);
        expect(Luc.compare(NaN, false)).to.be(false);
        expect(Luc.compare([], [1], {type: 'deep'})).to.be(false);
    });

    it('deep compare', function() { 
        var deepTrue = Luc.compare({
            a: {
                a: 1
            },
            b: [1, 'a', new Date(1000), {
                    a: {
                        a: {
                            a: true,
                            b: undefined
                        }
                    }
                }
            ]
        }, {
            a: {
                a: 1
            },
            b: [1, 'a', new Date(1000), {
                    a: {
                        a: {
                            a: true,
                            b: undefined
                        }
                    }
                }
            ]
        }, {
            type: 'deep'
        });

        var deepFalse = Luc.compare({
            a: {
                a: 1
            },
            b: [1, 'a', new Date(1000), {
                    a: {
                        a: {
                            a: true,
                            b: undefined
                        }
                    }
                }
            ]
        }, {
            a: {
                a: 1
            },
            b: [1, 'a', new Date(1000), {
                    a: {
                        a: {
                            a: true,
                            b: undefined,
                            c: undefined
                        }
                    }
                }
            ]
        }, {
            type: 'deep'
        });

        expect(deepTrue).to.be(true);
        expect(deepFalse).to.be(false);
        })

    it('simple deep and shallow compare', function() {
        expect(Luc.compare({a:1}, {a:1}, {type: 'shallow'})).to.be(true);
        expect(Luc.compare({a:1, b: {}}, {a:1, b: {}}, {type: 'shallow'})).to.be(false);
        expect(Luc.compare({a:1}, {a:1}, {type: 'deep'})).to.be(true);
        expect(Luc.compare({a:1, b: {}}, {a:1, b: {}}, {type: 'deep'})).to.be(true);
        expect(Luc.compare({a:1}, {a:1}, {type: 'strict'})).to.be(false);

    });

    it('invalid type throws an exception', function() {
        var invalidType = function(){
            Luc.compare(true, true, {type: 'deeeeep'});
        };
        expect(invalidType).to.throwException();
    });

    it('loose compare', function() {
        expect(Luc.compare(new Date(10000), {}), {type: 'loose'}).to.be(false);
        expect(Luc.compare({}, new Date(10000)), {type: 'loose'}).to.be(false);

        expect(Luc.compare({a:1}, {a:1, b:2}, {type: 'loose'})).to.be(true);
        expect(Luc.compare({a:1}, {a:2}, {type: 'loose'})).to.be(false);

        expect(Luc.compare(1, {a:2}, {type: 'loose'})).to.be(false);
        expect(Luc.compare({a:1}, 1, {type: 'loose'})).to.be(false);

        expect(Luc.compare([{a:1}], [{a:1, b:2}], {type: 'loose'})).to.be(true);
        expect(Luc.compare([{a:1}, 1], [{a:1, b:2}], {type: 'loose'})).to.be(false);
        expect(Luc.compare([{a:1}, 1], [{a:1, b:2}, 1], {type: 'loose'})).to.be(true);
        expect(Luc.compare([{a:1}, 1], [{a:1, b:2}, 2], {type: 'loose'})).to.be(false);
    })
});
},{"./lucTestLib":13,"expect.js":15}],12:[function(require,module,exports){
var Luc = require('./lucTestLib'),
    expect = require('expect.js');

describe('Luc submodule', function() {
    var sub = {
        a: 1,
        b: 2
    },
    namespace = 'testSub';
    
    afterEach(function() {
        delete Luc[namespace];
    });

    it('module added', function() {
        Luc.addSubmodule(namespace, sub);

        if (typeof window !== 'undefined') {
            expect(Luc[namespace]).to.be.eql({
                a: 1,
                b: 2
            });
        } else {
            expect(Luc[namespace]).to.be(undefined);
        }
    });

    it('alwaysAddSubmodule', function() {
        Luc.alwaysAddSubmodule = true;
        Luc.addSubmodule(namespace, sub);

        expect(Luc[namespace]).to.be.eql({
            a: 1,
            b: 2
        });
    });
});
},{"./lucTestLib":13,"expect.js":15}],17:[function(require,module,exports){
require=(function(e,t,n,r){function i(r){if(!n[r]){if(!t[r]){if(e)return e(r);throw new Error("Cannot find module '"+r+"'")}var s=n[r]={exports:{}};t[r][0](function(e){var n=t[r][1][e];return i(n?n:e)},s,s.exports)}return n[r].exports}for(var s=0;s<r.length;s++)i(r[s]);return i})(typeof require!=="undefined"&&require,{1:[function(require,module,exports){
// UTILITY
var util = require('util');
var Buffer = require("buffer").Buffer;
var pSlice = Array.prototype.slice;

function objectKeys(object) {
  if (Object.keys) return Object.keys(object);
  var result = [];
  for (var name in object) {
    if (Object.prototype.hasOwnProperty.call(object, name)) {
      result.push(name);
    }
  }
  return result;
}

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.message = options.message;
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  var stackStartFunction = options.stackStartFunction || fail;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  }
};
util.inherits(assert.AssertionError, Error);

function replacer(key, value) {
  if (value === undefined) {
    return '' + value;
  }
  if (typeof value === 'number' && (isNaN(value) || !isFinite(value))) {
    return value.toString();
  }
  if (typeof value === 'function' || value instanceof RegExp) {
    return value.toString();
  }
  return value;
}

function truncate(s, n) {
  if (typeof s == 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}

assert.AssertionError.prototype.toString = function() {
  if (this.message) {
    return [this.name + ':', this.message].join(' ');
  } else {
    return [
      this.name + ':',
      truncate(JSON.stringify(this.actual, replacer), 128),
      this.operator,
      truncate(JSON.stringify(this.expected, replacer), 128)
    ].join(' ');
  }
};

// assert.AssertionError instanceof Error

assert.AssertionError.__proto__ = Error.prototype;

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!!!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

function _deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (Buffer.isBuffer(actual) && Buffer.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }

    return true;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (actual instanceof Date && expected instanceof Date) {
    return actual.getTime() === expected.getTime();

  // 7.3. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (typeof actual != 'object' && typeof expected != 'object') {
    return actual == expected;

  // 7.4. For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isUndefinedOrNull(value) {
  return value === null || value === undefined;
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b) {
  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  try {
    var ka = objectKeys(a),
        kb = objectKeys(b),
        key, i;
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key])) return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (expected instanceof RegExp) {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if (expected.call({}, actual) === true) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch (e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail('Missing expected exception' + message);
  }

  if (!shouldThrow && expectedException(actual, expected)) {
    fail('Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

assert.ifError = function(err) { if (err) {throw err;}};

},{"util":2,"buffer":3}],2:[function(require,module,exports){
var events = require('events');

exports.isArray = isArray;
exports.isDate = function(obj){return Object.prototype.toString.call(obj) === '[object Date]'};
exports.isRegExp = function(obj){return Object.prototype.toString.call(obj) === '[object RegExp]'};


exports.print = function () {};
exports.puts = function () {};
exports.debug = function() {};

exports.inspect = function(obj, showHidden, depth, colors) {
  var seen = [];

  var stylize = function(str, styleType) {
    // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
    var styles =
        { 'bold' : [1, 22],
          'italic' : [3, 23],
          'underline' : [4, 24],
          'inverse' : [7, 27],
          'white' : [37, 39],
          'grey' : [90, 39],
          'black' : [30, 39],
          'blue' : [34, 39],
          'cyan' : [36, 39],
          'green' : [32, 39],
          'magenta' : [35, 39],
          'red' : [31, 39],
          'yellow' : [33, 39] };

    var style =
        { 'special': 'cyan',
          'number': 'blue',
          'boolean': 'yellow',
          'undefined': 'grey',
          'null': 'bold',
          'string': 'green',
          'date': 'magenta',
          // "name": intentionally not styling
          'regexp': 'red' }[styleType];

    if (style) {
      return '\033[' + styles[style][0] + 'm' + str +
             '\033[' + styles[style][1] + 'm';
    } else {
      return str;
    }
  };
  if (! colors) {
    stylize = function(str, styleType) { return str; };
  }

  function format(value, recurseTimes) {
    // Provide a hook for user-specified inspect functions.
    // Check that value is an object with an inspect function on it
    if (value && typeof value.inspect === 'function' &&
        // Filter out the util module, it's inspect function is special
        value !== exports &&
        // Also filter out any prototype objects using the circular check.
        !(value.constructor && value.constructor.prototype === value)) {
      return value.inspect(recurseTimes);
    }

    // Primitive types cannot have properties
    switch (typeof value) {
      case 'undefined':
        return stylize('undefined', 'undefined');

      case 'string':
        var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                                 .replace(/'/g, "\\'")
                                                 .replace(/\\"/g, '"') + '\'';
        return stylize(simple, 'string');

      case 'number':
        return stylize('' + value, 'number');

      case 'boolean':
        return stylize('' + value, 'boolean');
    }
    // For some reason typeof null is "object", so special case here.
    if (value === null) {
      return stylize('null', 'null');
    }

    // Look up the keys of the object.
    var visible_keys = Object_keys(value);
    var keys = showHidden ? Object_getOwnPropertyNames(value) : visible_keys;

    // Functions without properties can be shortcutted.
    if (typeof value === 'function' && keys.length === 0) {
      if (isRegExp(value)) {
        return stylize('' + value, 'regexp');
      } else {
        var name = value.name ? ': ' + value.name : '';
        return stylize('[Function' + name + ']', 'special');
      }
    }

    // Dates without properties can be shortcutted
    if (isDate(value) && keys.length === 0) {
      return stylize(value.toUTCString(), 'date');
    }

    var base, type, braces;
    // Determine the object type
    if (isArray(value)) {
      type = 'Array';
      braces = ['[', ']'];
    } else {
      type = 'Object';
      braces = ['{', '}'];
    }

    // Make functions say that they are functions
    if (typeof value === 'function') {
      var n = value.name ? ': ' + value.name : '';
      base = (isRegExp(value)) ? ' ' + value : ' [Function' + n + ']';
    } else {
      base = '';
    }

    // Make dates with properties first say the date
    if (isDate(value)) {
      base = ' ' + value.toUTCString();
    }

    if (keys.length === 0) {
      return braces[0] + base + braces[1];
    }

    if (recurseTimes < 0) {
      if (isRegExp(value)) {
        return stylize('' + value, 'regexp');
      } else {
        return stylize('[Object]', 'special');
      }
    }

    seen.push(value);

    var output = keys.map(function(key) {
      var name, str;
      if (value.__lookupGetter__) {
        if (value.__lookupGetter__(key)) {
          if (value.__lookupSetter__(key)) {
            str = stylize('[Getter/Setter]', 'special');
          } else {
            str = stylize('[Getter]', 'special');
          }
        } else {
          if (value.__lookupSetter__(key)) {
            str = stylize('[Setter]', 'special');
          }
        }
      }
      if (visible_keys.indexOf(key) < 0) {
        name = '[' + key + ']';
      }
      if (!str) {
        if (seen.indexOf(value[key]) < 0) {
          if (recurseTimes === null) {
            str = format(value[key]);
          } else {
            str = format(value[key], recurseTimes - 1);
          }
          if (str.indexOf('\n') > -1) {
            if (isArray(value)) {
              str = str.split('\n').map(function(line) {
                return '  ' + line;
              }).join('\n').substr(2);
            } else {
              str = '\n' + str.split('\n').map(function(line) {
                return '   ' + line;
              }).join('\n');
            }
          }
        } else {
          str = stylize('[Circular]', 'special');
        }
      }
      if (typeof name === 'undefined') {
        if (type === 'Array' && key.match(/^\d+$/)) {
          return str;
        }
        name = JSON.stringify('' + key);
        if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
          name = name.substr(1, name.length - 2);
          name = stylize(name, 'name');
        } else {
          name = name.replace(/'/g, "\\'")
                     .replace(/\\"/g, '"')
                     .replace(/(^"|"$)/g, "'");
          name = stylize(name, 'string');
        }
      }

      return name + ': ' + str;
    });

    seen.pop();

    var numLinesEst = 0;
    var length = output.reduce(function(prev, cur) {
      numLinesEst++;
      if (cur.indexOf('\n') >= 0) numLinesEst++;
      return prev + cur.length + 1;
    }, 0);

    if (length > 50) {
      output = braces[0] +
               (base === '' ? '' : base + '\n ') +
               ' ' +
               output.join(',\n  ') +
               ' ' +
               braces[1];

    } else {
      output = braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
    }

    return output;
  }
  return format(obj, (typeof depth === 'undefined' ? 2 : depth));
};


function isArray(ar) {
  return ar instanceof Array ||
         Array.isArray(ar) ||
         (ar && ar !== Object.prototype && isArray(ar.__proto__));
}


function isRegExp(re) {
  return re instanceof RegExp ||
    (typeof re === 'object' && Object.prototype.toString.call(re) === '[object RegExp]');
}


function isDate(d) {
  if (d instanceof Date) return true;
  if (typeof d !== 'object') return false;
  var properties = Date.prototype && Object_getOwnPropertyNames(Date.prototype);
  var proto = d.__proto__ && Object_getOwnPropertyNames(d.__proto__);
  return JSON.stringify(proto) === JSON.stringify(properties);
}

function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}

exports.log = function (msg) {};

exports.pump = null;

var Object_keys = Object.keys || function (obj) {
    var res = [];
    for (var key in obj) res.push(key);
    return res;
};

var Object_getOwnPropertyNames = Object.getOwnPropertyNames || function (obj) {
    var res = [];
    for (var key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) res.push(key);
    }
    return res;
};

var Object_create = Object.create || function (prototype, properties) {
    // from es5-shim
    var object;
    if (prototype === null) {
        object = { '__proto__' : null };
    }
    else {
        if (typeof prototype !== 'object') {
            throw new TypeError(
                'typeof prototype[' + (typeof prototype) + '] != \'object\''
            );
        }
        var Type = function () {};
        Type.prototype = prototype;
        object = new Type();
        object.__proto__ = prototype;
    }
    if (typeof properties !== 'undefined' && Object.defineProperties) {
        Object.defineProperties(object, properties);
    }
    return object;
};

exports.inherits = function(ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = Object_create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
};

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (typeof f !== 'string') {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(exports.inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j': return JSON.stringify(args[i++]);
      default:
        return x;
    }
  });
  for(var x = args[i]; i < len; x = args[++i]){
    if (x === null || typeof x !== 'object') {
      str += ' ' + x;
    } else {
      str += ' ' + exports.inspect(x);
    }
  }
  return str;
};

},{"events":4}],5:[function(require,module,exports){
exports.readIEEE754 = function(buffer, offset, isBE, mLen, nBytes) {
  var e, m,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = isBE ? 0 : (nBytes - 1),
      d = isBE ? 1 : -1,
      s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity);
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.writeIEEE754 = function(buffer, value, offset, isBE, mLen, nBytes) {
  var e, m, c,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = isBE ? (nBytes - 1) : 0,
      d = isBE ? -1 : 1,
      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

  buffer[offset + i - d] |= s * 128;
};

},{}],6:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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
},{"__browserify_process":6}],"buffer-browserify":[function(require,module,exports){
module.exports=require('q9TxCC');
},{}],"q9TxCC":[function(require,module,exports){
function SlowBuffer (size) {
    this.length = size;
};

var assert = require('assert');

exports.INSPECT_MAX_BYTES = 50;


function toHex(n) {
  if (n < 16) return '0' + n.toString(16);
  return n.toString(16);
}

function utf8ToBytes(str) {
  var byteArray = [];
  for (var i = 0; i < str.length; i++)
    if (str.charCodeAt(i) <= 0x7F)
      byteArray.push(str.charCodeAt(i));
    else {
      var h = encodeURIComponent(str.charAt(i)).substr(1).split('%');
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16));
    }

  return byteArray;
}

function asciiToBytes(str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++ )
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push( str.charCodeAt(i) & 0xFF );

  return byteArray;
}

function base64ToBytes(str) {
  return require("base64-js").toByteArray(str);
}

SlowBuffer.byteLength = function (str, encoding) {
  switch (encoding || "utf8") {
    case 'hex':
      return str.length / 2;

    case 'utf8':
    case 'utf-8':
      return utf8ToBytes(str).length;

    case 'ascii':
    case 'binary':
      return str.length;

    case 'base64':
      return base64ToBytes(str).length;

    default:
      throw new Error('Unknown encoding');
  }
};

function blitBuffer(src, dst, offset, length) {
  var pos, i = 0;
  while (i < length) {
    if ((i+offset >= dst.length) || (i >= src.length))
      break;

    dst[i + offset] = src[i];
    i++;
  }
  return i;
}

SlowBuffer.prototype.utf8Write = function (string, offset, length) {
  var bytes, pos;
  return SlowBuffer._charsWritten =  blitBuffer(utf8ToBytes(string), this, offset, length);
};

SlowBuffer.prototype.asciiWrite = function (string, offset, length) {
  var bytes, pos;
  return SlowBuffer._charsWritten =  blitBuffer(asciiToBytes(string), this, offset, length);
};

SlowBuffer.prototype.binaryWrite = SlowBuffer.prototype.asciiWrite;

SlowBuffer.prototype.base64Write = function (string, offset, length) {
  var bytes, pos;
  return SlowBuffer._charsWritten = blitBuffer(base64ToBytes(string), this, offset, length);
};

SlowBuffer.prototype.base64Slice = function (start, end) {
  var bytes = Array.prototype.slice.apply(this, arguments)
  return require("base64-js").fromByteArray(bytes);
}

function decodeUtf8Char(str) {
  try {
    return decodeURIComponent(str);
  } catch (err) {
    return String.fromCharCode(0xFFFD); // UTF 8 invalid char
  }
}

SlowBuffer.prototype.utf8Slice = function () {
  var bytes = Array.prototype.slice.apply(this, arguments);
  var res = "";
  var tmp = "";
  var i = 0;
  while (i < bytes.length) {
    if (bytes[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(bytes[i]);
      tmp = "";
    } else
      tmp += "%" + bytes[i].toString(16);

    i++;
  }

  return res + decodeUtf8Char(tmp);
}

SlowBuffer.prototype.asciiSlice = function () {
  var bytes = Array.prototype.slice.apply(this, arguments);
  var ret = "";
  for (var i = 0; i < bytes.length; i++)
    ret += String.fromCharCode(bytes[i]);
  return ret;
}

SlowBuffer.prototype.binarySlice = SlowBuffer.prototype.asciiSlice;

SlowBuffer.prototype.inspect = function() {
  var out = [],
      len = this.length;
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i]);
    if (i == exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...';
      break;
    }
  }
  return '<SlowBuffer ' + out.join(' ') + '>';
};


SlowBuffer.prototype.hexSlice = function(start, end) {
  var len = this.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  var out = '';
  for (var i = start; i < end; i++) {
    out += toHex(this[i]);
  }
  return out;
};


SlowBuffer.prototype.toString = function(encoding, start, end) {
  encoding = String(encoding || 'utf8').toLowerCase();
  start = +start || 0;
  if (typeof end == 'undefined') end = this.length;

  // Fastpath empty strings
  if (+end == start) {
    return '';
  }

  switch (encoding) {
    case 'hex':
      return this.hexSlice(start, end);

    case 'utf8':
    case 'utf-8':
      return this.utf8Slice(start, end);

    case 'ascii':
      return this.asciiSlice(start, end);

    case 'binary':
      return this.binarySlice(start, end);

    case 'base64':
      return this.base64Slice(start, end);

    case 'ucs2':
    case 'ucs-2':
      return this.ucs2Slice(start, end);

    default:
      throw new Error('Unknown encoding');
  }
};


SlowBuffer.prototype.hexWrite = function(string, offset, length) {
  offset = +offset || 0;
  var remaining = this.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = +length;
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  if (strLen % 2) {
    throw new Error('Invalid hex string');
  }
  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(byte)) throw new Error('Invalid hex string');
    this[offset + i] = byte;
  }
  SlowBuffer._charsWritten = i * 2;
  return i;
};


SlowBuffer.prototype.write = function(string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length;
      length = undefined;
    }
  } else {  // legacy
    var swap = encoding;
    encoding = offset;
    offset = length;
    length = swap;
  }

  offset = +offset || 0;
  var remaining = this.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = +length;
    if (length > remaining) {
      length = remaining;
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase();

  switch (encoding) {
    case 'hex':
      return this.hexWrite(string, offset, length);

    case 'utf8':
    case 'utf-8':
      return this.utf8Write(string, offset, length);

    case 'ascii':
      return this.asciiWrite(string, offset, length);

    case 'binary':
      return this.binaryWrite(string, offset, length);

    case 'base64':
      return this.base64Write(string, offset, length);

    case 'ucs2':
    case 'ucs-2':
      return this.ucs2Write(string, offset, length);

    default:
      throw new Error('Unknown encoding');
  }
};


// slice(start, end)
SlowBuffer.prototype.slice = function(start, end) {
  if (end === undefined) end = this.length;

  if (end > this.length) {
    throw new Error('oob');
  }
  if (start > end) {
    throw new Error('oob');
  }

  return new Buffer(this, end - start, +start);
};

SlowBuffer.prototype.copy = function(target, targetstart, sourcestart, sourceend) {
  var temp = [];
  for (var i=sourcestart; i<sourceend; i++) {
    assert.ok(typeof this[i] !== 'undefined', "copying undefined buffer bytes!");
    temp.push(this[i]);
  }

  for (var i=targetstart; i<targetstart+temp.length; i++) {
    target[i] = temp[i-targetstart];
  }
};

SlowBuffer.prototype.fill = function(value, start, end) {
  if (end > this.length) {
    throw new Error('oob');
  }
  if (start > end) {
    throw new Error('oob');
  }

  for (var i = start; i < end; i++) {
    this[i] = value;
  }
}

function coerce(length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length);
  return length < 0 ? 0 : length;
}


// Buffer

function Buffer(subject, encoding, offset) {
  if (!(this instanceof Buffer)) {
    return new Buffer(subject, encoding, offset);
  }

  var type;

  // Are we slicing?
  if (typeof offset === 'number') {
    this.length = coerce(encoding);
    this.parent = subject;
    this.offset = offset;
  } else {
    // Find the length
    switch (type = typeof subject) {
      case 'number':
        this.length = coerce(subject);
        break;

      case 'string':
        this.length = Buffer.byteLength(subject, encoding);
        break;

      case 'object': // Assume object is an array
        this.length = coerce(subject.length);
        break;

      default:
        throw new Error('First argument needs to be a number, ' +
                        'array or string.');
    }

    if (this.length > Buffer.poolSize) {
      // Big buffer, just alloc one.
      this.parent = new SlowBuffer(this.length);
      this.offset = 0;

    } else {
      // Small buffer.
      if (!pool || pool.length - pool.used < this.length) allocPool();
      this.parent = pool;
      this.offset = pool.used;
      pool.used += this.length;
    }

    // Treat array-ish objects as a byte array.
    if (isArrayIsh(subject)) {
      for (var i = 0; i < this.length; i++) {
        if (subject instanceof Buffer) {
          this.parent[i + this.offset] = subject.readUInt8(i);
        }
        else {
          this.parent[i + this.offset] = subject[i];
        }
      }
    } else if (type == 'string') {
      // We are a string
      this.length = this.write(subject, 0, encoding);
    }
  }

}

function isArrayIsh(subject) {
  return Array.isArray(subject) || Buffer.isBuffer(subject) ||
         subject && typeof subject === 'object' &&
         typeof subject.length === 'number';
}

exports.SlowBuffer = SlowBuffer;
exports.Buffer = Buffer;

Buffer.poolSize = 8 * 1024;
var pool;

function allocPool() {
  pool = new SlowBuffer(Buffer.poolSize);
  pool.used = 0;
}


// Static methods
Buffer.isBuffer = function isBuffer(b) {
  return b instanceof Buffer || b instanceof SlowBuffer;
};

Buffer.concat = function (list, totalLength) {
  if (!Array.isArray(list)) {
    throw new Error("Usage: Buffer.concat(list, [totalLength])\n \
      list should be an Array.");
  }

  if (list.length === 0) {
    return new Buffer(0);
  } else if (list.length === 1) {
    return list[0];
  }

  if (typeof totalLength !== 'number') {
    totalLength = 0;
    for (var i = 0; i < list.length; i++) {
      var buf = list[i];
      totalLength += buf.length;
    }
  }

  var buffer = new Buffer(totalLength);
  var pos = 0;
  for (var i = 0; i < list.length; i++) {
    var buf = list[i];
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer;
};

// Inspect
Buffer.prototype.inspect = function inspect() {
  var out = [],
      len = this.length;

  for (var i = 0; i < len; i++) {
    out[i] = toHex(this.parent[i + this.offset]);
    if (i == exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...';
      break;
    }
  }

  return '<Buffer ' + out.join(' ') + '>';
};


Buffer.prototype.get = function get(i) {
  if (i < 0 || i >= this.length) throw new Error('oob');
  return this.parent[this.offset + i];
};


Buffer.prototype.set = function set(i, v) {
  if (i < 0 || i >= this.length) throw new Error('oob');
  return this.parent[this.offset + i] = v;
};


// write(string, offset = 0, length = buffer.length-offset, encoding = 'utf8')
Buffer.prototype.write = function(string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length;
      length = undefined;
    }
  } else {  // legacy
    var swap = encoding;
    encoding = offset;
    offset = length;
    length = swap;
  }

  offset = +offset || 0;
  var remaining = this.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = +length;
    if (length > remaining) {
      length = remaining;
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase();

  var ret;
  switch (encoding) {
    case 'hex':
      ret = this.parent.hexWrite(string, this.offset + offset, length);
      break;

    case 'utf8':
    case 'utf-8':
      ret = this.parent.utf8Write(string, this.offset + offset, length);
      break;

    case 'ascii':
      ret = this.parent.asciiWrite(string, this.offset + offset, length);
      break;

    case 'binary':
      ret = this.parent.binaryWrite(string, this.offset + offset, length);
      break;

    case 'base64':
      // Warning: maxLength not taken into account in base64Write
      ret = this.parent.base64Write(string, this.offset + offset, length);
      break;

    case 'ucs2':
    case 'ucs-2':
      ret = this.parent.ucs2Write(string, this.offset + offset, length);
      break;

    default:
      throw new Error('Unknown encoding');
  }

  Buffer._charsWritten = SlowBuffer._charsWritten;

  return ret;
};


// toString(encoding, start=0, end=buffer.length)
Buffer.prototype.toString = function(encoding, start, end) {
  encoding = String(encoding || 'utf8').toLowerCase();

  if (typeof start == 'undefined' || start < 0) {
    start = 0;
  } else if (start > this.length) {
    start = this.length;
  }

  if (typeof end == 'undefined' || end > this.length) {
    end = this.length;
  } else if (end < 0) {
    end = 0;
  }

  start = start + this.offset;
  end = end + this.offset;

  switch (encoding) {
    case 'hex':
      return this.parent.hexSlice(start, end);

    case 'utf8':
    case 'utf-8':
      return this.parent.utf8Slice(start, end);

    case 'ascii':
      return this.parent.asciiSlice(start, end);

    case 'binary':
      return this.parent.binarySlice(start, end);

    case 'base64':
      return this.parent.base64Slice(start, end);

    case 'ucs2':
    case 'ucs-2':
      return this.parent.ucs2Slice(start, end);

    default:
      throw new Error('Unknown encoding');
  }
};


// byteLength
Buffer.byteLength = SlowBuffer.byteLength;


// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function fill(value, start, end) {
  value || (value = 0);
  start || (start = 0);
  end || (end = this.length);

  if (typeof value === 'string') {
    value = value.charCodeAt(0);
  }
  if (!(typeof value === 'number') || isNaN(value)) {
    throw new Error('value is not a number');
  }

  if (end < start) throw new Error('end < start');

  // Fill 0 bytes; we're done
  if (end === start) return 0;
  if (this.length == 0) return 0;

  if (start < 0 || start >= this.length) {
    throw new Error('start out of bounds');
  }

  if (end < 0 || end > this.length) {
    throw new Error('end out of bounds');
  }

  return this.parent.fill(value,
                          start + this.offset,
                          end + this.offset);
};


// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function(target, target_start, start, end) {
  var source = this;
  start || (start = 0);
  end || (end = this.length);
  target_start || (target_start = 0);

  if (end < start) throw new Error('sourceEnd < sourceStart');

  // Copy 0 bytes; we're done
  if (end === start) return 0;
  if (target.length == 0 || source.length == 0) return 0;

  if (target_start < 0 || target_start >= target.length) {
    throw new Error('targetStart out of bounds');
  }

  if (start < 0 || start >= source.length) {
    throw new Error('sourceStart out of bounds');
  }

  if (end < 0 || end > source.length) {
    throw new Error('sourceEnd out of bounds');
  }

  // Are we oob?
  if (end > this.length) {
    end = this.length;
  }

  if (target.length - target_start < end - start) {
    end = target.length - target_start + start;
  }

  return this.parent.copy(target.parent,
                          target_start + target.offset,
                          start + this.offset,
                          end + this.offset);
};


// slice(start, end)
Buffer.prototype.slice = function(start, end) {
  if (end === undefined) end = this.length;
  if (end > this.length) throw new Error('oob');
  if (start > end) throw new Error('oob');

  return new Buffer(this.parent, end - start, +start + this.offset);
};


// Legacy methods for backwards compatibility.

Buffer.prototype.utf8Slice = function(start, end) {
  return this.toString('utf8', start, end);
};

Buffer.prototype.binarySlice = function(start, end) {
  return this.toString('binary', start, end);
};

Buffer.prototype.asciiSlice = function(start, end) {
  return this.toString('ascii', start, end);
};

Buffer.prototype.utf8Write = function(string, offset) {
  return this.write(string, offset, 'utf8');
};

Buffer.prototype.binaryWrite = function(string, offset) {
  return this.write(string, offset, 'binary');
};

Buffer.prototype.asciiWrite = function(string, offset) {
  return this.write(string, offset, 'ascii');
};

Buffer.prototype.readUInt8 = function(offset, noAssert) {
  var buffer = this;

  if (!noAssert) {
    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (offset >= buffer.length) return;

  return buffer.parent[buffer.offset + offset];
};

function readUInt16(buffer, offset, isBigEndian, noAssert) {
  var val = 0;


  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (offset >= buffer.length) return 0;

  if (isBigEndian) {
    val = buffer.parent[buffer.offset + offset] << 8;
    if (offset + 1 < buffer.length) {
      val |= buffer.parent[buffer.offset + offset + 1];
    }
  } else {
    val = buffer.parent[buffer.offset + offset];
    if (offset + 1 < buffer.length) {
      val |= buffer.parent[buffer.offset + offset + 1] << 8;
    }
  }

  return val;
}

Buffer.prototype.readUInt16LE = function(offset, noAssert) {
  return readUInt16(this, offset, false, noAssert);
};

Buffer.prototype.readUInt16BE = function(offset, noAssert) {
  return readUInt16(this, offset, true, noAssert);
};

function readUInt32(buffer, offset, isBigEndian, noAssert) {
  var val = 0;

  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (offset >= buffer.length) return 0;

  if (isBigEndian) {
    if (offset + 1 < buffer.length)
      val = buffer.parent[buffer.offset + offset + 1] << 16;
    if (offset + 2 < buffer.length)
      val |= buffer.parent[buffer.offset + offset + 2] << 8;
    if (offset + 3 < buffer.length)
      val |= buffer.parent[buffer.offset + offset + 3];
    val = val + (buffer.parent[buffer.offset + offset] << 24 >>> 0);
  } else {
    if (offset + 2 < buffer.length)
      val = buffer.parent[buffer.offset + offset + 2] << 16;
    if (offset + 1 < buffer.length)
      val |= buffer.parent[buffer.offset + offset + 1] << 8;
    val |= buffer.parent[buffer.offset + offset];
    if (offset + 3 < buffer.length)
      val = val + (buffer.parent[buffer.offset + offset + 3] << 24 >>> 0);
  }

  return val;
}

Buffer.prototype.readUInt32LE = function(offset, noAssert) {
  return readUInt32(this, offset, false, noAssert);
};

Buffer.prototype.readUInt32BE = function(offset, noAssert) {
  return readUInt32(this, offset, true, noAssert);
};


/*
 * Signed integer types, yay team! A reminder on how two's complement actually
 * works. The first bit is the signed bit, i.e. tells us whether or not the
 * number should be positive or negative. If the two's complement value is
 * positive, then we're done, as it's equivalent to the unsigned representation.
 *
 * Now if the number is positive, you're pretty much done, you can just leverage
 * the unsigned translations and return those. Unfortunately, negative numbers
 * aren't quite that straightforward.
 *
 * At first glance, one might be inclined to use the traditional formula to
 * translate binary numbers between the positive and negative values in two's
 * complement. (Though it doesn't quite work for the most negative value)
 * Mainly:
 *  - invert all the bits
 *  - add one to the result
 *
 * Of course, this doesn't quite work in Javascript. Take for example the value
 * of -128. This could be represented in 16 bits (big-endian) as 0xff80. But of
 * course, Javascript will do the following:
 *
 * > ~0xff80
 * -65409
 *
 * Whoh there, Javascript, that's not quite right. But wait, according to
 * Javascript that's perfectly correct. When Javascript ends up seeing the
 * constant 0xff80, it has no notion that it is actually a signed number. It
 * assumes that we've input the unsigned value 0xff80. Thus, when it does the
 * binary negation, it casts it into a signed value, (positive 0xff80). Then
 * when you perform binary negation on that, it turns it into a negative number.
 *
 * Instead, we're going to have to use the following general formula, that works
 * in a rather Javascript friendly way. I'm glad we don't support this kind of
 * weird numbering scheme in the kernel.
 *
 * (BIT-MAX - (unsigned)val + 1) * -1
 *
 * The astute observer, may think that this doesn't make sense for 8-bit numbers
 * (really it isn't necessary for them). However, when you get 16-bit numbers,
 * you do. Let's go back to our prior example and see how this will look:
 *
 * (0xffff - 0xff80 + 1) * -1
 * (0x007f + 1) * -1
 * (0x0080) * -1
 */
Buffer.prototype.readInt8 = function(offset, noAssert) {
  var buffer = this;
  var neg;

  if (!noAssert) {
    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (offset >= buffer.length) return;

  neg = buffer.parent[buffer.offset + offset] & 0x80;
  if (!neg) {
    return (buffer.parent[buffer.offset + offset]);
  }

  return ((0xff - buffer.parent[buffer.offset + offset] + 1) * -1);
};

function readInt16(buffer, offset, isBigEndian, noAssert) {
  var neg, val;

  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'Trying to read beyond buffer length');
  }

  val = readUInt16(buffer, offset, isBigEndian, noAssert);
  neg = val & 0x8000;
  if (!neg) {
    return val;
  }

  return (0xffff - val + 1) * -1;
}

Buffer.prototype.readInt16LE = function(offset, noAssert) {
  return readInt16(this, offset, false, noAssert);
};

Buffer.prototype.readInt16BE = function(offset, noAssert) {
  return readInt16(this, offset, true, noAssert);
};

function readInt32(buffer, offset, isBigEndian, noAssert) {
  var neg, val;

  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to read beyond buffer length');
  }

  val = readUInt32(buffer, offset, isBigEndian, noAssert);
  neg = val & 0x80000000;
  if (!neg) {
    return (val);
  }

  return (0xffffffff - val + 1) * -1;
}

Buffer.prototype.readInt32LE = function(offset, noAssert) {
  return readInt32(this, offset, false, noAssert);
};

Buffer.prototype.readInt32BE = function(offset, noAssert) {
  return readInt32(this, offset, true, noAssert);
};

function readFloat(buffer, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset + 3 < buffer.length,
        'Trying to read beyond buffer length');
  }

  return require('./buffer_ieee754').readIEEE754(buffer, offset, isBigEndian,
      23, 4);
}

Buffer.prototype.readFloatLE = function(offset, noAssert) {
  return readFloat(this, offset, false, noAssert);
};

Buffer.prototype.readFloatBE = function(offset, noAssert) {
  return readFloat(this, offset, true, noAssert);
};

function readDouble(buffer, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset + 7 < buffer.length,
        'Trying to read beyond buffer length');
  }

  return require('./buffer_ieee754').readIEEE754(buffer, offset, isBigEndian,
      52, 8);
}

Buffer.prototype.readDoubleLE = function(offset, noAssert) {
  return readDouble(this, offset, false, noAssert);
};

Buffer.prototype.readDoubleBE = function(offset, noAssert) {
  return readDouble(this, offset, true, noAssert);
};


/*
 * We have to make sure that the value is a valid integer. This means that it is
 * non-negative. It has no fractional component and that it does not exceed the
 * maximum allowed value.
 *
 *      value           The number to check for validity
 *
 *      max             The maximum value
 */
function verifuint(value, max) {
  assert.ok(typeof (value) == 'number',
      'cannot write a non-number as a number');

  assert.ok(value >= 0,
      'specified a negative value for writing an unsigned value');

  assert.ok(value <= max, 'value is larger than maximum value for type');

  assert.ok(Math.floor(value) === value, 'value has a fractional component');
}

Buffer.prototype.writeUInt8 = function(value, offset, noAssert) {
  var buffer = this;

  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'trying to write beyond buffer length');

    verifuint(value, 0xff);
  }

  if (offset < buffer.length) {
    buffer.parent[buffer.offset + offset] = value;
  }
};

function writeUInt16(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'trying to write beyond buffer length');

    verifuint(value, 0xffff);
  }

  for (var i = 0; i < Math.min(buffer.length - offset, 2); i++) {
    buffer.parent[buffer.offset + offset + i] =
        (value & (0xff << (8 * (isBigEndian ? 1 - i : i)))) >>>
            (isBigEndian ? 1 - i : i) * 8;
  }

}

Buffer.prototype.writeUInt16LE = function(value, offset, noAssert) {
  writeUInt16(this, value, offset, false, noAssert);
};

Buffer.prototype.writeUInt16BE = function(value, offset, noAssert) {
  writeUInt16(this, value, offset, true, noAssert);
};

function writeUInt32(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'trying to write beyond buffer length');

    verifuint(value, 0xffffffff);
  }

  for (var i = 0; i < Math.min(buffer.length - offset, 4); i++) {
    buffer.parent[buffer.offset + offset + i] =
        (value >>> (isBigEndian ? 3 - i : i) * 8) & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function(value, offset, noAssert) {
  writeUInt32(this, value, offset, false, noAssert);
};

Buffer.prototype.writeUInt32BE = function(value, offset, noAssert) {
  writeUInt32(this, value, offset, true, noAssert);
};


/*
 * We now move onto our friends in the signed number category. Unlike unsigned
 * numbers, we're going to have to worry a bit more about how we put values into
 * arrays. Since we are only worrying about signed 32-bit values, we're in
 * slightly better shape. Unfortunately, we really can't do our favorite binary
 * & in this system. It really seems to do the wrong thing. For example:
 *
 * > -32 & 0xff
 * 224
 *
 * What's happening above is really: 0xe0 & 0xff = 0xe0. However, the results of
 * this aren't treated as a signed number. Ultimately a bad thing.
 *
 * What we're going to want to do is basically create the unsigned equivalent of
 * our representation and pass that off to the wuint* functions. To do that
 * we're going to do the following:
 *
 *  - if the value is positive
 *      we can pass it directly off to the equivalent wuint
 *  - if the value is negative
 *      we do the following computation:
 *         mb + val + 1, where
 *         mb   is the maximum unsigned value in that byte size
 *         val  is the Javascript negative integer
 *
 *
 * As a concrete value, take -128. In signed 16 bits this would be 0xff80. If
 * you do out the computations:
 *
 * 0xffff - 128 + 1
 * 0xffff - 127
 * 0xff80
 *
 * You can then encode this value as the signed version. This is really rather
 * hacky, but it should work and get the job done which is our goal here.
 */

/*
 * A series of checks to make sure we actually have a signed 32-bit number
 */
function verifsint(value, max, min) {
  assert.ok(typeof (value) == 'number',
      'cannot write a non-number as a number');

  assert.ok(value <= max, 'value larger than maximum allowed value');

  assert.ok(value >= min, 'value smaller than minimum allowed value');

  assert.ok(Math.floor(value) === value, 'value has a fractional component');
}

function verifIEEE754(value, max, min) {
  assert.ok(typeof (value) == 'number',
      'cannot write a non-number as a number');

  assert.ok(value <= max, 'value larger than maximum allowed value');

  assert.ok(value >= min, 'value smaller than minimum allowed value');
}

Buffer.prototype.writeInt8 = function(value, offset, noAssert) {
  var buffer = this;

  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'Trying to write beyond buffer length');

    verifsint(value, 0x7f, -0x80);
  }

  if (value >= 0) {
    buffer.writeUInt8(value, offset, noAssert);
  } else {
    buffer.writeUInt8(0xff + value + 1, offset, noAssert);
  }
};

function writeInt16(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'Trying to write beyond buffer length');

    verifsint(value, 0x7fff, -0x8000);
  }

  if (value >= 0) {
    writeUInt16(buffer, value, offset, isBigEndian, noAssert);
  } else {
    writeUInt16(buffer, 0xffff + value + 1, offset, isBigEndian, noAssert);
  }
}

Buffer.prototype.writeInt16LE = function(value, offset, noAssert) {
  writeInt16(this, value, offset, false, noAssert);
};

Buffer.prototype.writeInt16BE = function(value, offset, noAssert) {
  writeInt16(this, value, offset, true, noAssert);
};

function writeInt32(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to write beyond buffer length');

    verifsint(value, 0x7fffffff, -0x80000000);
  }

  if (value >= 0) {
    writeUInt32(buffer, value, offset, isBigEndian, noAssert);
  } else {
    writeUInt32(buffer, 0xffffffff + value + 1, offset, isBigEndian, noAssert);
  }
}

Buffer.prototype.writeInt32LE = function(value, offset, noAssert) {
  writeInt32(this, value, offset, false, noAssert);
};

Buffer.prototype.writeInt32BE = function(value, offset, noAssert) {
  writeInt32(this, value, offset, true, noAssert);
};

function writeFloat(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to write beyond buffer length');

    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38);
  }

  require('./buffer_ieee754').writeIEEE754(buffer, value, offset, isBigEndian,
      23, 4);
}

Buffer.prototype.writeFloatLE = function(value, offset, noAssert) {
  writeFloat(this, value, offset, false, noAssert);
};

Buffer.prototype.writeFloatBE = function(value, offset, noAssert) {
  writeFloat(this, value, offset, true, noAssert);
};

function writeDouble(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 7 < buffer.length,
        'Trying to write beyond buffer length');

    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308);
  }

  require('./buffer_ieee754').writeIEEE754(buffer, value, offset, isBigEndian,
      52, 8);
}

Buffer.prototype.writeDoubleLE = function(value, offset, noAssert) {
  writeDouble(this, value, offset, false, noAssert);
};

Buffer.prototype.writeDoubleBE = function(value, offset, noAssert) {
  writeDouble(this, value, offset, true, noAssert);
};

SlowBuffer.prototype.readUInt8 = Buffer.prototype.readUInt8;
SlowBuffer.prototype.readUInt16LE = Buffer.prototype.readUInt16LE;
SlowBuffer.prototype.readUInt16BE = Buffer.prototype.readUInt16BE;
SlowBuffer.prototype.readUInt32LE = Buffer.prototype.readUInt32LE;
SlowBuffer.prototype.readUInt32BE = Buffer.prototype.readUInt32BE;
SlowBuffer.prototype.readInt8 = Buffer.prototype.readInt8;
SlowBuffer.prototype.readInt16LE = Buffer.prototype.readInt16LE;
SlowBuffer.prototype.readInt16BE = Buffer.prototype.readInt16BE;
SlowBuffer.prototype.readInt32LE = Buffer.prototype.readInt32LE;
SlowBuffer.prototype.readInt32BE = Buffer.prototype.readInt32BE;
SlowBuffer.prototype.readFloatLE = Buffer.prototype.readFloatLE;
SlowBuffer.prototype.readFloatBE = Buffer.prototype.readFloatBE;
SlowBuffer.prototype.readDoubleLE = Buffer.prototype.readDoubleLE;
SlowBuffer.prototype.readDoubleBE = Buffer.prototype.readDoubleBE;
SlowBuffer.prototype.writeUInt8 = Buffer.prototype.writeUInt8;
SlowBuffer.prototype.writeUInt16LE = Buffer.prototype.writeUInt16LE;
SlowBuffer.prototype.writeUInt16BE = Buffer.prototype.writeUInt16BE;
SlowBuffer.prototype.writeUInt32LE = Buffer.prototype.writeUInt32LE;
SlowBuffer.prototype.writeUInt32BE = Buffer.prototype.writeUInt32BE;
SlowBuffer.prototype.writeInt8 = Buffer.prototype.writeInt8;
SlowBuffer.prototype.writeInt16LE = Buffer.prototype.writeInt16LE;
SlowBuffer.prototype.writeInt16BE = Buffer.prototype.writeInt16BE;
SlowBuffer.prototype.writeInt32LE = Buffer.prototype.writeInt32LE;
SlowBuffer.prototype.writeInt32BE = Buffer.prototype.writeInt32BE;
SlowBuffer.prototype.writeFloatLE = Buffer.prototype.writeFloatLE;
SlowBuffer.prototype.writeFloatBE = Buffer.prototype.writeFloatBE;
SlowBuffer.prototype.writeDoubleLE = Buffer.prototype.writeDoubleLE;
SlowBuffer.prototype.writeDoubleBE = Buffer.prototype.writeDoubleBE;

},{"assert":1,"./buffer_ieee754":5,"base64-js":7}],7:[function(require,module,exports){
(function (exports) {
	'use strict';

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	function b64ToByteArray(b64) {
		var i, j, l, tmp, placeHolders, arr;
	
		if (b64.length % 4 > 0) {
			throw 'Invalid string. Length must be a multiple of 4';
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		placeHolders = b64.indexOf('=');
		placeHolders = placeHolders > 0 ? b64.length - placeHolders : 0;

		// base64 is 4/3 + up to two characters of the original data
		arr = [];//new Uint8Array(b64.length * 3 / 4 - placeHolders);

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length;

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (lookup.indexOf(b64[i]) << 18) | (lookup.indexOf(b64[i + 1]) << 12) | (lookup.indexOf(b64[i + 2]) << 6) | lookup.indexOf(b64[i + 3]);
			arr.push((tmp & 0xFF0000) >> 16);
			arr.push((tmp & 0xFF00) >> 8);
			arr.push(tmp & 0xFF);
		}

		if (placeHolders === 2) {
			tmp = (lookup.indexOf(b64[i]) << 2) | (lookup.indexOf(b64[i + 1]) >> 4);
			arr.push(tmp & 0xFF);
		} else if (placeHolders === 1) {
			tmp = (lookup.indexOf(b64[i]) << 10) | (lookup.indexOf(b64[i + 1]) << 4) | (lookup.indexOf(b64[i + 2]) >> 2);
			arr.push((tmp >> 8) & 0xFF);
			arr.push(tmp & 0xFF);
		}

		return arr;
	}

	function uint8ToBase64(uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length;

		function tripletToBase64 (num) {
			return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
		};

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
			output += tripletToBase64(temp);
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1];
				output += lookup[temp >> 2];
				output += lookup[(temp << 4) & 0x3F];
				output += '==';
				break;
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1]);
				output += lookup[temp >> 10];
				output += lookup[(temp >> 4) & 0x3F];
				output += lookup[(temp << 2) & 0x3F];
				output += '=';
				break;
		}

		return output;
	}

	module.exports.toByteArray = b64ToByteArray;
	module.exports.fromByteArray = uint8ToBase64;
}());

},{}],8:[function(require,module,exports){
exports.readIEEE754 = function(buffer, offset, isBE, mLen, nBytes) {
  var e, m,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = isBE ? 0 : (nBytes - 1),
      d = isBE ? 1 : -1,
      s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity);
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.writeIEEE754 = function(buffer, value, offset, isBE, mLen, nBytes) {
  var e, m, c,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = isBE ? (nBytes - 1) : 0,
      d = isBE ? -1 : 1,
      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

  buffer[offset + i - d] |= s * 128;
};

},{}],3:[function(require,module,exports){
function SlowBuffer (size) {
    this.length = size;
};

var assert = require('assert');

exports.INSPECT_MAX_BYTES = 50;


function toHex(n) {
  if (n < 16) return '0' + n.toString(16);
  return n.toString(16);
}

function utf8ToBytes(str) {
  var byteArray = [];
  for (var i = 0; i < str.length; i++)
    if (str.charCodeAt(i) <= 0x7F)
      byteArray.push(str.charCodeAt(i));
    else {
      var h = encodeURIComponent(str.charAt(i)).substr(1).split('%');
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16));
    }

  return byteArray;
}

function asciiToBytes(str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++ )
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push( str.charCodeAt(i) & 0xFF );

  return byteArray;
}

function base64ToBytes(str) {
  return require("base64-js").toByteArray(str);
}

SlowBuffer.byteLength = function (str, encoding) {
  switch (encoding || "utf8") {
    case 'hex':
      return str.length / 2;

    case 'utf8':
    case 'utf-8':
      return utf8ToBytes(str).length;

    case 'ascii':
      return str.length;

    case 'base64':
      return base64ToBytes(str).length;

    default:
      throw new Error('Unknown encoding');
  }
};

function blitBuffer(src, dst, offset, length) {
  var pos, i = 0;
  while (i < length) {
    if ((i+offset >= dst.length) || (i >= src.length))
      break;

    dst[i + offset] = src[i];
    i++;
  }
  return i;
}

SlowBuffer.prototype.utf8Write = function (string, offset, length) {
  var bytes, pos;
  return SlowBuffer._charsWritten =  blitBuffer(utf8ToBytes(string), this, offset, length);
};

SlowBuffer.prototype.asciiWrite = function (string, offset, length) {
  var bytes, pos;
  return SlowBuffer._charsWritten =  blitBuffer(asciiToBytes(string), this, offset, length);
};

SlowBuffer.prototype.base64Write = function (string, offset, length) {
  var bytes, pos;
  return SlowBuffer._charsWritten = blitBuffer(base64ToBytes(string), this, offset, length);
};

SlowBuffer.prototype.base64Slice = function (start, end) {
  var bytes = Array.prototype.slice.apply(this, arguments)
  return require("base64-js").fromByteArray(bytes);
}

function decodeUtf8Char(str) {
  try {
    return decodeURIComponent(str);
  } catch (err) {
    return String.fromCharCode(0xFFFD); // UTF 8 invalid char
  }
}

SlowBuffer.prototype.utf8Slice = function () {
  var bytes = Array.prototype.slice.apply(this, arguments);
  var res = "";
  var tmp = "";
  var i = 0;
  while (i < bytes.length) {
    if (bytes[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(bytes[i]);
      tmp = "";
    } else
      tmp += "%" + bytes[i].toString(16);

    i++;
  }

  return res + decodeUtf8Char(tmp);
}

SlowBuffer.prototype.asciiSlice = function () {
  var bytes = Array.prototype.slice.apply(this, arguments);
  var ret = "";
  for (var i = 0; i < bytes.length; i++)
    ret += String.fromCharCode(bytes[i]);
  return ret;
}

SlowBuffer.prototype.inspect = function() {
  var out = [],
      len = this.length;
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i]);
    if (i == exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...';
      break;
    }
  }
  return '<SlowBuffer ' + out.join(' ') + '>';
};


SlowBuffer.prototype.hexSlice = function(start, end) {
  var len = this.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  var out = '';
  for (var i = start; i < end; i++) {
    out += toHex(this[i]);
  }
  return out;
};


SlowBuffer.prototype.toString = function(encoding, start, end) {
  encoding = String(encoding || 'utf8').toLowerCase();
  start = +start || 0;
  if (typeof end == 'undefined') end = this.length;

  // Fastpath empty strings
  if (+end == start) {
    return '';
  }

  switch (encoding) {
    case 'hex':
      return this.hexSlice(start, end);

    case 'utf8':
    case 'utf-8':
      return this.utf8Slice(start, end);

    case 'ascii':
      return this.asciiSlice(start, end);

    case 'binary':
      return this.binarySlice(start, end);

    case 'base64':
      return this.base64Slice(start, end);

    case 'ucs2':
    case 'ucs-2':
      return this.ucs2Slice(start, end);

    default:
      throw new Error('Unknown encoding');
  }
};


SlowBuffer.prototype.hexWrite = function(string, offset, length) {
  offset = +offset || 0;
  var remaining = this.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = +length;
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  if (strLen % 2) {
    throw new Error('Invalid hex string');
  }
  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(byte)) throw new Error('Invalid hex string');
    this[offset + i] = byte;
  }
  SlowBuffer._charsWritten = i * 2;
  return i;
};


SlowBuffer.prototype.write = function(string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length;
      length = undefined;
    }
  } else {  // legacy
    var swap = encoding;
    encoding = offset;
    offset = length;
    length = swap;
  }

  offset = +offset || 0;
  var remaining = this.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = +length;
    if (length > remaining) {
      length = remaining;
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase();

  switch (encoding) {
    case 'hex':
      return this.hexWrite(string, offset, length);

    case 'utf8':
    case 'utf-8':
      return this.utf8Write(string, offset, length);

    case 'ascii':
      return this.asciiWrite(string, offset, length);

    case 'binary':
      return this.binaryWrite(string, offset, length);

    case 'base64':
      return this.base64Write(string, offset, length);

    case 'ucs2':
    case 'ucs-2':
      return this.ucs2Write(string, offset, length);

    default:
      throw new Error('Unknown encoding');
  }
};


// slice(start, end)
SlowBuffer.prototype.slice = function(start, end) {
  if (end === undefined) end = this.length;

  if (end > this.length) {
    throw new Error('oob');
  }
  if (start > end) {
    throw new Error('oob');
  }

  return new Buffer(this, end - start, +start);
};

SlowBuffer.prototype.copy = function(target, targetstart, sourcestart, sourceend) {
  var temp = [];
  for (var i=sourcestart; i<sourceend; i++) {
    assert.ok(typeof this[i] !== 'undefined', "copying undefined buffer bytes!");
    temp.push(this[i]);
  }

  for (var i=targetstart; i<targetstart+temp.length; i++) {
    target[i] = temp[i-targetstart];
  }
};

function coerce(length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length);
  return length < 0 ? 0 : length;
}


// Buffer

function Buffer(subject, encoding, offset) {
  if (!(this instanceof Buffer)) {
    return new Buffer(subject, encoding, offset);
  }

  var type;

  // Are we slicing?
  if (typeof offset === 'number') {
    this.length = coerce(encoding);
    this.parent = subject;
    this.offset = offset;
  } else {
    // Find the length
    switch (type = typeof subject) {
      case 'number':
        this.length = coerce(subject);
        break;

      case 'string':
        this.length = Buffer.byteLength(subject, encoding);
        break;

      case 'object': // Assume object is an array
        this.length = coerce(subject.length);
        break;

      default:
        throw new Error('First argument needs to be a number, ' +
                        'array or string.');
    }

    if (this.length > Buffer.poolSize) {
      // Big buffer, just alloc one.
      this.parent = new SlowBuffer(this.length);
      this.offset = 0;

    } else {
      // Small buffer.
      if (!pool || pool.length - pool.used < this.length) allocPool();
      this.parent = pool;
      this.offset = pool.used;
      pool.used += this.length;
    }

    // Treat array-ish objects as a byte array.
    if (isArrayIsh(subject)) {
      for (var i = 0; i < this.length; i++) {
        this.parent[i + this.offset] = subject[i];
      }
    } else if (type == 'string') {
      // We are a string
      this.length = this.write(subject, 0, encoding);
    }
  }

}

function isArrayIsh(subject) {
  return Array.isArray(subject) || Buffer.isBuffer(subject) ||
         subject && typeof subject === 'object' &&
         typeof subject.length === 'number';
}

exports.SlowBuffer = SlowBuffer;
exports.Buffer = Buffer;

Buffer.poolSize = 8 * 1024;
var pool;

function allocPool() {
  pool = new SlowBuffer(Buffer.poolSize);
  pool.used = 0;
}


// Static methods
Buffer.isBuffer = function isBuffer(b) {
  return b instanceof Buffer || b instanceof SlowBuffer;
};

Buffer.concat = function (list, totalLength) {
  if (!Array.isArray(list)) {
    throw new Error("Usage: Buffer.concat(list, [totalLength])\n \
      list should be an Array.");
  }

  if (list.length === 0) {
    return new Buffer(0);
  } else if (list.length === 1) {
    return list[0];
  }

  if (typeof totalLength !== 'number') {
    totalLength = 0;
    for (var i = 0; i < list.length; i++) {
      var buf = list[i];
      totalLength += buf.length;
    }
  }

  var buffer = new Buffer(totalLength);
  var pos = 0;
  for (var i = 0; i < list.length; i++) {
    var buf = list[i];
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer;
};

// Inspect
Buffer.prototype.inspect = function inspect() {
  var out = [],
      len = this.length;

  for (var i = 0; i < len; i++) {
    out[i] = toHex(this.parent[i + this.offset]);
    if (i == exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...';
      break;
    }
  }

  return '<Buffer ' + out.join(' ') + '>';
};


Buffer.prototype.get = function get(i) {
  if (i < 0 || i >= this.length) throw new Error('oob');
  return this.parent[this.offset + i];
};


Buffer.prototype.set = function set(i, v) {
  if (i < 0 || i >= this.length) throw new Error('oob');
  return this.parent[this.offset + i] = v;
};


// write(string, offset = 0, length = buffer.length-offset, encoding = 'utf8')
Buffer.prototype.write = function(string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length;
      length = undefined;
    }
  } else {  // legacy
    var swap = encoding;
    encoding = offset;
    offset = length;
    length = swap;
  }

  offset = +offset || 0;
  var remaining = this.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = +length;
    if (length > remaining) {
      length = remaining;
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase();

  var ret;
  switch (encoding) {
    case 'hex':
      ret = this.parent.hexWrite(string, this.offset + offset, length);
      break;

    case 'utf8':
    case 'utf-8':
      ret = this.parent.utf8Write(string, this.offset + offset, length);
      break;

    case 'ascii':
      ret = this.parent.asciiWrite(string, this.offset + offset, length);
      break;

    case 'binary':
      ret = this.parent.binaryWrite(string, this.offset + offset, length);
      break;

    case 'base64':
      // Warning: maxLength not taken into account in base64Write
      ret = this.parent.base64Write(string, this.offset + offset, length);
      break;

    case 'ucs2':
    case 'ucs-2':
      ret = this.parent.ucs2Write(string, this.offset + offset, length);
      break;

    default:
      throw new Error('Unknown encoding');
  }

  Buffer._charsWritten = SlowBuffer._charsWritten;

  return ret;
};


// toString(encoding, start=0, end=buffer.length)
Buffer.prototype.toString = function(encoding, start, end) {
  encoding = String(encoding || 'utf8').toLowerCase();

  if (typeof start == 'undefined' || start < 0) {
    start = 0;
  } else if (start > this.length) {
    start = this.length;
  }

  if (typeof end == 'undefined' || end > this.length) {
    end = this.length;
  } else if (end < 0) {
    end = 0;
  }

  start = start + this.offset;
  end = end + this.offset;

  switch (encoding) {
    case 'hex':
      return this.parent.hexSlice(start, end);

    case 'utf8':
    case 'utf-8':
      return this.parent.utf8Slice(start, end);

    case 'ascii':
      return this.parent.asciiSlice(start, end);

    case 'binary':
      return this.parent.binarySlice(start, end);

    case 'base64':
      return this.parent.base64Slice(start, end);

    case 'ucs2':
    case 'ucs-2':
      return this.parent.ucs2Slice(start, end);

    default:
      throw new Error('Unknown encoding');
  }
};


// byteLength
Buffer.byteLength = SlowBuffer.byteLength;


// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function fill(value, start, end) {
  value || (value = 0);
  start || (start = 0);
  end || (end = this.length);

  if (typeof value === 'string') {
    value = value.charCodeAt(0);
  }
  if (!(typeof value === 'number') || isNaN(value)) {
    throw new Error('value is not a number');
  }

  if (end < start) throw new Error('end < start');

  // Fill 0 bytes; we're done
  if (end === start) return 0;
  if (this.length == 0) return 0;

  if (start < 0 || start >= this.length) {
    throw new Error('start out of bounds');
  }

  if (end < 0 || end > this.length) {
    throw new Error('end out of bounds');
  }

  return this.parent.fill(value,
                          start + this.offset,
                          end + this.offset);
};


// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function(target, target_start, start, end) {
  var source = this;
  start || (start = 0);
  end || (end = this.length);
  target_start || (target_start = 0);

  if (end < start) throw new Error('sourceEnd < sourceStart');

  // Copy 0 bytes; we're done
  if (end === start) return 0;
  if (target.length == 0 || source.length == 0) return 0;

  if (target_start < 0 || target_start >= target.length) {
    throw new Error('targetStart out of bounds');
  }

  if (start < 0 || start >= source.length) {
    throw new Error('sourceStart out of bounds');
  }

  if (end < 0 || end > source.length) {
    throw new Error('sourceEnd out of bounds');
  }

  // Are we oob?
  if (end > this.length) {
    end = this.length;
  }

  if (target.length - target_start < end - start) {
    end = target.length - target_start + start;
  }

  return this.parent.copy(target.parent,
                          target_start + target.offset,
                          start + this.offset,
                          end + this.offset);
};


// slice(start, end)
Buffer.prototype.slice = function(start, end) {
  if (end === undefined) end = this.length;
  if (end > this.length) throw new Error('oob');
  if (start > end) throw new Error('oob');

  return new Buffer(this.parent, end - start, +start + this.offset);
};


// Legacy methods for backwards compatibility.

Buffer.prototype.utf8Slice = function(start, end) {
  return this.toString('utf8', start, end);
};

Buffer.prototype.binarySlice = function(start, end) {
  return this.toString('binary', start, end);
};

Buffer.prototype.asciiSlice = function(start, end) {
  return this.toString('ascii', start, end);
};

Buffer.prototype.utf8Write = function(string, offset) {
  return this.write(string, offset, 'utf8');
};

Buffer.prototype.binaryWrite = function(string, offset) {
  return this.write(string, offset, 'binary');
};

Buffer.prototype.asciiWrite = function(string, offset) {
  return this.write(string, offset, 'ascii');
};

Buffer.prototype.readUInt8 = function(offset, noAssert) {
  var buffer = this;

  if (!noAssert) {
    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'Trying to read beyond buffer length');
  }

  return buffer.parent[buffer.offset + offset];
};

function readUInt16(buffer, offset, isBigEndian, noAssert) {
  var val = 0;


  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (isBigEndian) {
    val = buffer.parent[buffer.offset + offset] << 8;
    val |= buffer.parent[buffer.offset + offset + 1];
  } else {
    val = buffer.parent[buffer.offset + offset];
    val |= buffer.parent[buffer.offset + offset + 1] << 8;
  }

  return val;
}

Buffer.prototype.readUInt16LE = function(offset, noAssert) {
  return readUInt16(this, offset, false, noAssert);
};

Buffer.prototype.readUInt16BE = function(offset, noAssert) {
  return readUInt16(this, offset, true, noAssert);
};

function readUInt32(buffer, offset, isBigEndian, noAssert) {
  var val = 0;

  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (isBigEndian) {
    val = buffer.parent[buffer.offset + offset + 1] << 16;
    val |= buffer.parent[buffer.offset + offset + 2] << 8;
    val |= buffer.parent[buffer.offset + offset + 3];
    val = val + (buffer.parent[buffer.offset + offset] << 24 >>> 0);
  } else {
    val = buffer.parent[buffer.offset + offset + 2] << 16;
    val |= buffer.parent[buffer.offset + offset + 1] << 8;
    val |= buffer.parent[buffer.offset + offset];
    val = val + (buffer.parent[buffer.offset + offset + 3] << 24 >>> 0);
  }

  return val;
}

Buffer.prototype.readUInt32LE = function(offset, noAssert) {
  return readUInt32(this, offset, false, noAssert);
};

Buffer.prototype.readUInt32BE = function(offset, noAssert) {
  return readUInt32(this, offset, true, noAssert);
};


/*
 * Signed integer types, yay team! A reminder on how two's complement actually
 * works. The first bit is the signed bit, i.e. tells us whether or not the
 * number should be positive or negative. If the two's complement value is
 * positive, then we're done, as it's equivalent to the unsigned representation.
 *
 * Now if the number is positive, you're pretty much done, you can just leverage
 * the unsigned translations and return those. Unfortunately, negative numbers
 * aren't quite that straightforward.
 *
 * At first glance, one might be inclined to use the traditional formula to
 * translate binary numbers between the positive and negative values in two's
 * complement. (Though it doesn't quite work for the most negative value)
 * Mainly:
 *  - invert all the bits
 *  - add one to the result
 *
 * Of course, this doesn't quite work in Javascript. Take for example the value
 * of -128. This could be represented in 16 bits (big-endian) as 0xff80. But of
 * course, Javascript will do the following:
 *
 * > ~0xff80
 * -65409
 *
 * Whoh there, Javascript, that's not quite right. But wait, according to
 * Javascript that's perfectly correct. When Javascript ends up seeing the
 * constant 0xff80, it has no notion that it is actually a signed number. It
 * assumes that we've input the unsigned value 0xff80. Thus, when it does the
 * binary negation, it casts it into a signed value, (positive 0xff80). Then
 * when you perform binary negation on that, it turns it into a negative number.
 *
 * Instead, we're going to have to use the following general formula, that works
 * in a rather Javascript friendly way. I'm glad we don't support this kind of
 * weird numbering scheme in the kernel.
 *
 * (BIT-MAX - (unsigned)val + 1) * -1
 *
 * The astute observer, may think that this doesn't make sense for 8-bit numbers
 * (really it isn't necessary for them). However, when you get 16-bit numbers,
 * you do. Let's go back to our prior example and see how this will look:
 *
 * (0xffff - 0xff80 + 1) * -1
 * (0x007f + 1) * -1
 * (0x0080) * -1
 */
Buffer.prototype.readInt8 = function(offset, noAssert) {
  var buffer = this;
  var neg;

  if (!noAssert) {
    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'Trying to read beyond buffer length');
  }

  neg = buffer.parent[buffer.offset + offset] & 0x80;
  if (!neg) {
    return (buffer.parent[buffer.offset + offset]);
  }

  return ((0xff - buffer.parent[buffer.offset + offset] + 1) * -1);
};

function readInt16(buffer, offset, isBigEndian, noAssert) {
  var neg, val;

  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'Trying to read beyond buffer length');
  }

  val = readUInt16(buffer, offset, isBigEndian, noAssert);
  neg = val & 0x8000;
  if (!neg) {
    return val;
  }

  return (0xffff - val + 1) * -1;
}

Buffer.prototype.readInt16LE = function(offset, noAssert) {
  return readInt16(this, offset, false, noAssert);
};

Buffer.prototype.readInt16BE = function(offset, noAssert) {
  return readInt16(this, offset, true, noAssert);
};

function readInt32(buffer, offset, isBigEndian, noAssert) {
  var neg, val;

  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to read beyond buffer length');
  }

  val = readUInt32(buffer, offset, isBigEndian, noAssert);
  neg = val & 0x80000000;
  if (!neg) {
    return (val);
  }

  return (0xffffffff - val + 1) * -1;
}

Buffer.prototype.readInt32LE = function(offset, noAssert) {
  return readInt32(this, offset, false, noAssert);
};

Buffer.prototype.readInt32BE = function(offset, noAssert) {
  return readInt32(this, offset, true, noAssert);
};

function readFloat(buffer, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset + 3 < buffer.length,
        'Trying to read beyond buffer length');
  }

  return require('./buffer_ieee754').readIEEE754(buffer, offset, isBigEndian,
      23, 4);
}

Buffer.prototype.readFloatLE = function(offset, noAssert) {
  return readFloat(this, offset, false, noAssert);
};

Buffer.prototype.readFloatBE = function(offset, noAssert) {
  return readFloat(this, offset, true, noAssert);
};

function readDouble(buffer, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset + 7 < buffer.length,
        'Trying to read beyond buffer length');
  }

  return require('./buffer_ieee754').readIEEE754(buffer, offset, isBigEndian,
      52, 8);
}

Buffer.prototype.readDoubleLE = function(offset, noAssert) {
  return readDouble(this, offset, false, noAssert);
};

Buffer.prototype.readDoubleBE = function(offset, noAssert) {
  return readDouble(this, offset, true, noAssert);
};


/*
 * We have to make sure that the value is a valid integer. This means that it is
 * non-negative. It has no fractional component and that it does not exceed the
 * maximum allowed value.
 *
 *      value           The number to check for validity
 *
 *      max             The maximum value
 */
function verifuint(value, max) {
  assert.ok(typeof (value) == 'number',
      'cannot write a non-number as a number');

  assert.ok(value >= 0,
      'specified a negative value for writing an unsigned value');

  assert.ok(value <= max, 'value is larger than maximum value for type');

  assert.ok(Math.floor(value) === value, 'value has a fractional component');
}

Buffer.prototype.writeUInt8 = function(value, offset, noAssert) {
  var buffer = this;

  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'trying to write beyond buffer length');

    verifuint(value, 0xff);
  }

  buffer.parent[buffer.offset + offset] = value;
};

function writeUInt16(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'trying to write beyond buffer length');

    verifuint(value, 0xffff);
  }

  if (isBigEndian) {
    buffer.parent[buffer.offset + offset] = (value & 0xff00) >>> 8;
    buffer.parent[buffer.offset + offset + 1] = value & 0x00ff;
  } else {
    buffer.parent[buffer.offset + offset + 1] = (value & 0xff00) >>> 8;
    buffer.parent[buffer.offset + offset] = value & 0x00ff;
  }
}

Buffer.prototype.writeUInt16LE = function(value, offset, noAssert) {
  writeUInt16(this, value, offset, false, noAssert);
};

Buffer.prototype.writeUInt16BE = function(value, offset, noAssert) {
  writeUInt16(this, value, offset, true, noAssert);
};

function writeUInt32(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'trying to write beyond buffer length');

    verifuint(value, 0xffffffff);
  }

  if (isBigEndian) {
    buffer.parent[buffer.offset + offset] = (value >>> 24) & 0xff;
    buffer.parent[buffer.offset + offset + 1] = (value >>> 16) & 0xff;
    buffer.parent[buffer.offset + offset + 2] = (value >>> 8) & 0xff;
    buffer.parent[buffer.offset + offset + 3] = value & 0xff;
  } else {
    buffer.parent[buffer.offset + offset + 3] = (value >>> 24) & 0xff;
    buffer.parent[buffer.offset + offset + 2] = (value >>> 16) & 0xff;
    buffer.parent[buffer.offset + offset + 1] = (value >>> 8) & 0xff;
    buffer.parent[buffer.offset + offset] = value & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function(value, offset, noAssert) {
  writeUInt32(this, value, offset, false, noAssert);
};

Buffer.prototype.writeUInt32BE = function(value, offset, noAssert) {
  writeUInt32(this, value, offset, true, noAssert);
};


/*
 * We now move onto our friends in the signed number category. Unlike unsigned
 * numbers, we're going to have to worry a bit more about how we put values into
 * arrays. Since we are only worrying about signed 32-bit values, we're in
 * slightly better shape. Unfortunately, we really can't do our favorite binary
 * & in this system. It really seems to do the wrong thing. For example:
 *
 * > -32 & 0xff
 * 224
 *
 * What's happening above is really: 0xe0 & 0xff = 0xe0. However, the results of
 * this aren't treated as a signed number. Ultimately a bad thing.
 *
 * What we're going to want to do is basically create the unsigned equivalent of
 * our representation and pass that off to the wuint* functions. To do that
 * we're going to do the following:
 *
 *  - if the value is positive
 *      we can pass it directly off to the equivalent wuint
 *  - if the value is negative
 *      we do the following computation:
 *         mb + val + 1, where
 *         mb   is the maximum unsigned value in that byte size
 *         val  is the Javascript negative integer
 *
 *
 * As a concrete value, take -128. In signed 16 bits this would be 0xff80. If
 * you do out the computations:
 *
 * 0xffff - 128 + 1
 * 0xffff - 127
 * 0xff80
 *
 * You can then encode this value as the signed version. This is really rather
 * hacky, but it should work and get the job done which is our goal here.
 */

/*
 * A series of checks to make sure we actually have a signed 32-bit number
 */
function verifsint(value, max, min) {
  assert.ok(typeof (value) == 'number',
      'cannot write a non-number as a number');

  assert.ok(value <= max, 'value larger than maximum allowed value');

  assert.ok(value >= min, 'value smaller than minimum allowed value');

  assert.ok(Math.floor(value) === value, 'value has a fractional component');
}

function verifIEEE754(value, max, min) {
  assert.ok(typeof (value) == 'number',
      'cannot write a non-number as a number');

  assert.ok(value <= max, 'value larger than maximum allowed value');

  assert.ok(value >= min, 'value smaller than minimum allowed value');
}

Buffer.prototype.writeInt8 = function(value, offset, noAssert) {
  var buffer = this;

  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'Trying to write beyond buffer length');

    verifsint(value, 0x7f, -0x80);
  }

  if (value >= 0) {
    buffer.writeUInt8(value, offset, noAssert);
  } else {
    buffer.writeUInt8(0xff + value + 1, offset, noAssert);
  }
};

function writeInt16(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'Trying to write beyond buffer length');

    verifsint(value, 0x7fff, -0x8000);
  }

  if (value >= 0) {
    writeUInt16(buffer, value, offset, isBigEndian, noAssert);
  } else {
    writeUInt16(buffer, 0xffff + value + 1, offset, isBigEndian, noAssert);
  }
}

Buffer.prototype.writeInt16LE = function(value, offset, noAssert) {
  writeInt16(this, value, offset, false, noAssert);
};

Buffer.prototype.writeInt16BE = function(value, offset, noAssert) {
  writeInt16(this, value, offset, true, noAssert);
};

function writeInt32(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to write beyond buffer length');

    verifsint(value, 0x7fffffff, -0x80000000);
  }

  if (value >= 0) {
    writeUInt32(buffer, value, offset, isBigEndian, noAssert);
  } else {
    writeUInt32(buffer, 0xffffffff + value + 1, offset, isBigEndian, noAssert);
  }
}

Buffer.prototype.writeInt32LE = function(value, offset, noAssert) {
  writeInt32(this, value, offset, false, noAssert);
};

Buffer.prototype.writeInt32BE = function(value, offset, noAssert) {
  writeInt32(this, value, offset, true, noAssert);
};

function writeFloat(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to write beyond buffer length');

    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38);
  }

  require('./buffer_ieee754').writeIEEE754(buffer, value, offset, isBigEndian,
      23, 4);
}

Buffer.prototype.writeFloatLE = function(value, offset, noAssert) {
  writeFloat(this, value, offset, false, noAssert);
};

Buffer.prototype.writeFloatBE = function(value, offset, noAssert) {
  writeFloat(this, value, offset, true, noAssert);
};

function writeDouble(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 7 < buffer.length,
        'Trying to write beyond buffer length');

    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308);
  }

  require('./buffer_ieee754').writeIEEE754(buffer, value, offset, isBigEndian,
      52, 8);
}

Buffer.prototype.writeDoubleLE = function(value, offset, noAssert) {
  writeDouble(this, value, offset, false, noAssert);
};

Buffer.prototype.writeDoubleBE = function(value, offset, noAssert) {
  writeDouble(this, value, offset, true, noAssert);
};

SlowBuffer.prototype.readUInt8 = Buffer.prototype.readUInt8;
SlowBuffer.prototype.readUInt16LE = Buffer.prototype.readUInt16LE;
SlowBuffer.prototype.readUInt16BE = Buffer.prototype.readUInt16BE;
SlowBuffer.prototype.readUInt32LE = Buffer.prototype.readUInt32LE;
SlowBuffer.prototype.readUInt32BE = Buffer.prototype.readUInt32BE;
SlowBuffer.prototype.readInt8 = Buffer.prototype.readInt8;
SlowBuffer.prototype.readInt16LE = Buffer.prototype.readInt16LE;
SlowBuffer.prototype.readInt16BE = Buffer.prototype.readInt16BE;
SlowBuffer.prototype.readInt32LE = Buffer.prototype.readInt32LE;
SlowBuffer.prototype.readInt32BE = Buffer.prototype.readInt32BE;
SlowBuffer.prototype.readFloatLE = Buffer.prototype.readFloatLE;
SlowBuffer.prototype.readFloatBE = Buffer.prototype.readFloatBE;
SlowBuffer.prototype.readDoubleLE = Buffer.prototype.readDoubleLE;
SlowBuffer.prototype.readDoubleBE = Buffer.prototype.readDoubleBE;
SlowBuffer.prototype.writeUInt8 = Buffer.prototype.writeUInt8;
SlowBuffer.prototype.writeUInt16LE = Buffer.prototype.writeUInt16LE;
SlowBuffer.prototype.writeUInt16BE = Buffer.prototype.writeUInt16BE;
SlowBuffer.prototype.writeUInt32LE = Buffer.prototype.writeUInt32LE;
SlowBuffer.prototype.writeUInt32BE = Buffer.prototype.writeUInt32BE;
SlowBuffer.prototype.writeInt8 = Buffer.prototype.writeInt8;
SlowBuffer.prototype.writeInt16LE = Buffer.prototype.writeInt16LE;
SlowBuffer.prototype.writeInt16BE = Buffer.prototype.writeInt16BE;
SlowBuffer.prototype.writeInt32LE = Buffer.prototype.writeInt32LE;
SlowBuffer.prototype.writeInt32BE = Buffer.prototype.writeInt32BE;
SlowBuffer.prototype.writeFloatLE = Buffer.prototype.writeFloatLE;
SlowBuffer.prototype.writeFloatBE = Buffer.prototype.writeFloatBE;
SlowBuffer.prototype.writeDoubleLE = Buffer.prototype.writeDoubleLE;
SlowBuffer.prototype.writeDoubleBE = Buffer.prototype.writeDoubleBE;

},{"assert":1,"./buffer_ieee754":8,"base64-js":9}],9:[function(require,module,exports){
(function (exports) {
	'use strict';

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	function b64ToByteArray(b64) {
		var i, j, l, tmp, placeHolders, arr;
	
		if (b64.length % 4 > 0) {
			throw 'Invalid string. Length must be a multiple of 4';
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		placeHolders = b64.indexOf('=');
		placeHolders = placeHolders > 0 ? b64.length - placeHolders : 0;

		// base64 is 4/3 + up to two characters of the original data
		arr = [];//new Uint8Array(b64.length * 3 / 4 - placeHolders);

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length;

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (lookup.indexOf(b64[i]) << 18) | (lookup.indexOf(b64[i + 1]) << 12) | (lookup.indexOf(b64[i + 2]) << 6) | lookup.indexOf(b64[i + 3]);
			arr.push((tmp & 0xFF0000) >> 16);
			arr.push((tmp & 0xFF00) >> 8);
			arr.push(tmp & 0xFF);
		}

		if (placeHolders === 2) {
			tmp = (lookup.indexOf(b64[i]) << 2) | (lookup.indexOf(b64[i + 1]) >> 4);
			arr.push(tmp & 0xFF);
		} else if (placeHolders === 1) {
			tmp = (lookup.indexOf(b64[i]) << 10) | (lookup.indexOf(b64[i + 1]) << 4) | (lookup.indexOf(b64[i + 2]) >> 2);
			arr.push((tmp >> 8) & 0xFF);
			arr.push(tmp & 0xFF);
		}

		return arr;
	}

	function uint8ToBase64(uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length;

		function tripletToBase64 (num) {
			return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
		};

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
			output += tripletToBase64(temp);
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1];
				output += lookup[temp >> 2];
				output += lookup[(temp << 4) & 0x3F];
				output += '==';
				break;
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1]);
				output += lookup[temp >> 10];
				output += lookup[(temp >> 4) & 0x3F];
				output += lookup[(temp << 2) & 0x3F];
				output += '=';
				break;
		}

		return output;
	}

	module.exports.toByteArray = b64ToByteArray;
	module.exports.fromByteArray = uint8ToBase64;
}());

},{}]},{},[])
;;module.exports=require("buffer-browserify")

},{}],15:[function(require,module,exports){
var Buffer=require("__browserify_Buffer").Buffer;
(function (global, module) {

  if ('undefined' == typeof module) {
    var module = { exports: {} }
      , exports = module.exports
  }

  /**
   * Exports.
   */

  module.exports = expect;
  expect.Assertion = Assertion;

  /**
   * Exports version.
   */

  expect.version = '0.1.2';

  /**
   * Possible assertion flags.
   */

  var flags = {
      not: ['to', 'be', 'have', 'include', 'only']
    , to: ['be', 'have', 'include', 'only', 'not']
    , only: ['have']
    , have: ['own']
    , be: ['an']
  };

  function expect (obj) {
    return new Assertion(obj);
  }

  /**
   * Constructor
   *
   * @api private
   */

  function Assertion (obj, flag, parent) {
    this.obj = obj;
    this.flags = {};

    if (undefined != parent) {
      this.flags[flag] = true;

      for (var i in parent.flags) {
        if (parent.flags.hasOwnProperty(i)) {
          this.flags[i] = true;
        }
      }
    }

    var $flags = flag ? flags[flag] : keys(flags)
      , self = this

    if ($flags) {
      for (var i = 0, l = $flags.length; i < l; i++) {
        // avoid recursion
        if (this.flags[$flags[i]]) continue;

        var name = $flags[i]
          , assertion = new Assertion(this.obj, name, this)

        if ('function' == typeof Assertion.prototype[name]) {
          // clone the function, make sure we dont touch the prot reference
          var old = this[name];
          this[name] = function () {
            return old.apply(self, arguments);
          }

          for (var fn in Assertion.prototype) {
            if (Assertion.prototype.hasOwnProperty(fn) && fn != name) {
              this[name][fn] = bind(assertion[fn], assertion);
            }
          }
        } else {
          this[name] = assertion;
        }
      }
    }
  };

  /**
   * Performs an assertion
   *
   * @api private
   */

  Assertion.prototype.assert = function (truth, msg, error) {
    var msg = this.flags.not ? error : msg
      , ok = this.flags.not ? !truth : truth;

    if (!ok) {
      throw new Error(msg.call(this));
    }

    this.and = new Assertion(this.obj);
  };

  /**
   * Check if the value is truthy
   *
   * @api public
   */

  Assertion.prototype.ok = function () {
    this.assert(
        !!this.obj
      , function(){ return 'expected ' + i(this.obj) + ' to be truthy' }
      , function(){ return 'expected ' + i(this.obj) + ' to be falsy' });
  };

  /**
   * Assert that the function throws.
   *
   * @param {Function|RegExp} callback, or regexp to match error string against
   * @api public
   */

  Assertion.prototype.throwError =
  Assertion.prototype.throwException = function (fn) {
    expect(this.obj).to.be.a('function');

    var thrown = false
      , not = this.flags.not

    try {
      this.obj();
    } catch (e) {
      if ('function' == typeof fn) {
        fn(e);
      } else if ('object' == typeof fn) {
        var subject = 'string' == typeof e ? e : e.message;
        if (not) {
          expect(subject).to.not.match(fn);
        } else {
          expect(subject).to.match(fn);
        }
      }
      thrown = true;
    }

    if ('object' == typeof fn && not) {
      // in the presence of a matcher, ensure the `not` only applies to
      // the matching.
      this.flags.not = false;
    }

    var name = this.obj.name || 'fn';
    this.assert(
        thrown
      , function(){ return 'expected ' + name + ' to throw an exception' }
      , function(){ return 'expected ' + name + ' not to throw an exception' });
  };

  /**
   * Checks if the array is empty.
   *
   * @api public
   */

  Assertion.prototype.empty = function () {
    var expectation;

    if ('object' == typeof this.obj && null !== this.obj && !isArray(this.obj)) {
      if ('number' == typeof this.obj.length) {
        expectation = !this.obj.length;
      } else {
        expectation = !keys(this.obj).length;
      }
    } else {
      if ('string' != typeof this.obj) {
        expect(this.obj).to.be.an('object');
      }

      expect(this.obj).to.have.property('length');
      expectation = !this.obj.length;
    }

    this.assert(
        expectation
      , function(){ return 'expected ' + i(this.obj) + ' to be empty' }
      , function(){ return 'expected ' + i(this.obj) + ' to not be empty' });
    return this;
  };

  /**
   * Checks if the obj exactly equals another.
   *
   * @api public
   */

  Assertion.prototype.be =
  Assertion.prototype.equal = function (obj) {
    this.assert(
        obj === this.obj
      , function(){ return 'expected ' + i(this.obj) + ' to equal ' + i(obj) }
      , function(){ return 'expected ' + i(this.obj) + ' to not equal ' + i(obj) });
    return this;
  };

  /**
   * Checks if the obj sortof equals another.
   *
   * @api public
   */

  Assertion.prototype.eql = function (obj) {
    this.assert(
        expect.eql(obj, this.obj)
      , function(){ return 'expected ' + i(this.obj) + ' to sort of equal ' + i(obj) }
      , function(){ return 'expected ' + i(this.obj) + ' to sort of not equal ' + i(obj) });
    return this;
  };

  /**
   * Assert within start to finish (inclusive).
   *
   * @param {Number} start
   * @param {Number} finish
   * @api public
   */

  Assertion.prototype.within = function (start, finish) {
    var range = start + '..' + finish;
    this.assert(
        this.obj >= start && this.obj <= finish
      , function(){ return 'expected ' + i(this.obj) + ' to be within ' + range }
      , function(){ return 'expected ' + i(this.obj) + ' to not be within ' + range });
    return this;
  };

  /**
   * Assert typeof / instance of
   *
   * @api public
   */

  Assertion.prototype.a =
  Assertion.prototype.an = function (type) {
    if ('string' == typeof type) {
      // proper english in error msg
      var n = /^[aeiou]/.test(type) ? 'n' : '';

      // typeof with support for 'array'
      this.assert(
          'array' == type ? isArray(this.obj) :
            'object' == type
              ? 'object' == typeof this.obj && null !== this.obj
              : type == typeof this.obj
        , function(){ return 'expected ' + i(this.obj) + ' to be a' + n + ' ' + type }
        , function(){ return 'expected ' + i(this.obj) + ' not to be a' + n + ' ' + type });
    } else {
      // instanceof
      var name = type.name || 'supplied constructor';
      this.assert(
          this.obj instanceof type
        , function(){ return 'expected ' + i(this.obj) + ' to be an instance of ' + name }
        , function(){ return 'expected ' + i(this.obj) + ' not to be an instance of ' + name });
    }

    return this;
  };

  /**
   * Assert numeric value above _n_.
   *
   * @param {Number} n
   * @api public
   */

  Assertion.prototype.greaterThan =
  Assertion.prototype.above = function (n) {
    this.assert(
        this.obj > n
      , function(){ return 'expected ' + i(this.obj) + ' to be above ' + n }
      , function(){ return 'expected ' + i(this.obj) + ' to be below ' + n });
    return this;
  };

  /**
   * Assert numeric value below _n_.
   *
   * @param {Number} n
   * @api public
   */

  Assertion.prototype.lessThan =
  Assertion.prototype.below = function (n) {
    this.assert(
        this.obj < n
      , function(){ return 'expected ' + i(this.obj) + ' to be below ' + n }
      , function(){ return 'expected ' + i(this.obj) + ' to be above ' + n });
    return this;
  };

  /**
   * Assert string value matches _regexp_.
   *
   * @param {RegExp} regexp
   * @api public
   */

  Assertion.prototype.match = function (regexp) {
    this.assert(
        regexp.exec(this.obj)
      , function(){ return 'expected ' + i(this.obj) + ' to match ' + regexp }
      , function(){ return 'expected ' + i(this.obj) + ' not to match ' + regexp });
    return this;
  };

  /**
   * Assert property "length" exists and has value of _n_.
   *
   * @param {Number} n
   * @api public
   */

  Assertion.prototype.length = function (n) {
    expect(this.obj).to.have.property('length');
    var len = this.obj.length;
    this.assert(
        n == len
      , function(){ return 'expected ' + i(this.obj) + ' to have a length of ' + n + ' but got ' + len }
      , function(){ return 'expected ' + i(this.obj) + ' to not have a length of ' + len });
    return this;
  };

  /**
   * Assert property _name_ exists, with optional _val_.
   *
   * @param {String} name
   * @param {Mixed} val
   * @api public
   */

  Assertion.prototype.property = function (name, val) {
    if (this.flags.own) {
      this.assert(
          Object.prototype.hasOwnProperty.call(this.obj, name)
        , function(){ return 'expected ' + i(this.obj) + ' to have own property ' + i(name) }
        , function(){ return 'expected ' + i(this.obj) + ' to not have own property ' + i(name) });
      return this;
    }

    if (this.flags.not && undefined !== val) {
      if (undefined === this.obj[name]) {
        throw new Error(i(this.obj) + ' has no property ' + i(name));
      }
    } else {
      var hasProp;
      try {
        hasProp = name in this.obj
      } catch (e) {
        hasProp = undefined !== this.obj[name]
      }

      this.assert(
          hasProp
        , function(){ return 'expected ' + i(this.obj) + ' to have a property ' + i(name) }
        , function(){ return 'expected ' + i(this.obj) + ' to not have a property ' + i(name) });
    }

    if (undefined !== val) {
      this.assert(
          val === this.obj[name]
        , function(){ return 'expected ' + i(this.obj) + ' to have a property ' + i(name)
          + ' of ' + i(val) + ', but got ' + i(this.obj[name]) }
        , function(){ return 'expected ' + i(this.obj) + ' to not have a property ' + i(name)
          + ' of ' + i(val) });
    }

    this.obj = this.obj[name];
    return this;
  };

  /**
   * Assert that the array contains _obj_ or string contains _obj_.
   *
   * @param {Mixed} obj|string
   * @api public
   */

  Assertion.prototype.string =
  Assertion.prototype.contain = function (obj) {
    if ('string' == typeof this.obj) {
      this.assert(
          ~this.obj.indexOf(obj)
        , function(){ return 'expected ' + i(this.obj) + ' to contain ' + i(obj) }
        , function(){ return 'expected ' + i(this.obj) + ' to not contain ' + i(obj) });
    } else {
      this.assert(
          ~indexOf(this.obj, obj)
        , function(){ return 'expected ' + i(this.obj) + ' to contain ' + i(obj) }
        , function(){ return 'expected ' + i(this.obj) + ' to not contain ' + i(obj) });
    }
    return this;
  };

  /**
   * Assert exact keys or inclusion of keys by using
   * the `.own` modifier.
   *
   * @param {Array|String ...} keys
   * @api public
   */

  Assertion.prototype.key =
  Assertion.prototype.keys = function ($keys) {
    var str
      , ok = true;

    $keys = isArray($keys)
      ? $keys
      : Array.prototype.slice.call(arguments);

    if (!$keys.length) throw new Error('keys required');

    var actual = keys(this.obj)
      , len = $keys.length;

    // Inclusion
    ok = every($keys, function (key) {
      return ~indexOf(actual, key);
    });

    // Strict
    if (!this.flags.not && this.flags.only) {
      ok = ok && $keys.length == actual.length;
    }

    // Key string
    if (len > 1) {
      $keys = map($keys, function (key) {
        return i(key);
      });
      var last = $keys.pop();
      str = $keys.join(', ') + ', and ' + last;
    } else {
      str = i($keys[0]);
    }

    // Form
    str = (len > 1 ? 'keys ' : 'key ') + str;

    // Have / include
    str = (!this.flags.only ? 'include ' : 'only have ') + str;

    // Assertion
    this.assert(
        ok
      , function(){ return 'expected ' + i(this.obj) + ' to ' + str }
      , function(){ return 'expected ' + i(this.obj) + ' to not ' + str });

    return this;
  };
  /**
   * Assert a failure.
   *
   * @param {String ...} custom message
   * @api public
   */
  Assertion.prototype.fail = function (msg) {
    msg = msg || "explicit failure";
    this.assert(false, msg, msg);
    return this;
  };

  /**
   * Function bind implementation.
   */

  function bind (fn, scope) {
    return function () {
      return fn.apply(scope, arguments);
    }
  }

  /**
   * Array every compatibility
   *
   * @see bit.ly/5Fq1N2
   * @api public
   */

  function every (arr, fn, thisObj) {
    var scope = thisObj || global;
    for (var i = 0, j = arr.length; i < j; ++i) {
      if (!fn.call(scope, arr[i], i, arr)) {
        return false;
      }
    }
    return true;
  };

  /**
   * Array indexOf compatibility.
   *
   * @see bit.ly/a5Dxa2
   * @api public
   */

  function indexOf (arr, o, i) {
    if (Array.prototype.indexOf) {
      return Array.prototype.indexOf.call(arr, o, i);
    }

    if (arr.length === undefined) {
      return -1;
    }

    for (var j = arr.length, i = i < 0 ? i + j < 0 ? 0 : i + j : i || 0
        ; i < j && arr[i] !== o; i++);

    return j <= i ? -1 : i;
  };

  // https://gist.github.com/1044128/
  var getOuterHTML = function(element) {
    if ('outerHTML' in element) return element.outerHTML;
    var ns = "http://www.w3.org/1999/xhtml";
    var container = document.createElementNS(ns, '_');
    var elemProto = (window.HTMLElement || window.Element).prototype;
    var xmlSerializer = new XMLSerializer();
    var html;
    if (document.xmlVersion) {
      return xmlSerializer.serializeToString(element);
    } else {
      container.appendChild(element.cloneNode(false));
      html = container.innerHTML.replace('><', '>' + element.innerHTML + '<');
      container.innerHTML = '';
      return html;
    }
  };

  // Returns true if object is a DOM element.
  var isDOMElement = function (object) {
    if (typeof HTMLElement === 'object') {
      return object instanceof HTMLElement;
    } else {
      return object &&
        typeof object === 'object' &&
        object.nodeType === 1 &&
        typeof object.nodeName === 'string';
    }
  };

  /**
   * Inspects an object.
   *
   * @see taken from node.js `util` module (copyright Joyent, MIT license)
   * @api private
   */

  function i (obj, showHidden, depth) {
    var seen = [];

    function stylize (str) {
      return str;
    };

    function format (value, recurseTimes) {
      // Provide a hook for user-specified inspect functions.
      // Check that value is an object with an inspect function on it
      if (value && typeof value.inspect === 'function' &&
          // Filter out the util module, it's inspect function is special
          value !== exports &&
          // Also filter out any prototype objects using the circular check.
          !(value.constructor && value.constructor.prototype === value)) {
        return value.inspect(recurseTimes);
      }

      // Primitive types cannot have properties
      switch (typeof value) {
        case 'undefined':
          return stylize('undefined', 'undefined');

        case 'string':
          var simple = '\'' + json.stringify(value).replace(/^"|"$/g, '')
                                                   .replace(/'/g, "\\'")
                                                   .replace(/\\"/g, '"') + '\'';
          return stylize(simple, 'string');

        case 'number':
          return stylize('' + value, 'number');

        case 'boolean':
          return stylize('' + value, 'boolean');
      }
      // For some reason typeof null is "object", so special case here.
      if (value === null) {
        return stylize('null', 'null');
      }

      if (isDOMElement(value)) {
        return getOuterHTML(value);
      }

      // Look up the keys of the object.
      var visible_keys = keys(value);
      var $keys = showHidden ? Object.getOwnPropertyNames(value) : visible_keys;

      // Functions without properties can be shortcutted.
      if (typeof value === 'function' && $keys.length === 0) {
        if (isRegExp(value)) {
          return stylize('' + value, 'regexp');
        } else {
          var name = value.name ? ': ' + value.name : '';
          return stylize('[Function' + name + ']', 'special');
        }
      }

      // Dates without properties can be shortcutted
      if (isDate(value) && $keys.length === 0) {
        return stylize(value.toUTCString(), 'date');
      }

      var base, type, braces;
      // Determine the object type
      if (isArray(value)) {
        type = 'Array';
        braces = ['[', ']'];
      } else {
        type = 'Object';
        braces = ['{', '}'];
      }

      // Make functions say that they are functions
      if (typeof value === 'function') {
        var n = value.name ? ': ' + value.name : '';
        base = (isRegExp(value)) ? ' ' + value : ' [Function' + n + ']';
      } else {
        base = '';
      }

      // Make dates with properties first say the date
      if (isDate(value)) {
        base = ' ' + value.toUTCString();
      }

      if ($keys.length === 0) {
        return braces[0] + base + braces[1];
      }

      if (recurseTimes < 0) {
        if (isRegExp(value)) {
          return stylize('' + value, 'regexp');
        } else {
          return stylize('[Object]', 'special');
        }
      }

      seen.push(value);

      var output = map($keys, function (key) {
        var name, str;
        if (value.__lookupGetter__) {
          if (value.__lookupGetter__(key)) {
            if (value.__lookupSetter__(key)) {
              str = stylize('[Getter/Setter]', 'special');
            } else {
              str = stylize('[Getter]', 'special');
            }
          } else {
            if (value.__lookupSetter__(key)) {
              str = stylize('[Setter]', 'special');
            }
          }
        }
        if (indexOf(visible_keys, key) < 0) {
          name = '[' + key + ']';
        }
        if (!str) {
          if (indexOf(seen, value[key]) < 0) {
            if (recurseTimes === null) {
              str = format(value[key]);
            } else {
              str = format(value[key], recurseTimes - 1);
            }
            if (str.indexOf('\n') > -1) {
              if (isArray(value)) {
                str = map(str.split('\n'), function (line) {
                  return '  ' + line;
                }).join('\n').substr(2);
              } else {
                str = '\n' + map(str.split('\n'), function (line) {
                  return '   ' + line;
                }).join('\n');
              }
            }
          } else {
            str = stylize('[Circular]', 'special');
          }
        }
        if (typeof name === 'undefined') {
          if (type === 'Array' && key.match(/^\d+$/)) {
            return str;
          }
          name = json.stringify('' + key);
          if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
            name = name.substr(1, name.length - 2);
            name = stylize(name, 'name');
          } else {
            name = name.replace(/'/g, "\\'")
                       .replace(/\\"/g, '"')
                       .replace(/(^"|"$)/g, "'");
            name = stylize(name, 'string');
          }
        }

        return name + ': ' + str;
      });

      seen.pop();

      var numLinesEst = 0;
      var length = reduce(output, function (prev, cur) {
        numLinesEst++;
        if (indexOf(cur, '\n') >= 0) numLinesEst++;
        return prev + cur.length + 1;
      }, 0);

      if (length > 50) {
        output = braces[0] +
                 (base === '' ? '' : base + '\n ') +
                 ' ' +
                 output.join(',\n  ') +
                 ' ' +
                 braces[1];

      } else {
        output = braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
      }

      return output;
    }
    return format(obj, (typeof depth === 'undefined' ? 2 : depth));
  };

  function isArray (ar) {
    return Object.prototype.toString.call(ar) == '[object Array]';
  };

  function isRegExp(re) {
    var s;
    try {
      s = '' + re;
    } catch (e) {
      return false;
    }

    return re instanceof RegExp || // easy case
           // duck-type for context-switching evalcx case
           typeof(re) === 'function' &&
           re.constructor.name === 'RegExp' &&
           re.compile &&
           re.test &&
           re.exec &&
           s.match(/^\/.*\/[gim]{0,3}$/);
  };

  function isDate(d) {
    if (d instanceof Date) return true;
    return false;
  };

  function keys (obj) {
    if (Object.keys) {
      return Object.keys(obj);
    }

    var keys = [];

    for (var i in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, i)) {
        keys.push(i);
      }
    }

    return keys;
  }

  function map (arr, mapper, that) {
    if (Array.prototype.map) {
      return Array.prototype.map.call(arr, mapper, that);
    }

    var other= new Array(arr.length);

    for (var i= 0, n = arr.length; i<n; i++)
      if (i in arr)
        other[i] = mapper.call(that, arr[i], i, arr);

    return other;
  };

  function reduce (arr, fun) {
    if (Array.prototype.reduce) {
      return Array.prototype.reduce.apply(
          arr
        , Array.prototype.slice.call(arguments, 1)
      );
    }

    var len = +this.length;

    if (typeof fun !== "function")
      throw new TypeError();

    // no value to return if no initial value and an empty array
    if (len === 0 && arguments.length === 1)
      throw new TypeError();

    var i = 0;
    if (arguments.length >= 2) {
      var rv = arguments[1];
    } else {
      do {
        if (i in this) {
          rv = this[i++];
          break;
        }

        // if array contains no values, no initial value to return
        if (++i >= len)
          throw new TypeError();
      } while (true);
    }

    for (; i < len; i++) {
      if (i in this)
        rv = fun.call(null, rv, this[i], i, this);
    }

    return rv;
  };

  /**
   * Asserts deep equality
   *
   * @see taken from node.js `assert` module (copyright Joyent, MIT license)
   * @api private
   */

  expect.eql = function eql (actual, expected) {
    // 7.1. All identical values are equivalent, as determined by ===.
    if (actual === expected) {
      return true;
    } else if ('undefined' != typeof Buffer
        && Buffer.isBuffer(actual) && Buffer.isBuffer(expected)) {
      if (actual.length != expected.length) return false;

      for (var i = 0; i < actual.length; i++) {
        if (actual[i] !== expected[i]) return false;
      }

      return true;

    // 7.2. If the expected value is a Date object, the actual value is
    // equivalent if it is also a Date object that refers to the same time.
    } else if (actual instanceof Date && expected instanceof Date) {
      return actual.getTime() === expected.getTime();

    // 7.3. Other pairs that do not both pass typeof value == "object",
    // equivalence is determined by ==.
    } else if (typeof actual != 'object' && typeof expected != 'object') {
      return actual == expected;

    // 7.4. For all other Object pairs, including Array objects, equivalence is
    // determined by having the same number of owned properties (as verified
    // with Object.prototype.hasOwnProperty.call), the same set of keys
    // (although not necessarily the same order), equivalent values for every
    // corresponding key, and an identical "prototype" property. Note: this
    // accounts for both named and indexed properties on Arrays.
    } else {
      return objEquiv(actual, expected);
    }
  }

  function isUndefinedOrNull (value) {
    return value === null || value === undefined;
  }

  function isArguments (object) {
    return Object.prototype.toString.call(object) == '[object Arguments]';
  }

  function objEquiv (a, b) {
    if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
      return false;
    // an identical "prototype" property.
    if (a.prototype !== b.prototype) return false;
    //~~~I've managed to break Object.keys through screwy arguments passing.
    //   Converting to array solves the problem.
    if (isArguments(a)) {
      if (!isArguments(b)) {
        return false;
      }
      a = pSlice.call(a);
      b = pSlice.call(b);
      return expect.eql(a, b);
    }
    try{
      var ka = keys(a),
        kb = keys(b),
        key, i;
    } catch (e) {//happens when one is a string literal and the other isn't
      return false;
    }
    // having the same number of owned properties (keys incorporates hasOwnProperty)
    if (ka.length != kb.length)
      return false;
    //the same set of keys (although not necessarily the same order),
    ka.sort();
    kb.sort();
    //~~~cheap key test
    for (i = ka.length - 1; i >= 0; i--) {
      if (ka[i] != kb[i])
        return false;
    }
    //equivalent values for every corresponding key, and
    //~~~possibly expensive deep test
    for (i = ka.length - 1; i >= 0; i--) {
      key = ka[i];
      if (!expect.eql(a[key], b[key]))
         return false;
    }
    return true;
  }

  var json = (function () {
    "use strict";

    if ('object' == typeof JSON && JSON.parse && JSON.stringify) {
      return {
          parse: nativeJSON.parse
        , stringify: nativeJSON.stringify
      }
    }

    var JSON = {};

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    function date(d, key) {
      return isFinite(d.valueOf()) ?
          d.getUTCFullYear()     + '-' +
          f(d.getUTCMonth() + 1) + '-' +
          f(d.getUTCDate())      + 'T' +
          f(d.getUTCHours())     + ':' +
          f(d.getUTCMinutes())   + ':' +
          f(d.getUTCSeconds())   + 'Z' : null;
    };

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

  // If the string contains no control characters, no quote characters, and no
  // backslash characters, then we can safely slap some quotes around it.
  // Otherwise we must also replace the offending characters with safe escape
  // sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string' ? c :
                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

  // Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

  // If the value has a toJSON method, call it to obtain a replacement value.

        if (value instanceof Date) {
            value = date(key);
        }

  // If we were called with a replacer function, then call the replacer to
  // obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

  // What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

  // JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

  // If the value is a boolean or null, convert it to a string. Note:
  // typeof null does not produce 'null'. The case is included here in
  // the remote chance that this gets fixed someday.

            return String(value);

  // If the type is 'object', we might be dealing with an object or an array or
  // null.

        case 'object':

  // Due to a specification blunder in ECMAScript, typeof null is 'object',
  // so watch out for that case.

            if (!value) {
                return 'null';
            }

  // Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

  // Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

  // The value is an array. Stringify every element. Use null as a placeholder
  // for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

  // Join all of the elements together, separated with commas, and wrap them in
  // brackets.

                v = partial.length === 0 ? '[]' : gap ?
                    '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                    '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

  // If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

  // Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

  // Join all of the member texts together, separated with commas,
  // and wrap them in braces.

            v = partial.length === 0 ? '{}' : gap ?
                '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
                '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

  // If the JSON object does not yet have a stringify method, give it one.

    JSON.stringify = function (value, replacer, space) {

  // The stringify method takes a value and an optional replacer, and an optional
  // space parameter, and returns a JSON text. The replacer can be a function
  // that can replace values, or an array of strings that will select the keys.
  // A default replacer method can be provided. Use of the space parameter can
  // produce text that is more easily readable.

        var i;
        gap = '';
        indent = '';

  // If the space parameter is a number, make an indent string containing that
  // many spaces.

        if (typeof space === 'number') {
            for (i = 0; i < space; i += 1) {
                indent += ' ';
            }

  // If the space parameter is a string, it will be used as the indent string.

        } else if (typeof space === 'string') {
            indent = space;
        }

  // If there is a replacer, it must be a function or an array.
  // Otherwise, throw an error.

        rep = replacer;
        if (replacer && typeof replacer !== 'function' &&
                (typeof replacer !== 'object' ||
                typeof replacer.length !== 'number')) {
            throw new Error('JSON.stringify');
        }

  // Make a fake root object containing our value under the key of ''.
  // Return the result of stringifying the value.

        return str('', {'': value});
    };

  // If the JSON object does not yet have a parse method, give it one.

    JSON.parse = function (text, reviver) {
    // The parse method takes a text and an optional reviver function, and returns
    // a JavaScript value if the text is a valid JSON text.

        var j;

        function walk(holder, key) {

    // The walk method is used to recursively walk the resulting structure so
    // that modifications can be made.

            var k, v, value = holder[key];
            if (value && typeof value === 'object') {
                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = walk(value, k);
                        if (v !== undefined) {
                            value[k] = v;
                        } else {
                            delete value[k];
                        }
                    }
                }
            }
            return reviver.call(holder, key, value);
        }


    // Parsing happens in four stages. In the first stage, we replace certain
    // Unicode characters with escape sequences. JavaScript handles many characters
    // incorrectly, either silently deleting them, or treating them as line endings.

        text = String(text);
        cx.lastIndex = 0;
        if (cx.test(text)) {
            text = text.replace(cx, function (a) {
                return '\\u' +
                    ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            });
        }

    // In the second stage, we run the text against regular expressions that look
    // for non-JSON patterns. We are especially concerned with '()' and 'new'
    // because they can cause invocation, and '=' because it can cause mutation.
    // But just to be safe, we want to reject all unexpected forms.

    // We split the second stage into 4 regexp operations in order to work around
    // crippling inefficiencies in IE's and Safari's regexp engines. First we
    // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
    // replace all simple value tokens with ']' characters. Third, we delete all
    // open brackets that follow a colon or comma or that begin the text. Finally,
    // we look to see that the remaining characters are only whitespace or ']' or
    // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

        if (/^[\],:{}\s]*$/
                .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                    .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

    // In the third stage we use the eval function to compile the text into a
    // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
    // in JavaScript: it can begin a block or an object literal. We wrap the text
    // in parens to eliminate the ambiguity.

            j = eval('(' + text + ')');

    // In the optional fourth stage, we recursively walk the new structure, passing
    // each name/value pair to a reviver function for possible transformation.

            return typeof reviver === 'function' ?
                walk({'': j}, '') : j;
        }

    // If the text is not JSON parseable, then a SyntaxError is thrown.

        throw new SyntaxError('JSON.parse');
    };

    return JSON;
  })();

  if ('undefined' != typeof window) {
    window.expect = module.exports;
  }

})(
    this
  , 'undefined' != typeof module ? module : {}
  , 'undefined' != typeof exports ? exports : {}
);

},{"__browserify_Buffer":17}],14:[function(require,module,exports){
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
},{"./array":20,"./arrayFnGenerator":21,"./class/base":24,"./class/compositionEnums":27,"./class/definer":25,"./class/plugin":26,"./class/pluginManager":28,"./compare":29,"./events/eventEmitter":23,"./function":18,"./id":30,"./is":22,"./object":19}],16:[function(require,module,exports){
var Luc = require('./lucTestLib'),
    expect = require('expect.js');

exports.testEmitter = function(emitter) {

    var i = '';
    emitter.on('aaa', function(v) {
        i += v;
    });
    emitter.emit('aaa', 'a');
    emitter.emit('aaa', 'b');
    emitter.emit('aaa', 'c');
    expect(i).to.be('abc');
    i = "";

    emitter.once('bbb', function(v) {
        i += v;
    });

    emitter.emit('bbb', 'a');
    emitter.emit('bbb', 'b');
    emitter.emit('bbb', 'c');
    expect(i).to.be('a');
}
},{"./lucTestLib":13,"expect.js":15}],22:[function(require,module,exports){
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
},{}],30:[function(require,module,exports){
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
},{}],18:[function(require,module,exports){
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
},{"./array":20,"./is":22}],19:[function(require,module,exports){
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
},{"./is":22}],20:[function(require,module,exports){
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

},{"./compare":29,"./is":22}],21:[function(require,module,exports){
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
},{"./array":20,"./is":22}],29:[function(require,module,exports){
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
},{"./is":22}],24:[function(require,module,exports){
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
},{"../function":18,"../object":19}],25:[function(require,module,exports){
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
            var $super = sp || proto,
                key;

            for (key in $super) {
                if ($super[key] === callee) {

                    return $super.$superclass[key];

                    //we could be caching this here on the fn
                    //but then devs would have to know the edge cases
                    //of how to invalidate it
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
 * @property {Function} [callSuper] If $super is defined it
 * will be on the prototype of $super.  It can be used to call a super's
 * method.  This can be used instead of the class's static $superclass reference.
 * Check out {@link Luc.define#callSuper callSuper} for more extensive documentation.
 * 
 * 
    function MyCoolClass() {}
    MyCoolClass.prototype.addNums = function(a,b) {
        return a + b;
    }

    var MyOtherCoolClass = Luc.define({
        $super: MyCoolClass,
        addNums: function(a, b, c) {
            return this.callSuper([a, b]) + c;
        }
    })

    var m = new MyOtherCoolClass();
    m.addNums(1,2,3);
    >6
 */

/**
 * @method callSuper If $super is defined it
 * will be on the prototype of $super.  It can be used to call a super's
 * method.
 *
 * @param {Array/Arguments} args(optional) The arguments for the super methods apply call.
 * 
 * 
    function MyCoolClass() {}
    MyCoolClass.prototype.addNums = function(a,b) {
        return a + b;
    }

    var MC = Luc.define({
        $super: MyCoolClass,
        addNums: function(a, b, c) {
            return this.callSuper([a, b]) + c;
        }
    });
    
    *
    * produces the same code as :
    * 
    var MC = Luc.define({
        $super: MyCoolClass,
        addNums: function(a, b, c) {
            return MC.$superclass.addNums.apply(this, [a, b]) + c;
        }
    });

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
        $super:Counter,
        increaseCount: function () {
            this.count += 2;
            this.callSuper();
        }
    });

    *
    * is the same as
    * 

    var C = Luc.define({
        $super:Counter,
        increaseCount: function () {
            this.count += 2;
            C.$superclass.increaseCount.call(this);
        }
    });

    *
    * Caveats <br>
    *
    * callSuper can not be used as an instance method or inside of method
    * that is overwritten for a particular instance.
    *
    var c = new C();
    //this will throw an error with the message of method not found.
    c.callSuper()
    *
    * What callSuper makes up for in terseness it loses it in
    * efficiency.
    * 
    this.count += 2;
    C.$superclass.increaseCount

    *
    * is much faster and more efficient that :
    * 
    this.count += 2;
    this.callSuper();


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

 * A reference to the superclass's methods can be obtained through
 * the defined class's property $superclass.  Similar functionality 
 * can be done with {@link Luc.define#callSuper callSuper} but callSuper
 * is much less efficient.
 *
     var C = Luc.define({
        $super:Counter,
        increaseCount: function () {
            this.count += 2;
            C.$superclass.increaseCount.call(this);
        }
    });

    var c = new C();
    c.increaseCount();
    c.count
    >3
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
 * that knows that it may be mixing.  Even worse than that would be a mixin that needs
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
},{"../array":20,"../function":18,"../is":22,"../object":19,"./base":24,"./composition":31}],26:[function(require,module,exports){
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

},{"../array":20,"../function":18,"../object":19}],27:[function(require,module,exports){
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
},{"../events/eventEmitter":23,"./pluginManager":28}],28:[function(require,module,exports){
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
},{"../array":20,"../is":22,"../object":19,"./plugin":26}],23:[function(require,module,exports){
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
},{"events":32}],33:[function(require,module,exports){
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

},{}],32:[function(require,module,exports){
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

},{"__browserify_process":33}],31:[function(require,module,exports){
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
},{"../array":20,"../is":22,"../object":19}]},{},[1,4])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9ub2RlX21vZHVsZXMvZXM1LXNoaW0tc2hhbS9pbmRleC5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL3Rlc3QvbGliL2x1Yy5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL25vZGVfbW9kdWxlcy9lczUtc2hpbS1zaGFtL25vZGVfbW9kdWxlcy9lczUtc2hpbS9lczUtc2hpbS5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL25vZGVfbW9kdWxlcy9lczUtc2hpbS1zaGFtL25vZGVfbW9kdWxlcy9lczUtc2hpbS9lczUtc2hhbS5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL3Rlc3QvbHVjVGVzdExpYi5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL3Rlc3Qvb2JqZWN0LmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvdGVzdC9hcnJheS5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL3Rlc3Qvbm9kZXQuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy90ZXN0L2NsYXNzLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvdGVzdC9pcy5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL3Rlc3QvZnVuY3Rpb24uanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy90ZXN0L2NvbXBhcmUuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy90ZXN0L3N1Ym1vZHVsZS5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9pbnNlcnQtbW9kdWxlLWdsb2JhbHMvYnVmZmVyLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbm9kZV9tb2R1bGVzL2V4cGVjdC5qcy9leHBlY3QuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvbHVjLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvdGVzdC9jb21tb24uanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvaXMuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvaWQuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvZnVuY3Rpb24uanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvb2JqZWN0LmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2FycmF5LmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2FycmF5Rm5HZW5lcmF0b3IuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvY29tcGFyZS5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9jbGFzcy9iYXNlLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2NsYXNzL2RlZmluZXIuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvY2xhc3MvcGx1Z2luLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2NsYXNzL2NvbXBvc2l0aW9uRW51bXMuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvY2xhc3MvcGx1Z2luTWFuYWdlci5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9ldmVudHMvZXZlbnRFbWl0dGVyLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2luc2VydC1tb2R1bGUtZ2xvYmFscy9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItYnVpbHRpbnMvYnVpbHRpbi9ldmVudHMuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvY2xhc3MvY29tcG9zaXRpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNseUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzViQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDblFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNweEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNydUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2V0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6UUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbDlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbE1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCcuL25vZGVfbW9kdWxlcy9lczUtc2hpbS9lczUtc2hpbScpO1xucmVxdWlyZSgnLi9ub2RlX21vZHVsZXMvZXM1LXNoaW0vZXM1LXNoYW0nKTsiLCJyZXF1aXJlKCcuLi9hcnJheScpO1xucmVxdWlyZSgnLi4vb2JqZWN0Jyk7XG5yZXF1aXJlKCcuLi9ub2RldCcpO1xucmVxdWlyZSgnLi4vY2xhc3MnKTtcbnJlcXVpcmUoJy4uL2lzJyk7XG5yZXF1aXJlKCcuLi9mdW5jdGlvbicpO1xucmVxdWlyZSgnLi4vY29tcGFyZScpO1xucmVxdWlyZSgnLi4vc3VibW9kdWxlJyk7IiwiLy8gQ29weXJpZ2h0IDIwMDktMjAxMiBieSBjb250cmlidXRvcnMsIE1JVCBMaWNlbnNlXG4vLyB2aW06IHRzPTQgc3RzPTQgc3c9NCBleHBhbmR0YWJcblxuLy8gTW9kdWxlIHN5c3RlbXMgbWFnaWMgZGFuY2VcbihmdW5jdGlvbiAoZGVmaW5pdGlvbikge1xuICAgIC8vIFJlcXVpcmVKU1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBkZWZpbmUoZGVmaW5pdGlvbik7XG4gICAgLy8gWVVJM1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIFlVSSA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgWVVJLmFkZChcImVzNVwiLCBkZWZpbml0aW9uKTtcbiAgICAvLyBDb21tb25KUyBhbmQgPHNjcmlwdD5cbiAgICB9IGVsc2Uge1xuICAgICAgICBkZWZpbml0aW9uKCk7XG4gICAgfVxufSkoZnVuY3Rpb24gKCkge1xuXG4vKipcbiAqIEJyaW5ncyBhbiBlbnZpcm9ubWVudCBhcyBjbG9zZSB0byBFQ01BU2NyaXB0IDUgY29tcGxpYW5jZVxuICogYXMgaXMgcG9zc2libGUgd2l0aCB0aGUgZmFjaWxpdGllcyBvZiBlcnN0d2hpbGUgZW5naW5lcy5cbiAqXG4gKiBBbm5vdGF0ZWQgRVM1OiBodHRwOi8vZXM1LmdpdGh1Yi5jb20vIChzcGVjaWZpYyBsaW5rcyBiZWxvdylcbiAqIEVTNSBTcGVjOiBodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvcHVibGljYXRpb25zL2ZpbGVzL0VDTUEtU1QvRWNtYS0yNjIucGRmXG4gKiBSZXF1aXJlZCByZWFkaW5nOiBodHRwOi8vamF2YXNjcmlwdHdlYmxvZy53b3JkcHJlc3MuY29tLzIwMTEvMTIvMDUvZXh0ZW5kaW5nLWphdmFzY3JpcHQtbmF0aXZlcy9cbiAqL1xuXG4vL1xuLy8gRnVuY3Rpb25cbi8vID09PT09PT09XG4vL1xuXG4vLyBFUy01IDE1LjMuNC41XG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS4zLjQuNVxuXG5mdW5jdGlvbiBFbXB0eSgpIHt9XG5cbmlmICghRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQpIHtcbiAgICBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uIGJpbmQodGhhdCkgeyAvLyAubGVuZ3RoIGlzIDFcbiAgICAgICAgLy8gMS4gTGV0IFRhcmdldCBiZSB0aGUgdGhpcyB2YWx1ZS5cbiAgICAgICAgdmFyIHRhcmdldCA9IHRoaXM7XG4gICAgICAgIC8vIDIuIElmIElzQ2FsbGFibGUoVGFyZ2V0KSBpcyBmYWxzZSwgdGhyb3cgYSBUeXBlRXJyb3IgZXhjZXB0aW9uLlxuICAgICAgICBpZiAodHlwZW9mIHRhcmdldCAhPSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJGdW5jdGlvbi5wcm90b3R5cGUuYmluZCBjYWxsZWQgb24gaW5jb21wYXRpYmxlIFwiICsgdGFyZ2V0KTtcbiAgICAgICAgfVxuICAgICAgICAvLyAzLiBMZXQgQSBiZSBhIG5ldyAocG9zc2libHkgZW1wdHkpIGludGVybmFsIGxpc3Qgb2YgYWxsIG9mIHRoZVxuICAgICAgICAvLyAgIGFyZ3VtZW50IHZhbHVlcyBwcm92aWRlZCBhZnRlciB0aGlzQXJnIChhcmcxLCBhcmcyIGV0YyksIGluIG9yZGVyLlxuICAgICAgICAvLyBYWFggc2xpY2VkQXJncyB3aWxsIHN0YW5kIGluIGZvciBcIkFcIiBpZiB1c2VkXG4gICAgICAgIHZhciBhcmdzID0gX0FycmF5X3NsaWNlXy5jYWxsKGFyZ3VtZW50cywgMSk7IC8vIGZvciBub3JtYWwgY2FsbFxuICAgICAgICAvLyA0LiBMZXQgRiBiZSBhIG5ldyBuYXRpdmUgRUNNQVNjcmlwdCBvYmplY3QuXG4gICAgICAgIC8vIDExLiBTZXQgdGhlIFtbUHJvdG90eXBlXV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgRiB0byB0aGUgc3RhbmRhcmRcbiAgICAgICAgLy8gICBidWlsdC1pbiBGdW5jdGlvbiBwcm90b3R5cGUgb2JqZWN0IGFzIHNwZWNpZmllZCBpbiAxNS4zLjMuMS5cbiAgICAgICAgLy8gMTIuIFNldCB0aGUgW1tDYWxsXV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgRiBhcyBkZXNjcmliZWQgaW5cbiAgICAgICAgLy8gICAxNS4zLjQuNS4xLlxuICAgICAgICAvLyAxMy4gU2V0IHRoZSBbW0NvbnN0cnVjdF1dIGludGVybmFsIHByb3BlcnR5IG9mIEYgYXMgZGVzY3JpYmVkIGluXG4gICAgICAgIC8vICAgMTUuMy40LjUuMi5cbiAgICAgICAgLy8gMTQuIFNldCB0aGUgW1tIYXNJbnN0YW5jZV1dIGludGVybmFsIHByb3BlcnR5IG9mIEYgYXMgZGVzY3JpYmVkIGluXG4gICAgICAgIC8vICAgMTUuMy40LjUuMy5cbiAgICAgICAgdmFyIGJvdW5kID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIGJvdW5kKSB7XG4gICAgICAgICAgICAgICAgLy8gMTUuMy40LjUuMiBbW0NvbnN0cnVjdF1dXG4gICAgICAgICAgICAgICAgLy8gV2hlbiB0aGUgW1tDb25zdHJ1Y3RdXSBpbnRlcm5hbCBtZXRob2Qgb2YgYSBmdW5jdGlvbiBvYmplY3QsXG4gICAgICAgICAgICAgICAgLy8gRiB0aGF0IHdhcyBjcmVhdGVkIHVzaW5nIHRoZSBiaW5kIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aXRoIGFcbiAgICAgICAgICAgICAgICAvLyBsaXN0IG9mIGFyZ3VtZW50cyBFeHRyYUFyZ3MsIHRoZSBmb2xsb3dpbmcgc3RlcHMgYXJlIHRha2VuOlxuICAgICAgICAgICAgICAgIC8vIDEuIExldCB0YXJnZXQgYmUgdGhlIHZhbHVlIG9mIEYncyBbW1RhcmdldEZ1bmN0aW9uXV1cbiAgICAgICAgICAgICAgICAvLyAgIGludGVybmFsIHByb3BlcnR5LlxuICAgICAgICAgICAgICAgIC8vIDIuIElmIHRhcmdldCBoYXMgbm8gW1tDb25zdHJ1Y3RdXSBpbnRlcm5hbCBtZXRob2QsIGFcbiAgICAgICAgICAgICAgICAvLyAgIFR5cGVFcnJvciBleGNlcHRpb24gaXMgdGhyb3duLlxuICAgICAgICAgICAgICAgIC8vIDMuIExldCBib3VuZEFyZ3MgYmUgdGhlIHZhbHVlIG9mIEYncyBbW0JvdW5kQXJnc11dIGludGVybmFsXG4gICAgICAgICAgICAgICAgLy8gICBwcm9wZXJ0eS5cbiAgICAgICAgICAgICAgICAvLyA0LiBMZXQgYXJncyBiZSBhIG5ldyBsaXN0IGNvbnRhaW5pbmcgdGhlIHNhbWUgdmFsdWVzIGFzIHRoZVxuICAgICAgICAgICAgICAgIC8vICAgbGlzdCBib3VuZEFyZ3MgaW4gdGhlIHNhbWUgb3JkZXIgZm9sbG93ZWQgYnkgdGhlIHNhbWVcbiAgICAgICAgICAgICAgICAvLyAgIHZhbHVlcyBhcyB0aGUgbGlzdCBFeHRyYUFyZ3MgaW4gdGhlIHNhbWUgb3JkZXIuXG4gICAgICAgICAgICAgICAgLy8gNS4gUmV0dXJuIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tDb25zdHJ1Y3RdXSBpbnRlcm5hbFxuICAgICAgICAgICAgICAgIC8vICAgbWV0aG9kIG9mIHRhcmdldCBwcm92aWRpbmcgYXJncyBhcyB0aGUgYXJndW1lbnRzLlxuXG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHRhcmdldC5hcHBseShcbiAgICAgICAgICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgICAgICAgICAgYXJncy5jb25jYXQoX0FycmF5X3NsaWNlXy5jYWxsKGFyZ3VtZW50cykpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBpZiAoT2JqZWN0KHJlc3VsdCkgPT09IHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyAxNS4zLjQuNS4xIFtbQ2FsbF1dXG4gICAgICAgICAgICAgICAgLy8gV2hlbiB0aGUgW1tDYWxsXV0gaW50ZXJuYWwgbWV0aG9kIG9mIGEgZnVuY3Rpb24gb2JqZWN0LCBGLFxuICAgICAgICAgICAgICAgIC8vIHdoaWNoIHdhcyBjcmVhdGVkIHVzaW5nIHRoZSBiaW5kIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aXRoIGFcbiAgICAgICAgICAgICAgICAvLyB0aGlzIHZhbHVlIGFuZCBhIGxpc3Qgb2YgYXJndW1lbnRzIEV4dHJhQXJncywgdGhlIGZvbGxvd2luZ1xuICAgICAgICAgICAgICAgIC8vIHN0ZXBzIGFyZSB0YWtlbjpcbiAgICAgICAgICAgICAgICAvLyAxLiBMZXQgYm91bmRBcmdzIGJlIHRoZSB2YWx1ZSBvZiBGJ3MgW1tCb3VuZEFyZ3NdXSBpbnRlcm5hbFxuICAgICAgICAgICAgICAgIC8vICAgcHJvcGVydHkuXG4gICAgICAgICAgICAgICAgLy8gMi4gTGV0IGJvdW5kVGhpcyBiZSB0aGUgdmFsdWUgb2YgRidzIFtbQm91bmRUaGlzXV0gaW50ZXJuYWxcbiAgICAgICAgICAgICAgICAvLyAgIHByb3BlcnR5LlxuICAgICAgICAgICAgICAgIC8vIDMuIExldCB0YXJnZXQgYmUgdGhlIHZhbHVlIG9mIEYncyBbW1RhcmdldEZ1bmN0aW9uXV0gaW50ZXJuYWxcbiAgICAgICAgICAgICAgICAvLyAgIHByb3BlcnR5LlxuICAgICAgICAgICAgICAgIC8vIDQuIExldCBhcmdzIGJlIGEgbmV3IGxpc3QgY29udGFpbmluZyB0aGUgc2FtZSB2YWx1ZXMgYXMgdGhlXG4gICAgICAgICAgICAgICAgLy8gICBsaXN0IGJvdW5kQXJncyBpbiB0aGUgc2FtZSBvcmRlciBmb2xsb3dlZCBieSB0aGUgc2FtZVxuICAgICAgICAgICAgICAgIC8vICAgdmFsdWVzIGFzIHRoZSBsaXN0IEV4dHJhQXJncyBpbiB0aGUgc2FtZSBvcmRlci5cbiAgICAgICAgICAgICAgICAvLyA1LiBSZXR1cm4gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0NhbGxdXSBpbnRlcm5hbCBtZXRob2RcbiAgICAgICAgICAgICAgICAvLyAgIG9mIHRhcmdldCBwcm92aWRpbmcgYm91bmRUaGlzIGFzIHRoZSB0aGlzIHZhbHVlIGFuZFxuICAgICAgICAgICAgICAgIC8vICAgcHJvdmlkaW5nIGFyZ3MgYXMgdGhlIGFyZ3VtZW50cy5cblxuICAgICAgICAgICAgICAgIC8vIGVxdWl2OiB0YXJnZXQuY2FsbCh0aGlzLCAuLi5ib3VuZEFyZ3MsIC4uLmFyZ3MpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldC5hcHBseShcbiAgICAgICAgICAgICAgICAgICAgdGhhdCxcbiAgICAgICAgICAgICAgICAgICAgYXJncy5jb25jYXQoX0FycmF5X3NsaWNlXy5jYWxsKGFyZ3VtZW50cykpXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH07XG4gICAgICAgIGlmKHRhcmdldC5wcm90b3R5cGUpIHtcbiAgICAgICAgICAgIEVtcHR5LnByb3RvdHlwZSA9IHRhcmdldC5wcm90b3R5cGU7XG4gICAgICAgICAgICBib3VuZC5wcm90b3R5cGUgPSBuZXcgRW1wdHkoKTtcbiAgICAgICAgICAgIC8vIENsZWFuIHVwIGRhbmdsaW5nIHJlZmVyZW5jZXMuXG4gICAgICAgICAgICBFbXB0eS5wcm90b3R5cGUgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIC8vIFhYWCBib3VuZC5sZW5ndGggaXMgbmV2ZXIgd3JpdGFibGUsIHNvIGRvbid0IGV2ZW4gdHJ5XG4gICAgICAgIC8vXG4gICAgICAgIC8vIDE1LiBJZiB0aGUgW1tDbGFzc11dIGludGVybmFsIHByb3BlcnR5IG9mIFRhcmdldCBpcyBcIkZ1bmN0aW9uXCIsIHRoZW5cbiAgICAgICAgLy8gICAgIGEuIExldCBMIGJlIHRoZSBsZW5ndGggcHJvcGVydHkgb2YgVGFyZ2V0IG1pbnVzIHRoZSBsZW5ndGggb2YgQS5cbiAgICAgICAgLy8gICAgIGIuIFNldCB0aGUgbGVuZ3RoIG93biBwcm9wZXJ0eSBvZiBGIHRvIGVpdGhlciAwIG9yIEwsIHdoaWNoZXZlciBpc1xuICAgICAgICAvLyAgICAgICBsYXJnZXIuXG4gICAgICAgIC8vIDE2LiBFbHNlIHNldCB0aGUgbGVuZ3RoIG93biBwcm9wZXJ0eSBvZiBGIHRvIDAuXG4gICAgICAgIC8vIDE3LiBTZXQgdGhlIGF0dHJpYnV0ZXMgb2YgdGhlIGxlbmd0aCBvd24gcHJvcGVydHkgb2YgRiB0byB0aGUgdmFsdWVzXG4gICAgICAgIC8vICAgc3BlY2lmaWVkIGluIDE1LjMuNS4xLlxuXG4gICAgICAgIC8vIFRPRE9cbiAgICAgICAgLy8gMTguIFNldCB0aGUgW1tFeHRlbnNpYmxlXV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgRiB0byB0cnVlLlxuXG4gICAgICAgIC8vIFRPRE9cbiAgICAgICAgLy8gMTkuIExldCB0aHJvd2VyIGJlIHRoZSBbW1Rocm93VHlwZUVycm9yXV0gZnVuY3Rpb24gT2JqZWN0ICgxMy4yLjMpLlxuICAgICAgICAvLyAyMC4gQ2FsbCB0aGUgW1tEZWZpbmVPd25Qcm9wZXJ0eV1dIGludGVybmFsIG1ldGhvZCBvZiBGIHdpdGhcbiAgICAgICAgLy8gICBhcmd1bWVudHMgXCJjYWxsZXJcIiwgUHJvcGVydHlEZXNjcmlwdG9yIHtbW0dldF1dOiB0aHJvd2VyLCBbW1NldF1dOlxuICAgICAgICAvLyAgIHRocm93ZXIsIFtbRW51bWVyYWJsZV1dOiBmYWxzZSwgW1tDb25maWd1cmFibGVdXTogZmFsc2V9LCBhbmRcbiAgICAgICAgLy8gICBmYWxzZS5cbiAgICAgICAgLy8gMjEuIENhbGwgdGhlIFtbRGVmaW5lT3duUHJvcGVydHldXSBpbnRlcm5hbCBtZXRob2Qgb2YgRiB3aXRoXG4gICAgICAgIC8vICAgYXJndW1lbnRzIFwiYXJndW1lbnRzXCIsIFByb3BlcnR5RGVzY3JpcHRvciB7W1tHZXRdXTogdGhyb3dlcixcbiAgICAgICAgLy8gICBbW1NldF1dOiB0aHJvd2VyLCBbW0VudW1lcmFibGVdXTogZmFsc2UsIFtbQ29uZmlndXJhYmxlXV06IGZhbHNlfSxcbiAgICAgICAgLy8gICBhbmQgZmFsc2UuXG5cbiAgICAgICAgLy8gVE9ET1xuICAgICAgICAvLyBOT1RFIEZ1bmN0aW9uIG9iamVjdHMgY3JlYXRlZCB1c2luZyBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCBkbyBub3RcbiAgICAgICAgLy8gaGF2ZSBhIHByb3RvdHlwZSBwcm9wZXJ0eSBvciB0aGUgW1tDb2RlXV0sIFtbRm9ybWFsUGFyYW1ldGVyc11dLCBhbmRcbiAgICAgICAgLy8gW1tTY29wZV1dIGludGVybmFsIHByb3BlcnRpZXMuXG4gICAgICAgIC8vIFhYWCBjYW4ndCBkZWxldGUgcHJvdG90eXBlIGluIHB1cmUtanMuXG5cbiAgICAgICAgLy8gMjIuIFJldHVybiBGLlxuICAgICAgICByZXR1cm4gYm91bmQ7XG4gICAgfTtcbn1cblxuLy8gU2hvcnRjdXQgdG8gYW4gb2Z0ZW4gYWNjZXNzZWQgcHJvcGVydGllcywgaW4gb3JkZXIgdG8gYXZvaWQgbXVsdGlwbGVcbi8vIGRlcmVmZXJlbmNlIHRoYXQgY29zdHMgdW5pdmVyc2FsbHkuXG4vLyBfUGxlYXNlIG5vdGU6IFNob3J0Y3V0cyBhcmUgZGVmaW5lZCBhZnRlciBgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmRgIGFzIHdlXG4vLyB1cyBpdCBpbiBkZWZpbmluZyBzaG9ydGN1dHMuXG52YXIgY2FsbCA9IEZ1bmN0aW9uLnByb3RvdHlwZS5jYWxsO1xudmFyIHByb3RvdHlwZU9mQXJyYXkgPSBBcnJheS5wcm90b3R5cGU7XG52YXIgcHJvdG90eXBlT2ZPYmplY3QgPSBPYmplY3QucHJvdG90eXBlO1xudmFyIF9BcnJheV9zbGljZV8gPSBwcm90b3R5cGVPZkFycmF5LnNsaWNlO1xuLy8gSGF2aW5nIGEgdG9TdHJpbmcgbG9jYWwgdmFyaWFibGUgbmFtZSBicmVha3MgaW4gT3BlcmEgc28gdXNlIF90b1N0cmluZy5cbnZhciBfdG9TdHJpbmcgPSBjYWxsLmJpbmQocHJvdG90eXBlT2ZPYmplY3QudG9TdHJpbmcpO1xudmFyIG93bnMgPSBjYWxsLmJpbmQocHJvdG90eXBlT2ZPYmplY3QuaGFzT3duUHJvcGVydHkpO1xuXG4vLyBJZiBKUyBlbmdpbmUgc3VwcG9ydHMgYWNjZXNzb3JzIGNyZWF0aW5nIHNob3J0Y3V0cy5cbnZhciBkZWZpbmVHZXR0ZXI7XG52YXIgZGVmaW5lU2V0dGVyO1xudmFyIGxvb2t1cEdldHRlcjtcbnZhciBsb29rdXBTZXR0ZXI7XG52YXIgc3VwcG9ydHNBY2Nlc3NvcnM7XG5pZiAoKHN1cHBvcnRzQWNjZXNzb3JzID0gb3ducyhwcm90b3R5cGVPZk9iamVjdCwgXCJfX2RlZmluZUdldHRlcl9fXCIpKSkge1xuICAgIGRlZmluZUdldHRlciA9IGNhbGwuYmluZChwcm90b3R5cGVPZk9iamVjdC5fX2RlZmluZUdldHRlcl9fKTtcbiAgICBkZWZpbmVTZXR0ZXIgPSBjYWxsLmJpbmQocHJvdG90eXBlT2ZPYmplY3QuX19kZWZpbmVTZXR0ZXJfXyk7XG4gICAgbG9va3VwR2V0dGVyID0gY2FsbC5iaW5kKHByb3RvdHlwZU9mT2JqZWN0Ll9fbG9va3VwR2V0dGVyX18pO1xuICAgIGxvb2t1cFNldHRlciA9IGNhbGwuYmluZChwcm90b3R5cGVPZk9iamVjdC5fX2xvb2t1cFNldHRlcl9fKTtcbn1cblxuLy9cbi8vIEFycmF5XG4vLyA9PT09PVxuLy9cblxuLy8gRVM1IDE1LjQuNC4xMlxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNC40LjEyXG4vLyBEZWZhdWx0IHZhbHVlIGZvciBzZWNvbmQgcGFyYW1cbi8vIFtidWdmaXgsIGllbHQ5LCBvbGQgYnJvd3NlcnNdXG4vLyBJRSA8IDkgYnVnOiBbMSwyXS5zcGxpY2UoMCkuam9pbihcIlwiKSA9PSBcIlwiIGJ1dCBzaG91bGQgYmUgXCIxMlwiXG5pZiAoWzEsMl0uc3BsaWNlKDApLmxlbmd0aCAhPSAyKSB7XG4gICAgdmFyIGFycmF5X3NwbGljZSA9IEFycmF5LnByb3RvdHlwZS5zcGxpY2U7XG5cbiAgICBpZihmdW5jdGlvbigpIHsgLy8gdGVzdCBJRSA8IDkgdG8gc3BsaWNlIGJ1ZyAtIHNlZSBpc3N1ZSAjMTM4XG4gICAgICAgIGZ1bmN0aW9uIG1ha2VBcnJheShsKSB7XG4gICAgICAgICAgICB2YXIgYSA9IFtdO1xuICAgICAgICAgICAgd2hpbGUgKGwtLSkge1xuICAgICAgICAgICAgICAgIGEudW5zaGlmdChsKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGFcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBhcnJheSA9IFtdXG4gICAgICAgICAgICAsIGxlbmd0aEJlZm9yZVxuICAgICAgICA7XG5cbiAgICAgICAgYXJyYXkuc3BsaWNlLmJpbmQoYXJyYXksIDAsIDApLmFwcGx5KG51bGwsIG1ha2VBcnJheSgyMCkpO1xuICAgICAgICBhcnJheS5zcGxpY2UuYmluZChhcnJheSwgMCwgMCkuYXBwbHkobnVsbCwgbWFrZUFycmF5KDI2KSk7XG5cbiAgICAgICAgbGVuZ3RoQmVmb3JlID0gYXJyYXkubGVuZ3RoOyAvLzIwXG4gICAgICAgIGFycmF5LnNwbGljZSg1LCAwLCBcIlhYWFwiKTsgLy8gYWRkIG9uZSBlbGVtZW50XG5cbiAgICAgICAgaWYobGVuZ3RoQmVmb3JlICsgMSA9PSBhcnJheS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlOy8vIGhhcyByaWdodCBzcGxpY2UgaW1wbGVtZW50YXRpb24gd2l0aG91dCBidWdzXG4gICAgICAgIH1cbiAgICAgICAgLy8gZWxzZSB7XG4gICAgICAgIC8vICAgIElFOCBidWdcbiAgICAgICAgLy8gfVxuICAgIH0oKSkgey8vSUUgNi83XG4gICAgICAgIEFycmF5LnByb3RvdHlwZS5zcGxpY2UgPSBmdW5jdGlvbihzdGFydCwgZGVsZXRlQ291bnQpIHtcbiAgICAgICAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFycmF5X3NwbGljZS5hcHBseSh0aGlzLCBbXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0ID09PSB2b2lkIDAgPyAwIDogc3RhcnQsXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZUNvdW50ID09PSB2b2lkIDAgPyAodGhpcy5sZW5ndGggLSBzdGFydCkgOiBkZWxldGVDb3VudFxuICAgICAgICAgICAgICAgIF0uY29uY2F0KF9BcnJheV9zbGljZV8uY2FsbChhcmd1bWVudHMsIDIpKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgZWxzZSB7Ly9JRThcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnNwbGljZSA9IGZ1bmN0aW9uKHN0YXJ0LCBkZWxldGVDb3VudCkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdFxuICAgICAgICAgICAgICAgICwgYXJncyA9IF9BcnJheV9zbGljZV8uY2FsbChhcmd1bWVudHMsIDIpXG4gICAgICAgICAgICAgICAgLCBhZGRFbGVtZW50c0NvdW50ID0gYXJncy5sZW5ndGhcbiAgICAgICAgICAgIDtcblxuICAgICAgICAgICAgaWYoIWFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHN0YXJ0ID09PSB2b2lkIDApIHsgLy8gZGVmYXVsdFxuICAgICAgICAgICAgICAgIHN0YXJ0ID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKGRlbGV0ZUNvdW50ID09PSB2b2lkIDApIHsgLy8gZGVmYXVsdFxuICAgICAgICAgICAgICAgIGRlbGV0ZUNvdW50ID0gdGhpcy5sZW5ndGggLSBzdGFydDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoYWRkRWxlbWVudHNDb3VudCA+IDApIHtcbiAgICAgICAgICAgICAgICBpZihkZWxldGVDb3VudCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKHN0YXJ0ID09IHRoaXMubGVuZ3RoKSB7IC8vIHRpbnkgb3B0aW1pc2F0aW9uICMxXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnB1c2guYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZihzdGFydCA9PSAwKSB7IC8vIHRpbnkgb3B0aW1pc2F0aW9uICMyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVuc2hpZnQuYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBBcnJheS5wcm90b3R5cGUuc3BsaWNlIGltcGxlbWVudGF0aW9uXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gX0FycmF5X3NsaWNlXy5jYWxsKHRoaXMsIHN0YXJ0LCBzdGFydCArIGRlbGV0ZUNvdW50KTsvLyBkZWxldGUgcGFydFxuICAgICAgICAgICAgICAgIGFyZ3MucHVzaC5hcHBseShhcmdzLCBfQXJyYXlfc2xpY2VfLmNhbGwodGhpcywgc3RhcnQgKyBkZWxldGVDb3VudCwgdGhpcy5sZW5ndGgpKTsvLyByaWdodCBwYXJ0XG4gICAgICAgICAgICAgICAgYXJncy51bnNoaWZ0LmFwcGx5KGFyZ3MsIF9BcnJheV9zbGljZV8uY2FsbCh0aGlzLCAwLCBzdGFydCkpOy8vIGxlZnQgcGFydFxuXG4gICAgICAgICAgICAgICAgLy8gZGVsZXRlIGFsbCBpdGVtcyBmcm9tIHRoaXMgYXJyYXkgYW5kIHJlcGxhY2UgaXQgdG8gJ2xlZnQgcGFydCcgKyBfQXJyYXlfc2xpY2VfLmNhbGwoYXJndW1lbnRzLCAyKSArICdyaWdodCBwYXJ0J1xuICAgICAgICAgICAgICAgIGFyZ3MudW5zaGlmdCgwLCB0aGlzLmxlbmd0aCk7XG5cbiAgICAgICAgICAgICAgICBhcnJheV9zcGxpY2UuYXBwbHkodGhpcywgYXJncyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gYXJyYXlfc3BsaWNlLmNhbGwodGhpcywgc3RhcnQsIGRlbGV0ZUNvdW50KTtcbiAgICAgICAgfVxuXG4gICAgfVxufVxuXG4vLyBFUzUgMTUuNC40LjEyXG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS40LjQuMTNcbi8vIFJldHVybiBsZW4rYXJnQ291bnQuXG4vLyBbYnVnZml4LCBpZWx0OF1cbi8vIElFIDwgOCBidWc6IFtdLnVuc2hpZnQoMCkgPT0gdW5kZWZpbmVkIGJ1dCBzaG91bGQgYmUgXCIxXCJcbmlmIChbXS51bnNoaWZ0KDApICE9IDEpIHtcbiAgICB2YXIgYXJyYXlfdW5zaGlmdCA9IEFycmF5LnByb3RvdHlwZS51bnNoaWZ0O1xuICAgIEFycmF5LnByb3RvdHlwZS51bnNoaWZ0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGFycmF5X3Vuc2hpZnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIHRoaXMubGVuZ3RoO1xuICAgIH07XG59XG5cbi8vIEVTNSAxNS40LjMuMlxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNC4zLjJcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L2lzQXJyYXlcbmlmICghQXJyYXkuaXNBcnJheSkge1xuICAgIEFycmF5LmlzQXJyYXkgPSBmdW5jdGlvbiBpc0FycmF5KG9iaikge1xuICAgICAgICByZXR1cm4gX3RvU3RyaW5nKG9iaikgPT0gXCJbb2JqZWN0IEFycmF5XVwiO1xuICAgIH07XG59XG5cbi8vIFRoZSBJc0NhbGxhYmxlKCkgY2hlY2sgaW4gdGhlIEFycmF5IGZ1bmN0aW9uc1xuLy8gaGFzIGJlZW4gcmVwbGFjZWQgd2l0aCBhIHN0cmljdCBjaGVjayBvbiB0aGVcbi8vIGludGVybmFsIGNsYXNzIG9mIHRoZSBvYmplY3QgdG8gdHJhcCBjYXNlcyB3aGVyZVxuLy8gdGhlIHByb3ZpZGVkIGZ1bmN0aW9uIHdhcyBhY3R1YWxseSBhIHJlZ3VsYXJcbi8vIGV4cHJlc3Npb24gbGl0ZXJhbCwgd2hpY2ggaW4gVjggYW5kXG4vLyBKYXZhU2NyaXB0Q29yZSBpcyBhIHR5cGVvZiBcImZ1bmN0aW9uXCIuICBPbmx5IGluXG4vLyBWOCBhcmUgcmVndWxhciBleHByZXNzaW9uIGxpdGVyYWxzIHBlcm1pdHRlZCBhc1xuLy8gcmVkdWNlIHBhcmFtZXRlcnMsIHNvIGl0IGlzIGRlc2lyYWJsZSBpbiB0aGVcbi8vIGdlbmVyYWwgY2FzZSBmb3IgdGhlIHNoaW0gdG8gbWF0Y2ggdGhlIG1vcmVcbi8vIHN0cmljdCBhbmQgY29tbW9uIGJlaGF2aW9yIG9mIHJlamVjdGluZyByZWd1bGFyXG4vLyBleHByZXNzaW9ucy5cblxuLy8gRVM1IDE1LjQuNC4xOFxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNC40LjE4XG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9hcnJheS9mb3JFYWNoXG5cbi8vIENoZWNrIGZhaWx1cmUgb2YgYnktaW5kZXggYWNjZXNzIG9mIHN0cmluZyBjaGFyYWN0ZXJzIChJRSA8IDkpXG4vLyBhbmQgZmFpbHVyZSBvZiBgMCBpbiBib3hlZFN0cmluZ2AgKFJoaW5vKVxudmFyIGJveGVkU3RyaW5nID0gT2JqZWN0KFwiYVwiKSxcbiAgICBzcGxpdFN0cmluZyA9IGJveGVkU3RyaW5nWzBdICE9IFwiYVwiIHx8ICEoMCBpbiBib3hlZFN0cmluZyk7XG5cbmlmICghQXJyYXkucHJvdG90eXBlLmZvckVhY2gpIHtcbiAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIGZvckVhY2goZnVuIC8qLCB0aGlzcCovKSB7XG4gICAgICAgIHZhciBvYmplY3QgPSB0b09iamVjdCh0aGlzKSxcbiAgICAgICAgICAgIHNlbGYgPSBzcGxpdFN0cmluZyAmJiBfdG9TdHJpbmcodGhpcykgPT0gXCJbb2JqZWN0IFN0cmluZ11cIiA/XG4gICAgICAgICAgICAgICAgdGhpcy5zcGxpdChcIlwiKSA6XG4gICAgICAgICAgICAgICAgb2JqZWN0LFxuICAgICAgICAgICAgdGhpc3AgPSBhcmd1bWVudHNbMV0sXG4gICAgICAgICAgICBpID0gLTEsXG4gICAgICAgICAgICBsZW5ndGggPSBzZWxmLmxlbmd0aCA+Pj4gMDtcblxuICAgICAgICAvLyBJZiBubyBjYWxsYmFjayBmdW5jdGlvbiBvciBpZiBjYWxsYmFjayBpcyBub3QgYSBjYWxsYWJsZSBmdW5jdGlvblxuICAgICAgICBpZiAoX3RvU3RyaW5nKGZ1bikgIT0gXCJbb2JqZWN0IEZ1bmN0aW9uXVwiKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7IC8vIFRPRE8gbWVzc2FnZVxuICAgICAgICB9XG5cbiAgICAgICAgd2hpbGUgKCsraSA8IGxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGkgaW4gc2VsZikge1xuICAgICAgICAgICAgICAgIC8vIEludm9rZSB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gd2l0aCBjYWxsLCBwYXNzaW5nIGFyZ3VtZW50czpcbiAgICAgICAgICAgICAgICAvLyBjb250ZXh0LCBwcm9wZXJ0eSB2YWx1ZSwgcHJvcGVydHkga2V5LCB0aGlzQXJnIG9iamVjdFxuICAgICAgICAgICAgICAgIC8vIGNvbnRleHRcbiAgICAgICAgICAgICAgICBmdW4uY2FsbCh0aGlzcCwgc2VsZltpXSwgaSwgb2JqZWN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59XG5cbi8vIEVTNSAxNS40LjQuMTlcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjQuNC4xOVxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vQ29yZV9KYXZhU2NyaXB0XzEuNV9SZWZlcmVuY2UvT2JqZWN0cy9BcnJheS9tYXBcbmlmICghQXJyYXkucHJvdG90eXBlLm1hcCkge1xuICAgIEFycmF5LnByb3RvdHlwZS5tYXAgPSBmdW5jdGlvbiBtYXAoZnVuIC8qLCB0aGlzcCovKSB7XG4gICAgICAgIHZhciBvYmplY3QgPSB0b09iamVjdCh0aGlzKSxcbiAgICAgICAgICAgIHNlbGYgPSBzcGxpdFN0cmluZyAmJiBfdG9TdHJpbmcodGhpcykgPT0gXCJbb2JqZWN0IFN0cmluZ11cIiA/XG4gICAgICAgICAgICAgICAgdGhpcy5zcGxpdChcIlwiKSA6XG4gICAgICAgICAgICAgICAgb2JqZWN0LFxuICAgICAgICAgICAgbGVuZ3RoID0gc2VsZi5sZW5ndGggPj4+IDAsXG4gICAgICAgICAgICByZXN1bHQgPSBBcnJheShsZW5ndGgpLFxuICAgICAgICAgICAgdGhpc3AgPSBhcmd1bWVudHNbMV07XG5cbiAgICAgICAgLy8gSWYgbm8gY2FsbGJhY2sgZnVuY3Rpb24gb3IgaWYgY2FsbGJhY2sgaXMgbm90IGEgY2FsbGFibGUgZnVuY3Rpb25cbiAgICAgICAgaWYgKF90b1N0cmluZyhmdW4pICE9IFwiW29iamVjdCBGdW5jdGlvbl1cIikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihmdW4gKyBcIiBpcyBub3QgYSBmdW5jdGlvblwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChpIGluIHNlbGYpXG4gICAgICAgICAgICAgICAgcmVzdWx0W2ldID0gZnVuLmNhbGwodGhpc3AsIHNlbGZbaV0sIGksIG9iamVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xufVxuXG4vLyBFUzUgMTUuNC40LjIwXG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS40LjQuMjBcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0NvcmVfSmF2YVNjcmlwdF8xLjVfUmVmZXJlbmNlL09iamVjdHMvQXJyYXkvZmlsdGVyXG5pZiAoIUFycmF5LnByb3RvdHlwZS5maWx0ZXIpIHtcbiAgICBBcnJheS5wcm90b3R5cGUuZmlsdGVyID0gZnVuY3Rpb24gZmlsdGVyKGZ1biAvKiwgdGhpc3AgKi8pIHtcbiAgICAgICAgdmFyIG9iamVjdCA9IHRvT2JqZWN0KHRoaXMpLFxuICAgICAgICAgICAgc2VsZiA9IHNwbGl0U3RyaW5nICYmIF90b1N0cmluZyh0aGlzKSA9PSBcIltvYmplY3QgU3RyaW5nXVwiID9cbiAgICAgICAgICAgICAgICB0aGlzLnNwbGl0KFwiXCIpIDpcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0LFxuICAgICAgICAgICAgbGVuZ3RoID0gc2VsZi5sZW5ndGggPj4+IDAsXG4gICAgICAgICAgICByZXN1bHQgPSBbXSxcbiAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgdGhpc3AgPSBhcmd1bWVudHNbMV07XG5cbiAgICAgICAgLy8gSWYgbm8gY2FsbGJhY2sgZnVuY3Rpb24gb3IgaWYgY2FsbGJhY2sgaXMgbm90IGEgY2FsbGFibGUgZnVuY3Rpb25cbiAgICAgICAgaWYgKF90b1N0cmluZyhmdW4pICE9IFwiW29iamVjdCBGdW5jdGlvbl1cIikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihmdW4gKyBcIiBpcyBub3QgYSBmdW5jdGlvblwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChpIGluIHNlbGYpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHNlbGZbaV07XG4gICAgICAgICAgICAgICAgaWYgKGZ1bi5jYWxsKHRoaXNwLCB2YWx1ZSwgaSwgb2JqZWN0KSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbn1cblxuLy8gRVM1IDE1LjQuNC4xNlxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNC40LjE2XG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9ldmVyeVxuaWYgKCFBcnJheS5wcm90b3R5cGUuZXZlcnkpIHtcbiAgICBBcnJheS5wcm90b3R5cGUuZXZlcnkgPSBmdW5jdGlvbiBldmVyeShmdW4gLyosIHRoaXNwICovKSB7XG4gICAgICAgIHZhciBvYmplY3QgPSB0b09iamVjdCh0aGlzKSxcbiAgICAgICAgICAgIHNlbGYgPSBzcGxpdFN0cmluZyAmJiBfdG9TdHJpbmcodGhpcykgPT0gXCJbb2JqZWN0IFN0cmluZ11cIiA/XG4gICAgICAgICAgICAgICAgdGhpcy5zcGxpdChcIlwiKSA6XG4gICAgICAgICAgICAgICAgb2JqZWN0LFxuICAgICAgICAgICAgbGVuZ3RoID0gc2VsZi5sZW5ndGggPj4+IDAsXG4gICAgICAgICAgICB0aGlzcCA9IGFyZ3VtZW50c1sxXTtcblxuICAgICAgICAvLyBJZiBubyBjYWxsYmFjayBmdW5jdGlvbiBvciBpZiBjYWxsYmFjayBpcyBub3QgYSBjYWxsYWJsZSBmdW5jdGlvblxuICAgICAgICBpZiAoX3RvU3RyaW5nKGZ1bikgIT0gXCJbb2JqZWN0IEZ1bmN0aW9uXVwiKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGZ1biArIFwiIGlzIG5vdCBhIGZ1bmN0aW9uXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGkgaW4gc2VsZiAmJiAhZnVuLmNhbGwodGhpc3AsIHNlbGZbaV0sIGksIG9iamVjdCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcbn1cblxuLy8gRVM1IDE1LjQuNC4xN1xuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNC40LjE3XG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9zb21lXG5pZiAoIUFycmF5LnByb3RvdHlwZS5zb21lKSB7XG4gICAgQXJyYXkucHJvdG90eXBlLnNvbWUgPSBmdW5jdGlvbiBzb21lKGZ1biAvKiwgdGhpc3AgKi8pIHtcbiAgICAgICAgdmFyIG9iamVjdCA9IHRvT2JqZWN0KHRoaXMpLFxuICAgICAgICAgICAgc2VsZiA9IHNwbGl0U3RyaW5nICYmIF90b1N0cmluZyh0aGlzKSA9PSBcIltvYmplY3QgU3RyaW5nXVwiID9cbiAgICAgICAgICAgICAgICB0aGlzLnNwbGl0KFwiXCIpIDpcbiAgICAgICAgICAgICAgICBvYmplY3QsXG4gICAgICAgICAgICBsZW5ndGggPSBzZWxmLmxlbmd0aCA+Pj4gMCxcbiAgICAgICAgICAgIHRoaXNwID0gYXJndW1lbnRzWzFdO1xuXG4gICAgICAgIC8vIElmIG5vIGNhbGxiYWNrIGZ1bmN0aW9uIG9yIGlmIGNhbGxiYWNrIGlzIG5vdCBhIGNhbGxhYmxlIGZ1bmN0aW9uXG4gICAgICAgIGlmIChfdG9TdHJpbmcoZnVuKSAhPSBcIltvYmplY3QgRnVuY3Rpb25dXCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoZnVuICsgXCIgaXMgbm90IGEgZnVuY3Rpb25cIik7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoaSBpbiBzZWxmICYmIGZ1bi5jYWxsKHRoaXNwLCBzZWxmW2ldLCBpLCBvYmplY3QpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG59XG5cbi8vIEVTNSAxNS40LjQuMjFcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjQuNC4yMVxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vQ29yZV9KYXZhU2NyaXB0XzEuNV9SZWZlcmVuY2UvT2JqZWN0cy9BcnJheS9yZWR1Y2VcbmlmICghQXJyYXkucHJvdG90eXBlLnJlZHVjZSkge1xuICAgIEFycmF5LnByb3RvdHlwZS5yZWR1Y2UgPSBmdW5jdGlvbiByZWR1Y2UoZnVuIC8qLCBpbml0aWFsKi8pIHtcbiAgICAgICAgdmFyIG9iamVjdCA9IHRvT2JqZWN0KHRoaXMpLFxuICAgICAgICAgICAgc2VsZiA9IHNwbGl0U3RyaW5nICYmIF90b1N0cmluZyh0aGlzKSA9PSBcIltvYmplY3QgU3RyaW5nXVwiID9cbiAgICAgICAgICAgICAgICB0aGlzLnNwbGl0KFwiXCIpIDpcbiAgICAgICAgICAgICAgICBvYmplY3QsXG4gICAgICAgICAgICBsZW5ndGggPSBzZWxmLmxlbmd0aCA+Pj4gMDtcblxuICAgICAgICAvLyBJZiBubyBjYWxsYmFjayBmdW5jdGlvbiBvciBpZiBjYWxsYmFjayBpcyBub3QgYSBjYWxsYWJsZSBmdW5jdGlvblxuICAgICAgICBpZiAoX3RvU3RyaW5nKGZ1bikgIT0gXCJbb2JqZWN0IEZ1bmN0aW9uXVwiKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGZ1biArIFwiIGlzIG5vdCBhIGZ1bmN0aW9uXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbm8gdmFsdWUgdG8gcmV0dXJuIGlmIG5vIGluaXRpYWwgdmFsdWUgYW5kIGFuIGVtcHR5IGFycmF5XG4gICAgICAgIGlmICghbGVuZ3RoICYmIGFyZ3VtZW50cy5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcInJlZHVjZSBvZiBlbXB0eSBhcnJheSB3aXRoIG5vIGluaXRpYWwgdmFsdWVcIik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaSA9IDA7XG4gICAgICAgIHZhciByZXN1bHQ7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDIpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICBpZiAoaSBpbiBzZWxmKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHNlbGZbaSsrXTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gaWYgYXJyYXkgY29udGFpbnMgbm8gdmFsdWVzLCBubyBpbml0aWFsIHZhbHVlIHRvIHJldHVyblxuICAgICAgICAgICAgICAgIGlmICgrK2kgPj0gbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJyZWR1Y2Ugb2YgZW1wdHkgYXJyYXkgd2l0aCBubyBpbml0aWFsIHZhbHVlXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gd2hpbGUgKHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGkgaW4gc2VsZikge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGZ1bi5jYWxsKHZvaWQgMCwgcmVzdWx0LCBzZWxmW2ldLCBpLCBvYmplY3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xufVxuXG4vLyBFUzUgMTUuNC40LjIyXG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS40LjQuMjJcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0NvcmVfSmF2YVNjcmlwdF8xLjVfUmVmZXJlbmNlL09iamVjdHMvQXJyYXkvcmVkdWNlUmlnaHRcbmlmICghQXJyYXkucHJvdG90eXBlLnJlZHVjZVJpZ2h0KSB7XG4gICAgQXJyYXkucHJvdG90eXBlLnJlZHVjZVJpZ2h0ID0gZnVuY3Rpb24gcmVkdWNlUmlnaHQoZnVuIC8qLCBpbml0aWFsKi8pIHtcbiAgICAgICAgdmFyIG9iamVjdCA9IHRvT2JqZWN0KHRoaXMpLFxuICAgICAgICAgICAgc2VsZiA9IHNwbGl0U3RyaW5nICYmIF90b1N0cmluZyh0aGlzKSA9PSBcIltvYmplY3QgU3RyaW5nXVwiID9cbiAgICAgICAgICAgICAgICB0aGlzLnNwbGl0KFwiXCIpIDpcbiAgICAgICAgICAgICAgICBvYmplY3QsXG4gICAgICAgICAgICBsZW5ndGggPSBzZWxmLmxlbmd0aCA+Pj4gMDtcblxuICAgICAgICAvLyBJZiBubyBjYWxsYmFjayBmdW5jdGlvbiBvciBpZiBjYWxsYmFjayBpcyBub3QgYSBjYWxsYWJsZSBmdW5jdGlvblxuICAgICAgICBpZiAoX3RvU3RyaW5nKGZ1bikgIT0gXCJbb2JqZWN0IEZ1bmN0aW9uXVwiKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGZ1biArIFwiIGlzIG5vdCBhIGZ1bmN0aW9uXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbm8gdmFsdWUgdG8gcmV0dXJuIGlmIG5vIGluaXRpYWwgdmFsdWUsIGVtcHR5IGFycmF5XG4gICAgICAgIGlmICghbGVuZ3RoICYmIGFyZ3VtZW50cy5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcInJlZHVjZVJpZ2h0IG9mIGVtcHR5IGFycmF5IHdpdGggbm8gaW5pdGlhbCB2YWx1ZVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciByZXN1bHQsIGkgPSBsZW5ndGggLSAxO1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBhcmd1bWVudHNbMV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgaWYgKGkgaW4gc2VsZikge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBzZWxmW2ktLV07XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIGlmIGFycmF5IGNvbnRhaW5zIG5vIHZhbHVlcywgbm8gaW5pdGlhbCB2YWx1ZSB0byByZXR1cm5cbiAgICAgICAgICAgICAgICBpZiAoLS1pIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwicmVkdWNlUmlnaHQgb2YgZW1wdHkgYXJyYXkgd2l0aCBubyBpbml0aWFsIHZhbHVlXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gd2hpbGUgKHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGkgPCAwKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgaWYgKGkgaW4gdGhpcykge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGZ1bi5jYWxsKHZvaWQgMCwgcmVzdWx0LCBzZWxmW2ldLCBpLCBvYmplY3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IHdoaWxlIChpLS0pO1xuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbn1cblxuLy8gRVM1IDE1LjQuNC4xNFxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNC40LjE0XG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9pbmRleE9mXG5pZiAoIUFycmF5LnByb3RvdHlwZS5pbmRleE9mIHx8IChbMCwgMV0uaW5kZXhPZigxLCAyKSAhPSAtMSkpIHtcbiAgICBBcnJheS5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uIGluZGV4T2Yoc291Z2h0IC8qLCBmcm9tSW5kZXggKi8gKSB7XG4gICAgICAgIHZhciBzZWxmID0gc3BsaXRTdHJpbmcgJiYgX3RvU3RyaW5nKHRoaXMpID09IFwiW29iamVjdCBTdHJpbmddXCIgP1xuICAgICAgICAgICAgICAgIHRoaXMuc3BsaXQoXCJcIikgOlxuICAgICAgICAgICAgICAgIHRvT2JqZWN0KHRoaXMpLFxuICAgICAgICAgICAgbGVuZ3RoID0gc2VsZi5sZW5ndGggPj4+IDA7XG5cbiAgICAgICAgaWYgKCFsZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICBpID0gdG9JbnRlZ2VyKGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBoYW5kbGUgbmVnYXRpdmUgaW5kaWNlc1xuICAgICAgICBpID0gaSA+PSAwID8gaSA6IE1hdGgubWF4KDAsIGxlbmd0aCArIGkpO1xuICAgICAgICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoaSBpbiBzZWxmICYmIHNlbGZbaV0gPT09IHNvdWdodCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9O1xufVxuXG4vLyBFUzUgMTUuNC40LjE1XG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS40LjQuMTVcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L2xhc3RJbmRleE9mXG5pZiAoIUFycmF5LnByb3RvdHlwZS5sYXN0SW5kZXhPZiB8fCAoWzAsIDFdLmxhc3RJbmRleE9mKDAsIC0zKSAhPSAtMSkpIHtcbiAgICBBcnJheS5wcm90b3R5cGUubGFzdEluZGV4T2YgPSBmdW5jdGlvbiBsYXN0SW5kZXhPZihzb3VnaHQgLyosIGZyb21JbmRleCAqLykge1xuICAgICAgICB2YXIgc2VsZiA9IHNwbGl0U3RyaW5nICYmIF90b1N0cmluZyh0aGlzKSA9PSBcIltvYmplY3QgU3RyaW5nXVwiID9cbiAgICAgICAgICAgICAgICB0aGlzLnNwbGl0KFwiXCIpIDpcbiAgICAgICAgICAgICAgICB0b09iamVjdCh0aGlzKSxcbiAgICAgICAgICAgIGxlbmd0aCA9IHNlbGYubGVuZ3RoID4+PiAwO1xuXG4gICAgICAgIGlmICghbGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGkgPSBsZW5ndGggLSAxO1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIGkgPSBNYXRoLm1pbihpLCB0b0ludGVnZXIoYXJndW1lbnRzWzFdKSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gaGFuZGxlIG5lZ2F0aXZlIGluZGljZXNcbiAgICAgICAgaSA9IGkgPj0gMCA/IGkgOiBsZW5ndGggLSBNYXRoLmFicyhpKTtcbiAgICAgICAgZm9yICg7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBpZiAoaSBpbiBzZWxmICYmIHNvdWdodCA9PT0gc2VsZltpXSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9O1xufVxuXG4vL1xuLy8gT2JqZWN0XG4vLyA9PT09PT1cbi8vXG5cbi8vIEVTNSAxNS4yLjMuMTRcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjIuMy4xNFxuaWYgKCFPYmplY3Qua2V5cykge1xuICAgIC8vIGh0dHA6Ly93aGF0dGhlaGVhZHNhaWQuY29tLzIwMTAvMTAvYS1zYWZlci1vYmplY3Qta2V5cy1jb21wYXRpYmlsaXR5LWltcGxlbWVudGF0aW9uXG4gICAgdmFyIGhhc0RvbnRFbnVtQnVnID0gdHJ1ZSxcbiAgICAgICAgZG9udEVudW1zID0gW1xuICAgICAgICAgICAgXCJ0b1N0cmluZ1wiLFxuICAgICAgICAgICAgXCJ0b0xvY2FsZVN0cmluZ1wiLFxuICAgICAgICAgICAgXCJ2YWx1ZU9mXCIsXG4gICAgICAgICAgICBcImhhc093blByb3BlcnR5XCIsXG4gICAgICAgICAgICBcImlzUHJvdG90eXBlT2ZcIixcbiAgICAgICAgICAgIFwicHJvcGVydHlJc0VudW1lcmFibGVcIixcbiAgICAgICAgICAgIFwiY29uc3RydWN0b3JcIlxuICAgICAgICBdLFxuICAgICAgICBkb250RW51bXNMZW5ndGggPSBkb250RW51bXMubGVuZ3RoO1xuXG4gICAgZm9yICh2YXIga2V5IGluIHtcInRvU3RyaW5nXCI6IG51bGx9KSB7XG4gICAgICAgIGhhc0RvbnRFbnVtQnVnID0gZmFsc2U7XG4gICAgfVxuXG4gICAgT2JqZWN0LmtleXMgPSBmdW5jdGlvbiBrZXlzKG9iamVjdCkge1xuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgICh0eXBlb2Ygb2JqZWN0ICE9IFwib2JqZWN0XCIgJiYgdHlwZW9mIG9iamVjdCAhPSBcImZ1bmN0aW9uXCIpIHx8XG4gICAgICAgICAgICBvYmplY3QgPT09IG51bGxcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiT2JqZWN0LmtleXMgY2FsbGVkIG9uIGEgbm9uLW9iamVjdFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBrZXlzID0gW107XG4gICAgICAgIGZvciAodmFyIG5hbWUgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgICBpZiAob3ducyhvYmplY3QsIG5hbWUpKSB7XG4gICAgICAgICAgICAgICAga2V5cy5wdXNoKG5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhhc0RvbnRFbnVtQnVnKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaWkgPSBkb250RW51bXNMZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRvbnRFbnVtID0gZG9udEVudW1zW2ldO1xuICAgICAgICAgICAgICAgIGlmIChvd25zKG9iamVjdCwgZG9udEVudW0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGtleXMucHVzaChkb250RW51bSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBrZXlzO1xuICAgIH07XG5cbn1cblxuLy9cbi8vIERhdGVcbi8vID09PT1cbi8vXG5cbi8vIEVTNSAxNS45LjUuNDNcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjkuNS40M1xuLy8gVGhpcyBmdW5jdGlvbiByZXR1cm5zIGEgU3RyaW5nIHZhbHVlIHJlcHJlc2VudCB0aGUgaW5zdGFuY2UgaW4gdGltZVxuLy8gcmVwcmVzZW50ZWQgYnkgdGhpcyBEYXRlIG9iamVjdC4gVGhlIGZvcm1hdCBvZiB0aGUgU3RyaW5nIGlzIHRoZSBEYXRlIFRpbWVcbi8vIHN0cmluZyBmb3JtYXQgZGVmaW5lZCBpbiAxNS45LjEuMTUuIEFsbCBmaWVsZHMgYXJlIHByZXNlbnQgaW4gdGhlIFN0cmluZy5cbi8vIFRoZSB0aW1lIHpvbmUgaXMgYWx3YXlzIFVUQywgZGVub3RlZCBieSB0aGUgc3VmZml4IFouIElmIHRoZSB0aW1lIHZhbHVlIG9mXG4vLyB0aGlzIG9iamVjdCBpcyBub3QgYSBmaW5pdGUgTnVtYmVyIGEgUmFuZ2VFcnJvciBleGNlcHRpb24gaXMgdGhyb3duLlxudmFyIG5lZ2F0aXZlRGF0ZSA9IC02MjE5ODc1NTIwMDAwMCxcbiAgICBuZWdhdGl2ZVllYXJTdHJpbmcgPSBcIi0wMDAwMDFcIjtcbmlmIChcbiAgICAhRGF0ZS5wcm90b3R5cGUudG9JU09TdHJpbmcgfHxcbiAgICAobmV3IERhdGUobmVnYXRpdmVEYXRlKS50b0lTT1N0cmluZygpLmluZGV4T2YobmVnYXRpdmVZZWFyU3RyaW5nKSA9PT0gLTEpXG4pIHtcbiAgICBEYXRlLnByb3RvdHlwZS50b0lTT1N0cmluZyA9IGZ1bmN0aW9uIHRvSVNPU3RyaW5nKCkge1xuICAgICAgICB2YXIgcmVzdWx0LCBsZW5ndGgsIHZhbHVlLCB5ZWFyLCBtb250aDtcbiAgICAgICAgaWYgKCFpc0Zpbml0ZSh0aGlzKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJEYXRlLnByb3RvdHlwZS50b0lTT1N0cmluZyBjYWxsZWQgb24gbm9uLWZpbml0ZSB2YWx1ZS5cIik7XG4gICAgICAgIH1cblxuICAgICAgICB5ZWFyID0gdGhpcy5nZXRVVENGdWxsWWVhcigpO1xuXG4gICAgICAgIG1vbnRoID0gdGhpcy5nZXRVVENNb250aCgpO1xuICAgICAgICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2tyaXNrb3dhbC9lczUtc2hpbS9pc3N1ZXMvMTExXG4gICAgICAgIHllYXIgKz0gTWF0aC5mbG9vcihtb250aCAvIDEyKTtcbiAgICAgICAgbW9udGggPSAobW9udGggJSAxMiArIDEyKSAlIDEyO1xuXG4gICAgICAgIC8vIHRoZSBkYXRlIHRpbWUgc3RyaW5nIGZvcm1hdCBpcyBzcGVjaWZpZWQgaW4gMTUuOS4xLjE1LlxuICAgICAgICByZXN1bHQgPSBbbW9udGggKyAxLCB0aGlzLmdldFVUQ0RhdGUoKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0VVRDSG91cnMoKSwgdGhpcy5nZXRVVENNaW51dGVzKCksIHRoaXMuZ2V0VVRDU2Vjb25kcygpXTtcbiAgICAgICAgeWVhciA9IChcbiAgICAgICAgICAgICh5ZWFyIDwgMCA/IFwiLVwiIDogKHllYXIgPiA5OTk5ID8gXCIrXCIgOiBcIlwiKSkgK1xuICAgICAgICAgICAgKFwiMDAwMDBcIiArIE1hdGguYWJzKHllYXIpKVxuICAgICAgICAgICAgLnNsaWNlKDAgPD0geWVhciAmJiB5ZWFyIDw9IDk5OTkgPyAtNCA6IC02KVxuICAgICAgICApO1xuXG4gICAgICAgIGxlbmd0aCA9IHJlc3VsdC5sZW5ndGg7XG4gICAgICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgICAgICAgdmFsdWUgPSByZXN1bHRbbGVuZ3RoXTtcbiAgICAgICAgICAgIC8vIHBhZCBtb250aHMsIGRheXMsIGhvdXJzLCBtaW51dGVzLCBhbmQgc2Vjb25kcyB0byBoYXZlIHR3b1xuICAgICAgICAgICAgLy8gZGlnaXRzLlxuICAgICAgICAgICAgaWYgKHZhbHVlIDwgMTApIHtcbiAgICAgICAgICAgICAgICByZXN1bHRbbGVuZ3RoXSA9IFwiMFwiICsgdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gcGFkIG1pbGxpc2Vjb25kcyB0byBoYXZlIHRocmVlIGRpZ2l0cy5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIHllYXIgKyBcIi1cIiArIHJlc3VsdC5zbGljZSgwLCAyKS5qb2luKFwiLVwiKSArXG4gICAgICAgICAgICBcIlRcIiArIHJlc3VsdC5zbGljZSgyKS5qb2luKFwiOlwiKSArIFwiLlwiICtcbiAgICAgICAgICAgIChcIjAwMFwiICsgdGhpcy5nZXRVVENNaWxsaXNlY29uZHMoKSkuc2xpY2UoLTMpICsgXCJaXCJcbiAgICAgICAgKTtcbiAgICB9O1xufVxuXG5cbi8vIEVTNSAxNS45LjUuNDRcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjkuNS40NFxuLy8gVGhpcyBmdW5jdGlvbiBwcm92aWRlcyBhIFN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBhIERhdGUgb2JqZWN0IGZvciB1c2UgYnlcbi8vIEpTT04uc3RyaW5naWZ5ICgxNS4xMi4zKS5cbnZhciBkYXRlVG9KU09OSXNTdXBwb3J0ZWQgPSBmYWxzZTtcbnRyeSB7XG4gICAgZGF0ZVRvSlNPTklzU3VwcG9ydGVkID0gKFxuICAgICAgICBEYXRlLnByb3RvdHlwZS50b0pTT04gJiZcbiAgICAgICAgbmV3IERhdGUoTmFOKS50b0pTT04oKSA9PT0gbnVsbCAmJlxuICAgICAgICBuZXcgRGF0ZShuZWdhdGl2ZURhdGUpLnRvSlNPTigpLmluZGV4T2YobmVnYXRpdmVZZWFyU3RyaW5nKSAhPT0gLTEgJiZcbiAgICAgICAgRGF0ZS5wcm90b3R5cGUudG9KU09OLmNhbGwoeyAvLyBnZW5lcmljXG4gICAgICAgICAgICB0b0lTT1N0cmluZzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICk7XG59IGNhdGNoIChlKSB7XG59XG5pZiAoIWRhdGVUb0pTT05Jc1N1cHBvcnRlZCkge1xuICAgIERhdGUucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uIHRvSlNPTihrZXkpIHtcbiAgICAgICAgLy8gV2hlbiB0aGUgdG9KU09OIG1ldGhvZCBpcyBjYWxsZWQgd2l0aCBhcmd1bWVudCBrZXksIHRoZSBmb2xsb3dpbmdcbiAgICAgICAgLy8gc3RlcHMgYXJlIHRha2VuOlxuXG4gICAgICAgIC8vIDEuICBMZXQgTyBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgVG9PYmplY3QsIGdpdmluZyBpdCB0aGUgdGhpc1xuICAgICAgICAvLyB2YWx1ZSBhcyBpdHMgYXJndW1lbnQuXG4gICAgICAgIC8vIDIuIExldCB0diBiZSB0b1ByaW1pdGl2ZShPLCBoaW50IE51bWJlcikuXG4gICAgICAgIHZhciBvID0gT2JqZWN0KHRoaXMpLFxuICAgICAgICAgICAgdHYgPSB0b1ByaW1pdGl2ZShvKSxcbiAgICAgICAgICAgIHRvSVNPO1xuICAgICAgICAvLyAzLiBJZiB0diBpcyBhIE51bWJlciBhbmQgaXMgbm90IGZpbml0ZSwgcmV0dXJuIG51bGwuXG4gICAgICAgIGlmICh0eXBlb2YgdHYgPT09IFwibnVtYmVyXCIgJiYgIWlzRmluaXRlKHR2KSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgLy8gNC4gTGV0IHRvSVNPIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tHZXRdXSBpbnRlcm5hbCBtZXRob2Qgb2ZcbiAgICAgICAgLy8gTyB3aXRoIGFyZ3VtZW50IFwidG9JU09TdHJpbmdcIi5cbiAgICAgICAgdG9JU08gPSBvLnRvSVNPU3RyaW5nO1xuICAgICAgICAvLyA1LiBJZiBJc0NhbGxhYmxlKHRvSVNPKSBpcyBmYWxzZSwgdGhyb3cgYSBUeXBlRXJyb3IgZXhjZXB0aW9uLlxuICAgICAgICBpZiAodHlwZW9mIHRvSVNPICE9IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcInRvSVNPU3RyaW5nIHByb3BlcnR5IGlzIG5vdCBjYWxsYWJsZVwiKTtcbiAgICAgICAgfVxuICAgICAgICAvLyA2LiBSZXR1cm4gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0NhbGxdXSBpbnRlcm5hbCBtZXRob2Qgb2ZcbiAgICAgICAgLy8gIHRvSVNPIHdpdGggTyBhcyB0aGUgdGhpcyB2YWx1ZSBhbmQgYW4gZW1wdHkgYXJndW1lbnQgbGlzdC5cbiAgICAgICAgcmV0dXJuIHRvSVNPLmNhbGwobyk7XG5cbiAgICAgICAgLy8gTk9URSAxIFRoZSBhcmd1bWVudCBpcyBpZ25vcmVkLlxuXG4gICAgICAgIC8vIE5PVEUgMiBUaGUgdG9KU09OIGZ1bmN0aW9uIGlzIGludGVudGlvbmFsbHkgZ2VuZXJpYzsgaXQgZG9lcyBub3RcbiAgICAgICAgLy8gcmVxdWlyZSB0aGF0IGl0cyB0aGlzIHZhbHVlIGJlIGEgRGF0ZSBvYmplY3QuIFRoZXJlZm9yZSwgaXQgY2FuIGJlXG4gICAgICAgIC8vIHRyYW5zZmVycmVkIHRvIG90aGVyIGtpbmRzIG9mIG9iamVjdHMgZm9yIHVzZSBhcyBhIG1ldGhvZC4gSG93ZXZlcixcbiAgICAgICAgLy8gaXQgZG9lcyByZXF1aXJlIHRoYXQgYW55IHN1Y2ggb2JqZWN0IGhhdmUgYSB0b0lTT1N0cmluZyBtZXRob2QuIEFuXG4gICAgICAgIC8vIG9iamVjdCBpcyBmcmVlIHRvIHVzZSB0aGUgYXJndW1lbnQga2V5IHRvIGZpbHRlciBpdHNcbiAgICAgICAgLy8gc3RyaW5naWZpY2F0aW9uLlxuICAgIH07XG59XG5cbi8vIEVTNSAxNS45LjQuMlxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuOS40LjJcbi8vIGJhc2VkIG9uIHdvcmsgc2hhcmVkIGJ5IERhbmllbCBGcmllc2VuIChkYW50bWFuKVxuLy8gaHR0cDovL2dpc3QuZ2l0aHViLmNvbS8zMDMyNDlcbmlmICghRGF0ZS5wYXJzZSB8fCBcIkRhdGUucGFyc2UgaXMgYnVnZ3lcIikge1xuICAgIC8vIFhYWCBnbG9iYWwgYXNzaWdubWVudCB3b24ndCB3b3JrIGluIGVtYmVkZGluZ3MgdGhhdCB1c2VcbiAgICAvLyBhbiBhbHRlcm5hdGUgb2JqZWN0IGZvciB0aGUgY29udGV4dC5cbiAgICBEYXRlID0gKGZ1bmN0aW9uKE5hdGl2ZURhdGUpIHtcblxuICAgICAgICAvLyBEYXRlLmxlbmd0aCA9PT0gN1xuICAgICAgICBmdW5jdGlvbiBEYXRlKFksIE0sIEQsIGgsIG0sIHMsIG1zKSB7XG4gICAgICAgICAgICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgICAgIGlmICh0aGlzIGluc3RhbmNlb2YgTmF0aXZlRGF0ZSkge1xuICAgICAgICAgICAgICAgIHZhciBkYXRlID0gbGVuZ3RoID09IDEgJiYgU3RyaW5nKFkpID09PSBZID8gLy8gaXNTdHJpbmcoWSlcbiAgICAgICAgICAgICAgICAgICAgLy8gV2UgZXhwbGljaXRseSBwYXNzIGl0IHRocm91Z2ggcGFyc2U6XG4gICAgICAgICAgICAgICAgICAgIG5ldyBOYXRpdmVEYXRlKERhdGUucGFyc2UoWSkpIDpcbiAgICAgICAgICAgICAgICAgICAgLy8gV2UgaGF2ZSB0byBtYW51YWxseSBtYWtlIGNhbGxzIGRlcGVuZGluZyBvbiBhcmd1bWVudFxuICAgICAgICAgICAgICAgICAgICAvLyBsZW5ndGggaGVyZVxuICAgICAgICAgICAgICAgICAgICBsZW5ndGggPj0gNyA/IG5ldyBOYXRpdmVEYXRlKFksIE0sIEQsIGgsIG0sIHMsIG1zKSA6XG4gICAgICAgICAgICAgICAgICAgIGxlbmd0aCA+PSA2ID8gbmV3IE5hdGl2ZURhdGUoWSwgTSwgRCwgaCwgbSwgcykgOlxuICAgICAgICAgICAgICAgICAgICBsZW5ndGggPj0gNSA/IG5ldyBOYXRpdmVEYXRlKFksIE0sIEQsIGgsIG0pIDpcbiAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID49IDQgPyBuZXcgTmF0aXZlRGF0ZShZLCBNLCBELCBoKSA6XG4gICAgICAgICAgICAgICAgICAgIGxlbmd0aCA+PSAzID8gbmV3IE5hdGl2ZURhdGUoWSwgTSwgRCkgOlxuICAgICAgICAgICAgICAgICAgICBsZW5ndGggPj0gMiA/IG5ldyBOYXRpdmVEYXRlKFksIE0pIDpcbiAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID49IDEgPyBuZXcgTmF0aXZlRGF0ZShZKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IE5hdGl2ZURhdGUoKTtcbiAgICAgICAgICAgICAgICAvLyBQcmV2ZW50IG1peHVwcyB3aXRoIHVuZml4ZWQgRGF0ZSBvYmplY3RcbiAgICAgICAgICAgICAgICBkYXRlLmNvbnN0cnVjdG9yID0gRGF0ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBOYXRpdmVEYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gMTUuOS4xLjE1IERhdGUgVGltZSBTdHJpbmcgRm9ybWF0LlxuICAgICAgICB2YXIgaXNvRGF0ZUV4cHJlc3Npb24gPSBuZXcgUmVnRXhwKFwiXlwiICtcbiAgICAgICAgICAgIFwiKFxcXFxkezR9fFtcXCtcXC1dXFxcXGR7Nn0pXCIgKyAvLyBmb3VyLWRpZ2l0IHllYXIgY2FwdHVyZSBvciBzaWduICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gNi1kaWdpdCBleHRlbmRlZCB5ZWFyXG4gICAgICAgICAgICBcIig/Oi0oXFxcXGR7Mn0pXCIgKyAvLyBvcHRpb25hbCBtb250aCBjYXB0dXJlXG4gICAgICAgICAgICBcIig/Oi0oXFxcXGR7Mn0pXCIgKyAvLyBvcHRpb25hbCBkYXkgY2FwdHVyZVxuICAgICAgICAgICAgXCIoPzpcIiArIC8vIGNhcHR1cmUgaG91cnM6bWludXRlczpzZWNvbmRzLm1pbGxpc2Vjb25kc1xuICAgICAgICAgICAgICAgIFwiVChcXFxcZHsyfSlcIiArIC8vIGhvdXJzIGNhcHR1cmVcbiAgICAgICAgICAgICAgICBcIjooXFxcXGR7Mn0pXCIgKyAvLyBtaW51dGVzIGNhcHR1cmVcbiAgICAgICAgICAgICAgICBcIig/OlwiICsgLy8gb3B0aW9uYWwgOnNlY29uZHMubWlsbGlzZWNvbmRzXG4gICAgICAgICAgICAgICAgICAgIFwiOihcXFxcZHsyfSlcIiArIC8vIHNlY29uZHMgY2FwdHVyZVxuICAgICAgICAgICAgICAgICAgICBcIig/OihcXFxcLlxcXFxkezEsfSkpP1wiICsgLy8gbWlsbGlzZWNvbmRzIGNhcHR1cmVcbiAgICAgICAgICAgICAgICBcIik/XCIgK1xuICAgICAgICAgICAgXCIoXCIgKyAvLyBjYXB0dXJlIFVUQyBvZmZzZXQgY29tcG9uZW50XG4gICAgICAgICAgICAgICAgXCJafFwiICsgLy8gVVRDIGNhcHR1cmVcbiAgICAgICAgICAgICAgICBcIig/OlwiICsgLy8gb2Zmc2V0IHNwZWNpZmllciArLy1ob3VyczptaW51dGVzXG4gICAgICAgICAgICAgICAgICAgIFwiKFstK10pXCIgKyAvLyBzaWduIGNhcHR1cmVcbiAgICAgICAgICAgICAgICAgICAgXCIoXFxcXGR7Mn0pXCIgKyAvLyBob3VycyBvZmZzZXQgY2FwdHVyZVxuICAgICAgICAgICAgICAgICAgICBcIjooXFxcXGR7Mn0pXCIgKyAvLyBtaW51dGVzIG9mZnNldCBjYXB0dXJlXG4gICAgICAgICAgICAgICAgXCIpXCIgK1xuICAgICAgICAgICAgXCIpPyk/KT8pP1wiICtcbiAgICAgICAgXCIkXCIpO1xuXG4gICAgICAgIHZhciBtb250aHMgPSBbXG4gICAgICAgICAgICAwLCAzMSwgNTksIDkwLCAxMjAsIDE1MSwgMTgxLCAyMTIsIDI0MywgMjczLCAzMDQsIDMzNCwgMzY1XG4gICAgICAgIF07XG5cbiAgICAgICAgZnVuY3Rpb24gZGF5RnJvbU1vbnRoKHllYXIsIG1vbnRoKSB7XG4gICAgICAgICAgICB2YXIgdCA9IG1vbnRoID4gMSA/IDEgOiAwO1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICBtb250aHNbbW9udGhdICtcbiAgICAgICAgICAgICAgICBNYXRoLmZsb29yKCh5ZWFyIC0gMTk2OSArIHQpIC8gNCkgLVxuICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoKHllYXIgLSAxOTAxICsgdCkgLyAxMDApICtcbiAgICAgICAgICAgICAgICBNYXRoLmZsb29yKCh5ZWFyIC0gMTYwMSArIHQpIC8gNDAwKSArXG4gICAgICAgICAgICAgICAgMzY1ICogKHllYXIgLSAxOTcwKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENvcHkgYW55IGN1c3RvbSBtZXRob2RzIGEgM3JkIHBhcnR5IGxpYnJhcnkgbWF5IGhhdmUgYWRkZWRcbiAgICAgICAgZm9yICh2YXIga2V5IGluIE5hdGl2ZURhdGUpIHtcbiAgICAgICAgICAgIERhdGVba2V5XSA9IE5hdGl2ZURhdGVba2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENvcHkgXCJuYXRpdmVcIiBtZXRob2RzIGV4cGxpY2l0bHk7IHRoZXkgbWF5IGJlIG5vbi1lbnVtZXJhYmxlXG4gICAgICAgIERhdGUubm93ID0gTmF0aXZlRGF0ZS5ub3c7XG4gICAgICAgIERhdGUuVVRDID0gTmF0aXZlRGF0ZS5VVEM7XG4gICAgICAgIERhdGUucHJvdG90eXBlID0gTmF0aXZlRGF0ZS5wcm90b3R5cGU7XG4gICAgICAgIERhdGUucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gRGF0ZTtcblxuICAgICAgICAvLyBVcGdyYWRlIERhdGUucGFyc2UgdG8gaGFuZGxlIHNpbXBsaWZpZWQgSVNPIDg2MDEgc3RyaW5nc1xuICAgICAgICBEYXRlLnBhcnNlID0gZnVuY3Rpb24gcGFyc2Uoc3RyaW5nKSB7XG4gICAgICAgICAgICB2YXIgbWF0Y2ggPSBpc29EYXRlRXhwcmVzc2lvbi5leGVjKHN0cmluZyk7XG4gICAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAvLyBwYXJzZSBtb250aHMsIGRheXMsIGhvdXJzLCBtaW51dGVzLCBzZWNvbmRzLCBhbmQgbWlsbGlzZWNvbmRzXG4gICAgICAgICAgICAgICAgLy8gcHJvdmlkZSBkZWZhdWx0IHZhbHVlcyBpZiBuZWNlc3NhcnlcbiAgICAgICAgICAgICAgICAvLyBwYXJzZSB0aGUgVVRDIG9mZnNldCBjb21wb25lbnRcbiAgICAgICAgICAgICAgICB2YXIgeWVhciA9IE51bWJlcihtYXRjaFsxXSksXG4gICAgICAgICAgICAgICAgICAgIG1vbnRoID0gTnVtYmVyKG1hdGNoWzJdIHx8IDEpIC0gMSxcbiAgICAgICAgICAgICAgICAgICAgZGF5ID0gTnVtYmVyKG1hdGNoWzNdIHx8IDEpIC0gMSxcbiAgICAgICAgICAgICAgICAgICAgaG91ciA9IE51bWJlcihtYXRjaFs0XSB8fCAwKSxcbiAgICAgICAgICAgICAgICAgICAgbWludXRlID0gTnVtYmVyKG1hdGNoWzVdIHx8IDApLFxuICAgICAgICAgICAgICAgICAgICBzZWNvbmQgPSBOdW1iZXIobWF0Y2hbNl0gfHwgMCksXG4gICAgICAgICAgICAgICAgICAgIG1pbGxpc2Vjb25kID0gTWF0aC5mbG9vcihOdW1iZXIobWF0Y2hbN10gfHwgMCkgKiAxMDAwKSxcbiAgICAgICAgICAgICAgICAgICAgLy8gV2hlbiB0aW1lIHpvbmUgaXMgbWlzc2VkLCBsb2NhbCBvZmZzZXQgc2hvdWxkIGJlIHVzZWRcbiAgICAgICAgICAgICAgICAgICAgLy8gKEVTIDUuMSBidWcpXG4gICAgICAgICAgICAgICAgICAgIC8vIHNlZSBodHRwczovL2J1Z3MuZWNtYXNjcmlwdC5vcmcvc2hvd19idWcuY2dpP2lkPTExMlxuICAgICAgICAgICAgICAgICAgICBvZmZzZXQgPSAhbWF0Y2hbNF0gfHwgbWF0Y2hbOF0gP1xuICAgICAgICAgICAgICAgICAgICAgICAgMCA6IE51bWJlcihuZXcgTmF0aXZlRGF0ZSgxOTcwLCAwKSksXG4gICAgICAgICAgICAgICAgICAgIHNpZ25PZmZzZXQgPSBtYXRjaFs5XSA9PT0gXCItXCIgPyAxIDogLTEsXG4gICAgICAgICAgICAgICAgICAgIGhvdXJPZmZzZXQgPSBOdW1iZXIobWF0Y2hbMTBdIHx8IDApLFxuICAgICAgICAgICAgICAgICAgICBtaW51dGVPZmZzZXQgPSBOdW1iZXIobWF0Y2hbMTFdIHx8IDApLFxuICAgICAgICAgICAgICAgICAgICByZXN1bHQ7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICBob3VyIDwgKFxuICAgICAgICAgICAgICAgICAgICAgICAgbWludXRlID4gMCB8fCBzZWNvbmQgPiAwIHx8IG1pbGxpc2Vjb25kID4gMCA/XG4gICAgICAgICAgICAgICAgICAgICAgICAyNCA6IDI1XG4gICAgICAgICAgICAgICAgICAgICkgJiZcbiAgICAgICAgICAgICAgICAgICAgbWludXRlIDwgNjAgJiYgc2Vjb25kIDwgNjAgJiYgbWlsbGlzZWNvbmQgPCAxMDAwICYmXG4gICAgICAgICAgICAgICAgICAgIG1vbnRoID4gLTEgJiYgbW9udGggPCAxMiAmJiBob3VyT2Zmc2V0IDwgMjQgJiZcbiAgICAgICAgICAgICAgICAgICAgbWludXRlT2Zmc2V0IDwgNjAgJiYgLy8gZGV0ZWN0IGludmFsaWQgb2Zmc2V0c1xuICAgICAgICAgICAgICAgICAgICBkYXkgPiAtMSAmJlxuICAgICAgICAgICAgICAgICAgICBkYXkgPCAoXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXlGcm9tTW9udGgoeWVhciwgbW9udGggKyAxKSAtXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXlGcm9tTW9udGgoeWVhciwgbW9udGgpXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gKFxuICAgICAgICAgICAgICAgICAgICAgICAgKGRheUZyb21Nb250aCh5ZWFyLCBtb250aCkgKyBkYXkpICogMjQgK1xuICAgICAgICAgICAgICAgICAgICAgICAgaG91ciArXG4gICAgICAgICAgICAgICAgICAgICAgICBob3VyT2Zmc2V0ICogc2lnbk9mZnNldFxuICAgICAgICAgICAgICAgICAgICApICogNjA7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IChcbiAgICAgICAgICAgICAgICAgICAgICAgIChyZXN1bHQgKyBtaW51dGUgKyBtaW51dGVPZmZzZXQgKiBzaWduT2Zmc2V0KSAqIDYwICtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlY29uZFxuICAgICAgICAgICAgICAgICAgICApICogMTAwMCArIG1pbGxpc2Vjb25kICsgb2Zmc2V0O1xuICAgICAgICAgICAgICAgICAgICBpZiAoLTguNjRlMTUgPD0gcmVzdWx0ICYmIHJlc3VsdCA8PSA4LjY0ZTE1KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBOYU47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gTmF0aXZlRGF0ZS5wYXJzZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBEYXRlO1xuICAgIH0pKERhdGUpO1xufVxuXG4vLyBFUzUgMTUuOS40LjRcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjkuNC40XG5pZiAoIURhdGUubm93KSB7XG4gICAgRGF0ZS5ub3cgPSBmdW5jdGlvbiBub3coKSB7XG4gICAgICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICB9O1xufVxuXG5cbi8vXG4vLyBOdW1iZXJcbi8vID09PT09PVxuLy9cblxuLy8gRVM1LjEgMTUuNy40LjVcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjcuNC41XG5pZiAoIU51bWJlci5wcm90b3R5cGUudG9GaXhlZCB8fCAoMC4wMDAwOCkudG9GaXhlZCgzKSAhPT0gJzAuMDAwJyB8fCAoMC45KS50b0ZpeGVkKDApID09PSAnMCcgfHwgKDEuMjU1KS50b0ZpeGVkKDIpICE9PSAnMS4yNScgfHwgKDEwMDAwMDAwMDAwMDAwMDAxMjgpLnRvRml4ZWQoMCkgIT09IFwiMTAwMDAwMDAwMDAwMDAwMDEyOFwiKSB7XG4gICAgLy8gSGlkZSB0aGVzZSB2YXJpYWJsZXMgYW5kIGZ1bmN0aW9uc1xuICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBiYXNlLCBzaXplLCBkYXRhLCBpO1xuXG4gICAgICAgIGJhc2UgPSAxZTc7XG4gICAgICAgIHNpemUgPSA2O1xuICAgICAgICBkYXRhID0gWzAsIDAsIDAsIDAsIDAsIDBdO1xuXG4gICAgICAgIGZ1bmN0aW9uIG11bHRpcGx5KG4sIGMpIHtcbiAgICAgICAgICAgIHZhciBpID0gLTE7XG4gICAgICAgICAgICB3aGlsZSAoKytpIDwgc2l6ZSkge1xuICAgICAgICAgICAgICAgIGMgKz0gbiAqIGRhdGFbaV07XG4gICAgICAgICAgICAgICAgZGF0YVtpXSA9IGMgJSBiYXNlO1xuICAgICAgICAgICAgICAgIGMgPSBNYXRoLmZsb29yKGMgLyBiYXNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGRpdmlkZShuKSB7XG4gICAgICAgICAgICB2YXIgaSA9IHNpemUsIGMgPSAwO1xuICAgICAgICAgICAgd2hpbGUgKC0taSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgYyArPSBkYXRhW2ldO1xuICAgICAgICAgICAgICAgIGRhdGFbaV0gPSBNYXRoLmZsb29yKGMgLyBuKTtcbiAgICAgICAgICAgICAgICBjID0gKGMgJSBuKSAqIGJhc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICAgICAgICAgIHZhciBpID0gc2l6ZTtcbiAgICAgICAgICAgIHZhciBzID0gJyc7XG4gICAgICAgICAgICB3aGlsZSAoLS1pID49IDApIHtcbiAgICAgICAgICAgICAgICBpZiAocyAhPT0gJycgfHwgaSA9PT0gMCB8fCBkYXRhW2ldICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0ID0gU3RyaW5nKGRhdGFbaV0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAocyA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMgPSB0O1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcyArPSAnMDAwMDAwMCcuc2xpY2UoMCwgNyAtIHQubGVuZ3RoKSArIHQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHBvdyh4LCBuLCBhY2MpIHtcbiAgICAgICAgICAgIHJldHVybiAobiA9PT0gMCA/IGFjYyA6IChuICUgMiA9PT0gMSA/IHBvdyh4LCBuIC0gMSwgYWNjICogeCkgOiBwb3coeCAqIHgsIG4gLyAyLCBhY2MpKSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBsb2coeCkge1xuICAgICAgICAgICAgdmFyIG4gPSAwO1xuICAgICAgICAgICAgd2hpbGUgKHggPj0gNDA5Nikge1xuICAgICAgICAgICAgICAgIG4gKz0gMTI7XG4gICAgICAgICAgICAgICAgeCAvPSA0MDk2O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd2hpbGUgKHggPj0gMikge1xuICAgICAgICAgICAgICAgIG4gKz0gMTtcbiAgICAgICAgICAgICAgICB4IC89IDI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbjtcbiAgICAgICAgfVxuXG4gICAgICAgIE51bWJlci5wcm90b3R5cGUudG9GaXhlZCA9IGZ1bmN0aW9uIChmcmFjdGlvbkRpZ2l0cykge1xuICAgICAgICAgICAgdmFyIGYsIHgsIHMsIG0sIGUsIHosIGosIGs7XG5cbiAgICAgICAgICAgIC8vIFRlc3QgZm9yIE5hTiBhbmQgcm91bmQgZnJhY3Rpb25EaWdpdHMgZG93blxuICAgICAgICAgICAgZiA9IE51bWJlcihmcmFjdGlvbkRpZ2l0cyk7XG4gICAgICAgICAgICBmID0gZiAhPT0gZiA/IDAgOiBNYXRoLmZsb29yKGYpO1xuXG4gICAgICAgICAgICBpZiAoZiA8IDAgfHwgZiA+IDIwKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJOdW1iZXIudG9GaXhlZCBjYWxsZWQgd2l0aCBpbnZhbGlkIG51bWJlciBvZiBkZWNpbWFsc1wiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgeCA9IE51bWJlcih0aGlzKTtcblxuICAgICAgICAgICAgLy8gVGVzdCBmb3IgTmFOXG4gICAgICAgICAgICBpZiAoeCAhPT0geCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIk5hTlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZiBpdCBpcyB0b28gYmlnIG9yIHNtYWxsLCByZXR1cm4gdGhlIHN0cmluZyB2YWx1ZSBvZiB0aGUgbnVtYmVyXG4gICAgICAgICAgICBpZiAoeCA8PSAtMWUyMSB8fCB4ID49IDFlMjEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gU3RyaW5nKHgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzID0gXCJcIjtcblxuICAgICAgICAgICAgaWYgKHggPCAwKSB7XG4gICAgICAgICAgICAgICAgcyA9IFwiLVwiO1xuICAgICAgICAgICAgICAgIHggPSAteDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbSA9IFwiMFwiO1xuXG4gICAgICAgICAgICBpZiAoeCA+IDFlLTIxKSB7XG4gICAgICAgICAgICAgICAgLy8gMWUtMjEgPCB4IDwgMWUyMVxuICAgICAgICAgICAgICAgIC8vIC03MCA8IGxvZzIoeCkgPCA3MFxuICAgICAgICAgICAgICAgIGUgPSBsb2coeCAqIHBvdygyLCA2OSwgMSkpIC0gNjk7XG4gICAgICAgICAgICAgICAgeiA9IChlIDwgMCA/IHggKiBwb3coMiwgLWUsIDEpIDogeCAvIHBvdygyLCBlLCAxKSk7XG4gICAgICAgICAgICAgICAgeiAqPSAweDEwMDAwMDAwMDAwMDAwOyAvLyBNYXRoLnBvdygyLCA1Mik7XG4gICAgICAgICAgICAgICAgZSA9IDUyIC0gZTtcblxuICAgICAgICAgICAgICAgIC8vIC0xOCA8IGUgPCAxMjJcbiAgICAgICAgICAgICAgICAvLyB4ID0geiAvIDIgXiBlXG4gICAgICAgICAgICAgICAgaWYgKGUgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIG11bHRpcGx5KDAsIHopO1xuICAgICAgICAgICAgICAgICAgICBqID0gZjtcblxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoaiA+PSA3KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtdWx0aXBseSgxZTcsIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgaiAtPSA3O1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgbXVsdGlwbHkocG93KDEwLCBqLCAxKSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIGogPSBlIC0gMTtcblxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoaiA+PSAyMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGl2aWRlKDEgPDwgMjMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaiAtPSAyMztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGRpdmlkZSgxIDw8IGopO1xuICAgICAgICAgICAgICAgICAgICBtdWx0aXBseSgxLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgZGl2aWRlKDIpO1xuICAgICAgICAgICAgICAgICAgICBtID0gdG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBtdWx0aXBseSgwLCB6KTtcbiAgICAgICAgICAgICAgICAgICAgbXVsdGlwbHkoMSA8PCAoLWUpLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgbSA9IHRvU3RyaW5nKCkgKyAnMC4wMDAwMDAwMDAwMDAwMDAwMDAwMCcuc2xpY2UoMiwgMiArIGYpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGYgPiAwKSB7XG4gICAgICAgICAgICAgICAgayA9IG0ubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgaWYgKGsgPD0gZikge1xuICAgICAgICAgICAgICAgICAgICBtID0gcyArICcwLjAwMDAwMDAwMDAwMDAwMDAwMDAnLnNsaWNlKDAsIGYgLSBrICsgMikgKyBtO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG0gPSBzICsgbS5zbGljZSgwLCBrIC0gZikgKyAnLicgKyBtLnNsaWNlKGsgLSBmKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG0gPSBzICsgbTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG07XG4gICAgICAgIH1cbiAgICB9KCkpO1xufVxuXG5cbi8vXG4vLyBTdHJpbmdcbi8vID09PT09PVxuLy9cblxuXG4vLyBFUzUgMTUuNS40LjE0XG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS41LjQuMTRcblxuLy8gW2J1Z2ZpeCwgSUUgbHQgOSwgZmlyZWZveCA0LCBLb25xdWVyb3IsIE9wZXJhLCBvYnNjdXJlIGJyb3dzZXJzXVxuLy8gTWFueSBicm93c2VycyBkbyBub3Qgc3BsaXQgcHJvcGVybHkgd2l0aCByZWd1bGFyIGV4cHJlc3Npb25zIG9yIHRoZXlcbi8vIGRvIG5vdCBwZXJmb3JtIHRoZSBzcGxpdCBjb3JyZWN0bHkgdW5kZXIgb2JzY3VyZSBjb25kaXRpb25zLlxuLy8gU2VlIGh0dHA6Ly9ibG9nLnN0ZXZlbmxldml0aGFuLmNvbS9hcmNoaXZlcy9jcm9zcy1icm93c2VyLXNwbGl0XG4vLyBJJ3ZlIHRlc3RlZCBpbiBtYW55IGJyb3dzZXJzIGFuZCB0aGlzIHNlZW1zIHRvIGNvdmVyIHRoZSBkZXZpYW50IG9uZXM6XG4vLyAgICAnYWInLnNwbGl0KC8oPzphYikqLykgc2hvdWxkIGJlIFtcIlwiLCBcIlwiXSwgbm90IFtcIlwiXVxuLy8gICAgJy4nLnNwbGl0KC8oLj8pKC4/KS8pIHNob3VsZCBiZSBbXCJcIiwgXCIuXCIsIFwiXCIsIFwiXCJdLCBub3QgW1wiXCIsIFwiXCJdXG4vLyAgICAndGVzc3QnLnNwbGl0KC8ocykqLykgc2hvdWxkIGJlIFtcInRcIiwgdW5kZWZpbmVkLCBcImVcIiwgXCJzXCIsIFwidFwiXSwgbm90XG4vLyAgICAgICBbdW5kZWZpbmVkLCBcInRcIiwgdW5kZWZpbmVkLCBcImVcIiwgLi4uXVxuLy8gICAgJycuc3BsaXQoLy4/Lykgc2hvdWxkIGJlIFtdLCBub3QgW1wiXCJdXG4vLyAgICAnLicuc3BsaXQoLygpKCkvKSBzaG91bGQgYmUgW1wiLlwiXSwgbm90IFtcIlwiLCBcIlwiLCBcIi5cIl1cblxudmFyIHN0cmluZ19zcGxpdCA9IFN0cmluZy5wcm90b3R5cGUuc3BsaXQ7XG5pZiAoXG4gICAgJ2FiJy5zcGxpdCgvKD86YWIpKi8pLmxlbmd0aCAhPT0gMiB8fFxuICAgICcuJy5zcGxpdCgvKC4/KSguPykvKS5sZW5ndGggIT09IDQgfHxcbiAgICAndGVzc3QnLnNwbGl0KC8ocykqLylbMV0gPT09IFwidFwiIHx8XG4gICAgJycuc3BsaXQoLy4/LykubGVuZ3RoID09PSAwIHx8XG4gICAgJy4nLnNwbGl0KC8oKSgpLykubGVuZ3RoID4gMVxuKSB7XG4gICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGNvbXBsaWFudEV4ZWNOcGNnID0gLygpPz8vLmV4ZWMoXCJcIilbMV0gPT09IHZvaWQgMDsgLy8gTlBDRzogbm9ucGFydGljaXBhdGluZyBjYXB0dXJpbmcgZ3JvdXBcblxuICAgICAgICBTdHJpbmcucHJvdG90eXBlLnNwbGl0ID0gZnVuY3Rpb24gKHNlcGFyYXRvciwgbGltaXQpIHtcbiAgICAgICAgICAgIHZhciBzdHJpbmcgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKHNlcGFyYXRvciA9PT0gdm9pZCAwICYmIGxpbWl0ID09PSAwKVxuICAgICAgICAgICAgICAgIHJldHVybiBbXTtcblxuICAgICAgICAgICAgLy8gSWYgYHNlcGFyYXRvcmAgaXMgbm90IGEgcmVnZXgsIHVzZSBuYXRpdmUgc3BsaXRcbiAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoc2VwYXJhdG9yKSAhPT0gXCJbb2JqZWN0IFJlZ0V4cF1cIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdHJpbmdfc3BsaXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIG91dHB1dCA9IFtdLFxuICAgICAgICAgICAgICAgIGZsYWdzID0gKHNlcGFyYXRvci5pZ25vcmVDYXNlID8gXCJpXCIgOiBcIlwiKSArXG4gICAgICAgICAgICAgICAgICAgICAgICAoc2VwYXJhdG9yLm11bHRpbGluZSAgPyBcIm1cIiA6IFwiXCIpICtcbiAgICAgICAgICAgICAgICAgICAgICAgIChzZXBhcmF0b3IuZXh0ZW5kZWQgICA/IFwieFwiIDogXCJcIikgKyAvLyBQcm9wb3NlZCBmb3IgRVM2XG4gICAgICAgICAgICAgICAgICAgICAgICAoc2VwYXJhdG9yLnN0aWNreSAgICAgPyBcInlcIiA6IFwiXCIpLCAvLyBGaXJlZm94IDMrXG4gICAgICAgICAgICAgICAgbGFzdExhc3RJbmRleCA9IDAsXG4gICAgICAgICAgICAgICAgLy8gTWFrZSBgZ2xvYmFsYCBhbmQgYXZvaWQgYGxhc3RJbmRleGAgaXNzdWVzIGJ5IHdvcmtpbmcgd2l0aCBhIGNvcHlcbiAgICAgICAgICAgICAgICBzZXBhcmF0b3IgPSBuZXcgUmVnRXhwKHNlcGFyYXRvci5zb3VyY2UsIGZsYWdzICsgXCJnXCIpLFxuICAgICAgICAgICAgICAgIHNlcGFyYXRvcjIsIG1hdGNoLCBsYXN0SW5kZXgsIGxhc3RMZW5ndGg7XG4gICAgICAgICAgICBzdHJpbmcgKz0gXCJcIjsgLy8gVHlwZS1jb252ZXJ0XG4gICAgICAgICAgICBpZiAoIWNvbXBsaWFudEV4ZWNOcGNnKSB7XG4gICAgICAgICAgICAgICAgLy8gRG9lc24ndCBuZWVkIGZsYWdzIGd5LCBidXQgdGhleSBkb24ndCBodXJ0XG4gICAgICAgICAgICAgICAgc2VwYXJhdG9yMiA9IG5ldyBSZWdFeHAoXCJeXCIgKyBzZXBhcmF0b3Iuc291cmNlICsgXCIkKD8hXFxcXHMpXCIsIGZsYWdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qIFZhbHVlcyBmb3IgYGxpbWl0YCwgcGVyIHRoZSBzcGVjOlxuICAgICAgICAgICAgICogSWYgdW5kZWZpbmVkOiA0Mjk0OTY3Mjk1IC8vIE1hdGgucG93KDIsIDMyKSAtIDFcbiAgICAgICAgICAgICAqIElmIDAsIEluZmluaXR5LCBvciBOYU46IDBcbiAgICAgICAgICAgICAqIElmIHBvc2l0aXZlIG51bWJlcjogbGltaXQgPSBNYXRoLmZsb29yKGxpbWl0KTsgaWYgKGxpbWl0ID4gNDI5NDk2NzI5NSkgbGltaXQgLT0gNDI5NDk2NzI5NjtcbiAgICAgICAgICAgICAqIElmIG5lZ2F0aXZlIG51bWJlcjogNDI5NDk2NzI5NiAtIE1hdGguZmxvb3IoTWF0aC5hYnMobGltaXQpKVxuICAgICAgICAgICAgICogSWYgb3RoZXI6IFR5cGUtY29udmVydCwgdGhlbiB1c2UgdGhlIGFib3ZlIHJ1bGVzXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGxpbWl0ID0gbGltaXQgPT09IHZvaWQgMCA/XG4gICAgICAgICAgICAgICAgLTEgPj4+IDAgOiAvLyBNYXRoLnBvdygyLCAzMikgLSAxXG4gICAgICAgICAgICAgICAgbGltaXQgPj4+IDA7IC8vIFRvVWludDMyKGxpbWl0KVxuICAgICAgICAgICAgd2hpbGUgKG1hdGNoID0gc2VwYXJhdG9yLmV4ZWMoc3RyaW5nKSkge1xuICAgICAgICAgICAgICAgIC8vIGBzZXBhcmF0b3IubGFzdEluZGV4YCBpcyBub3QgcmVsaWFibGUgY3Jvc3MtYnJvd3NlclxuICAgICAgICAgICAgICAgIGxhc3RJbmRleCA9IG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGlmIChsYXN0SW5kZXggPiBsYXN0TGFzdEluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKHN0cmluZy5zbGljZShsYXN0TGFzdEluZGV4LCBtYXRjaC5pbmRleCkpO1xuICAgICAgICAgICAgICAgICAgICAvLyBGaXggYnJvd3NlcnMgd2hvc2UgYGV4ZWNgIG1ldGhvZHMgZG9uJ3QgY29uc2lzdGVudGx5IHJldHVybiBgdW5kZWZpbmVkYCBmb3JcbiAgICAgICAgICAgICAgICAgICAgLy8gbm9ucGFydGljaXBhdGluZyBjYXB0dXJpbmcgZ3JvdXBzXG4gICAgICAgICAgICAgICAgICAgIGlmICghY29tcGxpYW50RXhlY05wY2cgJiYgbWF0Y2gubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hbMF0ucmVwbGFjZShzZXBhcmF0b3IyLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoIC0gMjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcmd1bWVudHNbaV0gPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hbaV0gPSB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAobWF0Y2gubGVuZ3RoID4gMSAmJiBtYXRjaC5pbmRleCA8IHN0cmluZy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KG91dHB1dCwgbWF0Y2guc2xpY2UoMSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxhc3RMZW5ndGggPSBtYXRjaFswXS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RMYXN0SW5kZXggPSBsYXN0SW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvdXRwdXQubGVuZ3RoID49IGxpbWl0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoc2VwYXJhdG9yLmxhc3RJbmRleCA9PT0gbWF0Y2guaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VwYXJhdG9yLmxhc3RJbmRleCsrOyAvLyBBdm9pZCBhbiBpbmZpbml0ZSBsb29wXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGxhc3RMYXN0SW5kZXggPT09IHN0cmluZy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBpZiAobGFzdExlbmd0aCB8fCAhc2VwYXJhdG9yLnRlc3QoXCJcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goXCJcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChzdHJpbmcuc2xpY2UobGFzdExhc3RJbmRleCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG91dHB1dC5sZW5ndGggPiBsaW1pdCA/IG91dHB1dC5zbGljZSgwLCBsaW1pdCkgOiBvdXRwdXQ7XG4gICAgICAgIH07XG4gICAgfSgpKTtcblxuLy8gW2J1Z2ZpeCwgY2hyb21lXVxuLy8gSWYgc2VwYXJhdG9yIGlzIHVuZGVmaW5lZCwgdGhlbiB0aGUgcmVzdWx0IGFycmF5IGNvbnRhaW5zIGp1c3Qgb25lIFN0cmluZyxcbi8vIHdoaWNoIGlzIHRoZSB0aGlzIHZhbHVlIChjb252ZXJ0ZWQgdG8gYSBTdHJpbmcpLiBJZiBsaW1pdCBpcyBub3QgdW5kZWZpbmVkLFxuLy8gdGhlbiB0aGUgb3V0cHV0IGFycmF5IGlzIHRydW5jYXRlZCBzbyB0aGF0IGl0IGNvbnRhaW5zIG5vIG1vcmUgdGhhbiBsaW1pdFxuLy8gZWxlbWVudHMuXG4vLyBcIjBcIi5zcGxpdCh1bmRlZmluZWQsIDApIC0+IFtdXG59IGVsc2UgaWYgKFwiMFwiLnNwbGl0KHZvaWQgMCwgMCkubGVuZ3RoKSB7XG4gICAgU3RyaW5nLnByb3RvdHlwZS5zcGxpdCA9IGZ1bmN0aW9uKHNlcGFyYXRvciwgbGltaXQpIHtcbiAgICAgICAgaWYgKHNlcGFyYXRvciA9PT0gdm9pZCAwICYmIGxpbWl0ID09PSAwKSByZXR1cm4gW107XG4gICAgICAgIHJldHVybiBzdHJpbmdfc3BsaXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG59XG5cblxuLy8gRUNNQS0yNjIsIDNyZCBCLjIuM1xuLy8gTm90ZSBhbiBFQ01BU2NyaXB0IHN0YW5kYXJ0LCBhbHRob3VnaCBFQ01BU2NyaXB0IDNyZCBFZGl0aW9uIGhhcyBhXG4vLyBub24tbm9ybWF0aXZlIHNlY3Rpb24gc3VnZ2VzdGluZyB1bmlmb3JtIHNlbWFudGljcyBhbmQgaXQgc2hvdWxkIGJlXG4vLyBub3JtYWxpemVkIGFjcm9zcyBhbGwgYnJvd3NlcnNcbi8vIFtidWdmaXgsIElFIGx0IDldIElFIDwgOSBzdWJzdHIoKSB3aXRoIG5lZ2F0aXZlIHZhbHVlIG5vdCB3b3JraW5nIGluIElFXG5pZihcIlwiLnN1YnN0ciAmJiBcIjBiXCIuc3Vic3RyKC0xKSAhPT0gXCJiXCIpIHtcbiAgICB2YXIgc3RyaW5nX3N1YnN0ciA9IFN0cmluZy5wcm90b3R5cGUuc3Vic3RyO1xuICAgIC8qKlxuICAgICAqICBHZXQgdGhlIHN1YnN0cmluZyBvZiBhIHN0cmluZ1xuICAgICAqICBAcGFyYW0gIHtpbnRlZ2VyfSAgc3RhcnQgICB3aGVyZSB0byBzdGFydCB0aGUgc3Vic3RyaW5nXG4gICAgICogIEBwYXJhbSAge2ludGVnZXJ9ICBsZW5ndGggIGhvdyBtYW55IGNoYXJhY3RlcnMgdG8gcmV0dXJuXG4gICAgICogIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cbiAgICBTdHJpbmcucHJvdG90eXBlLnN1YnN0ciA9IGZ1bmN0aW9uKHN0YXJ0LCBsZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHN0cmluZ19zdWJzdHIuY2FsbChcbiAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgICBzdGFydCA8IDAgPyAoKHN0YXJ0ID0gdGhpcy5sZW5ndGggKyBzdGFydCkgPCAwID8gMCA6IHN0YXJ0KSA6IHN0YXJ0LFxuICAgICAgICAgICAgbGVuZ3RoXG4gICAgICAgICk7XG4gICAgfVxufVxuXG4vLyBFUzUgMTUuNS40LjIwXG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS41LjQuMjBcbnZhciB3cyA9IFwiXFx4MDlcXHgwQVxceDBCXFx4MENcXHgwRFxceDIwXFx4QTBcXHUxNjgwXFx1MTgwRVxcdTIwMDBcXHUyMDAxXFx1MjAwMlxcdTIwMDNcIiArXG4gICAgXCJcXHUyMDA0XFx1MjAwNVxcdTIwMDZcXHUyMDA3XFx1MjAwOFxcdTIwMDlcXHUyMDBBXFx1MjAyRlxcdTIwNUZcXHUzMDAwXFx1MjAyOFwiICtcbiAgICBcIlxcdTIwMjlcXHVGRUZGXCI7XG5pZiAoIVN0cmluZy5wcm90b3R5cGUudHJpbSB8fCB3cy50cmltKCkpIHtcbiAgICAvLyBodHRwOi8vYmxvZy5zdGV2ZW5sZXZpdGhhbi5jb20vYXJjaGl2ZXMvZmFzdGVyLXRyaW0tamF2YXNjcmlwdFxuICAgIC8vIGh0dHA6Ly9wZXJmZWN0aW9ua2lsbHMuY29tL3doaXRlc3BhY2UtZGV2aWF0aW9ucy9cbiAgICB3cyA9IFwiW1wiICsgd3MgKyBcIl1cIjtcbiAgICB2YXIgdHJpbUJlZ2luUmVnZXhwID0gbmV3IFJlZ0V4cChcIl5cIiArIHdzICsgd3MgKyBcIipcIiksXG4gICAgICAgIHRyaW1FbmRSZWdleHAgPSBuZXcgUmVnRXhwKHdzICsgd3MgKyBcIiokXCIpO1xuICAgIFN0cmluZy5wcm90b3R5cGUudHJpbSA9IGZ1bmN0aW9uIHRyaW0oKSB7XG4gICAgICAgIGlmICh0aGlzID09PSB2b2lkIDAgfHwgdGhpcyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImNhbid0IGNvbnZlcnQgXCIrdGhpcytcIiB0byBvYmplY3RcIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFN0cmluZyh0aGlzKVxuICAgICAgICAgICAgLnJlcGxhY2UodHJpbUJlZ2luUmVnZXhwLCBcIlwiKVxuICAgICAgICAgICAgLnJlcGxhY2UodHJpbUVuZFJlZ2V4cCwgXCJcIik7XG4gICAgfTtcbn1cblxuLy9cbi8vIFV0aWxcbi8vID09PT09PVxuLy9cblxuLy8gRVM1IDkuNFxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4OS40XG4vLyBodHRwOi8vanNwZXJmLmNvbS90by1pbnRlZ2VyXG5cbmZ1bmN0aW9uIHRvSW50ZWdlcihuKSB7XG4gICAgbiA9ICtuO1xuICAgIGlmIChuICE9PSBuKSB7IC8vIGlzTmFOXG4gICAgICAgIG4gPSAwO1xuICAgIH0gZWxzZSBpZiAobiAhPT0gMCAmJiBuICE9PSAoMS8wKSAmJiBuICE9PSAtKDEvMCkpIHtcbiAgICAgICAgbiA9IChuID4gMCB8fCAtMSkgKiBNYXRoLmZsb29yKE1hdGguYWJzKG4pKTtcbiAgICB9XG4gICAgcmV0dXJuIG47XG59XG5cbmZ1bmN0aW9uIGlzUHJpbWl0aXZlKGlucHV0KSB7XG4gICAgdmFyIHR5cGUgPSB0eXBlb2YgaW5wdXQ7XG4gICAgcmV0dXJuIChcbiAgICAgICAgaW5wdXQgPT09IG51bGwgfHxcbiAgICAgICAgdHlwZSA9PT0gXCJ1bmRlZmluZWRcIiB8fFxuICAgICAgICB0eXBlID09PSBcImJvb2xlYW5cIiB8fFxuICAgICAgICB0eXBlID09PSBcIm51bWJlclwiIHx8XG4gICAgICAgIHR5cGUgPT09IFwic3RyaW5nXCJcbiAgICApO1xufVxuXG5mdW5jdGlvbiB0b1ByaW1pdGl2ZShpbnB1dCkge1xuICAgIHZhciB2YWwsIHZhbHVlT2YsIHRvU3RyaW5nO1xuICAgIGlmIChpc1ByaW1pdGl2ZShpbnB1dCkpIHtcbiAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgIH1cbiAgICB2YWx1ZU9mID0gaW5wdXQudmFsdWVPZjtcbiAgICBpZiAodHlwZW9mIHZhbHVlT2YgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB2YWwgPSB2YWx1ZU9mLmNhbGwoaW5wdXQpO1xuICAgICAgICBpZiAoaXNQcmltaXRpdmUodmFsKSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICB0b1N0cmluZyA9IGlucHV0LnRvU3RyaW5nO1xuICAgIGlmICh0eXBlb2YgdG9TdHJpbmcgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB2YWwgPSB0b1N0cmluZy5jYWxsKGlucHV0KTtcbiAgICAgICAgaWYgKGlzUHJpbWl0aXZlKHZhbCkpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xufVxuXG4vLyBFUzUgOS45XG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3g5LjlcbnZhciB0b09iamVjdCA9IGZ1bmN0aW9uIChvKSB7XG4gICAgaWYgKG8gPT0gbnVsbCkgeyAvLyB0aGlzIG1hdGNoZXMgYm90aCBudWxsIGFuZCB1bmRlZmluZWRcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImNhbid0IGNvbnZlcnQgXCIrbytcIiB0byBvYmplY3RcIik7XG4gICAgfVxuICAgIHJldHVybiBPYmplY3Qobyk7XG59O1xuXG59KTtcbiIsIi8vIENvcHlyaWdodCAyMDA5LTIwMTIgYnkgY29udHJpYnV0b3JzLCBNSVQgTGljZW5zZVxuLy8gdmltOiB0cz00IHN0cz00IHN3PTQgZXhwYW5kdGFiXG5cbi8vIE1vZHVsZSBzeXN0ZW1zIG1hZ2ljIGRhbmNlXG4oZnVuY3Rpb24gKGRlZmluaXRpb24pIHtcbiAgICAvLyBSZXF1aXJlSlNcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgZGVmaW5lKGRlZmluaXRpb24pO1xuICAgIC8vIFlVSTNcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBZVUkgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIFlVSS5hZGQoXCJlczUtc2hhbVwiLCBkZWZpbml0aW9uKTtcbiAgICAvLyBDb21tb25KUyBhbmQgPHNjcmlwdD5cbiAgICB9IGVsc2Uge1xuICAgICAgICBkZWZpbml0aW9uKCk7XG4gICAgfVxufSkoZnVuY3Rpb24gKCkge1xuXG5cbnZhciBjYWxsID0gRnVuY3Rpb24ucHJvdG90eXBlLmNhbGw7XG52YXIgcHJvdG90eXBlT2ZPYmplY3QgPSBPYmplY3QucHJvdG90eXBlO1xudmFyIG93bnMgPSBjYWxsLmJpbmQocHJvdG90eXBlT2ZPYmplY3QuaGFzT3duUHJvcGVydHkpO1xuXG4vLyBJZiBKUyBlbmdpbmUgc3VwcG9ydHMgYWNjZXNzb3JzIGNyZWF0aW5nIHNob3J0Y3V0cy5cbnZhciBkZWZpbmVHZXR0ZXI7XG52YXIgZGVmaW5lU2V0dGVyO1xudmFyIGxvb2t1cEdldHRlcjtcbnZhciBsb29rdXBTZXR0ZXI7XG52YXIgc3VwcG9ydHNBY2Nlc3NvcnM7XG5pZiAoKHN1cHBvcnRzQWNjZXNzb3JzID0gb3ducyhwcm90b3R5cGVPZk9iamVjdCwgXCJfX2RlZmluZUdldHRlcl9fXCIpKSkge1xuICAgIGRlZmluZUdldHRlciA9IGNhbGwuYmluZChwcm90b3R5cGVPZk9iamVjdC5fX2RlZmluZUdldHRlcl9fKTtcbiAgICBkZWZpbmVTZXR0ZXIgPSBjYWxsLmJpbmQocHJvdG90eXBlT2ZPYmplY3QuX19kZWZpbmVTZXR0ZXJfXyk7XG4gICAgbG9va3VwR2V0dGVyID0gY2FsbC5iaW5kKHByb3RvdHlwZU9mT2JqZWN0Ll9fbG9va3VwR2V0dGVyX18pO1xuICAgIGxvb2t1cFNldHRlciA9IGNhbGwuYmluZChwcm90b3R5cGVPZk9iamVjdC5fX2xvb2t1cFNldHRlcl9fKTtcbn1cblxuLy8gRVM1IDE1LjIuMy4yXG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS4yLjMuMlxuaWYgKCFPYmplY3QuZ2V0UHJvdG90eXBlT2YpIHtcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20va3Jpc2tvd2FsL2VzNS1zaGltL2lzc3VlcyNpc3N1ZS8yXG4gICAgLy8gaHR0cDovL2Vqb2huLm9yZy9ibG9nL29iamVjdGdldHByb3RvdHlwZW9mL1xuICAgIC8vIHJlY29tbWVuZGVkIGJ5IGZzY2hhZWZlciBvbiBnaXRodWJcbiAgICBPYmplY3QuZ2V0UHJvdG90eXBlT2YgPSBmdW5jdGlvbiBnZXRQcm90b3R5cGVPZihvYmplY3QpIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdC5fX3Byb3RvX18gfHwgKFxuICAgICAgICAgICAgb2JqZWN0LmNvbnN0cnVjdG9yXG4gICAgICAgICAgICAgICAgPyBvYmplY3QuY29uc3RydWN0b3IucHJvdG90eXBlXG4gICAgICAgICAgICAgICAgOiBwcm90b3R5cGVPZk9iamVjdFxuICAgICAgICApO1xuICAgIH07XG59XG5cbi8vRVM1IDE1LjIuMy4zXG4vL2h0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjIuMy4zXG5cbmZ1bmN0aW9uIGRvZXNHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JXb3JrKG9iamVjdCkge1xuICAgIHRyeSB7XG4gICAgICAgIG9iamVjdC5zZW50aW5lbCA9IDA7XG4gICAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKFxuICAgICAgICAgICAgICAgIG9iamVjdCxcbiAgICAgICAgICAgICAgICBcInNlbnRpbmVsXCJcbiAgICAgICAgKS52YWx1ZSA9PT0gMDtcbiAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICAgICAgLy8gcmV0dXJucyBmYWxzeVxuICAgIH1cbn1cblxuLy9jaGVjayB3aGV0aGVyIGdldE93blByb3BlcnR5RGVzY3JpcHRvciB3b3JrcyBpZiBpdCdzIGdpdmVuLiBPdGhlcndpc2UsXG4vL3NoaW0gcGFydGlhbGx5LlxuaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkge1xuICAgIHZhciBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JXb3Jrc09uT2JqZWN0ID0gXG4gICAgICAgIGRvZXNHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JXb3JrKHt9KTtcbiAgICB2YXIgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yV29ya3NPbkRvbSA9IHR5cGVvZiBkb2N1bWVudCA9PSBcInVuZGVmaW5lZFwiIHx8XG4gICAgZG9lc0dldE93blByb3BlcnR5RGVzY3JpcHRvcldvcmsoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSk7XG4gICAgaWYgKCFnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JXb3Jrc09uRG9tIHx8IFxuICAgICAgICAgICAgIWdldE93blByb3BlcnR5RGVzY3JpcHRvcldvcmtzT25PYmplY3RcbiAgICApIHtcbiAgICAgICAgdmFyIGdldE93blByb3BlcnR5RGVzY3JpcHRvckZhbGxiYWNrID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbiAgICB9XG59XG5cbmlmICghT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvciB8fCBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JGYWxsYmFjaykge1xuICAgIHZhciBFUlJfTk9OX09CSkVDVCA9IFwiT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvciBjYWxsZWQgb24gYSBub24tb2JqZWN0OiBcIjtcblxuICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBwcm9wZXJ0eSkge1xuICAgICAgICBpZiAoKHR5cGVvZiBvYmplY3QgIT0gXCJvYmplY3RcIiAmJiB0eXBlb2Ygb2JqZWN0ICE9IFwiZnVuY3Rpb25cIikgfHwgb2JqZWN0ID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEVSUl9OT05fT0JKRUNUICsgb2JqZWN0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG1ha2UgYSB2YWxpYW50IGF0dGVtcHQgdG8gdXNlIHRoZSByZWFsIGdldE93blByb3BlcnR5RGVzY3JpcHRvclxuICAgICAgICAvLyBmb3IgSTgncyBET00gZWxlbWVudHMuXG4gICAgICAgIGlmIChnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JGYWxsYmFjaykge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yRmFsbGJhY2suY2FsbChPYmplY3QsIG9iamVjdCwgcHJvcGVydHkpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgICAgICAgICAgICAgLy8gdHJ5IHRoZSBzaGltIGlmIHRoZSByZWFsIG9uZSBkb2Vzbid0IHdvcmtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIG9iamVjdCBkb2VzIG5vdCBvd25zIHByb3BlcnR5IHJldHVybiB1bmRlZmluZWQgaW1tZWRpYXRlbHkuXG4gICAgICAgIGlmICghb3ducyhvYmplY3QsIHByb3BlcnR5KSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgb2JqZWN0IGhhcyBhIHByb3BlcnR5IHRoZW4gaXQncyBmb3Igc3VyZSBib3RoIGBlbnVtZXJhYmxlYCBhbmRcbiAgICAgICAgLy8gYGNvbmZpZ3VyYWJsZWAuXG4gICAgICAgIHZhciBkZXNjcmlwdG9yID0gIHsgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH07XG5cbiAgICAgICAgLy8gSWYgSlMgZW5naW5lIHN1cHBvcnRzIGFjY2Vzc29yIHByb3BlcnRpZXMgdGhlbiBwcm9wZXJ0eSBtYXkgYmUgYVxuICAgICAgICAvLyBnZXR0ZXIgb3Igc2V0dGVyLlxuICAgICAgICBpZiAoc3VwcG9ydHNBY2Nlc3NvcnMpIHtcbiAgICAgICAgICAgIC8vIFVuZm9ydHVuYXRlbHkgYF9fbG9va3VwR2V0dGVyX19gIHdpbGwgcmV0dXJuIGEgZ2V0dGVyIGV2ZW5cbiAgICAgICAgICAgIC8vIGlmIG9iamVjdCBoYXMgb3duIG5vbiBnZXR0ZXIgcHJvcGVydHkgYWxvbmcgd2l0aCBhIHNhbWUgbmFtZWRcbiAgICAgICAgICAgIC8vIGluaGVyaXRlZCBnZXR0ZXIuIFRvIGF2b2lkIG1pc2JlaGF2aW9yIHdlIHRlbXBvcmFyeSByZW1vdmVcbiAgICAgICAgICAgIC8vIGBfX3Byb3RvX19gIHNvIHRoYXQgYF9fbG9va3VwR2V0dGVyX19gIHdpbGwgcmV0dXJuIGdldHRlciBvbmx5XG4gICAgICAgICAgICAvLyBpZiBpdCdzIG93bmVkIGJ5IGFuIG9iamVjdC5cbiAgICAgICAgICAgIHZhciBwcm90b3R5cGUgPSBvYmplY3QuX19wcm90b19fO1xuICAgICAgICAgICAgb2JqZWN0Ll9fcHJvdG9fXyA9IHByb3RvdHlwZU9mT2JqZWN0O1xuXG4gICAgICAgICAgICB2YXIgZ2V0dGVyID0gbG9va3VwR2V0dGVyKG9iamVjdCwgcHJvcGVydHkpO1xuICAgICAgICAgICAgdmFyIHNldHRlciA9IGxvb2t1cFNldHRlcihvYmplY3QsIHByb3BlcnR5KTtcblxuICAgICAgICAgICAgLy8gT25jZSB3ZSBoYXZlIGdldHRlciBhbmQgc2V0dGVyIHdlIGNhbiBwdXQgdmFsdWVzIGJhY2suXG4gICAgICAgICAgICBvYmplY3QuX19wcm90b19fID0gcHJvdG90eXBlO1xuXG4gICAgICAgICAgICBpZiAoZ2V0dGVyIHx8IHNldHRlcikge1xuICAgICAgICAgICAgICAgIGlmIChnZXR0ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRvci5nZXQgPSBnZXR0ZXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzZXR0ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRvci5zZXQgPSBzZXR0ZXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIElmIGl0IHdhcyBhY2Nlc3NvciBwcm9wZXJ0eSB3ZSdyZSBkb25lIGFuZCByZXR1cm4gaGVyZVxuICAgICAgICAgICAgICAgIC8vIGluIG9yZGVyIHRvIGF2b2lkIGFkZGluZyBgdmFsdWVgIHRvIHRoZSBkZXNjcmlwdG9yLlxuICAgICAgICAgICAgICAgIHJldHVybiBkZXNjcmlwdG9yO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgd2UgZ290IHRoaXMgZmFyIHdlIGtub3cgdGhhdCBvYmplY3QgaGFzIGFuIG93biBwcm9wZXJ0eSB0aGF0IGlzXG4gICAgICAgIC8vIG5vdCBhbiBhY2Nlc3NvciBzbyB3ZSBzZXQgaXQgYXMgYSB2YWx1ZSBhbmQgcmV0dXJuIGRlc2NyaXB0b3IuXG4gICAgICAgIGRlc2NyaXB0b3IudmFsdWUgPSBvYmplY3RbcHJvcGVydHldO1xuICAgICAgICBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIGRlc2NyaXB0b3I7XG4gICAgfTtcbn1cblxuLy8gRVM1IDE1LjIuMy40XG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS4yLjMuNFxuaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcykge1xuICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhvYmplY3QpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKG9iamVjdCk7XG4gICAgfTtcbn1cblxuLy8gRVM1IDE1LjIuMy41XG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS4yLjMuNVxuaWYgKCFPYmplY3QuY3JlYXRlKSB7XG5cbiAgICAvLyBDb250cmlidXRlZCBieSBCcmFuZG9uIEJlbnZpZSwgT2N0b2JlciwgMjAxMlxuICAgIHZhciBjcmVhdGVFbXB0eTtcbiAgICB2YXIgc3VwcG9ydHNQcm90byA9IE9iamVjdC5wcm90b3R5cGUuX19wcm90b19fID09PSBudWxsO1xuICAgIGlmIChzdXBwb3J0c1Byb3RvIHx8IHR5cGVvZiBkb2N1bWVudCA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBjcmVhdGVFbXB0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB7IFwiX19wcm90b19fXCI6IG51bGwgfTtcbiAgICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBJbiBvbGQgSUUgX19wcm90b19fIGNhbid0IGJlIHVzZWQgdG8gbWFudWFsbHkgc2V0IGBudWxsYCwgbm9yIGRvZXNcbiAgICAgICAgLy8gYW55IG90aGVyIG1ldGhvZCBleGlzdCB0byBtYWtlIGFuIG9iamVjdCB0aGF0IGluaGVyaXRzIGZyb20gbm90aGluZyxcbiAgICAgICAgLy8gYXNpZGUgZnJvbSBPYmplY3QucHJvdG90eXBlIGl0c2VsZi4gSW5zdGVhZCwgY3JlYXRlIGEgbmV3IGdsb2JhbFxuICAgICAgICAvLyBvYmplY3QgYW5kICpzdGVhbCogaXRzIE9iamVjdC5wcm90b3R5cGUgYW5kIHN0cmlwIGl0IGJhcmUuIFRoaXMgaXNcbiAgICAgICAgLy8gdXNlZCBhcyB0aGUgcHJvdG90eXBlIHRvIGNyZWF0ZSBudWxsYXJ5IG9iamVjdHMuXG4gICAgICAgIGNyZWF0ZUVtcHR5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGlmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpO1xuICAgICAgICAgICAgdmFyIHBhcmVudCA9IGRvY3VtZW50LmJvZHkgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgICAgICAgaWZyYW1lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcbiAgICAgICAgICAgIGlmcmFtZS5zcmMgPSAnamF2YXNjcmlwdDonO1xuICAgICAgICAgICAgdmFyIGVtcHR5ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuT2JqZWN0LnByb3RvdHlwZTtcbiAgICAgICAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChpZnJhbWUpO1xuICAgICAgICAgICAgaWZyYW1lID0gbnVsbDtcbiAgICAgICAgICAgIGRlbGV0ZSBlbXB0eS5jb25zdHJ1Y3RvcjtcbiAgICAgICAgICAgIGRlbGV0ZSBlbXB0eS5oYXNPd25Qcm9wZXJ0eTtcbiAgICAgICAgICAgIGRlbGV0ZSBlbXB0eS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcbiAgICAgICAgICAgIGRlbGV0ZSBlbXB0eS5pc1Byb3RvdHlwZU9mO1xuICAgICAgICAgICAgZGVsZXRlIGVtcHR5LnRvTG9jYWxlU3RyaW5nO1xuICAgICAgICAgICAgZGVsZXRlIGVtcHR5LnRvU3RyaW5nO1xuICAgICAgICAgICAgZGVsZXRlIGVtcHR5LnZhbHVlT2Y7XG4gICAgICAgICAgICBlbXB0eS5fX3Byb3RvX18gPSBudWxsO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBFbXB0eSgpIHt9XG4gICAgICAgICAgICBFbXB0eS5wcm90b3R5cGUgPSBlbXB0eTtcbiAgICAgICAgICAgIC8vIHNob3J0LWNpcmN1aXQgZnV0dXJlIGNhbGxzXG4gICAgICAgICAgICBjcmVhdGVFbXB0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEVtcHR5KCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBFbXB0eSgpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIE9iamVjdC5jcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUocHJvdG90eXBlLCBwcm9wZXJ0aWVzKSB7XG5cbiAgICAgICAgdmFyIG9iamVjdDtcbiAgICAgICAgZnVuY3Rpb24gVHlwZSgpIHt9ICAvLyBBbiBlbXB0eSBjb25zdHJ1Y3Rvci5cblxuICAgICAgICBpZiAocHJvdG90eXBlID09PSBudWxsKSB7XG4gICAgICAgICAgICBvYmplY3QgPSBjcmVhdGVFbXB0eSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBwcm90b3R5cGUgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIHByb3RvdHlwZSAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgLy8gSW4gdGhlIG5hdGl2ZSBpbXBsZW1lbnRhdGlvbiBgcGFyZW50YCBjYW4gYmUgYG51bGxgXG4gICAgICAgICAgICAgICAgLy8gT1IgKmFueSogYGluc3RhbmNlb2YgT2JqZWN0YCAgKE9iamVjdHxGdW5jdGlvbnxBcnJheXxSZWdFeHB8ZXRjKVxuICAgICAgICAgICAgICAgIC8vIFVzZSBgdHlwZW9mYCB0aG8sIGIvYyBpbiBvbGQgSUUsIERPTSBlbGVtZW50cyBhcmUgbm90IGBpbnN0YW5jZW9mIE9iamVjdGBcbiAgICAgICAgICAgICAgICAvLyBsaWtlIHRoZXkgYXJlIGluIG1vZGVybiBicm93c2Vycy4gVXNpbmcgYE9iamVjdC5jcmVhdGVgIG9uIERPTSBlbGVtZW50c1xuICAgICAgICAgICAgICAgIC8vIGlzLi4uZXJyLi4ucHJvYmFibHkgaW5hcHByb3ByaWF0ZSwgYnV0IHRoZSBuYXRpdmUgdmVyc2lvbiBhbGxvd3MgZm9yIGl0LlxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJPYmplY3QgcHJvdG90eXBlIG1heSBvbmx5IGJlIGFuIE9iamVjdCBvciBudWxsXCIpOyAvLyBzYW1lIG1zZyBhcyBDaHJvbWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFR5cGUucHJvdG90eXBlID0gcHJvdG90eXBlO1xuICAgICAgICAgICAgb2JqZWN0ID0gbmV3IFR5cGUoKTtcbiAgICAgICAgICAgIC8vIElFIGhhcyBubyBidWlsdC1pbiBpbXBsZW1lbnRhdGlvbiBvZiBgT2JqZWN0LmdldFByb3RvdHlwZU9mYFxuICAgICAgICAgICAgLy8gbmVpdGhlciBgX19wcm90b19fYCwgYnV0IHRoaXMgbWFudWFsbHkgc2V0dGluZyBgX19wcm90b19fYCB3aWxsXG4gICAgICAgICAgICAvLyBndWFyYW50ZWUgdGhhdCBgT2JqZWN0LmdldFByb3RvdHlwZU9mYCB3aWxsIHdvcmsgYXMgZXhwZWN0ZWQgd2l0aFxuICAgICAgICAgICAgLy8gb2JqZWN0cyBjcmVhdGVkIHVzaW5nIGBPYmplY3QuY3JlYXRlYFxuICAgICAgICAgICAgb2JqZWN0Ll9fcHJvdG9fXyA9IHByb3RvdHlwZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcm9wZXJ0aWVzICE9PSB2b2lkIDApIHtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKG9iamVjdCwgcHJvcGVydGllcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH07XG59XG5cbi8vIEVTNSAxNS4yLjMuNlxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuMi4zLjZcblxuLy8gUGF0Y2ggZm9yIFdlYktpdCBhbmQgSUU4IHN0YW5kYXJkIG1vZGVcbi8vIERlc2lnbmVkIGJ5IGhheCA8aGF4LmdpdGh1Yi5jb20+XG4vLyByZWxhdGVkIGlzc3VlOiBodHRwczovL2dpdGh1Yi5jb20va3Jpc2tvd2FsL2VzNS1zaGltL2lzc3VlcyNpc3N1ZS81XG4vLyBJRTggUmVmZXJlbmNlOlxuLy8gICAgIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9kZDI4MjkwMC5hc3B4XG4vLyAgICAgaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L2RkMjI5OTE2LmFzcHhcbi8vIFdlYktpdCBCdWdzOlxuLy8gICAgIGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0zNjQyM1xuXG5mdW5jdGlvbiBkb2VzRGVmaW5lUHJvcGVydHlXb3JrKG9iamVjdCkge1xuICAgIHRyeSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIFwic2VudGluZWxcIiwge30pO1xuICAgICAgICByZXR1cm4gXCJzZW50aW5lbFwiIGluIG9iamVjdDtcbiAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICAgICAgLy8gcmV0dXJucyBmYWxzeVxuICAgIH1cbn1cblxuLy8gY2hlY2sgd2hldGhlciBkZWZpbmVQcm9wZXJ0eSB3b3JrcyBpZiBpdCdzIGdpdmVuLiBPdGhlcndpc2UsXG4vLyBzaGltIHBhcnRpYWxseS5cbmlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHtcbiAgICB2YXIgZGVmaW5lUHJvcGVydHlXb3Jrc09uT2JqZWN0ID0gZG9lc0RlZmluZVByb3BlcnR5V29yayh7fSk7XG4gICAgdmFyIGRlZmluZVByb3BlcnR5V29ya3NPbkRvbSA9IHR5cGVvZiBkb2N1bWVudCA9PSBcInVuZGVmaW5lZFwiIHx8XG4gICAgICAgIGRvZXNEZWZpbmVQcm9wZXJ0eVdvcmsoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSk7XG4gICAgaWYgKCFkZWZpbmVQcm9wZXJ0eVdvcmtzT25PYmplY3QgfHwgIWRlZmluZVByb3BlcnR5V29ya3NPbkRvbSkge1xuICAgICAgICB2YXIgZGVmaW5lUHJvcGVydHlGYWxsYmFjayA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSxcbiAgICAgICAgICAgIGRlZmluZVByb3BlcnRpZXNGYWxsYmFjayA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzO1xuICAgIH1cbn1cblxuaWYgKCFPYmplY3QuZGVmaW5lUHJvcGVydHkgfHwgZGVmaW5lUHJvcGVydHlGYWxsYmFjaykge1xuICAgIHZhciBFUlJfTk9OX09CSkVDVF9ERVNDUklQVE9SID0gXCJQcm9wZXJ0eSBkZXNjcmlwdGlvbiBtdXN0IGJlIGFuIG9iamVjdDogXCI7XG4gICAgdmFyIEVSUl9OT05fT0JKRUNUX1RBUkdFVCA9IFwiT2JqZWN0LmRlZmluZVByb3BlcnR5IGNhbGxlZCBvbiBub24tb2JqZWN0OiBcIlxuICAgIHZhciBFUlJfQUNDRVNTT1JTX05PVF9TVVBQT1JURUQgPSBcImdldHRlcnMgJiBzZXR0ZXJzIGNhbiBub3QgYmUgZGVmaW5lZCBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwib24gdGhpcyBqYXZhc2NyaXB0IGVuZ2luZVwiO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5ID0gZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkob2JqZWN0LCBwcm9wZXJ0eSwgZGVzY3JpcHRvcikge1xuICAgICAgICBpZiAoKHR5cGVvZiBvYmplY3QgIT0gXCJvYmplY3RcIiAmJiB0eXBlb2Ygb2JqZWN0ICE9IFwiZnVuY3Rpb25cIikgfHwgb2JqZWN0ID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEVSUl9OT05fT0JKRUNUX1RBUkdFVCArIG9iamVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCh0eXBlb2YgZGVzY3JpcHRvciAhPSBcIm9iamVjdFwiICYmIHR5cGVvZiBkZXNjcmlwdG9yICE9IFwiZnVuY3Rpb25cIikgfHwgZGVzY3JpcHRvciA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihFUlJfTk9OX09CSkVDVF9ERVNDUklQVE9SICsgZGVzY3JpcHRvcik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gbWFrZSBhIHZhbGlhbnQgYXR0ZW1wdCB0byB1c2UgdGhlIHJlYWwgZGVmaW5lUHJvcGVydHlcbiAgICAgICAgLy8gZm9yIEk4J3MgRE9NIGVsZW1lbnRzLlxuICAgICAgICBpZiAoZGVmaW5lUHJvcGVydHlGYWxsYmFjaykge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVmaW5lUHJvcGVydHlGYWxsYmFjay5jYWxsKE9iamVjdCwgb2JqZWN0LCBwcm9wZXJ0eSwgZGVzY3JpcHRvcik7XG4gICAgICAgICAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICAgICAgICAgICAgICAvLyB0cnkgdGhlIHNoaW0gaWYgdGhlIHJlYWwgb25lIGRvZXNuJ3Qgd29ya1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgaXQncyBhIGRhdGEgcHJvcGVydHkuXG4gICAgICAgIGlmIChvd25zKGRlc2NyaXB0b3IsIFwidmFsdWVcIikpIHtcbiAgICAgICAgICAgIC8vIGZhaWwgc2lsZW50bHkgaWYgXCJ3cml0YWJsZVwiLCBcImVudW1lcmFibGVcIiwgb3IgXCJjb25maWd1cmFibGVcIlxuICAgICAgICAgICAgLy8gYXJlIHJlcXVlc3RlZCBidXQgbm90IHN1cHBvcnRlZFxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIC8vIGFsdGVybmF0ZSBhcHByb2FjaDpcbiAgICAgICAgICAgIGlmICggLy8gY2FuJ3QgaW1wbGVtZW50IHRoZXNlIGZlYXR1cmVzOyBhbGxvdyBmYWxzZSBidXQgbm90IHRydWVcbiAgICAgICAgICAgICAgICAhKG93bnMoZGVzY3JpcHRvciwgXCJ3cml0YWJsZVwiKSA/IGRlc2NyaXB0b3Iud3JpdGFibGUgOiB0cnVlKSB8fFxuICAgICAgICAgICAgICAgICEob3ducyhkZXNjcmlwdG9yLCBcImVudW1lcmFibGVcIikgPyBkZXNjcmlwdG9yLmVudW1lcmFibGUgOiB0cnVlKSB8fFxuICAgICAgICAgICAgICAgICEob3ducyhkZXNjcmlwdG9yLCBcImNvbmZpZ3VyYWJsZVwiKSA/IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlIDogdHJ1ZSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgXCJUaGlzIGltcGxlbWVudGF0aW9uIG9mIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBkb2VzIG5vdCBcIiArXG4gICAgICAgICAgICAgICAgICAgIFwic3VwcG9ydCBjb25maWd1cmFibGUsIGVudW1lcmFibGUsIG9yIHdyaXRhYmxlLlwiXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIGlmIChzdXBwb3J0c0FjY2Vzc29ycyAmJiAobG9va3VwR2V0dGVyKG9iamVjdCwgcHJvcGVydHkpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvb2t1cFNldHRlcihvYmplY3QsIHByb3BlcnR5KSkpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgLy8gQXMgYWNjZXNzb3JzIGFyZSBzdXBwb3J0ZWQgb25seSBvbiBlbmdpbmVzIGltcGxlbWVudGluZ1xuICAgICAgICAgICAgICAgIC8vIGBfX3Byb3RvX19gIHdlIGNhbiBzYWZlbHkgb3ZlcnJpZGUgYF9fcHJvdG9fX2Agd2hpbGUgZGVmaW5pbmdcbiAgICAgICAgICAgICAgICAvLyBhIHByb3BlcnR5IHRvIG1ha2Ugc3VyZSB0aGF0IHdlIGRvbid0IGhpdCBhbiBpbmhlcml0ZWRcbiAgICAgICAgICAgICAgICAvLyBhY2Nlc3Nvci5cbiAgICAgICAgICAgICAgICB2YXIgcHJvdG90eXBlID0gb2JqZWN0Ll9fcHJvdG9fXztcbiAgICAgICAgICAgICAgICBvYmplY3QuX19wcm90b19fID0gcHJvdG90eXBlT2ZPYmplY3Q7XG4gICAgICAgICAgICAgICAgLy8gRGVsZXRpbmcgYSBwcm9wZXJ0eSBhbnl3YXkgc2luY2UgZ2V0dGVyIC8gc2V0dGVyIG1heSBiZVxuICAgICAgICAgICAgICAgIC8vIGRlZmluZWQgb24gb2JqZWN0IGl0c2VsZi5cbiAgICAgICAgICAgICAgICBkZWxldGUgb2JqZWN0W3Byb3BlcnR5XTtcbiAgICAgICAgICAgICAgICBvYmplY3RbcHJvcGVydHldID0gZGVzY3JpcHRvci52YWx1ZTtcbiAgICAgICAgICAgICAgICAvLyBTZXR0aW5nIG9yaWdpbmFsIGBfX3Byb3RvX19gIGJhY2sgbm93LlxuICAgICAgICAgICAgICAgIG9iamVjdC5fX3Byb3RvX18gPSBwcm90b3R5cGU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG9iamVjdFtwcm9wZXJ0eV0gPSBkZXNjcmlwdG9yLnZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCFzdXBwb3J0c0FjY2Vzc29ycykge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRVJSX0FDQ0VTU09SU19OT1RfU1VQUE9SVEVEKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIElmIHdlIGdvdCB0aGF0IGZhciB0aGVuIGdldHRlcnMgYW5kIHNldHRlcnMgY2FuIGJlIGRlZmluZWQgISFcbiAgICAgICAgICAgIGlmIChvd25zKGRlc2NyaXB0b3IsIFwiZ2V0XCIpKSB7XG4gICAgICAgICAgICAgICAgZGVmaW5lR2V0dGVyKG9iamVjdCwgcHJvcGVydHksIGRlc2NyaXB0b3IuZ2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvd25zKGRlc2NyaXB0b3IsIFwic2V0XCIpKSB7XG4gICAgICAgICAgICAgICAgZGVmaW5lU2V0dGVyKG9iamVjdCwgcHJvcGVydHksIGRlc2NyaXB0b3Iuc2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH07XG59XG5cbi8vIEVTNSAxNS4yLjMuN1xuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuMi4zLjdcbmlmICghT2JqZWN0LmRlZmluZVByb3BlcnRpZXMgfHwgZGVmaW5lUHJvcGVydGllc0ZhbGxiYWNrKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKG9iamVjdCwgcHJvcGVydGllcykge1xuICAgICAgICAvLyBtYWtlIGEgdmFsaWFudCBhdHRlbXB0IHRvIHVzZSB0aGUgcmVhbCBkZWZpbmVQcm9wZXJ0aWVzXG4gICAgICAgIGlmIChkZWZpbmVQcm9wZXJ0aWVzRmFsbGJhY2spIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZmluZVByb3BlcnRpZXNGYWxsYmFjay5jYWxsKE9iamVjdCwgb2JqZWN0LCBwcm9wZXJ0aWVzKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgICAgICAgICAgICAgIC8vIHRyeSB0aGUgc2hpbSBpZiB0aGUgcmVhbCBvbmUgZG9lc24ndCB3b3JrXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBwcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICBpZiAob3ducyhwcm9wZXJ0aWVzLCBwcm9wZXJ0eSkgJiYgcHJvcGVydHkgIT0gXCJfX3Byb3RvX19cIikge1xuICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIHByb3BlcnR5LCBwcm9wZXJ0aWVzW3Byb3BlcnR5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9O1xufVxuXG4vLyBFUzUgMTUuMi4zLjhcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjIuMy44XG5pZiAoIU9iamVjdC5zZWFsKSB7XG4gICAgT2JqZWN0LnNlYWwgPSBmdW5jdGlvbiBzZWFsKG9iamVjdCkge1xuICAgICAgICAvLyB0aGlzIGlzIG1pc2xlYWRpbmcgYW5kIGJyZWFrcyBmZWF0dXJlLWRldGVjdGlvbiwgYnV0XG4gICAgICAgIC8vIGFsbG93cyBcInNlY3VyYWJsZVwiIGNvZGUgdG8gXCJncmFjZWZ1bGx5XCIgZGVncmFkZSB0byB3b3JraW5nXG4gICAgICAgIC8vIGJ1dCBpbnNlY3VyZSBjb2RlLlxuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH07XG59XG5cbi8vIEVTNSAxNS4yLjMuOVxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuMi4zLjlcbmlmICghT2JqZWN0LmZyZWV6ZSkge1xuICAgIE9iamVjdC5mcmVlemUgPSBmdW5jdGlvbiBmcmVlemUob2JqZWN0KSB7XG4gICAgICAgIC8vIHRoaXMgaXMgbWlzbGVhZGluZyBhbmQgYnJlYWtzIGZlYXR1cmUtZGV0ZWN0aW9uLCBidXRcbiAgICAgICAgLy8gYWxsb3dzIFwic2VjdXJhYmxlXCIgY29kZSB0byBcImdyYWNlZnVsbHlcIiBkZWdyYWRlIHRvIHdvcmtpbmdcbiAgICAgICAgLy8gYnV0IGluc2VjdXJlIGNvZGUuXG4gICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfTtcbn1cblxuLy8gZGV0ZWN0IGEgUmhpbm8gYnVnIGFuZCBwYXRjaCBpdFxudHJ5IHtcbiAgICBPYmplY3QuZnJlZXplKGZ1bmN0aW9uICgpIHt9KTtcbn0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIE9iamVjdC5mcmVlemUgPSAoZnVuY3Rpb24gZnJlZXplKGZyZWV6ZU9iamVjdCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gZnJlZXplKG9iamVjdCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBvYmplY3QgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZyZWV6ZU9iamVjdChvYmplY3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pKE9iamVjdC5mcmVlemUpO1xufVxuXG4vLyBFUzUgMTUuMi4zLjEwXG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS4yLjMuMTBcbmlmICghT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zKSB7XG4gICAgT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zID0gZnVuY3Rpb24gcHJldmVudEV4dGVuc2lvbnMob2JqZWN0KSB7XG4gICAgICAgIC8vIHRoaXMgaXMgbWlzbGVhZGluZyBhbmQgYnJlYWtzIGZlYXR1cmUtZGV0ZWN0aW9uLCBidXRcbiAgICAgICAgLy8gYWxsb3dzIFwic2VjdXJhYmxlXCIgY29kZSB0byBcImdyYWNlZnVsbHlcIiBkZWdyYWRlIHRvIHdvcmtpbmdcbiAgICAgICAgLy8gYnV0IGluc2VjdXJlIGNvZGUuXG4gICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfTtcbn1cblxuLy8gRVM1IDE1LjIuMy4xMVxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuMi4zLjExXG5pZiAoIU9iamVjdC5pc1NlYWxlZCkge1xuICAgIE9iamVjdC5pc1NlYWxlZCA9IGZ1bmN0aW9uIGlzU2VhbGVkKG9iamVjdCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbn1cblxuLy8gRVM1IDE1LjIuMy4xMlxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuMi4zLjEyXG5pZiAoIU9iamVjdC5pc0Zyb3plbikge1xuICAgIE9iamVjdC5pc0Zyb3plbiA9IGZ1bmN0aW9uIGlzRnJvemVuKG9iamVjdCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbn1cblxuLy8gRVM1IDE1LjIuMy4xM1xuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuMi4zLjEzXG5pZiAoIU9iamVjdC5pc0V4dGVuc2libGUpIHtcbiAgICBPYmplY3QuaXNFeHRlbnNpYmxlID0gZnVuY3Rpb24gaXNFeHRlbnNpYmxlKG9iamVjdCkge1xuICAgICAgICAvLyAxLiBJZiBUeXBlKE8pIGlzIG5vdCBPYmplY3QgdGhyb3cgYSBUeXBlRXJyb3IgZXhjZXB0aW9uLlxuICAgICAgICBpZiAoT2JqZWN0KG9iamVjdCkgIT09IG9iamVjdCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpOyAvLyBUT0RPIG1lc3NhZ2VcbiAgICAgICAgfVxuICAgICAgICAvLyAyLiBSZXR1cm4gdGhlIEJvb2xlYW4gdmFsdWUgb2YgdGhlIFtbRXh0ZW5zaWJsZV1dIGludGVybmFsIHByb3BlcnR5IG9mIE8uXG4gICAgICAgIHZhciBuYW1lID0gJyc7XG4gICAgICAgIHdoaWxlIChvd25zKG9iamVjdCwgbmFtZSkpIHtcbiAgICAgICAgICAgIG5hbWUgKz0gJz8nO1xuICAgICAgICB9XG4gICAgICAgIG9iamVjdFtuYW1lXSA9IHRydWU7XG4gICAgICAgIHZhciByZXR1cm5WYWx1ZSA9IG93bnMob2JqZWN0LCBuYW1lKTtcbiAgICAgICAgZGVsZXRlIG9iamVjdFtuYW1lXTtcbiAgICAgICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICAgIH07XG59XG5cbn0pO1xuIiwiIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vbGliL2x1YycpOyIsInZhciBMdWMgPSByZXF1aXJlKCcuL2x1Y1Rlc3RMaWInKSxcbiAgICBleHBlY3QgPSByZXF1aXJlKCdleHBlY3QuanMnKTtcbmRlc2NyaWJlKCdMdWMgT2JqZWN0IGZ1bmN0aW9ucycsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdlYWNoJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB0ID0ge1xuICAgICAgICAgICAgYTogJ2EnLFxuICAgICAgICAgICAgYjogJ2InLFxuICAgICAgICAgICAgejogJ3onXG4gICAgICAgIH0sIG9iaiA9IHtzdHIgOiAnJ307XG5cbiAgICAgICAgTHVjLk9iamVjdC5lYWNoKHQsIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuc3RyICs9IGtleSArIHZhbHVlO1xuICAgICAgICB9LCBvYmopO1xuICAgICAgICBleHBlY3Qob2JqLnN0cikudG8uZXFsKCdhYWJienonKTtcbiAgICB9KTtcblxuICAgIGl0KCdhcHBseScsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYSA9IHtiOiAzfTtcbiAgICAgICAgTHVjLmFwcGx5KGEsIHthOiAxLCBiOjJ9KTtcbiAgICAgICAgZXhwZWN0KGEpLnRvLmVxbCh7YTogMSwgYjoyfSk7XG4gICAgICAgIGEgPSB7YjogM307XG4gICAgICAgIEx1Yy5hcHBseShhLCB7YTogMX0pO1xuICAgICAgICBleHBlY3QoYSkudG8uZXFsKHthOiAxLCBiOiAzfSk7XG4gICAgICAgIGV4cGVjdChMdWMuYXBwbHkoe30sIHVuZGVmaW5lZCkpLnRvLmVxbCh7fSk7XG4gICAgICAgIGV4cGVjdChMdWMuYXBwbHkodW5kZWZpbmVkLCB7fSkpLnRvLmVxbCh7fSk7XG4gICAgfSk7XG5cbiAgICBpdCgnbWl4JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhID0ge2I6IDN9O1xuICAgICAgICBMdWMubWl4KGEsIHthOiAxLCBiOjJ9KTtcbiAgICAgICAgZXhwZWN0KGEpLnRvLmVxbCh7YTogMSwgYjozfSk7XG4gICAgfSk7XG5cbiAgICBpdCgndG9PYmplY3QnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGEgPSB7fSxcbiAgICAgICAgICAgIGIgPSBbXSxcbiAgICAgICAgICAgIHRvT2JqZWN0QXJncyxcbiAgICAgICAgICAgIHRvT2JqZWN0QXJyYXk7XG5cbiAgICAgICAgdG9PYmplY3RBcnJheSA9IEx1Yy5PYmplY3QudG9PYmplY3QoWyduYW1lMScsICduYW1lMiddLCBbYSxiXSk7XG4gICAgICAgIGV4cGVjdCh0b09iamVjdEFycmF5Lm5hbWUxKS50by5lcWwoYSk7XG4gICAgICAgIGV4cGVjdCh0b09iamVjdEFycmF5Lm5hbWUyKS50by5lcWwoYik7XG5cbiAgICAgICAgKGZ1bmN0aW9uKGMsZCl7XG4gICAgICAgICAgICB0b09iamVjdEFyZ3MgPSBMdWMuT2JqZWN0LnRvT2JqZWN0KFsnbmFtZTEnLCAnbmFtZTInXSwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIGV4cGVjdCh0b09iamVjdEFyZ3MubmFtZTEpLnRvLmVxbChhKTtcbiAgICAgICAgICAgIGV4cGVjdCh0b09iamVjdEFyZ3MubmFtZTIpLnRvLmVxbChiKTtcbiAgICAgICAgfShhLGIpKTtcbiAgICB9KTtcblxuICAgIGl0KCdmaWx0ZXIgbm9uIG93blByb3BlcnRpZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG9iaiA9IE9iamVjdC5jcmVhdGUoe2E6IDEsIGI6Mn0pLFxuICAgICAgICAgICAgZmlsdGVyZWQ7XG5cbiAgICAgICAgZmlsdGVyZWQgPSBMdWMuT2JqZWN0LmZpbHRlcihvYmosIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBrZXkgPT09ICdhJztcbiAgICAgICAgfSwgdW5kZWZpbmVkLCB7XG4gICAgICAgICAgICBvd25Qcm9wZXJ0aWVzOiBmYWxzZVxuICAgICAgICB9KTtcblxuICAgICAgICBleHBlY3QoZmlsdGVyZWQpLnRvLmVxbChbe2tleTogJ2EnLCB2YWx1ZTogMX1dKTtcbiAgICB9KTtcblxuICAgIGl0KCdmaWx0ZXIgb3duUHJvcGVydGllcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgb2JqID0gT2JqZWN0LmNyZWF0ZSh7YTogMSwgYjoyfSksXG4gICAgICAgICAgICBmaWx0ZXJlZDtcblxuICAgICAgICBvYmouYyA9IDM7XG5cbiAgICAgICAgZmlsdGVyZWQgPSBMdWMuT2JqZWN0LmZpbHRlcihvYmosIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBrZXkgPT09ICdhJztcbiAgICAgICAgfSwgdW5kZWZpbmVkLCB7XG4gICAgICAgICAgICBvd25Qcm9wZXJ0aWVzOiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGV4cGVjdChmaWx0ZXJlZCkudG8uZXFsKFtdKTtcblxuICAgICAgICBmaWx0ZXJlZCA9IEx1Yy5PYmplY3QuZmlsdGVyKG9iaiwgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGtleSA9PT0gJ2MnO1xuICAgICAgICB9LCB1bmRlZmluZWQsIHtcbiAgICAgICAgICAgIG93blByb3BlcnRpZXM6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZXhwZWN0KGZpbHRlcmVkKS50by5lcWwoW3trZXk6ICdjJywgdmFsdWU6IDN9XSk7XG4gICAgfSk7XG5cbiAgICBpdCgnbWVyZ2UnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1lcmdlID0gTHVjLk9iamVjdC5tZXJnZTtcblxuICAgICAgICBleHBlY3QobWVyZ2Uoe30sIHthOjF9KSkudG8uZXFsKHthOjF9KTtcbiAgICAgICAgZXhwZWN0KG1lcmdlKHthOmZhbHNlfSwge2E6MX0pKS50by5lcWwoe2E6ZmFsc2V9KTtcbiAgICAgICAgZXhwZWN0KG1lcmdlKHthOltdfSwge2E6e2E6MX19KSkudG8uZXFsKHthOltdfSk7XG4gICAgICAgIGV4cGVjdChtZXJnZSh7YToxLGI6MiwgYzpudWxsfSwge2E6MiwgYjozLCBjOiB7YTpbXX19KSkudG8uZXFsKHthOjEsYjoyLCBjOnthOltdfX0pO1xuICAgICAgICBleHBlY3QobWVyZ2Uoe2E6e2E6e2E6e2E6MX19fX0sIHthOnthOnthOnthOjIsIGI6Mn19fX0pKS50by5lcWwoe2E6e2E6e2E6e2E6MSwgYjoyfX19fSk7XG4gICAgICAgIGV4cGVjdChtZXJnZSh7YTp7YTp7YTp7YToxfX19fSwge2E6e2E6e2E6e2E6MiwgYjoyfX19fSkpLnRvLmVxbCh7YTp7YTp7YTp7YToxLCBiOjJ9fX19KTtcbiAgICB9KTtcbn0pOyIsInZhciBMdWMgPSByZXF1aXJlKCcuL2x1Y1Rlc3RMaWInKSxcbiAgICBleHBlY3QgPSByZXF1aXJlKCdleHBlY3QuanMnKTtcblxuZGVzY3JpYmUoJ0x1YyBBcnJheSBmdW5jdGlvbnMnLCBmdW5jdGlvbigpIHtcbiAgICBpdCgnZWFjaCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJyID0gWydhJywgJ2InLCAneiddLCBvYmogPSB7c3RyIDonJyB9O1xuXG4gICAgICAgIEx1Yy5BcnJheS5lYWNoKGFyciwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBhKSB7XG4gICAgICAgICAgICB0aGlzLnN0ciArPSB2YWx1ZSArIGluZGV4ICsgYS5sZW5ndGg7XG4gICAgICAgIH0sIG9iaik7XG4gICAgICAgIGV4cGVjdChvYmouc3RyKS50by5lcWwoJ2EwM2IxM3oyMycpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3RvQXJyYXknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS50b0FycmF5KHVuZGVmaW5lZCkpLnRvLmVxbChbXSk7XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkudG9BcnJheShudWxsKSkudG8uZXFsKFtdKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS50b0FycmF5KFtdKSkudG8uZXFsKFtdKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS50b0FycmF5KCcnKSkudG8uZXFsKFsnJ10pO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LnRvQXJyYXkoWzFdKSkudG8uZXFsKFsxXSk7XG4gICAgfSk7XG5cbiAgICBpdCgnaW5zZXJ0IGFwcGVuZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJyMSA9IFsxLCAyLCAzXSxcbiAgICAgICAgICAgIGFycjIgPSBbNCwgNSwgNl07XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkuaW5zZXJ0KGFycjEsIGFycjIsIHRydWUpKS50by5iZS5lcWwoWzEsIDIsIDMsIDQsIDUsIDZdKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5pbnNlcnQoYXJyMiwgYXJyMSwgdHJ1ZSkpLnRvLmJlLmVxbChbNCwgNSwgNiwgMSwgMiwgM10pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2luc2VydCBmcm9tIGluZGV4ZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFycjEgPSBbMSwgMiwgM10sXG4gICAgICAgICAgICBhcnIyID0gWzQsIDUsIDZdO1xuXG4gICAgICAgICAgICBleHBlY3QoTHVjLkFycmF5Lmluc2VydChhcnIxLCBhcnIyLCAzKSkudG8uYmUuZXFsKFsxLDIsMyw0LDUsNl0pO1xuICAgICAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5pbnNlcnQoYXJyMSwgYXJyMiwgMikpLnRvLmJlLmVxbChbMSwyLDQsNSw2LDNdKTtcbiAgICAgICAgICAgIGV4cGVjdChMdWMuQXJyYXkuaW5zZXJ0KGFycjEsIGFycjIsIDEpKS50by5iZS5lcWwoWzEsNCw1LDYsMiwzXSk7XG4gICAgICAgICAgICBleHBlY3QoTHVjLkFycmF5Lmluc2VydChhcnIxLCBhcnIyLCAwKSkudG8uYmUuZXFsKFs0LDUsNiwgMSwyLDNdKTtcblxuICAgICAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5pbnNlcnQoYXJyMiwgYXJyMSwgMykpLnRvLmJlLmVxbChbNCw1LDYsMSwyLDNdKTtcbiAgICAgICAgICAgIGV4cGVjdChMdWMuQXJyYXkuaW5zZXJ0KGFycjIsIGFycjEsIDIpKS50by5iZS5lcWwoWzQsNSwxLDIsMyw2XSk7XG4gICAgICAgICAgICBleHBlY3QoTHVjLkFycmF5Lmluc2VydChhcnIyLCBhcnIxLCAxKSkudG8uYmUuZXFsKFs0LDEsMiwzLDUsNl0pO1xuICAgICAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5pbnNlcnQoYXJyMiwgYXJyMSwgMCkpLnRvLmJlLmVxbChbMSwyLDMsNCw1LDZdKTtcblxuICAgIH0pO1xuXG5cbiAgICBpdCgnaW5zZXJ0IGFycmF5cyBhcmUgbm90IG1vZGlmaWVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcnIxID0gWzEsIDIsIDNdLFxuICAgICAgICAgICAgYXJyMiA9IFs0LCA1LCA2XTtcbiAgICAgICAgTHVjLkFycmF5Lmluc2VydChhcnIxLCBhcnIyLCAxKTtcbiAgICAgICAgTHVjLkFycmF5Lmluc2VydChhcnIyLCBhcnIxLCAxKTtcbiAgICAgICAgLy90ZXN0IG5vIG1vZGlmeVxuICAgICAgICBleHBlY3QoYXJyMSkudG8uYmUuZXFsKFsxLCAyLCAzXSk7XG4gICAgICAgIGV4cGVjdChhcnIyKS50by5iZS5lcWwoWzQsIDUsIDZdKTtcbiAgICB9KTtcblxuICAgIGl0KCdyZW1vdmVBbGwgd2l0aCBzaW5nbGUgZmFsc3knLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyciA9IFtmYWxzZSwgZmFsc2UsIDAsICcnXTtcbiAgICAgICAgdmFyIHJldCA9IEx1Yy5BcnJheS5yZW1vdmVBbGwoYXJyLCAnJyk7XG5cbiAgICAgICAgZXhwZWN0KGFycikudG8uYmUuZXFsKFtmYWxzZSwgZmFsc2UsIDBdKTtcbiAgICAgICAgZXhwZWN0KHJldCkudG8uYmUuZXFsKFsnJ10pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3JlbW92ZUFsbCBhbGwgdmFsdWVzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcnIgPSBbZmFsc2UsIGZhbHNlLCBmYWxzZV07XG4gICAgICAgIHZhciByZXQgPSBMdWMuQXJyYXkucmVtb3ZlQWxsKGFyciwgZmFsc2UpO1xuXG4gICAgICAgIGV4cGVjdChhcnIpLnRvLmJlLmVxbChbXSk7XG4gICAgICAgIGV4cGVjdChyZXQpLnRvLmJlLmVxbChbZmFsc2UsIGZhbHNlLCBmYWxzZV0pO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LnJlbW92ZUFsbChhcnIsIGZhbHNlKSkudG8uYmUuZXFsKFtdKTtcbiAgICB9KTtcblxuICAgIGl0KCdyZW1vdmVBbGwgbG9vc2UgY29tcGFyaXNvbicsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJyID0gW3t9LCB7YToxfSwge2E6MSwgYjoyfV07XG4gICAgICAgIHZhciByZXQgPSBMdWMuQXJyYXkucmVtb3ZlQWxsKGFyciwge2E6IDF9KTtcblxuICAgICAgICBleHBlY3QocmV0KS50by5iZS5lcWwoW3thOjF9LCB7YToxLCBiOjJ9XSk7XG4gICAgICAgIGV4cGVjdChhcnIpLnRvLmJlLmVxbChbe31dKTtcbiAgICB9KTtcblxuICAgIGl0KCdyZW1vdmVBbGwgZGVlcCBjb21wYXJpc29uJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcnIgPSBbe30sIHthOjF9LCB7YToxLCBiOjJ9XTtcbiAgICAgICAgdmFyIHJldCA9IEx1Yy5BcnJheS5yZW1vdmVBbGwoYXJyLCB7YTogMX0sIHt0eXBlOiAnZGVlcCd9KTtcblxuICAgICAgICBleHBlY3QocmV0KS50by5iZS5lcWwoW3thOjF9XSk7XG4gICAgICAgIGV4cGVjdChhcnIpLnRvLmJlLmVxbChbe30se2E6MSwgYjoyfV0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3JlbW92ZUFsbE5vdCBzaW5nbGUgZmFsc3knLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyciA9IFtmYWxzZSwgZmFsc2UsIDAsICcnXSxcbiAgICAgICAgICAgIHJldCA9IEx1Yy5BcnJheS5yZW1vdmVBbGxOb3QoYXJyLCAnJyk7XG5cbiAgICAgICAgZXhwZWN0KGFycikudG8uYmUuZXFsKFsnJ10pO1xuICAgICAgICBleHBlY3QocmV0KS50by5iZS5lcWwoW2ZhbHNlLCBmYWxzZSwgMF0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3JlbW92ZUFsbE5vdCBubyBtYXRjaGVzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcnIgPSBbZmFsc2UsIGZhbHNlLCBmYWxzZV07XG4gICAgICAgIHZhciByZXQgPSBMdWMuQXJyYXkucmVtb3ZlQWxsTm90KGFyciwgZmFsc2UpO1xuXG4gICAgICAgIGV4cGVjdChhcnIpLnRvLmJlLmVxbChbZmFsc2UsIGZhbHNlLCBmYWxzZV0pO1xuICAgICAgICBleHBlY3QocmV0KS50by5iZS5lcWwoW10pO1xuXG4gICAgfSk7XG5cbiAgICBpdCgncmVtb3ZlQWxsTm90IHNpbmdsZSBsb29zZSBjb21wYXJlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcnIgPSBbe30sIHthOjF9LCB7YToxLCBiOjJ9XTtcbiAgICAgICAgdmFyIHJldCA9IEx1Yy5BcnJheS5yZW1vdmVBbGxOb3QoYXJyLCB7YTogMX0pO1xuXG4gICAgICAgIGV4cGVjdChhcnIpLnRvLmJlLmVxbChbe2E6MX0sIHthOjEsIGI6Mn1dKTtcbiAgICAgICAgZXhwZWN0KHJldCkudG8uYmUuZXFsKFt7fV0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3JlbW92ZUZpcnN0IGZpcnN0IG11bHRpIGFycmF5IG1hdGNoJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcnIgPSBbW10sWzEsMl0sIFsxLDJdXTtcbiAgICAgICAgdmFyIHJldCA9IEx1Yy5BcnJheS5yZW1vdmVGaXJzdChhcnIsIFsxLDJdKTtcblxuICAgICAgICBleHBlY3QoYXJyKS50by5iZS5lcWwoW1tdLFsxLDJdXSk7XG4gICAgICAgIGV4cGVjdChyZXQpLnRvLmJlLmVxbChbMSwyXSk7XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkucmVtb3ZlRmlyc3QoYXJyLCBbMSwyXSkpLnRvLmJlLmVxbChbMSwyXSk7XG4gICAgfSk7XG5cbiAgICBpdCgncmVtb3ZlRmlyc3QgZW1wdHkgYXJyYXkgc3RyaWN0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcnIgPSBbW10sIFtdLCBbXV07XG4gICAgICAgIHZhciByZXQgPSBMdWMuQXJyYXkucmVtb3ZlRmlyc3QoYXJyLCBbXSwge3R5cGU6ICdzdHJpY3QnfSk7XG4gICAgICAgIGV4cGVjdChhcnIpLnRvLmJlLmVxbChbW10sW10sW11dKTtcbiAgICAgICAgZXhwZWN0KHJldCkudG8uYmUuZXFsKGZhbHNlKTtcbiAgICB9KTtcblxuICAgIGl0KCdyZW1vdmVGaXJzdCBlbXB0eSBhcnJheSBzaGFsbG93JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcnIgPSBbW10sIFtdLCBbXV07XG4gICAgICAgIHZhciByZXQgPSBMdWMuQXJyYXkucmVtb3ZlRmlyc3QoYXJyLCBbXSwge3R5cGU6ICdzaGFsbG93J30pO1xuICAgICAgICBleHBlY3QoYXJyKS50by5iZS5lcWwoW1tdLFtdXSk7XG4gICAgICAgIGV4cGVjdChyZXQpLnRvLmJlLmVxbChbXSk7XG4gICAgfSk7XG5cbiAgICBpdCgncmVtb3ZlRmlyc3ROb3QgbXVsdGkgYXJyYXkgbWF0Y2gnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyciA9IFtbXSxbMSwyXSwgWzEsMl1dO1xuICAgICAgICB2YXIgcmV0ID0gTHVjLkFycmF5LnJlbW92ZUZpcnN0Tm90KGFyciwgW10pO1xuXG4gICAgICAgIGV4cGVjdChhcnIpLnRvLmJlLmVxbChbW10sWzEsMl1dKTtcbiAgICAgICAgZXhwZWN0KHJldCkudG8uYmUuZXFsKFsxLDJdKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5yZW1vdmVGaXJzdE5vdChhcnIsIFsxLDJdKSkudG8uYmUuZXFsKFtdKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5yZW1vdmVGaXJzdE5vdChhcnIsIFsxLDJdKSkudG8uYmUoZmFsc2UpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3JlbW92ZUZpcnN0Tm90IG5vdCBtYXRjaGVzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcnIgPSBbe2E6MX0sIHthOjEsIGI6Mn0sIHthOjF9XTtcbiAgICAgICAgdmFyIHJldCA9IEx1Yy5BcnJheS5yZW1vdmVGaXJzdE5vdChhcnIsIHthOiAxfSk7XG5cbiAgICAgICAgZXhwZWN0KGFycikudG8uYmUuZXFsKFt7YToxfSwge2E6MSwgYjoyfSwge2E6MX1dKTtcbiAgICAgICAgZXhwZWN0KHJldCkudG8uYmUuZXFsKGZhbHNlKTtcbiAgICB9KTtcblxuICAgIGl0KCdyZW1vdmVGaXJzdE5vdCBub3Qgc3RyaWN0IGNvbXBhcmUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGEgPSB7YTogMX07XG4gICAgICAgIHZhciBhcnIgPSBbe2E6MX0sIHthOjEsIGI6Mn0sIGFdO1xuXG4gICAgICAgIHZhciByZXQgPSBMdWMuQXJyYXkucmVtb3ZlRmlyc3ROb3QoYXJyLCB7YToxfSwge3R5cGU6ICdzdHJpY3QnfSk7XG4gICAgICAgIGV4cGVjdChhcnIpLnRvLmJlLmVxbChbe2E6MSwgYjoyfSwge2E6MX1dKTtcbiAgICAgICAgZXhwZWN0KHJldCkudG8uYmUuZXFsKHthOjF9KTtcbiAgICAgICAgTHVjLkFycmF5LnJlbW92ZUZpcnN0Tm90KGFyciwgYSwge3R5cGU6ICdzdHJpY3QnfSk7XG4gICAgICAgIEx1Yy5BcnJheS5yZW1vdmVGaXJzdE5vdChhcnIsIGEsIHt0eXBlOiAnc3RyaWN0J30pO1xuICAgICAgICByZXQgPSBMdWMuQXJyYXkucmVtb3ZlRmlyc3ROb3QoYXJyLCBhLCB7dHlwZTogJ3N0cmljdCd9KTtcbiAgICAgICAgZXhwZWN0KGFycikudG8uYmUuZXFsKFt7YToxfV0pO1xuICAgICAgICBleHBlY3QocmV0KS50by5iZShmYWxzZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnZmluZEZpcnN0IGhhbmRsZSBsb29zZSBjb21wYXJlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICB2YXIgYXJyID0gW3thOjF9LCB7YToxfSwge2E6MX0sIHthOjEsIGI6Mn1dO1xuICAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5maW5kRmlyc3QoYXJyLCB7YToxLCBiOjJ9KSkudG8uYmUuZXFsKHthOjEsIGI6Mn0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2ZpbmRGaXJzdCBzdHJpY3QgY29tcGFyZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJyID0gW3thOjF9LCB7YToxfSwge2E6MX0sIHthOjEsIGI6Mn1dO1xuICAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5maW5kRmlyc3QoYXJyLCB7YToxLCBiOjJ9LCB7dHlwZTogJ3N0cmljdCd9KSkudG8uYmUuZXFsKGZhbHNlKTtcbiAgICB9KTtcblxuICAgIGl0KCdmaW5kRmlyc3QgbWF0Y2ggYWxsIHByb3BzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcnIgPSBbe2E6MX0sIHthOjF9LCB7YToxfSwge2E6MSwgYjoyfV07XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkuZmluZEZpcnN0KGFyciwge2E6MSwgYjoyLCBjOjN9KSkudG8uYmUuZXFsKGZhbHNlKTtcbiAgICB9KTtcblxuICAgIGl0KCdmaW5kRmlyc3QgYWxsIGZhbHN5cycsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJyID0gW2ZhbHNlLCAwLCB1bmRlZmluZWQsIG51bGwsICcnXTtcbiAgICAgICAgLy9zaGltL0lFIGJ1Z1xuICAgICAgICBpZigwIGluIFt1bmRlZmluZWRdKSB7XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkuZmluZEZpcnN0KGFyciwgbnVsbCkpLnRvLmJlLmVxbChudWxsKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5maW5kRmlyc3QoYXJyLCBmYWxzZSkpLnRvLmJlLmVxbChmYWxzZSk7XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkuZmluZEZpcnN0KGFyciwgdW5kZWZpbmVkKSkudG8uYmUuZXFsKHVuZGVmaW5lZCk7XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkuZmluZEZpcnN0KGFyciwgMCkpLnRvLmJlLmVxbCgwKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgaXQoJ2ZpbmRGaXJzdCBkYXRlcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgdmFyIGFyciA9IFtuZXcgRGF0ZSgxMDAwKSwgbmV3IERhdGUoMTAwMCksIG5ldyBEYXRlKDEwMDEpXTtcbiAgICAgICAgIGV4cGVjdChMdWMuQXJyYXkuZmluZEZpcnN0KGFyciwgbmV3IERhdGUoMTAwMSkpKS50by5iZS5lcWwobmV3IERhdGUoMTAwMSkpO1xuICAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5maW5kRmlyc3QoYXJyLCBuZXcgRGF0ZSgxMDAyKSkpLnRvLmJlKGZhbHNlKTtcbiAgICB9KTtcblxuICAgIGl0KCdmaW5kRmlyc3Qgc3RyaWN0IGFuZCBzaGFsbG93IGRhdGVzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICB2YXIgZCA9IG5ldyBEYXRlKCk7XG4gICAgICAgICB2YXIgYXJyID0gW25ldyBEYXRlKDEwMDApLCBuZXcgRGF0ZSgxMDAwKSwgZF07XG4gICAgICAgICBleHBlY3QoTHVjLkFycmF5LmZpbmRGaXJzdChhcnIsIGQsIHt0eXBlOiAnc3RyaWN0J30pKS50by5iZShkKTtcbiAgICAgICAgIGV4cGVjdChMdWMuQXJyYXkuZmluZEZpcnN0KGFyciwgZCwge3R5cGU6ICdzaGFsbG93J30pKS50by5iZShkKTtcbiAgICB9KTtcblxuICAgIGl0KCdmaW5kRmlyc3ROb3QgbWF0Y2hpbmcgZmlyc3Qga2V5IHZhbHVlJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIGFyciA9IFt7YToxfSwge2E6MX0sIHthOjF9LCB7YToxLCBiOjJ9XTtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5maW5kRmlyc3ROb3QoYXJyLCB7YToxLCBiOjJ9KSkudG8uYmUuZXFsKHthOjF9KTtcbiAgICB9KVxuXG4gICAgaXQoJ2ZpbmRGaXJzdE5vdCBmYWxzeXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyciA9IFsnJywgJycsICcnLCBudWxsXTtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5maW5kRmlyc3ROb3QoYXJyLCBudWxsKSkudG8uYmUuZXFsKCcnKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5maW5kRmlyc3ROb3QoYXJyLCAnJykpLnRvLmJlLmVxbChudWxsKTtcbiAgICAgICAgYXJyID0gWycnLCAnJywgJyddO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LmZpbmRGaXJzdE5vdChhcnIsICcnKSkudG8uYmUuZXFsKGZhbHNlKTtcbiAgICB9KTtcblxuICAgIGl0KCdmaW5kRmlyc3ROb3QgcHJpbWl0aXZlcyBhbmQgbm9uLXByaW1pdGl2ZXMnLCBmdW5jdGlvbigpe1xuICAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5maW5kRmlyc3ROb3QoWzEsMiwzLHt9XSwge30pKS50by5iZSgxKTtcbiAgICB9KTtcblxuICAgIGl0KCdmaW5kQWxsIGZpbmQgZXhhY3Qgb2JqZWN0IGtleXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyciA9IFt7YToxfSwge2E6MX0sIHthOjF9LCB7YToxLCBiOjJ9LCB7YjoyfV07XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkuZmluZEFsbChhcnIsIHthOjEsIGI6Mn0pKS50by5iZS5lcWwoW3thOjEsIGI6Mn1dKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5maW5kQWxsKGFyciwge2E6MX0pKS50by5iZS5lcWwoW3thOjF9LHthOjF9LHthOjF9LHthOjEsIGI6Mn1dKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5maW5kQWxsKGFyciwge2E6MSwgYjoyfSwge3R5cGU6ICdzdHJpY3QnfSkpLnRvLmJlLmVxbChbXSk7XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkuZmluZEFsbChhcnIsIHthOjEsIGI6MiwgYzozfSkpLnRvLmJlLmVxbChbXSk7XG4gICAgfSk7XG5cbiAgICBpdCgnZmluZEFsbCBmaW5kIGV4YWN0IGFycmF5IHZhbHVlcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJyID0gW1tdLFsxLDJdLCBbMSwyXV07XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkuZmluZEFsbChhcnIsIFsxLDJdKSkudG8uYmUuZXFsKFtbMSwyXSwgWzEsMl1dKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5maW5kQWxsKGFyciwgWzFdKSkudG8uZXFsKFtdKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5maW5kQWxsKGFyciwgWzIsMl0pKS50by5lcWwoW10pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2ZpbmRBbGwgZmFsc3kgdmFsdWVzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcnIgPSBbZmFsc2UsIDAsIHVuZGVmaW5lZCwgbnVsbCwgJyddO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LmZpbmRBbGwoYXJyLCBudWxsKSkudG8uYmUuZXFsKFtudWxsXSk7XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkuZmluZEFsbChhcnIsIGZhbHNlKSkudG8uYmUuZXFsKFtmYWxzZV0pO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LmZpbmRBbGwoYXJyLCB1bmRlZmluZWQpKS50by5iZS5lcWwoW3VuZGVmaW5lZF0pO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LmZpbmRBbGwoYXJyLCAwKSkudG8uYmUuZXFsKFswXSk7XG4gICAgfSk7XG5cbiAgICBpdCgnZmluZEFsbCBkYXRlIHZhbHVlcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJyID0gW25ldyBEYXRlKDEwMDApLCBuZXcgRGF0ZSgxMDAwKSwgbmV3IERhdGUoMTAwMSksIGZhbHNlXTtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5maW5kQWxsKGFyciwgbmV3IERhdGUoMTAwMSkpKS50by5iZS5lcWwoW25ldyBEYXRlKDEwMDEpXSk7XG4gICAgfSk7XG5cbiAgICBpdCgnZmluZEFsbE5vdCBtYXRjaCBhbGwga2V5cycsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJyID0gW3thOjF9LCB7YToxfSwge2E6MX0sIHthOjEsIGI6Mn1dO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LmZpbmRBbGxOb3QoYXJyLCB7YToxLCBiOjJ9KSkudG8uYmUuZXFsKFt7YToxfSx7YToxfSx7YToxfV0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2ZpbmRBbGxOb3QgZmFsc3kgdmFsdWVzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGFyciA9IFsnJywgJycsICcnLCBudWxsXTtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5maW5kQWxsTm90KGFyciwgbnVsbCkpLnRvLmJlLmVxbChbJycsJycsJyddKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5maW5kQWxsTm90KGFyciwgJycpKS50by5iZS5lcWwoW251bGxdKTtcbiAgICAgICAgYXJyID0gWycnLCAnJywgJyddO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LmZpbmRBbGxOb3QoYXJyLCAnJykpLnRvLmJlLmVxbChbXSk7XG4gICAgfSk7XG5cbiAgICBpdCgnZHluYW1pYyBmaW5kRmlyc3ROb3QnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5maW5kRmlyc3ROb3RGYWxzZShbZmFsc2UsIDFdKSkudG8uYmUoMSk7XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkuZmluZEZpcnN0Tm90VHJ1ZShbdHJ1ZSwgMV0pKS50by5iZSgxKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5maW5kRmlyc3ROb3ROdWxsKFtudWxsLCAxXSkpLnRvLmJlKDEpO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LmZpbmRGaXJzdE5vdFVuZGVmaW5lZChbdW5kZWZpbmVkLCAxXSkpLnRvLmJlKDEpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2R5bmFtaWMgZmluZEFsbE5vdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LmZpbmRBbGxOb3RGYWxzZShbZmFsc2UsIDFdKSkudG8uYmUuZXFsKFsxXSk7XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkuZmluZEFsbE5vdFRydWUoW3RydWUsIDFdKSkudG8uYmUuZXFsKFsxXSk7XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkuZmluZEFsbE5vdE51bGwoW251bGwsIDFdKSkudG8uYmUuZXFsKFsxXSk7XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkuZmluZEFsbE5vdFVuZGVmaW5lZChbdW5kZWZpbmVkLCAxXSkpLnRvLmJlLmVxbChbMV0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2R5bmFtaWMgcmVtb3ZlRmlyc3ROb3QnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5yZW1vdmVGaXJzdE5vdEZhbHNlKFtmYWxzZSwgMV0pKS50by5iZSgxKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5yZW1vdmVGaXJzdE5vdFRydWUoW3RydWUsIDFdKSkudG8uYmUoMSk7XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkucmVtb3ZlRmlyc3ROb3ROdWxsKFtudWxsLCAxXSkpLnRvLmJlKDEpO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LnJlbW92ZUZpcnN0Tm90VW5kZWZpbmVkKFt1bmRlZmluZWQsIDFdKSkudG8uYmUoMSk7XG4gICAgfSk7XG5cbiAgICBpdCgnZHluYW1pYyByZW1vdmVBbGxOb3QnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5yZW1vdmVBbGxOb3RGYWxzZShbZmFsc2UsIDFdKSkudG8uYmUuZXFsKFsxXSk7XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkucmVtb3ZlQWxsTm90VHJ1ZShbdHJ1ZSwgMV0pKS50by5iZS5lcWwoWzFdKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5yZW1vdmVBbGxOb3ROdWxsKFtudWxsLCAxXSkpLnRvLmJlLmVxbChbMV0pO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LnJlbW92ZUFsbE5vdFVuZGVmaW5lZChbdW5kZWZpbmVkLCAxXSkpLnRvLmJlLmVxbChbMV0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2R5bmFtaWMgcmVtb3ZlRmlyc3QnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5yZW1vdmVGaXJzdEZhbHNlKFtmYWxzZSwgMV0pKS50by5iZShmYWxzZSk7XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkucmVtb3ZlRmlyc3RUcnVlKFt0cnVlLCAxXSkpLnRvLmJlKHRydWUpO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LnJlbW92ZUZpcnN0TnVsbChbbnVsbCwgMV0pKS50by5iZShudWxsKTtcbiAgICAgICAgLy9zaGltL0lFIGJ1Z1xuICAgICAgICBpZigwIGluIFt1bmRlZmluZWRdKSB7XG4gICAgICAgICAgICBleHBlY3QoTHVjLkFycmF5LnJlbW92ZUZpcnN0VW5kZWZpbmVkKFt1bmRlZmluZWQsIDFdKSkudG8uYmUodW5kZWZpbmVkKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgaXQoJ2R5bmFtaWMgcmVtb3ZlQWxsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkucmVtb3ZlQWxsRmFsc2UoW2ZhbHNlLCAxXSkpLnRvLmJlLmVxbChbZmFsc2VdKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5yZW1vdmVBbGxUcnVlKFt0cnVlLCAxXSkpLnRvLmJlLmVxbChbdHJ1ZV0pO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LnJlbW92ZUFsbE51bGwoW251bGwsIDFdKSkudG8uYmUuZXFsKFtudWxsXSk7XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkucmVtb3ZlQWxsVW5kZWZpbmVkKFt1bmRlZmluZWQsIDFdKSkudG8uYmUuZXFsKFt1bmRlZmluZWRdKTtcbiAgICB9KTtcblxuICAgIGl0KCdkeW5hbWljIHJlbW92ZUxhc3ROb3QnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5yZW1vdmVMYXN0Tm90RmFsc2UoW2ZhbHNlLCAxXSkpLnRvLmJlKDEpO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LnJlbW92ZUxhc3ROb3RUcnVlKFt0cnVlLCAxXSkpLnRvLmJlKDEpO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LnJlbW92ZUxhc3ROb3ROdWxsKFtudWxsLCAxXSkpLnRvLmJlKDEpO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LnJlbW92ZUxhc3ROb3RVbmRlZmluZWQoW3VuZGVmaW5lZCwgMV0pKS50by5iZSgxKTtcbiAgICB9KTtcblxuICAgIGl0KCdkeW5hbWljIHJlbW92ZUxhc3QnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5yZW1vdmVMYXN0RmFsc2UoW2ZhbHNlLCAxXSkpLnRvLmJlKGZhbHNlKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5yZW1vdmVMYXN0VHJ1ZShbdHJ1ZSwgMV0pKS50by5iZSh0cnVlKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5yZW1vdmVMYXN0TnVsbChbbnVsbCwgMV0pKS50by5iZShudWxsKTtcbiAgICAgICAgLy9zaGltL0lFIGJ1Z1xuICAgICAgICBpZigwIGluIFt1bmRlZmluZWRdKSB7XG4gICAgICAgICAgICBleHBlY3QoTHVjLkFycmF5LnJlbW92ZUxhc3RVbmRlZmluZWQoW3VuZGVmaW5lZCwgMV0pKS50by5iZSh1bmRlZmluZWQpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBpdCgnZHluYW1pYyBmaW5kTGFzdE5vdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LmZpbmRMYXN0Tm90RmFsc2UoW2ZhbHNlLCAxXSkpLnRvLmJlLmVxbCgxKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5maW5kTGFzdE5vdFRydWUoW3RydWUsIDFdKSkudG8uYmUuZXFsKDEpO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LmZpbmRMYXN0Tm90TnVsbChbbnVsbCwgMV0pKS50by5iZS5lcWwoMSk7XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkuZmluZExhc3ROb3RVbmRlZmluZWQoW3VuZGVmaW5lZCwgMV0pKS50by5iZS5lcWwoMSk7XG5cbiAgICB9KTtcblxuICAgIGl0KCdyZW1vdmUvZmluZCB3aXRoIGl0ZXJhdG9yIGFuZCB0aGlzQXJnJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcnIgPSBbe2E6MX0sIHthOjF9LCB7YToxfSwge2E6MSwgYjoyfV07XG5cbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5maW5kQWxsKGFyciwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm51bSA9PT0gdmFsdWUuYVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBudW06IDFcbiAgICAgICAgfSkpLnRvLmJlLmVxbChbe1xuICAgICAgICAgICAgICAgIGE6IDFcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBhOiAxXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgYTogMVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGE6IDEsXG4gICAgICAgICAgICAgICAgYjogMlxuICAgICAgICAgICAgfVxuICAgICAgICBdKTtcblxuICAgICAgIGV4cGVjdChMdWMuQXJyYXkuZmluZEFsbE5vdChhcnIsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5udW0gPT09IHZhbHVlLmFcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgbnVtOiAxXG4gICAgICAgIH0pKS50by5iZS5lcWwoW10pO1xuICAgfSk7XG5cbiAgICAgaXQoJ2RpcmVjdCBmdW5jdGlvbiBjb21wYXJpc29uJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkuZmluZEFsbE5vdChhcnIsIGZ1bmN0aW9uKCl7fSwge3R5cGU6J3N0cmljdCd9KSkudG8uYmUuZXFsKGFycik7XG4gICAgfSk7XG5cbiAgICBpdCgnTm90IHJlbW92ZS9maW5kIHdpdGggaXRlcmF0b3IgYW5kIHRoaXNBcmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5maW5kQWxsTm90KGFyciwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH0pKS50by5iZS5lcWwoW10pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2ZpbmQgaW4nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5maW5kQWxsSW4oWzEsMiwzLCB7YToxLGI6Mn0sIHtiOjF9XSwgWzIse2E6MX1dKSkudG8uYmUuZXFsKFsyLHthOjEsYjoyfV0pO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LmZpbmRBbGxJbihbMSwyLDMsIHthOjEsYjoyfSwge2I6MX1dLCBbMix7YToxfV0sIHt0eXBlOiAnZGVlcCd9KSkudG8uYmUuZXFsKFsyXSk7XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkuZmluZEFsbEluKFsxLDIsMywge2E6MSxiOjJ9LCB7YjoxfV0sIFsyLHthOjF9XSwge3R5cGU6ICdsb29zZSd9KSkudG8uYmUuZXFsKFsyLHthOjEsYjoyfV0pO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LmZpbmRBbGxJbihbMSwyLDMsIHthOjEsYjoyfSwge2I6MX1dLCBbMix7YToxfV0sIHt0eXBlOiAnc3RyaWN0J30pKS50by5iZS5lcWwoWzJdKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5maW5kQWxsSW4oWzEsMiwzXSwgWzIsM10pKS50by5iZS5lcWwoWzIsM10pO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LmZpbmRGaXJzdEluKFsxLDIsM10sIFsyLDNdKSkudG8uYmUuZXFsKDIpO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LmZpbmRMYXN0SW4oWzEsMiwzXSwgWzIsM10pKS50by5iZS5lcWwoMyk7XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkuZmluZExhc3RJbihbMSwyLDNdLCBbZmFsc2UsIDIsMywgZmFsc2VdKSkudG8uYmUuZXFsKDMpO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LmZpbmRBbGxJbihbMSwyLDMsIGZhbHNlXSwgW2ZhbHNlLCAyLDMsIGZhbHNlXSkpLnRvLmJlLmVxbChbMiwzLGZhbHNlXSk7XG4gICAgfSk7XG5cbiAgICBpdCgnbGFzdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5Lmxhc3QoWzEsMiwzXSkpLnRvLmJlKDMpO1xuICAgICAgICAoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGV4cGVjdChMdWMuQXJyYXkubGFzdChhcmd1bWVudHMpKS50by5iZSgzKTtcbiAgICAgICAgfSkoMSwyLDMpXG4gICAgfSk7XG5cbiAgICBpdCgnZnJvbSBpbmRleCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LmZyb21JbmRleChbMSwyLDNdLCAxKSkudG8uYmUuZXFsKFsyLDNdKTtcbiAgICAgICAgKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBleHBlY3QoTHVjLkFycmF5LmZyb21JbmRleChhcmd1bWVudHMsIDEpKS50by5iZS5lcWwoWzIsM10pO1xuICAgICAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5mcm9tSW5kZXgoYXJndW1lbnRzLCAwKSkudG8uYmUuZXFsKFsxLDIsM10pO1xuICAgICAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5mcm9tSW5kZXgoYXJndW1lbnRzLCAyKSkudG8uYmUuZXFsKFszXSk7XG4gICAgICAgIH0pKDEsMiwzKVxuICAgIH0pO1xuXG4gICAgaXQoJ3BsdWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkucGx1Y2soW3thOicxJywgYjoyfSwge2I6M30sIHtiOjR9XSwgJ2InKSkudG8uYmUuZXFsKFsyLDMsNF0pO1xuICAgIH0pO1xufSk7IiwidmFyIEx1YyA9IHJlcXVpcmUoJy4vbHVjVGVzdExpYicpLFxuICAgIGV4cGVjdCA9IHJlcXVpcmUoJ2V4cGVjdC5qcycpO1xudmFyIGVtaXR0ZXJUZXN0ID0gcmVxdWlyZSgnLi9jb21tb24nKS50ZXN0RW1pdHRlcjtcbi8vU2FuaXR5IGNoZWNrIHRvIG1ha2Ugc3VyZSBub2RlIGNvbXBvbmVudHMgd29yayBvbiB0aGUgYnJvd3Nlci5cbmRlc2NyaWJlKCdMdWMgTm9kZSBmdW5jdGlvbnMnLCBmdW5jdGlvbigpIHtcblxuICAgIGl0KCdFbWl0dGVyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGVtaXR0ZXJUZXN0KG5ldyBMdWMuRXZlbnRFbWl0dGVyKCkpO1xuICAgIH0pO1xufSkiLCJ2YXIgZW1pdHRlclRlc3QgPSByZXF1aXJlKCcuL2NvbW1vbicpLnRlc3RFbWl0dGVyO1xudmFyIEx1YyA9IHJlcXVpcmUoJy4vbHVjVGVzdExpYicpLFxuICAgIGV4cGVjdCA9IHJlcXVpcmUoJ2V4cGVjdC5qcycpO1xuXG5cbmZ1bmN0aW9uIGRlZmluZUNsYXNzV2l0aEFsbE9wdGlvbnMoKSB7XG4gICAgZnVuY3Rpb24gQWRkZXIoKSB7fVxuXG4gICAgQWRkZXIucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGEgKyBiO1xuICAgIH07XG4gICAgdmFyIEEgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgJHN1cGVyOiBBZGRlcixcbiAgICAgICAgJHN0YXRpY3M6IHtcbiAgICAgICAgICAgIHRvdGFsOiAwXG4gICAgICAgIH0sXG4gICAgICAgICRtaXhpbnM6IHtcbiAgICAgICAgICAgIG1ha2VTdHJpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICsgJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgICRjb21wb3NpdGlvbnM6IHtcbiAgICAgICAgICAgIENvbnN0cnVjdG9yOiBMdWMuRXZlbnRFbWl0dGVyLFxuICAgICAgICAgICAgbmFtZTogJ2VtaXR0ZXInLFxuICAgICAgICAgICAgbWV0aG9kczogJ2FsbE1ldGhvZHMnXG4gICAgICAgIH0sXG4gICAgICAgIGFkZDogZnVuY3Rpb24oYSwgYiwgYykge1xuICAgICAgICAgICAgdmFyIHR3byA9IEEuJHN1cGVyY2xhc3MuYWRkLmNhbGwodGhpcywgYSwgYiksXG4gICAgICAgICAgICAgICAgcmV0ID0gdHdvICsgYztcblxuICAgICAgICAgICAgdGhpcy5lbWl0KCd0b1N0cmluZycsIHRoaXMubWFrZVN0cmluZyhyZXQpKTtcblxuICAgICAgICAgICAgdGhpcy4kY2xhc3MudG90YWwgKz0gcmV0O1xuXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gQTtcbn1cblxuZGVzY3JpYmUoJ0x1YyBDbGFzcycsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdCYXNlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBiID0gbmV3IEx1Yy5CYXNlKHtcbiAgICAgICAgICAgIGE6IDEsXG4gICAgICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmErKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdChiLmEpLnRvLmJlKDIpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3NpbXBsZSBkZWZpbmUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIEMgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgICAgIGI6ICcyJ1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIGIgPSBuZXcgQyh7XG4gICAgICAgICAgICBhOiAxXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3QoYi5hKS50by5lcWwoMSk7XG4gICAgICAgIGV4cGVjdChiLmIpLnRvLmVxbCgnMicpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3NpbmdsZSBtaXhpbicsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgQyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICAgICAgJG1peGluczogTHVjLkV2ZW50RW1pdHRlclxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgYiA9IG5ldyBDKHtcbiAgICAgICAgICAgIGE6IDFcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZW1pdHRlclRlc3QoYik7XG4gICAgfSk7XG5cbiAgICBpdCgnbXVsdGlwbGUgbWl4aW5zJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtaXhpbk9iaiA9IHtcbiAgICAgICAgICAgIGE6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcHJvcDoge31cbiAgICAgICAgfSwgQyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICAgICAgJG1peGluczogW0x1Yy5FdmVudEVtaXR0ZXIsIG1peGluT2JqXVxuICAgICAgICB9KSxcbiAgICAgICAgYyA9IG5ldyBDKCk7XG5cbiAgICAgICAgZXhwZWN0KGMuYSkudG8uYmUobWl4aW5PYmouYSk7XG4gICAgICAgIGV4cGVjdChjLnByb3ApLnRvLmJlKG1peGluT2JqLnByb3ApO1xuICAgICAgICBleHBlY3QoYy5lbWl0KS50by5iZShMdWMuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0KTtcbiAgICB9KTtcblxuICAgIGl0KCdzdGF0aWNzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgICAgICAkc3RhdGljczoge1xuICAgICAgICAgICAgICAgIGI6IDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIGMgPSBuZXcgQygpO1xuXG4gICAgICAgIGV4cGVjdChDLmIpLnRvLmJlKDEpO1xuICAgICAgICBleHBlY3QoYy4kY2xhc3MuYikudG8uYmUoMSk7XG4gICAgfSk7XG5cbiAgICBpdCgndGVzdCBnZXQgc3RhdGljIHZhbHVlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBBID0gTHVjLmRlZmluZSh7XG4gICAgICAgICAgICAkc3RhdGljczoge1xuICAgICAgICAgICAgICAgIGE6IDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIEIgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgICAgICRzdXBlcjogQSxcbiAgICAgICAgICAgICRzdGF0aWNzOiB7XG4gICAgICAgICAgICAgICAgYjogMixcbiAgICAgICAgICAgICAgICBjOjNcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIEMgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgICAgICRzdXBlcjogQixcbiAgICAgICAgICAgICRzdGF0aWNzOiB7XG4gICAgICAgICAgICAgICAgYTogNVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgYSA9IG5ldyBBKCksIGIgPSBuZXcgQigpLCBjID0gbmV3IEMoKTtcblxuICAgICAgICBleHBlY3QoYS5nZXRTdGF0aWNWYWx1ZSgnYScpKS50by5iZSgxKTtcbiAgICAgICAgZXhwZWN0KGEuZ2V0U3RhdGljVmFsdWUoJ2InKSkudG8uYmUodW5kZWZpbmVkKTtcblxuICAgICAgICBleHBlY3QoYi5nZXRTdGF0aWNWYWx1ZSgnYScpKS50by5iZSgxKTtcbiAgICAgICAgZXhwZWN0KGIuZ2V0U3RhdGljVmFsdWUoJ2InKSkudG8uYmUoMik7XG4gICAgICAgIGV4cGVjdChiLmdldFN0YXRpY1ZhbHVlKCdjJykpLnRvLmJlKDMpO1xuICAgICAgICBleHBlY3QoYi5nZXRTdGF0aWNWYWx1ZSgnZCcpKS50by5iZSh1bmRlZmluZWQpO1xuXG4gICAgICAgIGV4cGVjdChjLmdldFN0YXRpY1ZhbHVlKCdhJykpLnRvLmJlKDUpO1xuICAgICAgICBleHBlY3QoYy5nZXRTdGF0aWNWYWx1ZSgnYicpKS50by5iZSgyKTtcbiAgICAgICAgZXhwZWN0KGMuZ2V0U3RhdGljVmFsdWUoJ2MnKSkudG8uYmUoMyk7XG4gICAgICAgIGV4cGVjdChjLmdldFN0YXRpY1ZhbHVlKCdkJykpLnRvLmJlKHVuZGVmaW5lZCk7XG4gICAgfSk7XG5cbiAgICBpdCgnJGNsYXNzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBDID0gTHVjLmRlZmluZSh7fSksXG4gICAgICAgICAgICBjID0gbmV3IEMoKTtcblxuICAgICAgICBleHBlY3QoYy4kY2xhc3MpLnRvLmJlKEMpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3N1cGVyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpO1xuICAgICAgICB2YXIgQyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICAgICAgJHN1cGVyOiBMdWMuRXZlbnRFbWl0dGVyLFxuICAgICAgICAgICAgZW1pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaSA9IDA7XG4gICAgICAgICAgICAgICAgQy4kc3VwZXJjbGFzcy5lbWl0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG5cbiAgICAgICAgdmFyIGMgPSBuZXcgQyh7fSk7XG4gICAgICAgIGVtaXR0ZXJUZXN0KGMpO1xuICAgICAgICBleHBlY3QoaSkudG8uYmUoMCk7XG4gICAgICAgIGV4cGVjdChjIGluc3RhbmNlb2YgTHVjLkV2ZW50RW1pdHRlcikudG8uYmUodHJ1ZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnY29tcG9zaXRpb24nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIEVtaXR0ZXJQYXJlbnQgPSAgTHVjLmRlZmluZSh7XG4gICAgICAgICAgICAkc3VwZXI6IEx1Yy5FdmVudEVtaXR0ZXJcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIEJhc2VFbWl0dGVyID0gTHVjLmRlZmluZSh7XG4gICAgICAgICAgICAkY29tcG9zaXRpb25zOiBbe0NvbnN0cnVjdG9yOiBFbWl0dGVyUGFyZW50LCBuYW1lOiAnZW1pdHRlcicsIG1ldGhvZHM6ICdhbGxNZXRob2RzJ31dXG4gICAgICAgIH0pO1xuXG5cbiAgICAgICAgdmFyIGJhc2UgPSBuZXcgQmFzZUVtaXR0ZXIoe30pO1xuICAgICAgICBlbWl0dGVyVGVzdChiYXNlKTtcbiAgICAgICAgZXhwZWN0KGJhc2UgaW5zdGFuY2VvZiBMdWMuRXZlbnRFbWl0dGVyKS50by5iZShmYWxzZSk7XG4gICAgICAgIGV4cGVjdChiYXNlLmV2ZW50cykudG8uYmUodW5kZWZpbmVkKTtcbiAgICB9KTtcblxuICAgIGl0KCdhbGwgY2xhc3Mgb3B0aW9ucyB0b2dldGhlcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgQWRkZXJFbWl0dGVyID0gZGVmaW5lQ2xhc3NXaXRoQWxsT3B0aW9ucygpLFxuICAgICAgICAgICAgc3RyaW5nVmFsdWUsIHJlc3VsdCxcbiAgICAgICAgICAgIGFkZGVyRW1pdCA9IG5ldyBBZGRlckVtaXR0ZXIoKTtcblxuICAgICAgICBhZGRlckVtaXQub24oJ3RvU3RyaW5nJywgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHN0cmluZ1ZhbHVlID0gdmFsdWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlc3VsdCA9IGFkZGVyRW1pdC5hZGQoMSwgMiwgMyk7XG5cbiAgICAgICAgZXhwZWN0KHJlc3VsdCkudG8uYmUoNik7XG4gICAgICAgIGV4cGVjdChzdHJpbmdWYWx1ZSkudG8uYmUoJzYnKTtcblxuICAgICAgICBhZGRlckVtaXQuYWRkKDMsIDMsIDMpO1xuXG4gICAgICAgIGV4cGVjdChzdHJpbmdWYWx1ZSkudG8uYmUoJzknKTtcblxuICAgICAgICBleHBlY3QoQWRkZXJFbWl0dGVyLnRvdGFsKS50by5iZSgxNSk7XG4gICAgfSk7XG5cbiAgICBpdCgnY2xhc3Mgb3B0aW9ucyBkbyBub3QgZ2V0IGFwcGxpZWQgdG8gdGhlIGluc3RhbmNlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBBZGRlckVtaXR0ZXIgPSBkZWZpbmVDbGFzc1dpdGhBbGxPcHRpb25zKCksXG4gICAgICAgICAgICBhbGxPcHRpb25zID0gTHVjLkNsYXNzRGVmaW5lci5wcm9jZXNzb3JLZXlzLFxuICAgICAgICAgICAgaWdub3JlS2V5cyA9IFsnJHN1cGVyJ107XG5cbiAgICAgICAgT2JqZWN0LmtleXMoYWxsT3B0aW9ucykuZm9yRWFjaChmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgICAgIGlmKGlnbm9yZUtleXMuaW5kZXhPZihvcHRpb24pID09PSAtMSkge1xuICAgICAgICAgICAgICAgIGV4cGVjdChBZGRlckVtaXR0ZXIucHJvdG90eXBlW29wdGlvbl0pLnRvLmJlKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2dldCBjb21wb3NpdGlvbicsIGZ1bmN0aW9uKCkge1xuICAgICAgICBmdW5jdGlvbiBBKCkge31cbiAgICAgICAgZnVuY3Rpb24gQigpe31cbiAgICAgICAgZnVuY3Rpb24gQygpe31cbiAgICAgICAgdmFyIENvbXBzID0gTHVjLmRlZmluZSh7XG4gICAgICAgICAgICAkY29tcG9zaXRpb25zOiBbe1xuICAgICAgICAgICAgICAgICAgICBDb25zdHJ1Y3RvcjogQSxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2EnXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICBDb25zdHJ1Y3RvcjogQixcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2InXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICBDb25zdHJ1Y3RvcjogQyxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2MnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgYyA9IG5ldyBDb21wcygpO1xuXG4gICAgICAgIGV4cGVjdChjLmdldENvbXBvc2l0aW9uKCdhJykpLnRvLmJlLmEoQSk7XG4gICAgICAgIGV4cGVjdChjLmdldENvbXBvc2l0aW9uKCdiJykpLnRvLmJlLmEoQik7XG4gICAgICAgIGV4cGVjdChjLmdldENvbXBvc2l0aW9uKCdjJykpLnRvLmJlLmEoQyk7XG4gICAgfSk7XG5cbiAgICBpdCgnaW5pdENvbXBvc2l0aW9uIGJlZm9yZSBhbmQgYWZ0ZXInLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGhhc0FCZWVuSW5pdGVkID0gZmFsc2UsXG4gICAgICAgICAgICBoYXNCQmVlbkluaXRlZCA9IGZhbHNlLFxuICAgICAgICAgICAgaGFzQ0JlZW5Jbml0ZWQgPSBmYWxzZTtcbiAgICAgICAgZnVuY3Rpb24gQSgpIHtcbiAgICAgICAgICAgIGhhc0FCZWVuSW5pdGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBCKCl7XG4gICAgICAgICAgICBoYXNCQmVlbkluaXRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gQygpe1xuICAgICAgICAgICAgaGFzQ0JlZW5Jbml0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgZXhwZWN0KGhhc0FCZWVuSW5pdGVkKS50by5iZShmYWxzZSk7XG4gICAgICAgICAgICBleHBlY3QoaGFzQkJlZW5Jbml0ZWQpLnRvLmJlKHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBDb21wcyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICAgICAgJGNvbXBvc2l0aW9uczogW3tcbiAgICAgICAgICAgICAgICAgICAgQ29uc3RydWN0b3I6IEEsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdhJyxcbiAgICAgICAgICAgICAgICAgICAgaW5pdEFmdGVyOiB0cnVlXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICBDb25zdHJ1Y3RvcjogQixcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2InLFxuICAgICAgICAgICAgICAgICAgICBpbml0QWZ0ZXI6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICBDb25zdHJ1Y3RvcjogQyxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2MnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgYyA9IG5ldyBDb21wcygpO1xuICAgICAgICBleHBlY3QoaGFzQ0JlZW5Jbml0ZWQpLnRvLmJlKHRydWUpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Rlc3Qgbm8gc3VwZXJjbGFzcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgTm9TdXBlciA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICAgICAgJHN1cGVyOiBmYWxzZSxcbiAgICAgICAgICAgICRzdGF0aWNzOiB7XG4gICAgICAgICAgICAgICAgdG90YWw6IDBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAkbWl4aW5zOiB7XG4gICAgICAgICAgICAgICAgbWFrZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICsgJyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICRjb21wb3NpdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0cyA6IEx1Yy5jb21wb3NpdGlvbkVudW1zLkV2ZW50RW1pdHRlclxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgTm9TdXBlck5vQ29tcCA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICAgICAgJHN1cGVyOiBmYWxzZSxcbiAgICAgICAgICAgICRzdGF0aWNzOiB7XG4gICAgICAgICAgICAgICAgdG90YWw6IDBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAkbWl4aW5zOiB7XG4gICAgICAgICAgICAgICAgbWFrZVN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICsgJyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgbm9TdXBlciA9IG5ldyBOb1N1cGVyKCk7XG4gICAgICAgIGV4cGVjdChuZXcgIE5vU3VwZXJOb0NvbXAoKS5tYWtlU3RyaW5nKG5vU3VwZXIuJGNsYXNzLnRvdGFsKSkudG8uYmUoJzAnKTtcbiAgICAgICAgZXhwZWN0KG5vU3VwZXIubWFrZVN0cmluZyhub1N1cGVyLiRjbGFzcy50b3RhbCkpLnRvLmJlKCcwJyk7XG4gICAgICAgIGVtaXR0ZXJUZXN0KG5vU3VwZXIpO1xuICAgICAgICBleHBlY3Qobm9TdXBlcikudG8ubm90LmJlLmEoTHVjLkJhc2UpO1xuICAgICAgICBleHBlY3Qobm9TdXBlci4kc3VwZXJjbGFzcykudG8uYmUodW5kZWZpbmVkKTtcbiAgICB9KTtcblxuICAgIGl0KCd0ZXN0IGNvbXBvc2l0aW9uIHZhbGlkYXRpb24nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZnVuY3Rpb24gZGVmaW5lTm9OYW1lKCkge1xuICAgICAgICAgICAgTHVjLmRlZmluZSh7XG4gICAgICAgICAgICAgICAgJGNvbXBvc2l0aW9uczoge1xuICAgICAgICAgICAgICAgICAgICBDb25zdHJ1Y3RvcjogTHVjLkV2ZW50RW1pdHRlclxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGRlZmluZU5vQ29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBMdWMuZGVmaW5lKHtcbiAgICAgICAgICAgICAgICAkY29tcG9zaXRpb25zOiB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdhJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGV4cGVjdChkZWZpbmVOb05hbWUpLnRvLnRocm93RXhjZXB0aW9uKCk7XG5cbiAgICAgICAgZXhwZWN0KGRlZmluZU5vQ29uc3RydWN0b3IpLnRvLnRocm93RXhjZXB0aW9uKCk7XG4gICAgfSk7XG5cbiAgICBpdCgndGVzdCBkZWZhdWx0IHBsdWdpbiBjb21wb3NpdGlvbicsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdGVzdEludGFuY2UsXG4gICAgICAgIENsYXNzV2l0aFBsdWdpbnMgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgICAgICRjb21wb3NpdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0czogTHVjLmNvbXBvc2l0aW9uRW51bXMuUGx1Z2luTWFuYWdlclxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgYyA9IG5ldyBDbGFzc1dpdGhQbHVnaW5zKHtcbiAgICAgICAgICAgIHBsdWdpbnM6IFt7XG4gICAgICAgICAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXN0SW5zdGFuY2UgPSBpbnN0YW5jZTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZGVzdHJveTogZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnbXlQbHVnaW4nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9KTtcblxuICAgICAgICBleHBlY3QodGVzdEluc3RhbmNlKS50by5iZShjKTtcbiAgICAgICAgZXhwZWN0KGMuZ2V0UGx1Z2luKEx1Yy5QbHVnaW4pKS50by5iZS5hKEx1Yy5QbHVnaW4pO1xuICAgICAgICBleHBlY3QoYy5nZXRQbHVnaW4oe25hbWU6ICdteVBsdWdpbid9KSkudG8uYmUuYShMdWMuUGx1Z2luKTtcbiAgICAgICAgYy5kZXN0cm95UGx1Z2luKHtuYW1lOiAnbXlQbHVnaW4nfSk7XG4gICAgICAgIGV4cGVjdChjLmdldFBsdWdpbihMdWMuUGx1Z2luKSkudG8uYmUoZmFsc2UpO1xuICAgICAgICB2YXIgcmV0ID0gYy5hZGRQbHVnaW4oe25hbWU6ICdteVBsdWdpbid9KTtcbiAgICAgICAgZXhwZWN0KHJldCkudG8uYmUuYShMdWMuUGx1Z2luKTtcblxuICAgICAgICBmdW5jdGlvbiBBKCl7XG5cbiAgICAgICAgfVxuICAgICAgICByZXQgPSBjLmFkZFBsdWdpbih7Q29uc3RydWN0b3I6IEEsIG5hbWU6ICdteVBsdWdpbid9KTtcbiAgICAgICAgZXhwZWN0KHJldCkudG8uYmUuYShBKTtcbiAgICB9KTtcblxuICAgIGl0KCd0ZXN0IGNvbmZpZ3VyZWQgcGx1Z2luIGNvbnN0cnVjdG9ycycsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdGVzdEludGFuY2UsXG4gICAgICAgICAgICBDb25maWd1cmVkUGx1Z2luID0gZnVuY3Rpb24oY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5teU93bmVyID0gY29uZmlnLm93bmVyO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIENsYXNzV2l0aFBsdWdpbnMgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgICAgICAgICAkY29tcG9zaXRpb25zOiB7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHRzOiBMdWMuY29tcG9zaXRpb25FbnVtcy5QbHVnaW5NYW5hZ2VyXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIGMgPSBuZXcgQ2xhc3NXaXRoUGx1Z2lucyh7XG4gICAgICAgICAgICBwbHVnaW5zOiBbe30sIHtcbiAgICAgICAgICAgICAgICAgICAgQ29uc3RydWN0b3I6IENvbmZpZ3VyZWRQbHVnaW5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGV4cGVjdChjLmdldENvbXBvc2l0aW9uKCdwbHVnaW5zJykucGx1Z2luc1swXSkudG8uYmUuYShMdWMuUGx1Z2luKTtcbiAgICAgICAgdmFyIGNvbmZpZ2VkUGx1Z2luID0gYy5nZXRDb21wb3NpdGlvbigncGx1Z2lucycpLnBsdWdpbnNbMV07XG4gICAgICAgIGV4cGVjdChjb25maWdlZFBsdWdpbikudG8uYmUuYShDb25maWd1cmVkUGx1Z2luKTtcbiAgICAgICAgZXhwZWN0KGNvbmZpZ2VkUGx1Z2luLm15T3duZXIpLnRvLmJlKGMpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Rlc3QgZGVmYXVsdCBwbHVnaW4gZGVzdHJveScsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdGVzdFZhbHVlID0gZmFsc2UsXG4gICAgICAgIENsYXNzV2l0aFBsdWdpbnMgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgICAgICRjb21wb3NpdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0czogTHVjLmNvbXBvc2l0aW9uRW51bXMuUGx1Z2luTWFuYWdlclxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgYyA9IG5ldyBDbGFzc1dpdGhQbHVnaW5zKHtcbiAgICAgICAgICAgIHBsdWdpbnM6IFt7XG4gICAgICAgICAgICAgICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVzdFZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIHt9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGV4cGVjdCh0ZXN0VmFsdWUpLnRvLmJlKGZhbHNlKTtcbiAgICAgICAgYy5kZXN0cm95QWxsUGx1Z2lucygpO1xuICAgICAgICBleHBlY3QodGVzdFZhbHVlKS50by5iZSh0cnVlKTtcbiAgICB9KTtcblxuICAgIGl0KCdhZnRlciBkZWZpbmUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHRlc3RWYWx1ZSA9IGZhbHNlLFxuICAgICAgICAgICAgaGFzQmVlbkNhbGxlZCA9IGZhbHNlLFxuICAgICAgICAgICAgYWZ0ZXJEZWZpbmUgPSBmdW5jdGlvbihDb25zdHJ1Y3Rvcikge1xuICAgICAgICAgICAgICAgIGV4cGVjdChDb25zdHJ1Y3Rvci5hKS50by5iZS5lcWwoWzFdKTtcbiAgICAgICAgICAgICAgICBoYXNCZWVuQ2FsbGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgICAgICAgICAgJHN0YXRpY3M6IHtcbiAgICAgICAgICAgICAgICAgICAgYTogWzFdXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgYWZ0ZXJEZWZpbmUpO1xuXG5cbiAgICAgICAgZXhwZWN0KGhhc0JlZW5DYWxsZWQpLnRvLmJlKHRydWUpO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2NhbGxTdXBlck1ldGhvZCcsIGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgaXQoJ2NhbGxTdXBlck1ldGhvZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIEEgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgICAgICAgICBhZGQ6IGZ1bmN0aW9uKGEsIGIsIGMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGEgKyBiICsgYztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIEIgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgICAgICAgICAkc3VwZXI6IEEsXG4gICAgICAgICAgICAgICAgYWRkOiBmdW5jdGlvbihhLCBiLCBjKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNhbGxTdXBlcihhcmd1bWVudHMpICsgNTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIEMgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgICAgICAgICAkc3VwZXI6IEIsXG4gICAgICAgICAgICAgICAgYWRkOiBmdW5jdGlvbihhLCBiLCBjKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNhbGxTdXBlcihhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgRCA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICAgICAgICAgICRzdXBlcjogQSxcbiAgICAgICAgICAgICAgICBhZGQ6IGZ1bmN0aW9uKGEsIGIsIGMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FsbFN1cGVyKGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBFID0gTHVjLmRlZmluZSh7XG4gICAgICAgICAgICAgICAgJHN1cGVyOiBDLFxuICAgICAgICAgICAgICAgIGFkZDogZnVuY3Rpb24oYSwgYiwgYykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jYWxsU3VwZXIoYXJndW1lbnRzKSArIDEwO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgbm9TdXBlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2FsbFN1cGVyKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgYyA9IG5ldyBDKCk7XG4gICAgICAgICAgICB2YXIgZCA9IG5ldyBEKCk7XG4gICAgICAgICAgICB2YXIgZSA9IG5ldyBFKCk7XG5cbiAgICAgICAgICAgIGV4cGVjdChkLmFkZCgxLCAyLCAzKSkudG8uYmUoNik7XG4gICAgICAgICAgICBleHBlY3QoYy5hZGQoMSwgMiwgMykpLnRvLmJlKDExKTtcbiAgICAgICAgICAgIGV4cGVjdChlLmFkZCgxLCAyLCAzKSkudG8uYmUoMjEpO1xuXG5cbiAgICAgICAgICAgIEIucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNhbGxTdXBlcihhcmd1bWVudHMpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZXhwZWN0KGUuYWRkKDEsIDIsIDMpKS50by5iZSgxNik7XG5cbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBlLm5vU3VwZXIoKTtcbiAgICAgICAgICAgIH0pLnRvLnRocm93RXhjZXB0aW9uKCk7XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG59KTtcblxuXG5cblxuIiwidmFyIEx1YyA9IHJlcXVpcmUoJy4vbHVjVGVzdExpYicpLFxuICAgIGV4cGVjdCA9IHJlcXVpcmUoJ2V4cGVjdC5qcycpO1xuXG5kZXNjcmliZSgnTHVjIGlzJywgZnVuY3Rpb24oKSB7XG5cbiAgICBpdCgnaXNBcnJheScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3QoTHVjLmlzQXJyYXkoe30pKS50by5iZShmYWxzZSk7XG4gICAgICAgIGV4cGVjdChMdWMuaXNBcnJheShbXSkpLnRvLmJlKHRydWUpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2lzUmVnRXhwJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGV4cGVjdChMdWMuaXNSZWdFeHAoe30pKS50by5iZShmYWxzZSk7XG4gICAgICAgIGV4cGVjdChMdWMuaXNSZWdFeHAobmV3IFJlZ0V4cCgpKSkudG8uYmUodHJ1ZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnaXNEYXRlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGV4cGVjdChMdWMuaXNEYXRlKHt9KSkudG8uYmUoZmFsc2UpO1xuICAgICAgICBleHBlY3QoTHVjLmlzRGF0ZShuZXcgRGF0ZSgpKSkudG8uYmUodHJ1ZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnaXNTdHJpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KEx1Yy5pc1N0cmluZyh7fSkpLnRvLmJlKGZhbHNlKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5pc1N0cmluZyhuZXcgU3RyaW5nKCkpKS50by5iZSh0cnVlKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5pc1N0cmluZygnJykpLnRvLmJlKHRydWUpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2lzT2JqZWN0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGV4cGVjdChMdWMuaXNPYmplY3Qoe30pKS50by5iZSh0cnVlKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5pc09iamVjdChbXSkpLnRvLmJlKGZhbHNlKTtcbiAgICB9KTtcblxuICAgIGl0KCdpc051bWJlcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3QoTHVjLmlzTnVtYmVyKHt9KSkudG8uYmUoZmFsc2UpO1xuICAgICAgICBleHBlY3QoTHVjLmlzTnVtYmVyKDApKS50by5iZSh0cnVlKTtcbiAgICB9KTtcblxuICAgIGl0KCdpc0Z1bmN0aW9uJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGV4cGVjdChMdWMuaXNGdW5jdGlvbih7fSkpLnRvLmJlKGZhbHNlKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5pc0Z1bmN0aW9uKG5ldyBGdW5jdGlvbigpKSkudG8uYmUodHJ1ZSk7XG4gICAgICAgIGV4cGVjdChMdWMuaXNGdW5jdGlvbihmdW5jdGlvbigpe30pKS50by5iZSh0cnVlKTtcbiAgICB9KTtcblxuICAgIGl0KCdpc0ZhbHN5JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGV4cGVjdChMdWMuaXNGYWxzeSgwKSkudG8uYmUoZmFsc2UpO1xuICAgICAgICBleHBlY3QoTHVjLmlzRmFsc3koJycpKS50by5iZSh0cnVlKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5pc0ZhbHN5KHVuZGVmaW5lZCkpLnRvLmJlKHRydWUpO1xuICAgICAgICBleHBlY3QoTHVjLmlzRmFsc3kobnVsbCkpLnRvLmJlKHRydWUpO1xuICAgICAgICBleHBlY3QoTHVjLmlzRmFsc3koZmFsc2UpKS50by5iZSh0cnVlKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5pc0ZhbHN5KE5hTikpLnRvLmJlKHRydWUpO1xuICAgICAgICBleHBlY3QoTHVjLmlzRmFsc3koe30pKS50by5iZShmYWxzZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnaXNFbXB0eScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3QoTHVjLmlzRW1wdHkoMCkpLnRvLmJlKGZhbHNlKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5pc0VtcHR5KCcnKSkudG8uYmUodHJ1ZSk7XG4gICAgICAgIGV4cGVjdChMdWMuaXNFbXB0eSh1bmRlZmluZWQpKS50by5iZSh0cnVlKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5pc0VtcHR5KG51bGwpKS50by5iZSh0cnVlKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5pc0VtcHR5KGZhbHNlKSkudG8uYmUodHJ1ZSk7XG5cbiAgICAgICAgZXhwZWN0KEx1Yy5pc0VtcHR5KFtdKSkudG8uYmUodHJ1ZSk7XG4gICAgICAgIGV4cGVjdChMdWMuaXNFbXB0eSh7fSkpLnRvLmJlKHRydWUpO1xuXG4gICAgICAgIGV4cGVjdChMdWMuaXNFbXB0eShbMF0pKS50by5iZShmYWxzZSk7XG4gICAgICAgIGV4cGVjdChMdWMuaXNFbXB0eSh7MDowfSkpLnRvLmJlKGZhbHNlKTtcbiAgICB9KTtcblxuICAgIGl0KCdpc0FyZ3VtZW50cycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3QoTHVjLmlzQXJndW1lbnRzKHt9KSkudG8uYmUoZmFsc2UpO1xuICAgICAgICBleHBlY3QoTHVjLmlzQXJndW1lbnRzKFtdKSkudG8uYmUoZmFsc2UpO1xuICAgICAgICAoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGV4cGVjdChMdWMuaXNBcmd1bWVudHMoYXJndW1lbnRzKSkudG8uYmUodHJ1ZSk7XG4gICAgICAgIH0oKSk7XG4gICAgICAgIFxuICAgIH0pO1xufSk7IiwidmFyIEx1YyA9IHJlcXVpcmUoJy4vbHVjVGVzdExpYicpLFxuICAgIGV4cGVjdCA9IHJlcXVpcmUoJ2V4cGVjdC5qcycpLFxuICAgIGFycmF5U2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbmRlc2NyaWJlKCdMdWMgRnVuY3Rpb24gdXRpbGl0aWVzJywgZnVuY3Rpb24oKSB7XG5cbiAgICBcbiAgICAgICAgZnVuY3Rpb24gdGVzdEZuKCkge1xuICAgICAgICAgICAgdmFyIGFyciA9IGFycmF5U2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RyICsgYXJyLmpvaW4oJycpO1xuICAgICAgICB9XG5cbiAgICBpdCgnY3JlYXRlIGF1Z21lbnRvciBhcHBlbmQgYW5kIHRoaXMnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgYXBwZW5kQW5kVGhpcyA9IEx1Yy5GdW5jdGlvbi5jcmVhdGVBdWdtZW50ZXIodGVzdEZuLCB7XG4gICAgICAgICAgICB0aGlzQXJnOiB7XG4gICAgICAgICAgICAgICAgc3RyOiAnMSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhcmdzOiBbNCwgNV0sXG4gICAgICAgICAgICBpbmRleDogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICBleHBlY3QoYXBwZW5kQW5kVGhpcygyLCAzKSkudG8uYmUoJzEyMzQ1Jyk7XG4gICAgfSk7XG5cbiAgICBpdCgnY3JlYXRlIGF1Z21lbnRvciB0aGlzQXJnIHdpdGggYXBwZW5kIGFmdGVyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcHBlbmRBbmRUaGlzQXJndW1lbnRzQWZ0ZXIgPSBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudGVyKHRlc3RGbiwge1xuICAgICAgICAgICAgdGhpc0FyZzoge1xuICAgICAgICAgICAgICAgIHN0cjogJzEnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYXJnczogWzQsIDVdLFxuICAgICAgICAgICAgaW5kZXg6IHRydWUsXG4gICAgICAgICAgICBhcmd1bWVudHNGaXJzdDogZmFsc2VcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZXhwZWN0KGFwcGVuZEFuZFRoaXNBcmd1bWVudHNBZnRlcigyLDMpKS50by5iZSgnMTQ1MjMnKTtcbiAgICB9KTtcblxuICAgIGl0KCdjcmVhdGUgYXVnbWVudG9yIHRoaXNBcmcgaW5kZXggYW5kIGFyZ3MgYWZ0ZXInLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3VtZW50c0FmdGVyID0gTHVjLkZ1bmN0aW9uLmNyZWF0ZUF1Z21lbnRlcih0ZXN0Rm4sIHtcbiAgICAgICAgICAgIHRoaXNBcmc6IHtcbiAgICAgICAgICAgICAgICBzdHI6ICcxJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFyZ3M6IFs0LCA1XSxcbiAgICAgICAgICAgIGluZGV4OiAxLFxuICAgICAgICAgICAgYXJndW1lbnRzRmlyc3Q6IGZhbHNlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGV4cGVjdChhcmd1bWVudHNBZnRlcigyLDMpKS50by5iZSgnMTQyMzUnKTtcbiAgICB9KTtcblxuICAgIGl0KCdjcmVhdGUgYXVnbWVudG9yIHRoaXMgYXJnIGFuZCBkZWZhdWx0IGluc2VydCBhcmdzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcmd1bWVudHNJbnNlcnQgPSBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudGVyKHRlc3RGbiwge1xuICAgICAgICAgICAgdGhpc0FyZzoge1xuICAgICAgICAgICAgICAgIHN0cjogJzEnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYXJnczogWzQsIDVdLFxuICAgICAgICAgICAgaW5kZXg6IDFcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZXhwZWN0KGFyZ3VtZW50c0luc2VydCgyLDMpKS50by5iZSgnMTI0NTMnKTtcbiAgICB9KTtcblxuICAgIGl0KCdjcmVhdGUgYXVnbWVudG9yIGRlZmF1bHQgaW5zZXJ0IGFyZ3MnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG5vVGhpc0FyZyA9IEx1Yy5GdW5jdGlvbi5jcmVhdGVBdWdtZW50ZXIodGVzdEZuLCB7XG4gICAgICAgICAgICBhcmdzOiBbNCwgNV0sXG4gICAgICAgICAgICBpbmRleDogMVxuICAgICAgICB9KTtcblxuICAgICAgICBleHBlY3Qobm9UaGlzQXJnLmFwcGx5KHtzdHI6ICcyJ30sWzIsM10pKS50by5iZSgnMjI0NTMnKTtcbiAgICB9KTtcblxuICAgIGl0KCdjcmVhdGUgYXVnbWVudG9yIGp1c3QgYXJndW1lbnRzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBqdXN0QXJncyA9IEx1Yy5GdW5jdGlvbi5jcmVhdGVBdWdtZW50ZXIodGVzdEZuLCB7XG4gICAgICAgICAgICBhcmdzOiBbNCwgNV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgZXhwZWN0KGp1c3RBcmdzLmFwcGx5KHtzdHI6ICcyJ30sWzIsM10pKS50by5iZSgnMjQ1Jyk7XG4gICAgfSk7XG5cbiAgICBpdCgnY3JlYXRlIHNlcXVlbmNlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBoYXNSdW4xLCBoYXNSdW4yLCBoYXNSdW4zO1xuXG4gICAgICAgIHZhciBzZXF1ZW5jZWQgPSBMdWMuRnVuY3Rpb24uY3JlYXRlU2VxdWVuY2UoW1xuICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaGFzUnVuMSA9IHRydWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaGFzUnVuMiA9IHRydWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaGFzUnVuMyA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIF0pO1xuXG4gICAgICAgIHZhciByZXQgPSBzZXF1ZW5jZWQoKTtcblxuICAgICAgICBleHBlY3QoaGFzUnVuMSkudG8uYmUodHJ1ZSk7XG4gICAgICAgIGV4cGVjdChoYXNSdW4yKS50by5iZSh0cnVlKTtcbiAgICAgICAgZXhwZWN0KGhhc1J1bjMpLnRvLmJlKHRydWUpO1xuICAgICAgICBleHBlY3QocmV0KS50by5iZSh0cnVlKTtcbiAgICB9KTtcblxuICAgIGl0KCdjcmVhdGUgc2VxdWVuY2UgYXVnbWVudG9yIGNvbmZpZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaGFzUnVuMSwgaGFzUnVuMiwgaGFzUnVuMztcblxuICAgICAgICB2YXIgc2VxdWVuY2VkID0gTHVjLkZ1bmN0aW9uLmNyZWF0ZVNlcXVlbmNlKFtcbiAgICAgICAgICAgIGZ1bmN0aW9uKGEsYikge1xuICAgICAgICAgICAgICAgIGV4cGVjdChhKS50by5iZSgxKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoYikudG8uYmUoMik7XG4gICAgICAgICAgICAgICAgaGFzUnVuMSA9IHRydWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaGFzUnVuMiA9IHRydWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaGFzUnVuMyA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIF0se1xuICAgICAgICAgICAgdGhpc0FyZzoge1xuICAgICAgICAgICAgICAgIGE6IDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIHJldCA9IHNlcXVlbmNlZCgxLDIpO1xuXG4gICAgICAgIGV4cGVjdChoYXNSdW4xKS50by5iZSh0cnVlKTtcbiAgICAgICAgZXhwZWN0KGhhc1J1bjIpLnRvLmJlKHRydWUpO1xuICAgICAgICBleHBlY3QoaGFzUnVuMykudG8uYmUodHJ1ZSk7XG4gICAgICAgIGV4cGVjdChyZXQpLnRvLmVxbCh7YToxfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnY3JlYXRlIHNlcXVlbmNlSWYnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGhhc1J1bjEsIGhhc1J1bjIsIGhhc1J1bjM7XG5cbiAgICAgICAgdmFyIHNlcXVlbmNlZCA9IEx1Yy5GdW5jdGlvbi5jcmVhdGVTZXF1ZW5jZUlmKFtcbiAgICAgICAgICAgIGZ1bmN0aW9uKGEsYikge1xuICAgICAgICAgICAgICAgIGV4cGVjdChhKS50by5iZSgxKTtcbiAgICAgICAgICAgICAgICAgZXhwZWN0KGIpLnRvLmJlKDIpO1xuICAgICAgICAgICAgICAgIGhhc1J1bjEgPSB0cnVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGhhc1J1bjIgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBoYXNSdW4zID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgXSx7XG4gICAgICAgICAgICB0aGlzQXJnOiB7XG4gICAgICAgICAgICAgICAgYTogMVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgcmV0ID0gc2VxdWVuY2VkKDEsMik7XG5cbiAgICAgICAgZXhwZWN0KGhhc1J1bjEpLnRvLmJlKHRydWUpO1xuICAgICAgICBleHBlY3QoaGFzUnVuMikudG8uYmUodHJ1ZSk7XG4gICAgICAgIGV4cGVjdChoYXNSdW4zKS50by5iZSh1bmRlZmluZWQpO1xuICAgICAgICBleHBlY3QocmV0KS50by5iZShmYWxzZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnY3JlYXRlIHJlbGF5ZXInLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNlcXVlbmNlZCA9IEx1Yy5GdW5jdGlvbi5jcmVhdGVSZWxheWVyKFtcbiAgICAgICAgICAgIGZ1bmN0aW9uKGEsYixjKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEgKyBiICsgYztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvL2FjYiwgYlxuICAgICAgICAgICAgZnVuY3Rpb24oYSxiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEgKyBhICsgYiArIGI7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLy9hY2JhY2JiYiwgYlxuICAgICAgICAgICAgZnVuY3Rpb24oYSxiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGIgKyBhO1xuICAgICAgICAgICAgfVxuICAgICAgICBdLHtcbiAgICAgICAgICAgIGFyZ3M6IFsnYiddLFxuICAgICAgICAgICAgaW5kZXg6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIHJldCA9IHNlcXVlbmNlZCgnYScsICdjJyk7XG5cbiAgICAgICAgZXhwZWN0KHJldCkudG8uYmUoJ2JhY2JhY2JiYicpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2NyZWF0ZSBkZWZlcnJlZCcsIGZ1bmN0aW9uKGRvbmUpIHtcbiAgICAgICAgdmFyIGhhc0RlZmVyZWQgPSBmYWxzZTtcbiAgICAgICAgdmFyIGRlZmVycmVkID0gTHVjLkZ1bmN0aW9uLmNyZWF0ZURlZmVycmVkKGZ1bmN0aW9uKGEsYil7XG4gICAgICAgICAgICBoYXNEZWZlcmVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGV4cGVjdChhKS50by5iZSgxKTtcbiAgICAgICAgICAgIGV4cGVjdChiKS50by5iZSgyKTtcbiAgICAgICAgICAgIGRvbmUoKTtcblxuICAgICAgICB9LCAxLCB7XG4gICAgICAgICAgICBhcmdzOiBbMl0sXG4gICAgICAgICAgICBpbmRleDogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICBkZWZlcnJlZCgxKTtcblxuICAgICAgICBleHBlY3QoaGFzRGVmZXJlZCkudG8uYmUoZmFsc2UpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2NyZWF0ZSBkZWZlcnJlZCBubyBtaWxsaXMnLCBmdW5jdGlvbihkb25lKSB7XG4gICAgICAgIHZhciBoYXNEZWZlcmVkID0gZmFsc2U7XG4gICAgICAgIHZhciBkZWZlcnJlZCA9IEx1Yy5GdW5jdGlvbi5jcmVhdGVEZWZlcnJlZChmdW5jdGlvbihhLGIpe1xuICAgICAgICAgICAgaGFzRGVmZXJlZCA9IHRydWU7XG4gICAgICAgICAgICBleHBlY3QoYSkudG8uYmUoMSk7XG4gICAgICAgICAgICBleHBlY3QoYikudG8uYmUodW5kZWZpbmVkKTtcbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfSwgMCk7XG5cbiAgICAgICAgZGVmZXJyZWQoMSk7XG5cbiAgICAgICAgZXhwZWN0KGhhc0RlZmVyZWQpLnRvLmJlKHRydWUpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2NyZWF0ZSB0aHJvdHRlbGVkIG5vIG1pbGxpcycsIGZ1bmN0aW9uKGRvbmUpIHtcbiAgICAgICAgdmFyIGhhc0RlZmVyZWQgPSBmYWxzZTtcbiAgICAgICAgdmFyIGRlZmVycmVkID0gTHVjLkZ1bmN0aW9uLmNyZWF0ZVRocm90dGxlZChmdW5jdGlvbihhLGIpe1xuICAgICAgICAgICAgaGFzRGVmZXJlZCA9IHRydWU7XG4gICAgICAgICAgICBleHBlY3QoYSkudG8uYmUoMSk7XG4gICAgICAgICAgICBleHBlY3QoYikudG8uYmUodW5kZWZpbmVkKTtcbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfSwgMCk7XG5cbiAgICAgICAgZGVmZXJyZWQoMSk7XG5cbiAgICAgICAgZXhwZWN0KGhhc0RlZmVyZWQpLnRvLmJlKHRydWUpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2NyZWF0ZSB0aHJvdHRlbGVkJywgZnVuY3Rpb24oZG9uZSkge1xuICAgICAgICB2YXIgY2FsbENvdW50ID0gMDtcbiAgICAgICAgdmFyIHRocm90dGxlZCA9IEx1Yy5GdW5jdGlvbi5jcmVhdGVUaHJvdHRsZWQoZnVuY3Rpb24oYSxiLGMpe1xuICAgICAgICAgICAgY2FsbENvdW50Kys7XG4gICAgICAgICAgICBleHBlY3QoYSkudG8uYmUoMSk7XG4gICAgICAgICAgICBleHBlY3QoYikudG8uYmUoMyk7XG4gICAgICAgICAgICBleHBlY3QoYykudG8uYmUoMik7XG4gICAgICAgICAgICBleHBlY3QoY2FsbENvdW50KS50by5iZSgxKTtcbiAgICAgICAgICAgIGRvbmUoKTtcblxuICAgICAgICB9LCAxLCB7XG4gICAgICAgICAgICBhcmdzOiBbM10sXG4gICAgICAgICAgICBpbmRleDogMVxuICAgICAgICB9KTtcblxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgMjAwOyArK2kpIHtcbiAgICAgICAgICAgIHRocm90dGxlZCgxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm90dGxlZCgxLDIpO1xuXG4gICAgICAgIGV4cGVjdChjYWxsQ291bnQpLnRvLmJlKDApO1xuICAgIH0pO1xuXG5cbn0pOyIsInZhciBMdWMgPSByZXF1aXJlKCcuL2x1Y1Rlc3RMaWInKSxcbiAgICBleHBlY3QgPSByZXF1aXJlKCdleHBlY3QuanMnKTtcblxuZGVzY3JpYmUoJ0x1YyBjb21wYXJlIGZuJywgZnVuY3Rpb24oKSB7XG5cbiAgICBpdCgnY29tcGFyZSBlbXB0eSBvYmplY3RzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGV4cGVjdChMdWMuY29tcGFyZSh7fSwge30pKS50by5iZSh0cnVlKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5jb21wYXJlKFtdLCBbXSkpLnRvLmJlKHRydWUpO1xuICAgICAgICBleHBlY3QoTHVjLmNvbXBhcmUobmV3IERhdGUoMTAwMCksIG5ldyBEYXRlKDEwMDApKSkudG8uYmUodHJ1ZSk7XG4gICAgICAgIGV4cGVjdChMdWMuY29tcGFyZShuZXcgRGF0ZSgxMDAwKSwgbmV3IERhdGUoMTAwMSkpKS50by5iZShmYWxzZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnY29tcGFyZSB2YWx1ZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KEx1Yy5jb21wYXJlKHt9LCB7XG4gICAgICAgICAgICBhOiAxXG4gICAgICAgIH0pKS50by5iZShmYWxzZSk7XG5cbiAgICAgICAgZXhwZWN0KEx1Yy5jb21wYXJlKHtcbiAgICAgICAgICAgIGE6IDFcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgYTogMVxuICAgICAgICB9KSkudG8uYmUodHJ1ZSk7XG5cbiAgICAgICAgZXhwZWN0KEx1Yy5jb21wYXJlKHtcbiAgICAgICAgICAgIGE6IDEsXG4gICAgICAgICAgICBiOiAxXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGE6IDFcbiAgICAgICAgfSkpLnRvLmJlKGZhbHNlKTtcbiAgICB9KTtcblxuXG4gICAgaXQoJ2NvbXBhcmUgZGlmZmVyZW50IG9iamVjdCB0eXBlcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3QoTHVjLmNvbXBhcmUobmV3IERhdGUoMTAwMDApLCB7fSkpLnRvLmJlKGZhbHNlKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5jb21wYXJlKG5ldyBEYXRlKDEwMDAwKSwgdW5kZWZpbmVkKSkudG8uYmUoZmFsc2UpO1xuICAgICAgICBleHBlY3QoTHVjLmNvbXBhcmUobmV3IERhdGUoMTAwMDApLCBbXSkpLnRvLmJlKGZhbHNlKTtcblxuICAgIH0pO1xuXG4gICAgaXQoJ2NvbXBhcmUgZmFsc3lzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGV4cGVjdChMdWMuY29tcGFyZShmYWxzZSwgZmFsc2UpKS50by5iZSh0cnVlKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5jb21wYXJlKDAsIGZhbHNlKSkudG8uYmUoZmFsc2UpO1xuICAgICAgICBleHBlY3QoTHVjLmNvbXBhcmUoJycsIGZhbHNlKSkudG8uYmUoZmFsc2UpO1xuICAgICAgICBleHBlY3QoTHVjLmNvbXBhcmUobnVsbCwgZmFsc2UpKS50by5iZShmYWxzZSk7XG4gICAgICAgIGV4cGVjdChMdWMuY29tcGFyZSh1bmRlZmluZWQsIGZhbHNlKSkudG8uYmUoZmFsc2UpO1xuICAgICAgICBleHBlY3QoTHVjLmNvbXBhcmUoTmFOLCBmYWxzZSkpLnRvLmJlKGZhbHNlKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5jb21wYXJlKFtdLCBbMV0sIHt0eXBlOiAnZGVlcCd9KSkudG8uYmUoZmFsc2UpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2RlZXAgY29tcGFyZScsIGZ1bmN0aW9uKCkgeyBcbiAgICAgICAgdmFyIGRlZXBUcnVlID0gTHVjLmNvbXBhcmUoe1xuICAgICAgICAgICAgYToge1xuICAgICAgICAgICAgICAgIGE6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBiOiBbMSwgJ2EnLCBuZXcgRGF0ZSgxMDAwKSwge1xuICAgICAgICAgICAgICAgICAgICBhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiOiB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAgYToge1xuICAgICAgICAgICAgICAgIGE6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBiOiBbMSwgJ2EnLCBuZXcgRGF0ZSgxMDAwKSwge1xuICAgICAgICAgICAgICAgICAgICBhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiOiB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdHlwZTogJ2RlZXAnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBkZWVwRmFsc2UgPSBMdWMuY29tcGFyZSh7XG4gICAgICAgICAgICBhOiB7XG4gICAgICAgICAgICAgICAgYTogMVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGI6IFsxLCAnYScsIG5ldyBEYXRlKDEwMDApLCB7XG4gICAgICAgICAgICAgICAgICAgIGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGI6IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBhOiB7XG4gICAgICAgICAgICAgICAgYTogMVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGI6IFsxLCAnYScsIG5ldyBEYXRlKDEwMDApLCB7XG4gICAgICAgICAgICAgICAgICAgIGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjOiB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdHlwZTogJ2RlZXAnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGV4cGVjdChkZWVwVHJ1ZSkudG8uYmUodHJ1ZSk7XG4gICAgICAgIGV4cGVjdChkZWVwRmFsc2UpLnRvLmJlKGZhbHNlKTtcbiAgICAgICAgfSlcblxuICAgIGl0KCdzaW1wbGUgZGVlcCBhbmQgc2hhbGxvdyBjb21wYXJlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGV4cGVjdChMdWMuY29tcGFyZSh7YToxfSwge2E6MX0sIHt0eXBlOiAnc2hhbGxvdyd9KSkudG8uYmUodHJ1ZSk7XG4gICAgICAgIGV4cGVjdChMdWMuY29tcGFyZSh7YToxLCBiOiB7fX0sIHthOjEsIGI6IHt9fSwge3R5cGU6ICdzaGFsbG93J30pKS50by5iZShmYWxzZSk7XG4gICAgICAgIGV4cGVjdChMdWMuY29tcGFyZSh7YToxfSwge2E6MX0sIHt0eXBlOiAnZGVlcCd9KSkudG8uYmUodHJ1ZSk7XG4gICAgICAgIGV4cGVjdChMdWMuY29tcGFyZSh7YToxLCBiOiB7fX0sIHthOjEsIGI6IHt9fSwge3R5cGU6ICdkZWVwJ30pKS50by5iZSh0cnVlKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5jb21wYXJlKHthOjF9LCB7YToxfSwge3R5cGU6ICdzdHJpY3QnfSkpLnRvLmJlKGZhbHNlKTtcblxuICAgIH0pO1xuXG4gICAgaXQoJ2ludmFsaWQgdHlwZSB0aHJvd3MgYW4gZXhjZXB0aW9uJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpbnZhbGlkVHlwZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBMdWMuY29tcGFyZSh0cnVlLCB0cnVlLCB7dHlwZTogJ2RlZWVlZXAnfSk7XG4gICAgICAgIH07XG4gICAgICAgIGV4cGVjdChpbnZhbGlkVHlwZSkudG8udGhyb3dFeGNlcHRpb24oKTtcbiAgICB9KTtcblxuICAgIGl0KCdsb29zZSBjb21wYXJlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGV4cGVjdChMdWMuY29tcGFyZShuZXcgRGF0ZSgxMDAwMCksIHt9KSwge3R5cGU6ICdsb29zZSd9KS50by5iZShmYWxzZSk7XG4gICAgICAgIGV4cGVjdChMdWMuY29tcGFyZSh7fSwgbmV3IERhdGUoMTAwMDApKSwge3R5cGU6ICdsb29zZSd9KS50by5iZShmYWxzZSk7XG5cbiAgICAgICAgZXhwZWN0KEx1Yy5jb21wYXJlKHthOjF9LCB7YToxLCBiOjJ9LCB7dHlwZTogJ2xvb3NlJ30pKS50by5iZSh0cnVlKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5jb21wYXJlKHthOjF9LCB7YToyfSwge3R5cGU6ICdsb29zZSd9KSkudG8uYmUoZmFsc2UpO1xuXG4gICAgICAgIGV4cGVjdChMdWMuY29tcGFyZSgxLCB7YToyfSwge3R5cGU6ICdsb29zZSd9KSkudG8uYmUoZmFsc2UpO1xuICAgICAgICBleHBlY3QoTHVjLmNvbXBhcmUoe2E6MX0sIDEsIHt0eXBlOiAnbG9vc2UnfSkpLnRvLmJlKGZhbHNlKTtcblxuICAgICAgICBleHBlY3QoTHVjLmNvbXBhcmUoW3thOjF9XSwgW3thOjEsIGI6Mn1dLCB7dHlwZTogJ2xvb3NlJ30pKS50by5iZSh0cnVlKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5jb21wYXJlKFt7YToxfSwgMV0sIFt7YToxLCBiOjJ9XSwge3R5cGU6ICdsb29zZSd9KSkudG8uYmUoZmFsc2UpO1xuICAgICAgICBleHBlY3QoTHVjLmNvbXBhcmUoW3thOjF9LCAxXSwgW3thOjEsIGI6Mn0sIDFdLCB7dHlwZTogJ2xvb3NlJ30pKS50by5iZSh0cnVlKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5jb21wYXJlKFt7YToxfSwgMV0sIFt7YToxLCBiOjJ9LCAyXSwge3R5cGU6ICdsb29zZSd9KSkudG8uYmUoZmFsc2UpO1xuICAgIH0pXG59KTsiLCJ2YXIgTHVjID0gcmVxdWlyZSgnLi9sdWNUZXN0TGliJyksXG4gICAgZXhwZWN0ID0gcmVxdWlyZSgnZXhwZWN0LmpzJyk7XG5cbmRlc2NyaWJlKCdMdWMgc3VibW9kdWxlJywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN1YiA9IHtcbiAgICAgICAgYTogMSxcbiAgICAgICAgYjogMlxuICAgIH0sXG4gICAgbmFtZXNwYWNlID0gJ3Rlc3RTdWInO1xuICAgIFxuICAgIGFmdGVyRWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgZGVsZXRlIEx1Y1tuYW1lc3BhY2VdO1xuICAgIH0pO1xuXG4gICAgaXQoJ21vZHVsZSBhZGRlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBMdWMuYWRkU3VibW9kdWxlKG5hbWVzcGFjZSwgc3ViKTtcblxuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGV4cGVjdChMdWNbbmFtZXNwYWNlXSkudG8uYmUuZXFsKHtcbiAgICAgICAgICAgICAgICBhOiAxLFxuICAgICAgICAgICAgICAgIGI6IDJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXhwZWN0KEx1Y1tuYW1lc3BhY2VdKS50by5iZSh1bmRlZmluZWQpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBpdCgnYWx3YXlzQWRkU3VibW9kdWxlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIEx1Yy5hbHdheXNBZGRTdWJtb2R1bGUgPSB0cnVlO1xuICAgICAgICBMdWMuYWRkU3VibW9kdWxlKG5hbWVzcGFjZSwgc3ViKTtcblxuICAgICAgICBleHBlY3QoTHVjW25hbWVzcGFjZV0pLnRvLmJlLmVxbCh7XG4gICAgICAgICAgICBhOiAxLFxuICAgICAgICAgICAgYjogMlxuICAgICAgICB9KTtcbiAgICB9KTtcbn0pOyIsInJlcXVpcmU9KGZ1bmN0aW9uKGUsdCxuLHIpe2Z1bmN0aW9uIGkocil7aWYoIW5bcl0pe2lmKCF0W3JdKXtpZihlKXJldHVybiBlKHIpO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrcitcIidcIil9dmFyIHM9bltyXT17ZXhwb3J0czp7fX07dFtyXVswXShmdW5jdGlvbihlKXt2YXIgbj10W3JdWzFdW2VdO3JldHVybiBpKG4/bjplKX0scyxzLmV4cG9ydHMpfXJldHVybiBuW3JdLmV4cG9ydHN9Zm9yKHZhciBzPTA7czxyLmxlbmd0aDtzKyspaShyW3NdKTtyZXR1cm4gaX0pKHR5cGVvZiByZXF1aXJlIT09XCJ1bmRlZmluZWRcIiYmcmVxdWlyZSx7MTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4vLyBVVElMSVRZXG52YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcbnZhciBCdWZmZXIgPSByZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcjtcbnZhciBwU2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbmZ1bmN0aW9uIG9iamVjdEtleXMob2JqZWN0KSB7XG4gIGlmIChPYmplY3Qua2V5cykgcmV0dXJuIE9iamVjdC5rZXlzKG9iamVjdCk7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgZm9yICh2YXIgbmFtZSBpbiBvYmplY3QpIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgbmFtZSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKG5hbWUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vLyAxLiBUaGUgYXNzZXJ0IG1vZHVsZSBwcm92aWRlcyBmdW5jdGlvbnMgdGhhdCB0aHJvd1xuLy8gQXNzZXJ0aW9uRXJyb3IncyB3aGVuIHBhcnRpY3VsYXIgY29uZGl0aW9ucyBhcmUgbm90IG1ldC4gVGhlXG4vLyBhc3NlcnQgbW9kdWxlIG11c3QgY29uZm9ybSB0byB0aGUgZm9sbG93aW5nIGludGVyZmFjZS5cblxudmFyIGFzc2VydCA9IG1vZHVsZS5leHBvcnRzID0gb2s7XG5cbi8vIDIuIFRoZSBBc3NlcnRpb25FcnJvciBpcyBkZWZpbmVkIGluIGFzc2VydC5cbi8vIG5ldyBhc3NlcnQuQXNzZXJ0aW9uRXJyb3IoeyBtZXNzYWdlOiBtZXNzYWdlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdHVhbDogYWN0dWFsLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGVjdGVkOiBleHBlY3RlZCB9KVxuXG5hc3NlcnQuQXNzZXJ0aW9uRXJyb3IgPSBmdW5jdGlvbiBBc3NlcnRpb25FcnJvcihvcHRpb25zKSB7XG4gIHRoaXMubmFtZSA9ICdBc3NlcnRpb25FcnJvcic7XG4gIHRoaXMubWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZTtcbiAgdGhpcy5hY3R1YWwgPSBvcHRpb25zLmFjdHVhbDtcbiAgdGhpcy5leHBlY3RlZCA9IG9wdGlvbnMuZXhwZWN0ZWQ7XG4gIHRoaXMub3BlcmF0b3IgPSBvcHRpb25zLm9wZXJhdG9yO1xuICB2YXIgc3RhY2tTdGFydEZ1bmN0aW9uID0gb3B0aW9ucy5zdGFja1N0YXJ0RnVuY3Rpb24gfHwgZmFpbDtcblxuICBpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpIHtcbiAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBzdGFja1N0YXJ0RnVuY3Rpb24pO1xuICB9XG59O1xudXRpbC5pbmhlcml0cyhhc3NlcnQuQXNzZXJ0aW9uRXJyb3IsIEVycm9yKTtcblxuZnVuY3Rpb24gcmVwbGFjZXIoa2V5LCB2YWx1ZSkge1xuICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiAnJyArIHZhbHVlO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmIChpc05hTih2YWx1ZSkgfHwgIWlzRmluaXRlKHZhbHVlKSkpIHtcbiAgICByZXR1cm4gdmFsdWUudG9TdHJpbmcoKTtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nIHx8IHZhbHVlIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgcmV0dXJuIHZhbHVlLnRvU3RyaW5nKCk7XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5mdW5jdGlvbiB0cnVuY2F0ZShzLCBuKSB7XG4gIGlmICh0eXBlb2YgcyA9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBzLmxlbmd0aCA8IG4gPyBzIDogcy5zbGljZSgwLCBuKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcztcbiAgfVxufVxuXG5hc3NlcnQuQXNzZXJ0aW9uRXJyb3IucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLm1lc3NhZ2UpIHtcbiAgICByZXR1cm4gW3RoaXMubmFtZSArICc6JywgdGhpcy5tZXNzYWdlXS5qb2luKCcgJyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIHRoaXMubmFtZSArICc6JyxcbiAgICAgIHRydW5jYXRlKEpTT04uc3RyaW5naWZ5KHRoaXMuYWN0dWFsLCByZXBsYWNlciksIDEyOCksXG4gICAgICB0aGlzLm9wZXJhdG9yLFxuICAgICAgdHJ1bmNhdGUoSlNPTi5zdHJpbmdpZnkodGhpcy5leHBlY3RlZCwgcmVwbGFjZXIpLCAxMjgpXG4gICAgXS5qb2luKCcgJyk7XG4gIH1cbn07XG5cbi8vIGFzc2VydC5Bc3NlcnRpb25FcnJvciBpbnN0YW5jZW9mIEVycm9yXG5cbmFzc2VydC5Bc3NlcnRpb25FcnJvci5fX3Byb3RvX18gPSBFcnJvci5wcm90b3R5cGU7XG5cbi8vIEF0IHByZXNlbnQgb25seSB0aGUgdGhyZWUga2V5cyBtZW50aW9uZWQgYWJvdmUgYXJlIHVzZWQgYW5kXG4vLyB1bmRlcnN0b29kIGJ5IHRoZSBzcGVjLiBJbXBsZW1lbnRhdGlvbnMgb3Igc3ViIG1vZHVsZXMgY2FuIHBhc3Ncbi8vIG90aGVyIGtleXMgdG8gdGhlIEFzc2VydGlvbkVycm9yJ3MgY29uc3RydWN0b3IgLSB0aGV5IHdpbGwgYmVcbi8vIGlnbm9yZWQuXG5cbi8vIDMuIEFsbCBvZiB0aGUgZm9sbG93aW5nIGZ1bmN0aW9ucyBtdXN0IHRocm93IGFuIEFzc2VydGlvbkVycm9yXG4vLyB3aGVuIGEgY29ycmVzcG9uZGluZyBjb25kaXRpb24gaXMgbm90IG1ldCwgd2l0aCBhIG1lc3NhZ2UgdGhhdFxuLy8gbWF5IGJlIHVuZGVmaW5lZCBpZiBub3QgcHJvdmlkZWQuICBBbGwgYXNzZXJ0aW9uIG1ldGhvZHMgcHJvdmlkZVxuLy8gYm90aCB0aGUgYWN0dWFsIGFuZCBleHBlY3RlZCB2YWx1ZXMgdG8gdGhlIGFzc2VydGlvbiBlcnJvciBmb3Jcbi8vIGRpc3BsYXkgcHVycG9zZXMuXG5cbmZ1bmN0aW9uIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgb3BlcmF0b3IsIHN0YWNrU3RhcnRGdW5jdGlvbikge1xuICB0aHJvdyBuZXcgYXNzZXJ0LkFzc2VydGlvbkVycm9yKHtcbiAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgIGFjdHVhbDogYWN0dWFsLFxuICAgIGV4cGVjdGVkOiBleHBlY3RlZCxcbiAgICBvcGVyYXRvcjogb3BlcmF0b3IsXG4gICAgc3RhY2tTdGFydEZ1bmN0aW9uOiBzdGFja1N0YXJ0RnVuY3Rpb25cbiAgfSk7XG59XG5cbi8vIEVYVEVOU0lPTiEgYWxsb3dzIGZvciB3ZWxsIGJlaGF2ZWQgZXJyb3JzIGRlZmluZWQgZWxzZXdoZXJlLlxuYXNzZXJ0LmZhaWwgPSBmYWlsO1xuXG4vLyA0LiBQdXJlIGFzc2VydGlvbiB0ZXN0cyB3aGV0aGVyIGEgdmFsdWUgaXMgdHJ1dGh5LCBhcyBkZXRlcm1pbmVkXG4vLyBieSAhIWd1YXJkLlxuLy8gYXNzZXJ0Lm9rKGd1YXJkLCBtZXNzYWdlX29wdCk7XG4vLyBUaGlzIHN0YXRlbWVudCBpcyBlcXVpdmFsZW50IHRvIGFzc2VydC5lcXVhbCh0cnVlLCBndWFyZCxcbi8vIG1lc3NhZ2Vfb3B0KTsuIFRvIHRlc3Qgc3RyaWN0bHkgZm9yIHRoZSB2YWx1ZSB0cnVlLCB1c2Vcbi8vIGFzc2VydC5zdHJpY3RFcXVhbCh0cnVlLCBndWFyZCwgbWVzc2FnZV9vcHQpOy5cblxuZnVuY3Rpb24gb2sodmFsdWUsIG1lc3NhZ2UpIHtcbiAgaWYgKCEhIXZhbHVlKSBmYWlsKHZhbHVlLCB0cnVlLCBtZXNzYWdlLCAnPT0nLCBhc3NlcnQub2spO1xufVxuYXNzZXJ0Lm9rID0gb2s7XG5cbi8vIDUuIFRoZSBlcXVhbGl0eSBhc3NlcnRpb24gdGVzdHMgc2hhbGxvdywgY29lcmNpdmUgZXF1YWxpdHkgd2l0aFxuLy8gPT0uXG4vLyBhc3NlcnQuZXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQuZXF1YWwgPSBmdW5jdGlvbiBlcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChhY3R1YWwgIT0gZXhwZWN0ZWQpIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJz09JywgYXNzZXJ0LmVxdWFsKTtcbn07XG5cbi8vIDYuIFRoZSBub24tZXF1YWxpdHkgYXNzZXJ0aW9uIHRlc3RzIGZvciB3aGV0aGVyIHR3byBvYmplY3RzIGFyZSBub3QgZXF1YWxcbi8vIHdpdGggIT0gYXNzZXJ0Lm5vdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0Lm5vdEVxdWFsID0gZnVuY3Rpb24gbm90RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoYWN0dWFsID09IGV4cGVjdGVkKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnIT0nLCBhc3NlcnQubm90RXF1YWwpO1xuICB9XG59O1xuXG4vLyA3LiBUaGUgZXF1aXZhbGVuY2UgYXNzZXJ0aW9uIHRlc3RzIGEgZGVlcCBlcXVhbGl0eSByZWxhdGlvbi5cbi8vIGFzc2VydC5kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQuZGVlcEVxdWFsID0gZnVuY3Rpb24gZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKCFfZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQpKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnZGVlcEVxdWFsJywgYXNzZXJ0LmRlZXBFcXVhbCk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIF9kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCkge1xuICAvLyA3LjEuIEFsbCBpZGVudGljYWwgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBhcyBkZXRlcm1pbmVkIGJ5ID09PS5cbiAgaWYgKGFjdHVhbCA9PT0gZXhwZWN0ZWQpIHtcbiAgICByZXR1cm4gdHJ1ZTtcblxuICB9IGVsc2UgaWYgKEJ1ZmZlci5pc0J1ZmZlcihhY3R1YWwpICYmIEJ1ZmZlci5pc0J1ZmZlcihleHBlY3RlZCkpIHtcbiAgICBpZiAoYWN0dWFsLmxlbmd0aCAhPSBleHBlY3RlZC5sZW5ndGgpIHJldHVybiBmYWxzZTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWN0dWFsLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoYWN0dWFsW2ldICE9PSBleHBlY3RlZFtpXSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuXG4gIC8vIDcuMi4gSWYgdGhlIGV4cGVjdGVkIHZhbHVlIGlzIGEgRGF0ZSBvYmplY3QsIHRoZSBhY3R1YWwgdmFsdWUgaXNcbiAgLy8gZXF1aXZhbGVudCBpZiBpdCBpcyBhbHNvIGEgRGF0ZSBvYmplY3QgdGhhdCByZWZlcnMgdG8gdGhlIHNhbWUgdGltZS5cbiAgfSBlbHNlIGlmIChhY3R1YWwgaW5zdGFuY2VvZiBEYXRlICYmIGV4cGVjdGVkIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgIHJldHVybiBhY3R1YWwuZ2V0VGltZSgpID09PSBleHBlY3RlZC5nZXRUaW1lKCk7XG5cbiAgLy8gNy4zLiBPdGhlciBwYWlycyB0aGF0IGRvIG5vdCBib3RoIHBhc3MgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnLFxuICAvLyBlcXVpdmFsZW5jZSBpcyBkZXRlcm1pbmVkIGJ5ID09LlxuICB9IGVsc2UgaWYgKHR5cGVvZiBhY3R1YWwgIT0gJ29iamVjdCcgJiYgdHlwZW9mIGV4cGVjdGVkICE9ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIGFjdHVhbCA9PSBleHBlY3RlZDtcblxuICAvLyA3LjQuIEZvciBhbGwgb3RoZXIgT2JqZWN0IHBhaXJzLCBpbmNsdWRpbmcgQXJyYXkgb2JqZWN0cywgZXF1aXZhbGVuY2UgaXNcbiAgLy8gZGV0ZXJtaW5lZCBieSBoYXZpbmcgdGhlIHNhbWUgbnVtYmVyIG9mIG93bmVkIHByb3BlcnRpZXMgKGFzIHZlcmlmaWVkXG4gIC8vIHdpdGggT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKSwgdGhlIHNhbWUgc2V0IG9mIGtleXNcbiAgLy8gKGFsdGhvdWdoIG5vdCBuZWNlc3NhcmlseSB0aGUgc2FtZSBvcmRlciksIGVxdWl2YWxlbnQgdmFsdWVzIGZvciBldmVyeVxuICAvLyBjb3JyZXNwb25kaW5nIGtleSwgYW5kIGFuIGlkZW50aWNhbCAncHJvdG90eXBlJyBwcm9wZXJ0eS4gTm90ZTogdGhpc1xuICAvLyBhY2NvdW50cyBmb3IgYm90aCBuYW1lZCBhbmQgaW5kZXhlZCBwcm9wZXJ0aWVzIG9uIEFycmF5cy5cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gb2JqRXF1aXYoYWN0dWFsLCBleHBlY3RlZCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWRPck51bGwodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIGlzQXJndW1lbnRzKG9iamVjdCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iamVjdCkgPT0gJ1tvYmplY3QgQXJndW1lbnRzXSc7XG59XG5cbmZ1bmN0aW9uIG9iakVxdWl2KGEsIGIpIHtcbiAgaWYgKGlzVW5kZWZpbmVkT3JOdWxsKGEpIHx8IGlzVW5kZWZpbmVkT3JOdWxsKGIpKVxuICAgIHJldHVybiBmYWxzZTtcbiAgLy8gYW4gaWRlbnRpY2FsICdwcm90b3R5cGUnIHByb3BlcnR5LlxuICBpZiAoYS5wcm90b3R5cGUgIT09IGIucHJvdG90eXBlKSByZXR1cm4gZmFsc2U7XG4gIC8vfn5+SSd2ZSBtYW5hZ2VkIHRvIGJyZWFrIE9iamVjdC5rZXlzIHRocm91Z2ggc2NyZXd5IGFyZ3VtZW50cyBwYXNzaW5nLlxuICAvLyAgIENvbnZlcnRpbmcgdG8gYXJyYXkgc29sdmVzIHRoZSBwcm9ibGVtLlxuICBpZiAoaXNBcmd1bWVudHMoYSkpIHtcbiAgICBpZiAoIWlzQXJndW1lbnRzKGIpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGEgPSBwU2xpY2UuY2FsbChhKTtcbiAgICBiID0gcFNsaWNlLmNhbGwoYik7XG4gICAgcmV0dXJuIF9kZWVwRXF1YWwoYSwgYik7XG4gIH1cbiAgdHJ5IHtcbiAgICB2YXIga2EgPSBvYmplY3RLZXlzKGEpLFxuICAgICAgICBrYiA9IG9iamVjdEtleXMoYiksXG4gICAgICAgIGtleSwgaTtcbiAgfSBjYXRjaCAoZSkgey8vaGFwcGVucyB3aGVuIG9uZSBpcyBhIHN0cmluZyBsaXRlcmFsIGFuZCB0aGUgb3RoZXIgaXNuJ3RcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gaGF2aW5nIHRoZSBzYW1lIG51bWJlciBvZiBvd25lZCBwcm9wZXJ0aWVzIChrZXlzIGluY29ycG9yYXRlc1xuICAvLyBoYXNPd25Qcm9wZXJ0eSlcbiAgaWYgKGthLmxlbmd0aCAhPSBrYi5sZW5ndGgpXG4gICAgcmV0dXJuIGZhbHNlO1xuICAvL3RoZSBzYW1lIHNldCBvZiBrZXlzIChhbHRob3VnaCBub3QgbmVjZXNzYXJpbHkgdGhlIHNhbWUgb3JkZXIpLFxuICBrYS5zb3J0KCk7XG4gIGtiLnNvcnQoKTtcbiAgLy9+fn5jaGVhcCBrZXkgdGVzdFxuICBmb3IgKGkgPSBrYS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIGlmIChrYVtpXSAhPSBrYltpXSlcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvL2VxdWl2YWxlbnQgdmFsdWVzIGZvciBldmVyeSBjb3JyZXNwb25kaW5nIGtleSwgYW5kXG4gIC8vfn5+cG9zc2libHkgZXhwZW5zaXZlIGRlZXAgdGVzdFxuICBmb3IgKGkgPSBrYS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIGtleSA9IGthW2ldO1xuICAgIGlmICghX2RlZXBFcXVhbChhW2tleV0sIGJba2V5XSkpIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLy8gOC4gVGhlIG5vbi1lcXVpdmFsZW5jZSBhc3NlcnRpb24gdGVzdHMgZm9yIGFueSBkZWVwIGluZXF1YWxpdHkuXG4vLyBhc3NlcnQubm90RGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0Lm5vdERlZXBFcXVhbCA9IGZ1bmN0aW9uIG5vdERlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChfZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQpKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnbm90RGVlcEVxdWFsJywgYXNzZXJ0Lm5vdERlZXBFcXVhbCk7XG4gIH1cbn07XG5cbi8vIDkuIFRoZSBzdHJpY3QgZXF1YWxpdHkgYXNzZXJ0aW9uIHRlc3RzIHN0cmljdCBlcXVhbGl0eSwgYXMgZGV0ZXJtaW5lZCBieSA9PT0uXG4vLyBhc3NlcnQuc3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQuc3RyaWN0RXF1YWwgPSBmdW5jdGlvbiBzdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChhY3R1YWwgIT09IGV4cGVjdGVkKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnPT09JywgYXNzZXJ0LnN0cmljdEVxdWFsKTtcbiAgfVxufTtcblxuLy8gMTAuIFRoZSBzdHJpY3Qgbm9uLWVxdWFsaXR5IGFzc2VydGlvbiB0ZXN0cyBmb3Igc3RyaWN0IGluZXF1YWxpdHksIGFzXG4vLyBkZXRlcm1pbmVkIGJ5ICE9PS4gIGFzc2VydC5ub3RTdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5ub3RTdHJpY3RFcXVhbCA9IGZ1bmN0aW9uIG5vdFN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKGFjdHVhbCA9PT0gZXhwZWN0ZWQpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICchPT0nLCBhc3NlcnQubm90U3RyaWN0RXF1YWwpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBleHBlY3RlZEV4Y2VwdGlvbihhY3R1YWwsIGV4cGVjdGVkKSB7XG4gIGlmICghYWN0dWFsIHx8ICFleHBlY3RlZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChleHBlY3RlZCBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgIHJldHVybiBleHBlY3RlZC50ZXN0KGFjdHVhbCk7XG4gIH0gZWxzZSBpZiAoYWN0dWFsIGluc3RhbmNlb2YgZXhwZWN0ZWQpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIGlmIChleHBlY3RlZC5jYWxsKHt9LCBhY3R1YWwpID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIF90aHJvd3Moc2hvdWxkVGhyb3csIGJsb2NrLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICB2YXIgYWN0dWFsO1xuXG4gIGlmICh0eXBlb2YgZXhwZWN0ZWQgPT09ICdzdHJpbmcnKSB7XG4gICAgbWVzc2FnZSA9IGV4cGVjdGVkO1xuICAgIGV4cGVjdGVkID0gbnVsbDtcbiAgfVxuXG4gIHRyeSB7XG4gICAgYmxvY2soKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGFjdHVhbCA9IGU7XG4gIH1cblxuICBtZXNzYWdlID0gKGV4cGVjdGVkICYmIGV4cGVjdGVkLm5hbWUgPyAnICgnICsgZXhwZWN0ZWQubmFtZSArICcpLicgOiAnLicpICtcbiAgICAgICAgICAgIChtZXNzYWdlID8gJyAnICsgbWVzc2FnZSA6ICcuJyk7XG5cbiAgaWYgKHNob3VsZFRocm93ICYmICFhY3R1YWwpIHtcbiAgICBmYWlsKCdNaXNzaW5nIGV4cGVjdGVkIGV4Y2VwdGlvbicgKyBtZXNzYWdlKTtcbiAgfVxuXG4gIGlmICghc2hvdWxkVGhyb3cgJiYgZXhwZWN0ZWRFeGNlcHRpb24oYWN0dWFsLCBleHBlY3RlZCkpIHtcbiAgICBmYWlsKCdHb3QgdW53YW50ZWQgZXhjZXB0aW9uJyArIG1lc3NhZ2UpO1xuICB9XG5cbiAgaWYgKChzaG91bGRUaHJvdyAmJiBhY3R1YWwgJiYgZXhwZWN0ZWQgJiZcbiAgICAgICFleHBlY3RlZEV4Y2VwdGlvbihhY3R1YWwsIGV4cGVjdGVkKSkgfHwgKCFzaG91bGRUaHJvdyAmJiBhY3R1YWwpKSB7XG4gICAgdGhyb3cgYWN0dWFsO1xuICB9XG59XG5cbi8vIDExLiBFeHBlY3RlZCB0byB0aHJvdyBhbiBlcnJvcjpcbi8vIGFzc2VydC50aHJvd3MoYmxvY2ssIEVycm9yX29wdCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQudGhyb3dzID0gZnVuY3Rpb24oYmxvY2ssIC8qb3B0aW9uYWwqL2Vycm9yLCAvKm9wdGlvbmFsKi9tZXNzYWdlKSB7XG4gIF90aHJvd3MuYXBwbHkodGhpcywgW3RydWVdLmNvbmNhdChwU2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG59O1xuXG4vLyBFWFRFTlNJT04hIFRoaXMgaXMgYW5ub3lpbmcgdG8gd3JpdGUgb3V0c2lkZSB0aGlzIG1vZHVsZS5cbmFzc2VydC5kb2VzTm90VGhyb3cgPSBmdW5jdGlvbihibG9jaywgLypvcHRpb25hbCovZXJyb3IsIC8qb3B0aW9uYWwqL21lc3NhZ2UpIHtcbiAgX3Rocm93cy5hcHBseSh0aGlzLCBbZmFsc2VdLmNvbmNhdChwU2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG59O1xuXG5hc3NlcnQuaWZFcnJvciA9IGZ1bmN0aW9uKGVycikgeyBpZiAoZXJyKSB7dGhyb3cgZXJyO319O1xuXG59LHtcInV0aWxcIjoyLFwiYnVmZmVyXCI6M31dLDI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xudmFyIGV2ZW50cyA9IHJlcXVpcmUoJ2V2ZW50cycpO1xuXG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuZXhwb3J0cy5pc0RhdGUgPSBmdW5jdGlvbihvYmope3JldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgRGF0ZV0nfTtcbmV4cG9ydHMuaXNSZWdFeHAgPSBmdW5jdGlvbihvYmope3JldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgUmVnRXhwXSd9O1xuXG5cbmV4cG9ydHMucHJpbnQgPSBmdW5jdGlvbiAoKSB7fTtcbmV4cG9ydHMucHV0cyA9IGZ1bmN0aW9uICgpIHt9O1xuZXhwb3J0cy5kZWJ1ZyA9IGZ1bmN0aW9uKCkge307XG5cbmV4cG9ydHMuaW5zcGVjdCA9IGZ1bmN0aW9uKG9iaiwgc2hvd0hpZGRlbiwgZGVwdGgsIGNvbG9ycykge1xuICB2YXIgc2VlbiA9IFtdO1xuXG4gIHZhciBzdHlsaXplID0gZnVuY3Rpb24oc3RyLCBzdHlsZVR5cGUpIHtcbiAgICAvLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0FOU0lfZXNjYXBlX2NvZGUjZ3JhcGhpY3NcbiAgICB2YXIgc3R5bGVzID1cbiAgICAgICAgeyAnYm9sZCcgOiBbMSwgMjJdLFxuICAgICAgICAgICdpdGFsaWMnIDogWzMsIDIzXSxcbiAgICAgICAgICAndW5kZXJsaW5lJyA6IFs0LCAyNF0sXG4gICAgICAgICAgJ2ludmVyc2UnIDogWzcsIDI3XSxcbiAgICAgICAgICAnd2hpdGUnIDogWzM3LCAzOV0sXG4gICAgICAgICAgJ2dyZXknIDogWzkwLCAzOV0sXG4gICAgICAgICAgJ2JsYWNrJyA6IFszMCwgMzldLFxuICAgICAgICAgICdibHVlJyA6IFszNCwgMzldLFxuICAgICAgICAgICdjeWFuJyA6IFszNiwgMzldLFxuICAgICAgICAgICdncmVlbicgOiBbMzIsIDM5XSxcbiAgICAgICAgICAnbWFnZW50YScgOiBbMzUsIDM5XSxcbiAgICAgICAgICAncmVkJyA6IFszMSwgMzldLFxuICAgICAgICAgICd5ZWxsb3cnIDogWzMzLCAzOV0gfTtcblxuICAgIHZhciBzdHlsZSA9XG4gICAgICAgIHsgJ3NwZWNpYWwnOiAnY3lhbicsXG4gICAgICAgICAgJ251bWJlcic6ICdibHVlJyxcbiAgICAgICAgICAnYm9vbGVhbic6ICd5ZWxsb3cnLFxuICAgICAgICAgICd1bmRlZmluZWQnOiAnZ3JleScsXG4gICAgICAgICAgJ251bGwnOiAnYm9sZCcsXG4gICAgICAgICAgJ3N0cmluZyc6ICdncmVlbicsXG4gICAgICAgICAgJ2RhdGUnOiAnbWFnZW50YScsXG4gICAgICAgICAgLy8gXCJuYW1lXCI6IGludGVudGlvbmFsbHkgbm90IHN0eWxpbmdcbiAgICAgICAgICAncmVnZXhwJzogJ3JlZCcgfVtzdHlsZVR5cGVdO1xuXG4gICAgaWYgKHN0eWxlKSB7XG4gICAgICByZXR1cm4gJ1xcMDMzWycgKyBzdHlsZXNbc3R5bGVdWzBdICsgJ20nICsgc3RyICtcbiAgICAgICAgICAgICAnXFwwMzNbJyArIHN0eWxlc1tzdHlsZV1bMV0gKyAnbSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuICB9O1xuICBpZiAoISBjb2xvcnMpIHtcbiAgICBzdHlsaXplID0gZnVuY3Rpb24oc3RyLCBzdHlsZVR5cGUpIHsgcmV0dXJuIHN0cjsgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdCh2YWx1ZSwgcmVjdXJzZVRpbWVzKSB7XG4gICAgLy8gUHJvdmlkZSBhIGhvb2sgZm9yIHVzZXItc3BlY2lmaWVkIGluc3BlY3QgZnVuY3Rpb25zLlxuICAgIC8vIENoZWNrIHRoYXQgdmFsdWUgaXMgYW4gb2JqZWN0IHdpdGggYW4gaW5zcGVjdCBmdW5jdGlvbiBvbiBpdFxuICAgIGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUuaW5zcGVjdCA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgICAgICAvLyBGaWx0ZXIgb3V0IHRoZSB1dGlsIG1vZHVsZSwgaXQncyBpbnNwZWN0IGZ1bmN0aW9uIGlzIHNwZWNpYWxcbiAgICAgICAgdmFsdWUgIT09IGV4cG9ydHMgJiZcbiAgICAgICAgLy8gQWxzbyBmaWx0ZXIgb3V0IGFueSBwcm90b3R5cGUgb2JqZWN0cyB1c2luZyB0aGUgY2lyY3VsYXIgY2hlY2suXG4gICAgICAgICEodmFsdWUuY29uc3RydWN0b3IgJiYgdmFsdWUuY29uc3RydWN0b3IucHJvdG90eXBlID09PSB2YWx1ZSkpIHtcbiAgICAgIHJldHVybiB2YWx1ZS5pbnNwZWN0KHJlY3Vyc2VUaW1lcyk7XG4gICAgfVxuXG4gICAgLy8gUHJpbWl0aXZlIHR5cGVzIGNhbm5vdCBoYXZlIHByb3BlcnRpZXNcbiAgICBzd2l0Y2ggKHR5cGVvZiB2YWx1ZSkge1xuICAgICAgY2FzZSAndW5kZWZpbmVkJzpcbiAgICAgICAgcmV0dXJuIHN0eWxpemUoJ3VuZGVmaW5lZCcsICd1bmRlZmluZWQnKTtcblxuICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgdmFyIHNpbXBsZSA9ICdcXCcnICsgSlNPTi5zdHJpbmdpZnkodmFsdWUpLnJlcGxhY2UoL15cInxcIiQvZywgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJykgKyAnXFwnJztcbiAgICAgICAgcmV0dXJuIHN0eWxpemUoc2ltcGxlLCAnc3RyaW5nJyk7XG5cbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIHJldHVybiBzdHlsaXplKCcnICsgdmFsdWUsICdudW1iZXInKTtcblxuICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICAgIHJldHVybiBzdHlsaXplKCcnICsgdmFsdWUsICdib29sZWFuJyk7XG4gICAgfVxuICAgIC8vIEZvciBzb21lIHJlYXNvbiB0eXBlb2YgbnVsbCBpcyBcIm9iamVjdFwiLCBzbyBzcGVjaWFsIGNhc2UgaGVyZS5cbiAgICBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBzdHlsaXplKCdudWxsJywgJ251bGwnKTtcbiAgICB9XG5cbiAgICAvLyBMb29rIHVwIHRoZSBrZXlzIG9mIHRoZSBvYmplY3QuXG4gICAgdmFyIHZpc2libGVfa2V5cyA9IE9iamVjdF9rZXlzKHZhbHVlKTtcbiAgICB2YXIga2V5cyA9IHNob3dIaWRkZW4gPyBPYmplY3RfZ2V0T3duUHJvcGVydHlOYW1lcyh2YWx1ZSkgOiB2aXNpYmxlX2tleXM7XG5cbiAgICAvLyBGdW5jdGlvbnMgd2l0aG91dCBwcm9wZXJ0aWVzIGNhbiBiZSBzaG9ydGN1dHRlZC5cbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nICYmIGtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBzdHlsaXplKCcnICsgdmFsdWUsICdyZWdleHAnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBuYW1lID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgICAgIHJldHVybiBzdHlsaXplKCdbRnVuY3Rpb24nICsgbmFtZSArICddJywgJ3NwZWNpYWwnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBEYXRlcyB3aXRob3V0IHByb3BlcnRpZXMgY2FuIGJlIHNob3J0Y3V0dGVkXG4gICAgaWYgKGlzRGF0ZSh2YWx1ZSkgJiYga2V5cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBzdHlsaXplKHZhbHVlLnRvVVRDU3RyaW5nKCksICdkYXRlJyk7XG4gICAgfVxuXG4gICAgdmFyIGJhc2UsIHR5cGUsIGJyYWNlcztcbiAgICAvLyBEZXRlcm1pbmUgdGhlIG9iamVjdCB0eXBlXG4gICAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgICB0eXBlID0gJ0FycmF5JztcbiAgICAgIGJyYWNlcyA9IFsnWycsICddJ107XG4gICAgfSBlbHNlIHtcbiAgICAgIHR5cGUgPSAnT2JqZWN0JztcbiAgICAgIGJyYWNlcyA9IFsneycsICd9J107XG4gICAgfVxuXG4gICAgLy8gTWFrZSBmdW5jdGlvbnMgc2F5IHRoYXQgdGhleSBhcmUgZnVuY3Rpb25zXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdmFyIG4gPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICAgIGJhc2UgPSAoaXNSZWdFeHAodmFsdWUpKSA/ICcgJyArIHZhbHVlIDogJyBbRnVuY3Rpb24nICsgbiArICddJztcbiAgICB9IGVsc2Uge1xuICAgICAgYmFzZSA9ICcnO1xuICAgIH1cblxuICAgIC8vIE1ha2UgZGF0ZXMgd2l0aCBwcm9wZXJ0aWVzIGZpcnN0IHNheSB0aGUgZGF0ZVxuICAgIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgICBiYXNlID0gJyAnICsgdmFsdWUudG9VVENTdHJpbmcoKTtcbiAgICB9XG5cbiAgICBpZiAoa2V5cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBicmFjZXNbMF0gKyBiYXNlICsgYnJhY2VzWzFdO1xuICAgIH1cblxuICAgIGlmIChyZWN1cnNlVGltZXMgPCAwKSB7XG4gICAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBzdHlsaXplKCcnICsgdmFsdWUsICdyZWdleHAnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBzdHlsaXplKCdbT2JqZWN0XScsICdzcGVjaWFsJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2Vlbi5wdXNoKHZhbHVlKTtcblxuICAgIHZhciBvdXRwdXQgPSBrZXlzLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICAgIHZhciBuYW1lLCBzdHI7XG4gICAgICBpZiAodmFsdWUuX19sb29rdXBHZXR0ZXJfXykge1xuICAgICAgICBpZiAodmFsdWUuX19sb29rdXBHZXR0ZXJfXyhrZXkpKSB7XG4gICAgICAgICAgaWYgKHZhbHVlLl9fbG9va3VwU2V0dGVyX18oa2V5KSkge1xuICAgICAgICAgICAgc3RyID0gc3R5bGl6ZSgnW0dldHRlci9TZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RyID0gc3R5bGl6ZSgnW0dldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAodmFsdWUuX19sb29rdXBTZXR0ZXJfXyhrZXkpKSB7XG4gICAgICAgICAgICBzdHIgPSBzdHlsaXplKCdbU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodmlzaWJsZV9rZXlzLmluZGV4T2Yoa2V5KSA8IDApIHtcbiAgICAgICAgbmFtZSA9ICdbJyArIGtleSArICddJztcbiAgICAgIH1cbiAgICAgIGlmICghc3RyKSB7XG4gICAgICAgIGlmIChzZWVuLmluZGV4T2YodmFsdWVba2V5XSkgPCAwKSB7XG4gICAgICAgICAgaWYgKHJlY3Vyc2VUaW1lcyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgc3RyID0gZm9ybWF0KHZhbHVlW2tleV0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdHIgPSBmb3JtYXQodmFsdWVba2V5XSwgcmVjdXJzZVRpbWVzIC0gMSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChzdHIuaW5kZXhPZignXFxuJykgPiAtMSkge1xuICAgICAgICAgICAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICAgIHN0ciA9IHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJyAgJyArIGxpbmU7XG4gICAgICAgICAgICAgIH0pLmpvaW4oJ1xcbicpLnN1YnN0cigyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHN0ciA9ICdcXG4nICsgc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnICAgJyArIGxpbmU7XG4gICAgICAgICAgICAgIH0pLmpvaW4oJ1xcbicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdHIgPSBzdHlsaXplKCdbQ2lyY3VsYXJdJywgJ3NwZWNpYWwnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBuYW1lID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBpZiAodHlwZSA9PT0gJ0FycmF5JyAmJiBrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICAgICAgcmV0dXJuIHN0cjtcbiAgICAgICAgfVxuICAgICAgICBuYW1lID0gSlNPTi5zdHJpbmdpZnkoJycgKyBrZXkpO1xuICAgICAgICBpZiAobmFtZS5tYXRjaCgvXlwiKFthLXpBLVpfXVthLXpBLVpfMC05XSopXCIkLykpIHtcbiAgICAgICAgICBuYW1lID0gbmFtZS5zdWJzdHIoMSwgbmFtZS5sZW5ndGggLSAyKTtcbiAgICAgICAgICBuYW1lID0gc3R5bGl6ZShuYW1lLCAnbmFtZScpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKVxuICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyheXCJ8XCIkKS9nLCBcIidcIik7XG4gICAgICAgICAgbmFtZSA9IHN0eWxpemUobmFtZSwgJ3N0cmluZycpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuYW1lICsgJzogJyArIHN0cjtcbiAgICB9KTtcblxuICAgIHNlZW4ucG9wKCk7XG5cbiAgICB2YXIgbnVtTGluZXNFc3QgPSAwO1xuICAgIHZhciBsZW5ndGggPSBvdXRwdXQucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGN1cikge1xuICAgICAgbnVtTGluZXNFc3QrKztcbiAgICAgIGlmIChjdXIuaW5kZXhPZignXFxuJykgPj0gMCkgbnVtTGluZXNFc3QrKztcbiAgICAgIHJldHVybiBwcmV2ICsgY3VyLmxlbmd0aCArIDE7XG4gICAgfSwgMCk7XG5cbiAgICBpZiAobGVuZ3RoID4gNTApIHtcbiAgICAgIG91dHB1dCA9IGJyYWNlc1swXSArXG4gICAgICAgICAgICAgICAoYmFzZSA9PT0gJycgPyAnJyA6IGJhc2UgKyAnXFxuICcpICtcbiAgICAgICAgICAgICAgICcgJyArXG4gICAgICAgICAgICAgICBvdXRwdXQuam9pbignLFxcbiAgJykgK1xuICAgICAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgICAgIGJyYWNlc1sxXTtcblxuICAgIH0gZWxzZSB7XG4gICAgICBvdXRwdXQgPSBicmFjZXNbMF0gKyBiYXNlICsgJyAnICsgb3V0cHV0LmpvaW4oJywgJykgKyAnICcgKyBicmFjZXNbMV07XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfVxuICByZXR1cm4gZm9ybWF0KG9iaiwgKHR5cGVvZiBkZXB0aCA9PT0gJ3VuZGVmaW5lZCcgPyAyIDogZGVwdGgpKTtcbn07XG5cblxuZnVuY3Rpb24gaXNBcnJheShhcikge1xuICByZXR1cm4gYXIgaW5zdGFuY2VvZiBBcnJheSB8fFxuICAgICAgICAgQXJyYXkuaXNBcnJheShhcikgfHxcbiAgICAgICAgIChhciAmJiBhciAhPT0gT2JqZWN0LnByb3RvdHlwZSAmJiBpc0FycmF5KGFyLl9fcHJvdG9fXykpO1xufVxuXG5cbmZ1bmN0aW9uIGlzUmVnRXhwKHJlKSB7XG4gIHJldHVybiByZSBpbnN0YW5jZW9mIFJlZ0V4cCB8fFxuICAgICh0eXBlb2YgcmUgPT09ICdvYmplY3QnICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChyZSkgPT09ICdbb2JqZWN0IFJlZ0V4cF0nKTtcbn1cblxuXG5mdW5jdGlvbiBpc0RhdGUoZCkge1xuICBpZiAoZCBpbnN0YW5jZW9mIERhdGUpIHJldHVybiB0cnVlO1xuICBpZiAodHlwZW9mIGQgIT09ICdvYmplY3QnKSByZXR1cm4gZmFsc2U7XG4gIHZhciBwcm9wZXJ0aWVzID0gRGF0ZS5wcm90b3R5cGUgJiYgT2JqZWN0X2dldE93blByb3BlcnR5TmFtZXMoRGF0ZS5wcm90b3R5cGUpO1xuICB2YXIgcHJvdG8gPSBkLl9fcHJvdG9fXyAmJiBPYmplY3RfZ2V0T3duUHJvcGVydHlOYW1lcyhkLl9fcHJvdG9fXyk7XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeShwcm90bykgPT09IEpTT04uc3RyaW5naWZ5KHByb3BlcnRpZXMpO1xufVxuXG5mdW5jdGlvbiBwYWQobikge1xuICByZXR1cm4gbiA8IDEwID8gJzAnICsgbi50b1N0cmluZygxMCkgOiBuLnRvU3RyaW5nKDEwKTtcbn1cblxudmFyIG1vbnRocyA9IFsnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nLCAnSnVsJywgJ0F1ZycsICdTZXAnLFxuICAgICAgICAgICAgICAnT2N0JywgJ05vdicsICdEZWMnXTtcblxuLy8gMjYgRmViIDE2OjE5OjM0XG5mdW5jdGlvbiB0aW1lc3RhbXAoKSB7XG4gIHZhciBkID0gbmV3IERhdGUoKTtcbiAgdmFyIHRpbWUgPSBbcGFkKGQuZ2V0SG91cnMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldE1pbnV0ZXMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldFNlY29uZHMoKSldLmpvaW4oJzonKTtcbiAgcmV0dXJuIFtkLmdldERhdGUoKSwgbW9udGhzW2QuZ2V0TW9udGgoKV0sIHRpbWVdLmpvaW4oJyAnKTtcbn1cblxuZXhwb3J0cy5sb2cgPSBmdW5jdGlvbiAobXNnKSB7fTtcblxuZXhwb3J0cy5wdW1wID0gbnVsbDtcblxudmFyIE9iamVjdF9rZXlzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24gKG9iaikge1xuICAgIHZhciByZXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSByZXMucHVzaChrZXkpO1xuICAgIHJldHVybiByZXM7XG59O1xuXG52YXIgT2JqZWN0X2dldE93blByb3BlcnR5TmFtZXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyB8fCBmdW5jdGlvbiAob2JqKSB7XG4gICAgdmFyIHJlcyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgICAgaWYgKE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgcmVzLnB1c2goa2V5KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbn07XG5cbnZhciBPYmplY3RfY3JlYXRlID0gT2JqZWN0LmNyZWF0ZSB8fCBmdW5jdGlvbiAocHJvdG90eXBlLCBwcm9wZXJ0aWVzKSB7XG4gICAgLy8gZnJvbSBlczUtc2hpbVxuICAgIHZhciBvYmplY3Q7XG4gICAgaWYgKHByb3RvdHlwZSA9PT0gbnVsbCkge1xuICAgICAgICBvYmplY3QgPSB7ICdfX3Byb3RvX18nIDogbnVsbCB9O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYgKHR5cGVvZiBwcm90b3R5cGUgIT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgICAgICAgICd0eXBlb2YgcHJvdG90eXBlWycgKyAodHlwZW9mIHByb3RvdHlwZSkgKyAnXSAhPSBcXCdvYmplY3RcXCcnXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHZhciBUeXBlID0gZnVuY3Rpb24gKCkge307XG4gICAgICAgIFR5cGUucHJvdG90eXBlID0gcHJvdG90eXBlO1xuICAgICAgICBvYmplY3QgPSBuZXcgVHlwZSgpO1xuICAgICAgICBvYmplY3QuX19wcm90b19fID0gcHJvdG90eXBlO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICd1bmRlZmluZWQnICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKG9iamVjdCwgcHJvcGVydGllcyk7XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Q7XG59O1xuXG5leHBvcnRzLmluaGVyaXRzID0gZnVuY3Rpb24oY3Rvciwgc3VwZXJDdG9yKSB7XG4gIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yO1xuICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdF9jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICB2YWx1ZTogY3RvcixcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9XG4gIH0pO1xufTtcblxudmFyIGZvcm1hdFJlZ0V4cCA9IC8lW3NkaiVdL2c7XG5leHBvcnRzLmZvcm1hdCA9IGZ1bmN0aW9uKGYpIHtcbiAgaWYgKHR5cGVvZiBmICE9PSAnc3RyaW5nJykge1xuICAgIHZhciBvYmplY3RzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIG9iamVjdHMucHVzaChleHBvcnRzLmluc3BlY3QoYXJndW1lbnRzW2ldKSk7XG4gICAgfVxuICAgIHJldHVybiBvYmplY3RzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIHZhciBpID0gMTtcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gIHZhciBsZW4gPSBhcmdzLmxlbmd0aDtcbiAgdmFyIHN0ciA9IFN0cmluZyhmKS5yZXBsYWNlKGZvcm1hdFJlZ0V4cCwgZnVuY3Rpb24oeCkge1xuICAgIGlmICh4ID09PSAnJSUnKSByZXR1cm4gJyUnO1xuICAgIGlmIChpID49IGxlbikgcmV0dXJuIHg7XG4gICAgc3dpdGNoICh4KSB7XG4gICAgICBjYXNlICclcyc6IHJldHVybiBTdHJpbmcoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVkJzogcmV0dXJuIE51bWJlcihhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWonOiByZXR1cm4gSlNPTi5zdHJpbmdpZnkoYXJnc1tpKytdKTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiB4O1xuICAgIH1cbiAgfSk7XG4gIGZvcih2YXIgeCA9IGFyZ3NbaV07IGkgPCBsZW47IHggPSBhcmdzWysraV0pe1xuICAgIGlmICh4ID09PSBudWxsIHx8IHR5cGVvZiB4ICE9PSAnb2JqZWN0Jykge1xuICAgICAgc3RyICs9ICcgJyArIHg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciArPSAnICcgKyBleHBvcnRzLmluc3BlY3QoeCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBzdHI7XG59O1xuXG59LHtcImV2ZW50c1wiOjR9XSw1OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmV4cG9ydHMucmVhZElFRUU3NTQgPSBmdW5jdGlvbihidWZmZXIsIG9mZnNldCwgaXNCRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtLFxuICAgICAgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMSxcbiAgICAgIGVNYXggPSAoMSA8PCBlTGVuKSAtIDEsXG4gICAgICBlQmlhcyA9IGVNYXggPj4gMSxcbiAgICAgIG5CaXRzID0gLTcsXG4gICAgICBpID0gaXNCRSA/IDAgOiAobkJ5dGVzIC0gMSksXG4gICAgICBkID0gaXNCRSA/IDEgOiAtMSxcbiAgICAgIHMgPSBidWZmZXJbb2Zmc2V0ICsgaV07XG5cbiAgaSArPSBkO1xuXG4gIGUgPSBzICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpO1xuICBzID4+PSAoLW5CaXRzKTtcbiAgbkJpdHMgKz0gZUxlbjtcbiAgZm9yICg7IG5CaXRzID4gMDsgZSA9IGUgKiAyNTYgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCk7XG5cbiAgbSA9IGUgJiAoKDEgPDwgKC1uQml0cykpIC0gMSk7XG4gIGUgPj49ICgtbkJpdHMpO1xuICBuQml0cyArPSBtTGVuO1xuICBmb3IgKDsgbkJpdHMgPiAwOyBtID0gbSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KTtcblxuICBpZiAoZSA9PT0gMCkge1xuICAgIGUgPSAxIC0gZUJpYXM7XG4gIH0gZWxzZSBpZiAoZSA9PT0gZU1heCkge1xuICAgIHJldHVybiBtID8gTmFOIDogKChzID8gLTEgOiAxKSAqIEluZmluaXR5KTtcbiAgfSBlbHNlIHtcbiAgICBtID0gbSArIE1hdGgucG93KDIsIG1MZW4pO1xuICAgIGUgPSBlIC0gZUJpYXM7XG4gIH1cbiAgcmV0dXJuIChzID8gLTEgOiAxKSAqIG0gKiBNYXRoLnBvdygyLCBlIC0gbUxlbik7XG59O1xuXG5leHBvcnRzLndyaXRlSUVFRTc1NCA9IGZ1bmN0aW9uKGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNCRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtLCBjLFxuICAgICAgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMSxcbiAgICAgIGVNYXggPSAoMSA8PCBlTGVuKSAtIDEsXG4gICAgICBlQmlhcyA9IGVNYXggPj4gMSxcbiAgICAgIHJ0ID0gKG1MZW4gPT09IDIzID8gTWF0aC5wb3coMiwgLTI0KSAtIE1hdGgucG93KDIsIC03NykgOiAwKSxcbiAgICAgIGkgPSBpc0JFID8gKG5CeXRlcyAtIDEpIDogMCxcbiAgICAgIGQgPSBpc0JFID8gLTEgOiAxLFxuICAgICAgcyA9IHZhbHVlIDwgMCB8fCAodmFsdWUgPT09IDAgJiYgMSAvIHZhbHVlIDwgMCkgPyAxIDogMDtcblxuICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKTtcblxuICBpZiAoaXNOYU4odmFsdWUpIHx8IHZhbHVlID09PSBJbmZpbml0eSkge1xuICAgIG0gPSBpc05hTih2YWx1ZSkgPyAxIDogMDtcbiAgICBlID0gZU1heDtcbiAgfSBlbHNlIHtcbiAgICBlID0gTWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLkxOMik7XG4gICAgaWYgKHZhbHVlICogKGMgPSBNYXRoLnBvdygyLCAtZSkpIDwgMSkge1xuICAgICAgZS0tO1xuICAgICAgYyAqPSAyO1xuICAgIH1cbiAgICBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIHZhbHVlICs9IHJ0IC8gYztcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgKz0gcnQgKiBNYXRoLnBvdygyLCAxIC0gZUJpYXMpO1xuICAgIH1cbiAgICBpZiAodmFsdWUgKiBjID49IDIpIHtcbiAgICAgIGUrKztcbiAgICAgIGMgLz0gMjtcbiAgICB9XG5cbiAgICBpZiAoZSArIGVCaWFzID49IGVNYXgpIHtcbiAgICAgIG0gPSAwO1xuICAgICAgZSA9IGVNYXg7XG4gICAgfSBlbHNlIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgbSA9ICh2YWx1ZSAqIGMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pO1xuICAgICAgZSA9IGUgKyBlQmlhcztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IHZhbHVlICogTWF0aC5wb3coMiwgZUJpYXMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pO1xuICAgICAgZSA9IDA7XG4gICAgfVxuICB9XG5cbiAgZm9yICg7IG1MZW4gPj0gODsgYnVmZmVyW29mZnNldCArIGldID0gbSAmIDB4ZmYsIGkgKz0gZCwgbSAvPSAyNTYsIG1MZW4gLT0gOCk7XG5cbiAgZSA9IChlIDw8IG1MZW4pIHwgbTtcbiAgZUxlbiArPSBtTGVuO1xuICBmb3IgKDsgZUxlbiA+IDA7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IGUgJiAweGZmLCBpICs9IGQsIGUgLz0gMjU2LCBlTGVuIC09IDgpO1xuXG4gIGJ1ZmZlcltvZmZzZXQgKyBpIC0gZF0gfD0gcyAqIDEyODtcbn07XG5cbn0se31dLDY6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxucHJvY2Vzcy5uZXh0VGljayA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhblNldEltbWVkaWF0ZSA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnNldEltbWVkaWF0ZTtcbiAgICB2YXIgY2FuUG9zdCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnBvc3RNZXNzYWdlICYmIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyXG4gICAgO1xuXG4gICAgaWYgKGNhblNldEltbWVkaWF0ZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIHdpbmRvdy5zZXRJbW1lZGlhdGUoZikgfTtcbiAgICB9XG5cbiAgICBpZiAoY2FuUG9zdCkge1xuICAgICAgICB2YXIgcXVldWUgPSBbXTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIGlmIChldi5zb3VyY2UgPT09IHdpbmRvdyAmJiBldi5kYXRhID09PSAncHJvY2Vzcy10aWNrJykge1xuICAgICAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGlmIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmbiA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgICAgIHF1ZXVlLnB1c2goZm4pO1xuICAgICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKCdwcm9jZXNzLXRpY2snLCAnKicpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICBzZXRUaW1lb3V0KGZuLCAwKTtcbiAgICB9O1xufSkoKTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufVxuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbn0se31dLDQ6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuKGZ1bmN0aW9uKHByb2Nlc3Mpe2lmICghcHJvY2Vzcy5FdmVudEVtaXR0ZXIpIHByb2Nlc3MuRXZlbnRFbWl0dGVyID0gZnVuY3Rpb24gKCkge307XG5cbnZhciBFdmVudEVtaXR0ZXIgPSBleHBvcnRzLkV2ZW50RW1pdHRlciA9IHByb2Nlc3MuRXZlbnRFbWl0dGVyO1xudmFyIGlzQXJyYXkgPSB0eXBlb2YgQXJyYXkuaXNBcnJheSA9PT0gJ2Z1bmN0aW9uJ1xuICAgID8gQXJyYXkuaXNBcnJheVxuICAgIDogZnVuY3Rpb24gKHhzKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeHMpID09PSAnW29iamVjdCBBcnJheV0nXG4gICAgfVxuO1xuZnVuY3Rpb24gaW5kZXhPZiAoeHMsIHgpIHtcbiAgICBpZiAoeHMuaW5kZXhPZikgcmV0dXJuIHhzLmluZGV4T2YoeCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoeCA9PT0geHNbaV0pIHJldHVybiBpO1xuICAgIH1cbiAgICByZXR1cm4gLTE7XG59XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW5cbi8vIDEwIGxpc3RlbmVycyBhcmUgYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaFxuLy8gaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG4vL1xuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbnZhciBkZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCF0aGlzLl9ldmVudHMpIHRoaXMuX2V2ZW50cyA9IHt9O1xuICB0aGlzLl9ldmVudHMubWF4TGlzdGVuZXJzID0gbjtcbn07XG5cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNBcnJheSh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSlcbiAgICB7XG4gICAgICBpZiAoYXJndW1lbnRzWzFdIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgYXJndW1lbnRzWzFdOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5jYXVnaHQsIHVuc3BlY2lmaWVkICdlcnJvcicgZXZlbnQuXCIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGlmICghdGhpcy5fZXZlbnRzKSByZXR1cm4gZmFsc2U7XG4gIHZhciBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBpZiAoIWhhbmRsZXIpIHJldHVybiBmYWxzZTtcblxuICBpZiAodHlwZW9mIGhhbmRsZXIgPT0gJ2Z1bmN0aW9uJykge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuXG4gIH0gZWxzZSBpZiAoaXNBcnJheShoYW5kbGVyKSkge1xuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICAgIHZhciBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBsaXN0ZW5lcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59O1xuXG4vLyBFdmVudEVtaXR0ZXIgaXMgZGVmaW5lZCBpbiBzcmMvbm9kZV9ldmVudHMuY2Ncbi8vIEV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCgpIGlzIGFsc28gZGVmaW5lZCB0aGVyZS5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIGxpc3RlbmVyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdhZGRMaXN0ZW5lciBvbmx5IHRha2VzIGluc3RhbmNlcyBvZiBGdW5jdGlvbicpO1xuICB9XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT0gXCJuZXdMaXN0ZW5lcnNcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJzXCIuXG4gIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pIHtcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgfSBlbHNlIGlmIChpc0FycmF5KHRoaXMuX2V2ZW50c1t0eXBlXSkpIHtcblxuICAgIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gICAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgICB2YXIgbTtcbiAgICAgIGlmICh0aGlzLl9ldmVudHMubWF4TGlzdGVuZXJzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbSA9IHRoaXMuX2V2ZW50cy5tYXhMaXN0ZW5lcnM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtID0gZGVmYXVsdE1heExpc3RlbmVycztcbiAgICAgIH1cblxuICAgICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHNlbGYub24odHlwZSwgZnVuY3Rpb24gZygpIHtcbiAgICBzZWxmLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0pO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICgnZnVuY3Rpb24nICE9PSB0eXBlb2YgbGlzdGVuZXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3JlbW92ZUxpc3RlbmVyIG9ubHkgdGFrZXMgaW5zdGFuY2VzIG9mIEZ1bmN0aW9uJyk7XG4gIH1cblxuICAvLyBkb2VzIG5vdCB1c2UgbGlzdGVuZXJzKCksIHNvIG5vIHNpZGUgZWZmZWN0IG9mIGNyZWF0aW5nIF9ldmVudHNbdHlwZV1cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSkgcmV0dXJuIHRoaXM7XG5cbiAgdmFyIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzQXJyYXkobGlzdCkpIHtcbiAgICB2YXIgaSA9IGluZGV4T2YobGlzdCwgbGlzdGVuZXIpO1xuICAgIGlmIChpIDwgMCkgcmV0dXJuIHRoaXM7XG4gICAgbGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgaWYgKGxpc3QubGVuZ3RoID09IDApXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICB9IGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSA9PT0gbGlzdGVuZXIpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGRvZXMgbm90IHVzZSBsaXN0ZW5lcnMoKSwgc28gbm8gc2lkZSBlZmZlY3Qgb2YgY3JlYXRpbmcgX2V2ZW50c1t0eXBlXVxuICBpZiAodHlwZSAmJiB0aGlzLl9ldmVudHMgJiYgdGhpcy5fZXZlbnRzW3R5cGVdKSB0aGlzLl9ldmVudHNbdHlwZV0gPSBudWxsO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICBpZiAoIXRoaXMuX2V2ZW50cykgdGhpcy5fZXZlbnRzID0ge307XG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKSB0aGlzLl9ldmVudHNbdHlwZV0gPSBbXTtcbiAgaWYgKCFpc0FycmF5KHRoaXMuX2V2ZW50c1t0eXBlXSkpIHtcbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgfVxuICByZXR1cm4gdGhpcy5fZXZlbnRzW3R5cGVdO1xufTtcblxufSkocmVxdWlyZShcIl9fYnJvd3NlcmlmeV9wcm9jZXNzXCIpKVxufSx7XCJfX2Jyb3dzZXJpZnlfcHJvY2Vzc1wiOjZ9XSxcImJ1ZmZlci1icm93c2VyaWZ5XCI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xubW9kdWxlLmV4cG9ydHM9cmVxdWlyZSgncTlUeENDJyk7XG59LHt9XSxcInE5VHhDQ1wiOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmZ1bmN0aW9uIFNsb3dCdWZmZXIgKHNpemUpIHtcbiAgICB0aGlzLmxlbmd0aCA9IHNpemU7XG59O1xuXG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0Jyk7XG5cbmV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMgPSA1MDtcblxuXG5mdW5jdGlvbiB0b0hleChuKSB7XG4gIGlmIChuIDwgMTYpIHJldHVybiAnMCcgKyBuLnRvU3RyaW5nKDE2KTtcbiAgcmV0dXJuIG4udG9TdHJpbmcoMTYpO1xufVxuXG5mdW5jdGlvbiB1dGY4VG9CeXRlcyhzdHIpIHtcbiAgdmFyIGJ5dGVBcnJheSA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKylcbiAgICBpZiAoc3RyLmNoYXJDb2RlQXQoaSkgPD0gMHg3RilcbiAgICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpKTtcbiAgICBlbHNlIHtcbiAgICAgIHZhciBoID0gZW5jb2RlVVJJQ29tcG9uZW50KHN0ci5jaGFyQXQoaSkpLnN1YnN0cigxKS5zcGxpdCgnJScpO1xuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBoLmxlbmd0aDsgaisrKVxuICAgICAgICBieXRlQXJyYXkucHVzaChwYXJzZUludChoW2pdLCAxNikpO1xuICAgIH1cblxuICByZXR1cm4gYnl0ZUFycmF5O1xufVxuXG5mdW5jdGlvbiBhc2NpaVRvQnl0ZXMoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKyApXG4gICAgLy8gTm9kZSdzIGNvZGUgc2VlbXMgdG8gYmUgZG9pbmcgdGhpcyBhbmQgbm90ICYgMHg3Ri4uXG4gICAgYnl0ZUFycmF5LnB1c2goIHN0ci5jaGFyQ29kZUF0KGkpICYgMHhGRiApO1xuXG4gIHJldHVybiBieXRlQXJyYXk7XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFRvQnl0ZXMoc3RyKSB7XG4gIHJldHVybiByZXF1aXJlKFwiYmFzZTY0LWpzXCIpLnRvQnl0ZUFycmF5KHN0cik7XG59XG5cblNsb3dCdWZmZXIuYnl0ZUxlbmd0aCA9IGZ1bmN0aW9uIChzdHIsIGVuY29kaW5nKSB7XG4gIHN3aXRjaCAoZW5jb2RpbmcgfHwgXCJ1dGY4XCIpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0dXJuIHN0ci5sZW5ndGggLyAyO1xuXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0dXJuIHV0ZjhUb0J5dGVzKHN0cikubGVuZ3RoO1xuXG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICByZXR1cm4gc3RyLmxlbmd0aDtcblxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICByZXR1cm4gYmFzZTY0VG9CeXRlcyhzdHIpLmxlbmd0aDtcblxuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gYmxpdEJ1ZmZlcihzcmMsIGRzdCwgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIHBvcywgaSA9IDA7XG4gIHdoaWxlIChpIDwgbGVuZ3RoKSB7XG4gICAgaWYgKChpK29mZnNldCA+PSBkc3QubGVuZ3RoKSB8fCAoaSA+PSBzcmMubGVuZ3RoKSlcbiAgICAgIGJyZWFrO1xuXG4gICAgZHN0W2kgKyBvZmZzZXRdID0gc3JjW2ldO1xuICAgIGkrKztcbiAgfVxuICByZXR1cm4gaTtcbn1cblxuU2xvd0J1ZmZlci5wcm90b3R5cGUudXRmOFdyaXRlID0gZnVuY3Rpb24gKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGJ5dGVzLCBwb3M7XG4gIHJldHVybiBTbG93QnVmZmVyLl9jaGFyc1dyaXR0ZW4gPSAgYmxpdEJ1ZmZlcih1dGY4VG9CeXRlcyhzdHJpbmcpLCB0aGlzLCBvZmZzZXQsIGxlbmd0aCk7XG59O1xuXG5TbG93QnVmZmVyLnByb3RvdHlwZS5hc2NpaVdyaXRlID0gZnVuY3Rpb24gKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGJ5dGVzLCBwb3M7XG4gIHJldHVybiBTbG93QnVmZmVyLl9jaGFyc1dyaXR0ZW4gPSAgYmxpdEJ1ZmZlcihhc2NpaVRvQnl0ZXMoc3RyaW5nKSwgdGhpcywgb2Zmc2V0LCBsZW5ndGgpO1xufTtcblxuU2xvd0J1ZmZlci5wcm90b3R5cGUuYmluYXJ5V3JpdGUgPSBTbG93QnVmZmVyLnByb3RvdHlwZS5hc2NpaVdyaXRlO1xuXG5TbG93QnVmZmVyLnByb3RvdHlwZS5iYXNlNjRXcml0ZSA9IGZ1bmN0aW9uIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBieXRlcywgcG9zO1xuICByZXR1cm4gU2xvd0J1ZmZlci5fY2hhcnNXcml0dGVuID0gYmxpdEJ1ZmZlcihiYXNlNjRUb0J5dGVzKHN0cmluZyksIHRoaXMsIG9mZnNldCwgbGVuZ3RoKTtcbn07XG5cblNsb3dCdWZmZXIucHJvdG90eXBlLmJhc2U2NFNsaWNlID0gZnVuY3Rpb24gKHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGJ5dGVzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgcmV0dXJuIHJlcXVpcmUoXCJiYXNlNjQtanNcIikuZnJvbUJ5dGVBcnJheShieXRlcyk7XG59XG5cbmZ1bmN0aW9uIGRlY29kZVV0ZjhDaGFyKHN0cikge1xuICB0cnkge1xuICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoc3RyKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoMHhGRkZEKTsgLy8gVVRGIDggaW52YWxpZCBjaGFyXG4gIH1cbn1cblxuU2xvd0J1ZmZlci5wcm90b3R5cGUudXRmOFNsaWNlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgYnl0ZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgdmFyIHJlcyA9IFwiXCI7XG4gIHZhciB0bXAgPSBcIlwiO1xuICB2YXIgaSA9IDA7XG4gIHdoaWxlIChpIDwgYnl0ZXMubGVuZ3RoKSB7XG4gICAgaWYgKGJ5dGVzW2ldIDw9IDB4N0YpIHtcbiAgICAgIHJlcyArPSBkZWNvZGVVdGY4Q2hhcih0bXApICsgU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSk7XG4gICAgICB0bXAgPSBcIlwiO1xuICAgIH0gZWxzZVxuICAgICAgdG1wICs9IFwiJVwiICsgYnl0ZXNbaV0udG9TdHJpbmcoMTYpO1xuXG4gICAgaSsrO1xuICB9XG5cbiAgcmV0dXJuIHJlcyArIGRlY29kZVV0ZjhDaGFyKHRtcCk7XG59XG5cblNsb3dCdWZmZXIucHJvdG90eXBlLmFzY2lpU2xpY2UgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBieXRlcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB2YXIgcmV0ID0gXCJcIjtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkrKylcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSk7XG4gIHJldHVybiByZXQ7XG59XG5cblNsb3dCdWZmZXIucHJvdG90eXBlLmJpbmFyeVNsaWNlID0gU2xvd0J1ZmZlci5wcm90b3R5cGUuYXNjaWlTbGljZTtcblxuU2xvd0J1ZmZlci5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgb3V0ID0gW10sXG4gICAgICBsZW4gPSB0aGlzLmxlbmd0aDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIG91dFtpXSA9IHRvSGV4KHRoaXNbaV0pO1xuICAgIGlmIChpID09IGV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMpIHtcbiAgICAgIG91dFtpICsgMV0gPSAnLi4uJztcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gJzxTbG93QnVmZmVyICcgKyBvdXQuam9pbignICcpICsgJz4nO1xufTtcblxuXG5TbG93QnVmZmVyLnByb3RvdHlwZS5oZXhTbGljZSA9IGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoO1xuXG4gIGlmICghc3RhcnQgfHwgc3RhcnQgPCAwKSBzdGFydCA9IDA7XG4gIGlmICghZW5kIHx8IGVuZCA8IDAgfHwgZW5kID4gbGVuKSBlbmQgPSBsZW47XG5cbiAgdmFyIG91dCA9ICcnO1xuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIG91dCArPSB0b0hleCh0aGlzW2ldKTtcbiAgfVxuICByZXR1cm4gb3V0O1xufTtcblxuXG5TbG93QnVmZmVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKGVuY29kaW5nLCBzdGFydCwgZW5kKSB7XG4gIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nIHx8ICd1dGY4JykudG9Mb3dlckNhc2UoKTtcbiAgc3RhcnQgPSArc3RhcnQgfHwgMDtcbiAgaWYgKHR5cGVvZiBlbmQgPT0gJ3VuZGVmaW5lZCcpIGVuZCA9IHRoaXMubGVuZ3RoO1xuXG4gIC8vIEZhc3RwYXRoIGVtcHR5IHN0cmluZ3NcbiAgaWYgKCtlbmQgPT0gc3RhcnQpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldHVybiB0aGlzLmhleFNsaWNlKHN0YXJ0LCBlbmQpO1xuXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0dXJuIHRoaXMudXRmOFNsaWNlKHN0YXJ0LCBlbmQpO1xuXG4gICAgY2FzZSAnYXNjaWknOlxuICAgICAgcmV0dXJuIHRoaXMuYXNjaWlTbGljZShzdGFydCwgZW5kKTtcblxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICByZXR1cm4gdGhpcy5iaW5hcnlTbGljZShzdGFydCwgZW5kKTtcblxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICByZXR1cm4gdGhpcy5iYXNlNjRTbGljZShzdGFydCwgZW5kKTtcblxuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIHJldHVybiB0aGlzLnVjczJTbGljZShzdGFydCwgZW5kKTtcblxuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKTtcbiAgfVxufTtcblxuXG5TbG93QnVmZmVyLnByb3RvdHlwZS5oZXhXcml0ZSA9IGZ1bmN0aW9uKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgb2Zmc2V0ID0gK29mZnNldCB8fCAwO1xuICB2YXIgcmVtYWluaW5nID0gdGhpcy5sZW5ndGggLSBvZmZzZXQ7XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgbGVuZ3RoID0gcmVtYWluaW5nO1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9ICtsZW5ndGg7XG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nO1xuICAgIH1cbiAgfVxuXG4gIC8vIG11c3QgYmUgYW4gZXZlbiBudW1iZXIgb2YgZGlnaXRzXG4gIHZhciBzdHJMZW4gPSBzdHJpbmcubGVuZ3RoO1xuICBpZiAoc3RyTGVuICUgMikge1xuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBoZXggc3RyaW5nJyk7XG4gIH1cbiAgaWYgKGxlbmd0aCA+IHN0ckxlbiAvIDIpIHtcbiAgICBsZW5ndGggPSBzdHJMZW4gLyAyO1xuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYnl0ZSA9IHBhcnNlSW50KHN0cmluZy5zdWJzdHIoaSAqIDIsIDIpLCAxNik7XG4gICAgaWYgKGlzTmFOKGJ5dGUpKSB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgaGV4IHN0cmluZycpO1xuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSBieXRlO1xuICB9XG4gIFNsb3dCdWZmZXIuX2NoYXJzV3JpdHRlbiA9IGkgKiAyO1xuICByZXR1cm4gaTtcbn07XG5cblxuU2xvd0J1ZmZlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbihzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZykge1xuICAvLyBTdXBwb3J0IGJvdGggKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKVxuICAvLyBhbmQgdGhlIGxlZ2FjeSAoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0LCBsZW5ndGgpXG4gIGlmIChpc0Zpbml0ZShvZmZzZXQpKSB7XG4gICAgaWYgKCFpc0Zpbml0ZShsZW5ndGgpKSB7XG4gICAgICBlbmNvZGluZyA9IGxlbmd0aDtcbiAgICAgIGxlbmd0aCA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH0gZWxzZSB7ICAvLyBsZWdhY3lcbiAgICB2YXIgc3dhcCA9IGVuY29kaW5nO1xuICAgIGVuY29kaW5nID0gb2Zmc2V0O1xuICAgIG9mZnNldCA9IGxlbmd0aDtcbiAgICBsZW5ndGggPSBzd2FwO1xuICB9XG5cbiAgb2Zmc2V0ID0gK29mZnNldCB8fCAwO1xuICB2YXIgcmVtYWluaW5nID0gdGhpcy5sZW5ndGggLSBvZmZzZXQ7XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgbGVuZ3RoID0gcmVtYWluaW5nO1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9ICtsZW5ndGg7XG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nO1xuICAgIH1cbiAgfVxuICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKCk7XG5cbiAgc3dpdGNoIChlbmNvZGluZykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXR1cm4gdGhpcy5oZXhXcml0ZShzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKTtcblxuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldHVybiB0aGlzLnV0ZjhXcml0ZShzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKTtcblxuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIHJldHVybiB0aGlzLmFzY2lpV3JpdGUoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCk7XG5cbiAgICBjYXNlICdiaW5hcnknOlxuICAgICAgcmV0dXJuIHRoaXMuYmluYXJ5V3JpdGUoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCk7XG5cbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0dXJuIHRoaXMuYmFzZTY0V3JpdGUoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCk7XG5cbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgICByZXR1cm4gdGhpcy51Y3MyV3JpdGUoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCk7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJyk7XG4gIH1cbn07XG5cblxuLy8gc2xpY2Uoc3RhcnQsIGVuZClcblNsb3dCdWZmZXIucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICBpZiAoZW5kID09PSB1bmRlZmluZWQpIGVuZCA9IHRoaXMubGVuZ3RoO1xuXG4gIGlmIChlbmQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBFcnJvcignb29iJyk7XG4gIH1cbiAgaWYgKHN0YXJ0ID4gZW5kKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdvb2InKTtcbiAgfVxuXG4gIHJldHVybiBuZXcgQnVmZmVyKHRoaXMsIGVuZCAtIHN0YXJ0LCArc3RhcnQpO1xufTtcblxuU2xvd0J1ZmZlci5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uKHRhcmdldCwgdGFyZ2V0c3RhcnQsIHNvdXJjZXN0YXJ0LCBzb3VyY2VlbmQpIHtcbiAgdmFyIHRlbXAgPSBbXTtcbiAgZm9yICh2YXIgaT1zb3VyY2VzdGFydDsgaTxzb3VyY2VlbmQ7IGkrKykge1xuICAgIGFzc2VydC5vayh0eXBlb2YgdGhpc1tpXSAhPT0gJ3VuZGVmaW5lZCcsIFwiY29weWluZyB1bmRlZmluZWQgYnVmZmVyIGJ5dGVzIVwiKTtcbiAgICB0ZW1wLnB1c2godGhpc1tpXSk7XG4gIH1cblxuICBmb3IgKHZhciBpPXRhcmdldHN0YXJ0OyBpPHRhcmdldHN0YXJ0K3RlbXAubGVuZ3RoOyBpKyspIHtcbiAgICB0YXJnZXRbaV0gPSB0ZW1wW2ktdGFyZ2V0c3RhcnRdO1xuICB9XG59O1xuXG5TbG93QnVmZmVyLnByb3RvdHlwZS5maWxsID0gZnVuY3Rpb24odmFsdWUsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKGVuZCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdvb2InKTtcbiAgfVxuICBpZiAoc3RhcnQgPiBlbmQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ29vYicpO1xuICB9XG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICB0aGlzW2ldID0gdmFsdWU7XG4gIH1cbn1cblxuZnVuY3Rpb24gY29lcmNlKGxlbmd0aCkge1xuICAvLyBDb2VyY2UgbGVuZ3RoIHRvIGEgbnVtYmVyIChwb3NzaWJseSBOYU4pLCByb3VuZCB1cFxuICAvLyBpbiBjYXNlIGl0J3MgZnJhY3Rpb25hbCAoZS5nLiAxMjMuNDU2KSB0aGVuIGRvIGFcbiAgLy8gZG91YmxlIG5lZ2F0ZSB0byBjb2VyY2UgYSBOYU4gdG8gMC4gRWFzeSwgcmlnaHQ/XG4gIGxlbmd0aCA9IH5+TWF0aC5jZWlsKCtsZW5ndGgpO1xuICByZXR1cm4gbGVuZ3RoIDwgMCA/IDAgOiBsZW5ndGg7XG59XG5cblxuLy8gQnVmZmVyXG5cbmZ1bmN0aW9uIEJ1ZmZlcihzdWJqZWN0LCBlbmNvZGluZywgb2Zmc2V0KSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBCdWZmZXIpKSB7XG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoc3ViamVjdCwgZW5jb2RpbmcsIG9mZnNldCk7XG4gIH1cblxuICB2YXIgdHlwZTtcblxuICAvLyBBcmUgd2Ugc2xpY2luZz9cbiAgaWYgKHR5cGVvZiBvZmZzZXQgPT09ICdudW1iZXInKSB7XG4gICAgdGhpcy5sZW5ndGggPSBjb2VyY2UoZW5jb2RpbmcpO1xuICAgIHRoaXMucGFyZW50ID0gc3ViamVjdDtcbiAgICB0aGlzLm9mZnNldCA9IG9mZnNldDtcbiAgfSBlbHNlIHtcbiAgICAvLyBGaW5kIHRoZSBsZW5ndGhcbiAgICBzd2l0Y2ggKHR5cGUgPSB0eXBlb2Ygc3ViamVjdCkge1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgdGhpcy5sZW5ndGggPSBjb2VyY2Uoc3ViamVjdCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICB0aGlzLmxlbmd0aCA9IEJ1ZmZlci5ieXRlTGVuZ3RoKHN1YmplY3QsIGVuY29kaW5nKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ29iamVjdCc6IC8vIEFzc3VtZSBvYmplY3QgaXMgYW4gYXJyYXlcbiAgICAgICAgdGhpcy5sZW5ndGggPSBjb2VyY2Uoc3ViamVjdC5sZW5ndGgpO1xuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGaXJzdCBhcmd1bWVudCBuZWVkcyB0byBiZSBhIG51bWJlciwgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnYXJyYXkgb3Igc3RyaW5nLicpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmxlbmd0aCA+IEJ1ZmZlci5wb29sU2l6ZSkge1xuICAgICAgLy8gQmlnIGJ1ZmZlciwganVzdCBhbGxvYyBvbmUuXG4gICAgICB0aGlzLnBhcmVudCA9IG5ldyBTbG93QnVmZmVyKHRoaXMubGVuZ3RoKTtcbiAgICAgIHRoaXMub2Zmc2V0ID0gMDtcblxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBTbWFsbCBidWZmZXIuXG4gICAgICBpZiAoIXBvb2wgfHwgcG9vbC5sZW5ndGggLSBwb29sLnVzZWQgPCB0aGlzLmxlbmd0aCkgYWxsb2NQb29sKCk7XG4gICAgICB0aGlzLnBhcmVudCA9IHBvb2w7XG4gICAgICB0aGlzLm9mZnNldCA9IHBvb2wudXNlZDtcbiAgICAgIHBvb2wudXNlZCArPSB0aGlzLmxlbmd0aDtcbiAgICB9XG5cbiAgICAvLyBUcmVhdCBhcnJheS1pc2ggb2JqZWN0cyBhcyBhIGJ5dGUgYXJyYXkuXG4gICAgaWYgKGlzQXJyYXlJc2goc3ViamVjdCkpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoc3ViamVjdCBpbnN0YW5jZW9mIEJ1ZmZlcikge1xuICAgICAgICAgIHRoaXMucGFyZW50W2kgKyB0aGlzLm9mZnNldF0gPSBzdWJqZWN0LnJlYWRVSW50OChpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB0aGlzLnBhcmVudFtpICsgdGhpcy5vZmZzZXRdID0gc3ViamVjdFtpXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZSA9PSAnc3RyaW5nJykge1xuICAgICAgLy8gV2UgYXJlIGEgc3RyaW5nXG4gICAgICB0aGlzLmxlbmd0aCA9IHRoaXMud3JpdGUoc3ViamVjdCwgMCwgZW5jb2RpbmcpO1xuICAgIH1cbiAgfVxuXG59XG5cbmZ1bmN0aW9uIGlzQXJyYXlJc2goc3ViamVjdCkge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShzdWJqZWN0KSB8fCBCdWZmZXIuaXNCdWZmZXIoc3ViamVjdCkgfHxcbiAgICAgICAgIHN1YmplY3QgJiYgdHlwZW9mIHN1YmplY3QgPT09ICdvYmplY3QnICYmXG4gICAgICAgICB0eXBlb2Ygc3ViamVjdC5sZW5ndGggPT09ICdudW1iZXInO1xufVxuXG5leHBvcnRzLlNsb3dCdWZmZXIgPSBTbG93QnVmZmVyO1xuZXhwb3J0cy5CdWZmZXIgPSBCdWZmZXI7XG5cbkJ1ZmZlci5wb29sU2l6ZSA9IDggKiAxMDI0O1xudmFyIHBvb2w7XG5cbmZ1bmN0aW9uIGFsbG9jUG9vbCgpIHtcbiAgcG9vbCA9IG5ldyBTbG93QnVmZmVyKEJ1ZmZlci5wb29sU2l6ZSk7XG4gIHBvb2wudXNlZCA9IDA7XG59XG5cblxuLy8gU3RhdGljIG1ldGhvZHNcbkJ1ZmZlci5pc0J1ZmZlciA9IGZ1bmN0aW9uIGlzQnVmZmVyKGIpIHtcbiAgcmV0dXJuIGIgaW5zdGFuY2VvZiBCdWZmZXIgfHwgYiBpbnN0YW5jZW9mIFNsb3dCdWZmZXI7XG59O1xuXG5CdWZmZXIuY29uY2F0ID0gZnVuY3Rpb24gKGxpc3QsIHRvdGFsTGVuZ3RoKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShsaXN0KSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIlVzYWdlOiBCdWZmZXIuY29uY2F0KGxpc3QsIFt0b3RhbExlbmd0aF0pXFxuIFxcXG4gICAgICBsaXN0IHNob3VsZCBiZSBhbiBBcnJheS5cIik7XG4gIH1cblxuICBpZiAobGlzdC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcigwKTtcbiAgfSBlbHNlIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBsaXN0WzBdO1xuICB9XG5cbiAgaWYgKHR5cGVvZiB0b3RhbExlbmd0aCAhPT0gJ251bWJlcicpIHtcbiAgICB0b3RhbExlbmd0aCA9IDA7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgYnVmID0gbGlzdFtpXTtcbiAgICAgIHRvdGFsTGVuZ3RoICs9IGJ1Zi5sZW5ndGg7XG4gICAgfVxuICB9XG5cbiAgdmFyIGJ1ZmZlciA9IG5ldyBCdWZmZXIodG90YWxMZW5ndGgpO1xuICB2YXIgcG9zID0gMDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGJ1ZiA9IGxpc3RbaV07XG4gICAgYnVmLmNvcHkoYnVmZmVyLCBwb3MpO1xuICAgIHBvcyArPSBidWYubGVuZ3RoO1xuICB9XG4gIHJldHVybiBidWZmZXI7XG59O1xuXG4vLyBJbnNwZWN0XG5CdWZmZXIucHJvdG90eXBlLmluc3BlY3QgPSBmdW5jdGlvbiBpbnNwZWN0KCkge1xuICB2YXIgb3V0ID0gW10sXG4gICAgICBsZW4gPSB0aGlzLmxlbmd0aDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgb3V0W2ldID0gdG9IZXgodGhpcy5wYXJlbnRbaSArIHRoaXMub2Zmc2V0XSk7XG4gICAgaWYgKGkgPT0gZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUykge1xuICAgICAgb3V0W2kgKyAxXSA9ICcuLi4nO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuICc8QnVmZmVyICcgKyBvdXQuam9pbignICcpICsgJz4nO1xufTtcblxuXG5CdWZmZXIucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIGdldChpKSB7XG4gIGlmIChpIDwgMCB8fCBpID49IHRoaXMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ29vYicpO1xuICByZXR1cm4gdGhpcy5wYXJlbnRbdGhpcy5vZmZzZXQgKyBpXTtcbn07XG5cblxuQnVmZmVyLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiBzZXQoaSwgdikge1xuICBpZiAoaSA8IDAgfHwgaSA+PSB0aGlzLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKCdvb2InKTtcbiAgcmV0dXJuIHRoaXMucGFyZW50W3RoaXMub2Zmc2V0ICsgaV0gPSB2O1xufTtcblxuXG4vLyB3cml0ZShzdHJpbmcsIG9mZnNldCA9IDAsIGxlbmd0aCA9IGJ1ZmZlci5sZW5ndGgtb2Zmc2V0LCBlbmNvZGluZyA9ICd1dGY4JylcbkJ1ZmZlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbihzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZykge1xuICAvLyBTdXBwb3J0IGJvdGggKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKVxuICAvLyBhbmQgdGhlIGxlZ2FjeSAoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0LCBsZW5ndGgpXG4gIGlmIChpc0Zpbml0ZShvZmZzZXQpKSB7XG4gICAgaWYgKCFpc0Zpbml0ZShsZW5ndGgpKSB7XG4gICAgICBlbmNvZGluZyA9IGxlbmd0aDtcbiAgICAgIGxlbmd0aCA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH0gZWxzZSB7ICAvLyBsZWdhY3lcbiAgICB2YXIgc3dhcCA9IGVuY29kaW5nO1xuICAgIGVuY29kaW5nID0gb2Zmc2V0O1xuICAgIG9mZnNldCA9IGxlbmd0aDtcbiAgICBsZW5ndGggPSBzd2FwO1xuICB9XG5cbiAgb2Zmc2V0ID0gK29mZnNldCB8fCAwO1xuICB2YXIgcmVtYWluaW5nID0gdGhpcy5sZW5ndGggLSBvZmZzZXQ7XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgbGVuZ3RoID0gcmVtYWluaW5nO1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9ICtsZW5ndGg7XG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nO1xuICAgIH1cbiAgfVxuICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKCk7XG5cbiAgdmFyIHJldDtcbiAgc3dpdGNoIChlbmNvZGluZykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXQgPSB0aGlzLnBhcmVudC5oZXhXcml0ZShzdHJpbmcsIHRoaXMub2Zmc2V0ICsgb2Zmc2V0LCBsZW5ndGgpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSB0aGlzLnBhcmVudC51dGY4V3JpdGUoc3RyaW5nLCB0aGlzLm9mZnNldCArIG9mZnNldCwgbGVuZ3RoKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnYXNjaWknOlxuICAgICAgcmV0ID0gdGhpcy5wYXJlbnQuYXNjaWlXcml0ZShzdHJpbmcsIHRoaXMub2Zmc2V0ICsgb2Zmc2V0LCBsZW5ndGgpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdiaW5hcnknOlxuICAgICAgcmV0ID0gdGhpcy5wYXJlbnQuYmluYXJ5V3JpdGUoc3RyaW5nLCB0aGlzLm9mZnNldCArIG9mZnNldCwgbGVuZ3RoKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIC8vIFdhcm5pbmc6IG1heExlbmd0aCBub3QgdGFrZW4gaW50byBhY2NvdW50IGluIGJhc2U2NFdyaXRlXG4gICAgICByZXQgPSB0aGlzLnBhcmVudC5iYXNlNjRXcml0ZShzdHJpbmcsIHRoaXMub2Zmc2V0ICsgb2Zmc2V0LCBsZW5ndGgpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgICByZXQgPSB0aGlzLnBhcmVudC51Y3MyV3JpdGUoc3RyaW5nLCB0aGlzLm9mZnNldCArIG9mZnNldCwgbGVuZ3RoKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpO1xuICB9XG5cbiAgQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPSBTbG93QnVmZmVyLl9jaGFyc1dyaXR0ZW47XG5cbiAgcmV0dXJuIHJldDtcbn07XG5cblxuLy8gdG9TdHJpbmcoZW5jb2RpbmcsIHN0YXJ0PTAsIGVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKGVuY29kaW5nLCBzdGFydCwgZW5kKSB7XG4gIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nIHx8ICd1dGY4JykudG9Mb3dlckNhc2UoKTtcblxuICBpZiAodHlwZW9mIHN0YXJ0ID09ICd1bmRlZmluZWQnIHx8IHN0YXJ0IDwgMCkge1xuICAgIHN0YXJ0ID0gMDtcbiAgfSBlbHNlIGlmIChzdGFydCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgc3RhcnQgPSB0aGlzLmxlbmd0aDtcbiAgfVxuXG4gIGlmICh0eXBlb2YgZW5kID09ICd1bmRlZmluZWQnIHx8IGVuZCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgZW5kID0gdGhpcy5sZW5ndGg7XG4gIH0gZWxzZSBpZiAoZW5kIDwgMCkge1xuICAgIGVuZCA9IDA7XG4gIH1cblxuICBzdGFydCA9IHN0YXJ0ICsgdGhpcy5vZmZzZXQ7XG4gIGVuZCA9IGVuZCArIHRoaXMub2Zmc2V0O1xuXG4gIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmhleFNsaWNlKHN0YXJ0LCBlbmQpO1xuXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0dXJuIHRoaXMucGFyZW50LnV0ZjhTbGljZShzdGFydCwgZW5kKTtcblxuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIHJldHVybiB0aGlzLnBhcmVudC5hc2NpaVNsaWNlKHN0YXJ0LCBlbmQpO1xuXG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldHVybiB0aGlzLnBhcmVudC5iaW5hcnlTbGljZShzdGFydCwgZW5kKTtcblxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICByZXR1cm4gdGhpcy5wYXJlbnQuYmFzZTY0U2xpY2Uoc3RhcnQsIGVuZCk7XG5cbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgICByZXR1cm4gdGhpcy5wYXJlbnQudWNzMlNsaWNlKHN0YXJ0LCBlbmQpO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpO1xuICB9XG59O1xuXG5cbi8vIGJ5dGVMZW5ndGhcbkJ1ZmZlci5ieXRlTGVuZ3RoID0gU2xvd0J1ZmZlci5ieXRlTGVuZ3RoO1xuXG5cbi8vIGZpbGwodmFsdWUsIHN0YXJ0PTAsIGVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5maWxsID0gZnVuY3Rpb24gZmlsbCh2YWx1ZSwgc3RhcnQsIGVuZCkge1xuICB2YWx1ZSB8fCAodmFsdWUgPSAwKTtcbiAgc3RhcnQgfHwgKHN0YXJ0ID0gMCk7XG4gIGVuZCB8fCAoZW5kID0gdGhpcy5sZW5ndGgpO1xuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFsdWUgPSB2YWx1ZS5jaGFyQ29kZUF0KDApO1xuICB9XG4gIGlmICghKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHx8IGlzTmFOKHZhbHVlKSkge1xuICAgIHRocm93IG5ldyBFcnJvcigndmFsdWUgaXMgbm90IGEgbnVtYmVyJyk7XG4gIH1cblxuICBpZiAoZW5kIDwgc3RhcnQpIHRocm93IG5ldyBFcnJvcignZW5kIDwgc3RhcnQnKTtcblxuICAvLyBGaWxsIDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVybiAwO1xuICBpZiAodGhpcy5sZW5ndGggPT0gMCkgcmV0dXJuIDA7XG5cbiAgaWYgKHN0YXJ0IDwgMCB8fCBzdGFydCA+PSB0aGlzLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc3RhcnQgb3V0IG9mIGJvdW5kcycpO1xuICB9XG5cbiAgaWYgKGVuZCA8IDAgfHwgZW5kID4gdGhpcy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2VuZCBvdXQgb2YgYm91bmRzJyk7XG4gIH1cblxuICByZXR1cm4gdGhpcy5wYXJlbnQuZmlsbCh2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQgKyB0aGlzLm9mZnNldCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kICsgdGhpcy5vZmZzZXQpO1xufTtcblxuXG4vLyBjb3B5KHRhcmdldEJ1ZmZlciwgdGFyZ2V0U3RhcnQ9MCwgc291cmNlU3RhcnQ9MCwgc291cmNlRW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbih0YXJnZXQsIHRhcmdldF9zdGFydCwgc3RhcnQsIGVuZCkge1xuICB2YXIgc291cmNlID0gdGhpcztcbiAgc3RhcnQgfHwgKHN0YXJ0ID0gMCk7XG4gIGVuZCB8fCAoZW5kID0gdGhpcy5sZW5ndGgpO1xuICB0YXJnZXRfc3RhcnQgfHwgKHRhcmdldF9zdGFydCA9IDApO1xuXG4gIGlmIChlbmQgPCBzdGFydCkgdGhyb3cgbmV3IEVycm9yKCdzb3VyY2VFbmQgPCBzb3VyY2VTdGFydCcpO1xuXG4gIC8vIENvcHkgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuIDA7XG4gIGlmICh0YXJnZXQubGVuZ3RoID09IDAgfHwgc291cmNlLmxlbmd0aCA9PSAwKSByZXR1cm4gMDtcblxuICBpZiAodGFyZ2V0X3N0YXJ0IDwgMCB8fCB0YXJnZXRfc3RhcnQgPj0gdGFyZ2V0Lmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBFcnJvcigndGFyZ2V0U3RhcnQgb3V0IG9mIGJvdW5kcycpO1xuICB9XG5cbiAgaWYgKHN0YXJ0IDwgMCB8fCBzdGFydCA+PSBzb3VyY2UubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzb3VyY2VTdGFydCBvdXQgb2YgYm91bmRzJyk7XG4gIH1cblxuICBpZiAoZW5kIDwgMCB8fCBlbmQgPiBzb3VyY2UubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzb3VyY2VFbmQgb3V0IG9mIGJvdW5kcycpO1xuICB9XG5cbiAgLy8gQXJlIHdlIG9vYj9cbiAgaWYgKGVuZCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgZW5kID0gdGhpcy5sZW5ndGg7XG4gIH1cblxuICBpZiAodGFyZ2V0Lmxlbmd0aCAtIHRhcmdldF9zdGFydCA8IGVuZCAtIHN0YXJ0KSB7XG4gICAgZW5kID0gdGFyZ2V0Lmxlbmd0aCAtIHRhcmdldF9zdGFydCArIHN0YXJ0O1xuICB9XG5cbiAgcmV0dXJuIHRoaXMucGFyZW50LmNvcHkodGFyZ2V0LnBhcmVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0X3N0YXJ0ICsgdGFyZ2V0Lm9mZnNldCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQgKyB0aGlzLm9mZnNldCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kICsgdGhpcy5vZmZzZXQpO1xufTtcblxuXG4vLyBzbGljZShzdGFydCwgZW5kKVxuQnVmZmVyLnByb3RvdHlwZS5zbGljZSA9IGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgaWYgKGVuZCA9PT0gdW5kZWZpbmVkKSBlbmQgPSB0aGlzLmxlbmd0aDtcbiAgaWYgKGVuZCA+IHRoaXMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ29vYicpO1xuICBpZiAoc3RhcnQgPiBlbmQpIHRocm93IG5ldyBFcnJvcignb29iJyk7XG5cbiAgcmV0dXJuIG5ldyBCdWZmZXIodGhpcy5wYXJlbnQsIGVuZCAtIHN0YXJ0LCArc3RhcnQgKyB0aGlzLm9mZnNldCk7XG59O1xuXG5cbi8vIExlZ2FjeSBtZXRob2RzIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eS5cblxuQnVmZmVyLnByb3RvdHlwZS51dGY4U2xpY2UgPSBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gIHJldHVybiB0aGlzLnRvU3RyaW5nKCd1dGY4Jywgc3RhcnQsIGVuZCk7XG59O1xuXG5CdWZmZXIucHJvdG90eXBlLmJpbmFyeVNsaWNlID0gZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICByZXR1cm4gdGhpcy50b1N0cmluZygnYmluYXJ5Jywgc3RhcnQsIGVuZCk7XG59O1xuXG5CdWZmZXIucHJvdG90eXBlLmFzY2lpU2xpY2UgPSBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gIHJldHVybiB0aGlzLnRvU3RyaW5nKCdhc2NpaScsIHN0YXJ0LCBlbmQpO1xufTtcblxuQnVmZmVyLnByb3RvdHlwZS51dGY4V3JpdGUgPSBmdW5jdGlvbihzdHJpbmcsIG9mZnNldCkge1xuICByZXR1cm4gdGhpcy53cml0ZShzdHJpbmcsIG9mZnNldCwgJ3V0ZjgnKTtcbn07XG5cbkJ1ZmZlci5wcm90b3R5cGUuYmluYXJ5V3JpdGUgPSBmdW5jdGlvbihzdHJpbmcsIG9mZnNldCkge1xuICByZXR1cm4gdGhpcy53cml0ZShzdHJpbmcsIG9mZnNldCwgJ2JpbmFyeScpO1xufTtcblxuQnVmZmVyLnByb3RvdHlwZS5hc2NpaVdyaXRlID0gZnVuY3Rpb24oc3RyaW5nLCBvZmZzZXQpIHtcbiAgcmV0dXJuIHRoaXMud3JpdGUoc3RyaW5nLCBvZmZzZXQsICdhc2NpaScpO1xufTtcblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDggPSBmdW5jdGlvbihvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhciBidWZmZXIgPSB0aGlzO1xuXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQub2sob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyBvZmZzZXQnKTtcblxuICAgIGFzc2VydC5vayhvZmZzZXQgPCBidWZmZXIubGVuZ3RoLFxuICAgICAgICAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKTtcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gYnVmZmVyLmxlbmd0aCkgcmV0dXJuO1xuXG4gIHJldHVybiBidWZmZXIucGFyZW50W2J1ZmZlci5vZmZzZXQgKyBvZmZzZXRdO1xufTtcblxuZnVuY3Rpb24gcmVhZFVJbnQxNihidWZmZXIsIG9mZnNldCwgaXNCaWdFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIHZhciB2YWwgPSAwO1xuXG5cbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydC5vayh0eXBlb2YgKGlzQmlnRW5kaWFuKSA9PT0gJ2Jvb2xlYW4nLFxuICAgICAgICAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3Npbmcgb2Zmc2V0Jyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0ICsgMSA8IGJ1ZmZlci5sZW5ndGgsXG4gICAgICAgICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpO1xuICB9XG5cbiAgaWYgKG9mZnNldCA+PSBidWZmZXIubGVuZ3RoKSByZXR1cm4gMDtcblxuICBpZiAoaXNCaWdFbmRpYW4pIHtcbiAgICB2YWwgPSBidWZmZXIucGFyZW50W2J1ZmZlci5vZmZzZXQgKyBvZmZzZXRdIDw8IDg7XG4gICAgaWYgKG9mZnNldCArIDEgPCBidWZmZXIubGVuZ3RoKSB7XG4gICAgICB2YWwgfD0gYnVmZmVyLnBhcmVudFtidWZmZXIub2Zmc2V0ICsgb2Zmc2V0ICsgMV07XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhbCA9IGJ1ZmZlci5wYXJlbnRbYnVmZmVyLm9mZnNldCArIG9mZnNldF07XG4gICAgaWYgKG9mZnNldCArIDEgPCBidWZmZXIubGVuZ3RoKSB7XG4gICAgICB2YWwgfD0gYnVmZmVyLnBhcmVudFtidWZmZXIub2Zmc2V0ICsgb2Zmc2V0ICsgMV0gPDwgODtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdmFsO1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZMRSA9IGZ1bmN0aW9uKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHJlYWRVSW50MTYodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpO1xufTtcblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2QkUgPSBmdW5jdGlvbihvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiByZWFkVUludDE2KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpO1xufTtcblxuZnVuY3Rpb24gcmVhZFVJbnQzMihidWZmZXIsIG9mZnNldCwgaXNCaWdFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIHZhciB2YWwgPSAwO1xuXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQub2sodHlwZW9mIChpc0JpZ0VuZGlhbikgPT09ICdib29sZWFuJyxcbiAgICAgICAgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKTtcblxuICAgIGFzc2VydC5vayhvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIG9mZnNldCcpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCArIDMgPCBidWZmZXIubGVuZ3RoLFxuICAgICAgICAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKTtcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gYnVmZmVyLmxlbmd0aCkgcmV0dXJuIDA7XG5cbiAgaWYgKGlzQmlnRW5kaWFuKSB7XG4gICAgaWYgKG9mZnNldCArIDEgPCBidWZmZXIubGVuZ3RoKVxuICAgICAgdmFsID0gYnVmZmVyLnBhcmVudFtidWZmZXIub2Zmc2V0ICsgb2Zmc2V0ICsgMV0gPDwgMTY7XG4gICAgaWYgKG9mZnNldCArIDIgPCBidWZmZXIubGVuZ3RoKVxuICAgICAgdmFsIHw9IGJ1ZmZlci5wYXJlbnRbYnVmZmVyLm9mZnNldCArIG9mZnNldCArIDJdIDw8IDg7XG4gICAgaWYgKG9mZnNldCArIDMgPCBidWZmZXIubGVuZ3RoKVxuICAgICAgdmFsIHw9IGJ1ZmZlci5wYXJlbnRbYnVmZmVyLm9mZnNldCArIG9mZnNldCArIDNdO1xuICAgIHZhbCA9IHZhbCArIChidWZmZXIucGFyZW50W2J1ZmZlci5vZmZzZXQgKyBvZmZzZXRdIDw8IDI0ID4+PiAwKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAob2Zmc2V0ICsgMiA8IGJ1ZmZlci5sZW5ndGgpXG4gICAgICB2YWwgPSBidWZmZXIucGFyZW50W2J1ZmZlci5vZmZzZXQgKyBvZmZzZXQgKyAyXSA8PCAxNjtcbiAgICBpZiAob2Zmc2V0ICsgMSA8IGJ1ZmZlci5sZW5ndGgpXG4gICAgICB2YWwgfD0gYnVmZmVyLnBhcmVudFtidWZmZXIub2Zmc2V0ICsgb2Zmc2V0ICsgMV0gPDwgODtcbiAgICB2YWwgfD0gYnVmZmVyLnBhcmVudFtidWZmZXIub2Zmc2V0ICsgb2Zmc2V0XTtcbiAgICBpZiAob2Zmc2V0ICsgMyA8IGJ1ZmZlci5sZW5ndGgpXG4gICAgICB2YWwgPSB2YWwgKyAoYnVmZmVyLnBhcmVudFtidWZmZXIub2Zmc2V0ICsgb2Zmc2V0ICsgM10gPDwgMjQgPj4+IDApO1xuICB9XG5cbiAgcmV0dXJuIHZhbDtcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyTEUgPSBmdW5jdGlvbihvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiByZWFkVUludDMyKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KTtcbn07XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkJFID0gZnVuY3Rpb24ob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gcmVhZFVJbnQzMih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KTtcbn07XG5cblxuLypcbiAqIFNpZ25lZCBpbnRlZ2VyIHR5cGVzLCB5YXkgdGVhbSEgQSByZW1pbmRlciBvbiBob3cgdHdvJ3MgY29tcGxlbWVudCBhY3R1YWxseVxuICogd29ya3MuIFRoZSBmaXJzdCBiaXQgaXMgdGhlIHNpZ25lZCBiaXQsIGkuZS4gdGVsbHMgdXMgd2hldGhlciBvciBub3QgdGhlXG4gKiBudW1iZXIgc2hvdWxkIGJlIHBvc2l0aXZlIG9yIG5lZ2F0aXZlLiBJZiB0aGUgdHdvJ3MgY29tcGxlbWVudCB2YWx1ZSBpc1xuICogcG9zaXRpdmUsIHRoZW4gd2UncmUgZG9uZSwgYXMgaXQncyBlcXVpdmFsZW50IHRvIHRoZSB1bnNpZ25lZCByZXByZXNlbnRhdGlvbi5cbiAqXG4gKiBOb3cgaWYgdGhlIG51bWJlciBpcyBwb3NpdGl2ZSwgeW91J3JlIHByZXR0eSBtdWNoIGRvbmUsIHlvdSBjYW4ganVzdCBsZXZlcmFnZVxuICogdGhlIHVuc2lnbmVkIHRyYW5zbGF0aW9ucyBhbmQgcmV0dXJuIHRob3NlLiBVbmZvcnR1bmF0ZWx5LCBuZWdhdGl2ZSBudW1iZXJzXG4gKiBhcmVuJ3QgcXVpdGUgdGhhdCBzdHJhaWdodGZvcndhcmQuXG4gKlxuICogQXQgZmlyc3QgZ2xhbmNlLCBvbmUgbWlnaHQgYmUgaW5jbGluZWQgdG8gdXNlIHRoZSB0cmFkaXRpb25hbCBmb3JtdWxhIHRvXG4gKiB0cmFuc2xhdGUgYmluYXJ5IG51bWJlcnMgYmV0d2VlbiB0aGUgcG9zaXRpdmUgYW5kIG5lZ2F0aXZlIHZhbHVlcyBpbiB0d28nc1xuICogY29tcGxlbWVudC4gKFRob3VnaCBpdCBkb2Vzbid0IHF1aXRlIHdvcmsgZm9yIHRoZSBtb3N0IG5lZ2F0aXZlIHZhbHVlKVxuICogTWFpbmx5OlxuICogIC0gaW52ZXJ0IGFsbCB0aGUgYml0c1xuICogIC0gYWRkIG9uZSB0byB0aGUgcmVzdWx0XG4gKlxuICogT2YgY291cnNlLCB0aGlzIGRvZXNuJ3QgcXVpdGUgd29yayBpbiBKYXZhc2NyaXB0LiBUYWtlIGZvciBleGFtcGxlIHRoZSB2YWx1ZVxuICogb2YgLTEyOC4gVGhpcyBjb3VsZCBiZSByZXByZXNlbnRlZCBpbiAxNiBiaXRzIChiaWctZW5kaWFuKSBhcyAweGZmODAuIEJ1dCBvZlxuICogY291cnNlLCBKYXZhc2NyaXB0IHdpbGwgZG8gdGhlIGZvbGxvd2luZzpcbiAqXG4gKiA+IH4weGZmODBcbiAqIC02NTQwOVxuICpcbiAqIFdob2ggdGhlcmUsIEphdmFzY3JpcHQsIHRoYXQncyBub3QgcXVpdGUgcmlnaHQuIEJ1dCB3YWl0LCBhY2NvcmRpbmcgdG9cbiAqIEphdmFzY3JpcHQgdGhhdCdzIHBlcmZlY3RseSBjb3JyZWN0LiBXaGVuIEphdmFzY3JpcHQgZW5kcyB1cCBzZWVpbmcgdGhlXG4gKiBjb25zdGFudCAweGZmODAsIGl0IGhhcyBubyBub3Rpb24gdGhhdCBpdCBpcyBhY3R1YWxseSBhIHNpZ25lZCBudW1iZXIuIEl0XG4gKiBhc3N1bWVzIHRoYXQgd2UndmUgaW5wdXQgdGhlIHVuc2lnbmVkIHZhbHVlIDB4ZmY4MC4gVGh1cywgd2hlbiBpdCBkb2VzIHRoZVxuICogYmluYXJ5IG5lZ2F0aW9uLCBpdCBjYXN0cyBpdCBpbnRvIGEgc2lnbmVkIHZhbHVlLCAocG9zaXRpdmUgMHhmZjgwKS4gVGhlblxuICogd2hlbiB5b3UgcGVyZm9ybSBiaW5hcnkgbmVnYXRpb24gb24gdGhhdCwgaXQgdHVybnMgaXQgaW50byBhIG5lZ2F0aXZlIG51bWJlci5cbiAqXG4gKiBJbnN0ZWFkLCB3ZSdyZSBnb2luZyB0byBoYXZlIHRvIHVzZSB0aGUgZm9sbG93aW5nIGdlbmVyYWwgZm9ybXVsYSwgdGhhdCB3b3Jrc1xuICogaW4gYSByYXRoZXIgSmF2YXNjcmlwdCBmcmllbmRseSB3YXkuIEknbSBnbGFkIHdlIGRvbid0IHN1cHBvcnQgdGhpcyBraW5kIG9mXG4gKiB3ZWlyZCBudW1iZXJpbmcgc2NoZW1lIGluIHRoZSBrZXJuZWwuXG4gKlxuICogKEJJVC1NQVggLSAodW5zaWduZWQpdmFsICsgMSkgKiAtMVxuICpcbiAqIFRoZSBhc3R1dGUgb2JzZXJ2ZXIsIG1heSB0aGluayB0aGF0IHRoaXMgZG9lc24ndCBtYWtlIHNlbnNlIGZvciA4LWJpdCBudW1iZXJzXG4gKiAocmVhbGx5IGl0IGlzbid0IG5lY2Vzc2FyeSBmb3IgdGhlbSkuIEhvd2V2ZXIsIHdoZW4geW91IGdldCAxNi1iaXQgbnVtYmVycyxcbiAqIHlvdSBkby4gTGV0J3MgZ28gYmFjayB0byBvdXIgcHJpb3IgZXhhbXBsZSBhbmQgc2VlIGhvdyB0aGlzIHdpbGwgbG9vazpcbiAqXG4gKiAoMHhmZmZmIC0gMHhmZjgwICsgMSkgKiAtMVxuICogKDB4MDA3ZiArIDEpICogLTFcbiAqICgweDAwODApICogLTFcbiAqL1xuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50OCA9IGZ1bmN0aW9uKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFyIGJ1ZmZlciA9IHRoaXM7XG4gIHZhciBuZWc7XG5cbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydC5vayhvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIG9mZnNldCcpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCA8IGJ1ZmZlci5sZW5ndGgsXG4gICAgICAgICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpO1xuICB9XG5cbiAgaWYgKG9mZnNldCA+PSBidWZmZXIubGVuZ3RoKSByZXR1cm47XG5cbiAgbmVnID0gYnVmZmVyLnBhcmVudFtidWZmZXIub2Zmc2V0ICsgb2Zmc2V0XSAmIDB4ODA7XG4gIGlmICghbmVnKSB7XG4gICAgcmV0dXJuIChidWZmZXIucGFyZW50W2J1ZmZlci5vZmZzZXQgKyBvZmZzZXRdKTtcbiAgfVxuXG4gIHJldHVybiAoKDB4ZmYgLSBidWZmZXIucGFyZW50W2J1ZmZlci5vZmZzZXQgKyBvZmZzZXRdICsgMSkgKiAtMSk7XG59O1xuXG5mdW5jdGlvbiByZWFkSW50MTYoYnVmZmVyLCBvZmZzZXQsIGlzQmlnRW5kaWFuLCBub0Fzc2VydCkge1xuICB2YXIgbmVnLCB2YWw7XG5cbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydC5vayh0eXBlb2YgKGlzQmlnRW5kaWFuKSA9PT0gJ2Jvb2xlYW4nLFxuICAgICAgICAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3Npbmcgb2Zmc2V0Jyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0ICsgMSA8IGJ1ZmZlci5sZW5ndGgsXG4gICAgICAgICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpO1xuICB9XG5cbiAgdmFsID0gcmVhZFVJbnQxNihidWZmZXIsIG9mZnNldCwgaXNCaWdFbmRpYW4sIG5vQXNzZXJ0KTtcbiAgbmVnID0gdmFsICYgMHg4MDAwO1xuICBpZiAoIW5lZykge1xuICAgIHJldHVybiB2YWw7XG4gIH1cblxuICByZXR1cm4gKDB4ZmZmZiAtIHZhbCArIDEpICogLTE7XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEUgPSBmdW5jdGlvbihvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiByZWFkSW50MTYodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpO1xufTtcblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZCRSA9IGZ1bmN0aW9uKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHJlYWRJbnQxNih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KTtcbn07XG5cbmZ1bmN0aW9uIHJlYWRJbnQzMihidWZmZXIsIG9mZnNldCwgaXNCaWdFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIHZhciBuZWcsIHZhbDtcblxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0Lm9rKHR5cGVvZiAoaXNCaWdFbmRpYW4pID09PSAnYm9vbGVhbicsXG4gICAgICAgICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyBvZmZzZXQnKTtcblxuICAgIGFzc2VydC5vayhvZmZzZXQgKyAzIDwgYnVmZmVyLmxlbmd0aCxcbiAgICAgICAgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJyk7XG4gIH1cblxuICB2YWwgPSByZWFkVUludDMyKGJ1ZmZlciwgb2Zmc2V0LCBpc0JpZ0VuZGlhbiwgbm9Bc3NlcnQpO1xuICBuZWcgPSB2YWwgJiAweDgwMDAwMDAwO1xuICBpZiAoIW5lZykge1xuICAgIHJldHVybiAodmFsKTtcbiAgfVxuXG4gIHJldHVybiAoMHhmZmZmZmZmZiAtIHZhbCArIDEpICogLTE7XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyTEUgPSBmdW5jdGlvbihvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiByZWFkSW50MzIodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpO1xufTtcblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJCRSA9IGZ1bmN0aW9uKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHJlYWRJbnQzMih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KTtcbn07XG5cbmZ1bmN0aW9uIHJlYWRGbG9hdChidWZmZXIsIG9mZnNldCwgaXNCaWdFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQub2sodHlwZW9mIChpc0JpZ0VuZGlhbikgPT09ICdib29sZWFuJyxcbiAgICAgICAgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKTtcblxuICAgIGFzc2VydC5vayhvZmZzZXQgKyAzIDwgYnVmZmVyLmxlbmd0aCxcbiAgICAgICAgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJyk7XG4gIH1cblxuICByZXR1cm4gcmVxdWlyZSgnLi9idWZmZXJfaWVlZTc1NCcpLnJlYWRJRUVFNzU0KGJ1ZmZlciwgb2Zmc2V0LCBpc0JpZ0VuZGlhbixcbiAgICAgIDIzLCA0KTtcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRMRSA9IGZ1bmN0aW9uKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHJlYWRGbG9hdCh0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydCk7XG59O1xuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdEJFID0gZnVuY3Rpb24ob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gcmVhZEZsb2F0KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpO1xufTtcblxuZnVuY3Rpb24gcmVhZERvdWJsZShidWZmZXIsIG9mZnNldCwgaXNCaWdFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQub2sodHlwZW9mIChpc0JpZ0VuZGlhbikgPT09ICdib29sZWFuJyxcbiAgICAgICAgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKTtcblxuICAgIGFzc2VydC5vayhvZmZzZXQgKyA3IDwgYnVmZmVyLmxlbmd0aCxcbiAgICAgICAgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJyk7XG4gIH1cblxuICByZXR1cm4gcmVxdWlyZSgnLi9idWZmZXJfaWVlZTc1NCcpLnJlYWRJRUVFNzU0KGJ1ZmZlciwgb2Zmc2V0LCBpc0JpZ0VuZGlhbixcbiAgICAgIDUyLCA4KTtcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlTEUgPSBmdW5jdGlvbihvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiByZWFkRG91YmxlKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KTtcbn07XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUJFID0gZnVuY3Rpb24ob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gcmVhZERvdWJsZSh0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KTtcbn07XG5cblxuLypcbiAqIFdlIGhhdmUgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIHZhbHVlIGlzIGEgdmFsaWQgaW50ZWdlci4gVGhpcyBtZWFucyB0aGF0IGl0IGlzXG4gKiBub24tbmVnYXRpdmUuIEl0IGhhcyBubyBmcmFjdGlvbmFsIGNvbXBvbmVudCBhbmQgdGhhdCBpdCBkb2VzIG5vdCBleGNlZWQgdGhlXG4gKiBtYXhpbXVtIGFsbG93ZWQgdmFsdWUuXG4gKlxuICogICAgICB2YWx1ZSAgICAgICAgICAgVGhlIG51bWJlciB0byBjaGVjayBmb3IgdmFsaWRpdHlcbiAqXG4gKiAgICAgIG1heCAgICAgICAgICAgICBUaGUgbWF4aW11bSB2YWx1ZVxuICovXG5mdW5jdGlvbiB2ZXJpZnVpbnQodmFsdWUsIG1heCkge1xuICBhc3NlcnQub2sodHlwZW9mICh2YWx1ZSkgPT0gJ251bWJlcicsXG4gICAgICAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpO1xuXG4gIGFzc2VydC5vayh2YWx1ZSA+PSAwLFxuICAgICAgJ3NwZWNpZmllZCBhIG5lZ2F0aXZlIHZhbHVlIGZvciB3cml0aW5nIGFuIHVuc2lnbmVkIHZhbHVlJyk7XG5cbiAgYXNzZXJ0Lm9rKHZhbHVlIDw9IG1heCwgJ3ZhbHVlIGlzIGxhcmdlciB0aGFuIG1heGltdW0gdmFsdWUgZm9yIHR5cGUnKTtcblxuICBhc3NlcnQub2soTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlLCAndmFsdWUgaGFzIGEgZnJhY3Rpb25hbCBjb21wb25lbnQnKTtcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQ4ID0gZnVuY3Rpb24odmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFyIGJ1ZmZlciA9IHRoaXM7XG5cbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydC5vayh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyB2YWx1ZScpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3Npbmcgb2Zmc2V0Jyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0IDwgYnVmZmVyLmxlbmd0aCxcbiAgICAgICAgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpO1xuXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmKTtcbiAgfVxuXG4gIGlmIChvZmZzZXQgPCBidWZmZXIubGVuZ3RoKSB7XG4gICAgYnVmZmVyLnBhcmVudFtidWZmZXIub2Zmc2V0ICsgb2Zmc2V0XSA9IHZhbHVlO1xuICB9XG59O1xuXG5mdW5jdGlvbiB3cml0ZVVJbnQxNihidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzQmlnRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0Lm9rKHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIHZhbHVlJyk7XG5cbiAgICBhc3NlcnQub2sodHlwZW9mIChpc0JpZ0VuZGlhbikgPT09ICdib29sZWFuJyxcbiAgICAgICAgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKTtcblxuICAgIGFzc2VydC5vayhvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIG9mZnNldCcpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCArIDEgPCBidWZmZXIubGVuZ3RoLFxuICAgICAgICAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJyk7XG5cbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmZmZik7XG4gIH1cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IE1hdGgubWluKGJ1ZmZlci5sZW5ndGggLSBvZmZzZXQsIDIpOyBpKyspIHtcbiAgICBidWZmZXIucGFyZW50W2J1ZmZlci5vZmZzZXQgKyBvZmZzZXQgKyBpXSA9XG4gICAgICAgICh2YWx1ZSAmICgweGZmIDw8ICg4ICogKGlzQmlnRW5kaWFuID8gMSAtIGkgOiBpKSkpKSA+Pj5cbiAgICAgICAgICAgIChpc0JpZ0VuZGlhbiA/IDEgLSBpIDogaSkgKiA4O1xuICB9XG5cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkxFID0gZnVuY3Rpb24odmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgd3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KTtcbn07XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZCRSA9IGZ1bmN0aW9uKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHdyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KTtcbn07XG5cbmZ1bmN0aW9uIHdyaXRlVUludDMyKGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNCaWdFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQub2sodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3NpbmcgdmFsdWUnKTtcblxuICAgIGFzc2VydC5vayh0eXBlb2YgKGlzQmlnRW5kaWFuKSA9PT0gJ2Jvb2xlYW4nLFxuICAgICAgICAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3Npbmcgb2Zmc2V0Jyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0ICsgMyA8IGJ1ZmZlci5sZW5ndGgsXG4gICAgICAgICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKTtcblxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZmZmZmZmZik7XG4gIH1cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IE1hdGgubWluKGJ1ZmZlci5sZW5ndGggLSBvZmZzZXQsIDQpOyBpKyspIHtcbiAgICBidWZmZXIucGFyZW50W2J1ZmZlci5vZmZzZXQgKyBvZmZzZXQgKyBpXSA9XG4gICAgICAgICh2YWx1ZSA+Pj4gKGlzQmlnRW5kaWFuID8gMyAtIGkgOiBpKSAqIDgpICYgMHhmZjtcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyTEUgPSBmdW5jdGlvbih2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB3cml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpO1xufTtcblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkJFID0gZnVuY3Rpb24odmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgd3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpO1xufTtcblxuXG4vKlxuICogV2Ugbm93IG1vdmUgb250byBvdXIgZnJpZW5kcyBpbiB0aGUgc2lnbmVkIG51bWJlciBjYXRlZ29yeS4gVW5saWtlIHVuc2lnbmVkXG4gKiBudW1iZXJzLCB3ZSdyZSBnb2luZyB0byBoYXZlIHRvIHdvcnJ5IGEgYml0IG1vcmUgYWJvdXQgaG93IHdlIHB1dCB2YWx1ZXMgaW50b1xuICogYXJyYXlzLiBTaW5jZSB3ZSBhcmUgb25seSB3b3JyeWluZyBhYm91dCBzaWduZWQgMzItYml0IHZhbHVlcywgd2UncmUgaW5cbiAqIHNsaWdodGx5IGJldHRlciBzaGFwZS4gVW5mb3J0dW5hdGVseSwgd2UgcmVhbGx5IGNhbid0IGRvIG91ciBmYXZvcml0ZSBiaW5hcnlcbiAqICYgaW4gdGhpcyBzeXN0ZW0uIEl0IHJlYWxseSBzZWVtcyB0byBkbyB0aGUgd3JvbmcgdGhpbmcuIEZvciBleGFtcGxlOlxuICpcbiAqID4gLTMyICYgMHhmZlxuICogMjI0XG4gKlxuICogV2hhdCdzIGhhcHBlbmluZyBhYm92ZSBpcyByZWFsbHk6IDB4ZTAgJiAweGZmID0gMHhlMC4gSG93ZXZlciwgdGhlIHJlc3VsdHMgb2ZcbiAqIHRoaXMgYXJlbid0IHRyZWF0ZWQgYXMgYSBzaWduZWQgbnVtYmVyLiBVbHRpbWF0ZWx5IGEgYmFkIHRoaW5nLlxuICpcbiAqIFdoYXQgd2UncmUgZ29pbmcgdG8gd2FudCB0byBkbyBpcyBiYXNpY2FsbHkgY3JlYXRlIHRoZSB1bnNpZ25lZCBlcXVpdmFsZW50IG9mXG4gKiBvdXIgcmVwcmVzZW50YXRpb24gYW5kIHBhc3MgdGhhdCBvZmYgdG8gdGhlIHd1aW50KiBmdW5jdGlvbnMuIFRvIGRvIHRoYXRcbiAqIHdlJ3JlIGdvaW5nIHRvIGRvIHRoZSBmb2xsb3dpbmc6XG4gKlxuICogIC0gaWYgdGhlIHZhbHVlIGlzIHBvc2l0aXZlXG4gKiAgICAgIHdlIGNhbiBwYXNzIGl0IGRpcmVjdGx5IG9mZiB0byB0aGUgZXF1aXZhbGVudCB3dWludFxuICogIC0gaWYgdGhlIHZhbHVlIGlzIG5lZ2F0aXZlXG4gKiAgICAgIHdlIGRvIHRoZSBmb2xsb3dpbmcgY29tcHV0YXRpb246XG4gKiAgICAgICAgIG1iICsgdmFsICsgMSwgd2hlcmVcbiAqICAgICAgICAgbWIgICBpcyB0aGUgbWF4aW11bSB1bnNpZ25lZCB2YWx1ZSBpbiB0aGF0IGJ5dGUgc2l6ZVxuICogICAgICAgICB2YWwgIGlzIHRoZSBKYXZhc2NyaXB0IG5lZ2F0aXZlIGludGVnZXJcbiAqXG4gKlxuICogQXMgYSBjb25jcmV0ZSB2YWx1ZSwgdGFrZSAtMTI4LiBJbiBzaWduZWQgMTYgYml0cyB0aGlzIHdvdWxkIGJlIDB4ZmY4MC4gSWZcbiAqIHlvdSBkbyBvdXQgdGhlIGNvbXB1dGF0aW9uczpcbiAqXG4gKiAweGZmZmYgLSAxMjggKyAxXG4gKiAweGZmZmYgLSAxMjdcbiAqIDB4ZmY4MFxuICpcbiAqIFlvdSBjYW4gdGhlbiBlbmNvZGUgdGhpcyB2YWx1ZSBhcyB0aGUgc2lnbmVkIHZlcnNpb24uIFRoaXMgaXMgcmVhbGx5IHJhdGhlclxuICogaGFja3ksIGJ1dCBpdCBzaG91bGQgd29yayBhbmQgZ2V0IHRoZSBqb2IgZG9uZSB3aGljaCBpcyBvdXIgZ29hbCBoZXJlLlxuICovXG5cbi8qXG4gKiBBIHNlcmllcyBvZiBjaGVja3MgdG8gbWFrZSBzdXJlIHdlIGFjdHVhbGx5IGhhdmUgYSBzaWduZWQgMzItYml0IG51bWJlclxuICovXG5mdW5jdGlvbiB2ZXJpZnNpbnQodmFsdWUsIG1heCwgbWluKSB7XG4gIGFzc2VydC5vayh0eXBlb2YgKHZhbHVlKSA9PSAnbnVtYmVyJyxcbiAgICAgICdjYW5ub3Qgd3JpdGUgYSBub24tbnVtYmVyIGFzIGEgbnVtYmVyJyk7XG5cbiAgYXNzZXJ0Lm9rKHZhbHVlIDw9IG1heCwgJ3ZhbHVlIGxhcmdlciB0aGFuIG1heGltdW0gYWxsb3dlZCB2YWx1ZScpO1xuXG4gIGFzc2VydC5vayh2YWx1ZSA+PSBtaW4sICd2YWx1ZSBzbWFsbGVyIHRoYW4gbWluaW11bSBhbGxvd2VkIHZhbHVlJyk7XG5cbiAgYXNzZXJ0Lm9rKE1hdGguZmxvb3IodmFsdWUpID09PSB2YWx1ZSwgJ3ZhbHVlIGhhcyBhIGZyYWN0aW9uYWwgY29tcG9uZW50Jyk7XG59XG5cbmZ1bmN0aW9uIHZlcmlmSUVFRTc1NCh2YWx1ZSwgbWF4LCBtaW4pIHtcbiAgYXNzZXJ0Lm9rKHR5cGVvZiAodmFsdWUpID09ICdudW1iZXInLFxuICAgICAgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKTtcblxuICBhc3NlcnQub2sodmFsdWUgPD0gbWF4LCAndmFsdWUgbGFyZ2VyIHRoYW4gbWF4aW11bSBhbGxvd2VkIHZhbHVlJyk7XG5cbiAgYXNzZXJ0Lm9rKHZhbHVlID49IG1pbiwgJ3ZhbHVlIHNtYWxsZXIgdGhhbiBtaW5pbXVtIGFsbG93ZWQgdmFsdWUnKTtcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDggPSBmdW5jdGlvbih2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YXIgYnVmZmVyID0gdGhpcztcblxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0Lm9rKHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIHZhbHVlJyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyBvZmZzZXQnKTtcblxuICAgIGFzc2VydC5vayhvZmZzZXQgPCBidWZmZXIubGVuZ3RoLFxuICAgICAgICAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJyk7XG5cbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2YsIC0weDgwKTtcbiAgfVxuXG4gIGlmICh2YWx1ZSA+PSAwKSB7XG4gICAgYnVmZmVyLndyaXRlVUludDgodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpO1xuICB9IGVsc2Uge1xuICAgIGJ1ZmZlci53cml0ZVVJbnQ4KDB4ZmYgKyB2YWx1ZSArIDEsIG9mZnNldCwgbm9Bc3NlcnQpO1xuICB9XG59O1xuXG5mdW5jdGlvbiB3cml0ZUludDE2KGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNCaWdFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQub2sodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3NpbmcgdmFsdWUnKTtcblxuICAgIGFzc2VydC5vayh0eXBlb2YgKGlzQmlnRW5kaWFuKSA9PT0gJ2Jvb2xlYW4nLFxuICAgICAgICAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3Npbmcgb2Zmc2V0Jyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0ICsgMSA8IGJ1ZmZlci5sZW5ndGgsXG4gICAgICAgICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKTtcblxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZmZmLCAtMHg4MDAwKTtcbiAgfVxuXG4gIGlmICh2YWx1ZSA+PSAwKSB7XG4gICAgd3JpdGVVSW50MTYoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0JpZ0VuZGlhbiwgbm9Bc3NlcnQpO1xuICB9IGVsc2Uge1xuICAgIHdyaXRlVUludDE2KGJ1ZmZlciwgMHhmZmZmICsgdmFsdWUgKyAxLCBvZmZzZXQsIGlzQmlnRW5kaWFuLCBub0Fzc2VydCk7XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2TEUgPSBmdW5jdGlvbih2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB3cml0ZUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydCk7XG59O1xuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZCRSA9IGZ1bmN0aW9uKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHdyaXRlSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpO1xufTtcblxuZnVuY3Rpb24gd3JpdGVJbnQzMihidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzQmlnRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0Lm9rKHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIHZhbHVlJyk7XG5cbiAgICBhc3NlcnQub2sodHlwZW9mIChpc0JpZ0VuZGlhbikgPT09ICdib29sZWFuJyxcbiAgICAgICAgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKTtcblxuICAgIGFzc2VydC5vayhvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIG9mZnNldCcpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCArIDMgPCBidWZmZXIubGVuZ3RoLFxuICAgICAgICAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJyk7XG5cbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2ZmZmZmZmYsIC0weDgwMDAwMDAwKTtcbiAgfVxuXG4gIGlmICh2YWx1ZSA+PSAwKSB7XG4gICAgd3JpdGVVSW50MzIoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0JpZ0VuZGlhbiwgbm9Bc3NlcnQpO1xuICB9IGVsc2Uge1xuICAgIHdyaXRlVUludDMyKGJ1ZmZlciwgMHhmZmZmZmZmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBpc0JpZ0VuZGlhbiwgbm9Bc3NlcnQpO1xuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkxFID0gZnVuY3Rpb24odmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgd3JpdGVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpO1xufTtcblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyQkUgPSBmdW5jdGlvbih2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB3cml0ZUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KTtcbn07XG5cbmZ1bmN0aW9uIHdyaXRlRmxvYXQoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0JpZ0VuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydC5vayh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyB2YWx1ZScpO1xuXG4gICAgYXNzZXJ0Lm9rKHR5cGVvZiAoaXNCaWdFbmRpYW4pID09PSAnYm9vbGVhbicsXG4gICAgICAgICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyBvZmZzZXQnKTtcblxuICAgIGFzc2VydC5vayhvZmZzZXQgKyAzIDwgYnVmZmVyLmxlbmd0aCxcbiAgICAgICAgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpO1xuXG4gICAgdmVyaWZJRUVFNzU0KHZhbHVlLCAzLjQwMjgyMzQ2NjM4NTI4ODZlKzM4LCAtMy40MDI4MjM0NjYzODUyODg2ZSszOCk7XG4gIH1cblxuICByZXF1aXJlKCcuL2J1ZmZlcl9pZWVlNzU0Jykud3JpdGVJRUVFNzU0KGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNCaWdFbmRpYW4sXG4gICAgICAyMywgNCk7XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdExFID0gZnVuY3Rpb24odmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpO1xufTtcblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0QkUgPSBmdW5jdGlvbih2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB3cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KTtcbn07XG5cbmZ1bmN0aW9uIHdyaXRlRG91YmxlKGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNCaWdFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQub2sodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3NpbmcgdmFsdWUnKTtcblxuICAgIGFzc2VydC5vayh0eXBlb2YgKGlzQmlnRW5kaWFuKSA9PT0gJ2Jvb2xlYW4nLFxuICAgICAgICAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3Npbmcgb2Zmc2V0Jyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0ICsgNyA8IGJ1ZmZlci5sZW5ndGgsXG4gICAgICAgICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKTtcblxuICAgIHZlcmlmSUVFRTc1NCh2YWx1ZSwgMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgsIC0xLjc5NzY5MzEzNDg2MjMxNTdFKzMwOCk7XG4gIH1cblxuICByZXF1aXJlKCcuL2J1ZmZlcl9pZWVlNzU0Jykud3JpdGVJRUVFNzU0KGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNCaWdFbmRpYW4sXG4gICAgICA1MiwgOCk7XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVMRSA9IGZ1bmN0aW9uKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHdyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydCk7XG59O1xuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlQkUgPSBmdW5jdGlvbih2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB3cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydCk7XG59O1xuXG5TbG93QnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDggPSBCdWZmZXIucHJvdG90eXBlLnJlYWRVSW50ODtcblNsb3dCdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZMRSA9IEJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkxFO1xuU2xvd0J1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkJFID0gQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2QkU7XG5TbG93QnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyTEUgPSBCdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJMRTtcblNsb3dCdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJCRSA9IEJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkJFO1xuU2xvd0J1ZmZlci5wcm90b3R5cGUucmVhZEludDggPSBCdWZmZXIucHJvdG90eXBlLnJlYWRJbnQ4O1xuU2xvd0J1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEUgPSBCdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkxFO1xuU2xvd0J1ZmZlci5wcm90b3R5cGUucmVhZEludDE2QkUgPSBCdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkJFO1xuU2xvd0J1ZmZlci5wcm90b3R5cGUucmVhZEludDMyTEUgPSBCdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkxFO1xuU2xvd0J1ZmZlci5wcm90b3R5cGUucmVhZEludDMyQkUgPSBCdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkJFO1xuU2xvd0J1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0TEUgPSBCdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdExFO1xuU2xvd0J1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0QkUgPSBCdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdEJFO1xuU2xvd0J1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUxFID0gQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlTEU7XG5TbG93QnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlQkUgPSBCdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVCRTtcblNsb3dCdWZmZXIucHJvdG90eXBlLndyaXRlVUludDggPSBCdWZmZXIucHJvdG90eXBlLndyaXRlVUludDg7XG5TbG93QnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkxFID0gQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkxFO1xuU2xvd0J1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZCRSA9IEJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZCRTtcblNsb3dCdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyTEUgPSBCdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyTEU7XG5TbG93QnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkJFID0gQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkJFO1xuU2xvd0J1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQ4ID0gQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDg7XG5TbG93QnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2TEUgPSBCdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZMRTtcblNsb3dCdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZCRSA9IEJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkJFO1xuU2xvd0J1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkxFID0gQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyTEU7XG5TbG93QnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyQkUgPSBCdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJCRTtcblNsb3dCdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRMRSA9IEJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdExFO1xuU2xvd0J1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdEJFID0gQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0QkU7XG5TbG93QnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUxFID0gQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUxFO1xuU2xvd0J1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVCRSA9IEJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVCRTtcblxufSx7XCJhc3NlcnRcIjoxLFwiLi9idWZmZXJfaWVlZTc1NFwiOjUsXCJiYXNlNjQtanNcIjo3fV0sNzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4oZnVuY3Rpb24gKGV4cG9ydHMpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBsb29rdXAgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLyc7XG5cblx0ZnVuY3Rpb24gYjY0VG9CeXRlQXJyYXkoYjY0KSB7XG5cdFx0dmFyIGksIGosIGwsIHRtcCwgcGxhY2VIb2xkZXJzLCBhcnI7XG5cdFxuXHRcdGlmIChiNjQubGVuZ3RoICUgNCA+IDApIHtcblx0XHRcdHRocm93ICdJbnZhbGlkIHN0cmluZy4gTGVuZ3RoIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA0Jztcblx0XHR9XG5cblx0XHQvLyB0aGUgbnVtYmVyIG9mIGVxdWFsIHNpZ25zIChwbGFjZSBob2xkZXJzKVxuXHRcdC8vIGlmIHRoZXJlIGFyZSB0d28gcGxhY2Vob2xkZXJzLCB0aGFuIHRoZSB0d28gY2hhcmFjdGVycyBiZWZvcmUgaXRcblx0XHQvLyByZXByZXNlbnQgb25lIGJ5dGVcblx0XHQvLyBpZiB0aGVyZSBpcyBvbmx5IG9uZSwgdGhlbiB0aGUgdGhyZWUgY2hhcmFjdGVycyBiZWZvcmUgaXQgcmVwcmVzZW50IDIgYnl0ZXNcblx0XHQvLyB0aGlzIGlzIGp1c3QgYSBjaGVhcCBoYWNrIHRvIG5vdCBkbyBpbmRleE9mIHR3aWNlXG5cdFx0cGxhY2VIb2xkZXJzID0gYjY0LmluZGV4T2YoJz0nKTtcblx0XHRwbGFjZUhvbGRlcnMgPSBwbGFjZUhvbGRlcnMgPiAwID8gYjY0Lmxlbmd0aCAtIHBsYWNlSG9sZGVycyA6IDA7XG5cblx0XHQvLyBiYXNlNjQgaXMgNC8zICsgdXAgdG8gdHdvIGNoYXJhY3RlcnMgb2YgdGhlIG9yaWdpbmFsIGRhdGFcblx0XHRhcnIgPSBbXTsvL25ldyBVaW50OEFycmF5KGI2NC5sZW5ndGggKiAzIC8gNCAtIHBsYWNlSG9sZGVycyk7XG5cblx0XHQvLyBpZiB0aGVyZSBhcmUgcGxhY2Vob2xkZXJzLCBvbmx5IGdldCB1cCB0byB0aGUgbGFzdCBjb21wbGV0ZSA0IGNoYXJzXG5cdFx0bCA9IHBsYWNlSG9sZGVycyA+IDAgPyBiNjQubGVuZ3RoIC0gNCA6IGI2NC5sZW5ndGg7XG5cblx0XHRmb3IgKGkgPSAwLCBqID0gMDsgaSA8IGw7IGkgKz0gNCwgaiArPSAzKSB7XG5cdFx0XHR0bXAgPSAobG9va3VwLmluZGV4T2YoYjY0W2ldKSA8PCAxOCkgfCAobG9va3VwLmluZGV4T2YoYjY0W2kgKyAxXSkgPDwgMTIpIHwgKGxvb2t1cC5pbmRleE9mKGI2NFtpICsgMl0pIDw8IDYpIHwgbG9va3VwLmluZGV4T2YoYjY0W2kgKyAzXSk7XG5cdFx0XHRhcnIucHVzaCgodG1wICYgMHhGRjAwMDApID4+IDE2KTtcblx0XHRcdGFyci5wdXNoKCh0bXAgJiAweEZGMDApID4+IDgpO1xuXHRcdFx0YXJyLnB1c2godG1wICYgMHhGRik7XG5cdFx0fVxuXG5cdFx0aWYgKHBsYWNlSG9sZGVycyA9PT0gMikge1xuXHRcdFx0dG1wID0gKGxvb2t1cC5pbmRleE9mKGI2NFtpXSkgPDwgMikgfCAobG9va3VwLmluZGV4T2YoYjY0W2kgKyAxXSkgPj4gNCk7XG5cdFx0XHRhcnIucHVzaCh0bXAgJiAweEZGKTtcblx0XHR9IGVsc2UgaWYgKHBsYWNlSG9sZGVycyA9PT0gMSkge1xuXHRcdFx0dG1wID0gKGxvb2t1cC5pbmRleE9mKGI2NFtpXSkgPDwgMTApIHwgKGxvb2t1cC5pbmRleE9mKGI2NFtpICsgMV0pIDw8IDQpIHwgKGxvb2t1cC5pbmRleE9mKGI2NFtpICsgMl0pID4+IDIpO1xuXHRcdFx0YXJyLnB1c2goKHRtcCA+PiA4KSAmIDB4RkYpO1xuXHRcdFx0YXJyLnB1c2godG1wICYgMHhGRik7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGFycjtcblx0fVxuXG5cdGZ1bmN0aW9uIHVpbnQ4VG9CYXNlNjQodWludDgpIHtcblx0XHR2YXIgaSxcblx0XHRcdGV4dHJhQnl0ZXMgPSB1aW50OC5sZW5ndGggJSAzLCAvLyBpZiB3ZSBoYXZlIDEgYnl0ZSBsZWZ0LCBwYWQgMiBieXRlc1xuXHRcdFx0b3V0cHV0ID0gXCJcIixcblx0XHRcdHRlbXAsIGxlbmd0aDtcblxuXHRcdGZ1bmN0aW9uIHRyaXBsZXRUb0Jhc2U2NCAobnVtKSB7XG5cdFx0XHRyZXR1cm4gbG9va3VwW251bSA+PiAxOCAmIDB4M0ZdICsgbG9va3VwW251bSA+PiAxMiAmIDB4M0ZdICsgbG9va3VwW251bSA+PiA2ICYgMHgzRl0gKyBsb29rdXBbbnVtICYgMHgzRl07XG5cdFx0fTtcblxuXHRcdC8vIGdvIHRocm91Z2ggdGhlIGFycmF5IGV2ZXJ5IHRocmVlIGJ5dGVzLCB3ZSdsbCBkZWFsIHdpdGggdHJhaWxpbmcgc3R1ZmYgbGF0ZXJcblx0XHRmb3IgKGkgPSAwLCBsZW5ndGggPSB1aW50OC5sZW5ndGggLSBleHRyYUJ5dGVzOyBpIDwgbGVuZ3RoOyBpICs9IDMpIHtcblx0XHRcdHRlbXAgPSAodWludDhbaV0gPDwgMTYpICsgKHVpbnQ4W2kgKyAxXSA8PCA4KSArICh1aW50OFtpICsgMl0pO1xuXHRcdFx0b3V0cHV0ICs9IHRyaXBsZXRUb0Jhc2U2NCh0ZW1wKTtcblx0XHR9XG5cblx0XHQvLyBwYWQgdGhlIGVuZCB3aXRoIHplcm9zLCBidXQgbWFrZSBzdXJlIHRvIG5vdCBmb3JnZXQgdGhlIGV4dHJhIGJ5dGVzXG5cdFx0c3dpdGNoIChleHRyYUJ5dGVzKSB7XG5cdFx0XHRjYXNlIDE6XG5cdFx0XHRcdHRlbXAgPSB1aW50OFt1aW50OC5sZW5ndGggLSAxXTtcblx0XHRcdFx0b3V0cHV0ICs9IGxvb2t1cFt0ZW1wID4+IDJdO1xuXHRcdFx0XHRvdXRwdXQgKz0gbG9va3VwWyh0ZW1wIDw8IDQpICYgMHgzRl07XG5cdFx0XHRcdG91dHB1dCArPSAnPT0nO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgMjpcblx0XHRcdFx0dGVtcCA9ICh1aW50OFt1aW50OC5sZW5ndGggLSAyXSA8PCA4KSArICh1aW50OFt1aW50OC5sZW5ndGggLSAxXSk7XG5cdFx0XHRcdG91dHB1dCArPSBsb29rdXBbdGVtcCA+PiAxMF07XG5cdFx0XHRcdG91dHB1dCArPSBsb29rdXBbKHRlbXAgPj4gNCkgJiAweDNGXTtcblx0XHRcdFx0b3V0cHV0ICs9IGxvb2t1cFsodGVtcCA8PCAyKSAmIDB4M0ZdO1xuXHRcdFx0XHRvdXRwdXQgKz0gJz0nO1xuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cblx0XHRyZXR1cm4gb3V0cHV0O1xuXHR9XG5cblx0bW9kdWxlLmV4cG9ydHMudG9CeXRlQXJyYXkgPSBiNjRUb0J5dGVBcnJheTtcblx0bW9kdWxlLmV4cG9ydHMuZnJvbUJ5dGVBcnJheSA9IHVpbnQ4VG9CYXNlNjQ7XG59KCkpO1xuXG59LHt9XSw4OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbmV4cG9ydHMucmVhZElFRUU3NTQgPSBmdW5jdGlvbihidWZmZXIsIG9mZnNldCwgaXNCRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtLFxuICAgICAgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMSxcbiAgICAgIGVNYXggPSAoMSA8PCBlTGVuKSAtIDEsXG4gICAgICBlQmlhcyA9IGVNYXggPj4gMSxcbiAgICAgIG5CaXRzID0gLTcsXG4gICAgICBpID0gaXNCRSA/IDAgOiAobkJ5dGVzIC0gMSksXG4gICAgICBkID0gaXNCRSA/IDEgOiAtMSxcbiAgICAgIHMgPSBidWZmZXJbb2Zmc2V0ICsgaV07XG5cbiAgaSArPSBkO1xuXG4gIGUgPSBzICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpO1xuICBzID4+PSAoLW5CaXRzKTtcbiAgbkJpdHMgKz0gZUxlbjtcbiAgZm9yICg7IG5CaXRzID4gMDsgZSA9IGUgKiAyNTYgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCk7XG5cbiAgbSA9IGUgJiAoKDEgPDwgKC1uQml0cykpIC0gMSk7XG4gIGUgPj49ICgtbkJpdHMpO1xuICBuQml0cyArPSBtTGVuO1xuICBmb3IgKDsgbkJpdHMgPiAwOyBtID0gbSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KTtcblxuICBpZiAoZSA9PT0gMCkge1xuICAgIGUgPSAxIC0gZUJpYXM7XG4gIH0gZWxzZSBpZiAoZSA9PT0gZU1heCkge1xuICAgIHJldHVybiBtID8gTmFOIDogKChzID8gLTEgOiAxKSAqIEluZmluaXR5KTtcbiAgfSBlbHNlIHtcbiAgICBtID0gbSArIE1hdGgucG93KDIsIG1MZW4pO1xuICAgIGUgPSBlIC0gZUJpYXM7XG4gIH1cbiAgcmV0dXJuIChzID8gLTEgOiAxKSAqIG0gKiBNYXRoLnBvdygyLCBlIC0gbUxlbik7XG59O1xuXG5leHBvcnRzLndyaXRlSUVFRTc1NCA9IGZ1bmN0aW9uKGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNCRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtLCBjLFxuICAgICAgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMSxcbiAgICAgIGVNYXggPSAoMSA8PCBlTGVuKSAtIDEsXG4gICAgICBlQmlhcyA9IGVNYXggPj4gMSxcbiAgICAgIHJ0ID0gKG1MZW4gPT09IDIzID8gTWF0aC5wb3coMiwgLTI0KSAtIE1hdGgucG93KDIsIC03NykgOiAwKSxcbiAgICAgIGkgPSBpc0JFID8gKG5CeXRlcyAtIDEpIDogMCxcbiAgICAgIGQgPSBpc0JFID8gLTEgOiAxLFxuICAgICAgcyA9IHZhbHVlIDwgMCB8fCAodmFsdWUgPT09IDAgJiYgMSAvIHZhbHVlIDwgMCkgPyAxIDogMDtcblxuICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKTtcblxuICBpZiAoaXNOYU4odmFsdWUpIHx8IHZhbHVlID09PSBJbmZpbml0eSkge1xuICAgIG0gPSBpc05hTih2YWx1ZSkgPyAxIDogMDtcbiAgICBlID0gZU1heDtcbiAgfSBlbHNlIHtcbiAgICBlID0gTWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLkxOMik7XG4gICAgaWYgKHZhbHVlICogKGMgPSBNYXRoLnBvdygyLCAtZSkpIDwgMSkge1xuICAgICAgZS0tO1xuICAgICAgYyAqPSAyO1xuICAgIH1cbiAgICBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIHZhbHVlICs9IHJ0IC8gYztcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgKz0gcnQgKiBNYXRoLnBvdygyLCAxIC0gZUJpYXMpO1xuICAgIH1cbiAgICBpZiAodmFsdWUgKiBjID49IDIpIHtcbiAgICAgIGUrKztcbiAgICAgIGMgLz0gMjtcbiAgICB9XG5cbiAgICBpZiAoZSArIGVCaWFzID49IGVNYXgpIHtcbiAgICAgIG0gPSAwO1xuICAgICAgZSA9IGVNYXg7XG4gICAgfSBlbHNlIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgbSA9ICh2YWx1ZSAqIGMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pO1xuICAgICAgZSA9IGUgKyBlQmlhcztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IHZhbHVlICogTWF0aC5wb3coMiwgZUJpYXMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pO1xuICAgICAgZSA9IDA7XG4gICAgfVxuICB9XG5cbiAgZm9yICg7IG1MZW4gPj0gODsgYnVmZmVyW29mZnNldCArIGldID0gbSAmIDB4ZmYsIGkgKz0gZCwgbSAvPSAyNTYsIG1MZW4gLT0gOCk7XG5cbiAgZSA9IChlIDw8IG1MZW4pIHwgbTtcbiAgZUxlbiArPSBtTGVuO1xuICBmb3IgKDsgZUxlbiA+IDA7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IGUgJiAweGZmLCBpICs9IGQsIGUgLz0gMjU2LCBlTGVuIC09IDgpO1xuXG4gIGJ1ZmZlcltvZmZzZXQgKyBpIC0gZF0gfD0gcyAqIDEyODtcbn07XG5cbn0se31dLDM6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuZnVuY3Rpb24gU2xvd0J1ZmZlciAoc2l6ZSkge1xuICAgIHRoaXMubGVuZ3RoID0gc2l6ZTtcbn07XG5cbnZhciBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQnKTtcblxuZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUyA9IDUwO1xuXG5cbmZ1bmN0aW9uIHRvSGV4KG4pIHtcbiAgaWYgKG4gPCAxNikgcmV0dXJuICcwJyArIG4udG9TdHJpbmcoMTYpO1xuICByZXR1cm4gbi50b1N0cmluZygxNik7XG59XG5cbmZ1bmN0aW9uIHV0ZjhUb0J5dGVzKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKVxuICAgIGlmIChzdHIuY2hhckNvZGVBdChpKSA8PSAweDdGKVxuICAgICAgYnl0ZUFycmF5LnB1c2goc3RyLmNoYXJDb2RlQXQoaSkpO1xuICAgIGVsc2Uge1xuICAgICAgdmFyIGggPSBlbmNvZGVVUklDb21wb25lbnQoc3RyLmNoYXJBdChpKSkuc3Vic3RyKDEpLnNwbGl0KCclJyk7XG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGgubGVuZ3RoOyBqKyspXG4gICAgICAgIGJ5dGVBcnJheS5wdXNoKHBhcnNlSW50KGhbal0sIDE2KSk7XG4gICAgfVxuXG4gIHJldHVybiBieXRlQXJyYXk7XG59XG5cbmZ1bmN0aW9uIGFzY2lpVG9CeXRlcyhzdHIpIHtcbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrIClcbiAgICAvLyBOb2RlJ3MgY29kZSBzZWVtcyB0byBiZSBkb2luZyB0aGlzIGFuZCBub3QgJiAweDdGLi5cbiAgICBieXRlQXJyYXkucHVzaCggc3RyLmNoYXJDb2RlQXQoaSkgJiAweEZGICk7XG5cbiAgcmV0dXJuIGJ5dGVBcnJheTtcbn1cblxuZnVuY3Rpb24gYmFzZTY0VG9CeXRlcyhzdHIpIHtcbiAgcmV0dXJuIHJlcXVpcmUoXCJiYXNlNjQtanNcIikudG9CeXRlQXJyYXkoc3RyKTtcbn1cblxuU2xvd0J1ZmZlci5ieXRlTGVuZ3RoID0gZnVuY3Rpb24gKHN0ciwgZW5jb2RpbmcpIHtcbiAgc3dpdGNoIChlbmNvZGluZyB8fCBcInV0ZjhcIikge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXR1cm4gc3RyLmxlbmd0aCAvIDI7XG5cbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXR1cm4gdXRmOFRvQnl0ZXMoc3RyKS5sZW5ndGg7XG5cbiAgICBjYXNlICdhc2NpaSc6XG4gICAgICByZXR1cm4gc3RyLmxlbmd0aDtcblxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICByZXR1cm4gYmFzZTY0VG9CeXRlcyhzdHIpLmxlbmd0aDtcblxuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gYmxpdEJ1ZmZlcihzcmMsIGRzdCwgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIHBvcywgaSA9IDA7XG4gIHdoaWxlIChpIDwgbGVuZ3RoKSB7XG4gICAgaWYgKChpK29mZnNldCA+PSBkc3QubGVuZ3RoKSB8fCAoaSA+PSBzcmMubGVuZ3RoKSlcbiAgICAgIGJyZWFrO1xuXG4gICAgZHN0W2kgKyBvZmZzZXRdID0gc3JjW2ldO1xuICAgIGkrKztcbiAgfVxuICByZXR1cm4gaTtcbn1cblxuU2xvd0J1ZmZlci5wcm90b3R5cGUudXRmOFdyaXRlID0gZnVuY3Rpb24gKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGJ5dGVzLCBwb3M7XG4gIHJldHVybiBTbG93QnVmZmVyLl9jaGFyc1dyaXR0ZW4gPSAgYmxpdEJ1ZmZlcih1dGY4VG9CeXRlcyhzdHJpbmcpLCB0aGlzLCBvZmZzZXQsIGxlbmd0aCk7XG59O1xuXG5TbG93QnVmZmVyLnByb3RvdHlwZS5hc2NpaVdyaXRlID0gZnVuY3Rpb24gKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGJ5dGVzLCBwb3M7XG4gIHJldHVybiBTbG93QnVmZmVyLl9jaGFyc1dyaXR0ZW4gPSAgYmxpdEJ1ZmZlcihhc2NpaVRvQnl0ZXMoc3RyaW5nKSwgdGhpcywgb2Zmc2V0LCBsZW5ndGgpO1xufTtcblxuU2xvd0J1ZmZlci5wcm90b3R5cGUuYmFzZTY0V3JpdGUgPSBmdW5jdGlvbiAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgYnl0ZXMsIHBvcztcbiAgcmV0dXJuIFNsb3dCdWZmZXIuX2NoYXJzV3JpdHRlbiA9IGJsaXRCdWZmZXIoYmFzZTY0VG9CeXRlcyhzdHJpbmcpLCB0aGlzLCBvZmZzZXQsIGxlbmd0aCk7XG59O1xuXG5TbG93QnVmZmVyLnByb3RvdHlwZS5iYXNlNjRTbGljZSA9IGZ1bmN0aW9uIChzdGFydCwgZW5kKSB7XG4gIHZhciBieXRlcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gIHJldHVybiByZXF1aXJlKFwiYmFzZTY0LWpzXCIpLmZyb21CeXRlQXJyYXkoYnl0ZXMpO1xufVxuXG5mdW5jdGlvbiBkZWNvZGVVdGY4Q2hhcihzdHIpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHN0cik7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4RkZGRCk7IC8vIFVURiA4IGludmFsaWQgY2hhclxuICB9XG59XG5cblNsb3dCdWZmZXIucHJvdG90eXBlLnV0ZjhTbGljZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGJ5dGVzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIHZhciByZXMgPSBcIlwiO1xuICB2YXIgdG1wID0gXCJcIjtcbiAgdmFyIGkgPSAwO1xuICB3aGlsZSAoaSA8IGJ5dGVzLmxlbmd0aCkge1xuICAgIGlmIChieXRlc1tpXSA8PSAweDdGKSB7XG4gICAgICByZXMgKz0gZGVjb2RlVXRmOENoYXIodG1wKSArIFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0pO1xuICAgICAgdG1wID0gXCJcIjtcbiAgICB9IGVsc2VcbiAgICAgIHRtcCArPSBcIiVcIiArIGJ5dGVzW2ldLnRvU3RyaW5nKDE2KTtcblxuICAgIGkrKztcbiAgfVxuXG4gIHJldHVybiByZXMgKyBkZWNvZGVVdGY4Q2hhcih0bXApO1xufVxuXG5TbG93QnVmZmVyLnByb3RvdHlwZS5hc2NpaVNsaWNlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgYnl0ZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgdmFyIHJldCA9IFwiXCI7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpKyspXG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0pO1xuICByZXR1cm4gcmV0O1xufVxuXG5TbG93QnVmZmVyLnByb3RvdHlwZS5pbnNwZWN0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBvdXQgPSBbXSxcbiAgICAgIGxlbiA9IHRoaXMubGVuZ3RoO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgb3V0W2ldID0gdG9IZXgodGhpc1tpXSk7XG4gICAgaWYgKGkgPT0gZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUykge1xuICAgICAgb3V0W2kgKyAxXSA9ICcuLi4nO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiAnPFNsb3dCdWZmZXIgJyArIG91dC5qb2luKCcgJykgKyAnPic7XG59O1xuXG5cblNsb3dCdWZmZXIucHJvdG90eXBlLmhleFNsaWNlID0gZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGg7XG5cbiAgaWYgKCFzdGFydCB8fCBzdGFydCA8IDApIHN0YXJ0ID0gMDtcbiAgaWYgKCFlbmQgfHwgZW5kIDwgMCB8fCBlbmQgPiBsZW4pIGVuZCA9IGxlbjtcblxuICB2YXIgb3V0ID0gJyc7XG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgb3V0ICs9IHRvSGV4KHRoaXNbaV0pO1xuICB9XG4gIHJldHVybiBvdXQ7XG59O1xuXG5cblNsb3dCdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oZW5jb2RpbmcsIHN0YXJ0LCBlbmQpIHtcbiAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcgfHwgJ3V0ZjgnKS50b0xvd2VyQ2FzZSgpO1xuICBzdGFydCA9ICtzdGFydCB8fCAwO1xuICBpZiAodHlwZW9mIGVuZCA9PSAndW5kZWZpbmVkJykgZW5kID0gdGhpcy5sZW5ndGg7XG5cbiAgLy8gRmFzdHBhdGggZW1wdHkgc3RyaW5nc1xuICBpZiAoK2VuZCA9PSBzdGFydCkge1xuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0dXJuIHRoaXMuaGV4U2xpY2Uoc3RhcnQsIGVuZCk7XG5cbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXR1cm4gdGhpcy51dGY4U2xpY2Uoc3RhcnQsIGVuZCk7XG5cbiAgICBjYXNlICdhc2NpaSc6XG4gICAgICByZXR1cm4gdGhpcy5hc2NpaVNsaWNlKHN0YXJ0LCBlbmQpO1xuXG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldHVybiB0aGlzLmJpbmFyeVNsaWNlKHN0YXJ0LCBlbmQpO1xuXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldHVybiB0aGlzLmJhc2U2NFNsaWNlKHN0YXJ0LCBlbmQpO1xuXG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgICAgcmV0dXJuIHRoaXMudWNzMlNsaWNlKHN0YXJ0LCBlbmQpO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpO1xuICB9XG59O1xuXG5cblNsb3dCdWZmZXIucHJvdG90eXBlLmhleFdyaXRlID0gZnVuY3Rpb24oc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICBvZmZzZXQgPSArb2Zmc2V0IHx8IDA7XG4gIHZhciByZW1haW5pbmcgPSB0aGlzLmxlbmd0aCAtIG9mZnNldDtcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmc7XG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gK2xlbmd0aDtcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmc7XG4gICAgfVxuICB9XG5cbiAgLy8gbXVzdCBiZSBhbiBldmVuIG51bWJlciBvZiBkaWdpdHNcbiAgdmFyIHN0ckxlbiA9IHN0cmluZy5sZW5ndGg7XG4gIGlmIChzdHJMZW4gJSAyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGhleCBzdHJpbmcnKTtcbiAgfVxuICBpZiAobGVuZ3RoID4gc3RyTGVuIC8gMikge1xuICAgIGxlbmd0aCA9IHN0ckxlbiAvIDI7XG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIHZhciBieXRlID0gcGFyc2VJbnQoc3RyaW5nLnN1YnN0cihpICogMiwgMiksIDE2KTtcbiAgICBpZiAoaXNOYU4oYnl0ZSkpIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBoZXggc3RyaW5nJyk7XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9IGJ5dGU7XG4gIH1cbiAgU2xvd0J1ZmZlci5fY2hhcnNXcml0dGVuID0gaSAqIDI7XG4gIHJldHVybiBpO1xufTtcblxuXG5TbG93QnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKSB7XG4gIC8vIFN1cHBvcnQgYm90aCAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpXG4gIC8vIGFuZCB0aGUgbGVnYWN5IChzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgaWYgKGlzRmluaXRlKG9mZnNldCkpIHtcbiAgICBpZiAoIWlzRmluaXRlKGxlbmd0aCkpIHtcbiAgICAgIGVuY29kaW5nID0gbGVuZ3RoO1xuICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSBlbHNlIHsgIC8vIGxlZ2FjeVxuICAgIHZhciBzd2FwID0gZW5jb2Rpbmc7XG4gICAgZW5jb2RpbmcgPSBvZmZzZXQ7XG4gICAgb2Zmc2V0ID0gbGVuZ3RoO1xuICAgIGxlbmd0aCA9IHN3YXA7XG4gIH1cblxuICBvZmZzZXQgPSArb2Zmc2V0IHx8IDA7XG4gIHZhciByZW1haW5pbmcgPSB0aGlzLmxlbmd0aCAtIG9mZnNldDtcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmc7XG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gK2xlbmd0aDtcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmc7XG4gICAgfVxuICB9XG4gIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nIHx8ICd1dGY4JykudG9Mb3dlckNhc2UoKTtcblxuICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldHVybiB0aGlzLmhleFdyaXRlKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpO1xuXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0dXJuIHRoaXMudXRmOFdyaXRlKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpO1xuXG4gICAgY2FzZSAnYXNjaWknOlxuICAgICAgcmV0dXJuIHRoaXMuYXNjaWlXcml0ZShzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKTtcblxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICByZXR1cm4gdGhpcy5iaW5hcnlXcml0ZShzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKTtcblxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICByZXR1cm4gdGhpcy5iYXNlNjRXcml0ZShzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKTtcblxuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIHJldHVybiB0aGlzLnVjczJXcml0ZShzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKTtcblxuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKTtcbiAgfVxufTtcblxuXG4vLyBzbGljZShzdGFydCwgZW5kKVxuU2xvd0J1ZmZlci5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gIGlmIChlbmQgPT09IHVuZGVmaW5lZCkgZW5kID0gdGhpcy5sZW5ndGg7XG5cbiAgaWYgKGVuZCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdvb2InKTtcbiAgfVxuICBpZiAoc3RhcnQgPiBlbmQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ29vYicpO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBCdWZmZXIodGhpcywgZW5kIC0gc3RhcnQsICtzdGFydCk7XG59O1xuXG5TbG93QnVmZmVyLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24odGFyZ2V0LCB0YXJnZXRzdGFydCwgc291cmNlc3RhcnQsIHNvdXJjZWVuZCkge1xuICB2YXIgdGVtcCA9IFtdO1xuICBmb3IgKHZhciBpPXNvdXJjZXN0YXJ0OyBpPHNvdXJjZWVuZDsgaSsrKSB7XG4gICAgYXNzZXJ0Lm9rKHR5cGVvZiB0aGlzW2ldICE9PSAndW5kZWZpbmVkJywgXCJjb3B5aW5nIHVuZGVmaW5lZCBidWZmZXIgYnl0ZXMhXCIpO1xuICAgIHRlbXAucHVzaCh0aGlzW2ldKTtcbiAgfVxuXG4gIGZvciAodmFyIGk9dGFyZ2V0c3RhcnQ7IGk8dGFyZ2V0c3RhcnQrdGVtcC5sZW5ndGg7IGkrKykge1xuICAgIHRhcmdldFtpXSA9IHRlbXBbaS10YXJnZXRzdGFydF07XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGNvZXJjZShsZW5ndGgpIHtcbiAgLy8gQ29lcmNlIGxlbmd0aCB0byBhIG51bWJlciAocG9zc2libHkgTmFOKSwgcm91bmQgdXBcbiAgLy8gaW4gY2FzZSBpdCdzIGZyYWN0aW9uYWwgKGUuZy4gMTIzLjQ1NikgdGhlbiBkbyBhXG4gIC8vIGRvdWJsZSBuZWdhdGUgdG8gY29lcmNlIGEgTmFOIHRvIDAuIEVhc3ksIHJpZ2h0P1xuICBsZW5ndGggPSB+fk1hdGguY2VpbCgrbGVuZ3RoKTtcbiAgcmV0dXJuIGxlbmd0aCA8IDAgPyAwIDogbGVuZ3RoO1xufVxuXG5cbi8vIEJ1ZmZlclxuXG5mdW5jdGlvbiBCdWZmZXIoc3ViamVjdCwgZW5jb2RpbmcsIG9mZnNldCkge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgQnVmZmVyKSkge1xuICAgIHJldHVybiBuZXcgQnVmZmVyKHN1YmplY3QsIGVuY29kaW5nLCBvZmZzZXQpO1xuICB9XG5cbiAgdmFyIHR5cGU7XG5cbiAgLy8gQXJlIHdlIHNsaWNpbmc/XG4gIGlmICh0eXBlb2Ygb2Zmc2V0ID09PSAnbnVtYmVyJykge1xuICAgIHRoaXMubGVuZ3RoID0gY29lcmNlKGVuY29kaW5nKTtcbiAgICB0aGlzLnBhcmVudCA9IHN1YmplY3Q7XG4gICAgdGhpcy5vZmZzZXQgPSBvZmZzZXQ7XG4gIH0gZWxzZSB7XG4gICAgLy8gRmluZCB0aGUgbGVuZ3RoXG4gICAgc3dpdGNoICh0eXBlID0gdHlwZW9mIHN1YmplY3QpIHtcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIHRoaXMubGVuZ3RoID0gY29lcmNlKHN1YmplY3QpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgdGhpcy5sZW5ndGggPSBCdWZmZXIuYnl0ZUxlbmd0aChzdWJqZWN0LCBlbmNvZGluZyk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdvYmplY3QnOiAvLyBBc3N1bWUgb2JqZWN0IGlzIGFuIGFycmF5XG4gICAgICAgIHRoaXMubGVuZ3RoID0gY29lcmNlKHN1YmplY3QubGVuZ3RoKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRmlyc3QgYXJndW1lbnQgbmVlZHMgdG8gYmUgYSBudW1iZXIsICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2FycmF5IG9yIHN0cmluZy4nKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5sZW5ndGggPiBCdWZmZXIucG9vbFNpemUpIHtcbiAgICAgIC8vIEJpZyBidWZmZXIsIGp1c3QgYWxsb2Mgb25lLlxuICAgICAgdGhpcy5wYXJlbnQgPSBuZXcgU2xvd0J1ZmZlcih0aGlzLmxlbmd0aCk7XG4gICAgICB0aGlzLm9mZnNldCA9IDA7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gU21hbGwgYnVmZmVyLlxuICAgICAgaWYgKCFwb29sIHx8IHBvb2wubGVuZ3RoIC0gcG9vbC51c2VkIDwgdGhpcy5sZW5ndGgpIGFsbG9jUG9vbCgpO1xuICAgICAgdGhpcy5wYXJlbnQgPSBwb29sO1xuICAgICAgdGhpcy5vZmZzZXQgPSBwb29sLnVzZWQ7XG4gICAgICBwb29sLnVzZWQgKz0gdGhpcy5sZW5ndGg7XG4gICAgfVxuXG4gICAgLy8gVHJlYXQgYXJyYXktaXNoIG9iamVjdHMgYXMgYSBieXRlIGFycmF5LlxuICAgIGlmIChpc0FycmF5SXNoKHN1YmplY3QpKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5wYXJlbnRbaSArIHRoaXMub2Zmc2V0XSA9IHN1YmplY3RbaV07XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlID09ICdzdHJpbmcnKSB7XG4gICAgICAvLyBXZSBhcmUgYSBzdHJpbmdcbiAgICAgIHRoaXMubGVuZ3RoID0gdGhpcy53cml0ZShzdWJqZWN0LCAwLCBlbmNvZGluZyk7XG4gICAgfVxuICB9XG5cbn1cblxuZnVuY3Rpb24gaXNBcnJheUlzaChzdWJqZWN0KSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KHN1YmplY3QpIHx8IEJ1ZmZlci5pc0J1ZmZlcihzdWJqZWN0KSB8fFxuICAgICAgICAgc3ViamVjdCAmJiB0eXBlb2Ygc3ViamVjdCA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgIHR5cGVvZiBzdWJqZWN0Lmxlbmd0aCA9PT0gJ251bWJlcic7XG59XG5cbmV4cG9ydHMuU2xvd0J1ZmZlciA9IFNsb3dCdWZmZXI7XG5leHBvcnRzLkJ1ZmZlciA9IEJ1ZmZlcjtcblxuQnVmZmVyLnBvb2xTaXplID0gOCAqIDEwMjQ7XG52YXIgcG9vbDtcblxuZnVuY3Rpb24gYWxsb2NQb29sKCkge1xuICBwb29sID0gbmV3IFNsb3dCdWZmZXIoQnVmZmVyLnBvb2xTaXplKTtcbiAgcG9vbC51c2VkID0gMDtcbn1cblxuXG4vLyBTdGF0aWMgbWV0aG9kc1xuQnVmZmVyLmlzQnVmZmVyID0gZnVuY3Rpb24gaXNCdWZmZXIoYikge1xuICByZXR1cm4gYiBpbnN0YW5jZW9mIEJ1ZmZlciB8fCBiIGluc3RhbmNlb2YgU2xvd0J1ZmZlcjtcbn07XG5cbkJ1ZmZlci5jb25jYXQgPSBmdW5jdGlvbiAobGlzdCwgdG90YWxMZW5ndGgpIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KGxpc3QpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVXNhZ2U6IEJ1ZmZlci5jb25jYXQobGlzdCwgW3RvdGFsTGVuZ3RoXSlcXG4gXFxcbiAgICAgIGxpc3Qgc2hvdWxkIGJlIGFuIEFycmF5LlwiKTtcbiAgfVxuXG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBuZXcgQnVmZmVyKDApO1xuICB9IGVsc2UgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIGxpc3RbMF07XG4gIH1cblxuICBpZiAodHlwZW9mIHRvdGFsTGVuZ3RoICE9PSAnbnVtYmVyJykge1xuICAgIHRvdGFsTGVuZ3RoID0gMDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBidWYgPSBsaXN0W2ldO1xuICAgICAgdG90YWxMZW5ndGggKz0gYnVmLmxlbmd0aDtcbiAgICB9XG4gIH1cblxuICB2YXIgYnVmZmVyID0gbmV3IEJ1ZmZlcih0b3RhbExlbmd0aCk7XG4gIHZhciBwb3MgPSAwO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYnVmID0gbGlzdFtpXTtcbiAgICBidWYuY29weShidWZmZXIsIHBvcyk7XG4gICAgcG9zICs9IGJ1Zi5sZW5ndGg7XG4gIH1cbiAgcmV0dXJuIGJ1ZmZlcjtcbn07XG5cbi8vIEluc3BlY3RcbkJ1ZmZlci5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uIGluc3BlY3QoKSB7XG4gIHZhciBvdXQgPSBbXSxcbiAgICAgIGxlbiA9IHRoaXMubGVuZ3RoO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICBvdXRbaV0gPSB0b0hleCh0aGlzLnBhcmVudFtpICsgdGhpcy5vZmZzZXRdKTtcbiAgICBpZiAoaSA9PSBleHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTKSB7XG4gICAgICBvdXRbaSArIDFdID0gJy4uLic7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gJzxCdWZmZXIgJyArIG91dC5qb2luKCcgJykgKyAnPic7XG59O1xuXG5cbkJ1ZmZlci5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gZ2V0KGkpIHtcbiAgaWYgKGkgPCAwIHx8IGkgPj0gdGhpcy5sZW5ndGgpIHRocm93IG5ldyBFcnJvcignb29iJyk7XG4gIHJldHVybiB0aGlzLnBhcmVudFt0aGlzLm9mZnNldCArIGldO1xufTtcblxuXG5CdWZmZXIucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIHNldChpLCB2KSB7XG4gIGlmIChpIDwgMCB8fCBpID49IHRoaXMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ29vYicpO1xuICByZXR1cm4gdGhpcy5wYXJlbnRbdGhpcy5vZmZzZXQgKyBpXSA9IHY7XG59O1xuXG5cbi8vIHdyaXRlKHN0cmluZywgb2Zmc2V0ID0gMCwgbGVuZ3RoID0gYnVmZmVyLmxlbmd0aC1vZmZzZXQsIGVuY29kaW5nID0gJ3V0ZjgnKVxuQnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKSB7XG4gIC8vIFN1cHBvcnQgYm90aCAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpXG4gIC8vIGFuZCB0aGUgbGVnYWN5IChzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgaWYgKGlzRmluaXRlKG9mZnNldCkpIHtcbiAgICBpZiAoIWlzRmluaXRlKGxlbmd0aCkpIHtcbiAgICAgIGVuY29kaW5nID0gbGVuZ3RoO1xuICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSBlbHNlIHsgIC8vIGxlZ2FjeVxuICAgIHZhciBzd2FwID0gZW5jb2Rpbmc7XG4gICAgZW5jb2RpbmcgPSBvZmZzZXQ7XG4gICAgb2Zmc2V0ID0gbGVuZ3RoO1xuICAgIGxlbmd0aCA9IHN3YXA7XG4gIH1cblxuICBvZmZzZXQgPSArb2Zmc2V0IHx8IDA7XG4gIHZhciByZW1haW5pbmcgPSB0aGlzLmxlbmd0aCAtIG9mZnNldDtcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmc7XG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gK2xlbmd0aDtcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmc7XG4gICAgfVxuICB9XG4gIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nIHx8ICd1dGY4JykudG9Mb3dlckNhc2UoKTtcblxuICB2YXIgcmV0O1xuICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldCA9IHRoaXMucGFyZW50LmhleFdyaXRlKHN0cmluZywgdGhpcy5vZmZzZXQgKyBvZmZzZXQsIGxlbmd0aCk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IHRoaXMucGFyZW50LnV0ZjhXcml0ZShzdHJpbmcsIHRoaXMub2Zmc2V0ICsgb2Zmc2V0LCBsZW5ndGgpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdhc2NpaSc6XG4gICAgICByZXQgPSB0aGlzLnBhcmVudC5hc2NpaVdyaXRlKHN0cmluZywgdGhpcy5vZmZzZXQgKyBvZmZzZXQsIGxlbmd0aCk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICByZXQgPSB0aGlzLnBhcmVudC5iaW5hcnlXcml0ZShzdHJpbmcsIHRoaXMub2Zmc2V0ICsgb2Zmc2V0LCBsZW5ndGgpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgLy8gV2FybmluZzogbWF4TGVuZ3RoIG5vdCB0YWtlbiBpbnRvIGFjY291bnQgaW4gYmFzZTY0V3JpdGVcbiAgICAgIHJldCA9IHRoaXMucGFyZW50LmJhc2U2NFdyaXRlKHN0cmluZywgdGhpcy5vZmZzZXQgKyBvZmZzZXQsIGxlbmd0aCk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIHJldCA9IHRoaXMucGFyZW50LnVjczJXcml0ZShzdHJpbmcsIHRoaXMub2Zmc2V0ICsgb2Zmc2V0LCBsZW5ndGgpO1xuICAgICAgYnJlYWs7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJyk7XG4gIH1cblxuICBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9IFNsb3dCdWZmZXIuX2NoYXJzV3JpdHRlbjtcblxuICByZXR1cm4gcmV0O1xufTtcblxuXG4vLyB0b1N0cmluZyhlbmNvZGluZywgc3RhcnQ9MCwgZW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oZW5jb2RpbmcsIHN0YXJ0LCBlbmQpIHtcbiAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcgfHwgJ3V0ZjgnKS50b0xvd2VyQ2FzZSgpO1xuXG4gIGlmICh0eXBlb2Ygc3RhcnQgPT0gJ3VuZGVmaW5lZCcgfHwgc3RhcnQgPCAwKSB7XG4gICAgc3RhcnQgPSAwO1xuICB9IGVsc2UgaWYgKHN0YXJ0ID4gdGhpcy5sZW5ndGgpIHtcbiAgICBzdGFydCA9IHRoaXMubGVuZ3RoO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBlbmQgPT0gJ3VuZGVmaW5lZCcgfHwgZW5kID4gdGhpcy5sZW5ndGgpIHtcbiAgICBlbmQgPSB0aGlzLmxlbmd0aDtcbiAgfSBlbHNlIGlmIChlbmQgPCAwKSB7XG4gICAgZW5kID0gMDtcbiAgfVxuXG4gIHN0YXJ0ID0gc3RhcnQgKyB0aGlzLm9mZnNldDtcbiAgZW5kID0gZW5kICsgdGhpcy5vZmZzZXQ7XG5cbiAgc3dpdGNoIChlbmNvZGluZykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXR1cm4gdGhpcy5wYXJlbnQuaGV4U2xpY2Uoc3RhcnQsIGVuZCk7XG5cbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXR1cm4gdGhpcy5wYXJlbnQudXRmOFNsaWNlKHN0YXJ0LCBlbmQpO1xuXG4gICAgY2FzZSAnYXNjaWknOlxuICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmFzY2lpU2xpY2Uoc3RhcnQsIGVuZCk7XG5cbiAgICBjYXNlICdiaW5hcnknOlxuICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmJpbmFyeVNsaWNlKHN0YXJ0LCBlbmQpO1xuXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldHVybiB0aGlzLnBhcmVudC5iYXNlNjRTbGljZShzdGFydCwgZW5kKTtcblxuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIHJldHVybiB0aGlzLnBhcmVudC51Y3MyU2xpY2Uoc3RhcnQsIGVuZCk7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJyk7XG4gIH1cbn07XG5cblxuLy8gYnl0ZUxlbmd0aFxuQnVmZmVyLmJ5dGVMZW5ndGggPSBTbG93QnVmZmVyLmJ5dGVMZW5ndGg7XG5cblxuLy8gZmlsbCh2YWx1ZSwgc3RhcnQ9MCwgZW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmZpbGwgPSBmdW5jdGlvbiBmaWxsKHZhbHVlLCBzdGFydCwgZW5kKSB7XG4gIHZhbHVlIHx8ICh2YWx1ZSA9IDApO1xuICBzdGFydCB8fCAoc3RhcnQgPSAwKTtcbiAgZW5kIHx8IChlbmQgPSB0aGlzLmxlbmd0aCk7XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICB2YWx1ZSA9IHZhbHVlLmNoYXJDb2RlQXQoMCk7XG4gIH1cbiAgaWYgKCEodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykgfHwgaXNOYU4odmFsdWUpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd2YWx1ZSBpcyBub3QgYSBudW1iZXInKTtcbiAgfVxuXG4gIGlmIChlbmQgPCBzdGFydCkgdGhyb3cgbmV3IEVycm9yKCdlbmQgPCBzdGFydCcpO1xuXG4gIC8vIEZpbGwgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuIDA7XG4gIGlmICh0aGlzLmxlbmd0aCA9PSAwKSByZXR1cm4gMDtcblxuICBpZiAoc3RhcnQgPCAwIHx8IHN0YXJ0ID49IHRoaXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzdGFydCBvdXQgb2YgYm91bmRzJyk7XG4gIH1cblxuICBpZiAoZW5kIDwgMCB8fCBlbmQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBFcnJvcignZW5kIG91dCBvZiBib3VuZHMnKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzLnBhcmVudC5maWxsKHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydCArIHRoaXMub2Zmc2V0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICBlbmQgKyB0aGlzLm9mZnNldCk7XG59O1xuXG5cbi8vIGNvcHkodGFyZ2V0QnVmZmVyLCB0YXJnZXRTdGFydD0wLCBzb3VyY2VTdGFydD0wLCBzb3VyY2VFbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uKHRhcmdldCwgdGFyZ2V0X3N0YXJ0LCBzdGFydCwgZW5kKSB7XG4gIHZhciBzb3VyY2UgPSB0aGlzO1xuICBzdGFydCB8fCAoc3RhcnQgPSAwKTtcbiAgZW5kIHx8IChlbmQgPSB0aGlzLmxlbmd0aCk7XG4gIHRhcmdldF9zdGFydCB8fCAodGFyZ2V0X3N0YXJ0ID0gMCk7XG5cbiAgaWYgKGVuZCA8IHN0YXJ0KSB0aHJvdyBuZXcgRXJyb3IoJ3NvdXJjZUVuZCA8IHNvdXJjZVN0YXJ0Jyk7XG5cbiAgLy8gQ29weSAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm4gMDtcbiAgaWYgKHRhcmdldC5sZW5ndGggPT0gMCB8fCBzb3VyY2UubGVuZ3RoID09IDApIHJldHVybiAwO1xuXG4gIGlmICh0YXJnZXRfc3RhcnQgPCAwIHx8IHRhcmdldF9zdGFydCA+PSB0YXJnZXQubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd0YXJnZXRTdGFydCBvdXQgb2YgYm91bmRzJyk7XG4gIH1cblxuICBpZiAoc3RhcnQgPCAwIHx8IHN0YXJ0ID49IHNvdXJjZS5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NvdXJjZVN0YXJ0IG91dCBvZiBib3VuZHMnKTtcbiAgfVxuXG4gIGlmIChlbmQgPCAwIHx8IGVuZCA+IHNvdXJjZS5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NvdXJjZUVuZCBvdXQgb2YgYm91bmRzJyk7XG4gIH1cblxuICAvLyBBcmUgd2Ugb29iP1xuICBpZiAoZW5kID4gdGhpcy5sZW5ndGgpIHtcbiAgICBlbmQgPSB0aGlzLmxlbmd0aDtcbiAgfVxuXG4gIGlmICh0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0X3N0YXJ0IDwgZW5kIC0gc3RhcnQpIHtcbiAgICBlbmQgPSB0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0X3N0YXJ0ICsgc3RhcnQ7XG4gIH1cblxuICByZXR1cm4gdGhpcy5wYXJlbnQuY29weSh0YXJnZXQucGFyZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRfc3RhcnQgKyB0YXJnZXQub2Zmc2V0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydCArIHRoaXMub2Zmc2V0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICBlbmQgKyB0aGlzLm9mZnNldCk7XG59O1xuXG5cbi8vIHNsaWNlKHN0YXJ0LCBlbmQpXG5CdWZmZXIucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICBpZiAoZW5kID09PSB1bmRlZmluZWQpIGVuZCA9IHRoaXMubGVuZ3RoO1xuICBpZiAoZW5kID4gdGhpcy5sZW5ndGgpIHRocm93IG5ldyBFcnJvcignb29iJyk7XG4gIGlmIChzdGFydCA+IGVuZCkgdGhyb3cgbmV3IEVycm9yKCdvb2InKTtcblxuICByZXR1cm4gbmV3IEJ1ZmZlcih0aGlzLnBhcmVudCwgZW5kIC0gc3RhcnQsICtzdGFydCArIHRoaXMub2Zmc2V0KTtcbn07XG5cblxuLy8gTGVnYWN5IG1ldGhvZHMgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LlxuXG5CdWZmZXIucHJvdG90eXBlLnV0ZjhTbGljZSA9IGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIHRoaXMudG9TdHJpbmcoJ3V0ZjgnLCBzdGFydCwgZW5kKTtcbn07XG5cbkJ1ZmZlci5wcm90b3R5cGUuYmluYXJ5U2xpY2UgPSBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gIHJldHVybiB0aGlzLnRvU3RyaW5nKCdiaW5hcnknLCBzdGFydCwgZW5kKTtcbn07XG5cbkJ1ZmZlci5wcm90b3R5cGUuYXNjaWlTbGljZSA9IGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIHRoaXMudG9TdHJpbmcoJ2FzY2lpJywgc3RhcnQsIGVuZCk7XG59O1xuXG5CdWZmZXIucHJvdG90eXBlLnV0ZjhXcml0ZSA9IGZ1bmN0aW9uKHN0cmluZywgb2Zmc2V0KSB7XG4gIHJldHVybiB0aGlzLndyaXRlKHN0cmluZywgb2Zmc2V0LCAndXRmOCcpO1xufTtcblxuQnVmZmVyLnByb3RvdHlwZS5iaW5hcnlXcml0ZSA9IGZ1bmN0aW9uKHN0cmluZywgb2Zmc2V0KSB7XG4gIHJldHVybiB0aGlzLndyaXRlKHN0cmluZywgb2Zmc2V0LCAnYmluYXJ5Jyk7XG59O1xuXG5CdWZmZXIucHJvdG90eXBlLmFzY2lpV3JpdGUgPSBmdW5jdGlvbihzdHJpbmcsIG9mZnNldCkge1xuICByZXR1cm4gdGhpcy53cml0ZShzdHJpbmcsIG9mZnNldCwgJ2FzY2lpJyk7XG59O1xuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50OCA9IGZ1bmN0aW9uKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFyIGJ1ZmZlciA9IHRoaXM7XG5cbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydC5vayhvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIG9mZnNldCcpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCA8IGJ1ZmZlci5sZW5ndGgsXG4gICAgICAgICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpO1xuICB9XG5cbiAgcmV0dXJuIGJ1ZmZlci5wYXJlbnRbYnVmZmVyLm9mZnNldCArIG9mZnNldF07XG59O1xuXG5mdW5jdGlvbiByZWFkVUludDE2KGJ1ZmZlciwgb2Zmc2V0LCBpc0JpZ0VuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgdmFyIHZhbCA9IDA7XG5cblxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0Lm9rKHR5cGVvZiAoaXNCaWdFbmRpYW4pID09PSAnYm9vbGVhbicsXG4gICAgICAgICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyBvZmZzZXQnKTtcblxuICAgIGFzc2VydC5vayhvZmZzZXQgKyAxIDwgYnVmZmVyLmxlbmd0aCxcbiAgICAgICAgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJyk7XG4gIH1cblxuICBpZiAoaXNCaWdFbmRpYW4pIHtcbiAgICB2YWwgPSBidWZmZXIucGFyZW50W2J1ZmZlci5vZmZzZXQgKyBvZmZzZXRdIDw8IDg7XG4gICAgdmFsIHw9IGJ1ZmZlci5wYXJlbnRbYnVmZmVyLm9mZnNldCArIG9mZnNldCArIDFdO1xuICB9IGVsc2Uge1xuICAgIHZhbCA9IGJ1ZmZlci5wYXJlbnRbYnVmZmVyLm9mZnNldCArIG9mZnNldF07XG4gICAgdmFsIHw9IGJ1ZmZlci5wYXJlbnRbYnVmZmVyLm9mZnNldCArIG9mZnNldCArIDFdIDw8IDg7XG4gIH1cblxuICByZXR1cm4gdmFsO1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZMRSA9IGZ1bmN0aW9uKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHJlYWRVSW50MTYodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpO1xufTtcblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2QkUgPSBmdW5jdGlvbihvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiByZWFkVUludDE2KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpO1xufTtcblxuZnVuY3Rpb24gcmVhZFVJbnQzMihidWZmZXIsIG9mZnNldCwgaXNCaWdFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIHZhciB2YWwgPSAwO1xuXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQub2sodHlwZW9mIChpc0JpZ0VuZGlhbikgPT09ICdib29sZWFuJyxcbiAgICAgICAgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKTtcblxuICAgIGFzc2VydC5vayhvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIG9mZnNldCcpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCArIDMgPCBidWZmZXIubGVuZ3RoLFxuICAgICAgICAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKTtcbiAgfVxuXG4gIGlmIChpc0JpZ0VuZGlhbikge1xuICAgIHZhbCA9IGJ1ZmZlci5wYXJlbnRbYnVmZmVyLm9mZnNldCArIG9mZnNldCArIDFdIDw8IDE2O1xuICAgIHZhbCB8PSBidWZmZXIucGFyZW50W2J1ZmZlci5vZmZzZXQgKyBvZmZzZXQgKyAyXSA8PCA4O1xuICAgIHZhbCB8PSBidWZmZXIucGFyZW50W2J1ZmZlci5vZmZzZXQgKyBvZmZzZXQgKyAzXTtcbiAgICB2YWwgPSB2YWwgKyAoYnVmZmVyLnBhcmVudFtidWZmZXIub2Zmc2V0ICsgb2Zmc2V0XSA8PCAyNCA+Pj4gMCk7XG4gIH0gZWxzZSB7XG4gICAgdmFsID0gYnVmZmVyLnBhcmVudFtidWZmZXIub2Zmc2V0ICsgb2Zmc2V0ICsgMl0gPDwgMTY7XG4gICAgdmFsIHw9IGJ1ZmZlci5wYXJlbnRbYnVmZmVyLm9mZnNldCArIG9mZnNldCArIDFdIDw8IDg7XG4gICAgdmFsIHw9IGJ1ZmZlci5wYXJlbnRbYnVmZmVyLm9mZnNldCArIG9mZnNldF07XG4gICAgdmFsID0gdmFsICsgKGJ1ZmZlci5wYXJlbnRbYnVmZmVyLm9mZnNldCArIG9mZnNldCArIDNdIDw8IDI0ID4+PiAwKTtcbiAgfVxuXG4gIHJldHVybiB2YWw7XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFID0gZnVuY3Rpb24ob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gcmVhZFVJbnQzMih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydCk7XG59O1xuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJCRSA9IGZ1bmN0aW9uKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHJlYWRVSW50MzIodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydCk7XG59O1xuXG5cbi8qXG4gKiBTaWduZWQgaW50ZWdlciB0eXBlcywgeWF5IHRlYW0hIEEgcmVtaW5kZXIgb24gaG93IHR3bydzIGNvbXBsZW1lbnQgYWN0dWFsbHlcbiAqIHdvcmtzLiBUaGUgZmlyc3QgYml0IGlzIHRoZSBzaWduZWQgYml0LCBpLmUuIHRlbGxzIHVzIHdoZXRoZXIgb3Igbm90IHRoZVxuICogbnVtYmVyIHNob3VsZCBiZSBwb3NpdGl2ZSBvciBuZWdhdGl2ZS4gSWYgdGhlIHR3bydzIGNvbXBsZW1lbnQgdmFsdWUgaXNcbiAqIHBvc2l0aXZlLCB0aGVuIHdlJ3JlIGRvbmUsIGFzIGl0J3MgZXF1aXZhbGVudCB0byB0aGUgdW5zaWduZWQgcmVwcmVzZW50YXRpb24uXG4gKlxuICogTm93IGlmIHRoZSBudW1iZXIgaXMgcG9zaXRpdmUsIHlvdSdyZSBwcmV0dHkgbXVjaCBkb25lLCB5b3UgY2FuIGp1c3QgbGV2ZXJhZ2VcbiAqIHRoZSB1bnNpZ25lZCB0cmFuc2xhdGlvbnMgYW5kIHJldHVybiB0aG9zZS4gVW5mb3J0dW5hdGVseSwgbmVnYXRpdmUgbnVtYmVyc1xuICogYXJlbid0IHF1aXRlIHRoYXQgc3RyYWlnaHRmb3J3YXJkLlxuICpcbiAqIEF0IGZpcnN0IGdsYW5jZSwgb25lIG1pZ2h0IGJlIGluY2xpbmVkIHRvIHVzZSB0aGUgdHJhZGl0aW9uYWwgZm9ybXVsYSB0b1xuICogdHJhbnNsYXRlIGJpbmFyeSBudW1iZXJzIGJldHdlZW4gdGhlIHBvc2l0aXZlIGFuZCBuZWdhdGl2ZSB2YWx1ZXMgaW4gdHdvJ3NcbiAqIGNvbXBsZW1lbnQuIChUaG91Z2ggaXQgZG9lc24ndCBxdWl0ZSB3b3JrIGZvciB0aGUgbW9zdCBuZWdhdGl2ZSB2YWx1ZSlcbiAqIE1haW5seTpcbiAqICAtIGludmVydCBhbGwgdGhlIGJpdHNcbiAqICAtIGFkZCBvbmUgdG8gdGhlIHJlc3VsdFxuICpcbiAqIE9mIGNvdXJzZSwgdGhpcyBkb2Vzbid0IHF1aXRlIHdvcmsgaW4gSmF2YXNjcmlwdC4gVGFrZSBmb3IgZXhhbXBsZSB0aGUgdmFsdWVcbiAqIG9mIC0xMjguIFRoaXMgY291bGQgYmUgcmVwcmVzZW50ZWQgaW4gMTYgYml0cyAoYmlnLWVuZGlhbikgYXMgMHhmZjgwLiBCdXQgb2ZcbiAqIGNvdXJzZSwgSmF2YXNjcmlwdCB3aWxsIGRvIHRoZSBmb2xsb3dpbmc6XG4gKlxuICogPiB+MHhmZjgwXG4gKiAtNjU0MDlcbiAqXG4gKiBXaG9oIHRoZXJlLCBKYXZhc2NyaXB0LCB0aGF0J3Mgbm90IHF1aXRlIHJpZ2h0LiBCdXQgd2FpdCwgYWNjb3JkaW5nIHRvXG4gKiBKYXZhc2NyaXB0IHRoYXQncyBwZXJmZWN0bHkgY29ycmVjdC4gV2hlbiBKYXZhc2NyaXB0IGVuZHMgdXAgc2VlaW5nIHRoZVxuICogY29uc3RhbnQgMHhmZjgwLCBpdCBoYXMgbm8gbm90aW9uIHRoYXQgaXQgaXMgYWN0dWFsbHkgYSBzaWduZWQgbnVtYmVyLiBJdFxuICogYXNzdW1lcyB0aGF0IHdlJ3ZlIGlucHV0IHRoZSB1bnNpZ25lZCB2YWx1ZSAweGZmODAuIFRodXMsIHdoZW4gaXQgZG9lcyB0aGVcbiAqIGJpbmFyeSBuZWdhdGlvbiwgaXQgY2FzdHMgaXQgaW50byBhIHNpZ25lZCB2YWx1ZSwgKHBvc2l0aXZlIDB4ZmY4MCkuIFRoZW5cbiAqIHdoZW4geW91IHBlcmZvcm0gYmluYXJ5IG5lZ2F0aW9uIG9uIHRoYXQsIGl0IHR1cm5zIGl0IGludG8gYSBuZWdhdGl2ZSBudW1iZXIuXG4gKlxuICogSW5zdGVhZCwgd2UncmUgZ29pbmcgdG8gaGF2ZSB0byB1c2UgdGhlIGZvbGxvd2luZyBnZW5lcmFsIGZvcm11bGEsIHRoYXQgd29ya3NcbiAqIGluIGEgcmF0aGVyIEphdmFzY3JpcHQgZnJpZW5kbHkgd2F5LiBJJ20gZ2xhZCB3ZSBkb24ndCBzdXBwb3J0IHRoaXMga2luZCBvZlxuICogd2VpcmQgbnVtYmVyaW5nIHNjaGVtZSBpbiB0aGUga2VybmVsLlxuICpcbiAqIChCSVQtTUFYIC0gKHVuc2lnbmVkKXZhbCArIDEpICogLTFcbiAqXG4gKiBUaGUgYXN0dXRlIG9ic2VydmVyLCBtYXkgdGhpbmsgdGhhdCB0aGlzIGRvZXNuJ3QgbWFrZSBzZW5zZSBmb3IgOC1iaXQgbnVtYmVyc1xuICogKHJlYWxseSBpdCBpc24ndCBuZWNlc3NhcnkgZm9yIHRoZW0pLiBIb3dldmVyLCB3aGVuIHlvdSBnZXQgMTYtYml0IG51bWJlcnMsXG4gKiB5b3UgZG8uIExldCdzIGdvIGJhY2sgdG8gb3VyIHByaW9yIGV4YW1wbGUgYW5kIHNlZSBob3cgdGhpcyB3aWxsIGxvb2s6XG4gKlxuICogKDB4ZmZmZiAtIDB4ZmY4MCArIDEpICogLTFcbiAqICgweDAwN2YgKyAxKSAqIC0xXG4gKiAoMHgwMDgwKSAqIC0xXG4gKi9cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDggPSBmdW5jdGlvbihvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhciBidWZmZXIgPSB0aGlzO1xuICB2YXIgbmVnO1xuXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQub2sob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyBvZmZzZXQnKTtcblxuICAgIGFzc2VydC5vayhvZmZzZXQgPCBidWZmZXIubGVuZ3RoLFxuICAgICAgICAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKTtcbiAgfVxuXG4gIG5lZyA9IGJ1ZmZlci5wYXJlbnRbYnVmZmVyLm9mZnNldCArIG9mZnNldF0gJiAweDgwO1xuICBpZiAoIW5lZykge1xuICAgIHJldHVybiAoYnVmZmVyLnBhcmVudFtidWZmZXIub2Zmc2V0ICsgb2Zmc2V0XSk7XG4gIH1cblxuICByZXR1cm4gKCgweGZmIC0gYnVmZmVyLnBhcmVudFtidWZmZXIub2Zmc2V0ICsgb2Zmc2V0XSArIDEpICogLTEpO1xufTtcblxuZnVuY3Rpb24gcmVhZEludDE2KGJ1ZmZlciwgb2Zmc2V0LCBpc0JpZ0VuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgdmFyIG5lZywgdmFsO1xuXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQub2sodHlwZW9mIChpc0JpZ0VuZGlhbikgPT09ICdib29sZWFuJyxcbiAgICAgICAgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKTtcblxuICAgIGFzc2VydC5vayhvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIG9mZnNldCcpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCArIDEgPCBidWZmZXIubGVuZ3RoLFxuICAgICAgICAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKTtcbiAgfVxuXG4gIHZhbCA9IHJlYWRVSW50MTYoYnVmZmVyLCBvZmZzZXQsIGlzQmlnRW5kaWFuLCBub0Fzc2VydCk7XG4gIG5lZyA9IHZhbCAmIDB4ODAwMDtcbiAgaWYgKCFuZWcpIHtcbiAgICByZXR1cm4gdmFsO1xuICB9XG5cbiAgcmV0dXJuICgweGZmZmYgLSB2YWwgKyAxKSAqIC0xO1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkxFID0gZnVuY3Rpb24ob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gcmVhZEludDE2KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KTtcbn07XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2QkUgPSBmdW5jdGlvbihvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiByZWFkSW50MTYodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydCk7XG59O1xuXG5mdW5jdGlvbiByZWFkSW50MzIoYnVmZmVyLCBvZmZzZXQsIGlzQmlnRW5kaWFuLCBub0Fzc2VydCkge1xuICB2YXIgbmVnLCB2YWw7XG5cbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydC5vayh0eXBlb2YgKGlzQmlnRW5kaWFuKSA9PT0gJ2Jvb2xlYW4nLFxuICAgICAgICAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3Npbmcgb2Zmc2V0Jyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0ICsgMyA8IGJ1ZmZlci5sZW5ndGgsXG4gICAgICAgICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpO1xuICB9XG5cbiAgdmFsID0gcmVhZFVJbnQzMihidWZmZXIsIG9mZnNldCwgaXNCaWdFbmRpYW4sIG5vQXNzZXJ0KTtcbiAgbmVnID0gdmFsICYgMHg4MDAwMDAwMDtcbiAgaWYgKCFuZWcpIHtcbiAgICByZXR1cm4gKHZhbCk7XG4gIH1cblxuICByZXR1cm4gKDB4ZmZmZmZmZmYgLSB2YWwgKyAxKSAqIC0xO1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkxFID0gZnVuY3Rpb24ob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gcmVhZEludDMyKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KTtcbn07XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyQkUgPSBmdW5jdGlvbihvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiByZWFkSW50MzIodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydCk7XG59O1xuXG5mdW5jdGlvbiByZWFkRmxvYXQoYnVmZmVyLCBvZmZzZXQsIGlzQmlnRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0Lm9rKHR5cGVvZiAoaXNCaWdFbmRpYW4pID09PSAnYm9vbGVhbicsXG4gICAgICAgICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0ICsgMyA8IGJ1ZmZlci5sZW5ndGgsXG4gICAgICAgICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpO1xuICB9XG5cbiAgcmV0dXJuIHJlcXVpcmUoJy4vYnVmZmVyX2llZWU3NTQnKS5yZWFkSUVFRTc1NChidWZmZXIsIG9mZnNldCwgaXNCaWdFbmRpYW4sXG4gICAgICAyMywgNCk7XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0TEUgPSBmdW5jdGlvbihvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiByZWFkRmxvYXQodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpO1xufTtcblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRCRSA9IGZ1bmN0aW9uKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHJlYWRGbG9hdCh0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KTtcbn07XG5cbmZ1bmN0aW9uIHJlYWREb3VibGUoYnVmZmVyLCBvZmZzZXQsIGlzQmlnRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0Lm9rKHR5cGVvZiAoaXNCaWdFbmRpYW4pID09PSAnYm9vbGVhbicsXG4gICAgICAgICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0ICsgNyA8IGJ1ZmZlci5sZW5ndGgsXG4gICAgICAgICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpO1xuICB9XG5cbiAgcmV0dXJuIHJlcXVpcmUoJy4vYnVmZmVyX2llZWU3NTQnKS5yZWFkSUVFRTc1NChidWZmZXIsIG9mZnNldCwgaXNCaWdFbmRpYW4sXG4gICAgICA1MiwgOCk7XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUxFID0gZnVuY3Rpb24ob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gcmVhZERvdWJsZSh0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydCk7XG59O1xuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVCRSA9IGZ1bmN0aW9uKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHJlYWREb3VibGUodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydCk7XG59O1xuXG5cbi8qXG4gKiBXZSBoYXZlIHRvIG1ha2Ugc3VyZSB0aGF0IHRoZSB2YWx1ZSBpcyBhIHZhbGlkIGludGVnZXIuIFRoaXMgbWVhbnMgdGhhdCBpdCBpc1xuICogbm9uLW5lZ2F0aXZlLiBJdCBoYXMgbm8gZnJhY3Rpb25hbCBjb21wb25lbnQgYW5kIHRoYXQgaXQgZG9lcyBub3QgZXhjZWVkIHRoZVxuICogbWF4aW11bSBhbGxvd2VkIHZhbHVlLlxuICpcbiAqICAgICAgdmFsdWUgICAgICAgICAgIFRoZSBudW1iZXIgdG8gY2hlY2sgZm9yIHZhbGlkaXR5XG4gKlxuICogICAgICBtYXggICAgICAgICAgICAgVGhlIG1heGltdW0gdmFsdWVcbiAqL1xuZnVuY3Rpb24gdmVyaWZ1aW50KHZhbHVlLCBtYXgpIHtcbiAgYXNzZXJ0Lm9rKHR5cGVvZiAodmFsdWUpID09ICdudW1iZXInLFxuICAgICAgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKTtcblxuICBhc3NlcnQub2sodmFsdWUgPj0gMCxcbiAgICAgICdzcGVjaWZpZWQgYSBuZWdhdGl2ZSB2YWx1ZSBmb3Igd3JpdGluZyBhbiB1bnNpZ25lZCB2YWx1ZScpO1xuXG4gIGFzc2VydC5vayh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBpcyBsYXJnZXIgdGhhbiBtYXhpbXVtIHZhbHVlIGZvciB0eXBlJyk7XG5cbiAgYXNzZXJ0Lm9rKE1hdGguZmxvb3IodmFsdWUpID09PSB2YWx1ZSwgJ3ZhbHVlIGhhcyBhIGZyYWN0aW9uYWwgY29tcG9uZW50Jyk7XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IGZ1bmN0aW9uKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhciBidWZmZXIgPSB0aGlzO1xuXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQub2sodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3NpbmcgdmFsdWUnKTtcblxuICAgIGFzc2VydC5vayhvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIG9mZnNldCcpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCA8IGJ1ZmZlci5sZW5ndGgsXG4gICAgICAgICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKTtcblxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZik7XG4gIH1cblxuICBidWZmZXIucGFyZW50W2J1ZmZlci5vZmZzZXQgKyBvZmZzZXRdID0gdmFsdWU7XG59O1xuXG5mdW5jdGlvbiB3cml0ZVVJbnQxNihidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzQmlnRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0Lm9rKHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIHZhbHVlJyk7XG5cbiAgICBhc3NlcnQub2sodHlwZW9mIChpc0JpZ0VuZGlhbikgPT09ICdib29sZWFuJyxcbiAgICAgICAgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKTtcblxuICAgIGFzc2VydC5vayhvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIG9mZnNldCcpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCArIDEgPCBidWZmZXIubGVuZ3RoLFxuICAgICAgICAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJyk7XG5cbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmZmZik7XG4gIH1cblxuICBpZiAoaXNCaWdFbmRpYW4pIHtcbiAgICBidWZmZXIucGFyZW50W2J1ZmZlci5vZmZzZXQgKyBvZmZzZXRdID0gKHZhbHVlICYgMHhmZjAwKSA+Pj4gODtcbiAgICBidWZmZXIucGFyZW50W2J1ZmZlci5vZmZzZXQgKyBvZmZzZXQgKyAxXSA9IHZhbHVlICYgMHgwMGZmO1xuICB9IGVsc2Uge1xuICAgIGJ1ZmZlci5wYXJlbnRbYnVmZmVyLm9mZnNldCArIG9mZnNldCArIDFdID0gKHZhbHVlICYgMHhmZjAwKSA+Pj4gODtcbiAgICBidWZmZXIucGFyZW50W2J1ZmZlci5vZmZzZXQgKyBvZmZzZXRdID0gdmFsdWUgJiAweDAwZmY7XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkxFID0gZnVuY3Rpb24odmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgd3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KTtcbn07XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZCRSA9IGZ1bmN0aW9uKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHdyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KTtcbn07XG5cbmZ1bmN0aW9uIHdyaXRlVUludDMyKGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNCaWdFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQub2sodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3NpbmcgdmFsdWUnKTtcblxuICAgIGFzc2VydC5vayh0eXBlb2YgKGlzQmlnRW5kaWFuKSA9PT0gJ2Jvb2xlYW4nLFxuICAgICAgICAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3Npbmcgb2Zmc2V0Jyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0ICsgMyA8IGJ1ZmZlci5sZW5ndGgsXG4gICAgICAgICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKTtcblxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZmZmZmZmZik7XG4gIH1cblxuICBpZiAoaXNCaWdFbmRpYW4pIHtcbiAgICBidWZmZXIucGFyZW50W2J1ZmZlci5vZmZzZXQgKyBvZmZzZXRdID0gKHZhbHVlID4+PiAyNCkgJiAweGZmO1xuICAgIGJ1ZmZlci5wYXJlbnRbYnVmZmVyLm9mZnNldCArIG9mZnNldCArIDFdID0gKHZhbHVlID4+PiAxNikgJiAweGZmO1xuICAgIGJ1ZmZlci5wYXJlbnRbYnVmZmVyLm9mZnNldCArIG9mZnNldCArIDJdID0gKHZhbHVlID4+PiA4KSAmIDB4ZmY7XG4gICAgYnVmZmVyLnBhcmVudFtidWZmZXIub2Zmc2V0ICsgb2Zmc2V0ICsgM10gPSB2YWx1ZSAmIDB4ZmY7XG4gIH0gZWxzZSB7XG4gICAgYnVmZmVyLnBhcmVudFtidWZmZXIub2Zmc2V0ICsgb2Zmc2V0ICsgM10gPSAodmFsdWUgPj4+IDI0KSAmIDB4ZmY7XG4gICAgYnVmZmVyLnBhcmVudFtidWZmZXIub2Zmc2V0ICsgb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KSAmIDB4ZmY7XG4gICAgYnVmZmVyLnBhcmVudFtidWZmZXIub2Zmc2V0ICsgb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpICYgMHhmZjtcbiAgICBidWZmZXIucGFyZW50W2J1ZmZlci5vZmZzZXQgKyBvZmZzZXRdID0gdmFsdWUgJiAweGZmO1xuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJMRSA9IGZ1bmN0aW9uKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydCk7XG59O1xuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyQkUgPSBmdW5jdGlvbih2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB3cml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydCk7XG59O1xuXG5cbi8qXG4gKiBXZSBub3cgbW92ZSBvbnRvIG91ciBmcmllbmRzIGluIHRoZSBzaWduZWQgbnVtYmVyIGNhdGVnb3J5LiBVbmxpa2UgdW5zaWduZWRcbiAqIG51bWJlcnMsIHdlJ3JlIGdvaW5nIHRvIGhhdmUgdG8gd29ycnkgYSBiaXQgbW9yZSBhYm91dCBob3cgd2UgcHV0IHZhbHVlcyBpbnRvXG4gKiBhcnJheXMuIFNpbmNlIHdlIGFyZSBvbmx5IHdvcnJ5aW5nIGFib3V0IHNpZ25lZCAzMi1iaXQgdmFsdWVzLCB3ZSdyZSBpblxuICogc2xpZ2h0bHkgYmV0dGVyIHNoYXBlLiBVbmZvcnR1bmF0ZWx5LCB3ZSByZWFsbHkgY2FuJ3QgZG8gb3VyIGZhdm9yaXRlIGJpbmFyeVxuICogJiBpbiB0aGlzIHN5c3RlbS4gSXQgcmVhbGx5IHNlZW1zIHRvIGRvIHRoZSB3cm9uZyB0aGluZy4gRm9yIGV4YW1wbGU6XG4gKlxuICogPiAtMzIgJiAweGZmXG4gKiAyMjRcbiAqXG4gKiBXaGF0J3MgaGFwcGVuaW5nIGFib3ZlIGlzIHJlYWxseTogMHhlMCAmIDB4ZmYgPSAweGUwLiBIb3dldmVyLCB0aGUgcmVzdWx0cyBvZlxuICogdGhpcyBhcmVuJ3QgdHJlYXRlZCBhcyBhIHNpZ25lZCBudW1iZXIuIFVsdGltYXRlbHkgYSBiYWQgdGhpbmcuXG4gKlxuICogV2hhdCB3ZSdyZSBnb2luZyB0byB3YW50IHRvIGRvIGlzIGJhc2ljYWxseSBjcmVhdGUgdGhlIHVuc2lnbmVkIGVxdWl2YWxlbnQgb2ZcbiAqIG91ciByZXByZXNlbnRhdGlvbiBhbmQgcGFzcyB0aGF0IG9mZiB0byB0aGUgd3VpbnQqIGZ1bmN0aW9ucy4gVG8gZG8gdGhhdFxuICogd2UncmUgZ29pbmcgdG8gZG8gdGhlIGZvbGxvd2luZzpcbiAqXG4gKiAgLSBpZiB0aGUgdmFsdWUgaXMgcG9zaXRpdmVcbiAqICAgICAgd2UgY2FuIHBhc3MgaXQgZGlyZWN0bHkgb2ZmIHRvIHRoZSBlcXVpdmFsZW50IHd1aW50XG4gKiAgLSBpZiB0aGUgdmFsdWUgaXMgbmVnYXRpdmVcbiAqICAgICAgd2UgZG8gdGhlIGZvbGxvd2luZyBjb21wdXRhdGlvbjpcbiAqICAgICAgICAgbWIgKyB2YWwgKyAxLCB3aGVyZVxuICogICAgICAgICBtYiAgIGlzIHRoZSBtYXhpbXVtIHVuc2lnbmVkIHZhbHVlIGluIHRoYXQgYnl0ZSBzaXplXG4gKiAgICAgICAgIHZhbCAgaXMgdGhlIEphdmFzY3JpcHQgbmVnYXRpdmUgaW50ZWdlclxuICpcbiAqXG4gKiBBcyBhIGNvbmNyZXRlIHZhbHVlLCB0YWtlIC0xMjguIEluIHNpZ25lZCAxNiBiaXRzIHRoaXMgd291bGQgYmUgMHhmZjgwLiBJZlxuICogeW91IGRvIG91dCB0aGUgY29tcHV0YXRpb25zOlxuICpcbiAqIDB4ZmZmZiAtIDEyOCArIDFcbiAqIDB4ZmZmZiAtIDEyN1xuICogMHhmZjgwXG4gKlxuICogWW91IGNhbiB0aGVuIGVuY29kZSB0aGlzIHZhbHVlIGFzIHRoZSBzaWduZWQgdmVyc2lvbi4gVGhpcyBpcyByZWFsbHkgcmF0aGVyXG4gKiBoYWNreSwgYnV0IGl0IHNob3VsZCB3b3JrIGFuZCBnZXQgdGhlIGpvYiBkb25lIHdoaWNoIGlzIG91ciBnb2FsIGhlcmUuXG4gKi9cblxuLypcbiAqIEEgc2VyaWVzIG9mIGNoZWNrcyB0byBtYWtlIHN1cmUgd2UgYWN0dWFsbHkgaGF2ZSBhIHNpZ25lZCAzMi1iaXQgbnVtYmVyXG4gKi9cbmZ1bmN0aW9uIHZlcmlmc2ludCh2YWx1ZSwgbWF4LCBtaW4pIHtcbiAgYXNzZXJ0Lm9rKHR5cGVvZiAodmFsdWUpID09ICdudW1iZXInLFxuICAgICAgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKTtcblxuICBhc3NlcnQub2sodmFsdWUgPD0gbWF4LCAndmFsdWUgbGFyZ2VyIHRoYW4gbWF4aW11bSBhbGxvd2VkIHZhbHVlJyk7XG5cbiAgYXNzZXJ0Lm9rKHZhbHVlID49IG1pbiwgJ3ZhbHVlIHNtYWxsZXIgdGhhbiBtaW5pbXVtIGFsbG93ZWQgdmFsdWUnKTtcblxuICBhc3NlcnQub2soTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlLCAndmFsdWUgaGFzIGEgZnJhY3Rpb25hbCBjb21wb25lbnQnKTtcbn1cblxuZnVuY3Rpb24gdmVyaWZJRUVFNzU0KHZhbHVlLCBtYXgsIG1pbikge1xuICBhc3NlcnQub2sodHlwZW9mICh2YWx1ZSkgPT0gJ251bWJlcicsXG4gICAgICAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpO1xuXG4gIGFzc2VydC5vayh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBsYXJnZXIgdGhhbiBtYXhpbXVtIGFsbG93ZWQgdmFsdWUnKTtcblxuICBhc3NlcnQub2sodmFsdWUgPj0gbWluLCAndmFsdWUgc21hbGxlciB0aGFuIG1pbmltdW0gYWxsb3dlZCB2YWx1ZScpO1xufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50OCA9IGZ1bmN0aW9uKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhciBidWZmZXIgPSB0aGlzO1xuXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQub2sodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3NpbmcgdmFsdWUnKTtcblxuICAgIGFzc2VydC5vayhvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIG9mZnNldCcpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCA8IGJ1ZmZlci5sZW5ndGgsXG4gICAgICAgICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKTtcblxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZiwgLTB4ODApO1xuICB9XG5cbiAgaWYgKHZhbHVlID49IDApIHtcbiAgICBidWZmZXIud3JpdGVVSW50OCh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCk7XG4gIH0gZWxzZSB7XG4gICAgYnVmZmVyLndyaXRlVUludDgoMHhmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBub0Fzc2VydCk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHdyaXRlSW50MTYoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0JpZ0VuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydC5vayh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyB2YWx1ZScpO1xuXG4gICAgYXNzZXJ0Lm9rKHR5cGVvZiAoaXNCaWdFbmRpYW4pID09PSAnYm9vbGVhbicsXG4gICAgICAgICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyBvZmZzZXQnKTtcblxuICAgIGFzc2VydC5vayhvZmZzZXQgKyAxIDwgYnVmZmVyLmxlbmd0aCxcbiAgICAgICAgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpO1xuXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmZmYsIC0weDgwMDApO1xuICB9XG5cbiAgaWYgKHZhbHVlID49IDApIHtcbiAgICB3cml0ZVVJbnQxNihidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzQmlnRW5kaWFuLCBub0Fzc2VydCk7XG4gIH0gZWxzZSB7XG4gICAgd3JpdGVVSW50MTYoYnVmZmVyLCAweGZmZmYgKyB2YWx1ZSArIDEsIG9mZnNldCwgaXNCaWdFbmRpYW4sIG5vQXNzZXJ0KTtcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZMRSA9IGZ1bmN0aW9uKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHdyaXRlSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KTtcbn07XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkJFID0gZnVuY3Rpb24odmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgd3JpdGVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydCk7XG59O1xuXG5mdW5jdGlvbiB3cml0ZUludDMyKGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNCaWdFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQub2sodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3NpbmcgdmFsdWUnKTtcblxuICAgIGFzc2VydC5vayh0eXBlb2YgKGlzQmlnRW5kaWFuKSA9PT0gJ2Jvb2xlYW4nLFxuICAgICAgICAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3Npbmcgb2Zmc2V0Jyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0ICsgMyA8IGJ1ZmZlci5sZW5ndGgsXG4gICAgICAgICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKTtcblxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApO1xuICB9XG5cbiAgaWYgKHZhbHVlID49IDApIHtcbiAgICB3cml0ZVVJbnQzMihidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzQmlnRW5kaWFuLCBub0Fzc2VydCk7XG4gIH0gZWxzZSB7XG4gICAgd3JpdGVVSW50MzIoYnVmZmVyLCAweGZmZmZmZmZmICsgdmFsdWUgKyAxLCBvZmZzZXQsIGlzQmlnRW5kaWFuLCBub0Fzc2VydCk7XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyTEUgPSBmdW5jdGlvbih2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB3cml0ZUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydCk7XG59O1xuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJCRSA9IGZ1bmN0aW9uKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHdyaXRlSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpO1xufTtcblxuZnVuY3Rpb24gd3JpdGVGbG9hdChidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzQmlnRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0Lm9rKHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIHZhbHVlJyk7XG5cbiAgICBhc3NlcnQub2sodHlwZW9mIChpc0JpZ0VuZGlhbikgPT09ICdib29sZWFuJyxcbiAgICAgICAgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKTtcblxuICAgIGFzc2VydC5vayhvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIG9mZnNldCcpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCArIDMgPCBidWZmZXIubGVuZ3RoLFxuICAgICAgICAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJyk7XG5cbiAgICB2ZXJpZklFRUU3NTQodmFsdWUsIDMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgsIC0zLjQwMjgyMzQ2NjM4NTI4ODZlKzM4KTtcbiAgfVxuXG4gIHJlcXVpcmUoJy4vYnVmZmVyX2llZWU3NTQnKS53cml0ZUlFRUU3NTQoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0JpZ0VuZGlhbixcbiAgICAgIDIzLCA0KTtcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0TEUgPSBmdW5jdGlvbih2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB3cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydCk7XG59O1xuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRCRSA9IGZ1bmN0aW9uKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHdyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpO1xufTtcblxuZnVuY3Rpb24gd3JpdGVEb3VibGUoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0JpZ0VuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydC5vayh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyB2YWx1ZScpO1xuXG4gICAgYXNzZXJ0Lm9rKHR5cGVvZiAoaXNCaWdFbmRpYW4pID09PSAnYm9vbGVhbicsXG4gICAgICAgICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyBvZmZzZXQnKTtcblxuICAgIGFzc2VydC5vayhvZmZzZXQgKyA3IDwgYnVmZmVyLmxlbmd0aCxcbiAgICAgICAgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpO1xuXG4gICAgdmVyaWZJRUVFNzU0KHZhbHVlLCAxLjc5NzY5MzEzNDg2MjMxNTdFKzMwOCwgLTEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4KTtcbiAgfVxuXG4gIHJlcXVpcmUoJy4vYnVmZmVyX2llZWU3NTQnKS53cml0ZUlFRUU3NTQoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0JpZ0VuZGlhbixcbiAgICAgIDUyLCA4KTtcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUxFID0gZnVuY3Rpb24odmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KTtcbn07XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVCRSA9IGZ1bmN0aW9uKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHdyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KTtcbn07XG5cblNsb3dCdWZmZXIucHJvdG90eXBlLnJlYWRVSW50OCA9IEJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQ4O1xuU2xvd0J1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkxFID0gQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2TEU7XG5TbG93QnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2QkUgPSBCdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZCRTtcblNsb3dCdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJMRSA9IEJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFO1xuU2xvd0J1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkJFID0gQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyQkU7XG5TbG93QnVmZmVyLnByb3RvdHlwZS5yZWFkSW50OCA9IEJ1ZmZlci5wcm90b3R5cGUucmVhZEludDg7XG5TbG93QnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZMRSA9IEJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEU7XG5TbG93QnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZCRSA9IEJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2QkU7XG5TbG93QnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJMRSA9IEJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyTEU7XG5TbG93QnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJCRSA9IEJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyQkU7XG5TbG93QnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRMRSA9IEJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0TEU7XG5TbG93QnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRCRSA9IEJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0QkU7XG5TbG93QnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlTEUgPSBCdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVMRTtcblNsb3dCdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVCRSA9IEJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUJFO1xuU2xvd0J1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IEJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50ODtcblNsb3dCdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEUgPSBCdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEU7XG5TbG93QnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkJFID0gQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkJFO1xuU2xvd0J1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJMRSA9IEJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJMRTtcblNsb3dCdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyQkUgPSBCdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyQkU7XG5TbG93QnVmZmVyLnByb3RvdHlwZS53cml0ZUludDggPSBCdWZmZXIucHJvdG90eXBlLndyaXRlSW50ODtcblNsb3dCdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZMRSA9IEJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkxFO1xuU2xvd0J1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkJFID0gQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2QkU7XG5TbG93QnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyTEUgPSBCdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJMRTtcblNsb3dCdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJCRSA9IEJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkJFO1xuU2xvd0J1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdExFID0gQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0TEU7XG5TbG93QnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0QkUgPSBCdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRCRTtcblNsb3dCdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlTEUgPSBCdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlTEU7XG5TbG93QnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUJFID0gQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUJFO1xuXG59LHtcImFzc2VydFwiOjEsXCIuL2J1ZmZlcl9pZWVlNzU0XCI6OCxcImJhc2U2NC1qc1wiOjl9XSw5OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbihmdW5jdGlvbiAoZXhwb3J0cykge1xuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIGxvb2t1cCA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJztcblxuXHRmdW5jdGlvbiBiNjRUb0J5dGVBcnJheShiNjQpIHtcblx0XHR2YXIgaSwgaiwgbCwgdG1wLCBwbGFjZUhvbGRlcnMsIGFycjtcblx0XG5cdFx0aWYgKGI2NC5sZW5ndGggJSA0ID4gMCkge1xuXHRcdFx0dGhyb3cgJ0ludmFsaWQgc3RyaW5nLiBMZW5ndGggbXVzdCBiZSBhIG11bHRpcGxlIG9mIDQnO1xuXHRcdH1cblxuXHRcdC8vIHRoZSBudW1iZXIgb2YgZXF1YWwgc2lnbnMgKHBsYWNlIGhvbGRlcnMpXG5cdFx0Ly8gaWYgdGhlcmUgYXJlIHR3byBwbGFjZWhvbGRlcnMsIHRoYW4gdGhlIHR3byBjaGFyYWN0ZXJzIGJlZm9yZSBpdFxuXHRcdC8vIHJlcHJlc2VudCBvbmUgYnl0ZVxuXHRcdC8vIGlmIHRoZXJlIGlzIG9ubHkgb25lLCB0aGVuIHRoZSB0aHJlZSBjaGFyYWN0ZXJzIGJlZm9yZSBpdCByZXByZXNlbnQgMiBieXRlc1xuXHRcdC8vIHRoaXMgaXMganVzdCBhIGNoZWFwIGhhY2sgdG8gbm90IGRvIGluZGV4T2YgdHdpY2Vcblx0XHRwbGFjZUhvbGRlcnMgPSBiNjQuaW5kZXhPZignPScpO1xuXHRcdHBsYWNlSG9sZGVycyA9IHBsYWNlSG9sZGVycyA+IDAgPyBiNjQubGVuZ3RoIC0gcGxhY2VIb2xkZXJzIDogMDtcblxuXHRcdC8vIGJhc2U2NCBpcyA0LzMgKyB1cCB0byB0d28gY2hhcmFjdGVycyBvZiB0aGUgb3JpZ2luYWwgZGF0YVxuXHRcdGFyciA9IFtdOy8vbmV3IFVpbnQ4QXJyYXkoYjY0Lmxlbmd0aCAqIDMgLyA0IC0gcGxhY2VIb2xkZXJzKTtcblxuXHRcdC8vIGlmIHRoZXJlIGFyZSBwbGFjZWhvbGRlcnMsIG9ubHkgZ2V0IHVwIHRvIHRoZSBsYXN0IGNvbXBsZXRlIDQgY2hhcnNcblx0XHRsID0gcGxhY2VIb2xkZXJzID4gMCA/IGI2NC5sZW5ndGggLSA0IDogYjY0Lmxlbmd0aDtcblxuXHRcdGZvciAoaSA9IDAsIGogPSAwOyBpIDwgbDsgaSArPSA0LCBqICs9IDMpIHtcblx0XHRcdHRtcCA9IChsb29rdXAuaW5kZXhPZihiNjRbaV0pIDw8IDE4KSB8IChsb29rdXAuaW5kZXhPZihiNjRbaSArIDFdKSA8PCAxMikgfCAobG9va3VwLmluZGV4T2YoYjY0W2kgKyAyXSkgPDwgNikgfCBsb29rdXAuaW5kZXhPZihiNjRbaSArIDNdKTtcblx0XHRcdGFyci5wdXNoKCh0bXAgJiAweEZGMDAwMCkgPj4gMTYpO1xuXHRcdFx0YXJyLnB1c2goKHRtcCAmIDB4RkYwMCkgPj4gOCk7XG5cdFx0XHRhcnIucHVzaCh0bXAgJiAweEZGKTtcblx0XHR9XG5cblx0XHRpZiAocGxhY2VIb2xkZXJzID09PSAyKSB7XG5cdFx0XHR0bXAgPSAobG9va3VwLmluZGV4T2YoYjY0W2ldKSA8PCAyKSB8IChsb29rdXAuaW5kZXhPZihiNjRbaSArIDFdKSA+PiA0KTtcblx0XHRcdGFyci5wdXNoKHRtcCAmIDB4RkYpO1xuXHRcdH0gZWxzZSBpZiAocGxhY2VIb2xkZXJzID09PSAxKSB7XG5cdFx0XHR0bXAgPSAobG9va3VwLmluZGV4T2YoYjY0W2ldKSA8PCAxMCkgfCAobG9va3VwLmluZGV4T2YoYjY0W2kgKyAxXSkgPDwgNCkgfCAobG9va3VwLmluZGV4T2YoYjY0W2kgKyAyXSkgPj4gMik7XG5cdFx0XHRhcnIucHVzaCgodG1wID4+IDgpICYgMHhGRik7XG5cdFx0XHRhcnIucHVzaCh0bXAgJiAweEZGKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gYXJyO1xuXHR9XG5cblx0ZnVuY3Rpb24gdWludDhUb0Jhc2U2NCh1aW50OCkge1xuXHRcdHZhciBpLFxuXHRcdFx0ZXh0cmFCeXRlcyA9IHVpbnQ4Lmxlbmd0aCAlIDMsIC8vIGlmIHdlIGhhdmUgMSBieXRlIGxlZnQsIHBhZCAyIGJ5dGVzXG5cdFx0XHRvdXRwdXQgPSBcIlwiLFxuXHRcdFx0dGVtcCwgbGVuZ3RoO1xuXG5cdFx0ZnVuY3Rpb24gdHJpcGxldFRvQmFzZTY0IChudW0pIHtcblx0XHRcdHJldHVybiBsb29rdXBbbnVtID4+IDE4ICYgMHgzRl0gKyBsb29rdXBbbnVtID4+IDEyICYgMHgzRl0gKyBsb29rdXBbbnVtID4+IDYgJiAweDNGXSArIGxvb2t1cFtudW0gJiAweDNGXTtcblx0XHR9O1xuXG5cdFx0Ly8gZ28gdGhyb3VnaCB0aGUgYXJyYXkgZXZlcnkgdGhyZWUgYnl0ZXMsIHdlJ2xsIGRlYWwgd2l0aCB0cmFpbGluZyBzdHVmZiBsYXRlclxuXHRcdGZvciAoaSA9IDAsIGxlbmd0aCA9IHVpbnQ4Lmxlbmd0aCAtIGV4dHJhQnl0ZXM7IGkgPCBsZW5ndGg7IGkgKz0gMykge1xuXHRcdFx0dGVtcCA9ICh1aW50OFtpXSA8PCAxNikgKyAodWludDhbaSArIDFdIDw8IDgpICsgKHVpbnQ4W2kgKyAyXSk7XG5cdFx0XHRvdXRwdXQgKz0gdHJpcGxldFRvQmFzZTY0KHRlbXApO1xuXHRcdH1cblxuXHRcdC8vIHBhZCB0aGUgZW5kIHdpdGggemVyb3MsIGJ1dCBtYWtlIHN1cmUgdG8gbm90IGZvcmdldCB0aGUgZXh0cmEgYnl0ZXNcblx0XHRzd2l0Y2ggKGV4dHJhQnl0ZXMpIHtcblx0XHRcdGNhc2UgMTpcblx0XHRcdFx0dGVtcCA9IHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDFdO1xuXHRcdFx0XHRvdXRwdXQgKz0gbG9va3VwW3RlbXAgPj4gMl07XG5cdFx0XHRcdG91dHB1dCArPSBsb29rdXBbKHRlbXAgPDwgNCkgJiAweDNGXTtcblx0XHRcdFx0b3V0cHV0ICs9ICc9PSc7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHR0ZW1wID0gKHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDJdIDw8IDgpICsgKHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDFdKTtcblx0XHRcdFx0b3V0cHV0ICs9IGxvb2t1cFt0ZW1wID4+IDEwXTtcblx0XHRcdFx0b3V0cHV0ICs9IGxvb2t1cFsodGVtcCA+PiA0KSAmIDB4M0ZdO1xuXHRcdFx0XHRvdXRwdXQgKz0gbG9va3VwWyh0ZW1wIDw8IDIpICYgMHgzRl07XG5cdFx0XHRcdG91dHB1dCArPSAnPSc7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblxuXHRcdHJldHVybiBvdXRwdXQ7XG5cdH1cblxuXHRtb2R1bGUuZXhwb3J0cy50b0J5dGVBcnJheSA9IGI2NFRvQnl0ZUFycmF5O1xuXHRtb2R1bGUuZXhwb3J0cy5mcm9tQnl0ZUFycmF5ID0gdWludDhUb0Jhc2U2NDtcbn0oKSk7XG5cbn0se31dfSx7fSxbXSlcbjs7bW9kdWxlLmV4cG9ydHM9cmVxdWlyZShcImJ1ZmZlci1icm93c2VyaWZ5XCIpXG4iLCJ2YXIgQnVmZmVyPXJlcXVpcmUoXCJfX2Jyb3dzZXJpZnlfQnVmZmVyXCIpLkJ1ZmZlcjtcbihmdW5jdGlvbiAoZ2xvYmFsLCBtb2R1bGUpIHtcblxuICBpZiAoJ3VuZGVmaW5lZCcgPT0gdHlwZW9mIG1vZHVsZSkge1xuICAgIHZhciBtb2R1bGUgPSB7IGV4cG9ydHM6IHt9IH1cbiAgICAgICwgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzXG4gIH1cblxuICAvKipcbiAgICogRXhwb3J0cy5cbiAgICovXG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBleHBlY3Q7XG4gIGV4cGVjdC5Bc3NlcnRpb24gPSBBc3NlcnRpb247XG5cbiAgLyoqXG4gICAqIEV4cG9ydHMgdmVyc2lvbi5cbiAgICovXG5cbiAgZXhwZWN0LnZlcnNpb24gPSAnMC4xLjInO1xuXG4gIC8qKlxuICAgKiBQb3NzaWJsZSBhc3NlcnRpb24gZmxhZ3MuXG4gICAqL1xuXG4gIHZhciBmbGFncyA9IHtcbiAgICAgIG5vdDogWyd0bycsICdiZScsICdoYXZlJywgJ2luY2x1ZGUnLCAnb25seSddXG4gICAgLCB0bzogWydiZScsICdoYXZlJywgJ2luY2x1ZGUnLCAnb25seScsICdub3QnXVxuICAgICwgb25seTogWydoYXZlJ11cbiAgICAsIGhhdmU6IFsnb3duJ11cbiAgICAsIGJlOiBbJ2FuJ11cbiAgfTtcblxuICBmdW5jdGlvbiBleHBlY3QgKG9iaikge1xuICAgIHJldHVybiBuZXcgQXNzZXJ0aW9uKG9iaik7XG4gIH1cblxuICAvKipcbiAgICogQ29uc3RydWN0b3JcbiAgICpcbiAgICogQGFwaSBwcml2YXRlXG4gICAqL1xuXG4gIGZ1bmN0aW9uIEFzc2VydGlvbiAob2JqLCBmbGFnLCBwYXJlbnQpIHtcbiAgICB0aGlzLm9iaiA9IG9iajtcbiAgICB0aGlzLmZsYWdzID0ge307XG5cbiAgICBpZiAodW5kZWZpbmVkICE9IHBhcmVudCkge1xuICAgICAgdGhpcy5mbGFnc1tmbGFnXSA9IHRydWU7XG5cbiAgICAgIGZvciAodmFyIGkgaW4gcGFyZW50LmZsYWdzKSB7XG4gICAgICAgIGlmIChwYXJlbnQuZmxhZ3MuaGFzT3duUHJvcGVydHkoaSkpIHtcbiAgICAgICAgICB0aGlzLmZsYWdzW2ldID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHZhciAkZmxhZ3MgPSBmbGFnID8gZmxhZ3NbZmxhZ10gOiBrZXlzKGZsYWdzKVxuICAgICAgLCBzZWxmID0gdGhpc1xuXG4gICAgaWYgKCRmbGFncykge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSAkZmxhZ3MubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIC8vIGF2b2lkIHJlY3Vyc2lvblxuICAgICAgICBpZiAodGhpcy5mbGFnc1skZmxhZ3NbaV1dKSBjb250aW51ZTtcblxuICAgICAgICB2YXIgbmFtZSA9ICRmbGFnc1tpXVxuICAgICAgICAgICwgYXNzZXJ0aW9uID0gbmV3IEFzc2VydGlvbih0aGlzLm9iaiwgbmFtZSwgdGhpcylcblxuICAgICAgICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgQXNzZXJ0aW9uLnByb3RvdHlwZVtuYW1lXSkge1xuICAgICAgICAgIC8vIGNsb25lIHRoZSBmdW5jdGlvbiwgbWFrZSBzdXJlIHdlIGRvbnQgdG91Y2ggdGhlIHByb3QgcmVmZXJlbmNlXG4gICAgICAgICAgdmFyIG9sZCA9IHRoaXNbbmFtZV07XG4gICAgICAgICAgdGhpc1tuYW1lXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBvbGQuYXBwbHkoc2VsZiwgYXJndW1lbnRzKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmb3IgKHZhciBmbiBpbiBBc3NlcnRpb24ucHJvdG90eXBlKSB7XG4gICAgICAgICAgICBpZiAoQXNzZXJ0aW9uLnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eShmbikgJiYgZm4gIT0gbmFtZSkge1xuICAgICAgICAgICAgICB0aGlzW25hbWVdW2ZuXSA9IGJpbmQoYXNzZXJ0aW9uW2ZuXSwgYXNzZXJ0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpc1tuYW1lXSA9IGFzc2VydGlvbjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogUGVyZm9ybXMgYW4gYXNzZXJ0aW9uXG4gICAqXG4gICAqIEBhcGkgcHJpdmF0ZVxuICAgKi9cblxuICBBc3NlcnRpb24ucHJvdG90eXBlLmFzc2VydCA9IGZ1bmN0aW9uICh0cnV0aCwgbXNnLCBlcnJvcikge1xuICAgIHZhciBtc2cgPSB0aGlzLmZsYWdzLm5vdCA/IGVycm9yIDogbXNnXG4gICAgICAsIG9rID0gdGhpcy5mbGFncy5ub3QgPyAhdHJ1dGggOiB0cnV0aDtcblxuICAgIGlmICghb2spIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihtc2cuY2FsbCh0aGlzKSk7XG4gICAgfVxuXG4gICAgdGhpcy5hbmQgPSBuZXcgQXNzZXJ0aW9uKHRoaXMub2JqKTtcbiAgfTtcblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIHZhbHVlIGlzIHRydXRoeVxuICAgKlxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBBc3NlcnRpb24ucHJvdG90eXBlLm9rID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuYXNzZXJ0KFxuICAgICAgICAhIXRoaXMub2JqXG4gICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBiZSB0cnV0aHknIH1cbiAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIGJlIGZhbHN5JyB9KTtcbiAgfTtcblxuICAvKipcbiAgICogQXNzZXJ0IHRoYXQgdGhlIGZ1bmN0aW9uIHRocm93cy5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbnxSZWdFeHB9IGNhbGxiYWNrLCBvciByZWdleHAgdG8gbWF0Y2ggZXJyb3Igc3RyaW5nIGFnYWluc3RcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgQXNzZXJ0aW9uLnByb3RvdHlwZS50aHJvd0Vycm9yID1cbiAgQXNzZXJ0aW9uLnByb3RvdHlwZS50aHJvd0V4Y2VwdGlvbiA9IGZ1bmN0aW9uIChmbikge1xuICAgIGV4cGVjdCh0aGlzLm9iaikudG8uYmUuYSgnZnVuY3Rpb24nKTtcblxuICAgIHZhciB0aHJvd24gPSBmYWxzZVxuICAgICAgLCBub3QgPSB0aGlzLmZsYWdzLm5vdFxuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMub2JqKCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGZuKSB7XG4gICAgICAgIGZuKGUpO1xuICAgICAgfSBlbHNlIGlmICgnb2JqZWN0JyA9PSB0eXBlb2YgZm4pIHtcbiAgICAgICAgdmFyIHN1YmplY3QgPSAnc3RyaW5nJyA9PSB0eXBlb2YgZSA/IGUgOiBlLm1lc3NhZ2U7XG4gICAgICAgIGlmIChub3QpIHtcbiAgICAgICAgICBleHBlY3Qoc3ViamVjdCkudG8ubm90Lm1hdGNoKGZuKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBleHBlY3Qoc3ViamVjdCkudG8ubWF0Y2goZm4pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aHJvd24gPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICgnb2JqZWN0JyA9PSB0eXBlb2YgZm4gJiYgbm90KSB7XG4gICAgICAvLyBpbiB0aGUgcHJlc2VuY2Ugb2YgYSBtYXRjaGVyLCBlbnN1cmUgdGhlIGBub3RgIG9ubHkgYXBwbGllcyB0b1xuICAgICAgLy8gdGhlIG1hdGNoaW5nLlxuICAgICAgdGhpcy5mbGFncy5ub3QgPSBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgbmFtZSA9IHRoaXMub2JqLm5hbWUgfHwgJ2ZuJztcbiAgICB0aGlzLmFzc2VydChcbiAgICAgICAgdGhyb3duXG4gICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIG5hbWUgKyAnIHRvIHRocm93IGFuIGV4Y2VwdGlvbicgfVxuICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBuYW1lICsgJyBub3QgdG8gdGhyb3cgYW4gZXhjZXB0aW9uJyB9KTtcbiAgfTtcblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBhcnJheSBpcyBlbXB0eS5cbiAgICpcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgQXNzZXJ0aW9uLnByb3RvdHlwZS5lbXB0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXhwZWN0YXRpb247XG5cbiAgICBpZiAoJ29iamVjdCcgPT0gdHlwZW9mIHRoaXMub2JqICYmIG51bGwgIT09IHRoaXMub2JqICYmICFpc0FycmF5KHRoaXMub2JqKSkge1xuICAgICAgaWYgKCdudW1iZXInID09IHR5cGVvZiB0aGlzLm9iai5sZW5ndGgpIHtcbiAgICAgICAgZXhwZWN0YXRpb24gPSAhdGhpcy5vYmoubGVuZ3RoO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZXhwZWN0YXRpb24gPSAha2V5cyh0aGlzLm9iaikubGVuZ3RoO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoJ3N0cmluZycgIT0gdHlwZW9mIHRoaXMub2JqKSB7XG4gICAgICAgIGV4cGVjdCh0aGlzLm9iaikudG8uYmUuYW4oJ29iamVjdCcpO1xuICAgICAgfVxuXG4gICAgICBleHBlY3QodGhpcy5vYmopLnRvLmhhdmUucHJvcGVydHkoJ2xlbmd0aCcpO1xuICAgICAgZXhwZWN0YXRpb24gPSAhdGhpcy5vYmoubGVuZ3RoO1xuICAgIH1cblxuICAgIHRoaXMuYXNzZXJ0KFxuICAgICAgICBleHBlY3RhdGlvblxuICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgdG8gYmUgZW1wdHknIH1cbiAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIG5vdCBiZSBlbXB0eScgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgb2JqIGV4YWN0bHkgZXF1YWxzIGFub3RoZXIuXG4gICAqXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIEFzc2VydGlvbi5wcm90b3R5cGUuYmUgPVxuICBBc3NlcnRpb24ucHJvdG90eXBlLmVxdWFsID0gZnVuY3Rpb24gKG9iaikge1xuICAgIHRoaXMuYXNzZXJ0KFxuICAgICAgICBvYmogPT09IHRoaXMub2JqXG4gICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBlcXVhbCAnICsgaShvYmopIH1cbiAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIG5vdCBlcXVhbCAnICsgaShvYmopIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIG9iaiBzb3J0b2YgZXF1YWxzIGFub3RoZXIuXG4gICAqXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIEFzc2VydGlvbi5wcm90b3R5cGUuZXFsID0gZnVuY3Rpb24gKG9iaikge1xuICAgIHRoaXMuYXNzZXJ0KFxuICAgICAgICBleHBlY3QuZXFsKG9iaiwgdGhpcy5vYmopXG4gICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBzb3J0IG9mIGVxdWFsICcgKyBpKG9iaikgfVxuICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgdG8gc29ydCBvZiBub3QgZXF1YWwgJyArIGkob2JqKSB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogQXNzZXJ0IHdpdGhpbiBzdGFydCB0byBmaW5pc2ggKGluY2x1c2l2ZSkuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzdGFydFxuICAgKiBAcGFyYW0ge051bWJlcn0gZmluaXNoXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIEFzc2VydGlvbi5wcm90b3R5cGUud2l0aGluID0gZnVuY3Rpb24gKHN0YXJ0LCBmaW5pc2gpIHtcbiAgICB2YXIgcmFuZ2UgPSBzdGFydCArICcuLicgKyBmaW5pc2g7XG4gICAgdGhpcy5hc3NlcnQoXG4gICAgICAgIHRoaXMub2JqID49IHN0YXJ0ICYmIHRoaXMub2JqIDw9IGZpbmlzaFxuICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgdG8gYmUgd2l0aGluICcgKyByYW5nZSB9XG4gICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBub3QgYmUgd2l0aGluICcgKyByYW5nZSB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogQXNzZXJ0IHR5cGVvZiAvIGluc3RhbmNlIG9mXG4gICAqXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIEFzc2VydGlvbi5wcm90b3R5cGUuYSA9XG4gIEFzc2VydGlvbi5wcm90b3R5cGUuYW4gPSBmdW5jdGlvbiAodHlwZSkge1xuICAgIGlmICgnc3RyaW5nJyA9PSB0eXBlb2YgdHlwZSkge1xuICAgICAgLy8gcHJvcGVyIGVuZ2xpc2ggaW4gZXJyb3IgbXNnXG4gICAgICB2YXIgbiA9IC9eW2FlaW91XS8udGVzdCh0eXBlKSA/ICduJyA6ICcnO1xuXG4gICAgICAvLyB0eXBlb2Ygd2l0aCBzdXBwb3J0IGZvciAnYXJyYXknXG4gICAgICB0aGlzLmFzc2VydChcbiAgICAgICAgICAnYXJyYXknID09IHR5cGUgPyBpc0FycmF5KHRoaXMub2JqKSA6XG4gICAgICAgICAgICAnb2JqZWN0JyA9PSB0eXBlXG4gICAgICAgICAgICAgID8gJ29iamVjdCcgPT0gdHlwZW9mIHRoaXMub2JqICYmIG51bGwgIT09IHRoaXMub2JqXG4gICAgICAgICAgICAgIDogdHlwZSA9PSB0eXBlb2YgdGhpcy5vYmpcbiAgICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgdG8gYmUgYScgKyBuICsgJyAnICsgdHlwZSB9XG4gICAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIG5vdCB0byBiZSBhJyArIG4gKyAnICcgKyB0eXBlIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBpbnN0YW5jZW9mXG4gICAgICB2YXIgbmFtZSA9IHR5cGUubmFtZSB8fCAnc3VwcGxpZWQgY29uc3RydWN0b3InO1xuICAgICAgdGhpcy5hc3NlcnQoXG4gICAgICAgICAgdGhpcy5vYmogaW5zdGFuY2VvZiB0eXBlXG4gICAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIGJlIGFuIGluc3RhbmNlIG9mICcgKyBuYW1lIH1cbiAgICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgbm90IHRvIGJlIGFuIGluc3RhbmNlIG9mICcgKyBuYW1lIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBc3NlcnQgbnVtZXJpYyB2YWx1ZSBhYm92ZSBfbl8uXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBuXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIEFzc2VydGlvbi5wcm90b3R5cGUuZ3JlYXRlclRoYW4gPVxuICBBc3NlcnRpb24ucHJvdG90eXBlLmFib3ZlID0gZnVuY3Rpb24gKG4pIHtcbiAgICB0aGlzLmFzc2VydChcbiAgICAgICAgdGhpcy5vYmogPiBuXG4gICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBiZSBhYm92ZSAnICsgbiB9XG4gICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBiZSBiZWxvdyAnICsgbiB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogQXNzZXJ0IG51bWVyaWMgdmFsdWUgYmVsb3cgX25fLlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gblxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBBc3NlcnRpb24ucHJvdG90eXBlLmxlc3NUaGFuID1cbiAgQXNzZXJ0aW9uLnByb3RvdHlwZS5iZWxvdyA9IGZ1bmN0aW9uIChuKSB7XG4gICAgdGhpcy5hc3NlcnQoXG4gICAgICAgIHRoaXMub2JqIDwgblxuICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgdG8gYmUgYmVsb3cgJyArIG4gfVxuICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgdG8gYmUgYWJvdmUgJyArIG4gfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIEFzc2VydCBzdHJpbmcgdmFsdWUgbWF0Y2hlcyBfcmVnZXhwXy5cbiAgICpcbiAgICogQHBhcmFtIHtSZWdFeHB9IHJlZ2V4cFxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBBc3NlcnRpb24ucHJvdG90eXBlLm1hdGNoID0gZnVuY3Rpb24gKHJlZ2V4cCkge1xuICAgIHRoaXMuYXNzZXJ0KFxuICAgICAgICByZWdleHAuZXhlYyh0aGlzLm9iailcbiAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIG1hdGNoICcgKyByZWdleHAgfVxuICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgbm90IHRvIG1hdGNoICcgKyByZWdleHAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIEFzc2VydCBwcm9wZXJ0eSBcImxlbmd0aFwiIGV4aXN0cyBhbmQgaGFzIHZhbHVlIG9mIF9uXy5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG5cbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgQXNzZXJ0aW9uLnByb3RvdHlwZS5sZW5ndGggPSBmdW5jdGlvbiAobikge1xuICAgIGV4cGVjdCh0aGlzLm9iaikudG8uaGF2ZS5wcm9wZXJ0eSgnbGVuZ3RoJyk7XG4gICAgdmFyIGxlbiA9IHRoaXMub2JqLmxlbmd0aDtcbiAgICB0aGlzLmFzc2VydChcbiAgICAgICAgbiA9PSBsZW5cbiAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIGhhdmUgYSBsZW5ndGggb2YgJyArIG4gKyAnIGJ1dCBnb3QgJyArIGxlbiB9XG4gICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBub3QgaGF2ZSBhIGxlbmd0aCBvZiAnICsgbGVuIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBc3NlcnQgcHJvcGVydHkgX25hbWVfIGV4aXN0cywgd2l0aCBvcHRpb25hbCBfdmFsXy5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAgICogQHBhcmFtIHtNaXhlZH0gdmFsXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIEFzc2VydGlvbi5wcm90b3R5cGUucHJvcGVydHkgPSBmdW5jdGlvbiAobmFtZSwgdmFsKSB7XG4gICAgaWYgKHRoaXMuZmxhZ3Mub3duKSB7XG4gICAgICB0aGlzLmFzc2VydChcbiAgICAgICAgICBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodGhpcy5vYmosIG5hbWUpXG4gICAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIGhhdmUgb3duIHByb3BlcnR5ICcgKyBpKG5hbWUpIH1cbiAgICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgdG8gbm90IGhhdmUgb3duIHByb3BlcnR5ICcgKyBpKG5hbWUpIH0pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZmxhZ3Mubm90ICYmIHVuZGVmaW5lZCAhPT0gdmFsKSB7XG4gICAgICBpZiAodW5kZWZpbmVkID09PSB0aGlzLm9ialtuYW1lXSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoaSh0aGlzLm9iaikgKyAnIGhhcyBubyBwcm9wZXJ0eSAnICsgaShuYW1lKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBoYXNQcm9wO1xuICAgICAgdHJ5IHtcbiAgICAgICAgaGFzUHJvcCA9IG5hbWUgaW4gdGhpcy5vYmpcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaGFzUHJvcCA9IHVuZGVmaW5lZCAhPT0gdGhpcy5vYmpbbmFtZV1cbiAgICAgIH1cblxuICAgICAgdGhpcy5hc3NlcnQoXG4gICAgICAgICAgaGFzUHJvcFxuICAgICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBoYXZlIGEgcHJvcGVydHkgJyArIGkobmFtZSkgfVxuICAgICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBub3QgaGF2ZSBhIHByb3BlcnR5ICcgKyBpKG5hbWUpIH0pO1xuICAgIH1cblxuICAgIGlmICh1bmRlZmluZWQgIT09IHZhbCkge1xuICAgICAgdGhpcy5hc3NlcnQoXG4gICAgICAgICAgdmFsID09PSB0aGlzLm9ialtuYW1lXVxuICAgICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBoYXZlIGEgcHJvcGVydHkgJyArIGkobmFtZSlcbiAgICAgICAgICArICcgb2YgJyArIGkodmFsKSArICcsIGJ1dCBnb3QgJyArIGkodGhpcy5vYmpbbmFtZV0pIH1cbiAgICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgdG8gbm90IGhhdmUgYSBwcm9wZXJ0eSAnICsgaShuYW1lKVxuICAgICAgICAgICsgJyBvZiAnICsgaSh2YWwpIH0pO1xuICAgIH1cblxuICAgIHRoaXMub2JqID0gdGhpcy5vYmpbbmFtZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIEFzc2VydCB0aGF0IHRoZSBhcnJheSBjb250YWlucyBfb2JqXyBvciBzdHJpbmcgY29udGFpbnMgX29ial8uXG4gICAqXG4gICAqIEBwYXJhbSB7TWl4ZWR9IG9ianxzdHJpbmdcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgQXNzZXJ0aW9uLnByb3RvdHlwZS5zdHJpbmcgPVxuICBBc3NlcnRpb24ucHJvdG90eXBlLmNvbnRhaW4gPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgaWYgKCdzdHJpbmcnID09IHR5cGVvZiB0aGlzLm9iaikge1xuICAgICAgdGhpcy5hc3NlcnQoXG4gICAgICAgICAgfnRoaXMub2JqLmluZGV4T2Yob2JqKVxuICAgICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBjb250YWluICcgKyBpKG9iaikgfVxuICAgICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBub3QgY29udGFpbiAnICsgaShvYmopIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFzc2VydChcbiAgICAgICAgICB+aW5kZXhPZih0aGlzLm9iaiwgb2JqKVxuICAgICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBjb250YWluICcgKyBpKG9iaikgfVxuICAgICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBub3QgY29udGFpbiAnICsgaShvYmopIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogQXNzZXJ0IGV4YWN0IGtleXMgb3IgaW5jbHVzaW9uIG9mIGtleXMgYnkgdXNpbmdcbiAgICogdGhlIGAub3duYCBtb2RpZmllci5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheXxTdHJpbmcgLi4ufSBrZXlzXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIEFzc2VydGlvbi5wcm90b3R5cGUua2V5ID1cbiAgQXNzZXJ0aW9uLnByb3RvdHlwZS5rZXlzID0gZnVuY3Rpb24gKCRrZXlzKSB7XG4gICAgdmFyIHN0clxuICAgICAgLCBvayA9IHRydWU7XG5cbiAgICAka2V5cyA9IGlzQXJyYXkoJGtleXMpXG4gICAgICA/ICRrZXlzXG4gICAgICA6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG5cbiAgICBpZiAoISRrZXlzLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKCdrZXlzIHJlcXVpcmVkJyk7XG5cbiAgICB2YXIgYWN0dWFsID0ga2V5cyh0aGlzLm9iailcbiAgICAgICwgbGVuID0gJGtleXMubGVuZ3RoO1xuXG4gICAgLy8gSW5jbHVzaW9uXG4gICAgb2sgPSBldmVyeSgka2V5cywgZnVuY3Rpb24gKGtleSkge1xuICAgICAgcmV0dXJuIH5pbmRleE9mKGFjdHVhbCwga2V5KTtcbiAgICB9KTtcblxuICAgIC8vIFN0cmljdFxuICAgIGlmICghdGhpcy5mbGFncy5ub3QgJiYgdGhpcy5mbGFncy5vbmx5KSB7XG4gICAgICBvayA9IG9rICYmICRrZXlzLmxlbmd0aCA9PSBhY3R1YWwubGVuZ3RoO1xuICAgIH1cblxuICAgIC8vIEtleSBzdHJpbmdcbiAgICBpZiAobGVuID4gMSkge1xuICAgICAgJGtleXMgPSBtYXAoJGtleXMsIGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgcmV0dXJuIGkoa2V5KTtcbiAgICAgIH0pO1xuICAgICAgdmFyIGxhc3QgPSAka2V5cy5wb3AoKTtcbiAgICAgIHN0ciA9ICRrZXlzLmpvaW4oJywgJykgKyAnLCBhbmQgJyArIGxhc3Q7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGkoJGtleXNbMF0pO1xuICAgIH1cblxuICAgIC8vIEZvcm1cbiAgICBzdHIgPSAobGVuID4gMSA/ICdrZXlzICcgOiAna2V5ICcpICsgc3RyO1xuXG4gICAgLy8gSGF2ZSAvIGluY2x1ZGVcbiAgICBzdHIgPSAoIXRoaXMuZmxhZ3Mub25seSA/ICdpbmNsdWRlICcgOiAnb25seSBoYXZlICcpICsgc3RyO1xuXG4gICAgLy8gQXNzZXJ0aW9uXG4gICAgdGhpcy5hc3NlcnQoXG4gICAgICAgIG9rXG4gICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byAnICsgc3RyIH1cbiAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIG5vdCAnICsgc3RyIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIC8qKlxuICAgKiBBc3NlcnQgYSBmYWlsdXJlLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZyAuLi59IGN1c3RvbSBtZXNzYWdlXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuICBBc3NlcnRpb24ucHJvdG90eXBlLmZhaWwgPSBmdW5jdGlvbiAobXNnKSB7XG4gICAgbXNnID0gbXNnIHx8IFwiZXhwbGljaXQgZmFpbHVyZVwiO1xuICAgIHRoaXMuYXNzZXJ0KGZhbHNlLCBtc2csIG1zZyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIEZ1bmN0aW9uIGJpbmQgaW1wbGVtZW50YXRpb24uXG4gICAqL1xuXG4gIGZ1bmN0aW9uIGJpbmQgKGZuLCBzY29wZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gZm4uYXBwbHkoc2NvcGUsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFycmF5IGV2ZXJ5IGNvbXBhdGliaWxpdHlcbiAgICpcbiAgICogQHNlZSBiaXQubHkvNUZxMU4yXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIGZ1bmN0aW9uIGV2ZXJ5IChhcnIsIGZuLCB0aGlzT2JqKSB7XG4gICAgdmFyIHNjb3BlID0gdGhpc09iaiB8fCBnbG9iYWw7XG4gICAgZm9yICh2YXIgaSA9IDAsIGogPSBhcnIubGVuZ3RoOyBpIDwgajsgKytpKSB7XG4gICAgICBpZiAoIWZuLmNhbGwoc2NvcGUsIGFycltpXSwgaSwgYXJyKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBcnJheSBpbmRleE9mIGNvbXBhdGliaWxpdHkuXG4gICAqXG4gICAqIEBzZWUgYml0Lmx5L2E1RHhhMlxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBmdW5jdGlvbiBpbmRleE9mIChhcnIsIG8sIGkpIHtcbiAgICBpZiAoQXJyYXkucHJvdG90eXBlLmluZGV4T2YpIHtcbiAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGFyciwgbywgaSk7XG4gICAgfVxuXG4gICAgaWYgKGFyci5sZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIGZvciAodmFyIGogPSBhcnIubGVuZ3RoLCBpID0gaSA8IDAgPyBpICsgaiA8IDAgPyAwIDogaSArIGogOiBpIHx8IDBcbiAgICAgICAgOyBpIDwgaiAmJiBhcnJbaV0gIT09IG87IGkrKyk7XG5cbiAgICByZXR1cm4gaiA8PSBpID8gLTEgOiBpO1xuICB9O1xuXG4gIC8vIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tLzEwNDQxMjgvXG4gIHZhciBnZXRPdXRlckhUTUwgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgaWYgKCdvdXRlckhUTUwnIGluIGVsZW1lbnQpIHJldHVybiBlbGVtZW50Lm91dGVySFRNTDtcbiAgICB2YXIgbnMgPSBcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWxcIjtcbiAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnXycpO1xuICAgIHZhciBlbGVtUHJvdG8gPSAod2luZG93LkhUTUxFbGVtZW50IHx8IHdpbmRvdy5FbGVtZW50KS5wcm90b3R5cGU7XG4gICAgdmFyIHhtbFNlcmlhbGl6ZXIgPSBuZXcgWE1MU2VyaWFsaXplcigpO1xuICAgIHZhciBodG1sO1xuICAgIGlmIChkb2N1bWVudC54bWxWZXJzaW9uKSB7XG4gICAgICByZXR1cm4geG1sU2VyaWFsaXplci5zZXJpYWxpemVUb1N0cmluZyhlbGVtZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGVsZW1lbnQuY2xvbmVOb2RlKGZhbHNlKSk7XG4gICAgICBodG1sID0gY29udGFpbmVyLmlubmVySFRNTC5yZXBsYWNlKCc+PCcsICc+JyArIGVsZW1lbnQuaW5uZXJIVE1MICsgJzwnKTtcbiAgICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcbiAgICAgIHJldHVybiBodG1sO1xuICAgIH1cbiAgfTtcblxuICAvLyBSZXR1cm5zIHRydWUgaWYgb2JqZWN0IGlzIGEgRE9NIGVsZW1lbnQuXG4gIHZhciBpc0RPTUVsZW1lbnQgPSBmdW5jdGlvbiAob2JqZWN0KSB7XG4gICAgaWYgKHR5cGVvZiBIVE1MRWxlbWVudCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHJldHVybiBvYmplY3QgaW5zdGFuY2VvZiBIVE1MRWxlbWVudDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG9iamVjdCAmJlxuICAgICAgICB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJlxuICAgICAgICBvYmplY3Qubm9kZVR5cGUgPT09IDEgJiZcbiAgICAgICAgdHlwZW9mIG9iamVjdC5ub2RlTmFtZSA9PT0gJ3N0cmluZyc7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBJbnNwZWN0cyBhbiBvYmplY3QuXG4gICAqXG4gICAqIEBzZWUgdGFrZW4gZnJvbSBub2RlLmpzIGB1dGlsYCBtb2R1bGUgKGNvcHlyaWdodCBKb3llbnQsIE1JVCBsaWNlbnNlKVxuICAgKiBAYXBpIHByaXZhdGVcbiAgICovXG5cbiAgZnVuY3Rpb24gaSAob2JqLCBzaG93SGlkZGVuLCBkZXB0aCkge1xuICAgIHZhciBzZWVuID0gW107XG5cbiAgICBmdW5jdGlvbiBzdHlsaXplIChzdHIpIHtcbiAgICAgIHJldHVybiBzdHI7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGZvcm1hdCAodmFsdWUsIHJlY3Vyc2VUaW1lcykge1xuICAgICAgLy8gUHJvdmlkZSBhIGhvb2sgZm9yIHVzZXItc3BlY2lmaWVkIGluc3BlY3QgZnVuY3Rpb25zLlxuICAgICAgLy8gQ2hlY2sgdGhhdCB2YWx1ZSBpcyBhbiBvYmplY3Qgd2l0aCBhbiBpbnNwZWN0IGZ1bmN0aW9uIG9uIGl0XG4gICAgICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlLmluc3BlY3QgPT09ICdmdW5jdGlvbicgJiZcbiAgICAgICAgICAvLyBGaWx0ZXIgb3V0IHRoZSB1dGlsIG1vZHVsZSwgaXQncyBpbnNwZWN0IGZ1bmN0aW9uIGlzIHNwZWNpYWxcbiAgICAgICAgICB2YWx1ZSAhPT0gZXhwb3J0cyAmJlxuICAgICAgICAgIC8vIEFsc28gZmlsdGVyIG91dCBhbnkgcHJvdG90eXBlIG9iamVjdHMgdXNpbmcgdGhlIGNpcmN1bGFyIGNoZWNrLlxuICAgICAgICAgICEodmFsdWUuY29uc3RydWN0b3IgJiYgdmFsdWUuY29uc3RydWN0b3IucHJvdG90eXBlID09PSB2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlLmluc3BlY3QocmVjdXJzZVRpbWVzKTtcbiAgICAgIH1cblxuICAgICAgLy8gUHJpbWl0aXZlIHR5cGVzIGNhbm5vdCBoYXZlIHByb3BlcnRpZXNcbiAgICAgIHN3aXRjaCAodHlwZW9mIHZhbHVlKSB7XG4gICAgICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgICAgICAgcmV0dXJuIHN0eWxpemUoJ3VuZGVmaW5lZCcsICd1bmRlZmluZWQnKTtcblxuICAgICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICAgIHZhciBzaW1wbGUgPSAnXFwnJyArIGpzb24uc3RyaW5naWZ5KHZhbHVlKS5yZXBsYWNlKC9eXCJ8XCIkL2csICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKSArICdcXCcnO1xuICAgICAgICAgIHJldHVybiBzdHlsaXplKHNpbXBsZSwgJ3N0cmluZycpO1xuXG4gICAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgICAgcmV0dXJuIHN0eWxpemUoJycgKyB2YWx1ZSwgJ251bWJlcicpO1xuXG4gICAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICAgIHJldHVybiBzdHlsaXplKCcnICsgdmFsdWUsICdib29sZWFuJyk7XG4gICAgICB9XG4gICAgICAvLyBGb3Igc29tZSByZWFzb24gdHlwZW9mIG51bGwgaXMgXCJvYmplY3RcIiwgc28gc3BlY2lhbCBjYXNlIGhlcmUuXG4gICAgICBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHN0eWxpemUoJ251bGwnLCAnbnVsbCcpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNET01FbGVtZW50KHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gZ2V0T3V0ZXJIVE1MKHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgLy8gTG9vayB1cCB0aGUga2V5cyBvZiB0aGUgb2JqZWN0LlxuICAgICAgdmFyIHZpc2libGVfa2V5cyA9IGtleXModmFsdWUpO1xuICAgICAgdmFyICRrZXlzID0gc2hvd0hpZGRlbiA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHZhbHVlKSA6IHZpc2libGVfa2V5cztcblxuICAgICAgLy8gRnVuY3Rpb25zIHdpdGhvdXQgcHJvcGVydGllcyBjYW4gYmUgc2hvcnRjdXR0ZWQuXG4gICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nICYmICRrZXlzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHN0eWxpemUoJycgKyB2YWx1ZSwgJ3JlZ2V4cCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBuYW1lID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgICAgICAgcmV0dXJuIHN0eWxpemUoJ1tGdW5jdGlvbicgKyBuYW1lICsgJ10nLCAnc3BlY2lhbCcpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIERhdGVzIHdpdGhvdXQgcHJvcGVydGllcyBjYW4gYmUgc2hvcnRjdXR0ZWRcbiAgICAgIGlmIChpc0RhdGUodmFsdWUpICYmICRrZXlzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gc3R5bGl6ZSh2YWx1ZS50b1VUQ1N0cmluZygpLCAnZGF0ZScpO1xuICAgICAgfVxuXG4gICAgICB2YXIgYmFzZSwgdHlwZSwgYnJhY2VzO1xuICAgICAgLy8gRGV0ZXJtaW5lIHRoZSBvYmplY3QgdHlwZVxuICAgICAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgIHR5cGUgPSAnQXJyYXknO1xuICAgICAgICBicmFjZXMgPSBbJ1snLCAnXSddO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHlwZSA9ICdPYmplY3QnO1xuICAgICAgICBicmFjZXMgPSBbJ3snLCAnfSddO1xuICAgICAgfVxuXG4gICAgICAvLyBNYWtlIGZ1bmN0aW9ucyBzYXkgdGhhdCB0aGV5IGFyZSBmdW5jdGlvbnNcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdmFyIG4gPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICAgICAgYmFzZSA9IChpc1JlZ0V4cCh2YWx1ZSkpID8gJyAnICsgdmFsdWUgOiAnIFtGdW5jdGlvbicgKyBuICsgJ10nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYmFzZSA9ICcnO1xuICAgICAgfVxuXG4gICAgICAvLyBNYWtlIGRhdGVzIHdpdGggcHJvcGVydGllcyBmaXJzdCBzYXkgdGhlIGRhdGVcbiAgICAgIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgICAgIGJhc2UgPSAnICcgKyB2YWx1ZS50b1VUQ1N0cmluZygpO1xuICAgICAgfVxuXG4gICAgICBpZiAoJGtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBicmFjZXNbMF0gKyBiYXNlICsgYnJhY2VzWzFdO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjdXJzZVRpbWVzIDwgMCkge1xuICAgICAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHN0eWxpemUoJycgKyB2YWx1ZSwgJ3JlZ2V4cCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBzdHlsaXplKCdbT2JqZWN0XScsICdzcGVjaWFsJyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgc2Vlbi5wdXNoKHZhbHVlKTtcblxuICAgICAgdmFyIG91dHB1dCA9IG1hcCgka2V5cywgZnVuY3Rpb24gKGtleSkge1xuICAgICAgICB2YXIgbmFtZSwgc3RyO1xuICAgICAgICBpZiAodmFsdWUuX19sb29rdXBHZXR0ZXJfXykge1xuICAgICAgICAgIGlmICh2YWx1ZS5fX2xvb2t1cEdldHRlcl9fKGtleSkpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZS5fX2xvb2t1cFNldHRlcl9fKGtleSkpIHtcbiAgICAgICAgICAgICAgc3RyID0gc3R5bGl6ZSgnW0dldHRlci9TZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHN0ciA9IHN0eWxpemUoJ1tHZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHZhbHVlLl9fbG9va3VwU2V0dGVyX18oa2V5KSkge1xuICAgICAgICAgICAgICBzdHIgPSBzdHlsaXplKCdbU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChpbmRleE9mKHZpc2libGVfa2V5cywga2V5KSA8IDApIHtcbiAgICAgICAgICBuYW1lID0gJ1snICsga2V5ICsgJ10nO1xuICAgICAgICB9XG4gICAgICAgIGlmICghc3RyKSB7XG4gICAgICAgICAgaWYgKGluZGV4T2Yoc2VlbiwgdmFsdWVba2V5XSkgPCAwKSB7XG4gICAgICAgICAgICBpZiAocmVjdXJzZVRpbWVzID09PSBudWxsKSB7XG4gICAgICAgICAgICAgIHN0ciA9IGZvcm1hdCh2YWx1ZVtrZXldKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHN0ciA9IGZvcm1hdCh2YWx1ZVtrZXldLCByZWN1cnNlVGltZXMgLSAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzdHIuaW5kZXhPZignXFxuJykgPiAtMSkge1xuICAgICAgICAgICAgICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBzdHIgPSBtYXAoc3RyLnNwbGl0KCdcXG4nKSwgZnVuY3Rpb24gKGxpbmUpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiAnICAnICsgbGluZTtcbiAgICAgICAgICAgICAgICB9KS5qb2luKCdcXG4nKS5zdWJzdHIoMik7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3RyID0gJ1xcbicgKyBtYXAoc3RyLnNwbGl0KCdcXG4nKSwgZnVuY3Rpb24gKGxpbmUpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiAnICAgJyArIGxpbmU7XG4gICAgICAgICAgICAgICAgfSkuam9pbignXFxuJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RyID0gc3R5bGl6ZSgnW0NpcmN1bGFyXScsICdzcGVjaWFsJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgbmFtZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICBpZiAodHlwZSA9PT0gJ0FycmF5JyAmJiBrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RyO1xuICAgICAgICAgIH1cbiAgICAgICAgICBuYW1lID0ganNvbi5zdHJpbmdpZnkoJycgKyBrZXkpO1xuICAgICAgICAgIGlmIChuYW1lLm1hdGNoKC9eXCIoW2EtekEtWl9dW2EtekEtWl8wLTldKilcIiQvKSkge1xuICAgICAgICAgICAgbmFtZSA9IG5hbWUuc3Vic3RyKDEsIG5hbWUubGVuZ3RoIC0gMik7XG4gICAgICAgICAgICBuYW1lID0gc3R5bGl6ZShuYW1lLCAnbmFtZScpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKVxuICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvKF5cInxcIiQpL2csIFwiJ1wiKTtcbiAgICAgICAgICAgIG5hbWUgPSBzdHlsaXplKG5hbWUsICdzdHJpbmcnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmFtZSArICc6ICcgKyBzdHI7XG4gICAgICB9KTtcblxuICAgICAgc2Vlbi5wb3AoKTtcblxuICAgICAgdmFyIG51bUxpbmVzRXN0ID0gMDtcbiAgICAgIHZhciBsZW5ndGggPSByZWR1Y2Uob3V0cHV0LCBmdW5jdGlvbiAocHJldiwgY3VyKSB7XG4gICAgICAgIG51bUxpbmVzRXN0Kys7XG4gICAgICAgIGlmIChpbmRleE9mKGN1ciwgJ1xcbicpID49IDApIG51bUxpbmVzRXN0Kys7XG4gICAgICAgIHJldHVybiBwcmV2ICsgY3VyLmxlbmd0aCArIDE7XG4gICAgICB9LCAwKTtcblxuICAgICAgaWYgKGxlbmd0aCA+IDUwKSB7XG4gICAgICAgIG91dHB1dCA9IGJyYWNlc1swXSArXG4gICAgICAgICAgICAgICAgIChiYXNlID09PSAnJyA/ICcnIDogYmFzZSArICdcXG4gJykgK1xuICAgICAgICAgICAgICAgICAnICcgK1xuICAgICAgICAgICAgICAgICBvdXRwdXQuam9pbignLFxcbiAgJykgK1xuICAgICAgICAgICAgICAgICAnICcgK1xuICAgICAgICAgICAgICAgICBicmFjZXNbMV07XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dHB1dCA9IGJyYWNlc1swXSArIGJhc2UgKyAnICcgKyBvdXRwdXQuam9pbignLCAnKSArICcgJyArIGJyYWNlc1sxXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9XG4gICAgcmV0dXJuIGZvcm1hdChvYmosICh0eXBlb2YgZGVwdGggPT09ICd1bmRlZmluZWQnID8gMiA6IGRlcHRoKSk7XG4gIH07XG5cbiAgZnVuY3Rpb24gaXNBcnJheSAoYXIpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFyKSA9PSAnW29iamVjdCBBcnJheV0nO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGlzUmVnRXhwKHJlKSB7XG4gICAgdmFyIHM7XG4gICAgdHJ5IHtcbiAgICAgIHMgPSAnJyArIHJlO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmUgaW5zdGFuY2VvZiBSZWdFeHAgfHwgLy8gZWFzeSBjYXNlXG4gICAgICAgICAgIC8vIGR1Y2stdHlwZSBmb3IgY29udGV4dC1zd2l0Y2hpbmcgZXZhbGN4IGNhc2VcbiAgICAgICAgICAgdHlwZW9mKHJlKSA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgICAgICAgICByZS5jb25zdHJ1Y3Rvci5uYW1lID09PSAnUmVnRXhwJyAmJlxuICAgICAgICAgICByZS5jb21waWxlICYmXG4gICAgICAgICAgIHJlLnRlc3QgJiZcbiAgICAgICAgICAgcmUuZXhlYyAmJlxuICAgICAgICAgICBzLm1hdGNoKC9eXFwvLipcXC9bZ2ltXXswLDN9JC8pO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGlzRGF0ZShkKSB7XG4gICAgaWYgKGQgaW5zdGFuY2VvZiBEYXRlKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgZnVuY3Rpb24ga2V5cyAob2JqKSB7XG4gICAgaWYgKE9iamVjdC5rZXlzKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqKTtcbiAgICB9XG5cbiAgICB2YXIga2V5cyA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSBpbiBvYmopIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBpKSkge1xuICAgICAgICBrZXlzLnB1c2goaSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGtleXM7XG4gIH1cblxuICBmdW5jdGlvbiBtYXAgKGFyciwgbWFwcGVyLCB0aGF0KSB7XG4gICAgaWYgKEFycmF5LnByb3RvdHlwZS5tYXApIHtcbiAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUubWFwLmNhbGwoYXJyLCBtYXBwZXIsIHRoYXQpO1xuICAgIH1cblxuICAgIHZhciBvdGhlcj0gbmV3IEFycmF5KGFyci5sZW5ndGgpO1xuXG4gICAgZm9yICh2YXIgaT0gMCwgbiA9IGFyci5sZW5ndGg7IGk8bjsgaSsrKVxuICAgICAgaWYgKGkgaW4gYXJyKVxuICAgICAgICBvdGhlcltpXSA9IG1hcHBlci5jYWxsKHRoYXQsIGFycltpXSwgaSwgYXJyKTtcblxuICAgIHJldHVybiBvdGhlcjtcbiAgfTtcblxuICBmdW5jdGlvbiByZWR1Y2UgKGFyciwgZnVuKSB7XG4gICAgaWYgKEFycmF5LnByb3RvdHlwZS5yZWR1Y2UpIHtcbiAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUucmVkdWNlLmFwcGx5KFxuICAgICAgICAgIGFyclxuICAgICAgICAsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdmFyIGxlbiA9ICt0aGlzLmxlbmd0aDtcblxuICAgIGlmICh0eXBlb2YgZnVuICE9PSBcImZ1bmN0aW9uXCIpXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG5cbiAgICAvLyBubyB2YWx1ZSB0byByZXR1cm4gaWYgbm8gaW5pdGlhbCB2YWx1ZSBhbmQgYW4gZW1wdHkgYXJyYXlcbiAgICBpZiAobGVuID09PSAwICYmIGFyZ3VtZW50cy5sZW5ndGggPT09IDEpXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG5cbiAgICB2YXIgaSA9IDA7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gMikge1xuICAgICAgdmFyIHJ2ID0gYXJndW1lbnRzWzFdO1xuICAgIH0gZWxzZSB7XG4gICAgICBkbyB7XG4gICAgICAgIGlmIChpIGluIHRoaXMpIHtcbiAgICAgICAgICBydiA9IHRoaXNbaSsrXTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIGFycmF5IGNvbnRhaW5zIG5vIHZhbHVlcywgbm8gaW5pdGlhbCB2YWx1ZSB0byByZXR1cm5cbiAgICAgICAgaWYgKCsraSA+PSBsZW4pXG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuICAgICAgfSB3aGlsZSAodHJ1ZSk7XG4gICAgfVxuXG4gICAgZm9yICg7IGkgPCBsZW47IGkrKykge1xuICAgICAgaWYgKGkgaW4gdGhpcylcbiAgICAgICAgcnYgPSBmdW4uY2FsbChudWxsLCBydiwgdGhpc1tpXSwgaSwgdGhpcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJ2O1xuICB9O1xuXG4gIC8qKlxuICAgKiBBc3NlcnRzIGRlZXAgZXF1YWxpdHlcbiAgICpcbiAgICogQHNlZSB0YWtlbiBmcm9tIG5vZGUuanMgYGFzc2VydGAgbW9kdWxlIChjb3B5cmlnaHQgSm95ZW50LCBNSVQgbGljZW5zZSlcbiAgICogQGFwaSBwcml2YXRlXG4gICAqL1xuXG4gIGV4cGVjdC5lcWwgPSBmdW5jdGlvbiBlcWwgKGFjdHVhbCwgZXhwZWN0ZWQpIHtcbiAgICAvLyA3LjEuIEFsbCBpZGVudGljYWwgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBhcyBkZXRlcm1pbmVkIGJ5ID09PS5cbiAgICBpZiAoYWN0dWFsID09PSBleHBlY3RlZCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIGlmICgndW5kZWZpbmVkJyAhPSB0eXBlb2YgQnVmZmVyXG4gICAgICAgICYmIEJ1ZmZlci5pc0J1ZmZlcihhY3R1YWwpICYmIEJ1ZmZlci5pc0J1ZmZlcihleHBlY3RlZCkpIHtcbiAgICAgIGlmIChhY3R1YWwubGVuZ3RoICE9IGV4cGVjdGVkLmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFjdHVhbC5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoYWN0dWFsW2ldICE9PSBleHBlY3RlZFtpXSkgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcblxuICAgIC8vIDcuMi4gSWYgdGhlIGV4cGVjdGVkIHZhbHVlIGlzIGEgRGF0ZSBvYmplY3QsIHRoZSBhY3R1YWwgdmFsdWUgaXNcbiAgICAvLyBlcXVpdmFsZW50IGlmIGl0IGlzIGFsc28gYSBEYXRlIG9iamVjdCB0aGF0IHJlZmVycyB0byB0aGUgc2FtZSB0aW1lLlxuICAgIH0gZWxzZSBpZiAoYWN0dWFsIGluc3RhbmNlb2YgRGF0ZSAmJiBleHBlY3RlZCBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgIHJldHVybiBhY3R1YWwuZ2V0VGltZSgpID09PSBleHBlY3RlZC5nZXRUaW1lKCk7XG5cbiAgICAvLyA3LjMuIE90aGVyIHBhaXJzIHRoYXQgZG8gbm90IGJvdGggcGFzcyB0eXBlb2YgdmFsdWUgPT0gXCJvYmplY3RcIixcbiAgICAvLyBlcXVpdmFsZW5jZSBpcyBkZXRlcm1pbmVkIGJ5ID09LlxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGFjdHVhbCAhPSAnb2JqZWN0JyAmJiB0eXBlb2YgZXhwZWN0ZWQgIT0gJ29iamVjdCcpIHtcbiAgICAgIHJldHVybiBhY3R1YWwgPT0gZXhwZWN0ZWQ7XG5cbiAgICAvLyA3LjQuIEZvciBhbGwgb3RoZXIgT2JqZWN0IHBhaXJzLCBpbmNsdWRpbmcgQXJyYXkgb2JqZWN0cywgZXF1aXZhbGVuY2UgaXNcbiAgICAvLyBkZXRlcm1pbmVkIGJ5IGhhdmluZyB0aGUgc2FtZSBudW1iZXIgb2Ygb3duZWQgcHJvcGVydGllcyAoYXMgdmVyaWZpZWRcbiAgICAvLyB3aXRoIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCksIHRoZSBzYW1lIHNldCBvZiBrZXlzXG4gICAgLy8gKGFsdGhvdWdoIG5vdCBuZWNlc3NhcmlseSB0aGUgc2FtZSBvcmRlciksIGVxdWl2YWxlbnQgdmFsdWVzIGZvciBldmVyeVxuICAgIC8vIGNvcnJlc3BvbmRpbmcga2V5LCBhbmQgYW4gaWRlbnRpY2FsIFwicHJvdG90eXBlXCIgcHJvcGVydHkuIE5vdGU6IHRoaXNcbiAgICAvLyBhY2NvdW50cyBmb3IgYm90aCBuYW1lZCBhbmQgaW5kZXhlZCBwcm9wZXJ0aWVzIG9uIEFycmF5cy5cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG9iakVxdWl2KGFjdHVhbCwgZXhwZWN0ZWQpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGlzVW5kZWZpbmVkT3JOdWxsICh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNBcmd1bWVudHMgKG9iamVjdCkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqZWN0KSA9PSAnW29iamVjdCBBcmd1bWVudHNdJztcbiAgfVxuXG4gIGZ1bmN0aW9uIG9iakVxdWl2IChhLCBiKSB7XG4gICAgaWYgKGlzVW5kZWZpbmVkT3JOdWxsKGEpIHx8IGlzVW5kZWZpbmVkT3JOdWxsKGIpKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIC8vIGFuIGlkZW50aWNhbCBcInByb3RvdHlwZVwiIHByb3BlcnR5LlxuICAgIGlmIChhLnByb3RvdHlwZSAhPT0gYi5wcm90b3R5cGUpIHJldHVybiBmYWxzZTtcbiAgICAvL35+fkkndmUgbWFuYWdlZCB0byBicmVhayBPYmplY3Qua2V5cyB0aHJvdWdoIHNjcmV3eSBhcmd1bWVudHMgcGFzc2luZy5cbiAgICAvLyAgIENvbnZlcnRpbmcgdG8gYXJyYXkgc29sdmVzIHRoZSBwcm9ibGVtLlxuICAgIGlmIChpc0FyZ3VtZW50cyhhKSkge1xuICAgICAgaWYgKCFpc0FyZ3VtZW50cyhiKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBhID0gcFNsaWNlLmNhbGwoYSk7XG4gICAgICBiID0gcFNsaWNlLmNhbGwoYik7XG4gICAgICByZXR1cm4gZXhwZWN0LmVxbChhLCBiKTtcbiAgICB9XG4gICAgdHJ5e1xuICAgICAgdmFyIGthID0ga2V5cyhhKSxcbiAgICAgICAga2IgPSBrZXlzKGIpLFxuICAgICAgICBrZXksIGk7XG4gICAgfSBjYXRjaCAoZSkgey8vaGFwcGVucyB3aGVuIG9uZSBpcyBhIHN0cmluZyBsaXRlcmFsIGFuZCB0aGUgb3RoZXIgaXNuJ3RcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8gaGF2aW5nIHRoZSBzYW1lIG51bWJlciBvZiBvd25lZCBwcm9wZXJ0aWVzIChrZXlzIGluY29ycG9yYXRlcyBoYXNPd25Qcm9wZXJ0eSlcbiAgICBpZiAoa2EubGVuZ3RoICE9IGtiLmxlbmd0aClcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICAvL3RoZSBzYW1lIHNldCBvZiBrZXlzIChhbHRob3VnaCBub3QgbmVjZXNzYXJpbHkgdGhlIHNhbWUgb3JkZXIpLFxuICAgIGthLnNvcnQoKTtcbiAgICBrYi5zb3J0KCk7XG4gICAgLy9+fn5jaGVhcCBrZXkgdGVzdFxuICAgIGZvciAoaSA9IGthLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBpZiAoa2FbaV0gIT0ga2JbaV0pXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy9lcXVpdmFsZW50IHZhbHVlcyBmb3IgZXZlcnkgY29ycmVzcG9uZGluZyBrZXksIGFuZFxuICAgIC8vfn5+cG9zc2libHkgZXhwZW5zaXZlIGRlZXAgdGVzdFxuICAgIGZvciAoaSA9IGthLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBrZXkgPSBrYVtpXTtcbiAgICAgIGlmICghZXhwZWN0LmVxbChhW2tleV0sIGJba2V5XSkpXG4gICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgdmFyIGpzb24gPSAoZnVuY3Rpb24gKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgaWYgKCdvYmplY3QnID09IHR5cGVvZiBKU09OICYmIEpTT04ucGFyc2UgJiYgSlNPTi5zdHJpbmdpZnkpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICAgcGFyc2U6IG5hdGl2ZUpTT04ucGFyc2VcbiAgICAgICAgLCBzdHJpbmdpZnk6IG5hdGl2ZUpTT04uc3RyaW5naWZ5XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIEpTT04gPSB7fTtcblxuICAgIGZ1bmN0aW9uIGYobikge1xuICAgICAgICAvLyBGb3JtYXQgaW50ZWdlcnMgdG8gaGF2ZSBhdCBsZWFzdCB0d28gZGlnaXRzLlxuICAgICAgICByZXR1cm4gbiA8IDEwID8gJzAnICsgbiA6IG47XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGF0ZShkLCBrZXkpIHtcbiAgICAgIHJldHVybiBpc0Zpbml0ZShkLnZhbHVlT2YoKSkgP1xuICAgICAgICAgIGQuZ2V0VVRDRnVsbFllYXIoKSAgICAgKyAnLScgK1xuICAgICAgICAgIGYoZC5nZXRVVENNb250aCgpICsgMSkgKyAnLScgK1xuICAgICAgICAgIGYoZC5nZXRVVENEYXRlKCkpICAgICAgKyAnVCcgK1xuICAgICAgICAgIGYoZC5nZXRVVENIb3VycygpKSAgICAgKyAnOicgK1xuICAgICAgICAgIGYoZC5nZXRVVENNaW51dGVzKCkpICAgKyAnOicgK1xuICAgICAgICAgIGYoZC5nZXRVVENTZWNvbmRzKCkpICAgKyAnWicgOiBudWxsO1xuICAgIH07XG5cbiAgICB2YXIgY3ggPSAvW1xcdTAwMDBcXHUwMGFkXFx1MDYwMC1cXHUwNjA0XFx1MDcwZlxcdTE3YjRcXHUxN2I1XFx1MjAwYy1cXHUyMDBmXFx1MjAyOC1cXHUyMDJmXFx1MjA2MC1cXHUyMDZmXFx1ZmVmZlxcdWZmZjAtXFx1ZmZmZl0vZyxcbiAgICAgICAgZXNjYXBhYmxlID0gL1tcXFxcXFxcIlxceDAwLVxceDFmXFx4N2YtXFx4OWZcXHUwMGFkXFx1MDYwMC1cXHUwNjA0XFx1MDcwZlxcdTE3YjRcXHUxN2I1XFx1MjAwYy1cXHUyMDBmXFx1MjAyOC1cXHUyMDJmXFx1MjA2MC1cXHUyMDZmXFx1ZmVmZlxcdWZmZjAtXFx1ZmZmZl0vZyxcbiAgICAgICAgZ2FwLFxuICAgICAgICBpbmRlbnQsXG4gICAgICAgIG1ldGEgPSB7ICAgIC8vIHRhYmxlIG9mIGNoYXJhY3RlciBzdWJzdGl0dXRpb25zXG4gICAgICAgICAgICAnXFxiJzogJ1xcXFxiJyxcbiAgICAgICAgICAgICdcXHQnOiAnXFxcXHQnLFxuICAgICAgICAgICAgJ1xcbic6ICdcXFxcbicsXG4gICAgICAgICAgICAnXFxmJzogJ1xcXFxmJyxcbiAgICAgICAgICAgICdcXHInOiAnXFxcXHInLFxuICAgICAgICAgICAgJ1wiJyA6ICdcXFxcXCInLFxuICAgICAgICAgICAgJ1xcXFwnOiAnXFxcXFxcXFwnXG4gICAgICAgIH0sXG4gICAgICAgIHJlcDtcblxuXG4gICAgZnVuY3Rpb24gcXVvdGUoc3RyaW5nKSB7XG5cbiAgLy8gSWYgdGhlIHN0cmluZyBjb250YWlucyBubyBjb250cm9sIGNoYXJhY3RlcnMsIG5vIHF1b3RlIGNoYXJhY3RlcnMsIGFuZCBub1xuICAvLyBiYWNrc2xhc2ggY2hhcmFjdGVycywgdGhlbiB3ZSBjYW4gc2FmZWx5IHNsYXAgc29tZSBxdW90ZXMgYXJvdW5kIGl0LlxuICAvLyBPdGhlcndpc2Ugd2UgbXVzdCBhbHNvIHJlcGxhY2UgdGhlIG9mZmVuZGluZyBjaGFyYWN0ZXJzIHdpdGggc2FmZSBlc2NhcGVcbiAgLy8gc2VxdWVuY2VzLlxuXG4gICAgICAgIGVzY2FwYWJsZS5sYXN0SW5kZXggPSAwO1xuICAgICAgICByZXR1cm4gZXNjYXBhYmxlLnRlc3Qoc3RyaW5nKSA/ICdcIicgKyBzdHJpbmcucmVwbGFjZShlc2NhcGFibGUsIGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICB2YXIgYyA9IG1ldGFbYV07XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIGMgPT09ICdzdHJpbmcnID8gYyA6XG4gICAgICAgICAgICAgICAgJ1xcXFx1JyArICgnMDAwMCcgKyBhLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpKS5zbGljZSgtNCk7XG4gICAgICAgIH0pICsgJ1wiJyA6ICdcIicgKyBzdHJpbmcgKyAnXCInO1xuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gc3RyKGtleSwgaG9sZGVyKSB7XG5cbiAgLy8gUHJvZHVjZSBhIHN0cmluZyBmcm9tIGhvbGRlcltrZXldLlxuXG4gICAgICAgIHZhciBpLCAgICAgICAgICAvLyBUaGUgbG9vcCBjb3VudGVyLlxuICAgICAgICAgICAgaywgICAgICAgICAgLy8gVGhlIG1lbWJlciBrZXkuXG4gICAgICAgICAgICB2LCAgICAgICAgICAvLyBUaGUgbWVtYmVyIHZhbHVlLlxuICAgICAgICAgICAgbGVuZ3RoLFxuICAgICAgICAgICAgbWluZCA9IGdhcCxcbiAgICAgICAgICAgIHBhcnRpYWwsXG4gICAgICAgICAgICB2YWx1ZSA9IGhvbGRlcltrZXldO1xuXG4gIC8vIElmIHRoZSB2YWx1ZSBoYXMgYSB0b0pTT04gbWV0aG9kLCBjYWxsIGl0IHRvIG9idGFpbiBhIHJlcGxhY2VtZW50IHZhbHVlLlxuXG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgICAgIHZhbHVlID0gZGF0ZShrZXkpO1xuICAgICAgICB9XG5cbiAgLy8gSWYgd2Ugd2VyZSBjYWxsZWQgd2l0aCBhIHJlcGxhY2VyIGZ1bmN0aW9uLCB0aGVuIGNhbGwgdGhlIHJlcGxhY2VyIHRvXG4gIC8vIG9idGFpbiBhIHJlcGxhY2VtZW50IHZhbHVlLlxuXG4gICAgICAgIGlmICh0eXBlb2YgcmVwID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHJlcC5jYWxsKGhvbGRlciwga2V5LCB2YWx1ZSk7XG4gICAgICAgIH1cblxuICAvLyBXaGF0IGhhcHBlbnMgbmV4dCBkZXBlbmRzIG9uIHRoZSB2YWx1ZSdzIHR5cGUuXG5cbiAgICAgICAgc3dpdGNoICh0eXBlb2YgdmFsdWUpIHtcbiAgICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgICAgIHJldHVybiBxdW90ZSh2YWx1ZSk7XG5cbiAgICAgICAgY2FzZSAnbnVtYmVyJzpcblxuICAvLyBKU09OIG51bWJlcnMgbXVzdCBiZSBmaW5pdGUuIEVuY29kZSBub24tZmluaXRlIG51bWJlcnMgYXMgbnVsbC5cblxuICAgICAgICAgICAgcmV0dXJuIGlzRmluaXRlKHZhbHVlKSA/IFN0cmluZyh2YWx1ZSkgOiAnbnVsbCc7XG5cbiAgICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICAgIGNhc2UgJ251bGwnOlxuXG4gIC8vIElmIHRoZSB2YWx1ZSBpcyBhIGJvb2xlYW4gb3IgbnVsbCwgY29udmVydCBpdCB0byBhIHN0cmluZy4gTm90ZTpcbiAgLy8gdHlwZW9mIG51bGwgZG9lcyBub3QgcHJvZHVjZSAnbnVsbCcuIFRoZSBjYXNlIGlzIGluY2x1ZGVkIGhlcmUgaW5cbiAgLy8gdGhlIHJlbW90ZSBjaGFuY2UgdGhhdCB0aGlzIGdldHMgZml4ZWQgc29tZWRheS5cblxuICAgICAgICAgICAgcmV0dXJuIFN0cmluZyh2YWx1ZSk7XG5cbiAgLy8gSWYgdGhlIHR5cGUgaXMgJ29iamVjdCcsIHdlIG1pZ2h0IGJlIGRlYWxpbmcgd2l0aCBhbiBvYmplY3Qgb3IgYW4gYXJyYXkgb3JcbiAgLy8gbnVsbC5cblxuICAgICAgICBjYXNlICdvYmplY3QnOlxuXG4gIC8vIER1ZSB0byBhIHNwZWNpZmljYXRpb24gYmx1bmRlciBpbiBFQ01BU2NyaXB0LCB0eXBlb2YgbnVsbCBpcyAnb2JqZWN0JyxcbiAgLy8gc28gd2F0Y2ggb3V0IGZvciB0aGF0IGNhc2UuXG5cbiAgICAgICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ251bGwnO1xuICAgICAgICAgICAgfVxuXG4gIC8vIE1ha2UgYW4gYXJyYXkgdG8gaG9sZCB0aGUgcGFydGlhbCByZXN1bHRzIG9mIHN0cmluZ2lmeWluZyB0aGlzIG9iamVjdCB2YWx1ZS5cblxuICAgICAgICAgICAgZ2FwICs9IGluZGVudDtcbiAgICAgICAgICAgIHBhcnRpYWwgPSBbXTtcblxuICAvLyBJcyB0aGUgdmFsdWUgYW4gYXJyYXk/XG5cbiAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmFwcGx5KHZhbHVlKSA9PT0gJ1tvYmplY3QgQXJyYXldJykge1xuXG4gIC8vIFRoZSB2YWx1ZSBpcyBhbiBhcnJheS4gU3RyaW5naWZ5IGV2ZXJ5IGVsZW1lbnQuIFVzZSBudWxsIGFzIGEgcGxhY2Vob2xkZXJcbiAgLy8gZm9yIG5vbi1KU09OIHZhbHVlcy5cblxuICAgICAgICAgICAgICAgIGxlbmd0aCA9IHZhbHVlLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFydGlhbFtpXSA9IHN0cihpLCB2YWx1ZSkgfHwgJ251bGwnO1xuICAgICAgICAgICAgICAgIH1cblxuICAvLyBKb2luIGFsbCBvZiB0aGUgZWxlbWVudHMgdG9nZXRoZXIsIHNlcGFyYXRlZCB3aXRoIGNvbW1hcywgYW5kIHdyYXAgdGhlbSBpblxuICAvLyBicmFja2V0cy5cblxuICAgICAgICAgICAgICAgIHYgPSBwYXJ0aWFsLmxlbmd0aCA9PT0gMCA/ICdbXScgOiBnYXAgP1xuICAgICAgICAgICAgICAgICAgICAnW1xcbicgKyBnYXAgKyBwYXJ0aWFsLmpvaW4oJyxcXG4nICsgZ2FwKSArICdcXG4nICsgbWluZCArICddJyA6XG4gICAgICAgICAgICAgICAgICAgICdbJyArIHBhcnRpYWwuam9pbignLCcpICsgJ10nO1xuICAgICAgICAgICAgICAgIGdhcCA9IG1pbmQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHY7XG4gICAgICAgICAgICB9XG5cbiAgLy8gSWYgdGhlIHJlcGxhY2VyIGlzIGFuIGFycmF5LCB1c2UgaXQgdG8gc2VsZWN0IHRoZSBtZW1iZXJzIHRvIGJlIHN0cmluZ2lmaWVkLlxuXG4gICAgICAgICAgICBpZiAocmVwICYmIHR5cGVvZiByZXAgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgbGVuZ3RoID0gcmVwLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiByZXBbaV0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrID0gcmVwW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgdiA9IHN0cihrLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpYWwucHVzaChxdW90ZShrKSArIChnYXAgPyAnOiAnIDogJzonKSArIHYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAvLyBPdGhlcndpc2UsIGl0ZXJhdGUgdGhyb3VnaCBhbGwgb2YgdGhlIGtleXMgaW4gdGhlIG9iamVjdC5cblxuICAgICAgICAgICAgICAgIGZvciAoayBpbiB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBrKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdiA9IHN0cihrLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpYWwucHVzaChxdW90ZShrKSArIChnYXAgPyAnOiAnIDogJzonKSArIHYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gIC8vIEpvaW4gYWxsIG9mIHRoZSBtZW1iZXIgdGV4dHMgdG9nZXRoZXIsIHNlcGFyYXRlZCB3aXRoIGNvbW1hcyxcbiAgLy8gYW5kIHdyYXAgdGhlbSBpbiBicmFjZXMuXG5cbiAgICAgICAgICAgIHYgPSBwYXJ0aWFsLmxlbmd0aCA9PT0gMCA/ICd7fScgOiBnYXAgP1xuICAgICAgICAgICAgICAgICd7XFxuJyArIGdhcCArIHBhcnRpYWwuam9pbignLFxcbicgKyBnYXApICsgJ1xcbicgKyBtaW5kICsgJ30nIDpcbiAgICAgICAgICAgICAgICAneycgKyBwYXJ0aWFsLmpvaW4oJywnKSArICd9JztcbiAgICAgICAgICAgIGdhcCA9IG1pbmQ7XG4gICAgICAgICAgICByZXR1cm4gdjtcbiAgICAgICAgfVxuICAgIH1cblxuICAvLyBJZiB0aGUgSlNPTiBvYmplY3QgZG9lcyBub3QgeWV0IGhhdmUgYSBzdHJpbmdpZnkgbWV0aG9kLCBnaXZlIGl0IG9uZS5cblxuICAgIEpTT04uc3RyaW5naWZ5ID0gZnVuY3Rpb24gKHZhbHVlLCByZXBsYWNlciwgc3BhY2UpIHtcblxuICAvLyBUaGUgc3RyaW5naWZ5IG1ldGhvZCB0YWtlcyBhIHZhbHVlIGFuZCBhbiBvcHRpb25hbCByZXBsYWNlciwgYW5kIGFuIG9wdGlvbmFsXG4gIC8vIHNwYWNlIHBhcmFtZXRlciwgYW5kIHJldHVybnMgYSBKU09OIHRleHQuIFRoZSByZXBsYWNlciBjYW4gYmUgYSBmdW5jdGlvblxuICAvLyB0aGF0IGNhbiByZXBsYWNlIHZhbHVlcywgb3IgYW4gYXJyYXkgb2Ygc3RyaW5ncyB0aGF0IHdpbGwgc2VsZWN0IHRoZSBrZXlzLlxuICAvLyBBIGRlZmF1bHQgcmVwbGFjZXIgbWV0aG9kIGNhbiBiZSBwcm92aWRlZC4gVXNlIG9mIHRoZSBzcGFjZSBwYXJhbWV0ZXIgY2FuXG4gIC8vIHByb2R1Y2UgdGV4dCB0aGF0IGlzIG1vcmUgZWFzaWx5IHJlYWRhYmxlLlxuXG4gICAgICAgIHZhciBpO1xuICAgICAgICBnYXAgPSAnJztcbiAgICAgICAgaW5kZW50ID0gJyc7XG5cbiAgLy8gSWYgdGhlIHNwYWNlIHBhcmFtZXRlciBpcyBhIG51bWJlciwgbWFrZSBhbiBpbmRlbnQgc3RyaW5nIGNvbnRhaW5pbmcgdGhhdFxuICAvLyBtYW55IHNwYWNlcy5cblxuICAgICAgICBpZiAodHlwZW9mIHNwYWNlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHNwYWNlOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICBpbmRlbnQgKz0gJyAnO1xuICAgICAgICAgICAgfVxuXG4gIC8vIElmIHRoZSBzcGFjZSBwYXJhbWV0ZXIgaXMgYSBzdHJpbmcsIGl0IHdpbGwgYmUgdXNlZCBhcyB0aGUgaW5kZW50IHN0cmluZy5cblxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBzcGFjZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGluZGVudCA9IHNwYWNlO1xuICAgICAgICB9XG5cbiAgLy8gSWYgdGhlcmUgaXMgYSByZXBsYWNlciwgaXQgbXVzdCBiZSBhIGZ1bmN0aW9uIG9yIGFuIGFycmF5LlxuICAvLyBPdGhlcndpc2UsIHRocm93IGFuIGVycm9yLlxuXG4gICAgICAgIHJlcCA9IHJlcGxhY2VyO1xuICAgICAgICBpZiAocmVwbGFjZXIgJiYgdHlwZW9mIHJlcGxhY2VyICE9PSAnZnVuY3Rpb24nICYmXG4gICAgICAgICAgICAgICAgKHR5cGVvZiByZXBsYWNlciAhPT0gJ29iamVjdCcgfHxcbiAgICAgICAgICAgICAgICB0eXBlb2YgcmVwbGFjZXIubGVuZ3RoICE9PSAnbnVtYmVyJykpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSlNPTi5zdHJpbmdpZnknKTtcbiAgICAgICAgfVxuXG4gIC8vIE1ha2UgYSBmYWtlIHJvb3Qgb2JqZWN0IGNvbnRhaW5pbmcgb3VyIHZhbHVlIHVuZGVyIHRoZSBrZXkgb2YgJycuXG4gIC8vIFJldHVybiB0aGUgcmVzdWx0IG9mIHN0cmluZ2lmeWluZyB0aGUgdmFsdWUuXG5cbiAgICAgICAgcmV0dXJuIHN0cignJywgeycnOiB2YWx1ZX0pO1xuICAgIH07XG5cbiAgLy8gSWYgdGhlIEpTT04gb2JqZWN0IGRvZXMgbm90IHlldCBoYXZlIGEgcGFyc2UgbWV0aG9kLCBnaXZlIGl0IG9uZS5cblxuICAgIEpTT04ucGFyc2UgPSBmdW5jdGlvbiAodGV4dCwgcmV2aXZlcikge1xuICAgIC8vIFRoZSBwYXJzZSBtZXRob2QgdGFrZXMgYSB0ZXh0IGFuZCBhbiBvcHRpb25hbCByZXZpdmVyIGZ1bmN0aW9uLCBhbmQgcmV0dXJuc1xuICAgIC8vIGEgSmF2YVNjcmlwdCB2YWx1ZSBpZiB0aGUgdGV4dCBpcyBhIHZhbGlkIEpTT04gdGV4dC5cblxuICAgICAgICB2YXIgajtcblxuICAgICAgICBmdW5jdGlvbiB3YWxrKGhvbGRlciwga2V5KSB7XG5cbiAgICAvLyBUaGUgd2FsayBtZXRob2QgaXMgdXNlZCB0byByZWN1cnNpdmVseSB3YWxrIHRoZSByZXN1bHRpbmcgc3RydWN0dXJlIHNvXG4gICAgLy8gdGhhdCBtb2RpZmljYXRpb25zIGNhbiBiZSBtYWRlLlxuXG4gICAgICAgICAgICB2YXIgaywgdiwgdmFsdWUgPSBob2xkZXJba2V5XTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgZm9yIChrIGluIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGspKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2ID0gd2Fsayh2YWx1ZSwgayk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVba10gPSB2O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgdmFsdWVba107XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmV2aXZlci5jYWxsKGhvbGRlciwga2V5LCB2YWx1ZSk7XG4gICAgICAgIH1cblxuXG4gICAgLy8gUGFyc2luZyBoYXBwZW5zIGluIGZvdXIgc3RhZ2VzLiBJbiB0aGUgZmlyc3Qgc3RhZ2UsIHdlIHJlcGxhY2UgY2VydGFpblxuICAgIC8vIFVuaWNvZGUgY2hhcmFjdGVycyB3aXRoIGVzY2FwZSBzZXF1ZW5jZXMuIEphdmFTY3JpcHQgaGFuZGxlcyBtYW55IGNoYXJhY3RlcnNcbiAgICAvLyBpbmNvcnJlY3RseSwgZWl0aGVyIHNpbGVudGx5IGRlbGV0aW5nIHRoZW0sIG9yIHRyZWF0aW5nIHRoZW0gYXMgbGluZSBlbmRpbmdzLlxuXG4gICAgICAgIHRleHQgPSBTdHJpbmcodGV4dCk7XG4gICAgICAgIGN4Lmxhc3RJbmRleCA9IDA7XG4gICAgICAgIGlmIChjeC50ZXN0KHRleHQpKSB7XG4gICAgICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKGN4LCBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnXFxcXHUnICtcbiAgICAgICAgICAgICAgICAgICAgKCcwMDAwJyArIGEuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikpLnNsaWNlKC00KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAvLyBJbiB0aGUgc2Vjb25kIHN0YWdlLCB3ZSBydW4gdGhlIHRleHQgYWdhaW5zdCByZWd1bGFyIGV4cHJlc3Npb25zIHRoYXQgbG9va1xuICAgIC8vIGZvciBub24tSlNPTiBwYXR0ZXJucy4gV2UgYXJlIGVzcGVjaWFsbHkgY29uY2VybmVkIHdpdGggJygpJyBhbmQgJ25ldydcbiAgICAvLyBiZWNhdXNlIHRoZXkgY2FuIGNhdXNlIGludm9jYXRpb24sIGFuZCAnPScgYmVjYXVzZSBpdCBjYW4gY2F1c2UgbXV0YXRpb24uXG4gICAgLy8gQnV0IGp1c3QgdG8gYmUgc2FmZSwgd2Ugd2FudCB0byByZWplY3QgYWxsIHVuZXhwZWN0ZWQgZm9ybXMuXG5cbiAgICAvLyBXZSBzcGxpdCB0aGUgc2Vjb25kIHN0YWdlIGludG8gNCByZWdleHAgb3BlcmF0aW9ucyBpbiBvcmRlciB0byB3b3JrIGFyb3VuZFxuICAgIC8vIGNyaXBwbGluZyBpbmVmZmljaWVuY2llcyBpbiBJRSdzIGFuZCBTYWZhcmkncyByZWdleHAgZW5naW5lcy4gRmlyc3Qgd2VcbiAgICAvLyByZXBsYWNlIHRoZSBKU09OIGJhY2tzbGFzaCBwYWlycyB3aXRoICdAJyAoYSBub24tSlNPTiBjaGFyYWN0ZXIpLiBTZWNvbmQsIHdlXG4gICAgLy8gcmVwbGFjZSBhbGwgc2ltcGxlIHZhbHVlIHRva2VucyB3aXRoICddJyBjaGFyYWN0ZXJzLiBUaGlyZCwgd2UgZGVsZXRlIGFsbFxuICAgIC8vIG9wZW4gYnJhY2tldHMgdGhhdCBmb2xsb3cgYSBjb2xvbiBvciBjb21tYSBvciB0aGF0IGJlZ2luIHRoZSB0ZXh0LiBGaW5hbGx5LFxuICAgIC8vIHdlIGxvb2sgdG8gc2VlIHRoYXQgdGhlIHJlbWFpbmluZyBjaGFyYWN0ZXJzIGFyZSBvbmx5IHdoaXRlc3BhY2Ugb3IgJ10nIG9yXG4gICAgLy8gJywnIG9yICc6JyBvciAneycgb3IgJ30nLiBJZiB0aGF0IGlzIHNvLCB0aGVuIHRoZSB0ZXh0IGlzIHNhZmUgZm9yIGV2YWwuXG5cbiAgICAgICAgaWYgKC9eW1xcXSw6e31cXHNdKiQvXG4gICAgICAgICAgICAgICAgLnRlc3QodGV4dC5yZXBsYWNlKC9cXFxcKD86W1wiXFxcXFxcL2JmbnJ0XXx1WzAtOWEtZkEtRl17NH0pL2csICdAJylcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1wiW15cIlxcXFxcXG5cXHJdKlwifHRydWV8ZmFsc2V8bnVsbHwtP1xcZCsoPzpcXC5cXGQqKT8oPzpbZUVdWytcXC1dP1xcZCspPy9nLCAnXScpXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8oPzpefDp8LCkoPzpcXHMqXFxbKSsvZywgJycpKSkge1xuXG4gICAgLy8gSW4gdGhlIHRoaXJkIHN0YWdlIHdlIHVzZSB0aGUgZXZhbCBmdW5jdGlvbiB0byBjb21waWxlIHRoZSB0ZXh0IGludG8gYVxuICAgIC8vIEphdmFTY3JpcHQgc3RydWN0dXJlLiBUaGUgJ3snIG9wZXJhdG9yIGlzIHN1YmplY3QgdG8gYSBzeW50YWN0aWMgYW1iaWd1aXR5XG4gICAgLy8gaW4gSmF2YVNjcmlwdDogaXQgY2FuIGJlZ2luIGEgYmxvY2sgb3IgYW4gb2JqZWN0IGxpdGVyYWwuIFdlIHdyYXAgdGhlIHRleHRcbiAgICAvLyBpbiBwYXJlbnMgdG8gZWxpbWluYXRlIHRoZSBhbWJpZ3VpdHkuXG5cbiAgICAgICAgICAgIGogPSBldmFsKCcoJyArIHRleHQgKyAnKScpO1xuXG4gICAgLy8gSW4gdGhlIG9wdGlvbmFsIGZvdXJ0aCBzdGFnZSwgd2UgcmVjdXJzaXZlbHkgd2FsayB0aGUgbmV3IHN0cnVjdHVyZSwgcGFzc2luZ1xuICAgIC8vIGVhY2ggbmFtZS92YWx1ZSBwYWlyIHRvIGEgcmV2aXZlciBmdW5jdGlvbiBmb3IgcG9zc2libGUgdHJhbnNmb3JtYXRpb24uXG5cbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgcmV2aXZlciA9PT0gJ2Z1bmN0aW9uJyA/XG4gICAgICAgICAgICAgICAgd2Fsayh7Jyc6IGp9LCAnJykgOiBqO1xuICAgICAgICB9XG5cbiAgICAvLyBJZiB0aGUgdGV4dCBpcyBub3QgSlNPTiBwYXJzZWFibGUsIHRoZW4gYSBTeW50YXhFcnJvciBpcyB0aHJvd24uXG5cbiAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKCdKU09OLnBhcnNlJyk7XG4gICAgfTtcblxuICAgIHJldHVybiBKU09OO1xuICB9KSgpO1xuXG4gIGlmICgndW5kZWZpbmVkJyAhPSB0eXBlb2Ygd2luZG93KSB7XG4gICAgd2luZG93LmV4cGVjdCA9IG1vZHVsZS5leHBvcnRzO1xuICB9XG5cbn0pKFxuICAgIHRoaXNcbiAgLCAndW5kZWZpbmVkJyAhPSB0eXBlb2YgbW9kdWxlID8gbW9kdWxlIDoge31cbiAgLCAndW5kZWZpbmVkJyAhPSB0eXBlb2YgZXhwb3J0cyA/IGV4cG9ydHMgOiB7fVxuKTtcbiIsInZhciBMdWMgPSB7fSxcbiAgICBpc0Jyb3dzZXIgPSBmYWxzZTtcblxuaWYodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpc0Jyb3dzZXIgPSB0cnVlO1xufVxuLyoqXG4gKiBAY2xhc3MgTHVjXG4gKiBBbGlhc2VzIGZvciBjb21tb24gTHVjIG1ldGhvZHMgYW5kIHBhY2thZ2VzLiAgQ2hlY2sgb3V0IEx1Yy5kZWZpbmVcbiAqIHRvIGxvb2sgYXQgdGhlIGNsYXNzIHN5c3RlbSBMdWMgcHJvdmlkZXMuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gTHVjO1xuXG52YXIgb2JqZWN0ID0gcmVxdWlyZSgnLi9vYmplY3QnKTtcbkx1Yy5PYmplY3QgPSBvYmplY3Q7XG4vKipcbiAqIEBtZW1iZXIgTHVjXG4gKiBAcHJvcGVydHkgTyBMdWMuT1xuICogQWxpYXMgZm9yIEx1Yy5PYmplY3RcbiAqL1xuTHVjLk8gPSBvYmplY3Q7XG5cblxuLyoqXG4gKiBAbWVtYmVyIEx1Y1xuICogQG1ldGhvZCBhcHBseVxuICogQGluaGVyaXRkb2MgTHVjLk9iamVjdCNhcHBseVxuICovXG5MdWMuYXBwbHkgPSBMdWMuT2JqZWN0LmFwcGx5O1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjXG4gKiBAbWV0aG9kIG1peFxuICogQGluaGVyaXRkb2MgTHVjLk9iamVjdCNtaXhcbiAqL1xuTHVjLm1peCA9IEx1Yy5PYmplY3QubWl4O1xuXG5cbnZhciBmdW4gPSByZXF1aXJlKCcuL2Z1bmN0aW9uJyk7XG5MdWMuRnVuY3Rpb24gPSBmdW47XG5cbi8qKlxuICogQG1lbWJlciBMdWNcbiAqIEBwcm9wZXJ0eSBGIEx1Yy5GXG4gKiBBbGlhcyBmb3IgTHVjLkZ1bmN0aW9uXG4gKi9cbkx1Yy5GID0gZnVuO1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjXG4gKiBAbWV0aG9kIGVtcHR5Rm5cbiAqIEBpbmhlcml0ZG9jIEx1Yy5GdW5jdGlvbiNlbXB0eUZuXG4gKi9cbkx1Yy5lbXB0eUZuID0gTHVjLkZ1bmN0aW9uLmVtcHR5Rm47XG5cbi8qKlxuICogQG1lbWJlciBMdWNcbiAqIEBtZXRob2QgYWJzdHJhY3RGblxuICogQGluaGVyaXRkb2MgTHVjLkZ1bmN0aW9uI2Fic3RyYWN0Rm5cbiAqL1xuTHVjLmFic3RyYWN0Rm4gPSBMdWMuRnVuY3Rpb24uYWJzdHJhY3RGbjtcblxudmFyIGFycmF5ID0gcmVxdWlyZSgnLi9hcnJheScpO1xuTHVjLkFycmF5ID0gYXJyYXk7XG5cbi8qKlxuICogQG1lbWJlciBMdWNcbiAqIEBwcm9wZXJ0eSBBIEx1Yy5BXG4gKiBBbGlhcyBmb3IgTHVjLkFycmF5XG4gKi9cbkx1Yy5BID0gYXJyYXk7XG5cbkx1Yy5BcnJheUZuR2VuZXJhdG9yID0gcmVxdWlyZSgnLi9hcnJheUZuR2VuZXJhdG9yJyk7XG5cbkx1Yy5hcHBseShMdWMsIHJlcXVpcmUoJy4vaXMnKSk7XG5cbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCcuL2V2ZW50cy9ldmVudEVtaXR0ZXInKTtcblxuTHVjLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxudmFyIEJhc2UgPSByZXF1aXJlKCcuL2NsYXNzL2Jhc2UnKTtcblxuTHVjLkJhc2UgPSBCYXNlO1xuXG52YXIgRGVmaW5lciA9IHJlcXVpcmUoJy4vY2xhc3MvZGVmaW5lcicpO1xuXG5MdWMuQ2xhc3NEZWZpbmVyID0gRGVmaW5lcjtcblxuLyoqXG4gKiBAbWVtYmVyIEx1Y1xuICogQG1ldGhvZCBkZWZpbmVcbiAqIEBpbmhlcml0ZG9jIEx1Yy5kZWZpbmUjZGVmaW5lXG4gKi9cbkx1Yy5kZWZpbmUgPSBEZWZpbmVyLmRlZmluZTtcblxuTHVjLlBsdWdpbiA9IHJlcXVpcmUoJy4vY2xhc3MvcGx1Z2luJyk7XG5cbkx1Yy5QbHVnaW5NYW5hZ2VyID0gcmVxdWlyZSgnLi9jbGFzcy9wbHVnaW5NYW5hZ2VyJyk7XG5cbkx1Yy5hcHBseShMdWMsIHtcbiAgICBjb21wb3NpdGlvbkVudW1zOiByZXF1aXJlKCcuL2NsYXNzL2NvbXBvc2l0aW9uRW51bXMnKVxufSk7XG5cbkx1Yy5jb21wYXJlID0gcmVxdWlyZSgnLi9jb21wYXJlJykuY29tcGFyZTtcblxuTHVjLmlkID0gcmVxdWlyZSgnLi9pZCcpO1xuXG5cbmlmKGlzQnJvd3Nlcikge1xuICAgIHdpbmRvdy5MdWMgPSBMdWM7XG59XG5cbi8qKlxuICogQG1lbWJlciBMdWNcbiAqIEBtZXRob2QgYWRkU3VibW9kdWxlXG4gKiBNZXRob2QgdXNlZCBieSBzdWJtb2R1bGUgYXV0aG9ycyB0byBhZGQgdGhlaXIgbW9kdWxlIGludG8gTHVjLlxuICogQnkgZGVmYXVsdCB0aGUgc3VibW9kdWxlIHdpbGwgb25seSBiZSBhZGRlZCB0byBMdWMgaWYgTHVjIGlzIGluXG4gKiB0aGUgY29udGV4dCBvZiBhIGJyb3dzZXIuICBOb2RlIGFscmVhZHkgaGFzIGEgbmljZSBtb2R1bGUgc3lzdGVtLiAgXG4gKiBUaGlzIGJlaGF2aW9yIGNhbiBiZSBvdmVycmlkZGVuIGJ5IHNldHRpbmdcbiAqIEx1Yy5hbHdheXNBZGRTdWJtb2R1bGUgdG8gdHJ1ZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZXNwYWNlIHRoZSBuYW1lc3BhY2Ugb2YgdGhlIHN1Ym1vZHVsZVxuICogQHBhcmFtIHtPYmplY3R9IG9iaiB0aGUgb2JqZWN0ICB0byBhZGQgdG8gdGhlIG5hbWVzcGFjZS4gIElmIGtleXMgYWxyZWFkeSBleGlzdCBpblxuICogdGhlIG5hbWVzcGFjZSB0aGV5IHdpbGwgbm90IGJlIG92ZXJ3cml0dGVuLlxuICpcbiAgICBmdW5jdGlvbiBUb29sdGlwKCkge31cbiAgICB2YXIgY29vbFRvb2x0aXAgPSAge1Rvb2x0aXA6IFRvb2x0aXB9O1xuICAgIEx1Yy5hZGRTdWJtb2R1bGUoJ3VpJywgY29vbFRvb2x0aXApO1xuICAgIEx1Yy51aS5Ub29sdGlwO1xuICAgID5mdW5jdGlvbiBUb29sdGlwKCkge31cblxuICAgICp1c2UgYW5vdGhlciBzdWJtb2R1bGVcbiAgICBcbiAgICBMdWMuYWRkU3VibW9kdWxlKCd1aScsIHtTb21lb25lc09iamVjdDoge2E6dHJ1ZX19KTtcbiAgICBMdWMudWkuVG9vbHRpcDtcbiAgICA+ZnVuY3Rpb24gVG9vbHRpcCgpIHt9XG4gICAgTHVjLnVpLlNvbWVvbmVzT2JqZWN0O1xuICAgID57YTp0cnVlfVxuICovXG5MdWMuYWRkU3VibW9kdWxlID0gZnVuY3Rpb24obmFtZXNwYWNlLCBvYmopIHtcbiAgICB2YXIgdG9BZGQ7XG4gICAgaWYgKEx1Yy5hbHdheXNBZGRTdWJtb2R1bGUgfHwgaXNCcm93c2VyKSB7XG4gICAgICAgIHRvQWRkID0ge307XG4gICAgICAgIHRvQWRkW25hbWVzcGFjZV0gPSBvYmo7XG4gICAgICAgIEx1Yy5PYmplY3QubWVyZ2UoTHVjLCB0b0FkZCk7XG4gICAgfVxufTsiLCJ2YXIgTHVjID0gcmVxdWlyZSgnLi9sdWNUZXN0TGliJyksXG4gICAgZXhwZWN0ID0gcmVxdWlyZSgnZXhwZWN0LmpzJyk7XG5cbmV4cG9ydHMudGVzdEVtaXR0ZXIgPSBmdW5jdGlvbihlbWl0dGVyKSB7XG5cbiAgICB2YXIgaSA9ICcnO1xuICAgIGVtaXR0ZXIub24oJ2FhYScsIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgaSArPSB2O1xuICAgIH0pO1xuICAgIGVtaXR0ZXIuZW1pdCgnYWFhJywgJ2EnKTtcbiAgICBlbWl0dGVyLmVtaXQoJ2FhYScsICdiJyk7XG4gICAgZW1pdHRlci5lbWl0KCdhYWEnLCAnYycpO1xuICAgIGV4cGVjdChpKS50by5iZSgnYWJjJyk7XG4gICAgaSA9IFwiXCI7XG5cbiAgICBlbWl0dGVyLm9uY2UoJ2JiYicsIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgaSArPSB2O1xuICAgIH0pO1xuXG4gICAgZW1pdHRlci5lbWl0KCdiYmInLCAnYScpO1xuICAgIGVtaXR0ZXIuZW1pdCgnYmJiJywgJ2InKTtcbiAgICBlbWl0dGVyLmVtaXQoJ2JiYicsICdjJyk7XG4gICAgZXhwZWN0KGkpLnRvLmJlKCdhJyk7XG59IiwidmFyIG9Ub1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XHJcblxyXG5cclxuLyoqXHJcbiAqIEBtZW1iZXIgTHVjXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoZSBwYXNzZWQgaW4gb2JqZWN0IGlzIG9mXHJcbiAqIHRoZSB0eXBlIHtAbGluayBBcnJheSBBcnJheX1cclxuICogQHBhcmFtICB7T2JqZWN0fSAgb2JqIFxyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKi9cclxuZnVuY3Rpb24gaXNBcnJheShvYmopIHtcclxuICAgIHJldHVybiBBcnJheS5pc0FycmF5KG9iaik7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAbWVtYmVyIEx1Y1xyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgcGFzc2VkIGluIG9iamVjdCBpcyBvZlxyXG4gKiB0aGUgdHlwZSB7QGxpbmsgT2JqZWN0IE9iamVjdH1cclxuICogQHBhcmFtICB7T2JqZWN0fSAgb2JqIFxyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKi9cclxuZnVuY3Rpb24gaXNPYmplY3Qob2JqKSB7XHJcbiAgICByZXR1cm4gb2JqICYmIG9Ub1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IE9iamVjdF0nO1xyXG59XHJcblxyXG4vKipcclxuICogQG1lbWJlciBMdWNcclxuICogUmV0dXJuIHRydWUgaWYgdGhlIHBhc3NlZCBpbiBvYmplY3QgaXMgb2ZcclxuICogdGhlIHR5cGUge0BsaW5rIEZ1bmN0aW9uIEZ1bmN0aW9ufVxyXG4gKiBAcGFyYW0gIHtPYmplY3R9ICBvYmogXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAqL1xyXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKG9iaikge1xyXG4gICAgcmV0dXJuIG9Ub1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAbWVtYmVyIEx1Y1xyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgcGFzc2VkIGluIG9iamVjdCBpcyBvZlxyXG4gKiB0aGUgdHlwZSB7QGxpbmsgRGF0ZSBEYXRlfVxyXG4gKiBAcGFyYW0gIHtPYmplY3R9ICBvYmogXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAqL1xyXG5mdW5jdGlvbiBpc0RhdGUob2JqKSB7XHJcbiAgICByZXR1cm4gb1RvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xyXG59XHJcblxyXG4vKipcclxuICogQG1lbWJlciBMdWNcclxuICogUmV0dXJuIHRydWUgaWYgdGhlIHBhc3NlZCBpbiBvYmplY3QgaXMgb2ZcclxuICogdGhlIHR5cGUge0BsaW5rIFJlZ0V4cCBSZWdFeHB9XHJcbiAqIEBwYXJhbSAge09iamVjdH0gIG9iaiBcclxuICogQHJldHVybiB7Qm9vbGVhbn1cclxuICovXHJcbmZ1bmN0aW9uIGlzUmVnRXhwKG9iaikge1xyXG4gICAgcmV0dXJuIG9Ub1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IFJlZ0V4cF0nO1xyXG59XHJcblxyXG4vKipcclxuICogQG1lbWJlciBMdWNcclxuICogUmV0dXJuIHRydWUgaWYgdGhlIHBhc3NlZCBpbiBvYmplY3QgaXMgb2ZcclxuICogdGhlIHR5cGUge0BsaW5rIE51bWJlciBOdW1iZXJ9XHJcbiAqIEBwYXJhbSAge09iamVjdH0gIG9iaiBcclxuICogQHJldHVybiB7Qm9vbGVhbn1cclxuICovXHJcbmZ1bmN0aW9uIGlzTnVtYmVyKG9iaikge1xyXG4gICAgcmV0dXJuIG9Ub1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IE51bWJlcl0nO1xyXG59XHJcblxyXG4vKipcclxuICogQG1lbWJlciBMdWNcclxuICogUmV0dXJuIHRydWUgaWYgdGhlIHBhc3NlZCBpbiBvYmplY3QgaXMgb2ZcclxuICogdGhlIHR5cGUge0BsaW5rIFN0cmluZyBTdHJpbmd9XHJcbiAqIEBwYXJhbSAge09iamVjdH0gIG9iaiBcclxuICogQHJldHVybiB7Qm9vbGVhbn1cclxuICovXHJcbmZ1bmN0aW9uIGlzU3RyaW5nKG9iaikge1xyXG4gICAgcmV0dXJuIG9Ub1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IFN0cmluZ10nO1xyXG59XHJcblxyXG4vKipcclxuICogQG1lbWJlciBMdWNcclxuICogUmV0dXJuIHRydWUgaWYgdGhlIHBhc3NlZCBpbiBvYmplY3QgaXMgb2ZcclxuICogdGhlIHR5cGUgYXJndW1lbnRzLlxyXG4gKiBcclxuICogQHBhcmFtICB7T2JqZWN0fSAgb2JqIFxyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKi9cclxuZnVuY3Rpb24gaXNBcmd1bWVudHMob2JqKSB7XHJcbiAgICByZXR1cm4gb1RvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJndW1lbnRzXScgfHwgb2JqICYmICEhb2JqLmNhbGxlZTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBtZW1iZXIgTHVjXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoZSBvYmplY3QgaXMgZmFsc3kgYnV0IG5vdCB6ZXJvLlxyXG4gICAgTHVjLmlzRmFsc3koZmFsc2UpXHJcbiAgICA+dHJ1ZVxyXG4gICAgTHVjLmlzRmFsc3koMClcclxuICAgID5mYWxzZVxyXG4gKiBAcGFyYW0gIHtPYmplY3R9ICBvYmpcclxuICogQHJldHVybiB7Qm9vbGVhbn0gICAgIFxyXG4gKi9cclxuZnVuY3Rpb24gaXNGYWxzeShvYmopIHtcclxuICAgIHJldHVybiAoIW9iaiAmJiBvYmogIT09IDApO1xyXG59XHJcblxyXG4vKipcclxuICogQG1lbWJlciBMdWNcclxuICogUmV0dXJuIHRydWUgaWYgdGhlIG9iamVjdCBpcyBlbXB0eS5cclxuICoge30sIFtdLCAnJyxmYWxzZSwgbnVsbCwgdW5kZWZpbmVkLCBOYU4gXHJcbiAqIGFyZSBhbGwgdHJlYXRlZCBhcyBlbXB0eS5cclxuICogXHJcbiAgICBMdWMuaXNFbXB0eSh0cnVlKVxyXG4gICAgPmZhbHNlXHJcbiAgICBMdWMuaXNFbXB0eShbXSlcclxuICAgID50cnVlXHJcbiAgICBcclxuICogQHBhcmFtICB7T2JqZWN0fSAgb2JqXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAqL1xyXG5mdW5jdGlvbiBpc0VtcHR5KG9iaikge1xyXG4gICAgdmFyIGVtcHR5ID0gZmFsc2U7XHJcblxyXG4gICAgaWYgKGlzRmFsc3kob2JqKSkge1xyXG4gICAgICAgIGVtcHR5ID0gdHJ1ZTtcclxuICAgIH0gZWxzZSBpZiAoaXNBcnJheShvYmopKSB7XHJcbiAgICAgICAgZW1wdHkgPSBvYmoubGVuZ3RoID09PSAwO1xyXG4gICAgfSBlbHNlIGlmIChpc09iamVjdChvYmopKSB7XHJcbiAgICAgICAgZW1wdHkgPSBPYmplY3Qua2V5cyhvYmopLmxlbmd0aCA9PT0gMDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZW1wdHk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgaXNBcnJheTogaXNBcnJheSxcclxuICAgIGlzT2JqZWN0OiBpc09iamVjdCxcclxuICAgIGlzRnVuY3Rpb246IGlzRnVuY3Rpb24sXHJcbiAgICBpc0RhdGU6IGlzRGF0ZSxcclxuICAgIGlzU3RyaW5nOiBpc1N0cmluZyxcclxuICAgIGlzTnVtYmVyOiBpc051bWJlcixcclxuICAgIGlzUmVnRXhwOiBpc1JlZ0V4cCxcclxuICAgIGlzQXJndW1lbnRzOiBpc0FyZ3VtZW50cyxcclxuICAgIGlzRmFsc3k6IGlzRmFsc3ksXHJcbiAgICBpc0VtcHR5OiBpc0VtcHR5XHJcbn07IiwidmFyIGlkcyA9IHt9O1xuLyoqXG4gKiBAbWVtYmVyIEx1Y1xuICogQG1ldGhvZCBpZFxuICogXG4gKiBSZXR1cm4gYSB1bmlxdWUgaWQuXG4gKiBAcGFyYW0ge1N0cmluZ30gW3ByZWZpeF0gT3B0aW9uYWwgcHJlZml4IHRvIHVzZVxuICpcbiAqXG4gICAgICAgIEx1Yy5pZCgpXG4gICAgICAgID5cImx1Yy0wXCJcbiAgICAgICAgTHVjLmlkKClcbiAgICAgICAgPlwibHVjLTFcIlxuICAgICAgICBMdWMuaWQoJ215LXByZWZpeCcpXG4gICAgICAgID5cIm15LXByZWZpeDBcIlxuICAgICAgICBMdWMuaWQoJycpXG4gICAgICAgID5cIjBcIlxuICpcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocCkge1xuICAgIHZhciBwcmVmaXggPSBwID09PSB1bmRlZmluZWQgPyAnbHVjLScgOiBwO1xuXG4gICAgaWYoaWRzW3ByZWZpeF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZHNbcHJlZml4XSA9IDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHByZWZpeCArIGlkc1twcmVmaXhdKys7XG59OyIsInZhciBpcyA9IHJlcXVpcmUoJy4vaXMnKSxcbiAgICBhSW5zZXJ0ID0gcmVxdWlyZSgnLi9hcnJheScpLmluc2VydCxcbiAgICBhRWFjaCA9IHJlcXVpcmUoJy4vYXJyYXknKS5lYWNoO1xuXG4vKipcbiAqIEBjbGFzcyBMdWMuRnVuY3Rpb25cbiAqIFBhY2thZ2UgZm9yIGZ1bmN0aW9uIG1ldGhvZHMuICBNb3N0IG9mIHRoZW0gZm9sbG93IHRoZSBzYW1lIGFwaTpcbiAqIGZ1bmN0aW9uIG9yIGZ1bmN0aW9uW10sIHJlbGV2YW50IGFyZ3MgLi4uIHdpdGggYW4gb3B0aW9uYWwgY29uZmlnXG4gKiB0byBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudGVyIGFzIHRoZSBsYXN0IGFyZ3VtZW50LlxuICovXG5cbmZ1bmN0aW9uIF9hdWdtZW50QXJncyhjb25maWcsIGNhbGxBcmdzKSB7XG4gICAgdmFyIGNvbmZpZ0FyZ3MgPSBjb25maWcuYXJncyxcbiAgICAgICAgaW5kZXggPSBjb25maWcuaW5kZXgsXG4gICAgICAgIGFyZ3NBcnJheTtcblxuICAgIGlmICghY29uZmlnQXJncykge1xuICAgICAgICByZXR1cm4gY2FsbEFyZ3M7XG4gICAgfVxuXG4gICAgaWYoaW5kZXggPT09IHRydWUgfHwgaXMuaXNOdW1iZXIoaW5kZXgpKSB7XG4gICAgICAgIGlmKGNvbmZpZy5hcmd1bWVudHNGaXJzdCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBhSW5zZXJ0KGNvbmZpZ0FyZ3MsIGNhbGxBcmdzLCBpbmRleCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFJbnNlcnQoY2FsbEFyZ3MsIGNvbmZpZ0FyZ3MsIGluZGV4KTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29uZmlnQXJncztcbn1cblxuLyoqXG4gKiBBIHJldXNhYmxlIGVtcHR5IGZ1bmN0aW9uXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZXhwb3J0cy5lbXB0eUZuID0gZnVuY3Rpb24oKSB7fTtcblxuLyoqXG4gKiBBIGZ1bmN0aW9uIHRoYXQgdGhyb3dzIGFuIGVycm9yIHdoZW4gY2FsbGVkLlxuICogVXNlZnVsIHdoZW4gZGVmaW5pbmcgYWJzdHJhY3QgbGlrZSBjbGFzc2VzXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZXhwb3J0cy5hYnN0cmFjdEZuID0gZnVuY3Rpb24oKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdhYnN0cmFjdEZuIG11c3QgYmUgaW1wbGVtZW50ZWQnKTtcbn07XG5cbi8qKlxuICogQXVnbWVudCB0aGUgcGFzc2VkIGluIGZ1bmN0aW9uJ3MgdGhpc0FyZyBhbmQgb3IgYXJndW1lbnRzIG9iamVjdCBcbiAqIGJhc2VkIG9uIHRoZSBwYXNzZWQgaW4gY29uZmlnLlxuICogXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gZm4gdGhlIGZ1bmN0aW9uIHRvIGNhbGxcbiAqIEBwYXJhbSAge09iamVjdH0gY29uZmlnXG4gKiBcbiAqIEBwYXJhbSB7T2JqZWN0fSBbY29uZmlnLnRoaXNBcmddIHRoZSB0aGlzQXJnIGZvciB0aGUgZnVuY3Rpb24gYmVpbmcgZXhlY3V0ZWQuXG4gKiBJZiB0aGlzIGlzIHRoZSBvbmx5IHByb3BlcnR5IG9uIHlvdXIgY29uZmlnIG9iamVjdCB0aGUgcHJlZmVycmVkIHdheSB3b3VsZFxuICogYmUganVzdCB0byB1c2UgRnVuY3Rpb24uYmluZFxuICogXG4gKiBAcGFyYW0ge0FycmF5fSBbY29uZmlnLmFyZ3NdIHRoZSBhcmd1bWVudHMgdXNlZCBmb3IgdGhlIGZ1bmN0aW9uIGJlaW5nIGV4ZWN1dGVkLlxuICogVGhpcyB3aWxsIHJlcGxhY2UgdGhlIGZ1bmN0aW9ucyBjYWxsIGFyZ3MgaWYgaW5kZXggaXMgbm90IGEgbnVtYmVyIG9yIFxuICogdHJ1ZS5cbiAqIFxuICogQHBhcmFtIHtOdW1iZXIvVHJ1ZX0gW2NvbmZpZy5pbmRleF0gQnkgZGVmYXVsdCB0aGUgdGhlIGNvbmZpZ3VyZWQgYXJndW1lbnRzXG4gKiB3aWxsIGJlIGluc2VydGVkIGludG8gdGhlIGZ1bmN0aW9ucyBwYXNzZWQgaW4gY2FsbCBhcmd1bWVudHMuICBJZiBpbmRleCBpcyB0cnVlXG4gKiBhcHBlbmQgdGhlIGFyZ3MgdG9nZXRoZXIgaWYgaXQgaXMgYSBudW1iZXIgaW5zZXJ0IGl0IGF0IHRoZSBwYXNzZWQgaW4gaW5kZXguXG4gKiBcbiAqIEBwYXJhbSB7QXJyYXl9IFtjb25maWcuYXJndW1lbnRzRmlyc3RdIHBhc3MgaW4gZmFsc2UgdG8gXG4gKiBhdWdtZW50IHRoZSBjb25maWd1cmVkIGFyZ3MgZmlyc3Qgd2l0aCBMdWMuQXJyYXkuaW5zZXJ0LiAgRGVmYXVsdHNcbiAqIHRvIHRydWVcbiAgICAgXG4gICAgIGZ1bmN0aW9uIGZuKCkge1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzKVxuICAgICAgICBjb25zb2xlLmxvZyhhcmd1bWVudHMpXG4gICAgfVxuICAgIFxuICAgIC8vTHVjLkFycmF5Lmluc2VydChbNF0sIFsxLDIsM10sIDApXG4gICAgTHVjLkZ1bmN0aW9uLmNyZWF0ZUF1Z21lbnRlcihmbiwge1xuICAgICAgICB0aGlzQXJnOiB7Y29uZmlnZWRUaGlzQXJnOiB0cnVlfSxcbiAgICAgICAgYXJnczogWzEsMiwzXSxcbiAgICAgICAgaW5kZXg6MFxuICAgIH0pKDQpXG5cbiAgICA+T2JqZWN0IHtjb25maWdlZFRoaXNBcmc6IHRydWV9XG4gICAgPlsxLCAyLCAzLCA0XVxuXG4gICAgLy9MdWMuQXJyYXkuaW5zZXJ0KFsxLDIsM10sIFs0XSwgMClcbiAgICBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudGVyKGZuLCB7XG4gICAgICAgIHRoaXNBcmc6IHtjb25maWdlZFRoaXNBcmc6IHRydWV9LFxuICAgICAgICBhcmdzOiBbMSwyLDNdLFxuICAgICAgICBpbmRleDowLFxuICAgICAgICBhcmd1bWVudHNGaXJzdDpmYWxzZVxuICAgIH0pKDQpXG5cbiAgICA+T2JqZWN0IHtjb25maWdlZFRoaXNBcmc6IHRydWV9XG4gICAgPls0LCAxLCAyLCAzXVxuXG4gICAgTHVjLkFycmF5Lmluc2VydChbNF0sIFsxLDIsM10sICB0cnVlKVxuICAgIHZhciBmID0gTHVjLkZ1bmN0aW9uLmNyZWF0ZUF1Z21lbnRlcihmbiwge1xuICAgICAgICBhcmdzOiBbMSwyLDNdLFxuICAgICAgICBpbmRleDogdHJ1ZVxuICAgIH0pO1xuXG4gICAgZi5hcHBseSh7Y29uZmlnOiBmYWxzZX0sIFs0XSlcblxuICAgID5PYmplY3Qge2NvbmZpZzogZmFsc2V9XG4gICAgPls0LCAxLCAyLCAzXVxuXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gdGhlIGF1Z21lbnRlZCBmdW5jdGlvbi5cbiAqL1xuZXhwb3J0cy5jcmVhdGVBdWdtZW50ZXIgPSBmdW5jdGlvbihmbiwgY29uZmlnKSB7XG4gICAgdmFyIHRoaXNBcmcgPSBjb25maWcudGhpc0FyZztcblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGZuLmFwcGx5KHRoaXNBcmcgfHwgdGhpcywgX2F1Z21lbnRBcmdzKGNvbmZpZywgYXJndW1lbnRzKSk7XG4gICAgfTtcbn07XG5cbmZ1bmN0aW9uIF9pbml0U2VxdWVuY2VGdW5jdGlvbnMoZm5zLCBjb25maWcpIHtcbiAgICB2YXIgdG9SdW4gPSBbXTtcbiAgICBhRWFjaChmbnMsIGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgdmFyIGZuID0gZjtcblxuICAgICAgICBpZiAoY29uZmlnKSB7XG4gICAgICAgICAgICBmbiA9IGV4cG9ydHMuY3JlYXRlQXVnbWVudGVyKGYsIGNvbmZpZyk7XG4gICAgICAgIH1cblxuICAgICAgICB0b1J1bi5wdXNoKGZuKTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0b1J1bjtcbn1cblxuLyoqXG4gKiBSZXR1cm4gYSBmdW5jdGlvbiB0aGF0IHJ1bnMgdGhlIHBhc3NlZCBpbiBmdW5jdGlvbnNcbiAqIGFuZCByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIGxhc3QgZnVuY3Rpb24gY2FsbGVkLlxuICogXG4gKiBAcGFyYW0gIHtGdW5jdGlvbltdfSBmbnMgXG4gKiBAcGFyYW0gIHtPYmplY3R9IFtjb25maWddIENvbmZpZyBvYmplY3RcbiAqIGZvciBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudGVyLiAgSWYgZGVmaW5lZCBhbGwgb2YgdGhlIGZ1bmN0aW9uc1xuICogd2lsbCBnZXQgY3JlYXRlZCB3aXRoIHRoZSBwYXNzZWQgaW4gY29uZmlnO1xuICpcbiAgICBMdWMuRnVuY3Rpb24uY3JlYXRlU2VxdWVuY2UoW1xuICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKDEpXG4gICAgICAgIH0sXG4gICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coMilcbiAgICAgICAgfSxcbiAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygzKVxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2ZpbmlzaGVkIGxvZ2dpbmcnKVxuICAgICAgICAgICAgcmV0dXJuIDQ7XG4gICAgICAgIH1cbiAgICBdKSgpXG4gICAgPjFcbiAgICA+MlxuICAgID4zXG4gICAgPmZpbmlzaGVkIGxvZ2dpbmdcbiAgICA+NFxuICogXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZXhwb3J0cy5jcmVhdGVTZXF1ZW5jZSA9IGZ1bmN0aW9uKGZucywgY29uZmlnKSB7XG4gICAgdmFyIGZ1bmN0aW9ucyA9IF9pbml0U2VxdWVuY2VGdW5jdGlvbnMoZm5zLCBjb25maWcpO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaSA9IDAsXG4gICAgICAgICAgICBsYXN0Rm5JbmRleCA9IGZ1bmN0aW9ucy5sZW5ndGggLTE7XG5cbiAgICAgICAgZm9yKDtpIDwgbGFzdEZuSW5kZXg7ICsraSkge1xuICAgICAgICAgICAgZnVuY3Rpb25zW2ldLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZnVuY3Rpb25zW2xhc3RGbkluZGV4XS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG59O1xuXG4vKipcbiAqIFJldHVybiBhIGZ1bmN0aW9uIHRoYXQgcnVucyB0aGUgcGFzc2VkIGluIGZ1bmN0aW9uc1xuICogaWYgb25lIG9mIHRoZSBmdW5jdGlvbnMgcmV0dXJucyBmYWxzZSB0aGUgcmVzdCBvZiB0aGUgXG4gKiBmdW5jdGlvbnMgd29uJ3QgcnVuIGFuZCBmYWxzZSB3aWxsIGJlIHJldHVybmVkLlxuICpcbiAqIElmIG5vIGZhbHNlIGlzIHJldHVybmVkIHRoZSB2YWx1ZSBvZiB0aGUgbGFzdCBmdW5jdGlvbiByZXR1cm4gd2lsbCBiZSByZXR1cm5lZFxuICogXG4gICAgTHVjLkZ1bmN0aW9uLmNyZWF0ZVNlcXVlbmNlSWYoW1xuICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKDEpXG4gICAgICAgIH0sXG4gICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coMilcbiAgICAgICAgfSxcbiAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygzKVxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2ZpbmlzaGVkIGxvZ2dpbmcnKVxuICAgICAgICAgICAgcmV0dXJuIDQ7XG4gICAgICAgIH0sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpIGNhbnQgbG9nJylcbiAgICAgICAgfVxuICAgIF0pKClcblxuICAgID4xXG4gICAgPjJcbiAgICA+M1xuICAgID5maW5pc2hlZCBsb2dnaW5nXG4gICAgPmZhbHNlXG4gKlxuICogXG4gKiBAcGFyYW0gIHtGdW5jdGlvbltdfSBmbnMgXG4gKiBAcGFyYW0gIHtPYmplY3R9IFtjb25maWddIENvbmZpZyBvYmplY3RcbiAqIGZvciBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudGVyLiAgSWYgZGVmaW5lZCBhbGwgb2YgdGhlIGZ1bmN0aW9uc1xuICogd2lsbCBnZXQgY3JlYXRlZCB3aXRoIHRoZSBwYXNzZWQgaW4gY29uZmlnO1xuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbmV4cG9ydHMuY3JlYXRlU2VxdWVuY2VJZiA9IGZ1bmN0aW9uKGZucywgY29uZmlnKSB7XG4gICAgdmFyIGZ1bmN0aW9ucyA9IF9pbml0U2VxdWVuY2VGdW5jdGlvbnMoZm5zLCBjb25maWcpO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdmFsdWUsXG4gICAgICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgICAgIGZ1bmN0aW9ucy5zb21lKGZ1bmN0aW9uKGZuKXtcbiAgICAgICAgICAgIHZhbHVlID0gZm4uYXBwbHkodGhpcywgYXJncyk7XG5cbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSA9PT0gZmFsc2U7XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9O1xufTtcblxuLyoqXG4gKiBSZXR1cm4gYSBmdW5jdGlvbnMgdGhhdCBydW5zIHRoZSBwYXNzZWQgaW4gZnVuY3Rpb25zXG4gKiB0aGUgcmVzdWx0IG9mIGVhY2ggZnVuY3Rpb24gd2lsbCBiZSB0aGUgdGhlIGNhbGwgYXJncyBcbiAqIGZvciB0aGUgbmV4dCBmdW5jdGlvbi4gIFRoZSB2YWx1ZSBvZiB0aGUgbGFzdCBmdW5jdGlvbiBcbiAqIHJldHVybiB3aWxsIGJlIHJldHVybmVkLlxuICogXG4gICAgIFxuICAgICBMdWMuRnVuY3Rpb24uY3JlYXRlUmVsYXllcihbXG4gICAgICAgIGZ1bmN0aW9uKHN0cikge1xuICAgICAgICAgICAgcmV0dXJuIHN0ciArICdiJ1xuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbihzdHIpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHIgKyAnYydcbiAgICAgICAgfSxcbiAgICAgICAgZnVuY3Rpb24oc3RyKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RyICsgJ2QnXG4gICAgICAgIH1cbiAgICBdKSgnYScpXG5cbiAgICA+XCJhYmNkXCJcblxuICogQHBhcmFtICB7RnVuY3Rpb25bXX0gZm5zIFxuICogQHBhcmFtICB7T2JqZWN0fSBbY29uZmlnXSBDb25maWcgb2JqZWN0XG4gKiBmb3IgTHVjLkZ1bmN0aW9uLmNyZWF0ZUF1Z21lbnRlci4gIElmIGRlZmluZWQgYWxsIG9mIHRoZSBmdW5jdGlvbnNcbiAqIHdpbGwgZ2V0IGNyZWF0ZWQgd2l0aCB0aGUgcGFzc2VkIGluIGNvbmZpZztcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5leHBvcnRzLmNyZWF0ZVJlbGF5ZXIgPSBmdW5jdGlvbihmbnMsIGNvbmZpZykge1xuICAgIHZhciBmdW5jdGlvbnMgPSBfaW5pdFNlcXVlbmNlRnVuY3Rpb25zKGZucywgY29uZmlnKTtcblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHZhbHVlLFxuICAgICAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcblxuICAgICAgICBmdW5jdGlvbnMuZm9yRWFjaChmdW5jdGlvbihmbiwgaW5kZXgpIHtcbiAgICAgICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gZm4uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gZm4uYXBwbHkodGhpcywgW3ZhbHVlXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9O1xufTtcblxuLyoqXG4gKiBDcmVhdGUgYSB0aHJvdHRsZWQgZnVuY3Rpb24gZnJvbSB0aGUgcGFzc2VkIGluIGZ1bmN0aW9uXG4gKiB0aGF0IHdpbGwgb25seSBnZXQgY2FsbGVkIG9uY2UgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHNcbiAqIGhhdmUgYmVlbiBleGNlZWRlZC5cbiAqIFxuICAgIHZhciBsb2dBcmdzICA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhhcmd1bWVudHMpXG4gICAgfTtcblxuICAgIHZhciBhID0gTHVjLkZ1bmN0aW9uLmNyZWF0ZVRocm90dGxlZChsb2dBcmdzLCAxKTtcblxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCAxMDA7ICsraSkge1xuICAgICAgICBhKDEsMiwzKTtcbiAgICB9XG5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBhKDEpXG4gICAgfSwgMTAwKVxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGEoMilcbiAgICB9LCA0MDApXG5cbiAgICA+WzEsIDIsIDNdXG4gICAgPlsxXVxuICAgID5bMl1cbiAqIFxuICogQHBhcmFtICB7RnVuY3Rpb259IGZuXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IG1pbGxpcyBOdW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvXG4gKiB0aHJvdHRsZSB0aGUgZnVuY3Rpb24uXG4gKiBAcGFyYW0gIHtPYmplY3R9IFtjb25maWddIENvbmZpZyBvYmplY3RcbiAqIGZvciBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudGVyLiAgSWYgZGVmaW5lZCBhbGwgb2YgdGhlIGZ1bmN0aW9uc1xuICogd2lsbCBnZXQgY3JlYXRlZCB3aXRoIHRoZSBwYXNzZWQgaW4gY29uZmlnO1xuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbmV4cG9ydHMuY3JlYXRlVGhyb3R0bGVkID0gZnVuY3Rpb24oZiwgbWlsbGlzLCBjb25maWcpIHtcbiAgICB2YXIgZm4gPSBjb25maWcgPyBleHBvcnRzLmNyZWF0ZUF1Z21lbnRlcihmLCBjb25maWcpIDogZixcbiAgICAgICAgdGltZU91dElkID0gZmFsc2U7XG5cbiAgICBpZighbWlsbGlzKSB7XG4gICAgICAgIHJldHVybiBmbjtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgICAgIGlmKHRpbWVPdXRJZCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVPdXRJZCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aW1lT3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGltZU91dElkID0gZmFsc2U7XG4gICAgICAgICAgICBmbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgfSwgbWlsbGlzKTtcbiAgICB9O1xufTtcblxuLyoqXG4gKiBEZWZlciBhIGZ1bmN0aW9uJ3MgZXhlY3V0aW9uIGZvciB0aGUgcGFzc2VkIGluXG4gKiBtaWxsaXNlY29uZHMuXG4gKiBcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmblxuICogQHBhcmFtICB7TnVtYmVyfSBtaWxsaXMgTnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0b1xuICogZGVmZXJcbiAqIEBwYXJhbSAge09iamVjdH0gW2NvbmZpZ10gQ29uZmlnIG9iamVjdFxuICogZm9yIEx1Yy5GdW5jdGlvbi5jcmVhdGVBdWdtZW50ZXIuICBJZiBkZWZpbmVkIGFsbCBvZiB0aGUgZnVuY3Rpb25zXG4gKiB3aWxsIGdldCBjcmVhdGVkIHdpdGggdGhlIHBhc3NlZCBpbiBjb25maWc7XG4gKiBcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5leHBvcnRzLmNyZWF0ZURlZmVycmVkID0gZnVuY3Rpb24oZiwgbWlsbGlzLCBjb25maWcpIHtcbiAgICB2YXIgZm4gPSBjb25maWcgPyBleHBvcnRzLmNyZWF0ZUF1Z21lbnRlcihmLCBjb25maWcpIDogZjtcblxuICAgIGlmKCFtaWxsaXMpIHtcbiAgICAgICAgcmV0dXJuIGZuO1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG5cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICB9LCBtaWxsaXMpO1xuICAgIH07XG59OyIsInZhciBpcyA9IHJlcXVpcmUoJy4vaXMnKTtcblxuLyoqXG4gKiBAY2xhc3MgTHVjLk9iamVjdFxuICogUGFja2FnZSBmb3IgT2JqZWN0IG1ldGhvZHMuICBMdWMuT2JqZWN0LmFwcGx5IGFuZCBMdWMuT2JqZWN0LmVhY2hcbiAqIGFyZSB1c2VkIHZlcnkgb2Z0ZW4uICBtaXggYW5kIGFwcGx5IGFyZSBhbGlhc2VkIHRvIEx1Yy5hcHBseSBhbmQgTHVjLm1peC5cbiAqL1xuXG4vKipcbiAqIEFwcGx5IHRoZSBwcm9wZXJ0aWVzIGZyb20gZnJvbU9iamVjdCB0byB0aGUgdG9PYmplY3QuICBmcm9tT2JqZWN0IHdpbGxcbiAqIG92ZXJ3cml0ZSBhbnkgc2hhcmVkIGtleXMuICBJdCBjYW4gYWxzbyBiZSB1c2VkIGFzIGEgc2ltcGxlIHNoYWxsb3cgY2xvbmUuXG4gKiBcbiAgICB2YXIgdG8gPSB7YToxLCBjOjF9LCBmcm9tID0ge2E6MiwgYjoyfVxuICAgIEx1Yy5PYmplY3QuYXBwbHkodG8sIGZyb20pXG4gICAgPk9iamVjdCB7YTogMiwgYzogMSwgYjogMn1cbiAgICB0byA9PT0gdG9cbiAgICA+dHJ1ZVxuICAgIHZhciBjbG9uZSA9IEx1Yy5PYmplY3QuYXBwbHkoe30sIGZyb20pXG4gICAgPnVuZGVmaW5lZFxuICAgIGNsb25lXG4gICAgPk9iamVjdCB7YTogMiwgYjogMn1cbiAgICBjbG9uZSA9PT0gZnJvbVxuICAgID5mYWxzZVxuICpcbiAqIE5vIG51bGwgY2hlY2tzIGFyZSBuZWVkZWQuXG4gICAgXG4gICAgTHVjLmFwcGx5KHVuZGVmaW5lZCwge2E6MX0pXG4gICAgPnthOjF9XG4gICAgTHVjLmFwcGx5KHthOiAxfSlcbiAgICA+e2E6MX1cblxuICpcbiAqIFxuICogQHBhcmFtICB7T2JqZWN0fSBbdG9PYmplY3RdIE9iamVjdCB0byBwdXQgdGhlIHByb3BlcnRpZXMgZnJvbU9iamVjdCBvbi5cbiAqIEBwYXJhbSAge09iamVjdH0gW2Zyb21PYmplY3RdIE9iamVjdCB0byBwdXQgdGhlIHByb3BlcnRpZXMgb24gdGhlIHRvT2JqZWN0XG4gKiBAcmV0dXJuIHtPYmplY3R9IHRoZSB0b09iamVjdFxuICovXG5leHBvcnRzLmFwcGx5ID0gZnVuY3Rpb24odG9PYmplY3QsIGZyb21PYmplY3QpIHtcbiAgICB2YXIgdG8gPSB0b09iamVjdCB8fCB7fSxcbiAgICAgICAgZnJvbSA9IGZyb21PYmplY3QgfHwge30sXG4gICAgICAgIHByb3A7XG5cbiAgICBmb3IgKHByb3AgaW4gZnJvbSkge1xuICAgICAgICBpZiAoZnJvbS5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgICAgdG9bcHJvcF0gPSBmcm9tW3Byb3BdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRvO1xufTtcblxuLyoqXG4gKiBTaW1pbGFyIHRvIEx1Yy5PYmplY3QuYXBwbHkgZXhjZXB0IHRoYXQgdGhlIGZyb21PYmplY3Qgd2lsbCBcbiAqIE5PVCBvdmVyd3JpdGUgdGhlIGtleXMgb2YgdGhlIHRvT2JqZWN0IGlmIHRoZXkgYXJlIGRlZmluZWQuXG4gKlxuICAgIEx1Yy5taXgoe2E6MSxiOjJ9LCB7YTozLGI6NCxjOjV9KVxuICAgID57YTogMSwgYjogMiwgYzogNX1cblxuICogTm8gbnVsbCBjaGVja3MgYXJlIG5lZWRlZC5cbiAgICBcbiAgICBMdWMubWl4KHVuZGVmaW5lZCwge2E6MX0pXG4gICAgPnthOjF9XG4gICAgTHVjLm1peCh7YTogMX0pXG4gICAgPnthOjF9XG4gICAgXG4gKlxuXG4gKiBAcGFyYW0gIHtPYmplY3R9IFt0b09iamVjdF0gT2JqZWN0IHRvIHB1dCB0aGUgcHJvcGVydGllcyBmcm9tT2JqZWN0IG9uLlxuICogQHBhcmFtICB7T2JqZWN0fSBbZnJvbU9iamVjdF0gZnJvbU9iamVjdCBPYmplY3QgdG8gcHV0IHRoZSBwcm9wZXJ0aWVzIG9uIHRoZSB0b09iamVjdFxuICogQHJldHVybiB7T2JqZWN0fSB0aGUgdG9PYmplY3RcbiAqL1xuZXhwb3J0cy5taXggPSBmdW5jdGlvbih0b09iamVjdCwgZnJvbU9iamVjdCkge1xuICAgIHZhciB0byA9IHRvT2JqZWN0IHx8IHt9LFxuICAgICAgICBmcm9tID0gZnJvbU9iamVjdCB8fCB7fSxcbiAgICAgICAgcHJvcDtcblxuICAgIGZvciAocHJvcCBpbiBmcm9tKSB7XG4gICAgICAgIGlmIChmcm9tLmhhc093blByb3BlcnR5KHByb3ApICYmIHRvW3Byb3BdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRvW3Byb3BdID0gZnJvbVtwcm9wXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0bztcbn07XG5cbi8qKlxuICogSXRlcmF0ZSBvdmVyIGFuIG9iamVjdHMgcHJvcGVydGllc1xuICogYXMga2V5IHZhbHVlIFwicGFpcnNcIiB3aXRoIHRoZSBwYXNzZWQgaW4gZnVuY3Rpb24uXG4gKiBcbiAgICB2YXIgdGhpc0FyZyA9IHt2YWw6J2MnfTtcbiAgICBMdWMuT2JqZWN0LmVhY2goe1xuICAgICAgICB1OiAnTCdcbiAgICB9LCBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHZhbHVlICsga2V5ICsgdGhpcy52YWwpXG4gICAgfSwgdGhpc0FyZylcbiAgICBcbiAgICA+THVjIFxuIFxuICogQHBhcmFtICB7T2JqZWN0fSAgIG9iaiAgdGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXJcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmbiAgIHRoZSBmdW5jdGlvbiB0byBjYWxsXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGZuLmtleSAgIHRoZSBvYmplY3Qga2V5XG4gKiBAcGFyYW0gIHtPYmplY3R9IGZuLnZhbHVlICAgdGhlIG9iamVjdCB2YWx1ZVxuICogQHBhcmFtICB7T2JqZWN0fSAgIFt0aGlzQXJnXSBcbiAqIEBwYXJhbSB7T2JqZWN0fSAgW2NvbmZpZ11cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gIGNvbmZpZy5vd25Qcm9wZXJ0aWVzIHNldCB0byBmYWxzZVxuICogdG8gaXRlcmF0ZSBvdmVyIGFsbCBvZiB0aGUgb2JqZWN0cyBlbnVtZXJhYmxlIHByb3BlcnRpZXMuXG4gKi9cbmV4cG9ydHMuZWFjaCA9IGZ1bmN0aW9uKG9iaiwgZm4sIHRoaXNBcmcsIGNvbmZpZykge1xuICAgIHZhciBrZXksIHZhbHVlLFxuICAgICAgICBhbGxQcm9wZXJ0aWVzID0gY29uZmlnICYmIGNvbmZpZy5vd25Qcm9wZXJ0aWVzID09PSBmYWxzZTtcblxuICAgIGlmIChhbGxQcm9wZXJ0aWVzKSB7XG4gICAgICAgIGZvciAoa2V5IGluIG9iaikge1xuICAgICAgICAgICAgZm4uY2FsbCh0aGlzQXJnLCBrZXksIG9ialtrZXldKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAoa2V5IGluIG9iaikge1xuICAgICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgZm4uY2FsbCh0aGlzQXJnLCBrZXksIG9ialtrZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8qKlxuICogVGFrZSBhbiBhcnJheSBvZiBzdHJpbmdzIGFuZCBhbiBhcnJheS9hcmd1bWVudHMgb2ZcbiAqIHZhbHVlcyBhbmQgcmV0dXJuIGFuIG9iamVjdCBvZiBrZXkgdmFsdWUgcGFpcnNcbiAqIGJhc2VkIG9mZiBlYWNoIGFycmF5cyBpbmRleC4gIEl0IGlzIHVzZWZ1bCBmb3IgdGFraW5nXG4gKiBhIGxvbmcgbGlzdCBvZiBhcmd1bWVudHMgYW5kIGNyZWF0aW5nIGFuIG9iamVjdCB0aGF0IGNhblxuICogYmUgcGFzc2VkIHRvIG90aGVyIG1ldGhvZHMuXG4gKiBcbiAgICBmdW5jdGlvbiBsb25nQXJncyhhLGIsYyxkLGUsZikge1xuICAgICAgICByZXR1cm4gTHVjLk9iamVjdC50b09iamVjdChbJ2EnLCdiJywgJ2MnLCAnZCcsICdlJywgJ2YnXSwgYXJndW1lbnRzKVxuICAgIH1cblxuICAgIGxvbmdBcmdzKDEsMiwzLDQsNSw2LDcsOCw5KVxuXG4gICAgPk9iamVjdCB7YTogMSwgYjogMiwgYzogMywgZDogNCwgZTogNeKApn1cbiAgICBhOiAxXG4gICAgYjogMlxuICAgIGM6IDNcbiAgICBkOiA0XG4gICAgZTogNVxuICAgIGY6IDZcblxuICAgIGxvbmdBcmdzKDEsMiwzKVxuXG4gICAgPk9iamVjdCB7YTogMSwgYjogMiwgYzogMywgZDogdW5kZWZpbmVkLCBlOiB1bmRlZmluZWTigKZ9XG4gICAgYTogMVxuICAgIGI6IDJcbiAgICBjOiAzXG4gICAgZDogdW5kZWZpbmVkXG4gICAgZTogdW5kZWZpbmVkXG4gICAgZjogdW5kZWZpbmVkXG5cbiAqIEBwYXJhbSAge1N0cmluZ1tdfSBzdHJpbmdzXG4gKiBAcGFyYW0gIHtBcnJheS9hcmd1bWVudHN9IHZhbHVlc1xuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5leHBvcnRzLnRvT2JqZWN0ID0gZnVuY3Rpb24oc3RyaW5ncywgdmFsdWVzKSB7XG4gICAgdmFyIG9iaiA9IHt9LFxuICAgICAgICBpID0gMCxcbiAgICAgICAgbGVuID0gc3RyaW5ncy5sZW5ndGg7XG4gICAgZm9yICg7IGkgPCBsZW47ICsraSkge1xuICAgICAgICBvYmpbc3RyaW5nc1tpXV0gPSB2YWx1ZXNbaV07XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iajtcbn07XG5cbi8qKlxuICogUmV0dXJuIGtleSB2YWx1ZSBwYWlycyBmcm9tIHRoZSBvYmplY3QgaWYgdGhlXG4gKiBmaWx0ZXJGbiByZXR1cm5zIGEgdHJ1dGh5IHZhbHVlLlxuICpcbiAgICBMdWMuT2JqZWN0LmZpbHRlcih7XG4gICAgICAgIGE6IGZhbHNlLFxuICAgICAgICBiOiB0cnVlLFxuICAgICAgICBjOiBmYWxzZVxuICAgIH0sIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGtleSA9PT0gJ2EnIHx8IHZhbHVlXG4gICAgfSlcbiAgICA+W3trZXk6ICdhJywgdmFsdWU6IGZhbHNlfSwge2tleTogJ2InLCB2YWx1ZTogdHJ1ZX1dXG5cbiAgICBMdWMuT2JqZWN0LmZpbHRlcih7XG4gICAgICAgIGE6IGZhbHNlLFxuICAgICAgICBiOiB0cnVlLFxuICAgICAgICBjOiBmYWxzZVxuICAgIH0sIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGtleSA9PT0gJ2EnIHx8IHZhbHVlXG4gICAgfSwgdW5kZWZpbmVkLCB7XG4gICAgICAgIGtleXM6IHRydWVcbiAgICB9KVxuICAgID5bJ2EnLCAnYiddXG4gKiBcbiAqIEBwYXJhbSAge09iamVjdH0gICBvYmogIHRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gZmlsdGVyRm4gICB0aGUgZnVuY3Rpb24gdG8gY2FsbCwgcmV0dXJuIGEgdHJ1dGh5IHZhbHVlXG4gKiB0byBhZGQgdGhlIGtleSB2YWx1ZSBwYWlyXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGZpbHRlckZuLmtleSAgIHRoZSBvYmplY3Qga2V5XG4gKiBAcGFyYW0gIHtPYmplY3R9IGZpbHRlckZuLnZhbHVlICAgdGhlIG9iamVjdCB2YWx1ZVxuICogQHBhcmFtICB7T2JqZWN0fSAgIFt0aGlzQXJnXSBcbiAqIEBwYXJhbSB7T2JqZWN0fSAgW2NvbmZpZ11cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gIGNvbmZpZy5vd25Qcm9wZXJ0aWVzIHNldCB0byBmYWxzZVxuICogdG8gaXRlcmF0ZSBvdmVyIGFsbCBvZiB0aGUgb2JqZWN0cyBlbnVtZXJhYmxlIHByb3BlcnRpZXMuXG4gKiBcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gIGNvbmZpZy5rZXlzIHNldCB0byB0cnVlIHRvIHJldHVyblxuICoganVzdCB0aGUga2V5cy5cbiAqXG4gKiBAcGFyYW0ge0Jvb2xlYW59ICBjb25maWcudmFsdWVzIHNldCB0byB0cnVlIHRvIHJldHVyblxuICoganVzdCB0aGUgdmFsdWVzLlxuICogXG4gKiBAcmV0dXJuIHtPYmplY3RbXS9TdHJpbmdbXX0gQXJyYXkgb2Yga2V5IHZhbHVlIHBhaXJzIGluIHRoZSBmb3JtXG4gKiBvZiB7a2V5OiAna2V5JywgdmFsdWU6IHZhbHVlfS4gIElmIGtleXMgb3IgdmFsdWVzIGlzIHRydWUgb24gdGhlIGNvbmZpZ1xuICoganVzdCB0aGUga2V5cyBvciB2YWx1ZXMgYXJlIHJldHVybmVkLlxuICpcbiAqL1xuZXhwb3J0cy5maWx0ZXIgPSBmdW5jdGlvbihvYmosIGZpbHRlckZuLCB0aGlzQXJnLCBjKSB7XG4gICAgdmFyIHZhbHVlcyA9IFtdLFxuICAgICAgICBjb25maWcgPSBjIHx8IHt9O1xuXG4gICAgZXhwb3J0cy5lYWNoKG9iaiwgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICBpZiAoZmlsdGVyRm4uY2FsbCh0aGlzQXJnLCBrZXksIHZhbHVlKSkge1xuICAgICAgICAgICAgaWYgKGNvbmZpZy5rZXlzID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgdmFsdWVzLnB1c2goa2V5KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29uZmlnLnZhbHVlcyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHZhbHVlcy5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFsdWVzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIGtleToga2V5XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCB0aGlzQXJnLCBjb25maWcpO1xuXG4gICAgcmV0dXJuIHZhbHVlcztcbn07XG5cbi8qKlxuICogTWVyZ2UgdGhlIHZhbHVlcyBmcm9tIG9iamVjdDIgaW50byBvYmplY3QxLiAgVGhlIHZhbHVlcyB3aWxsIG9ubHkgYmVcbiAqIG1lcmdlZCBpbiBpZiBvYmplY3QxJ3MgdmFsdWUgZm9yIHRoZSBrZXkgaXMgbnVsbCBvciB1bmRlZmluZWQuICBOZXN0ZWQgb2JqZWN0c1xuICogYXJlIGhhbmRsZWQgaW4gdGhlIHNhbWUgd2F5LiAgQXJyYXkgdmFsdWVzIHdpbGwgbm90IGJlIG1lcmdlZC5cbiAqIFxuICAgIEx1Yy5PYmplY3QubWVyZ2Uoe2E6IDF9LCB7YjogMn0pXG4gICAgPnthOiAxLCBiOiAyfVxuICAgIFxuICAgIEx1Yy5PYmplY3QubWVyZ2Uoe2E6IHthOiAxfSB9LCB7YjoyLCBhOiB7YjogMn19KVxuICAgID57YjogMiwgYToge2E6MSwgYjoyfSB9XG5cbiAqIEBwYXJhbSAge09iamVjdH0gb2JqZWN0MVxuICogQHBhcmFtICB7T2JqZWN0fSBvYmplY3QyXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbmZ1bmN0aW9uIG1lcmdlKG9iajEsIG9iajIpIHtcbiAgICBleHBvcnRzLmVhY2gob2JqMiwgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICB2YXIgb2JqMVZhbHVlID0gb2JqMVtrZXldO1xuICAgICAgICBpZiAob2JqMVZhbHVlID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgb2JqMVtrZXldID0gdmFsdWU7XG4gICAgICAgIH0gZWxzZSBpZiAoaXMuaXNPYmplY3Qob2JqMVZhbHVlKSkge1xuICAgICAgICAgICAgbWVyZ2Uob2JqMVtrZXldLCBvYmoyW2tleV0pO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gb2JqMTtcbn1cblxuZXhwb3J0cy5tZXJnZSA9IG1lcmdlOyIsInZhciBhcnJheVNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLFxuICAgIGNvbXBhcmUgPSByZXF1aXJlKCcuL2NvbXBhcmUnKSxcbiAgICBpcyA9IHJlcXVpcmUoJy4vaXMnKSxcbiAgICBjb21wYXJlID0gY29tcGFyZS5jb21wYXJlO1xuXG5mdW5jdGlvbiBfY3JlYXRlSXRlcmF0b3JGbihmbiwgYykge1xuICAgIHZhciBjb25maWcgPSBjIHx8IHt9O1xuXG4gICAgaWYoaXMuaXNGdW5jdGlvbihmbikgJiYgKGNvbmZpZy50eXBlICE9PSAnc3RyaWN0JykpIHtcbiAgICAgICAgcmV0dXJuIGMgPyBmbi5iaW5kKGMpIDogZm47XG4gICAgfVxuXG4gICAgaWYoY29uZmlnLnR5cGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb25maWcudHlwZSA9ICdsb29zZSc7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBjb21wYXJlKGZuLCB2YWx1ZSwgY29uZmlnKTtcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBfY3JlYXRlSXRlcmF0b3JOb3RGbihmbiwgY29uZmlnKSB7XG4gICAgdmFyIGZ1bmN0aW9uVG9Ob3QgPSBfY3JlYXRlSXRlcmF0b3JGbihmbiwgY29uZmlnKTtcbiAgICAgICAgXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gIWZ1bmN0aW9uVG9Ob3QuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xufVxuXG5cbi8qKlxuICogQGNsYXNzIEx1Yy5BcnJheSBcbiAqIFBhY2thZ2UgZm9yIEFycmF5IG1ldGhvZHMuIDxicj5cbiAqIFxuICogS2VlcCBpbiBtaW5kIHRoYXQgTHVjIGlzIG9wdGlvbmFsbHkgcGFja2FnZWQgd2l0aCBlczUgc2hpbSBzbyB5b3UgY2FuIHdyaXRlIGVzNSBjb2RlIGluIG5vbiBlczUgYnJvd3NlcnMuXG4gKiBJdCBjb21lcyB3aXRoIHlvdXIgZmF2b3JpdGUge0BsaW5rIEFycmF5IEFycmF5fSBtZXRob2RzIHN1Y2ggYXMgQXJyYXkuZm9yRWFjaCwgQXJyYXkuZmlsdGVyLCBBcnJheS5zb21lLCBBcnJheS5ldmVyeSBBcnJheS5yZWR1Y2VSaWdodCAuLlxuICpcbiAqIEFsc28gZG9uJ3QgZm9yZ2V0IGFib3V0IEx1Yy5BcnJheS5lYWNoIGFuZCBMdWMuQXJyYXkudG9BcnJheSwgdGhleSBhcmUgZ3JlYXQgdXRpbGl0eSBtZXRob2RzXG4gKiB0aGF0IGFyZSB1c2VkIGFsbCBvdmVyIHRoZSBmcmFtZXdvcmsuXG4gKiBcbiAqIEFsbCByZW1vdmVcXCogLyBmaW5kXFwqIG1ldGhvZHMgZm9sbG93IHRoZSBzYW1lIGFwaS4gIFxcKkFsbCBmdW5jdGlvbnMgd2lsbCByZXR1cm4gYW4gYXJyYXkgb2YgcmVtb3ZlZCBvciBmb3VuZFxuICogaXRlbXMuICBUaGUgaXRlbXMgd2lsbCBiZSBhZGRlZCB0byB0aGUgYXJyYXkgaW4gdGhlIG9yZGVyIHRoZXkgYXJlXG4gKiBmb3VuZC4gIFxcKkZpcnN0IGZ1bmN0aW9ucyB3aWxsIHJldHVybiB0aGUgZmlyc3QgaXRlbSBhbmQgc3RvcCBpdGVyYXRpbmcgYWZ0ZXIgdGhhdCwgaWYgbm9uZVxuICogIGlzIGZvdW5kIGZhbHNlIGlzIHJldHVybmVkLiAgcmVtb3ZlXFwqIGZ1bmN0aW9ucyB3aWxsIGRpcmVjdGx5IGNoYW5nZSB0aGUgcGFzc2VkIGluIGFycmF5LlxuICogIFxcKk5vdCBmdW5jdGlvbnMgb25seSBkbyB0aGUgZm9sbG93aW5nIGFjdGlvbnMgaWYgdGhlIGNvbXBhcmlzb24gaXMgbm90IHRydWUuXG4gKiAgQWxsIHJlbW92ZVxcKiAvIGZpbmRcXCogdGFrZSB0aGUgZm9sbG93aW5nIGFwaTogYXJyYXksIG9iamVjdFRvQ29tcGFyZU9ySXRlcmF0b3IsIGNvbXBhcmVDb25maWdPclRoaXNBcmcgPGJyPmZvciBleGFtcGxlOlxuICpcbiAgICAvL21vc3QgY29tbW9uIHVzZSBjYXNlXG4gICAgTHVjLkFycmF5LmZpbmRGaXJzdChbMSwyLDMsIHt9XSwge30pO1xuICAgID5PYmplY3Qge31cblxuICAgIC8vcGFzcyBpbiBvcHRpb25hbCBjb25maWcgZm9yIGEgc3RyaWN0ID09PSBjb21wYXJpc29uXG4gICAgTHVjLkFycmF5LmZpbmRGaXJzdChbMSwyLDMse31dLCB7fSwge3R5cGU6ICdzdHJpY3QnfSk7XG4gICAgPmZhbHNlXG5cbiAgICAvL3Bhc3MgaW4gYW4gaXRlcmF0b3IgYW5kIHRoaXNBcmdcbiAgICBMdWMuQXJyYXkuZmluZEZpcnN0KFsxLDIsMyx7fV0sIGZ1bmN0aW9uKHZhbCwgaW5kZXgsIGFycmF5KXtcbiAgICAgICAgcmV0dXJuIHZhbCA9PT0gMyB8fCB0aGlzLm51bSA9PT0gdmFsO1xuICAgIH0sIHtudW06IDF9KTtcbiAgICA+MVxuICAgIFxuICAgIC8veW91IGNhbiBzZWUgcmVtb3ZlIG1vZGlmaWVzIHRoZSBwYXNzZWQgaW4gYXJyYXkuXG4gICAgdmFyIGFyciA9IFsxLDIse2E6MX0sMSwge2E6MX1dO1xuICAgIEx1Yy5BcnJheS5yZW1vdmVGaXJzdChhcnIsIHthOjF9KVxuICAgID57YToxfVxuICAgIGFycjtcbiAgICA+WzEsIDIsIDEsIHthOjF9XVxuICAgIEx1Yy5BcnJheS5yZW1vdmVMYXN0KGFyciwgMSlcbiAgICA+MVxuICAgIGFycjtcbiAgICA+WzEsMiwge2E6MX1dXG4gICAgXG4gICAgXG4gICAgTHVjLkFycmF5LmZpbmRBbGwoWzEsMiwzLCB7YToxLGI6Mn1dLCBmdW5jdGlvbigpIHtyZXR1cm4gdHJ1ZTt9KVxuICAgID4gWzEsMiwzLCB7YToxLGI6Mn1dXG4gICAgLy9zaG93IGhvdyBub3Qgd29ya3Mgd2l0aCBhbiBpdGVyYXRvclxuICAgIEx1Yy5BcnJheS5maW5kQWxsTm90KFsxLDIsMywge2E6MSxiOjJ9XSwgZnVuY3Rpb24oKSB7cmV0dXJuIHRydWU7fSlcbiAgICA+W11cbiAqXG4gKiBGb3IgY29tbW9ubHkgdXNlZCBmaW5kL3JlbW92ZSBmdW5jdGlvbnMgY2hlY2sgb3V0IEx1Yy5BcnJheUZucyBmb3IgZXhhbXBsZSBhXG4gKiBcImNvbXBhY3RcIiBsaWtlIGZ1bmN0aW9uXG4gKiBcbiAgICBMdWMuQXJyYXkuZmluZEFsbE5vdEZhbHN5KFtmYWxzZSwgJycsIHVuZGVmaW5lZCwgMCwge30sIFtdXSlcbiAgICA+WzAsIHt9LCBbXV1cbiAqXG4gKiBPciByZW1vdmUgYWxsIGVtcHR5IGl0ZW1zXG4gKiBcbiAgICB2YXIgYXJyID0gWycnLCAwICwgW10sIHthOjF9LCB0cnVlLCB7fSwgWzFdXVxuICAgIEx1Yy5BcnJheS5yZW1vdmVBbGxFbXB0eShhcnIpXG4gICAgPlsnJywgW10sIHt9XVxuICAgIGFyclxuICAgID5bMCwge2E6MX0sIHRydWUsIFsxXV1cbiAqL1xuXG4vKipcbiAqIFR1cm4gdGhlIHBhc3NlZCBpbiBpdGVtIGludG8gYW4gYXJyYXkgaWYgaXRcbiAqIGlzbid0IG9uZSBhbHJlYWR5LCBpZiB0aGUgaXRlbSBpcyBhbiBhcnJheSBqdXN0IHJldHVybiBpdC4gIFxuICogSXQgcmV0dXJucyBhbiBlbXB0eSBhcnJheSBpZiBpdGVtIGlzIG51bGwgb3IgdW5kZWZpbmVkLlxuICogSWYgaXQgaXMganVzdCBhIHNpbmdsZSBpdGVtIHJldHVybiBhbiBhcnJheSBjb250YWluaW5nIHRoZSBpdGVtLlxuICogXG4gICAgTHVjLkFycmF5LnRvQXJyYXkoKVxuICAgID5bXVxuICAgIEx1Yy5BcnJheS50b0FycmF5KG51bGwpXG4gICAgPltdXG4gICAgTHVjLkFycmF5LnRvQXJyYXkoMSlcbiAgICA+WzFdXG4gICAgTHVjLkFycmF5LnRvQXJyYXkoWzEsMl0pXG4gICAgPlsxLCAyXVxuICpcbiAqIEBwYXJhbSAge09iamVjdH0gaXRlbSBpdGVtIHRvIHR1cm4gaW50byBhbiBhcnJheS5cbiAqIEByZXR1cm4gdGhlIGFycmF5XG4gKi9cbmZ1bmN0aW9uIHRvQXJyYXkoaXRlbSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGl0ZW0pKSB7XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgIH1cbiAgICByZXR1cm4gKGl0ZW0gPT09IG51bGwgfHwgaXRlbSA9PT0gdW5kZWZpbmVkKSA/IFtdIDogW2l0ZW1dO1xufVxuXG4vKipcbiAqIFJldHVybiB0aGUgbGFzdCBpdGVtIG9mIHRoZSBhcnJheVxuICogQHBhcmFtICB7QXJyYXl9IGFyclxuICogQHJldHVybiB7T2JqZWN0fSB0aGUgaXRlbVxuICAgIFxuICAgIHZhciBteUxvbmdBcnJheU5hbWVGb3JUaGluZ3NUaGF0SVdhbnRUb0tlZXBUcmFja09mID0gWzEsMiwzXVxuICAgIFxuICAgIEx1Yy5BcnJheS5sYXN0KG15TG9uZ0FycmF5TmFtZUZvclRoaW5nc1RoYXRJV2FudFRvS2VlcFRyYWNrT2YpO1xuICAgIHZzLlxuICAgIG15TG9uZ0FycmF5TmFtZUZvclRoaW5nc1RoYXRJV2FudFRvS2VlcFRyYWNrT2ZbbXlMb25nQXJyYXlOYW1lRm9yVGhpbmdzVGhhdElXYW50VG9LZWVwVHJhY2tPZi5sZW5ndGggLTFdXG4gKlxuICovXG5mdW5jdGlvbiBsYXN0KGFycikge1xuICAgIHJldHVybiBhcnJbYXJyLmxlbmd0aCAtMV07XG59XG5cbi8qKlxuICogRmxhdHRlbiBvdXQgYW4gYXJyYXkgb2Ygb2JqZWN0cyBiYXNlZCBvZiB0aGVpciB2YWx1ZSBmb3IgdGhlIHBhc3NlZCBpbiBrZXkuXG4gKiBUaGlzIGFsc28gdGFrZXMgYWNjb3VudCBmb3IgbnVsbC91bmRlZmluZWQgdmFsdWVzLlxuICpcbiAgICBMdWMuQXJyYXkucGx1Y2soW3VuZGVmaW5lZCwge2E6JzEnLCBiOjJ9LCB7YjozfSwge2I6NH1dLCAnYicpXG4gICAgPlt1bmRlZmluZWQsIDIsIDMsIDRdXG4gKiBAcGFyYW0gIHtPYmplY3RbXX0gYXJyIFxuICogQHBhcmFtICB7U3RyaW5nfSBrZXkgXG4gKiBAcmV0dXJuIHtBcnJheX0gICAgIFxuICovXG5mdW5jdGlvbiBwbHVjayhhcnIsIGtleSkge1xuICAgIHJldHVybiBhcnIubWFwKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZSAmJiB2YWx1ZVtrZXldO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIFJldHVybiB0aGUgaXRlbXMgaW4gYmV0d2VlbiB0aGUgcGFzc2VkIGluIGluZGV4XG4gKiBhbmQgdGhlIGVuZCBvZiB0aGUgYXJyYXkuXG4gKlxuICAgIEx1Yy5BcnJheS5mcm9tSW5kZXgoWzEsMiwzLDQsNV0sIDEpXG4gICAgPlsyLCAzLCA0LCA1XVxuXG4gKiBAcGFyYW0gIHtBcnJheS9hcmd1bWVudHN9IGFyciBcbiAqIEBwYXJhbSAge051bWJlcn0gaW5kZXggXG4gKiBAcmV0dXJuIHtBcnJheX0gdGhlIG5ldyBhcnJheS5cbiAqIFxuICovXG5mdW5jdGlvbiBmcm9tSW5kZXgoYSwgaW5kZXgpIHtcbiAgICB2YXIgYXJyID0gaXMuaXNBcmd1bWVudHMoYSkgPyBhcnJheVNsaWNlLmNhbGwoYSkgOiBhO1xuICAgIHJldHVybiBhcnJheVNsaWNlLmNhbGwoYXJyLCBpbmRleCwgYXJyLmxlbmd0aCk7XG59XG5cbi8qKlxuICogUnVucyBhbiBBcnJheS5mb3JFYWNoIGFmdGVyIGNhbGxpbmcgTHVjLkFycmF5LnRvQXJyYXkgb24gdGhlIGl0ZW0uXG4gIEl0IGlzIHZlcnkgdXNlZnVsIGZvciBzZXR0aW5nIHVwIGZsZXhpYmxlIGFwaSdzIHRoYXQgY2FuIGhhbmRsZSBub25lIG9uZSBvciBtYW55LlxuXG4gICAgTHVjLkFycmF5LmVhY2godGhpcy5pdGVtcywgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICB0aGlzLl9hZGRJdGVtKGl0ZW0pO1xuICAgIH0pO1xuXG4gICAgdnMuXG5cbiAgICBpZihBcnJheS5pc0FycmF5KHRoaXMuaXRlbXMpKXtcbiAgICAgICAgdGhpcy5pdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgIHRoaXMuX2FkZEl0ZW0oaXRlbSk7XG4gICAgICAgIH0pXG4gICAgfVxuICAgIGVsc2UgaWYodGhpcy5pdGVtcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuX2FkZEl0ZW0odGhpcy5pdGVtcyk7XG4gICAgfVxuXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgaXRlbVxuICogQHBhcmFtICB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgdGhpc0FyZyAgIFxuICpcbiAqL1xuZnVuY3Rpb24gZWFjaChpdGVtLCBmbiwgdGhpc0FyZykge1xuICAgIHZhciBhcnIgPSB0b0FycmF5KGl0ZW0pO1xuICAgIHJldHVybiBhcnIuZm9yRWFjaC5jYWxsKGFyciwgZm4sIHRoaXNBcmcpO1xufVxuXG4vKipcbiAqIEluc2VydCBvciBhcHBlbmQgdGhlIHNlY29uZCBhcnJheS9hcmd1bWVudHMgaW50byB0aGVcbiAqIGZpcnN0IGFycmF5L2FyZ3VtZW50cy4gIFRoaXMgbWV0aG9kIGRvZXMgbm90IGFsdGVyXG4gKiB0aGUgcGFzc2VkIGluIGFycmF5L2FyZ3VtZW50cy5cbiAqIFxuICogQHBhcmFtICB7QXJyYXkvYXJndW1lbnRzfSBmaXJzdEFycmF5T3JBcmdzXG4gKiBAcGFyYW0gIHtBcnJheS9hcmd1bWVudHN9IHNlY29uZEFycmF5T3JBcmdzXG4gKiBAcGFyYW0gIHtOdW1iZXIvdHJ1ZX0gaW5kZXhPckFwcGVuZCB0cnVlIHRvIGFwcGVuZCBcbiAqIHRoZSBzZWNvbmQgYXJyYXkgdG8gdGhlIGVuZCBvZiB0aGUgZmlyc3Qgb25lLiAgSWYgaXQgaXMgYSBudW1iZXJcbiAqIGluc2VydCB0aGUgc2Vjb25kQXJyYXkgaW50byB0aGUgZmlyc3Qgb25lIGF0IHRoZSBwYXNzZWQgaW4gaW5kZXguXG4gKiBAcmV0dXJuIHtBcnJheX0gdGhlIG5ld2x5IGNyZWF0ZWQgYXJyYXkuXG4gKlxuICAgIEx1Yy5BcnJheS5pbnNlcnQoWzAsNF0sIFsxLDIsM10sIDEpO1xuICAgID5bMCwgMSwgMiwgMywgNF1cbiAgICBMdWMuQXJyYXkuaW5zZXJ0KFswLDRdLCBbMSwyLDNdLCB0cnVlKTtcbiAgICA+WzAsIDQsIDEsIDIsIDNdXG4gICAgTHVjLkFycmF5Lmluc2VydChbMCw0XSwgWzEsMiwzXSwgMCk7XG4gICAgPlsxLCAyLCAzLCAwLCA0XVxuICpcbiAqL1xuZnVuY3Rpb24gaW5zZXJ0KGZpcnN0QXJyYXlPckFyZ3MsIHNlY29uZEFycmF5T3JBcmdzLCBpbmRleE9yQXBwZW5kKSB7XG4gICAgdmFyIGZpcnN0QXJyYXkgPSBhcnJheVNsaWNlLmNhbGwoZmlyc3RBcnJheU9yQXJncyksXG4gICAgICAgIHNlY29uZEFycmF5ID0gYXJyYXlTbGljZS5jYWxsKHNlY29uZEFycmF5T3JBcmdzKSxcbiAgICAgICAgc3BsaWNlQXJncztcblxuICAgIGlmKGluZGV4T3JBcHBlbmQgPT09IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIGZpcnN0QXJyYXkuY29uY2F0KHNlY29uZEFycmF5KTtcbiAgICB9XG5cbiAgICBzcGxpY2VBcmdzID0gW2luZGV4T3JBcHBlbmQsIDBdLmNvbmNhdChzZWNvbmRBcnJheSk7XG4gICAgZmlyc3RBcnJheS5zcGxpY2UuYXBwbHkoZmlyc3RBcnJheSwgc3BsaWNlQXJncyk7XG4gICAgcmV0dXJuIGZpcnN0QXJyYXk7XG59XG5cbi8qKlxuICogUmVtb3ZlIGFuIGl0ZW0gZnJvbSB0aGUgcGFzc2VkIGluIGFyclxuICogZnJvbSB0aGUgaW5kZXguXG4gKiBAcGFyYW0gIHtBcnJheX0gYXJyXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IGluZGV4XG4gKiBAcmV0dXJuIHtPYmplY3R9IHRoZSBpdGVtIHJlbW92ZWQuXG4gKlxuICAgIHZhciBhcnIgPSBbMSwyLDNdO1xuICAgIEx1Yy5BcnJheS5yZW1vdmVBdEluZGV4KGFyciwgMSk7XG4gICAgPjJcbiAgICBhcnI7XG4gICAgPlsxLDNdXG5cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlQXRJbmRleChhcnIsIGluZGV4KSB7XG4gICAgdmFyIGl0ZW0gPSBhcnJbaW5kZXhdO1xuICAgIGFyci5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIHJldHVybiBpdGVtO1xufVxuXG5mdW5jdGlvbiBfcmVtb3ZlRmlyc3QoYXJyLCBmbikge1xuICAgIHZhciByZW1vdmVkID0gZmFsc2U7XG5cbiAgICBhcnIuc29tZShmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcbiAgICAgICAgaWYgKGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpIHtcbiAgICAgICAgICAgIHJlbW92ZWQgPSByZW1vdmVBdEluZGV4KGFyciwgaW5kZXgpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiByZW1vdmVkO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgZmlyc3QgaXRlbSBmcm9tIHRoZSBwYXNzZWQgaW4gYXJyYXlcbiAqIHRoYXQge0BsaW5rIEx1YyNjb21wYXJlIG1hdGNoZXN9IHRoZSBwYXNzZWQgaW4gb2JqZWN0LiAgSW5zdGVhZCBvZiBcbiAqIGNvbXBhcmluZyBhbiBvYmplY3QgYW4gaXRlcmF0b3IgZnVuY3Rpb24gY2FuIGJlXG4gKiB1c2VkLlxuICogXG57Y29weURvYyNhcnJQYXJhbXN9XG57Y29weURvYyNhcnJSZW1vdmVTaW5nbGV9XG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUZpcnN0KGFyciwgb2JqLCBjb25maWcpIHtcbiAgICB2YXIgZm4gPSBfY3JlYXRlSXRlcmF0b3JGbihvYmosIGNvbmZpZyk7XG4gICAgcmV0dXJuIF9yZW1vdmVGaXJzdChhcnIsIGZuKTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGZpcnN0IGl0ZW0gZnJvbSB0aGUgcGFzc2VkIGluIGFycmF5XG4gKiB0aGF0IGRvZXMgbm90IHtAbGluayBMdWMjY29tcGFyZSBtYXRjaH0gdGhlIHBhc3NlZCBpbiBvYmplY3QuICBJbnN0ZWFkIG9mIFxuICogY29tcGFyaW5nIGFuIG9iamVjdCBhbiBpdGVyYXRvciBmdW5jdGlvbiBjYW4gYmVcbiAqIHVzZWQuXG4gKiBcbntjb3B5RG9jI2FyclBhcmFtc31cbntjb3B5RG9jI2FyclJlbW92ZVNpbmdsZX1cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlRmlyc3ROb3QoYXJyLCBvYmosIGNvbmZpZykge1xuICAgIHZhciBmbiA9IF9jcmVhdGVJdGVyYXRvck5vdEZuKG9iaiwgY29uZmlnKTtcbiAgICByZXR1cm4gX3JlbW92ZUZpcnN0KGFyciwgZm4pO1xufVxuXG5cbmZ1bmN0aW9uIF9yZW1vdmVBbGwoYXJyLCBmbikge1xuICAgIHZhciBpbmRleHNUb1JlbW92ZSA9IFtdLFxuICAgICAgICByZW1vdmVkID0gW107XG5cbiAgICBhcnIuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcbiAgICAgICAgaWYgKGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpIHtcbiAgICAgICAgICAgIGluZGV4c1RvUmVtb3ZlLnVuc2hpZnQoaW5kZXgpO1xuICAgICAgICAgICAgcmVtb3ZlZC5wdXNoKHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgaW5kZXhzVG9SZW1vdmUuZm9yRWFjaChmdW5jdGlvbihpbmRleCl7XG4gICAgICAgIHJlbW92ZUF0SW5kZXgoYXJyLCBpbmRleCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVtb3ZlZDtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGFsbCB0aGUgaXRlbXMgZnJvbSB0aGUgcGFzc2VkIGluIGFycmF5XG4gKiB0aGF0IGRvIG5vdCB7QGxpbmsgTHVjI2NvbXBhcmUgbWF0Y2h9IHRoZSBwYXNzZWQgaW4gb2JqZWN0LiAgSW5zdGVhZCBvZiBcbiAqIGNvbXBhcmluZyBhbiBvYmplY3QgYW4gaXRlcmF0b3IgZnVuY3Rpb24gY2FuIGJlXG4gKiB1c2VkLlxuICogXG57Y29weURvYyNhcnJQYXJhbXN9XG57Y29weURvYyNhcnJSZW1vdmVBbGx9XG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUFsbE5vdChhcnIsIG9iaiwgY29uZmlnKSB7XG4gICAgdmFyIGZuID0gX2NyZWF0ZUl0ZXJhdG9yTm90Rm4ob2JqLCBjb25maWcpO1xuICAgIHJldHVybiBfcmVtb3ZlQWxsKGFyciwgZm4pO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgYWxsIHRoZSBpdGVtcyBmcm9tIHRoZSBwYXNzZWQgaW4gYXJyYXlcbiAqIHRoYXQge0BsaW5rIEx1YyNjb21wYXJlIG1hdGNoZXN9IHRoZSBwYXNzZWQgaW4gb2JqZWN0LiAgSW5zdGVhZCBvZiBcbiAqIGNvbXBhcmluZyBhbiBvYmplY3QgYW4gaXRlcmF0b3IgZnVuY3Rpb24gY2FuIGJlXG4gKiB1c2VkLlxuICogXG57Y29weURvYyNhcnJQYXJhbXN9XG57Y29weURvYyNhcnJSZW1vdmVBbGx9XG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUFsbChhcnIsIG9iaiwgY29uZmlnKSB7XG4gICAgdmFyIGZuID0gX2NyZWF0ZUl0ZXJhdG9yRm4ob2JqLCBjb25maWcpO1xuICAgIHJldHVybiBfcmVtb3ZlQWxsKGFyciwgZm4pO1xufVxuXG5mdW5jdGlvbiBfZmluZEZpcnN0KGFyciwgZm4pIHtcbiAgICB2YXIgaXRlbSA9IGZhbHNlO1xuICAgIGFyci5zb21lKGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xuICAgICAgICBpZiAoZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKSkge1xuICAgICAgICAgICAgaXRlbSA9IGFycltpbmRleF07XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGl0ZW07XG59XG5cbi8qKlxuICogRmluZCB0aGUgZmlyc3QgaXRlbSBmcm9tIHRoZSBwYXNzZWQgaW4gYXJyYXlcbiAqIHRoYXQgZG9lcyB7QGxpbmsgTHVjI2NvbXBhcmUgbWF0Y2hlc30gdGhlIHBhc3NlZCBpbiBvYmplY3QuICBJbnN0ZWFkIG9mIFxuICogY29tcGFyaW5nIGFuIG9iamVjdCBhbiBpdGVyYXRvciBmdW5jdGlvbiBjYW4gYmVcbiAqIHVzZWQuXG4gKiBcbntjb3B5RG9jI2FyclBhcmFtc31cbntjb3B5RG9jI2FyckZpbmRTaW5nbGV9XG4gKi9cbmZ1bmN0aW9uIGZpbmRGaXJzdChhcnIsIG9iaiwgY29uZmlnKSB7XG4gICAgdmFyIGZuID0gX2NyZWF0ZUl0ZXJhdG9yRm4ob2JqLCBjb25maWcpO1xuICAgIHJldHVybiBfZmluZEZpcnN0KGFyciwgZm4pO1xufVxuXG4vKipcbiAqIEZpbmQgdGhlIGZpcnN0IGl0ZW0gZnJvbSB0aGUgcGFzc2VkIGluIGFycmF5XG4gKiB0aGF0IGRvZXMgbm90IHtAbGluayBMdWMjY29tcGFyZSBtYXRjaH0gdGhlIHBhc3NlZCBpbiBvYmplY3QuICBJbnN0ZWFkIG9mIFxuICogY29tcGFyaW5nIGFuIG9iamVjdCBhbiBpdGVyYXRvciBmdW5jdGlvbiBjYW4gYmVcbiAqIHVzZWQuXG4gKiBcbntjb3B5RG9jI2FyclBhcmFtc31cbntjb3B5RG9jI2FyckZpbmRTaW5nbGV9XG4gKi9cbmZ1bmN0aW9uIGZpbmRGaXJzdE5vdChhcnIsIG9iaiwgY29uZmlnKSB7XG4gICAgdmFyIGZuID0gX2NyZWF0ZUl0ZXJhdG9yTm90Rm4ob2JqLCBjb25maWcpO1xuICAgIHJldHVybiBfZmluZEZpcnN0KGFyciwgZm4pO1xufVxuXG5mdW5jdGlvbiBfZmluZEFsbChhcnIsIGZuKSB7XG4gICAgcmV0dXJuIGFyci5maWx0ZXIoZm4pO1xufVxuXG4vKipcbiAqIEZpbmQgYWxsIG9mIHRoZSB0aGUgaXRlbXMgZnJvbSB0aGUgcGFzc2VkIGluIGFycmF5XG4gKiB0aGF0IHtAbGluayBMdWMjY29tcGFyZSBtYXRjaGVzfSB0aGUgcGFzc2VkIGluIG9iamVjdC4gIEluc3RlYWQgb2YgXG4gKiBjb21wYXJpbmcgYW4gb2JqZWN0IGFuIGl0ZXJhdG9yIGZ1bmN0aW9uIGNhbiBiZVxuICogdXNlZC5cbiAqIFxue2NvcHlEb2MjYXJyUGFyYW1zfVxue2NvcHlEb2MjYXJyRmluZEFsbH1cbiAqL1xuZnVuY3Rpb24gZmluZEFsbChhcnIsIG9iaiwgY29uZmlnKSB7XG4gICAgdmFyIGZuID0gX2NyZWF0ZUl0ZXJhdG9yRm4ob2JqLCBjb25maWcpO1xuICAgIHJldHVybiBfZmluZEFsbChhcnIsIGZuKTtcbn1cblxuLyoqXG4gKiBGaW5kIGFsbCBvZiB0aGUgdGhlIGl0ZW1zIGZyb20gdGhlIHBhc3NlZCBpbiBhcnJheVxuICogdGhhdCBkbyBub3Qge0BsaW5rIEx1YyNjb21wYXJlIG1hdGNofSB0aGUgcGFzc2VkIGluIG9iamVjdC4gIEluc3RlYWQgb2YgXG4gKiBjb21wYXJpbmcgYW4gb2JqZWN0IGFuIGl0ZXJhdG9yIGZ1bmN0aW9uIGNhbiBiZVxuICogdXNlZC5cbiAqIFxue2NvcHlEb2MjYXJyUGFyYW1zfVxue2NvcHlEb2MjYXJyRmluZEFsbH1cbiAqL1xuZnVuY3Rpb24gZmluZEFsbE5vdChhcnIsIG9iaiwgY29uZmlnKSB7XG4gICAgdmFyIGZuID0gX2NyZWF0ZUl0ZXJhdG9yTm90Rm4ob2JqLCBjb25maWcpO1xuICAgIHJldHVybiBfZmluZEFsbChhcnIsIGZuKTtcbn1cblxuXG5leHBvcnRzLnRvQXJyYXkgPSB0b0FycmF5O1xuZXhwb3J0cy5lYWNoID0gZWFjaDtcbmV4cG9ydHMuaW5zZXJ0ID0gaW5zZXJ0O1xuZXhwb3J0cy5mcm9tSW5kZXggPSBmcm9tSW5kZXg7XG5leHBvcnRzLmxhc3QgPSBsYXN0O1xuZXhwb3J0cy5wbHVjayA9IHBsdWNrO1xuXG5leHBvcnRzLnJlbW92ZUF0SW5kZXggPSByZW1vdmVBdEluZGV4O1xuZXhwb3J0cy5maW5kRmlyc3ROb3QgPSBmaW5kRmlyc3ROb3Q7XG5leHBvcnRzLmZpbmRBbGxOb3QgPSBmaW5kQWxsTm90O1xuZXhwb3J0cy5maW5kRmlyc3QgPSBmaW5kRmlyc3Q7XG5leHBvcnRzLmZpbmRBbGwgPSBmaW5kQWxsO1xuXG5leHBvcnRzLnJlbW92ZUZpcnN0Tm90ID0gcmVtb3ZlRmlyc3ROb3Q7XG5leHBvcnRzLnJlbW92ZUFsbE5vdCA9IHJlbW92ZUFsbE5vdDtcbmV4cG9ydHMucmVtb3ZlRmlyc3QgPSByZW1vdmVGaXJzdDtcbmV4cG9ydHMucmVtb3ZlQWxsID0gcmVtb3ZlQWxsO1xuXG4oZnVuY3Rpb24oKXtcbiAgICB2YXIgX2NyZWF0ZUxhc3RGbiA9IGZ1bmN0aW9uKGZuTmFtZSkge1xuICAgICAgICB2YXIgbGFzdE5hbWUgPSBmbk5hbWUucmVwbGFjZSgnRmlyc3QnLCAnTGFzdCcpO1xuXG4gICAgICAgIGV4cG9ydHNbbGFzdE5hbWVdID0gZnVuY3Rpb24oYXJyLCBvYmosIGNvbmZpZykge1xuICAgICAgICAgICAgdmFyIHJldDtcblxuICAgICAgICAgICAgYXJyLnJldmVyc2UoKTtcbiAgICAgICAgICAgIHJldCA9IGV4cG9ydHNbZm5OYW1lXShhcnIsIG9iaiwgY29uZmlnKTtcbiAgICAgICAgICAgIGFyci5yZXZlcnNlKCk7XG5cbiAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH07XG5cbiAgICB9LCBuYW1lc1RvQWRkTGFzdCA9IFsnZmluZEZpcnN0Tm90JywgJ2ZpbmRGaXJzdCcsICdyZW1vdmVGaXJzdE5vdCcsICdyZW1vdmVGaXJzdCddO1xuXG4gICAgbmFtZXNUb0FkZExhc3QuZm9yRWFjaChmdW5jdGlvbihmbk5hbWUpIHtcbiAgICAgICAgX2NyZWF0ZUxhc3RGbihmbk5hbWUpO1xuICAgIH0pO1xuXG59KCkpO1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjLkFycmF5IFxuICogQG1ldGhvZCBmaW5kTGFzdE5vdCBcbiAqIFNhbWUgYXMgTHVjLkFycmF5LmZpbmRGaXJzdE5vdCBleGNlcHQgc3RhcnQgYXQgdGhlIGVuZC5cbiAqL1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjLkFycmF5IFxuICogQG1ldGhvZCBmaW5kTGFzdFxuICogU2FtZSBhcyBMdWMuQXJyYXkuZmluZEZpcnN0IGV4Y2VwdCBzdGFydCBhdCB0aGUgZW5kLlxuICovXG5cbi8qKlxuICogQG1lbWJlciBMdWMuQXJyYXkgXG4gKiBAbWV0aG9kIHJlbW92ZUxhc3ROb3QgXG4gKiBTYW1lIGFzIEx1Yy5BcnJheS5yZW1vdmVGaXJzdE5vdCBleGNlcHQgc3RhcnQgYXQgdGhlIGVuZC5cbiAqL1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjLkFycmF5IFxuICogQG1ldGhvZCByZW1vdmVMYXN0IFxuICogU2FtZSBhcyBMdWMuQXJyYXkucmVtb3ZlRmlyc3QgZXhjZXB0IHN0YXJ0IGF0IHRoZSBlbmQuXG4gKi9cbiIsInZhciBhcnJheSA9IHJlcXVpcmUoJy4vYXJyYXknKSxcbiAgICBpcyA9IHJlcXVpcmUoJy4vaXMnKSxcbiAgICBHZW5lcmF0b3I7XG5cbkdlbmVyYXRvciA9IHtcbiAgICBhcnJheUZuTmFtZXM6IFsnZmluZEZpcnN0Tm90JywgJ2ZpbmRBbGxOb3QnLCAnZmluZEZpcnN0JywgJ2ZpbmRBbGwnLFxuICAgICAgICAgICAgJ3JlbW92ZUZpcnN0Tm90JywgJ3JlbW92ZUFsbE5vdCcsICdyZW1vdmVGaXJzdCcsICdyZW1vdmVBbGwnLFxuICAgICAgICAgICAgJ3JlbW92ZUxhc3ROb3QnLCAncmVtb3ZlTGFzdCcsICdmaW5kTGFzdCcsICdmaW5kTGFzdE5vdCdcbiAgICBdLFxuXG4gICAgY3JlYXRlRm46IGZ1bmN0aW9uKGFycmF5Rm5OYW1lLCBmbikge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oYXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gYXJyYXlbYXJyYXlGbk5hbWVdKGFyciwgZm4pO1xuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBjcmVhdGVCb3VuZEZuOiBmdW5jdGlvbihhcnJheUZuTmFtZSwgZm5Ub0JpbmQpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGFyciwgdmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBmbiA9IGZuVG9CaW5kLmFwcGx5KHRoaXMsIGFycmF5LmZyb21JbmRleChhcmd1bWVudHMsIDEpKTtcbiAgICAgICAgICAgIHJldHVybiBhcnJheVthcnJheUZuTmFtZV0oYXJyLCBmbik7XG4gICAgICAgIH07XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBHZW5lcmF0b3I7XG5cbi8qKlxuICogQGNsYXNzIEx1Yy5BcnJheUZuc1xuICogVGhpcyBpcyBkb2N1bWVudGVkIGFzIGEgc2VwYXJhdGUgcGFja2FnZSBidXQgaXQgYWN0dWFsbHkgZXhpc3RzIHVuZGVyIHRoZSBcbiAqIEx1Yy5BcnJheSBuYW1lc3BhY2UuICBDaGVjayBvdXQgdGhlIFwiRmlsdGVyIGNsYXNzIG1lbWJlcnNcIiBpbnB1dCBib3hcbiAqIGp1c3QgdG8gdGhlIHJpZ2h0IHdoZW4gc2VhcmNoaW5nIGZvciBmdW5jdGlvbnMuXG4gKjxicj5cbiAqIFxuICogVGhlcmUgYXJlIGEgbG90IG9mIGZ1bmN0aW9ucyBpbiB0aGlzIHBhY2thZ2UgYnV0IGFsbCBvZiB0aGVtIFxuICogZm9sbG93IHRoZSBzYW1lIGFwaS4gIFxcKkFsbCBmdW5jdGlvbnMgd2lsbCByZXR1cm4gYW4gYXJyYXkgb2YgcmVtb3ZlZCBvciBmb3VuZFxuICogaXRlbXMuICBUaGUgaXRlbXMgd2lsbCBiZSBhZGRlZCB0byB0aGUgYXJyYXkgaW4gdGhlIG9yZGVyIHRoZXkgYXJlXG4gKiBmb3VuZC4gIFxcKkZpcnN0IGZ1bmN0aW9ucyB3aWxsIHJldHVybiB0aGUgZmlyc3QgaXRlbSBhbmQgc3RvcCBpdGVyYXRpbmcgYWZ0ZXIgdGhhdCwgaWYgbm9uZVxuICogIGlzIGZvdW5kIGZhbHNlIGlzIHJldHVybmVkLiAgcmVtb3ZlXFwqIGZ1bmN0aW9ucyB3aWxsIGRpcmVjdGx5IGNoYW5nZSB0aGUgcGFzc2VkIGluIGFycmF5LlxuICogIFxcKk5vdCBmdW5jdGlvbnMgb25seSBkbyB0aGUgZm9sbG93aW5nIGFjdGlvbnMgaWYgdGhlIGNvbXBhcmlzb24gaXMgbm90IHRydWUuXG4gKiAgXFwqTGFzdCBmdW5jdGlvbnMgZG8gdGhlIHNhbWUgYXMgdGhlaXIgXFwqRmlyc3QgY291bnRlcnBhcnRzIGV4Y2VwdCB0aGF0IHRoZSBpdGVyYXRpbmdcbiAqICBzdGFydHMgYXQgdGhlIGVuZCBvZiB0aGUgYXJyYXkuIEFsbW9zdCBldmVyeSBwdWJsaWMgbWV0aG9kIG9mIEx1Yy5pcyBpcyBhdmFpbGFibGUgaXRcbiAqICB1c2VzIHRoZSBmb2xsb3dpbmcgZ3JhbW1hciBMdWMuQXJyYXlbXCJtZXRob2ROYW1lXCJcImlzTWV0aG9kTmFtZVwiXVxuICpcbiAgICAgIEx1Yy5BcnJheS5maW5kQWxsTm90RW1wdHkoW2ZhbHNlLCB0cnVlLCBudWxsLCB1bmRlZmluZWQsIDAsICcnLCBbXSwgWzFdXSlcbiAgICAgID4gW3RydWUsIDAsIFsxXV1cblxuICAgICAgLy9PciByZW1vdmUgYWxsIGVtcHR5IGl0ZW1zXG4gICAgICB2YXIgYXJyID0gWycnLCAwICwgW10sIHthOjF9LCB0cnVlLCB7fSwgWzFdXVxuICAgICAgTHVjLkFycmF5LnJlbW92ZUFsbEVtcHR5KGFycilcbiAgICAgID5bJycsIFtdLCB7fV1cbiAgICAgIGFyclxuICAgICAgPlswLCB7YToxfSwgdHJ1ZSwgWzFdXVxuICAgICBcbiAgICAgIEx1Yy5BcnJheS5maW5kRmlyc3ROb3RTdHJpbmcoWzEsMiwzLCc1J10pXG4gICAgICA+MVxuICAgICAgdmFyIGFyciA9IFsxLDIsMywnNSddO1xuICAgICAgTHVjLkFycmF5LnJlbW92ZUFsbE5vdFN0cmluZyhhcnIpO1xuICAgICAgPlsxLDIsM11cbiAgICAgIGFyclxuICAgICAgPltcIjVcIl1cbiAqXG4gKiBBcyBvZiByaWdodCBub3cgdGhlcmUgYXJlIHR3byBmdW5jdGlvbiBzZXRzIHdoaWNoIGRpZmZlciBmcm9tIHRoZSBpc1xuICogYXBpLlxuICpcbiAqIEluc3RhbmNlT2ZcbiAqIFxuICAgIEx1Yy5BcnJheS5maW5kQWxsSW5zdGFuY2VPZihbMSwyLCBuZXcgRGF0ZSgpLCB7fSwgW11dLCBPYmplY3QpXG4gICAgPltkYXRlLCB7fSwgW11dXG4gICAgPkx1Yy5BcnJheS5maW5kQWxsTm90SW5zdGFuY2VPZihbMSwyLCBuZXcgRGF0ZSgpLCB7fSwgW11dLCBPYmplY3QpXG4gICAgWzEsIDJdXG4gKlxuICogSW5cbiAqIFxuICAgIEx1Yy5BcnJheS5maW5kQWxsSW4oWzEsMiwzXSwgWzEsMl0pXG4gICAgPlsxLCAyXVxuICAgIEx1Yy5BcnJheS5maW5kRmlyc3RJbihbMSwyLDNdLCBbMSwyXSlcbiAgICA+MVxuXG4gICAgLy9kZWZhdWx0cyB0byBsb29zZSBjb21wYXJpc29uXG4gICAgTHVjLkFycmF5LmZpbmRBbGxJbihbMSwyLDMsIHthOjEsIGI6Mn1dLCBbMSx7YToxfV0pXG4gICAgPiBbMSwge2E6MSxiOjJ9XVxuXG4gICAgTHVjLkFycmF5LmZpbmRBbGxJbihbMSwyLDMsIHthOjEsIGI6Mn1dLCBbMSx7YToxfV0sIHt0eXBlOiAnZGVlcCd9KVxuICAgID5bMV1cbiAqL1xuXG4oZnVuY3Rpb24gX2NyZWF0ZUlzRm5zKCkge1xuICAgIHZhciBpc1RvSWdub3JlID0gWydpc1JlZ0V4cCcsICdpc0FyZ3VtZW50cyddO1xuXG4gICAgT2JqZWN0LmtleXMoaXMpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIHZhciBuYW1lID0ga2V5LnNwbGl0KCdpcycpWzFdO1xuICAgICAgICBHZW5lcmF0b3IuYXJyYXlGbk5hbWVzLmZvckVhY2goZnVuY3Rpb24oZm5OYW1lKSB7XG4gICAgICAgICAgICBpZihpc1RvSWdub3JlLmluZGV4T2Yoa2V5KSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICBhcnJheVtmbk5hbWUgKyBuYW1lXSA9IEdlbmVyYXRvci5jcmVhdGVGbihmbk5hbWUsIGlzW2tleV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn0oKSk7XG5cbihmdW5jdGlvbiBfY3JlYXRlRmFsc3lGbnMoKSB7XG4gICAgdmFyIHVzZWZ1bGxGYWxzeUZucyA9IFsnZmluZEZpcnN0Tm90JywgJ2ZpbmRBbGxOb3QnLCAncmVtb3ZlRmlyc3ROb3QnLCAncmVtb3ZlQWxsTm90JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAncmVtb3ZlRmlyc3QnLCAncmVtb3ZlQWxsJywgJ3JlbW92ZUxhc3ROb3QnLCAncmVtb3ZlTGFzdCcsICAnZmluZExhc3ROb3QnXTtcblxuICAgIHZhciBmbnMgPSB7XG4gICAgICAgICdGYWxzZSc6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbCA9PT0gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgICdUcnVlJzogZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsID09PSB0cnVlO1xuICAgICAgICB9LFxuICAgICAgICAnTnVsbCc6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbCA9PT0gbnVsbDtcbiAgICAgICAgfSxcbiAgICAgICAgJ1VuZGVmaW5lZCc6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbCA9PT0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIE9iamVjdC5rZXlzKGZucykuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgdXNlZnVsbEZhbHN5Rm5zLmZvckVhY2goZnVuY3Rpb24oZm5OYW1lKSB7XG4gICAgICAgICAgICBhcnJheVtmbk5hbWUgKyBrZXldID0gR2VuZXJhdG9yLmNyZWF0ZUZuKGZuTmFtZSwgZm5zW2tleV0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0oKSk7XG5cbihmdW5jdGlvbiBfY3JlYXRlQm91bmRGbnMoKSB7XG4gICAgdmFyIGZucyA9IHtcbiAgICAgICAgJ0luc3RhbmNlT2YnOiBmdW5jdGlvbihDb25zdHJ1Y3Rvcikge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICh2YWx1ZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sJ0luJzogZnVuY3Rpb24oYXJyLCBjKSB7XG4gICAgICAgICAgICB2YXIgZGVmYXVsdEMgPSB7dHlwZTonbG9vc2VSaWdodCd9O1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYodmFsdWUgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjZmcgPSBjIHx8IGRlZmF1bHRDO1xuICAgICAgICAgICAgICAgICAgICAvL3RoaXMgaXMgYSByaWdodCB0byBsZWZ0IGNvbXBhcmlzb24gXG4gICAgICAgICAgICAgICAgICAgIC8vZXhwZWN0ZWQgbG9vc2UgYmVoYXZpb3Igc2hvdWxkIGJlIGxvb3NlUmlnaHRcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFycmF5LmZpbmRGaXJzdChhcnIsIHZhbHVlLCBjZmcudHlwZSA9PT0gJ2xvb3NlJyA/IGRlZmF1bHRDIDogY2ZnKSAhPT0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHJldHVybiBhcnIuaW5kZXhPZihmYWxzZSkgPiAtMTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgT2JqZWN0LmtleXMoZm5zKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICBHZW5lcmF0b3IuYXJyYXlGbk5hbWVzLmZvckVhY2goZnVuY3Rpb24oZm5OYW1lKSB7XG4gICAgICAgICAgICBhcnJheVtmbk5hbWUgKyBrZXldID0gR2VuZXJhdG9yLmNyZWF0ZUJvdW5kRm4oZm5OYW1lLCBmbnNba2V5XSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSgpKTsiLCJ2YXIgaXMgPSByZXF1aXJlKCcuL2lzJyk7XG5cbmZ1bmN0aW9uIF9zdHJpY3QodmFsMSwgdmFsMil7XG4gICAgcmV0dXJuIHZhbDEgPT09IHZhbDI7XG59XG5cbmZ1bmN0aW9uIF9jb21wYXJlQXJyYXlMZW5ndGgodmFsMSwgdmFsMikge1xuICAgIHJldHVybihpcy5pc0FycmF5KHZhbDEpICYmIGlzLmlzQXJyYXkodmFsMikgICYmIHZhbDEubGVuZ3RoID09PSB2YWwyLmxlbmd0aCk7XG59XG5cbmZ1bmN0aW9uIF9zaGFsbG93QXJyYXkodmFsMSwgdmFsMikge1xuICAgIHZhciBpID0gMCxcbiAgICAgICAgbGVuO1xuICAgIFxuICAgIGlmKCFfY29tcGFyZUFycmF5TGVuZ3RoKHZhbDEsIHZhbDIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IobGVuID0gdmFsMS5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgICBpZih2YWwxW2ldICE9PSB2YWwyW2ldKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gX2RlZXBBcnJheSh2YWwxLCB2YWwyLCBjb25maWcpIHtcbiAgICB2YXIgaSA9IDAsXG4gICAgICAgIGxlbjtcbiAgICBcbiAgICBpZighX2NvbXBhcmVBcnJheUxlbmd0aCh2YWwxLCB2YWwyKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZm9yKGxlbiA9IHZhbDEubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgaWYoIWNvbXBhcmUodmFsMVtpXSx2YWwyW2ldLCBjb25maWcpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gX2NvbXBhcmVPYmplY3RLZXlzTGVuZ3RoKHZhbDEsIHZhbDIpIHtcbiAgICByZXR1cm4gKGlzLmlzT2JqZWN0KHZhbDEpICYmIGlzLmlzT2JqZWN0KHZhbDIpICYmIE9iamVjdC5rZXlzKHZhbDEpLmxlbmd0aCA9PT0gT2JqZWN0LmtleXModmFsMikubGVuZ3RoKTtcbn1cblxuZnVuY3Rpb24gX3NoYWxsb3dPYmplY3QodmFsMSwgdmFsMikge1xuICAgIHZhciBrZXksIHZhbDtcblxuICAgIGlmICghX2NvbXBhcmVPYmplY3RLZXlzTGVuZ3RoKHZhbDEsIHZhbDIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IgKGtleSBpbiB2YWwxKSB7XG4gICAgICAgIGlmICh2YWwxLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsMVtrZXldO1xuICAgICAgICAgICAgaWYgKCF2YWwyLmhhc093blByb3BlcnR5KGtleSkgfHwgdmFsMltrZXldICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBfZGVlcE9iamVjdCh2YWwxLCB2YWwyLCBjb25maWcpIHtcbiAgICB2YXIga2V5LCB2YWw7XG5cbiAgICBpZiAoIV9jb21wYXJlT2JqZWN0S2V5c0xlbmd0aCh2YWwxLCB2YWwyKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZm9yIChrZXkgaW4gdmFsMSkge1xuICAgICAgICBpZiAodmFsMS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbDFba2V5XTtcbiAgICAgICAgICAgIGlmICghdmFsMi5oYXNPd25Qcm9wZXJ0eShrZXkpIHx8IGNvbXBhcmUodmFsdWUsIHZhbDJba2V5XSwgY29uZmlnKSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuXG59XG5cbmZ1bmN0aW9uIF9sb29zZU9iamVjdCh2YWwxLCB2YWwyLCBjb25maWcpIHtcbiAgICB2YXIga2V5LCB2YWw7XG5cbiAgICBpZighKGlzLmlzT2JqZWN0KHZhbDEpICYmIGlzLmlzT2JqZWN0KHZhbDIpKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYoY29uZmlnLnR5cGUgPT09ICdsb29zZVJpZ2h0Jykge1xuICAgICAgICBmb3IgKGtleSBpbiB2YWwyKSB7XG4gICAgICAgICAgICBpZiAodmFsMi5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB2YWwyW2tleV07XG4gICAgICAgICAgICAgICAgaWYgKGNvbXBhcmUodmFsdWUsIHZhbDFba2V5XSwgY29uZmlnKSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBmb3IgKGtleSBpbiB2YWwxKSB7XG4gICAgICAgICAgICBpZiAodmFsMS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB2YWwxW2tleV07XG4gICAgICAgICAgICAgICAgaWYgKGNvbXBhcmUodmFsdWUsIHZhbDJba2V5XSwgY29uZmlnKSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICByZXR1cm4gdHJ1ZTtcblxufVxuXG5mdW5jdGlvbiBfZGF0ZSh2YWwxLCB2YWwyKSB7XG4gICAgaWYoaXMuaXNEYXRlKHZhbDEpICYmIGlzLmlzRGF0ZSh2YWwyKSkge1xuICAgICAgICByZXR1cm4gdmFsMS5nZXRUaW1lKCkgPT09IHZhbDIuZ2V0VGltZSgpO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gX2NyZWF0ZUJvdW5kQ29tcGFyZShvYmplY3QsIGZuKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBmbihvYmplY3QsIHZhbHVlKTtcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBnZXRDb21wYXJlRm4ob2JqZWN0LCBjKSB7XG4gICAgdmFyIGNvbXBhcmVGbiA9IF9zdHJpY3QsXG4gICAgICAgIGNvbmZpZyA9IGMgfHwge30sXG4gICAgICAgIHR5cGUgPSBjb25maWcudHlwZTtcblxuICAgIGlmICh0eXBlID09PSAnZGVlcCcgfHwgdHlwZSA9PT0gJ2xvb3NlJyB8fCB0eXBlID09PSAnbG9vc2VSaWdodCcgfHwgdHlwZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChpcy5pc09iamVjdChvYmplY3QpKSB7XG4gICAgICAgICAgICBjb21wYXJlRm4gPSB0eXBlID09PSAnbG9vc2UnIHx8IHR5cGUgPT09ICdsb29zZVJpZ2h0JyA/IF9sb29zZU9iamVjdCA6IF9kZWVwT2JqZWN0O1xuICAgICAgICB9IGVsc2UgaWYgKGlzLmlzQXJyYXkob2JqZWN0KSkge1xuICAgICAgICAgICAgY29tcGFyZUZuID0gX2RlZXBBcnJheTtcbiAgICAgICAgfSBlbHNlIGlmIChpcy5pc0RhdGUob2JqZWN0KSkge1xuICAgICAgICAgICAgY29tcGFyZUZuID0gX2RhdGU7XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdzaGFsbG93Jykge1xuICAgICAgICBpZiAoaXMuaXNPYmplY3Qob2JqZWN0KSkge1xuICAgICAgICAgICAgY29tcGFyZUZuID0gX3NoYWxsb3dPYmplY3Q7XG4gICAgICAgIH0gZWxzZSBpZiAoaXMuaXNBcnJheShvYmplY3QpKSB7XG4gICAgICAgICAgICBjb21wYXJlRm4gPSBfc2hhbGxvd0FycmF5O1xuICAgICAgICB9IGVsc2UgaWYgKGlzLmlzRGF0ZShvYmplY3QpKSB7XG4gICAgICAgICAgICBjb21wYXJlRm4gPSBfZGF0ZTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZSAhPT0gJ3N0cmljdCcpIHtcbiAgICAgICAgLy93ZSB3b3VsZCBiZSBkb2luZyBhIHN0cmljdCBjb21wYXJpc29uIG9uIGEgdHlwZS1vXG4gICAgICAgIC8vSSB0aGluayBhbiBlcnJvciBpcyBnb29kIGhlcmUuXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignWW91IHBhc3NlZCBpbiBhbiBpbnZhbGlkIGNvbXBhcmlzb24gdHlwZScpO1xuICAgIH1cblxuICAgIHJldHVybiBjb21wYXJlRm47XG59XG5cbi8qKlxuICogQG1lbWJlciBMdWNcbiAqIEBtZXRob2QgY29tcGFyZVxuICogXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWVzIGFyZSBlcXVhbCB0byBlYWNoXG4gKiBvdGhlci4gIEJ5IGRlZmF1bHQgYSBkZWVwIGNvbXBhcmlzb24gaXMgXG4gKiBkb25lIG9uIGFycmF5cywgZGF0ZXMgYW5kIG9iamVjdHMgYW5kIGEgc3RyaWN0IGNvbXBhcmlzb25cbiAqIGlzIGRvbmUgb24gb3RoZXIgdHlwZXMuXG4gKiBcbiAqIEBwYXJhbSAge0FueX0gdmFsMSAgXG4gKiBAcGFyYW0gIHtBbnl9IHZhbDIgICBcbiAqIEBwYXJhbSAge09iamVjdH0gW2NvbmZpZ11cbiAqIEBwYXJhbSB7U3RyaW5nfSBjb25maWcudHlwZSBwYXNzIGluICdzaGFsbG93JyBmb3IgYSBzaGFsbG93XG4gKiBjb21wYXJpc29uLCAnZGVlcCcgKGRlZmF1bHQpIGZvciBhIGRlZXAgY29tcGFyaXNvblxuICogJ3N0cmljdCcgZm9yIGEgc3RyaWN0ID09PSBjb21wYXJpc29uIGZvciBhbGwgb2JqZWN0cyBvciBcbiAqICdsb29zZScgZm9yIGEgbG9vc2UgY29tcGFyaXNvbiBvbiBvYmplY3RzLiAgQSBsb29zZSBjb21wYXJpc29uXG4gKiAgd2lsbCBjb21wYXJlIHRoZSBrZXlzIGFuZCB2YWx1ZXMgb2YgdmFsMSB0byB2YWwyIGFuZCBkb2VzIG5vdFxuICogIGNoZWNrIGlmIGtleXMgZnJvbSB2YWwyIGFyZSBlcXVhbCB0byB0aGUga2V5cyBpbiB2YWwxLlxuICpcbiAqXG4gICAgTHVjLmNvbXBhcmUoJzEnLCAxKVxuICAgID5mYWxzZVxuICAgIEx1Yy5jb21wYXJlKHthOiAxfSwge2E6IDF9KVxuICAgID50cnVlXG4gICAgTHVjLmNvbXBhcmUoe2E6IDEsIGI6IHt9fSwge2E6IDEsIGI6IHt9IH0sIHt0eXBlOidzaGFsbG93J30pXG4gICAgPmZhbHNlXG4gICAgTHVjLmNvbXBhcmUoe2E6IDEsIGI6IHt9fSwge2E6IDEsIGI6IHt9IH0sIHt0eXBlOiAnZGVlcCd9KVxuICAgID50cnVlXG4gICAgTHVjLmNvbXBhcmUoe2E6IDEsIGI6IHt9fSwge2E6IDEsIGI6IHt9IH0sIHt0eXBlOiAnc3RyaWN0J30pXG4gICAgPmZhbHNlXG4gICAgTHVjLmNvbXBhcmUoe2E6IDF9LCB7YToxLGI6MX0pXG4gICAgPmZhbHNlXG4gICAgTHVjLmNvbXBhcmUoe2E6IDF9LCB7YToxLGI6MX0sIHt0eXBlOiAnbG9vc2UnfSlcbiAgICA+dHJ1ZVxuICAgIEx1Yy5jb21wYXJlKHthOiAxfSwge2E6MSxiOjF9LCB7dHlwZTogJ2xvb3NlJ30pXG4gICAgPnRydWVcbiAgICBMdWMuY29tcGFyZShbe2E6IDF9XSwgW3thOjEsYjoxfV0sIHt0eXBlOiAnbG9vc2UnfSlcbiAgICA+dHJ1ZVxuICAgIEx1Yy5jb21wYXJlKFt7YTogMX0sIHt9XSwgW3thOjEsYjoxfV0sIHt0eXBlOiAnbG9vc2UnfSlcbiAgICA+ZmFsc2VcbiAgICBMdWMuY29tcGFyZShbe2E6IDF9LCB7fV0sIFt7YToxLGI6MX0sIHt9XSwge3R5cGU6ICdsb29zZSd9KVxuICAgID50cnVlXG4gICAgTHVjLmNvbXBhcmUoW3thOjEsYjoxfV0sIFt7YTogMX1dLCB7dHlwZTogJ2xvb3NlJ30pXG4gICAgPmZhbHNlXG5cbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGNvbXBhcmUodmFsMSwgdmFsMiwgY29uZmlnKSB7XG4gICAgcmV0dXJuIGdldENvbXBhcmVGbih2YWwxLCBjb25maWcpKHZhbDEsIHZhbDIsIGNvbmZpZyk7XG59XG5cbmV4cG9ydHMuY29tcGFyZSA9IGNvbXBhcmU7IiwidmFyIGVtcHR5Rm4gPSByZXF1aXJlKCcuLi9mdW5jdGlvbicpLmVtcHR5Rm4sXG4gICAgYXBwbHkgPSByZXF1aXJlKCcuLi9vYmplY3QnKS5hcHBseTtcblxuLyoqXG4gKiBAY2xhc3MgTHVjLkJhc2VcbiAqIFNpbXBsZSBjbGFzcyB0aGF0IGJ5IGRlZmF1bHQge0BsaW5rIEx1YyNhcHBseSBhcHBsaWVzfSB0aGUgXG4gKiBmaXJzdCBhcmd1bWVudCB0byB0aGUgaW5zdGFuY2UgYW5kIHRoZW4gY2FsbHNcbiAqIEx1Yy5CYXNlLmluaXQuXG4gKlxuICAgIHZhciBiID0gbmV3IEx1Yy5CYXNlKHtcbiAgICAgICAgYTogMSxcbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnaGV5JylcbiAgICAgICAgfVxuICAgIH0pXG4gICAgYi5hXG4gICAgPmhleVxuICAgID4xXG4gKlxuICogV2UgZm91bmQgdGhhdCBtb3N0IG9mIG91ciBjbGFzc2VzIGRvIHRoaXMgc28gd2UgbWFkZVxuICogaXQgdGhlIGRlZmF1bHQuICBIYXZpbmcgYSBjb25maWcgb2JqZWN0IGFzIHRoZSBmaXJzdCBhbmQgb25seSBcbiAqIHBhcmFtIGtlZXBzIGEgY2xlYW4gYXBpIGFzIHdlbGwuXG4gKlxuICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgTHVjLkFycmF5LmVhY2godGhpcy5pdGVtcywgdGhpcy5sb2dJdGVtcylcbiAgICAgICAgfSxcblxuICAgICAgICBsb2dJdGVtczogZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coaXRlbSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciBjID0gbmV3IEMoe2l0ZW1zOiBbMSwyLDNdfSk7XG4gICAgPjFcbiAgICA+MlxuICAgID4zXG4gICAgdmFyIGQgPSBuZXcgQyh7aXRlbXM6ICdBJ30pO1xuICAgID4nQSdcbiAgICB2YXIgZSA9IG5ldyBDKCk7XG4gKlxuICogSWYgeW91IGRvbid0IGxpa2UgdGhlIGFwcGx5aW5nIG9mIHRoZSBjb25maWcgdG8gdGhlIGluc3RhbmNlIGl0IFxuICogY2FuIGFsd2F5cyBiZSBcImRpc2FibGVkXCJcbiAqXG4gICAgdmFyIE5vQXBwbHkgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgYmVmb3JlSW5pdDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgfSxcbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBMdWMuQXJyYXkuZWFjaCh0aGlzLml0ZW1zLCB0aGlzLmxvZ0l0ZW1zKVxuICAgICAgICB9LFxuXG4gICAgICAgIGxvZ0l0ZW1zOiBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhpdGVtKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIGMgPSBuZXcgTm9BcHBseSh7aXRlbXM6IFsxLDIsM119KTtcbiAqIFxuICovXG5mdW5jdGlvbiBCYXNlKCkge1xuICAgIHRoaXMuYmVmb3JlSW5pdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMuaW5pdCgpO1xufVxuXG5CYXNlLnByb3RvdHlwZSA9IHtcbiAgICAvKipcbiAgICAgKiBCeSBkZWZhdWx0IGFwcGx5IHRoZSBjb25maWcgdG8gdGhlIFxuICAgICAqIGluc3RhbmNlLlxuICAgICAqL1xuICAgIGJlZm9yZUluaXQ6IGZ1bmN0aW9uKGNvbmZpZykge1xuICAgICAgICBhcHBseSh0aGlzLCBjb25maWcpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQG1ldGhvZFxuICAgICAqIFNpbXBsZSBob29rIHRvIGluaXRpYWxpemVcbiAgICAgKiB0aGUgY2xhc3MuICBEZWZhdWx0cyB0byBMdWMuZW1wdHlGblxuICAgICAqL1xuICAgIGluaXQ6IGVtcHR5Rm5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZTsiLCJ2YXIgQmFzZSA9IHJlcXVpcmUoJy4vYmFzZScpLFxuICAgIENvbXBvc2l0aW9uID0gcmVxdWlyZSgnLi9jb21wb3NpdGlvbicpLFxuICAgIG9iaiA9IHJlcXVpcmUoJy4uL29iamVjdCcpLFxuICAgIGFycmF5Rm5zID0gcmVxdWlyZSgnLi4vYXJyYXknKSxcbiAgICBlbXB0eUZuID0gcmVxdWlyZSgnLi4vZnVuY3Rpb24nKS5lbXB0eUZuLFxuICAgIGlzID0gcmVxdWlyZSgnLi4vaXMnKSxcbiAgICBhRWFjaCA9IGFycmF5Rm5zLmVhY2gsXG4gICAgYXBwbHkgPSBvYmouYXBwbHksXG4gICAgb0VhY2ggPSBvYmouZWFjaCxcbiAgICBvRmlsdGVyID0gb2JqLmZpbHRlcixcbiAgICBtaXggPSBvYmoubWl4LFxuICAgIGFycmF5U2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UsXG4gICAgQ2xhc3NEZWZpbmVyO1xuXG4vKipcbiAqIEBjbGFzcyBMdWMuQ2xhc3NEZWZpbmVyXG4gKiBAc2luZ2xldG9uXG4gKlxuICogU2luZ2xldG9uIHRoYXQge0BsaW5rIEx1Yy5kZWZpbmUjZGVmaW5lIEx1Yy5kZWZpbmV9IHVzZXMgdG8gZGVmaW5lIGNsYXNzZXMuICBUaGUgZGVmdWFsdCB0eXBlIGNhblxuICogYmUgY2hhbmdlZCB0byBhbnkgQ29uc3RydWN0b3JcbiAqXG4gICAgZnVuY3Rpb24gTXlDbGFzcygpe307XG4gICAgTHVjLkNsYXNzRGVmaW5lci5kZWZhdWx0VHlwZSA9IE15Q2xhc3M7XG4gICAgdmFyIEMgPSBMdWMuZGVmaW5lKCk7XG4gICAgbmV3IEMoKSBpbnN0YW5jZW9mIEx1Yy5CYXNlXG4gICAgPmZhbHNlXG4gICAgbmV3IEMoKSBpbnN0YW5jZW9mIE15Q2xhc3NcbiAgICA+dHJ1ZVxuICovXG5cbi8qKlxuICogQGNmZyB7RnVuY3Rpb259IGRlZmF1bHRUeXBlIHRoaXMgY2FuIGJlIGNoYW5nZWQgdG8gYW55IENvbnN0cnVjdG9yLiAgRGVmYXVsdHNcbiAqIHRvIEx1Yy5CYXNlLlxuICovXG5cbkNsYXNzRGVmaW5lciA9IHtcblxuICAgIENPTVBPU0lUSU9OU19OQU1FOiAnJGNvbXBvc2l0aW9ucycsXG5cbiAgICBkZWZhdWx0VHlwZTogQmFzZSxcblxuICAgIHByb2Nlc3NvcktleXM6IHtcbiAgICAgICAgJG1peGluczogJ19hcHBseU1peGlucycsXG4gICAgICAgICRzdGF0aWNzOiAnX2FwcGx5U3RhdGljcycsXG4gICAgICAgICRjb21wb3NpdGlvbnM6ICdfYXBwbHlDb21wb3Nlck1ldGhvZHMnLFxuICAgICAgICAkc3VwZXI6ICdfYXBwbHlTdXBlcidcbiAgICB9LFxuXG4gICAgZGVmaW5lOiBmdW5jdGlvbihvcHRzLCBhZnRlcikge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IG9wdHMgfHwge30sXG4gICAgICAgICAgICAvL2lmIHN1cGVyIGlzIGEgZmFsc3kgdmFsdWUgYmVzaWRlcyB1bmRlZmluZWQgdGhhdCBtZWFucyBubyBzdXBlcmNsYXNzXG4gICAgICAgICAgICBTdXBlciA9IG9wdGlvbnMuJHN1cGVyIHx8IChvcHRpb25zLiRzdXBlciA9PT0gdW5kZWZpbmVkID8gdGhpcy5kZWZhdWx0VHlwZSA6IGZhbHNlKSxcbiAgICAgICAgICAgIGFmdGVyRGVmaW5lID0gYWZ0ZXIgfHwgZW1wdHlGbixcbiAgICAgICAgICAgIENvbnN0cnVjdG9yO1xuXG4gICAgICAgIG9wdGlvbnMuJHN1cGVyID0gU3VwZXI7XG5cbiAgICAgICAgQ29uc3RydWN0b3IgPSB0aGlzLl9jcmVhdGVDb25zdHJ1Y3RvcihvcHRpb25zKTtcblxuICAgICAgICB0aGlzLl9wcm9jZXNzQWZ0ZXJDcmVhdGUoQ29uc3RydWN0b3IsIG9wdGlvbnMpO1xuXG4gICAgICAgIGFmdGVyRGVmaW5lLmNhbGwoQ29uc3RydWN0b3IsIENvbnN0cnVjdG9yKTtcblxuICAgICAgICByZXR1cm4gQ29uc3RydWN0b3I7XG4gICAgfSxcblxuICAgIF9jcmVhdGVDb25zdHJ1Y3RvcjogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICB2YXIgc3VwZXJjbGFzcyA9IG9wdGlvbnMuJHN1cGVyLFxuICAgICAgICAgICAgQ29uc3RydWN0b3IgPSB0aGlzLl9jcmVhdGVDb25zdHJ1Y3RvckZuKG9wdGlvbnMpO1xuXG4gICAgICAgIGlmKHN1cGVyY2xhc3MpIHtcbiAgICAgICAgICAgIENvbnN0cnVjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJjbGFzcy5wcm90b3R5cGUpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gQ29uc3RydWN0b3I7XG4gICAgfSxcblxuICAgIF9jcmVhdGVDb25zdHJ1Y3RvckZuOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHZhciBzdXBlcmNsYXNzID0gb3B0aW9ucy4kc3VwZXIsXG4gICAgICAgICAgICBDb25zdHJ1Y3RvcjtcblxuICAgICAgICBpZiAodGhpcy5faGFzQ29uc3RydWN0b3JNb2RpZnlpbmdPcHRpb25zKG9wdGlvbnMpKSB7XG4gICAgICAgICAgICBDb25zdHJ1Y3RvciA9IHRoaXMuX2NyZWF0ZUNvbnN0cnVjdG9yRnJvbU9wdGlvbnMob3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZighc3VwZXJjbGFzcykge1xuICAgICAgICAgICAgQ29uc3RydWN0b3IgPSBmdW5jdGlvbigpIHt9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgQ29uc3RydWN0b3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBzdXBlcmNsYXNzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIENvbnN0cnVjdG9yO1xuICAgIH0sXG5cbiAgICBfaGFzQ29uc3RydWN0b3JNb2RpZnlpbmdPcHRpb25zOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLiRjb21wb3NpdGlvbnM7XG4gICAgfSxcblxuICAgIF9jcmVhdGVDb25zdHJ1Y3RvckZyb21PcHRpb25zOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHZhciBzdXBlcmNsYXNzID0gb3B0aW9ucy4kc3VwZXIsXG4gICAgICAgICAgICBtZSA9IHRoaXMsXG4gICAgICAgICAgICBpbml0QmVmb3JlU3VwZXJjbGFzcyxcbiAgICAgICAgICAgIGluaXRBZnRlclN1cGVyY2xhc3MsXG4gICAgICAgICAgICBpbml0O1xuXG4gICAgICAgIGlmICghc3VwZXJjbGFzcykge1xuICAgICAgICAgICAgaW5pdCA9IHRoaXMuX2NyZWF0ZUluaXRDbGFzc0ZuKG9wdGlvbnMsIHtcbiAgICAgICAgICAgICAgICBhbGw6IHRydWVcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBhcnJheVNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICBpbml0LmNhbGwodGhpcywgb3B0aW9ucywgYXJncyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdEJlZm9yZVN1cGVyY2xhc3MgPSB0aGlzLl9jcmVhdGVJbml0Q2xhc3NGbihvcHRpb25zLCB7XG4gICAgICAgICAgICBiZWZvcmU6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaW5pdEFmdGVyU3VwZXJjbGFzcyA9IHRoaXMuX2NyZWF0ZUluaXRDbGFzc0ZuKG9wdGlvbnMsIHtcbiAgICAgICAgICAgIGJlZm9yZTogZmFsc2VcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGFyZ3MgPSBhcnJheVNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblxuICAgICAgICAgICAgaW5pdEJlZm9yZVN1cGVyY2xhc3MuY2FsbCh0aGlzLCBvcHRpb25zLCBhcmdzKTtcbiAgICAgICAgICAgIHN1cGVyY2xhc3MuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIGluaXRBZnRlclN1cGVyY2xhc3MuY2FsbCh0aGlzLCBvcHRpb25zLCBhcmdzKTtcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgX2NyZWF0ZUluaXRDbGFzc0ZuOiBmdW5jdGlvbihvcHRpb25zLCBjb25maWcpIHtcbiAgICAgICAgdmFyIG1lID0gdGhpcyxcbiAgICAgICAgICAgIGNvbXBvc2l0aW9ucyA9IHRoaXMuX2ZpbHRlckNvbXBvc2l0aW9ucyhjb25maWcsIG9wdGlvbnMuJGNvbXBvc2l0aW9ucyk7XG5cbiAgICAgICAgaWYoY29tcG9zaXRpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGVtcHR5Rm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBmdW5jdGlvbihvcHRpb25zLCBpbnN0YW5jZUFyZ3MpIHtcbiAgICAgICAgICAgIG1lLl9pbml0Q29tcG9zaXRpb25zLmNhbGwodGhpcywgY29tcG9zaXRpb25zLCBpbnN0YW5jZUFyZ3MpO1xuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBfZmlsdGVyQ29tcG9zaXRpb25zOiBmdW5jdGlvbihjb25maWcsIGNvbXBvc2l0aW9ucykge1xuICAgICAgICB2YXIgYmVmb3JlID0gY29uZmlnLmJlZm9yZSwgXG4gICAgICAgICAgICBmaWx0ZXJlZCA9IFtdO1xuXG4gICAgICAgIGlmKGNvbmZpZy5hbGwpIHtcbiAgICAgICAgICAgIHJldHVybiBjb21wb3NpdGlvbnM7XG4gICAgICAgIH1cblxuICAgICAgICBhRWFjaChjb21wb3NpdGlvbnMsIGZ1bmN0aW9uKGNvbXBvc2l0aW9uKSB7XG4gICAgICAgICAgICBpZihiZWZvcmUgJiYgY29tcG9zaXRpb24uaW5pdEFmdGVyICE9PSB0cnVlIHx8ICghYmVmb3JlICYmIGNvbXBvc2l0aW9uLmluaXRBZnRlciA9PT0gdHJ1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWQucHVzaChjb21wb3NpdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBmaWx0ZXJlZDtcbiAgICB9LFxuXG4gICAgX3Byb2Nlc3NBZnRlckNyZWF0ZTogZnVuY3Rpb24oJGNsYXNzLCBvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuX2FwcGx5VmFsdWVzVG9Qcm90bygkY2xhc3MsIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLl9oYW5kbGVQb3N0UHJvY2Vzc29ycygkY2xhc3MsIG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICBfYXBwbHlWYWx1ZXNUb1Byb3RvOiBmdW5jdGlvbigkY2xhc3MsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHByb3RvID0gJGNsYXNzLnByb3RvdHlwZSxcbiAgICAgICAgICAgIHZhbHVlcyA9IGFwcGx5KHtcbiAgICAgICAgICAgICAgICAkY2xhc3M6ICRjbGFzc1xuICAgICAgICAgICAgfSwgb3B0aW9ucyk7XG5cbiAgICAgICAgLy9Eb24ndCBwdXQgdGhlIGRlZmluZSBzcGVjaWZpYyBwcm9wZXJ0aWVzXG4gICAgICAgIC8vb24gdGhlIHByb3RvdHlwZVxuICAgICAgICBvRWFjaCh2YWx1ZXMsIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fZ2V0UHJvY2Vzc29yS2V5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBwcm90b1trZXldID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICBfZ2V0UHJvY2Vzc29yS2V5OiBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc29yS2V5c1trZXldO1xuICAgIH0sXG5cbiAgICBfaGFuZGxlUG9zdFByb2Nlc3NvcnM6IGZ1bmN0aW9uKCRjbGFzcywgb3B0aW9ucykge1xuICAgICAgICBvRWFjaChvcHRpb25zLCBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgbWV0aG9kID0gdGhpcy5fZ2V0UHJvY2Vzc29yS2V5KGtleSk7XG5cbiAgICAgICAgICAgIGlmIChpcy5pc0Z1bmN0aW9uKHRoaXNbbWV0aG9kXSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzW21ldGhvZF0uY2FsbCh0aGlzLCAkY2xhc3MsIG9wdGlvbnNba2V5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICBfYXBwbHlNaXhpbnM6IGZ1bmN0aW9uKCRjbGFzcywgbWl4aW5zKSB7XG4gICAgICAgIHZhciBwcm90byA9ICRjbGFzcy5wcm90b3R5cGU7XG4gICAgICAgIGFFYWNoKG1peGlucywgZnVuY3Rpb24obWl4aW4pIHtcbiAgICAgICAgICAgIC8vYWNjZXB0IENvbnN0cnVjdG9ycyBvciBPYmplY3RzXG4gICAgICAgICAgICB2YXIgdG9NaXggPSBtaXhpbi5wcm90b3R5cGUgfHwgbWl4aW47XG4gICAgICAgICAgICBtaXgocHJvdG8sIHRvTWl4KTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIF9hcHBseVN0YXRpY3M6IGZ1bmN0aW9uKCRjbGFzcywgc3RhdGljcykge1xuICAgICAgICB2YXIgcHJvdG90eXBlID0gJGNsYXNzLnByb3RvdHlwZTtcblxuICAgICAgICBhcHBseSgkY2xhc3MsIHN0YXRpY3MpO1xuXG4gICAgICAgIGlmKHByb3RvdHlwZS5nZXRTdGF0aWNWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBwcm90b3R5cGUuZ2V0U3RhdGljVmFsdWUgPSB0aGlzLmdldFN0YXRpY1ZhbHVlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9hcHBseUNvbXBvc2VyTWV0aG9kczogZnVuY3Rpb24oJGNsYXNzLCBjb21wb3NpdGlvbnMpIHtcbiAgICAgICAgdmFyIHByb3RvdHlwZSA9ICRjbGFzcy5wcm90b3R5cGUsXG4gICAgICAgICAgICBtZXRob2RzVG9Db21wb3NlO1xuXG4gICAgICAgIGFFYWNoKGNvbXBvc2l0aW9ucywgZnVuY3Rpb24oY29tcG9zaXRpb25Db25maWcpIHtcbiAgICAgICAgICAgIHZhciBjb21wb3NpdGlvbiA9IG5ldyBDb21wb3NpdGlvbihjb21wb3NpdGlvbkNvbmZpZyksXG4gICAgICAgICAgICAgICAgbmFtZSA9IGNvbXBvc2l0aW9uLm5hbWUsXG4gICAgICAgICAgICAgICAgQ29uc3RydWN0b3IgPSBjb21wb3NpdGlvbi5Db25zdHJ1Y3RvcjtcblxuICAgICAgICAgICAgY29tcG9zaXRpb24udmFsaWRhdGUoKTtcblxuICAgICAgICAgICAgbWV0aG9kc1RvQ29tcG9zZSA9IGNvbXBvc2l0aW9uLmdldE1ldGhvZHNUb0NvbXBvc2UoKTtcblxuICAgICAgICAgICAgbWV0aG9kc1RvQ29tcG9zZS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgICAgIGlmIChwcm90b3R5cGVba2V5XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3RvdHlwZVtrZXldID0gdGhpcy5fY3JlYXRlQ29tcG9zZXJQcm90b0ZuKGtleSwgbmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICAgIGlmKHByb3RvdHlwZS5nZXRDb21wb3NpdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcHJvdG90eXBlLmdldENvbXBvc2l0aW9uID0gdGhpcy5nZXRDb21wb3NpdGlvbjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgX2FwcGx5U3VwZXI6IGZ1bmN0aW9uKCRjbGFzcywgJHN1cGVyKSB7XG4gICAgICAgIHZhciBwcm90byxcbiAgICAgICAgICAgIHN1cGVyT2JqO1xuXG4gICAgICAgIC8vc3VwZXIgY2FuIGJlIGZhbHN5IHRvIHNpZ25pZnkgbm8gc3VwZXJjbGFzc1xuICAgICAgICBpZiAoJHN1cGVyKSB7XG4gICAgICAgICAgICBzdXBlck9iaiA9IHtcbiAgICAgICAgICAgICAgICAkc3VwZXI6ICRzdXBlcixcbiAgICAgICAgICAgICAgICAkc3VwZXJjbGFzczogJHN1cGVyLnByb3RvdHlwZVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcHJvdG8gPSAkY2xhc3MucHJvdG90eXBlO1xuXG4gICAgICAgICAgICBhcHBseShwcm90bywgc3VwZXJPYmopO1xuICAgICAgICAgICAgYXBwbHkoJGNsYXNzLCBzdXBlck9iaik7XG5cbiAgICAgICAgICAgIHRoaXMuX2FkZFN1cGVyTWV0aG9kKHByb3RvKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfYWRkU3VwZXJNZXRob2Q6IGZ1bmN0aW9uKHByb3RvKSB7XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0U3VwZXJNZXRob2QoY2FsbGVlLCBzcCkge1xuICAgICAgICAgICAgdmFyICRzdXBlciA9IHNwIHx8IHByb3RvLFxuICAgICAgICAgICAgICAgIGtleTtcblxuICAgICAgICAgICAgZm9yIChrZXkgaW4gJHN1cGVyKSB7XG4gICAgICAgICAgICAgICAgaWYgKCRzdXBlcltrZXldID09PSBjYWxsZWUpIHtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHN1cGVyLiRzdXBlcmNsYXNzW2tleV07XG5cbiAgICAgICAgICAgICAgICAgICAgLy93ZSBjb3VsZCBiZSBjYWNoaW5nIHRoaXMgaGVyZSBvbiB0aGUgZm5cbiAgICAgICAgICAgICAgICAgICAgLy9idXQgdGhlbiBkZXZzIHdvdWxkIGhhdmUgdG8ga25vdyB0aGUgZWRnZSBjYXNlc1xuICAgICAgICAgICAgICAgICAgICAvL29mIGhvdyB0byBpbnZhbGlkYXRlIGl0XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZ2V0U3VwZXJNZXRob2QoY2FsbGVlLCAkc3VwZXIuJHN1cGVyY2xhc3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY2FsbFN1cGVyKGFyZ3MpIHtcbiAgICAgICAgICAgIHZhciBzdXBlck1ldGhvZCA9IGdldFN1cGVyTWV0aG9kKGNhbGxTdXBlci5jYWxsZXIpO1xuXG4gICAgICAgICAgICBpZihzdXBlck1ldGhvZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdXBlck1ldGhvZC5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdzdXBlciBtZXRob2Qgbm90IGZvdW5kLicpO1xuICAgICAgICAgICAgXG4gICAgICAgIH1cblxuICAgICAgICBwcm90by5jYWxsU3VwZXIgPSBjYWxsU3VwZXI7XG4gICAgfSxcblxuICAgIF9jcmVhdGVDb21wb3NlclByb3RvRm46IGZ1bmN0aW9uKG1ldGhvZE5hbWUsIGNvbXBvc2l0aW9uTmFtZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgY29tcCA9IHRoaXNbQ2xhc3NEZWZpbmVyLkNPTVBPU0lUSU9OU19OQU1FXVtjb21wb3NpdGlvbk5hbWVdO1xuICAgICAgICAgICAgcmV0dXJuIGNvbXBbbWV0aG9kTmFtZV0uYXBwbHkoY29tcCwgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAaWdub3JlXG4gICAgICogb3B0aW9ucyB7T2JqZWN0fSB0aGUgY29tcG9zaXRpb24gY29uZmlnIG9iamVjdFxuICAgICAqIGluc3RhbmNlQXJncyB7QXJyYXl9IHRoZSBhcmd1bWVudHMgcGFzc2VkIHRvIHRoZSBpbnN0YW5jZSdzXG4gICAgICogY29uc3RydWN0b3IuXG4gICAgICovXG4gICAgX2luaXRDb21wb3NpdGlvbnM6IGZ1bmN0aW9uKGNvbXBvc2l0aW9ucywgaW5zdGFuY2VBcmdzKSB7XG4gICAgICAgIGlmKCF0aGlzW0NsYXNzRGVmaW5lci5DT01QT1NJVElPTlNfTkFNRV0pIHtcbiAgICAgICAgICAgIHRoaXNbQ2xhc3NEZWZpbmVyLkNPTVBPU0lUSU9OU19OQU1FXSA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgYUVhY2goY29tcG9zaXRpb25zLCBmdW5jdGlvbihjb21wb3NpdGlvbkNvbmZpZykge1xuICAgICAgICAgICAgdmFyIGNvbmZpZyA9IGFwcGx5KHtcbiAgICAgICAgICAgICAgICBpbnN0YW5jZTogdGhpcyxcbiAgICAgICAgICAgICAgICBpbnN0YW5jZUFyZ3M6IGluc3RhbmNlQXJnc1xuICAgICAgICAgICAgfSwgY29tcG9zaXRpb25Db25maWcpLCBcbiAgICAgICAgICAgIGNvbXBvc2l0aW9uO1xuXG4gICAgICAgICAgICBjb21wb3NpdGlvbiA9IG5ldyBDb21wb3NpdGlvbihjb25maWcpO1xuXG4gICAgICAgICAgICB0aGlzW0NsYXNzRGVmaW5lci5DT01QT1NJVElPTlNfTkFNRV1bY29tcG9zaXRpb24ubmFtZV0gPSBjb21wb3NpdGlvbi5nZXRJbnN0YW5jZSgpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgLy9NZXRob2RzIHRoYXQgY2FuIGdldCBhZGRlZCB0byB0aGUgcHJvdG90eXBlXG4gICAgLy90aGV5IHdpbGwgYmUgY2FsbGVkIGluIHRoZSBjb250ZXh0IG9mIHRoZSBpbnN0YW5jZS5cbiAgICAvL1xuICAgIGdldENvbXBvc2l0aW9uOiBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbQ2xhc3NEZWZpbmVyLkNPTVBPU0lUSU9OU19OQU1FXVtrZXldO1xuICAgIH0sXG5cbiAgICBnZXRTdGF0aWNWYWx1ZTogZnVuY3Rpb24gKGtleSwgJGNsYXNzKSB7XG4gICAgICAgIHZhciBjbGFzc1RvRmluZFZhbHVlID0gJGNsYXNzIHx8IHRoaXMuJGNsYXNzLFxuICAgICAgICAgICAgJHN1cGVyLFxuICAgICAgICAgICAgdmFsdWU7XG5cbiAgICAgICAgdmFsdWUgPSBjbGFzc1RvRmluZFZhbHVlW2tleV07XG5cbiAgICAgICAgaWYodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgJHN1cGVyID0gY2xhc3NUb0ZpbmRWYWx1ZS5wcm90b3R5cGUuJHN1cGVyO1xuICAgICAgICAgICAgaWYoJHN1cGVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0U3RhdGljVmFsdWUoa2V5LCAkc3VwZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxufTtcblxuQ2xhc3NEZWZpbmVyLmRlZmluZSA9IENsYXNzRGVmaW5lci5kZWZpbmUuYmluZChDbGFzc0RlZmluZXIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENsYXNzRGVmaW5lcjtcblxuLyoqXG4gKiBAY2xhc3MgIEx1Yy5kZWZpbmVcbiAqIFRoaXMgaXMgYWN0dWFsbHkgYSBmdW5jdGlvbiBidXQgaGFzIGEgZGVjZW50IGFtb3VudCBvZiBpbXBvcnRhbnQgb3B0aW9uc1xuICogc28gd2UgYXJlIGRvY3VtZW50aW5nIGl0IGxpa2UgaXQgaXMgYSBjbGFzcy4gIFByb3BlcnRpZXMgYXJlIHRoaW5ncyB0aGF0IHdpbGwgZ2V0XG4gKiBhcHBsaWVkIHRvIGluc3RhbmNlcyBvZiBjbGFzc2VzIGRlZmluZWQgd2l0aCB7QGxpbmsgTHVjLmRlZmluZSNkZWZpbmUgZGVmaW5lfS4gIE5vbmVcbiAqIGFyZSBuZWVkZWQgZm9yIHtAbGluayBMdWMuZGVmaW5lI2RlZmluZSBkZWZpbmluZ30gYSBjbGFzcy4gIHtAbGluayBMdWMuZGVmaW5lI2RlZmluZSBkZWZpbmV9XG4gKiBqdXN0IHRha2VzIHRoZSBwYXNzZWQgaW4gY29uZmlnIGFuZCBwdXRzIHRoZSBwcm9wZXJ0aWVzIG9uIHRoZSBwcm90b3R5cGUgYW5kIHJldHVybnNcbiAqIGEgQ29uc3RydWN0b3IuXG4gKlxuXG4gICAgdmFyIEMgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgYTogMSxcbiAgICAgICAgZG9Mb2c6IHRydWUsXG4gICAgICAgIGxvZ0E6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZG9Mb2cpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgdmFyIGMgPSBuZXcgQygpO1xuICAgIGMubG9nQSgpO1xuICAgID4xXG4gICAgYy5hID0gNDU7XG4gICAgYy5sb2dBKCk7XG4gICAgPjQ1XG4gICAgYy5kb0xvZyA9IGZhbHNlO1xuICAgIGMubG9nQSgpO1xuXG4gICAgbmV3IEMoKS5sb2dBKClcbiAgICA+MVxuXG4gKlxuICogQ2hlY2sgb3V0IHRoZSBmb2xsb3dpbmcgY29uZmlncyB0byBhZGQgZnVuY3Rpb25hbGl0eSB0byBhIGNsYXNzIHdpdGhvdXQgbWVzc2luZ1xuICogdXAgdGhlIGluaGVyaXRhbmNlIGNoYWluLiAgQWxsIHRoZSBjb25maWdzIGhhdmUgZXhhbXBsZXMgYW5kIGRvY3VtZW50YXRpb24gb24gXG4gKiBob3cgdG8gdXNlIHRoZW0uXG4gKlxuICoge0BsaW5rIEx1Yy5kZWZpbmUjJHN1cGVyIHN1cGVyfSA8YnI+XG4gKiB7QGxpbmsgTHVjLmRlZmluZSMkY29tcG9zaXRpb25zIGNvbXBvc2l0aW9uc30gPGJyPlxuICoge0BsaW5rIEx1Yy5kZWZpbmUjJG1peGlucyBtaXhpbnN9IDxicj5cbiAqIHtAbGluayBMdWMuZGVmaW5lIyRzdGF0aWNzIHN0YXRpY3N9IDxicj5cbiAqIFxuICogXG4gKi9cblxuLyoqXG4gKiBAbWV0aG9kICBkZWZpbmVcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgY29uZmlnIG9iamVjdCB1c2VkIHdoZW4gY3JlYXRpbmcgdGhlIGNsYXNzLiAgQW55IHByb3BlcnR5IHRoYXRcbiAqIGlzIG5vdCBhcGFydCBvZiB0aGUgc3BlY2lhbCBjb25maWdzIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgcHJvdG90eXBlLiAgQ2hlY2sgb3V0XG4gKiBMdWMuZGVmaW5lIGZvciBhbGwgdGhlIGNvbmZpZyBvcHRpb25zLiAgIE5vIGNvbmZpZ3MgYXJlIG5lZWRlZCB0byBkZWZpbmUgYSBjbGFzcy5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBhZnRlckRlZmluZSAob3B0aW9uYWwpIGZ1bmN0aW9uIHRvIHJ1biBhZnRlciB0aGUgQ29uc3RydWN0b3IgaGFzIGJlZW4gY3JlYXRlZC5cbiAqIFRoZSBmaXJzdCBhbiBvbmx5IGFyZ3VtZW50IGlzIHRoZSBuZXdseSBjcmVhdGVkIENvbnN0cnVjdG9yLlxuICogXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gdGhlIGRlZmluZWQgY2xhc3NcbiAqXG4gICAgdmFyIEMgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgbG9nQTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmEpXG4gICAgICAgIH0sXG4gICAgICAgIGE6IDFcbiAgICB9KTtcbiAgICB2YXIgYyA9IG5ldyBDKCk7XG4gICAgYy5sb2dBKCk7XG4gICAgPjFcblxuICAgIGMuYSA9IDQ7XG4gICAgYy5sb2dBKCk7XG4gICAgPjRcbiAqXG4gKlxuICovXG5cbi8qKlxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gJGNsYXNzIHJlZmVyZW5jZSB0byB0aGUgaW5zdGFuY2UncyBvd24gY29uc3RydWN0b3IuICBUaGlzXG4gKiB3aWxsIGdldCBhZGRlZCB0byBhbnkgY2xhc3MgdGhhdCBpcyBkZWZpbmVkIHdpdGggTHVjLmRlZmluZS5cbiAqIFxuICAgIHZhciBDID0gTHVjLmRlZmluZSgpXG4gICAgdmFyIGMgPSBuZXcgQygpXG4gICAgYy4kY2xhc3MgPT09IENcbiAgICA+dHJ1ZVxuICpcbiAqIFRoZXJlIGFyZSBzb21lIHJlYWxseSBnb29kIHVzZSBjYXNlcyB0byBoYXZlIGEgcmVmZXJlbmNlIHRvIGl0J3NcbiAqIG93biBjb25zdHJ1Y3Rvci4gIDxicj4gQWRkIGZ1bmN0aW9uYWxpdHkgdG8gYW4gaW5zdGFuY2UgaW4gYSBzaW1wbGVcbiAqIGFuZCBnZW5lcmljIHdheTpcbiAqXG4gICAgdmFyIEMgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgYWRkOiBmdW5jdGlvbihhLGIpIHtcbiAgICAgICAgICAgIHJldHVybiBhICsgYjtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy9MdWMuQmFzZSBhcHBsaWVzIGZpcnN0IFxuICAgIC8vYXJnIHRvIHRoZSBpbnN0YW5jZVxuXG4gICAgdmFyIGMgPSBuZXcgQyh7XG4gICAgICAgIGFkZDogZnVuY3Rpb24oYSxiLGMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLiRjbGFzcy5wcm90b3R5cGUuYWRkLmNhbGwodGhpcywgYSxiKSArIGM7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGMuYWRkKDEsMiwzKVxuICAgID42XG4gICAgbmV3IEMoKS5hZGQoMSwyLDMpXG4gICAgPjNcbiAqXG4gKiBPciBoYXZlIGEgc2ltcGxlIGdlbmVyaWMgY2xvbmUgbWV0aG9kIDpcbiAqXG4gICAgdmFyIEMgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgY2xvbmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIG15T3duUHJvcHMgPSB7fTtcbiAgICAgICAgICAgIEx1Yy5PYmplY3QuZWFjaCh0aGlzLCBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgbXlPd25Qcm9wc1trZXldID0gdmFsdWU7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIG5ldyB0aGlzLiRjbGFzcyhteU93blByb3BzKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIGMgPSBuZXcgQyh7YToxLGI6MixjOjN9KTtcbiAgICBjLmQgPSA0O1xuICAgIHZhciBjbG9uZSA9IGMuY2xvbmUoKTtcblxuICAgIGNsb25lID09PSBjXG4gICAgPmZhbHNlXG5cbiAgICBjbG9uZS5hXG4gICAgPjFcbiAgICBjbG9uZS5iXG4gICAgPjJcbiAgICBjbG9uZS5jXG4gICAgPjNcbiAgICBjbG9uZS5kXG4gICAgPjRcbiAqL1xuXG4vKipcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IFskc3VwZXJdIElmICRzdXBlciBpcyBub3QgZmFsc2Ugb3IgbnVsbCBcbiAqIHRoZSAkc3VwZXIgcHJvcGVydHkgd2lsbCBiZSBhZGRlZCB0byBldmVyeSBpbnN0YW5jZSBvZiB0aGUgZGVmaW5lZCBjbGFzcyxcbiAqICRzdXBlciBpcyB0aGUgQ29uc3RydWN0b3IgcGFzc2VkIGluIHdpdGggdGhlICRzdXBlciBjb25maWcgb3IgdGhlIHtAbGluayBMdWMuQ2xhc3NEZWZpbmVyI2RlZmF1bHRUeXBlIGRlZmF1bHR9XG4gKiBcbiAgICB2YXIgQyA9IEx1Yy5kZWZpbmUoKVxuICAgIHZhciBjID0gbmV3IEMoKVxuICAgIC8vTHVjLkJhc2UgaXMgdGhlIGRlZmF1bHQgXG4gICAgYy4kc3VwZXIgPT09IEx1Yy5CYXNlXG4gICAgPnRydWVcbiAqL1xuXG4vKipcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IFtjYWxsU3VwZXJdIElmICRzdXBlciBpcyBkZWZpbmVkIGl0XG4gKiB3aWxsIGJlIG9uIHRoZSBwcm90b3R5cGUgb2YgJHN1cGVyLiAgSXQgY2FuIGJlIHVzZWQgdG8gY2FsbCBhIHN1cGVyJ3NcbiAqIG1ldGhvZC4gIFRoaXMgY2FuIGJlIHVzZWQgaW5zdGVhZCBvZiB0aGUgY2xhc3MncyBzdGF0aWMgJHN1cGVyY2xhc3MgcmVmZXJlbmNlLlxuICogQ2hlY2sgb3V0IHtAbGluayBMdWMuZGVmaW5lI2NhbGxTdXBlciBjYWxsU3VwZXJ9IGZvciBtb3JlIGV4dGVuc2l2ZSBkb2N1bWVudGF0aW9uLlxuICogXG4gKiBcbiAgICBmdW5jdGlvbiBNeUNvb2xDbGFzcygpIHt9XG4gICAgTXlDb29sQ2xhc3MucHJvdG90eXBlLmFkZE51bXMgPSBmdW5jdGlvbihhLGIpIHtcbiAgICAgICAgcmV0dXJuIGEgKyBiO1xuICAgIH1cblxuICAgIHZhciBNeU90aGVyQ29vbENsYXNzID0gTHVjLmRlZmluZSh7XG4gICAgICAgICRzdXBlcjogTXlDb29sQ2xhc3MsXG4gICAgICAgIGFkZE51bXM6IGZ1bmN0aW9uKGEsIGIsIGMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNhbGxTdXBlcihbYSwgYl0pICsgYztcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICB2YXIgbSA9IG5ldyBNeU90aGVyQ29vbENsYXNzKCk7XG4gICAgbS5hZGROdW1zKDEsMiwzKTtcbiAgICA+NlxuICovXG5cbi8qKlxuICogQG1ldGhvZCBjYWxsU3VwZXIgSWYgJHN1cGVyIGlzIGRlZmluZWQgaXRcbiAqIHdpbGwgYmUgb24gdGhlIHByb3RvdHlwZSBvZiAkc3VwZXIuICBJdCBjYW4gYmUgdXNlZCB0byBjYWxsIGEgc3VwZXInc1xuICogbWV0aG9kLlxuICpcbiAqIEBwYXJhbSB7QXJyYXkvQXJndW1lbnRzfSBhcmdzKG9wdGlvbmFsKSBUaGUgYXJndW1lbnRzIGZvciB0aGUgc3VwZXIgbWV0aG9kcyBhcHBseSBjYWxsLlxuICogXG4gKiBcbiAgICBmdW5jdGlvbiBNeUNvb2xDbGFzcygpIHt9XG4gICAgTXlDb29sQ2xhc3MucHJvdG90eXBlLmFkZE51bXMgPSBmdW5jdGlvbihhLGIpIHtcbiAgICAgICAgcmV0dXJuIGEgKyBiO1xuICAgIH1cblxuICAgIHZhciBNQyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICAkc3VwZXI6IE15Q29vbENsYXNzLFxuICAgICAgICBhZGROdW1zOiBmdW5jdGlvbihhLCBiLCBjKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jYWxsU3VwZXIoW2EsIGJdKSArIGM7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBcbiAgICAqXG4gICAgKiBwcm9kdWNlcyB0aGUgc2FtZSBjb2RlIGFzIDpcbiAgICAqIFxuICAgIHZhciBNQyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICAkc3VwZXI6IE15Q29vbENsYXNzLFxuICAgICAgICBhZGROdW1zOiBmdW5jdGlvbihhLCBiLCBjKSB7XG4gICAgICAgICAgICByZXR1cm4gTUMuJHN1cGVyY2xhc3MuYWRkTnVtcy5hcHBseSh0aGlzLCBbYSwgYl0pICsgYztcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gQ291bnRlcigpIHtcbiAgICAgICAgdGhpcy5jb3VudCA9IDA7XG4gICAgIH07XG5cbiAgICAgQ291bnRlci5wcm90b3R5cGUgPSB7XG4gICAgICAgIGdldENvdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvdW50O1xuICAgICAgICB9LFxuICAgICAgICBpbmNyZWFzZUNvdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuY291bnQrKztcbiAgICAgICAgfVxuICAgICB9XG4gICAgXG4gICAgdmFyIEMgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgJHN1cGVyOkNvdW50ZXIsXG4gICAgICAgIGluY3JlYXNlQ291bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuY291bnQgKz0gMjtcbiAgICAgICAgICAgIHRoaXMuY2FsbFN1cGVyKCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgICpcbiAgICAqIGlzIHRoZSBzYW1lIGFzXG4gICAgKiBcblxuICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgICRzdXBlcjpDb3VudGVyLFxuICAgICAgICBpbmNyZWFzZUNvdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmNvdW50ICs9IDI7XG4gICAgICAgICAgICBDLiRzdXBlcmNsYXNzLmluY3JlYXNlQ291bnQuY2FsbCh0aGlzKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgKlxuICAgICogQ2F2ZWF0cyA8YnI+XG4gICAgKlxuICAgICogY2FsbFN1cGVyIGNhbiBub3QgYmUgdXNlZCBhcyBhbiBpbnN0YW5jZSBtZXRob2Qgb3IgaW5zaWRlIG9mIG1ldGhvZFxuICAgICogdGhhdCBpcyBvdmVyd3JpdHRlbiBmb3IgYSBwYXJ0aWN1bGFyIGluc3RhbmNlLlxuICAgICpcbiAgICB2YXIgYyA9IG5ldyBDKCk7XG4gICAgLy90aGlzIHdpbGwgdGhyb3cgYW4gZXJyb3Igd2l0aCB0aGUgbWVzc2FnZSBvZiBtZXRob2Qgbm90IGZvdW5kLlxuICAgIGMuY2FsbFN1cGVyKClcbiAgICAqXG4gICAgKiBXaGF0IGNhbGxTdXBlciBtYWtlcyB1cCBmb3IgaW4gdGVyc2VuZXNzIGl0IGxvc2VzIGl0IGluXG4gICAgKiBlZmZpY2llbmN5LlxuICAgICogXG4gICAgdGhpcy5jb3VudCArPSAyO1xuICAgIEMuJHN1cGVyY2xhc3MuaW5jcmVhc2VDb3VudFxuXG4gICAgKlxuICAgICogaXMgbXVjaCBmYXN0ZXIgYW5kIG1vcmUgZWZmaWNpZW50IHRoYXQgOlxuICAgICogXG4gICAgdGhpcy5jb3VudCArPSAyO1xuICAgIHRoaXMuY2FsbFN1cGVyKCk7XG5cblxuICovXG5cblxuLyoqXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBnZXRTdGF0aWNWYWx1ZSB0aGlzIG1ldGhvZFxuICogd2lsbCBiZSBhZGRlZCB0byBpbnN0YW5jZXMgdGhhdCB1c2UgdGhlIHtAbGluayBMdWMuZGVmaW5lIyRzdGF0aWNzICRzdGF0aWNzfVxuICogY29uZmlnLlxuICpcbiAqIFxuICogVGhpcyBzaG91bGQgYmUgdXNlZCBvdmVyIHRoaXMuJGNsYXNzLnN0YXRpY05hbWUgdG9cbiAqIGdldCB0aGUgdmFsdWUgb2Ygc3RhdGljLiAgSWYgdGhlIGNsYXNzIGdldHMgaW5oZXJpdGVkXG4gKiBmcm9tLCB0aGlzLiRjbGFzcyB3aWxsIG5vdCBiZSB0aGUgc2FtZS4gIGdldFN0YXRpYyB2YWx1ZVxuICogZGVhbHMgd2l0aCB0aGlzIGlzc3VlLlxuICogXG4gICAgdmFyIEEgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgJHN0YXRpY3M6IHtcbiAgICAgICAgICAgIGE6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgIGdldEFCZXR0ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0U3RhdGljVmFsdWUoJ2EnKTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0QTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kY2xhc3MuYTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIEIgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgJHN1cGVyOiBBLFxuICAgICAgICAkc3RhdGljczoge1xuICAgICAgICAgICAgYjogMixcbiAgICAgICAgICAgIGM6IDNcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgXG4gICAgdmFyIGIgPSBuZXcgQigpO1xuICAgIGIuZ2V0QSgpO1xuICAgID51bmRlZmluZWRcbiAgICBiLmdldEFCZXR0ZXIoKTtcbiAgICA+MVxuXG4gKiBAcmV0dXJuIHtPYmplY3R9IHRoZSBzdGF0aWMgdmFsdWUgb2YgdGhlIGtleVxuICovXG5cbiAgICBcbi8qKlxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gZ2V0Q29tcG9zaXRpb24gdGhpcyBtZXRob2Qgd2lsbCBiZSBhZGRlZFxuICogdG8gaW5zdGFuY2VzIHRoYXQgdXNlIHRoZSB7QGxpbmsgTHVjLmRlZmluZSMkY29tcG9zaXRpb25zICRjb21wb3NpdGlvbnN9ICBjb25maWdcbiAqXG4gKiAgVGhpcyB3aWxsIHJldHVybiB0aGUgY29tcG9zaXRpb24gaW5zdGFuY2UgYmFzZWQgb2ZmIHRoZSBjb21wb3NpdGlvbiB7QGxpbmsgTHVjLkNvbXBvc2l0aW9uI25hbWUgbmFtZX1cbiAgICBcbiAgICB0aGlzLmdldENvbXBvc2l0aW9uKFwibmFtZVwiKTtcbiAgICBcbiAqXG4gKi9cblxuXG4vKipcbiAqIEBjZmcge09iamVjdH0gJHN0YXRpY3MgKG9wdGlvbmFsKSBBZGQgc3RhdGljIHByb3BlcnRpZXMgb3IgbWV0aG9kc1xuICogdG8gdGhlIGNsYXNzLiAgVGhlc2UgcHJvcGVydGllcy9tZXRob2RzIHdpbGwgbm90IGJlIGFibGUgdG8gYmVcbiAqIGRpcmVjdGx5IG1vZGlmaWVkIGJ5IHRoZSBpbnN0YW5jZSBzbyB0aGV5IGFyZSBnb29kIGZvciBkZWZpbmluZyBkZWZhdWx0XG4gKiBjb25maWdzLiAgVXNpbmcgdGhpcyBjb25maWcgYWRkcyB0aGUge0BsaW5rIEx1Yy5kZWZpbmUjZ2V0U3RhdGljVmFsdWUgZ2V0U3RhdGljVmFsdWV9XG4gKiBtZXRob2QgdG8gaW5zdGFuY2VzLlxuICpcbiAgICB2YXIgQyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICAkc3RhdGljczoge1xuICAgICAgICAgICAgbnVtYmVyOiAxXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciBjID0gbmV3IEMoKTtcbiAgICBjLm51bWJlclxuICAgID51bmRlZmluZWRcbiAgICBDLm51bWJlclxuICAgID4xXG4gICAgXG4gKlxuICogQmFkIHRoaW5ncyBjYW4gaGFwcGVuIGlmIG5vbiBwcmltaXRpdmVzIGFyZSBwbGFjZWQgb24gdGhlIFxuICogcHJvdG90eXBlIGFuZCBpbnN0YW5jZSBzaGFyaW5nIGlzIG5vdCB3YW50ZWQuICBVc2luZyBzdGF0aWNzXG4gKiBwcmV2ZW50IHN1YmNsYXNzZXMgYW5kIGluc3RhbmNlcyBmcm9tIHVua25vd2luZ2x5IG1vZGlmeWluZ1xuICogYWxsIGluc3RhbmNlcy5cbiAqIFxuICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgIGNmZzoge1xuICAgICAgICAgICAgYTogMVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB2YXIgYyA9IG5ldyBDKCk7XG4gICAgYy5jZmcuYVxuICAgID4xXG4gICAgYy5jZmcuYSA9IDVcbiAgICBuZXcgQygpLmNmZy5hXG4gICAgPjVcbiAqXG4gKi9cblxuLyoqXG4gKiBAY2ZnIHtPYmplY3QvQ29uc3RydWN0b3IvT2JqZWN0W10vQ29uc3RydWN0b3JbXX0gJG1peGlucyAob3B0aW9uYWwpICBNaXhpbnMgYXJlIGEgd2F5IHRvIGFkZCBmdW5jdGlvbmFsaXR5XG4gKiB0byBhIGNsYXNzIHRoYXQgc2hvdWxkIG5vdCBhZGQgc3RhdGUgdG8gdGhlIGluc3RhbmNlIHVua25vd2luZ2x5LiAgTWl4aW5zIGNhbiBiZSBlaXRoZXIgb2JqZWN0cyBvciBDb25zdHJ1Y3RvcnMuXG4gKlxuICAgIGZ1bmN0aW9uIExvZ2dlcigpIHt9XG4gICAgTG9nZ2VyLnByb3RvdHlwZS5sb2cgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc29sZS5sb2coYXJndW1lbnRzKVxuICAgIH1cblxuICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgICRtaXhpbnM6IFtMb2dnZXIsIHtcbiAgICAgICAgICAgIHdhcm46IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2Fybihhcmd1bWVudHMpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1dXG4gICAgfSk7XG5cbiAgICB2YXIgYyA9IG5ldyBDKCk7XG5cbiAgICBjLmxvZygxLDIpXG4gICAgPlsxLDJdXG5cbiAgICBjLndhcm4oMyw0KVxuICAgID5bMyw0XVxuICpcbiAqL1xuLyoqXG4gKiBAY2ZnIHtDb25zdHJ1Y3Rvcn0gJHN1cGVyIChvcHRpb25hbCkgIHN1cGVyIGZvciB0aGUgZGVmaW5pbmcgY2xhc3MuICBCeSBMdWMuQmFzZVxuICogaXMgdGhlIGRlZmF1bHQgaWYgc3VwZXIgaXMgbm90IHBhc3NlZCBpbi4gIFRvIGRlZmluZSBhIGNsYXNzIHdpdGhvdXQgYSBzdXBlcmNsYXNzXG4gKiB5b3UgY2FuIHBhc3MgaW4gZmFsc2Ugb3IgbnVsbC5cbiAqXG4gICAgIGZ1bmN0aW9uIENvdW50ZXIoKSB7XG4gICAgICAgIHRoaXMuY291bnQgPSAwO1xuICAgICB9O1xuXG4gICAgIENvdW50ZXIucHJvdG90eXBlID0ge1xuICAgICAgICBnZXRDb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb3VudDtcbiAgICAgICAgfSxcbiAgICAgICAgaW5jcmVhc2VDb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLmNvdW50Kys7XG4gICAgICAgIH1cbiAgICAgfVxuXG4gICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgICRzdXBlcjpDb3VudGVyXG4gICAgfSk7XG5cbiAgICB2YXIgYyA9IG5ldyBDKClcblxuICAgIGMgaW5zdGFuY2VvZiBDb3VudGVyXG4gICAgPnRydWVcbiAgICBjLmluY3JlYXNlQ291bnQoKTtcbiAgICBjLmdldENvdW50KCk7XG4gICAgPjFcbiAgICBjLmNvdW50XG4gICAgPjFcblxuICogQSByZWZlcmVuY2UgdG8gdGhlIHN1cGVyY2xhc3MncyBtZXRob2RzIGNhbiBiZSBvYnRhaW5lZCB0aHJvdWdoXG4gKiB0aGUgZGVmaW5lZCBjbGFzcydzIHByb3BlcnR5ICRzdXBlcmNsYXNzLiAgU2ltaWxhciBmdW5jdGlvbmFsaXR5IFxuICogY2FuIGJlIGRvbmUgd2l0aCB7QGxpbmsgTHVjLmRlZmluZSNjYWxsU3VwZXIgY2FsbFN1cGVyfSBidXQgY2FsbFN1cGVyXG4gKiBpcyBtdWNoIGxlc3MgZWZmaWNpZW50LlxuICpcbiAgICAgdmFyIEMgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgJHN1cGVyOkNvdW50ZXIsXG4gICAgICAgIGluY3JlYXNlQ291bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuY291bnQgKz0gMjtcbiAgICAgICAgICAgIEMuJHN1cGVyY2xhc3MuaW5jcmVhc2VDb3VudC5jYWxsKHRoaXMpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB2YXIgYyA9IG5ldyBDKCk7XG4gICAgYy5pbmNyZWFzZUNvdW50KCk7XG4gICAgYy5jb3VudFxuICAgID4zXG4gKlxuICogQ2hlY2sgb3V0IEx1Yy5CYXNlIHRvIHNlZSB3aHkgd2UgaGF2ZSBpdCBhcyB0aGUgZGVmYXVsdC5cbiAqIFxuICAgIHZhciBCID0gTHVjLmRlZmluZSh7XG4gICAgICAgIGFtSUFMdWNCYXNlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgTHVjLkJhc2VcbiAgICAgICAgfVxuICAgIH0pXG4gICAgdmFyIGIgPSBuZXcgQigpO1xuICAgIGIuYW1JQUx1Y0Jhc2UoKTtcbiAgICA+dHJ1ZVxuICpcbiAqIFxuICovXG5cblxuXG4vKipcbiAqIEBjZmcge09iamVjdC9PYmplY3RbXX0gJGNvbXBvc2l0aW9ucyAob3B0aW9uYWwpIGNvbmZpZyBvYmplY3RzIGZvciBcbiAqIEx1Yy5Db21wb3NpdGlvbi4gIENvbXBvc2l0aW9ucyBhcmUgYSBncmVhdCB3YXkgdG8gYWRkIGJlaGF2aW9yIHRvIGEgY2xhc3NcbiAqIHdpdGhvdXQgZXh0ZW5kaW5nIGl0LiAgQSB7QGxpbmsgTHVjLmRlZmluZSMkbWl4aW5zIG1peGlufSBjYW4gb2ZmZXIgc2ltaWxhciBmdW5jdGlvbmFsaXR5IGJ1dCBzaG91bGRcbiAqIG5vdCBiZSBhZGRpbmcgYW4gdW5uZWVkZWQgc3RhdGUuICBBIENvbnN0cnVjdG9yIGFuZCBhIG5hbWUgYXJlIG5lZWRlZCBmb3IgdGhlIGNvbmZpZyBvYmplY3QuXG4gKiAgVXNpbmcgdGhpcyBjb25maWcgYWRkcyB0aGUge0BsaW5rIEx1Yy5kZWZpbmUjZ2V0Q29tcG9zaXRpb24gZ2V0Q29tcG9zaXRpb259XG4gKiBtZXRob2QgdG8gaW5zdGFuY2VzLlxuICogPGJyPlxuICogVGhlIG1ldGhvZHMgcHJvcGVydHkgaXMgb3B0aW9uYWwgaGVyZSBidXQgaXQgaXMgc2F5aW5nIHRha2UgYWxsIG9mIFxuICogTHVjLkV2ZW50RW1pdHRlcidzIGluc3RhbmNlIG1ldGhvZHMgYW5kIG1ha2UgdGhlbSBpbnN0YW5jZSBtZXRob2RzIGZvciBDLlxuICogWW91IGNhbiBjaGVjayBvdXQgYWxsIG9mIHRoZSBjb25maWcgb3B0aW9ucyBieSBsb29raW5nIGF0IEx1Yy5Db21wb3NpdGlvbi5cbiAqIFxuICAgICAgICB2YXIgQyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICAgICAgJGNvbXBvc2l0aW9uczoge1xuICAgICAgICAgICAgICAgIENvbnN0cnVjdG9yOiBMdWMuRXZlbnRFbWl0dGVyLFxuICAgICAgICAgICAgICAgIG5hbWU6ICdlbWl0dGVyJyxcbiAgICAgICAgICAgICAgICBtZXRob2RzOiAnYWxsTWV0aG9kcydcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIGMgPSBuZXcgQygpO1xuXG4gICAgICAgIGMub24oJ2hleScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYXJndW1lbnRzKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYy5lbWl0KCdoZXknLCAxLDIsMywgJ2EnKTtcbiAgICAgICAgPlsxLCAyLCAzLCBcImFcIl1cbiAgICAgICAgYyBpbnN0YW5jZW9mIEx1Yy5FdmVudEVtaXR0ZXJcbiAgICAgICAgPmZhbHNlXG4gICAgICAgIGMuX2V2ZW50c1xuICAgICAgICA+dW5kZWZpbmVkXG4gKlxuICogTHVjLkV2ZW50RW1pdHRlciBpcyBwcmVmZXJyZWQgYXMgYSBjb21wb3NpdGlvbiBvdmVyIGEgbWl4aW4gYmVjYXVzZVxuICogaXQgYWRkcyBhIHN0YXRlIFwiX2V2ZW50c1wiIHRvIHRoZSB0aGlzIGluc3RhbmNlIHdoZW4gb24gaXMgY2FsbGVkLiAgSXRcbiAqIGFsc28gc2hvdWxkbid0IGhhdmUgdG8ga25vdyB0aGF0IGl0IG1heSBiZSBpbnN0YW50aWF0ZWQgYWxvbmUgb3IgbWl4ZWQgaW50byBjbGFzc2VzXG4gKiBzbyB0aGUgaW5pdGluZyBvZiBzdGF0ZSBpcyBub3QgZG9uZSBpbiB0aGUgY29uc3RydWN0b3IgbGlrZSBpdCBwcm9iYWJseSBzaG91bGQuXG4gKiBJdCBpcyBub3QgdGVycmlibGUgcHJhY3RpY2UgYnkgYW55IG1lYW5zIGJ1dCBpdCBpcyBub3QgZ29vZCB0byBoYXZlIGEgc3RhbmRhbG9uZSBjbGFzc1xuICogdGhhdCBrbm93cyB0aGF0IGl0IG1heSBiZSBtaXhpbmcuICBFdmVuIHdvcnNlIHRoYW4gdGhhdCB3b3VsZCBiZSBhIG1peGluIHRoYXQgbmVlZHNcbiAqIHRvIGJlIGluaXRlZCBieSB0aGUgZGVmaW5pbmcgY2xhc3MuICBFbmNhcHN1bGF0aW5nIGxvZ2ljIGluIGEgY2xhc3NcbiAqIGFuZCB1c2luZyBpdCBhbnl3aGVyZSBzZWFtbGVzc2x5IGlzIHdoZXJlIGNvbXBvc2l0aW9ucyBzaGluZS4gTHVjIGNvbWVzIHdpdGggdHdvIGNvbW1vbiBcbiAqIHtAbGluayBMdWMjY29tcG9zaXRpb25FbnVtcyBlbnVtc30gdGhhdCB3ZSBleHBlY3Qgd2lsbCBiZSB1c2VkIG9mdGVuLlxuICogXG4gKiA8YnI+XG4gKiBIZXJlIGlzIGFuIGV4YW1wbGUgb2YgYSBzaW1wbGUgY29tcG9zaXRpb24gc2VlIGhvdyB0aGUgZnVuY3Rpb25hbGl0eSBcbiAqIGlzIGFkZGVkIGJ1dCB3ZSBhcmUgbm90IGluaGVyaXRpbmcgYW5kIHRoaXMuY291bnQgaXNcbiAqIHVuZGVmaW5lZC5cbiAqXG4gICAgICAgICBmdW5jdGlvbiBDb3VudGVyKCkge1xuICAgICAgICAgICAgdGhpcy5jb3VudCA9IDA7XG4gICAgICAgICB9O1xuXG4gICAgICAgICBDb3VudGVyLnByb3RvdHlwZSA9IHtcbiAgICAgICAgICAgIGdldENvdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb3VudDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpbmNyZWFzZUNvdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvdW50Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgICB9XG5cbiAgICAgICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgICAgICAgICAgJGNvbXBvc2l0aW9uczoge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY291bnRlcicsXG4gICAgICAgICAgICAgICAgICAgIENvbnN0cnVjdG9yOiBDb3VudGVyLFxuICAgICAgICAgICAgICAgICAgICBtZXRob2RzOiAnYWxsTWV0aG9kcydcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBjID0gbmV3IEMoKVxuXG4gICAgICAgIGMuaW5jcmVhc2VDb3VudCgpO1xuICAgICAgICBjLmluY3JlYXNlQ291bnQoKTtcbiAgICAgICAgYy5pbmNyZWFzZUNvdW50KCk7XG4gICAgICAgIGMuZ2V0Q291bnQoKTtcbiAgICAgICAgPjNcbiAgICAgICAgYy5jb3VudFxuICAgICAgICA+dW5kZWZpbmVkXG4gKlxuICogTHVjIGNvbWVzIHdpdGggdHdvIGRlZmF1bHQgY29tcG9zaXRpb24gb2JqZWN0cyBMdWMuY29tcG9zaXRpb25FbnVtcy5QbHVnaW5NYW5hZ2VyXG4gKiBhbmQgTHVjLmNvbXBvc2l0aW9uRW51bXMuRXZlbnRFbWl0dGVyLlxuICogXG4gKiBIZXJlIGlzIHRoZSBwbHVnaW4gbWFuYWdlciBlbnVtLCBrZWVwIGluIG1pbmQgdGhhdCB0aGlzXG4gKiBmdW5jdGlvbmFsaXR5IGNhbiBiZSBhZGRlZCB0byBhbnkgY2xhc3MsIG5vdCBqdXN0IG9uZXMgZGVmaW5lZCB3aXRoIFxuICogTHVjLmRlZmluZS4gIENoZWNrIG91dCBMdWMuUGx1Z2luTWFuYWdlciB0byBzZWUgYWxsIG9mIHRoZSBwdWJsaWMgXG4gKiBtZXRob2RzIHRoYXQgZ2V0cyBhZGRlZCB0byB0aGUgZGVmaW5lZCBpbnN0YW5jZS5cbiBcbiAqIEEgcGx1Z2luIGZvbGxvd3MgdGhlIGZvbGxvd2luZyBsaWZlLWN5Y2xlOiA8YnI+XG4gICAgXG4gKnBsdWdpbiBpcyBhZGRlZCB0byB0aGUgaW5zdGFuY2UgLT4gcGx1Z2luIGlzIGNyZWF0ZWQgLT4gcGx1Z2luIGluaXQgaXMgY2FsbGVkIHdpdGggaW5zdGFuY2UgLT4gaWYgbmVlZGVkIGRlc3Ryb3kgY2FsbGVkIGJ5IGluc3RhbmNlIC0+IGRlc3Ryb3kgY2FsbGVkIG9uIHBsdWdpbiA8YnI+XG4gKkhlcmUgaXMgdGhlIG1vc3QgYmFzaWMgZXhhbXBsZSB1c2luZyB0aGUge0BsaW5rIEx1Yy5QbHVnaW4gZGVmYXVsdH0gcGx1Z2luLlxuICAgXG4gICAgdmFyIEMgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgJGNvbXBvc2l0aW9uczogTHVjLmNvbXBvc2l0aW9uRW51bXMuUGx1Z2luTWFuYWdlclxuICAgIH0pO1xuXG4gICAgdmFyIGMgPSBuZXcgQyh7XG4gICAgICAgIHBsdWdpbnM6IFt7XG4gICAgICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpbSBnZXR0aW5nIGluaXR0ZWQnKVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgbXlDb29sTmFtZTogJ2Nvb2wnXG4gICAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICB9KTtcblxuICAgID5pbSBnZXR0aW5nIGluaXR0ZWRcblxuICAgIGMuZ2V0UGx1Z2luKHtteUNvb2xOYW1lOiAnY29vJ30pIGluc3RhbmNlb2YgTHVjLlBsdWdpblxuICAgID4gdHJ1ZVxuXG4qICBQbHVnaW5zIGNhbiBiZSBvZiBhbnkgY2xhc3MgYW5kIGNhbiBiZSBhZGRlZCB3aXRoIHtAbGluayBMdWMuUGx1Z2luTWFuYWdlciNhZGRQbHVnaW4gYWRkUGx1Z2lufVxuXG4gICAgZnVuY3Rpb24gTXlQbHVnaW4oKXt9XG5cbiAgICB2YXIgQyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICAkY29tcG9zaXRpb25zOiBMdWMuY29tcG9zaXRpb25FbnVtcy5QbHVnaW5NYW5hZ2VyXG4gICAgfSk7XG5cbiAgICB2YXIgYyA9IG5ldyBDKCk7XG5cbiAgICBjLmFkZFBsdWdpbih7Q29uc3RydWN0b3I6IE15UGx1Z2lufSk7XG4gICAgLy9nZXRQbHVnaW4gdGFrZXMgYSBDb25zdHJ1Y3RvciBvciBtYXRjaCBvYmplY3RcbiAgICBjLmdldFBsdWdpbihNeVBsdWdpbikgaW5zdGFuY2VvZiBNeVBsdWdpblxuICAgID50cnVlXG4gICAgYy5nZXRQbHVnaW4oTHVjLlBsdWdpbilcbiAgICA+ZmFsc2VcblxuKiBQbHVnaW5zIGNhbiBhbHNvIGJlIGRlc3Ryb3llZCBpbmRpdmlkdWFsbHkgb3IgYWxsIG9mIHRoZW0gYXQgb25jZVxuICAgIFxuICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgICRjb21wb3NpdGlvbnM6IEx1Yy5jb21wb3NpdGlvbkVudW1zLlBsdWdpbk1hbmFnZXJcbiAgICB9KTtcblxuICAgIHZhciBjID0gbmV3IEMoe1xuICAgICAgICBwbHVnaW5zOiBbe1xuICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2ltIGdldHRpbmcgaW5pdHRlZCAnICsgdGhpcy5uYW1lKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdkZXN0cm95ZWQgOiAnICsgdGhpcy5uYW1lKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG5hbWU6ICcxJ1xuICAgICAgICB9LHtcbiAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpbSBnZXR0aW5nIGluaXR0ZWQgJyArIHRoaXMubmFtZSlcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkZXN0cm95OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZGVzdHJveWVkIDogJyArIHRoaXMubmFtZSlcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBuYW1lOiAnMidcbiAgICAgICAgfV1cbiAgICB9KTtcblxuICAgID5pbSBnZXR0aW5nIGluaXR0ZWQgMVxuICAgID5pbSBnZXR0aW5nIGluaXR0ZWQgMlxuICAgIFxuXG4gICAgYy5kZXN0cm95UGx1Z2luKHtuYW1lOiAnMSd9KTtcbiAgICA+ZGVzdHJveWVkIDogMVxuICAgIC8vYSBwbHVnaW4gaXMgcmV0dXJuZWQgaWYgaXQgaXMgZm91bmQgYW5kIGRlc3Ryb3llZFxuICAgID5QbHVnaW4ge2luaXQ6IGZ1bmN0aW9uLCBkZXN0cm95OiBmdW5jdGlvbiwgbmFtZTogXCIxXCIsIG93bmVyOiBPYmplY3QsIGluaXQ6IGZ1bmN0aW9u4oCmfVxuXG4gICAgYy5kZXN0cm95UGx1Z2luKHtuYW1lOiAnMSd9KTtcbiAgICAvL2ZhbHNlIGlzIHJldHVybmVkIGlmIGl0IGlzIG5vdCBmb3VuZFxuICAgID5mYWxzZVxuXG4gICAgYy5kZXN0cm95QWxsUGx1Z2lucygpO1xuICAgID5kZXN0cm95ZWQgOiAyXG4gKlxuICogWW91IGNhbiBzZWUgdGhhdCBpdCBjYW4gYWRkIHBsdWdpbiBsaWtlIGJlaGF2aW9yIHRvIGFueSBkZWZpbmluZ1xuICogY2xhc3Mgd2l0aCBMdWMuUGx1Z2luTWFuYWdlciB3aGljaCBpcyBsZXNzIHRoYW4gNzUgU0xPQy5cbiAqLyIsInZhciBhRWFjaCA9IHJlcXVpcmUoJy4uL2FycmF5JykuZWFjaCxcbiAgICBvYmogPSByZXF1aXJlKCcuLi9vYmplY3QnKSxcbiAgICBlbXB0eUZuID0gcmVxdWlyZSgnLi4vZnVuY3Rpb24nKS5lbXB0eUZuLFxuICAgIGFwcGx5ID0gb2JqLmFwcGx5O1xuXG4vKipcbiAqIEBjbGFzcyBMdWMuUGx1Z2luXG4gKiBTaW1wbGUgY2xhc3MgdGhhdCBpcyB0aGUgZGVmYXVsdCBwbHVnaW4gdHlwZSBmb3IgTHVjLlBsdWdpbk1hbmFnZXJcbiAqL1xuZnVuY3Rpb24gUGx1Z2luKGNvbmZpZykge1xuICAgIGFwcGx5KHRoaXMsIGNvbmZpZyk7XG59XG5cblBsdWdpbi5wcm90b3R5cGUgPSB7XG4gICAgLyoqXG4gICAgICogQG1ldGhvZFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvd25lciB0aGUgb3duZXIgaW5zdGFuY2VcbiAgICAgKiBTaW1wbGUgaG9vayB0byBpbml0aWFsaXplIHRoZSBwbHVnaW5cbiAgICAgKiBEZWZhdWx0cyB0byBMdWMuZW1wdHlGbi5cbiAgICAgKi9cbiAgICBpbml0OiBlbXB0eUZuLFxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgXG4gICAgICogRGVmYXVsdHMgdG8gTHVjLmVtcHR5Rm4uXG4gICAgICogQ2FsbGVkIHdoZW4gdGhlIHBsdWdpbiBpcyBiZWluZyB7QGxpbmsgTHVjLlBsdWdpbk1hbmFnZXIjZGVzdHJveVBsdWdpbiBkZXN0cm95ZWR9LlxuICAgICAqL1xuICAgIGRlc3Ryb3k6IGVtcHR5Rm5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUGx1Z2luO1xuIiwidmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJy4uL2V2ZW50cy9ldmVudEVtaXR0ZXInKSxcbiAgICBQbHVnaW5NYW5hZ2VyID0gcmVxdWlyZSgnLi9wbHVnaW5NYW5hZ2VyJyk7XG5cbi8qKlxuICogQGNsYXNzIEx1Yy5jb21wb3NpdGlvbkVudW1zXG4gKiBDb21wb3NpdGlvbiBlbnVtcyBhcmUganVzdCBjb21tb24gY29uZmlnIG9iamVjdHMgZm9yIEx1Yy5Db21wb3NpdGlvbi5cbiAqIEhlcmUgaXMgYW4gZXhhbXBsZSBvZiBhIGNvbXBvc2l0aW9uIHRoYXQgdXNlcyBFdmVudEVtaXR0ZXIgYnV0IG9ubHlcbiAqIHB1dHMgdGhlIGVtaXQgbWV0aG9kIG9uIHRoZSBwcm90b3R5cGUuXG4gKlxuICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgICRjb21wb3NpdGlvbnM6IHtcbiAgICAgICAgICAgIGRlZmF1bHRzOiBMdWMuY29tcG9zaXRpb25FbnVtcy5FdmVudEVtaXR0ZXIsXG4gICAgICAgICAgICBtZXRob2RzOiBbJ2VtaXQnXVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB2YXIgYyA9IG5ldyBDKCk7XG5cbiAgICB0eXBlb2YgYy5lbWl0XG4gICAgPlwiZnVuY3Rpb25cIlxuICAgIHR5cGVvZiBjLm9uXG4gICAgXCJ1bmRlZmluZWRcIlxuICogXG4gKi9cblxuLyoqXG4gKiBAcHJvcGVydHkge09iamVjdH0gRXZlbnRFbWl0dGVyXG4gKi9cbm1vZHVsZS5leHBvcnRzLkV2ZW50RW1pdHRlciA9IHtcbiAgICBDb25zdHJ1Y3RvcjogRXZlbnRFbWl0dGVyLFxuICAgIG5hbWU6ICdlbWl0dGVyJyxcbiAgICBtZXRob2RzOiAnYWxsTWV0aG9kcydcbn07XG5cblxuLyoqXG4gKiBAcHJvcGVydHkge09iamVjdH0gUGx1Z2luTWFuYWdlclxuICovXG5tb2R1bGUuZXhwb3J0cy5QbHVnaW5NYW5hZ2VyID0ge1xuICAgIG5hbWU6ICdwbHVnaW5zJyxcbiAgICBpbml0QWZ0ZXI6IHRydWUsXG4gICAgQ29uc3RydWN0b3I6IFBsdWdpbk1hbmFnZXIsXG4gICAgY3JlYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzLkNvbnN0cnVjdG9yKHtcbiAgICAgICAgICAgIGluc3RhbmNlOiB0aGlzLmluc3RhbmNlLFxuICAgICAgICAgICAgaW5zdGFuY2VBcmdzOiB0aGlzLmluc3RhbmNlQXJnc1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGlnbm9yZU1ldGhvZHM6ICdkZWZhdWx0UGx1Z2luJyxcbiAgICBtZXRob2RzOiAncHVibGljTWV0aG9kcydcbn07IiwidmFyIFBsdWdpbiA9IHJlcXVpcmUoJy4vcGx1Z2luJyksXG4gICAgaXMgPSByZXF1aXJlKCcuLi9pcycpLFxuICAgIG9iaiA9IHJlcXVpcmUoJy4uL29iamVjdCcpLFxuICAgIGFyciA9IHJlcXVpcmUoJy4uL2FycmF5JyksXG4gICAgYUVhY2ggPSBhcnIuZWFjaCxcbiAgICBtaXggPSBvYmoubWl4LFxuICAgIGFwcGx5ID0gb2JqLmFwcGx5O1xuXG5mdW5jdGlvbiBQbHVnaW5NYW5hZ2VyKGNvbmZpZykge1xuICAgIHRoaXMuX2luaXQoY29uZmlnKTtcbn1cblxuLyoqXG4gKiBAcHJvdGVjdGVkXG4gKiBAY2xhc3MgTHVjLlBsdWdpbk1hbmFnZXJcbiAqIFRoaXMgY2xhc3MgaXMgdXNlZCBieSBMdWMuY29tcG9zaXRpb25FbnVtcyNQbHVnaW5NYW5hZ2VyIHRvIGFkZCBpdHMgZnVuY3Rpb25hbGl0eSBcbiAqIHRvIGFueSBjbGFzcy4gICBCeSB7QGxpbmsgTHVjLmNvbXBvc2l0aW9uRW51bXMjUGx1Z2luTWFuYWdlciBkZWZhdWx0fSBpdCBhZGRzXG4gKiBhbGwgb2YgdGhlc2UgcHVibGljIG1ldGhvZHMgdG8gdGhlIGluc3RhbmNlLlRoaXMgY2xhc3MgaXMgZGVzaWduZWQgdG8gd29yayBhcyBhIGNvbXBvc2l0aW9uLCBcbiAqIGl0IGlzIGV4cG9zZWQgYXMgbm90IHByaXZhdGUgc28gaXQgY2FuIGJlIGV4dGVuZGVkIGlmIG5lZWRlZC4gICBDaGVjayBcInByb3RlY3RlZFwiIHdoaWNoXG4gKiBpcyBhIHBhcnQgb2YgdGhlIFNob3cgdiBkcm9wZG93biBvbiB0aGUgcmlnaHQgdG8gc2VlIHRoZSBwcm90ZWN0ZWQgbWV0aG9kcy5cbiAqXG4gICAgZnVuY3Rpb24gTXlQbHVnaW4oKSB7XG4gICAgICAgIHRoaXMubXlDb29sTmFtZSA9ICdjb28nO1xuXG4gICAgICAgIHRoaXMuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2ltIGdldHRpbmcgaW5pdHRlZCcpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ015UGx1Z2luIGluc3RhbmNlIGJlaW5nIGRlc3Ryb3llZCcpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgQyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICAkY29tcG9zaXRpb25zOiBMdWMuY29tcG9zaXRpb25FbnVtcy5QbHVnaW5NYW5hZ2VyXG4gICAgfSk7XG5cbiAgICB2YXIgYyA9IG5ldyBDKHtcbiAgICAgICAgcGx1Z2luczogW3tcbiAgICAgICAgICAgICAgICBDb25zdHJ1Y3RvcjogTXlQbHVnaW4sXG4gICAgICAgICAgICAgICAgbXlDb29sTmFtZTogJ2NvbydcbiAgICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgIH0pO1xuXG4gICAgPmltIGdldHRpbmcgaW5pdHRlZFxuXG4gICAgdmFyIHBsdWdJbnN0YW5jZSA9IGMuYWRkUGx1Z2luKHtcbiAgICAgICAgZGVzdHJveTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnSW0gZ2V0dGluZyBkZXN0cm95ZWQnKVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBjLmdldFBsdWdpbihMdWMuUGx1Z2luKVxuICAgID4gUGx1Z2luIHtkZXN0cm95OiBmdW5jdGlvbiwgb3duZXI6IE15Q2xhc3MsIGluaXQ6IGZ1bmN0aW9uLCBkZXN0cm95OiBmdW5jdGlvbn1cblxuICAgIGMuZ2V0UGx1Z2luKE15UGx1Z2luKVxuICAgID4gTXlQbHVnaW4ge215Q29vbE5hbWU6IFwiY29vXCIsIGluaXQ6IGZ1bmN0aW9uLCBkZXN0cm95OiBmdW5jdGlvbn1cblxuICAgIGMuZGVzdHJveUFsbFBsdWdpbnMoKVxuXG4gICAgPk15UGx1Z2luIGluc3RhbmNlIGJlaW5nIGRlc3Ryb3llZFxuICAgID5JbSBnZXR0aW5nIGRlc3Ryb3llZFxuXG4gICAgYy5nZXRQbHVnaW4oTXlQbHVnaW4pXG4gICAgPmZhbHNlXG5cbiAqL1xuUGx1Z2luTWFuYWdlci5wcm90b3R5cGUgPSB7XG4gICAvKipcbiAgICAqIEBjZmcge0NvbnN0cnVjdG9yfSBkZWZhdWx0UGx1Z2luXG4gICAgKi9cbiAgICBkZWZhdWx0UGx1Z2luOiBQbHVnaW4sXG5cbiAgICAvKipcbiAgICAgKiBAcHJvdGVjdGVkXG4gICAgICovXG4gICAgX2luaXQ6IGZ1bmN0aW9uKGluc3RhbmNlVmFsdWVzKSB7XG4gICAgICAgIGFwcGx5KHRoaXMsIGluc3RhbmNlVmFsdWVzKTtcbiAgICAgICAgdGhpcy5wbHVnaW5zID0gW107XG4gICAgICAgIHRoaXMuX2NyZWF0ZVBsdWdpbnMoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHByb3RlY3RlZFxuICAgICAqL1xuICAgIF9jcmVhdGVQbHVnaW5zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgYUVhY2godGhpcy5fZ2V0UGx1Z2luQ29uZmlnRnJvbUluc3RhbmNlKCksIGZ1bmN0aW9uKHBsdWdpbkNvbmZpZykge1xuICAgICAgICAgICAgdGhpcy5hZGRQbHVnaW4ocGx1Z2luQ29uZmlnKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgKi9cbiAgICBfZ2V0UGx1Z2luQ29uZmlnRnJvbUluc3RhbmNlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGNvbmZpZyA9IHRoaXMuaW5zdGFuY2VBcmdzWzBdIHx8IHt9O1xuICAgICAgICByZXR1cm4gY29uZmlnLnBsdWdpbnM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZCBhIHBsdWdpbiB0byB0aGUgaW5zdGFuY2UgYW5kIGluaXQgdGhlIFxuICAgICAqIHBsdWdpbi5cbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9IHBsdWdpbkNvbmZpZ1xuICAgICAqIEByZXR1cm4ge09iamVjdH0gdGhlIGNyZWF0ZWQgcGx1Z2luIGluc3RhbmNlXG4gICAgICovXG4gICAgYWRkUGx1Z2luOiBmdW5jdGlvbihwbHVnaW5Db25maWcpIHtcbiAgICAgICAgdmFyIHBsdWdpbkluc3RhbmNlID0gdGhpcy5fY3JlYXRlUGx1Z2luKHBsdWdpbkNvbmZpZyk7XG5cbiAgICAgICAgdGhpcy5faW5pdFBsdWdpbihwbHVnaW5JbnN0YW5jZSk7XG5cbiAgICAgICAgdGhpcy5wbHVnaW5zLnB1c2gocGx1Z2luSW5zdGFuY2UpO1xuXG4gICAgICAgIHJldHVybiBwbHVnaW5JbnN0YW5jZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHByb3RlY3RlZFxuICAgICAqL1xuICAgIF9jcmVhdGVQbHVnaW46IGZ1bmN0aW9uKGNvbmZpZykge1xuICAgICAgICBjb25maWcub3duZXIgPSB0aGlzLmluc3RhbmNlO1xuXG4gICAgICAgIGlmIChjb25maWcuQ29uc3RydWN0b3IpIHtcbiAgICAgICAgICAgIC8vY2FsbCB0aGUgY29uZmlnZWQgQ29uc3RydWN0b3Igd2l0aCB0aGUgXG4gICAgICAgICAgICAvL3Bhc3NlZCBpbiBjb25maWcgYnV0IHRha2Ugb2ZmIHRoZSBDb25zdHJ1Y3RvclxuICAgICAgICAgICAgLy9jb25maWcuXG4gICAgICAgICAgICAgXG4gICAgICAgICAgICAvL1RoZSBwbHVnaW4gQ29uc3RydWN0b3IgXG4gICAgICAgICAgICAvL3Nob3VsZCBub3QgbmVlZCB0byBrbm93IGFib3V0IGl0c2VsZlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBjb25maWcuQ29uc3RydWN0b3IoYXBwbHkoY29uZmlnLCB7XG4gICAgICAgICAgICAgICAgQ29uc3RydWN0b3I6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzLmRlZmF1bHRQbHVnaW4oY29uZmlnKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHByb3RlY3RlZFxuICAgICAqL1xuICAgIF9pbml0UGx1Z2luOiBmdW5jdGlvbihwbHVnaW4pIHtcbiAgICAgICAgaWYgKGlzLmlzRnVuY3Rpb24ocGx1Z2luLmluaXQpKSB7XG4gICAgICAgICAgICBwbHVnaW4uaW5pdCh0aGlzLmluc3RhbmNlKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDYWxsIGRlc3Ryb3kgb24gYWxsIG9mIHRoZSBwbHVnaW5zXG4gICAgICogYW5kIHJlbW92ZSB0aGVtLlxuICAgICAqL1xuICAgIGRlc3Ryb3lBbGxQbHVnaW5zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5wbHVnaW5zLmZvckVhY2goZnVuY3Rpb24ocGx1Z2luKSB7XG4gICAgICAgICAgICB0aGlzLl9kZXN0cm95UGx1Z2luKHBsdWdpbik7XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIHRoaXMucGx1Z2lucyA9IFtdO1xuICAgIH0sXG5cbiAgICBfZGVzdHJveVBsdWdpbjogZnVuY3Rpb24ocGx1Z2luKSB7XG4gICAgICAgIGlmIChpcy5pc0Z1bmN0aW9uKHBsdWdpbi5kZXN0cm95KSkge1xuICAgICAgICAgICAgcGx1Z2luLmRlc3Ryb3kodGhpcy5pbnN0YW5jZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIHRoZSBwbHVnaW4gYW5kIGlmIGZvdW5kIGRlc3Ryb3kgaXQuXG4gICAgICogQHBhcmFtICB7T2JqZWN0L0NvbnN0cnVjdG9yfSBvYmplY3QgdG8gdXNlIHRvIG1hdGNoIFxuICAgICAqIHRoZSBwbHVnaW4gdG8gcmVtb3ZlLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gdGhlIGRlc3Ryb3llZCBwbHVnaW4uXG4gICAgICovXG4gICAgZGVzdHJveVBsdWdpbjogZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgIHZhciBwbHVnaW4gPSB0aGlzLmdldFBsdWdpbihvYmopO1xuXG4gICAgICAgIGlmKHBsdWdpbikge1xuICAgICAgICAgICAgdGhpcy5fZGVzdHJveVBsdWdpbihwbHVnaW4pO1xuICAgICAgICAgICAgYXJyLnJlbW92ZUZpcnN0KHRoaXMucGx1Z2lucywgcGx1Z2luLCB7dHlwZTogJ3N0cmljdCd9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwbHVnaW47XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBhIHBsdWdpbiBpbnN0YW5jZS4gIEEgQ29uc3RydWN0b3Igb3IgYW4gb2JqZWN0IGNhbiBiZSB1c2VkXG4gICAgICogdG8gZmluZCBhIHBsdWdpbi5cbiAgICAgKlxuICAgICAgICAgIGMuYWRkUGx1Z2luKHthOjF9KVxuICAgICAgICAgIGMuZ2V0UGx1Z2luKHthOjF9KVxuICAgICAgICAgID5MdWMuUGx1Z2luKHthOjF9KVxuXG4gICAgICogQHBhcmFtICB7T2JqZWN0fSBvYmogXG4gICAgICogQHJldHVybiB7T2JqZWN0fSB0aGUgcGx1Z2luIGluc3RhbmNlIGlmIGZvdW5kLlxuICAgICAqL1xuICAgIGdldFBsdWdpbjogZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgIGlmIChpcy5pc0Z1bmN0aW9uKG9iaikpIHtcbiAgICAgICAgICAgIHJldHVybiBhcnIuZmluZEZpcnN0SW5zdGFuY2VPZih0aGlzLnBsdWdpbnMsIG9iaik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFyci5maW5kRmlyc3QodGhpcy5wbHVnaW5zLCBvYmosIHt0eXBlOiAnbG9vc2UnfSk7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQbHVnaW5NYW5hZ2VyOyIsInZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG4vKipcbiAqIEBsaWNlbnNlIGh0dHBzOi8vcmF3LmdpdGh1Yi5jb20vam95ZW50L25vZGUvdjAuMTAuMTEvTElDRU5TRVxuICogTm9kZSBqcyBsaWNlbnNlLiBFdmVudEVtaXR0ZXIgd2lsbCBiZSBpbiB0aGUgY2xpZW50XG4gKiBvbmx5IGNvZGUuXG4gKi9cbi8qKlxuICogQGNsYXNzIEx1Yy5FdmVudEVtaXR0ZXJcbiAqIFRoZSB3b25kZXJmdWwgZXZlbnQgZW1taXRlciB0aGF0IGNvbWVzIHdpdGggbm9kZSxcbiAqIHRoYXQgd29ya3MgaW4gdGhlIHN1cHBvcnRlZCBicm93c2Vycy5cbiAqIFtodHRwOi8vbm9kZWpzLm9yZy9hcGkvZXZlbnRzLmh0bWxdKGh0dHA6Ly9ub2RlanMub3JnL2FwaS9ldmVudHMuaHRtbClcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgICAvL3B1dCBpbiBmaXggZm9yIElFIDkgYW5kIGJlbG93XG4gICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICBnID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzZWxmLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuICAgICAgICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcblxuICAgIHNlbGYub24odHlwZSwgZyk7XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyOyIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnByb2Nlc3MubmV4dFRpY2sgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYW5TZXRJbW1lZGlhdGUgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5zZXRJbW1lZGlhdGU7XG4gICAgdmFyIGNhblBvc3QgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5wb3N0TWVzc2FnZSAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lclxuICAgIDtcblxuICAgIGlmIChjYW5TZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiB3aW5kb3cuc2V0SW1tZWRpYXRlKGYpIH07XG4gICAgfVxuXG4gICAgaWYgKGNhblBvc3QpIHtcbiAgICAgICAgdmFyIHF1ZXVlID0gW107XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICBpZiAoZXYuc291cmNlID09PSB3aW5kb3cgJiYgZXYuZGF0YSA9PT0gJ3Byb2Nlc3MtdGljaycpIHtcbiAgICAgICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBpZiAocXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZm4gPSBxdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICBmbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgICAgICBxdWV1ZS5wdXNoKGZuKTtcbiAgICAgICAgICAgIHdpbmRvdy5wb3N0TWVzc2FnZSgncHJvY2Vzcy10aWNrJywgJyonKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgc2V0VGltZW91dChmbiwgMCk7XG4gICAgfTtcbn0pKCk7XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn1cblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuIiwidmFyIHByb2Nlc3M9cmVxdWlyZShcIl9fYnJvd3NlcmlmeV9wcm9jZXNzXCIpO2lmICghcHJvY2Vzcy5FdmVudEVtaXR0ZXIpIHByb2Nlc3MuRXZlbnRFbWl0dGVyID0gZnVuY3Rpb24gKCkge307XG5cbnZhciBFdmVudEVtaXR0ZXIgPSBleHBvcnRzLkV2ZW50RW1pdHRlciA9IHByb2Nlc3MuRXZlbnRFbWl0dGVyO1xudmFyIGlzQXJyYXkgPSB0eXBlb2YgQXJyYXkuaXNBcnJheSA9PT0gJ2Z1bmN0aW9uJ1xuICAgID8gQXJyYXkuaXNBcnJheVxuICAgIDogZnVuY3Rpb24gKHhzKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeHMpID09PSAnW29iamVjdCBBcnJheV0nXG4gICAgfVxuO1xuZnVuY3Rpb24gaW5kZXhPZiAoeHMsIHgpIHtcbiAgICBpZiAoeHMuaW5kZXhPZikgcmV0dXJuIHhzLmluZGV4T2YoeCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoeCA9PT0geHNbaV0pIHJldHVybiBpO1xuICAgIH1cbiAgICByZXR1cm4gLTE7XG59XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW5cbi8vIDEwIGxpc3RlbmVycyBhcmUgYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaFxuLy8gaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG4vL1xuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbnZhciBkZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCF0aGlzLl9ldmVudHMpIHRoaXMuX2V2ZW50cyA9IHt9O1xuICB0aGlzLl9ldmVudHMubWF4TGlzdGVuZXJzID0gbjtcbn07XG5cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNBcnJheSh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSlcbiAgICB7XG4gICAgICBpZiAoYXJndW1lbnRzWzFdIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgYXJndW1lbnRzWzFdOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5jYXVnaHQsIHVuc3BlY2lmaWVkICdlcnJvcicgZXZlbnQuXCIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGlmICghdGhpcy5fZXZlbnRzKSByZXR1cm4gZmFsc2U7XG4gIHZhciBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBpZiAoIWhhbmRsZXIpIHJldHVybiBmYWxzZTtcblxuICBpZiAodHlwZW9mIGhhbmRsZXIgPT0gJ2Z1bmN0aW9uJykge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuXG4gIH0gZWxzZSBpZiAoaXNBcnJheShoYW5kbGVyKSkge1xuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICAgIHZhciBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBsaXN0ZW5lcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59O1xuXG4vLyBFdmVudEVtaXR0ZXIgaXMgZGVmaW5lZCBpbiBzcmMvbm9kZV9ldmVudHMuY2Ncbi8vIEV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCgpIGlzIGFsc28gZGVmaW5lZCB0aGVyZS5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIGxpc3RlbmVyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdhZGRMaXN0ZW5lciBvbmx5IHRha2VzIGluc3RhbmNlcyBvZiBGdW5jdGlvbicpO1xuICB9XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT0gXCJuZXdMaXN0ZW5lcnNcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJzXCIuXG4gIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pIHtcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgfSBlbHNlIGlmIChpc0FycmF5KHRoaXMuX2V2ZW50c1t0eXBlXSkpIHtcblxuICAgIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gICAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgICB2YXIgbTtcbiAgICAgIGlmICh0aGlzLl9ldmVudHMubWF4TGlzdGVuZXJzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbSA9IHRoaXMuX2V2ZW50cy5tYXhMaXN0ZW5lcnM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtID0gZGVmYXVsdE1heExpc3RlbmVycztcbiAgICAgIH1cblxuICAgICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHNlbGYub24odHlwZSwgZnVuY3Rpb24gZygpIHtcbiAgICBzZWxmLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0pO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICgnZnVuY3Rpb24nICE9PSB0eXBlb2YgbGlzdGVuZXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3JlbW92ZUxpc3RlbmVyIG9ubHkgdGFrZXMgaW5zdGFuY2VzIG9mIEZ1bmN0aW9uJyk7XG4gIH1cblxuICAvLyBkb2VzIG5vdCB1c2UgbGlzdGVuZXJzKCksIHNvIG5vIHNpZGUgZWZmZWN0IG9mIGNyZWF0aW5nIF9ldmVudHNbdHlwZV1cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSkgcmV0dXJuIHRoaXM7XG5cbiAgdmFyIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzQXJyYXkobGlzdCkpIHtcbiAgICB2YXIgaSA9IGluZGV4T2YobGlzdCwgbGlzdGVuZXIpO1xuICAgIGlmIChpIDwgMCkgcmV0dXJuIHRoaXM7XG4gICAgbGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgaWYgKGxpc3QubGVuZ3RoID09IDApXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICB9IGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSA9PT0gbGlzdGVuZXIpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGRvZXMgbm90IHVzZSBsaXN0ZW5lcnMoKSwgc28gbm8gc2lkZSBlZmZlY3Qgb2YgY3JlYXRpbmcgX2V2ZW50c1t0eXBlXVxuICBpZiAodHlwZSAmJiB0aGlzLl9ldmVudHMgJiYgdGhpcy5fZXZlbnRzW3R5cGVdKSB0aGlzLl9ldmVudHNbdHlwZV0gPSBudWxsO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICBpZiAoIXRoaXMuX2V2ZW50cykgdGhpcy5fZXZlbnRzID0ge307XG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKSB0aGlzLl9ldmVudHNbdHlwZV0gPSBbXTtcbiAgaWYgKCFpc0FycmF5KHRoaXMuX2V2ZW50c1t0eXBlXSkpIHtcbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgfVxuICByZXR1cm4gdGhpcy5fZXZlbnRzW3R5cGVdO1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghZW1pdHRlci5fZXZlbnRzIHx8ICFlbWl0dGVyLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gMDtcbiAgZWxzZSBpZiAodHlwZW9mIGVtaXR0ZXIuX2V2ZW50c1t0eXBlXSA9PT0gJ2Z1bmN0aW9uJylcbiAgICByZXQgPSAxO1xuICBlbHNlXG4gICAgcmV0ID0gZW1pdHRlci5fZXZlbnRzW3R5cGVdLmxlbmd0aDtcbiAgcmV0dXJuIHJldDtcbn07XG4iLCJ2YXIgb2JqID0gcmVxdWlyZSgnLi4vb2JqZWN0JyksXG4gICAgYXJyYXkgPSByZXF1aXJlKCcuLi9hcnJheScpLFxuICAgIGFwcGx5ID0gb2JqLmFwcGx5LFxuICAgIG1peCA9IG9iai5taXgsXG4gICAgb0ZpbHRlciA9IG9iai5maWx0ZXIsXG4gICAgZW1wdHlGbiA9ICgnLi4vZnVuY3Rpb24nKS5lbXB0eUZuLFxuICAgIGlzID0gcmVxdWlyZSgnLi4vaXMnKTtcblxuLyoqXG4gKiBAY2xhc3MgIEx1Yy5Db21wb3NpdGlvblxuICogQHByb3RlY3RlZFxuICogQ2xhc3MgdGhhdCB3cmFwcyB7QGxpbmsgTHVjLmRlZmluZSMkY29tcG9zaXRpb25zIGNvbXBvc2l0aW9ufSBjb25maWcgb2JqZWN0c1xuICogdG8gY29uZm9ybSB0byBhbiBhcGkuIFRoaXMgY2xhc3MgaXMgbm90IGF2YWlsYWJsZSBleHRlcm5hbGx5LiAgVGhlIGNvbmZpZyBvYmplY3RcbiAqIHdpbGwgb3ZlcnJpZGUgYW55IHByb3RlY3RlZCBtZXRob2RzIGFuZCBkZWZhdWx0IGNvbmZpZ3MuICBEZWZhdWx0c1xuICogY2FuIGJlIHVzZWQgZm9yIG9mdGVuIHVzZWQgY29uZmlncywga2V5cyB0aGF0IGFyZSBub3QgZGVmYXVsdHMgd2lsbFxuICogb3ZlcnJpZGUgdGhlIGRlZmF1bHRzLlxuICpcbiAgICB2YXIgQyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICAkY29tcG9zaXRpb25zOiB7XG4gICAgICAgICAgICBkZWZhdWx0czogTHVjLmNvbXBvc2l0aW9uRW51bXMuRXZlbnRFbWl0dGVyLFxuICAgICAgICAgICAgbWV0aG9kczogWydlbWl0J11cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIGMgPSBuZXcgQygpXG4gICAgdHlwZW9mIGMuZW1pdFxuICAgID5cImZ1bmN0aW9uXCJcbiAgICB0eXBlb2YgYy5vblxuICAgID5cInVuZGVmaW5lZFwiXG4gKlxuICogSWYgeW91IHdhbnQgdG8gYWRkIHlvdXIgb3duIGNvbXBvc2l0aW9uIGFsbCB5b3UgbmVlZCB0byBoYXZlIGlzXG4gKiBhIG5hbWUgYW5kIGEgQ29uc3RydWN0b3IsIHRoZSByZXN0IG9mIHRoZSBjb25maWdzIG9mIHRoaXMgY2xhc3MgYW5kIEx1Yy5Db21wb3NpdGlvbi5jcmVhdGVcbiAqIGNhbiBiZSB1c2VkIHRvIGluamVjdCBiZWhhdmlvciBpZiBuZWVkZWQuXG4gKiBcbiAgICAgZnVuY3Rpb24gQ291bnRlcigpIHtcbiAgICAgICAgdGhpcy5jb3VudCA9IDA7XG4gICAgIH07XG5cbiAgICAgQ291bnRlci5wcm90b3R5cGUgPSB7XG4gICAgICAgIGdldENvdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvdW50O1xuICAgICAgICB9LFxuICAgICAgICBpbmNyZWFzZUNvdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuY291bnQrKztcbiAgICAgICAgfVxuICAgICB9XG5cbiAgICAgdmFyIEMgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgICAgICRjb21wb3NpdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnY291bnRlcicsXG4gICAgICAgICAgICAgICAgQ29uc3RydWN0b3I6IENvdW50ZXIsXG4gICAgICAgICAgICAgICAgbWV0aG9kczogJ2FsbE1ldGhvZHMnXG4gICAgICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB2YXIgYyA9IG5ldyBDKClcblxuICAgIGMuaW5jcmVhc2VDb3VudCgpO1xuICAgIGMuaW5jcmVhc2VDb3VudCgpO1xuICAgIGMuaW5jcmVhc2VDb3VudCgpO1xuICAgIGMuZ2V0Q291bnQoKTtcbiAgICA+M1xuICAgIGMuY291bnRcbiAgICA+dW5kZWZpbmVkXG4gKi9cbmZ1bmN0aW9uIENvbXBvc2l0aW9uKGMpIHtcbiAgICB2YXIgZGVmYXVsdHMgPSBjLmRlZmF1bHRzLFxuICAgICAgICBjb25maWcgPSBjO1xuXG4gICAgaWYoZGVmYXVsdHMpIHtcbiAgICAgICAgbWl4KGNvbmZpZywgY29uZmlnLmRlZmF1bHRzKTtcbiAgICAgICAgZGVsZXRlIGNvbmZpZy5kZWZhdWx0cztcbiAgICB9XG5cbiAgICBhcHBseSh0aGlzLCBjb25maWcpO1xufVxuXG5Db21wb3NpdGlvbi5wcm90b3R5cGUgPSB7XG4gICAgLyoqXG4gICAgICogQGNmZyB7U3RyaW5nfSBuYW1lIChyZXF1aXJlZCkgdGhlIG5hbWUgd2hpY2ggdGhlIGNvbXBvc2l0aW9uXG4gICAgICogd2lsbCBiZSByZWZlcnJlZCB0byBieSB0aGUgaW5zdGFuY2UuXG4gICAgICovXG4gICAgXG4gICAgLyoqXG4gICAgICogQGNmZyB7T2JqZWN0fSBkZWZhdWx0c1xuICAgICAqL1xuICAgIFxuICAgIC8qKlxuICAgICAqIEBjZmcge0Jvb2xlYW59IGluaXRBZnRlciAgZGVmYXVsdHMgdG8gZmFsc2VcbiAgICAgKiBwYXNzIGluIHRydWUgdG8gaW5pdCB0aGUgY29tcG9zaXRpb24gaW5zdGFuY2UgYWZ0ZXIgdGhlIFxuICAgICAqIHN1cGVyY2xhc3MgaGFzIGJlZW4gY2FsbGVkLlxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogQGNmZyB7RnVuY3Rpb259IENvbnN0cnVjdG9yIChyZXF1aXJlZCkgdGhlIENvbnN0cnVjdG9yXG4gICAgICogdG8gdXNlIHdoZW4gY3JlYXRpbmcgdGhlIGNvbXBvc2l0aW9uIGluc3RhbmNlLiAgVGhpc1xuICAgICAqIGlzIHJlcXVpcmVkIGlmIEx1Yy5Db21wb3NpdGlvbi5jcmVhdGUgaXMgbm90IG92ZXJ3cml0dGVuIGJ5XG4gICAgICogdGhlIHBhc3NlZCBpbiBjb21wb3NpdGlvbiBjb25maWcgb2JqZWN0LlxuICAgICAqL1xuICAgIFxuICAgIC8qKlxuICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgKiBCeSBkZWZhdWx0IGp1c3QgcmV0dXJuIGEgbmV3bHkgY3JlYXRlZCBDb25zdHJ1Y3RvciBpbnN0YW5jZS5cbiAgICAgKiBcbiAgICAgKiBXaGVuIGNyZWF0ZSBpcyBjYWxsZWQgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzIGNhbiBiZSB1c2VkIDpcbiAgICAgKiBcbiAgICAgKiB0aGlzLmluc3RhbmNlIFRoZSBpbnN0YW5jZSB0aGF0IGlzIGNyZWF0aW5nXG4gICAgICogdGhlIGNvbXBvc2l0aW9uLlxuICAgICAqIFxuICAgICAqIHRoaXMuQ29uc3RydWN0b3IgdGhlIGNvbnN0cnVjdG9yIHRoYXQgaXMgcGFzc2VkIGluIGZyb21cbiAgICAgKiB0aGUgY29tcG9zaXRpb24gY29uZmlnLiBcbiAgICAgKlxuICAgICAqIHRoaXMuaW5zdGFuY2VBcmdzIHRoZSBhcmd1bWVudHMgcGFzc2VkIGludG8gdGhlIGluc3RhbmNlIHdoZW4gaXQgXG4gICAgICogaXMgYmVpbmcgY3JlYXRlZC4gIEZvciBleGFtcGxlXG5cbiAgICAgICAgbmV3IE15Q2xhc3NXaXRoQUNvbXBvc2l0aW9uKHtwbHVnaW5zOiBbXX0pXG4gICAgICAgIC8vaW5zaWRlIG9mIHRoZSBjcmVhdGUgbWV0aG9kXG4gICAgICAgIHRoaXMuaW5zdGFuY2VBcmdzXG4gICAgICAgID5be3BsdWdpbnM6IFtdfV1cblxuICAgICAqIEByZXR1cm4ge09iamVjdH0gXG4gICAgICogdGhlIGNvbXBvc2l0aW9uIGluc3RhbmNlLlxuICAgICAqXG4gICAgICogRm9yIGV4YW1wbGUgc2V0IHRoZSBlbWl0dGVycyBtYXhMaXN0ZW5lcnNcbiAgICAgKiB0byB3aGF0IHRoZSBpbnN0YW5jZSBoYXMgY29uZmlnZWQuXG4gICAgICBcbiAgICAgICAgbWF4TGlzdGVuZXJzOiAxMDAsXG4gICAgICAgICRjb21wb3NpdGlvbnM6IHtcbiAgICAgICAgICAgIENvbnN0cnVjdG9yOiBMdWMuRXZlbnRFbWl0dGVyLFxuICAgICAgICAgICAgY3JlYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgZW1pdHRlciA9IG5ldyB0aGlzLkNvbnN0cnVjdG9yKCk7XG4gICAgICAgICAgICAgICAgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnModGhpcy5pbnN0YW5jZS5tYXhMaXN0ZW5lcnMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBlbWl0dGVyO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG5hbWU6ICdlbWl0dGVyJ1xuICAgICAgICB9XG5cbiAgICAgKi9cbiAgICBjcmVhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbmV3IHRoaXMuQ29uc3RydWN0b3IoKTtcbiAgICB9LFxuXG4gICAgZ2V0SW5zdGFuY2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGUoKTtcbiAgICB9LFxuXG4gICAgdmFsaWRhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZih0aGlzLm5hbWUgID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQSBuYW1lIG11c3QgYmUgZGVmaW5lZCcpO1xuICAgICAgICB9XG4gICAgICAgIGlmKCFpcy5pc0Z1bmN0aW9uKHRoaXMuQ29uc3RydWN0b3IpICYmIHRoaXMuY3JlYXRlID09PSBDb21wb3NpdGlvbi5wcm90b3R5cGUuY3JlYXRlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBDb25zdHJ1Y3RvciBtdXN0IGJlIGZ1bmN0aW9uIGlmIGNyZWF0ZSBpcyBub3Qgb3ZlcnJpZGRlbicpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSBmaWx0ZXJNZXRob2RGbnNcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBwcm9wZXJ0eSBmaWx0ZXJNZXRob2RGbnMuYWxsTWV0aG9kcyByZXR1cm4gYWxsIG1ldGhvZHMgZnJvbSB0aGVcbiAgICAgKiBjb25zdHJ1Y3RvcnMgcHJvdG90eXBlXG4gICAgICogQHByb3BlcnR5IGZpbHRlck1ldGhvZEZucy5wdWJsaWMgcmV0dXJuIGFsbCBtZXRob2RzIHRoYXQgZG9uJ3RcbiAgICAgKiBzdGFydCB3aXRoIF8uICBXZSBrbm93IG5vdCBldmVyeW9uZSBmb2xsb3dzIHRoaXMgY29udmVudGlvbiwgYnV0IHdlXG4gICAgICogZG8gYW5kIHNvIGRvIG1hbnkgb3RoZXJzLlxuICAgICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICAgKi9cbiAgICBmaWx0ZXJNZXRob2RGbnM6IHtcbiAgICAgICAgYWxsTWV0aG9kczogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGlzLmlzRnVuY3Rpb24odmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBwdWJsaWNNZXRob2RzOiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gaXMuaXNGdW5jdGlvbih2YWx1ZSkgJiYga2V5LmNoYXJBdCgwKSAhPT0gJ18nO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBjZmcge0Z1bmN0aW9uL1N0cmluZy9BcnJheVtdfSBtZXRob2RzXG4gICAgICogVGhlIGtleXMgdG8gYWRkIHRvIHRoZSBkZWZpbmVycyBwcm90b3R5cGUgdGhhdCB3aWxsIGluIHR1cm4gY2FsbFxuICAgICAqIHRoZSBjb21wb3NpdGlvbnMgbWV0aG9kLlxuICAgICAqIFxuICAgICAqIERlZmF1bHRzIHRvIEx1Yy5lbXB0eUZuLiBcbiAgICAgKiBJZiBhbiBhcnJheSBpcyBwYXNzZWQgaXQgd2lsbCBqdXN0IHVzZSB0aGF0IEFycmF5LlxuICAgICAqIFxuICAgICAqIElmIGEgc3RyaW5nIGlzIHBhc3NlZCBhbmQgbWF0Y2hlcyBhIG1ldGhvZCBmcm9tIFxuICAgICAqIEx1Yy5Db21wb3NpdGlvbi5maWx0ZXJNZXRob2RGbnMgaXQgd2lsbCBjYWxsIHRoYXQgaW5zdGVhZC5cbiAgICAgKiBcbiAgICAgKiBJZiBhIGZ1bmN0aW9uIGlzIGRlZmluZWQgaXRcbiAgICAgKiB3aWxsIGdldCBjYWxsZWQgd2hpbGUgaXRlcmF0aW5nIG92ZXIgZWFjaCBrZXkgdmFsdWUgcGFpciBvZiB0aGUgXG4gICAgICogQ29uc3RydWN0b3IncyBwcm90b3R5cGUsIGlmIGEgdHJ1dGh5IHZhbHVlIGlzIFxuICAgICAqIHJldHVybmVkIHRoZSBwcm9wZXJ0eSB3aWxsIGJlIGFkZGVkIHRvIHRoZSBkZWZpbmluZ1xuICAgICAqIGNsYXNzZXMgcHJvdG90eXBlLlxuICAgICAqIFxuICAgICAqIEZvciBleGFtcGxlIHRoaXMgY29uZmlnIHdpbGwgb25seSBleHBvc2UgdGhlIGVtaXQgbWV0aG9kIFxuICAgICAqIHRvIHRoZSBkZWZpbmluZyBjbGFzc1xuICAgICBcbiAgICAgICAgJGNvbXBvc2l0aW9uczoge1xuICAgICAgICAgICAgQ29uc3RydWN0b3I6IEx1Yy5FdmVudEVtaXR0ZXIsXG4gICAgICAgICAgICBtZXRob2RzOiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGtleSA9PT0gJ2VtaXQnO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG5hbWU6ICdlbWl0dGVyJ1xuICAgICAgICB9XG4gICAgICogdGhpcyBpcyBhbHNvIGEgdmFsaWQgY29uZmlnXG4gICAgICogXG4gICAgICAgICRjb21wb3NpdGlvbnM6IHtcbiAgICAgICAgICAgIENvbnN0cnVjdG9yOiBMdWMuRXZlbnRFbWl0dGVyLFxuICAgICAgICAgICAgbWV0aG9kczogWydlbWl0dGVyJ10sXG4gICAgICAgICAgICBuYW1lOiAnZW1pdHRlcidcbiAgICAgICAgfVxuICAgICAqIFxuICAgICAqL1xuICAgIG1ldGhvZHM6IGVtcHR5Rm4sXG5cbiAgICAvKipcbiAgICAgKiBAY2ZnIHtTdHJpbmdbXS9TdHJpbmd9IGlnbm9yZU1ldGhvZHMgbWV0aG9kcyB0aGF0IHdpbGwgYWx3YXlzXG4gICAgICogYmUgaWdub3JlZCBpZiBtZXRob2RzIGlzIG5vdCBhbiBBcnJheS5cbiAgICAgKlxuICAgICAgICBcbiAgICAgICAgdmFyIEMgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgICAgICAgICAkY29tcG9zaXRpb25zOiB7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHRzOiBMdWMuY29tcG9zaXRpb25FbnVtcy5FdmVudEVtaXR0ZXIsXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZHM6ICdhbGxNZXRob2RzJyxcbiAgICAgICAgICAgICAgICAgICAgaWdub3JlTWV0aG9kczogWydlbWl0J11cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIGMgPSBuZXcgQygpO1xuICAgICAgICAgICAgdHlwZW9mIGMuZW1pdFxuICAgICAgICAgICAgPlwidW5kZWZpbmVkXCJcbiAgICAgKi9cbiAgICBpZ25vcmVNZXRob2RzOiB1bmRlZmluZWQsXG5cbiAgICBnZXRPYmplY3RXaXRoTWV0aG9kczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtZXRob2RzT2JqID0gdGhpcy5Db25zdHJ1Y3RvciAmJiB0aGlzLkNvbnN0cnVjdG9yLnByb3RvdHlwZTtcbiAgICAgICAgaWYgKHRoaXMuaWdub3JlTWV0aG9kcykge1xuICAgICAgICAgICAgbWV0aG9kc09iaiA9IGFwcGx5KHt9LCBtZXRob2RzT2JqKTtcbiAgICAgICAgICAgIGFycmF5LmVhY2godGhpcy5pZ25vcmVNZXRob2RzLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBtZXRob2RzT2JqW3ZhbHVlXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1ldGhvZHNPYmo7XG4gICAgfSxcblxuICAgIGdldE1ldGhvZHNUb0NvbXBvc2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbWV0aG9kcyA9IHRoaXMubWV0aG9kcyxcbiAgICAgICAgICAgIGZpbHRlckZuO1xuICAgICAgICAgICAgXG4gICAgICAgIGlmIChpcy5pc0FycmF5KG1ldGhvZHMpKSB7XG4gICAgICAgICAgICByZXR1cm4gbWV0aG9kcztcbiAgICAgICAgfVxuXG4gICAgICAgIGZpbHRlckZuID0gbWV0aG9kcztcblxuICAgICAgICBpZiAoaXMuaXNTdHJpbmcobWV0aG9kcykpIHtcbiAgICAgICAgICAgIGZpbHRlckZuID0gdGhpcy5maWx0ZXJNZXRob2RGbnNbbWV0aG9kc107XG4gICAgICAgIH1cblxuICAgICAgICAvL0NvbnN0cnVjdG9ycyBhcmUgbm90IG5lZWRlZCBpZiBjcmVhdGUgaXMgb3ZlcndyaXR0ZW5cbiAgICAgICAgcmV0dXJuIG9GaWx0ZXIodGhpcy5nZXRPYmplY3RXaXRoTWV0aG9kcygpLCBmaWx0ZXJGbiwgdGhpcywge1xuICAgICAgICAgICAgb3duUHJvcGVydGllczogZmFsc2UsXG4gICAgICAgICAgICBrZXlzOiB0cnVlXG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ29tcG9zaXRpb247Il19
;