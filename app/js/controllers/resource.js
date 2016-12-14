/**
 * Created by fyl08 on 2016/11/10.
 */
define([
    'require',
    'application',
    'webuploader',
    'exform',
    'exfield',
    'exmodal',
    'exdatagrid'
], function (require, application, WebUploader) {
    'use strict';

    var categories = {
        '1': 'PPTX',
        '2': 'Flash',
        '3': '视频',
        '4': '图片',
        '5': '网址',
        '6': '文字',
        '7': '文档'
    };

    var popupThumb = function (ev, scope, data, $appConfig, url) {
        $(ev.target).popover({
            container: 'body',
            html: true,
            content: '<a href="#" class="thumbnail">' +
            '       <img src="' + $appConfig.serverUrl + url + data.Id + '" />' +
            '</a>'
        });
        $(ev.target).popover('show');
    };

    var hideThumb = function (ev) {
        $(ev.target).popover('destroy');
    };

    application.controller('programresources', ['$scope', '$state', '$stateParams', '$appConfig', '$window',
        function ($scope, $state, $stateParams, $appConfig, $window) {
            $scope.stores = {};
            $scope.data = {};
            $scope.handlers = {};

            $scope.data.Columns = [{
                type: 'data',
                name: 'Name',
                header: '素材名称',
                handlers: {
                    mouseover: function (ev, scope, data) {
                        popupThumb(ev, scope, data, $appConfig, '/ProgramPublish/Program/ResourceThumb/');
                    },
                    mouseleave: hideThumb
                }
            }, {
                type: 'data',
                name: 'CategoryId',
                header: '素材类型',
                filter: 'enums',
                filterargs: categories
            }, {
                type: 'data',
                name: 'DisplayId',
                header: '位置Id'
            }, {
                type: 'command',
                header: '操作',
                commands: [{
                    icon: 'glyphicon-save',
                    tooltip: '下载',
                    handler: function (e, data) {
                        $window.open($appConfig.serverUrl + '/ProgramPublish/Program/DownloadResource/' + data.Id);
                    }
                }]
            }];
        }
    ]);

    application.controller('programresourceedit', ['$scope', '$rootScope', '$state', '$stateParams', '$appConfig', '$modal', 'resourceService', 'modalComponent', '$window',
        function ($scope, $rootScope, $state, $stateParams, $appConfig, $modal, resourceService, modalComponent, $window) {
            $scope.stores = {};
            $scope.data = {};
            $scope.handlers = {};

            var gridscope;
            $scope.$on('gridready', function (scope) {
                gridscope = scope.targetScope;
            });

            $scope.data.Columns = [{
                type: 'data',
                name: 'Name',
                header: '素材名称',
                handlers: {
                    mouseover: function (ev, scope, data) {
                        popupThumb(ev, scope, data, $appConfig, '/ProgramPublish/Program/ResourceThumb/');
                    },
                    mouseleave: hideThumb
                }
            }, {
                type: 'data',
                name: 'CategoryId',
                header: '素材类型',
                filter: 'enums',
                filterargs: categories
            }, {
                type: 'data',
                name: 'DisplayId',
                header: '位置Id'
            }, {
                type: 'command',
                header: '操作',
                commands: [{
                    icon: 'glyphicon-save',
                    tooltip: '下载',
                    handler: function (e, data) {
                        $window.open($appConfig.serverUrl + '/ProgramPublish/Program/DownloadResource/' + data.Id);
                    }
                }, {
                    icon: 'glyphicon-trash',
                    tooltip: '删除',
                    style: 'danger',
                    handler: function (e, record) {
                        modalComponent.confirm('是否移除？')
                            .then(function () {
                                resourceService.dropFromProgram(record.Id)
                                    .success(function () {
                                        e.handlers.Load();
                                    });
                            });
                    }
                }]
            }];

            $scope.handlers.addFile = function () {
                $modal.open({
                    templateUrl: 'views/program/NewFile.html',
                    scope: $rootScope.$new()
                }).result.then(function (result) {
                    if (!result)return;
                    resourceService.newFileToProgram({
                        ProgramId: $stateParams.id,
                        Name: result.Name,
                        Content: result.Content,
                        DisplayId: result.DisplayId
                    }, result.SaveResource).success(function () {
                        gridscope.handlers.Load();
                    });
                });
            };

            $scope.handlers.addText = function () {
                $modal.open({
                    templateUrl: 'views/program/NewText.html',
                    scope: $rootScope.$new()
                }).result.then(function (result) {
                    if (!result)return;
                    resourceService.newTextToProgram({
                        ProgramId: $stateParams.id,
                        Content: result.Content,
                        DisplayId: result.DisplayId
                    }).success(function () {
                        gridscope.handlers.Load();
                    });
                });
            };

            $scope.handlers.addLink = function () {
                $modal.open({
                    templateUrl: 'views/program/NewLink.html',
                    scope: $rootScope.$new()
                }).result.then(function (result) {
                    if (!result)return;
                    resourceService.newLinkToProgram({
                        ProgramId: $stateParams.id,
                        Content: result.Content,
                        DisplayId: result.DisplayId
                    }).success(function () {
                        gridscope.handlers.Load();
                    });
                });
            };
        }
    ]).controller('addProgramResource', ['$scope', '$appConfig', '$stateParams', 'programService',
        function ($scope, $appConfig, $stateParams, programService) {
            $scope.stores = {};
            $scope.data = {};
            $scope.handlers = {};

            programService.list($stateParams.id)
                .success(function (response) {
                    programService.templateAreas(response.data.Template)
                        .then(function (data) {
                            $scope.stores.Areas = data;
                        });
                });
            $scope.data.serverUrl = $appConfig.serverUrl;
        }
    ]);

    application.controller('resourcelist', ['$scope', '$appConfig', '$window', 'resourceService', 'modalComponent',
        function ($scope, $appConfig, $window, resourceService, modalComponent) {
            $scope.stores = {};
            $scope.data = {};
            $scope.handlers = {};

            $scope.data.Columns = [{
                type: 'data',
                name: 'Name',
                header: '素材名称',
                handlers: {
                    mouseover: function (ev, scope, data) {
                        popupThumb(ev, scope, data, $appConfig, '/ProgramPublish/Resource/Thumb/');
                    },
                    mouseleave: hideThumb
                }
            }, {
                type: 'data',
                name: 'CategoryId',
                header: '类型',
                width: '10%',
                filter: 'enums',
                filterargs: categories
            }, {
                type: 'data',
                name: 'User[PersonalName]',
                sortfield: 'User[LastName]',
                header: '上传人',
                width: '10%'
            }, {
                type: 'data',
                name: 'UploadTime',
                header: '上传日期',
                width: '10%',
                filter: 'date',
                filterargs: 'yyyy-MM-dd'
            }, {
                type: 'command',
                header: '操作',
                width: '10%',
                commands: [{
                    icon: 'glyphicon-save',
                    tooltip: '下载',
                    handler: function (e, data) {
                        $window.open($appConfig.serverUrl + '/ProgramPublish/Resource/Download/' + data.Id);
                    }
                }, {
                    icon: 'glyphicon-trash',
                    tooltip: '删除',
                    style: 'danger',
                    handler: function (e, record) {
                        modalComponent.confirm('是否移除？')
                            .then(function () {
                                resourceService.drop(record.Id)
                                    .success(function () {
                                        e.handlers.Load();
                                    });
                            });
                    }
                }]
            }];
        }
    ]);

    application.controller('resourceselect', ['$scope', '$stateParams', '$modal', '$appConfig', 'resourceService', 'modalComponent',
        function ($scope, $stateParams, $modal, $appConfig, resourceService, modalComponent) {
            $scope.stores = {};
            $scope.data = {};
            $scope.handlers = {};

            $scope.data.Columns = [{
                type: 'data',
                name: 'Name',
                header: '素材名称',
                handlers: {
                    mouseover: function (ev, scope, data) {
                        popupThumb(ev, scope, data, $appConfig, '/ProgramPublish/Resource/Thumb/');
                    },
                    mouseleave: hideThumb
                }
            }, {
                type: 'data',
                name: 'CategoryId',
                header: '类型',
                filter: 'enums',
                filterargs: categories
            }, {
                type: 'data',
                name: 'UploadTime',
                header: '上传日期',
                filter: 'date',
                filterargs: 'yyyy-MM-dd'
            }, {
                type: 'command',
                header: '选择',
                commands: [{
                    icon: 'glyphicon-log-in',
                    tooltip: '选择',
                    handler: function (e, record) {
                        $modal.open({
                            templateUrl: 'views/program/SetDisplay.html',
                            controller: 'selectProgramResource'
                        }).result.then(function (result) {
                            if (!result) return;
                            resourceService.addToProgram({
                                ProgramId: $stateParams.id,
                                CategoryId: record.CategoryId,
                                Content: record.Content,
                                DisplayId: result
                            })
                                .success(function () {

                                });
                        });
                    }
                }]
            }];
        }
    ]).controller('selectProgramResource', ['$scope', '$stateParams', '$modalInstance', 'programService',
        function ($scope, $stateParams, $modalInstance, programService) {
            $scope.stores = {};
            $scope.data = {};
            $scope.handlers = {};

            programService.list($stateParams.id)
                .success(function (response) {
                    programService.templateAreas(response.data.Template)
                        .then(function (data) {
                            $scope.stores.Areas = data;
                        });
                });
        }
    ]);

    application.controller('resourceupload', ['$scope', '$http', '$appConfig', 'mediaDefine',
        function ($scope, $http, $appConfig, mediaDefine) {
            $scope.stores = {};
            $scope.data = {};
            $scope.handlers = {};

            $scope.data.files = {};
            $scope.data.uploading = false;

            var uploader = WebUploader.create({
                swf: '../lib/fex-webuploader/dist/Uploader.swf',
                server: $appConfig.serverUrl + '/ProgramPublish/Resource/Upload',
                pick: '#filepicker',
                resize: false,
                chunked: true,
                chunkSize: 2048000,
                accept: mediaDefine
            }).on('fileQueued', function (file) {
                $scope.data.files[file.id] = {
                    Id: file.id,
                    Title: file.name,
                    Ext: file.ext,
                    Size: file.size,
                    Name: file.name,
                    Percentage: 0
                };
                $scope.$apply();
            }).on('fileDequeued', function (file) {
                if ($scope.data.files[file.id])
                    delete $scope.data.files[file.id];
            }).on('uploadBeforeSend', function (chunk, data, headers) {
                $scope.data.files[chunk.file.id].Uploading = true;
                data.Ruid = chunk.file.name + '_' + chunk.file.id + '_' + chunk.file.__hash;
                data.Part = chunk.chunk;
                $scope.$apply();
            }).on('uploadProgress', function (file, percentage) {
                $scope.data.files[file.id].Percentage = (percentage * 100) >> 0;
                $scope.$apply();
            }).on('uploadFinished', function () {
                $scope.data.uploading = false;
            }).on('uploadSuccess', function (file, response) {
                var sendFile = $scope.data.files[file.id];
                $http.post('/ProgramPublish/Resource/SaveUpload', {
                    Title: sendFile.Title,
                    Ext: sendFile.Ext,
                    Size: sendFile.Size,
                    Name: sendFile.Name,
                    Ruid: file.name + '_' + file.id + '_' + file.__hash
                }, {serverRequest: true}).success(function () {
                    uploader.removeFile(file, true);
                });
            }).on('error', function (type) {
                if (type == 'Q_TYPE_DENIED') {
                    $('body').exmodal()
                        .title('非法操作')
                        .content('文件类型错误')
                        .icon('glyphicon glyphicon-exclamation-sign')
                        .action('OK')
                        .show();
                } else if (type == 'F_EXCEED_SIZE') {

                }
            });

            $scope.handlers.upload = function () {
                $scope.data.uploading = true;
                uploader.upload();
            };

            $scope.handlers.remove = function (id) {
                uploader.removeFile(id, true);
            };
        }
    ]);
});