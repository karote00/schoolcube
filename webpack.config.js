const path 		= require('path');
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
				// loader: 'style!css!autoprefixer!sass'
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
			}
		]
	},
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build')
  }
};

module.exports = config;
