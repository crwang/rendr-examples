define([
  'app/models/base'
], function(Base)
{
  var exports = Base.extend({
    url: '/repos/:owner/:name',
    api: 'travis-ci'
  });
  exports.id = 'Build';

  return exports;
});
