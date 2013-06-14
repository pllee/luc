/**
 * @class Luc.Array
 * Luc Array functions.
 */

/**
 * Return an empty array if arrOrItem is null or undefined
 * if arrrayOrItem is an array just return it, if arrayOrItem
 * is an item just return an array containing the item.
 * 
 * @param  {Object} arrOrItem item to turn into an array.
 *
    Luc.Array.toArray()
    >[]
    Luc.Array.toArray(null)
    >[]
    Luc.Array.toArray(1)
    >[1]
    Luc.Array.toArray([1,2])
    >[1, 2]
 *
 * @return the array
 */
function toArray(arrOrItem) {
    if (Array.isArray(arrOrItem)) {
        return arrOrItem;
    }
    return (arrOrItem === null || typeof arrOrItem === 'undefined') ? [] : [arrOrItem];
}

/**
 * Runs an array.forEach after calling Luc.Array.toArray on the item.
 * @param  {Object}   arrOrItem
 * @param  {Function} fn        
 * @param  {Object}   context   
 */
function each(arrOrItem, fn, context) {
    var arr = toArray(arrOrItem);
    return arr.forEach.call(arr, fn, context);
}

exports.toArray = toArray;
exports.each = each;