import { BrowserWindow, dialog, Event, ipcMain, Menu, MenuItem } from "electron";

interface IDict<T> {
  [K:string]:T;
}
class RegisterIpc {

  private mRegister:IDict<boolean> = {};
  private counter = 0;

  public register = () => {
    //
    // NOTE: I use a mRegister to make sure the ipc route names are unique
    //       (it"s too easy to copy-and-paste some code, forget to update the route name,
    //       and end up with two competing functions mapped to the same string). This also
    //       allows for a client-side list-ipc function to confirm in the renderer that
    //       you"re only sending allowed ipc calls.
    //
    // NOTE: By convention, this app uses a convention where WebViews (aka Hybrid Apps)
    //       are only allowed to register routes starting with "w2r-" (web->renderer)
    //       as a way of making sure that the electron renderer is explicitly whitelisting
    //       any messages it exchanges with the WebView before relaying information
    //       to this backend process via "r2m" (render->main) routes. This is to block
    //       the page running inside the WebView from sending messages directly to the
    //       backend process without their being reviewed and approved for relay by the
    //       electron render. In support of this convention, the backend should never
    //       register any routes starting with "w2r-". Processes reply along the same channels
    //       but with "-reply" added to the channel name (so the webview sends a w2r-foo message
    //       to the renderer and the renderer replies to the webview with a w2r-foo-reply message).
    //
    this.registerHandlerForR2M("r2m-list-ipc", this.listIpc);
    this.registerHandlerForR2M("r2m-counter-delta", this.counterDelta);
    this.registerHandlerForR2M("r2m-counter-delta-string", this.counterDeltaString);
    this.registerHandlerForR2M("r2m-select-directory", this.selectDirectory);
    this.registerHandlerForR2M("r2m-save-dialog", this.saveDialog);
    this.registerHandlerForR2M("r2m-menu-for-webview", this.createMenus);
    this.createMenus("", null, true);
  }

  private registerHandlerForR2M = (ipc:string, handler:((ipc:string, event:Event, arg:any) => void)) => {
    if ((this.mRegister[ipc] === null) || (this.mRegister[ipc] === undefined)) {
      throw new Error("duplicate channel definitions");
    }
    if (ipc.indexOf("r2m-") !== 0) {
      throw new Error("invalid channel name");
    }
    if (ipc.substr(-"-reply".length) === "-reply") {
      throw new Error("invalid channel direction");
    }
    this.mRegister[ipc] = true;
    ipcMain.on(ipc, (event:Event, arg:any) => { handler(ipc, event, arg); });
  }

  private reply = (ipc:string, event:Event, data:any) => {
    const ipc2 = ipc + "-reply";
    event.sender.send(ipc2, data);
  }

  private createMenus = (ipc:string, event:Event, data:any) => {
    const addWebViewItems = data as boolean;
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
          {
            accelerator: "CmdOrCtrl+Shift+I",
            click: (menuItem:MenuItem, browserWindow:BrowserWindow, e:Event) => {
              this.openDevToolsWebView(e);
            },
            label: "Open Inner Developer Tools",
            visible: addWebViewItems,
          },
          {
            accelerator: "CmdOrCtrl+Shift+B",
            click: (menuItem:MenuItem, browserWindow:BrowserWindow, e:Event) => {
              this.browserBackWebView(e);
            },
            label: "Inner Back Button",
            visible: addWebViewItems,
          },
        ],
      },
    ];
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
  }

  private listIpc = (ipc:string, event:Event) => {
    const keys = new Array<string>();
    for (const key in this.mRegister) {
      if ((this.mRegister.hasOwnProperty(key)) && (this.mRegister[key] === true)) {
        keys.push(key);
      }
    }
    this.reply(ipc, event, keys);
  }

  private counterDelta = (ipc:string, event:Event, arg:any) => {
    const delta:number = arg.delta;
    this.counter += delta;
    this.reply(ipc, event, this.counter);
  }

  private counterDeltaString = (ipc:string, event:Event, arg:any) => {
    const delta:number = Number(arg as string);
    this.counter += delta;
    this.reply(ipc, event, this.counter);
  }

  private selectDirectory = (ipc:string, event:Event) => {
    const files = dialog.showOpenDialog({
      properties: [
        "openDirectory",
      ],
    });
    this.reply(ipc, event, files);
  }

  private saveDialog = (ipc:string, event:Event) => {
    const result = dialog.showSaveDialog({
      filters: [
        { name: "Images", extensions: ["jpg", "png", "gif"] },
      ],
      title: "Save an Image",
    });
    this.reply(ipc, event, result);
  }

  private openDevToolsWebView(e:Event) {
    this.reply("r2m-open-dev-tools-webview", e, "");
  }
  private browserBackWebView(e:Event) {
    this.reply("r2m-browser-back-webview", e, "");
  }

}

export const registerIpc = new RegisterIpc();
