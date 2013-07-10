Luc
====


[![browser support](https://ci.testling.com/pllee/luc.png)](https://ci.testling.com/pllee/luc)

[![Build Status](https://secure.travis-ci.org/pllee/luc.png)](http://travis-ci.org/pllee/luc)

What is Luc?
====
Luc is a lightweight JavaScript framework that is built from the ground up targeting all browsers and Node.js.  To node devs Luc should look like any purely node library.  To devs targeting the browser Luc should just look something written in CommonJS, just a single file and source map support thanks to [Browserify](https://github.com/substack/node-browserify).   Everything is written in es5 and to support older browsers Luc comes with an es5 shim version.  If we had to pick a single defining feature about Luc it would be its class system that doesn't box you in and can work with preexisting code not written in Luc.  We also have great utilities to help keep your and our source small.  Luc comes with over 40 utility Array/Object/Function methods along with over 150 Array utility methods that follow the same API and grammar.  Along with that it comes with the ability to add EventEmmiter and Plugin functionality to any class without using inheritance, even ones not defined with Luc's class system.  Luc is lightweight and unobtrusive it has zero dependencies and currently sits at 650 SLOC and it is less than 8Kb minified and gzipped.


Getting started
====
Check out our [docs](http://pllee.github.io/luc/pages/docs/), they show everything that Luc as to offer and they are loaded with examples.    [Luc.define](http://pllee.github.io/luc/pages/docs/#!/api/Luc.define) covers the class system while [Luc.Array](http://pllee.github.io/luc/pages/docs/#!/api/Luc.Array), [Luc.Object](http://pllee.github.io/luc/pages/docs/#!/api/Luc.Object), [Luc.Function](http://pllee.github.io/luc/pages/docs/#!/api/Luc.Function)  cover most of the utils.  Luc also comes packed with node's EventEmitter for browser code.

Node
====
npm install luc

Browser
====
[Download](http://pllee.github.io/luc/luc.zip) the zip or check out the hosted build files [luc](http://pllee.github.io/luc/build/luc.js), [luc-es5-shim](http://pllee.github.io/luc/build/luc-es5-shim.js).  Source maps come packaged with the non minified versions.


Examples
===

Class System
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




###Compositions

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

    //Or simply (EventEmitter comes as a packaged composition)
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
###Mixins

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

###Statics
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

###$class
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


Where does Luc sit now?
====
Luc is now in its first official release.  It still sits at version 0.\* and follows the http://semver.org/ versioning spec.  We want to get input on what you guys think about the API and functionality Luc provides.  Luc will officially release an unchanging API after taking account for everyone's input.  Once input has been gathered a 1.\* version will be released.


The future
====
Right now Luc provides the the building blocks for small and large scale applications.  It does not have any dom or html building functionality.  We want to add this functionality as a submodule down the road.   For the most part Luc's core API should be pretty set now.  Any functionality that we want to add down the road will be done through submodules.  

Issues/Discussion
=== 
Log [issues](https://github.com/pllee/luc/issue) with the appropriate tag.  For discussions about the API or documentation use the discussion tag.  Please read the known caveats of [es5-shim](https://github.com/kriskowal/es5-shim/issues/114).  
