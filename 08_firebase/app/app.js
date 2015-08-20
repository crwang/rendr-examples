var BaseApp = require('rendr/shared/app'),
  url = require('url'),
  handlebarsHelpers = require('./lib/handlebarsHelpers');

/**
 * Extend the `BaseApp` class, adding any custom methods or overrides.
 */
module.exports = BaseApp.extend({

  /**
   * Client and server.
   *
   * `initialize` is called on app initialize, both on the client and server.
   * On the server, an app is instantiated once for each request, and in the
   * client, it's instantiated once on page load.
   *
   * This is a good place to initialize any code that needs to be available to
   * app on both client and server.
   */
  initialize: function() {
    /**
     * Register our Handlebars helpers.
     *
     * `this.templateAdapter` is, by default, the `rendr-handlebars` module.
     * It has a `registerHelpers` method, which allows us to register helper
     * modules that can be used on both client & server.
     */
    this.templateAdapter.registerHelpers(handlebarsHelpers);
  },

  /** 
   * Get our firebase endpoint.
   * 
   * Note: In a real application, this may be overwritten for a given user.
   */
  getCurrentFirebaseEndpoint: function() {
      // Assumes we have stored the data, 
      // which we have hard-coded in our index.js and config/default.json
      return url.format(this.get('firebase'));
  },

  /**
   * Use one app-wide firebase reference.
   */
  getCurrentFirebaseReference: function() {
    if (this.firebase) {
      return this.firebase;
    } else {
      this.firebase = new Firebase(this.getCurrentFirebaseEndpoint()); 
      return this.firebase;
    }
  },

  /**
   * Client-side only.
   *
   * `start` is called at the bottom of `__layout.hbs`. Calling this kicks off
   * the router and initializes the application.
   *
   * Override this method (remembering to call the superclass' `start` method!)
   * in order to do things like bind events to the router, as shown below.
   */
  start: function() {
    // Show a loading indicator when the app is fetching.
    this.router.on('action:start', function() { this.set({loading: true});  }, this);
    this.router.on('action:end',   function() { this.set({loading: false}); }, this);

    // Call 'super'.
    BaseApp.prototype.start.call(this);
  }
});
