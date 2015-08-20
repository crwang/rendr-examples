var Base = require('./base_firebase'),
    Firebase = require('firebase');

module.exports = Base.extend({
    modelName: 'Todo',
    url: '/todos/:id.json',
    defaults: {
        title: '',
        completed: false
    },

    // Toggle the `completed` state of this todo item.
    toggle: function () {
        this.save({
            completed: !this.get('completed')
        });
    }
});
module.exports.id = 'Todo';
