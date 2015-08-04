define([
  'app/views/base'
], function(BaseView)
{
  var exports = BaseView.extend({
    className: 'user_repos_view'
  });
  exports.id = 'user_repos_view';

  return exports;

});
