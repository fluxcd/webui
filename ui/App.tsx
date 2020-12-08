import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { DefaultClusters } from "./lib/rpc/clusters";

type Props = {
  className?: string;
};

const wrappedFetch = (url, opts: RequestInit = {}) => {
  return fetch(url, {
    ...opts,
    credentials: "same-origin",
    headers: {
      "content-type": "application/json",
      ...(opts.headers || {}),
    },
  });
};

export default function App() {
  const [status, setStatus] = React.useState("");
  React.useEffect(() => {
    const client = new DefaultClusters("/api/clusters", wrappedFetch);

    client
      .listContexts({})
      .then((res) => {
        setStatus(res);
      })

      .catch((e) => console.error(e));
  }, []);
  return (
    <div>
      <Router>
        <Switch>
          <Route
            exact
            path="/"
            component={() => (
              <div>
                <p>Hello!!!!!</p>
                API response:
                <pre>{JSON.stringify(status, null, 2)}</pre>
              </div>
            )}
          />
          <Route exact path="*" component={() => <p>404</p>} />
        </Switch>
      </Router>
    </div>
  );
}
