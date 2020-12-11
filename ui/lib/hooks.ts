import { useState, useEffect } from "react";
import { Context, DefaultClusters } from "./rpc/clusters";
import { wrappedFetch } from "./util";

const clusters = new DefaultClusters("/api/clusters", wrappedFetch);

export function useKubernetesContexts(): Context[] {
  const [contexts, setContexts] = useState([]);

  useEffect(() => {
    clusters
      .listContexts({})
      .then((res) => {
        setContexts(res.contexts);
      })

      .catch((e) => console.error(e));
  }, []);

  return contexts;
}
