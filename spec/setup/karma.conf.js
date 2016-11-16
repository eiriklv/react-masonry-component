var webpack = require('webpack');

module.exports = function (config) {
    config.set({
        browsers: ['PhantomJS'],
        singleRun: true,
        frameworks: ['mocha'],
        files: [
            'test-style.css',
            'tests.webpack.js'
        ],
        preprocessors: {
            'tests.webpack.js': ['webpack']
        },
        reporters: ['dots'],
        webpack: {
            module: {
                loaders: [
                    {
                        test: /\.jsx?$/,
                        exclude: /node_modules/,
                        loader: 'babel-loader'
                    },
                    {
                        test: /masonry|imagesloaded|fizzy\-ui\-utils|desandro\-|outlayer|get\-size|doc\-ready|eventie|eventemitter/,
                        loader: 'imports?define=>false&this=>window'
                    }
                ]
            },
            watch: true
        },
        webpackServer: {
            noInfo: true
        }
    });
};
