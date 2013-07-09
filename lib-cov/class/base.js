/* automatically generated by JSCoverage - do not edit */
if (typeof _$jscoverage === 'undefined') _$jscoverage = {};
if (! _$jscoverage['class/base.js']) {
  _$jscoverage['class/base.js'] = [];
  _$jscoverage['class/base.js'][1] = 0;
  _$jscoverage['class/base.js'][61] = 0;
  _$jscoverage['class/base.js'][62] = 0;
  _$jscoverage['class/base.js'][63] = 0;
  _$jscoverage['class/base.js'][66] = 0;
  _$jscoverage['class/base.js'][72] = 0;
  _$jscoverage['class/base.js'][82] = 0;
}
_$jscoverage['class/base.js'][1]++;
var emptyFn = require("../function").emptyFn, apply = require("../object").apply;
_$jscoverage['class/base.js'][61]++;
function Base() {
  _$jscoverage['class/base.js'][62]++;
  this.beforeInit.apply(this, arguments);
  _$jscoverage['class/base.js'][63]++;
  this.init();
}
_$jscoverage['class/base.js'][66]++;
Base.prototype = {beforeInit: (function (config) {
  _$jscoverage['class/base.js'][72]++;
  apply(this, config);
}), init: emptyFn};
_$jscoverage['class/base.js'][82]++;
module.exports = Base;
_$jscoverage['class/base.js'].source = ["var emptyFn = require('../function').emptyFn,","    apply = require('../object').apply;","","/**"," * @class Luc.Base"," * Simple class that by default {@link Luc#apply applies} the "," * first argument to the instance and then calls"," * Luc.Base.init."," *","    var b = new Luc.Base({","        a: 1,","        init: function() {","            console.log('hey')","        }","    })","    b.a","    &gt;hey","    &gt;1"," *"," * We found that most of our classes do this so we made"," * it the default.  Having a config object as the first and only "," * param keeps a clean api as well."," *","    var C = Luc.define({","        init: function() {","            Luc.Array.each(this.items, this.logItems)","        },","","        logItems: function(item) {","            console.log(item);","        }","    });","","    var c = new C({items: [1,2,3]});","    &gt;1","    &gt;2","    &gt;3","    var d = new C({items: 'A'});","    &gt;'A'","    var e = new C();"," *"," * If you don't like the applying of the config to the instance it "," * can always be \"disabled\""," *","    var NoApply = Luc.define({","        beforeInit: function() {","","        },","        init: function() {","            Luc.Array.each(this.items, this.logItems)","        },","","        logItems: function(item) {","            console.log(item);","        }","    });","","    var c = new NoApply({items: [1,2,3]});"," * "," */","function Base() {","    this.beforeInit.apply(this, arguments);","    this.init();","}","","Base.prototype = {","    /**","     * By default apply the config to the ","     * instance.","     */","    beforeInit: function(config) {","        apply(this, config);","    },","    /**","     * @method","     * Simple hook to initialize","     * the class.  Defaults to Luc.emptyFn","     */","    init: emptyFn","};","","module.exports = Base;"];