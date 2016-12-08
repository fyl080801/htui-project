/**
 * Created by fyl08 on 2016/11/22.
 */
define([
    'require',
    'application',
    'exform',
    'exfield',
    'exmodal',
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

    application.controller('terminals', ['$scope', '$state', 'modalComponent', 'httpService',
        function ($scope, $state, modalComponent, httpService) {
            $scope.stores = {};
            $scope.data = {};
            $scope.handlers = {};

            $scope.data.Columns = [{
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
            }, {
                type: 'data',
                name: 'IpAddress',
                header: '设备IP'
            }, {
                type: 'command',
                header: '操作',
                commands: [{
                    icon: 'glyphicon-eye-open',
                    tooltip: '查看',
                    handler: function (e, record) {
                        $state.go('main.terminal_details', {id: record.Id});
                    }
                }, {
                    icon: 'glyphicon-pencil',
                    tooltip: '编辑',
                    handler: function (e, record) {
                        $state.go('main.terminal_edit', {id: record.Id})
                    }
                }, {
                    icon: 'glyphicon-film',
                    tooltip: '发布节目',
                    authorize: '/ProgramPublish/Terminal/SetPrograms',
                    handler: function (e, data) {
                        $state.go('main.terminal_program', {id: data.Id});
                    }
                }, {
                    icon: 'glyphicon-trash',
                    tooltip: '删除',
                    style: 'danger',
                    handler: function (e, record) {
                        modalComponent.confirm('是否移除？')
                            .then(function () {
                                httpService.get('/ProgramPublish/Terminal/Delete/' + record.Id)
                                    .then(function () {
                                        e.handlers.Load();
                                    });
                            });
                    }
                }]
            }];

            $scope.data.ExtraParams = {};
        }
    ]);

    application.controller('terminalForm', ['$scope', '$state', '$stateParams', 'httpService', 'terminalService', 'groupService',
        function ($scope, $state, $stateParams, httpService, terminalService, groupService) {
            $scope.stores = {};
            $scope.data = {};
            $scope.handlers = {};

            $scope.stores.TerminalTypes = [{
                Id: '1',
                Text: '壁挂'
            }, {
                Id: '2',
                Text: '立式'
            }, {
                Id: '3',
                Text: '电视'
            }, {
                Id: '4',
                Text: '查询机'
            }];

            $scope.handlers.save = function () {
                httpService.post('/ProgramPublish/Terminal/Save', $scope.data)
                    .then(function (data) {
                        $state.go('main.terminal_details', {id: data})
                    });
            };

            groupService.all()
                .then(function (data) {
                    $scope.stores.Groups = data;
                });

            if ($stateParams.id) {
                httpService.get('/ProgramPublish/Terminal/Load/' + $stateParams.id)
                    .then(function (data) {
                        $scope.data = data;
                    });
            }
        }
    ]);

    application.controller('terminalDetails', ['$scope', '$stateParams', 'httpService',
        function ($scope, $stateParams, httpService) {
            $scope.$data.TerminalTypes = terminalTypes;

            httpService.get('/ProgramPublish/Terminal/Load/' + $stateParams.id)
                .then(function (data) {
                    $scope.$data = data;
                });
        }
    ]);

    application.controller('terminalProgram', ['$scope', '$state', '$stateParams', 'httpService',
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
                httpService.post('/ProgramPublish/Terminal/SetPrograms/' + $stateParams.id, selPrograms)
                    .then(function () {

                    });
            };

            $scope.$on('gridloaded', function (e, scope) {
                $.each(scope.data, function (index, data) {
                    // if (data.IsMember) {
                    //     $scope.stores.selected[data.Id.toString()] = true;
                    // }
                });
            });
        }
    ]);

    application.controller('monitor', ['$scope', '$rootScope', '$state', '$stateParams', '$timeout', '$appConfig', '$modal', 'groupService', 'terminalService', 'modalComponent',
        function ($scope, $rootScope, $state, $stateParams, $timeout, $appConfig, $modal, groupService, terminalService, modalComponent) {
            $scope.$stores.Datasource = [];
            $scope.$stores.Terminals = [];
            $scope.$stores.Monitors = {};
            $scope.$stores.Details = {};

            $scope.$appConfig = $appConfig;

            $scope.$data.CurrentGroup = '';

            $scope.$handlers.Config = function (id) {
                $state.go('main.monitor_config', {id: id, group: $scope.$data.CurrentGroup});
            };

            $scope.$handlers.SetIp = function (id) {
                $modal.open({
                    templateUrl: 'views/terminal/SetIp.html',
                    scope: $rootScope.$new()
                }).result.then(function (result) {
                    terminalService.changeIp(id, result)
                        .then(function (data) {
                            $.each($scope.$stores.Terminals, function (index, item) {
                                if (item.Id === id) {
                                    item.IpAddress = data.Ip;
                                    return false;
                                }
                            });
                            modalComponent.infomation();
                        });
                });
            };

            $scope.$handlers.Startup = function (id) {
                terminalService.startup(id);
            };

            $scope.$handlers.Shutdown = function (id) {
                terminalService.shutdown(id);
            };

            $scope.$handlers.Reboot = function (id) {
                terminalService.reboot(id);
            };

            $scope.$handlers.ToDetails = function (id) {
                $scope.$stores.Details[id] = true;
            };

            $scope.$handlers.ToProgram = function (id) {
                delete $scope.$stores.Details[id];
            };

            $scope.$on('nodeSelected', function (event, node) {
                $scope.$data.CurrentGroup = node.Id;
                terminalService.list(node.Id)
                    .then(function (data) {
                        $scope.$stores.Terminals = data;
                        terminalService.getMonitor($scope.$stores.Terminals)
                            .then(function (data) {
                                bindState(data);
                            });
                    });
            });

            $scope.$on('nodeUnselected', function (event, node) {
                $scope.$data.CurrentGroup = '';
                //$scope.$stores.Terminals = [];
            });

            var doMonitor = function () {
                $timeout(function () {
                    terminalService.getMonitor($scope.$stores.Terminals)
                        .then(function (data) {
                            bindState(data);
                            if ($state.current.name === 'main.monitor')
                                doMonitor();
                        });
                }, 5000, false);
            };

            var bindState = function (data) {
                $scope.$stores.Monitors = {};
                $.each(data, function (index, item) {
                    $scope.$stores.Monitors[item.Id] = item;
                });
            };

            groupService.all()
                .then(function (data) {
                    $scope.$stores.Datasource = data;
                });

            if ($stateParams.id) {
                terminalService.list($stateParams.id)
                    .then(function (data) {
                        $scope.$stores.Terminals = data;
                    });
            }

            terminalService.getMonitor($scope.$stores.Terminals)
                .then(function (data) {
                    bindState(data);
                    doMonitor();
                });
        }
    ]).controller('terminalIp', ['$scope',
        function ($scope) {

        }
    ]);
});