Ext.data.JsonP.Luc_Base({"tagname":"class","name":"Luc.Base","autodetected":{},"files":[{"filename":"base.js","href":"base.html#Luc-Base"}],"members":[{"name":"beforeInit","tagname":"method","owner":"Luc.Base","id":"method-beforeInit","meta":{}},{"name":"init","tagname":"method","owner":"Luc.Base","id":"method-init","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-Luc.Base","short_doc":"Simple class that by default applies the\nfirst argument to the instance and then calls\nLuc.Base.init. ...","component":false,"superclasses":[],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/base.html#Luc-Base' target='_blank'>base.js</a></div></pre><div class='doc-contents'><p>Simple class that by default <a href=\"#!/api/Luc-method-apply\" rel=\"Luc-method-apply\" class=\"docClass\">applies</a> the\nfirst argument to the instance and then calls\n<a href=\"#!/api/Luc.Base-method-init\" rel=\"Luc.Base-method-init\" class=\"docClass\">Luc.Base.init</a>.</p>\n\n<pre><code>var b = new <a href=\"#!/api/Luc.Base\" rel=\"Luc.Base\" class=\"docClass\">Luc.Base</a>({\n    a: 1,\n    init: function() {\n        console.log('hey')\n    }\n})\nb.a\n&gt;hey\n&gt;1\n</code></pre>\n\n<p>We found that most of our classes do this so we made\nit the default.  Having a config object as the first and only\nparam keeps a clean api as well.</p>\n\n<pre><code>var C = <a href=\"#!/api/Luc.define\" rel=\"Luc.define\" class=\"docClass\">Luc.define</a>({\n    init: function() {\n        <a href=\"#!/api/Luc.Array-method-each\" rel=\"Luc.Array-method-each\" class=\"docClass\">Luc.Array.each</a>(this.items, this.logItems)\n    },\n\n    logItems: function(item) {\n        console.log(item);\n    }\n});\n\nvar c = new C({items: [1,2,3]});\n&gt;1\n&gt;2\n&gt;3\nvar d = new C({items: 'A'});\n&gt;'A'\nvar e = new C();\n</code></pre>\n\n<p>If you don't like the applying of the config to the instance it\ncan always be \"disabled\"</p>\n\n<pre><code>var NoApply = <a href=\"#!/api/Luc.define\" rel=\"Luc.define\" class=\"docClass\">Luc.define</a>({\n    beforeInit: function() {\n\n    },\n    init: function() {\n        <a href=\"#!/api/Luc.Array-method-each\" rel=\"Luc.Array-method-each\" class=\"docClass\">Luc.Array.each</a>(this.items, this.logItems)\n    },\n\n    logItems: function(item) {\n        console.log(item);\n    }\n});\n\nvar c = new NoApply({items: [1,2,3]});\n</code></pre>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-beforeInit' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Luc.Base'>Luc.Base</span><br/><a href='source/base.html#Luc-Base-method-beforeInit' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Luc.Base-method-beforeInit' class='name expandable'>beforeInit</a>( <span class='pre'>config</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>By default apply the config to the\ninstance. ...</div><div class='long'><p>By default apply the config to the\ninstance.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>config</span> : <a href=\"#!/api/Object\" rel=\"Object\" class=\"docClass\">Object</a><div class='sub-desc'></div></li></ul></div></div></div><div id='method-init' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Luc.Base'>Luc.Base</span><br/><a href='source/base.html#Luc-Base-method-init' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Luc.Base-method-init' class='name expandable'>init</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Simple hook to initialize\nthe class. ...</div><div class='long'><p>Simple hook to initialize\nthe class.  Defaults to <a href=\"#!/api/Luc-method-emptyFn\" rel=\"Luc-method-emptyFn\" class=\"docClass\">Luc.emptyFn</a></p>\n</div></div></div></div></div></div></div>","meta":{}});