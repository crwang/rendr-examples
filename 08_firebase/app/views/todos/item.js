var BaseView = require('../base');

module.exports = BaseView.extend({
    className: 'todos_item_view list-group-item',
    tagName: 'li',
    initialize: function(options) {
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
    },
    events: {
        'click .toggle': 'toggleCompleted',
        'click .destroy': 'clear',
        'click .edit': 'edit',
        'keypress .input-edit': 'updateOnEnter',
        'keydown .input-edit': 'revertOnEscape'
    },


    // Switch this view into `"editing"` mode, displaying the input field.
    edit: function() {
        this.$el.addClass('editing');
        this.$('.input-edit').focus();
    },

    // Close the `"editing"` mode, saving changes to the todo.
    close: function() {
        var value = this.$('.input-edit').val();
        var trimmedValue = value.trim();

        // We don't want to handle blur events from an item that is no
        // longer being edited. Relying on the CSS class here has the
        // benefit of us not having to maintain state in the DOM and the
        // JavaScript logic.
        if (!this.$el.hasClass('editing')) {
            return;
        }

        if (trimmedValue) {
            this.model.save({
                title: trimmedValue
            });

            if (value !== trimmedValue) {
                // Model values changes consisting of whitespaces only are
                // not causing change to be triggered Therefore we've to
                // compare untrimmed version with a trimmed one to check
                // whether anything changed
                // And if yes, we've to trigger change event ourselves
                this.model.trigger('change');
            }
        } else {
            this.clear();
        }

        this.$el.removeClass('editing');
    },
    updateOnEnter: function(e) {
        if (e.which === 13) {
            this.close();
        }
    },
    // If you're pressing `escape` we revert your change by simply leaving
    // the `editing` state.
    revertOnEscape: function(e) {
        if (e.which === 27) {
            this.$el.removeClass('editing');
            // Also reset the hidden input back to the original value.
            this.$('.input-edit').val(this.model.get('title'));
        }
    },
    clear: function() {
        this.model.destroy();
    },

    postRender: function() {
        if (this.model) {
            this.$el.toggleClass('completed', this.model.get('completed'));
        }
    },

    // Toggle the `"completed"` state of the model.
    toggleCompleted: function() {
        this.model.toggle();
    }
});
module.exports.id = 'todos/item';
