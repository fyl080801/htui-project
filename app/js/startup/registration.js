define([
    'require',
    'application',
    'exmodal'
], function (require, application) {
    'use strict';

    // 注册自定义服务
    require([
        'service/httpService',
        'service/sessionService',
        'service/accountService',
        'service/userService',
        'service/roleService',
        'service/programService',
        'service/resourceService',
        'service/groupService',
        'service/terminalService',
        'service/notifyService'
    ]);

    // url 请求地址
    application.factory('addServerUrl', ['$q', '$appConfig', '$rootScope',
        function ($q, $appConfig, $rootScope) {
            return {
                request: function (config) {
                    if (config.serverRequest) {
                        config.headers['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
                        config.headers['Cache-Control'] = 'no-cache';
                        config.headers['Pragma'] = 'no-cache';
                        config.headers['X-Requested-With'] = 'XMLHttpRequest';
                        config.headers['Access-Control-Allow-Origin'] = '*';
                        var url = $appConfig.serverUrl ? $appConfig.serverUrl : '';
                        //url = ($appConfig.serverPath && $appConfig.serverPath != '') ? url + $appConfig.serverPath : url;
                        config.url = url + config.url;
                    }
                    return config;
                },
                requestError: function (err) {
                    return $q.reject(err);
                },
                response: function (response) {
                    if (response.data && response.data.success === false) {
                        // var scope = $rootScope.$new();
                        // scope.title = '请求异常';
                        // scope.text = response.data.message;
                        // $modal.open({
                        //     templateUrl: 'templates/modal/Infomation.html',
                        //     scope: scope
                        // }).result.then(function (result) {
                        // });
                        $('body').exmodal()
                            .title('请求异常')
                            .content(response.data.message)
                            .icon('glyphicon glyphicon-exclamation-sign')
                            .action('OK')
                            .show();
                        return false;
                    }
                    return response;
                },
                responseError: function (err) {
                    // if (-1 === err.status) {
                    //     // 远程服务器无响应
                    // } else if (500 === err.status) {
                    //     // 处理各类自定义错误
                    // } else if (501 === err.status) {
                    //     // ...
                    // }
                    return $q.reject(err);
                }

            };
        }
    ]);

    application.config(['$httpProvider',
        function ($httpProvider) {
            $httpProvider.interceptors.push('addServerUrl');
        }
    ]);
});