define([
    'require',
    'application'
], function (require, application) {
    'use strict';

    application.service('accountService', ['$http', '$state', 'httpService',
        function ($http, $state, httpService) {
            this.login = function (username, password) {
                $http.post('/Account/Login',
                    {
                        Username: username,
                        Password: password
                    }, {
                        serverRequest: true
                    })
                    .success(function (response) {
                        if (response && response.success)
                            $state.go('main');
                    });
            };

            this.logout = function () {
                return $http.get('/Account/Logout', {
                    serverRequest: true
                });
            };

            this.changePassword = function (oldpassword, newpassword, confirmpassword) {
                return httpService.post('/Account/ChangePassword', {
                    OldPassword: oldpassword,
                    NewPassword: newpassword,
                    ConfirmPassword: confirmpassword
                });
            };

            this.setPassword = function (id, password) {
                return httpService.post('/Account/SetPassword', {
                    Id: id,
                    Password: password
                });
            };
        }
    ]);
});