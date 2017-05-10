/**
 * Created by paul on 10.05.2017.
 */
module.exports = function(config) {
    config.set({
        browsers: ['PhantomJS'],
        files: [
            { pattern: 'test-context.js', watched: false }
        ],
        frameworks: ['jasmine', 'promise', 'es6-shim'],
        preprocessors: {
            'test-context.js': ['webpack']
        },
        webpack: {
            module: {
                loaders: [
                    {
                        test: /\.js/,
                        exclude: /node_modules/,
                        loader: 'babel-loader'
                    },
                    {
                        test: /\.json$/,
                        loader: 'json'
                    },
                    {
                        test: /\.jpg$/,
                        loader: 'file?name=[name].[ext]',
                    },
                    {
                        test: /\.png/,
                        loader: 'file?name=[name].[ext]',
                    },
                    {
                        test: /\.html/,
                        loader: 'file?name=[name].[ext]',
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