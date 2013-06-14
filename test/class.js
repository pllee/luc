var emitterTest = require('./common').testEmitter;
var Luc = require('../lib/luc-es5-shim'),
    expect = require('expect.js');

describe('Luc Class', function() {
    it('Base', function() {
        var b = new Luc.Base({
            a: 1
        });
        expect(b.a).to.eql(1);
    });

    it('define', function() {
        var C = Luc.define({
            b: '2'
        });
        var b = new C({
            a: 1
        });
        expect(b.a).to.eql(1);
        expect(b.b).to.eql('2');
    });

    it('mixins', function() {
        var C = Luc.define({
            $mixins: {
                emitter: Luc.EventEmitter
            }
        });

        var b = new C({
            a: 1
        });
        emitterTest(b);
    });

    it('static', function() {
        var C = Luc.define({
            $statics: {
                b: 1
            }
        });

        expect(C.b).to.eql(1);
    });

    it('emitter mix', function() {
        var C = Luc.define({
            $emitterMix: true
        });
        var c = new C();
        expect(c instanceof Luc.EventEmitter).to.be(false);
        emitterTest(c);
    });

    it('$className', function() {
        var C = Luc.define({
            $className: 'Patrick'
        });

        var D = Luc.define({});

        var c = new C(),
            d = new D();
        expect(c.$className).to.eql('Patrick');
        expect(d.$className).to.eql(undefined);
    });

    it('$class', function() {
        var C = Luc.define({
            $emitterMix: true
        });
        var i;
        var c = new C({
            emit: function() {
                i = 0;
                this.$class.prototype.emit.apply(this, arguments);
            }
        });

        emitterTest(c);
        expect(i).to.be(0);
    });

    it('super', function() {
        var i;
        var C = Luc.define({
            $super: Luc.EventEmitter,
            emit: function() {
                i = 0;
                this.$superClass.emit.apply(this, arguments);
            }
        });


        var c = new C({});
        emitterTest(c);
        expect(i).to.be(0);
        expect(c instanceof Luc.EventEmitter).to.be(true);
    });

    it('composition', function() {
        var BaseEmitter = Luc.define({
            $compositions: [{Constructor: Luc.EventEmitter, name: 'emitter'}]
        });

        var base = new BaseEmitter({});
        emitterTest(base);
        expect(base instanceof Luc.EventEmitter).to.be(false);
        expect(base.events).to.be(undefined);
    });

    it('composition and superclass and super', function() {
        var ArrayEmitter = Luc.define({
            $super: Array,
            $compositions: [{Constructor: Luc.EventEmitter, name: 'emitter'}],
            pop: function() {
                var popped = this.$superClass.pop.call(this);
                this.emit('pop', popped);
            }
        }), emitPopped = [];

        var arr = new ArrayEmitter();
        arr.on('pop', function(value) {
            emitPopped.push(value);
        });

        arr.push(1,2,3);
        arr.pop();arr.pop();arr.pop();
        arr.push(5);
        arr.shift();

        expect(emitPopped).to.eql([3,2,1]);
    });
});




