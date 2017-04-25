const path					 		= require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
// const postcssConfig = require('./postcss.config.js');

const config = {
  entry: './app.js',
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
					use: ['css-loader', 'postcss-loader']
				})
				// use: [{
				// 	loader: 'style-loader'
				// }, {
				// 	loader: 'css-loader?importLoaders=1',
				// 	options: {
				// 		sourceMap: true
				// 	}
				// }, {
				// 	loader: 'postcss-loader',
				// 	// options: {
				// 	// 	plugins: postcssConfig
				// 	// }
				// }]
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: 'css-loader'
				})
			}
		]
	},
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build')
  },
  plugins: [
    new ExtractTextPlugin({
    	filename: '[name].css',
    	allChunks: true
    })
  ]
};

module.exports = config;
