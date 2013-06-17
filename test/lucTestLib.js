 module.exports = process.env.COVERAGE 
   ? require('../lib-cov/luc')
   : require('../lib/luc-es5-shim');