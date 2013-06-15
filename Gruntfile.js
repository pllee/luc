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
          mangle: false,
          preserveComments: 'some',
          banner:  '/**\n' +
                   ' * @license https://github.com/pllee/luc/blob/master/LICENSE\n' +
                   ' */\n'
        }
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'list'
        },
        src: ['test/*.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('tests', ['mochaTest']);
  grunt.registerTask('default', ['exec', 'uglify', 'mochaTest']);

};
