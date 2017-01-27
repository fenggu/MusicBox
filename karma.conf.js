// // Karma configuration
var path = require('path');
var webpack = require('webpack');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
// 产出html模板
var HtmlWebpackPlugin = require("html-webpack-plugin");
// 单独样式文件
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var node_modules = path.resolve(__dirname, 'node_modules');

/**
 * 标识开发环境和生产环境
 * @type {webpack.DefinePlugin}
 */
var definePlugin = new webpack.DefinePlugin({
    __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
    __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false'))
});

module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['mocha'],
        files: [
            './test/*.test.js'
        ],

        preprocessors: {
            // add webpack as preprocessor
            'src/**/*.js': ['webpack', 'sourcemap'],
            'test/*.test.js': ['webpack', 'sourcemap']
        },
        // webpack file
        webpack: {
            devtool: 'inline-source-map', //just do inline source maps instead of the default
            module: {
                loaders: [{
                    test: /\.js$/,
                    loader: 'babel',
                    exclude: path.resolve(__dirname, 'node_modules'),
                    query: {
                        presets: ['airbnb', 'es2015', "stage-0", "react"]
                    }
                }, {
                    test: /\.css/,
                    loader: ExtractTextPlugin.extract("style-loader", "css-loader")
                }, {
                    test: /\.less/,
                    loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
                }, {
                    test: /\.(png|jpg)$/,
                    loader: 'url?limit=8192'
                }, {
                    test: /\.(woff|woff2|ttf|svg|eot)(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "url?limit=10000"
                }, {
                    test: /\.json$/,
                    loader: 'json',
                }, {
                    test: /sinon\.js$/,
                    loader: "imports?define=>false,require=>false"
                }]
            },
            externals: {
                'react/addons': true,
                'react/lib/ExecutionEnvironment': true,
                'react/lib/ReactContext': true
            }
        },

        webpackServer: {
            noInfo: true
        },

        plugins: [
            'karma-webpack',
            'karma-mocha',
            'karma-sourcemap-loader',
            'karma-chrome-launcher',
        ],


        babelPreprocessor: {
            options: {
                presets: ['airbnb']
            }
        },
        reporters: ['progress'],
        // port: 9002,
        logLevel: config.LOG_INFO,
        browsers: ['Chrome'],
        singleRun: false,
    })

};
