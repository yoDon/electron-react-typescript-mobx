import { action, autorun, observable } from "mobx";
import { AbstractStore } from "./AbstractStore";

class CounterStore extends AbstractStore {

  @observable public value = 0;

  constructor() {
    super();
    if (this.isInElectronRenderer) {
      //
      // Electron Renderer, so only register for r2m-*-reply's and w2r-*'s here
      //
      this.onR2mReply("r2m-counter-delta", (ipc:string, event:any, arg:number) => {
        this.handleCounterValueReply(arg);
      });
    } else if (this.isInHybridWebView) {
      //
      // Hybrid Web View, so only register for w2r-*-reply's here
      //
      this.onW2rReply("w2r-counter", (ipc:string, event:any, arg:number) => {
        this.handleCounterValueReply(arg);
      });
    } else {
      //
      // no electron access - presumably loaded as a conventional
      // web page in a conventional browser
      //
    }
  }

  public unregisterWebViewForIpc(element:any) {
    if (this.unregisterWebViewForIpcBase(element)) {
      // optionally do additional cleanup
    }
  }

  public registerWebViewForIpc(element:any) {
    if (this.registerWebViewForIpcBase(element, "counter")) {
      this.onW2r("w2r-counter-delta", (ipc:string, event:any, arg:any) => {
        // Relay the update from the web view to the main process
        this.sendR2m("r2m-counter-delta", arg);
      });
      //
      // Automatically relay renderer state changes to the webview
      //
      this.mDisposers.push(autorun(() => {
        this.sendW2rReply("w2r-counter", this.value);
      }));
      //
      // Initialize WebView store
      //
      this.sendW2rReply("w2r-counter", this.value);
    }
  }

  @action public change(value:number) {
    if (this.isInElectronRenderer) {
      this.sendR2m("r2m-counter-delta", { delta:value });
    } else if (this.isInHybridWebView) {
      this.sendW2r("w2r-counter-delta", { delta:value });
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

  @action public handleCounterValueReply(arg:number) {
    this.value = arg;
  }

}

export { CounterStore };
