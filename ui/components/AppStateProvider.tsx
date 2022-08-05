import qs from "query-string";
import * as React from "react";
import { useLocation } from "react-router";
import { Clusters, Context } from "../lib/rpc/clusters";
import { AllNamespacesOption } from "../lib/types";

export type AppContextType = {
  contexts: Context[];
  namespaces: { [context: string]: string[] };
  currentContext: string;
  currentNamespace: string;
  appState: AppState;
  setContexts: (contexts: Context[]) => void;
  setNamespaces: (namespaces: string[]) => void;
  setCurrentNamespace: (namespace: string) => void;
  doAsyncError: (message: string, fatal?: boolean, detail?: Error) => void;
  clustersClient: Clusters;
};

export const AppContext = React.createContext<AppContextType>(null as any);

type AppState = {
  error: null | { fatal: boolean; message: string; detail?: string };
  loading: boolean;
};

export default function AppStateProvider({ clustersClient, ...props }) {
  const location = useLocation();
  const { context } = qs.parse(location.search);
  const [contexts, setContexts] = React.useState([]);
  const [namespaces, setNamespaces] = React.useState({});
  const [currentNamespace, setCurrentNamespace] = React.useState(AllNamespacesOption);
  const [appState, setAppState] = React.useState({
    error: null,
    loading: false,
  });

  const doAsyncError = (message: string, fatal: boolean, detail?: Error) => {
    console.error(message);
    setAppState({
      ...(appState as AppState),
      error: { message, fatal, detail },
    });
  };

  const query = qs.parse(location.search);

  const getNamespaces = (ctx) => {
    clustersClient.listNamespacesForContext({ contextname: ctx }).then(
      (nsRes) => {
        const nextNamespaces = nsRes.namespaces;

        nextNamespaces.unshift(AllNamespacesOption);

        setNamespaces({
          ...namespaces,
          ...{
            [ctx as string]: nextNamespaces,
          },
        });
      },
      (err) => {
        doAsyncError(
          "There was an error fetching namespaces",
          true,
          err.message
        );
      }
    );
  };

  React.useEffect(() => {
    // Runs once on app startup.
    clustersClient.listContexts({}).then(
      (res) => {
        setContexts(res.contexts);
        const ns = query.namespace || AllNamespacesOption;
        setCurrentNamespace(ns as string);
      },
      (err) => {
        doAsyncError("Error getting contexts", true, err);
      }
    );
  }, []);

  React.useEffect(() => {
    // Get namespaces whenever context changes
    getNamespaces(context);
  }, [context]);

  React.useEffect(() => {
    // clear the error state on navigation
    setAppState({
      ...appState,
      error: null,
    });
  }, [context, currentNamespace, location]);

  React.useEffect(() => {
    setCurrentNamespace(query.namespace as string);
  }, [location]);

  const value: AppContextType = {
    contexts,
    namespaces,
    currentContext: context as string,
    currentNamespace,
    appState,
    setContexts,
    setNamespaces,
    setCurrentNamespace,
    doAsyncError,
    clustersClient,
  };

  return <AppContext.Provider value={value} {...props} />;
}
