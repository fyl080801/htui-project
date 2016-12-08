/**
 * Created by fyl08 on 2016/11/21.
 */
define([
    'require',
    'application',
    'exmodal',
    'exform',
    'exdatagrid',
    'exfield'
], function (require, application) {
    'use strict';

    application.controller('groups', ['$scope', '$state', '$rootScope', '$modal', 'modalComponent', 'groupService',
        function ($scope, $state, $rootScope, $modal, modalComponent, groupService) {
            $scope.stores = {};
            $scope.data = {};
            $scope.handlers = {};

            $scope.data.groups = [];

            $scope.$on('gridready', function (scope) {
                if ($scope.data.groups.length > 0) {
                    $scope.data.groups[$scope.data.groups.length - 1].gridscope = scope.targetScope;
                }
            });

            $scope.data.Columns = [{
                name: 'Name',
                type: 'data',
                header: '名称'
            }, {
                type: 'command',
                header: '操作',
                commands: [{
                    icon: 'glyphicon-pencil',
                    tooltip: '编辑',
                    handler: function (e, data) {
                        var scope = $rootScope.$new();
                        scope.data = {Name: data.Name};
                        $modal.open({
                            templateUrl: 'views/group/Form.html',
                            scope: scope
                        }).result.then(function (result) {
                            if (!result)return;
                            groupService.save({
                                Id: data.Id,
                                Name: result.Name,
                                ParentId: data.ParentId ? data.ParentId : null
                            }).success(function () {
                                if ($scope.data.groups.length > 0)
                                    $scope.data.groups[$scope.data.groups.length - 1].gridscope.handlers.Load();
                                else
                                    $state.reload('main.group');
                            });
                        });
                    }
                }, {
                    icon: 'glyphicon-tree-conifer',
                    tooltip: '进入下级',
                    handler: function (e, data) {
                        $scope.data.groups.push({
                            Name: data.Name,
                            Id: data.Id,
                            active: true
                        });
                    }
                }, {
                    icon: 'glyphicon-film',
                    tooltip: '发布节目',
                    authorize: '/ProgramPublish/Terminal/SetPrograms',
                    handler: function (e, data) {
                        $state.go('main.group_program', {id: data.Id});
                    }
                }, {
                    icon: 'glyphicon-remove',
                    tooltip: '删除',
                    style: 'danger',
                    handler: function (e, record) {
                        modalComponent.confirm('是否删除？')
                            .then(function () {
                                groupService.drop(record.Id)
                                    .success(function () {
                                        e.handlers.Load();
                                    });
                            });
                    }
                }]
            }];

            $scope.handlers.add = function (id) {
                var scope = $rootScope.$new();
                scope.data = {Name: ''};
                $modal.open({
                    templateUrl: 'views/group/Form.html',
                    scope: scope
                }).result.then(function (result) {
                    if (!result)return;
                    groupService.save({
                        Name: result.Name,
                        ParentId: id ? id : null
                    }).success(function () {
                        if (id)
                            $scope.data.groups[$scope.data.groups.length - 1].gridscope.handlers.Load();
                        else
                            $state.reload();
                    });
                });
            };

            $scope.handlers.selectGroup = function (id) {
                if (id) {
                    for (var i = $scope.data.groups.length - 1; i >= 0; i--) {
                        if ($scope.data.groups[i].Id === id)
                            break;
                        if ($scope.data.groups[i].Id !== id) {
                            $scope.data.groups.pop();
                        }
                    }
                }
                else {
                    $scope.data.groups = [];
                }
            };
        }
    ]).controller('groupForm', ['$scope',
        function ($scope) {
            // $scope.stores = {};
            // $scope.data = {};
            // $scope.handlers = {};
        }
    ]);

    application.controller('groupProgram', ['$scope', '$state', '$stateParams', 'httpService',
        function ($scope, $state, $stateParams, httpService) {
            $scope.$data.Columns = [{
                type: 'data',
                name: 'Name',
                header: '节目名称'
            }, {
                type: 'data',
                name: 'StartTime',
                header: '开始时间',
                filter: 'date',
                filterargs: 'HH:mm'
            }, {
                type: 'data',
                name: 'EndTime',
                header: '结束时间',
                filter: 'date',
                filterargs: 'HH:mm'
            }, {
                type: 'data',
                name: 'UpdateTime',
                header: '更新时间',
                filter: 'date',
                filterargs: 'yyyy-MM-dd'
            }, {
                type: 'command',
                header: '操作',
                commands: [{
                    icon: 'glyphicon-eye-open',
                    handler: function (e, record) {
                        $state.go('main.program_details', {id: record.Id});
                    }
                }]
            }];

            $scope.$stores.selected = {};

            $scope.$handlers.submit = function () {
                var selPrograms = [];
                $.each($scope.$stores.selected, function (index, data) {
                    if (data)
                        selPrograms.push({
                            Id: index,
                            Name: '节目'
                        });
                });
                httpService.post('/ProgramPublish/Group/SetPrograms/' + $stateParams.id, selPrograms)
                    .then(function () {

                    });
            };
        }
    ]);
});