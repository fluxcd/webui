import _ from "lodash";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../components/AppStateProvider";
import { Kustomization, SyncKustomizationRes } from "../rpc/clusters";
import { clustersClient, notifyError, notifySuccess } from "../util";
import { formatAPINamespace } from "./app";

type KustomizationList = { [name: string]: Kustomization };

export function useKustomizations(
  currentContext: string,
  currentNamespace: string
) {
  const [loading, setLoading] = useState(true);
  const { doAsyncError } = useContext(AppContext);
  const [kustomizations, setKustomizations] = useState({} as KustomizationList);

  useEffect(() => {
    if (!currentContext) {
      return;
    }

    setLoading(true);
    setKustomizations({});

    clustersClient
      .listKustomizations({
        contextname: currentContext,
        namespace: formatAPINamespace(currentNamespace),
      })
      .then((res) => {
        const r = _.keyBy(res.kustomizations, "name");
        setKustomizations(r);
      })
      .catch((err) => {
        doAsyncError(
          "There was an error fetching kustomizations",
          true,
          err.message
        );
      })
      .finally(() => setLoading(false));
  }, [currentContext, currentNamespace]);

  const syncKustomization = (k: Kustomization) =>
    clustersClient
      .syncKustomization({
        contextname: currentContext,
        namespace: k.namespace,
        withsource: false,
        kustomizationname: k.name,
      })
      .then((res: SyncKustomizationRes) => {
        setKustomizations({
          ...kustomizations,
          [k.name]: res.kustomization,
        });
        notifySuccess("Sync successful");
      })
      .catch((err) => notifyError(err.message));

  return { kustomizations, syncKustomization, loading };
}
