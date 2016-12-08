/**
 * Created by fyl08 on 2016/11/21.
 */
define([
    'require',
    'application'
], function (require, application) {
    'use strict';

    application.service('groupService', ['$http', '$state', '$q',
        function ($http, $state, $q, httpService) {
            var buildGroup = function (groups, current) {
                current.children = [];
                $.each(groups, function (index, data) {
                    if (data.ParentId === current.Id) {
                        current.children.push(data);
                    }
                });
                $.each(current.children, function (index, data) {
                    buildGroup(groups, data);
                });
            };

            this.save = function (data) {
                return $http.post('/ProgramPublish/Group/Save', data, {serverRequest: true});
            };

            this.drop = function (id) {
                return $http.get('/ProgramPublish/Group/Delete/' + id, {serverRequest: true});
            };

            this.all = function () {
                var deferred = $q.defer();
                $http.get('/ProgramPublish/Group/All', {serverRequest: true})
                    .success(function (response) {
                        if (response.success) {
                            var groups = [];
                            $.each(response.data, function (index, data) {
                                if (!data.ParentId) {
                                    buildGroup(response.data, data);
                                    groups.push(data);
                                }
                            });
                            deferred.resolve(groups);
                        }
                        else
                            deferred.reject(response.message);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return deferred.promise;
            };
        }
    ]);
});