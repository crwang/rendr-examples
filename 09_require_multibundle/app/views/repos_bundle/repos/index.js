define([
  'app/views/base'
], function(BaseView)
{

  var exports = BaseView.extend({
    className: 'repos_index_view'
  });
  exports.id = 'repos_bundle/repos/index';

  return exports;

});
