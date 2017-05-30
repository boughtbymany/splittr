const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

let plugins = [
	new ExtractTextPlugin({
		filename: 'css/styles.css',
		disable: false,
		allChunks: true
	}),
	new HtmlWebpackPlugin({
		template: './src/index.pug'
	})
];

if (isProduction) {
	plugins.push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = {
	devtool: isProduction ? 'eval' : 'cheap-eval-source-map',
	entry: './src/app.js',
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'js/bundle.js',
		publicPath: ''
	},

	plugins,

	devServer: {
		inline: true,
		contentBase: './dist',
		port: 3000,
		open: true
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [{
					loader: 'babel-loader',
					options: {
						babelrc: false,
						presets: [
							['env', {
								'es2015': {
									'modules': false
								}
							}]
						]
					}
				}]
			},
			{
				test:/\.(scss|css)$/,
				exclude: /node_modules/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					publicPath: '../',
					use: [
						{
							loader: 'css-loader',
							options: {
								minimize: isProduction ? true : false
							}
						},
						{
							loader: 'postcss-loader',
							options: {
								plugins: () => [require('autoprefixer')]
							}
						},
						'resolve-url-loader',
						'sass-loader?sourceMap',
						'import-glob-loader'
					]
				})
			},
			{
				test: /\.pug$/,
				use: ['pug-loader?pretty=true']
			}
		]
	}
}
