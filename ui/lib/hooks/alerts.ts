import _ from "lodash";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../components/AppStateProvider";
import {
  Alert,
  UnstructuredObject,
} from "../rpc/clusters";
import { formatAPINamespace } from "./app";

type AlertList = { [name: string]: Alert };

export type UnstructuredObjectWithParent = UnstructuredObject & {
  parentUid?: string;
};

export function useAlerts(
  currentContext: string,
  currentNamespace: string
) {
  const [loading, setLoading] = useState(true);
  const { doAsyncError, clustersClient } = useContext(AppContext);
  const [alerts, setAlerts] = useState({} as AlertList);

  useEffect(() => {
    if (!currentContext) {
      return;
    }

    setLoading(true);
    setAlerts({});

    clustersClient
      .listAlerts({
        contextname: currentContext,
        namespace: formatAPINamespace(currentNamespace),
      })
      .then((res) => {
        const r = _.keyBy(res.alerts, "name");
        setAlerts(r);
      })
      .catch((err) => {
        doAsyncError(
          "There was an error fetching alerts",
          true,
          err.message
        );
      })
      .finally(() => setLoading(false));
  }, [currentContext, currentNamespace]);

  return {
    alerts,
    loading,
  };
}
