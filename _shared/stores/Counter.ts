import { action, autorun, observable } from "mobx";

//
// This is configured to talk to the Electron backend store via ipcRenderer
// (when loaded in Electron) or to talk over ipcRendererStub to the Electron
// host renderer (when loaded as a hybrid web page in an Electron WebView)
// or to run locally if no backend is available. See the definition of ipcRendererStub
// in preload.js for more info on the specific set of whitelisted paths and functions
// supported by ipcRendererStub.
//

const ipcRenderer = ((window as any).isElectronRenderer) ? (window as any).nodeRequire("electron").ipcRenderer : (window as any).ipcRendererStub;

class CounterStore {

  public isElectronRenderer:boolean = (window as any).isElectronRenderer;
  public isInHybridWebView:boolean = ((window as any).isElectronRenderer === false && ipcRenderer !== undefined && ipcRenderer !== null);
  public hasElectronAccess:boolean = (ipcRenderer !== undefined && ipcRenderer !== null);
  @observable public value = 0;
  private mDisposers = [] as Array<() => void>;
  private mElement = null as any;

  constructor() {
    if (this.isElectronRenderer) {
      //
      // Electron Renderer, so only register for r2m-*-reply's and w2r-*'s here
      //
      ipcRenderer.on("r2m-counter-delta-reply", (event:any, arg:number) => {
        this.setReply(arg);
      });
      ipcRenderer.on("r2m-open-dev-tools-webview-reply", (event:any, arg:any) => {
        this.openDevToolsWebView();
      });
      ipcRenderer.on("r2m-browser-back-webview-reply", (event:any, arg:any) => {
        this.browserBackWebView();
      });
      ipcRenderer.on("w2r-counter-delta", (event:any, arg:any) => {
        ipcRenderer.send("r2m-counter-delta", arg);
      });
      //
      // Electron Renderer initiated initializer calls
      //
      ipcRenderer.send("r2m-menu-for-webview");
    } else if (this.isInHybridWebView) {
      //
      // Hybrid Web View, so only register for w2r-*-reply's here
      //
      ipcRenderer.on("w2r-counter-delta-reply", (event:any, arg:number) => {
        this.setReply(arg);
      });
      //
      // Hybrid Web View initiated initializer calls
      //
    } else {
      // alert("no electron access - presumably loaded as a conventional web page in a conventional browser");
    }
  }

  public unregisterWebView(element:any) {
    if (this.isElectronRenderer) {
      this.mDisposers.forEach((disposer) => {
        disposer();
      });
    }
  }

  public registerWebView(element:any) {
    if (element !== null && element !== undefined) {
      element.addEventListener("dom-ready", this.registerWebView_Impl.bind(this, element));
    }
  }

  @action public change(value:number) {
    if (this.isElectronRenderer) {
      ipcRenderer.send("r2m-counter-delta", { delta:value });
    } else if (this.isInHybridWebView) {
      ipcRenderer.sendToHost("w2r-counter-delta", { delta:value });
    } else {
      //
      // manage the state locally without talking to the Electron backend,
      // because there is no backend to talk to
      //
      this.value += value;
    }
  }

  @action public increment() {
    this.change(1);
  }

  @action public decrement() {
    this.change(-1);
  }

  @action public setReply(arg:number) {
    this.value = arg;
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

  private registerWebView_Impl(element:any) {
    if (this.isElectronRenderer) {
      this.mElement = element;
      if (this.mElement.getAttribute("webviewlistener") !== "true") {
        this.mElement.setAttribute("webviewlistener", "true");
        //
        // NOTE: By convention this app only allows loaded pages to register
        //       and call routes starting with "w2r-", so that all messages
        //       from the webview can be inspected and approved by this electron
        //       renderer process before passing them on to the electron backend
        //       process. It"s important that untrusted websites and web content
        //       not be granted full access to the electron API in order to
        //       protect the user"s PC from potentially malicious web content.
        //
        this.mElement.addEventListener("ipc-message", (event:any) => {
          const key = event.channel as string;
          switch (key) {
          case "w2r-counter-delta": this.change(event.args[0].delta as number); break;
          }
        });
        //
        // Relay state updates to the webview
        //
        this.mDisposers.push(autorun(() => {
          this.mElement.send("w2r-counter-delta-reply", this.value);
        }));
        //
        // Initialize
        //
        this.mElement.send("w2r-counter-delta-reply", this.value);
        // Uncomment next line to automatically open the devTools window after the content loads
        // element.openDevTools();
      }
    }
  }

}

export default CounterStore;
