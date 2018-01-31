import { AbstractStore } from "./AbstractStore";

class HybridWebViewStore extends AbstractStore {

  public constructor() {
    super();
    if (this.isInElectronRenderer) {
      //
      // Electron Renderer, so only register for r2m-*-reply's and w2r-*'s here
      //
      this.onR2mReply("r2m-open-dev-tools-webview", (ipc:string, event:any, arg:any) => {
        this.openDevToolsWebView();
      });
      this.onR2mReply("r2m-browser-back-webview", (ipc:string, event:any, arg:any) => {
        this.browserBackWebView();
      });
    }
  }

  public unregisterWebViewForIpc(element:any) {
    if (this.unregisterWebViewForIpcBase(element)) {
      // optionally do additional cleanup
    }
  }

  public registerWebViewForIpc(element:any) {
    if (this.registerWebViewForIpcBase(element, "hybridwebview")) {
      // Uncomment next line to automatically open the devTools window after the content loads
      // this.mElement.openDevTools();
    }
  }

  public menuForWebView(hasWebView:boolean) {
    this.sendR2m("r2m-menu-for-webview", hasWebView);
  }

  public openDevToolsWebView() {
    if (this.mElement) {
      this.mElement.openDevTools();
    }
  }

  public browserBackWebView() {
    if (this.mElement) {
      if (this.mElement.canGoBack()) {
        this.mElement.goBack();
      }
    }
  }

}

export { HybridWebViewStore };
