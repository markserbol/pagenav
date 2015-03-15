module.exports = function (grunt) {
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    jshint: {
      build: {
        options: {
          curly: true,
          eqeqeq: true,
          eqnull: true,
          undef: true,
          unused: true,
          browser: true,
          globals: {
            $: false,
            jQuery: false
          },
        },
        src: ['src/**/*.js']
      } 
    },
    
    uglify: {
      build: {
        files: [{
          cwd: 'src',
          src: '**/*.js',
          dest: 'dist',
          ext: '.min.js',
          expand: true
        }]
      }
    },
    
    copy: {
      build: {
        expand: true,
        cwd: 'src',
        src: '**.js',
        dest: 'dist',
      },
    },
    
    watch: {
      js: {
        files: ['src/**/*.js'],
        tasks: ['jshint', 'uglify']
      }
    },
    
  });
  
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['jshint', 'uglify', 'copy', 'watch']);
};