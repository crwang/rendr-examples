var assert = buster.referee.assert;
var refute = buster.referee.refute;

buster.testCase("Test Home Page", {
    setUp: function(done) {
        this.load("/index").waitForVar('App', function() {
            // expose App to the tests 
            this.App = this.window.App;
            // set App as event root 
            this._setEventRoot(this.window.App);
            // proceed with the tests 
            console.log('Loaded App');
            done();
        }.bind(this));
        this.load('/index', done);
    },
    'Click Repos': function(done) {
        var _this = this;
        setTimeout(function() {
            console.log(this.$('.navbar-fixed-top .navbar-nav li:nth-child(2) > a').html());
            _this.click('.navbar-fixed-top .navbar-nav li:nth-child(2) > a', function() {
                setTimeout(function() {
                    // Invoked _triggerEvents
                    assert.equals(_this.$('h1').html(), 'Repos');
                    done();
                }.bind(_this), 1000);
            });
        }, 1000);
    }
});
