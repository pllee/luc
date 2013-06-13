var Luc = {};

module.exports = Luc;

var object = require('./object');
Luc.Object = object;
Luc.apply = Luc.Object.apply;
Luc.mix = Luc.Object.mix;


var fun = require('./function');
Luc.Function = fun;
Luc.emptyFn = Luc.Function.emptyFn;
Luc.abstractFn = Luc.Function.abstractFn;

var array = require('./array');
Luc.Array = array;

var EventEmitter = require('./events/eventEmitter');

Luc.EventEmitter = EventEmitter;

var Base = require('./class/base');

Luc.Base = Base;

var manager = require('./class/manager');

Luc.ClassManager = manager.ClassManager;
Luc.define = manager.define;

Luc.Utils = require('./utils');

if(typeof window !== 'undefined') {
    window.Luc = Luc;
}