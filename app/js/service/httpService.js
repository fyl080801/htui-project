/**
 * Created by fyl08 on 2016/11/23.
 */
define([
    'require',
    'application'
], function (require, application) {
    'use strict';

    application.service('httpService', ['$http', '$q',
        function ($http, $q) {
            this.get = function (url) {
                var defered = $q.defer();
                $http.get(url, {serverRequest: true})
                    .success(function (response) {
                        if (response && response.success) {
                            // if (success && $.isFunction(success)) {
                            //     success(response.data);
                            // }
                            defered.resolve(response.data);
                        }
                        else {
                            // if (error && $.isFunction(error)) {
                            //     error(response.message);
                            // }
                            defered.reject(response.message);
                        }
                    })
                    .error(function (error) {
                        // if (error && $.isFunction(error)) {
                        //     error(error);
                        // }
                        defered.reject(error);
                    });
                return defered.promise;
            };

            this.post = function (url, params) {
                var defered = $q.defer();
                $http.post(url, params, {serverRequest: true})
                    .success(function (response) {
                        if (response && response.success) {
                            // if (success && $.isFunction(success)) {
                            //     success(response.data);
                            // }
                            defered.resolve(response.data);
                        }
                        else {
                            defered.reject(response.message);
                        }
                    })
                    .error(function (error) {
                        defered.reject(error);
                    });
                return defered.promise;
            };
        }
    ]);
});