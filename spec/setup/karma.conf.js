var webpack = require('webpack');

module.exports = function (config) {
    config.set({
        browsers: ['PhantomJS'],
        singleRun: true,
        frameworks: ['mocha'],
        files: [
            '../../node_modules/babel-polyfill/dist/polyfill.js',
            {pattern: '../*-test.js', watched: false},
            {pattern: '../**/*-test.js', watched: false},
            'test-style.css'
        ],
        preprocessors: {
          '../*-test.js': ['webpack', 'sourcemap'],
          '../**/*-test.js': ['webpack', 'sourcemap']
        },
        reporters: ['dots'],
        webpack: {
            devtool: 'inline-source-map',
            module: {
                loaders: [
                    {
                        test: /\.jsx?$/,
                        exclude: /node_modules/,
                        loader: 'babel'
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
