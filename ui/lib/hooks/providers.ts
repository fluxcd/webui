import _ from "lodash";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../components/AppStateProvider";
import {
  Provider,
  UnstructuredObject,
} from "../rpc/clusters";
import { formatAPINamespace } from "./app";

type ProviderList = { [name: string]: Provider };

export type UnstructuredObjectWithParent = UnstructuredObject & {
  parentUid?: string;
};

export function useProviders(
  currentContext: string,
  currentNamespace: string
) {
  const [loading, setLoading] = useState(true);
  const { doAsyncError, clustersClient } = useContext(AppContext);
  const [providers, setProviders] = useState({} as ProviderList);

  useEffect(() => {
    if (!currentContext) {
      return;
    }

    setLoading(true);
    setProviders({});

    clustersClient
      .listProviders({
        contextname: currentContext,
        namespace: formatAPINamespace(currentNamespace),
      })
      .then((res) => {
        const r = _.keyBy(res.providers, "name");
        setProviders(r);
      })
      .catch((err) => {
        doAsyncError(
          "There was an error fetching providers",
          true,
          err.message
        );
      })
      .finally(() => setLoading(false));
  }, [currentContext, currentNamespace]);

  return {
    providers,
    loading,
  };
}
