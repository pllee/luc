var Luc = require('../lib/luc-es5-shim'),
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
        }, obj)
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
})