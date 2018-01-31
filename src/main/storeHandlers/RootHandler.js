"use strict";
exports.__esModule = true;
var CounterHandler_1 = require("./CounterHandler");
var HybridWebViewHandler_1 = require("./HybridWebViewHandler");
var RootHandler = /** @class */ (function () {
    function RootHandler() {
        this.counter = new CounterHandler_1.CounterHandler();
        this.hybridWebView = new HybridWebViewHandler_1.HybridWebViewHandler();
    }
    RootHandler.prototype.register = function () {
        this.counter.register();
        this.hybridWebView.register();
    };
    return RootHandler;
}());
exports.RootHandler = RootHandler;
