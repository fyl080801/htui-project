/**
 * Created by fyl08 on 2016/11/22.
 */
define([
    'require',
    'application'
], function (require, application) {
    'use strict';

    application.service('terminalService', ['$http', '$q', 'httpService',
        function ($http, $q, httpService) {
            this.list = function (groupId) {
                return httpService.post('/ProgramPublish/Terminal/List/', {
                    Search: '',
                    GroupId: groupId
                });
            };

            this.load = function (id) {
                //return $httpPromise($http.get('/ProgramPublish/Terminal/Load/' + id, {serverRequest: true}));
                var defered = $q.defer();
                $http.get('/ProgramPublish/Terminal/Load/' + id, {serverRequest: true})
                    .success(function (response) {
                        if (response.success) {
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

            this.save = function (data) {
                var defered = $q.defer();
                $http.post('/ProgramPublish/Terminal/Save', data, {serverRequest: true})
                    .success(function (response) {
                        if (response.success) {
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

            this.getMonitor = function (terminals) {
                var defered = $q.defer();
                var postdata = {};
                if (terminals.length <= 0) {
                    defered.resolve([]);
                    return defered.promise;
                }
                $.each(terminals, function (index, data) {
                    postdata['terminals[' + index + ']'] = data.Id;
                });
                $http.post('/ProgramPublish/Terminal/Monitor/', postdata, {serverRequest: true})
                    .success(function (response) {
                        var result = {};
                        if (response && response.success && response.data) {
                            result = response.data;
                        }
                        defered.resolve(result);
                    })
                    .error(function (error) {
                        defered.resolve();
                    });
                return defered.promise;
            };

            this.startup = function (id) {
                return httpService.post('/ProgramPublish/Terminal/Control/', {
                    Id: id,
                    Command: 'Startup'
                });
            };

            this.shutdown = function (id) {
                return httpService.post('/ProgramPublish/Terminal/Control/', {
                    Id: id,
                    Command: 'shutdown -h'
                });
            };

            this.reboot = function (id) {
                return httpService.post('/ProgramPublish/Terminal/Control/', {
                    Id: id,
                    Command: 'shutdown -r -t 0'
                });
            };

            this.changeIp = function (id, data) {
                return httpService.post('/ProgramPublish/Terminal/ChangeIp/', {
                    Id: id,
                    Ip: data.Ip,
                    Sub: data.Sub,
                    Gate: data.Gate,
                    Dns: data.Dns
                });
            };
        }
    ]);
});