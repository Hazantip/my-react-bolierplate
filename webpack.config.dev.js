import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import autoprefixer from 'autoprefixer';

const GLOBALS = {
	'process.env.NODE_ENV': JSON.stringify('development'),
	__DEV__: true
};

const PATHS = {
	app: path.resolve(__dirname, './src/js'),
	styles: path.resolve(__dirname, './src/styles'),
	build: path.resolve(__dirname, './build')
};

export default {
	debug: true,
	//devtool: 'cheap-module-eval-source-map', // more info:https://webpack.github.io/docs/build-performance.html#sourcemaps and https://webpack.github.io/docs/configuration.html#devtool
	devtool: 'cheap-inline-module-source-map',
	noInfo: false, // set to false to see a list of every file being bundled.
	entry: [
		'webpack-hot-middleware/client?reload=true',
		'./src/js/index'
	],
	target: 'web', // necessary per https://webpack.github.io/docs/testing.html#compile-and-test
	output: {
		path: PATHS.app, // Note: Physical files are only output by the production build task `npm run build`.
		publicPath: 'http://localhost:3000/', // Use absolute paths to avoid the way that URLs are resolved by Chrome when they're parsed from a dynamically loaded CSS blob. Note: Only necessary in Dev.
		//publicPath: '/', // production
		filename: 'bundle.js'
	},
	resolve: {
		root: path.resolve('./src')
	},
	plugins: [
		new webpack.DefinePlugin(GLOBALS), // Tells React to build in prod mode. https://facebook.github.io/react/downloads.html
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin(),
		new HtmlWebpackPlugin({     // Create HTML file that includes references to bundled CSS and JS.
			template: 'src/index.ejs',
			minify: {
				removeComments: true,
				collapseWhitespace: true
			},
			inject: true
		})
	],
	module: {
		loaders: [
			{test: /\.js$/, loaders: ['babel'], include: PATHS.app, exclude: /node_modules/},

			{test: /\.eot(\?v=\d+.\d+.\d+)?$/, loader: 'file'},
			{test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff"},
			{test: /\.ttf(\?v=\d+.\d+.\d+)?$/, loader: 'file-loader?limit=10000&mimetype=application/octet-stream'},
			{test: /\.svg(\?v=\d+.\d+.\d+)?$/, loader: 'file-loader?limit=10000&mimetype=image/svg+xml'},

			{test: /\.(jpe?g|png|gif|svg)$/i, include: PATHS.images, loaders: ['file-loader?root=.&name=images/[name].[ext]']},
			{test: /\.ico$/, loader: 'file-loader?name=[name].[ext]'},

			{test: /(\.css|\.scss)$/, loaders: ['style', 'css?sourceMap', 'postcss-loader', 'sass?sourceMap']}

		]
	},
	postcss: function () {
		return [autoprefixer({
			browsers: ['last 2 versions', 'IE > 10']
		})];
	}
};
