const path 		= require('path');

const config = {
  entry: './app/index.js',
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: "babel-loader",
				exclude: /node_modules/,
			}
		]
	},
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build')
  }
};

module.exports = config;
