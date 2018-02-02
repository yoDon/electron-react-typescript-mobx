"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var path = require("path");
var url = require("url");
var RootHandler_1 = require("./storeHandlers/RootHandler");
// NODE_ENV === undefined means we are running in the VS Code debugger
var nodeEnv = (process.env.NODE_ENV === undefined) ? "production" : process.env.NODE_ENV;
// crashReporter.start();
var storeRootHandler = new RootHandler_1.RootHandler();
electron_1.app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
electron_1.app.on("ready", function () {
    if (nodeEnv === "development") {
        var sourceMapSupport = require("source-map-support");
        sourceMapSupport.install();
    }
    createWindow();
    storeRootHandler.register();
});
function createWindow() {
    // { width: 1024, height: 728 }
    // const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    // const win = new BrowserWindow({ width, height });
    var win = new electron_1.BrowserWindow();
    if (nodeEnv === "development") {
        // delay 1000ms to wait for webpack-dev-server start
        setTimeout(function () {
            win.loadURL(url.format({
                pathname: "localhost:3000/electron.html",
                protocol: "http:",
                slashes: true
            }));
            win.webContents.openDevTools();
        }, 1000);
    }
    else {
        // __dirname is /src/main, where this file is
        var mangledPath = path.resolve(__dirname, "../../dist/electron.html");
        win.loadURL(url.format({
            pathname: mangledPath,
            protocol: "file:",
            slashes: true
        }));
    }
}
