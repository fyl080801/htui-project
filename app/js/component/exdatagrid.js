/**
 * Created by fyl08 on 2016/11/8.
 * -------------------------------------------------
 * {
 *       type: 'data',
 *       name: 'UpdateTime',
 *       header: '更新时间',
 *       filter: 'date',
 *       filterargs: 'yyyy-MM-dd'
 * }
 *--------------------------------------------------
 * {
 *      type: 'command',
 *      header: '操作',
 *      commands: [{
 *          icon: 'glyphicon-eye-open',
 *          handler: function (e, record) {
 *              $state.go('main.programdetails', {id: record.Id});
 *          }
 *      }, {
 *          icon: 'glyphicon-pencil',
 *          handler: function (e, record) {
 *              $state.go('main.programedit', {id: record.Id});
 *          }
 *      }, {
 *          icon: 'glyphicon-remove',
 *          style: 'danger',
 *          handler: function (e, record) {
 *              programService.drop(record.Id)
 *                  .success(function () {
 *                      e.handlers.Load();
 *                  });
 *          }
 *      }]
 * }
 *
 */
define([
    'require',
    'application'
], function (require, application) {
    'use strict';

    document.createElement('ex-datagrid');

    var scopes = {};

    var attribute = {
        restrict: 'AE',
        replace: true
    };

    var containerAttribute = {
        transclude: true
    };

    application.directive('exDatagrid', ['$compile', '$http', '$q',
        function ($compile, $http, $q) {
            var _scope = $.extend({
                url: '@',
                autoload: '@',
                columnSource: '=',
                selection: '@',
                pagging: '@',
                datakey: '@',
                extraparams: '=',
                exChecks: '='
            }, scopes);

            var _link = function ($scope, $element, $attrs, $ctrl) {

            };

            var _controller = function ($scope, $element, $attrs) {
                $scope.stores = {};
                $scope.data = {};
                $scope.handlers = {};

                // 数据
                $scope.data.SearchText = '';
                $scope.data.PageSize = '10';
                $scope.data.PageIndex = 1;
                $scope.data.Sorts = {};
                $scope.data.Total = 0;
                $scope.data.From = 0;
                $scope.data.To = 0;
                $scope.data.CheckedAll = false;

                // 数据源
                $scope.stores.PageSizes = ['10', '25', '50'];
                $scope.stores.DataSource = [];
                $scope.stores.Checks = {};

                var gridscope = {
                    data: $scope.data,
                    stores: $scope.stores,
                    handlers: $scope.handlers
                };

                // 默认值
                //$scope.datakey = $scope.datakey ? $scope.datakey : 'Id';
                //$scope.exChecks = $scope.exChecks ? $scope.exChecks : {};

                $scope.handlers.getDataKey = function (data) {
                    return data[$scope.datakey ? $scope.datakey : 'Id'];
                };
                $scope.handlers.getSortField = function (column) {
                    return column.sortfield ? column.sortfield : column.name;
                };

                // 行为
                $scope.handlers.SelectAll = function (e) {
                    $.each($scope.stores.DataSource, function (index, data) {
                        var datakey = $scope.handlers.getDataKey(data);
                        if ($scope.data.CheckedAll) {
                            $scope.exChecks[datakey] = true;
                        } else {
                            $scope.exChecks[datakey] = false;
                            delete $scope.exChecks[datakey];
                        }
                    });
                };
                $scope.handlers.InternalSelected = function (e, data) {
                    var datakey = $scope.handlers.getDataKey(data);
                    var checked = $scope.exChecks[datakey];
                    if (checked === false)
                        delete $scope.exChecks[datakey];
                };
                $scope.handlers.getRowData = function (data, name) {
                    name = name.replace(']', '');
                    var names = name.split('[');
                    var val = data, temp = null;
                    for (var i = 0; i < names.length; i++) {
                        temp = val;
                        val = temp[names[i]];
                    }
                    return val;
                };
                $scope.handlers.PageChanged = function () {
                    $scope.handlers.Load();
                };
                $scope.handlers.ChangeDataSize = function (size) {
                    $scope.data.PageSize = size;
                    $scope.data.PageIndex = 1;
                    $scope.handlers.Load();
                };
                $scope.handlers.ChangeSort = function (column) {
                    if (!$scope.data.Sorts[column]) {
                        $scope.data.Sorts = {};
                        $scope.data.Sorts[column] = 'asc';
                    }
                    if ($scope.data.Sorts[column] === 'asc') {
                        $scope.data.Sorts[column] = 'desc'
                    } else {
                        $scope.data.Sorts[column] = 'asc';
                    }
                    $scope.handlers.Load();
                };
                $scope.handlers.Load = function () {
                    var defered = $q.defer();
                    var queryObject = {
                        searchPhrase: ($scope.data.SearchText ? $scope.data.SearchText : ''),
                        rowCount: $scope.data.PageSize,
                        current: $scope.data.PageIndex
                    };
                    if ($scope.data.Sorts) {
                        queryObject.sort = {};
                        $.each($scope.data.Sorts, function (index, item) {
                            queryObject.sort[index] = item;
                        });
                    }
                    if ($scope.extraparams) {
                        queryObject = $.extend(queryObject, $scope.extraparams);
                    }
                    $http.post($scope.url, queryObject, {serverRequest: true})
                        .success(function (response) {
                            $scope.stores.DataSource = response.data;
                            $scope.data.Total = response.total;
                            $scope.data.To = $scope.data.PageSize * $scope.data.PageIndex;
                            $scope.data.From = $scope.data.To - $scope.data.PageSize + 1;
                            $scope.data.To = $scope.data.To > $scope.data.Total ? $scope.data.Total : $scope.data.To;
                            $scope.data.From = $scope.data.From > 0 ? $scope.data.From : 1;
                            defered.resolve(response);
                            $scope.$emit('gridloaded', {gridscope: gridscope, data: $scope.stores.DataSource});
                        })
                        .error(function () {
                            defered.reject();
                        });
                    return defered.promise;
                };

                if ($scope.autoload)
                    $scope.handlers.Load();

                $scope.$emit('gridready', gridscope);
            };

            return $.extend({
                scope: _scope,
                link: _link,
                controller: ['$scope', '$element', '$attrs', _controller],
                templateUrl: 'templates/datagrid/Grid.html'
            }, attribute, containerAttribute);
        }
    ]);

    application.filter('exCommandAuth', ['$appEnvironment',
        function ($appEnvironment) {
            return function (input) {
                var filteredCommands = [];
                $.each(input, function (index, command) {
                    var isPermission = false;
                    if (command.authorize) {
                        $.each($appEnvironment.session.Permissions, function (i, data) {
                            if (data === command.authorize) {
                                isPermission = true;
                                return false;
                            }
                        });
                    } else {
                        isPermission = true;
                    }
                    if (isPermission)
                        filteredCommands.push(command);
                });
                return filteredCommands;
            };
        }
    ]);

    application.filter('exConverter', ['$filter',
        function ($filter) {
            return function (input, filter, args) {
                if (filter) {
                    var f = $filter(filter);
                    if (f) {
                        return f(input, args);
                    }
                }
                return input;
            };
        }
    ]);

    application.filter('booleanText', function () {
        return function (input, def) {
            if (input === true || input === false) {
                if ($.isArray(def) && def.length === 2) {
                    return input ? def[0] : def[1];
                }
                return input ? '是' : '否';
            }
            return input;
        };
    });

    application.filter('enums', function () {
        return function (input, enums) {
            if (enums && (input || input >= 0)) {
                return enums[input.toString()];
            }
            return input;
        };
    });
});