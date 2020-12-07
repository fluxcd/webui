import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

type Props = {
  className?: string;
};

export default function App() {
  const [status, setStatus] = React.useState("");
  React.useEffect(() => {
    fetch("/api/")
      .then((res) => res.json())
      .then((args) => setStatus(args))
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
