/**
 * The base class for firebase rendr collections.
 */
var RendrBase = require('rendr/shared/base/collection'),
    _ = require('underscore'),
    syncer = require('../shared/syncer_firebase');

_.extend(RendrBase.prototype, syncer);

module.exports = RendrBase.extend({
    api: 'firebase',
    initialize: function(options) {
        RendrBase.prototype.initialize.apply(this, arguments);
        var isServer = (typeof window === 'undefined');

        if (!isServer) {
            // Add the firebase reference
            // this.firebase = this.createFirebaseReference();
            this.firebase = this.app.getCurrentFirebaseReference();
            this.firebase.child(this.getFirebaseUrlForJsApi()).on('child_added', function(childSnapshot, prevChildKey) {
                // Then, create the appropriate model and add it to the collection
                var newModel = new this.model(childSnapshot.val(), {
                    app: this.app
                });

                this.add(newModel);
            }, function(err) {
                this.trigger('error', this, err, null);
            }, this);

            this.firebase.on('child_removed', function(oldChildSnapshot) {
                this.remove(oldChildSnapshot.val());
            }, function(err) {
                this.trigger('error', this, err, null);
            }, this);
        }
    }
});
