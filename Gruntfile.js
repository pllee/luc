var tasks = require('./gruntTasks'),
    browsers = tasks.browsers,
    port = 8888;

module.exports = function(grunt) {

  grunt.registerTask('coverage', 'build coverage', function(){
    var done = this.async();
    tasks.buildCoverage(done);
  });

  grunt.registerTask('docs', 'build docs', function(){
    var done = this.async();
    tasks.buildDocs(done);
  });

  grunt.registerTask('publish', 'publish version', tasks.publishVersion);

  grunt.initConfig({ 
    exec: {
      buildSrc: {
        cmd: 'node_modules/.bin/browserify --debug lib/luc.js > build/luc.js'
      },
      buildShim: {
        cmd: 'node_modules/.bin/browserify --debug node_modules/es5-shim-sham/index.js lib/luc.js > build/luc-es5-shim.js'
      },
      buildTest: {
        cmd: 'node_modules/.bin/browserify --debug --im node_modules/es5-shim-sham/index.js  test/lib/luc.js > pages/testRunner/build/tests.js'
      },
      runTest: {
        cmd: 'node_modules/.bin/mocha -R list'
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
    connect: {
      server: {
        options: {
          base: "",
          port: port
        }
      }
    },
    'saucelabs-mocha': {
            all: {
                options: {
                    urls: ['http://localhost:' + port + '/pages/testRunner/'],
                    tunnelTimeout: 5,
                    build: process.env.TRAVIS_JOB_ID,
                    concurrency: 3,
                    browsers: browsers,
                    testname: 'luc tests ' + new Date(),
                    tags: ['master']
                }
            }
        }
  });

  
  
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-saucelabs');
  grunt.loadNpmTasks('grunt-devtools');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['exec', 'uglify']);
  grunt.registerTask('test', ['default', 'connect', 'saucelabs-mocha']);

};
