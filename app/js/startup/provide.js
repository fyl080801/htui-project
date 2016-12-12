/**
 * Created by fyl08 on 2016/11/8.
 */
define([
    'require',
    'application',
    '../config'
], function (require, application, config) {
    'use strict';

    application.config(['$provide',
        function ($provide) {
            $provide.constant('$appConfig', config);
        }
    ]);

    application.config(['$provide',
        function ($provide) {
            $provide.constant('$appEnvironment', {});
            $provide.value('mediaDefine', {
                title: '素材文件',
                extensions: 'flv,ppt,pptx,png,gif,jpg,bmp,avi,mp4,mpeg,mkv,mov',
                mimeTypes: [
                    'image/png',
                    'image/gif',
                    'image/bmp',
                    'image/jpeg',
                    'application/vnd.ms-powerpoint',
                    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                    'flv-application/octet-stream',
                    'video/mp4',
                    'video/x-msvideo',
                    'video/mp4',
                    'video/x-matroska',
                    'video/mpeg',
                    'video/quicktime'
                ]
            });
        }
    ]);

    application.config(['$provide',
        function ($provide) {
            $provide.decorator('$rootScope', ['$delegate', '$appEnvironment',
                function ($delegate, $appEnvironment) {
                    $delegate.$data = {};
                    $delegate.$handlers = {};
                    $delegate.$stores = {};
                    $delegate.$appEnvironment = $appEnvironment;
                    return $delegate;
                }
            ]);
        }
    ]);
});