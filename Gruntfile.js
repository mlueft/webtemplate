module.exports = function(grunt) {

  var cssFiles = {
            "<%= pkg.outputFolder %>css/layout.min.css":     ["<%= pkg.outputFolder %>css/layout.less"],
            "<%= pkg.outputFolder %>css/content.min.css":    ["<%= pkg.outputFolder %>css/content.less"],
            "<%= pkg.outputFolder %>css/navigation.min.css": ["<%= pkg.outputFolder %>css/navigation.less"],
            "<%= pkg.outputFolder %>css/print.min.css":      ["<%= pkg.outputFolder %>css/print.less"]
  };

  var jsFiles = {
            "<%= pkg.outputFolder %>js/page.min.js": ["<%= pkg.outputFolder %>js/page.js"]
  };
  
  var cleanFiles = [
            '<%= pkg.outputFolder %>**/*.less',
            '<%= pkg.outputFolder %>**/*.js',
            '<%= pkg.outputFolder %>**/*.xcf',
			'<%= pkg.outputFolder %>**/*.psd',
			'<%= pkg.outputFolder %>**/*.ai',
            '!<%= pkg.outputFolder %>**/*.min.js',
 ];

 var cssBanner = '/*!css <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'+
                 '/*!css <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n';
 
 var jsBanner = '/*!js <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'+
                '/*!js <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n';
 
 var lessVars = {
            color0: 'fff',
			color1: '000'
 };
 
 var mozjpeg = require('imagemin-mozjpeg');

 
  grunt.initConfig({
	
    pkg: grunt.file.readJSON('package.json'),

    copy:{
      default:{
        files:[
            { expand:true, cwd: '<%= pkg.inputFolder %>', src: ['**/*'], dest: '<%= pkg.outputFolder %>' }
        ]
      },
    },

    less:{
        options: {
          paths: ["assets/css"],
		  banner: cssBanner,
		  modifyVars: lessVars
        },
      dev: {
        options: {
          cleancss: false,
          compress: false
        },
        files: cssFiles
      },
      prod: {
          options: {
            cleancss: true,
            compress: true
          },
          files: cssFiles
        }        
    },

    csslint:{
        dev: {
            src: ['<%= pkg.outputFolder %>**/*.css']
        },
    },

    preprocess:{
        default:{
            options: {
                inline:true,
                context : {
                    DEBUG: true
                }
            },
            src : [
                '<%= pkg.outputFolder %>**/*.js'
            ]
        }
    },

    jslint:{
        dev:{
            src : [
                '<%= pkg.outputFolder %>js/*.js',
                '<%= pkg.outputFolder %>js/*.html'
            ]
        }
    },

    jasmine: {
      pivotal: {
        src: '<%= pkg.outputFolder %>js/*.js',
        options: {
          specs: 'test/*Spec.js',
          helpers: 'test/*Helper.js'
        }
      }
    },

    uglify: {
      options: {
        banner: jsBanner
      },
      default: {
        options: {
          mangle: true,
          compress: false,
          beautify: true,
		  use: [mozjpeg()]
        },
          files: jsFiles
      },
    },

    imagemin: {
      options: {
        optimizationlevel:7,
        interlaced:true,
        progressive:true,
        svgoPlugins: [{ removeViewBox: false }],
        use: [mozjpeg()]
      },
      default: {
        files: [{
          expand: true,
          cwd: '<%= pkg.inputFolder %>',
          src: ['**/*.{png,jpg,jpeg,gif}'],
          dest: '<%= pkg.outputFolder %>'
        }]
      }
    },
	
    clean: {
      default: {
        src : cleanFiles
      },
    }


	
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-preprocess');
  grunt.loadNpmTasks('grunt-jslint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-newer');

  // Default task(s).
  grunt.registerTask('dev', ['copy', 'less:dev', 'csslint:dev',
                             'preprocess', 'uglify', 'clean' ]);
  
  grunt.registerTask('prod', ['copy', 'less:prod',
                              'preprocess', 'uglify', 'imagemin:default',
							  'clean' ]);

};