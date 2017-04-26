const webpack 					= require('webpack');
const path					 		= require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HTMLPlugin 				= require('html-webpack-plugin');
const SWPrecachePlugin 	= require('sw-precache-webpack-plugin');
const extractCSS				=	new ExtractTextPlugin('stylesheets/[name].css');

const config = {
  entry: './src/app.js',
  devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.js$/,
				use: 'babel-loader',
				exclude: /(node_modules|bower_components)/,
			},
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader', 'sass-loader']
				})
			},
			{
				test: /\.css$/,
				use: extractCSS.extract({
					fallback: 'style-loader',
					use: 'css-loader'
				})
			}
		]
	},
  output: {
    filename: '[name].[chunkhash].js',
    publicPath: './',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new ExtractTextPlugin({
    	filename: 'styles.[hash].css',
    	allChunks: true
    }),
    new HTMLPlugin({
      template: 'src/index.html'
    })
  ]
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    // minify JS
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    // auto generate service worker
    new SWPrecachePlugin({
      cacheId: 'vue-hn',
      filename: 'service-worker.js',
      dontCacheBustUrlsMatching: /./,
      staticFileGlobsIgnorePatterns: [/index\.html$/, /\.map$/]
    })
  )
}

module.exports = config;
