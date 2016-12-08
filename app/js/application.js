define([
    'require',
    'exports',
    'module',
    'angular',
    'angular-async-loader',
    'ui-bootstrap',
    'angular-ui-router',
], function (require, exports, module) {
    'use strict';

    var angular = require('angular');
    var angularloader = require('angular-async-loader');

    require('ui-bootstrap');
    require('angular-ui-router');

    var app = angular.module('app', ['ui.router', 'ui.bootstrap']);

    angularloader.configure(app);

    module.exports = app;
});