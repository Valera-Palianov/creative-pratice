const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') 
const postcssSCSS = require('postcss-scss') 
const autoprefixer = require('autoprefixer') 

const pages = []

//Создается точка входа для фреймворка, которая будет подключаться ко всем страницам.
//Ниже, в цикле, просматриваются все файлы в папке pages и добавляются в архив со страницами
//За исключением base, которая является просто основой для других страниц
//Если рядом со страницей обнаружен scss файл с таким же названием, то будет создана новая точка входа
const chunks = {
	'framework' : './framework.scss'
}

fs.readdirSync(path.resolve(__dirname, 'src', 'pages')).filter((file) => {
	return file.indexOf('base') !== 0;
}).forEach((file) => {
	pages.push(file.split('/', 2));
})


const htmlPlugins = pages.map(fileName => {
	const conf = {
		filename: `${fileName}.html`,
		template: `./pages/${fileName}/${fileName}.pug`,
		inject: 'body',
		hash: true,
		chunks: ['framework']
	}

	if(fs.existsSync(path.resolve(__dirname, 'src', `./pages/${fileName}/${fileName}.scss`))) {
		chunks[fileName] = path.resolve(__dirname, 'src', `./pages/${fileName}/${fileName}.scss`)
		conf.chunks.push(fileName.toString())
	}

	return new HtmlWebpackPlugin(conf)
})

const confGeneral = {
	mode: process.env.NODE_ENV,
	result: process.env.NODE_RESULT,
	devtool: process.env.NODE_ENV == 'development' ? 'source-map' : '',
	entry: chunks,
	context: path.resolve(__dirname, 'src')
}

const confResolve = {
	alias: {
		ROOT: path.resolve(__dirname, 'src/'),
		FRAMEWORK: path.resolve(__dirname, 'src/framework.blocks'),
		UIKIT: path.resolve(__dirname, 'src/uikit.blocks'),
		COMMON: path.resolve(__dirname, 'src/common.blocks')
	}
}

const confOutput = {
	filename: 'assets/js/[name].bundle.js?[hash]',
	path: path.resolve(__dirname, 'dist'),
	chunkFilename: 'assets/js/[name].bundle.js?[hash]',
}

const getOptimization = (mode = confGeneral.mode) => {
	optimization = {
		splitChunks: {
			chunks: 'all'
		}
	}
	return optimization
}

const getPlugins = (result = confGeneral.result) => {
	const plugins = []
	if(result == "build") {
		plugins.push(
			new CleanWebpackPlugin()
		)
		plugins.push(
			new MiniCssExtractPlugin(
				{
					filename: 'assets/style/[name].css?[hash]'
				}
			)
		)
	} else {
		plugins.push(
			new webpack.HotModuleReplacementPlugin()
		)
	}
	return plugins
}

const getCssRule = (result = confGeneral.result) => {
	const loaders = []
	if(result == "build") {
		loaders.push(MiniCssExtractPlugin.loader)
	} else {
		loaders.push('style-loader')
	}
	loaders.push('css-loader')
	loaders.push(
		{
			loader: 'postcss-loader',
			options: {
				plugins: function () {
					return [
						autoprefixer(),
					]
				}
			}
		}
	)
	return loaders
}
const getScssRule = (mode = confGeneral.mode, defaultLoaders = getCssRule()) => {
	const loaders = defaultLoaders
	loaders.push({
		loader: 'sass-loader',
		options: {
			sourceMap: mode == "development" ? true : false,
		}
	})
	return loaders
}

const getDevServer = (result = confGeneral.result, port = process.env.PORT) => {
	devServer = {}
	if(result == "server") {
		devServer.inline = true
		devServer.hot = true
		devServer.contentBase = 'dist'
		devServer.host = 'localhost'
		devServer.port = port
	}
	return devServer
}

const confPlugins = getPlugins().concat(htmlPlugins)
const confOptimization = getOptimization()
const confDevServer = getDevServer()
const confModule = {
	rules: [
		{
			test: /\.js$/,
    		loader: 'babel-loader',
    		exclude: [
    			/node_modules/,
    		]
		},
		{
			test: /\.pug$/,
			loader: {
				loader: 'pug-loader',
				options: {
					pretty: process.env.NODE_ENV == 'development' ? true : false
				}
			},
		},
		{
			test: /\.(png|jpg|svg)$/,
			use: [
				{
					loader: 'file-loader',
					options: {
				        name: 'img/[name].[ext]?[hash]',
				    }
				}
			]
		},
		{
			test: /\.(ttf|eot|woff|woff2)$/,
			use: [
				{
					loader: 'file-loader',
					options: {
				        name: '/assets/fonts/[name].[ext]?[hash]',
				        publicPath: '../../',
				    }
				}
			]
		},
		{
			test: /\.css$/,
			use: getCssRule(),
		},
		{
			test: /\.scss$/,
			use: getScssRule(),
		}
	]
}

const conf = {
	context: confGeneral.context,
	entry: confGeneral.entry,
	devtool: confGeneral.devtool,
	mode: confGeneral.mode,
	output: confOutput,
	module: confModule,
	resolve: confResolve,
	plugins: confPlugins,
	optimization: confOptimization,
	devServer: confDevServer
}

module.exports = conf