/**
 * Created by fyl08 on 2016/11/7.
 */
define([
    'require',
    'application'
], function (require, application) {
    'use strict';

    application.service('sessionService', ['$http',
        function ($http) {
            this.checkSession = function () {
                return $http.get('/System/Information',
                    {
                        serverRequest: true,
                        cache: false
                    });
            };
        }
    ]);
});