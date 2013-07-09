Luc
====


[![browser support](https://ci.testling.com/pllee/luc.png)](https://ci.testling.com/pllee/luc)

[![Build Status](https://secure.travis-ci.org/pllee/luc.png)](http://travis-ci.org/pllee/luc)

What is Luc?
====
Luc is a lightweight JavaScript framework that is built from the ground up targeting all browsers and Node.js.  To node devs Luc should look like any purely node library.  To devs targeting the browser Luc should just look something written in CommonJS, just a single file and source map support thanks to [Browserify](https://github.com/substack/node-browserify).   Everything is written in es5 and to support older browsers Luc comes with an es5 shim version.  If we had to pick a single defining feature about Luc it would be its class system that doesn't box you in and can work with preexisting code not written in Luc.  We also have great utilities to help keep your and our source small.  Luc comes with over 40 utility Array/Object/Function methods along with over 150 Array utility methods that follow the same API and grammar.  Along with that it comes with the ability to add EventEmmiter and Plugin functionality to any class without using inheritance, even ones not defined with Luc's class system.  Luc is lightweight and unobtrusive it has zero dependencies and currently sits at 650 SLOC and less than 8Kb minified and gzipped.


Getting started
====
Check out our [docs](http://pllee.github.io/luc/pages/docs/), they show everything that Luc as to offer and they are loaded with examples.    [Luc.define](http://pllee.github.io/luc/pages/docs/#!/api/Luc.define) covers the class system while [Luc.Array](http://pllee.github.io/luc/pages/docs/#!/api/Luc.Array), [Luc.Object](http://pllee.github.io/luc/pages/docs/#!/api/Luc.Object), [Luc.Function](http://pllee.github.io/luc/pages/docs/#!/api/Luc.Function)  cover most of the utils.  Luc also comes packed with node's EventEmitter for browser code.

Node
====
npm install luc

Browser
====
Source maps come packaged with the non minified versions.


Where does Luc sit now?
====
Luc is now in its first official release.  It still sits at version 0.* and follows the http://semver.org/ versioning spec.  We want to get input on what you guys think about the API and functionality Luc provides.  Luc will officially release an unchanging API after taking account for everyone's input.  Once input has been gathered a 1.* version will be released.


The future
====
Right now Luc provides the the building blocks for small and large scale applications.  It does not have any dom or html building functionality.  We want to add this functionality as a submodule down the road if Luc takes off.   For the most part Luc's core API should be pretty set now.  Any functionality that we want to add down the road will be done through submodules.  

Issues/Discussion
=== 
Log [issues] (https://github.com/pllee/luc/issue) with the appropriate tag.  For discussions about the API or documentation use the discussion tag.  Please read the known caveats of [es5-shim](https://github.com/kriskowal/es5-shim/issues/114).  