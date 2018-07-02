'use strict'
const webpack             = require('webpack');
const path                = require('path');
const ExtractTextPlugin   = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin   = require('html-webpack-plugin');
const CopyWebpackPlugin   = require('copy-webpack-plugin');
const util                = require('./util.js');
const config              = require('./config.js');

function resolve(_path){
    return path.resolve(__dirname, '../' + _path)
}

// 配置
const webpackBaseConfig = {
    entry: Object.assign(util.getEntries('./src/pages/**/*.js'),
        {'app' : ['@/main.js']}
    ),
    output: {
        path        : config.assetsRoot,   //存放打包后文件的输出目录 
        filename    : util.assetsPath('js/[name].js'),
        publicPath  : config.assetsPublicPath, //指定资源文件引用的目录 
    },
    externals : {
        'jquery' : 'window.jQuery'  //在编译时，看到require('jquery')，就把它替换成window.jQuery
    },
    module: {
        rules: [
            { 
                test: /\.css$/, 
                loader: ExtractTextPlugin.extract({  
                    fallback: "style-loader",  
                    use: "css-loader"  
                })
            },
            { 
                test: /\.less$/, 
                loader: ExtractTextPlugin.extract({  
                    fallback: "style-loader",  
                    use: "css-loader!less-loader"
                }) 
            },
            { 
                test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)\??.*$/, 
                loader: 'url-loader',
                options: {
                    limit: 100,
                    name: util.assetsPath('image/[name].[ext]')
                }
            },
            {
                test: /\.string$/, 
                loader: 'html-loader',
                query : {
                    minimize : true,
                    removeAttributeQuotes : false
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
        ]
    },
    // 配置路径
    resolve : {
        extensions: ['.vue', '.js', ',json'],
        alias : {
            'build'         : resolve('build'),
            '@'             : resolve('src'),
            'common'        : resolve('src/common'),
            'components'    : resolve('src/components'),
            'pages'         : resolve('src/pages'),
            'utils'         : resolve('src/utils')
        },
    },
    plugins: [
        // 独立通用模块
        new webpack.optimize.CommonsChunkPlugin({
            name : 'app',
            minChunks: 3,
        }),
        // 把css单独打包到文件里
        new ExtractTextPlugin(util.assetsPath('css/[name].css')),
        // 复制文件
        new CopyWebpackPlugin([
            {
                from: resolve('src/utils/js'),
                to: util.assetsPath('js/'),
                flatten: true,  //删除所有的目录引用，只复制文件名.
            },
            {
                from: resolve('src/utils/css/*.css'),
                to: util.assetsPath('css/'),
                flatten: true,
            },
        ],{
            // ignore: ['.*']  //忽略拷贝指定的文件
        })
    ]
};

// 配置html文件
const pages = util.getEntries('./src/pages/**/*.html')
for(let page in pages) {
    let urlType = util.urlType(page)
    let title = util.title(page)
    let baseTitle = ' - 及时油'
    let conf = {
        template    : pages[page], 
        filename    : urlType + '/' + page + '.html',
        title       : title + baseTitle,
        favicon     : './favicon.ico',
        inject      : true,
        hash        : true,
        chunks      : ['app', page],
        chunksSortNode: 'dependency'
    }
    webpackBaseConfig.plugins.push(new HtmlWebpackPlugin(conf));
}

module.exports = webpackBaseConfig;
