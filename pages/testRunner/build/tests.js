;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
require('../array');
require('../object');
require('../nodet');
require('../class');
require('../is');
require('../function');
require('../compare');
},{"../array":2,"../nodet":3,"../object":4,"../class":5,"../is":6,"../function":7,"../compare":8}],2:[function(require,module,exports){
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
},{"./lucTestLib":9,"expect.js":10}],3:[function(require,module,exports){
var Luc = require('./lucTestLib'),
    expect = require('expect.js');
var emitterTest = require('./common').testEmitter;
//Sanity check to make sure node components work on the browser.
describe('Luc Node functions', function() {

    it('Emitter', function() {
        emitterTest(new Luc.EventEmitter());
    });
})
},{"./lucTestLib":9,"./common":11,"expect.js":10}],5:[function(require,module,exports){
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
            methods: 'allMethods'
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
});





},{"./common":11,"./lucTestLib":9,"expect.js":10}],6:[function(require,module,exports){
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
},{"./lucTestLib":9,"expect.js":10}],4:[function(require,module,exports){
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
},{"./lucTestLib":9,"expect.js":10}],7:[function(require,module,exports){
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
},{"./lucTestLib":9,"expect.js":10}],8:[function(require,module,exports){
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
},{"./lucTestLib":9,"expect.js":10}],9:[function(require,module,exports){
 module.exports = require('../lib/luc-es5-shim');
},{"../lib/luc-es5-shim":12}],11:[function(require,module,exports){
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
},{"./lucTestLib":9,"expect.js":10}],13:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

})(require("__browserify_Buffer").Buffer)
},{"__browserify_Buffer":13}],12:[function(require,module,exports){
/**
 * @license https://raw.github.com/kriskowal/es5-shim/master/LICENSE
 * es5-shim license
 */

if(typeof window !== 'undefined') {
    require('es5-shim-sham');
}

module.exports = require('./luc');
},{"./luc":14,"es5-shim-sham":15}],14:[function(require,module,exports){
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
},{"./object":16,"./function":17,"./array":18,"./arrayFnGenerator":19,"./is":20,"./events/eventEmitter":21,"./class/base":22,"./class/definer":23,"./class/plugin":24,"./class/pluginManager":25,"./class/compositionEnums":26,"./compare":27,"./id":28}],16:[function(require,module,exports){
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
},{}],20:[function(require,module,exports){
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
},{}],28:[function(require,module,exports){
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
},{}],21:[function(require,module,exports){
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
},{"events":29}],15:[function(require,module,exports){
require('./node_modules/es5-shim/es5-shim');
require('./node_modules/es5-shim/es5-sham');
},{"./node_modules/es5-shim/es5-shim":30,"./node_modules/es5-shim/es5-sham":31}],17:[function(require,module,exports){
var is = require('./is'),
    aInsert = require('./array').insert;
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
            len = functions.length;

        for(;i < len -1; ++i) {
            functions[i].apply(this, arguments);
        }

        return functions[len -1 ].apply(this, arguments);
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
},{"./is":20,"./array":18}],18:[function(require,module,exports){
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
    var found = arr.filter(fn);
    return found;
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

},{"./compare":27,"./is":20}],19:[function(require,module,exports){
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
},{"./array":18,"./is":20}],27:[function(require,module,exports){
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


function createBoundCompareFn(object, c) {
    var compareFn = getCompareFn(object, c);

    return _createBoundCompare(object, compareFn);
}

exports.compare = compare;
exports.createBoundCompareFn = createBoundCompareFn;
},{"./is":20}],22:[function(require,module,exports){
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
},{"../function":17,"../object":16}],23:[function(require,module,exports){
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
},{"./base":22,"./composition":32,"../object":16,"../array":18,"../function":17,"../is":20}],24:[function(require,module,exports){
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

},{"../array":18,"../object":16,"../function":17}],25:[function(require,module,exports){
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
},{"./plugin":24,"../is":20,"../object":16,"../array":18}],26:[function(require,module,exports){
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
        var manager = new this.Constructor({
            instance: this.instance,
            instanceArgs: this.instanceArgs
        });

        return manager;
    },
    ignoreMethods: 'defaultPlugin',
    methods: 'publicMethods'
};
},{"../events/eventEmitter":21,"./pluginManager":25}],33:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){
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
},{"__browserify_process":33}],30:[function(require,module,exports){
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
},{}],31:[function(require,module,exports){
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
},{}],32:[function(require,module,exports){
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
            pairsToAdd,
            filterFn;


        if (is.isArray(methods)) {
            pairsToAdd = methods;
        } else {
            filterFn = methods;

            if (is.isString(methods)) {
                filterFn = this.filterMethodFns[methods];
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
},{"../object":16,"../array":18,"../is":20}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy90ZXN0L2xpYi9sdWMuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy90ZXN0L2FycmF5LmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvdGVzdC9ub2RldC5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL3Rlc3QvY2xhc3MuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy90ZXN0L2lzLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvdGVzdC9vYmplY3QuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy90ZXN0L2Z1bmN0aW9uLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvdGVzdC9jb21wYXJlLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvdGVzdC9sdWNUZXN0TGliLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvdGVzdC9jb21tb24uanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvaW5zZXJ0LW1vZHVsZS1nbG9iYWxzL2J1ZmZlci5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL25vZGVfbW9kdWxlcy9leHBlY3QuanMvZXhwZWN0LmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2x1Yy1lczUtc2hpbS5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9sdWMuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvb2JqZWN0LmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2lzLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2lkLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2V2ZW50cy9ldmVudEVtaXR0ZXIuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9ub2RlX21vZHVsZXMvZXM1LXNoaW0tc2hhbS9pbmRleC5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9mdW5jdGlvbi5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9hcnJheS5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9hcnJheUZuR2VuZXJhdG9yLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2NvbXBhcmUuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9saWIvY2xhc3MvYmFzZS5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9jbGFzcy9kZWZpbmVyLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2NsYXNzL3BsdWdpbi5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9jbGFzcy9wbHVnaW5NYW5hZ2VyLmpzIiwiL2hvbWUvcGxsZWUvZGV2L2dpdC9sdWMvbGliL2NsYXNzL2NvbXBvc2l0aW9uRW51bXMuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvaW5zZXJ0LW1vZHVsZS1nbG9iYWxzL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCIvaG9tZS9wbGxlZS9kZXYvZ2l0L2x1Yy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1idWlsdGlucy9idWlsdGluL2V2ZW50cy5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL25vZGVfbW9kdWxlcy9lczUtc2hpbS1zaGFtL25vZGVfbW9kdWxlcy9lczUtc2hpbS9lczUtc2hpbS5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL25vZGVfbW9kdWxlcy9lczUtc2hpbS1zaGFtL25vZGVfbW9kdWxlcy9lczUtc2hpbS9lczUtc2hhbS5qcyIsIi9ob21lL3BsbGVlL2Rldi9naXQvbHVjL2xpYi9jbGFzcy9jb21wb3NpdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25RQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEpBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3B4SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdHVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNWRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3owQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdk1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbnlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJy4uL2FycmF5Jyk7XG5yZXF1aXJlKCcuLi9vYmplY3QnKTtcbnJlcXVpcmUoJy4uL25vZGV0Jyk7XG5yZXF1aXJlKCcuLi9jbGFzcycpO1xucmVxdWlyZSgnLi4vaXMnKTtcbnJlcXVpcmUoJy4uL2Z1bmN0aW9uJyk7XG5yZXF1aXJlKCcuLi9jb21wYXJlJyk7IiwidmFyIEx1YyA9IHJlcXVpcmUoJy4vbHVjVGVzdExpYicpLFxuICAgIGV4cGVjdCA9IHJlcXVpcmUoJ2V4cGVjdC5qcycpO1xuXG5kZXNjcmliZSgnTHVjIEFycmF5IGZ1bmN0aW9ucycsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdlYWNoJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcnIgPSBbJ2EnLCAnYicsICd6J10sIG9iaiA9IHtzdHIgOicnIH07XG5cbiAgICAgICAgTHVjLkFycmF5LmVhY2goYXJyLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGEpIHtcbiAgICAgICAgICAgIHRoaXMuc3RyICs9IHZhbHVlICsgaW5kZXggKyBhLmxlbmd0aDtcbiAgICAgICAgfSwgb2JqKTtcbiAgICAgICAgZXhwZWN0KG9iai5zdHIpLnRvLmVxbCgnYTAzYjEzejIzJyk7XG4gICAgfSk7XG5cbiAgICBpdCgndG9BcnJheScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LnRvQXJyYXkodW5kZWZpbmVkKSkudG8uZXFsKFtdKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS50b0FycmF5KG51bGwpKS50by5lcWwoW10pO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LnRvQXJyYXkoW10pKS50by5lcWwoW10pO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LnRvQXJyYXkoJycpKS50by5lcWwoWycnXSk7XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkudG9BcnJheShbMV0pKS50by5lcWwoWzFdKTtcbiAgICB9KTtcblxuICAgIGl0KCdpbnNlcnQgYXBwZW5kJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcnIxID0gWzEsIDIsIDNdLFxuICAgICAgICAgICAgYXJyMiA9IFs0LCA1LCA2XTtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5pbnNlcnQoYXJyMSwgYXJyMiwgdHJ1ZSkpLnRvLmJlLmVxbChbMSwgMiwgMywgNCwgNSwgNl0pO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5Lmluc2VydChhcnIyLCBhcnIxLCB0cnVlKSkudG8uYmUuZXFsKFs0LCA1LCA2LCAxLCAyLCAzXSk7XG4gICAgfSk7XG5cbiAgICBpdCgnaW5zZXJ0IGZyb20gaW5kZXhlcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJyMSA9IFsxLCAyLCAzXSxcbiAgICAgICAgICAgIGFycjIgPSBbNCwgNSwgNl07XG5cbiAgICAgICAgICAgIGV4cGVjdChMdWMuQXJyYXkuaW5zZXJ0KGFycjEsIGFycjIsIDMpKS50by5iZS5lcWwoWzEsMiwzLDQsNSw2XSk7XG4gICAgICAgICAgICBleHBlY3QoTHVjLkFycmF5Lmluc2VydChhcnIxLCBhcnIyLCAyKSkudG8uYmUuZXFsKFsxLDIsNCw1LDYsM10pO1xuICAgICAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5pbnNlcnQoYXJyMSwgYXJyMiwgMSkpLnRvLmJlLmVxbChbMSw0LDUsNiwyLDNdKTtcbiAgICAgICAgICAgIGV4cGVjdChMdWMuQXJyYXkuaW5zZXJ0KGFycjEsIGFycjIsIDApKS50by5iZS5lcWwoWzQsNSw2LCAxLDIsM10pO1xuXG4gICAgICAgICAgICBleHBlY3QoTHVjLkFycmF5Lmluc2VydChhcnIyLCBhcnIxLCAzKSkudG8uYmUuZXFsKFs0LDUsNiwxLDIsM10pO1xuICAgICAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5pbnNlcnQoYXJyMiwgYXJyMSwgMikpLnRvLmJlLmVxbChbNCw1LDEsMiwzLDZdKTtcbiAgICAgICAgICAgIGV4cGVjdChMdWMuQXJyYXkuaW5zZXJ0KGFycjIsIGFycjEsIDEpKS50by5iZS5lcWwoWzQsMSwyLDMsNSw2XSk7XG4gICAgICAgICAgICBleHBlY3QoTHVjLkFycmF5Lmluc2VydChhcnIyLCBhcnIxLCAwKSkudG8uYmUuZXFsKFsxLDIsMyw0LDUsNl0pO1xuXG4gICAgfSk7XG5cblxuICAgIGl0KCdpbnNlcnQgYXJyYXlzIGFyZSBub3QgbW9kaWZpZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFycjEgPSBbMSwgMiwgM10sXG4gICAgICAgICAgICBhcnIyID0gWzQsIDUsIDZdO1xuICAgICAgICBMdWMuQXJyYXkuaW5zZXJ0KGFycjEsIGFycjIsIDEpO1xuICAgICAgICBMdWMuQXJyYXkuaW5zZXJ0KGFycjIsIGFycjEsIDEpO1xuICAgICAgICAvL3Rlc3Qgbm8gbW9kaWZ5XG4gICAgICAgIGV4cGVjdChhcnIxKS50by5iZS5lcWwoWzEsIDIsIDNdKTtcbiAgICAgICAgZXhwZWN0KGFycjIpLnRvLmJlLmVxbChbNCwgNSwgNl0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3JlbW92ZUFsbCB3aXRoIHNpbmdsZSBmYWxzeScsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJyID0gW2ZhbHNlLCBmYWxzZSwgMCwgJyddO1xuICAgICAgICB2YXIgcmV0ID0gTHVjLkFycmF5LnJlbW92ZUFsbChhcnIsICcnKTtcblxuICAgICAgICBleHBlY3QoYXJyKS50by5iZS5lcWwoW2ZhbHNlLCBmYWxzZSwgMF0pO1xuICAgICAgICBleHBlY3QocmV0KS50by5iZS5lcWwoWycnXSk7XG4gICAgfSk7XG5cbiAgICBpdCgncmVtb3ZlQWxsIGFsbCB2YWx1ZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyciA9IFtmYWxzZSwgZmFsc2UsIGZhbHNlXTtcbiAgICAgICAgdmFyIHJldCA9IEx1Yy5BcnJheS5yZW1vdmVBbGwoYXJyLCBmYWxzZSk7XG5cbiAgICAgICAgZXhwZWN0KGFycikudG8uYmUuZXFsKFtdKTtcbiAgICAgICAgZXhwZWN0KHJldCkudG8uYmUuZXFsKFtmYWxzZSwgZmFsc2UsIGZhbHNlXSk7XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkucmVtb3ZlQWxsKGFyciwgZmFsc2UpKS50by5iZS5lcWwoW10pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3JlbW92ZUFsbCBsb29zZSBjb21wYXJpc29uJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcnIgPSBbe30sIHthOjF9LCB7YToxLCBiOjJ9XTtcbiAgICAgICAgdmFyIHJldCA9IEx1Yy5BcnJheS5yZW1vdmVBbGwoYXJyLCB7YTogMX0pO1xuXG4gICAgICAgIGV4cGVjdChyZXQpLnRvLmJlLmVxbChbe2E6MX0sIHthOjEsIGI6Mn1dKTtcbiAgICAgICAgZXhwZWN0KGFycikudG8uYmUuZXFsKFt7fV0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3JlbW92ZUFsbCBkZWVwIGNvbXBhcmlzb24nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyciA9IFt7fSwge2E6MX0sIHthOjEsIGI6Mn1dO1xuICAgICAgICB2YXIgcmV0ID0gTHVjLkFycmF5LnJlbW92ZUFsbChhcnIsIHthOiAxfSwge3R5cGU6ICdkZWVwJ30pO1xuXG4gICAgICAgIGV4cGVjdChyZXQpLnRvLmJlLmVxbChbe2E6MX1dKTtcbiAgICAgICAgZXhwZWN0KGFycikudG8uYmUuZXFsKFt7fSx7YToxLCBiOjJ9XSk7XG4gICAgfSk7XG5cbiAgICBpdCgncmVtb3ZlQWxsTm90IHNpbmdsZSBmYWxzeScsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJyID0gW2ZhbHNlLCBmYWxzZSwgMCwgJyddLFxuICAgICAgICAgICAgcmV0ID0gTHVjLkFycmF5LnJlbW92ZUFsbE5vdChhcnIsICcnKTtcblxuICAgICAgICBleHBlY3QoYXJyKS50by5iZS5lcWwoWycnXSk7XG4gICAgICAgIGV4cGVjdChyZXQpLnRvLmJlLmVxbChbZmFsc2UsIGZhbHNlLCAwXSk7XG4gICAgfSk7XG5cbiAgICBpdCgncmVtb3ZlQWxsTm90IG5vIG1hdGNoZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyciA9IFtmYWxzZSwgZmFsc2UsIGZhbHNlXTtcbiAgICAgICAgdmFyIHJldCA9IEx1Yy5BcnJheS5yZW1vdmVBbGxOb3QoYXJyLCBmYWxzZSk7XG5cbiAgICAgICAgZXhwZWN0KGFycikudG8uYmUuZXFsKFtmYWxzZSwgZmFsc2UsIGZhbHNlXSk7XG4gICAgICAgIGV4cGVjdChyZXQpLnRvLmJlLmVxbChbXSk7XG5cbiAgICB9KTtcblxuICAgIGl0KCdyZW1vdmVBbGxOb3Qgc2luZ2xlIGxvb3NlIGNvbXBhcmUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyciA9IFt7fSwge2E6MX0sIHthOjEsIGI6Mn1dO1xuICAgICAgICB2YXIgcmV0ID0gTHVjLkFycmF5LnJlbW92ZUFsbE5vdChhcnIsIHthOiAxfSk7XG5cbiAgICAgICAgZXhwZWN0KGFycikudG8uYmUuZXFsKFt7YToxfSwge2E6MSwgYjoyfV0pO1xuICAgICAgICBleHBlY3QocmV0KS50by5iZS5lcWwoW3t9XSk7XG4gICAgfSk7XG5cbiAgICBpdCgncmVtb3ZlRmlyc3QgZmlyc3QgbXVsdGkgYXJyYXkgbWF0Y2gnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyciA9IFtbXSxbMSwyXSwgWzEsMl1dO1xuICAgICAgICB2YXIgcmV0ID0gTHVjLkFycmF5LnJlbW92ZUZpcnN0KGFyciwgWzEsMl0pO1xuXG4gICAgICAgIGV4cGVjdChhcnIpLnRvLmJlLmVxbChbW10sWzEsMl1dKTtcbiAgICAgICAgZXhwZWN0KHJldCkudG8uYmUuZXFsKFsxLDJdKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5yZW1vdmVGaXJzdChhcnIsIFsxLDJdKSkudG8uYmUuZXFsKFsxLDJdKTtcbiAgICB9KTtcblxuICAgIGl0KCdyZW1vdmVGaXJzdCBlbXB0eSBhcnJheSBzdHJpY3QnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyciA9IFtbXSwgW10sIFtdXTtcbiAgICAgICAgdmFyIHJldCA9IEx1Yy5BcnJheS5yZW1vdmVGaXJzdChhcnIsIFtdLCB7dHlwZTogJ3N0cmljdCd9KTtcbiAgICAgICAgZXhwZWN0KGFycikudG8uYmUuZXFsKFtbXSxbXSxbXV0pO1xuICAgICAgICBleHBlY3QocmV0KS50by5iZS5lcWwoZmFsc2UpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3JlbW92ZUZpcnN0IGVtcHR5IGFycmF5IHNoYWxsb3cnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyciA9IFtbXSwgW10sIFtdXTtcbiAgICAgICAgdmFyIHJldCA9IEx1Yy5BcnJheS5yZW1vdmVGaXJzdChhcnIsIFtdLCB7dHlwZTogJ3NoYWxsb3cnfSk7XG4gICAgICAgIGV4cGVjdChhcnIpLnRvLmJlLmVxbChbW10sW11dKTtcbiAgICAgICAgZXhwZWN0KHJldCkudG8uYmUuZXFsKFtdKTtcbiAgICB9KTtcblxuICAgIGl0KCdyZW1vdmVGaXJzdE5vdCBtdWx0aSBhcnJheSBtYXRjaCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJyID0gW1tdLFsxLDJdLCBbMSwyXV07XG4gICAgICAgIHZhciByZXQgPSBMdWMuQXJyYXkucmVtb3ZlRmlyc3ROb3QoYXJyLCBbXSk7XG5cbiAgICAgICAgZXhwZWN0KGFycikudG8uYmUuZXFsKFtbXSxbMSwyXV0pO1xuICAgICAgICBleHBlY3QocmV0KS50by5iZS5lcWwoWzEsMl0pO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LnJlbW92ZUZpcnN0Tm90KGFyciwgWzEsMl0pKS50by5iZS5lcWwoW10pO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LnJlbW92ZUZpcnN0Tm90KGFyciwgWzEsMl0pKS50by5iZShmYWxzZSk7XG4gICAgfSk7XG5cbiAgICBpdCgncmVtb3ZlRmlyc3ROb3Qgbm90IG1hdGNoZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyciA9IFt7YToxfSwge2E6MSwgYjoyfSwge2E6MX1dO1xuICAgICAgICB2YXIgcmV0ID0gTHVjLkFycmF5LnJlbW92ZUZpcnN0Tm90KGFyciwge2E6IDF9KTtcblxuICAgICAgICBleHBlY3QoYXJyKS50by5iZS5lcWwoW3thOjF9LCB7YToxLCBiOjJ9LCB7YToxfV0pO1xuICAgICAgICBleHBlY3QocmV0KS50by5iZS5lcWwoZmFsc2UpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3JlbW92ZUZpcnN0Tm90IG5vdCBzdHJpY3QgY29tcGFyZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYSA9IHthOiAxfTtcbiAgICAgICAgdmFyIGFyciA9IFt7YToxfSwge2E6MSwgYjoyfSwgYV07XG5cbiAgICAgICAgdmFyIHJldCA9IEx1Yy5BcnJheS5yZW1vdmVGaXJzdE5vdChhcnIsIHthOjF9LCB7dHlwZTogJ3N0cmljdCd9KTtcbiAgICAgICAgZXhwZWN0KGFycikudG8uYmUuZXFsKFt7YToxLCBiOjJ9LCB7YToxfV0pO1xuICAgICAgICBleHBlY3QocmV0KS50by5iZS5lcWwoe2E6MX0pO1xuICAgICAgICBMdWMuQXJyYXkucmVtb3ZlRmlyc3ROb3QoYXJyLCBhLCB7dHlwZTogJ3N0cmljdCd9KTtcbiAgICAgICAgTHVjLkFycmF5LnJlbW92ZUZpcnN0Tm90KGFyciwgYSwge3R5cGU6ICdzdHJpY3QnfSk7XG4gICAgICAgIHJldCA9IEx1Yy5BcnJheS5yZW1vdmVGaXJzdE5vdChhcnIsIGEsIHt0eXBlOiAnc3RyaWN0J30pO1xuICAgICAgICBleHBlY3QoYXJyKS50by5iZS5lcWwoW3thOjF9XSk7XG4gICAgICAgIGV4cGVjdChyZXQpLnRvLmJlKGZhbHNlKTtcbiAgICB9KTtcblxuICAgIGl0KCdmaW5kRmlyc3QgaGFuZGxlIGxvb3NlIGNvbXBhcmUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgIHZhciBhcnIgPSBbe2E6MX0sIHthOjF9LCB7YToxfSwge2E6MSwgYjoyfV07XG4gICAgICAgICBleHBlY3QoTHVjLkFycmF5LmZpbmRGaXJzdChhcnIsIHthOjEsIGI6Mn0pKS50by5iZS5lcWwoe2E6MSwgYjoyfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnZmluZEZpcnN0IHN0cmljdCBjb21wYXJlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcnIgPSBbe2E6MX0sIHthOjF9LCB7YToxfSwge2E6MSwgYjoyfV07XG4gICAgICAgICBleHBlY3QoTHVjLkFycmF5LmZpbmRGaXJzdChhcnIsIHthOjEsIGI6Mn0sIHt0eXBlOiAnc3RyaWN0J30pKS50by5iZS5lcWwoZmFsc2UpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2ZpbmRGaXJzdCBtYXRjaCBhbGwgcHJvcHMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyciA9IFt7YToxfSwge2E6MX0sIHthOjF9LCB7YToxLCBiOjJ9XTtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5maW5kRmlyc3QoYXJyLCB7YToxLCBiOjIsIGM6M30pKS50by5iZS5lcWwoZmFsc2UpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2ZpbmRGaXJzdCBhbGwgZmFsc3lzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcnIgPSBbZmFsc2UsIDAsIHVuZGVmaW5lZCwgbnVsbCwgJyddO1xuICAgICAgICAvL3NoaW0vSUUgYnVnXG4gICAgICAgIGlmKDAgaW4gW3VuZGVmaW5lZF0pIHtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5maW5kRmlyc3QoYXJyLCBudWxsKSkudG8uYmUuZXFsKG51bGwpO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LmZpbmRGaXJzdChhcnIsIGZhbHNlKSkudG8uYmUuZXFsKGZhbHNlKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5maW5kRmlyc3QoYXJyLCB1bmRlZmluZWQpKS50by5iZS5lcWwodW5kZWZpbmVkKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5maW5kRmlyc3QoYXJyLCAwKSkudG8uYmUuZXFsKDApO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBpdCgnZmluZEZpcnN0IGRhdGVzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICB2YXIgYXJyID0gW25ldyBEYXRlKDEwMDApLCBuZXcgRGF0ZSgxMDAwKSwgbmV3IERhdGUoMTAwMSldO1xuICAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5maW5kRmlyc3QoYXJyLCBuZXcgRGF0ZSgxMDAxKSkpLnRvLmJlLmVxbChuZXcgRGF0ZSgxMDAxKSk7XG4gICAgICAgICBleHBlY3QoTHVjLkFycmF5LmZpbmRGaXJzdChhcnIsIG5ldyBEYXRlKDEwMDIpKSkudG8uYmUoZmFsc2UpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2ZpbmRGaXJzdCBzdHJpY3QgYW5kIHNoYWxsb3cgZGF0ZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgIHZhciBkID0gbmV3IERhdGUoKTtcbiAgICAgICAgIHZhciBhcnIgPSBbbmV3IERhdGUoMTAwMCksIG5ldyBEYXRlKDEwMDApLCBkXTtcbiAgICAgICAgIGV4cGVjdChMdWMuQXJyYXkuZmluZEZpcnN0KGFyciwgZCwge3R5cGU6ICdzdHJpY3QnfSkpLnRvLmJlKGQpO1xuICAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5maW5kRmlyc3QoYXJyLCBkLCB7dHlwZTogJ3NoYWxsb3cnfSkpLnRvLmJlKGQpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2ZpbmRGaXJzdE5vdCBtYXRjaGluZyBmaXJzdCBrZXkgdmFsdWUnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgYXJyID0gW3thOjF9LCB7YToxfSwge2E6MX0sIHthOjEsIGI6Mn1dO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LmZpbmRGaXJzdE5vdChhcnIsIHthOjEsIGI6Mn0pKS50by5iZS5lcWwoe2E6MX0pO1xuICAgIH0pXG5cbiAgICBpdCgnZmluZEZpcnN0Tm90IGZhbHN5cycsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJyID0gWycnLCAnJywgJycsIG51bGxdO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LmZpbmRGaXJzdE5vdChhcnIsIG51bGwpKS50by5iZS5lcWwoJycpO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LmZpbmRGaXJzdE5vdChhcnIsICcnKSkudG8uYmUuZXFsKG51bGwpO1xuICAgICAgICBhcnIgPSBbJycsICcnLCAnJ107XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkuZmluZEZpcnN0Tm90KGFyciwgJycpKS50by5iZS5lcWwoZmFsc2UpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2ZpbmRGaXJzdE5vdCBwcmltaXRpdmVzIGFuZCBub24tcHJpbWl0aXZlcycsIGZ1bmN0aW9uKCl7XG4gICAgICAgICBleHBlY3QoTHVjLkFycmF5LmZpbmRGaXJzdE5vdChbMSwyLDMse31dLCB7fSkpLnRvLmJlKDEpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2ZpbmRBbGwgZmluZCBleGFjdCBvYmplY3Qga2V5cycsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJyID0gW3thOjF9LCB7YToxfSwge2E6MX0sIHthOjEsIGI6Mn0sIHtiOjJ9XTtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5maW5kQWxsKGFyciwge2E6MSwgYjoyfSkpLnRvLmJlLmVxbChbe2E6MSwgYjoyfV0pO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LmZpbmRBbGwoYXJyLCB7YToxfSkpLnRvLmJlLmVxbChbe2E6MX0se2E6MX0se2E6MX0se2E6MSwgYjoyfV0pO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LmZpbmRBbGwoYXJyLCB7YToxLCBiOjJ9LCB7dHlwZTogJ3N0cmljdCd9KSkudG8uYmUuZXFsKFtdKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5maW5kQWxsKGFyciwge2E6MSwgYjoyLCBjOjN9KSkudG8uYmUuZXFsKFtdKTtcbiAgICB9KTtcblxuICAgIGl0KCdmaW5kQWxsIGZpbmQgZXhhY3QgYXJyYXkgdmFsdWVzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcnIgPSBbW10sWzEsMl0sIFsxLDJdXTtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5maW5kQWxsKGFyciwgWzEsMl0pKS50by5iZS5lcWwoW1sxLDJdLCBbMSwyXV0pO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LmZpbmRBbGwoYXJyLCBbMV0pKS50by5lcWwoW10pO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LmZpbmRBbGwoYXJyLCBbMiwyXSkpLnRvLmVxbChbXSk7XG4gICAgfSk7XG5cbiAgICBpdCgnZmluZEFsbCBmYWxzeSB2YWx1ZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyciA9IFtmYWxzZSwgMCwgdW5kZWZpbmVkLCBudWxsLCAnJ107XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkuZmluZEFsbChhcnIsIG51bGwpKS50by5iZS5lcWwoW251bGxdKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5maW5kQWxsKGFyciwgZmFsc2UpKS50by5iZS5lcWwoW2ZhbHNlXSk7XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkuZmluZEFsbChhcnIsIHVuZGVmaW5lZCkpLnRvLmJlLmVxbChbdW5kZWZpbmVkXSk7XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkuZmluZEFsbChhcnIsIDApKS50by5iZS5lcWwoWzBdKTtcbiAgICB9KTtcblxuICAgIGl0KCdmaW5kQWxsIGRhdGUgdmFsdWVzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcnIgPSBbbmV3IERhdGUoMTAwMCksIG5ldyBEYXRlKDEwMDApLCBuZXcgRGF0ZSgxMDAxKSwgZmFsc2VdO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LmZpbmRBbGwoYXJyLCBuZXcgRGF0ZSgxMDAxKSkpLnRvLmJlLmVxbChbbmV3IERhdGUoMTAwMSldKTtcbiAgICB9KTtcblxuICAgIGl0KCdmaW5kQWxsTm90IG1hdGNoIGFsbCBrZXlzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcnIgPSBbe2E6MX0sIHthOjF9LCB7YToxfSwge2E6MSwgYjoyfV07XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkuZmluZEFsbE5vdChhcnIsIHthOjEsIGI6Mn0pKS50by5iZS5lcWwoW3thOjF9LHthOjF9LHthOjF9XSk7XG4gICAgfSk7XG5cbiAgICBpdCgnZmluZEFsbE5vdCBmYWxzeSB2YWx1ZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgYXJyID0gWycnLCAnJywgJycsIG51bGxdO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LmZpbmRBbGxOb3QoYXJyLCBudWxsKSkudG8uYmUuZXFsKFsnJywnJywnJ10pO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LmZpbmRBbGxOb3QoYXJyLCAnJykpLnRvLmJlLmVxbChbbnVsbF0pO1xuICAgICAgICBhcnIgPSBbJycsICcnLCAnJ107XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkuZmluZEFsbE5vdChhcnIsICcnKSkudG8uYmUuZXFsKFtdKTtcbiAgICB9KTtcblxuICAgIGl0KCdkeW5hbWljIGZpbmRGaXJzdE5vdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LmZpbmRGaXJzdE5vdEZhbHNlKFtmYWxzZSwgMV0pKS50by5iZSgxKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5maW5kRmlyc3ROb3RUcnVlKFt0cnVlLCAxXSkpLnRvLmJlKDEpO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LmZpbmRGaXJzdE5vdE51bGwoW251bGwsIDFdKSkudG8uYmUoMSk7XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkuZmluZEZpcnN0Tm90VW5kZWZpbmVkKFt1bmRlZmluZWQsIDFdKSkudG8uYmUoMSk7XG4gICAgfSk7XG5cbiAgICBpdCgnZHluYW1pYyBmaW5kQWxsTm90JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkuZmluZEFsbE5vdEZhbHNlKFtmYWxzZSwgMV0pKS50by5iZS5lcWwoWzFdKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5maW5kQWxsTm90VHJ1ZShbdHJ1ZSwgMV0pKS50by5iZS5lcWwoWzFdKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5maW5kQWxsTm90TnVsbChbbnVsbCwgMV0pKS50by5iZS5lcWwoWzFdKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5maW5kQWxsTm90VW5kZWZpbmVkKFt1bmRlZmluZWQsIDFdKSkudG8uYmUuZXFsKFsxXSk7XG4gICAgfSk7XG5cbiAgICBpdCgnZHluYW1pYyByZW1vdmVGaXJzdE5vdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LnJlbW92ZUZpcnN0Tm90RmFsc2UoW2ZhbHNlLCAxXSkpLnRvLmJlKDEpO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LnJlbW92ZUZpcnN0Tm90VHJ1ZShbdHJ1ZSwgMV0pKS50by5iZSgxKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5yZW1vdmVGaXJzdE5vdE51bGwoW251bGwsIDFdKSkudG8uYmUoMSk7XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkucmVtb3ZlRmlyc3ROb3RVbmRlZmluZWQoW3VuZGVmaW5lZCwgMV0pKS50by5iZSgxKTtcbiAgICB9KTtcblxuICAgIGl0KCdkeW5hbWljIHJlbW92ZUFsbE5vdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LnJlbW92ZUFsbE5vdEZhbHNlKFtmYWxzZSwgMV0pKS50by5iZS5lcWwoWzFdKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5yZW1vdmVBbGxOb3RUcnVlKFt0cnVlLCAxXSkpLnRvLmJlLmVxbChbMV0pO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LnJlbW92ZUFsbE5vdE51bGwoW251bGwsIDFdKSkudG8uYmUuZXFsKFsxXSk7XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkucmVtb3ZlQWxsTm90VW5kZWZpbmVkKFt1bmRlZmluZWQsIDFdKSkudG8uYmUuZXFsKFsxXSk7XG4gICAgfSk7XG5cbiAgICBpdCgnZHluYW1pYyByZW1vdmVGaXJzdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LnJlbW92ZUZpcnN0RmFsc2UoW2ZhbHNlLCAxXSkpLnRvLmJlKGZhbHNlKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5yZW1vdmVGaXJzdFRydWUoW3RydWUsIDFdKSkudG8uYmUodHJ1ZSk7XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkucmVtb3ZlRmlyc3ROdWxsKFtudWxsLCAxXSkpLnRvLmJlKG51bGwpO1xuICAgICAgICAvL3NoaW0vSUUgYnVnXG4gICAgICAgIGlmKDAgaW4gW3VuZGVmaW5lZF0pIHtcbiAgICAgICAgICAgIGV4cGVjdChMdWMuQXJyYXkucmVtb3ZlRmlyc3RVbmRlZmluZWQoW3VuZGVmaW5lZCwgMV0pKS50by5iZSh1bmRlZmluZWQpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBpdCgnZHluYW1pYyByZW1vdmVBbGwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5yZW1vdmVBbGxGYWxzZShbZmFsc2UsIDFdKSkudG8uYmUuZXFsKFtmYWxzZV0pO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LnJlbW92ZUFsbFRydWUoW3RydWUsIDFdKSkudG8uYmUuZXFsKFt0cnVlXSk7XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkucmVtb3ZlQWxsTnVsbChbbnVsbCwgMV0pKS50by5iZS5lcWwoW251bGxdKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5yZW1vdmVBbGxVbmRlZmluZWQoW3VuZGVmaW5lZCwgMV0pKS50by5iZS5lcWwoW3VuZGVmaW5lZF0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2R5bmFtaWMgcmVtb3ZlTGFzdE5vdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LnJlbW92ZUxhc3ROb3RGYWxzZShbZmFsc2UsIDFdKSkudG8uYmUoMSk7XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkucmVtb3ZlTGFzdE5vdFRydWUoW3RydWUsIDFdKSkudG8uYmUoMSk7XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkucmVtb3ZlTGFzdE5vdE51bGwoW251bGwsIDFdKSkudG8uYmUoMSk7XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkucmVtb3ZlTGFzdE5vdFVuZGVmaW5lZChbdW5kZWZpbmVkLCAxXSkpLnRvLmJlKDEpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2R5bmFtaWMgcmVtb3ZlTGFzdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LnJlbW92ZUxhc3RGYWxzZShbZmFsc2UsIDFdKSkudG8uYmUoZmFsc2UpO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LnJlbW92ZUxhc3RUcnVlKFt0cnVlLCAxXSkpLnRvLmJlKHRydWUpO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LnJlbW92ZUxhc3ROdWxsKFtudWxsLCAxXSkpLnRvLmJlKG51bGwpO1xuICAgICAgICAvL3NoaW0vSUUgYnVnXG4gICAgICAgIGlmKDAgaW4gW3VuZGVmaW5lZF0pIHtcbiAgICAgICAgICAgIGV4cGVjdChMdWMuQXJyYXkucmVtb3ZlTGFzdFVuZGVmaW5lZChbdW5kZWZpbmVkLCAxXSkpLnRvLmJlKHVuZGVmaW5lZCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGl0KCdkeW5hbWljIGZpbmRMYXN0Tm90JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkuZmluZExhc3ROb3RGYWxzZShbZmFsc2UsIDFdKSkudG8uYmUuZXFsKDEpO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LmZpbmRMYXN0Tm90VHJ1ZShbdHJ1ZSwgMV0pKS50by5iZS5lcWwoMSk7XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkuZmluZExhc3ROb3ROdWxsKFtudWxsLCAxXSkpLnRvLmJlLmVxbCgxKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5maW5kTGFzdE5vdFVuZGVmaW5lZChbdW5kZWZpbmVkLCAxXSkpLnRvLmJlLmVxbCgxKTtcblxuICAgIH0pO1xuXG4gICAgaXQoJ3JlbW92ZS9maW5kIHdpdGggaXRlcmF0b3IgYW5kIHRoaXNBcmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyciA9IFt7YToxfSwge2E6MX0sIHthOjF9LCB7YToxLCBiOjJ9XTtcblxuICAgICAgICBleHBlY3QoTHVjLkFycmF5LmZpbmRBbGwoYXJyLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubnVtID09PSB2YWx1ZS5hXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIG51bTogMVxuICAgICAgICB9KSkudG8uYmUuZXFsKFt7XG4gICAgICAgICAgICAgICAgYTogMVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGE6IDFcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBhOiAxXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgYTogMSxcbiAgICAgICAgICAgICAgICBiOiAyXG4gICAgICAgICAgICB9XG4gICAgICAgIF0pO1xuXG4gICAgICAgZXhwZWN0KEx1Yy5BcnJheS5maW5kQWxsTm90KGFyciwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm51bSA9PT0gdmFsdWUuYVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBudW06IDFcbiAgICAgICAgfSkpLnRvLmJlLmVxbChbXSk7XG4gICB9KTtcblxuICAgICBpdCgnZGlyZWN0IGZ1bmN0aW9uIGNvbXBhcmlzb24nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5maW5kQWxsTm90KGFyciwgZnVuY3Rpb24oKXt9LCB7dHlwZTonc3RyaWN0J30pKS50by5iZS5lcWwoYXJyKTtcbiAgICB9KTtcblxuICAgIGl0KCdOb3QgcmVtb3ZlL2ZpbmQgd2l0aCBpdGVyYXRvciBhbmQgdGhpc0FyZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LmZpbmRBbGxOb3QoYXJyLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfSkpLnRvLmJlLmVxbChbXSk7XG4gICAgfSk7XG5cbiAgICBpdCgnZmluZCBpbicsIGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LmZpbmRBbGxJbihbMSwyLDMsIHthOjEsYjoyfSwge2I6MX1dLCBbMix7YToxfV0pKS50by5iZS5lcWwoWzIse2E6MSxiOjJ9XSk7XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkuZmluZEFsbEluKFsxLDIsMywge2E6MSxiOjJ9LCB7YjoxfV0sIFsyLHthOjF9XSwge3R5cGU6ICdkZWVwJ30pKS50by5iZS5lcWwoWzJdKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5maW5kQWxsSW4oWzEsMiwzLCB7YToxLGI6Mn0sIHtiOjF9XSwgWzIse2E6MX1dLCB7dHlwZTogJ2xvb3NlJ30pKS50by5iZS5lcWwoWzIse2E6MSxiOjJ9XSk7XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkuZmluZEFsbEluKFsxLDIsMywge2E6MSxiOjJ9LCB7YjoxfV0sIFsyLHthOjF9XSwge3R5cGU6ICdzdHJpY3QnfSkpLnRvLmJlLmVxbChbMl0pO1xuICAgICAgICBleHBlY3QoTHVjLkFycmF5LmZpbmRBbGxJbihbMSwyLDNdLCBbMiwzXSkpLnRvLmJlLmVxbChbMiwzXSk7XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkuZmluZEZpcnN0SW4oWzEsMiwzXSwgWzIsM10pKS50by5iZS5lcWwoMik7XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkuZmluZExhc3RJbihbMSwyLDNdLCBbMiwzXSkpLnRvLmJlLmVxbCgzKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5maW5kTGFzdEluKFsxLDIsM10sIFtmYWxzZSwgMiwzLCBmYWxzZV0pKS50by5iZS5lcWwoMyk7XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkuZmluZEFsbEluKFsxLDIsMywgZmFsc2VdLCBbZmFsc2UsIDIsMywgZmFsc2VdKSkudG8uYmUuZXFsKFsyLDMsZmFsc2VdKTtcbiAgICB9KTtcblxuICAgIGl0KCdsYXN0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkubGFzdChbMSwyLDNdKSkudG8uYmUoMyk7XG4gICAgICAgIChmdW5jdGlvbigpe1xuICAgICAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5sYXN0KGFyZ3VtZW50cykpLnRvLmJlKDMpO1xuICAgICAgICB9KSgxLDIsMylcbiAgICB9KTtcblxuICAgIGl0KCdmcm9tIGluZGV4JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGV4cGVjdChMdWMuQXJyYXkuZnJvbUluZGV4KFsxLDIsM10sIDEpKS50by5iZS5lcWwoWzIsM10pO1xuICAgICAgICAoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGV4cGVjdChMdWMuQXJyYXkuZnJvbUluZGV4KGFyZ3VtZW50cywgMSkpLnRvLmJlLmVxbChbMiwzXSk7XG4gICAgICAgICAgICBleHBlY3QoTHVjLkFycmF5LmZyb21JbmRleChhcmd1bWVudHMsIDApKS50by5iZS5lcWwoWzEsMiwzXSk7XG4gICAgICAgICAgICBleHBlY3QoTHVjLkFycmF5LmZyb21JbmRleChhcmd1bWVudHMsIDIpKS50by5iZS5lcWwoWzNdKTtcbiAgICAgICAgfSkoMSwyLDMpXG4gICAgfSk7XG5cbiAgICBpdCgncGx1Y2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KEx1Yy5BcnJheS5wbHVjayhbe2E6JzEnLCBiOjJ9LCB7YjozfSwge2I6NH1dLCAnYicpKS50by5iZS5lcWwoWzIsMyw0XSk7XG4gICAgfSk7XG59KTsiLCJ2YXIgTHVjID0gcmVxdWlyZSgnLi9sdWNUZXN0TGliJyksXG4gICAgZXhwZWN0ID0gcmVxdWlyZSgnZXhwZWN0LmpzJyk7XG52YXIgZW1pdHRlclRlc3QgPSByZXF1aXJlKCcuL2NvbW1vbicpLnRlc3RFbWl0dGVyO1xuLy9TYW5pdHkgY2hlY2sgdG8gbWFrZSBzdXJlIG5vZGUgY29tcG9uZW50cyB3b3JrIG9uIHRoZSBicm93c2VyLlxuZGVzY3JpYmUoJ0x1YyBOb2RlIGZ1bmN0aW9ucycsIGZ1bmN0aW9uKCkge1xuXG4gICAgaXQoJ0VtaXR0ZXInLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZW1pdHRlclRlc3QobmV3IEx1Yy5FdmVudEVtaXR0ZXIoKSk7XG4gICAgfSk7XG59KSIsInZhciBlbWl0dGVyVGVzdCA9IHJlcXVpcmUoJy4vY29tbW9uJykudGVzdEVtaXR0ZXI7XG52YXIgTHVjID0gcmVxdWlyZSgnLi9sdWNUZXN0TGliJyksXG4gICAgZXhwZWN0ID0gcmVxdWlyZSgnZXhwZWN0LmpzJyk7XG5cblxuZnVuY3Rpb24gZGVmaW5lQ2xhc3NXaXRoQWxsT3B0aW9ucygpIHtcbiAgICBmdW5jdGlvbiBBZGRlcigpIHt9XG5cbiAgICBBZGRlci5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24oYSwgYikge1xuICAgICAgICByZXR1cm4gYSArIGI7XG4gICAgfTtcbiAgICByZXR1cm4gTHVjLmRlZmluZSh7XG4gICAgICAgICRzdXBlcjogQWRkZXIsXG4gICAgICAgICRzdGF0aWNzOiB7XG4gICAgICAgICAgICB0b3RhbDogMFxuICAgICAgICB9LFxuICAgICAgICAkbWl4aW5zOiB7XG4gICAgICAgICAgICBtYWtlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSArICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAkY29tcG9zaXRpb25zOiB7XG4gICAgICAgICAgICBDb25zdHJ1Y3RvcjogTHVjLkV2ZW50RW1pdHRlcixcbiAgICAgICAgICAgIG5hbWU6ICdlbWl0dGVyJyxcbiAgICAgICAgICAgIG1ldGhvZHM6ICdhbGxNZXRob2RzJ1xuICAgICAgICB9LFxuICAgICAgICBhZGQ6IGZ1bmN0aW9uKGEsIGIsIGMpIHtcbiAgICAgICAgICAgIHZhciB0d28gPSB0aGlzLiRzdXBlcmNsYXNzLmFkZC5jYWxsKHRoaXMsIGEsIGIpLFxuICAgICAgICAgICAgICAgIHJldCA9IHR3byArIGM7XG5cbiAgICAgICAgICAgIHRoaXMuZW1pdCgndG9TdHJpbmcnLCB0aGlzLm1ha2VTdHJpbmcocmV0KSk7XG5cbiAgICAgICAgICAgIHRoaXMuJGNsYXNzLnRvdGFsICs9IHJldDtcblxuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5kZXNjcmliZSgnTHVjIENsYXNzJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ0Jhc2UnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGIgPSBuZXcgTHVjLkJhc2Uoe1xuICAgICAgICAgICAgYTogMSxcbiAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuYSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0KGIuYSkudG8uYmUoMik7XG4gICAgfSk7XG5cbiAgICBpdCgnc2ltcGxlIGRlZmluZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgQyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICAgICAgYjogJzInXG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgYiA9IG5ldyBDKHtcbiAgICAgICAgICAgIGE6IDFcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdChiLmEpLnRvLmVxbCgxKTtcbiAgICAgICAgZXhwZWN0KGIuYikudG8uZXFsKCcyJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2luZ2xlIG1peGluJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgICAgICAkbWl4aW5zOiBMdWMuRXZlbnRFbWl0dGVyXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBiID0gbmV3IEMoe1xuICAgICAgICAgICAgYTogMVxuICAgICAgICB9KTtcblxuICAgICAgICBlbWl0dGVyVGVzdChiKTtcbiAgICB9KTtcblxuICAgIGl0KCdtdWx0aXBsZSBtaXhpbnMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1peGluT2JqID0ge1xuICAgICAgICAgICAgYTogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwcm9wOiB7fVxuICAgICAgICB9LCBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgICAgICAkbWl4aW5zOiBbTHVjLkV2ZW50RW1pdHRlciwgbWl4aW5PYmpdXG4gICAgICAgIH0pLFxuICAgICAgICBjID0gbmV3IEMoKTtcblxuICAgICAgICBleHBlY3QoYy5hKS50by5iZShtaXhpbk9iai5hKTtcbiAgICAgICAgZXhwZWN0KGMucHJvcCkudG8uYmUobWl4aW5PYmoucHJvcCk7XG4gICAgICAgIGV4cGVjdChjLmVtaXQpLnRvLmJlKEx1Yy5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3N0YXRpY3MnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIEMgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgICAgICRzdGF0aWNzOiB7XG4gICAgICAgICAgICAgICAgYjogMVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgYyA9IG5ldyBDKCk7XG5cbiAgICAgICAgZXhwZWN0KEMuYikudG8uYmUoMSk7XG4gICAgICAgIGV4cGVjdChjLiRjbGFzcy5iKS50by5iZSgxKTtcbiAgICB9KTtcblxuICAgIGl0KCd0ZXN0IGdldCBzdGF0aWMgdmFsdWUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIEEgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgICAgICRzdGF0aWNzOiB7XG4gICAgICAgICAgICAgICAgYTogMVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgQiA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICAgICAgJHN1cGVyOiBBLFxuICAgICAgICAgICAgJHN0YXRpY3M6IHtcbiAgICAgICAgICAgICAgICBiOiAyLFxuICAgICAgICAgICAgICAgIGM6M1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgQyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICAgICAgJHN1cGVyOiBCLFxuICAgICAgICAgICAgJHN0YXRpY3M6IHtcbiAgICAgICAgICAgICAgICBhOiA1XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBhID0gbmV3IEEoKSwgYiA9IG5ldyBCKCksIGMgPSBuZXcgQygpO1xuXG4gICAgICAgIGV4cGVjdChhLmdldFN0YXRpY1ZhbHVlKCdhJykpLnRvLmJlKDEpO1xuICAgICAgICBleHBlY3QoYS5nZXRTdGF0aWNWYWx1ZSgnYicpKS50by5iZSh1bmRlZmluZWQpO1xuXG4gICAgICAgIGV4cGVjdChiLmdldFN0YXRpY1ZhbHVlKCdhJykpLnRvLmJlKDEpO1xuICAgICAgICBleHBlY3QoYi5nZXRTdGF0aWNWYWx1ZSgnYicpKS50by5iZSgyKTtcbiAgICAgICAgZXhwZWN0KGIuZ2V0U3RhdGljVmFsdWUoJ2MnKSkudG8uYmUoMyk7XG4gICAgICAgIGV4cGVjdChiLmdldFN0YXRpY1ZhbHVlKCdkJykpLnRvLmJlKHVuZGVmaW5lZCk7XG5cbiAgICAgICAgZXhwZWN0KGMuZ2V0U3RhdGljVmFsdWUoJ2EnKSkudG8uYmUoNSk7XG4gICAgICAgIGV4cGVjdChjLmdldFN0YXRpY1ZhbHVlKCdiJykpLnRvLmJlKDIpO1xuICAgICAgICBleHBlY3QoYy5nZXRTdGF0aWNWYWx1ZSgnYycpKS50by5iZSgzKTtcbiAgICAgICAgZXhwZWN0KGMuZ2V0U3RhdGljVmFsdWUoJ2QnKSkudG8uYmUodW5kZWZpbmVkKTtcbiAgICB9KTtcblxuICAgIGl0KCckY2xhc3MnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIEMgPSBMdWMuZGVmaW5lKHt9KSxcbiAgICAgICAgICAgIGMgPSBuZXcgQygpO1xuXG4gICAgICAgIGV4cGVjdChjLiRjbGFzcykudG8uYmUoQyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc3VwZXInLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgICAgICAkc3VwZXI6IEx1Yy5FdmVudEVtaXR0ZXIsXG4gICAgICAgICAgICBlbWl0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLiRzdXBlcmNsYXNzLmVtaXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cblxuICAgICAgICB2YXIgYyA9IG5ldyBDKHt9KTtcbiAgICAgICAgZW1pdHRlclRlc3QoYyk7XG4gICAgICAgIGV4cGVjdChpKS50by5iZSgwKTtcbiAgICAgICAgZXhwZWN0KGMgaW5zdGFuY2VvZiBMdWMuRXZlbnRFbWl0dGVyKS50by5iZSh0cnVlKTtcbiAgICB9KTtcblxuICAgIGl0KCdjb21wb3NpdGlvbicsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgRW1pdHRlclBhcmVudCA9ICBMdWMuZGVmaW5lKHtcbiAgICAgICAgICAgICRzdXBlcjogTHVjLkV2ZW50RW1pdHRlclxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgQmFzZUVtaXR0ZXIgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgICAgICRjb21wb3NpdGlvbnM6IFt7Q29uc3RydWN0b3I6IEVtaXR0ZXJQYXJlbnQsIG5hbWU6ICdlbWl0dGVyJywgbWV0aG9kczogJ2FsbE1ldGhvZHMnfV1cbiAgICAgICAgfSk7XG5cblxuICAgICAgICB2YXIgYmFzZSA9IG5ldyBCYXNlRW1pdHRlcih7fSk7XG4gICAgICAgIGVtaXR0ZXJUZXN0KGJhc2UpO1xuICAgICAgICBleHBlY3QoYmFzZSBpbnN0YW5jZW9mIEx1Yy5FdmVudEVtaXR0ZXIpLnRvLmJlKGZhbHNlKTtcbiAgICAgICAgZXhwZWN0KGJhc2UuZXZlbnRzKS50by5iZSh1bmRlZmluZWQpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2FsbCBjbGFzcyBvcHRpb25zIHRvZ2V0aGVyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBBZGRlckVtaXR0ZXIgPSBkZWZpbmVDbGFzc1dpdGhBbGxPcHRpb25zKCksXG4gICAgICAgICAgICBzdHJpbmdWYWx1ZSwgcmVzdWx0LFxuICAgICAgICAgICAgYWRkZXJFbWl0ID0gbmV3IEFkZGVyRW1pdHRlcigpO1xuXG4gICAgICAgIGFkZGVyRW1pdC5vbigndG9TdHJpbmcnLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgc3RyaW5nVmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVzdWx0ID0gYWRkZXJFbWl0LmFkZCgxLCAyLCAzKTtcblxuICAgICAgICBleHBlY3QocmVzdWx0KS50by5iZSg2KTtcbiAgICAgICAgZXhwZWN0KHN0cmluZ1ZhbHVlKS50by5iZSgnNicpO1xuXG4gICAgICAgIGFkZGVyRW1pdC5hZGQoMywgMywgMyk7XG5cbiAgICAgICAgZXhwZWN0KHN0cmluZ1ZhbHVlKS50by5iZSgnOScpO1xuXG4gICAgICAgIGV4cGVjdChBZGRlckVtaXR0ZXIudG90YWwpLnRvLmJlKDE1KTtcbiAgICB9KTtcblxuICAgIGl0KCdjbGFzcyBvcHRpb25zIGRvIG5vdCBnZXQgYXBwbGllZCB0byB0aGUgaW5zdGFuY2UnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIEFkZGVyRW1pdHRlciA9IGRlZmluZUNsYXNzV2l0aEFsbE9wdGlvbnMoKSxcbiAgICAgICAgICAgIGFsbE9wdGlvbnMgPSBMdWMuQ2xhc3NEZWZpbmVyLnByb2Nlc3NvcktleXMsXG4gICAgICAgICAgICBpZ25vcmVLZXlzID0gWyckc3VwZXInXTtcblxuICAgICAgICBPYmplY3Qua2V5cyhhbGxPcHRpb25zKS5mb3JFYWNoKGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICAgICAgaWYoaWdub3JlS2V5cy5pbmRleE9mKG9wdGlvbikgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KEFkZGVyRW1pdHRlci5wcm90b3R5cGVbb3B0aW9uXSkudG8uYmUodW5kZWZpbmVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnZ2V0IGNvbXBvc2l0aW9uJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGZ1bmN0aW9uIEEoKSB7fVxuICAgICAgICBmdW5jdGlvbiBCKCl7fVxuICAgICAgICBmdW5jdGlvbiBDKCl7fVxuICAgICAgICB2YXIgQ29tcHMgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgICAgICRjb21wb3NpdGlvbnM6IFt7XG4gICAgICAgICAgICAgICAgICAgIENvbnN0cnVjdG9yOiBBLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnYSdcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIENvbnN0cnVjdG9yOiBCLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnYidcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIENvbnN0cnVjdG9yOiBDLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnYydcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBjID0gbmV3IENvbXBzKCk7XG5cbiAgICAgICAgZXhwZWN0KGMuZ2V0Q29tcG9zaXRpb24oJ2EnKSkudG8uYmUuYShBKTtcbiAgICAgICAgZXhwZWN0KGMuZ2V0Q29tcG9zaXRpb24oJ2InKSkudG8uYmUuYShCKTtcbiAgICAgICAgZXhwZWN0KGMuZ2V0Q29tcG9zaXRpb24oJ2MnKSkudG8uYmUuYShDKTtcbiAgICB9KTtcblxuICAgIGl0KCdpbml0Q29tcG9zaXRpb24gYmVmb3JlIGFuZCBhZnRlcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaGFzQUJlZW5Jbml0ZWQgPSBmYWxzZSxcbiAgICAgICAgICAgIGhhc0JCZWVuSW5pdGVkID0gZmFsc2UsXG4gICAgICAgICAgICBoYXNDQmVlbkluaXRlZCA9IGZhbHNlO1xuICAgICAgICBmdW5jdGlvbiBBKCkge1xuICAgICAgICAgICAgaGFzQUJlZW5Jbml0ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIEIoKXtcbiAgICAgICAgICAgIGhhc0JCZWVuSW5pdGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBDKCl7XG4gICAgICAgICAgICBoYXNDQmVlbkluaXRlZCA9IHRydWU7XG4gICAgICAgICAgICBleHBlY3QoaGFzQUJlZW5Jbml0ZWQpLnRvLmJlKGZhbHNlKTtcbiAgICAgICAgICAgIGV4cGVjdChoYXNCQmVlbkluaXRlZCkudG8uYmUodHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIENvbXBzID0gTHVjLmRlZmluZSh7XG4gICAgICAgICAgICAkY29tcG9zaXRpb25zOiBbe1xuICAgICAgICAgICAgICAgICAgICBDb25zdHJ1Y3RvcjogQSxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2EnLFxuICAgICAgICAgICAgICAgICAgICBpbml0QWZ0ZXI6IHRydWVcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIENvbnN0cnVjdG9yOiBCLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnYicsXG4gICAgICAgICAgICAgICAgICAgIGluaXRBZnRlcjogZmFsc2VcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIENvbnN0cnVjdG9yOiBDLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnYydcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBjID0gbmV3IENvbXBzKCk7XG4gICAgICAgIGV4cGVjdChoYXNDQmVlbkluaXRlZCkudG8uYmUodHJ1ZSk7XG4gICAgfSk7XG5cbiAgICBpdCgndGVzdCBubyBzdXBlcmNsYXNzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBOb1N1cGVyID0gTHVjLmRlZmluZSh7XG4gICAgICAgICAgICAkc3VwZXI6IGZhbHNlLFxuICAgICAgICAgICAgJHN0YXRpY3M6IHtcbiAgICAgICAgICAgICAgICB0b3RhbDogMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICRtaXhpbnM6IHtcbiAgICAgICAgICAgICAgICBtYWtlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgKyAnJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJGNvbXBvc2l0aW9uczoge1xuICAgICAgICAgICAgICAgIGRlZmF1bHRzIDogTHVjLmNvbXBvc2l0aW9uRW51bXMuRXZlbnRFbWl0dGVyXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBOb1N1cGVyTm9Db21wID0gTHVjLmRlZmluZSh7XG4gICAgICAgICAgICAkc3VwZXI6IGZhbHNlLFxuICAgICAgICAgICAgJHN0YXRpY3M6IHtcbiAgICAgICAgICAgICAgICB0b3RhbDogMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICRtaXhpbnM6IHtcbiAgICAgICAgICAgICAgICBtYWtlU3RyaW5nOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgKyAnJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBub1N1cGVyID0gbmV3IE5vU3VwZXIoKTtcbiAgICAgICAgZXhwZWN0KG5ldyAgTm9TdXBlck5vQ29tcCgpLm1ha2VTdHJpbmcobm9TdXBlci4kY2xhc3MudG90YWwpKS50by5iZSgnMCcpO1xuICAgICAgICBleHBlY3Qobm9TdXBlci5tYWtlU3RyaW5nKG5vU3VwZXIuJGNsYXNzLnRvdGFsKSkudG8uYmUoJzAnKTtcbiAgICAgICAgZW1pdHRlclRlc3Qobm9TdXBlcik7XG4gICAgICAgIGV4cGVjdChub1N1cGVyKS50by5ub3QuYmUuYShMdWMuQmFzZSk7XG4gICAgICAgIGV4cGVjdChub1N1cGVyLiRzdXBlcmNsYXNzKS50by5iZSh1bmRlZmluZWQpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Rlc3QgY29tcG9zaXRpb24gdmFsaWRhdGlvbicsIGZ1bmN0aW9uKCkge1xuICAgICAgICBmdW5jdGlvbiBkZWZpbmVOb05hbWUoKSB7XG4gICAgICAgICAgICBMdWMuZGVmaW5lKHtcbiAgICAgICAgICAgICAgICAkY29tcG9zaXRpb25zOiB7XG4gICAgICAgICAgICAgICAgICAgIENvbnN0cnVjdG9yOiBMdWMuRXZlbnRFbWl0dGVyXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZGVmaW5lTm9Db25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIEx1Yy5kZWZpbmUoe1xuICAgICAgICAgICAgICAgICRjb21wb3NpdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2EnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZXhwZWN0KGRlZmluZU5vTmFtZSkudG8udGhyb3dFeGNlcHRpb24oKTtcblxuICAgICAgICBleHBlY3QoZGVmaW5lTm9Db25zdHJ1Y3RvcikudG8udGhyb3dFeGNlcHRpb24oKTtcbiAgICB9KTtcblxuICAgIGl0KCd0ZXN0IGRlZmF1bHQgcGx1Z2luIGNvbXBvc2l0aW9uJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB0ZXN0SW50YW5jZSxcbiAgICAgICAgQ2xhc3NXaXRoUGx1Z2lucyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICAgICAgJGNvbXBvc2l0aW9uczoge1xuICAgICAgICAgICAgICAgIGRlZmF1bHRzOiBMdWMuY29tcG9zaXRpb25FbnVtcy5QbHVnaW5NYW5hZ2VyXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBjID0gbmV3IENsYXNzV2l0aFBsdWdpbnMoe1xuICAgICAgICAgICAgcGx1Z2luczogW3tcbiAgICAgICAgICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlc3RJbnN0YW5jZSA9IGluc3RhbmNlO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBkZXN0cm95OiBmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdteVBsdWdpbidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGV4cGVjdCh0ZXN0SW5zdGFuY2UpLnRvLmJlKGMpO1xuICAgICAgICBleHBlY3QoYy5nZXRQbHVnaW4oTHVjLlBsdWdpbikpLnRvLmJlLmEoTHVjLlBsdWdpbik7XG4gICAgICAgIGV4cGVjdChjLmdldFBsdWdpbih7bmFtZTogJ215UGx1Z2luJ30pKS50by5iZS5hKEx1Yy5QbHVnaW4pO1xuICAgICAgICBjLmRlc3Ryb3lQbHVnaW4oe25hbWU6ICdteVBsdWdpbid9KTtcbiAgICAgICAgZXhwZWN0KGMuZ2V0UGx1Z2luKEx1Yy5QbHVnaW4pKS50by5iZShmYWxzZSk7XG4gICAgICAgIHZhciByZXQgPSBjLmFkZFBsdWdpbih7bmFtZTogJ215UGx1Z2luJ30pO1xuICAgICAgICBleHBlY3QocmV0KS50by5iZS5hKEx1Yy5QbHVnaW4pO1xuXG4gICAgICAgIGZ1bmN0aW9uIEEoKXtcblxuICAgICAgICB9XG4gICAgICAgIHJldCA9IGMuYWRkUGx1Z2luKHtDb25zdHJ1Y3RvcjogQSwgbmFtZTogJ215UGx1Z2luJ30pO1xuICAgICAgICBleHBlY3QocmV0KS50by5iZS5hKEEpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Rlc3QgY29uZmlndXJlZCBwbHVnaW4gY29uc3RydWN0b3JzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB0ZXN0SW50YW5jZSxcbiAgICAgICAgICAgIENvbmZpZ3VyZWRQbHVnaW4gPSBmdW5jdGlvbihjb25maWcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm15T3duZXIgPSBjb25maWcub3duZXI7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgQ2xhc3NXaXRoUGx1Z2lucyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICAgICAgICAgICRjb21wb3NpdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdHM6IEx1Yy5jb21wb3NpdGlvbkVudW1zLlBsdWdpbk1hbmFnZXJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB2YXIgYyA9IG5ldyBDbGFzc1dpdGhQbHVnaW5zKHtcbiAgICAgICAgICAgIHBsdWdpbnM6IFt7fSwge1xuICAgICAgICAgICAgICAgICAgICBDb25zdHJ1Y3RvcjogQ29uZmlndXJlZFBsdWdpblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgZXhwZWN0KGMuZ2V0Q29tcG9zaXRpb24oJ3BsdWdpbnMnKS5wbHVnaW5zWzBdKS50by5iZS5hKEx1Yy5QbHVnaW4pO1xuICAgICAgICB2YXIgY29uZmlnZWRQbHVnaW4gPSBjLmdldENvbXBvc2l0aW9uKCdwbHVnaW5zJykucGx1Z2luc1sxXTtcbiAgICAgICAgZXhwZWN0KGNvbmZpZ2VkUGx1Z2luKS50by5iZS5hKENvbmZpZ3VyZWRQbHVnaW4pO1xuICAgICAgICBleHBlY3QoY29uZmlnZWRQbHVnaW4ubXlPd25lcikudG8uYmUoYyk7XG4gICAgfSk7XG5cbiAgICBpdCgndGVzdCBkZWZhdWx0IHBsdWdpbiBkZXN0cm95JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB0ZXN0VmFsdWUgPSBmYWxzZSxcbiAgICAgICAgQ2xhc3NXaXRoUGx1Z2lucyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICAgICAgJGNvbXBvc2l0aW9uczoge1xuICAgICAgICAgICAgICAgIGRlZmF1bHRzOiBMdWMuY29tcG9zaXRpb25FbnVtcy5QbHVnaW5NYW5hZ2VyXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBjID0gbmV3IENsYXNzV2l0aFBsdWdpbnMoe1xuICAgICAgICAgICAgcGx1Z2luczogW3tcbiAgICAgICAgICAgICAgICAgICAgZGVzdHJveTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXN0VmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwge31cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgZXhwZWN0KHRlc3RWYWx1ZSkudG8uYmUoZmFsc2UpO1xuICAgICAgICBjLmRlc3Ryb3lBbGxQbHVnaW5zKCk7XG4gICAgICAgIGV4cGVjdCh0ZXN0VmFsdWUpLnRvLmJlKHRydWUpO1xuICAgIH0pO1xufSk7XG5cblxuXG5cbiIsInZhciBMdWMgPSByZXF1aXJlKCcuL2x1Y1Rlc3RMaWInKSxcbiAgICBleHBlY3QgPSByZXF1aXJlKCdleHBlY3QuanMnKTtcblxuZGVzY3JpYmUoJ0x1YyBpcycsIGZ1bmN0aW9uKCkge1xuXG4gICAgaXQoJ2lzQXJyYXknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KEx1Yy5pc0FycmF5KHt9KSkudG8uYmUoZmFsc2UpO1xuICAgICAgICBleHBlY3QoTHVjLmlzQXJyYXkoW10pKS50by5iZSh0cnVlKTtcbiAgICB9KTtcblxuICAgIGl0KCdpc1JlZ0V4cCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3QoTHVjLmlzUmVnRXhwKHt9KSkudG8uYmUoZmFsc2UpO1xuICAgICAgICBleHBlY3QoTHVjLmlzUmVnRXhwKG5ldyBSZWdFeHAoKSkpLnRvLmJlKHRydWUpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2lzRGF0ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3QoTHVjLmlzRGF0ZSh7fSkpLnRvLmJlKGZhbHNlKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5pc0RhdGUobmV3IERhdGUoKSkpLnRvLmJlKHRydWUpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2lzU3RyaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGV4cGVjdChMdWMuaXNTdHJpbmcoe30pKS50by5iZShmYWxzZSk7XG4gICAgICAgIGV4cGVjdChMdWMuaXNTdHJpbmcobmV3IFN0cmluZygpKSkudG8uYmUodHJ1ZSk7XG4gICAgICAgIGV4cGVjdChMdWMuaXNTdHJpbmcoJycpKS50by5iZSh0cnVlKTtcbiAgICB9KTtcblxuICAgIGl0KCdpc09iamVjdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3QoTHVjLmlzT2JqZWN0KHt9KSkudG8uYmUodHJ1ZSk7XG4gICAgICAgIGV4cGVjdChMdWMuaXNPYmplY3QoW10pKS50by5iZShmYWxzZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnaXNOdW1iZXInLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KEx1Yy5pc051bWJlcih7fSkpLnRvLmJlKGZhbHNlKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5pc051bWJlcigwKSkudG8uYmUodHJ1ZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnaXNGdW5jdGlvbicsIGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3QoTHVjLmlzRnVuY3Rpb24oe30pKS50by5iZShmYWxzZSk7XG4gICAgICAgIGV4cGVjdChMdWMuaXNGdW5jdGlvbihuZXcgRnVuY3Rpb24oKSkpLnRvLmJlKHRydWUpO1xuICAgICAgICBleHBlY3QoTHVjLmlzRnVuY3Rpb24oZnVuY3Rpb24oKXt9KSkudG8uYmUodHJ1ZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnaXNGYWxzeScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3QoTHVjLmlzRmFsc3koMCkpLnRvLmJlKGZhbHNlKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5pc0ZhbHN5KCcnKSkudG8uYmUodHJ1ZSk7XG4gICAgICAgIGV4cGVjdChMdWMuaXNGYWxzeSh1bmRlZmluZWQpKS50by5iZSh0cnVlKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5pc0ZhbHN5KG51bGwpKS50by5iZSh0cnVlKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5pc0ZhbHN5KGZhbHNlKSkudG8uYmUodHJ1ZSk7XG4gICAgICAgIGV4cGVjdChMdWMuaXNGYWxzeShOYU4pKS50by5iZSh0cnVlKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5pc0ZhbHN5KHt9KSkudG8uYmUoZmFsc2UpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2lzRW1wdHknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KEx1Yy5pc0VtcHR5KDApKS50by5iZShmYWxzZSk7XG4gICAgICAgIGV4cGVjdChMdWMuaXNFbXB0eSgnJykpLnRvLmJlKHRydWUpO1xuICAgICAgICBleHBlY3QoTHVjLmlzRW1wdHkodW5kZWZpbmVkKSkudG8uYmUodHJ1ZSk7XG4gICAgICAgIGV4cGVjdChMdWMuaXNFbXB0eShudWxsKSkudG8uYmUodHJ1ZSk7XG4gICAgICAgIGV4cGVjdChMdWMuaXNFbXB0eShmYWxzZSkpLnRvLmJlKHRydWUpO1xuXG4gICAgICAgIGV4cGVjdChMdWMuaXNFbXB0eShbXSkpLnRvLmJlKHRydWUpO1xuICAgICAgICBleHBlY3QoTHVjLmlzRW1wdHkoe30pKS50by5iZSh0cnVlKTtcblxuICAgICAgICBleHBlY3QoTHVjLmlzRW1wdHkoWzBdKSkudG8uYmUoZmFsc2UpO1xuICAgICAgICBleHBlY3QoTHVjLmlzRW1wdHkoezA6MH0pKS50by5iZShmYWxzZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnaXNBcmd1bWVudHMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KEx1Yy5pc0FyZ3VtZW50cyh7fSkpLnRvLmJlKGZhbHNlKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5pc0FyZ3VtZW50cyhbXSkpLnRvLmJlKGZhbHNlKTtcbiAgICAgICAgKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBleHBlY3QoTHVjLmlzQXJndW1lbnRzKGFyZ3VtZW50cykpLnRvLmJlKHRydWUpO1xuICAgICAgICB9KCkpO1xuICAgICAgICBcbiAgICB9KTtcbn0pOyIsInZhciBMdWMgPSByZXF1aXJlKCcuL2x1Y1Rlc3RMaWInKSxcbiAgICBleHBlY3QgPSByZXF1aXJlKCdleHBlY3QuanMnKTtcbmRlc2NyaWJlKCdMdWMgT2JqZWN0IGZ1bmN0aW9ucycsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdlYWNoJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB0ID0ge1xuICAgICAgICAgICAgYTogJ2EnLFxuICAgICAgICAgICAgYjogJ2InLFxuICAgICAgICAgICAgejogJ3onXG4gICAgICAgIH0sIG9iaiA9IHtzdHIgOiAnJ307XG5cbiAgICAgICAgTHVjLk9iamVjdC5lYWNoKHQsIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuc3RyICs9IGtleSArIHZhbHVlO1xuICAgICAgICB9LCBvYmopO1xuICAgICAgICBleHBlY3Qob2JqLnN0cikudG8uZXFsKCdhYWJienonKTtcbiAgICB9KTtcblxuICAgIGl0KCdhcHBseScsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYSA9IHtiOiAzfTtcbiAgICAgICAgTHVjLmFwcGx5KGEsIHthOiAxLCBiOjJ9KTtcbiAgICAgICAgZXhwZWN0KGEpLnRvLmVxbCh7YTogMSwgYjoyfSk7XG4gICAgICAgIGEgPSB7YjogM307XG4gICAgICAgIEx1Yy5hcHBseShhLCB7YTogMX0pO1xuICAgICAgICBleHBlY3QoYSkudG8uZXFsKHthOiAxLCBiOiAzfSk7XG4gICAgICAgIGV4cGVjdChMdWMuYXBwbHkoe30sIHVuZGVmaW5lZCkpLnRvLmVxbCh7fSk7XG4gICAgICAgIGV4cGVjdChMdWMuYXBwbHkodW5kZWZpbmVkLCB7fSkpLnRvLmVxbCh7fSk7XG4gICAgfSk7XG5cbiAgICBpdCgnbWl4JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhID0ge2I6IDN9O1xuICAgICAgICBMdWMubWl4KGEsIHthOiAxLCBiOjJ9KTtcbiAgICAgICAgZXhwZWN0KGEpLnRvLmVxbCh7YTogMSwgYjozfSk7XG4gICAgfSk7XG5cbiAgICBpdCgndG9PYmplY3QnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGEgPSB7fSxcbiAgICAgICAgICAgIGIgPSBbXSxcbiAgICAgICAgICAgIHRvT2JqZWN0QXJncyxcbiAgICAgICAgICAgIHRvT2JqZWN0QXJyYXk7XG5cbiAgICAgICAgdG9PYmplY3RBcnJheSA9IEx1Yy5PYmplY3QudG9PYmplY3QoWyduYW1lMScsICduYW1lMiddLCBbYSxiXSk7XG4gICAgICAgIGV4cGVjdCh0b09iamVjdEFycmF5Lm5hbWUxKS50by5lcWwoYSk7XG4gICAgICAgIGV4cGVjdCh0b09iamVjdEFycmF5Lm5hbWUyKS50by5lcWwoYik7XG5cbiAgICAgICAgKGZ1bmN0aW9uKGMsZCl7XG4gICAgICAgICAgICB0b09iamVjdEFyZ3MgPSBMdWMuT2JqZWN0LnRvT2JqZWN0KFsnbmFtZTEnLCAnbmFtZTInXSwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIGV4cGVjdCh0b09iamVjdEFyZ3MubmFtZTEpLnRvLmVxbChhKTtcbiAgICAgICAgICAgIGV4cGVjdCh0b09iamVjdEFyZ3MubmFtZTIpLnRvLmVxbChiKTtcbiAgICAgICAgfShhLGIpKTtcbiAgICB9KTtcblxuICAgIGl0KCdmaWx0ZXIgbm9uIG93blByb3BlcnRpZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG9iaiA9IE9iamVjdC5jcmVhdGUoe2E6IDEsIGI6Mn0pLFxuICAgICAgICAgICAgZmlsdGVyZWQ7XG5cbiAgICAgICAgZmlsdGVyZWQgPSBMdWMuT2JqZWN0LmZpbHRlcihvYmosIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBrZXkgPT09ICdhJztcbiAgICAgICAgfSwgdW5kZWZpbmVkLCB7XG4gICAgICAgICAgICBvd25Qcm9wZXJ0aWVzOiBmYWxzZVxuICAgICAgICB9KTtcblxuICAgICAgICBleHBlY3QoZmlsdGVyZWQpLnRvLmVxbChbe2tleTogJ2EnLCB2YWx1ZTogMX1dKTtcbiAgICB9KTtcblxuICAgIGl0KCdmaWx0ZXIgb3duUHJvcGVydGllcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgb2JqID0gT2JqZWN0LmNyZWF0ZSh7YTogMSwgYjoyfSksXG4gICAgICAgICAgICBmaWx0ZXJlZDtcblxuICAgICAgICBvYmouYyA9IDM7XG5cbiAgICAgICAgZmlsdGVyZWQgPSBMdWMuT2JqZWN0LmZpbHRlcihvYmosIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBrZXkgPT09ICdhJztcbiAgICAgICAgfSwgdW5kZWZpbmVkLCB7XG4gICAgICAgICAgICBvd25Qcm9wZXJ0aWVzOiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGV4cGVjdChmaWx0ZXJlZCkudG8uZXFsKFtdKTtcblxuICAgICAgICBmaWx0ZXJlZCA9IEx1Yy5PYmplY3QuZmlsdGVyKG9iaiwgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGtleSA9PT0gJ2MnO1xuICAgICAgICB9LCB1bmRlZmluZWQsIHtcbiAgICAgICAgICAgIG93blByb3BlcnRpZXM6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZXhwZWN0KGZpbHRlcmVkKS50by5lcWwoW3trZXk6ICdjJywgdmFsdWU6IDN9XSk7XG4gICAgfSk7XG59KTsiLCJ2YXIgTHVjID0gcmVxdWlyZSgnLi9sdWNUZXN0TGliJyksXG4gICAgZXhwZWN0ID0gcmVxdWlyZSgnZXhwZWN0LmpzJyksXG4gICAgYXJyYXlTbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxuZGVzY3JpYmUoJ0x1YyBGdW5jdGlvbiB1dGlsaXRpZXMnLCBmdW5jdGlvbigpIHtcblxuICAgIFxuICAgICAgICBmdW5jdGlvbiB0ZXN0Rm4oKSB7XG4gICAgICAgICAgICB2YXIgYXJyID0gYXJyYXlTbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdHIgKyBhcnIuam9pbignJyk7XG4gICAgICAgIH1cblxuICAgIGl0KCdjcmVhdGUgYXVnbWVudG9yIGFwcGVuZCBhbmQgdGhpcycsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBhcHBlbmRBbmRUaGlzID0gTHVjLkZ1bmN0aW9uLmNyZWF0ZUF1Z21lbnRlcih0ZXN0Rm4sIHtcbiAgICAgICAgICAgIHRoaXNBcmc6IHtcbiAgICAgICAgICAgICAgICBzdHI6ICcxJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFyZ3M6IFs0LCA1XSxcbiAgICAgICAgICAgIGluZGV4OiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGV4cGVjdChhcHBlbmRBbmRUaGlzKDIsIDMpKS50by5iZSgnMTIzNDUnKTtcbiAgICB9KTtcblxuICAgIGl0KCdjcmVhdGUgYXVnbWVudG9yIHRoaXNBcmcgd2l0aCBhcHBlbmQgYWZ0ZXInLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFwcGVuZEFuZFRoaXNBcmd1bWVudHNBZnRlciA9IEx1Yy5GdW5jdGlvbi5jcmVhdGVBdWdtZW50ZXIodGVzdEZuLCB7XG4gICAgICAgICAgICB0aGlzQXJnOiB7XG4gICAgICAgICAgICAgICAgc3RyOiAnMSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhcmdzOiBbNCwgNV0sXG4gICAgICAgICAgICBpbmRleDogdHJ1ZSxcbiAgICAgICAgICAgIGFyZ3VtZW50c0ZpcnN0OiBmYWxzZVxuICAgICAgICB9KTtcblxuICAgICAgICBleHBlY3QoYXBwZW5kQW5kVGhpc0FyZ3VtZW50c0FmdGVyKDIsMykpLnRvLmJlKCcxNDUyMycpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2NyZWF0ZSBhdWdtZW50b3IgdGhpc0FyZyBpbmRleCBhbmQgYXJncyBhZnRlcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJndW1lbnRzQWZ0ZXIgPSBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudGVyKHRlc3RGbiwge1xuICAgICAgICAgICAgdGhpc0FyZzoge1xuICAgICAgICAgICAgICAgIHN0cjogJzEnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYXJnczogWzQsIDVdLFxuICAgICAgICAgICAgaW5kZXg6IDEsXG4gICAgICAgICAgICBhcmd1bWVudHNGaXJzdDogZmFsc2VcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZXhwZWN0KGFyZ3VtZW50c0FmdGVyKDIsMykpLnRvLmJlKCcxNDIzNScpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2NyZWF0ZSBhdWdtZW50b3IgdGhpcyBhcmcgYW5kIGRlZmF1bHQgaW5zZXJ0IGFyZ3MnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3VtZW50c0luc2VydCA9IEx1Yy5GdW5jdGlvbi5jcmVhdGVBdWdtZW50ZXIodGVzdEZuLCB7XG4gICAgICAgICAgICB0aGlzQXJnOiB7XG4gICAgICAgICAgICAgICAgc3RyOiAnMSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhcmdzOiBbNCwgNV0sXG4gICAgICAgICAgICBpbmRleDogMVxuICAgICAgICB9KTtcblxuICAgICAgICBleHBlY3QoYXJndW1lbnRzSW5zZXJ0KDIsMykpLnRvLmJlKCcxMjQ1MycpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2NyZWF0ZSBhdWdtZW50b3IgZGVmYXVsdCBpbnNlcnQgYXJncycsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbm9UaGlzQXJnID0gTHVjLkZ1bmN0aW9uLmNyZWF0ZUF1Z21lbnRlcih0ZXN0Rm4sIHtcbiAgICAgICAgICAgIGFyZ3M6IFs0LCA1XSxcbiAgICAgICAgICAgIGluZGV4OiAxXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGV4cGVjdChub1RoaXNBcmcuYXBwbHkoe3N0cjogJzInfSxbMiwzXSkpLnRvLmJlKCcyMjQ1MycpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2NyZWF0ZSBhdWdtZW50b3IganVzdCBhcmd1bWVudHMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGp1c3RBcmdzID0gTHVjLkZ1bmN0aW9uLmNyZWF0ZUF1Z21lbnRlcih0ZXN0Rm4sIHtcbiAgICAgICAgICAgIGFyZ3M6IFs0LCA1XVxuICAgICAgICB9KTtcblxuICAgICAgICBleHBlY3QoanVzdEFyZ3MuYXBwbHkoe3N0cjogJzInfSxbMiwzXSkpLnRvLmJlKCcyNDUnKTtcbiAgICB9KTtcblxuICAgIGl0KCdjcmVhdGUgc2VxdWVuY2UnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGhhc1J1bjEsIGhhc1J1bjIsIGhhc1J1bjM7XG5cbiAgICAgICAgdmFyIHNlcXVlbmNlZCA9IEx1Yy5GdW5jdGlvbi5jcmVhdGVTZXF1ZW5jZShbXG4gICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBoYXNSdW4xID0gdHJ1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBoYXNSdW4yID0gdHJ1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBoYXNSdW4zID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgXSk7XG5cbiAgICAgICAgdmFyIHJldCA9IHNlcXVlbmNlZCgpO1xuXG4gICAgICAgIGV4cGVjdChoYXNSdW4xKS50by5iZSh0cnVlKTtcbiAgICAgICAgZXhwZWN0KGhhc1J1bjIpLnRvLmJlKHRydWUpO1xuICAgICAgICBleHBlY3QoaGFzUnVuMykudG8uYmUodHJ1ZSk7XG4gICAgICAgIGV4cGVjdChyZXQpLnRvLmJlKHRydWUpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2NyZWF0ZSBzZXF1ZW5jZSBhdWdtZW50b3IgY29uZmlnJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBoYXNSdW4xLCBoYXNSdW4yLCBoYXNSdW4zO1xuXG4gICAgICAgIHZhciBzZXF1ZW5jZWQgPSBMdWMuRnVuY3Rpb24uY3JlYXRlU2VxdWVuY2UoW1xuICAgICAgICAgICAgZnVuY3Rpb24oYSxiKSB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGEpLnRvLmJlKDEpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChiKS50by5iZSgyKTtcbiAgICAgICAgICAgICAgICBoYXNSdW4xID0gdHJ1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBoYXNSdW4yID0gdHJ1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBoYXNSdW4zID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgXSx7XG4gICAgICAgICAgICB0aGlzQXJnOiB7XG4gICAgICAgICAgICAgICAgYTogMVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgcmV0ID0gc2VxdWVuY2VkKDEsMik7XG5cbiAgICAgICAgZXhwZWN0KGhhc1J1bjEpLnRvLmJlKHRydWUpO1xuICAgICAgICBleHBlY3QoaGFzUnVuMikudG8uYmUodHJ1ZSk7XG4gICAgICAgIGV4cGVjdChoYXNSdW4zKS50by5iZSh0cnVlKTtcbiAgICAgICAgZXhwZWN0KHJldCkudG8uZXFsKHthOjF9KTtcbiAgICB9KTtcblxuICAgIGl0KCdjcmVhdGUgc2VxdWVuY2VJZicsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaGFzUnVuMSwgaGFzUnVuMiwgaGFzUnVuMztcblxuICAgICAgICB2YXIgc2VxdWVuY2VkID0gTHVjLkZ1bmN0aW9uLmNyZWF0ZVNlcXVlbmNlSWYoW1xuICAgICAgICAgICAgZnVuY3Rpb24oYSxiKSB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGEpLnRvLmJlKDEpO1xuICAgICAgICAgICAgICAgICBleHBlY3QoYikudG8uYmUoMik7XG4gICAgICAgICAgICAgICAgaGFzUnVuMSA9IHRydWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaGFzUnVuMiA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGhhc1J1bjMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuICAgICAgICBdLHtcbiAgICAgICAgICAgIHRoaXNBcmc6IHtcbiAgICAgICAgICAgICAgICBhOiAxXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciByZXQgPSBzZXF1ZW5jZWQoMSwyKTtcblxuICAgICAgICBleHBlY3QoaGFzUnVuMSkudG8uYmUodHJ1ZSk7XG4gICAgICAgIGV4cGVjdChoYXNSdW4yKS50by5iZSh0cnVlKTtcbiAgICAgICAgZXhwZWN0KGhhc1J1bjMpLnRvLmJlKHVuZGVmaW5lZCk7XG4gICAgICAgIGV4cGVjdChyZXQpLnRvLmJlKGZhbHNlKTtcbiAgICB9KTtcblxuICAgIGl0KCdjcmVhdGUgcmVsYXllcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc2VxdWVuY2VkID0gTHVjLkZ1bmN0aW9uLmNyZWF0ZVJlbGF5ZXIoW1xuICAgICAgICAgICAgZnVuY3Rpb24oYSxiLGMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYSArIGIgKyBjO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8vYWNiLCBiXG4gICAgICAgICAgICBmdW5jdGlvbihhLGIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYSArIGEgKyBiICsgYjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvL2FjYmFjYmJiLCBiXG4gICAgICAgICAgICBmdW5jdGlvbihhLGIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYiArIGE7XG4gICAgICAgICAgICB9XG4gICAgICAgIF0se1xuICAgICAgICAgICAgYXJnczogWydiJ10sXG4gICAgICAgICAgICBpbmRleDogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgcmV0ID0gc2VxdWVuY2VkKCdhJywgJ2MnKTtcblxuICAgICAgICBleHBlY3QocmV0KS50by5iZSgnYmFjYmFjYmJiJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnY3JlYXRlIGRlZmVycmVkJywgZnVuY3Rpb24oZG9uZSkge1xuICAgICAgICB2YXIgaGFzRGVmZXJlZCA9IGZhbHNlO1xuICAgICAgICB2YXIgZGVmZXJyZWQgPSBMdWMuRnVuY3Rpb24uY3JlYXRlRGVmZXJyZWQoZnVuY3Rpb24oYSxiKXtcbiAgICAgICAgICAgIGhhc0RlZmVyZWQgPSB0cnVlO1xuICAgICAgICAgICAgZXhwZWN0KGEpLnRvLmJlKDEpO1xuICAgICAgICAgICAgZXhwZWN0KGIpLnRvLmJlKDIpO1xuICAgICAgICAgICAgZG9uZSgpO1xuXG4gICAgICAgIH0sIDEsIHtcbiAgICAgICAgICAgIGFyZ3M6IFsyXSxcbiAgICAgICAgICAgIGluZGV4OiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRlZmVycmVkKDEpO1xuXG4gICAgICAgIGV4cGVjdChoYXNEZWZlcmVkKS50by5iZShmYWxzZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnY3JlYXRlIGRlZmVycmVkIG5vIG1pbGxpcycsIGZ1bmN0aW9uKGRvbmUpIHtcbiAgICAgICAgdmFyIGhhc0RlZmVyZWQgPSBmYWxzZTtcbiAgICAgICAgdmFyIGRlZmVycmVkID0gTHVjLkZ1bmN0aW9uLmNyZWF0ZURlZmVycmVkKGZ1bmN0aW9uKGEsYil7XG4gICAgICAgICAgICBoYXNEZWZlcmVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGV4cGVjdChhKS50by5iZSgxKTtcbiAgICAgICAgICAgIGV4cGVjdChiKS50by5iZSh1bmRlZmluZWQpO1xuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9LCAwKTtcblxuICAgICAgICBkZWZlcnJlZCgxKTtcblxuICAgICAgICBleHBlY3QoaGFzRGVmZXJlZCkudG8uYmUodHJ1ZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnY3JlYXRlIHRocm90dGVsZWQgbm8gbWlsbGlzJywgZnVuY3Rpb24oZG9uZSkge1xuICAgICAgICB2YXIgaGFzRGVmZXJlZCA9IGZhbHNlO1xuICAgICAgICB2YXIgZGVmZXJyZWQgPSBMdWMuRnVuY3Rpb24uY3JlYXRlVGhyb3R0bGVkKGZ1bmN0aW9uKGEsYil7XG4gICAgICAgICAgICBoYXNEZWZlcmVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGV4cGVjdChhKS50by5iZSgxKTtcbiAgICAgICAgICAgIGV4cGVjdChiKS50by5iZSh1bmRlZmluZWQpO1xuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9LCAwKTtcblxuICAgICAgICBkZWZlcnJlZCgxKTtcblxuICAgICAgICBleHBlY3QoaGFzRGVmZXJlZCkudG8uYmUodHJ1ZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnY3JlYXRlIHRocm90dGVsZWQnLCBmdW5jdGlvbihkb25lKSB7XG4gICAgICAgIHZhciBjYWxsQ291bnQgPSAwO1xuICAgICAgICB2YXIgdGhyb3R0bGVkID0gTHVjLkZ1bmN0aW9uLmNyZWF0ZVRocm90dGxlZChmdW5jdGlvbihhLGIsYyl7XG4gICAgICAgICAgICBjYWxsQ291bnQrKztcbiAgICAgICAgICAgIGV4cGVjdChhKS50by5iZSgxKTtcbiAgICAgICAgICAgIGV4cGVjdChiKS50by5iZSgzKTtcbiAgICAgICAgICAgIGV4cGVjdChjKS50by5iZSgyKTtcbiAgICAgICAgICAgIGV4cGVjdChjYWxsQ291bnQpLnRvLmJlKDEpO1xuICAgICAgICAgICAgZG9uZSgpO1xuXG4gICAgICAgIH0sIDEsIHtcbiAgICAgICAgICAgIGFyZ3M6IFszXSxcbiAgICAgICAgICAgIGluZGV4OiAxXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCAyMDA7ICsraSkge1xuICAgICAgICAgICAgdGhyb3R0bGVkKDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhyb3R0bGVkKDEsMik7XG5cbiAgICAgICAgZXhwZWN0KGNhbGxDb3VudCkudG8uYmUoMCk7XG4gICAgfSk7XG5cblxufSk7IiwidmFyIEx1YyA9IHJlcXVpcmUoJy4vbHVjVGVzdExpYicpLFxuICAgIGV4cGVjdCA9IHJlcXVpcmUoJ2V4cGVjdC5qcycpO1xuXG5kZXNjcmliZSgnTHVjIGNvbXBhcmUgZm4nLCBmdW5jdGlvbigpIHtcblxuICAgIGl0KCdjb21wYXJlIGVtcHR5IG9iamVjdHMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KEx1Yy5jb21wYXJlKHt9LCB7fSkpLnRvLmJlKHRydWUpO1xuICAgICAgICBleHBlY3QoTHVjLmNvbXBhcmUoW10sIFtdKSkudG8uYmUodHJ1ZSk7XG4gICAgICAgIGV4cGVjdChMdWMuY29tcGFyZShuZXcgRGF0ZSgxMDAwKSwgbmV3IERhdGUoMTAwMCkpKS50by5iZSh0cnVlKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5jb21wYXJlKG5ldyBEYXRlKDEwMDApLCBuZXcgRGF0ZSgxMDAxKSkpLnRvLmJlKGZhbHNlKTtcbiAgICB9KTtcblxuICAgIGl0KCdjb21wYXJlIHZhbHVlcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3QoTHVjLmNvbXBhcmUoe30sIHtcbiAgICAgICAgICAgIGE6IDFcbiAgICAgICAgfSkpLnRvLmJlKGZhbHNlKTtcblxuICAgICAgICBleHBlY3QoTHVjLmNvbXBhcmUoe1xuICAgICAgICAgICAgYTogMVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBhOiAxXG4gICAgICAgIH0pKS50by5iZSh0cnVlKTtcblxuICAgICAgICBleHBlY3QoTHVjLmNvbXBhcmUoe1xuICAgICAgICAgICAgYTogMSxcbiAgICAgICAgICAgIGI6IDFcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgYTogMVxuICAgICAgICB9KSkudG8uYmUoZmFsc2UpO1xuICAgIH0pO1xuXG5cbiAgICBpdCgnY29tcGFyZSBkaWZmZXJlbnQgb2JqZWN0IHR5cGVzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGV4cGVjdChMdWMuY29tcGFyZShuZXcgRGF0ZSgxMDAwMCksIHt9KSkudG8uYmUoZmFsc2UpO1xuICAgICAgICBleHBlY3QoTHVjLmNvbXBhcmUobmV3IERhdGUoMTAwMDApLCB1bmRlZmluZWQpKS50by5iZShmYWxzZSk7XG4gICAgICAgIGV4cGVjdChMdWMuY29tcGFyZShuZXcgRGF0ZSgxMDAwMCksIFtdKSkudG8uYmUoZmFsc2UpO1xuXG4gICAgfSk7XG5cbiAgICBpdCgnY29tcGFyZSBmYWxzeXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KEx1Yy5jb21wYXJlKGZhbHNlLCBmYWxzZSkpLnRvLmJlKHRydWUpO1xuICAgICAgICBleHBlY3QoTHVjLmNvbXBhcmUoMCwgZmFsc2UpKS50by5iZShmYWxzZSk7XG4gICAgICAgIGV4cGVjdChMdWMuY29tcGFyZSgnJywgZmFsc2UpKS50by5iZShmYWxzZSk7XG4gICAgICAgIGV4cGVjdChMdWMuY29tcGFyZShudWxsLCBmYWxzZSkpLnRvLmJlKGZhbHNlKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5jb21wYXJlKHVuZGVmaW5lZCwgZmFsc2UpKS50by5iZShmYWxzZSk7XG4gICAgICAgIGV4cGVjdChMdWMuY29tcGFyZShOYU4sIGZhbHNlKSkudG8uYmUoZmFsc2UpO1xuICAgICAgICBleHBlY3QoTHVjLmNvbXBhcmUoW10sIFsxXSwge3R5cGU6ICdkZWVwJ30pKS50by5iZShmYWxzZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnZGVlcCBjb21wYXJlJywgZnVuY3Rpb24oKSB7IFxuICAgICAgICB2YXIgZGVlcFRydWUgPSBMdWMuY29tcGFyZSh7XG4gICAgICAgICAgICBhOiB7XG4gICAgICAgICAgICAgICAgYTogMVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGI6IFsxLCAnYScsIG5ldyBEYXRlKDEwMDApLCB7XG4gICAgICAgICAgICAgICAgICAgIGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGI6IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBhOiB7XG4gICAgICAgICAgICAgICAgYTogMVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGI6IFsxLCAnYScsIG5ldyBEYXRlKDEwMDApLCB7XG4gICAgICAgICAgICAgICAgICAgIGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGI6IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICB0eXBlOiAnZGVlcCdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIGRlZXBGYWxzZSA9IEx1Yy5jb21wYXJlKHtcbiAgICAgICAgICAgIGE6IHtcbiAgICAgICAgICAgICAgICBhOiAxXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYjogWzEsICdhJywgbmV3IERhdGUoMTAwMCksIHtcbiAgICAgICAgICAgICAgICAgICAgYToge1xuICAgICAgICAgICAgICAgICAgICAgICAgYToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGE6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYjogdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGE6IHtcbiAgICAgICAgICAgICAgICBhOiAxXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYjogWzEsICdhJywgbmV3IERhdGUoMTAwMCksIHtcbiAgICAgICAgICAgICAgICAgICAgYToge1xuICAgICAgICAgICAgICAgICAgICAgICAgYToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGE6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGM6IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICB0eXBlOiAnZGVlcCdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZXhwZWN0KGRlZXBUcnVlKS50by5iZSh0cnVlKTtcbiAgICAgICAgZXhwZWN0KGRlZXBGYWxzZSkudG8uYmUoZmFsc2UpO1xuICAgICAgICB9KVxuXG4gICAgaXQoJ3NpbXBsZSBkZWVwIGFuZCBzaGFsbG93IGNvbXBhcmUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KEx1Yy5jb21wYXJlKHthOjF9LCB7YToxfSwge3R5cGU6ICdzaGFsbG93J30pKS50by5iZSh0cnVlKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5jb21wYXJlKHthOjEsIGI6IHt9fSwge2E6MSwgYjoge319LCB7dHlwZTogJ3NoYWxsb3cnfSkpLnRvLmJlKGZhbHNlKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5jb21wYXJlKHthOjF9LCB7YToxfSwge3R5cGU6ICdkZWVwJ30pKS50by5iZSh0cnVlKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5jb21wYXJlKHthOjEsIGI6IHt9fSwge2E6MSwgYjoge319LCB7dHlwZTogJ2RlZXAnfSkpLnRvLmJlKHRydWUpO1xuICAgICAgICBleHBlY3QoTHVjLmNvbXBhcmUoe2E6MX0sIHthOjF9LCB7dHlwZTogJ3N0cmljdCd9KSkudG8uYmUoZmFsc2UpO1xuXG4gICAgfSk7XG5cbiAgICBpdCgnaW52YWxpZCB0eXBlIHRocm93cyBhbiBleGNlcHRpb24nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGludmFsaWRUeXBlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIEx1Yy5jb21wYXJlKHRydWUsIHRydWUsIHt0eXBlOiAnZGVlZWVlcCd9KTtcbiAgICAgICAgfTtcbiAgICAgICAgZXhwZWN0KGludmFsaWRUeXBlKS50by50aHJvd0V4Y2VwdGlvbigpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2xvb3NlIGNvbXBhcmUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KEx1Yy5jb21wYXJlKG5ldyBEYXRlKDEwMDAwKSwge30pLCB7dHlwZTogJ2xvb3NlJ30pLnRvLmJlKGZhbHNlKTtcbiAgICAgICAgZXhwZWN0KEx1Yy5jb21wYXJlKHt9LCBuZXcgRGF0ZSgxMDAwMCkpLCB7dHlwZTogJ2xvb3NlJ30pLnRvLmJlKGZhbHNlKTtcblxuICAgICAgICBleHBlY3QoTHVjLmNvbXBhcmUoe2E6MX0sIHthOjEsIGI6Mn0sIHt0eXBlOiAnbG9vc2UnfSkpLnRvLmJlKHRydWUpO1xuICAgICAgICBleHBlY3QoTHVjLmNvbXBhcmUoe2E6MX0sIHthOjJ9LCB7dHlwZTogJ2xvb3NlJ30pKS50by5iZShmYWxzZSk7XG5cbiAgICAgICAgZXhwZWN0KEx1Yy5jb21wYXJlKDEsIHthOjJ9LCB7dHlwZTogJ2xvb3NlJ30pKS50by5iZShmYWxzZSk7XG4gICAgICAgIGV4cGVjdChMdWMuY29tcGFyZSh7YToxfSwgMSwge3R5cGU6ICdsb29zZSd9KSkudG8uYmUoZmFsc2UpO1xuXG4gICAgICAgIGV4cGVjdChMdWMuY29tcGFyZShbe2E6MX1dLCBbe2E6MSwgYjoyfV0sIHt0eXBlOiAnbG9vc2UnfSkpLnRvLmJlKHRydWUpO1xuICAgICAgICBleHBlY3QoTHVjLmNvbXBhcmUoW3thOjF9LCAxXSwgW3thOjEsIGI6Mn1dLCB7dHlwZTogJ2xvb3NlJ30pKS50by5iZShmYWxzZSk7XG4gICAgICAgIGV4cGVjdChMdWMuY29tcGFyZShbe2E6MX0sIDFdLCBbe2E6MSwgYjoyfSwgMV0sIHt0eXBlOiAnbG9vc2UnfSkpLnRvLmJlKHRydWUpO1xuICAgICAgICBleHBlY3QoTHVjLmNvbXBhcmUoW3thOjF9LCAxXSwgW3thOjEsIGI6Mn0sIDJdLCB7dHlwZTogJ2xvb3NlJ30pKS50by5iZShmYWxzZSk7XG4gICAgfSlcbn0pOyIsIiBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uL2xpYi9sdWMtZXM1LXNoaW0nKTsiLCJ2YXIgTHVjID0gcmVxdWlyZSgnLi9sdWNUZXN0TGliJyksXG4gICAgZXhwZWN0ID0gcmVxdWlyZSgnZXhwZWN0LmpzJyk7XG5cbmV4cG9ydHMudGVzdEVtaXR0ZXIgPSBmdW5jdGlvbihlbWl0dGVyKSB7XG5cbiAgICB2YXIgaSA9ICcnO1xuICAgIGVtaXR0ZXIub24oJ2FhYScsIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgaSArPSB2O1xuICAgIH0pO1xuICAgIGVtaXR0ZXIuZW1pdCgnYWFhJywgJ2EnKTtcbiAgICBlbWl0dGVyLmVtaXQoJ2FhYScsICdiJyk7XG4gICAgZW1pdHRlci5lbWl0KCdhYWEnLCAnYycpO1xuICAgIGV4cGVjdChpKS50by5iZSgnYWJjJyk7XG4gICAgaSA9IFwiXCI7XG5cbiAgICBlbWl0dGVyLm9uY2UoJ2JiYicsIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgaSArPSB2O1xuICAgIH0pO1xuXG4gICAgZW1pdHRlci5lbWl0KCdiYmInLCAnYScpO1xuICAgIGVtaXR0ZXIuZW1pdCgnYmJiJywgJ2InKTtcbiAgICBlbWl0dGVyLmVtaXQoJ2JiYicsICdjJyk7XG4gICAgZXhwZWN0KGkpLnRvLmJlKCdhJyk7XG59IiwicmVxdWlyZT0oZnVuY3Rpb24oZSx0LG4scil7ZnVuY3Rpb24gaShyKXtpZighbltyXSl7aWYoIXRbcl0pe2lmKGUpcmV0dXJuIGUocik7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIityK1wiJ1wiKX12YXIgcz1uW3JdPXtleHBvcnRzOnt9fTt0W3JdWzBdKGZ1bmN0aW9uKGUpe3ZhciBuPXRbcl1bMV1bZV07cmV0dXJuIGkobj9uOmUpfSxzLHMuZXhwb3J0cyl9cmV0dXJuIG5bcl0uZXhwb3J0c31mb3IodmFyIHM9MDtzPHIubGVuZ3RoO3MrKylpKHJbc10pO3JldHVybiBpfSkodHlwZW9mIHJlcXVpcmUhPT1cInVuZGVmaW5lZFwiJiZyZXF1aXJlLHsxOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbi8vIFVUSUxJVFlcbnZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpO1xudmFyIEJ1ZmZlciA9IHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyO1xudmFyIHBTbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxuZnVuY3Rpb24gb2JqZWN0S2V5cyhvYmplY3QpIHtcbiAgaWYgKE9iamVjdC5rZXlzKSByZXR1cm4gT2JqZWN0LmtleXMob2JqZWN0KTtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBmb3IgKHZhciBuYW1lIGluIG9iamVjdCkge1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBuYW1lKSkge1xuICAgICAgcmVzdWx0LnB1c2gobmFtZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8vIDEuIFRoZSBhc3NlcnQgbW9kdWxlIHByb3ZpZGVzIGZ1bmN0aW9ucyB0aGF0IHRocm93XG4vLyBBc3NlcnRpb25FcnJvcidzIHdoZW4gcGFydGljdWxhciBjb25kaXRpb25zIGFyZSBub3QgbWV0LiBUaGVcbi8vIGFzc2VydCBtb2R1bGUgbXVzdCBjb25mb3JtIHRvIHRoZSBmb2xsb3dpbmcgaW50ZXJmYWNlLlxuXG52YXIgYXNzZXJ0ID0gbW9kdWxlLmV4cG9ydHMgPSBvaztcblxuLy8gMi4gVGhlIEFzc2VydGlvbkVycm9yIGlzIGRlZmluZWQgaW4gYXNzZXJ0LlxuLy8gbmV3IGFzc2VydC5Bc3NlcnRpb25FcnJvcih7IG1lc3NhZ2U6IG1lc3NhZ2UsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0dWFsOiBhY3R1YWwsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IGV4cGVjdGVkIH0pXG5cbmFzc2VydC5Bc3NlcnRpb25FcnJvciA9IGZ1bmN0aW9uIEFzc2VydGlvbkVycm9yKG9wdGlvbnMpIHtcbiAgdGhpcy5uYW1lID0gJ0Fzc2VydGlvbkVycm9yJztcbiAgdGhpcy5tZXNzYWdlID0gb3B0aW9ucy5tZXNzYWdlO1xuICB0aGlzLmFjdHVhbCA9IG9wdGlvbnMuYWN0dWFsO1xuICB0aGlzLmV4cGVjdGVkID0gb3B0aW9ucy5leHBlY3RlZDtcbiAgdGhpcy5vcGVyYXRvciA9IG9wdGlvbnMub3BlcmF0b3I7XG4gIHZhciBzdGFja1N0YXJ0RnVuY3Rpb24gPSBvcHRpb25zLnN0YWNrU3RhcnRGdW5jdGlvbiB8fCBmYWlsO1xuXG4gIGlmIChFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSkge1xuICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIHN0YWNrU3RhcnRGdW5jdGlvbik7XG4gIH1cbn07XG51dGlsLmluaGVyaXRzKGFzc2VydC5Bc3NlcnRpb25FcnJvciwgRXJyb3IpO1xuXG5mdW5jdGlvbiByZXBsYWNlcihrZXksIHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuICcnICsgdmFsdWU7XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgKGlzTmFOKHZhbHVlKSB8fCAhaXNGaW5pdGUodmFsdWUpKSkge1xuICAgIHJldHVybiB2YWx1ZS50b1N0cmluZygpO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicgfHwgdmFsdWUgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICByZXR1cm4gdmFsdWUudG9TdHJpbmcoKTtcbiAgfVxuICByZXR1cm4gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIHRydW5jYXRlKHMsIG4pIHtcbiAgaWYgKHR5cGVvZiBzID09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHMubGVuZ3RoIDwgbiA/IHMgOiBzLnNsaWNlKDAsIG4pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzO1xuICB9XG59XG5cbmFzc2VydC5Bc3NlcnRpb25FcnJvci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMubWVzc2FnZSkge1xuICAgIHJldHVybiBbdGhpcy5uYW1lICsgJzonLCB0aGlzLm1lc3NhZ2VdLmpvaW4oJyAnKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gW1xuICAgICAgdGhpcy5uYW1lICsgJzonLFxuICAgICAgdHJ1bmNhdGUoSlNPTi5zdHJpbmdpZnkodGhpcy5hY3R1YWwsIHJlcGxhY2VyKSwgMTI4KSxcbiAgICAgIHRoaXMub3BlcmF0b3IsXG4gICAgICB0cnVuY2F0ZShKU09OLnN0cmluZ2lmeSh0aGlzLmV4cGVjdGVkLCByZXBsYWNlciksIDEyOClcbiAgICBdLmpvaW4oJyAnKTtcbiAgfVxufTtcblxuLy8gYXNzZXJ0LkFzc2VydGlvbkVycm9yIGluc3RhbmNlb2YgRXJyb3JcblxuYXNzZXJ0LkFzc2VydGlvbkVycm9yLl9fcHJvdG9fXyA9IEVycm9yLnByb3RvdHlwZTtcblxuLy8gQXQgcHJlc2VudCBvbmx5IHRoZSB0aHJlZSBrZXlzIG1lbnRpb25lZCBhYm92ZSBhcmUgdXNlZCBhbmRcbi8vIHVuZGVyc3Rvb2QgYnkgdGhlIHNwZWMuIEltcGxlbWVudGF0aW9ucyBvciBzdWIgbW9kdWxlcyBjYW4gcGFzc1xuLy8gb3RoZXIga2V5cyB0byB0aGUgQXNzZXJ0aW9uRXJyb3IncyBjb25zdHJ1Y3RvciAtIHRoZXkgd2lsbCBiZVxuLy8gaWdub3JlZC5cblxuLy8gMy4gQWxsIG9mIHRoZSBmb2xsb3dpbmcgZnVuY3Rpb25zIG11c3QgdGhyb3cgYW4gQXNzZXJ0aW9uRXJyb3Jcbi8vIHdoZW4gYSBjb3JyZXNwb25kaW5nIGNvbmRpdGlvbiBpcyBub3QgbWV0LCB3aXRoIGEgbWVzc2FnZSB0aGF0XG4vLyBtYXkgYmUgdW5kZWZpbmVkIGlmIG5vdCBwcm92aWRlZC4gIEFsbCBhc3NlcnRpb24gbWV0aG9kcyBwcm92aWRlXG4vLyBib3RoIHRoZSBhY3R1YWwgYW5kIGV4cGVjdGVkIHZhbHVlcyB0byB0aGUgYXNzZXJ0aW9uIGVycm9yIGZvclxuLy8gZGlzcGxheSBwdXJwb3Nlcy5cblxuZnVuY3Rpb24gZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCBvcGVyYXRvciwgc3RhY2tTdGFydEZ1bmN0aW9uKSB7XG4gIHRocm93IG5ldyBhc3NlcnQuQXNzZXJ0aW9uRXJyb3Ioe1xuICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgYWN0dWFsOiBhY3R1YWwsXG4gICAgZXhwZWN0ZWQ6IGV4cGVjdGVkLFxuICAgIG9wZXJhdG9yOiBvcGVyYXRvcixcbiAgICBzdGFja1N0YXJ0RnVuY3Rpb246IHN0YWNrU3RhcnRGdW5jdGlvblxuICB9KTtcbn1cblxuLy8gRVhURU5TSU9OISBhbGxvd3MgZm9yIHdlbGwgYmVoYXZlZCBlcnJvcnMgZGVmaW5lZCBlbHNld2hlcmUuXG5hc3NlcnQuZmFpbCA9IGZhaWw7XG5cbi8vIDQuIFB1cmUgYXNzZXJ0aW9uIHRlc3RzIHdoZXRoZXIgYSB2YWx1ZSBpcyB0cnV0aHksIGFzIGRldGVybWluZWRcbi8vIGJ5ICEhZ3VhcmQuXG4vLyBhc3NlcnQub2soZ3VhcmQsIG1lc3NhZ2Vfb3B0KTtcbi8vIFRoaXMgc3RhdGVtZW50IGlzIGVxdWl2YWxlbnQgdG8gYXNzZXJ0LmVxdWFsKHRydWUsIGd1YXJkLFxuLy8gbWVzc2FnZV9vcHQpOy4gVG8gdGVzdCBzdHJpY3RseSBmb3IgdGhlIHZhbHVlIHRydWUsIHVzZVxuLy8gYXNzZXJ0LnN0cmljdEVxdWFsKHRydWUsIGd1YXJkLCBtZXNzYWdlX29wdCk7LlxuXG5mdW5jdGlvbiBvayh2YWx1ZSwgbWVzc2FnZSkge1xuICBpZiAoISEhdmFsdWUpIGZhaWwodmFsdWUsIHRydWUsIG1lc3NhZ2UsICc9PScsIGFzc2VydC5vayk7XG59XG5hc3NlcnQub2sgPSBvaztcblxuLy8gNS4gVGhlIGVxdWFsaXR5IGFzc2VydGlvbiB0ZXN0cyBzaGFsbG93LCBjb2VyY2l2ZSBlcXVhbGl0eSB3aXRoXG4vLyA9PS5cbi8vIGFzc2VydC5lcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5lcXVhbCA9IGZ1bmN0aW9uIGVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKGFjdHVhbCAhPSBleHBlY3RlZCkgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnPT0nLCBhc3NlcnQuZXF1YWwpO1xufTtcblxuLy8gNi4gVGhlIG5vbi1lcXVhbGl0eSBhc3NlcnRpb24gdGVzdHMgZm9yIHdoZXRoZXIgdHdvIG9iamVjdHMgYXJlIG5vdCBlcXVhbFxuLy8gd2l0aCAhPSBhc3NlcnQubm90RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQubm90RXF1YWwgPSBmdW5jdGlvbiBub3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChhY3R1YWwgPT0gZXhwZWN0ZWQpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICchPScsIGFzc2VydC5ub3RFcXVhbCk7XG4gIH1cbn07XG5cbi8vIDcuIFRoZSBlcXVpdmFsZW5jZSBhc3NlcnRpb24gdGVzdHMgYSBkZWVwIGVxdWFsaXR5IHJlbGF0aW9uLlxuLy8gYXNzZXJ0LmRlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5kZWVwRXF1YWwgPSBmdW5jdGlvbiBkZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoIV9kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCkpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICdkZWVwRXF1YWwnLCBhc3NlcnQuZGVlcEVxdWFsKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gX2RlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkKSB7XG4gIC8vIDcuMS4gQWxsIGlkZW50aWNhbCB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGFzIGRldGVybWluZWQgYnkgPT09LlxuICBpZiAoYWN0dWFsID09PSBleHBlY3RlZCkge1xuICAgIHJldHVybiB0cnVlO1xuXG4gIH0gZWxzZSBpZiAoQnVmZmVyLmlzQnVmZmVyKGFjdHVhbCkgJiYgQnVmZmVyLmlzQnVmZmVyKGV4cGVjdGVkKSkge1xuICAgIGlmIChhY3R1YWwubGVuZ3RoICE9IGV4cGVjdGVkLmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhY3R1YWwubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChhY3R1YWxbaV0gIT09IGV4cGVjdGVkW2ldKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgLy8gNy4yLiBJZiB0aGUgZXhwZWN0ZWQgdmFsdWUgaXMgYSBEYXRlIG9iamVjdCwgdGhlIGFjdHVhbCB2YWx1ZSBpc1xuICAvLyBlcXVpdmFsZW50IGlmIGl0IGlzIGFsc28gYSBEYXRlIG9iamVjdCB0aGF0IHJlZmVycyB0byB0aGUgc2FtZSB0aW1lLlxuICB9IGVsc2UgaWYgKGFjdHVhbCBpbnN0YW5jZW9mIERhdGUgJiYgZXhwZWN0ZWQgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgcmV0dXJuIGFjdHVhbC5nZXRUaW1lKCkgPT09IGV4cGVjdGVkLmdldFRpbWUoKTtcblxuICAvLyA3LjMuIE90aGVyIHBhaXJzIHRoYXQgZG8gbm90IGJvdGggcGFzcyB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCcsXG4gIC8vIGVxdWl2YWxlbmNlIGlzIGRldGVybWluZWQgYnkgPT0uXG4gIH0gZWxzZSBpZiAodHlwZW9mIGFjdHVhbCAhPSAnb2JqZWN0JyAmJiB0eXBlb2YgZXhwZWN0ZWQgIT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gYWN0dWFsID09IGV4cGVjdGVkO1xuXG4gIC8vIDcuNC4gRm9yIGFsbCBvdGhlciBPYmplY3QgcGFpcnMsIGluY2x1ZGluZyBBcnJheSBvYmplY3RzLCBlcXVpdmFsZW5jZSBpc1xuICAvLyBkZXRlcm1pbmVkIGJ5IGhhdmluZyB0aGUgc2FtZSBudW1iZXIgb2Ygb3duZWQgcHJvcGVydGllcyAoYXMgdmVyaWZpZWRcbiAgLy8gd2l0aCBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwpLCB0aGUgc2FtZSBzZXQgb2Yga2V5c1xuICAvLyAoYWx0aG91Z2ggbm90IG5lY2Vzc2FyaWx5IHRoZSBzYW1lIG9yZGVyKSwgZXF1aXZhbGVudCB2YWx1ZXMgZm9yIGV2ZXJ5XG4gIC8vIGNvcnJlc3BvbmRpbmcga2V5LCBhbmQgYW4gaWRlbnRpY2FsICdwcm90b3R5cGUnIHByb3BlcnR5LiBOb3RlOiB0aGlzXG4gIC8vIGFjY291bnRzIGZvciBib3RoIG5hbWVkIGFuZCBpbmRleGVkIHByb3BlcnRpZXMgb24gQXJyYXlzLlxuICB9IGVsc2Uge1xuICAgIHJldHVybiBvYmpFcXVpdihhY3R1YWwsIGV4cGVjdGVkKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZE9yTnVsbCh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gaXNBcmd1bWVudHMob2JqZWN0KSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqZWN0KSA9PSAnW29iamVjdCBBcmd1bWVudHNdJztcbn1cblxuZnVuY3Rpb24gb2JqRXF1aXYoYSwgYikge1xuICBpZiAoaXNVbmRlZmluZWRPck51bGwoYSkgfHwgaXNVbmRlZmluZWRPck51bGwoYikpXG4gICAgcmV0dXJuIGZhbHNlO1xuICAvLyBhbiBpZGVudGljYWwgJ3Byb3RvdHlwZScgcHJvcGVydHkuXG4gIGlmIChhLnByb3RvdHlwZSAhPT0gYi5wcm90b3R5cGUpIHJldHVybiBmYWxzZTtcbiAgLy9+fn5JJ3ZlIG1hbmFnZWQgdG8gYnJlYWsgT2JqZWN0LmtleXMgdGhyb3VnaCBzY3Jld3kgYXJndW1lbnRzIHBhc3NpbmcuXG4gIC8vICAgQ29udmVydGluZyB0byBhcnJheSBzb2x2ZXMgdGhlIHByb2JsZW0uXG4gIGlmIChpc0FyZ3VtZW50cyhhKSkge1xuICAgIGlmICghaXNBcmd1bWVudHMoYikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgYSA9IHBTbGljZS5jYWxsKGEpO1xuICAgIGIgPSBwU2xpY2UuY2FsbChiKTtcbiAgICByZXR1cm4gX2RlZXBFcXVhbChhLCBiKTtcbiAgfVxuICB0cnkge1xuICAgIHZhciBrYSA9IG9iamVjdEtleXMoYSksXG4gICAgICAgIGtiID0gb2JqZWN0S2V5cyhiKSxcbiAgICAgICAga2V5LCBpO1xuICB9IGNhdGNoIChlKSB7Ly9oYXBwZW5zIHdoZW4gb25lIGlzIGEgc3RyaW5nIGxpdGVyYWwgYW5kIHRoZSBvdGhlciBpc24ndFxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyBoYXZpbmcgdGhlIHNhbWUgbnVtYmVyIG9mIG93bmVkIHByb3BlcnRpZXMgKGtleXMgaW5jb3Jwb3JhdGVzXG4gIC8vIGhhc093blByb3BlcnR5KVxuICBpZiAoa2EubGVuZ3RoICE9IGtiLmxlbmd0aClcbiAgICByZXR1cm4gZmFsc2U7XG4gIC8vdGhlIHNhbWUgc2V0IG9mIGtleXMgKGFsdGhvdWdoIG5vdCBuZWNlc3NhcmlseSB0aGUgc2FtZSBvcmRlciksXG4gIGthLnNvcnQoKTtcbiAga2Iuc29ydCgpO1xuICAvL35+fmNoZWFwIGtleSB0ZXN0XG4gIGZvciAoaSA9IGthLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgaWYgKGthW2ldICE9IGtiW2ldKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vZXF1aXZhbGVudCB2YWx1ZXMgZm9yIGV2ZXJ5IGNvcnJlc3BvbmRpbmcga2V5LCBhbmRcbiAgLy9+fn5wb3NzaWJseSBleHBlbnNpdmUgZGVlcCB0ZXN0XG4gIGZvciAoaSA9IGthLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAga2V5ID0ga2FbaV07XG4gICAgaWYgKCFfZGVlcEVxdWFsKGFba2V5XSwgYltrZXldKSkgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG4vLyA4LiBUaGUgbm9uLWVxdWl2YWxlbmNlIGFzc2VydGlvbiB0ZXN0cyBmb3IgYW55IGRlZXAgaW5lcXVhbGl0eS5cbi8vIGFzc2VydC5ub3REZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQubm90RGVlcEVxdWFsID0gZnVuY3Rpb24gbm90RGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKF9kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCkpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICdub3REZWVwRXF1YWwnLCBhc3NlcnQubm90RGVlcEVxdWFsKTtcbiAgfVxufTtcblxuLy8gOS4gVGhlIHN0cmljdCBlcXVhbGl0eSBhc3NlcnRpb24gdGVzdHMgc3RyaWN0IGVxdWFsaXR5LCBhcyBkZXRlcm1pbmVkIGJ5ID09PS5cbi8vIGFzc2VydC5zdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5zdHJpY3RFcXVhbCA9IGZ1bmN0aW9uIHN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKGFjdHVhbCAhPT0gZXhwZWN0ZWQpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICc9PT0nLCBhc3NlcnQuc3RyaWN0RXF1YWwpO1xuICB9XG59O1xuXG4vLyAxMC4gVGhlIHN0cmljdCBub24tZXF1YWxpdHkgYXNzZXJ0aW9uIHRlc3RzIGZvciBzdHJpY3QgaW5lcXVhbGl0eSwgYXNcbi8vIGRldGVybWluZWQgYnkgIT09LiAgYXNzZXJ0Lm5vdFN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0Lm5vdFN0cmljdEVxdWFsID0gZnVuY3Rpb24gbm90U3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoYWN0dWFsID09PSBleHBlY3RlZCkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJyE9PScsIGFzc2VydC5ub3RTdHJpY3RFcXVhbCk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGV4cGVjdGVkRXhjZXB0aW9uKGFjdHVhbCwgZXhwZWN0ZWQpIHtcbiAgaWYgKCFhY3R1YWwgfHwgIWV4cGVjdGVkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKGV4cGVjdGVkIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgcmV0dXJuIGV4cGVjdGVkLnRlc3QoYWN0dWFsKTtcbiAgfSBlbHNlIGlmIChhY3R1YWwgaW5zdGFuY2VvZiBleHBlY3RlZCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2UgaWYgKGV4cGVjdGVkLmNhbGwoe30sIGFjdHVhbCkgPT09IHRydWUpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gX3Rocm93cyhzaG91bGRUaHJvdywgYmxvY2ssIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIHZhciBhY3R1YWw7XG5cbiAgaWYgKHR5cGVvZiBleHBlY3RlZCA9PT0gJ3N0cmluZycpIHtcbiAgICBtZXNzYWdlID0gZXhwZWN0ZWQ7XG4gICAgZXhwZWN0ZWQgPSBudWxsO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBibG9jaygpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgYWN0dWFsID0gZTtcbiAgfVxuXG4gIG1lc3NhZ2UgPSAoZXhwZWN0ZWQgJiYgZXhwZWN0ZWQubmFtZSA/ICcgKCcgKyBleHBlY3RlZC5uYW1lICsgJykuJyA6ICcuJykgK1xuICAgICAgICAgICAgKG1lc3NhZ2UgPyAnICcgKyBtZXNzYWdlIDogJy4nKTtcblxuICBpZiAoc2hvdWxkVGhyb3cgJiYgIWFjdHVhbCkge1xuICAgIGZhaWwoJ01pc3NpbmcgZXhwZWN0ZWQgZXhjZXB0aW9uJyArIG1lc3NhZ2UpO1xuICB9XG5cbiAgaWYgKCFzaG91bGRUaHJvdyAmJiBleHBlY3RlZEV4Y2VwdGlvbihhY3R1YWwsIGV4cGVjdGVkKSkge1xuICAgIGZhaWwoJ0dvdCB1bndhbnRlZCBleGNlcHRpb24nICsgbWVzc2FnZSk7XG4gIH1cblxuICBpZiAoKHNob3VsZFRocm93ICYmIGFjdHVhbCAmJiBleHBlY3RlZCAmJlxuICAgICAgIWV4cGVjdGVkRXhjZXB0aW9uKGFjdHVhbCwgZXhwZWN0ZWQpKSB8fCAoIXNob3VsZFRocm93ICYmIGFjdHVhbCkpIHtcbiAgICB0aHJvdyBhY3R1YWw7XG4gIH1cbn1cblxuLy8gMTEuIEV4cGVjdGVkIHRvIHRocm93IGFuIGVycm9yOlxuLy8gYXNzZXJ0LnRocm93cyhibG9jaywgRXJyb3Jfb3B0LCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC50aHJvd3MgPSBmdW5jdGlvbihibG9jaywgLypvcHRpb25hbCovZXJyb3IsIC8qb3B0aW9uYWwqL21lc3NhZ2UpIHtcbiAgX3Rocm93cy5hcHBseSh0aGlzLCBbdHJ1ZV0uY29uY2F0KHBTbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbn07XG5cbi8vIEVYVEVOU0lPTiEgVGhpcyBpcyBhbm5veWluZyB0byB3cml0ZSBvdXRzaWRlIHRoaXMgbW9kdWxlLlxuYXNzZXJ0LmRvZXNOb3RUaHJvdyA9IGZ1bmN0aW9uKGJsb2NrLCAvKm9wdGlvbmFsKi9lcnJvciwgLypvcHRpb25hbCovbWVzc2FnZSkge1xuICBfdGhyb3dzLmFwcGx5KHRoaXMsIFtmYWxzZV0uY29uY2F0KHBTbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbn07XG5cbmFzc2VydC5pZkVycm9yID0gZnVuY3Rpb24oZXJyKSB7IGlmIChlcnIpIHt0aHJvdyBlcnI7fX07XG5cbn0se1widXRpbFwiOjIsXCJidWZmZXJcIjozfV0sMjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG52YXIgZXZlbnRzID0gcmVxdWlyZSgnZXZlbnRzJyk7XG5cbmV4cG9ydHMuaXNBcnJheSA9IGlzQXJyYXk7XG5leHBvcnRzLmlzRGF0ZSA9IGZ1bmN0aW9uKG9iail7cmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBEYXRlXSd9O1xuZXhwb3J0cy5pc1JlZ0V4cCA9IGZ1bmN0aW9uKG9iail7cmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBSZWdFeHBdJ307XG5cblxuZXhwb3J0cy5wcmludCA9IGZ1bmN0aW9uICgpIHt9O1xuZXhwb3J0cy5wdXRzID0gZnVuY3Rpb24gKCkge307XG5leHBvcnRzLmRlYnVnID0gZnVuY3Rpb24oKSB7fTtcblxuZXhwb3J0cy5pbnNwZWN0ID0gZnVuY3Rpb24ob2JqLCBzaG93SGlkZGVuLCBkZXB0aCwgY29sb3JzKSB7XG4gIHZhciBzZWVuID0gW107XG5cbiAgdmFyIHN0eWxpemUgPSBmdW5jdGlvbihzdHIsIHN0eWxlVHlwZSkge1xuICAgIC8vIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQU5TSV9lc2NhcGVfY29kZSNncmFwaGljc1xuICAgIHZhciBzdHlsZXMgPVxuICAgICAgICB7ICdib2xkJyA6IFsxLCAyMl0sXG4gICAgICAgICAgJ2l0YWxpYycgOiBbMywgMjNdLFxuICAgICAgICAgICd1bmRlcmxpbmUnIDogWzQsIDI0XSxcbiAgICAgICAgICAnaW52ZXJzZScgOiBbNywgMjddLFxuICAgICAgICAgICd3aGl0ZScgOiBbMzcsIDM5XSxcbiAgICAgICAgICAnZ3JleScgOiBbOTAsIDM5XSxcbiAgICAgICAgICAnYmxhY2snIDogWzMwLCAzOV0sXG4gICAgICAgICAgJ2JsdWUnIDogWzM0LCAzOV0sXG4gICAgICAgICAgJ2N5YW4nIDogWzM2LCAzOV0sXG4gICAgICAgICAgJ2dyZWVuJyA6IFszMiwgMzldLFxuICAgICAgICAgICdtYWdlbnRhJyA6IFszNSwgMzldLFxuICAgICAgICAgICdyZWQnIDogWzMxLCAzOV0sXG4gICAgICAgICAgJ3llbGxvdycgOiBbMzMsIDM5XSB9O1xuXG4gICAgdmFyIHN0eWxlID1cbiAgICAgICAgeyAnc3BlY2lhbCc6ICdjeWFuJyxcbiAgICAgICAgICAnbnVtYmVyJzogJ2JsdWUnLFxuICAgICAgICAgICdib29sZWFuJzogJ3llbGxvdycsXG4gICAgICAgICAgJ3VuZGVmaW5lZCc6ICdncmV5JyxcbiAgICAgICAgICAnbnVsbCc6ICdib2xkJyxcbiAgICAgICAgICAnc3RyaW5nJzogJ2dyZWVuJyxcbiAgICAgICAgICAnZGF0ZSc6ICdtYWdlbnRhJyxcbiAgICAgICAgICAvLyBcIm5hbWVcIjogaW50ZW50aW9uYWxseSBub3Qgc3R5bGluZ1xuICAgICAgICAgICdyZWdleHAnOiAncmVkJyB9W3N0eWxlVHlwZV07XG5cbiAgICBpZiAoc3R5bGUpIHtcbiAgICAgIHJldHVybiAnXFwwMzNbJyArIHN0eWxlc1tzdHlsZV1bMF0gKyAnbScgKyBzdHIgK1xuICAgICAgICAgICAgICdcXDAzM1snICsgc3R5bGVzW3N0eWxlXVsxXSArICdtJztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG4gIH07XG4gIGlmICghIGNvbG9ycykge1xuICAgIHN0eWxpemUgPSBmdW5jdGlvbihzdHIsIHN0eWxlVHlwZSkgeyByZXR1cm4gc3RyOyB9O1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0KHZhbHVlLCByZWN1cnNlVGltZXMpIHtcbiAgICAvLyBQcm92aWRlIGEgaG9vayBmb3IgdXNlci1zcGVjaWZpZWQgaW5zcGVjdCBmdW5jdGlvbnMuXG4gICAgLy8gQ2hlY2sgdGhhdCB2YWx1ZSBpcyBhbiBvYmplY3Qgd2l0aCBhbiBpbnNwZWN0IGZ1bmN0aW9uIG9uIGl0XG4gICAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZS5pbnNwZWN0ID09PSAnZnVuY3Rpb24nICYmXG4gICAgICAgIC8vIEZpbHRlciBvdXQgdGhlIHV0aWwgbW9kdWxlLCBpdCdzIGluc3BlY3QgZnVuY3Rpb24gaXMgc3BlY2lhbFxuICAgICAgICB2YWx1ZSAhPT0gZXhwb3J0cyAmJlxuICAgICAgICAvLyBBbHNvIGZpbHRlciBvdXQgYW55IHByb3RvdHlwZSBvYmplY3RzIHVzaW5nIHRoZSBjaXJjdWxhciBjaGVjay5cbiAgICAgICAgISh2YWx1ZS5jb25zdHJ1Y3RvciAmJiB2YWx1ZS5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgPT09IHZhbHVlKSkge1xuICAgICAgcmV0dXJuIHZhbHVlLmluc3BlY3QocmVjdXJzZVRpbWVzKTtcbiAgICB9XG5cbiAgICAvLyBQcmltaXRpdmUgdHlwZXMgY2Fubm90IGhhdmUgcHJvcGVydGllc1xuICAgIHN3aXRjaCAodHlwZW9mIHZhbHVlKSB7XG4gICAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgICAgICByZXR1cm4gc3R5bGl6ZSgndW5kZWZpbmVkJywgJ3VuZGVmaW5lZCcpO1xuXG4gICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICB2YXIgc2ltcGxlID0gJ1xcJycgKyBKU09OLnN0cmluZ2lmeSh2YWx1ZSkucmVwbGFjZSgvXlwifFwiJC9nLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKSArICdcXCcnO1xuICAgICAgICByZXR1cm4gc3R5bGl6ZShzaW1wbGUsICdzdHJpbmcnKTtcblxuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgcmV0dXJuIHN0eWxpemUoJycgKyB2YWx1ZSwgJ251bWJlcicpO1xuXG4gICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgcmV0dXJuIHN0eWxpemUoJycgKyB2YWx1ZSwgJ2Jvb2xlYW4nKTtcbiAgICB9XG4gICAgLy8gRm9yIHNvbWUgcmVhc29uIHR5cGVvZiBudWxsIGlzIFwib2JqZWN0XCIsIHNvIHNwZWNpYWwgY2FzZSBoZXJlLlxuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHN0eWxpemUoJ251bGwnLCAnbnVsbCcpO1xuICAgIH1cblxuICAgIC8vIExvb2sgdXAgdGhlIGtleXMgb2YgdGhlIG9iamVjdC5cbiAgICB2YXIgdmlzaWJsZV9rZXlzID0gT2JqZWN0X2tleXModmFsdWUpO1xuICAgIHZhciBrZXlzID0gc2hvd0hpZGRlbiA/IE9iamVjdF9nZXRPd25Qcm9wZXJ0eU5hbWVzKHZhbHVlKSA6IHZpc2libGVfa2V5cztcblxuICAgIC8vIEZ1bmN0aW9ucyB3aXRob3V0IHByb3BlcnRpZXMgY2FuIGJlIHNob3J0Y3V0dGVkLlxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicgJiYga2V5cy5sZW5ndGggPT09IDApIHtcbiAgICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHN0eWxpemUoJycgKyB2YWx1ZSwgJ3JlZ2V4cCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIG5hbWUgPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICAgICAgcmV0dXJuIHN0eWxpemUoJ1tGdW5jdGlvbicgKyBuYW1lICsgJ10nLCAnc3BlY2lhbCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIERhdGVzIHdpdGhvdXQgcHJvcGVydGllcyBjYW4gYmUgc2hvcnRjdXR0ZWRcbiAgICBpZiAoaXNEYXRlKHZhbHVlKSAmJiBrZXlzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHN0eWxpemUodmFsdWUudG9VVENTdHJpbmcoKSwgJ2RhdGUnKTtcbiAgICB9XG5cbiAgICB2YXIgYmFzZSwgdHlwZSwgYnJhY2VzO1xuICAgIC8vIERldGVybWluZSB0aGUgb2JqZWN0IHR5cGVcbiAgICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIHR5cGUgPSAnQXJyYXknO1xuICAgICAgYnJhY2VzID0gWydbJywgJ10nXTtcbiAgICB9IGVsc2Uge1xuICAgICAgdHlwZSA9ICdPYmplY3QnO1xuICAgICAgYnJhY2VzID0gWyd7JywgJ30nXTtcbiAgICB9XG5cbiAgICAvLyBNYWtlIGZ1bmN0aW9ucyBzYXkgdGhhdCB0aGV5IGFyZSBmdW5jdGlvbnNcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB2YXIgbiA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgICAgYmFzZSA9IChpc1JlZ0V4cCh2YWx1ZSkpID8gJyAnICsgdmFsdWUgOiAnIFtGdW5jdGlvbicgKyBuICsgJ10nO1xuICAgIH0gZWxzZSB7XG4gICAgICBiYXNlID0gJyc7XG4gICAgfVxuXG4gICAgLy8gTWFrZSBkYXRlcyB3aXRoIHByb3BlcnRpZXMgZmlyc3Qgc2F5IHRoZSBkYXRlXG4gICAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgIGJhc2UgPSAnICcgKyB2YWx1ZS50b1VUQ1N0cmluZygpO1xuICAgIH1cblxuICAgIGlmIChrZXlzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyBicmFjZXNbMV07XG4gICAgfVxuXG4gICAgaWYgKHJlY3Vyc2VUaW1lcyA8IDApIHtcbiAgICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHN0eWxpemUoJycgKyB2YWx1ZSwgJ3JlZ2V4cCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHN0eWxpemUoJ1tPYmplY3RdJywgJ3NwZWNpYWwnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZWVuLnB1c2godmFsdWUpO1xuXG4gICAgdmFyIG91dHB1dCA9IGtleXMubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgdmFyIG5hbWUsIHN0cjtcbiAgICAgIGlmICh2YWx1ZS5fX2xvb2t1cEdldHRlcl9fKSB7XG4gICAgICAgIGlmICh2YWx1ZS5fX2xvb2t1cEdldHRlcl9fKGtleSkpIHtcbiAgICAgICAgICBpZiAodmFsdWUuX19sb29rdXBTZXR0ZXJfXyhrZXkpKSB7XG4gICAgICAgICAgICBzdHIgPSBzdHlsaXplKCdbR2V0dGVyL1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdHIgPSBzdHlsaXplKCdbR2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh2YWx1ZS5fX2xvb2t1cFNldHRlcl9fKGtleSkpIHtcbiAgICAgICAgICAgIHN0ciA9IHN0eWxpemUoJ1tTZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh2aXNpYmxlX2tleXMuaW5kZXhPZihrZXkpIDwgMCkge1xuICAgICAgICBuYW1lID0gJ1snICsga2V5ICsgJ10nO1xuICAgICAgfVxuICAgICAgaWYgKCFzdHIpIHtcbiAgICAgICAgaWYgKHNlZW4uaW5kZXhPZih2YWx1ZVtrZXldKSA8IDApIHtcbiAgICAgICAgICBpZiAocmVjdXJzZVRpbWVzID09PSBudWxsKSB7XG4gICAgICAgICAgICBzdHIgPSBmb3JtYXQodmFsdWVba2V5XSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0ciA9IGZvcm1hdCh2YWx1ZVtrZXldLCByZWN1cnNlVGltZXMgLSAxKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHN0ci5pbmRleE9mKCdcXG4nKSA+IC0xKSB7XG4gICAgICAgICAgICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgc3RyID0gc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnICAnICsgbGluZTtcbiAgICAgICAgICAgICAgfSkuam9pbignXFxuJykuc3Vic3RyKDIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc3RyID0gJ1xcbicgKyBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICcgICAnICsgbGluZTtcbiAgICAgICAgICAgICAgfSkuam9pbignXFxuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0ciA9IHN0eWxpemUoJ1tDaXJjdWxhcl0nLCAnc3BlY2lhbCcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIG5hbWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGlmICh0eXBlID09PSAnQXJyYXknICYmIGtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgICAgICByZXR1cm4gc3RyO1xuICAgICAgICB9XG4gICAgICAgIG5hbWUgPSBKU09OLnN0cmluZ2lmeSgnJyArIGtleSk7XG4gICAgICAgIGlmIChuYW1lLm1hdGNoKC9eXCIoW2EtekEtWl9dW2EtekEtWl8wLTldKilcIiQvKSkge1xuICAgICAgICAgIG5hbWUgPSBuYW1lLnN1YnN0cigxLCBuYW1lLmxlbmd0aCAtIDIpO1xuICAgICAgICAgIG5hbWUgPSBzdHlsaXplKG5hbWUsICduYW1lJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpXG4gICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvKF5cInxcIiQpL2csIFwiJ1wiKTtcbiAgICAgICAgICBuYW1lID0gc3R5bGl6ZShuYW1lLCAnc3RyaW5nJyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5hbWUgKyAnOiAnICsgc3RyO1xuICAgIH0pO1xuXG4gICAgc2Vlbi5wb3AoKTtcblxuICAgIHZhciBudW1MaW5lc0VzdCA9IDA7XG4gICAgdmFyIGxlbmd0aCA9IG91dHB1dC5yZWR1Y2UoZnVuY3Rpb24ocHJldiwgY3VyKSB7XG4gICAgICBudW1MaW5lc0VzdCsrO1xuICAgICAgaWYgKGN1ci5pbmRleE9mKCdcXG4nKSA+PSAwKSBudW1MaW5lc0VzdCsrO1xuICAgICAgcmV0dXJuIHByZXYgKyBjdXIubGVuZ3RoICsgMTtcbiAgICB9LCAwKTtcblxuICAgIGlmIChsZW5ndGggPiA1MCkge1xuICAgICAgb3V0cHV0ID0gYnJhY2VzWzBdICtcbiAgICAgICAgICAgICAgIChiYXNlID09PSAnJyA/ICcnIDogYmFzZSArICdcXG4gJykgK1xuICAgICAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgICAgIG91dHB1dC5qb2luKCcsXFxuICAnKSArXG4gICAgICAgICAgICAgICAnICcgK1xuICAgICAgICAgICAgICAgYnJhY2VzWzFdO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIG91dHB1dCA9IGJyYWNlc1swXSArIGJhc2UgKyAnICcgKyBvdXRwdXQuam9pbignLCAnKSArICcgJyArIGJyYWNlc1sxXTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9XG4gIHJldHVybiBmb3JtYXQob2JqLCAodHlwZW9mIGRlcHRoID09PSAndW5kZWZpbmVkJyA/IDIgOiBkZXB0aCkpO1xufTtcblxuXG5mdW5jdGlvbiBpc0FycmF5KGFyKSB7XG4gIHJldHVybiBhciBpbnN0YW5jZW9mIEFycmF5IHx8XG4gICAgICAgICBBcnJheS5pc0FycmF5KGFyKSB8fFxuICAgICAgICAgKGFyICYmIGFyICE9PSBPYmplY3QucHJvdG90eXBlICYmIGlzQXJyYXkoYXIuX19wcm90b19fKSk7XG59XG5cblxuZnVuY3Rpb24gaXNSZWdFeHAocmUpIHtcbiAgcmV0dXJuIHJlIGluc3RhbmNlb2YgUmVnRXhwIHx8XG4gICAgKHR5cGVvZiByZSA9PT0gJ29iamVjdCcgJiYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHJlKSA9PT0gJ1tvYmplY3QgUmVnRXhwXScpO1xufVxuXG5cbmZ1bmN0aW9uIGlzRGF0ZShkKSB7XG4gIGlmIChkIGluc3RhbmNlb2YgRGF0ZSkgcmV0dXJuIHRydWU7XG4gIGlmICh0eXBlb2YgZCAhPT0gJ29iamVjdCcpIHJldHVybiBmYWxzZTtcbiAgdmFyIHByb3BlcnRpZXMgPSBEYXRlLnByb3RvdHlwZSAmJiBPYmplY3RfZ2V0T3duUHJvcGVydHlOYW1lcyhEYXRlLnByb3RvdHlwZSk7XG4gIHZhciBwcm90byA9IGQuX19wcm90b19fICYmIE9iamVjdF9nZXRPd25Qcm9wZXJ0eU5hbWVzKGQuX19wcm90b19fKTtcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHByb3RvKSA9PT0gSlNPTi5zdHJpbmdpZnkocHJvcGVydGllcyk7XG59XG5cbmZ1bmN0aW9uIHBhZChuKSB7XG4gIHJldHVybiBuIDwgMTAgPyAnMCcgKyBuLnRvU3RyaW5nKDEwKSA6IG4udG9TdHJpbmcoMTApO1xufVxuXG52YXIgbW9udGhzID0gWydKYW4nLCAnRmViJywgJ01hcicsICdBcHInLCAnTWF5JywgJ0p1bicsICdKdWwnLCAnQXVnJywgJ1NlcCcsXG4gICAgICAgICAgICAgICdPY3QnLCAnTm92JywgJ0RlYyddO1xuXG4vLyAyNiBGZWIgMTY6MTk6MzRcbmZ1bmN0aW9uIHRpbWVzdGFtcCgpIHtcbiAgdmFyIGQgPSBuZXcgRGF0ZSgpO1xuICB2YXIgdGltZSA9IFtwYWQoZC5nZXRIb3VycygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0TWludXRlcygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0U2Vjb25kcygpKV0uam9pbignOicpO1xuICByZXR1cm4gW2QuZ2V0RGF0ZSgpLCBtb250aHNbZC5nZXRNb250aCgpXSwgdGltZV0uam9pbignICcpO1xufVxuXG5leHBvcnRzLmxvZyA9IGZ1bmN0aW9uIChtc2cpIHt9O1xuXG5leHBvcnRzLnB1bXAgPSBudWxsO1xuXG52YXIgT2JqZWN0X2tleXMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiAob2JqKSB7XG4gICAgdmFyIHJlcyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHJlcy5wdXNoKGtleSk7XG4gICAgcmV0dXJuIHJlcztcbn07XG5cbnZhciBPYmplY3RfZ2V0T3duUHJvcGVydHlOYW1lcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzIHx8IGZ1bmN0aW9uIChvYmopIHtcbiAgICB2YXIgcmVzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgICBpZiAoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSByZXMucHVzaChrZXkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xufTtcblxudmFyIE9iamVjdF9jcmVhdGUgPSBPYmplY3QuY3JlYXRlIHx8IGZ1bmN0aW9uIChwcm90b3R5cGUsIHByb3BlcnRpZXMpIHtcbiAgICAvLyBmcm9tIGVzNS1zaGltXG4gICAgdmFyIG9iamVjdDtcbiAgICBpZiAocHJvdG90eXBlID09PSBudWxsKSB7XG4gICAgICAgIG9iamVjdCA9IHsgJ19fcHJvdG9fXycgOiBudWxsIH07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBpZiAodHlwZW9mIHByb3RvdHlwZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgICAgICAgJ3R5cGVvZiBwcm90b3R5cGVbJyArICh0eXBlb2YgcHJvdG90eXBlKSArICddICE9IFxcJ29iamVjdFxcJydcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIFR5cGUgPSBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgVHlwZS5wcm90b3R5cGUgPSBwcm90b3R5cGU7XG4gICAgICAgIG9iamVjdCA9IG5ldyBUeXBlKCk7XG4gICAgICAgIG9iamVjdC5fX3Byb3RvX18gPSBwcm90b3R5cGU7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ3VuZGVmaW5lZCcgJiYgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMob2JqZWN0LCBwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbn07XG5cbmV4cG9ydHMuaW5oZXJpdHMgPSBmdW5jdGlvbihjdG9yLCBzdXBlckN0b3IpIHtcbiAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3I7XG4gIGN0b3IucHJvdG90eXBlID0gT2JqZWN0X2NyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XG4gICAgY29uc3RydWN0b3I6IHtcbiAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH1cbiAgfSk7XG59O1xuXG52YXIgZm9ybWF0UmVnRXhwID0gLyVbc2RqJV0vZztcbmV4cG9ydHMuZm9ybWF0ID0gZnVuY3Rpb24oZikge1xuICBpZiAodHlwZW9mIGYgIT09ICdzdHJpbmcnKSB7XG4gICAgdmFyIG9iamVjdHMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgb2JqZWN0cy5wdXNoKGV4cG9ydHMuaW5zcGVjdChhcmd1bWVudHNbaV0pKTtcbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdHMuam9pbignICcpO1xuICB9XG5cbiAgdmFyIGkgPSAxO1xuICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgdmFyIGxlbiA9IGFyZ3MubGVuZ3RoO1xuICB2YXIgc3RyID0gU3RyaW5nKGYpLnJlcGxhY2UoZm9ybWF0UmVnRXhwLCBmdW5jdGlvbih4KSB7XG4gICAgaWYgKHggPT09ICclJScpIHJldHVybiAnJSc7XG4gICAgaWYgKGkgPj0gbGVuKSByZXR1cm4geDtcbiAgICBzd2l0Y2ggKHgpIHtcbiAgICAgIGNhc2UgJyVzJzogcmV0dXJuIFN0cmluZyhhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWQnOiByZXR1cm4gTnVtYmVyKGFyZ3NbaSsrXSk7XG4gICAgICBjYXNlICclaic6IHJldHVybiBKU09OLnN0cmluZ2lmeShhcmdzW2krK10pO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgfVxuICB9KTtcbiAgZm9yKHZhciB4ID0gYXJnc1tpXTsgaSA8IGxlbjsgeCA9IGFyZ3NbKytpXSl7XG4gICAgaWYgKHggPT09IG51bGwgfHwgdHlwZW9mIHggIT09ICdvYmplY3QnKSB7XG4gICAgICBzdHIgKz0gJyAnICsgeDtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyICs9ICcgJyArIGV4cG9ydHMuaW5zcGVjdCh4KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHN0cjtcbn07XG5cbn0se1wiZXZlbnRzXCI6NH1dLDU6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuZXhwb3J0cy5yZWFkSUVFRTc1NCA9IGZ1bmN0aW9uKGJ1ZmZlciwgb2Zmc2V0LCBpc0JFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sXG4gICAgICBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxLFxuICAgICAgZU1heCA9ICgxIDw8IGVMZW4pIC0gMSxcbiAgICAgIGVCaWFzID0gZU1heCA+PiAxLFxuICAgICAgbkJpdHMgPSAtNyxcbiAgICAgIGkgPSBpc0JFID8gMCA6IChuQnl0ZXMgLSAxKSxcbiAgICAgIGQgPSBpc0JFID8gMSA6IC0xLFxuICAgICAgcyA9IGJ1ZmZlcltvZmZzZXQgKyBpXTtcblxuICBpICs9IGQ7XG5cbiAgZSA9IHMgJiAoKDEgPDwgKC1uQml0cykpIC0gMSk7XG4gIHMgPj49ICgtbkJpdHMpO1xuICBuQml0cyArPSBlTGVuO1xuICBmb3IgKDsgbkJpdHMgPiAwOyBlID0gZSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KTtcblxuICBtID0gZSAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKTtcbiAgZSA+Pj0gKC1uQml0cyk7XG4gIG5CaXRzICs9IG1MZW47XG4gIGZvciAoOyBuQml0cyA+IDA7IG0gPSBtICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpO1xuXG4gIGlmIChlID09PSAwKSB7XG4gICAgZSA9IDEgLSBlQmlhcztcbiAgfSBlbHNlIGlmIChlID09PSBlTWF4KSB7XG4gICAgcmV0dXJuIG0gPyBOYU4gOiAoKHMgPyAtMSA6IDEpICogSW5maW5pdHkpO1xuICB9IGVsc2Uge1xuICAgIG0gPSBtICsgTWF0aC5wb3coMiwgbUxlbik7XG4gICAgZSA9IGUgLSBlQmlhcztcbiAgfVxuICByZXR1cm4gKHMgPyAtMSA6IDEpICogbSAqIE1hdGgucG93KDIsIGUgLSBtTGVuKTtcbn07XG5cbmV4cG9ydHMud3JpdGVJRUVFNzU0ID0gZnVuY3Rpb24oYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0JFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sIGMsXG4gICAgICBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxLFxuICAgICAgZU1heCA9ICgxIDw8IGVMZW4pIC0gMSxcbiAgICAgIGVCaWFzID0gZU1heCA+PiAxLFxuICAgICAgcnQgPSAobUxlbiA9PT0gMjMgPyBNYXRoLnBvdygyLCAtMjQpIC0gTWF0aC5wb3coMiwgLTc3KSA6IDApLFxuICAgICAgaSA9IGlzQkUgPyAobkJ5dGVzIC0gMSkgOiAwLFxuICAgICAgZCA9IGlzQkUgPyAtMSA6IDEsXG4gICAgICBzID0gdmFsdWUgPCAwIHx8ICh2YWx1ZSA9PT0gMCAmJiAxIC8gdmFsdWUgPCAwKSA/IDEgOiAwO1xuXG4gIHZhbHVlID0gTWF0aC5hYnModmFsdWUpO1xuXG4gIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IEluZmluaXR5KSB7XG4gICAgbSA9IGlzTmFOKHZhbHVlKSA/IDEgOiAwO1xuICAgIGUgPSBlTWF4O1xuICB9IGVsc2Uge1xuICAgIGUgPSBNYXRoLmZsb29yKE1hdGgubG9nKHZhbHVlKSAvIE1hdGguTE4yKTtcbiAgICBpZiAodmFsdWUgKiAoYyA9IE1hdGgucG93KDIsIC1lKSkgPCAxKSB7XG4gICAgICBlLS07XG4gICAgICBjICo9IDI7XG4gICAgfVxuICAgIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgdmFsdWUgKz0gcnQgLyBjO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSArPSBydCAqIE1hdGgucG93KDIsIDEgLSBlQmlhcyk7XG4gICAgfVxuICAgIGlmICh2YWx1ZSAqIGMgPj0gMikge1xuICAgICAgZSsrO1xuICAgICAgYyAvPSAyO1xuICAgIH1cblxuICAgIGlmIChlICsgZUJpYXMgPj0gZU1heCkge1xuICAgICAgbSA9IDA7XG4gICAgICBlID0gZU1heDtcbiAgICB9IGVsc2UgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICBtID0gKHZhbHVlICogYyAtIDEpICogTWF0aC5wb3coMiwgbUxlbik7XG4gICAgICBlID0gZSArIGVCaWFzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gdmFsdWUgKiBNYXRoLnBvdygyLCBlQmlhcyAtIDEpICogTWF0aC5wb3coMiwgbUxlbik7XG4gICAgICBlID0gMDtcbiAgICB9XG4gIH1cblxuICBmb3IgKDsgbUxlbiA+PSA4OyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBtICYgMHhmZiwgaSArPSBkLCBtIC89IDI1NiwgbUxlbiAtPSA4KTtcblxuICBlID0gKGUgPDwgbUxlbikgfCBtO1xuICBlTGVuICs9IG1MZW47XG4gIGZvciAoOyBlTGVuID4gMDsgYnVmZmVyW29mZnNldCArIGldID0gZSAmIDB4ZmYsIGkgKz0gZCwgZSAvPSAyNTYsIGVMZW4gLT0gOCk7XG5cbiAgYnVmZmVyW29mZnNldCArIGkgLSBkXSB8PSBzICogMTI4O1xufTtcblxufSx7fV0sNjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4vLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5wcm9jZXNzLm5leHRUaWNrID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2FuU2V0SW1tZWRpYXRlID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cuc2V0SW1tZWRpYXRlO1xuICAgIHZhciBjYW5Qb3N0ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cucG9zdE1lc3NhZ2UgJiYgd2luZG93LmFkZEV2ZW50TGlzdGVuZXJcbiAgICA7XG5cbiAgICBpZiAoY2FuU2V0SW1tZWRpYXRlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gd2luZG93LnNldEltbWVkaWF0ZShmKSB9O1xuICAgIH1cblxuICAgIGlmIChjYW5Qb3N0KSB7XG4gICAgICAgIHZhciBxdWV1ZSA9IFtdO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgaWYgKGV2LnNvdXJjZSA9PT0gd2luZG93ICYmIGV2LmRhdGEgPT09ICdwcm9jZXNzLXRpY2snKSB7XG4gICAgICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgaWYgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZuID0gcXVldWUuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRydWUpO1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICAgICAgcXVldWUucHVzaChmbik7XG4gICAgICAgICAgICB3aW5kb3cucG9zdE1lc3NhZ2UoJ3Byb2Nlc3MtdGljaycsICcqJyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZm4sIDApO1xuICAgIH07XG59KSgpO1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxufSx7fV0sNDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4oZnVuY3Rpb24ocHJvY2Vzcyl7aWYgKCFwcm9jZXNzLkV2ZW50RW1pdHRlcikgcHJvY2Vzcy5FdmVudEVtaXR0ZXIgPSBmdW5jdGlvbiAoKSB7fTtcblxudmFyIEV2ZW50RW1pdHRlciA9IGV4cG9ydHMuRXZlbnRFbWl0dGVyID0gcHJvY2Vzcy5FdmVudEVtaXR0ZXI7XG52YXIgaXNBcnJheSA9IHR5cGVvZiBBcnJheS5pc0FycmF5ID09PSAnZnVuY3Rpb24nXG4gICAgPyBBcnJheS5pc0FycmF5XG4gICAgOiBmdW5jdGlvbiAoeHMpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4cykgPT09ICdbb2JqZWN0IEFycmF5XSdcbiAgICB9XG47XG5mdW5jdGlvbiBpbmRleE9mICh4cywgeCkge1xuICAgIGlmICh4cy5pbmRleE9mKSByZXR1cm4geHMuaW5kZXhPZih4KTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHhzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh4ID09PSB4c1tpXSkgcmV0dXJuIGk7XG4gICAgfVxuICAgIHJldHVybiAtMTtcbn1cblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhblxuLy8gMTAgbGlzdGVuZXJzIGFyZSBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoXG4vLyBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbi8vXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxudmFyIGRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIXRoaXMuX2V2ZW50cykgdGhpcy5fZXZlbnRzID0ge307XG4gIHRoaXMuX2V2ZW50cy5tYXhMaXN0ZW5lcnMgPSBuO1xufTtcblxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc0FycmF5KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKVxuICAgIHtcbiAgICAgIGlmIChhcmd1bWVudHNbMV0gaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBhcmd1bWVudHNbMV07IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmNhdWdodCwgdW5zcGVjaWZpZWQgJ2Vycm9yJyBldmVudC5cIik7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpIHJldHVybiBmYWxzZTtcbiAgdmFyIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGlmICghaGFuZGxlcikgcmV0dXJuIGZhbHNlO1xuXG4gIGlmICh0eXBlb2YgaGFuZGxlciA9PSAnZnVuY3Rpb24nKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG5cbiAgfSBlbHNlIGlmIChpc0FycmF5KGhhbmRsZXIpKSB7XG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gICAgdmFyIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGxpc3RlbmVycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG5cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG5cbi8vIEV2ZW50RW1pdHRlciBpcyBkZWZpbmVkIGluIHNyYy9ub2RlX2V2ZW50cy5jY1xuLy8gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0KCkgaXMgYWxzbyBkZWZpbmVkIHRoZXJlLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICgnZnVuY3Rpb24nICE9PSB0eXBlb2YgbGlzdGVuZXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2FkZExpc3RlbmVyIG9ubHkgdGFrZXMgaW5zdGFuY2VzIG9mIEZ1bmN0aW9uJyk7XG4gIH1cblxuICBpZiAoIXRoaXMuX2V2ZW50cykgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PSBcIm5ld0xpc3RlbmVyc1wiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lcnNcIi5cbiAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSkge1xuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICB9IGVsc2UgaWYgKGlzQXJyYXkodGhpcy5fZXZlbnRzW3R5cGVdKSkge1xuXG4gICAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICAgIHZhciBtO1xuICAgICAgaWYgKHRoaXMuX2V2ZW50cy5tYXhMaXN0ZW5lcnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBtID0gdGhpcy5fZXZlbnRzLm1heExpc3RlbmVycztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG0gPSBkZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgICAgfVxuXG4gICAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICB9IGVsc2Uge1xuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgc2VsZi5vbih0eXBlLCBmdW5jdGlvbiBnKCkge1xuICAgIHNlbGYucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG4gICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCdmdW5jdGlvbicgIT09IHR5cGVvZiBsaXN0ZW5lcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncmVtb3ZlTGlzdGVuZXIgb25seSB0YWtlcyBpbnN0YW5jZXMgb2YgRnVuY3Rpb24nKTtcbiAgfVxuXG4gIC8vIGRvZXMgbm90IHVzZSBsaXN0ZW5lcnMoKSwgc28gbm8gc2lkZSBlZmZlY3Qgb2YgY3JlYXRpbmcgX2V2ZW50c1t0eXBlXVxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKSByZXR1cm4gdGhpcztcblxuICB2YXIgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNBcnJheShsaXN0KSkge1xuICAgIHZhciBpID0gaW5kZXhPZihsaXN0LCBsaXN0ZW5lcik7XG4gICAgaWYgKGkgPCAwKSByZXR1cm4gdGhpcztcbiAgICBsaXN0LnNwbGljZShpLCAxKTtcbiAgICBpZiAobGlzdC5sZW5ndGggPT0gMClcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIH0gZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdID09PSBsaXN0ZW5lcikge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZG9lcyBub3QgdXNlIGxpc3RlbmVycygpLCBzbyBubyBzaWRlIGVmZmVjdCBvZiBjcmVhdGluZyBfZXZlbnRzW3R5cGVdXG4gIGlmICh0eXBlICYmIHRoaXMuX2V2ZW50cyAmJiB0aGlzLl9ldmVudHNbdHlwZV0pIHRoaXMuX2V2ZW50c1t0eXBlXSA9IG51bGw7XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIGlmICghdGhpcy5fZXZlbnRzKSB0aGlzLl9ldmVudHMgPSB7fTtcbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFtdO1xuICBpZiAoIWlzQXJyYXkodGhpcy5fZXZlbnRzW3R5cGVdKSkge1xuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICB9XG4gIHJldHVybiB0aGlzLl9ldmVudHNbdHlwZV07XG59O1xuXG59KShyZXF1aXJlKFwiX19icm93c2VyaWZ5X3Byb2Nlc3NcIikpXG59LHtcIl9fYnJvd3NlcmlmeV9wcm9jZXNzXCI6Nn1dLFwiYnVmZmVyLWJyb3dzZXJpZnlcIjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5tb2R1bGUuZXhwb3J0cz1yZXF1aXJlKCdxOVR4Q0MnKTtcbn0se31dLFwicTlUeENDXCI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuZnVuY3Rpb24gU2xvd0J1ZmZlciAoc2l6ZSkge1xuICAgIHRoaXMubGVuZ3RoID0gc2l6ZTtcbn07XG5cbnZhciBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQnKTtcblxuZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUyA9IDUwO1xuXG5cbmZ1bmN0aW9uIHRvSGV4KG4pIHtcbiAgaWYgKG4gPCAxNikgcmV0dXJuICcwJyArIG4udG9TdHJpbmcoMTYpO1xuICByZXR1cm4gbi50b1N0cmluZygxNik7XG59XG5cbmZ1bmN0aW9uIHV0ZjhUb0J5dGVzKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKVxuICAgIGlmIChzdHIuY2hhckNvZGVBdChpKSA8PSAweDdGKVxuICAgICAgYnl0ZUFycmF5LnB1c2goc3RyLmNoYXJDb2RlQXQoaSkpO1xuICAgIGVsc2Uge1xuICAgICAgdmFyIGggPSBlbmNvZGVVUklDb21wb25lbnQoc3RyLmNoYXJBdChpKSkuc3Vic3RyKDEpLnNwbGl0KCclJyk7XG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGgubGVuZ3RoOyBqKyspXG4gICAgICAgIGJ5dGVBcnJheS5wdXNoKHBhcnNlSW50KGhbal0sIDE2KSk7XG4gICAgfVxuXG4gIHJldHVybiBieXRlQXJyYXk7XG59XG5cbmZ1bmN0aW9uIGFzY2lpVG9CeXRlcyhzdHIpIHtcbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrIClcbiAgICAvLyBOb2RlJ3MgY29kZSBzZWVtcyB0byBiZSBkb2luZyB0aGlzIGFuZCBub3QgJiAweDdGLi5cbiAgICBieXRlQXJyYXkucHVzaCggc3RyLmNoYXJDb2RlQXQoaSkgJiAweEZGICk7XG5cbiAgcmV0dXJuIGJ5dGVBcnJheTtcbn1cblxuZnVuY3Rpb24gYmFzZTY0VG9CeXRlcyhzdHIpIHtcbiAgcmV0dXJuIHJlcXVpcmUoXCJiYXNlNjQtanNcIikudG9CeXRlQXJyYXkoc3RyKTtcbn1cblxuU2xvd0J1ZmZlci5ieXRlTGVuZ3RoID0gZnVuY3Rpb24gKHN0ciwgZW5jb2RpbmcpIHtcbiAgc3dpdGNoIChlbmNvZGluZyB8fCBcInV0ZjhcIikge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXR1cm4gc3RyLmxlbmd0aCAvIDI7XG5cbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXR1cm4gdXRmOFRvQnl0ZXMoc3RyKS5sZW5ndGg7XG5cbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldHVybiBzdHIubGVuZ3RoO1xuXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldHVybiBiYXNlNjRUb0J5dGVzKHN0cikubGVuZ3RoO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBibGl0QnVmZmVyKHNyYywgZHN0LCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgcG9zLCBpID0gMDtcbiAgd2hpbGUgKGkgPCBsZW5ndGgpIHtcbiAgICBpZiAoKGkrb2Zmc2V0ID49IGRzdC5sZW5ndGgpIHx8IChpID49IHNyYy5sZW5ndGgpKVxuICAgICAgYnJlYWs7XG5cbiAgICBkc3RbaSArIG9mZnNldF0gPSBzcmNbaV07XG4gICAgaSsrO1xuICB9XG4gIHJldHVybiBpO1xufVxuXG5TbG93QnVmZmVyLnByb3RvdHlwZS51dGY4V3JpdGUgPSBmdW5jdGlvbiAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgYnl0ZXMsIHBvcztcbiAgcmV0dXJuIFNsb3dCdWZmZXIuX2NoYXJzV3JpdHRlbiA9ICBibGl0QnVmZmVyKHV0ZjhUb0J5dGVzKHN0cmluZyksIHRoaXMsIG9mZnNldCwgbGVuZ3RoKTtcbn07XG5cblNsb3dCdWZmZXIucHJvdG90eXBlLmFzY2lpV3JpdGUgPSBmdW5jdGlvbiAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgYnl0ZXMsIHBvcztcbiAgcmV0dXJuIFNsb3dCdWZmZXIuX2NoYXJzV3JpdHRlbiA9ICBibGl0QnVmZmVyKGFzY2lpVG9CeXRlcyhzdHJpbmcpLCB0aGlzLCBvZmZzZXQsIGxlbmd0aCk7XG59O1xuXG5TbG93QnVmZmVyLnByb3RvdHlwZS5iaW5hcnlXcml0ZSA9IFNsb3dCdWZmZXIucHJvdG90eXBlLmFzY2lpV3JpdGU7XG5cblNsb3dCdWZmZXIucHJvdG90eXBlLmJhc2U2NFdyaXRlID0gZnVuY3Rpb24gKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGJ5dGVzLCBwb3M7XG4gIHJldHVybiBTbG93QnVmZmVyLl9jaGFyc1dyaXR0ZW4gPSBibGl0QnVmZmVyKGJhc2U2NFRvQnl0ZXMoc3RyaW5nKSwgdGhpcywgb2Zmc2V0LCBsZW5ndGgpO1xufTtcblxuU2xvd0J1ZmZlci5wcm90b3R5cGUuYmFzZTY0U2xpY2UgPSBmdW5jdGlvbiAoc3RhcnQsIGVuZCkge1xuICB2YXIgYnl0ZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICByZXR1cm4gcmVxdWlyZShcImJhc2U2NC1qc1wiKS5mcm9tQnl0ZUFycmF5KGJ5dGVzKTtcbn1cblxuZnVuY3Rpb24gZGVjb2RlVXRmOENoYXIoc3RyKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChzdHIpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSgweEZGRkQpOyAvLyBVVEYgOCBpbnZhbGlkIGNoYXJcbiAgfVxufVxuXG5TbG93QnVmZmVyLnByb3RvdHlwZS51dGY4U2xpY2UgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBieXRlcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB2YXIgcmVzID0gXCJcIjtcbiAgdmFyIHRtcCA9IFwiXCI7XG4gIHZhciBpID0gMDtcbiAgd2hpbGUgKGkgPCBieXRlcy5sZW5ndGgpIHtcbiAgICBpZiAoYnl0ZXNbaV0gPD0gMHg3Rikge1xuICAgICAgcmVzICs9IGRlY29kZVV0ZjhDaGFyKHRtcCkgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGVzW2ldKTtcbiAgICAgIHRtcCA9IFwiXCI7XG4gICAgfSBlbHNlXG4gICAgICB0bXAgKz0gXCIlXCIgKyBieXRlc1tpXS50b1N0cmluZygxNik7XG5cbiAgICBpKys7XG4gIH1cblxuICByZXR1cm4gcmVzICsgZGVjb2RlVXRmOENoYXIodG1wKTtcbn1cblxuU2xvd0J1ZmZlci5wcm90b3R5cGUuYXNjaWlTbGljZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGJ5dGVzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIHZhciByZXQgPSBcIlwiO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSsrKVxuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGVzW2ldKTtcbiAgcmV0dXJuIHJldDtcbn1cblxuU2xvd0J1ZmZlci5wcm90b3R5cGUuYmluYXJ5U2xpY2UgPSBTbG93QnVmZmVyLnByb3RvdHlwZS5hc2NpaVNsaWNlO1xuXG5TbG93QnVmZmVyLnByb3RvdHlwZS5pbnNwZWN0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBvdXQgPSBbXSxcbiAgICAgIGxlbiA9IHRoaXMubGVuZ3RoO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgb3V0W2ldID0gdG9IZXgodGhpc1tpXSk7XG4gICAgaWYgKGkgPT0gZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUykge1xuICAgICAgb3V0W2kgKyAxXSA9ICcuLi4nO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiAnPFNsb3dCdWZmZXIgJyArIG91dC5qb2luKCcgJykgKyAnPic7XG59O1xuXG5cblNsb3dCdWZmZXIucHJvdG90eXBlLmhleFNsaWNlID0gZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGg7XG5cbiAgaWYgKCFzdGFydCB8fCBzdGFydCA8IDApIHN0YXJ0ID0gMDtcbiAgaWYgKCFlbmQgfHwgZW5kIDwgMCB8fCBlbmQgPiBsZW4pIGVuZCA9IGxlbjtcblxuICB2YXIgb3V0ID0gJyc7XG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgb3V0ICs9IHRvSGV4KHRoaXNbaV0pO1xuICB9XG4gIHJldHVybiBvdXQ7XG59O1xuXG5cblNsb3dCdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oZW5jb2RpbmcsIHN0YXJ0LCBlbmQpIHtcbiAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcgfHwgJ3V0ZjgnKS50b0xvd2VyQ2FzZSgpO1xuICBzdGFydCA9ICtzdGFydCB8fCAwO1xuICBpZiAodHlwZW9mIGVuZCA9PSAndW5kZWZpbmVkJykgZW5kID0gdGhpcy5sZW5ndGg7XG5cbiAgLy8gRmFzdHBhdGggZW1wdHkgc3RyaW5nc1xuICBpZiAoK2VuZCA9PSBzdGFydCkge1xuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0dXJuIHRoaXMuaGV4U2xpY2Uoc3RhcnQsIGVuZCk7XG5cbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXR1cm4gdGhpcy51dGY4U2xpY2Uoc3RhcnQsIGVuZCk7XG5cbiAgICBjYXNlICdhc2NpaSc6XG4gICAgICByZXR1cm4gdGhpcy5hc2NpaVNsaWNlKHN0YXJ0LCBlbmQpO1xuXG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldHVybiB0aGlzLmJpbmFyeVNsaWNlKHN0YXJ0LCBlbmQpO1xuXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldHVybiB0aGlzLmJhc2U2NFNsaWNlKHN0YXJ0LCBlbmQpO1xuXG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgICAgcmV0dXJuIHRoaXMudWNzMlNsaWNlKHN0YXJ0LCBlbmQpO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpO1xuICB9XG59O1xuXG5cblNsb3dCdWZmZXIucHJvdG90eXBlLmhleFdyaXRlID0gZnVuY3Rpb24oc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICBvZmZzZXQgPSArb2Zmc2V0IHx8IDA7XG4gIHZhciByZW1haW5pbmcgPSB0aGlzLmxlbmd0aCAtIG9mZnNldDtcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmc7XG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gK2xlbmd0aDtcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmc7XG4gICAgfVxuICB9XG5cbiAgLy8gbXVzdCBiZSBhbiBldmVuIG51bWJlciBvZiBkaWdpdHNcbiAgdmFyIHN0ckxlbiA9IHN0cmluZy5sZW5ndGg7XG4gIGlmIChzdHJMZW4gJSAyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGhleCBzdHJpbmcnKTtcbiAgfVxuICBpZiAobGVuZ3RoID4gc3RyTGVuIC8gMikge1xuICAgIGxlbmd0aCA9IHN0ckxlbiAvIDI7XG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIHZhciBieXRlID0gcGFyc2VJbnQoc3RyaW5nLnN1YnN0cihpICogMiwgMiksIDE2KTtcbiAgICBpZiAoaXNOYU4oYnl0ZSkpIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBoZXggc3RyaW5nJyk7XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9IGJ5dGU7XG4gIH1cbiAgU2xvd0J1ZmZlci5fY2hhcnNXcml0dGVuID0gaSAqIDI7XG4gIHJldHVybiBpO1xufTtcblxuXG5TbG93QnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKSB7XG4gIC8vIFN1cHBvcnQgYm90aCAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpXG4gIC8vIGFuZCB0aGUgbGVnYWN5IChzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgaWYgKGlzRmluaXRlKG9mZnNldCkpIHtcbiAgICBpZiAoIWlzRmluaXRlKGxlbmd0aCkpIHtcbiAgICAgIGVuY29kaW5nID0gbGVuZ3RoO1xuICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSBlbHNlIHsgIC8vIGxlZ2FjeVxuICAgIHZhciBzd2FwID0gZW5jb2Rpbmc7XG4gICAgZW5jb2RpbmcgPSBvZmZzZXQ7XG4gICAgb2Zmc2V0ID0gbGVuZ3RoO1xuICAgIGxlbmd0aCA9IHN3YXA7XG4gIH1cblxuICBvZmZzZXQgPSArb2Zmc2V0IHx8IDA7XG4gIHZhciByZW1haW5pbmcgPSB0aGlzLmxlbmd0aCAtIG9mZnNldDtcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmc7XG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gK2xlbmd0aDtcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmc7XG4gICAgfVxuICB9XG4gIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nIHx8ICd1dGY4JykudG9Mb3dlckNhc2UoKTtcblxuICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldHVybiB0aGlzLmhleFdyaXRlKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpO1xuXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0dXJuIHRoaXMudXRmOFdyaXRlKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpO1xuXG4gICAgY2FzZSAnYXNjaWknOlxuICAgICAgcmV0dXJuIHRoaXMuYXNjaWlXcml0ZShzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKTtcblxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICByZXR1cm4gdGhpcy5iaW5hcnlXcml0ZShzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKTtcblxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICByZXR1cm4gdGhpcy5iYXNlNjRXcml0ZShzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKTtcblxuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIHJldHVybiB0aGlzLnVjczJXcml0ZShzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKTtcblxuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKTtcbiAgfVxufTtcblxuXG4vLyBzbGljZShzdGFydCwgZW5kKVxuU2xvd0J1ZmZlci5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gIGlmIChlbmQgPT09IHVuZGVmaW5lZCkgZW5kID0gdGhpcy5sZW5ndGg7XG5cbiAgaWYgKGVuZCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdvb2InKTtcbiAgfVxuICBpZiAoc3RhcnQgPiBlbmQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ29vYicpO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBCdWZmZXIodGhpcywgZW5kIC0gc3RhcnQsICtzdGFydCk7XG59O1xuXG5TbG93QnVmZmVyLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24odGFyZ2V0LCB0YXJnZXRzdGFydCwgc291cmNlc3RhcnQsIHNvdXJjZWVuZCkge1xuICB2YXIgdGVtcCA9IFtdO1xuICBmb3IgKHZhciBpPXNvdXJjZXN0YXJ0OyBpPHNvdXJjZWVuZDsgaSsrKSB7XG4gICAgYXNzZXJ0Lm9rKHR5cGVvZiB0aGlzW2ldICE9PSAndW5kZWZpbmVkJywgXCJjb3B5aW5nIHVuZGVmaW5lZCBidWZmZXIgYnl0ZXMhXCIpO1xuICAgIHRlbXAucHVzaCh0aGlzW2ldKTtcbiAgfVxuXG4gIGZvciAodmFyIGk9dGFyZ2V0c3RhcnQ7IGk8dGFyZ2V0c3RhcnQrdGVtcC5sZW5ndGg7IGkrKykge1xuICAgIHRhcmdldFtpXSA9IHRlbXBbaS10YXJnZXRzdGFydF07XG4gIH1cbn07XG5cblNsb3dCdWZmZXIucHJvdG90eXBlLmZpbGwgPSBmdW5jdGlvbih2YWx1ZSwgc3RhcnQsIGVuZCkge1xuICBpZiAoZW5kID4gdGhpcy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ29vYicpO1xuICB9XG4gIGlmIChzdGFydCA+IGVuZCkge1xuICAgIHRocm93IG5ldyBFcnJvcignb29iJyk7XG4gIH1cblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIHRoaXNbaV0gPSB2YWx1ZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjb2VyY2UobGVuZ3RoKSB7XG4gIC8vIENvZXJjZSBsZW5ndGggdG8gYSBudW1iZXIgKHBvc3NpYmx5IE5hTiksIHJvdW5kIHVwXG4gIC8vIGluIGNhc2UgaXQncyBmcmFjdGlvbmFsIChlLmcuIDEyMy40NTYpIHRoZW4gZG8gYVxuICAvLyBkb3VibGUgbmVnYXRlIHRvIGNvZXJjZSBhIE5hTiB0byAwLiBFYXN5LCByaWdodD9cbiAgbGVuZ3RoID0gfn5NYXRoLmNlaWwoK2xlbmd0aCk7XG4gIHJldHVybiBsZW5ndGggPCAwID8gMCA6IGxlbmd0aDtcbn1cblxuXG4vLyBCdWZmZXJcblxuZnVuY3Rpb24gQnVmZmVyKHN1YmplY3QsIGVuY29kaW5nLCBvZmZzZXQpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEJ1ZmZlcikpIHtcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcihzdWJqZWN0LCBlbmNvZGluZywgb2Zmc2V0KTtcbiAgfVxuXG4gIHZhciB0eXBlO1xuXG4gIC8vIEFyZSB3ZSBzbGljaW5nP1xuICBpZiAodHlwZW9mIG9mZnNldCA9PT0gJ251bWJlcicpIHtcbiAgICB0aGlzLmxlbmd0aCA9IGNvZXJjZShlbmNvZGluZyk7XG4gICAgdGhpcy5wYXJlbnQgPSBzdWJqZWN0O1xuICAgIHRoaXMub2Zmc2V0ID0gb2Zmc2V0O1xuICB9IGVsc2Uge1xuICAgIC8vIEZpbmQgdGhlIGxlbmd0aFxuICAgIHN3aXRjaCAodHlwZSA9IHR5cGVvZiBzdWJqZWN0KSB7XG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICB0aGlzLmxlbmd0aCA9IGNvZXJjZShzdWJqZWN0KTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgIHRoaXMubGVuZ3RoID0gQnVmZmVyLmJ5dGVMZW5ndGgoc3ViamVjdCwgZW5jb2RpbmcpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnb2JqZWN0JzogLy8gQXNzdW1lIG9iamVjdCBpcyBhbiBhcnJheVxuICAgICAgICB0aGlzLmxlbmd0aCA9IGNvZXJjZShzdWJqZWN0Lmxlbmd0aCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZpcnN0IGFyZ3VtZW50IG5lZWRzIHRvIGJlIGEgbnVtYmVyLCAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICdhcnJheSBvciBzdHJpbmcuJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubGVuZ3RoID4gQnVmZmVyLnBvb2xTaXplKSB7XG4gICAgICAvLyBCaWcgYnVmZmVyLCBqdXN0IGFsbG9jIG9uZS5cbiAgICAgIHRoaXMucGFyZW50ID0gbmV3IFNsb3dCdWZmZXIodGhpcy5sZW5ndGgpO1xuICAgICAgdGhpcy5vZmZzZXQgPSAwO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFNtYWxsIGJ1ZmZlci5cbiAgICAgIGlmICghcG9vbCB8fCBwb29sLmxlbmd0aCAtIHBvb2wudXNlZCA8IHRoaXMubGVuZ3RoKSBhbGxvY1Bvb2woKTtcbiAgICAgIHRoaXMucGFyZW50ID0gcG9vbDtcbiAgICAgIHRoaXMub2Zmc2V0ID0gcG9vbC51c2VkO1xuICAgICAgcG9vbC51c2VkICs9IHRoaXMubGVuZ3RoO1xuICAgIH1cblxuICAgIC8vIFRyZWF0IGFycmF5LWlzaCBvYmplY3RzIGFzIGEgYnl0ZSBhcnJheS5cbiAgICBpZiAoaXNBcnJheUlzaChzdWJqZWN0KSkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChzdWJqZWN0IGluc3RhbmNlb2YgQnVmZmVyKSB7XG4gICAgICAgICAgdGhpcy5wYXJlbnRbaSArIHRoaXMub2Zmc2V0XSA9IHN1YmplY3QucmVhZFVJbnQ4KGkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHRoaXMucGFyZW50W2kgKyB0aGlzLm9mZnNldF0gPSBzdWJqZWN0W2ldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlID09ICdzdHJpbmcnKSB7XG4gICAgICAvLyBXZSBhcmUgYSBzdHJpbmdcbiAgICAgIHRoaXMubGVuZ3RoID0gdGhpcy53cml0ZShzdWJqZWN0LCAwLCBlbmNvZGluZyk7XG4gICAgfVxuICB9XG5cbn1cblxuZnVuY3Rpb24gaXNBcnJheUlzaChzdWJqZWN0KSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KHN1YmplY3QpIHx8IEJ1ZmZlci5pc0J1ZmZlcihzdWJqZWN0KSB8fFxuICAgICAgICAgc3ViamVjdCAmJiB0eXBlb2Ygc3ViamVjdCA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgIHR5cGVvZiBzdWJqZWN0Lmxlbmd0aCA9PT0gJ251bWJlcic7XG59XG5cbmV4cG9ydHMuU2xvd0J1ZmZlciA9IFNsb3dCdWZmZXI7XG5leHBvcnRzLkJ1ZmZlciA9IEJ1ZmZlcjtcblxuQnVmZmVyLnBvb2xTaXplID0gOCAqIDEwMjQ7XG52YXIgcG9vbDtcblxuZnVuY3Rpb24gYWxsb2NQb29sKCkge1xuICBwb29sID0gbmV3IFNsb3dCdWZmZXIoQnVmZmVyLnBvb2xTaXplKTtcbiAgcG9vbC51c2VkID0gMDtcbn1cblxuXG4vLyBTdGF0aWMgbWV0aG9kc1xuQnVmZmVyLmlzQnVmZmVyID0gZnVuY3Rpb24gaXNCdWZmZXIoYikge1xuICByZXR1cm4gYiBpbnN0YW5jZW9mIEJ1ZmZlciB8fCBiIGluc3RhbmNlb2YgU2xvd0J1ZmZlcjtcbn07XG5cbkJ1ZmZlci5jb25jYXQgPSBmdW5jdGlvbiAobGlzdCwgdG90YWxMZW5ndGgpIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KGxpc3QpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVXNhZ2U6IEJ1ZmZlci5jb25jYXQobGlzdCwgW3RvdGFsTGVuZ3RoXSlcXG4gXFxcbiAgICAgIGxpc3Qgc2hvdWxkIGJlIGFuIEFycmF5LlwiKTtcbiAgfVxuXG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBuZXcgQnVmZmVyKDApO1xuICB9IGVsc2UgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIGxpc3RbMF07XG4gIH1cblxuICBpZiAodHlwZW9mIHRvdGFsTGVuZ3RoICE9PSAnbnVtYmVyJykge1xuICAgIHRvdGFsTGVuZ3RoID0gMDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBidWYgPSBsaXN0W2ldO1xuICAgICAgdG90YWxMZW5ndGggKz0gYnVmLmxlbmd0aDtcbiAgICB9XG4gIH1cblxuICB2YXIgYnVmZmVyID0gbmV3IEJ1ZmZlcih0b3RhbExlbmd0aCk7XG4gIHZhciBwb3MgPSAwO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYnVmID0gbGlzdFtpXTtcbiAgICBidWYuY29weShidWZmZXIsIHBvcyk7XG4gICAgcG9zICs9IGJ1Zi5sZW5ndGg7XG4gIH1cbiAgcmV0dXJuIGJ1ZmZlcjtcbn07XG5cbi8vIEluc3BlY3RcbkJ1ZmZlci5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uIGluc3BlY3QoKSB7XG4gIHZhciBvdXQgPSBbXSxcbiAgICAgIGxlbiA9IHRoaXMubGVuZ3RoO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICBvdXRbaV0gPSB0b0hleCh0aGlzLnBhcmVudFtpICsgdGhpcy5vZmZzZXRdKTtcbiAgICBpZiAoaSA9PSBleHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTKSB7XG4gICAgICBvdXRbaSArIDFdID0gJy4uLic7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gJzxCdWZmZXIgJyArIG91dC5qb2luKCcgJykgKyAnPic7XG59O1xuXG5cbkJ1ZmZlci5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gZ2V0KGkpIHtcbiAgaWYgKGkgPCAwIHx8IGkgPj0gdGhpcy5sZW5ndGgpIHRocm93IG5ldyBFcnJvcignb29iJyk7XG4gIHJldHVybiB0aGlzLnBhcmVudFt0aGlzLm9mZnNldCArIGldO1xufTtcblxuXG5CdWZmZXIucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIHNldChpLCB2KSB7XG4gIGlmIChpIDwgMCB8fCBpID49IHRoaXMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ29vYicpO1xuICByZXR1cm4gdGhpcy5wYXJlbnRbdGhpcy5vZmZzZXQgKyBpXSA9IHY7XG59O1xuXG5cbi8vIHdyaXRlKHN0cmluZywgb2Zmc2V0ID0gMCwgbGVuZ3RoID0gYnVmZmVyLmxlbmd0aC1vZmZzZXQsIGVuY29kaW5nID0gJ3V0ZjgnKVxuQnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKSB7XG4gIC8vIFN1cHBvcnQgYm90aCAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpXG4gIC8vIGFuZCB0aGUgbGVnYWN5IChzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgaWYgKGlzRmluaXRlKG9mZnNldCkpIHtcbiAgICBpZiAoIWlzRmluaXRlKGxlbmd0aCkpIHtcbiAgICAgIGVuY29kaW5nID0gbGVuZ3RoO1xuICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSBlbHNlIHsgIC8vIGxlZ2FjeVxuICAgIHZhciBzd2FwID0gZW5jb2Rpbmc7XG4gICAgZW5jb2RpbmcgPSBvZmZzZXQ7XG4gICAgb2Zmc2V0ID0gbGVuZ3RoO1xuICAgIGxlbmd0aCA9IHN3YXA7XG4gIH1cblxuICBvZmZzZXQgPSArb2Zmc2V0IHx8IDA7XG4gIHZhciByZW1haW5pbmcgPSB0aGlzLmxlbmd0aCAtIG9mZnNldDtcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmc7XG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gK2xlbmd0aDtcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmc7XG4gICAgfVxuICB9XG4gIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nIHx8ICd1dGY4JykudG9Mb3dlckNhc2UoKTtcblxuICB2YXIgcmV0O1xuICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldCA9IHRoaXMucGFyZW50LmhleFdyaXRlKHN0cmluZywgdGhpcy5vZmZzZXQgKyBvZmZzZXQsIGxlbmd0aCk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IHRoaXMucGFyZW50LnV0ZjhXcml0ZShzdHJpbmcsIHRoaXMub2Zmc2V0ICsgb2Zmc2V0LCBsZW5ndGgpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdhc2NpaSc6XG4gICAgICByZXQgPSB0aGlzLnBhcmVudC5hc2NpaVdyaXRlKHN0cmluZywgdGhpcy5vZmZzZXQgKyBvZmZzZXQsIGxlbmd0aCk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICByZXQgPSB0aGlzLnBhcmVudC5iaW5hcnlXcml0ZShzdHJpbmcsIHRoaXMub2Zmc2V0ICsgb2Zmc2V0LCBsZW5ndGgpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgLy8gV2FybmluZzogbWF4TGVuZ3RoIG5vdCB0YWtlbiBpbnRvIGFjY291bnQgaW4gYmFzZTY0V3JpdGVcbiAgICAgIHJldCA9IHRoaXMucGFyZW50LmJhc2U2NFdyaXRlKHN0cmluZywgdGhpcy5vZmZzZXQgKyBvZmZzZXQsIGxlbmd0aCk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIHJldCA9IHRoaXMucGFyZW50LnVjczJXcml0ZShzdHJpbmcsIHRoaXMub2Zmc2V0ICsgb2Zmc2V0LCBsZW5ndGgpO1xuICAgICAgYnJlYWs7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJyk7XG4gIH1cblxuICBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9IFNsb3dCdWZmZXIuX2NoYXJzV3JpdHRlbjtcblxuICByZXR1cm4gcmV0O1xufTtcblxuXG4vLyB0b1N0cmluZyhlbmNvZGluZywgc3RhcnQ9MCwgZW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oZW5jb2RpbmcsIHN0YXJ0LCBlbmQpIHtcbiAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcgfHwgJ3V0ZjgnKS50b0xvd2VyQ2FzZSgpO1xuXG4gIGlmICh0eXBlb2Ygc3RhcnQgPT0gJ3VuZGVmaW5lZCcgfHwgc3RhcnQgPCAwKSB7XG4gICAgc3RhcnQgPSAwO1xuICB9IGVsc2UgaWYgKHN0YXJ0ID4gdGhpcy5sZW5ndGgpIHtcbiAgICBzdGFydCA9IHRoaXMubGVuZ3RoO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBlbmQgPT0gJ3VuZGVmaW5lZCcgfHwgZW5kID4gdGhpcy5sZW5ndGgpIHtcbiAgICBlbmQgPSB0aGlzLmxlbmd0aDtcbiAgfSBlbHNlIGlmIChlbmQgPCAwKSB7XG4gICAgZW5kID0gMDtcbiAgfVxuXG4gIHN0YXJ0ID0gc3RhcnQgKyB0aGlzLm9mZnNldDtcbiAgZW5kID0gZW5kICsgdGhpcy5vZmZzZXQ7XG5cbiAgc3dpdGNoIChlbmNvZGluZykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXR1cm4gdGhpcy5wYXJlbnQuaGV4U2xpY2Uoc3RhcnQsIGVuZCk7XG5cbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXR1cm4gdGhpcy5wYXJlbnQudXRmOFNsaWNlKHN0YXJ0LCBlbmQpO1xuXG4gICAgY2FzZSAnYXNjaWknOlxuICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmFzY2lpU2xpY2Uoc3RhcnQsIGVuZCk7XG5cbiAgICBjYXNlICdiaW5hcnknOlxuICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmJpbmFyeVNsaWNlKHN0YXJ0LCBlbmQpO1xuXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldHVybiB0aGlzLnBhcmVudC5iYXNlNjRTbGljZShzdGFydCwgZW5kKTtcblxuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIHJldHVybiB0aGlzLnBhcmVudC51Y3MyU2xpY2Uoc3RhcnQsIGVuZCk7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJyk7XG4gIH1cbn07XG5cblxuLy8gYnl0ZUxlbmd0aFxuQnVmZmVyLmJ5dGVMZW5ndGggPSBTbG93QnVmZmVyLmJ5dGVMZW5ndGg7XG5cblxuLy8gZmlsbCh2YWx1ZSwgc3RhcnQ9MCwgZW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmZpbGwgPSBmdW5jdGlvbiBmaWxsKHZhbHVlLCBzdGFydCwgZW5kKSB7XG4gIHZhbHVlIHx8ICh2YWx1ZSA9IDApO1xuICBzdGFydCB8fCAoc3RhcnQgPSAwKTtcbiAgZW5kIHx8IChlbmQgPSB0aGlzLmxlbmd0aCk7XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICB2YWx1ZSA9IHZhbHVlLmNoYXJDb2RlQXQoMCk7XG4gIH1cbiAgaWYgKCEodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykgfHwgaXNOYU4odmFsdWUpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd2YWx1ZSBpcyBub3QgYSBudW1iZXInKTtcbiAgfVxuXG4gIGlmIChlbmQgPCBzdGFydCkgdGhyb3cgbmV3IEVycm9yKCdlbmQgPCBzdGFydCcpO1xuXG4gIC8vIEZpbGwgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuIDA7XG4gIGlmICh0aGlzLmxlbmd0aCA9PSAwKSByZXR1cm4gMDtcblxuICBpZiAoc3RhcnQgPCAwIHx8IHN0YXJ0ID49IHRoaXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzdGFydCBvdXQgb2YgYm91bmRzJyk7XG4gIH1cblxuICBpZiAoZW5kIDwgMCB8fCBlbmQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBFcnJvcignZW5kIG91dCBvZiBib3VuZHMnKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzLnBhcmVudC5maWxsKHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydCArIHRoaXMub2Zmc2V0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICBlbmQgKyB0aGlzLm9mZnNldCk7XG59O1xuXG5cbi8vIGNvcHkodGFyZ2V0QnVmZmVyLCB0YXJnZXRTdGFydD0wLCBzb3VyY2VTdGFydD0wLCBzb3VyY2VFbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uKHRhcmdldCwgdGFyZ2V0X3N0YXJ0LCBzdGFydCwgZW5kKSB7XG4gIHZhciBzb3VyY2UgPSB0aGlzO1xuICBzdGFydCB8fCAoc3RhcnQgPSAwKTtcbiAgZW5kIHx8IChlbmQgPSB0aGlzLmxlbmd0aCk7XG4gIHRhcmdldF9zdGFydCB8fCAodGFyZ2V0X3N0YXJ0ID0gMCk7XG5cbiAgaWYgKGVuZCA8IHN0YXJ0KSB0aHJvdyBuZXcgRXJyb3IoJ3NvdXJjZUVuZCA8IHNvdXJjZVN0YXJ0Jyk7XG5cbiAgLy8gQ29weSAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm4gMDtcbiAgaWYgKHRhcmdldC5sZW5ndGggPT0gMCB8fCBzb3VyY2UubGVuZ3RoID09IDApIHJldHVybiAwO1xuXG4gIGlmICh0YXJnZXRfc3RhcnQgPCAwIHx8IHRhcmdldF9zdGFydCA+PSB0YXJnZXQubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd0YXJnZXRTdGFydCBvdXQgb2YgYm91bmRzJyk7XG4gIH1cblxuICBpZiAoc3RhcnQgPCAwIHx8IHN0YXJ0ID49IHNvdXJjZS5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NvdXJjZVN0YXJ0IG91dCBvZiBib3VuZHMnKTtcbiAgfVxuXG4gIGlmIChlbmQgPCAwIHx8IGVuZCA+IHNvdXJjZS5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NvdXJjZUVuZCBvdXQgb2YgYm91bmRzJyk7XG4gIH1cblxuICAvLyBBcmUgd2Ugb29iP1xuICBpZiAoZW5kID4gdGhpcy5sZW5ndGgpIHtcbiAgICBlbmQgPSB0aGlzLmxlbmd0aDtcbiAgfVxuXG4gIGlmICh0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0X3N0YXJ0IDwgZW5kIC0gc3RhcnQpIHtcbiAgICBlbmQgPSB0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0X3N0YXJ0ICsgc3RhcnQ7XG4gIH1cblxuICByZXR1cm4gdGhpcy5wYXJlbnQuY29weSh0YXJnZXQucGFyZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRfc3RhcnQgKyB0YXJnZXQub2Zmc2V0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydCArIHRoaXMub2Zmc2V0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICBlbmQgKyB0aGlzLm9mZnNldCk7XG59O1xuXG5cbi8vIHNsaWNlKHN0YXJ0LCBlbmQpXG5CdWZmZXIucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICBpZiAoZW5kID09PSB1bmRlZmluZWQpIGVuZCA9IHRoaXMubGVuZ3RoO1xuICBpZiAoZW5kID4gdGhpcy5sZW5ndGgpIHRocm93IG5ldyBFcnJvcignb29iJyk7XG4gIGlmIChzdGFydCA+IGVuZCkgdGhyb3cgbmV3IEVycm9yKCdvb2InKTtcblxuICByZXR1cm4gbmV3IEJ1ZmZlcih0aGlzLnBhcmVudCwgZW5kIC0gc3RhcnQsICtzdGFydCArIHRoaXMub2Zmc2V0KTtcbn07XG5cblxuLy8gTGVnYWN5IG1ldGhvZHMgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LlxuXG5CdWZmZXIucHJvdG90eXBlLnV0ZjhTbGljZSA9IGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIHRoaXMudG9TdHJpbmcoJ3V0ZjgnLCBzdGFydCwgZW5kKTtcbn07XG5cbkJ1ZmZlci5wcm90b3R5cGUuYmluYXJ5U2xpY2UgPSBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gIHJldHVybiB0aGlzLnRvU3RyaW5nKCdiaW5hcnknLCBzdGFydCwgZW5kKTtcbn07XG5cbkJ1ZmZlci5wcm90b3R5cGUuYXNjaWlTbGljZSA9IGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIHRoaXMudG9TdHJpbmcoJ2FzY2lpJywgc3RhcnQsIGVuZCk7XG59O1xuXG5CdWZmZXIucHJvdG90eXBlLnV0ZjhXcml0ZSA9IGZ1bmN0aW9uKHN0cmluZywgb2Zmc2V0KSB7XG4gIHJldHVybiB0aGlzLndyaXRlKHN0cmluZywgb2Zmc2V0LCAndXRmOCcpO1xufTtcblxuQnVmZmVyLnByb3RvdHlwZS5iaW5hcnlXcml0ZSA9IGZ1bmN0aW9uKHN0cmluZywgb2Zmc2V0KSB7XG4gIHJldHVybiB0aGlzLndyaXRlKHN0cmluZywgb2Zmc2V0LCAnYmluYXJ5Jyk7XG59O1xuXG5CdWZmZXIucHJvdG90eXBlLmFzY2lpV3JpdGUgPSBmdW5jdGlvbihzdHJpbmcsIG9mZnNldCkge1xuICByZXR1cm4gdGhpcy53cml0ZShzdHJpbmcsIG9mZnNldCwgJ2FzY2lpJyk7XG59O1xuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50OCA9IGZ1bmN0aW9uKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFyIGJ1ZmZlciA9IHRoaXM7XG5cbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydC5vayhvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIG9mZnNldCcpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCA8IGJ1ZmZlci5sZW5ndGgsXG4gICAgICAgICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpO1xuICB9XG5cbiAgaWYgKG9mZnNldCA+PSBidWZmZXIubGVuZ3RoKSByZXR1cm47XG5cbiAgcmV0dXJuIGJ1ZmZlci5wYXJlbnRbYnVmZmVyLm9mZnNldCArIG9mZnNldF07XG59O1xuXG5mdW5jdGlvbiByZWFkVUludDE2KGJ1ZmZlciwgb2Zmc2V0LCBpc0JpZ0VuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgdmFyIHZhbCA9IDA7XG5cblxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0Lm9rKHR5cGVvZiAoaXNCaWdFbmRpYW4pID09PSAnYm9vbGVhbicsXG4gICAgICAgICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyBvZmZzZXQnKTtcblxuICAgIGFzc2VydC5vayhvZmZzZXQgKyAxIDwgYnVmZmVyLmxlbmd0aCxcbiAgICAgICAgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJyk7XG4gIH1cblxuICBpZiAob2Zmc2V0ID49IGJ1ZmZlci5sZW5ndGgpIHJldHVybiAwO1xuXG4gIGlmIChpc0JpZ0VuZGlhbikge1xuICAgIHZhbCA9IGJ1ZmZlci5wYXJlbnRbYnVmZmVyLm9mZnNldCArIG9mZnNldF0gPDwgODtcbiAgICBpZiAob2Zmc2V0ICsgMSA8IGJ1ZmZlci5sZW5ndGgpIHtcbiAgICAgIHZhbCB8PSBidWZmZXIucGFyZW50W2J1ZmZlci5vZmZzZXQgKyBvZmZzZXQgKyAxXTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFsID0gYnVmZmVyLnBhcmVudFtidWZmZXIub2Zmc2V0ICsgb2Zmc2V0XTtcbiAgICBpZiAob2Zmc2V0ICsgMSA8IGJ1ZmZlci5sZW5ndGgpIHtcbiAgICAgIHZhbCB8PSBidWZmZXIucGFyZW50W2J1ZmZlci5vZmZzZXQgKyBvZmZzZXQgKyAxXSA8PCA4O1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB2YWw7XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkxFID0gZnVuY3Rpb24ob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gcmVhZFVJbnQxNih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydCk7XG59O1xuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZCRSA9IGZ1bmN0aW9uKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHJlYWRVSW50MTYodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydCk7XG59O1xuXG5mdW5jdGlvbiByZWFkVUludDMyKGJ1ZmZlciwgb2Zmc2V0LCBpc0JpZ0VuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgdmFyIHZhbCA9IDA7XG5cbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydC5vayh0eXBlb2YgKGlzQmlnRW5kaWFuKSA9PT0gJ2Jvb2xlYW4nLFxuICAgICAgICAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3Npbmcgb2Zmc2V0Jyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0ICsgMyA8IGJ1ZmZlci5sZW5ndGgsXG4gICAgICAgICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpO1xuICB9XG5cbiAgaWYgKG9mZnNldCA+PSBidWZmZXIubGVuZ3RoKSByZXR1cm4gMDtcblxuICBpZiAoaXNCaWdFbmRpYW4pIHtcbiAgICBpZiAob2Zmc2V0ICsgMSA8IGJ1ZmZlci5sZW5ndGgpXG4gICAgICB2YWwgPSBidWZmZXIucGFyZW50W2J1ZmZlci5vZmZzZXQgKyBvZmZzZXQgKyAxXSA8PCAxNjtcbiAgICBpZiAob2Zmc2V0ICsgMiA8IGJ1ZmZlci5sZW5ndGgpXG4gICAgICB2YWwgfD0gYnVmZmVyLnBhcmVudFtidWZmZXIub2Zmc2V0ICsgb2Zmc2V0ICsgMl0gPDwgODtcbiAgICBpZiAob2Zmc2V0ICsgMyA8IGJ1ZmZlci5sZW5ndGgpXG4gICAgICB2YWwgfD0gYnVmZmVyLnBhcmVudFtidWZmZXIub2Zmc2V0ICsgb2Zmc2V0ICsgM107XG4gICAgdmFsID0gdmFsICsgKGJ1ZmZlci5wYXJlbnRbYnVmZmVyLm9mZnNldCArIG9mZnNldF0gPDwgMjQgPj4+IDApO1xuICB9IGVsc2Uge1xuICAgIGlmIChvZmZzZXQgKyAyIDwgYnVmZmVyLmxlbmd0aClcbiAgICAgIHZhbCA9IGJ1ZmZlci5wYXJlbnRbYnVmZmVyLm9mZnNldCArIG9mZnNldCArIDJdIDw8IDE2O1xuICAgIGlmIChvZmZzZXQgKyAxIDwgYnVmZmVyLmxlbmd0aClcbiAgICAgIHZhbCB8PSBidWZmZXIucGFyZW50W2J1ZmZlci5vZmZzZXQgKyBvZmZzZXQgKyAxXSA8PCA4O1xuICAgIHZhbCB8PSBidWZmZXIucGFyZW50W2J1ZmZlci5vZmZzZXQgKyBvZmZzZXRdO1xuICAgIGlmIChvZmZzZXQgKyAzIDwgYnVmZmVyLmxlbmd0aClcbiAgICAgIHZhbCA9IHZhbCArIChidWZmZXIucGFyZW50W2J1ZmZlci5vZmZzZXQgKyBvZmZzZXQgKyAzXSA8PCAyNCA+Pj4gMCk7XG4gIH1cblxuICByZXR1cm4gdmFsO1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJMRSA9IGZ1bmN0aW9uKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHJlYWRVSW50MzIodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpO1xufTtcblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyQkUgPSBmdW5jdGlvbihvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiByZWFkVUludDMyKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpO1xufTtcblxuXG4vKlxuICogU2lnbmVkIGludGVnZXIgdHlwZXMsIHlheSB0ZWFtISBBIHJlbWluZGVyIG9uIGhvdyB0d28ncyBjb21wbGVtZW50IGFjdHVhbGx5XG4gKiB3b3Jrcy4gVGhlIGZpcnN0IGJpdCBpcyB0aGUgc2lnbmVkIGJpdCwgaS5lLiB0ZWxscyB1cyB3aGV0aGVyIG9yIG5vdCB0aGVcbiAqIG51bWJlciBzaG91bGQgYmUgcG9zaXRpdmUgb3IgbmVnYXRpdmUuIElmIHRoZSB0d28ncyBjb21wbGVtZW50IHZhbHVlIGlzXG4gKiBwb3NpdGl2ZSwgdGhlbiB3ZSdyZSBkb25lLCBhcyBpdCdzIGVxdWl2YWxlbnQgdG8gdGhlIHVuc2lnbmVkIHJlcHJlc2VudGF0aW9uLlxuICpcbiAqIE5vdyBpZiB0aGUgbnVtYmVyIGlzIHBvc2l0aXZlLCB5b3UncmUgcHJldHR5IG11Y2ggZG9uZSwgeW91IGNhbiBqdXN0IGxldmVyYWdlXG4gKiB0aGUgdW5zaWduZWQgdHJhbnNsYXRpb25zIGFuZCByZXR1cm4gdGhvc2UuIFVuZm9ydHVuYXRlbHksIG5lZ2F0aXZlIG51bWJlcnNcbiAqIGFyZW4ndCBxdWl0ZSB0aGF0IHN0cmFpZ2h0Zm9yd2FyZC5cbiAqXG4gKiBBdCBmaXJzdCBnbGFuY2UsIG9uZSBtaWdodCBiZSBpbmNsaW5lZCB0byB1c2UgdGhlIHRyYWRpdGlvbmFsIGZvcm11bGEgdG9cbiAqIHRyYW5zbGF0ZSBiaW5hcnkgbnVtYmVycyBiZXR3ZWVuIHRoZSBwb3NpdGl2ZSBhbmQgbmVnYXRpdmUgdmFsdWVzIGluIHR3bydzXG4gKiBjb21wbGVtZW50LiAoVGhvdWdoIGl0IGRvZXNuJ3QgcXVpdGUgd29yayBmb3IgdGhlIG1vc3QgbmVnYXRpdmUgdmFsdWUpXG4gKiBNYWlubHk6XG4gKiAgLSBpbnZlcnQgYWxsIHRoZSBiaXRzXG4gKiAgLSBhZGQgb25lIHRvIHRoZSByZXN1bHRcbiAqXG4gKiBPZiBjb3Vyc2UsIHRoaXMgZG9lc24ndCBxdWl0ZSB3b3JrIGluIEphdmFzY3JpcHQuIFRha2UgZm9yIGV4YW1wbGUgdGhlIHZhbHVlXG4gKiBvZiAtMTI4LiBUaGlzIGNvdWxkIGJlIHJlcHJlc2VudGVkIGluIDE2IGJpdHMgKGJpZy1lbmRpYW4pIGFzIDB4ZmY4MC4gQnV0IG9mXG4gKiBjb3Vyc2UsIEphdmFzY3JpcHQgd2lsbCBkbyB0aGUgZm9sbG93aW5nOlxuICpcbiAqID4gfjB4ZmY4MFxuICogLTY1NDA5XG4gKlxuICogV2hvaCB0aGVyZSwgSmF2YXNjcmlwdCwgdGhhdCdzIG5vdCBxdWl0ZSByaWdodC4gQnV0IHdhaXQsIGFjY29yZGluZyB0b1xuICogSmF2YXNjcmlwdCB0aGF0J3MgcGVyZmVjdGx5IGNvcnJlY3QuIFdoZW4gSmF2YXNjcmlwdCBlbmRzIHVwIHNlZWluZyB0aGVcbiAqIGNvbnN0YW50IDB4ZmY4MCwgaXQgaGFzIG5vIG5vdGlvbiB0aGF0IGl0IGlzIGFjdHVhbGx5IGEgc2lnbmVkIG51bWJlci4gSXRcbiAqIGFzc3VtZXMgdGhhdCB3ZSd2ZSBpbnB1dCB0aGUgdW5zaWduZWQgdmFsdWUgMHhmZjgwLiBUaHVzLCB3aGVuIGl0IGRvZXMgdGhlXG4gKiBiaW5hcnkgbmVnYXRpb24sIGl0IGNhc3RzIGl0IGludG8gYSBzaWduZWQgdmFsdWUsIChwb3NpdGl2ZSAweGZmODApLiBUaGVuXG4gKiB3aGVuIHlvdSBwZXJmb3JtIGJpbmFyeSBuZWdhdGlvbiBvbiB0aGF0LCBpdCB0dXJucyBpdCBpbnRvIGEgbmVnYXRpdmUgbnVtYmVyLlxuICpcbiAqIEluc3RlYWQsIHdlJ3JlIGdvaW5nIHRvIGhhdmUgdG8gdXNlIHRoZSBmb2xsb3dpbmcgZ2VuZXJhbCBmb3JtdWxhLCB0aGF0IHdvcmtzXG4gKiBpbiBhIHJhdGhlciBKYXZhc2NyaXB0IGZyaWVuZGx5IHdheS4gSSdtIGdsYWQgd2UgZG9uJ3Qgc3VwcG9ydCB0aGlzIGtpbmQgb2ZcbiAqIHdlaXJkIG51bWJlcmluZyBzY2hlbWUgaW4gdGhlIGtlcm5lbC5cbiAqXG4gKiAoQklULU1BWCAtICh1bnNpZ25lZCl2YWwgKyAxKSAqIC0xXG4gKlxuICogVGhlIGFzdHV0ZSBvYnNlcnZlciwgbWF5IHRoaW5rIHRoYXQgdGhpcyBkb2Vzbid0IG1ha2Ugc2Vuc2UgZm9yIDgtYml0IG51bWJlcnNcbiAqIChyZWFsbHkgaXQgaXNuJ3QgbmVjZXNzYXJ5IGZvciB0aGVtKS4gSG93ZXZlciwgd2hlbiB5b3UgZ2V0IDE2LWJpdCBudW1iZXJzLFxuICogeW91IGRvLiBMZXQncyBnbyBiYWNrIHRvIG91ciBwcmlvciBleGFtcGxlIGFuZCBzZWUgaG93IHRoaXMgd2lsbCBsb29rOlxuICpcbiAqICgweGZmZmYgLSAweGZmODAgKyAxKSAqIC0xXG4gKiAoMHgwMDdmICsgMSkgKiAtMVxuICogKDB4MDA4MCkgKiAtMVxuICovXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQ4ID0gZnVuY3Rpb24ob2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YXIgYnVmZmVyID0gdGhpcztcbiAgdmFyIG5lZztcblxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0Lm9rKG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3Npbmcgb2Zmc2V0Jyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0IDwgYnVmZmVyLmxlbmd0aCxcbiAgICAgICAgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJyk7XG4gIH1cblxuICBpZiAob2Zmc2V0ID49IGJ1ZmZlci5sZW5ndGgpIHJldHVybjtcblxuICBuZWcgPSBidWZmZXIucGFyZW50W2J1ZmZlci5vZmZzZXQgKyBvZmZzZXRdICYgMHg4MDtcbiAgaWYgKCFuZWcpIHtcbiAgICByZXR1cm4gKGJ1ZmZlci5wYXJlbnRbYnVmZmVyLm9mZnNldCArIG9mZnNldF0pO1xuICB9XG5cbiAgcmV0dXJuICgoMHhmZiAtIGJ1ZmZlci5wYXJlbnRbYnVmZmVyLm9mZnNldCArIG9mZnNldF0gKyAxKSAqIC0xKTtcbn07XG5cbmZ1bmN0aW9uIHJlYWRJbnQxNihidWZmZXIsIG9mZnNldCwgaXNCaWdFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIHZhciBuZWcsIHZhbDtcblxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0Lm9rKHR5cGVvZiAoaXNCaWdFbmRpYW4pID09PSAnYm9vbGVhbicsXG4gICAgICAgICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyBvZmZzZXQnKTtcblxuICAgIGFzc2VydC5vayhvZmZzZXQgKyAxIDwgYnVmZmVyLmxlbmd0aCxcbiAgICAgICAgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJyk7XG4gIH1cblxuICB2YWwgPSByZWFkVUludDE2KGJ1ZmZlciwgb2Zmc2V0LCBpc0JpZ0VuZGlhbiwgbm9Bc3NlcnQpO1xuICBuZWcgPSB2YWwgJiAweDgwMDA7XG4gIGlmICghbmVnKSB7XG4gICAgcmV0dXJuIHZhbDtcbiAgfVxuXG4gIHJldHVybiAoMHhmZmZmIC0gdmFsICsgMSkgKiAtMTtcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZMRSA9IGZ1bmN0aW9uKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHJlYWRJbnQxNih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydCk7XG59O1xuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkJFID0gZnVuY3Rpb24ob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gcmVhZEludDE2KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpO1xufTtcblxuZnVuY3Rpb24gcmVhZEludDMyKGJ1ZmZlciwgb2Zmc2V0LCBpc0JpZ0VuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgdmFyIG5lZywgdmFsO1xuXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQub2sodHlwZW9mIChpc0JpZ0VuZGlhbikgPT09ICdib29sZWFuJyxcbiAgICAgICAgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKTtcblxuICAgIGFzc2VydC5vayhvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIG9mZnNldCcpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCArIDMgPCBidWZmZXIubGVuZ3RoLFxuICAgICAgICAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKTtcbiAgfVxuXG4gIHZhbCA9IHJlYWRVSW50MzIoYnVmZmVyLCBvZmZzZXQsIGlzQmlnRW5kaWFuLCBub0Fzc2VydCk7XG4gIG5lZyA9IHZhbCAmIDB4ODAwMDAwMDA7XG4gIGlmICghbmVnKSB7XG4gICAgcmV0dXJuICh2YWwpO1xuICB9XG5cbiAgcmV0dXJuICgweGZmZmZmZmZmIC0gdmFsICsgMSkgKiAtMTtcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJMRSA9IGZ1bmN0aW9uKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHJlYWRJbnQzMih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydCk7XG59O1xuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkJFID0gZnVuY3Rpb24ob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gcmVhZEludDMyKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpO1xufTtcblxuZnVuY3Rpb24gcmVhZEZsb2F0KGJ1ZmZlciwgb2Zmc2V0LCBpc0JpZ0VuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydC5vayh0eXBlb2YgKGlzQmlnRW5kaWFuKSA9PT0gJ2Jvb2xlYW4nLFxuICAgICAgICAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCArIDMgPCBidWZmZXIubGVuZ3RoLFxuICAgICAgICAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKTtcbiAgfVxuXG4gIHJldHVybiByZXF1aXJlKCcuL2J1ZmZlcl9pZWVlNzU0JykucmVhZElFRUU3NTQoYnVmZmVyLCBvZmZzZXQsIGlzQmlnRW5kaWFuLFxuICAgICAgMjMsIDQpO1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdExFID0gZnVuY3Rpb24ob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gcmVhZEZsb2F0KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KTtcbn07XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0QkUgPSBmdW5jdGlvbihvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiByZWFkRmxvYXQodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydCk7XG59O1xuXG5mdW5jdGlvbiByZWFkRG91YmxlKGJ1ZmZlciwgb2Zmc2V0LCBpc0JpZ0VuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydC5vayh0eXBlb2YgKGlzQmlnRW5kaWFuKSA9PT0gJ2Jvb2xlYW4nLFxuICAgICAgICAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCArIDcgPCBidWZmZXIubGVuZ3RoLFxuICAgICAgICAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKTtcbiAgfVxuXG4gIHJldHVybiByZXF1aXJlKCcuL2J1ZmZlcl9pZWVlNzU0JykucmVhZElFRUU3NTQoYnVmZmVyLCBvZmZzZXQsIGlzQmlnRW5kaWFuLFxuICAgICAgNTIsIDgpO1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVMRSA9IGZ1bmN0aW9uKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHJlYWREb3VibGUodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpO1xufTtcblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlQkUgPSBmdW5jdGlvbihvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiByZWFkRG91YmxlKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpO1xufTtcblxuXG4vKlxuICogV2UgaGF2ZSB0byBtYWtlIHN1cmUgdGhhdCB0aGUgdmFsdWUgaXMgYSB2YWxpZCBpbnRlZ2VyLiBUaGlzIG1lYW5zIHRoYXQgaXQgaXNcbiAqIG5vbi1uZWdhdGl2ZS4gSXQgaGFzIG5vIGZyYWN0aW9uYWwgY29tcG9uZW50IGFuZCB0aGF0IGl0IGRvZXMgbm90IGV4Y2VlZCB0aGVcbiAqIG1heGltdW0gYWxsb3dlZCB2YWx1ZS5cbiAqXG4gKiAgICAgIHZhbHVlICAgICAgICAgICBUaGUgbnVtYmVyIHRvIGNoZWNrIGZvciB2YWxpZGl0eVxuICpcbiAqICAgICAgbWF4ICAgICAgICAgICAgIFRoZSBtYXhpbXVtIHZhbHVlXG4gKi9cbmZ1bmN0aW9uIHZlcmlmdWludCh2YWx1ZSwgbWF4KSB7XG4gIGFzc2VydC5vayh0eXBlb2YgKHZhbHVlKSA9PSAnbnVtYmVyJyxcbiAgICAgICdjYW5ub3Qgd3JpdGUgYSBub24tbnVtYmVyIGFzIGEgbnVtYmVyJyk7XG5cbiAgYXNzZXJ0Lm9rKHZhbHVlID49IDAsXG4gICAgICAnc3BlY2lmaWVkIGEgbmVnYXRpdmUgdmFsdWUgZm9yIHdyaXRpbmcgYW4gdW5zaWduZWQgdmFsdWUnKTtcblxuICBhc3NlcnQub2sodmFsdWUgPD0gbWF4LCAndmFsdWUgaXMgbGFyZ2VyIHRoYW4gbWF4aW11bSB2YWx1ZSBmb3IgdHlwZScpO1xuXG4gIGFzc2VydC5vayhNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUsICd2YWx1ZSBoYXMgYSBmcmFjdGlvbmFsIGNvbXBvbmVudCcpO1xufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDggPSBmdW5jdGlvbih2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YXIgYnVmZmVyID0gdGhpcztcblxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0Lm9rKHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIHZhbHVlJyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyBvZmZzZXQnKTtcblxuICAgIGFzc2VydC5vayhvZmZzZXQgPCBidWZmZXIubGVuZ3RoLFxuICAgICAgICAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJyk7XG5cbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmYpO1xuICB9XG5cbiAgaWYgKG9mZnNldCA8IGJ1ZmZlci5sZW5ndGgpIHtcbiAgICBidWZmZXIucGFyZW50W2J1ZmZlci5vZmZzZXQgKyBvZmZzZXRdID0gdmFsdWU7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHdyaXRlVUludDE2KGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNCaWdFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQub2sodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3NpbmcgdmFsdWUnKTtcblxuICAgIGFzc2VydC5vayh0eXBlb2YgKGlzQmlnRW5kaWFuKSA9PT0gJ2Jvb2xlYW4nLFxuICAgICAgICAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3Npbmcgb2Zmc2V0Jyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0ICsgMSA8IGJ1ZmZlci5sZW5ndGgsXG4gICAgICAgICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKTtcblxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZmZmKTtcbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgTWF0aC5taW4oYnVmZmVyLmxlbmd0aCAtIG9mZnNldCwgMik7IGkrKykge1xuICAgIGJ1ZmZlci5wYXJlbnRbYnVmZmVyLm9mZnNldCArIG9mZnNldCArIGldID1cbiAgICAgICAgKHZhbHVlICYgKDB4ZmYgPDwgKDggKiAoaXNCaWdFbmRpYW4gPyAxIC0gaSA6IGkpKSkpID4+PlxuICAgICAgICAgICAgKGlzQmlnRW5kaWFuID8gMSAtIGkgOiBpKSAqIDg7XG4gIH1cblxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEUgPSBmdW5jdGlvbih2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB3cml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpO1xufTtcblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkJFID0gZnVuY3Rpb24odmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgd3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpO1xufTtcblxuZnVuY3Rpb24gd3JpdGVVSW50MzIoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0JpZ0VuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydC5vayh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyB2YWx1ZScpO1xuXG4gICAgYXNzZXJ0Lm9rKHR5cGVvZiAoaXNCaWdFbmRpYW4pID09PSAnYm9vbGVhbicsXG4gICAgICAgICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyBvZmZzZXQnKTtcblxuICAgIGFzc2VydC5vayhvZmZzZXQgKyAzIDwgYnVmZmVyLmxlbmd0aCxcbiAgICAgICAgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpO1xuXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmZmZmZmZmKTtcbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgTWF0aC5taW4oYnVmZmVyLmxlbmd0aCAtIG9mZnNldCwgNCk7IGkrKykge1xuICAgIGJ1ZmZlci5wYXJlbnRbYnVmZmVyLm9mZnNldCArIG9mZnNldCArIGldID1cbiAgICAgICAgKHZhbHVlID4+PiAoaXNCaWdFbmRpYW4gPyAzIC0gaSA6IGkpICogOCkgJiAweGZmO1xuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJMRSA9IGZ1bmN0aW9uKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydCk7XG59O1xuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyQkUgPSBmdW5jdGlvbih2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB3cml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydCk7XG59O1xuXG5cbi8qXG4gKiBXZSBub3cgbW92ZSBvbnRvIG91ciBmcmllbmRzIGluIHRoZSBzaWduZWQgbnVtYmVyIGNhdGVnb3J5LiBVbmxpa2UgdW5zaWduZWRcbiAqIG51bWJlcnMsIHdlJ3JlIGdvaW5nIHRvIGhhdmUgdG8gd29ycnkgYSBiaXQgbW9yZSBhYm91dCBob3cgd2UgcHV0IHZhbHVlcyBpbnRvXG4gKiBhcnJheXMuIFNpbmNlIHdlIGFyZSBvbmx5IHdvcnJ5aW5nIGFib3V0IHNpZ25lZCAzMi1iaXQgdmFsdWVzLCB3ZSdyZSBpblxuICogc2xpZ2h0bHkgYmV0dGVyIHNoYXBlLiBVbmZvcnR1bmF0ZWx5LCB3ZSByZWFsbHkgY2FuJ3QgZG8gb3VyIGZhdm9yaXRlIGJpbmFyeVxuICogJiBpbiB0aGlzIHN5c3RlbS4gSXQgcmVhbGx5IHNlZW1zIHRvIGRvIHRoZSB3cm9uZyB0aGluZy4gRm9yIGV4YW1wbGU6XG4gKlxuICogPiAtMzIgJiAweGZmXG4gKiAyMjRcbiAqXG4gKiBXaGF0J3MgaGFwcGVuaW5nIGFib3ZlIGlzIHJlYWxseTogMHhlMCAmIDB4ZmYgPSAweGUwLiBIb3dldmVyLCB0aGUgcmVzdWx0cyBvZlxuICogdGhpcyBhcmVuJ3QgdHJlYXRlZCBhcyBhIHNpZ25lZCBudW1iZXIuIFVsdGltYXRlbHkgYSBiYWQgdGhpbmcuXG4gKlxuICogV2hhdCB3ZSdyZSBnb2luZyB0byB3YW50IHRvIGRvIGlzIGJhc2ljYWxseSBjcmVhdGUgdGhlIHVuc2lnbmVkIGVxdWl2YWxlbnQgb2ZcbiAqIG91ciByZXByZXNlbnRhdGlvbiBhbmQgcGFzcyB0aGF0IG9mZiB0byB0aGUgd3VpbnQqIGZ1bmN0aW9ucy4gVG8gZG8gdGhhdFxuICogd2UncmUgZ29pbmcgdG8gZG8gdGhlIGZvbGxvd2luZzpcbiAqXG4gKiAgLSBpZiB0aGUgdmFsdWUgaXMgcG9zaXRpdmVcbiAqICAgICAgd2UgY2FuIHBhc3MgaXQgZGlyZWN0bHkgb2ZmIHRvIHRoZSBlcXVpdmFsZW50IHd1aW50XG4gKiAgLSBpZiB0aGUgdmFsdWUgaXMgbmVnYXRpdmVcbiAqICAgICAgd2UgZG8gdGhlIGZvbGxvd2luZyBjb21wdXRhdGlvbjpcbiAqICAgICAgICAgbWIgKyB2YWwgKyAxLCB3aGVyZVxuICogICAgICAgICBtYiAgIGlzIHRoZSBtYXhpbXVtIHVuc2lnbmVkIHZhbHVlIGluIHRoYXQgYnl0ZSBzaXplXG4gKiAgICAgICAgIHZhbCAgaXMgdGhlIEphdmFzY3JpcHQgbmVnYXRpdmUgaW50ZWdlclxuICpcbiAqXG4gKiBBcyBhIGNvbmNyZXRlIHZhbHVlLCB0YWtlIC0xMjguIEluIHNpZ25lZCAxNiBiaXRzIHRoaXMgd291bGQgYmUgMHhmZjgwLiBJZlxuICogeW91IGRvIG91dCB0aGUgY29tcHV0YXRpb25zOlxuICpcbiAqIDB4ZmZmZiAtIDEyOCArIDFcbiAqIDB4ZmZmZiAtIDEyN1xuICogMHhmZjgwXG4gKlxuICogWW91IGNhbiB0aGVuIGVuY29kZSB0aGlzIHZhbHVlIGFzIHRoZSBzaWduZWQgdmVyc2lvbi4gVGhpcyBpcyByZWFsbHkgcmF0aGVyXG4gKiBoYWNreSwgYnV0IGl0IHNob3VsZCB3b3JrIGFuZCBnZXQgdGhlIGpvYiBkb25lIHdoaWNoIGlzIG91ciBnb2FsIGhlcmUuXG4gKi9cblxuLypcbiAqIEEgc2VyaWVzIG9mIGNoZWNrcyB0byBtYWtlIHN1cmUgd2UgYWN0dWFsbHkgaGF2ZSBhIHNpZ25lZCAzMi1iaXQgbnVtYmVyXG4gKi9cbmZ1bmN0aW9uIHZlcmlmc2ludCh2YWx1ZSwgbWF4LCBtaW4pIHtcbiAgYXNzZXJ0Lm9rKHR5cGVvZiAodmFsdWUpID09ICdudW1iZXInLFxuICAgICAgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKTtcblxuICBhc3NlcnQub2sodmFsdWUgPD0gbWF4LCAndmFsdWUgbGFyZ2VyIHRoYW4gbWF4aW11bSBhbGxvd2VkIHZhbHVlJyk7XG5cbiAgYXNzZXJ0Lm9rKHZhbHVlID49IG1pbiwgJ3ZhbHVlIHNtYWxsZXIgdGhhbiBtaW5pbXVtIGFsbG93ZWQgdmFsdWUnKTtcblxuICBhc3NlcnQub2soTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlLCAndmFsdWUgaGFzIGEgZnJhY3Rpb25hbCBjb21wb25lbnQnKTtcbn1cblxuZnVuY3Rpb24gdmVyaWZJRUVFNzU0KHZhbHVlLCBtYXgsIG1pbikge1xuICBhc3NlcnQub2sodHlwZW9mICh2YWx1ZSkgPT0gJ251bWJlcicsXG4gICAgICAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpO1xuXG4gIGFzc2VydC5vayh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBsYXJnZXIgdGhhbiBtYXhpbXVtIGFsbG93ZWQgdmFsdWUnKTtcblxuICBhc3NlcnQub2sodmFsdWUgPj0gbWluLCAndmFsdWUgc21hbGxlciB0aGFuIG1pbmltdW0gYWxsb3dlZCB2YWx1ZScpO1xufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50OCA9IGZ1bmN0aW9uKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhciBidWZmZXIgPSB0aGlzO1xuXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQub2sodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3NpbmcgdmFsdWUnKTtcblxuICAgIGFzc2VydC5vayhvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIG9mZnNldCcpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCA8IGJ1ZmZlci5sZW5ndGgsXG4gICAgICAgICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKTtcblxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZiwgLTB4ODApO1xuICB9XG5cbiAgaWYgKHZhbHVlID49IDApIHtcbiAgICBidWZmZXIud3JpdGVVSW50OCh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCk7XG4gIH0gZWxzZSB7XG4gICAgYnVmZmVyLndyaXRlVUludDgoMHhmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBub0Fzc2VydCk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHdyaXRlSW50MTYoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0JpZ0VuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydC5vayh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyB2YWx1ZScpO1xuXG4gICAgYXNzZXJ0Lm9rKHR5cGVvZiAoaXNCaWdFbmRpYW4pID09PSAnYm9vbGVhbicsXG4gICAgICAgICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyBvZmZzZXQnKTtcblxuICAgIGFzc2VydC5vayhvZmZzZXQgKyAxIDwgYnVmZmVyLmxlbmd0aCxcbiAgICAgICAgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpO1xuXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmZmYsIC0weDgwMDApO1xuICB9XG5cbiAgaWYgKHZhbHVlID49IDApIHtcbiAgICB3cml0ZVVJbnQxNihidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzQmlnRW5kaWFuLCBub0Fzc2VydCk7XG4gIH0gZWxzZSB7XG4gICAgd3JpdGVVSW50MTYoYnVmZmVyLCAweGZmZmYgKyB2YWx1ZSArIDEsIG9mZnNldCwgaXNCaWdFbmRpYW4sIG5vQXNzZXJ0KTtcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZMRSA9IGZ1bmN0aW9uKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHdyaXRlSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KTtcbn07XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkJFID0gZnVuY3Rpb24odmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgd3JpdGVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydCk7XG59O1xuXG5mdW5jdGlvbiB3cml0ZUludDMyKGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNCaWdFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQub2sodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3NpbmcgdmFsdWUnKTtcblxuICAgIGFzc2VydC5vayh0eXBlb2YgKGlzQmlnRW5kaWFuKSA9PT0gJ2Jvb2xlYW4nLFxuICAgICAgICAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3Npbmcgb2Zmc2V0Jyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0ICsgMyA8IGJ1ZmZlci5sZW5ndGgsXG4gICAgICAgICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKTtcblxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApO1xuICB9XG5cbiAgaWYgKHZhbHVlID49IDApIHtcbiAgICB3cml0ZVVJbnQzMihidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzQmlnRW5kaWFuLCBub0Fzc2VydCk7XG4gIH0gZWxzZSB7XG4gICAgd3JpdGVVSW50MzIoYnVmZmVyLCAweGZmZmZmZmZmICsgdmFsdWUgKyAxLCBvZmZzZXQsIGlzQmlnRW5kaWFuLCBub0Fzc2VydCk7XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyTEUgPSBmdW5jdGlvbih2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB3cml0ZUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydCk7XG59O1xuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJCRSA9IGZ1bmN0aW9uKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHdyaXRlSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpO1xufTtcblxuZnVuY3Rpb24gd3JpdGVGbG9hdChidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzQmlnRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0Lm9rKHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIHZhbHVlJyk7XG5cbiAgICBhc3NlcnQub2sodHlwZW9mIChpc0JpZ0VuZGlhbikgPT09ICdib29sZWFuJyxcbiAgICAgICAgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKTtcblxuICAgIGFzc2VydC5vayhvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIG9mZnNldCcpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCArIDMgPCBidWZmZXIubGVuZ3RoLFxuICAgICAgICAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJyk7XG5cbiAgICB2ZXJpZklFRUU3NTQodmFsdWUsIDMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgsIC0zLjQwMjgyMzQ2NjM4NTI4ODZlKzM4KTtcbiAgfVxuXG4gIHJlcXVpcmUoJy4vYnVmZmVyX2llZWU3NTQnKS53cml0ZUlFRUU3NTQoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0JpZ0VuZGlhbixcbiAgICAgIDIzLCA0KTtcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0TEUgPSBmdW5jdGlvbih2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB3cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydCk7XG59O1xuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRCRSA9IGZ1bmN0aW9uKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHdyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpO1xufTtcblxuZnVuY3Rpb24gd3JpdGVEb3VibGUoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0JpZ0VuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydC5vayh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyB2YWx1ZScpO1xuXG4gICAgYXNzZXJ0Lm9rKHR5cGVvZiAoaXNCaWdFbmRpYW4pID09PSAnYm9vbGVhbicsXG4gICAgICAgICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyBvZmZzZXQnKTtcblxuICAgIGFzc2VydC5vayhvZmZzZXQgKyA3IDwgYnVmZmVyLmxlbmd0aCxcbiAgICAgICAgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpO1xuXG4gICAgdmVyaWZJRUVFNzU0KHZhbHVlLCAxLjc5NzY5MzEzNDg2MjMxNTdFKzMwOCwgLTEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4KTtcbiAgfVxuXG4gIHJlcXVpcmUoJy4vYnVmZmVyX2llZWU3NTQnKS53cml0ZUlFRUU3NTQoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0JpZ0VuZGlhbixcbiAgICAgIDUyLCA4KTtcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUxFID0gZnVuY3Rpb24odmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KTtcbn07XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVCRSA9IGZ1bmN0aW9uKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHdyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KTtcbn07XG5cblNsb3dCdWZmZXIucHJvdG90eXBlLnJlYWRVSW50OCA9IEJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQ4O1xuU2xvd0J1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkxFID0gQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2TEU7XG5TbG93QnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2QkUgPSBCdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZCRTtcblNsb3dCdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJMRSA9IEJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFO1xuU2xvd0J1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkJFID0gQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyQkU7XG5TbG93QnVmZmVyLnByb3RvdHlwZS5yZWFkSW50OCA9IEJ1ZmZlci5wcm90b3R5cGUucmVhZEludDg7XG5TbG93QnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZMRSA9IEJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEU7XG5TbG93QnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZCRSA9IEJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2QkU7XG5TbG93QnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJMRSA9IEJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyTEU7XG5TbG93QnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJCRSA9IEJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyQkU7XG5TbG93QnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRMRSA9IEJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0TEU7XG5TbG93QnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRCRSA9IEJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0QkU7XG5TbG93QnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlTEUgPSBCdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVMRTtcblNsb3dCdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVCRSA9IEJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUJFO1xuU2xvd0J1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IEJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50ODtcblNsb3dCdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEUgPSBCdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEU7XG5TbG93QnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkJFID0gQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkJFO1xuU2xvd0J1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJMRSA9IEJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJMRTtcblNsb3dCdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyQkUgPSBCdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyQkU7XG5TbG93QnVmZmVyLnByb3RvdHlwZS53cml0ZUludDggPSBCdWZmZXIucHJvdG90eXBlLndyaXRlSW50ODtcblNsb3dCdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZMRSA9IEJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkxFO1xuU2xvd0J1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkJFID0gQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2QkU7XG5TbG93QnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyTEUgPSBCdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJMRTtcblNsb3dCdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJCRSA9IEJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkJFO1xuU2xvd0J1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdExFID0gQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0TEU7XG5TbG93QnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0QkUgPSBCdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRCRTtcblNsb3dCdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlTEUgPSBCdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlTEU7XG5TbG93QnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUJFID0gQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUJFO1xuXG59LHtcImFzc2VydFwiOjEsXCIuL2J1ZmZlcl9pZWVlNzU0XCI6NSxcImJhc2U2NC1qc1wiOjd9XSw3OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcbihmdW5jdGlvbiAoZXhwb3J0cykge1xuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIGxvb2t1cCA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJztcblxuXHRmdW5jdGlvbiBiNjRUb0J5dGVBcnJheShiNjQpIHtcblx0XHR2YXIgaSwgaiwgbCwgdG1wLCBwbGFjZUhvbGRlcnMsIGFycjtcblx0XG5cdFx0aWYgKGI2NC5sZW5ndGggJSA0ID4gMCkge1xuXHRcdFx0dGhyb3cgJ0ludmFsaWQgc3RyaW5nLiBMZW5ndGggbXVzdCBiZSBhIG11bHRpcGxlIG9mIDQnO1xuXHRcdH1cblxuXHRcdC8vIHRoZSBudW1iZXIgb2YgZXF1YWwgc2lnbnMgKHBsYWNlIGhvbGRlcnMpXG5cdFx0Ly8gaWYgdGhlcmUgYXJlIHR3byBwbGFjZWhvbGRlcnMsIHRoYW4gdGhlIHR3byBjaGFyYWN0ZXJzIGJlZm9yZSBpdFxuXHRcdC8vIHJlcHJlc2VudCBvbmUgYnl0ZVxuXHRcdC8vIGlmIHRoZXJlIGlzIG9ubHkgb25lLCB0aGVuIHRoZSB0aHJlZSBjaGFyYWN0ZXJzIGJlZm9yZSBpdCByZXByZXNlbnQgMiBieXRlc1xuXHRcdC8vIHRoaXMgaXMganVzdCBhIGNoZWFwIGhhY2sgdG8gbm90IGRvIGluZGV4T2YgdHdpY2Vcblx0XHRwbGFjZUhvbGRlcnMgPSBiNjQuaW5kZXhPZignPScpO1xuXHRcdHBsYWNlSG9sZGVycyA9IHBsYWNlSG9sZGVycyA+IDAgPyBiNjQubGVuZ3RoIC0gcGxhY2VIb2xkZXJzIDogMDtcblxuXHRcdC8vIGJhc2U2NCBpcyA0LzMgKyB1cCB0byB0d28gY2hhcmFjdGVycyBvZiB0aGUgb3JpZ2luYWwgZGF0YVxuXHRcdGFyciA9IFtdOy8vbmV3IFVpbnQ4QXJyYXkoYjY0Lmxlbmd0aCAqIDMgLyA0IC0gcGxhY2VIb2xkZXJzKTtcblxuXHRcdC8vIGlmIHRoZXJlIGFyZSBwbGFjZWhvbGRlcnMsIG9ubHkgZ2V0IHVwIHRvIHRoZSBsYXN0IGNvbXBsZXRlIDQgY2hhcnNcblx0XHRsID0gcGxhY2VIb2xkZXJzID4gMCA/IGI2NC5sZW5ndGggLSA0IDogYjY0Lmxlbmd0aDtcblxuXHRcdGZvciAoaSA9IDAsIGogPSAwOyBpIDwgbDsgaSArPSA0LCBqICs9IDMpIHtcblx0XHRcdHRtcCA9IChsb29rdXAuaW5kZXhPZihiNjRbaV0pIDw8IDE4KSB8IChsb29rdXAuaW5kZXhPZihiNjRbaSArIDFdKSA8PCAxMikgfCAobG9va3VwLmluZGV4T2YoYjY0W2kgKyAyXSkgPDwgNikgfCBsb29rdXAuaW5kZXhPZihiNjRbaSArIDNdKTtcblx0XHRcdGFyci5wdXNoKCh0bXAgJiAweEZGMDAwMCkgPj4gMTYpO1xuXHRcdFx0YXJyLnB1c2goKHRtcCAmIDB4RkYwMCkgPj4gOCk7XG5cdFx0XHRhcnIucHVzaCh0bXAgJiAweEZGKTtcblx0XHR9XG5cblx0XHRpZiAocGxhY2VIb2xkZXJzID09PSAyKSB7XG5cdFx0XHR0bXAgPSAobG9va3VwLmluZGV4T2YoYjY0W2ldKSA8PCAyKSB8IChsb29rdXAuaW5kZXhPZihiNjRbaSArIDFdKSA+PiA0KTtcblx0XHRcdGFyci5wdXNoKHRtcCAmIDB4RkYpO1xuXHRcdH0gZWxzZSBpZiAocGxhY2VIb2xkZXJzID09PSAxKSB7XG5cdFx0XHR0bXAgPSAobG9va3VwLmluZGV4T2YoYjY0W2ldKSA8PCAxMCkgfCAobG9va3VwLmluZGV4T2YoYjY0W2kgKyAxXSkgPDwgNCkgfCAobG9va3VwLmluZGV4T2YoYjY0W2kgKyAyXSkgPj4gMik7XG5cdFx0XHRhcnIucHVzaCgodG1wID4+IDgpICYgMHhGRik7XG5cdFx0XHRhcnIucHVzaCh0bXAgJiAweEZGKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gYXJyO1xuXHR9XG5cblx0ZnVuY3Rpb24gdWludDhUb0Jhc2U2NCh1aW50OCkge1xuXHRcdHZhciBpLFxuXHRcdFx0ZXh0cmFCeXRlcyA9IHVpbnQ4Lmxlbmd0aCAlIDMsIC8vIGlmIHdlIGhhdmUgMSBieXRlIGxlZnQsIHBhZCAyIGJ5dGVzXG5cdFx0XHRvdXRwdXQgPSBcIlwiLFxuXHRcdFx0dGVtcCwgbGVuZ3RoO1xuXG5cdFx0ZnVuY3Rpb24gdHJpcGxldFRvQmFzZTY0IChudW0pIHtcblx0XHRcdHJldHVybiBsb29rdXBbbnVtID4+IDE4ICYgMHgzRl0gKyBsb29rdXBbbnVtID4+IDEyICYgMHgzRl0gKyBsb29rdXBbbnVtID4+IDYgJiAweDNGXSArIGxvb2t1cFtudW0gJiAweDNGXTtcblx0XHR9O1xuXG5cdFx0Ly8gZ28gdGhyb3VnaCB0aGUgYXJyYXkgZXZlcnkgdGhyZWUgYnl0ZXMsIHdlJ2xsIGRlYWwgd2l0aCB0cmFpbGluZyBzdHVmZiBsYXRlclxuXHRcdGZvciAoaSA9IDAsIGxlbmd0aCA9IHVpbnQ4Lmxlbmd0aCAtIGV4dHJhQnl0ZXM7IGkgPCBsZW5ndGg7IGkgKz0gMykge1xuXHRcdFx0dGVtcCA9ICh1aW50OFtpXSA8PCAxNikgKyAodWludDhbaSArIDFdIDw8IDgpICsgKHVpbnQ4W2kgKyAyXSk7XG5cdFx0XHRvdXRwdXQgKz0gdHJpcGxldFRvQmFzZTY0KHRlbXApO1xuXHRcdH1cblxuXHRcdC8vIHBhZCB0aGUgZW5kIHdpdGggemVyb3MsIGJ1dCBtYWtlIHN1cmUgdG8gbm90IGZvcmdldCB0aGUgZXh0cmEgYnl0ZXNcblx0XHRzd2l0Y2ggKGV4dHJhQnl0ZXMpIHtcblx0XHRcdGNhc2UgMTpcblx0XHRcdFx0dGVtcCA9IHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDFdO1xuXHRcdFx0XHRvdXRwdXQgKz0gbG9va3VwW3RlbXAgPj4gMl07XG5cdFx0XHRcdG91dHB1dCArPSBsb29rdXBbKHRlbXAgPDwgNCkgJiAweDNGXTtcblx0XHRcdFx0b3V0cHV0ICs9ICc9PSc7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHR0ZW1wID0gKHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDJdIDw8IDgpICsgKHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDFdKTtcblx0XHRcdFx0b3V0cHV0ICs9IGxvb2t1cFt0ZW1wID4+IDEwXTtcblx0XHRcdFx0b3V0cHV0ICs9IGxvb2t1cFsodGVtcCA+PiA0KSAmIDB4M0ZdO1xuXHRcdFx0XHRvdXRwdXQgKz0gbG9va3VwWyh0ZW1wIDw8IDIpICYgMHgzRl07XG5cdFx0XHRcdG91dHB1dCArPSAnPSc7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblxuXHRcdHJldHVybiBvdXRwdXQ7XG5cdH1cblxuXHRtb2R1bGUuZXhwb3J0cy50b0J5dGVBcnJheSA9IGI2NFRvQnl0ZUFycmF5O1xuXHRtb2R1bGUuZXhwb3J0cy5mcm9tQnl0ZUFycmF5ID0gdWludDhUb0Jhc2U2NDtcbn0oKSk7XG5cbn0se31dLDg6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuZXhwb3J0cy5yZWFkSUVFRTc1NCA9IGZ1bmN0aW9uKGJ1ZmZlciwgb2Zmc2V0LCBpc0JFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sXG4gICAgICBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxLFxuICAgICAgZU1heCA9ICgxIDw8IGVMZW4pIC0gMSxcbiAgICAgIGVCaWFzID0gZU1heCA+PiAxLFxuICAgICAgbkJpdHMgPSAtNyxcbiAgICAgIGkgPSBpc0JFID8gMCA6IChuQnl0ZXMgLSAxKSxcbiAgICAgIGQgPSBpc0JFID8gMSA6IC0xLFxuICAgICAgcyA9IGJ1ZmZlcltvZmZzZXQgKyBpXTtcblxuICBpICs9IGQ7XG5cbiAgZSA9IHMgJiAoKDEgPDwgKC1uQml0cykpIC0gMSk7XG4gIHMgPj49ICgtbkJpdHMpO1xuICBuQml0cyArPSBlTGVuO1xuICBmb3IgKDsgbkJpdHMgPiAwOyBlID0gZSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KTtcblxuICBtID0gZSAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKTtcbiAgZSA+Pj0gKC1uQml0cyk7XG4gIG5CaXRzICs9IG1MZW47XG4gIGZvciAoOyBuQml0cyA+IDA7IG0gPSBtICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpO1xuXG4gIGlmIChlID09PSAwKSB7XG4gICAgZSA9IDEgLSBlQmlhcztcbiAgfSBlbHNlIGlmIChlID09PSBlTWF4KSB7XG4gICAgcmV0dXJuIG0gPyBOYU4gOiAoKHMgPyAtMSA6IDEpICogSW5maW5pdHkpO1xuICB9IGVsc2Uge1xuICAgIG0gPSBtICsgTWF0aC5wb3coMiwgbUxlbik7XG4gICAgZSA9IGUgLSBlQmlhcztcbiAgfVxuICByZXR1cm4gKHMgPyAtMSA6IDEpICogbSAqIE1hdGgucG93KDIsIGUgLSBtTGVuKTtcbn07XG5cbmV4cG9ydHMud3JpdGVJRUVFNzU0ID0gZnVuY3Rpb24oYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0JFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sIGMsXG4gICAgICBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxLFxuICAgICAgZU1heCA9ICgxIDw8IGVMZW4pIC0gMSxcbiAgICAgIGVCaWFzID0gZU1heCA+PiAxLFxuICAgICAgcnQgPSAobUxlbiA9PT0gMjMgPyBNYXRoLnBvdygyLCAtMjQpIC0gTWF0aC5wb3coMiwgLTc3KSA6IDApLFxuICAgICAgaSA9IGlzQkUgPyAobkJ5dGVzIC0gMSkgOiAwLFxuICAgICAgZCA9IGlzQkUgPyAtMSA6IDEsXG4gICAgICBzID0gdmFsdWUgPCAwIHx8ICh2YWx1ZSA9PT0gMCAmJiAxIC8gdmFsdWUgPCAwKSA/IDEgOiAwO1xuXG4gIHZhbHVlID0gTWF0aC5hYnModmFsdWUpO1xuXG4gIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IEluZmluaXR5KSB7XG4gICAgbSA9IGlzTmFOKHZhbHVlKSA/IDEgOiAwO1xuICAgIGUgPSBlTWF4O1xuICB9IGVsc2Uge1xuICAgIGUgPSBNYXRoLmZsb29yKE1hdGgubG9nKHZhbHVlKSAvIE1hdGguTE4yKTtcbiAgICBpZiAodmFsdWUgKiAoYyA9IE1hdGgucG93KDIsIC1lKSkgPCAxKSB7XG4gICAgICBlLS07XG4gICAgICBjICo9IDI7XG4gICAgfVxuICAgIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgdmFsdWUgKz0gcnQgLyBjO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSArPSBydCAqIE1hdGgucG93KDIsIDEgLSBlQmlhcyk7XG4gICAgfVxuICAgIGlmICh2YWx1ZSAqIGMgPj0gMikge1xuICAgICAgZSsrO1xuICAgICAgYyAvPSAyO1xuICAgIH1cblxuICAgIGlmIChlICsgZUJpYXMgPj0gZU1heCkge1xuICAgICAgbSA9IDA7XG4gICAgICBlID0gZU1heDtcbiAgICB9IGVsc2UgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICBtID0gKHZhbHVlICogYyAtIDEpICogTWF0aC5wb3coMiwgbUxlbik7XG4gICAgICBlID0gZSArIGVCaWFzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gdmFsdWUgKiBNYXRoLnBvdygyLCBlQmlhcyAtIDEpICogTWF0aC5wb3coMiwgbUxlbik7XG4gICAgICBlID0gMDtcbiAgICB9XG4gIH1cblxuICBmb3IgKDsgbUxlbiA+PSA4OyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBtICYgMHhmZiwgaSArPSBkLCBtIC89IDI1NiwgbUxlbiAtPSA4KTtcblxuICBlID0gKGUgPDwgbUxlbikgfCBtO1xuICBlTGVuICs9IG1MZW47XG4gIGZvciAoOyBlTGVuID4gMDsgYnVmZmVyW29mZnNldCArIGldID0gZSAmIDB4ZmYsIGkgKz0gZCwgZSAvPSAyNTYsIGVMZW4gLT0gOCk7XG5cbiAgYnVmZmVyW29mZnNldCArIGkgLSBkXSB8PSBzICogMTI4O1xufTtcblxufSx7fV0sMzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5mdW5jdGlvbiBTbG93QnVmZmVyIChzaXplKSB7XG4gICAgdGhpcy5sZW5ndGggPSBzaXplO1xufTtcblxudmFyIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpO1xuXG5leHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTID0gNTA7XG5cblxuZnVuY3Rpb24gdG9IZXgobikge1xuICBpZiAobiA8IDE2KSByZXR1cm4gJzAnICsgbi50b1N0cmluZygxNik7XG4gIHJldHVybiBuLnRvU3RyaW5nKDE2KTtcbn1cblxuZnVuY3Rpb24gdXRmOFRvQnl0ZXMoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspXG4gICAgaWYgKHN0ci5jaGFyQ29kZUF0KGkpIDw9IDB4N0YpXG4gICAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSk7XG4gICAgZWxzZSB7XG4gICAgICB2YXIgaCA9IGVuY29kZVVSSUNvbXBvbmVudChzdHIuY2hhckF0KGkpKS5zdWJzdHIoMSkuc3BsaXQoJyUnKTtcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaC5sZW5ndGg7IGorKylcbiAgICAgICAgYnl0ZUFycmF5LnB1c2gocGFyc2VJbnQoaFtqXSwgMTYpKTtcbiAgICB9XG5cbiAgcmV0dXJuIGJ5dGVBcnJheTtcbn1cblxuZnVuY3Rpb24gYXNjaWlUb0J5dGVzKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKysgKVxuICAgIC8vIE5vZGUncyBjb2RlIHNlZW1zIHRvIGJlIGRvaW5nIHRoaXMgYW5kIG5vdCAmIDB4N0YuLlxuICAgIGJ5dGVBcnJheS5wdXNoKCBzdHIuY2hhckNvZGVBdChpKSAmIDB4RkYgKTtcblxuICByZXR1cm4gYnl0ZUFycmF5O1xufVxuXG5mdW5jdGlvbiBiYXNlNjRUb0J5dGVzKHN0cikge1xuICByZXR1cm4gcmVxdWlyZShcImJhc2U2NC1qc1wiKS50b0J5dGVBcnJheShzdHIpO1xufVxuXG5TbG93QnVmZmVyLmJ5dGVMZW5ndGggPSBmdW5jdGlvbiAoc3RyLCBlbmNvZGluZykge1xuICBzd2l0Y2ggKGVuY29kaW5nIHx8IFwidXRmOFwiKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldHVybiBzdHIubGVuZ3RoIC8gMjtcblxuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldHVybiB1dGY4VG9CeXRlcyhzdHIpLmxlbmd0aDtcblxuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIHJldHVybiBzdHIubGVuZ3RoO1xuXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldHVybiBiYXNlNjRUb0J5dGVzKHN0cikubGVuZ3RoO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBibGl0QnVmZmVyKHNyYywgZHN0LCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgcG9zLCBpID0gMDtcbiAgd2hpbGUgKGkgPCBsZW5ndGgpIHtcbiAgICBpZiAoKGkrb2Zmc2V0ID49IGRzdC5sZW5ndGgpIHx8IChpID49IHNyYy5sZW5ndGgpKVxuICAgICAgYnJlYWs7XG5cbiAgICBkc3RbaSArIG9mZnNldF0gPSBzcmNbaV07XG4gICAgaSsrO1xuICB9XG4gIHJldHVybiBpO1xufVxuXG5TbG93QnVmZmVyLnByb3RvdHlwZS51dGY4V3JpdGUgPSBmdW5jdGlvbiAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgYnl0ZXMsIHBvcztcbiAgcmV0dXJuIFNsb3dCdWZmZXIuX2NoYXJzV3JpdHRlbiA9ICBibGl0QnVmZmVyKHV0ZjhUb0J5dGVzKHN0cmluZyksIHRoaXMsIG9mZnNldCwgbGVuZ3RoKTtcbn07XG5cblNsb3dCdWZmZXIucHJvdG90eXBlLmFzY2lpV3JpdGUgPSBmdW5jdGlvbiAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgYnl0ZXMsIHBvcztcbiAgcmV0dXJuIFNsb3dCdWZmZXIuX2NoYXJzV3JpdHRlbiA9ICBibGl0QnVmZmVyKGFzY2lpVG9CeXRlcyhzdHJpbmcpLCB0aGlzLCBvZmZzZXQsIGxlbmd0aCk7XG59O1xuXG5TbG93QnVmZmVyLnByb3RvdHlwZS5iYXNlNjRXcml0ZSA9IGZ1bmN0aW9uIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBieXRlcywgcG9zO1xuICByZXR1cm4gU2xvd0J1ZmZlci5fY2hhcnNXcml0dGVuID0gYmxpdEJ1ZmZlcihiYXNlNjRUb0J5dGVzKHN0cmluZyksIHRoaXMsIG9mZnNldCwgbGVuZ3RoKTtcbn07XG5cblNsb3dCdWZmZXIucHJvdG90eXBlLmJhc2U2NFNsaWNlID0gZnVuY3Rpb24gKHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGJ5dGVzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgcmV0dXJuIHJlcXVpcmUoXCJiYXNlNjQtanNcIikuZnJvbUJ5dGVBcnJheShieXRlcyk7XG59XG5cbmZ1bmN0aW9uIGRlY29kZVV0ZjhDaGFyKHN0cikge1xuICB0cnkge1xuICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoc3RyKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoMHhGRkZEKTsgLy8gVVRGIDggaW52YWxpZCBjaGFyXG4gIH1cbn1cblxuU2xvd0J1ZmZlci5wcm90b3R5cGUudXRmOFNsaWNlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgYnl0ZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgdmFyIHJlcyA9IFwiXCI7XG4gIHZhciB0bXAgPSBcIlwiO1xuICB2YXIgaSA9IDA7XG4gIHdoaWxlIChpIDwgYnl0ZXMubGVuZ3RoKSB7XG4gICAgaWYgKGJ5dGVzW2ldIDw9IDB4N0YpIHtcbiAgICAgIHJlcyArPSBkZWNvZGVVdGY4Q2hhcih0bXApICsgU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSk7XG4gICAgICB0bXAgPSBcIlwiO1xuICAgIH0gZWxzZVxuICAgICAgdG1wICs9IFwiJVwiICsgYnl0ZXNbaV0udG9TdHJpbmcoMTYpO1xuXG4gICAgaSsrO1xuICB9XG5cbiAgcmV0dXJuIHJlcyArIGRlY29kZVV0ZjhDaGFyKHRtcCk7XG59XG5cblNsb3dCdWZmZXIucHJvdG90eXBlLmFzY2lpU2xpY2UgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBieXRlcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB2YXIgcmV0ID0gXCJcIjtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkrKylcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSk7XG4gIHJldHVybiByZXQ7XG59XG5cblNsb3dCdWZmZXIucHJvdG90eXBlLmluc3BlY3QgPSBmdW5jdGlvbigpIHtcbiAgdmFyIG91dCA9IFtdLFxuICAgICAgbGVuID0gdGhpcy5sZW5ndGg7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICBvdXRbaV0gPSB0b0hleCh0aGlzW2ldKTtcbiAgICBpZiAoaSA9PSBleHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTKSB7XG4gICAgICBvdXRbaSArIDFdID0gJy4uLic7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuICc8U2xvd0J1ZmZlciAnICsgb3V0LmpvaW4oJyAnKSArICc+Jztcbn07XG5cblxuU2xvd0J1ZmZlci5wcm90b3R5cGUuaGV4U2xpY2UgPSBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aDtcblxuICBpZiAoIXN0YXJ0IHx8IHN0YXJ0IDwgMCkgc3RhcnQgPSAwO1xuICBpZiAoIWVuZCB8fCBlbmQgPCAwIHx8IGVuZCA+IGxlbikgZW5kID0gbGVuO1xuXG4gIHZhciBvdXQgPSAnJztcbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICBvdXQgKz0gdG9IZXgodGhpc1tpXSk7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn07XG5cblxuU2xvd0J1ZmZlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbihlbmNvZGluZywgc3RhcnQsIGVuZCkge1xuICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKCk7XG4gIHN0YXJ0ID0gK3N0YXJ0IHx8IDA7XG4gIGlmICh0eXBlb2YgZW5kID09ICd1bmRlZmluZWQnKSBlbmQgPSB0aGlzLmxlbmd0aDtcblxuICAvLyBGYXN0cGF0aCBlbXB0eSBzdHJpbmdzXG4gIGlmICgrZW5kID09IHN0YXJ0KSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgc3dpdGNoIChlbmNvZGluZykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXR1cm4gdGhpcy5oZXhTbGljZShzdGFydCwgZW5kKTtcblxuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldHVybiB0aGlzLnV0ZjhTbGljZShzdGFydCwgZW5kKTtcblxuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIHJldHVybiB0aGlzLmFzY2lpU2xpY2Uoc3RhcnQsIGVuZCk7XG5cbiAgICBjYXNlICdiaW5hcnknOlxuICAgICAgcmV0dXJuIHRoaXMuYmluYXJ5U2xpY2Uoc3RhcnQsIGVuZCk7XG5cbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0dXJuIHRoaXMuYmFzZTY0U2xpY2Uoc3RhcnQsIGVuZCk7XG5cbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgICByZXR1cm4gdGhpcy51Y3MyU2xpY2Uoc3RhcnQsIGVuZCk7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJyk7XG4gIH1cbn07XG5cblxuU2xvd0J1ZmZlci5wcm90b3R5cGUuaGV4V3JpdGUgPSBmdW5jdGlvbihzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIG9mZnNldCA9ICtvZmZzZXQgfHwgMDtcbiAgdmFyIHJlbWFpbmluZyA9IHRoaXMubGVuZ3RoIC0gb2Zmc2V0O1xuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZztcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSArbGVuZ3RoO1xuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZztcbiAgICB9XG4gIH1cblxuICAvLyBtdXN0IGJlIGFuIGV2ZW4gbnVtYmVyIG9mIGRpZ2l0c1xuICB2YXIgc3RyTGVuID0gc3RyaW5nLmxlbmd0aDtcbiAgaWYgKHN0ckxlbiAlIDIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgaGV4IHN0cmluZycpO1xuICB9XG4gIGlmIChsZW5ndGggPiBzdHJMZW4gLyAyKSB7XG4gICAgbGVuZ3RoID0gc3RyTGVuIC8gMjtcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGJ5dGUgPSBwYXJzZUludChzdHJpbmcuc3Vic3RyKGkgKiAyLCAyKSwgMTYpO1xuICAgIGlmIChpc05hTihieXRlKSkgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGhleCBzdHJpbmcnKTtcbiAgICB0aGlzW29mZnNldCArIGldID0gYnl0ZTtcbiAgfVxuICBTbG93QnVmZmVyLl9jaGFyc1dyaXR0ZW4gPSBpICogMjtcbiAgcmV0dXJuIGk7XG59O1xuXG5cblNsb3dCdWZmZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24oc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpIHtcbiAgLy8gU3VwcG9ydCBib3RoIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZylcbiAgLy8gYW5kIHRoZSBsZWdhY3kgKHN0cmluZywgZW5jb2RpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICBpZiAoaXNGaW5pdGUob2Zmc2V0KSkge1xuICAgIGlmICghaXNGaW5pdGUobGVuZ3RoKSkge1xuICAgICAgZW5jb2RpbmcgPSBsZW5ndGg7XG4gICAgICBsZW5ndGggPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9IGVsc2UgeyAgLy8gbGVnYWN5XG4gICAgdmFyIHN3YXAgPSBlbmNvZGluZztcbiAgICBlbmNvZGluZyA9IG9mZnNldDtcbiAgICBvZmZzZXQgPSBsZW5ndGg7XG4gICAgbGVuZ3RoID0gc3dhcDtcbiAgfVxuXG4gIG9mZnNldCA9ICtvZmZzZXQgfHwgMDtcbiAgdmFyIHJlbWFpbmluZyA9IHRoaXMubGVuZ3RoIC0gb2Zmc2V0O1xuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZztcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSArbGVuZ3RoO1xuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZztcbiAgICB9XG4gIH1cbiAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcgfHwgJ3V0ZjgnKS50b0xvd2VyQ2FzZSgpO1xuXG4gIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0dXJuIHRoaXMuaGV4V3JpdGUoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCk7XG5cbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXR1cm4gdGhpcy51dGY4V3JpdGUoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCk7XG5cbiAgICBjYXNlICdhc2NpaSc6XG4gICAgICByZXR1cm4gdGhpcy5hc2NpaVdyaXRlKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpO1xuXG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldHVybiB0aGlzLmJpbmFyeVdyaXRlKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpO1xuXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldHVybiB0aGlzLmJhc2U2NFdyaXRlKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpO1xuXG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgICAgcmV0dXJuIHRoaXMudWNzMldyaXRlKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpO1xuICB9XG59O1xuXG5cbi8vIHNsaWNlKHN0YXJ0LCBlbmQpXG5TbG93QnVmZmVyLnByb3RvdHlwZS5zbGljZSA9IGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgaWYgKGVuZCA9PT0gdW5kZWZpbmVkKSBlbmQgPSB0aGlzLmxlbmd0aDtcblxuICBpZiAoZW5kID4gdGhpcy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ29vYicpO1xuICB9XG4gIGlmIChzdGFydCA+IGVuZCkge1xuICAgIHRocm93IG5ldyBFcnJvcignb29iJyk7XG4gIH1cblxuICByZXR1cm4gbmV3IEJ1ZmZlcih0aGlzLCBlbmQgLSBzdGFydCwgK3N0YXJ0KTtcbn07XG5cblNsb3dCdWZmZXIucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbih0YXJnZXQsIHRhcmdldHN0YXJ0LCBzb3VyY2VzdGFydCwgc291cmNlZW5kKSB7XG4gIHZhciB0ZW1wID0gW107XG4gIGZvciAodmFyIGk9c291cmNlc3RhcnQ7IGk8c291cmNlZW5kOyBpKyspIHtcbiAgICBhc3NlcnQub2sodHlwZW9mIHRoaXNbaV0gIT09ICd1bmRlZmluZWQnLCBcImNvcHlpbmcgdW5kZWZpbmVkIGJ1ZmZlciBieXRlcyFcIik7XG4gICAgdGVtcC5wdXNoKHRoaXNbaV0pO1xuICB9XG5cbiAgZm9yICh2YXIgaT10YXJnZXRzdGFydDsgaTx0YXJnZXRzdGFydCt0ZW1wLmxlbmd0aDsgaSsrKSB7XG4gICAgdGFyZ2V0W2ldID0gdGVtcFtpLXRhcmdldHN0YXJ0XTtcbiAgfVxufTtcblxuZnVuY3Rpb24gY29lcmNlKGxlbmd0aCkge1xuICAvLyBDb2VyY2UgbGVuZ3RoIHRvIGEgbnVtYmVyIChwb3NzaWJseSBOYU4pLCByb3VuZCB1cFxuICAvLyBpbiBjYXNlIGl0J3MgZnJhY3Rpb25hbCAoZS5nLiAxMjMuNDU2KSB0aGVuIGRvIGFcbiAgLy8gZG91YmxlIG5lZ2F0ZSB0byBjb2VyY2UgYSBOYU4gdG8gMC4gRWFzeSwgcmlnaHQ/XG4gIGxlbmd0aCA9IH5+TWF0aC5jZWlsKCtsZW5ndGgpO1xuICByZXR1cm4gbGVuZ3RoIDwgMCA/IDAgOiBsZW5ndGg7XG59XG5cblxuLy8gQnVmZmVyXG5cbmZ1bmN0aW9uIEJ1ZmZlcihzdWJqZWN0LCBlbmNvZGluZywgb2Zmc2V0KSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBCdWZmZXIpKSB7XG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoc3ViamVjdCwgZW5jb2RpbmcsIG9mZnNldCk7XG4gIH1cblxuICB2YXIgdHlwZTtcblxuICAvLyBBcmUgd2Ugc2xpY2luZz9cbiAgaWYgKHR5cGVvZiBvZmZzZXQgPT09ICdudW1iZXInKSB7XG4gICAgdGhpcy5sZW5ndGggPSBjb2VyY2UoZW5jb2RpbmcpO1xuICAgIHRoaXMucGFyZW50ID0gc3ViamVjdDtcbiAgICB0aGlzLm9mZnNldCA9IG9mZnNldDtcbiAgfSBlbHNlIHtcbiAgICAvLyBGaW5kIHRoZSBsZW5ndGhcbiAgICBzd2l0Y2ggKHR5cGUgPSB0eXBlb2Ygc3ViamVjdCkge1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgdGhpcy5sZW5ndGggPSBjb2VyY2Uoc3ViamVjdCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICB0aGlzLmxlbmd0aCA9IEJ1ZmZlci5ieXRlTGVuZ3RoKHN1YmplY3QsIGVuY29kaW5nKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ29iamVjdCc6IC8vIEFzc3VtZSBvYmplY3QgaXMgYW4gYXJyYXlcbiAgICAgICAgdGhpcy5sZW5ndGggPSBjb2VyY2Uoc3ViamVjdC5sZW5ndGgpO1xuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGaXJzdCBhcmd1bWVudCBuZWVkcyB0byBiZSBhIG51bWJlciwgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnYXJyYXkgb3Igc3RyaW5nLicpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmxlbmd0aCA+IEJ1ZmZlci5wb29sU2l6ZSkge1xuICAgICAgLy8gQmlnIGJ1ZmZlciwganVzdCBhbGxvYyBvbmUuXG4gICAgICB0aGlzLnBhcmVudCA9IG5ldyBTbG93QnVmZmVyKHRoaXMubGVuZ3RoKTtcbiAgICAgIHRoaXMub2Zmc2V0ID0gMDtcblxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBTbWFsbCBidWZmZXIuXG4gICAgICBpZiAoIXBvb2wgfHwgcG9vbC5sZW5ndGggLSBwb29sLnVzZWQgPCB0aGlzLmxlbmd0aCkgYWxsb2NQb29sKCk7XG4gICAgICB0aGlzLnBhcmVudCA9IHBvb2w7XG4gICAgICB0aGlzLm9mZnNldCA9IHBvb2wudXNlZDtcbiAgICAgIHBvb2wudXNlZCArPSB0aGlzLmxlbmd0aDtcbiAgICB9XG5cbiAgICAvLyBUcmVhdCBhcnJheS1pc2ggb2JqZWN0cyBhcyBhIGJ5dGUgYXJyYXkuXG4gICAgaWYgKGlzQXJyYXlJc2goc3ViamVjdCkpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLnBhcmVudFtpICsgdGhpcy5vZmZzZXRdID0gc3ViamVjdFtpXTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGUgPT0gJ3N0cmluZycpIHtcbiAgICAgIC8vIFdlIGFyZSBhIHN0cmluZ1xuICAgICAgdGhpcy5sZW5ndGggPSB0aGlzLndyaXRlKHN1YmplY3QsIDAsIGVuY29kaW5nKTtcbiAgICB9XG4gIH1cblxufVxuXG5mdW5jdGlvbiBpc0FycmF5SXNoKHN1YmplY3QpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoc3ViamVjdCkgfHwgQnVmZmVyLmlzQnVmZmVyKHN1YmplY3QpIHx8XG4gICAgICAgICBzdWJqZWN0ICYmIHR5cGVvZiBzdWJqZWN0ID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAgdHlwZW9mIHN1YmplY3QubGVuZ3RoID09PSAnbnVtYmVyJztcbn1cblxuZXhwb3J0cy5TbG93QnVmZmVyID0gU2xvd0J1ZmZlcjtcbmV4cG9ydHMuQnVmZmVyID0gQnVmZmVyO1xuXG5CdWZmZXIucG9vbFNpemUgPSA4ICogMTAyNDtcbnZhciBwb29sO1xuXG5mdW5jdGlvbiBhbGxvY1Bvb2woKSB7XG4gIHBvb2wgPSBuZXcgU2xvd0J1ZmZlcihCdWZmZXIucG9vbFNpemUpO1xuICBwb29sLnVzZWQgPSAwO1xufVxuXG5cbi8vIFN0YXRpYyBtZXRob2RzXG5CdWZmZXIuaXNCdWZmZXIgPSBmdW5jdGlvbiBpc0J1ZmZlcihiKSB7XG4gIHJldHVybiBiIGluc3RhbmNlb2YgQnVmZmVyIHx8IGIgaW5zdGFuY2VvZiBTbG93QnVmZmVyO1xufTtcblxuQnVmZmVyLmNvbmNhdCA9IGZ1bmN0aW9uIChsaXN0LCB0b3RhbExlbmd0aCkge1xuICBpZiAoIUFycmF5LmlzQXJyYXkobGlzdCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJVc2FnZTogQnVmZmVyLmNvbmNhdChsaXN0LCBbdG90YWxMZW5ndGhdKVxcbiBcXFxuICAgICAgbGlzdCBzaG91bGQgYmUgYW4gQXJyYXkuXCIpO1xuICB9XG5cbiAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoMCk7XG4gIH0gZWxzZSBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gbGlzdFswXTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgdG90YWxMZW5ndGggIT09ICdudW1iZXInKSB7XG4gICAgdG90YWxMZW5ndGggPSAwO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGJ1ZiA9IGxpc3RbaV07XG4gICAgICB0b3RhbExlbmd0aCArPSBidWYubGVuZ3RoO1xuICAgIH1cbiAgfVxuXG4gIHZhciBidWZmZXIgPSBuZXcgQnVmZmVyKHRvdGFsTGVuZ3RoKTtcbiAgdmFyIHBvcyA9IDA7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBidWYgPSBsaXN0W2ldO1xuICAgIGJ1Zi5jb3B5KGJ1ZmZlciwgcG9zKTtcbiAgICBwb3MgKz0gYnVmLmxlbmd0aDtcbiAgfVxuICByZXR1cm4gYnVmZmVyO1xufTtcblxuLy8gSW5zcGVjdFxuQnVmZmVyLnByb3RvdHlwZS5pbnNwZWN0ID0gZnVuY3Rpb24gaW5zcGVjdCgpIHtcbiAgdmFyIG91dCA9IFtdLFxuICAgICAgbGVuID0gdGhpcy5sZW5ndGg7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIG91dFtpXSA9IHRvSGV4KHRoaXMucGFyZW50W2kgKyB0aGlzLm9mZnNldF0pO1xuICAgIGlmIChpID09IGV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMpIHtcbiAgICAgIG91dFtpICsgMV0gPSAnLi4uJztcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiAnPEJ1ZmZlciAnICsgb3V0LmpvaW4oJyAnKSArICc+Jztcbn07XG5cblxuQnVmZmVyLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiBnZXQoaSkge1xuICBpZiAoaSA8IDAgfHwgaSA+PSB0aGlzLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKCdvb2InKTtcbiAgcmV0dXJuIHRoaXMucGFyZW50W3RoaXMub2Zmc2V0ICsgaV07XG59O1xuXG5cbkJ1ZmZlci5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gc2V0KGksIHYpIHtcbiAgaWYgKGkgPCAwIHx8IGkgPj0gdGhpcy5sZW5ndGgpIHRocm93IG5ldyBFcnJvcignb29iJyk7XG4gIHJldHVybiB0aGlzLnBhcmVudFt0aGlzLm9mZnNldCArIGldID0gdjtcbn07XG5cblxuLy8gd3JpdGUoc3RyaW5nLCBvZmZzZXQgPSAwLCBsZW5ndGggPSBidWZmZXIubGVuZ3RoLW9mZnNldCwgZW5jb2RpbmcgPSAndXRmOCcpXG5CdWZmZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24oc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpIHtcbiAgLy8gU3VwcG9ydCBib3RoIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZylcbiAgLy8gYW5kIHRoZSBsZWdhY3kgKHN0cmluZywgZW5jb2RpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICBpZiAoaXNGaW5pdGUob2Zmc2V0KSkge1xuICAgIGlmICghaXNGaW5pdGUobGVuZ3RoKSkge1xuICAgICAgZW5jb2RpbmcgPSBsZW5ndGg7XG4gICAgICBsZW5ndGggPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9IGVsc2UgeyAgLy8gbGVnYWN5XG4gICAgdmFyIHN3YXAgPSBlbmNvZGluZztcbiAgICBlbmNvZGluZyA9IG9mZnNldDtcbiAgICBvZmZzZXQgPSBsZW5ndGg7XG4gICAgbGVuZ3RoID0gc3dhcDtcbiAgfVxuXG4gIG9mZnNldCA9ICtvZmZzZXQgfHwgMDtcbiAgdmFyIHJlbWFpbmluZyA9IHRoaXMubGVuZ3RoIC0gb2Zmc2V0O1xuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZztcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSArbGVuZ3RoO1xuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZztcbiAgICB9XG4gIH1cbiAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcgfHwgJ3V0ZjgnKS50b0xvd2VyQ2FzZSgpO1xuXG4gIHZhciByZXQ7XG4gIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gdGhpcy5wYXJlbnQuaGV4V3JpdGUoc3RyaW5nLCB0aGlzLm9mZnNldCArIG9mZnNldCwgbGVuZ3RoKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0ID0gdGhpcy5wYXJlbnQudXRmOFdyaXRlKHN0cmluZywgdGhpcy5vZmZzZXQgKyBvZmZzZXQsIGxlbmd0aCk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIHJldCA9IHRoaXMucGFyZW50LmFzY2lpV3JpdGUoc3RyaW5nLCB0aGlzLm9mZnNldCArIG9mZnNldCwgbGVuZ3RoKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldCA9IHRoaXMucGFyZW50LmJpbmFyeVdyaXRlKHN0cmluZywgdGhpcy5vZmZzZXQgKyBvZmZzZXQsIGxlbmd0aCk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAvLyBXYXJuaW5nOiBtYXhMZW5ndGggbm90IHRha2VuIGludG8gYWNjb3VudCBpbiBiYXNlNjRXcml0ZVxuICAgICAgcmV0ID0gdGhpcy5wYXJlbnQuYmFzZTY0V3JpdGUoc3RyaW5nLCB0aGlzLm9mZnNldCArIG9mZnNldCwgbGVuZ3RoKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgICAgcmV0ID0gdGhpcy5wYXJlbnQudWNzMldyaXRlKHN0cmluZywgdGhpcy5vZmZzZXQgKyBvZmZzZXQsIGxlbmd0aCk7XG4gICAgICBicmVhaztcblxuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKTtcbiAgfVxuXG4gIEJ1ZmZlci5fY2hhcnNXcml0dGVuID0gU2xvd0J1ZmZlci5fY2hhcnNXcml0dGVuO1xuXG4gIHJldHVybiByZXQ7XG59O1xuXG5cbi8vIHRvU3RyaW5nKGVuY29kaW5nLCBzdGFydD0wLCBlbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbihlbmNvZGluZywgc3RhcnQsIGVuZCkge1xuICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKCk7XG5cbiAgaWYgKHR5cGVvZiBzdGFydCA9PSAndW5kZWZpbmVkJyB8fCBzdGFydCA8IDApIHtcbiAgICBzdGFydCA9IDA7XG4gIH0gZWxzZSBpZiAoc3RhcnQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHN0YXJ0ID0gdGhpcy5sZW5ndGg7XG4gIH1cblxuICBpZiAodHlwZW9mIGVuZCA9PSAndW5kZWZpbmVkJyB8fCBlbmQgPiB0aGlzLmxlbmd0aCkge1xuICAgIGVuZCA9IHRoaXMubGVuZ3RoO1xuICB9IGVsc2UgaWYgKGVuZCA8IDApIHtcbiAgICBlbmQgPSAwO1xuICB9XG5cbiAgc3RhcnQgPSBzdGFydCArIHRoaXMub2Zmc2V0O1xuICBlbmQgPSBlbmQgKyB0aGlzLm9mZnNldDtcblxuICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldHVybiB0aGlzLnBhcmVudC5oZXhTbGljZShzdGFydCwgZW5kKTtcblxuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldHVybiB0aGlzLnBhcmVudC51dGY4U2xpY2Uoc3RhcnQsIGVuZCk7XG5cbiAgICBjYXNlICdhc2NpaSc6XG4gICAgICByZXR1cm4gdGhpcy5wYXJlbnQuYXNjaWlTbGljZShzdGFydCwgZW5kKTtcblxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICByZXR1cm4gdGhpcy5wYXJlbnQuYmluYXJ5U2xpY2Uoc3RhcnQsIGVuZCk7XG5cbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmJhc2U2NFNsaWNlKHN0YXJ0LCBlbmQpO1xuXG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgICAgcmV0dXJuIHRoaXMucGFyZW50LnVjczJTbGljZShzdGFydCwgZW5kKTtcblxuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKTtcbiAgfVxufTtcblxuXG4vLyBieXRlTGVuZ3RoXG5CdWZmZXIuYnl0ZUxlbmd0aCA9IFNsb3dCdWZmZXIuYnl0ZUxlbmd0aDtcblxuXG4vLyBmaWxsKHZhbHVlLCBzdGFydD0wLCBlbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuZmlsbCA9IGZ1bmN0aW9uIGZpbGwodmFsdWUsIHN0YXJ0LCBlbmQpIHtcbiAgdmFsdWUgfHwgKHZhbHVlID0gMCk7XG4gIHN0YXJ0IHx8IChzdGFydCA9IDApO1xuICBlbmQgfHwgKGVuZCA9IHRoaXMubGVuZ3RoKTtcblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHZhbHVlID0gdmFsdWUuY2hhckNvZGVBdCgwKTtcbiAgfVxuICBpZiAoISh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB8fCBpc05hTih2YWx1ZSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3ZhbHVlIGlzIG5vdCBhIG51bWJlcicpO1xuICB9XG5cbiAgaWYgKGVuZCA8IHN0YXJ0KSB0aHJvdyBuZXcgRXJyb3IoJ2VuZCA8IHN0YXJ0Jyk7XG5cbiAgLy8gRmlsbCAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm4gMDtcbiAgaWYgKHRoaXMubGVuZ3RoID09IDApIHJldHVybiAwO1xuXG4gIGlmIChzdGFydCA8IDAgfHwgc3RhcnQgPj0gdGhpcy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3N0YXJ0IG91dCBvZiBib3VuZHMnKTtcbiAgfVxuXG4gIGlmIChlbmQgPCAwIHx8IGVuZCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdlbmQgb3V0IG9mIGJvdW5kcycpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXMucGFyZW50LmZpbGwodmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0ICsgdGhpcy5vZmZzZXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGVuZCArIHRoaXMub2Zmc2V0KTtcbn07XG5cblxuLy8gY29weSh0YXJnZXRCdWZmZXIsIHRhcmdldFN0YXJ0PTAsIHNvdXJjZVN0YXJ0PTAsIHNvdXJjZUVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24odGFyZ2V0LCB0YXJnZXRfc3RhcnQsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHNvdXJjZSA9IHRoaXM7XG4gIHN0YXJ0IHx8IChzdGFydCA9IDApO1xuICBlbmQgfHwgKGVuZCA9IHRoaXMubGVuZ3RoKTtcbiAgdGFyZ2V0X3N0YXJ0IHx8ICh0YXJnZXRfc3RhcnQgPSAwKTtcblxuICBpZiAoZW5kIDwgc3RhcnQpIHRocm93IG5ldyBFcnJvcignc291cmNlRW5kIDwgc291cmNlU3RhcnQnKTtcblxuICAvLyBDb3B5IDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVybiAwO1xuICBpZiAodGFyZ2V0Lmxlbmd0aCA9PSAwIHx8IHNvdXJjZS5sZW5ndGggPT0gMCkgcmV0dXJuIDA7XG5cbiAgaWYgKHRhcmdldF9zdGFydCA8IDAgfHwgdGFyZ2V0X3N0YXJ0ID49IHRhcmdldC5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3RhcmdldFN0YXJ0IG91dCBvZiBib3VuZHMnKTtcbiAgfVxuXG4gIGlmIChzdGFydCA8IDAgfHwgc3RhcnQgPj0gc291cmNlLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc291cmNlU3RhcnQgb3V0IG9mIGJvdW5kcycpO1xuICB9XG5cbiAgaWYgKGVuZCA8IDAgfHwgZW5kID4gc291cmNlLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc291cmNlRW5kIG91dCBvZiBib3VuZHMnKTtcbiAgfVxuXG4gIC8vIEFyZSB3ZSBvb2I/XG4gIGlmIChlbmQgPiB0aGlzLmxlbmd0aCkge1xuICAgIGVuZCA9IHRoaXMubGVuZ3RoO1xuICB9XG5cbiAgaWYgKHRhcmdldC5sZW5ndGggLSB0YXJnZXRfc3RhcnQgPCBlbmQgLSBzdGFydCkge1xuICAgIGVuZCA9IHRhcmdldC5sZW5ndGggLSB0YXJnZXRfc3RhcnQgKyBzdGFydDtcbiAgfVxuXG4gIHJldHVybiB0aGlzLnBhcmVudC5jb3B5KHRhcmdldC5wYXJlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldF9zdGFydCArIHRhcmdldC5vZmZzZXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0ICsgdGhpcy5vZmZzZXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGVuZCArIHRoaXMub2Zmc2V0KTtcbn07XG5cblxuLy8gc2xpY2Uoc3RhcnQsIGVuZClcbkJ1ZmZlci5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gIGlmIChlbmQgPT09IHVuZGVmaW5lZCkgZW5kID0gdGhpcy5sZW5ndGg7XG4gIGlmIChlbmQgPiB0aGlzLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKCdvb2InKTtcbiAgaWYgKHN0YXJ0ID4gZW5kKSB0aHJvdyBuZXcgRXJyb3IoJ29vYicpO1xuXG4gIHJldHVybiBuZXcgQnVmZmVyKHRoaXMucGFyZW50LCBlbmQgLSBzdGFydCwgK3N0YXJ0ICsgdGhpcy5vZmZzZXQpO1xufTtcblxuXG4vLyBMZWdhY3kgbWV0aG9kcyBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkuXG5cbkJ1ZmZlci5wcm90b3R5cGUudXRmOFNsaWNlID0gZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICByZXR1cm4gdGhpcy50b1N0cmluZygndXRmOCcsIHN0YXJ0LCBlbmQpO1xufTtcblxuQnVmZmVyLnByb3RvdHlwZS5iaW5hcnlTbGljZSA9IGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIHRoaXMudG9TdHJpbmcoJ2JpbmFyeScsIHN0YXJ0LCBlbmQpO1xufTtcblxuQnVmZmVyLnByb3RvdHlwZS5hc2NpaVNsaWNlID0gZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICByZXR1cm4gdGhpcy50b1N0cmluZygnYXNjaWknLCBzdGFydCwgZW5kKTtcbn07XG5cbkJ1ZmZlci5wcm90b3R5cGUudXRmOFdyaXRlID0gZnVuY3Rpb24oc3RyaW5nLCBvZmZzZXQpIHtcbiAgcmV0dXJuIHRoaXMud3JpdGUoc3RyaW5nLCBvZmZzZXQsICd1dGY4Jyk7XG59O1xuXG5CdWZmZXIucHJvdG90eXBlLmJpbmFyeVdyaXRlID0gZnVuY3Rpb24oc3RyaW5nLCBvZmZzZXQpIHtcbiAgcmV0dXJuIHRoaXMud3JpdGUoc3RyaW5nLCBvZmZzZXQsICdiaW5hcnknKTtcbn07XG5cbkJ1ZmZlci5wcm90b3R5cGUuYXNjaWlXcml0ZSA9IGZ1bmN0aW9uKHN0cmluZywgb2Zmc2V0KSB7XG4gIHJldHVybiB0aGlzLndyaXRlKHN0cmluZywgb2Zmc2V0LCAnYXNjaWknKTtcbn07XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQ4ID0gZnVuY3Rpb24ob2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YXIgYnVmZmVyID0gdGhpcztcblxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0Lm9rKG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3Npbmcgb2Zmc2V0Jyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0IDwgYnVmZmVyLmxlbmd0aCxcbiAgICAgICAgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJyk7XG4gIH1cblxuICByZXR1cm4gYnVmZmVyLnBhcmVudFtidWZmZXIub2Zmc2V0ICsgb2Zmc2V0XTtcbn07XG5cbmZ1bmN0aW9uIHJlYWRVSW50MTYoYnVmZmVyLCBvZmZzZXQsIGlzQmlnRW5kaWFuLCBub0Fzc2VydCkge1xuICB2YXIgdmFsID0gMDtcblxuXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQub2sodHlwZW9mIChpc0JpZ0VuZGlhbikgPT09ICdib29sZWFuJyxcbiAgICAgICAgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKTtcblxuICAgIGFzc2VydC5vayhvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIG9mZnNldCcpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCArIDEgPCBidWZmZXIubGVuZ3RoLFxuICAgICAgICAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKTtcbiAgfVxuXG4gIGlmIChpc0JpZ0VuZGlhbikge1xuICAgIHZhbCA9IGJ1ZmZlci5wYXJlbnRbYnVmZmVyLm9mZnNldCArIG9mZnNldF0gPDwgODtcbiAgICB2YWwgfD0gYnVmZmVyLnBhcmVudFtidWZmZXIub2Zmc2V0ICsgb2Zmc2V0ICsgMV07XG4gIH0gZWxzZSB7XG4gICAgdmFsID0gYnVmZmVyLnBhcmVudFtidWZmZXIub2Zmc2V0ICsgb2Zmc2V0XTtcbiAgICB2YWwgfD0gYnVmZmVyLnBhcmVudFtidWZmZXIub2Zmc2V0ICsgb2Zmc2V0ICsgMV0gPDwgODtcbiAgfVxuXG4gIHJldHVybiB2YWw7XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkxFID0gZnVuY3Rpb24ob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gcmVhZFVJbnQxNih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydCk7XG59O1xuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZCRSA9IGZ1bmN0aW9uKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHJlYWRVSW50MTYodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydCk7XG59O1xuXG5mdW5jdGlvbiByZWFkVUludDMyKGJ1ZmZlciwgb2Zmc2V0LCBpc0JpZ0VuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgdmFyIHZhbCA9IDA7XG5cbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydC5vayh0eXBlb2YgKGlzQmlnRW5kaWFuKSA9PT0gJ2Jvb2xlYW4nLFxuICAgICAgICAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3Npbmcgb2Zmc2V0Jyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0ICsgMyA8IGJ1ZmZlci5sZW5ndGgsXG4gICAgICAgICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpO1xuICB9XG5cbiAgaWYgKGlzQmlnRW5kaWFuKSB7XG4gICAgdmFsID0gYnVmZmVyLnBhcmVudFtidWZmZXIub2Zmc2V0ICsgb2Zmc2V0ICsgMV0gPDwgMTY7XG4gICAgdmFsIHw9IGJ1ZmZlci5wYXJlbnRbYnVmZmVyLm9mZnNldCArIG9mZnNldCArIDJdIDw8IDg7XG4gICAgdmFsIHw9IGJ1ZmZlci5wYXJlbnRbYnVmZmVyLm9mZnNldCArIG9mZnNldCArIDNdO1xuICAgIHZhbCA9IHZhbCArIChidWZmZXIucGFyZW50W2J1ZmZlci5vZmZzZXQgKyBvZmZzZXRdIDw8IDI0ID4+PiAwKTtcbiAgfSBlbHNlIHtcbiAgICB2YWwgPSBidWZmZXIucGFyZW50W2J1ZmZlci5vZmZzZXQgKyBvZmZzZXQgKyAyXSA8PCAxNjtcbiAgICB2YWwgfD0gYnVmZmVyLnBhcmVudFtidWZmZXIub2Zmc2V0ICsgb2Zmc2V0ICsgMV0gPDwgODtcbiAgICB2YWwgfD0gYnVmZmVyLnBhcmVudFtidWZmZXIub2Zmc2V0ICsgb2Zmc2V0XTtcbiAgICB2YWwgPSB2YWwgKyAoYnVmZmVyLnBhcmVudFtidWZmZXIub2Zmc2V0ICsgb2Zmc2V0ICsgM10gPDwgMjQgPj4+IDApO1xuICB9XG5cbiAgcmV0dXJuIHZhbDtcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyTEUgPSBmdW5jdGlvbihvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiByZWFkVUludDMyKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KTtcbn07XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkJFID0gZnVuY3Rpb24ob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gcmVhZFVJbnQzMih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KTtcbn07XG5cblxuLypcbiAqIFNpZ25lZCBpbnRlZ2VyIHR5cGVzLCB5YXkgdGVhbSEgQSByZW1pbmRlciBvbiBob3cgdHdvJ3MgY29tcGxlbWVudCBhY3R1YWxseVxuICogd29ya3MuIFRoZSBmaXJzdCBiaXQgaXMgdGhlIHNpZ25lZCBiaXQsIGkuZS4gdGVsbHMgdXMgd2hldGhlciBvciBub3QgdGhlXG4gKiBudW1iZXIgc2hvdWxkIGJlIHBvc2l0aXZlIG9yIG5lZ2F0aXZlLiBJZiB0aGUgdHdvJ3MgY29tcGxlbWVudCB2YWx1ZSBpc1xuICogcG9zaXRpdmUsIHRoZW4gd2UncmUgZG9uZSwgYXMgaXQncyBlcXVpdmFsZW50IHRvIHRoZSB1bnNpZ25lZCByZXByZXNlbnRhdGlvbi5cbiAqXG4gKiBOb3cgaWYgdGhlIG51bWJlciBpcyBwb3NpdGl2ZSwgeW91J3JlIHByZXR0eSBtdWNoIGRvbmUsIHlvdSBjYW4ganVzdCBsZXZlcmFnZVxuICogdGhlIHVuc2lnbmVkIHRyYW5zbGF0aW9ucyBhbmQgcmV0dXJuIHRob3NlLiBVbmZvcnR1bmF0ZWx5LCBuZWdhdGl2ZSBudW1iZXJzXG4gKiBhcmVuJ3QgcXVpdGUgdGhhdCBzdHJhaWdodGZvcndhcmQuXG4gKlxuICogQXQgZmlyc3QgZ2xhbmNlLCBvbmUgbWlnaHQgYmUgaW5jbGluZWQgdG8gdXNlIHRoZSB0cmFkaXRpb25hbCBmb3JtdWxhIHRvXG4gKiB0cmFuc2xhdGUgYmluYXJ5IG51bWJlcnMgYmV0d2VlbiB0aGUgcG9zaXRpdmUgYW5kIG5lZ2F0aXZlIHZhbHVlcyBpbiB0d28nc1xuICogY29tcGxlbWVudC4gKFRob3VnaCBpdCBkb2Vzbid0IHF1aXRlIHdvcmsgZm9yIHRoZSBtb3N0IG5lZ2F0aXZlIHZhbHVlKVxuICogTWFpbmx5OlxuICogIC0gaW52ZXJ0IGFsbCB0aGUgYml0c1xuICogIC0gYWRkIG9uZSB0byB0aGUgcmVzdWx0XG4gKlxuICogT2YgY291cnNlLCB0aGlzIGRvZXNuJ3QgcXVpdGUgd29yayBpbiBKYXZhc2NyaXB0LiBUYWtlIGZvciBleGFtcGxlIHRoZSB2YWx1ZVxuICogb2YgLTEyOC4gVGhpcyBjb3VsZCBiZSByZXByZXNlbnRlZCBpbiAxNiBiaXRzIChiaWctZW5kaWFuKSBhcyAweGZmODAuIEJ1dCBvZlxuICogY291cnNlLCBKYXZhc2NyaXB0IHdpbGwgZG8gdGhlIGZvbGxvd2luZzpcbiAqXG4gKiA+IH4weGZmODBcbiAqIC02NTQwOVxuICpcbiAqIFdob2ggdGhlcmUsIEphdmFzY3JpcHQsIHRoYXQncyBub3QgcXVpdGUgcmlnaHQuIEJ1dCB3YWl0LCBhY2NvcmRpbmcgdG9cbiAqIEphdmFzY3JpcHQgdGhhdCdzIHBlcmZlY3RseSBjb3JyZWN0LiBXaGVuIEphdmFzY3JpcHQgZW5kcyB1cCBzZWVpbmcgdGhlXG4gKiBjb25zdGFudCAweGZmODAsIGl0IGhhcyBubyBub3Rpb24gdGhhdCBpdCBpcyBhY3R1YWxseSBhIHNpZ25lZCBudW1iZXIuIEl0XG4gKiBhc3N1bWVzIHRoYXQgd2UndmUgaW5wdXQgdGhlIHVuc2lnbmVkIHZhbHVlIDB4ZmY4MC4gVGh1cywgd2hlbiBpdCBkb2VzIHRoZVxuICogYmluYXJ5IG5lZ2F0aW9uLCBpdCBjYXN0cyBpdCBpbnRvIGEgc2lnbmVkIHZhbHVlLCAocG9zaXRpdmUgMHhmZjgwKS4gVGhlblxuICogd2hlbiB5b3UgcGVyZm9ybSBiaW5hcnkgbmVnYXRpb24gb24gdGhhdCwgaXQgdHVybnMgaXQgaW50byBhIG5lZ2F0aXZlIG51bWJlci5cbiAqXG4gKiBJbnN0ZWFkLCB3ZSdyZSBnb2luZyB0byBoYXZlIHRvIHVzZSB0aGUgZm9sbG93aW5nIGdlbmVyYWwgZm9ybXVsYSwgdGhhdCB3b3Jrc1xuICogaW4gYSByYXRoZXIgSmF2YXNjcmlwdCBmcmllbmRseSB3YXkuIEknbSBnbGFkIHdlIGRvbid0IHN1cHBvcnQgdGhpcyBraW5kIG9mXG4gKiB3ZWlyZCBudW1iZXJpbmcgc2NoZW1lIGluIHRoZSBrZXJuZWwuXG4gKlxuICogKEJJVC1NQVggLSAodW5zaWduZWQpdmFsICsgMSkgKiAtMVxuICpcbiAqIFRoZSBhc3R1dGUgb2JzZXJ2ZXIsIG1heSB0aGluayB0aGF0IHRoaXMgZG9lc24ndCBtYWtlIHNlbnNlIGZvciA4LWJpdCBudW1iZXJzXG4gKiAocmVhbGx5IGl0IGlzbid0IG5lY2Vzc2FyeSBmb3IgdGhlbSkuIEhvd2V2ZXIsIHdoZW4geW91IGdldCAxNi1iaXQgbnVtYmVycyxcbiAqIHlvdSBkby4gTGV0J3MgZ28gYmFjayB0byBvdXIgcHJpb3IgZXhhbXBsZSBhbmQgc2VlIGhvdyB0aGlzIHdpbGwgbG9vazpcbiAqXG4gKiAoMHhmZmZmIC0gMHhmZjgwICsgMSkgKiAtMVxuICogKDB4MDA3ZiArIDEpICogLTFcbiAqICgweDAwODApICogLTFcbiAqL1xuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50OCA9IGZ1bmN0aW9uKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFyIGJ1ZmZlciA9IHRoaXM7XG4gIHZhciBuZWc7XG5cbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydC5vayhvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIG9mZnNldCcpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCA8IGJ1ZmZlci5sZW5ndGgsXG4gICAgICAgICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpO1xuICB9XG5cbiAgbmVnID0gYnVmZmVyLnBhcmVudFtidWZmZXIub2Zmc2V0ICsgb2Zmc2V0XSAmIDB4ODA7XG4gIGlmICghbmVnKSB7XG4gICAgcmV0dXJuIChidWZmZXIucGFyZW50W2J1ZmZlci5vZmZzZXQgKyBvZmZzZXRdKTtcbiAgfVxuXG4gIHJldHVybiAoKDB4ZmYgLSBidWZmZXIucGFyZW50W2J1ZmZlci5vZmZzZXQgKyBvZmZzZXRdICsgMSkgKiAtMSk7XG59O1xuXG5mdW5jdGlvbiByZWFkSW50MTYoYnVmZmVyLCBvZmZzZXQsIGlzQmlnRW5kaWFuLCBub0Fzc2VydCkge1xuICB2YXIgbmVnLCB2YWw7XG5cbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydC5vayh0eXBlb2YgKGlzQmlnRW5kaWFuKSA9PT0gJ2Jvb2xlYW4nLFxuICAgICAgICAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3Npbmcgb2Zmc2V0Jyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0ICsgMSA8IGJ1ZmZlci5sZW5ndGgsXG4gICAgICAgICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpO1xuICB9XG5cbiAgdmFsID0gcmVhZFVJbnQxNihidWZmZXIsIG9mZnNldCwgaXNCaWdFbmRpYW4sIG5vQXNzZXJ0KTtcbiAgbmVnID0gdmFsICYgMHg4MDAwO1xuICBpZiAoIW5lZykge1xuICAgIHJldHVybiB2YWw7XG4gIH1cblxuICByZXR1cm4gKDB4ZmZmZiAtIHZhbCArIDEpICogLTE7XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEUgPSBmdW5jdGlvbihvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiByZWFkSW50MTYodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpO1xufTtcblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZCRSA9IGZ1bmN0aW9uKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHJlYWRJbnQxNih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KTtcbn07XG5cbmZ1bmN0aW9uIHJlYWRJbnQzMihidWZmZXIsIG9mZnNldCwgaXNCaWdFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIHZhciBuZWcsIHZhbDtcblxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0Lm9rKHR5cGVvZiAoaXNCaWdFbmRpYW4pID09PSAnYm9vbGVhbicsXG4gICAgICAgICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyBvZmZzZXQnKTtcblxuICAgIGFzc2VydC5vayhvZmZzZXQgKyAzIDwgYnVmZmVyLmxlbmd0aCxcbiAgICAgICAgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJyk7XG4gIH1cblxuICB2YWwgPSByZWFkVUludDMyKGJ1ZmZlciwgb2Zmc2V0LCBpc0JpZ0VuZGlhbiwgbm9Bc3NlcnQpO1xuICBuZWcgPSB2YWwgJiAweDgwMDAwMDAwO1xuICBpZiAoIW5lZykge1xuICAgIHJldHVybiAodmFsKTtcbiAgfVxuXG4gIHJldHVybiAoMHhmZmZmZmZmZiAtIHZhbCArIDEpICogLTE7XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyTEUgPSBmdW5jdGlvbihvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiByZWFkSW50MzIodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpO1xufTtcblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJCRSA9IGZ1bmN0aW9uKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHJlYWRJbnQzMih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KTtcbn07XG5cbmZ1bmN0aW9uIHJlYWRGbG9hdChidWZmZXIsIG9mZnNldCwgaXNCaWdFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQub2sodHlwZW9mIChpc0JpZ0VuZGlhbikgPT09ICdib29sZWFuJyxcbiAgICAgICAgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKTtcblxuICAgIGFzc2VydC5vayhvZmZzZXQgKyAzIDwgYnVmZmVyLmxlbmd0aCxcbiAgICAgICAgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJyk7XG4gIH1cblxuICByZXR1cm4gcmVxdWlyZSgnLi9idWZmZXJfaWVlZTc1NCcpLnJlYWRJRUVFNzU0KGJ1ZmZlciwgb2Zmc2V0LCBpc0JpZ0VuZGlhbixcbiAgICAgIDIzLCA0KTtcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRMRSA9IGZ1bmN0aW9uKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHJlYWRGbG9hdCh0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydCk7XG59O1xuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdEJFID0gZnVuY3Rpb24ob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gcmVhZEZsb2F0KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpO1xufTtcblxuZnVuY3Rpb24gcmVhZERvdWJsZShidWZmZXIsIG9mZnNldCwgaXNCaWdFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQub2sodHlwZW9mIChpc0JpZ0VuZGlhbikgPT09ICdib29sZWFuJyxcbiAgICAgICAgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKTtcblxuICAgIGFzc2VydC5vayhvZmZzZXQgKyA3IDwgYnVmZmVyLmxlbmd0aCxcbiAgICAgICAgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJyk7XG4gIH1cblxuICByZXR1cm4gcmVxdWlyZSgnLi9idWZmZXJfaWVlZTc1NCcpLnJlYWRJRUVFNzU0KGJ1ZmZlciwgb2Zmc2V0LCBpc0JpZ0VuZGlhbixcbiAgICAgIDUyLCA4KTtcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlTEUgPSBmdW5jdGlvbihvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiByZWFkRG91YmxlKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KTtcbn07XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUJFID0gZnVuY3Rpb24ob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gcmVhZERvdWJsZSh0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KTtcbn07XG5cblxuLypcbiAqIFdlIGhhdmUgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIHZhbHVlIGlzIGEgdmFsaWQgaW50ZWdlci4gVGhpcyBtZWFucyB0aGF0IGl0IGlzXG4gKiBub24tbmVnYXRpdmUuIEl0IGhhcyBubyBmcmFjdGlvbmFsIGNvbXBvbmVudCBhbmQgdGhhdCBpdCBkb2VzIG5vdCBleGNlZWQgdGhlXG4gKiBtYXhpbXVtIGFsbG93ZWQgdmFsdWUuXG4gKlxuICogICAgICB2YWx1ZSAgICAgICAgICAgVGhlIG51bWJlciB0byBjaGVjayBmb3IgdmFsaWRpdHlcbiAqXG4gKiAgICAgIG1heCAgICAgICAgICAgICBUaGUgbWF4aW11bSB2YWx1ZVxuICovXG5mdW5jdGlvbiB2ZXJpZnVpbnQodmFsdWUsIG1heCkge1xuICBhc3NlcnQub2sodHlwZW9mICh2YWx1ZSkgPT0gJ251bWJlcicsXG4gICAgICAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpO1xuXG4gIGFzc2VydC5vayh2YWx1ZSA+PSAwLFxuICAgICAgJ3NwZWNpZmllZCBhIG5lZ2F0aXZlIHZhbHVlIGZvciB3cml0aW5nIGFuIHVuc2lnbmVkIHZhbHVlJyk7XG5cbiAgYXNzZXJ0Lm9rKHZhbHVlIDw9IG1heCwgJ3ZhbHVlIGlzIGxhcmdlciB0aGFuIG1heGltdW0gdmFsdWUgZm9yIHR5cGUnKTtcblxuICBhc3NlcnQub2soTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlLCAndmFsdWUgaGFzIGEgZnJhY3Rpb25hbCBjb21wb25lbnQnKTtcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQ4ID0gZnVuY3Rpb24odmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFyIGJ1ZmZlciA9IHRoaXM7XG5cbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydC5vayh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyB2YWx1ZScpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3Npbmcgb2Zmc2V0Jyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0IDwgYnVmZmVyLmxlbmd0aCxcbiAgICAgICAgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpO1xuXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmKTtcbiAgfVxuXG4gIGJ1ZmZlci5wYXJlbnRbYnVmZmVyLm9mZnNldCArIG9mZnNldF0gPSB2YWx1ZTtcbn07XG5cbmZ1bmN0aW9uIHdyaXRlVUludDE2KGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNCaWdFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQub2sodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3NpbmcgdmFsdWUnKTtcblxuICAgIGFzc2VydC5vayh0eXBlb2YgKGlzQmlnRW5kaWFuKSA9PT0gJ2Jvb2xlYW4nLFxuICAgICAgICAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3Npbmcgb2Zmc2V0Jyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0ICsgMSA8IGJ1ZmZlci5sZW5ndGgsXG4gICAgICAgICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKTtcblxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZmZmKTtcbiAgfVxuXG4gIGlmIChpc0JpZ0VuZGlhbikge1xuICAgIGJ1ZmZlci5wYXJlbnRbYnVmZmVyLm9mZnNldCArIG9mZnNldF0gPSAodmFsdWUgJiAweGZmMDApID4+PiA4O1xuICAgIGJ1ZmZlci5wYXJlbnRbYnVmZmVyLm9mZnNldCArIG9mZnNldCArIDFdID0gdmFsdWUgJiAweDAwZmY7XG4gIH0gZWxzZSB7XG4gICAgYnVmZmVyLnBhcmVudFtidWZmZXIub2Zmc2V0ICsgb2Zmc2V0ICsgMV0gPSAodmFsdWUgJiAweGZmMDApID4+PiA4O1xuICAgIGJ1ZmZlci5wYXJlbnRbYnVmZmVyLm9mZnNldCArIG9mZnNldF0gPSB2YWx1ZSAmIDB4MDBmZjtcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEUgPSBmdW5jdGlvbih2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB3cml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpO1xufTtcblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkJFID0gZnVuY3Rpb24odmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgd3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpO1xufTtcblxuZnVuY3Rpb24gd3JpdGVVSW50MzIoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0JpZ0VuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydC5vayh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyB2YWx1ZScpO1xuXG4gICAgYXNzZXJ0Lm9rKHR5cGVvZiAoaXNCaWdFbmRpYW4pID09PSAnYm9vbGVhbicsXG4gICAgICAgICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyBvZmZzZXQnKTtcblxuICAgIGFzc2VydC5vayhvZmZzZXQgKyAzIDwgYnVmZmVyLmxlbmd0aCxcbiAgICAgICAgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpO1xuXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmZmZmZmZmKTtcbiAgfVxuXG4gIGlmIChpc0JpZ0VuZGlhbikge1xuICAgIGJ1ZmZlci5wYXJlbnRbYnVmZmVyLm9mZnNldCArIG9mZnNldF0gPSAodmFsdWUgPj4+IDI0KSAmIDB4ZmY7XG4gICAgYnVmZmVyLnBhcmVudFtidWZmZXIub2Zmc2V0ICsgb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KSAmIDB4ZmY7XG4gICAgYnVmZmVyLnBhcmVudFtidWZmZXIub2Zmc2V0ICsgb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpICYgMHhmZjtcbiAgICBidWZmZXIucGFyZW50W2J1ZmZlci5vZmZzZXQgKyBvZmZzZXQgKyAzXSA9IHZhbHVlICYgMHhmZjtcbiAgfSBlbHNlIHtcbiAgICBidWZmZXIucGFyZW50W2J1ZmZlci5vZmZzZXQgKyBvZmZzZXQgKyAzXSA9ICh2YWx1ZSA+Pj4gMjQpICYgMHhmZjtcbiAgICBidWZmZXIucGFyZW50W2J1ZmZlci5vZmZzZXQgKyBvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gMTYpICYgMHhmZjtcbiAgICBidWZmZXIucGFyZW50W2J1ZmZlci5vZmZzZXQgKyBvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOCkgJiAweGZmO1xuICAgIGJ1ZmZlci5wYXJlbnRbYnVmZmVyLm9mZnNldCArIG9mZnNldF0gPSB2YWx1ZSAmIDB4ZmY7XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFID0gZnVuY3Rpb24odmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgd3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KTtcbn07XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJCRSA9IGZ1bmN0aW9uKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KTtcbn07XG5cblxuLypcbiAqIFdlIG5vdyBtb3ZlIG9udG8gb3VyIGZyaWVuZHMgaW4gdGhlIHNpZ25lZCBudW1iZXIgY2F0ZWdvcnkuIFVubGlrZSB1bnNpZ25lZFxuICogbnVtYmVycywgd2UncmUgZ29pbmcgdG8gaGF2ZSB0byB3b3JyeSBhIGJpdCBtb3JlIGFib3V0IGhvdyB3ZSBwdXQgdmFsdWVzIGludG9cbiAqIGFycmF5cy4gU2luY2Ugd2UgYXJlIG9ubHkgd29ycnlpbmcgYWJvdXQgc2lnbmVkIDMyLWJpdCB2YWx1ZXMsIHdlJ3JlIGluXG4gKiBzbGlnaHRseSBiZXR0ZXIgc2hhcGUuIFVuZm9ydHVuYXRlbHksIHdlIHJlYWxseSBjYW4ndCBkbyBvdXIgZmF2b3JpdGUgYmluYXJ5XG4gKiAmIGluIHRoaXMgc3lzdGVtLiBJdCByZWFsbHkgc2VlbXMgdG8gZG8gdGhlIHdyb25nIHRoaW5nLiBGb3IgZXhhbXBsZTpcbiAqXG4gKiA+IC0zMiAmIDB4ZmZcbiAqIDIyNFxuICpcbiAqIFdoYXQncyBoYXBwZW5pbmcgYWJvdmUgaXMgcmVhbGx5OiAweGUwICYgMHhmZiA9IDB4ZTAuIEhvd2V2ZXIsIHRoZSByZXN1bHRzIG9mXG4gKiB0aGlzIGFyZW4ndCB0cmVhdGVkIGFzIGEgc2lnbmVkIG51bWJlci4gVWx0aW1hdGVseSBhIGJhZCB0aGluZy5cbiAqXG4gKiBXaGF0IHdlJ3JlIGdvaW5nIHRvIHdhbnQgdG8gZG8gaXMgYmFzaWNhbGx5IGNyZWF0ZSB0aGUgdW5zaWduZWQgZXF1aXZhbGVudCBvZlxuICogb3VyIHJlcHJlc2VudGF0aW9uIGFuZCBwYXNzIHRoYXQgb2ZmIHRvIHRoZSB3dWludCogZnVuY3Rpb25zLiBUbyBkbyB0aGF0XG4gKiB3ZSdyZSBnb2luZyB0byBkbyB0aGUgZm9sbG93aW5nOlxuICpcbiAqICAtIGlmIHRoZSB2YWx1ZSBpcyBwb3NpdGl2ZVxuICogICAgICB3ZSBjYW4gcGFzcyBpdCBkaXJlY3RseSBvZmYgdG8gdGhlIGVxdWl2YWxlbnQgd3VpbnRcbiAqICAtIGlmIHRoZSB2YWx1ZSBpcyBuZWdhdGl2ZVxuICogICAgICB3ZSBkbyB0aGUgZm9sbG93aW5nIGNvbXB1dGF0aW9uOlxuICogICAgICAgICBtYiArIHZhbCArIDEsIHdoZXJlXG4gKiAgICAgICAgIG1iICAgaXMgdGhlIG1heGltdW0gdW5zaWduZWQgdmFsdWUgaW4gdGhhdCBieXRlIHNpemVcbiAqICAgICAgICAgdmFsICBpcyB0aGUgSmF2YXNjcmlwdCBuZWdhdGl2ZSBpbnRlZ2VyXG4gKlxuICpcbiAqIEFzIGEgY29uY3JldGUgdmFsdWUsIHRha2UgLTEyOC4gSW4gc2lnbmVkIDE2IGJpdHMgdGhpcyB3b3VsZCBiZSAweGZmODAuIElmXG4gKiB5b3UgZG8gb3V0IHRoZSBjb21wdXRhdGlvbnM6XG4gKlxuICogMHhmZmZmIC0gMTI4ICsgMVxuICogMHhmZmZmIC0gMTI3XG4gKiAweGZmODBcbiAqXG4gKiBZb3UgY2FuIHRoZW4gZW5jb2RlIHRoaXMgdmFsdWUgYXMgdGhlIHNpZ25lZCB2ZXJzaW9uLiBUaGlzIGlzIHJlYWxseSByYXRoZXJcbiAqIGhhY2t5LCBidXQgaXQgc2hvdWxkIHdvcmsgYW5kIGdldCB0aGUgam9iIGRvbmUgd2hpY2ggaXMgb3VyIGdvYWwgaGVyZS5cbiAqL1xuXG4vKlxuICogQSBzZXJpZXMgb2YgY2hlY2tzIHRvIG1ha2Ugc3VyZSB3ZSBhY3R1YWxseSBoYXZlIGEgc2lnbmVkIDMyLWJpdCBudW1iZXJcbiAqL1xuZnVuY3Rpb24gdmVyaWZzaW50KHZhbHVlLCBtYXgsIG1pbikge1xuICBhc3NlcnQub2sodHlwZW9mICh2YWx1ZSkgPT0gJ251bWJlcicsXG4gICAgICAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpO1xuXG4gIGFzc2VydC5vayh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBsYXJnZXIgdGhhbiBtYXhpbXVtIGFsbG93ZWQgdmFsdWUnKTtcblxuICBhc3NlcnQub2sodmFsdWUgPj0gbWluLCAndmFsdWUgc21hbGxlciB0aGFuIG1pbmltdW0gYWxsb3dlZCB2YWx1ZScpO1xuXG4gIGFzc2VydC5vayhNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUsICd2YWx1ZSBoYXMgYSBmcmFjdGlvbmFsIGNvbXBvbmVudCcpO1xufVxuXG5mdW5jdGlvbiB2ZXJpZklFRUU3NTQodmFsdWUsIG1heCwgbWluKSB7XG4gIGFzc2VydC5vayh0eXBlb2YgKHZhbHVlKSA9PSAnbnVtYmVyJyxcbiAgICAgICdjYW5ub3Qgd3JpdGUgYSBub24tbnVtYmVyIGFzIGEgbnVtYmVyJyk7XG5cbiAgYXNzZXJ0Lm9rKHZhbHVlIDw9IG1heCwgJ3ZhbHVlIGxhcmdlciB0aGFuIG1heGltdW0gYWxsb3dlZCB2YWx1ZScpO1xuXG4gIGFzc2VydC5vayh2YWx1ZSA+PSBtaW4sICd2YWx1ZSBzbWFsbGVyIHRoYW4gbWluaW11bSBhbGxvd2VkIHZhbHVlJyk7XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQ4ID0gZnVuY3Rpb24odmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFyIGJ1ZmZlciA9IHRoaXM7XG5cbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydC5vayh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyB2YWx1ZScpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3Npbmcgb2Zmc2V0Jyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0IDwgYnVmZmVyLmxlbmd0aCxcbiAgICAgICAgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpO1xuXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmLCAtMHg4MCk7XG4gIH1cblxuICBpZiAodmFsdWUgPj0gMCkge1xuICAgIGJ1ZmZlci53cml0ZVVJbnQ4KHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KTtcbiAgfSBlbHNlIHtcbiAgICBidWZmZXIud3JpdGVVSW50OCgweGZmICsgdmFsdWUgKyAxLCBvZmZzZXQsIG5vQXNzZXJ0KTtcbiAgfVxufTtcblxuZnVuY3Rpb24gd3JpdGVJbnQxNihidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzQmlnRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0Lm9rKHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIHZhbHVlJyk7XG5cbiAgICBhc3NlcnQub2sodHlwZW9mIChpc0JpZ0VuZGlhbikgPT09ICdib29sZWFuJyxcbiAgICAgICAgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKTtcblxuICAgIGFzc2VydC5vayhvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIG9mZnNldCcpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCArIDEgPCBidWZmZXIubGVuZ3RoLFxuICAgICAgICAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJyk7XG5cbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2ZmZiwgLTB4ODAwMCk7XG4gIH1cblxuICBpZiAodmFsdWUgPj0gMCkge1xuICAgIHdyaXRlVUludDE2KGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNCaWdFbmRpYW4sIG5vQXNzZXJ0KTtcbiAgfSBlbHNlIHtcbiAgICB3cml0ZVVJbnQxNihidWZmZXIsIDB4ZmZmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBpc0JpZ0VuZGlhbiwgbm9Bc3NlcnQpO1xuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkxFID0gZnVuY3Rpb24odmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgd3JpdGVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpO1xufTtcblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2QkUgPSBmdW5jdGlvbih2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB3cml0ZUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KTtcbn07XG5cbmZ1bmN0aW9uIHdyaXRlSW50MzIoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0JpZ0VuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydC5vayh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyB2YWx1ZScpO1xuXG4gICAgYXNzZXJ0Lm9rKHR5cGVvZiAoaXNCaWdFbmRpYW4pID09PSAnYm9vbGVhbicsXG4gICAgICAgICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyBvZmZzZXQnKTtcblxuICAgIGFzc2VydC5vayhvZmZzZXQgKyAzIDwgYnVmZmVyLmxlbmd0aCxcbiAgICAgICAgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpO1xuXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMCk7XG4gIH1cblxuICBpZiAodmFsdWUgPj0gMCkge1xuICAgIHdyaXRlVUludDMyKGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNCaWdFbmRpYW4sIG5vQXNzZXJ0KTtcbiAgfSBlbHNlIHtcbiAgICB3cml0ZVVJbnQzMihidWZmZXIsIDB4ZmZmZmZmZmYgKyB2YWx1ZSArIDEsIG9mZnNldCwgaXNCaWdFbmRpYW4sIG5vQXNzZXJ0KTtcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJMRSA9IGZ1bmN0aW9uKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHdyaXRlSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KTtcbn07XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkJFID0gZnVuY3Rpb24odmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgd3JpdGVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydCk7XG59O1xuXG5mdW5jdGlvbiB3cml0ZUZsb2F0KGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNCaWdFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQub2sodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3NpbmcgdmFsdWUnKTtcblxuICAgIGFzc2VydC5vayh0eXBlb2YgKGlzQmlnRW5kaWFuKSA9PT0gJ2Jvb2xlYW4nLFxuICAgICAgICAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3Npbmcgb2Zmc2V0Jyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0ICsgMyA8IGJ1ZmZlci5sZW5ndGgsXG4gICAgICAgICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKTtcblxuICAgIHZlcmlmSUVFRTc1NCh2YWx1ZSwgMy40MDI4MjM0NjYzODUyODg2ZSszOCwgLTMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgpO1xuICB9XG5cbiAgcmVxdWlyZSgnLi9idWZmZXJfaWVlZTc1NCcpLndyaXRlSUVFRTc1NChidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzQmlnRW5kaWFuLFxuICAgICAgMjMsIDQpO1xufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRMRSA9IGZ1bmN0aW9uKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHdyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KTtcbn07XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdEJFID0gZnVuY3Rpb24odmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydCk7XG59O1xuXG5mdW5jdGlvbiB3cml0ZURvdWJsZShidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzQmlnRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0Lm9rKHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIHZhbHVlJyk7XG5cbiAgICBhc3NlcnQub2sodHlwZW9mIChpc0JpZ0VuZGlhbikgPT09ICdib29sZWFuJyxcbiAgICAgICAgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKTtcblxuICAgIGFzc2VydC5vayhvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIG9mZnNldCcpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCArIDcgPCBidWZmZXIubGVuZ3RoLFxuICAgICAgICAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJyk7XG5cbiAgICB2ZXJpZklFRUU3NTQodmFsdWUsIDEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4LCAtMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgpO1xuICB9XG5cbiAgcmVxdWlyZSgnLi9idWZmZXJfaWVlZTc1NCcpLndyaXRlSUVFRTc1NChidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzQmlnRW5kaWFuLFxuICAgICAgNTIsIDgpO1xufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlTEUgPSBmdW5jdGlvbih2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB3cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpO1xufTtcblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUJFID0gZnVuY3Rpb24odmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpO1xufTtcblxuU2xvd0J1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQ4ID0gQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDg7XG5TbG93QnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2TEUgPSBCdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZMRTtcblNsb3dCdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZCRSA9IEJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkJFO1xuU2xvd0J1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFID0gQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyTEU7XG5TbG93QnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyQkUgPSBCdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJCRTtcblNsb3dCdWZmZXIucHJvdG90eXBlLnJlYWRJbnQ4ID0gQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50ODtcblNsb3dCdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkxFID0gQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZMRTtcblNsb3dCdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkJFID0gQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZCRTtcblNsb3dCdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkxFID0gQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJMRTtcblNsb3dCdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkJFID0gQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJCRTtcblNsb3dCdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdExFID0gQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRMRTtcblNsb3dCdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdEJFID0gQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRCRTtcblNsb3dCdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVMRSA9IEJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUxFO1xuU2xvd0J1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUJFID0gQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlQkU7XG5TbG93QnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQ4ID0gQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQ4O1xuU2xvd0J1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZMRSA9IEJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZMRTtcblNsb3dCdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2QkUgPSBCdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2QkU7XG5TbG93QnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFID0gQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFO1xuU2xvd0J1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJCRSA9IEJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJCRTtcblNsb3dCdWZmZXIucHJvdG90eXBlLndyaXRlSW50OCA9IEJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQ4O1xuU2xvd0J1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkxFID0gQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2TEU7XG5TbG93QnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2QkUgPSBCdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZCRTtcblNsb3dCdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJMRSA9IEJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkxFO1xuU2xvd0J1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkJFID0gQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyQkU7XG5TbG93QnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0TEUgPSBCdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRMRTtcblNsb3dCdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRCRSA9IEJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdEJFO1xuU2xvd0J1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVMRSA9IEJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVMRTtcblNsb3dCdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlQkUgPSBCdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlQkU7XG5cbn0se1wiYXNzZXJ0XCI6MSxcIi4vYnVmZmVyX2llZWU3NTRcIjo4LFwiYmFzZTY0LWpzXCI6OX1dLDk6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuKGZ1bmN0aW9uIChleHBvcnRzKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgbG9va3VwID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nO1xuXG5cdGZ1bmN0aW9uIGI2NFRvQnl0ZUFycmF5KGI2NCkge1xuXHRcdHZhciBpLCBqLCBsLCB0bXAsIHBsYWNlSG9sZGVycywgYXJyO1xuXHRcblx0XHRpZiAoYjY0Lmxlbmd0aCAlIDQgPiAwKSB7XG5cdFx0XHR0aHJvdyAnSW52YWxpZCBzdHJpbmcuIExlbmd0aCBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNCc7XG5cdFx0fVxuXG5cdFx0Ly8gdGhlIG51bWJlciBvZiBlcXVhbCBzaWducyAocGxhY2UgaG9sZGVycylcblx0XHQvLyBpZiB0aGVyZSBhcmUgdHdvIHBsYWNlaG9sZGVycywgdGhhbiB0aGUgdHdvIGNoYXJhY3RlcnMgYmVmb3JlIGl0XG5cdFx0Ly8gcmVwcmVzZW50IG9uZSBieXRlXG5cdFx0Ly8gaWYgdGhlcmUgaXMgb25seSBvbmUsIHRoZW4gdGhlIHRocmVlIGNoYXJhY3RlcnMgYmVmb3JlIGl0IHJlcHJlc2VudCAyIGJ5dGVzXG5cdFx0Ly8gdGhpcyBpcyBqdXN0IGEgY2hlYXAgaGFjayB0byBub3QgZG8gaW5kZXhPZiB0d2ljZVxuXHRcdHBsYWNlSG9sZGVycyA9IGI2NC5pbmRleE9mKCc9Jyk7XG5cdFx0cGxhY2VIb2xkZXJzID0gcGxhY2VIb2xkZXJzID4gMCA/IGI2NC5sZW5ndGggLSBwbGFjZUhvbGRlcnMgOiAwO1xuXG5cdFx0Ly8gYmFzZTY0IGlzIDQvMyArIHVwIHRvIHR3byBjaGFyYWN0ZXJzIG9mIHRoZSBvcmlnaW5hbCBkYXRhXG5cdFx0YXJyID0gW107Ly9uZXcgVWludDhBcnJheShiNjQubGVuZ3RoICogMyAvIDQgLSBwbGFjZUhvbGRlcnMpO1xuXG5cdFx0Ly8gaWYgdGhlcmUgYXJlIHBsYWNlaG9sZGVycywgb25seSBnZXQgdXAgdG8gdGhlIGxhc3QgY29tcGxldGUgNCBjaGFyc1xuXHRcdGwgPSBwbGFjZUhvbGRlcnMgPiAwID8gYjY0Lmxlbmd0aCAtIDQgOiBiNjQubGVuZ3RoO1xuXG5cdFx0Zm9yIChpID0gMCwgaiA9IDA7IGkgPCBsOyBpICs9IDQsIGogKz0gMykge1xuXHRcdFx0dG1wID0gKGxvb2t1cC5pbmRleE9mKGI2NFtpXSkgPDwgMTgpIHwgKGxvb2t1cC5pbmRleE9mKGI2NFtpICsgMV0pIDw8IDEyKSB8IChsb29rdXAuaW5kZXhPZihiNjRbaSArIDJdKSA8PCA2KSB8IGxvb2t1cC5pbmRleE9mKGI2NFtpICsgM10pO1xuXHRcdFx0YXJyLnB1c2goKHRtcCAmIDB4RkYwMDAwKSA+PiAxNik7XG5cdFx0XHRhcnIucHVzaCgodG1wICYgMHhGRjAwKSA+PiA4KTtcblx0XHRcdGFyci5wdXNoKHRtcCAmIDB4RkYpO1xuXHRcdH1cblxuXHRcdGlmIChwbGFjZUhvbGRlcnMgPT09IDIpIHtcblx0XHRcdHRtcCA9IChsb29rdXAuaW5kZXhPZihiNjRbaV0pIDw8IDIpIHwgKGxvb2t1cC5pbmRleE9mKGI2NFtpICsgMV0pID4+IDQpO1xuXHRcdFx0YXJyLnB1c2godG1wICYgMHhGRik7XG5cdFx0fSBlbHNlIGlmIChwbGFjZUhvbGRlcnMgPT09IDEpIHtcblx0XHRcdHRtcCA9IChsb29rdXAuaW5kZXhPZihiNjRbaV0pIDw8IDEwKSB8IChsb29rdXAuaW5kZXhPZihiNjRbaSArIDFdKSA8PCA0KSB8IChsb29rdXAuaW5kZXhPZihiNjRbaSArIDJdKSA+PiAyKTtcblx0XHRcdGFyci5wdXNoKCh0bXAgPj4gOCkgJiAweEZGKTtcblx0XHRcdGFyci5wdXNoKHRtcCAmIDB4RkYpO1xuXHRcdH1cblxuXHRcdHJldHVybiBhcnI7XG5cdH1cblxuXHRmdW5jdGlvbiB1aW50OFRvQmFzZTY0KHVpbnQ4KSB7XG5cdFx0dmFyIGksXG5cdFx0XHRleHRyYUJ5dGVzID0gdWludDgubGVuZ3RoICUgMywgLy8gaWYgd2UgaGF2ZSAxIGJ5dGUgbGVmdCwgcGFkIDIgYnl0ZXNcblx0XHRcdG91dHB1dCA9IFwiXCIsXG5cdFx0XHR0ZW1wLCBsZW5ndGg7XG5cblx0XHRmdW5jdGlvbiB0cmlwbGV0VG9CYXNlNjQgKG51bSkge1xuXHRcdFx0cmV0dXJuIGxvb2t1cFtudW0gPj4gMTggJiAweDNGXSArIGxvb2t1cFtudW0gPj4gMTIgJiAweDNGXSArIGxvb2t1cFtudW0gPj4gNiAmIDB4M0ZdICsgbG9va3VwW251bSAmIDB4M0ZdO1xuXHRcdH07XG5cblx0XHQvLyBnbyB0aHJvdWdoIHRoZSBhcnJheSBldmVyeSB0aHJlZSBieXRlcywgd2UnbGwgZGVhbCB3aXRoIHRyYWlsaW5nIHN0dWZmIGxhdGVyXG5cdFx0Zm9yIChpID0gMCwgbGVuZ3RoID0gdWludDgubGVuZ3RoIC0gZXh0cmFCeXRlczsgaSA8IGxlbmd0aDsgaSArPSAzKSB7XG5cdFx0XHR0ZW1wID0gKHVpbnQ4W2ldIDw8IDE2KSArICh1aW50OFtpICsgMV0gPDwgOCkgKyAodWludDhbaSArIDJdKTtcblx0XHRcdG91dHB1dCArPSB0cmlwbGV0VG9CYXNlNjQodGVtcCk7XG5cdFx0fVxuXG5cdFx0Ly8gcGFkIHRoZSBlbmQgd2l0aCB6ZXJvcywgYnV0IG1ha2Ugc3VyZSB0byBub3QgZm9yZ2V0IHRoZSBleHRyYSBieXRlc1xuXHRcdHN3aXRjaCAoZXh0cmFCeXRlcykge1xuXHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHR0ZW1wID0gdWludDhbdWludDgubGVuZ3RoIC0gMV07XG5cdFx0XHRcdG91dHB1dCArPSBsb29rdXBbdGVtcCA+PiAyXTtcblx0XHRcdFx0b3V0cHV0ICs9IGxvb2t1cFsodGVtcCA8PCA0KSAmIDB4M0ZdO1xuXHRcdFx0XHRvdXRwdXQgKz0gJz09Jztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDI6XG5cdFx0XHRcdHRlbXAgPSAodWludDhbdWludDgubGVuZ3RoIC0gMl0gPDwgOCkgKyAodWludDhbdWludDgubGVuZ3RoIC0gMV0pO1xuXHRcdFx0XHRvdXRwdXQgKz0gbG9va3VwW3RlbXAgPj4gMTBdO1xuXHRcdFx0XHRvdXRwdXQgKz0gbG9va3VwWyh0ZW1wID4+IDQpICYgMHgzRl07XG5cdFx0XHRcdG91dHB1dCArPSBsb29rdXBbKHRlbXAgPDwgMikgJiAweDNGXTtcblx0XHRcdFx0b3V0cHV0ICs9ICc9Jztcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG91dHB1dDtcblx0fVxuXG5cdG1vZHVsZS5leHBvcnRzLnRvQnl0ZUFycmF5ID0gYjY0VG9CeXRlQXJyYXk7XG5cdG1vZHVsZS5leHBvcnRzLmZyb21CeXRlQXJyYXkgPSB1aW50OFRvQmFzZTY0O1xufSgpKTtcblxufSx7fV19LHt9LFtdKVxuOzttb2R1bGUuZXhwb3J0cz1yZXF1aXJlKFwiYnVmZmVyLWJyb3dzZXJpZnlcIilcbiIsIihmdW5jdGlvbihCdWZmZXIpe1xuKGZ1bmN0aW9uIChnbG9iYWwsIG1vZHVsZSkge1xuXG4gIGlmICgndW5kZWZpbmVkJyA9PSB0eXBlb2YgbW9kdWxlKSB7XG4gICAgdmFyIG1vZHVsZSA9IHsgZXhwb3J0czoge30gfVxuICAgICAgLCBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHNcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHBvcnRzLlxuICAgKi9cblxuICBtb2R1bGUuZXhwb3J0cyA9IGV4cGVjdDtcbiAgZXhwZWN0LkFzc2VydGlvbiA9IEFzc2VydGlvbjtcblxuICAvKipcbiAgICogRXhwb3J0cyB2ZXJzaW9uLlxuICAgKi9cblxuICBleHBlY3QudmVyc2lvbiA9ICcwLjEuMic7XG5cbiAgLyoqXG4gICAqIFBvc3NpYmxlIGFzc2VydGlvbiBmbGFncy5cbiAgICovXG5cbiAgdmFyIGZsYWdzID0ge1xuICAgICAgbm90OiBbJ3RvJywgJ2JlJywgJ2hhdmUnLCAnaW5jbHVkZScsICdvbmx5J11cbiAgICAsIHRvOiBbJ2JlJywgJ2hhdmUnLCAnaW5jbHVkZScsICdvbmx5JywgJ25vdCddXG4gICAgLCBvbmx5OiBbJ2hhdmUnXVxuICAgICwgaGF2ZTogWydvd24nXVxuICAgICwgYmU6IFsnYW4nXVxuICB9O1xuXG4gIGZ1bmN0aW9uIGV4cGVjdCAob2JqKSB7XG4gICAgcmV0dXJuIG5ldyBBc3NlcnRpb24ob2JqKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvclxuICAgKlxuICAgKiBAYXBpIHByaXZhdGVcbiAgICovXG5cbiAgZnVuY3Rpb24gQXNzZXJ0aW9uIChvYmosIGZsYWcsIHBhcmVudCkge1xuICAgIHRoaXMub2JqID0gb2JqO1xuICAgIHRoaXMuZmxhZ3MgPSB7fTtcblxuICAgIGlmICh1bmRlZmluZWQgIT0gcGFyZW50KSB7XG4gICAgICB0aGlzLmZsYWdzW2ZsYWddID0gdHJ1ZTtcblxuICAgICAgZm9yICh2YXIgaSBpbiBwYXJlbnQuZmxhZ3MpIHtcbiAgICAgICAgaWYgKHBhcmVudC5mbGFncy5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgICAgIHRoaXMuZmxhZ3NbaV0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyICRmbGFncyA9IGZsYWcgPyBmbGFnc1tmbGFnXSA6IGtleXMoZmxhZ3MpXG4gICAgICAsIHNlbGYgPSB0aGlzXG5cbiAgICBpZiAoJGZsYWdzKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9ICRmbGFncy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgLy8gYXZvaWQgcmVjdXJzaW9uXG4gICAgICAgIGlmICh0aGlzLmZsYWdzWyRmbGFnc1tpXV0pIGNvbnRpbnVlO1xuXG4gICAgICAgIHZhciBuYW1lID0gJGZsYWdzW2ldXG4gICAgICAgICAgLCBhc3NlcnRpb24gPSBuZXcgQXNzZXJ0aW9uKHRoaXMub2JqLCBuYW1lLCB0aGlzKVxuXG4gICAgICAgIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBBc3NlcnRpb24ucHJvdG90eXBlW25hbWVdKSB7XG4gICAgICAgICAgLy8gY2xvbmUgdGhlIGZ1bmN0aW9uLCBtYWtlIHN1cmUgd2UgZG9udCB0b3VjaCB0aGUgcHJvdCByZWZlcmVuY2VcbiAgICAgICAgICB2YXIgb2xkID0gdGhpc1tuYW1lXTtcbiAgICAgICAgICB0aGlzW25hbWVdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIG9sZC5hcHBseShzZWxmLCBhcmd1bWVudHMpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGZvciAodmFyIGZuIGluIEFzc2VydGlvbi5wcm90b3R5cGUpIHtcbiAgICAgICAgICAgIGlmIChBc3NlcnRpb24ucHJvdG90eXBlLmhhc093blByb3BlcnR5KGZuKSAmJiBmbiAhPSBuYW1lKSB7XG4gICAgICAgICAgICAgIHRoaXNbbmFtZV1bZm5dID0gYmluZChhc3NlcnRpb25bZm5dLCBhc3NlcnRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzW25hbWVdID0gYXNzZXJ0aW9uO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBQZXJmb3JtcyBhbiBhc3NlcnRpb25cbiAgICpcbiAgICogQGFwaSBwcml2YXRlXG4gICAqL1xuXG4gIEFzc2VydGlvbi5wcm90b3R5cGUuYXNzZXJ0ID0gZnVuY3Rpb24gKHRydXRoLCBtc2csIGVycm9yKSB7XG4gICAgdmFyIG1zZyA9IHRoaXMuZmxhZ3Mubm90ID8gZXJyb3IgOiBtc2dcbiAgICAgICwgb2sgPSB0aGlzLmZsYWdzLm5vdCA/ICF0cnV0aCA6IHRydXRoO1xuXG4gICAgaWYgKCFvaykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZy5jYWxsKHRoaXMpKTtcbiAgICB9XG5cbiAgICB0aGlzLmFuZCA9IG5ldyBBc3NlcnRpb24odGhpcy5vYmopO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgdmFsdWUgaXMgdHJ1dGh5XG4gICAqXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIEFzc2VydGlvbi5wcm90b3R5cGUub2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5hc3NlcnQoXG4gICAgICAgICEhdGhpcy5vYmpcbiAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIGJlIHRydXRoeScgfVxuICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgdG8gYmUgZmFsc3knIH0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBc3NlcnQgdGhhdCB0aGUgZnVuY3Rpb24gdGhyb3dzLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufFJlZ0V4cH0gY2FsbGJhY2ssIG9yIHJlZ2V4cCB0byBtYXRjaCBlcnJvciBzdHJpbmcgYWdhaW5zdFxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBBc3NlcnRpb24ucHJvdG90eXBlLnRocm93RXJyb3IgPVxuICBBc3NlcnRpb24ucHJvdG90eXBlLnRocm93RXhjZXB0aW9uID0gZnVuY3Rpb24gKGZuKSB7XG4gICAgZXhwZWN0KHRoaXMub2JqKS50by5iZS5hKCdmdW5jdGlvbicpO1xuXG4gICAgdmFyIHRocm93biA9IGZhbHNlXG4gICAgICAsIG5vdCA9IHRoaXMuZmxhZ3Mubm90XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy5vYmooKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZm4pIHtcbiAgICAgICAgZm4oZSk7XG4gICAgICB9IGVsc2UgaWYgKCdvYmplY3QnID09IHR5cGVvZiBmbikge1xuICAgICAgICB2YXIgc3ViamVjdCA9ICdzdHJpbmcnID09IHR5cGVvZiBlID8gZSA6IGUubWVzc2FnZTtcbiAgICAgICAgaWYgKG5vdCkge1xuICAgICAgICAgIGV4cGVjdChzdWJqZWN0KS50by5ub3QubWF0Y2goZm4pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGV4cGVjdChzdWJqZWN0KS50by5tYXRjaChmbik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRocm93biA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKCdvYmplY3QnID09IHR5cGVvZiBmbiAmJiBub3QpIHtcbiAgICAgIC8vIGluIHRoZSBwcmVzZW5jZSBvZiBhIG1hdGNoZXIsIGVuc3VyZSB0aGUgYG5vdGAgb25seSBhcHBsaWVzIHRvXG4gICAgICAvLyB0aGUgbWF0Y2hpbmcuXG4gICAgICB0aGlzLmZsYWdzLm5vdCA9IGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBuYW1lID0gdGhpcy5vYmoubmFtZSB8fCAnZm4nO1xuICAgIHRoaXMuYXNzZXJ0KFxuICAgICAgICB0aHJvd25cbiAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgbmFtZSArICcgdG8gdGhyb3cgYW4gZXhjZXB0aW9uJyB9XG4gICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIG5hbWUgKyAnIG5vdCB0byB0aHJvdyBhbiBleGNlcHRpb24nIH0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGFycmF5IGlzIGVtcHR5LlxuICAgKlxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBBc3NlcnRpb24ucHJvdG90eXBlLmVtcHR5ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHBlY3RhdGlvbjtcblxuICAgIGlmICgnb2JqZWN0JyA9PSB0eXBlb2YgdGhpcy5vYmogJiYgbnVsbCAhPT0gdGhpcy5vYmogJiYgIWlzQXJyYXkodGhpcy5vYmopKSB7XG4gICAgICBpZiAoJ251bWJlcicgPT0gdHlwZW9mIHRoaXMub2JqLmxlbmd0aCkge1xuICAgICAgICBleHBlY3RhdGlvbiA9ICF0aGlzLm9iai5sZW5ndGg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBleHBlY3RhdGlvbiA9ICFrZXlzKHRoaXMub2JqKS5sZW5ndGg7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICgnc3RyaW5nJyAhPSB0eXBlb2YgdGhpcy5vYmopIHtcbiAgICAgICAgZXhwZWN0KHRoaXMub2JqKS50by5iZS5hbignb2JqZWN0Jyk7XG4gICAgICB9XG5cbiAgICAgIGV4cGVjdCh0aGlzLm9iaikudG8uaGF2ZS5wcm9wZXJ0eSgnbGVuZ3RoJyk7XG4gICAgICBleHBlY3RhdGlvbiA9ICF0aGlzLm9iai5sZW5ndGg7XG4gICAgfVxuXG4gICAgdGhpcy5hc3NlcnQoXG4gICAgICAgIGV4cGVjdGF0aW9uXG4gICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBiZSBlbXB0eScgfVxuICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgdG8gbm90IGJlIGVtcHR5JyB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBvYmogZXhhY3RseSBlcXVhbHMgYW5vdGhlci5cbiAgICpcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgQXNzZXJ0aW9uLnByb3RvdHlwZS5iZSA9XG4gIEFzc2VydGlvbi5wcm90b3R5cGUuZXF1YWwgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgdGhpcy5hc3NlcnQoXG4gICAgICAgIG9iaiA9PT0gdGhpcy5vYmpcbiAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIGVxdWFsICcgKyBpKG9iaikgfVxuICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgdG8gbm90IGVxdWFsICcgKyBpKG9iaikgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgb2JqIHNvcnRvZiBlcXVhbHMgYW5vdGhlci5cbiAgICpcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgQXNzZXJ0aW9uLnByb3RvdHlwZS5lcWwgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgdGhpcy5hc3NlcnQoXG4gICAgICAgIGV4cGVjdC5lcWwob2JqLCB0aGlzLm9iailcbiAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIHNvcnQgb2YgZXF1YWwgJyArIGkob2JqKSB9XG4gICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBzb3J0IG9mIG5vdCBlcXVhbCAnICsgaShvYmopIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBc3NlcnQgd2l0aGluIHN0YXJ0IHRvIGZpbmlzaCAoaW5jbHVzaXZlKS5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHN0YXJ0XG4gICAqIEBwYXJhbSB7TnVtYmVyfSBmaW5pc2hcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgQXNzZXJ0aW9uLnByb3RvdHlwZS53aXRoaW4gPSBmdW5jdGlvbiAoc3RhcnQsIGZpbmlzaCkge1xuICAgIHZhciByYW5nZSA9IHN0YXJ0ICsgJy4uJyArIGZpbmlzaDtcbiAgICB0aGlzLmFzc2VydChcbiAgICAgICAgdGhpcy5vYmogPj0gc3RhcnQgJiYgdGhpcy5vYmogPD0gZmluaXNoXG4gICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBiZSB3aXRoaW4gJyArIHJhbmdlIH1cbiAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIG5vdCBiZSB3aXRoaW4gJyArIHJhbmdlIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBc3NlcnQgdHlwZW9mIC8gaW5zdGFuY2Ugb2ZcbiAgICpcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgQXNzZXJ0aW9uLnByb3RvdHlwZS5hID1cbiAgQXNzZXJ0aW9uLnByb3RvdHlwZS5hbiA9IGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgaWYgKCdzdHJpbmcnID09IHR5cGVvZiB0eXBlKSB7XG4gICAgICAvLyBwcm9wZXIgZW5nbGlzaCBpbiBlcnJvciBtc2dcbiAgICAgIHZhciBuID0gL15bYWVpb3VdLy50ZXN0KHR5cGUpID8gJ24nIDogJyc7XG5cbiAgICAgIC8vIHR5cGVvZiB3aXRoIHN1cHBvcnQgZm9yICdhcnJheSdcbiAgICAgIHRoaXMuYXNzZXJ0KFxuICAgICAgICAgICdhcnJheScgPT0gdHlwZSA/IGlzQXJyYXkodGhpcy5vYmopIDpcbiAgICAgICAgICAgICdvYmplY3QnID09IHR5cGVcbiAgICAgICAgICAgICAgPyAnb2JqZWN0JyA9PSB0eXBlb2YgdGhpcy5vYmogJiYgbnVsbCAhPT0gdGhpcy5vYmpcbiAgICAgICAgICAgICAgOiB0eXBlID09IHR5cGVvZiB0aGlzLm9ialxuICAgICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBiZSBhJyArIG4gKyAnICcgKyB0eXBlIH1cbiAgICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgbm90IHRvIGJlIGEnICsgbiArICcgJyArIHR5cGUgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGluc3RhbmNlb2ZcbiAgICAgIHZhciBuYW1lID0gdHlwZS5uYW1lIHx8ICdzdXBwbGllZCBjb25zdHJ1Y3Rvcic7XG4gICAgICB0aGlzLmFzc2VydChcbiAgICAgICAgICB0aGlzLm9iaiBpbnN0YW5jZW9mIHR5cGVcbiAgICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgdG8gYmUgYW4gaW5zdGFuY2Ugb2YgJyArIG5hbWUgfVxuICAgICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyBub3QgdG8gYmUgYW4gaW5zdGFuY2Ugb2YgJyArIG5hbWUgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIEFzc2VydCBudW1lcmljIHZhbHVlIGFib3ZlIF9uXy5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG5cbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgQXNzZXJ0aW9uLnByb3RvdHlwZS5ncmVhdGVyVGhhbiA9XG4gIEFzc2VydGlvbi5wcm90b3R5cGUuYWJvdmUgPSBmdW5jdGlvbiAobikge1xuICAgIHRoaXMuYXNzZXJ0KFxuICAgICAgICB0aGlzLm9iaiA+IG5cbiAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIGJlIGFib3ZlICcgKyBuIH1cbiAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIGJlIGJlbG93ICcgKyBuIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBc3NlcnQgbnVtZXJpYyB2YWx1ZSBiZWxvdyBfbl8uXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBuXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIEFzc2VydGlvbi5wcm90b3R5cGUubGVzc1RoYW4gPVxuICBBc3NlcnRpb24ucHJvdG90eXBlLmJlbG93ID0gZnVuY3Rpb24gKG4pIHtcbiAgICB0aGlzLmFzc2VydChcbiAgICAgICAgdGhpcy5vYmogPCBuXG4gICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBiZSBiZWxvdyAnICsgbiB9XG4gICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBiZSBhYm92ZSAnICsgbiB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogQXNzZXJ0IHN0cmluZyB2YWx1ZSBtYXRjaGVzIF9yZWdleHBfLlxuICAgKlxuICAgKiBAcGFyYW0ge1JlZ0V4cH0gcmVnZXhwXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIEFzc2VydGlvbi5wcm90b3R5cGUubWF0Y2ggPSBmdW5jdGlvbiAocmVnZXhwKSB7XG4gICAgdGhpcy5hc3NlcnQoXG4gICAgICAgIHJlZ2V4cC5leGVjKHRoaXMub2JqKVxuICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgdG8gbWF0Y2ggJyArIHJlZ2V4cCB9XG4gICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyBub3QgdG8gbWF0Y2ggJyArIHJlZ2V4cCB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogQXNzZXJ0IHByb3BlcnR5IFwibGVuZ3RoXCIgZXhpc3RzIGFuZCBoYXMgdmFsdWUgb2YgX25fLlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gblxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBBc3NlcnRpb24ucHJvdG90eXBlLmxlbmd0aCA9IGZ1bmN0aW9uIChuKSB7XG4gICAgZXhwZWN0KHRoaXMub2JqKS50by5oYXZlLnByb3BlcnR5KCdsZW5ndGgnKTtcbiAgICB2YXIgbGVuID0gdGhpcy5vYmoubGVuZ3RoO1xuICAgIHRoaXMuYXNzZXJ0KFxuICAgICAgICBuID09IGxlblxuICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgdG8gaGF2ZSBhIGxlbmd0aCBvZiAnICsgbiArICcgYnV0IGdvdCAnICsgbGVuIH1cbiAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIG5vdCBoYXZlIGEgbGVuZ3RoIG9mICcgKyBsZW4gfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIEFzc2VydCBwcm9wZXJ0eSBfbmFtZV8gZXhpc3RzLCB3aXRoIG9wdGlvbmFsIF92YWxfLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICAgKiBAcGFyYW0ge01peGVkfSB2YWxcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgQXNzZXJ0aW9uLnByb3RvdHlwZS5wcm9wZXJ0eSA9IGZ1bmN0aW9uIChuYW1lLCB2YWwpIHtcbiAgICBpZiAodGhpcy5mbGFncy5vd24pIHtcbiAgICAgIHRoaXMuYXNzZXJ0KFxuICAgICAgICAgIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0aGlzLm9iaiwgbmFtZSlcbiAgICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgdG8gaGF2ZSBvd24gcHJvcGVydHkgJyArIGkobmFtZSkgfVxuICAgICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBub3QgaGF2ZSBvd24gcHJvcGVydHkgJyArIGkobmFtZSkgfSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBpZiAodGhpcy5mbGFncy5ub3QgJiYgdW5kZWZpbmVkICE9PSB2YWwpIHtcbiAgICAgIGlmICh1bmRlZmluZWQgPT09IHRoaXMub2JqW25hbWVdKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihpKHRoaXMub2JqKSArICcgaGFzIG5vIHByb3BlcnR5ICcgKyBpKG5hbWUpKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGhhc1Byb3A7XG4gICAgICB0cnkge1xuICAgICAgICBoYXNQcm9wID0gbmFtZSBpbiB0aGlzLm9ialxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBoYXNQcm9wID0gdW5kZWZpbmVkICE9PSB0aGlzLm9ialtuYW1lXVxuICAgICAgfVxuXG4gICAgICB0aGlzLmFzc2VydChcbiAgICAgICAgICBoYXNQcm9wXG4gICAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIGhhdmUgYSBwcm9wZXJ0eSAnICsgaShuYW1lKSB9XG4gICAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIG5vdCBoYXZlIGEgcHJvcGVydHkgJyArIGkobmFtZSkgfSk7XG4gICAgfVxuXG4gICAgaWYgKHVuZGVmaW5lZCAhPT0gdmFsKSB7XG4gICAgICB0aGlzLmFzc2VydChcbiAgICAgICAgICB2YWwgPT09IHRoaXMub2JqW25hbWVdXG4gICAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIGhhdmUgYSBwcm9wZXJ0eSAnICsgaShuYW1lKVxuICAgICAgICAgICsgJyBvZiAnICsgaSh2YWwpICsgJywgYnV0IGdvdCAnICsgaSh0aGlzLm9ialtuYW1lXSkgfVxuICAgICAgICAsIGZ1bmN0aW9uKCl7IHJldHVybiAnZXhwZWN0ZWQgJyArIGkodGhpcy5vYmopICsgJyB0byBub3QgaGF2ZSBhIHByb3BlcnR5ICcgKyBpKG5hbWUpXG4gICAgICAgICAgKyAnIG9mICcgKyBpKHZhbCkgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5vYmogPSB0aGlzLm9ialtuYW1lXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogQXNzZXJ0IHRoYXQgdGhlIGFycmF5IGNvbnRhaW5zIF9vYmpfIG9yIHN0cmluZyBjb250YWlucyBfb2JqXy5cbiAgICpcbiAgICogQHBhcmFtIHtNaXhlZH0gb2JqfHN0cmluZ1xuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBBc3NlcnRpb24ucHJvdG90eXBlLnN0cmluZyA9XG4gIEFzc2VydGlvbi5wcm90b3R5cGUuY29udGFpbiA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICBpZiAoJ3N0cmluZycgPT0gdHlwZW9mIHRoaXMub2JqKSB7XG4gICAgICB0aGlzLmFzc2VydChcbiAgICAgICAgICB+dGhpcy5vYmouaW5kZXhPZihvYmopXG4gICAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIGNvbnRhaW4gJyArIGkob2JqKSB9XG4gICAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIG5vdCBjb250YWluICcgKyBpKG9iaikgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYXNzZXJ0KFxuICAgICAgICAgIH5pbmRleE9mKHRoaXMub2JqLCBvYmopXG4gICAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIGNvbnRhaW4gJyArIGkob2JqKSB9XG4gICAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvIG5vdCBjb250YWluICcgKyBpKG9iaikgfSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBc3NlcnQgZXhhY3Qga2V5cyBvciBpbmNsdXNpb24gb2Yga2V5cyBieSB1c2luZ1xuICAgKiB0aGUgYC5vd25gIG1vZGlmaWVyLlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5fFN0cmluZyAuLi59IGtleXNcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgQXNzZXJ0aW9uLnByb3RvdHlwZS5rZXkgPVxuICBBc3NlcnRpb24ucHJvdG90eXBlLmtleXMgPSBmdW5jdGlvbiAoJGtleXMpIHtcbiAgICB2YXIgc3RyXG4gICAgICAsIG9rID0gdHJ1ZTtcblxuICAgICRrZXlzID0gaXNBcnJheSgka2V5cylcbiAgICAgID8gJGtleXNcbiAgICAgIDogQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblxuICAgIGlmICghJGtleXMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ2tleXMgcmVxdWlyZWQnKTtcblxuICAgIHZhciBhY3R1YWwgPSBrZXlzKHRoaXMub2JqKVxuICAgICAgLCBsZW4gPSAka2V5cy5sZW5ndGg7XG5cbiAgICAvLyBJbmNsdXNpb25cbiAgICBvayA9IGV2ZXJ5KCRrZXlzLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICByZXR1cm4gfmluZGV4T2YoYWN0dWFsLCBrZXkpO1xuICAgIH0pO1xuXG4gICAgLy8gU3RyaWN0XG4gICAgaWYgKCF0aGlzLmZsYWdzLm5vdCAmJiB0aGlzLmZsYWdzLm9ubHkpIHtcbiAgICAgIG9rID0gb2sgJiYgJGtleXMubGVuZ3RoID09IGFjdHVhbC5sZW5ndGg7XG4gICAgfVxuXG4gICAgLy8gS2V5IHN0cmluZ1xuICAgIGlmIChsZW4gPiAxKSB7XG4gICAgICAka2V5cyA9IG1hcCgka2V5cywgZnVuY3Rpb24gKGtleSkge1xuICAgICAgICByZXR1cm4gaShrZXkpO1xuICAgICAgfSk7XG4gICAgICB2YXIgbGFzdCA9ICRrZXlzLnBvcCgpO1xuICAgICAgc3RyID0gJGtleXMuam9pbignLCAnKSArICcsIGFuZCAnICsgbGFzdDtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gaSgka2V5c1swXSk7XG4gICAgfVxuXG4gICAgLy8gRm9ybVxuICAgIHN0ciA9IChsZW4gPiAxID8gJ2tleXMgJyA6ICdrZXkgJykgKyBzdHI7XG5cbiAgICAvLyBIYXZlIC8gaW5jbHVkZVxuICAgIHN0ciA9ICghdGhpcy5mbGFncy5vbmx5ID8gJ2luY2x1ZGUgJyA6ICdvbmx5IGhhdmUgJykgKyBzdHI7XG5cbiAgICAvLyBBc3NlcnRpb25cbiAgICB0aGlzLmFzc2VydChcbiAgICAgICAgb2tcbiAgICAgICwgZnVuY3Rpb24oKXsgcmV0dXJuICdleHBlY3RlZCAnICsgaSh0aGlzLm9iaikgKyAnIHRvICcgKyBzdHIgfVxuICAgICAgLCBmdW5jdGlvbigpeyByZXR1cm4gJ2V4cGVjdGVkICcgKyBpKHRoaXMub2JqKSArICcgdG8gbm90ICcgKyBzdHIgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgLyoqXG4gICAqIEFzc2VydCBhIGZhaWx1cmUuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nIC4uLn0gY3VzdG9tIG1lc3NhZ2VcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG4gIEFzc2VydGlvbi5wcm90b3R5cGUuZmFpbCA9IGZ1bmN0aW9uIChtc2cpIHtcbiAgICBtc2cgPSBtc2cgfHwgXCJleHBsaWNpdCBmYWlsdXJlXCI7XG4gICAgdGhpcy5hc3NlcnQoZmFsc2UsIG1zZywgbXNnKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogRnVuY3Rpb24gYmluZCBpbXBsZW1lbnRhdGlvbi5cbiAgICovXG5cbiAgZnVuY3Rpb24gYmluZCAoZm4sIHNjb3BlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBmbi5hcHBseShzY29wZSwgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQXJyYXkgZXZlcnkgY29tcGF0aWJpbGl0eVxuICAgKlxuICAgKiBAc2VlIGJpdC5seS81RnExTjJcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgZnVuY3Rpb24gZXZlcnkgKGFyciwgZm4sIHRoaXNPYmopIHtcbiAgICB2YXIgc2NvcGUgPSB0aGlzT2JqIHx8IGdsb2JhbDtcbiAgICBmb3IgKHZhciBpID0gMCwgaiA9IGFyci5sZW5ndGg7IGkgPCBqOyArK2kpIHtcbiAgICAgIGlmICghZm4uY2FsbChzY29wZSwgYXJyW2ldLCBpLCBhcnIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgLyoqXG4gICAqIEFycmF5IGluZGV4T2YgY29tcGF0aWJpbGl0eS5cbiAgICpcbiAgICogQHNlZSBiaXQubHkvYTVEeGEyXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIGZ1bmN0aW9uIGluZGV4T2YgKGFyciwgbywgaSkge1xuICAgIGlmIChBcnJheS5wcm90b3R5cGUuaW5kZXhPZikge1xuICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoYXJyLCBvLCBpKTtcbiAgICB9XG5cbiAgICBpZiAoYXJyLmxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaiA9IGFyci5sZW5ndGgsIGkgPSBpIDwgMCA/IGkgKyBqIDwgMCA/IDAgOiBpICsgaiA6IGkgfHwgMFxuICAgICAgICA7IGkgPCBqICYmIGFycltpXSAhPT0gbzsgaSsrKTtcblxuICAgIHJldHVybiBqIDw9IGkgPyAtMSA6IGk7XG4gIH07XG5cbiAgLy8gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vMTA0NDEyOC9cbiAgdmFyIGdldE91dGVySFRNTCA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICBpZiAoJ291dGVySFRNTCcgaW4gZWxlbWVudCkgcmV0dXJuIGVsZW1lbnQub3V0ZXJIVE1MO1xuICAgIHZhciBucyA9IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbFwiO1xuICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdfJyk7XG4gICAgdmFyIGVsZW1Qcm90byA9ICh3aW5kb3cuSFRNTEVsZW1lbnQgfHwgd2luZG93LkVsZW1lbnQpLnByb3RvdHlwZTtcbiAgICB2YXIgeG1sU2VyaWFsaXplciA9IG5ldyBYTUxTZXJpYWxpemVyKCk7XG4gICAgdmFyIGh0bWw7XG4gICAgaWYgKGRvY3VtZW50LnhtbFZlcnNpb24pIHtcbiAgICAgIHJldHVybiB4bWxTZXJpYWxpemVyLnNlcmlhbGl6ZVRvU3RyaW5nKGVsZW1lbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZWxlbWVudC5jbG9uZU5vZGUoZmFsc2UpKTtcbiAgICAgIGh0bWwgPSBjb250YWluZXIuaW5uZXJIVE1MLnJlcGxhY2UoJz48JywgJz4nICsgZWxlbWVudC5pbm5lckhUTUwgKyAnPCcpO1xuICAgICAgY29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuICAgICAgcmV0dXJuIGh0bWw7XG4gICAgfVxuICB9O1xuXG4gIC8vIFJldHVybnMgdHJ1ZSBpZiBvYmplY3QgaXMgYSBET00gZWxlbWVudC5cbiAgdmFyIGlzRE9NRWxlbWVudCA9IGZ1bmN0aW9uIChvYmplY3QpIHtcbiAgICBpZiAodHlwZW9mIEhUTUxFbGVtZW50ID09PSAnb2JqZWN0Jykge1xuICAgICAgcmV0dXJuIG9iamVjdCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb2JqZWN0ICYmXG4gICAgICAgIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmXG4gICAgICAgIG9iamVjdC5ub2RlVHlwZSA9PT0gMSAmJlxuICAgICAgICB0eXBlb2Ygb2JqZWN0Lm5vZGVOYW1lID09PSAnc3RyaW5nJztcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEluc3BlY3RzIGFuIG9iamVjdC5cbiAgICpcbiAgICogQHNlZSB0YWtlbiBmcm9tIG5vZGUuanMgYHV0aWxgIG1vZHVsZSAoY29weXJpZ2h0IEpveWVudCwgTUlUIGxpY2Vuc2UpXG4gICAqIEBhcGkgcHJpdmF0ZVxuICAgKi9cblxuICBmdW5jdGlvbiBpIChvYmosIHNob3dIaWRkZW4sIGRlcHRoKSB7XG4gICAgdmFyIHNlZW4gPSBbXTtcblxuICAgIGZ1bmN0aW9uIHN0eWxpemUgKHN0cikge1xuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZm9ybWF0ICh2YWx1ZSwgcmVjdXJzZVRpbWVzKSB7XG4gICAgICAvLyBQcm92aWRlIGEgaG9vayBmb3IgdXNlci1zcGVjaWZpZWQgaW5zcGVjdCBmdW5jdGlvbnMuXG4gICAgICAvLyBDaGVjayB0aGF0IHZhbHVlIGlzIGFuIG9iamVjdCB3aXRoIGFuIGluc3BlY3QgZnVuY3Rpb24gb24gaXRcbiAgICAgIGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUuaW5zcGVjdCA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgICAgICAgIC8vIEZpbHRlciBvdXQgdGhlIHV0aWwgbW9kdWxlLCBpdCdzIGluc3BlY3QgZnVuY3Rpb24gaXMgc3BlY2lhbFxuICAgICAgICAgIHZhbHVlICE9PSBleHBvcnRzICYmXG4gICAgICAgICAgLy8gQWxzbyBmaWx0ZXIgb3V0IGFueSBwcm90b3R5cGUgb2JqZWN0cyB1c2luZyB0aGUgY2lyY3VsYXIgY2hlY2suXG4gICAgICAgICAgISh2YWx1ZS5jb25zdHJ1Y3RvciAmJiB2YWx1ZS5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgPT09IHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gdmFsdWUuaW5zcGVjdChyZWN1cnNlVGltZXMpO1xuICAgICAgfVxuXG4gICAgICAvLyBQcmltaXRpdmUgdHlwZXMgY2Fubm90IGhhdmUgcHJvcGVydGllc1xuICAgICAgc3dpdGNoICh0eXBlb2YgdmFsdWUpIHtcbiAgICAgICAgY2FzZSAndW5kZWZpbmVkJzpcbiAgICAgICAgICByZXR1cm4gc3R5bGl6ZSgndW5kZWZpbmVkJywgJ3VuZGVmaW5lZCcpO1xuXG4gICAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgICAgdmFyIHNpbXBsZSA9ICdcXCcnICsganNvbi5zdHJpbmdpZnkodmFsdWUpLnJlcGxhY2UoL15cInxcIiQvZywgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpICsgJ1xcJyc7XG4gICAgICAgICAgcmV0dXJuIHN0eWxpemUoc2ltcGxlLCAnc3RyaW5nJyk7XG5cbiAgICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgICByZXR1cm4gc3R5bGl6ZSgnJyArIHZhbHVlLCAnbnVtYmVyJyk7XG5cbiAgICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICAgICAgcmV0dXJuIHN0eWxpemUoJycgKyB2YWx1ZSwgJ2Jvb2xlYW4nKTtcbiAgICAgIH1cbiAgICAgIC8vIEZvciBzb21lIHJlYXNvbiB0eXBlb2YgbnVsbCBpcyBcIm9iamVjdFwiLCBzbyBzcGVjaWFsIGNhc2UgaGVyZS5cbiAgICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gc3R5bGl6ZSgnbnVsbCcsICdudWxsJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc0RPTUVsZW1lbnQodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBnZXRPdXRlckhUTUwodmFsdWUpO1xuICAgICAgfVxuXG4gICAgICAvLyBMb29rIHVwIHRoZSBrZXlzIG9mIHRoZSBvYmplY3QuXG4gICAgICB2YXIgdmlzaWJsZV9rZXlzID0ga2V5cyh2YWx1ZSk7XG4gICAgICB2YXIgJGtleXMgPSBzaG93SGlkZGVuID8gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModmFsdWUpIDogdmlzaWJsZV9rZXlzO1xuXG4gICAgICAvLyBGdW5jdGlvbnMgd2l0aG91dCBwcm9wZXJ0aWVzIGNhbiBiZSBzaG9ydGN1dHRlZC5cbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicgJiYgJGtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgICAgICByZXR1cm4gc3R5bGl6ZSgnJyArIHZhbHVlLCAncmVnZXhwJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIG5hbWUgPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICAgICAgICByZXR1cm4gc3R5bGl6ZSgnW0Z1bmN0aW9uJyArIG5hbWUgKyAnXScsICdzcGVjaWFsJyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gRGF0ZXMgd2l0aG91dCBwcm9wZXJ0aWVzIGNhbiBiZSBzaG9ydGN1dHRlZFxuICAgICAgaWYgKGlzRGF0ZSh2YWx1ZSkgJiYgJGtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBzdHlsaXplKHZhbHVlLnRvVVRDU3RyaW5nKCksICdkYXRlJyk7XG4gICAgICB9XG5cbiAgICAgIHZhciBiYXNlLCB0eXBlLCBicmFjZXM7XG4gICAgICAvLyBEZXRlcm1pbmUgdGhlIG9iamVjdCB0eXBlXG4gICAgICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgdHlwZSA9ICdBcnJheSc7XG4gICAgICAgIGJyYWNlcyA9IFsnWycsICddJ107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0eXBlID0gJ09iamVjdCc7XG4gICAgICAgIGJyYWNlcyA9IFsneycsICd9J107XG4gICAgICB9XG5cbiAgICAgIC8vIE1ha2UgZnVuY3Rpb25zIHNheSB0aGF0IHRoZXkgYXJlIGZ1bmN0aW9uc1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB2YXIgbiA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgICAgICBiYXNlID0gKGlzUmVnRXhwKHZhbHVlKSkgPyAnICcgKyB2YWx1ZSA6ICcgW0Z1bmN0aW9uJyArIG4gKyAnXSc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBiYXNlID0gJyc7XG4gICAgICB9XG5cbiAgICAgIC8vIE1ha2UgZGF0ZXMgd2l0aCBwcm9wZXJ0aWVzIGZpcnN0IHNheSB0aGUgZGF0ZVxuICAgICAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgICAgYmFzZSA9ICcgJyArIHZhbHVlLnRvVVRDU3RyaW5nKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICgka2V5cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyBicmFjZXNbMV07XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWN1cnNlVGltZXMgPCAwKSB7XG4gICAgICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgICAgICByZXR1cm4gc3R5bGl6ZSgnJyArIHZhbHVlLCAncmVnZXhwJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHN0eWxpemUoJ1tPYmplY3RdJywgJ3NwZWNpYWwnKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBzZWVuLnB1c2godmFsdWUpO1xuXG4gICAgICB2YXIgb3V0cHV0ID0gbWFwKCRrZXlzLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHZhciBuYW1lLCBzdHI7XG4gICAgICAgIGlmICh2YWx1ZS5fX2xvb2t1cEdldHRlcl9fKSB7XG4gICAgICAgICAgaWYgKHZhbHVlLl9fbG9va3VwR2V0dGVyX18oa2V5KSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlLl9fbG9va3VwU2V0dGVyX18oa2V5KSkge1xuICAgICAgICAgICAgICBzdHIgPSBzdHlsaXplKCdbR2V0dGVyL1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc3RyID0gc3R5bGl6ZSgnW0dldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodmFsdWUuX19sb29rdXBTZXR0ZXJfXyhrZXkpKSB7XG4gICAgICAgICAgICAgIHN0ciA9IHN0eWxpemUoJ1tTZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluZGV4T2YodmlzaWJsZV9rZXlzLCBrZXkpIDwgMCkge1xuICAgICAgICAgIG5hbWUgPSAnWycgKyBrZXkgKyAnXSc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzdHIpIHtcbiAgICAgICAgICBpZiAoaW5kZXhPZihzZWVuLCB2YWx1ZVtrZXldKSA8IDApIHtcbiAgICAgICAgICAgIGlmIChyZWN1cnNlVGltZXMgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgc3RyID0gZm9ybWF0KHZhbHVlW2tleV0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc3RyID0gZm9ybWF0KHZhbHVlW2tleV0sIHJlY3Vyc2VUaW1lcyAtIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHN0ci5pbmRleE9mKCdcXG4nKSA+IC0xKSB7XG4gICAgICAgICAgICAgIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHN0ciA9IG1hcChzdHIuc3BsaXQoJ1xcbicpLCBmdW5jdGlvbiAobGluZSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuICcgICcgKyBsaW5lO1xuICAgICAgICAgICAgICAgIH0pLmpvaW4oJ1xcbicpLnN1YnN0cigyKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdHIgPSAnXFxuJyArIG1hcChzdHIuc3BsaXQoJ1xcbicpLCBmdW5jdGlvbiAobGluZSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuICcgICAnICsgbGluZTtcbiAgICAgICAgICAgICAgICB9KS5qb2luKCdcXG4nKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdHIgPSBzdHlsaXplKCdbQ2lyY3VsYXJdJywgJ3NwZWNpYWwnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBuYW1lID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIGlmICh0eXBlID09PSAnQXJyYXknICYmIGtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHI7XG4gICAgICAgICAgfVxuICAgICAgICAgIG5hbWUgPSBqc29uLnN0cmluZ2lmeSgnJyArIGtleSk7XG4gICAgICAgICAgaWYgKG5hbWUubWF0Y2goL15cIihbYS16QS1aX11bYS16QS1aXzAtOV0qKVwiJC8pKSB7XG4gICAgICAgICAgICBuYW1lID0gbmFtZS5zdWJzdHIoMSwgbmFtZS5sZW5ndGggLSAyKTtcbiAgICAgICAgICAgIG5hbWUgPSBzdHlsaXplKG5hbWUsICduYW1lJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpXG4gICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8oXlwifFwiJCkvZywgXCInXCIpO1xuICAgICAgICAgICAgbmFtZSA9IHN0eWxpemUobmFtZSwgJ3N0cmluZycpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuYW1lICsgJzogJyArIHN0cjtcbiAgICAgIH0pO1xuXG4gICAgICBzZWVuLnBvcCgpO1xuXG4gICAgICB2YXIgbnVtTGluZXNFc3QgPSAwO1xuICAgICAgdmFyIGxlbmd0aCA9IHJlZHVjZShvdXRwdXQsIGZ1bmN0aW9uIChwcmV2LCBjdXIpIHtcbiAgICAgICAgbnVtTGluZXNFc3QrKztcbiAgICAgICAgaWYgKGluZGV4T2YoY3VyLCAnXFxuJykgPj0gMCkgbnVtTGluZXNFc3QrKztcbiAgICAgICAgcmV0dXJuIHByZXYgKyBjdXIubGVuZ3RoICsgMTtcbiAgICAgIH0sIDApO1xuXG4gICAgICBpZiAobGVuZ3RoID4gNTApIHtcbiAgICAgICAgb3V0cHV0ID0gYnJhY2VzWzBdICtcbiAgICAgICAgICAgICAgICAgKGJhc2UgPT09ICcnID8gJycgOiBiYXNlICsgJ1xcbiAnKSArXG4gICAgICAgICAgICAgICAgICcgJyArXG4gICAgICAgICAgICAgICAgIG91dHB1dC5qb2luKCcsXFxuICAnKSArXG4gICAgICAgICAgICAgICAgICcgJyArXG4gICAgICAgICAgICAgICAgIGJyYWNlc1sxXTtcblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0cHV0ID0gYnJhY2VzWzBdICsgYmFzZSArICcgJyArIG91dHB1dC5qb2luKCcsICcpICsgJyAnICsgYnJhY2VzWzFdO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH1cbiAgICByZXR1cm4gZm9ybWF0KG9iaiwgKHR5cGVvZiBkZXB0aCA9PT0gJ3VuZGVmaW5lZCcgPyAyIDogZGVwdGgpKTtcbiAgfTtcblxuICBmdW5jdGlvbiBpc0FycmF5IChhcikge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXIpID09ICdbb2JqZWN0IEFycmF5XSc7XG4gIH07XG5cbiAgZnVuY3Rpb24gaXNSZWdFeHAocmUpIHtcbiAgICB2YXIgcztcbiAgICB0cnkge1xuICAgICAgcyA9ICcnICsgcmU7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiByZSBpbnN0YW5jZW9mIFJlZ0V4cCB8fCAvLyBlYXN5IGNhc2VcbiAgICAgICAgICAgLy8gZHVjay10eXBlIGZvciBjb250ZXh0LXN3aXRjaGluZyBldmFsY3ggY2FzZVxuICAgICAgICAgICB0eXBlb2YocmUpID09PSAnZnVuY3Rpb24nICYmXG4gICAgICAgICAgIHJlLmNvbnN0cnVjdG9yLm5hbWUgPT09ICdSZWdFeHAnICYmXG4gICAgICAgICAgIHJlLmNvbXBpbGUgJiZcbiAgICAgICAgICAgcmUudGVzdCAmJlxuICAgICAgICAgICByZS5leGVjICYmXG4gICAgICAgICAgIHMubWF0Y2goL15cXC8uKlxcL1tnaW1dezAsM30kLyk7XG4gIH07XG5cbiAgZnVuY3Rpb24gaXNEYXRlKGQpIHtcbiAgICBpZiAoZCBpbnN0YW5jZW9mIERhdGUpIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBmdW5jdGlvbiBrZXlzIChvYmopIHtcbiAgICBpZiAoT2JqZWN0LmtleXMpIHtcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyhvYmopO1xuICAgIH1cblxuICAgIHZhciBrZXlzID0gW107XG5cbiAgICBmb3IgKHZhciBpIGluIG9iaikge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGkpKSB7XG4gICAgICAgIGtleXMucHVzaChpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ga2V5cztcbiAgfVxuXG4gIGZ1bmN0aW9uIG1hcCAoYXJyLCBtYXBwZXIsIHRoYXQpIHtcbiAgICBpZiAoQXJyYXkucHJvdG90eXBlLm1hcCkge1xuICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5tYXAuY2FsbChhcnIsIG1hcHBlciwgdGhhdCk7XG4gICAgfVxuXG4gICAgdmFyIG90aGVyPSBuZXcgQXJyYXkoYXJyLmxlbmd0aCk7XG5cbiAgICBmb3IgKHZhciBpPSAwLCBuID0gYXJyLmxlbmd0aDsgaTxuOyBpKyspXG4gICAgICBpZiAoaSBpbiBhcnIpXG4gICAgICAgIG90aGVyW2ldID0gbWFwcGVyLmNhbGwodGhhdCwgYXJyW2ldLCBpLCBhcnIpO1xuXG4gICAgcmV0dXJuIG90aGVyO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHJlZHVjZSAoYXJyLCBmdW4pIHtcbiAgICBpZiAoQXJyYXkucHJvdG90eXBlLnJlZHVjZSkge1xuICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5yZWR1Y2UuYXBwbHkoXG4gICAgICAgICAgYXJyXG4gICAgICAgICwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICB2YXIgbGVuID0gK3RoaXMubGVuZ3RoO1xuXG4gICAgaWYgKHR5cGVvZiBmdW4gIT09IFwiZnVuY3Rpb25cIilcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcblxuICAgIC8vIG5vIHZhbHVlIHRvIHJldHVybiBpZiBubyBpbml0aWFsIHZhbHVlIGFuZCBhbiBlbXB0eSBhcnJheVxuICAgIGlmIChsZW4gPT09IDAgJiYgYXJndW1lbnRzLmxlbmd0aCA9PT0gMSlcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcblxuICAgIHZhciBpID0gMDtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSAyKSB7XG4gICAgICB2YXIgcnYgPSBhcmd1bWVudHNbMV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvIHtcbiAgICAgICAgaWYgKGkgaW4gdGhpcykge1xuICAgICAgICAgIHJ2ID0gdGhpc1tpKytdO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgYXJyYXkgY29udGFpbnMgbm8gdmFsdWVzLCBubyBpbml0aWFsIHZhbHVlIHRvIHJldHVyblxuICAgICAgICBpZiAoKytpID49IGxlbilcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG4gICAgICB9IHdoaWxlICh0cnVlKTtcbiAgICB9XG5cbiAgICBmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBpZiAoaSBpbiB0aGlzKVxuICAgICAgICBydiA9IGZ1bi5jYWxsKG51bGwsIHJ2LCB0aGlzW2ldLCBpLCB0aGlzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcnY7XG4gIH07XG5cbiAgLyoqXG4gICAqIEFzc2VydHMgZGVlcCBlcXVhbGl0eVxuICAgKlxuICAgKiBAc2VlIHRha2VuIGZyb20gbm9kZS5qcyBgYXNzZXJ0YCBtb2R1bGUgKGNvcHlyaWdodCBKb3llbnQsIE1JVCBsaWNlbnNlKVxuICAgKiBAYXBpIHByaXZhdGVcbiAgICovXG5cbiAgZXhwZWN0LmVxbCA9IGZ1bmN0aW9uIGVxbCAoYWN0dWFsLCBleHBlY3RlZCkge1xuICAgIC8vIDcuMS4gQWxsIGlkZW50aWNhbCB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGFzIGRldGVybWluZWQgYnkgPT09LlxuICAgIGlmIChhY3R1YWwgPT09IGV4cGVjdGVkKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKCd1bmRlZmluZWQnICE9IHR5cGVvZiBCdWZmZXJcbiAgICAgICAgJiYgQnVmZmVyLmlzQnVmZmVyKGFjdHVhbCkgJiYgQnVmZmVyLmlzQnVmZmVyKGV4cGVjdGVkKSkge1xuICAgICAgaWYgKGFjdHVhbC5sZW5ndGggIT0gZXhwZWN0ZWQubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWN0dWFsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChhY3R1YWxbaV0gIT09IGV4cGVjdGVkW2ldKSByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgLy8gNy4yLiBJZiB0aGUgZXhwZWN0ZWQgdmFsdWUgaXMgYSBEYXRlIG9iamVjdCwgdGhlIGFjdHVhbCB2YWx1ZSBpc1xuICAgIC8vIGVxdWl2YWxlbnQgaWYgaXQgaXMgYWxzbyBhIERhdGUgb2JqZWN0IHRoYXQgcmVmZXJzIHRvIHRoZSBzYW1lIHRpbWUuXG4gICAgfSBlbHNlIGlmIChhY3R1YWwgaW5zdGFuY2VvZiBEYXRlICYmIGV4cGVjdGVkIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgcmV0dXJuIGFjdHVhbC5nZXRUaW1lKCkgPT09IGV4cGVjdGVkLmdldFRpbWUoKTtcblxuICAgIC8vIDcuMy4gT3RoZXIgcGFpcnMgdGhhdCBkbyBub3QgYm90aCBwYXNzIHR5cGVvZiB2YWx1ZSA9PSBcIm9iamVjdFwiLFxuICAgIC8vIGVxdWl2YWxlbmNlIGlzIGRldGVybWluZWQgYnkgPT0uXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgYWN0dWFsICE9ICdvYmplY3QnICYmIHR5cGVvZiBleHBlY3RlZCAhPSAnb2JqZWN0Jykge1xuICAgICAgcmV0dXJuIGFjdHVhbCA9PSBleHBlY3RlZDtcblxuICAgIC8vIDcuNC4gRm9yIGFsbCBvdGhlciBPYmplY3QgcGFpcnMsIGluY2x1ZGluZyBBcnJheSBvYmplY3RzLCBlcXVpdmFsZW5jZSBpc1xuICAgIC8vIGRldGVybWluZWQgYnkgaGF2aW5nIHRoZSBzYW1lIG51bWJlciBvZiBvd25lZCBwcm9wZXJ0aWVzIChhcyB2ZXJpZmllZFxuICAgIC8vIHdpdGggT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKSwgdGhlIHNhbWUgc2V0IG9mIGtleXNcbiAgICAvLyAoYWx0aG91Z2ggbm90IG5lY2Vzc2FyaWx5IHRoZSBzYW1lIG9yZGVyKSwgZXF1aXZhbGVudCB2YWx1ZXMgZm9yIGV2ZXJ5XG4gICAgLy8gY29ycmVzcG9uZGluZyBrZXksIGFuZCBhbiBpZGVudGljYWwgXCJwcm90b3R5cGVcIiBwcm9wZXJ0eS4gTm90ZTogdGhpc1xuICAgIC8vIGFjY291bnRzIGZvciBib3RoIG5hbWVkIGFuZCBpbmRleGVkIHByb3BlcnRpZXMgb24gQXJyYXlzLlxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb2JqRXF1aXYoYWN0dWFsLCBleHBlY3RlZCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaXNVbmRlZmluZWRPck51bGwgKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQ7XG4gIH1cblxuICBmdW5jdGlvbiBpc0FyZ3VtZW50cyAob2JqZWN0KSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmplY3QpID09ICdbb2JqZWN0IEFyZ3VtZW50c10nO1xuICB9XG5cbiAgZnVuY3Rpb24gb2JqRXF1aXYgKGEsIGIpIHtcbiAgICBpZiAoaXNVbmRlZmluZWRPck51bGwoYSkgfHwgaXNVbmRlZmluZWRPck51bGwoYikpXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgLy8gYW4gaWRlbnRpY2FsIFwicHJvdG90eXBlXCIgcHJvcGVydHkuXG4gICAgaWYgKGEucHJvdG90eXBlICE9PSBiLnByb3RvdHlwZSkgcmV0dXJuIGZhbHNlO1xuICAgIC8vfn5+SSd2ZSBtYW5hZ2VkIHRvIGJyZWFrIE9iamVjdC5rZXlzIHRocm91Z2ggc2NyZXd5IGFyZ3VtZW50cyBwYXNzaW5nLlxuICAgIC8vICAgQ29udmVydGluZyB0byBhcnJheSBzb2x2ZXMgdGhlIHByb2JsZW0uXG4gICAgaWYgKGlzQXJndW1lbnRzKGEpKSB7XG4gICAgICBpZiAoIWlzQXJndW1lbnRzKGIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGEgPSBwU2xpY2UuY2FsbChhKTtcbiAgICAgIGIgPSBwU2xpY2UuY2FsbChiKTtcbiAgICAgIHJldHVybiBleHBlY3QuZXFsKGEsIGIpO1xuICAgIH1cbiAgICB0cnl7XG4gICAgICB2YXIga2EgPSBrZXlzKGEpLFxuICAgICAgICBrYiA9IGtleXMoYiksXG4gICAgICAgIGtleSwgaTtcbiAgICB9IGNhdGNoIChlKSB7Ly9oYXBwZW5zIHdoZW4gb25lIGlzIGEgc3RyaW5nIGxpdGVyYWwgYW5kIHRoZSBvdGhlciBpc24ndFxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBoYXZpbmcgdGhlIHNhbWUgbnVtYmVyIG9mIG93bmVkIHByb3BlcnRpZXMgKGtleXMgaW5jb3Jwb3JhdGVzIGhhc093blByb3BlcnR5KVxuICAgIGlmIChrYS5sZW5ndGggIT0ga2IubGVuZ3RoKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIC8vdGhlIHNhbWUgc2V0IG9mIGtleXMgKGFsdGhvdWdoIG5vdCBuZWNlc3NhcmlseSB0aGUgc2FtZSBvcmRlciksXG4gICAga2Euc29ydCgpO1xuICAgIGtiLnNvcnQoKTtcbiAgICAvL35+fmNoZWFwIGtleSB0ZXN0XG4gICAgZm9yIChpID0ga2EubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGlmIChrYVtpXSAhPSBrYltpXSlcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvL2VxdWl2YWxlbnQgdmFsdWVzIGZvciBldmVyeSBjb3JyZXNwb25kaW5nIGtleSwgYW5kXG4gICAgLy9+fn5wb3NzaWJseSBleHBlbnNpdmUgZGVlcCB0ZXN0XG4gICAgZm9yIChpID0ga2EubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGtleSA9IGthW2ldO1xuICAgICAgaWYgKCFleHBlY3QuZXFsKGFba2V5XSwgYltrZXldKSlcbiAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICB2YXIganNvbiA9IChmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBpZiAoJ29iamVjdCcgPT0gdHlwZW9mIEpTT04gJiYgSlNPTi5wYXJzZSAmJiBKU09OLnN0cmluZ2lmeSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBwYXJzZTogbmF0aXZlSlNPTi5wYXJzZVxuICAgICAgICAsIHN0cmluZ2lmeTogbmF0aXZlSlNPTi5zdHJpbmdpZnlcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgSlNPTiA9IHt9O1xuXG4gICAgZnVuY3Rpb24gZihuKSB7XG4gICAgICAgIC8vIEZvcm1hdCBpbnRlZ2VycyB0byBoYXZlIGF0IGxlYXN0IHR3byBkaWdpdHMuXG4gICAgICAgIHJldHVybiBuIDwgMTAgPyAnMCcgKyBuIDogbjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkYXRlKGQsIGtleSkge1xuICAgICAgcmV0dXJuIGlzRmluaXRlKGQudmFsdWVPZigpKSA/XG4gICAgICAgICAgZC5nZXRVVENGdWxsWWVhcigpICAgICArICctJyArXG4gICAgICAgICAgZihkLmdldFVUQ01vbnRoKCkgKyAxKSArICctJyArXG4gICAgICAgICAgZihkLmdldFVUQ0RhdGUoKSkgICAgICArICdUJyArXG4gICAgICAgICAgZihkLmdldFVUQ0hvdXJzKCkpICAgICArICc6JyArXG4gICAgICAgICAgZihkLmdldFVUQ01pbnV0ZXMoKSkgICArICc6JyArXG4gICAgICAgICAgZihkLmdldFVUQ1NlY29uZHMoKSkgICArICdaJyA6IG51bGw7XG4gICAgfTtcblxuICAgIHZhciBjeCA9IC9bXFx1MDAwMFxcdTAwYWRcXHUwNjAwLVxcdTA2MDRcXHUwNzBmXFx1MTdiNFxcdTE3YjVcXHUyMDBjLVxcdTIwMGZcXHUyMDI4LVxcdTIwMmZcXHUyMDYwLVxcdTIwNmZcXHVmZWZmXFx1ZmZmMC1cXHVmZmZmXS9nLFxuICAgICAgICBlc2NhcGFibGUgPSAvW1xcXFxcXFwiXFx4MDAtXFx4MWZcXHg3Zi1cXHg5ZlxcdTAwYWRcXHUwNjAwLVxcdTA2MDRcXHUwNzBmXFx1MTdiNFxcdTE3YjVcXHUyMDBjLVxcdTIwMGZcXHUyMDI4LVxcdTIwMmZcXHUyMDYwLVxcdTIwNmZcXHVmZWZmXFx1ZmZmMC1cXHVmZmZmXS9nLFxuICAgICAgICBnYXAsXG4gICAgICAgIGluZGVudCxcbiAgICAgICAgbWV0YSA9IHsgICAgLy8gdGFibGUgb2YgY2hhcmFjdGVyIHN1YnN0aXR1dGlvbnNcbiAgICAgICAgICAgICdcXGInOiAnXFxcXGInLFxuICAgICAgICAgICAgJ1xcdCc6ICdcXFxcdCcsXG4gICAgICAgICAgICAnXFxuJzogJ1xcXFxuJyxcbiAgICAgICAgICAgICdcXGYnOiAnXFxcXGYnLFxuICAgICAgICAgICAgJ1xccic6ICdcXFxccicsXG4gICAgICAgICAgICAnXCInIDogJ1xcXFxcIicsXG4gICAgICAgICAgICAnXFxcXCc6ICdcXFxcXFxcXCdcbiAgICAgICAgfSxcbiAgICAgICAgcmVwO1xuXG5cbiAgICBmdW5jdGlvbiBxdW90ZShzdHJpbmcpIHtcblxuICAvLyBJZiB0aGUgc3RyaW5nIGNvbnRhaW5zIG5vIGNvbnRyb2wgY2hhcmFjdGVycywgbm8gcXVvdGUgY2hhcmFjdGVycywgYW5kIG5vXG4gIC8vIGJhY2tzbGFzaCBjaGFyYWN0ZXJzLCB0aGVuIHdlIGNhbiBzYWZlbHkgc2xhcCBzb21lIHF1b3RlcyBhcm91bmQgaXQuXG4gIC8vIE90aGVyd2lzZSB3ZSBtdXN0IGFsc28gcmVwbGFjZSB0aGUgb2ZmZW5kaW5nIGNoYXJhY3RlcnMgd2l0aCBzYWZlIGVzY2FwZVxuICAvLyBzZXF1ZW5jZXMuXG5cbiAgICAgICAgZXNjYXBhYmxlLmxhc3RJbmRleCA9IDA7XG4gICAgICAgIHJldHVybiBlc2NhcGFibGUudGVzdChzdHJpbmcpID8gJ1wiJyArIHN0cmluZy5yZXBsYWNlKGVzY2FwYWJsZSwgZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIHZhciBjID0gbWV0YVthXTtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgYyA9PT0gJ3N0cmluZycgPyBjIDpcbiAgICAgICAgICAgICAgICAnXFxcXHUnICsgKCcwMDAwJyArIGEuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikpLnNsaWNlKC00KTtcbiAgICAgICAgfSkgKyAnXCInIDogJ1wiJyArIHN0cmluZyArICdcIic7XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBzdHIoa2V5LCBob2xkZXIpIHtcblxuICAvLyBQcm9kdWNlIGEgc3RyaW5nIGZyb20gaG9sZGVyW2tleV0uXG5cbiAgICAgICAgdmFyIGksICAgICAgICAgIC8vIFRoZSBsb29wIGNvdW50ZXIuXG4gICAgICAgICAgICBrLCAgICAgICAgICAvLyBUaGUgbWVtYmVyIGtleS5cbiAgICAgICAgICAgIHYsICAgICAgICAgIC8vIFRoZSBtZW1iZXIgdmFsdWUuXG4gICAgICAgICAgICBsZW5ndGgsXG4gICAgICAgICAgICBtaW5kID0gZ2FwLFxuICAgICAgICAgICAgcGFydGlhbCxcbiAgICAgICAgICAgIHZhbHVlID0gaG9sZGVyW2tleV07XG5cbiAgLy8gSWYgdGhlIHZhbHVlIGhhcyBhIHRvSlNPTiBtZXRob2QsIGNhbGwgaXQgdG8gb2J0YWluIGEgcmVwbGFjZW1lbnQgdmFsdWUuXG5cbiAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICAgICAgdmFsdWUgPSBkYXRlKGtleSk7XG4gICAgICAgIH1cblxuICAvLyBJZiB3ZSB3ZXJlIGNhbGxlZCB3aXRoIGEgcmVwbGFjZXIgZnVuY3Rpb24sIHRoZW4gY2FsbCB0aGUgcmVwbGFjZXIgdG9cbiAgLy8gb2J0YWluIGEgcmVwbGFjZW1lbnQgdmFsdWUuXG5cbiAgICAgICAgaWYgKHR5cGVvZiByZXAgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHZhbHVlID0gcmVwLmNhbGwoaG9sZGVyLCBrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuXG4gIC8vIFdoYXQgaGFwcGVucyBuZXh0IGRlcGVuZHMgb24gdGhlIHZhbHVlJ3MgdHlwZS5cblxuICAgICAgICBzd2l0Y2ggKHR5cGVvZiB2YWx1ZSkge1xuICAgICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICAgICAgcmV0dXJuIHF1b3RlKHZhbHVlKTtcblxuICAgICAgICBjYXNlICdudW1iZXInOlxuXG4gIC8vIEpTT04gbnVtYmVycyBtdXN0IGJlIGZpbml0ZS4gRW5jb2RlIG5vbi1maW5pdGUgbnVtYmVycyBhcyBudWxsLlxuXG4gICAgICAgICAgICByZXR1cm4gaXNGaW5pdGUodmFsdWUpID8gU3RyaW5nKHZhbHVlKSA6ICdudWxsJztcblxuICAgICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgY2FzZSAnbnVsbCc6XG5cbiAgLy8gSWYgdGhlIHZhbHVlIGlzIGEgYm9vbGVhbiBvciBudWxsLCBjb252ZXJ0IGl0IHRvIGEgc3RyaW5nLiBOb3RlOlxuICAvLyB0eXBlb2YgbnVsbCBkb2VzIG5vdCBwcm9kdWNlICdudWxsJy4gVGhlIGNhc2UgaXMgaW5jbHVkZWQgaGVyZSBpblxuICAvLyB0aGUgcmVtb3RlIGNoYW5jZSB0aGF0IHRoaXMgZ2V0cyBmaXhlZCBzb21lZGF5LlxuXG4gICAgICAgICAgICByZXR1cm4gU3RyaW5nKHZhbHVlKTtcblxuICAvLyBJZiB0aGUgdHlwZSBpcyAnb2JqZWN0Jywgd2UgbWlnaHQgYmUgZGVhbGluZyB3aXRoIGFuIG9iamVjdCBvciBhbiBhcnJheSBvclxuICAvLyBudWxsLlxuXG4gICAgICAgIGNhc2UgJ29iamVjdCc6XG5cbiAgLy8gRHVlIHRvIGEgc3BlY2lmaWNhdGlvbiBibHVuZGVyIGluIEVDTUFTY3JpcHQsIHR5cGVvZiBudWxsIGlzICdvYmplY3QnLFxuICAvLyBzbyB3YXRjaCBvdXQgZm9yIHRoYXQgY2FzZS5cblxuICAgICAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnbnVsbCc7XG4gICAgICAgICAgICB9XG5cbiAgLy8gTWFrZSBhbiBhcnJheSB0byBob2xkIHRoZSBwYXJ0aWFsIHJlc3VsdHMgb2Ygc3RyaW5naWZ5aW5nIHRoaXMgb2JqZWN0IHZhbHVlLlxuXG4gICAgICAgICAgICBnYXAgKz0gaW5kZW50O1xuICAgICAgICAgICAgcGFydGlhbCA9IFtdO1xuXG4gIC8vIElzIHRoZSB2YWx1ZSBhbiBhcnJheT9cblxuICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuYXBwbHkodmFsdWUpID09PSAnW29iamVjdCBBcnJheV0nKSB7XG5cbiAgLy8gVGhlIHZhbHVlIGlzIGFuIGFycmF5LiBTdHJpbmdpZnkgZXZlcnkgZWxlbWVudC4gVXNlIG51bGwgYXMgYSBwbGFjZWhvbGRlclxuICAvLyBmb3Igbm9uLUpTT04gdmFsdWVzLlxuXG4gICAgICAgICAgICAgICAgbGVuZ3RoID0gdmFsdWUubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICBwYXJ0aWFsW2ldID0gc3RyKGksIHZhbHVlKSB8fCAnbnVsbCc7XG4gICAgICAgICAgICAgICAgfVxuXG4gIC8vIEpvaW4gYWxsIG9mIHRoZSBlbGVtZW50cyB0b2dldGhlciwgc2VwYXJhdGVkIHdpdGggY29tbWFzLCBhbmQgd3JhcCB0aGVtIGluXG4gIC8vIGJyYWNrZXRzLlxuXG4gICAgICAgICAgICAgICAgdiA9IHBhcnRpYWwubGVuZ3RoID09PSAwID8gJ1tdJyA6IGdhcCA/XG4gICAgICAgICAgICAgICAgICAgICdbXFxuJyArIGdhcCArIHBhcnRpYWwuam9pbignLFxcbicgKyBnYXApICsgJ1xcbicgKyBtaW5kICsgJ10nIDpcbiAgICAgICAgICAgICAgICAgICAgJ1snICsgcGFydGlhbC5qb2luKCcsJykgKyAnXSc7XG4gICAgICAgICAgICAgICAgZ2FwID0gbWluZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gdjtcbiAgICAgICAgICAgIH1cblxuICAvLyBJZiB0aGUgcmVwbGFjZXIgaXMgYW4gYXJyYXksIHVzZSBpdCB0byBzZWxlY3QgdGhlIG1lbWJlcnMgdG8gYmUgc3RyaW5naWZpZWQuXG5cbiAgICAgICAgICAgIGlmIChyZXAgJiYgdHlwZW9mIHJlcCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICBsZW5ndGggPSByZXAubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJlcFtpXSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGsgPSByZXBbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICB2ID0gc3RyKGssIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFydGlhbC5wdXNoKHF1b3RlKGspICsgKGdhcCA/ICc6ICcgOiAnOicpICsgdik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gIC8vIE90aGVyd2lzZSwgaXRlcmF0ZSB0aHJvdWdoIGFsbCBvZiB0aGUga2V5cyBpbiB0aGUgb2JqZWN0LlxuXG4gICAgICAgICAgICAgICAgZm9yIChrIGluIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGspKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2ID0gc3RyKGssIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFydGlhbC5wdXNoKHF1b3RlKGspICsgKGdhcCA/ICc6ICcgOiAnOicpICsgdik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgLy8gSm9pbiBhbGwgb2YgdGhlIG1lbWJlciB0ZXh0cyB0b2dldGhlciwgc2VwYXJhdGVkIHdpdGggY29tbWFzLFxuICAvLyBhbmQgd3JhcCB0aGVtIGluIGJyYWNlcy5cblxuICAgICAgICAgICAgdiA9IHBhcnRpYWwubGVuZ3RoID09PSAwID8gJ3t9JyA6IGdhcCA/XG4gICAgICAgICAgICAgICAgJ3tcXG4nICsgZ2FwICsgcGFydGlhbC5qb2luKCcsXFxuJyArIGdhcCkgKyAnXFxuJyArIG1pbmQgKyAnfScgOlxuICAgICAgICAgICAgICAgICd7JyArIHBhcnRpYWwuam9pbignLCcpICsgJ30nO1xuICAgICAgICAgICAgZ2FwID0gbWluZDtcbiAgICAgICAgICAgIHJldHVybiB2O1xuICAgICAgICB9XG4gICAgfVxuXG4gIC8vIElmIHRoZSBKU09OIG9iamVjdCBkb2VzIG5vdCB5ZXQgaGF2ZSBhIHN0cmluZ2lmeSBtZXRob2QsIGdpdmUgaXQgb25lLlxuXG4gICAgSlNPTi5zdHJpbmdpZnkgPSBmdW5jdGlvbiAodmFsdWUsIHJlcGxhY2VyLCBzcGFjZSkge1xuXG4gIC8vIFRoZSBzdHJpbmdpZnkgbWV0aG9kIHRha2VzIGEgdmFsdWUgYW5kIGFuIG9wdGlvbmFsIHJlcGxhY2VyLCBhbmQgYW4gb3B0aW9uYWxcbiAgLy8gc3BhY2UgcGFyYW1ldGVyLCBhbmQgcmV0dXJucyBhIEpTT04gdGV4dC4gVGhlIHJlcGxhY2VyIGNhbiBiZSBhIGZ1bmN0aW9uXG4gIC8vIHRoYXQgY2FuIHJlcGxhY2UgdmFsdWVzLCBvciBhbiBhcnJheSBvZiBzdHJpbmdzIHRoYXQgd2lsbCBzZWxlY3QgdGhlIGtleXMuXG4gIC8vIEEgZGVmYXVsdCByZXBsYWNlciBtZXRob2QgY2FuIGJlIHByb3ZpZGVkLiBVc2Ugb2YgdGhlIHNwYWNlIHBhcmFtZXRlciBjYW5cbiAgLy8gcHJvZHVjZSB0ZXh0IHRoYXQgaXMgbW9yZSBlYXNpbHkgcmVhZGFibGUuXG5cbiAgICAgICAgdmFyIGk7XG4gICAgICAgIGdhcCA9ICcnO1xuICAgICAgICBpbmRlbnQgPSAnJztcblxuICAvLyBJZiB0aGUgc3BhY2UgcGFyYW1ldGVyIGlzIGEgbnVtYmVyLCBtYWtlIGFuIGluZGVudCBzdHJpbmcgY29udGFpbmluZyB0aGF0XG4gIC8vIG1hbnkgc3BhY2VzLlxuXG4gICAgICAgIGlmICh0eXBlb2Ygc3BhY2UgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgc3BhY2U7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgIGluZGVudCArPSAnICc7XG4gICAgICAgICAgICB9XG5cbiAgLy8gSWYgdGhlIHNwYWNlIHBhcmFtZXRlciBpcyBhIHN0cmluZywgaXQgd2lsbCBiZSB1c2VkIGFzIHRoZSBpbmRlbnQgc3RyaW5nLlxuXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHNwYWNlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgaW5kZW50ID0gc3BhY2U7XG4gICAgICAgIH1cblxuICAvLyBJZiB0aGVyZSBpcyBhIHJlcGxhY2VyLCBpdCBtdXN0IGJlIGEgZnVuY3Rpb24gb3IgYW4gYXJyYXkuXG4gIC8vIE90aGVyd2lzZSwgdGhyb3cgYW4gZXJyb3IuXG5cbiAgICAgICAgcmVwID0gcmVwbGFjZXI7XG4gICAgICAgIGlmIChyZXBsYWNlciAmJiB0eXBlb2YgcmVwbGFjZXIgIT09ICdmdW5jdGlvbicgJiZcbiAgICAgICAgICAgICAgICAodHlwZW9mIHJlcGxhY2VyICE9PSAnb2JqZWN0JyB8fFxuICAgICAgICAgICAgICAgIHR5cGVvZiByZXBsYWNlci5sZW5ndGggIT09ICdudW1iZXInKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdKU09OLnN0cmluZ2lmeScpO1xuICAgICAgICB9XG5cbiAgLy8gTWFrZSBhIGZha2Ugcm9vdCBvYmplY3QgY29udGFpbmluZyBvdXIgdmFsdWUgdW5kZXIgdGhlIGtleSBvZiAnJy5cbiAgLy8gUmV0dXJuIHRoZSByZXN1bHQgb2Ygc3RyaW5naWZ5aW5nIHRoZSB2YWx1ZS5cblxuICAgICAgICByZXR1cm4gc3RyKCcnLCB7Jyc6IHZhbHVlfSk7XG4gICAgfTtcblxuICAvLyBJZiB0aGUgSlNPTiBvYmplY3QgZG9lcyBub3QgeWV0IGhhdmUgYSBwYXJzZSBtZXRob2QsIGdpdmUgaXQgb25lLlxuXG4gICAgSlNPTi5wYXJzZSA9IGZ1bmN0aW9uICh0ZXh0LCByZXZpdmVyKSB7XG4gICAgLy8gVGhlIHBhcnNlIG1ldGhvZCB0YWtlcyBhIHRleHQgYW5kIGFuIG9wdGlvbmFsIHJldml2ZXIgZnVuY3Rpb24sIGFuZCByZXR1cm5zXG4gICAgLy8gYSBKYXZhU2NyaXB0IHZhbHVlIGlmIHRoZSB0ZXh0IGlzIGEgdmFsaWQgSlNPTiB0ZXh0LlxuXG4gICAgICAgIHZhciBqO1xuXG4gICAgICAgIGZ1bmN0aW9uIHdhbGsoaG9sZGVyLCBrZXkpIHtcblxuICAgIC8vIFRoZSB3YWxrIG1ldGhvZCBpcyB1c2VkIHRvIHJlY3Vyc2l2ZWx5IHdhbGsgdGhlIHJlc3VsdGluZyBzdHJ1Y3R1cmUgc29cbiAgICAvLyB0aGF0IG1vZGlmaWNhdGlvbnMgY2FuIGJlIG1hZGUuXG5cbiAgICAgICAgICAgIHZhciBrLCB2LCB2YWx1ZSA9IGhvbGRlcltrZXldO1xuICAgICAgICAgICAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGsgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgaykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHYgPSB3YWxrKHZhbHVlLCBrKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZVtrXSA9IHY7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB2YWx1ZVtrXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXZpdmVyLmNhbGwoaG9sZGVyLCBrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuXG5cbiAgICAvLyBQYXJzaW5nIGhhcHBlbnMgaW4gZm91ciBzdGFnZXMuIEluIHRoZSBmaXJzdCBzdGFnZSwgd2UgcmVwbGFjZSBjZXJ0YWluXG4gICAgLy8gVW5pY29kZSBjaGFyYWN0ZXJzIHdpdGggZXNjYXBlIHNlcXVlbmNlcy4gSmF2YVNjcmlwdCBoYW5kbGVzIG1hbnkgY2hhcmFjdGVyc1xuICAgIC8vIGluY29ycmVjdGx5LCBlaXRoZXIgc2lsZW50bHkgZGVsZXRpbmcgdGhlbSwgb3IgdHJlYXRpbmcgdGhlbSBhcyBsaW5lIGVuZGluZ3MuXG5cbiAgICAgICAgdGV4dCA9IFN0cmluZyh0ZXh0KTtcbiAgICAgICAgY3gubGFzdEluZGV4ID0gMDtcbiAgICAgICAgaWYgKGN4LnRlc3QodGV4dCkpIHtcbiAgICAgICAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoY3gsIGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICdcXFxcdScgK1xuICAgICAgICAgICAgICAgICAgICAoJzAwMDAnICsgYS5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgIC8vIEluIHRoZSBzZWNvbmQgc3RhZ2UsIHdlIHJ1biB0aGUgdGV4dCBhZ2FpbnN0IHJlZ3VsYXIgZXhwcmVzc2lvbnMgdGhhdCBsb29rXG4gICAgLy8gZm9yIG5vbi1KU09OIHBhdHRlcm5zLiBXZSBhcmUgZXNwZWNpYWxseSBjb25jZXJuZWQgd2l0aCAnKCknIGFuZCAnbmV3J1xuICAgIC8vIGJlY2F1c2UgdGhleSBjYW4gY2F1c2UgaW52b2NhdGlvbiwgYW5kICc9JyBiZWNhdXNlIGl0IGNhbiBjYXVzZSBtdXRhdGlvbi5cbiAgICAvLyBCdXQganVzdCB0byBiZSBzYWZlLCB3ZSB3YW50IHRvIHJlamVjdCBhbGwgdW5leHBlY3RlZCBmb3Jtcy5cblxuICAgIC8vIFdlIHNwbGl0IHRoZSBzZWNvbmQgc3RhZ2UgaW50byA0IHJlZ2V4cCBvcGVyYXRpb25zIGluIG9yZGVyIHRvIHdvcmsgYXJvdW5kXG4gICAgLy8gY3JpcHBsaW5nIGluZWZmaWNpZW5jaWVzIGluIElFJ3MgYW5kIFNhZmFyaSdzIHJlZ2V4cCBlbmdpbmVzLiBGaXJzdCB3ZVxuICAgIC8vIHJlcGxhY2UgdGhlIEpTT04gYmFja3NsYXNoIHBhaXJzIHdpdGggJ0AnIChhIG5vbi1KU09OIGNoYXJhY3RlcikuIFNlY29uZCwgd2VcbiAgICAvLyByZXBsYWNlIGFsbCBzaW1wbGUgdmFsdWUgdG9rZW5zIHdpdGggJ10nIGNoYXJhY3RlcnMuIFRoaXJkLCB3ZSBkZWxldGUgYWxsXG4gICAgLy8gb3BlbiBicmFja2V0cyB0aGF0IGZvbGxvdyBhIGNvbG9uIG9yIGNvbW1hIG9yIHRoYXQgYmVnaW4gdGhlIHRleHQuIEZpbmFsbHksXG4gICAgLy8gd2UgbG9vayB0byBzZWUgdGhhdCB0aGUgcmVtYWluaW5nIGNoYXJhY3RlcnMgYXJlIG9ubHkgd2hpdGVzcGFjZSBvciAnXScgb3JcbiAgICAvLyAnLCcgb3IgJzonIG9yICd7JyBvciAnfScuIElmIHRoYXQgaXMgc28sIHRoZW4gdGhlIHRleHQgaXMgc2FmZSBmb3IgZXZhbC5cblxuICAgICAgICBpZiAoL15bXFxdLDp7fVxcc10qJC9cbiAgICAgICAgICAgICAgICAudGVzdCh0ZXh0LnJlcGxhY2UoL1xcXFwoPzpbXCJcXFxcXFwvYmZucnRdfHVbMC05YS1mQS1GXXs0fSkvZywgJ0AnKVxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXCJbXlwiXFxcXFxcblxccl0qXCJ8dHJ1ZXxmYWxzZXxudWxsfC0/XFxkKyg/OlxcLlxcZCopPyg/OltlRV1bK1xcLV0/XFxkKyk/L2csICddJylcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyg/Ol58OnwsKSg/OlxccypcXFspKy9nLCAnJykpKSB7XG5cbiAgICAvLyBJbiB0aGUgdGhpcmQgc3RhZ2Ugd2UgdXNlIHRoZSBldmFsIGZ1bmN0aW9uIHRvIGNvbXBpbGUgdGhlIHRleHQgaW50byBhXG4gICAgLy8gSmF2YVNjcmlwdCBzdHJ1Y3R1cmUuIFRoZSAneycgb3BlcmF0b3IgaXMgc3ViamVjdCB0byBhIHN5bnRhY3RpYyBhbWJpZ3VpdHlcbiAgICAvLyBpbiBKYXZhU2NyaXB0OiBpdCBjYW4gYmVnaW4gYSBibG9jayBvciBhbiBvYmplY3QgbGl0ZXJhbC4gV2Ugd3JhcCB0aGUgdGV4dFxuICAgIC8vIGluIHBhcmVucyB0byBlbGltaW5hdGUgdGhlIGFtYmlndWl0eS5cblxuICAgICAgICAgICAgaiA9IGV2YWwoJygnICsgdGV4dCArICcpJyk7XG5cbiAgICAvLyBJbiB0aGUgb3B0aW9uYWwgZm91cnRoIHN0YWdlLCB3ZSByZWN1cnNpdmVseSB3YWxrIHRoZSBuZXcgc3RydWN0dXJlLCBwYXNzaW5nXG4gICAgLy8gZWFjaCBuYW1lL3ZhbHVlIHBhaXIgdG8gYSByZXZpdmVyIGZ1bmN0aW9uIGZvciBwb3NzaWJsZSB0cmFuc2Zvcm1hdGlvbi5cblxuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiByZXZpdmVyID09PSAnZnVuY3Rpb24nID9cbiAgICAgICAgICAgICAgICB3YWxrKHsnJzogan0sICcnKSA6IGo7XG4gICAgICAgIH1cblxuICAgIC8vIElmIHRoZSB0ZXh0IGlzIG5vdCBKU09OIHBhcnNlYWJsZSwgdGhlbiBhIFN5bnRheEVycm9yIGlzIHRocm93bi5cblxuICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoJ0pTT04ucGFyc2UnKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIEpTT047XG4gIH0pKCk7XG5cbiAgaWYgKCd1bmRlZmluZWQnICE9IHR5cGVvZiB3aW5kb3cpIHtcbiAgICB3aW5kb3cuZXhwZWN0ID0gbW9kdWxlLmV4cG9ydHM7XG4gIH1cblxufSkoXG4gICAgdGhpc1xuICAsICd1bmRlZmluZWQnICE9IHR5cGVvZiBtb2R1bGUgPyBtb2R1bGUgOiB7fVxuICAsICd1bmRlZmluZWQnICE9IHR5cGVvZiBleHBvcnRzID8gZXhwb3J0cyA6IHt9XG4pO1xuXG59KShyZXF1aXJlKFwiX19icm93c2VyaWZ5X0J1ZmZlclwiKS5CdWZmZXIpIiwiLyoqXG4gKiBAbGljZW5zZSBodHRwczovL3Jhdy5naXRodWIuY29tL2tyaXNrb3dhbC9lczUtc2hpbS9tYXN0ZXIvTElDRU5TRVxuICogZXM1LXNoaW0gbGljZW5zZVxuICovXG5cbmlmKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmVxdWlyZSgnZXM1LXNoaW0tc2hhbScpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbHVjJyk7IiwidmFyIEx1YyA9IHt9O1xuLyoqXG4gKiBAY2xhc3MgTHVjXG4gKiBBbGlhc2VzIGZvciBjb21tb24gTHVjIG1ldGhvZHMgYW5kIHBhY2thZ2VzLiAgQ2hlY2sgb3V0IEx1Yy5kZWZpbmVcbiAqIHRvIGxvb2sgYXQgdGhlIGNsYXNzIHN5c3RlbSBMdWMgcHJvdmlkZXMuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gTHVjO1xuXG52YXIgb2JqZWN0ID0gcmVxdWlyZSgnLi9vYmplY3QnKTtcbkx1Yy5PYmplY3QgPSBvYmplY3Q7XG4vKipcbiAqIEBtZW1iZXIgTHVjXG4gKiBAcHJvcGVydHkgTyBMdWMuT1xuICogQWxpYXMgZm9yIEx1Yy5PYmplY3RcbiAqL1xuTHVjLk8gPSBvYmplY3Q7XG5cblxuLyoqXG4gKiBAbWVtYmVyIEx1Y1xuICogQG1ldGhvZCBhcHBseVxuICogQGluaGVyaXRkb2MgTHVjLk9iamVjdCNhcHBseVxuICovXG5MdWMuYXBwbHkgPSBMdWMuT2JqZWN0LmFwcGx5O1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjXG4gKiBAbWV0aG9kIG1peFxuICogQGluaGVyaXRkb2MgTHVjLk9iamVjdCNtaXhcbiAqL1xuTHVjLm1peCA9IEx1Yy5PYmplY3QubWl4O1xuXG5cbnZhciBmdW4gPSByZXF1aXJlKCcuL2Z1bmN0aW9uJyk7XG5MdWMuRnVuY3Rpb24gPSBmdW47XG5cbi8qKlxuICogQG1lbWJlciBMdWNcbiAqIEBwcm9wZXJ0eSBGIEx1Yy5GXG4gKiBBbGlhcyBmb3IgTHVjLkZ1bmN0aW9uXG4gKi9cbkx1Yy5GID0gZnVuO1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjXG4gKiBAbWV0aG9kIGVtcHR5Rm5cbiAqIEBpbmhlcml0ZG9jIEx1Yy5GdW5jdGlvbiNlbXB0eUZuXG4gKi9cbkx1Yy5lbXB0eUZuID0gTHVjLkZ1bmN0aW9uLmVtcHR5Rm47XG5cbi8qKlxuICogQG1lbWJlciBMdWNcbiAqIEBtZXRob2QgYWJzdHJhY3RGblxuICogQGluaGVyaXRkb2MgTHVjLkZ1bmN0aW9uI2Fic3RyYWN0Rm5cbiAqL1xuTHVjLmFic3RyYWN0Rm4gPSBMdWMuRnVuY3Rpb24uYWJzdHJhY3RGbjtcblxudmFyIGFycmF5ID0gcmVxdWlyZSgnLi9hcnJheScpO1xuTHVjLkFycmF5ID0gYXJyYXk7XG5cbi8qKlxuICogQG1lbWJlciBMdWNcbiAqIEBwcm9wZXJ0eSBBIEx1Yy5BXG4gKiBBbGlhcyBmb3IgTHVjLkFycmF5XG4gKi9cbkx1Yy5BID0gYXJyYXk7XG5cbkx1Yy5BcnJheUZuR2VuZXJhdG9yID0gcmVxdWlyZSgnLi9hcnJheUZuR2VuZXJhdG9yJyk7XG5cbkx1Yy5hcHBseShMdWMsIHJlcXVpcmUoJy4vaXMnKSk7XG5cbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCcuL2V2ZW50cy9ldmVudEVtaXR0ZXInKTtcblxuTHVjLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxudmFyIEJhc2UgPSByZXF1aXJlKCcuL2NsYXNzL2Jhc2UnKTtcblxuTHVjLkJhc2UgPSBCYXNlO1xuXG52YXIgRGVmaW5lciA9IHJlcXVpcmUoJy4vY2xhc3MvZGVmaW5lcicpO1xuXG5MdWMuQ2xhc3NEZWZpbmVyID0gRGVmaW5lcjtcblxuLyoqXG4gKiBAbWVtYmVyIEx1Y1xuICogQG1ldGhvZCBkZWZpbmVcbiAqIEBpbmhlcml0ZG9jIEx1Yy5kZWZpbmUjZGVmaW5lXG4gKi9cbkx1Yy5kZWZpbmUgPSBEZWZpbmVyLmRlZmluZTtcblxuTHVjLlBsdWdpbiA9IHJlcXVpcmUoJy4vY2xhc3MvcGx1Z2luJyk7XG5cbkx1Yy5QbHVnaW5NYW5hZ2VyID0gcmVxdWlyZSgnLi9jbGFzcy9wbHVnaW5NYW5hZ2VyJyk7XG5cbkx1Yy5hcHBseShMdWMsIHtcbiAgICBjb21wb3NpdGlvbkVudW1zOiByZXF1aXJlKCcuL2NsYXNzL2NvbXBvc2l0aW9uRW51bXMnKVxufSk7XG5cbkx1Yy5jb21wYXJlID0gcmVxdWlyZSgnLi9jb21wYXJlJykuY29tcGFyZTtcblxuTHVjLmlkID0gcmVxdWlyZSgnLi9pZCcpO1xuXG5cbmlmKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgd2luZG93Lkx1YyA9IEx1Yztcbn0iLCIvKipcbiAqIEBjbGFzcyBMdWMuT2JqZWN0XG4gKiBQYWNrYWdlIGZvciBPYmplY3QgbWV0aG9kcy4gIEx1Yy5PYmplY3QuYXBwbHkgYW5kIEx1Yy5PYmplY3QuZWFjaFxuICogYXJlIHVzZWQgdmVyeSBvZnRlbi4gIG1peCBhbmQgYXBwbHkgYXJlIGFsaWFzZWQgdG8gTHVjLmFwcGx5IGFuZCBMdWMubWl4LlxuICovXG5cbi8qKlxuICogQXBwbHkgdGhlIHByb3BlcnRpZXMgZnJvbSBmcm9tT2JqZWN0IHRvIHRoZSB0b09iamVjdC4gIGZyb21PYmplY3Qgd2lsbFxuICogb3ZlcndyaXRlIGFueSBzaGFyZWQga2V5cy4gIEl0IGNhbiBhbHNvIGJlIHVzZWQgYXMgYSBzaW1wbGUgc2hhbGxvdyBjbG9uZS5cbiAqIFxuICAgIHZhciB0byA9IHthOjEsIGM6MX0sIGZyb20gPSB7YToyLCBiOjJ9XG4gICAgTHVjLk9iamVjdC5hcHBseSh0bywgZnJvbSlcbiAgICA+T2JqZWN0IHthOiAyLCBjOiAxLCBiOiAyfVxuICAgIHRvID09PSB0b1xuICAgID50cnVlXG4gICAgdmFyIGNsb25lID0gTHVjLk9iamVjdC5hcHBseSh7fSwgZnJvbSlcbiAgICA+dW5kZWZpbmVkXG4gICAgY2xvbmVcbiAgICA+T2JqZWN0IHthOiAyLCBiOiAyfVxuICAgIGNsb25lID09PSBmcm9tXG4gICAgPmZhbHNlXG4gKlxuICogTm8gbnVsbCBjaGVja3MgYXJlIG5lZWRlZC5cbiAgICBcbiAgICBMdWMuYXBwbHkodW5kZWZpbmVkLCB7YToxfSlcbiAgICA+e2E6MX1cbiAgICBMdWMuYXBwbHkoe2E6IDF9KVxuICAgID57YToxfVxuXG4gKlxuICogXG4gKiBAcGFyYW0gIHtPYmplY3R9IFt0b09iamVjdF0gT2JqZWN0IHRvIHB1dCB0aGUgcHJvcGVydGllcyBmcm9tT2JqZWN0IG9uLlxuICogQHBhcmFtICB7T2JqZWN0fSBbZnJvbU9iamVjdF0gT2JqZWN0IHRvIHB1dCB0aGUgcHJvcGVydGllcyBvbiB0aGUgdG9PYmplY3RcbiAqIEByZXR1cm4ge09iamVjdH0gdGhlIHRvT2JqZWN0XG4gKi9cbmV4cG9ydHMuYXBwbHkgPSBmdW5jdGlvbih0b09iamVjdCwgZnJvbU9iamVjdCkge1xuICAgIHZhciB0byA9IHRvT2JqZWN0IHx8IHt9LFxuICAgICAgICBmcm9tID0gZnJvbU9iamVjdCB8fCB7fSxcbiAgICAgICAgcHJvcDtcblxuICAgIGZvciAocHJvcCBpbiBmcm9tKSB7XG4gICAgICAgIGlmIChmcm9tLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgICAgICB0b1twcm9wXSA9IGZyb21bcHJvcF07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdG87XG59O1xuXG4vKipcbiAqIFNpbWlsYXIgdG8gTHVjLk9iamVjdC5hcHBseSBleGNlcHQgdGhhdCB0aGUgZnJvbU9iamVjdCB3aWxsIFxuICogTk9UIG92ZXJ3cml0ZSB0aGUga2V5cyBvZiB0aGUgdG9PYmplY3QgaWYgdGhleSBhcmUgZGVmaW5lZC5cbiAqXG4gICAgTHVjLm1peCh7YToxLGI6Mn0sIHthOjMsYjo0LGM6NX0pXG4gICAgPnthOiAxLCBiOiAyLCBjOiA1fVxuXG4gKiBObyBudWxsIGNoZWNrcyBhcmUgbmVlZGVkLlxuICAgIFxuICAgIEx1Yy5taXgodW5kZWZpbmVkLCB7YToxfSlcbiAgICA+e2E6MX1cbiAgICBMdWMubWl4KHthOiAxfSlcbiAgICA+e2E6MX1cbiAgICBcbiAqXG5cbiAqIEBwYXJhbSAge09iamVjdH0gW3RvT2JqZWN0XSBPYmplY3QgdG8gcHV0IHRoZSBwcm9wZXJ0aWVzIGZyb21PYmplY3Qgb24uXG4gKiBAcGFyYW0gIHtPYmplY3R9IFtmcm9tT2JqZWN0XSBmcm9tT2JqZWN0IE9iamVjdCB0byBwdXQgdGhlIHByb3BlcnRpZXMgb24gdGhlIHRvT2JqZWN0XG4gKiBAcmV0dXJuIHtPYmplY3R9IHRoZSB0b09iamVjdFxuICovXG5leHBvcnRzLm1peCA9IGZ1bmN0aW9uKHRvT2JqZWN0LCBmcm9tT2JqZWN0KSB7XG4gICAgdmFyIHRvID0gdG9PYmplY3QgfHwge30sXG4gICAgICAgIGZyb20gPSBmcm9tT2JqZWN0IHx8IHt9LFxuICAgICAgICBwcm9wO1xuXG4gICAgZm9yIChwcm9wIGluIGZyb20pIHtcbiAgICAgICAgaWYgKGZyb20uaGFzT3duUHJvcGVydHkocHJvcCkgJiYgdG9bcHJvcF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdG9bcHJvcF0gPSBmcm9tW3Byb3BdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRvO1xufTtcblxuLyoqXG4gKiBJdGVyYXRlIG92ZXIgYW4gb2JqZWN0cyBwcm9wZXJ0aWVzXG4gKiBhcyBrZXkgdmFsdWUgXCJwYWlyc1wiIHdpdGggdGhlIHBhc3NlZCBpbiBmdW5jdGlvbi5cbiAqIFxuICAgIHZhciB0aGlzQXJnID0ge3ZhbDonYyd9O1xuICAgIEx1Yy5PYmplY3QuZWFjaCh7XG4gICAgICAgIHU6ICdMJ1xuICAgIH0sIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgY29uc29sZS5sb2codmFsdWUgKyBrZXkgKyB0aGlzLnZhbClcbiAgICB9LCB0aGlzQXJnKVxuICAgIFxuICAgID5MdWMgXG4gXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgb2JqICB0aGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3ZlclxuICogQHBhcmFtICB7RnVuY3Rpb259IGZuICAgdGhlIGZ1bmN0aW9uIHRvIGNhbGxcbiAqIEBwYXJhbSAge1N0cmluZ30gZm4ua2V5ICAgdGhlIG9iamVjdCBrZXlcbiAqIEBwYXJhbSAge09iamVjdH0gZm4udmFsdWUgICB0aGUgb2JqZWN0IHZhbHVlXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgW3RoaXNBcmddIFxuICogQHBhcmFtIHtPYmplY3R9ICBbY29uZmlnXVxuICogQHBhcmFtIHtCb29sZWFufSAgY29uZmlnLm93blByb3BlcnRpZXMgc2V0IHRvIGZhbHNlXG4gKiB0byBpdGVyYXRlIG92ZXIgYWxsIG9mIHRoZSBvYmplY3RzIGVudW1lcmFibGUgcHJvcGVydGllcy5cbiAqL1xuZXhwb3J0cy5lYWNoID0gZnVuY3Rpb24ob2JqLCBmbiwgdGhpc0FyZywgY29uZmlnKSB7XG4gICAgdmFyIGtleSwgdmFsdWUsXG4gICAgICAgIGFsbFByb3BlcnRpZXMgPSBjb25maWcgJiYgY29uZmlnLm93blByb3BlcnRpZXMgPT09IGZhbHNlO1xuXG4gICAgaWYgKGFsbFByb3BlcnRpZXMpIHtcbiAgICAgICAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgICAgICAgICBmbi5jYWxsKHRoaXNBcmcsIGtleSwgb2JqW2tleV0pO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBmbi5jYWxsKHRoaXNBcmcsIGtleSwgb2JqW2tleV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcblxuLyoqXG4gKiBUYWtlIGFuIGFycmF5IG9mIHN0cmluZ3MgYW5kIGFuIGFycmF5L2FyZ3VtZW50cyBvZlxuICogdmFsdWVzIGFuZCByZXR1cm4gYW4gb2JqZWN0IG9mIGtleSB2YWx1ZSBwYWlyc1xuICogYmFzZWQgb2ZmIGVhY2ggYXJyYXlzIGluZGV4LiAgSXQgaXMgdXNlZnVsIGZvciB0YWtpbmdcbiAqIGEgbG9uZyBsaXN0IG9mIGFyZ3VtZW50cyBhbmQgY3JlYXRpbmcgYW4gb2JqZWN0IHRoYXQgY2FuXG4gKiBiZSBwYXNzZWQgdG8gb3RoZXIgbWV0aG9kcy5cbiAqIFxuICAgIGZ1bmN0aW9uIGxvbmdBcmdzKGEsYixjLGQsZSxmKSB7XG4gICAgICAgIHJldHVybiBMdWMuT2JqZWN0LnRvT2JqZWN0KFsnYScsJ2InLCAnYycsICdkJywgJ2UnLCAnZiddLCBhcmd1bWVudHMpXG4gICAgfVxuXG4gICAgbG9uZ0FyZ3MoMSwyLDMsNCw1LDYsNyw4LDkpXG5cbiAgICA+T2JqZWN0IHthOiAxLCBiOiAyLCBjOiAzLCBkOiA0LCBlOiA14oCmfVxuICAgIGE6IDFcbiAgICBiOiAyXG4gICAgYzogM1xuICAgIGQ6IDRcbiAgICBlOiA1XG4gICAgZjogNlxuXG4gICAgbG9uZ0FyZ3MoMSwyLDMpXG5cbiAgICA+T2JqZWN0IHthOiAxLCBiOiAyLCBjOiAzLCBkOiB1bmRlZmluZWQsIGU6IHVuZGVmaW5lZOKApn1cbiAgICBhOiAxXG4gICAgYjogMlxuICAgIGM6IDNcbiAgICBkOiB1bmRlZmluZWRcbiAgICBlOiB1bmRlZmluZWRcbiAgICBmOiB1bmRlZmluZWRcblxuICogQHBhcmFtICB7U3RyaW5nW119IHN0cmluZ3NcbiAqIEBwYXJhbSAge0FycmF5L2FyZ3VtZW50c30gdmFsdWVzXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbmV4cG9ydHMudG9PYmplY3QgPSBmdW5jdGlvbihzdHJpbmdzLCB2YWx1ZXMpIHtcbiAgICB2YXIgb2JqID0ge30sXG4gICAgICAgIGkgPSAwLFxuICAgICAgICBsZW4gPSBzdHJpbmdzLmxlbmd0aDtcbiAgICBmb3IgKDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgIG9ialtzdHJpbmdzW2ldXSA9IHZhbHVlc1tpXTtcbiAgICB9XG5cbiAgICByZXR1cm4gb2JqO1xufTtcblxuLyoqXG4gKiBSZXR1cm4ga2V5IHZhbHVlIHBhaXJzIGZyb20gdGhlIG9iamVjdCBpZiB0aGVcbiAqIGZpbHRlckZuIHJldHVybnMgYSB0cnV0aHkgdmFsdWUuXG4gKlxuICAgIEx1Yy5PYmplY3QuZmlsdGVyKHtcbiAgICAgICAgYTogZmFsc2UsXG4gICAgICAgIGI6IHRydWUsXG4gICAgICAgIGM6IGZhbHNlXG4gICAgfSwgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4ga2V5ID09PSAnYScgfHwgdmFsdWVcbiAgICB9KVxuICAgID5be2tleTogJ2EnLCB2YWx1ZTogZmFsc2V9LCB7a2V5OiAnYicsIHZhbHVlOiB0cnVlfV1cblxuICAgIEx1Yy5PYmplY3QuZmlsdGVyKHtcbiAgICAgICAgYTogZmFsc2UsXG4gICAgICAgIGI6IHRydWUsXG4gICAgICAgIGM6IGZhbHNlXG4gICAgfSwgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4ga2V5ID09PSAnYScgfHwgdmFsdWVcbiAgICB9LCB1bmRlZmluZWQsIHtcbiAgICAgICAga2V5czogdHJ1ZVxuICAgIH0pXG4gICAgPlsnYScsICdiJ11cbiAqIFxuICogQHBhcmFtICB7T2JqZWN0fSAgIG9iaiAgdGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXJcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmaWx0ZXJGbiAgIHRoZSBmdW5jdGlvbiB0byBjYWxsLCByZXR1cm4gYSB0cnV0aHkgdmFsdWVcbiAqIHRvIGFkZCB0aGUga2V5IHZhbHVlIHBhaXJcbiAqIEBwYXJhbSAge1N0cmluZ30gZmlsdGVyRm4ua2V5ICAgdGhlIG9iamVjdCBrZXlcbiAqIEBwYXJhbSAge09iamVjdH0gZmlsdGVyRm4udmFsdWUgICB0aGUgb2JqZWN0IHZhbHVlXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgW3RoaXNBcmddIFxuICogQHBhcmFtIHtPYmplY3R9ICBbY29uZmlnXVxuICogQHBhcmFtIHtCb29sZWFufSAgY29uZmlnLm93blByb3BlcnRpZXMgc2V0IHRvIGZhbHNlXG4gKiB0byBpdGVyYXRlIG92ZXIgYWxsIG9mIHRoZSBvYmplY3RzIGVudW1lcmFibGUgcHJvcGVydGllcy5cbiAqIFxuICogQHBhcmFtIHtCb29sZWFufSAgY29uZmlnLmtleXMgc2V0IHRvIHRydWUgdG8gcmV0dXJuXG4gKiBqdXN0IHRoZSBrZXlzLlxuICpcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gIGNvbmZpZy52YWx1ZXMgc2V0IHRvIHRydWUgdG8gcmV0dXJuXG4gKiBqdXN0IHRoZSB2YWx1ZXMuXG4gKiBcbiAqIEByZXR1cm4ge09iamVjdFtdL1N0cmluZ1tdfSBBcnJheSBvZiBrZXkgdmFsdWUgcGFpcnMgaW4gdGhlIGZvcm1cbiAqIG9mIHtrZXk6ICdrZXknLCB2YWx1ZTogdmFsdWV9LiAgSWYga2V5cyBvciB2YWx1ZXMgaXMgdHJ1ZSBvbiB0aGUgY29uZmlnXG4gKiBqdXN0IHRoZSBrZXlzIG9yIHZhbHVlcyBhcmUgcmV0dXJuZWQuXG4gKlxuICovXG5leHBvcnRzLmZpbHRlciA9IGZ1bmN0aW9uKG9iaiwgZmlsdGVyRm4sIHRoaXNBcmcsIGMpIHtcbiAgICB2YXIgdmFsdWVzID0gW10sXG4gICAgICAgIGNvbmZpZyA9IGMgfHwge307XG5cbiAgICBleHBvcnRzLmVhY2gob2JqLCBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgIGlmIChmaWx0ZXJGbi5jYWxsKHRoaXNBcmcsIGtleSwgdmFsdWUpKSB7XG4gICAgICAgICAgICBpZiAoY29uZmlnLmtleXMgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZXMucHVzaChrZXkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb25maWcudmFsdWVzID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgdmFsdWVzLnB1c2godmFsdWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YWx1ZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAga2V5OiBrZXlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sIHRoaXNBcmcsIGNvbmZpZyk7XG5cbiAgICByZXR1cm4gdmFsdWVzO1xufTsiLCJ2YXIgb1RvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcclxuXHJcblxyXG4vKipcclxuICogQG1lbWJlciBMdWNcclxuICogUmV0dXJuIHRydWUgaWYgdGhlIHBhc3NlZCBpbiBvYmplY3QgaXMgb2ZcclxuICogdGhlIHR5cGUge0BsaW5rIEFycmF5IEFycmF5fVxyXG4gKiBAcGFyYW0gIHtPYmplY3R9ICBvYmogXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAqL1xyXG5mdW5jdGlvbiBpc0FycmF5KG9iaikge1xyXG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkob2JqKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBtZW1iZXIgTHVjXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoZSBwYXNzZWQgaW4gb2JqZWN0IGlzIG9mXHJcbiAqIHRoZSB0eXBlIHtAbGluayBPYmplY3QgT2JqZWN0fVxyXG4gKiBAcGFyYW0gIHtPYmplY3R9ICBvYmogXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAqL1xyXG5mdW5jdGlvbiBpc09iamVjdChvYmopIHtcclxuICAgIHJldHVybiBvYmogJiYgb1RvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAbWVtYmVyIEx1Y1xyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgcGFzc2VkIGluIG9iamVjdCBpcyBvZlxyXG4gKiB0aGUgdHlwZSB7QGxpbmsgRnVuY3Rpb24gRnVuY3Rpb259XHJcbiAqIEBwYXJhbSAge09iamVjdH0gIG9iaiBcclxuICogQHJldHVybiB7Qm9vbGVhbn1cclxuICovXHJcbmZ1bmN0aW9uIGlzRnVuY3Rpb24ob2JqKSB7XHJcbiAgICByZXR1cm4gb1RvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcclxufVxyXG5cclxuLyoqXHJcbiAqIEBtZW1iZXIgTHVjXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoZSBwYXNzZWQgaW4gb2JqZWN0IGlzIG9mXHJcbiAqIHRoZSB0eXBlIHtAbGluayBEYXRlIERhdGV9XHJcbiAqIEBwYXJhbSAge09iamVjdH0gIG9iaiBcclxuICogQHJldHVybiB7Qm9vbGVhbn1cclxuICovXHJcbmZ1bmN0aW9uIGlzRGF0ZShvYmopIHtcclxuICAgIHJldHVybiBvVG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBEYXRlXSc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAbWVtYmVyIEx1Y1xyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgcGFzc2VkIGluIG9iamVjdCBpcyBvZlxyXG4gKiB0aGUgdHlwZSB7QGxpbmsgUmVnRXhwIFJlZ0V4cH1cclxuICogQHBhcmFtICB7T2JqZWN0fSAgb2JqIFxyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKi9cclxuZnVuY3Rpb24gaXNSZWdFeHAob2JqKSB7XHJcbiAgICByZXR1cm4gb1RvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgUmVnRXhwXSc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAbWVtYmVyIEx1Y1xyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgcGFzc2VkIGluIG9iamVjdCBpcyBvZlxyXG4gKiB0aGUgdHlwZSB7QGxpbmsgTnVtYmVyIE51bWJlcn1cclxuICogQHBhcmFtICB7T2JqZWN0fSAgb2JqIFxyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKi9cclxuZnVuY3Rpb24gaXNOdW1iZXIob2JqKSB7XHJcbiAgICByZXR1cm4gb1RvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgTnVtYmVyXSc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAbWVtYmVyIEx1Y1xyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgcGFzc2VkIGluIG9iamVjdCBpcyBvZlxyXG4gKiB0aGUgdHlwZSB7QGxpbmsgU3RyaW5nIFN0cmluZ31cclxuICogQHBhcmFtICB7T2JqZWN0fSAgb2JqIFxyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKi9cclxuZnVuY3Rpb24gaXNTdHJpbmcob2JqKSB7XHJcbiAgICByZXR1cm4gb1RvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgU3RyaW5nXSc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAbWVtYmVyIEx1Y1xyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgcGFzc2VkIGluIG9iamVjdCBpcyBvZlxyXG4gKiB0aGUgdHlwZSBhcmd1bWVudHMuXHJcbiAqIFxyXG4gKiBAcGFyYW0gIHtPYmplY3R9ICBvYmogXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAqL1xyXG5mdW5jdGlvbiBpc0FyZ3VtZW50cyhvYmopIHtcclxuICAgIHJldHVybiBvVG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBBcmd1bWVudHNdJyB8fCBvYmogJiYgISFvYmouY2FsbGVlO1xyXG59XHJcblxyXG4vKipcclxuICogQG1lbWJlciBMdWNcclxuICogUmV0dXJuIHRydWUgaWYgdGhlIG9iamVjdCBpcyBmYWxzeSBidXQgbm90IHplcm8uXHJcbiAgICBMdWMuaXNGYWxzeShmYWxzZSlcclxuICAgID50cnVlXHJcbiAgICBMdWMuaXNGYWxzeSgwKVxyXG4gICAgPmZhbHNlXHJcbiAqIEBwYXJhbSAge09iamVjdH0gIG9ialxyXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgICAgXHJcbiAqL1xyXG5mdW5jdGlvbiBpc0ZhbHN5KG9iaikge1xyXG4gICAgcmV0dXJuICghb2JqICYmIG9iaiAhPT0gMCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAbWVtYmVyIEx1Y1xyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgb2JqZWN0IGlzIGVtcHR5LlxyXG4gKiB7fSwgW10sICcnLGZhbHNlLCBudWxsLCB1bmRlZmluZWQsIE5hTiBcclxuICogYXJlIGFsbCB0cmVhdGVkIGFzIGVtcHR5LlxyXG4gKiBcclxuICAgIEx1Yy5pc0VtcHR5KHRydWUpXHJcbiAgICA+ZmFsc2VcclxuICAgIEx1Yy5pc0VtcHR5KFtdKVxyXG4gICAgPnRydWVcclxuICAgIFxyXG4gKiBAcGFyYW0gIHtPYmplY3R9ICBvYmpcclxuICogQHJldHVybiB7Qm9vbGVhbn1cclxuICovXHJcbmZ1bmN0aW9uIGlzRW1wdHkob2JqKSB7XHJcbiAgICB2YXIgZW1wdHkgPSBmYWxzZTtcclxuXHJcbiAgICBpZiAoaXNGYWxzeShvYmopKSB7XHJcbiAgICAgICAgZW1wdHkgPSB0cnVlO1xyXG4gICAgfSBlbHNlIGlmIChpc0FycmF5KG9iaikpIHtcclxuICAgICAgICBlbXB0eSA9IG9iai5sZW5ndGggPT09IDA7XHJcbiAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KG9iaikpIHtcclxuICAgICAgICBlbXB0eSA9IE9iamVjdC5rZXlzKG9iaikubGVuZ3RoID09PSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBlbXB0eTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBpc0FycmF5OiBpc0FycmF5LFxyXG4gICAgaXNPYmplY3Q6IGlzT2JqZWN0LFxyXG4gICAgaXNGdW5jdGlvbjogaXNGdW5jdGlvbixcclxuICAgIGlzRGF0ZTogaXNEYXRlLFxyXG4gICAgaXNTdHJpbmc6IGlzU3RyaW5nLFxyXG4gICAgaXNOdW1iZXI6IGlzTnVtYmVyLFxyXG4gICAgaXNSZWdFeHA6IGlzUmVnRXhwLFxyXG4gICAgaXNBcmd1bWVudHM6IGlzQXJndW1lbnRzLFxyXG4gICAgaXNGYWxzeTogaXNGYWxzeSxcclxuICAgIGlzRW1wdHk6IGlzRW1wdHlcclxufTsiLCJ2YXIgaWRzID0ge307XG4vKipcbiAqIEBtZW1iZXIgTHVjXG4gKiBAbWV0aG9kIGlkXG4gKiBcbiAqIFJldHVybiBhIHVuaXF1ZSBpZC5cbiAqIEBwYXJhbSB7U3RyaW5nfSBbcHJlZml4XSBPcHRpb25hbCBwcmVmaXggdG8gdXNlXG4gKlxuICpcbiAgICAgICAgTHVjLmlkKClcbiAgICAgICAgPlwibHVjLTBcIlxuICAgICAgICBMdWMuaWQoKVxuICAgICAgICA+XCJsdWMtMVwiXG4gICAgICAgIEx1Yy5pZCgnbXktcHJlZml4JylcbiAgICAgICAgPlwibXktcHJlZml4MFwiXG4gICAgICAgIEx1Yy5pZCgnJylcbiAgICAgICAgPlwiMFwiXG4gKlxuICogQHJldHVybiB7U3RyaW5nfVxuICpcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihwKSB7XG4gICAgdmFyIHByZWZpeCA9IHAgPT09IHVuZGVmaW5lZCA/ICdsdWMtJyA6IHA7XG5cbiAgICBpZihpZHNbcHJlZml4XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlkc1twcmVmaXhdID0gMDtcbiAgICB9XG5cbiAgICByZXR1cm4gcHJlZml4ICsgaWRzW3ByZWZpeF0rKztcbn07IiwidmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcbi8qKlxuICogQGxpY2Vuc2UgaHR0cHM6Ly9yYXcuZ2l0aHViLmNvbS9qb3llbnQvbm9kZS92MC4xMC4xMS9MSUNFTlNFXG4gKiBOb2RlIGpzIGxpY2Vuc2UuIEV2ZW50RW1pdHRlciB3aWxsIGJlIGluIHRoZSBjbGllbnRcbiAqIG9ubHkgY29kZS5cbiAqL1xuLyoqXG4gKiBAY2xhc3MgTHVjLkV2ZW50RW1pdHRlclxuICogVGhlIHdvbmRlcmZ1bCBldmVudCBlbW1pdGVyIHRoYXQgY29tZXMgd2l0aCBub2RlLFxuICogdGhhdCB3b3JrcyBpbiB0aGUgc3VwcG9ydGVkIGJyb3dzZXJzLlxuICogW2h0dHA6Ly9ub2RlanMub3JnL2FwaS9ldmVudHMuaHRtbF0oaHR0cDovL25vZGVqcy5vcmcvYXBpL2V2ZW50cy5odG1sKVxuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICAgIC8vcHV0IGluIGZpeCBmb3IgSUUgOSBhbmQgYmVsb3dcbiAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgIGcgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHNlbGYucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG4gICAgICAgICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuXG4gICAgc2VsZi5vbih0eXBlLCBnKTtcblxuICAgIHJldHVybiB0aGlzO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7IiwicmVxdWlyZSgnLi9ub2RlX21vZHVsZXMvZXM1LXNoaW0vZXM1LXNoaW0nKTtcbnJlcXVpcmUoJy4vbm9kZV9tb2R1bGVzL2VzNS1zaGltL2VzNS1zaGFtJyk7IiwidmFyIGlzID0gcmVxdWlyZSgnLi9pcycpLFxuICAgIGFJbnNlcnQgPSByZXF1aXJlKCcuL2FycmF5JykuaW5zZXJ0O1xuICAgIGFFYWNoID0gcmVxdWlyZSgnLi9hcnJheScpLmVhY2g7XG5cbi8qKlxuICogQGNsYXNzIEx1Yy5GdW5jdGlvblxuICogUGFja2FnZSBmb3IgZnVuY3Rpb24gbWV0aG9kcy4gIE1vc3Qgb2YgdGhlbSBmb2xsb3cgdGhlIHNhbWUgYXBpOlxuICogZnVuY3Rpb24gb3IgZnVuY3Rpb25bXSwgcmVsZXZhbnQgYXJncyAuLi4gd2l0aCBhbiBvcHRpb25hbCBjb25maWdcbiAqIHRvIEx1Yy5GdW5jdGlvbi5jcmVhdGVBdWdtZW50ZXIgYXMgdGhlIGxhc3QgYXJndW1lbnQuXG4gKi9cblxuZnVuY3Rpb24gX2F1Z21lbnRBcmdzKGNvbmZpZywgY2FsbEFyZ3MpIHtcbiAgICB2YXIgY29uZmlnQXJncyA9IGNvbmZpZy5hcmdzLFxuICAgICAgICBpbmRleCA9IGNvbmZpZy5pbmRleCxcbiAgICAgICAgYXJnc0FycmF5O1xuXG4gICAgaWYgKCFjb25maWdBcmdzKSB7XG4gICAgICAgIHJldHVybiBjYWxsQXJncztcbiAgICB9XG5cbiAgICBpZihpbmRleCA9PT0gdHJ1ZSB8fCBpcy5pc051bWJlcihpbmRleCkpIHtcbiAgICAgICAgaWYoY29uZmlnLmFyZ3VtZW50c0ZpcnN0ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuIGFJbnNlcnQoY29uZmlnQXJncywgY2FsbEFyZ3MsIGluZGV4KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYUluc2VydChjYWxsQXJncywgY29uZmlnQXJncywgaW5kZXgpO1xuICAgIH1cblxuICAgIHJldHVybiBjb25maWdBcmdzO1xufVxuXG4vKipcbiAqIEEgcmV1c2FibGUgZW1wdHkgZnVuY3Rpb25cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5leHBvcnRzLmVtcHR5Rm4gPSBmdW5jdGlvbigpIHt9O1xuXG4vKipcbiAqIEEgZnVuY3Rpb24gdGhhdCB0aHJvd3MgYW4gZXJyb3Igd2hlbiBjYWxsZWQuXG4gKiBVc2VmdWwgd2hlbiBkZWZpbmluZyBhYnN0cmFjdCBsaWtlIGNsYXNzZXNcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5leHBvcnRzLmFic3RyYWN0Rm4gPSBmdW5jdGlvbigpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2Fic3RyYWN0Rm4gbXVzdCBiZSBpbXBsZW1lbnRlZCcpO1xufTtcblxuLyoqXG4gKiBBdWdtZW50IHRoZSBwYXNzZWQgaW4gZnVuY3Rpb24ncyB0aGlzQXJnIGFuZCBvciBhcmd1bWVudHMgb2JqZWN0IFxuICogYmFzZWQgb24gdGhlIHBhc3NlZCBpbiBjb25maWcuXG4gKiBcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmbiB0aGUgZnVuY3Rpb24gdG8gY2FsbFxuICogQHBhcmFtICB7T2JqZWN0fSBjb25maWdcbiAqIFxuICogQHBhcmFtIHtPYmplY3R9IFtjb25maWcudGhpc0FyZ10gdGhlIHRoaXNBcmcgZm9yIHRoZSBmdW5jdGlvbiBiZWluZyBleGVjdXRlZC5cbiAqIElmIHRoaXMgaXMgdGhlIG9ubHkgcHJvcGVydHkgb24geW91ciBjb25maWcgb2JqZWN0IHRoZSBwcmVmZXJyZWQgd2F5IHdvdWxkXG4gKiBiZSBqdXN0IHRvIHVzZSBGdW5jdGlvbi5iaW5kXG4gKiBcbiAqIEBwYXJhbSB7QXJyYXl9IFtjb25maWcuYXJnc10gdGhlIGFyZ3VtZW50cyB1c2VkIGZvciB0aGUgZnVuY3Rpb24gYmVpbmcgZXhlY3V0ZWQuXG4gKiBUaGlzIHdpbGwgcmVwbGFjZSB0aGUgZnVuY3Rpb25zIGNhbGwgYXJncyBpZiBpbmRleCBpcyBub3QgYSBudW1iZXIgb3IgXG4gKiB0cnVlLlxuICogXG4gKiBAcGFyYW0ge051bWJlci9UcnVlfSBbY29uZmlnLmluZGV4XSBCeSBkZWZhdWx0IHRoZSB0aGUgY29uZmlndXJlZCBhcmd1bWVudHNcbiAqIHdpbGwgYmUgaW5zZXJ0ZWQgaW50byB0aGUgZnVuY3Rpb25zIHBhc3NlZCBpbiBjYWxsIGFyZ3VtZW50cy4gIElmIGluZGV4IGlzIHRydWVcbiAqIGFwcGVuZCB0aGUgYXJncyB0b2dldGhlciBpZiBpdCBpcyBhIG51bWJlciBpbnNlcnQgaXQgYXQgdGhlIHBhc3NlZCBpbiBpbmRleC5cbiAqIFxuICogQHBhcmFtIHtBcnJheX0gW2NvbmZpZy5hcmd1bWVudHNGaXJzdF0gcGFzcyBpbiBmYWxzZSB0byBcbiAqIGF1Z21lbnQgdGhlIGNvbmZpZ3VyZWQgYXJncyBmaXJzdCB3aXRoIEx1Yy5BcnJheS5pbnNlcnQuICBEZWZhdWx0c1xuICogdG8gdHJ1ZVxuICAgICBcbiAgICAgZnVuY3Rpb24gZm4oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMpXG4gICAgICAgIGNvbnNvbGUubG9nKGFyZ3VtZW50cylcbiAgICB9XG4gICAgXG4gICAgLy9MdWMuQXJyYXkuaW5zZXJ0KFs0XSwgWzEsMiwzXSwgMClcbiAgICBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudGVyKGZuLCB7XG4gICAgICAgIHRoaXNBcmc6IHtjb25maWdlZFRoaXNBcmc6IHRydWV9LFxuICAgICAgICBhcmdzOiBbMSwyLDNdLFxuICAgICAgICBpbmRleDowXG4gICAgfSkoNClcblxuICAgID5PYmplY3Qge2NvbmZpZ2VkVGhpc0FyZzogdHJ1ZX1cbiAgICA+WzEsIDIsIDMsIDRdXG5cbiAgICAvL0x1Yy5BcnJheS5pbnNlcnQoWzEsMiwzXSwgWzRdLCAwKVxuICAgIEx1Yy5GdW5jdGlvbi5jcmVhdGVBdWdtZW50ZXIoZm4sIHtcbiAgICAgICAgdGhpc0FyZzoge2NvbmZpZ2VkVGhpc0FyZzogdHJ1ZX0sXG4gICAgICAgIGFyZ3M6IFsxLDIsM10sXG4gICAgICAgIGluZGV4OjAsXG4gICAgICAgIGFyZ3VtZW50c0ZpcnN0OmZhbHNlXG4gICAgfSkoNClcblxuICAgID5PYmplY3Qge2NvbmZpZ2VkVGhpc0FyZzogdHJ1ZX1cbiAgICA+WzQsIDEsIDIsIDNdXG5cbiAgICBMdWMuQXJyYXkuaW5zZXJ0KFs0XSwgWzEsMiwzXSwgIHRydWUpXG4gICAgdmFyIGYgPSBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudGVyKGZuLCB7XG4gICAgICAgIGFyZ3M6IFsxLDIsM10sXG4gICAgICAgIGluZGV4OiB0cnVlXG4gICAgfSk7XG5cbiAgICBmLmFwcGx5KHtjb25maWc6IGZhbHNlfSwgWzRdKVxuXG4gICAgPk9iamVjdCB7Y29uZmlnOiBmYWxzZX1cbiAgICA+WzQsIDEsIDIsIDNdXG5cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSB0aGUgYXVnbWVudGVkIGZ1bmN0aW9uLlxuICovXG5leHBvcnRzLmNyZWF0ZUF1Z21lbnRlciA9IGZ1bmN0aW9uKGZuLCBjb25maWcpIHtcbiAgICB2YXIgdGhpc0FyZyA9IGNvbmZpZy50aGlzQXJnO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpc0FyZyB8fCB0aGlzLCBfYXVnbWVudEFyZ3MoY29uZmlnLCBhcmd1bWVudHMpKTtcbiAgICB9O1xufTtcblxuZnVuY3Rpb24gX2luaXRTZXF1ZW5jZUZ1bmN0aW9ucyhmbnMsIGNvbmZpZykge1xuICAgIHZhciB0b1J1biA9IFtdO1xuICAgIGFFYWNoKGZucywgZnVuY3Rpb24oZikge1xuICAgICAgICB2YXIgZm4gPSBmO1xuXG4gICAgICAgIGlmIChjb25maWcpIHtcbiAgICAgICAgICAgIGZuID0gZXhwb3J0cy5jcmVhdGVBdWdtZW50ZXIoZiwgY29uZmlnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRvUnVuLnB1c2goZm4pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRvUnVuO1xufVxuXG4vKipcbiAqIFJldHVybiBhIGZ1bmN0aW9uIHRoYXQgcnVucyB0aGUgcGFzc2VkIGluIGZ1bmN0aW9uc1xuICogYW5kIHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgbGFzdCBmdW5jdGlvbiBjYWxsZWQuXG4gKiBcbiAqIEBwYXJhbSAge0Z1bmN0aW9uW119IGZucyBcbiAqIEBwYXJhbSAge09iamVjdH0gW2NvbmZpZ10gQ29uZmlnIG9iamVjdFxuICogZm9yIEx1Yy5GdW5jdGlvbi5jcmVhdGVBdWdtZW50ZXIuICBJZiBkZWZpbmVkIGFsbCBvZiB0aGUgZnVuY3Rpb25zXG4gKiB3aWxsIGdldCBjcmVhdGVkIHdpdGggdGhlIHBhc3NlZCBpbiBjb25maWc7XG4gKlxuICAgIEx1Yy5GdW5jdGlvbi5jcmVhdGVTZXF1ZW5jZShbXG4gICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coMSlcbiAgICAgICAgfSxcbiAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygyKVxuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKDMpXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZmluaXNoZWQgbG9nZ2luZycpXG4gICAgICAgICAgICByZXR1cm4gNDtcbiAgICAgICAgfVxuICAgIF0pKClcbiAgICA+MVxuICAgID4yXG4gICAgPjNcbiAgICA+ZmluaXNoZWQgbG9nZ2luZ1xuICAgID40XG4gKiBcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5leHBvcnRzLmNyZWF0ZVNlcXVlbmNlID0gZnVuY3Rpb24oZm5zLCBjb25maWcpIHtcbiAgICB2YXIgZnVuY3Rpb25zID0gX2luaXRTZXF1ZW5jZUZ1bmN0aW9ucyhmbnMsIGNvbmZpZyk7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpID0gMCxcbiAgICAgICAgICAgIGxlbiA9IGZ1bmN0aW9ucy5sZW5ndGg7XG5cbiAgICAgICAgZm9yKDtpIDwgbGVuIC0xOyArK2kpIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uc1tpXS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uc1tsZW4gLTEgXS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG59O1xuXG4vKipcbiAqIFJldHVybiBhIGZ1bmN0aW9uIHRoYXQgcnVucyB0aGUgcGFzc2VkIGluIGZ1bmN0aW9uc1xuICogaWYgb25lIG9mIHRoZSBmdW5jdGlvbnMgcmV0dXJucyBmYWxzZSB0aGUgcmVzdCBvZiB0aGUgXG4gKiBmdW5jdGlvbnMgd29uJ3QgcnVuIGFuZCBmYWxzZSB3aWxsIGJlIHJldHVybmVkLlxuICpcbiAqIElmIG5vIGZhbHNlIGlzIHJldHVybmVkIHRoZSB2YWx1ZSBvZiB0aGUgbGFzdCBmdW5jdGlvbiByZXR1cm4gd2lsbCBiZSByZXR1cm5lZFxuICogXG4gICAgTHVjLkZ1bmN0aW9uLmNyZWF0ZVNlcXVlbmNlSWYoW1xuICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKDEpXG4gICAgICAgIH0sXG4gICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coMilcbiAgICAgICAgfSxcbiAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygzKVxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2ZpbmlzaGVkIGxvZ2dpbmcnKVxuICAgICAgICAgICAgcmV0dXJuIDQ7XG4gICAgICAgIH0sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpIGNhbnQgbG9nJylcbiAgICAgICAgfVxuICAgIF0pKClcblxuICAgID4xXG4gICAgPjJcbiAgICA+M1xuICAgID5maW5pc2hlZCBsb2dnaW5nXG4gICAgPmZhbHNlXG4gKlxuICogXG4gKiBAcGFyYW0gIHtGdW5jdGlvbltdfSBmbnMgXG4gKiBAcGFyYW0gIHtPYmplY3R9IFtjb25maWddIENvbmZpZyBvYmplY3RcbiAqIGZvciBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudGVyLiAgSWYgZGVmaW5lZCBhbGwgb2YgdGhlIGZ1bmN0aW9uc1xuICogd2lsbCBnZXQgY3JlYXRlZCB3aXRoIHRoZSBwYXNzZWQgaW4gY29uZmlnO1xuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbmV4cG9ydHMuY3JlYXRlU2VxdWVuY2VJZiA9IGZ1bmN0aW9uKGZucywgY29uZmlnKSB7XG4gICAgdmFyIGZ1bmN0aW9ucyA9IF9pbml0U2VxdWVuY2VGdW5jdGlvbnMoZm5zLCBjb25maWcpO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdmFsdWUsXG4gICAgICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgICAgIGZ1bmN0aW9ucy5zb21lKGZ1bmN0aW9uKGZuKXtcbiAgICAgICAgICAgIHZhbHVlID0gZm4uYXBwbHkodGhpcywgYXJncyk7XG5cbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSA9PT0gZmFsc2U7XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9O1xufTtcblxuLyoqXG4gKiBSZXR1cm4gYSBmdW5jdGlvbnMgdGhhdCBydW5zIHRoZSBwYXNzZWQgaW4gZnVuY3Rpb25zXG4gKiB0aGUgcmVzdWx0IG9mIGVhY2ggZnVuY3Rpb24gd2lsbCBiZSB0aGUgdGhlIGNhbGwgYXJncyBcbiAqIGZvciB0aGUgbmV4dCBmdW5jdGlvbi4gIFRoZSB2YWx1ZSBvZiB0aGUgbGFzdCBmdW5jdGlvbiBcbiAqIHJldHVybiB3aWxsIGJlIHJldHVybmVkLlxuICogXG4gICAgIFxuICAgICBMdWMuRnVuY3Rpb24uY3JlYXRlUmVsYXllcihbXG4gICAgICAgIGZ1bmN0aW9uKHN0cikge1xuICAgICAgICAgICAgcmV0dXJuIHN0ciArICdiJ1xuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbihzdHIpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHIgKyAnYydcbiAgICAgICAgfSxcbiAgICAgICAgZnVuY3Rpb24oc3RyKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RyICsgJ2QnXG4gICAgICAgIH1cbiAgICBdKSgnYScpXG5cbiAgICA+XCJhYmNkXCJcblxuICogQHBhcmFtICB7RnVuY3Rpb25bXX0gZm5zIFxuICogQHBhcmFtICB7T2JqZWN0fSBbY29uZmlnXSBDb25maWcgb2JqZWN0XG4gKiBmb3IgTHVjLkZ1bmN0aW9uLmNyZWF0ZUF1Z21lbnRlci4gIElmIGRlZmluZWQgYWxsIG9mIHRoZSBmdW5jdGlvbnNcbiAqIHdpbGwgZ2V0IGNyZWF0ZWQgd2l0aCB0aGUgcGFzc2VkIGluIGNvbmZpZztcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5leHBvcnRzLmNyZWF0ZVJlbGF5ZXIgPSBmdW5jdGlvbihmbnMsIGNvbmZpZykge1xuICAgIHZhciBmdW5jdGlvbnMgPSBfaW5pdFNlcXVlbmNlRnVuY3Rpb25zKGZucywgY29uZmlnKTtcblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHZhbHVlLFxuICAgICAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcblxuICAgICAgICBmdW5jdGlvbnMuZm9yRWFjaChmdW5jdGlvbihmbiwgaW5kZXgpIHtcbiAgICAgICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gZm4uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gZm4uYXBwbHkodGhpcywgW3ZhbHVlXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9O1xufTtcblxuLyoqXG4gKiBDcmVhdGUgYSB0aHJvdHRsZWQgZnVuY3Rpb24gZnJvbSB0aGUgcGFzc2VkIGluIGZ1bmN0aW9uXG4gKiB0aGF0IHdpbGwgb25seSBnZXQgY2FsbGVkIG9uY2UgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHNcbiAqIGhhdmUgYmVlbiBleGNlZWRlZC5cbiAqIFxuICAgIHZhciBsb2dBcmdzICA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhhcmd1bWVudHMpXG4gICAgfTtcblxuICAgIHZhciBhID0gTHVjLkZ1bmN0aW9uLmNyZWF0ZVRocm90dGxlZChsb2dBcmdzLCAxKTtcblxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCAxMDA7ICsraSkge1xuICAgICAgICBhKDEsMiwzKTtcbiAgICB9XG5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBhKDEpXG4gICAgfSwgMTAwKVxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGEoMilcbiAgICB9LCA0MDApXG5cbiAgICA+WzEsIDIsIDNdXG4gICAgPlsxXVxuICAgID5bMl1cbiAqIFxuICogQHBhcmFtICB7RnVuY3Rpb259IGZuXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IG1pbGxpcyBOdW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvXG4gKiB0aHJvdHRsZSB0aGUgZnVuY3Rpb24uXG4gKiBAcGFyYW0gIHtPYmplY3R9IFtjb25maWddIENvbmZpZyBvYmplY3RcbiAqIGZvciBMdWMuRnVuY3Rpb24uY3JlYXRlQXVnbWVudGVyLiAgSWYgZGVmaW5lZCBhbGwgb2YgdGhlIGZ1bmN0aW9uc1xuICogd2lsbCBnZXQgY3JlYXRlZCB3aXRoIHRoZSBwYXNzZWQgaW4gY29uZmlnO1xuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbmV4cG9ydHMuY3JlYXRlVGhyb3R0bGVkID0gZnVuY3Rpb24oZiwgbWlsbGlzLCBjb25maWcpIHtcbiAgICB2YXIgZm4gPSBjb25maWcgPyBleHBvcnRzLmNyZWF0ZUF1Z21lbnRlcihmLCBjb25maWcpIDogZixcbiAgICAgICAgdGltZU91dElkID0gZmFsc2U7XG5cbiAgICBpZighbWlsbGlzKSB7XG4gICAgICAgIHJldHVybiBmbjtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgICAgIGlmKHRpbWVPdXRJZCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVPdXRJZCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aW1lT3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGltZU91dElkID0gZmFsc2U7XG4gICAgICAgICAgICBmbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgfSwgbWlsbGlzKTtcbiAgICB9O1xufTtcblxuLyoqXG4gKiBEZWZlciBhIGZ1bmN0aW9uJ3MgZXhlY3V0aW9uIGZvciB0aGUgcGFzc2VkIGluXG4gKiBtaWxsaXNlY29uZHMuXG4gKiBcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmblxuICogQHBhcmFtICB7TnVtYmVyfSBtaWxsaXMgTnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0b1xuICogZGVmZXJcbiAqIEBwYXJhbSAge09iamVjdH0gW2NvbmZpZ10gQ29uZmlnIG9iamVjdFxuICogZm9yIEx1Yy5GdW5jdGlvbi5jcmVhdGVBdWdtZW50ZXIuICBJZiBkZWZpbmVkIGFsbCBvZiB0aGUgZnVuY3Rpb25zXG4gKiB3aWxsIGdldCBjcmVhdGVkIHdpdGggdGhlIHBhc3NlZCBpbiBjb25maWc7XG4gKiBcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5leHBvcnRzLmNyZWF0ZURlZmVycmVkID0gZnVuY3Rpb24oZiwgbWlsbGlzLCBjb25maWcpIHtcbiAgICB2YXIgZm4gPSBjb25maWcgPyBleHBvcnRzLmNyZWF0ZUF1Z21lbnRlcihmLCBjb25maWcpIDogZjtcblxuICAgIGlmKCFtaWxsaXMpIHtcbiAgICAgICAgcmV0dXJuIGZuO1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG5cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICB9LCBtaWxsaXMpO1xuICAgIH07XG59OyIsInZhciBhcnJheVNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLFxuICAgIGNvbXBhcmUgPSByZXF1aXJlKCcuL2NvbXBhcmUnKSxcbiAgICBpcyA9IHJlcXVpcmUoJy4vaXMnKSxcbiAgICBjb21wYXJlID0gY29tcGFyZS5jb21wYXJlO1xuXG5mdW5jdGlvbiBfY3JlYXRlSXRlcmF0b3JGbihmbiwgYykge1xuICAgIHZhciBjb25maWcgPSBjIHx8IHt9O1xuXG4gICAgaWYoaXMuaXNGdW5jdGlvbihmbikgJiYgKGNvbmZpZy50eXBlICE9PSAnc3RyaWN0JykpIHtcbiAgICAgICAgcmV0dXJuIGMgPyBmbi5iaW5kKGMpIDogZm47XG4gICAgfVxuXG4gICAgaWYoY29uZmlnLnR5cGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb25maWcudHlwZSA9ICdsb29zZSc7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBjb21wYXJlKGZuLCB2YWx1ZSwgY29uZmlnKTtcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBfY3JlYXRlSXRlcmF0b3JOb3RGbihmbiwgY29uZmlnKSB7XG4gICAgdmFyIGZ1bmN0aW9uVG9Ob3QgPSBfY3JlYXRlSXRlcmF0b3JGbihmbiwgY29uZmlnKTtcbiAgICAgICAgXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gIWZ1bmN0aW9uVG9Ob3QuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xufVxuXG5cbi8qKlxuICogQGNsYXNzIEx1Yy5BcnJheSBcbiAqIFBhY2thZ2UgZm9yIEFycmF5IG1ldGhvZHMuIDxicj5cbiAqIFxuICogS2VlcCBpbiBtaW5kIHRoYXQgTHVjIGlzIG9wdGlvbmFsbHkgcGFja2FnZWQgd2l0aCBlczUgc2hpbSBzbyB5b3UgY2FuIHdyaXRlIGVzNSBjb2RlIGluIG5vbiBlczUgYnJvd3NlcnMuXG4gKiBJdCBjb21lcyB3aXRoIHlvdXIgZmF2b3JpdGUge0BsaW5rIEFycmF5IEFycmF5fSBtZXRob2RzIHN1Y2ggYXMgQXJyYXkuZm9yRWFjaCwgQXJyYXkuZmlsdGVyLCBBcnJheS5zb21lLCBBcnJheS5ldmVyeSBBcnJheS5yZWR1Y2VSaWdodCAuLlxuICpcbiAqIEFsc28gZG9uJ3QgZm9yZ2V0IGFib3V0IEx1Yy5BcnJheS5lYWNoIGFuZCBMdWMuQXJyYXkudG9BcnJheSwgdGhleSBhcmUgZ3JlYXQgdXRpbGl0eSBtZXRob2RzXG4gKiB0aGF0IGFyZSB1c2VkIGFsbCBvdmVyIHRoZSBmcmFtZXdvcmsuXG4gKiBcbiAqIEFsbCByZW1vdmVcXCogLyBmaW5kXFwqIG1ldGhvZHMgZm9sbG93IHRoZSBzYW1lIGFwaS4gIFxcKkFsbCBmdW5jdGlvbnMgd2lsbCByZXR1cm4gYW4gYXJyYXkgb2YgcmVtb3ZlZCBvciBmb3VuZFxuICogaXRlbXMuICBUaGUgaXRlbXMgd2lsbCBiZSBhZGRlZCB0byB0aGUgYXJyYXkgaW4gdGhlIG9yZGVyIHRoZXkgYXJlXG4gKiBmb3VuZC4gIFxcKkZpcnN0IGZ1bmN0aW9ucyB3aWxsIHJldHVybiB0aGUgZmlyc3QgaXRlbSBhbmQgc3RvcCBpdGVyYXRpbmcgYWZ0ZXIgdGhhdCwgaWYgbm9uZVxuICogIGlzIGZvdW5kIGZhbHNlIGlzIHJldHVybmVkLiAgcmVtb3ZlXFwqIGZ1bmN0aW9ucyB3aWxsIGRpcmVjdGx5IGNoYW5nZSB0aGUgcGFzc2VkIGluIGFycmF5LlxuICogIFxcKk5vdCBmdW5jdGlvbnMgb25seSBkbyB0aGUgZm9sbG93aW5nIGFjdGlvbnMgaWYgdGhlIGNvbXBhcmlzb24gaXMgbm90IHRydWUuXG4gKiAgQWxsIHJlbW92ZVxcKiAvIGZpbmRcXCogdGFrZSB0aGUgZm9sbG93aW5nIGFwaTogYXJyYXksIG9iamVjdFRvQ29tcGFyZU9ySXRlcmF0b3IsIGNvbXBhcmVDb25maWdPclRoaXNBcmcgPGJyPmZvciBleGFtcGxlOlxuICpcbiAgICAvL21vc3QgY29tbW9uIHVzZSBjYXNlXG4gICAgTHVjLkFycmF5LmZpbmRGaXJzdChbMSwyLDMsIHt9XSwge30pO1xuICAgID5PYmplY3Qge31cblxuICAgIC8vcGFzcyBpbiBvcHRpb25hbCBjb25maWcgZm9yIGEgc3RyaWN0ID09PSBjb21wYXJpc29uXG4gICAgTHVjLkFycmF5LmZpbmRGaXJzdChbMSwyLDMse31dLCB7fSwge3R5cGU6ICdzdHJpY3QnfSk7XG4gICAgPmZhbHNlXG5cbiAgICAvL3Bhc3MgaW4gYW4gaXRlcmF0b3IgYW5kIHRoaXNBcmdcbiAgICBMdWMuQXJyYXkuZmluZEZpcnN0KFsxLDIsMyx7fV0sIGZ1bmN0aW9uKHZhbCwgaW5kZXgsIGFycmF5KXtcbiAgICAgICAgcmV0dXJuIHZhbCA9PT0gMyB8fCB0aGlzLm51bSA9PT0gdmFsO1xuICAgIH0sIHtudW06IDF9KTtcbiAgICA+MVxuICAgIFxuICAgIC8veW91IGNhbiBzZWUgcmVtb3ZlIG1vZGlmaWVzIHRoZSBwYXNzZWQgaW4gYXJyYXkuXG4gICAgdmFyIGFyciA9IFsxLDIse2E6MX0sMSwge2E6MX1dO1xuICAgIEx1Yy5BcnJheS5yZW1vdmVGaXJzdChhcnIsIHthOjF9KVxuICAgID57YToxfVxuICAgIGFycjtcbiAgICA+WzEsIDIsIDEsIHthOjF9XVxuICAgIEx1Yy5BcnJheS5yZW1vdmVMYXN0KGFyciwgMSlcbiAgICA+MVxuICAgIGFycjtcbiAgICA+WzEsMiwge2E6MX1dXG4gICAgXG4gICAgXG4gICAgTHVjLkFycmF5LmZpbmRBbGwoWzEsMiwzLCB7YToxLGI6Mn1dLCBmdW5jdGlvbigpIHtyZXR1cm4gdHJ1ZTt9KVxuICAgID4gWzEsMiwzLCB7YToxLGI6Mn1dXG4gICAgLy9zaG93IGhvdyBub3Qgd29ya3Mgd2l0aCBhbiBpdGVyYXRvclxuICAgIEx1Yy5BcnJheS5maW5kQWxsTm90KFsxLDIsMywge2E6MSxiOjJ9XSwgZnVuY3Rpb24oKSB7cmV0dXJuIHRydWU7fSlcbiAgICA+W11cbiAqXG4gKiBGb3IgY29tbW9ubHkgdXNlZCBmaW5kL3JlbW92ZSBmdW5jdGlvbnMgY2hlY2sgb3V0IEx1Yy5BcnJheUZucyBmb3IgZXhhbXBsZSBhXG4gKiBcImNvbXBhY3RcIiBsaWtlIGZ1bmN0aW9uXG4gKiBcbiAgICBMdWMuQXJyYXkuZmluZEFsbE5vdEZhbHN5KFtmYWxzZSwgJycsIHVuZGVmaW5lZCwgMCwge30sIFtdXSlcbiAgICA+WzAsIHt9LCBbXV1cbiAqXG4gKiBPciByZW1vdmUgYWxsIGVtcHR5IGl0ZW1zXG4gKiBcbiAgICB2YXIgYXJyID0gWycnLCAwICwgW10sIHthOjF9LCB0cnVlLCB7fSwgWzFdXVxuICAgIEx1Yy5BcnJheS5yZW1vdmVBbGxFbXB0eShhcnIpXG4gICAgPlsnJywgW10sIHt9XVxuICAgIGFyclxuICAgID5bMCwge2E6MX0sIHRydWUsIFsxXV1cbiAqL1xuXG4vKipcbiAqIFR1cm4gdGhlIHBhc3NlZCBpbiBpdGVtIGludG8gYW4gYXJyYXkgaWYgaXRcbiAqIGlzbid0IG9uZSBhbHJlYWR5LCBpZiB0aGUgaXRlbSBpcyBhbiBhcnJheSBqdXN0IHJldHVybiBpdC4gIFxuICogSXQgcmV0dXJucyBhbiBlbXB0eSBhcnJheSBpZiBpdGVtIGlzIG51bGwgb3IgdW5kZWZpbmVkLlxuICogSWYgaXQgaXMganVzdCBhIHNpbmdsZSBpdGVtIHJldHVybiBhbiBhcnJheSBjb250YWluaW5nIHRoZSBpdGVtLlxuICogXG4gICAgTHVjLkFycmF5LnRvQXJyYXkoKVxuICAgID5bXVxuICAgIEx1Yy5BcnJheS50b0FycmF5KG51bGwpXG4gICAgPltdXG4gICAgTHVjLkFycmF5LnRvQXJyYXkoMSlcbiAgICA+WzFdXG4gICAgTHVjLkFycmF5LnRvQXJyYXkoWzEsMl0pXG4gICAgPlsxLCAyXVxuICpcbiAqIEBwYXJhbSAge09iamVjdH0gaXRlbSBpdGVtIHRvIHR1cm4gaW50byBhbiBhcnJheS5cbiAqIEByZXR1cm4gdGhlIGFycmF5XG4gKi9cbmZ1bmN0aW9uIHRvQXJyYXkoaXRlbSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGl0ZW0pKSB7XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgIH1cbiAgICByZXR1cm4gKGl0ZW0gPT09IG51bGwgfHwgaXRlbSA9PT0gdW5kZWZpbmVkKSA/IFtdIDogW2l0ZW1dO1xufVxuXG4vKipcbiAqIFJldHVybiB0aGUgbGFzdCBpdGVtIG9mIHRoZSBhcnJheVxuICogQHBhcmFtICB7QXJyYXl9IGFyclxuICogQHJldHVybiB7T2JqZWN0fSB0aGUgaXRlbVxuICAgIFxuICAgIHZhciBteUxvbmdBcnJheU5hbWVGb3JUaGluZ3NUaGF0SVdhbnRUb0tlZXBUcmFja09mID0gWzEsMiwzXVxuICAgIFxuICAgIEx1Yy5BcnJheS5sYXN0KG15TG9uZ0FycmF5TmFtZUZvclRoaW5nc1RoYXRJV2FudFRvS2VlcFRyYWNrT2YpO1xuICAgIHZzLlxuICAgIG15TG9uZ0FycmF5TmFtZUZvclRoaW5nc1RoYXRJV2FudFRvS2VlcFRyYWNrT2ZbbXlMb25nQXJyYXlOYW1lRm9yVGhpbmdzVGhhdElXYW50VG9LZWVwVHJhY2tPZi5sZW5ndGggLTFdXG4gKlxuICovXG5mdW5jdGlvbiBsYXN0KGFycikge1xuICAgIHJldHVybiBhcnJbYXJyLmxlbmd0aCAtMV07XG59XG5cbi8qKlxuICogRmxhdHRlbiBvdXQgYW4gYXJyYXkgb2Ygb2JqZWN0cyBiYXNlZCBvZiB0aGVpciB2YWx1ZSBmb3IgdGhlIHBhc3NlZCBpbiBrZXkuXG4gKiBUaGlzIGFsc28gdGFrZXMgYWNjb3VudCBmb3IgbnVsbC91bmRlZmluZWQgdmFsdWVzLlxuICpcbiAgICBMdWMuQXJyYXkucGx1Y2soW3VuZGVmaW5lZCwge2E6JzEnLCBiOjJ9LCB7YjozfSwge2I6NH1dLCAnYicpXG4gICAgPlt1bmRlZmluZWQsIDIsIDMsIDRdXG4gKiBAcGFyYW0gIHtPYmplY3RbXX0gYXJyIFxuICogQHBhcmFtICB7U3RyaW5nfSBrZXkgXG4gKiBAcmV0dXJuIHtBcnJheX0gICAgIFxuICovXG5mdW5jdGlvbiBwbHVjayhhcnIsIGtleSkge1xuICAgIHJldHVybiBhcnIubWFwKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZSAmJiB2YWx1ZVtrZXldO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIFJldHVybiB0aGUgaXRlbXMgaW4gYmV0d2VlbiB0aGUgcGFzc2VkIGluIGluZGV4XG4gKiBhbmQgdGhlIGVuZCBvZiB0aGUgYXJyYXkuXG4gKlxuICAgIEx1Yy5BcnJheS5mcm9tSW5kZXgoWzEsMiwzLDQsNV0sIDEpXG4gICAgPlsyLCAzLCA0LCA1XVxuXG4gKiBAcGFyYW0gIHtBcnJheS9hcmd1bWVudHN9IGFyciBcbiAqIEBwYXJhbSAge051bWJlcn0gaW5kZXggXG4gKiBAcmV0dXJuIHtBcnJheX0gdGhlIG5ldyBhcnJheS5cbiAqIFxuICovXG5mdW5jdGlvbiBmcm9tSW5kZXgoYSwgaW5kZXgpIHtcbiAgICB2YXIgYXJyID0gaXMuaXNBcmd1bWVudHMoYSkgPyBhcnJheVNsaWNlLmNhbGwoYSkgOiBhO1xuICAgIHJldHVybiBhcnJheVNsaWNlLmNhbGwoYXJyLCBpbmRleCwgYXJyLmxlbmd0aCk7XG59XG5cbi8qKlxuICogUnVucyBhbiBBcnJheS5mb3JFYWNoIGFmdGVyIGNhbGxpbmcgTHVjLkFycmF5LnRvQXJyYXkgb24gdGhlIGl0ZW0uXG4gIEl0IGlzIHZlcnkgdXNlZnVsIGZvciBzZXR0aW5nIHVwIGZsZXhpYmxlIGFwaSdzIHRoYXQgY2FuIGhhbmRsZSBub25lIG9uZSBvciBtYW55LlxuXG4gICAgTHVjLkFycmF5LmVhY2godGhpcy5pdGVtcywgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICB0aGlzLl9hZGRJdGVtKGl0ZW0pO1xuICAgIH0pO1xuXG4gICAgdnMuXG5cbiAgICBpZihBcnJheS5pc0FycmF5KHRoaXMuaXRlbXMpKXtcbiAgICAgICAgdGhpcy5pdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgIHRoaXMuX2FkZEl0ZW0oaXRlbSk7XG4gICAgICAgIH0pXG4gICAgfVxuICAgIGVsc2UgaWYodGhpcy5pdGVtcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuX2FkZEl0ZW0odGhpcy5pdGVtcyk7XG4gICAgfVxuXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgaXRlbVxuICogQHBhcmFtICB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgdGhpc0FyZyAgIFxuICpcbiAqL1xuZnVuY3Rpb24gZWFjaChpdGVtLCBmbiwgdGhpc0FyZykge1xuICAgIHZhciBhcnIgPSB0b0FycmF5KGl0ZW0pO1xuICAgIHJldHVybiBhcnIuZm9yRWFjaC5jYWxsKGFyciwgZm4sIHRoaXNBcmcpO1xufVxuXG4vKipcbiAqIEluc2VydCBvciBhcHBlbmQgdGhlIHNlY29uZCBhcnJheS9hcmd1bWVudHMgaW50byB0aGVcbiAqIGZpcnN0IGFycmF5L2FyZ3VtZW50cy4gIFRoaXMgbWV0aG9kIGRvZXMgbm90IGFsdGVyXG4gKiB0aGUgcGFzc2VkIGluIGFycmF5L2FyZ3VtZW50cy5cbiAqIFxuICogQHBhcmFtICB7QXJyYXkvYXJndW1lbnRzfSBmaXJzdEFycmF5T3JBcmdzXG4gKiBAcGFyYW0gIHtBcnJheS9hcmd1bWVudHN9IHNlY29uZEFycmF5T3JBcmdzXG4gKiBAcGFyYW0gIHtOdW1iZXIvdHJ1ZX0gaW5kZXhPckFwcGVuZCB0cnVlIHRvIGFwcGVuZCBcbiAqIHRoZSBzZWNvbmQgYXJyYXkgdG8gdGhlIGVuZCBvZiB0aGUgZmlyc3Qgb25lLiAgSWYgaXQgaXMgYSBudW1iZXJcbiAqIGluc2VydCB0aGUgc2Vjb25kQXJyYXkgaW50byB0aGUgZmlyc3Qgb25lIGF0IHRoZSBwYXNzZWQgaW4gaW5kZXguXG4gKiBAcmV0dXJuIHtBcnJheX0gdGhlIG5ld2x5IGNyZWF0ZWQgYXJyYXkuXG4gKlxuICAgIEx1Yy5BcnJheS5pbnNlcnQoWzAsNF0sIFsxLDIsM10sIDEpO1xuICAgID5bMCwgMSwgMiwgMywgNF1cbiAgICBMdWMuQXJyYXkuaW5zZXJ0KFswLDRdLCBbMSwyLDNdLCB0cnVlKTtcbiAgICA+WzAsIDQsIDEsIDIsIDNdXG4gICAgTHVjLkFycmF5Lmluc2VydChbMCw0XSwgWzEsMiwzXSwgMCk7XG4gICAgPlsxLCAyLCAzLCAwLCA0XVxuICpcbiAqL1xuZnVuY3Rpb24gaW5zZXJ0KGZpcnN0QXJyYXlPckFyZ3MsIHNlY29uZEFycmF5T3JBcmdzLCBpbmRleE9yQXBwZW5kKSB7XG4gICAgdmFyIGZpcnN0QXJyYXkgPSBhcnJheVNsaWNlLmNhbGwoZmlyc3RBcnJheU9yQXJncyksXG4gICAgICAgIHNlY29uZEFycmF5ID0gYXJyYXlTbGljZS5jYWxsKHNlY29uZEFycmF5T3JBcmdzKSxcbiAgICAgICAgc3BsaWNlQXJncztcblxuICAgIGlmKGluZGV4T3JBcHBlbmQgPT09IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIGZpcnN0QXJyYXkuY29uY2F0KHNlY29uZEFycmF5KTtcbiAgICB9XG5cbiAgICBzcGxpY2VBcmdzID0gW2luZGV4T3JBcHBlbmQsIDBdLmNvbmNhdChzZWNvbmRBcnJheSk7XG4gICAgZmlyc3RBcnJheS5zcGxpY2UuYXBwbHkoZmlyc3RBcnJheSwgc3BsaWNlQXJncyk7XG4gICAgcmV0dXJuIGZpcnN0QXJyYXk7XG59XG5cbi8qKlxuICogUmVtb3ZlIGFuIGl0ZW0gZnJvbSB0aGUgcGFzc2VkIGluIGFyclxuICogZnJvbSB0aGUgaW5kZXguXG4gKiBAcGFyYW0gIHtBcnJheX0gYXJyXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IGluZGV4XG4gKiBAcmV0dXJuIHtPYmplY3R9IHRoZSBpdGVtIHJlbW92ZWQuXG4gKlxuICAgIHZhciBhcnIgPSBbMSwyLDNdO1xuICAgIEx1Yy5BcnJheS5yZW1vdmVBdEluZGV4KGFyciwgMSk7XG4gICAgPjJcbiAgICBhcnI7XG4gICAgPlsxLDNdXG5cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlQXRJbmRleChhcnIsIGluZGV4KSB7XG4gICAgdmFyIGl0ZW0gPSBhcnJbaW5kZXhdO1xuICAgIGFyci5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIHJldHVybiBpdGVtO1xufVxuXG5mdW5jdGlvbiBfcmVtb3ZlRmlyc3QoYXJyLCBmbikge1xuICAgIHZhciByZW1vdmVkID0gZmFsc2U7XG5cbiAgICBhcnIuc29tZShmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcbiAgICAgICAgaWYgKGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpIHtcbiAgICAgICAgICAgIHJlbW92ZWQgPSByZW1vdmVBdEluZGV4KGFyciwgaW5kZXgpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiByZW1vdmVkO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgZmlyc3QgaXRlbSBmcm9tIHRoZSBwYXNzZWQgaW4gYXJyYXlcbiAqIHRoYXQge0BsaW5rIEx1YyNjb21wYXJlIG1hdGNoZXN9IHRoZSBwYXNzZWQgaW4gb2JqZWN0LiAgSW5zdGVhZCBvZiBcbiAqIGNvbXBhcmluZyBhbiBvYmplY3QgYW4gaXRlcmF0b3IgZnVuY3Rpb24gY2FuIGJlXG4gKiB1c2VkLlxuICogXG57Y29weURvYyNhcnJQYXJhbXN9XG57Y29weURvYyNhcnJSZW1vdmVTaW5nbGV9XG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUZpcnN0KGFyciwgb2JqLCBjb25maWcpIHtcbiAgICB2YXIgZm4gPSBfY3JlYXRlSXRlcmF0b3JGbihvYmosIGNvbmZpZyk7XG4gICAgcmV0dXJuIF9yZW1vdmVGaXJzdChhcnIsIGZuKTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGZpcnN0IGl0ZW0gZnJvbSB0aGUgcGFzc2VkIGluIGFycmF5XG4gKiB0aGF0IGRvZXMgbm90IHtAbGluayBMdWMjY29tcGFyZSBtYXRjaH0gdGhlIHBhc3NlZCBpbiBvYmplY3QuICBJbnN0ZWFkIG9mIFxuICogY29tcGFyaW5nIGFuIG9iamVjdCBhbiBpdGVyYXRvciBmdW5jdGlvbiBjYW4gYmVcbiAqIHVzZWQuXG4gKiBcbntjb3B5RG9jI2FyclBhcmFtc31cbntjb3B5RG9jI2FyclJlbW92ZVNpbmdsZX1cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlRmlyc3ROb3QoYXJyLCBvYmosIGNvbmZpZykge1xuICAgIHZhciBmbiA9IF9jcmVhdGVJdGVyYXRvck5vdEZuKG9iaiwgY29uZmlnKTtcbiAgICByZXR1cm4gX3JlbW92ZUZpcnN0KGFyciwgZm4pO1xufVxuXG5cbmZ1bmN0aW9uIF9yZW1vdmVBbGwoYXJyLCBmbikge1xuICAgIHZhciBpbmRleHNUb1JlbW92ZSA9IFtdLFxuICAgICAgICByZW1vdmVkID0gW107XG5cbiAgICBhcnIuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcbiAgICAgICAgaWYgKGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpIHtcbiAgICAgICAgICAgIGluZGV4c1RvUmVtb3ZlLnVuc2hpZnQoaW5kZXgpO1xuICAgICAgICAgICAgcmVtb3ZlZC5wdXNoKHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgaW5kZXhzVG9SZW1vdmUuZm9yRWFjaChmdW5jdGlvbihpbmRleCl7XG4gICAgICAgIHJlbW92ZUF0SW5kZXgoYXJyLCBpbmRleCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVtb3ZlZDtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGFsbCB0aGUgaXRlbXMgZnJvbSB0aGUgcGFzc2VkIGluIGFycmF5XG4gKiB0aGF0IGRvIG5vdCB7QGxpbmsgTHVjI2NvbXBhcmUgbWF0Y2h9IHRoZSBwYXNzZWQgaW4gb2JqZWN0LiAgSW5zdGVhZCBvZiBcbiAqIGNvbXBhcmluZyBhbiBvYmplY3QgYW4gaXRlcmF0b3IgZnVuY3Rpb24gY2FuIGJlXG4gKiB1c2VkLlxuICogXG57Y29weURvYyNhcnJQYXJhbXN9XG57Y29weURvYyNhcnJSZW1vdmVBbGx9XG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUFsbE5vdChhcnIsIG9iaiwgY29uZmlnKSB7XG4gICAgdmFyIGZuID0gX2NyZWF0ZUl0ZXJhdG9yTm90Rm4ob2JqLCBjb25maWcpO1xuICAgIHJldHVybiBfcmVtb3ZlQWxsKGFyciwgZm4pO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgYWxsIHRoZSBpdGVtcyBmcm9tIHRoZSBwYXNzZWQgaW4gYXJyYXlcbiAqIHRoYXQge0BsaW5rIEx1YyNjb21wYXJlIG1hdGNoZXN9IHRoZSBwYXNzZWQgaW4gb2JqZWN0LiAgSW5zdGVhZCBvZiBcbiAqIGNvbXBhcmluZyBhbiBvYmplY3QgYW4gaXRlcmF0b3IgZnVuY3Rpb24gY2FuIGJlXG4gKiB1c2VkLlxuICogXG57Y29weURvYyNhcnJQYXJhbXN9XG57Y29weURvYyNhcnJSZW1vdmVBbGx9XG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUFsbChhcnIsIG9iaiwgY29uZmlnKSB7XG4gICAgdmFyIGZuID0gX2NyZWF0ZUl0ZXJhdG9yRm4ob2JqLCBjb25maWcpO1xuICAgIHJldHVybiBfcmVtb3ZlQWxsKGFyciwgZm4pO1xufVxuXG5mdW5jdGlvbiBfZmluZEZpcnN0KGFyciwgZm4pIHtcbiAgICB2YXIgaXRlbSA9IGZhbHNlO1xuICAgIGFyci5zb21lKGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xuICAgICAgICBpZiAoZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKSkge1xuICAgICAgICAgICAgaXRlbSA9IGFycltpbmRleF07XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGl0ZW07XG59XG5cbi8qKlxuICogRmluZCB0aGUgZmlyc3QgaXRlbSBmcm9tIHRoZSBwYXNzZWQgaW4gYXJyYXlcbiAqIHRoYXQgZG9lcyB7QGxpbmsgTHVjI2NvbXBhcmUgbWF0Y2hlc30gdGhlIHBhc3NlZCBpbiBvYmplY3QuICBJbnN0ZWFkIG9mIFxuICogY29tcGFyaW5nIGFuIG9iamVjdCBhbiBpdGVyYXRvciBmdW5jdGlvbiBjYW4gYmVcbiAqIHVzZWQuXG4gKiBcbntjb3B5RG9jI2FyclBhcmFtc31cbntjb3B5RG9jI2FyckZpbmRTaW5nbGV9XG4gKi9cbmZ1bmN0aW9uIGZpbmRGaXJzdChhcnIsIG9iaiwgY29uZmlnKSB7XG4gICAgdmFyIGZuID0gX2NyZWF0ZUl0ZXJhdG9yRm4ob2JqLCBjb25maWcpO1xuICAgIHJldHVybiBfZmluZEZpcnN0KGFyciwgZm4pO1xufVxuXG4vKipcbiAqIEZpbmQgdGhlIGZpcnN0IGl0ZW0gZnJvbSB0aGUgcGFzc2VkIGluIGFycmF5XG4gKiB0aGF0IGRvZXMgbm90IHtAbGluayBMdWMjY29tcGFyZSBtYXRjaH0gdGhlIHBhc3NlZCBpbiBvYmplY3QuICBJbnN0ZWFkIG9mIFxuICogY29tcGFyaW5nIGFuIG9iamVjdCBhbiBpdGVyYXRvciBmdW5jdGlvbiBjYW4gYmVcbiAqIHVzZWQuXG4gKiBcbntjb3B5RG9jI2FyclBhcmFtc31cbntjb3B5RG9jI2FyckZpbmRTaW5nbGV9XG4gKi9cbmZ1bmN0aW9uIGZpbmRGaXJzdE5vdChhcnIsIG9iaiwgY29uZmlnKSB7XG4gICAgdmFyIGZuID0gX2NyZWF0ZUl0ZXJhdG9yTm90Rm4ob2JqLCBjb25maWcpO1xuICAgIHJldHVybiBfZmluZEZpcnN0KGFyciwgZm4pO1xufVxuXG5mdW5jdGlvbiBfZmluZEFsbChhcnIsIGZuKSB7XG4gICAgdmFyIGZvdW5kID0gYXJyLmZpbHRlcihmbik7XG4gICAgcmV0dXJuIGZvdW5kO1xufVxuXG4vKipcbiAqIEZpbmQgYWxsIG9mIHRoZSB0aGUgaXRlbXMgZnJvbSB0aGUgcGFzc2VkIGluIGFycmF5XG4gKiB0aGF0IHtAbGluayBMdWMjY29tcGFyZSBtYXRjaGVzfSB0aGUgcGFzc2VkIGluIG9iamVjdC4gIEluc3RlYWQgb2YgXG4gKiBjb21wYXJpbmcgYW4gb2JqZWN0IGFuIGl0ZXJhdG9yIGZ1bmN0aW9uIGNhbiBiZVxuICogdXNlZC5cbiAqIFxue2NvcHlEb2MjYXJyUGFyYW1zfVxue2NvcHlEb2MjYXJyRmluZEFsbH1cbiAqL1xuZnVuY3Rpb24gZmluZEFsbChhcnIsIG9iaiwgY29uZmlnKSB7XG4gICAgdmFyIGZuID0gX2NyZWF0ZUl0ZXJhdG9yRm4ob2JqLCBjb25maWcpO1xuICAgIHJldHVybiBfZmluZEFsbChhcnIsIGZuKTtcbn1cblxuLyoqXG4gKiBGaW5kIGFsbCBvZiB0aGUgdGhlIGl0ZW1zIGZyb20gdGhlIHBhc3NlZCBpbiBhcnJheVxuICogdGhhdCBkbyBub3Qge0BsaW5rIEx1YyNjb21wYXJlIG1hdGNofSB0aGUgcGFzc2VkIGluIG9iamVjdC4gIEluc3RlYWQgb2YgXG4gKiBjb21wYXJpbmcgYW4gb2JqZWN0IGFuIGl0ZXJhdG9yIGZ1bmN0aW9uIGNhbiBiZVxuICogdXNlZC5cbiAqIFxue2NvcHlEb2MjYXJyUGFyYW1zfVxue2NvcHlEb2MjYXJyRmluZEFsbH1cbiAqL1xuZnVuY3Rpb24gZmluZEFsbE5vdChhcnIsIG9iaiwgY29uZmlnKSB7XG4gICAgdmFyIGZuID0gX2NyZWF0ZUl0ZXJhdG9yTm90Rm4ob2JqLCBjb25maWcpO1xuICAgIHJldHVybiBfZmluZEFsbChhcnIsIGZuKTtcbn1cblxuXG5leHBvcnRzLnRvQXJyYXkgPSB0b0FycmF5O1xuZXhwb3J0cy5lYWNoID0gZWFjaDtcbmV4cG9ydHMuaW5zZXJ0ID0gaW5zZXJ0O1xuZXhwb3J0cy5mcm9tSW5kZXggPSBmcm9tSW5kZXg7XG5leHBvcnRzLmxhc3QgPSBsYXN0O1xuZXhwb3J0cy5wbHVjayA9IHBsdWNrO1xuXG5leHBvcnRzLnJlbW92ZUF0SW5kZXggPSByZW1vdmVBdEluZGV4O1xuZXhwb3J0cy5maW5kRmlyc3ROb3QgPSBmaW5kRmlyc3ROb3Q7XG5leHBvcnRzLmZpbmRBbGxOb3QgPSBmaW5kQWxsTm90O1xuZXhwb3J0cy5maW5kRmlyc3QgPSBmaW5kRmlyc3Q7XG5leHBvcnRzLmZpbmRBbGwgPSBmaW5kQWxsO1xuXG5leHBvcnRzLnJlbW92ZUZpcnN0Tm90ID0gcmVtb3ZlRmlyc3ROb3Q7XG5leHBvcnRzLnJlbW92ZUFsbE5vdCA9IHJlbW92ZUFsbE5vdDtcbmV4cG9ydHMucmVtb3ZlRmlyc3QgPSByZW1vdmVGaXJzdDtcbmV4cG9ydHMucmVtb3ZlQWxsID0gcmVtb3ZlQWxsO1xuXG4oZnVuY3Rpb24oKXtcbiAgICB2YXIgX2NyZWF0ZUxhc3RGbiA9IGZ1bmN0aW9uKGZuTmFtZSkge1xuICAgICAgICB2YXIgbGFzdE5hbWUgPSBmbk5hbWUucmVwbGFjZSgnRmlyc3QnLCAnTGFzdCcpO1xuXG4gICAgICAgIGV4cG9ydHNbbGFzdE5hbWVdID0gZnVuY3Rpb24oYXJyLCBvYmosIGNvbmZpZykge1xuICAgICAgICAgICAgdmFyIHJldDtcblxuICAgICAgICAgICAgYXJyLnJldmVyc2UoKTtcbiAgICAgICAgICAgIHJldCA9IGV4cG9ydHNbZm5OYW1lXShhcnIsIG9iaiwgY29uZmlnKTtcbiAgICAgICAgICAgIGFyci5yZXZlcnNlKCk7XG5cbiAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH07XG5cbiAgICB9LCBuYW1lc1RvQWRkTGFzdCA9IFsnZmluZEZpcnN0Tm90JywgJ2ZpbmRGaXJzdCcsICdyZW1vdmVGaXJzdE5vdCcsICdyZW1vdmVGaXJzdCddO1xuXG4gICAgbmFtZXNUb0FkZExhc3QuZm9yRWFjaChmdW5jdGlvbihmbk5hbWUpIHtcbiAgICAgICAgX2NyZWF0ZUxhc3RGbihmbk5hbWUpO1xuICAgIH0pO1xuXG59KCkpO1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjLkFycmF5IFxuICogQG1ldGhvZCBmaW5kTGFzdE5vdCBcbiAqIFNhbWUgYXMgTHVjLkFycmF5LmZpbmRGaXJzdE5vdCBleGNlcHQgc3RhcnQgYXQgdGhlIGVuZC5cbiAqL1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjLkFycmF5IFxuICogQG1ldGhvZCBmaW5kTGFzdFxuICogU2FtZSBhcyBMdWMuQXJyYXkuZmluZEZpcnN0IGV4Y2VwdCBzdGFydCBhdCB0aGUgZW5kLlxuICovXG5cbi8qKlxuICogQG1lbWJlciBMdWMuQXJyYXkgXG4gKiBAbWV0aG9kIHJlbW92ZUxhc3ROb3QgXG4gKiBTYW1lIGFzIEx1Yy5BcnJheS5yZW1vdmVGaXJzdE5vdCBleGNlcHQgc3RhcnQgYXQgdGhlIGVuZC5cbiAqL1xuXG4vKipcbiAqIEBtZW1iZXIgTHVjLkFycmF5IFxuICogQG1ldGhvZCByZW1vdmVMYXN0IFxuICogU2FtZSBhcyBMdWMuQXJyYXkucmVtb3ZlRmlyc3QgZXhjZXB0IHN0YXJ0IGF0IHRoZSBlbmQuXG4gKi9cbiIsInZhciBhcnJheSA9IHJlcXVpcmUoJy4vYXJyYXknKSxcbiAgICBpcyA9IHJlcXVpcmUoJy4vaXMnKSxcbiAgICBHZW5lcmF0b3I7XG5cbkdlbmVyYXRvciA9IHtcbiAgICBhcnJheUZuTmFtZXM6IFsnZmluZEZpcnN0Tm90JywgJ2ZpbmRBbGxOb3QnLCAnZmluZEZpcnN0JywgJ2ZpbmRBbGwnLFxuICAgICAgICAgICAgJ3JlbW92ZUZpcnN0Tm90JywgJ3JlbW92ZUFsbE5vdCcsICdyZW1vdmVGaXJzdCcsICdyZW1vdmVBbGwnLFxuICAgICAgICAgICAgJ3JlbW92ZUxhc3ROb3QnLCAncmVtb3ZlTGFzdCcsICdmaW5kTGFzdCcsICdmaW5kTGFzdE5vdCdcbiAgICBdLFxuXG4gICAgY3JlYXRlRm46IGZ1bmN0aW9uKGFycmF5Rm5OYW1lLCBmbikge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oYXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gYXJyYXlbYXJyYXlGbk5hbWVdKGFyciwgZm4pO1xuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBjcmVhdGVCb3VuZEZuOiBmdW5jdGlvbihhcnJheUZuTmFtZSwgZm5Ub0JpbmQpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGFyciwgdmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBmbiA9IGZuVG9CaW5kLmFwcGx5KHRoaXMsIGFycmF5LmZyb21JbmRleChhcmd1bWVudHMsIDEpKTtcbiAgICAgICAgICAgIHJldHVybiBhcnJheVthcnJheUZuTmFtZV0oYXJyLCBmbik7XG4gICAgICAgIH07XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBHZW5lcmF0b3I7XG5cbi8qKlxuICogQGNsYXNzIEx1Yy5BcnJheUZuc1xuICogVGhpcyBpcyBkb2N1bWVudGVkIGFzIGEgc2VwYXJhdGUgcGFja2FnZSBidXQgaXQgYWN0dWFsbHkgZXhpc3RzIHVuZGVyIHRoZSBcbiAqIEx1Yy5BcnJheSBuYW1lc3BhY2UuICBDaGVjayBvdXQgdGhlIFwiRmlsdGVyIGNsYXNzIG1lbWJlcnNcIiBpbnB1dCBib3hcbiAqIGp1c3QgdG8gdGhlIHJpZ2h0IHdoZW4gc2VhcmNoaW5nIGZvciBmdW5jdGlvbnMuXG4gKjxicj5cbiAqIFxuICogVGhlcmUgYXJlIGEgbG90IG9mIGZ1bmN0aW9ucyBpbiB0aGlzIHBhY2thZ2UgYnV0IGFsbCBvZiB0aGVtIFxuICogZm9sbG93IHRoZSBzYW1lIGFwaS4gIFxcKkFsbCBmdW5jdGlvbnMgd2lsbCByZXR1cm4gYW4gYXJyYXkgb2YgcmVtb3ZlZCBvciBmb3VuZFxuICogaXRlbXMuICBUaGUgaXRlbXMgd2lsbCBiZSBhZGRlZCB0byB0aGUgYXJyYXkgaW4gdGhlIG9yZGVyIHRoZXkgYXJlXG4gKiBmb3VuZC4gIFxcKkZpcnN0IGZ1bmN0aW9ucyB3aWxsIHJldHVybiB0aGUgZmlyc3QgaXRlbSBhbmQgc3RvcCBpdGVyYXRpbmcgYWZ0ZXIgdGhhdCwgaWYgbm9uZVxuICogIGlzIGZvdW5kIGZhbHNlIGlzIHJldHVybmVkLiAgcmVtb3ZlXFwqIGZ1bmN0aW9ucyB3aWxsIGRpcmVjdGx5IGNoYW5nZSB0aGUgcGFzc2VkIGluIGFycmF5LlxuICogIFxcKk5vdCBmdW5jdGlvbnMgb25seSBkbyB0aGUgZm9sbG93aW5nIGFjdGlvbnMgaWYgdGhlIGNvbXBhcmlzb24gaXMgbm90IHRydWUuXG4gKiAgXFwqTGFzdCBmdW5jdGlvbnMgZG8gdGhlIHNhbWUgYXMgdGhlaXIgXFwqRmlyc3QgY291bnRlcnBhcnRzIGV4Y2VwdCB0aGF0IHRoZSBpdGVyYXRpbmdcbiAqICBzdGFydHMgYXQgdGhlIGVuZCBvZiB0aGUgYXJyYXkuIEFsbW9zdCBldmVyeSBwdWJsaWMgbWV0aG9kIG9mIEx1Yy5pcyBpcyBhdmFpbGFibGUgaXRcbiAqICB1c2VzIHRoZSBmb2xsb3dpbmcgZ3JhbW1hciBMdWMuQXJyYXlbXCJtZXRob2ROYW1lXCJcImlzTWV0aG9kTmFtZVwiXVxuICpcbiAgICAgIEx1Yy5BcnJheS5maW5kQWxsTm90RW1wdHkoW2ZhbHNlLCB0cnVlLCBudWxsLCB1bmRlZmluZWQsIDAsICcnLCBbXSwgWzFdXSlcbiAgICAgID4gW3RydWUsIDAsIFsxXV1cblxuICAgICAgLy9PciByZW1vdmUgYWxsIGVtcHR5IGl0ZW1zXG4gICAgICB2YXIgYXJyID0gWycnLCAwICwgW10sIHthOjF9LCB0cnVlLCB7fSwgWzFdXVxuICAgICAgTHVjLkFycmF5LnJlbW92ZUFsbEVtcHR5KGFycilcbiAgICAgID5bJycsIFtdLCB7fV1cbiAgICAgIGFyclxuICAgICAgPlswLCB7YToxfSwgdHJ1ZSwgWzFdXVxuICAgICBcbiAgICAgIEx1Yy5BcnJheS5maW5kRmlyc3ROb3RTdHJpbmcoWzEsMiwzLCc1J10pXG4gICAgICA+MVxuICAgICAgdmFyIGFyciA9IFsxLDIsMywnNSddO1xuICAgICAgTHVjLkFycmF5LnJlbW92ZUFsbE5vdFN0cmluZyhhcnIpO1xuICAgICAgPlsxLDIsM11cbiAgICAgIGFyclxuICAgICAgPltcIjVcIl1cbiAqXG4gKiBBcyBvZiByaWdodCBub3cgdGhlcmUgYXJlIHR3byBmdW5jdGlvbiBzZXRzIHdoaWNoIGRpZmZlciBmcm9tIHRoZSBpc1xuICogYXBpLlxuICpcbiAqIEluc3RhbmNlT2ZcbiAqIFxuICAgIEx1Yy5BcnJheS5maW5kQWxsSW5zdGFuY2VPZihbMSwyLCBuZXcgRGF0ZSgpLCB7fSwgW11dLCBPYmplY3QpXG4gICAgPltkYXRlLCB7fSwgW11dXG4gICAgPkx1Yy5BcnJheS5maW5kQWxsTm90SW5zdGFuY2VPZihbMSwyLCBuZXcgRGF0ZSgpLCB7fSwgW11dLCBPYmplY3QpXG4gICAgWzEsIDJdXG4gKlxuICogSW5cbiAqIFxuICAgIEx1Yy5BcnJheS5maW5kQWxsSW4oWzEsMiwzXSwgWzEsMl0pXG4gICAgPlsxLCAyXVxuICAgIEx1Yy5BcnJheS5maW5kRmlyc3RJbihbMSwyLDNdLCBbMSwyXSlcbiAgICA+MVxuXG4gICAgLy9kZWZhdWx0cyB0byBsb29zZSBjb21wYXJpc29uXG4gICAgTHVjLkFycmF5LmZpbmRBbGxJbihbMSwyLDMsIHthOjEsIGI6Mn1dLCBbMSx7YToxfV0pXG4gICAgPiBbMSwge2E6MSxiOjJ9XVxuXG4gICAgTHVjLkFycmF5LmZpbmRBbGxJbihbMSwyLDMsIHthOjEsIGI6Mn1dLCBbMSx7YToxfV0sIHt0eXBlOiAnZGVlcCd9KVxuICAgID5bMV1cbiAqL1xuXG4oZnVuY3Rpb24gX2NyZWF0ZUlzRm5zKCkge1xuICAgIHZhciBpc1RvSWdub3JlID0gWydpc1JlZ0V4cCcsICdpc0FyZ3VtZW50cyddO1xuXG4gICAgT2JqZWN0LmtleXMoaXMpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIHZhciBuYW1lID0ga2V5LnNwbGl0KCdpcycpWzFdO1xuICAgICAgICBHZW5lcmF0b3IuYXJyYXlGbk5hbWVzLmZvckVhY2goZnVuY3Rpb24oZm5OYW1lKSB7XG4gICAgICAgICAgICBpZihpc1RvSWdub3JlLmluZGV4T2Yoa2V5KSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICBhcnJheVtmbk5hbWUgKyBuYW1lXSA9IEdlbmVyYXRvci5jcmVhdGVGbihmbk5hbWUsIGlzW2tleV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn0oKSk7XG5cbihmdW5jdGlvbiBfY3JlYXRlRmFsc3lGbnMoKSB7XG4gICAgdmFyIHVzZWZ1bGxGYWxzeUZucyA9IFsnZmluZEZpcnN0Tm90JywgJ2ZpbmRBbGxOb3QnLCAncmVtb3ZlRmlyc3ROb3QnLCAncmVtb3ZlQWxsTm90JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAncmVtb3ZlRmlyc3QnLCAncmVtb3ZlQWxsJywgJ3JlbW92ZUxhc3ROb3QnLCAncmVtb3ZlTGFzdCcsICAnZmluZExhc3ROb3QnXTtcblxuICAgIHZhciBmbnMgPSB7XG4gICAgICAgICdGYWxzZSc6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbCA9PT0gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgICdUcnVlJzogZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsID09PSB0cnVlO1xuICAgICAgICB9LFxuICAgICAgICAnTnVsbCc6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbCA9PT0gbnVsbDtcbiAgICAgICAgfSxcbiAgICAgICAgJ1VuZGVmaW5lZCc6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbCA9PT0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIE9iamVjdC5rZXlzKGZucykuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgdXNlZnVsbEZhbHN5Rm5zLmZvckVhY2goZnVuY3Rpb24oZm5OYW1lKSB7XG4gICAgICAgICAgICBhcnJheVtmbk5hbWUgKyBrZXldID0gR2VuZXJhdG9yLmNyZWF0ZUZuKGZuTmFtZSwgZm5zW2tleV0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0oKSk7XG5cbihmdW5jdGlvbiBfY3JlYXRlQm91bmRGbnMoKSB7XG4gICAgdmFyIGZucyA9IHtcbiAgICAgICAgJ0luc3RhbmNlT2YnOiBmdW5jdGlvbihDb25zdHJ1Y3Rvcikge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICh2YWx1ZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sJ0luJzogZnVuY3Rpb24oYXJyLCBjKSB7XG4gICAgICAgICAgICB2YXIgZGVmYXVsdEMgPSB7dHlwZTonbG9vc2VSaWdodCd9O1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYodmFsdWUgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjZmcgPSBjIHx8IGRlZmF1bHRDO1xuICAgICAgICAgICAgICAgICAgICAvL3RoaXMgaXMgYSByaWdodCB0byBsZWZ0IGNvbXBhcmlzb24gXG4gICAgICAgICAgICAgICAgICAgIC8vZXhwZWN0ZWQgbG9vc2UgYmVoYXZpb3Igc2hvdWxkIGJlIGxvb3NlUmlnaHRcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFycmF5LmZpbmRGaXJzdChhcnIsIHZhbHVlLCBjZmcudHlwZSA9PT0gJ2xvb3NlJyA/IGRlZmF1bHRDIDogY2ZnKSAhPT0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHJldHVybiBhcnIuaW5kZXhPZihmYWxzZSkgPiAtMTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgT2JqZWN0LmtleXMoZm5zKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICBHZW5lcmF0b3IuYXJyYXlGbk5hbWVzLmZvckVhY2goZnVuY3Rpb24oZm5OYW1lKSB7XG4gICAgICAgICAgICBhcnJheVtmbk5hbWUgKyBrZXldID0gR2VuZXJhdG9yLmNyZWF0ZUJvdW5kRm4oZm5OYW1lLCBmbnNba2V5XSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSgpKTsiLCJ2YXIgaXMgPSByZXF1aXJlKCcuL2lzJyk7XG5cbmZ1bmN0aW9uIF9zdHJpY3QodmFsMSwgdmFsMil7XG4gICAgcmV0dXJuIHZhbDEgPT09IHZhbDI7XG59XG5cbmZ1bmN0aW9uIF9jb21wYXJlQXJyYXlMZW5ndGgodmFsMSwgdmFsMikge1xuICAgIHJldHVybihpcy5pc0FycmF5KHZhbDEpICYmIGlzLmlzQXJyYXkodmFsMikgICYmIHZhbDEubGVuZ3RoID09PSB2YWwyLmxlbmd0aCk7XG59XG5cbmZ1bmN0aW9uIF9zaGFsbG93QXJyYXkodmFsMSwgdmFsMikge1xuICAgIHZhciBpID0gMCxcbiAgICAgICAgbGVuO1xuICAgIFxuICAgIGlmKCFfY29tcGFyZUFycmF5TGVuZ3RoKHZhbDEsIHZhbDIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IobGVuID0gdmFsMS5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgICBpZih2YWwxW2ldICE9PSB2YWwyW2ldKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gX2RlZXBBcnJheSh2YWwxLCB2YWwyLCBjb25maWcpIHtcbiAgICB2YXIgaSA9IDAsXG4gICAgICAgIGxlbjtcbiAgICBcbiAgICBpZighX2NvbXBhcmVBcnJheUxlbmd0aCh2YWwxLCB2YWwyKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZm9yKGxlbiA9IHZhbDEubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgaWYoIWNvbXBhcmUodmFsMVtpXSx2YWwyW2ldLCBjb25maWcpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gX2NvbXBhcmVPYmplY3RLZXlzTGVuZ3RoKHZhbDEsIHZhbDIpIHtcbiAgICByZXR1cm4gKGlzLmlzT2JqZWN0KHZhbDEpICYmIGlzLmlzT2JqZWN0KHZhbDIpICYmIE9iamVjdC5rZXlzKHZhbDEpLmxlbmd0aCA9PT0gT2JqZWN0LmtleXModmFsMikubGVuZ3RoKTtcbn1cblxuZnVuY3Rpb24gX3NoYWxsb3dPYmplY3QodmFsMSwgdmFsMikge1xuICAgIHZhciBrZXksIHZhbDtcblxuICAgIGlmICghX2NvbXBhcmVPYmplY3RLZXlzTGVuZ3RoKHZhbDEsIHZhbDIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IgKGtleSBpbiB2YWwxKSB7XG4gICAgICAgIGlmICh2YWwxLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsMVtrZXldO1xuICAgICAgICAgICAgaWYgKCF2YWwyLmhhc093blByb3BlcnR5KGtleSkgfHwgdmFsMltrZXldICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBfZGVlcE9iamVjdCh2YWwxLCB2YWwyLCBjb25maWcpIHtcbiAgICB2YXIga2V5LCB2YWw7XG5cbiAgICBpZiAoIV9jb21wYXJlT2JqZWN0S2V5c0xlbmd0aCh2YWwxLCB2YWwyKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZm9yIChrZXkgaW4gdmFsMSkge1xuICAgICAgICBpZiAodmFsMS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbDFba2V5XTtcbiAgICAgICAgICAgIGlmICghdmFsMi5oYXNPd25Qcm9wZXJ0eShrZXkpIHx8IGNvbXBhcmUodmFsdWUsIHZhbDJba2V5XSwgY29uZmlnKSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuXG59XG5cbmZ1bmN0aW9uIF9sb29zZU9iamVjdCh2YWwxLCB2YWwyLCBjb25maWcpIHtcbiAgICB2YXIga2V5LCB2YWw7XG5cbiAgICBpZighKGlzLmlzT2JqZWN0KHZhbDEpICYmIGlzLmlzT2JqZWN0KHZhbDIpKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYoY29uZmlnLnR5cGUgPT09ICdsb29zZVJpZ2h0Jykge1xuICAgICAgICBmb3IgKGtleSBpbiB2YWwyKSB7XG4gICAgICAgICAgICBpZiAodmFsMi5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB2YWwyW2tleV07XG4gICAgICAgICAgICAgICAgaWYgKGNvbXBhcmUodmFsdWUsIHZhbDFba2V5XSwgY29uZmlnKSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBmb3IgKGtleSBpbiB2YWwxKSB7XG4gICAgICAgICAgICBpZiAodmFsMS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB2YWwxW2tleV07XG4gICAgICAgICAgICAgICAgaWYgKGNvbXBhcmUodmFsdWUsIHZhbDJba2V5XSwgY29uZmlnKSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICByZXR1cm4gdHJ1ZTtcblxufVxuXG5mdW5jdGlvbiBfZGF0ZSh2YWwxLCB2YWwyKSB7XG4gICAgaWYoaXMuaXNEYXRlKHZhbDEpICYmIGlzLmlzRGF0ZSh2YWwyKSkge1xuICAgICAgICByZXR1cm4gdmFsMS5nZXRUaW1lKCkgPT09IHZhbDIuZ2V0VGltZSgpO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gX2NyZWF0ZUJvdW5kQ29tcGFyZShvYmplY3QsIGZuKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBmbihvYmplY3QsIHZhbHVlKTtcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBnZXRDb21wYXJlRm4ob2JqZWN0LCBjKSB7XG4gICAgdmFyIGNvbXBhcmVGbiA9IF9zdHJpY3QsXG4gICAgICAgIGNvbmZpZyA9IGMgfHwge30sXG4gICAgICAgIHR5cGUgPSBjb25maWcudHlwZTtcblxuICAgIGlmICh0eXBlID09PSAnZGVlcCcgfHwgdHlwZSA9PT0gJ2xvb3NlJyB8fCB0eXBlID09PSAnbG9vc2VSaWdodCcgfHwgdHlwZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChpcy5pc09iamVjdChvYmplY3QpKSB7XG4gICAgICAgICAgICBjb21wYXJlRm4gPSB0eXBlID09PSAnbG9vc2UnIHx8IHR5cGUgPT09ICdsb29zZVJpZ2h0JyA/IF9sb29zZU9iamVjdCA6IF9kZWVwT2JqZWN0O1xuICAgICAgICB9IGVsc2UgaWYgKGlzLmlzQXJyYXkob2JqZWN0KSkge1xuICAgICAgICAgICAgY29tcGFyZUZuID0gX2RlZXBBcnJheTtcbiAgICAgICAgfSBlbHNlIGlmIChpcy5pc0RhdGUob2JqZWN0KSkge1xuICAgICAgICAgICAgY29tcGFyZUZuID0gX2RhdGU7XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdzaGFsbG93Jykge1xuICAgICAgICBpZiAoaXMuaXNPYmplY3Qob2JqZWN0KSkge1xuICAgICAgICAgICAgY29tcGFyZUZuID0gX3NoYWxsb3dPYmplY3Q7XG4gICAgICAgIH0gZWxzZSBpZiAoaXMuaXNBcnJheShvYmplY3QpKSB7XG4gICAgICAgICAgICBjb21wYXJlRm4gPSBfc2hhbGxvd0FycmF5O1xuICAgICAgICB9IGVsc2UgaWYgKGlzLmlzRGF0ZShvYmplY3QpKSB7XG4gICAgICAgICAgICBjb21wYXJlRm4gPSBfZGF0ZTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZSAhPT0gJ3N0cmljdCcpIHtcbiAgICAgICAgLy93ZSB3b3VsZCBiZSBkb2luZyBhIHN0cmljdCBjb21wYXJpc29uIG9uIGEgdHlwZS1vXG4gICAgICAgIC8vSSB0aGluayBhbiBlcnJvciBpcyBnb29kIGhlcmUuXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignWW91IHBhc3NlZCBpbiBhbiBpbnZhbGlkIGNvbXBhcmlzb24gdHlwZScpO1xuICAgIH1cblxuICAgIHJldHVybiBjb21wYXJlRm47XG59XG5cbi8qKlxuICogQG1lbWJlciBMdWNcbiAqIEBtZXRob2QgY29tcGFyZVxuICogXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWVzIGFyZSBlcXVhbCB0byBlYWNoXG4gKiBvdGhlci4gIEJ5IGRlZmF1bHQgYSBkZWVwIGNvbXBhcmlzb24gaXMgXG4gKiBkb25lIG9uIGFycmF5cywgZGF0ZXMgYW5kIG9iamVjdHMgYW5kIGEgc3RyaWN0IGNvbXBhcmlzb25cbiAqIGlzIGRvbmUgb24gb3RoZXIgdHlwZXMuXG4gKiBcbiAqIEBwYXJhbSAge0FueX0gdmFsMSAgXG4gKiBAcGFyYW0gIHtBbnl9IHZhbDIgICBcbiAqIEBwYXJhbSAge09iamVjdH0gW2NvbmZpZ11cbiAqIEBwYXJhbSB7U3RyaW5nfSBjb25maWcudHlwZSBwYXNzIGluICdzaGFsbG93JyBmb3IgYSBzaGFsbG93XG4gKiBjb21wYXJpc29uLCAnZGVlcCcgKGRlZmF1bHQpIGZvciBhIGRlZXAgY29tcGFyaXNvblxuICogJ3N0cmljdCcgZm9yIGEgc3RyaWN0ID09PSBjb21wYXJpc29uIGZvciBhbGwgb2JqZWN0cyBvciBcbiAqICdsb29zZScgZm9yIGEgbG9vc2UgY29tcGFyaXNvbiBvbiBvYmplY3RzLiAgQSBsb29zZSBjb21wYXJpc29uXG4gKiAgd2lsbCBjb21wYXJlIHRoZSBrZXlzIGFuZCB2YWx1ZXMgb2YgdmFsMSB0byB2YWwyIGFuZCBkb2VzIG5vdFxuICogIGNoZWNrIGlmIGtleXMgZnJvbSB2YWwyIGFyZSBlcXVhbCB0byB0aGUga2V5cyBpbiB2YWwxLlxuICpcbiAqXG4gICAgTHVjLmNvbXBhcmUoJzEnLCAxKVxuICAgID5mYWxzZVxuICAgIEx1Yy5jb21wYXJlKHthOiAxfSwge2E6IDF9KVxuICAgID50cnVlXG4gICAgTHVjLmNvbXBhcmUoe2E6IDEsIGI6IHt9fSwge2E6IDEsIGI6IHt9IH0sIHt0eXBlOidzaGFsbG93J30pXG4gICAgPmZhbHNlXG4gICAgTHVjLmNvbXBhcmUoe2E6IDEsIGI6IHt9fSwge2E6IDEsIGI6IHt9IH0sIHt0eXBlOiAnZGVlcCd9KVxuICAgID50cnVlXG4gICAgTHVjLmNvbXBhcmUoe2E6IDEsIGI6IHt9fSwge2E6IDEsIGI6IHt9IH0sIHt0eXBlOiAnc3RyaWN0J30pXG4gICAgPmZhbHNlXG4gICAgTHVjLmNvbXBhcmUoe2E6IDF9LCB7YToxLGI6MX0pXG4gICAgPmZhbHNlXG4gICAgTHVjLmNvbXBhcmUoe2E6IDF9LCB7YToxLGI6MX0sIHt0eXBlOiAnbG9vc2UnfSlcbiAgICA+dHJ1ZVxuICAgIEx1Yy5jb21wYXJlKHthOiAxfSwge2E6MSxiOjF9LCB7dHlwZTogJ2xvb3NlJ30pXG4gICAgPnRydWVcbiAgICBMdWMuY29tcGFyZShbe2E6IDF9XSwgW3thOjEsYjoxfV0sIHt0eXBlOiAnbG9vc2UnfSlcbiAgICA+dHJ1ZVxuICAgIEx1Yy5jb21wYXJlKFt7YTogMX0sIHt9XSwgW3thOjEsYjoxfV0sIHt0eXBlOiAnbG9vc2UnfSlcbiAgICA+ZmFsc2VcbiAgICBMdWMuY29tcGFyZShbe2E6IDF9LCB7fV0sIFt7YToxLGI6MX0sIHt9XSwge3R5cGU6ICdsb29zZSd9KVxuICAgID50cnVlXG4gICAgTHVjLmNvbXBhcmUoW3thOjEsYjoxfV0sIFt7YTogMX1dLCB7dHlwZTogJ2xvb3NlJ30pXG4gICAgPmZhbHNlXG5cbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGNvbXBhcmUodmFsMSwgdmFsMiwgY29uZmlnKSB7XG4gICAgcmV0dXJuIGdldENvbXBhcmVGbih2YWwxLCBjb25maWcpKHZhbDEsIHZhbDIsIGNvbmZpZyk7XG59XG5cblxuZnVuY3Rpb24gY3JlYXRlQm91bmRDb21wYXJlRm4ob2JqZWN0LCBjKSB7XG4gICAgdmFyIGNvbXBhcmVGbiA9IGdldENvbXBhcmVGbihvYmplY3QsIGMpO1xuXG4gICAgcmV0dXJuIF9jcmVhdGVCb3VuZENvbXBhcmUob2JqZWN0LCBjb21wYXJlRm4pO1xufVxuXG5leHBvcnRzLmNvbXBhcmUgPSBjb21wYXJlO1xuZXhwb3J0cy5jcmVhdGVCb3VuZENvbXBhcmVGbiA9IGNyZWF0ZUJvdW5kQ29tcGFyZUZuOyIsInZhciBlbXB0eUZuID0gcmVxdWlyZSgnLi4vZnVuY3Rpb24nKS5lbXB0eUZuLFxuICAgIGFwcGx5ID0gcmVxdWlyZSgnLi4vb2JqZWN0JykuYXBwbHk7XG5cbi8qKlxuICogQGNsYXNzIEx1Yy5CYXNlXG4gKiBTaW1wbGUgY2xhc3MgdGhhdCBieSBkZWZhdWx0IHtAbGluayBMdWMjYXBwbHkgYXBwbGllc30gdGhlIFxuICogZmlyc3QgYXJndW1lbnQgdG8gdGhlIGluc3RhbmNlIGFuZCB0aGVuIGNhbGxzXG4gKiBMdWMuQmFzZS5pbml0LlxuICpcbiAgICB2YXIgYiA9IG5ldyBMdWMuQmFzZSh7XG4gICAgICAgIGE6IDEsXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2hleScpXG4gICAgICAgIH1cbiAgICB9KVxuICAgIGIuYVxuICAgID5oZXlcbiAgICA+MVxuICpcbiAqIFdlIGZvdW5kIHRoYXQgbW9zdCBvZiBvdXIgY2xhc3NlcyBkbyB0aGlzIHNvIHdlIG1hZGVcbiAqIGl0IHRoZSBkZWZhdWx0LiAgSGF2aW5nIGEgY29uZmlnIG9iamVjdCBhcyB0aGUgZmlyc3QgYW5kIG9ubHkgXG4gKiBwYXJhbSBrZWVwcyBhIGNsZWFuIGFwaSBhcyB3ZWxsLlxuICpcbiAgICB2YXIgQyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIEx1Yy5BcnJheS5lYWNoKHRoaXMuaXRlbXMsIHRoaXMubG9nSXRlbXMpXG4gICAgICAgIH0sXG5cbiAgICAgICAgbG9nSXRlbXM6IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGl0ZW0pO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB2YXIgYyA9IG5ldyBDKHtpdGVtczogWzEsMiwzXX0pO1xuICAgID4xXG4gICAgPjJcbiAgICA+M1xuICAgIHZhciBkID0gbmV3IEMoe2l0ZW1zOiAnQSd9KTtcbiAgICA+J0EnXG4gICAgdmFyIGUgPSBuZXcgQygpO1xuICpcbiAqIElmIHlvdSBkb24ndCBsaWtlIHRoZSBhcHBseWluZyBvZiB0aGUgY29uZmlnIHRvIHRoZSBpbnN0YW5jZSBpdCBcbiAqIGNhbiBhbHdheXMgYmUgXCJkaXNhYmxlZFwiXG4gKlxuICAgIHZhciBOb0FwcGx5ID0gTHVjLmRlZmluZSh7XG4gICAgICAgIGJlZm9yZUluaXQ6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIH0sXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgTHVjLkFycmF5LmVhY2godGhpcy5pdGVtcywgdGhpcy5sb2dJdGVtcylcbiAgICAgICAgfSxcblxuICAgICAgICBsb2dJdGVtczogZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coaXRlbSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciBjID0gbmV3IE5vQXBwbHkoe2l0ZW1zOiBbMSwyLDNdfSk7XG4gKiBcbiAqL1xuZnVuY3Rpb24gQmFzZSgpIHtcbiAgICB0aGlzLmJlZm9yZUluaXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLmluaXQoKTtcbn1cblxuQmFzZS5wcm90b3R5cGUgPSB7XG4gICAgLyoqXG4gICAgICogQnkgZGVmYXVsdCBhcHBseSB0aGUgY29uZmlnIHRvIHRoZSBcbiAgICAgKiBpbnN0YW5jZS5cbiAgICAgKi9cbiAgICBiZWZvcmVJbml0OiBmdW5jdGlvbihjb25maWcpIHtcbiAgICAgICAgYXBwbHkodGhpcywgY29uZmlnKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEBtZXRob2RcbiAgICAgKiBTaW1wbGUgaG9vayB0byBpbml0aWFsaXplXG4gICAgICogdGhlIGNsYXNzLiAgRGVmYXVsdHMgdG8gTHVjLmVtcHR5Rm5cbiAgICAgKi9cbiAgICBpbml0OiBlbXB0eUZuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhc2U7IiwidmFyIEJhc2UgPSByZXF1aXJlKCcuL2Jhc2UnKSxcbiAgICBDb21wb3NpdGlvbiA9IHJlcXVpcmUoJy4vY29tcG9zaXRpb24nKSxcbiAgICBvYmogPSByZXF1aXJlKCcuLi9vYmplY3QnKSxcbiAgICBhcnJheUZucyA9IHJlcXVpcmUoJy4uL2FycmF5JyksXG4gICAgZW1wdHlGbiA9IHJlcXVpcmUoJy4uL2Z1bmN0aW9uJykuZW1wdHlGbixcbiAgICBpcyA9IHJlcXVpcmUoJy4uL2lzJyksXG4gICAgYUVhY2ggPSBhcnJheUZucy5lYWNoLFxuICAgIGFwcGx5ID0gb2JqLmFwcGx5LFxuICAgIG9FYWNoID0gb2JqLmVhY2gsXG4gICAgb0ZpbHRlciA9IG9iai5maWx0ZXIsXG4gICAgbWl4ID0gb2JqLm1peCxcbiAgICBhcnJheVNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLFxuICAgIENsYXNzRGVmaW5lcjtcblxuLyoqXG4gKiBAY2xhc3MgTHVjLkNsYXNzRGVmaW5lclxuICogQHNpbmdsZXRvblxuICpcbiAqIFNpbmdsZXRvbiB0aGF0IHtAbGluayBMdWMuZGVmaW5lI2RlZmluZSBMdWMuZGVmaW5lfSB1c2VzIHRvIGRlZmluZSBjbGFzc2VzLiAgVGhlIGRlZnVhbHQgdHlwZSBjYW5cbiAqIGJlIGNoYW5nZWQgdG8gYW55IENvbnN0cnVjdG9yXG4gKlxuICAgIGZ1bmN0aW9uIE15Q2xhc3MoKXt9O1xuICAgIEx1Yy5DbGFzc0RlZmluZXIuZGVmYXVsdFR5cGUgPSBNeUNsYXNzO1xuICAgIHZhciBDID0gTHVjLmRlZmluZSgpO1xuICAgIG5ldyBDKCkgaW5zdGFuY2VvZiBMdWMuQmFzZVxuICAgID5mYWxzZVxuICAgIG5ldyBDKCkgaW5zdGFuY2VvZiBNeUNsYXNzXG4gICAgPnRydWVcbiAqL1xuXG4vKipcbiAqIEBjZmcge0Z1bmN0aW9ufSBkZWZhdWx0VHlwZSB0aGlzIGNhbiBiZSBjaGFuZ2VkIHRvIGFueSBDb25zdHJ1Y3Rvci4gIERlZmF1bHRzXG4gKiB0byBMdWMuQmFzZS5cbiAqL1xuXG5DbGFzc0RlZmluZXIgPSB7XG5cbiAgICBDT01QT1NJVElPTlNfTkFNRTogJyRjb21wb3NpdGlvbnMnLFxuXG4gICAgZGVmYXVsdFR5cGU6IEJhc2UsXG5cbiAgICBwcm9jZXNzb3JLZXlzOiB7XG4gICAgICAgICRtaXhpbnM6ICdfYXBwbHlNaXhpbnMnLFxuICAgICAgICAkc3RhdGljczogJ19hcHBseVN0YXRpY3MnLFxuICAgICAgICAkY29tcG9zaXRpb25zOiAnX2FwcGx5Q29tcG9zZXJNZXRob2RzJyxcbiAgICAgICAgJHN1cGVyOiAnX2FwcGx5U3VwZXInXG4gICAgfSxcblxuICAgIGRlZmluZTogZnVuY3Rpb24ob3B0cykge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IG9wdHMgfHwge30sXG4gICAgICAgICAgICAvL2lmIHN1cGVyIGlzIGEgZmFsc3kgdmFsdWUgYmVzaWRlcyB1bmRlZmluZWQgdGhhdCBtZWFucyBubyBzdXBlcmNsYXNzXG4gICAgICAgICAgICBTdXBlciA9IG9wdGlvbnMuJHN1cGVyIHx8IChvcHRpb25zLiRzdXBlciA9PT0gdW5kZWZpbmVkID8gdGhpcy5kZWZhdWx0VHlwZSA6IGZhbHNlKSxcbiAgICAgICAgICAgIENvbnN0cnVjdG9yO1xuXG4gICAgICAgIG9wdGlvbnMuJHN1cGVyID0gU3VwZXI7XG5cbiAgICAgICAgQ29uc3RydWN0b3IgPSB0aGlzLl9jcmVhdGVDb25zdHJ1Y3RvcihvcHRpb25zKTtcblxuICAgICAgICB0aGlzLl9wcm9jZXNzQWZ0ZXJDcmVhdGUoQ29uc3RydWN0b3IsIG9wdGlvbnMpO1xuXG4gICAgICAgIHJldHVybiBDb25zdHJ1Y3RvcjtcbiAgICB9LFxuXG4gICAgX2NyZWF0ZUNvbnN0cnVjdG9yOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHZhciBzdXBlcmNsYXNzID0gb3B0aW9ucy4kc3VwZXIsXG4gICAgICAgICAgICBDb25zdHJ1Y3RvciA9IHRoaXMuX2NyZWF0ZUNvbnN0cnVjdG9yRm4ob3B0aW9ucyk7XG5cbiAgICAgICAgaWYoc3VwZXJjbGFzcykge1xuICAgICAgICAgICAgQ29uc3RydWN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlcmNsYXNzLnByb3RvdHlwZSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBDb25zdHJ1Y3RvcjtcbiAgICB9LFxuXG4gICAgX2NyZWF0ZUNvbnN0cnVjdG9yRm46IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHN1cGVyY2xhc3MgPSBvcHRpb25zLiRzdXBlcixcbiAgICAgICAgICAgIENvbnN0cnVjdG9yO1xuXG4gICAgICAgIGlmICh0aGlzLl9oYXNDb25zdHJ1Y3Rvck1vZGlmeWluZ09wdGlvbnMob3B0aW9ucykpIHtcbiAgICAgICAgICAgIENvbnN0cnVjdG9yID0gdGhpcy5fY3JlYXRlQ29uc3RydWN0b3JGcm9tT3B0aW9ucyhvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKCFzdXBlcmNsYXNzKSB7XG4gICAgICAgICAgICBDb25zdHJ1Y3RvciA9IGZ1bmN0aW9uKCkge307XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBDb25zdHJ1Y3RvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHN1cGVyY2xhc3MuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gQ29uc3RydWN0b3I7XG4gICAgfSxcblxuICAgIF9oYXNDb25zdHJ1Y3Rvck1vZGlmeWluZ09wdGlvbnM6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMuJGNvbXBvc2l0aW9ucztcbiAgICB9LFxuXG4gICAgX2NyZWF0ZUNvbnN0cnVjdG9yRnJvbU9wdGlvbnM6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHN1cGVyY2xhc3MgPSBvcHRpb25zLiRzdXBlcixcbiAgICAgICAgICAgIG1lID0gdGhpcyxcbiAgICAgICAgICAgIGluaXRCZWZvcmVTdXBlcmNsYXNzLFxuICAgICAgICAgICAgaW5pdEFmdGVyU3VwZXJjbGFzcyxcbiAgICAgICAgICAgIGluaXQ7XG5cbiAgICAgICAgaWYgKCFzdXBlcmNsYXNzKSB7XG4gICAgICAgICAgICBpbml0ID0gdGhpcy5fY3JlYXRlSW5pdENsYXNzRm4ob3B0aW9ucywge1xuICAgICAgICAgICAgICAgIGFsbDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXJncyA9IGFycmF5U2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIGluaXQuY2FsbCh0aGlzLCBvcHRpb25zLCBhcmdzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBpbml0QmVmb3JlU3VwZXJjbGFzcyA9IHRoaXMuX2NyZWF0ZUluaXRDbGFzc0ZuKG9wdGlvbnMsIHtcbiAgICAgICAgICAgIGJlZm9yZTogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICBpbml0QWZ0ZXJTdXBlcmNsYXNzID0gdGhpcy5fY3JlYXRlSW5pdENsYXNzRm4ob3B0aW9ucywge1xuICAgICAgICAgICAgYmVmb3JlOiBmYWxzZVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgYXJncyA9IGFycmF5U2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXG4gICAgICAgICAgICBpbml0QmVmb3JlU3VwZXJjbGFzcy5jYWxsKHRoaXMsIG9wdGlvbnMsIGFyZ3MpO1xuICAgICAgICAgICAgc3VwZXJjbGFzcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgaW5pdEFmdGVyU3VwZXJjbGFzcy5jYWxsKHRoaXMsIG9wdGlvbnMsIGFyZ3MpO1xuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBfY3JlYXRlSW5pdENsYXNzRm46IGZ1bmN0aW9uKG9wdGlvbnMsIGNvbmZpZykge1xuICAgICAgICB2YXIgbWUgPSB0aGlzLFxuICAgICAgICAgICAgY29tcG9zaXRpb25zID0gdGhpcy5fZmlsdGVyQ29tcG9zaXRpb25zKGNvbmZpZywgb3B0aW9ucy4kY29tcG9zaXRpb25zKTtcblxuICAgICAgICBpZihjb21wb3NpdGlvbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gZW1wdHlGbjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKG9wdGlvbnMsIGluc3RhbmNlQXJncykge1xuICAgICAgICAgICAgbWUuX2luaXRDb21wb3NpdGlvbnMuY2FsbCh0aGlzLCBjb21wb3NpdGlvbnMsIGluc3RhbmNlQXJncyk7XG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIF9maWx0ZXJDb21wb3NpdGlvbnM6IGZ1bmN0aW9uKGNvbmZpZywgY29tcG9zaXRpb25zKSB7XG4gICAgICAgIHZhciBiZWZvcmUgPSBjb25maWcuYmVmb3JlLCBcbiAgICAgICAgICAgIGZpbHRlcmVkID0gW107XG5cbiAgICAgICAgaWYoY29uZmlnLmFsbCkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbXBvc2l0aW9ucztcbiAgICAgICAgfVxuXG4gICAgICAgIGFFYWNoKGNvbXBvc2l0aW9ucywgZnVuY3Rpb24oY29tcG9zaXRpb24pIHtcbiAgICAgICAgICAgIGlmKGJlZm9yZSAmJiBjb21wb3NpdGlvbi5pbml0QWZ0ZXIgIT09IHRydWUgfHwgKCFiZWZvcmUgJiYgY29tcG9zaXRpb24uaW5pdEFmdGVyID09PSB0cnVlKSkge1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZC5wdXNoKGNvbXBvc2l0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGZpbHRlcmVkO1xuICAgIH0sXG5cbiAgICBfcHJvY2Vzc0FmdGVyQ3JlYXRlOiBmdW5jdGlvbigkY2xhc3MsIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5fYXBwbHlWYWx1ZXNUb1Byb3RvKCRjbGFzcywgb3B0aW9ucyk7XG4gICAgICAgIHRoaXMuX2hhbmRsZVBvc3RQcm9jZXNzb3JzKCRjbGFzcywgb3B0aW9ucyk7XG4gICAgfSxcblxuICAgIF9hcHBseVZhbHVlc1RvUHJvdG86IGZ1bmN0aW9uKCRjbGFzcywgb3B0aW9ucykge1xuICAgICAgICB2YXIgcHJvdG8gPSAkY2xhc3MucHJvdG90eXBlLFxuICAgICAgICAgICAgdmFsdWVzID0gYXBwbHkoe1xuICAgICAgICAgICAgICAgICRjbGFzczogJGNsYXNzXG4gICAgICAgICAgICB9LCBvcHRpb25zKTtcblxuICAgICAgICAvL0Rvbid0IHB1dCB0aGUgZGVmaW5lIHNwZWNpZmljIHByb3BlcnRpZXNcbiAgICAgICAgLy9vbiB0aGUgcHJvdG90eXBlXG4gICAgICAgIG9FYWNoKHZhbHVlcywgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9nZXRQcm9jZXNzb3JLZXkoa2V5KSkge1xuICAgICAgICAgICAgICAgIHByb3RvW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIF9nZXRQcm9jZXNzb3JLZXk6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzb3JLZXlzW2tleV07XG4gICAgfSxcblxuICAgIF9oYW5kbGVQb3N0UHJvY2Vzc29yczogZnVuY3Rpb24oJGNsYXNzLCBvcHRpb25zKSB7XG4gICAgICAgIG9FYWNoKG9wdGlvbnMsIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBtZXRob2QgPSB0aGlzLl9nZXRQcm9jZXNzb3JLZXkoa2V5KTtcblxuICAgICAgICAgICAgaWYgKGlzLmlzRnVuY3Rpb24odGhpc1ttZXRob2RdKSkge1xuICAgICAgICAgICAgICAgIHRoaXNbbWV0aG9kXS5jYWxsKHRoaXMsICRjbGFzcywgb3B0aW9uc1trZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIF9hcHBseU1peGluczogZnVuY3Rpb24oJGNsYXNzLCBtaXhpbnMpIHtcbiAgICAgICAgdmFyIHByb3RvID0gJGNsYXNzLnByb3RvdHlwZTtcbiAgICAgICAgYUVhY2gobWl4aW5zLCBmdW5jdGlvbihtaXhpbikge1xuICAgICAgICAgICAgLy9hY2NlcHQgQ29uc3RydWN0b3JzIG9yIE9iamVjdHNcbiAgICAgICAgICAgIHZhciB0b01peCA9IG1peGluLnByb3RvdHlwZSB8fCBtaXhpbjtcbiAgICAgICAgICAgIG1peChwcm90bywgdG9NaXgpO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgX2FwcGx5U3RhdGljczogZnVuY3Rpb24oJGNsYXNzLCBzdGF0aWNzKSB7XG4gICAgICAgIHZhciBwcm90b3R5cGUgPSAkY2xhc3MucHJvdG90eXBlO1xuXG4gICAgICAgIGFwcGx5KCRjbGFzcywgc3RhdGljcyk7XG5cbiAgICAgICAgaWYocHJvdG90eXBlLmdldFN0YXRpY1ZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHByb3RvdHlwZS5nZXRTdGF0aWNWYWx1ZSA9IHRoaXMuZ2V0U3RhdGljVmFsdWU7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2FwcGx5Q29tcG9zZXJNZXRob2RzOiBmdW5jdGlvbigkY2xhc3MsIGNvbXBvc2l0aW9ucykge1xuICAgICAgICB2YXIgcHJvdG90eXBlID0gJGNsYXNzLnByb3RvdHlwZSxcbiAgICAgICAgICAgIG1ldGhvZHNUb0NvbXBvc2U7XG5cbiAgICAgICAgYUVhY2goY29tcG9zaXRpb25zLCBmdW5jdGlvbihjb21wb3NpdGlvbkNvbmZpZykge1xuICAgICAgICAgICAgdmFyIGNvbXBvc2l0aW9uID0gbmV3IENvbXBvc2l0aW9uKGNvbXBvc2l0aW9uQ29uZmlnKSxcbiAgICAgICAgICAgICAgICBuYW1lID0gY29tcG9zaXRpb24ubmFtZSxcbiAgICAgICAgICAgICAgICBDb25zdHJ1Y3RvciA9IGNvbXBvc2l0aW9uLkNvbnN0cnVjdG9yO1xuXG4gICAgICAgICAgICBjb21wb3NpdGlvbi52YWxpZGF0ZSgpO1xuXG4gICAgICAgICAgICBtZXRob2RzVG9Db21wb3NlID0gY29tcG9zaXRpb24uZ2V0TWV0aG9kc1RvQ29tcG9zZSgpO1xuXG4gICAgICAgICAgICBtZXRob2RzVG9Db21wb3NlLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICAgICAgaWYgKHByb3RvdHlwZVtrZXldID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvdG90eXBlW2tleV0gPSB0aGlzLl9jcmVhdGVDb21wb3NlclByb3RvRm4oa2V5LCBuYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICAgICAgaWYocHJvdG90eXBlLmdldENvbXBvc2l0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBwcm90b3R5cGUuZ2V0Q29tcG9zaXRpb24gPSB0aGlzLmdldENvbXBvc2l0aW9uO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICBfYXBwbHlTdXBlcjogZnVuY3Rpb24oJGNsYXNzLCAkc3VwZXIpIHtcbiAgICAgICAgdmFyIHByb3RvO1xuICAgICAgICAvL3N1cGVyIGNhbiBiZSBmYWxzeSB0byBzaWduaWZ5IG5vIHN1cGVyY2xhc3NcbiAgICAgICAgaWYgKCRzdXBlcikge1xuICAgICAgICAgICAgcHJvdG8gPSAkY2xhc3MucHJvdG90eXBlO1xuICAgICAgICAgICAgcHJvdG8uJHN1cGVyID0gJHN1cGVyO1xuICAgICAgICAgICAgcHJvdG8uJHN1cGVyY2xhc3MgPSAkc3VwZXIucHJvdG90eXBlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9jcmVhdGVDb21wb3NlclByb3RvRm46IGZ1bmN0aW9uKG1ldGhvZE5hbWUsIGNvbXBvc2l0aW9uTmFtZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgY29tcCA9IHRoaXNbQ2xhc3NEZWZpbmVyLkNPTVBPU0lUSU9OU19OQU1FXVtjb21wb3NpdGlvbk5hbWVdO1xuICAgICAgICAgICAgcmV0dXJuIGNvbXBbbWV0aG9kTmFtZV0uYXBwbHkoY29tcCwgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAaWdub3JlXG4gICAgICogb3B0aW9ucyB7T2JqZWN0fSB0aGUgY29tcG9zaXRpb24gY29uZmlnIG9iamVjdFxuICAgICAqIGluc3RhbmNlQXJncyB7QXJyYXl9IHRoZSBhcmd1bWVudHMgcGFzc2VkIHRvIHRoZSBpbnN0YW5jZSdzXG4gICAgICogY29uc3RydWN0b3IuXG4gICAgICovXG4gICAgX2luaXRDb21wb3NpdGlvbnM6IGZ1bmN0aW9uKGNvbXBvc2l0aW9ucywgaW5zdGFuY2VBcmdzKSB7XG4gICAgICAgIGlmKCF0aGlzW0NsYXNzRGVmaW5lci5DT01QT1NJVElPTlNfTkFNRV0pIHtcbiAgICAgICAgICAgIHRoaXNbQ2xhc3NEZWZpbmVyLkNPTVBPU0lUSU9OU19OQU1FXSA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgYUVhY2goY29tcG9zaXRpb25zLCBmdW5jdGlvbihjb21wb3NpdGlvbkNvbmZpZykge1xuICAgICAgICAgICAgdmFyIGNvbmZpZyA9IGFwcGx5KHtcbiAgICAgICAgICAgICAgICBpbnN0YW5jZTogdGhpcyxcbiAgICAgICAgICAgICAgICBpbnN0YW5jZUFyZ3M6IGluc3RhbmNlQXJnc1xuICAgICAgICAgICAgfSwgY29tcG9zaXRpb25Db25maWcpLCBcbiAgICAgICAgICAgIGNvbXBvc2l0aW9uO1xuXG4gICAgICAgICAgICBjb21wb3NpdGlvbiA9IG5ldyBDb21wb3NpdGlvbihjb25maWcpO1xuXG4gICAgICAgICAgICB0aGlzW0NsYXNzRGVmaW5lci5DT01QT1NJVElPTlNfTkFNRV1bY29tcG9zaXRpb24ubmFtZV0gPSBjb21wb3NpdGlvbi5nZXRJbnN0YW5jZSgpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgLy9NZXRob2RzIHRoYXQgY2FuIGdldCBhZGRlZCB0byB0aGUgcHJvdG90eXBlXG4gICAgLy90aGV5IHdpbGwgYmUgY2FsbGVkIGluIHRoZSBjb250ZXh0IG9mIHRoZSBpbnN0YW5jZS5cbiAgICAvL1xuICAgIGdldENvbXBvc2l0aW9uOiBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbQ2xhc3NEZWZpbmVyLkNPTVBPU0lUSU9OU19OQU1FXVtrZXldO1xuICAgIH0sXG5cbiAgICBnZXRTdGF0aWNWYWx1ZTogZnVuY3Rpb24gKGtleSwgJGNsYXNzKSB7XG4gICAgICAgIHZhciBjbGFzc1RvRmluZFZhbHVlID0gJGNsYXNzIHx8IHRoaXMuJGNsYXNzLFxuICAgICAgICAgICAgJHN1cGVyLFxuICAgICAgICAgICAgdmFsdWU7XG5cbiAgICAgICAgdmFsdWUgPSBjbGFzc1RvRmluZFZhbHVlW2tleV07XG5cbiAgICAgICAgaWYodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgJHN1cGVyID0gY2xhc3NUb0ZpbmRWYWx1ZS5wcm90b3R5cGUuJHN1cGVyO1xuICAgICAgICAgICAgaWYoJHN1cGVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0U3RhdGljVmFsdWUoa2V5LCAkc3VwZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxufTtcblxuQ2xhc3NEZWZpbmVyLmRlZmluZSA9IENsYXNzRGVmaW5lci5kZWZpbmUuYmluZChDbGFzc0RlZmluZXIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENsYXNzRGVmaW5lcjtcblxuLyoqXG4gKiBAY2xhc3MgIEx1Yy5kZWZpbmVcbiAqIFRoaXMgaXMgYWN0dWFsbHkgYSBmdW5jdGlvbiBidXQgaGFzIGEgZGVjZW50IGFtb3VudCBvZiBpbXBvcnRhbnQgb3B0aW9uc1xuICogc28gd2UgYXJlIGRvY3VtZW50aW5nIGl0IGxpa2UgaXQgaXMgYSBjbGFzcy4gIFByb3BlcnRpZXMgYXJlIHRoaW5ncyB0aGF0IHdpbGwgZ2V0XG4gKiBhcHBsaWVkIHRvIGluc3RhbmNlcyBvZiBjbGFzc2VzIGRlZmluZWQgd2l0aCB7QGxpbmsgTHVjLmRlZmluZSNkZWZpbmUgZGVmaW5lfS4gIE5vbmVcbiAqIGFyZSBuZWVkZWQgZm9yIHtAbGluayBMdWMuZGVmaW5lI2RlZmluZSBkZWZpbmluZ30gYSBjbGFzcy4gIHtAbGluayBMdWMuZGVmaW5lI2RlZmluZSBkZWZpbmV9XG4gKiBqdXN0IHRha2VzIHRoZSBwYXNzZWQgaW4gY29uZmlnIGFuZCBwdXRzIHRoZSBwcm9wZXJ0aWVzIG9uIHRoZSBwcm90b3R5cGUgYW5kIHJldHVybnNcbiAqIGEgQ29uc3RydWN0b3IuXG4gKlxuXG4gICAgdmFyIEMgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgYTogMSxcbiAgICAgICAgZG9Mb2c6IHRydWUsXG4gICAgICAgIGxvZ0E6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZG9Mb2cpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgdmFyIGMgPSBuZXcgQygpO1xuICAgIGMubG9nQSgpO1xuICAgID4xXG4gICAgYy5hID0gNDU7XG4gICAgYy5sb2dBKCk7XG4gICAgPjQ1XG4gICAgYy5kb0xvZyA9IGZhbHNlO1xuICAgIGMubG9nQSgpO1xuXG4gICAgbmV3IEMoKS5sb2dBKClcbiAgICA+MVxuXG4gKlxuICogQ2hlY2sgb3V0IHRoZSBmb2xsb3dpbmcgY29uZmlncyB0byBhZGQgZnVuY3Rpb25hbGl0eSB0byBhIGNsYXNzIHdpdGhvdXQgbWVzc2luZ1xuICogdXAgdGhlIGluaGVyaXRhbmNlIGNoYWluLiAgQWxsIHRoZSBjb25maWdzIGhhdmUgZXhhbXBsZXMgYW5kIGRvY3VtZW50YXRpb24gb24gXG4gKiBob3cgdG8gdXNlIHRoZW0uXG4gKlxuICoge0BsaW5rIEx1Yy5kZWZpbmUjJHN1cGVyIHN1cGVyfSA8YnI+XG4gKiB7QGxpbmsgTHVjLmRlZmluZSMkY29tcG9zaXRpb25zIGNvbXBvc2l0aW9uc30gPGJyPlxuICoge0BsaW5rIEx1Yy5kZWZpbmUjJG1peGlucyBtaXhpbnN9IDxicj5cbiAqIHtAbGluayBMdWMuZGVmaW5lIyRzdGF0aWNzIHN0YXRpY3N9IDxicj5cbiAqIFxuICogXG4gKi9cblxuLyoqXG4gKiBAbWV0aG9kICBkZWZpbmVcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgY29uZmlnIG9iamVjdCB1c2VkIHdoZW4gY3JlYXRpbmcgdGhlIGNsYXNzLiAgQW55IHByb3BlcnR5IHRoYXRcbiAqIGlzIG5vdCBhcGFydCBvZiB0aGUgc3BlY2lhbCBjb25maWdzIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgcHJvdG90eXBlLiAgQ2hlY2sgb3V0XG4gKiBMdWMuZGVmaW5lIGZvciBhbGwgdGhlIGNvbmZpZyBvcHRpb25zLiAgIE5vIGNvbmZpZ3MgYXJlIG5lZWRlZCB0byBkZWZpbmUgYSBjbGFzcy5cbiAqIFxuICogQHJldHVybiB7RnVuY3Rpb259IHRoZSBkZWZpbmVkIGNsYXNzXG4gKlxuICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgIGxvZ0E6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5hKVxuICAgICAgICB9LFxuICAgICAgICBhOiAxXG4gICAgfSk7XG4gICAgdmFyIGMgPSBuZXcgQygpO1xuICAgIGMubG9nQSgpO1xuICAgID4xXG5cbiAgICBjLmEgPSA0O1xuICAgIGMubG9nQSgpO1xuICAgID40XG4gKlxuICpcbiAqL1xuXG4vKipcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259ICRjbGFzcyByZWZlcmVuY2UgdG8gdGhlIGluc3RhbmNlJ3Mgb3duIGNvbnN0cnVjdG9yLiAgVGhpc1xuICogd2lsbCBnZXQgYWRkZWQgdG8gYW55IGNsYXNzIHRoYXQgaXMgZGVmaW5lZCB3aXRoIEx1Yy5kZWZpbmUuXG4gKiBcbiAgICB2YXIgQyA9IEx1Yy5kZWZpbmUoKVxuICAgIHZhciBjID0gbmV3IEMoKVxuICAgIGMuJGNsYXNzID09PSBDXG4gICAgPnRydWVcbiAqXG4gKiBUaGVyZSBhcmUgc29tZSByZWFsbHkgZ29vZCB1c2UgY2FzZXMgdG8gaGF2ZSBhIHJlZmVyZW5jZSB0byBpdCdzXG4gKiBvd24gY29uc3RydWN0b3IuICA8YnI+IEFkZCBmdW5jdGlvbmFsaXR5IHRvIGFuIGluc3RhbmNlIGluIGEgc2ltcGxlXG4gKiBhbmQgZ2VuZXJpYyB3YXk6XG4gKlxuICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgIGFkZDogZnVuY3Rpb24oYSxiKSB7XG4gICAgICAgICAgICByZXR1cm4gYSArIGI7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vTHVjLkJhc2UgYXBwbGllcyBmaXJzdCBcbiAgICAvL2FyZyB0byB0aGUgaW5zdGFuY2VcblxuICAgIHZhciBjID0gbmV3IEMoe1xuICAgICAgICBhZGQ6IGZ1bmN0aW9uKGEsYixjKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kY2xhc3MucHJvdG90eXBlLmFkZC5jYWxsKHRoaXMsIGEsYikgKyBjO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBjLmFkZCgxLDIsMylcbiAgICA+NlxuICAgIG5ldyBDKCkuYWRkKDEsMiwzKVxuICAgID4zXG4gKlxuICogT3IgaGF2ZSBhIHNpbXBsZSBnZW5lcmljIGNsb25lIG1ldGhvZCA6XG4gKlxuICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgIGNsb25lOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBteU93blByb3BzID0ge307XG4gICAgICAgICAgICBMdWMuT2JqZWN0LmVhY2godGhpcywgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIG15T3duUHJvcHNba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgdGhpcy4kY2xhc3MobXlPd25Qcm9wcyk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciBjID0gbmV3IEMoe2E6MSxiOjIsYzozfSk7XG4gICAgYy5kID0gNDtcbiAgICB2YXIgY2xvbmUgPSBjLmNsb25lKCk7XG5cbiAgICBjbG9uZSA9PT0gY1xuICAgID5mYWxzZVxuXG4gICAgY2xvbmUuYVxuICAgID4xXG4gICAgY2xvbmUuYlxuICAgID4yXG4gICAgY2xvbmUuY1xuICAgID4zXG4gICAgY2xvbmUuZFxuICAgID40XG4gKi9cblxuLyoqXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBbJHN1cGVyXSBJZiAkc3VwZXIgaXMgbm90IGZhbHNlIG9yIG51bGwgXG4gKiB0aGUgJHN1cGVyIHByb3BlcnR5IHdpbGwgYmUgYWRkZWQgdG8gZXZlcnkgaW5zdGFuY2Ugb2YgdGhlIGRlZmluZWQgY2xhc3MsXG4gKiAkc3VwZXIgaXMgdGhlIENvbnN0cnVjdG9yIHBhc3NlZCBpbiB3aXRoIHRoZSAkc3VwZXIgY29uZmlnIG9yIHRoZSB7QGxpbmsgTHVjLkNsYXNzRGVmaW5lciNkZWZhdWx0VHlwZSBkZWZhdWx0fVxuICogXG4gICAgdmFyIEMgPSBMdWMuZGVmaW5lKClcbiAgICB2YXIgYyA9IG5ldyBDKClcbiAgICAvL0x1Yy5CYXNlIGlzIHRoZSBkZWZhdWx0IFxuICAgIGMuJHN1cGVyID09PSBMdWMuQmFzZVxuICAgID50cnVlXG4gKi9cblxuLyoqXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBbJHN1cGVyY2xhc3NdIElmICRzdXBlciBpcyBkZWZpbmVkIGl0XG4gKiB3aWxsIGJlIHRoZSBwcm90b3R5cGUgb2YgJHN1cGVyLiAgSXQgY2FuIGJlIHVzZWQgdG8gY2FsbCBhIHBhcmVudCdzXG4gKiBtZXRob2RcbiAqIFxuICAgIGZ1bmN0aW9uIE15Q29vbENsYXNzKCkge31cbiAgICBNeUNvb2xDbGFzcy5wcm90b3R5cGUuYWRkTnVtcyA9IGZ1bmN0aW9uKGEsYikge1xuICAgICAgICByZXR1cm4gYSArIGI7XG4gICAgfVxuXG4gICAgdmFyIE15T3RoZXJDb29sQ2xhc3MgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgJHN1cGVyOiBNeUNvb2xDbGFzcyxcbiAgICAgICAgYWRkTnVtczogZnVuY3Rpb24oYSwgYiwgYykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuJHN1cGVyY2xhc3MuYWRkTnVtcy5jYWxsKHRoaXMsIGEsIGIpICsgYztcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICB2YXIgbSA9IG5ldyBNeU90aGVyQ29vbENsYXNzKCk7XG4gICAgbS5hZGROdW1zKDEsMiwzKTtcbiAgICA+NlxuICovXG5cbi8qKlxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gZ2V0U3RhdGljVmFsdWUgdGhpcyBtZXRob2RcbiAqIHdpbGwgYmUgYWRkZWQgdG8gaW5zdGFuY2VzIHRoYXQgdXNlIHRoZSB7QGxpbmsgTHVjLmRlZmluZSMkc3RhdGljcyAkc3RhdGljc31cbiAqIGNvbmZpZy5cbiAqXG4gKiBcbiAqIFRoaXMgc2hvdWxkIGJlIHVzZWQgb3ZlciB0aGlzLiRjbGFzcy5zdGF0aWNOYW1lIHRvXG4gKiBnZXQgdGhlIHZhbHVlIG9mIHN0YXRpYy4gIElmIHRoZSBjbGFzcyBnZXRzIGluaGVyaXRlZFxuICogZnJvbSwgdGhpcy4kY2xhc3Mgd2lsbCBub3QgYmUgdGhlIHNhbWUuICBnZXRTdGF0aWMgdmFsdWVcbiAqIGRlYWxzIHdpdGggdGhpcyBpc3N1ZS5cbiAqIFxuICAgIHZhciBBID0gTHVjLmRlZmluZSh7XG4gICAgICAgICRzdGF0aWNzOiB7XG4gICAgICAgICAgICBhOiAxXG4gICAgICAgICAgICB9LFxuICAgICAgICBnZXRBQmV0dGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFN0YXRpY1ZhbHVlKCdhJyk7XG4gICAgICAgIH0sXG4gICAgICAgIGdldEE6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuJGNsYXNzLmE7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciBCID0gTHVjLmRlZmluZSh7XG4gICAgICAgICRzdXBlcjogQSxcbiAgICAgICAgJHN0YXRpY3M6IHtcbiAgICAgICAgICAgIGI6IDIsXG4gICAgICAgICAgICBjOiAzXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIFxuICAgIHZhciBiID0gbmV3IEIoKTtcbiAgICBiLmdldEEoKTtcbiAgICA+dW5kZWZpbmVkXG4gICAgYi5nZXRBQmV0dGVyKCk7XG4gICAgPjFcblxuICogQHJldHVybiB7T2JqZWN0fSB0aGUgc3RhdGljIHZhbHVlIG9mIHRoZSBrZXlcbiAqL1xuXG4gICAgXG4vKipcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGdldENvbXBvc2l0aW9uIHRoaXMgbWV0aG9kIHdpbGwgYmUgYWRkZWRcbiAqIHRvIGluc3RhbmNlcyB0aGF0IHVzZSB0aGUge0BsaW5rIEx1Yy5kZWZpbmUjJGNvbXBvc2l0aW9ucyAkY29tcG9zaXRpb25zfSAgY29uZmlnXG4gKlxuICogIFRoaXMgd2lsbCByZXR1cm4gdGhlIGNvbXBvc2l0aW9uIGluc3RhbmNlIGJhc2VkIG9mZiB0aGUgY29tcG9zaXRpb24ge0BsaW5rIEx1Yy5Db21wb3NpdGlvbiNuYW1lIG5hbWV9XG4gICAgXG4gICAgdGhpcy5nZXRDb21wb3NpdGlvbihcIm5hbWVcIik7XG4gICAgXG4gKlxuICovXG5cblxuLyoqXG4gKiBAY2ZnIHtPYmplY3R9ICRzdGF0aWNzIChvcHRpb25hbCkgQWRkIHN0YXRpYyBwcm9wZXJ0aWVzIG9yIG1ldGhvZHNcbiAqIHRvIHRoZSBjbGFzcy4gIFRoZXNlIHByb3BlcnRpZXMvbWV0aG9kcyB3aWxsIG5vdCBiZSBhYmxlIHRvIGJlXG4gKiBkaXJlY3RseSBtb2RpZmllZCBieSB0aGUgaW5zdGFuY2Ugc28gdGhleSBhcmUgZ29vZCBmb3IgZGVmaW5pbmcgZGVmYXVsdFxuICogY29uZmlncy4gIFVzaW5nIHRoaXMgY29uZmlnIGFkZHMgdGhlIHtAbGluayBMdWMuZGVmaW5lI2dldFN0YXRpY1ZhbHVlIGdldFN0YXRpY1ZhbHVlfVxuICogbWV0aG9kIHRvIGluc3RhbmNlcy5cbiAqXG4gICAgdmFyIEMgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgJHN0YXRpY3M6IHtcbiAgICAgICAgICAgIG51bWJlcjogMVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB2YXIgYyA9IG5ldyBDKCk7XG4gICAgYy5udW1iZXJcbiAgICA+dW5kZWZpbmVkXG4gICAgQy5udW1iZXJcbiAgICA+MVxuICAgIFxuICpcbiAqIEJhZCB0aGluZ3MgY2FuIGhhcHBlbiBpZiBub24gcHJpbWl0aXZlcyBhcmUgcGxhY2VkIG9uIHRoZSBcbiAqIHByb3RvdHlwZSBhbmQgaW5zdGFuY2Ugc2hhcmluZyBpcyBub3Qgd2FudGVkLiAgVXNpbmcgc3RhdGljc1xuICogcHJldmVudCBzdWJjbGFzc2VzIGFuZCBpbnN0YW5jZXMgZnJvbSB1bmtub3dpbmdseSBtb2RpZnlpbmdcbiAqIGFsbCBpbnN0YW5jZXMuXG4gKiBcbiAgICB2YXIgQyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICBjZmc6IHtcbiAgICAgICAgICAgIGE6IDFcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIGMgPSBuZXcgQygpO1xuICAgIGMuY2ZnLmFcbiAgICA+MVxuICAgIGMuY2ZnLmEgPSA1XG4gICAgbmV3IEMoKS5jZmcuYVxuICAgID41XG4gKlxuICovXG5cbi8qKlxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gWyRzdXBlcmNsYXNzXSBJZiAkc3VwZXIgaXMgZGVmaW5lZCBpdFxuICogd2lsbCBiZSB0aGUgcHJvdG90eXBlIG9mICRzdXBlci4gIEl0IGNhbiBiZSB1c2VkIHRvIGNhbGwgcGFyZW50J3NcbiAqIG1ldGhvZFxuICogXG4gICAgZnVuY3Rpb24gTXlDb29sQ2xhc3MoKSB7fVxuICAgIE15Q29vbENsYXNzLnByb3RvdHlwZS5hZGROdW1zID0gZnVuY3Rpb24oYSxiKSB7XG4gICAgICAgIHJldHVybiBhICsgYjtcbiAgICB9XG5cbiAgICB2YXIgTXlPdGhlckNvb2xDbGFzcyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICAkc3VwZXI6IE15Q29vbENsYXNzLFxuICAgICAgICBhZGROdW1zOiBmdW5jdGlvbihhLCBiLCBjKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kc3VwZXJjbGFzcy5hZGROdW1zLmNhbGwodGhpcywgYSwgYikgKyBjO1xuICAgICAgICB9XG4gICAgfSlcblxuICAgIHZhciBtID0gbmV3IE15T3RoZXJDb29sQ2xhc3MoKTtcbiAgICBtLmFkZE51bXMoMSwyLDMpO1xuICAgID42XG4gKi9cblxuLyoqXG4gKiBAY2ZnIHtPYmplY3QvQ29uc3RydWN0b3IvT2JqZWN0W10vQ29uc3RydWN0b3JbXX0gJG1peGlucyAob3B0aW9uYWwpICBNaXhpbnMgYXJlIGEgd2F5IHRvIGFkZCBmdW5jdGlvbmFsaXR5XG4gKiB0byBhIGNsYXNzIHRoYXQgc2hvdWxkIG5vdCBhZGQgc3RhdGUgdG8gdGhlIGluc3RhbmNlIHVua25vd2luZ2x5LiAgTWl4aW5zIGNhbiBiZSBlaXRoZXIgb2JqZWN0cyBvciBDb25zdHJ1Y3RvcnMuXG4gKlxuICAgIGZ1bmN0aW9uIExvZ2dlcigpIHt9XG4gICAgTG9nZ2VyLnByb3RvdHlwZS5sb2cgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc29sZS5sb2coYXJndW1lbnRzKVxuICAgIH1cblxuICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgICRtaXhpbnM6IFtMb2dnZXIsIHtcbiAgICAgICAgICAgIHdhcm46IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2Fybihhcmd1bWVudHMpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1dXG4gICAgfSk7XG5cbiAgICB2YXIgYyA9IG5ldyBDKCk7XG5cbiAgICBjLmxvZygxLDIpXG4gICAgPlsxLDJdXG5cbiAgICBjLndhcm4oMyw0KVxuICAgID5bMyw0XVxuICpcbiAqL1xuLyoqXG4gKiBAY2ZnIHtDb25zdHJ1Y3Rvcn0gJHN1cGVyIChvcHRpb25hbCkgIHN1cGVyIGZvciB0aGUgZGVmaW5pbmcgY2xhc3MuICBCeSBMdWMuQmFzZVxuICogaXMgdGhlIGRlZmF1bHQgaWYgc3VwZXIgaXMgbm90IHBhc3NlZCBpbi4gIFRvIGRlZmluZSBhIGNsYXNzIHdpdGhvdXQgYSBzdXBlcmNsYXNzXG4gKiB5b3UgY2FuIHBhc3MgaW4gZmFsc2Ugb3IgbnVsbC5cbiAqXG4gICAgIGZ1bmN0aW9uIENvdW50ZXIoKSB7XG4gICAgICAgIHRoaXMuY291bnQgPSAwO1xuICAgICB9O1xuXG4gICAgIENvdW50ZXIucHJvdG90eXBlID0ge1xuICAgICAgICBnZXRDb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb3VudDtcbiAgICAgICAgfSxcbiAgICAgICAgaW5jcmVhc2VDb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLmNvdW50Kys7XG4gICAgICAgIH1cbiAgICAgfVxuXG4gICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgICRzdXBlcjpDb3VudGVyXG4gICAgfSk7XG5cbiAgICB2YXIgYyA9IG5ldyBDKClcblxuICAgIGMgaW5zdGFuY2VvZiBDb3VudGVyXG4gICAgPnRydWVcbiAgICBjLmluY3JlYXNlQ291bnQoKTtcbiAgICBjLmdldENvdW50KCk7XG4gICAgPjFcbiAgICBjLmNvdW50XG4gICAgPjFcbiAqXG4gKiBDaGVjayBvdXQgTHVjLkJhc2UgdG8gc2VlIHdoeSB3ZSBoYXZlIGl0IGFzIHRoZSBkZWZhdWx0LlxuICogXG4gICAgdmFyIEIgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgYW1JQUx1Y0Jhc2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBMdWMuQmFzZVxuICAgICAgICB9XG4gICAgfSlcbiAgICB2YXIgYiA9IG5ldyBCKCk7XG4gICAgYi5hbUlBTHVjQmFzZSgpO1xuICAgID50cnVlXG4gKlxuICogXG4gKi9cblxuXG5cbi8qKlxuICogQGNmZyB7T2JqZWN0L09iamVjdFtdfSAkY29tcG9zaXRpb25zIChvcHRpb25hbCkgY29uZmlnIG9iamVjdHMgZm9yIFxuICogTHVjLkNvbXBvc2l0aW9uLiAgQ29tcG9zaXRpb25zIGFyZSBhIGdyZWF0IHdheSB0byBhZGQgYmVoYXZpb3IgdG8gYSBjbGFzc1xuICogd2l0aG91dCBleHRlbmRpbmcgaXQuICBBIHtAbGluayBMdWMuZGVmaW5lIyRtaXhpbnMgbWl4aW59IGNhbiBvZmZlciBzaW1pbGFyIGZ1bmN0aW9uYWxpdHkgYnV0IHNob3VsZFxuICogbm90IGJlIGFkZGluZyBhbiB1bm5lZWRlZCBzdGF0ZS4gIEEgQ29uc3RydWN0b3IgYW5kIGEgbmFtZSBhcmUgbmVlZGVkIGZvciB0aGUgY29uZmlnIG9iamVjdC5cbiAqICBVc2luZyB0aGlzIGNvbmZpZyBhZGRzIHRoZSB7QGxpbmsgTHVjLmRlZmluZSNnZXRDb21wb3NpdGlvbiBnZXRDb21wb3NpdGlvbn1cbiAqIG1ldGhvZCB0byBpbnN0YW5jZXMuXG4gKiA8YnI+XG4gKiBUaGUgbWV0aG9kcyBwcm9wZXJ0eSBpcyBvcHRpb25hbCBoZXJlIGJ1dCBpdCBpcyBzYXlpbmcgdGFrZSBhbGwgb2YgXG4gKiBMdWMuRXZlbnRFbWl0dGVyJ3MgaW5zdGFuY2UgbWV0aG9kcyBhbmQgbWFrZSB0aGVtIGluc3RhbmNlIG1ldGhvZHMgZm9yIEMuXG4gKiBZb3UgY2FuIGNoZWNrIG91dCBhbGwgb2YgdGhlIGNvbmZpZyBvcHRpb25zIGJ5IGxvb2tpbmcgYXQgTHVjLkNvbXBvc2l0aW9uLlxuICogXG4gICAgICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgICAgICAkY29tcG9zaXRpb25zOiB7XG4gICAgICAgICAgICAgICAgQ29uc3RydWN0b3I6IEx1Yy5FdmVudEVtaXR0ZXIsXG4gICAgICAgICAgICAgICAgbmFtZTogJ2VtaXR0ZXInLFxuICAgICAgICAgICAgICAgIG1ldGhvZHM6ICdhbGxNZXRob2RzJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgYyA9IG5ldyBDKCk7XG5cbiAgICAgICAgYy5vbignaGV5JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhhcmd1bWVudHMpO1xuICAgICAgICB9KTtcblxuICAgICAgICBjLmVtaXQoJ2hleScsIDEsMiwzLCAnYScpO1xuICAgICAgICA+WzEsIDIsIDMsIFwiYVwiXVxuICAgICAgICBjIGluc3RhbmNlb2YgTHVjLkV2ZW50RW1pdHRlclxuICAgICAgICA+ZmFsc2VcbiAgICAgICAgYy5fZXZlbnRzXG4gICAgICAgID51bmRlZmluZWRcbiAqXG4gKiBMdWMuRXZlbnRFbWl0dGVyIGlzIHByZWZlcnJlZCBhcyBhIGNvbXBvc2l0aW9uIG92ZXIgYSBtaXhpbiBiZWNhdXNlXG4gKiBpdCBhZGRzIGEgc3RhdGUgXCJfZXZlbnRzXCIgdG8gdGhlIHRoaXMgaW5zdGFuY2Ugd2hlbiBvbiBpcyBjYWxsZWQuICBJdFxuICogYWxzbyBzaG91bGRuJ3QgaGF2ZSB0byBrbm93IHRoYXQgaXQgbWF5IGJlIGluc3RhbnRpYXRlZCBhbG9uZSBvciBtaXhlZCBpbnRvIGNsYXNzZXNcbiAqIHNvIHRoZSBpbml0aW5nIG9mIHN0YXRlIGlzIG5vdCBkb25lIGluIHRoZSBjb25zdHJ1Y3RvciBsaWtlIGl0IHByb2JhYmx5IHNob3VsZC5cbiAqIEl0IGlzIG5vdCB0ZXJyaWJsZSBwcmFjdGljZSBieSBhbnkgbWVhbnMgYnV0IGl0IGlzIG5vdCBnb29kIHRvIGhhdmUgYSBzdGFuZGFsb25lIGNsYXNzXG4gKiB0aGF0IGtub3dzIHRoYXQgaXQgbWF5IGJlIG1peGluLiAgRXZlbiB3b3JzZSB0aGFuIHRoYXQgd291bGQgYmUgYSBtaXhpbiB0aGF0IG5lZWRzXG4gKiB0byBiZSBpbml0ZWQgYnkgdGhlIGRlZmluaW5nIGNsYXNzLiAgRW5jYXBzdWxhdGluZyBsb2dpYyBpbiBhIGNsYXNzXG4gKiBhbmQgdXNpbmcgaXQgYW55d2hlcmUgc2VhbWxlc3NseSBpcyB3aGVyZSBjb21wb3NpdGlvbnMgc2hpbmUuIEx1YyBjb21lcyB3aXRoIHR3byBjb21tb24gXG4gKiB7QGxpbmsgTHVjI2NvbXBvc2l0aW9uRW51bXMgZW51bXN9IHRoYXQgd2UgZXhwZWN0IHdpbGwgYmUgdXNlZCBvZnRlbi5cbiAqIFxuICogPGJyPlxuICogSGVyZSBpcyBhbiBleGFtcGxlIG9mIGEgc2ltcGxlIGNvbXBvc2l0aW9uIHNlZSBob3cgdGhlIGZ1bmN0aW9uYWxpdHkgXG4gKiBpcyBhZGRlZCBidXQgd2UgYXJlIG5vdCBpbmhlcml0aW5nIGFuZCB0aGlzLmNvdW50IGlzXG4gKiB1bmRlZmluZWQuXG4gKlxuICAgICAgICAgZnVuY3Rpb24gQ291bnRlcigpIHtcbiAgICAgICAgICAgIHRoaXMuY291bnQgPSAwO1xuICAgICAgICAgfTtcblxuICAgICAgICAgQ291bnRlci5wcm90b3R5cGUgPSB7XG4gICAgICAgICAgICBnZXRDb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY291bnQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaW5jcmVhc2VDb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb3VudCsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgfVxuXG4gICAgICAgICB2YXIgQyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICAgICAgICAgICRjb21wb3NpdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NvdW50ZXInLFxuICAgICAgICAgICAgICAgICAgICBDb25zdHJ1Y3RvcjogQ291bnRlcixcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kczogJ2FsbE1ldGhvZHMnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgYyA9IG5ldyBDKClcblxuICAgICAgICBjLmluY3JlYXNlQ291bnQoKTtcbiAgICAgICAgYy5pbmNyZWFzZUNvdW50KCk7XG4gICAgICAgIGMuaW5jcmVhc2VDb3VudCgpO1xuICAgICAgICBjLmdldENvdW50KCk7XG4gICAgICAgID4zXG4gICAgICAgIGMuY291bnRcbiAgICAgICAgPnVuZGVmaW5lZFxuICpcbiAqIEx1YyBjb21lcyB3aXRoIHR3byBkZWZhdWx0IGNvbXBvc2l0aW9uIG9iamVjdHMgTHVjLmNvbXBvc2l0aW9uRW51bXMuUGx1Z2luTWFuYWdlclxuICogYW5kIEx1Yy5jb21wb3NpdGlvbkVudW1zLkV2ZW50RW1pdHRlci5cbiAqIFxuICogSGVyZSBpcyB0aGUgcGx1Z2luIG1hbmFnZXIgZW51bSwga2VlcCBpbiBtaW5kIHRoYXQgdGhpc1xuICogZnVuY3Rpb25hbGl0eSBjYW4gYmUgYWRkZWQgdG8gYW55IGNsYXNzLCBub3QganVzdCBvbmVzIGRlZmluZWQgd2l0aCBcbiAqIEx1Yy5kZWZpbmUuICBDaGVjayBvdXQgTHVjLlBsdWdpbk1hbmFnZXIgdG8gc2VlIGFsbCBvZiB0aGUgcHVibGljIFxuICogbWV0aG9kcyB0aGF0IGdldHMgYWRkZWQgdG8gdGhlIGRlZmluZWQgaW5zdGFuY2UuXG4gXG4gKiBBIHBsdWdpbiBmb2xsb3dzIHRoZSBmb2xsb3dpbmcgbGlmZS1jeWNsZTogPGJyPlxuICAgIFxuICpwbHVnaW4gaXMgYWRkZWQgdG8gdGhlIGluc3RhbmNlIC0+IHBsdWdpbiBpcyBjcmVhdGVkIC0+IHBsdWdpbiBpbml0IGlzIGNhbGxlZCB3aXRoIGluc3RhbmNlIC0+IGlmIG5lZWRlZCBkZXN0cm95IGNhbGxlZCBieSBpbnN0YW5jZSAtPiBkZXN0cm95IGNhbGxlZCBvbiBwbHVnaW4gPGJyPlxuICpIZXJlIGlzIHRoZSBtb3N0IGJhc2ljIGV4YW1wbGUgdXNpbmcgdGhlIHtAbGluayBMdWMuUGx1Z2luIGRlZmF1bHR9IHBsdWdpbi5cbiAgIFxuICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgICRjb21wb3NpdGlvbnM6IEx1Yy5jb21wb3NpdGlvbkVudW1zLlBsdWdpbk1hbmFnZXJcbiAgICB9KTtcblxuICAgIHZhciBjID0gbmV3IEMoe1xuICAgICAgICBwbHVnaW5zOiBbe1xuICAgICAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaW0gZ2V0dGluZyBpbml0dGVkJylcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG15Q29vbE5hbWU6ICdjb29sJ1xuICAgICAgICAgICAgfVxuICAgICAgICBdXG4gICAgfSk7XG5cbiAgICA+aW0gZ2V0dGluZyBpbml0dGVkXG5cbiAgICBjLmdldFBsdWdpbih7bXlDb29sTmFtZTogJ2Nvbyd9KSBpbnN0YW5jZW9mIEx1Yy5QbHVnaW5cbiAgICA+IHRydWVcblxuKiAgUGx1Z2lucyBjYW4gYmUgb2YgYW55IGNsYXNzIGFuZCBjYW4gYmUgYWRkZWQgd2l0aCB7QGxpbmsgTHVjLlBsdWdpbk1hbmFnZXIjYWRkUGx1Z2luIGFkZFBsdWdpbn1cblxuICAgIGZ1bmN0aW9uIE15UGx1Z2luKCl7fVxuXG4gICAgdmFyIEMgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgJGNvbXBvc2l0aW9uczogTHVjLmNvbXBvc2l0aW9uRW51bXMuUGx1Z2luTWFuYWdlclxuICAgIH0pO1xuXG4gICAgdmFyIGMgPSBuZXcgQygpO1xuXG4gICAgYy5hZGRQbHVnaW4oe0NvbnN0cnVjdG9yOiBNeVBsdWdpbn0pO1xuICAgIC8vZ2V0UGx1Z2luIHRha2VzIGEgQ29uc3RydWN0b3Igb3IgbWF0Y2ggb2JqZWN0XG4gICAgYy5nZXRQbHVnaW4oTXlQbHVnaW4pIGluc3RhbmNlb2YgTXlQbHVnaW5cbiAgICA+dHJ1ZVxuICAgIGMuZ2V0UGx1Z2luKEx1Yy5QbHVnaW4pXG4gICAgPmZhbHNlXG5cbiogUGx1Z2lucyBjYW4gYWxzbyBiZSBkZXN0cm95ZWQgaW5kaXZpZHVhbGx5IG9yIGFsbCBvZiB0aGVtIGF0IG9uY2VcbiAgICBcbiAgICB2YXIgQyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICAkY29tcG9zaXRpb25zOiBMdWMuY29tcG9zaXRpb25FbnVtcy5QbHVnaW5NYW5hZ2VyXG4gICAgfSk7XG5cbiAgICB2YXIgYyA9IG5ldyBDKHtcbiAgICAgICAgcGx1Z2luczogW3tcbiAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpbSBnZXR0aW5nIGluaXR0ZWQgJyArIHRoaXMubmFtZSlcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkZXN0cm95OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZGVzdHJveWVkIDogJyArIHRoaXMubmFtZSlcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBuYW1lOiAnMSdcbiAgICAgICAgfSx7XG4gICAgICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaW0gZ2V0dGluZyBpbml0dGVkICcgKyB0aGlzLm5hbWUpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGVzdHJveTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Rlc3Ryb3llZCA6ICcgKyB0aGlzLm5hbWUpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbmFtZTogJzInXG4gICAgICAgIH1dXG4gICAgfSk7XG5cbiAgICA+aW0gZ2V0dGluZyBpbml0dGVkIDFcbiAgICA+aW0gZ2V0dGluZyBpbml0dGVkIDJcbiAgICBcblxuICAgIGMuZGVzdHJveVBsdWdpbih7bmFtZTogJzEnfSk7XG4gICAgPmRlc3Ryb3llZCA6IDFcbiAgICAvL2EgcGx1Z2luIGlzIHJldHVybmVkIGlmIGl0IGlzIGZvdW5kIGFuZCBkZXN0cm95ZWRcbiAgICA+UGx1Z2luIHtpbml0OiBmdW5jdGlvbiwgZGVzdHJveTogZnVuY3Rpb24sIG5hbWU6IFwiMVwiLCBvd25lcjogT2JqZWN0LCBpbml0OiBmdW5jdGlvbuKApn1cblxuICAgIGMuZGVzdHJveVBsdWdpbih7bmFtZTogJzEnfSk7XG4gICAgLy9mYWxzZSBpcyByZXR1cm5lZCBpZiBpdCBpcyBub3QgZm91bmRcbiAgICA+ZmFsc2VcblxuICAgIGMuZGVzdHJveUFsbFBsdWdpbnMoKTtcbiAgICA+ZGVzdHJveWVkIDogMlxuICpcbiAqIFlvdSBjYW4gc2VlIHRoYXQgaXQgY2FuIGFkZCBwbHVnaW4gbGlrZSBiZWhhdmlvciB0byBhbnkgZGVmaW5pbmdcbiAqIGNsYXNzIHdpdGggTHVjLlBsdWdpbk1hbmFnZXIgd2hpY2ggaXMgbGVzcyB0aGFuIDc1IFNMT0MuXG4gKi8iLCJ2YXIgYUVhY2ggPSByZXF1aXJlKCcuLi9hcnJheScpLmVhY2gsXG4gICAgb2JqID0gcmVxdWlyZSgnLi4vb2JqZWN0JyksXG4gICAgZW1wdHlGbiA9IHJlcXVpcmUoJy4uL2Z1bmN0aW9uJykuZW1wdHlGbixcbiAgICBhcHBseSA9IG9iai5hcHBseTtcblxuLyoqXG4gKiBAY2xhc3MgTHVjLlBsdWdpblxuICogU2ltcGxlIGNsYXNzIHRoYXQgaXMgdGhlIGRlZmF1bHQgcGx1Z2luIHR5cGUgZm9yIEx1Yy5QbHVnaW5NYW5hZ2VyXG4gKi9cbmZ1bmN0aW9uIFBsdWdpbihjb25maWcpIHtcbiAgICBhcHBseSh0aGlzLCBjb25maWcpO1xufVxuXG5QbHVnaW4ucHJvdG90eXBlID0ge1xuICAgIC8qKlxuICAgICAqIEBtZXRob2RcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3duZXIgdGhlIG93bmVyIGluc3RhbmNlXG4gICAgICogU2ltcGxlIGhvb2sgdG8gaW5pdGlhbGl6ZSB0aGUgcGx1Z2luXG4gICAgICogRGVmYXVsdHMgdG8gTHVjLmVtcHR5Rm4uXG4gICAgICovXG4gICAgaW5pdDogZW1wdHlGbixcbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIFxuICAgICAqIERlZmF1bHRzIHRvIEx1Yy5lbXB0eUZuLlxuICAgICAqIENhbGxlZCB3aGVuIHRoZSBwbHVnaW4gaXMgYmVpbmcge0BsaW5rIEx1Yy5QbHVnaW5NYW5hZ2VyI2Rlc3Ryb3lQbHVnaW4gZGVzdHJveWVkfS5cbiAgICAgKi9cbiAgICBkZXN0cm95OiBlbXB0eUZuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBsdWdpbjtcbiIsInZhciBQbHVnaW4gPSByZXF1aXJlKCcuL3BsdWdpbicpLFxuICAgIGlzID0gcmVxdWlyZSgnLi4vaXMnKSxcbiAgICBvYmogPSByZXF1aXJlKCcuLi9vYmplY3QnKSxcbiAgICBhcnIgPSByZXF1aXJlKCcuLi9hcnJheScpLFxuICAgIGFFYWNoID0gYXJyLmVhY2gsXG4gICAgbWl4ID0gb2JqLm1peCxcbiAgICBhcHBseSA9IG9iai5hcHBseTtcblxuZnVuY3Rpb24gUGx1Z2luTWFuYWdlcihjb25maWcpIHtcbiAgICB0aGlzLl9pbml0KGNvbmZpZyk7XG59XG5cbi8qKlxuICogQHByb3RlY3RlZFxuICogQGNsYXNzIEx1Yy5QbHVnaW5NYW5hZ2VyXG4gKiBUaGlzIGNsYXNzIGlzIHVzZWQgYnkgTHVjLmNvbXBvc2l0aW9uRW51bXMjUGx1Z2luTWFuYWdlciB0byBhZGQgaXRzIGZ1bmN0aW9uYWxpdHkgXG4gKiB0byBhbnkgY2xhc3MuICAgQnkge0BsaW5rIEx1Yy5jb21wb3NpdGlvbkVudW1zI1BsdWdpbk1hbmFnZXIgZGVmYXVsdH0gaXQgYWRkc1xuICogYWxsIG9mIHRoZXNlIHB1YmxpYyBtZXRob2RzIHRvIHRoZSBpbnN0YW5jZS5UaGlzIGNsYXNzIGlzIGRlc2lnbmVkIHRvIHdvcmsgYXMgYSBjb21wb3NpdGlvbiwgXG4gKiBpdCBpcyBleHBvc2VkIGFzIG5vdCBwcml2YXRlIHNvIGl0IGNhbiBiZSBleHRlbmRlZCBpZiBuZWVkZWQuICAgQ2hlY2sgXCJwcm90ZWN0ZWRcIiB3aGljaFxuICogaXMgYSBwYXJ0IG9mIHRoZSBTaG93IHYgZHJvcGRvd24gb24gdGhlIHJpZ2h0IHRvIHNlZSB0aGUgcHJvdGVjdGVkIG1ldGhvZHMuXG4gKlxuICAgIGZ1bmN0aW9uIE15UGx1Z2luKCkge1xuICAgICAgICB0aGlzLm15Q29vbE5hbWUgPSAnY29vJztcblxuICAgICAgICB0aGlzLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpbSBnZXR0aW5nIGluaXR0ZWQnKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdNeVBsdWdpbiBpbnN0YW5jZSBiZWluZyBkZXN0cm95ZWQnKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIEMgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgJGNvbXBvc2l0aW9uczogTHVjLmNvbXBvc2l0aW9uRW51bXMuUGx1Z2luTWFuYWdlclxuICAgIH0pO1xuXG4gICAgdmFyIGMgPSBuZXcgQyh7XG4gICAgICAgIHBsdWdpbnM6IFt7XG4gICAgICAgICAgICAgICAgQ29uc3RydWN0b3I6IE15UGx1Z2luLFxuICAgICAgICAgICAgICAgIG15Q29vbE5hbWU6ICdjb28nXG4gICAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICB9KTtcblxuICAgID5pbSBnZXR0aW5nIGluaXR0ZWRcblxuICAgIHZhciBwbHVnSW5zdGFuY2UgPSBjLmFkZFBsdWdpbih7XG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0ltIGdldHRpbmcgZGVzdHJveWVkJylcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgYy5nZXRQbHVnaW4oTHVjLlBsdWdpbilcbiAgICA+IFBsdWdpbiB7ZGVzdHJveTogZnVuY3Rpb24sIG93bmVyOiBNeUNsYXNzLCBpbml0OiBmdW5jdGlvbiwgZGVzdHJveTogZnVuY3Rpb259XG5cbiAgICBjLmdldFBsdWdpbihNeVBsdWdpbilcbiAgICA+IE15UGx1Z2luIHtteUNvb2xOYW1lOiBcImNvb1wiLCBpbml0OiBmdW5jdGlvbiwgZGVzdHJveTogZnVuY3Rpb259XG5cbiAgICBjLmRlc3Ryb3lBbGxQbHVnaW5zKClcblxuICAgID5NeVBsdWdpbiBpbnN0YW5jZSBiZWluZyBkZXN0cm95ZWRcbiAgICA+SW0gZ2V0dGluZyBkZXN0cm95ZWRcblxuICAgIGMuZ2V0UGx1Z2luKE15UGx1Z2luKVxuICAgID5mYWxzZVxuXG4gKi9cblBsdWdpbk1hbmFnZXIucHJvdG90eXBlID0ge1xuICAgLyoqXG4gICAgKiBAY2ZnIHtDb25zdHJ1Y3Rvcn0gZGVmYXVsdFBsdWdpblxuICAgICovXG4gICAgZGVmYXVsdFBsdWdpbjogUGx1Z2luLFxuXG4gICAgLyoqXG4gICAgICogQHByb3RlY3RlZFxuICAgICAqL1xuICAgIF9pbml0OiBmdW5jdGlvbihpbnN0YW5jZVZhbHVlcykge1xuICAgICAgICBhcHBseSh0aGlzLCBpbnN0YW5jZVZhbHVlcyk7XG4gICAgICAgIHRoaXMucGx1Z2lucyA9IFtdO1xuICAgICAgICB0aGlzLl9jcmVhdGVQbHVnaW5zKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgKi9cbiAgICBfY3JlYXRlUGx1Z2luczogZnVuY3Rpb24oKSB7XG4gICAgICAgIGFFYWNoKHRoaXMuX2dldFBsdWdpbkNvbmZpZ0Zyb21JbnN0YW5jZSgpLCBmdW5jdGlvbihwbHVnaW5Db25maWcpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkUGx1Z2luKHBsdWdpbkNvbmZpZyk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcHJvdGVjdGVkXG4gICAgICovXG4gICAgX2dldFBsdWdpbkNvbmZpZ0Zyb21JbnN0YW5jZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjb25maWcgPSB0aGlzLmluc3RhbmNlQXJnc1swXSB8fCB7fTtcbiAgICAgICAgcmV0dXJuIGNvbmZpZy5wbHVnaW5zO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBwbHVnaW4gdG8gdGhlIGluc3RhbmNlIGFuZCBpbml0IHRoZSBcbiAgICAgKiBwbHVnaW4uXG4gICAgICogQHBhcmFtICB7T2JqZWN0fSBwbHVnaW5Db25maWdcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IHRoZSBjcmVhdGVkIHBsdWdpbiBpbnN0YW5jZVxuICAgICAqL1xuICAgIGFkZFBsdWdpbjogZnVuY3Rpb24ocGx1Z2luQ29uZmlnKSB7XG4gICAgICAgIHZhciBwbHVnaW5JbnN0YW5jZSA9IHRoaXMuX2NyZWF0ZVBsdWdpbihwbHVnaW5Db25maWcpO1xuXG4gICAgICAgIHRoaXMuX2luaXRQbHVnaW4ocGx1Z2luSW5zdGFuY2UpO1xuXG4gICAgICAgIHRoaXMucGx1Z2lucy5wdXNoKHBsdWdpbkluc3RhbmNlKTtcblxuICAgICAgICByZXR1cm4gcGx1Z2luSW5zdGFuY2U7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgKi9cbiAgICBfY3JlYXRlUGx1Z2luOiBmdW5jdGlvbihjb25maWcpIHtcbiAgICAgICAgY29uZmlnLm93bmVyID0gdGhpcy5pbnN0YW5jZTtcblxuICAgICAgICBpZiAoY29uZmlnLkNvbnN0cnVjdG9yKSB7XG4gICAgICAgICAgICAvL2NhbGwgdGhlIGNvbmZpZ2VkIENvbnN0cnVjdG9yIHdpdGggdGhlIFxuICAgICAgICAgICAgLy9wYXNzZWQgaW4gY29uZmlnIGJ1dCB0YWtlIG9mZiB0aGUgQ29uc3RydWN0b3JcbiAgICAgICAgICAgIC8vY29uZmlnLlxuICAgICAgICAgICAgIFxuICAgICAgICAgICAgLy9UaGUgcGx1Z2luIENvbnN0cnVjdG9yIFxuICAgICAgICAgICAgLy9zaG91bGQgbm90IG5lZWQgdG8ga25vdyBhYm91dCBpdHNlbGZcbiAgICAgICAgICAgIHJldHVybiBuZXcgY29uZmlnLkNvbnN0cnVjdG9yKGFwcGx5KGNvbmZpZywge1xuICAgICAgICAgICAgICAgIENvbnN0cnVjdG9yOiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgdGhpcy5kZWZhdWx0UGx1Z2luKGNvbmZpZyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgKi9cbiAgICBfaW5pdFBsdWdpbjogZnVuY3Rpb24ocGx1Z2luKSB7XG4gICAgICAgIGlmIChpcy5pc0Z1bmN0aW9uKHBsdWdpbi5pbml0KSkge1xuICAgICAgICAgICAgcGx1Z2luLmluaXQodGhpcy5pbnN0YW5jZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2FsbCBkZXN0cm95IG9uIGFsbCBvZiB0aGUgcGx1Z2luc1xuICAgICAqIGFuZCByZW1vdmUgdGhlbS5cbiAgICAgKi9cbiAgICBkZXN0cm95QWxsUGx1Z2luczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMucGx1Z2lucy5mb3JFYWNoKGZ1bmN0aW9uKHBsdWdpbikge1xuICAgICAgICAgICAgdGhpcy5fZGVzdHJveVBsdWdpbihwbHVnaW4pO1xuICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICB0aGlzLnBsdWdpbnMgPSBbXTtcbiAgICB9LFxuXG4gICAgX2Rlc3Ryb3lQbHVnaW46IGZ1bmN0aW9uKHBsdWdpbikge1xuICAgICAgICBpZiAoaXMuaXNGdW5jdGlvbihwbHVnaW4uZGVzdHJveSkpIHtcbiAgICAgICAgICAgIHBsdWdpbi5kZXN0cm95KHRoaXMuaW5zdGFuY2UpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSB0aGUgcGx1Z2luIGFuZCBpZiBmb3VuZCBkZXN0cm95IGl0LlxuICAgICAqIEBwYXJhbSAge09iamVjdC9Db25zdHJ1Y3Rvcn0gb2JqZWN0IHRvIHVzZSB0byBtYXRjaCBcbiAgICAgKiB0aGUgcGx1Z2luIHRvIHJlbW92ZS5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IHRoZSBkZXN0cm95ZWQgcGx1Z2luLlxuICAgICAqL1xuICAgIGRlc3Ryb3lQbHVnaW46IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICB2YXIgcGx1Z2luID0gdGhpcy5nZXRQbHVnaW4ob2JqKTtcblxuICAgICAgICBpZihwbHVnaW4pIHtcbiAgICAgICAgICAgIHRoaXMuX2Rlc3Ryb3lQbHVnaW4ocGx1Z2luKTtcbiAgICAgICAgICAgIGFyci5yZW1vdmVGaXJzdCh0aGlzLnBsdWdpbnMsIHBsdWdpbiwge3R5cGU6ICdzdHJpY3QnfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcGx1Z2luO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgYSBwbHVnaW4gaW5zdGFuY2UuICBBIENvbnN0cnVjdG9yIG9yIGFuIG9iamVjdCBjYW4gYmUgdXNlZFxuICAgICAqIHRvIGZpbmQgYSBwbHVnaW4uXG4gICAgICpcbiAgICAgICAgICBjLmFkZFBsdWdpbih7YToxfSlcbiAgICAgICAgICBjLmdldFBsdWdpbih7YToxfSlcbiAgICAgICAgICA+THVjLlBsdWdpbih7YToxfSlcblxuICAgICAqIEBwYXJhbSAge09iamVjdH0gb2JqIFxuICAgICAqIEByZXR1cm4ge09iamVjdH0gdGhlIHBsdWdpbiBpbnN0YW5jZSBpZiBmb3VuZC5cbiAgICAgKi9cbiAgICBnZXRQbHVnaW46IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICBpZiAoaXMuaXNGdW5jdGlvbihvYmopKSB7XG4gICAgICAgICAgICByZXR1cm4gYXJyLmZpbmRGaXJzdEluc3RhbmNlT2YodGhpcy5wbHVnaW5zLCBvYmopO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhcnIuZmluZEZpcnN0KHRoaXMucGx1Z2lucywgb2JqLCB7dHlwZTogJ2xvb3NlJ30pO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUGx1Z2luTWFuYWdlcjsiLCJ2YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnLi4vZXZlbnRzL2V2ZW50RW1pdHRlcicpLFxuICAgIFBsdWdpbk1hbmFnZXIgPSByZXF1aXJlKCcuL3BsdWdpbk1hbmFnZXInKTtcblxuLyoqXG4gKiBAY2xhc3MgTHVjLmNvbXBvc2l0aW9uRW51bXNcbiAqIENvbXBvc2l0aW9uIGVudW1zIGFyZSBqdXN0IGNvbW1vbiBjb25maWcgb2JqZWN0cyBmb3IgTHVjLkNvbXBvc2l0aW9uLlxuICogSGVyZSBpcyBhbiBleGFtcGxlIG9mIGEgY29tcG9zaXRpb24gdGhhdCB1c2VzIEV2ZW50RW1pdHRlciBidXQgb25seVxuICogcHV0cyB0aGUgZW1pdCBtZXRob2Qgb24gdGhlIHByb3RvdHlwZS5cbiAqXG4gICAgdmFyIEMgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgJGNvbXBvc2l0aW9uczoge1xuICAgICAgICAgICAgZGVmYXVsdHM6IEx1Yy5jb21wb3NpdGlvbkVudW1zLkV2ZW50RW1pdHRlcixcbiAgICAgICAgICAgIG1ldGhvZHM6IFsnZW1pdCddXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciBjID0gbmV3IEMoKTtcblxuICAgIHR5cGVvZiBjLmVtaXRcbiAgICA+XCJmdW5jdGlvblwiXG4gICAgdHlwZW9mIGMub25cbiAgICBcInVuZGVmaW5lZFwiXG4gKiBcbiAqL1xuXG4vKipcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBFdmVudEVtaXR0ZXJcbiAqL1xubW9kdWxlLmV4cG9ydHMuRXZlbnRFbWl0dGVyID0ge1xuICAgIENvbnN0cnVjdG9yOiBFdmVudEVtaXR0ZXIsXG4gICAgbmFtZTogJ2VtaXR0ZXInLFxuICAgIG1ldGhvZHM6ICdhbGxNZXRob2RzJ1xufTtcblxuXG4vKipcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBQbHVnaW5NYW5hZ2VyXG4gKi9cbm1vZHVsZS5leHBvcnRzLlBsdWdpbk1hbmFnZXIgPSB7XG4gICAgbmFtZTogJ3BsdWdpbnMnLFxuICAgIGluaXRBZnRlcjogdHJ1ZSxcbiAgICBDb25zdHJ1Y3RvcjogUGx1Z2luTWFuYWdlcixcbiAgICBjcmVhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbWFuYWdlciA9IG5ldyB0aGlzLkNvbnN0cnVjdG9yKHtcbiAgICAgICAgICAgIGluc3RhbmNlOiB0aGlzLmluc3RhbmNlLFxuICAgICAgICAgICAgaW5zdGFuY2VBcmdzOiB0aGlzLmluc3RhbmNlQXJnc1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gbWFuYWdlcjtcbiAgICB9LFxuICAgIGlnbm9yZU1ldGhvZHM6ICdkZWZhdWx0UGx1Z2luJyxcbiAgICBtZXRob2RzOiAncHVibGljTWV0aG9kcydcbn07IiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxucHJvY2Vzcy5uZXh0VGljayA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhblNldEltbWVkaWF0ZSA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnNldEltbWVkaWF0ZTtcbiAgICB2YXIgY2FuUG9zdCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnBvc3RNZXNzYWdlICYmIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyXG4gICAgO1xuXG4gICAgaWYgKGNhblNldEltbWVkaWF0ZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIHdpbmRvdy5zZXRJbW1lZGlhdGUoZikgfTtcbiAgICB9XG5cbiAgICBpZiAoY2FuUG9zdCkge1xuICAgICAgICB2YXIgcXVldWUgPSBbXTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIGlmIChldi5zb3VyY2UgPT09IHdpbmRvdyAmJiBldi5kYXRhID09PSAncHJvY2Vzcy10aWNrJykge1xuICAgICAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGlmIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmbiA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgICAgIHF1ZXVlLnB1c2goZm4pO1xuICAgICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKCdwcm9jZXNzLXRpY2snLCAnKicpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICBzZXRUaW1lb3V0KGZuLCAwKTtcbiAgICB9O1xufSkoKTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufVxuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG4iLCIoZnVuY3Rpb24ocHJvY2Vzcyl7aWYgKCFwcm9jZXNzLkV2ZW50RW1pdHRlcikgcHJvY2Vzcy5FdmVudEVtaXR0ZXIgPSBmdW5jdGlvbiAoKSB7fTtcblxudmFyIEV2ZW50RW1pdHRlciA9IGV4cG9ydHMuRXZlbnRFbWl0dGVyID0gcHJvY2Vzcy5FdmVudEVtaXR0ZXI7XG52YXIgaXNBcnJheSA9IHR5cGVvZiBBcnJheS5pc0FycmF5ID09PSAnZnVuY3Rpb24nXG4gICAgPyBBcnJheS5pc0FycmF5XG4gICAgOiBmdW5jdGlvbiAoeHMpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4cykgPT09ICdbb2JqZWN0IEFycmF5XSdcbiAgICB9XG47XG5mdW5jdGlvbiBpbmRleE9mICh4cywgeCkge1xuICAgIGlmICh4cy5pbmRleE9mKSByZXR1cm4geHMuaW5kZXhPZih4KTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHhzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh4ID09PSB4c1tpXSkgcmV0dXJuIGk7XG4gICAgfVxuICAgIHJldHVybiAtMTtcbn1cblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhblxuLy8gMTAgbGlzdGVuZXJzIGFyZSBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoXG4vLyBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbi8vXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxudmFyIGRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIXRoaXMuX2V2ZW50cykgdGhpcy5fZXZlbnRzID0ge307XG4gIHRoaXMuX2V2ZW50cy5tYXhMaXN0ZW5lcnMgPSBuO1xufTtcblxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc0FycmF5KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKVxuICAgIHtcbiAgICAgIGlmIChhcmd1bWVudHNbMV0gaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBhcmd1bWVudHNbMV07IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmNhdWdodCwgdW5zcGVjaWZpZWQgJ2Vycm9yJyBldmVudC5cIik7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpIHJldHVybiBmYWxzZTtcbiAgdmFyIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGlmICghaGFuZGxlcikgcmV0dXJuIGZhbHNlO1xuXG4gIGlmICh0eXBlb2YgaGFuZGxlciA9PSAnZnVuY3Rpb24nKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG5cbiAgfSBlbHNlIGlmIChpc0FycmF5KGhhbmRsZXIpKSB7XG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gICAgdmFyIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGxpc3RlbmVycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG5cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG5cbi8vIEV2ZW50RW1pdHRlciBpcyBkZWZpbmVkIGluIHNyYy9ub2RlX2V2ZW50cy5jY1xuLy8gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0KCkgaXMgYWxzbyBkZWZpbmVkIHRoZXJlLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICgnZnVuY3Rpb24nICE9PSB0eXBlb2YgbGlzdGVuZXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2FkZExpc3RlbmVyIG9ubHkgdGFrZXMgaW5zdGFuY2VzIG9mIEZ1bmN0aW9uJyk7XG4gIH1cblxuICBpZiAoIXRoaXMuX2V2ZW50cykgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PSBcIm5ld0xpc3RlbmVyc1wiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lcnNcIi5cbiAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSkge1xuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICB9IGVsc2UgaWYgKGlzQXJyYXkodGhpcy5fZXZlbnRzW3R5cGVdKSkge1xuXG4gICAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICAgIHZhciBtO1xuICAgICAgaWYgKHRoaXMuX2V2ZW50cy5tYXhMaXN0ZW5lcnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBtID0gdGhpcy5fZXZlbnRzLm1heExpc3RlbmVycztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG0gPSBkZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgICAgfVxuXG4gICAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICB9IGVsc2Uge1xuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgc2VsZi5vbih0eXBlLCBmdW5jdGlvbiBnKCkge1xuICAgIHNlbGYucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG4gICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCdmdW5jdGlvbicgIT09IHR5cGVvZiBsaXN0ZW5lcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncmVtb3ZlTGlzdGVuZXIgb25seSB0YWtlcyBpbnN0YW5jZXMgb2YgRnVuY3Rpb24nKTtcbiAgfVxuXG4gIC8vIGRvZXMgbm90IHVzZSBsaXN0ZW5lcnMoKSwgc28gbm8gc2lkZSBlZmZlY3Qgb2YgY3JlYXRpbmcgX2V2ZW50c1t0eXBlXVxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKSByZXR1cm4gdGhpcztcblxuICB2YXIgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNBcnJheShsaXN0KSkge1xuICAgIHZhciBpID0gaW5kZXhPZihsaXN0LCBsaXN0ZW5lcik7XG4gICAgaWYgKGkgPCAwKSByZXR1cm4gdGhpcztcbiAgICBsaXN0LnNwbGljZShpLCAxKTtcbiAgICBpZiAobGlzdC5sZW5ndGggPT0gMClcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIH0gZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdID09PSBsaXN0ZW5lcikge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZG9lcyBub3QgdXNlIGxpc3RlbmVycygpLCBzbyBubyBzaWRlIGVmZmVjdCBvZiBjcmVhdGluZyBfZXZlbnRzW3R5cGVdXG4gIGlmICh0eXBlICYmIHRoaXMuX2V2ZW50cyAmJiB0aGlzLl9ldmVudHNbdHlwZV0pIHRoaXMuX2V2ZW50c1t0eXBlXSA9IG51bGw7XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIGlmICghdGhpcy5fZXZlbnRzKSB0aGlzLl9ldmVudHMgPSB7fTtcbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFtdO1xuICBpZiAoIWlzQXJyYXkodGhpcy5fZXZlbnRzW3R5cGVdKSkge1xuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICB9XG4gIHJldHVybiB0aGlzLl9ldmVudHNbdHlwZV07XG59O1xuXG59KShyZXF1aXJlKFwiX19icm93c2VyaWZ5X3Byb2Nlc3NcIikpIiwiKGZ1bmN0aW9uKCl7Ly8gQ29weXJpZ2h0IDIwMDktMjAxMiBieSBjb250cmlidXRvcnMsIE1JVCBMaWNlbnNlXG4vLyB2aW06IHRzPTQgc3RzPTQgc3c9NCBleHBhbmR0YWJcblxuLy8gTW9kdWxlIHN5c3RlbXMgbWFnaWMgZGFuY2VcbihmdW5jdGlvbiAoZGVmaW5pdGlvbikge1xuICAgIC8vIFJlcXVpcmVKU1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBkZWZpbmUoZGVmaW5pdGlvbik7XG4gICAgLy8gWVVJM1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIFlVSSA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgWVVJLmFkZChcImVzNVwiLCBkZWZpbml0aW9uKTtcbiAgICAvLyBDb21tb25KUyBhbmQgPHNjcmlwdD5cbiAgICB9IGVsc2Uge1xuICAgICAgICBkZWZpbml0aW9uKCk7XG4gICAgfVxufSkoZnVuY3Rpb24gKCkge1xuXG4vKipcbiAqIEJyaW5ncyBhbiBlbnZpcm9ubWVudCBhcyBjbG9zZSB0byBFQ01BU2NyaXB0IDUgY29tcGxpYW5jZVxuICogYXMgaXMgcG9zc2libGUgd2l0aCB0aGUgZmFjaWxpdGllcyBvZiBlcnN0d2hpbGUgZW5naW5lcy5cbiAqXG4gKiBBbm5vdGF0ZWQgRVM1OiBodHRwOi8vZXM1LmdpdGh1Yi5jb20vIChzcGVjaWZpYyBsaW5rcyBiZWxvdylcbiAqIEVTNSBTcGVjOiBodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvcHVibGljYXRpb25zL2ZpbGVzL0VDTUEtU1QvRWNtYS0yNjIucGRmXG4gKiBSZXF1aXJlZCByZWFkaW5nOiBodHRwOi8vamF2YXNjcmlwdHdlYmxvZy53b3JkcHJlc3MuY29tLzIwMTEvMTIvMDUvZXh0ZW5kaW5nLWphdmFzY3JpcHQtbmF0aXZlcy9cbiAqL1xuXG4vL1xuLy8gRnVuY3Rpb25cbi8vID09PT09PT09XG4vL1xuXG4vLyBFUy01IDE1LjMuNC41XG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS4zLjQuNVxuXG5mdW5jdGlvbiBFbXB0eSgpIHt9XG5cbmlmICghRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQpIHtcbiAgICBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uIGJpbmQodGhhdCkgeyAvLyAubGVuZ3RoIGlzIDFcbiAgICAgICAgLy8gMS4gTGV0IFRhcmdldCBiZSB0aGUgdGhpcyB2YWx1ZS5cbiAgICAgICAgdmFyIHRhcmdldCA9IHRoaXM7XG4gICAgICAgIC8vIDIuIElmIElzQ2FsbGFibGUoVGFyZ2V0KSBpcyBmYWxzZSwgdGhyb3cgYSBUeXBlRXJyb3IgZXhjZXB0aW9uLlxuICAgICAgICBpZiAodHlwZW9mIHRhcmdldCAhPSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJGdW5jdGlvbi5wcm90b3R5cGUuYmluZCBjYWxsZWQgb24gaW5jb21wYXRpYmxlIFwiICsgdGFyZ2V0KTtcbiAgICAgICAgfVxuICAgICAgICAvLyAzLiBMZXQgQSBiZSBhIG5ldyAocG9zc2libHkgZW1wdHkpIGludGVybmFsIGxpc3Qgb2YgYWxsIG9mIHRoZVxuICAgICAgICAvLyAgIGFyZ3VtZW50IHZhbHVlcyBwcm92aWRlZCBhZnRlciB0aGlzQXJnIChhcmcxLCBhcmcyIGV0YyksIGluIG9yZGVyLlxuICAgICAgICAvLyBYWFggc2xpY2VkQXJncyB3aWxsIHN0YW5kIGluIGZvciBcIkFcIiBpZiB1c2VkXG4gICAgICAgIHZhciBhcmdzID0gX0FycmF5X3NsaWNlXy5jYWxsKGFyZ3VtZW50cywgMSk7IC8vIGZvciBub3JtYWwgY2FsbFxuICAgICAgICAvLyA0LiBMZXQgRiBiZSBhIG5ldyBuYXRpdmUgRUNNQVNjcmlwdCBvYmplY3QuXG4gICAgICAgIC8vIDExLiBTZXQgdGhlIFtbUHJvdG90eXBlXV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgRiB0byB0aGUgc3RhbmRhcmRcbiAgICAgICAgLy8gICBidWlsdC1pbiBGdW5jdGlvbiBwcm90b3R5cGUgb2JqZWN0IGFzIHNwZWNpZmllZCBpbiAxNS4zLjMuMS5cbiAgICAgICAgLy8gMTIuIFNldCB0aGUgW1tDYWxsXV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgRiBhcyBkZXNjcmliZWQgaW5cbiAgICAgICAgLy8gICAxNS4zLjQuNS4xLlxuICAgICAgICAvLyAxMy4gU2V0IHRoZSBbW0NvbnN0cnVjdF1dIGludGVybmFsIHByb3BlcnR5IG9mIEYgYXMgZGVzY3JpYmVkIGluXG4gICAgICAgIC8vICAgMTUuMy40LjUuMi5cbiAgICAgICAgLy8gMTQuIFNldCB0aGUgW1tIYXNJbnN0YW5jZV1dIGludGVybmFsIHByb3BlcnR5IG9mIEYgYXMgZGVzY3JpYmVkIGluXG4gICAgICAgIC8vICAgMTUuMy40LjUuMy5cbiAgICAgICAgdmFyIGJvdW5kID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIGJvdW5kKSB7XG4gICAgICAgICAgICAgICAgLy8gMTUuMy40LjUuMiBbW0NvbnN0cnVjdF1dXG4gICAgICAgICAgICAgICAgLy8gV2hlbiB0aGUgW1tDb25zdHJ1Y3RdXSBpbnRlcm5hbCBtZXRob2Qgb2YgYSBmdW5jdGlvbiBvYmplY3QsXG4gICAgICAgICAgICAgICAgLy8gRiB0aGF0IHdhcyBjcmVhdGVkIHVzaW5nIHRoZSBiaW5kIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aXRoIGFcbiAgICAgICAgICAgICAgICAvLyBsaXN0IG9mIGFyZ3VtZW50cyBFeHRyYUFyZ3MsIHRoZSBmb2xsb3dpbmcgc3RlcHMgYXJlIHRha2VuOlxuICAgICAgICAgICAgICAgIC8vIDEuIExldCB0YXJnZXQgYmUgdGhlIHZhbHVlIG9mIEYncyBbW1RhcmdldEZ1bmN0aW9uXV1cbiAgICAgICAgICAgICAgICAvLyAgIGludGVybmFsIHByb3BlcnR5LlxuICAgICAgICAgICAgICAgIC8vIDIuIElmIHRhcmdldCBoYXMgbm8gW1tDb25zdHJ1Y3RdXSBpbnRlcm5hbCBtZXRob2QsIGFcbiAgICAgICAgICAgICAgICAvLyAgIFR5cGVFcnJvciBleGNlcHRpb24gaXMgdGhyb3duLlxuICAgICAgICAgICAgICAgIC8vIDMuIExldCBib3VuZEFyZ3MgYmUgdGhlIHZhbHVlIG9mIEYncyBbW0JvdW5kQXJnc11dIGludGVybmFsXG4gICAgICAgICAgICAgICAgLy8gICBwcm9wZXJ0eS5cbiAgICAgICAgICAgICAgICAvLyA0LiBMZXQgYXJncyBiZSBhIG5ldyBsaXN0IGNvbnRhaW5pbmcgdGhlIHNhbWUgdmFsdWVzIGFzIHRoZVxuICAgICAgICAgICAgICAgIC8vICAgbGlzdCBib3VuZEFyZ3MgaW4gdGhlIHNhbWUgb3JkZXIgZm9sbG93ZWQgYnkgdGhlIHNhbWVcbiAgICAgICAgICAgICAgICAvLyAgIHZhbHVlcyBhcyB0aGUgbGlzdCBFeHRyYUFyZ3MgaW4gdGhlIHNhbWUgb3JkZXIuXG4gICAgICAgICAgICAgICAgLy8gNS4gUmV0dXJuIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tDb25zdHJ1Y3RdXSBpbnRlcm5hbFxuICAgICAgICAgICAgICAgIC8vICAgbWV0aG9kIG9mIHRhcmdldCBwcm92aWRpbmcgYXJncyBhcyB0aGUgYXJndW1lbnRzLlxuXG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHRhcmdldC5hcHBseShcbiAgICAgICAgICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgICAgICAgICAgYXJncy5jb25jYXQoX0FycmF5X3NsaWNlXy5jYWxsKGFyZ3VtZW50cykpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBpZiAoT2JqZWN0KHJlc3VsdCkgPT09IHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyAxNS4zLjQuNS4xIFtbQ2FsbF1dXG4gICAgICAgICAgICAgICAgLy8gV2hlbiB0aGUgW1tDYWxsXV0gaW50ZXJuYWwgbWV0aG9kIG9mIGEgZnVuY3Rpb24gb2JqZWN0LCBGLFxuICAgICAgICAgICAgICAgIC8vIHdoaWNoIHdhcyBjcmVhdGVkIHVzaW5nIHRoZSBiaW5kIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aXRoIGFcbiAgICAgICAgICAgICAgICAvLyB0aGlzIHZhbHVlIGFuZCBhIGxpc3Qgb2YgYXJndW1lbnRzIEV4dHJhQXJncywgdGhlIGZvbGxvd2luZ1xuICAgICAgICAgICAgICAgIC8vIHN0ZXBzIGFyZSB0YWtlbjpcbiAgICAgICAgICAgICAgICAvLyAxLiBMZXQgYm91bmRBcmdzIGJlIHRoZSB2YWx1ZSBvZiBGJ3MgW1tCb3VuZEFyZ3NdXSBpbnRlcm5hbFxuICAgICAgICAgICAgICAgIC8vICAgcHJvcGVydHkuXG4gICAgICAgICAgICAgICAgLy8gMi4gTGV0IGJvdW5kVGhpcyBiZSB0aGUgdmFsdWUgb2YgRidzIFtbQm91bmRUaGlzXV0gaW50ZXJuYWxcbiAgICAgICAgICAgICAgICAvLyAgIHByb3BlcnR5LlxuICAgICAgICAgICAgICAgIC8vIDMuIExldCB0YXJnZXQgYmUgdGhlIHZhbHVlIG9mIEYncyBbW1RhcmdldEZ1bmN0aW9uXV0gaW50ZXJuYWxcbiAgICAgICAgICAgICAgICAvLyAgIHByb3BlcnR5LlxuICAgICAgICAgICAgICAgIC8vIDQuIExldCBhcmdzIGJlIGEgbmV3IGxpc3QgY29udGFpbmluZyB0aGUgc2FtZSB2YWx1ZXMgYXMgdGhlXG4gICAgICAgICAgICAgICAgLy8gICBsaXN0IGJvdW5kQXJncyBpbiB0aGUgc2FtZSBvcmRlciBmb2xsb3dlZCBieSB0aGUgc2FtZVxuICAgICAgICAgICAgICAgIC8vICAgdmFsdWVzIGFzIHRoZSBsaXN0IEV4dHJhQXJncyBpbiB0aGUgc2FtZSBvcmRlci5cbiAgICAgICAgICAgICAgICAvLyA1LiBSZXR1cm4gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0NhbGxdXSBpbnRlcm5hbCBtZXRob2RcbiAgICAgICAgICAgICAgICAvLyAgIG9mIHRhcmdldCBwcm92aWRpbmcgYm91bmRUaGlzIGFzIHRoZSB0aGlzIHZhbHVlIGFuZFxuICAgICAgICAgICAgICAgIC8vICAgcHJvdmlkaW5nIGFyZ3MgYXMgdGhlIGFyZ3VtZW50cy5cblxuICAgICAgICAgICAgICAgIC8vIGVxdWl2OiB0YXJnZXQuY2FsbCh0aGlzLCAuLi5ib3VuZEFyZ3MsIC4uLmFyZ3MpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldC5hcHBseShcbiAgICAgICAgICAgICAgICAgICAgdGhhdCxcbiAgICAgICAgICAgICAgICAgICAgYXJncy5jb25jYXQoX0FycmF5X3NsaWNlXy5jYWxsKGFyZ3VtZW50cykpXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH07XG4gICAgICAgIGlmKHRhcmdldC5wcm90b3R5cGUpIHtcbiAgICAgICAgICAgIEVtcHR5LnByb3RvdHlwZSA9IHRhcmdldC5wcm90b3R5cGU7XG4gICAgICAgICAgICBib3VuZC5wcm90b3R5cGUgPSBuZXcgRW1wdHkoKTtcbiAgICAgICAgICAgIC8vIENsZWFuIHVwIGRhbmdsaW5nIHJlZmVyZW5jZXMuXG4gICAgICAgICAgICBFbXB0eS5wcm90b3R5cGUgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIC8vIFhYWCBib3VuZC5sZW5ndGggaXMgbmV2ZXIgd3JpdGFibGUsIHNvIGRvbid0IGV2ZW4gdHJ5XG4gICAgICAgIC8vXG4gICAgICAgIC8vIDE1LiBJZiB0aGUgW1tDbGFzc11dIGludGVybmFsIHByb3BlcnR5IG9mIFRhcmdldCBpcyBcIkZ1bmN0aW9uXCIsIHRoZW5cbiAgICAgICAgLy8gICAgIGEuIExldCBMIGJlIHRoZSBsZW5ndGggcHJvcGVydHkgb2YgVGFyZ2V0IG1pbnVzIHRoZSBsZW5ndGggb2YgQS5cbiAgICAgICAgLy8gICAgIGIuIFNldCB0aGUgbGVuZ3RoIG93biBwcm9wZXJ0eSBvZiBGIHRvIGVpdGhlciAwIG9yIEwsIHdoaWNoZXZlciBpc1xuICAgICAgICAvLyAgICAgICBsYXJnZXIuXG4gICAgICAgIC8vIDE2LiBFbHNlIHNldCB0aGUgbGVuZ3RoIG93biBwcm9wZXJ0eSBvZiBGIHRvIDAuXG4gICAgICAgIC8vIDE3LiBTZXQgdGhlIGF0dHJpYnV0ZXMgb2YgdGhlIGxlbmd0aCBvd24gcHJvcGVydHkgb2YgRiB0byB0aGUgdmFsdWVzXG4gICAgICAgIC8vICAgc3BlY2lmaWVkIGluIDE1LjMuNS4xLlxuXG4gICAgICAgIC8vIFRPRE9cbiAgICAgICAgLy8gMTguIFNldCB0aGUgW1tFeHRlbnNpYmxlXV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgRiB0byB0cnVlLlxuXG4gICAgICAgIC8vIFRPRE9cbiAgICAgICAgLy8gMTkuIExldCB0aHJvd2VyIGJlIHRoZSBbW1Rocm93VHlwZUVycm9yXV0gZnVuY3Rpb24gT2JqZWN0ICgxMy4yLjMpLlxuICAgICAgICAvLyAyMC4gQ2FsbCB0aGUgW1tEZWZpbmVPd25Qcm9wZXJ0eV1dIGludGVybmFsIG1ldGhvZCBvZiBGIHdpdGhcbiAgICAgICAgLy8gICBhcmd1bWVudHMgXCJjYWxsZXJcIiwgUHJvcGVydHlEZXNjcmlwdG9yIHtbW0dldF1dOiB0aHJvd2VyLCBbW1NldF1dOlxuICAgICAgICAvLyAgIHRocm93ZXIsIFtbRW51bWVyYWJsZV1dOiBmYWxzZSwgW1tDb25maWd1cmFibGVdXTogZmFsc2V9LCBhbmRcbiAgICAgICAgLy8gICBmYWxzZS5cbiAgICAgICAgLy8gMjEuIENhbGwgdGhlIFtbRGVmaW5lT3duUHJvcGVydHldXSBpbnRlcm5hbCBtZXRob2Qgb2YgRiB3aXRoXG4gICAgICAgIC8vICAgYXJndW1lbnRzIFwiYXJndW1lbnRzXCIsIFByb3BlcnR5RGVzY3JpcHRvciB7W1tHZXRdXTogdGhyb3dlcixcbiAgICAgICAgLy8gICBbW1NldF1dOiB0aHJvd2VyLCBbW0VudW1lcmFibGVdXTogZmFsc2UsIFtbQ29uZmlndXJhYmxlXV06IGZhbHNlfSxcbiAgICAgICAgLy8gICBhbmQgZmFsc2UuXG5cbiAgICAgICAgLy8gVE9ET1xuICAgICAgICAvLyBOT1RFIEZ1bmN0aW9uIG9iamVjdHMgY3JlYXRlZCB1c2luZyBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCBkbyBub3RcbiAgICAgICAgLy8gaGF2ZSBhIHByb3RvdHlwZSBwcm9wZXJ0eSBvciB0aGUgW1tDb2RlXV0sIFtbRm9ybWFsUGFyYW1ldGVyc11dLCBhbmRcbiAgICAgICAgLy8gW1tTY29wZV1dIGludGVybmFsIHByb3BlcnRpZXMuXG4gICAgICAgIC8vIFhYWCBjYW4ndCBkZWxldGUgcHJvdG90eXBlIGluIHB1cmUtanMuXG5cbiAgICAgICAgLy8gMjIuIFJldHVybiBGLlxuICAgICAgICByZXR1cm4gYm91bmQ7XG4gICAgfTtcbn1cblxuLy8gU2hvcnRjdXQgdG8gYW4gb2Z0ZW4gYWNjZXNzZWQgcHJvcGVydGllcywgaW4gb3JkZXIgdG8gYXZvaWQgbXVsdGlwbGVcbi8vIGRlcmVmZXJlbmNlIHRoYXQgY29zdHMgdW5pdmVyc2FsbHkuXG4vLyBfUGxlYXNlIG5vdGU6IFNob3J0Y3V0cyBhcmUgZGVmaW5lZCBhZnRlciBgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmRgIGFzIHdlXG4vLyB1cyBpdCBpbiBkZWZpbmluZyBzaG9ydGN1dHMuXG52YXIgY2FsbCA9IEZ1bmN0aW9uLnByb3RvdHlwZS5jYWxsO1xudmFyIHByb3RvdHlwZU9mQXJyYXkgPSBBcnJheS5wcm90b3R5cGU7XG52YXIgcHJvdG90eXBlT2ZPYmplY3QgPSBPYmplY3QucHJvdG90eXBlO1xudmFyIF9BcnJheV9zbGljZV8gPSBwcm90b3R5cGVPZkFycmF5LnNsaWNlO1xuLy8gSGF2aW5nIGEgdG9TdHJpbmcgbG9jYWwgdmFyaWFibGUgbmFtZSBicmVha3MgaW4gT3BlcmEgc28gdXNlIF90b1N0cmluZy5cbnZhciBfdG9TdHJpbmcgPSBjYWxsLmJpbmQocHJvdG90eXBlT2ZPYmplY3QudG9TdHJpbmcpO1xudmFyIG93bnMgPSBjYWxsLmJpbmQocHJvdG90eXBlT2ZPYmplY3QuaGFzT3duUHJvcGVydHkpO1xuXG4vLyBJZiBKUyBlbmdpbmUgc3VwcG9ydHMgYWNjZXNzb3JzIGNyZWF0aW5nIHNob3J0Y3V0cy5cbnZhciBkZWZpbmVHZXR0ZXI7XG52YXIgZGVmaW5lU2V0dGVyO1xudmFyIGxvb2t1cEdldHRlcjtcbnZhciBsb29rdXBTZXR0ZXI7XG52YXIgc3VwcG9ydHNBY2Nlc3NvcnM7XG5pZiAoKHN1cHBvcnRzQWNjZXNzb3JzID0gb3ducyhwcm90b3R5cGVPZk9iamVjdCwgXCJfX2RlZmluZUdldHRlcl9fXCIpKSkge1xuICAgIGRlZmluZUdldHRlciA9IGNhbGwuYmluZChwcm90b3R5cGVPZk9iamVjdC5fX2RlZmluZUdldHRlcl9fKTtcbiAgICBkZWZpbmVTZXR0ZXIgPSBjYWxsLmJpbmQocHJvdG90eXBlT2ZPYmplY3QuX19kZWZpbmVTZXR0ZXJfXyk7XG4gICAgbG9va3VwR2V0dGVyID0gY2FsbC5iaW5kKHByb3RvdHlwZU9mT2JqZWN0Ll9fbG9va3VwR2V0dGVyX18pO1xuICAgIGxvb2t1cFNldHRlciA9IGNhbGwuYmluZChwcm90b3R5cGVPZk9iamVjdC5fX2xvb2t1cFNldHRlcl9fKTtcbn1cblxuLy9cbi8vIEFycmF5XG4vLyA9PT09PVxuLy9cblxuLy8gRVM1IDE1LjQuNC4xMlxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNC40LjEyXG4vLyBEZWZhdWx0IHZhbHVlIGZvciBzZWNvbmQgcGFyYW1cbi8vIFtidWdmaXgsIGllbHQ5LCBvbGQgYnJvd3NlcnNdXG4vLyBJRSA8IDkgYnVnOiBbMSwyXS5zcGxpY2UoMCkuam9pbihcIlwiKSA9PSBcIlwiIGJ1dCBzaG91bGQgYmUgXCIxMlwiXG5pZiAoWzEsMl0uc3BsaWNlKDApLmxlbmd0aCAhPSAyKSB7XG4gICAgdmFyIGFycmF5X3NwbGljZSA9IEFycmF5LnByb3RvdHlwZS5zcGxpY2U7XG5cbiAgICBpZihmdW5jdGlvbigpIHsgLy8gdGVzdCBJRSA8IDkgdG8gc3BsaWNlIGJ1ZyAtIHNlZSBpc3N1ZSAjMTM4XG4gICAgICAgIGZ1bmN0aW9uIG1ha2VBcnJheShsKSB7XG4gICAgICAgICAgICB2YXIgYSA9IFtdO1xuICAgICAgICAgICAgd2hpbGUgKGwtLSkge1xuICAgICAgICAgICAgICAgIGEudW5zaGlmdChsKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGFcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBhcnJheSA9IFtdXG4gICAgICAgICAgICAsIGxlbmd0aEJlZm9yZVxuICAgICAgICA7XG5cbiAgICAgICAgYXJyYXkuc3BsaWNlLmJpbmQoYXJyYXksIDAsIDApLmFwcGx5KG51bGwsIG1ha2VBcnJheSgyMCkpO1xuICAgICAgICBhcnJheS5zcGxpY2UuYmluZChhcnJheSwgMCwgMCkuYXBwbHkobnVsbCwgbWFrZUFycmF5KDI2KSk7XG5cbiAgICAgICAgbGVuZ3RoQmVmb3JlID0gYXJyYXkubGVuZ3RoOyAvLzIwXG4gICAgICAgIGFycmF5LnNwbGljZSg1LCAwLCBcIlhYWFwiKTsgLy8gYWRkIG9uZSBlbGVtZW50XG5cbiAgICAgICAgaWYobGVuZ3RoQmVmb3JlICsgMSA9PSBhcnJheS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlOy8vIGhhcyByaWdodCBzcGxpY2UgaW1wbGVtZW50YXRpb24gd2l0aG91dCBidWdzXG4gICAgICAgIH1cbiAgICAgICAgLy8gZWxzZSB7XG4gICAgICAgIC8vICAgIElFOCBidWdcbiAgICAgICAgLy8gfVxuICAgIH0oKSkgey8vSUUgNi83XG4gICAgICAgIEFycmF5LnByb3RvdHlwZS5zcGxpY2UgPSBmdW5jdGlvbihzdGFydCwgZGVsZXRlQ291bnQpIHtcbiAgICAgICAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFycmF5X3NwbGljZS5hcHBseSh0aGlzLCBbXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0ID09PSB2b2lkIDAgPyAwIDogc3RhcnQsXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZUNvdW50ID09PSB2b2lkIDAgPyAodGhpcy5sZW5ndGggLSBzdGFydCkgOiBkZWxldGVDb3VudFxuICAgICAgICAgICAgICAgIF0uY29uY2F0KF9BcnJheV9zbGljZV8uY2FsbChhcmd1bWVudHMsIDIpKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgZWxzZSB7Ly9JRThcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnNwbGljZSA9IGZ1bmN0aW9uKHN0YXJ0LCBkZWxldGVDb3VudCkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdFxuICAgICAgICAgICAgICAgICwgYXJncyA9IF9BcnJheV9zbGljZV8uY2FsbChhcmd1bWVudHMsIDIpXG4gICAgICAgICAgICAgICAgLCBhZGRFbGVtZW50c0NvdW50ID0gYXJncy5sZW5ndGhcbiAgICAgICAgICAgIDtcblxuICAgICAgICAgICAgaWYoIWFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHN0YXJ0ID09PSB2b2lkIDApIHsgLy8gZGVmYXVsdFxuICAgICAgICAgICAgICAgIHN0YXJ0ID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKGRlbGV0ZUNvdW50ID09PSB2b2lkIDApIHsgLy8gZGVmYXVsdFxuICAgICAgICAgICAgICAgIGRlbGV0ZUNvdW50ID0gdGhpcy5sZW5ndGggLSBzdGFydDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoYWRkRWxlbWVudHNDb3VudCA+IDApIHtcbiAgICAgICAgICAgICAgICBpZihkZWxldGVDb3VudCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKHN0YXJ0ID09IHRoaXMubGVuZ3RoKSB7IC8vIHRpbnkgb3B0aW1pc2F0aW9uICMxXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnB1c2guYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZihzdGFydCA9PSAwKSB7IC8vIHRpbnkgb3B0aW1pc2F0aW9uICMyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVuc2hpZnQuYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBBcnJheS5wcm90b3R5cGUuc3BsaWNlIGltcGxlbWVudGF0aW9uXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gX0FycmF5X3NsaWNlXy5jYWxsKHRoaXMsIHN0YXJ0LCBzdGFydCArIGRlbGV0ZUNvdW50KTsvLyBkZWxldGUgcGFydFxuICAgICAgICAgICAgICAgIGFyZ3MucHVzaC5hcHBseShhcmdzLCBfQXJyYXlfc2xpY2VfLmNhbGwodGhpcywgc3RhcnQgKyBkZWxldGVDb3VudCwgdGhpcy5sZW5ndGgpKTsvLyByaWdodCBwYXJ0XG4gICAgICAgICAgICAgICAgYXJncy51bnNoaWZ0LmFwcGx5KGFyZ3MsIF9BcnJheV9zbGljZV8uY2FsbCh0aGlzLCAwLCBzdGFydCkpOy8vIGxlZnQgcGFydFxuXG4gICAgICAgICAgICAgICAgLy8gZGVsZXRlIGFsbCBpdGVtcyBmcm9tIHRoaXMgYXJyYXkgYW5kIHJlcGxhY2UgaXQgdG8gJ2xlZnQgcGFydCcgKyBfQXJyYXlfc2xpY2VfLmNhbGwoYXJndW1lbnRzLCAyKSArICdyaWdodCBwYXJ0J1xuICAgICAgICAgICAgICAgIGFyZ3MudW5zaGlmdCgwLCB0aGlzLmxlbmd0aCk7XG5cbiAgICAgICAgICAgICAgICBhcnJheV9zcGxpY2UuYXBwbHkodGhpcywgYXJncyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gYXJyYXlfc3BsaWNlLmNhbGwodGhpcywgc3RhcnQsIGRlbGV0ZUNvdW50KTtcbiAgICAgICAgfVxuXG4gICAgfVxufVxuXG4vLyBFUzUgMTUuNC40LjEyXG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS40LjQuMTNcbi8vIFJldHVybiBsZW4rYXJnQ291bnQuXG4vLyBbYnVnZml4LCBpZWx0OF1cbi8vIElFIDwgOCBidWc6IFtdLnVuc2hpZnQoMCkgPT0gdW5kZWZpbmVkIGJ1dCBzaG91bGQgYmUgXCIxXCJcbmlmIChbXS51bnNoaWZ0KDApICE9IDEpIHtcbiAgICB2YXIgYXJyYXlfdW5zaGlmdCA9IEFycmF5LnByb3RvdHlwZS51bnNoaWZ0O1xuICAgIEFycmF5LnByb3RvdHlwZS51bnNoaWZ0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGFycmF5X3Vuc2hpZnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIHRoaXMubGVuZ3RoO1xuICAgIH07XG59XG5cbi8vIEVTNSAxNS40LjMuMlxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNC4zLjJcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L2lzQXJyYXlcbmlmICghQXJyYXkuaXNBcnJheSkge1xuICAgIEFycmF5LmlzQXJyYXkgPSBmdW5jdGlvbiBpc0FycmF5KG9iaikge1xuICAgICAgICByZXR1cm4gX3RvU3RyaW5nKG9iaikgPT0gXCJbb2JqZWN0IEFycmF5XVwiO1xuICAgIH07XG59XG5cbi8vIFRoZSBJc0NhbGxhYmxlKCkgY2hlY2sgaW4gdGhlIEFycmF5IGZ1bmN0aW9uc1xuLy8gaGFzIGJlZW4gcmVwbGFjZWQgd2l0aCBhIHN0cmljdCBjaGVjayBvbiB0aGVcbi8vIGludGVybmFsIGNsYXNzIG9mIHRoZSBvYmplY3QgdG8gdHJhcCBjYXNlcyB3aGVyZVxuLy8gdGhlIHByb3ZpZGVkIGZ1bmN0aW9uIHdhcyBhY3R1YWxseSBhIHJlZ3VsYXJcbi8vIGV4cHJlc3Npb24gbGl0ZXJhbCwgd2hpY2ggaW4gVjggYW5kXG4vLyBKYXZhU2NyaXB0Q29yZSBpcyBhIHR5cGVvZiBcImZ1bmN0aW9uXCIuICBPbmx5IGluXG4vLyBWOCBhcmUgcmVndWxhciBleHByZXNzaW9uIGxpdGVyYWxzIHBlcm1pdHRlZCBhc1xuLy8gcmVkdWNlIHBhcmFtZXRlcnMsIHNvIGl0IGlzIGRlc2lyYWJsZSBpbiB0aGVcbi8vIGdlbmVyYWwgY2FzZSBmb3IgdGhlIHNoaW0gdG8gbWF0Y2ggdGhlIG1vcmVcbi8vIHN0cmljdCBhbmQgY29tbW9uIGJlaGF2aW9yIG9mIHJlamVjdGluZyByZWd1bGFyXG4vLyBleHByZXNzaW9ucy5cblxuLy8gRVM1IDE1LjQuNC4xOFxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNC40LjE4XG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9hcnJheS9mb3JFYWNoXG5cbi8vIENoZWNrIGZhaWx1cmUgb2YgYnktaW5kZXggYWNjZXNzIG9mIHN0cmluZyBjaGFyYWN0ZXJzIChJRSA8IDkpXG4vLyBhbmQgZmFpbHVyZSBvZiBgMCBpbiBib3hlZFN0cmluZ2AgKFJoaW5vKVxudmFyIGJveGVkU3RyaW5nID0gT2JqZWN0KFwiYVwiKSxcbiAgICBzcGxpdFN0cmluZyA9IGJveGVkU3RyaW5nWzBdICE9IFwiYVwiIHx8ICEoMCBpbiBib3hlZFN0cmluZyk7XG5cbmlmICghQXJyYXkucHJvdG90eXBlLmZvckVhY2gpIHtcbiAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIGZvckVhY2goZnVuIC8qLCB0aGlzcCovKSB7XG4gICAgICAgIHZhciBvYmplY3QgPSB0b09iamVjdCh0aGlzKSxcbiAgICAgICAgICAgIHNlbGYgPSBzcGxpdFN0cmluZyAmJiBfdG9TdHJpbmcodGhpcykgPT0gXCJbb2JqZWN0IFN0cmluZ11cIiA/XG4gICAgICAgICAgICAgICAgdGhpcy5zcGxpdChcIlwiKSA6XG4gICAgICAgICAgICAgICAgb2JqZWN0LFxuICAgICAgICAgICAgdGhpc3AgPSBhcmd1bWVudHNbMV0sXG4gICAgICAgICAgICBpID0gLTEsXG4gICAgICAgICAgICBsZW5ndGggPSBzZWxmLmxlbmd0aCA+Pj4gMDtcblxuICAgICAgICAvLyBJZiBubyBjYWxsYmFjayBmdW5jdGlvbiBvciBpZiBjYWxsYmFjayBpcyBub3QgYSBjYWxsYWJsZSBmdW5jdGlvblxuICAgICAgICBpZiAoX3RvU3RyaW5nKGZ1bikgIT0gXCJbb2JqZWN0IEZ1bmN0aW9uXVwiKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7IC8vIFRPRE8gbWVzc2FnZVxuICAgICAgICB9XG5cbiAgICAgICAgd2hpbGUgKCsraSA8IGxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGkgaW4gc2VsZikge1xuICAgICAgICAgICAgICAgIC8vIEludm9rZSB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gd2l0aCBjYWxsLCBwYXNzaW5nIGFyZ3VtZW50czpcbiAgICAgICAgICAgICAgICAvLyBjb250ZXh0LCBwcm9wZXJ0eSB2YWx1ZSwgcHJvcGVydHkga2V5LCB0aGlzQXJnIG9iamVjdFxuICAgICAgICAgICAgICAgIC8vIGNvbnRleHRcbiAgICAgICAgICAgICAgICBmdW4uY2FsbCh0aGlzcCwgc2VsZltpXSwgaSwgb2JqZWN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59XG5cbi8vIEVTNSAxNS40LjQuMTlcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjQuNC4xOVxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vQ29yZV9KYXZhU2NyaXB0XzEuNV9SZWZlcmVuY2UvT2JqZWN0cy9BcnJheS9tYXBcbmlmICghQXJyYXkucHJvdG90eXBlLm1hcCkge1xuICAgIEFycmF5LnByb3RvdHlwZS5tYXAgPSBmdW5jdGlvbiBtYXAoZnVuIC8qLCB0aGlzcCovKSB7XG4gICAgICAgIHZhciBvYmplY3QgPSB0b09iamVjdCh0aGlzKSxcbiAgICAgICAgICAgIHNlbGYgPSBzcGxpdFN0cmluZyAmJiBfdG9TdHJpbmcodGhpcykgPT0gXCJbb2JqZWN0IFN0cmluZ11cIiA/XG4gICAgICAgICAgICAgICAgdGhpcy5zcGxpdChcIlwiKSA6XG4gICAgICAgICAgICAgICAgb2JqZWN0LFxuICAgICAgICAgICAgbGVuZ3RoID0gc2VsZi5sZW5ndGggPj4+IDAsXG4gICAgICAgICAgICByZXN1bHQgPSBBcnJheShsZW5ndGgpLFxuICAgICAgICAgICAgdGhpc3AgPSBhcmd1bWVudHNbMV07XG5cbiAgICAgICAgLy8gSWYgbm8gY2FsbGJhY2sgZnVuY3Rpb24gb3IgaWYgY2FsbGJhY2sgaXMgbm90IGEgY2FsbGFibGUgZnVuY3Rpb25cbiAgICAgICAgaWYgKF90b1N0cmluZyhmdW4pICE9IFwiW29iamVjdCBGdW5jdGlvbl1cIikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihmdW4gKyBcIiBpcyBub3QgYSBmdW5jdGlvblwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChpIGluIHNlbGYpXG4gICAgICAgICAgICAgICAgcmVzdWx0W2ldID0gZnVuLmNhbGwodGhpc3AsIHNlbGZbaV0sIGksIG9iamVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xufVxuXG4vLyBFUzUgMTUuNC40LjIwXG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS40LjQuMjBcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0NvcmVfSmF2YVNjcmlwdF8xLjVfUmVmZXJlbmNlL09iamVjdHMvQXJyYXkvZmlsdGVyXG5pZiAoIUFycmF5LnByb3RvdHlwZS5maWx0ZXIpIHtcbiAgICBBcnJheS5wcm90b3R5cGUuZmlsdGVyID0gZnVuY3Rpb24gZmlsdGVyKGZ1biAvKiwgdGhpc3AgKi8pIHtcbiAgICAgICAgdmFyIG9iamVjdCA9IHRvT2JqZWN0KHRoaXMpLFxuICAgICAgICAgICAgc2VsZiA9IHNwbGl0U3RyaW5nICYmIF90b1N0cmluZyh0aGlzKSA9PSBcIltvYmplY3QgU3RyaW5nXVwiID9cbiAgICAgICAgICAgICAgICB0aGlzLnNwbGl0KFwiXCIpIDpcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0LFxuICAgICAgICAgICAgbGVuZ3RoID0gc2VsZi5sZW5ndGggPj4+IDAsXG4gICAgICAgICAgICByZXN1bHQgPSBbXSxcbiAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgdGhpc3AgPSBhcmd1bWVudHNbMV07XG5cbiAgICAgICAgLy8gSWYgbm8gY2FsbGJhY2sgZnVuY3Rpb24gb3IgaWYgY2FsbGJhY2sgaXMgbm90IGEgY2FsbGFibGUgZnVuY3Rpb25cbiAgICAgICAgaWYgKF90b1N0cmluZyhmdW4pICE9IFwiW29iamVjdCBGdW5jdGlvbl1cIikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihmdW4gKyBcIiBpcyBub3QgYSBmdW5jdGlvblwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChpIGluIHNlbGYpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHNlbGZbaV07XG4gICAgICAgICAgICAgICAgaWYgKGZ1bi5jYWxsKHRoaXNwLCB2YWx1ZSwgaSwgb2JqZWN0KSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbn1cblxuLy8gRVM1IDE1LjQuNC4xNlxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNC40LjE2XG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9ldmVyeVxuaWYgKCFBcnJheS5wcm90b3R5cGUuZXZlcnkpIHtcbiAgICBBcnJheS5wcm90b3R5cGUuZXZlcnkgPSBmdW5jdGlvbiBldmVyeShmdW4gLyosIHRoaXNwICovKSB7XG4gICAgICAgIHZhciBvYmplY3QgPSB0b09iamVjdCh0aGlzKSxcbiAgICAgICAgICAgIHNlbGYgPSBzcGxpdFN0cmluZyAmJiBfdG9TdHJpbmcodGhpcykgPT0gXCJbb2JqZWN0IFN0cmluZ11cIiA/XG4gICAgICAgICAgICAgICAgdGhpcy5zcGxpdChcIlwiKSA6XG4gICAgICAgICAgICAgICAgb2JqZWN0LFxuICAgICAgICAgICAgbGVuZ3RoID0gc2VsZi5sZW5ndGggPj4+IDAsXG4gICAgICAgICAgICB0aGlzcCA9IGFyZ3VtZW50c1sxXTtcblxuICAgICAgICAvLyBJZiBubyBjYWxsYmFjayBmdW5jdGlvbiBvciBpZiBjYWxsYmFjayBpcyBub3QgYSBjYWxsYWJsZSBmdW5jdGlvblxuICAgICAgICBpZiAoX3RvU3RyaW5nKGZ1bikgIT0gXCJbb2JqZWN0IEZ1bmN0aW9uXVwiKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGZ1biArIFwiIGlzIG5vdCBhIGZ1bmN0aW9uXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGkgaW4gc2VsZiAmJiAhZnVuLmNhbGwodGhpc3AsIHNlbGZbaV0sIGksIG9iamVjdCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcbn1cblxuLy8gRVM1IDE1LjQuNC4xN1xuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNC40LjE3XG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9zb21lXG5pZiAoIUFycmF5LnByb3RvdHlwZS5zb21lKSB7XG4gICAgQXJyYXkucHJvdG90eXBlLnNvbWUgPSBmdW5jdGlvbiBzb21lKGZ1biAvKiwgdGhpc3AgKi8pIHtcbiAgICAgICAgdmFyIG9iamVjdCA9IHRvT2JqZWN0KHRoaXMpLFxuICAgICAgICAgICAgc2VsZiA9IHNwbGl0U3RyaW5nICYmIF90b1N0cmluZyh0aGlzKSA9PSBcIltvYmplY3QgU3RyaW5nXVwiID9cbiAgICAgICAgICAgICAgICB0aGlzLnNwbGl0KFwiXCIpIDpcbiAgICAgICAgICAgICAgICBvYmplY3QsXG4gICAgICAgICAgICBsZW5ndGggPSBzZWxmLmxlbmd0aCA+Pj4gMCxcbiAgICAgICAgICAgIHRoaXNwID0gYXJndW1lbnRzWzFdO1xuXG4gICAgICAgIC8vIElmIG5vIGNhbGxiYWNrIGZ1bmN0aW9uIG9yIGlmIGNhbGxiYWNrIGlzIG5vdCBhIGNhbGxhYmxlIGZ1bmN0aW9uXG4gICAgICAgIGlmIChfdG9TdHJpbmcoZnVuKSAhPSBcIltvYmplY3QgRnVuY3Rpb25dXCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoZnVuICsgXCIgaXMgbm90IGEgZnVuY3Rpb25cIik7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoaSBpbiBzZWxmICYmIGZ1bi5jYWxsKHRoaXNwLCBzZWxmW2ldLCBpLCBvYmplY3QpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG59XG5cbi8vIEVTNSAxNS40LjQuMjFcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjQuNC4yMVxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vQ29yZV9KYXZhU2NyaXB0XzEuNV9SZWZlcmVuY2UvT2JqZWN0cy9BcnJheS9yZWR1Y2VcbmlmICghQXJyYXkucHJvdG90eXBlLnJlZHVjZSkge1xuICAgIEFycmF5LnByb3RvdHlwZS5yZWR1Y2UgPSBmdW5jdGlvbiByZWR1Y2UoZnVuIC8qLCBpbml0aWFsKi8pIHtcbiAgICAgICAgdmFyIG9iamVjdCA9IHRvT2JqZWN0KHRoaXMpLFxuICAgICAgICAgICAgc2VsZiA9IHNwbGl0U3RyaW5nICYmIF90b1N0cmluZyh0aGlzKSA9PSBcIltvYmplY3QgU3RyaW5nXVwiID9cbiAgICAgICAgICAgICAgICB0aGlzLnNwbGl0KFwiXCIpIDpcbiAgICAgICAgICAgICAgICBvYmplY3QsXG4gICAgICAgICAgICBsZW5ndGggPSBzZWxmLmxlbmd0aCA+Pj4gMDtcblxuICAgICAgICAvLyBJZiBubyBjYWxsYmFjayBmdW5jdGlvbiBvciBpZiBjYWxsYmFjayBpcyBub3QgYSBjYWxsYWJsZSBmdW5jdGlvblxuICAgICAgICBpZiAoX3RvU3RyaW5nKGZ1bikgIT0gXCJbb2JqZWN0IEZ1bmN0aW9uXVwiKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGZ1biArIFwiIGlzIG5vdCBhIGZ1bmN0aW9uXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbm8gdmFsdWUgdG8gcmV0dXJuIGlmIG5vIGluaXRpYWwgdmFsdWUgYW5kIGFuIGVtcHR5IGFycmF5XG4gICAgICAgIGlmICghbGVuZ3RoICYmIGFyZ3VtZW50cy5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcInJlZHVjZSBvZiBlbXB0eSBhcnJheSB3aXRoIG5vIGluaXRpYWwgdmFsdWVcIik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaSA9IDA7XG4gICAgICAgIHZhciByZXN1bHQ7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDIpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICBpZiAoaSBpbiBzZWxmKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHNlbGZbaSsrXTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gaWYgYXJyYXkgY29udGFpbnMgbm8gdmFsdWVzLCBubyBpbml0aWFsIHZhbHVlIHRvIHJldHVyblxuICAgICAgICAgICAgICAgIGlmICgrK2kgPj0gbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJyZWR1Y2Ugb2YgZW1wdHkgYXJyYXkgd2l0aCBubyBpbml0aWFsIHZhbHVlXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gd2hpbGUgKHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGkgaW4gc2VsZikge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGZ1bi5jYWxsKHZvaWQgMCwgcmVzdWx0LCBzZWxmW2ldLCBpLCBvYmplY3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xufVxuXG4vLyBFUzUgMTUuNC40LjIyXG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS40LjQuMjJcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0NvcmVfSmF2YVNjcmlwdF8xLjVfUmVmZXJlbmNlL09iamVjdHMvQXJyYXkvcmVkdWNlUmlnaHRcbmlmICghQXJyYXkucHJvdG90eXBlLnJlZHVjZVJpZ2h0KSB7XG4gICAgQXJyYXkucHJvdG90eXBlLnJlZHVjZVJpZ2h0ID0gZnVuY3Rpb24gcmVkdWNlUmlnaHQoZnVuIC8qLCBpbml0aWFsKi8pIHtcbiAgICAgICAgdmFyIG9iamVjdCA9IHRvT2JqZWN0KHRoaXMpLFxuICAgICAgICAgICAgc2VsZiA9IHNwbGl0U3RyaW5nICYmIF90b1N0cmluZyh0aGlzKSA9PSBcIltvYmplY3QgU3RyaW5nXVwiID9cbiAgICAgICAgICAgICAgICB0aGlzLnNwbGl0KFwiXCIpIDpcbiAgICAgICAgICAgICAgICBvYmplY3QsXG4gICAgICAgICAgICBsZW5ndGggPSBzZWxmLmxlbmd0aCA+Pj4gMDtcblxuICAgICAgICAvLyBJZiBubyBjYWxsYmFjayBmdW5jdGlvbiBvciBpZiBjYWxsYmFjayBpcyBub3QgYSBjYWxsYWJsZSBmdW5jdGlvblxuICAgICAgICBpZiAoX3RvU3RyaW5nKGZ1bikgIT0gXCJbb2JqZWN0IEZ1bmN0aW9uXVwiKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGZ1biArIFwiIGlzIG5vdCBhIGZ1bmN0aW9uXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbm8gdmFsdWUgdG8gcmV0dXJuIGlmIG5vIGluaXRpYWwgdmFsdWUsIGVtcHR5IGFycmF5XG4gICAgICAgIGlmICghbGVuZ3RoICYmIGFyZ3VtZW50cy5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcInJlZHVjZVJpZ2h0IG9mIGVtcHR5IGFycmF5IHdpdGggbm8gaW5pdGlhbCB2YWx1ZVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciByZXN1bHQsIGkgPSBsZW5ndGggLSAxO1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBhcmd1bWVudHNbMV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgaWYgKGkgaW4gc2VsZikge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBzZWxmW2ktLV07XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIGlmIGFycmF5IGNvbnRhaW5zIG5vIHZhbHVlcywgbm8gaW5pdGlhbCB2YWx1ZSB0byByZXR1cm5cbiAgICAgICAgICAgICAgICBpZiAoLS1pIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwicmVkdWNlUmlnaHQgb2YgZW1wdHkgYXJyYXkgd2l0aCBubyBpbml0aWFsIHZhbHVlXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gd2hpbGUgKHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGkgPCAwKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgaWYgKGkgaW4gdGhpcykge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGZ1bi5jYWxsKHZvaWQgMCwgcmVzdWx0LCBzZWxmW2ldLCBpLCBvYmplY3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IHdoaWxlIChpLS0pO1xuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbn1cblxuLy8gRVM1IDE1LjQuNC4xNFxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNC40LjE0XG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9pbmRleE9mXG5pZiAoIUFycmF5LnByb3RvdHlwZS5pbmRleE9mIHx8IChbMCwgMV0uaW5kZXhPZigxLCAyKSAhPSAtMSkpIHtcbiAgICBBcnJheS5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uIGluZGV4T2Yoc291Z2h0IC8qLCBmcm9tSW5kZXggKi8gKSB7XG4gICAgICAgIHZhciBzZWxmID0gc3BsaXRTdHJpbmcgJiYgX3RvU3RyaW5nKHRoaXMpID09IFwiW29iamVjdCBTdHJpbmddXCIgP1xuICAgICAgICAgICAgICAgIHRoaXMuc3BsaXQoXCJcIikgOlxuICAgICAgICAgICAgICAgIHRvT2JqZWN0KHRoaXMpLFxuICAgICAgICAgICAgbGVuZ3RoID0gc2VsZi5sZW5ndGggPj4+IDA7XG5cbiAgICAgICAgaWYgKCFsZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICBpID0gdG9JbnRlZ2VyKGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBoYW5kbGUgbmVnYXRpdmUgaW5kaWNlc1xuICAgICAgICBpID0gaSA+PSAwID8gaSA6IE1hdGgubWF4KDAsIGxlbmd0aCArIGkpO1xuICAgICAgICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoaSBpbiBzZWxmICYmIHNlbGZbaV0gPT09IHNvdWdodCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9O1xufVxuXG4vLyBFUzUgMTUuNC40LjE1XG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS40LjQuMTVcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L2xhc3RJbmRleE9mXG5pZiAoIUFycmF5LnByb3RvdHlwZS5sYXN0SW5kZXhPZiB8fCAoWzAsIDFdLmxhc3RJbmRleE9mKDAsIC0zKSAhPSAtMSkpIHtcbiAgICBBcnJheS5wcm90b3R5cGUubGFzdEluZGV4T2YgPSBmdW5jdGlvbiBsYXN0SW5kZXhPZihzb3VnaHQgLyosIGZyb21JbmRleCAqLykge1xuICAgICAgICB2YXIgc2VsZiA9IHNwbGl0U3RyaW5nICYmIF90b1N0cmluZyh0aGlzKSA9PSBcIltvYmplY3QgU3RyaW5nXVwiID9cbiAgICAgICAgICAgICAgICB0aGlzLnNwbGl0KFwiXCIpIDpcbiAgICAgICAgICAgICAgICB0b09iamVjdCh0aGlzKSxcbiAgICAgICAgICAgIGxlbmd0aCA9IHNlbGYubGVuZ3RoID4+PiAwO1xuXG4gICAgICAgIGlmICghbGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGkgPSBsZW5ndGggLSAxO1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIGkgPSBNYXRoLm1pbihpLCB0b0ludGVnZXIoYXJndW1lbnRzWzFdKSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gaGFuZGxlIG5lZ2F0aXZlIGluZGljZXNcbiAgICAgICAgaSA9IGkgPj0gMCA/IGkgOiBsZW5ndGggLSBNYXRoLmFicyhpKTtcbiAgICAgICAgZm9yICg7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBpZiAoaSBpbiBzZWxmICYmIHNvdWdodCA9PT0gc2VsZltpXSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9O1xufVxuXG4vL1xuLy8gT2JqZWN0XG4vLyA9PT09PT1cbi8vXG5cbi8vIEVTNSAxNS4yLjMuMTRcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjIuMy4xNFxuaWYgKCFPYmplY3Qua2V5cykge1xuICAgIC8vIGh0dHA6Ly93aGF0dGhlaGVhZHNhaWQuY29tLzIwMTAvMTAvYS1zYWZlci1vYmplY3Qta2V5cy1jb21wYXRpYmlsaXR5LWltcGxlbWVudGF0aW9uXG4gICAgdmFyIGhhc0RvbnRFbnVtQnVnID0gdHJ1ZSxcbiAgICAgICAgZG9udEVudW1zID0gW1xuICAgICAgICAgICAgXCJ0b1N0cmluZ1wiLFxuICAgICAgICAgICAgXCJ0b0xvY2FsZVN0cmluZ1wiLFxuICAgICAgICAgICAgXCJ2YWx1ZU9mXCIsXG4gICAgICAgICAgICBcImhhc093blByb3BlcnR5XCIsXG4gICAgICAgICAgICBcImlzUHJvdG90eXBlT2ZcIixcbiAgICAgICAgICAgIFwicHJvcGVydHlJc0VudW1lcmFibGVcIixcbiAgICAgICAgICAgIFwiY29uc3RydWN0b3JcIlxuICAgICAgICBdLFxuICAgICAgICBkb250RW51bXNMZW5ndGggPSBkb250RW51bXMubGVuZ3RoO1xuXG4gICAgZm9yICh2YXIga2V5IGluIHtcInRvU3RyaW5nXCI6IG51bGx9KSB7XG4gICAgICAgIGhhc0RvbnRFbnVtQnVnID0gZmFsc2U7XG4gICAgfVxuXG4gICAgT2JqZWN0LmtleXMgPSBmdW5jdGlvbiBrZXlzKG9iamVjdCkge1xuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgICh0eXBlb2Ygb2JqZWN0ICE9IFwib2JqZWN0XCIgJiYgdHlwZW9mIG9iamVjdCAhPSBcImZ1bmN0aW9uXCIpIHx8XG4gICAgICAgICAgICBvYmplY3QgPT09IG51bGxcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiT2JqZWN0LmtleXMgY2FsbGVkIG9uIGEgbm9uLW9iamVjdFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBrZXlzID0gW107XG4gICAgICAgIGZvciAodmFyIG5hbWUgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgICBpZiAob3ducyhvYmplY3QsIG5hbWUpKSB7XG4gICAgICAgICAgICAgICAga2V5cy5wdXNoKG5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhhc0RvbnRFbnVtQnVnKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaWkgPSBkb250RW51bXNMZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRvbnRFbnVtID0gZG9udEVudW1zW2ldO1xuICAgICAgICAgICAgICAgIGlmIChvd25zKG9iamVjdCwgZG9udEVudW0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGtleXMucHVzaChkb250RW51bSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBrZXlzO1xuICAgIH07XG5cbn1cblxuLy9cbi8vIERhdGVcbi8vID09PT1cbi8vXG5cbi8vIEVTNSAxNS45LjUuNDNcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjkuNS40M1xuLy8gVGhpcyBmdW5jdGlvbiByZXR1cm5zIGEgU3RyaW5nIHZhbHVlIHJlcHJlc2VudCB0aGUgaW5zdGFuY2UgaW4gdGltZVxuLy8gcmVwcmVzZW50ZWQgYnkgdGhpcyBEYXRlIG9iamVjdC4gVGhlIGZvcm1hdCBvZiB0aGUgU3RyaW5nIGlzIHRoZSBEYXRlIFRpbWVcbi8vIHN0cmluZyBmb3JtYXQgZGVmaW5lZCBpbiAxNS45LjEuMTUuIEFsbCBmaWVsZHMgYXJlIHByZXNlbnQgaW4gdGhlIFN0cmluZy5cbi8vIFRoZSB0aW1lIHpvbmUgaXMgYWx3YXlzIFVUQywgZGVub3RlZCBieSB0aGUgc3VmZml4IFouIElmIHRoZSB0aW1lIHZhbHVlIG9mXG4vLyB0aGlzIG9iamVjdCBpcyBub3QgYSBmaW5pdGUgTnVtYmVyIGEgUmFuZ2VFcnJvciBleGNlcHRpb24gaXMgdGhyb3duLlxudmFyIG5lZ2F0aXZlRGF0ZSA9IC02MjE5ODc1NTIwMDAwMCxcbiAgICBuZWdhdGl2ZVllYXJTdHJpbmcgPSBcIi0wMDAwMDFcIjtcbmlmIChcbiAgICAhRGF0ZS5wcm90b3R5cGUudG9JU09TdHJpbmcgfHxcbiAgICAobmV3IERhdGUobmVnYXRpdmVEYXRlKS50b0lTT1N0cmluZygpLmluZGV4T2YobmVnYXRpdmVZZWFyU3RyaW5nKSA9PT0gLTEpXG4pIHtcbiAgICBEYXRlLnByb3RvdHlwZS50b0lTT1N0cmluZyA9IGZ1bmN0aW9uIHRvSVNPU3RyaW5nKCkge1xuICAgICAgICB2YXIgcmVzdWx0LCBsZW5ndGgsIHZhbHVlLCB5ZWFyLCBtb250aDtcbiAgICAgICAgaWYgKCFpc0Zpbml0ZSh0aGlzKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJEYXRlLnByb3RvdHlwZS50b0lTT1N0cmluZyBjYWxsZWQgb24gbm9uLWZpbml0ZSB2YWx1ZS5cIik7XG4gICAgICAgIH1cblxuICAgICAgICB5ZWFyID0gdGhpcy5nZXRVVENGdWxsWWVhcigpO1xuXG4gICAgICAgIG1vbnRoID0gdGhpcy5nZXRVVENNb250aCgpO1xuICAgICAgICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2tyaXNrb3dhbC9lczUtc2hpbS9pc3N1ZXMvMTExXG4gICAgICAgIHllYXIgKz0gTWF0aC5mbG9vcihtb250aCAvIDEyKTtcbiAgICAgICAgbW9udGggPSAobW9udGggJSAxMiArIDEyKSAlIDEyO1xuXG4gICAgICAgIC8vIHRoZSBkYXRlIHRpbWUgc3RyaW5nIGZvcm1hdCBpcyBzcGVjaWZpZWQgaW4gMTUuOS4xLjE1LlxuICAgICAgICByZXN1bHQgPSBbbW9udGggKyAxLCB0aGlzLmdldFVUQ0RhdGUoKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0VVRDSG91cnMoKSwgdGhpcy5nZXRVVENNaW51dGVzKCksIHRoaXMuZ2V0VVRDU2Vjb25kcygpXTtcbiAgICAgICAgeWVhciA9IChcbiAgICAgICAgICAgICh5ZWFyIDwgMCA/IFwiLVwiIDogKHllYXIgPiA5OTk5ID8gXCIrXCIgOiBcIlwiKSkgK1xuICAgICAgICAgICAgKFwiMDAwMDBcIiArIE1hdGguYWJzKHllYXIpKVxuICAgICAgICAgICAgLnNsaWNlKDAgPD0geWVhciAmJiB5ZWFyIDw9IDk5OTkgPyAtNCA6IC02KVxuICAgICAgICApO1xuXG4gICAgICAgIGxlbmd0aCA9IHJlc3VsdC5sZW5ndGg7XG4gICAgICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgICAgICAgdmFsdWUgPSByZXN1bHRbbGVuZ3RoXTtcbiAgICAgICAgICAgIC8vIHBhZCBtb250aHMsIGRheXMsIGhvdXJzLCBtaW51dGVzLCBhbmQgc2Vjb25kcyB0byBoYXZlIHR3b1xuICAgICAgICAgICAgLy8gZGlnaXRzLlxuICAgICAgICAgICAgaWYgKHZhbHVlIDwgMTApIHtcbiAgICAgICAgICAgICAgICByZXN1bHRbbGVuZ3RoXSA9IFwiMFwiICsgdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gcGFkIG1pbGxpc2Vjb25kcyB0byBoYXZlIHRocmVlIGRpZ2l0cy5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIHllYXIgKyBcIi1cIiArIHJlc3VsdC5zbGljZSgwLCAyKS5qb2luKFwiLVwiKSArXG4gICAgICAgICAgICBcIlRcIiArIHJlc3VsdC5zbGljZSgyKS5qb2luKFwiOlwiKSArIFwiLlwiICtcbiAgICAgICAgICAgIChcIjAwMFwiICsgdGhpcy5nZXRVVENNaWxsaXNlY29uZHMoKSkuc2xpY2UoLTMpICsgXCJaXCJcbiAgICAgICAgKTtcbiAgICB9O1xufVxuXG5cbi8vIEVTNSAxNS45LjUuNDRcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjkuNS40NFxuLy8gVGhpcyBmdW5jdGlvbiBwcm92aWRlcyBhIFN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBhIERhdGUgb2JqZWN0IGZvciB1c2UgYnlcbi8vIEpTT04uc3RyaW5naWZ5ICgxNS4xMi4zKS5cbnZhciBkYXRlVG9KU09OSXNTdXBwb3J0ZWQgPSBmYWxzZTtcbnRyeSB7XG4gICAgZGF0ZVRvSlNPTklzU3VwcG9ydGVkID0gKFxuICAgICAgICBEYXRlLnByb3RvdHlwZS50b0pTT04gJiZcbiAgICAgICAgbmV3IERhdGUoTmFOKS50b0pTT04oKSA9PT0gbnVsbCAmJlxuICAgICAgICBuZXcgRGF0ZShuZWdhdGl2ZURhdGUpLnRvSlNPTigpLmluZGV4T2YobmVnYXRpdmVZZWFyU3RyaW5nKSAhPT0gLTEgJiZcbiAgICAgICAgRGF0ZS5wcm90b3R5cGUudG9KU09OLmNhbGwoeyAvLyBnZW5lcmljXG4gICAgICAgICAgICB0b0lTT1N0cmluZzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICk7XG59IGNhdGNoIChlKSB7XG59XG5pZiAoIWRhdGVUb0pTT05Jc1N1cHBvcnRlZCkge1xuICAgIERhdGUucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uIHRvSlNPTihrZXkpIHtcbiAgICAgICAgLy8gV2hlbiB0aGUgdG9KU09OIG1ldGhvZCBpcyBjYWxsZWQgd2l0aCBhcmd1bWVudCBrZXksIHRoZSBmb2xsb3dpbmdcbiAgICAgICAgLy8gc3RlcHMgYXJlIHRha2VuOlxuXG4gICAgICAgIC8vIDEuICBMZXQgTyBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgVG9PYmplY3QsIGdpdmluZyBpdCB0aGUgdGhpc1xuICAgICAgICAvLyB2YWx1ZSBhcyBpdHMgYXJndW1lbnQuXG4gICAgICAgIC8vIDIuIExldCB0diBiZSB0b1ByaW1pdGl2ZShPLCBoaW50IE51bWJlcikuXG4gICAgICAgIHZhciBvID0gT2JqZWN0KHRoaXMpLFxuICAgICAgICAgICAgdHYgPSB0b1ByaW1pdGl2ZShvKSxcbiAgICAgICAgICAgIHRvSVNPO1xuICAgICAgICAvLyAzLiBJZiB0diBpcyBhIE51bWJlciBhbmQgaXMgbm90IGZpbml0ZSwgcmV0dXJuIG51bGwuXG4gICAgICAgIGlmICh0eXBlb2YgdHYgPT09IFwibnVtYmVyXCIgJiYgIWlzRmluaXRlKHR2KSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgLy8gNC4gTGV0IHRvSVNPIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tHZXRdXSBpbnRlcm5hbCBtZXRob2Qgb2ZcbiAgICAgICAgLy8gTyB3aXRoIGFyZ3VtZW50IFwidG9JU09TdHJpbmdcIi5cbiAgICAgICAgdG9JU08gPSBvLnRvSVNPU3RyaW5nO1xuICAgICAgICAvLyA1LiBJZiBJc0NhbGxhYmxlKHRvSVNPKSBpcyBmYWxzZSwgdGhyb3cgYSBUeXBlRXJyb3IgZXhjZXB0aW9uLlxuICAgICAgICBpZiAodHlwZW9mIHRvSVNPICE9IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcInRvSVNPU3RyaW5nIHByb3BlcnR5IGlzIG5vdCBjYWxsYWJsZVwiKTtcbiAgICAgICAgfVxuICAgICAgICAvLyA2LiBSZXR1cm4gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0NhbGxdXSBpbnRlcm5hbCBtZXRob2Qgb2ZcbiAgICAgICAgLy8gIHRvSVNPIHdpdGggTyBhcyB0aGUgdGhpcyB2YWx1ZSBhbmQgYW4gZW1wdHkgYXJndW1lbnQgbGlzdC5cbiAgICAgICAgcmV0dXJuIHRvSVNPLmNhbGwobyk7XG5cbiAgICAgICAgLy8gTk9URSAxIFRoZSBhcmd1bWVudCBpcyBpZ25vcmVkLlxuXG4gICAgICAgIC8vIE5PVEUgMiBUaGUgdG9KU09OIGZ1bmN0aW9uIGlzIGludGVudGlvbmFsbHkgZ2VuZXJpYzsgaXQgZG9lcyBub3RcbiAgICAgICAgLy8gcmVxdWlyZSB0aGF0IGl0cyB0aGlzIHZhbHVlIGJlIGEgRGF0ZSBvYmplY3QuIFRoZXJlZm9yZSwgaXQgY2FuIGJlXG4gICAgICAgIC8vIHRyYW5zZmVycmVkIHRvIG90aGVyIGtpbmRzIG9mIG9iamVjdHMgZm9yIHVzZSBhcyBhIG1ldGhvZC4gSG93ZXZlcixcbiAgICAgICAgLy8gaXQgZG9lcyByZXF1aXJlIHRoYXQgYW55IHN1Y2ggb2JqZWN0IGhhdmUgYSB0b0lTT1N0cmluZyBtZXRob2QuIEFuXG4gICAgICAgIC8vIG9iamVjdCBpcyBmcmVlIHRvIHVzZSB0aGUgYXJndW1lbnQga2V5IHRvIGZpbHRlciBpdHNcbiAgICAgICAgLy8gc3RyaW5naWZpY2F0aW9uLlxuICAgIH07XG59XG5cbi8vIEVTNSAxNS45LjQuMlxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuOS40LjJcbi8vIGJhc2VkIG9uIHdvcmsgc2hhcmVkIGJ5IERhbmllbCBGcmllc2VuIChkYW50bWFuKVxuLy8gaHR0cDovL2dpc3QuZ2l0aHViLmNvbS8zMDMyNDlcbmlmICghRGF0ZS5wYXJzZSB8fCBcIkRhdGUucGFyc2UgaXMgYnVnZ3lcIikge1xuICAgIC8vIFhYWCBnbG9iYWwgYXNzaWdubWVudCB3b24ndCB3b3JrIGluIGVtYmVkZGluZ3MgdGhhdCB1c2VcbiAgICAvLyBhbiBhbHRlcm5hdGUgb2JqZWN0IGZvciB0aGUgY29udGV4dC5cbiAgICBEYXRlID0gKGZ1bmN0aW9uKE5hdGl2ZURhdGUpIHtcblxuICAgICAgICAvLyBEYXRlLmxlbmd0aCA9PT0gN1xuICAgICAgICBmdW5jdGlvbiBEYXRlKFksIE0sIEQsIGgsIG0sIHMsIG1zKSB7XG4gICAgICAgICAgICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgICAgIGlmICh0aGlzIGluc3RhbmNlb2YgTmF0aXZlRGF0ZSkge1xuICAgICAgICAgICAgICAgIHZhciBkYXRlID0gbGVuZ3RoID09IDEgJiYgU3RyaW5nKFkpID09PSBZID8gLy8gaXNTdHJpbmcoWSlcbiAgICAgICAgICAgICAgICAgICAgLy8gV2UgZXhwbGljaXRseSBwYXNzIGl0IHRocm91Z2ggcGFyc2U6XG4gICAgICAgICAgICAgICAgICAgIG5ldyBOYXRpdmVEYXRlKERhdGUucGFyc2UoWSkpIDpcbiAgICAgICAgICAgICAgICAgICAgLy8gV2UgaGF2ZSB0byBtYW51YWxseSBtYWtlIGNhbGxzIGRlcGVuZGluZyBvbiBhcmd1bWVudFxuICAgICAgICAgICAgICAgICAgICAvLyBsZW5ndGggaGVyZVxuICAgICAgICAgICAgICAgICAgICBsZW5ndGggPj0gNyA/IG5ldyBOYXRpdmVEYXRlKFksIE0sIEQsIGgsIG0sIHMsIG1zKSA6XG4gICAgICAgICAgICAgICAgICAgIGxlbmd0aCA+PSA2ID8gbmV3IE5hdGl2ZURhdGUoWSwgTSwgRCwgaCwgbSwgcykgOlxuICAgICAgICAgICAgICAgICAgICBsZW5ndGggPj0gNSA/IG5ldyBOYXRpdmVEYXRlKFksIE0sIEQsIGgsIG0pIDpcbiAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID49IDQgPyBuZXcgTmF0aXZlRGF0ZShZLCBNLCBELCBoKSA6XG4gICAgICAgICAgICAgICAgICAgIGxlbmd0aCA+PSAzID8gbmV3IE5hdGl2ZURhdGUoWSwgTSwgRCkgOlxuICAgICAgICAgICAgICAgICAgICBsZW5ndGggPj0gMiA/IG5ldyBOYXRpdmVEYXRlKFksIE0pIDpcbiAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID49IDEgPyBuZXcgTmF0aXZlRGF0ZShZKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IE5hdGl2ZURhdGUoKTtcbiAgICAgICAgICAgICAgICAvLyBQcmV2ZW50IG1peHVwcyB3aXRoIHVuZml4ZWQgRGF0ZSBvYmplY3RcbiAgICAgICAgICAgICAgICBkYXRlLmNvbnN0cnVjdG9yID0gRGF0ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBOYXRpdmVEYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gMTUuOS4xLjE1IERhdGUgVGltZSBTdHJpbmcgRm9ybWF0LlxuICAgICAgICB2YXIgaXNvRGF0ZUV4cHJlc3Npb24gPSBuZXcgUmVnRXhwKFwiXlwiICtcbiAgICAgICAgICAgIFwiKFxcXFxkezR9fFtcXCtcXC1dXFxcXGR7Nn0pXCIgKyAvLyBmb3VyLWRpZ2l0IHllYXIgY2FwdHVyZSBvciBzaWduICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gNi1kaWdpdCBleHRlbmRlZCB5ZWFyXG4gICAgICAgICAgICBcIig/Oi0oXFxcXGR7Mn0pXCIgKyAvLyBvcHRpb25hbCBtb250aCBjYXB0dXJlXG4gICAgICAgICAgICBcIig/Oi0oXFxcXGR7Mn0pXCIgKyAvLyBvcHRpb25hbCBkYXkgY2FwdHVyZVxuICAgICAgICAgICAgXCIoPzpcIiArIC8vIGNhcHR1cmUgaG91cnM6bWludXRlczpzZWNvbmRzLm1pbGxpc2Vjb25kc1xuICAgICAgICAgICAgICAgIFwiVChcXFxcZHsyfSlcIiArIC8vIGhvdXJzIGNhcHR1cmVcbiAgICAgICAgICAgICAgICBcIjooXFxcXGR7Mn0pXCIgKyAvLyBtaW51dGVzIGNhcHR1cmVcbiAgICAgICAgICAgICAgICBcIig/OlwiICsgLy8gb3B0aW9uYWwgOnNlY29uZHMubWlsbGlzZWNvbmRzXG4gICAgICAgICAgICAgICAgICAgIFwiOihcXFxcZHsyfSlcIiArIC8vIHNlY29uZHMgY2FwdHVyZVxuICAgICAgICAgICAgICAgICAgICBcIig/OihcXFxcLlxcXFxkezEsfSkpP1wiICsgLy8gbWlsbGlzZWNvbmRzIGNhcHR1cmVcbiAgICAgICAgICAgICAgICBcIik/XCIgK1xuICAgICAgICAgICAgXCIoXCIgKyAvLyBjYXB0dXJlIFVUQyBvZmZzZXQgY29tcG9uZW50XG4gICAgICAgICAgICAgICAgXCJafFwiICsgLy8gVVRDIGNhcHR1cmVcbiAgICAgICAgICAgICAgICBcIig/OlwiICsgLy8gb2Zmc2V0IHNwZWNpZmllciArLy1ob3VyczptaW51dGVzXG4gICAgICAgICAgICAgICAgICAgIFwiKFstK10pXCIgKyAvLyBzaWduIGNhcHR1cmVcbiAgICAgICAgICAgICAgICAgICAgXCIoXFxcXGR7Mn0pXCIgKyAvLyBob3VycyBvZmZzZXQgY2FwdHVyZVxuICAgICAgICAgICAgICAgICAgICBcIjooXFxcXGR7Mn0pXCIgKyAvLyBtaW51dGVzIG9mZnNldCBjYXB0dXJlXG4gICAgICAgICAgICAgICAgXCIpXCIgK1xuICAgICAgICAgICAgXCIpPyk/KT8pP1wiICtcbiAgICAgICAgXCIkXCIpO1xuXG4gICAgICAgIHZhciBtb250aHMgPSBbXG4gICAgICAgICAgICAwLCAzMSwgNTksIDkwLCAxMjAsIDE1MSwgMTgxLCAyMTIsIDI0MywgMjczLCAzMDQsIDMzNCwgMzY1XG4gICAgICAgIF07XG5cbiAgICAgICAgZnVuY3Rpb24gZGF5RnJvbU1vbnRoKHllYXIsIG1vbnRoKSB7XG4gICAgICAgICAgICB2YXIgdCA9IG1vbnRoID4gMSA/IDEgOiAwO1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICBtb250aHNbbW9udGhdICtcbiAgICAgICAgICAgICAgICBNYXRoLmZsb29yKCh5ZWFyIC0gMTk2OSArIHQpIC8gNCkgLVxuICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoKHllYXIgLSAxOTAxICsgdCkgLyAxMDApICtcbiAgICAgICAgICAgICAgICBNYXRoLmZsb29yKCh5ZWFyIC0gMTYwMSArIHQpIC8gNDAwKSArXG4gICAgICAgICAgICAgICAgMzY1ICogKHllYXIgLSAxOTcwKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENvcHkgYW55IGN1c3RvbSBtZXRob2RzIGEgM3JkIHBhcnR5IGxpYnJhcnkgbWF5IGhhdmUgYWRkZWRcbiAgICAgICAgZm9yICh2YXIga2V5IGluIE5hdGl2ZURhdGUpIHtcbiAgICAgICAgICAgIERhdGVba2V5XSA9IE5hdGl2ZURhdGVba2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENvcHkgXCJuYXRpdmVcIiBtZXRob2RzIGV4cGxpY2l0bHk7IHRoZXkgbWF5IGJlIG5vbi1lbnVtZXJhYmxlXG4gICAgICAgIERhdGUubm93ID0gTmF0aXZlRGF0ZS5ub3c7XG4gICAgICAgIERhdGUuVVRDID0gTmF0aXZlRGF0ZS5VVEM7XG4gICAgICAgIERhdGUucHJvdG90eXBlID0gTmF0aXZlRGF0ZS5wcm90b3R5cGU7XG4gICAgICAgIERhdGUucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gRGF0ZTtcblxuICAgICAgICAvLyBVcGdyYWRlIERhdGUucGFyc2UgdG8gaGFuZGxlIHNpbXBsaWZpZWQgSVNPIDg2MDEgc3RyaW5nc1xuICAgICAgICBEYXRlLnBhcnNlID0gZnVuY3Rpb24gcGFyc2Uoc3RyaW5nKSB7XG4gICAgICAgICAgICB2YXIgbWF0Y2ggPSBpc29EYXRlRXhwcmVzc2lvbi5leGVjKHN0cmluZyk7XG4gICAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAvLyBwYXJzZSBtb250aHMsIGRheXMsIGhvdXJzLCBtaW51dGVzLCBzZWNvbmRzLCBhbmQgbWlsbGlzZWNvbmRzXG4gICAgICAgICAgICAgICAgLy8gcHJvdmlkZSBkZWZhdWx0IHZhbHVlcyBpZiBuZWNlc3NhcnlcbiAgICAgICAgICAgICAgICAvLyBwYXJzZSB0aGUgVVRDIG9mZnNldCBjb21wb25lbnRcbiAgICAgICAgICAgICAgICB2YXIgeWVhciA9IE51bWJlcihtYXRjaFsxXSksXG4gICAgICAgICAgICAgICAgICAgIG1vbnRoID0gTnVtYmVyKG1hdGNoWzJdIHx8IDEpIC0gMSxcbiAgICAgICAgICAgICAgICAgICAgZGF5ID0gTnVtYmVyKG1hdGNoWzNdIHx8IDEpIC0gMSxcbiAgICAgICAgICAgICAgICAgICAgaG91ciA9IE51bWJlcihtYXRjaFs0XSB8fCAwKSxcbiAgICAgICAgICAgICAgICAgICAgbWludXRlID0gTnVtYmVyKG1hdGNoWzVdIHx8IDApLFxuICAgICAgICAgICAgICAgICAgICBzZWNvbmQgPSBOdW1iZXIobWF0Y2hbNl0gfHwgMCksXG4gICAgICAgICAgICAgICAgICAgIG1pbGxpc2Vjb25kID0gTWF0aC5mbG9vcihOdW1iZXIobWF0Y2hbN10gfHwgMCkgKiAxMDAwKSxcbiAgICAgICAgICAgICAgICAgICAgLy8gV2hlbiB0aW1lIHpvbmUgaXMgbWlzc2VkLCBsb2NhbCBvZmZzZXQgc2hvdWxkIGJlIHVzZWRcbiAgICAgICAgICAgICAgICAgICAgLy8gKEVTIDUuMSBidWcpXG4gICAgICAgICAgICAgICAgICAgIC8vIHNlZSBodHRwczovL2J1Z3MuZWNtYXNjcmlwdC5vcmcvc2hvd19idWcuY2dpP2lkPTExMlxuICAgICAgICAgICAgICAgICAgICBvZmZzZXQgPSAhbWF0Y2hbNF0gfHwgbWF0Y2hbOF0gP1xuICAgICAgICAgICAgICAgICAgICAgICAgMCA6IE51bWJlcihuZXcgTmF0aXZlRGF0ZSgxOTcwLCAwKSksXG4gICAgICAgICAgICAgICAgICAgIHNpZ25PZmZzZXQgPSBtYXRjaFs5XSA9PT0gXCItXCIgPyAxIDogLTEsXG4gICAgICAgICAgICAgICAgICAgIGhvdXJPZmZzZXQgPSBOdW1iZXIobWF0Y2hbMTBdIHx8IDApLFxuICAgICAgICAgICAgICAgICAgICBtaW51dGVPZmZzZXQgPSBOdW1iZXIobWF0Y2hbMTFdIHx8IDApLFxuICAgICAgICAgICAgICAgICAgICByZXN1bHQ7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICBob3VyIDwgKFxuICAgICAgICAgICAgICAgICAgICAgICAgbWludXRlID4gMCB8fCBzZWNvbmQgPiAwIHx8IG1pbGxpc2Vjb25kID4gMCA/XG4gICAgICAgICAgICAgICAgICAgICAgICAyNCA6IDI1XG4gICAgICAgICAgICAgICAgICAgICkgJiZcbiAgICAgICAgICAgICAgICAgICAgbWludXRlIDwgNjAgJiYgc2Vjb25kIDwgNjAgJiYgbWlsbGlzZWNvbmQgPCAxMDAwICYmXG4gICAgICAgICAgICAgICAgICAgIG1vbnRoID4gLTEgJiYgbW9udGggPCAxMiAmJiBob3VyT2Zmc2V0IDwgMjQgJiZcbiAgICAgICAgICAgICAgICAgICAgbWludXRlT2Zmc2V0IDwgNjAgJiYgLy8gZGV0ZWN0IGludmFsaWQgb2Zmc2V0c1xuICAgICAgICAgICAgICAgICAgICBkYXkgPiAtMSAmJlxuICAgICAgICAgICAgICAgICAgICBkYXkgPCAoXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXlGcm9tTW9udGgoeWVhciwgbW9udGggKyAxKSAtXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXlGcm9tTW9udGgoeWVhciwgbW9udGgpXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gKFxuICAgICAgICAgICAgICAgICAgICAgICAgKGRheUZyb21Nb250aCh5ZWFyLCBtb250aCkgKyBkYXkpICogMjQgK1xuICAgICAgICAgICAgICAgICAgICAgICAgaG91ciArXG4gICAgICAgICAgICAgICAgICAgICAgICBob3VyT2Zmc2V0ICogc2lnbk9mZnNldFxuICAgICAgICAgICAgICAgICAgICApICogNjA7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IChcbiAgICAgICAgICAgICAgICAgICAgICAgIChyZXN1bHQgKyBtaW51dGUgKyBtaW51dGVPZmZzZXQgKiBzaWduT2Zmc2V0KSAqIDYwICtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlY29uZFxuICAgICAgICAgICAgICAgICAgICApICogMTAwMCArIG1pbGxpc2Vjb25kICsgb2Zmc2V0O1xuICAgICAgICAgICAgICAgICAgICBpZiAoLTguNjRlMTUgPD0gcmVzdWx0ICYmIHJlc3VsdCA8PSA4LjY0ZTE1KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBOYU47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gTmF0aXZlRGF0ZS5wYXJzZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBEYXRlO1xuICAgIH0pKERhdGUpO1xufVxuXG4vLyBFUzUgMTUuOS40LjRcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjkuNC40XG5pZiAoIURhdGUubm93KSB7XG4gICAgRGF0ZS5ub3cgPSBmdW5jdGlvbiBub3coKSB7XG4gICAgICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICB9O1xufVxuXG5cbi8vXG4vLyBOdW1iZXJcbi8vID09PT09PVxuLy9cblxuLy8gRVM1LjEgMTUuNy40LjVcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjcuNC41XG5pZiAoIU51bWJlci5wcm90b3R5cGUudG9GaXhlZCB8fCAoMC4wMDAwOCkudG9GaXhlZCgzKSAhPT0gJzAuMDAwJyB8fCAoMC45KS50b0ZpeGVkKDApID09PSAnMCcgfHwgKDEuMjU1KS50b0ZpeGVkKDIpICE9PSAnMS4yNScgfHwgKDEwMDAwMDAwMDAwMDAwMDAxMjgpLnRvRml4ZWQoMCkgIT09IFwiMTAwMDAwMDAwMDAwMDAwMDEyOFwiKSB7XG4gICAgLy8gSGlkZSB0aGVzZSB2YXJpYWJsZXMgYW5kIGZ1bmN0aW9uc1xuICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBiYXNlLCBzaXplLCBkYXRhLCBpO1xuXG4gICAgICAgIGJhc2UgPSAxZTc7XG4gICAgICAgIHNpemUgPSA2O1xuICAgICAgICBkYXRhID0gWzAsIDAsIDAsIDAsIDAsIDBdO1xuXG4gICAgICAgIGZ1bmN0aW9uIG11bHRpcGx5KG4sIGMpIHtcbiAgICAgICAgICAgIHZhciBpID0gLTE7XG4gICAgICAgICAgICB3aGlsZSAoKytpIDwgc2l6ZSkge1xuICAgICAgICAgICAgICAgIGMgKz0gbiAqIGRhdGFbaV07XG4gICAgICAgICAgICAgICAgZGF0YVtpXSA9IGMgJSBiYXNlO1xuICAgICAgICAgICAgICAgIGMgPSBNYXRoLmZsb29yKGMgLyBiYXNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGRpdmlkZShuKSB7XG4gICAgICAgICAgICB2YXIgaSA9IHNpemUsIGMgPSAwO1xuICAgICAgICAgICAgd2hpbGUgKC0taSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgYyArPSBkYXRhW2ldO1xuICAgICAgICAgICAgICAgIGRhdGFbaV0gPSBNYXRoLmZsb29yKGMgLyBuKTtcbiAgICAgICAgICAgICAgICBjID0gKGMgJSBuKSAqIGJhc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICAgICAgICAgIHZhciBpID0gc2l6ZTtcbiAgICAgICAgICAgIHZhciBzID0gJyc7XG4gICAgICAgICAgICB3aGlsZSAoLS1pID49IDApIHtcbiAgICAgICAgICAgICAgICBpZiAocyAhPT0gJycgfHwgaSA9PT0gMCB8fCBkYXRhW2ldICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0ID0gU3RyaW5nKGRhdGFbaV0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAocyA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMgPSB0O1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcyArPSAnMDAwMDAwMCcuc2xpY2UoMCwgNyAtIHQubGVuZ3RoKSArIHQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHBvdyh4LCBuLCBhY2MpIHtcbiAgICAgICAgICAgIHJldHVybiAobiA9PT0gMCA/IGFjYyA6IChuICUgMiA9PT0gMSA/IHBvdyh4LCBuIC0gMSwgYWNjICogeCkgOiBwb3coeCAqIHgsIG4gLyAyLCBhY2MpKSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBsb2coeCkge1xuICAgICAgICAgICAgdmFyIG4gPSAwO1xuICAgICAgICAgICAgd2hpbGUgKHggPj0gNDA5Nikge1xuICAgICAgICAgICAgICAgIG4gKz0gMTI7XG4gICAgICAgICAgICAgICAgeCAvPSA0MDk2O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd2hpbGUgKHggPj0gMikge1xuICAgICAgICAgICAgICAgIG4gKz0gMTtcbiAgICAgICAgICAgICAgICB4IC89IDI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbjtcbiAgICAgICAgfVxuXG4gICAgICAgIE51bWJlci5wcm90b3R5cGUudG9GaXhlZCA9IGZ1bmN0aW9uIChmcmFjdGlvbkRpZ2l0cykge1xuICAgICAgICAgICAgdmFyIGYsIHgsIHMsIG0sIGUsIHosIGosIGs7XG5cbiAgICAgICAgICAgIC8vIFRlc3QgZm9yIE5hTiBhbmQgcm91bmQgZnJhY3Rpb25EaWdpdHMgZG93blxuICAgICAgICAgICAgZiA9IE51bWJlcihmcmFjdGlvbkRpZ2l0cyk7XG4gICAgICAgICAgICBmID0gZiAhPT0gZiA/IDAgOiBNYXRoLmZsb29yKGYpO1xuXG4gICAgICAgICAgICBpZiAoZiA8IDAgfHwgZiA+IDIwKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJOdW1iZXIudG9GaXhlZCBjYWxsZWQgd2l0aCBpbnZhbGlkIG51bWJlciBvZiBkZWNpbWFsc1wiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgeCA9IE51bWJlcih0aGlzKTtcblxuICAgICAgICAgICAgLy8gVGVzdCBmb3IgTmFOXG4gICAgICAgICAgICBpZiAoeCAhPT0geCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIk5hTlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZiBpdCBpcyB0b28gYmlnIG9yIHNtYWxsLCByZXR1cm4gdGhlIHN0cmluZyB2YWx1ZSBvZiB0aGUgbnVtYmVyXG4gICAgICAgICAgICBpZiAoeCA8PSAtMWUyMSB8fCB4ID49IDFlMjEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gU3RyaW5nKHgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzID0gXCJcIjtcblxuICAgICAgICAgICAgaWYgKHggPCAwKSB7XG4gICAgICAgICAgICAgICAgcyA9IFwiLVwiO1xuICAgICAgICAgICAgICAgIHggPSAteDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbSA9IFwiMFwiO1xuXG4gICAgICAgICAgICBpZiAoeCA+IDFlLTIxKSB7XG4gICAgICAgICAgICAgICAgLy8gMWUtMjEgPCB4IDwgMWUyMVxuICAgICAgICAgICAgICAgIC8vIC03MCA8IGxvZzIoeCkgPCA3MFxuICAgICAgICAgICAgICAgIGUgPSBsb2coeCAqIHBvdygyLCA2OSwgMSkpIC0gNjk7XG4gICAgICAgICAgICAgICAgeiA9IChlIDwgMCA/IHggKiBwb3coMiwgLWUsIDEpIDogeCAvIHBvdygyLCBlLCAxKSk7XG4gICAgICAgICAgICAgICAgeiAqPSAweDEwMDAwMDAwMDAwMDAwOyAvLyBNYXRoLnBvdygyLCA1Mik7XG4gICAgICAgICAgICAgICAgZSA9IDUyIC0gZTtcblxuICAgICAgICAgICAgICAgIC8vIC0xOCA8IGUgPCAxMjJcbiAgICAgICAgICAgICAgICAvLyB4ID0geiAvIDIgXiBlXG4gICAgICAgICAgICAgICAgaWYgKGUgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIG11bHRpcGx5KDAsIHopO1xuICAgICAgICAgICAgICAgICAgICBqID0gZjtcblxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoaiA+PSA3KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtdWx0aXBseSgxZTcsIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgaiAtPSA3O1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgbXVsdGlwbHkocG93KDEwLCBqLCAxKSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIGogPSBlIC0gMTtcblxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoaiA+PSAyMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGl2aWRlKDEgPDwgMjMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaiAtPSAyMztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGRpdmlkZSgxIDw8IGopO1xuICAgICAgICAgICAgICAgICAgICBtdWx0aXBseSgxLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgZGl2aWRlKDIpO1xuICAgICAgICAgICAgICAgICAgICBtID0gdG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBtdWx0aXBseSgwLCB6KTtcbiAgICAgICAgICAgICAgICAgICAgbXVsdGlwbHkoMSA8PCAoLWUpLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgbSA9IHRvU3RyaW5nKCkgKyAnMC4wMDAwMDAwMDAwMDAwMDAwMDAwMCcuc2xpY2UoMiwgMiArIGYpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGYgPiAwKSB7XG4gICAgICAgICAgICAgICAgayA9IG0ubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgaWYgKGsgPD0gZikge1xuICAgICAgICAgICAgICAgICAgICBtID0gcyArICcwLjAwMDAwMDAwMDAwMDAwMDAwMDAnLnNsaWNlKDAsIGYgLSBrICsgMikgKyBtO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG0gPSBzICsgbS5zbGljZSgwLCBrIC0gZikgKyAnLicgKyBtLnNsaWNlKGsgLSBmKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG0gPSBzICsgbTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG07XG4gICAgICAgIH1cbiAgICB9KCkpO1xufVxuXG5cbi8vXG4vLyBTdHJpbmdcbi8vID09PT09PVxuLy9cblxuXG4vLyBFUzUgMTUuNS40LjE0XG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS41LjQuMTRcblxuLy8gW2J1Z2ZpeCwgSUUgbHQgOSwgZmlyZWZveCA0LCBLb25xdWVyb3IsIE9wZXJhLCBvYnNjdXJlIGJyb3dzZXJzXVxuLy8gTWFueSBicm93c2VycyBkbyBub3Qgc3BsaXQgcHJvcGVybHkgd2l0aCByZWd1bGFyIGV4cHJlc3Npb25zIG9yIHRoZXlcbi8vIGRvIG5vdCBwZXJmb3JtIHRoZSBzcGxpdCBjb3JyZWN0bHkgdW5kZXIgb2JzY3VyZSBjb25kaXRpb25zLlxuLy8gU2VlIGh0dHA6Ly9ibG9nLnN0ZXZlbmxldml0aGFuLmNvbS9hcmNoaXZlcy9jcm9zcy1icm93c2VyLXNwbGl0XG4vLyBJJ3ZlIHRlc3RlZCBpbiBtYW55IGJyb3dzZXJzIGFuZCB0aGlzIHNlZW1zIHRvIGNvdmVyIHRoZSBkZXZpYW50IG9uZXM6XG4vLyAgICAnYWInLnNwbGl0KC8oPzphYikqLykgc2hvdWxkIGJlIFtcIlwiLCBcIlwiXSwgbm90IFtcIlwiXVxuLy8gICAgJy4nLnNwbGl0KC8oLj8pKC4/KS8pIHNob3VsZCBiZSBbXCJcIiwgXCIuXCIsIFwiXCIsIFwiXCJdLCBub3QgW1wiXCIsIFwiXCJdXG4vLyAgICAndGVzc3QnLnNwbGl0KC8ocykqLykgc2hvdWxkIGJlIFtcInRcIiwgdW5kZWZpbmVkLCBcImVcIiwgXCJzXCIsIFwidFwiXSwgbm90XG4vLyAgICAgICBbdW5kZWZpbmVkLCBcInRcIiwgdW5kZWZpbmVkLCBcImVcIiwgLi4uXVxuLy8gICAgJycuc3BsaXQoLy4/Lykgc2hvdWxkIGJlIFtdLCBub3QgW1wiXCJdXG4vLyAgICAnLicuc3BsaXQoLygpKCkvKSBzaG91bGQgYmUgW1wiLlwiXSwgbm90IFtcIlwiLCBcIlwiLCBcIi5cIl1cblxudmFyIHN0cmluZ19zcGxpdCA9IFN0cmluZy5wcm90b3R5cGUuc3BsaXQ7XG5pZiAoXG4gICAgJ2FiJy5zcGxpdCgvKD86YWIpKi8pLmxlbmd0aCAhPT0gMiB8fFxuICAgICcuJy5zcGxpdCgvKC4/KSguPykvKS5sZW5ndGggIT09IDQgfHxcbiAgICAndGVzc3QnLnNwbGl0KC8ocykqLylbMV0gPT09IFwidFwiIHx8XG4gICAgJycuc3BsaXQoLy4/LykubGVuZ3RoID09PSAwIHx8XG4gICAgJy4nLnNwbGl0KC8oKSgpLykubGVuZ3RoID4gMVxuKSB7XG4gICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGNvbXBsaWFudEV4ZWNOcGNnID0gLygpPz8vLmV4ZWMoXCJcIilbMV0gPT09IHZvaWQgMDsgLy8gTlBDRzogbm9ucGFydGljaXBhdGluZyBjYXB0dXJpbmcgZ3JvdXBcblxuICAgICAgICBTdHJpbmcucHJvdG90eXBlLnNwbGl0ID0gZnVuY3Rpb24gKHNlcGFyYXRvciwgbGltaXQpIHtcbiAgICAgICAgICAgIHZhciBzdHJpbmcgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKHNlcGFyYXRvciA9PT0gdm9pZCAwICYmIGxpbWl0ID09PSAwKVxuICAgICAgICAgICAgICAgIHJldHVybiBbXTtcblxuICAgICAgICAgICAgLy8gSWYgYHNlcGFyYXRvcmAgaXMgbm90IGEgcmVnZXgsIHVzZSBuYXRpdmUgc3BsaXRcbiAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoc2VwYXJhdG9yKSAhPT0gXCJbb2JqZWN0IFJlZ0V4cF1cIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdHJpbmdfc3BsaXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIG91dHB1dCA9IFtdLFxuICAgICAgICAgICAgICAgIGZsYWdzID0gKHNlcGFyYXRvci5pZ25vcmVDYXNlID8gXCJpXCIgOiBcIlwiKSArXG4gICAgICAgICAgICAgICAgICAgICAgICAoc2VwYXJhdG9yLm11bHRpbGluZSAgPyBcIm1cIiA6IFwiXCIpICtcbiAgICAgICAgICAgICAgICAgICAgICAgIChzZXBhcmF0b3IuZXh0ZW5kZWQgICA/IFwieFwiIDogXCJcIikgKyAvLyBQcm9wb3NlZCBmb3IgRVM2XG4gICAgICAgICAgICAgICAgICAgICAgICAoc2VwYXJhdG9yLnN0aWNreSAgICAgPyBcInlcIiA6IFwiXCIpLCAvLyBGaXJlZm94IDMrXG4gICAgICAgICAgICAgICAgbGFzdExhc3RJbmRleCA9IDAsXG4gICAgICAgICAgICAgICAgLy8gTWFrZSBgZ2xvYmFsYCBhbmQgYXZvaWQgYGxhc3RJbmRleGAgaXNzdWVzIGJ5IHdvcmtpbmcgd2l0aCBhIGNvcHlcbiAgICAgICAgICAgICAgICBzZXBhcmF0b3IgPSBuZXcgUmVnRXhwKHNlcGFyYXRvci5zb3VyY2UsIGZsYWdzICsgXCJnXCIpLFxuICAgICAgICAgICAgICAgIHNlcGFyYXRvcjIsIG1hdGNoLCBsYXN0SW5kZXgsIGxhc3RMZW5ndGg7XG4gICAgICAgICAgICBzdHJpbmcgKz0gXCJcIjsgLy8gVHlwZS1jb252ZXJ0XG4gICAgICAgICAgICBpZiAoIWNvbXBsaWFudEV4ZWNOcGNnKSB7XG4gICAgICAgICAgICAgICAgLy8gRG9lc24ndCBuZWVkIGZsYWdzIGd5LCBidXQgdGhleSBkb24ndCBodXJ0XG4gICAgICAgICAgICAgICAgc2VwYXJhdG9yMiA9IG5ldyBSZWdFeHAoXCJeXCIgKyBzZXBhcmF0b3Iuc291cmNlICsgXCIkKD8hXFxcXHMpXCIsIGZsYWdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qIFZhbHVlcyBmb3IgYGxpbWl0YCwgcGVyIHRoZSBzcGVjOlxuICAgICAgICAgICAgICogSWYgdW5kZWZpbmVkOiA0Mjk0OTY3Mjk1IC8vIE1hdGgucG93KDIsIDMyKSAtIDFcbiAgICAgICAgICAgICAqIElmIDAsIEluZmluaXR5LCBvciBOYU46IDBcbiAgICAgICAgICAgICAqIElmIHBvc2l0aXZlIG51bWJlcjogbGltaXQgPSBNYXRoLmZsb29yKGxpbWl0KTsgaWYgKGxpbWl0ID4gNDI5NDk2NzI5NSkgbGltaXQgLT0gNDI5NDk2NzI5NjtcbiAgICAgICAgICAgICAqIElmIG5lZ2F0aXZlIG51bWJlcjogNDI5NDk2NzI5NiAtIE1hdGguZmxvb3IoTWF0aC5hYnMobGltaXQpKVxuICAgICAgICAgICAgICogSWYgb3RoZXI6IFR5cGUtY29udmVydCwgdGhlbiB1c2UgdGhlIGFib3ZlIHJ1bGVzXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGxpbWl0ID0gbGltaXQgPT09IHZvaWQgMCA/XG4gICAgICAgICAgICAgICAgLTEgPj4+IDAgOiAvLyBNYXRoLnBvdygyLCAzMikgLSAxXG4gICAgICAgICAgICAgICAgbGltaXQgPj4+IDA7IC8vIFRvVWludDMyKGxpbWl0KVxuICAgICAgICAgICAgd2hpbGUgKG1hdGNoID0gc2VwYXJhdG9yLmV4ZWMoc3RyaW5nKSkge1xuICAgICAgICAgICAgICAgIC8vIGBzZXBhcmF0b3IubGFzdEluZGV4YCBpcyBub3QgcmVsaWFibGUgY3Jvc3MtYnJvd3NlclxuICAgICAgICAgICAgICAgIGxhc3RJbmRleCA9IG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGlmIChsYXN0SW5kZXggPiBsYXN0TGFzdEluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKHN0cmluZy5zbGljZShsYXN0TGFzdEluZGV4LCBtYXRjaC5pbmRleCkpO1xuICAgICAgICAgICAgICAgICAgICAvLyBGaXggYnJvd3NlcnMgd2hvc2UgYGV4ZWNgIG1ldGhvZHMgZG9uJ3QgY29uc2lzdGVudGx5IHJldHVybiBgdW5kZWZpbmVkYCBmb3JcbiAgICAgICAgICAgICAgICAgICAgLy8gbm9ucGFydGljaXBhdGluZyBjYXB0dXJpbmcgZ3JvdXBzXG4gICAgICAgICAgICAgICAgICAgIGlmICghY29tcGxpYW50RXhlY05wY2cgJiYgbWF0Y2gubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hbMF0ucmVwbGFjZShzZXBhcmF0b3IyLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoIC0gMjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcmd1bWVudHNbaV0gPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hbaV0gPSB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAobWF0Y2gubGVuZ3RoID4gMSAmJiBtYXRjaC5pbmRleCA8IHN0cmluZy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KG91dHB1dCwgbWF0Y2guc2xpY2UoMSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxhc3RMZW5ndGggPSBtYXRjaFswXS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RMYXN0SW5kZXggPSBsYXN0SW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvdXRwdXQubGVuZ3RoID49IGxpbWl0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoc2VwYXJhdG9yLmxhc3RJbmRleCA9PT0gbWF0Y2guaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VwYXJhdG9yLmxhc3RJbmRleCsrOyAvLyBBdm9pZCBhbiBpbmZpbml0ZSBsb29wXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGxhc3RMYXN0SW5kZXggPT09IHN0cmluZy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBpZiAobGFzdExlbmd0aCB8fCAhc2VwYXJhdG9yLnRlc3QoXCJcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goXCJcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChzdHJpbmcuc2xpY2UobGFzdExhc3RJbmRleCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG91dHB1dC5sZW5ndGggPiBsaW1pdCA/IG91dHB1dC5zbGljZSgwLCBsaW1pdCkgOiBvdXRwdXQ7XG4gICAgICAgIH07XG4gICAgfSgpKTtcblxuLy8gW2J1Z2ZpeCwgY2hyb21lXVxuLy8gSWYgc2VwYXJhdG9yIGlzIHVuZGVmaW5lZCwgdGhlbiB0aGUgcmVzdWx0IGFycmF5IGNvbnRhaW5zIGp1c3Qgb25lIFN0cmluZyxcbi8vIHdoaWNoIGlzIHRoZSB0aGlzIHZhbHVlIChjb252ZXJ0ZWQgdG8gYSBTdHJpbmcpLiBJZiBsaW1pdCBpcyBub3QgdW5kZWZpbmVkLFxuLy8gdGhlbiB0aGUgb3V0cHV0IGFycmF5IGlzIHRydW5jYXRlZCBzbyB0aGF0IGl0IGNvbnRhaW5zIG5vIG1vcmUgdGhhbiBsaW1pdFxuLy8gZWxlbWVudHMuXG4vLyBcIjBcIi5zcGxpdCh1bmRlZmluZWQsIDApIC0+IFtdXG59IGVsc2UgaWYgKFwiMFwiLnNwbGl0KHZvaWQgMCwgMCkubGVuZ3RoKSB7XG4gICAgU3RyaW5nLnByb3RvdHlwZS5zcGxpdCA9IGZ1bmN0aW9uKHNlcGFyYXRvciwgbGltaXQpIHtcbiAgICAgICAgaWYgKHNlcGFyYXRvciA9PT0gdm9pZCAwICYmIGxpbWl0ID09PSAwKSByZXR1cm4gW107XG4gICAgICAgIHJldHVybiBzdHJpbmdfc3BsaXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG59XG5cblxuLy8gRUNNQS0yNjIsIDNyZCBCLjIuM1xuLy8gTm90ZSBhbiBFQ01BU2NyaXB0IHN0YW5kYXJ0LCBhbHRob3VnaCBFQ01BU2NyaXB0IDNyZCBFZGl0aW9uIGhhcyBhXG4vLyBub24tbm9ybWF0aXZlIHNlY3Rpb24gc3VnZ2VzdGluZyB1bmlmb3JtIHNlbWFudGljcyBhbmQgaXQgc2hvdWxkIGJlXG4vLyBub3JtYWxpemVkIGFjcm9zcyBhbGwgYnJvd3NlcnNcbi8vIFtidWdmaXgsIElFIGx0IDldIElFIDwgOSBzdWJzdHIoKSB3aXRoIG5lZ2F0aXZlIHZhbHVlIG5vdCB3b3JraW5nIGluIElFXG5pZihcIlwiLnN1YnN0ciAmJiBcIjBiXCIuc3Vic3RyKC0xKSAhPT0gXCJiXCIpIHtcbiAgICB2YXIgc3RyaW5nX3N1YnN0ciA9IFN0cmluZy5wcm90b3R5cGUuc3Vic3RyO1xuICAgIC8qKlxuICAgICAqICBHZXQgdGhlIHN1YnN0cmluZyBvZiBhIHN0cmluZ1xuICAgICAqICBAcGFyYW0gIHtpbnRlZ2VyfSAgc3RhcnQgICB3aGVyZSB0byBzdGFydCB0aGUgc3Vic3RyaW5nXG4gICAgICogIEBwYXJhbSAge2ludGVnZXJ9ICBsZW5ndGggIGhvdyBtYW55IGNoYXJhY3RlcnMgdG8gcmV0dXJuXG4gICAgICogIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cbiAgICBTdHJpbmcucHJvdG90eXBlLnN1YnN0ciA9IGZ1bmN0aW9uKHN0YXJ0LCBsZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHN0cmluZ19zdWJzdHIuY2FsbChcbiAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgICBzdGFydCA8IDAgPyAoKHN0YXJ0ID0gdGhpcy5sZW5ndGggKyBzdGFydCkgPCAwID8gMCA6IHN0YXJ0KSA6IHN0YXJ0LFxuICAgICAgICAgICAgbGVuZ3RoXG4gICAgICAgICk7XG4gICAgfVxufVxuXG4vLyBFUzUgMTUuNS40LjIwXG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS41LjQuMjBcbnZhciB3cyA9IFwiXFx4MDlcXHgwQVxceDBCXFx4MENcXHgwRFxceDIwXFx4QTBcXHUxNjgwXFx1MTgwRVxcdTIwMDBcXHUyMDAxXFx1MjAwMlxcdTIwMDNcIiArXG4gICAgXCJcXHUyMDA0XFx1MjAwNVxcdTIwMDZcXHUyMDA3XFx1MjAwOFxcdTIwMDlcXHUyMDBBXFx1MjAyRlxcdTIwNUZcXHUzMDAwXFx1MjAyOFwiICtcbiAgICBcIlxcdTIwMjlcXHVGRUZGXCI7XG5pZiAoIVN0cmluZy5wcm90b3R5cGUudHJpbSB8fCB3cy50cmltKCkpIHtcbiAgICAvLyBodHRwOi8vYmxvZy5zdGV2ZW5sZXZpdGhhbi5jb20vYXJjaGl2ZXMvZmFzdGVyLXRyaW0tamF2YXNjcmlwdFxuICAgIC8vIGh0dHA6Ly9wZXJmZWN0aW9ua2lsbHMuY29tL3doaXRlc3BhY2UtZGV2aWF0aW9ucy9cbiAgICB3cyA9IFwiW1wiICsgd3MgKyBcIl1cIjtcbiAgICB2YXIgdHJpbUJlZ2luUmVnZXhwID0gbmV3IFJlZ0V4cChcIl5cIiArIHdzICsgd3MgKyBcIipcIiksXG4gICAgICAgIHRyaW1FbmRSZWdleHAgPSBuZXcgUmVnRXhwKHdzICsgd3MgKyBcIiokXCIpO1xuICAgIFN0cmluZy5wcm90b3R5cGUudHJpbSA9IGZ1bmN0aW9uIHRyaW0oKSB7XG4gICAgICAgIGlmICh0aGlzID09PSB2b2lkIDAgfHwgdGhpcyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImNhbid0IGNvbnZlcnQgXCIrdGhpcytcIiB0byBvYmplY3RcIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFN0cmluZyh0aGlzKVxuICAgICAgICAgICAgLnJlcGxhY2UodHJpbUJlZ2luUmVnZXhwLCBcIlwiKVxuICAgICAgICAgICAgLnJlcGxhY2UodHJpbUVuZFJlZ2V4cCwgXCJcIik7XG4gICAgfTtcbn1cblxuLy9cbi8vIFV0aWxcbi8vID09PT09PVxuLy9cblxuLy8gRVM1IDkuNFxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4OS40XG4vLyBodHRwOi8vanNwZXJmLmNvbS90by1pbnRlZ2VyXG5cbmZ1bmN0aW9uIHRvSW50ZWdlcihuKSB7XG4gICAgbiA9ICtuO1xuICAgIGlmIChuICE9PSBuKSB7IC8vIGlzTmFOXG4gICAgICAgIG4gPSAwO1xuICAgIH0gZWxzZSBpZiAobiAhPT0gMCAmJiBuICE9PSAoMS8wKSAmJiBuICE9PSAtKDEvMCkpIHtcbiAgICAgICAgbiA9IChuID4gMCB8fCAtMSkgKiBNYXRoLmZsb29yKE1hdGguYWJzKG4pKTtcbiAgICB9XG4gICAgcmV0dXJuIG47XG59XG5cbmZ1bmN0aW9uIGlzUHJpbWl0aXZlKGlucHV0KSB7XG4gICAgdmFyIHR5cGUgPSB0eXBlb2YgaW5wdXQ7XG4gICAgcmV0dXJuIChcbiAgICAgICAgaW5wdXQgPT09IG51bGwgfHxcbiAgICAgICAgdHlwZSA9PT0gXCJ1bmRlZmluZWRcIiB8fFxuICAgICAgICB0eXBlID09PSBcImJvb2xlYW5cIiB8fFxuICAgICAgICB0eXBlID09PSBcIm51bWJlclwiIHx8XG4gICAgICAgIHR5cGUgPT09IFwic3RyaW5nXCJcbiAgICApO1xufVxuXG5mdW5jdGlvbiB0b1ByaW1pdGl2ZShpbnB1dCkge1xuICAgIHZhciB2YWwsIHZhbHVlT2YsIHRvU3RyaW5nO1xuICAgIGlmIChpc1ByaW1pdGl2ZShpbnB1dCkpIHtcbiAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgIH1cbiAgICB2YWx1ZU9mID0gaW5wdXQudmFsdWVPZjtcbiAgICBpZiAodHlwZW9mIHZhbHVlT2YgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB2YWwgPSB2YWx1ZU9mLmNhbGwoaW5wdXQpO1xuICAgICAgICBpZiAoaXNQcmltaXRpdmUodmFsKSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICB0b1N0cmluZyA9IGlucHV0LnRvU3RyaW5nO1xuICAgIGlmICh0eXBlb2YgdG9TdHJpbmcgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB2YWwgPSB0b1N0cmluZy5jYWxsKGlucHV0KTtcbiAgICAgICAgaWYgKGlzUHJpbWl0aXZlKHZhbCkpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xufVxuXG4vLyBFUzUgOS45XG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3g5LjlcbnZhciB0b09iamVjdCA9IGZ1bmN0aW9uIChvKSB7XG4gICAgaWYgKG8gPT0gbnVsbCkgeyAvLyB0aGlzIG1hdGNoZXMgYm90aCBudWxsIGFuZCB1bmRlZmluZWRcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImNhbid0IGNvbnZlcnQgXCIrbytcIiB0byBvYmplY3RcIik7XG4gICAgfVxuICAgIHJldHVybiBPYmplY3Qobyk7XG59O1xuXG59KTtcblxufSkoKSIsIihmdW5jdGlvbigpey8vIENvcHlyaWdodCAyMDA5LTIwMTIgYnkgY29udHJpYnV0b3JzLCBNSVQgTGljZW5zZVxuLy8gdmltOiB0cz00IHN0cz00IHN3PTQgZXhwYW5kdGFiXG5cbi8vIE1vZHVsZSBzeXN0ZW1zIG1hZ2ljIGRhbmNlXG4oZnVuY3Rpb24gKGRlZmluaXRpb24pIHtcbiAgICAvLyBSZXF1aXJlSlNcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgZGVmaW5lKGRlZmluaXRpb24pO1xuICAgIC8vIFlVSTNcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBZVUkgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIFlVSS5hZGQoXCJlczUtc2hhbVwiLCBkZWZpbml0aW9uKTtcbiAgICAvLyBDb21tb25KUyBhbmQgPHNjcmlwdD5cbiAgICB9IGVsc2Uge1xuICAgICAgICBkZWZpbml0aW9uKCk7XG4gICAgfVxufSkoZnVuY3Rpb24gKCkge1xuXG5cbnZhciBjYWxsID0gRnVuY3Rpb24ucHJvdG90eXBlLmNhbGw7XG52YXIgcHJvdG90eXBlT2ZPYmplY3QgPSBPYmplY3QucHJvdG90eXBlO1xudmFyIG93bnMgPSBjYWxsLmJpbmQocHJvdG90eXBlT2ZPYmplY3QuaGFzT3duUHJvcGVydHkpO1xuXG4vLyBJZiBKUyBlbmdpbmUgc3VwcG9ydHMgYWNjZXNzb3JzIGNyZWF0aW5nIHNob3J0Y3V0cy5cbnZhciBkZWZpbmVHZXR0ZXI7XG52YXIgZGVmaW5lU2V0dGVyO1xudmFyIGxvb2t1cEdldHRlcjtcbnZhciBsb29rdXBTZXR0ZXI7XG52YXIgc3VwcG9ydHNBY2Nlc3NvcnM7XG5pZiAoKHN1cHBvcnRzQWNjZXNzb3JzID0gb3ducyhwcm90b3R5cGVPZk9iamVjdCwgXCJfX2RlZmluZUdldHRlcl9fXCIpKSkge1xuICAgIGRlZmluZUdldHRlciA9IGNhbGwuYmluZChwcm90b3R5cGVPZk9iamVjdC5fX2RlZmluZUdldHRlcl9fKTtcbiAgICBkZWZpbmVTZXR0ZXIgPSBjYWxsLmJpbmQocHJvdG90eXBlT2ZPYmplY3QuX19kZWZpbmVTZXR0ZXJfXyk7XG4gICAgbG9va3VwR2V0dGVyID0gY2FsbC5iaW5kKHByb3RvdHlwZU9mT2JqZWN0Ll9fbG9va3VwR2V0dGVyX18pO1xuICAgIGxvb2t1cFNldHRlciA9IGNhbGwuYmluZChwcm90b3R5cGVPZk9iamVjdC5fX2xvb2t1cFNldHRlcl9fKTtcbn1cblxuLy8gRVM1IDE1LjIuMy4yXG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS4yLjMuMlxuaWYgKCFPYmplY3QuZ2V0UHJvdG90eXBlT2YpIHtcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20va3Jpc2tvd2FsL2VzNS1zaGltL2lzc3VlcyNpc3N1ZS8yXG4gICAgLy8gaHR0cDovL2Vqb2huLm9yZy9ibG9nL29iamVjdGdldHByb3RvdHlwZW9mL1xuICAgIC8vIHJlY29tbWVuZGVkIGJ5IGZzY2hhZWZlciBvbiBnaXRodWJcbiAgICBPYmplY3QuZ2V0UHJvdG90eXBlT2YgPSBmdW5jdGlvbiBnZXRQcm90b3R5cGVPZihvYmplY3QpIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdC5fX3Byb3RvX18gfHwgKFxuICAgICAgICAgICAgb2JqZWN0LmNvbnN0cnVjdG9yXG4gICAgICAgICAgICAgICAgPyBvYmplY3QuY29uc3RydWN0b3IucHJvdG90eXBlXG4gICAgICAgICAgICAgICAgOiBwcm90b3R5cGVPZk9iamVjdFxuICAgICAgICApO1xuICAgIH07XG59XG5cbi8vRVM1IDE1LjIuMy4zXG4vL2h0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjIuMy4zXG5cbmZ1bmN0aW9uIGRvZXNHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JXb3JrKG9iamVjdCkge1xuICAgIHRyeSB7XG4gICAgICAgIG9iamVjdC5zZW50aW5lbCA9IDA7XG4gICAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKFxuICAgICAgICAgICAgICAgIG9iamVjdCxcbiAgICAgICAgICAgICAgICBcInNlbnRpbmVsXCJcbiAgICAgICAgKS52YWx1ZSA9PT0gMDtcbiAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICAgICAgLy8gcmV0dXJucyBmYWxzeVxuICAgIH1cbn1cblxuLy9jaGVjayB3aGV0aGVyIGdldE93blByb3BlcnR5RGVzY3JpcHRvciB3b3JrcyBpZiBpdCdzIGdpdmVuLiBPdGhlcndpc2UsXG4vL3NoaW0gcGFydGlhbGx5LlxuaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkge1xuICAgIHZhciBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JXb3Jrc09uT2JqZWN0ID0gXG4gICAgICAgIGRvZXNHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JXb3JrKHt9KTtcbiAgICB2YXIgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yV29ya3NPbkRvbSA9IHR5cGVvZiBkb2N1bWVudCA9PSBcInVuZGVmaW5lZFwiIHx8XG4gICAgZG9lc0dldE93blByb3BlcnR5RGVzY3JpcHRvcldvcmsoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSk7XG4gICAgaWYgKCFnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JXb3Jrc09uRG9tIHx8IFxuICAgICAgICAgICAgIWdldE93blByb3BlcnR5RGVzY3JpcHRvcldvcmtzT25PYmplY3RcbiAgICApIHtcbiAgICAgICAgdmFyIGdldE93blByb3BlcnR5RGVzY3JpcHRvckZhbGxiYWNrID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbiAgICB9XG59XG5cbmlmICghT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvciB8fCBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JGYWxsYmFjaykge1xuICAgIHZhciBFUlJfTk9OX09CSkVDVCA9IFwiT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvciBjYWxsZWQgb24gYSBub24tb2JqZWN0OiBcIjtcblxuICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBwcm9wZXJ0eSkge1xuICAgICAgICBpZiAoKHR5cGVvZiBvYmplY3QgIT0gXCJvYmplY3RcIiAmJiB0eXBlb2Ygb2JqZWN0ICE9IFwiZnVuY3Rpb25cIikgfHwgb2JqZWN0ID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEVSUl9OT05fT0JKRUNUICsgb2JqZWN0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG1ha2UgYSB2YWxpYW50IGF0dGVtcHQgdG8gdXNlIHRoZSByZWFsIGdldE93blByb3BlcnR5RGVzY3JpcHRvclxuICAgICAgICAvLyBmb3IgSTgncyBET00gZWxlbWVudHMuXG4gICAgICAgIGlmIChnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JGYWxsYmFjaykge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yRmFsbGJhY2suY2FsbChPYmplY3QsIG9iamVjdCwgcHJvcGVydHkpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgICAgICAgICAgICAgLy8gdHJ5IHRoZSBzaGltIGlmIHRoZSByZWFsIG9uZSBkb2Vzbid0IHdvcmtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIG9iamVjdCBkb2VzIG5vdCBvd25zIHByb3BlcnR5IHJldHVybiB1bmRlZmluZWQgaW1tZWRpYXRlbHkuXG4gICAgICAgIGlmICghb3ducyhvYmplY3QsIHByb3BlcnR5KSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgb2JqZWN0IGhhcyBhIHByb3BlcnR5IHRoZW4gaXQncyBmb3Igc3VyZSBib3RoIGBlbnVtZXJhYmxlYCBhbmRcbiAgICAgICAgLy8gYGNvbmZpZ3VyYWJsZWAuXG4gICAgICAgIHZhciBkZXNjcmlwdG9yID0gIHsgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH07XG5cbiAgICAgICAgLy8gSWYgSlMgZW5naW5lIHN1cHBvcnRzIGFjY2Vzc29yIHByb3BlcnRpZXMgdGhlbiBwcm9wZXJ0eSBtYXkgYmUgYVxuICAgICAgICAvLyBnZXR0ZXIgb3Igc2V0dGVyLlxuICAgICAgICBpZiAoc3VwcG9ydHNBY2Nlc3NvcnMpIHtcbiAgICAgICAgICAgIC8vIFVuZm9ydHVuYXRlbHkgYF9fbG9va3VwR2V0dGVyX19gIHdpbGwgcmV0dXJuIGEgZ2V0dGVyIGV2ZW5cbiAgICAgICAgICAgIC8vIGlmIG9iamVjdCBoYXMgb3duIG5vbiBnZXR0ZXIgcHJvcGVydHkgYWxvbmcgd2l0aCBhIHNhbWUgbmFtZWRcbiAgICAgICAgICAgIC8vIGluaGVyaXRlZCBnZXR0ZXIuIFRvIGF2b2lkIG1pc2JlaGF2aW9yIHdlIHRlbXBvcmFyeSByZW1vdmVcbiAgICAgICAgICAgIC8vIGBfX3Byb3RvX19gIHNvIHRoYXQgYF9fbG9va3VwR2V0dGVyX19gIHdpbGwgcmV0dXJuIGdldHRlciBvbmx5XG4gICAgICAgICAgICAvLyBpZiBpdCdzIG93bmVkIGJ5IGFuIG9iamVjdC5cbiAgICAgICAgICAgIHZhciBwcm90b3R5cGUgPSBvYmplY3QuX19wcm90b19fO1xuICAgICAgICAgICAgb2JqZWN0Ll9fcHJvdG9fXyA9IHByb3RvdHlwZU9mT2JqZWN0O1xuXG4gICAgICAgICAgICB2YXIgZ2V0dGVyID0gbG9va3VwR2V0dGVyKG9iamVjdCwgcHJvcGVydHkpO1xuICAgICAgICAgICAgdmFyIHNldHRlciA9IGxvb2t1cFNldHRlcihvYmplY3QsIHByb3BlcnR5KTtcblxuICAgICAgICAgICAgLy8gT25jZSB3ZSBoYXZlIGdldHRlciBhbmQgc2V0dGVyIHdlIGNhbiBwdXQgdmFsdWVzIGJhY2suXG4gICAgICAgICAgICBvYmplY3QuX19wcm90b19fID0gcHJvdG90eXBlO1xuXG4gICAgICAgICAgICBpZiAoZ2V0dGVyIHx8IHNldHRlcikge1xuICAgICAgICAgICAgICAgIGlmIChnZXR0ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRvci5nZXQgPSBnZXR0ZXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzZXR0ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRvci5zZXQgPSBzZXR0ZXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIElmIGl0IHdhcyBhY2Nlc3NvciBwcm9wZXJ0eSB3ZSdyZSBkb25lIGFuZCByZXR1cm4gaGVyZVxuICAgICAgICAgICAgICAgIC8vIGluIG9yZGVyIHRvIGF2b2lkIGFkZGluZyBgdmFsdWVgIHRvIHRoZSBkZXNjcmlwdG9yLlxuICAgICAgICAgICAgICAgIHJldHVybiBkZXNjcmlwdG9yO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgd2UgZ290IHRoaXMgZmFyIHdlIGtub3cgdGhhdCBvYmplY3QgaGFzIGFuIG93biBwcm9wZXJ0eSB0aGF0IGlzXG4gICAgICAgIC8vIG5vdCBhbiBhY2Nlc3NvciBzbyB3ZSBzZXQgaXQgYXMgYSB2YWx1ZSBhbmQgcmV0dXJuIGRlc2NyaXB0b3IuXG4gICAgICAgIGRlc2NyaXB0b3IudmFsdWUgPSBvYmplY3RbcHJvcGVydHldO1xuICAgICAgICBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIGRlc2NyaXB0b3I7XG4gICAgfTtcbn1cblxuLy8gRVM1IDE1LjIuMy40XG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS4yLjMuNFxuaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcykge1xuICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhvYmplY3QpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKG9iamVjdCk7XG4gICAgfTtcbn1cblxuLy8gRVM1IDE1LjIuMy41XG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS4yLjMuNVxuaWYgKCFPYmplY3QuY3JlYXRlKSB7XG5cbiAgICAvLyBDb250cmlidXRlZCBieSBCcmFuZG9uIEJlbnZpZSwgT2N0b2JlciwgMjAxMlxuICAgIHZhciBjcmVhdGVFbXB0eTtcbiAgICB2YXIgc3VwcG9ydHNQcm90byA9IE9iamVjdC5wcm90b3R5cGUuX19wcm90b19fID09PSBudWxsO1xuICAgIGlmIChzdXBwb3J0c1Byb3RvIHx8IHR5cGVvZiBkb2N1bWVudCA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBjcmVhdGVFbXB0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB7IFwiX19wcm90b19fXCI6IG51bGwgfTtcbiAgICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBJbiBvbGQgSUUgX19wcm90b19fIGNhbid0IGJlIHVzZWQgdG8gbWFudWFsbHkgc2V0IGBudWxsYCwgbm9yIGRvZXNcbiAgICAgICAgLy8gYW55IG90aGVyIG1ldGhvZCBleGlzdCB0byBtYWtlIGFuIG9iamVjdCB0aGF0IGluaGVyaXRzIGZyb20gbm90aGluZyxcbiAgICAgICAgLy8gYXNpZGUgZnJvbSBPYmplY3QucHJvdG90eXBlIGl0c2VsZi4gSW5zdGVhZCwgY3JlYXRlIGEgbmV3IGdsb2JhbFxuICAgICAgICAvLyBvYmplY3QgYW5kICpzdGVhbCogaXRzIE9iamVjdC5wcm90b3R5cGUgYW5kIHN0cmlwIGl0IGJhcmUuIFRoaXMgaXNcbiAgICAgICAgLy8gdXNlZCBhcyB0aGUgcHJvdG90eXBlIHRvIGNyZWF0ZSBudWxsYXJ5IG9iamVjdHMuXG4gICAgICAgIGNyZWF0ZUVtcHR5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGlmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpO1xuICAgICAgICAgICAgdmFyIHBhcmVudCA9IGRvY3VtZW50LmJvZHkgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgICAgICAgaWZyYW1lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcbiAgICAgICAgICAgIGlmcmFtZS5zcmMgPSAnamF2YXNjcmlwdDonO1xuICAgICAgICAgICAgdmFyIGVtcHR5ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuT2JqZWN0LnByb3RvdHlwZTtcbiAgICAgICAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChpZnJhbWUpO1xuICAgICAgICAgICAgaWZyYW1lID0gbnVsbDtcbiAgICAgICAgICAgIGRlbGV0ZSBlbXB0eS5jb25zdHJ1Y3RvcjtcbiAgICAgICAgICAgIGRlbGV0ZSBlbXB0eS5oYXNPd25Qcm9wZXJ0eTtcbiAgICAgICAgICAgIGRlbGV0ZSBlbXB0eS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcbiAgICAgICAgICAgIGRlbGV0ZSBlbXB0eS5pc1Byb3RvdHlwZU9mO1xuICAgICAgICAgICAgZGVsZXRlIGVtcHR5LnRvTG9jYWxlU3RyaW5nO1xuICAgICAgICAgICAgZGVsZXRlIGVtcHR5LnRvU3RyaW5nO1xuICAgICAgICAgICAgZGVsZXRlIGVtcHR5LnZhbHVlT2Y7XG4gICAgICAgICAgICBlbXB0eS5fX3Byb3RvX18gPSBudWxsO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBFbXB0eSgpIHt9XG4gICAgICAgICAgICBFbXB0eS5wcm90b3R5cGUgPSBlbXB0eTtcbiAgICAgICAgICAgIC8vIHNob3J0LWNpcmN1aXQgZnV0dXJlIGNhbGxzXG4gICAgICAgICAgICBjcmVhdGVFbXB0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEVtcHR5KCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBFbXB0eSgpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIE9iamVjdC5jcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUocHJvdG90eXBlLCBwcm9wZXJ0aWVzKSB7XG5cbiAgICAgICAgdmFyIG9iamVjdDtcbiAgICAgICAgZnVuY3Rpb24gVHlwZSgpIHt9ICAvLyBBbiBlbXB0eSBjb25zdHJ1Y3Rvci5cblxuICAgICAgICBpZiAocHJvdG90eXBlID09PSBudWxsKSB7XG4gICAgICAgICAgICBvYmplY3QgPSBjcmVhdGVFbXB0eSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBwcm90b3R5cGUgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIHByb3RvdHlwZSAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgLy8gSW4gdGhlIG5hdGl2ZSBpbXBsZW1lbnRhdGlvbiBgcGFyZW50YCBjYW4gYmUgYG51bGxgXG4gICAgICAgICAgICAgICAgLy8gT1IgKmFueSogYGluc3RhbmNlb2YgT2JqZWN0YCAgKE9iamVjdHxGdW5jdGlvbnxBcnJheXxSZWdFeHB8ZXRjKVxuICAgICAgICAgICAgICAgIC8vIFVzZSBgdHlwZW9mYCB0aG8sIGIvYyBpbiBvbGQgSUUsIERPTSBlbGVtZW50cyBhcmUgbm90IGBpbnN0YW5jZW9mIE9iamVjdGBcbiAgICAgICAgICAgICAgICAvLyBsaWtlIHRoZXkgYXJlIGluIG1vZGVybiBicm93c2Vycy4gVXNpbmcgYE9iamVjdC5jcmVhdGVgIG9uIERPTSBlbGVtZW50c1xuICAgICAgICAgICAgICAgIC8vIGlzLi4uZXJyLi4ucHJvYmFibHkgaW5hcHByb3ByaWF0ZSwgYnV0IHRoZSBuYXRpdmUgdmVyc2lvbiBhbGxvd3MgZm9yIGl0LlxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJPYmplY3QgcHJvdG90eXBlIG1heSBvbmx5IGJlIGFuIE9iamVjdCBvciBudWxsXCIpOyAvLyBzYW1lIG1zZyBhcyBDaHJvbWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFR5cGUucHJvdG90eXBlID0gcHJvdG90eXBlO1xuICAgICAgICAgICAgb2JqZWN0ID0gbmV3IFR5cGUoKTtcbiAgICAgICAgICAgIC8vIElFIGhhcyBubyBidWlsdC1pbiBpbXBsZW1lbnRhdGlvbiBvZiBgT2JqZWN0LmdldFByb3RvdHlwZU9mYFxuICAgICAgICAgICAgLy8gbmVpdGhlciBgX19wcm90b19fYCwgYnV0IHRoaXMgbWFudWFsbHkgc2V0dGluZyBgX19wcm90b19fYCB3aWxsXG4gICAgICAgICAgICAvLyBndWFyYW50ZWUgdGhhdCBgT2JqZWN0LmdldFByb3RvdHlwZU9mYCB3aWxsIHdvcmsgYXMgZXhwZWN0ZWQgd2l0aFxuICAgICAgICAgICAgLy8gb2JqZWN0cyBjcmVhdGVkIHVzaW5nIGBPYmplY3QuY3JlYXRlYFxuICAgICAgICAgICAgb2JqZWN0Ll9fcHJvdG9fXyA9IHByb3RvdHlwZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcm9wZXJ0aWVzICE9PSB2b2lkIDApIHtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKG9iamVjdCwgcHJvcGVydGllcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH07XG59XG5cbi8vIEVTNSAxNS4yLjMuNlxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuMi4zLjZcblxuLy8gUGF0Y2ggZm9yIFdlYktpdCBhbmQgSUU4IHN0YW5kYXJkIG1vZGVcbi8vIERlc2lnbmVkIGJ5IGhheCA8aGF4LmdpdGh1Yi5jb20+XG4vLyByZWxhdGVkIGlzc3VlOiBodHRwczovL2dpdGh1Yi5jb20va3Jpc2tvd2FsL2VzNS1zaGltL2lzc3VlcyNpc3N1ZS81XG4vLyBJRTggUmVmZXJlbmNlOlxuLy8gICAgIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9kZDI4MjkwMC5hc3B4XG4vLyAgICAgaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L2RkMjI5OTE2LmFzcHhcbi8vIFdlYktpdCBCdWdzOlxuLy8gICAgIGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0zNjQyM1xuXG5mdW5jdGlvbiBkb2VzRGVmaW5lUHJvcGVydHlXb3JrKG9iamVjdCkge1xuICAgIHRyeSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIFwic2VudGluZWxcIiwge30pO1xuICAgICAgICByZXR1cm4gXCJzZW50aW5lbFwiIGluIG9iamVjdDtcbiAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICAgICAgLy8gcmV0dXJucyBmYWxzeVxuICAgIH1cbn1cblxuLy8gY2hlY2sgd2hldGhlciBkZWZpbmVQcm9wZXJ0eSB3b3JrcyBpZiBpdCdzIGdpdmVuLiBPdGhlcndpc2UsXG4vLyBzaGltIHBhcnRpYWxseS5cbmlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHtcbiAgICB2YXIgZGVmaW5lUHJvcGVydHlXb3Jrc09uT2JqZWN0ID0gZG9lc0RlZmluZVByb3BlcnR5V29yayh7fSk7XG4gICAgdmFyIGRlZmluZVByb3BlcnR5V29ya3NPbkRvbSA9IHR5cGVvZiBkb2N1bWVudCA9PSBcInVuZGVmaW5lZFwiIHx8XG4gICAgICAgIGRvZXNEZWZpbmVQcm9wZXJ0eVdvcmsoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSk7XG4gICAgaWYgKCFkZWZpbmVQcm9wZXJ0eVdvcmtzT25PYmplY3QgfHwgIWRlZmluZVByb3BlcnR5V29ya3NPbkRvbSkge1xuICAgICAgICB2YXIgZGVmaW5lUHJvcGVydHlGYWxsYmFjayA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSxcbiAgICAgICAgICAgIGRlZmluZVByb3BlcnRpZXNGYWxsYmFjayA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzO1xuICAgIH1cbn1cblxuaWYgKCFPYmplY3QuZGVmaW5lUHJvcGVydHkgfHwgZGVmaW5lUHJvcGVydHlGYWxsYmFjaykge1xuICAgIHZhciBFUlJfTk9OX09CSkVDVF9ERVNDUklQVE9SID0gXCJQcm9wZXJ0eSBkZXNjcmlwdGlvbiBtdXN0IGJlIGFuIG9iamVjdDogXCI7XG4gICAgdmFyIEVSUl9OT05fT0JKRUNUX1RBUkdFVCA9IFwiT2JqZWN0LmRlZmluZVByb3BlcnR5IGNhbGxlZCBvbiBub24tb2JqZWN0OiBcIlxuICAgIHZhciBFUlJfQUNDRVNTT1JTX05PVF9TVVBQT1JURUQgPSBcImdldHRlcnMgJiBzZXR0ZXJzIGNhbiBub3QgYmUgZGVmaW5lZCBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwib24gdGhpcyBqYXZhc2NyaXB0IGVuZ2luZVwiO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5ID0gZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkob2JqZWN0LCBwcm9wZXJ0eSwgZGVzY3JpcHRvcikge1xuICAgICAgICBpZiAoKHR5cGVvZiBvYmplY3QgIT0gXCJvYmplY3RcIiAmJiB0eXBlb2Ygb2JqZWN0ICE9IFwiZnVuY3Rpb25cIikgfHwgb2JqZWN0ID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEVSUl9OT05fT0JKRUNUX1RBUkdFVCArIG9iamVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCh0eXBlb2YgZGVzY3JpcHRvciAhPSBcIm9iamVjdFwiICYmIHR5cGVvZiBkZXNjcmlwdG9yICE9IFwiZnVuY3Rpb25cIikgfHwgZGVzY3JpcHRvciA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihFUlJfTk9OX09CSkVDVF9ERVNDUklQVE9SICsgZGVzY3JpcHRvcik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gbWFrZSBhIHZhbGlhbnQgYXR0ZW1wdCB0byB1c2UgdGhlIHJlYWwgZGVmaW5lUHJvcGVydHlcbiAgICAgICAgLy8gZm9yIEk4J3MgRE9NIGVsZW1lbnRzLlxuICAgICAgICBpZiAoZGVmaW5lUHJvcGVydHlGYWxsYmFjaykge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVmaW5lUHJvcGVydHlGYWxsYmFjay5jYWxsKE9iamVjdCwgb2JqZWN0LCBwcm9wZXJ0eSwgZGVzY3JpcHRvcik7XG4gICAgICAgICAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICAgICAgICAgICAgICAvLyB0cnkgdGhlIHNoaW0gaWYgdGhlIHJlYWwgb25lIGRvZXNuJ3Qgd29ya1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgaXQncyBhIGRhdGEgcHJvcGVydHkuXG4gICAgICAgIGlmIChvd25zKGRlc2NyaXB0b3IsIFwidmFsdWVcIikpIHtcbiAgICAgICAgICAgIC8vIGZhaWwgc2lsZW50bHkgaWYgXCJ3cml0YWJsZVwiLCBcImVudW1lcmFibGVcIiwgb3IgXCJjb25maWd1cmFibGVcIlxuICAgICAgICAgICAgLy8gYXJlIHJlcXVlc3RlZCBidXQgbm90IHN1cHBvcnRlZFxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIC8vIGFsdGVybmF0ZSBhcHByb2FjaDpcbiAgICAgICAgICAgIGlmICggLy8gY2FuJ3QgaW1wbGVtZW50IHRoZXNlIGZlYXR1cmVzOyBhbGxvdyBmYWxzZSBidXQgbm90IHRydWVcbiAgICAgICAgICAgICAgICAhKG93bnMoZGVzY3JpcHRvciwgXCJ3cml0YWJsZVwiKSA/IGRlc2NyaXB0b3Iud3JpdGFibGUgOiB0cnVlKSB8fFxuICAgICAgICAgICAgICAgICEob3ducyhkZXNjcmlwdG9yLCBcImVudW1lcmFibGVcIikgPyBkZXNjcmlwdG9yLmVudW1lcmFibGUgOiB0cnVlKSB8fFxuICAgICAgICAgICAgICAgICEob3ducyhkZXNjcmlwdG9yLCBcImNvbmZpZ3VyYWJsZVwiKSA/IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlIDogdHJ1ZSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgXCJUaGlzIGltcGxlbWVudGF0aW9uIG9mIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBkb2VzIG5vdCBcIiArXG4gICAgICAgICAgICAgICAgICAgIFwic3VwcG9ydCBjb25maWd1cmFibGUsIGVudW1lcmFibGUsIG9yIHdyaXRhYmxlLlwiXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIGlmIChzdXBwb3J0c0FjY2Vzc29ycyAmJiAobG9va3VwR2V0dGVyKG9iamVjdCwgcHJvcGVydHkpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvb2t1cFNldHRlcihvYmplY3QsIHByb3BlcnR5KSkpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgLy8gQXMgYWNjZXNzb3JzIGFyZSBzdXBwb3J0ZWQgb25seSBvbiBlbmdpbmVzIGltcGxlbWVudGluZ1xuICAgICAgICAgICAgICAgIC8vIGBfX3Byb3RvX19gIHdlIGNhbiBzYWZlbHkgb3ZlcnJpZGUgYF9fcHJvdG9fX2Agd2hpbGUgZGVmaW5pbmdcbiAgICAgICAgICAgICAgICAvLyBhIHByb3BlcnR5IHRvIG1ha2Ugc3VyZSB0aGF0IHdlIGRvbid0IGhpdCBhbiBpbmhlcml0ZWRcbiAgICAgICAgICAgICAgICAvLyBhY2Nlc3Nvci5cbiAgICAgICAgICAgICAgICB2YXIgcHJvdG90eXBlID0gb2JqZWN0Ll9fcHJvdG9fXztcbiAgICAgICAgICAgICAgICBvYmplY3QuX19wcm90b19fID0gcHJvdG90eXBlT2ZPYmplY3Q7XG4gICAgICAgICAgICAgICAgLy8gRGVsZXRpbmcgYSBwcm9wZXJ0eSBhbnl3YXkgc2luY2UgZ2V0dGVyIC8gc2V0dGVyIG1heSBiZVxuICAgICAgICAgICAgICAgIC8vIGRlZmluZWQgb24gb2JqZWN0IGl0c2VsZi5cbiAgICAgICAgICAgICAgICBkZWxldGUgb2JqZWN0W3Byb3BlcnR5XTtcbiAgICAgICAgICAgICAgICBvYmplY3RbcHJvcGVydHldID0gZGVzY3JpcHRvci52YWx1ZTtcbiAgICAgICAgICAgICAgICAvLyBTZXR0aW5nIG9yaWdpbmFsIGBfX3Byb3RvX19gIGJhY2sgbm93LlxuICAgICAgICAgICAgICAgIG9iamVjdC5fX3Byb3RvX18gPSBwcm90b3R5cGU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG9iamVjdFtwcm9wZXJ0eV0gPSBkZXNjcmlwdG9yLnZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCFzdXBwb3J0c0FjY2Vzc29ycykge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRVJSX0FDQ0VTU09SU19OT1RfU1VQUE9SVEVEKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIElmIHdlIGdvdCB0aGF0IGZhciB0aGVuIGdldHRlcnMgYW5kIHNldHRlcnMgY2FuIGJlIGRlZmluZWQgISFcbiAgICAgICAgICAgIGlmIChvd25zKGRlc2NyaXB0b3IsIFwiZ2V0XCIpKSB7XG4gICAgICAgICAgICAgICAgZGVmaW5lR2V0dGVyKG9iamVjdCwgcHJvcGVydHksIGRlc2NyaXB0b3IuZ2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvd25zKGRlc2NyaXB0b3IsIFwic2V0XCIpKSB7XG4gICAgICAgICAgICAgICAgZGVmaW5lU2V0dGVyKG9iamVjdCwgcHJvcGVydHksIGRlc2NyaXB0b3Iuc2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH07XG59XG5cbi8vIEVTNSAxNS4yLjMuN1xuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuMi4zLjdcbmlmICghT2JqZWN0LmRlZmluZVByb3BlcnRpZXMgfHwgZGVmaW5lUHJvcGVydGllc0ZhbGxiYWNrKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKG9iamVjdCwgcHJvcGVydGllcykge1xuICAgICAgICAvLyBtYWtlIGEgdmFsaWFudCBhdHRlbXB0IHRvIHVzZSB0aGUgcmVhbCBkZWZpbmVQcm9wZXJ0aWVzXG4gICAgICAgIGlmIChkZWZpbmVQcm9wZXJ0aWVzRmFsbGJhY2spIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZmluZVByb3BlcnRpZXNGYWxsYmFjay5jYWxsKE9iamVjdCwgb2JqZWN0LCBwcm9wZXJ0aWVzKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgICAgICAgICAgICAgIC8vIHRyeSB0aGUgc2hpbSBpZiB0aGUgcmVhbCBvbmUgZG9lc24ndCB3b3JrXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBwcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICBpZiAob3ducyhwcm9wZXJ0aWVzLCBwcm9wZXJ0eSkgJiYgcHJvcGVydHkgIT0gXCJfX3Byb3RvX19cIikge1xuICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIHByb3BlcnR5LCBwcm9wZXJ0aWVzW3Byb3BlcnR5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9O1xufVxuXG4vLyBFUzUgMTUuMi4zLjhcbi8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjIuMy44XG5pZiAoIU9iamVjdC5zZWFsKSB7XG4gICAgT2JqZWN0LnNlYWwgPSBmdW5jdGlvbiBzZWFsKG9iamVjdCkge1xuICAgICAgICAvLyB0aGlzIGlzIG1pc2xlYWRpbmcgYW5kIGJyZWFrcyBmZWF0dXJlLWRldGVjdGlvbiwgYnV0XG4gICAgICAgIC8vIGFsbG93cyBcInNlY3VyYWJsZVwiIGNvZGUgdG8gXCJncmFjZWZ1bGx5XCIgZGVncmFkZSB0byB3b3JraW5nXG4gICAgICAgIC8vIGJ1dCBpbnNlY3VyZSBjb2RlLlxuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH07XG59XG5cbi8vIEVTNSAxNS4yLjMuOVxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuMi4zLjlcbmlmICghT2JqZWN0LmZyZWV6ZSkge1xuICAgIE9iamVjdC5mcmVlemUgPSBmdW5jdGlvbiBmcmVlemUob2JqZWN0KSB7XG4gICAgICAgIC8vIHRoaXMgaXMgbWlzbGVhZGluZyBhbmQgYnJlYWtzIGZlYXR1cmUtZGV0ZWN0aW9uLCBidXRcbiAgICAgICAgLy8gYWxsb3dzIFwic2VjdXJhYmxlXCIgY29kZSB0byBcImdyYWNlZnVsbHlcIiBkZWdyYWRlIHRvIHdvcmtpbmdcbiAgICAgICAgLy8gYnV0IGluc2VjdXJlIGNvZGUuXG4gICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfTtcbn1cblxuLy8gZGV0ZWN0IGEgUmhpbm8gYnVnIGFuZCBwYXRjaCBpdFxudHJ5IHtcbiAgICBPYmplY3QuZnJlZXplKGZ1bmN0aW9uICgpIHt9KTtcbn0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIE9iamVjdC5mcmVlemUgPSAoZnVuY3Rpb24gZnJlZXplKGZyZWV6ZU9iamVjdCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gZnJlZXplKG9iamVjdCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBvYmplY3QgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZyZWV6ZU9iamVjdChvYmplY3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pKE9iamVjdC5mcmVlemUpO1xufVxuXG4vLyBFUzUgMTUuMi4zLjEwXG4vLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS4yLjMuMTBcbmlmICghT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zKSB7XG4gICAgT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zID0gZnVuY3Rpb24gcHJldmVudEV4dGVuc2lvbnMob2JqZWN0KSB7XG4gICAgICAgIC8vIHRoaXMgaXMgbWlzbGVhZGluZyBhbmQgYnJlYWtzIGZlYXR1cmUtZGV0ZWN0aW9uLCBidXRcbiAgICAgICAgLy8gYWxsb3dzIFwic2VjdXJhYmxlXCIgY29kZSB0byBcImdyYWNlZnVsbHlcIiBkZWdyYWRlIHRvIHdvcmtpbmdcbiAgICAgICAgLy8gYnV0IGluc2VjdXJlIGNvZGUuXG4gICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfTtcbn1cblxuLy8gRVM1IDE1LjIuMy4xMVxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuMi4zLjExXG5pZiAoIU9iamVjdC5pc1NlYWxlZCkge1xuICAgIE9iamVjdC5pc1NlYWxlZCA9IGZ1bmN0aW9uIGlzU2VhbGVkKG9iamVjdCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbn1cblxuLy8gRVM1IDE1LjIuMy4xMlxuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuMi4zLjEyXG5pZiAoIU9iamVjdC5pc0Zyb3plbikge1xuICAgIE9iamVjdC5pc0Zyb3plbiA9IGZ1bmN0aW9uIGlzRnJvemVuKG9iamVjdCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbn1cblxuLy8gRVM1IDE1LjIuMy4xM1xuLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuMi4zLjEzXG5pZiAoIU9iamVjdC5pc0V4dGVuc2libGUpIHtcbiAgICBPYmplY3QuaXNFeHRlbnNpYmxlID0gZnVuY3Rpb24gaXNFeHRlbnNpYmxlKG9iamVjdCkge1xuICAgICAgICAvLyAxLiBJZiBUeXBlKE8pIGlzIG5vdCBPYmplY3QgdGhyb3cgYSBUeXBlRXJyb3IgZXhjZXB0aW9uLlxuICAgICAgICBpZiAoT2JqZWN0KG9iamVjdCkgIT09IG9iamVjdCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpOyAvLyBUT0RPIG1lc3NhZ2VcbiAgICAgICAgfVxuICAgICAgICAvLyAyLiBSZXR1cm4gdGhlIEJvb2xlYW4gdmFsdWUgb2YgdGhlIFtbRXh0ZW5zaWJsZV1dIGludGVybmFsIHByb3BlcnR5IG9mIE8uXG4gICAgICAgIHZhciBuYW1lID0gJyc7XG4gICAgICAgIHdoaWxlIChvd25zKG9iamVjdCwgbmFtZSkpIHtcbiAgICAgICAgICAgIG5hbWUgKz0gJz8nO1xuICAgICAgICB9XG4gICAgICAgIG9iamVjdFtuYW1lXSA9IHRydWU7XG4gICAgICAgIHZhciByZXR1cm5WYWx1ZSA9IG93bnMob2JqZWN0LCBuYW1lKTtcbiAgICAgICAgZGVsZXRlIG9iamVjdFtuYW1lXTtcbiAgICAgICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICAgIH07XG59XG5cbn0pO1xuXG59KSgpIiwidmFyIG9iaiA9IHJlcXVpcmUoJy4uL29iamVjdCcpLFxuICAgIGFycmF5ID0gcmVxdWlyZSgnLi4vYXJyYXknKSxcbiAgICBhcHBseSA9IG9iai5hcHBseSxcbiAgICBtaXggPSBvYmoubWl4LFxuICAgIG9GaWx0ZXIgPSBvYmouZmlsdGVyLFxuICAgIGVtcHR5Rm4gPSAoJy4uL2Z1bmN0aW9uJykuZW1wdHlGbixcbiAgICBpcyA9IHJlcXVpcmUoJy4uL2lzJyk7XG5cbi8qKlxuICogQGNsYXNzICBMdWMuQ29tcG9zaXRpb25cbiAqIEBwcm90ZWN0ZWRcbiAqIENsYXNzIHRoYXQgd3JhcHMge0BsaW5rIEx1Yy5kZWZpbmUjJGNvbXBvc2l0aW9ucyBjb21wb3NpdGlvbn0gY29uZmlnIG9iamVjdHNcbiAqIHRvIGNvbmZvcm0gdG8gYW4gYXBpLiBUaGlzIGNsYXNzIGlzIG5vdCBhdmFpbGFibGUgZXh0ZXJuYWxseS4gIFRoZSBjb25maWcgb2JqZWN0XG4gKiB3aWxsIG92ZXJyaWRlIGFueSBwcm90ZWN0ZWQgbWV0aG9kcyBhbmQgZGVmYXVsdCBjb25maWdzLiAgRGVmYXVsdHNcbiAqIGNhbiBiZSB1c2VkIGZvciBvZnRlbiB1c2VkIGNvbmZpZ3MsIGtleXMgdGhhdCBhcmUgbm90IGRlZmF1bHRzIHdpbGxcbiAqIG92ZXJyaWRlIHRoZSBkZWZhdWx0cy5cbiAqXG4gICAgdmFyIEMgPSBMdWMuZGVmaW5lKHtcbiAgICAgICAgJGNvbXBvc2l0aW9uczoge1xuICAgICAgICAgICAgZGVmYXVsdHM6IEx1Yy5jb21wb3NpdGlvbkVudW1zLkV2ZW50RW1pdHRlcixcbiAgICAgICAgICAgIG1ldGhvZHM6IFsnZW1pdCddXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciBjID0gbmV3IEMoKVxuICAgIHR5cGVvZiBjLmVtaXRcbiAgICA+XCJmdW5jdGlvblwiXG4gICAgdHlwZW9mIGMub25cbiAgICA+XCJ1bmRlZmluZWRcIlxuICpcbiAqIElmIHlvdSB3YW50IHRvIGFkZCB5b3VyIG93biBjb21wb3NpdGlvbiBhbGwgeW91IG5lZWQgdG8gaGF2ZSBpc1xuICogYSBuYW1lIGFuZCBhIENvbnN0cnVjdG9yLCB0aGUgcmVzdCBvZiB0aGUgY29uZmlncyBvZiB0aGlzIGNsYXNzIGFuZCBMdWMuQ29tcG9zaXRpb24uY3JlYXRlXG4gKiBjYW4gYmUgdXNlZCB0byBpbmplY3QgYmVoYXZpb3IgaWYgbmVlZGVkLlxuICogXG4gICAgIGZ1bmN0aW9uIENvdW50ZXIoKSB7XG4gICAgICAgIHRoaXMuY291bnQgPSAwO1xuICAgICB9O1xuXG4gICAgIENvdW50ZXIucHJvdG90eXBlID0ge1xuICAgICAgICBnZXRDb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb3VudDtcbiAgICAgICAgfSxcbiAgICAgICAgaW5jcmVhc2VDb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLmNvdW50Kys7XG4gICAgICAgIH1cbiAgICAgfVxuXG4gICAgIHZhciBDID0gTHVjLmRlZmluZSh7XG4gICAgICAgICAgICAkY29tcG9zaXRpb25zOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2NvdW50ZXInLFxuICAgICAgICAgICAgICAgIENvbnN0cnVjdG9yOiBDb3VudGVyLFxuICAgICAgICAgICAgICAgIG1ldGhvZHM6ICdhbGxNZXRob2RzJ1xuICAgICAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIGMgPSBuZXcgQygpXG5cbiAgICBjLmluY3JlYXNlQ291bnQoKTtcbiAgICBjLmluY3JlYXNlQ291bnQoKTtcbiAgICBjLmluY3JlYXNlQ291bnQoKTtcbiAgICBjLmdldENvdW50KCk7XG4gICAgPjNcbiAgICBjLmNvdW50XG4gICAgPnVuZGVmaW5lZFxuICovXG5mdW5jdGlvbiBDb21wb3NpdGlvbihjKSB7XG4gICAgdmFyIGRlZmF1bHRzID0gYy5kZWZhdWx0cyxcbiAgICAgICAgY29uZmlnID0gYztcblxuICAgIGlmKGRlZmF1bHRzKSB7XG4gICAgICAgIG1peChjb25maWcsIGNvbmZpZy5kZWZhdWx0cyk7XG4gICAgICAgIGRlbGV0ZSBjb25maWcuZGVmYXVsdHM7XG4gICAgfVxuXG4gICAgYXBwbHkodGhpcywgY29uZmlnKTtcbn1cblxuQ29tcG9zaXRpb24ucHJvdG90eXBlID0ge1xuICAgIC8qKlxuICAgICAqIEBjZmcge1N0cmluZ30gbmFtZSAocmVxdWlyZWQpIHRoZSBuYW1lIHdoaWNoIHRoZSBjb21wb3NpdGlvblxuICAgICAqIHdpbGwgYmUgcmVmZXJyZWQgdG8gYnkgdGhlIGluc3RhbmNlLlxuICAgICAqL1xuICAgIFxuICAgIC8qKlxuICAgICAqIEBjZmcge09iamVjdH0gZGVmYXVsdHNcbiAgICAgKi9cbiAgICBcbiAgICAvKipcbiAgICAgKiBAY2ZnIHtCb29sZWFufSBpbml0QWZ0ZXIgIGRlZmF1bHRzIHRvIGZhbHNlXG4gICAgICogcGFzcyBpbiB0cnVlIHRvIGluaXQgdGhlIGNvbXBvc2l0aW9uIGluc3RhbmNlIGFmdGVyIHRoZSBcbiAgICAgKiBzdXBlcmNsYXNzIGhhcyBiZWVuIGNhbGxlZC5cbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIEBjZmcge0Z1bmN0aW9ufSBDb25zdHJ1Y3RvciAocmVxdWlyZWQpIHRoZSBDb25zdHJ1Y3RvclxuICAgICAqIHRvIHVzZSB3aGVuIGNyZWF0aW5nIHRoZSBjb21wb3NpdGlvbiBpbnN0YW5jZS4gIFRoaXNcbiAgICAgKiBpcyByZXF1aXJlZCBpZiBMdWMuQ29tcG9zaXRpb24uY3JlYXRlIGlzIG5vdCBvdmVyd3JpdHRlbiBieVxuICAgICAqIHRoZSBwYXNzZWQgaW4gY29tcG9zaXRpb24gY29uZmlnIG9iamVjdC5cbiAgICAgKi9cbiAgICBcbiAgICAvKipcbiAgICAgKiBAcHJvdGVjdGVkXG4gICAgICogQnkgZGVmYXVsdCBqdXN0IHJldHVybiBhIG5ld2x5IGNyZWF0ZWQgQ29uc3RydWN0b3IgaW5zdGFuY2UuXG4gICAgICogXG4gICAgICogV2hlbiBjcmVhdGUgaXMgY2FsbGVkIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllcyBjYW4gYmUgdXNlZCA6XG4gICAgICogXG4gICAgICogdGhpcy5pbnN0YW5jZSBUaGUgaW5zdGFuY2UgdGhhdCBpcyBjcmVhdGluZ1xuICAgICAqIHRoZSBjb21wb3NpdGlvbi5cbiAgICAgKiBcbiAgICAgKiB0aGlzLkNvbnN0cnVjdG9yIHRoZSBjb25zdHJ1Y3RvciB0aGF0IGlzIHBhc3NlZCBpbiBmcm9tXG4gICAgICogdGhlIGNvbXBvc2l0aW9uIGNvbmZpZy4gXG4gICAgICpcbiAgICAgKiB0aGlzLmluc3RhbmNlQXJncyB0aGUgYXJndW1lbnRzIHBhc3NlZCBpbnRvIHRoZSBpbnN0YW5jZSB3aGVuIGl0IFxuICAgICAqIGlzIGJlaW5nIGNyZWF0ZWQuICBGb3IgZXhhbXBsZVxuXG4gICAgICAgIG5ldyBNeUNsYXNzV2l0aEFDb21wb3NpdGlvbih7cGx1Z2luczogW119KVxuICAgICAgICAvL2luc2lkZSBvZiB0aGUgY3JlYXRlIG1ldGhvZFxuICAgICAgICB0aGlzLmluc3RhbmNlQXJnc1xuICAgICAgICA+W3twbHVnaW5zOiBbXX1dXG5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFxuICAgICAqIHRoZSBjb21wb3NpdGlvbiBpbnN0YW5jZS5cbiAgICAgKlxuICAgICAqIEZvciBleGFtcGxlIHNldCB0aGUgZW1pdHRlcnMgbWF4TGlzdGVuZXJzXG4gICAgICogdG8gd2hhdCB0aGUgaW5zdGFuY2UgaGFzIGNvbmZpZ2VkLlxuICAgICAgXG4gICAgICAgIG1heExpc3RlbmVyczogMTAwLFxuICAgICAgICAkY29tcG9zaXRpb25zOiB7XG4gICAgICAgICAgICBDb25zdHJ1Y3RvcjogTHVjLkV2ZW50RW1pdHRlcixcbiAgICAgICAgICAgIGNyZWF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIGVtaXR0ZXIgPSBuZXcgdGhpcy5Db25zdHJ1Y3RvcigpO1xuICAgICAgICAgICAgICAgIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKHRoaXMuaW5zdGFuY2UubWF4TGlzdGVuZXJzKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZW1pdHRlcjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBuYW1lOiAnZW1pdHRlcidcbiAgICAgICAgfVxuXG4gICAgICovXG4gICAgY3JlYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIENvbnN0cnVjdG9yID0gdGhpcy5Db25zdHJ1Y3RvcjtcbiAgICAgICAgcmV0dXJuIG5ldyBDb25zdHJ1Y3RvcigpO1xuICAgIH0sXG5cbiAgICBnZXRJbnN0YW5jZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZSgpO1xuICAgIH0sXG5cbiAgICB2YWxpZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKHRoaXMubmFtZSAgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBIG5hbWUgbXVzdCBiZSBkZWZpbmVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYoIWlzLmlzRnVuY3Rpb24odGhpcy5Db25zdHJ1Y3RvcikgJiYgdGhpcy5jcmVhdGUgPT09IENvbXBvc2l0aW9uLnByb3RvdHlwZS5jcmVhdGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIENvbnN0cnVjdG9yIG11c3QgYmUgZnVuY3Rpb24gaWYgY3JlYXRlIGlzIG5vdCBvdmVycmlkZGVuJyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IGZpbHRlck1ldGhvZEZuc1xuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQHByb3BlcnR5IGZpbHRlck1ldGhvZEZucy5hbGxNZXRob2RzIHJldHVybiBhbGwgbWV0aG9kcyBmcm9tIHRoZVxuICAgICAqIGNvbnN0cnVjdG9ycyBwcm90b3R5cGVcbiAgICAgKiBAcHJvcGVydHkgZmlsdGVyTWV0aG9kRm5zLnB1YmxpYyByZXR1cm4gYWxsIG1ldGhvZHMgdGhhdCBkb24ndFxuICAgICAqIHN0YXJ0IHdpdGggXy4gIFdlIGtub3cgbm90IGV2ZXJ5b25lIGZvbGxvd3MgdGhpcyBjb252ZW50aW9uLCBidXQgd2VcbiAgICAgKiBkbyBhbmQgc28gZG8gbWFueSBvdGhlcnMuXG4gICAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgICAqL1xuICAgIGZpbHRlck1ldGhvZEZuczoge1xuICAgICAgICBhbGxNZXRob2RzOiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gaXMuaXNGdW5jdGlvbih2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIHB1YmxpY01ldGhvZHM6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBpcy5pc0Z1bmN0aW9uKHZhbHVlKSAmJiBrZXkuY2hhckF0KDApICE9PSAnXyc7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQGNmZyB7RnVuY3Rpb24vU3RyaW5nL0FycmF5W119IG1ldGhvZHNcbiAgICAgKiBUaGUga2V5cyB0byBhZGQgdG8gdGhlIGRlZmluZXJzIHByb3RvdHlwZSB0aGF0IHdpbGwgaW4gdHVybiBjYWxsXG4gICAgICogdGhlIGNvbXBvc2l0aW9ucyBtZXRob2QuXG4gICAgICogXG4gICAgICogRGVmYXVsdHMgdG8gTHVjLmVtcHR5Rm4uIFxuICAgICAqIElmIGFuIGFycmF5IGlzIHBhc3NlZCBpdCB3aWxsIGp1c3QgdXNlIHRoYXQgQXJyYXkuXG4gICAgICogXG4gICAgICogSWYgYSBzdHJpbmcgaXMgcGFzc2VkIGFuZCBtYXRjaGVzIGEgbWV0aG9kIGZyb20gXG4gICAgICogTHVjLkNvbXBvc2l0aW9uLmZpbHRlck1ldGhvZEZucyBpdCB3aWxsIGNhbGwgdGhhdCBpbnN0ZWFkLlxuICAgICAqIFxuICAgICAqIElmIGEgZnVuY3Rpb24gaXMgZGVmaW5lZCBpdFxuICAgICAqIHdpbGwgZ2V0IGNhbGxlZCB3aGlsZSBpdGVyYXRpbmcgb3ZlciBlYWNoIGtleSB2YWx1ZSBwYWlyIG9mIHRoZSBcbiAgICAgKiBDb25zdHJ1Y3RvcidzIHByb3RvdHlwZSwgaWYgYSB0cnV0aHkgdmFsdWUgaXMgXG4gICAgICogcmV0dXJuZWQgdGhlIHByb3BlcnR5IHdpbGwgYmUgYWRkZWQgdG8gdGhlIGRlZmluaW5nXG4gICAgICogY2xhc3NlcyBwcm90b3R5cGUuXG4gICAgICogXG4gICAgICogRm9yIGV4YW1wbGUgdGhpcyBjb25maWcgd2lsbCBvbmx5IGV4cG9zZSB0aGUgZW1pdCBtZXRob2QgXG4gICAgICogdG8gdGhlIGRlZmluaW5nIGNsYXNzXG4gICAgIFxuICAgICAgICAkY29tcG9zaXRpb25zOiB7XG4gICAgICAgICAgICBDb25zdHJ1Y3RvcjogTHVjLkV2ZW50RW1pdHRlcixcbiAgICAgICAgICAgIG1ldGhvZHM6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ga2V5ID09PSAnZW1pdCc7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbmFtZTogJ2VtaXR0ZXInXG4gICAgICAgIH1cbiAgICAgKiB0aGlzIGlzIGFsc28gYSB2YWxpZCBjb25maWdcbiAgICAgKiBcbiAgICAgICAgJGNvbXBvc2l0aW9uczoge1xuICAgICAgICAgICAgQ29uc3RydWN0b3I6IEx1Yy5FdmVudEVtaXR0ZXIsXG4gICAgICAgICAgICBtZXRob2RzOiBbJ2VtaXR0ZXInXSxcbiAgICAgICAgICAgIG5hbWU6ICdlbWl0dGVyJ1xuICAgICAgICB9XG4gICAgICogXG4gICAgICovXG4gICAgbWV0aG9kczogZW1wdHlGbixcblxuICAgIC8qKlxuICAgICAqIEBjZmcge1N0cmluZ1tdL1N0cmluZ30gaWdub3JlTWV0aG9kcyBtZXRob2RzIHRoYXQgd2lsbCBhbHdheXNcbiAgICAgKiBiZSBpZ25vcmVkIGlmIG1ldGhvZHMgaXMgbm90IGFuIEFycmF5LlxuICAgICAqXG4gICAgICAgIFxuICAgICAgICB2YXIgQyA9IEx1Yy5kZWZpbmUoe1xuICAgICAgICAgICAgICAgICRjb21wb3NpdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdHM6IEx1Yy5jb21wb3NpdGlvbkVudW1zLkV2ZW50RW1pdHRlcixcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kczogJ2FsbE1ldGhvZHMnLFxuICAgICAgICAgICAgICAgICAgICBpZ25vcmVNZXRob2RzOiBbJ2VtaXQnXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgYyA9IG5ldyBDKCk7XG4gICAgICAgICAgICB0eXBlb2YgYy5lbWl0XG4gICAgICAgICAgICA+XCJ1bmRlZmluZWRcIlxuICAgICAqL1xuICAgIGlnbm9yZU1ldGhvZHM6IHVuZGVmaW5lZCxcblxuICAgIGdldE9iamVjdFdpdGhNZXRob2RzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1ldGhvZHNPYmogPSB0aGlzLkNvbnN0cnVjdG9yICYmIHRoaXMuQ29uc3RydWN0b3IucHJvdG90eXBlO1xuICAgICAgICBpZiAodGhpcy5pZ25vcmVNZXRob2RzKSB7XG4gICAgICAgICAgICBtZXRob2RzT2JqID0gYXBwbHkoe30sIG1ldGhvZHNPYmopO1xuICAgICAgICAgICAgYXJyYXkuZWFjaCh0aGlzLmlnbm9yZU1ldGhvZHMsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIG1ldGhvZHNPYmpbdmFsdWVdO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbWV0aG9kc09iajtcbiAgICB9LFxuXG4gICAgZ2V0TWV0aG9kc1RvQ29tcG9zZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtZXRob2RzID0gdGhpcy5tZXRob2RzLFxuICAgICAgICAgICAgcGFpcnNUb0FkZCxcbiAgICAgICAgICAgIGZpbHRlckZuO1xuXG5cbiAgICAgICAgaWYgKGlzLmlzQXJyYXkobWV0aG9kcykpIHtcbiAgICAgICAgICAgIHBhaXJzVG9BZGQgPSBtZXRob2RzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZmlsdGVyRm4gPSBtZXRob2RzO1xuXG4gICAgICAgICAgICBpZiAoaXMuaXNTdHJpbmcobWV0aG9kcykpIHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJGbiA9IHRoaXMuZmlsdGVyTWV0aG9kRm5zW21ldGhvZHNdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL0NvbnN0cnVjdG9ycyBhcmUgbm90IG5lZWRlZCBpZiBjcmVhdGUgaXMgb3ZlcndyaXR0ZW5cbiAgICAgICAgICAgIHBhaXJzVG9BZGQgPSBvRmlsdGVyKHRoaXMuZ2V0T2JqZWN0V2l0aE1ldGhvZHMoKSwgZmlsdGVyRm4sIHRoaXMsIHtcbiAgICAgICAgICAgICAgICBvd25Qcm9wZXJ0aWVzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBrZXlzOiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwYWlyc1RvQWRkO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ29tcG9zaXRpb247Il19
;