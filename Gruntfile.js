var tasks = require('./gruntTasks');

module.exports = function(grunt) {

  grunt.registerTask('coverage', 'build coverage', function(){
    var done = this.async();
    tasks.buildCoverage(done);
  });

  grunt.registerTask('docs', 'build docs', function(){
    var done = this.async();
    tasks.buildDocs(done);
  });

  grunt.initConfig({ 
    exec: {
      buildSrc: {
        cmd: 'node_modules/.bin/browserify --debug lib/luc.js > build/luc.js'
      },
      buildShim: {
        cmd: 'node_modules/.bin/browserify --debug lib/luc-es5-shim.js > build/luc-es5-shim.js'
      },
      buildTest: {
        cmd: 'node_modules/.bin/browserify --debug --im test/lib/luc.js > pages/testRunner/build/tests.js'
      },
      runTest: {
        cmd: 'mocha -R list'
      }
    },
    uglify: {
      compress: {
        files: {
          'build/luc.min.js': ['build/luc.js'],
          'build/luc-es5-shim.min.js': ['build/luc-es5-shim.js']
        },
        options: {
          mangle: false,
          preserveComments: 'some',
          banner:  '/**\n' +
                   ' * @license https://github.com/pllee/luc/blob/master/LICENSE\n' +
                   ' */\n'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['exec', 'uglify']);

};
