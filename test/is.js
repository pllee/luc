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