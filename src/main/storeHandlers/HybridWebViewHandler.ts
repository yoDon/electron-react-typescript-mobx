import { Event, Menu } from "electron";
import { AbstractStoreHandler } from "./AbstractStoreHandler";

class HybridWebViewHandler extends AbstractStoreHandler {

  public constructor() {
    super();
  }

  public register = () => {
    this.onR2m("r2m-menu-for-webview", this.menuForWebview);
    this.createMenus(false);
  }

  private menuForWebview = (ipc:string, event:Event, data:any) => {
    const addWebViewItems = data as boolean;
    this.createMenus(addWebViewItems);
  }

  private createMenus(addWebViewItems:boolean) {
    const menuTemplate = [
      {
        label: "Edit",
        submenu: [
          { role: "cut" },
          { role: "copy" },
          { role: "paste" },
          { role: "selectall" },
        ],
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
          /*
           * Disable the inner WebView menu items for now until
           * I can figure out how to propagate a functional caller
           * event into the sendR2mReply() method
           *
          {
            accelerator: "CmdOrCtrl+Shift+I",
            click: (menuItem:MenuItem, browserWindow:BrowserWindow, e:Event) => {
              this.sendR2mReply("r2m-open-dev-tools-webview", e, "");
            },
            label: "Open Inner Developer Tools",
            visible: addWebViewItems,
          },
          {
            accelerator: "CmdOrCtrl+Shift+B",
            click: (menuItem:MenuItem, browserWindow:BrowserWindow, e:Event) => {
              this.sendR2mReply("r2m-browser-back-webview", e, "");
            },
            label: "Inner Back Button",
            visible: addWebViewItems,
          },
          */
        ],
      },
    ];
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
  }

}

export { HybridWebViewHandler };
