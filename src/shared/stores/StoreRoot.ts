import { CounterStore } from "./Counter";
import { HybridWebViewStore } from "./HybridWebViewStore";

class StoreRoot {
  //
  // Following the MobX best practices documentation,
  // https://mobx.js.org/best/store.html use a root store
  // to provide support breaking the application state into
  // multiple child stores
  //
  public hybridWebView = new HybridWebViewStore();
  public counter = new CounterStore();
}

export { StoreRoot };
