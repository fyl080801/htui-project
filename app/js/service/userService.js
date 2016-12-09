/**
 * Created by fyl08 on 2016/11/3.
 */
define([
    'require',
    'application'
], function (require, application) {
    'use strict';

    application.service('userService', ['$http', '$state',
        function ($http, $state) {
            this.list = function (query, pagesize, pageindex) {

            };

            this.save = function (user) {
                return $http.post('/ProgramPublish/GroupUser/Save',
                    user,
                    {
                        serverRequest: true
                    });
            };

            this.load = function (id) {
                return $http.get('/ProgramPublish/GroupUser/Load/' + id,
                    {
                        serverRequest: true
                    });
            };

            this.drop = function (id) {
                return $http.get('/User/Delete/' + id,
                    {
                        serverRequest: true
                    });
            }
        }
    ]);
});