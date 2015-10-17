var path = require('path'),
    async = require('async'),
    stylesheetsDir = 'assets/stylesheets';

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
                    'app/templates/*.js',

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
                    'app/models/user.js',
                    'app/collections/users.js',
                    'app/views/users/**/*.js',
                    'app/controllers/users_controller.js',
                ],

                // Creates separate bundle for user page components – `<destination>/maps.<hash>.js`
                repos: [
                    'app/models/repo.js',
                    'app/collections/repos.js',
                    'app/views/repos/**/*.js',
                    'app/controllers/repos_controller.js',
                ]
            }
        },


        // 'multibundle-requirejs': {
        //   options: {
        //     _config: {
        //       // task "global" options

        //       // logLevel: process.env.quiet ? 4 : 1,
        //       logLevel: 1,
        //       destination: 'public/js',
        //       sharedBundle: 'common',
        //       hashFiles: true, // TODO: custom function?
        //       // mappingFile: requirejsBundleMapping,
        //       removePreviouslyBuiltBundles: true,
        //       handleMapping: function(component, filename, includedModules)
        //       {
        //         console.log('handleMapping', component, filename, includedModules);
        //       },

        //       // pass options to r.js
        //       baseUrl: '.',
        //       // optimize: 'none',
        //       optimize: 'uglify',
        //       paths:
        //       {
        //         'rendr': 'node_modules/rendr'
        //       },
        //       preserveLicenseComments: false        
        //     },
        //     common: [
        //         // node modules
        //         {'requirejs'               : 'node_modules/requirejs/require.js'},

        //         // multiple entry points module
        //         {'rendr/shared'            : 'node_modules/rendr/shared/app.js'},
        //         {'rendr/client'            : 'node_modules/rendr/client/router.js'},

        //         // modules needed to be shimmed
        //         {'async'                   : {src: 'node_modules/async/lib/async.js', exports: 'async'}},
        //         // module with implicit dependencies
        //         {'backbone'                 : {src: 'node_modules/backbone/backbone.js', deps: ['jquery', 'underscore'], exports: 'Backbone'}},
        //         {'handlebars'               : {src: 'node_modules/handlebars/dist/handlebars.runtime.js', exports: 'Handlebars'}},
        //         {'underscore'               : {src: 'node_modules/underscore/underscore.js', exports: '_'}},

        //         // checked in assets

        //         // assets needed to be shimmed
        //         {'jquery'                  : {src: './assets/vendor/jquery-1.9.1.min.js', exports: 'jQuery'}},

        //         // execute plugin to add methods to jQuery

        //         // config/trigger
        //         // {'main'                    : 'assets/js/public/main'},
        //         {'main'                    : 'assets/js/app'},

        //         // base app files
        //         'app/*.js',

        //         // lib
        //         'app/lib/**/*.js',

        //         'app/views/home/**/*.js',

        //     ],

        //     // Creates separate bundle for user page components – `<destination>/user.<hash>.js`
        //     user: [
        //       'app/models/user.js',
        //       'app/collections/users.js',
        //       'app/views/users/**/*.js',
        //       'app/controllers/users_controller.js',
        //     ],

        //     // Creates separate bundle for user page components – `<destination>/maps.<hash>.js`
        //     repos: [
        //       'app/models/repo.js',
        //       'app/collections/repos.js',
        //       'app/views/repos/**/*.js',
        //       'app/controllers/repos_controller.js',
        //     ]
        //   }


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
                src: "app/templates/**/*.hbs",
                dest: "public/js/app/templates/compiledTemplates.js",
                filter: function(filepath) {
                    var filename = path.basename(filepath);
                    // Exclude files that begin with '__' from being sent to the client,
                    // i.e. __layout.hbs.
                    return filename.slice(0, 2) !== '__';
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
        },
        /*
    rendr_requirejs: {
      build_common: {
        options: {
          optimize: 'none',
          out: 'public/js/common.js',
          baseUrl: 'public/js',
          create: true,
          name: 'common',
          paths: {
            jquery: '../../assets/vendor/jquery-1.9.1.min',
          },
          shim: {
            async: {
              exports: 'async'
            },
            jquery: {
              exports: 'jQuery'
            },
            underscore: {
              exports: '_'
            },
            backbone: {
              deps: [
                'jquery',
                'underscore'
              ],
              exports: 'Backbone'
            },
            handlebars: {
              exports: 'Handlebars'
            }
          },
          include: [
            'requirejs',
            'jquery',
            'underscore',
            'backbone',
            'async',
            'handlebars'
          ],
          node_modules: [
            // underscore, backbone and async may be located under rendr module or as peers to rendr.
            // grunt-rendr-requirejs will automatically check rendr dependencies and parent folders
            {name: 'requirejs', location: 'requirejs', main: 'require.js'},
            {name: 'underscore', location: 'underscore', main: 'underscore.js'},
            {name: 'backbone', location: 'backbone', main: 'backbone.js'},
            {name: 'handlebars', location: 'handlebars/dist', main: 'handlebars.runtime.js'},
            {name: 'async', location: 'async/lib', main: 'async.js'}
          ]
        }
      },
      build_rendr:
      {
        options:
        {
          optimize: 'none',
          dir: 'public/js',
          baseUrl: 'assets/js',
          cjsTranslate: true,
          keepBuildDir: true,
          paths:
          {
            'jquery': 'empty:',
            'underscore': 'empty:',
            'backbone': 'empty:',
            'async': 'empty:',
            'app/router': 'empty:',

            'rendr/client': '../../node_modules/rendr/client',
            'rendr/shared': '../../node_modules/rendr/shared',
          },
          modules:
          [
            {name: 'rendr/client/app_view', exclude: ['underscore', 'backbone', 'async', 'jquery', 'rendr/shared/base/view']},
            {name: 'rendr/client/router', exclude: ['underscore', 'backbone', 'jquery', 'rendr/shared/base/router', 'rendr/shared/base/view', 'rendr/client/app_view']},

            { name: 'rendr/shared/app', exclude: ['backbone', 'jquery', 'rendr/shared/fetcher', 'app/router', 'rendr/client/app_view', 'rendr/shared/syncer', 'rendr/shared/base/model', 'rendr/shared/base/collection', 'rendr/shared/modelUtils', 'rendr/shared/base/view'] },
            { name: 'rendr/shared/fetcher', exclude: ['underscore', 'jquery', 'backbone', 'async', 'rendr/shared/modelUtils', 'rendr/shared/store/model_store', 'rendr/shared/store/collection_store'] },
            { name: 'rendr/shared/modelUtils', exclude: ['rendr/shared/base/model', 'rendr/shared/base/collection'] },
            { name: 'rendr/shared/syncer', exclude: ['underscore', 'backbone', 'jquery'] },
            { name: 'rendr/shared/base/collection', exclude: ['underscore', 'backbone', 'jquery', 'rendr/shared/syncer', 'rendr/shared/base/model'] },
            { name: 'rendr/shared/base/model', exclude: ['underscore', 'backbone', 'jquery', 'rendr/shared/syncer'] },
            { name: 'rendr/shared/base/router', exclude: ['underscore', 'backbone', 'jquery'] },
            { name: 'rendr/shared/base/view', exclude: ['underscore', 'backbone', 'jquery', 'async', 'rendr/shared/modelUtils', 'rendr/shared/base/model', 'rendr/shared/base/collection', 'rendr/shared/syncer'] },
            { name: 'rendr/shared/store/collection_store', exclude: ['underscore', 'rendr/shared/store/memory_store', 'rendr/shared/modelUtils', 'rendr/shared/base/collection', 'rendr/shared/base/model', 'rendr/shared/syncer', 'backbone'] },
            { name: 'rendr/shared/store/memory_store' },
            { name: 'rendr/shared/store/model_store', exclude: ['underscore', 'rendr/shared/store/memory_store', 'rendr/shared/modelUtils', 'rendr/shared/base/collection', 'rendr/shared/base/model', 'rendr/shared/syncer', 'backbone'] }
          ]
        }
      },

      build_rendr_handlebars: {
        options: {
          optimize: 'none',
          out: 'public/js/rendr-handlebars.js',
          baseUrl: 'public/js',
          cjsTranslate: true,
          create: true,
          name: 'rendr-handlebars',
          include: [
            'rendr-handlebars'
          ],
          paths:
          {
            'jquery': 'empty:',
            'underscore': 'empty:',
            'backbone': 'empty:',
            'handlebars': 'empty:',
            'async': 'empty:'
          },
          node_modules: [
            {name: 'rendr-handlebars', location: 'rendr-handlebars', main: 'index.js'},
          ]
        }
      },

      build_app:
      {
        options:
        {
          optimize: 'none',
          dir: 'public/js/app',
          baseUrl: 'app',
          cjsTranslate: true,
        }
      }

    }
*/

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
