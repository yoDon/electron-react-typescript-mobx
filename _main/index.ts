import { app, BrowserWindow, screen } from "electron";
import * as path from "path";
import * as url from "url";

const nodeEnv = process.env.NODE_ENV;

// crashReporter.start();

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("ready", () => {
  if (nodeEnv === "development") {
    const sourceMapSupport = require("source-map-support");
    sourceMapSupport.install();
  }
  createWindow();
});

function createWindow() {
  // { width: 1024, height: 728 }
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const win = new BrowserWindow({ width, height });

  if (nodeEnv === "development") {
    // delay 1000ms to wait for webpack-dev-server start
    setTimeout(() => {
      win.loadURL(url.format({
        pathname: "localhost:3000/electron.html",
        protocol: "http:",
        slashes: true,
      }));
      win.webContents.openDevTools();
    }, 1000);
  } else {
    win.loadURL(url.format({
      pathname: path.join(path.resolve(__dirname, "./dist"), "electron.html"),
      protocol: "file:",
      slashes: true,
    }));
  }
}
