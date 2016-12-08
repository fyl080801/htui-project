/**
 * Created by fyl08 on 2016/12/1.
 */
define([
    'require',
    'application',
    'exform',
    'exfield',
    'exdatagrid',
    'extreeview'
], function (require, application) {
    'use strict';

    var terminalTypes = {
        '1': '壁挂',
        '2': '立式',
        '3': '电视',
        '4': '查询机'
    };

    application.controller('notify', ['$scope', '$rootScope', '$state', '$modal', 'notifyService', 'modalComponent',
        function ($scope, $rootScope, $state, $modal, notifyService, modalComponent) {
            $scope.$stores.Columns = [{
                type: 'data',
                name: 'Title',
                header: '标题',
                handlers: {
                    mouseover: function (ev, scope, data) {
                        popupContent(ev, scope, data);
                    },
                    mouseleave: function (ev, scope, data) {
                        hideContent(ev);
                    }
                }
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
                type: 'command',
                header: '操作',
                commands: [{
                    icon: 'glyphicon-asterisk',
                    tooltip: '发布到组',
                    authorize: '/ProgramPublish/Notification/PublishGroups',
                    handler: function (e, record) {
                        $modal.open({
                            templateUrl: 'views/notify/PublishGroups.html',
                            scope: $rootScope.$new()
                        }).result.then(function (result) {
                            if (!result)return;
                            notifyService.publishToGroups(record.Id, result.id)
                                .then(function () {
                                    modalComponent.infomation();
                                });
                        });
                    }
                }, {
                    icon: 'glyphicon-facetime-video',
                    tooltip: '发布到终端',
                    authorize: '/ProgramPublish/Notification/PublishGroups',
                    handler: function (e, record) {
                        $modal.open({
                            templateUrl: 'views/notify/PublishTerminals.html',
                            scope: $rootScope.$new(),
                            size: 'lg'
                        }).result.then(function (result) {
                            if (!result)return;
                            var terminals = [];
                            $.each(result, function (i, item) {
                                terminals.push(i);
                            });
                            notifyService.publishToTerminals(record.Id, terminals)
                                .then(function () {
                                    modalComponent.infomation();
                                });
                        });
                    }
                }, {
                    icon: 'glyphicon-pencil',
                    tooltip: '编辑',
                    authorize: '/ProgramPublish/Notification/Save',
                    handler: function (e, record) {
                        $state.go('main.notify_edit', {id: record.Id});
                    }
                }, {
                    icon: 'glyphicon-trash',
                    tooltip: '删除',
                    style: 'danger',
                    authorize: '/ProgramPublish/Notification/Delete',
                    handler: function (e, record) {
                        modalComponent.confirm('是否删除？')
                            .then(function () {
                                notifyService.drop(record.Id)
                                    .then(function () {
                                        e.handlers.Load();
                                    });
                            });
                    }
                }]
            }];

            var popupContent = function (ev, scope, data) {
                var content = data.Content ? data.Content.toString().replace(/[\r\n]/g, '<br/>') : data.Content;
                $(ev.target).popover({
                    container: 'body',
                    html: true,
                    content: content
                });
                $(ev.target).popover('show');
            };

            var hideContent = function (ev) {
                $(ev.target).popover('destroy');
            };
        }
    ]).controller('pubilshGroups', ['$scope', 'groupService',
        function ($scope, groupService) {
            $scope.$data.Selection = {};

            $scope.$handlers.Selected = function () {

            };

            groupService.all()
                .then(function (data) {
                    $scope.$stores.Datasource = data;
                });
        }
    ]).controller('pubilshTerminals', ['$scope',
        function ($scope) {
            $scope.$stores.Selected = {};

            $scope.$stores.SubColumns = [{
                type: 'data',
                name: 'Name',
                header: '名称'
            }, {
                type: 'data',
                name: 'TerminalCode',
                header: '代码'
            }, {
                type: 'data',
                name: 'Group[Name]',
                header: '分组'
            }, {
                type: 'data',
                name: 'TerminalType',
                header: '终端类型',
                filter: 'enums',
                filterargs: terminalTypes
            }];
        }
    ]);

    application.controller('notifyNew', ['$scope', '$state', 'notifyService',
        function ($scope, $state, notifyService) {
            $scope.$handlers.save = function () {
                notifyService.save($scope.$data)
                    .then(function () {
                        $state.go('main.notify');
                    });
            };
        }
    ]);

    application.controller('notifyEdit', ['$scope', '$state', '$stateParams', 'notifyService',
        function ($scope, $state, $stateParams, notifyService) {
            notifyService.load($stateParams.id)
                .then(function (data) {
                    $scope.$data = data;
                });

            $scope.$handlers.save = function () {
                notifyService.save($scope.$data)
                    .then(function () {
                        $state.go('main.notify');
                    });
            };
        }
    ]);
});