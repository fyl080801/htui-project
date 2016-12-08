(function () {
    "use strict";

    var noDebug = true;
    var isLocation = document.location.hostname === '127.0.0.1' || document.location.hostname === 'localhost';
    var libpath = '../lib/';
    var debugs = ['angular', 'angular-ui-router', 'angular-async-loader', 'jquery', 'bootstrap', 'html5shiv',
        'ui-bootstrap', 'clockpicker', 'bootgrid', 'bootstrap-fileinput', 'bootstrap-fileinput-sortable',
        'bootstrap-fileinput-purify', 'bootstrap-fileinput-canvas', 'es5-shim', 'es5-sham'];

    var requireConfig = function (config) {
        if (config.paths) {
            if (!isLocation || noDebug) {
                for (var i = 0; i < debugs.length; i++) {
                    if (config.paths[debugs[i]]) {
                        config.paths[debugs[i]] = config.paths[debugs[i]] + '.min';
                    }
                }
            }
        }

        require.config(config);
    };

    //requireConfig({baseUrl: 'js/'});

    //基础组件
    requireConfig({
        paths: {
            'angular': libpath + 'angular/angular',
            'angular-ui-router': libpath + 'angular-ui-router/release/angular-ui-router',
            'angular-async-loader': libpath + 'angular-async-loader/angular-async-loader',
            'jquery': libpath + 'jquery/dist/jquery',
            'bootstrap': libpath + 'bootstrap/dist/js/bootstrap',
            'html5shiv': libpath + 'html5shiv/dist/html5shiv',
            'respond': libpath + 'respond/dest/respond.min',
            'json2': libpath + 'json2/json2',
            'es5-shim': libpath + 'es5-shim/es5-shim',
            'es5-sham': libpath + 'es5-shim/es5-sham',
            'iepatch': 'iepatch'
        },
        shim: {
            'angular': {
                exports: 'angular'
            },
            'angular-async-loader': {
                deps: ['angular']
            },
            'angular-ui-router': {
                deps: ['angular']
            },
            'bootstrap': {
                deps: ['jquery', 'iepatch']
            }
        },
        map: {
            '*': {
                'css': libpath + 'require-css/css.min'
            }
        }
    });

    // 外部组件
    requireConfig({
        paths: {
            'webuploader': libpath + 'fex-webuploader/dist/webuploader',
            'ui-bootstrap': libpath + 'angular-bootstrap/ui-bootstrap-tpls',
            'clockpicker': libpath + 'clockpicker/dist/bootstrap-clockpicker',
            'bootstrap-treeview': libpath + 'bootstrap-treeview/dist/bootstrap-treeview.min'
        },
        shim: {
            'ui-bootstrap': {
                deps: ['angular']
            }
        }
    });

    // 项目组件
    requireConfig({
        paths: {
            'exdatagrid': 'component/exdatagrid',
            'exform': 'component/exform',
            'exfield': 'component/exfield',
            'exmodal': 'component/exmodal',
            'exsidebar': 'component/exsidebar',
            'extreeview': 'component/extreeview'
        }
    });

    // 项目初始化
    requireConfig({
        paths: {
            'provide': 'startup/provide',
            'route': 'startup/route',
            'registration': 'startup/registration',
            'directive': 'startup/directive'
        }
    });

    // css
    require([
        'css!../css/site.css',
        'css!../css/sidebar',
        'css!../css/datagrid',
        'css!../lib/clockpicker/dist/bootstrap-clockpicker.min',
        'css!../lib/fex-webuploader/dist/webuploader',
        'css!../lib/bootstrap-treeview/dist/bootstrap-treeview.min'
    ]);

    // app
    require([
        'angular',
        'iepatch',
        'jquery',
        'bootstrap',
        'application',
        'provide',
        'registration',  // 注册
        'route',        // 路由
        'directive'
    ], function () {
        angular.element(document).ready(function () {
            angular.bootstrap(document, ['app']);
            angular.element(document).find('html').addClass('ng-app');
        });
    });

})();