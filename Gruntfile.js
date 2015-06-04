module.exports = function(grunt) {
    // 项目配置
    grunt.initConfig({
        watch: {
            scripts: {
                files: 'src/**/*.less',
                tasks: ['less', 'cssmin'],
                options: {
                    interrupt: true,
                },
            },
        },
        less: {
            production: {
                options: {
                    modifyVars: {
                        imgPath: '"http://mycdn.com/path/to/images"',
                        bgColor: 'red'
                    }
                },
                files: {
                    "dist/lmh.bui.css": "src/*.less"
                }
            }
        },

        uglify: {
          my_target: {
            files: {
              'dist/lmh.bui.min.js': ['js/*.js']
            }
          }
        },

        cssmin: {
          options: {
            shorthandCompacting: false,
            roundingPrecision: -1
          },
          target: {
            files: {
              'dist/lmh.bui.min.css': ['dist/lmh.bui.css']
            }
          }
        }



    });

    grunt.loadTasks('./node_modules/grunt-contrib-watch/tasks');
    grunt.loadTasks('./node_modules/grunt-contrib-cssmin/tasks');
    grunt.loadTasks('./node_modules/grunt-contrib-less/tasks');
    grunt.loadTasks('./node_modules/grunt-contrib-uglify/tasks');
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('js', ['uglify']);
};