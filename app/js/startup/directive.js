/**
 * Created by fyl08 on 2016/11/3.
 */
define([
    'require',
    'application'
], function (require, application) {
    'use strict';

    // 用于列表绑定后对 UI 的回调事件
    application.directive('ngRepeated', function () {
        return {
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    eval(attr.ngRepeated);
                }
            }
        }
    });
});