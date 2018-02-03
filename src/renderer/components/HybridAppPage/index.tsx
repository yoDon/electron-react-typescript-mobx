import { inject, observer } from "mobx-react";
import * as React from "react";
import * as ElectronWebView from "react-electron-web-view/lib/ElectronWebView";
import { Link } from "react-router-dom";
import { StoreRoot } from "../../../shared/stores/StoreRoot";

import * as styles from "./styles.scss";

// We want nodeEnv to contain either "production" or "development"
// "development" means running in a local server with files loaded from project not from asar
const nodeEnv = (process.env.NODE_ENV === undefined) ? "production" : process.env.NODE_ENV;

//
// NOTE: the WebView tag only accepts the file: protocol for the preload script
//       so the preload.js file must be included in the app as a resource
//
const preloadScript = ((window as any).isInElectronRenderer === false)
                    ? ""
                    : (nodeEnv === "development")
                    ? `file://${(window as any).nodeRequire("electron").remote.app.getAppPath() + "../../../../../../../../../../static/preload.js"}`
                    : `file://${(window as any).nodeRequire("electron").remote.app.getAppPath() + "/static/preload.js"}`;

//
// Note: you can set the WebView src attribute to ./index.html to just load the local bundled
//       src/site into the app as a WebView (handy for testing if stuff works) or to
//       "https://yodon.github.io/electron-react-typescript-mobx/sample"
//       to pull in a built version of the sample site in this example code
//       (but that page might not be entirely up to date with the main repo
//       since we don"t currently have any automated build hooks to make sure
//       they are in sync)
//
const electronWebViewSrc = "./index.html";
// const electronWebViewSrc = "https://yodon.github.io/electron-react-typescript-mobx/sample

@inject("appState")
@observer
class HybridAppPage extends React.Component<{appState:StoreRoot}, {}> {

  private mElement:any;

  public componentDidMount() {
    this.mElement = this.getWebView();
    if (this.mElement !== null && this.mElement !== undefined) {
      this.mElement.addEventListener("dom-ready", () => {
        this.props.appState.hybridWebView.registerWebViewForIpc(this.mElement);
        this.props.appState.counter.registerWebViewForIpc(this.mElement);
        this.props.appState.hybridWebView.menuForWebView(true);
      });
    }
  }

  public componentWillUnmount() {
    this.props.appState.hybridWebView.unregisterWebViewForIpc(this.mElement);
    this.props.appState.counter.unregisterWebViewForIpc(this.mElement);
    this.props.appState.hybridWebView.menuForWebView(false);
  }

  public render() {
    if ((window as any).isInElectronRenderer === false) {
      return (
        <div>
          <h2>WebView is only available directly in Electron</h2>
          <div className={styles.backButton}>
          <br/>
            <Link to="/">
             <i className="fa fa-arrow-left fa-3x"/>
            </Link>
          </div>
        </div>
      );
    }
    return (
      <div>
        <div className={styles.backButton}>
          <Link to="/" style={{ marginRight:"60px" }}>
            <i className="fa fa-arrow-left fa-3x"/>
          </Link>
          <button
            className="btn btn.main"
            style={{ margin:"15px", backgroundColor:"coral" }}
            onClick={this.openDevTools}
          >
            Open inner dev tools
          </button>
          <button
            className="btn btn.main"
            style={{ margin:"15px", backgroundColor:"coral" }}
            onClick={this.innerBack}
          >
           Inner back back button
          </button>
          <button
            className="btn btn.main"
            style={{ margin:"15px", backgroundColor:"coral" }}
            onClick={this.plus}
          >
            Plus
          </button>
          <button
            className="btn btn.main"
            style={{ margin:"15px", backgroundColor:"coral" }}
            onClick={this.minus}
          >
            Minus
          </button>
        </div>
        <ElectronWebView
          src={electronWebViewSrc}
          preload={preloadScript}
          className={styles.webView}
        />
        <div style={{ margin:"15px" }}>
          Counter: <b>{this.props.appState.counter.value}</b>
        </div>
        <div style={{ margin:"15px" }}>
          You can also load the contained page (https://yodon.github.io/electron-react-typescript-mobx/sample)
          in your browser where it does not have access to the Electron API. In that case the
          contained code will use "local state" maintained in JS rather than "electron state"
          maintained by the main process
        </div>
      </div>
    );
  }

  private getWebView = () => {
    return (document.getElementsByClassName(styles.webView) as any)[0];
  }

  private openDevTools = () => {
    this.mElement.openDevTools();
  }

  private innerBack = () => {
    if (this.mElement.canGoBack()) {
      this.mElement.goBack();
    }
  }

  private plus = () => {
    this.props.appState.counter.increment();
  }

  private minus = () => {
    this.props.appState.counter.decrement();
  }

}

export { HybridAppPage };
