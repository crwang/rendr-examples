define([
  'app/views/base'
], function(BaseView)
{
  var exports = BaseView.extend({
    className: 'users_show_view',

    getTemplateData: function() {
      var data = BaseView.prototype.getTemplateData.call(this);
      data.repos = this.options.repos;
      return data;
    }
  });
  exports.id = 'users/show';

  return exports;

});
