/**
 * The base class for firebase rendr models.
 */
var RendrBase = require('rendr/shared/base/model'),
    _ = require('underscore'),
    syncer = require('../shared/syncer_firebase');
_.extend(RendrBase.prototype, syncer);

module.exports = RendrBase.extend({
    api: 'firebase',

    /**
     * Initialize the model.  Add a listener to firebase for changes.
     * Currently, we only suport listening on the client-side.
     */
    initialize: function(options) {
        var isServer = (typeof window === 'undefined');

        if (!isServer) {
            RendrBase.prototype.initialize.apply(this, arguments);

            // Add the firebase reference
            this.firebase = this.app.getCurrentFirebaseReference();
            this.firebase.child(this.getFirebaseUrlForJsApi()).on('value', function(snapshot) {
                this.set(snapshot.val());
            }, function(err) {
                this.trigger('error', this, err, null);
            }, this);
        }
    }    
});
