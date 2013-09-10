var Luc = require('./lucTestLib'),
    expect = require('expect.js');

describe('Luc submodule', function() {
    var sub = {
        a: 1,
        b: 2
    },
    namespace = 'testSub';
    
    afterEach(function() {
        delete Luc[namespace];
    });

    it('module added', function() {
        Luc.addSubmodule(namespace, sub);

        if (typeof window !== 'undefined') {
            expect(Luc[namespace]).to.be.eql({
                a: 1,
                b: 2
            });
        } else {
            expect(Luc[namespace]).to.be(undefined);
        }
    });

    it('alwaysAddSubmodule', function() {
        Luc.alwaysAddSubmodule = true;
        Luc.addSubmodule(namespace, sub);

        expect(Luc[namespace]).to.be.eql({
            a: 1,
            b: 2
        });
    });
});