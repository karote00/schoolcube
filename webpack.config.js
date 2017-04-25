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
				// use: ExtractTextPlugin.extract({
				// 	fallback: 'style-loader',
				// 	use: ['css-loader', 'sass-loader']
				// })
				use: [{
					loader: 'style-loader'
				}, {
					loader: 'css-loader?importLoaders=1',
					options: {
						sourceMap: true
					}
				}, {
					loader: 'postcss-loader',
					// options: {
					// 	plugins: postcssConfig
					// }
				}]
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
    // filename: '[name].[chunkhash].js',
    filename: 'bundle.js',
    publicPath: '/dist/',
    path: path.resolve(__dirname, 'dist')
  },
  // plugins: [
  //   new ExtractTextPlugin({
  //   	filename: 'styles.[hash].css',
  //   	allChunks: true
  //   })
  // ]
};

module.exports = config;
