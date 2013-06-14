Ext.data.JsonP.Luc_Array({"tagname":"class","name":"Luc.Array","extends":null,"mixins":[],"alternateClassNames":[],"aliases":{},"singleton":false,"requires":[],"uses":[],"enum":null,"override":null,"inheritable":null,"inheritdoc":null,"meta":{},"private":null,"id":"class-Luc.Array","members":{"cfg":[],"property":[],"method":[{"name":"each","tagname":"method","owner":"Luc.Array","meta":{},"id":"method-each"},{"name":"toArray","tagname":"method","owner":"Luc.Array","meta":{},"id":"method-toArray"}],"event":[],"css_var":[],"css_mixin":[]},"linenr":1,"files":[{"filename":"array.js","href":"array.html#Luc-Array"}],"html_meta":{},"statics":{"cfg":[],"property":[],"method":[],"event":[],"css_var":[],"css_mixin":[]},"component":false,"superclasses":[],"subclasses":[],"mixedInto":[],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/array.html#Luc-Array' target='_blank'>array.js</a></div></pre><div class='doc-contents'><p>Luc Array functions.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-each' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Luc.Array'>Luc.Array</span><br/><a href='source/array.html#Luc-Array-method-each' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Luc.Array-method-each' class='name expandable'>each</a>( <span class='pre'>arrOrItem, fn, context</span> )</div><div class='description'><div class='short'>Runs an array.forEach after calling Luc.Array.toArray on the item. ...</div><div class='long'><p>Runs an array.forEach after calling <a href=\"#!/api/Luc.Array-method-toArray\" rel=\"Luc.Array-method-toArray\" class=\"docClass\">Luc.Array.toArray</a> on the item.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>arrOrItem</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>fn</span> : Function<div class='sub-desc'>\n</div></li><li><span class='pre'>context</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-toArray' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Luc.Array'>Luc.Array</span><br/><a href='source/array.html#Luc-Array-method-toArray' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Luc.Array-method-toArray' class='name expandable'>toArray</a>( <span class='pre'>arrOrItem</span> ) : Object</div><div class='description'><div class='short'>Return an empty array if arrOrItem is null or undefined\nif arrrayOrItem is an array just return it, if arrayOrItem\nis...</div><div class='long'><p>Return an empty array if arrOrItem is null or undefined\nif arrrayOrItem is an array just return it, if arrayOrItem\nis an item just return an array containing the item.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>arrOrItem</span> : Object<div class='sub-desc'><p>item to turn into an array.</p>\n\n<pre><code><a href=\"#!/api/Luc.Array-method-toArray\" rel=\"Luc.Array-method-toArray\" class=\"docClass\">Luc.Array.toArray</a>()\n&gt;[]\n<a href=\"#!/api/Luc.Array-method-toArray\" rel=\"Luc.Array-method-toArray\" class=\"docClass\">Luc.Array.toArray</a>(null)\n&gt;[]\n<a href=\"#!/api/Luc.Array-method-toArray\" rel=\"Luc.Array-method-toArray\" class=\"docClass\">Luc.Array.toArray</a>(1)\n&gt;[1]\n<a href=\"#!/api/Luc.Array-method-toArray\" rel=\"Luc.Array-method-toArray\" class=\"docClass\">Luc.Array.toArray</a>([1,2])\n&gt;[1, 2]\n</code></pre>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>the array</p>\n</div></li></ul></div></div></div></div></div></div></div>"});