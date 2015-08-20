module.exports = {
    index: function(params, callback) {
        var spec = {
            collection: {
                collection: 'Todos',
                params: params
            }
        };
        this.app.fetch(spec, function(err, result) {
            callback(err, result);
        });
    }
};
