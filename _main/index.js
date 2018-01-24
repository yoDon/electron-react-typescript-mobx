'use strict';
const electron = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const crashReporter = electron.crashReporter;

const url = require('url');
const nodeEnv = process.env.NODE_ENV;

//crashReporter.start();

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  if (nodeEnv === 'development') {
    const sourceMapSupport = require('source-map-support');
    sourceMapSupport.install();
  }
  createWindow();
})

function createWindow() {
  // { width: 1024, height: 728 }
  const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize;
  const win = new BrowserWindow({width, height});
  
  if (nodeEnv === 'development') {
    //delay 1000ms to wait for webpack-dev-server start
    setTimeout(function(){
      win.loadURL(url.format({
        pathname: "localhost:3000/electron.html",
        protocol: 'http:',
        slashes: true
      }));
      win.webContents.openDevTools();
    },1000);
  } else {
    win.loadURL(url.format({
      pathname: path.join(path.resolve(__dirname, './dist'), 'electron.html'),
      protocol: 'file:',
      slashes: true
    }));
  }
}
