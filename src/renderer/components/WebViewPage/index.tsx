import * as React from "react";
import * as ElectronWebView from "react-electron-web-view/lib/ElectronWebView";
import { Link } from "react-router-dom";

import * as styles from "./styles.scss";

class WebViewPage extends React.Component {

  public render() {
    if ((window as any).isInElectronRenderer) {
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
          </div>
          <ElectronWebView src="http://xkcd.com" className={styles.webView} />
        </div>
      );
    }
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

  private openDevTools = () => {
    (document.getElementsByClassName(styles.webView) as any)[0].openDevTools();
  }

  private innerBack = () => {
    if ((document.getElementsByClassName(styles.webView) as any)[0].canGoBack()) {
      (document.getElementsByClassName(styles.webView) as any)[0].goBack();
    }
  }

}

export { WebViewPage };
