'use strict'
const webpack           = require('webpack');
const path              = require('path');
const fs                = require('fs');
const merge             = require('webpack-merge');
const config            = require('./config.js');
const webpackBaseConfig = require('./webpack.base.config.js');

fs.open('./build/env.js', 'w', function(err, fd) {
    const buf = 'export default "development";';
    fs.write(fd, buf, 0, buf.length, 0, function(err, written, buffer) {});
});

const webpackConfig = merge(webpackBaseConfig, {
    devServer: {
        contentBase: config.assetsRoot, //本地服务器所加载的页面所在的目录
        inline: true,
        host: config.host,
        port: config.port,
        open: true,
        openPage: config.autoOpenPage,
        proxy: config.proxyTable
    },
    plugins: [
        
    ]
});

module.exports = webpackConfig