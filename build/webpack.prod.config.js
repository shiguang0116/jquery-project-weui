'use strict';
const webpack               = require('webpack');
const path                  = require('path');
const fs                    = require('fs');
const CleanWebpackPlugin    = require('clean-webpack-plugin');
const merge                 = require('webpack-merge');
const webpackBaseConfig     = require('./webpack.base.config.js');

fs.open('./build/env.js', 'w', function(err, fd) {
    const buf = 'export default "build";';
    fs.write(fd, buf, 0, buf.length, 0, function(err, written, buffer) {});
});

const webpackConfig = merge(webpackBaseConfig, {
    plugins: [
        new CleanWebpackPlugin(['dist/*'], {
            root: path.resolve(__dirname, '../')
        })
    ]
});

module.exports = webpackConfig;