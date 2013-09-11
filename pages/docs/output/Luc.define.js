Ext.data.JsonP.Luc_define({"tagname":"class","name":"Luc.define","autodetected":{},"files":[{"filename":"definer.js","href":"definer.html#Luc-define"}],"members":[{"name":"$compositions","tagname":"cfg","owner":"Luc.define","id":"cfg-S-compositions","meta":{}},{"name":"$mixins","tagname":"cfg","owner":"Luc.define","id":"cfg-S-mixins","meta":{}},{"name":"$statics","tagname":"cfg","owner":"Luc.define","id":"cfg-S-statics","meta":{}},{"name":"$super","tagname":"cfg","owner":"Luc.define","id":"cfg-S-super","meta":{}},{"name":"$class","tagname":"property","owner":"Luc.define","id":"property-S-class","meta":{}},{"name":"$super","tagname":"property","owner":"Luc.define","id":"property-S-super","meta":{}},{"name":"callSuper","tagname":"property","owner":"Luc.define","id":"property-callSuper","meta":{}},{"name":"getComposition","tagname":"property","owner":"Luc.define","id":"property-getComposition","meta":{}},{"name":"getStaticValue","tagname":"property","owner":"Luc.define","id":"property-getStaticValue","meta":{}},{"name":"callSuper","tagname":"method","owner":"Luc.define","id":"method-callSuper","meta":{}},{"name":"define","tagname":"method","owner":"Luc.define","id":"method-define","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-Luc.define","short_doc":"This is actually a function but has a decent amount of important options\nso we are documenting it like it is a class. ...","component":false,"superclasses":[],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/definer.html#Luc-define' target='_blank'>definer.js</a></div></pre><div class='doc-contents'><p>This is actually a function but has a decent amount of important options\nso we are documenting it like it is a class.  Properties are things that will get\napplied to instances of classes defined with <a href=\"#!/api/Luc.define-method-define\" rel=\"Luc.define-method-define\" class=\"docClass\">define</a>.  None\nare needed for <a href=\"#!/api/Luc.define-method-define\" rel=\"Luc.define-method-define\" class=\"docClass\">defining</a> a class.  <a href=\"#!/api/Luc.define-method-define\" rel=\"Luc.define-method-define\" class=\"docClass\">define</a>\njust takes the passed in config and puts the properties on the prototype and returns\na Constructor.</p>\n\n<pre><code>var C = <a href=\"#!/api/Luc.define\" rel=\"Luc.define\" class=\"docClass\">Luc.define</a>({\n    a: 1,\n    doLog: true,\n    logA: function() {\n        if (this.doLog) {\n            console.log(this.a);\n        }\n    }\n});\nvar c = new C();\nc.logA();\n&gt;1\nc.a = 45;\nc.logA();\n&gt;45\nc.doLog = false;\nc.logA();\n\nnew C().logA()\n&gt;1\n</code></pre>\n\n<p>Check out the following configs to add functionality to a class without messing\nup the inheritance chain.  All the configs have examples and documentation on\nhow to use them.</p>\n\n<p><a href=\"#!/api/Luc.define-property-S-super\" rel=\"Luc.define-property-S-super\" class=\"docClass\">super</a> <br>\n<a href=\"#!/api/Luc.define-cfg-S-compositions\" rel=\"Luc.define-cfg-S-compositions\" class=\"docClass\">compositions</a> <br>\n<a href=\"#!/api/Luc.define-cfg-S-mixins\" rel=\"Luc.define-cfg-S-mixins\" class=\"docClass\">mixins</a> <br>\n<a href=\"#!/api/Luc.define-cfg-S-statics\" rel=\"Luc.define-cfg-S-statics\" class=\"docClass\">statics</a> <br></p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div id='cfg-S-compositions' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Luc.define'>Luc.define</span><br/><a href='source/definer.html#Luc-define-cfg-S-compositions' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Luc.define-cfg-S-compositions' class='name expandable'>$compositions</a> : <a href=\"#!/api/Object\" rel=\"Object\" class=\"docClass\">Object</a>/<a href=\"#!/api/Object\" rel=\"Object\" class=\"docClass\">Object</a>[]<span class=\"signature\"></span></div><div class='description'><div class='short'>(optional) config objects for\nLuc.Composition. ...</div><div class='long'><p>(optional) config objects for\n<a href=\"#!/api/Luc.Composition\" rel=\"Luc.Composition\" class=\"docClass\">Luc.Composition</a>.  Compositions are a great way to add behavior to a class\nwithout extending it.  A <a href=\"#!/api/Luc.define-cfg-S-mixins\" rel=\"Luc.define-cfg-S-mixins\" class=\"docClass\">mixin</a> can offer similar functionality but should\nnot be adding an unneeded state.  A Constructor and a name are needed for the config object.\n Using this config adds the <a href=\"#!/api/Luc.define-property-getComposition\" rel=\"Luc.define-property-getComposition\" class=\"docClass\">getComposition</a>\nmethod to instances.\n<br>\nThe methods property is optional here but it is saying take all of\n<a href=\"#!/api/Luc.EventEmitter\" rel=\"Luc.EventEmitter\" class=\"docClass\">Luc.EventEmitter</a>'s instance methods and make them instance methods for C.\nYou can check out all of the config options by looking at <a href=\"#!/api/Luc.Composition\" rel=\"Luc.Composition\" class=\"docClass\">Luc.Composition</a>.</p>\n\n<pre><code>    var C = <a href=\"#!/api/Luc.define\" rel=\"Luc.define\" class=\"docClass\">Luc.define</a>({\n        $compositions: {\n            Constructor: <a href=\"#!/api/Luc.EventEmitter\" rel=\"Luc.EventEmitter\" class=\"docClass\">Luc.EventEmitter</a>,\n            name: 'emitter',\n            methods: 'allMethods'\n        }\n    });\n\n    var c = new C();\n\n    c.on('hey', function() {\n        console.log(arguments);\n    });\n\n    c.emit('hey', 1,2,3, 'a');\n    &gt;[1, 2, 3, \"a\"]\n    c instanceof <a href=\"#!/api/Luc.EventEmitter\" rel=\"Luc.EventEmitter\" class=\"docClass\">Luc.EventEmitter</a>\n    &gt;false\n    c._events\n    &gt;undefined\n</code></pre>\n\n<p><a href=\"#!/api/Luc.EventEmitter\" rel=\"Luc.EventEmitter\" class=\"docClass\">Luc.EventEmitter</a> is preferred as a composition over a mixin because\nit adds a state \"_events\" to the this instance when on is called.  It\nalso shouldn't have to know that it may be instantiated alone or mixed into classes\nso the initing of state is not done in the constructor like it probably should.\nIt is not terrible practice by any means but it is not good to have a standalone class\nthat knows that it may be mixing.  Even worse than that would be a mixin that needs\nto be inited by the defining class.  Encapsulating logic in a class\nand using it anywhere seamlessly is where compositions shine. Luc comes with two common\nenums that we expect will be used often.</p>\n\n<p><br>\nHere is an example of a simple composition see how the functionality\nis added but we are not inheriting and this.count is\nundefined.</p>\n\n<pre><code>     function Counter() {\n        this.count = 0;\n     };\n\n     Counter.prototype = {\n        getCount: function() {\n            return this.count;\n        },\n        increaseCount: function() {\n            this.count++;\n        }\n     }\n\n     var C = <a href=\"#!/api/Luc.define\" rel=\"Luc.define\" class=\"docClass\">Luc.define</a>({\n            $compositions: {\n                name: 'counter',\n                Constructor: Counter,\n                methods: 'allMethods'\n            }\n    });\n\n    var c = new C()\n\n    c.increaseCount();\n    c.increaseCount();\n    c.increaseCount();\n    c.getCount();\n    &gt;3\n    c.count\n    &gt;undefined\n</code></pre>\n\n<p>Luc comes with two default composition objects <a href=\"#!/api/Luc.compositionEnums-property-PluginManager\" rel=\"Luc.compositionEnums-property-PluginManager\" class=\"docClass\">Luc.compositionEnums.PluginManager</a>\nand <a href=\"#!/api/Luc.compositionEnums-property-EventEmitter\" rel=\"Luc.compositionEnums-property-EventEmitter\" class=\"docClass\">Luc.compositionEnums.EventEmitter</a>.</p>\n\n<p>Here is the plugin manager enum, keep in mind that this\nfunctionality can be added to any class, not just ones defined with\n<a href=\"#!/api/Luc.define\" rel=\"Luc.define\" class=\"docClass\">Luc.define</a>.  Check out <a href=\"#!/api/Luc.PluginManager\" rel=\"Luc.PluginManager\" class=\"docClass\">Luc.PluginManager</a> to see all of the public\nmethods that gets added to the defined instance.</p>\n\n<p>A plugin follows the following life-cycle: <br></p>\n\n<p>plugin is added to the instance -> plugin is created -> plugin init is called with instance -> if needed destroy called by instance -> destroy called on plugin <br>\nHere is the most basic example using the <a href=\"#!/api/Luc.Plugin\" rel=\"Luc.Plugin\" class=\"docClass\">default</a> plugin.</p>\n\n<pre><code>var C = <a href=\"#!/api/Luc.define\" rel=\"Luc.define\" class=\"docClass\">Luc.define</a>({\n    $compositions: <a href=\"#!/api/Luc.compositionEnums-property-PluginManager\" rel=\"Luc.compositionEnums-property-PluginManager\" class=\"docClass\">Luc.compositionEnums.PluginManager</a>\n});\n\nvar c = new C({\n    plugins: [{\n            init: function() {\n                console.log('im getting initted')\n            },\n            myCoolName: 'cool'\n        }\n    ]\n});\n\n&gt;im getting initted\n\nc.getPlugin({myCoolName: 'coo'}) instanceof <a href=\"#!/api/Luc.Plugin\" rel=\"Luc.Plugin\" class=\"docClass\">Luc.Plugin</a>\n&gt; true\n</code></pre>\n\n<p> Plugins can be of any class and can be added with <a href=\"#!/api/Luc.PluginManager-method-addPlugin\" rel=\"Luc.PluginManager-method-addPlugin\" class=\"docClass\">addPlugin</a></p>\n\n<pre><code>function MyPlugin(){}\n\nvar C = <a href=\"#!/api/Luc.define\" rel=\"Luc.define\" class=\"docClass\">Luc.define</a>({\n    $compositions: <a href=\"#!/api/Luc.compositionEnums-property-PluginManager\" rel=\"Luc.compositionEnums-property-PluginManager\" class=\"docClass\">Luc.compositionEnums.PluginManager</a>\n});\n\nvar c = new C();\n\nc.addPlugin({Constructor: MyPlugin});\n//getPlugin takes a Constructor or match object\nc.getPlugin(MyPlugin) instanceof MyPlugin\n&gt;true\nc.getPlugin(<a href=\"#!/api/Luc.Plugin\" rel=\"Luc.Plugin\" class=\"docClass\">Luc.Plugin</a>)\n&gt;false\n</code></pre>\n\n<p>Plugins can also be destroyed individually or all of them at once</p>\n\n<pre><code>var C = <a href=\"#!/api/Luc.define\" rel=\"Luc.define\" class=\"docClass\">Luc.define</a>({\n    $compositions: <a href=\"#!/api/Luc.compositionEnums-property-PluginManager\" rel=\"Luc.compositionEnums-property-PluginManager\" class=\"docClass\">Luc.compositionEnums.PluginManager</a>\n});\n\nvar c = new C({\n    plugins: [{\n        init: function() {\n            console.log('im getting initted ' + this.name)\n        },\n        destroy: function() {\n            console.log('destroyed : ' + this.name)\n        },\n        name: '1'\n    },{\n        init: function() {\n            console.log('im getting initted ' + this.name)\n        },\n        destroy: function() {\n            console.log('destroyed : ' + this.name)\n        },\n        name: '2'\n    }]\n});\n\n&gt;im getting initted 1\n&gt;im getting initted 2\n\n\nc.destroyPlugin({name: '1'});\n&gt;destroyed : 1\n//a plugin is returned if it is found and destroyed\n&gt;Plugin {init: function, destroy: function, name: \"1\", owner: Object, init: function…}\n\nc.destroyPlugin({name: '1'});\n//false is returned if it is not found\n&gt;false\n\nc.destroyAllPlugins();\n&gt;destroyed : 2\n</code></pre>\n\n<p>You can see that it can add plugin like behavior to any defining\nclass with <a href=\"#!/api/Luc.PluginManager\" rel=\"Luc.PluginManager\" class=\"docClass\">Luc.PluginManager</a> which is less than 75 SLOC.</p>\n</div></div></div><div id='cfg-S-mixins' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Luc.define'>Luc.define</span><br/><a href='source/definer.html#Luc-define-cfg-S-mixins' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Luc.define-cfg-S-mixins' class='name expandable'>$mixins</a> : Object/Constructor/Object[]/Constructor[]<span class=\"signature\"></span></div><div class='description'><div class='short'>(optional)  Mixins are a way to add functionality\nto a class that should not add state to the instance unknowingly. ...</div><div class='long'><p>(optional)  Mixins are a way to add functionality\nto a class that should not add state to the instance unknowingly.  Mixins can be either objects or Constructors.</p>\n\n<pre><code>function Logger() {}\nLogger.prototype.log = function() {\n    console.log(arguments)\n}\n\nvar C = <a href=\"#!/api/Luc.define\" rel=\"Luc.define\" class=\"docClass\">Luc.define</a>({\n    $mixins: [Logger, {\n        warn: function() {\n            console.warn(arguments)\n        }\n    }]\n});\n\nvar c = new C();\n\nc.log(1,2)\n&gt;[1,2]\n\nc.warn(3,4)\n&gt;[3,4]\n</code></pre>\n</div></div></div><div id='cfg-S-statics' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Luc.define'>Luc.define</span><br/><a href='source/definer.html#Luc-define-cfg-S-statics' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Luc.define-cfg-S-statics' class='name expandable'>$statics</a> : <a href=\"#!/api/Object\" rel=\"Object\" class=\"docClass\">Object</a><span class=\"signature\"></span></div><div class='description'><div class='short'>(optional) Add static properties or methods\nto the class. ...</div><div class='long'><p>(optional) Add static properties or methods\nto the class.  These properties/methods will not be able to be\ndirectly modified by the instance so they are good for defining default\nconfigs.  Using this config adds the <a href=\"#!/api/Luc.define-property-getStaticValue\" rel=\"Luc.define-property-getStaticValue\" class=\"docClass\">getStaticValue</a>\nmethod to instances.</p>\n\n<pre><code>var C = <a href=\"#!/api/Luc.define\" rel=\"Luc.define\" class=\"docClass\">Luc.define</a>({\n    $statics: {\n        number: 1\n    }\n});\n\nvar c = new C();\nc.number\n&gt;undefined\nC.number\n&gt;1\n</code></pre>\n\n<p>Bad things can happen if non primitives are placed on the\nprototype and instance sharing is not wanted.  Using statics\nprevent subclasses and instances from unknowingly modifying\nall instances.</p>\n\n<pre><code>var C = <a href=\"#!/api/Luc.define\" rel=\"Luc.define\" class=\"docClass\">Luc.define</a>({\n    cfg: {\n        a: 1\n    }\n});\n\nvar c = new C();\nc.cfg.a\n&gt;1\nc.cfg.a = 5\nnew C().cfg.a\n&gt;5\n</code></pre>\n</div></div></div><div id='cfg-S-super' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Luc.define'>Luc.define</span><br/><a href='source/definer.html#Luc-define-cfg-S-super' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Luc.define-cfg-S-super' class='name expandable'>$super</a> : Constructor<span class=\"signature\"></span></div><div class='description'><div class='short'>(optional)  super for the defining class. ...</div><div class='long'><p>(optional)  super for the defining class.  By <a href=\"#!/api/Luc.Base\" rel=\"Luc.Base\" class=\"docClass\">Luc.Base</a>\nis the default if super is not passed in.  To define a class without a superclass\nyou can pass in false or null.</p>\n\n<pre><code> function Counter() {\n    this.count = 0;\n };\n\n Counter.prototype = {\n    getCount: function() {\n        return this.count;\n    },\n    increaseCount: function() {\n        this.count++;\n    }\n }\n\n var C = <a href=\"#!/api/Luc.define\" rel=\"Luc.define\" class=\"docClass\">Luc.define</a>({\n    $super:Counter\n});\n\nvar c = new C()\n\nc instanceof Counter\n&gt;true\nc.increaseCount();\nc.getCount();\n&gt;1\nc.count\n&gt;1\n</code></pre>\n\n<p>A reference to the superclass's methods can be obtained through\nthe defined class's property $superclass.  Similar functionality\ncan be done with <a href=\"#!/api/Luc.define-property-callSuper\" rel=\"Luc.define-property-callSuper\" class=\"docClass\">callSuper</a> but callSuper\nis much less efficient.</p>\n\n<pre><code> var C = <a href=\"#!/api/Luc.define\" rel=\"Luc.define\" class=\"docClass\">Luc.define</a>({\n    $super:Counter,\n    increaseCount: function () {\n        this.count += 2;\n        C.$superclass.increaseCount.call(this);\n    }\n});\n\nvar c = new C();\nc.increaseCount();\nc.count\n&gt;3\n</code></pre>\n\n<p>Check out <a href=\"#!/api/Luc.Base\" rel=\"Luc.Base\" class=\"docClass\">Luc.Base</a> to see why we have it as the default.</p>\n\n<pre><code>var B = <a href=\"#!/api/Luc.define\" rel=\"Luc.define\" class=\"docClass\">Luc.define</a>({\n    amIALucBase: function() {\n        return this instanceof <a href=\"#!/api/Luc.Base\" rel=\"Luc.Base\" class=\"docClass\">Luc.Base</a>\n    }\n})\nvar b = new B();\nb.amIALucBase();\n&gt;true\n</code></pre>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-S-class' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Luc.define'>Luc.define</span><br/><a href='source/definer.html#Luc-define-property-S-class' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Luc.define-property-S-class' class='name expandable'>$class</a> : <a href=\"#!/api/Function\" rel=\"Function\" class=\"docClass\">Function</a><span class=\"signature\"></span></div><div class='description'><div class='short'>reference to the instance's own constructor. ...</div><div class='long'><p>reference to the instance's own constructor.  This\nwill get added to any class that is defined with <a href=\"#!/api/Luc.define\" rel=\"Luc.define\" class=\"docClass\">Luc.define</a>.</p>\n\n<pre><code>var C = <a href=\"#!/api/Luc.define\" rel=\"Luc.define\" class=\"docClass\">Luc.define</a>()\nvar c = new C()\nc.$class === C\n&gt;true\n</code></pre>\n\n<p>There are some really good use cases to have a reference to it's\nown constructor.  <br> Add functionality to an instance in a simple\nand generic way:</p>\n\n<pre><code>var C = <a href=\"#!/api/Luc.define\" rel=\"Luc.define\" class=\"docClass\">Luc.define</a>({\n    add: function(a,b) {\n        return a + b;\n    }\n});\n\n//<a href=\"#!/api/Luc.Base\" rel=\"Luc.Base\" class=\"docClass\">Luc.Base</a> applies first \n//arg to the instance\n\nvar c = new C({\n    add: function(a,b,c) {\n        return this.$class.prototype.add.call(this, a,b) + c;\n    }\n});\n\nc.add(1,2,3)\n&gt;6\nnew C().add(1,2,3)\n&gt;3\n</code></pre>\n\n<p>Or have a simple generic clone method :</p>\n\n<pre><code>var C = <a href=\"#!/api/Luc.define\" rel=\"Luc.define\" class=\"docClass\">Luc.define</a>({\n    clone: function() {\n        var myOwnProps = {};\n        <a href=\"#!/api/Luc.Object-method-each\" rel=\"Luc.Object-method-each\" class=\"docClass\">Luc.Object.each</a>(this, function(key, value) {\n            myOwnProps[key] = value;\n        });\n\n        return new this.$class(myOwnProps);\n    }\n});\n\nvar c = new C({a:1,b:2,c:3});\nc.d = 4;\nvar clone = c.clone();\n\nclone === c\n&gt;false\n\nclone.a\n&gt;1\nclone.b\n&gt;2\nclone.c\n&gt;3\nclone.d\n&gt;4\n</code></pre>\n</div></div></div><div id='property-S-super' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Luc.define'>Luc.define</span><br/><a href='source/definer.html#Luc-define-property-S-super' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Luc.define-property-S-super' class='name expandable'>$super</a> : <a href=\"#!/api/Function\" rel=\"Function\" class=\"docClass\">Function</a><span class=\"signature\"></span></div><div class='description'><div class='short'>If $super is not false or null\nthe $super property will be added to every instance of the defined class,\n$super is th...</div><div class='long'><p>If $super is not false or null\nthe $super property will be added to every instance of the defined class,\n$super is the Constructor passed in with the $super config or the <a href=\"#!/api/Luc.ClassDefiner-cfg-defaultType\" rel=\"Luc.ClassDefiner-cfg-defaultType\" class=\"docClass\">default</a></p>\n\n<pre><code>var C = <a href=\"#!/api/Luc.define\" rel=\"Luc.define\" class=\"docClass\">Luc.define</a>()\nvar c = new C()\n//<a href=\"#!/api/Luc.Base\" rel=\"Luc.Base\" class=\"docClass\">Luc.Base</a> is the default \nc.$super === <a href=\"#!/api/Luc.Base\" rel=\"Luc.Base\" class=\"docClass\">Luc.Base</a>\n&gt;true\n</code></pre>\n</div></div></div><div id='property-callSuper' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Luc.define'>Luc.define</span><br/><a href='source/definer.html#Luc-define-property-callSuper' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Luc.define-property-callSuper' class='name expandable'>callSuper</a> : <a href=\"#!/api/Function\" rel=\"Function\" class=\"docClass\">Function</a><span class=\"signature\"></span></div><div class='description'><div class='short'>If $super is defined it\nwill be on the prototype of $super. ...</div><div class='long'><p>If $super is defined it\nwill be on the prototype of $super.  It can be used to call a super's\nmethod.  This can be used instead of the class's static $superclass reference.\nCheck out <a href=\"#!/api/Luc.define-property-callSuper\" rel=\"Luc.define-property-callSuper\" class=\"docClass\">callSuper</a> for more extensive documentation.</p>\n\n<pre><code>function MyCoolClass() {}\nMyCoolClass.prototype.addNums = function(a,b) {\n    return a + b;\n}\n\nvar MyOtherCoolClass = <a href=\"#!/api/Luc.define\" rel=\"Luc.define\" class=\"docClass\">Luc.define</a>({\n    $super: MyCoolClass,\n    addNums: function(a, b, c) {\n        return this.callSuper([a, b]) + c;\n    }\n})\n\nvar m = new MyOtherCoolClass();\nm.addNums(1,2,3);\n&gt;6\n</code></pre>\n</div></div></div><div id='property-getComposition' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Luc.define'>Luc.define</span><br/><a href='source/definer.html#Luc-define-property-getComposition' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Luc.define-property-getComposition' class='name expandable'>getComposition</a> : <a href=\"#!/api/Function\" rel=\"Function\" class=\"docClass\">Function</a><span class=\"signature\"></span></div><div class='description'><div class='short'>this method will be added\nto instances that use the $compositions  config\n\n This will return the composition instance...</div><div class='long'><p>this method will be added\nto instances that use the <a href=\"#!/api/Luc.define-cfg-S-compositions\" rel=\"Luc.define-cfg-S-compositions\" class=\"docClass\">$compositions</a>  config</p>\n\n<p> This will return the composition instance based off the composition <a href=\"#!/api/Luc.Composition-cfg-name\" rel=\"Luc.Composition-cfg-name\" class=\"docClass\">name</a></p>\n\n<pre><code>this.getComposition(\"name\");\n</code></pre>\n</div></div></div><div id='property-getStaticValue' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Luc.define'>Luc.define</span><br/><a href='source/definer.html#Luc-define-property-getStaticValue' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Luc.define-property-getStaticValue' class='name expandable'>getStaticValue</a> : <a href=\"#!/api/Function\" rel=\"Function\" class=\"docClass\">Function</a><span class=\"signature\"></span></div><div class='description'><div class='short'>this method\nwill be added to instances that use the $statics\nconfig. ...</div><div class='long'><p>this method\nwill be added to instances that use the <a href=\"#!/api/Luc.define-cfg-S-statics\" rel=\"Luc.define-cfg-S-statics\" class=\"docClass\">$statics</a>\nconfig.</p>\n\n<p>This should be used over this.$class.staticName to\nget the value of static.  If the class gets inherited\nfrom, this.$class will not be the same.  getStatic value\ndeals with this issue.</p>\n\n<pre><code>var A = <a href=\"#!/api/Luc.define\" rel=\"Luc.define\" class=\"docClass\">Luc.define</a>({\n    $statics: {\n        a: 1\n        },\n    getABetter: function() {\n        return this.getStaticValue('a');\n    },\n    getA: function() {\n        return this.$class.a;\n    }\n});\n\nvar B = <a href=\"#!/api/Luc.define\" rel=\"Luc.define\" class=\"docClass\">Luc.define</a>({\n    $super: A,\n    $statics: {\n        b: 2,\n        c: 3\n    }\n});\n\n\nvar b = new B();\nb.getA();\n&gt;undefined\nb.getABetter();\n&gt;1\n</code></pre>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Object\" rel=\"Object\" class=\"docClass\">Object</a></span><div class='sub-desc'><p>the static value of the key</p>\n</div></li></ul></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-callSuper' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Luc.define'>Luc.define</span><br/><a href='source/definer.html#Luc-define-method-callSuper' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Luc.define-method-callSuper' class='name expandable'>callSuper</a>( <span class='pre'>[args]</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>If $super is defined it\nwill be on the prototype of $super. ...</div><div class='long'><p>If $super is defined it\nwill be on the prototype of $super.  It can be used to call a super's\nmethod.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>args</span> : <a href=\"#!/api/Array\" rel=\"Array\" class=\"docClass\">Array</a>/Arguments (optional)<div class='sub-desc'><p>The arguments for the super methods apply call.</p>\n\n<pre><code>function MyCoolClass() {}\nMyCoolClass.prototype.addNums = function(a,b) {\n    return a + b;\n}\n\nvar MC = <a href=\"#!/api/Luc.define\" rel=\"Luc.define\" class=\"docClass\">Luc.define</a>({\n    $super: MyCoolClass,\n    addNums: function(a, b, c) {\n        return this.callSuper([a, b]) + c;\n    }\n});\n</code></pre>\n\n<p>produces the same code as :</p>\n\n<pre><code>var MC = <a href=\"#!/api/Luc.define\" rel=\"Luc.define\" class=\"docClass\">Luc.define</a>({\n    $super: MyCoolClass,\n    addNums: function(a, b, c) {\n        return MC.$superclass.addNums.apply(this, [a, b]) + c;\n    }\n});\n\nfunction Counter() {\n    this.count = 0;\n };\n\n Counter.prototype = {\n    getCount: function() {\n        return this.count;\n    },\n    increaseCount: function() {\n        this.count++;\n    }\n }\n\nvar C = <a href=\"#!/api/Luc.define\" rel=\"Luc.define\" class=\"docClass\">Luc.define</a>({\n    $super:Counter,\n    increaseCount: function () {\n        this.count += 2;\n        this.callSuper();\n    }\n});\n</code></pre>\n\n<p>is the same as</p>\n\n<pre><code>var C = <a href=\"#!/api/Luc.define\" rel=\"Luc.define\" class=\"docClass\">Luc.define</a>({\n    $super:Counter,\n    increaseCount: function () {\n        this.count += 2;\n        C.$superclass.increaseCount.call(this);\n    }\n});\n</code></pre>\n\n<p>Caveats <br></p>\n\n<p>callSuper can not be used as an instance method or inside of method\nthat is overwritten for a particular instance.</p>\n\n<pre><code>var c = new C();\n//this will throw an error with the message of method not found.\nc.callSuper()\n</code></pre>\n\n<p>What callSuper makes up for in terseness it loses it in\nefficiency.</p>\n\n<pre><code>this.count += 2;\nC.$superclass.increaseCount\n</code></pre>\n\n<p>is much faster and more efficient that :</p>\n\n<pre><code>this.count += 2;\nthis.callSuper();\n</code></pre>\n</div></li></ul></div></div></div><div id='method-define' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Luc.define'>Luc.define</span><br/><a href='source/definer.html#Luc-define-method-define' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Luc.define-method-define' class='name expandable'>define</a>( <span class='pre'>config, [afterDefine]</span> ) : <a href=\"#!/api/Function\" rel=\"Function\" class=\"docClass\">Function</a><span class=\"signature\"></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>config</span> : <a href=\"#!/api/Object\" rel=\"Object\" class=\"docClass\">Object</a><div class='sub-desc'><p>config object used when creating the class.  Any property that\nis not apart of the special configs will be applied to the prototype.  Check out\n<a href=\"#!/api/Luc.define\" rel=\"Luc.define\" class=\"docClass\">Luc.define</a> for all the config options.   No configs are needed to define a class.</p>\n</div></li><li><span class='pre'>afterDefine</span> : <a href=\"#!/api/Function\" rel=\"Function\" class=\"docClass\">Function</a> (optional)<div class='sub-desc'><p>function to run after the Constructor has been created.\nThe first an only argument is the newly created Constructor.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Function\" rel=\"Function\" class=\"docClass\">Function</a></span><div class='sub-desc'><p>the defined class</p>\n\n<pre><code>var C = <a href=\"#!/api/Luc.define\" rel=\"Luc.define\" class=\"docClass\">Luc.define</a>({\n    logA: function() {\n        console.log(this.a)\n    },\n    a: 1\n});\nvar c = new C();\nc.logA();\n&gt;1\n\nc.a = 4;\nc.logA();\n&gt;4\n</code></pre>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});