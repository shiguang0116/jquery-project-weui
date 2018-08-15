'use strict';
import env from '../../build/env.js';

const baseurl = env === 'dev' ? '/api' : '';

// 正则表达式
const regex = {
    email: function(value){
        let re = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
        if (!re.test(value)) {
            return true;
        }
    },
    // 小数
    number: function(value){
        let re = /^[0-9]+\.?[0-9]*$/;
        if (!re.test(value)) {
            return true;
        }
    },
    // 手机号、座机
    phone: function(value){
        let re = /^1[0-9]{10}$/;
        var re2 = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
        if (!re.test(value) && !re2.test(value)) {
            return true;
        }
    }
};

const util = {
    getApiUrl : function(param){
        let apiURL  = param.apiURL || '/api',
            url     = param.url || '';
        if (env === 'dev') {
            whichAPI('/api', 'http://192.168.31.234:8081', 'http://192.168.31.234:8000');
        }else if(env === 'build'){
            whichAPI('', 'http://192.168.31.234:8081', 'http://192.168.31.234:8000');
        }else if(env === 'online'){
            whichAPI('', 'http://jishiyou.net:8083', 'http://jishiyou.net');
        }
        function whichAPI(wechat, erp, web){
            if(apiURL == '/api'){
                apiURL = wechat;
            }else if(apiURL == '/api_erp'){
                apiURL = erp;
            }else if(apiURL == '/api_web'){
                apiURL = web;
            }
        }
        // console.log(apiURL + url)
        return apiURL + url;
    },
    ajax : function(param){
        $.showLoading('加载中...');
        const _this = this;
        $.ajax({
            type        : param.method || 'POST',
            url         : util.getApiUrl({
                            apiURL: param.apiURL || '',
                            url: param.url || '',
                        }),
            data        : param.data || '',
            dataType    : param.type || 'json',
            success     : function(res){
                // $.hideLoading();
                var res = res;
                // 请求数据成功
                if(res.ReturnCode === 'success'){
                    typeof param.success === 'function' && param.success(res.ReturnData);
                }
                // 请求数据错误
                else if(res.ReturnCode === 'error'){
                    $.toptip(res.ReturnMessage, 3000);
                }
                // 没有登录状态，需要强制登录
                else if(res.status === 10){
                    util.toLogin();
                }
            },
            error       : function(err){
                // $.hideLoading();
                $.toptip(err.statusText, 3000);
                // 页面跳转
            }
        });
    },
    // 获取url参数
    getUrlParam : function(name){
        var reg     = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        var result  = window.location.search.substr(1).match(reg);
        return result ? decodeURIComponent(result[2]) : null;
    },
    // 统一登录处理
    toLogin : function(){
        window.location.href = '/index/user-login.html?redirect=' + encodeURIComponent(window.location.href);
    },
    goHome : function(){
        window.location.href = '/index/index.html';
    },
    
    /********************************************表单验证**************************************************/

    // 验证字段
    validate: function($obj){
        var $item = $obj.hasClass('validate') ? $obj : $obj.parents('.weui-cells_form').find('.validate');
        var $label = $item.find('.weui-label');
        var $inp = $item.find('.weui-input');
        var $msg = $item.find('.weui-cell__error');
        for(var i=0; i<$item.length; i++){
            var value = $inp.eq(i).val();
            // 非空验证
            if(value === ''){
                if($item.eq(i).hasClass('rule_required')){
                    var text = util.trim($label.eq(i).text(), true);
                    text = text.replace(":","");
                    text = text.replace("：","");
                    text = text.replace("*","");
                    hasError(text + '不能为空');
                }
            }
            // 手机号验证
            else if($item.eq(i).hasClass('rule_phone')){
                if (regex.phone(value)) {
                    hasError('请输入正确的手机格式');
                }else{
                    noError();
                }
            }
            // 数字验证
            else if($item.eq(i).hasClass('rule_number')) {
                var re = /^[0-9]+\.?[0-9]*$/;
                if(value <= 0){
                    hasError('输入的数字必须大于0') ;
                }else if(!re.test(value)){
                    hasError('请输入正确的数字') ;
                }else{
                    noError();
                }
            }
            else{
                noError();
            }
            function hasError(msg){
                $item.eq(i).addClass('weui-cell_warn');
                $msg.eq(i).text(msg);
                // $inp.focus();
            };
            function noError(){
                $item.eq(i).removeClass('weui-cell_warn');
                $msg.eq(i).text('');
            };
        }
        return !$item.hasClass('weui-cell_warn');
    },
    // 失去焦点验证
    validateBlur: function(){
        // $('input').blur(function(){
        //     const $item = $(this).parents('.validate');
        //     util.validate($item);
        // })
    },
    // 验证码处理
    getSMSCode: function () {
        // 验证码
        var $btn = $('.field_SMSCode .btn');
        var disabled = true;
        var time = 60;
        $('.field_Account input').on("input", function () {
            var value = $(this).val();
            if ($btn) {
                if (regex.phone(value)) {
                    $btn.hasClass('disabled') ? '' : $btn.addClass('disabled');
                } else {
                    time == 60 ? $btn.removeClass('disabled') : '';
                }
                disabled = $btn.hasClass('disabled');
            }
        });
        $btn.on('click', function () {
            if (!disabled) {
                // ajax
                
            }
        });
    },

    /********************************************字符窜**************************************************/

    // 清除空格
    trim : function(str, is_global) { //is_global为true时清楚所有空格
        var result;
        result = str.replace(/(^\s+)|(\s+$)/g, "");
        if (is_global == true) {
            result = result.replace(/\s/g, "");
        }
        return result;
    },

    /*********************************************日期*******************************************************/

    // 获取需要的时间格式
    getFormatDate : function (param){
        var time    = param.time ? new Date(param.time) : new Date(),   //已知时间
            format  = param.format || 'yyyy-MM-dd';                     //时间格式
        function tf(i){return (i < 10 ? '0' : '') + i};  
        return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){  
            switch(a){  
                case 'yyyy':  
                    return tf(time.getFullYear());
                    break;  
                case 'MM':  
                    return tf(time.getMonth() + 1);  
                    break;  
                case 'mm':  
                    return tf(time.getMinutes());
                    break;  
                case 'dd':  
                    return tf(time.getDate());  
                    break;  
                case 'HH':  
                    return tf(time.getHours());  
                    break;  
                case 'ss':  
                    return tf(time.getSeconds());  
                    break;  
            }  
        })  
    },
    // 获取几月前后的日期
    getOtherMonth : function (param){
        var format  = param.format || 'yyyy-MM-dd',         //时间格式: ''
            MM      = !isNaN(param.MM) ? param.MM : -1,     //前后几月: number
            time    = new Date();
        // 判断有没有‘日’
        var dd = format.indexOf('dd') > -1 ? time.getDate() : '1' ;
        time.setMonth(time.getMonth()+MM, dd);
        var result = util.getFormatDate({time: time, format:format});
        return result;
    },
    // 获取前后几天的日期
    getOtherDay : function (param){
        var time    = param.time ? new Date(param.time) : new Date(),   //已知时间
            format  = param.format || 'yyyy-MM-dd',                     //时间格式: ''
            dd      = !isNaN(param.dd) ? param.dd : -6;                 //前后几天: number
        var timestamp = time.getTime() + 3600 * 1000 * 24 * dd;
        var otherDay = util.getFormatDate({time: timestamp,format:format});
        return otherDay;
    },
    // 提交的value
    getDateValue: function(res,format){
        var arr = [];
        var value = '';
        var format = format || 'yyyy-MM-dd';
        res.forEach(function(item,index){
            arr.push(item.value);
        });
        value = arr.join('-');
        value = util.getFormatDate({time: value, format: format});
        return value;
    },

    // 处理页脚
    handleFooter : function(obj1,obj2,pd,h) { // obj: DOM对象  h: number
        var h = h || 0;
        var sh = document.documentElement.clientHeight; //页面对象高度（即BODY对象高度加上Margin高）
        obj1.style.minHeight = (sh - h) + 'px'; 
        obj1.style.position = 'relative'; 
        obj1.style.paddingBottom = pd + 'px'; 
        obj2.style.position = 'absolute'; 
        obj2.style.bottom = '0'; 
        obj2.style.display = 'block'; 
    },

    // 复制
    copyText : function (oInp,obj) {
        oInp.value = obj.innerText; // 修改文本框的内容
        oInp.select(); // 选中文本
        document.execCommand("copy"); // 执行浏览器复制命令
    },
};

util.validateBlur();

module.exports = util;