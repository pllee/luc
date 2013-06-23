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

                    },
                    name: 'myPlugin'
                }
            ]
        });

        expect(testInstance).to.be(c);
        expect(c.getPlugin(Luc.Plugin)).to.be.a(Luc.Plugin);
        expect(c.getPlugin({name: 'myPlugin'})).to.be.a(Luc.Plugin);
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

    // it('test default plugin destroy', function() {
    //     var testValue = false,
    //     ClassWithPlugins = Luc.define({
    //         $compositions: {
    //             defaults: Luc.compositionEnumns.PluginManager
    //         }
    //     });

    //     var c = new ClassWithPlugins({
    //         plugins: [{
    //                 destroy: function() {
    //                     testValue = true;
    //                 }
    //             }, {}
    //         ]
    //     });

    //     expect(testValue).to.be(false);
    //     c.destroyPlugins();
    //     expect(testValue).to.be(true);
    // });
});




