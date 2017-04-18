const path 		= require('path');

const config = {
  entry: './app/index.js',
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
					loader: 'css-loader',
					options: {
						sourceMap: true
					}
				}, {
					loader: 'sass-loader',
					options: {
						sourceMap: true
					}
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
