var Todo = require('../models/todo'),
    Base = require('./base_firebase');

module.exports = Base.extend({
    model: Todo,
    url: '/todos.json',

    // Filter down the list of all todo items that are finished.
    completed: function() {
        return this.where({
            completed: true
        });
    },

    // Filter down the list to only todo items that are still not finished.
    remaining: function() {
        return this.where({
            completed: false
        });
    },

    // We keep the Todos in sequential order, despite being saved by unordered
    // random string in the database. This generates the next order number 
    // for new items.
    nextOrder: function() {
        return this.length ? this.last().get('order') + 1 : 1;
    },

    // Todos are sorted by their original insertion order.
    comparator: 'order'
});
module.exports.id = 'Todos';
