/**
 * Created by fyl08 on 2016/12/1.
 */
define([
    'require',
    'application',
    'bootstrap-treeview'
], function (require, application) {
    'use strict';

    document.createElement('ex-treeview');

    var attribute = {
        restrict: 'AE',
        replace: true
    };

    var scopes = {};

    application.directive('exTreeview', ['$timeout',
        function ($timeout) {
            var _scope = $.extend({
                exDisplayproperty: '@',
                exValueproperty: '@',
                exChildrenproperty: '@',
                exDatasource: '=',
                exSelection: '=',
                exSelected: '&',
                exUnselected: '&'
            }, scopes);

            var _link = function ($scope, $element, $attrs, $ctrl) {

            };

            var _controller = function ($scope, $element, $attrs) {
                $scope.$stores = {};
                $scope.$data = {};
                $scope.$handlers = {};

                $scope.$watch('exDatasource', function (newValue, oldValue, scope) {
                    if (!newValue)return;
                    buildTree(newValue);
                });

                $scope.$handlers.getDisplayproperty = function () {
                    return $scope.exDisplayproperty ? $scope.exDisplayproperty : 'Name';
                };

                $scope.$handlers.getValueproperty = function () {
                    return $scope.exValueproperty ? $scope.exValueproperty : 'Id';
                };

                $scope.$handlers.getChildrenproperty = function () {
                    return $scope.exChildrenproperty ? $scope.exChildrenproperty : 'children';
                };

                var childrenproperty = $scope.$handlers.getChildrenproperty();
                var displayproperty = $scope.$handlers.getDisplayproperty();
                var valueproperty = $scope.$handlers.getValueproperty();

                var buildTree = function (treedata) {
                    var source = [];
                    eachItem(treedata, source);
                    $element.treeview({data: source});
                    $element.on('nodeSelected', function (event, node) {
                        var selectitem = {};
                        selectitem[displayproperty] = node.text;
                        selectitem[valueproperty] = node.id;
                        $scope.$emit('nodeSelected', selectitem);
                        $timeout(function () {
                            if ($scope.exSelection !== undefined) {
                                $scope.exSelection = node;
                                $scope.$apply();
                            }
                        });
                        if ($scope.exSelected)
                            $scope.exSelected();
                    });
                    $element.on('nodeUnselected', function (event, node) {
                        $scope.$emit('nodeUnselected', node);
                        $timeout(function () {
                            if ($scope.exSelection !== undefined) {
                                $scope.exSelection = null;
                                $scope.$apply();
                            }
                        });
                        if ($scope.exUnselected)
                            $scope.exUnselected();
                    })
                };

                var eachItem = function (data, source) {
                    $.each(data, function (index, item) {
                        var node = {
                            text: item[displayproperty],
                            id: item[valueproperty],
                            state: {expanded: false}
                        };
                        if (item[childrenproperty] && item[childrenproperty].length > 0) {
                            node.nodes = [];
                            eachItem(item[childrenproperty], node.nodes);
                        }
                        source.push(node);
                    });
                };
            };

            return $.extend({
                scope: _scope,
                link: _link,
                controller: ['$scope', '$element', '$attrs', _controller],
                template: '<div></div>'
            }, attribute);
        }
    ]);
});