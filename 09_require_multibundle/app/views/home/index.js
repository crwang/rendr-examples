define([
  'app/views/base'
], function(BaseView)
{

  var exports = BaseView.extend({
    className: 'home_index_view'
  });
  exports.id = 'home/index';

  return exports;

});
