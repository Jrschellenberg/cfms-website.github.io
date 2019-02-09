'use strict';
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const imageminMozjpeg = require('imagemin-mozjpeg');

const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const isDebug = process.env.NODE_ENV !== 'production';
const mode = `${isDebug ? "development" : "production"}`;

module.exports = {
  mode: mode,
  
  entry: {
    // BMSPolyfills: './polyfills/polyfills.js', // IF YOU REQUIRE POLYFILLS, uncomment and gt file location for more information
    bundle: './src/js/app.js',
    css: './src/sass/entry.js'
  },
  
  
  module: {
    rules: [
      {
        test: require.resolve('jquery'),
        use: [{
          loader: 'expose-loader',
          options: 'jQuery'
        },
          {
            loader: 'expose-loader',
            options: '$'
          }]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(css|scss)$/,
        
        use: [
          {
            loader: MiniCssExtractPlugin.loader
            
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: isDebug,
            },
          },
          
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: isDebug,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDebug,
            },
          },
        ],
      },
      {
        test: /\.(jpg|jpeg|gif|png|svg|woff|woff2|otf)$/,
        // File loader
        // https://github.com/webpack-contrib/file-loader
        loader: 'file-loader',
        options: {
          emitFile: false,
          name: 'assets/[name].[ext]?[hash]'
        }
      },
      
      
    ],
  },
  
  
  plugins: [
    new MiniCssExtractPlugin({
      filename: "stylesheets/[name].css?[hash]"
    }),
  ],
  
  optimization: {
    minimizer: [
      ...(isDebug ? [] : [
        // Minimize all JavaScript output of chunks
        // https://webpack.js.org/plugins/uglifyjs-webpack-plugin/
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true // set to true if you want JS source maps
        })
      ]),
      
      ...(isDebug ? [] : [
        // Minimize all Css output of chunks
        // https://github.com/NMFR/optimize-css-assets-webpack-plugin
        new OptimizeCSSAssetsPlugin({})
      ]),
    ]
  },
  
  devtool: isDebug ? 'inline-source-map' : false,
  
  // Don't attempt to continue if there are any errors.
  // https://webpack.js.org/configuration/other-options/#bail
  bail: !isDebug,
  
  // Cache the generated webpack modules and chunks to improve build speed
  // https://webpack.js.org/configuration/other-options/#cache
  cache: isDebug,
  
  // Precise control of what bundle information gets displayed
  // https://webpack.js.org/configuration/stats/
  stats: isDebug ? 'normal' : 'minimal',
  
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.scss'],
  },
  output: {
    filename: 'js/[name].js?[hash]',
    path: path.resolve(__dirname, 'serve/'),
  },
  
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  // https://webpack.github.io/docs/configuration.html#node
  // https://github.com/webpack/node-libs-browser/tree/master/mock
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};
