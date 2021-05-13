import qs from "query-string";
import * as React from "react";
import { DefaultClusters } from "../lib/rpc/clusters";
import { AllNamespacesOption } from "../lib/types";
import { wrappedFetch } from "../lib/util";

export const AppContext = React.createContext(null as any);

type AppState = {
  error: null | { fatal: boolean; message: string; detail?: string };
  loading: true;
};

const clusters = new DefaultClusters("/api/clusters", wrappedFetch);

export default function AppStateProvider(props) {
  const { context } = qs.parse(location.search);
  const [contexts, setContexts] = React.useState([]);
  const [currentContext, setCurrentContext] = React.useState<string>(
    context as string
  );
  const [namespaces, setNamespaces] = React.useState({});
  const [currentNamespace, setCurrentNamespace] = React.useState(
    AllNamespacesOption
  );
  const [appState, setAppState] = React.useState({ error: null });

  const doError = (message: string, fatal: boolean, detail?: Error) => {
    console.error(message);
    console.error(detail);
    setAppState({
      ...(appState as AppState),
      error: { message, fatal, detail },
    });
  };

  const query = qs.parse(location.pathname);

  React.useEffect(() => {
    // Runs once on app startup.
    clusters.listContexts({}).then(
      (res) => {
        setContexts(res.contexts);
        // If there is a context in the path, use that, else use the one set
        // in the .kubeconfig file returned by the backend.
        const nextCtx = (query.context as string) || res.currentcontext;
        const ns = query.namespace || AllNamespacesOption;

        setCurrentContext(nextCtx);
        setCurrentNamespace(ns as string);
      },
      (err) => {
        doError("Error getting contexts", true, err);
      }
    );
  }, []);

  React.useEffect(() => {
    clusters.listNamespacesForContext({ contextname: currentContext }).then(
      (nsRes) => {
        const nextNamespaces = nsRes.namespaces;

        nextNamespaces.unshift(AllNamespacesOption);

        setNamespaces({
          ...namespaces,
          ...{
            [currentContext]: nextNamespaces,
          },
        });
      },
      (err) => {
        doError("There was an error fetching namespaces", true, err.message);
      }
    );
  }, [currentContext]);

  const value = {
    contexts,
    namespaces,
    currentContext,
    currentNamespace,
    appState,
    setContexts,
    setCurrentContext,
    setNamespaces,
    setCurrentNamespace,
    doError,
  };

  return <AppContext.Provider value={value} {...props} />;
}
