;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
require('../array');
require('../object');
require('../nodet');
require('../class');
require('../is');
require('../function');
require('../compare');
},{"../array":2,"../object":3,"../nodet":4,"../class":5,"../is":6,"../function":7,"../compare":8}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
(function(process){ module.exports = process.env.COVERAGE 
   ? require('../lib-cov/luc')
   : require('../lib/luc-es5-shim');
})(require("__browserify_process"))
},{"../lib-cov/luc":11,"../lib/luc-es5-shim":12,"__browserify_process":9}],2:[function(require,module,exports){
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

    it('insert', function() {
        function runAllScenarios(arr1, arr2) {
            expect(Luc.Array.insert(arr1, arr2, true)).to.be.eql([1,2,3,4,5,6]);
            expect(Luc.Array.insert(arr2, arr1, true)).to.be.eql([4,5,6,1,2,3]);

            expect(Luc.Array.insert(arr1, arr2, 3)).to.be.eql([1,2,3,4,5,6]);
            expect(Luc.Array.insert(arr1, arr2, 2)).to.be.eql([1,2,4,5,6,3]);
            expect(Luc.Array.insert(arr1, arr2, 1)).to.be.eql([1,4,5,6,2,3]);
            expect(Luc.Array.insert(arr1, arr2, 0)).to.be.eql([4,5,6, 1,2,3]);

            expect(Luc.Array.insert(arr2, arr1, 3)).to.be.eql([4,5,6,1,2,3]);
            expect(Luc.Array.insert(arr2, arr1, 2)).to.be.eql([4,5,1,2,3,6]);
            expect(Luc.Array.insert(arr2, arr1, 1)).to.be.eql([4,1,2,3,5,6]);
            expect(Luc.Array.insert(arr2, arr1, 0)).to.be.eql([1,2,3,4,5,6]);


            //test no modify
            expect(arr1).to.be.eql([1,2,3]);
            expect(arr2).to.be.eql([4,5,6]);
        }

        runAllScenarios([1,2,3], [4,5,6]);

        (function(arr1, arr2) {
            runAllScenarios(arr1, arr2);
        }([1,2,3], [4,5,6]));
    });

    it('removeAll', function() {
        var arr = [false, false, 0, ''],
            ret = Luc.Array.removeAll(arr, '');

        expect(arr).to.be.eql([false, false, 0]);
        expect(ret).to.be.eql(['']);

        arr = [false, false, false];
        ret = Luc.Array.removeAll(arr, false);

        expect(arr).to.be.eql([]);
        expect(ret).to.be.eql([false, false, false]);
        expect(Luc.Array.removeAll(arr, false)).to.be(false);

        arr = [{}, {a:1}, {a:1, b:2}];
        ret = Luc.Array.removeAll(arr, {a: 1});

        expect(ret).to.be.eql([{a:1}]);
        expect(arr).to.be.eql([{}, {a:1,b:2}]);
    });

    it('removeAllNot', function() {
        var arr = [false, false, 0, ''],
            ret = Luc.Array.removeAllNot(arr, '');

        expect(arr).to.be.eql(['']);
        expect(ret).to.be.eql([false, false, 0]);

        arr = [false, false, false];
        ret = Luc.Array.removeAllNot(arr, false);

        expect(arr).to.be.eql([false, false, false]);
        expect(ret).to.be(false);


        arr = [{}, {a:1}, {a:1, b:2}];
        ret = Luc.Array.removeAllNot(arr, {a: 1});

        expect(arr).to.be.eql([{a:1}]);
        expect(ret).to.be.eql([{}, {a:1,b:2}]);
        
    });

    it('removeFirst', function() {
        var arr = [[],[1,2], [1,2]];
        var ret = Luc.Array.removeFirst(arr, [1,2]);

        expect(arr).to.be.eql([[],[1,2]]);
        expect(ret).to.be.eql([1,2]);
        expect(Luc.Array.removeFirst(arr, [1,2])).to.be.eql([1,2]);

        arr = [[], [], []];
        ret = Luc.Array.removeFirst(arr, [], {type: 'strict'});
        expect(arr).to.be.eql([[],[],[]]);
        expect(ret).to.be.eql(false);

        arr = [[], [], []];
        ret = Luc.Array.removeFirst(arr, [], {type: 'shallow'});
        expect(arr).to.be.eql([[],[]]);
        expect(ret).to.be.eql([]);
    });

    it('removeFirstNot', function() {
        var arr = [[],[1,2], [1,2]];
        var ret = Luc.Array.removeFirstNot(arr, []);

        expect(arr).to.be.eql([[],[1,2]]);
        expect(ret).to.be.eql([1,2]);
        expect(Luc.Array.removeFirstNot(arr, [1,2])).to.be.eql([]);
        expect(Luc.Array.removeFirstNot(arr, [1,2])).to.be(false);

        arr = [{a:1}, {a:1, b:2}, {a:1}];
        ret = Luc.Array.removeFirstNot(arr, {a: 1});

        expect(arr).to.be.eql([{a:1}, {a:1}]);
        expect(ret).to.be.eql({a:1, b:2});
        ret = Luc.Array.removeFirstNot(arr, {a: 1});
        expect(arr).to.be.eql([{a:1}, {a:1}]);
        expect(ret).to.be.eql(false);

        var a = {a: 1};
        arr = [{a:1}, {a:1, b:2}, a];

        ret = Luc.Array.removeFirstNot(arr, {a:1}, {type: 'strict'});
        expect(arr).to.be.eql([{a:1, b:2}, {a:1}]);
        expect(ret).to.be.eql({a:1});
        Luc.Array.removeFirstNot(arr, a, {type: 'strict'});
        Luc.Array.removeFirstNot(arr, a, {type: 'strict'});
        ret = Luc.Array.removeFirstNot(arr, a, {type: 'strict'});
        expect(arr).to.be.eql([{a:1}]);
        expect(ret).to.be(false);
    });

    it('findFirst', function() {
        var arr = [{a:1}, {a:1}, {a:1}, {a:1, b:2}];
        expect(Luc.Array.findFirst(arr, {a:1, b:2})).to.be.eql({a:1, b:2});
        expect(Luc.Array.findFirst(arr, {a:1, b:2}, {type: 'strict'})).to.be.eql(false);
        expect(Luc.Array.findFirst(arr, {a:1, b:2, c:3})).to.be.eql(false);
        expect(Luc.Array.findFirstNot([1,2,3,{}], {})).to.be(1);

        arr = [false, 0, undefined, null, ''];
        expect(Luc.Array.findFirst(arr, null)).to.be.eql(null);
        expect(Luc.Array.findFirst(arr, false)).to.be.eql(false);
        expect(Luc.Array.findFirst(arr, undefined)).to.be.eql(undefined);
        expect(Luc.Array.findFirst(arr, 0)).to.be.eql(0);

        arr = [new Date(1000), new Date(1000), new Date(1001)];
        expect(Luc.Array.findFirst(arr, new Date(1001))).to.be.eql(new Date(1001));
        expect(Luc.Array.findFirst(arr, new Date(1002))).to.be(false);

        var d = new Date();
        arr = [new Date(1000), new Date(1000), d];
        expect(Luc.Array.findFirst(arr, d, {type: 'strict'})).to.be(d);
        expect(Luc.Array.findFirst(arr, d, {type: 'shallow'})).to.be(d);
    });

    it('findFirstNot', function() {
        var arr = [{a:1}, {a:1}, {a:1}, {a:1, b:2}];
        expect(Luc.Array.findFirstNot(arr, {a:1, b:2})).to.be.eql({a:1});
        expect(Luc.Array.findFirstNot(arr, {a:1})).to.be.eql({a:1, b:2});

        arr = ['', '', '', null];
        expect(Luc.Array.findFirstNot(arr, null)).to.be.eql('');
        expect(Luc.Array.findFirstNot(arr, '')).to.be.eql(null);
        arr = ['', '', ''];
        expect(Luc.Array.findFirstNot(arr, '')).to.be.eql(false);
    });

    it('findAll', function() {
        var arr = [{a:1}, {a:1}, {a:1}, {a:1, b:2}, {b:2}];
        expect(Luc.Array.findAll(arr, {a:1, b:2})).to.be.eql([{a:1, b:2}]);
        expect(Luc.Array.findAll(arr, {a:1})).to.be.eql([{a:1},{a:1},{a:1}]);
        expect(Luc.Array.findAll(arr, {a:1, b:2}, {type: 'strict'})).to.be.eql(false);
        expect(Luc.Array.findAll(arr, {a:1, b:2, c:3})).to.be.eql(false);

        arr = [[],[1,2], [1,2]];
        expect(Luc.Array.findAll(arr, [1,2])).to.be.eql([[1,2], [1,2]]);
        expect(Luc.Array.findAll(arr, [1])).to.be(false);
        expect(Luc.Array.findAll(arr, [2,2])).to.be(false);

        arr = [false, 0, undefined, null, ''];
        expect(Luc.Array.findAll(arr, null)).to.be.eql([null]);
        expect(Luc.Array.findAll(arr, false)).to.be.eql([false]);
        expect(Luc.Array.findAll(arr, undefined)).to.be.eql([undefined]);
        expect(Luc.Array.findAll(arr, 0)).to.be.eql([0]);

        arr = [new Date(1000), new Date(1000), new Date(1001), false];
        expect(Luc.Array.findAll(arr, new Date(1001))).to.be.eql([new Date(1001)]);
    });

    it('findAllNot', function() {
        var arr = [{a:1}, {a:1}, {a:1}, {a:1, b:2}];
        expect(Luc.Array.findAllNot(arr, {a:1, b:2})).to.be.eql([{a:1},{a:1},{a:1}]);
        expect(Luc.Array.findAllNot(arr, {a:1})).to.be.eql([{a:1, b:2}]);

        arr = ['', '', '', null];
        expect(Luc.Array.findAllNot(arr, null)).to.be.eql(['','','']);
        expect(Luc.Array.findAllNot(arr, '')).to.be.eql([null]);
        arr = ['', '', ''];
        expect(Luc.Array.findAllNot(arr, '')).to.be.eql(false);
    });

    it('test dynamic array is fns', function() {
        var isFns = ['Array',
                'Object',
                'Function',
                'Date',
                'String',
                'Number',
                'RegExp',
                'Falsy',
                'Empty',
                'Boolean'
        ],
        arrayFns = ['findFirstNot', 'findAllNot', 'findFirst', 'findAll',
                'removeFirstNot', 'removeAllNot', 'removeFirst', 'removeAll'
        ];

        arrayFns.forEach(function(fnName) {
            isFns.forEach(function(isFnName) {
                expect(Luc.Array[fnName + isFnName]([])).to.be(false);
            });
        });
    });

    it('test remove/find with iterator and thisArg', function() {
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
        })).to.be.eql(false);

       //direct function comparison
        expect(Luc.Array.findAllNot(arr, function(){}, {type:'strict'})).to.be.eql(arr);

        expect(Luc.Array.findAllNot(arr, function(){
            return true
        })).to.be.eql(false);


    });
});
},{"./lucTestLib":10,"expect.js":13}],3:[function(require,module,exports){
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
});
},{"./lucTestLib":10,"expect.js":13}],4:[function(require,module,exports){
var Luc = require('./lucTestLib'),
    expect = require('expect.js');
var emitterTest = require('./common').testEmitter;
//Sanity check to make sure node components work on the browser.
describe('Luc Node functions', function() {

    it('Emitter', function() {
        emitterTest(new Luc.EventEmitter());
    });
})
},{"./lucTestLib":10,"./common":14,"expect.js":13}],5:[function(require,module,exports){
var emitterTest = require('./common').testEmitter;
var Luc = require('./lucTestLib'),
    expect = require('expect.js');


function defineClassWithAllOptions() {
    function Adder() {}

    Adder.prototype.add = function(a, b) {
        return a + b;
    };
    return Luc.define({
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
            filterKeys: 'allMethods'
        },
        add: function(a, b, c) {
            var two = this.$superclass.add.call(this, a, b),
                ret = two + c;

            this.emit('toString', this.makeString(ret));

            this.$class.total += ret;

            return ret;
        }
    });
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

        expect(C.b).to.eql(1);
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
                this.$superclass.emit.apply(this, arguments);
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
            $compositions: [{Constructor: EmitterParent, name: 'emitter', filterKeys: 'allMethods'}]
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
            allOptions = Luc.ClassDefiner.processorKeys;

        Object.keys(allOptions).forEach(function(option) {
            expect(AdderEmitter.prototype[option]).to.be(undefined);
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
                defaults : Luc.compositionEnumns.EventEmitter
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
                defaults: Luc.compositionEnumns.PluginManager
            }
        });

        var c = new ClassWithPlugins({
            plugins: [{
                    init: function(instance) {
                        testInstance = instance;
                    },
                    destroy: function(){

                    }
                }
            ]
        });

        expect(testInstance).to.be(c);
        expect(c.getComposition('plugins').plugins[0]).to.be.a(Luc.Plugin);
    });

    it('test configured plugin constructors', function() {
        var testIntance,
            ConfiguredPlugin = function(config) {
                this.myOwner = config.owner;
            },
            ClassWithPlugins = Luc.define({
                $compositions: {
                    defaults: Luc.compositionEnumns.PluginManager
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
                defaults: Luc.compositionEnumns.PluginManager
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
        c.destroyPlugins();
        expect(testValue).to.be(true);
    });
});





},{"./common":14,"./lucTestLib":10,"expect.js":13}],6:[function(require,module,exports){
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

    it('isBoolean', function() {
        expect(Luc.isBoolean({})).to.be(false);
        expect(Luc.isBoolean(false)).to.be(true);
        expect(Luc.isBoolean(true)).to.be(true);
    });
});
},{"./lucTestLib":10,"expect.js":13}],7:[function(require,module,exports){
var Luc = require('./lucTestLib'),
    expect = require('expect.js'),
    arraySlice = Array.prototype.slice;

describe('Luc Function utilities', function() {

    it('create augmentor', function() {
        function testFn() {
            var arr = arraySlice.call(arguments);
            return this.str + arr.join('');
        }

        var appendAndThis = Luc.Function.createAugmentor(testFn, {
            thisArg: {
                str: '1'
            },
            args: [4, 5],
            index: true
        });

        expect(appendAndThis(2,3)).to.be('12345');

        var appendAndThisArgumentsAfter = Luc.Function.createAugmentor(testFn, {
            thisArg: {
                str: '1'
            },
            args: [4, 5],
            index: true,
            argumentsFirst: false
        });

        expect(appendAndThisArgumentsAfter(2,3)).to.be('14523');

        var argumentsAfter = Luc.Function.createAugmentor(testFn, {
            thisArg: {
                str: '1'
            },
            args: [4, 5],
            index: 1,
            argumentsFirst: false
        });

        expect(argumentsAfter(2,3)).to.be('14235');

        var argumentsInsert = Luc.Function.createAugmentor(testFn, {
            thisArg: {
                str: '1'
            },
            args: [4, 5],
            index: 1
        });

        expect(argumentsInsert(2,3)).to.be('12453');

        var noThisArg = Luc.Function.createAugmentor(testFn, {
            args: [4, 5],
            index: 1
        });

        expect(noThisArg.apply({str: '2'},[2,3])).to.be('22453');

        var justArgs = Luc.Function.createAugmentor(testFn, {
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

    it('create throtteled', function(done) {
        var callCount = 0;
        var throtteled = Luc.Function.createThrotteled(function(a,b,c){
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
            throtteled(1);
        }

        throtteled(1,2);

        expect(callCount).to.be(0);
    });


});
},{"./lucTestLib":10,"expect.js":13}],8:[function(require,module,exports){
var Luc = require('./lucTestLib'),
    expect = require('expect.js');

describe('Luc compare fn', function() {

    it('compare', function() {
        expect(Luc.compare({}, {})).to.be(true);
        expect(Luc.compare([], [])).to.be(true);
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

        expect(Luc.compare(new Date(10000), {})).to.be(false);
        expect(Luc.compare(new Date(10000), new Date(10000))).to.be(true);

        expect(Luc.compare(false, false)).to.be(true);
        expect(Luc.compare(0, false)).to.be(false);
        expect(Luc.compare('', false)).to.be(false);
        expect(Luc.compare(null, false)).to.be(false);
        expect(Luc.compare(undefined, false)).to.be(false);
        expect(Luc.compare(NaN, false)).to.be(false);
        expect(Luc.compare([], [1]), {type: 'deep'}).to.be(false);

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
        expect(Luc.compare({a:1}, {a:1}, {type: 'shallow'})).to.be(true);
        expect(Luc.compare({a:1, b: {}}, {a:1, b: {}}, {type: 'shallow'})).to.be(false);
        expect(Luc.compare({a:1}, {a:1}, {type: 'deep'})).to.be(true);
        expect(Luc.compare({a:1, b: {}}, {a:1, b: {}}, {type: 'deep'})).to.be(true);
        expect(Luc.compare({a:1}, {a:1}, {type: 'strict'})).to.be(false);

        var invalidType = function(){
            Luc.compare(true, true, {type: 'deeep'});
        };
        expect(invalidType).to.throwException();
    });
});
},{"./lucTestLib":10,"expect.js":13}],15:[function(require,module,exports){
require=(function(e,t,n,r){function i(r){if(!n[r]){if(!t[r]){if(e)return e(r);throw new Error("Cannot find module '"+r+"'")}var s=n[r]={exports:{}};t[r][0](function(e){var n=t[r][1][e];return i(n?n:e)},s,s.exports)}return n[r].exports}for(var s=0;s<r.length;s++)i(r[s]);return i})(typeof require!=="undefined"&&require,{1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
(function(){// UTILITY
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

})()
},{"util":3,"buffer":4}],"buffer-browserify":[function(require,module,exports){
module.exports=require('q9TxCC');
},{}],"q9TxCC":[function(require,module,exports){
(function(){function SlowBuffer (size) {
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

})()
},{"assert":2,"./buffer_ieee754":1,"base64-js":5}],3:[function(require,module,exports){
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

},{"events":6}],5:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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
},{"__browserify_process":8}],4:[function(require,module,exports){
(function(){function SlowBuffer (size) {
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

})()
},{"assert":2,"./buffer_ieee754":7,"base64-js":9}],9:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
(function(Buffer){
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

})(require("__browserify_buffer").Buffer)
},{"__browserify_buffer":15}],11:[function(require,module,exports){
/* automatically generated by JSCoverage - do not edit */
if (typeof _$jscoverage === 'undefined') _$jscoverage = {};
if (! _$jscoverage['luc.js']) {
  _$jscoverage['luc.js'] = [];
  _$jscoverage['luc.js'][1] = 0;
  _$jscoverage['luc.js'][6] = 0;
  _$jscoverage['luc.js'][8] = 0;
  _$jscoverage['luc.js'][9] = 0;
  _$jscoverage['luc.js'][15] = 0;
  _$jscoverage['luc.js'][23] = 0;
  _$jscoverage['luc.js'][30] = 0;
  _$jscoverage['luc.js'][33] = 0;
  _$jscoverage['luc.js'][34] = 0;
  _$jscoverage['luc.js'][41] = 0;
  _$jscoverage['luc.js'][48] = 0;
  _$jscoverage['luc.js'][55] = 0;
  _$jscoverage['luc.js'][57] = 0;
  _$jscoverage['luc.js'][58] = 0;
  _$jscoverage['luc.js'][65] = 0;
  _$jscoverage['luc.js'][67] = 0;
  _$jscoverage['luc.js'][69] = 0;
  _$jscoverage['luc.js'][71] = 0;
  _$jscoverage['luc.js'][73] = 0;
  _$jscoverage['luc.js'][75] = 0;
  _$jscoverage['luc.js'][77] = 0;
  _$jscoverage['luc.js'][79] = 0;
  _$jscoverage['luc.js'][81] = 0;
  _$jscoverage['luc.js'][83] = 0;
  _$jscoverage['luc.js'][85] = 0;
  _$jscoverage['luc.js'][89] = 0;
  _$jscoverage['luc.js'][92] = 0;
  _$jscoverage['luc.js'][93] = 0;
}
_$jscoverage['luc.js'][1]++;
var Luc = {};
_$jscoverage['luc.js'][6]++;
module.exports = Luc;
_$jscoverage['luc.js'][8]++;
var object = require("./object");
_$jscoverage['luc.js'][9]++;
Luc.Object = object;
_$jscoverage['luc.js'][15]++;
Luc.O = object;
_$jscoverage['luc.js'][23]++;
Luc.apply = Luc.Object.apply;
_$jscoverage['luc.js'][30]++;
Luc.mix = Luc.Object.mix;
_$jscoverage['luc.js'][33]++;
var fun = require("./function");
_$jscoverage['luc.js'][34]++;
Luc.Function = fun;
_$jscoverage['luc.js'][41]++;
Luc.F = fun;
_$jscoverage['luc.js'][48]++;
Luc.emptyFn = Luc.Function.emptyFn;
_$jscoverage['luc.js'][55]++;
Luc.abstractFn = Luc.Function.abstractFn;
_$jscoverage['luc.js'][57]++;
var array = require("./array");
_$jscoverage['luc.js'][58]++;
Luc.Array = array;
_$jscoverage['luc.js'][65]++;
Luc.A = array;
_$jscoverage['luc.js'][67]++;
Luc.apply(Luc, require("./is"));
_$jscoverage['luc.js'][69]++;
var EventEmitter = require("./events/eventEmitter");
_$jscoverage['luc.js'][71]++;
Luc.EventEmitter = EventEmitter;
_$jscoverage['luc.js'][73]++;
var Base = require("./class/base");
_$jscoverage['luc.js'][75]++;
Luc.Base = Base;
_$jscoverage['luc.js'][77]++;
var Definer = require("./class/definer");
_$jscoverage['luc.js'][79]++;
Luc.ClassDefiner = Definer;
_$jscoverage['luc.js'][81]++;
Luc.define = Definer.define;
_$jscoverage['luc.js'][83]++;
Luc.Plugin = require("./class/plugin");
_$jscoverage['luc.js'][85]++;
Luc.apply(Luc, {compositionEnumns: require("./class/compositionEnumns")});
_$jscoverage['luc.js'][89]++;
Luc.compare = require("./compare").compare;
_$jscoverage['luc.js'][92]++;
if (typeof window !== "undefined") {
  _$jscoverage['luc.js'][93]++;
  window.Luc = Luc;
}
_$jscoverage['luc.js'].source = ["var Luc = {};","/**"," * @class Luc"," * Aliases for common Luc methods and packages."," */","module.exports = Luc;","","var object = require('./object');","Luc.Object = object;","/**"," * @member Luc"," * @property O Luc.O"," * Alias for Luc.Object"," */","Luc.O = object;","","","/**"," * @member Luc"," * @method apply"," * @inheritdoc Luc.Object#apply"," */","Luc.apply = Luc.Object.apply;","","/**"," * @member Luc"," * @method mix"," * @inheritdoc Luc.Object#mix"," */","Luc.mix = Luc.Object.mix;","","","var fun = require('./function');","Luc.Function = fun;","","/**"," * @member Luc"," * @property F Luc.F"," * Alias for Luc.Function"," */","Luc.F = fun;","","/**"," * @member Luc"," * @method emptyFn"," * @inheritdoc Luc.Function#emptyFn"," */","Luc.emptyFn = Luc.Function.emptyFn;","","/**"," * @member Luc"," * @method abstractFn"," * @inheritdoc Luc.Function#abstractFn"," */","Luc.abstractFn = Luc.Function.abstractFn;","","var array = require('./array');","Luc.Array = array;","","/**"," * @member Luc"," * @property A Luc.A"," * Alias for Luc.Array"," */","Luc.A = array;","","Luc.apply(Luc, require('./is'));","","var EventEmitter = require('./events/eventEmitter');","","Luc.EventEmitter = EventEmitter;","","var Base = require('./class/base');","","Luc.Base = Base;","","var Definer = require('./class/definer');","","Luc.ClassDefiner = Definer;","","Luc.define = Definer.define;","","Luc.Plugin = require('./class/plugin');","","Luc.apply(Luc, {","    compositionEnumns: require('./class/compositionEnumns')","});","","Luc.compare = require('./compare').compare;","","","if(typeof window !== 'undefined') {","    window.Luc = Luc;","}"];

},{"./object":16,"./function":17,"./array":18,"./is":19,"./events/eventEmitter":20,"./class/base":21,"./class/definer":22,"./class/plugin":23,"./class/compositionEnumns":24,"./compare":25}],14:[function(require,module,exports){
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
},{"./lucTestLib":10,"expect.js":13}],16:[function(require,module,exports){
/* automatically generated by JSCoverage - do not edit */
if (typeof _$jscoverage === 'undefined') _$jscoverage = {};
if (! _$jscoverage['object.js']) {
  _$jscoverage['object.js'] = [];
  _$jscoverage['object.js'][26] = 0;
  _$jscoverage['object.js'][27] = 0;
  _$jscoverage['object.js'][31] = 0;
  _$jscoverage['object.js'][32] = 0;
  _$jscoverage['object.js'][33] = 0;
  _$jscoverage['object.js'][37] = 0;
  _$jscoverage['object.js'][48] = 0;
  _$jscoverage['object.js'][49] = 0;
  _$jscoverage['object.js'][53] = 0;
  _$jscoverage['object.js'][54] = 0;
  _$jscoverage['object.js'][55] = 0;
  _$jscoverage['object.js'][59] = 0;
  _$jscoverage['object.js'][84] = 0;
  _$jscoverage['object.js'][85] = 0;
  _$jscoverage['object.js'][88] = 0;
  _$jscoverage['object.js'][89] = 0;
  _$jscoverage['object.js'][90] = 0;
  _$jscoverage['object.js'][93] = 0;
  _$jscoverage['object.js'][94] = 0;
  _$jscoverage['object.js'][95] = 0;
  _$jscoverage['object.js'][136] = 0;
  _$jscoverage['object.js'][137] = 0;
  _$jscoverage['object.js'][140] = 0;
  _$jscoverage['object.js'][141] = 0;
  _$jscoverage['object.js'][144] = 0;
  _$jscoverage['object.js'][181] = 0;
  _$jscoverage['object.js'][182] = 0;
  _$jscoverage['object.js'][184] = 0;
  _$jscoverage['object.js'][185] = 0;
  _$jscoverage['object.js'][186] = 0;
  _$jscoverage['object.js'][187] = 0;
  _$jscoverage['object.js'][188] = 0;
  _$jscoverage['object.js'][189] = 0;
  _$jscoverage['object.js'][191] = 0;
  _$jscoverage['object.js'][199] = 0;
}
_$jscoverage['object.js'][26]++;
exports.apply = (function (toObject, fromObject) {
  _$jscoverage['object.js'][27]++;
  var to = toObject || {}, from = fromObject || {}, prop;
  _$jscoverage['object.js'][31]++;
  for (prop in from) {
    _$jscoverage['object.js'][32]++;
    if (from.hasOwnProperty(prop)) {
      _$jscoverage['object.js'][33]++;
      to[prop] = from[prop];
    }
}
  _$jscoverage['object.js'][37]++;
  return to;
});
_$jscoverage['object.js'][48]++;
exports.mix = (function (toObject, fromObject) {
  _$jscoverage['object.js'][49]++;
  var to = toObject || {}, from = fromObject || {}, prop;
  _$jscoverage['object.js'][53]++;
  for (prop in from) {
    _$jscoverage['object.js'][54]++;
    if (from.hasOwnProperty(prop) && to[prop] === undefined) {
      _$jscoverage['object.js'][55]++;
      to[prop] = from[prop];
    }
}
  _$jscoverage['object.js'][59]++;
  return to;
});
_$jscoverage['object.js'][84]++;
exports.each = (function (obj, fn, thisArg, config) {
  _$jscoverage['object.js'][85]++;
  var key, value, allProperties = config && config.ownProperties === false;
  _$jscoverage['object.js'][88]++;
  if (allProperties) {
    _$jscoverage['object.js'][89]++;
    for (key in obj) {
      _$jscoverage['object.js'][90]++;
      fn.call(thisArg, key, obj[key]);
}
  }
  else {
    _$jscoverage['object.js'][93]++;
    for (key in obj) {
      _$jscoverage['object.js'][94]++;
      if (obj.hasOwnProperty(key)) {
        _$jscoverage['object.js'][95]++;
        fn.call(thisArg, key, obj[key]);
      }
}
  }
});
_$jscoverage['object.js'][136]++;
exports.toObject = (function (strings, values) {
  _$jscoverage['object.js'][137]++;
  var obj = {}, i = 0, len = strings.length;
  _$jscoverage['object.js'][140]++;
  for (; i < len; ++i) {
    _$jscoverage['object.js'][141]++;
    obj[strings[i]] = values[i];
}
  _$jscoverage['object.js'][144]++;
  return obj;
});
_$jscoverage['object.js'][181]++;
exports.filter = (function (obj, filterFn, thisArg, config) {
  _$jscoverage['object.js'][182]++;
  var values = [];
  _$jscoverage['object.js'][184]++;
  exports.each(obj, (function (key, value) {
  _$jscoverage['object.js'][185]++;
  if (filterFn.call(thisArg, key, value)) {
    _$jscoverage['object.js'][186]++;
    if (config.keys === true) {
      _$jscoverage['object.js'][187]++;
      values.push(key);
    }
    else {
      _$jscoverage['object.js'][188]++;
      if (config.values === true) {
        _$jscoverage['object.js'][189]++;
        values.push(value);
      }
      else {
        _$jscoverage['object.js'][191]++;
        values.push({value: value, key: key});
      }
    }
  }
}), thisArg, config);
  _$jscoverage['object.js'][199]++;
  return values;
});
_$jscoverage['object.js'].source = ["/**"," * @class Luc.Object"," * Package for Object methods"," */","","/**"," * Apply the properties from fromObject to the toObject.  fromObject will"," * overwrite any shared keys.  It can also be used as a simple shallow clone."," * ","    var to = {a:1, c:1}, from = {a:2, b:2}","    Luc.Object.apply(to, from)","    &gt;Object {a: 2, c: 1, b: 2}","    to === to","    &gt;true","    var clone = Luc.Object.apply({}, from)","    &gt;undefined","    clone","    &gt;Object {a: 2, b: 2}","    clone === from","    &gt;false"," *"," * @param  {Object|undefined} toObject Object to put the properties fromObject on."," * @param  {Object|undefined} fromObject Object to put the properties on the toObject"," * @return {Object} the toObject"," */","exports.apply = function(toObject, fromObject) {","    var to = toObject || {},","        from = fromObject || {},","        prop;","","    for (prop in from) {","        if (from.hasOwnProperty(prop)) {","            to[prop] = from[prop];","        }","    }","","    return to;","};","","/**"," * Similar to Luc.Object.apply except that the fromObject will "," * NOT overwrite the keys of the toObject if they are defined."," * "," * @param  {Object|undefined} toObject Object to put the properties fromObject on."," * @param  {Object|undefined} fromObject Object to put the properties on the toObject"," * @return {Object} the toObject"," */","exports.mix = function(toObject, fromObject) {","    var to = toObject || {},","        from = fromObject || {},","        prop;","","    for (prop in from) {","        if (from.hasOwnProperty(prop) &amp;&amp; to[prop] === undefined) {","            to[prop] = from[prop];","        }","    }","","    return to;","};","","/**"," * Iterate over an objects properties"," * as key value \"pairs\" with the passed in function."," * ","    var context = {val:1};","    Luc.Object.each({","        key: 1","    }, function(key, value) {","        console.log(value + key + this.val)","    }, context)","    ","    &gt;1key1 "," "," * @param  {Object}   obj  the object to iterate over"," * @param  {Function} fn   the function to call"," * @param  {String} fn.key   the object key"," * @param  {Object} fn.value   the object value"," * @param  {Object}   [thisArg] "," * @param {Object}  [config]"," * @param {Boolean}  config.ownProperties set to false"," * to iterate over all of the objects enumerable properties."," */","exports.each = function(obj, fn, thisArg, config) {","    var key, value,","        allProperties = config &amp;&amp; config.ownProperties === false;","","    if (allProperties) {","        for (key in obj) {","            fn.call(thisArg, key, obj[key]);","        }","    } else {","        for (key in obj) {","            if (obj.hasOwnProperty(key)) {","                fn.call(thisArg, key, obj[key]);","            }","        }","    }","};","","/**"," * Take an array of strings and an array/arguments of"," * values and return an object of key value pairs"," * based off each arrays index.  It is useful for taking"," * a long list of arguments and creating an object that can"," * be passed to other methods."," * ","    function longArgs(a,b,c,d,e,f) {","        return Luc.Object.toObject(['a','b', 'c', 'd', 'e', 'f'], arguments)","    }","","    longArgs(1,2,3,4,5,6,7,8,9)","","    &gt;Object {a: 1, b: 2, c: 3, d: 4, e: 5&#226;&#128;&#166;}","    a: 1","    b: 2","    c: 3","    d: 4","    e: 5","    f: 6","","    longArgs(1,2,3)","","    &gt;Object {a: 1, b: 2, c: 3, d: undefined, e: undefined&#226;&#128;&#166;}","    a: 1","    b: 2","    c: 3","    d: undefined","    e: undefined","    f: undefined",""," * @param  {String[]} strings"," * @param  {Array/arguments} values"," * @return {Object}"," */","exports.toObject = function(strings, values) {","    var obj = {},","        i = 0,","        len = strings.length;","    for (; i &lt; len; ++i) {","        obj[strings[i]] = values[i];","    }","","    return obj;","};","","/**"," * Return key value pairs from the object if the"," * filterFn returns a truthy value."," *","    Luc.Object.filter({","        a: false,","        b: true,","        c: false","    }, function(key, value) {","        return key === 'a' || value","    })","    &gt;[{key: 'a', value: false}, {key: 'b', value: true}]"," * "," * @param  {Object}   obj  the object to iterate over"," * @param  {Function} filterFn   the function to call, return a truthy value"," * to add the key value pair"," * @param  {String} filterFn.key   the object key"," * @param  {Object} filterFn.value   the object value"," * @param  {Object}   [thisArg] "," * @param {Object}  [config]"," * @param {Boolean}  config.ownProperties set to false"," * to iterate over all of the objects enumerable properties."," * "," * @param {Boolean}  config.keys set to true to return"," * just the keys."," *"," * @param {Boolean}  config.values set to true to return"," * just the values."," * "," * @return {Object[]/String[]} Array of key value pairs in the form"," * of {key: 'key', value: value}.  If keys or values is true on the config"," * just the keys or values are return."," *"," */","exports.filter = function(obj, filterFn, thisArg, config) {","    var values = [];","","    exports.each(obj, function(key, value) {","        if (filterFn.call(thisArg, key, value)) {","            if (config.keys === true) {","                values.push(key);","            } else if (config.values === true) {","                values.push(value);","            } else {","                values.push({","                    value: value,","                    key: key","                });","            }","        }","    }, thisArg, config);","","    return values;","};"];

},{}],19:[function(require,module,exports){
/* automatically generated by JSCoverage - do not edit */
if (typeof _$jscoverage === 'undefined') _$jscoverage = {};
if (! _$jscoverage['is.js']) {
  _$jscoverage['is.js'] = [];
  _$jscoverage['is.js'][1] = 0;
  _$jscoverage['is.js'][16] = 0;
  _$jscoverage['is.js'][17] = 0;
  _$jscoverage['is.js'][26] = 0;
  _$jscoverage['is.js'][27] = 0;
  _$jscoverage['is.js'][36] = 0;
  _$jscoverage['is.js'][37] = 0;
  _$jscoverage['is.js'][46] = 0;
  _$jscoverage['is.js'][47] = 0;
  _$jscoverage['is.js'][56] = 0;
  _$jscoverage['is.js'][57] = 0;
  _$jscoverage['is.js'][66] = 0;
  _$jscoverage['is.js'][67] = 0;
  _$jscoverage['is.js'][76] = 0;
  _$jscoverage['is.js'][77] = 0;
  _$jscoverage['is.js'][86] = 0;
  _$jscoverage['is.js'][87] = 0;
  _$jscoverage['is.js'][95] = 0;
  _$jscoverage['is.js'][96] = 0;
  _$jscoverage['is.js'][106] = 0;
  _$jscoverage['is.js'][107] = 0;
  _$jscoverage['is.js'][109] = 0;
  _$jscoverage['is.js'][110] = 0;
  _$jscoverage['is.js'][111] = 0;
  _$jscoverage['is.js'][112] = 0;
  _$jscoverage['is.js'][113] = 0;
  _$jscoverage['is.js'][114] = 0;
  _$jscoverage['is.js'][117] = 0;
  _$jscoverage['is.js'][120] = 0;
}
_$jscoverage['is.js'][1]++;
var oToString = Object.prototype.toString;
_$jscoverage['is.js'][16]++;
function isArray(obj) {
  _$jscoverage['is.js'][17]++;
  return Array.isArray(obj);
}
_$jscoverage['is.js'][26]++;
function isObject(obj) {
  _$jscoverage['is.js'][27]++;
  return oToString.call(obj) === "[object Object]";
}
_$jscoverage['is.js'][36]++;
function isFunction(obj) {
  _$jscoverage['is.js'][37]++;
  return oToString.call(obj) === "[object Function]";
}
_$jscoverage['is.js'][46]++;
function isDate(obj) {
  _$jscoverage['is.js'][47]++;
  return oToString.call(obj) === "[object Date]";
}
_$jscoverage['is.js'][56]++;
function isRegExp(obj) {
  _$jscoverage['is.js'][57]++;
  return oToString.call(obj) === "[object RegExp]";
}
_$jscoverage['is.js'][66]++;
function isNumber(obj) {
  _$jscoverage['is.js'][67]++;
  return oToString.call(obj) === "[object Number]";
}
_$jscoverage['is.js'][76]++;
function isString(obj) {
  _$jscoverage['is.js'][77]++;
  return oToString.call(obj) === "[object String]";
}
_$jscoverage['is.js'][86]++;
function isBoolean(obj) {
  _$jscoverage['is.js'][87]++;
  return oToString.call(obj) === "[object Boolean]";
}
_$jscoverage['is.js'][95]++;
function isFalsy(obj) {
  _$jscoverage['is.js'][96]++;
  return (! obj && obj !== 0);
}
_$jscoverage['is.js'][106]++;
function isEmpty(obj) {
  _$jscoverage['is.js'][107]++;
  var empty = false;
  _$jscoverage['is.js'][109]++;
  if (isFalsy(obj)) {
    _$jscoverage['is.js'][110]++;
    empty = true;
  }
  else {
    _$jscoverage['is.js'][111]++;
    if (isArray(obj)) {
      _$jscoverage['is.js'][112]++;
      empty = obj.length === 0;
    }
    else {
      _$jscoverage['is.js'][113]++;
      if (isObject(obj)) {
        _$jscoverage['is.js'][114]++;
        empty = Object.keys(obj).length === 0;
      }
    }
  }
  _$jscoverage['is.js'][117]++;
  return empty;
}
_$jscoverage['is.js'][120]++;
module.exports = {isArray: isArray, isObject: isObject, isFunction: isFunction, isDate: isDate, isString: isString, isNumber: isNumber, isRegExp: isRegExp, isBoolean: isBoolean, isFalsy: isFalsy, isEmpty: isEmpty};
_$jscoverage['is.js'].source = ["var oToString = Object.prototype.toString;","/**"," * @class Luc.is "," * Package for determining the types of objects"," * it also has an Luc.is.isEmpty and Luc.is.isFalsy "," * functions."," */","","","/**"," * Return true if the passed in object is of"," * the type {@link Array Array}"," * @param  {Object}  obj "," * @return {Boolean}"," */","function isArray(obj) {","    return Array.isArray(obj);","}","","/**"," * Return true if the passed in object is of"," * the type {@link Object Object}"," * @param  {Object}  obj "," * @return {Boolean}"," */","function isObject(obj) {","    return oToString.call(obj) === '[object Object]';","}","","/**"," * Return true if the passed in object is of"," * the type {@link Function Function}"," * @param  {Object}  obj "," * @return {Boolean}"," */","function isFunction(obj) {","    return oToString.call(obj) === '[object Function]';","}","","/**"," * Return true if the passed in object is of"," * the type {@link Date Date}"," * @param  {Object}  obj "," * @return {Boolean}"," */","function isDate(obj) {","    return oToString.call(obj) === '[object Date]';","}","","/**"," * Return true if the passed in object is of"," * the type {@link RegExp RegExp}"," * @param  {Object}  obj "," * @return {Boolean}"," */","function isRegExp(obj) {","    return oToString.call(obj) === '[object RegExp]';","}","","/**"," * Return true if the passed in object is of"," * the type {@link Number Number}"," * @param  {Object}  obj "," * @return {Boolean}"," */","function isNumber(obj) {","    return oToString.call(obj) === '[object Number]';","}","","/**"," * Return true if the passed in object is of"," * the type {@link String String}"," * @param  {Object}  obj "," * @return {Boolean}"," */","function isString(obj) {","    return oToString.call(obj) === '[object String]';","}","","/**"," * Return true if the passed in object is of"," * the type {@link Boolean Boolean}"," * @param  {Object}  obj "," * @return {Boolean}"," */","function isBoolean(obj) {","    return oToString.call(obj) === '[object Boolean]';","}","","/**"," * Return true if the object is falsy but not 0."," * @param  {Object}  obj"," * @return {Boolean}     "," */","function isFalsy(obj) {","    return (!obj &amp;&amp; obj !== 0);","}","","/**"," * Return true if the object is empty."," * {}, [], '',false, null, undefined, NaN "," * Are all treated as empty."," * @param  {Object}  obj"," * @return {Boolean}"," */","function isEmpty(obj) {","    var empty = false;","","    if (isFalsy(obj)) {","        empty = true;","    } else if (isArray(obj)) {","        empty = obj.length === 0;","    } else if (isObject(obj)) {","        empty = Object.keys(obj).length === 0;","    }","","    return empty;","}","","module.exports = {","    isArray: isArray,","    isObject: isObject,","    isFunction: isFunction,","    isDate: isDate,","    isString: isString,","    isNumber: isNumber,","    isRegExp: isRegExp,","    isBoolean: isBoolean,","    isFalsy: isFalsy,","    isEmpty: isEmpty","};"];

},{}],20:[function(require,module,exports){
/* automatically generated by JSCoverage - do not edit */
if (typeof _$jscoverage === 'undefined') _$jscoverage = {};
if (! _$jscoverage['events/eventEmitter.js']) {
  _$jscoverage['events/eventEmitter.js'] = [];
  _$jscoverage['events/eventEmitter.js'][7] = 0;
  _$jscoverage['events/eventEmitter.js'][15] = 0;
  _$jscoverage['events/eventEmitter.js'][17] = 0;
  _$jscoverage['events/eventEmitter.js'][19] = 0;
  _$jscoverage['events/eventEmitter.js'][20] = 0;
  _$jscoverage['events/eventEmitter.js'][23] = 0;
  _$jscoverage['events/eventEmitter.js'][25] = 0;
  _$jscoverage['events/eventEmitter.js'][28] = 0;
}
_$jscoverage['events/eventEmitter.js'][7]++;
var EventEmitter = require("events").EventEmitter;
_$jscoverage['events/eventEmitter.js'][15]++;
EventEmitter.prototype.once = (function (type, listener) {
  _$jscoverage['events/eventEmitter.js'][17]++;
  var self = this, g = (function () {
  _$jscoverage['events/eventEmitter.js'][19]++;
  self.removeListener(type, g);
  _$jscoverage['events/eventEmitter.js'][20]++;
  listener.apply(this, arguments);
});
  _$jscoverage['events/eventEmitter.js'][23]++;
  self.on(type, g);
  _$jscoverage['events/eventEmitter.js'][25]++;
  return this;
});
_$jscoverage['events/eventEmitter.js'][28]++;
module.exports = EventEmitter;
_$jscoverage['events/eventEmitter.js'].source = ["/**"," * @license https://raw.github.com/joyent/node/v0.10.11/LICENSE"," * Node js licence. EventEmitter will be in the client"," * only code."," */","","var EventEmitter = require('events').EventEmitter;","","/**"," * @class Luc.EventEmitter"," * The wonderful event emmiter that comes with node,"," * that works in the supported browsers."," * [http://nodejs.org/api/events.html](http://nodejs.org/api/events.html)"," */","EventEmitter.prototype.once = function(type, listener) {","    //put in fix for IE 9 and below","    var self = this,","        g = function() {","            self.removeListener(type, g);","            listener.apply(this, arguments);","        };","","    self.on(type, g);","","    return this;","};","","module.exports = EventEmitter;"];

},{"events":26}],26:[function(require,module,exports){
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
},{"__browserify_process":9}],17:[function(require,module,exports){
/* automatically generated by JSCoverage - do not edit */
if (typeof _$jscoverage === 'undefined') _$jscoverage = {};
if (! _$jscoverage['function.js']) {
  _$jscoverage['function.js'] = [];
  _$jscoverage['function.js'][1] = 0;
  _$jscoverage['function.js'][3] = 0;
  _$jscoverage['function.js'][10] = 0;
  _$jscoverage['function.js'][11] = 0;
  _$jscoverage['function.js'][15] = 0;
  _$jscoverage['function.js'][16] = 0;
  _$jscoverage['function.js'][19] = 0;
  _$jscoverage['function.js'][20] = 0;
  _$jscoverage['function.js'][21] = 0;
  _$jscoverage['function.js'][23] = 0;
  _$jscoverage['function.js'][26] = 0;
  _$jscoverage['function.js'][33] = 0;
  _$jscoverage['function.js'][40] = 0;
  _$jscoverage['function.js'][41] = 0;
  _$jscoverage['function.js'][104] = 0;
  _$jscoverage['function.js'][105] = 0;
  _$jscoverage['function.js'][107] = 0;
  _$jscoverage['function.js'][108] = 0;
  _$jscoverage['function.js'][112] = 0;
  _$jscoverage['function.js'][113] = 0;
  _$jscoverage['function.js'][114] = 0;
  _$jscoverage['function.js'][115] = 0;
  _$jscoverage['function.js'][117] = 0;
  _$jscoverage['function.js'][118] = 0;
  _$jscoverage['function.js'][121] = 0;
  _$jscoverage['function.js'][124] = 0;
  _$jscoverage['function.js'][157] = 0;
  _$jscoverage['function.js'][158] = 0;
  _$jscoverage['function.js'][160] = 0;
  _$jscoverage['function.js'][161] = 0;
  _$jscoverage['function.js'][164] = 0;
  _$jscoverage['function.js'][165] = 0;
  _$jscoverage['function.js'][168] = 0;
  _$jscoverage['function.js'][209] = 0;
  _$jscoverage['function.js'][210] = 0;
  _$jscoverage['function.js'][212] = 0;
  _$jscoverage['function.js'][213] = 0;
  _$jscoverage['function.js'][216] = 0;
  _$jscoverage['function.js'][217] = 0;
  _$jscoverage['function.js'][219] = 0;
  _$jscoverage['function.js'][222] = 0;
  _$jscoverage['function.js'][253] = 0;
  _$jscoverage['function.js'][254] = 0;
  _$jscoverage['function.js'][256] = 0;
  _$jscoverage['function.js'][257] = 0;
  _$jscoverage['function.js'][260] = 0;
  _$jscoverage['function.js'][261] = 0;
  _$jscoverage['function.js'][262] = 0;
  _$jscoverage['function.js'][264] = 0;
  _$jscoverage['function.js'][268] = 0;
  _$jscoverage['function.js'][286] = 0;
  _$jscoverage['function.js'][287] = 0;
  _$jscoverage['function.js'][290] = 0;
  _$jscoverage['function.js'][291] = 0;
  _$jscoverage['function.js'][294] = 0;
  _$jscoverage['function.js'][295] = 0;
  _$jscoverage['function.js'][297] = 0;
  _$jscoverage['function.js'][298] = 0;
  _$jscoverage['function.js'][301] = 0;
  _$jscoverage['function.js'][302] = 0;
  _$jscoverage['function.js'][303] = 0;
  _$jscoverage['function.js'][321] = 0;
  _$jscoverage['function.js'][322] = 0;
  _$jscoverage['function.js'][324] = 0;
  _$jscoverage['function.js'][325] = 0;
  _$jscoverage['function.js'][328] = 0;
  _$jscoverage['function.js'][329] = 0;
  _$jscoverage['function.js'][331] = 0;
  _$jscoverage['function.js'][332] = 0;
}
_$jscoverage['function.js'][1]++;
var is = require("./is"), aInsert = require("./array").insert;
_$jscoverage['function.js'][3]++;
aEach = require("./array").each;
_$jscoverage['function.js'][10]++;
function augmentArgs(config, callArgs) {
  _$jscoverage['function.js'][11]++;
  var configArgs = config.args, index = config.index, argsArray;
  _$jscoverage['function.js'][15]++;
  if (! configArgs) {
    _$jscoverage['function.js'][16]++;
    return callArgs;
  }
  _$jscoverage['function.js'][19]++;
  if (index === true || is.isNumber(index)) {
    _$jscoverage['function.js'][20]++;
    if (config.argumentsFirst === false) {
      _$jscoverage['function.js'][21]++;
      return aInsert(configArgs, callArgs, index);
    }
    _$jscoverage['function.js'][23]++;
    return aInsert(callArgs, configArgs, index);
  }
  _$jscoverage['function.js'][26]++;
  return configArgs;
}
_$jscoverage['function.js'][33]++;
exports.emptyFn = (function () {
});
_$jscoverage['function.js'][40]++;
exports.abstractFn = (function () {
  _$jscoverage['function.js'][41]++;
  throw new Error("abstractFn must be implemented");
});
_$jscoverage['function.js'][104]++;
exports.createAugmentor = (function (fn, config) {
  _$jscoverage['function.js'][105]++;
  var thisArg = config.thisArg;
  _$jscoverage['function.js'][107]++;
  return (function () {
  _$jscoverage['function.js'][108]++;
  return fn.apply(thisArg || this, augmentArgs(config, arguments));
});
});
_$jscoverage['function.js'][112]++;
function initSequenceFunctions(fns, config) {
  _$jscoverage['function.js'][113]++;
  var toRun = [];
  _$jscoverage['function.js'][114]++;
  aEach(fns, (function (f) {
  _$jscoverage['function.js'][115]++;
  var fn = f;
  _$jscoverage['function.js'][117]++;
  if (config) {
    _$jscoverage['function.js'][118]++;
    fn = exports.createAugmentor(f, config);
  }
  _$jscoverage['function.js'][121]++;
  toRun.push(fn);
}));
  _$jscoverage['function.js'][124]++;
  return toRun;
}
_$jscoverage['function.js'][157]++;
exports.createSequence = (function (fns, config) {
  _$jscoverage['function.js'][158]++;
  var functions = initSequenceFunctions(fns, config);
  _$jscoverage['function.js'][160]++;
  return (function () {
  _$jscoverage['function.js'][161]++;
  var i = 0, len = functions.length;
  _$jscoverage['function.js'][164]++;
  for (; i < len - 1; ++i) {
    _$jscoverage['function.js'][165]++;
    functions[i].apply(this, arguments);
}
  _$jscoverage['function.js'][168]++;
  return functions[len - 1].apply(this, arguments);
});
});
_$jscoverage['function.js'][209]++;
exports.createSequenceIf = (function (fns, config) {
  _$jscoverage['function.js'][210]++;
  var functions = initSequenceFunctions(fns, config);
  _$jscoverage['function.js'][212]++;
  return (function () {
  _$jscoverage['function.js'][213]++;
  var value, args = arguments;
  _$jscoverage['function.js'][216]++;
  functions.some((function (fn) {
  _$jscoverage['function.js'][217]++;
  value = fn.apply(this, args);
  _$jscoverage['function.js'][219]++;
  return value === false;
}), this);
  _$jscoverage['function.js'][222]++;
  return value;
});
});
_$jscoverage['function.js'][253]++;
exports.createRelayer = (function (fns, config) {
  _$jscoverage['function.js'][254]++;
  var functions = initSequenceFunctions(fns, config);
  _$jscoverage['function.js'][256]++;
  return (function () {
  _$jscoverage['function.js'][257]++;
  var value, args = arguments;
  _$jscoverage['function.js'][260]++;
  functions.forEach((function (fn, index) {
  _$jscoverage['function.js'][261]++;
  if (index === 0) {
    _$jscoverage['function.js'][262]++;
    value = fn.apply(this, args);
  }
  else {
    _$jscoverage['function.js'][264]++;
    value = fn.apply(this, [value]);
  }
}), this);
  _$jscoverage['function.js'][268]++;
  return value;
});
});
_$jscoverage['function.js'][286]++;
exports.createThrotteled = (function (f, millis, config) {
  _$jscoverage['function.js'][287]++;
  var fn = config? exports.createAugmentor(f, config): f, timeOutId = false;
  _$jscoverage['function.js'][290]++;
  if (! millis) {
    _$jscoverage['function.js'][291]++;
    return fn;
  }
  _$jscoverage['function.js'][294]++;
  return (function () {
  _$jscoverage['function.js'][295]++;
  var args = arguments;
  _$jscoverage['function.js'][297]++;
  if (timeOutId) {
    _$jscoverage['function.js'][298]++;
    clearTimeout(timeOutId);
  }
  _$jscoverage['function.js'][301]++;
  timeOutId = setTimeout((function () {
  _$jscoverage['function.js'][302]++;
  timeOutId = false;
  _$jscoverage['function.js'][303]++;
  fn.apply(this, args);
}), millis);
});
});
_$jscoverage['function.js'][321]++;
exports.createDeferred = (function (f, millis, config) {
  _$jscoverage['function.js'][322]++;
  var fn = config? exports.createAugmentor(f, config): f;
  _$jscoverage['function.js'][324]++;
  if (! millis) {
    _$jscoverage['function.js'][325]++;
    return fn;
  }
  _$jscoverage['function.js'][328]++;
  return (function () {
  _$jscoverage['function.js'][329]++;
  var args = arguments;
  _$jscoverage['function.js'][331]++;
  setTimeout((function () {
  _$jscoverage['function.js'][332]++;
  fn.apply(this, args);
}), millis);
});
});
_$jscoverage['function.js'].source = ["var is = require('./is'),","    aInsert = require('./array').insert;","    aEach = require('./array').each;","","/**"," * @class Luc.Function"," * Package for function methods."," */","","function augmentArgs(config, callArgs) {","    var configArgs = config.args,","        index = config.index,","        argsArray;","","    if (!configArgs) {","        return callArgs;","    }","","    if(index === true || is.isNumber(index)) {","        if(config.argumentsFirst === false) {","            return aInsert(configArgs, callArgs, index);","        }","        return aInsert(callArgs, configArgs, index);","    }","","    return configArgs;","}","","/**"," * A reusable empty function"," * @return {Function}"," */","exports.emptyFn = function() {};","","/**"," * A function that throws an error when called."," * Useful when defining abstract like classes"," * @return {Function}"," */","exports.abstractFn = function() {","    throw new Error('abstractFn must be implemented');","};","","/**"," * Agument the passed in function's thisArg and or aguments object "," * based on the passed in config."," * "," * @param  {Function} fn the function to call"," * @param  {Object} config"," * "," * @param {Object} [config.thisArg] the thisArg for the funciton being executed."," * If this is the only property on your config object the prefered way would"," * be just to use Function.bind"," * "," * @param {Array} [config.args] the arguments used for the function being executed."," * This will replace the functions call args if index is not a number or "," * true."," * "," * @param {Number/True} [config.index] By defualt the the configured arguments"," * will be inserted into the functions passed in call arguments.  If index is true"," * append the args together if it is a number insert it at the passed in index."," * "," * @param {Array} [config.argumentsFirst] pass in false to "," * agument the configured args first with Luc.Array.insert.  Defaults"," * to true","     ","     function fn() {","        console.log(this)","        console.log(arguments)","    }","","    Luc.Function.createAugmentor(fn, {","        thisArg: {configedThisArg: true},","        args: [1,2,3],","        index:0","    })(4)","","    &gt;Object {configedThisArg: true}","    &gt;[1, 2, 3, 4]","","    Luc.Function.createAugmentor(fn, {","        thisArg: {configedThisArg: true},","        args: [1,2,3],","        index:0,","        argumentsFirst:false","    })(4)","","    &gt;Object {configedThisArg: true}","    &gt;[4, 1, 2, 3]","","","    var f = Luc.Function.createAugmentor(fn, {","        args: [1,2,3],","        index: true","    });","","    f.apply({config: false}, [4])","","    &gt;Object {config: false}","    &gt;[4, 1, 2, 3]",""," * @return {Function} the augmented function."," */","exports.createAugmentor = function(fn, config) {","    var thisArg = config.thisArg;","","    return function() {","        return fn.apply(thisArg || this, augmentArgs(config, arguments));","    };","};","","function initSequenceFunctions(fns, config) {","    var toRun = [];","    aEach(fns, function(f) {","        var fn = f;","","        if (config) {","            fn = exports.createAugmentor(f, config);","        }","","        toRun.push(fn);","    });","","    return toRun;","}","","/**"," * Return a function that runs the passed in functions"," * and returns the result of the last function called."," * "," * @param  {Function/Function[]} fns "," * @param  {Object} [config] Config object"," * for Luc.Function.createAugmentor.  If defined all of the functions"," * will get created with the passed in config;"," *","    Luc.Function.createSequence([","        function() {","            console.log(1)","        },","        function() {","            console.log(2)","        },","        function() {","            console.log(3)","            console.log('finished logging')","            return 4;","        }","    ])()","    &gt;1","    &gt;2","    &gt;3","    &gt;finished logging","    &gt;4"," * "," * @return {Function}"," */","exports.createSequence = function(fns, config) {","    var functions = initSequenceFunctions(fns, config);","","    return function() {","        var i = 0,","            len = functions.length;","","        for(;i &lt; len -1; ++i) {","            functions[i].apply(this, arguments);","        }","","        return functions[len -1 ].apply(this, arguments);","    };","};","","/**"," * Return a function that runs the passed in functions"," * if one of the functions results false the rest of the "," * functions won't run and false will be returned."," *"," * If no false is returned the value of the last function return will be returned"," * "," * @param  {Function/Function[]} fns "," * @param  {Object} [config] Config object"," * for Luc.Function.createAugmentor.  If defined all of the functions"," * will get created with the passed in config;","","    Luc.Function.createSequenceIf([","        function() {","            console.log(1)","        },","        function() {","            console.log(2)","        },","        function() {","            console.log(3)","            console.log('finished logging')","            return 4;","        }, function() {","            return false;","        }, function() {","            console.log('i cant log')","        }","    ])()","","    &gt;1","    &gt;2","    &gt;3","    &gt;finished logging","    &gt;false"," * @return {Function}"," */","exports.createSequenceIf = function(fns, config) {","    var functions = initSequenceFunctions(fns, config);","","    return function() {","        var value,","            args = arguments;","","        functions.some(function(fn){","            value = fn.apply(this, args);","","            return value === false;","        }, this);","","        return value;","    };","};","","/**"," * Return a functions that runs the passed in functions"," * the result of each function will be the the call args "," * for the next function.  The value of the last function "," * return will be returned."," * "," * @param  {Function/Function[]} fns "," * @param  {Object} [config] Config object"," * for Luc.Function.createAugmentor.  If defined all of the functions"," * will get created with the passed in config;","     ","     Luc.Function.createRelayer([","        function(str) {","            return str + 'b'","        },","        function(str) {","            return str + 'c'","        },","        function(str) {","            return str + 'd'","        }","    ])('a')","","    &gt;\"abcd\"",""," * @return {Function}"," */","exports.createRelayer = function(fns, config) {","    var functions = initSequenceFunctions(fns, config);","","    return function() {","        var value,","            args = arguments;","","        functions.forEach(function(fn, index) {","            if (index === 0) {","                value = fn.apply(this, args);","            } else {","                value = fn.apply(this, [value]);","            }","        }, this);","","        return value;","    };","};","","/**"," * Create a throttled function that the passed in funciton"," * only gets evoked once even it is called many times"," *"," * "," * @param  {Function} fn"," * @param  {Number} [millis] Number of milliseconds to"," * throttle the function."," * @param  {Object} [config] Config object"," * for Luc.Function.createAugmentor.  If defined all of the functions"," * will get created with the passed in config;"," * "," * @return {Function}"," */","exports.createThrotteled = function(f, millis, config) {","    var fn = config ? exports.createAugmentor(f, config) : f,","        timeOutId = false;","","    if(!millis) {","        return fn;","    }","","    return function() {","        var args = arguments;","","        if(timeOutId) {","            clearTimeout(timeOutId);","        }","","        timeOutId = setTimeout(function() {","            timeOutId = false;","            fn.apply(this, args);","        }, millis);","    };","};","","/**"," * Defer a function's execution for the passed in"," * milliseconds."," * "," * @param  {Function} fn"," * @param  {Number} [millis] Number of milliseconds to"," * defer"," * @param  {Object} [config] Config object"," * for Luc.Function.createAugmentor.  If defined all of the functions"," * will get created with the passed in config;"," * "," * @return {Function}"," */","exports.createDeferred = function(f, millis, config) {","    var fn = config ? exports.createAugmentor(f, config) : f;","","    if(!millis) {","        return fn;","    }","","    return function() {","        var args = arguments;","","        setTimeout(function() {","            fn.apply(this, args);","        }, millis);","    };","};"];

},{"./is":19,"./array":18}],18:[function(require,module,exports){
/* automatically generated by JSCoverage - do not edit */
if (typeof _$jscoverage === 'undefined') _$jscoverage = {};
if (! _$jscoverage['array.js']) {
  _$jscoverage['array.js'] = [];
  _$jscoverage['array.js'][1] = 0;
  _$jscoverage['array.js'][6] = 0;
  _$jscoverage['array.js'][7] = 0;
  _$jscoverage['array.js'][8] = 0;
  _$jscoverage['array.js'][11] = 0;
  _$jscoverage['array.js'][14] = 0;
  _$jscoverage['array.js'][15] = 0;
  _$jscoverage['array.js'][17] = 0;
  _$jscoverage['array.js'][18] = 0;
  _$jscoverage['array.js'][93] = 0;
  _$jscoverage['array.js'][94] = 0;
  _$jscoverage['array.js'][95] = 0;
  _$jscoverage['array.js'][97] = 0;
  _$jscoverage['array.js'][124] = 0;
  _$jscoverage['array.js'][125] = 0;
  _$jscoverage['array.js'][126] = 0;
  _$jscoverage['array.js'][149] = 0;
  _$jscoverage['array.js'][150] = 0;
  _$jscoverage['array.js'][155] = 0;
  _$jscoverage['array.js'][156] = 0;
  _$jscoverage['array.js'][159] = 0;
  _$jscoverage['array.js'][160] = 0;
  _$jscoverage['array.js'][162] = 0;
  _$jscoverage['array.js'][165] = 0;
  _$jscoverage['array.js'][175] = 0;
  _$jscoverage['array.js'][176] = 0;
  _$jscoverage['array.js'][177] = 0;
  _$jscoverage['array.js'][178] = 0;
  _$jscoverage['array.js'][181] = 0;
  _$jscoverage['array.js'][182] = 0;
  _$jscoverage['array.js'][184] = 0;
  _$jscoverage['array.js'][185] = 0;
  _$jscoverage['array.js'][186] = 0;
  _$jscoverage['array.js'][187] = 0;
  _$jscoverage['array.js'][191] = 0;
  _$jscoverage['array.js'][226] = 0;
  _$jscoverage['array.js'][227] = 0;
  _$jscoverage['array.js'][228] = 0;
  _$jscoverage['array.js'][245] = 0;
  _$jscoverage['array.js'][246] = 0;
  _$jscoverage['array.js'][247] = 0;
  _$jscoverage['array.js'][251] = 0;
  _$jscoverage['array.js'][252] = 0;
  _$jscoverage['array.js'][255] = 0;
  _$jscoverage['array.js'][256] = 0;
  _$jscoverage['array.js'][257] = 0;
  _$jscoverage['array.js'][258] = 0;
  _$jscoverage['array.js'][262] = 0;
  _$jscoverage['array.js'][263] = 0;
  _$jscoverage['array.js'][266] = 0;
  _$jscoverage['array.js'][283] = 0;
  _$jscoverage['array.js'][284] = 0;
  _$jscoverage['array.js'][285] = 0;
  _$jscoverage['array.js'][303] = 0;
  _$jscoverage['array.js'][304] = 0;
  _$jscoverage['array.js'][305] = 0;
  _$jscoverage['array.js'][308] = 0;
  _$jscoverage['array.js'][309] = 0;
  _$jscoverage['array.js'][310] = 0;
  _$jscoverage['array.js'][311] = 0;
  _$jscoverage['array.js'][312] = 0;
  _$jscoverage['array.js'][313] = 0;
  _$jscoverage['array.js'][317] = 0;
  _$jscoverage['array.js'][334] = 0;
  _$jscoverage['array.js'][335] = 0;
  _$jscoverage['array.js'][336] = 0;
  _$jscoverage['array.js'][353] = 0;
  _$jscoverage['array.js'][354] = 0;
  _$jscoverage['array.js'][355] = 0;
  _$jscoverage['array.js'][358] = 0;
  _$jscoverage['array.js'][359] = 0;
  _$jscoverage['array.js'][360] = 0;
  _$jscoverage['array.js'][378] = 0;
  _$jscoverage['array.js'][379] = 0;
  _$jscoverage['array.js'][380] = 0;
  _$jscoverage['array.js'][398] = 0;
  _$jscoverage['array.js'][399] = 0;
  _$jscoverage['array.js'][400] = 0;
  _$jscoverage['array.js'][404] = 0;
  _$jscoverage['array.js'][405] = 0;
  _$jscoverage['array.js'][406] = 0;
  _$jscoverage['array.js'][407] = 0;
  _$jscoverage['array.js'][408] = 0;
  _$jscoverage['array.js'][409] = 0;
  _$jscoverage['array.js'][410] = 0;
  _$jscoverage['array.js'][411] = 0;
  _$jscoverage['array.js'][413] = 0;
  _$jscoverage['array.js'][414] = 0;
  _$jscoverage['array.js'][415] = 0;
  _$jscoverage['array.js'][416] = 0;
  _$jscoverage['array.js'][418] = 0;
  _$jscoverage['array.js'][419] = 0;
  _$jscoverage['array.js'][422] = 0;
  _$jscoverage['array.js'][423] = 0;
  _$jscoverage['array.js'][424] = 0;
  _$jscoverage['array.js'][428] = 0;
  _$jscoverage['array.js'][429] = 0;
  _$jscoverage['array.js'][430] = 0;
  _$jscoverage['array.js'][431] = 0;
}
_$jscoverage['array.js'][1]++;
var arraySlice = Array.prototype.slice, compare = require("./compare"), is = require("./is"), createBoundCompareFn = compare.createBoundCompareFn;
_$jscoverage['array.js'][6]++;
function _createIteratorFn(fn, config) {
  _$jscoverage['array.js'][7]++;
  if (is.isFunction(fn) && (config? config.type !== "strict": true)) {
    _$jscoverage['array.js'][8]++;
    return config? fn.bind(config): fn;
  }
  _$jscoverage['array.js'][11]++;
  return createBoundCompareFn(fn, config);
}
_$jscoverage['array.js'][14]++;
function _createIteratorNotFn(fn, config) {
  _$jscoverage['array.js'][15]++;
  var functionToNot = _createIteratorFn(fn, config);
  _$jscoverage['array.js'][17]++;
  return (function () {
  _$jscoverage['array.js'][18]++;
  return ! functionToNot.apply(this, arguments);
});
}
_$jscoverage['array.js'][93]++;
function toArray(item) {
  _$jscoverage['array.js'][94]++;
  if (Array.isArray(item)) {
    _$jscoverage['array.js'][95]++;
    return item;
  }
  _$jscoverage['array.js'][97]++;
  return (item === null || item === undefined)? []: [item];
}
_$jscoverage['array.js'][124]++;
function each(item, fn, context) {
  _$jscoverage['array.js'][125]++;
  var arr = toArray(item);
  _$jscoverage['array.js'][126]++;
  return arr.forEach.call(arr, fn, context);
}
_$jscoverage['array.js'][149]++;
function insert(firstArrayOrArgs, secondArrayOrArgs, indexOrAppend) {
  _$jscoverage['array.js'][150]++;
  var firstArray = arraySlice.call(firstArrayOrArgs), secondArray = arraySlice.call(secondArrayOrArgs), spliceArgs, returnArray;
  _$jscoverage['array.js'][155]++;
  if (indexOrAppend === true) {
    _$jscoverage['array.js'][156]++;
    returnArray = firstArray.concat(secondArray);
  }
  else {
    _$jscoverage['array.js'][159]++;
    spliceArgs = [indexOrAppend, 0].concat(secondArray);
    _$jscoverage['array.js'][160]++;
    firstArray.splice.apply(firstArray, spliceArgs);
    _$jscoverage['array.js'][162]++;
    return firstArray;
  }
  _$jscoverage['array.js'][165]++;
  return returnArray;
}
_$jscoverage['array.js'][175]++;
function removeAtIndex(arr, index) {
  _$jscoverage['array.js'][176]++;
  var item = arr[index];
  _$jscoverage['array.js'][177]++;
  arr.splice(index, 1);
  _$jscoverage['array.js'][178]++;
  return item;
}
_$jscoverage['array.js'][181]++;
function _removeFirst(arr, fn) {
  _$jscoverage['array.js'][182]++;
  var removed = false;
  _$jscoverage['array.js'][184]++;
  arr.some((function (value, index) {
  _$jscoverage['array.js'][185]++;
  if (fn.apply(this, arguments)) {
    _$jscoverage['array.js'][186]++;
    removed = removeAtIndex(arr, index);
    _$jscoverage['array.js'][187]++;
    return true;
  }
}));
  _$jscoverage['array.js'][191]++;
  return removed;
}
_$jscoverage['array.js'][226]++;
function removeFirst(arr, obj, config) {
  _$jscoverage['array.js'][227]++;
  var fn = _createIteratorFn(obj, config);
  _$jscoverage['array.js'][228]++;
  return _removeFirst(arr, fn);
}
_$jscoverage['array.js'][245]++;
function removeFirstNot(arr, obj, config) {
  _$jscoverage['array.js'][246]++;
  var fn = _createIteratorNotFn(obj, config);
  _$jscoverage['array.js'][247]++;
  return _removeFirst(arr, fn);
}
_$jscoverage['array.js'][251]++;
function _removeAll(arr, fn) {
  _$jscoverage['array.js'][252]++;
  var indexsToRemove = [], removed = [];
  _$jscoverage['array.js'][255]++;
  arr.forEach((function (value, index) {
  _$jscoverage['array.js'][256]++;
  if (fn.apply(this, arguments)) {
    _$jscoverage['array.js'][257]++;
    indexsToRemove.unshift(index);
    _$jscoverage['array.js'][258]++;
    removed.push(value);
  }
}));
  _$jscoverage['array.js'][262]++;
  indexsToRemove.forEach((function (index) {
  _$jscoverage['array.js'][263]++;
  removeAtIndex(arr, index);
}));
  _$jscoverage['array.js'][266]++;
  return removed.length? removed: false;
}
_$jscoverage['array.js'][283]++;
function removeAllNot(arr, obj, config) {
  _$jscoverage['array.js'][284]++;
  var fn = _createIteratorNotFn(obj, config);
  _$jscoverage['array.js'][285]++;
  return _removeAll(arr, fn);
}
_$jscoverage['array.js'][303]++;
function removeAll(arr, obj, config) {
  _$jscoverage['array.js'][304]++;
  var fn = _createIteratorFn(obj, config);
  _$jscoverage['array.js'][305]++;
  return _removeAll(arr, fn);
}
_$jscoverage['array.js'][308]++;
function _findFirst(arr, fn) {
  _$jscoverage['array.js'][309]++;
  var item = false;
  _$jscoverage['array.js'][310]++;
  arr.some((function (value, index) {
  _$jscoverage['array.js'][311]++;
  if (fn.apply(this, arguments)) {
    _$jscoverage['array.js'][312]++;
    item = arr[index];
    _$jscoverage['array.js'][313]++;
    return true;
  }
}));
  _$jscoverage['array.js'][317]++;
  return item;
}
_$jscoverage['array.js'][334]++;
function findFirst(arr, obj, config) {
  _$jscoverage['array.js'][335]++;
  var fn = _createIteratorFn(obj, config);
  _$jscoverage['array.js'][336]++;
  return _findFirst(arr, fn);
}
_$jscoverage['array.js'][353]++;
function findFirstNot(arr, obj, config) {
  _$jscoverage['array.js'][354]++;
  var fn = _createIteratorNotFn(obj, config);
  _$jscoverage['array.js'][355]++;
  return _findFirst(arr, fn);
}
_$jscoverage['array.js'][358]++;
function _findAll(arr, fn) {
  _$jscoverage['array.js'][359]++;
  var found = arr.filter(fn);
  _$jscoverage['array.js'][360]++;
  return found.length? found: false;
}
_$jscoverage['array.js'][378]++;
function findAll(arr, obj, config) {
  _$jscoverage['array.js'][379]++;
  var fn = _createIteratorFn(obj, config);
  _$jscoverage['array.js'][380]++;
  return _findAll(arr, fn);
}
_$jscoverage['array.js'][398]++;
function findAllNot(arr, obj, config) {
  _$jscoverage['array.js'][399]++;
  var fn = _createIteratorNotFn(obj, config);
  _$jscoverage['array.js'][400]++;
  return _findAll(arr, fn);
}
_$jscoverage['array.js'][404]++;
exports.toArray = toArray;
_$jscoverage['array.js'][405]++;
exports.each = each;
_$jscoverage['array.js'][406]++;
exports.insert = insert;
_$jscoverage['array.js'][407]++;
exports.removeAtIndex = removeAtIndex;
_$jscoverage['array.js'][408]++;
exports.findFirstNot = findFirstNot;
_$jscoverage['array.js'][409]++;
exports.findAllNot = findAllNot;
_$jscoverage['array.js'][410]++;
exports.findFirst = findFirst;
_$jscoverage['array.js'][411]++;
exports.findAll = findAll;
_$jscoverage['array.js'][413]++;
exports.removeFirstNot = removeFirstNot;
_$jscoverage['array.js'][414]++;
exports.removeAllNot = removeAllNot;
_$jscoverage['array.js'][415]++;
exports.removeFirst = removeFirst;
_$jscoverage['array.js'][416]++;
exports.removeAll = removeAll;
_$jscoverage['array.js'][418]++;
(function () {
  _$jscoverage['array.js'][419]++;
  var namesToIs = ["findFirstNot", "findAllNot", "findFirst", "findAll", "removeFirstNot", "removeAllNot", "removeFirst", "removeAll"];
  _$jscoverage['array.js'][422]++;
  function _createIsFn(fnName, key) {
    _$jscoverage['array.js'][423]++;
    return (function (arr) {
  _$jscoverage['array.js'][424]++;
  return exports[fnName](arr, is[key]);
});
}
  _$jscoverage['array.js'][428]++;
  Object.keys(is).forEach((function (key) {
  _$jscoverage['array.js'][429]++;
  var name = key.split("is")[1];
  _$jscoverage['array.js'][430]++;
  namesToIs.forEach((function (fnName) {
  _$jscoverage['array.js'][431]++;
  exports[fnName + name] = _createIsFn(fnName, key);
}));
}));
})();
_$jscoverage['array.js'].source = ["var arraySlice = Array.prototype.slice,","    compare = require('./compare'),","    is = require('./is'),","    createBoundCompareFn = compare.createBoundCompareFn;","","function _createIteratorFn(fn, config) {","    if(is.isFunction(fn) &amp;&amp; (config ? config.type !== 'strict' : true)) {","        return config ? fn.bind(config) : fn;","    }","","    return createBoundCompareFn(fn, config);","}","","function _createIteratorNotFn(fn, config) {","    var functionToNot = _createIteratorFn(fn, config);","        ","    return function() {","        return !functionToNot.apply(this, arguments);","    };","}","","","/**"," * @class Luc.Array "," * Package for Array methods. &lt;br&gt;"," * "," * There a lot of functions in this package but all of the"," * remove\\* / find\\* methods follow the same api.  \\*All functions will return an array of removed or found"," * items and false if none are found.  The items will be added to the array in the order they are"," * found.  \\*First functions will return the first item and stop iterating after that, if none"," *  is found false is returned.  remove\\* functions will directly change the passed in array."," *  \\*Not functions only do the following actions if the comparison is not true."," *  All remove\\* / find\\* take the following api: array, objectToCompareOrIterator, compareConfigOrThisArg for example:"," *","    Luc.Array.findFirst([1,2,3, {}], {});","    &gt;Object {}","","    Luc.Array.findFirst([1,2,3,{}], {}, {type: 'strict'});","    &gt;false","","    Luc.Array.findFirst([1,2,3,{}], function(val, index, array){","        return val === 3 || this.num === val;","    }, {num: 1});","    &gt;1","  "," * There also many find\\*Object, remove\\*Object methods they all just take an array as"," * the only parameter and follow the same find\\*, remove\\* counterparts.  Every public"," * method of Luc.is available it uses the following grammer Luc.Array[\"methodName\"\"isMethodName\"]"," *","      Luc.Array.findAllNotEmpty([false, true, null, undefined, 0, '', [], [1]])","      &gt; [true, 0, [1]]","","      Luc.Array.findAllNotFalsy([false, true, null, undefined, 0, '', [], [1]])","      &gt; [true, 0, [], [1]]","","      Luc.Array.findFirstString([1,2,3,'5'])","      &gt;\"5\"","      Luc.Array.findFirstNotString([1,2,3,'5'])","      &gt;1","      var arr = [1,2,3,'5'];","      Luc.Array.removeAllNotString(arr);","      &gt;[1,2,3]","      arr","      &gt;[\"5\"]"," *"," *"," * Keep in mind that Luc is optionally packaged with es5 shim so you can target non-es5 browsers."," * It comes with your favorite {@link Array Array} methods such as Array.forEach, Array.filter, Array.some, Array.every Array.reduceRight .."," *"," * Also don't forget about Luc.Array.each and Luc.Array.toArray, they are great utility methods"," * that are used all over the framework."," * "," */","","/**"," * Turn the passed in item into an array if it"," * isn't one already, if the item is an array just return it.  "," * It returns an empty array if item is null or undefined."," * If it is just a single item return an array containing the item."," * ","    Luc.Array.toArray()","    &gt;[]","    Luc.Array.toArray(null)","    &gt;[]","    Luc.Array.toArray(1)","    &gt;[1]","    Luc.Array.toArray([1,2])","    &gt;[1, 2]"," *"," * @param  {Object} item item to turn into an array."," * @return the array"," */","function toArray(item) {","    if (Array.isArray(item)) {","        return item;","    }","    return (item === null || item === undefined) ? [] : [item];","}","","/**"," * Runs an Array.forEach after calling Luc.Array.toArray on the item."," * @param  {Object}   item"," * @param  {Function} fn        "," * @param  {Object}   context   "," *","  It is very useful for setting up flexable api's that can handle none one or many.","","    Luc.Array.each(this.items, function(item) {","        this._addItem(item);","    });","","    vs.","","    if(Array.isArray(this.items)){","        this.items.forEach(function(item) {","            this._addItem(item);","        })","    }","    else if(this.items !== undefined) {","        this._addItem(this.items);","    }",""," */","function each(item, fn, context) {","    var arr = toArray(item);","    return arr.forEach.call(arr, fn, context);","}","","/**"," * Insert or append the second array/arguments into the"," * first array/arguments.  This method does not alter"," * the passed in array/arguments."," * "," * @param  {Array/arguments} firstArrayOrArgs"," * @param  {Array/arguments} secondArrayOrArgs"," * @param  {Number/true} indexOrAppend true to append "," * the second array to the end of the first one.  If it is a number"," * insert the secondArray into the first one at the passed in index.","   ","    Luc.Array.insert([0,4], [1,2,3], 1);","    &gt;[0, 1, 2, 3, 4]","    Luc.Array.insert([0,4], [1,2,3], true);","    &gt;[0, 4, 1, 2, 3]","    Luc.Array.insert([0,4], [1,2,3], 0);","    &gt;[1, 2, 3, 0, 4]"," "," * @return {Array}"," */","function insert(firstArrayOrArgs, secondArrayOrArgs, indexOrAppend) {","    var firstArray = arraySlice.call(firstArrayOrArgs),","        secondArray = arraySlice.call(secondArrayOrArgs),","        spliceArgs, ","        returnArray;","","    if(indexOrAppend === true) {","        returnArray = firstArray.concat(secondArray);","    }","    else {","        spliceArgs = [indexOrAppend, 0].concat(secondArray);","        firstArray.splice.apply(firstArray, spliceArgs);","","        return firstArray;","    }","","    return returnArray;","}","","/**"," * Remove an item from an the passed in arr"," * from the index."," * @param  {Array} arr"," * @param  {Number} index"," * @return {Object} the item removed."," */","function removeAtIndex(arr, index) {","    var item = arr[index];","    arr.splice(index, 1);","    return item;","}","","function _removeFirst(arr, fn) {","    var removed = false;","","    arr.some(function(value, index) {","        if (fn.apply(this, arguments)) {","            removed = removeAtIndex(arr, index);","            return true;","        }","    });","","    return removed;","}","","/**"," * Remove the first item from the passed in array"," * that matches the passed in object.  Instead of "," * comparing an object an iterator function can be"," * used."," * "," * @param  {Array} arr"," * @param  {Any/Function} objectOrIterator if the value"," * is {@link Luc#compare equal} to or the iterator returns true remove the "," * object from the array."," * "," * If an iterator function is passed it will be called with the following "," * parameters.  The same parameter to Array.forEach"," * "," * @param {Object} objectOrIterator.value "," * @param {Number} objectOrIterator.number"," * @param {Array} objectOrIterator.array"," *"," * "," * @param  {Object} [configOrthisArg]"," * "," * thisArg for the iterator function an iterator is"," * used."," * "," * Option config object for Luc.compare if an iterator"," * function is not passed in.  If you want to actually"," * do a direct equality comparison on a function instead of"," * using it as an iterator pass in {type: 'strict'}"," * "," * @return {Object} the object that was removed"," * false if no object was removed;"," */","function removeFirst(arr, obj, config) {","    var fn = _createIteratorFn(obj, config);","    return _removeFirst(arr, fn);","}","","/**"," * Remove the first item from the passed in Array"," * that does not match the passed in object."," * "," * @param  {Array} arr"," * @param  {Any} object"," * @param  {Object} [config] "," * @param {Boolean} [config.shallow] defaults to true"," * pass in false to do a direct equalty comparison"," * for Arrays Objects or Falsys."," * "," * @return {Object} this object that was removed"," * false if no object was removed;"," */","function removeFirstNot(arr, obj, config) {","    var fn = _createIteratorNotFn(obj, config);","    return _removeFirst(arr, fn);","}","","","function _removeAll(arr, fn) {","    var indexsToRemove = [],","        removed = [];","","    arr.forEach(function(value, index) {","        if (fn.apply(this, arguments)) {","            indexsToRemove.unshift(index);","            removed.push(value);","        }","    });","","    indexsToRemove.forEach(function(index){","        removeAtIndex(arr, index);","    });","","    return removed.length ? removed : false;","}","","/**"," * Same api as Luc.Array.removeAll except"," * remove the items that are not equal to the passed in"," * object."," * "," * @param  {Array} arr"," * @param  {Any} object"," * @param  {Object} [config] By default shallow compare will"," * be used for Objects and Arrays passed in true to do"," * a === comparison."," * "," * @return {Object[]}  An array of items removed"," * false if none are removed."," */","function removeAllNot(arr, obj, config) {","    var fn = _createIteratorNotFn(obj, config);","    return _removeAll(arr, fn);","}","","/**"," * Find the first all items that are equal to the"," * passed in object. By defualt Objects and Arrays are "," * compared with a shallow comparison."," * "," * @param  {Array} arr"," * @param  {Any} object"," * @param  {Object} [config] "," * @param {Boolean} [config.shallow] defaults to true"," * pass in false to do a direct equalty comparison"," * for Arrays Objects or Falsys."," * "," * @return {Object[]}  An array of items removed"," * false if none are removed."," */","function removeAll(arr, obj, config) {","    var fn = _createIteratorFn(obj, config);","    return _removeAll(arr, fn);","}","","function _findFirst(arr, fn) {","    var item = false;","    arr.some(function(value, index) {","        if (fn.apply(this, arguments)) {","            item = arr[index];","            return true;","        }","    });","","    return item;","}","","/**"," * Return the first item from the passed in Array"," * that  matches the passed in object."," * "," * @param  {Array} arr"," * @param  {Any} object"," * @param  {Object} [config] "," * @param {Boolean} [config.shallow] defaults to true"," * pass in false to do a direct equalty comparison"," * for Arrays Objects or Falsys."," * "," * @return {Object} this object that was removed"," * false if no object was removed;"," */","function findFirst(arr, obj, config) {","    var fn = _createIteratorFn(obj, config);","    return _findFirst(arr, fn);","}","","/**"," * Return the first item from the passed in Array"," * that does not match the passed in object."," * "," * @param  {Array} arr"," * @param  {Any} object"," * @param  {Object} [config] "," * @param {Boolean} [config.shallow] defaults to true"," * pass in false to do a direct equalty comparison"," * for Arrays Objects or Falsys."," * "," * @return {Object} this object that was removed"," * false if no object was removed;"," */","function findFirstNot(arr, obj, config) {","    var fn = _createIteratorNotFn(obj, config);","    return _findFirst(arr, fn);","}","","function _findAll(arr, fn) {","    var found = arr.filter(fn);","    return found.length ? found : false;","}","","/**"," * Return all items that are equal to the"," * passed in object. By defualt Objects and Arrays are "," * compared with a shallow comparison."," * "," * @param  {Array} arr"," * @param  {Any} object"," * @param  {Object} [config] "," * @param {Boolean} [config.shallow] defaults to true"," * pass in false to do a direct equalty comparison"," * for Arrays Objects or Falsys."," * "," * @return {Object[]}  An array of items found"," * false if none are found."," */","function findAll(arr, obj, config) {","    var fn = _createIteratorFn(obj, config);","    return _findAll(arr, fn);","}","","/**"," * Return all items that are not equal to the"," * passed in object. By defualt Objects and Arrays are "," * compared with a shallow comparison."," * "," * @param  {Array} arr"," * @param  {Any} object"," * @param  {Object} [config] "," * @param {Boolean} [config.shallow] defaults to true"," * pass in false to do a direct equalty comparison"," * for Arrays Objects or Falsys."," * "," * @return {Object[]}  An array of items found"," * false if none are found."," */","function findAllNot(arr, obj, config) {","    var fn = _createIteratorNotFn(obj, config);","    return _findAll(arr, fn);","}","","","exports.toArray = toArray;","exports.each = each;","exports.insert = insert;","exports.removeAtIndex = removeAtIndex;","exports.findFirstNot = findFirstNot;","exports.findAllNot = findAllNot;","exports.findFirst = findFirst;","exports.findAll = findAll;","","exports.removeFirstNot = removeFirstNot;","exports.removeAllNot = removeAllNot;","exports.removeFirst = removeFirst;","exports.removeAll = removeAll;","","(function() {","    var namesToIs = ['findFirstNot', 'findAllNot', 'findFirst', 'findAll',","                     'removeFirstNot', 'removeAllNot', 'removeFirst', 'removeAll'];","","    function _createIsFn(fnName, key) {","        return function(arr) {","            return exports[fnName](arr, is[key]);","        };","    }","","    Object.keys(is).forEach(function(key) {","        var name = key.split('is')[1];","        namesToIs.forEach(function(fnName) {","            exports[fnName + name] = _createIsFn(fnName,key);","        });","    });","}());","","/**"," * @member Luc.Array"," * @method findFirstNotBoolean"," * Return the first item that is not of the associated type."," * @param {Array} arr"," *"," * @return {Object} the object if it was found, false if it was "," * not found."," */","/**"," * @member Luc.Array"," * @method findFirstBoolean"," * Return the first item that is of the associated type."," * @param {Array} arr"," *"," * @return {Object} the object if it was found, false if it was "," * not found."," */","/**"," * @member Luc.Array"," * @method findAllNotBoolean"," * Return all the items that are not of the associated type."," * @param {Array} arr"," *"," * @return {Any[]} the array of objects found, false if it was "," * not found."," */","","/**"," * @member Luc.Array"," * @method findFirstNotObject"," * @inheritdoc Luc.Array#findFirstNotBoolean"," */","/**"," * @member Luc.Array"," * @method findFirstObject"," * @inheritdoc Luc.Array#findFirstBoolean"," */","/**"," * @member Luc.Array"," * @method findAllNotObject"," * @inheritdoc Luc.Array#findAllNotBoolean"," */","/**"," * @member Luc.Array"," * @method findAllObject"," * @inheritdoc Luc.Array#findAllBoolean"," */","","/**"," * @member Luc.Array"," * @method findFirstNotFunction"," * @inheritdoc Luc.Array#findFirstNotBoolean"," */","/**"," * @member Luc.Array"," * @method findFirstFunction"," * @inheritdoc Luc.Array#findFirstBoolean"," */","/**"," * @member Luc.Array"," * @method findAllNotFunction"," * @inheritdoc Luc.Array#findAllNotBoolean"," */","/**"," * @member Luc.Array"," * @method findAllFunction"," * @inheritdoc Luc.Array#findAllBoolean"," */","","/**"," * @member Luc.Array"," * @method findFirstNotString"," * @inheritdoc Luc.Array#findFirstNotBoolean"," */","/**"," * @member Luc.Array"," * @method findFirstString"," * @inheritdoc Luc.Array#findFirstBoolean"," */","/**"," * @member Luc.Array"," * @method findAllNotString"," * @inheritdoc Luc.Array#findAllNotBoolean"," */","/**"," * @member Luc.Array"," * @method findAllString"," * @inheritdoc Luc.Array#findAllBoolean"," */","/**"," * @member Luc.Array"," * @method findFirstNotString"," * @inheritdoc Luc.Array#findFirstNotBoolean"," */","/**"," * @member Luc.Array"," * @method findFirstString"," * @inheritdoc Luc.Array#findFirstBoolean"," */","/**"," * @member Luc.Array"," * @method findAllNotString"," * @inheritdoc Luc.Array#findAllNotBoolean"," */","/**"," * @member Luc.Array"," * @method findAllString"," * @inheritdoc Luc.Array#findAllBoolean"," */","/**"," * @member Luc.Array"," * @method findFirstNotRegExp"," * @inheritdoc Luc.Array#findFirstNotBoolean"," */","/**"," * @member Luc.Array"," * @method findFirstRegExp"," * @inheritdoc Luc.Array#findFirstBoolean"," */","/**"," * @member Luc.Array"," * @method findAllNotRegExp"," * @inheritdoc Luc.Array#findAllNotBoolean"," */","/**"," * @member Luc.Array"," * @method findAllRegExp"," * @inheritdoc Luc.Array#findAllBoolean"," */","/**"," * @member Luc.Array"," * @method findFirstNotDate"," * @inheritdoc Luc.Array#findFirstNotBoolean"," */","/**"," * @member Luc.Array"," * @method findFirstDate"," * @inheritdoc Luc.Array#findFirstBoolean"," */","/**"," * @member Luc.Array"," * @method findAllNotDate"," * @inheritdoc Luc.Array#findAllNotBoolean"," */","/**"," * @member Luc.Array"," * @method findAllDate"," * @inheritdoc Luc.Array#findAllBoolean"," */",""];

},{"./compare":25,"./is":19}],25:[function(require,module,exports){
/* automatically generated by JSCoverage - do not edit */
if (typeof _$jscoverage === 'undefined') _$jscoverage = {};
if (! _$jscoverage['compare.js']) {
  _$jscoverage['compare.js'] = [];
  _$jscoverage['compare.js'][1] = 0;
  _$jscoverage['compare.js'][3] = 0;
  _$jscoverage['compare.js'][4] = 0;
  _$jscoverage['compare.js'][7] = 0;
  _$jscoverage['compare.js'][8] = 0;
  _$jscoverage['compare.js'][11] = 0;
  _$jscoverage['compare.js'][12] = 0;
  _$jscoverage['compare.js'][15] = 0;
  _$jscoverage['compare.js'][16] = 0;
  _$jscoverage['compare.js'][19] = 0;
  _$jscoverage['compare.js'][20] = 0;
  _$jscoverage['compare.js'][21] = 0;
  _$jscoverage['compare.js'][25] = 0;
  _$jscoverage['compare.js'][28] = 0;
  _$jscoverage['compare.js'][29] = 0;
  _$jscoverage['compare.js'][32] = 0;
  _$jscoverage['compare.js'][33] = 0;
  _$jscoverage['compare.js'][36] = 0;
  _$jscoverage['compare.js'][37] = 0;
  _$jscoverage['compare.js'][38] = 0;
  _$jscoverage['compare.js'][42] = 0;
  _$jscoverage['compare.js'][45] = 0;
  _$jscoverage['compare.js'][46] = 0;
  _$jscoverage['compare.js'][49] = 0;
  _$jscoverage['compare.js'][50] = 0;
  _$jscoverage['compare.js'][52] = 0;
  _$jscoverage['compare.js'][53] = 0;
  _$jscoverage['compare.js'][56] = 0;
  _$jscoverage['compare.js'][57] = 0;
  _$jscoverage['compare.js'][58] = 0;
  _$jscoverage['compare.js'][59] = 0;
  _$jscoverage['compare.js'][60] = 0;
  _$jscoverage['compare.js'][65] = 0;
  _$jscoverage['compare.js'][68] = 0;
  _$jscoverage['compare.js'][69] = 0;
  _$jscoverage['compare.js'][71] = 0;
  _$jscoverage['compare.js'][72] = 0;
  _$jscoverage['compare.js'][75] = 0;
  _$jscoverage['compare.js'][76] = 0;
  _$jscoverage['compare.js'][77] = 0;
  _$jscoverage['compare.js'][78] = 0;
  _$jscoverage['compare.js'][79] = 0;
  _$jscoverage['compare.js'][84] = 0;
  _$jscoverage['compare.js'][88] = 0;
  _$jscoverage['compare.js'][89] = 0;
  _$jscoverage['compare.js'][90] = 0;
  _$jscoverage['compare.js'][93] = 0;
  _$jscoverage['compare.js'][96] = 0;
  _$jscoverage['compare.js'][97] = 0;
  _$jscoverage['compare.js'][98] = 0;
  _$jscoverage['compare.js'][102] = 0;
  _$jscoverage['compare.js'][103] = 0;
  _$jscoverage['compare.js'][106] = 0;
  _$jscoverage['compare.js'][107] = 0;
  _$jscoverage['compare.js'][108] = 0;
  _$jscoverage['compare.js'][109] = 0;
  _$jscoverage['compare.js'][110] = 0;
  _$jscoverage['compare.js'][111] = 0;
  _$jscoverage['compare.js'][112] = 0;
  _$jscoverage['compare.js'][115] = 0;
  _$jscoverage['compare.js'][116] = 0;
  _$jscoverage['compare.js'][117] = 0;
  _$jscoverage['compare.js'][118] = 0;
  _$jscoverage['compare.js'][119] = 0;
  _$jscoverage['compare.js'][120] = 0;
  _$jscoverage['compare.js'][121] = 0;
  _$jscoverage['compare.js'][124] = 0;
  _$jscoverage['compare.js'][127] = 0;
  _$jscoverage['compare.js'][130] = 0;
  _$jscoverage['compare.js'][160] = 0;
  _$jscoverage['compare.js'][161] = 0;
  _$jscoverage['compare.js'][165] = 0;
  _$jscoverage['compare.js'][166] = 0;
  _$jscoverage['compare.js'][168] = 0;
  _$jscoverage['compare.js'][171] = 0;
  _$jscoverage['compare.js'][172] = 0;
}
_$jscoverage['compare.js'][1]++;
var is = require("./is");
_$jscoverage['compare.js'][3]++;
function _strict(val1, val2) {
  _$jscoverage['compare.js'][4]++;
  return val1 === val2;
}
_$jscoverage['compare.js'][7]++;
function _compareArrayLength(val1, val2) {
  _$jscoverage['compare.js'][8]++;
  return (is.isArray(val1) && is.isArray(val2) && val1.length === val2.length);
}
_$jscoverage['compare.js'][11]++;
function _shallowArray(val1, val2) {
  _$jscoverage['compare.js'][12]++;
  var i = 0, len;
  _$jscoverage['compare.js'][15]++;
  if (! _compareArrayLength(val1, val2)) {
    _$jscoverage['compare.js'][16]++;
    return false;
  }
  _$jscoverage['compare.js'][19]++;
  for (len = val1.length; i < len; ++i) {
    _$jscoverage['compare.js'][20]++;
    if (val1[i] !== val2[i]) {
      _$jscoverage['compare.js'][21]++;
      return false;
    }
}
  _$jscoverage['compare.js'][25]++;
  return true;
}
_$jscoverage['compare.js'][28]++;
function _deepArray(val1, val2) {
  _$jscoverage['compare.js'][29]++;
  var i = 0, len;
  _$jscoverage['compare.js'][32]++;
  if (! _compareArrayLength(val1, val2)) {
    _$jscoverage['compare.js'][33]++;
    return false;
  }
  _$jscoverage['compare.js'][36]++;
  for (len = val1.length; i < len; ++i) {
    _$jscoverage['compare.js'][37]++;
    if (! compare(val1[i], val2[i], {type: "deep"})) {
      _$jscoverage['compare.js'][38]++;
      return false;
    }
}
  _$jscoverage['compare.js'][42]++;
  return true;
}
_$jscoverage['compare.js'][45]++;
function _compareObjectKeysLength(val1, val2) {
  _$jscoverage['compare.js'][46]++;
  return (is.isObject(val1) && is.isObject(val2) && Object.keys(val1).length === Object.keys(val2).length);
}
_$jscoverage['compare.js'][49]++;
function _shallowObject(val1, val2) {
  _$jscoverage['compare.js'][50]++;
  var key, val;
  _$jscoverage['compare.js'][52]++;
  if (! _compareObjectKeysLength(val1, val2)) {
    _$jscoverage['compare.js'][53]++;
    return false;
  }
  _$jscoverage['compare.js'][56]++;
  for (key in val1) {
    _$jscoverage['compare.js'][57]++;
    if (val1.hasOwnProperty(key)) {
      _$jscoverage['compare.js'][58]++;
      value = val1[key];
      _$jscoverage['compare.js'][59]++;
      if (! val2.hasOwnProperty(key) || val2[key] !== value) {
        _$jscoverage['compare.js'][60]++;
        return false;
      }
    }
}
  _$jscoverage['compare.js'][65]++;
  return true;
}
_$jscoverage['compare.js'][68]++;
function _deepObject(val1, val2) {
  _$jscoverage['compare.js'][69]++;
  var key, val;
  _$jscoverage['compare.js'][71]++;
  if (! _compareObjectKeysLength(val1, val2)) {
    _$jscoverage['compare.js'][72]++;
    return false;
  }
  _$jscoverage['compare.js'][75]++;
  for (key in val1) {
    _$jscoverage['compare.js'][76]++;
    if (val1.hasOwnProperty(key)) {
      _$jscoverage['compare.js'][77]++;
      value = val1[key];
      _$jscoverage['compare.js'][78]++;
      if (! val2.hasOwnProperty(key) || compare(value, val2[key], {type: "deep"}) !== true) {
        _$jscoverage['compare.js'][79]++;
        return false;
      }
    }
}
  _$jscoverage['compare.js'][84]++;
  return true;
}
_$jscoverage['compare.js'][88]++;
function _date(val1, val2) {
  _$jscoverage['compare.js'][89]++;
  if (is.isDate(val1) && is.isDate(val2)) {
    _$jscoverage['compare.js'][90]++;
    return val1.getTime() === val2.getTime();
  }
  _$jscoverage['compare.js'][93]++;
  return false;
}
_$jscoverage['compare.js'][96]++;
function _createBoundCompare(object, fn) {
  _$jscoverage['compare.js'][97]++;
  return (function (value) {
  _$jscoverage['compare.js'][98]++;
  return fn(object, value);
});
}
_$jscoverage['compare.js'][102]++;
function getCompareFn(object, c) {
  _$jscoverage['compare.js'][103]++;
  var compareFn = _strict, config = c || {};
  _$jscoverage['compare.js'][106]++;
  if (config.type === "shallow" || config.type === undefined) {
    _$jscoverage['compare.js'][107]++;
    if (is.isObject(object)) {
      _$jscoverage['compare.js'][108]++;
      compareFn = _shallowObject;
    }
    else {
      _$jscoverage['compare.js'][109]++;
      if (is.isArray(object)) {
        _$jscoverage['compare.js'][110]++;
        compareFn = _shallowArray;
      }
      else {
        _$jscoverage['compare.js'][111]++;
        if (is.isDate(object)) {
          _$jscoverage['compare.js'][112]++;
          compareFn = _date;
        }
      }
    }
  }
  else {
    _$jscoverage['compare.js'][115]++;
    if (config.type === "deep") {
      _$jscoverage['compare.js'][116]++;
      if (is.isObject(object)) {
        _$jscoverage['compare.js'][117]++;
        compareFn = _deepObject;
      }
      else {
        _$jscoverage['compare.js'][118]++;
        if (is.isArray(object)) {
          _$jscoverage['compare.js'][119]++;
          compareFn = _deepArray;
        }
        else {
          _$jscoverage['compare.js'][120]++;
          if (is.isDate(object)) {
            _$jscoverage['compare.js'][121]++;
            compareFn = _date;
          }
        }
      }
    }
    else {
      _$jscoverage['compare.js'][124]++;
      if (config.type !== "strict") {
        _$jscoverage['compare.js'][127]++;
        throw new Error("You passed in an invalid comparison type");
      }
    }
  }
  _$jscoverage['compare.js'][130]++;
  return compareFn;
}
_$jscoverage['compare.js'][160]++;
function compare(val1, val2, config) {
  _$jscoverage['compare.js'][161]++;
  return getCompareFn(val1, config)(val1, val2);
}
_$jscoverage['compare.js'][165]++;
function createBoundCompareFn(object, c) {
  _$jscoverage['compare.js'][166]++;
  var compareFn = getCompareFn(object, c);
  _$jscoverage['compare.js'][168]++;
  return _createBoundCompare(object, compareFn);
}
_$jscoverage['compare.js'][171]++;
exports.compare = compare;
_$jscoverage['compare.js'][172]++;
exports.createBoundCompareFn = createBoundCompareFn;
_$jscoverage['compare.js'].source = ["var is = require('./is');","","function _strict(val1, val2){","    return val1 === val2;","}","","function _compareArrayLength(val1, val2) {","    return(is.isArray(val1) &amp;&amp; is.isArray(val2)  &amp;&amp; val1.length === val2.length);","}","","function _shallowArray(val1, val2) {","    var i = 0,","        len;","    ","    if(!_compareArrayLength(val1, val2)) {","        return false;","    }","","    for(len = val1.length; i &lt; len; ++i) {","        if(val1[i] !== val2[i]) {","            return false;","        }","    }","","    return true;","}","","function _deepArray(val1, val2) {","    var i = 0,","        len;","    ","    if(!_compareArrayLength(val1, val2)) {","        return false;","    }","","    for(len = val1.length; i &lt; len; ++i) {","        if(!compare(val1[i],val2[i], {type: 'deep'})) {","            return false;","        }","    }","","    return true;","}","","function _compareObjectKeysLength(val1, val2) {","    return (is.isObject(val1) &amp;&amp; is.isObject(val2) &amp;&amp; Object.keys(val1).length === Object.keys(val2).length);","}","","function _shallowObject(val1, val2) {","    var key, val;","","    if (!_compareObjectKeysLength(val1, val2)) {","        return false;","    }","","    for (key in val1) {","        if (val1.hasOwnProperty(key)) {","            value = val1[key];","            if (!val2.hasOwnProperty(key) || val2[key] !== value) {","                return false;","            }","        }","    }","","    return true;","}","","function _deepObject(val1, val2) {","    var key, val;","","    if (!_compareObjectKeysLength(val1, val2)) {","        return false;","    }","","    for (key in val1) {","        if (val1.hasOwnProperty(key)) {","            value = val1[key];","            if (!val2.hasOwnProperty(key) || compare(value, val2[key], {type: 'deep'}) !== true) {","                return false;","            }","        }","    }","","    return true;","","}","","function _date(val1, val2) {","    if(is.isDate(val1) &amp;&amp; is.isDate(val2)) {","        return val1.getTime() === val2.getTime();","    }","","    return false;","}","","function _createBoundCompare(object, fn) {","    return function(value) {","        return fn(object, value);","    };","}","","function getCompareFn(object, c) {","    var compareFn = _strict,","        config = c || {};","","    if (config.type === 'shallow' || config.type === undefined) {","        if (is.isObject(object)) {","            compareFn = _shallowObject;","        } else if (is.isArray(object)) {","            compareFn = _shallowArray;","        } else if (is.isDate(object)) {","            compareFn = _date;","        }","    }","    else if(config.type === 'deep') {","        if (is.isObject(object)) {","            compareFn = _deepObject;","        } else if (is.isArray(object)) {","            compareFn = _deepArray;","        } else if (is.isDate(object)) {","            compareFn = _date;","        }","    }","    else if(config.type !== 'strict') {","        //we would be doing a strict comparison on a type-o","        //I think an error is good here.","        throw new Error('You passed in an invalid comparison type');","    }","","    return compareFn;","}","","/**"," * @member Luc"," * @method compare"," * "," * Return true if the values are equal to each"," * other.  By default a shallow comparison is "," * done on arrays, dates and objects and a strict comparison"," * is done on other types."," * "," * @param  {Any} val1  "," * @param  {Any} val2   "," * @param  {Object} [config]"," * @param {String} config.type pass in 'deep' for a deep"," * comparison, 'shallow' (default) for a shallow comparison"," * or 'strict' for a strict === comparison for all objects."," *"," * ","    Luc.compare({a: 1}, {a: 1})","    &gt;true","    Luc.compare({a: 1, b: {}}, {a: 1, b: {} })","    &gt;false","    Luc.compare({a: 1, b: {}}, {a: 1, b: {} }, {type: 'deep'})","    &gt;true","    Luc.compare({a: 1, b: {}}, {a: 1, b: {} }, {type: 'strict'})","    &gt;false"," * @return {Boolean}"," */","function compare(val1, val2, config) {","    return getCompareFn(val1, config)(val1, val2);","}","","","function createBoundCompareFn(object, c) {","    var compareFn = getCompareFn(object, c);","","    return _createBoundCompare(object, compareFn);","}","","exports.compare = compare;","exports.createBoundCompareFn = createBoundCompareFn;"];

},{"./is":19}],12:[function(require,module,exports){
/**
 * @license https://raw.github.com/kriskowal/es5-shim/master/LICENSE
 * es5-shim license
 */

if(typeof window !== 'undefined') {
    require('es5-shim-sham');
}

module.exports = require('./luc');
},{"./luc":27,"es5-shim-sham":28}],27:[function(require,module,exports){
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
},{"./object":29,"./function":30,"./array":31,"./is":32,"./events/eventEmitter":33,"./class/base":34,"./class/definer":35,"./class/plugin":36,"./class/compositionEnumns":37,"./compare":38}],21:[function(require,module,exports){
/* automatically generated by JSCoverage - do not edit */
if (typeof _$jscoverage === 'undefined') _$jscoverage = {};
if (! _$jscoverage['class/base.js']) {
  _$jscoverage['class/base.js'] = [];
  _$jscoverage['class/base.js'][1] = 0;
  _$jscoverage['class/base.js'][20] = 0;
  _$jscoverage['class/base.js'][21] = 0;
  _$jscoverage['class/base.js'][22] = 0;
  _$jscoverage['class/base.js'][25] = 0;
  _$jscoverage['class/base.js'][31] = 0;
  _$jscoverage['class/base.js'][41] = 0;
}
_$jscoverage['class/base.js'][1]++;
var emptyFn = require("../function").emptyFn, apply = require("../object").apply;
_$jscoverage['class/base.js'][20]++;
function Base() {
  _$jscoverage['class/base.js'][21]++;
  this.beforeInit.apply(this, arguments);
  _$jscoverage['class/base.js'][22]++;
  this.init();
}
_$jscoverage['class/base.js'][25]++;
Base.prototype = {beforeInit: (function (config) {
  _$jscoverage['class/base.js'][31]++;
  apply(this, config);
}), init: emptyFn};
_$jscoverage['class/base.js'][41]++;
module.exports = Base;
_$jscoverage['class/base.js'].source = ["var emptyFn = require('../function').emptyFn,","    apply = require('../object').apply;","","/**"," * @class Luc.Base"," * Simple class that by default applies the "," * first argument to the instance and then calls"," * Luc.Base.init."," *","    var b = new Luc.Base({","        a: 1,","        init: function() {","            console.log('hey')","        }","    })","    b.a","    &gt;hey","    &gt;1"," */","function Base() {","    this.beforeInit.apply(this, arguments);","    this.init();","}","","Base.prototype = {","    /**","     * By default apply the config to the ","     * instance.","     */","    beforeInit: function(config) {","        apply(this, config);","    },","    /**","     * @method","     * Simple hook to initialize","     * the class.","     */","    init: emptyFn","};","","module.exports = Base;"];

},{"../object":16,"../function":17}],22:[function(require,module,exports){
/* automatically generated by JSCoverage - do not edit */
if (typeof _$jscoverage === 'undefined') _$jscoverage = {};
if (! _$jscoverage['class/definer.js']) {
  _$jscoverage['class/definer.js'] = [];
  _$jscoverage['class/definer.js'][1] = 0;
  _$jscoverage['class/definer.js'][13] = 0;
  _$jscoverage['class/definer.js'][15] = 0;
  _$jscoverage['class/definer.js'][17] = 0;
  _$jscoverage['class/definer.js'][28] = 0;
  _$jscoverage['class/definer.js'][33] = 0;
  _$jscoverage['class/definer.js'][35] = 0;
  _$jscoverage['class/definer.js'][37] = 0;
  _$jscoverage['class/definer.js'][39] = 0;
  _$jscoverage['class/definer.js'][43] = 0;
  _$jscoverage['class/definer.js'][46] = 0;
  _$jscoverage['class/definer.js'][47] = 0;
  _$jscoverage['class/definer.js'][50] = 0;
  _$jscoverage['class/definer.js'][54] = 0;
  _$jscoverage['class/definer.js'][57] = 0;
  _$jscoverage['class/definer.js'][58] = 0;
  _$jscoverage['class/definer.js'][60] = 0;
  _$jscoverage['class/definer.js'][61] = 0;
  _$jscoverage['class/definer.js'][64] = 0;
  _$jscoverage['class/definer.js'][65] = 0;
  _$jscoverage['class/definer.js'][69] = 0;
  _$jscoverage['class/definer.js'][73] = 0;
  _$jscoverage['class/definer.js'][79] = 0;
  _$jscoverage['class/definer.js'][80] = 0;
  _$jscoverage['class/definer.js'][84] = 0;
  _$jscoverage['class/definer.js'][85] = 0;
  _$jscoverage['class/definer.js'][86] = 0;
  _$jscoverage['class/definer.js'][90] = 0;
  _$jscoverage['class/definer.js'][94] = 0;
  _$jscoverage['class/definer.js'][98] = 0;
  _$jscoverage['class/definer.js'][99] = 0;
  _$jscoverage['class/definer.js'][101] = 0;
  _$jscoverage['class/definer.js'][102] = 0;
  _$jscoverage['class/definer.js'][103] = 0;
  _$jscoverage['class/definer.js'][108] = 0;
  _$jscoverage['class/definer.js'][111] = 0;
  _$jscoverage['class/definer.js'][112] = 0;
  _$jscoverage['class/definer.js'][115] = 0;
  _$jscoverage['class/definer.js'][116] = 0;
  _$jscoverage['class/definer.js'][121] = 0;
  _$jscoverage['class/definer.js'][124] = 0;
  _$jscoverage['class/definer.js'][125] = 0;
  _$jscoverage['class/definer.js'][128] = 0;
  _$jscoverage['class/definer.js'][129] = 0;
  _$jscoverage['class/definer.js'][130] = 0;
  _$jscoverage['class/definer.js'][134] = 0;
  _$jscoverage['class/definer.js'][144] = 0;
  _$jscoverage['class/definer.js'][145] = 0;
  _$jscoverage['class/definer.js'][148] = 0;
  _$jscoverage['class/definer.js'][149] = 0;
  _$jscoverage['class/definer.js'][155] = 0;
  _$jscoverage['class/definer.js'][157] = 0;
  _$jscoverage['class/definer.js'][162] = 0;
  _$jscoverage['class/definer.js'][166] = 0;
  _$jscoverage['class/definer.js'][170] = 0;
  _$jscoverage['class/definer.js'][171] = 0;
  _$jscoverage['class/definer.js'][175] = 0;
  _$jscoverage['class/definer.js'][184] = 0;
  _$jscoverage['class/definer.js'][185] = 0;
  _$jscoverage['class/definer.js'][186] = 0;
  _$jscoverage['class/definer.js'][192] = 0;
  _$jscoverage['class/definer.js'][193] = 0;
  _$jscoverage['class/definer.js'][195] = 0;
  _$jscoverage['class/definer.js'][196] = 0;
  _$jscoverage['class/definer.js'][202] = 0;
  _$jscoverage['class/definer.js'][203] = 0;
  _$jscoverage['class/definer.js'][205] = 0;
  _$jscoverage['class/definer.js'][206] = 0;
  _$jscoverage['class/definer.js'][211] = 0;
  _$jscoverage['class/definer.js'][215] = 0;
  _$jscoverage['class/definer.js'][218] = 0;
  _$jscoverage['class/definer.js'][219] = 0;
  _$jscoverage['class/definer.js'][223] = 0;
  _$jscoverage['class/definer.js'][225] = 0;
  _$jscoverage['class/definer.js'][227] = 0;
  _$jscoverage['class/definer.js'][228] = 0;
  _$jscoverage['class/definer.js'][229] = 0;
  _$jscoverage['class/definer.js'][233] = 0;
  _$jscoverage['class/definer.js'][245] = 0;
  _$jscoverage['class/definer.js'][249] = 0;
  _$jscoverage['class/definer.js'][250] = 0;
  _$jscoverage['class/definer.js'][251] = 0;
  _$jscoverage['class/definer.js'][256] = 0;
  _$jscoverage['class/definer.js'][258] = 0;
  _$jscoverage['class/definer.js'][260] = 0;
}
_$jscoverage['class/definer.js'][1]++;
var Base = require("./base"), Composition = require("./composition"), obj = require("../object"), arrayFns = require("../array"), emptyFn = require("../function").emptyFn, aEach = arrayFns.each, apply = obj.apply, oEach = obj.each, oFilter = obj.filter, mix = obj.mix, arraySlice = Array.prototype.slice;
_$jscoverage['class/definer.js'][13]++;
function ClassDefiner() {
}
_$jscoverage['class/definer.js'][15]++;
ClassDefiner.COMPOSITIONS_NAME = "$compositions";
_$jscoverage['class/definer.js'][17]++;
ClassDefiner.prototype = {defaultType: Base, processorKeys: {$mixins: "_applyMixins", $statics: "_applyStatics", $compositions: "_compose", $super: true}, define: (function (opts) {
  _$jscoverage['class/definer.js'][28]++;
  var options = opts || {}, Super = options.$super || (options.$super === undefined? this.defaultType: false), Constructor;
  _$jscoverage['class/definer.js'][33]++;
  options.$super = Super;
  _$jscoverage['class/definer.js'][35]++;
  Constructor = this._createConstructor(options);
  _$jscoverage['class/definer.js'][37]++;
  this._processAfterCreate(Constructor, options);
  _$jscoverage['class/definer.js'][39]++;
  return Constructor;
}), _createConstructor: (function (options) {
  _$jscoverage['class/definer.js'][43]++;
  var superclass = options.$super, Constructor = this._createConstructorFn(options);
  _$jscoverage['class/definer.js'][46]++;
  if (superclass) {
    _$jscoverage['class/definer.js'][47]++;
    Constructor.prototype = Object.create(superclass.prototype);
  }
  _$jscoverage['class/definer.js'][50]++;
  return Constructor;
}), _createConstructorFn: (function (options) {
  _$jscoverage['class/definer.js'][54]++;
  var superclass = options.$super, Constructor;
  _$jscoverage['class/definer.js'][57]++;
  if (this._hasConstructorModifyingOptions(options)) {
    _$jscoverage['class/definer.js'][58]++;
    Constructor = this._createConstructorWithModifiyingOptions(options);
  }
  else {
    _$jscoverage['class/definer.js'][60]++;
    if (! superclass) {
      _$jscoverage['class/definer.js'][61]++;
      Constructor = (function () {
});
    }
    else {
      _$jscoverage['class/definer.js'][64]++;
      Constructor = (function () {
  _$jscoverage['class/definer.js'][65]++;
  superclass.apply(this, arguments);
});
    }
  }
  _$jscoverage['class/definer.js'][69]++;
  return Constructor;
}), _createConstructorWithModifiyingOptions: (function (options) {
  _$jscoverage['class/definer.js'][73]++;
  var superclass = options.$super, me = this, initBeforeSuperclass, initAfterSuperclass, init;
  _$jscoverage['class/definer.js'][79]++;
  if (! superclass) {
    _$jscoverage['class/definer.js'][80]++;
    init = this._createInitClassOptionsFn(options, {all: true});
    _$jscoverage['class/definer.js'][84]++;
    return (function () {
  _$jscoverage['class/definer.js'][85]++;
  var args = arraySlice.call(arguments);
  _$jscoverage['class/definer.js'][86]++;
  init.call(this, options, args);
});
  }
  _$jscoverage['class/definer.js'][90]++;
  initBeforeSuperclass = this._createInitClassOptionsFn(options, {before: true});
  _$jscoverage['class/definer.js'][94]++;
  initAfterSuperclass = this._createInitClassOptionsFn(options, {before: false});
  _$jscoverage['class/definer.js'][98]++;
  return (function () {
  _$jscoverage['class/definer.js'][99]++;
  var args = arraySlice.call(arguments);
  _$jscoverage['class/definer.js'][101]++;
  initBeforeSuperclass.call(this, options, args);
  _$jscoverage['class/definer.js'][102]++;
  superclass.apply(this, arguments);
  _$jscoverage['class/definer.js'][103]++;
  initAfterSuperclass.call(this, options, args);
});
}), _createInitClassOptionsFn: (function (options, config) {
  _$jscoverage['class/definer.js'][108]++;
  var me = this, compositions = this._filterCompositions(config, options.$compositions);
  _$jscoverage['class/definer.js'][111]++;
  if (compositions.length === 0) {
    _$jscoverage['class/definer.js'][112]++;
    return emptyFn;
  }
  _$jscoverage['class/definer.js'][115]++;
  return (function (options, instanceArgs) {
  _$jscoverage['class/definer.js'][116]++;
  me._initCompositions.call(this, compositions, instanceArgs);
});
}), _filterCompositions: (function (config, compositions) {
  _$jscoverage['class/definer.js'][121]++;
  var before = config.before, filtered = [];
  _$jscoverage['class/definer.js'][124]++;
  if (config.all) {
    _$jscoverage['class/definer.js'][125]++;
    return compositions;
  }
  _$jscoverage['class/definer.js'][128]++;
  aEach(compositions, (function (composition) {
  _$jscoverage['class/definer.js'][129]++;
  if (before && composition.initAfter !== true || (! before && composition.initAfter === true)) {
    _$jscoverage['class/definer.js'][130]++;
    filtered.push(composition);
  }
}));
  _$jscoverage['class/definer.js'][134]++;
  return filtered;
}), _initCompositions: (function (compositions, instanceArgs) {
  _$jscoverage['class/definer.js'][144]++;
  if (! this[ClassDefiner.COMPOSITIONS_NAME]) {
    _$jscoverage['class/definer.js'][145]++;
    this[ClassDefiner.COMPOSITIONS_NAME] = {};
  }
  _$jscoverage['class/definer.js'][148]++;
  aEach(compositions, (function (compositionConfig) {
  _$jscoverage['class/definer.js'][149]++;
  var config = apply({instance: this, instanceArgs: instanceArgs}, compositionConfig), composition;
  _$jscoverage['class/definer.js'][155]++;
  composition = new Composition(config);
  _$jscoverage['class/definer.js'][157]++;
  this[ClassDefiner.COMPOSITIONS_NAME][composition.name] = composition.getInstance();
}), this);
}), _hasConstructorModifyingOptions: (function (options) {
  _$jscoverage['class/definer.js'][162]++;
  return options.$compositions;
}), _getProcessorKey: (function (key) {
  _$jscoverage['class/definer.js'][166]++;
  return this.processorKeys[key];
}), _processAfterCreate: (function ($class, options) {
  _$jscoverage['class/definer.js'][170]++;
  this._applyValuesToProto($class, options);
  _$jscoverage['class/definer.js'][171]++;
  this._handlePostProcessors($class, options);
}), _applyValuesToProto: (function ($class, options) {
  _$jscoverage['class/definer.js'][175]++;
  var proto = $class.prototype, Super = options.$super, values = apply({$superclass: Super.prototype, $class: $class}, options);
  _$jscoverage['class/definer.js'][184]++;
  oEach(values, (function (key, value) {
  _$jscoverage['class/definer.js'][185]++;
  if (! this._getProcessorKey(key)) {
    _$jscoverage['class/definer.js'][186]++;
    proto[key] = value;
  }
}), this);
}), _handlePostProcessors: (function ($class, options) {
  _$jscoverage['class/definer.js'][192]++;
  oEach(options, (function (key, value) {
  _$jscoverage['class/definer.js'][193]++;
  var method = this._getProcessorKey(key);
  _$jscoverage['class/definer.js'][195]++;
  if (typeof this[method] === "function") {
    _$jscoverage['class/definer.js'][196]++;
    this[method].call(this, $class, options[key]);
  }
}), this);
}), _applyMixins: (function ($class, mixins) {
  _$jscoverage['class/definer.js'][202]++;
  var proto = $class.prototype;
  _$jscoverage['class/definer.js'][203]++;
  aEach(mixins, (function (mixin) {
  _$jscoverage['class/definer.js'][205]++;
  var toMix = mixin.prototype || mixin;
  _$jscoverage['class/definer.js'][206]++;
  mix(proto, toMix);
}));
}), _applyStatics: (function ($class, statics) {
  _$jscoverage['class/definer.js'][211]++;
  apply($class, statics);
}), _compose: (function ($class, compositions) {
  _$jscoverage['class/definer.js'][215]++;
  var prototype = $class.prototype, methodsToCompose;
  _$jscoverage['class/definer.js'][218]++;
  aEach(compositions, (function (compositionConfig) {
  _$jscoverage['class/definer.js'][219]++;
  var composition = new Composition(compositionConfig), name = composition.name, Constructor = composition.Constructor;
  _$jscoverage['class/definer.js'][223]++;
  composition.validate();
  _$jscoverage['class/definer.js'][225]++;
  methodsToCompose = composition.getMethodsToCompose();
  _$jscoverage['class/definer.js'][227]++;
  methodsToCompose.forEach((function (key) {
  _$jscoverage['class/definer.js'][228]++;
  if (prototype[key] === undefined) {
    _$jscoverage['class/definer.js'][229]++;
    prototype[key] = this._createComposerProtoFn(key, name);
  }
}), this);
  _$jscoverage['class/definer.js'][233]++;
  prototype.getComposition = this.__getComposition;
}), this);
}), __getComposition: (function (key) {
  _$jscoverage['class/definer.js'][245]++;
  return this[ClassDefiner.COMPOSITIONS_NAME][key];
}), _createComposerProtoFn: (function (methodName, compositionName) {
  _$jscoverage['class/definer.js'][249]++;
  return (function () {
  _$jscoverage['class/definer.js'][250]++;
  var comp = this[ClassDefiner.COMPOSITIONS_NAME][compositionName];
  _$jscoverage['class/definer.js'][251]++;
  return comp[methodName].apply(comp, arguments);
});
})};
_$jscoverage['class/definer.js'][256]++;
var Definer = new ClassDefiner();
_$jscoverage['class/definer.js'][258]++;
Definer.define = Definer.define.bind(Definer);
_$jscoverage['class/definer.js'][260]++;
module.exports = Definer;
_$jscoverage['class/definer.js'].source = ["var Base = require('./base'),","    Composition = require('./composition'),","    obj = require('../object'),","    arrayFns = require('../array'),","    emptyFn = require('../function').emptyFn,","    aEach = arrayFns.each,","    apply = obj.apply,","    oEach = obj.each,","    oFilter = obj.filter,","    mix = obj.mix,","    arraySlice = Array.prototype.slice;","","function ClassDefiner() {}","","ClassDefiner.COMPOSITIONS_NAME = '$compositions';","","ClassDefiner.prototype = {","    defaultType: Base,","","    processorKeys: {","        $mixins: '_applyMixins',","        $statics: '_applyStatics',","        $compositions: '_compose',","        $super: true","    },","","    define: function(opts) {","        var options = opts || {},","            //if super is a falsy value besides undefined that means no superclass","            Super = options.$super || (options.$super === undefined ? this.defaultType : false),","            Constructor;","","        options.$super = Super;","","        Constructor = this._createConstructor(options);","","        this._processAfterCreate(Constructor, options);","","        return Constructor;","    },","","    _createConstructor: function(options) {","        var superclass = options.$super,","            Constructor = this._createConstructorFn(options);","","        if(superclass) {","            Constructor.prototype = Object.create(superclass.prototype);","        }","        ","        return Constructor;","    },","","    _createConstructorFn: function(options) {","        var superclass = options.$super,","            Constructor;","","        if (this._hasConstructorModifyingOptions(options)) {","            Constructor = this._createConstructorWithModifiyingOptions(options);","        }","        else if(!superclass) {","            Constructor = function() {};","        }","        else {","            Constructor = function() {","                superclass.apply(this, arguments);","            };","        }","","        return Constructor;","    },","","    _createConstructorWithModifiyingOptions: function(options) {","        var superclass = options.$super,","            me = this,","            initBeforeSuperclass,","            initAfterSuperclass,","            init;","","        if (!superclass) {","            init = this._createInitClassOptionsFn(options, {","                all: true","            });","","            return function() {","                var args = arraySlice.call(arguments);","                init.call(this, options, args);","            };","        }","","        initBeforeSuperclass = this._createInitClassOptionsFn(options, {","            before: true","        });","","        initAfterSuperclass = this._createInitClassOptionsFn(options, {","            before: false","        });","","        return function() {","            var args = arraySlice.call(arguments);","","            initBeforeSuperclass.call(this, options, args);","            superclass.apply(this, arguments);","            initAfterSuperclass.call(this, options, args);","        };","    },","","    _createInitClassOptionsFn: function(options, config) {","        var me = this,","            compositions = this._filterCompositions(config, options.$compositions);","","        if(compositions.length === 0) {","            return emptyFn;","        }","        ","        return function(options, instanceArgs) {","            me._initCompositions.call(this, compositions, instanceArgs);","        };","    },","","    _filterCompositions: function(config, compositions) {","        var before = config.before, ","            filtered = [];","","        if(config.all) {","            return compositions;","        }","","        aEach(compositions, function(composition) {","            if(before &amp;&amp; composition.initAfter !== true || (!before &amp;&amp; composition.initAfter === true)) {","                    filtered.push(composition);","            }","        });","","        return filtered;","    },","","    /**","     * @private","     * options {Object} the composition config object","     * instanceArgs {Array} the arguments passed to the instance's","     * constructor.","     */","    _initCompositions: function(compositions, instanceArgs) {","        if(!this[ClassDefiner.COMPOSITIONS_NAME]) {","            this[ClassDefiner.COMPOSITIONS_NAME] = {};","        }","","        aEach(compositions, function(compositionConfig) {","            var config = apply({","                instance: this,","                instanceArgs: instanceArgs","            }, compositionConfig), ","            composition;","","            composition = new Composition(config);","","            this[ClassDefiner.COMPOSITIONS_NAME][composition.name] = composition.getInstance();","        }, this);","    },","","    _hasConstructorModifyingOptions: function(options) {","        return options.$compositions;","    },","","    _getProcessorKey: function(key) {","        return this.processorKeys[key];","    },","","    _processAfterCreate: function($class, options) {","        this._applyValuesToProto($class, options);","        this._handlePostProcessors($class, options);","    },","","    _applyValuesToProto: function($class, options) {","        var proto = $class.prototype,","            Super = options.$super,","            values = apply({","                $superclass: Super.prototype,","                $class: $class","            }, options);","","        //Don't put the define specific properties","        //on the prototype","        oEach(values, function(key, value) {","            if (!this._getProcessorKey(key)) {","                proto[key] = value;","            }","        }, this);","    },","","    _handlePostProcessors: function($class, options) {","        oEach(options, function(key, value) {","            var method = this._getProcessorKey(key);","","            if (typeof this[method] === 'function') {","                this[method].call(this, $class, options[key]);","            }","        }, this);","    },","","    _applyMixins: function($class, mixins) {","        var proto = $class.prototype;","        aEach(mixins, function(mixin) {","            //accept Constructors or Objects","            var toMix = mixin.prototype || mixin;","            mix(proto, toMix);","        });","    },","","    _applyStatics: function($class, statics) {","        apply($class, statics);","    },","","    _compose: function($class, compositions) {","        var prototype = $class.prototype,","            methodsToCompose;","","        aEach(compositions, function(compositionConfig) {","            var composition = new Composition(compositionConfig),","                name = composition.name,","                Constructor = composition.Constructor;","","            composition.validate();","","            methodsToCompose = composition.getMethodsToCompose();","","            methodsToCompose.forEach(function(key) {","                if (prototype[key] === undefined) {","                    prototype[key] = this._createComposerProtoFn(key, name);","                }","            }, this);","","            prototype.getComposition = this.__getComposition;","","        }, this);","    },","","    /**","     * @private","     * Getter for composition instance that gets put on","     * the defined class.","     * @param  {String} key","     */","    __getComposition: function(key) {","        return this[ClassDefiner.COMPOSITIONS_NAME][key];","    },","","    _createComposerProtoFn: function(methodName, compositionName) {","        return function() {","            var comp = this[ClassDefiner.COMPOSITIONS_NAME][compositionName];","            return comp[methodName].apply(comp, arguments);","        };","    }","};","","var Definer = new ClassDefiner();","//make Luc.define happy","Definer.define = Definer.define.bind(Definer);","","module.exports = Definer;"];

},{"./base":21,"./composition":39,"../object":16,"../array":18,"../function":17}],23:[function(require,module,exports){
/* automatically generated by JSCoverage - do not edit */
if (typeof _$jscoverage === 'undefined') _$jscoverage = {};
if (! _$jscoverage['class/plugin.js']) {
  _$jscoverage['class/plugin.js'] = [];
  _$jscoverage['class/plugin.js'][1] = 0;
  _$jscoverage['class/plugin.js'][7] = 0;
  _$jscoverage['class/plugin.js'][8] = 0;
  _$jscoverage['class/plugin.js'][11] = 0;
  _$jscoverage['class/plugin.js'][16] = 0;
}
_$jscoverage['class/plugin.js'][1]++;
var aEach = require("../array").each, obj = require("../object"), emptyFn = require("../function").emptyFn, apply = obj.apply;
_$jscoverage['class/plugin.js'][7]++;
function Plugin(config) {
  _$jscoverage['class/plugin.js'][8]++;
  apply(this, config);
}
_$jscoverage['class/plugin.js'][11]++;
Plugin.prototype = {init: emptyFn, destroy: emptyFn};
_$jscoverage['class/plugin.js'][16]++;
module.exports = Plugin;
_$jscoverage['class/plugin.js'].source = ["var aEach = require('../array').each,","    obj = require('../object'),","    emptyFn = require('../function').emptyFn,","    apply = obj.apply;","","","function Plugin(config) {","    apply(this, config);","}","","Plugin.prototype = {","    init: emptyFn,","    destroy: emptyFn","};","","module.exports = Plugin;"];

},{"../object":16,"../array":18,"../function":17}],24:[function(require,module,exports){
/* automatically generated by JSCoverage - do not edit */
if (typeof _$jscoverage === 'undefined') _$jscoverage = {};
if (! _$jscoverage['class/compositionEnumns.js']) {
  _$jscoverage['class/compositionEnumns.js'] = [];
  _$jscoverage['class/compositionEnumns.js'][1] = 0;
  _$jscoverage['class/compositionEnumns.js'][4] = 0;
  _$jscoverage['class/compositionEnumns.js'][12] = 0;
  _$jscoverage['class/compositionEnumns.js'][17] = 0;
  _$jscoverage['class/compositionEnumns.js'][18] = 0;
  _$jscoverage['class/compositionEnumns.js'][23] = 0;
}
_$jscoverage['class/compositionEnumns.js'][1]++;
var EventEmitter = require("../events/eventEmitter"), PluginManager = require("./pluginManager");
_$jscoverage['class/compositionEnumns.js'][4]++;
module.exports.EventEmitter = {Constructor: EventEmitter, name: "emitter", filterKeys: "allMethods"};
_$jscoverage['class/compositionEnumns.js'][12]++;
module.exports.PluginManager = {name: "plugins", initAfter: true, Constructor: PluginManager, create: (function () {
  _$jscoverage['class/compositionEnumns.js'][17]++;
  var manager = new this.Constructor();
  _$jscoverage['class/compositionEnumns.js'][18]++;
  manager.init({instance: this.instance, instanceArgs: this.instanceArgs});
  _$jscoverage['class/compositionEnumns.js'][23]++;
  return manager;
}), filterKeys: ["destroyPlugins"]};
_$jscoverage['class/compositionEnumns.js'].source = ["var EventEmitter = require('../events/eventEmitter'),","    PluginManager = require('./pluginManager');","","module.exports.EventEmitter = {","    Constructor: EventEmitter,","    name: 'emitter',","    filterKeys: 'allMethods'","};","","","","module.exports.PluginManager = {","    name: 'plugins',","    initAfter: true,","    Constructor: PluginManager,","    create: function() {","        var manager = new this.Constructor();","        manager.init({","            instance: this.instance,","            instanceArgs: this.instanceArgs","        });","","        return manager;","    },","    filterKeys: ['destroyPlugins']","};"];

},{"./pluginManager":40,"../events/eventEmitter":20}],29:[function(require,module,exports){
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
},{}],32:[function(require,module,exports){
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
},{}],33:[function(require,module,exports){
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
},{"events":26}],28:[function(require,module,exports){
require('./node_modules/es5-shim/es5-shim');
require('./node_modules/es5-shim/es5-sham');
},{"./node_modules/es5-shim/es5-shim":41,"./node_modules/es5-shim/es5-sham":42}],30:[function(require,module,exports){
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
},{"./is":32,"./array":31}],31:[function(require,module,exports){
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


},{"./compare":38,"./is":32}],38:[function(require,module,exports){
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
},{"./is":32}],34:[function(require,module,exports){
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
},{"../function":30,"../object":29}],35:[function(require,module,exports){
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
},{"./base":34,"./composition":43,"../object":29,"../array":31,"../function":30}],36:[function(require,module,exports){
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

},{"../array":31,"../object":29,"../function":30}],37:[function(require,module,exports){
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
},{"../events/eventEmitter":33,"./pluginManager":44}],39:[function(require,module,exports){
/* automatically generated by JSCoverage - do not edit */
if (typeof _$jscoverage === 'undefined') _$jscoverage = {};
if (! _$jscoverage['class/composition.js']) {
  _$jscoverage['class/composition.js'] = [];
  _$jscoverage['class/composition.js'][1] = 0;
  _$jscoverage['class/composition.js'][15] = 0;
  _$jscoverage['class/composition.js'][16] = 0;
  _$jscoverage['class/composition.js'][19] = 0;
  _$jscoverage['class/composition.js'][20] = 0;
  _$jscoverage['class/composition.js'][21] = 0;
  _$jscoverage['class/composition.js'][24] = 0;
  _$jscoverage['class/composition.js'][27] = 0;
  _$jscoverage['class/composition.js'][78] = 0;
  _$jscoverage['class/composition.js'][79] = 0;
  _$jscoverage['class/composition.js'][83] = 0;
  _$jscoverage['class/composition.js'][87] = 0;
  _$jscoverage['class/composition.js'][88] = 0;
  _$jscoverage['class/composition.js'][90] = 0;
  _$jscoverage['class/composition.js'][91] = 0;
  _$jscoverage['class/composition.js'][104] = 0;
  _$jscoverage['class/composition.js'][147] = 0;
  _$jscoverage['class/composition.js'][152] = 0;
  _$jscoverage['class/composition.js'][153] = 0;
  _$jscoverage['class/composition.js'][155] = 0;
  _$jscoverage['class/composition.js'][157] = 0;
  _$jscoverage['class/composition.js'][158] = 0;
  _$jscoverage['class/composition.js'][162] = 0;
  _$jscoverage['class/composition.js'][168] = 0;
  _$jscoverage['class/composition.js'][172] = 0;
}
_$jscoverage['class/composition.js'][1]++;
var obj = require("../object"), apply = obj.apply, mix = obj.mix, oFilter = obj.filter, emptyFn = "../function".emptyFn, is = require("../is");
_$jscoverage['class/composition.js'][15]++;
function Composition(c) {
  _$jscoverage['class/composition.js'][16]++;
  var defaults = c.defaults, config = c;
  _$jscoverage['class/composition.js'][19]++;
  if (defaults) {
    _$jscoverage['class/composition.js'][20]++;
    mix(config, config.defaults);
    _$jscoverage['class/composition.js'][21]++;
    delete config.defaults;
  }
  _$jscoverage['class/composition.js'][24]++;
  apply(this, config);
}
_$jscoverage['class/composition.js'][27]++;
Composition.prototype = {create: (function () {
  _$jscoverage['class/composition.js'][78]++;
  var Constructor = this.Constructor;
  _$jscoverage['class/composition.js'][79]++;
  return new Constructor();
}), getInstance: (function () {
  _$jscoverage['class/composition.js'][83]++;
  return this.create();
}), validate: (function () {
  _$jscoverage['class/composition.js'][87]++;
  if (this.name === undefined) {
    _$jscoverage['class/composition.js'][88]++;
    throw new Error("A name must be defined");
  }
  _$jscoverage['class/composition.js'][90]++;
  if (! is.isFunction(this.Constructor) && this.create === Composition.prototype.create) {
    _$jscoverage['class/composition.js'][91]++;
    throw new Error("The Constructor must be function if create is not overriden");
  }
}), filterFns: {allMethods: (function (key, value) {
  _$jscoverage['class/composition.js'][104]++;
  return is.isFunction(value);
})}, filterKeys: emptyFn, getMethodsToCompose: (function () {
  _$jscoverage['class/composition.js'][147]++;
  var filterKeys = this.filterKeys, pairsToAdd, filterFn;
  _$jscoverage['class/composition.js'][152]++;
  if (is.isArray(filterKeys)) {
    _$jscoverage['class/composition.js'][153]++;
    pairsToAdd = filterKeys;
  }
  else {
    _$jscoverage['class/composition.js'][155]++;
    filterFn = filterKeys;
    _$jscoverage['class/composition.js'][157]++;
    if (is.isString(filterKeys)) {
      _$jscoverage['class/composition.js'][158]++;
      filterFn = this.filterFns[filterKeys];
    }
    _$jscoverage['class/composition.js'][162]++;
    pairsToAdd = oFilter(this.Constructor && this.Constructor.prototype, filterFn, this, {ownProperties: false, keys: true});
  }
  _$jscoverage['class/composition.js'][168]++;
  return pairsToAdd;
})};
_$jscoverage['class/composition.js'][172]++;
module.exports = Composition;
_$jscoverage['class/composition.js'].source = ["var obj = require('../object'),","    apply = obj.apply,","    mix = obj.mix,","    oFilter = obj.filter,","    emptyFn = ('../function').emptyFn,","    is = require('../is');","","/**"," * @class  Luc.Composition"," * @protected"," * class that wraps $composition config objects"," * to conform to an api. The config object"," * will override any protected methods and default configs."," */","function Composition(c) {","    var defaults = c.defaults,","        config = c;","","    if(defaults) {","        mix(config, config.defaults);","        delete config.defaults;","    }","","    apply(this, config);","}","","Composition.prototype = {","    /**","     * @cfg {String} name (required) the name","     */","    ","    /**","     * @cfg {Function} Constructor (required) the Constructor","     * to use when creating the composition instance.  This","     * is required if Luc.Composition.create is not overrwitten by","     * the passed in composition config object.","     */","    ","    /**","     * @protected","     * By default just return a newly created Constructor instance.","     * ","     * When create is called the following properties can be used :","     * ","     * this.instance The instance that is creating","     * the composition.","     * ","     * this.Constructor the constructor that is passed in from","     * the composition config. ","     *","     * this.instanceArgs the arguments passed into the instance when it ","     * is being created.  For example","","        new MyClassWithAComposition({plugins: []})","        //inside of the create method","        this.instanceArgs","        &gt;[{plugins: []}]","","     * @return {Object} ","     * the composition instance.","     *","     * For example set the emitters maxListeners","     * to what the instance has configed.","      ","        maxListeners: 100,","        $compositions: {","            Constructor: Luc.EventEmitter,","            create: function() {","                var emitter = new this.Constructor();","                emitter.setMaxListeners(this.instance.maxListeners);","                return emitter;","            },","            name: 'emitter'","        }","","     */","    create: function() {","        var Constructor = this.Constructor;","        return new Constructor();","    },","","    getInstance: function() {","        return this.create();","    },","","    validate: function() {","        if(this.name  === undefined) {","            throw new Error('A name must be defined');","        }","        if(!is.isFunction(this.Constructor) &amp;&amp; this.create === Composition.prototype.create) {","            throw new Error('The Constructor must be function if create is not overriden');","        }","    },","","    /**","     * @property filterFns","     * @type {Object}","     * @property filterFns.allMethods return all methods from the","     * constructors prototype","     * @type {Function}","     */","    filterFns: {","        allMethods: function(key, value) {","            return is.isFunction(value);","        }","    },","","    /**","     * @cfg {Function/String/Array[]} filterKeys","     * The keys to add to the definers prototype that will in turn call","     * the compositions method.","     * ","     * Defaults to Luc.emptyFn. ","     * If an array is passed it will just use that Array.","     * ","     * If a string is passed and matches a method from ","     * Luc.Composition.filterFns it will call that instead.","     * ","     * If a function is defined it","     * will get called while iterating over each key value pair of the ","     * Constructor's prototype, if a truthy value is ","     * returned the property will be added to the defining","     * classes prototype.","     * ","     * For example this config will only expose the emit method ","     * to the defining class","     ","        $compositions: {","            Constructor: Luc.EventEmitter,","            filterKeys: function(key, value) {","                return key === 'emit';","            },","            name: 'emitter'","        }","     * this is also a valid config","     * ","        $compositions: {","            Constructor: Luc.EventEmitter,","            filterKeys: ['emitter'],","            name: 'emitter'","        }","     * ","     */","    filterKeys: emptyFn,","","    getMethodsToCompose: function() {","        var filterKeys = this.filterKeys,","            pairsToAdd,","            filterFn;","","","        if (is.isArray(filterKeys)) {","            pairsToAdd = filterKeys;","        } else {","            filterFn = filterKeys;","","            if (is.isString(filterKeys)) {","                filterFn = this.filterFns[filterKeys];","            }","","            //Constructors are not needed if create is overwritten","            pairsToAdd = oFilter(this.Constructor &amp;&amp; this.Constructor.prototype, filterFn, this, {","                ownProperties: false,","                keys: true","            });","        }","","        return pairsToAdd;","    }","};","","module.exports = Composition;"];

},{"../object":16,"../is":19}],40:[function(require,module,exports){
/* automatically generated by JSCoverage - do not edit */
if (typeof _$jscoverage === 'undefined') _$jscoverage = {};
if (! _$jscoverage['class/pluginManager.js']) {
  _$jscoverage['class/pluginManager.js'] = [];
  _$jscoverage['class/pluginManager.js'][1] = 0;
  _$jscoverage['class/pluginManager.js'][9] = 0;
  _$jscoverage['class/pluginManager.js'][11] = 0;
  _$jscoverage['class/pluginManager.js'][15] = 0;
  _$jscoverage['class/pluginManager.js'][16] = 0;
  _$jscoverage['class/pluginManager.js'][20] = 0;
  _$jscoverage['class/pluginManager.js'][22] = 0;
  _$jscoverage['class/pluginManager.js'][24] = 0;
  _$jscoverage['class/pluginManager.js'][25] = 0;
  _$jscoverage['class/pluginManager.js'][26] = 0;
  _$jscoverage['class/pluginManager.js'][28] = 0;
  _$jscoverage['class/pluginManager.js'][30] = 0;
  _$jscoverage['class/pluginManager.js'][36] = 0;
  _$jscoverage['class/pluginManager.js'][43] = 0;
  _$jscoverage['class/pluginManager.js'][50] = 0;
  _$jscoverage['class/pluginManager.js'][54] = 0;
  _$jscoverage['class/pluginManager.js'][55] = 0;
  _$jscoverage['class/pluginManager.js'][60] = 0;
  _$jscoverage['class/pluginManager.js'][61] = 0;
  _$jscoverage['class/pluginManager.js'][62] = 0;
  _$jscoverage['class/pluginManager.js'][68] = 0;
}
_$jscoverage['class/pluginManager.js'][1]++;
var Plugin = require("./plugin"), is = require("../is"), obj = require("../object"), arr = require("../array"), aEach = arr.each, mix = obj.mix, apply = obj.apply;
_$jscoverage['class/pluginManager.js'][9]++;
function PluginManager() {
}
_$jscoverage['class/pluginManager.js'][11]++;
PluginManager.prototype = {defaultPlugin: Plugin, init: (function (instanceValues) {
  _$jscoverage['class/pluginManager.js'][15]++;
  apply(this, instanceValues);
  _$jscoverage['class/pluginManager.js'][16]++;
  this.createPlugins();
}), createPlugins: (function () {
  _$jscoverage['class/pluginManager.js'][20]++;
  var config = this.instanceArgs[0];
  _$jscoverage['class/pluginManager.js'][22]++;
  this.plugins = [];
  _$jscoverage['class/pluginManager.js'][24]++;
  aEach(config.plugins, (function (pluginConfig) {
  _$jscoverage['class/pluginManager.js'][25]++;
  pluginConfig.owner = this.instance;
  _$jscoverage['class/pluginManager.js'][26]++;
  var pluginInstance = this.createPlugin(pluginConfig);
  _$jscoverage['class/pluginManager.js'][28]++;
  this.initPlugin(pluginInstance);
  _$jscoverage['class/pluginManager.js'][30]++;
  this.plugins.push(pluginInstance);
}), this);
}), createPlugin: (function (config) {
  _$jscoverage['class/pluginManager.js'][36]++;
  if (config.Constructor) {
    _$jscoverage['class/pluginManager.js'][43]++;
    return new config.Constructor(apply(config, {Constructor: undefined}));
  }
  _$jscoverage['class/pluginManager.js'][50]++;
  return new this.defaultPlugin(config);
}), initPlugin: (function (plugin) {
  _$jscoverage['class/pluginManager.js'][54]++;
  if (is.isFunction(plugin.init)) {
    _$jscoverage['class/pluginManager.js'][55]++;
    plugin.init(this.instance);
  }
}), destroyPlugins: (function () {
  _$jscoverage['class/pluginManager.js'][60]++;
  this.plugins.forEach((function (plugin) {
  _$jscoverage['class/pluginManager.js'][61]++;
  if (is.isFunction(plugin.destroy)) {
    _$jscoverage['class/pluginManager.js'][62]++;
    plugin.destroy(this.instance);
  }
}));
})};
_$jscoverage['class/pluginManager.js'][68]++;
module.exports = PluginManager;
_$jscoverage['class/pluginManager.js'].source = ["var Plugin = require('./plugin'),","    is = require('../is'),","    obj = require('../object'),","    arr = require('../array'),","    aEach = arr.each,","    mix = obj.mix,","    apply = obj.apply;","","function PluginManager() {}","","PluginManager.prototype = {","    defaultPlugin: Plugin,","","    init: function(instanceValues) {","        apply(this, instanceValues);","        this.createPlugins();","    },","","    createPlugins: function() {","        var config = this.instanceArgs[0];","","        this.plugins = [];","","        aEach(config.plugins, function(pluginConfig) {","            pluginConfig.owner = this.instance;","            var pluginInstance = this.createPlugin(pluginConfig);","","            this.initPlugin(pluginInstance);","","            this.plugins.push(pluginInstance);","        }, this);","    },","","    createPlugin: function(config) {","","        if (config.Constructor) {","            //call the configed Constructor with the ","            //passed in config but take off the Constructor","            //config.","             ","            //The plugin Constructor ","            //should not need to know about itself","            return new config.Constructor(apply(config, {","                Constructor: undefined","            }));","        }","","        //if Constructor property is not on","        //the config just use the default Plugin","        return new this.defaultPlugin(config);","    },","","    initPlugin: function(plugin) {","        if (is.isFunction(plugin.init)) {","            plugin.init(this.instance);","        }","    },","","    destroyPlugins: function() {","        this.plugins.forEach(function(plugin) {","            if (is.isFunction(plugin.destroy)) {","                plugin.destroy(this.instance);","            }","        });","    }","};","","module.exports = PluginManager;"];

},{"./plugin":23,"../is":19,"../object":16,"../array":18}],41:[function(require,module,exports){
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
},{}],42:[function(require,module,exports){
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
},{}],44:[function(require,module,exports){
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
},{"./plugin":36,"../is":32,"../object":29,"../array":31}],43:[function(require,module,exports){
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
},{"../object":29,"../is":32}]},{},[1])
;