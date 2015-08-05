require('global-define')({basePath: ''});

var express     = require('express'),
  rendr       = require('rendr'),
  _           = require('underscore'),
  config      = require('config'),
  app         = express(),
  bodyParser  = require('body-parser'),
  compression = require('compression'),
  serveStatic = require('serve-static'),
  fs          = require('fs'),
  requirejsBundleMapping = 'config/mapping.json';

/**
 * In this simple example, the DataAdapter config, which specifies host, port, etc. of the API
 * to hit, is written inline. In a real world example, you would probably move this out to a
 * config file. Also, if you want more control over the fetching of data, you can pass your own
 * `dataAdapter` object to the call to `rendr.createServer()`.
 */
var dataAdapterConfig = {
  'default': {
    host: 'api.github.com',
    protocol: 'https'
  },
  'travis-ci': {
    host: 'api.travis-ci.org',
    protocol: 'https'
  }
};

/**
 * Initialize our Rendr server.
 */
var server = rendr.createServer({
  dataAdapterConfig: dataAdapterConfig
});

server.configure(function (expressApp) {
  expressApp.use(compression());
  expressApp.use(serveStatic(__dirname + '/public'));
  expressApp.use(bodyParser.json());

  if (fs.existsSync(requirejsBundleMapping)) {
    // Set the requireJs mapping if it's found
    expressApp.use(function(req, res, next) {
        var app = req.rendrApp;
        var manifest = fs.readFileSync(requirejsBundleMapping);
        var bundles = JSON.parse(manifest);
        app.set('requirejsBundles', bundles);

        next();
    });
  }

  // Set the config into the app
  expressApp.use(function(req, res, next) {
      var app = req.rendrApp;
      app.set('config', _.pick(config, 'files'));
      next();
  });

});

/**
  * To mount Rendr, which owns its own Express instance for better encapsulation,
  * simply add `server` as a middleware onto your Express app.
  * This will add all of the routes defined in your `app/routes.js`.
  * If you want to mount your Rendr app onto a path, you can do something like:
  *
  *     app.use('/my_cool_app', server);
  */
app.use(server.expressApp);


// if (app.settings.env == 'development') {
//   app.use('/js/app', express.static(__dirname + '/app'));
// }

/**
 * Start the Express server.
 */
function start(){
  var port = process.env.PORT || 3030;
  app.listen(port);
  console.log("server pid %s listening on port %s in %s mode",
    process.pid,
    port,
    app.get('env')
  );
}


/**
 * Only start server if this script is executed, not if it's require()'d.
 * This makes it easier to run integration tests on ephemeral ports.
 */
if (require.main === module) {
  start();
}

exports.app = app;
