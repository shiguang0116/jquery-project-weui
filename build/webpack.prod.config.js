'use strict'
const webpack           = require('webpack');
const path              = require('path');
const fs                = require('fs');
const ora               = require('ora')
const rm                = require('rimraf')
const chalk             = require('chalk')
const merge             = require('webpack-merge');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const webpackBaseConfig = require('./webpack.base.config.js');

fs.open('./build/env.js', 'w', function(err, fd) {
    const buf = 'export default "production";';
    fs.write(fd, buf, 0, buf.length, 0, function(err, written, buffer) {});
});

const webpackConfig = merge(webpackBaseConfig, {
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            // except: ['$super', '$', 'exports', 'require']    //排除关键字
        }),
        new OptimizeCSSPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {discardComments:{removeAll: true}},
            canPrint: true
        }),
    ]
})

const spinner = ora('building for production...')
spinner.start()

// 打包
rm(path.resolve(__dirname, '../dist/*'), err => {
    if (err) throw err
    webpack(webpackConfig, (err, stats) => {
        spinner.stop()
        if (err) throw err
        process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }) + '\n\n')

        if (stats.hasErrors()) {
            console.log(chalk.red('  Build failed with errors.\n'))
            process.exit(1)
        }

        console.log(chalk.cyan('  Build complete.\n'))
        console.log(chalk.yellow(
            '  Tip: built files are meant to be served over an HTTP server.\n' +
            '  Opening index.html over file:// won\'t work.\n'
        ))
    })
})

module.exports = webpackConfig