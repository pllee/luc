Ext.data.JsonP.Luc_Function({"tagname":"class","name":"Luc.Function","extends":null,"mixins":[],"alternateClassNames":[],"aliases":{},"singleton":false,"requires":[],"uses":[],"enum":null,"override":null,"inheritable":null,"inheritdoc":null,"meta":{},"private":null,"id":"class-Luc.Function","members":{"cfg":[],"property":[],"method":[{"name":"abstractFn","tagname":"method","owner":"Luc.Function","meta":{},"id":"method-abstractFn"},{"name":"createAugmentor","tagname":"method","owner":"Luc.Function","meta":{},"id":"method-createAugmentor"},{"name":"createDeferred","tagname":"method","owner":"Luc.Function","meta":{},"id":"method-createDeferred"},{"name":"createRelayer","tagname":"method","owner":"Luc.Function","meta":{},"id":"method-createRelayer"},{"name":"createSequence","tagname":"method","owner":"Luc.Function","meta":{},"id":"method-createSequence"},{"name":"createSequenceIf","tagname":"method","owner":"Luc.Function","meta":{},"id":"method-createSequenceIf"},{"name":"createThrotteled","tagname":"method","owner":"Luc.Function","meta":{},"id":"method-createThrotteled"},{"name":"emptyFn","tagname":"method","owner":"Luc.Function","meta":{},"id":"method-emptyFn"}],"event":[],"css_var":[],"css_mixin":[]},"linenr":5,"files":[{"filename":"function.js","href":"function2.html#Luc-Function"}],"html_meta":{},"statics":{"cfg":[],"property":[],"method":[],"event":[],"css_var":[],"css_mixin":[]},"component":false,"superclasses":[],"subclasses":[],"mixedInto":[],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/function2.html#Luc-Function' target='_blank'>function.js</a></div></pre><div class='doc-contents'><p>Package for function methods.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-abstractFn' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Luc.Function'>Luc.Function</span><br/><a href='source/function2.html#Luc-Function-method-abstractFn' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Luc.Function-method-abstractFn' class='name expandable'>abstractFn</a>( <span class='pre'></span> ) : <a href=\"#!/api/Function\" rel=\"Function\" class=\"docClass\">Function</a></div><div class='description'><div class='short'>A function that throws an error when called. ...</div><div class='long'><p>A function that throws an error when called.\nUseful when defining abstract like classes</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Function\" rel=\"Function\" class=\"docClass\">Function</a></span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-createAugmentor' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Luc.Function'>Luc.Function</span><br/><a href='source/function2.html#Luc-Function-method-createAugmentor' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Luc.Function-method-createAugmentor' class='name expandable'>createAugmentor</a>( <span class='pre'>fn, config</span> ) : <a href=\"#!/api/Function\" rel=\"Function\" class=\"docClass\">Function</a></div><div class='description'><div class='short'>Agument the passed in function's thisArg and or aguments object\nbased on the passed in config. ...</div><div class='long'><p>Agument the passed in function's thisArg and or aguments object\nbased on the passed in config.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>fn</span> : <a href=\"#!/api/Function\" rel=\"Function\" class=\"docClass\">Function</a><div class='sub-desc'><p>the function to call</p>\n</div></li><li><span class='pre'>config</span> : <a href=\"#!/api/Object\" rel=\"Object\" class=\"docClass\">Object</a><div class='sub-desc'>\n<ul><li><span class='pre'>thisArg</span> : <a href=\"#!/api/Object\" rel=\"Object\" class=\"docClass\">Object</a> (optional)<div class='sub-desc'><p>the thisArg for the funciton being executed.\nIf this is the only property on your config object the prefered way would\nbe just to use <a href=\"#!/api/Function-method-bind\" rel=\"Function-method-bind\" class=\"docClass\">Function.bind</a></p>\n</div></li><li><span class='pre'>args</span> : <a href=\"#!/api/Array\" rel=\"Array\" class=\"docClass\">Array</a> (optional)<div class='sub-desc'><p>the arguments used for the function being executed.\nThis will replace the functions call args if index is not a number or\ntrue.</p>\n</div></li><li><span class='pre'>index</span> : Number/True (optional)<div class='sub-desc'><p>By defualt the the configured arguments\nwill be inserted into the functions passed in call arguments.  If index is true\nappend the args together if it is a number insert it at the passed in index.</p>\n</div></li><li><span class='pre'>argumentsFirst</span> : <a href=\"#!/api/Array\" rel=\"Array\" class=\"docClass\">Array</a> (optional)<div class='sub-desc'><p>pass in false to\nagument the configured args first with <a href=\"#!/api/Luc.Array-method-insert\" rel=\"Luc.Array-method-insert\" class=\"docClass\">Luc.Array.insert</a>.  Defaults\nto true</p>\n\n<pre><code> function fn() {\n    console.log(this)\n    console.log(arguments)\n}\n\n<a href=\"#!/api/Luc.Function-method-createAugmentor\" rel=\"Luc.Function-method-createAugmentor\" class=\"docClass\">Luc.Function.createAugmentor</a>(fn, {\n    thisArg: {configedThisArg: true},\n    args: [1,2,3],\n    index:0\n})(4)\n\n&gt;Object {configedThisArg: true}\n&gt;[1, 2, 3, 4]\n\n<a href=\"#!/api/Luc.Function-method-createAugmentor\" rel=\"Luc.Function-method-createAugmentor\" class=\"docClass\">Luc.Function.createAugmentor</a>(fn, {\n    thisArg: {configedThisArg: true},\n    args: [1,2,3],\n    index:0,\n    argumentsFirst:false\n})(4)\n\n&gt;Object {configedThisArg: true}\n&gt;[4, 1, 2, 3]\n\n\nvar f = <a href=\"#!/api/Luc.Function-method-createAugmentor\" rel=\"Luc.Function-method-createAugmentor\" class=\"docClass\">Luc.Function.createAugmentor</a>(fn, {\n    args: [1,2,3],\n    index: true\n});\n\nf.apply({config: false}, [4])\n\n&gt;Object {config: false}\n&gt;[4, 1, 2, 3]\n</code></pre>\n</div></li></ul></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Function\" rel=\"Function\" class=\"docClass\">Function</a></span><div class='sub-desc'><p>the augmented function.</p>\n</div></li></ul></div></div></div><div id='method-createDeferred' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Luc.Function'>Luc.Function</span><br/><a href='source/function2.html#Luc-Function-method-createDeferred' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Luc.Function-method-createDeferred' class='name expandable'>createDeferred</a>( <span class='pre'>fn, [millis], [config]</span> ) : <a href=\"#!/api/Function\" rel=\"Function\" class=\"docClass\">Function</a></div><div class='description'><div class='short'>Defer a function's execution for the passed in\nmilliseconds. ...</div><div class='long'><p>Defer a function's execution for the passed in\nmilliseconds.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>fn</span> : <a href=\"#!/api/Function\" rel=\"Function\" class=\"docClass\">Function</a><div class='sub-desc'>\n</div></li><li><span class='pre'>millis</span> : <a href=\"#!/api/Number\" rel=\"Number\" class=\"docClass\">Number</a> (optional)<div class='sub-desc'><p>Number of milliseconds to\ndefer</p>\n</div></li><li><span class='pre'>config</span> : <a href=\"#!/api/Object\" rel=\"Object\" class=\"docClass\">Object</a> (optional)<div class='sub-desc'><p>Config object\nfor <a href=\"#!/api/Luc.Function-method-createAugmentor\" rel=\"Luc.Function-method-createAugmentor\" class=\"docClass\">Luc.Function.createAugmentor</a>.  If defined all of the functions\nwill get created with the passed in config;</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Function\" rel=\"Function\" class=\"docClass\">Function</a></span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-createRelayer' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Luc.Function'>Luc.Function</span><br/><a href='source/function2.html#Luc-Function-method-createRelayer' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Luc.Function-method-createRelayer' class='name expandable'>createRelayer</a>( <span class='pre'>fns, [config]</span> ) : <a href=\"#!/api/Function\" rel=\"Function\" class=\"docClass\">Function</a></div><div class='description'><div class='short'>Return a functions that runs the passed in functions\nthe result of each function will be the the call args\nfor the ne...</div><div class='long'><p>Return a functions that runs the passed in functions\nthe result of each function will be the the call args\nfor the next function.  The value of the last function\nreturn will be returned.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>fns</span> : <a href=\"#!/api/Function\" rel=\"Function\" class=\"docClass\">Function</a>/<a href=\"#!/api/Function\" rel=\"Function\" class=\"docClass\">Function</a>[]<div class='sub-desc'>\n</div></li><li><span class='pre'>config</span> : <a href=\"#!/api/Object\" rel=\"Object\" class=\"docClass\">Object</a> (optional)<div class='sub-desc'><p>Config object\nfor <a href=\"#!/api/Luc.Function-method-createAugmentor\" rel=\"Luc.Function-method-createAugmentor\" class=\"docClass\">Luc.Function.createAugmentor</a>.  If defined all of the functions\nwill get created with the passed in config;</p>\n\n<pre><code> <a href=\"#!/api/Luc.Function-method-createRelayer\" rel=\"Luc.Function-method-createRelayer\" class=\"docClass\">Luc.Function.createRelayer</a>([\n    function(str) {\n        return str + 'b'\n    },\n    function(str) {\n        return str + 'c'\n    },\n    function(str) {\n        return str + 'd'\n    }\n])('a')\n\n&gt;\"abcd\"\n</code></pre>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Function\" rel=\"Function\" class=\"docClass\">Function</a></span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-createSequence' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Luc.Function'>Luc.Function</span><br/><a href='source/function2.html#Luc-Function-method-createSequence' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Luc.Function-method-createSequence' class='name expandable'>createSequence</a>( <span class='pre'>fns, [config]</span> ) : <a href=\"#!/api/Function\" rel=\"Function\" class=\"docClass\">Function</a></div><div class='description'><div class='short'>Return a function that runs the passed in functions\nand returns the result of the last function called. ...</div><div class='long'><p>Return a function that runs the passed in functions\nand returns the result of the last function called.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>fns</span> : <a href=\"#!/api/Function\" rel=\"Function\" class=\"docClass\">Function</a>/<a href=\"#!/api/Function\" rel=\"Function\" class=\"docClass\">Function</a>[]<div class='sub-desc'>\n</div></li><li><span class='pre'>config</span> : <a href=\"#!/api/Object\" rel=\"Object\" class=\"docClass\">Object</a> (optional)<div class='sub-desc'><p>Config object\nfor <a href=\"#!/api/Luc.Function-method-createAugmentor\" rel=\"Luc.Function-method-createAugmentor\" class=\"docClass\">Luc.Function.createAugmentor</a>.  If defined all of the functions\nwill get created with the passed in config;</p>\n\n<pre><code><a href=\"#!/api/Luc.Function-method-createSequence\" rel=\"Luc.Function-method-createSequence\" class=\"docClass\">Luc.Function.createSequence</a>([\n    function() {\n        console.log(1)\n    },\n    function() {\n        console.log(2)\n    },\n    function() {\n        console.log(3)\n        console.log('finished logging')\n        return 4;\n    }\n])()\n&gt;1\n&gt;2\n&gt;3\n&gt;finished logging\n&gt;4\n</code></pre>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Function\" rel=\"Function\" class=\"docClass\">Function</a></span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-createSequenceIf' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Luc.Function'>Luc.Function</span><br/><a href='source/function2.html#Luc-Function-method-createSequenceIf' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Luc.Function-method-createSequenceIf' class='name expandable'>createSequenceIf</a>( <span class='pre'>fns, [config]</span> ) : <a href=\"#!/api/Function\" rel=\"Function\" class=\"docClass\">Function</a></div><div class='description'><div class='short'>Return a function that runs the passed in functions\nif one of the functions results false the rest of the\nfunctions w...</div><div class='long'><p>Return a function that runs the passed in functions\nif one of the functions results false the rest of the\nfunctions won't run and false will be returned.</p>\n\n<p>If no false is returned the value of the last function return will be returned</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>fns</span> : <a href=\"#!/api/Function\" rel=\"Function\" class=\"docClass\">Function</a>/<a href=\"#!/api/Function\" rel=\"Function\" class=\"docClass\">Function</a>[]<div class='sub-desc'>\n</div></li><li><span class='pre'>config</span> : <a href=\"#!/api/Object\" rel=\"Object\" class=\"docClass\">Object</a> (optional)<div class='sub-desc'><p>Config object\nfor <a href=\"#!/api/Luc.Function-method-createAugmentor\" rel=\"Luc.Function-method-createAugmentor\" class=\"docClass\">Luc.Function.createAugmentor</a>.  If defined all of the functions\nwill get created with the passed in config;</p>\n\n<pre><code><a href=\"#!/api/Luc.Function-method-createSequenceIf\" rel=\"Luc.Function-method-createSequenceIf\" class=\"docClass\">Luc.Function.createSequenceIf</a>([\n    function() {\n        console.log(1)\n    },\n    function() {\n        console.log(2)\n    },\n    function() {\n        console.log(3)\n        console.log('finished logging')\n        return 4;\n    }, function() {\n        return false;\n    }, function() {\n        console.log('i cant log')\n    }\n])()\n\n&gt;1\n&gt;2\n&gt;3\n&gt;finished logging\n&gt;false\n</code></pre>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Function\" rel=\"Function\" class=\"docClass\">Function</a></span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-createThrotteled' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Luc.Function'>Luc.Function</span><br/><a href='source/function2.html#Luc-Function-method-createThrotteled' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Luc.Function-method-createThrotteled' class='name expandable'>createThrotteled</a>( <span class='pre'>fn, [millis], [config]</span> ) : <a href=\"#!/api/Function\" rel=\"Function\" class=\"docClass\">Function</a></div><div class='description'><div class='short'>Create a throttled function that the passed in funciton\nonly gets evoked once even it is called many times ...</div><div class='long'><p>Create a throttled function that the passed in funciton\nonly gets evoked once even it is called many times</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>fn</span> : <a href=\"#!/api/Function\" rel=\"Function\" class=\"docClass\">Function</a><div class='sub-desc'>\n</div></li><li><span class='pre'>millis</span> : <a href=\"#!/api/Number\" rel=\"Number\" class=\"docClass\">Number</a> (optional)<div class='sub-desc'><p>Number of milliseconds to\nthrottle the function.</p>\n</div></li><li><span class='pre'>config</span> : <a href=\"#!/api/Object\" rel=\"Object\" class=\"docClass\">Object</a> (optional)<div class='sub-desc'><p>Config object\nfor <a href=\"#!/api/Luc.Function-method-createAugmentor\" rel=\"Luc.Function-method-createAugmentor\" class=\"docClass\">Luc.Function.createAugmentor</a>.  If defined all of the functions\nwill get created with the passed in config;</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Function\" rel=\"Function\" class=\"docClass\">Function</a></span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-emptyFn' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Luc.Function'>Luc.Function</span><br/><a href='source/function2.html#Luc-Function-method-emptyFn' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Luc.Function-method-emptyFn' class='name expandable'>emptyFn</a>( <span class='pre'></span> ) : <a href=\"#!/api/Function\" rel=\"Function\" class=\"docClass\">Function</a></div><div class='description'><div class='short'>A reusable empty function ...</div><div class='long'><p>A reusable empty function</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Function\" rel=\"Function\" class=\"docClass\">Function</a></span><div class='sub-desc'>\n</div></li></ul></div></div></div></div></div></div></div>"});