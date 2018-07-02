'use strict';

require('./index.less');
var util     = require('utils/util.js');
var _service = require('service/service.js');

// 通用页面头部
var header = {
    init : function(){
        this.bindEvent();
        this.loadUserInfo();
    },
    bindEvent : function(){
        
    },
    // 加载用户信息
    loadUserInfo : function(){
        _service.checkLogin(function(res, msg){
            util.sucTip()
        }, function(err){
            // util.errTip(err)
        });
    }
};

header.init();