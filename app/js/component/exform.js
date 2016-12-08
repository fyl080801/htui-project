/**
 * Created by fyl08 on 2016/11/4.
 */
define([
    'require',
    'application',
    'clockpicker'
], function (require, application) {
    'use strict';

    document.createElement('ex-form');
    document.createElement('ex-actions');
    document.createElement('ex-row');
    document.createElement('ex-column');
    document.createElement('ex-group');
    document.createElement('ex-action');
    document.createElement('ex-link');
    document.createElement('ex-sp');

    var attribute = {
        restrict: 'AE',
        replace: true
    };

    var containerAttribute = {
        transclude: true
    };

    var scopes = {};

    var actionScopes = {
        exText: '@',
        exIcon: '@',
        exAuthorize: '@'
    };

    application.directive('exForm', function () {
        var _scope = $.extend({}, scopes);

        return $.extend({
            scope: _scope,
            template: '<form role="form" class="form-horizontal" ng-transclude></form>'
        }, attribute, containerAttribute);
    });

    // 行为按钮容器
    application.directive('exActions', function () {
        var _scope = $.extend({}, scopes);

        return $.extend({
            scope: _scope,
            template: '<div class="row well" ng-transclude></div>'
        }, attribute, containerAttribute);
    });

    // 行
    application.directive('exRow', function () {
        var _scope = $.extend({}, scopes);

        return $.extend({
            scope: _scope,
            template: '<div class="row" ng-transclude></div>'
        }, attribute, containerAttribute);
    });

    // 列
    application.directive('exColumn', function () {
        var _scope = $.extend({
            exFlex: '@'
        }, scopes);

        return $.extend({
            scope: _scope,
            template: '<div class="col-md-{{exFlex?exFlex:12}}" ng-transclude></div>'
        }, attribute, containerAttribute);
    });

    application.directive('exGroup', function () {
        var _scope = $.extend({
            exTitle: '=',
            exIcon: '@'
        }, scopes);

        return $.extend({
            scope: _scope,
            templateUrl: 'templates/form/Group.html'
        }, attribute, containerAttribute);
    });

    application.directive('exAction', ['$appEnvironment', '$timeout',
        function ($appEnvironment, $timeout) {
            var _scope = $.extend({}, scopes, actionScopes);

            var _link = function ($scope, $element, $attrs, $ctrl) {
                if ($attrs.exAuthorize && $appEnvironment.session) {
                    var isPermission = false;
                    $.each($appEnvironment.session.Permissions, function (index, data) {
                        if (data === $attrs.exAuthorize) {
                            isPermission = true;
                            return false;
                        }
                    });
                    if (!isPermission) {
                        $element.hide();
                    }
                }
            };

            return $.extend({
                scope: _scope,
                template: '<button type="button" class="btn btn-default">' +
                '   <i ng-if="exIcon" class="glyphicon {{exIcon}}"></i>&nbsp;{{exText}}' +
                '</button>',
                link: _link
            }, attribute);
        }
    ]);

    application.directive('exLink', ['$appEnvironment',
        function ($appEnvironment) {
            var _scope = $.extend({}, scopes, actionScopes);

            var _link = function ($scope, $element, $attrs, $ctrl) {
                if ($attrs.exAuthorize && $appEnvironment.session) {
                    var isPermission = false;
                    $.each($appEnvironment.session.Permissions, function (index, data) {
                        if (data === $attrs.exAuthorize) {
                            isPermission = true;
                            return false;
                        }
                    });
                    if (!isPermission) {
                        $element.hide();
                    }
                }
            };
            return $.extend({
                scope: _scope,
                template: '<a class="btn btn-default">' +
                '   <i ng-if="exIcon" class="glyphicon {{exIcon}}"></i>&nbsp;{{exText}}' +
                '</a>',
                link: _link
            }, attribute);
        }
    ]);

    application.directive('exSp', function () {
        var _scope = $.extend({}, scopes);
        return $.extend({
            scope: _scope,
            template: '<i><!--[if lte IE 8]>&nbsp;<![endif]--></i>'
        }, attribute);
    });
});