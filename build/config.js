'use strict'
const path = require('path')

module.exports = {
	// path
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'assets',
    assetsPublicPath: '/',
    // server
    host: 'localhost', 
    port: 8000, 
    autoOpenPage: 'index/',
    proxyTable: {
        "/api": {
            target: "http://192.168.31.234",
            pathRewrite: {"^/api" : ""}     //后面是重写的新路径
        }
    },
}
