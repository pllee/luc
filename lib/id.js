var ids = {};
/**
 * @member Luc
 * @method id
 * 
 * Return a unique id.
 * @param {String} [prefix] Optional prefix to use
 *
 *
        Luc.id()
        >"luc-0"
        Luc.id()
        >"luc-1"
        Luc.id('my-prefix')
        >"my-prefix0"
        Luc.id('')
        >"0"
 *
 * @return {String}
 *
 */
module.exports = function(p) {
    var prefix = p === undefined ? 'luc-' : p;

    if(ids[prefix] === undefined) {
        ids[prefix] = 0;
    }

    return prefix + ids[prefix]++;
};