"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var path = require("path");
var url = require("url");
var nodeEnv = process.env.NODE_ENV;
// crashReporter.start();
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('ready', function () {
    if (nodeEnv === 'development') {
        var sourceMapSupport = require('source-map-support');
        sourceMapSupport.install();
    }
    createWindow();
});
function createWindow() {
    // { width: 1024, height: 728 }
    var _a = electron_1.screen.getPrimaryDisplay().workAreaSize, width = _a.width, height = _a.height;
    var win = new electron_1.BrowserWindow({ width: width, height: height });
    if (nodeEnv === 'development') {
        //delay 1000ms to wait for webpack-dev-server start
        setTimeout(function () {
            win.loadURL(url.format({
                pathname: "localhost:3000/electron.html",
                protocol: 'http:',
                slashes: true
            }));
            win.webContents.openDevTools();
        }, 1000);
    }
    else {
        win.loadURL(url.format({
            pathname: path.join(path.resolve(__dirname, './dist'), 'electron.html'),
            protocol: 'file:',
            slashes: true
        }));
    }
}
