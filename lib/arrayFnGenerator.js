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

module.exports = Generator;

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
        },'In': function(arr) {
            return function(value) {
                if(value !== false) {
                    return array.findFirst(arr, value) !== false;
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