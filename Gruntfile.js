module.exports = function(grunt) {

      require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

      grunt.initConfig({
            pkg: grunt.file.readJSON('package.json'),

            karma: {
                  options: {
                        configFile: 'karma.conf.js'
                  },
                  unit: {
                        singleRun: true
                  },
                  continuous: {
                        // keep karma running in the background
                        background: true
                  }
            },
            watch: {
                  karma: {
                    // run these tasks when these files change
                    files: ['./src/client_2/**/*.js', './src/client_2/test/*.spec.js'],
                    tasks: ['karma:continuous:run'] // note the :run flag
                  }
            }
      });

      grunt.loadNpmTasks('grunt-karma');
      grunt.loadNpmTasks('grunt-contrib-watch');
      grunt.registerTask('default', ['karma:continuous:start', 'watch:karma']);

}
