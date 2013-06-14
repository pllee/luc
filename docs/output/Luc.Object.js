Ext.data.JsonP.Luc_Object({"tagname":"class","name":"Luc.Object","extends":null,"mixins":[],"alternateClassNames":[],"aliases":{},"singleton":false,"requires":[],"uses":[],"enum":null,"override":null,"inheritable":null,"inheritdoc":null,"meta":{},"private":null,"id":"class-Luc.Object","members":{"cfg":[],"property":[],"method":[{"name":"apply","tagname":"method","owner":"Luc.Object","meta":{},"id":"method-apply"},{"name":"each","tagname":"method","owner":"Luc.Object","meta":{},"id":"method-each"},{"name":"mix","tagname":"method","owner":"Luc.Object","meta":{},"id":"method-mix"},{"name":"toObject","tagname":"method","owner":"Luc.Object","meta":{},"id":"method-toObject"}],"event":[],"css_var":[],"css_mixin":[]},"linenr":1,"files":[{"filename":"object.js","href":"object.html#Luc-Object"}],"html_meta":{},"statics":{"cfg":[],"property":[],"method":[],"event":[],"css_var":[],"css_mixin":[]},"component":false,"superclasses":[],"subclasses":[],"mixedInto":[],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/object.html#Luc-Object' target='_blank'>object.js</a></div></pre><div class='doc-contents'><p>Object utils.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-apply' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Luc.Object'>Luc.Object</span><br/><a href='source/object.html#Luc-Object-method-apply' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Luc.Object-method-apply' class='name expandable'>apply</a>( <span class='pre'>toObject, fromObject</span> ) : Object</div><div class='description'><div class='short'>Apply the properties from fromObject to the toObject. ...</div><div class='long'><p>Apply the properties from fromObject to the toObject.  fromObject will\noverwrite any shared keys.  It can also be used as a simple shallow clone.</p>\n\n<pre><code>var to = {a:1, c:1}, from = {a:2, b:2}\n<a href=\"#!/api/Luc.Object-method-apply\" rel=\"Luc.Object-method-apply\" class=\"docClass\">Luc.Object.apply</a>(to, from)\n&gt;Object {a: 2, c: 1, b: 2}\nto === to\n&gt;true\nvar clone = <a href=\"#!/api/Luc.Object-method-apply\" rel=\"Luc.Object-method-apply\" class=\"docClass\">Luc.Object.apply</a>({}, from)\n&gt;undefined\nclone\n&gt;Object {a: 2, b: 2}\nclone === from\n&gt;false\n</code></pre>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>toObject</span> : Object|undefined<div class='sub-desc'><p>Object to put the properties fromObject on.</p>\n</div></li><li><span class='pre'>fromObject</span> : Object|undefined<div class='sub-desc'><p>Object to put the properties on the toObject</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>the toObject</p>\n</div></li></ul></div></div></div><div id='method-each' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Luc.Object'>Luc.Object</span><br/><a href='source/object.html#Luc-Object-method-each' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Luc.Object-method-each' class='name expandable'>each</a>( <span class='pre'>obj, fn, thisArg</span> )</div><div class='description'><div class='short'>Iterate over an objects own enumerable properties\nas key value \"pairs\" with the passed in function\nand optional thisArg. ...</div><div class='long'><p>Iterate over an objects own enumerable properties\nas key value \"pairs\" with the passed in function\nand optional thisArg.</p>\n\n<pre><code>var context = {val:1};\n<a href=\"#!/api/Luc.Object-method-each\" rel=\"Luc.Object-method-each\" class=\"docClass\">Luc.Object.each</a>({\n    key: 1\n}, function(key, value) {\n    console.log(value + key + this.val)\n}, context)\n\n&gt;1key1\n</code></pre>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>obj</span> : Object<div class='sub-desc'><p>the object to iterate over</p>\n</div></li><li><span class='pre'>fn</span> : Function<div class='sub-desc'><p>the function to call</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : String<div class='sub-desc'><p>the object key</p>\n</div></li><li><span class='pre'>value</span> : Object<div class='sub-desc'><p>the object value</p>\n</div></li></ul></div></li><li><span class='pre'>thisArg</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-mix' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Luc.Object'>Luc.Object</span><br/><a href='source/object.html#Luc-Object-method-mix' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Luc.Object-method-mix' class='name expandable'>mix</a>( <span class='pre'>toObject, fromObject</span> ) : Object</div><div class='description'><div class='short'>Similar to Luc.Object.apply except that the fromObject will\nNOT overwrite the keys of the toObject if they are defined. ...</div><div class='long'><p>Similar to <a href=\"#!/api/Luc.Object-method-apply\" rel=\"Luc.Object-method-apply\" class=\"docClass\">Luc.Object.apply</a> except that the fromObject will\nNOT overwrite the keys of the toObject if they are defined.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>toObject</span> : Object|undefined<div class='sub-desc'><p>Object to put the properties fromObject on.</p>\n</div></li><li><span class='pre'>fromObject</span> : Object|undefined<div class='sub-desc'><p>Object to put the properties on the toObject</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>the toObject</p>\n</div></li></ul></div></div></div><div id='method-toObject' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Luc.Object'>Luc.Object</span><br/><a href='source/object.html#Luc-Object-method-toObject' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Luc.Object-method-toObject' class='name expandable'>toObject</a>( <span class='pre'>strings, values</span> ) : Object</div><div class='description'><div class='short'>Take an array of strings and an array/arguments of\nvalues and return an object of key value pairs\nbased off each arra...</div><div class='long'><p>Take an array of strings and an array/arguments of\nvalues and return an object of key value pairs\nbased off each arrays index.  It is useful for taking\na long list of arguments and creating an object that can\nbe passed to other methods.</p>\n\n<pre><code>function longArgs(a,b,c,d,e,f) {\n    return <a href=\"#!/api/Luc.Object-method-toObject\" rel=\"Luc.Object-method-toObject\" class=\"docClass\">Luc.Object.toObject</a>(['a','b', 'c', 'd', 'e', 'f'], arguments)\n}\n\nlongArgs(1,2,3,4,5,6,7,8,9)\n\n&gt;Object {a: 1, b: 2, c: 3, d: 4, e: 5…}\na: 1\nb: 2\nc: 3\nd: 4\ne: 5\nf: 6\n\nlongArgs(1,2,3)\n\n&gt;Object {a: 1, b: 2, c: 3, d: undefined, e: undefined…}\na: 1\nb: 2\nc: 3\nd: undefined\ne: undefined\nf: undefined\n</code></pre>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>strings</span> : [String]<div class='sub-desc'>\n</div></li><li><span class='pre'>values</span> : Array|arguments<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'>\n</div></li></ul></div></div></div></div></div></div></div>"});