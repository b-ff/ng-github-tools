const webpack = require('webpack');

module.exports = {

    entry: {
        'ng-github-tools': './src/ng-github-tools.js',
        'ng-github-tools.min': './src/ng-github-tools.js'
    },

    output: {
        path: `${__dirname}/dist`,
        filename: '[name].js'
    },

    devtool: "source-map",

    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel-loader',
            options: {
                presets: ['es2015', 'stage-0']
            }
        }]
    },

    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            minimize: true
        })
    ]
};
