define([
  'app/views/base'
], function(BaseView)
{
  
  var exports = BaseView.extend({
    className: 'users_index_view'
  });
  exports.id = 'users_bundle/users/index';

  return exports;

});
