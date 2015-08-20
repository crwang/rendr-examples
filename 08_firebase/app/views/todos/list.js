var BaseView = require('../base'),
    Todo = require('../../models/todo');

module.exports = BaseView.extend({
  className: 'todos_list_view list-group',
  tagName:  'ul',
    initialize: function(options) {
        this.listenTo(this.collection, 'add remove', this.render);
    }
});
module.exports.id = 'todos/list';
