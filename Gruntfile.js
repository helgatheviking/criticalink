'use strict';
module.exports = function(grunt) {

	// load all tasks
	require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			scripts: {
				files: ['js/app/*.js'],
				tasks: ['concat', 'uglify:app'],
				options: {
				  spawn: false,
				},
			},
			sass: {
				files: ['scss/**/*.scss'],
				tasks: ['sass'],
				options: {
				  spawn: false,
				  livereload: true,
				},
			},
		},
		sass: {
			default: {
				options : {
					style : 'expanded'
				},
				files: {
					'style.css':'scss/style.scss'
				}
			}
		},
		postcss: {
			options: {
			map: true,
			processors: [
				require('autoprefixer-core')({browsers: 'last 2 versions'}),
			]
			},
			files: {
				'css/style.css':'css/style.css'
			}
		},
		cssmin: {
			options: {
				aggressiveMerging : false
			},
			target: {
				files: {
					'style.min.css': 'style.css'
				}
			}
		},
		concat: {
			release: {
				src: [
					'js/app/**.js'
				],
				dest: 'js/development.js',
			}
		},
		uglify: {
			options: {
				mangle: {
					except: ['jQuery', 'sidr', 'fastClick', 'fitVids']
				},
				drop_console: true
			},
			vendors: {
				files: {
					'js/vendors/jquery.fastclick.min.js' : 'js/vendors/fastclick.js',
					'js/vendors/jquery.fitvids.min.js' : 'js/vendors/jquery.fitvids.js',
					'js/vendors/jquery.sidr.min.js' : 'js/vendors/sidr.js',
				}
			},
			app: {
				files: {
					'js/production.min.js' : 'js/development.js',
				}
			},
		},
		// https://www.npmjs.org/package/grunt-wp-i18n
		makepot: {
			target: {
				options: {
					domainPath: 'languages/',
					potFilename: 'criticalink.pot',
					potHeaders: {
					poedit: true, // Includes common Poedit headers.
					'x-poedit-keywordslist': true // Include a list of all possible gettext functions.
				},
				type: 'wp-theme',
				updateTimestamp: false,
				processPot: function( pot, options ) {
					pot.headers['report-msgid-bugs-to'] = 'https://kathyisawesome.com/contact';
					pot.headers['language'] = 'en_US';
					return pot;
					}
				}
			}
		},
		replace: {
			styleVersion: {
				src: [
					'scss/style.scss',
					'style.css'
				],
				overwrite: true,
				replacements: [{
					from: /Version:.*$/m,
					to: 'Version: <%= pkg.version %>'
				}]
			},
			functionsVersion: {
				src: [
					'functions.php'
				],
				overwrite: true,
				replacements: [ {
					from: /^define\( 'LUMINATE_VERSION'.*$/m,
					to: 'define( \'LUMINATE_VERSION\', \'<%= pkg.version %>\' );'
				} ]
			},
		},
		cssjanus: {
			theme: {
				options: {
					swapLtrRtlInUrl: false
				},
				files: [
					{
						src: 'style.css',
						dest: 'style-rtl.css'
					},
					{
						src: 'style.min.css',
						dest: 'style-rtl.min.css'
					},
				]
			}
		},
		'ftpush': {
			build: {
				auth: {
					host: 'ftp.criticalink.org',
					port: 21,
					authKey: 'key1'
				},
				src: '',
				dest: '/sandbox/wp-content/themes/criticalink',
				exclusions: ['.ftppass', 'sftp-config.json', 'node_modules', 'bower_components'],
				simple: true
			}
		}
	});

	grunt.registerTask( 'default', [
		'sass',
		'postcss',
		'cssmin'
	]);

	grunt.registerTask( 'ftp', [
		'ftpush'
	]);


	grunt.registerTask( 'release', [
		'replace',
		'sass',
		'postcss',
		'cssmin',
		'concat:release',
		'uglify:app',
		'makepot',
		'cssjanus'
	]);

};
