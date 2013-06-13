var Luc = require('../lib/luc-es5-shim'),
    expect = require('expect.js');
describe('Luc Util functions', function() {
    it('toObject', function() {
        var a = {},
            b = [],
            toObjectArgs,
            toObjectArray;

        toObjectArray = Luc.Utils.toObject(['name1', 'name2'], [a,b])
        expect(toObjectArray.name1).to.eql(a);
        expect(toObjectArray.name2).to.eql(b);

        (function(c,d){
            toObjectArgs = Luc.Utils.toObject(['name1', 'name2'], arguments);
            expect(toObjectArgs.name1).to.eql(a);
            expect(toObjectArgs.name2).to.eql(b);
        }(a,b));
    });
})