/**
 * Created by paul on 09.05.2017.
 */
'use strict';

var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var styleLintPlugin = require('stylelint-webpack-plugin');


require('es6-promise').polyfill();

module.exports = {
    entry: [path.join(__dirname, 'app', 'scripts', 'main.js')],

    output: {
        path: path.join(__dirname, "dist"),
        filename: 'scripts/app.js'
    },

    plugins: [
        // Specify the resulting CSS filename
        new ExtractTextPlugin('styles/app.css'),
        new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/])

    ],


    devtool: 'cheap-module-source-map',

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract(
                    'style-loader',
                    'css-loader!postcss!sass-loader?outputStyle=expanded'
                )
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
            }
        ]
    },

    postcss: [
        autoprefixer({
            browsers: ['last 2 versions']
        })
    ],

    stats: {
        // Colored output
        colors: true
    },

    devServer: {
        hot: true,
        contentBase: "./app",
        //publicPath: "/app",
    }
};