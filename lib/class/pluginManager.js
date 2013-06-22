var Plugin = require('./plugin'),
    is = require('../is'),
    obj = require('../object'),
    arr = require('../array'),
    removeFirst = arr.removeFirst,
    aEach = arr.each,
    mix = obj.mix,
    apply = obj.apply;

function PluginManager() {}

PluginManager.prototype = {
    defaultPlugin: Plugin,

    init: function(instanceValues) {
        apply(this, instanceValues);
        this.plugins = [];
        this.createPlugins();
    },

    createPlugins: function() {
        aEach(this.getPluginConfigFromInstance(), function(pluginConfig) {
            this.addPlugin(pluginConfig);
        }, this);
    },

    getPluginConfigFromInstance: function() {
        var config = this.instanceArgs[0];
        return config.plugins;
    },

    addPlugin: function(pluginConfig) {
        var pluginInstance = this.createPlugin(pluginConfig);

        this.initPlugin(pluginInstance);

        this.plugins.push(pluginInstance);
    },

    createPlugin: function(config) {
        config.owner = this.instance;

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
        if (is.isFunction(plugin.init)) {
            plugin.init(this.instance);
        }
    },

    destroyPlugin: function(plugin) {
        if (is.isFunction(plugin.destroy)) {
            plugin.destroy(this.instance);
        }
    },

    destroyPlugins: function() {
        this.plugins.forEach(function(plugin) {
            this.destroyPlugin(plugin);
        }, this);
    },

    /**
     * Remove the plugin from the plugins array and 
     * if found destroy it.
     * @param  {Object} object to use to match 
     * the plugin to remove.
     * @return {Objec}
     */
    removePlugin: function(obj) {
        var plugin = removeFirst(this.plugins, obj);
        if(plugin) {
            this.destroyPlugin(plugin);
        }

        return plugin;
    }
};

module.exports = PluginManager;