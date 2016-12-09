/**
 * Created by fyl08 on 2016/11/3.
 */
define([
    'require',
    'application',
    'exform',
    'exfield',
    'exdatagrid'
], function (require, application) {
    'use strict';

    application.controller('users', ['$scope', '$rootScope', '$state', '$modal', 'modalComponent', 'userService', 'accountService',
        function ($scope, $rootScope, $state, $modal, modalComponent, userService, accountService) {
            $scope.stores = {};
            $scope.data = {};
            $scope.handlers = {};

            $scope.data.Columns = [{
                name: 'Username',
                type: 'data',
                header: '用户名'
            }, {
                name: 'PersonalName',
                type: 'data',
                header: '姓名'
            }, {
                type: 'command',
                header: '操作',
                commands: [{
                    icon: 'glyphicon-eye-open',
                    tooltip: '查看',
                    handler: function (e, data) {
                        $state.go('main.user_details', {id: data.Id});
                    }
                }, {
                    icon: 'glyphicon-lock',
                    tooltip: '重置密码',
                    handler: function (e, data) {
                        $modal.open({
                            templateUrl: 'views/account/SetPassword.html',
                            scope: $rootScope.$new()
                        }).result.then(function (result) {
                            accountService.setPassword(data.Id, result.Password)
                                .then(function () {
                                    modalComponent.infomation();
                                });
                        });
                    }
                }, {
                    icon: 'glyphicon-pencil',
                    tooltip: '编辑',
                    authorize: '/User/Save',
                    handler: function (e, data) {
                        $state.go('main.user_edit', {id: data.Id});
                    }
                }, {
                    icon: 'glyphicon-remove',
                    tooltip: '删除',
                    authorize: '/User/Delete',
                    style: 'danger',
                    handler: function (e, data) {
                        modalComponent.confirm('是否移除？')
                            .then(function () {
                                userService.drop(data.Id)
                                    .success(function () {
                                        e.handlers.Load();
                                    });
                            });
                    }
                }]
            }];
        }
    ]).controller('setPassword', ['$scope',
        function ($scope) {
            $scope.$data = {};
        }
    ]);

    application.controller('usernew', ['$scope', '$state', 'userService', 'groupService',
        function ($scope, $state, userService, groupService) {
            $scope.data = {};
            $scope.save = function () {
                userService.save($scope.data)
                    .success(function (response) {
                        $state.go('main.user_details', {id: response.data})
                    });
            };

            groupService.all()
                .then(function (data) {
                    $scope.stores.Groups = data;
                });
        }
    ]);

    application.controller('userdetails', ['$scope', '$state', '$stateParams', 'userService',
        function ($scope, $state, $stateParams, userService) {
            userService.load($stateParams.id)
                .success(function (response) {
                    $scope.data = response.data;
                });
        }
    ]);

    application.controller('useredit', ['$scope', '$state', '$stateParams', 'userService', 'groupService',
        function ($scope, $state, $stateParams, userService, groupService) {

            $scope.save = function () {
                userService.save($scope.data)
                    .success(function (response) {
                        $state.go('main.user_details', {id: response.data});
                    });
            };
            groupService.all()
                .then(function (data) {
                    $scope.stores.Groups = data;
                    userService.load($stateParams.id)
                        .success(function (response) {
                            $scope.data = response.data;
                        });
                });
        }
    ]);

    // role
    application.controller('roles', ['$scope', '$state', '$stateParams', 'modalComponent', 'roleService',
        function ($scope, $state, $stateParams, modalComponent, roleService) {
            $scope.stores = {};
            $scope.data = {};
            $scope.handlers = {};

            $scope.data.Columns = [{
                name: 'Name',
                type: 'data',
                header: '角色名'
            }, {
                type: 'command',
                header: '操作',
                commands: [{
                    icon: 'glyphicon-eye-open',
                    tooltip: '查看',
                    handler: function (e, data) {
                        $state.go('main.role_details', {id: data.Id});
                    }
                }, {
                    icon: 'glyphicon-pencil',
                    tooltip: '编辑',
                    authorize: '/Role/Save',
                    handler: function (e, data) {
                        $state.go('main.role_edit', {id: data.Id});
                    }
                }, {
                    icon: 'glyphicon-remove',
                    tooltip: '删除',
                    authorize: '/Role/Delete',
                    style: 'danger',
                    handler: function (e, data) {
                        modalComponent.confirm('是否移除？')
                            .then(function () {
                                roleService.drop(data.Id)
                                    .success(function () {
                                        e.handlers.Load();
                                    });
                            });
                        // .ok(function () {
                        //
                        // });
                    }
                }]
            }];
        }
    ]);

    application.controller('rolenew', ['$scope', '$state', 'roleService',
        function ($scope, $state, roleService) {
            $scope.data = {};
            $scope.save = function () {
                roleService.save($scope.data)
                    .success(function (response) {
                        $state.go('main.role_details', {id: response.data});
                    });
            };
        }
    ]);

    application.controller('roledetails', ['$scope', '$stateParams', 'roleService',
        function ($scope, $stateParams, roleService) {
            roleService.load($stateParams.id)
                .success(function (response) {
                    $scope.data = response.data;
                });
        }
    ]);

    application.controller('roleedit', ['$scope', '$state', '$stateParams', 'roleService',
        function ($scope, $state, $stateParams, roleService) {
            roleService.load($stateParams.id)
                .success(function (response) {
                    $scope.data = response.data;
                });
            $scope.save = function () {
                roleService.save($scope.data)
                    .success(function (response) {
                        $state.go('main.role_details', {id: response.data});
                    });
            };
        }
    ]);

    application.controller('roleauth', ['$scope', '$state', '$stateParams', 'roleService',
        function ($scope, $state, $stateParams, roleService) {
            $scope.stores = {};
            $scope.data = {};
            $scope.handlers = {};

            var successCallback = function (response) {
                var groupString = ',';
                $.each(response.data, function (index, data) {
                    if (groupString.indexOf(',' + data.Group + ',') < 0) {
                        groupString += (data.Group + ',');
                    }
                });
                groupString = groupString === ',' ? '' : groupString.substring(1, groupString.length - 1);
                $scope.stores.groups = groupString.split(',');
                $scope.data.current = '';
                $scope.stores.authorizes = response.data;
            };

            $scope.handlers.changeGroup = function (group) {
                $scope.data.current = group;
            };
            $scope.handlers.save = function () {
                roleService.saveAuths($scope.stores.authorizes)
                    .success(function (response) {

                    })
            };
            $scope.handlers.changeAuth = function ($event, id) {
                var checkbox = $event.target;
                $.each($scope.stores.authorizes, function (index, data) {
                    if (data.Id === id) {
                        data.IsAuthorized = checkbox.checked;
                        return false;
                    }
                });
            };

            roleService.auths($stateParams.id)
                .success(successCallback);
        }
    ]);

    application.controller('rolemembers', ['$scope', '$state', '$stateParams', 'roleService', 'httpService', 'modalComponent',
        function ($scope, $state, $stateParams, roleService, httpService, modalComponent) {
            $scope.stores = {};
            $scope.data = {};
            $scope.handlers = {};

            $scope.stores.selected = {};

            $scope.data.Columns = [{
                name: 'UserName',
                type: 'data',
                header: '用户名'
            }, {
                name: 'PersonalName',
                type: 'data',
                header: '姓名'
            }];

            $scope.handlers.submit = function () {
                var selects = [];
                $.each($scope.stores.selected, function (index, data) {
                    selects.push({
                        Id: index,
                        IsMember: data
                    });
                });
                httpService.post('/Role/SetMembers/' + $stateParams.id, selects)
                    .then(function () {
                        modalComponent.infomation();
                    });
            };
            $scope.$on('gridloaded', function (e, scope) {
                $.each(scope.data, function (index, data) {
                    if (data.IsMember) {
                        $scope.stores.selected[data.Id.toString()] = true;
                    }
                });
            });
        }
    ]);

    application.controller('logging', ['$scope',
        function ($scope) {
            $scope.$stores.Columns = [{
                name: 'Id',
                type: 'data',
                header: 'Id',
                sortable: false
            }, {
                name: 'EventTime',
                type: 'data',
                header: '时间',
                filter: 'date',
                filterargs: 'yyyy-MM-dd HH:mm'
            }, {
                name: 'EventName',
                type: 'data',
                header: '事件名'
            }, {
                name: 'EventType',
                type: 'data',
                header: '类型',
                filter: 'enums',
                filterargs: {
                    '0': '一般消息',
                    '1': '创建',
                    '2': '删除',
                    '3': '更新',
                    '4': '特殊',
                }
            }, {
                name: 'User[PersonalName]',
                type: 'data',
                header: '操作人'
            }, {
                name: 'IpAddress',
                type: 'data',
                header: 'Ip'
            }/*, {
             type: 'command',
             header: '操作',
             commands: [{
             icon: 'glyphicon-eye-open',
             tooltip: '查看',
             handler: function (e, data) {
             //$state.go('main.role_details', {id: data.Id});
             }
             }]
             }*/];
        }
    ]);

    // 其他
    application.filter('authGroupFilter', function () {
        return function (input, current) {
            var result = [];
            $.each(input, function (index, data) {
                if (data.Group === current) {
                    result.push(data);
                }
            });
            return result;
        };
    });
});