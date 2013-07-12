Luc
====

<!--
[![browser support](https://ci.testling.com/pllee/luc.png)](https://ci.testling.com/pllee/luc)
-->

[![Build Status](https://secure.travis-ci.org/pllee/luc.png)](http://travis-ci.org/pllee/luc)

What is Luc?
====
Luc is a lightweight JavaScript framework that is built from the ground up targeting all browsers and Node.js.  To node devs Luc should look like any purely node library.  To devs targeting the browser Luc should just look something written in CommonJS, just a single file and source map support thanks to [Browserify](https://github.com/substack/node-browserify).   Everything is written in es5 and to support older browsers Luc comes with an es5 shim version.  If we had to pick a single defining feature about Luc it would be its class system that doesn't box you in and can work with preexisting code not written in Luc.  We also have great utilities to help keep your and our source small.  Luc comes with over 40 utility Array/Object/Function methods along with over 150 Array utility methods that follow the same API and grammar.  It also comes with the ability to add EventEmiter and Plugin functionality to any class without using inheritance, even ones not defined with Luc's class system.  Luc is lightweight it has zero dependencies and currently sits at less than 650 SLOC and it is less than 7.5Kb minified and gzipped.


Node
====
npm install luc

Browser
====
[Download](http://pllee.github.io/luc/luc.zip) the zip or check out the hosted build files [luc](http://pllee.github.io/luc/build/luc.js), [luc-es5-shim](http://pllee.github.io/luc/build/luc-es5-shim.js).  Source maps come packaged with the non minified versions.

Supported Browsers
===
* IE8 - latest with tentative support for IE6/7 (Our tests currently pass in them now)
* FF3 - latest
* Chrome
* Opera
* Safari 5.1 - latest
* Tentative support for mobile (Our tests pass for the platforms that we are [testing](https://ci.testling.com/pllee/luc))


Examples/Code
===

For in depth examples and API documentation check out our [docs](http://pllee.github.io/luc/pages/docs/).

[Class System](http://pllee.github.io/luc/pages/docs/#!/api/Luc.define)
---
###Simple define
Luc.define just takes the passed in config and puts the properties on the prototype and returns a Constructor.
```js
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
```
Simple super class

```js
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
```




###[Compositions](http://pllee.github.io/luc/pages/docs/#!/api/Luc.define-cfg-S-compositions)

Compositions allow the ability to add functionality
to any class without changing or messing up the inheritance chain.
They are more powerful than mixins because they don't have to worry about putting a 
state on classes using them or have to know that they may be a mixin or a 
standalone class.

```js
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
```
###Default Compositions
Luc comes with two default composition objects.

##[Luc.compositionEnums.PluginManager](http://pllee.github.io/luc/pages/docs/#!/api/Luc.compositionEnums-property-PluginManager)

The PluginManager adds a plugin functionality to any Class.  Check out the methods that get added to
the instance and more info in the [docs](http://pllee.github.io/luc/pages/docs/#!/api/Luc.PluginManager)

A plugin follows the following life-cycle: 
<br>
plugin is added to the instance -> plugin is created -> plugin init is called with instance -> if needed destroy called by instance -> destroy called on plugin 
<br> Here is the most basic example using the default plugin.

```js

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
```
Plugins can be of any class and can be added with addPlugin

```js

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
```
Plugins can also be destroyed individually or all of them at once.

```js

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
    >Plugin {init: function, destroy: function, name: "1", owner: Object, init: function…}

    c.destroyPlugin({name: '1'});
    >false

    c.destroyAllPlugins();
    >destroyed : 2
```

##[Luc.compositionEnums.EventEmitter](http://pllee.github.io/luc/pages/docs/#!/api/Luc.compositionEnums-property-EventEmitter)

Luc.EventEmitter is preferred as a composition over a mixin because it adds a state "_events" to the this instance when on is called.

```js

    var C = Luc.define({
            $compositions: Luc.compositionEnums.EventEmitter
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
```

###[Mixins](http://pllee.github.io/luc/pages/docs/#!/api/Luc.define-cfg-S-mixins)

Mixins are a way to add functionality to a class that should not add state to the instance unknowingly.  Mixins can be either objects or Constructors.

```js
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
```

###[Statics](http://pllee.github.io/luc/pages/docs/#!/api/Luc.define-cfg-S-statics)
Statics are good for defining default configs.

```js
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
```

Using statics prevent subclasses and instances from unknowingly modifying
all instances.

```js
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
```

###[$class](http://pllee.github.io/luc/pages/docs/#!/api/Luc.define-property-S-class)
Every class defined with Luc.define will get a reference to the instance's own constructor.

```js
    var C = Luc.define()
    var c = new C()
    c.$class === C
    >true
```

 There are some really good use cases to have a reference to it's
own constructor.  <br> Add functionality to an instance in a simple
and generic way:

```js
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
```
Or have a simple generic clone method :

```js
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
```
###[Luc.Base](http://pllee.github.io/luc/pages/docs/#!/api/Luc.Base)
Luc.Base is the default class of for define.  It is a simple class that by default applies the first argument to the instance and then calls Luc.Base.init, init is just an emptyFn which is meant to be overwritten by the defining 
class.
```js
var b = new Luc.Base({
    a: 1,
    init: function() {
        console.log('hey')
    }
})
b.a
>hey
>1
```

We found that most of our classes do this so we made it the default. Having a config object as the first and only param keeps a clean api as well.

```js
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
```
If you don't like the applying of the config to the instance it can always be "disabled"

```js
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

```
Array, Object, Function and other utility functions
---

Luc.is\*
---
*  [Luc.isArguments](http://pllee.github.io/luc/pages/docs/#!/api/Luc-method-isArguments)
*  [Luc.isArray](http://pllee.github.io/luc/pages/docs/#!/api/Luc-method-isArray)
*  [Luc.isDate](http://pllee.github.io/luc/pages/docs/#!/api/Luc-method-isDate)
*  [Luc.isEmpty](http://pllee.github.io/luc/pages/docs/#!/api/Luc-method-isEmpty)
*  [Luc.isFalsy](http://pllee.github.io/luc/pages/docs/#!/api/Luc-method-isFalsy)
*  [Luc.isNumber](http://pllee.github.io/luc/pages/docs/#!/api/Luc-method-isNumber)
*  [Luc.isObject](http://pllee.github.io/luc/pages/docs/#!/api/Luc-method-isObject)
*  [Luc.isRegExp](http://pllee.github.io/luc/pages/docs/#!/api/Luc-method-isRegExp)
*  [Luc.isString](http://pllee.github.io/luc/pages/docs/#!/api/Luc-method-isString)
*  [Luc.isFunction](http://pllee.github.io/luc/pages/docs/#!/api/Luc-method-isFunction)

###[Luc.isFalsy](http://pllee.github.io/luc/pages/docs/#!/api/Luc-method-isFalsy)
Return true if the object is falsy but not zero.
```js
    Luc.isFalsy(false)
    >true
    Luc.isFalsy(0)
    >false
```
###[Luc.isEmpty](http://pllee.github.io/luc/pages/docs/#!/api/Luc-method-isEmpty)
Return true if the object is empty.
{}, [], '',false, null, undefined, NaN  are all treated as empty.

```js
Luc.isEmpty(true)
>false
Luc.isEmpty([])
>true
```

The native js type methods work as you think they should.  
```js
Luc.isObject([])
>false
Luc.isArray([])
>true
```
You can see that we don't have an 
  isNull isUndefined or isNaN.  We prefer to use:
```js
obj === null
obj === undefined
isNaN(obj)
```

Luc.Object
---

###[Luc.Object.apply](http://pllee.github.io/luc/pages/docs/#!/api/Luc.Object-method-apply) / Luc.apply
Apply the properties from fromObject to the toObject. fromObject will overwrite any shared keys. It can also be used as a simple shallow clone.
```js
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
```
No null checks are needed.

```js
Luc.apply(undefined, {a:1})
>{a:1}
Luc.apply({a: 1})
>{a:1}
```

###[Luc.Object.mix](http://pllee.github.io/luc/pages/docs/#!/api/Luc.Object-method-mix) / Luc.mix
Similar to Luc.Object.apply except that the fromObject will NOT overwrite the keys of the toObject if they are defined.
```js
Luc.mix({a:1,b:2}, {a:3,b:4,c:5})
>{a: 1, b: 2, c: 5}
```

No null checks are needed.

```js
Luc.mix(undefined, {a:1})
>{a:1}
Luc.mix({a: 1})
>{a:1}
```

###[Luc.Object.each](http://pllee.github.io/luc/pages/docs/#!/api/Luc.Object-method-each)
Iterate over an objects properties as key value "pairs" with the passed in function.
```js
var thisArg = {val:'c'};
Luc.Object.each({
    u: 'L'
}, function(key, value) {
    console.log(value + key + this.val)
}, thisArg)
>"Luc"
```

###[Luc.Object.filter](http://pllee.github.io/luc/pages/docs/#!/api/Luc.Object-method-filter)
Return key value pairs from the object if the filterFn returns a truthy value.
```js
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
```
Luc.Array
---

Luc is optionally packaged with es5 shim so you can write es5 code in non es5 browsers.
It comes with your favorite [Array](http://pllee.github.io/luc/pages/docs/#!/api/Array) methods such as Array.forEach, Array.filter, Array.some, Array.every Array.reduceRight ..

###[Luc.Array.toArray](http://pllee.github.io/luc/pages/docs/#!/api/Luc.Array-method-toArray)
Take an object and turn it into an array if it isn't one.
```js
    Luc.Array.toArray()
    >[]
    Luc.Array.toArray(null)
    >[]
    Luc.Array.toArray(1)
    >[1]
    Luc.Array.toArray([1,2])
    >[1, 2]
```

###[Luc.Array.forEach](http://pllee.github.io/luc/pages/docs/#!/api/Luc.Array-method-each)
Runs an Array.forEach after calling Luc.Array.toArray on the item.
It is very useful for setting up flexible API's that can handle none one or many.

```js
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
```


###[Luc.Array.pluck](http://pllee.github.io/luc/pages/docs/#!/api/Luc.Array-method-pluck)
Flatten out an array of objects based of their value for the passed in key. This also takes account for null/undefined values.

```js
Luc.Array.pluck([undefined, {a:'1', b:2}, {b:3}, {b:4}], 'b')
>[undefined, 2, 3, 4]
```
###[Luc.Array.insert](http://pllee.github.io/luc/pages/docs/#!/api/Luc.Array-method-insert)
Insert or append the second array/arguments into the first array/arguments. This method does not alter the passed in array/arguments.
```js
Luc.Array.insert([0,4], [1,2,3], 1);
>[0, 1, 2, 3, 4]
Luc.Array.insert([0,4], [1,2,3], true);
>[0, 4, 1, 2, 3]
Luc.Array.insert([0,4], [1,2,3], 0);
>[1, 2, 3, 0, 4]
```
###[Luc.Array.last](http://pllee.github.io/luc/pages/docs/#!/api/Luc.Array-method-last)
Return the last item of the array
```js
var myLongArrayNameForThingsThatIWantToKeepTrackOf = [1,2,3]

Luc.Array.last(myLongArrayNameForThingsThatIWantToKeepTrackOf);
vs.
myLongArrayNameForThingsThatIWantToKeepTrackOf[myLongArrayNameForThingsThatIWantToKeepTrackOf.length -1]
```
###[Luc.Array.removeAtIndex](http://pllee.github.io/luc/pages/docs/#!/api/Luc.Array-method-removeAtIndex)
Remove an item from the passed in arr from the index.
```js
var arr = [1,2,3];
Luc.Array.removeAtIndex(arr, 1);
>2
arr;
>[1,3]
```
###[Luc.Array.fromIndex](http://pllee.github.io/luc/pages/docs/#!/api/Luc.Array-method-fromIndex)
Return the items in between the passed in index and the end of the array.
```js
Luc.Array.fromIndex([1,2,3,4,5], 1)
>[2, 3, 4, 5]
```


###Iterator and Matching functions

*  [Luc.Array.findAll](http://pllee.github.io/luc/pages/docs/#!/api/Luc.Array-method-findAll)
*  [Luc.Array.findAllNot](http://pllee.github.io/luc/pages/docs/#!/api/Luc.Array-method-findAllNot)
*  [Luc.Array.findFirst](http://pllee.github.io/luc/pages/docs/#!/api/Luc.Array-method-findFirst)
*  [Luc.Array.findFirstNot](http://pllee.github.io/luc/pages/docs/#!/api/Luc.Array-method-findFirstNot)
*  [Luc.Array.findLast](http://pllee.github.io/luc/pages/docs/#!/api/Luc.Array-method-findLast)
*  [Luc.Array.findLastNot](http://pllee.github.io/luc/pages/docs/#!/api/Luc.Array-method-findLastNot)
*  [Luc.Array.removeAll](http://pllee.github.io/luc/pages/docs/#!/api/Luc.Array-method-removeAll)
*  [Luc.Array.removeAllNot](http://pllee.github.io/luc/pages/docs/#!/api/Luc.Array-method-removeAllNot)
*  [Luc.Array.removeFirst](http://pllee.github.io/luc/pages/docs/#!/api/Luc.Array-method-removeFirst)
*  [Luc.Array.removeFirstNot](http://pllee.github.io/luc/pages/docs/#!/api/Luc.Array-method-removeFirstNot)
*  [Luc.Array.removeLast](http://pllee.github.io/luc/pages/docs/#!/api/Luc.Array-method-removeLast)
*  [Luc.Array.removeLastNot](http://pllee.github.io/luc/pages/docs/#!/api/Luc.Array-method-removeLastNot)

All remove\* / find\* methods follow the same api. \*All functions will return an array of removed or found items. The items will be added to the array in the order they are found. \*First functions will return the first item and stop iterating after that, if none is found false is returned. remove\* functions will directly change the passed in array. \*Not functions only do the following actions if the comparison is not true. All remove\* / find\* take the following api: array, objectToCompareOrIterator, compareConfigOrThisArg <br> for example:

```js
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
```

The Array functions are also combined with the Luc.is\* functions.  There are over 150 matching functions.
Almost every public method of Luc.is\* is available it uses the following grammar Luc.Array["methodName""isMethodName"]
These functions have a consistent api that should make sense what they do from the function name.  [Docs](http://pllee.github.io/luc/pages/docs/#!/api/Luc.ArrayFns)


```js
//compact like function
Luc.Array.findAllNotFalsy([false, true, null, undefined, 0, '', [], [1]])
  > [true, 0, [], [1]]

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
```

As of right now there are two function sets which differ from the is api.

InstanceOf
```js
Luc.Array.findAllInstanceOf([1,2, new Date(), {}, []], Object)
>[date, {}, []]
>Luc.Array.findAllNotInstanceOf([1,2, new Date(), {}, []], Object)
[1, 2]
```

In

```js
Luc.Array.findAllIn([1,2,3], [1,2])
>[1, 2]
Luc.Array.findFirstIn([1,2,3], [1,2])
>1

//defaults to loose comparison
Luc.Array.findAllIn([1,2,3, {a:1, b:2}], [1,{a:1}])
> [1, {a:1,b:2}]

Luc.Array.findAllIn([1,2,3, {a:1, b:2}], [1,{a:1}], {type: 'deep'})
>[1]
```

Luc.Function
---
Most of these functions follow the same api: function or function[], relevant args ... with an optional config to Luc.Function.createAutmenter as the last argument.

###[Luc.Function.createAugmenter](http://pllee.github.io/luc/pages/docs/#!/api/Luc.Function-method-createAugmenter)

Augment the passed in function's thisArg and or arguments object based on the passed in config.  Read the docs to understand all of the config options.
```js
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
```

###[Luc.Function.createThrottled](http://pllee.github.io/luc/pages/docs/#!/api/Luc.Function-method-createThrottled)
Create a throttled function from the passed in function that will only get called once the number of milliseconds have been exceeded.
Read the docs to understand all of the config options.
```js
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
```
###[Luc.Function.createRelayer](http://pllee.github.io/luc/pages/docs/#!/api/Luc.Function-method-createRelayer)
Return a functions that runs the passed in functions the result of each function will be the the call args for the next function. The value of the last function return will be returned.
Read the docs to understand all of the config options.
```js
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
```
###[Luc.Function.createSequence](http://pllee.github.io/luc/pages/docs/#!/api/Luc.Function-method-createSequence)
Return a function that runs the passed in functions and returns the result of the last function called.
Read the docs to understand all of the config options.
```js
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
```

###[Luc.Function.createSequenceIf](http://pllee.github.io/luc/pages/docs/#!/api/Luc.Function-method-createSequenceIf)
Return a function that runs the passed in functions if one of the functions returns false the rest of the functions won't run and false will be returned.
Read the docs to understand all of the config options.
```js
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
```

###[Luc.Function.createDeferred](http://pllee.github.io/luc/pages/docs/#!/api/Luc.Function-method-createDeferred)
Defer a function's execution for the passed in milliseconds.  Read the docs to understand all of the config options.

###[Luc.Function.emptyFn](http://pllee.github.io/luc/pages/docs/#!/api/Luc.Function-method-emptyFn) / Luc.emptyFn
A reusable empty function

###[Luc.Function.abstractFn](http://pllee.github.io/luc/pages/docs/#!/api/Luc.Function-method-abstractFn)  / Luc.abstractFn
A function that throws an error when called. Useful when defining abstract like classes

[Luc.compare](http://pllee.github.io/luc/pages/docs/#!/api/Luc-method-compare)
---
Return true if the values are equal to each other. By default a deep comparison is done on arrays, dates and objects and a strict comparison is done on other types.  Pass in 'shallow' for a shallow comparison, 'deep' (default) for a deep comparison 'strict' for a strict === comparison for all objects or 'loose' for a loose comparison on objects. A loose comparison will compare the keys and values of val1 to val2 and does not check if keys from val2 are equal to the keys in val1.
```js
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
```

[Luc.id](http://pllee.github.io/luc/pages/docs/#!/api/Luc-method-id)
---
Return a unique id.  A prefix is an optional argument

```js
 Luc.id()
    >"luc-0"
    Luc.id()
    >"luc-1"
    Luc.id('my-prefix')
    >"my-prefix0"
    Luc.id('')
    >"0"
```

Where does Luc sit now?
====
Luc is now in its first official release.  It still sits at version 0.\* and follows the http://semver.org/ versioning spec.  We want to get input on what the community thinks about the API and functionality Luc provides.  Luc will officially release an unchanging API after taking account for everyone's input.  Once input has been gathered a 1.\* version will be released.


The future
====
Right now Luc provides the the building blocks for small and large scale applications.  It does not have any dom or html building functionality.  We want to add this functionality as a submodule down the road.   For the most part Luc's core API should be pretty set now.  Any functionality that we want to add down the road will be done through submodules.  

Issues/Discussion
=== 
Log [issues](https://github.com/pllee/luc/issues) with the appropriate tag.  For discussions about the API or documentation use the discussion tag.  Please read the known caveats of [es5-shim](https://github.com/kriskowal/es5-shim/issues/114).  

FAQ
===
*  How does Luc support Node and IE6?
    -  Luc uses [es5-shim](https://github.com/kriskowal/es5-shim) and [browserify](https://github.com/substack/node-browserify) to write pure node code with all of its es5 goodness and it just works on all browsers.
*  Can I run the tests and see code coverage?
    -  Feel free to run the [tests](http://pllee.github.io/luc/pages/testRunner/) in your favorite or least favorite browser.  [Coverage](http://pllee.github.io/luc/pages/coverage/)
*  Why do some tests show failing in [testling](https://ci.testling.com/pllee/luc)
    - Not sure we are talking to them for support.  There are currently only two failure but they are timing out or all the tests pass but they show as failed.
*  How do you pronounce Luc?
    - It is pronounced like the name Luke
*  What is Luc named after?
    - Everyone's favorite former Milwaukee Bucks Forward and Cameroonian Prince [Luc Richard Mbah a Moute](http://en.wikipedia.org/wiki/Luc_Mbah_a_Moute)
