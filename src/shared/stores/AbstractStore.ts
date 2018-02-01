interface IDict<T> {
  [K:string]:T;
}

//
// These stores expose two public interfaces, one of which is
// callable directly by local Typescript code, the other of which
// is callable over ipc. Depending on whether this store is running
// in the renderer, a webview, or a conventional web page the other
// end of that ipc interface is the main process, renderer, or non-existent,
// respectively. In the case of the renderer, the store also accepts
// a hosted WebView containing a matching store and attempts to connect
// the two stores so the renderer store can relay updates from the
// WebView to the main process (because the WebView is not allowed to talk
// directly to the main process for security reasons).
//

//
// This store is configured to either talk to the Electron main process via ipcRenderer
// (when loaded in Electron) or to talk to the Electron host renderer via ipcRendererStub
// (when loaded as a hybrid web page in an Electron WebView) or to run locally as a
// conventional browser web page if no main or host renderer is available. See the
// definition of ipcRendererStub in preload.js for more info on the specific set of
// whitelisted paths and functions supported by ipcRendererStub.
//

//
// NOTE: By convention, this framework uses a convention where WebViews (aka Hybrid Apps)
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

const ipcRenderer = (window as any).isInElectronRenderer
                  ? (window as any).nodeRequire("electron").ipcRenderer
                  : (window as any).ipcRendererStub;

//
// NOTE: This uses a class static register var to make sure the ipc route names are unique
//       (it's too easy to copy-and-paste some code, forget to update the route name,
//       and end up with two competing functions mapped to the same string).
//

const register:IDict<boolean> = {};
const ipcHandlers:IDict<(ipc:string, event:Event, arg:any) => void> = {};

abstract class AbstractStore {

  protected mDisposers = [] as Array<() => void>;
  protected mElement = null as any;
  protected isInElectronRenderer = (window as any).isInElectronRenderer;
  protected hasElectronAccess = (ipcRenderer !== null && ipcRenderer !== undefined);
  protected isInHybridWebView = ((window as any).isInElectronRenderer === false && ipcRenderer !== undefined && ipcRenderer !== null);

  public onR2mReply = (ipc:string, handler:((ipc:string, event:Event, arg:any) => void)) => {
    if (this.isInElectronRenderer === false) {
      throw new Error("invalid channel handler for <" + ipc + ">");
    }
    if (register[ipc] === true) {
      throw new Error("duplicate channel definitions for <" + ipc + ">");
    }
    if (ipc.indexOf("r2m-") !== 0) {
      throw new Error("invalid channel name for <" + ipc + ">");
    }
    if (ipc.substr(-"-reply".length) === "-reply") {
      throw new Error("invalid channel name for <" + ipc + ">");
    }
    register[ipc] = true;
    ipcRenderer.on(ipc + "-reply", (event:Event, arg:any) => { handler(ipc, event, arg); });
  }

  public onW2r = (ipc:string, handler:((ipc:string, event:Event, arg:any) => void)) => {
    if (this.isInElectronRenderer === false) {
      throw new Error("invalid channel handler for <" + ipc + ">");
    }
    if (register[ipc] === true) {
      throw new Error("duplicate channel definitions for <" + ipc + ">");
    }
    if (ipc.indexOf("w2r-") !== 0) {
      throw new Error("invalid channel name for <" + ipc + ">");
    }
    if (ipc.substr(-"-reply".length) === "-reply") {
      throw new Error("invalid channel name for <" + ipc + ">");
    }
    register[ipc] = true;
    ipcHandlers[ipc] = handler;
  }

  public onW2rReply = (ipc:string, handler:((ipc:string, event:Event, arg:any) => void)) => {
    if (this.isInElectronRenderer) {
      throw new Error("invalid channel handler for <" + ipc + ">");
    }
    if (register[ipc] === true) {
      throw new Error("duplicate channel definitions for <" + ipc + ">");
    }
    if (ipc.indexOf("w2r-") !== 0) {
      throw new Error("invalid channel name for <" + ipc + ">");
    }
    if (ipc.substr(-"-reply".length) === "-reply") {
      throw new Error("invalid channel name for <" + ipc + ">");
    }
    register[ipc] = true;
    ipcRenderer.on(ipc + "-reply", (event:Event, arg:any) => { handler(ipc, event, arg); });
  }

  public sendR2m = (ipc:string, data:any) => {
    if (this.isInElectronRenderer === false) {
      throw new Error("invalid channel sende for <" + ipc + ">r");
    }
    if (ipc.indexOf("r2m-") !== 0) {
      throw new Error("invalid channel name for <" + ipc + ">");
    }
    if (ipc.substr(-"-reply".length) === "-reply") {
      throw new Error("invalid channel name for <" + ipc + ">");
    }
    ipcRenderer.send(ipc, data);
  }

  public sendW2r = (ipc:string, data:any) => {
    if (this.isInElectronRenderer) {
      throw new Error("invalid channel sender for <" + ipc + ">");
    }
    if (ipc.indexOf("w2r-") !== 0) {
      throw new Error("invalid channel name for <" + ipc + ">");
    }
    if (ipc.substr(-"-reply".length) === "-reply") {
      throw new Error("invalid channel name for <" + ipc + ">");
    }
    ipcRenderer.send(ipc, data);
  }

  public sendW2rReply = (ipc:string, data:any) => {
    if (this.isInElectronRenderer === false) {
      throw new Error("invalid channel sender for <" + ipc + ">");
    }
    if (ipc.indexOf("w2r-") !== 0) {
      throw new Error("invalid channel name for <" + ipc + ">");
    }
    if (ipc.substr(-"-reply".length) === "-reply") {
      throw new Error("invalid channel name for <" + ipc + ">");
    }
    this.mElement.send(ipc + "-reply", data);
  }

  public unregisterWebViewForIpcBase(element:any) {
    if (this.isInElectronRenderer) {
      this.mDisposers.forEach((disposer) => {
        disposer();
      });
      if (this.mElement !== null) {
        this.mElement.removeEventListener("ipc-message-host");
        this.mElement.ipcHandlers = null;
        this.mElement = null;
        return true; // ---- EARLY RETURN ----
      }
    }
    return false;
  }

  protected registerWebViewForIpcBase(element:any, key:string) {
    if (this.isInElectronRenderer) {
      if (this.mElement === null) {
        this.mElement = element;
      }
      if (this.mElement.getAttribute("webviewlistener") !== "true") {
        this.mElement.setAttribute("webviewlistener", "true");
        this.mElement.addEventListener("ipc-message", (event:any) => {
          const ipc = event.channel as string;
          const handler = ipcHandlers[ipc];
          if (handler) {
            handler(ipc, event, event.args[0]);
          }
        });
      }
      if (this.mElement.getAttribute("webviewlistener-" + key) !== "true") {
        this.mElement.setAttribute("webviewlistener-" + key, "true");
        return true; // ---- EARLY RETURN ----
      }
    }
    return false;
  }
}

export { AbstractStore };
