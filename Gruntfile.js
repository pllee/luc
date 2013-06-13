module.exports = function(grunt) {
  grunt.initConfig({ 
    exec: {
      buildSrc: {
        cmd: 'node_modules/.bin/browserify --debug lib/luc.js > build/luc.js'
      },
      buildShim: {
        cmd: 'node_modules/.bin/browserify --debug lib/luc-es5-shim.js > build/luc-es5-shim.js'
      },
      buildTest: {
        cmd: 'node_modules/.bin/browserify --debug test/lib/luc.js > testRunner/build/tests.js'
      }
    },
    uglify: {
      compress: {
        files: {
          'build/luc.min.js': ['build/luc.js'],
          'build/luc-es5-shim.min.js': ['build/luc-es5-shim.js']
        },
        options: {
          mangle: false
        }
      }
    },
    mochaTest: {
      files: ['test/*.js']
    },
    mochaTestConfig: {
      options: {
        reporter: 'list'
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('tests', ['mochaTest']);
  grunt.registerTask('default', ['exec', 'uglify', 'mochaTest']);

};
