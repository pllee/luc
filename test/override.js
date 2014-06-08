var Luc = require('./lucTestLib'),
    expect = require('expect.js');

describe('Luc override', function() {
    var obj, methodName, newMethod, oldMethod;

    beforeEach(function() {
        obj = {
            num: 0
        };
        methodName = 'method1';
        newMethod = function() {
            this.num++;
        };
        oldMethod = function() {
            this.num += 2;
        };

        obj[methodName] = oldMethod;
    })


    it('method is overwritten', function() {
        Luc.override(obj, methodName, newMethod);
        expect(obj[methodName]).to.be(newMethod);
    });

    it('restore replaces original method single override', function() {
        Luc.override(obj, methodName, newMethod);
        obj[methodName].restore();
        expect(obj[methodName]).to.be(oldMethod);
    });

    it('restore replaces original method multiple overrides', function() {
        Luc.override(obj, methodName, newMethod);
        Luc.override(obj, methodName, function(){});
        Luc.override(obj, methodName, function(){});
        
        obj[methodName].restore();
        
        expect(obj[methodName]).to.be(oldMethod);
    });

    it('restore false config no restore method added', function() {
        Luc.override(obj, methodName, newMethod, {restore: false});
        expect(obj[methodName].restore).to.be(undefined);
    });

    it('previous true method gets passed in', function() {
        Luc.override(obj, methodName, function(pre) {
            return function() {
                expect(pre).to.be(oldMethod);
                pre.call(this);
                newMethod.call(this);
            }
        }, {
            previous: true
        });

        obj[methodName]();
        expect(obj.num).to.be(3);
    });

});