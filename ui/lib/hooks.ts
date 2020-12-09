import { useContext, useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import queryString from "query-string";

import { AppContext } from "../components/AppStateProvider";
import { Context, DefaultClusters, Kustomization } from "./rpc/clusters";
import { normalizePath, wrappedFetch } from "./util";

const clusters = new DefaultClusters("/api/clusters", wrappedFetch);

export function useKubernetesContexts(): {
  contexts: Context[];
  currentContext: string;
  setCurrentContext: (context: string) => void;
} {
  const location = useLocation();
  const {
    contexts,
    currentContext,
    setContexts,
    setCurrentContext,
  } = useContext(AppContext);

  useEffect(() => {
    clusters
      .listContexts({})
      .then((res) => {
        const [pathContext] = normalizePath(location.pathname);
        setContexts(res.contexts);
        // If there is a context in the path, use that, else use the one set
        // in the .kubeconfig file returned by the backend.
        setCurrentContext(pathContext || res.currentcontext);
      })
      .catch((e) => console.error(e));
  }, []);

  return {
    contexts,
    currentContext,
    setCurrentContext,
  };
}

export function useKustomizations(currentContext: string): Kustomization[] {
  const [kustomizations, setKustomizations] = useState([]);

  useEffect(() => {
    if (!currentContext) {
      return;
    }
    clusters
      .listKustomizations({ contextname: currentContext })
      .then((res) => setKustomizations(res.kustomizations))
      .catch((e) => console.error(e));
  }, [currentContext]);

  return kustomizations;
}
