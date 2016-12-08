/**
 * Created by fyl08 on 2016/11/7.
 */
define([
    'require',
    'application'
], function (require, application) {
    'use strict';

    application.service('roleService', ['$http', '$state',
        function ($http, $state) {
            this.save = function (role) {
                return $http.post('/Role/Save',
                    role,
                    {
                        serverRequest: true
                    });
            };

            this.load = function (id) {
                return $http.get('/Role/Details/' + id,
                    {
                        serverRequest: true
                    });
            };

            this.drop = function (id) {
                return $http.get('/Role/Delete/' + id, {serverRequest: true});
            };

            this.auths = function (id) {
                return $http.get('/Role/Authorizes/' + id,
                    {
                        serverRequest: true
                    });
            };

            this.saveAuths = function (auths) {
                return $http.post('/Role/SetAuthorizes',
                    auths,
                    {
                        serverRequest: true
                    });
            };
        }
    ]);
});