'use strict';
import './index.less';
import util from 'utils/util.js';

const page = {
    init : function(){
        // this.onLoad();
        this.bindEvent();
    },
    onLoad : function(){
        util.ajax({
            url: '/product/getproductlistall',
        });
    },
    bindEvent : function(){
        const _this = this;
        let loading = false;
        $(document.body).infinite().on("infinite", function () {
            if (loading) return;
            // loading = true;
            // setTimeout(function () {
            //     $("#list").append("<p>我是加载之后的内容我是加载之后的内容我是加载之后的内容我是加载之后的内容我是加载之后的内容我是加载之后的内容我是加载之后的内容我是加载之后的内容我是加载之后的内容我是加载之后的内容我是加载之后的内容我是加载之后的内容我是加载之后的内容</p>");
            //     loading = false;
            // }, 2000);
        });
        $("#showDate").datetimePicker({
            
        });
    },
};

$(function(){
    page.init();
});
