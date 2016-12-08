define([
    'require',
    'application',
    'exmodal'
], function (require, application) {
    'use strict';

    // 登录会话判断
    application.controller('session', ['$scope', '$state', 'sessionService', '$appEnvironment',
        function ($scope, $state, sessionService, $appEnvironment) {
            sessionService.checkSession()
                .success(function (response) {
                    if (response.data.Session.Vaild) {
                        $appEnvironment.session = response.data;
                        $state.go('main');
                    } else {
                        $state.go('login');
                    }
                });
        }
    ]);

    application.controller('login', ['$scope', 'accountService',
        function ($scope, accountService) {
            $scope.login = function (user) {
                accountService.login(user.username, user.password);
            }
        }
    ]);
});