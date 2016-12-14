define([
    'require',
    'application'
], function (require, application) {
    'use strict';

    // 注册路由
    application.config(['$stateProvider', '$urlRouterProvider', '$provide',
        function ($stateProvider, $urlRouterProvider, $provide) {
            $urlRouterProvider.otherwise('/session');

            var states = {
                'session': {
                    url: '/session',
                    templateUrl: 'views/account/Session.html',
                    controllerUrl: 'controllers/account',
                    controller: 'session'
                },

                'logout': {
                    url: '/logout',
                    templateUrl: 'views/account/Session.html',
                    controllerUrl: 'controllers/account',
                    controller: 'logout'
                },

                'login': {
                    url: '/login',
                    templateUrl: 'views/account/Login.html',
                    controllerUrl: 'controllers/account'
                },

                'main': {
                    url: '/main',
                    templateUrl: 'views/home/Main.html',
                    controllerUrl: 'controllers/home'
                },

                // manage-user
                'main.user': {
                    text: '用户管理',
                    url: '/user',
                    templateUrl: 'views/manage/UserList.html',
                    controllerUrl: 'controllers/manage',
                    controller: 'users'
                },

                'main.user_new': {
                    text: '添加',
                    url: '/user/new',
                    templateUrl: 'views/manage/UserNew.html',
                    controllerUrl: 'controllers/manage'
                },

                'main.user_details': {
                    text: '明细',
                    url: '/user/details/{id}',
                    templateUrl: 'views/manage/UserDetails.html',
                    controllerUrl: 'controllers/manage'
                },

                'main.user_edit': {
                    text: '编辑',
                    url: '/user/edit/{id}',
                    templateUrl: 'views/manage/UserEdit.html',
                    controllerUrl: 'controllers/manage'
                },

                // manage-role
                'main.role': {
                    text: '角色管理',
                    url: '/role',
                    templateUrl: 'views/manage/RoleList.html',
                    controllerUrl: 'controllers/manage'
                },

                'main.role_new': {
                    text: '添加',
                    url: '/role/new',
                    templateUrl: 'views/manage/RoleForm.html',
                    controllerUrl: 'controllers/manage',
                    controller: 'rolenew'
                },

                'main.role_details': {
                    text: '明细',
                    url: '/role/details/{id}',
                    templateUrl: 'views/manage/RoleDetails.html',
                    controllerUrl: 'controllers/manage'
                },

                'main.role_edit': {
                    text: '编辑',
                    url: '/role/edit/{id}',
                    templateUrl: 'views/manage/RoleForm.html',
                    controllerUrl: 'controllers/manage',
                    controller: 'roleedit'
                },

                'main.role_details_members': {
                    text: '角色成员',
                    url: '/role/details/members/{id}',
                    templateUrl: 'views/manage/RoleMembers.html',
                    controllerUrl: 'controllers/manage'
                },

                'main.role_details_auth': {
                    text: '权限',
                    url: '/role/details/auth/{id}',
                    templateUrl: 'views/manage/RoleAuth.html',
                    controllerUrl: 'controllers/manage'
                },

                // 日志
                'main.log': {
                    text: '操作日志',
                    url: '/log',
                    templateUrl: 'views/manage/Log.html',
                    controllerUrl: 'controllers/manage'
                },

                // program
                'main.program': {
                    text: '节目管理',
                    url: '/program',
                    templateUrl: 'views/program/List.html',
                    controllerUrl: 'controllers/program'
                },

                'main.program_new': {
                    text: '添加',
                    url: '/program/new',
                    templateUrl: 'views/program/Form.html',
                    controllerUrl: 'controllers/program',
                    controller: 'programnew'
                },

                'main.program_details': {
                    text: '明细',
                    url: '/program/details/{id}',
                    controllerUrl: 'controllers/program',
                    views: {
                        '': {templateUrl: 'views/program/Details.html'},
                        'details@main.program_details': {
                            templateUrl: 'views/program/DetailsInfo.html',
                            controllerUrl: 'controllers/resource'
                        },
                        'content@main.program_details': {templateUrl: 'views/program/Resources.html'},
                        'record@main.program_details': {templateUrl: 'views/program/ExamineRecord.html'}
                    }
                },

                'main.program_edit': {
                    text: '编辑',
                    url: '/program/edit/{id}',
                    templateUrl: 'views/program/Form.html',
                    controllerUrl: 'controllers/program',
                    controller: 'programedit'
                },

                'main.program_resource': {
                    text: '节目素材',
                    url: '/program/resource/{id}',
                    templateUrl: 'views/program/ResourceEdit.html',
                    controllerUrl: 'controllers/resource'
                },

                'main.program_resource_select': {
                    text: '选择素材',
                    url: '/program/resource/select/{id}',
                    templateUrl: 'views/program/SelectFile.html',
                    controllerUrl: 'controllers/resource'
                },

                'main.examines': {
                    text: '待审核节目',
                    url: '/examines',
                    templateUrl: 'views/program/Exmaines.html',
                    controllerUrl: 'controllers/program'
                },

                'main.examines_details': {
                    text: '明细',
                    url: '/examines/details/{id}',
                    controllerUrl: 'controllers/program',
                    views: {
                        '': {templateUrl: 'views/program/Details.html'},
                        'details@main.examines_details': {
                            templateUrl: 'views/program/DetailsInfo.html',
                            controllerUrl: 'controllers/resource'
                        },
                        'content@main.examines_details': {templateUrl: 'views/program/Resources.html'},
                        'record@main.examines_details': {templateUrl: 'views/program/ExamineRecord.html'}
                    }
                },
                'main.notify': {
                    text: '发布通知',
                    url: '/notify',
                    templateUrl: 'views/notify/List.html',
                    controllerUrl: 'controllers/notify'
                },

                'main.notify_new': {
                    text: '新建',
                    url: '/notify/new',
                    templateUrl: 'views/notify/Form.html',
                    controllerUrl: 'controllers/notify',
                    controller: 'notifyNew'
                },

                'main.notify_edit': {
                    text: '编辑',
                    url: '/notify/edit/{id}',
                    templateUrl: 'views/notify/Form.html',
                    controllerUrl: 'controllers/notify',
                    controller: 'notifyEdit'
                },

                // 素材
                'main.resource': {
                    text: '素材管理',
                    url: '/resource',
                    templateUrl: 'views/resource/List.html',
                    controllerUrl: 'controllers/resource'
                },

                'main.resource_upload': {
                    text: '上传',
                    url: '/resource/upload',
                    templateUrl: 'views/resource/Upload.html',
                    controllerUrl: 'controllers/resource'
                },

                //终端
                'main.group': {
                    text: '设备分组',
                    url: '/groups',
                    templateUrl: 'views/group/List.html',
                    controllerUrl: 'controllers/group'
                },
                'main.group_program': {
                    text: '批量设置节目',
                    url: '/groups/program/{id}',
                    templateUrl: 'views/group/Program.html',
                    controllerUrl: 'controllers/group'
                },
                'main.terminals': {
                    text: '设备列表',
                    url: '/terminal',
                    templateUrl: 'views/terminal/List.html',
                    controllerUrl: 'controllers/terminal'
                },
                'main.terminal_new': {
                    text: '添加',
                    url: '/terminal/new',
                    templateUrl: 'views/terminal/Form.html',
                    controllerUrl: 'controllers/terminal',
                    controller: 'terminalForm'
                },
                'main.terminal_edit': {
                    text: '编辑',
                    url: '/terminal/edit/{id}',
                    templateUrl: 'views/terminal/Form.html',
                    controllerUrl: 'controllers/terminal',
                    controller: 'terminalForm'
                },
                'main.terminal_details': {
                    text: '明细',
                    url: '/terminal/details/{id}',
                    templateUrl: 'views/terminal/Details.html',
                    controllerUrl: 'controllers/terminal'
                },
                'main.terminal_program': {
                    text: '发布节目',
                    url: '/terminal/program/{id}',
                    templateUrl: 'views/terminal/Program.html',
                    controllerUrl: 'controllers/terminal'
                },
                'main.monitor': {
                    text: '监控',
                    url: '/monitor/{id}',
                    templateUrl: 'views/terminal/Monitor.html',
                    controllerUrl: 'controllers/terminal'
                },
                'main.monitor_config': {
                    text: '设置',
                    url: '/monitor/{group}/config/{id}',
                    templateUrl: 'views/terminal/Form.html',
                    controllerUrl: 'controllers/terminal',
                    controller: 'terminalForm'
                }
            };

            $.each(states, function (index, item) {
                $stateProvider.state(index, item);
            });

            $provide.constant('$appStates', states);
        }
    ]).run(['$rootScope', '$state', '$stateParams', '$appStates',
        function ($rootScope, $state, $stateParams, $appStates) {
            var findState = function (states, find, result) {
                $.each(states, function (index, item) {
                    if (find.indexOf(item.url) === 0 && find !== item.url) {
                        result.push({
                            url: item.url,
                            text: item.text
                        });
                        findState(states, item.url, result);
                    }
                })
            };

            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                $rootScope.previousName = fromState.name;
                $rootScope.previousParams = fromParams;
                $rootScope.navigation = [];
                findState($appStates, toState.url, $rootScope.navigation);
                $rootScope.navigation.push({
                    text: toState.text
                });
            });
            $state.back = function () {
                if ($rootScope.previousName)
                    $state.go($rootScope.previousName, $rootScope.previousParams);
            };
        }
    ]);
});