var is = require('./is');
/**
 * @member Luc
 * @method override
 * Override a method on an object.  The passed in function will 
 * be the object's method.  By default a restore method will be added to the method.
 * If previous is true in the config the fn will be called with the previous method
 * and fn should return a function.
 *
 * @param  {Object} obj  The object to override.
 * @param  {String} fnName  The function name to override.
 * @param  {Function} fn  The function to override the method with.
 * @param  {Object} [config] Config object.
 * @param  {Boolean} config.restore Pass in false to not add a restore method
 * by default a restore method will be added.
 * @param  {Boolean} config.previous pass in call the fn with the current
 * function that it is overriding.
 * @return {undefined} undefined
 * 
 * 
    
    var C = Luc.define({
        log: function() {
            console.log('logging..')
        }
    });

    Luc.override(C.prototype, 'log', function(){
        console.log('no I am logging..')
    })

    var c = new C();
    c.log();
    >no I am logging.. 
    c.log.restore()
    c.log();
    >logging.. 

 *
 * To get access to the previous function pass in previous: true to the config.
 * This will call the passed in fn with the previous method as the only parameter,
 * the function must return another function.
 *
    
    var C = Luc.define({
        log: function() {
            console.log('logging..')
        }
    });

    Luc.override(C.prototype, 'log', function($super) {
        return function() {
            $super.call(this)
            console.log('no I am logging..')
        }
    }, {previous: true})

    var c = new C();
    c.log();
    >logging.. 
    >no I am logging.. 

 *
 */
module.exports = function(obj, fnName, fn, c) {
    var config = c || {},
        restore = config.restore === undefined ? true : config.restore,
        passPrevious = config.previous,
        previous = obj[fnName],
        previousRestore;

    if(passPrevious) {
        obj[fnName] = fn(previous);
        if(!is.isFunction(obj[fnName])) {
            throw new Error('previous config used, passed in function must return a function');
        }
    }
    else {
        obj[fnName] = fn;
    }

    if(restore) {
        var previousRestore = previous.restore;
        obj[fnName].restore = function() {
            obj[fnName] = previous;
            previousRestore && previousRestore();
            delete obj[fnName].previous;
        };
    }
};