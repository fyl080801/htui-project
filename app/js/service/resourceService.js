/**
 * Created by fyl08 on 2016/11/15.
 */
define([
    'require',
    'application'
], function (require, application) {
    'use strict';

    application.service('resourceService', ['$http', '$state',
        function ($http, $state) {
            this.list = function (search, pagesize, pageindex, sorts) {
                var data = 'searchPhrase=' + (search ? search : '');
                if (pagesize && pagesize !== 'All')
                    data += '&rowCount=' + pagesize;
                if (pageindex !== undefined)
                    data += '&current=' + pageindex;
                if (sorts) {
                    $.each(sorts, function (index, item) {
                        data += '&sort[' + index + ']=' + item;
                    });
                }
                return $http.get('/ProgramPublish/Resource/List?' + data, {serverRequest: true});
            };

            this.drop = function (id) {
                return $http.get('/ProgramPublish/Resource/Delete/' + id, {serverRequest: true});
            };

            this.addToProgram = function (data) {
                return $http.post('/ProgramPublish/Program/AddResource', data, {serverRequest: true});
            };

            this.dropFromProgram = function (id) {
                return $http.get('/ProgramPublish/Program/DeleteResource/' + id, {serverRequest: true});
            };

            this.newFileToProgram = function (data, saveResource) {
                var url = '/ProgramPublish/Program/AddFile';
                url = saveResource ? url + '/?addresource=true' : url;
                return $http.post(url, data, {serverRequest: true});
            };

            this.newTextToProgram = function (data) {
                return $http.post('/ProgramPublish/Program/AddText', data, {serverRequest: true});
            };

            this.newLinkToProgram = function (data) {
                return $http.post('/ProgramPublish/Program/AddLink', data, {serverRequest: true});
            };
        }
    ]);
});