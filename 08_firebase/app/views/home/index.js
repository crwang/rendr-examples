var BaseView = require('../base'),
    _ = require('underscore'),
    Todo = require('../../models/todo');

module.exports = BaseView.extend({
    className: 'home_index_view',
     initialize: function(options) {
        this.listenTo(this.app, 'todos:form:submit', this.newTodoSubmitted);
        this.listenTo(this.app, 'todos:item:selected', this.showSelectedTodo);
    },

    newTodoSubmitted: function(modelTodo) {
        // var newTodo = new Todo(modelTodo.toJSON(), {
        //     app: this.app
        // });
        // newTodo.save();
        var newTodo = new Todo(_.extend(modelTodo.toJSON(), 
            { order: this.collection.nextOrder()}), {
            app: this.app
        });
        // Normally, you'd add to the collection or create on the collection
        // But since in firebase our models are tied into our collections
        // it'll auto-add into the firebase remote "collection" which 
        // we are listening to and we'll receive an add event.
        newTodo.save();  
        modelTodo.clear().set(modelTodo.defaults);
    },

    showSelectedTodo: function(modelTodo) {
        var itemSummaryView = this.getItemSummaryView();
        itemSummaryView.setModel(modelTodo);
    },

    getItemSummaryView: function() {
        var views = this.getChildViewsByName('todos/item_summary');

        if (views && views.length) {
            return views[0];
        }

        return null;
    }
});
module.exports.id = 'home/index';
