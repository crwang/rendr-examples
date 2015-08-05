var fs = require('fs'),
  path = require('path'),
  async = require('async'),

  // < For RequireJS Multi-bundle (will be moved to a plugin later)
  glob      = require('glob'), // be sure to remove from node_modules
  requirejs = require('requirejs'), // be sure to remove from node_modules
  crypto = require('crypto'), // be sure to remove from node_modules
  _ = require('underscore'),
  // >

  stylesheetsDir = 'assets/stylesheets',
  requirejsBundleMapping = 'config/mapping.json';

var config = require('config');

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

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
        tasks: [/*'rendr_requirejs:build_app',*/ 'handlebars:compile_client'],
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
    },
*/

    multibundle_requirejs: {
      options:
      {
        // general config
        '_config':
        {
          // 4 is silent in r.js world
          logLevel: process.env.quiet ? 4 : 1,
          destination: 'public/js',
          sharedBundle: 'common',
          hashFiles: true, // TODO: custom function?
          mappingFile: requirejsBundleMapping,
          removePreviouslyBuiltBundles: true,
          handleMapping: function(component, filename, includedModules)
          {
            console.log('handleMapping', component, filename, includedModules);
          },
          // pass options to r.js
          baseUrl: '.',
          optimize: 'none',
          // optimize: 'uglify',
          paths:
          {
            'rendr': 'node_modules/rendr'
          },
          preserveLicenseComments: false
        },

        // Creates `<destination>/common.<hash>.js` file that includes all the modules specified in the bundle,
        // shared modules between all the pages.
        // And minifies them along the way. `<hash>` is md5 hash for generated file.
        // Plus it updates `config/<configFile>.json`
        // with generated filename, modifying `appData.static.js.common` node.
        'common':
        [
          // node modules
          {'requirejs'               : 'node_modules/requirejs/require.js'},

          // multiple entry points module
          {'rendr/shared'            : 'node_modules/rendr/shared/app.js'},
          {'rendr/client'            : 'node_modules/rendr/client/router.js'},

          // modules needed to be shimmed
          {'async'                   : {src: 'node_modules/async/lib/async.js', exports: 'async'}},
          // module with implicit dependencies
          {'backbone'                 : {src: 'node_modules/backbone/backbone.js', deps: ['jquery', 'underscore'], exports: 'Backbone'}},
          {'handlebars'               : {src: 'node_modules/handlebars/dist/handlebars.runtime.js', exports: 'Handlebars'}},
          {'underscore'               : {src: 'node_modules/underscore/underscore.js', exports: '_'}},

          // checked in assets

          // assets needed to be shimmed
          {'jquery'                  : {src: 'assets/vendor/jquery-1.9.1.min', exports: 'jQuery'}},

          // execute plugin to add methods to jQuery

          // config/trigger
          {'main'                    : 'assets/js/public/main'},

          // base app files
          'app/*.js',

          // lib
          'app/lib/**/*.js',

          'app/views/home/**/*.js',

        ],

        // Creates separate bundle for user page components – `<destination>/user.<hash>.js`
        'user':
        [
          'app/models/user.js',
          'app/collections/users.js',
          'app/views/users/**/*.js',
          'app/controllers/users_controller.js',
        ],

        // Creates separate bundle for user page components – `<destination>/maps.<hash>.js`
        'repos':
        [
          'app/models/repo.js',
          'app/collections/repos.js',
          'app/views/repos/**/*.js',
          'app/controllers/repos_controller.js',
        ]
      }      
    }
  });

  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-rendr-requirejs');


  // grunt.registerTask('build_world',
  // [ 'rendr_requirejs:build_common',
  //   'rendr_requirejs:build_rendr',
  //   'rendr_requirejs:build_rendr_handlebars',
  //   'rendr_requirejs:build_app'
  // ]);

  grunt.registerTask('runNode', function () {
    grunt.util.spawn({
      cmd: 'node',
      args: ['./node_modules/nodemon/nodemon.js', 'index.js'],
      opts: {
        stdio: 'inherit'
      }
    }, function () {
      grunt.fail.fatal(new Error("nodemon quit"));
    });
  });

  grunt.registerTask('compile', ['handlebars', 'stylus']);

  // Run the server and watch for file changes
  grunt.registerTask('server', [/*'build_world', */'compile', 'runNode', 'watch']);

  // Default task(s).
  grunt.registerTask('default', ['compile']);

  grunt.registerTask('multibundle_requirejs', 'Build a multi-bundle RequireJS project.', function()
  {
    var buildConfig,
      includedInShared,
      modulesOfShared,
      // grunt async callback
      done = this.async(),
      // grunt task options
      options = this.options(),
        // common task options
      commonOptions =
        {
          logLevel: options['_config'].logLevel || 1,
          removePreviouslyBuiltBundles: options._config.removePreviouslyBuiltBundles
        };

    // snitch build config from the options list
    buildConfig = options['_config'];

    // if there's a mapping file
    console.log('Removing previously built bundles');

    if (buildConfig.mappingFile && commonOptions.removePreviouslyBuiltBundles) {

      // Delete the existing assets here, maybe set a config
      if (fs.existsSync(buildConfig.mappingFile)) {
        try {
          var manifest = fs.readFileSync(buildConfig.mappingFile);
          var bundles = JSON.parse(manifest),
            bundlePath;

          bundles.forEach(function(bundle) {
            // Only one key per object
            bundlePath = path.join(buildConfig.destination, Object.keys(bundle)[0]);
            if (fs.existsSync(bundlePath)) {
              console.log('Removing: ' + bundlePath);
              fs.unlinkSync(bundlePath);
            }
          });
        } catch (err) {

        }

      }      
    }

    // process buildConfig.sharedBundle component before anything else
    processComponent(buildConfig.sharedBundle, function() {
      // loop though the rest of components

      // Remove the config option before processing the components
      if (options._config) {
        delete options._config;
      }

      async.mapSeries(Object.keys(options), processComponent, function(err, data) {
        // silent is number 4 in r.js world
        if (commonOptions.logLevel < 4)
        {
          grunt.log.writeln('\n--\nAll javascript bundles are ready, ' + (err ? err : 'with no errors.'));
        }

        // Here we can write out our file with properties.
        data = data.reduce(function(previousValue,currentValue) {
          return _.extend(previousValue, currentValue);
          }, {});

        // Convert the array to an object
        if (buildConfig.mappingFile) {
          fs.writeFileSync(buildConfig.mappingFile, JSON.stringify(data));
        }
        done();
      });
    });

    //
    function processComponent(component, cb)
    {
      var componentOptions, // per-component options
        outFile, // original bundle file name
        bundleMappingObject = {},
        bundleMapping = []; // the bundle mapping

      // skip reserved words components or deleted ones
      if (component == '_config' || !options[component])
      {
        return cb();
      }

      // collect data for r.js job
      componentOptions =
      {
        cjsTranslate: true,
        create: true,
        removeCombined: true,
        keepBuildDir: false,
        preserveLicenseComments: buildConfig.preserveLicenseComments || false,

        baseUrl: buildConfig.baseUrl,
        name: component,
        optimize: buildConfig.optimize || 'none',
        out: (buildConfig.destination || buildConfig.baseUrl) + '/' + component + '.js',
        packages: [],
        paths: buildConfig.paths || {},
        shim: {},
        include: [],
        insertRequire: []
      };

      // populate with files
      options[component].forEach(function(item)
      {
        var name, src;

        // we can have either a string or an object
        if (typeof item == 'string')
        {
          // add item to the config
          // if item has glob patterns – unfold it
          if (glob.hasMagic(item))
          {
            // unfold path and add to include list
            // using default `process.cwd()` as base path

            componentOptions.include = componentOptions.include.concat(stripExtensions(glob.sync(item)));
          }
          else
          {
            // CRW: should there be a strip here as well?
//            componentOptions.include.push(item);
            componentOptions.include.push(stripExtensions(item));
          }
        }
        else // if its an object expect it to be single key
        {
          name = Object.keys(item)[0];

          // add item to the config
          componentOptions.include.push(name);

          // item could be a path to the file
          // or options object with extra parameters
          if (typeof item[name] == 'string')
          {
            if (item[name].indexOf('node_modules/') > -1)
            {
              componentOptions.packages.push(
              {
                name: name,
                location: path.dirname(item[name]),
                main: path.basename(item[name])
              });
            }
            else
            {
              componentOptions.paths[name] = stripExtensions(item[name]);
            }
          }
          else
          {
            // add module to the config
            // set it up as a package for node_modules
            if (item[name].src.indexOf('node_modules/') > -1)
            {
              componentOptions.packages.push(
              {
                name: name,
                location: path.dirname(item[name].src),
                main: path.basename(item[name].src)
              });
            }
            else
            {
              componentOptions.paths[name] = stripExtensions(item[name].src);
            }

            // process extra params
            if (item[name].exports)
            {
              componentOptions.shim[name] = {exports: item[name].exports};
              // throw deps into mix
              if (item[name].deps)
              {
                componentOptions.shim[name].deps = item[name].deps;
              }
            }

            // check for forced require
            if (item[name].insertRequire)
            {
              componentOptions.insertRequire.push(name);
            }
          }
        }
      });

      // assembled list of modules to include
      // store reference to the buildConfig.sharedBundle modules
      if (component == buildConfig.sharedBundle)
      {
        includedInShared = componentOptions.include;
        modulesOfShared = componentOptions.packages;
      }
      // add it as exclude list to other components
      else
      {
        componentOptions.exclude = includedInShared;
        componentOptions.packages = modulesOfShared;
      }

      // add hashing if needed
      if (buildConfig.hashFiles)
      {
        // override out options with custom function
        // but keep filename for later
        outFile = componentOptions.out;

        componentOptions.out = function hashOutput(output)
        {
          var hash, 
            filename, 
            moduleMapping = {}, 
            md5sum = crypto.createHash('md5');

          md5sum.update(output);
          hash = md5sum.digest('hex');

          // update filename
          outFile = outFile.replace(/\.js$/, '.'+hash+'.js');

          grunt.file.write(outFile, output);
          grunt.log.writeln('\n- Created file "' + outFile + '" with:');

          filename = path.basename(outFile);

          // update config
          buildConfig.handleMapping(component, filename, componentOptions.include);
          bundleMappingObject[filename] = componentOptions.include;
        };
      }

      // add grunt specific options
      componentOptions.logLevel = commonOptions.logLevel;

      // async task
      componentOptions.done = function(response)
      {
        // silent is number 4 in r.js qorld
        if (commonOptions.logLevel < 4)
        {
          grunt.log.writeln('Finished "' + component + '" bundle.\n');
        }

        cb(null, bundleMappingObject);
      };

      // remove processed options from the original list
      // to prevent duplicates
      delete options[component];

      // run requirejs builder
      grunt.verbose.writeflags(componentOptions, 'Options');
      requirejs.optimize(componentOptions, componentOptions.done);
    }

  });

// Strip extensions from the list of filenames
function stripExtensions(paths)
{
  // support string as single element list
  if (typeof paths == 'string')
  {
    return paths.replace(/\.js$/, '');
  }
  // proceed with array
  else
  {
    return paths.map(function(p) { return p.replace(/\.js$/, ''); });
  }
}


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
