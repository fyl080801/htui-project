/**
 * Created by fyl08 on 2016/11/11.
 */
define([
    'require',
    'application',
    'clockpicker'
], function (require, application) {
    'use strict';

    document.createElement('ex-valuefield');
    document.createElement('ex-textfield');
    document.createElement('ex-textarea');
    document.createElement('ex-checkboxfield');
    document.createElement('ex-timefield');
    document.createElement('ex-numericfield');
    document.createElement('ex-datefield');
    document.createElement('ex-file');
    document.createElement('ex-combobox');


    var textRegexps = {
        email: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
        int: /^[0-9]*$/,
        ip: /((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))/,
        mac: /[0-9A-Fa-f][0-9A-Fa-f]:[0-9A-Fa-f][0-9A-Fa-f]:[0-9A-Fa-f][0-9A-Fa-f]:[0-9A-Fa-f][0-9A-Fa-f]:[0-9A-Fa-f][0-9A-Fa-f]:[0-9A-Fa-f][0-9A-Fa-f]/
    };

    var directiveAttribute = {
        restrict: 'AE',
        replace: true,
        require: '^ngModel'
    };

    var bindAttribute = {
        restrict: 'A',
        require: '?ngModel'
    };

    var fieldScope = {
        exFieldLabel: '@',
        exFlexInput: '@',
        exFlexLabel: '@',
        exFieldAuthorize: '@',
        exBindModel: '=ngModel'
    };

    var inputFieldScope = {
        exBindRequired: '=ngRequired',
        exBindDisabled: '=ngDisabled'
    };

    application.directive('exValuefield', [
        function () {
            var _scope = $.extend({
                exHidden: '@'
            }, fieldScope);

            var _link = function ($scope, $element, $attrs, $ctrl) {
                $ctrl.$render = function () {
                    $element.find('p').empty();
                    $element.find('p').html($ctrl.$viewValue);
                };

                var formatter = function (value) {
                    return value ? value.toString().replace(/[\r\n]/g, '<br/>') : value;
                };

                $ctrl.$formatters.push(formatter);
                $ctrl.$parsers.push(formatter);
            };

            var _controller = function ($scope, $element, $attrs, $transclude) {

            };

            return $.extend({
                scope: _scope,
                link: _link,
                controller: ['$scope', '$element', '$attrs', _controller],
                templateUrl: 'templates/form/ExValueField.html'
            }, directiveAttribute);
        }
    ]);

    // 文本框
    application.directive('exTextfield', [
        function () {
            var _scope = $.extend({
                exType: '@'
            }, fieldScope, inputFieldScope);

            var _link = function ($scope, $element, $attrs, $ctrl) {

            };

            var _controller = function ($scope, $element, $attrs) {

            };

            return $.extend({
                scope: _scope,
                link: _link,
                controller: ['$scope', '$element', '$attrs', _controller],
                templateUrl: 'templates/form/ExTextField.html'
            }, directiveAttribute);
        }
    ]);

    // 文本域
    application.directive('exTextarea', [
        function () {
            var _scope = $.extend({
                exRows: '@'
            }, fieldScope, inputFieldScope);

            var _link = function ($scope, $element, $attrs, $ctrl) {

            };

            var _controller = function ($scope, $element, $attrs) {

            };

            return $.extend({
                scope: _scope,
                link: _link,
                controller: ['$scope', '$element', '$attrs', _controller],
                templateUrl: 'templates/form/ExTextArea.html'
            }, directiveAttribute);
        }
    ]);

    // 时间
    application.directive('exTimefield', ['$filter',
        function ($filter) {
            var _scope = $.extend({}, fieldScope, inputFieldScope);

            var _link = function ($scope, $element, $attrs, $ctrl) {
                var filter = $filter('date');

                $ctrl.$render = function () {
                    $ctrl.$setViewValue($ctrl.$viewValue);
                };
                var formatter = function (value) {
                    return filter(value, 'HH:mm');
                };

                $ctrl.$formatters.push(formatter);
                $ctrl.$parsers.push(formatter);

                $element.find('.clockpicker').clockpicker();
            };

            var _controller = function ($scope, $element, $attrs) {

            };

            return $.extend({
                scope: _scope,
                link: _link,
                controller: ['$scope', '$element', '$attrs', _controller],
                templateUrl: 'templates/form/ExTimeField.html'
            }, directiveAttribute);
        }
    ]);

    /**
     * checkbox
     */
    application.directive('exCheckboxfield', [
        function () {
            var _scope = $.extend({
                exBoxlabel: '@',
                exBindTrueValue: '@ngTrueValue',
                exBindFalseValue: '@ngFalseValue'
            }, fieldScope, inputFieldScope);

            var _link = function ($scope, $element, $attrs, $ctrl) {

            };

            var _controller = function ($scope, $element, $attrs) {

            };

            return $.extend({
                scope: _scope,
                link: _link,
                controller: ['$scope', '$element', '$attrs', _controller],
                templateUrl: 'templates/form/ExCheckboxField.html'
            }, directiveAttribute);
        }
    ]);

    /**
     *
     */
    application.directive('exCombobox', ['$timeout', '$http',
        function ($timeout, $http) {
            var _scope = $.extend({
                exDatasource: '=',
                url: '@',
                method: '@',
                extraparams: '=',
                autoload: '@',
                exEditable: '@',
                exValueproperty: '@',
                exDisplayproperty: '@',
                exChildrenproperty: '@'
            }, fieldScope, inputFieldScope);

            var _link = function ($scope, $element, $attrs, $ctrl) {
                // $scope.exValueproperty = $scope.exValueproperty ? $scope.exValueproperty : 'id';
                // $scope.exDisplayproperty = $scope.exDisplayproperty ? $scope.exDisplayproperty : 'text';
                // $scope.exChildrenproperty = $scope.exChildrenproperty ? $scope.exChildrenproperty : 'children';
            };

            var _controller = function ($scope, $element, $attrs) {
                $scope.handlers = {};
                $scope.data = {};
                $scope.stores = {};

                $scope.stores.source = [];
                $scope.data.loaded = false;
                $scope.data.selected = null;


                $scope.handlers.triggerButton = function () {
                    if ($scope.exEditable === 'false' || !$scope.exEditable) {
                        $timeout(function () {
                            $element.find('button').trigger('click');
                        });
                    }
                };

                $scope.handlers.change = function (data) {
                    $scope.data.selected = data;
                    $scope.exBindModel = data[$scope.exValueproperty ? $scope.exValueproperty : 'id'];
                };

                $scope.handlers.Load = function () {
                    $scope.stores.source = [];
                    if ($scope.url) {
                        $http({
                            url: $scope.url,
                            method: $scope.method
                        }).success(function (data, header, config, status) {
                            // 绑定
                            $scope.data.loaded = true;
                        });
                    } else {
                        eachItem($scope.exDatasource, 0);
                        $scope.data.loaded = true;
                    }
                };

                $scope.handlers.Open = function () {
                    if ($scope.data.loaded) return;
                    $scope.handlers.Load();
                };

                $scope.handlers.Clear = function () {
                    $scope.exBindModel = null;
                    $scope.data.selected = null;
                };

                if ($scope.autoload)
                    $scope.handlers.Load();

                var eachItem = function (list, deep) {
                    if (!list)return false;
                    $.each(list, function (index, data) {
                        data.deep = deep;
                        if (data[$scope.exValueproperty ? $scope.exValueproperty : 'id'] == $scope.exBindModel) {
                            $scope.data.selected = data;
                        }
                        $scope.stores.source.push(data);
                        eachItem(data[$scope.exChildrenproperty ? $scope.exChildrenproperty : 'children'], deep + 1);
                    });
                };
                $scope.$watch('exBindModel', function (newValue, oldValue, scope) {
                    if (!newValue)return;
                    $scope.stores.source = [];
                    eachItem($scope.exDatasource, 0);
                });
            };

            return $.extend({
                scope: _scope,
                link: _link,
                controller: ['$scope', '$element', '$attrs', _controller],
                templateUrl: 'templates/form/Combobox.html'
            }, directiveAttribute);
        }
    ]).filter('range', function () {
        return function (input, total) {
            total = parseInt(total);

            for (var i = 0; i < total; i++) {
                input.push(i);
            }

            return input;
        };
    });

    /**
     *
     */
    application.directive('exFile', ['$timeout', '$modal', '$http', '$appConfig',
        function ($timeout, $modal, $http, $appConfig) {
            var WebUploader = require('webuploader');

            var _scope = $.extend({
                exServer: '@',
                exSubmit: '@'
            }, fieldScope, inputFieldScope);

            var _link = function ($scope, $element, $attrs, $ctrl) {
                var uploader = WebUploader.create({
                    swf: '../lib/fex-webuploader/dist/Uploader.swf',
                    server: $appConfig.serverUrl + $scope.exServer,
                    pick: {
                        id: $element.find('.filepicker'),
                        multiple: false
                    },
                    resize: false,
                    chunked: true,
                    auto: true,
                    chunkSize: 2048000//,
                    // accept: {
                    //     title: '素材文件',
                    //     extensions: 'flv,ppt,pptx,png,gif,jpg,bmp,avi,mp4,mpeg,mkv,mov',
                    //     mimeTypes: $scope.exMimetypes.split(',')
                    // }
                }).on('fileQueued', function (file) {
                    $scope.data.file = {
                        Id: file.id,
                        Ext: file.ext,
                        Size: file.size,
                        Name: file.name
                    };
                    $scope.$apply();
                }).on('fileDequeued', function (file) {

                }).on('uploadStart', function (file) {
                    $scope.data.uploading = true;
                    $scope.data.percentage = 0;
                    $scope.$apply();
                }).on('uploadBeforeSend', function (chunk, data, headers) {
                    data.Ruid = chunk.file.name + '_' + chunk.file.id + '_' + chunk.file.__hash;
                    data.Part = chunk.chunk;
                }).on('uploadProgress', function (file, percentage) {
                    $scope.data.percentage = (percentage * 100) >> 0;
                    $scope.$apply();
                }).on('uploadFinished', function () {
                    $scope.data.uploading = false;
                    $scope.$apply();
                }).on('uploadSuccess', function (file, response) {
                    $http.post($scope.exSubmit, {
                        Ext: $scope.data.file.Ext,
                        Size: $scope.data.file.Size,
                        Name: $scope.data.file.Name,
                        Ruid: file.name + '_' + file.id + '_' + file.__hash
                    }, {serverRequest: true}).success(function (response) {
                        $scope.exBindModel = response.data;
                        uploader.removeFile(file, true);
                    });
                }).on('error', function (type) {
                    if (type == 'Q_TYPE_DENIED') {
                        $modal.open({});
                        // $('body').exmodal()
                        //     .title('非法操作')
                        //     .content('文件类型错误')
                        //     .icon('glyphicon glyphicon-exclamation-sign')
                        //     .action('OK')
                        //     .show();
                    } else if (type == 'F_EXCEED_SIZE') {

                    }
                });
            };

            var _controller = function ($scope, $element, $attrs) {
                $scope.handlers = {};
                $scope.data = {};
                $scope.stores = {};

                $scope.data.uploading = false;
                $scope.data.percentage = 0;

                $scope.handlers.chooseFile = function () {
                    $timeout(function () {
                        var file = $element.find('input[type=file]');
                        if (file.length > 0) {
                            file.trigger('click');
                        } else {
                            alert('ie8 有问题');
                        }
                    });
                };
            };

            return $.extend({
                scope: _scope,
                link: _link,
                controller: ['$scope', '$element', '$attrs', _controller],
                templateUrl: 'templates/form/File.html'
            }, directiveAttribute);
        }
    ]);

    /**
     *
     */
    application.directive('exPattern', [
        function () {
            var _link = function ($scope, $element, $attrs, $ctrl) {
                if ($attrs.exPattern) {
                    var textRegexp = textRegexps[$attrs.exPattern] ?
                        textRegexps[$attrs.exPattern] : $attrs.exPattern;

                    var customValidator = function (value) {
                        var validity = $ctrl.$isEmpty(value) || textRegexp.test(value);
                        $ctrl.$setValidity($attrs.ngModel, validity);
                        return value;
                    };

                    $ctrl.$formatters.push(customValidator);
                    $ctrl.$parsers.push(customValidator);
                }
            };

            return $.extend({
                link: _link
            }, bindAttribute);
        }
    ]);

    /**
     *
     */
    application.directive('exFilter', ['$filter',
        function ($filter) {
            var _link = function ($scope, $element, $attrs, $ctrl) {
                if ($attrs.exFilter) {
                    var filter = $filter($attrs.exFilter);

                    $ctrl.$render = function () {
                        $element.find('p').text($ctrl.$viewValue);
                    };

                    if ($attrs.exFormat) {
                        $ctrl.$formatters.unshift(function (value) {
                            return filter(value, $attrs.exFormat);
                        });
                    } else if ($attrs.exFilterparams) {
                        $ctrl.$formatters.unshift(function (value) {
                            return filter(value, JSON.parse($attrs.exFilterparams));
                        });
                    }
                }
            };

            return $.extend({
                link: _link
            }, bindAttribute);
        }
    ]);
});