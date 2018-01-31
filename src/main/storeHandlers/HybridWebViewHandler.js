"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var electron_1 = require("electron");
var AbstractStoreHandler_1 = require("./AbstractStoreHandler");
var HybridWebViewHandler = /** @class */ (function (_super) {
    __extends(HybridWebViewHandler, _super);
    function HybridWebViewHandler() {
        var _this = _super.call(this) || this;
        _this.register = function () {
            _this.onR2m("r2m-menu-for-webview", _this.menuForWebview);
            _this.createMenus(false);
        };
        _this.menuForWebview = function (ipc, event, data) {
            var addWebViewItems = data;
            _this.createMenus(addWebViewItems);
        };
        return _this;
    }
    HybridWebViewHandler.prototype.createMenus = function (addWebViewItems) {
        var _this = this;
        var menuTemplate = [
            {
                label: "Edit",
                submenu: [
                    { role: "cut" },
                    { role: "copy" },
                    { role: "paste" },
                    { role: "selectall" },
                ]
            },
            {
                label: "View",
                submenu: [
                    { role: "reload" },
                    { role: "forcereload" },
                    { role: "toggledevtools" },
                    { role: "resetzoom" },
                    { role: "zoomin" },
                    { role: "zoomout" },
                    { role: "togglefullscreen" },
                    {
                        accelerator: "CmdOrCtrl+Shift+I",
                        click: function (menuItem, browserWindow, e) {
                            _this.openDevToolsWebView(e);
                        },
                        label: "Open Inner Developer Tools",
                        visible: addWebViewItems
                    },
                    {
                        accelerator: "CmdOrCtrl+Shift+B",
                        click: function (menuItem, browserWindow, e) {
                            _this.browserBackWebView(e);
                        },
                        label: "Inner Back Button",
                        visible: addWebViewItems
                    },
                ]
            },
        ];
        var menu = electron_1.Menu.buildFromTemplate(menuTemplate);
        electron_1.Menu.setApplicationMenu(menu);
    };
    HybridWebViewHandler.prototype.openDevToolsWebView = function (e) {
        this.sendR2mReply("r2m-open-dev-tools-webview", e, "");
    };
    HybridWebViewHandler.prototype.browserBackWebView = function (e) {
        this.sendR2mReply("r2m-browser-back-webview", e, "");
    };
    return HybridWebViewHandler;
}(AbstractStoreHandler_1.AbstractStoreHandler));
exports.HybridWebViewHandler = HybridWebViewHandler;
