import * as React from "react";
import { Link } from "react-router-dom";

import * as styles from "./styles.scss";

class SiteHomePage extends React.Component {
  public render() {
    return (
      <div className={styles.container}>
        <h2>Webpage</h2>
        <ol>
          <li><Link to="/counter">Counter</Link></li>
        </ol>
      </div>
    );
  }
}

export { SiteHomePage };
