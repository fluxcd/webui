import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";

import App from "./App.tsx";

const history = createBrowserHistory();

ReactDOM.render(<App history={history} />, document.getElementById("app"));

if (module.hot) {
  module.hot.accept();
}
