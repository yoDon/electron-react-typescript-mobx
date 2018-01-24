"use strict";
const path = require('path');
const minimist = require('minimist');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// see https://medium.com/@ad_harmonium/build-to-both-electron-js-and-browser-targets-using-webpack-59266bdb76a
// see https://github.com/eaTong/electron-mobx/blob/master/webpack.production.config.js 
// see https://github.com/TBoileau/electron-react-mobx-boilerplate

var argv = minimist(process.argv.slice(2));
const isWeb = (argv && argv.target === 'web');
const target = (isWeb ? 'web' : 'electron-renderer');
const entryTsx = (isWeb ? { site: "./_site/app/app.tsx" } : { electron: "./_src/app/app.tsx" } );
const htmlWebpackPlugin = (isWeb ? 
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: '_site/app/index.html',
        inject: false
    })
    :
    new HtmlWebpackPlugin({
        filename: 'index-electron.html',
        template: '_src/app/index-electron.html',
        inject: false
    })
);

module.exports = {
    entry: [
        entryTsx
    ],
    target: target,
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
              'NODE_ENV': JSON.stringify('production')
            }
        }),
        htmlWebpackPlugin
    ],
    resolve: {
        extensions: [ 
            '.css',
            '.scss',
            '.tsx',
            '.jsx', 
            '.ts', 
            '.js', 
            '.json' 
        ]
    },
    module: {
        rules: [
            { 
                // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
                enforce: "pre", 
                test: /\.js$/, 
                loader: "source-map-loader" 
            },
            {
                test: /\.tsNOT$/,
                enforce: 'pre',
                loader: 'tslint-loader',
                options: {
                  typeCheck: true,
                  emitErrors: true
                }
            },
            {
                // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
                test: /\.tsx?$/, 
                loader: "awesome-typescript-loader" 
            },
            {
                test: /\.scss$/,
                use: [
                    { 
                        loader: "style-loader"
                    },
                    {
                        loader: "typings-for-css-modules-loader",
                        options: {
                            namedExport: true,
                            camelCase: true,
                            modules: true
                        }
                    },
                    { 
                        loader: "sass-loader"
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'typings-for-css-modules-loader',
                        options: {
                            namedExport: true,
                            camelCase: true,
                            modules: true
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif|svg)(\?\S*)?$/,
                exclude: /node_modules/,
                loader: 'file-loader',
                options: {}  
            }
        ],
    }
};