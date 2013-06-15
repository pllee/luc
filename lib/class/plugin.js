var aEach = require('../array').each,
    obj = require('../object'),
    mix = obj.mix,
    apply = obj.apply;


function Plugin(config) {
    apply(this, config);
}

Plugin.prototype = {
    init: function(owner) {}
};

var PluginCompositionConfig = {
    name: 'plugins',
    defaultPlugin: Plugin,

    create: function() {
        var config = this.instanceArgs[0],
            pluginInstances = [];

        aEach(config.plugins, function(pluginConfig) {
            pluginConfig.owner = this.instance;
            var pluginInstance = this.createPlugin(pluginConfig);

            this.initPlugin(pluginInstance);

            pluginInstances.push(pluginInstance);
        }, this);

        return pluginInstances;
    },

    createPlugin: function(config) {

        if (config.Constructor) {
            //call the configed Constructor with the 
            //passed in config but take off the Constructor
            //config.
             
            //The plugin Constructor 
            //should not need to know about itself
            return new config.Constructor(apply(config, {
                Constructor: undefined
            }));
        }

        //if Constructor property is not on
        //the config just use the default Plugin
        return new this.defaultPlugin(config);
    },

    initPlugin: function(plugin) {
        if (typeof plugin.init === 'function') {
            plugin.init(this.instance);
        }
    }
};

module.exports.getPluginCompostion = function(config) {
    return mix(config, PluginCompositionConfig);
};

module.exports.Plugin = Plugin;