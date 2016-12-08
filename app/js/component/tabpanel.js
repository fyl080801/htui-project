/**
 * Created by fyl08 on 2016/11/8.
 */
define([
    'require',
    'application'
], function (require, application) {
    'use strict';

    application.directive('tabcontainer', function () {
        var scopeObj = {};

        return {
            restrict: 'AE',
            replace: true,
            transclude: true,
            scope: scopeObj,
            template: '<ul class="nav nav-tabs" role="tablist"></ul>' +
            '<div class="tab-content"></div>' +
            '<div ng-transclude></div>'
        };
    });

    application.directive('tabitem', function () {
        var scopeObj = {
            title: '@'
        };

        return {
            restrict: 'AE',
            replace: true,
            transclude: true,
            scope: scoprObj,
            template: '<li role="presentation"><a role="tab" data-toggle="tab">{{title}}</a></li>' +
            '<div role="tabpanel" class="tab-pane" ng-transclude></div>'
        };
    });
});