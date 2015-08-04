define([
  'app/models/user',
  'app/collections/base'
], function(User, Base)
{
  var exports = Base.extend({
    model: User,
    url: '/users'
  });
  exports.id = 'Users';

  return exports;
});
