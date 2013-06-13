var Base = require('./base'),
    EventEmitter = require('../events/eventEmitter'),
    obj = require('../object'),
    apply = obj.apply,
    oEach = obj.each,
    mix = obj.mix;

function ClassManager() {}

ClassManager.prototype = {
    defaultType: Base,

    create: function(opts) {
        var options = opts || {},
        Super = options.$super || this.defaultType,
        F = this._inherit(Super);

        options.$super = Super;

        this._processAfterCreate(F, options);

        return F;
    },

    _inherit: function(superclass) {
        var F = function() {
            superclass.apply(this, arguments);
        };

        F.prototype = Object.create(superclass.prototype);
        
        return F;
    },

    postProcessorKeys: {
        $mixins: '_applyMixins',
        $statics: '_applyStatics',
        $emitterMix: '_mixEmitter'
    },

    _getProcessorKey: function(key) {
        return this.postProcessorKeys[key];
    },

    _processAfterCreate: function($class, options) {
        this._applyValuesToProto($class, options);
        this._handlePostProcessors($class, options);
    },

    _applyValuesToProto: function($class, options) {
        var proto = $class.prototype,
            Super = options.$super,
            values = apply({
                $superClass: Super.prototype,
                $class: $class
            }, options);

        oEach(values, function(key, value) {
            if (!this._getProcessorKey(key)) {
                proto[key] = value;
            }
        }, this);
    },

    _handlePostProcessors: function($class, options) {
        var processors = {
            $mixins: '_applyMixins',
            $statics: '_applyStatics',
            $emitterMix: '_mixEmitter'
        };

        oEach(options, function(key, value) {
            var method = this._getProcessorKey(key);
            if (method) {
                this[method].call(this, $class, options[key]);
            }
        }, this);
    },

    _applyMixins: function($class, mixins) {
         var proto = $class.prototype;
         oEach(mixins, function(key, value) { 
            mix(proto, value.prototype);
         });
    },

    _applyStatics: function($class, statics) {
        apply($class, statics);
    },

    _mixEmitter: function($class) {
        this._applyMixins($class, {emitter: EventEmitter});
    }
};

var Manager = new ClassManager();

exports.define = function() {
    return Manager.create.apply(Manager, arguments);
};

//expose ClassManager for potential customization
exports.ClassManager = ClassManager;