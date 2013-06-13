var emptyFn = require('../function').emptyFn,
    apply = require('../object').apply;

function Base() {
    this.beforeInit.apply(this, arguments);
    this.init()
}

Base.prototype = {
    beforeInit: function(config) {
        apply(this, config);
    },

    init: emptyFn
};

module.exports = Base;