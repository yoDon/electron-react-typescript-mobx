import { useStrict } from "mobx";
import { Provider } from "mobx-react";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { HashRouter, Route } from "react-router-dom";
import CounterPage from "../../_shared/components/CounterPage";
import StoreRoot from "../../_shared/stores/StoreRoot";
import HomePage from "../components/HomePage";
import HybridAppPage from "../components/HybridAppPage";
import WebViewPage from "../components/WebViewPage";

import "./app.global.scss";

useStrict(true);

const stores = new StoreRoot();

ReactDOM.render(
    <Provider appState={stores}>
        <HashRouter>
            <div>
                <Route exact={true} path="/counter" component={CounterPage} />
                <Route exact={true} path="/webview" component={WebViewPage} />
                <Route exact={true} path="/hybrid" component={HybridAppPage} />
                <Route exact={true} path="/" component={HomePage} />
            </div>
        </HashRouter>
    </Provider>,
    document.getElementById("Content"),
);
