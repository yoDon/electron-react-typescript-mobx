import { app, BrowserWindow /*, screen */ } from "electron";
import * as path from "path";
import * as url from "url";
import { RootHandler } from "./storeHandlers/RootHandler";

// NODE_ENV === undefined means we are running in the VS Code debugger
const nodeEnv = (process.env.NODE_ENV === undefined) ? "production" : process.env.NODE_ENV;

// crashReporter.start();

const storeRootHandler = new RootHandler();

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
  storeRootHandler.register();
});

function createWindow() {
  // { width: 1024, height: 728 }
  // const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  // const win = new BrowserWindow({ width, height });
  const win = new BrowserWindow();

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
    // __dirname is /src/main, where this file is
    const mangledPath = path.resolve(__dirname, "../../dist/electron.html");
    win.loadURL(url.format({
      pathname: mangledPath,
      protocol: "file:",
      slashes: true,
    }));
  }
}
