var Luc = require('./lucTestLib'),
    expect = require('expect.js');

describe('Luc compare fn', function() {

    it('compare', function() {
        expect(Luc.compare({}, {})).to.be(true);
        expect(Luc.compare([], [])).to.be(true);
        expect(Luc.compare({}, {a: 1})).to.be(false);
        expect(Luc.compare({a:1}, {a: 1})).to.be(true);
        expect(Luc.compare({a:1, b: 1}, {a: 1})).to.be(false);

        expect(Luc.compare(new Date(10000), {})).to.be(false);
        expect(Luc.compare(new Date(10000), new Date(10000))).to.be(true);

        expect(Luc.compare(false, false)).to.be(true);
        expect(Luc.compare(0, false)).to.be(false);
        expect(Luc.compare('', false)).to.be(false);
        expect(Luc.compare(null, false)).to.be(false);
        expect(Luc.compare(undefined, false)).to.be(false);
        expect(Luc.compare(NaN, false)).to.be(false);

    });
});