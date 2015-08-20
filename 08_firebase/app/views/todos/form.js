var BaseView = require('../base'),
    Todo = require('../../models/todo');

module.exports = BaseView.extend({
    className: 'todos_form_view',
    initialize: function(options) {
        if (!this.model) {
            this.model = new Todo({}, { app: this.app });
        }
        this.listenTo(this.model, 'change', this.render);
    },
    events: {
         'keypress .input-todo': 'inputKeyPressed'
    },
    inputKeyPressed: function(e) {
        if (e.which === 13) {
            this.model.set({
                title: this.$('.input-todo').val(),
                createdAt: new Date()
            }, { silent: true });
            // Trigger it on the app since it's hard to listen to child views in Rendr
            this.app.trigger('todos:form:submit', this.model);
        }
    }
});
module.exports.id = 'todos/form';
