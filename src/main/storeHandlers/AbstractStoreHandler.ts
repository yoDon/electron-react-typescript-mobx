import { Event, ipcMain } from "electron";

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

//
// NOTE: This uses a class static register var to make sure the ipc route names are unique
//       (it's too easy to copy-and-paste some code, forget to update the route name,
//       and end up with two competing functions mapped to the same string).
//

interface IDict<T> {
  [K:string]:T;
}

const register:IDict<boolean> = {};

abstract class AbstractStoreHandler {

  public onR2m = (ipc:string, handler:((ipc:string, event:Event, arg:any) => void)) => {
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
    ipcMain.on(ipc, (event:Event, arg:any) => { handler(ipc, event, arg); });
  }

  public sendR2mReply = (ipc:string, event:Event, data:any) => {
    if (ipc.indexOf("r2m-") !== 0) {
      throw new Error("invalid channel name for <" + ipc + ">");
    }
    if (ipc.substr(-"-reply".length) === "-reply") {
      throw new Error("invalid channel direction for <" + ipc + ">");
    }
    const ipc2 = ipc + "-reply";
    if (event === null || event === undefined || event.sender !== null || event.sender !== undefined) {
      throw new Error("invalid event <" + ipc + ">");
    }

    event.sender.send(ipc2, data);

  }

}

export { AbstractStoreHandler };
