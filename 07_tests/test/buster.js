var config = module.exports;

config['Functional tests'] = {
    environment: 'browser',
    rootPath: "../",
    tests: [
        'test/functional/*-test.js'
    ],
    resources: [
        {
            path: '/index',
            backend: 'http://localhost:3037/'
        }, {
            path: '/js',
            backend: 'http://localhost:3037/js'
        }, {
            path: '/style',
            backend: 'http://localhost:3037/style'
        }, {
            path: '/api',
            backend: 'http://localhost:3037/api'
        },
    ],
    extensions: [
        require('buster-functional')
    ],
    'buster-functional': {
        timeout: 5 // seconds
    }
};
