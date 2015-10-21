var path = require('path'),
    async = require('async'),
    stylesheetsDir = 'assets/stylesheets',
    usersBundleTemplatePath = 'app/templates/users_bundle/**/*.hbs',
    reposBundleTemplatePath = 'app/templates/repos_bundle/**/*.hbs';

// ,
// requirejsBundleMapping = 'config/mapping.json';  

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Configuration to be run (and then tested).
        'multibundle-requirejs': {
            options: {
                '_config': {
                    // 4 is silent in r.js world
                    logLevel: process.env.quiet ? 4 : 1,
                    destination: 'public/js',
                    sharedBundles: ['common'],
                    // or custom function `hashFiles(output, componentOptions)`
                    hashFiles: true,
                    // will be called one extra time with no arguments after all the bundles processed
                    // also accepts writable streams in object mode, (e.g. `multibundle-requirejs-mapping-write`)
                    handleMapping: function(buildObject) {
                        // it will be invoked for each bundle with respective buildObject
                        if (buildObject) {
                            // assert(buildObject.name in options['multibundle-requirejs'].options);
                            // expectedBundles--;
                        }
                        // and without arguments after all bundles have been processed
                        else {
                            // assert.strictEqual(0, expectedBundles);
                        }
                    },
                    // pass options to r.js
                    baseUrl: '.',
                    optimize: 'uglify',
                    // optimize: 'none',
                    sharedPaths: {
                        // test location namespacing
                        'app': 'app',
                        'assets': 'assets',
                        // needed for rendr modules
                        'rendr': 'node_modules/rendr'
                    },
                    preserveLicenseComments: false
                },

                // // optional modules
                // 'optional': [{
                //         'omniture': 'assets/vendor/s_code.js'
                //     },

                //     'app/lib/tracking/pixel.js',
                //     'app/lib/tracking/omniture.js'
                // ],

                // Creates `<destination>/common.<hash>.js` file that includes all the modules specified in the bundle,
                // shared modules between all the pages.
                'common': [
                    // node modules
                    {
                        'requirejs': 'node_modules/requirejs/require.js'
                    },

                    // multiple entry points module
                    {
                        'rendr/shared': 'node_modules/rendr/shared/app.js'
                    }, {
                        'rendr/client': 'node_modules/rendr/client/router.js'
                    },

                    // modules needed to be shimmed
                    {
                        'async': {
                            src: 'node_modules/async/lib/async.js',
                            exports: 'async'
                        }
                    },
                    // module with implicit dependencies
                    {
                        'backbone': {
                            src: 'node_modules/backbone/backbone.js',
                            deps: ['jquery', 'underscore'],
                            exports: 'Backbone'
                        }
                    }, {
                        'handlebars': {
                            src: 'node_modules/handlebars/dist/handlebars.runtime.js',
                            exports: 'Handlebars'
                        }
                    }, {
                        'underscore': {
                            src: 'node_modules/underscore/underscore.js',
                            exports: '_'
                        }
                    },

                    {
                        'rendr-handlebars': {
                            src: 'node_modules/rendr-handlebars/index.js',
                            exports: 'rendr-handlebars'
                        }
                    },

                    // checked in assets

                    // assets needed to be shimmed
                    {
                        'jquery': {
                            src: './assets/vendor/jquery-1.9.1.min.js',
                            exports: 'jQuery'
                        }
                    },

                    // execute plugin to add methods to jQuery

                    // config/trigger
                    {
                        'main': 'assets/js/requireJsMain'
                    },

                    // base app files
                    'app/*.js',
                    // 'public/js/app/templates/compiledTemplates.js',
                    'app/templates/*.js',
                    // '!app/templates/compiledTemplates.js',

                    // lib
                    'app/lib/**/*.js',

                    'app/views/home/**/*.js',
                    'app/controllers/home_controller.js',

                    // main script
                    // {
                    //     'main': 'assets/js/app.js'
                    // },

                    // app helper files
                    // 'app/helper*.js',

                    // lib
                ],
                // Creates separate bundle for user page components – `<destination>/user.<hash>.js`
                user: [
                    'app/models/users_bundle/**/*.js',
                    'app/collections/users_bundle/**/*.js',
                    'app/views/users_bundle/**/*.js',
                    'app/controllers/users_bundle/**/*.js',
                    'public/js/app/templates/users_bundle/compiledTemplates.js'
                ],

                // Creates separate bundle for user page components – `<destination>/maps.<hash>.js`
                repos: [
                    'app/models/repos_bundle/**/*.js',
                    'app/collections/repos_bundle/**/*.js',
                    'app/views/repos_bundle/**/*.js',
                    'app/controllers/repos_bundle/**/*.js',
                    'public/js/app/templates/repos_bundle/compiledTemplates.js'
                ]
            }
        },

        stylus: {
            compile: {
                options: {
                    paths: [stylesheetsDir],
                    'include css': true
                },
                files: {
                    'public/styles.css': stylesheetsDir + '/index.styl'
                }
            }
        },

        handlebars: {
            compile_server: {
                options: {
                    namespace: false,
                    commonjs: true,
                    processName: function(filename) {
                        return filename.replace('app/templates/', '').replace('.hbs', '');
                    }
                },
                src: "app/templates/**/*.hbs",
                dest: "app/templates/compiledTemplates.js",
                filter: function(filepath) {
                    var filename = path.basename(filepath);
                    console.log('filename: ' + filename);
                    // Exclude files that begin with '__' from being sent to the client,
                    // i.e. __layout.hbs.
                    return filename.slice(0, 2) !== '__';
                }
            },
            compile_client: {
                options: {
                    amd: true,
                    processName: function(filename) {
                        return filename.replace('app/templates/', '').replace('.hbs', '');
                    }
                },
                files: {
                      // 'app/templates/compiledTemplatesClient.js': 
                      'public/js/app/templates/compiledTemplates.js': 
                        ['app/templates/**/*.hbs', 
                            '!' + usersBundleTemplatePath,
                            '!' + reposBundleTemplatePath,
                            '!app/templates/__layout.hbs'],
                      'public/js/app/templates/users_bundle/compiledTemplates.js': usersBundleTemplatePath,
                      'public/js/app/templates/repos_bundle/compiledTemplates.js': reposBundleTemplatePath
                }
            }
        },

        watch: {
            scripts: {
                files: 'app/**/*.js',
                tasks: [/*'rendr_requirejs:build_app', */'handlebars:compile_client'],
                options: {
                    interrupt: true
                }
            },
            templates: {
                files: 'app/**/*.hbs',
                tasks: ['handlebars'],
                options: {
                    interrupt: true
                }
            },
            stylesheets: {
                files: [stylesheetsDir + '/**/*.styl', stylesheetsDir + '/**/*.css'],
                tasks: ['stylus'],
                options: {
                    interrupt: true
                }
            }
        }
    });


    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-multibundle-requirejs');
    // grunt.loadNpmTasks('grunt-rendr-requirejs');


    // grunt.registerTask('build_world',
    // [ 'multibundle_requirejs',
    // ]);

    grunt.registerTask('runNode', function() {
        grunt.util.spawn({
            cmd: 'node',
            args: ['./node_modules/nodemon/nodemon.js', 'index.js'],
            opts: {
                stdio: 'inherit'
            }
        }, function() {
            grunt.fail.fatal(new Error("nodemon quit"));
        });
    });

    // grunt.registerTask('build', ['multibundle_requirejs']);

    grunt.registerTask('compile', ['handlebars', 'stylus']);

    // Run the server and watch for file changes
    grunt.registerTask('server', [ /*'build_world', */ 'compile', 'runNode', 'watch']);

    // Default task(s).
    grunt.registerTask('default', ['compile']);

    // wrapper for grunt.util.spawn
    // to trim down boilerplate
    // while using with async

    function spawn(cmd, args) {
        return function(callback) {
            grunt.util.spawn({
                cmd: cmd,
                args: args
            }, function(err, res, code) {
                callback(err || code, res);
            });
        };
    }
};
