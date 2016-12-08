/**
 * Created by fyl08 on 2016/11/7.
 */
define([
    'require',
    'application'
], function (require, application) {
    'use strict';

    $.fn.exmodal = function (el) {
        var _title = '',
            _content = '',
            _icon = '',
            _action = '',
            _callback;

        var Modal = function (el) {
            this.el = el || {};
        };

        Modal.prototype.title = function (title) {
            _title = title;
            return this;
        };

        Modal.prototype.content = function (content) {
            _content = content;
            return this;
        };

        Modal.prototype.icon = function (icon) {
            _icon = icon;
            return this;
        };

        Modal.prototype.action = function (action) {
            var text = action;
            var texticon = '';
            var buttonStyle = '';
            if (action === 'OK') {
                text = '确定';
                texticon = 'glyphicon glyphicon-ok';
                buttonStyle = 'btn-primary';
            } else if (action === 'CANCEL') {
                text = '取消';
                texticon = 'glyphicon glyphicon-remove';
                buttonStyle = 'btn-default';
            }
            _action +=
                ('<button actionid="' + action + '" type="button" class="btn ' + buttonStyle + '">' +
                '<i class="' + texticon + '"></i>&nbsp;' + text +
                '</button>');
            return this;
        };

        Modal.prototype.callback = function (callback) {
            _callback = callback;
            return this;
        };

        Modal.prototype.show = function (title, content) {
            if (title)_title = title;
            if (content)_content = content;
            var _tpl =
                '<div id="popedmodal" class="modal fade">' +
                '   <div class="modal-dialog">' +
                '       <div class="modal-content">' +
                '           <div class="modal-header">' +
                '               <h4 class="modal-title"><i class="' + _icon + '"></i>&nbsp;' + _title + '</h4>' +
                '           </div>' +
                '           <div class="modal-body">' +
                '               <p>' + _content.replace('\n', '<br/>') + '</p>' +
                '           </div>' +
                '           <div class="modal-footer">' +
                _action +
                '           </div>' +
                '       </div><!-- /.modal-content -->' +
                '   </div><!-- /.modal-dialog -->' +
                '</div><!-- /.modal -->';

            this.el.append(_tpl);

            $('#popedmodal').on('hidden.bs.modal', function () {
                $('#popedmodal').remove();
            });

            $('#popedmodal').find('button[actionid]').each(function (index, item) {
                $(item).on('click', function () {
                    if (_callback)_callback();
                    $('#popedmodal').modal('hide');
                });
            });

            $('#popedmodal')
                .modal({
                    backdrop: 'static'
                })
                .find('.modal-dialog');
            // .css({
            //     width: 'auto',
            //     'margin-left': function () {
            //         return -($(this).width() / 2);
            //     }
            // });
        };

        return new Modal($(this));
    };


    application.service('modalComponent', ['$modal', '$rootScope', '$q',
        function ($modal, $rootScope, $q) {
            this.infomation = function (text) {
                var defered = $q.defer();
                var scope = $rootScope.$new();
                scope.text = text ? text : '操作成功';
                $modal.open({
                    templateUrl: 'templates/modal/Infomation.html',
                    scope: scope
                }).result.then(function (result) {
                    defered.resolve();
                });
                return defered.promise;
            };

            this.confirm = function (text) {
                var defered = $q.defer();
                var scope = $rootScope.$new();
                scope.text = text ? text : '是否确认操作？';
                $modal.open({
                    templateUrl: 'templates/modal/Confirm.html',
                    scope: scope
                }).result.then(function (result) {
                    if (result === 'ok') {
                        defered.resolve();
                    } else {
                        defered.reject();
                    }
                });
                return defered.promise;
            };
        }
    ]);
});