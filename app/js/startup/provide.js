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