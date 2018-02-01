import { useStrict } from "mobx";
import { Provider } from "mobx-react";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { HashRouter, Route } from "react-router-dom";
import { CounterPage } from "../../shared/components/CounterPage";
import { StoreRoot } from "../../shared/stores/StoreRoot";
import { SiteHomePage } from "../components/SiteHomePage";

import "../../shared/app/app.global.scss";

useStrict(true);

const stores = new StoreRoot();

ReactDOM.render(
    <Provider appState={stores}>
        <HashRouter>
            <div>
                <Route exact={true} path="/counter" component={CounterPage} />
                <Route exact={true} path="/" component={SiteHomePage} />
            </div>
        </HashRouter>
    </Provider>,
    document.getElementById("Content"),
);
