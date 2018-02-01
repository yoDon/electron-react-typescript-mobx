"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var register = {};
var AbstractStoreHandler = /** @class */ (function () {
    function AbstractStoreHandler() {
        this.onR2m = function (ipc, handler) {
            if ((register[ipc] !== null) && (register[ipc] !== undefined)) {
                throw new Error("duplicate channel definitions for <" + ipc + ">");
            }
            if (ipc.indexOf("r2m-") !== 0) {
                throw new Error("invalid channel name for <" + ipc + ">");
            }
            if (ipc.substr(-"-reply".length) === "-reply") {
                throw new Error("invalid channel direction for <" + ipc + ">");
            }
            register[ipc] = true;
            electron_1.ipcMain.on(ipc, function (event, arg) { handler(ipc, event, arg); });
        };
        this.sendR2mReply = function (ipc, event, data) {
            if (ipc.indexOf("r2m-") !== 0) {
                throw new Error("invalid channel name for <" + ipc + ">");
            }
            if (ipc.substr(-"-reply".length) === "-reply") {
                throw new Error("invalid channel direction for <" + ipc + ">");
            }
            var ipc2 = ipc + "-reply";
            if (event === null || event === undefined || event.sender !== null || event.sender !== undefined) {
                throw new Error("invalid event <" + ipc + ">");
            }
            // work around typescript typing bug with an any wrapper
            event.sender.send(ipc2, data);
        };
    }
    return AbstractStoreHandler;
}());
exports.AbstractStoreHandler = AbstractStoreHandler;
