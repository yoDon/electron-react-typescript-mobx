import { CounterHandler } from "./CounterHandler";
import { HybridWebViewHandler } from "./HybridWebViewHandler";

class RootHandler {
  public counter = new CounterHandler();
  public hybridWebView = new HybridWebViewHandler();

  public register() {
    this.counter.register();
    this.hybridWebView.register();
  }
}

export { RootHandler };
