/**
 * Created by fyl08 on 2016/11/10.
 */
define([
    'require',
    'application'
], function (require, application) {
    'use strict';

    application.service('programService', ['$http', '$state', 'httpService',
        function ($http, $state, httpService) {
            this.list = function (id) {
                return $http.get('/ProgramPublish/Program/Details/' + id, {serverRequest: true})
            };

            this.save = function (data) {
                return $http.post('/ProgramPublish/Program/Save', data, {serverRequest: true});
            };

            this.drop = function (id) {
                return $http.get('/ProgramPublish/Program/Delete/' + id, {serverRequest: true});
            };

            this.toExamine = function (id) {
                return $http.get('/ProgramPublish/Program/ToExamine/' + id, {serverRequest: true});
            };

            this.doExamine = function (data) {
                return $http.post('/ProgramPublish/Program/DoExamine', data, {serverRequest: true});
            };

            this.templates = function () {
                return httpService.get('/ProgramPublish/Program/Templates');
            };

            this.templateAreas = function (name) {
                return httpService.post('/ProgramPublish/Program/TemplateArea', {
                    Name: name
                });
            };
        }
    ]);
});