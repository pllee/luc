 module.exports = process.env.LUC_COVERAGE 
   ? require('../lib-cov/luc')
   : require('../lib/luc-es5-shim');