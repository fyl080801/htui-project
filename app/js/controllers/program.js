/**
 * Created by fyl08 on 2016/11/8.
 */
define([
    'require',
    'application',
    'exform',
    'exfield',
    'exdatagrid'
], function (require, application) {
    'use strict';

    var programState = {
        '1': '新建立',
        '2': '审批中',
        '3': '退回',
        '4': '终止',
        '5': '通过',
        '6': '已修改'
    };

    var terminalTypes = {
        '1': '壁挂',
        '2': '立式',
        '3': '电视',
        '4': '查询机'
    };

    application.controller('programlist', ['$scope', '$state', 'programService', 'modalComponent',
        function ($scope, $state, programService, modalComponent) {
            $scope.stores = {};
            $scope.data = {};
            $scope.handlers = {};

            $scope.data.Columns = [{
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
                name: 'State',
                header: '状态',
                filter: 'enums',
                filterargs: programState
            }, {
                type: 'data',
                name: 'Enabled',
                header: '启用',
                filter: 'booleanText',
                filterargs: ['已启用', '禁用']
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
                    tooltip: '查看',
                    handler: function (e, record) {
                        $state.go('main.program_details', {id: record.Id});
                    }
                }, {
                    icon: 'glyphicon-pencil',
                    tooltip: '编辑',
                    handler: function (e, record) {
                        $state.go('main.program_edit', {id: record.Id});
                    }
                }, {
                    icon: 'glyphicon-film',
                    tooltip: '编辑素材',
                    handler: function (e, record) {
                        $state.go('main.program_resource', {id: record.Id});
                    }
                }, {
                    icon: 'glyphicon-remove',
                    tooltip: '删除',
                    style: 'danger',
                    handler: function (e, record) {
                        modalComponent.confirm('是否删除？')
                            .then(function () {
                                programService.drop(record.Id)
                                    .success(function () {
                                        e.handlers.Load();
                                    });
                            });
                    }
                }]
            }];

            $scope.handlers.details = function (id) {
                $state.go('main.program_details', {id: id});
            };

            $scope.handlers.edit = function (id) {
                $state.go('main.program_edit', {id: id});
            }
        }
    ]);

    application.controller('programnew', ['$scope', '$state', 'programService',
        function ($scope, $state, programService) {
            $scope.stores = {};
            $scope.data = {};
            $scope.handlers = {};

            $scope.stores.Weeks = {
                '1': false,
                '2': false,
                '3': false,
                '4': false,
                '5': false,
                '6': false,
                '7': false
            };

            programService.templates()
                .then(function (data) {
                    $scope.stores.Templates = data;
                });

            $scope.handlers.save = function () {
                $scope.data.Weeks = '';
                $.each($scope.stores.Weeks, function (index, item) {
                    if (item === true) {
                        $scope.data.Weeks += (index + ',');
                    }
                });
                $scope.data.Weeks = $scope.data.Weeks.length > 0 ? $scope.data.Weeks.substring(0, $scope.data.Weeks.length - 1) : '';
                programService.save($scope.data)
                    .success(function (response) {
                        $state.go('main.program_details', {id: response.data});
                    });
            };
        }
    ]);

    application.controller('programedit', ['$scope', '$state', '$stateParams', 'programService',
        function ($scope, $state, $stateParams, programService) {
            $scope.stores = {};
            $scope.data = {};
            $scope.handlers = {};

            $scope.stores.Weeks = {
                '1': false,
                '2': false,
                '3': false,
                '4': false,
                '5': false,
                '6': false,
                '7': false
            };

            programService.templates()
                .then(function (data) {
                    $scope.stores.Templates = data;
                });

            programService.list($stateParams.id)
                .success(function (response) {
                    var weeks = ',' + response.data.Weeks + ',';
                    $.each($scope.stores.Weeks, function (index, item) {
                        if (weeks.indexOf(',' + index + ',') >= 0) {
                            $scope.stores.Weeks[index] = true;
                        }
                    });
                    $scope.data = response.data;
                });

            $scope.handlers.save = function () {
                $scope.data.Weeks = '';
                $.each($scope.stores.Weeks, function (index, item) {
                    if (item === true) {
                        $scope.data.Weeks += (index + ',');
                    }
                });
                $scope.data.Weeks = $scope.data.Weeks.length > 0 ? $scope.data.Weeks.substring(0, $scope.data.Weeks.length - 1) : '';
                programService.save($scope.data)
                    .success(function (response) {
                        $state.go('main.program_details', {id: response.data});
                    });
            };
        }
    ]);

    application.controller('programdetails', ['$scope', '$rootScope', '$state', '$stateParams', '$modal', 'programService', 'modalComponent',
        function ($scope, $rootScope, $state, $stateParams, $modal, programService, modalComponent) {
            $scope.stores = {};
            $scope.data = {};
            $scope.handlers = {};

            $scope.stores.Weeks = {
                '1': false,
                '2': false,
                '3': false,
                '4': false,
                '5': false,
                '6': false,
                '7': false
            };

            $scope.handlers.toExamine = function (id) {
                modalComponent.confirm('是否送审？')
                    .then(function () {
                        programService.toExamine(id)
                            .success(function (response) {
                                $state.reload();
                            });
                    });
            };

            $scope.handlers.doExamine = function (id, state) {
                $modal.open({
                    templateUrl: 'views/program/Examine.html',
                    scope: $rootScope.$new()
                }).result.then(function (result) {
                    if (!result)return;
                    programService.doExamine({
                        Id: id,
                        State: state,
                        Comment: result.Comment
                    })
                        .success(function (response) {
                            $state.reload();
                        });
                });
            };

            programService.list($stateParams.id)
                .success(function (response) {
                    var weeks = ',' + response.data.Weeks + ',';
                    $.each($scope.stores.Weeks, function (index, item) {
                        if (weeks.indexOf(',' + index + ',') >= 0) {
                            $scope.stores.Weeks[index] = true;
                        }
                    });
                    $scope.data = response.data;
                });

        }
    ]).controller('programExamine', ['$scope',
        function ($scope) {
            $scope.stores = {};
            $scope.data = {};
            $scope.handlers = {};
        }
    ]);

    application.controller('examines', ['$scope', '$state',
        function ($scope, $state) {
            $scope.stores = {};
            $scope.data = {};
            $scope.handlers = {};

            $scope.data.Columns = [{
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
                name: 'Enabled',
                header: '启用',
                filter: 'booleanText',
                filterargs: ['已启用', '禁用']
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
                    tooltip: '查看',
                    //authorize: 'aaaaaaaaa',
                    handler: function (e, record) {
                        $state.go('main.examines_details', {id: record.Id});
                    }
                }]
            }];
        }
    ]);

    application.controller('examineRecord', ['$scope', '$state', '$stateParams',
        function ($scope, $state, $stateParams) {
            $scope.stores = {};
            $scope.data = {};
            $scope.handlers = {};

            $scope.data.Columns = [{
                type: 'data',
                name: 'ExamineTime',
                header: '审核时间',
                filter: 'date',
                filterargs: 'yyyy-MM-dd'
            }, {
                type: 'data',
                name: 'User[PersonalName]',
                sortfield: 'User[LastName]',
                header: '审核人'
            }, {
                type: 'data',
                name: 'State',
                header: '结果'
            }, {
                type: 'data',
                name: 'Remark',
                header: '备注'
            }];
        }
    ]);

    application.controller('publish', ['$scope', '$state', 'groupService',
        function ($scope, $state, groupService) {
            $scope.$data.Columns = [{
                type: 'data',
                name: 'Name',
                header: '名称'
            }, {
                type: 'data',
                name: 'TerminalCode',
                header: '代码'
            }, {
                type: 'data',
                name: 'GroupName',
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
                        $state.go('main.publish_terminal_details', {id: record.Id});
                    }
                }]
            }];

            groupService.all()
                .then(function (data) {
                    $scope.$stores.Groups = data;
                });
        }
    ]);
});