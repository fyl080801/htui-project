/**
 * Created by fyl08 on 2016/12/1.
 */
define(function (require, exports, module) {
    'use strict';

    module.exports = {
        "serverUrl": "http://localhost:8003",
        "links": [{
            "text": "系统管理",
            "icon": "glyphicon glyphicon-cog",
            "links": [{
                "text": "用户管理",
                "href": "#/main/user"
            }, {
                "text": "角色管理",
                "href": "#/main/role"
            }, {
                "text": "分组管理",
                "href": "#/main/groups"
            }, {
                "text": "操作日志",
                "href": "#/main/log"
            }]
        }, {
            "text": "信息发布",
            "icon": "glyphicon glyphicon-film",
            "links": [{
                "text": "素材管理",
                "href": "#/main/resource"
            }, {
                "text": "节目管理",
                "href": "#/main/program"
            }, {
                "text": "待审核节目",
                "href": "#/main/examines"
            }, {
                "text": "发布通知",
                "href": "#/main/notify"
            }]
        }, {
            "text": "终端机管理",
            "icon": "glyphicon glyphicon-facetime-video",
            "links": [{
                "text": "设备列表",
                "href": "#/main/terminal"
            }, {
                "text": "监控",
                "href": "#/main/monitor/ "
            }]
        }]
    };
});