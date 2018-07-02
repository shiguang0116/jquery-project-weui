'use strict';
import env from 'build/env.js';
import Hogan from 'hogan.js';

const baseurl     = env === 'development' ? '/api' : '';

const util = {
    getApiUrl : function(param){
        let apiURL  = param.apiURL || '/api',
            url     = param.url || '';
        if (env === 'development') {
            if (url.indexOf('://') > -1) {
                let index = url.indexOf('/',url.indexOf('://')+3)
                url = url.substring(index)
            }
        }else{
            apiURL = ''
        }
        return apiURL + url
    },
    // 网络请求
    ajax : function(param){
        var _this = this;
        $.ajax({
            type        : param.method || 'POST',
            url         : util.getApiUrl({
                            apiURL: param.apiURL || '',
                            url: param.url || '',
                        }),
            data        : param.data || '',
            dataType    : param.type || 'json',
            success     : function(res){
                var res = res
                // 请求数据成功
                if(res.ReturnCode === 'success'){
                    typeof param.success === 'function' && param.success(res.ReturnData);
                }
                // 请求数据错误
                else if(res.ReturnCode === 'error'){
                    util.errTip(res.ReturnMessage)
                }
                // 没有登录状态，需要强制登录
                else if(res.status === 10){
                    _this.doLogin();
                }
            },
            error       : function(err){
                util.errTip(err.statusText)
            }
        });
    },
    // 获取服务器地址
    getServerUrl : function(path){
        return conf.serverHost + path;
    },
    // 获取url参数
    getUrlParam : function(name){
        var reg     = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        var result  = window.location.search.substr(1).match(reg);
        return result ? decodeURIComponent(result[2]) : null;
    },
    // 渲染html模板
    renderHtml : function(htmlTemplate, data){
        var template    = Hogan.compile(htmlTemplate),
            result      = template.render(data);
        return result;
    },
    // 统一登录处理
    doLogin : function(){
        window.location.href = '/index/user-login.html?redirect=' + encodeURIComponent(window.location.href);
    },
    // 跳回首页
    goHome : function(){
        window.location.href = '/index/index.html';
    },
    // 拆数组
    sliceArray: function(arr, num){
        var result = [];
        for(var i = 0; i<arr.length; i+=num) {
            result.push(arr.slice(i, i+num))
        }
        return result;  
    },
    // 复制
    copyText : function (oInp,obj) {
        oInp.value = obj.innerText; // 修改文本框的内容
        oInp.select(); // 选中文本
        document.execCommand("copy"); // 执行浏览器复制命令
    },
};

/********************************************表单验证**************************************************/
util.validate = function(){
    return {
        email: function(value){
            let re = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
            if (!re.test(value)) {
                return true
            }
        },
        number: function(value){
            let re = /^[0-9]+\.?[0-9]*$/;
            if (!re.test(value)) {
                return true
            }
        },
        // 联系电话
        phone: function(value){
            let re = /^1[0-9]{10}$/;
            var re2 = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
            if (!re.test(this.Phone) && !re2.test(this.Phone)) {
                return true
            }
        }
    };
};

/********************************************字符窜**************************************************/
// 清除前后空格
util.trim = function(str) { 
    return str.replace(/(^\s*)|(\s*$)/g, ""); 
};

/*********************************************日期*******************************************************/

// 获取需要的时间格式
util.getFormatDate = function (param){
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
};
// 获取上个月的日期
util.getLastMonthData =  function (){
    var now = util.getFormatDate()
    var arr = now.split('-')
    arr[1] = arr[1] - 1
    if (arr[1] == 0) {
        arr[0] = arr[0]-1
        arr[1] = 12
    }
    if (arr[1]<10) {
        arr[1] = '0' + arr[1]
    }
    var last = arr.join('-')
    return last;
}
// 获取前后几天的日期
util.getOtherDay =  function (param){
    var time    = param.time ? new Date(param.time) : new Date(),   //已知时间
        format  = param.format || 'yyyy-MM-dd',                     //时间格式: ''
        dd      = param.dd || 6;                                    //前后几天: number
    var timestamp = time.getTime() + 3600 * 1000 * 24 * dd
    var otherDay = util.getFormatDate({time: timestamp,format:format})
    return otherDay;
}

// 处理页脚
util.handleFooter = function(obj1,obj2,pd,h) { // obj: DOM对象  h: number
    var h = h || 0;
    var sh = document.documentElement.clientHeight; //页面对象高度（即BODY对象高度加上Margin高）
    obj1.style.minHeight = (sh - h) + 'px'; 
    obj1.style.position = 'relative'; 
    obj1.style.paddingBottom = pd + 'px'; 
    obj2.style.position = 'absolute'; 
    obj2.style.bottom = '0'; 
    obj2.style.display = 'block'; 
}

module.exports = util;