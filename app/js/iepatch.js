define([
    'require'
], function (require) {
    'use strict';

    if (document.getElementsByTagName('html')[0].className.indexOf('lte-ie8') != -1) {
        require(['es5-shim', 'es5-sham', 'html5shiv', 'respond']);

        // if (!Array.prototype.indexOf) {
        //     Array.prototype.indexOf = function (elt /*, from*/) {
        //         var len = this.length >>> 0;
        //
        //         var from = Number(arguments[1]) || 0;
        //         from = (from < 0)
        //             ? Math.ceil(from)
        //             : Math.floor(from);
        //         if (from < 0)
        //             from += len;
        //
        //         for (; from < len; from++) {
        //             if (from in this && this[from] === elt)
        //                 return from;
        //         }
        //         return -1;
        //     };
        // }
    }

    Date.prototype.Format = function (fmt) { //author: meizz   
        var o = {
            "M+": this.getMonth() + 1,                 //月份   
            "d+": this.getDate(),                    //日   
            "h+": this.getHours(),                   //小时   
            "m+": this.getMinutes(),                 //分   
            "s+": this.getSeconds(),                 //秒   
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
            "S": this.getMilliseconds()             //毫秒   
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };
});