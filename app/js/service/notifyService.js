/**
 * Created by fyl08 on 2016/12/7.
 */
define([
    'require',
    'application'
], function (require, application) {
    'use strict';

    application.service('notifyService', ['$http', '$state', 'httpService',
        function ($http, $state, httpService) {
            this.load = function (id) {
                return httpService.get('/ProgramPublish/Notification/Load/' + id);
            };

            this.drop = function (id) {
                return httpService.get('/ProgramPublish/Notification/Delete/' + id);
            };

            this.save = function (data) {
                return httpService.post('/ProgramPublish/Notification/Save', data);
            };

            this.publishToGroups = function (nid, gid) {
                return httpService.post('/ProgramPublish/Notification/PublishGroups', {
                    NotificationId: nid,
                    Publishs: [gid]
                });
            };

            this.publishToTerminals = function (nid, tids) {
                return httpService.post('/ProgramPublish/Notification/PublishTerminals', {
                    NotificationId: nid,
                    Publishs: tids
                });
            };
        }
    ]);

});