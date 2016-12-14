define([
    'require',
    'application',
    'exmodal',
    'exsidebar',
    'exform',
    'exfield'
], function (require, application) {
    'use strict';

    application.controller('main', ['$scope', '$rootScope', '$state', '$appConfig', '$appEnvironment', '$modal', 'accountService', 'modalComponent',
        function ($scope, $rootScope, $state, $appConfig, $appEnvironment, $modal, accountService, modalComponent) {
            $scope.stores = {};
            $scope.data = {};
            $scope.handlers = {};

            $scope.$rootScope = $rootScope;

            if (!$appEnvironment.session)
                $state.go('session');

            $scope.data.session = $appEnvironment.session;
            $scope.links = $appConfig.links;

            $scope.handlers.changePassword = function () {
                $modal.open({
                    templateUrl: 'views/account/UserPassword.html',
                    scope: $rootScope.$new()
                }).result.then(function (result) {
                    if (!result)return;
                    accountService.changePassword(result.OldPassword, result.NewPassword, result.ConfirmPassword)
                        .then(function (data) {
                            modalComponent.infomation();
                        });
                });
            };
        }
    ]).controller('userPassword', ['$scope',
        function ($scope) {
            $scope.$data = {};
        }
    ]);

    application.controller('logout', ['$state', 'accountService',
        function ($state, accountService) {
            accountService.logout()
                .success(function () {
                    $state.go('login');
                });
        }
    ]);

    application.filter('linkAuthorize', ['$appEnvironment', function ($appEnvironment) {
        return function (input) {
            var result = [];
            $.each(input, function (index, item) {
                if (item.authorize && $appEnvironment.session) {
                    var isPermission = false;
                    $.each($appEnvironment.session.Permissions, function (i, data) {
                        if (data === item.authorize) {
                            isPermission = true;
                            return false;
                        }
                    });
                    if (isPermission) {
                        result.push(item);
                    }
                } else if ($appEnvironment.session) {
                    result.push(item);
                }
            });
            return result;
        };
    }]);

});