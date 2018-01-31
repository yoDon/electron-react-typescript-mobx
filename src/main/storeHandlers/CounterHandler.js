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
var AbstractStoreHandler_1 = require("./AbstractStoreHandler");
var CounterHandler = /** @class */ (function (_super) {
    __extends(CounterHandler, _super);
    function CounterHandler() {
        var _this = _super.call(this) || this;
        _this.counter = 0;
        _this.register = function () {
            _this.onR2m("r2m-counter-delta", _this.counterDelta);
            _this.onR2m("r2m-counter-delta-string", _this.counterDeltaString);
        };
        _this.counterDelta = function (ipc, event, arg) {
            var delta = arg.delta;
            _this.counter += delta;
            _this.sendR2mReply(ipc, event, _this.counter);
        };
        _this.counterDeltaString = function (ipc, event, arg) {
            var delta = Number(arg);
            _this.counter += delta;
            _this.sendR2mReply(ipc, event, _this.counter);
        };
        return _this;
    }
    return CounterHandler;
}(AbstractStoreHandler_1.AbstractStoreHandler));
exports.CounterHandler = CounterHandler;
