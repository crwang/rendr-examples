# Firebase - Rendr TODO example app.

## Introduction

The purpose of this little app is to demonstrate one way of using integrating firebase into a simple Rendr app.

## Running the example

First, make sure to have Node >= 0.8.0 [installed on your system](http://nodejs.org/). Also, make sure to have `grunt-cli` installed globally.

    $ npm install -g grunt-cli

If you see an error on startup that looks [like this](https://github.com/rendrjs/rendr-app-template/issues/2), then you may need to un-install a global copy of `grunt`:

    $ npm uninstall -g grunt

Run `npm install` to install dependencies:

    $ npm install

Then, use `grunt server` to start up the web server. Grunt will recompile and restart the server when files change.

    $ grunt server

    Running "runNode" task

    Running "handlebars:compile" (handlebars) task
    11 Dec 17:40:30 - [nodemon] v0.7.10
    11 Dec 17:40:30 - [nodemon] to restart at any time, enter `rs`
    11 Dec 17:40:30 - [nodemon] watching: /Users/spike/code/rendr/examples/00_simple
    File "app/templates/compiledTemplates.js" created.

    Running "browserify:basic" (browserify) task
    11 Dec 17:40:30 - [nodemon] starting `node index.js`
    connect.multipart() will be removed in connect 3.0
    visit https://github.com/senchalabs/connect/wiki/Connect-3.0 for alternatives
    connect.limit() will be removed in connect 3.0
    server pid 86724 listening on port 3030 in development mode
    >> Bundled public/mergedAssets.js

    Running "stylus:compile" (stylus) task
    File public/styles.css created.

    Running "watch" task
    Waiting...

    11 Dec 17:40:32 - [nodemon] starting `node index.js`
    server pid 86728 listening on port 3030 in development mode

Now, pull up the app in your web browser. It defaults to port `3030`.

    $ open http://localhost:3030

You can choose a different port by passing the `PORT` environment variable:

    $ PORT=80 grunt server

### Firebase Concurrent rate limit

Firebase currently limits the number of concurrence connections to 100. This should be enough for just playing with the sample app, but if too many people pull it down and start developing off it you may run up against the rate limit.

If we hit the limit, feel free to set up your own firebase project and to change the values in the `/config/default.json` file.

## License

MIT
